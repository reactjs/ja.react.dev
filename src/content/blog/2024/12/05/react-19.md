---
title: "React v19"
author: The React Team
date: 2024/12/05
description: React 19 が npm で利用可能になりました！ この投稿では React 19 の新機能、およびそれらをどのように採用するかについて概説します。
---

December 05, 2024 by [The React Team](/community/team)

---
<Note>

### React 19 は安定版になりました {/*react-19-is-now-stable*/}

4 月に React 19 RC の記事として本記事が公開されて以降に、以下の内容が追加となっています。

- **サスペンド中のツリーのプリウォーム**：[サスペンスに関する改善](/blog/2024/04/25/react-19-upgrade-guide#improvements-to-suspense)
- **静的サイト用の React DOM API**: [静的サイト用の新 DOM API](#new-react-dom-static-apis)

_この記事の投稿日時も、安定版リリースに合わせて変更となっています。_

</Note>

<Intro>

npm で React 19 が利用可能になりました！

</Intro>

[React 19 アップグレードガイド](/blog/2024/04/25/react-19-upgrade-guide)では、アプリを React 19 にアップグレードするためのステップバイステップガイドをお示ししました。この投稿では、React 19 の新機能と、それらをどのように採用するかについて概説します。

- [React 19 の新機能](#whats-new-in-react-19)
- [React 19 の改善点](#improvements-in-react-19)
- [アップグレード方法](#how-to-upgrade)

破壊的変更のリストについては、[アップグレードガイド](/blog/2024/04/25/react-19-upgrade-guide)を参照してください。

---

## React 19 の新機能 {/*whats-new-in-react-19*/}

### アクション (Action) {/*actions*/}

React アプリの一般的なユースケースは、データの書き換えを行い、それに応じて state を更新するというものです。例えば、ユーザがフォームを送信してユーザ名を変更する場合、API リクエストを発行し、そのレスポンスを処理します。これまでは、送信中 (pending) 状態、エラー、楽観的更新やリクエストの順序について、手動で管理する必要がありました。

例えば、送信中状態やエラーの処理は、以下のように `useState` を使って行っていました。

```js
// Before Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

React 19 では、トランジション内で非同期関数を使用することで、送信中状態、エラー、フォーム、楽観的更新を自動的に処理するためのサポートが追加されます。

例えば、`useTransition` を使用すれば以下のように送信中状態を処理できます。

```js
// Using pending state from Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

この非同期トランジションは、開始直後に `isPending` 状態を true にセットし、非同期リクエストを実行し、すべてのトランジション終了後に `isPending` を false に切り替えます。これにより、データが変更されている最中も、現在の UI をレスポンシブかつインタラクティブに保つことができます。

<Note>

#### 非同期トランジションを使用する関数を規約として「アクション」と呼ぶ {/*by-convention-functions-that-use-async-transitions-are-called-actions*/}

アクションはあなたの代わりに自動的にデータの送信を管理してくれます。

- **送信中状態**：アクションは送信中状態を提供します。これはリクエストと共に開始され、最終的な state の更新がコミットされると自動的にリセットされます。
- **楽観的更新**：アクションは新しい [`useOptimistic`](#new-hook-optimistic-updates) フックをサポートしており、リクエスト送信中にユーザに対し即時のフィードバックを表示することができます。
- **エラー処理**：アクションはエラー処理を提供するため、リクエストが失敗した場合にエラーバウンダリを表示し、楽観的更新を自動的に元の状態に復元できます。
- **フォーム**：`<form>` 要素は、props である `action` および `formAction` に関数を渡すことをサポートするようになりました。`action` に関数を渡すことでデフォルトでアクションとして扱われ、送信後にフォームを自動的にリセットします。

</Note>

アクションの仕組みを土台として、React 19 では楽観的更新を管理するための [`useOptimistic`](#new-hook-optimistic-updates) と、アクションの一般的なユースケースを扱うための新しいフックである [`React.useActionState`](#new-hook-useactionstate) が導入されます。`react-dom` では、フォームを自動的に管理する [`<form>` アクション](#form-actions)と、フォームにおけるアクションの一般的なユースケースをサポートする [`useFormStatus`](#new-hook-useformstatus) が追加されています。

React 19 では、上記の例は以下のように簡略化できます。

```js
// Using <form> Actions and useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

以下のセクションで、React 19 の新しいアクション関連機能を詳しく説明していきます。

### 新しいフック：`useActionState` {/*new-hook-useactionstate*/}

アクションの一般的なユースケースを簡単に実現するため、`useActionState` という新しいフックを追加しました。

```js
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      // You can return any result of the action.
      // Here, we return only the error.
      return error;
    }

    // handle success
    return null;
  },
  null,
);
```

`useActionState` は関数（「アクション」本体）を受け取り、そのアクションをラップしたものを返します。これが動作するのはアクションのコンポジションが可能だからです。ラップされたアクションが呼び出されると、`useActionState` はアクションの最終結果を `data` として、アクションの進行中状態を `pending` として返します。

<Note>

`React.useActionState` は以前の Canary リリースでは `ReactDOM.useFormState` と呼ばれていましたが、名前を変更し、`useFormState` を非推奨にしました。

詳細は [#28491](https://github.com/facebook/react/pull/28491) を参照してください。

</Note>

詳細は、[`useActionState`](/reference/react/useActionState) のドキュメントをご覧ください。

### React DOM：`<form>` アクション {/*form-actions*/}

アクションはまた、`react-dom` における React 19 の新しい `<form>` 機能とも統合されています。`<form>`、`<input>`、`<button>` の各要素において、props である `action` および `formAction` に関数を渡すことがサポートされるようになりました。これによりアクションを用いて自動的にフォームの送信が可能です。

```js [[1,1,"actionFunction"]]
<form action={actionFunction}>
```

`<form>` アクションが成功すると、React は非制御コンポーネントの場合にフォームを自動的にリセットします。手動で `<form>` をリセットする必要がある場合は、新しい React DOM の API である `requestFormReset` を呼び出すことができます。

詳細は、`react-dom` のドキュメントで [`<form>`](/reference/react-dom/components/form)、[`<input>`](/reference/react-dom/components/input)、`<button>` をご覧ください。

### React DOM の新しいフック：`useFormStatus` {/*new-hook-useformstatus*/}

デザインシステムにおいてはよく、props を深く受け渡すことなしに、自身の所属する `<form>` に関する情報にアクセスする必要があるデザインコンポーネントを書くことがあります。これはコンテクストを介して行うことも可能ですが、一般的なユースケースを簡単に行えるよう、新しいフックである `useFormStatus` を追加しました。

```js [[1, 4, "pending"], [1, 5, "pending"]]
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```

`useFormStatus` を使うことで、まるで親フォーム自体がコンテクストプロバイダであるかのように、親 `<form>` の状態を読み取れます。

詳細は、`react-dom` ドキュメントの [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) をご覧ください。

### 新しいフック：`useOptimistic` {/*new-hook-optimistic-updates*/}

データの書き換えを行う際に一般的な UI パターンは、非同期リクエストの進行中に、最終的にとるはずの状態を先に楽観的に表示しておくというものです。React 19 では、これを簡単に行うための新しいフックである `useOptimistic` を追加しています。

```js {2,6,13,19}
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```

`useOptimistic` フックは、`updateName` リクエストが進行中になると、`optimisticName` を即座にレンダーします。更新が完了するかエラーが発生すると、React は自動的に `currentName` の値に戻します。

詳細については、[`useOptimistic`](/reference/react/useOptimistic) のドキュメントをご覧ください。

### 新しい API：`use` {/*new-feature-use*/}

React 19 では、レンダー中にリソースを読み取るための新しい API である `use` を導入しています。

たとえば、`use` でプロミスを読み取ることができます。プロミスが解決 (resolve) するまで React はサスペンドします。

```js {1,5}
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // When `use` suspends in Comments,
  // this Suspense boundary will be shown.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

<Note>

#### `use` はレンダー中に作成されたプロミスをサポートしない {/*use-does-not-support-promises-created-in-render*/}

レンダー中に作成されたプロミスを `use` に渡そうとすると、React は警告を表示します。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework.

</ConsoleLogLine>

</ConsoleBlockMulti>

<<<<<<< HEAD
修正するには、プロミスをキャッシュできるサスペンス対応のライブラリまたはフレームワークで作られたプロミスを渡す必要があります。将来的には、レンダー中にプロミスをキャッシュしやすくする機能を提供する予定です。
=======
To fix, you need to pass a promise from a Suspense powered library or framework that supports caching for promises. In the future we plan to ship features to make it easier to cache promises in render.
>>>>>>> 91614a51a1be9078777bc337ba83fc62e606cc14

</Note>

また、`use` を使用してコンテクストを読み取ることもでき、早期リターンの後などに条件付きでコンテクストを読み取れるようになります。

```js {1,11}
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // This would not work with useContext
  // because of the early return.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```

`use` API は、フックと同様にレンダー中にのみ呼び出すことができます。しかしフックとは異なり、`use` は条件分岐の中でも呼び出すことが可能です。将来的には、`use` を使用してレンダー中にリソースを使用する方法をさらに拡充する予定です。

詳細については、[`use`](/reference/react/use) のドキュメントをご覧ください。

## 静的サイト用の新 DOM API {/*new-react-dom-static-apis*/}

静的サイト生成 (static site generation) のための API を `react-dom/static` に 2 つ追加しました。
- [`prerender`](/reference/react-dom/static/prerender)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)

これらは `renderToString` の改善版であり、静的な HTML 生成の際に、データの待機を行うようになっています。Node.js のストリームや Web 標準のストリームで動作するよう設計されています。例えば Web ストリームの環境では、`prerender` を使って React ツリーを静的な HTML にプリレンダーできます。

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

プリレンダー API は、静的な HTML をストリームとして返す前に、すべてのデータの読み込みを待機します。このストリームは文字列に変換することも、レスポンスに含めて送信することも可能です。ただし、既存の [React DOM サーバレンダリング API](/reference/react-dom/server) がサポートするような、データを読み込みながらコンテンツをストリーミングする機能はサポートしていません。

詳細については [React DOM 静的サイト用 API](/reference/react-dom/static) を参照してください。

## React Server Components {/*react-server-components*/}

### サーバコンポーネント {/*server-components*/}

サーバコンポーネントは、クライアントアプリケーションや SSR サーバとは別の環境で、バンドル前にコンポーネントを事前レンダーするための新しいオプションです。React Server Components の "server" とはこの別の環境を指しています。サーバコンポーネントは、CI サーバでビルド時に一度だけ実行することも、ウェブサーバを使用してリクエストごとに実行することもできます。

React 19 には、Canary チャンネルにあったすべての React Server Components の機能が含まれています。これにより、サーバコンポーネントを使用するライブラリは、React 19 を peer dependency としてターゲットにすることができ、`react-server` [エクスポート条件](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md#react-server-conditional-exports) を用いて[フルスタック React アーキテクチャ](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision)をサポートするフレームワークで使用できます。


<Note>

#### サーバコンポーネントのサポートを追加する方法 {/*how-do-i-build-support-for-server-components*/}

React 19 の React Server Components は安定しており、マイナーバージョン間での破壊的変更はありませんが、サーバコンポーネントのバンドラやフレームワークを実装するために使用される基盤となる API は semver に従いません。React 19.x のマイナーバージョン間で変更が生じる可能性があります。

React Server Components をバンドラやフレームワークでサポートする場合は、特定の React バージョンに固定するか、Canary リリースを使用することをお勧めします。React Server Components を実装するために使用される API を安定化させるため、今後もバンドラやフレームワークと連携を続けていきます。

</Note>


詳細については、[React Server Components](/reference/rsc/server-components) のドキュメントをご覧ください。

### サーバアクション {/*server-actions*/}

サーバアクションにより、クライアントコンポーネントからサーバ上で実行される非同期関数を呼び出せるようになります。

サーバアクションが `"use server"` ディレクティブを用いて定義されると、フレームワークは自動的にサーバ関数への参照を作成し、その参照をクライアントコンポーネントに渡します。クライアントでその関数が呼び出されると、React はサーバにリクエストを送り、関数を実行し、その結果を返します。

<Note>

#### サーバコンポーネントのためのディレクティブはない {/*there-is-no-directive-for-server-components*/}

よくある誤解として、サーバコンポーネントを `"use server"` を用いて定義するものだと考えるというものがあります。サーバコンポーネントにはディレクティブがありません。`"use server"` ディレクティブは、サーバアクションのためのものです。

詳細については、[ディレクティブ](/reference/rsc/directives)のドキュメントをご覧ください。

</Note>

サーバアクションをサーバコンポーネント内で作成し props としてクライアントコンポーネントに渡すことも、クライアントコンポーネントでインポートして使用することもできます。

詳細については、[React サーバアクション](/reference/rsc/server-actions)のドキュメントをご覧ください。

## React 19 の改善点 {/*improvements-in-react-19*/}

### `ref` が props に {/*ref-as-a-prop*/}

React 19 から、関数コンポーネントにおいて `ref` に props としてアクセスできるようになりました。

```js [[1, 1, "ref"], [1, 2, "ref", 45], [1, 6, "ref", 14]]
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```

新しい関数コンポーネントでは `forwardRef` が不要になります。新しい props である `ref` を使用するようコンポーネントを自動的に更新する codemod を公開する予定です。将来のバージョンでは `forwardRef` は非推奨となり、削除されます。

<Note>

クラスに渡された `ref` はコンポーネントインスタンスを参照するため、props としては渡されません。

</Note>

### ハイドレーションエラー時の差分表示 {/*diffs-for-hydration-errors*/}

`react-dom` におけるハイドレーションエラーのエラーレポートを改善しました。これまで開発時には、たとえば以下のようなエラーが複数ログとして記録されていましたが、ハイドレーション不一致に関する情報は含まれていませんでした。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

今後は、不一致部分の差分を含んだ単一のメッセージがログに記録されるようになります。


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### `<Context>` がプロバイダに {/*context-as-a-provider*/}

React 19 では、`<Context.Provider>` の代わりに `<Context>` をプロバイダとしてレンダーできます。


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

新しいコンテクストプロバイダは `<Context>` のように使用できるため、既存のプロバイダを変換するための codemod を公開する予定です。将来のバージョンでは `<Context.Provider>` を非推奨にする予定です。

### ref 用のクリーンアップ関数 {/*cleanup-functions-for-refs*/}

`ref` コールバックからクリーンアップ関数を返すことがサポートされるようになりました。

```js {7-9}
<input
  ref={(ref) => {
    // ref created

    // NEW: return a cleanup function to reset
    // the ref when element is removed from DOM.
    return () => {
      // ref cleanup
    };
  }}
/>
```

コンポーネントがアンマウントされると、React は `ref` コールバックから返されたクリーンアップ関数を呼び出します。これは DOM への ref、クラスコンポーネントへの ref、および `useImperativeHandle` のいずれに対しても機能します。

<Note>

これまで、React はコンポーネントのアンマウント時に `ref` に渡された関数を `null` を引数にして呼び出していました。`ref` がクリーンアップ関数を返す場合、React はこのステップをスキップするようになります。

将来のバージョンでは、コンポーネントのアンマウント時に ref が `null` を引数に呼び出される動作は、非推奨になる予定です。

</Note>

ref クリーンアップ関数の導入により、`ref` コールバックからそれ以外のものを返すことは TypeScript によって拒否されるようになりました。通常、これは暗黙の return をやめることで修正できます。例えば以下のようにします。

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

元のコードは `HTMLDivElement` のインスタンスを返していますが、TypeScript はこれがクリーンアップ関数を返すつもりでミスをしたのか、クリーンアップ関数を返したくないのか判断できないのです。

このパターンは [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return) の codemod を用いて修正できます。

### `useDeferredValue` の初期値 {/*use-deferred-value-initial-value*/}

`useDeferredValue` に `initialValue` オプションを追加しました。

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "''"]]
function Search({deferredValue}) {
  // On initial render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

<CodeStep step={2}>initialValue</CodeStep> が指定された場合、`useDeferredValue` はコンポーネントの初期レンダーの際にそれを `value` として返し、バックグラウンドで <CodeStep step={1}>deferredValue</CodeStep> を返すための再レンダーをスケジュールします。

詳細については、[`useDeferredValue`](/reference/react/useDeferredValue) をご覧ください。

### ドキュメントメタデータのサポート {/*support-for-metadata-tags*/}

HTML では、`<title>`、`<link>`、`<meta>` などのドキュメントメタデータタグは、ドキュメントの `<head>` セクションに配置されるよう決まっています。しかし React では、アプリに必要なメタデータを決めるコンポーネントが `<head>` をレンダーしている場所から非常に遠いことや、そもそも React が `<head>` をレンダーしないことがあります。過去には、これらの要素をエフェクトで手動で挿入するか [`react-helmet`](https://github.com/nfl/react-helmet) のようなライブラリを使用しつつ、React アプリケーションをサーバでレンダーする際に特別な注意を払う必要がありました。

React 19 では、コンポーネントでドキュメントメタデータタグをレンダーするネイティブのサポートを追加しました。

```js {5-8}
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```

React がこのコンポーネントをレンダーする際、`<title>`、`<link>`、`<meta>` タグを認識し、自動的にドキュメントの `<head>` セクションに移動させます。これらのメタデータタグをネイティブにサポートすることで、クライアントのみのアプリ、ストリーミング SSR、サーバコンポーネントのいずれでも動作することを保証できます。

<Note>

#### メタデータライブラリはまだ必要 {/*you-may-still-want-a-metadata-library*/}

単純なユースケースでは、タグとしてドキュメントメタデータをレンダーするので十分でしょうが、ライブラリは現在のルートに基づいて汎用メタデータを個別のメタデータで上書きするといった、より強力な機能を提供できます。これらの機能は、フレームワークや [`react-helmet`](https://github.com/nfl/react-helmet) のようなライブラリがメタデータタグをサポートしやすくするためのものであり、これらを置き換えるものではありません。

</Note>

詳細については [`<title>`](/reference/react-dom/components/title)、[`<link>`](/reference/react-dom/components/link)、[`<meta>`](/reference/react-dom/components/meta) のドキュメントをご覧ください。

### スタイルシートのサポート {/*support-for-stylesheets*/}

スタイルシートには優先順位に関するルールがあるため、外部リンク (`<link rel="stylesheet" href="...">`) される場合でもインライン (`<style>...</style>`) の場合でも、DOM 内での配置を慎重に考える必要があります。コンポーネントのコンポジション能力を保ちつつ、コンポーネント内でスタイルシート機能を構築することは困難です。そのためユーザはよく、スタイルに依存するコンポーネントから遠く離れた場所でスタイルをまとめてロードするか、この複雑さをカプセル化するスタイルライブラリを使用する必要がありました。

React 19 では、スタイルシートに対する組み込みのサポートを提供することでこの複雑さに対処し、またクライアントにおける並行レンダー機能やサーバにおけるストリーミングレンダー機能との深い統合を行います。スタイルシートの `precedence`（優先度）を React に伝えることで、スタイルシートの DOM への挿入順序を管理し、また外部スタイルシートの場合はそれがロードされてからそのスタイルルールに依存するコンテンツが表示されるよう保証します。

```js {4,5,17}
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- will be inserted between foo & bar
    </div>
  )
}
```

サーバサイドレンダリングの場合、React は `<head>` にスタイルシートを含めることで、それをブラウザがロードするまで描画が起きないことを保証します。ストリーミングを既に開始した後でスタイルシートが見つかった場合でも、React はサスペンスバウンダリ内でスタイルシートに依存するコンテンツが表示される前に、クライアントの `<head>` にそのスタイルシートが挿入されることを保証します。

クライアントサイドレンダリングの場合、React は新しくレンダーされたスタイルシートが読み込まれるのを待ってからレンダーをコミットします。そのコンポーネントをアプリケーション内の複数の場所からレンダーする場合でも、React はドキュメントにスタイルシートを一度だけ挿入します。

```js {5}
function App() {
  return <>
    <ComponentOne />
    ...
    <ComponentOne /> // won't lead to a duplicate stylesheet link in the DOM
  </>
}
```

スタイルシートを手動で読み込むことに慣れているユーザにとっては、これはスタイルシートをそれに依存するコンポーネントの隣に配置することで局所的な理解をしやすくできる機会となり、また実際に使用するスタイルシートのみが読み込まれることを保証しやすくなるでしょう。

スタイル関連ライブラリやバンドラ統合のスタイル機能もこの新しい機能を採用できるため、自分でスタイルシートを直接レンダーしない場合でも、ツールがこの機能を使用するようにアップグレードされるにつれ、やはりメリットを享受できるようになるでしょう。

詳細については、[`<link>`](/reference/react-dom/components/link) と [`<style>`](/reference/react-dom/components/style) のドキュメントを参照してください。

### 非同期スクリプトのサポート {/*support-for-async-scripts*/}

HTML では通常のスクリプト (`<script src="...">`) と遅延スクリプト (`<script defer="" src="...">`) はドキュメントの順序で読み込まれるため、コンポーネントツリーの深い部分でこれらのスクリプトをレンダーすることは困難です。しかし、非同期スクリプト (`<script async="" src="...">`) は任意の順序で読み込まれます。

React 19 では、非同期スクリプトのサポートを拡充し、ツリーのどこにあっても、スクリプトを実際に使用するコンポーネント内でそれをレンダーできるようにします。これにより、スクリプトインスタンスの移動や重複解消処理の管理が不要になります。

```js {4,15}
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // won't lead to duplicate script in the DOM
    </body>
  </html>
}
```

すべてのレンダー環境で非同期スクリプトの重複解消処理が行われます。複数の異なるコンポーネントが同じスクリプトをレンダーしている場合でも、React はそれを一度だけ読み込み、実行します。

サーバサイドレンダリングでは、非同期スクリプトは `<head>` に挿入され、描画をブロックするスタイルシート・フォント・画像プリロードなどのより重要なリソースよりも低優先度で処理されます。

詳細については、[`<script>`](/reference/react-dom/components/script) のドキュメントを参照してください。

### リソースのプリロードのサポート {/*support-for-preloading-resources*/}

ドキュメントの初期読み込み時やクライアントでの画面更新時に、今後必要になりそうなリソースについてブラウザに可能な限り早く知らせておくことは、ページのパフォーマンスに劇的な影響を与えることがあります。

React 19 には、リソースの読み込みやプリロードのための新しい API が多数含まれています。非効率的なリソース読み込みによって阻害されることのない素晴らしいユーザ体験を、できるだけ容易に構築できるようになっています。

```js
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }) // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // preloads this stylesheet
  prefetchDNS('https://...') // when you may not actually request anything from this host
  preconnect('https://...') // when you will request something but aren't sure what
}
```
```html
<!-- the above would result in the following DOM/HTML -->
<html>
  <head>
    <!-- links/scripts are prioritized by their utility to early loading, not call order -->
    <link rel="prefetch-dns" href="https://...">
    <link rel="preconnect" href="https://...">
    <link rel="preload" as="font" href="https://.../path/to/font.woff">
    <link rel="preload" as="style" href="https://.../path/to/stylesheet.css">
    <script async="" src="https://.../path/to/some/script.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

これらの API は、フォントなどのリソースをスタイルシート外に移動させて早期に発見できるようにすることで、ページの初期ロードを最適化するために利用できます。また、予想されるナビゲーションに応じて必要となるリソースのリストを先読みし、クリックあるいはホバー時に早期にプリロードを始めることで、クライアントでの更新を高速化することもできるでしょう。

詳細については、[リソースプリロード API](/reference/react-dom#resource-preloading-apis) を参照してください。

### サードパーティのスクリプトおよび拡張機能との互換性改善 {/*compatibility-with-third-party-scripts-and-extensions*/}

サードパーティのスクリプトやブラウザ拡張機能の存在を考慮し、ハイドレーションの改善を行いました。

ハイドレーション時に、クライアントでレンダーされた要素がサーバから届いた HTML に書かれた要素と一致しない場合、React は強制的にクライアントで再レンダーを行って内容を修正します。これまで、サードパーティのスクリプトやブラウザ拡張機能によって何らかの要素が挿入された場合、不一致エラーとクライアントレンダーを引き起こしていました。

React 19 では、`<head>` および `<body>` 内にある予期しないタグをスキップし、不一致エラーが回避されるようになります。それ以外のハイドレーションの不一致によりドキュメント全体を再レンダーする必要がある場合でも、サードパーティのスクリプトやブラウザ拡張機能によって挿入された既存のスタイルシートはそのままにします。

### エラー報告の改善 {/*error-handling*/}

React 19 ではエラー処理を改善して重複エラーを削減しており、またキャッチされたエラーとキャッチされなかったエラーのそれぞれに対する処理オプションを提供します。たとえば、レンダー中にエラーが発生しエラーバウンダリでキャッチされた場合、これまで React ではそのエラーを 2 回スロー（1 回は元のエラー、もう 1 回は自動回復に失敗した後）し、その後エラーが発生した場所について `console.error` に記録していました。

これにより、キャッチされるエラーごとに以下のような 3 つのエラーが発生していました。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

React 19 では、すべてのエラー情報を含む単一のエラーをログに記録します。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

さらに、`onRecoverableError` を補完するために 2 つの新しいルートオプションを追加しました。

- `onCaughtError`：エラーバウンダリで React がエラーをキャッチしたときに呼び出されます。
- `onUncaughtError`：エラーがスローされたがエラーバウンダリでキャッチされなかった場合に呼び出されます。
- `onRecoverableError`：エラーがスローされ、自動的に回復されたときに呼び出されます。

詳細と例については、[`createRoot`](/reference/react-dom/client/createRoot) および [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) のドキュメントを参照してください。

### カスタム要素のサポート {/*support-for-custom-elements*/}

React 19 はカスタム要素を完全にサポートし、[Custom Elements Everywhere](https://custom-elements-everywhere.com/) のすべてのテストに合格しました。

過去のバージョンの React では、認識されない props を要素のプロパティではなく属性として扱っていたため、カスタム要素を使用することが困難でした。React 19 では、以下の戦略に従って、クライアントと SSR の両方で機能するプロパティがサポートされるようになります。

- **サーバサイドレンダリング**：カスタム要素に渡される props は、その型が `string`、`number` のようなプリミティブである場合や値が `true` である場合、属性としてレンダーされる。`object`、`symbol`、`function` のような非プリミティブ値である場合や値が `false` である場合、その props は無視される。
- **クライアントサイドレンダリング**：カスタム要素のインスタンスのプロパティに一致する props はプロパティとして割り当てられ、それ以外の場合は属性として割り当てられる。

React におけるカスタム要素のサポートに関し、設計と実装を推進した [Joey Arhar](https://github.com/josepharhar) に感謝します。


#### アップグレード方法 {/*how-to-upgrade*/}
アップグレードに関するステップバイステップのガイドや、重要な変更点の完全なリストについては、[React 19 アップグレードガイド](/blog/2024/04/25/react-19-upgrade-guide)を参照してください。

_Note: this post was originally published 04/25/2024 and has been updated to 12/05/2024 with the stable release._
