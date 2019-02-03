---
title: シンプルな Component
order: 0
domid: hello-example
---

React コンポーネントを作成する場合には `render()` メソッドを実装します。
このメソッドは、受け取った input データを元に、表示する内容を返す役割を担当します。
次の例では JSX と呼ばれる XML に似た構文を使っています。
コンポーネントに渡された input データを `this.props` で参照し、
`render()` の中で使用しています。

React components implement a `render()` method that takes input data and returns what to display. This example uses an XML-like syntax called JSX. Input data that is passed into the component can be accessed by `render()` via `this.props`.


**React を使う際に JSX を必ず使わなくてはいけないわけではありません。** JSX のコンパイルによって生成される生の JavaScript コードを見るには、[Babel REPL](babel://es5-syntax-example) を参照してください。


**JSX is optional and not required to use React.** Try the [Babel REPL](babel://es5-syntax-example) to see the raw JavaScript code produced by the JSX compilation step.
