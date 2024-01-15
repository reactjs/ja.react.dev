---
title: useRef
---

<Intro>

`useRef` は、レンダー時には不要な値を参照するための React フックです。

```js
const ref = useRef(initialValue)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useRef(initialValue)` {/*useref*/}

コンポーネントのトップレベルで `useRef` を呼び出して、[ref](/learn/referencing-values-with-refs) を宣言します。

```js
import { useRef } from 'react';

function MyComponent() {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `initialValue`: ref オブジェクトの `current` プロパティの初期値として設定する値です。任意の型の値を指定できます。この引数は 2 回目以降のレンダーでは無視されます。

#### 返り値 {/*returns*/}

`useRef` は、以下の 1 つのプロパティだけを持つオブジェクトを返します。

* `current`: 渡した `initialValue` が初期値に設定されます。あとから別の値に変更することができます。ref オブジェクトを JSX ノードの `ref` 属性として React に渡すと、React は `current` プロパティの値を設定します。

2 回目以降のレンダーでは、`useRef` は同じオブジェクトを返します。

#### 注意点 {/*caveats*/}

<<<<<<< HEAD
* `ref.current` プロパティは書き換えが可能です。つまり state と違いミュータブル (mutable) です。ただし、レンダーに利用されるオブジェクト（state の一部など）を保持している場合は、変更すべきではありません。
* `ref.current` プロパティを変更しても、React はコンポーネントを再レンダーしません。ref はただの JavaScript オブジェクトですので、変更されたとしても、それを React が知ることはできないのです。
* [初期化](#avoiding-recreating-the-ref-contents)時を除いて、レンダー中に `ref.current` の値を*読み取ったり*書き込んだりしないでください。コンポーネントの振る舞いが予測不能になります。
* Strict Mode では、[純粋でない関数を見つけやすくするために](#my-initializer-or-updater-function-runs-twice)、コンポーネント関数が **2 回呼び出されます**。これは開発時のみの振る舞いであり、本番には影響しません。各 ref オブジェクトは 2 回生成されますが、そのうちの 1 つは破棄されます。コンポーネント関数が純粋であれば（そうであるべきです）、この振る舞いはロジックに影響しません。
=======
* You can mutate the `ref.current` property. Unlike state, it is mutable. However, if it holds an object that is used for rendering (for example, a piece of your state), then you shouldn't mutate that object.
* When you change the `ref.current` property, React does not re-render your component. React is not aware of when you change it because a ref is a plain JavaScript object.
* Do not write _or read_ `ref.current` during rendering, except for [initialization.](#avoiding-recreating-the-ref-contents) This makes your component's behavior unpredictable.
* In Strict Mode, React will **call your component function twice** in order to [help you find accidental impurities.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) This is development-only behavior and does not affect production. Each ref object will be created twice, but one of the versions will be discarded. If your component function is pure (as it should be), this should not affect the behavior.
>>>>>>> 6bfde58c109ec86fd6c5767421404cb679ffba9a

---

## 使用法 {/*usage*/}

### ref を使用して値を参照する {/*referencing-a-value-with-a-ref*/}

コンポーネントのトップレベルで `useRef` を呼び出し、1 つ以上の [ref](/learn/referencing-values-with-refs) を宣言します。

```js [[1, 4, "intervalRef"], [3, 4, "0"]]
import { useRef } from 'react';

