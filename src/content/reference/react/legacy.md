---
title: "レガシー React API"
---

<Intro>

これらの API は `react` パッケージからエクスポートされていますが、新しく書くコードでの使用は推奨されていません。代替手段については、リンク先の個々の API ページを参照してください。

</Intro>

---

## レガシー API {/*legacy-apis*/}

* [`Children`](/reference/react/Children) を用いて、props として受け取る `children` の JSX を操作・変換します。[代替手段](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) を用いて、別の要素に基づいて React 要素を作成します。[代替手段](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) を用いて、JavaScript クラスとして React コンポーネントを定義します。[代替手段](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) を用いて、React 要素を作成します。通常は代わりに JSX を使用します。
* [`createRef`](/reference/react/createRef) を用いて、任意の値を保持できる ref オブジェクトを作成します。[代替手段](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) を用いて、親コンポーネントに [ref](/learn/manipulating-the-dom-with-refs) 経由で DOM ノードを公開できます。
* [`isValidElement`](/reference/react/isValidElement) を用いて、値が React 要素であるかどうかを確認します。通常は [`cloneElement`](/reference/react/cloneElement) と一緒に使用されます。
* [`PureComponent`](/reference/react/PureComponent) は [`Component`](/reference/react/Component) に似ていますが、同じ props での再レンダーをスキップします。[代替手段](/reference/react/PureComponent#alternatives)

---

## 削除済み API {/*removed-apis*/}

以下の API は React 19 で削除されました。

<<<<<<< HEAD
* [`createFactory`](https://18.react.dev/reference/react/createFactory): 代わりに JSX を使用してください。
* クラスコンポーネントの [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): 代わりに [`static contextType`](#static-contexttype) を使用してください。
* クラスコンポーネントの [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): 代わりに [`static contextType`](#static-contexttype) を使用してください。
* クラスコンポーネントの [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): 代わりに [`Context.Provider`](/reference/react/createContext#provider) を使用してください。
* クラスコンポーネントの [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): 代わりに [TypeScript](https://www.typescriptlang.org/) などの型システムを使用してください。
* クラスコンポーネントの [`this.refs`](https://18.react.dev//reference/react/Component#refs): 代わりに [`createRef`](/reference/react/createRef) を使用してください。
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91
