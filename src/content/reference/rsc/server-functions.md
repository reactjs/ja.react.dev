---
title: サーバ関数
---

<RSC>

サーバ関数は [React Server Components](/reference/rsc/server-components) で使用するための機能です。

**補足**：2024 年 9 月までは、すべてのサーバ関数を「サーバアクション (Server Action)」と呼んでいました。サーバ関数が `action` プロパティに渡されるか `action` 内から呼び出されている場合は、それはサーバアクションとも呼べるでしょうが、すべてのサーバ関数がサーバアクションであるとは限りません。サーバ関数自体は様々な目的で使用できるものですので、それを反映するために本ドキュメントでは名前を変更しました。

</RSC>

<Intro>

サーバ関数 (Server Function) を使用することで、サーバで実行される非同期関数をクライアントコンポーネントから呼び出すことができます。

</Intro>

<InlineToc />

<Note>

#### サーバ関数のサポートを追加する方法 {/*how-do-i-build-support-for-server-functions*/}

React 19 のサーバ関数は安定しており、マイナーバージョン間での破壊的変更はありませんが、サーバコンポーネントのバンドラやフレームワーク内でサーバアクションを実装するために使用される、基盤となる API は semver に従いません。React 19.x のマイナーバージョン間で変更が生じる可能性があります。

サーバ関数をバンドラやフレームワークでサポートする場合は、特定の React バージョンに固定するか、Canary リリースを使用することをお勧めします。サーバ関数を実装するために使用される API を安定化させるため、今後もバンドラやフレームワークと連携を続けていきます。

</Note>

サーバ関数が `"use server"` ディレクティブを付けて定義されると、フレームワークは自動的にそのサーバ関数への参照を作成し、その参照をクライアントコンポーネントに渡します。クライアントでこの関数が呼び出されると、React はサーバにリクエストを送信して元の関数を実行し、その結果を返します。

サーバアクションはサーバコンポーネント内で作成し、クライアントコンポーネントに props として渡すことができます。また、クライアントコンポーネントで直接インポートして使用することも可能です。

## 使用法 {/*usage*/}

<<<<<<< HEAD
### サーバコンポーネントでサーバ関数を作成する {/*creating-a-server-function-from-a-server-component*/}
=======
### Creating a Server Function in a Server Component {/*creating-a-server-function-from-a-server-component*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

