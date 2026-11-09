---
title: resumeToPipeableStream
---

<Intro>

`resumeToPipeableStream` はプリレンダーされた React ツリーを、パイプ可能な [Node.js ストリーム](https://nodejs.org/api/stream.html)にストリーミングします。

```js
const {pipe, abort} = await resumeToPipeableStream(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

この API は Node.js 専用です。Deno やモダンなエッジランタイムなどの [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) を用いる環境では、[`resume`](/reference/react-dom/server/renderToReadableStream) を代わりに使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `resumeToPipeableStream(node, postponed, options?)` {/*resume-to-pipeable-stream*/}

`resumeToPipeableStream` を呼び出して、プリレンダーされた React ツリーの HTML としてのレンダーを再開し、[Node.js ストリーム](https://nodejs.org/api/stream.html#writable-streams)に出力します。

```js
import { resumeToPipeableStream } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, response) {
  const postponed = await getPostponedState(request);
  const {pipe} = resumeToPipeableStream(<App />, postponed, {
    onShellReady: () => {
      pipe(response);
    }
  });
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: `prerender` を呼び出したときに渡した React ノード。例えば `<App />` のような JSX 要素です。これはドキュメント全体を表すことが期待されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。
* `postponedState`: [プリレンダー API](/reference/react-dom/static/index) が返した内部構造非公開の `postpone` オブジェクト。保存しておいた場所（redis、ファイル、S3 など）から読み込んだものを渡します。
* **省略可能** `options`: ストリーミングに関するオプションを含むオブジェクト。
  * **省略可能** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) においてスクリプトを許可するための [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) 文字列。
  * **省略可能** `onAllReady`: シェルとすべての追加コンテンツの両方を含むすべてのレンダーが完了したときに呼び出されるコールバック。クローラや静的生成向けの場合に、`onShellReady` の代わりにここで `pipe` を呼び出せます。ストリームには最終的な HTML が含まれるようになります。
  * **省略可能** `onBrowserBailout`: [`browser()`](/reference/react-dom/browser) によるサーバレンダリングの中断が起き、ブラウザ側で置き換えるためのサスペンスフォールバックが残った時点で React が呼び出すコールバック。ブラウザのみでレンダーされるという内容の `Error` と、`componentStack` を含む `errorInfo` オブジェクトを受け取ります。`browser` に理由が渡されていた場合、その理由は `error.cause` から取得できます。デフォルトでは React は何も行いません。[ブラウザオンリーのレンダー発生をサーバ上で報告する方法を参照](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)。
  * **省略可能** `onError`: サーバエラーが発生するたびに発火するコールバック。[復帰可能なエラー](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell)の場合も[そうでないエラー](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)の場合もあります。デフォルトでは `console.error` のみを呼び出します。これを上書きして[クラッシュレポートをログに記録する](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server)場合でも `console.error` を呼び出すようにしてください。
  * **省略可能** `onShellReady`: [シェル](#specifying-what-goes-into-the-shell)のレンダーが完了した直後に呼び出されるコールバック。ここで `pipe` を呼び出してストリーミングを開始できます。React はシェルを送信した後に、[追加コンテンツ](#streaming-more-content-as-it-loads)と、HTML のローディングフォールバックを追加コンテンツで置換するためのインライン `<script>` タグをストリーミングします。
  * **省略可能** `onShellError`: シェルのレンダー中にエラーが発生すると呼び出されるコールバック。引数としてエラーを受け取ります。ストリームからのバイト列送信はまだ起きておらず、`onShellReady` や `onAllReady` はコールされなくなるため、[フォールバック用の HTML シェルを出力](#recovering-from-errors-inside-the-shell)するか、prelude を使用できます。


#### 返り値 {/*returns*/}

`resumeToPipeableStream` は以下の 2 つのメソッドを含んだオブジェクトを返します。

* `pipe`: HTML を指定された [Node.js の Writable ストリーム](https://nodejs.org/api/stream.html#writable-streams)に出力します。`pipe` の呼び出しは、ストリーミングを有効にしたい場合は `onShellReady` で、クローラや静的生成向けの出力を行いたい場合は `onAllReady` で行ってください。
* `abort`: [サーバでのレンダーを中止](#aborting-server-rendering)してクライアントで残りをレンダーするために使用します。

#### 注意点 {/*caveats*/}

- `resumeToPipeableStream` は `bootstrapScripts`、`bootstrapScriptContent`、`bootstrapModules` のオプションを受け付けません。代わりに、`postponedState` を生成する `prerender` の呼び出しにこれらのオプションを渡す必要があります。ブートストラップ用のコンテンツを書き込み可能ストリームに手動で注入することもできます。
- `resumeToPipeableStream` は `identifierPrefix` を受け付けません。プレフィックスは `prerender` と `resumeToPipeableStream` で同じである必要があるためです。
- プリレンダーには `nonce` を渡せないため、`resumeToPipeableStream` に `nonce` を渡すのは、プリレンダーにスクリプトを渡していない場合だけにしてください。
- `resumeToPipeableStream` は、プリレンダーが完了していないコンポーネントが見つかるまで、ルートから再レンダーします。完全にプリレンダーされたコンポーネント（そのコンポーネントと子のプリレンダーがすべて完了したもの）だけが、まるごとスキップされます。

## 使用法 {/*usage*/}

### さらに学ぶ {/*further-reading*/}

再開は `renderToReadableStream` と同様に動作します。その他の例については、[`renderToReadableStream` の使用法のセクション](/reference/react-dom/server/renderToReadableStream#usage)を参照してください。
`prerenderToNodeStream` に特化した使用例は、[`prerender` の使用法のセクション](/reference/react-dom/static/prerender#usage)にあります。