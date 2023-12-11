---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` は、非インタラクティブな React ツリーを [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams) にレンダーします。

```js
const stream = renderToStaticNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `renderToStaticNodeStream(reactNode)` {/*rendertostaticnodestream*/}

サーバ上において、`renderToStaticNodeStream` を呼び出して [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)を取得します。

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[さらに例を見る](#usage)

このストリームは、React コンポーネントの非インタラクティブな HTML 出力を生成します。

#### 引数 {/*parameters*/}

* `reactNode`: HTML にレンダーしたい React ノード。例えば、`<Page />` のような JSX 要素。

* **省略可能** `options`: サーバレンダー用のオプションが含まれたオブジェクト。
  * **省略可能** `identifierPrefix`: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。

#### 返り値 {/*returns*/}

HTML 文字列を出力する [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)。結果として得られる HTML はクライアント上でハイドレーションすることはできません。

#### 注意点 {/*caveats*/}

* `renderToStaticNodeStream` の出力はハイドレーションすることができません。

* このメソッドは、すべての[サスペンスバウンダリ](/reference/react/Suspense)が完了するまで出力を返さずに待機します。

* React 18 時点において、このメソッドはすべての出力をバッファリングするため、実際にはストリームを使用する利点が得られません。

* 返されるストリームは utf-8 でエンコードされたバイトストリームです。他のエンコーディングのストリームが必要な場合は、テキストのトランスコーディング用の変換ストリームを提供する [iconv-lite](https://www.npmjs.com/package/iconv-lite) のようなプロジェクトを参照してください。

---

## 使用法 {/*usage*/}

### React ツリーを静的 HTML として Node.js の Readable ストリームにレンダーする {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

`renderToStaticNodeStream` を呼び出して、サーバからのレスポンスにパイプできる [Node.js の Readable ストリーム](https://nodejs.org/api/stream.html#readable-streams)を取得します。

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

このストリームは、React コンポーネントの非インタラクティブな初期 HTML 出力を生成します。

<Pitfall>

このメソッドは、**ハイドレーションができない非インタラクティブな HTML をレンダーします**。これは、React をシンプルな静的ページジェネレータとして使用したい場合や、メールのような完全に静的なコンテンツをレンダーする場合に有用です。

インタラクティブなアプリでは、サーバ上で [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) を、クライアント上で [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を使用すべきです。

</Pitfall>
