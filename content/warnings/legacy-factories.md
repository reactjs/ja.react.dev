---
title: React Element Factories and JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

React Element ファクトリと JSX についての警告。

このページを閲覧しているのは、おそらくコンポーネントを普通の関数として呼び出しているからでしょう。これは現在非推奨になっています。

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX {#jsx}

React コンポーネントは、このように直接呼び出すことはできなくなりました。代わりに [JSX を使用できます](/docs/jsx-in-depth.html)。

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## JSX を使用しない場合 {#without-jsx}

JSX を使いたくない、または使えない場合、コンポーネントを呼び出す前にファクトリでラップする必要があります。

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

呼び出しの箇所が大量である場合、この修正方法が簡単です。

## JSX を使用しない動的なコンポーネント {#dynamic-components-without-jsx}

コンポーネントのクラスが動的に与えられる場合は、すぐに実行してしまうファクトリを作成する必要はありません。その代わりにインラインで単に要素を作成します。

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## 詳細 {#in-depth}

[この変更がなされた理由について更に読む。](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
