---
title: useActionState
---

<Intro>

`useActionState` は、フォームアクションの結果に基づいて state を更新するためのフックです。

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

React Canary の以前のバージョンでは、この API は React DOM の一部であり `useFormState` という名前でした。

</Note>


<InlineToc />

---

## リファレンス {/*reference*/}

### `useActionState(action, initialState, permalink?)` {/*useactionstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

コンポーネントのトップレベルで `useActionState` を呼び出してコンポーネントの state を作成し、[フォームアクションが呼び出されたとき](/reference/react-dom/components/form)に更新されるようにします。既存のフォームアクション関数と初期 state を `useActionState` に渡し、フォームで使用する新しいアクションと最新のフォーム state、およびアクションの進行状況が返されます。あなたが渡した関数にも、最新のフォーム state が渡されるようになります。

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

フォーム state とは、フォームが最後に送信されたときにアクションによって返される値です。フォームがまだ送信されていない場合は、渡された初期 state が使われます。

サーバ関数と併用して `useActionState` を使うことで、ハイドレーションが完了する前にフォームが送信された場合でも、そのサーバからのレスポンスを表示できるようになります。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `fn`: フォームが送信されたりボタンが押されたりしたときに呼び出される関数。この関数が呼び出される際には、1 番目の引数としてはフォームの前回 state（初回は渡した `initialState`、2 回目以降は前回の返り値）を受け取り、次の引数としてはフォームアクションが通常受け取る引数を受け取ります。
* `initialState`: state の初期値として使いたい値。シリアライズ可能な任意の値です。この引数はアクションが一度呼び出された後は無視されます。
* **省略可能** `permalink`: このフォームが書き換えの対象とするユニークなページ URL を含んだ文字列。ダイナミックなコンテンツ（ページフィードなど）のあるページでプログレッシブエンハンスメントを組み合わせる場合に使用します。`fn` が[サーバ関数](/reference/rsc/server-functions)であり、かつフォームが JavaScript バンドルの読み込み完了前に送信された場合、ブラウザは現在のページ URL ではなくこの指定されたパーマリンク用 URL に移動するようになります。React が state を正しく受け渡せるよう、移動先となるページでも（アクション `fn` と `permalink` も含む）同じフォームが必ずレンダーされるようにしてください。フォームのハイドレーションが完了した後は、このパラメータは無視されます。

{/* TODO T164397693: link to serializable values docs once it exists */}

#### 返り値 {/*returns*/}

`useActionState` は以下の値を含む配列を返します。

<<<<<<< HEAD
1. 現在の state。初回レンダー時には、渡した `initialState` と等しくなります。アクションが呼び出された後は、そのアクションが返した値と等しくなります。
2. フォームコンポーネントの `action` プロパティや、フォーム内の任意の `button` コンポーネントの `formAction` プロパティとして渡すことができる新しいアクション。
3. 進行中のトランジションがあるかどうかを表す `isPending` フラグ。
=======
1. The current state. During the first render, it will match the `initialState` you have passed. After the action is invoked, it will match the value returned by the action.
2. A new action that you can pass as the `action` prop to your `form` component or `formAction` prop to any `button` component within the form. The action can also be called manually within [`startTransition`](/reference/react/startTransition).
3. The `isPending` flag that tells you whether there is a pending Transition.
>>>>>>> 49284218b1f5c94f930f8a9b305040dbe7d3dd48

#### 注意点 {/*caveats*/}

* React Server Components をサポートするフレームワークで使用する場合、`useActionState` はクライアント上で JavaScript が実行される前にフォームを操作可能にできます。Server Components なしで使用する場合、コンポーネントのローカル state と同様のものになります。
* `useActionState` に渡される関数は、追加の 1 番目の引数として、前回 state ないし初期 state を受け取ります。従って `useActionState` を使用せずに直接フォームアクションとして使用する場合とは異なるシグネチャになります。

---

## 使用法 {/*usage*/}

### フォームアクションによって返された情報の使用 {/*using-information-returned-by-a-form-action*/}

コンポーネントのトップレベルで `useActionState` を呼び出し、最後にフォームが送信された際のアクションの返り値にアクセスします。

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useActionState` は、以下の項目を含む配列を返します。

<<<<<<< HEAD
1. フォームの <CodeStep step={1}>state の現在値</CodeStep>。初期値はあなたが渡した <CodeStep step={4}>初期 state</CodeStep> となり、フォームが送信された後はあなたが渡した<CodeStep step={3}>アクション</CodeStep>の返り値となります。
2. `<form>` の props である `action` に渡せる<CodeStep step={2}>新しいアクション</CodeStep>。
3. アクションが処理中かどうかを知るのに利用できる <CodeStep step={1}>pending 状態</CodeStep>。
=======
1. The <CodeStep step={1}>current state</CodeStep> of the form, which is initially set to the <CodeStep step={4}>initial state</CodeStep> you provided, and after the form is submitted is set to the return value of the <CodeStep step={3}>action</CodeStep> you provided.
2. A <CodeStep step={2}>new action</CodeStep> that you pass to `<form>` as its `action` prop or call manually within `startTransition`.
3. A <CodeStep step={1}>pending state</CodeStep> that you can utilise while your action is processing.
>>>>>>> 49284218b1f5c94f930f8a9b305040dbe7d3dd48

フォームが送信されると、あなたが渡した<CodeStep step={3}>アクション</CodeStep>関数が呼び出されます。その返り値が、新たなフォームの <CodeStep step={1}>state 現在値</CodeStep>になります。

あなたが渡す<CodeStep step={3}>アクション</CodeStep>は、新たな第 1 引数として、フォームの<CodeStep step={1}>state の現在値</CodeStep>を受け取ります。フォームが初めて送信されるとき、これはあなたが渡した<CodeStep step={4}>初期 state</CodeStep> と等しくなります。次回以降の送信では、アクションが前回呼び出されたときの返り値になります。残りの引数は `useActionState` を使用しなかった場合と同じです。

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="フォーム送信後に情報を表示" titleId="display-information-after-submitting-a-form">

#### フォームエラーの表示 {/*display-form-errors*/}

サーバ関数によって返されるメッセージをエラーメッセージやトーストとして表示するには、そのアクションを `useActionState` の呼び出しでラップします。

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

#### フォーム送信後に構造化された情報を表示 {/*display-structured-information-after-submitting-a-form*/}

サーバ関数からの返り値は、シリアライズ可能な値であれば任意です。例えばオブジェクトにして、アクションが成功したかどうかを示すブーリアン値や、エラーメッセージや、更新後の情報を含めることもできます。

<Sandpack>

```js src/App.js
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, {});
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {formState?.success &&
        <div className="toast">
          Added to cart! Your cart now has {formState.cartSize} items.
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          Failed to add to cart: {formState.message}
        </div>
      }
    </form>
  );
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: The Definitive Guide" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: The Good Parts" />
    </>
  )
}
```

```js src/actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12,
    };
  } else {
    return {
      success: false,
      message: "The item is sold out.",
    };
  }
}
```

```css src/styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```
</Sandpack>

<Solution />

</Recipes>

## トラブルシューティング {/*troubleshooting*/}

### アクションが送信されたフォームデータを読み取れなくなった {/*my-action-can-no-longer-read-the-submitted-form-data*/}

`useActionState` でアクションをラップすると、追加の引数が *1 番目の引数として*加わります。したがって、通常は 1 番目の引数であるはずの送信フォームデータは、*2 番目の*引数になります。追加される新しい第 1 引数は、フォーム state の現在値です。

```js
function action(currentState, formData) {
  // ...
}
```
