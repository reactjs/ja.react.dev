---
title: captureOwnerStack
---

<Intro>

`captureOwnerStack` は、開発環境で現在のオーナスタック (Owner Stack) を読み取り、利用可能な場合は文字列として返します。

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

`captureOwnerStack` を呼び出して、現在のオーナスタックを取得します。

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### 引数 {/*parameters*/}

`captureOwnerStack` は引数を受け取りません。

#### 返り値 {/*returns*/}

`captureOwnerStack` は `string | null` を返します。

オーナスタックは、以下の状況で利用できます。
- コンポーネントのレンダー中
- エフェクト（`useEffect` など）内
- React のイベントハンドラ内（`<button onClick={...} />` など）
- React のエラーハンドラ（[React ルートオプション](/reference/react-dom/client/createRoot#parameters) の `onCaughtError`、`onRecoverableError`、`onUncaughtError` など）

オーナスタックが利用できない場合は `null` が返されます（[トラブルシューティング：オーナスタックが `null` になる](#the-owner-stack-is-null) を参照）。

#### 注意点 {/*caveats*/}

- オーナスタックは開発環境でのみ利用できます。開発環境以外では `captureOwnerStack` は常に `null` を返します。

<DeepDive>

#### オーナスタックとコンポーネントスタックの違い {/*owner-stack-vs-component-stack*/}

オーナスタックは、React のエラーハンドラで利用できるコンポーネントスタック（例：[`onUncaughtError` 内での `errorInfo.componentStack`](/reference/react-dom/client/hydrateRoot#show-a-dialog-for-uncaught-errors)）とは異なります。

例えば、次のコードを考えてみましょう。

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // The stacks are logged instead of showing them in the UI directly to
    // highlight that browsers will apply sourcemaps to the logged stacks.
    // Note that sourcemapping is only applied in the real browser console not
    // in the fake one displayed on this page.
    // Press "fork" to be able to view the sourcemapped stack in a real console.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` でエラーがスローされるとします。
そのエラーのコンポーネントスタックは次のようになります。

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

一方、オーナスタックは次のようになります。

```
at Component
```

このスタックでは、`App` や DOM コンポーネント（例：`fieldset`）は「オーナ」扱いとなりません。それらは `SubComponent` を「作成」したわけではなく、ノードを単に転送しただけだからです。`Component` は `<SubComponent />` というマークアップを通じて `SubComponent` ノードを作成しているのに対し、`App` は `children` を単にレンダーしているだけです。

また、`Navigation` や `legend` も、`<SubComponent />` を含むノードの兄弟であるためスタックには含まれません。

`SubComponent` はすでにコールスタックに含まれているため、オーナスタックには表示されません。

</DeepDive>

## 使用法 {/*usage*/}

### カスタムのエラーオーバーレイの機能強化 {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

<CodeStep step={1}>`console.error`</CodeStep> の呼び出しをインターセプトしてエラーオーバーレイとして表示する場合、<CodeStep step={2}>`captureOwnerStack`</CodeStep> を呼び出してオーナスタックを含めることができます。

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

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
  <h1 id="error-title" class="text-red">Error</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Display console.error() message
  errorBody.innerText = consoleMessage;

  // Display owner stack
  errorOwnerStack.innerText = ownerStack;

  // Show the dialog
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Keep in mind that in a real application, console.error can be
    // called with multiple arguments which you should account for.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## トラブルシューティング {/*troubleshooting*/}

### オーナスタックが `null` になる {/*the-owner-stack-is-null*/}

`captureOwnerStack` の呼び出しが React 管理外の関数（`setTimeout` のコールバック、`fetch` の後、カスタム DOM イベントハンドラなど）で行われています。レンダー中、エフェクト内、React 管理のイベントハンドラやエラーハンドラ（例：`hydrateRoot#options.onCaughtError`）内では、オーナスタックが利用できるはずです。

以下の例では、`captureOwnerStack` の呼び出しがカスタム DOM イベントハンドラ内で行われているため、ボタンをクリックしてもログに出力されるオーナスタックは空になります。オーナスタックの取得は、呼び出しをエフェクト本体に移動するなどして先に取得しておく必要があります。
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Should call `captureOwnerStack` here.
    function handleEvent() {
      // Calling it in a custom DOM event handler is too late.
      // The Owner Stack will be `null` at this point.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}
```

</Sandpack>

### `captureOwnerStack` 関数にアクセスできない {/*captureownerstack-is-not-available*/}

`captureOwnerStack` は開発ビルドでのみエクスポートされます。本番ビルドでは `undefined` になります。開発・本番両方でバンドルされるファイルで `captureOwnerStack` を使う場合は、名前付きインポートではなく名前空間インポートを使い、条件付きでアクセスするようにしてください。

```js
// Don't use named imports of `captureOwnerStack` in files that are bundled for development and production.
import {captureOwnerStack} from 'react';
// Use a namespace import instead and access `captureOwnerStack` conditionally.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
