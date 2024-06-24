---
script: "<script>"
canary: true
---

<Canary>

React による `<script>` の機能拡張は、現在 React の Canary および experimental チャンネルでのみ利用可能です。React の安定版リリースでは、`<script>` は単なる[組み込みのブラウザ HTML コンポーネント](https://react.dev/reference/react-dom/components#all-html-components)として機能します。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

<Intro>

[ブラウザ組み込みの `<script>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)を利用することで、ドキュメントにスクリプトを追加できます。

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<script>` {/*script*/}

ドキュメントにインラインスクリプトまたは外部スクリプトを追加するためには、[ブラウザ組み込みの `<script>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)をレンダーします。任意のコンポーネントから `<script>` をレンダーでき、React は[特定の場合](#special-rendering-behavior)に対応する DOM 要素をドキュメントの head 内に配置し、同一スクリプトの重複解消処理を行います。

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<script>` は、[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

props として `children` または `src` のいずれかが必要です。

* `children`: 文字列。インラインスクリプトのソースコード。
* `src`: 文字列。外部スクリプトの URL。

他に、以下の props がサポートされます。

* `async`: ブーリアン。ドキュメントの残りの部分の処理を完了するまでブラウザにスクリプトの実行を遅延させることを許可します。これはパフォーマンスのために推奨される動作です。
* `crossOrigin`: 文字列。使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は `anonymous` と `use-credentials` です。
* `fetchPriority`: 文字列。複数のスクリプトを同時にフェッチする際に、ブラウザにスクリプトの優先付けを行わせます。`"high"`、`"low"`、`"auto"`（デフォルト）のいずれかです。
* `integrity`: 文字列。文字列。[真正性を検証する](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)ために使用するスクリプトの暗号化ハッシュ。
* `noModule`: ブーリアン。ES モジュールをサポートするブラウザでこのスクリプトを無効にすることで、サポートしていないブラウザ用のフォールバックスクリプトとして利用できるようにします。
* `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際に[リソースを許可するための暗号化 nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
* `referrer`: 文字列。スクリプトをフェッチする際、およびそのスクリプトが更にリソースフェッチする際に送信する [Referer ヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy)を指定します。
* `type`: 文字列。スクリプトが[従来のスクリプト、ES モジュール、またはインポートマップ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type)のいずれであるかを指定します。

以下の props は React による[スクリプトの特別な扱い](#special-rendering-behavior)を無効にします。

* `onError`: 関数。スクリプトのロードに失敗したときに呼び出されます。
* `onLoad`: 関数。スクリプトのロードが完了したときに呼び出されます。

以下は React での使用が**推奨されない** props です。

* `blocking`: 文字列。`"render"` と設定されている場合、スクリプトがロードされるまでページを描画しないようブラウザに指示します。React ではサスペンスを通じてより細かい制御を提供します。
* `defer`: 文字列。ドキュメントの読み込みが完了するまでブラウザによるスクリプトの実行を防ぎます。これはストリーミングでサーバレンダーされるコンポーネントと互換性がありません。代わりに `async` を使用してください。

#### 特別なレンダー動作 {/*special-rendering-behavior*/}

<<<<<<< HEAD
React は `<script>` コンポーネントをドキュメントの `<head>` に移動させ、同一スクリプトの重複解消処理を行い、スクリプトの読み込み中に[サスペンド](/reference/react/Suspense)を発生させます。
=======
React can move `<script>` components to the document's `<head>` and de-duplicate identical scripts.
>>>>>>> 169d5c1820cd1514429bfac2a923e51dd782d37e

この動作を有効にするには、props として `src` と `async={true}` の props を指定してください。React は同じ `src` を持つスクリプトが重複しないようにします。スクリプトを安全に移動させるために `async` が true である必要があります。

<<<<<<< HEAD
props として `onLoad` または `onError` を指定した場合、特別な動作は発生しません。これらの props は、コンポーネント内でスクリプトの読み込みを手動で管理してしていることを意味するからです。

この特別な動作に関して、以下の 2 つの注意点があります。
=======
This special treatment comes with two caveats:
>>>>>>> 169d5c1820cd1514429bfac2a923e51dd782d37e

* スクリプトがレンダーされた後、React は props に変更があってもそれを無視します（開発中にこれが起きた場合は React が警告を発します）。
* スクリプトをレンダーしていたコンポーネントがアンマウントされた後も、React は DOM にスクリプトを残すことがあります。（スクリプトは DOM に挿入された際に一度だけ実行されるものなので、これによる影響はありません。）

---

## 使用法 {/*usage*/}

### 外部スクリプトのレンダー {/*rendering-an-external-script*/}

<<<<<<< HEAD
コンポーネントが正しく表示されるために特定のスクリプトに依存している場合、当該コンポーネント内で `<script>` をレンダーできます。

props として `src` と `async` を指定すると、スクリプトが読み込まれる間、コンポーネントはサスペンド状態になります。スクリプトの重複を避けるため、複数のコンポーネントが同じ `src` を持つスクリプトをレンダーしている場合には React は DOM にそれをひとつだけ挿入します。
=======
If a component depends on certain scripts in order to be displayed correctly, you can render a `<script>` within the component.
However, the component might be committed before the script has finished loading.
You can start depending on the script content once the `load` event is fired e.g. by using the `onLoad` prop.

React will de-duplicate scripts that have the same `src`, inserting only one of them into the DOM even if multiple components render it.
>>>>>>> 169d5c1820cd1514429bfac2a923e51dd782d37e

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
スクリプトを使用する場合、[preinit](/reference/react-dom/preinit) 関数を呼び出すことが有用です。この関数を呼び出すことで、たとえば [HTTP Early Hints レスポンス](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103)を送信でき、ブラウザがスクリプトのフェッチをより早く開始できるかもしれません。
</Note>

### インラインスクリプトのレンダー {/*rendering-an-inline-script*/}

<<<<<<< HEAD
インラインスクリプトを含めるには、`<script>` コンポーネントをレンダーする際に children としてスクリプトのソースコードを指定します。インラインスクリプトは重複解消処理が行われず、ドキュメントの `<head>` に移動されません。外部リソースを読み込まないため、コンポーネントがサスペンド状態になることはありません。
=======
To include an inline script, render the `<script>` component with the script source code as its children. Inline scripts are not de-duplicated or moved to the document `<head>`.
>>>>>>> 169d5c1820cd1514429bfac2a923e51dd782d37e

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
