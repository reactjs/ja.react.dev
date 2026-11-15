---
title: "<img>"
---

<Intro>

[ブラウザ組み込みの `<img>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)を使うことで、画像を埋め込むことができます。

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<img>` {/*img*/}

画像を表示するには、[ブラウザ組み込みの `<img>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)をレンダーします。

```js
<img src="photo.jpg" alt="A person walking through a park" />
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<img>` は、[一般的な要素の props](/reference/react-dom/components/common#common-props) をすべてサポートしています。

* `alt`: 文字列。画像の代替テキストを指定します。純粋に装飾目的の画像には空文字列を使用します。
* `crossOrigin`: 文字列。画像のフェッチ時に使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)を指定します。可能な値は `anonymous` と `use-credentials` です。
* `decoding`: 文字列。他のコンテンツを表示する前に、ブラウザが画像のデコードを待つべきかどうかのヒントです。可能な値は `async`、`sync`、`auto`（デフォルト）です。
* `fetchPriority`: 文字列。画像のフェッチに対する相対的な優先度のヒントです。可能な値は `high`、`low`、`auto`（デフォルト）です。サーバレンダリング中は、`fetchPriority="low"` を指定すると、React による[画像の自動プリロード](#controlling-image-preloading-during-server-rendering)も行われなくなります。
* `height`: 数値または文字列。画像の表示時の高さを指定します。
* `loading`: 文字列。画像がビューポートの近くに来るまで、ブラウザが画像の読み込みを遅延させるかどうかを指定します。可能な値は `eager`（デフォルト）と `lazy` です。`loading="lazy"` を設定すると、React による[画像の自動プリロード](#controlling-image-preloading-during-server-rendering)が行われなくなります。
* `onError`: [イベントハンドラ](/reference/react-dom/components/common#event-handler)関数。画像の読み込みに失敗したときに発火します。
* `onLoad`: [イベントハンドラ](/reference/react-dom/components/common#event-handler)関数。画像の読み込みが完了したときに発火します。`onLoad` を渡すと、[クライアントでのレンダーによるビュー遷移 (View Transition) の更新中に、React が画像を待機する動作](#waiting-for-an-image-during-a-view-transition)が行われなくなります。
* `referrerPolicy`: 文字列。画像のフェッチ時に送信する[リファラ情報](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#referrerpolicy)を指定します。
* `sizes`: 文字列。ページレイアウトごとの画像サイズを指定します。`srcSet` と組み合わせて使用します。
* `src`: 文字列。画像の URL を指定します。
* `srcSet`: 文字列。ブラウザが選択できる画像ソースの候補を 1 つ以上指定します。
* `useMap`: 文字列。画像を[クライアントサイドイメージマップ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map)と関連付けます。
* `width`: 数値または文字列。画像の表示時の幅を指定します。

#### 注意点 {/*caveats*/}

* `src` に空文字列を渡さないでください。ブラウザが現在のページを再度リクエストしてしまう可能性があります。React は開発環境では警告を表示し、この属性を省略します。画像を何も表示しない場合は、`<img>` 自体を省略するか、`src` に `null` を渡してください。
* `<img>` は子要素を持つことができず、`dangerouslySetInnerHTML` も使用できません。いずれかを渡すと React はエラーをスローします。
* `fetchPriority="low"` を指定しても、クライアントでのレンダーによるビュー遷移の更新中に React が画像の読み込みを待機する動作は止まりません。この動作をオプトアウトするには、`loading="lazy"` を指定するか `onLoad` ハンドラを渡してください。

---

## 使用法 {/*usage*/}

### 画像を表示する {/*displaying-an-image*/}

`src` に画像の URL を、`alt` にテキストによる説明を渡します。

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://react.dev/images/docs/scientists/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      width={100}
      height={100}
    />
  );
}
```

```css
img {
  border-radius: 50%;
  object-fit: cover;
}
```

</Sandpack>

画像のサイズが分かっている場合は `width` と `height` を指定してください。これにより、ブラウザが画像の読み込み前に表示領域を確保できるようになります。装飾目的の画像には `alt=""` を渡して、スクリーンリーダに無視されるようにしてください。

---

### サーバレンダリング中の画像のプリロードを制御する {/*controlling-image-preloading-during-server-rendering*/}

サーバレンダリング中、React はデフォルトで `<img>` に対するプリロードヒントを自動的に生成します。これにより、ブラウザはレンダーされた HTML 内で `<img>` に出会う前に、画像のフェッチを開始できるようになります。

このヒントを生成すべきでない画像には、`loading="lazy"` または `fetchPriority="low"` を追加します。

```js
function ProductPage() {
  return (
    <>
      <img src="hero.jpg" alt="Featured product" />
      <img src="thumbnail.jpg" alt="Related product" loading="lazy" />
      <img src="secondary.jpg" alt="Another product" fetchPriority="low" />
    </>
  );
}
```

この例では、React は `hero.jpg` に対してのみプリロードヒントを生成します。使用するサーバ API やフレームワークによっては、React は以下のような要素に相当するものをレンダーすることがあります。

```html
<link rel="preload" as="image" href="hero.jpg" />
```

代わりに、同じヒントを `Link` レスポンスヘッダで提供する場合もあります。残りの 2 つの画像については、レンダーされた HTML に `loading` や `fetchPriority` の props がそのまま残りますが、React はプリロードヒントを生成しません。`loading="lazy"` は、画像がビューポートに近づくまで読み込みを遅延させるようブラウザに求めます。`fetchPriority="low"` は画像をすぐに読み込むことを許可しますが、低い優先度でフェッチするようブラウザに伝えます。

また、画像が `<picture>` 要素や `<noscript>` 要素の内部にある場合や、`src` または `srcSet` が data URL である場合も、React は画像を自動的にプリロードしません。

フレームワークやコンポーネントライブラリを通じて画像をレンダーしている場合は、デフォルトの動作についてそれぞれのドキュメントを参照してください。自動プリロードを生成するかどうかは、内部でレンダーされる `<img>` の props に基づいて React が決定します。例えば、画像コンポーネントによっては、デフォルトで `loading="lazy"` を付加し、選択した画像を明示的にプリロードするための別のオプションを提供している場合があります。

プリロードヒントを明示的に作成するには、[`preload`](/reference/react-dom/preload) を呼び出します。

---

### ビュー遷移中に画像の読み込みを待機する {/*waiting-for-an-image-during-a-view-transition*/}

[`<ViewTransition>`](/reference/react/ViewTransition) による更新中、React はアニメーションを開始する前に、表示される画像の読み込みを最大 500 ミリ秒待機します。この対象には、新たにレンダーされた `<img>` 要素と、`src` や `srcSet` が変更された既存の画像が含まれます。`loading="lazy"` を設定するか `onLoad` ハンドラを追加すると、その画像は対象外になります。

サスペンスバウンダリが中身を表示する際に、`<ViewTransition>` の内側と外側とで同じ画像の表示のされ方がどう異なるか、比較してみましょう。

<Sandpack>

```js
import {
  ViewTransition,
  Suspense,
  use,
  useState,
} from 'react';
import { fetchImageSrc } from './image.js';

function Profile({ cacheKey }) {
  const src = use(fetchImageSrc(cacheKey));
  return (
    <div className="card">
      <img src={src} alt="" width={80} height={80} />
      <p>Jack Pope</p>
    </div>
  );
}

function ProfilePlaceholder() {
  return (
    <div className="card">
      <div className="avatar-placeholder" />
      <p className="name-placeholder">&nbsp;</p>
    </div>
  );
}

export default function App() {
  const [showWithTransition, setShowWithTransition] =
    useState(false);
  const [showWithoutTransition, setShowWithoutTransition] =
    useState(false);
  return (
    <>
      <button onClick={() => setShowWithTransition(true)}>
        Show profile with View Transition
      </button>
      {showWithTransition && (
        <ViewTransition>
          <Suspense fallback={<ProfilePlaceholder />}>
            <Profile cacheKey="with-transition" />
          </Suspense>
        </ViewTransition>
      )}
      <hr />
      <button onClick={() => setShowWithoutTransition(true)}>
        Show profile without View Transition
      </button>
      {showWithoutTransition && (
        <Suspense fallback={<ProfilePlaceholder />}>
          <Profile cacheKey="without-transition" />
        </Suspense>
      )}
    </>
  );
}
```

```js src/image.js hidden
// Normally, the caching logic would be inside a framework.
const cache = new Map();

export function fetchImageSrc(cacheKey) {
  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, loadImageSrc());
  }
  return cache.get(cacheKey);
}

async function loadImageSrc() {
  // Delay the response so the Suspense fallback is visible.
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Add a unique parameter so the image isn't cached.
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```css
#root {
  min-height: 390px;
}
.card {
  margin-top: 1em;
}
.card img {
  display: block;
  border-radius: 50%;
  background: #dfe3e9;
}
.card p {
  font-weight: bold;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder {
  width: 90px;
  border-radius: 4px;
  background: #dfe3e9;
}
hr {
  margin: 16px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`<ViewTransition>` がある場合、React は画像の読み込み中、最大 500 ミリ秒間スケルトンを表示し続けるため、画像が揃った状態でカードを表示できます。`<ViewTransition>` がない場合、サスペンスはプロミスが解決した時点でスケルトンの表示をやめます。画像がまだ読み込み中であれば、先にカードが表示され、画像は後から表示されます。
