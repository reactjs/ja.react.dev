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

`React` は React ライブラリのエントリポイントです。`<script>` タグから React を読み込む場合、これらの最上位 API をグローバルの `React` から利用できます。npm と ES6 を使う場合、`import React from 'react'` と書けます。npm と ES5 を使う場合、`var React = require('react')` と書けます。

## 概要 {#overview}

### コンポーネント {#components}

React コンポーネントを使用すると UI を独立した再利用可能な部分に分割し、各部分を個別に考えることができます。React コンポーネントは `React.Component` または `React.PureComponent` をサブクラス化することで定義できます。

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

ES6 クラスを使わない場合は、代わりに `create-react-class` モジュールを使うことができます。詳しくは [Using React without ES6](/docs/react-without-es6.html) を参照してください。

React コンポーネントは関数で定義でき、その際に以下の関数でラップできます：

- [`React.memo`](#reactmemo)

### React 要素を作成する {#creating-react-elements}

UI がどのように見えるべきかを記述するために [JSX の使用](/docs/introducing-jsx.html) を推奨します。JSX のそれぞれの要素は [`React.createElement()`](#createelement) を呼ぶための単なる糖衣構文です。JSX を使用している場合は、通常、次のメソッドを直接呼び出すことはありません。

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

詳しくは [JSX なしで React を使う](/docs/react-without-jsx.html) を参照してください。

### 要素を変換する {#transforming-elements}

`React` は要素を操作するためのいくつかの API を提供しています。

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### フラグメント (Fragment) {#fragments}

`React` はラッパーなしで複数の要素をレンダーするためのコンポーネントを提供しています。

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### サスペンス (Suspense) {#suspense}

サスペンスを使用すると、コンポーネントはレンダーの前に何かを「待機」できます。現在、サスペンスは 1 つのユースケースのみをサポートしています：[`React.lazy` を使ってコンポーネントを動的に読み込む](/docs/code-splitting.html#reactlazy)。将来的にはデータの取得のような他のユースケースもサポートされるでしょう。

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### トランジション {#transitions}

*トランジション*は React 18 で導入された新しい並行レンダー機能です。これにより更新をトランジションとしてマークすることができ、既に表示されているコンテンツがサスペンスによるフォールバック状態に戻ってしまわないよう更新を中断して構わない、と React に伝えることができるようになります。

- [`React.startTransition`](#starttransition)
- [`React.useTransition`](/docs/hooks-reference.html#usetransition)

### フック (hook) {#hooks}

*フック (hook)* は React 16.8 で追加された新機能です。state などの React の機能を、クラスを書かずに使えるようになります。フックには[専用のセクション](/docs/hooks-intro.html)と別の API リファレンスがあります。

- [基本的なフック](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [追加のフック](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)
  - [`useDeferredValue`](/docs/hooks-reference.html#usedeferredvalue)
  - [`useTransition`](/docs/hooks-reference.html#usetransition)
  - [`useId`](/docs/hooks-reference.html#useid)
- [ライブラリ製作者用フック](/docs/hooks-reference.html#library-hooks)
  - [`useSyncExternalStore`](/docs/hooks-reference.html#usesyncexternalstore)
  - [`useInsertionEffect`](/docs/hooks-reference.html#useinsertioneffect)

* * *

## リファレンス {#reference}

### `React.Component` {#reactcomponent}

React コンポーネントが [ES6 クラス](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) を用いて定義されている場合、`React.Component` はそれらの基底クラスになります。

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

基底クラス `React.Component` に関するメソッドとプロパティの一覧については、[React.Component API Reference](/docs/react-component.html) を参照してください。

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` は [`React.Component`](#reactcomponent) と似ています。両者の違いは [`React.Component`](#reactcomponent) が [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) を実装していないことに対し、`React.PureComponent` は props と state を浅く (shallow) 比較することでそれを実装していることです。

React コンポーネントの `render()` 関数が同じ props と state を与えられたときに同じ結果をレンダーするときは、パフォーマンスを向上させるために `React.PureComponent` を使用できます。

> 補足
>
> `React.PureComponent` の `shouldComponentUpdate()` は オブジェクトの浅い比較のみを行います。これらに複雑なデータ構造が含まれていると、深い部分のみに差分があるために、本当は差分があるにも関わらず差分がないと見なされる場合があります。単純な props と state を持つ場合にのみ `PureComponent` を継承するか、深いデータ構造が変更されたとわかっているときに [`forceUpdate()`](/docs/react-component.html#forceupdate) を使用してください。あるいは、ネストされたデータ構造の高速な比較を容易にするために [イミュータブルなオブジェクト](https://facebook.github.io/immutable-js/) の使用を検討してください。
>
> さらに、`React.PureComponent` の `shouldComponentUpdate()` はサブツリー全体のコンポーネントの props の更新をスキップします。子コンポーネントの全てが「純粋な」コンポーネントであることを確認してください。

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
```

`React.memo` は[高階コンポーネント](/docs/higher-order-components.html)です。

もしあるコンポーネントが同じ props を与えられたときに同じ結果をレンダーするなら、結果を記憶してパフォーマンスを向上させるためにそれを `React.memo` でラップすることができます。つまり、React はコンポーネントのレンダーをスキップし、最後のレンダー結果を再利用します。

`React.memo` は props の変更のみをチェックします。`React.memo` でラップしているあなたのコンポーネントがその実装内で [`useState`](/docs/hooks-state.html)、[`useReducer`](/docs/hooks-reference.html#usereducer) や [`useContext`](/docs/hooks-reference.html#usecontext) フックを使っている場合、state やコンテクストの変化に応じた再レンダーは発生します。

デフォルトでは props オブジェクト内の複雑なオブジェクトは浅い比較のみが行われます。比較を制御したい場合は 2 番目の引数でカスタム比較関数を指定できます。

```javascript
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  nextProps を render に渡した結果が
  prevProps を render に渡した結果となるときに true を返し
  それ以外のときに false を返す
  */
}
export default React.memo(MyComponent, areEqual);
```

これは**[パフォーマンス最適化](/docs/optimizing-performance.html)**のためだけの方法です。バグを引き起こす可能性があるため、レンダーを「抑止する」ために使用しないでください。

> 注意
>
> クラスコンポーネントの [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) とは異なり、この `areEqual` 関数は props が等しいときに `true` を返し、props が等しくないときに `false` を返します。これは `shouldComponentUpdate` とは逆です。

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

与えられた型の新しい [React 要素](/docs/rendering-elements.html)を作成して返します。`type` 引数はタグ名の文字列（`'div'` や `'span'` など）、[React component](/docs/components-and-props.html) 型（クラスもしくは関数）、[React fragment](#reactfragment) 型のいずれかです。

JSX で書かれたコードは `React.createElement()` を用いるコードに変換されます。JSX を使っていれば通常 `React.createElement()` を直接呼び出すことはありません。詳しくは [JSX なしで React を使う](/docs/react-without-jsx.html)を参照してください。

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

`element` から新しい React 要素を複製して返します。`config` には新しく使う props や `key` や `ref` を指定します。結果の要素は元の要素の props に新しい props が浅くマージされたものになります。新しい子要素は既存の子要素を置き換えます。`config` 内で `key` や `ref` が指定されていない場合、元の要素の `key` や `ref` が保持されます。

`React.cloneElement()` は以下のコードとほぼ同等です：

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

ただし、`ref` も保持されます。つまり `ref` のある子要素を受け取っても、間違って元の React 要素から  `ref` を盗むことはありません。新しい要素にも同じ `ref` が追加されます。新しい `ref` や `key` が存在する場合古いものを置き換えます。

この API は非推奨の `React.addons.cloneWithProps()` の代替として導入されました。

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

与えられた型の React 要素を生成する関数を返します。[`React.createElement()`](#createelement) と同様に、`type` 引数はタグ名の文字列（`'div'` や `'span'` など）、[React コンポーネント](/docs/components-and-props.html)型（クラスもしくは関数）、[React フラグメント](#reactfragment)型のいずれかです。

このヘルパーはレガシーだと考えられているため、代わりに JSX か `React.createElement()` を直接使用することをおすすめします。

JSX を使っていれば通常  `React.createFactory()` を直接呼び出すことはありません。詳しくは [JSX なしで React を使う](/docs/react-without-jsx.html)を参照してください。

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

オブジェクトが React 要素であることを確認します。`true` または `false` を返します。

* * *

### `React.Children` {#reactchildren}

`React.Children` はデータ構造が非公開の `this.props.children` を扱うためのユーティリティを提供します。

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

`this` を `thisArg` に設定して、`children` 内に含まれるすべての直下の子要素に対して関数を呼び出します。`children` が配列の場合は走査され、配列の各要素に対して関数が呼び出されます。`children` が `null` または `undefined` の場合はこのメソッドは配列ではなく `null` または `undefined` を返します。

> 補足
>
> `children` が `Fragment` の場合、それは 1 つの子要素として扱われ、走査されません。

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

[`React.Children.map()`](#reactchildrenmap) と似ていますが、配列を返しません。

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

`children` に含まれるコンポーネントの総数を返します。これは `map` または `forEach` に渡したコールバックが呼ばれる回数と同じです。

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

`children` が 1 つの子要素しか持たないことを確認し、結果を返します。そうでない場合、このメソッドはエラーを投げます。

> 補足:
>
> [`React.Children.map()`](#reactchildrenmap) の返り値は React 要素ではなく配列なため、`React.Children.only()` はそれを受け付けません。

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

データ構造が非公開の `children` を平坦な配列として返し、それぞれの要素に key を割り当てます。レンダーメソッド内で子の集合を操作したい場合、特に `this.props.children` を渡す前に並べ替えたりスライスしたい場合に便利です。

> 補足:
>
> `React.Children.toArray()` は子のリストを平坦にするときにネストされた配列の意味を保つために key を変更します。つまり、`toArray` は配列のそれぞれの要素の key に接頭辞を付けて返します。

* * *

### `React.Fragment` {#reactfragment}

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

また、フラグメントを `<></>` という短縮構文で使用できます。詳しくは [React v16.2.0: Improved Support for Fragments](/blog/2017/11/28/react-v16.2.0-fragment-support.html) を参照してください。


### `React.createRef` {#reactcreateref}

`React.createRef` は [ref](/docs/refs-and-the-dom.html) を作成します。ref は `ref` 属性を介して React 要素に取り付けることができます。
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` は [ref](/docs/refs-and-the-dom.html) を配下のツリーの別のコンポーネントに受け渡す React コンポーネントを作成します。この手法はあまり一般的ではありませんが、2 つのシナリオで特に役立ちます：

* [Forwarding refs to DOM components](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Forwarding refs in higher-order-components](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` はレンダー関数を引数として受け入れます。React は props と ref を 2 つの引数として呼び出します。この関数は React ノードを返す必要があります。

`embed:reference-react-forward-ref.js`

上の例では、React は `<FancyButton ref={ref}>` 要素に与えた `ref` を `React.forwardRef` の呼び出し内のレンダー関数の 2 番目の引数として渡します。このレンダー関数は `ref` を `<button ref={ref}>` 要素に渡します。

結果として、React が `ref` を取り付けた後、`ref.current` は `<button>` の DOM 要素のインスタンスを直接指すようになります。

詳しくは [forwarding refs](/docs/forwarding-refs.html) を参照してください。

### `React.lazy` {#reactlazy}

`React.lazy()` を使用すると、動的に読み込まれるコンポーネントを定義できます。これにより、バンドルサイズを削減して、最初のレンダー時に使用されないコンポーネントの読み込みを遅らせることができます。

[code splitting のドキュメント](/docs/code-splitting.html#reactlazy)から使用方法を学ぶことができます。また、使い方をより詳しく説明した[こちらの記事](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d)もチェックしてみてください。

```js
// This component is loaded dynamically
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

`lazy` コンポーネントをレンダーするには `<React.Suspense>` がレンダリングツリーの上位に必要です。これはローディングインジケータを指定する方法です。

### `React.Suspense` {#reactsuspense}

`React.Suspense` を使用することで、その配下のツリーにレンダーする準備ができていないコンポーネントがあるときに表示するローディングインジケータを指定できます。将来的には `Suspense` をデータフェッチングのようなより多くのシナリオで使えるようにする予定です。詳細は[ロードマップ](/blog/2018/11/27/react-16-roadmap.html)を参照してください。

現時点ではコンポーネントの遅延ローディングが `<React.Suspense>` がサポートする**唯一の**ユースケースです：

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

これは [code splitting guide](/docs/code-splitting.html#reactlazy) で文書化されています。遅延される (lazy) コンポーネントを `Suspense` ツリーの奥深くに置くことができ、それらを 1 つずつラップする必要はありません。ベストプラクティスは `<Suspense>` をローディングインジケータを表示したい場所に配置することですが、コードを分割したい場合は `lazy()` を使用してください。

>補足：
>
> 既にユーザに表示されているコンテンツがある場合、それがローディングインジケータに戻ってしまうのは不親切です。新しい UI を準備している間「古い」UI を表示しておくことが望ましいことがあります。これを行うため、新たなトランジション API である [`startTransition`](#starttransition) と [`useTransition`](/docs/hooks-reference.html#usetransition) を用い、更新をトランジションとしてマークすることで意図しない場面でのフォールバックを避けることができます。

#### サーバサイドレンダリングでの `React.Suspense` {#reactsuspense-in-server-side-rendering}
サーバサイドレンダリングにおいてもサスペンスバウンダリとサスペンドを用いることで、アプリを部分的に分割して表示していくことができます。
コンポーネントがサスペンドした場合、直近のサスペンスバウンダリに指定されているフォールバックをレンダーするような低優先度のタスクがスケジュールされます。フォールバックを表示する前にコンポーネントのサスペンドが解除された場合は、フォールバックのコンテンツを捨てて実コンテンツを送信します。

#### ハイドレーション中の `React.Suspense` {#reactsuspense-during-hydration}
サスペンスバウンダリがハイドレートされる前に親のバウンダリはハイドレートされていなければなりませんが、兄弟の関係にあるバウンダリとは独立してハイドレートされることができます。
何らかのバウンダリでイベントが起こった場合、そのバウンダリは他のものより優先的にハイドレートされるようになります。[詳細](https://github.com/reactwg/react-18/discussions/130)

### `React.startTransition` {#starttransition}

```js
React.startTransition(callback)
```
`React.startTransition` は渡されたコールバック内で発生した更新をトランジションとしてマークします。これは [`React.useTransition`](/docs/hooks-reference.html#usetransition) が使えない場合でも使えるように設計されています。

> 補足：
>
> トランジション内での更新はクリックのようなより緊急性の高い更新があった場合に遅延されます。
>
> トランジション内で起こった更新は、コンテンツが再サスペンドした場合でもフォールバックを表示させないため、更新をレンダーしている最中でもユーザが操作できる状態が保たれます。
>
> `React.startTransition` は `isPending` フラグを返しません。トランジションのペンディング状態を知るには [`React.useTransition`](/docs/hooks-reference.html#usetransition) を参照してください。