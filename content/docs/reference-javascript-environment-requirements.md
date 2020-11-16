---
id: javascript-environment-requirements
title: JavaScript 環境の要件
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 はコレクション型 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) および [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) に依存しています。これらの機能をネイティブに提供しない（IE 11 未満など）、または標準非準拠な挙動をする（IE 11 など）古いブラウザやデバイスをサポートする場合は、[core-js](https://github.com/zloirock/core-js) や [babel-polyfill](https://babeljs.io/docs/en/babel-polyfill/) などのような、グローバル環境のポリフィルをバンドルしたアプリケーションに含めることを検討してください。
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

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
