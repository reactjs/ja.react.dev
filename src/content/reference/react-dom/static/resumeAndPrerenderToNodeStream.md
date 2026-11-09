---
title: resumeAndPrerenderToNodeStream
---

<Intro>

`resumeAndPrerenderToNodeStream` は [Node.js ストリーム](https://nodejs.org/api/stream.html)を用いて、プリレンダーされた React ツリーの静的な HTML 文字列へのレンダーを継続します。

```js
const {prelude, postponed} = await resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

この API は Node.js 専用です。Deno やモダンエッジランタイムのような [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) 環境では、代わりに [`prerender`](/reference/react-dom/static/prerender) を使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `resumeAndPrerenderToNodeStream(reactNode, postponedState, options?)` {/*resumeandprerendertolnodestream*/}

`resumeAndPrerenderToNodeStream` を呼び出して、プリレンダーされた React ツリーの静的な HTML 文字列へのレンダーを継続します。

```js
import { resumeAndPrerenderToNodeStream } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, writable) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerenderToNodeStream(<App />, JSON.parse(postponedState));
  prelude.pipe(writable);
}
```

クライアント側では、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出して、サーバで生成された HTML をインタラクティブにします。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: `prerender`（または以前の `resumeAndPrerenderToNodeStream`）を呼び出したときに渡した React ノード。例えば `<App />` のような JSX 要素です。これはドキュメント全体を表すことが期待されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。
* `postponedState`: [プリレンダー API](/reference/react-dom/static/index) が返した内部構造非公開の `postpone` オブジェクト。保存しておいた場所（redis、ファイル、S3 など）から読み込んだものを渡します。
* **省略可能** `options`: ストリーミングに関するオプションを含むオブジェクト。
  * **省略可能** `signal`: [サーバレンダリングを中止](#aborting-server-rendering)してクライアントで残りをレンダーするために使用できる [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。
  * **省略可能** `onBrowserBailout`: [`browser()`](/reference/react-dom/browser) によるサーバレンダリングの中断が起き、ブラウザ側で置き換えるためのサスペンスフォールバックが残った時点で React が呼び出すコールバック。ブラウザのみでレンダーされるという内容の `Error` と、`componentStack` を含む `errorInfo` オブジェクトを受け取ります。`browser` に理由が渡されていた場合、その理由は `error.cause` から取得できます。デフォルトでは React は何も行いません。[ブラウザオンリーのレンダー発生をサーバ上で報告する方法を参照](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)。
  * **省略可能** `onError`: サーバエラーが発生するたびに発火するコールバック。[復帰可能なエラー](#recovering-from-errors-outside-the-shell)の場合も[そうでないエラー](#recovering-from-errors-inside-the-shell)の場合もあります。デフォルトでは `console.error` のみを呼び出します。これを上書きして[クラッシュレポートをログに記録する](#logging-crashes-on-the-server)場合でも `console.error` を呼び出すようにしてください。

#### 返り値 {/*returns*/}

`resumeAndPrerenderToNodeStream` は Promise を返します。
- レンダーが成功した場合、Promise は以下を含んだオブジェクトに解決 (resolve) されます。
  - `prelude`: HTML の [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。このストリームを使ってレスポンスを送信したり、ストリームを文字列に一括して読み出したりできます。
  - `postponed`: `resumeAndPrerenderToNodeStream` が中断された場合に、[`resumeToNodeStream`](/reference/react-dom/server/resume) または [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) に渡すことができる、JSON シリアライズ可能な内部構造非公開のオブジェクト。
- レンダーが失敗した場合は、Promise は拒否 (reject) されます。[これを使用してフォールバックシェルを出力します](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)。

#### 注意点 {/*caveats*/}

プリレンダー中に `nonce` オプションは利用できません。nonce はリクエストごとに一意である必要があり、[CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) でアプリケーションを保護するために nonce を使用する場合、プリレンダー自体に nonce 値を含めることは不適切かつ危険です。

<Note>

### `resumeAndPrerenderToNodeStream` をいつ使うのか {/*when-to-use-prerender*/}

静的 API である `resumeAndPrerenderToNodeStream` は、静的なサーバサイド生成 (server-side generation; SSG) に使用するものです。`renderToString` とは異なり、`resumeAndPrerenderToNodeStream` はすべてのデータの読み込みが完了するまで待機してから解決されます。このため、サスペンスを使用して取得するデータを含む、ページ全体の静的な HTML を生成するのに適しています。読み込み中のコンテンツをストリーミングする場合は、[renderToReadableStream](/reference/react-dom/server/renderToReadableStream) のようなストリーミング付きサーバサイドレンダリング (SSR) API を使用してください。

部分プリレンダリング (partial pre-rendering) をサポートするため、`resumeAndPrerenderToNodeStream` は中断可能です。あとで別の `resumeAndPrerenderToNodeStream` でプリレンダーを継続することも、`resume` で再開することも可能です。

</Note>

---

## 使用法 {/*usage*/}

### さらに学ぶ {/*further-reading*/}

`resumeAndPrerenderToNodeStream` は [`prerender`](/reference/react-dom/static/prerender) と同様に動作しますが、以前に開始されて中断されたプリレンダー処理を継続するために使用できます。
プリレンダーされたツリーの再開についての詳細は、[`resume` のドキュメント](/reference/react-dom/server/resume#resuming-a-prerender)を参照してください。

