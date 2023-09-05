---
title: サーバ用 React DOM API
---

<Intro>

`react-dom/server` の API を用いて、サーバ上で React コンポーネントを HTML にレンダーすることができます。これらの API は、アプリケーションの最上位で初期 HTML を生成するために、サーバ上でのみ使用されます。[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)はこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

</Intro>

---

## Node.js ストリーム用のサーバ API {/*server-apis-for-nodejs-streams*/}

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) は、React ツリーをパイプ可能な [Node.js ストリーム](https://nodejs.org/api/stream.html)にレンダーします。
* [`renderToStaticNodeStream`](/reference/react-dom/server/renderToStaticNodeStream) は、非インタラクティブな React ツリーを [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)にレンダーします。

---

## Web Stream 用のサーバ API {/*server-apis-for-web-streams*/}

以下のメソッドは、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) は、React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) にレンダーします。

---

## ストリームをサポートしない環境向けのサーバ API {/*server-apis-for-non-streaming-environments*/}

以下のメソッドは、ストリームをサポートしていない環境で使用できます。

* [`renderToString`](/reference/react-dom/server/renderToString) は、React ツリーを文字列にレンダーします。
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) は、非インタラクティブな React ツリーを文字列にレンダーします。

これらは、ストリーミング API に比べて機能が限定されています。

---

## 非推奨のサーバ API {/*deprecated-server-apis*/}

<Deprecated>

以下の API は、React の将来のメジャーバージョンで削除される予定です。

</Deprecated>

* [`renderToNodeStream`](/reference/react-dom/server/renderToNodeStream) は、React ツリーを [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams) にレンダーします。（非推奨）
