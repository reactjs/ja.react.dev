---
id: react-dom-client
title: ReactDOMClient
layout: docs
category: Reference
permalink: docs/react-dom-client.html
---

`react-dom/client` パッケージはクライアント側でアプリを初期化する際に使うクライアント専用メソッドを提供しています。ほとんどのコンポーネントではこのモジュールを使う必要はありません。

```js
import * as ReactDOM from 'react-dom/client';
```

npm で ES5 を使っている場合、以下のように書けます：

```js
var ReactDOM = require('react-dom/client');
```

## 概要 {#overview}

クライアント環境では以下のメソッドが利用可能です：

- [`createRoot()`](#createroot)
- [`hydrateRoot()`](#hydrateroot)

### ブラウザサポート {#browser-support}

React はすべてのモダンブラウザをサポートしていますが、古いバージョンを使う場合は[いくつかのポリフィルが必要](/docs/javascript-environment-requirements.html)です。

> 補足
>
> React は ES5 メソッドやマイクロタスクをサポートしていない Internet Explorer のような古いブラウザをサポートしていません。ページ内に [es5-shim や es5-sham](https://github.com/es-shims/es5-shim) のようなポリフィルが含まれている場合、古いブラウザでもアプリケーションが動作することがありますが、この手段を選択するかどうかは自己責任で判断してください。

## リファレンス {#reference}

### `createRoot()` {#createroot}

```javascript
createRoot(container[, options]);
```

渡された `container` に対する React ルートを作成してそれを返します。root の `render` を使って DOM 内部に React 要素をレンダーできます：

```javascript
const root = createRoot(container);
root.render(element);
```

`createRoot` は 2 つのオプションを受け取ります：
- `onRecoverableError`: React が自動的にエラーから復帰した際に呼ばれるオプションのコールバック。
- `identifierPrefix`: `React.useId` によって ID が生成される際に React が使うオプションのプリフィクス。同じページに複数のルートがある場合に競合を避けるために有用です。サーバ側で使うプリフィクスと同一である必要があります。

ルートは `unmount` でアンマウントすることができます：

```javascript
root.unmount();
```

> 補足：
>
> `createRoot()` は渡されたコンテナノードの中身を管理します。コンテナ内部にある既存のあらゆる DOM 要素は render がコールされた時点で置き換えられます。後続のコールでは React の DOM 差分アルゴリズムを使って効率的な更新を行います。
>
> `createRoot()` はコンテナノードを変更しません（コンテナの子要素のみ変更します）。既存の子要素を上書きせずにコンポーネントを既存の DOM ノードに挿入することが可能な場合があります。
>
> `createRoot()` を使ってサーバでレンダーされたコンテナにハイドレーションを行うことはできません。代わりに [`hydrateRoot()`](#hydrateroot) を使ってください。

* * *

### `hydrateRoot()` {#hydrateroot}

```javascript
hydrateRoot(container, element[, options])
```

[`createRoot()`](#createroot)と同様ですが、[`ReactDOMServer`](/docs/react-dom-server.html) により HTML コンテンツが描画されたコンテナをクライアントで再利用する（ハイドレーション）ために使用されます。React は既存のマークアップにイベントリスナをアタッチしようとします。

`hydrateRoot` は 2 つのオプションを受け取ります：
- `onRecoverableError`: React が自動的にエラーから復帰した際に呼ばれるオプションのコールバック。
- `identifierPrefix`: `React.useId` によって ID が生成される際に React が使うオプションのプリフィクス。同じページに複数のルートがある場合に競合を避けるために有用です。サーバ側で使うプリフィクスと同一である必要があります。


> 補足
> 
> React はレンダーされる内容が、サーバ・クライアント間で同一であることを期待します。React はテキストコンテンツの差異を修復することは可能ですが、その不一致はバグとして扱い、修正すべきです。開発用モードでは、React はハイドレーション時に起きる両者のレンダーの不一致について警告します。不一致がある場合に属性の差異が修復されるという保証はありません。これはパフォーマンス上の理由から重要です。なぜなら、ほとんどのアプリケーションにおいて不一致が発生するということは稀であり、全てのマークアップを検証することは許容不可能なほど高コストになるためです。