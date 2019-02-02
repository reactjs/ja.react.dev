---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

`<script>` タグから React をロードすると、以下のトップレベル API をグローバル変数 `ReactDOM` で使用することができます。 npm と ES6 を使用している場合は、`import ReactDOM from 'react-dom'` と記述できます。 npm と ES5 を使用している場合は、`var ReactDOM = require('react-dom')` と記述できます。

## 概要

`react-dom` パッケージには、アプリケーションのトップレベルで、また必要に応じて React モデルから抜け出すための避難ハッチとして使用できる DOM 固有のメソッドが用意されています。ほとんどのコンポーネントでは、このモジュールを使用する必要はないはずです。

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### ブラウザサポート

React は Internet Explorer 9 以降を含む全ての一般的なブラウザをサポートしていますが、 IE 9 や IE 10 といった古いブラウザでは[一部のポリフィルが必要です](/docs/javascript-environment-requirements.html)。

> 注意
>
> React は ES5 をサポートしていない古いブラウザをサポートしていませんが、ページ内に [es5-shim や es5-sham](https://github.com/es-shims/es5-shim) のようなポリフィルが含まれている場合、古いブラウザでもアプリケーションが動作することがあります。この手段を選択するかどうかは自己責任で判断してください。

* * *

## リファレンス

### `render()`

```javascript
ReactDOM.render(element, container[, callback])
```

提供された `container` の DOM に React 要素をレンダーし、コンポーネントへの [reference](/docs/more-about-refs.html)（[ステートレスコンポーネント](/docs/components-and-props.html#functional-and-class-components)の場合は `null`）を返します。

React 要素がすでに `container` にレンダーされている場合は更新を行い、最新の React 要素を反映するために必要な DOM のみを変更します。

オプションのコールバックが提供されている場合は、コンポーネントがレンダーまたは更新された後に実行されます。

> 注意:
>
> `ReactDOM.render()` は与えられたコンテナの内容を制御します。コンテナ内部のあらゆる既存の DOM 要素は、最初に呼び出された時に置き換えられます。後続する呼び出しでは効率的な更新のために React の DOM 差分アルゴリズムを使用します。
>
> `ReactDOM.render()` はコンテナノードを変更しません（コンテナの子要素のみ変更します）。既存の子要素を上書きせずに既存の DOM ノードをコンポーネントに挿入することが可能な場合があります。
>
> `ReactDOM.render()` は現時点ではルートの `ReactComponent` インスタンスへの reference を返します。
> しかし、この戻り値を使用する方法は古く、将来のバージョンの React では一部のケースで非同期にコンポーネントをレンダーするようになる可能性があるため、使用は避けるべきです。
> ルートの `ReactComponent` インスタンスへの reference が必要な場合は、ルート要素に[コールバックの ref](/docs/more-about-refs.html#the-ref-callback-attribute) を追加することを推奨します。
>
> サーバーで描画されたコンテナをハイドレートするために `ReactDOM.render()` を使用することは非推奨となり、 React 17 では削除されます。代わりに [`hydrate()`](#hydrate) を使用してください。

* * *

### `hydrate()`

```javascript
ReactDOM.hydrate(element, container[, callback])
```

[`render()`](#render) と同様ですが、 [`ReactDOMServer`](/docs/react-dom-server.html) により HTML コンテンツが描画されたコンテナをハイドレートするために使用されます。 React は既存のマークアップにイベントリスナをアタッチしようとします。

React は描画された内容が、サーバー・クライアント間で同一であることを期待します。 React はテキストコンテンツの差異を修復することは可能ですが、その不一致はバグとして扱い、それらを修正すべきです。開発用モードでは、 React はハイドレート中の不一致について警告します。不一致がある場合に属性の差異が修復されるという保証はありません。これはパフォーマンス上の理由から重要です。なぜなら、ほとんどのアプリケーションにおいて不一致が発生というすることは稀であり、全てのマークアップを検証することはとてつもなく高コストになるためです。

単一要素の属性やテキストコンテンツがサーバー・クライアント間においてやむを得ず差異が生じる場合（例えばタイムスタンプなど）、要素に `suppressHydrationWarning={true}` を追加することで警告の発生を停止させることが可能です。それは 1 階層下の要素まで機能しますが、避難ハッチであることを意図しています。多用しないでください。テキストコンテンツでない限り、 React は修復を試行しようとはしないため、将来の更新まで矛盾が残る可能性があります。

サーバーとクライアントで異なるものを描画したい場合は、 2 つのパスに分けた描画を使用することができます。クライアント側の異なるものを描画するコンポーネントでは、 `this.state.isClient` のような state 変数を読み込み、 `componentDidMount()` で `true` を設定することができます。この方法では、最初の描画パスではサーバー側と同一の内容を描画し、不一致を回避しますが、もう一方のパスがハイドレートの直後に発生します。このアプローチでは 2 回描画が発生することによりコンポーネントのパフォーマンスが遅くなりますので、注意して使用して下さい。

低速な接続下でのユーザー体験に留意することを忘れないでください。 JavaScript のコードは初回の HTML の描画より大幅に遅くロードされる可能性があるため、クライアントのみのパスで何か異なるものを描画した場合、その遷移は不快感を与える可能性があります。しかしうまく実行されれば、サーバー上でアプリケーションの「殻」を描画し、クライアント上でのみ追加のウィジェットを表示することが有益になるかもしれません。マークアップの不一致の問題に発生させずにこれを実行する方法については、前の段落の説明をご参照下さい。

* * *

### `unmountComponentAtNode()`

```javascript
ReactDOM.unmountComponentAtNode(container)
```

DOM からマウントされた React コンポーネントを削除し、イベントハンドラや state をクリーンアップします。コンテナにコンポーネントがマウントされていない場合、このメソッドを呼び出しても何も行いません。コンポーネントがアンマウントされた場合は `true` を返し、アンマウントされなかった場合は `false` を返します。

* * *

### `findDOMNode()`

> 注意:
>
> `findDOMNode` は基盤となる DOM ノードにアクセスするために使用される避難ハッチです。ほとんどのケースにおいて、この避難ハッチの使用はコンポーネントの抽象化に穴を開けてしまうことになるためおすすめしません。 [`StrictMode` では非推奨になっています。](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
DOM にこのコンポーネントがマウントされている場合、このメソッドは対応するネイティブブラウザの DOM 要素を返します。このメソッドはフォームフィールドの値のような DOM の外側の値を読み取ったり DOM の計測を行ったりするのに便利です。**ほとんどのケースにおいて、 DOM ノードに ref をアタッチすることが可能であり、 `findDOMNode` の使用を避けることができます。**

コンポーネントが `null` や `false` を描画する場合、 `findDOMNode` は `null` を返します。コンポーネントが文字列を描画する場合、 `findDOMNode` はその値を含んだテキスト DOM ノードを返します。 React 16 以降、コンポーネントは複数の子要素を含むフラグメントを返すことがありますが、その場合 `findDOMNode` は最初の空でない子要素に対応する DOM ノードを返します。

> 注意:
>
> `findDOMNode` はマウントされたコンポーネントに対してのみ機能します（つまり、DOM に配置されたコンポーネント）。まだマウントされていないコンポーネントにおいてこのメソッドを呼ぼうとする場合（まだ作成されていないコンポーネントにおける `render()` の中で `findDOMNode()` を呼びだす場合など）、例外がスローされます。
>
> `findDOMNode` は関数コンポーネントでは使用できません。

* * *

### `createPortal()`

```javascript
ReactDOM.createPortal(child, container)
```

ポータルを作成します。ポータルは [DOM コンポーネントの階層の外側に存在している DOM ノードに対して子要素を描画する](/docs/portals.html)方法を提供します。
