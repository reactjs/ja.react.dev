---
id: test-utils
title: テストユーティリティ
permalink: docs/test-utils.html
layout: docs
category: リファレンス
---

**インポート**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 with npm
```

## 概要

`ReactTestUtils` はお好みのテストフレームワークで React コンポーネントをテストしやすくするものです。Facebook では快適に JavaScript をテストするために [Jest](https://facebook.github.io/jest/) を使用しています。Jest のウェブサイトにある [React Tutorial](http://facebook.github.io/jest/docs/en/tutorial-react.html#content) を通して Jest の始め方を学んでください。

> 補足:
>
> Airbnb が Enzyme と呼ばれるテストユーティリティをリリースしています。 Enzymeは React コンポーネントの出力のアサート、操作、そして横断的な処理をしやすくしてくれます。もしあなたが Jest や他のテストランナーを単体テストユーティリティと一緒に使用すると決めたなら、チェックしてみる価値があります: [http://airbnb.io/enzyme/](http://airbnb.io/enzyme/)
>
> また別の手段として、 `react-testing-library` と呼ばれる別のテストユーティリティがあります。これは、エンドユーザーがコンポーネントを使用するのと同様の書き方でコンポーネントを使用するテストを書くことを可能にし、かつそれを促進するように設計されています。このテストユーティリティはあらゆるテストランナーと一緒に動作します: [https://git.io/react-testing-library](https://git.io/react-testing-library)

 - [`Simulate`](#simulate)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)

## リファレンス

## Shallow Rendering

Reactの単体テストを書くときには、 shallow rendering が役に立ちます。 shallow rendering によって、インスタンス化またはレンダーされていない子コンポーネントの動作を気にすることなく、コンポーネントを "1 階層深く" レンダーしてその render メソッドが返す結果をアサートできます。これは DOM を必要としません。

> 補足:
>
> shallow renderer は `react-test-renderer/shallow` に移動しました。<br>
> [shallow rendererの詳細についてはリファレンスページを参照してください。](/docs/shallow-renderer.html)

## その他のユーティリティ

### `Simulate`

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

省略可能な `eventData` イベントデータを使って DOM ノード上のイベントディスパッチをシミュレートします。

`Simulate` は [React が理解している全てのイベント](/docs/events.html#supported-events)それぞれに対応するメソッドを持っています。

**要素をクリックする**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**入力フィールドの値を変更して ENTER キーを押す**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> 補足
>
> React はコンポーネントで使用しているイベントプロパティ（例えば keyCode 、 which など）を何も作成しないため、あなたはそれらをコンポーネントに与える必要があります。

* * *

### `renderIntoDocument()`

```javascript
renderIntoDocument(element)
```

React 要素をドキュメント内の独立したDOMノードにレンダーします。**この関数を実行するには DOM が必要です。**

> 補足:
>
> React をインポートする**前**に `window`, `window.document` および `window.document.createElement` をグローバルスコープに持っている必要があります。そうでなければ React は DOM にアクセスできないものと判断し `setState` のようなメソッドが動作しなくなります。

* * *

### `mockComponent()`

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

モック化されたコンポーネントモジュールをこのメソッドに渡すことで、ダミーの React コンポーネントとして使用できるようになる便利なメソッドを追加することができます。通常のレンダーの代わりに、コンポーネントは、与えられた子要素を含んだシンプルな `<div>`（もしくは `mockTagName` が与えられていれば他のタグ）になります。

> 補足:
>
> `mockComponent()` はレガシーな API です。その代わりとして [shallow rendering](/docs/test-utils.html#shallow-rendering) や [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock) の使用をおすすめします。

* * *

### `isElement()`

```javascript
isElement(element)
```

`element` が任意の React 要素である場合 `true` を返します。

* * *

### `isElementOfType()`

```javascript
isElementOfType(
  element,
  componentClass
)
```

`element` が `componentClass` 型の React 要素である場合 `true` を返します。

* * *

### `isDOMComponent()`

```javascript
isDOMComponent(instance)
```

`instance` が DOM コンポーネント（`<div>` や `<span>` など）である場合 `true` を返します。

* * *

### `isCompositeComponent()`

```javascript
isCompositeComponent(instance)
```

`instance` がクラスや関数のようなユーザ定義のコンポーネントである場合 `true` を返します。

* * *

### `isCompositeComponentWithType()`

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

`instance` が React の `componentClass` 型のコンポーネントである場合 `true` を返します。

* * *

### `findAllInRenderedTree()`

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

`tree` 中のすべてのコンポーネントを横断して `test(component)` が `true` である全てのコンポーネントを集め、その結果を返します。このメソッド自身はそれほど有用ではありませんが、他のテストユーティリティのための基本メソッドとして使用されます。

* * *

### `scryRenderedDOMComponentsWithClass()`

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

レンダーされたツリー内に存在する、クラス名が `className` に一致する DOM コンポーネントが持つ全ての DOM 要素を探し、その結果を返します。

* * *

### `findRenderedDOMComponentWithClass()`

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

[`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) と同様のメソッドですが、このメソッドは結果が 1 つだけであることを期待しており、その 1 つの結果を返すか、一致するものが 1 つでなかった場合には例外を返します。

* * *

### `scryRenderedDOMComponentsWithTag()`

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

レンダリングされたツリー内に存在する、タグ名が `tagName` に一致するDOMコンポーネントが持つ全てのDOM要素を探し、その結果を返します。

* * *

### `findRenderedDOMComponentWithTag()`

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

[`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) と同様のメソッドですが、このメソッドは結果が 1 つだけであることを期待しており、その 1 つの結果を返すか、一致するものが 1 つでなかった場合には例外を返します。

* * *

### `scryRenderedComponentsWithType()`

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

型が `componentClass` と同じコンポーネントのインスタンスを全て探し、その結果を返します。

* * *

### `findRenderedComponentWithType()`

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

[`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) と同様のメソッドですが、このメソッドは結果が 1 つだけであることを期待しており、その 1 つの結果を返すか、一致するものが 1 つでなかった場合には例外を返します。

* * *
