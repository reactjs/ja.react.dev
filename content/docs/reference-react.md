---
id: react-api
title: React の最上位 API
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` は React ライブラリのエントリポイントです。`<script>` タグから React を読み込む場合、これらの最上位 API をグローバルの `React` から利用できます。
npm と ES6 を使う場合、`import React from 'react'` と書けます。npm と ES5 を使う場合、`var React = require('react')` と書けます。

## Overview

### Components

React コンポーネントを使用すると UI を独立した再利用可能な部分に分割し、各部分を個別に考えることができます。
React コンポーネントは `React.Component` または `React.PureComponent` をサブクラス化することで定義することができます。

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

ES6 クラスを使う代わりに、`create-react-class` を使うことができます。
詳しくは [Using React without ES6](/docs/react-without-es6.html) を見てください。

React コンポーネントは関数をラップして定義することもできます：

- [`React.memo`](#reactmemo)

### Creating React Elements

UI がどのように見えるかを記述するために [using JSX](/docs/introducing-jsx.html) を推奨します。JSX のそれぞれの要素は [`React.createElement()`](#createelement) を呼ぶための単なる糖衣構文です。
JSX を使用している場合は、通常、次のメソッドを直接呼び出さないでください。

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

詳しくは [Using React without JSX](/docs/react-without-jsx.html) を見てください。

### 要素を変換する

`React` は要素を操作するためのいくつかの API を提供しています。

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### フラグメント

`React` はラッパーなしで、複数の要素をレンダリングするコンポーネントを提供しています。

- [`React.Fragment`](#reactfragment)

### Refs

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### サスペンス

サスペンスを使用すると、コンポーネントはレンダリングの前に何かを待機することができます。
現在、サスペンスは1つのユースケースのみをサポートしています： [loading components dynamically with `React.lazy`](/docs/code-splitting.html#reactlazy)。
将来的にはデータの取得のような他のユースケースもサポートされます。

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

* * *

## 参考

### `React.Component`

React コンポーネントが [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) を用いて定義されている場合、`React.Component` はそれらの基底クラスになります。

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

基底クラス `React.Component` に関するメソッドとプロパティの一覧については、[React.Component API Reference](/docs/react-component.html) を参照してください。

* * *

### `React.PureComponent`

`React.PureComponent` は [`React.Component`](#reactcomponent) と似ています。両者の違いは [`React.Component`](#reactcomponent) が [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) を実装していないことに対し、`React.PureComponent` は props と state を浅く (shallow) 比較することでそれを実装していることです。

React コンポーネントの `render()` 関数が同じ props と state を与えられたときに同じ結果をレンダリングするときは、パフォーマンスを向上させるために `React.PureComponent` を使用することができます。

> 補足
>
> `React.PureComponent` の `shouldComponentUpdate()` は オブジェクトの浅い比較のみを行います。これらに複雑なデータ構造が含まれていると、深い部分のみに差分があるために、全体では差分があっても差分がないと見なされる場合があります。単純な props とstateを持つ場合にのみ `PureComponent` を継承するか、深いデータ構造が変更されたとわかっているときに [`forceUpdate()`](/docs/react-component.html#forceupdate) を使用してください。あるいは、ネストされたデータ構造の高速な比較を容易にするために [immutable objects](https://facebook.github.io/immutable-js/) の使用を検討してください。
>
> さらに、`React.PureComponent` の `shouldComponentUpdate()` はサブツリー全体のコンポーネントの props の更新をスキップします。子コンポーネントの全てが純粋コンポーネントであることを確認してください。

* * *

### `React.memo`

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
```