サーバコンポーネントは `"use server"` ディレクティブを使用してサーバ関数を定義できます。

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote() {
  async function createNoteAction() {
    // Server Function
    'use server';

    await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
```

React はサーバコンポーネントである `EmptyNote` をレンダーする際に、`createNoteAction` 関数への参照を作成し、この参照をクライアントコンポーネントである `Button` に渡します。ボタンがクリックされると、React は渡された参照を使用してサーバにリクエストを送信し、`createNoteAction` 関数を実行します。

```js {5}
"use client";

export default function Button({onClick}) {
  console.log(onClick);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>;
}
```

詳細については、[`"use server"`](/reference/rsc/use-server) のドキュメントを参照してください。

<<<<<<< HEAD

### クライアントコンポーネントからサーバ関数をインポートする {/*importing-server-functions-from-client-components*/}
=======
### Importing a Server Function into a Client Component {/*importing-server-functions-from-client-components*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

クライアントコンポーネントは `"use server"` ディレクティブを使用するファイルから、サーバ関数をインポートできます。

```js [[1, 4, "createNote"]]
// actions.js
"use server";

export async function createNote() {
  await db.notes.create();
}
```

バンドラがクライアントコンポーネントである `EmptyNote` をビルドする際に、バンドル内で `createNote` 関数への参照を作成します。`button` がクリックされると、React は渡された参照を使用してサーバにリクエストを送信し、`createNote` 関数を実行します。

```js [[1, 4, "createNote"], [1, 7, "createNote"], [1, 9, "createNote"]]
// EmptyNote.js
"use client";

import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  return <button onClick={() => createNote()}>Create Empty Note</button>;
}
```

詳細については、[`"use server"`](/reference/rsc/use-server) のドキュメントを参照してください。

<<<<<<< HEAD
### サーバ関数をアクションと組み合わせる {/*server-functions-with-actions*/}
=======
### Calling a Server Function from an Action {/*server-functions-with-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

クライアントでは、サーバ関数をアクション内で呼び出せます。

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 15, "updateName"], [2, 13, "submitAction"], [2, 28, "submitAction"]]
// UpdateName.js
"use client";

import {useState, useTransition} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  function submitAction() {
    startTransition(async () => {
      const {error} = await updateName(name);
      // State updates after await aren't automatically marked as Transitions,
      // so wrap them in another startTransition.
      startTransition(() => {
        setError(error);
        if (!error) {
          setName('');
        }
      });
    });
  }

  return (
    <form action={submitAction}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={event => setName(event.target.value)}
        disabled={isPending}
      />
      {error && <span>Failed: {error}</span>}
    </form>
  );
}
```

このようにクライアント側のアクションでラップすることで、サーバ関数由来の `isPending` state にアクセスできるようになります。

<<<<<<< HEAD
詳細については、[`<form>` 外でサーバ関数を呼び出す](/reference/rsc/use-server#calling-a-server-function-outside-of-form)を参照してください。

### サーバ関数とフォームアクション {/*using-server-functions-with-form-actions*/}
=======
For more, see the docs for [Calling a Server Function outside of `<form>`](/reference/rsc/use-server#calling-a-server-function-outside-of-form).

### Passing a Server Function to the `<form>` `action` prop {/*using-server-functions-with-form-actions*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

サーバ関数は React 19 の新しいフォーム関連機能と連携して動作します。

<<<<<<< HEAD
フォームにサーバ関数を渡すことで、自動的にフォームをサーバに送信できます。
=======
Pass a Server Function to the `<form>` `action` prop to submit the form to the server. React passes the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) to the Server Function as its first argument:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    throw new Error('Name is required');
  }
  await db.users.updateName(name);
}
```

```js [[1, 4, "updateName"], [1, 8, "updateName"]]
// UpdateName.js
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  );
}
```

<<<<<<< HEAD
フォームの送信が成功すると、React は自動的にフォームをリセットします。`useActionState` を追加して、進行中 (pending) state や最終的なレスポンスにアクセスしたり、プログレッシブエンハンスメント (progressive enhancement) をサポートしたりすることが可能です。
=======
When the Server Function passed to the `<form>` `action` prop succeeds, React automatically resets the form's uncontrolled fields. Users can submit the form before its JavaScript bundle loads. Use `useActionState` to access the Action's pending state and most recent return value.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

詳細については、[フォーム内でのサーバ関数](/reference/rsc/use-server#server-functions-in-forms)を参照してください。

<<<<<<< HEAD
### `useActionState` とサーバ関数 {/*server-functions-with-use-action-state*/}

`useActionState` とサーバ関数を組み合わせることで、アクションの進行中 state と最後に返されたレスポンスにアクセスする、という一般的なユースケースに対応できます。
=======
### Calling a Server Function with `useActionState` {/*server-functions-with-use-action-state*/}

Call a Server Function with `useActionState` to access the Action's pending state and most recent return value. The Server Function receives the previous state as its first argument and the submitted [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) as its second argument. Its return value becomes the next state:
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

```js [[1, 4, "updateName"]]
// actions.js
"use server";

export async function updateName(previousState, formData) {
  const name = formData.get('name');
  if (typeof name !== 'string' || !name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
  return {error: null};
}
```

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "submitAction"], [2, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending} />
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

<<<<<<< HEAD
サーバ関数と `useActionState` を使用する場合、React はハイドレーションの完了前に実行されたフォーム送信を自動的に再現します。これにより、ユーザはアプリのハイドレーションが起きる前からアプリを操作できるようになります。
=======
When the function passed to `useActionState` is a Server Function, users can submit the form before hydration finishes. React can display the Server Function's return value before JavaScript loads.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

詳細については、[`useActionState`](/reference/react/useActionState) のドキュメントを参照してください。

<<<<<<< HEAD
### `useActionState` を使用したプログレッシブエンハンスメント {/*progressive-enhancement-with-useactionstate*/}
=======
To keep submitted values or control when the form resets, see [Preserving form values after an Action](/reference/react-dom/components/form#preserve-form-values-after-an-action).

### Supporting progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

サーバ関数は `useActionState` の第 3 引数を使用してプログレッシブエンハンスメントもサポートします。

```js [[1, 5, "updateName"], [1, 8, "updateName"], [2, 8, "/name/update"], [3, 8, "submitAction"], [3, 11, "submitAction"]]
// UpdateName.js
"use client";

import {useActionState} from 'react';
import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, {error: null}, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<<<<<<< HEAD
<CodeStep step={2}>パーマリンク</CodeStep>が `useActionState` に渡された場合、JavaScript バンドルが読み込まれる前にフォームが送信されると、React はこの渡された URL にリダイレクトします。
=======
If you pass the <CodeStep step={2}>`permalink`</CodeStep> to `useActionState`, the browser navigates to that URL when the form is submitted before the JavaScript bundle loads. At the destination, render the same form component with the same Server Function and `permalink` so React can pass the returned state to it.
>>>>>>> f5fa1e82edacdf8c6bfc4dfd9cf52029a96d5fd3

詳しくは、[`useActionState`](/reference/react/useActionState) のドキュメントを参照してください。
