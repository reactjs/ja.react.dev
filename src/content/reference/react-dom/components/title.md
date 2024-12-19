---
title: "<title>"
---

<Intro>

[ブラウザ組み込みの `<title>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)を利用することで、ドキュメントのタイトルを指定できます。

```js
<title>My Blog</title>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<title>` {/*title*/}

ドキュメントのタイトルを指定するには、[ブラウザ組み込みの `<title>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)をレンダーします。任意のコンポーネントから `<title>` をレンダーでき、React は常に対応する DOM 要素をドキュメントの head 内に配置します。

```js
<title>My Blog</title>
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<title>` は、[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

* `children`: `<title>` は子としてテキストのみを受け入れます。このテキストがドキュメントのタイトルになります。それがテキストのみをレンダーする限り、カスタムのコンポーネントを渡すこともできます。

#### 特別なレンダー動作 {/*special-rendering-behavior*/}

`<title>` コンポーネントが React ツリー内のどこでレンダーされていても、React は対応する DOM 要素を常にドキュメントの `<head>` 内に配置します。`<head>` は DOM 内で `<title>` が存在できる唯一の有効な場所ですが、ある特定のページを表すコンポーネントが自分自身で `<title>` コンポーネントをレンダーできれば有用であり、コンポーネントの組み合わせやすさが保たれます。

これには 2 つの例外があります。
* `<title>` が `<svg>` コンポーネント内にある場合、特別な動作は発生しません。その文脈ではドキュメントのタイトルではなく[当該 SVG グラフィックに対するアクセシビリティ用の説明](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)を表すことになるからです。
* `<title>` に props として [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) がある場合、特別な動作は発生しません。その場合はドキュメントのタイトルではなく、ページの特定の部分に関するメタデータを表すことになるからです。

<Pitfall>

一度にひとつの `<title>` だけがレンダーされるようにしてください。複数のコンポーネントが同時に `<title>` タグをレンダーすると、React はそれらのタイトルをすべてドキュメントの head に配置します。このような場合のブラウザや検索エンジンの動作は定義されていません。

</Pitfall>

---

## 使用法 {/*usage*/}

### ドキュメントのタイトルを設定する {/*set-the-document-title*/}

任意のコンポーネントから、テキストを children として持つ `<title>` コンポーネントをレンダーします。React は `<title>` DOM ノードをドキュメントの `<head>` に配置します。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### タイトルに変数を使用する {/*use-variables-in-the-title*/}

`<title>` コンポーネントの children は、単一の文字列（あるいは単一の数値、または `toString` メソッドを持つ単一のオブジェクト）でなければなりません。気付きにくいかもしれませんが、以下のように JSX で波括弧を使用した場合：

```js
<title>Results page {pageNumber}</title> // 🔴 Problem: This is not a single string
```

...実際には、`<title>` コンポーネントは children として 2 つの要素（`"Results page"` という文字列と、`pageNumber` の値）を持つ配列を受け取ることになります。これはエラーを引き起こします。代わりに、文字列補間を使用することで `<title>` に単一の文字列を渡すようにしてください。

```js
<title>{`Results page ${pageNumber}`}</title>
```

