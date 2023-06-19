---
title: 'エフェクトを使って同期を行う'
---

<Intro>

一部のコンポーネントは外部システムと同期を行う必要があります。例えば、React の state に基づいて非 React 製コンポーネントを制御したり、サーバとの接続を確立したり、コンポーネントが画面に表示されたときに分析用のログを送信したりしたいかもしれません。*エフェクト (Effect)* を使うことで、レンダー後にコードを実行して、React 外のシステムとコンポーネントを同期させることができます。

</Intro>

<YouWillLearn>

- エフェクトとは何か
- エフェクトとイベントの違い
- コンポーネントでエフェクトを宣言する方法
- 不要なエフェクト再実行をスキップする方法
- 開発中にエフェクトが 2 回実行される理由と対処法

</YouWillLearn>

## エフェクトとは何であり、イベントとどう異なるのか {/*what-are-effects-and-how-are-they-different-from-events*/}

エフェクトについて説明する前に、React コンポーネント内の 2 種類のロジックについて理解しておく必要があります。

- **レンダーコード**（[UI の記述](/learn/describing-the-ui)で説明）とは、コンポーネントのトップレベルにあるものです。ここは、props や state を受け取り、それらを変換し、画面に表示したい JSX を返す場所です。[レンダーコードは純粋でなければなりません](/learn/keeping-components-pure)。数学の式のように結果を*計算*するだけで、他のことは行わないようにする必要があります。

- **イベントハンドラ**（[インタラクティビティの追加](/learn/adding-interactivity)で説明）とは、コンポーネント内にネストされた関数であり、計算だけでなく何かを*実行*するものです。イベントハンドラは、入力フィールドを更新したり、商品を購入するための HTTP POST リクエストを送信したり、ユーザを別の画面に遷移させたりすることができます。イベントハンドラには、特定のユーザアクション（例えば、ボタンクリックや入力）によって引き起こされてプログラムの状態を変更する、["副作用 (side effect)"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) が含まれています。

しかし、これらだけでは十分でない場合があります。画面に表示されている間、常にチャットサーバに接続していなければならない `ChatRoom` コンポーネントを考えてみてください。サーバへの接続は純粋な計算ではない（副作用がある）ため、レンダー中には行うことができません。しかし、`ChatRoom` が表示される原因となる、クリックのような特定のイベントは存在しません。

***エフェクト*は、特定のイベントによってではなく、レンダー自体によって引き起こされる副作用を指定するためのものです**。チャットでのメッセージ送信は、ユーザが特定のボタンをクリックすることによって直接引き起こされるため、*イベント*です。しかし、サーバ接続のセットアップは、コンポーネントが表示される原因となるインタラクションに関係なく行われるべきであるため、*エフェクト*です。エフェクトは、[コミット](/learn/render-and-commit)の最後に、画面が更新された後に実行されます。ここが、React コンポーネントを外部システム（ネットワークやサードパーティのライブラリなど）と同期させるのに適したタイミングです。

<Note>

このドキュメントの残りの部分では、"エフェクト"（大文字で始まる "Effect"）とは、上記の React 固有の定義、つまりレンダーによって引き起こされる副作用のことを指します。より広いプログラミング概念を指す場合は "副作用 (side effect)" と呼ぶことにします。

</Note>


## エフェクトはおそらく不要なもの {/*you-might-not-need-an-effect*/}

**慌ててエフェクトをコンポーネントに追加しないようにしましょう**。エフェクトは通常、React のコードから「踏み出して」、何らかの*外部*システムと同期するために使用されるものだということを肝に銘じてください。これには、ブラウザ API、サードパーティのウィジェット、ネットワークなどが含まれます。エフェクトが他の state に基づいて state を調整しているだけの場合、[おそらくそのエフェクトは必要ありません](/learn/you-might-not-need-an-effect)。

## エフェクトの書き方 {/*how-to-write-an-effect*/}

エフェクトを書くには、以下の 3 つのステップに従ってください。

1. **エフェクトを宣言する**。デフォルトでは、エフェクトはすべてのレンダー後に実行されます。
2. **エフェクトの依存値 (dependency) の配列を指定する**。ほとんどのエフェクトは、レンダー後に毎回ではなく、*必要に応じて*再実行されるべきものです。例えば、フェードインアニメーションの開始は、コンポーネントが表示されるときにのみ行われるべきです。チャットルームへの接続と切断は、コンポーネントが表示されたり消えたりするときや、チャットルームが変更されたときにのみ行われるべきです。*依存配列*を指定してこれをコントロールする方法について、後で説明します。
3. **必要に応じてクリーンアップを追加する**。一部のエフェクトは、行っていたことを停止、元に戻す、またはクリーンアップする方法を指定する必要があります。例えば、「接続」には「切断」が必要で、「登録」には「解除」が必要で、「取得」には「キャンセル」または「無視」が必要です。*クリーンアップ関数*を返すことで、これを行う方法を学びます。

それぞれのステップを詳しく見ていきましょう。

### ステップ 1：エフェクトを宣言する {/*step-1-declare-an-effect*/}

コンポーネントでエフェクトを宣言するには、React から [`useEffect` フック](/reference/react/useEffect)をインポートします。

```js
import { useEffect } from 'react';
```

