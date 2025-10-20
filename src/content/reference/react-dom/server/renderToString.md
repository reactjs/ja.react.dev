---
title: renderToString
---

<Pitfall>

`renderToString` はストリーミングやデータ待機をサポートしていません。[代替手段を見る](#alternatives)。

</Pitfall>

<Intro>

`renderToString` は React ツリーを HTML 文字列にレンダーします。

```js
const html = renderToString(reactNode, options?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `renderToString(reactNode, options?)` {/*rendertostring*/}

サーバ上において、`renderToString` を呼び出してあなたのアプリを HTML にレンダーします。

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

クライアント側では、このようにサーバ生成された HTML を操作可能にするために [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を用います。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: HTML にレンダーしたい React ノード。例えば、`<App />` のような JSX ノード。

* **省略可能** `options`: サーバレンダー用のオプションが含まれたオブジェクト。
  * **省略可能** `identifierPrefix`: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。[`hydrateRoot`](/reference/react-dom/client/hydrateRoot#parameters) にも同じプレフィックスを渡す必要があります。

#### 返り値 {/*returns*/}

HTML 文字列。

#### 注意点 {/*caveats*/}

* `renderToString` のサスペンスに対するサポートは限定的です。コンポーネントがサスペンドすると、`renderToString` はそのフォールバックを HTML として直ちに送信します。

* `renderToString` はブラウザでも動作しますが、クライアントコードでの使用は[推奨されません](#removing-rendertostring-from-the-client-code)。

---

## 使用法 {/*usage*/}

### React ツリーを HTML として文字列にレンダーする {/*rendering-a-react-tree-as-html-to-a-string*/}

`renderToString` を呼び出して、あなたのアプリを、サーバからのレスポンスとして送信できる HTML 文字列にレンダーします。

```js {5-6}
import { renderToString } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

これにより、React コンポーネントの初期の非インタラクティブな HTML 出力が生成されます。クライアント側では、サーバが生成した HTML の*ハイドレーション*を行い操作可能にするために、[`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す必要があります。


<Pitfall>

`renderToString` はストリーミングやデータ待機をサポートしていません。[代替手段を見る](#alternatives)。

</Pitfall>

---

## 代替手段 {/*alternatives*/}

### サーバ上で `renderToString` からストリーム対応レンダーへの移行 {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` は直ちに文字列を返すため、コンテンツをロードしながらのストリーミングをサポートしません。

可能な場合、全機能を備えた以下の代替手段の使用を推奨します。

* Node.js を使用している場合は、[`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) を使用します。
* Deno や、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) をサポートするモダンなエッジランタイムを使用している場合は、[`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) を使用します。

サーバ環境がストリームをサポートしていない場合は、`renderToString` の使用を続けても構いません。

---

### サーバ上で `renderToString` から静的なプリレンダーへの移行 {/*migrating-from-rendertostring-to-a-static-prerender-on-the-server*/}

`renderToString` は直ちに文字列を返すため、静的 HTML 生成時にデータの待機を行うことをサポートしてません。

全機能を備えた以下の代替手段の使用を推奨します。

* Node.js を使用している場合は、[`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream) を使用します。
* Deno や、[Web Stream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) をサポートするモダンなエッジランタイムを使用している場合は、[`prerender`](/reference/react-dom/static/prerender) を使用します。

静的サイトを生成する環境でストリームがサポートされていない場合、`renderToString` の使用を続けても構いません。

---

### クライアントコードから `renderToString` を削除する {/*removing-rendertostring-from-the-client-code*/}

時に、`renderToString` はクライアント上で何らかのコンポーネントを HTML に変換するために使用されることがあります。

```js {1-2}
// 🚩 Unnecessary: using renderToString on the client
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // For example, "<svg>...</svg>"
```

**クライアント上で** `react-dom/server` をインポートすることは、不必要にバンドルサイズが増加するため避けるべきです。ブラウザで何らかのコンポーネントを HTML にレンダーする必要がある場合は、[`createRoot`](/reference/react-dom/client/createRoot) を使用し、DOM から HTML を読み取ります：

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // For example, "<svg>...</svg>"
```

[`flushSync`](/reference/react-dom/flushSync) の呼び出しは、[`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) プロパティを読み取る前に DOM が更新されるようにするために必要です。

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントがサスペンドすると HTML に常にフォールバックが含まれる {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` はサスペンスを完全にはサポートしていません。

何らかのコンポーネントが（[`lazy`](/reference/react/lazy) で定義されている、データをフェッチしているなどの理由で）サスペンドした場合、`renderToString` はそのコンテンツがロードされるのを待ちません。代わりに、`renderToString` はその上にある最も近い [`<Suspense>`](/reference/react/Suspense) バウンダリを見つけ、その `fallback` を HTML にレンダーします。コンテンツは、クライアントでコードがロードされるまで表示されなくなります。

これを解決するには、[ストリーミング対応の推奨ソリューション](#alternatives)のいずれかを使用します。サーバサイドレンダリングの場合、サーバ上でコンテンツがロードされるにつれて分割してコンテンツをストリームするため、クライアントコードがロードされる前から、ユーザはページが徐々に埋まっていくところを見ることができるようになります。静的サイト生成の場合、静的な HTML が作成される前にすべてのコンテンツがロードされるのを待機できます。

