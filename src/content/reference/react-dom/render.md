---
title: レンダー
---

<Deprecated>

この API は、今後のメジャーバージョンの React で削除される予定です。

React 18 では、`render` は [`createRoot`](/reference/react-dom/client/createRoot) に置き換えられました。React 18 で `render` を使用すると、アプリは React 17 を実行しているかのような振る舞いになるとの警告が表示されます。詳細は[こちらをご覧ください。](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`render` は、ブラウザの DOM ノードに [JSX](/learn/writing-markup-with-jsx)（"React ノード"）をレンダーします。

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

`render` を呼び出して、ブラウザの DOM 要素に React コンポーネントを表示します。

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React は `domNode` 内に `<App />` を表示し、その内部の DOM の管理を行います。

React で完全に構築されたアプリには、ルートコンポーネントを引数にした `render` 呼び出しが通常 1 つのみ存在します。ページ内に React を「散りばめて」使用するページの場合は、必要なだけ `render` を呼び出すことができます。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: 表示したい *React ノード*。通常は `<App />` のような JSX ですが、[`createElement()`](/reference/react/createElement) で構築した React 要素や、文字列、数値、`null`、または `undefined` を渡すこともできます。

* `domNode`: [DOM 要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。React は、渡された `reactNode` をこの DOM 要素内に表示します。この瞬間から、React は `domNode` 内の DOM を管理し、React ツリーが変更されたときにそれを更新するようになります。

* **省略可能** `callback`: 関数。渡された場合、React はコンポーネントが DOM に配置された後にそれを呼び出します。


#### 返り値 {/*returns*/}

`render` は通常 `null` を返します。ただし、渡す `reactNode` が*クラスコンポーネント*の場合、そのコンポーネントのインスタンスを返します。

#### 注意点 {/*caveats*/}

* React 18 では、`render` は [`createRoot`](/reference/react-dom/client/createRoot) に置き換えられました。React 18 以降では `createRoot` を使用してください。

* `render` を初めて呼び出したとき、React は React ルート内の既存の HTML コンテンツをすべてクリアしてから、React コンポーネントをレンダーします。`domNode` がサーバ上であるいはビルド中に React によって生成された HTML を含んでいる場合は、代わりに既存の HTML にイベントハンドラをアタッチできる [`hydrate()`](/reference/react-dom/hydrate) を使用してください。

* 同じ `domNode` に対して `render` を複数回呼び出すと、React は最新の JSX を反映するために必要なだけの DOM の更新を行います。React は、渡された JSX を以前にレンダーしたツリーと[「マッチング」](/learn/preserving-and-resetting-state)して、DOM のどの部分が再利用でき、どの部分を再作成する必要があるのかを決定します。同じ `domNode` に対して複数回 `render` を呼び出すことは、ルートコンポーネントで [`set` 関数](/reference/react/useState#setstate)を呼び出すことに似ており、React は不必要な DOM 更新を回避します。

* アプリが完全に React で構築されている場合、アプリ内で `render` を呼び出すのは通常 1 回だけです。（フレームワークを使用している場合、この呼び出しはフレームワークが行うかもしれません。）DOM ツリー内の、コンポーネントの子ではない別の部分に JSX をレンダーしたい場合（例えばモーダルやツールチップ）、`createRoot` の代わりに [`createPortal`](/reference/react-dom/createPortal) を使用してください。

---

## 使用法 {/*usage*/}

`render` を呼び出して、<CodeStep step={1}>React コンポーネント</CodeStep>を<CodeStep step={2}>ブラウザの DOM ノード</CodeStep>内に表示します。

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### ルートコンポーネントのレンダー {/*rendering-the-root-component*/}

React で完全に構築されたアプリでは通常、"ルート" コンポーネントをレンダーするためにスタートアップ時に**これを一度だけ行います**。

<Sandpack>

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

通常、`render` を再度呼び出したり複数の場所で呼び出したりする必要はありません。この時点から、React はアプリケーションの DOM を管理します。UI を更新するには、コンポーネントが [state を使用します](/reference/react/useState)。

---

### 複数のルートのレンダー {/*rendering-multiple-roots*/}

あなたのページが[完全には React で構築されていない](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)場合、React が管理する UI の各トップレベルに対して `render` を呼び出します。

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>This paragraph is not rendered by React (open index.html to verify).</p>
  <section id="comments"></section>
</main>
```

```js index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

レンダーされたツリーは [`unmountComponentAtNode()`](/reference/react-dom/unmountComponentAtNode) で破棄することができます。

---

### レンダーされたツリーの更新 {/*updating-the-rendered-tree*/}

同じ DOM ノードに対して `render` を複数回呼び出すことができます。コンポーネントツリーの構造が以前にレンダーされたものと一致していれば、React は [state を保持します](/learn/preserving-and-resetting-state)。以下の例で入力フィールドにタイプできることに着目してください。つまり毎秒 `render` が繰り返し呼び出されていますが、更新により DOM が破壊されていないということです。

<Sandpack>

```js index.js active
import { render } from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

`render` を複数回呼び出すことは滅多にありません。通常、代わりにコンポーネントで [state の更新](/reference/react/useState)を行います。
