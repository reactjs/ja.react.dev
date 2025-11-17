---
title: サーバ用 React DOM API
---

<Intro>

`react-dom/server` の API を用いて、サーバ上で React コンポーネントを HTML にレンダーすることができます。これらの API は、アプリケーションの最上位で初期 HTML を生成するために、サーバ上でのみ使用されます。[フレームワーク](/learn/creating-a-react-app#full-stack-frameworks)はこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

</Intro>

---

## Web Stream 用のサーバ API {/*server-apis-for-web-streams*/}

以下のメソッドは、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) は React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) にレンダーします。
* [`resume`](/reference/react-dom/server/renderToPipeableStream) は [`prerender`](/reference/react-dom/static/prerender) の結果を再開して[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) に流します。


<Note>

Node.js でも互換性のためこれらのメソッドが使用可能ですが、パフォーマンスが劣化するため推奨されません。代わりに [Node.js 専用の API](#server-apis-for-nodejs-streams) を使用してください。

</Note>
---

## Node.js ストリーム用のサーバ API {/*server-apis-for-nodejs-streams*/}

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) は React ツリーをパイプ可能な [Node.js ストリーム](https://nodejs.org/api/stream.html)にレンダーします。
* [`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) は [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) の結果を再開してパイプ可能な [Node.js ストリーム](https://nodejs.org/api/stream.html)に流します。

---

## 非ストリーム環境向けのレガシーサーバ API {/*legacy-server-apis-for-non-streaming-environments*/}

以下のメソッドは、ストリームをサポートしていない環境で使用できます。

* [`renderToString`](/reference/react-dom/server/renderToString) は React ツリーを文字列にレンダーします。
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) は非インタラクティブな React ツリーを文字列にレンダーします。

これらは、ストリーミング API に比べて機能が限定されています。
