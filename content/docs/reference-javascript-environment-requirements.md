---
id: javascript-environment-requirements
title: JavaScript 環境の要件
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 18 はすべてのモダンブラウザ（Edge, Firefox, Chrome, Safari など）をサポートします。

モダンなブラウザ機能についてネイティブ実装していないか非標準な実装をしている Internet Explorer のような古いブラウザをサポートする場合は、バンドルされたアプリにグローバルなポリフィルを含めることを検討してください。

以下が、React 18 で使われるモダンな機能の一覧です：
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

これらの機能を正しくポリフィルする方法はあなたの環境によって異なります。多くのユーザは、[Browserlist](https://github.com/browserslist/browserslist) を設定すれば大丈夫です。人によっては [`core-js`](https://github.com/zloirock/core-js) のようなポリフィルを直接インポートする必要があるかもしれません。