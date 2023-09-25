---
title: state はスナップショットである
---

<Intro>

state 変数は、読んだり書いたりできる普通の JavaScript の変数のように見えるかもしれません。しかし、state はむしろ、スナップショットのように振る舞います。state をセットしても、既にある state 変数は変更されず、代わりに再レンダーがトリガされます。

</Intro>

<YouWillLearn>

* state のセットが再レンダーをどのようにトリガするのか
* state がいつどのように更新されるか
* state がセットされた直後に更新されない理由
* イベントハンドラが state の「スナップショット」にどのようにアクセスするのか

</YouWillLearn>

## state のセットでレンダーがトリガされる {/*setting-state-triggers-renders*/}

ユーザインターフェースとはクリックなどのユーザイベントに直接反応して更新されるものだ、と考えているかもしれません。React の動作は、このような考え方とは少し異なります。前のページで、[state をセットすることで再レンダーを React に要求](/learn/render-and-commit#step-1-trigger-a-render)しているのだ、ということを見てきました。これは、インターフェースがイベントに応答するためには、*state を更新*する必要があることを意味します。

この例では、"Send" を押すと、`setIsSent(true)` が React に UI の再レンダーを指示します。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');
  if (isSent) {
    return <h1>Your message is on its way!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

ボタンをクリックすると次のような処理が行われます：

1. `onSubmit` イベントハンドラが実行されます。
2. `setIsSent(true)` が `isSent` を `true` にセットし、新しいレンダーを予約します。
3. React が新しい `isSent` の値を使ってコンポーネントを再レンダーします。

state とレンダーの関係をもう少し詳しく見ていきましょう。

## レンダーは時間を切り取ってスナップショットを取る {/*rendering-takes-a-snapshot-in-time*/}

[「レンダーする」](/learn/render-and-commit#step-2-react-renders-your-components)とは、React があなたのコンポーネント（関数）を呼び出すということです。関数から返される JSX は、その時点での UI のスナップショットのようなものです。その JSX 内の props、イベントハンドラ、ローカル変数はすべて、**レンダー時の state を使用して計算されます**。

写真や映画のフレームとは違い、返される「UI のスナップショット」はインタラクティブです。イベントハンドラのような、入力に対する応答を指定するためのロジックが含まれています。React は画面をこのスナップショットに合わせて更新し、イベントハンドラを接続します。その結果として、ボタンを押すと JSX に書いたクリックハンドラがトリガされます。

React がコンポーネントを再レンダーする際には：

<<<<<<< HEAD
1. React が再度あなたの関数を呼び出します。
2. 関数は新しい JSX のスナップショットを返します。
3. React は返されたスナップショットに合わせて画面を更新します。
=======
1. React calls your function again.
2. Your function returns a new JSX snapshot.
3. React then updates the screen to match the snapshot your function returned.
>>>>>>> 2390627c9cb305216e6bd56e67c6603a89e76e7f

<IllustrationBlock sequential>
    <Illustration caption="React が関数を実行" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="スナップショットを計算" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="DOM ツリーを更新" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

コンポーネントのメモリとしての state は、関数が終了したら消えてしまう通常の変数とは異なります。state は実際には React 自体の中で「生存」しています。まるで棚に保管しているかのように、関数の外部で存在し続けます。React がコンポーネントを呼び出すとき、React はその特定のレンダーに対する state のスナップショットを提供します。あなたのコンポーネントは、props やイベントハンドラの新たな一式を揃えた JSX という形で UI のスナップショットを返し、それらはすべて**その特定のレンダー時の state の値を使って計算されます！**

<IllustrationBlock sequential>
  <Illustration caption="state の更新を React に指示" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React が state の値を更新" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React がコンポーネントに state のスナップショットを渡す" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

これがどのように動作するかを示す小さな実験をしましょう。この例では、"+3" ボタンをクリックすると `setNumber(number + 1)` を 3 回呼び出すので、カウンタが 3 回インクリメントされると予想するかもしれません。

"+3" ボタンをクリックすると何が起こるか見てみましょう。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

`number` がクリックごとに 1 しか増えていませんね！

**state をセットしても、それが本当に変更されるのは*次回の*レンダーです**。最初のレンダーでは `number` が `0` でした。だから、*そのレンダーの* `onClick` ハンドラにおいては、`setNumber(number + 1)` が呼ばれた後も `number` が `0` のままだったのです。

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

このボタンのクリックハンドラは、以下のように React に指示しています。

1. `setNumber(number + 1)`: `number` が `0` なので `setNumber(0 + 1)`。
    - React は次回のレンダーで `number` を `1` に更新する準備をする。
2. `setNumber(number + 1)`: `number` が `0` なので `setNumber(0 + 1)`。
    - React は次回のレンダーで `number` を `1` に更新する準備をする。
3. `setNumber(number + 1)`: `number` が `0` なので `setNumber(0 + 1)`。
    - React は次回のレンダーで `number` を `1` に更新する準備をする。

`setNumber(number + 1)` を 3 回呼び出しましたが、*今回のレンダーの*イベントハンドラでは `number` は常に `0` なので、state を 3 回連続して `1` にセットしていることになります。これが、イベントハンドラが終了した後、React が `number` を `3` ではなく `1` とした上でコンポーネントを再レンダーする理由です。

もっと分かりやすくするために、頭の中でコード内の state 変数を実際の値に置換してみることもできます。*このレンダーでは* `number` という state 変数は `0` なので、イベントハンドラは次のようになっています。

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

次のレンダーでは、`number` が `1` になるため、*そちらのレンダーの* クリックハンドラは、次のようになります。

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

以上が、ボタンを再度クリックするとカウンタが `2` にセットされ、次のクリックでは `3` にセットされ、というようになる理由です。

## 時間経過と state {/*state-over-time*/}

なかなか面白い話でした。それでは、このボタンをクリックするとアラートに何が表示されるか予想してみてください。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

上記で説明した置換メソッドを使えば、アラートには "0" と表示されることがわかりますね。

```js
setNumber(0 + 5);
alert(0);
```

でも、アラートにタイマーを設定して、コンポーネントが再レンダーされた*後に*発火するようにしたらどうなるでしょうか？ "0" と表示されるのか、"5" と表示されるのか推測してみてください。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

驚いたでしょうか？ さきほどの置換メソッドを使ってみれば、アラートに渡された state が「スナップショット」であることが分かるでしょう。

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

アラートが実行される時点では React に格納されている state は既に更新されているかもしれませんが、アラートはユーザがボタンを操作した時点での state のスナップショットを使ってスケジューリングされました！

イベントハンドラのコードが非同期であっても、**レンダー内の state 変数の値は決して変わりません**。*そのレンダーの* `onClick` 内では、`setNumber(number + 5)` が呼ばれた後も `number` の値は `0` のままです。その値は React があなたのコンポーネントを呼び出して UI の「スナップショットを取った」時に、「固定」されたのです。

ここで、このお陰でタイミングにまつわる問題が起きづらくなっている、という例をお示しします。以下のフォームは、5 秒の遅延後にメッセージを送信します。ここでこんなシナリオを想像してみてください：

1. "Send" ボタンを押して、"Hello" というメッセージをアリスに送る。
2. 5 秒の遅延が終わる前に、"To" フィールドの値を "Bob" に変更する。

`alert` に何が表示されると思いますか？ "You said Hello to Alice" と表示されるのでしょうか？ それとも "You said Hello to Bob" でしょうか？ ここまでの知識に基づいて推測し、実際に試してみましょう。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

**React は、レンダー内の state の値を「固定」し、イベントハンドラ内で保持します**。コードが実行されている途中で state が変更されたかどうか心配する必要はありません。

しかし、再レンダー前に最新の state を読み取りたい場合はどうでしょうか？ [state 更新用関数](/learn/queueing-a-series-of-state-updates)を使うことができます。これについては次のページで説明します！

<Recap>

- state のセットは新しいレンダーをリクエストする。
- React は state をコンポーネントの外側で、まるで棚に保管しておくかのようにして保持する。
- `useState` を呼び出すと、React は*そのレンダーのための* state のスナップショットを返す。
- 変数やイベントハンドラは複数レンダーをまたいで「生き残る」ことはない。すべてのレンダーは固有のイベントハンドラを持つ。
- 各レンダー（およびその中の関数）からは、常に、React が *その*レンダーに渡した state のスナップショットが「見える」。
- レンダーされた JSX を考える時と同様にして、イベントハンドラ内の state を頭の中で実際の値に置換してみることができる。
- 過去に作成されたイベントハンドラは、それが作成されたレンダーにおける state の値を持っている。

</Recap>



<Challenges>

#### 信号機を実装 {/*implement-a-traffic-light*/}

以下は、ボタンが押されると切り替わる歩行者用信号機のコンポーネントです。

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

クリックハンドラに `alert` を追加してください。信号が緑で "Walk" と表示されている場合、ボタンをクリックすると "Stop is next" と表示され、信号が赤で "Stop" と表示されている場合、ボタンをクリックすると "Walk is next" と表示されるようにしてください。

`alert` を `setWalk` の前に置いた場合と後に置いた場合で、違いはありますか？

<Solution>

`alert` は以下のように書けます。

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Stop is next' : 'Walk is next');
  }

  return (
    <>
      <button onClick={handleClick}>
        Change to {walk ? 'Stop' : 'Walk'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Walk' : 'Stop'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

`alert` を `setWalk` の前に置いた場合と後に置いた場合で、違いはありません。このレンダー中、`walk` の値は固定です。`setWalk` を呼び出しても、*次の*レンダーまで実際の変更は起きず、現在レンダーのイベントハンドラには影響しません。

この行は最初は直感に反しているように思えるかもしれません。

```js
alert(walk ? 'Stop is next' : 'Walk is next');
```

しかし、これを「もし信号が今 "Walk" を表示しているなら、メッセージは "Stop is next" と言うべきだ」のように読めば、理に適っていることが分かります。イベントハンドラ内の `walk` 変数は、そのレンダーの `walk` の値と一致しており、変わることはありません。

上記で説明している置換メソッドを適用して、このことが正しいことを確認することができます。`walk` が `true` の場合、次のようになります。

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

すなわち、"Change to Stop" をクリックすると、`walk` が `false` にセットされたレンダーがキューに入り、"Stop is next" というアラートが表示されます。

</Solution>

</Challenges>
