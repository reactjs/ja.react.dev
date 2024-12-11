---
title: startTransition
---

<Intro>

`startTransition` を使うことで、UI を部分的にバックグラウンドでレンダーできるようになります。

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

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

* `action`: 1 つ以上の [`set` 関数](/reference/react/useState#setstate)を呼び出して state を更新する関数。React は引数なしで直ちに `action` を呼び出し、`action` 関数呼び出し中に同期的にスケジュールされたすべての state 更新をトランジションとしてマークします。`action` 内で await されている非同期関数のコールもトランジションに含まれるべきですが、現時点では `await` の後に来る `set` 関数は別の `startTransition` にラップする必要があります（[トラブルシューティング](#react-doesnt-treat-my-state-update-after-await-as-a-transition)参照）。トランジションとしてマークされた state の更新は[ノンブロッキング](#marking-a-state-update-as-a-non-blocking-transition)になり、[不要なローディングインジケータを表示しない](#preventing-unwanted-loading-indicators)ようになります。

#### 返り値 {/*returns*/}

`startTransition` は何も返しません。

#### 注意点 {/*caveats*/}

* `startTransition` は、トランジションが保留中 (pending) であるかどうかを知るための方法を提供しません。トランジションの進行中にインジケータを表示するには、代わりに [`useTransition`](/reference/react/useTransition) が必要です。

* state の `set` 関数にアクセスできる場合にのみ、state 更新をトランジションにラップできます。ある props やカスタムフックの値に反応してトランジションを開始したい場合は、代わりに [`useDeferredValue`](/reference/react/useDeferredValue) を試してみてください。

* `startTransition` に渡された関数は即座に呼び出され、その関数の実行中に発生するすべての state 更新がトランジションとしてマークされます。しかし例えば、`setTimeout` 内で state を更新しようとした場合は、それはトランジションとしてマークされません。

* 非同期リクエスト後に state 更新を行いたい場合は、トランジションとしてマークするために別の `startTransition` でラップする必要があります。これは既知の制限であり、将来的に修正される予定です（詳細は[トラブルシューティング](#react-doesnt-treat-my-state-update-after-await-as-a-transition)を参照してください）。

* トランジションとしてマークされた state 更新は、他の state 更新によって中断されます。例えば、トランジション内でチャートコンポーネントを更新した後、チャートの再レンダーの途中で入力フィールドに入力を始めた場合、React は入力欄の更新の処理後にチャートコンポーネントのレンダー作業を再開します。

* トランジションによる更新はテキスト入力欄の制御には使用できません。

* 進行中のトランジションが複数ある場合、React は現在それらをひとつに束ねる処理を行います。この制限は将来のリリースでは削除される可能性があります。

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
