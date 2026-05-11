---
title: preloadModule
---

<Note>

[React ベースのフレームワーク](/learn/creating-a-react-app)は、多くの場合リソースの読み込みを自動で処理してくれるため、この API を直接呼び出す必要はないかもしれません。詳細はフレームワークのドキュメントを参照してください。

</Note>

<Intro>

`preloadModule` は、使用予定の ESM モジュールを事前にフェッチすることができます。

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

ESM モジュールをプリロードするためには、`react-dom` の `preloadModule` 関数を呼び出します。

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[さらに例を見る](#usage)

`preloadModule` 関数は、指定されたモジュールのダウンロードを開始するようブラウザに対してヒントを与えます。これにより時間を節約できる可能性があります。

#### 引数 {/*parameters*/}

<<<<<<< HEAD
* `href`: 文字列。ダウンロードしたいモジュールの URL。
* `options`: オブジェクト。以下のプロパティを含みます。
  *  `as`: 必須の文字列。`'script'` である必要があります。
  *  `crossOrigin`: 文字列。使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は `anonymous` と `use-credentials` です。
  *  `integrity`: 文字列。[真正性を検証する](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)ために使用するリソースの暗号化ハッシュ。
  *  `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際に[リソースを許可するための暗号化 nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
=======
* `href`: a string. The URL of the module you want to download.
* `options`: an object. It contains the following properties:
  *  `as`: a required string. It must be `'script'`.
  *  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`.
  *  `integrity`: a string. A cryptographic hash of the module, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: a string. A cryptographic [nonce to allow the module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a


#### 返り値 {/*returns*/}

`preloadModule` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じ `href` で `preloadModule` を複数回呼び出した場合の効果は、一度のみ呼び出した場合と同様です。
* ブラウザからは、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内も含むどんな状況においても `preloadModule` の呼び出しが可能です。
* サーバサイドレンダリングやサーバコンポーネントのレンダー時には、コンポーネントのレンダー中やレンダーから派生した非同期処理の中で `preloadModule` を呼び出した場合にのみ効果があります。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダー時のプリロード {/*preloading-when-rendering*/}

コンポーネントをレンダーする際に自身あるいはその子が特定のモジュールを使用することが分かっている場合、`preloadModule` を呼び出します。

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

ブラウザにモジュールのダウンロードだけでなく実行もさせたい場合は、代わりに [`preinitModule`](/reference/react-dom/preinitModule) を使用します。ESM モジュールではないスクリプトを読み込みたい場合は、[`preload`](/reference/react-dom/preload) を使用します。

### イベントハンドラ内でのプリロード {/*preloading-in-an-event-handler*/}

外部リソースを必要とするページ遷移や状態遷移を行う前に、イベントハンドラで `preloadModule` を呼び出しておきます。これにより、新しいページや状態がレンダーされる時点で読み込むのと比べ、早期に処理を開始できます。

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
