---
title: preinitModule
canary: true
---

<Canary>

`preinitModule` 関数は、現在 React の Canary および experimental チャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

<Note>

[React ベースのフレームワーク](/learn/start-a-new-react-project)は、多くの場合リソースの読み込みを自動で処理してくれるため、この API を直接呼び出す必要はないかもしれません。詳細はフレームワークのドキュメントを参照してください。

</Note>

<Intro>

`preinitModule` は、ESM モジュールを事前にフェッチして評価することができます。

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

ESM モジュールを事前初期化するためには、`react-dom` の `preinitModule` 関数を呼び出します。

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[さらに例を見る](#usage)

`preinitModule` 関数は、指定されたモジュールのダウンロードと実行を開始するようブラウザに対してヒントを与えます。これにより時間を節約できる可能性があります。事前初期化されたスクリプトは、ダウンロードが完了すると実行されます。

#### 引数 {/*parameters*/}

<<<<<<< HEAD
* `href`: 文字列。ダウンロードして実行したいモジュールの URL。
* `options`: オブジェクト。以下のプロパティを含みます。
  *  `as`: 必須の文字列。`'script'` である必要があります。
  *  `crossOrigin`: 文字列。使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は `anonymous` と `use-credentials` です。
  *  `integrity`: 文字列。[真正性を検証する](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)ために使用するリソースの暗号化ハッシュ。
  *  `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際に[リソースを許可するための暗号化 nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
=======
* `href`: a string. The URL of the module you want to download and execute.
* `options`: an object. It contains the following properties:
  *  `as`: a required string. It must be `'script'`.
  *  `crossOrigin`: a string. The [CORS policy](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) to use. Its possible values are `anonymous` and `use-credentials`.
  *  `integrity`: a string. A cryptographic hash of the module, to [verify its authenticity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: a string. A cryptographic [nonce to allow the module](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) when using a strict Content Security Policy. 
>>>>>>> 1697ae89a3bbafd76998dd7496754e5358bc1e9a

#### 返り値 {/*returns*/}

`preinitModule` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じ `href` で `preinitModule` を複数回呼び出した場合の効果は、一度のみ呼び出した場合と同様です。
* ブラウザからは、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内も含むどんな状況においても `preinitModule` の呼び出しが可能です。
* サーバサイドレンダリングやサーバコンポーネントのレンダー時には、コンポーネントのレンダー中やレンダーから派生した非同期処理の中で `preinitModule` を呼び出した場合にのみ効果があります。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダー時のプリロード {/*preloading-when-rendering*/}

コンポーネントをレンダーする際に自身あるいはその子が特定のモジュールを使用することが分かっており、かつそのモジュールがダウンロードされた直後に評価され効果が現れても問題ないという場合、`preinitModule` を呼び出します。

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

ブラウザにモジュールをダウンロードさせたいが、すぐに実行させたくない場合は、代わりに [`preloadModule`](/reference/react-dom/preloadModule) を使用してください。ESM モジュールではないスクリプトを事前初期化したい場合は、[`preinit`](/reference/react-dom/preinit) を使用してください。

### イベントハンドラ内でのプリロード {/*preloading-in-an-event-handler*/}

外部リソースを必要とするページ遷移や状態遷移を行う前に、イベントハンドラで `preinitModule` を呼び出しておきます。これにより、新しいページや状態がレンダーされる時点で読み込むのと比べ、早期に処理を開始できます。

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
