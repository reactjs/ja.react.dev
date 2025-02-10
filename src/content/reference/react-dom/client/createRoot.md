---
title: createRoot
---

<Intro>

`createRoot` は、ブラウザの DOM ノード内に React コンポーネントを表示するためのルートを作成します。

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

`createRoot` を呼び出して、ブラウザの DOM 要素内にコンテンツを表示するための React ルートを作成します。

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React は `domNode` に対応するルートを作成し、その内部の DOM を管理します。ルートを作成した後、その内部に React コンポーネントを表示するために [`root.render`](#root-render) を呼び出す必要があります。

```js
root.render(<App />);
```

React で完全に構築されたアプリには、ルートコンポーネントのための `createRoot` 呼び出しが通常 1 つのみ存在します。ページ内に React を「散りばめて」使用するページの場合は、必要なだけ複数のルートを持つことができます。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `domNode`: [DOM 要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。React はこの DOM 要素に対応するルートを作成し、レンダーされた React コンテンツを表示するための `render` など、関数をルート上で呼び出せるようにします。

* **省略可能** `options`: この React ルートに関するオプションが含まれたオブジェクト。

  * **省略可能** `onCaughtError`: エラーバウンダリ内で React がエラーをキャッチしたときに呼び出されるコールバック。エラーバウンダリにキャッチされた `error` と、`componentStack` を含んだ `errorInfo` を引数にして呼び出されます。
  * **省略可能** `onUncaughtError`: エラーがスローされたがエラーバウンダリでキャッチされなかったときに呼び出されるコールバック。スローされた `error` と、`componentStack` を含んだ `errorInfo` を引数にして呼び出されます。
  * **省略可能** `onRecoverableError`: React が自動的にエラーから回復したときに呼び出されるコールバック。React がスローする `error` と、`componentStack` を含んだ `errorInfo` を引数にして呼び出されます。復帰可能なエラーの一部は元のエラーを `error.cause` として含んでいます。
  * **省略可能** `identifierPrefix`: React が [`useId`](/reference/react/useId) によって生成する ID に使用する文字列プレフィックス。同じページ上に複数のルートを使用する際に、競合を避けるために用います。

#### 返り値 {/*returns*/}

`createRoot` は、[`render`](#root-render) と [`unmount`](#root-unmount) の 2 つのメソッドを持つオブジェクトを返します。

#### 注意点 {/*caveats*/}
* アプリがサーバレンダリングを使用している場合、`createRoot()` の使用はサポートされていません。代わりに [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) を使用してください。
* アプリ内で `createRoot` を呼び出すのは通常 1 回だけです。フレームワークを使用している場合、この呼び出しはフレームワークが代わりに行う可能性があります。
* DOM ツリー内の、コンポーネントの子ではない別の部分に JSX をレンダーしたい場合（例えばモーダルやツールチップ）、`createRoot` の代わりに [`createPortal`](/reference/react-dom/createPortal) を使用してください。

---

### `root.render(reactNode)` {/*root-render*/}

`root.render` を呼び出して、React ルートのブラウザ DOM ノードに [JSX](/learn/writing-markup-with-jsx)（"React ノード"）を表示します。

```js
root.render(<App />);
```

React は `root` に `<App />` を表示し、その内部の DOM の管理を行います。

[さらに例を見る](#usage)

#### 引数 {/*root-render-parameters*/}

* `reactNode`: 表示したい *React ノード*。通常は `<App />` のような JSX ですが、[`createElement()`](/reference/react/createElement) で構築した React 要素や、文字列、数値、`null`、または `undefined` を渡すこともできます。


#### 返り値 {/*root-render-returns*/}

`root.render` は `undefined` を返します。

#### 注意点 {/*root-render-caveats*/}

* `root.render` を初めて呼び出したとき、React は React ルート内の既存の HTML コンテンツをすべてクリアしてから、React コンポーネントをレンダーします。

* ルートの DOM ノードがサーバやビルド中に React によって生成された HTML を含んでいる場合は、既存の HTML にイベントハンドラをアタッチできる [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) を使用してください。

* 同じルートに対して `render` を複数回呼び出すと、React は最新の JSX を反映するために必要なだけの DOM の更新を行います。React は、渡された JSX を以前にレンダーしたツリーと[「マッチング」](/learn/preserving-and-resetting-state)して、DOM のどの部分が再利用でき、どの部分を再作成する必要があるのかを決定します。同じルートに対して複数回 `render` を呼び出すことは、ルートコンポーネントで [`set` 関数](/reference/react/useState#setstate)を呼び出すことに似ており、React は不必要な DOM 更新を回避します。

---

### `root.unmount()` {/*root-unmount*/}

`root.unmount` を呼び出して、React ルート内にレンダーされたツリーを破棄します。

```js
root.unmount();
```

React で完全に構築されたアプリには、通常、`root.unmount` の呼び出しは一切ありません。

これは主に、React ルートの DOM ノード（またはその祖先のいずれか）が他のコードによって DOM から削除される可能性がある場合に有用です。例えば、非アクティブなタブを DOM から削除する jQuery のタブパネルがあると想像してみてください。タブが削除されると、（React ルートを含んだ）内部のすべてが DOM から削除されます。その場合、削除されたルートのコンテンツの管理を「停止」するよう React に伝えるために `root.unmount` を呼び出す必要があります。そうしないと、削除されたルート内のコンポーネントは、データ購読などのグローバルリソースをクリーンアップして解放する必要があるということが分からないままになります。

`root.unmount` を呼び出すことで、ルート内のすべてのコンポーネントがアンマウントされ、React がルート DOM ノードから「切り離され」ます。これには、ツリー内のイベントハンドラや state の削除も含まれます。


#### 引数 {/*root-unmount-parameters*/}

`root.unmount` は引数を受け付けません。


#### 返り値 {/*root-unmount-returns*/}

`root.unmount` は `undefined` を返します。

#### 注意点 {/*root-unmount-caveats*/}

* `root.unmount` を呼び出すと、ツリー内のすべてのコンポーネントがアンマウントされ、React がルート DOM ノードから「切り離され」ます。

* `root.unmount` を呼び出した後、同一ルートで再度 `root.render` を呼び出すことはできません。アンマウント済みのルートで `root.render` を呼び出そうとすると、"Cannot update an unmounted root" というエラーがスローされます。ただし、ある DOM ノードに対する以前のルートがアンマウントされた後で、同じ DOM ノードに対して新しいルートを作成することは可能です。

---

## 使用法 {/*usage*/}

### React で完全に構築されたアプリのレンダー {/*rendering-an-app-fully-built-with-react*/}

アプリが完全に React で構築されている場合は、アプリ全体のための単一のルートを作成します。

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

通常、このコードは起動時に一度だけ実行する必要があります。このコードは以下のことを行います。

1. HTML で定義されている<CodeStep step={1}>ブラウザの DOM ノード</CodeStep>を見つけます。
2. アプリの <CodeStep step={2}>React コンポーネント</CodeStep>をその内部に表示します。

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- This is the DOM node -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
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

**アプリが完全に React で構築されている場合、さらにルートを作成したり、[`root.render`](#root-render) を再度呼び出したりする必要はありません**。

この時点から、React がアプリ全体の DOM を管理します。さらにコンポーネントを追加するには、[`App` コンポーネントの中にネストします](/learn/importing-and-exporting-components)。UI を更新する必要がある場合、各コンポーネントが [state を使用して行います](/reference/react/useState)。モーダルやツールチップなどの追加コンテンツをこの DOM ノードの外部に表示する必要がある場合、[ポータルを使ってレンダーします](/reference/react-dom/createPortal)。

<Note>

HTML が空の場合、アプリの JavaScript コードが読み込まれて実行されるまで、ユーザには空白のページが見え続けることになります。

```html
<div id="root"></div>
```

これは非常に遅く感じられることがあります！ これを解決するために、[サーバサイドで、あるいはビルド時に](/reference/react-dom/server)初期 HTML をコンポーネントから生成することができます。これにより、訪問者は JavaScript コードが読み込まれる前にテキストを読んだり、画像を見たり、リンクをクリックしたりすることができます。この最適化を自動で行う[フレームワークの使用](/learn/start-a-new-react-project#production-grade-react-frameworks)を推奨します。実行タイミングにより、この技術は*サーバサイドレンダリング (server-side rendering; SSR)* または *静的サイト生成 (static site generation; SSG)* と呼ばれます。

</Note>

<Pitfall>

**サーバレンダリングまたは静的生成を使用するアプリは、`createRoot` の代わりに [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を呼び出す必要があります**。これにより React は、HTML に書かれた DOM ノードを破棄して再作成するのではなく、ハイドレーション（再利用）するようになります。

</Pitfall>

---

### React で部分的に構築されたページのレンダー {/*rendering-a-page-partially-built-with-react*/}

ページが[完全には React で構築されていない](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)場合、`createRoot` を複数回呼び出して、React に管理させたいトップレベルの各 UI パーツに対してルートを作成することができます。各ルートで [`root.render`](#root-render) を呼び出して、それぞれに異なるコンテンツを表示することができます。

以下では、`index.html` ファイルに定義されている 2 つの異なる DOM ノードに 2 つの異なる React コンポーネントがレンダーされています。

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>This paragraph is not rendered by React (open index.html to verify).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Comments</h2>
      <Comment text="Hello!" author="Sophie" />
      <Comment text="How are you?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

また、[`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) を使用して新しい DOM ノードを作成し、それを手動でドキュメントに追加することもできます。

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // You can add it anywhere in the document
```

DOM ノードから React ツリーを削除し、それによって使用されたすべてのリソースをクリーンアップするには、[`root.unmount` を呼び出します](#root-unmount)。

```js
root.unmount();
```

これは主に、React コンポーネントが別のフレームワークで書かれたアプリの中にある場合に役立ちます。

---

### ルートコンポーネントの更新 {/*updating-a-root-component*/}

同じルートに対して `render` を複数回呼び出すことができます。コンポーネントツリーの構造が以前にレンダーされたものと一致していれば、React は [state を保持します](/learn/preserving-and-resetting-state)。以下の例で入力フィールドにタイプできることに着目してください。つまり毎秒 `render` が繰り返し呼び出されていますが、更新により DOM が破壊されていないということです。

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

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

`render` を複数回呼び出すことは滅多にありません。通常、コンポーネントは代わりに [state の更新](/reference/react/useState)を行います。

### キャッチされないエラーに対するダイアログを表示 {/*show-a-dialog-for-uncaught-errors*/}

デフォルトでは React は、キャッチされなかったエラーをコンソールにログとして表示します。独自のエラーレポーティングを実装するには、省略可能なルートオプションである `onUncaughtError` を指定します。

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
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

```html public/index.html hidden
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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
root.render(<App />);
```

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

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
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

<Sandpack>

```html public/index.html hidden
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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error, 
        componentStack: errorInfo.componentStack,
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>This error will not show the error dialog:</span>
        <button onClick={handleKnown}>
          Throw known error
        </button>
        <span>This error will show the error dialog:</span>
        <button onClick={handleUnknown}>
          Throw unknown error
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

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

### 復帰可能なエラーに対するダイアログを表示 {/*displaying-a-dialog-for-recoverable-errors*/}

React はレンダー中にスローされたエラーから復帰するためにコンポーネントを自動的に再度レンダーすることがあります。成功すると、コンソールに復帰可能なエラーについてログを残し、開発者に通知します。この動作をオーバーライドするには、省略可能なルートオプションである `onRecoverableError` を指定します。

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Recoverable error',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

<CodeStep step={1}>onRecoverableError</CodeStep> オプションに指定するのは、以下の 2 つの引数を付けて呼ばれる関数です。

1. React たスローした <CodeStep step={2}>error</CodeStep>。一部のエラーは元のエラーを <CodeStep step={3}>error.cause</CodeStep> として含んでいる。
2. <CodeStep step={4}>errorInfo</CodeStep> オブジェクト。エラーの <CodeStep step={5}>componentStack</CodeStep> を含んでいる。

`onRecoverableError` を用いてエラーダイアログを表示することができます。

<Sandpack>

```html public/index.html hidden
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
<!-- This is the DOM node -->
<div id="root"></div>
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
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

// 🚩 Bug: Never do this. This will force an error.
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>This component threw an error, but recovered during a second render.</p>
        <p>Since it recovered, no Error Boundary was shown, but <code>onRecoverableError</code> was used to show an error dialog.</p>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
    </div>
  );
}

function Throw({error}) {
  // Simulate an external value changing during concurrent render.
  errorThrown = true;
  foo.bar = 'baz';
}
```

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


---
## トラブルシューティング {/*troubleshooting*/}

### ルートを作成したが何も表示されない {/*ive-created-a-root-but-nothing-is-displayed*/}

アプリを実際にルートに*レンダー*するのを忘れていないか確認してください。

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

これを行うまでは何も表示されません。

---

### "You passed a second argument to root.render" というエラーが出る {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

よくある間違いとして、`createRoot` 用のオプションを `root.render(...)` に渡してしまうことが挙げられます。

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

修正するには、ルートオプションを `createRoot(...)` に渡すようにしてください。`root.render(...)` ではありません。
```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---

### "Target container is not a DOM element" というエラーが出る {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

このエラーは、`createRoot` に渡しているものが DOM ノードでないことを意味します。

何が起こっているのかわからない場合は、ログを出力してみてください。

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

例えば、`domNode` が `null` の場合、[`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) が `null` を返したことを意味します。これは、呼び出し時点でドキュメント内に指定した ID のノードが存在しない場合に発生します。こうなる理由はいくつか考えられます。

1. 探している ID が HTML ファイルで使用した ID と異なっている。タイプミスをチェックしてください！
2. DOM ノードがバンドルの `<script>` タグより*後ろ*にあるため、スクリプトから「見え」ない。

このエラーが発生するもうひとつの一般的な理由は、`createRoot(domNode)` ではなく `createRoot(<App />)` と書いてしまっていることです。

---

### "Functions are not valid as a React child." というエラーが出る {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

このエラーは、`root.render` に渡しているものが React コンポーネントでないことを意味します。

これは、`root.render` を `<Component />` ではなく `Component` のように呼び出した場合に発生することがあります。

```js {2,5}
// 🚩 Wrong: App is a function, not a Component.
root.render(App);

// ✅ Correct: <App /> is a component.
root.render(<App />);
```

または、`root.render` に関数を呼び出した結果ではなく関数自体を渡してしまった場合にも発生します。

```js {2,5}
// 🚩 Wrong: createApp is a function, not a component.
root.render(createApp);

// ✅ Correct: call createApp to return a component.
root.render(createApp());
```

---

### サーバレンダリングされた HTML が再作成される {/*my-server-rendered-html-gets-re-created-from-scratch*/}

アプリがサーバでレンダーする形式であり、React によって生成された初期 HTML がある場合、ルートを作成して `root.render` を呼び出すと、その HTML がすべて削除されて DOM ノードがゼロから再作成されることに気付かれるかもしれません。これにより処理が遅くなり、フォーカスやスクロール位置がリセットされ、ユーザ入力が失われる可能性があります。

サーバでレンダーされたアプリは、`createRoot` の代わりに [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を使用する必要があります。

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

API が異なることに注意してください。特に、通常はこの後さらに `root.render` を呼び出すことはありません。
