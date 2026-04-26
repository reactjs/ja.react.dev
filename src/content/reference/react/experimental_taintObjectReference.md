---
title: experimental_taintObjectReference
version: experimental
---

<Experimental>

**この API は実験的なものであり、まだ安定版の React では利用できません。**

React パッケージを最新の実験バージョンにアップグレードすることで試すことができます。

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React の実験バージョンにはバグが含まれている可能性があります。本番環境では使用しないでください。

この API は React Server Components 内でのみ利用できます。

</Experimental>


<Intro>

`taintObjectReference` を使うと、`user` オブジェクトのような特定のオブジェクトインスタンスがクライアントコンポーネントに渡されるのを防げます。

```js
experimental_taintObjectReference(message, object);
```

キー、ハッシュ、トークンなどが渡されるのを防ぎたい場合は、[`taintUniqueValue`](/reference/react/experimental_taintUniqueValue) を参照してください。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

`taintObjectReference` をオブジェクトと共に呼び出すことで、そのオブジェクトをクライアントにそのまま渡してはならないものとして React に登録します。

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Do not pass ALL environment variables to the client.',
  process.env
);
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `message`: オブジェクトが Client Component に渡されてしまった場合に表示したいメッセージです。このメッセージは、そのオブジェクトが Client Component に渡されたときにスローされるエラーの一部として表示されます。

* `object`: taint するオブジェクトです。関数やクラスインスタンスを `taintObjectReference` に `object` として渡すことができます。関数やクラスは Client Component に渡されることがすでにブロックされていますが、React のデフォルトのエラーメッセージは `message` で定義したものに置き換えられます。Typed Array の特定のインスタンスを `taintObjectReference` に `object` として渡した場合、その Typed Array の他のコピーは taint されません。

#### 返り値 {/*returns*/}

`experimental_taintObjectReference` は `undefined` を返します。

#### 注意点 {/*caveats*/}

- taint されたオブジェクトを再作成またはクローンすると、機密データを含む可能性がある新しい taint されていないオブジェクトが作成されます。例えば、taint された `user` オブジェクトがある場合、`const userInfo = {name: user.name, ssn: user.ssn}` や `{...user}` は taint されていない新しいオブジェクトを作成します。`taintObjectReference` が保護するのは、オブジェクトが変更されずに Client Component へそのまま渡されてしまうような単純なミスだけです。

<Pitfall>

**セキュリティを taint だけに頼らないでください**。オブジェクトを taint しても、派生しうるあらゆる値の漏えいを防げるわけではありません。例えば、taint されたオブジェクトをクローンすると、taint されていない新しいオブジェクトが作成されます。taint されたオブジェクトのデータを使うと（例えば `{secret: taintedObj.secret}`）、taint されていない新しい値やオブジェクトが作成されます。taint は保護層の 1 つです。セキュアなアプリには、複数の保護層、適切に設計された API、分離パターンが必要です。

</Pitfall>

---

## 使用法 {/*usage*/}

### ユーザデータが意図せずクライアントに到達するのを防ぐ {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Client Component は、機密データを持つオブジェクトを決して受け取るべきではありません。理想的には、データ取得関数は現在のユーザに見せるべきではないデータを公開しないようにするべきです。しかしリファクタリング中にミスが起きることもあります。後続の処理でそのようなミスが起きた場合に備えて、データ API 内で user オブジェクトを "taint" できます。

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

これにより、誰かがこのオブジェクトを Client Component に渡そうとすると、指定したエラーメッセージを含むエラーがスローされます。

<DeepDive>

#### データ取得での漏えいを防ぐ {/*protecting-against-leaks-in-data-fetching*/}

機密データにアクセスできる Server Components 環境を実行している場合、オブジェクトをそのまま渡さないように注意する必要があります。

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // DO NOT DO THIS
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

理想的には、`getUser` は現在のユーザに見せるべきではないデータを公開しないようにするべきです。後続の処理で `user` オブジェクトが Client Component に渡されるのを防ぐために、user オブジェクトを "taint" できます。


```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Do not pass the entire user object to the client. ' +
      'Instead, pick off the specific properties you need for this use case.',
    user,
  );
  return user;
}
```

これにより、誰かが `user` オブジェクトを Client Component に渡そうとすると、指定したエラーメッセージを含むエラーがスローされます。

</DeepDive>
