---
title: useActionState
---

<Intro>

`useActionState` は、[アクション (Action)](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions) を使って副作用を伴う state 更新を行うための React フックです。

```js
const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState, permalink?);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useActionState(reducerAction, initialState, permalink?)` {/*useactionstate*/}

コンポーネントのトップレベルで `useActionState` を呼び出し、アクションの結果に対応する state を作成します。

```js
import { useActionState } from 'react';

function reducerAction(previousState, actionPayload) {
  // ...
}

function MyCart({initialState}) {
  const [state, dispatchAction, isPending] = useActionState(reducerAction, initialState);
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reducerAction`: アクションがトリガされたときに呼び出される関数。呼び出されると、1 番目の引数として前回の state（初回は渡した `initialState`、以降は前回の返り値）を受け取り、その後に `dispatchAction` に渡された `actionPayload` を受け取ります。
* `initialState`: state の初期値として使いたい値。`dispatchAction` が初めて呼び出された後、React はこの引数を無視します。
* **省略可能** `permalink`: このフォームが変更する一意なページ URL を含む文字列。
  * [React Server Components](/reference/rsc/server-components) を使うページで、プログレッシブエンハンスメントと組み合わせる場合に使用します。
  * `reducerAction` が[サーバ関数](/reference/rsc/server-functions)であり、かつ JavaScript バンドルの読み込み完了前にフォームが送信された場合、ブラウザは現在のページ URL ではなく指定された permalink URL に移動します。

#### 返り値 {/*returns*/}

`useActionState` は厳密に 3 つの値を持つ配列を返します。

