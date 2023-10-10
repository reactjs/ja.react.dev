---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` は、非インタラクティブな React ツリーを HTML 文字列にレンダーします。

```js
const html = renderToStaticMarkup(reactNode)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `renderToStaticMarkup(reactNode)` {/*rendertostaticmarkup*/}

サーバ上において、`renderToStaticMarkup` を呼び出してアプリを HTML にレンダーします。

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

これにより、React コンポーネントの非インタラクティブな HTML 出力が生成されます。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `reactNode`: HTML にレンダーしたい React ノード。例えば、`<Page />` のような JSX ノード。

#### 返り値 {/*returns*/}

HTML 文字列。

#### 注意点 {/*caveats*/}

* `renderToStaticMarkup` の出力に対してハイドレーションは行えません。

* `renderToStaticMarkup` のサスペンスに対するサポートは限定的です。コンポーネントがサスペンドすると、`renderToStaticMarkup` はそのフォールバックを HTML として直ちに出力します。

* `renderToStaticMarkup` はブラウザで動作しますが、クライアントコードでの使用は推奨されません。ブラウザでコンポーネントを HTML にレンダーする必要がある場合は、[DOM ノードにレンダーしてその HTML を取得してください](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)。

---

## 使用法 {/*usage*/}

### 非インタラクティブな React ツリーを HTML として文字列にレンダーする {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

`renderToStaticMarkup` を呼び出して、あなたのアプリを、サーバからのレスポンスとして送信できる HTML 文字列にレンダーします。

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

これにより、React コンポーネントの非インタラクティブな初期 HTML 出力が生成されます。

<Pitfall>

このメソッドは、**ハイドレーションができない非インタラクティブな HTML をレンダーします**。これは、React をシンプルな静的ページジェネレータとして使用したい場合や、メールのような完全に静的なコンテンツをレンダーする場合に有用です。

インタラクティブなアプリでは、サーバ上で [`renderToString`](/reference/react-dom/server/renderToString) を、クライアント上で [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を使用すべきです。

</Pitfall>
