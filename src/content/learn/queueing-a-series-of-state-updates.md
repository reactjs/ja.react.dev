---
title: 一連の state の更新をキューに入れる
---

<Intro>

state 変数をセットすることで、新しいレンダーがキューに予約されます。しかし、次のレンダーをキューに入れる前に、state の値に対して複数の操作を行いたい場合があります。このためには、React が state の更新をどのようにバッチ処理（batching, 一括処理）するのかについて理解することが役立ちます。

</Intro>

<YouWillLearn>

* 「バッチ処理」とは何か、React が複数の state 更新を処理する際にどのように使用されるのか
* 同じ state 変数に対し連続して複数の更新を適用する方法

</YouWillLearn>

## React は state 更新をまとめて処理する {/*react-batches-state-updates*/}

以下で "+3" ボタンをクリックした場合、`setNumber(number + 1)` を 3 回呼び出しているので、カウンタが 3 回インクリメントされると思うかもしれません。

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

しかし、前のセクションで説明したように、[個々のレンダー内の state 値は固定です](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)。従って `setNumber(1)` を何度呼び出しても、最初のレンダー内ではイベントハンドラ内の `number` の値は常に `0` です。

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

しかしながら、ここにもう 1 つ別の要素が関わってきます。**イベントハンドラ内のすべてのコードが実行されるまで、React は state の更新処理を待機します**。このため、再レンダーはこれらの `setNumber()` 呼び出しがすべて終わった後で行われます。

レストランで注文を取るウェイターの話を思い出すかもしれません。ウェイターは最初の料理の注文を聞いた瞬間にキッチンにかけこむわけではありません！ 代わりに、客の注文を最後まで聞き、訂正がある場合はそれも聞き取り、さらにはテーブルの他の客からの注文もまとめて受け取るはずです。

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="レストランで何度も注文をしている客と、それを聞き取っているウェイターである React。客が何度も setState() したとしても、ウェイターは最後のものだけを注文として聞き取って用紙に書き込む。" />

