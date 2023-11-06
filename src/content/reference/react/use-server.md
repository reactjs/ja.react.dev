---
title: "'use server'"
titleForTitleTag: "'use server' directive"
canary: true
---

<Canary>

`'use server'` は、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。

</Canary>


<Intro>

`'use server'` は、クライアントサイドのコードから呼び出し可能なサーバサイドの関数をマークします。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `'use server'` {/*use-server*/}

<<<<<<< HEAD
非同期 (async) 関数の冒頭に `'use server';` を追加することで、その関数がクライアントから実行できることをマークします。
=======
Add `'use server'` at the top of an async function body to mark the function as callable by the client. We call these functions _server actions_.
>>>>>>> a8790ca810c1cebd114db35a433b90eb223dbb04

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

<<<<<<< HEAD
このような関数は、クライアントに渡すことができます。この関数がクライアント側で呼び出されると、渡された引数がシリアライズされ、それを含んだネットワークリクエストをサーバに送信します。このサーバ関数が値を返す場合、シリアライズされてクライアントに返されます。

または、ファイルの最上部に `'use server';` を追加すると、そのファイル内のすべてのエクスポートが、クライアントコンポーネントファイルを含むあらゆる場所で使用できる非同期サーバ関数である、とマークします。

#### 注意点 {/*caveats*/}

* `'use server'` でマークされた関数に渡される引数はクライアントで完全に制御可能です。セキュリティのため、引数を常に信頼できない入力として扱い、適切にバリデーションやエスケープを行うことを忘れないでください。
* クライアント側とサーバ側のコードを同じファイルに混在させることによる混乱を避けるため、`'use server'` はサーバ側のファイルでのみ使用できます。結果として得られる関数は、props を通じてクライアントコンポーネントに渡すことができます。
* 内部で用いられるネットワーク呼び出しは常に非同期であるため、`'use server'` は非同期関数でのみ使用できます。
* `'use server'` のようなディレクティブは、関数やファイルの冒頭部分で、他のコード（インポートを含む）より上になければなりません（ただしコメントはディレクティブの上に記載できます）。シングルクォートまたはダブルクォートで書く必要があり、バックティックは使えません。（`'use xyz'` というディレクティブの形式は `useXyz()` というフックの命名規則に多少似ていますが、これは偶然です。）
=======
When calling a server action on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the server action returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as server actions that can be used anywhere, including imported in client code.

#### Caveats {/*caveats*/}
* `'use server'` must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
* `'use server'` can only be used in server-side files. The resulting server actions can be passed to Client Components through props. See supported [types for serialization](#serializable-parameters-and-return-values).
* To import a server action from [client code](/reference/react/use-client), the directive must be used on a module level.
* Because the underlying network calls are always asynchronous, `'use server'` can only be used on async functions.
* Always treat arguments to server actions as untrusted input and authorize any mutations. See [security considerations](#security).
* Server actions should be called in a [transition](/reference/react/useTransition). Server actions passed to [`<form action>`](/reference/react-dom/components/form#props) or [`formAction`](/reference/react-dom/components/input#props) will automatically be called in a transition.
* Server actions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing server actions typically process one action at a time and do not have a way to cache the return value.

### Security considerations {/*security*/}

Arguments to server actions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In any server action, make sure to validate that the logged-in user is allowed to perform that action.

<Wip>

To prevent sending sensitive data from a server action, there are experimental taint APIs to prevent unique values and objects from being passed to client code.

See [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) and [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Serializable arguments and return values {/*serializable-parameters-and-return-values*/}

As client code calls the server action over the network, any arguments passed will need to be serializable.

Here are supported types for server action arguments:

* Primitives
	* [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), only symbols registered in the global Symbol registry via [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for)
* Iterables containing serializable values
	* [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) and [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are server actions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React elements, or [JSX](https://react.dev/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a server action
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`


Supported serializable return values are the same as [serializable props](/reference/react/use-client#passing-props-from-server-to-client-components) for a boundary Client Component.

>>>>>>> a8790ca810c1cebd114db35a433b90eb223dbb04

## 使用法 {/*usage*/}

<<<<<<< HEAD
<Wip>
このセクションは未完成です。

この API は React Server Components を利用するフレームワークで使用できます。フレームワークごとの追加のドキュメントが公開されています。
* [Next.js ドキュメント](https://nextjs.org/docs/getting-started/react-essentials)
* 今後追加予定
</Wip>
=======
### Server actions in forms {/*server-actions-in-forms*/}

The most common use case of server actions will be calling server functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for server actions in [forms](/reference/react-dom/components/form).

Here is a form that allows a user to request a username.

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

In this example `requestUsername` is a server action passed to a `<form>`. When a user submits this form, there is a network request to the server function `requestUsername`. When calling a server action in a form, React will supply the form's <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> as the first argument to the server action.

By passing a server action to the form `action`, React can [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the form. This means that forms can be submitted before the JavaScript bundle is loaded.

#### Handling return values in forms {/*handling-return-values*/}

In the username request form, there might be the chance that a username is not available. `requestUsername` should tell us if it fails or not.

To update the UI based on the result of a server action while supporting progressive enhancement, use [`useFormState`](/reference/react-dom/hooks/useFormState).

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

Note that like most Hooks, `useFormState` can only be called in <CodeStep step={1}>[client code](/reference/react/use-client)</CodeStep>.

### Calling a server action outside of `<form>` {/*calling-a-server-action-outside-of-form*/}

Server actions are exposed server endpoints and can be called anywhere in client code.

When using a server action outside of a [form](/reference/react-dom/components/form), call the server action in a [transition](/reference/react/useTransition), which allows you to display a loading indicator, show [optimistic state updates](/reference/react/useOptimistic), and handle unexpected errors. Forms will automatically wrap server actions in transitions.

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

To read a server action return value, you'll need to `await` the promise returned.
>>>>>>> a8790ca810c1cebd114db35a433b90eb223dbb04
