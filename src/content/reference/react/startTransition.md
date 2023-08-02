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

`startTransition` 関数を使用すると、state の更新をトランジションとしてマークすることができます。

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

* `scope`: 1 つ以上の [`set` 関数](/reference/react/useState#setstate)を呼び出して state を更新する関数。React は引数なしで直ちに `scope` を呼び出し、`scope` 関数呼び出し中に同期的にスケジュールされたすべての state 更新をトランジションとしてマークします。このような更新は[ノンブロッキング](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)になり、[不要なローディングインジケータを表示しない](/reference/react/useTransition#preventing-unwanted-loading-indicators)ようになります。

#### 返り値 {/*returns*/}

`startTransition` は何も返しません。

#### 注意点 {/*caveats*/}

* `startTransition` は、トランジションが保留中 (pending) であるかどうかを知るための方法を提供しません。トランジションの進行中にインジケータを表示するには、代わりに [`useTransition`](/reference/react/useTransition) が必要です。

* state の `set` 関数にアクセスできる場合にのみ、state 更新をトランジションにラップできます。ある props やカスタムフックの値に反応してトランジションを開始したい場合は、代わりに [`useDeferredValue`](/reference/react/useDeferredValue) を試してみてください。

* `startTransition` に渡す関数は同期的でなければなりません。React はこの関数を直ちに実行し、その実行中に行われるすべての state 更新をトランジションとしてマークします。後になって（例えばタイムアウト内で）さらに state 更新をしようとすると、それらはトランジションとしてマークされません。

* トランジションとしてマークされた state 更新は、他の state 更新によって中断されます。例えば、トランジション内でチャートコンポーネントを更新した後、チャートの再レンダーの途中で入力フィールドに入力を始めた場合、React は入力欄の更新の処理後にチャートコンポーネントのレンダー作業を再開します。

* トランジションによる更新はテキスト入力欄の制御には使用できません。

* 進行中のトランジションが複数ある場合、React は現在それらをひとつに束ねる処理を行います。この制限は将来のリリースではおそらく削除されます。

---

## 使用法 {/*usage*/}

### state 更新をノンブロッキングのトランジションとしてマークする {/*marking-a-state-update-as-a-non-blocking-transition*/}

state 更新を*トランジション*としてマークするには、それを `startTransition` の呼び出しでラップします。

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

トランジションを使用すると、再レンダーの途中でも UI がレスポンシブに保たれます。例えば、ユーザがタブをクリックしたが、その後気が変わって別のタブをクリックする場合、最初の再レンダーが終了するのを待つことなくそれを行うことができます。

<Note>

`startTransition` は [`useTransition`](/reference/react/useTransition) と非常に似ていますが、トランジションが進行中かどうかを追跡する `isPending` フラグを提供しない点が異なります。`useTransition` が利用できない場合でも `startTransition` を呼び出すことができます。例えば、`startTransition` はコンポーネントの外部、たとえばデータライブラリ内でも動作します。

[`useTransition` ページでトランジションについて学び、例を見ることができます](/reference/react/useTransition)。

</Note>
