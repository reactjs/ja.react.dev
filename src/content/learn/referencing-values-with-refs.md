---
title: ref で値を参照する
---

<Intro>

コンポーネントに情報を「記憶」させたいが、その情報が[新しいレンダーをトリガ](/learn/render-and-commit)しないようにしたい場合、*ref* を使うことができます。

</Intro>

<YouWillLearn>

- コンポーネントに ref を追加する方法
- ref の値を更新する方法
- ref と state の違い
- ref を安全に使う方法

</YouWillLearn>

## コンポーネントに ref を追加する {/*adding-a-ref-to-your-component*/}

コンポーネントに ref を追加するには、React から `useRef` フックをインポートします。

```js
import { useRef } from 'react';
```

コンポーネント内で、`useRef` フックを呼び出し、唯一の引数として参照したい初期値を渡します。例えば、値 `0` を参照する ref は以下のようになります。

```js
const ref = useRef(0);
```

`useRef` は以下のようなオブジェクトを返します。

```js
{ 
  current: 0 // The value you passed to useRef
}
```

<Illustration src="/images/docs/illustrations/i_ref.png" alt="'current' と書かれた矢印が 'ref' と書かれたポケットに詰め込まれている。" />

ref の現在の値には、`ref.current` プロパティを通じてアクセスできます。この値は意図的にミュータブル、つまり読み書きが可能となっています。これは、React が管理しない、コンポーネントの秘密のポケットのようなものです。（そしてこれが、ref が React の一方向データフローからの「避難ハッチ (escape hatch)」である理由です。詳細は以下で説明します！）

この例では、ボタンがクリックされるたびに `ref.current` をインクリメントします。

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

この ref は数値を参照していますが、[state](/learn/state-a-components-memory) と同様に、文字列、オブジェクト、関数など、何でも扱うことができます。ただし、state とは異なり、ref は `current` プロパティを読み書きできるだけのプレーンな JavaScript オブジェクトです。

**インクリメントごとにコンポーネントが再レンダーされない**ことに注意してください。state と同様に、ref は React によって再レンダー間で保持されます。ただし、state はセットするとコンポーネントが再レンダーされます。ref を変更しても再レンダーは起きません！

## 例：ストップウォッチの作成 {/*example-building-a-stopwatch*/}

ref と state を 1 つのコンポーネントで組み合わせることができます。例えば、ユーザがボタンを押すことで開始または停止できるストップウォッチを作成しましょう。ユーザが "Start" を押してからどれだけの時間が経過したかを表示するためには、"Start" ボタンが押された時刻と現在時刻を管理する必要があります。**これらの情報はレンダーに使用されるものなので、state に保持します**。

```js
const [startTime, setStartTime] = useState(null);
const [now, setNow] = useState(null);
```

ユーザが "Start" を押すと、[`setInterval`](https://developer.mozilla.org/docs/Web/API/setInterval) を使って 10 ミリ秒ごとに時間を更新します。

<Sandpack>

```js
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    // Start counting.
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      // Update the current time every 10ms.
      setNow(Date.now());
    }, 10);
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
    </>
  );
}
```

</Sandpack>

"Stop" ボタンが押されると、既存のインターバルをキャンセルして `now` という state 変数の更新を停止する必要があります。これは [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) を呼び出すことで実現できますが、ユーザが以前 Start を押した際の `setInterval` 呼び出しで返された、インターバル ID を指定する必要があります。インターバル ID は、どこかに保持しておく必要があります。**インターバル ID はレンダーには使用されないため、ref に保持します**。

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

情報がレンダー時に使用される場合は、state に保持します。情報がイベントハンドラ内でのみ必要で、変更しても再レンダーが必要ない場合は、ref を使用する方が効率的です。

## ref と state の違い {/*differences-between-refs-and-state*/}

ref の方が state よりも「制限が緩い」と感じるかもしれません。例えば、state セッタ関数を使わずに変更できるわけですから。しかし、ほとんどの場合、state を使用することになります。ref は頻繁には必要としない「避難ハッチ」です。state と ref の比較は以下の通りです。

| ref                                                                                   | state                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `useRef(initialValue)` は `{ current: initialValue }` を返す                          | `useState(initialValue)` は state 変数の現在の値と state セッタ関数を返す（`[value, setValue]`）                          |
| 変更しても再レンダーがトリガされない                                                  | 変更すると再レンダーがトリガされる                                                                                        |
| ミュータブル - レンダープロセス外で `current` の値を変更・更新できる                  | "イミュータブル" - state 変数を変更するためには、再レンダーをキューに入れるために state セッタ関数を使用する              |
| レンダー中に `current` の値を読み取る（または書き込む）べきではない                   | いつでも state を読み取ることができる。ただし、各レンダーには独自の state の[スナップショット](/learn/state-as-a-snapshot) があり変更されない |

ここに、state を使って実装されたカウンタボタンがあります。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You clicked {count} times
    </button>
  );
}
```

</Sandpack>

`count` 値は表示されるものなので、state を使うのが適切です。カウンタの値が `setCount()` でセットされると、React はコンポーネントを再レンダーし、画面が新しいカウントを反映するように更新されます。

もしこれを ref で実装しようとしても、React はコンポーネントを再レンダーしないため、カウントの変更は一切反映されません！ ボタンをクリックしても**テキストが更新されない**ことがわかります。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let countRef = useRef(0);

  function handleClick() {
    // This doesn't re-render the component!
    countRef.current = countRef.current + 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

</Sandpack>

これが、レンダー中に `ref.current` を読みこむと信頼性の低いコードになる理由です。それが必要な場合は、代わりに state を使用してください。

<DeepDive>

#### useRef の内部動作 {/*how-does-use-ref-work-inside*/}

`useState` と `useRef` は両方とも React によって提供される機能ですが、本質的には `useRef` は `useState` *をベースに*実装されているものです。React の内部では、`useRef` が以下のように実装されていると考えることができます。

```js
// Inside of React
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