function Stopwatch() {
  const intervalRef = useRef(0);
  // ...
```

`useRef` は、唯一のプロパティである<CodeStep step={2}>`current`</CodeStep>に、指定された<CodeStep step={3}>初期値</CodeStep>が設定された状態の <CodeStep step={1}>ref オブジェクト</CodeStep>を返します。

次回以降のレンダーでも、`useRef` は同じオブジェクトを返します。このオブジェクトの `current` プロパティを書き換えることで情報を保存しておき、あとからその値を読み出すことができます。これは [state](/reference/react/useState) と似ていますが、大きく違う点があります。

それは、**ref を変更しても、再レンダーはトリガされない**ということです。このことから、ref は、出力されるコンポーネントの外見に影響しないデータを保存するのに適しています。例えば、[インターバルの ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) を保持しておき、あとから利用したい場合、ref に保存することができます。ref 内の値を更新するには、<CodeStep step={2}>`current` プロパティ</CodeStep>を手動で変更します。

```js [[2, 5, "intervalRef.current"]]
function handleStartClick() {
  const intervalId = setInterval(() => {
    // ...
  }, 1000);
  intervalRef.current = intervalId;
}
```

そして、あとから、ref に保存されているインターバル ID を読み出すことができます。これで[インターバルをクリアする関数](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)を呼び出し、インターバルを削除できます。

```js [[2, 2, "intervalRef.current"]]
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

ref を使用することで、次のことが保証されます。

- レンダーを跨いで**情報を保存**できます（通常の変数は、レンダーごとにリセットされます）。
- 変更しても**再レンダーはトリガされません**（state 変数は、変更すると再レンダーがトリガされます）。
- 保存された情報は、コンポーネントのインスタンスごとに**固有**です（コンポーネントの外側で定義された変数は、コンポーネントのインスタンス間で共有されます）。

ref を変更しても再レンダーはトリガされないため、ref は画面に表示したい情報を保存するのには適していません。そのような場合は、代わりに useState を使用してください。`useRef` と `useState` の使い分けに関しては、[ref と state の違い](/learn/referencing-values-with-refs#differences-between-refs-and-state)を参照してください。

<Recipes titleText="useRef を用いて値を参照する使用例" titleId="examples-value">

#### クリックカウンタ {/*click-counter*/}

このコンポーネントは、ボタンがクリックされた回数を保存するために ref を使用しています。この例では、クリック回数の読み書きはイベントハンドラ内でのみ行われているため、state の代わりに ref を使用して構いません。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

JSX 内で `{ref.current}` を表示すると、クリックしても回数の表示は更新されません。これは、`ref.current` に新しい値を設定しても、再レンダーがトリガされないためです。レンダーに利用したい値は、代わりに state に保存してください。

<Solution />

#### ストップウォッチ {/*a-stopwatch*/}

この例では、state と ref を組み合わせて使用しています。`startTime` と `now` はレンダーに利用されるため、state 変数となっています。また、ボタンを押したときにインターバルを停止するために、[インターバル ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) を保持しておく必要があります。インターバル ID はレンダー時には利用されないため、ref に保存し、手動で更新するのが適切です。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

**レンダー中に `ref.current` の値を*読み取ったり*書き込んだりしないでください**。

React は、コンポーネント本体の関数が[純関数のように振る舞う](/learn/keeping-components-pure)ことを期待しています。

- 入力値（[props](/learn/passing-props-to-a-component)、[state](/learn/state-a-components-memory)、[context](/learn/passing-data-deeply-with-context)）が同じなら、常に同じ JSX を返さなければなりません。
- 呼び出し順が変わったり、引数を変えて呼び出されたりしても、他の呼び出し結果に影響を与えてはいけません。

**レンダー中に** ref を読み書きすると、これらに違反してしまいます。

```js {3-4,6-7}
function MyComponent() {
  // ...
  // 🚩 Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // 🚩 Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

代わりに、**イベントハンドラやエフェクトから** ref を読み書きしてください。

```js {4-5,9-10}
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  }
  // ...
}
```

もし、レンダー中に何かを読み出したり[書き込んだり](/reference/react/useState#storing-information-from-previous-renders)*しなければならない*場合は、代わりに [useState](/reference/react/useState) を使用してください。

これらのルールを破っていても、コンポーネントは正常に動作し続けるかもしれません。しかし、近いうちに React に追加される新機能の多くは、これらのルールが守られることを前提としています。詳しくは[コンポーネントを純粋に保つ](/learn/keeping-components-pure#where-you-_can_-cause-side-effects)を参照してください。

</Pitfall>

---

### ref で DOM を操作する {/*manipulating-the-dom-with-a-ref*/}

[DOM](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) を操作したい場合、ref を利用することが非常に多いです。React は、DOM へのアクセスを組み込みでサポートしています。

最初に、<CodeStep step={3}>初期値</CodeStep>を `null` に設定した <CodeStep step={1}>ref オブジェクト</CodeStep> を宣言します。

```js [[1, 4, "inputRef"], [3, 4, "null"]]
import { useRef } from 'react';

