---
title: lazy
---

<Intro>

`lazy` を使うことで、あるコンポーネントが初めてレンダーされるまで、そのコードの読み込みを遅延させることができます。

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `lazy(load)` {/*lazy*/}

`lazy` をコンポーネントの外部で呼び出し、遅延読み込みされる React コンポーネントを宣言します。

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `load`: [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) または *thenable*（`then` メソッドを持つ Promise のようなオブジェクト）を返す関数。返されたコンポーネントを初めてレンダーしようとするときまで React は `load` を呼び出しません。React が初めて `load` を呼び出した後、それが解決 (resolve) するのを待ち、解決した値の `.default` を React コンポーネントとしてレンダーします。返された Promise と解決済みの値は両方ともキャッシュされるため、React は `load` を 2 度以上呼び出しません。Promise が reject された場合、React はその理由を `throw` し、最も近いエラーバウンダリで処理できるようにします。

#### 戻り値 {/*returns*/}

`lazy` は、ツリー内でレンダーできる React コンポーネントを返します。遅延コンポーネントのコードがまだ読み込まれていない間、レンダーしようとするとサスペンド (suspend) します。[`<Suspense>`](/reference/react/Suspense) を使用して、読み込み中にローディングインジケータを表示します。

---

### `load` 関数 {/*load*/}

#### 引数 {/*load-parameters*/}

`load` は引数を受け取りません。

#### 返り値 {/*load-returns*/}

[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) または何らかの *thenable*（`then` メソッドを持つ Promise のようなオブジェクト）を返す必要があります。最終的に、有効な React コンポーネント型、つまり例えば関数、[`memo`](/reference/react/memo)、または [`forwardRef`](/reference/react/forwardRef) コンポーネントのようなものを `.default` プロパティとして持つオブジェクトに解決される必要があります。

---

## 使用法 {/*usage*/}

### サスペンスを使ったコンポーネントの遅延読み込み {/*suspense-for-code-splitting*/}

通常、コンポーネントは静的な [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 宣言を使ってインポートします。

```js
import MarkdownPreview from './MarkdownPreview.js';
```

このコンポーネントのコードの読み込みを、初めてレンダーされるときまで遅延させるには、このインポートを以下のように置き換えます。

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

このコードは[ダイナミック `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) を用いており、あなたのバンドラやフレームワークからのサポートが必要かもしれません。このパターンを用いる場合は、遅延インポートしようとしているコンポーネントが `default` でエクスポートされている必要があります。

コンポーネントのコードがオンデマンドで読み込まれるようになったので、読み込みの最中には何を表示するべきかを指定する必要があります。これは、遅延コンポーネントまたはその親のいずれかを [`<Suspense>`](/reference/react/Suspense) バウンダリでラップすることで行うことができます。

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

この例では、`MarkdownPreview` のコードはレンダーしようとするまで読み込まれません。もし `MarkdownPreview` がまだ読み込まれていない場合、その代わりに `Loading` が表示されます。チェックボックスをオンにしてみてください。

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Hello, **world**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Show preview
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Preview</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Loading...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

このデモは人為的に遅延させて読み込まれます。もう一度チェックボックスをオフにしてからオンにすると、`Preview` はキャッシュされているので、ローディング状態は表示されません。再度ローディング状態を表示するには、サンドボックスの "Reset" をクリックしてください。

[サスペンスを使ったローディング状態の管理についてもっと学ぶ](/reference/react/Suspense)

---

## トラブルシューティング {/*troubleshooting*/}

### `lazy` コンポーネントの state が予期せずリセットされる {/*my-lazy-components-state-gets-reset-unexpectedly*/}

`lazy` コンポーネントを他のコンポーネントの*内部*で宣言しないでください。

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Bad: This will cause all state to be reset on re-renders
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

代わりに、常にモジュールのトップレベルで宣言してください。

```js {3-4}
import { lazy } from 'react';

// ✅ Good: Declare lazy components outside of your components
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
