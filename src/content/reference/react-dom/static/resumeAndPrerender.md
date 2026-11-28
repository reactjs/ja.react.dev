---
title: resumeAndPrerender
---

<Intro>

`resumeAndPrerender` は [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) を用いて、プリレンダーされた React ツリーの静的な HTML 文字列へのレンダーを継続します。

```js
const {prelude, postponed} = await resumeAndPrerender(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

この API は [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) に依存しています。Node.js では、代わりに [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream) を使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `resumeAndPrerender(reactNode, postponedState, options?)` {/*resumeandprerender*/}

`resumeAndPrerender` を呼び出して、プリレンダーされた React ツリーの静的な HTML 文字列へのレンダーを継続します。

```js
import { resumeAndPrerender } from 'react-dom/static';
import { getPostponedState } from 'storage';

async function handler(request, response) {
  const postponedState = getPostponedState(request);
  const { prelude } = await resumeAndPrerender(<App />, postponedState, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

クライアント側では、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出して、サーバで生成された HTML をインタラクティブにします。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: `prerender`（または以前の `resumeAndPrerender`）を呼び出したときに渡した React ノード。例えば `<App />` のような JSX 要素です。これはドキュメント全体を表すことが期待されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。
* `postponedState`: [プリレンダー API](/reference/react-dom/static/index) が返した内部構造非公開の `postpone` オブジェクト。保存しておいた場所（redis、ファイル、S3 など）から読み込んだものを渡します。
* **省略可能** `options`: ストリーミングに関するオプションを含むオブジェクト。
  * **省略可能** `signal`: [サーバレンダリングを中止](#aborting-server-rendering)してクライアントで残りをレンダーするために使用できる [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。
  * **省略可能** `onBrowserBailout`: [`browser()`](/reference/react-dom/browser) によるサーバレンダリングの中断が起き、ブラウザ側で置き換えるためのサスペンスフォールバックが残った時点で React が呼び出すコールバック。ブラウザのみでレンダーされるという内容の `Error` と、`componentStack` を含む `errorInfo` オブジェクトを受け取ります。`browser` に理由が渡されていた場合、その理由は `error.cause` から取得できます。デフォルトでは React は何も行いません。[ブラウザオンリーのレンダー発生をサーバ上で報告する方法を参照](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)。
  * **省略可能** `onError`: サーバエラーが発生するたびに発火するコールバック。[復帰可能なエラー](#recovering-from-errors-outside-the-shell)の場合も[そうでないエラー](#recovering-from-errors-inside-the-shell)の場合もあります。デフォルトでは `console.error` のみを呼び出します。これを上書きして[クラッシュレポートをログに記録する](#logging-crashes-on-the-server)場合でも `console.error` を呼び出すようにしてください。

#### 返り値 {/*returns*/}

`prerender` は Promise を返します。
- レンダーが成功した場合、Promise は以下を含んだオブジェクトに解決 (resolve) されます。
  - `prelude`: HTML の [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。このストリームを使ってレスポンスを送信したり、ストリームを文字列に一括して読み出したりできます。
  - `postponed`: `prerender` が中断された場合に、[`resume`](/reference/react-dom/server/resume) または [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) に渡すことができる、JSON シリアライズ可能な内部構造非公開のオブジェクト。
- レンダーが失敗した場合は、Promise は拒否 (reject) されます。[これを使用してフォールバックシェルを出力します](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)。

#### 注意点 {/*caveats*/}

プリレンダー中に `nonce` オプションは利用できません。nonce はリクエストごとに一意である必要があり、[CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) でアプリケーションを保護するために nonce を使用する場合、プリレンダー自体に nonce 値を含めることは不適切かつ危険です。

<Note>

### `resumeAndPrerender` をいつ使うのか {/*when-to-use-prerender*/}

静的 API である `resumeAndPrerender` は、静的なサーバサイド生成 (server-side generation; SSG) に使用するものです。`renderToString` とは異なり、`resumeAndPrerender` はすべてのデータの読み込みが完了するまで待機してから解決されます。このため、サスペンスを使用して取得するデータを含む、ページ全体の静的な HTML を生成するのに適しています。読み込み中のコンテンツをストリーミングする場合は、[renderToReadableStream](/reference/react-dom/server/renderToReadableStream) のようなストリーミング付きサーバサイドレンダリング (SSR) API を使用してください。

部分プリレンダリング (partial pre-rendering) をサポートするため、`resumeAndPrerender` は中断可能です。あとで別の `resumeAndPrerender` でプリレンダーを継続することも、`resume` で再開することも可能です。

</Note>

---

## 使用法 {/*usage*/}

### さらに学ぶ {/*further-reading*/}

`resumeAndPrerender` は [`prerender`](/reference/react-dom/static/prerender) と同様に動作しますが、以前に開始されて中断されたプリレンダー処理を継続するために使用できます。
プリレンダーされたツリーの再開についての詳細は、[`resume` のドキュメント](/reference/react-dom/server/resume#resuming-a-prerender)を参照してください。
