---
title: use
---

<Intro>

`use` は[プロミス (Promise)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) や[コンテクスト](/learn/passing-data-deeply-with-context)などのリソースをレンダー中に読み取るための React API です。

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `use(context)` {/*use-context*/}

[コンテクスト](/learn/passing-data-deeply-with-context)を指定して `use` を呼び出し、その値を読み取ります。[`useContext`](/reference/react/useContext) とは異なり、`use` はループや `if` のような条件文の中でも呼び出せます。

```js
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

[さらに例を見る](#usage-context)

#### 引数 {/*context-parameters*/}

* `context`: [`createContext`](/reference/react/createContext) で作成した[コンテクスト](/learn/passing-data-deeply-with-context)。

#### 返り値 {/*context-returns*/}

渡されたコンテクストの値です。この値は、呼び出し元コンポーネントより上にある最も近いコンテクストプロバイダによって決まります。プロバイダがない場合は、[`createContext`](/reference/react/createContext) に渡した `defaultValue` が返されます。

#### 注意点 {/*context-caveats*/}

* `use` はコンポーネントまたはフックの内部で呼び出す必要があります。
* [サーバコンポーネント](/reference/rsc/server-components)では、`use` によるコンテクストの読み取りはサポートされていません。

---

### `use(promise)` {/*use-promise*/}

[プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)を指定して `use` を呼び出し、その解決値を読み取ります。プロミスが保留中の間、`use` を呼び出したコンポーネントは*サスペンド*します。その名前に反して、`use` はフックではありません。フックとは異なり、ループや `if` のような条件文の中でも呼び出せます。

```js
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  // ...
```

`use` を呼び出すコンポーネントが[サスペンス](/reference/react/Suspense)バウンダリでラップされている場合、プロミスが保留中の間はフォールバックが表示されます。プロミスが解決されると、サスペンスのフォールバックは、`use` が返したデータを使用してレンダーされたコンポーネントに置き換わります。プロミスが拒否された場合は、最も近い[エラーバウンダリ (Error Boundary)](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) のフォールバックが表示されます。

[さらに例を見る](#usage-promises)

#### 引数 {/*promise-parameters*/}

* `promise`: 解決値を読み取りたい[プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)です。再レンダーをまたいで同じインスタンスが再利用されるように、プロミスを[キャッシュ](#caching-promises-for-client-components)する必要があります。

#### 返り値 {/*promise-returns*/}

プロミスの解決値です。

#### 注意点 {/*promise-caveats*/}

* `use` はコンポーネントまたはフックの内部で呼び出す必要があります。
* `use` を try-catch ブロック内で呼び出すことはできません。代わりに、コンポーネントを[エラーバウンダリ](#displaying-an-error-with-an-error-boundary)でラップしてエラーをキャッチし、フォールバックを表示します。
* `use` に渡すプロミスは、再レンダーをまたいで同じプロミスインスタンスが再利用されるようにキャッシュされている必要があります。[以下のプロミスのキャッシュに関する説明を参照してください](#caching-promises-for-client-components)。
* サーバコンポーネントからクライアントコンポーネントにプロミスを渡す場合、その解決後の値は[シリアライズ可能](/reference/rsc/use-client#serializable-types)でなければなりません。

---

### <CanaryBadge /> `use(browser())` {/*use-browser*/}

ブラウザでのみレンダーされるべきコンポーネントで、[`browser`](/reference/react-dom/browser) が返した値を指定して `use` を呼び出します。

```js
import { use } from 'react';
import { browser } from 'react-dom';

