---
title: 静的サイト用 React DOM API
---

<Intro>

`react-dom/static` の API を用いて、React コンポーネントを静的な HTML にレンダーすることができます。これらの API はストリーミング API とよりも機能が限られています。[フレームワーク](/learn/start-a-new-react-project#full-stack-frameworks)がこれらあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

</Intro>

---

## Web ストリーム用の静的 API {/*static-apis-for-web-streams*/}

以下のメソッドは、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

<<<<<<< HEAD
* [`prerender`](/reference/react-dom/static/prerender) は React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) を用いて静的な HTML にレンダーします。
=======
* [`prerender`](/reference/react-dom/static/prerender) renders a React tree to static HTML with a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) continues a prerendered React tree to static HTML with a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

Node.js also includes these methods for compatibility, but they are not recommended due to worse performance. Use the [dedicated Node.js APIs](#static-apis-for-nodejs-streams) instead.

---

## Node.js ストリーム用の静的 API {/*static-apis-for-nodejs-streams*/}

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。

<<<<<<< HEAD
* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) は React ツリーを [Node.js ストリーム](https://nodejs.org/api/stream.html)を用いて静的な HTML にレンダーします。

=======
* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renders a React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) continues a prerendered React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

