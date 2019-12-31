---
id: test-renderer
title: Test Renderer
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**インポート**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 with npm
```

## 概要 {#overview}

このパッケージは、DOM やネイティブのモバイル環境に依存せずに React コンポーネントをピュアな JavaScript オブジェクトにレンダーすることができる React レンダラを提供します。

本質的にこのパッケージは、ブラウザや [jsdom](https://github.com/tmpvar/jsdom) を利用しなくても、React DOM や React Native コンポーネントがレンダーする（DOM ツリーに似た）ビューの階層構造のスナップショットを容易に取得できるようにするためのものです。

例：

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

JSON ツリーを自動的にファイルに保存し、変更が起こったかをテストで確認するには、Jest のスナップショットテスト機能が利用できます。[詳細について知る](https://jestjs.io/docs/en/snapshot-testing)

出力を走査して特定のノードを検索し、それらに対してアサーションを行うこともできます。

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Hello</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Sub</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Sub']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)
* [`TestRenderer.act()`](#testrendereract)

### TestRenderer instance {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## リファレンス {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

渡された React 要素から `TestRenderer` インスタンスを作成します。実際の DOM は使用しませんが、コンポーネントを完全な形でメモリにレンダーするので、アサーションを行うことができます。返り値は [TestRenderer のインスタンス](#testrenderer-instance)となります。

### `TestRenderer.act()` {#testrendereract}

```javascript
TestRenderer.act(callback);
```

Similar to the [`act()` helper from `react-dom/test-utils`](/docs/test-utils.html#act), `TestRenderer.act` prepares a component for assertions. Use this version of `act()` to wrap calls to `TestRenderer.create` and `testRenderer.update`.

```javascript
import {create, act} from 'react-test-renderer';
import App from './app.js'; // The component being tested

// render the component
let root; 
act(() => {
  root = create(<App value={1}/>)
});

// make assertions on root 
expect(root.toJSON()).toMatchSnapshot();

// update with some different props
act(() => {
  root = root.update(<App value={2}/>);
})

// make assertions on root 
expect(root.toJSON()).toMatchSnapshot();
```

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

レンダーされたツリーを表すオブジェクトを返します。このツリーは `<div>` もしくは `<View>` のようなプラットフォーム固有のノードとそのプロパティを含みますが、ユーザ定義のコンポーネントは含まれません。[スナップショットテスト](https://facebook.github.io/jest/docs/en/snapshot-testing.html#snapshot-testing-with-jest)に便利です。

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

レンダーされたツリーを表すオブジェクトを返します。`toJSON()` とは異なり、このツリーはより詳細なものであり、ユーザ定義のコンポーネントも含んでいます。テストレンダラを利用して自作のアサーションライブラリを作成している場合以外は、おそらくこのメソッドが必要となることはないでしょう。

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

メモリ上のツリーを新規のルート要素で再レンダーします。ルートでの React の更新をシミュレートします。新しい要素が以前の要素と同じ型と key を持つ場合は、ツリーは更新されます。それ以外の場合は新しいツリーを再マウントします。

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

メモリ上のツリーをアンマウントし、適切なライフサイクルイベントを発生させます。

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

ルート要素に対応したインスタンスがある場合はそれを返します。関数コンポーネントはインスタンスを持たないため、ルート要素が関数コンポーネントの場合、このメソッドはうまく動作しません。

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

ツリー上の特定のノードに対してアサーションを行う際に役立つ、ルート「テストインスタンス」を返します。これは、配下の他の「テストインスタンス」を検索する際に使用することができます。

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

`test(testInstance)` が `true` を返す単一の子テストインスタンスを検索します。もし `test(testInstance)` に対して `true` を返すテストインスタンスの数がちょうど 1 でない場合は、エラーがスローされます。

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

与えられた `type` を持つ単一の子テストインスタンスを検索します。もし与えられた `type` を持つテストインスタンスの数がちょうど 1 でない場合、エラーがスローされます。

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

与えられた `props` を持つ単一の子テストインスタンスを検索します。もし与えられた `props` を持つテストインスタンスの数がちょうど 1 でない場合、エラーがスローされます。

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

`test(testInstance)` が `true` を返す全ての子テストインスタンスを検索します。

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

与えられた `type` を持つ全ての子テストインスタンスを検索します。

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

与えられた `props` を持つ全ての子テストインスタンスを検索します。

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

当該テストインスタンスに対応するコンポーネントのインスタンスです。関数コンポーネントはインスタンスを持たないため、クラスコンポーネントでのみ使用することができます。与えられたコンポーネント内での `this` の値と一致します。

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

当該テストインスタンスに対応するコンポーネントの型です。例えば、`<Button />` コンポーネントは `Button` 型を持っています。

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

当該テストインスタンスに対応するコンポーネントの props です。例えば、`<Button size="small" />` コンポーネントは `{size: 'small'}` を props として持っています。

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

当該テストインスタンスの親テストインスタンスです。

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

当該テストインスタンスの子テストインスタンスです。

## 使い方の一例 {#ideas}

オプションとして `createNodeMock` 関数を `TestRenderer.create` に渡すことで、独自のモック refs を作成することができます。`createNodeMock` は現在の要素を受け取り、モックの ref オブジェクトを返す必要があります。refs に依存したコンポーネントのテストに便利です。

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // mock a focus function
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
