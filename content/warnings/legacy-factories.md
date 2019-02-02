---
title: React Element Factories and JSX Warning
layout: single
permalink: warnings/legacy-factories.html
---

React 要素のファクトリと JSX についての警告

You probably came here because your code is calling your component as a plain function call. This is now deprecated:

このページに来たのは、恐らくコードがコンポーネントの呼び出しを普通の関数呼び出しとして行っているからでしょう。これは現在では非推奨となりました。

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX

React components can no longer be called directly like this. Instead [you can use JSX](/docs/jsx-in-depth.html).

Reactコンポーネントは、このように直接呼び出すことはできなくなりました。代わりにJSXを使うことができます。

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Without JSX
## JSX を使用しない場合

If you don't want to, or can't use JSX, then you'll need to wrap your component in a factory before calling it:

JSX を使いたくない、または使えない場合、コンポーネントを呼び出す前にファクトリにラップする必要があります。

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

This is an easy upgrade path if you have a lot of existing function calls.

大量の関数呼び出しを抱えている場合には簡単なアップグレード方法となります。


## Dynamic components without JSX

## JSX を使用しない動的なコンポーネント

If you get a component class from a dynamic source, then it might be unnecessary to create a factory that you immediately invoke. Instead you can just create your element inline:



動的ソースからコンポーネントクラスを取得する場合は、すぐに呼び出すファクトリを作成する必要はありません。代わりに、要素をインラインで作成することができます。



```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## In Depth
## 詳細


[Read more about WHY we're making this change.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)

[なぜこの変更を行ったのかについて更に読む。](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)

