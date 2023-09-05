---
title: renderToNodeStream
---

<Deprecated>

この API は、将来の React のメジャーバージョンで削除されます。代わりに [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) を使用してください。

</Deprecated>

<Intro>

`renderToNodeStream` は、React のツリーを [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)にレンダーします。

```js
const stream = renderToNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `renderToNodeStream(reactNode)` {/*rendertonodestream*/}

サーバ上において、`renderToNodeStream` を呼び出して、レスポンスにパイプすることができる [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)を取得します。

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

クライアント側では、このようにサーバ生成された HTML を操作可能にするために [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を用います。

[更に例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: HTML にレンダーしたい React ノード。例えば、`<App />` のような JSX 要素。

#### 返り値 {/*returns*/}

HTML 文字列を出力する [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)。

#### 注意点 {/*caveats*/}

* このメソッドは、すべての[サスペンスバウンダリ](/reference/react/Suspense)が完了するまで、出力を返さず待機します。

* React 18 時点において、このメソッドはすべての出力をバッファリングするため、実際にはストリームを使用する利点が得られません。これが、代わりに [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) に移行することが推奨される理由です。

* 返されるストリームは、utf-8 でエンコードされたバイトストリームです。別のエンコーディングのストリームが必要な場合は、テキストのトランスコーディング用の変換ストリームを提供する [iconv-lite](https://www.npmjs.com/package/iconv-lite) のようなプロジェクトを参照してください。

---

## 使用法 {/*usage*/}

### React ツリーを HTML として Node.js の Readable ストリームにレンダーする {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

`renderToNodeStream` を呼び出して、サーバからのレスポンスにパイプできる [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)を取得します。

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

このストリームは、React コンポーネントの非インタラクティブな初期 HTML 出力を生成します。クライアント側では、サーバが生成した HTML の*ハイドレーション*を行い操作可能にするために、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す必要があります。
