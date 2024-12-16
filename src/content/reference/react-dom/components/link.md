---
link: "<link>"
---

<<<<<<< HEAD
<Canary>

React による `<link>` の機能拡張は、現在 React の Canary および experimental チャンネルでのみ利用可能です。React の安定版リリースでは、`<link>` は単なる[組み込みのブラウザ HTML コンポーネント](https://react.dev/reference/react-dom/components#all-html-components)として機能します。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

=======
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04
<Intro>

[ブラウザ組み込みの `<link>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)を利用することで、スタイルシートのような外部リソースを使用したり、リンクメタデータでドキュメントへのアノテーション（ラベル付け）を行えます。

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<link>` {/*link*/}

スタイルシート、フォント、アイコンなどの外部リソースにリンクしたり、リンクメタデータを使ってドキュメントにアノテーションを行うためには、[ブラウザ組み込みの `<link>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)をレンダーします。任意のコンポーネントから `<link>` をレンダーでき、React は[ほとんどの場合](#special-rendering-behavior)対応する DOM 要素をドキュメントの head に配置します。

```js
<link rel="icon" href="favicon.ico" />
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<link>` は、[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

* `rel`: 文字列、必須。[リソースとの関係](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel)を指定します。React は [`rel="stylesheet"` となっているリンク](#special-rendering-behavior)を他のリンクとは異なる方法で扱います。

以下の props は `rel="stylesheet"` の場合に適用されます。

* `precedence`: 文字列。React がドキュメントの `<head>` 内で `<link>` DOM ノードを他と比較してどのように順序付けるかを指定します。これによりどのスタイルシートが他のスタイルシートを上書きできるかが決まります。React は、最初に見つけた優先順位の値を「低い」と見なし、後に見つけた優先順位の値を「高い」と見なします。多くのスタイルシステムは、スタイルルールがアトミックであるため、単一の優先順位の値を使用しても問題なく機能します。同じ優先順位を持つスタイルシートは、`<link>` の場合でもインライン `<style>` タグの場合でも、あるいは [`preinit`](/reference/react-dom/preinit) 関数を使用してロードされた場合でも、一緒に配置されます。
* `media`: 文字列。スタイルシートの適用を特定の[メディアクエリ](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)に制限します。
* `title`: 文字列。[代替スタイルシート](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)の名前を指定します。

以下の props は `rel="stylesheet"` の場合に適用されますが、React の[スタイルシートに関する特別な扱い](#special-rendering-behavior)を無効にします。

* `disabled`: ブール値。スタイルシートを無効にします。
* `onError`: 関数。スタイルシートの読み込みに失敗したときに呼び出されます。
* `onLoad`: 関数。スタイルシートの読み込みが完了したときに呼び出されます。

以下の props は `rel="preload"` または `rel="modulepreload"` の場合に適用されます。

* `as`: 文字列。リソースの種別。可能な値は `audio`、`document`、`embed`、`fetch`、`font`、`image`、`object`、`script`、`style`、`track`、`video`、`worker` です。
* `imageSrcSet`: 文字列。`as="image"` の場合にのみ適用されます。[画像のソースセット](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。
* `imageSizes`: 文字列。`as="image"` の場合にのみ適用されます。[画像のサイズ](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)を指定します。

以下の props は、`rel="icon"` または `rel="apple-touch-icon"` の場合に適用されます。

* `sizes`: 文字列。アイコンの[サイズ](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)。

以下の props はすべての場合に適用されます。

* `href`: 文字列。リンクするリソースの URL。
* `crossOrigin`: 文字列。使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は `anonymous` と `use-credentials` です。`as` が `"fetch"` に設定されている場合は必須です。
* `referrerPolicy`: 文字列。フェッチ時に送信する [Referrer ヘッダ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy)。可能な値は `no-referrer-when-downgrade`（デフォルト）、`no-referrer`、`origin`、`origin-when-cross-origin`、および `unsafe-url` です。
* `fetchPriority`: 文字列。リソースのフェッチに対する相対的な優先度のヒントです。可能な値は `auto`（デフォルト）、`high`、および `low` です。
* `hrefLang`: 文字列。リンクするリソースの言語。
* `integrity`: 文字列。[真正性を検証する](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)ために使用するリソースの暗号化ハッシュ。
* `type`：文字列。リンクされるリソースの MIME タイプ。

以下は React での使用が**推奨されない** props です。

* `blocking`: 文字列。`"render"` と設定されている場合、スタイルシートがロードされるまでページを描画しないようブラウザに指示します。React ではサスペンスを通じてより細かい制御を提供します。

#### 特別なレンダー動作 {/*special-rendering-behavior*/}

`<link>` コンポーネントが React ツリー内のどこでレンダーされていても、React は対応する DOM 要素を常にドキュメントの `<head>` 内に配置します。`<head>` は DOM 内で `<link>` が存在できる唯一の有効な場所ですが、ある特定のページを表すコンポーネントが自分自身で `<link>` コンポーネントをレンダーできれば有用であり、コンポーネントの組み合わせやすさが保たれます。

これにはいくつかの例外があります。

* `<link>` に props として `rel="stylesheet"` がある場合、この特別な動作を得るために props として `precedence` も必要です。これは、ドキュメント内におけるスタイルシートの順序は重要であり、このスタイルシートを他のスタイルシートに対してどのような順序で配置するか React が知る必要があるためです。`precedence` が指定されていない場合、特別な動作は起きなくなります。
* `<link>` に props として [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) が存在する場合、特別な動作は発生しません。この場合リンクはドキュメントに適用されるのではなく、ページの特定の部分に関するメタデータを表すことになるからです。
* `<link>` に props として `onLoad` または `onError` がある場合も同様です。この場合リンクされたリソースのロードを React コンポーネント内で手動で管理しようとしているということだからです。

#### スタイルシートの特別な動作 {/*special-behavior-for-stylesheets*/}

さらに、`<link>` がスタイルシートへのリンクである（つまり props として `rel="stylesheet"` が含まれている）場合、React はそれを以下のように特別に扱います。

* `<link>` をレンダーしているコンポーネントは、スタイルシートが読み込まれている間、[サスペンド](/reference/react/Suspense)します。
* 複数のコンポーネントが同じスタイルシートへのリンクをレンダーしている場合、React は重複が起きないよう、DOM にリンクをひとつだけ配置します。2 つのリンクは同じ `href` プロパティを持っている場合に同じものと見なされます。

この特別な動作には、以下の 2 つの例外があります。

* リンクに props として `precedence` がない場合、特別な動作は発生しません。ドキュメント内のスタイルシートの順序は重要であり、React がこのスタイルシートを他のスタイルシートに対してどのような順序で配置するのか、`precedence` プロパティを使用して指定する必要があるからです。
* props として `onLoad`、`onError`、または `disabled` のいずれかを指定した場合、特別な動作は発生しません。これらの props は、コンポーネント内でスタイルシートの読み込みを手動で管理してしていることを意味するからです。

この特別な動作に関して、以下の 2 つの注意点があります。

* リンクがレンダーされた後、React は props に変更があってもそれを無視します（開発中にこれが起きた場合は React が警告を発します）。
* コンポーネントがアンマウントされた後も、React は DOM にリンクを残すことがあります。

---

## 使用法 {/*usage*/}

### 関連リソースへのリンク {/*linking-to-related-resources*/}

アイコン、推奨 (canonical) URL、またはピンバック (pingback) といった関連リソースへのリンクを、ドキュメントにアノテーション（注記）として与えることができます。React ツリー内のどこにレンダーされている場合でも、React はこのようなメタデータをドキュメントの `<head>` 内に配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>My Blog</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### スタイルシートへのリンク {/*linking-to-a-stylesheet*/}

コンポーネントが正しく表示されるために特定のスタイルシートに依存している場合、そのスタイルシートへのリンクを当該コンポーネント内でレンダーできます。スタイルシートが読み込まれている間、コンポーネントは[サスペンド](/reference/react/Suspense)します。props として `precedence` を指定する必要があり、これにより React が他のスタイルシートに対してこのスタイルシートを相対的にどのように配置するか指示します。優先度が高いスタイルシートは、優先度が低いものをオーバーライドできます。

<Note>
スタイルシートを使用する場合、[preinit](/reference/react-dom/preinit) 関数を呼び出すことが有用です。この関数を呼び出すことで、たとえば [HTTP Early Hints レスポンス](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)を送信でき、ブラウザがスタイルシートのフェッチをより早く開始できるかもしれません。
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### スタイルシートの優先度の制御 {/*controlling-stylesheet-precedence*/}

スタイルシートは互いに競合することがあり、その場合ブラウザはドキュメント内で後に来るものを採用します。React では props である `precedence` を使用してスタイルシートの順序を制御できます。以下の例では 2 つのコンポーネントがスタイルシートをレンダーしています。優先度の高いリンクをレンダーしているコンポーネントが先に来ていますが、ドキュメント内では後に配置されます。

{/*FIXME: this doesn't appear to actually work -- I guess precedence isn't implemented yet?*/}

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <FirstComponent />
      <SecondComponent />
      ...
    </ShowRenderedHTML>
  );
}

function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### スタイルシートレンダーの重複解消処理 {/*deduplicated-stylesheet-rendering*/}

複数のコンポーネントが同じスタイルシートをレンダーする場合、React はドキュメントの head 内に `<link>` をひとつだけ配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HomePage() {
  return (
    <ShowRenderedHTML>
      <Component />
      <Component />
      ...
    </ShowRenderedHTML>
  );
}

function Component() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### リンクでドキュメント内の特定の項目にアノテーションを行う {/*annotating-specific-items-within-the-document-with-links*/}

`<link>` コンポーネントの props として `itemProp` を使用することで、ドキュメント内の特定の項目に、関連リソースへのリンクをアノテーションできます。この場合、React はこれらのアノテーションをドキュメントの `<head>` 内に配置するのではなく、他の React コンポーネントと同様に配置します。

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <link itemProp="author" href="http://example.com/" />
  <p>...</p>
</section>
```
