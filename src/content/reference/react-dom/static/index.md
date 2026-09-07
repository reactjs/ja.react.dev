---
title: 静的サイト用 React DOM API
---

<Intro>

`react-dom/static` の API を用いて、React コンポーネントを静的な HTML にレンダーすることができます。これらの API はストリーミング API とよりも機能が限られています。[フレームワーク](/learn/creating-a-react-app#full-stack-frameworks)がこれらあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

</Intro>

---

## Web ストリーム用の静的 API {/*static-apis-for-web-streams*/}

以下のメソッドは、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

<<<<<<< HEAD
* [`prerender`](/reference/react-dom/static/prerender) は React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) を用いて静的な HTML にレンダーします。
* <ExperimentalBadge /> [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) はプリンレンダー済みの React ツリーを再開して、[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) に静的な HTML として流します。
=======
* [`prerender`](/reference/react-dom/static/prerender) renders a React tree to static HTML with a [Readable Web Stream.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)
* [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) continues a prerendered React tree to static HTML with a [Readable Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream).
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290

Node.js でも互換性のためこれらのメソッドが使用可能ですが、パフォーマンスが劣化するため推奨されません。代わりに [Node.js 専用の API](#static-apis-for-nodejs-streams) を使用してください。

---

## Node.js ストリーム用の静的 API {/*static-apis-for-nodejs-streams*/}

<<<<<<< HEAD
以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。
=======
These methods are only available in the environments with [Node.js Streams](https://nodejs.org/api/stream.html):

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) renders a React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
* [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) continues a prerendered React tree to static HTML with a [Node.js Stream.](https://nodejs.org/api/stream.html)
>>>>>>> f3d9794fc31f4a3faf7e863984d37f4ae86b3290

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) は React ツリーを [Node.js ストリーム](https://nodejs.org/api/stream.html)を用いて静的な HTML にレンダーします。
* <ExperimentalBadge /> [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) はプリレンダー済みの React ツリーを再開して、[Node.js ストリーム](https://nodejs.org/api/stream.html)に静的な HTML として流します。
