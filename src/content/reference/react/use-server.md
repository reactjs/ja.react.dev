---
title: "'use server'"
titleForTitleTag: "'use server' ディレクティブ"
canary: true
---

<Canary>

`'use server'` は、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。

</Canary>


<Intro>

`'use server'` は、クライアントサイドのコードから呼び出せる、サーバサイドの関数をマークします。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `'use server'` {/*use-server*/}

<<<<<<< HEAD
非同期 (async) 関数の本体の冒頭に `'use server';` を追加することで、その関数がクライアントから実行可能であるとマークします。そのような関数のことを*サーバアクション (server action)* と呼びます。
=======
Add `'use server'` at the top of an async function body to mark the function as callable by the client. We call these functions _Server Actions_.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

<<<<<<< HEAD
クライアント上でサーバアクションを呼び出すと、渡された引数のシリアライズされたコピーを含んだネットワークリクエストがサーバに送信されます。サーバアクションが値を返す場合は、その値がシリアライズされてクライアントに返されます。

個々の関数に `'use server'` をマークする代わりに、このディレクティブをファイルの先頭に追加することもできます。その場合はそのファイル内のすべてのエクスポートが、クライアントコードでインポートされる場合も含み、あらゆる場所で使用できるサーバアクションとしてマークされます。

#### 注意点 {/*caveats*/}
* `'use server'` は、関数やモジュールの冒頭、つまりインポートも含む他のコードよりも上にある必要があります（ディレクティブの上にコメントを書くことは OK）。シングルクォートまたはダブルクォートで書かれていなければならず、バックティックは無効です。
* `'use server'` は、サーバサイドのファイルでのみ使用できます。結果として得られるサーバアクションは、props を通じてクライアントコンポーネントに渡せるようになります。サポートされている[シリアライズ可能な型](#serializable-parameters-and-return-values)を参照してください。
* [クライアントコード](/reference/react/use-client)からサーバアクションをインポートする場合は、ディレクティブをモジュールレベルで使用する必要があります。
* 内部で使用されるネットワーク呼び出しは常に非同期であるため、`'use server'` は非同期関数でのみ使用できます。
* サーバアクションへの引数は常に信頼できない入力として扱い、あらゆるデータ書き換えを検証してください。[セキュリティに関する考慮事項](#security)を参照してください。
* サーバアクションは[トランジション](/reference/react/useTransition)の中で呼び出すようにしてください。サーバアクションが [`<form action>`](/reference/react-dom/components/form#props) または [`formAction`](/reference/react-dom/components/input#props) に渡される場合、自動的にトランジション内で呼び出されます。
* サーバアクションは、サーバ側の状態を書き換える、更新目的のために設計されています。データの取得には推奨されません。したがって、サーバアクションを実装するフレームワークは通常、一度にひとつのアクションのみを処理し、返り値をキャッシュしないようにします。
=======
When calling a Server Action on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the Server Action returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as Server Actions that can be used anywhere, including imported in client code.

#### Caveats {/*caveats*/}
* `'use server'` must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
* `'use server'` can only be used in server-side files. The resulting Server Actions can be passed to Client Components through props. See supported [types for serialization](#serializable-parameters-and-return-values).
* To import a Server Action from [client code](/reference/react/use-client), the directive must be used on a module level.
* Because the underlying network calls are always asynchronous, `'use server'` can only be used on async functions.
* Always treat arguments to Server Actions as untrusted input and authorize any mutations. See [security considerations](#security).
* Server Actions should be called in a [transition](/reference/react/useTransition). Server Actions passed to [`<form action>`](/reference/react-dom/components/form#props) or [`formAction`](/reference/react-dom/components/input#props) will automatically be called in a transition.
* Server Actions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Actions typically process one action at a time and do not have a way to cache the return value.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

### セキュリティについての考慮事項 {/*security*/}

<<<<<<< HEAD
サーバアクションへの引数は、完全にクライアントで制御されるものです。セキュリティのため、入力は常に信頼できないものとして扱い、引数の検証やエスケープを適切に行ってください。

あらゆるサーバアクションにおいて、ログイン済みのユーザがそのアクションを実行できることを確認してください。

<Wip>

サーバアクションから機密データが送信されるのを防ぐために、ユニークな値やオブジェクトがクライアントコードに渡されるのを防ぐ実験的な汚染 API (taint API) があります。
=======
Arguments to Server Actions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In any Server Action, make sure to validate that the logged-in user is allowed to perform that action.

<Wip>

To prevent sending sensitive data from a Server Action, there are experimental taint APIs to prevent unique values and objects from being passed to client code.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

[experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) と [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference) を参照してください。

</Wip>

### シリアライズ可能な引数と返り値 {/*serializable-parameters-and-return-values*/}

<<<<<<< HEAD
クライアントコードのサーバアクション呼び出しはネットワーク経由で行われるため、関数に渡すあらゆる引数はシリアライズ可能である必要があります。

以下は、サーバアクションの引数としてサポートされる型です。
=======
As client code calls the Server Action over the network, any arguments passed will need to be serializable.

Here are supported types for Server Action arguments:
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

* プリミティブ
	* [文字列](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [数値](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [ブーリアン](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [シンボル](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)、ただし [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) を通じてグローバルシンボルレジストリに登録されたシンボルのみ
* シリアライズ可能な値を含んだ Iterable
	* [文字列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [配列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) と [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
<<<<<<< HEAD
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) のインスタンス
* プレーンな[オブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): [オブジェクト初期化子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)で作成され、シリアライズ可能なプロパテ
* [サーバアクション (server action)](/reference/react/use-server) としての関数
* [プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

以下のものはサポートされていません。
* React 要素すなわち [JSX](https://react.dev/learn/writing-markup-with-jsx)
* 関数。関数コンポーネントや、サーバアクションでない他のあらゆる関数を含む。
* [クラス](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 任意のクラスのインスタンス（上記の組み込みクラスを除く）や、[null プロトタイプのオブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* グローバルに登録されていないシンボル、例：`Symbol('my new symbol')`
=======
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are Server Actions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React elements, or [JSX](https://react.dev/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a Server Action
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc


サポートされるシリアライズ可能な返り値は、クライアントコンポーネントに渡せる[シリアライズ可能な props](/reference/react/use-client#passing-props-from-server-to-client-components) の型と同じです。


## 使用法 {/*usage*/}

<<<<<<< HEAD
### フォームでサーバアクションを使用する {/*server-actions-in-forms*/}

サーバアクションの最も一般的なユースケースは、データを更新するためにサーバ関数を呼び出すことです。ブラウザ上においては [HTML フォーム要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)が、ユーザが更新処理を送信する際の伝統的な方法です。React Server Components により、[フォーム](/reference/react-dom/components/form)に書かれたサーバアクションに対する第 1 級サポートが導入されます。
=======
### Server Actions in forms {/*server-actions-in-forms*/}

The most common use case of Server Actions will be calling server functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for Server Actions in [forms](/reference/react-dom/components/form).
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

以下は、ユーザがユーザ名をリクエストできるフォームです。

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default App() {
  <form action={requestUsername}>
    <input type="text" name="username" />
    <button type="submit">Request</button>
  </form>
}
```

<<<<<<< HEAD
この例では、`requestUsername` は `<form>` に渡されるサーバアクションとなります。ユーザがこのフォームを送信すると、サーバ関数 `requestUsername` へのネットワークリクエストが発生します。フォーム内でサーバアクションを呼び出すとき、React はフォームの <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> をサーバアクションの最初の引数として提供します。

フォームの `action` にサーバアクションを渡すことで、React によるフォームの[プログレッシブエンハンスメント (progressive enhancement)](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) が有効になります。つまり JavaScript バンドルがロードされる前にフォームを送信できるようになるということです。
=======
In this example `requestUsername` is a Server Action passed to a `<form>`. When a user submits this form, there is a network request to the server function `requestUsername`. When calling a Server Action in a form, React will supply the form's <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> as the first argument to the Server Action.

By passing a Server Action to the form `action`, React can [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the form. This means that forms can be submitted before the JavaScript bundle is loaded.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

#### フォームでの返り値の取り扱い {/*handling-return-values*/}

上記のユーザ名リクエストフォームでは、ユーザ名が利用できない可能性もあります。`requestUsername` は成功したか失敗したかを伝えられるべきです。

<<<<<<< HEAD
プログレッシブエンハンスメントをサポートしつつサーバアクションの結果に基づいて UI を更新するには、[`useFormState`](/reference/react-dom/hooks/useFormState) を使用します。
=======
To update the UI based on the result of a Server Action while supporting progressive enhancement, use [`useFormState`](/reference/react-dom/hooks/useFormState).
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'successful';
  }
  return 'failed';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import {useFormState} from 'react-dom';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [returnValue, action] = useFormState(requestUsername, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {returnValue}</p>
    </>
  );
}
```

ほとんどのフックと同様に、`useFormState` は<CodeStep step={1}>[クライアントコード](/reference/react/use-client)</CodeStep>内でしか呼び出せないことに注意してください。

<<<<<<< HEAD
### `<form>` の外部でサーバアクションを呼び出す {/*calling-a-server-action-outside-of-form*/}

サーバアクションはサーバ側の公開エンドポイントであり、クライアントコードのどこからでも呼び出すことができます。

[フォーム](/reference/react-dom/components/form)の外部でサーバアクションを使用する場合、[トランジション](/reference/react/useTransition)内でサーバアクションを呼び出すようにしてください。これによりローディングインジケータを表示したり、[楽観的に state 更新結果を表示](/reference/react/useOptimistic)したり、予期せぬエラーを処理したりすることができるようになります。フォームではサーバアクションは自動的にトランジション内にラップされます。
=======
### Calling a Server Action outside of `<form>` {/*calling-a-server-action-outside-of-form*/}

Server Actions are exposed server endpoints and can be called anywhere in client code.

When using a Server Action outside of a [form](/reference/react-dom/components/form), call the Server Action in a [transition](/reference/react/useTransition), which allows you to display a loading indicator, show [optimistic state updates](/reference/react/useOptimistic), and handle unexpected errors. Forms will automatically wrap Server Actions in transitions.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Like</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async incrementLike() {
  likeCount++;
  return likeCount;
}
```

<<<<<<< HEAD
サーバアクションからの返り値を読み取るには、返されたプロミスを `await` する必要があります。
=======
To read a Server Action return value, you'll need to `await` the promise returned.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc
