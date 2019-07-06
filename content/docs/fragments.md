---
id: fragments
title: フラグメント
permalink: docs/fragments.html
---

React でよくあるパターンの 1 つに、コンポーネントが複数の要素を返すというものがあります。フラグメント (fragment) を使うことで、DOM に余分なノードを追加することなく子要素をまとめることができるようになります。

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

このようなものを宣言するための[短い記法](#short-syntax)もあります。

## 動機 {#motivation}

コンポーネントが子要素のリストを返すというのはよくあるパターンです。この React スニペットを例にしましょう：

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

レンダーされる HTML が正しいものであるためには、`<Columns />` は複数の `<td>` 要素を返す必要があります。`<Columns />` 中の `render()` 内で親の div 要素を使ってしまうと、結果として出力される HTML は不正なものとなってしまいます。

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

上記では、以下のような `<Table />` の出力となってしまいます：

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

フラグメントはこのような問題を解決します。

## 使い方 {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

上記は、以下のような正しい `<Table />` の出力となります：

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### 短い記法 {#short-syntax}

フラグメントを宣言するための新しい短縮記法があります。それは空のタグのようにも見えます：

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

この `<></>` は他の要素と同じように使うことが可能ですが、key や属性のサポートはありません。

### key 付きフラグメント {#keyed-fragments}

明示的に `<React.Fragment>` と宣言したフラグメントでは key を持つことができます。これはコレクションをフラグメントの配列に変換するときに有用です。たとえば定義リストを作成する時に利用します：

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` はフラグメントに渡すことができる唯一の属性です。将来的には、イベントハンドラのような他の属性を渡すこともサポートするかもしれません。

### ライブデモ {#live-demo}

この [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000) で新しい JSX フラグメントの記法を試すことができます。
