---
title: useEffect
---

<Intro>

`useEffect` は、[コンポーネントを外部システムと同期させる](/learn/synchronizing-with-effects)ための React フックです。

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

コンポーネントのトップレベルで `useEffect` を呼び出して、エフェクト (Effect) を宣言します。

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `setup`: エフェクトのロジックが記述された関数です。このセットアップ関数は、オプションで*クリーンアップ*関数を返すことができます。コンポーネントが初めて DOM に追加されると、React はセットアップ関数を実行します。依存配列 (dependencies) が変更された再レンダー時には、React はまず古い値を使ってクリーンアップ関数（あれば）を実行し、次に新しい値を使ってセットアップ関数を実行します。コンポーネントが DOM から削除された後、React はクリーンアップ関数を最後にもう一度実行します。
 
* **省略可能** `dependencies`: `setup` コード内で参照されるすべてのリアクティブな値のリストです。リアクティブな値には、props、state、コンポーネント本体に直接宣言されたすべての変数および関数が含まれます。リンタが [React 用に設定されている場合](/learn/editor-setup#linting)、すべてのリアクティブな値が依存値として正しく指定されているか確認できます。依存値のリストは要素数が一定である必要があり、`[dep1, dep2, dep3]` のようにインラインで記述する必要があります。React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使った比較で、それぞれの依存値を以前の値と比較します。この引数を省略すると、エフェクトはコンポーネントの毎回のレンダー後に再実行されます。[依存値の配列を渡す場合と空の配列を渡す場合、および何も渡さない場合の違い](#examples-dependencies)を確認してください。

#### 返り値 {/*returns*/}

`useEffect` は `undefined` を返します。

#### 注意点 {/*caveats*/}

* `useEffect` はフックであるため、**コンポーネントのトップレベル**やカスタムフック内でのみ呼び出すことができます。ループや条件文の中で呼び出すことはできません。これが必要な場合は、新しいコンポーネントを抽出し、その中に state を移動させてください。

* 外部システムと同期する必要が**ない場合**、[エフェクトはおそらく不要です](/learn/you-might-not-need-an-effect)。

* Strict Mode が有効な場合、React は本物のセットアップの前に、**開発時専用のセットアップ+クリーンアップサイクルを 1 回追加で実行**します。これは、クリーンアップロジックがセットアップロジックと鏡のように対応しており、セットアップで行われたことを停止または元に戻していることを保証するためのストレステストです。問題が発生した場合は、[クリーンアップ関数を実装します](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。

* 依存配列の一部にコンポーネント内で定義されたオブジェクトや関数がある場合、**エフェクトが必要以上に再実行される**可能性があります。これを修正するには、[オブジェクト型](#removing-unnecessary-object-dependencies)および[関数型](#removing-unnecessary-function-dependencies)の不要な依存値を削除します。また、エフェクトの外部に [state の更新](#updating-state-based-on-previous-state-from-an-effect)や[非リアクティブなロジック](#reading-the-latest-props-and-state-from-an-effect)を抽出することもできます。

* エフェクトがユーザ操作（クリックなど）によって引き起こされたものでない場合、React はブラウザが**新しい画面を描画した後にエフェクトを実行**します。あなたのエフェクトが（ツールチップの配置など）何か視覚的な作業を行っており遅延が目立つ場合（ちらつくなど）、`useEffect` を [`useLayoutEffect` に置き換えてください](/reference/react/useLayoutEffect)。

* エフェクトがユーザ操作（クリックなど）によって引き起こされた場合でも、**ブラウザはエフェクト内の state 更新処理の前に画面を再描画する可能性があります**。通常、これが望ましい動作です。しかし、ブラウザによる画面の再描画をブロックしなければならない場合、`useEffect` を [`useLayoutEffect` に置き換える必要があります](/reference/react/useLayoutEffect)。

* エフェクトは**クライアント上でのみ実行されます**。サーバレンダリング中には実行されません。

---

## 使用法 {/*usage*/}

### 外部システムへの接続 {/*connecting-to-an-external-system*/}

コンポーネントによっては自身がページに表示されている間、ネットワーク、何らかのブラウザ API、またはサードパーティライブラリとの接続を維持する必要があるものがあります。これらのシステムは React によって制御されていないため、*外部 (external)* のものです。

[コンポーネントを外部システムに接続する](/learn/synchronizing-with-effects)には、コンポーネントのトップレベルで `useEffect` を呼び出します。

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

`useEffect` には 2 つの引数を渡す必要があります。

1. システムに接続する<CodeStep step={1}>セットアップコード</CodeStep>を含む*セットアップ関数*。
   - そのシステムから切断する<CodeStep step={2}>クリーンアップコード</CodeStep>を含む*クリーンアップ関数*を返す必要があります。
2. これらの関数内で使用されるコンポーネントからのすべての値を含んだ<CodeStep step={3}>依存値のリスト</CodeStep>。

**React は必要に応じてセットアップ関数とクリーンアップ関数を呼び出し、これは複数回行われることがあります。**

1. コンポーネントがページに追加（*マウント*）されると、<CodeStep step={1}>セットアップコード</CodeStep>が実行されます。
2. <CodeStep step={3}>依存値</CodeStep>が変更された上でコンポーネントが再レンダーされる度に：
   - まず、古い props と state で<CodeStep step={2}>クリーンアップコード</CodeStep>が実行されます。
   - 次に、新しい props と state で<CodeStep step={1}>セットアップコード</CodeStep>が実行されます。
3. コンポーネントがページから削除（*アンマウント*）されると、最後に<CodeStep step={2}>クリーンアップコード</CodeStep>が実行されます。

**上記の例でこのシーケンスを説明しましょう。**

上記の `ChatRoom` コンポーネントがページに追加されると、`serverUrl` と `roomId` の初期値を使ってチャットルームに接続します。`serverUrl` または `roomId` が再レンダーの結果として変更される場合（例えば、ユーザがドロップダウンで別のチャットルームを選択した場合）、あなたのエフェクトは*以前のルームから切断し、次のルームに接続します*。`ChatRoom` コンポーネントがページから削除されると、あなたのエフェクトは最後の切断を行います。

**[バグを見つけ出すために](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)、開発中には React は<CodeStep step={1}>セットアップ</CodeStep>と<CodeStep step={2}>クリーンアップ</CodeStep>を、<CodeStep step={1}>セットアップ</CodeStep>の前に 1 回余分に実行します**。これは、エフェクトのロジックが正しく実装されていることを確認するストレステストです。これが目に見える問題を引き起こす場合、クリーンアップ関数に一部のロジックが欠けています。クリーンアップ関数は、セットアップ関数が行っていたことを停止ないし元に戻す必要があります。基本ルールとして、ユーザはセットアップが一度しか呼ばれていない（本番環境の場合）か、*セットアップ* → *クリーンアップ* → *セットアップ*のシーケンス（開発環境の場合）で呼ばれているかを区別できないようにする必要があります。[一般的な解決法を参照してください](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。

**[各エフェクトを独立したプロセスとして記述](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)するようにし、[一回のセットアップ／クリーンアップのサイクルだけを考える](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)ようにしてください**。コンポーネントが現在マウント、更新、アンマウントのどれを行っているかを考慮すべきではありません。セットアップロジックが正しくクリーンアップロジックと「対応」されることで、エフェクトはセットアップとクリーンアップを必要に応じて何度実行しても問題が起きない、堅牢なものとなります。

<Note>

エフェクトは、コンポーネントを外部システム（チャットサービスのようなもの）と[同期させるために使います](/learn/synchronizing-with-effects)。ここでいう*外部システム*とは、React が制御していないコードの一部で、たとえば以下のようなものです。

* <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> と <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep> で管理されるタイマー。
* <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> と <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep> を使ったイベントサブスクリプション。
* <CodeStep step={1}>`animation.start()`</CodeStep> と <CodeStep step={2}>`animation.reset()`</CodeStep> のような API を持つサードパーティのアニメーションライブラリ。

**外部システムに接続していない場合は、[恐らくエフェクトは不要です](/learn/you-might-not-need-an-effect)**。

</Note>

<Recipes titleText="外部システムへの接続例" titleId="examples-connecting">

#### チャットサーバへの接続 {/*connecting-to-a-chat-server*/}

この例では、`ChatRoom` コンポーネントがエフェクトを使って `chat.js` で定義された外部システムに接続しています。"Open chat" を押すと `ChatRoom` コンポーネントが表示されます。このサンドボックスは開発モードで実行されているため、[こちらで説明されているように](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)、接続と切断のサイクルが 1 回追加で発生します。`roomId` と `serverUrl` をドロップダウンと入力欄で変更して、エフェクトがチャットに再接続する様子を確認してみてください。"Close chat" を押すと、エフェクトが最後の 1 回の切断作業を行います。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### グローバルなブラウザイベントへのリッスン {/*listening-to-a-global-browser-event*/}

この例では、外部システムはブラウザの DOM 自体です。イベントリスナは通常 JSX で指定しますが、この方法ではグローバルな [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) オブジェクトへはリッスンすることはできません。エフェクトを使うことで、`window` オブジェクトに接続し、そのイベントをリッスンできます。`pointermove` イベントにリッスンすることで、カーソル（または指）の位置を追跡し、赤い点をそれに合わせて移動させることができます。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### アニメーションのトリガ {/*triggering-an-animation*/}

この例では、外部システムは `animation.js` に書かれているアニメーションライブラリです。これは、DOM ノードを引数に取る `FadeInAnimation` という JavaScript クラスを提供し、アニメーションを制御するための `start()` および `stop()` メソッドを公開しています。このコンポーネントは、背後にある DOM ノードにアクセスするために [ref を使います](/learn/manipulating-the-dom-with-refs)。エフェクトは ref から DOM ノードを読み取り、コンポーネントが表示されたときにそのノードのアニメーションを自動的に開始します。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### モーダルダイアログの制御 {/*controlling-a-modal-dialog*/}

この例では、外部システムはブラウザの DOM です。`ModalDialog` コンポーネントは [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) 要素をレンダーします。`isOpen` プロパティを [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) および [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close) メソッド呼び出しに同期させるためにエフェクトを使用しています。

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### 要素の可視性の追跡 {/*tracking-element-visibility*/}

<<<<<<< HEAD
この例では、外部システムは再びブラウザの DOM です。`App` コンポーネントは長いリストを表示し、その後に `Box` コンポーネントを表示し、もう一度長いリストを表示します。リストを下にスクロールしてみてください。`Box` コンポーネントがビューポートに表示されると、背景色が黒に変わることに気付くでしょう。これを実装するために、`Box` コンポーネントはエフェクトを使用して [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) を管理しています。このブラウザ API は、DOM 要素がビューポートに表示されているときに通知してくれるものです。
=======
In this example, the external system is again the browser DOM. The `App` component displays a long list, then a `Box` component, and then another long list. Scroll the list down. Notice that when all of the `Box` component is fully visible in the viewport, the background color changes to black. To implement this, the `Box` component uses an Effect to manage an [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). This browser API notifies you when the DOM element is visible in the viewport.
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### カスタムフックにエフェクトをラップする {/*wrapping-effects-in-custom-hooks*/}

エフェクトは[「避難ハッチ」](/learn/escape-hatches)です。React の外に出る必要があり、かつ特定のユースケースに対してより良い組み込みのソリューションがない場合に使用します。エフェクトを手で何度も書く必要があることに気付いたら、通常それは、あなたのコンポーネントが依存する共通の振る舞いのための[カスタムフック](/learn/reusing-logic-with-custom-hooks)を抽出する必要があるというサインです。

例えば、この `useChatRoom` カスタムフックは、エフェクトのロジックをより宣言的な API の背後に「隠蔽」します。

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

この後で、任意のコンポーネントから以下のように使うことができます。

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

ほかにも React のエコシステムには、さまざまな目的のための優れたカスタムフックが多数公開されています。

[カスタムフックでエフェクトをラップする方法についてもっと学ぶ](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="カスタムフックでエフェクトをラップする例" titleId="examples-custom-hooks">

#### カスタム `useChatRoom` フック {/*custom-usechatroom-hook*/}

この例は、[これまでの例](#examples-connecting) のいずれかと同じですが、カスタムフックにロジックが抽出されています。

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### カスタム `useWindowListener` フック {/*custom-usewindowlistener-hook*/}

この例は、[前の例](#examples-connecting)の中の 1 つと同じですが、ロジックがカスタムフックに抽出されています。

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### カスタム `useIntersectionObserver` フック {/*custom-useintersectionobserver-hook*/}

この例は、[前の例](#examples-connecting)の中の 1 つと同じですが、ロジックが部分的にカスタムフックに抽出されています。

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 非 React ウィジェットの制御 {/*controlling-a-non-react-widget*/}

外部システムをあなたのコンポーネントの props や state に同期させたいことがあります。

例えば、React を使っていないサードパーティ製のマップウィジェットやビデオプレーヤコンポーネントがある場合、エフェクトを使ってそちらのメソッドを呼び出し、そちらの状態を React コンポーネントの現在 state に合わせることができます。以下では、`map-widget.js` に定義された `MapWidget` クラスのインスタンスをエフェクトが作成します。`Map` コンポーネントの props である `zoomLevel` が変更されると、エフェクトがクラスインスタンスの `setZoom()` を呼び出して、同期を保ちます。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

この例では、クリーンアップ関数は必要ありません。なぜなら、`MapWidget` クラスは自身に渡された DOM ノードのみを管理しているためです。React の `Map` コンポーネントがツリーから削除された後、DOM ノードと `MapWidget` クラスインスタンスは、ブラウザの JavaScript エンジンによって自動的にガベージコレクションされます。

---

### エフェクトを使ったデータフェッチ {/*fetching-data-with-effects*/}

エフェクトを使って、コンポーネントに必要なデータをフェッチ（fetch, 取得）することができます。ただし[フレームワークを使用している場合](/learn/start-a-new-react-project#production-grade-react-frameworks)は、エフェクトを自力で記述するよりも、フレームワークのデータフェッチメカニズムを使用する方がはるかに効率的であることに注意してください。

エフェクトを使って自力でデータをフェッチしたい場合は、以下のようなコードを書くことになります。

```js
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
    };
  }, [person]);

  // ...
```

`ignore` 変数に注目してください。これは `false` で初期化され、クリーンアップ時に `true` に設定されます。これにより、[コードが "競合状態 (race condition)" に悩まされない](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)ようになります。ネットワークレスポンスは、送信した順序と異なる順序で届くことがあることに注意しましょう。

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

また、[`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 構文を使って書き直すこともできますが、この場合でもクリーンアップ関数を渡す必要があります。

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
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

エフェクト内で直接データフェッチを書くとコードの繰り返しが増え、キャッシュやサーバレンダリングといった最適化を後から追加することが難しくなります。[独自の、あるいはコミュニティがメンテナンスしているカスタムフックを使う方が簡単です](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)。

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

---

### リアクティブな依存配列の指定 {/*specifying-reactive-dependencies*/}

**エフェクトの依存配列は、自分で「選ぶ」たぐいの物ではないことに注意してください**。エフェクトのコードによって使用されるすべての<CodeStep step={2}>リアクティブな値</CodeStep>は、依存値として宣言されなければなりません。エフェクトの依存値のリストは、周囲のコードによって決定されます。

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // This is a reactive value
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // This is a reactive value too

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads these reactive values
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ So you must specify them as dependencies of your Effect
  // ...
}
```

`serverUrl` または `roomId` が変更されると、エフェクトは新しい値を使用してチャットに再接続します。

**[リアクティブな値](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)には、props と、コンポーネント内に直接宣言されたすべての変数および関数が含まれます**。`roomId` と `serverUrl` はリアクティブな値であるため、依存値のリストから削除することはできません。それらを省略しようとした場合、[React 用のリンタが正しく設定](/learn/editor-setup#linting)されていれば、リンタはこれを修正が必要な誤りであると指摘します。

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**依存配列から何かを削除するには、[リンタに対し、それが依存値である*理由がない*ことを「証明」する必要があります](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)**。例えば、`serverUrl` をコンポーネントの外に移動すれば、それがリアクティブな値ではなく、再レンダー時に変更されないものであることを証明できます。

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

これで `serverUrl` がリアクティブな値でなくなった（再レンダー時に変更されない）ため、依存配列に入れる必要がなくなりました。**エフェクトのコードがリアクティブな値を使用していない場合、その依存配列は空 (`[]`) であるべきです**。

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

[空の依存配列で定義したエフェクト](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)は、コンポーネントの props や state が変更された場合でも再実行されません。

<Pitfall>

既存のコードベースがある場合、以下のようにしてリンタを黙らせているエフェクトを見かけるかもしれません。

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**依存配列がコードと一致しない場合、バグが発生するリスクが高くなります**。リンタを抑制することで、エフェクトが依存する値について React に「嘘」をつくことになります。[代わりにそれらが不要であることを証明してください](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)。

</Pitfall>

<Recipes titleText="リアクティブな依存値の配列を渡す例" titleId="examples-dependencies">

#### 依存配列を渡す {/*passing-a-dependency-array*/}

依存配列を指定すると、エフェクトは**最初のレンダー後*および*依存配列が変わった後の再レンダー後に実行されます。**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Runs again if a or b are different
```

以下の例では、`serverUrl` と `roomId` は [リアクティブな値](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)であるため、両方とも依存配列の中で指定する必要があります。その結果、ドロップダウンで別のルームを選択したり、サーバ URL の入力欄を編集したりすると、チャットが再接続されます。ただし、`message` はエフェクトで使用されていない（依存する値ではない）ため、メッセージを編集してもチャットが再接続されることはありません。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### 空の依存配列を渡す {/*passing-an-empty-dependency-array*/}

あなたのエフェクトがリアクティブな値を本当に使っていないのであれば、それは**初回のレンダー後に**のみ実行されます。

```js {3}
useEffect(() => {
  // ...
}, []); // Does not run again (except once in development)
```

**空の依存配列であっても、セットアップとクリーンアップは[開発中には 1 回余分に実行](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)され、バグを見つけるのに役立ちます**。


以下の例では、`serverUrl` と `roomId` の両方がハードコードされています。コンポーネントの外側で宣言されているため、これらはリアクティブな値ではなく、従って依存配列に入れる必要もありません。依存値のリストは空なので、再レンダー時にこのエフェクトが再実行されることもありません。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### 依存配列を渡さない {/*passing-no-dependency-array-at-all*/}

依存配列自体をまったく渡さない場合、コンポーネントの**毎回のレンダー（再レンダー）後に**エフェクトが実行されます。

```js {3}
useEffect(() => {
  // ...
}); // Always runs again
```

この例では、`serverUrl` と `roomId` が変更されるとエフェクトが再実行され、それは理にかなっています。ただし、`message` が変更された場合でも*やはり*エフェクトは再実行され、それはおそらく望ましくありません。ですので通常は依存配列を指定します。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // No dependency array at all

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### エフェクト内で以前の state に基づいて state を更新する {/*updating-state-based-on-previous-state-from-an-effect*/}

エフェクトから以前の state に基づいて state を更新したい場合、問題が発生するかもしれません。

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // You want to increment the counter every second...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
  // ...
}
```

`count` はリアクティブな値なので、依存配列に指定する必要があります。ただし、このままでは `count` が変更されるたびに、エフェクトがクリーンアップとセットアップを繰り返すことになります。これは望ましくありません。

この問題を解決するには、`setCount` に [`c => c + 1` という state 更新用関数を渡します](/reference/react/useState#updating-state-based-on-the-previous-state)。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
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

`c => c + 1` を `count + 1` の代わりに渡すようになったので、[このエフェクトはもう `count` に依存する必要はありません](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state)。この修正の結果、`count` が変化するたびにインターバルのクリーンアップとセットアップを行わなくてもよくなります。

---


### オブジェクト型の不要な依存値を削除する {/*removing-unnecessary-object-dependencies*/}

エフェクトがレンダー中に作成されたオブジェクトや関数に依存している場合、必要以上にエフェクトが実行されてしまうことがあります。たとえば、このエフェクトは `options` オブジェクトが[レンダーごとに異なる](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)ため、毎回のレンダー後に再接続を行ってしまいます：

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

レンダー中に新たに作成されたオブジェクトを依存値として使用しないでください。代わりに、エフェクトの中でオブジェクトを作成します：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

エフェクトの中で `options` オブジェクトを作成するようになったので、エフェクト自体は `roomId` 文字列にしか依存しません。

この修正により、入力フィールドに文字を入力してもチャットが再接続されることはなくなります。オブジェクトは再レンダーのたびに再作成されるのとは異なり、`roomId` のような文字列は別の値に設定しない限り変更されません。[依存値の削除に関する詳細を読む](/learn/removing-effect-dependencies)。

---

### 関数型の不要な依存値を削除する {/*removing-unnecessary-function-dependencies*/}

エフェクトがレンダー中に作成されたオブジェクトや関数に依存している場合、必要以上にエフェクトが実行されてしまうことがあります。たとえば、このエフェクトは `createOptions` 関数が[レンダーごとに異なる](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)ため、毎回再接続を行ってしまいます：

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 This function is created from scratch on every re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // It's used inside the Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

再レンダーのたびに新しい関数を作成すること、それ自体には問題はなく、最適化しようとする必要はありません。ただし、エフェクトの依存値としてそれを使用する場合、毎回のレンダー後にエフェクトが再実行されてしまうことになります。

レンダー中に作成された関数を依存値として使用することは避けてください。代わりに、エフェクトの内部で宣言するようにします。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`createOptions` 関数をエフェクト内で定義するようにしたので、エフェクト自体は `roomId` 文字列にのみ依存することになります。この修正により、入力欄に入力してもチャットが再接続されなくなります。再レンダー時に再作成される関数とは異なり、`roomId` のような文字列は他の値に設定しない限り変更されません。[依存値の削除について詳しくはこちら](/learn/removing-effect-dependencies)。

---

### エフェクトから最新の props と state を読み取る {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

このセクションでは、まだ安定したバージョンの React でリリースされていない**実験的な API** について説明します。

</Wip>

デフォルトでは、エフェクトからリアクティブな値を読み取るときは、それを依存値として追加する必要があります。これにより、エフェクトはその値の変更に対して「反応」することが保証されます。ほとんどの依存値については、それが望む挙動です。

**ただし、時には「反応」をせずに最新の props や state を エフェクト内から読み取りたいことがあるでしょう**。例えば、ショッピングカート内のアイテム数をページ訪問ごとに記録する場合を想像してみてください。

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ All dependencies declared
  // ...
}
```

**`url` の変更ごとに新しいページ訪問を記録したいが、`shoppingCart` の変更のみでは記録したくない場合はどうすればいいのでしょうか？** [リアクティブルール](#specifying-reactive-dependencies)に反することなく `shoppingCart` を依存配列から除外することはできません。しかし、エフェクト内から呼ばれるコードの一部であるにもかかわらず、そのコードが変更に「反応」しないことを示すことができます。[`useEffectEvent`](/reference/react/experimental_useEffectEvent) フックを使用して、[*エフェクトイベント (effect event)* を宣言](/learn/separating-events-from-effects#declaring-an-effect-event)し、`shoppingCart` を読み取るコードをその内部に移動してください。

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

**エフェクトイベントはリアクティブでなはいため、あなたのエフェクトの依存配列からは常に除く必要があります**。これにより、非リアクティブなコード（最新の props や state の値を読むことができるコード）をエフェクトイベント内に入れることができます。`onVisit` の中で `shoppingCart` を読むことで、`shoppingCart` がエフェクトを再実行することがなくなります。

[エフェクトイベントがリアクティブなコードと非リアクティブなコードをどのように分離するか詳しく読む](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)。


---

### サーバとクライアントで異なるコンテンツを表示する {/*displaying-different-content-on-the-server-and-the-client*/}

お使いのアプリがサーバレンダリングを（[直接](/reference/react-dom/server)ないし[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)経由で）使用している場合、コンポーネントは 2 種類の環境でレンダーされます。サーバ上では、初期 HTML を生成するためにレンダーされます。クライアント上では、React がその HTML にイベントハンドラをアタッチするために再度レンダーコードを実行します。これが、[ハイドレーション](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html)が動作するためには初回レンダーの出力がクライアントとサーバの両方で同一でなければならない理由です。

まれに、クライアント側で異なるコンテンツを表示する必要がある場合があります。たとえば、アプリが [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) からデータを読み込む場合、サーバ上ではそれを行うことができません。これは以下の方法で実装できます。

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

アプリがロードされている間、ユーザは初期レンダーの出力を表示します。ロードとハイドレーションが完了したら、エフェクトが実行され、`didMount` が `true` にセットされ、再レンダーがトリガされます。これにより、クライアント専用のレンダー出力に切り替わります。エフェクトはサーバ上では実行されないため、初回サーバレンダー時には `didMount` は `false` のままになります。

このパターンは節度を持って使用してください。遅い接続のユーザは初期コンテンツをかなり長い時間、場合によっては数秒以上表示することになります。なのでコンポーネントの見た目に違和感を与える変更をしないようにしてください。多くの場合、CSS で条件付きに異なるものを表示することで、このようなことはしなくてよくなります。

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントのマウント時にエフェクトが 2 回実行される {/*my-effect-runs-twice-when-the-component-mounts*/}

Strict Mode がオンの場合、開発時に React は実際のセットアップの前に、セットアップとクリーンアップをもう一度実行します。

これは、エフェクトのロジックが正しく実装されていることを確認するためのストレステストです。これが目に見える問題を引き起こす場合、クリーンアップ関数に一部のロジックが欠けています。クリーンアップ関数は、セットアップ関数が行っていたことを停止ないし元に戻す必要があります。基本原則は、ユーザがセットアップが一度呼ばれた場合（本番環境の場合）と、セットアップ → クリーンアップ → セットアップというシーケンスで呼ばれた場合（開発環境の場合）で、違いを見分けられてはいけない、ということです。

[どのようにバグを見つけるのに役立つか](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) と、[ロジックを修正する方法](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) について詳しく読む。

---

### エフェクトが再レンダーごとに実行される {/*my-effect-runs-after-every-re-render*/}

まず、依存配列の指定を忘れていないか確認してください。

```js {3}
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every render!
```

依存配列を指定しているにもかかわらず、エフェクトがループで再実行される場合、それは再レンダーごとに依存する値のどれかが変わっているためです。

この問題は、手動で依存する値をコンソールにログ出力することでデバッグできます。

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

次に、コンソール上の異なる再レンダーから表示された配列を右クリックし、それぞれで "Store as a global variable" を選択します。最初のものが `temp1` として保存され、2 番目のものが `temp2` として保存されたとすると、以下のようにブラウザのコンソールを使って、両方の配列でそれぞれの値が同じかどうかを確認できます。

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

再レンダーごとに値の変わる依存値が見つかった場合、通常は次の方法のいずれかで修正できます。

- [エフェクトからの前回の state に基づく state の更新](#updating-state-based-on-previous-state-from-an-effect)
- [オブジェクト型の不要な依存値を削除する](#removing-unnecessary-object-dependencies)
- [関数型の不要な依存値を削除する](#removing-unnecessary-function-dependencies)
- [エフェクトから最新の props と state を読み取る](#reading-the-latest-props-and-state-from-an-effect)

最後の手段として、上記の方法がうまくいかなかった場合、その値を作っているところを [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) または（関数の場合）[`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) でラップしてください。

---

### エフェクトが無限ループで再実行され続ける {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

エフェクトが無限ループで実行される場合、以下の 2 つの条件が成立しているはずです。

- エフェクトが何らかの state を更新している。
- その state 更新により再レンダーが発生し、それによりエフェクトの依存配列が変更されている。

問題を修正する前に、エフェクトが外部システム（DOM、ネットワーク、サードパーティのウィジェットなど）に接続しているかどうかを確認してください。エフェクトが state を設定する必要がある理由は何ですか？ 外部システムと同期するためですか？ それとも、アプリケーションのデータフローをそれで管理しようとしているのでしょうか？

外部システムがない場合、[そもそもエフェクトを削除する](/learn/you-might-not-need-an-effect)ことでロジックが簡略化されるかどうか、検討してください。

もし本当に外部システムと同期している場合は、エフェクトがいつ、どのような条件下で state を更新する必要があるか考えてみてください。何か、コンポーネントの視覚的な出力に影響を与える変更があるのでしょうか？ レンダーに使用されないデータを管理する必要がある場合は、[ref](/reference/react/useRef#referencing-a-value-with-a-ref)（再レンダーをトリガしない）の方が適切かもしれません。エフェクトが必要以上に state を更新（して再レンダーをトリガ）していないことを確認してください。

最後に、エフェクトが適切なタイミングで state を更新しているものの、それでも無限ループが残っている場合は、その state の更新によりエフェクトの依存配列のどれかが変更されているためです。[依存配列の変更をデバッグする方法を確認してください](/reference/react/useEffect#my-effect-runs-after-every-re-render)。

---

### コンポーネントがアンマウントされていないのにクリーンアップロジックが実行される {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

クリーンアップ関数は、アンマウント時だけでなく、依存配列が変更された後の再レンダー後にも実行されます。また、開発中には、React が[コンポーネントのマウント直後に、セットアップ+クリーンアップを 1 回追加で実行](#my-effect-runs-twice-when-the-component-mounts)します。

対応するセットアップコードのないクリーンアップコードをお持ちの場合、通常はコードの問題があります。

```js {2-5}
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

クリーンアップロジックはセットアップロジックと「対称的」であり、セットアップが行ったことを停止ないし元に戻す必要があります。

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[エフェクトのライフサイクルがコンポーネントのライフサイクルとどのように異なるかを学びましょう](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)。

---

### エフェクトが表示に関することを行っており、実行前にちらつきが見られる {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

エフェクトがブラウザの[画面描画をブロック](/learn/render-and-commit#epilogue-browser-paint)する必要がある場合は、`useEffect` の代わりに [`useLayoutEffect`](/reference/react/useLayoutEffect) を使用してください。ただし、これは**ほとんどのエフェクトには必要ない**ということに注意してください。これは、ブラウザ描画の前にエフェクトを実行することが重要な場合にのみ必要です。例えば、ユーザがツールチップを見る前に、ツールチップのサイズを測定して配置するために使用します。
