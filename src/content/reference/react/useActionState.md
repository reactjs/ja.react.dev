---
title: useActionState
---

<<<<<<< HEAD
<Canary>

`useActionState` フックは、現在 React の Canary および experimental チャンネルでのみ利用可能です。[リリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。また、`useActionState` の利点をフルに活かすためには、[React Server Components](/reference/rsc/use-client) をサポートするフレームワークを使用する必要があります。

</Canary>

<Note>

React Canary の以前のバージョンでは、この API は React DOM の一部であり `useFormState` という名前でした。

</Note>

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
<Intro>

`useActionState` は、フォームアクションの結果に基づいて state を更新するためのフックです。

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

</Intro>

<Note>

In earlier React Canary versions, this API was part of React DOM and called `useFormState`.

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

<<<<<<< HEAD
サーバアクションと併用して `useActionState` を使うことで、ハイドレーションが完了する前にフォームが送信された場合でも、そのサーバからのレスポンスを表示できるようになります。
=======
If used with a Server Function, `useActionState` allows the server's response from submitting the form to be shown even before hydration has completed.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

<<<<<<< HEAD
* `fn`: フォームが送信されたりボタンが押されたりしたときに呼び出される関数。この関数が呼び出される際には、1 番目の引数としてはフォームの前回 state（初回は渡した `initialState`、2 回目以降は前回の返り値）を受け取り、次の引数としてはフォームアクションが通常受け取る引数を受け取ります。
* `initialState`: state の初期値として使いたい値。シリアライズ可能な任意の値です。この引数はアクションが一度呼び出された後は無視されます。
* **省略可能** `permalink`: このフォームが書き換えの対象とするユニークなページ URL を含んだ文字列。ダイナミックなコンテンツ（ページフィードなど）のあるページでプログレッシブエンハンスメントを組み合わせる場合に使用します。`fn` が[サーバアクション](/reference/rsc/use-server)であり、かつフォームが JavaScript バンドルの読み込み完了前に送信された場合、ブラウザは現在のページ URL ではなくこの指定されたパーマリンク用 URL に移動するようになります。React が state を正しく受け渡せるよう、移動先となるページでも（アクション `fn` と `permalink` も含む）同じフォームが必ずレンダーされるようにしてください。フォームのハイドレーションが完了した後は、このパラメータは無視されます。
=======
* `fn`: The function to be called when the form is submitted or button pressed. When the function is called, it will receive the previous state of the form (initially the `initialState` that you pass, subsequently its previous return value) as its initial argument, followed by the arguments that a form action normally receives.
* `initialState`: The value you want the state to be initially. It can be any serializable value. This argument is ignored after the action is first invoked.
* **optional** `permalink`: A string containing the unique page URL that this form modifies. For use on pages with dynamic content (eg: feeds) in conjunction with progressive enhancement: if `fn` is a [server function](/reference/rsc/server-functions) and the form is submitted before the JavaScript bundle loads, the browser will navigate to the specified permalink URL, rather than the current page's URL. Ensure that the same form component is rendered on the destination page (including the same action `fn` and `permalink`) so that React knows how to pass the state through. Once the form has been hydrated, this parameter has no effect.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

{/* TODO T164397693: link to serializable values docs once it exists */}

#### 返り値 {/*returns*/}

`useActionState` は以下の値を含む配列を返します。

1. 現在の state。初回レンダー時には、渡した `initialState` と等しくなります。アクションが呼び出された後は、そのアクションが返した値と等しくなります。
2. フォームコンポーネントの `action` プロパティや、フォーム内の任意の `button` コンポーネントの `formAction` プロパティとして渡すことができる新しいアクション。
3. 進行中のトランジションがあるかどうかを表す `isPending` フラグ。

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

1. フォームの <CodeStep step={1}>state の現在値</CodeStep>。初期値はあなたが渡した <CodeStep step={4}>初期 state</CodeStep> となり、フォームが送信された後はあなたが渡した<CodeStep step={3}>アクション</CodeStep>の返り値となります。
2. `<form>` の props である `action` に渡せる<CodeStep step={2}>新しいアクション</CodeStep>。
3. アクションが処理中かどうかを知るのに利用できる <CodeStep step={1}>pending 状態</CodeStep>。

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

<<<<<<< HEAD
サーバアクションによって返されるメッセージをエラーメッセージやトーストとして表示するには、そのアクションを `useActionState` の呼び出しでラップします。
=======
To display messages such as an error message or toast that's returned by a Server Function, wrap the action in a call to `useActionState`.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

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

<<<<<<< HEAD
サーバアクションからの返り値は、シリアライズ可能な値であれば任意です。例えばオブジェクトにして、アクションが成功したかどうかを示すブーリアン値や、エラーメッセージや、更新後の情報を含めることもできます。
=======
The return value from a Server Function can be any serializable value. For example, it could be an object that includes a boolean indicating whether the action was successful, an error message, or updated information.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

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
