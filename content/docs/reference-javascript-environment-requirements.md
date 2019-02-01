---
id: javascript-environment-requirements
title: JavaScript 環境の要件
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 はコレクション型 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) および [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) に依存しています。（例えば IE 11 以前など）これらのプロパティをネイティブに提供しない、または非準拠の実装をしている古いブラウザやデバイスをサポートする場合は、[core-js](https://github.com/zloirock/core-js) もしくは [babel-polyfill](https://babeljs.io/docs/en/babel-polyfill/) などにより、グローバル環境のポリフィルをバンドルしたアプリケーションに含めることを検討してください。

古いブラウザをサポートするために、core-js を利用して React 16 向けにポリフィルした環境は次のようになります。

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React は（テスト環境であっても）`requestAnimationFrame` に依存します。
`requestAnimationFrame` をシミュレートするには [raf](https://www.npmjs.com/package/raf) を使用することができます。

```js
import 'raf/polyfill';
```
