---
title: "<form>"
---

<<<<<<< HEAD
<Canary>

React による `<form>` の機能拡張は、現在 React の Canary および experimental チャンネルでのみ利用可能です。React の安定版リリースでは、`<form>` は単なる[組み込みのブラウザ HTML コンポーネント](https://react.dev/reference/react-dom/components#all-html-components)として機能します。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>


=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
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

`<form>` は、[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

[`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action)：URL または関数。`action` として URL が渡された場合、フォームは HTML の form コンポーネントと同様に動作します。`action` として関数が渡された場合、その関数がフォームの送信を処理します。`action` に渡された関数は非同期でもよく、送信されたフォームの [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) を唯一の引数として呼び出されます。`action` は、`<button>`、`<input type="submit">`、または `<input type="image">` コンポーネントの `formAction` プロパティによって上書きされることがあります。

#### 注意点 {/*caveats*/}

* `action` または `formAction` に関数が渡された場合、HTTP メソッドは `method` の値に関わらず POST になります。

---

## 使用法 {/*usage*/}

### クライアント上でフォーム送信を処理する {/*handle-form-submission-on-the-client*/}

フォームの `action` プロパティに関数を渡すことで、フォームが送信されたときにその関数が実行されるようにします。この関数には [`formData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) が引数として渡されるため、フォームが送信したデータにアクセスできます。これは URL のみを受け付ける本来の [HTML action](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#action) とは異なる、独自の動作です。

<Sandpack>

```js src/App.js
export default function Search() {
  function search(formData) {
    const query = formData.get("query");
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
### サーバアクションを使ってフォームの送信を処理する {/*handle-form-submission-with-a-server-action*/}

`<form>` をレンダーし、入力フィールドと送信ボタンを配置します。フォームが送信されたときに関数を実行するために、サーバアクション（Server Action; [`'use server'`](/reference/rsc/use-server) でマークされた関数）を form の `action` に渡します。

`<form action>` にサーバアクションを渡すことで、JavaScript が無効あるいはコードがロードされる前の状態でも、ユーザがフォームを送信できるようになります。これは、接続やデバイスが遅い、または JavaScript が無効になっているユーザにとって有益であり、`action` に URL を渡したフォームと同様に動作します。

`<form>` のアクションには hidden となっているフォームフィールドを使ってデータを送信することもできます。サーバアクションは、hidden フィールドのデータも [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) インスタンスに含まれた状態で呼び出されます。
=======
### Handle form submission with a Server Function {/*handle-form-submission-with-a-server-function*/}

Render a `<form>` with an input and submit button. Pass a Server Function (a function marked with [`'use server'`](/reference/rsc/use-server)) to the `action` prop of form to run the function when the form is submitted.

Passing a Server Function to `<form action>` allow users to submit forms without JavaScript enabled or before the code has loaded. This is beneficial to users who have a slow connection, device, or have JavaScript disabled and is similar to the way forms work when a URL is passed to the `action` prop.

You can use hidden form fields to provide data to the `<form>`'s action. The Server Function will be called with the hidden form field data as an instance of [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

```jsx
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(formData) {
    'use server'
    const productId = formData.get('productId')
    await updateCart(productId)
  }
  return (
    <form action={addToCart}>
        <input type="hidden" name="productId" value={productId} />
        <button type="submit">Add to Cart</button>
    </form>

  );
}
```

hidden フィールドを使用して `<form>` アクションにデータを渡す代わりに、<CodeStep step={1}>`bind`</CodeStep> メソッドを呼び出して追加の引数を渡すこともできます。これにより、渡された引数である <CodeStep step={3}>`formData`</CodeStep> に加えて新しい引数 (<CodeStep step={2}>`productId`</CodeStep>) がバインドされます。

```jsx [[1, 8, "bind"], [2,8, "productId"], [2,4, "productId"], [3,4, "formData"]]
import { updateCart } from './lib.js';

function AddToCart({productId}) {
  async function addToCart(productId, formData) {
    "use server";
    await updateCart(productId)
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
[サーバコンポーネント](/reference/rsc/use-client) によって `<form>` をレンダーし、`<form>` の `action` に[サーバアクション](/reference/rsc/use-server)を渡すことで、フォームの[プログレッシブエンハンスメント](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)が有効になります。
=======
When `<form>` is rendered by a [Server Component](/reference/rsc/use-client), and a [Server Function](/reference/rsc/server-function) is passed to the `<form>`'s `action` prop, the form is [progressively enhanced](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

### フォームの送信中状態を表示する {/*display-a-pending-state-during-form-submission*/}
フォームが送信されている間に保留 (pending) 状態を表示するには、`<form>` 内でレンダーされるコンポーネントで `useFormStatus` フックを呼び出して、返された `pending` プロパティを読み取ります。

以下では、フォームが送信中であることを表示するために `pending` プロパティを使用しています。

<Sandpack>

```js src/App.js
import { useFormStatus } from "react-dom";
import { submitForm } from "./actions.js";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
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
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

`useFormStatus` フックの詳細は[リファレンスドキュメント](/reference/react-dom/hooks/useFormStatus)を参照してください。

### フォームデータの楽観的更新 {/*optimistically-updating-form-data*/}
`useOptimistic` フックは、ネットワークリクエストのようなバックグラウンド作業が完了する前に、ユーザインターフェースを楽観的に更新する方法を提供します。フォームにおいては、この技術はアプリをよりレスポンシブに感じさせるために役立ちます。ユーザがフォームを送信した際に、サーバのレスポンスを待たずに、予想される結果を用いてインターフェースを即座に更新しておきます。

例えば、ユーザがフォームにメッセージを入力して送信ボタンを押すと、`useOptimistic` フックにより、メッセージが実際にサーバに送信される前であっても、リストに "Sending..." というラベル付きでメッセージを即座に表示できるようになります。この「楽観的」アプローチにより、アプリの印象が高速でレスポンシブになります。その後フォームはバックグラウンドでメッセージの実際の送信を試みます。サーバにメッセージが到着したことを確認すると、"Sending..." ラベルが取り除かれます。

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
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
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages([...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```

</Sandpack>

[//]: # 'Uncomment the next line, and delete this line after the `useOptimistic` reference documentatino page is published'
[//]: # 'To learn more about the `useOptimistic` Hook see the [reference documentation](/reference/react/hooks/useOptimistic).'

### フォーム送信エラーの処理 {/*handling-form-submission-errors*/}

場合によっては、`<form>` の `action` で呼び出された関数がエラーをスローすることがあります。このようなエラーを処理するには、`<form>` をエラーバウンダリでラップします。`<form>` の `action` で呼び出される関数がエラーをスローすると、エラーバウンダリのフォールバックが表示されます。

<Sandpack>

```js src/App.js
import { ErrorBoundary } from "react-error-boundary";

export default function Search() {
  function search() {
    throw new Error("search error");
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
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>

### JavaScript を使わずにフォーム送信エラーを表示する {/*display-a-form-submission-error-without-javascript*/}

プログレッシブエンハンスメントの実現のため JavaScript バンドルが読み込まれる前にフォーム送信エラーメッセージを表示できるようにするには、以下の条件を満たす必要があります。

<<<<<<< HEAD
1. `<form>` が [サーバコンポーネント](/reference/rsc/use-client)によってレンダーされている
1. `<form>` の `action` プロパティに渡される関数が[サーバアクション](/reference/rsc/use-server)である
1. `useActionState` フックを使用してエラーメッセージを表示している

`useActionState` は[サーバアクション](/reference/rsc/use-server)と初期 state の 2 つの引数を受け取り、state 変数とアクションの 2 つの値を返します。`useActionState` が返したアクションは、フォームの `action` プロパティに渡します。`useActionState` が返した state 変数は、エラーメッセージを表示するために使用できます。`useActionState` に渡す[サーバアクション](/reference/rsc/use-server)が返す値は、state 変数を更新するために使用されます。
=======
1. `<form>` be rendered by a [Server Component](/reference/rsc/use-client)
1. the function passed to the `<form>`'s `action` prop be a [Server Function](/reference/rsc/server-functions)
1. the `useActionState` Hook be used to display the error message

`useActionState` takes two parameters: a [Server Function](/reference/rsc/server-functions) and an initial state. `useActionState` returns two values, a state variable and an action. The action returned by `useActionState` should be passed to the `action` prop of the form. The state variable returned by `useActionState` can be used to display an error message. The value returned by the Server Function passed to `useActionState` will be used to update the state variable.
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

<Sandpack>

```js src/App.js
import { useActionState } from "react";
import { signUpNewUser } from "./api";

export default function Page() {
  async function signup(prevState, formData) {
    "use server";
    const email = formData.get("email");
    try {
      await signUpNewUser(email);
      alert(`Added "${email}"`);
    } catch (err) {
      return err.toString();
    }
  }
  const [message, signupAction] = useActionState(signup, null);
  return (
    <>
      <h1>Signup for my newsletter</h1>
      <p>Signup with the same email twice to see an error</p>
      <form action={signupAction} id="signup-form">
        <label htmlFor="email">Email: </label>
        <input name="email" id="email" placeholder="react@example.com" />
        <button>Sign up</button>
        {!!message && <p>{message}</p>}
      </form>
    </>
  );
}
```

```js src/api.js hidden
let emails = [];

export async function signUpNewUser(newEmail) {
  if (emails.includes(newEmail)) {
    throw new Error("This email address has already been added");
  }
  emails.push(newEmail);
}
```

</Sandpack>

フォームアクションから state を更新する方法については、[`useActionState`](/reference/react/useActionState) のドキュメントを参照してください。

### 複数の送信タイプを処理する {/*handling-multiple-submission-types*/}

フォームは、ユーザが押したボタンに基づいて複数の送信アクションを処理するように設計することができます。フォーム内の各ボタンは、props である `formAction` を指定することで、異なるアクションや振る舞いに関連付けることができます。

ユーザが特定のボタンをタップしてフォームを送信すると、そのボタンの `formAction` によって定義された対応するアクションが実行されます。例えば、デフォルトでは書いた記事をレビュー用に送信するが、記事を下書きとして保存するための `formAction` がセットされた別のボタンもある、というフォームを作ることができます。

<Sandpack>

```js src/App.js
export default function Search() {
  function publish(formData) {
    const content = formData.get("content");
    const button = formData.get("button");
    alert(`'${content}' was published with the '${button}' button`);
  }

  function save(formData) {
    const content = formData.get("content");
    alert(`Your draft of '${content}' has been saved!`);
  }

  return (
    <form action={publish}>
      <textarea name="content" rows={4} cols={40} />
      <br />
      <button type="submit" name="button" value="submit">Publish</button>
      <button formAction={save}>Save draft</button>
    </form>
  );
}
```

</Sandpack>
