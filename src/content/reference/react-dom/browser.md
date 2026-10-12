---
title: browser
---

<Intro>

`browser` を使うことで、サーバレンダリング中にコンポーネントをブラウザ専用としてマークできます。

```js
use(browser(reason?))
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `browser(reason?)` {/*browser*/}

[`use`](/reference/react/use) の中で `browser` を呼び出して、サーバレンダリング中にコンポーネントをブラウザ専用としてマークします。

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

サーバレンダリング中の場合、`use(browser())` はコンポーネントのレンダーを中断し、代わりに最も近い [`<Suspense>`](/reference/react/Suspense) バウンダリによるフォールバックが表示されるようにします。ブラウザでは、`use(browser())` は `undefined` を返し、コンポーネントは通常通りレンダーされます。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* **省略可能** `reason`: コンテンツをブラウザでレンダーする必要がある理由を説明する文字列または関数。この文字列、または関数の返り値が、[`onBrowserBailout`](#reporting-browser-only-rendering-on-the-server) に渡される `Error` の `cause` になります。サーバレンダラが `browser` の返り値を処理するたびに、React は理由を生成する関数を呼び出します。ブラウザでは呼び出されません。理由の生成にコストがかかる場合に `() => new Error(...)` のような関数を渡すようにしてください。

#### 返り値 {/*returns*/}

`browser` は、内部構造が非公開の値を返します。この値は、コンポーネント内で `use` に渡すことや、[サーバでのレンダーを中止する](#aborting-pending-server-rendering-for-the-browser)際の理由として使うことが可能です。ブラウザでは、この値を `use` に渡すと `undefined` が返されます。

#### 注意点 {/*caveats*/}

* サーバレンダリング中は、`use(browser())` が `<Suspense>` バウンダリ内にある必要があります。バウンダリがない場合、サーバでのレンダーは失敗します。
* `use(browser())` は、[クライアントコンポーネント](/reference/rsc/use-client)から呼び出す必要があります。[サーバコンポーネント](/reference/rsc/server-components)からは呼び出せません。
* `browser()` を単独で呼び出しても何も起きません。コンポーネントをブラウザ専用としてマークするには、`browser` の返した値を `use` に渡してください。この値をスローしないでください。

---

## 使用法 {/*usage*/}

### ブラウザでのみコンテンツをレンダーする {/*rendering-content-only-in-the-browser*/}

ブラウザでのみレンダーされるべきコンポーネント内で、`use` の中で `browser` を呼び出します。

これは、`typeof window` を確認する、マウント済み state が[エフェクト](/reference/react/useEffect)で設定されるまで待機する、フレームワークのオプションでサーバレンダリングを無効にする、といったテクニックの代わりに使用できるものです。

以下の例で **Reload** をクリックすると、初期 HTML 内のローディングフォールバックを確認できます。ハイドレーション後、React は `localStorage` から読み込んだ下書きを表示します。

<Sandpack>

```js src/App.js active
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';

function SavedDraft() {
  use(browser('The draft is stored in localStorage.'));
  const [draft, setDraft] = useState(
    () => localStorage.getItem('draft') ?? ''
  );

  function handleChange(event) {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    localStorage.setItem('draft', nextDraft);
  }

  return (
    <label>
      Draft:
      <textarea
        value={draft}
        onChange={handleChange}
        rows={4}
        cols={30}
      />
    </label>
  );
}