function BrowserOnly() {
  use(browser('This component requires browser APIs.'));
  return <BrowserContent />;
}
```

サーバレンダリング中は、`use(browser())` を呼び出したコンポーネントがサスペンドし、React は最も近い [`<Suspense>`](/reference/react/Suspense) バウンダリのフォールバックを HTML に含めます。ブラウザでは `use(browser())` が `undefined` を返すため、コンポーネントは通常どおりレンダーされます。

[以下で例を見る](#rendering-a-component-only-in-the-browser)

#### 引数 {/*browser-parameters*/}

* `browserValue`: [`browser`](/reference/react-dom/browser) が返す値です。

#### 返り値 {/*browser-returns*/}

ブラウザでは、`use(browser())` は `undefined` を返します。

#### 注意点 {/*browser-caveats*/}

* サーバレンダリング中、`use(browser())` を呼び出すコンポーネントは `<Suspense>` バウンダリの内部になければなりません。バウンダリがなければ、サーバレンダリングは失敗します。
* React サーバコンポーネントのアプリでは、`use(browser())` は[クライアントコンポーネント](/reference/rsc/use-client)から呼び出す必要があり、[サーバコンポーネント](/reference/rsc/server-components)からは呼び出せません。

---

## 使用法（コンテクスト） {/*usage-context*/}

### `use` でコンテクストを読み取る {/*reading-context-with-use*/}

[コンテクスト](/learn/passing-data-deeply-with-context)が `use` に渡された場合、[`useContext`](/reference/react/useContext) と同様に動作します。`useContext` はコンポーネントのトップレベルで呼び出す必要がありますが、`use` は `if` や `for` などの条件式の中でも呼び出すことができます。

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ...
```

`use` は、渡した<CodeStep step={1}>コンテクスト</CodeStep>の<CodeStep step={2}>値</CodeStep>を返します。コンテクストの値を決定するために、React はコンポーネントツリーを上方向に検索し、当該コンテクストに対応する**最も近いコンテクストプロバイダ (context provider)** を見つけます。

`Button` にコンテクストを渡すには、それまたはその親コンポーネントのいずれかを、対応するコンテクストプロバイダでラップします。

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

プロバイダと `Button` の間に何層のコンポーネントがあっても問題ありません。`Form` の内部の*どこか*で `Button` が `use(ThemeContext)` を呼び出すと、値として `"dark"` を受け取ることになります。

[`useContext`](/reference/react/useContext) とは異なり、<CodeStep step={2}>`use`</CodeStep> は <CodeStep step={1}>`if`</CodeStep> などの条件式やループの中で呼び出すことができます。

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> は <CodeStep step={1}>`if`</CodeStep> 文の中から呼び出さているため、条件付きでコンテクストから値を読み取ることができます。

<Pitfall>

`useContext` と同様に、`use(context)` は常にそれを呼び出しているコンポーネントの*上側*にある最も近いコンテクストプロバイダを探します。上方向に検索するため、`use(context)` を呼び出しているコンポーネント自体にあるコンテクストプロバイダは**考慮されません**。

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button show={true}>Sign up</Button>
      <Button show={false}>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### コンテクストからプロミスを読み取る {/*reading-a-promise-from-context*/}

props の穴掘り作業 (prop drilling) をせずに非同期データを共有するには、プロミスをコンテクスト値として設定し、`use(context)` で読み取ってから `use(promise)` で値を取り出します。

```js
import { use } from 'react';
import { UserContext } from './UserContext';

function Profile() {
  const userPromise = use(UserContext);
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}
```

