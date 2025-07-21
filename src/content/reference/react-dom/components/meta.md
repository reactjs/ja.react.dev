---
meta: "<meta>"
---

<Intro>

[ブラウザ組み込みの `<meta>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)を利用することで、ドキュメントにメタデータを追加できます。

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<meta>` {/*meta*/}

ドキュメントにメタデータを追加するためには、[ブラウザ組み込みの `<meta>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)をレンダーします。任意のコンポーネントから `<meta>` をレンダーでき、React は対応する DOM 要素を常にドキュメントの head 内に配置します。

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[さらに例を見る](#usage)

#### props {/*props*/}

<<<<<<< HEAD
`<meta>` は、[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。
=======
`<meta>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

`name`、`httpEquiv`、`charset`、`itemProp` のうち、props として*どれかひとつだけ*を指定しなければなりません。これらの props のうちどれが指定されているかによって、`<meta>` コンポーネントの動作は異なります。

* `name`: 文字列。ドキュメントに添付される[メタデータの種類](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name)を指定します。
* `charset`: 文字列。ドキュメントで使用される文字セットを指定します。有効な値は `"utf-8"` のみです。
* `httpEquiv`: 文字列。ドキュメントを処理するためのディレクティブを指定します。
* `itemProp`: 文字列。ドキュメント全体ではなく、ドキュメント内の特定のアイテムに関するメタデータを指定する際に用います。
* `content`: 文字列。`name` や `itemProp` と共に使用される場合はメタデータの内容を指定し、`httpEquiv` と共に使用される場合はディレクティブの動作を指定します。

#### 特別なレンダー動作 {/*special-rendering-behavior*/}

`<meta>` コンポーネントが React ツリー内のどこでレンダーされていても、React は対応する DOM 要素を常にドキュメントの `<head>` 内に配置します。`<head>` は DOM 内で `<meta>` が存在できる唯一の有効な場所ですが、ある特定のページを表すコンポーネントが自分自身で `<meta>` コンポーネントをレンダーできれば有用であり、コンポーネントの組み合わせやすさが保たれます。

ただし、例外がひとつあります。`<meta>` に props として [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) がある場合、特別な動作は発生しません。この場合ドキュメントに関するメタデータではなく、ページの特定の部分に関するメタデータを表しているためです。

---

## 使用法 {/*usage*/}

### ドキュメントにメタデータによるアノテーションを加える {/*annotating-the-document-with-metadata*/}

キーワード、概要文、著者名といったメタデータを用いて、ドキュメントにアノテーション（ラベル付け）が行えます。React ツリー内のどこでレンダーされている場合でも、React はこのメタデータをドキュメントの `<head>` 内に配置します。

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

任意のコンポーネントから `<meta>` コンポーネントをレンダーできます。React は `<meta>` DOM ノードをドキュメントの `<head>` に配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### メタデータでドキュメント内の特定の項目にアノテーションを行う {/*annotating-specific-items-within-the-document-with-metadata*/}

`<meta>` コンポーネントの props として `itemProp` を使用することで、ドキュメント内の特定の項目に、メタデータをアノテーションできます。この場合、React はこれらのアノテーションをドキュメントの `<head>` 内に配置するのではなく、他の React コンポーネントと同様に配置します。

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
