---
id: shallow-renderer
title: 浅いレンダー
permalink: docs/shallow-renderer.html
layout: docs
category: リファレンス
---

**インポート**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 with npm
```

## 概要

Reactの単体テストを実装するときに、浅いレンダー（Shallow Renderer）は役に立つことがあります。浅いレンダーを使用すると、インスタンス化またはレンダーされていない子コンポーネントの振る舞いを心配することなく、「1階層深く」レンダーしてレンダーメソッドが返すものをアサート（assert）できます。これにDOMは必要ありません。

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

以下のようにアサートできます：

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

浅いテストは現在いくつかの制限があります。すなわちrefsをサポートしていません。

> 注意：
>
> またEnzymeの[Shallow Rendering API](http://airbnb.io/enzyme/docs/api/shallow.html)をチェックすることをお勧めします。それは同じ機能上でより良くより高いレベルのAPIを提供します。

## リファレンス

### `shallowRenderer.render()`

shallowRendererは、テストしているコンポーネントをレンダーするための「場所」と捉えることができ、そこからコンポーネントの出力を抽出できます。

`shallowRenderer.render()`は[`ReactDOM.render()`](/docs/react-dom.html#render)に似ていますが、DOMを必要とせず、1階層だけレンダーします。つまり、テスト対象のコンポーネントが持つ子コンポーネントの実装から分離してテストを実施できます。

### `shallowRenderer.getRenderOutput()`

`shallowRenderer.render()`が呼び出された後、`shallowRenderer.getRenderOutput()`を使用して浅くレンダーされた出力を取得できます。

そして出力から得た結果のアサートを開始できます。
