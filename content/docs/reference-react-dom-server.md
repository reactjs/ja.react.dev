---
id: react-dom-server
title: ReactDOMServer
layout: docs
category: Reference
permalink: docs/react-dom-server.html
---

`ReactDOMServer` オブジェクトはコンポーネントを静的なマークアップとして変換できるようにします。これは、一般的に Node サーバで使われます。

```js
// ES modules
import ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 概要 {#overview}

以下のメソッドはサーバとブラウザの両方の環境で使用できます：

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

以下の追加のメソッドは**サーバでのみ利用可能な**パッケージ (`stream`) に依存しているため、ブラウザでは動作しません。

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToReadableStream()`](#rendertoreadablestream)
- [`renderToNodeStream()`](#rendertonodestream) (Deprecated)
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

* * *

## リファレンス {#reference}

### `renderToString()` {#rendertostring}

```javascript
ReactDOMServer.renderToString(element)
```

React 要素を初期状態の HTML へと変換します。React は HTML 文字列を返します。このメソッドにより、サーバ上で HTML を生成して最初のリクエストに対してマークアップを送信してページ読み込み速度を向上させたり、また SEO 目的で検索エンジンがページを巡回することを可能にします。

<<<<<<< HEAD
このようにしてサーバ側で変換されたマークアップをあらかじめ持つノード上で [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) を呼び出した場合、React はマークアップを保持しつつイベントハンドラのみを追加するので、非常にパフォーマンスの高い初回ページロードの体験が得られます。
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

React が内部的に使用する `data-reactroot` のような追加の DOM 属性を作成しないことを除いて、[`renderToString`](#rendertostring) と同様の動作をします。このメソッドは React を単純な静的サイトジェネレータとして使用したい場合に便利で、追加の属性を省略することでバイト数を削減できます。

<<<<<<< HEAD
マークアップをインタラクティブなものにするために、クライアントで React を導入しようとしている場合は、このメソッドを使用しないでください。代わりに、サーバで [`renderToString`](#rendertostring) を、そしてクライアントで [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) を使用してください。
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToString`](#rendertostring) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `renderToPipeableStream()` {#rendertopipeablestream}

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

Render a React element to its initial HTML. Returns a [Control object](https://github.com/facebook/react/blob/3f8990898309c61c817fbf663f5221d9a00d0eaa/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L49-L54) that allows you to pipe the output or abort the request. Fully supports Suspense and streaming of HTML with "delayed" content blocks "popping in" later through javascript execution. [Read more](https://github.com/reactwg/react-18/discussions/37)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

> Note:
>
> This is a Node.js specific API and modern server environments should use renderToReadableStream instead.
>

```
const {pipe, abort} = renderToPipeableStream(
  <App />,
  {
    onAllReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    }
  }
);
```

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

```javascript
    ReactDOMServer.renderToReadableStream(element, options);
```

Streams a React element to its initial HTML. Returns a [Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream). Fully supports Suspense and streaming of HTML. [Read more](https://github.com/reactwg/react-18/discussions/127)

If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.

```
let controller = new AbortController();
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
    }
  );
  
  // This is to wait for all suspense boundaries to be ready. You can uncomment
  // this line if you don't want to stream to the client
  // await stream.allReady;

  return new Response(stream, {
    headers: {'Content-Type': 'text/html'},
  });
} catch (error) {
  return new Response(
    '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>',
    {
      status: 500,
      headers: {'Content-Type': 'text/html'},
    }
  );
}
```
* * *

### `renderToNodeStream()` {#rendertonodestream} (Deprecated)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

React 要素を初期状態の HTML へと変換します。HTML の文字列を出力する [Readable ストリーム](https://nodejs.org/api/stream.html#stream_readable_streams)を返します。このストリームによる HTML 出力は [`ReactDOMServer.renderToString`](#rendertostring) が返すものと全く同じです。このメソッドにより、サーバ上で HTML を生成して最初のリクエストに対してマークアップを送信してページ読み込み速度を向上させたり、また SEO 目的で検索エンジンがページを巡回することを可能にします。

<<<<<<< HEAD
このようにしてサーバ側で変換されたマークアップをあらかじめ持つノード上で [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) を呼び出した場合、React はマークアップを保持しつつイベントハンドラのみを追加するので、非常にパフォーマンスの高い初回ページロードの体験が得られます。
=======
If you call [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on a node that already has this server-rendered markup, React will preserve it and only attach event handlers, allowing you to have a very performant first-load experience.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> 補足：
>
> この API はサーバ専用です。ブラウザでは利用できません。
>
> このメソッドが返すストリームは UTF-8 でエンコードされたバイトストリームを返します。別の方式でエンコードされたストリームが必要な場合、テキストのトランスコーディングのためにストリーム変換を提供している [iconv-lite](https://www.npmjs.com/package/iconv-lite) のようなプロジェクトを参照してください。

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

React が内部的に使用する `data-reactroot` のような追加の DOM 属性を作成しないことを除いて、[`renderToNodeStream`](#rendertonodestream) と同様の動作をします。このメソッドは React を単純な静的サイトジェネレータとして使用したい場合に便利で、追加の属性を省略することでバイト数を削減できます。

このストリームによる HTML 出力は [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) が返すものと全く同じです。

<<<<<<< HEAD
マークアップをインタラクティブなものにするために、クライアントで React を導入しようとしている場合は、このメソッドを使用しないでください。代わりに、サーバで [`renderToNodeStream`](#rendertonodestream) を、そしてクライアントで [`ReactDOM.hydrate()`](/docs/react-dom.html#hydrate) を使用してください。
=======
If you plan to use React on the client to make the markup interactive, do not use this method. Instead, use [`renderToNodeStream`](#rendertonodestream) on the server and [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) on the client.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> 補足：
>
> この API はサーバ専用です。ブラウザでは利用できません。
>
> このメソッドが返すストリームは UTF-8 でエンコードされたバイトストリームを返します。別の方式でエンコードされたストリームが必要な場合、テキストのトランスコーディングのためにストリーム変換を提供している [iconv-lite](https://www.npmjs.com/package/iconv-lite) のようなプロジェクトを参照してください。