function MyComponent() {
  const inputRef = useRef(null);
  // ...
```

次に、操作したい DOM ノードの JSX の `ref` 属性に、ref オブジェクトを渡します。

```js [[1, 2, "inputRef"]]
  // ...
  return <input ref={inputRef} />;
```

この DOM ノードが生成され、画面に配置されると、ref オブジェクトの <CodeStep step={2}>`current` プロパティ</CodeStep>にその DOM ノードが設定されます。これで、`<input>` の DOM ノードにアクセスして、[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) のようなメソッドを呼び出すことができるようになります。

```js [[2, 2, "inputRef.current"]]
  function handleClick() {
    inputRef.current.focus();
  }
```

React は、ノードが画面から削除されると `current` プロパティを `null` に戻します。

詳しくは、[ref を使用して DOM を操作する](/learn/manipulating-the-dom-with-refs)を参照してください。

<Recipes titleText="useRef を使用して DOM を操作する例" titleId="examples-dom">

#### input 要素をフォーカス {/*focusing-a-text-input*/}

この例では、ボタンをクリックすると input にフォーカスが当たります。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### スクロールして画像を表示 {/*scrolling-an-image-into-view*/}

この例では、ボタンがクリックされると、その画像が画面に表示されるようにスクロールします。ref を使用してリストの DOM ノードを取得し、DOM の [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) API を呼び出して、スクロール先の画像を探しています。

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const listRef = useRef(null);

  function scrollToIndex(index) {
    const listNode = listRef.current;
    // This line assumes a particular DOM structure:
    const imgNode = listNode.querySelectorAll('li > img')[index];
    imgNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToIndex(0)}>
          Tom
        </button>
        <button onClick={() => scrollToIndex(1)}>
          Maru
        </button>
        <button onClick={() => scrollToIndex(2)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul ref={listRef}>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<Solution />

#### 動画の再生・停止 {/*playing-and-pausing-a-video*/}

この例では、ref を使用して `<video>` の DOM ノードの [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) と [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) を呼び出します。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution />

#### 独自コンポーネントの ref を公開 {/*exposing-a-ref-to-your-own-component*/}

親コンポーネントから、独自コンポーネント内の DOM を操作したい場合があります。たとえば、`MyInput` コンポーネントを作成しているとして、親コンポーネントが input にフォーカスを当てたい場合などです（親コンポーネントは、input にはアクセスできません）。この場合は、`useRef` と [`forwardRef`](/reference/react/forwardRef) を組み合わせて利用します。`useRef` で input を保持し、`forwardRef` で input への参照を親コンポーネントに公開します。詳しくは、[別のコンポーネントの DOM ノードにアクセスする](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)を参照してください。

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### ref の値の再生成を防ぐ {/*avoiding-recreating-the-ref-contents*/}

React は、初回に渡された ref の値を保存しますが、それ以降のレンダーではその値は無視します。

```js
function Video() {
  const playerRef = useRef(new VideoPlayer());
  // ...
```

`new VideoPlayer()` の結果は初回レンダーでのみ利用されますが、すべてのレンダーで呼び出し自体は発生しています。これは、計算コストの高いオブジェクトを作成している場合に、無駄が多くなります。

これを解決するために、次のように ref を初期化することができます。

```js
function Video() {
  const playerRef = useRef(null);
  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
```

通常、レンダー中に `ref.current` の値を読み取ったり書き込んだりすることは許されていません。しかし、今回の場合は問題ありません。なぜなら、呼び出し結果は常に同じであり、条件分岐により書き込みは初期化時にのみ実行されるため、コンポーネントの振る舞いが完全に予測可能となるからです。

<DeepDive>

#### useRef を遅延して初期化する場合に null チェックを回避する {/*how-to-avoid-null-checks-when-initializing-use-ref-later*/}

型チェッカを使用しており `null` チェックを何度も行うのが煩わしい場合は、次のようなパターンを試してみてください。

```js
function Video() {
  const playerRef = useRef(null);

  function getPlayer() {
    if (playerRef.current !== null) {
      return playerRef.current;
    }
    const player = new VideoPlayer();
    playerRef.current = player;
    return player;
  }

  // ...
```

この例では、`playerRef` 自体は null 許容です。しかし型チェッカに、`getPlayer()` は `null` を返す場合がないと判断させられるはずです。そこでイベントハンドラなどで `getPlayer()` を使用できます。

</DeepDive>

---

## トラブルシューティング {/*troubleshooting*/}

### 独自コンポーネントへの ref を取得できない {/*i-cant-get-a-ref-to-a-custom-component*/}

以下のようにして、独自コンポーネントに `ref` を渡そうとしている場合、

```js
const inputRef = useRef(null);

return <MyInput ref={inputRef} />;
```

コンソールにこのようなエラーが表示されるかもしれません。

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

デフォルトでは、独自コンポーネントは、内部の DOM ノードへの ref を公開していません。

これを修正するには、まず、ref を取得したいコンポーネントを探します。

```js
export default function MyInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={onChange}
    />
  );
}
```

そして、次のように [`forwardRef`](/reference/react/forwardRef) でラップします。

```js {3,8}
import { forwardRef } from 'react';

const MyInput = forwardRef(({ value, onChange }, ref) => {
  return (
    <input
      value={value}
      onChange={onChange}
      ref={ref}
    />
  );
});

export default MyInput;
```

これで、親コンポーネントから ref を取得できるようになります。

詳しくは、[別のコンポーネントの DOM ノードにアクセスする](/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)を参照してください。
