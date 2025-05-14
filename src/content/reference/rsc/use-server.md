---
title: "'use server'"
titleForTitleTag: "'use server' ディレクティブ"
---

<RSC>

<<<<<<< HEAD
`'use server'` は [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 用の機能です。
=======
`'use server'` is for use with [using React Server Components](/reference/rsc/server-components).
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

</RSC>


<Intro>

`'use server'` は、クライアントサイドのコードから呼び出せる、サーバサイドの関数をマークします。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `'use server'` {/*use-server*/}

非同期 (async) 関数の本体の冒頭に `'use server';` を追加することで、その関数がクライアントから実行可能であるとマークします。そのような関数のことを[サーバ関数 (Server Function)](/reference/rsc/server-functions) と呼びます。

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

クライアント上でサーバ関数を呼び出すと、渡された引数のシリアライズされたコピーを含んだネットワークリクエストがサーバに送信されます。サーバ関数が値を返す場合は、その値がシリアライズされてクライアントに返されます。

個々の関数に `'use server'` をマークする代わりに、このディレクティブをファイルの先頭に追加することもできます。その場合はそのファイル内のすべてのエクスポートが、クライアントコードでインポートされる場合も含み、あらゆる場所で使用できるサーバアクションとしてマークされます。

#### 注意点 {/*caveats*/}
* `'use server'` は、関数やモジュールの冒頭、つまりインポートも含む他のコードよりも上にある必要があります（ディレクティブの上にコメントを書くことは OK）。シングルクォートまたはダブルクォートで書かれていなければならず、バックティックは無効です。
* `'use server'` は、サーバサイドのファイルでのみ使用できます。結果として得られるサーバ関数は、props を通じてクライアントコンポーネントに渡せるようになります。サポートされている[シリアライズ可能な型](#serializable-parameters-and-return-values)を参照してください。
* [クライアントコード](/reference/rsc/use-client)からサーバ関数をインポートする場合は、ディレクティブをモジュールレベルで使用する必要があります。
* 内部で使用されるネットワーク呼び出しは常に非同期であるため、`'use server'` は非同期関数でのみ使用できます。
* サーバ関数への引数は常に信頼できない入力として扱い、あらゆるデータ書き換えを検証してください。[セキュリティに関する考慮事項](#security)を参照してください。
* サーバ関数は[トランジション](/reference/react/useTransition)の中で呼び出すようにしてください。サーバ関数が [`<form action>`](/reference/react-dom/components/form#props) または [`formAction`](/reference/react-dom/components/input#props) に渡される場合、自動的にトランジション内で呼び出されます。
* サーバ関数は、サーバ側の状態を書き換える、更新目的のために設計されています。データの取得には推奨されません。したがって、サーバ関数を実装するフレームワークは通常、一度にひとつのアクションのみを処理し、返り値をキャッシュしないようにします。

### セキュリティについての考慮事項 {/*security*/}

サーバ関数への引数は、完全にクライアントで制御されるものです。セキュリティのため、入力は常に信頼できないものとして扱い、引数の検証やエスケープを適切に行ってください。

あらゆるサーバ関数において、ログイン済みのユーザにその処理の実行が許可されているのかを確認するようにしてください。

<Wip>

サーバ関数から機密データが送信されるのを防ぐために、ユニークな値やオブジェクトがクライアントコードに渡されるのを防ぐ実験的な汚染 API (taint API) があります。

[experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) と [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference) を参照してください。

</Wip>

### シリアライズ可能な引数と返り値 {/*serializable-parameters-and-return-values*/}

クライアントコードのサーバ関数呼び出しはネットワーク経由で行われるため、関数に渡すあらゆる引数はシリアライズ可能である必要があります。

以下は、サーバ関数の引数としてサポートされる型です。

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
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) のインスタンス
* プレーンな[オブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): [オブジェクト初期化子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)で作成され、シリアライズ可能なプロパティを持つもの
* それ自体がサーバ関数である関数
* [プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

以下のものはサポートされていません。
* React 要素すなわち [JSX](/learn/writing-markup-with-jsx)
* 関数。関数コンポーネントや、それ自体がサーバ関数でない他のあらゆる関数を含む。
* [クラス](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 任意のクラスのインスタンス（上記の組み込みクラスを除く）や、[null プロトタイプのオブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* グローバルに登録されていないシンボル、例：`Symbol('my new symbol')`
* イベントハンドラが受け取るイベント


サポートされるシリアライズ可能な返り値は、クライアントコンポーネントに渡せる[シリアライズ可能な props](/reference/rsc/use-client#passing-props-from-server-to-client-components) の型と同じです。


## 使用法 {/*usage*/}

### フォームでサーバ関数を使用する {/*server-functions-in-forms*/}

サーバ関数の最も一般的なユースケースは、データを更新するための関数呼び出しです。ブラウザ上においては [HTML フォーム要素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)が、ユーザが更新処理を送信する際の伝統的な方法です。React Server Components により、[フォーム](/reference/react-dom/components/form)に書かれたサーバ関数に対する第 1 級サポートが導入されます。

以下は、ユーザがユーザ名をリクエストできるフォームです。

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```

この例では、`requestUsername` は `<form>` に渡されるサーバ関数となります。ユーザがこのフォームを送信すると、サーバ関数 `requestUsername` へのネットワークリクエストが発生します。フォーム内でサーバ関数を呼び出すとき、React はフォームの <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> をサーバ関数の最初の引数として提供します。

フォームの `action` にサーバ関数を渡すことで、React によるフォームの[プログレッシブエンハンスメント (progressive enhancement)](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) が有効になります。つまり JavaScript バンドルがロードされる前にフォームを送信できるようになるということです。

#### フォームでの返り値の取り扱い {/*handling-return-values*/}

上記のユーザ名リクエストフォームでは、ユーザ名が利用できない可能性もあります。`requestUsername` は成功したか失敗したかを伝えられるべきです。

プログレッシブエンハンスメントをサポートしつつサーバ関数の結果に基づいて UI を更新するには、[`useActionState`](/reference/react/useActionState) を使用します。

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

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">Request</button>
      </form>
      <p>Last submission request returned: {state}</p>
    </>
  );
}
```

ほとんどのフックと同様に、`useActionState` は<CodeStep step={1}>[クライアントコード](/reference/rsc/use-client)</CodeStep>内でしか呼び出せないことに注意してください。

### `<form>` の外部でサーバ関数を呼び出す {/*calling-a-server-function-outside-of-form*/}

サーバ関数とはサーバ側の公開エンドポイントとなるため、クライアントコードのどこからでも呼び出すことができます。

[フォーム](/reference/react-dom/components/form)の外部でサーバ関数を使用する場合、[トランジション](/reference/react/useTransition)内でサーバ関数を呼び出すようにしてください。これによりローディングインジケータを表示したり、[楽観的に state 更新結果を表示](/reference/react/useOptimistic)したり、予期せぬエラーを処理したりすることができるようになります。フォームではサーバ関数は自動的にトランジション内にラップされます。

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
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

サーバ関数からの返り値を読み取るには、返されたプロミスを `await` する必要があります。