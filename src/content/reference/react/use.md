---
title: use
canary: true
---

<Canary>

<<<<<<< HEAD
`use` フックは現在、React の Canary および experimental チャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。
=======
The `use` Hook is currently only available in React's Canary and experimental channels. Learn more about [React's release channels here](/community/versioning-policy#all-release-channels).
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

</Canary>

<Intro>

`use` は[プロミス (Promise)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) や[コンテクスト](/learn/passing-data-deeply-with-context)などのリソースから値を読み取るための React フックです。

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `use(resource)` {/*use*/}

コンポーネント内で `use` を呼び出し、[プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)や[コンテクスト](/learn/passing-data-deeply-with-context)などのリソースから値を読み取ります。

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

他のあらゆる React フックとは異なり、`use` は `if` のようなループや条件文内でも呼び出すことができます。他の React フックと同様に、`use` を呼び出す関数はコンポーネントまたはフックでなければなりません。

プロミスを引数にして呼び出した場合、`use` フックは [`Suspense`](/reference/react/Suspense) や[エラーバウンダリ (error boundary)](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) と協調して動作します。`use` を呼び出すコンポーネントは、`use` に渡されたプロミスが保留中 (pending) である間、*サスペンド (suspend)* します。`use` を呼び出すコンポーネントがサスペンスバウンダリでラップされている場合、フォールバックが表示されます。プロミスが解決 (resolve) された時点で、サスペンスフォールバックは、`use` フックから返されたデータを使用してレンダーされたコンポーネントの内容に置き換わります。`use` に渡されたプロミスが拒否 (reject) されると、最も近いエラーバウンダリのフォールバックが表示されます。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `resource`: 値を読み取りたいデータソース。リソースは[プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)または [コンテクスト](/learn/passing-data-deeply-with-context)のいずれかになります。

#### 返り値 {/*returns*/}

`use` フックは、[プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)の解決された値や[コンテクスト](/learn/passing-data-deeply-with-context)など、リソースから読み取った値を返します。

#### 注意点 {/*caveats*/}

* `use` フックは、コンポーネントまたは他のフック内で呼び出す必要があります。
* [サーバコンポーネント](/reference/react/use-server)でデータをフェッチする際は、`use` よりも `async` と `await` を優先して使用してください。`async` と `await` は `await` が呼び出された地点からレンダーを再開しますが、`use` はデータが解決した後にコンポーネントを最初からレンダーします。
* [クライアントコンポーネント](/reference/react/use-client)でプロミスを作成するよりも、[サーバコンポーネント](/reference/react/use-server)でプロミスを作成してそれをクライアントコンポーネントに渡すようにしてください。クライアントコンポーネントで作成されたプロミスは、レンダーごとに再作成されます。サーバコンポーネントからクライアントコンポーネントに渡されたプロミスは、再レンダー間で不変です。[こちらの例を参照してください](#streaming-data-from-server-to-client)。

---

## 使用法 {/*usage*/}

### `use` でコンテクストを読み取る {/*reading-context-with-use*/}

[コンテクスト](/learn/passing-data-deeply-with-context)が `use` に渡された場合、[`useContext`](/reference/react/useContext) と同様に動作します。`useContext` はコンポーネントのトップレベルで呼び出す必要がありますが、`use` は `if` や `for` などの条件式の中でも呼び出すことができます。`use` はより柔軟であるため、`useContext` よりも優先的に使用してください。

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
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
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
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
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

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>

### サーバからクライアントへのデータストリーミング {/*streaming-data-from-server-to-client*/}

<CodeStep step={1}>サーバコンポーネント</CodeStep>から<CodeStep step={2}>クライアントコンポーネント</CodeStep> に props としてプロミスを渡すことで、サーバからクライアントにデータをストリーミングすることができます。

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
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

<CodeStep step={2}>クライアントコンポーネント</CodeStep> は、<CodeStep step={4}>受け取ったプロミス</CodeStep> を <CodeStep step={5}>`use`</CodeStep> フックに渡します。これにより<CodeStep step={2}>クライアントコンポーネント</CodeStep>は、サーバコンポーネントが最初に作成した<CodeStep step={4}>プロミス</CodeStep>から値を読み取ることができます。

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```
<CodeStep step={2}>`Message`</CodeStep> は <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep> でラップされているため、プロミスが解決されるまでフォールバックが表示されます。プロミスが解決されると、その値が <CodeStep step={5}>`use`</CodeStep> フックによって読み取られ、<CodeStep step={2}>`Message`</CodeStep> コンポーネントがサスペンスフォールバックを置き換えます。

<Sandpack>

```js message.js active
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

```js App.js hidden
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

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
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

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```
</Sandpack>

<Note>

サーバコンポーネントからクライアントコンポーネントにプロミスを渡す場合、その解決値は、サーバとクライアント間でやりとり可能になるよう、シリアライズ可能でなければなりません。関数のようなデータ型はシリアライズ可能ではないため、プロミスの解決値として利用できません。

</Note>


<DeepDive>

#### プロミスをサーバコンポーネントで解決するか、クライアントコンポーネントで解決するか？ {/*resolve-promise-in-server-or-client-component*/}

<<<<<<< HEAD
プロミスはサーバコンポーネントからクライアントコンポーネントに渡し、`use` フックを使ってクライアントコンポーネントで解決することができます。また、`await` を使ってサーバコンポーネント側でプロミスを解決し、必要なデータを props としてクライアントコンポーネントに渡すことも可能でしょう。
=======
A Promise can be passed from a Server Component to a Client Component and resolved in the Client Component with the `use` Hook. You can also resolve the Promise in a Server Component with `await` and pass the required data to the Client Component as a prop.
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

```js
export default function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

しかし[サーバコンポーネント](/reference/react/components#server-components)で `await` を使用すると、`await` 文が終了するまでそのレンダーがブロックされます。サーバコンポーネントからクライアントコンポーネントにプロミスを渡すことで、プロミスがサーバコンポーネントのレンダーをブロックすることを防ぐことができます。

</DeepDive>

### 拒否されたプロミスの取り扱い {/*dealing-with-rejected-promises*/}

場合によっては、`use` に渡されたプロミスが拒否されることがあります。プロミスが拒否された場合にそれを処理する方法は以下の 2 つです。

1. [エラーバウンダリを使ってユーザにエラーを表示する](#displaying-an-error-to-users-with-error-boundary)
2. [`Promise.catch` で代替値を提供する](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` は try-catch ブロック内で呼び出すことはできません。try-catch ブロックを使う代わりに、[コンポーネントをエラーバウンダリでラップする](#displaying-an-error-to-users-with-error-boundary)か、または[プロミスの `.catch` メソッドで代替値を提供](#providing-an-alternative-value-with-promise-catch)してください。
</Pitfall>

#### エラーバウンダリを使ってユーザにエラーを表示する {/*displaying-an-error-to-users-with-error-boundary*/}

プロミスが拒否されたときにユーザにエラーを表示したい場合は、[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary) を使用できます。エラーバウンダリを使用するには、`use` フックを呼び出しているコンポーネントをエラーバウンダリでラップします。`use` に渡されたプロミスが拒否されると、エラーバウンダリに書かれたフォールバックが表示されます。

<Sandpack>

```js message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<p>⌛Downloading message...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Here is the message: {content}</p>;
}
```

```js App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
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

```js index.js hidden
// TODO: update to import from stable
// react instead of canary once the `use`
// Hook is in a stable release of React
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

```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-9377e1010-20230712",
    "react-dom": "18.3.0-canary-9377e1010-20230712",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### `Promise.catch` で代替値を提供する {/*providing-an-alternative-value-with-promise-catch*/}

`use` に渡されたプロミスが拒否されたときに代替値を提供したい場合、プロミスの <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> メソッドを使用できます。

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "no new message found.";
  });

  return (
    <Suspense fallback={<p>waiting for message...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

プロミスの <CodeStep step={1}>`catch`</CodeStep> メソッドを使用するには、プロミスオブジェクトの <CodeStep step={1}>`catch`</CodeStep> を呼び出します。<CodeStep step={1}>`catch`</CodeStep> はエラーメッセージを引数とする関数を唯一の関数として受け取ります。<CodeStep step={1}>`catch`</CodeStep> に渡された関数によって<CodeStep step={2}>返された任意の値</CodeStep>が、プロミスの解決値として使用されます。

---

## トラブルシューティング {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

あなたは React コンポーネントまたはフック関数の外部で `use` を呼び出しているか、または try-catch ブロック内で `use` を呼び出しています。try-catch ブロック内で `use` を呼び出している場合は、コンポーネントをエラーバウンダリでラップするか、プロミスの `catch` を呼び出してエラーをキャッチし、別の値でプロミスを解決します。[こちらの例を参照してください](#dealing-with-rejected-promises)。

React コンポーネントまたはフック関数の外部で `use` を呼び出している場合は、`use` の呼び出しを React コンポーネントまたはフック関数に移動します。

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ the function calling `use` is not a Component or Hook
    const message = use(messagePromise);
    // ...
```

上記の場合、コンポーネントのクロージャの外で `use` を呼び出すようにすることで、コンポーネントまたはフックから `use` を呼び出すという条件を満たすようになります。

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` is being called from a component. 
  const message = use(messagePromise);
  // ...
```
