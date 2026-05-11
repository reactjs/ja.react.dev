---
title: useFormStatus
---

<Intro>

`useFormStatus` は、直近のフォーム送信に関するステータス情報を提供するフックです。

```js
const { pending, data, method, action } = useFormStatus();
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useFormStatus()` {/*use-form-status*/}

`useFormStatus` フックは、直近のフォーム送信に関するステータス情報を提供します。

```js {5},[[1, 6, "status.pending"]]
import { useFormStatus } from "react-dom";
import action from './actions';

function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>Submit</button>
}

export default function App() {
  return (
    <form action={action}>
      <Submit />
    </form>
  );
}
```

<<<<<<< HEAD
ステータス情報を取得するには、この `Submit` コンポーネントが `<form>` 内でレンダーされている必要があります。このフックは、フォームが送信中かどうかを示す <CodeStep step={1}>`pending`</CodeStep> プロパティなどの情報を返します。
=======
To get status information, the `Submit` component must be rendered within a `<form>`. The Hook returns information like the <CodeStep step={1}>`pending`</CodeStep> property which tells you if the form is actively submitting.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

上記の例では、`Submit` がこの情報を使用して、フォームが送信中の間 `<button>` を無効にして押せなくしています。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

`useFormStatus` は引数を受け取りません。

#### 返り値 {/*returns*/}

以下のプロパティを持つ `status` オブジェクト。

* `pending`: ブーリアン。`true` の場合、親 `<form>` で送信が進行中であることを意味します。それ以外の場合は `false` となります。

* `data`: [`FormData` インターフェース](https://developer.mozilla.org/en-US/docs/Web/API/FormData)を実装したオブジェクト。親 `<form>` が送信中のデータを含んでいます。送信がアクティブでない場合や親 `<form>` がない場合は `null` になります。

* `method`: `'get'` または `'post'` のいずれかの文字列。親 `<form>` が `GET` と `POST` [HTTP メソッド](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)のどちらで送信されているかを表します。デフォルトでは、`<form>` は `GET` メソッドを使用しますが、[`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#method) によって指定することができます。

[//]: # (Link to `<form>` documentation. "Read more on the `action` prop on `<form>`.")
* `action`: 親 `<form>` の props である `action` に渡された関数への参照。親 `<form>` がない場合、このプロパティは `null` です。`action` プロパティに URI 値が渡された場合や `action` プロパティが指定されていない場合も、`status.action` は `null` になります。

#### 注意点 {/*caveats*/}

<<<<<<< HEAD
* `useFormStatus` フックは、`<form>` 内でレンダーされるコンポーネントから呼び出す必要があります。
* `useFormStatus` は親 `<form>` のステータス情報のみを返します。同じコンポーネントや子コンポーネント内でレンダーされた `<form>` のステータス情報は返しません。
=======
* The `useFormStatus` Hook must be called from a component that is rendered inside a `<form>`.
* `useFormStatus` will only return status information for a parent `<form>`. It will not return status information for any `<form>` rendered in that same component or children components.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

---

## 使用法 {/*usage*/}

### フォーム送信中にステータスを表示 {/*display-a-pending-state-during-form-submission*/}
フォームの送信中にそのステータスを表示するには、`<form>` 内でレンダーされるコンポーネントで `useFormStatus` フックを呼び出し、返された `pending` プロパティを読み取ります。

<<<<<<< HEAD
以下では、フォームが送信中であることを示すために `pending` プロパティを使用しています。
=======
Here, we use the `pending` property to indicate the form is submitting.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

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

<Pitfall>

##### `useFormStatus` は同じコンポーネントでレンダーされた `<form>` のステータス情報を返さない {/*useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component*/}

`useFormStatus` フックは親の `<form>` に対するステータス情報のみを返します。フックを呼び出しているのと同じコンポーネントや子コンポーネントでレンダーされる `<form>` には対応していません。

```js
function Form() {
  // 🚩 `pending` will never be true
  // useFormStatus does not track the form rendered in this component
  const { pending } = useFormStatus();
  return <form action={submit}></form>;
}
```

こうするのではなく、`useFormStatus` を `<form>` の内部にあるコンポーネントから呼び出してください。

```js
function Submit() {
  // ✅ `pending` will be derived from the form that wraps the Submit component
  const { pending } = useFormStatus();
  return <button disabled={pending}>...</button>;
}

function Form() {
  // This is the <form> `useFormStatus` tracks
  return (
    <form action={submit}>
      <Submit />
    </form>
  );
}
```

</Pitfall>

### ユーザが送信中のフォームデータを読み取る {/*read-form-data-being-submitted*/}

`useFormStatus` から返されるステータス情報の `data` プロパティを使用して、ユーザが送信しているデータを表示できます。

以下の例は、ユーザが自分の欲しいユーザネームを要求できるフォームです。`useFormStatus` を使用することで、ユーザがどんなユーザネームを要求したのか確認できる一時的なステータスメッセージを表示できます。

<Sandpack>

```js src/UsernameForm.js active
import {useState, useMemo, useRef} from 'react';
import {useFormStatus} from 'react-dom';

export default function UsernameForm() {
  const {pending, data} = useFormStatus();

  return (
    <div>
      <h3>Request a Username: </h3>
      <input type="text" name="username" disabled={pending}/>
      <button type="submit" disabled={pending}>
        Submit
      </button>
      <br />
      <p>{data ? `Requesting ${data?.get("username")}...`: ''}</p>
    </div>
  );
}
```

```js src/App.js
import UsernameForm from './UsernameForm';
import { submitForm } from "./actions.js";
import {useRef} from 'react';

export default function App() {
  const ref = useRef(null);
  return (
    <form ref={ref} action={async (formData) => {
      await submitForm(formData);
      ref.current.reset();
    }}>
      <UsernameForm />
    </form>
  );
}
```

```js src/actions.js hidden
export async function submitForm(query) {
    await new Promise((res) => setTimeout(res, 2000));
}
```

```css
p {
    height: 14px;
    padding: 0;
    margin: 2px 0 0 0 ;
    font-size: 14px
}

button {
    margin-left: 2px;
}

```

</Sandpack>

---

## トラブルシューティング {/*troubleshooting*/}

### `status.pending` が `true` にならない {/*pending-is-never-true*/}

<<<<<<< HEAD
`useFormStatus` は親の `<form>` に対するステータス情報のみを返します。
=======
`useFormStatus` will only return status information for a parent `<form>`.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

`useFormStatus` を呼び出しているコンポーネントが `<form>` の中にネストされていない場合、`status.pending` は常に `false` を返します。`useFormStatus` が `<form>` 要素の子コンポーネント内で呼び出されていることを確認してください。

`useFormStatus` は、同じコンポーネントでレンダーされた `<form>` の状態は追跡しません。詳細は[落とし穴](#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component)欄を参照してください。
