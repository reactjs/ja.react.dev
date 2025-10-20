---
title: サーバ用 React DOM API
---

<Intro>

`react-dom/server` の API を用いて、サーバ上で React コンポーネントを HTML にレンダーすることができます。これらの API は、アプリケーションの最上位で初期 HTML を生成するために、サーバ上でのみ使用されます。[フレームワーク](/learn/start-a-new-react-project#full-stack-frameworks)はこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

</Intro>

---

<<<<<<< HEAD
## Node.js ストリーム用のサーバ API {/*server-apis-for-nodejs-streams*/}

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) は、React ツリーをパイプ可能な [Node.js ストリーム](https://nodejs.org/api/stream.html)にレンダーします。

---

## Web Stream 用のサーバ API {/*server-apis-for-web-streams*/}
=======
## Server APIs for Web Streams {/*server-apis-for-web-streams*/}
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

以下のメソッドは、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

<<<<<<< HEAD
* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) は、React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) にレンダーします。
=======
* [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) renders a React tree to a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resume`](/reference/react-dom/server/renderToPipeableStream) resumes [`prerender`](/reference/react-dom/static/prerender) to a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).


<Note>

Node.js also includes these methods for compatibility, but they are not recommended due to worse performance. Use the [dedicated Node.js APIs](#server-apis-for-nodejs-streams) instead.

</Note>
---

## Server APIs for Node.js Streams {/*server-apis-for-nodejs-streams*/}

These methods are only available in the environments with [Node.js Streams:](https://nodejs.org/api/stream.html)

* [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) renders a React tree to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`resumeToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) resumes [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) to a pipeable [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

---

## 非ストリーム環境向けのレガシーサーバ API {/*legacy-server-apis-for-non-streaming-environments*/}

以下のメソッドは、ストリームをサポートしていない環境で使用できます。

* [`renderToString`](/reference/react-dom/server/renderToString) は、React ツリーを文字列にレンダーします。
* [`renderToStaticMarkup`](/reference/react-dom/server/renderToStaticMarkup) は、非インタラクティブな React ツリーを文字列にレンダーします。

これらは、ストリーミング API に比べて機能が限定されています。
