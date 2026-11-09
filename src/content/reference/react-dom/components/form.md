---
title: "<form>"
---

<Intro>

[ブラウザ組み込みの `<form>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)を利用することで、情報を送信するためのインタラクティブなコントロールを作成できます。

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<form>` {/*form*/}

情報を送信するためのインタラクティブなコントロールを作成するには、[ビルトインのブラウザ `<form>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)をレンダーします。

```js
<form action={search}>
    <input name="query" />
    <button type="submit">Search</button>
</form>
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<form>` は、[一般的な要素の props](/reference/react-dom/components/common#common-props) をすべてサポートしています。

<<<<<<< HEAD
[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action)：URL または関数。`action` として URL が渡された場合、フォームは HTML の form コンポーネントと同様に動作します。`action` として関数が渡された場合、その関数がフォームの送信を [Action prop パターン](/reference/react/useTransition#exposing-action-props-from-components)を用いてトランジション内で処理します。`action` に渡された関数は非同期でもよく、送信されたフォームの [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) を唯一の引数として呼び出されます。`action` は、`<button>`、`<input type="submit">`、または `<input type="image">` コンポーネントの `formAction` プロパティによって上書きされることがあります。
=======
* [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action): A string containing a URL, or a function. If you pass a URL, the form behaves like a standard HTML form. If you pass a function, it handles the submission. See [Handling form submission with an action prop](#handle-form-submission-with-an-action-prop).
  * If you pass a function to `action`, React runs it in a [Transition](/reference/react/useTransition) following [the Action prop pattern](/reference/react/useTransition#exposing-action-props-from-components).
  * The function may be async. React calls it with a single argument containing the [form data](https://developer.mozilla.org/en-US/docs/Web/API/FormData) of the submitted form.
  * A `formAction` prop on a `<button>`, `<input type="submit">`, or `<input type="image">` overrides this `action`.
* [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method): A string that specifies the HTTP method to use when `action` is a URL. Defaults to `get`.
* `onSubmit`: An [`Event` handler](/reference/react-dom/components/common#react-event-object) function. Fires when the form is submitted. See [Handling form submission with an event handler](#handle-form-submission-with-an-event-handler).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

#### 注意点 {/*caveats*/}

<<<<<<< HEAD
* `action` または `formAction` に関数が渡された場合、HTTP メソッドは `method` の値に関わらず POST になります。
=======
* If you pass a function to `action` or `formAction`, the HTTP method will be `POST` regardless of the value of the `method` prop.
* If you pass a function to `action` or `formAction`, React resets all [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form) field elements after the Action succeeds. See [Preserving form values after an Action](#preserve-form-values-after-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

---

## 使用法 {/*usage*/}

<<<<<<< HEAD
### イベントハンドラでフォーム送信を処理する {/*handle-form-submission-with-an-event-handler*/}

フォームの送信時にコードを実行するには、`onSubmit` イベントハンドラに関数を渡します。デフォルトでは、ブラウザは現在の URL にフォームデータを送信してページを再読み込みするため、[`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) を呼び出してこの動作を上書きしてください。

以下の例では、各フィールドを `name` ごとに収集する [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) を使って、送信された値を読み取ります。これにより、入力欄は[非制御のまま](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form)になります。[state で入力欄を制御している](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)場合は、送信時に `FormData` ではなく当該 state から値を読み取ってください。
=======
### Handling form submission with an event handler {/*handle-form-submission-with-an-event-handler*/}

Pass a function to the `onSubmit` event handler to run code when the form is submitted. By default, the browser sends the form data to the current URL and refreshes the page. Calling [`e.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) in the event handler overrides this behavior.

If you also pass a function to `action`, React runs it after `onSubmit` unless `onSubmit` calls `e.preventDefault()`.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
export default function Search() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<Note>

<<<<<<< HEAD
`onSubmit` でフォームデータを読み取る方法は React のすべてのバージョンで動作し、[submit イベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)に直接アクセスできるため、`e.preventDefault()` を呼び出して自分でデータを読み取れます。代わりに `action` プロパティに関数を渡すと、送信処理が[トランジション](/reference/react/useTransition)内で実行されます。その場合、React は保留中の state を追跡し、スローされたエラーを最も近いエラーバウンダリに送り、フォームで [`useActionState`](/reference/react/useActionState) や [`useOptimistic`](/reference/react/useOptimistic) を利用できるようにします。`action` には、`onSubmit` がサポートしていない[サーバ関数](/reference/rsc/server-functions)を指定することもできます。

</Note>

### フォーム送信を Action prop で処理する {/*handle-form-submission-with-an-action-prop*/}

フォームの `action` プロパティに関数を渡すことで、フォームが送信されたときにその関数が実行されるようにします。この関数には [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) が引数として渡されるため、フォームが送信したデータにアクセスできます。これは URL のみを受け付ける本来の [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action) とは異なる、独自の動作です。`onSubmit` と異なり、`action` は[トランジション](/reference/react/useTransition)内で実行されるため、`e.preventDefault()` を呼び出す必要はありません。`action` に指定された関数が成功した後、フォーム内の非制御のフィールド要素はすべてリセットされます。
=======
`onSubmit` works in every version of React and gives you direct access to the [submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event). Starting in React 19, the [`action` prop](#handle-form-submission-with-an-action-prop) is the preferred API for form submissions. With `action`, React runs the submission in a [Transition](/reference/react/useTransition) and manages pending state and concurrency across multiple submissions. You can also use optimistic updates, Error Boundaries, and [Server Functions](/reference/rsc/server-functions).

</Note>

---

### Handling form submission with an action prop {/*handle-form-submission-with-an-action-prop*/}

Pass a function to the `action` prop to run it when the form is submitted. React calls the function with a [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object containing the values of every input with a `name` attribute. Your inputs can be [uncontrolled](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You don't need `value`/`onChange` pairs, an `onSubmit` handler, or `e.preventDefault()`.

When you pass a function to `action`, React:

* Runs the function in a [Transition](/reference/react/useTransition).
* Makes the pending state available to child components via [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).
* Propagates any errors to the nearest Error Boundary.
* Resets the form's uncontrolled fields when the function succeeds. To keep their values, see [Preserving form values after an Action](#preserve-form-values-after-an-action).

Because the Action runs in a Transition, you can also use [`useActionState`](/reference/react/useActionState) to manage form state and [`useOptimistic`](/reference/react/useOptimistic) for optimistic UI. For [Server Functions](/reference/rsc/server-functions) and progressive enhancement, see [Handling form submission with a Server Function](#handle-form-submission-with-a-server-function).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  }
  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
}
```

</Sandpack>

<<<<<<< HEAD
### サーバ関数を使ってフォームの送信を処理する {/*handle-form-submission-with-a-server-function*/}

`<form>` をレンダーし、入力フィールドと送信ボタンを配置します。フォームが送信されたときに関数を実行するために、サーバ関数（Server Function; [`'use server'`](/reference/rsc/use-server) でマークされた関数）を form の `action` に渡します。

`<form action>` にサーバ関数を渡すことで、JavaScript が無効あるいはコードがロードされる前の状態でも、ユーザがフォームを送信できるようになります。これは、接続やデバイスが遅い、または JavaScript が無効になっているユーザにとって有益であり、`action` に URL を渡したフォームと同様に動作します。

`<form>` のアクションには hidden となっているフォームフィールドを使ってデータを送信することもできます。サーバ関数は、hidden フィールドのデータも [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) インスタンスに含まれた状態で呼び出されます。
=======
---

### Handling form submission with a Server Function {/*handle-form-submission-with-a-server-function*/}

A `<form>`'s `action` prop can run a Server Function (a function marked with [`'use server'`](/reference/rsc/use-server)) when the user submits the form. Users can submit that form before JavaScript loads or when JavaScript is disabled. This matches how forms behave when you pass a URL to `action`.

React calls the Server Function with the form's [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) and includes every input with a `name` attribute. To pass additional data, such as an ID from props, see [Passing extra data to an Action](#passing-extra-data-to-an-action).
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```jsx
import { addComment } from './actions.js';

function CommentForm() {
  return (
    <form action={addComment}>
      <textarea name="comment" />
      <button type="submit">Comment</button>
    </form>
  );
}
```

<<<<<<< HEAD
hidden フィールドを使用して `<form>` アクションにデータを渡す代わりに、<CodeStep step={1}>`bind`</CodeStep> メソッドを呼び出して追加の引数を渡すこともできます。これにより、渡された引数である <CodeStep step={3}>`formData`</CodeStep> に加えて新しい引数 (<CodeStep step={2}>`productId`</CodeStep>) がバインドされます。
=======
```js
// actions.js
'use server';
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

export async function addComment(formData) {
  const comment = formData.get('comment');
  // ...
}
```

<DeepDive>

#### Passing extra data to an Action {/*passing-extra-data-to-an-action*/}

An Action receives the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData). To include data the user did not enter, such as an ID from props, use one of these approaches:

* **Hidden fields** add the value to `FormData`. The value appears in the HTML, and `formData.get` returns a string. Users can submit the form before JavaScript loads.
* **Binding with `bind`** passes the value as an argument to a Server Function, before `formData`. The argument keeps its type, so a number stays a number. It must be [serializable](/reference/rsc/use-server#serializable-parameters-and-return-values). Users can submit the form before JavaScript loads.
* **A function in the component** reads props and state directly. It runs after JavaScript loads, then calls a Server Function with those values.

The client sends hidden field values and bound arguments. Check on the server that the logged-in user is allowed to perform the Action. See [Security considerations](/reference/rsc/use-server#security).

#### Hidden fields {/*passing-extra-data-hidden-fields*/}

In a Server Component, render an `<input type="hidden">` with a `name` and `value`. React includes that value in the `FormData` passed to the Action.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    'use server';
    await updateCart(formData.get('productId'));
  }
  return (
    <form action={addToCart}>
      <input type="hidden" name="productId" value={productId} />
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

React includes a submit button's `name` and `value` in `FormData` when that button submits the form.

#### Binding with `bind` {/*passing-extra-data-bind*/}

In a Server Component, call [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) on the Server Function and pass the bound function to `action`. Pass `null` as the first argument to `bind`. Each argument after `null` comes before the `formData` argument React passes when the form is submitted.

```jsx
// Server Component
import { updateCart } from './lib.js';

function AddToCart({ productId }) {
  async function addToCart(productId, formData) {
    'use server';
    await updateCart(productId);
  }
  const addProductToCart = addToCart.bind(null, productId);
  return (
    <form action={addProductToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

<<<<<<< HEAD
[サーバコンポーネント](/reference/rsc/use-client) によって `<form>` をレンダーし、`<form>` の `action` に[サーバ関数](/reference/rsc/server-functions)を渡すことで、フォームの[プログレッシブエンハンスメント](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)が有効になります。

### フォームの送信中状態を表示する {/*display-a-pending-state-during-form-submission*/}
フォームが送信されている間に保留 (pending) 状態を表示するには、`<form>` 内でレンダーされるコンポーネントで `useFormStatus` フックを呼び出して、返された `pending` プロパティを読み取ります。
=======
When the form is submitted, React calls `addProductToCart(formData)`, which calls `addToCart(productId, formData)`.

If you also use [`useActionState`](/reference/react/useActionState), the Server Function receives `productId`, `previousState`, and `formData`, in that order. Define that function in a separate file and bind it from the Client Component.

#### A function in the component {/*passing-extra-data-function*/}

Define the function passed to `action` in the Client Component so it can read the component's props or state. That function passes those values to a Server Function.

```jsx
// AddToCart.js
'use client';

import { updateCart } from './actions.js';

function AddToCart({ productId }) {
  async function addToCart(formData) {
    await updateCart(productId, formData);
  }
  return (
    <form action={addToCart}>
      <button type="submit">Add to Cart</button>
    </form>
  );
}
```

```js
// actions.js
'use server';

export async function updateCart(productId, formData) {
  // ...
}
```

Because `addToCart` runs in the browser, the component's JavaScript must load before the form can submit.

</DeepDive>

---

### Displaying a pending state during form submission {/*display-a-pending-state-during-form-submission*/}

To display a pending state when a form is being submitted, you can call the [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) Hook in a component rendered in a `<form>` and read the `pending` property returned.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

以下では、フォームが送信中であることを表示するために `pending` プロパティを使用しています。

<Sandpack>

```js src/App.js
import { useFormStatus } from 'react-dom';
import { submitForm } from './actions.js';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

function Form({ action }) {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}

export default function App() {
  return <Form action={submitForm} />;
}
```

```js src/actions.js hidden
export async function submitForm(formData) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

<<<<<<< HEAD
`useFormStatus` フックの詳細は[リファレンスドキュメント](/reference/react-dom/hooks/useFormStatus)を参照してください。

### フォームデータの楽観的更新 {/*optimistically-updating-form-data*/}
`useOptimistic` フックは、ネットワークリクエストのようなバックグラウンド作業が完了する前に、ユーザインターフェースを楽観的に更新する方法を提供します。フォームにおいては、この技術はアプリをよりレスポンシブに感じさせるために役立ちます。ユーザがフォームを送信した際に、サーバのレスポンスを待たずに、予想される結果を用いてインターフェースを即座に更新しておきます。
=======
To learn more about the `useFormStatus` Hook, see the [reference documentation](/reference/react-dom/hooks/useFormStatus).

---

### Optimistically updating form data {/*optimistically-updating-form-data*/}

The [`useOptimistic`](/reference/react/useOptimistic) Hook provides a way to optimistically update the user interface before a background operation, like a network request, completes. In the context of forms, this technique helps to make apps feel more responsive. When a user submits a form, instead of waiting for the server's response to reflect the changes, the interface is immediately updated with the expected outcome.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

例えば、ユーザがフォームにメッセージを入力して送信ボタンを押すと、`useOptimistic` フックにより、メッセージが実際にサーバに送信される前であっても、リストに "Sending..." というラベル付きでメッセージを即座に表示できるようになります。この「楽観的」アプローチにより、アプリの印象が高速でレスポンシブになります。その後フォームはバックグラウンドでメッセージの実際の送信を試みます。サーバにメッセージが到着したことを確認すると、"Sending..." ラベルが取り除かれます。

<Sandpack>

```js src/App.js
import { startTransition, useOptimistic, useState, useRef } from 'react';
import { deliverMessage } from './actions.js';

function Thread({ messages, sendMessage }) {
  const formRef = useRef(null);
  async function formAction(formData) {
    addOptimisticMessage(formData.get('message'));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: 'Hello there!', sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get('message'));
    startTransition(() => {
      setMessages((messages) => [...messages, { text: sentMessage }]);
    });
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  // Simulate a message delivery delay
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

To learn more about the `useOptimistic` Hook, see the [reference documentation](/reference/react/useOptimistic).

---

### フォーム送信エラーの処理 {/*handling-form-submission-errors*/}

<<<<<<< HEAD
場合によっては、`<form>` の `action` で呼び出された関数がエラーをスローすることがあります。このようなエラーを処理するには、`<form>` をエラーバウンダリでラップします。`<form>` の `action` で呼び出される関数がエラーをスローすると、エラーバウンダリのフォールバックが表示されます。
=======
To handle errors thrown by a function passed to a `<form>`'s `action` prop, wrap the form in an [Error Boundary](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). React displays the boundary's fallback when the function throws.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
import { ErrorBoundary } from 'react-error-boundary';

export default function Search() {
  function search() {
    throw new Error('search error');
  }
  return (
    <ErrorBoundary
      fallback={<p>There was an error while submitting the form</p>}
    >
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </ErrorBoundary>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<<<<<<< HEAD
### JavaScript を使わずにフォーム送信エラーを表示する {/*display-a-form-submission-error-without-javascript*/}
=======
#### Handling form submission errors before JavaScript loads {/*display-a-form-submission-error-without-javascript*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

プログレッシブエンハンスメントの実現のため JavaScript バンドルが読み込まれる前にフォーム送信エラーメッセージを表示できるようにするには、以下の条件を満たす必要があります。

<<<<<<< HEAD
1. `<form>` が [クライアントコンポーネント](/reference/rsc/use-client)によってレンダーされている
1. `<form>` の `action` プロパティに渡される関数が[サーバ関数](/reference/rsc/server-functions)である
1. `useActionState` フックを使用してエラーメッセージを表示している

`useActionState` は[サーバ関数](/reference/rsc/server-functions)と初期 state の 2 つの引数を受け取り、state 変数とアクションの 2 つの値を返します。`useActionState` が返したアクションは、フォームの `action` プロパティに渡します。`useActionState` が返した state 変数は、エラーメッセージを表示するために使用できます。`useActionState` に渡すサーバ関数が返す値は、state 変数を更新するために使用されます。
=======
1. `<form>` be rendered by a [Client Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the [`useActionState`](/reference/react/useActionState) Hook be used to display the error message

Define the Server Function in a separate file with the [`'use server'`](/reference/rsc/use-server) directive. It receives the previous state followed by the submitted `FormData`:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js
// actions.js
'use server';

import { signUpNewUser } from './api.js';

export async function signup(previousState, formData) {
  const email = formData.get('email');
  try {
    await signUpNewUser(email);
    return null;
  } catch (error) {
    return error.message;
  }
}
```

In a Client Component, pass the Server Function to `useActionState`. Pass the returned Action to the form's `action` prop and render the returned state:

```js
// Signup.js
'use client';

import { useActionState } from 'react';
import { signup } from './actions.js';

export default function Signup() {
  const [message, signupAction] = useActionState(signup, null);
  return (
    <form action={signupAction}>
      <label htmlFor="email">Email: </label>
      <input name="email" id="email" placeholder="react@example.com" />
      <button>Sign up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

If the form is submitted before JavaScript loads, React includes the Server Function's returned error message in the server-rendered response.

---

### Preserving form values after an Action {/*preserve-form-values-after-an-action*/}

When a function passed to `action` or `formAction` completes without throwing, React resets the form's [uncontrolled fields](/reference/react-dom/components/input#reading-the-input-values-when-submitting-a-form). You may want to keep the submitted values after saving edits, or when the Action returns a [validation error](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).

To preserve those values, you can store them with [`useState`](/reference/react/useState) and pass them to each field's [`defaultValue`](/reference/react-dom/components/input#providing-an-initial-value-for-an-input). Update the state when the Action finishes. React applies the updated defaults before resetting the form, so the fields keep those values.

Try changing the title and clicking **Save**. In this example, [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) shows "Saving..." during a simulated one-second request. Then `setTitle` updates the saved title and preserves it in the input.

<Sandpack>

```js src/App.js
import { startTransition, useState } from 'react';
import SaveButton from './SaveButton.js';

export default function EditForm() {
  const [title, setTitle] = useState('My draft');

  async function saveAction(formData) {
    await new Promise((res) => setTimeout(res, 1000));
    startTransition(() => {
      setTitle(formData.get('title'));
    });
  }

  return (
    <form action={saveAction}>
      <input name="title" defaultValue={title} />
      <SaveButton />
      <p>Saved title: {title}</p>
    </form>
  );
}
```

```js src/SaveButton.js hidden
import { useFormStatus } from 'react-dom';

export default function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}
```

</Sandpack>

<<<<<<< HEAD
フォームアクションから state を更新する方法については、[`useActionState`](/reference/react/useActionState) のドキュメントを参照してください。
=======
The call to `setTitle` [after `await`](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition) needs another [`startTransition`](/reference/react/startTransition) to mark it as a Transition update.

`saveAction` can also call a [Server Function](/reference/rsc/server-functions) and store its return value:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function submitTitle(formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return title;
}
```

Add [`'use client'`](/reference/rsc/use-client) at the top of the component's file, import `submitTitle`, and replace `saveAction`. The rest of the form stays the same:

```js
import { submitTitle } from './actions.js';

async function saveAction(formData) {
  const savedTitle = await submitTitle(formData);
  startTransition(() => {
    setTitle(savedTitle);
  });
}
```

#### Preserving form values before JavaScript loads {/*preserving-form-values-before-javascript-loads*/}

With [`useActionState`](/reference/react/useActionState), React can display a [Server Function](/reference/rsc/server-functions)'s returned value before hydration completes. The form can use those values as its new defaults. In a [Client Component](/reference/rsc/use-client), `useActionState` receives the Server Function and returns an Action for the form's `action` prop.

See [Handling form submission errors before JavaScript loads](#display-a-form-submission-error-without-javascript) for the same behavior with errors.

The Server Function receives the previous state followed by the submitted `FormData`. In this example, `updateTitle` saves the title and returns `{ title }`, which becomes the new state. Passing `state.title` to `defaultValue` preserves the saved title after the reset:

```js
// actions.js
'use server';

import { saveTitle } from './api.js';

export async function updateTitle(previousState, formData) {
  const title = formData.get('title');
  await saveTitle(title);
  return { title };
}
```

```js
// EditForm.js
'use client';

import { useActionState } from 'react';
import { updateTitle } from './actions.js';

export default function EditForm() {
  const [state, updateTitleAction, isPending] = useActionState(updateTitle, {
    title: 'My draft',
  });

  return (
    <form action={updateTitleAction}>
      <input name="title" defaultValue={state.title} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

<DeepDive>

#### Other ways to control form resets {/*other-ways-to-control-form-resets*/}

The examples above keep every submitted value by storing it before the reset. You can also choose which values survive, or when the reset runs:

* **Keep values only when validation fails.** Return the same state shape from every submission. When validation fails, include the submitted `FormData` and read each field with `state.submitted?.get('title') ?? ''`. When validation succeeds, set that `FormData` to `null` so the reset clears those fields. [`useActionState`](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values) shows this pattern.

* **Skip the reset with `onSubmit`.** Handle the submission in `onSubmit`, call `e.preventDefault()`, and run the Action inside [`startTransition`](/reference/react/useTransition). Because the form's `action` does not run, React does not reset the form.

* **Reset at a specific moment.** Call the form element's [`reset()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset) method to immediately reset uncontrolled fields to their default values. To schedule a reset as part of an Action or Transition, call [`requestFormReset`](/blog/2024/12/05/react-19#form-actions) from `react-dom` instead.

* **Reset the form and the component state together.** Change the [`key`](/learn/preserving-and-resetting-state#resetting-a-form-with-a-key) of the component that renders the form. React recreates the component and its DOM, which resets the fields and any local state.

</DeepDive>

---
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

### 複数の送信タイプを処理する {/*handling-multiple-submission-types*/}

<<<<<<< HEAD
フォームは、ユーザが押したボタンに基づいて複数の送信アクションを処理するように設計することができます。フォーム内の各ボタンは、props である `formAction` を指定することで、異なるアクションや振る舞いに関連付けることができます。

ユーザが特定のボタンをタップしてフォームを送信すると、そのボタンの `formAction` によって定義された対応するアクションが実行されます。例えば、デフォルトでは書いた記事をレビュー用に送信するが、記事を下書きとして保存するための `formAction` がセットされた別のボタンもある、というフォームを作ることができます。
=======
A form can have more than one submit button, each running a different Action. A button without `formAction` runs the form's `action`; a button with `formAction` runs its own Action instead. For example, the form below publishes an article by default, but its **Save draft** button stores the current content without publishing it. It uses [`useActionState`](/reference/react/useActionState) to preserve the saved draft:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

<Sandpack>

```js src/App.js
import { useActionState } from 'react';

export default function ArticleForm() {
  // Preserve the saved draft after submission
  const [formState, dispatchFormState] = useActionState((state, payload) => {
    const content = payload.data.get('content');
    switch (payload.type) {
      case 'save':
        alert(`Your draft of '${content}' was saved!`);
        return payload.data;
      case 'publish':
        alert(`'${content}' was published!`);
        return new FormData();
      default:
        return state;
    }
  }, new FormData());

  function publish(formData) {
    dispatchFormState({
      type: 'publish',
      data: formData,
    });
  }

  function save(formData) {
    dispatchFormState({
      type: 'save',
      data: formData,
    });
  }

  return (
    <form action={publish}>
      <textarea
        name="content"
        rows={4}
        cols={40}
        defaultValue={formState?.get('content') || ''}
      />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>

---

## Troubleshooting {/*troubleshooting*/}

### My form fields are cleared after submission {/*my-form-fields-are-cleared-after-submission*/}

When a function passed to `action` or `formAction` succeeds, React resets the form's uncontrolled fields to their default values. Text fields without a `defaultValue` become empty. Returning a validation error instead of throwing also triggers this reset.

To keep a submitted value, store it in state and pass it to the field's `defaultValue`. See [Preserving form values after an Action](#preserve-form-values-after-an-action) for examples, or [preserving values when validation fails](/reference/react/useActionState#displaying-validation-errors-and-preserving-form-values).
