---
title: preload
---

<<<<<<< HEAD
<Canary>

`preload` 関数は、現在 React の Canary および experimental チャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
<Note>

[React ベースのフレームワーク](/learn/start-a-new-react-project)は、多くの場合リソースの読み込みを自動で処理してくれるため、この API を直接呼び出す必要はないかもしれません。詳細はフレームワークのドキュメントを参照してください。

</Note>

<Intro>

`preload` を使用して、後で使用する予定のスタイルシート、フォント、外部スクリプトなどのリソースを事前にフェッチすることができます。

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preload(href, options)` {/*preload*/}

リソースを事前に読み込むためには、`react-dom` の `preload` 関数を呼び出します。

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[さらに例を見る](#usage)

`preload` 関数は、指定されたリソースのダウンロードを開始するようブラウザに対してヒントを与えます。これにより時間を節約できる可能性があります。

#### 引数 {/*parameters*/}

* `href`: 文字列。ダウンロードしたいリソースの URL。
* `options`: オブジェクト。以下のプロパティを含みます。
  *  `as`: 必須の文字列。リソースの種別。[指定可能な値](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as)は `audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video`、`worker` です。
  *  `crossOrigin`: 文字列。使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は `anonymous` と `use-credentials` です。`as` が `"fetch"` に設定されている場合は必須です。
  *  `referrerPolicy`: 文字列。フェッチ時に送信する [Referrer ヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy)。指定可能な値は `no-referrer-when-downgrade`（デフォルト）、`no-referrer`, `origin`, `origin-when-cross-origin`, `unsafe-url` です。
  *  `integrity`: 文字列。[真正性を検証する](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)ために使用するリソースの暗号化ハッシュ。
  *  `type`: 文字列。リソースの MIME タイプ。
  *  `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際に[リソースを許可するための暗号化 nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
  *  `fetchPriority`: 文字列。リソースの相対的なフェッチ優先度のヒントです。指定可能な値は `auto`（デフォルト）、`high`、`low` です。
  *  `imageSrcSet`: 文字列。`as: "image"` の場合にのみ使用します。[画像のソースセット](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。
  *  `imageSizes`: 文字列。`as: image"` の場合にのみ使用します。[画像のサイズ](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。

#### 返り値 {/*returns*/}

`preload` は何も返しません。

#### 注意点 {/*caveats*/}

* 同等の `preload` を複数回呼び出した場合の効果は、一度のみ呼び出した場合と同様です。`preload` の呼び出しが同等であるかどうかの判断は以下のルールに従います。
  * `href` が同じであれば、2 つの呼び出しは同等とみなす。
  * ただし `as` が `image` に設定されている場合、`href`、`imageSrcSet`、`imageSizes` がすべて同一である場合、2 つの呼び出しを同等とみなす。
* ブラウザからは、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内も含むどんな状況においても `preload` の呼び出しが可能です。
* サーバサイドレンダリングやサーバコンポーネントのレンダー時には、コンポーネントのレンダー中やレンダーから派生した非同期処理の中で `preload` を呼び出した場合にのみ効果があります。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダー時のプリロード {/*preloading-when-rendering*/}

コンポーネントをレンダーする際に自身あるいはその子が特定のリソースを使用することが分かっている場合、`preload` を呼び出します。

<Recipes titleText="プリロードの例">

#### 外部スクリプトのプリロード {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

ブラウザに（ダウンロードのみではなく）スクリプトの実行も即座に開始させたい場合、代わりに [`preinit`](/reference/react-dom/preinit) を使用してください。ESM モジュールをロードしたい場合は、[`preloadModule`](/reference/react-dom/preloadModule) を使用してください。

<Solution />

#### スタイルシートのプリロード {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

スタイルシートを文書に即座に挿入したい場合（つまり、ブラウザにダウンロードのみではなく内容の解析も即座にさせたい場合）、代わりに [`preinit`](/reference/react-dom/preinit) を使用してください。

<Solution />

#### フォントのプリロード {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

スタイルシートをプリロードする場合、スタイルシートが参照するフォントもプリロードすると良いでしょう。これにより、ブラウザはスタイルシートのダウンロードと解析を行う前に、フォントのダウンロードを開始できます。

<Solution />

#### 画像のプリロード {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

画像をプリロードする際、`imageSrcSet` と `imageSizes` オプションは、ブラウザが[画面のサイズに適した画像を取得する](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)のに役立ちます。

<Solution />

</Recipes>

### イベントハンドラでのプリロード {/*preloading-in-an-event-handler*/}

外部リソースを必要とするページ遷移や状態遷移を行う前に、イベントハンドラで `preload` を呼び出しておきます。これにより、新しいページや状態がレンダーされる時点で読み込むのと比べ、早期に処理を開始できます。

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