export default function App() {
  return (
    <>
      <h1>Saved draft</h1>
      <Suspense fallback={<p>Loading draft...</p>}>
        <SavedDraft />
      </Suspense>
    </>
  );
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Saved draft</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
          label, textarea { display: block; }
          textarea { margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Browser-only rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 160px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Note>

`use(browser())` は、クライアントコンポーネントから呼び出す必要があります。フレームワークがデフォルトでサーバコンポーネントを使う場合は、そのファイルに [`'use client'`](/reference/rsc/use-client) ディレクティブを追加するか、呼び出しを子のクライアントコンポーネントに移してください。

```js {1}
'use client';

import { use, useState } from 'react';
import { browser } from 'react-dom';

export default function SavedDraft() {
  use(browser('The saved draft is stored in localStorage.'));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}
```

</Note>

---

### サーバでのレンダーを条件付きで行う {/*conditionally-rendering-on-the-server*/}

他の [`use`](/reference/react/use) の呼び出しと同様に、`use(browser())` は条件文の中や早期リターンの後でも呼び出せます。これにより、props の値などの条件に基づいて、コンポーネントやカスタムフックをサーバレンダリングの対象から除外できます。

例えば、以下の `useTimeZone` フックは、省略可能なデフォルト値を受け取ります。React はデフォルト値が渡されるとその値を初期 HTML とブラウザで表示します。デフォルト値がない場合、コンポーネントはサーバレンダリング中にサスペンドし、ブラウザではデバイスのローカルタイムゾーンを表示します。

**Reload** をクリックすると、ユーザのタイムゾーンが表示される前のローディングフォールバックを確認できます。

<Sandpack>

```js src/App.js
import { Suspense } from 'react';
import { useTimeZone } from './useTimeZone.js';

function TimeZone({label, defaultTimeZone}) {
  const timeZone = useTimeZone(defaultTimeZone);
  return <p>{label}: <strong>{timeZone}</strong></p>;
}

export default function App() {
  return (
    <>
      <h1>Event details</h1>
      <TimeZone
        label="Event time zone"
        defaultTimeZone="America/New_York"
      />
      <Suspense fallback={<p>Loading your time zone...</p>}>
        <TimeZone label="Your time zone" />
      </Suspense>
    </>
  );
}
```

```js src/useTimeZone.js active
import { use } from 'react';
import { browser } from 'react-dom';

export function useTimeZone(defaultTimeZone) {
  if (defaultTimeZone !== undefined) {
    return defaultTimeZone;
  }

  use(browser('No default time zone was provided.'));
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
```

```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

サスペンス対応のデータ取得ライブラリを使う場合も、同様のパターンで条件に応じてサーバレンダリングを回避できます。

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser('useBrowserQuery: No initial data was provided.'));
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

`initialData` がある場合、React はサーバでコンポーネントを HTML にレンダーします。ない場合は、最も近い [`<Suspense>`](/reference/react/Suspense) バウンダリのフォールバックを HTML に残します。ブラウザでは、`useQuery` が通常通りデータを取得したり、クライアント側のキャッシュから読み取ったりできます。

---

### サーバでブラウザ専用レンダーの発生を通知させる {/*reporting-browser-only-rendering-on-the-server*/}

サーバレンダラに `onBrowserBailout` コールバックを渡すことで、ブラウザ専用レンダーが発生したことを通知させられます。React がサスペンスフォールバックを残してブラウザに引き継ぐ場合、サーバレンダラの `onError` コールバックや、[`hydrateRoot` の `onRecoverableError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production) コールバックは呼び出されません。以下の例では理由も渡しており、報告されるエラーの `cause` として取得できます。

```js
import { Suspense, use, useState } from 'react';
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

function SavedDraft() {
  use(browser(() => new Error('The saved draft is stored in localStorage.')));
  const [draft] = useState(() => localStorage.getItem('draft') ?? '');
  return <DraftEditor initialDraft={draft} />;
}

function App() {
  return (
    <Suspense fallback={<p>Loading saved draft...</p>}>
      <SavedDraft />
    </Suspense>
  );
}

const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
  },
  onBrowserBailout(error, errorInfo) {
    logBrowserBailout(error, errorInfo);
  }
});
```

`onBrowserBailout` は 2 つの引数を受け取ります。

1. ブラウザ専用レンダーが発生したことを説明する `Error`。`browser` に理由を渡してあった場合、このエラーの `cause` として取得できます。
2. ブラウザ専用レンダーがどこで発生したかを示す `componentStack` を持つ `errorInfo` オブジェクト。

理由を生成する関数は、どのような値でも返せます。新しい `Error` を返す関数を使えば、原因を表すエラーに独自スタックを持たせつつ、ブラウザでは `Error` を作成しないようにできます。React は理由を HTML にシリアライズしません。

フォールバックを表示するサスペンスバウンダリがない場合、サーバでのレンダーは失敗します。React は `onBrowserBailout` ではなく、レンダラの通常のエラーコールバックを通じて失敗を報告します。

---

### 未完了のサーバレンダリングを中止してブラウザに引き継ぐ {/*aborting-pending-server-rendering-for-the-browser*/}

サーバレンダリング API を直接呼び出している場合、まだ完了していないコンテンツの待機をやめて、ブラウザにレンダー完了を引き継がせることが可能です。サーバでのレンダーを中止する際に、`browser` の返した値を理由として渡してください。すると React は、まだ完了していないサスペンスバウンダリをフォールバックの状態のまま残し、そのコンテンツをブラウザでレンダーします。

```js {1,8}
import { browser } from 'react-dom';
import { renderToPipeableStream } from 'react-dom/server';

const { pipe, abort } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(response);
    setTimeout(() => {
      abort(browser('The server render timed out.'));
    }, 10000);
  }
});
```

中止の理由として `browser` の返した値を使っても、サーバレンダラの `onError` コールバックや、`hydrateRoot` の `onRecoverableError` コールバックは呼び出されません。代わりに、サーバレンダラは復帰した各サスペンスバウンダリを `onBrowserBailout` に報告します。

[`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) を受け取るサーバレンダリング API では、[`AbortController.abort`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort) に中止の理由として `browser()` を渡してください。