1. 現在の state。初回レンダー中は、渡した `initialState` と一致します。`dispatchAction` が呼び出された後は、`reducerAction` が返した値と一致します。
2. [アクション](/reference/react/useTransition#functions-called-in-starttransition-are-called-actions)内で呼び出す `dispatchAction` 関数。
3. このフックでディスパッチされたアクションのうち、保留中のものがあるかどうかを知らせる `isPending` フラグ。

#### 注意点 {/*caveats*/}

* `useActionState` はフックなので、呼び出せるのは**コンポーネントのトップレベル**または独自フックの内部だけです。ループや条件分岐の中では呼び出せません。その必要がある場合は、新しいコンポーネントを切り出して state をそこへ移動してください。
* React は `dispatchAction` の複数回の呼び出しをキューに入れ、順番に実行します。`reducerAction` の各呼び出しは、前回の呼び出し結果を受け取ります。
* `dispatchAction` 関数は安定した同一性を持つため、エフェクトの依存配列から省略されることが多いですが、含めてもエフェクトが発火することはありません。リンタが依存値の省略をエラーにしない場合、省略しても安全です。[エフェクトの依存値を削除する方法について詳しく学ぶ](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)。
* `permalink` オプションを使う場合は、移動先ページでも同じフォームコンポーネント（同じ `reducerAction` と `permalink` を含む）がレンダーされるようにしてください。これにより React は state をどう受け渡すかを認識できます。ページがインタラクティブになった後は、この引数は効果を持ちません。
* サーバ関数 (Server Function) を使う場合、`initialState` は[シリアライズ可能](/reference/rsc/use-server#serializable-parameters-and-return-values)（プレーンオブジェクト、配列、文字列、数値などの値）である必要があります。
* `dispatchAction` がエラーをスローした場合、React はキューに入っているすべてのアクションをキャンセルし、最も近い[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)を表示します。
* 進行中のアクションが複数ある場合、React はそれらをまとめてバッチ処理します。これは将来のリリースで取り除かれる可能性のある制限です。

<Note>

`dispatchAction` はアクションから呼び出す必要があります。

[`startTransition`](/reference/react/startTransition) でラップするか、[アクションプロップ](/reference/react/useTransition#exposing-action-props-from-components)に渡すことができます。そのスコープ外での呼び出しはトランジションの一部として扱われず、開発モードでは[エラーがログ出力されます](#async-function-outside-transition)。

</Note>

---

### `reducerAction` 関数 {/*reduceraction*/}

`useActionState` に渡す `reducerAction` 関数は、前回の state を受け取り、新しい state を返すものです。

`useReducer` のリデューサとは異なり、`reducerAction` は非同期にでき、副作用を実行可能です。

```js
async function reducerAction(previousState, actionPayload) {
  const newState = await post(actionPayload);
  return newState;
}
```

`dispatchAction` を呼び出すたびに、React は `actionPayload` を引数にして `reducerAction` を呼び出します。リデューサはデータの投稿などの副作用を実行し、新しい state を返します。`dispatchAction` が複数回呼び出された場合、React はそれらをキューに入れて順番に実行するため、前回の呼び出し結果が現在の呼び出しの `previousState` として渡されます。

#### 引数 {/*reduceraction-parameters*/}

* `previousState`: 直近の state。初回は `initialState` と等しくなります。`dispatchAction` の最初の呼び出し後は、直近に返された state と等しくなります。

* **省略可能** `actionPayload`: `dispatchAction` に渡される引数。任意の型の値にできます。通常は `useReducer` の慣例と同様、アクションを識別する `type` プロパティと、必要に応じて追加情報を持つその他のプロパティを含むオブジェクトにします。

#### 返り値 {/*reduceraction-returns*/}

`reducerAction` は新しい state を返し、その state で再レンダーするためのトランジションをトリガします。

#### 注意点 {/*reduceraction-caveats*/}

* `reducerAction` は同期関数にも非同期関数にもできます。通知の表示のような同期アクションや、サーバへの更新投稿のような非同期アクションを実行できます。
* `reducerAction` は副作用を許容するように設計されているため、`<StrictMode>` でも 2 回呼び出されません。
* `reducerAction` の返り値の型は `initialState` の型と一致している必要があります。TypeScript の推論で型が不一致となる場合は、state の型を明示的にアノテーションする必要があるかもしれません。
* `reducerAction` の中で `await` 後に state をセットする場合、現在はその state 更新を追加の `startTransition` でラップする必要があります。詳しくは [startTransition](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) のドキュメントを参照してください。
* サーバ関数を使う場合、`actionPayload` は[シリアライズ可能](/reference/rsc/use-server#serializable-parameters-and-return-values)（プレーンオブジェクト、配列、文字列、数値などの値）である必要があります。

<DeepDive>

#### なぜ `reducerAction` と呼ばれるのか {/*why-is-it-called-reduceraction*/}

`useActionState` に渡す関数は、以下の理由から*リデューサアクション*と呼ばれます：

- `useReducer` と同じように、前回の state から新しい state へと*畳み込み (reduce)* を行います。
- トランジション内で呼び出され、副作用を実行できるため、*アクション*です。

概念的には、`useActionState` は `useReducer` に似ていますが、リデューサ内で副作用を実行できます。

</DeepDive>

---

## 使用法 {/*usage*/}

### アクションに state を追加する {/*adding-state-to-an-action*/}

コンポーネントのトップレベルで `useActionState` を呼び出し、アクションの結果に対応する state を作成します。

```js [[1, 7, "count"], [2, 7, "dispatchAction"], [3, 7, "isPending"]]
import { useActionState } from 'react';

async function addToCartAction(prevCount) {
  // ...
}
function Counter() {
  const [count, dispatchAction, isPending] = useActionState(addToCartAction, 0);

  // ...
}
```

`useActionState` は厳密に 3 つの項目を持つ配列を返します。

1. <CodeStep step={1}>現在の state</CodeStep>。初期状態では、指定した初期 state に設定されます。
2. `reducerAction` をトリガするための<CodeStep step={2}>アクションディスパッチャ</CodeStep>。
3. アクションが進行中かどうかを知らせる<CodeStep step={3}>保留中状態</CodeStep>。

`addToCartAction` を呼び出すには、<CodeStep step={2}>アクションディスパッチャ</CodeStep>を呼び出します。React は、直近の count を引数として用いる `addToCartAction` の呼び出しをキューに入れます。

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(async (prevCount) => {
    return await addToCart(prevCount)
  }, 0);

  function handleClick() {
    startTransition(() => {
      dispatchAction();
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>Qty: {count}</span>
      </div>
      <div className="row">
        <button onClick={handleClick}>Add Ticket{isPending ? ' 🌀' : '  '}</button>
      </div>
      <hr />
      <Total quantity={count} />
    </div>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row button {
  margin-left: auto;
  min-width: 150px;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}
```

</Sandpack>

"Add Ticket" をクリックするたびに、React は `addToCartAction` の呼び出しをキューに入れます。React はすべてのチケットが追加されるまで保留中状態を表示し、その後、最終的な state で再レンダーします。

<DeepDive>

#### `useActionState` のキューイングの仕組み {/*how-useactionstate-queuing-works*/}

"Add Ticket" を複数回クリックしてみてください。クリックするたびに、新しい `addToCartAction` がキューに入ります。人工的な 1 秒の遅延があるため、4 回クリックすると完了まで約 4 秒かかります。

**これは `useActionState` の設計上意図されたものです。**

次の `addToCartAction` の呼び出しに `prevCount` を渡すためには、前回の `addToCartAction` の結果を待つ必要があります。つまり React は、次のアクションを呼び出す前に、前回のアクションが完了するのを待つ必要があります。

通常は [`useOptimistic` と併用する](/reference/react/useActionState#using-with-useoptimistic)ことでこれに対処できますが、より複雑なケースでは、[キューに入ったアクションをキャンセルする](#cancelling-queued-actions)ことや、`useActionState` を使わないことを検討してもよいでしょう。

</DeepDive>

---

### 複数のアクションタイプを使用する {/*using-multiple-action-types*/}

複数のタイプを処理するには、`dispatchAction` に引数を渡します。

慣例として、switch 文として書くことが一般的です。switch の各 case で、次の state を計算して返します。引数は任意の形にできますが、アクションを識別する `type` プロパティを持つオブジェクトを渡すのが一般的です。

<Sandpack>

```js src/App.js
import { useActionState, startTransition } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function handleAdd() {
    startTransition(() => {
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="qty">{isPending ? '🌀' : count}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

数量を増減するためにクリックすると、`"ADD"` または `"REMOVE"` がディスパッチされます。`reducerAction` では、数量を更新するために異なる API が呼び出されます。

この例では、アクションの保留中状態を使って、数量と合計金額の両方を置き換えています。数量を即座に更新するなど、即時フィードバックを提供したい場合は、`useOptimistic` を使用できます。

<DeepDive>

#### `useActionState` は `useReducer` と何が違うのか {/*useactionstate-vs-usereducer*/}

この例は `useReducer` によく似ていると気付くかもしれませんが、両者は異なる目的を持ちます：

- UI の state を管理するには **`useReducer` を使います**。リデューサは純粋でなければなりません。

- アクションの state を管理するには **`useActionState` を使います**。リデューサは副作用を実行できます。

`useActionState` は、ユーザアクションから生じる副作用のための `useReducer` と考えることができます。前回のアクションに基づいて次に実行するアクションを計算するため、[呼び出しは直列化する](/reference/react/useActionState#how-useactionstate-queuing-works)必要があります。アクションを並行して実行したい場合は、`useState` と `useTransition` を直接使用してください。

</DeepDive>

---

### `useOptimistic` と併用する {/*using-with-useoptimistic*/}

`useActionState` と [`useOptimistic`](/reference/react/useOptimistic) を組み合わせることで、即時の UI フィードバックを表示できます。


<Sandpack>

```js src/App.js
import { useActionState, startTransition, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  function handleAdd() {
    startTransition(() => {
      setOptimisticCount(c => c + 1);
      dispatchAction({ type: 'ADD' });
    });
  }

  function handleRemove() {
    startTransition(() => {
      setOptimisticCount(c => c - 1);
      dispatchAction({ type: 'REMOVE' });
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button onClick={handleAdd}>▲</button>
            <button onClick={handleRemove}>▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={optimisticCount} isPending={isPending}/>
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>{isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}</span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>


`setOptimisticCount` は数量を即座に更新し、`dispatchAction()` は `updateCartAction` をキューに入れます。数量と合計金額の両方に保留中インジケータが表示され、更新がまだ適用中であることをユーザに知らせます。

---


### アクションプロップと併用する {/*using-with-action-props*/}

[アクションプロップ](/reference/react/useTransition#exposing-action-props-from-components)を公開しているコンポーネントに `dispatchAction` 関数を渡す場合、自分で `startTransition` や `useOptimistic` を呼び出す必要はありません。

以下の例では、QuantityStepper コンポーネントの props である `increaseAction` と `decreaseAction` を使用しています。

<Sandpack>

```js src/App.js
import { useActionState } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  function addAction() {
    dispatchAction({type: 'ADD'});
  }

  function removeAction() {
    dispatchAction({type: 'REMOVE'});
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
    <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

`<QuantityStepper>` はトランジション、保留中状態、個数の楽観的更新を組み込みでサポートしているため、アクションには*何を*変更するかを伝えるだけで済み、*どのように*変更するかは代わりに処理されます。

---

### キューに入ったアクションをキャンセルする {/*cancelling-queued-actions*/}

`AbortController` を使って保留中のアクションをキャンセルできます：

<Sandpack>

```js src/App.js
import { useActionState, useRef } from 'react';
import { addToCart, removeFromCart } from './api';
import QuantityStepper from './QuantityStepper';
import Total from './Total';

export default function Checkout() {
  const abortRef = useRef(null);
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);

  async function addAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'ADD', signal: abortRef.current.signal });
  }

  async function removeAction() {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    await dispatchAction({ type: 'REMOVE', signal: abortRef.current.signal });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <QuantityStepper
          value={count}
          increaseAction={addAction}
          decreaseAction={removeAction}
        />
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </div>
  );
}

async function updateCartAction(prevCount, actionPayload) {
  switch (actionPayload.type) {
    case 'ADD': {
      try {
        return await addToCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return prevCount + 1;
      }
    }
    case 'REMOVE': {
      try {
        return await removeFromCart(prevCount, { signal: actionPayload.signal });
      } catch (e) {
        return Math.max(0, prevCount - 1);
      }
    }
  }
  return prevCount;
}
```

```js src/QuantityStepper.js
import { startTransition, useOptimistic } from 'react';

export default function QuantityStepper({value, increaseAction, decreaseAction}) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(value);
  const isPending = value !== optimisticValue;
  function handleIncrease() {
    startTransition(async () => {
      setOptimisticValue(c => c + 1);
      await increaseAction();
    });
  }

  function handleDecrease() {
    startTransition(async () => {
      setOptimisticValue(c => Math.max(0, c - 1));
      await decreaseAction();
    });
  }

  return (
          <span className="stepper">
      <span className="pending">{isPending && '🌀'}</span>
      <span className="qty">{optimisticValue}</span>
      <span className="buttons">
        <button onClick={handleIncrease}>▲</button>
        <button onClick={handleDecrease}>▼</button>
      </span>
    </span>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
class AbortError extends Error {
  name = 'AbortError';
  constructor(message = 'The operation was aborted') {
    super(message);
  }
}

function sleep(ms, signal) {
  if (!signal) return new Promise((resolve) => setTimeout(resolve, ms));
  if (signal.aborted) return Promise.reject(new AbortError());

  return new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      clearTimeout(id);
      reject(new AbortError());
    };

    signal.addEventListener('abort', onAbort, { once: true });
  });
}
export async function addToCart(count, opts) {
  await sleep(1000, opts?.signal);
  return count + 1;
}

export async function removeFromCart(count, opts) {
  await sleep(1000, opts?.signal);
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

増加や減少を複数回クリックして、何度クリックしても合計金額が 1 秒以内に更新されることを確認してください。これは、`AbortController` を使って前回のアクションを「完了」させ、次のアクションが進めるようにしているためです。

<Pitfall>

アクションを中止することが常に安全とは限りません。

例えば、アクションがミューテーション（データベースへの書き込みなど）を実行する場合、ネットワークリクエストを中止してもサーバ側の変更は取り消されません。これが、`useActionState` がデフォルトで中止を行わない理由です。安全なのは、その副作用を安全に無視または再試行できると分かっている場合だけです。

</Pitfall>

---

### `<form>` のアクションプロップと併用する {/*use-with-a-form*/}

`dispatchAction` 関数を `<form>` の `action` プロパティとして渡すことができます。

このように使う場合、React は送信処理を自動的にトランジションでラップするため、自分で `startTransition` を呼び出す必要はありません。`reducerAction` は、前回の state と送信された `FormData` を受け取ります。

<Sandpack>

```js src/App.js
import { useActionState, useOptimistic } from 'react';
import { addToCart, removeFromCart } from './api';
import Total from './Total';

export default function Checkout() {
  const [count, dispatchAction, isPending] = useActionState(updateCartAction, 0);
  const [optimisticCount, setOptimisticCount] = useOptimistic(count);

  async function formAction(formData) {
    const type = formData.get('type');
    if (type === 'ADD') {
      setOptimisticCount(c => c + 1);
    } else {
      setOptimisticCount(c => Math.max(0, c - 1));
    }
    return dispatchAction(formData);
  }

  return (
    <form action={formAction} className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span className="stepper">
          <span className="pending">{isPending && '🌀'}</span>
          <span className="qty">{optimisticCount}</span>
          <span className="buttons">
            <button type="submit" name="type" value="ADD">▲</button>
            <button type="submit" name="type" value="REMOVE">▼</button>
          </span>
        </span>
      </div>
      <hr />
      <Total quantity={count} isPending={isPending} />
    </form>
  );
}

async function updateCartAction(prevCount, formData) {
  const type = formData.get('type');
  switch (type) {
    case 'ADD': {
      return await addToCart(prevCount);
    }
    case 'REMOVE': {
      return await removeFromCart(prevCount);
    }
  }
  return prevCount;
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return count + 1;
}

export async function removeFromCart(count) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Math.max(0, count - 1);
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty {
  min-width: 20px;
  text-align: center;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.buttons button {
  padding: 0 8px;
  font-size: 10px;
  line-height: 1.2;
  cursor: pointer;
}

.pending {
  width: 20px;
  text-align: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}
```

</Sandpack>

この例では、ユーザがステッパの矢印をクリックすると、ボタンがフォームを送信し、`useActionState` がフォームデータを渡して `updateCartAction` を呼び出します。この例では、サーバが更新を確認している間、新しい数量を即座に表示するために `useOptimistic` を使っています。

<RSC>

[サーバ関数](/reference/rsc/server-functions)と併用すると、`useActionState` により、ハイドレーション（React がサーバでレンダーされた HTML にアタッチする処理）が完了する前にサーバのレスポンスを表示できます。動的コンテンツを含むページでプログレッシブエンハンスメント（JavaScript の読み込み前でもフォームを動作可能にすること）を行うために、省略可能な `permalink` 引数を使うこともできます。通常、これはフレームワークが代わりに処理します。

</RSC>

フォームでアクションを使用する方法について詳しくは、[`<form>`](/reference/react-dom/components/form#handle-form-submission-with-a-server-function) のドキュメントを参照してください。

---

### エラーを処理する {/*handling-errors*/}

`useActionState` でエラーを処理する方法は 2 つあります。

バックエンドから返される "quantity not available" のような既知のバリデーションエラーについては、`reducerAction` の state の一部として返し、UI に表示できます。

`undefined is not a function` のような未知のエラーについては、エラーをスローできます。React はキューに入っているすべてのアクションをキャンセルし、`useActionState` フックからエラーを再スローすることで、最も近い[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)を表示します。

<Sandpack>

```js src/App.js
import {useActionState, startTransition} from 'react';
import {ErrorBoundary} from 'react-error-boundary';
import {addToCart} from './api';
import Total from './Total';

function Checkout() {
  const [state, dispatchAction, isPending] = useActionState(
    async (prevState, quantity) => {
      const result = await addToCart(prevState.count, quantity);
      if (result.error) {
        // Return the error from the API as state
        return {...prevState, error: `Could not add quanitiy ${quantity}: ${result.error}`};
      }

      if (!isPending) {
        // Clear the error state for the first dispatch.
        return {count: result.count, error: null};
      }

      // Return the new count, and any errors that happened.
      return {count: result.count, error: prevState.error};


    },
    {
      count: 0,
      error: null,
    }
  );

  function handleAdd(quantity) {
    startTransition(() => {
      dispatchAction(quantity);
    });
  }

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="row">
        <span>Eras Tour Tickets</span>
        <span>
          {isPending && '🌀 '}Qty: {state.count}
        </span>
      </div>
      <div className="buttons">
        <button onClick={() => handleAdd(1)}>Add 1</button>
        <button onClick={() => handleAdd(10)}>Add 10</button>
        <button onClick={() => handleAdd(NaN)}>Add NaN</button>
      </div>
      {state.error && <div className="error">{state.error}</div>}
      <hr />
      <Total quantity={state.count} isPending={isPending} />
    </div>
  );
}



export default function App() {
  return (
    <ErrorBoundary
      fallbackRender={({resetErrorBoundary}) => (
        <div className="checkout">
          <h2>Something went wrong</h2>
          <p>The action could not be completed.</p>
          <button onClick={resetErrorBoundary}>Try again</button>
        </div>
      )}>
      <Checkout />
    </ErrorBoundary>
  );
}
```

```js src/Total.js
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Total({quantity, isPending}) {
  return (
    <div className="row total">
      <span>Total</span>
      <span>
        {isPending ? '🌀 Updating...' : formatter.format(quantity * 9999)}
      </span>
    </div>
  );
}
```

```js src/api.js hidden
export async function addToCart(count, quantity) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (quantity > 5) {
    return {error: 'Quantity not available'};
  } else if (isNaN(quantity)) {
    throw new Error('Quantity must be a number');
  }
  return {count: count + quantity};
}
```

```css
.checkout {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-family: system-ui;
}

.checkout h2 {
  margin: 0 0 8px 0;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total {
  font-weight: bold;
}

hr {
  width: 100%;
  border: none;
  border-top: 1px solid #ccc;
  margin: 4px 0;
}

button {
  padding: 8px 16px;
  cursor: pointer;
}

.buttons {
  display: flex;
  gap: 8px;
}

.error {
  color: red;
  font-size: 14px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

上記の例では、"Add 10" はバリデーションエラーを返す API をシミュレートしており、そのエラーは `updateCartAction` によって state に保存され、インラインで表示されます。"Add NaN" は無効な個数になるため、`updateCartAction` がスローします。これは `useActionState` を通じて `ErrorBoundary` に伝播し、リセット用 UI が表示されます。


---

## トラブルシューティング {/*troubleshooting*/}

### `isPending` フラグが更新されない {/*ispending-not-updating*/}

`dispatchAction` を（アクションプロップ経由ではなく）手動で呼び出している場合、その呼び出しを必ず [`startTransition`](/reference/react/startTransition) でラップしてください。

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

`dispatchAction` がアクションプロップに渡されている場合、React はそれを自動的にトランジションでラップします。

---

### アクションがフォームデータを読み取れない {/*action-cannot-read-form-data*/}

`useActionState` を使う場合、`reducerAction` は追加の引数として、前回または初期 state を 1 番目の引数に受け取ります。したがって、送信されたフォームデータは 1 番目ではなく 2 番目の引数になります。

```js {2,7}
// Without useActionState
function action(formData) {
  const name = formData.get('name');
}

// With useActionState
function action(prevState, formData) {
  const name = formData.get('name');
}
```

---

### アクションがスキップされる {/*actions-skipped*/}

`dispatchAction` を複数回呼び出したときに一部が実行されない場合、先行する `dispatchAction` 呼び出しがエラーをスローしたことが原因かもしれません。

`reducerAction` がスローすると、React はそれ以降にキューに入っているすべての `dispatchAction` 呼び出しをスキップします。

これに対処するには、`reducerAction` 内でエラーをキャッチし、スローする代わりにエラー state を返します。

```js
async function myReducerAction(prevState, data) {
  try {
    const result = await submitData(data);
    return { success: true, data: result };
  } catch (error) {
    // ✅ Return error state instead of throwing
    return { success: false, error: error.message };
  }
}
```

---

### state がリセットされない {/*reset-state*/}

`useActionState` は組み込みのリセット関数を提供しません。state をリセットするには、リセットシグナルを処理するように `reducerAction` を設計できます。

```js
const initialState = { name: '', error: null };

async function formAction(prevState, payload) {
  // Handle reset
  if (payload === null) {
    return initialState;
  }
  // Normal action logic
  const result = await submitData(payload);
  return result;
}

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(formAction, initialState);

  function handleReset() {
    startTransition(() => {
      dispatchAction(null); // Pass null to trigger reset
    });
  }

  // ...
}
```

あるいは、`useActionState` を使っているコンポーネントに `key` プロパティを追加して新しい state で強制的に再マウントさせるか、送信後に自動的にリセットされる `<form>` の `action` プロパティを使うこともできます。

---

### "An async function with useActionState was called outside of a transition." というエラーが出る {/*async-function-outside-transition*/}

よくある間違いは、`dispatchAction` をトランジション内から呼び出すのを忘れることです：

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop.

</ConsoleLogLine>
</ConsoleBlockMulti>


このエラーが発生するのは、`dispatchAction` がトランジション内で実行される必要があるためです。

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ❌ Wrong: calling dispatchAction outside a Transition
    dispatchAction();
  }

  // ...
}
```

修正するには、呼び出しを [`startTransition`](/reference/react/startTransition) でラップします。

```js
import { useActionState, startTransition } from 'react';

function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  function handleClick() {
    // ✅ Correct: wrap in startTransition
    startTransition(() => {
      dispatchAction();
    });
  }

  // ...
}
```

あるいは、トランジション内で呼び出されるアクションプロップに `dispatchAction` を渡します。

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAsyncAction, null);

  // ✅ Correct: action prop wraps in a Transition for you
  return <Button action={dispatchAction}>...</Button>;
}
```

---

### "Cannot update action state while rendering" というエラーが出る {/*cannot-update-during-render*/}

レンダー中に `dispatchAction` を呼び出すことはできません：

<ConsoleBlock level="error">

Cannot update action state while rendering.

</ConsoleBlock>

これは無限ループを引き起こします。`dispatchAction` を呼び出すと state 更新がスケジュールされ、それが再レンダーをトリガし、その再レンダーでまた `dispatchAction` が呼び出されるためです。

```js
function MyComponent() {
  const [state, dispatchAction, isPending] = useActionState(myAction, null);

  // ❌ Wrong: calling dispatchAction during render
  dispatchAction();

  // ...
}
```

修正するには、フォーム送信やボタンクリックといったユーザイベントに応答する場合にのみ `dispatchAction` を呼び出すようにしてください。
