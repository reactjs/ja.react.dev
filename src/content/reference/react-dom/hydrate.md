---
title: hydrate
---

<Deprecated>

この API は、今後のメジャーバージョンの React で削除される予定です。

React 18 では、`hydrate` は [`hydrateRoot` に置き換えられました。](/reference/react-dom/client/hydrateRoot)React 18 で `hydrate` を使用すると、アプリは React 17 を実行しているかのような振る舞いになるとの警告が表示されます。詳細は[こちらをご覧ください。](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`hydrate` を使用すると、React 17 以前の [`react-dom/server`](/reference/react-dom/server) によって事前生成した HTML コンテンツが含まれるブラウザ DOM ノード内に、React コンポーネントを表示できます。

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

React 17 以前の環境で `hydrate` を呼び出して、サーバ環境で事前に React がレンダーした HTML に対して React を「アタッチ」します。

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React は、`domNode` 内に存在する HTML にアタッチし、その内部の DOM の管理を引き継ぎます。React で完全に構築されたアプリには、ルートコンポーネントを引数にした `hydrate` 呼び出しが通常 1 つのみ存在します。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: 既存の初期 HTML をレンダーするのに使用された "React ノード"。これは通常、`ReactDOM Server` のメソッド（例：React 17 の `renderToString(<App />)`）でレンダーされた JSX、例えば `<App />` になります。

* `domNode`: サーバ上でルート要素としてレンダーされた [DOM 要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。

* **省略可能** `callback`: 関数。渡された場合、React はコンポーネントのハイドレーション後にそれを呼び出します。

#### 返り値 {/*returns*/}

`hydrate` は null を返します。

#### 注意点 {/*caveats*/}
* `hydrate` は、レンダーされたコンテンツが、サーバでレンダーされたコンテンツと同一であることを期待しています。React はテキストコンテンツの差異を修正できますが、不一致はバグとして扱い修正する必要があります。
* 開発モードでは、React はハイドレーション中の不一致について警告します。不一致が発生した場合、属性の違いが修正される保証はありません。これはパフォーマンス上の理由から重要です。なぜならほとんどのアプリでは、不一致はまれであり、すべてのマークアップを検証することは非常に高コストになるからです。
* アプリには通常、`hydrate` 呼び出しは 1 つだけ存在します。フレームワークを使用している場合、フレームワークがこの呼び出しを行うかもしれません。
* アプリがクライアントでレンダーする形式であり、事前レンダーされた HTML がない場合、`hydrate()` は使用できません。代わりに、React 17 以前では [render()](/reference/react-dom/render)、React 18 以降では [createRoot()](/reference/react-dom/client/createRoot) を使用してください。

---

## 使用法 {/*usage*/}

`hydrate` を呼び出して、<CodeStep step={1}>React コンポーネント</CodeStep>をサーバでレンダーされた<CodeStep step={2}>ブラウザの DOM ノード</CodeStep>にアタッチします。

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
```

`hydrate()` を使用して、クライアントのみのアプリ（サーバでレンダーされた HTML がないアプリ）をレンダーすることはサポートされていません。代わりに、React 17 以前では [`render()`](/reference/react-dom/render)、React 18 以降では [`createRoot()`](/reference/react-dom/client/createRoot) を使用してください。

### サーバでレンダーされた HTML のハイドレーション {/*hydrating-server-rendered-html*/}

React では、"ハイドレーション (hydration)" とは、サーバ環境の React によって事前レンダーされている HTML に React が「アタッチ」することを指します。ハイドレーション中、React は既存のマークアップにイベントリスナをアタッチし、アプリのレンダー処理をクライアントに引き継ぎます。

React で完全に構築されたアプリでは、**通常、アプリ全体の起動時に 1 つの「ルート」のハイドレーションを一度だけ行います**。

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

通常、`hydrate` を再度呼び出したり、複数の場所で呼び出したりする必要はありません。ここから先は、React がアプリケーションの DOM を管理しています。UI を更新するには、コンポーネントは [state を使うことになるでしょう。](/reference/react/useState)

ハイドレーションに関する詳細は、[`hydrateRoot` のドキュメント](/reference/react-dom/client/hydrateRoot)を参照してください。

---

### やむを得ないハイドレーション不一致エラーの抑制 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

サーバとクライアントの間で、単一の要素の属性やテキストコンテンツがやむを得ない理由で異なる場合（たとえば、タイムスタンプなど）、ハイドレーションの不一致警告を抑制することができます。

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

これは単一レベルの深さまでしか機能せず、避難ハッチとしての使用を意図しています。過度に使用しないでください。これを使用してもテキストコンテンツ以外の場合は React は違いを修正しようとはしないため、将来の更新まで一貫性が保たれない可能性があります。

---

### クライアントとサーバで異なるコンテンツの処理 {/*handling-different-client-and-server-content*/}

サーバとクライアントで意図的に異なるものをレンダーする必要がある場合、2 回に分けたレンダーを行うことができます。クライアントで異なるものをレンダーするコンポーネントは、`isClient` のような [state 変数](/reference/react/useState)を読み取るようにし、この変数を[エフェクト](/reference/react/useEffect)内で `true` に設定することができます。

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

この方法では、初回のレンダーはサーバと同じコンテンツをレンダーし、不一致を回避しますが、追加のレンダーがハイドレーションの直後に同期的に行われます。

<Pitfall>

このアプローチではコンポーネントを 2 回レンダーする必要があるためハイドレーションが遅くなります。低速な接続におけるユーザ体験に注意してください。JavaScript コードは初期レンダーされた HTML よりもかなり遅く読み込まれる場合があるため、ハイドレーション直後に異なる UI をレンダーするとユーザに不快感を与えるかもしれません。

</Pitfall>
