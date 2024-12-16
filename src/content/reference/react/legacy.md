---
title: "レガシー React API"
---

<Intro>

これらの API は `react` パッケージからエクスポートされていますが、新しく書くコードでの使用は推奨されていません。代替手段については、リンク先の個々の API ページを参照してください。

</Intro>

---

## レガシー API {/*legacy-apis*/}

<<<<<<< HEAD
* [`Children`](/reference/react/Children) を用いて、props として受け取る `children` の JSX を操作・変換します。[代替手段](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) を用いて、別の要素に基づいて React 要素を作成します。[代替手段](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) を用いて、JavaScript クラスとして React コンポーネントを定義します。[代替手段](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) を用いて、React 要素を作成します。通常は代わりに JSX を使用します。
* [`createRef`](/reference/react/createRef) を用いて、任意の値を保持できる ref オブジェクトを作成します。[代替手段](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) を用いて、値が React 要素であるかどうかを確認します。通常は [`cloneElement`](/reference/react/cloneElement) と一緒に使用されます。
* [`PureComponent`](/reference/react/PureComponent) は [`Component`](/reference/react/Component) に似ていますが、同じ props での再レンダーをスキップします。[代替手段](/reference/react/PureComponent#alternatives)
=======
* [`Children`](/reference/react/Children) lets you manipulate and transform the JSX received as the `children` prop. [See alternatives.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) lets you create a React element using another element as a starting point. [See alternatives.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) lets you define a React component as a JavaScript class. [See alternatives.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) lets you create a React element. Typically, you'll use JSX instead.
* [`createRef`](/reference/react/createRef) creates a ref object which can contain arbitrary value. [See alternatives.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node to parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) checks whether a value is a React element. Typically used with [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) is similar to [`Component`,](/reference/react/Component) but it skip re-renders with same props. [See alternatives.](/reference/react/PureComponent#alternatives)
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04

---

<<<<<<< HEAD
## 廃止予定の API {/*deprecated-apis*/}
=======
## Removed APIs {/*removed-apis*/}
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04

These APIs were removed in React 19:

<<<<<<< HEAD
これらの API は、React の将来のメジャーバージョンで削除される予定です。

</Deprecated>

* [`createFactory`](/reference/react/createFactory) は、特定のタイプの React 要素を生成する関数を作成します。
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04
