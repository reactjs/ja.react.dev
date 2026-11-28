---
title: resume
---

<Intro>

`resume` はプリレンダーされた React ツリーを[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) にストリーミングします。

```js
const stream = await resume(reactNode, postponedState, options?)
```

</Intro>

<InlineToc />

<Note>

この API は [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) に依存しています。Node.js では、代わりに [`resumeToNodeStream`](/reference/react-dom/server/renderToPipeableStream) を使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `resume(node, postponedState, options?)` {/*resume*/}

`resume` を呼び出して、プリレンダーされた React ツリーの HTML としてのレンダーを再開し、[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) に出力します。

```js
import { resume } from 'react-dom/server';
import {getPostponedState} from './storage';

async function handler(request, writable) {
  const postponed = await getPostponedState(request);
  const resumeStream = await resume(<App />, postponed);
  return resumeStream.pipeTo(writable)
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: `prerender` を呼び出したときに渡した React ノード。例えば `<App />` のような JSX 要素です。これはドキュメント全体を表すことが期待されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。
* `postponedState`: [プリレンダー API](/reference/react-dom/static/index) が返した内部構造非公開の `postpone` オブジェクト。保存しておいた場所（redis、ファイル、S3 など）から読み込んだものを渡します。
* **省略可能** `options`: ストリーミングに関するオプションを含むオブジェクト。
  * **省略可能** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) においてスクリプトを許可するための [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) 文字列。
  * **省略可能** `signal`: [サーバレンダリングを中止](#aborting-server-rendering)してクライアントで残りをレンダーするために使用できる [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。
  * **省略可能** `onBrowserBailout`: [`browser()`](/reference/react-dom/browser) によるサーバレンダリングの中断が起き、ブラウザ側で置き換えるためのサスペンスフォールバックが残った時点で React が呼び出すコールバック。ブラウザのみでレンダーされるという内容の `Error` と、`componentStack` を含む `errorInfo` オブジェクトを受け取ります。`browser` に理由が渡されていた場合、その理由は `error.cause` から取得できます。デフォルトでは React は何も行いません。[ブラウザオンリーのレンダー発生をサーバ上で報告する方法を参照](/reference/react-dom/browser#reporting-browser-only-rendering-on-the-server)。
  * **省略可能** `onError`: サーバエラーが発生するたびに発火するコールバック。[復帰可能なエラー](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-outside-the-shell)の場合も[そうでないエラー](/reference/react-dom/server/renderToReadableStream#recovering-from-errors-inside-the-shell)の場合もあります。デフォルトでは `console.error` のみを呼び出します。これを上書きして[クラッシュレポートをログに記録する](/reference/react-dom/server/renderToReadableStream#logging-crashes-on-the-server)場合でも `console.error` を呼び出すようにしてください。


#### 返り値 {/*returns*/}

`resume` は Promise を返します。

- `resume` が[シェル](/reference/react-dom/server/renderToReadableStream#specifying-what-goes-into-the-shell)の生成に成功した場合、Promise は[書き込み可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) にパイプできる[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) に解決 (resolve) されます。
- シェルでエラーが発生した場合、Promise はそのエラーで拒否 (reject) されます。

返されるストリームには追加のプロパティがあります。

* `allReady`: すべてのレンダーが完了したときに解決される Promise。[クローラや静的生成向け](/reference/react-dom/server/renderToReadableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation)の場合、レスポンスを返す前に `stream.allReady` を await できます。これを行うとプログレッシブなローディングがなくなり、ストリームには最終的な HTML が含まれるようになります。

#### 注意点 {/*caveats*/}

- `resume` は `bootstrapScripts`、`bootstrapScriptContent`、`bootstrapModules` のオプションを受け付けません。代わりに、`postponedState` を生成する `prerender` の呼び出しにこれらのオプションを渡す必要があります。ブートストラップ用のコンテンツを書き込み可能ストリームに手動で注入することもできます。
- `resume` は `identifierPrefix` を受け付けません。プレフィックスは `prerender` と `resume` で同じである必要があるためです。
- プリレンダーには `nonce` を渡せないため、`resume` に `nonce` を渡すのは、プリレンダーにスクリプトを渡していない場合だけにしてください。
- `resume` は、プリレンダーが完了していないコンポーネントが見つかるまで、ルートから再レンダーします。完全にプリレンダーされたコンポーネント（そのコンポーネントと子のプリレンダーがすべて完了したもの）だけが、まるごとスキップされます。

## 使用法 {/*usage*/}

### プリレンダーの再開 {/*resuming-a-prerender*/}

<Sandpack>

```js src/App.js hidden
```

```html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <iframe id="container"></iframe>
</body>
</html>
```

```js src/index.js
import {
  flushReadableStreamToFrame,
  getUser,
  Postponed,
  sleep,
} from "./demo-helpers";
import { StrictMode, Suspense, use, useEffect } from "react";
import { prerender } from "react-dom/static";
import { resume } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";

