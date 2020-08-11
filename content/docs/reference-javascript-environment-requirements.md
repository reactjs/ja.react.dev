---
id: javascript-environment-requirements
title: JavaScript 環境の要件
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 はコレクション型 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) および [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) に依存しています。これらの機能をネイティブに提供しない（IE 11 未満など）、または標準非準拠な挙動をする（IE 11 など）古いブラウザやデバイスをサポートする場合は、[core-js](https://github.com/zloirock/core-js) や [babel-polyfill](https://babeljs.io/docs/en/babel-polyfill/) などのような、グローバル環境のポリフィルをバンドルしたアプリケーションに含めることを検討してください。

古いブラウザをサポートするため、core-js を利用してポリフィルを含めた React 16 向けの環境は次のようになります。

```js
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React は（テスト環境であっても）`requestAnimationFrame` に依存します。
`requestAnimationFrame` の役割を補うため [raf](https://www.npmjs.com/package/raf) を使用します。

```js
import 'raf/polyfill';
```
