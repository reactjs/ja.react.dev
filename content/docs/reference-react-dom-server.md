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
import * as ReactDOMServer from 'react-dom/server';
// CommonJS
var ReactDOMServer = require('react-dom/server');
```

## 概要 {#overview}

以下のメソッドは **[Node.js の Stream](https://nodejs.org/api/stream.html) 環境でのみ動作します**：

- [`renderToPipeableStream()`](#rendertopipeablestream)
- [`renderToNodeStream()`](#rendertonodestream)（非推奨）
- [`renderToStaticNodeStream()`](#rendertostaticnodestream)

以下のメソッドは **[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) の環境**（ブラウザ、Deno やいくつかのモダンなエッジランタイム）でのみ動作します：

- [`renderToReadableStream()`](#rendertoreadablestream)

以下のメソッドはストリームをサポートしない環境でも動作します：

- [`renderToString()`](#rendertostring)
- [`renderToStaticMarkup()`](#rendertostaticmarkup)

## リファレンス {#reference}

### `renderToPipeableStream()` {#rendertopipeablestream}

> 新しい React ドキュメントの記事もお試しください：[`renderToPipeableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToPipeableStream).
>
> まもなく新しいドキュメントがリリースされ、このページはアーカイブされる予定です。[フィードバックを送る](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToPipeableStream(element, options)
```

React 要素を初期状態の HTML に変換します。出力をパイプするための `pipe(res)` メソッドとリクエストを中止するための `abort()` メソッドを持ったストリームを返します。サスペンスや、HTML をストリーミングして「遅れてやってくる」コンテンツのブロックをインライン `<script>` タグで埋めるための機能を完全にサポートしています。[詳細はこちら](https://github.com/reactwg/react-18/discussions/37)。

このようにサーバでレンダーされたマークアップを有するノードに対して [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) をコールすると、React はマークアップを保持してイベントハンドラだけをアタッチしますので、非常によい初回ロード体験が実現できます。

```javascript
let didError = false;
const stream = renderToPipeableStream(
  <App />,
  {
    onShellReady() {
      // The content above all Suspense boundaries is ready.
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onShellError(error) {
      // Something errored before we could complete the shell so we emit an alternative shell.
      res.statusCode = 500;
      res.send(
        '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
      );
    },
    onAllReady() {
      // If you don't want streaming, use this instead of onShellReady.
      // This will fire after the entire page content is ready.
      // You can use this for crawlers or static generation.

      // res.statusCode = didError ? 500 : 200;
      // res.setHeader('Content-type', 'text/html');
      // stream.pipe(res);
    },
    onError(err) {
      didError = true;
      console.error(err);
    },
  }
);
```

[オプションの全リスト](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L36-L46)を参照。

> 補足：
>
> これは Node.js 専用の API です。Deno やモダンなエッジランタイムのような [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) の環境では、代わりに [`renderToReadableStream`](#rendertoreadablestream) を使用してください。
>

* * *

### `renderToReadableStream()` {#rendertoreadablestream}

> 新しい React ドキュメントの記事もお試しください：[`renderToReadableStream`](https://beta.reactjs.org/reference/react-dom/server/renderToReadableStream).
>
> まもなく新しいドキュメントがリリースされ、このページはアーカイブされる予定です。[フィードバックを送る](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToReadableStream(element, options);
```

React 要素を初期状態の HTML にストリーミングします。[Readable Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) として resolve する Promise を返します。サスペンスと HTML ストリーミングを完全にサポートします。[詳細はこちら](https://github.com/reactwg/react-18/discussions/127)。

このようにサーバでレンダーされたマークアップを有するノードに対して [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) をコールすると、React はマークアップを保持してイベントハンドラだけをアタッチしますので、非常によい初回ロード体験が実現できます。


```javascript
let controller = new AbortController();
let didError = false;
try {
  let stream = await renderToReadableStream(
    <html>
      <body>Success</body>
    </html>,
    {
      signal: controller.signal,
      onError(error) {
        didError = true;
        console.error(error);
      }
    }
  );
  
  // This is to wait for all Suspense boundaries to be ready. You can uncomment
  // this line if you want to buffer the entire HTML instead of streaming it.
  // You can use this for crawlers or static generation:

  // await stream.allReady;

  return new Response(stream, {
    status: didError ? 500 : 200,
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

[オプションの全リスト](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-dom/src/server/ReactDOMFizzServerBrowser.js#L27-L35)を参照。

> 補足：
>
> この API は [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) に依存しています。Node.js では代わりに [`renderToPipeableStream`](#rendertopipeablestream) を使用してください。
>

* * *

### `renderToNodeStream()`（非推奨）{#rendertonodestream}

> 新しい React ドキュメントの記事もお試しください：[`renderToNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToNodeStream).
>
> まもなく新しいドキュメントがリリースされ、このページはアーカイブされる予定です。[フィードバックを送る](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToNodeStream(element)
```

React 要素を初期状態の HTML にストリーミングします。HTML 文字列を出力する [Node.js の 読み取りストリーム](https://nodejs.org/api/stream.html#stream_readable_streams) を返します。このストリームからの HTML 出力は [`ReactDOMServer.renderToString`](#rendertostring) が返すものと全く同じです。このメソッドを使ってサーバで HTML を生成し、初回リクエスト時にマークアップを送信することで、ページロードを高速化し、SEO 目的でサーチエンジンがクロールできるようになります。

このようにサーバでレンダーされたマークアップを有するノードに対して [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) をコールすると、React はマークアップを保持してイベントハンドラだけをアタッチしますので、非常によい初回ロード体験が実現できます。

> 補足：
>
> この API はサーバ専用です。ブラウザでは利用できません。
>
> このメソッドが返すストリームは UTF-8 でエンコードされたバイトストリームを返します。別の方式でエンコードされたストリームが必要な場合、テキストのトランスコーディングのために変換ストリームを提供している [iconv-lite](https://www.npmjs.com/package/iconv-lite) のようなプロジェクトを参照してください。

* * *

### `renderToStaticNodeStream()` {#rendertostaticnodestream}

> 新しい React ドキュメントの記事もお試しください：[`renderToStaticNodeStream`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticNodeStream).
>
> まもなく新しいドキュメントがリリースされ、このページはアーカイブされる予定です。[フィードバックを送る](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticNodeStream(element)
```

React が内部的に使用する `data-reactroot` のような追加の DOM 属性を作成しないことを除いて、[`renderToNodeStream`](#rendertonodestream) と同様の動作をします。このメソッドは React を単純な静的サイトジェネレータとして使用したい場合に便利で、追加の属性を省略することでバイト数を削減できます。

このストリームによる HTML 出力は [`ReactDOMServer.renderToStaticMarkup`](#rendertostaticmarkup) が返すものと全く同じです。

マークアップをインタラクティブなものにするために、クライアントで React を導入しようとしている場合は、このメソッドを使用しないでください。代わりに、サーバで [`renderToNodeStream`](#rendertonodestream) を、そしてクライアントで [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) を使用してください。

> 補足：
>
> この API はサーバ専用です。ブラウザでは利用できません。
>
> このメソッドが返すストリームは UTF-8 でエンコードされたバイトストリームを返します。別の方式でエンコードされたストリームが必要な場合、テキストのトランスコーディングのために変換ストリームを提供している [iconv-lite](https://www.npmjs.com/package/iconv-lite) のようなプロジェクトを参照してください。

* * *

### `renderToString()` {#rendertostring}

> 新しい React ドキュメントの記事もお試しください：[`renderToString`](https://beta.reactjs.org/reference/react-dom/server/renderToString).
>
> まもなく新しいドキュメントがリリースされ、このページはアーカイブされる予定です。[フィードバックを送る](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToString(element)
```

React 要素を初期状態の HTML に変換します。React は HTML 文字列を返します。このメソッドを使ってサーバで HTML を生成し、初回リクエスト時にマークアップを送信することで、ページロードを高速化し、SEO 目的でサーチエンジンがクロールできるようになります。

このようにサーバでレンダーされたマークアップを有するノードに対して [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) をコールすると、React はマークアップを保持してイベントハンドラだけをアタッチしますので、非常によい初回ロード体験が実現できます。

> 補足
>
> この API は Suspense を部分的にしかサポートしておらず、ストリーミングが行えません。
>
> サーバサイドでは、[`renderToPipeableStream`](#rendertopipeablestream)（Node.js の場合）または [`renderToReadableStream`](#rendertoreadablestream)（Web Stream の場合）の利用をお勧めします。

* * *

### `renderToStaticMarkup()` {#rendertostaticmarkup}

> 新しい React ドキュメントの記事もお試しください：[`renderToStaticMarkup`](https://beta.reactjs.org/reference/react-dom/server/renderToStaticMarkup).
>
> まもなく新しいドキュメントがリリースされ、このページはアーカイブされる予定です。[フィードバックを送る](https://github.com/reactjs/reactjs.org/issues/3308)

```javascript
ReactDOMServer.renderToStaticMarkup(element)
```

React が内部的に使用する `data-reactroot` のような追加の DOM 属性を作成しないことを除いて、[`renderToString`](#rendertostring) と同様の動作をします。このメソッドは React を単純な静的サイトジェネレータとして使用したい場合に便利で、追加の属性を省略することでバイト数を削減できます。

クライアントで React を使ってマークアップをインタラクティブにする目的では、このメソッドは使わないでください。代わりにサーバで [`renderToString`](#rendertostring)、クライアントで [`ReactDOM.hydrateRoot()`](/docs/react-dom-client.html#hydrateroot) を使うようにします。