---
title: サーバ関数
---

<RSC>

サーバ関数は [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) で使用するための機能です。

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

### サーバコンポーネントでサーバ関数を作成する {/*creating-a-server-function-from-a-server-component*/}

サーバコンポーネントは `"use server"` ディレクティブを使用してサーバ関数を定義できます。

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Function
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

React はサーバコンポーネントである `EmptyNote` をレンダーする際に、`createNoteAction` 関数への参照を作成し、この参照をクライアントコンポーネントである `Button` に渡します。ボタンがクリックされると、React は渡された参照を使用してサーバにリクエストを送信し、`createNoteAction` 関数を実行します。

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

詳細については、[`"use server"`](/reference/rsc/use-server) のドキュメントを参照してください。


### クライアントコンポーネントからサーバ関数をインポートする {/*importing-server-functions-from-client-components*/}

クライアントコンポーネントは `"use server"` ディレクティブを使用するファイルから、サーバ関数をインポートできます。

```js [[1, 3, "createNote"]]
"use server";

export async function createNote() {
  await db.notes.create();
}

```

<<<<<<< HEAD
バンドラがクライアントコンポーネントである `EmptyNote` をビルドする際に、バンドル内で `createNoteAction` 関数への参照を作成します。`button` がクリックされると、React は渡された参照を使用してサーバにリクエストを送信し、`createNoteAction` 関数を実行します。
=======
When the bundler builds the `EmptyNote` Client Component, it will create a reference to the `createNote` function in the bundle. When the `button` is clicked, React will send a request to the server to execute the `createNote` function using the reference provided:
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

```js [[1, 2, "createNote"], [1, 5, "createNote"], [1, 7, "createNote"]]
"use client";
import {createNote} from './actions';

function EmptyNote() {
  console.log(createNote);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNote'}
  <button onClick={() => createNote()} />
}
```

詳細については、[`"use server"`](/reference/rsc/use-server) のドキュメントを参照してください。

### サーバ関数をアクションと組み合わせる {/*server-functions-with-actions*/}

クライアントでは、サーバ関数をアクション内で呼び出せます。

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  )
}
```

このようにクライアント側のアクションでラップすることで、サーバ関数由来の `isPending` state にアクセスできるようになります。

詳細については、[`<form>` 外でサーバ関数を呼び出す](/reference/rsc/use-server#calling-a-server-function-outside-of-form)を参照してください。

### サーバ関数とフォームアクション {/*using-server-functions-with-form-actions*/}

サーバ関数は React 19 の新しいフォーム関連機能と連携して動作します。

フォームにサーバ関数を渡すことで、自動的にフォームをサーバに送信できます。


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

フォームの送信が成功すると、React は自動的にフォームをリセットします。`useActionState` を追加して、進行中 (pending) state や最終的なレスポンスにアクセスしたり、プログレッシブエンハンスメント (progressive enhancement) をサポートしたりすることが可能です。

詳細については、[フォーム内でのサーバ関数](/reference/rsc/use-server#server-functions-in-forms)を参照してください。

### `useActionState` とサーバ関数 {/*server-functions-with-use-action-state*/}

`useActionState` とサーバ関数を組み合わせることで、アクションの進行中 state と最後に返されたレスポンスにアクセスする、という一般的なユースケースに対応できます。

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

サーバ関数と `useActionState` を使用する場合、React はハイドレーションの完了前に実行されたフォーム送信を自動的に再現します。これにより、ユーザはアプリのハイドレーションが起きる前からアプリを操作できるようになります。

詳細については、[`useActionState`](/reference/react-dom/hooks/useFormState) のドキュメントを参照してください。

### `useActionState` を使用したプログレッシブエンハンスメント {/*progressive-enhancement-with-useactionstate*/}

サーバ関数は `useActionState` の第 3 引数を使用してプログレッシブエンハンスメントもサポートします。

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<CodeStep step={2}>パーマリンク</CodeStep>が `useActionState` に渡された場合、JavaScript バンドルが読み込まれる前にフォームが送信されると、React はこの渡された URL にリダイレクトします。

詳しくは、[`useActionState`](/reference/react-dom/hooks/useFormState) のドキュメントを参照してください。
