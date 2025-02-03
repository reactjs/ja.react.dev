---
title: prerender
---

<Intro>

`prerender` は React ツリーを [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) を用いて静的な HTML 文字列にレンダーします。

```js
const {prelude} = await prerender(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

この API は [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) に依存しています。Node.js では、代わりに [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) を使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `prerender(reactNode, options?)` {/*prerender*/}

`prerender` を呼び出して、アプリを静的な HTML にレンダーします。

```js
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

クライアント側では、このようにサーバ生成された HTML を操作可能にするために [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を用います。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: HTML へとレンダーしたい React ノード。例えば、`<App />` のような JSX 要素です。これはドキュメント全体を表すことが期待されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。

* **省略可能** `options`: 静的生成関連のオプションが含まれたオブジェクト。
  * **省略可能** `bootstrapScriptContent`: 指定された場合、この文字列がインラインの `<script>` タグ内に配置されます。
  * **省略可能** `bootstrapScripts`: ページ上に出力する `<script>` タグに対応する URL 文字列の配列。これを使用して、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す `<script>` を含めます。クライアントで React をまったく実行したくない場合は省略します。
  * **省略可能** `bootstrapModules`: `bootstrapScripts` と同様ですが、代わりに [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) を出力します。
  * **省略可能** `identifierPrefix`: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) にも同じプレフィックスを渡す必要があります。
  * **省略可能** `namespaceURI`: このストリームのルート[ネームスペース URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) 文字列。デフォルトでは通常の HTML です。SVG の場合は `'http://www.w3.org/2000/svg'`、MathML の場合は `'http://www.w3.org/1998/Math/MathML'` を渡します。
  * **省略可能** `onError`: サーバエラーが発生するたびに発火するコールバック。[復帰可能なエラー](#recovering-from-errors-outside-the-shell)の場合も[そうでないエラー](#recovering-from-errors-inside-the-shell)の場合もあります。デフォルトでは `console.error` のみを呼び出します。これを上書きして[クラッシュレポートをログに記録する](#logging-crashes-on-the-server)場合でも `console.error` を呼び出すようにしてください。また、シェルが出力される前に[ステータスコードを調整する](#setting-the-status-code)ためにも使用できます。
  * **省略可能** `progressiveChunkSize`: チャンクのバイト数。[デフォルトの推論方法についてはこちらを参照してください](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)。
  * **省略可能** `signal`: [サーバでのレンダーを中止](#aborting-server-rendering)してクライアントで残りをレンダーするために使用できる [abort signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)。

#### 返り値 {/*returns*/}

`prerender` は Promise を返します。
- レンダーが成功した場合、プロミスは以下を含んだオブジェクトに解決 (resolve) されます。
  - `prelude`: HTML の [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)。このストリームを使ってレスポンスを送信したり、ストリームを文字列に一括して読み出したりできます。
- レンダーが失敗した場合は、Promise は拒否 (reject) されます。[これを使用してフォールバックシェルを出力します](#recovering-from-errors-inside-the-shell)。




<Note>

### `prerender` をいつ使うのか {/*when-to-use-prerender*/}

`prerender` API は、静的なサーバサイド生成 (server-side generation; SSG) に使用するものです。`renderToString` とは異なり、`prerender` はすべてのデータの読み込みが完了するまで待機してから解決されます。このため、サスペンスを使用して取得するデータを含む、ページ全体の静的な HTML を生成するのに適しています。読み込み中のコンテンツをストリーミングする場合は、[renderToReadableStream](/reference/react-dom/server/renderToReadableStream) のようなストリーミング付きサーバサイドレンダリング (SSR) API を使用してください。

</Note>

---

## 使用法 {/*usage*/}

### React ツリーを静的な HTML としてストリームにレンダーする {/*rendering-a-react-tree-to-a-stream-of-static-html*/}

`prerender` を呼び出して、React ツリーを静的な HTML として[読み取り可能な Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) にレンダーします。

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { prerender } from 'react-dom/static';

async function handler(request) {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

<CodeStep step={1}>ルートコンポーネント</CodeStep> と <CodeStep step={2}>ブートストラップ `<script>` パス</CodeStep>のリストを指定する必要があります。ルートコンポーネントは、**ルートの `<html>` タグを含んだドキュメント全体**を返すようにします。

例えば以下のような形になるでしょう。

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React は [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) とあなたが指定した<CodeStep step={2}>ブートストラップ `<script>` タグ</CodeStep>を結果の HTML ストリームに注入します。

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML from your components ... -->
</html>
<script src="/main.js" async=""></script>
```

クライアント側では、ブートストラップスクリプトは [`hydrateRoot` を呼び出して `document` 全体のハイドレーションを行う](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)必要があります。

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

これにより、サーバで生成された静的な HTML にイベントリスナが追加され、操作可能になります。

<DeepDive>

#### ビルド出力から CSS と JS のアセットパスを読み取る {/*reading-css-and-js-asset-paths-from-the-build-output*/}

ビルド後に、最終的なアセット URL（JavaScript や CSS ファイルなど）にはよくハッシュ化が行われます。例えば、`styles.css` が `styles.123456.css` になることがあります。静的なアセットのファイル名をハッシュ化することで、同じアセットがビルドごとに異なるファイル名になることが保証されます。これが有用なのは、ある特定の名前を持つファイルの内容が不変になり、静的なアセットの長期的なキャッシングを安全に行えるようになるためです。

しかし、ビルド後までアセット URL が分からない場合、それらをソースコードに含めることができません。例えば、先ほどのように JSX に `"/styles.css"` をハードコーディングする方法は動作しません。ソースコードにそれらを含めないようにするため、ルートコンポーネントが、props 経由で渡されたマップから実際のファイル名を読み取るようにすることができます。

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>My app</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

サーバ上では、`<App assetMap={assetMap} />` のようにレンダーし、アセット URL を含む `assetMap` を渡します。

```js {1-5,8,9}
// You'd need to get this JSON from your build tooling, e.g. read it from the build output.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

サーバで `<App assetMap={assetMap} />` のようにレンダーしているので、クライアントでも `assetMap` を使ってレンダーしてハイドレーションエラーを避ける必要があります。このためには以下のように `assetMap` をシリアライズしてクライアントに渡します。

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const {prelude} = await prerender(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(prelude, {
    headers: { 'content-type': 'text/html' },
  });
}
```

上記の例では、`bootstrapScriptContent` オプションを使って`<script>` タグを追加して、クライアント上でグローバル `window.assetMap` 変数をセットしています。これにより、クライアントのコードが同じ `assetMap` を読み取れるようになります。

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

クライアントとサーバの両方が props として同じ `assetMap` を使って `App` をレンダーするため、ハイドレーションエラーは発生しません。

</DeepDive>

---

### React ツリーを静的な HTML 文字列にレンダーする {/*rendering-a-react-tree-to-a-string-of-static-html*/}

`prerender` を呼び出して、アプリを静的な HTML 文字列にレンダーします。

```js
import { prerender } from 'react-dom/static';

async function renderToString() {
  const {prelude} = await prerender(<App />, {
    bootstrapScripts: ['/main.js']
  });
  
  const reader = prelude.getReader();
  let content = '';
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      return content;
    }
    content += Buffer.from(value).toString('utf8');
  }
}
```

これにより、React コンポーネントの、操作できない初期 HTML が生成されます。クライアントでは、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出してこのサーバで生成された HTML に対する*ハイドレーション*を行い、操作可能にする必要があります。

---

### 全データの読み込みを待機 {/*waiting-for-all-data-to-load*/}

`prerender` は、静的な HTML 生成を行って解決する前に、全データがロードされるのを待機します。例えば以下のようなプロフィールページがあり、カバー、フレンド・写真が含まれたサイドバー、投稿のリストを表示しているところを考えましょう。

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

ここで、`<Posts />` のデータを読み込むのに時間がかかるとしましょう。理想的には、投稿の読み込みを待機して、HTML に含めてしまいたいとします。これを実現するには、サスペンスを使ってそのデータをサスペンドします。`prerender` はそのサスペンドされているコンテンツの読み込みを待機してから、静的 HTML へと解決します。

<Note>

**サスペンスコンポーネントをアクティブ化できるのはサスペンス対応のデータソースだけです**。これには以下が含まれます：

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) や [Next.js](https://nextjs.org/docs/getting-started/react-essentials) のようなサスペンス対応のフレームワークでのデータフェッチ
- [`lazy`](/reference/react/lazy) を用いたコンポーネントコードの遅延ロード
- [`use`](/reference/react/use) を用いたプロミス (Promise) からの値の読み取り

サスペンスはエフェクトやイベントハンドラ内でデータフェッチが行われた場合にはそれを**検出しません**。

上記の `Posts` コンポーネントで実際にデータをロードする方法は、使用するフレームワークによって異なります。サスペンス対応のフレームワークを使用している場合、詳細はデータフェッチに関するドキュメンテーション内に記載されているはずです。

使い方の規約のある (opinionated) フレームワークを使用せずにサスペンスを使ったデータフェッチを行うことは、まだサポートされていません。サスペンス対応のデータソースを実装するための要件はまだ不安定であり、ドキュメント化されていません。データソースをサスペンスと統合するための公式な API は、React の将来のバージョンでリリースされる予定です。

</Note>

---

## トラブルシューティング {/*troubleshooting*/}

### アプリ全体がレンダーされるまでストリームが始まらない {/*my-stream-doesnt-start-until-the-entire-app-is-rendered*/}

<<<<<<< HEAD
`prerender` の返り値は解決する前に、全サスペンスバウンダリが解決することも含む、アプリ全体のレンダーの終了を待機します。これは事前静的サイト生成 (SSG) のために設計されているものであり、コンテンツを読み込みながらのストリーミングをサポートしません。
=======
The `prerender` response waits for the entire app to finish rendering, including waiting for all Suspense boundaries to resolve, before resolving. It is designed for static site generation (SSG) ahead of time and does not support streaming more content as it loads. 
>>>>>>> 6fc98fffdaad3b84e6093d1eb8def8f2cedeee16

コンテンツを読み込みながらストリームしたい場合は、サーバレンダー API である [renderToReadableStream](/reference/react-dom/server/renderToReadableStream) などを使用してください。
 