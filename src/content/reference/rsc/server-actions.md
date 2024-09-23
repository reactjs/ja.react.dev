---
title: サーバアクション
canary: true
---

<Intro>

サーバアクション (Server Action) を使用することで、サーバで実行される非同期関数をクライアントコンポーネントから呼び出すことができます。

</Intro>

<InlineToc />

<Note>

#### サーバアクションのサポートを追加する方法 {/*how-do-i-build-support-for-server-actions*/}

React 19 のサーバアクションは安定しており、マイナーバージョン間での破壊的変更はありませんが、サーバコンポーネントのバンドラやフレームワーク内でサーバアクションを実装するために使用される、基盤となる API は semver に従いません。React 19.x のマイナーバージョン間で変更が生じる可能性があります。

サーバアクションをバンドラやフレームワークでサポートする場合は、特定の React バージョンに固定するか、Canary リリースを使用することをお勧めします。サーバアクションを実装するために使用される API を安定化させるため、今後もバンドラやフレームワークと連携を続けていきます。

</Note>

サーバアクションが `"use server"` ディレクティブを付けて定義されると、フレームワークは自動的にそのサーバ関数への参照を作成し、その参照をクライアントコンポーネントに渡します。クライアントでこの関数が呼び出されると、React はサーバにリクエストを送信して元の関数を実行し、その結果を返します。

サーバアクションはサーバコンポーネント内で作成し、クライアントコンポーネントに props として渡すことができます。また、クライアントコンポーネントで直接インポートして使用することも可能です。

### サーバコンポーネントからサーバアクションを作成する {/*creating-a-server-action-from-a-server-component*/}

サーバコンポーネントは `"use server"` ディレクティブを使用してサーバアクションを定義できます。

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Server Component
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Server Action
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

React がサーバコンポーネントである `EmptyNote` をレンダーすると、`createNoteAction` 関数への参照を作成し、この参照をクライアントコンポーネントである `Button` に渡します。ボタンがクリックされると、React は渡された参照を使用してサーバにリクエストを送信し、`createNoteAction` 関数を実行します。

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Create Empty Note</button>
}
```

詳細については、[`"use server"`](/reference/rsc/use-server) のドキュメントを参照してください。


### クライアントコンポーネントからサーバアクションをインポートする {/*importing-server-actions-from-client-components*/}

クライアントコンポーネントは `"use server"` ディレクティブを使用するファイルから、サーバアクションをインポートできます。

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

バンドラがクライアントコンポーネントである `EmptyNote` をビルドする際に、バンドル内で `createNoteAction` 関数への参照を作成します。`button` がクリックされると、React は渡された参照を使用してサーバにリクエストを送信し、`createNoteAction` 関数を実行します。

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  <button onClick={createNoteAction} />
}
```

詳細については、[`"use server"`](/reference/rsc/use-server) のドキュメントを参照してください。

### アクションとサーバアクションを組み合わせる {/*composing-server-actions-with-actions*/}

サーバアクションはクライアントのアクションと組み合わせることができます。

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

このようにクライアント側のアクションでラップすることで、サーバアクションによる `isPending` state にアクセスできます。

詳細については、[フォーム外でサーバアクションを呼び出す](/reference/rsc/use-server#calling-a-server-action-outside-of-form)を参照してください。

### フォームアクションとサーバアクション {/*form-actions-with-server-actions*/}

サーバアクションは React 19 の新しいフォーム関連機能と連携します。

フォームにサーバアクションを渡すことで、自動的にフォームをサーバに送信できます。


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

詳細については、[フォーム内でのサーバアクション](/reference/rsc/use-server#server-actions-in-forms)を参照してください。

### `useActionState` とサーバアクション {/*server-actions-with-use-action-state*/}

`useActionState` とサーバアクションを組み合わせることで、アクションの進行中 state と最後に返されたレスポンスにアクセスする、という一般的なユースケースに対応できます。

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

サーバアクションと `useActionState` を使用する場合、React はハイドレーションの完了前に実行されたフォーム送信を自動的に再現します。これにより、ユーザはアプリのハイドレーションが起きる前からアプリを操作できるようになります。

詳細については、[`useActionState`](/reference/react-dom/hooks/useFormState) のドキュメントを参照してください。

### `useActionState` を使用したプログレッシブエンハンスメント {/*progressive-enhancement-with-useactionstate*/}

サーバアクションは `useActionState` の第 3 引数を使用してプログレッシブエンハンスメントもサポートします。

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