次に、コンポーネントのトップレベルでそれを呼び出し、エフェクト内にコードを記述します。

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Code here will run after *every* render
  });
  return <div />;
}
```

コンポーネントがレンダーされるたびに、React は画面を更新し、*その後で* `useEffect` 内のコードを実行します。言い換えると、**`useEffect` はレンダー結果が画面に反映され終わるまで、コードの実行を「遅らせ」ます**。

エフェクトを使って外部システムと同期する方法を見てみましょう。`<VideoPlayer>` という React コンポーネントを考えてみてください。props として `isPlaying` を渡すことで、再生中か一時停止中かを制御できると便利です。

```js
<VideoPlayer isPlaying={isPlaying} />;
```

カスタム `VideoPlayer` コンポーネントは、ブラウザ組み込みの [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) タグをレンダーします。

```js
function VideoPlayer({ src, isPlaying }) {
  // TODO: do something with isPlaying
  return <video src={src} />;
}
```

しかしブラウザの `<video>` タグに `isPlaying` プロパティはありません。ビデオを制御する唯一の方法は、DOM 要素上で [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) および [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) メソッドを手動で呼び出すことです。**ビデオが現在再生中であるべきかどうかを示す props である `isPlaying` の値を、`play()` や `pause()` などの呼び出しと同期させる必要があるわけです**。

まず、`<video>` DOM ノードへの [ref を取得](/learn/manipulating-the-dom-with-refs)する必要があります。

レンダー中に `play()` や `pause()` を呼び出したくなるかもしれませんが、それは正しくありません。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Calling these while rendering isn't allowed.
  } else {
    ref.current.pause(); // Also, this crashes.
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

このコードが正しくない理由は、レンダー中に DOM ノードで何かをしようとしているからです。React では、[レンダーは JSX の純粋な計算](/learn/keeping-components-pure)であるべきであり、DOM の変更のような副作用を含んではいけません。

それに、`VideoPlayer` が初めて呼び出されるとき、その DOM はそもそも存在していません！ React は JSX が返されるまでどんな DOM を作成したいのか分からないのですから、`play()` や `pause()` を呼び出すための DOM ノードはまだ存在していません。

ここでの解決策は、**副作用を `useEffect` でラップして、レンダーの計算処理の外に出すことです**。

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM の更新をエフェクトでラップすることで、React が先にまず画面を更新できるようになります。その後、エフェクトが実行されます。

`VideoPlayer` コンポーネントがレンダーされるとき（初回または再レンダーのいずれでも）、いくつかのことが起こります。まず、React は画面を更新し、正しいプロパティを持つ `<video>` タグが DOM に存在するようにします。次に、React はエフェクトを実行します。最後に、エフェクトは `isPlaying` の値に応じて `play()` または `pause()` を呼び出します。

再生/一時停止を何度か押して、ビデオプレーヤが `isPlaying` の値に同期していることを確認してください。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

この例では、React の state に同期させる「外部システム」とはブラウザのメディア API でした。同様のアプローチを使用して、古い非 React コード（jQuery プラグインなど）を宣言的な React コンポーネントにラップできます。

なおビデオプレーヤの制御は実際にはもっと複雑です。`play()` の呼び出しは失敗することがありますし、ユーザはブラウザ組み込みのコントロールを使って再生や一時停止を行うかもしれません。この例は非常に単純化された不完全なものです。

<Pitfall>

デフォルトでは、エフェクトは*毎回の*レンダーの後に実行されます。このため、次のようなコードは**無限ループを引き起こします**。

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

エフェクトはレンダーの*結果*として実行されます。state の設定はレンダーを*トリガ*します。エフェクトで直ちに state を設定するというのは、電源コンセントを自分自身に接続するようなものです。エフェクトが実行され、state がセットされ、これによって再レンダーが発生し、エフェクトが実行され、再び state がセットされ、これによってまた再レンダーが発生し、という具合に続きます。

エフェクトは通常、コンポーネントを*外部*システムと同期させるのに使います。外部システムがなく、他の state に基づいて state を調整したいだけの場合、[エフェクトは必要ありません](/learn/you-might-not-need-an-effect)。

</Pitfall>

### ステップ 2：エフェクトの依存配列を指定する {/*step-2-specify-the-effect-dependencies*/}

デフォルトでは、エフェクトは*すべての*レンダー後に実行されます。しかし、これが**望ましくない場合があります**。

- 時にはそれが遅いことがあります。外部システムとの同期は常に瞬時に起こるものではないため、必要でない限り行わない方が良いかもしれません。例えば、キーストロークごとにチャットサーバに再接続することは望ましくありません。
- 時にはそれが間違っていることがあります。例えば、キーストロークごとにコンポーネントのフェードインアニメーションを開始したくはありません。アニメーションは、コンポーネントが初めて表示されるときに 1 回だけ再生されるべきです。

問題を示すために、前掲の例に、いくつかの `console.log` 呼び出しと、親コンポーネントの state を更新するテキスト入力フィールドを加えたものを示します。タイピングによってエフェクトが再実行されていることを確認してください。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

`useEffect` の呼び出しの第 2 引数として*依存値*の配列を指定することで、React に**エフェクトの不必要な再実行をスキップ**するように指示できます。まず、上記の例の 14 行目に空の `[]` 配列を追加してください。

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

`React Hook useEffect has a missing dependency: 'isPlaying'` というエラーが表示されるはずです。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, []); // This causes an error

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

問題は、エフェクト内のコードが `isPlaying` プロパティに*依存して*何をすべきかを決定しているにもかかわらず、その依存関係が明示的に宣言されていないことです。この問題を解決するために、依存配列に `isPlaying` を追加してください。

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
```