`React.memo` は [higher order component](/docs/higher-order-components.html) です。これは [`React.PureComponent`](#reactpurecomponent) に似ていますが、クラスではなく関数コンポーネントです。

ある関数コンポーネントが同じ props を与えられたときに同じ結果をレンダリングするとき、結果を記憶してパフォーマンスを向上させるためにそれを `React.memo` でラップして呼び出すことができます。つまり、Reactはコンポーネントのレンダリングをスキップし、最後のレンダリング結果を再利用します。

デフォルトでは props オブジェクト内の複雑なオブジェクトは浅い比較のみが行われます。比較を制御したい場合は2番目の引数でカスタム比較関数を指定することができます。

```javascript
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  nextPropsをrenderに渡したときに
  prevPropsをrenderに渡したときと同じ結果になるときにtrue
  それ以外のときにfalseを返す
  */
}
export default React.memo(MyComponent, areEqual);
```

これは **[performance optimization](/docs/optimizing-performance.html)** のためだけの方法です。バグを引き起こす可能性があるため、レンダリングを防ぐために使用しないでください。

> 注意
>
> クラスコンポーネントの [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) とは異なり、この `areEqual` 関数は props が等しいときに `true` を返し、props が等しくないときに `false` を返します。これは `shouldComponentUpdate` とは逆です。

* * *

### `createElement()`

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

与えられた型の新しい [React element](/docs/rendering-elements.html) を作成して返します。type 引数はタグ名の文字列（`div` や `span` など）、[React component](/docs/components-and-props.html) 型（クラスもしくは関数）、[React fragment](#reactfragment) 型のいずれかです。

JSX で書かれたコードは `React.createElement()` を用いて変換されます。JSX を使っていれば通常 `React.createElement()` を直接呼び出すことはありません。詳しくは [React Without JSX](/docs/react-without-jsx.html) を参照してください。

* * *

### `cloneElement()`

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

`element` から新しい React 要素を複製して返します。結果の要素は元の要素の props と新しい props が浅くマージされたものを持ちます。新しい小要素は既存の小要素を置き換えます。`key` と `ref` は元の要素から保持されます。

`React.cloneElement()` とほぼ同等：

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

ただし、`ref` は保持されます。つまり `ref` から子要素を得ても、間違って祖先から誤ってそれを盗むことはありません。新しい要素にも同じ `ref` が取り付けられます。

この API は非推奨の `React.addons.cloneWithProps()` の代替として導入されました。

* * *

### `createFactory()`

```javascript
React.createFactory(type)
```

与えられた型の React 要素を生成する関数を返します。[`React.createElement()`](#createElement) と同様に、type 引数はタグ名の文字列（`div` や `span` など）、[React component](/docs/components-and-props.html) 型（クラスもしくは関数）、[React fragment](#reactfragment) 型のいずれかです。

このヘルパーはレガシーと見なされます。JSX か `React.createElement()` を直接使用することを勧めます。

JSX を使っていれば通常  `React.createFactory()` を直接呼び出すことはありません。詳しくは [React Without JSX](/docs/react-without-jsx.html) を見てください。

* * *

### `isValidElement()`

```javascript
React.isValidElement(object)
```

オブジェクトが React 要素であることを確認します。`true` または `false` を返します。

* * *

### `React.Children`

`React.Children` はデータ構造が不透明な `this.props.children` を扱うためのユーティリティを提供します。

#### `React.Children.map`

```javascript
React.Children.map(children, function[(thisArg)])
```

`this` を `thisArg` に設定して、`children` 内に含まれるすべての直下の子要素に対して関数を呼び出します。`children` が配列の場合は走査され、配列の各要素に対して関数が呼び出されます。`children` が `null` または `undefined` の場合はこのメソッドは配列ではなく `null` または `undefined` を返します。

> 補足
>
> `children` が `Fragment` の場合、それは1つの子要素として扱われ、走査されません。

#### `React.Children.forEach`

```javascript
React.Children.forEach(children, function[(thisArg)])
```

[`React.Children.map()`](#reactchildrenmap) と似ていますが、配列を返しません。

#### `React.Children.count`

```javascript
React.Children.count(children)
```

`children` のコンポーネントの数を返します。これは `map` または `forEach` に渡したコールバックが呼ばれる回数と同じです。

#### `React.Children.only`

```javascript
React.Children.only(children)
```

`children` が1つの子要素しか持たないことを確認します。そうでない場合、このメソッドはエラーを投げます。

> 補足:
>
> [`React.Children.map()`](#reactchildrenmap) の返り値は React 要素ではなく配列なため、`React.Children.only()` はそれを受け付けません。

#### `React.Children.toArray`

```javascript
React.Children.toArray(children)
```

それぞれの要素に割り当てられたキーを持つ不透明なデータ構造の `children` を平坦な配列として返します。レンダリングメソッド内で子の集合を操作したい場合、特に `this.props.children` を渡す前に並べ替えたりスライスしたい場合に便利です。

> 補足:
>
> `React.Children.toArray()` は子のリストを平坦にするときにネストされた配列の意味を保つためにキーを変更します。つまり、`toArray` は配列のそれぞれの要素の key に接頭辞を付けて返します。

* * *

### `React.Fragment`

`React.Fragment` コンポーネントを使用すると追加の DOM 要素を作成することなく `render()` メソッドで複数の要素を返すことができます。

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

また、フラグメントを `<></>` という短縮構文で使用することもできます。詳しくは [React v16.2.0: Improved Support for Fragments](/blog/2017/11/28/react-v16.2.0-fragment-support.html) を見てください。


### `React.createRef`

`React.createRef` は [ref](/docs/refs-and-the-dom.html) を作成します。ref は ref 属性を介して React 要素に取り付けることができます。

### `React.forwardRef`

`React.forwardRef` は [ref](/docs/refs-and-the-dom.html) を配下のツリーの別のコンポーネントに受け渡す React コンポーネントを作成します。この手法はあまり一般的ではありませんが、2つのシナリオで特に役立ちます：

* [Forwarding refs to DOM components](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Forwarding refs in higher-order-components](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` はレンダリング関数を引数として受け入れます。Reactは props と ref を2つの引数として呼び出します。この関数は React ノードを返す必要があります。

`embed:reference-react-forward-ref.js`

上の例では、React は `<FancyButton ref={ref}>` 要素に与えた `ref` を `React.forwardRef` の呼び出し内のレンダリング関数の2番目の引数として渡します。このレンダリング関数は `ref` を `<button ref={ref}>` 要素に渡します。

結果として、Reactが `ref` を取り付けた後、`ref.current` は `<button>` の DOM 要素のインスタンスを直接指すようになります。

詳しくは [forwarding refs](/docs/forwarding-refs.html) を見てください。

### `React.lazy`

`React.lazy()` を使用すると、動的に読み込まれるコンポーネントを定義することができます。これにより、バンドルサイズを削減して、最初のレンダリング時に使用されなかったコンポーネントの読み込みを遅らせることができます。

[code splitting documentation](/docs/code-splitting.html#reactlazy) から使用方法を学ぶことが出来ます。また、使い方をより詳しく説明した [this article](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) もチェックしてみてください。

```js
// This component is loaded dynamically
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

`lazy` コンポーネントをレンダリングするには `<React.Suspense>` がレンダリングツリーの上位に必要です。これはローディングインジケータを指定する方法です。

> **補足**
>
> `React.lazy` を使って動的にインポートするには Promise が JS 環境で使用できる必要があります。これはIE11以前の環境にポリフィルを要求します。

### `React.Suspense`

`React.Suspense` を使用することで、その配下にレンダリングする準備ができていないコンポーネントがあるときにローディングインジケータを指定することができます。現在、遅延読み込みコンポーネントは `<React.Suspense>` のみによってサポートされています。

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

これは [code splitting guide](/docs/code-splitting.html#reactlazy) で文書化されています。遅延コンポーネントを `Suspense` ツリーの奥深くに置くこともできますが、それらすべてをラップする必要はありません。ベストプラクティスは `<Suspense>` をローディングインジケータを表示したい場所に配置することですが、コードを分割したい場合は `lazy()` を使用してください。

これらは現在サポートされていませんが、将来的には `Suspense` にデータの取得などのより多くのシナリオを処理させる予定です。この計画について、[our roadmap](/blog/2018/11/27/react-16-roadmap.html) を読むことができます。

>注意:
>
>`React.lazy()` と `<React.Suspense>` は `ReactDOMServer` ではまだサポートされていません。これは既知の制限であり、今後解決されます。
