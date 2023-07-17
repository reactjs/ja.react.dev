---
title: useId
---

<Intro>

`useId` は、アクセシビリティ属性に渡すことができる一意の ID を生成するための React フックです。

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useId()` {/*useid*/}

コンポーネントのトップレベルで `useId` を呼び出して、一意の ID を生成します。

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

`useId` はパラメータを受け取りません。

#### 返り値 {/*returns*/}

`useId` は、特定のコンポーネント内でこの特定の `useId` の呼び出しに関連付けられた、一意の ID 文字列を返します。

#### 注意事項 {/*caveats*/}

* `useId` はフックであるため、**コンポーネントのトップレベル**または独自のフック内でのみ呼び出すことができます。ループまたは条件分岐内で呼び出すことはできません。もし必要な場合は、新しいコンポーネントを作成し、状態を移動させる必要があります。

* `useId` を、**リスト内の key の生成には使用しないでください**。[key はデータから生成される必要があります。](/learn/rendering-lists#where-to-get-your-key)

---

## 使用方 {/*usage*/}

<Pitfall>

**リスト内の key を生成するために `useId` を呼び出さないでください。**[key はデータから生成される必要があります。](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### アクセシビリティ属性のための一意の ID の生成 {/*generating-unique-ids-for-accessibility-attributes*/}

コンポーネントのトップレベルで `useId` を呼び出して、一意の ID を生成します。

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

その後、<CodeStep step={1}>生成された ID</CodeStep> をさまざまな属性に渡すことができます。

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**これがどのような場合に役立つかを、例を通してみてみましょう。** 

[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) のような [HTML アクセシビリティ属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)を使用すると、2 つのタグが相互に関連していることを指定することができます。例えば、入力フィールドのような要素が、段落などの別の要素で説明されていることを指定することができます。

通常の HTML では、次のように記述します。

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

ただし、このように ID をハードコードすることは、React ではおすすめできません。コンポーネントはページ上で複数回レンダー可能ですが、ID は一意である必要があります！ ID をハードコードするのではなく、`useId` を使用して一意の ID を生成します。

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

これで、画面上に `PasswordField` が複数回表示される場合でも、生成される ID が同じになることはありません。

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[このビデオを見て](https://www.youtube.com/watch?v=0dNzNcuEuOo)支援技術による、ユーザ体験の違いを確認してみてください。

<Pitfall>

[サーバレンダリング](/reference/react-dom/server)では、**`useId` にはサーバとクライアント上で同一のコンポーネントツリーが必要です**。サーバ上とクライアント上でレンダーされるツリーが正確に一致しない場合、生成される ID は一致しません。

</Pitfall>

<DeepDive>

#### useId が増分カウンタよりも良い理由 {/*why-is-useid-better-than-an-incrementing-counter*/}

`useId` が `nextId++` のようなグローバル変数を増分するよりもなぜ良いのか、疑問に思われるかもしれません。

`useId` の主な利点は、React が、[サーバレンダリング](/reference/react-dom/server)で確実に機能することを保証していることです。サーバでのレンダー中に、コンポーネントは HTML 形式の出力を生成します。その後クライアント上で、生成された HTML に、[ハイドレーション](/reference/react-dom/client/hydrateRoot)によって、イベントハンドラがアタッチされます。ハイドレーションが機能するには、クライアントの出力がサーバの HTML と一致する必要があります。

クライアントコンポーネントがハイドレートされる順序は、サーバ HTML が出力された順序と一致しない可能性があるため、これをインクリメントカウンタで保証することは非常に困難です。`useId` を呼び出すことで、ハイドレーションが機能し、サーバとクライアントの間で出力が一致することが保証されます。

React 内部では、呼び出し元コンポーネントの "親のパス (parent path)" から `useId` が生成されます。そのため、クライアントとサーバのツリーが同じであれば、レンダー順序に関係なく "親のパス" が一致することになります。

</DeepDive>

---

### 複数の関連要素に対して ID を生成する {/*generating-ids-for-several-related-elements*/}

複数の関連要素に ID を与える必要がある場合は、`useId` で生成した値を共有のプレフィックスとして使用できます。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

これにより、一意の ID を必要とするすべての要素に対して `useId` を呼び出す必要がなくなります。

---

### 生成されるすべての ID に共有プレフィックスを指定する {/*specifying-a-shared-prefix-for-all-generated-ids*/}

複数の独立した React アプリケーションを 1 つのページにレンダーする場合は、オプションとして `identifierPrefix` を [`createRoot`](/reference/react-dom/client/createRoot#parameters) または [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) に渡します。これにより、`useId` で生成されたすべての識別子が指定した個別のプレフィックスで始まるため、2 つの異なるアプリによって生成された ID が衝突することがなくなります。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

