---
title: hydrateRoot
---

<Intro>

`hydrateRoot` を使用すると、[`react-dom/server`](/reference/react-dom/server) によって事前生成した HTML コンテンツが含まれるブラウザ DOM ノード内に、React コンポーネントを表示できます。

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

`hydrateRoot` を呼び出して、サーバ環境で事前に React がレンダーした HTML に対して React を「アタッチ」します。

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React は、`domNode` 内に存在する HTML にアタッチし、その内部の DOM の管理を引き継ぎます。React で完全に構築されたアプリには、ルートコンポーネントを引数にした `hydrateRoot` 呼び出しが通常 1 つのみ存在します。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `domNode`: サーバ上でルート要素としてレンダーされた [DOM 要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。

* `reactNode`: 既存の初期 HTML をレンダーするために使用された "React ノード"。これは通常、`ReactDOM Server` のメソッド（例：`renderToPipeableStream(<App />)`）でレンダーされた JSX、例えば `<App />` になります。

* **省略可能** `options`: この React ルートのオプションを含むオブジェクト。

  * **省略可能** `onCaughtError`: エラーバウンダリ内で React がエラーをキャッチしたときに呼び出されるコールバック。エラーバウンダリにキャッチされた `error` と、`componentStack` を含んだ `errorInfo` を引数にして呼び出されます。
  * **省略可能** `onUncaughtError`: エラーがスローされたがエラーバウンダリでキャッチされなかったときに呼び出されるコールバック。スローされた `error` と、`componentStack` を含んだ `errorInfo` を引数にして呼び出されます。
  * **optional** `onRecoverableError`: React が自動的にエラーから回復したときに呼び出されるコールバック。React がスローする `error` と、`componentStack` を含んだ `errorInfo` を引数にして呼び出されます。復帰可能なエラーの一部は元のエラーを `error.cause` として含んでいます。
  * **省略可能** `identifierPrefix`: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。サーバ上で使用されたものと同じプレフィックスでなければなりません。


#### 返り値 {/*returns*/}

`hydrateRoot` は、[`render`](#root-render) と [`unmount`](#root-unmount) の 2 つのメソッドを持つオブジェクトを返します。

#### 注意点 {/*caveats*/}

* `hydrateRoot()` は、レンダーされたコンテンツがサーバでレンダーされたコンテンツと同一であることを期待しています。不一致はバグとして扱い修正する必要があります。
* 開発モードでは、React はハイドレーション中の不一致について警告します。不一致が発生した場合、属性の違いが修正される保証はありません。これはパフォーマンス上の理由から重要です。なぜならほとんどのアプリでは、不一致はまれであり、すべてのマークアップを検証することは非常に高コストになるからです。
* アプリには通常、`hydrateRoot` 呼び出しは 1 つだけ存在します。フレームワークを使用している場合、フレームワークがこの呼び出しを行うかもしれません。
* アプリがクライアントでレンダーする形式であり、事前レンダーされた HTML がない場合、`hydrateRoot()` は使用できません。代わりに [`createRoot()`](/reference/react-dom/client/createRoot) を使用してください。

---

### `root.render(reactNode)` {/*root-render*/}

`root.render` を呼び出して、ブラウザ DOM 要素内にハイドレーションされた React ルート内の React コンポーネントを更新します。

```js
root.render(<App />);
```

React はハイドレーションされた `root` 内の `<App />` を更新します。

[さらに例を見る](#usage)

#### 引数 {/*root-render-parameters*/}

* `reactNode`: 更新したい "React ノード"。通常は `<App />` のような JSX ですが、[`createElement()`](/reference/react/createElement) で構築した React 要素や、文字列、数値、`null`、または `undefined` を渡すこともできます。


#### 返り値 {/*root-render-returns*/}

`root.render` は `undefined` を返します。

#### 注意点 {/*root-render-caveats*/}

* ルートがハイドレーションを完了する前に `root.render` を呼び出すと、React は既存のサーバレンダリングされた HTML コンテンツをクリアし、ルート全体をクライアントでのレンダーに切り替えます。

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount` を呼び出して、React ルート内にレンダーされたツリーを破棄します。

```js
root.unmount();
```

React で完全に構築されたアプリには、通常、`root.unmount` の呼び出しは一切ありません。

これは主に、React ルートの DOM ノード（またはその祖先のいずれか）が他のコードによって DOM から削除される可能性がある場合に有用です。例えば、非アクティブなタブを DOM から削除する jQuery のタブパネルがあると想像してみてください。タブが削除されると、（React ルートを含んだ）内部のすべてが DOM から削除されます。その場合、削除されたルートのコンテンツの管理を「停止」するよう React に伝えるために `root.unmount` を呼び出す必要があります。そうしないと、削除されたルート内のコンポーネントは、データ購読などのグローバルリソースをクリーンアップして解放する必要があるということが分からないままになります。

<<<<<<< HEAD
`root.unmount` を呼び出すことで、ルート内のすべてのコンポーネントがアンマウントされ、React がルート DOM ノードから「切り離され」ます。これには、ツリー内のイベントハンドラや state の削除も含まれます。
=======
Calling `root.unmount` will unmount all the components in the root and "detach" React from the root DOM node, including removing any event handlers or state in the tree.
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669


#### 引数 {/*root-unmount-parameters*/}

`root.unmount` は引数を受け付けません。


#### 返り値 {/*root-unmount-returns*/}

`root.unmount` は `undefined` を返します。

#### 注意点 {/*root-unmount-caveats*/}

* `root.unmount` を呼び出すと、ツリー内のすべてのコンポーネントがアンマウントされ、React がルート DOM ノードから「切り離され」ます。

* `root.unmount` を呼び出した後、同一ルートで再度 `root.render` を呼び出すことはできません。アンマウント済みのルートで `root.render` を呼び出そうとすると、"Cannot update an unmounted root" というエラーがスローされます。

---

## 使用法 {/*usage*/}

### サーバでレンダーされた HTML のハイドレーション {/*hydrating-server-rendered-html*/}

あなたのアプリの HTML が [`react-dom/server`](/reference/react-dom/client/createRoot) によって生成されている場合、クライアント上それに対する*ハイドレーション*を行う必要があります。

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

これにより、<CodeStep step={1}>ブラウザ DOM ノード</CodeStep>内にあるサーバからの HTML がハイドレーションされ、あなたのアプリの <CodeStep step={2}>React コンポーネント</CodeStep>となります。通常、これはスタートアップ時に一度のみ行います。フレームワークを使用している場合はあなたの代わりにこの呼び出しが自動で行われるかもしれません。

アプリのハイドレーション時に React は、サーバで生成された初期 HTML に、あなたのコンポーネントのロジックを「アタッチ」します。ハイドレーションにより、サーバからの初期 HTML スナップショットが、ブラウザで動作する完全にインタラクティブなアプリに変化します。

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Hello, world!</h1><button>You clicked me <!-- -->0<!-- --> times</button></div>
```

```js src/index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Hello, world!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      You clicked me {count} times
    </button>
  );
}
```

</Sandpack>

通常、`hydrateRoot` を再度呼び出したり、複数の場所で呼び出したりする必要はありません。ここから先は、React がアプリケーションの DOM を管理しています。UI を更新するには、コンポーネントは [state を使うことになるでしょう](/reference/react/useState)。

<Pitfall>

`hydrateRoot` に渡す React ツリーは、サーバ上で行った出力と**同じ出力**を生成する必要があります。

これはユーザ体験にとって重要です。ユーザはあなたの JavaScript コードがロードされる前に、サーバが生成した HTML を一定時間見ています。サーバレンダリングによりアプリの出力の HTML スナップショットを表示することで、アプリが素早くロードされているという錯覚が作り出されます。突然異なるコンテンツを表示すると、その錯覚が壊れてしまいます。このため、サーバからのレンダーの出力はクライアント上での初期レンダーの出力と一致する必要があるのです。

ハイドレーションエラーを引き起こす最も一般的な原因としては以下のようなものがあります。

* ルートノード内の React が生成した HTML の周囲に余分な空白（改行など）がある。
* レンダーのロジックで `typeof window !== 'undefined'` のようなチェックを使用している。
* レンダーのロジックで [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) のようなブラウザ専用の API を使用している。
* サーバとクライアントで異なるデータをレンダーしている。

React は一部のハイドレーションエラーから回復できますが、**他のバグと同様にそれらを修正する必要があります**。運がよければアプリが遅くなるだけですが、最悪の場合、イベントハンドラが誤った要素にアタッチされる可能性があります。

</Pitfall>

---

### ドキュメント全体のハイドレーション {/*hydrating-an-entire-document*/}

React で完全に構築されたアプリケーションは、[`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html) タグを含むドキュメント全体を JSX としてレンダーすることができます。

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

ドキュメント全体をハイドレートするには、`hydrateRoot` の最初の引数として [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) グローバル変数を渡します。

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### やむを得ないハイドレーション不一致エラーの抑制 {/*suppressing-unavoidable-hydration-mismatch-errors*/}

サーバとクライアントの間で、単一の要素の属性やテキストコンテンツがやむを得ない理由で異なる場合（たとえば、タイムスタンプなど）、ハイドレーションの不一致警告を抑制することができます。

要素のハイドレーション警告を抑制するには、`suppressHydrationWarning={true}` を追加します。

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Current Date: <!-- -->01/01/2020</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Current Date: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

<<<<<<< HEAD
これは単一レベルの深さまでしか機能せず、避難ハッチとしての使用を意図しています。過度に使用しないでください。これを使用してもテキストコンテンツ以外の場合は React は違いを修正しようとはしないため、将来の更新まで一貫性が保たれない可能性があります。
=======
This only works one level deep, and is intended to be an escape hatch. Don’t overuse it. React will **not** attempt to patch mismatched text content.
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

---

### クライアントとサーバで異なるコンテンツの処理 {/*handling-different-client-and-server-content*/}

サーバとクライアントで意図的に異なるものをレンダーする必要がある場合、2 回に分けたレンダーを行うことができます。クライアントで異なるものをレンダーするコンポーネントは、`isClient` のような [state 変数](/reference/react/useState)を読み取るようにし、この変数を[エフェクト](/reference/react/useEffect)内で `true` に設定することができます。

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js src/index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js src/App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

この方法では、初回のレンダーはサーバと同じコンテンツをレンダーし、不一致を回避しますが、追加のレンダーがハイドレーションの直後に同期的に行われます。

<Pitfall>

このアプローチではコンポーネントを 2 回レンダーする必要があるためハイドレーションが遅くなります。低速な接続におけるユーザ体験に注意してください。JavaScript コードは初期レンダーされた HTML よりもかなり遅く読み込まれる場合があるため、ハイドレーション直後に異なる UI をレンダーするとユーザに不快感を与えるかもしれません。

</Pitfall>

---

### ハイドレーションされたルートコンポーネントの更新 {/*updating-a-hydrated-root-component*/}

ルートのハイドレーションが完了した後、[`root.render`](#root-render) を呼び出してルートの React コンポーネントを更新することができます。**[`createRoot`](/reference/react-dom/client/createRoot) の場合とは異なり、初期コンテンツはすでに HTML としてレンダーされているため、通常はこれを行う必要はありません**。

ハイドレーションの後のどこかのタイミングで `root.render` を呼び出し、コンポーネントツリーの構造が以前にレンダーされたものと一致していれば、React は [state を保持します](/learn/preserving-and-resetting-state)。以下の例で入力フィールドにタイプできることに着目してください。つまり毎秒 `render` が繰り返し呼び出されていますが、更新により DOM が破壊されていないということです。

<Sandpack>

```html public/index.html
<!--
  All HTML content inside <div id="root">...</div> was
  generated by rendering <App /> with react-dom/server.
-->
<div id="root"><h1>Hello, world! <!-- -->0</h1><input placeholder="Type something here"/></div>
```

```js src/index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Hello, world! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

ハイドレーションされたルートで [`root.render`](#root-render) を呼び出すことは滅多にありません。通常、代わりにコンポーネントの中で [state を更新](/reference/react/useState) します。

<<<<<<< HEAD
### キャッチされないエラーに対するダイアログを表示 {/*show-a-dialog-for-uncaught-errors*/}

デフォルトでは React は、キャッチされなかったエラーをコンソールにログとして表示します。独自のエラーレポーティングを実装するには、省略可能なルートオプションである `onUncaughtError` を指定します。

```js [[1, 7, "onUncaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

<CodeStep step={1}>onUncaughtError</CodeStep> オプションに指定するのは、以下の 2 つの引数を付けて呼ばれる関数です。

1. スローされた <CodeStep step={2}>error</CodeStep>。
2. <CodeStep step={3}>errorInfo</CodeStep> オブジェクト。エラーの <CodeStep step={4}>componentStack</CodeStep> を含んでいる。

エラーダイアログを表示するために `onUncaughtError` ルートオプションを用いることが可能です。

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><div><span>This error shows the error dialog:</span><button>Throw error</button></div></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
=======
### Error logging in production {/*error-logging-in-production*/}

By default, React will log all errors to the console. To implement your own error reporting, you can provide the optional error handler root options `onUncaughtError`, `onCaughtError` and `onRecoverableError`:

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack", 15]]
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669
import { hydrateRoot } from "react-dom/client";
import { reportCaughtError } from "./reportError";

const container = document.getElementById("root");
const root = hydrateRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== "Known error") {
      reportCaughtError({
        error,
        componentStack: errorInfo.componentStack,
      });
    }
  },
});
```

<<<<<<< HEAD
```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>This error shows the error dialog:</span>
      <button onClick={() => setThrowError(true)}>
        Throw error
      </button>
    </div>
  );
}
```

</Sandpack>


### エラーバウンダリでキャッチしたエラーを表示 {/*displaying-error-boundary-errors*/}

デフォルトでは、React はエラーバウンダリによってキャッチされたすべてのエラーを `console.error` に記録します。この動作をオーバーライドするには、省略可能なルートオプションである `onCaughtError` を指定して、[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)によってキャッチされたエラーを処理するようにします。

```js [[1, 7, "onCaughtError"], [2, 7, "error", 1], [3, 7, "errorInfo"], [4, 11, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

<CodeStep step={1}>onCaughtError</CodeStep> オプションに指定するのは、以下の 2 つの引数を付けて呼ばれる関数です。

1. バウンダリによってキャッチされた <CodeStep step={2}>error</CodeStep>。
2. <CodeStep step={3}>errorInfo</CodeStep> オブジェクト。当該エラーの <CodeStep step={4}>componentStack</CodeStep> を含んでいる。

`onCaughtError` ルートオプションを用いて、エラーダイアログを表示したり、既知のエラーをログから除外したりできます。
=======
The <CodeStep step={1}>onCaughtError</CodeStep> option is a function called with two arguments:

1. The <CodeStep step={2}>error</CodeStep> that was thrown.
2. An <CodeStep step={3}>errorInfo</CodeStep> object that contains the <CodeStep step={4}>componentStack</CodeStep> of the error.

Together with `onUncaughtError` and `onRecoverableError`, you can implement your own error reporting system:
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

<Sandpack>

```js src/reportError.js
function reportError({ type, error, errorInfo }) {
  // The specific implementation is up to you.
  // `console.error()` is only used for demonstration purposes.
  console.error(type, error, "Component Stack: ");
  console.error("Component Stack: ", errorInfo.componentStack);
}

export function onCaughtErrorProd(error, errorInfo) {
  if (error.message !== "Known error") {
    reportError({ type: "Caught", error, errorInfo });
  }
}

export function onUncaughtErrorProd(error, errorInfo) {
  reportError({ type: "Uncaught", error, errorInfo });
}

export function onRecoverableErrorProd(error, errorInfo) {
  reportError({ type: "Recoverable", error, errorInfo });
}
```

```js src/index.js active
import { hydrateRoot } from "react-dom/client";
import App from "./App.js";
import {
  onCaughtErrorProd,
  onRecoverableErrorProd,
  onUncaughtErrorProd,
} from "./reportError";

const container = document.getElementById("root");
hydrateRoot(container, <App />, {
  // Keep in mind to remove these options in development to leverage
  // React's default handlers or implement your own overlay for development.
  // The handlers are only specfied unconditionally here for demonstration purposes.
  onCaughtError: onCaughtErrorProd,
  onRecoverableError: onRecoverableErrorProd,
  onUncaughtError: onUncaughtErrorProd,
});
```

```js src/App.js
import { Component, useState } from "react";

function Boom() {
  foo.bar = "baz";
}

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [triggerUncaughtError, settriggerUncaughtError] = useState(false);
  const [triggerCaughtError, setTriggerCaughtError] = useState(false);

  return (
    <>
      <button onClick={() => settriggerUncaughtError(true)}>
        Trigger uncaught error
      </button>
      {triggerUncaughtError && <Boom />}
      <button onClick={() => setTriggerCaughtError(true)}>
        Trigger caught error
      </button>
      {triggerCaughtError && (
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      )}
    </>
  );
}
```

<<<<<<< HEAD
```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### 復帰可能なハイドレーション不一致エラーに対するダイアログを表示 {/*show-a-dialog-for-recoverable-hydration-mismatch-errors*/}

React がハイドレーション時に不一致を検出した場合、自動的にクライアント側でレンダーの復帰をを試みます。デフォルトでは、ハイドレーション不一致に関するエラーは `console.error` に記録されます。この動作をオーバーライドするには、省略可能なルートオプションである `onRecoverableError` を指定します。

```js [[1, 7, "onRecoverableError"], [2, 7, "error", 1], [3, 11, "error.cause", 1], [4, 7, "errorInfo"], [5, 12, "componentStack"]]
import { hydrateRoot } from 'react-dom/client';

const root = hydrateRoot(
  document.getElementById('root'),
  <App />,
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        error.cause,
        errorInfo.componentStack
      );
    }
  }
);
```

<CodeStep step={1}>onRecoverableError</CodeStep> オプションに指定するのは、以下の 2 つの引数を付けて呼ばれる関数です。

1. React たスローした <CodeStep step={2}>error</CodeStep>。一部のエラーは元のエラーを <CodeStep step={3}>error.cause</CodeStep> として含んでいる。
2. <CodeStep step={4}>errorInfo</CodeStep> オブジェクト。エラーの <CodeStep step={5}>componentStack</CodeStep> を含んでいる。

`onRecoverableError` を用いてハイドレーション不一致に関するエラーダイアログを表示することができます。

<Sandpack>

```html index.html hidden
=======
```html public/index.html hidden
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Purposefully using HTML content that differs from the server-rendered content to trigger recoverable errors.
-->
<div id="root">Server content before hydration.</div>
</body>
</html>
```
</Sandpack>

## Troubleshooting {/*troubleshooting*/}


### "You passed a second argument to root.render" というエラーが出る {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

よくある間違いとして、`hydrateRoot` 用のオプションを `root.render(...)` に渡してしまうことが挙げられます。

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

修正するには、ルートオプションを `hydrateRoot(...)` に渡すようにしてください。`root.render(...)` ではありません。
```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = hydrateRoot(container, <App />, {onUncaughtError});
```