依存値がすべて宣言されているので、エラーはなくなりました。依存配列として `[isPlaying]` を指定することで、React に `isPlaying` が前回のレンダー時と同じである場合は、エフェクトの再実行をスキップするように指示しています。この変更により、入力欄に入力してもエフェクトは再実行されず、再生/一時停止ボタンを押した場合は再実行されるようになります。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Calling video.play()');
      ref.current.play();
    } else {
      console.log('Calling video.pause()');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

依存配列には複数の依存値を含めることができます。React は、指定したすべての依存値が前回のレンダー時とまったく同じ値である場合に限り、エフェクトの再実行をスキップします。React は、個々の依存値を [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を用いて比較します。詳細については [`useEffect` リファレンス](/reference/react/useEffect#reference)を参照してください。

**依存値は自分で「選ぶ」ようなものではありません**。エフェクト内のコードに基づいて React が期待する配列と、指定した依存配列が合致しない場合、リントエラーが発生します。これにより、コード内の多くのバグを検出することができます。一部のコードを再実行しない場合は、[*エフェクトのコード自体を編集して*、その依存値が「必要」とならないようにします](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)。

<Pitfall>

依存配列がない場合と、*空の* `[]` という依存配列がある場合の挙動は異なります。

```js {3,7,11}
useEffect(() => {
  // 毎回のレンダー後に実行される
});

useEffect(() => {
  // マウント時（コンポーネント出現時）のみ実行される
}, []);

useEffect(() => {
  // マウント時と、a か b の値が前回のレンダーより変わった場合に実行される
}, [a, b]);
```

次のステップで、「マウント」とは何かを詳しく見ていきます。

</Pitfall>

<DeepDive>

#### なぜ ref は依存配列にないのか？ {/*why-was-the-ref-omitted-from-the-dependency-array*/}

このエフェクトでは、`ref` と `isPlaying` の両方が使用されていますが、依存値として宣言されているのは `isPlaying` のみです。

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

これは、`ref` オブジェクトが*毎回同一のもの*だからです。React は、同じ `useRef` コールから[常に同じオブジェクトが返される](/reference/react/useRef#returns)ことを保証しています。これが変更されることはないため、それ自体がエフェクトの再実行を引き起こすことも決してありません。したがって、それを含めるかどうかは問題となりません。ただし含めても問題ありません：

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`useState` によって返される [`set` 関数](/reference/react/useState#setstate)も毎回全く同一のものであるため、依存配列から省略されることがよくあります。ある依存値を省略してもリンタのエラーが出ない場合は、それを行っても安全です。

毎回同一である値を依存配列から省略できるのは、リンタがそのオブジェクトが毎回同一であると「判断できる」場合のみです。例えば、`ref` が親コンポーネントから渡される場合は、依存配列にそれを指定する必要があります。親コンポーネントが常に同じ ref を渡すのか、それとも条件付きで違う ref から 1 つ選んで渡すのか、知ることはできないのですから、これは良いことです。あなたのエフェクトは、どの ref が渡されるかに確かに*依存している*ことになります。

</DeepDive>

### ステップ 3：必要に応じてクリーンアップを追加する {/*step-3-add-cleanup-if-needed*/}

別の例を考えてみましょう。表示されたときにチャットサーバに接続する必要がある `ChatRoom` コンポーネントを作成しているとします。`connect()` および `disconnect()` というメソッドを持つオブジェクトを返す `createConnection()` という API があります。コンポーネントがユーザに表示されている間、接続を維持するにはどうすればよいでしょうか？

まず、エフェクトのロジックを書いてみましょう。

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

再レンダー後に毎回チャットに接続するのは遅いため、依存配列を追加します。

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**エフェクト内のコードは props や state を使用していないため、依存配列は `[]`（空）です。こうすると React に、コンポーネントが「マウント」される、つまり画面に初めて表示されるときにのみこのコードを実行するよう指示することになります**。

このコードを実行してみましょう。

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

このエフェクトはマウント時にのみ実行されるため、コンソールに `"✅ Connecting..."` が 1 回だけ表示されると思うかもしれません。**しかし、コンソールを確認すると、`"✅ Connecting..."` が 2 回表示されているはずです。なぜこれが起こるのでしょうか？**

`ChatRoom` コンポーネントが、さまざまな画面がある大規模なアプリの一部であると想像してみてください。ユーザは `ChatRoom` ページからナビゲーションを始めます。コンポーネントがマウントされ、`connection.connect()` が呼び出されます。次に、ユーザが別の画面、例えば設定ページに移動します。`ChatRoom` コンポーネントがアンマウントされます。最後に、ユーザが戻るボタンをクリックし、`ChatRoom` が再びマウントされます。これにより 2 つ目の接続が設定されます…が、最初の接続は破棄されていません！ ユーザがアプリ内で移動するたびに、接続がどんどん積み重なっていくことになります。

このようなバグは、手動での徹底的なテストがないと見逃しやすいものです。これらをすばやく見つけるために、開発環境では React は、初回マウント直後にすべてのコンポーネントを一度だけ再マウントします。

`"✅ Connecting..."` のログが 2 回表示されることで、実際の問題に気付くことができます。つまり、コンポーネントがアンマウントされたときに接続を閉じるコードがないということです。

この問題を解決するには、エフェクトから*クリーンアップ関数*を返すようにします。

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React は、エフェクトが再度実行される前に毎回クリーンアップ関数を呼び出し、コンポーネントがアンマウントされる（削除される）ときにも最後の 1 回の呼び出しを行います。クリーンアップ関数が実装された場合、どのような動作になるか見てみましょう。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

これで、開発中に 3 つのコンソールログが表示されるようになります。

1. `"✅ Connecting..."`
2. `"❌ Disconnected."`
3. `"✅ Connecting..."`

**これが開発環境での正しい動作です**。コンポーネントを再マウントすることで、React はページを離れて戻ってきてもコードが壊れないことを確認します。切断してからの再接続は、まさに起こるべきことなのです！ クリーンアップがうまく実装されていれば、エフェクトを 1 回だけ実行することと、クリーンアップしてから再度実行することとの間に、ユーザにとって目に見える違いはないはずです。開発中にコードのバグを探るために、接続/切断の呼び出しペアが 1 つ余分にあるだけです。これは正常ですので、消そうとしないでください！

**本番環境では、`"✅ Connecting..."` が 1 回だけ表示されます**。コンポーネントの再マウントは、クリーンアップが必要なエフェクトを見つけるために開発中にのみ行われます。[Strict Mode](/reference/react/StrictMode) を外すことで、開発時専用のこの挙動をオフにすることができますが、オンにしておくことをお勧めします。これにより、上記のような多くのバグを見つけることができます。

## 開発環境で 2 回発生するエフェクトへの正しい対応 {/*how-to-handle-the-effect-firing-twice-in-development*/}

React は、開発中に意図的にコンポーネントを再マウントして、前述の例のようなバグを見つけます。**ここでの正しい質問は「エフェクトを 1 回だけ実行する方法」ではなく「再マウントされても正しく動作するようエフェクトを修正する方法」です**。

通常、答えはクリーンアップ関数を実装することです。クリーンアップ関数は、エフェクトが行っていたことを停止または元に戻すべきです。大事なルールとして、ユーザは（本番環境でのように）エフェクトが一度だけ実行される場合と、（開発環境でのように）*セットアップ → クリーンアップ → セットアップ*と続く場合との違いを、見分けることができないようにするべきです。

ほとんどのエフェクトは、以下の一般的なパターンのいずれかに合致します。

### React 以外のウィジェットを制御する {/*controlling-non-react-widgets*/}

時に、React で書かれていない UI ウィジェットを追加したい場合があります。例えば、ページに地図コンポーネントを追加しようとしているとします。`setZoomLevel()` メソッドがあり、React のコード内の `zoomLevel` という state 変数と同期させたいとします。エフェクトは次のようになります。

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

この場合、クリーンアップは必要ありません。開発環境では React はこのエフェクトを 2 回呼び出しますが、同じ値で `setZoomLevel` を 2 回呼び出しても何も起きません。わずかに遅くはなるかもしれませんが、本番環境では無用に再マウントされることはないので、問題はありません。

API によっては、連続して 2 回呼び出すことができない場合があります。例えば、組み込みの [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) 要素の [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) メソッドは、2 回呼び出すと例外が発生します。クリーンアップ関数を実装し、ダイアログを閉じるようにしてください。

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

開発中、エフェクトは `showModal()` を呼び出し、すぐに `close()` を呼び出し、再び `showModal()` を呼び出します。ユーザに見える動作としては、本番環境で `showModal()` を 1 回だけ呼び出すのと同じになります。

### イベントのリッスン {/*subscribing-to-events*/}

エフェクトが何かをリッスンしている場合、クリーンアップ関数はそれを解除する必要があります。

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

開発環境では、エフェクトは `addEventListener()` を呼び出し、すぐに `removeEventListener()` を呼び出し、同じハンドラで再び `addEventListener()` を呼び出します。そのため、一度にアクティブなリスナは 1 つだけです。ユーザに見える動作としては、本番環境で `addEventListener()` を 1 回だけ呼び出すのと同じになります。

### アニメーションのトリガ {/*triggering-animations*/}

エフェクトが何かをアニメーションで表示する場合、クリーンアップ関数はアニメーションを初期値にリセットする必要があります。

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Trigger the animation
  return () => {
    node.style.opacity = 0; // Reset to the initial value
  };
}, []);
```

開発中は、opacity が `1` にセットされ、次に `0` にセットされ、再び `1` にセットされます。ユーザに見える動作としては、本番環境で直接 `1` に設定される場合と同じになるべきです。トゥイーンに対応したサードパーティのアニメーションライブラリを使用している場合、クリーンアップ関数はタイムラインを初期状態にリセットする必要があります。

### データのフェッチ {/*fetching-data*/}

エフェクトが何かをフェッチ（fetch, 取得）する場合、クリーンアップ関数は、フェッチを[中止する](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)か、その結果を無視する必要があります。

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

すでに発生したネットワークリクエストをなかったことにはできませんが、クリーンアップ関数は、*もはや重要ではなくなった*フェッチがアプリケーションに影響を与え続けないようにする必要があります。`userId` が `'Alice'` から `'Bob'` に変わった場合、クリーンアップは、`'Alice'` のレスポンスが `'Bob'` の後に到着した場合に無視されるようにします。

**開発環境では、ネットワークタブに 2 つのフェッチが表示されます**。これには何の問題もありません。上記のアプローチでは、最初のエフェクトがすぐにクリーンアップされるため、`ignore` 変数のコピーが `true` に設定されます。そのため、余分なリクエストがあっても、`if (!ignore)` チェックのおかげで state に影響を与えません。

**本番環境では、リクエストは 1 回だけになります**。開発環境の 2 つ目のリクエストが気になる場合は、リクエストの重複を排除し、コンポーネント間でレスポンスをキャッシュするソリューションを使用することが最善の方法です。

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

これにより、開発体験が向上するだけでなく、アプリケーションの動作も高速化されます。例えば、ユーザが戻るボタンを押しても、キャッシュされたデータがあるため、再びデータをロードするのを待つ必要がありません。このようなキャッシュを自分で構築することもできますし、エフェクトでの手動フェッチを行う多数のライブラリの選択肢からいずれかを使用することもできます。

<DeepDive>

#### エフェクトでのデータ取得に代わる良い方法は？ {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

特に完全にクライアントサイドのアプリにおいては、エフェクトの中で `fetch` コールを書くことは[データフェッチの一般的な方法](https://www.robinwieruch.de/react-hooks-fetch-data/)です。しかし、これは非常に手作業頼りのアプローチであり、大きな欠点があります。

- **エフェクトはサーバ上では動作しません**。これは、サーバレンダリングされた初期 HTML にはデータのないローディング中という表示のみが含まれてしまうことを意味します。クライアントのコンピュータは、すべての JavaScript をダウンロードし、アプリをレンダーした後になってやっと、今度はデータを読み込む必要もあるということに気付くことになります。これはあまり効率的ではありません。
- **エフェクトで直接データフェッチを行うと、「ネットワークのウォーターフォール（滝）」を作成しやすくなります**。親コンポーネントをレンダーし、それが何かデータをフェッチし、それによって子コンポーネントをレンダーし、今度はそれが何かデータのフェッチを開始する、といった具合です。ネットワークがあまり速くない場合、これはすべてのデータを並行で取得するよりもかなり遅くなります。
- **エフェクト内で直接データフェッチするということはおそらくデータをプリロードもキャッシュもしていないということです**。例えば、コンポーネントがアンマウントされた後に再びマウントされる場合、データを再度取得する必要があります。
- **人にとって書きやすいコードになりません**。[競合状態](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)のようなバグを起こさないように `fetch` コールを書こうとすると、かなりのボイラープレートコードが必要です。

上記の欠点は、マウント時にデータをフェッチするのであれば、React に限らずどのライブラリを使う場合でも当てはまる内容です。ルーティングと同様、データフェッチの実装も上手にやろうとすると一筋縄ではいきません。私たちは以下のアプローチをお勧めします。

- **[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)を使用している場合、組み込みのデータフェッチ機構を使用してください**。モダンな React フレームワークには、効率的で上記の欠点がないデータフェッチ機構が統合されています。
- **それ以外の場合は、クライアントサイドキャッシュの使用や構築を検討してください**。一般的なオープンソースのソリューションには、[React Query](https://react-query.tanstack.com/)、[useSWR](https://swr.vercel.app/)、および [React Router 6.4+](https://beta.reactrouter.com/en/main/start/overview) が含まれます。自分でソリューションを構築することもできます。その場合、エフェクトを内部で使用しつつ、リクエストの重複排除、レスポンスのキャッシュ、ネットワークのウォーターフォールを回避するためのロジック（データのプリロードやルーティング部へのデータ要求の巻き上げ）を追加することになります。

これらのアプローチがどちらも適合しない場合は、引き続きエフェクト内で直接データをフェッチすることができます。

</DeepDive>

### アナリティクスログの送信 {/*sending-analytics*/}

ページ訪問時にアナリティクスイベントを送信する次のコードを考えてみましょう：

```js
useEffect(() => {
  logVisit(url); // Sends a POST request
}, [url]);
```

開発中には、`logVisit` が各 URL ごとに 2 回呼び出されるため、それを修正しようと試みるかもしれません。**このコードはそのままにしておくことをお勧めします**。先の例と同様に、1 度実行することと 2 度実行することとの間に*ユーザに見える*挙動の違いはありません。実用的な観点からは、開発マシンからのログのせいで本番の計測結果がおかしくなることは望まないため、`logVisit` 関数は開発環境では何も行わないはずです。あなたがファイルを保存するたびにコンポーネントは再マウントされるのですから、開発環境において余分な訪問が記録されることはいずれにせよ避けられません。

**本番環境では訪問ログの重複は起こりません**。

送信しているアナリティクスイベントをデバッグするには、アプリを（本番モードで実行される）ステージング環境にデプロイするか、一時的に [Strict Mode](/reference/react/StrictMode) を外して開発環境専用の再マウントチェックを止めることができます。また、エフェクトの代わりにルート変更のイベントハンドラからアナリティクスログを送信することもできます。より正確な分析のために[交差オブザーバ](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)を用いれば、どのコンポーネントがビューポートにありどれだけの時間表示されているかを追跡するのに役立ちます。

### アプリケーション初期化はエフェクトではない {/*not-an-effect-initializing-the-application*/}

アプリケーションの起動時に一度だけ実行されるべきロジックがあります。そのようなものはコンポーネントの外に置くことができます：

```js {2-3}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

これにより、そのようなロジックはブラウザがページを読み込んだ後に一度だけ実行されることが保証されます。

### 商品購入はエフェクトではない {/*not-an-effect-buying-a-product*/}

クリーンアップ関数を書いても、エフェクトを 2 回実行することによるユーザに見える影響を防ぐ方法がないことがあります。例えば、エフェクトが商品の購入のような POST リクエストを送信する場合です：

```js {2-3}
useEffect(() => {
  // 🔴 Wrong: This Effect fires twice in development, exposing a problem in the code.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

同じ商品を 2 度買いたいわけではありません。しかしまさにそれが、そもそもエフェクトにこのロジックを入れてはいけない理由でもあるのです。ユーザが別のページに行ってから戻るボタンを押した場合、どうなるでしょう？ あなたのエフェクトは再び実行されてしまいます。ユーザはページを*訪れる*たびに製品を買いたいわけではなく、*クリック*して購入ボタンを押したときに買いたいのです。

購入はレンダーによって引き起こされるのではなく、特定のユーザ操作によって引き起こされるものです。ユーザがボタンを押したときにのみ実行する必要があります。**エフェクトを削除し、`/api/buy` リクエストを購入ボタンのイベントハンドラに移動してください**。

```js {2-3}
  function handleClick() {
    // ✅ Buying is an event because it is caused by a particular interaction.
    fetch('/api/buy', { method: 'POST' });
  }
```

**これで分かるのは、再マウントでアプリケーションのロジックが壊れるなら、通常それは既存のバグが明らかになったのだということです**。ユーザの視点から見ると、ページを訪れることと、ページを訪れてリンクをクリックして別のページに行ってから戻るボタンを押すこととの間に、違いがあってはいけません。React は、開発環境でコンポーネントを 1 度再マウントすることで、この原則に従っていることを確認します。

## ここまでのまとめ {/*putting-it-all-together*/}

以下のプレイグラウンドは、エフェクトの動作について「感覚を掴む」のに役立ちます。

この例では、[`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) を使用して、エフェクトが実行されてから 3 秒後に入力テキストを含むコンソールログが表示されるようにスケジュールしています。クリーンアップ関数は、保留中のタイムアウトをキャンセルします。まず、「コンポーネントをマウント」ボタンを押してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Unmount' : 'Mount'} the component
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

最初に 3 つのログが表示されます。`Schedule "a" log`、`Cancel "a" log`、そして再び `Schedule "a" log` です。3 秒後には、`a` というログも表示されます。前述のように、スケジュール・キャンセルのペアが 1 回余分に出てくるのは、React が開発中にコンポーネントを一度再マウントして、クリーンアップがうまく実装されていることを確認するためです。

次に、入力欄に `abc` と入力します。十分に早く行えば、`Schedule "ab" log`、`Cancel "ab" log`、`Schedule "abc" log` の順でログが表示されます。**React は常に、次のレンダーのエフェクトの前に、前のレンダーのエフェクトをクリーンアップします**。したがって入力欄に素早く入力しても、同時にスケジュールされるタイムアウトは最大でも 1 つです。入力欄を何度か編集して、コンソールを見て、エフェクトがどのようにクリーンアップされるか、感覚を掴んでください。

入力欄に何か入力してからすぐに "Unmount the component" ボタンを押してみてください。アンマウントによって、最後のレンダーのエフェクトがクリーンアップされることに気付くでしょう。この場合は、最後のタイムアウトが、発火する前にクリアされます。

最後に、上のコンポーネントを編集して、クリーンアップ関数をコメントアウトしてタイムアウトがキャンセルされないようにしてみてください。`abcde` を素早く入力してみてください。3 秒後に何が起こると思いますか？ タイムアウト内の `console.log(text)` は、*最新の* `text`、つまり `abcde` というログを 5 回生成するのでしょうか？ あなたの直観を確かめるため実際に試してみましょう！

3 秒後に、`abcde` ログが 5 回表示されるのではなく、ログが順番に表示される（`a`、`ab`、`abc`、`abcd`、`abcde`）はずです。**各エフェクトは、対応するレンダーからの `text` 値を「キャプチャ」します**。`text` の state が変更されたとしても、`text = 'ab'` だったレンダーからのエフェクトには常に `'ab'` という値が見えることになります。言い換えると、各レンダーからのエフェクトは互いに隔離されています。これがどのように動作するか興味がある場合は、[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)について学びましょう。

<DeepDive>

#### 個々のレンダーに別のエフェクトがある {/*each-render-has-its-own-effects*/}

`useEffect` を、レンダー出力に何らかの振る舞いを「付随」させるものであると考えることができます。以下のエフェクトを考えてみましょう。

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

ユーザがアプリを操作する際に、具体的に何が起こるか見てみましょう。

#### 初期レンダー {/*initial-render*/}

ユーザは `<ChatRoom roomId="general" />` を訪れます。`roomId` を `'general'` であると[頭の中で置き換えて](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)みましょう。

```js
  // JSX for the first render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

**エフェクトもまた、レンダー出力の一部です**。最初のレンダーのエフェクトは次のようになります。

```js
  // Effect for the first render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the first render (roomId = "general")
  ['general']
```

React はこのエフェクトを実行し、`'general'` チャットルームに接続します。

#### 同じ依存値での再レンダー {/*re-render-with-same-dependencies*/}

`<ChatRoom roomId="general" />` が再レンダーされるとしましょう。JSX の出力は同じです。

```js
  // JSX for the second render (roomId = "general")
  return <h1>Welcome to general!</h1>;
```

React はレンダー出力が変更されていないことを認識するため、DOM を更新しません。

2 回目のレンダーからのエフェクトは以下のようになります。

```js
  // Effect for the second render (roomId = "general")
  () => {
    const connection = createConnection('general');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the second render (roomId = "general")
  ['general']
```

React は 2 回目のレンダーからの `['general']` と、1 回目のレンダーからの `['general']` を比較します。**すべての依存値が同じであるため、React は 2 回目のレンダーからのエフェクトを*無視*します**。エフェクトは呼び出されません。

#### 異なる依存値での再レンダー {/*re-render-with-different-dependencies*/}

次に、ユーザが `<ChatRoom roomId="travel" />` を訪れます。このとき、コンポーネントは異なる JSX を返します。

```js
  // JSX for the third render (roomId = "travel")
  return <h1>Welcome to travel!</h1>;
```

React は DOM を更新して、`"Welcome to general"` を `"Welcome to travel"` に変更します。

3 回目のレンダーからのエフェクトは以下のようになります。

```js
  // Effect for the third render (roomId = "travel")
  () => {
    const connection = createConnection('travel');
    connection.connect();
    return () => connection.disconnect();
  },
  // Dependencies for the third render (roomId = "travel")
  ['travel']
```

React は 3 回目のレンダーからの `['travel']` と、2 回目のレンダーからの `['general']` を比較します。1 つの依存値が異なります。`Object.is('travel', 'general')` は `false` です。このエフェクトはスキップできません。

**React が 3 回目のレンダーからのエフェクトを適用する前に、最後に実行されたエフェクトをクリーンアップする必要があります**。2 回目のレンダーのエフェクトはスキップされたため、React は 1 回目のレンダーのエフェクトをクリーンアップする必要があります。上にスクロールして 1 回目のレンダーを見返すと、そのクリーンアップコードは `createConnection('general')` で作成された接続に対して `disconnect()` を呼び出すことがわかります。これにより、アプリは `'general'` チャットルームから切断されます。

その後、React は 3 回目のレンダーのエフェクトを実行します。これにより、`'travel'` チャットルームに接続されます。

#### アンマウント {/*unmount*/}

最後に、ユーザがページから出て、`ChatRoom` コンポーネントがアンマウントされるとしましょう。React は最後のエフェクトのクリーンアップ関数を実行します。最後のエフェクトは 3 回目のレンダーからのものでした。3 回目のレンダーのクリーンアップは、`createConnection('travel')` の接続を破棄します。そのため、アプリは `'travel'` ルームから切断されます。

#### 開発環境専用の挙動 {/*development-only-behaviors*/}

[Strict Mode](/reference/react/StrictMode) がオンの場合、React はマウント後にすべてのコンポーネントを一度再マウントします（state と DOM は保持されます）。これは、[クリーンアップが必要なエフェクトを見つけるのに役立ちます](#step-3-add-cleanup-if-needed)し、競合状態 (race condition) のようなバグが早期に見つかるようにもします。さらに、React は開発中にあなたがファイルを保存するたびにエフェクトを再マウントします。これらの挙動は開発環境でのみ起こります。

</DeepDive>

<Recap>

- イベントとは異なり、エフェクトは特定のユーザ操作ではなく、レンダー自体によって引き起こされる。
- エフェクトを使い、コンポーネントを外部システム（サードパーティ API、ネットワークなど）と同期させることができる。
- デフォルトでは、エフェクトは毎回のレンダー（初回も含む）の後に実行される。
- すべての依存値が前回のレンダー時と同じ値である場合、React はエフェクトをスキップする。
- 依存値は「選ぶ」類のものではない。それはエフェクト内のコードによって決定される。
- 空の依存配列 (`[]`) は、コンポーネントが「マウント」される、つまり画面に追加されることに対応する。
- Strict Mode では、React はコンポーネントを 2 回マウント（開発環境のみ！）して、エフェクトのストレステストを行う。
- エフェクトが再マウントにより壊れる場合、クリーンアップ関数を実装する必要がある。
- React は、次のエフェクトが実行される前とアンマウント中に、クリーンアップ関数を呼び出す。

</Recap>

<Challenges>

#### マウント時にフィールドにフォーカス {/*focus-a-field-on-mount*/}

この例では、フォームが `<MyInput />` コンポーネントをレンダーします。

入力フィールドの [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) メソッドを使って、`MyInput` が画面に表示されたときに自動的にフォーカスが当たるようにしてください。すでにコメントアウトされた実装がありますが、これはうまく動作しません。なぜ動作しないのかを理解し、修正してください。（`autoFocus` 属性をご存じの場合でも、今はこれが存在しないことにしてください。同じ機能をゼロから再実装しましょう。）

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // TODO: This doesn't quite work. Fix it.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


あなたの答えが動作することを確認するには、"Show form" を押して、入力がフォーカスされる（ハイライトされ、カーソルが内部に配置される）ことを確認してください。"Hide form" を押してから再度 "Show form" を押すと、再び入力欄がハイライトされることを確認してください。

`MyInput` は、毎レンダーごとではなくマウント時にのみフォーカスされる必要があります。この動作が正しいことを確認するには、"Show form" を押してから、"Make it uppercase" チェックボックスを何度か押してみてください。チェックボックスをクリックしても、その上にある入力フィールドにフォーカスが移動しないようにしてください。

<Solution>

レンダー中に `ref.current.focus()` を呼び出すことは、*副作用*になってしまうため間違いです。副作用は、イベントハンドラ内に配置するか、`useEffect` で宣言する必要があります。この場合、副作用は特定のユーザ操作によるものではなく、コンポーネントが表示されることによって*引き起こされる*ため、エフェクトに入れるのが適切です。

このミスを修正するために、`ref.current.focus()` の呼び出しをエフェクト宣言にラップします。次に、このエフェクトがマウント時にのみ実行されるよう、空の `[]` という依存配列を追加します。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your name:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Make it uppercase
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 条件付きでフィールドにフォーカス {/*focus-a-field-conditionally*/}

このフォームは `<MyInput />` コンポーネントを 2 つレンダーします。

"Show form" を押すと、2 番目のフィールドが自動的にフォーカスされることに注意してください。これは、両方の `<MyInput />` コンポーネントが内部のフィールドにフォーカスしようとするためです。2 つの入力フィールドに連続して `focus()` を呼び出すと、最後に呼んだ方が常に「勝ち」になります。

最初のフィールドにフォーカスしたいとしましょう。最初の `MyInput` コンポーネントは、`shouldFocus` という真偽値の props を `true` で受け取ります。`MyInput` が受け取った `shouldFocus` が `true` の場合にのみ `focus()` が呼び出されるよう、ロジックを変更してください。

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // TODO: call focus() only if shouldFocus is true.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

あなたの答えをテストするには、"Show form" と "Hide form" を何度か押してみます。フォームが表示されると、*最初の*入力欄がフォーカスされるようにしてください。これは、親コンポーネントが 1 番目の入力欄を `shouldFocus={true}` で、2 番目を `shouldFocus={false}` でレンダーしているためです。また、両方の入力フィールドが動作し、入力が行えることも確認してください。

<Hint>

条件付きでエフェクトを宣言することはできませんが、エフェクトに条件付きのロジックを含めることは可能です。

</Hint>

<Solution>

条件付きのロジックはエフェクトの中に入れます。エフェクトの中で `shouldFocus` を使用しているため、依存関係として `shouldFocus` を指定する必要があります。（これは、ある入力欄の `shouldFocus` が `false` から `true` に変わった場合、フォーカスが当たるということでもあります。）

<Sandpack>

```js MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} form</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Enter your first name:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Enter your last name:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Hello, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### 2 回実行されるインターバルを修正 {/*fix-an-interval-that-fires-twice*/}

この `Counter` コンポーネントは、1 秒ごとにインクリメントするカウンタを表示します。コンポーネントはマウント時に、[`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) を呼び出します。これにより、`onTick` が毎秒実行されます。`onTick` 関数はカウンタをインクリメントします。

しかし、1 秒ごとに 1 回ではなく、2 回インクリメントが発生しています。なぜでしょうか？ バグの原因を見つけて修正してください。

<Hint>

`setInterval` はインターバル ID を返し、これを [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) に渡すことでインターバルを停止できることを思い出しましょう。

</Hint>

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

[Strict Mode](/reference/react/StrictMode) がオンになっている場合（このサイトのサンドボックスもそうです）、React は開発中に各コンポーネントを一度再マウントします。これにより、インターバルが 2 回設定されるため、カウンタが 1 秒ごとに 2 回インクリメントされます。

ただし、React のこの挙動がバグの*原因*なのではありません。バグはコードにすでに存在しているのです。React の挙動はバグに気づきやすくするために存在しているだけです。真の原因は、エフェクトが何かを始めるがそれをクリーンアップする方法を返していないことです。

このコードを修正するには、`setInterval` によって返されるインターバル ID を保存し、[`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) を使うクリーンアップ関数を実装します。

<Sandpack>

```js Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'} counter</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

開発環境では、React はクリーンアップがうまく実装されていることを確認するために、コンポーネントを 1 度再マウントします。そのため、`setInterval` の呼び出しの直後に `clearInterval` が呼ばれ、再び `setInterval` が呼ばれます。プロダクションでは、`setInterval` は 1 回だけ呼ばれます。どちらの場合もユーザに見える動作は同じで、カウンタは 1 秒ごとに 1 回インクリメントされます。

</Solution>

#### エフェクト内のフェッチを修正 {/*fix-fetching-inside-an-effect*/}

このコンポーネントは、選択された人物の伝記 (bio) を表示します。伝記を読み込むために、マウント時と `person` が変更されたときに非同期関数 `fetchBio(person)` を呼び出します。その非同期関数は、いずれ文字列に解決 (resolve) される [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) を返します。フェッチが完了すると、その文字列を選択ボックスの下に表示するために `setBio` を呼び出します。

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>


このコードにはバグがあります。まず "Alice" を選択してください。次に "Bob" を選択し、すぐに "Taylor" を選択します。これを十分に素早く行うと、バグが発生します。Taylor が選択されているのに、下の段落には "This is Bob's bio." と表示されてしまうのです。

なぜこれが起こるのでしょう？ このエフェクト内にあるバグを修正してください。

<Hint>

エフェクトが非同期に何かをフェッチする場合、通常はクリーンアップが必要です。

</Hint>

<Solution>

このバグが起きるのは、次の順序でイベントが発生した場合です。

- `'Bob'` を選択し `fetchBio('Bob')` がトリガされる
- `'Taylor'` を選択し `fetchBio('Taylor')` がトリガされる
- **`'Taylor'` のフェッチが `'Bob'` のフェッチより先に完了する**
- `'Taylor'` のレンダーからのエフェクトが `setBio('This is Taylor’s bio')` を呼び出す
- `'Bob'` のフェッチが完了する
- `'Bob'` のレンダーからのエフェクトが `setBio('This is Bob’s bio')` を呼び出す

これが、Taylor が選択されているのに Bob の伝記が表示されてしまう理由です。このようなバグは、2 つの非同期操作が互いに「競争」しており、予期しない順序で到着することにより起こるので、[競合状態 (race condition)](https://ja.wikipedia.org/wiki/%E7%AB%B6%E5%90%88%E7%8A%B6%E6%85%8B) と呼ばれます。

この競合状態を修正するために、クリーンアップ関数を追加します。

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}

```

</Sandpack>

各レンダーのエフェクトは個々に `ignore` 変数を持っています。最初 `ignore` 変数は `false` に設定されています。エフェクトがクリーンアップされる場合（別の人物を選択するなど）、その `ignore` 変数は `true` になります。したがってリクエストがどの順序で完了しても問題なくなります。最後の人物のエフェクトにある `ignore` だけが `false` になっているので、`setBio(result)` が呼び出されます。古いエフェクトはクリーンアップされているので、`if (!ignore)` のチェックが `setBio` の呼び出しを防ぎます。

- `'Bob'` を選択すると `fetchBio('Bob')` がトリガされる
- `'Taylor'` を選択すると `fetchBio('Taylor')` がトリガされ、**以前の（Bob の）エフェクトがクリーンアップされる**
- `'Taylor'` の取得が `'Bob'` の取得よりも*先に*完了する
- `'Taylor'` のレンダーからのエフェクトが `setBio('This is Taylor’s bio')` を呼び出す
- `'Bob'` の取得が完了する
- `'Bob'` のレンダーからのエフェクトは、`ignore` フラグが `true` に設定されているため、**何も行わない**

古い API コールの結果を無視するだけでなく、[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) を使用して、不要になったリクエストをキャンセルすることもできます。ただし、これだけでは競合状態を防ぐのに十分ではありません。フェッチの後にさらに非同期ステップが連続する可能性があるため、`ignore` のような明示的なフラグを使用することが、このタイプの問題を解決する最も確実な方法です。

</Solution>

</Challenges>