function Header() {
  return <header>Me and my descendants can be prerendered</header>;
}

const { promise: cookies, resolve: resolveCookies } = Promise.withResolvers();

function Main() {
  const { sessionID } = use(cookies);
  const user = getUser(sessionID);

  useEffect(() => {
    console.log("reached interactivity!");
  }, []);

  return (
    <main>
      Hello, {user.name}!
      <button onClick={() => console.log("hydrated!")}>
        Clicking me requires hydration.
      </button>
    </main>
  );
}

function Shell({ children }) {
  // In a real app, this is where you would put your html and body.
  // We're just using tags here we can include in an existing body for demonstration purposes
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}

function App() {
  return (
    <Shell>
      <Suspense fallback="loading header">
        <Header />
      </Suspense>
      <Suspense fallback="loading main">
        <Main />
      </Suspense>
    </Shell>
  );
}

async function main(frame) {
  // Layer 1
  const controller = new AbortController();
  const prerenderedApp = prerender(<App />, {
    signal: controller.signal,
    onError(error) {
      if (error instanceof Postponed) {
      } else {
        console.error(error);
      }
    },
  });
  // We're immediately aborting in a macrotask.
  // Any data fetching that's not available synchronously, or in a microtask, will not have finished.
  setTimeout(() => {
    controller.abort(new Postponed());
  });

  const { prelude, postponed } = await prerenderedApp;
  await flushReadableStreamToFrame(prelude, frame);

  // Layer 2
  // Just waiting here for demonstration purposes.
  // In a real app, the prelude and postponed state would've been serialized in Layer 1 and Layer would deserialize them.
  // The prelude content could be flushed immediated as plain HTML while
  // React is continuing to render from where the prerender left off.
  await sleep(2000);

  // You would get the cookies from the incoming HTTP request
  resolveCookies({ sessionID: "abc" });

  const stream = await resume(<App />, postponed);

  await flushReadableStreamToFrame(stream, frame);

  // Layer 3
  // Just waiting here for demonstration purposes.
  await sleep(2000);

  hydrateRoot(frame.contentWindow.document, <App />);
}

main(document.getElementById("container"));

```

```js src/demo-helpers.js
export async function flushReadableStreamToFrame(readable, frame) {
  const document = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    const partialHTML = decoder.decode(value, {stream: true});
    document.write(partialHTML);
  }

  document.write(decoder.decode());
}

// This doesn't need to be an error.
// You can use any other means to check if an error during prerender was
// from an intentional abort or a real error.
export class Postponed extends Error {}

// We're just hardcoding a session here.
export function getUser(sessionID) {
  return {
    name: "Alice",
  };
}

export function sleep(timeoutMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeoutMS);
  });
}
```

</Sandpack>

### さらに学ぶ {/*further-reading*/}

再開は `renderToReadableStream` と同様に動作します。その他の例については、[`renderToReadableStream` の使用法のセクション](/reference/react-dom/server/renderToReadableStream#usage)を参照してください。
`prerender` に特化した使用例は、[`prerender` の使用法のセクション](/reference/react-dom/static/prerender#usage)にあります。
