---
id: react-without-jsx
title: JSXを使用しない場合
permalink: docs/react-without-jsx.html
---

JSXはReactを使うための要件ではありません。JSXなしでReactを使うことは、あなたのビルド環境でJSXのコンパイルの設定をしたくない時には便利です。

各JSX要素は、`React.createElement(component, props, ...children)`を呼び出すための単なるシンタックスシュガーです。つまり、JSXを使ってできることは、普通のJavaScriptを使ってもできます。

例えば、JSXで書かれた以下のコードは：

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

JSXを使わない以下のコードにコンパイルできます：

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

JSXからJavaScriptへの変換方法の例をもっと見たいなら、[オンラインのBabelコンパイラ]（babel://jsx-simple-example）で試すことができます。

コンポーネントは文字列、`React.Component`のサブクラス、もしくは（ステートレスコンポーネントの場合）プレーンな関数のいずれかで指定されます。

たくさんの`React.createElement`をタイピングするのに疲れたなら、一般的なパターンの1つはショートハンドを割り当てることです。

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

このショートハンドを`React.createElement`に使用すれば、JSXなしでReactを使うのにとても便利です。

あるいは、簡潔な構文を提供する[`react-hyperscript`]（https://github.com/mlmorg/react-hyperscript）や[`hyperscript-helpers`]（https://github.com/ohanhi/hyperscript-helpers）のようなコミュニティプロジェクトも参照してみてください。

