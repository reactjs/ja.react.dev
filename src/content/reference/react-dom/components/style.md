---
style: "<style>"
---

<Intro>

[ブラウザ組み込みの `<style>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)を利用することで、ドキュメントにインラインの CSS スタイルシートを追加できます。

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<style>` {/*style*/}

ドキュメントにインラインスタイルを追加するためには、[ブラウザ組み込みの `<style>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)をレンダーします。任意のコンポーネントから `<style>` をレンダーでき、React は[特定の場合](#special-rendering-behavior)に対応する DOM 要素をドキュメントの head に配置し、同一のスタイルの重複解消処理を行います。

```js
<style>{` p { color: red; } `}</style>
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<style>` は、[一般的な要素の props](/reference/react-dom/components/common#common-props) をすべてサポートしています。

* `children`: 文字列、必須。スタイルシートの内容です。
* `precedence`: 文字列。React がドキュメントの `<head>` 内で `<style>` DOM ノードを他と比較してどのように順序付けるかを指定します。これによりどのスタイルシートが他を上書きできるかが決まります。React は、最初に見つけた優先順位の値を「低い」と見なし、後で見つけた優先順位の値を「高い」と見なします。多くのスタイルシステムは、スタイルルールがアトミックであるため、単一の優先順位の値を使用しても問題なく機能します。同じ優先順位を持つスタイルシートは、`<link>` の場合でもインライン `<style>` タグの場合でも、あるいは [`preinit`](/reference/react-dom/preinit) 関数を使用してロードされた場合でも、一緒に配置されます。
* `href`: 文字列。同じ `href` を持つスタイルに対して React が[重複解消処理](#special-rendering-behavior)を行えるようにします。
* `media`: 文字列。スタイルシートの適用を特定の[メディアクエリ](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries)に制限します。
* `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際に[リソースを許可するための暗号化 nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
* `title`: 文字列。[代替スタイルシート](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets)の名前を指定します。

以下は React での使用が**推奨されない** props です。

* `blocking`: 文字列。`"render"` と設定されている場合、スタイルシートがロードされるまでページを描画しないようブラウザに指示します。React ではサスペンスを通じてより細かい制御を提供します。

#### 特別なレンダー動作 {/*special-rendering-behavior*/}

React は `<style>` コンポーネントをドキュメントの `<head>` に移動し、同一のスタイルシートの重複解消処理を行い、スタイルシートがロードされている間に[サスペンド](/reference/react/Suspense)します。

この動作を有効にするには、props として `href` と `precedence` を指定してください。React は同じ `href` を持つスタイルの重複解消処理を行います。`precedence` はドキュメントの `<head>` 内における他の `<style>` DOM ノードとの相対ランクを React に指示することで、どのスタイルシートが他を上書きできるかを決定できるようにします。

<<<<<<< HEAD
この特別な動作に関して、以下の注意点があります。
=======
This special treatment comes with three caveats:
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee

* スタイルがレンダーされた後、React は props に変更があってもそれを無視します（開発中にこれが起きた場合は React が警告を発します）。
* `precedence` が指定されている場合、React は（`href` と `precedence` 以外の）無関係な props をすべて削除します。
* コンポーネントがアンマウントされた後も、React は DOM にスタイルを残すことがあります。

---

## 使用法 {/*usage*/}

### インライン CSS スタイルシートのレンダー {/*rendering-an-inline-css-stylesheet*/}

コンポーネントが正しく表示されるために特定の CSS スタイルに依存している場合、インラインスタイルシートを当該コンポーネント内でレンダーできます。

props である `href` は、このスタイルシートを一意に識別する必要があります。React は同じ `href` を持つスタイルシートに対して重複解消処理を行うからです。
props として `precedence` を与えた場合、React は各々の値がコンポーネントツリーに現れた順番を基準にして、インラインのスタイルシートを並び替えます。

インラインのスタイルシートはロード中にサスペンスバウンダリをトリガしません。
これは内部でフォントや画像などのリソースを非同期的に読み込んでいる場合でも同様です。

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
