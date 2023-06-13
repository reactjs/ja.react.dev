---
title: useId
---

<Intro>

`useId` は、アクセシビリティ属性に渡すことができる一意の ID を生成するための  React フックです。

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

[その他の例は下をご覧ください。](#usage)

#### パラメータ {/*parameters*/}

`useId` はパラメータを受け取りません。

#### 返す {/*returns*/}

`useId` は、特定のコンポーネント内で、この `useId` の呼び出しに関連付けられた一意の ID 文字列を返します。

#### 注意事項 {/*caveats*/}

* `useId` はフックであるため、**コンポーネントのトップレベル** または独自のフック内でのみ呼び出すことができます。ループまたは条件分岐内で呼び出すことはできません。もし必要な場合は、新しいコンポーネントを作成し、状態を移動させる必要があります。

* `useId` を、**リスト内のキーの生成には使用しないでください**。[キーはデータから生成される必要があります。](/learn/rendering-lists#where-to-get-your-key)

---

## 使用方法 {/*usage*/}

<Pitfall>

**リスト内のキーを生成するために `useId` を呼び出さないでください。**[キーはデータから生成される必要があります。](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### アクセシビリティ属性の一意の ID の生成 {/*generating-unique-ids-for-accessibility-attributes*/}

コンポーネントのトップレベルで `useId` を呼び出して、一意の ID を生成します。

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

その後、<CodeStep step={1}> 生成された ID </CodeStep>をさまざまな属性に渡すことができます。

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

[サーバーレンダリング](/reference/react-dom/server)では、**`useId` にはサーバーとクライアント上で同一のコンポーネントツリーが必要です**。サーバー上とクライアント上でレンダーされるツリーが正確に一致しない場合、生成される ID は一致しません。

</Pitfall>

<DeepDive>

#### useId が増分カウンタよりも良い理由 {/*why-is-useid-better-than-an-incrementing-counter*/}

なぜ `useId` が `nextId++` のようなグローバル変数を増分するよりもなぜ良いのか、疑問に思われるかもしれません。

`useId` の主な利点は、React が、[サーバーレンダリング](/reference/react-dom/server) で、確実に機能することを保証しているためです。サーバーのレンダー中に、コンポーネントは HTML の出力を生成します。その後クライアント上で、生成された HTML に、[ハイドレーション](/reference/react-dom/client/hydrateRoot) によって、イベント ハンドラがアタッチされます。ハイドレーションが機能するには、クライアントの出力がサーバーの HTML と一致する必要があります。

クライアントコンポーネントがハイドレートされる順序は、サーバー HTML が出力された順序と一致しない可能性があるため、これをインクリメントカウンタで保証することは非常に困難です。`useId` を呼び出すことで、ハイドレーションが機能し、サーバーとクライアントの間で出力が一致することが保証されます。

Inside React, `useId` is generated from the "parent path" of the calling component. This is why, if the client and the server tree are the same, the "parent path" will match up regardless of rendering order.

</DeepDive>

---

### Generating IDs for several related elements {/*generating-ids-for-several-related-elements*/}

If you need to give IDs to multiple related elements, you can call `useId` to generate a shared prefix for them: 

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

This lets you avoid calling `useId` for every single element that needs a unique ID.

---

### Specifying a shared prefix for all generated IDs {/*specifying-a-shared-prefix-for-all-generated-ids*/}

If you render multiple independent React applications on a single page, pass `identifierPrefix` as an option to your [`createRoot`](/reference/react-dom/client/createRoot#parameters) or [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) calls. This ensures that the IDs generated by the two different apps never clash because every identifier generated with `useId` will start with the distinct prefix you've specified.

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

