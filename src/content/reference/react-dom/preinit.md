---
title: preinit
---

<Note>

<<<<<<< HEAD
[React ベースのフレームワーク](/learn/start-a-new-react-project)は、多くの場合リソースの読み込みを自動で処理してくれるため、この API を直接呼び出す必要はないかもしれません。詳細はフレームワークのドキュメントを参照してください。
=======
[React-based frameworks](/learn/creating-a-react-app) frequently handle resource loading for you, so you might not have to call this API yourself. Consult your framework's documentation for details.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

</Note>

<Intro>

`preinit` を使用して、スタイルシートや外部スクリプトを事前にフェッチして評価することができます。

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

スクリプトやスタイルシートを事前初期化するためには、`react-dom` の `preinit` 関数を呼び出します。

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[さらに例を見る](#usage)

`preinit` 関数は、指定されたリソースのダウンロードと実行を開始するようブラウザに対してヒントを与えます。これにより時間を節約できる可能性があります。`preinit` されたスクリプトは、ダウンロードが完了すると実行されます。preinit されたスタイルシートはドキュメントに挿入され、すぐに効果が現れます。

#### 引数 {/*parameters*/}

* `href`: 文字列。ダウンロードして実行したいリソースの URL。
* `options`: オブジェクト。以下のプロパティを含みます。
  * `as`: 必須の文字列。リソースの種別。可能な値は `script` と `style` です。
  * `precedence`: 文字列。スタイルシートの場合は必須。他のスタイルシートに対する相対的な挿入位置を指定します。優先度が高いスタイルシートは、低いものをオーバーライドできます。指定可能な値は `reset`、`low`、`medium`、`high` です。
  * `crossOrigin`: 文字列。使用する [CORS ポリシー](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin)。可能な値は `anonymous` と `use-credentials` です。
  * `integrity`: 文字列。[真正性を検証する](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)ために使用するリソースの暗号化ハッシュ。
  * `nonce`: 文字列。厳格なコンテンツセキュリティポリシーを使用する際に[リソースを許可するための暗号化 nonce](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)。
  * `fetchPriority`: 文字列。リソースの相対的なフェッチ優先度のヒントです。指定可能な値は `auto`（デフォルト）、`high`、`low` です。

#### 返り値 {/*returns*/}

`preinit` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じ `href` で `preinit` を複数回呼び出した場合の効果は、一度のみ呼び出した場合と同様です。
* ブラウザからは、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内も含むどんな状況においても `preinit` の呼び出しが可能です。
* サーバサイドレンダリングやサーバコンポーネントのレンダー時には、コンポーネントのレンダー中やレンダーから派生した非同期処理の中で `preinit` を呼び出した場合にのみ効果があります。それ以外の呼び出しは無視されます。

---

## 使用法 {/*usage*/}

### レンダー時の事前初期化 {/*preiniting-when-rendering*/}

コンポーネントをレンダーする際に自身あるいはその子が特定のリソースを使用することが分かっており、かつそのリソースがダウンロードされた直後に評価され効果が現れても問題ないという場合、`preinit` を呼び出します。

<Recipes titleText="事前初期化の例">

#### 外部スクリプトの事前初期化 {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

ブラウザにスクリプトをダウンロードさせたいが、すぐに実行させたくない場合は、代わりに [`preload`](/reference/react-dom/preload) を使用してください。ESM モジュールをロードしたい場合は、[`preinitModule`](/reference/react-dom/preinitModule) を使用してください。

<Solution />

#### スタイルシートの事前初期化 {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

`precedence` オプション（必須）を使用することで、ドキュメント内でのスタイルシートの順序を制御します。優先度が高いスタイルシートは、優先度が低いものをオーバーライドできます。

スタイルシートをダウンロードしたいがすぐにはドキュメントに挿入したくないという場合、代わりに [`preload`](/reference/react-dom/preload) を使用してください。

<Solution />

</Recipes>

### イベントハンドラ内での事前初期化 {/*preiniting-in-an-event-handler*/}

外部リソースを必要とするページ遷移や状態遷移を行う前に、イベントハンドラで `preinit` を呼び出しておきます。これにより、新しいページや状態がレンダーされる時点で読み込むのと比べ、早期に処理を開始できます。

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
