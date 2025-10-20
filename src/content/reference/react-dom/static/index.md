---
title: 静的サイト用 React DOM API
---

<Intro>

`react-dom/static` の API を用いて、React コンポーネントを静的な HTML にレンダーすることができます。これらの API はストリーミング API とよりも機能が限られています。[フレームワーク](/learn/start-a-new-react-project#full-stack-frameworks)がこれらあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

</Intro>

---

## Web ストリーム用の静的 API {/*static-apis-for-web-streams*/}

以下のメソッドは、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) が利用可能な環境でのみ使用できます。これには、ブラウザ、Deno、および一部のモダンなエッジランタイムが含まれます。

* [`prerender`](/reference/react-dom/static/prerender) は React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) を用いて静的な HTML にレンダーします。


---

## Node.js ストリーム用の静的 API {/*static-apis-for-nodejs-streams*/}

以下のメソッドは、[Node.js ストリーム](https://nodejs.org/api/stream.html)が利用可能な環境でのみ使用できます。

* [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) は React ツリーを [Node.js ストリーム](https://nodejs.org/api/stream.html)を用いて静的な HTML にレンダーします。


