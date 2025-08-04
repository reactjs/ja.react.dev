---
title: 静的サイト用 React DOM API
---

<Intro>

<<<<<<< HEAD
`react-dom/static` の API を用いて、React コンポーネントを静的な HTML にレンダーすることができます。これらの API はストリーミング API とよりも機能が限られています。[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)がこれらあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。
=======
The `react-dom/static` APIs let you generate static HTML for React components. They have limited functionality compared to the streaming APIs. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

</Intro>

---

## Web ストリーム用の静的 API {/*static-apis-for-web-streams*/}

以下のメソッドは、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

* [`prerender`](/reference/react-dom/static/prerender) は React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) を用いて静的な HTML にレンダーします。


---

## Node.js ストリーム用の静的 API {/*static-apis-for-nodejs-streams*/}

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) は React ツリーを [Node.js ストリーム](https://nodejs.org/api/stream.html)を用いて静的な HTML にレンダーします。