コンテクスト値自体は await されないため、値の読み取りには `use` を 2 回呼び出す必要があります。コンテクストを使う前に検討すべき代替手段については、[コンテクストを使用する前に](/learn/passing-data-deeply-with-context#before-you-use-context)を参照してください。

プロミスを読み取るコンポーネントを[サスペンス](/reference/react/Suspense)バウンダリでラップすると、プロミスが保留中の間はそのサブツリーだけがサスペンドします。`use` によるプロミスの読み取りについて詳しくは、以下の[使用法（プロミス）](#usage-promises)を参照してください。

<Pitfall>

このパターンを[サーバコンポーネント](/reference/rsc/server-components)で使用する場合、プロミスを再フェッチするには、そのプロミスをコンテクストに設定するサーバコンポーネントを再フェッチする必要があります。ツリーの高い位置でプロミスをコンテクストに設定すると、アプリの大部分が不必要に再フェッチされるため避けてください。

</Pitfall>

---

## 使用法（プロミス） {/*usage-promises*/}

### `use` でプロミスを読み取る {/*reading-a-promise-with-use*/}

プロミスを指定して `use` を呼び出し、その解決値を読み取ります。プロミスが保留中の間、コンポーネントは[サスペンド](/reference/react/Suspense)します。

```js [[1, 4, "use(albumsPromise)"]]
import { use } from 'react';

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

<CodeStep step={1}>`use`</CodeStep> を呼び出すコンポーネントを[サスペンス](/reference/react/Suspense)バウンダリでラップすると、プロミスが保留中の間、React はフォールバックを表示できます。サスペンドしたコンポーネントより上にある最も近いサスペンスバウンダリが、そのフォールバックを表示します。プロミスが解決されると、React は `use` で値を読み取り、フォールバックをレンダーされたコンポーネントに置き換えます。

<Recipes titleText="use でプロミスを読み取る場合とエフェクトでフェッチする場合の比較" titleId="examples-promise">

#### `use` でデータフェッチ {/*fetching-data-with-use*/}

この例では、`Albums` がキャッシュ済みのプロミスを指定して `use` を呼び出します。プロミスが保留中の間、コンポーネントはサスペンドし、React は最も近いサスペンスのフォールバックを表示します。拒否されたプロミスは、最も近い[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)へ伝播します。

<Sandpack>

```js src/App.js active
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from './data.js';

export default function App() {
  return (
    <ErrorBoundary fallback={<p>Could not fetch albums.</p>}>
      <Suspense fallback={<Loading />}>
        <Albums />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }];
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

<Solution />

#### `useEffect` でデータフェッチ {/*fetching-data-with-useeffect*/}

`use` が登場する以前は、エフェクトでデータをフェッチし、データが到着したときに state を更新する方法が一般的でした。`use` と比べ、この方法では読み込み中とエラーの状態を手動で管理する必要があります。エフェクトでのデータフェッチが推奨されない理由について詳しくは、[そのエフェクトは不要かも](/learn/you-might-not-need-an-effect#fetching-data)を参照してください。

<Sandpack>

```js src/App.js active
import { useState, useEffect } from 'react';
import { fetchAlbums } from './data.js';

export default function App() {
  const [albums, setAlbums] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAlbums()
      .then(data => {
        setAlbums(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
export async function fetchAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }];
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

##### `use` に渡すプロミスはキャッシュすること {/*promises-must-cached*/}

レンダー中にプロミスを作成するとそれはレンダーのたびに再作成されるため、React がサスペンスのフォールバックを繰り返し表示し、コンテンツが表示されなくなります。

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));
  // ...
}
```

代わりに、キャッシュ、[サスペンス対応フレームワーク](/reference/react/Suspense#suspense-enabled-frameworks)、またはサーバコンポーネントから得たプロミスを渡してください。

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</Pitfall>

<DeepDive>

#### プロミスがレンダーのたびに再作成される理由 {/*why-promises-recreated*/}

[React はマウント前にサスペンドしたレンダーの state を保持しません](/reference/react/Suspense#caveats)。サスペンドするたびに React はレンダーを最初からやり直すため、レンダー中に作成したプロミスも再作成されます。

レンダー中に意図せずプロミスが再作成される一般的な例を以下に示します。

```js
function Albums() {
  // 🔴 `fetch` creates a new Promise on every render.
  const albums = use(fetch('/albums'));

  // 🔴 Uncached `async` function calls create a new Promise on every render.
  const albums = use((async () => {
    const res = await fetch('/albums');
    return res.json();
  })());

  // 🔴 Adding `.then` returns a new Promise on every render,
  // even if `fetchData` is cached.
  const albums = use(fetchData('/albums').then(res => res.json()));
  // ...
}
```

理想的には、イベントハンドラ、ルートローダ、サーバコンポーネントなどでレンダー前にプロミスを作成し、`use` を呼び出すコンポーネントに渡します。レンダー中に遅延フェッチを行うとネットワークリクエストの開始が遅れ、ウォーターフォールが発生する可能性があります。

```js
// ✅ fetchData reads the Promise from a cache.
const albums = use(fetchData('/albums'));
```

</DeepDive>

---

### クライアントコンポーネント用にプロミスをキャッシュする {/*caching-promises-for-client-components*/}

クライアントコンポーネントで `use` に渡すプロミスは、再レンダーをまたいで同じプロミスインスタンスが再利用されるようにキャッシュする必要があります。レンダー内で新しいプロミスを直接作成すると、React は再レンダーのたびにサスペンスのフォールバックを表示します。

```js
// ✅ Cache the Promise so the same one is reused across renders
let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}
```

`fetchData` 関数は、同じ URL で呼び出されるたびに同じプロミスを返します。再レンダー時に `use` が同じプロミスを受け取ると、サスペンドせずに、すでに解決された値を同期的に読み取ります。

<Note>

プロミスをキャッシュする方法は、サスペンスとともに使用するフレームワークによって異なります。通常、フレームワークにはキャッシュ機構が組み込まれています。フレームワークを使用しない場合は、上記のような単純なモジュールレベルのキャッシュや、[サスペンス対応データソース](/reference/react/Suspense#what-activates-a-suspense-boundary)を使用できます。

</Note>

以下の例では、"Re-render" をクリックすると、`App` の state が更新され、再レンダーがトリガされます。`fetchData` は同じキャッシュ済みプロミスを返すため、`Albums` はサスペンスのフォールバックを再び表示することなく、値を同期的に読み取ります。

<Sandpack>

```js src/App.js active
import { use, Suspense, useState } from 'react';
import { fetchData } from './data.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Re-render
      </button>
      <p>Render count: {count}</p>
      <Suspense fallback={<p>Loading...</p>}>
        <Albums />
      </Suspense>
    </>
  );
}

function Albums() {
  const albums = use(fetchData('/albums'));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/albums') {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }];
}
```

</Sandpack>

<DeepDive>

#### プロミスのキャッシュを実装する方法 {/*how-to-implement-a-promise-cache*/}

基本的なキャッシュの場合、URL をキーとしてプロミスを保存し、レンダーをまたいで同じインスタンスが再利用されるようにします。データがすでに利用可能な場合にサスペンスの不要なフォールバックが表示されることも避けるには、プロミスに `status` と `value`（または `reason`）フィールドを設定できます。React は `use` が呼び出されたときにこれらのフィールドを確認します。`status` が `'fulfilled'` なら、サスペンドせずに `value` を同期的に読み取ります。`status` が `'rejected'` なら `reason` をスローします。フィールドがないか `'pending'` ならサスペンドします。

```js
let cache = new Map();

function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}
```

これは主に、サスペンス互換のデータレイヤを構築するライブラリ作者にとって有用です。`status` フィールドがないプロミスには React 自身がこのフィールドを設定しますが、自分で設定しておけば、データがすでに利用可能な場合の余分なレンダーを避けられます。

このキャッシュパターンは、[データの再フェッチ](#re-fetching-data-in-client-components)（キャッシュキーの変更によって新しいフェッチをトリガする）や、[ホバー時のデータのプリロード](#preloading-data-on-hover)（早めに `fetchData` を呼び出すことで、`use` が読み取る時点ではプロミスがすでに解決している可能性がある）の基礎になります。

</DeepDive>

<Pitfall>

##### プロミスがすでに決定しているかどうかを基準に `use` の呼び出しを省略しない {/*conditional-use*/}

他のフックとは異なり、`use` は条件文やループの中で呼び出せますが、プロミスそのものについては必ず `use` を呼び出す必要があります。`use` を迂回するために `promise.status` や `promise.value` を直接読み取ってはいけません。必ずプロミスを `use` に渡し、React に処理させてください。


```js
// 🔴 Don't bypass `use` by reading promise status directly
if (promise.status === 'fulfilled') {
  return promise.value;
}
const value = use(promise);
```

```js
// ✅ Pass the promise to `use` and let React track the promise
const value = use(promise);
```

このように `use` を迂回すると、React のサスペンス最適化や React DevTools 向けのサスペンス機能が壊れる可能性があります。`use(promise)` は条件付きで呼び出せますが、プロミス自体の状態に基づいて条件付きで `use(promise)` を呼び出してはいけません。

</Pitfall>

---

### クライアントコンポーネントでデータを再フェッチする {/*re-fetching-data-in-client-components*/}

同じ URL のデータを更新するには（例えば "Refresh" ボタンを使う場合）、キャッシュエントリを無効化し、[`startTransition`](/reference/react/startTransition) 内で新しいフェッチを開始します。結果のプロミスを state に保存して、再レンダーをトリガします。更新がトランジション内で行われるため、新しいプロミスが保留中の間も React は既存のコンテンツを表示し続けます。

```js
function App() {
  const [albumsPromise, setAlbumsPromise] = useState(fetchData('/albums'));
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/albums'));
    });
  }
  // ...
}
```

`refetchData` は古いキャッシュエントリを削除し、同じ URL への新しいフェッチを開始します。結果のプロミスを state に保存すると、トランジション内で再レンダーがトリガされます。再レンダー時に `Albums` が新しいプロミスを受け取り、`use` がそのプロミスに対してサスペンドする間、React は古いコンテンツを表示し続けます。

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import { use } from 'react';
import { fetchData, refetchData } from './data.js';

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <>
      <button
        onClick={handleRefresh}
        disabled={isPending}
      >
        {isPending ? 'Refreshing...' : 'Refresh'}
      </button>
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <Suspense fallback={<Loading />}>
          <Albums albumsPromise={albumsPromise} />
        </Suspense>
      </div>
    </>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  return fetchData(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums();
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }];
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

<Note>

通常、サスペンスをサポートするフレームワークには、独自のキャッシュ機構と無効化機構があります。上記のカスタムキャッシュはパターンを理解するうえでは役立ちますが、実際にはフレームワークのデータフェッチ手段を優先してください。

</Note>

---

### ホバー時にデータをプリロード {/*preloading-data-on-hover*/}

ホバーイベント中に `fetchData` を呼び出すことで、データが必要になる前に読み込みを開始できます。`fetchData` はプロミスをキャッシュするため、ユーザがクリックする時点でデータをすでに利用可能にできているかもしれません。`use` が読み取る時点でプロミスが解決済みなら、React はサスペンスのフォールバックを表示せず、すぐにコンポーネントをレンダーします。

```js
<button
  onMouseEnter={() => fetchData(`/${id}/albums`)}
  onClick={() => {
    startTransition(() => {
      setArtistId(id);
    });
  }}
>
```

以下の例では、アーティストのボタンにホバーすると、そのアルバムのバックグラウンドでのフェッチが始まります。先にホバーせずクリックすると、読み込み中のフォールバックが表示されます。違いを確認するため、ボタンをクリックする前にしばらくホバーしてみてください。

<Sandpack>

```js src/App.js active
import { Suspense, useState, useTransition } from 'react';
import Albums from './Albums.js';
import { fetchData } from './data.js';

export default function App() {
  const [artistId, setArtistId] = useState('the-beatles');
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <div>
        {['the-beatles', 'led-zeppelin', 'pink-floyd'].map(id => (
          <button
            key={id}
            onMouseEnter={() => {
              fetchData(`/${id}/albums`);
            }}
            onClick={() => {
              startTransition(() => {
                setArtistId(id);
              });
            }}
          >
            {id === 'the-beatles' ? 'The Beatles' :
             id === 'led-zeppelin' ? 'Led Zeppelin' :
             'Pink Floyd'}
          </button>
        ))}
      </div>
      <Suspense key={artistId} fallback={<Loading />}>
        <Albums artistId={artistId} />
      </Suspense>
    </>
  );
}

function Loading() {
  return <h2>Loading...</h2>;
}
```

```js src/Albums.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    const promise = getData(url);
    // Set status fields so React can read the value
    // synchronously if the Promise resolves before
    // `use` is called (e.g. when preloading on hover).
    promise.status = 'pending';
    promise.then(
      value => {
        promise.status = 'fulfilled';
        promise.value = value;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    cache.set(url, promise);
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/the-beatles/albums')) {
    return await getAlbums('the-beatles');
  } else if (url.startsWith('/led-zeppelin/albums')) {
    return await getAlbums('led-zeppelin');
  } else if (url.startsWith('/pink-floyd/albums')) {
    return await getAlbums('pink-floyd');
  } else {
    throw Error('Not implemented');
  }
}

async function getAlbums(artistId) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 800);
  });

  if (artistId === 'the-beatles') {
    return [{
      id: 13,
      title: 'Let It Be',
      year: 1970
    }, {
      id: 12,
      title: 'Abbey Road',
      year: 1969
    }, {
      id: 11,
      title: 'Yellow Submarine',
      year: 1969
    }];
  } else if (artistId === 'led-zeppelin') {
    return [{
      id: 10,
      title: 'Coda',
      year: 1982
    }, {
      id: 9,
      title: 'In Through the Out Door',
      year: 1979
    }, {
      id: 8,
      title: 'Presence',
      year: 1976
    }];
  } else {
    return [{
      id: 7,
      title: 'The Wall',
      year: 1979
    }, {
      id: 6,
      title: 'Animals',
      year: 1977
    }, {
      id: 5,
      title: 'Wish You Were Here',
      year: 1975
    }];
  }
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

---

### サーバからクライアントへのデータストリーミング {/*streaming-data-from-server-to-client*/}

サーバコンポーネントからクライアントコンポーネントに props としてプロミスを渡すことで、サーバからクライアントにデータをストリーミングすることができます。

```js
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

クライアントコンポーネントは、受け取ったプロミスを `use` API に渡します。これによりクライアントコンポーネントは、サーバコンポーネントが最初に作成したプロミスから値を読み取ることができます。

```js
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
`Message` は[サスペンス](/reference/react/Suspense)バウンダリでラップされているため、プロミスが解決されるまでフォールバックが表示されます。プロミスが解決されると、その値が `use` API によって読み取られ、`Message` コンポーネントがサスペンスフォールバックを置き換えます。

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Download message</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<DeepDive>

#### プロミスをサーバコンポーネントで解決するか、クライアントコンポーネントで解決するか？ {/*resolve-promise-in-server-or-client-component*/}

プロミスがある場合、その値を読み取るには、いずれかの時点でプロミスから値を取り出す必要があります。サーバコンポーネントでは `await`、クライアントコンポーネントでは `use` を使って値を取り出します。

通常、最も単純なのはプロミスを作成した場所で `await` する方法です。データの準備ができるまでサーバコンポーネントがサスペンドし、その配下にあるものもすべて待機します。

```js
// Server Component
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />;
}
```

ただし、すぐに値を取り出す必要はありません。プロミスを props の一部として下に渡し、ツリーのより深い位置で値を取り出せます。プロミスを読み取るコンポーネントはやはりサスペンドしますが、データを待つのはツリーのその部分だけです。そのコンポーネントを [`<Suspense>`](/reference/react/Suspense) バウンダリでラップすると、ページの残りの部分をすぐにレンダーしながらフォールバックを表示できます。

例えば、より深い位置にあるサーバコンポーネントで、受け取ったプロミスを `await` できます。

```js
import { Suspense } from 'react';

// Server Component
export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>⌛Downloading message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}

// Server Component
async function Message({ messagePromise }) {
  const messageContent = await messagePromise;
  return <p>{messageContent}</p>;
}
```

または、別ファイル内のクライアントコンポーネントで、同じプロミスから `use` によって値を取り出せます。

```js
// Client Component
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>{messageContent}</p>;
}
```

どちらの場合も、プロミスを下に渡す仕組みは同じです。いずれもプロミスを読み取る場所でサスペンドし、それより上の UI をブロックしません。唯一の違いは、クライアントコンポーネントはレンダー中に `await` できないため、代わりに `use` でプロミスから値を取り出すことです。一般的な例として、ホバーやクリックの後でのみデータが必要になるポップオーバーやツールチップなどのインタラクティブなコンテンツがあります。

サスペンスバウンダリを配置する場所については、[コンテンツを一度にまとめて表示する](/reference/react/Suspense#revealing-content-together-at-once)を参照してください。

</DeepDive>

---

### エラーバウンダリでエラーを表示する {/*displaying-an-error-with-an-error-boundary*/}

`use` に渡したプロミスが拒否されると、エラーは最も近い[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)に伝播します。プロミスが拒否されたときにフォールバックを表示するには、`use` を呼び出すコンポーネントをエラーバウンダリでラップします。

以下の例では、`fetchData` は最初の試行では拒否され、再試行すると成功します。エラーバウンダリが拒否をキャッチし、"Try again" ボタンを含むフォールバックを表示します。

<Sandpack>

```js src/App.js active
import { use, Suspense, useState, startTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { fetchData, refetchData } from "./data.js";

export default function App() {
  const [albumsPromise, setAlbumsPromise] = useState(
    () => fetchData('/the-beatles/albums')
  );

  function handleRetry() {
    startTransition(() => {
      setAlbumsPromise(refetchData('/the-beatles/albums'));
    });
  }

  return (
    <ErrorBoundary
      resetKeys={[albumsPromise]}
      fallbackRender={() => (
        <>
          <p>⚠️ Something went wrong loading the albums.</p>
          <button onClick={handleRetry}>Try again</button>
        </>
      )}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <Albums albumsPromise={albumsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Albums({ albumsPromise }) {
  const albums = use(albumsPromise);
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();
let retried = false;

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

export function refetchData(url) {
  cache.delete(url);
  retried = true;
  return fetchData(url);
}

async function getData(url) {
  // Add a fake delay to make the loading state visible.
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (url === '/the-beatles/albums') {
    // Fail the first attempt to demonstrate the Error Boundary,
    // then succeed on retry.
    if (!retried) {
      throw new Error('Example Error: Failed to fetch albums');
    }
    return [{
      id: 13,
      title: 'Let It Be',
      year: 1970
    }, {
      id: 12,
      title: 'Abbey Road',
      year: 1969
    }, {
      id: 11,
      title: 'Yellow Submarine',
      year: 1969
    }, {
      id: 10,
      title: 'The Beatles',
      year: 1968
    }];
  }
  throw new Error('Not implemented');
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## 使用法（ブラウザ） {/*usage-browser*/}

### <CanaryBadge /> コンポーネントをブラウザでのみレンダー {/*rendering-a-component-only-in-the-browser*/}

ブラウザでのみレンダーされるべきコンポーネント内で、[`browser`](/reference/react-dom/browser) が返した値を `use` に渡します。

**Reload** をクリックすると、初期 HTML 内のローディングフォールバックを確認できます。ハイドレーション後、React は `localStorage` から読み込んだ下書きを表示します。

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
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
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

サーバレンダリング中は、`use(browser())` がコンポーネントをサスペンドさせ、React は最も近いサスペンスバウンダリのフォールバックを HTML に含めます。ブラウザでは `use(browser())` が `undefined` を返し、保存済みの下書きが通常どおりレンダーされます。

---

## トラブルシューティング {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" というエラーが表示される {/*suspense-exception-error*/}

`use` を try-catch ブロック内で呼び出しています。`use` はサスペンスと連携するために内部で例外をスローするので、try-catch でラップすることはできません。代わりに、`use` を呼び出すコンポーネントを[エラーバウンダリ](#displaying-an-error-with-an-error-boundary)でラップしてエラーを処理してください。

```jsx
function Albums({ albumsPromise }) {
  try {
    // ❌ Don't wrap `use` in try-catch
    const albums = use(albumsPromise);
  } catch (e) {
    return <p>Error</p>;
  }
  // ...
```

代わりに、コンポーネントをエラーバウンダリでラップします。

```jsx
function Albums({ albumsPromise }) {
  // ✅ Call `use` without try-catch
  const albums = use(albumsPromise);
  // ...
```

```jsx
// ✅ Use an Error Boundary to handle errors
<ErrorBoundary fallback={<p>Error</p>}>
  <Albums albumsPromise={albumsPromise} />
</ErrorBoundary>
```

---

### "A component was suspended by an uncached promise" という警告が表示される {/*uncached-promise-error*/}

`use` に渡したプロミスがキャッシュされていないため、React は再レンダーをまたいでそのプロミスを再利用できません。

これは、レンダー内で `fetch` や `async` 関数を直接呼び出した場合によく発生します。

```js
function Albums() {
  // 🔴 This creates a new Promise on every render
  const albums = use(fetch('/albums'));
  // ...
}
```

修正するには、同じインスタンスが再利用されるようにプロミスをキャッシュします。

```js
// ✅ fetchData returns the same Promise for the same URL
const albums = use(fetchData('/albums'));
```

詳しくは、[クライアントコンポーネント用にプロミスをキャッシュする](#caching-promises-for-client-components)を参照してください。
