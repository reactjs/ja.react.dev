---
title: hydrate
---

<Deprecated>

この API は、将来のメジャーバージョンの React で削除される予定です。

React 18 では、`hydrate` は [`hydrateRoot` に置き換えられました。](/reference/react-dom/client/hydrateRoot)React 18 で `hydrate` を使用すると、アプリが React 17 で実行されているかのように動作することを警告します。詳細は[こちらをご覧ください。](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`hydrate` を使用すると、React 17 以前で [`react-dom/server`](/reference/react-dom/server) によって以前に生成されたブラウザの DOM ノードの HTML コンテンツ内に React コンポーネントを表示できます。

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## 参照 {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

React 17 以前では、`hydrate` を呼び出して、サーバー環境で既に React によってレンダリングされた既存の HTML に React を「アタッチ」します。

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React は、`domNode` 内に存在する HTML にアタッチし、その内部の DOM を管理します。React で完全に構築されたアプリは通常、ルートコンポーネントを持つ 1 つの `hydrate` 呼び出しのみを持ちます。

[以下にさらなる例を参照してください。](#usage)

#### パラメータ {/*parameters*/}

* `reactNode`: 既存の HTML をレンダーするために使用される「React ノード」。これは通常、React 17 で `ReactDOM Server` のメソッド（例：`renderToString(<App />)`）でレンダリングされた JSX の一部である`<App />`のようなものです。

* `domNode`: サーバー上でルート要素としてレンダリングされた [DOM 要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。

* **オプション**: `callback`: 関数。渡された場合、React はコンポーネントのハイドレーション後にそれを呼び出します。

#### 戻り値 {/*returns*/}

`hydrate` は null を返します。

#### 注意事項 {/*caveats*/}
* `hydrate` は、レンダリングされたコンテンツがサーバーでレンダリングされたコンテンツと同一であることを期待しています。React はテキストコンテンツの違いを修正できますが、不一致はバグとして扱い修正する必要があります。
* 開発モードでは、React はハイドレーション中の不一致について警告します。不一致の場合、属性の違いが修正される保証はありません。これはパフォーマンス上の理由から重要です。ほとんどのアプリでは、不一致はまれであり、すべてのマークアップを検証することは非常に高コストになります。
* アプリには通常、1 つの `hydrate` 呼び出しだけが存在するでしょう。フレームワークを使用している場合、フレームワークがこの呼び出しを行うかもしれません。
* HTML が既にレンダリングされていないクライアントレンダリングの場合、`hydrate()` はサポートされていません。代わりに、React 17 以前では [render()](/reference/react-dom/render)、React 18 以降では [createRoot()](/reference/react-dom/client/createRoot) を使用してください。

---

## 使用方法 {/*usage*/}

`hydrate` を呼び出して、<CodeStep step={1}>React コンポーネント</CodeStep>をサーバーレンダリングされた <CodeStep step={2}>ブラウザの DOM ノード</CodeStep>にアタッチします。

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

`hydrate()` を使用して、クライアントのみのアプリ（サーバーレンダリングされた HTML がないアプリ）をレンダーすることはサポートされていません。代わりに、React 17 以前では [`render()`](/reference/react-dom/render)、React 18+ では [`createRoot()`](/reference/react-dom/client/createRoot) を使用してください。

### サーバーレンダリングされた HTML のハイドレーション {/*hydrating-server-rendered-html*/}

React では、「ハイドレーション」とは、サーバー環境で既に React によってレンダリングされた既存の HTML に React が「アタッチ」する方法です。ハイドレーション中、React は既存のマークアップにイベントリスナをアタッチし、クライアントでアプリをレンダーします。

React で完全に構築されたアプリでは、**通常、アプリ全体の起動時に 1 つの「ルート」をハイドレートするだけです**。

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1></div>
```

```js index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>

通常、`hydrate` を再度呼び出す必要はなく、複数の場所で呼び出す必要もありません。この時点から、React がアプリケーションの DOM を管理します。UI を更新するには、コンポーネントが [ステートを使用します。](/reference/react/useState)

ハイドレーションに関する詳細は、[`hydrateRoot` のドキュメント](/reference/react-dom/client/hydrateRoot)を参照してください。

---

### 避けられないハイドレーションの不一致エラーの抑制 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

サーバーとクライアントの間で、単一の要素の属性やテキストコンテンツが避けられない理由で異なる場合（たとえば、タイムスタンプなど）、ハイドレーションの不一致警告を抑制することができます。

要素のハイドレーション警告を抑制するには、`suppressHydrationWarning={true}` を追加します。

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: 01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

これは 1 レベルの深さまでしか機能せず、エスケープハッチとしての使用を意図しています。過度に使用しないでください。テキストコンテンツ以外の場合、React はそれを修正しようとはせず、将来のアップデートまで一貫性が保たれない可能性があります。

---

### クライアントとサーバのコンテンツの処理 {/*handling-different-client-and-server-content*/}

サーバとクライアントで意図的に異なるものをレンダーする必要がある場合、2 回のレンダリングを行うことができます。クライアントで異なるものをレンダーするコンポーネントは、[state 変数](/reference/react/useState)である `isClient` を読み取ることができます。この変数は、[effect](/reference/react/useEffect) 内で `true` に設定することができます。

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

この方法では、初回のレンダリングはサーバと同じコンテンツをレンダーし、不一致を回避しますが、追加のパスが同期的にハイドレーションの直後に行われます。

<Pitfall>

このアプローチはハイドレーションを遅くするため、コンポーネントは 2 回レンダーする必要があります。低速な接続の場合、ユーザエクスペリエンスに注意してください。JavaScript コードは初回の HTML レンダリングよりもかなり遅く読み込まれる場合があるため、ユーザにとってハイドレーション直後に異なる UI をレンダーすることは違和感を感じるかもしれません。

</Pitfall>