これにより、複数の state 変数（複数のコンポーネントからの場合も含む）の更新を、[再レンダー](/learn/render-and-commit#re-renders-when-state-updates)をあまりに頻繁にトリガすることなしに行うことができます。これは、イベントハンドラおよびその中のコードがすべて完了した*後*まで、UI は更新されないということでもあります。このような動作は**バッチ処理**（バッチング）とも呼ばれ、これにより React アプリの動作がずっと高速になります。またこれは、変数のうち一部のみが更新された「中途半端な」レンダー結果に混乱させられずに済むということでもあります。

**React は、クリックのような意図的に引き起こされるイベントが*複数*ある場合、それらのバッチ処理を行いません**。各クリックは別々に処理されます。React は一般的に安全と判断される場合にのみバッチ処理を行いますので、安心してください。たとえば、最初のボタンクリックでフォームを無効にしたのであれば、2 度目のクリックでフォームが再び送信されてしまわないことが保証されます。

## 次のレンダー前に同じ state を複数回更新する {/*updating-the-same-state-multiple-times-before-the-next-render*/}

一般的なユースケースではありませんが、次のレンダー前に同じ state 変数を複数回更新する場合、`setNumber(number + 1)` のようにして*次の state 値*を渡す代わりに、`setNumber(n => n + 1)` のようにキュー内のひとつ前の state に基づいて次の state を計算する*関数*を渡すことができます。これは、state の値を単に置き換える代わりに、React に「その state の値に対してこのようにせよ」と伝えるための手段です。

このカウンタをインクリメントしてみてください。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
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

ここで、`n => n + 1` は**更新用関数 (updater function)** と呼ばれます。これを state のセッタに渡すと：

1. React はこの関数をキューに入れて、イベントハンドラ内の他のコードがすべて実行された後に処理されるようにします。
2. 次のレンダー中に、React はキューを処理し、最後に更新された state を返します。

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

以下に、イベントハンドラを実行するときに、React はこれらのコードをどのように処理するかを示します。

1. `setNumber(n => n + 1)`: `n => n + 1` は関数。React はこれをキューに追加する。
1. `setNumber(n => n + 1)`: `n => n + 1` は関数。React はこれをキューに追加する。
1. `setNumber(n => n + 1)`: `n => n + 1` は関数。React はこれをキューに追加する。

次のレンダー中に `useState` が呼び出されると、React はこのキューを処理します。前回 `number` という state の値は `0` だったので、それがひとつ目の更新用関数の引数 `n` に渡されます。React はひとつ前の更新用関数の返り値を取得し、それを次の更新用関数の `n` に渡し、というように続いていきます：

| キュー内の更新処理 | `n` | 返り値 |
|--------------|---------|-----|
| `n => n + 1` | `0` | `0 + 1 = 1` |
| `n => n + 1` | `1` | `1 + 1 = 2` |
| `n => n + 1` | `2` | `2 + 1 = 3` |

React は `3` を最終結果として保存し、`useState` から返します。

以上が、上記の例で "+3" をクリックすると、値が正しく 3 ずつ増加する理由です。
### state を置き換えた後に更新するとどうなるか {/*what-happens-if-you-update-state-after-replacing-it*/}

では、このイベントハンドラはどうでしょうか？ 次回のレンダーで `number` の値はどうなっていると思いますか？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

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
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

このイベントハンドラでは、React に次のように指示しています。

1. `setNumber(number + 5)`: `number` は `0` なので、`setNumber(0 + 5)`。React はキューに *"`5` に置き換えよ"* という命令を追加する。
2. `setNumber(n => n + 1)`: `n => n + 1` は更新用関数。React は*その関数*をキューに追加する。

次のレンダー時、React は state 更新キューを処理します。

| キュー内の更新処理 | `n` | 返り値 |
|--------------|---------|-----|
| "`5` に置き換えよ" | `0` (未使用) | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |

React は `6` を最終結果として保存し、`useState` から返します。

<Note>

お気づきかもしれませんが、`setState(5)` とは、実際には `n` の使用されない `setState(n => 5)` と同じように動作します！

</Note>

### state を更新した後に置き換えるとどうなるか {/*what-happens-if-you-replace-state-after-updating-it*/}

もうひとつ別の例を試してみましょう。次回のレンダーで `number` は何になると思いますか？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

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
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

このイベントハンドラを実行する際、React は以下の順番でコードを処理します。

1. `setNumber(number + 5)`: `number` は `0` なので `setNumber(0 + 5)`。React はキューに *"`5` に置き換えよ"* という命令を追加する。
2. `setNumber(n => n + 1)`: `n => n + 1` は更新用関数。React は*その関数*をキューに追加する。
3. `setNumber(42)`: React はキューに *"`42` に置き換えよ"* という命令を追加する。

次のレンダー中に、React は state 更新キューを処理します。

|   キュー内の更新処理       | `n` | 返り値 |
|--------------|---------|-----|
| "`5` に置き換えよ" | `0` （未使用） | `5` |
| `n => n + 1` | `5` | `5 + 1 = 6` |
| "`42` に置き換えよ" | `6` （未使用） | `42` |

というわけで、React は最終結果として `42` を保存し、`useState` から返します。

まとめると、`setNumber` という state セッタに渡すものを、以下のように考えることができます。

* **更新用関数**（例：`n => n + 1`）の場合、それがキューに追加されます。
* **それ以外の値**（例：数値 `5`）の場合、ここまでのキューの内容を無視する "`5` に置き換えよ" のような命令を追加します。

イベントハンドラが完了した後、React は再レンダーをトリガします。再レンダー中に React はキューを処理します。アップデート関数はレンダー中に実行されるため、**更新用関数は[純関数](/learn/keeping-components-pure)である必要があり**、結果だけを*返す*ようにする必要があります。その中で state をセットしたり、他の副作用を実行したりしないでください。Strict Mode では、React は各更新用関数を 2 回実行します（ただし 2 つ目の結果は破棄されます）が、これによって間違いを見つけやすくなります。

### 命名規則 {/*naming-conventions*/}

対応する state 変数の頭文字を使って更新用関数の引数の名前を付けることが一般的です。

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

もっと長いコードが好きな場合、別の一般的な慣習としては、`setEnabled(enabled => !enabled)` のように完全な state 変数名を繰り返すか、`setEnabled(prevEnabled => !prevEnabled)` のようなプレフィクスを使用することがあります。

<Recap>

* state をセットしても既存のレンダーの変数は変更されず、代わりに新しいレンダーが要求される。
* React は、イベントハンドラが完了してから state の更新を処理する。これをバッチ処理と呼ぶ。
* 1 つのイベントで複数回 state を更新したい場合 `setNumber(n => n + 1)` という形の更新用関数を使用できる。

</Recap>



<Challenges>

#### リクエストカウンタの修正 {/*fix-a-request-counter*/}

あなたは、ユーザが美術品に対して複数の注文処理を同時並行で行える、アートマーケットアプリの開発をしています。ユーザが "Buy" ボタンを押すたびに、"Pending"（処理中）カウンタが 1 つずつ増えるようにする必要があります。3 秒後に "Pending" カウンタが 1 減り、"Completed" カウンタが 1 増える必要があります。

しかし、"Pending" カウンタは意図した通りに動作していません。"Buy" を押すと、"Pending" が `-1` に減少します（あり得ない！）。また、2 回素早くクリックすると、両方のカウンタが予測不可能な挙動を示します。

なぜこれが起こるのでしょうか？ 両方のカウンタを修正してください。

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

`handleClick` イベントハンドラ内では、`pending` と `completed` の値はクリックイベントが起きた時点での値に対応しています。最初のレンダーでは、`pending` は `0` だったため、`setPending(pending - 1)` は `setPending(-1)` となり、これは間違いです。カウンタを*インクリメント*または*デクリメント*したいので、クリック時に決まる具体的な値をセットするのではなく、代わりに更新用関数を渡すことができます。

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Pending: {pending}
      </h3>
      <h3>
        Completed: {completed}
      </h3>
      <button onClick={handleClick}>
        Buy     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

これにより、カウンタをインクリメントまたはデクリメントする際に、クリック時の state ではなく、最新の state に対して行われることが保証されます。

</Solution>

#### state キューの独自実装 {/*implement-the-state-queue-yourself*/}

このチャレンジ問題では、React のごく一部をゼロから再実装します！ それほど難しくありません。

サンドボックスプレビューをスクロールしてください。**4 つのテストケース**が表示されていることに注意してください。それらはこのページの先ほどの例に対応しています。あなたの仕事は、`getFinalState` 関数を実装して、それぞれのケースに対して正しい結果を返すことです。正しく実装すると、すべてのテストが通るはずです。

2 つの引数を受け取ることになります。`baseState` は初期 state（例えば `0`）であり、`queue` は数値（例えば `5`）または更新用関数（例えば `n => n + 1`）のいずれかが、キューに入れられた順番で入っている配列です。

あなたの仕事は、このページ内の表で見たような処理を行って、最終的な state を返すことです！

<Hint>

難しいと感じたら、次のコード構造から始めてください：

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: apply the updater function
    } else {
      // TODO: replace the state
    }
  }

  return finalState;
}
```

足りない行を埋めてください！

</Hint>

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: do something with the queue...

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

以下が、このページで説明してきたような形で React が最終 state を計算するために使用しているアルゴリズムそのものです：

<Sandpack>

```js processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Apply the updater function.
      finalState = update(finalState);
    } else {
      // Replace the next state.
      finalState = update;
    }
  }

  return finalState;
}
```

```js App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Base state: <b>{baseState}</b></p>
      <p>Queue: <b>[{queue.join(', ')}]</b></p>
      <p>Expected result: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Your result: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'correct' :
          'wrong'
        })
      </p>
    </>
  );
}
```

</Sandpack>

これで、この部分で React がどのように動作するのかが分かりましたね！

</Solution>

</Challenges>