最初のレンダー中に、`useRef` は `{ current: initialValue }` を返します。このオブジェクトは React によって保持されるため、次のレンダー時には同じオブジェクトが返されます。この例で、state のセッタは使われていないことに注意してください。`useRef` は常に同じオブジェクトを返す必要があるのですからセッタは不要です！

React が `useRef` を組み込み機能として提供しているのは、これが現実的によくある使用法だからです。しかし、ref をセッタのない通常の state 変数と考えることができます。オブジェクト指向プログラミングに慣れている場合、ref はインスタンスフィールドに似ていると感じるかもしれませんが、`this.something` の代わりに `somethingRef.current` と書きます。

</DeepDive>

## ref を使うタイミング {/*when-to-use-refs*/}

通常、ref を使用するのは、コンポーネントが React の外に「踏み出して」、外部 API（多くの場合はコンポーネントの外観に影響を与えないブラウザ API）と通信する必要がある場合です。以下は、そのような稀な状況の例です。

- [タイムアウト ID](https://developer.mozilla.org/docs/Web/API/setTimeout) の保存。
- [DOM 要素](https://developer.mozilla.org/docs/Web/API/Element)の保存と操作。これについては[次のページ](/learn/manipulating-the-dom-with-refs)で取り上げます。
- JSX を計算するために必要ではないその他のオブジェクトの保存。

コンポーネントが値を保存する必要があるがそれがレンダーロジックに影響しないという場合は、ref を選択してください。

## ref のベストプラクティス {/*best-practices-for-refs*/}

以下の原則に従うことで、コンポーネントがより予測可能になります。

- **ref を避難ハッチ (escape hatch) として扱う**。ref が有用なのは、外部システムやブラウザ API と連携する場合です。アプリケーションのロジックやデータフローの多くが ref に依存しているような場合は、アプローチを見直すことを検討してください。
- **レンダー中に `ref.current` を読み書きしない**。レンダー中に情報が必要な場合は、代わりに [state](/learn/state-a-components-memory) を使用してください。React は `ref.current` が書き換わったタイミングを把握しないため、レンダー中にただそれを読みこむだけでも、コンポーネントの挙動が予測しづらくなってしまいます。（唯一の例外は `if (!ref.current) ref.current = new Thing()` のような、最初のレンダー中に一度だけ ref をセットするコードです。）

React の state の制約は ref には適用されません。例えば、state は[各レンダーのスナップショット](/learn/state-as-a-snapshot)のように振る舞い、[同期的に更新されません](/learn/queueing-a-series-of-state-updates)。しかし、ref の現在値を書き換えると、すぐに変更されます。

```js
ref.current = 5;
console.log(ref.current); // 5
```

これは、**ref 自体は通常の JavaScript オブジェクト**に過ぎず、現にそのように振る舞うからです。

また、ref を使っている場合は、[ミューテーションを避ける](/learn/updating-objects-in-state)ことを考慮する必要もありません。書き換えようとしているオブジェクトがレンダーに使われない限り、React は ref やその内容に対してあなたが何を行っても気にしません。

## ref と DOM {/*refs-and-the-dom*/}

<<<<<<< HEAD
ref には任意の値を指すことができます。ただし、ref の最も一般的な使用例は、DOM 要素にアクセスすることです。例えば、プログラムで入力にフォーカスを当てたい場合に便利です。`<div ref={myRef}>` のようにして JSX の `ref` 属性に ref を渡すと、React は対応する DOM 要素を `myRef.current` に入れます。これについては、[ref で DOM を操作する](/learn/manipulating-the-dom-with-refs)で詳しく説明しています。
=======
You can point a ref to any value. However, the most common use case for a ref is to access a DOM element. For example, this is handy if you want to focus an input programmatically. When you pass a ref to a `ref` attribute in JSX, like `<div ref={myRef}>`, React will put the corresponding DOM element into `myRef.current`. Once the element is removed from the DOM, React will update `myRef.current` to be `null`. You can read more about this in [Manipulating the DOM with Refs.](/learn/manipulating-the-dom-with-refs)
>>>>>>> 68f417a600c7d7b8c4131e39f8a843a856ae3909

<Recap>

- ref は、レンダーに使用されない値を保持するための避難ハッチである。これは頻繁には必要ない。
- ref は、`current` という単一のプロパティを持つプレーンな JavaScript オブジェクトであり、読み取りや書き込みができる。
- `useRef` フックを呼び出すことで、React に ref を渡してもらう。
- state と同様に、ref はコンポーネントの再レンダー間で情報を保持することができる。
- state とは異なり、ref の `current` 値をセットしても再レンダーはトリガされない。
- レンダー中に `ref.current` を読み書きしてはならない。それをするとコンポーネントが予測困難になる。

</Recap>



<Challenges>

#### 壊れたチャット入力欄を修正 {/*fix-a-broken-chat-input*/}

メッセージを入力して "Send" をクリックしてください。"Sent!" アラートが表示されるまでに 3 秒の遅延があることに気付くでしょう。この遅延中に "Undo" ボタンが表示されます。それをクリックしてください。この "Undo" ボタンは、`handleSend` 中で保存されたタイムアウト ID に対して [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout) を呼び出すことで、"Sent!" メッセージが表示されないようにするはずのものです。しかし、"Undo" をクリックしても "Sent!" メッセージが表示されてしまいます。動作しない理由を探し、修正してください。

<Hint>

すべてのレンダーはコンポーネントのコードを最初から実行する（変数も初期化する）ため、`let timeoutID` のような通常の変数は、再レンダー間で「生き残る」ことはありません。タイムアウト ID を別の場所に保持する必要はないでしょうか？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  let timeoutID = null;

  function handleSend() {
    setIsSending(true);
    timeoutID = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutID);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

<Solution>

コンポーネントが（state のセットなどにより）再レンダーされるたびに、すべてのローカル変数は初期化されます。これが、`timeoutID` のようなローカル変数にタイムアウト ID を保存しても将来別のイベントハンドラがそれを「見える」ことを期待できない理由です。代わりに、レンダー間で React が保持する ref に保存しましょう。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const timeoutRef = useRef(null);

  function handleSend() {
    setIsSending(true);
    timeoutRef.current = setTimeout(() => {
      alert('Sent!');
      setIsSending(false);
    }, 3000);
  }

  function handleUndo() {
    setIsSending(false);
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <input
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        disabled={isSending}
        onClick={handleSend}>
        {isSending ? 'Sending...' : 'Send'}
      </button>
      {isSending &&
        <button onClick={handleUndo}>
          Undo
        </button>
      }
    </>
  );
}
```

</Sandpack>

</Solution>


#### 再レンダーに失敗するコンポーネントを修正 {/*fix-a-component-failing-to-re-render*/}

このボタンは、"On" と "Off" を表示するトグルボタンのはずです。しかし、常に "Off" が表示されます。このコードの何が問題なのでしょうか？ 修正してください。

<Sandpack>

```js
import { useRef } from 'react';

export default function Toggle() {
  const isOnRef = useRef(false);

  return (
    <button onClick={() => {
      isOnRef.current = !isOnRef.current;
    }}>
      {isOnRef.current ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

<Solution>

この例では、ref の現在値がレンダー出力の計算に使われています：`{isOnRef.current ? 'On' : 'Off'}`。つまりこの情報は ref にあるべきではなく、代わりに state に入れるべきだということです。修正するには ref を削除し、代わりに state を使用します。

<Sandpack>

```js
import { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => {
      setIsOn(!isOn);
    }}>
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
```

</Sandpack>

</Solution>

#### デバウンスの修正 {/*fix-debouncing*/}

この例では、すべてのボタンクリックハンドラが ["デバウンス (debounce)"](https://redd.one/blog/debounce-vs-throttle) されています。この意味を確認するために、ボタンのうちの 1 つを押してみてください。メッセージが 1 秒後に表示されることに気付くでしょう。メッセージを待っている間にボタンを押すと、タイマがリセットされます。ですので、同じボタンを素早く何度もクリックし続けると、メッセージはクリックを*やめた* 1 秒後まで表示されません。デバウンスにより、ユーザが「操作をやめる」まであるアクションを遅らせることができます。

この例は動作していますが、意図した通りではありません。ボタンが独立していないのです。問題を確認するために、ボタンのうちの 1 つをクリックし、すぐに別のボタンをクリックしてみてください。遅延の後、両方のボタンのメッセージが表示されることを期待するでしょう。しかし、最後のボタンのメッセージだけが表示され、最初のボタンのメッセージは失われてしまいます。

ボタンがお互いに干渉しているのはなぜでしょうか？ 問題を見つけて修正してください。

<Hint>

最後のタイムアウト ID 変数が、すべての `DebouncedButton` コンポーネント間で共有されています。これが、あるボタンをクリックすると、別のボタンのタイムアウトがリセットされる理由です。各ボタンに別々のタイムアウト ID を格納できますか？

</Hint>

<Sandpack>

```js
let timeoutID;

function DebouncedButton({ onClick, children }) {
  return (
    <button onClick={() => {
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

<Solution>

`timeoutID` のような変数は、すべてのコンポーネント間で共有されています。これが、2 つ目のボタンをクリックすると、最初のボタンの待機中のタイムアウトがリセットされてしまう理由です。これを修正するために、タイムアウトを ref に保持することができます。各ボタンは独自の ref を取得するため、互いに競合しません。2 つのボタンを素早くクリックすると、両方のメッセージが表示されることを確認してください。

<Sandpack>

```js
import { useRef } from 'react';

function DebouncedButton({ onClick, children }) {
  const timeoutRef = useRef(null);
  return (
    <button onClick={() => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onClick();
      }, 1000);
    }}>
      {children}
    </button>
  );
}

export default function Dashboard() {
  return (
    <>
      <DebouncedButton
        onClick={() => alert('Spaceship launched!')}
      >
        Launch the spaceship
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Soup boiled!')}
      >
        Boil the soup
      </DebouncedButton>
      <DebouncedButton
        onClick={() => alert('Lullaby sung!')}
      >
        Sing a lullaby
      </DebouncedButton>
    </>
  )
}
```

```css
button { display: block; margin: 10px; }
```

</Sandpack>

</Solution>

#### 最新の state を読む {/*read-the-latest-state*/}

この例では、"Send" ボタンを押した後、メッセージが表示されるまでにちいさな遅延があります。"hello" と入力して Send ボタンを押してから、すぐに入力欄を編集してみてください。編集したにもかかわらず、アラートには "hello"（ボタンがクリックされた[時点](/learn/state-as-a-snapshot#state-over-time)の state 値）が表示されます。

通常、これがアプリで望ましい動作です。ただしまれに、非同期コードで state の*最新*バージョンを読み取りたい場合があります。クリック時のテキストではなく、*現在*の入力テキストをアラートに表示する方法を考えてみてください。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + text);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

<Solution>

state は[スナップショットのように](/learn/state-as-a-snapshot)動作するため、タイムアウトのような非同期の操作から最新の state を読み取ることはできません。ただし、最新の入力テキストを ref に保持しておくことができます。ref は書き換え可能であるため、いつでも `current` プロパティを読み取ることができます。現在のテキストもレンダーに使用されるため、この例では、state 変数（レンダー用）*と* ref（タイムアウトで読み取るため）*の両方*が必要です。現在の ref 値は手動で更新する必要があります。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const textRef = useRef(text);

  function handleChange(e) {
    setText(e.target.value);
    textRef.current = e.target.value;
  }

  function handleSend() {
    setTimeout(() => {
      alert('Sending: ' + textRef.current);
    }, 3000);
  }

  return (
    <>
      <input
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={handleSend}>
        Send
      </button>
    </>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
