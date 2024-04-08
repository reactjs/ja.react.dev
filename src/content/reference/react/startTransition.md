---
title: startTransition
---

<Intro>

`startTransition` を使うことで、UI をブロックせずに state を更新することができます。

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

<<<<<<< HEAD
`startTransition` 関数を使用すると、state の更新をトランジションとしてマークすることができます。
=======
The `startTransition` function lets you mark a state update as a Transition.
>>>>>>> 93177e6ceac8ffb5c2a8f3ed4bd1f80b63097078

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

<<<<<<< HEAD
* `scope`: 1 つ以上の [`set` 関数](/reference/react/useState#setstate)を呼び出して state を更新する関数。React は引数なしで直ちに `scope` を呼び出し、`scope` 関数呼び出し中に同期的にスケジュールされたすべての state 更新をトランジションとしてマークします。このような更新は[ノンブロッキング](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)になり、[不要なローディングインジケータを表示しない](/reference/react/useTransition#preventing-unwanted-loading-indicators)ようになります。
=======
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 93177e6ceac8ffb5c2a8f3ed4bd1f80b63097078

#### 返り値 {/*returns*/}

`startTransition` は何も返しません。

#### 注意点 {/*caveats*/}

<<<<<<< HEAD
* `startTransition` は、トランジションが保留中 (pending) であるかどうかを知るための方法を提供しません。トランジションの進行中にインジケータを表示するには、代わりに [`useTransition`](/reference/react/useTransition) が必要です。

* state の `set` 関数にアクセスできる場合にのみ、state 更新をトランジションにラップできます。ある props やカスタムフックの値に反応してトランジションを開始したい場合は、代わりに [`useDeferredValue`](/reference/react/useDeferredValue) を試してみてください。

* `startTransition` に渡す関数は同期的でなければなりません。React はこの関数を直ちに実行し、その実行中に行われるすべての state 更新をトランジションとしてマークします。後になって（例えばタイムアウト内で）さらに state 更新をしようとすると、それらはトランジションとしてマークされません。

* トランジションとしてマークされた state 更新は、他の state 更新によって中断されます。例えば、トランジション内でチャートコンポーネントを更新した後、チャートの再レンダーの途中で入力フィールドに入力を始めた場合、React は入力欄の更新の処理後にチャートコンポーネントのレンダー作業を再開します。
=======
* `startTransition` does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
>>>>>>> 93177e6ceac8ffb5c2a8f3ed4bd1f80b63097078

* トランジションによる更新はテキスト入力欄の制御には使用できません。

<<<<<<< HEAD
* 進行中のトランジションが複数ある場合、React は現在それらをひとつに束ねる処理を行います。この制限は将来のリリースではおそらく削除されます。
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> 93177e6ceac8ffb5c2a8f3ed4bd1f80b63097078

---

## 使用法 {/*usage*/}

<<<<<<< HEAD
### state 更新をノンブロッキングのトランジションとしてマークする {/*marking-a-state-update-as-a-non-blocking-transition*/}

state 更新を*トランジション*としてマークするには、それを `startTransition` の呼び出しでラップします。
=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *Transition* by wrapping it in a `startTransition` call:
>>>>>>> 93177e6ceac8ffb5c2a8f3ed4bd1f80b63097078

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

トランジションを使用することで、遅いデバイスでもユーザインターフェースの更新をレスポンシブに保つことができます。

<<<<<<< HEAD
トランジションを使用すると、再レンダーの途中でも UI がレスポンシブに保たれます。例えば、ユーザがタブをクリックしたが、その後気が変わって別のタブをクリックする場合、最初の再レンダーが終了するのを待つことなくそれを行うことができます。

<Note>

`startTransition` は [`useTransition`](/reference/react/useTransition) と非常に似ていますが、トランジションが進行中かどうかを追跡する `isPending` フラグを提供しない点が異なります。`useTransition` が利用できない場合でも `startTransition` を呼び出すことができます。例えば、`startTransition` はコンポーネントの外部、たとえばデータライブラリ内でも動作します。

[`useTransition` ページでトランジションについて学び、例を見ることができます](/reference/react/useTransition)。
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.

<Note>

`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a Transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.

[Learn about Transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
>>>>>>> 93177e6ceac8ffb5c2a8f3ed4bd1f80b63097078

</Note>
