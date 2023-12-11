---
title: useFormState
canary: true
---

<Canary>

`useFormState` フックは、現在 React の Canary および experimental チャンネルでのみ利用可能です。[リリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。また、`useFormState` の利点をフルに活かすためには、[React Server Components](/reference/react/use-client) をサポートするフレームワークを使用する必要があります。

</Canary>

<Intro>

`useFormState` は、フォームアクションの結果に基づいて state を更新するためのフックです。

```js
const [state, formAction] = useFormState(fn, initialState);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useFormState(action, initialState)` {/*useformstate*/}

{/* TODO T164397693: link to actions documentation once it exists */}

コンポーネントのトップレベルで `useFormState` を呼び出してコンポーネントの state を作成し、[フォームアクションが呼び出されたとき](/reference/react-dom/components/form)に更新されるようにします。既存のフォームアクション関数と初期 state を `useFormState` に渡し、フォームで使用する新しいアクションと最新のフォーム state が返されます。あなたが渡した関数にも、最新のフォーム state が渡されるようになります。

```js
import { useFormState } from "react-dom";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useFormState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>Increment</button>
    </form>
  )
}
```

フォーム state とは、フォームが最後に送信されたときにアクションによって返される値です。フォームがまだ送信されていない場合は、渡された初期 state が使われます。

サーバアクションと併用して `useFormState` を使うことで、ハイドレーションが完了する前にフォームが送信された場合でも、そのサーバからのレスポンスを表示できるようになります。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `fn`: フォームが送信されたりボタンが押されたりしたときに呼び出される関数。この関数が呼び出される際には、1 番目の引数としてはフォームの前回 state（初回は渡した `initialState`、2 回目以降は前回の返り値）を受け取り、次の引数としてはフォームアクションが通常受け取る引数を受け取ります。
* `initialState`: state の初期値として使いたい値。シリアライズ可能な任意の値です。この引数はアクションが一度呼び出された後は無視されます。

{/* TODO T164397693: link to serializable values docs once it exists */}

#### 返り値 {/*returns*/}

`useFormState` は 2 つの値を含む配列を返します。

1. 現在の state。初回レンダー時には、渡した `initialState` と等しくなります。アクションが呼び出された後は、そのアクションが返した値と等しくなります。
2. フォームコンポーネントの `action` プロパティや、フォーム内の任意の `button` コンポーネントの `formAction` プロパティとして渡すことができる新しいアクション。

#### 注意点 {/*caveats*/}

* React Server Components をサポートするフレームワークで使用する場合、`useFormState` はクライアント上で JavaScript が実行される前にフォームを操作可能にできます。Server Components なしで使用する場合、コンポーネントのローカル state と同様のものになります。
* `useFormState` に渡される関数は、追加の 1 番目の引数として、前回 state ないし初期 state を受け取ります。従って `useFormState` を使用せずに直接フォームアクションとして使用する場合とは異なるシグネチャになります。

---

## 使用法 {/*usage*/}

### フォームアクションによって返された情報の使用 {/*using-information-returned-by-a-form-action*/}

コンポーネントのトップレベルで `useFormState` を呼び出し、最後にフォームが送信された際のアクションの返り値にアクセスします。

```js [[1, 5, "state"], [2, 5, "formAction"], [3, 5, "action"], [4, 5, "null"], [2, 8, "formAction"]]
import { useFormState } from 'react-dom';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useFormState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  );
}
```

`useFormState` は、2 つの項目を含む配列を返します。

1. フォームの <CodeStep step={1}>state の現在値</CodeStep>。初期値はあなたが渡した <CodeStep step={4}>初期 state</CodeStep> となり、フォームが送信された後はあなたが渡した<CodeStep step={3}>アクション</CodeStep>の返り値となります。
2. `<form>` の props である `action` に渡せる<CodeStep step={2}>新しいアクション</CodeStep>。

フォームが送信されると、あなたが渡した<CodeStep step={3}>アクション</CodeStep>関数が呼び出されます。その返り値が、新たなフォームの <CodeStep step={1}>state 現在値</CodeStep>になります。

あなたが渡す<CodeStep step={3}>アクション</CodeStep>は、新たな第 1 引数として、フォームの<CodeStep step={1}>現在 state</CodeStep>を受け取ります。フォームが初めて送信されるとき、これはあなたが渡した<CodeStep step={4}>初期 state</CodeStep> になります。次回以降の送信では、アクションが前回呼び出されたときの返り値になります。残りの引数は `useFormState` を使用しなかった場合と同じです。

```js [[3, 1, "action"], [1, 1, "currentState"]]
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

<Recipes titleText="フォーム送信後に情報を表示" titleId="display-information-after-submitting-a-form">

#### フォームエラーの表示 {/*display-form-errors*/}

サーバアクションによって返されるメッセージをエラーメッセージやトーストとして表示するには、そのアクションを `useFormState` の呼び出しでラップします。

<Sandpack>

```js App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction] = useFormState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {message}
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

```js actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    return "Couldn't add to cart: the item is sold out.";
  }
}
```

```css styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

#### フォーム送信後に構造化された情報を表示 {/*display-structured-information-after-submitting-a-form*/}

サーバアクションからの返り値は、シリアライズ可能な値であれば任意です。例えばオブジェクトにして、アクションが成功したかどうかを示すブーリアン値や、エラーメッセージや、更新後の情報を含めることもできます。

<Sandpack>

```js App.js
import { useState } from "react";
import { useFormState } from "react-dom";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useFormState(addToCart, {});
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

```js actions.js
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

```css styles.css hidden
form {
  border: solid 1px black;
  margin-bottom: 24px;
  padding: 12px
}

form button {
  margin-right: 12px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```
</Sandpack>

<Solution />

</Recipes>

## トラブルシューティング {/*troubleshooting*/}

### アクションが送信されたフォームデータを読み取れなくなった {/*my-action-can-no-longer-read-the-submitted-form-data*/}

`useFormState` でアクションをラップすると、追加の引数が *1 番目の引数として*加わります。したがって、通常は 1 番目の引数であるはずの送信フォームデータは、*2 番目の*引数になります。追加される新しい第 1 引数は、フォーム state の現在値です。

```js
function action(currentState, formData) {
  // ...
}
```
