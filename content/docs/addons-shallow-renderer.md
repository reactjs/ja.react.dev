---
id: shallow-renderer
title: Shallow Renderer
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**インポート**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## 概要 {#overview}

React の単体テストを実装するとき、Shallow Renderer が役立つでしょう。浅いレンダー (shallow rendering) を使用すると、インスタンス化またはレンダーされていない子コンポーネントの振る舞いを心配することなく、「1 階層深く」レンダーしてレンダーメソッドが返すものを assert できます。これに DOM は必要ありません。

たとえば、以下のコンポーネントがある場合：

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

以下のように assert できます：

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// in your test:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

浅いレンダーによるテストには現在いくつかの制限があります。すなわち ref をサポートしていません。

> 補足：
>
> また Enzyme の [Shallow Rendering API](https://airbnb.io/enzyme/docs/api/shallow.html) をチェックすることをお勧めします。それは同じ機能上でより良くより高いレベルの API を提供します。

## リファレンス {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

shallowRenderer は、テストしているコンポーネントをレンダーするための「場所」と捉えることができ、そこからコンポーネントの出力を抽出できます。

`shallowRenderer.render()` は [`ReactDOM.render()`](/docs/react-dom.html#render) に似ていますが、DOM を必要とせず、1 階層だけレンダーします。つまり、テスト対象のコンポーネントが持つ子コンポーネントの実装から分離してテストを実行できます。

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

`shallowRenderer.render()` が呼び出された後、`shallowRenderer.getRenderOutput()` を使用して浅くレンダーされた出力を取得できます。

そして出力から得た結果の assert を開始できます。
