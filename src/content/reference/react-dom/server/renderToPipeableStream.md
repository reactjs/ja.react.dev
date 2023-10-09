---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` は React ツリーをパイプ可能な [Node.js ストリーム](https://nodejs.org/api/stream.html)にレンダーします。

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

この API は Node.js 専用です。Deno やモダンなエッジランタイムなどの [Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) を用いる環境では、[`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) を代わりに使用してください。

</Note>

---

## リファレンス {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

`renderToPipeableStream` を呼び出して、React ツリーを HTML として [Node.js ストリーム](https://nodejs.org/api/stream.html#writable-streams)にレンダーします。

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

クライアント側では、このようにサーバ生成された HTML を操作可能にするために [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を用います。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: HTML へとレンダーしたい React ノード。例えば、`<App />` のような JSX 要素です。これはドキュメント全体を表すことが期待されているため、`App` コンポーネントは `<html>` タグをレンダーする必要があります。

* **省略可能** `options`: ストリーム関連のオプションが含まれたオブジェクト。
  * **省略可能** `bootstrapScriptContent`: 指定された場合、この文字列がインラインの `<script>` タグ内に配置されます。
  * **省略可能** `bootstrapScripts`: ページ上に出力する `<script>` タグに対応する URL 文字列の配列。これを使用して、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す `<script>` を含めます。クライアントで React をまったく実行したくない場合は省略します。
  * **省略可能** `bootstrapModules`: `bootstrapScripts` と同様ですが、代わりに [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) を出力します。
  * **省略可能** `identifierPrefix`: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) にも同じプレフィックスを渡す必要があります。
  * **省略可能** `namespaceURI`: このストリームのルート[ネームスペース URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) 文字列。デフォルトでは通常の HTML です。SVG の場合は `'http://www.w3.org/2000/svg'`、MathML の場合は `'http://www.w3.org/1998/Math/MathML'` を渡します。
  * **省略可能** `nonce`: [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) を用いてスクリプトを許可するための [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) 文字列。
  * **省略可能** `onAllReady`: [シェル](#specifying-what-goes-into-the-shell)とすべての追加[コンテンツ](#streaming-more-content-as-it-loads)の両方を含むすべてのレンダーが完了したときに呼び出されるコールバック。[クローラや静的生成向け](#waiting-for-all-content-to-load-for-crawlers-and-static-generation)の場合に、`onShellReady` の代わりに利用できます。ここからストリーミングを開始する場合、プログレッシブなローディングがなくなり、ストリームには最終的な HTML が含まれるようになります。
  * **省略可能** `onError`: サーバエラーが発生するたびに発火するコールバック。[復帰可能なエラー](#recovering-from-errors-outside-the-shell)の場合も[そうでないエラー](#recovering-from-errors-inside-the-shell)の場合もあります。デフォルトでは `console.error` のみを呼び出します。これを上書きして[クラッシュレポートをログに記録する](#logging-crashes-on-the-server)場合でも `console.error` を呼び出すようにしてください。また、シェルが出力される前に[ステータスコードを調整する](#setting-the-status-code)ためにも使用できます。
  * **省略可能** `onShellReady`: [初期シェル](#specifying-what-goes-into-the-shell)がレンダーされた直後に呼び出されるコールバック。ここで[ステータスコードのセット](#setting-the-status-code)を行い、`pipe` をコールしてストリーミングを開始できます。React はシェルを送信した後に、[追加コンテンツ](#streaming-more-content-as-it-loads)と、ローディングフォールバックをそれで置換するためのインライン `<script>` タグをストリーミングします。
  * **省略可能** `onShellError`: 初期シェルのレンダー中にエラーが発生すると呼び出されるコールバック。引数としてエラーを受け取ります。ストリームからのバイト列送信はまだ起きておらず、`onShellReady` や `onAllReady` はコールされなくなるため、[フォールバック用の HTML シェルを出力](#recovering-from-errors-inside-the-shell)することができます。
  * **省略可能** `progressiveChunkSize`: チャンクのバイト数。[デフォルトの推論方法についてはこちらを参照してください](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)。


#### 返り値 {/*returns*/}

`renderToPipeableStream` は以下の 2 つのメソッドを含んだオブジェクトを返します。

* `pipe`: HTML を [Node.js の Writable ストリーム](https://nodejs.org/api/stream.html#writable-streams)に出力します。`pipe` の呼び出しは、ストリーミングを有効にしたい場合は `onShellReady` で、クローラや静的生成向けの出力を行いたい場合は `onAllReady` で行ってください。
* `abort`: [サーバでのレンダーを中止](#aborting-server-rendering)してクライアントで残りをレンダーするために使用します。

---

## 使用法 {/*usage*/}

### React ツリーを HTML として Node.js ストリームにレンダーする {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

`renderToPipeableStream` を呼び出して、React ツリーを HTML として [Node.js ストリーム](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) にレンダーします。

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
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

これにより、サーバで生成された HTML にイベントリスナが追加され、操作可能になります。

<DeepDive>

#### ビルド出力から CSS と JS のアセットパスを読み取る {/*reading-css-and-js-asset-paths-from-the-build-output*/}

ビルド後に、最終的なアセット URL（JavaScript や CSS ファイルなど）にはよくハッシュ化が行われます。例えば、`styles.css` が `styles.123456.css` になることがあります。静的なアセットのファイル名をハッシュ化することで、同じアセットがビルドごとに異なるファイル名になることが保証されます。これが有用なのは、ある特定の名前を持つファイルの内容が不変になり、静的なアセットの長期的なキャッシングを安全に行えるようになるためです。

しかし、ビルド後までアセット URL が分からない場合、それらをソースコードに含めることができません。例えば、先ほどのように JSX に `"/styles.css"` をハードコーディングする方法は動作しません。ソースコードにそれらを含めないようにするため、ルートコンポーネントが、props 経由で渡されたマップから実際のファイル名を読み取るようにすることができます。

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
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

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

サーバで `<App assetMap={assetMap} />` のようにレンダーしているので、クライアントでも `assetMap` を使ってレンダーしてハイドレーションエラーを避ける必要があります。このためには以下のように `assetMap` をシリアライズしてクライアントに渡します。

```js {9-10}
// You'd need to get this JSON from your build tooling.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Careful: It's safe to stringify() this because this data isn't user-generated.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
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

### ロードが進むにつれてコンテンツをストリーミングする {/*streaming-more-content-as-it-loads*/}

ストリーミングにより、サーバ上ですべてのデータがロードされる前に、ユーザがコンテンツを見始められるようにすることができます。例えば以下のようなプロフィールページがあり、カバー、フレンド・写真が含まれたサイドバー、投稿のリストを表示しているところを考えましょう。

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

ここで、`<Posts />` のデータを読み込むのに時間がかかるとしましょう。理想的には、投稿の読み込みを待つことなく、プロフィールページの残りのコンテンツをユーザに表示したいでしょう。これを実現するには、[`Posts` を `<Suspense>` バウンダリで囲みます](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)。

```js {9,11}
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

これにより React に、`Posts` のデータが読み込まれる前に HTML をストリーミング開始するよう指示します。React はまず、ローディングフォールバック (`PostsGlimmer`) の HTML を送信します。次に `Posts` のデータ読み込みが完了したら、残りの HTML と、ローディングフォールバックをそれで置換するためのインライン `<script>` タグを送信します。ユーザから見ると、ページにはまず `PostsGlimmer` が表示され、後からそれが `Posts` に置き換わることになります。

さらに、より細かく読み込みシーケンスを制御するために[`<Suspense>` バウンダリをネストさせることもできます](/reference/react/Suspense#revealing-nested-content-as-it-loads)。

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

この例では、React はページのストリーミングをさらに素早く開始できます。最初にレンダーが完了している必要があるのは、`<Suspense>` バウンダリで囲まれていない `ProfileLayout` と `ProfileCover` だけです。`Sidebar`、`Friends`、`Photos` がデータを読み込む必要がある場合、React は `BigSpinner` のフォールバック HTML を代わりに送信します。その後、より多くのデータが利用可能になるにつれ、より多くのコンテンツが表示されていき、最終的にすべてが表示されます。

ストリーミングでは、ブラウザで React 自体が読み込まれるのを待つ必要も、アプリが操作可能になるのを待つ必要もありません。サーバからの HTML コンテンツは、あらゆる `<script>` タグが読み込まれる前にプログレッシブに表示されます。

[HTML ストリーミングの動作について詳しく読む](https://github.com/reactwg/react-18/discussions/37)

<Note>

**サスペンスコンポーネントをアクティブ化できるのはサスペンス対応のデータソースだけです**。これには以下が含まれます：

<<<<<<< HEAD
- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) や [Next.js](https://nextjs.org/docs/getting-started/react-essentials) のようなサスペンス対応のフレームワークでのデータフェッチ
- [`lazy`](/reference/react/lazy) を用いたコンポーネントコードの遅延ロード
=======
- Data fetching with Suspense-enabled frameworks like [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) and [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Lazy-loading component code with [`lazy`](/reference/react/lazy)
- Reading the value of a Promise with [`use`](/reference/react/use)
>>>>>>> 9aa84b19222838f38863ce4bd8f516dbfe193bbc

サスペンスはエフェクトやイベントハンドラ内でデータフェッチが行われた場合にはそれを**検出しません**。

上記の `Posts` コンポーネントで実際にデータをロードする方法は、使用するフレームワークによって異なります。サスペンス対応のフレームワークを使用している場合、詳細はデータフェッチに関するドキュメンテーション内に記載されているはずです。

使い方の規約のある (opinionated) フレームワークを使用せずにサスペンスを使ったデータフェッチを行うことは、まだサポートされていません。サスペンス対応のデータソースを実装するための要件はまだ不安定であり、ドキュメント化されていません。データソースをサスペンスと統合するための公式な API は、React の将来のバージョンでリリースされる予定です。

</Note>

---

### シェルに何を含めるかの指定 {/*specifying-what-goes-into-the-shell*/}

アプリの全 `<Suspense>` バウンダリより外にある部分のことを*シェル (shell)* と呼びます。

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

これが、ユーザに見える最初のローディング中状態を決定します。

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

もしルート部分でアプリ全体を `<Suspense>` バウンダリでラップしてしまうと、シェルとしてはそのスピナだけが含まれることになります。しかしこれはあまり快適なユーザ体験にはなりません。大きなスピナが画面に表示されることは、もう少しだけ待ってから実際のレイアウトを表示することよりも遅く不快に感じられるためです。したがって、`<Suspense>` 境界は適切に配置して、シェルが*ミニマルかつ完全*に感じられるように必要があるでしょう。例えばページレイアウト全体のスケルトンのようなものです。

シェル全体のレンダーが完了したときに `onShellReady` コールバックが呼び出されます。通常、ここでストリーミングを開始します。

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

`onShellReady` が呼び出される時点では、ネストされた `<Suspense>` バウンダリ内のコンポーネントはまだデータをロード中かもしれません。

---

### サーバ上でのクラッシュログの記録 {/*logging-crashes-on-the-server*/}

デフォルトでは、サーバ上のすべてのエラーはコンソールにログとして記録されます。この挙動をオーバーライドして、クラッシュレポートをログとして記録することができます。

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

カスタムの `onError` 実装を提供する場合、上記のようにエラーをコンソールにもログとして記録することを忘れないでください。

---

### シェル内のエラーからの復帰 {/*recovering-from-errors-inside-the-shell*/}

この例では、シェルとして `ProfileLayout`、`ProfileCover`、および `PostsGlimmer` が含まれています。

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

これらのコンポーネントをレンダーする際にエラーが発生した場合、React はクライアントに送信できる意味のある HTML を提供できません。最終手段として、`onShellError` をオーバーライドして、サーバレンダリングに依存しないフォールバック HTML を送信しましょう。

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

シェルの生成中にエラーが発生した場合、`onError` と `onShellError` の両方が発火します。エラーレポートには `onError` を使用し、フォールバックの HTML ドキュメントを送信するためには `onShellError` を使用します。フォールバック HTML はエラーページである必要はありません。代わりに、クライアントのみでアプリをレンダーするための代替シェルを含めることも可能です。

---

### シェル外のエラーからの復帰 {/*recovering-from-errors-outside-the-shell*/}

この例では、`<Posts />` コンポーネントは `<Suspense>` でラップされているため、シェルの一部では*ありません*。

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

`Posts` コンポーネントまたはその内部のどこかでエラーが発生した場合、React はそこからの[復帰を試みます](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)。

1. 最も近い `<Suspense>` バウンダリ (`PostsGlimmer`) のローディングフォールバックを HTML として出力します。
2. サーバ上で `Posts` のコンテンツをレンダーしようとするのを諦めます。
3. JavaScript コードがクライアント上でロードされると、React はクライアント上で `Posts` のレンダーを*再試行*します。

クライアント上で `Posts` のレンダーを再試行して*再度*失敗した場合、React はクライアント上でエラーをスローします。レンダー中にスローされる他のすべてのエラーと同様に、[最も近い親のエラーバウンダリ](/reference/react/Component#static-getderivedstatefromerror)がユーザにエラーをどのように提示するかを決定します。つまり、エラーが復帰不能であることが確定するまで、ユーザにはローディングインジケータが見えることになります。

クライアント上での `Posts` のレンダー再試行が成功した場合、サーバからのローディングフォールバックはクライアントでのレンダー出力で置き換えられます。ユーザにはサーバエラーが発生したことは分かりません。ただし、サーバの `onError` コールバックとクライアントの [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) コールバックが発火するため、エラーについて通知を受け取ることができます。

---

### ステータスコードの設定 {/*setting-the-status-code*/}

ストリーミングにはトレードオフも存在します。ユーザがコンテンツを早く見ることができるように、できるだけ早くページのストリーミングを開始したいでしょう。一方で、ストリーミングを開始すると、レスポンスのステータスコードを設定することができなくなります。

シェル（すべての `<Suspense>` バウンダリより上の部分）とそれ以外のコンテンツに[アプリを分割する](#specifying-what-goes-into-the-shell)ことで、この問題はすでに部分的に解決されています。シェルでエラーが発生した場合、`onShellError` コールバックが呼び出され、エラーのステータスコードをセットすることができます。それ以外の場合は、アプリがクライアント上で復帰できる可能性があるため、"OK" を送信できるのです。

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

シェルの*外側*（つまり `<Suspense>` バウンダリの内側）のコンポーネントでエラーが発生した場合、React はレンダーを停止しません。これは、`onError` コールバックは発火するものの、その後 `onShellError` ではなく `onShellReady` が発火することを意味します。これは[上記で説明したように](#recovering-from-errors-outside-the-shell)、React がそのエラーをクライアント上で復帰しようとするからです。

ただしお望みであれば、何らかのエラーが起きたという事実に基づいたステータスコードを設定することもできます。

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

これは、初期のシェルコンテンツの生成中に既にシェルの外側で発生したエラーが捕捉できるだけなので、完全ではありません。あるコンテンツでエラーが発生したかどうかを知ることが重要であれば、それをシェルに移動させることができます。

---

### エラーの種類によって処理を分ける {/*handling-different-errors-in-different-ways*/}

カスタムの `Error` サブクラスを[作成](https://javascript.info/custom-errors)し、[`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) 演算子を使用してどんなエラーがスローされたかをチェックすることができます。例えば、カスタムの `NotFoundError` を定義し、コンポーネントからそれをスローすることができます。その後、`onError`、`onShellReady`, `onShellError` のコールバック中でエラーの種類に応じて異なる処理を行うことができます。

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

しかしシェルを出力してストリーミングを開始してしまうと、ステータスコードを変更できなくなりますので注意してください。

---

### クローラや静的生成向けに全コンテンツの読み込みを待機する {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

ストリーミングにより、利用可能になった順でコンテンツをユーザが見えるようになるため、ユーザ体験が向上します。

しかし、クローラがページを訪れた場合や、ビルド時にページを生成している場合には、コンテンツを徐々に表示するのではなく、全てのコンテンツを最初にロードしてから最終的な HTML 出力を生成したいでしょう。

`onAllReady` コールバックを用いることで、すべてのコンテンツが読み込まれるまで待機を行うことができます。


```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

通常のユーザは、ストリームで読み込まれるコンテンツを段階的に受け取ります。クローラは、全データが読み込まれた後の最終的な HTML 出力を受け取ります。しかし、これはクローラが*すべての*データを待つ必要があることを意味し、その中には読み込みが遅いものやエラーが発生するものも含まれるかもしれません。アプリケーションによっては、クローラにもシェルを送信することを選択しても構いません。

---

### サーバレンダリングの中止 {/*aborting-server-rendering*/}

タイムアウト後にサーバでのレンダーを「諦める」ように強制することが可能です。

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React は、残りのローディング中フォールバックを HTML として直ちに出力し、クライアント上で残りをレンダーしようと試みます。
