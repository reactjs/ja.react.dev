---
title: <StrictMode>
---


<Intro>

`<StrictMode>` は、開発環境においてコンポーネントの一般的なバグを早期に見つけるのに役立ちます。


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

`StrictMode` を使用して、内側のコンポーネントツリーに対して開発時専用の挙動と警告を有効にします。

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[さらに例を見る](#usage)

Strict Mode では、以下のような開発時専用の挙動が有効になります。

- コンポーネントは、純粋でない (impure) レンダーによって引き起こされるバグを見つけるために、[レンダーを追加で 1 回行います](#fixing-bugs-found-by-double-rendering-in-development)。
- コンポーネントは、エフェクトのクリーンアップし忘れによるバグを見つけるために、[エフェクトの実行を追加で 1 回行います](#fixing-bugs-found-by-re-running-effects-in-development)。
- コンポーネントは、ref のクリーンアップし忘れによるバグを見つけるために、[ref コールバックの実行を追加で 1 回行います](#fixing-bugs-found-by-re-running-ref-callbacks-in-development)。
- コンポーネントが[非推奨の API を使用していないかチェック](#fixing-deprecation-warnings-enabled-by-strict-mode)します。

#### props {/*props*/}

`StrictMode` は props を受け付けません。

#### 注意点 {/*caveats*/}

* 一旦 `<StrictMode>` でラップされたツリー内で Strict Mode を無効化する方法はありません。これにより、`<StrictMode>` 内のすべてのコンポーネントがチェックされていることを確信できます。あるプロダクト内で、チェックに価値があると感じるかどうかに関して 2 つのチームの意見が割れた場合、合意に達するか、もしくは `<StrictMode>` をツリーの下側へ移動する必要があります。

---

## 使用法 {/*usage*/}

### アプリ全体で Strict Mode を有効にする {/*enabling-strict-mode-for-entire-app*/}

Strict Mode は、`<StrictMode>` コンポーネント内の全コンポーネントツリーに対して追加の開発時専用チェックを有効にします。これらのチェックは、開発プロセスの早い段階でコンポーネントの一般的なバグを見つけるのに役立ちます。


アプリ全体で Strict Mode を有効にするには、ルートコンポーネントをレンダーする際にそれを `<StrictMode>` でラップします。

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

特に新しく作成されたアプリについては、アプリ全体を Strict Mode でラップすることをお勧めします。[`createRoot`](/reference/react-dom/client/createRoot) の呼び出しを自動的に行うフレームワークを使用している場合は、ドキュメンテーションを参照して Strict Mode を有効にする方法を確認してください。

Strict Mode のチェックは**開発中にのみ実行される**ものですが、これらは既にコード内に存在するが本番環境での確実な再現が難しいバグを見つけるのに役立ちます。Strict Mode を使用することで、バグをユーザが報告してくる前に修正することができます。

<Note>

Strict Mode は開発中に以下のチェックを有効にします：

- コンポーネントは、純粋でない (impure) レンダーによって引き起こされるバグを見つけるために、[レンダーを追加で 1 回行います](#fixing-bugs-found-by-double-rendering-in-development)。
- コンポーネントは、エフェクトのクリーンアップし忘れによるバグを見つけるために、[エフェクトの実行を追加で 1 回行います](#fixing-bugs-found-by-re-running-effects-in-development)。
- コンポーネントは、ref のクリーンアップし忘れによるバグを見つけるために、[ref コールバックの実行を追加で 1 回行います](#fixing-bugs-found-by-re-running-ref-callbacks-in-development)。
- コンポーネントが[非推奨の API を使っていないかチェック](#fixing-deprecation-warnings-enabled-by-strict-mode)します。

**これらのチェックはすべて開発環境専用であり、本番用ビルドには影響しません。**

</Note>

---

### アプリの一部で Strict Mode を有効にする {/*enabling-strict-mode-for-a-part-of-the-app*/}

アプリケーションの任意の一部分でのみ Strict Mode を有効にすることも可能です。

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

上記の例では、Strict Mode のチェックは `Header` と `Footer` コンポーネントに対しては実行されません。しかし、`Sidebar` と `Content`、およびそれらの中にあるすべてのコンポーネントに対しては、どれだけ深いところにあってもチェックが実行されます。

<Note>

`StrictMode` がアプリの一部のみで有効になっている場合、React は本番環境で起こりえる動作のみを再現します。例えば、アプリのルートで `<StrictMode>` が有効になっていない場合、初期マウント時に[エフェクトを追加で再実行](#fixing-bugs-found-by-re-running-effects-in-development)することはなくなります。親エフェクトなしに子エフェクトが二重に発火することは本番環境では起こらないためです。

</Note>

---

### 開発中の二重レンダーによって見つかったバグの修正 {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React は、あなたの書くすべてのコンポーネントが純関数 (pure function) であると仮定しています](/learn/keeping-components-pure)。これは、あなたが書く React コンポーネントは、同じ入力（props、state、context）が与えられた場合に常に同じ JSX を返さなければならないという意味です。

このルールを守らないコンポーネントは予測不能な挙動を示し、バグを引き起こします。うっかり純粋でなくなってしまったコードを見つけるために、Strict Mode はあなたの関数の一部（純粋であるべきものだけ）を**開発中に 2 回呼び出します**。これには以下が含まれます。

- あなたのコンポーネント関数本体（トップレベルのロジックのみ。イベントハンドラ内のコードは含まれません。）
- [`useState`](/reference/react/useState)、[`set` 関数](/reference/react/useState#setstate)、[`useMemo`](/reference/react/useMemo)、および [`useReducer`](/reference/react/useReducer) に渡す関数
- [`constructor`](/reference/react/Component#constructor)、[`render`](/reference/react/Component#render)、[`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) などの一部のクラスコンポーネントメソッド（[全リストを見る](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)）

関数が純粋であれば、結果は毎回同じになるので、2 回実行してもその振る舞いは変わりません。しかし、関数が純粋でない（例えば、受け取ったデータを書き換えている）場合、2 回実行することで目に見える影響が出る（まさにそれが純粋でないということです！）傾向があります。これにより、バグを早期に見つけて修正するのに役立ちます。

**以下は、Strict Mode での二重レンダーがどのように早期にバグを見つけるのに役立つかを示す例です**。

この `StoryTray` コンポーネントは `stories` の配列を受け取り、その最後に "Create Story" という項目を加えて表示します。

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

上記のコードには間違いがあります。しかし、初回の出力は正しく見えるため、容易に見落としてしまいます。

`StoryTray` コンポーネントが複数回レンダーされるとこの間違いに気付きやすくなります。例えば、マウスを `StoryTray` の上にホバーすると背景色を変えて `StoryTray` が再レンダーされるようにしてみましょう。

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

`StoryTray` コンポーネントの上にマウスをホバーするたびに、"Create Story" が再度リストに追加されることに注意してください。コードの意図は、最後に一度だけ追加することでした。しかし、`StoryTray` は props の `stories` 配列を直接書き換えています。`StoryTray` がレンダーされるたびに、同じ配列の最後に "Create Story" を再び追加しています。つまり、`StoryTray` は純関数ではなく、複数回実行することで異なる結果が返ってきます。

この問題を解決するためには、配列のコピーを作り、元の配列の代わりにそのコピーを書き換えるようにできます。

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

これにより、[`StoryTray` 関数は純関数になります](/learn/keeping-components-pure)。呼び出されるたびに、新しい配列のコピーだけが書き換わり、外部のオブジェクトや変数には影響を与えません。これによりバグは修正されましたが、振る舞いに問題があることに気付けるようになる前に、コンポーネントを通常より多く再レンダーする必要がありました。

**この例では、バグが明らかではありませんでした。では、元の（バグがある）コードを `<StrictMode>` でラップしてみましょう：**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode は*常に*レンダー関数を 2 回呼び出すため、すぐに間違った結果が目に入ります**（"Create Story" が 2 回表示されます）。これにより、早期にこのような間違いに気づくことができます。Strict Mode でコンポーネントをレンダーするようにすることで、先ほどのホバー機能のような、将来本番環境で発生しうる多くのバグも、あらかじめ潰しておけるのです。

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js src/StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Strict Mode がなければ、再レンダーを追加しない限りバグを容易に見逃してしまう状態でした。Strict Mode は同じバグをすぐに見つかるようにします。Strict Mode は、チームやユーザに公開してしまう前にバグを見つけるのに役立ちます。

[コンポーネントを純粋に保つ方法について詳しく読む](/learn/keeping-components-pure)

<Note>

[React DevTools](/learn/react-developer-tools) をインストールしている場合、2 回目のレンダー呼び出し中の `console.log` 呼び出しは少し暗く表示されます。React DevTools には、それらを完全に非表示にする設定もあります（デフォルトではオフ）。

</Note>

---

### 開発中にエフェクトを再実行して見つかったバグの修正 {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode は、[エフェクト](/learn/synchronizing-with-effects)のバグを見つけるのにも役立ちます。

すべてのエフェクトにはセットアップコードがあり、一部のエフェクトにはクリーンアップコードもあります。通常、React はコンポーネントが*マウント*（画面に追加）されたときにセットアップコードを呼び出し、コンポーネントが*アンマウント*（画面から削除）されたときにクリーンアップコードを呼び出します。その後、前回のレンダー以降に依存配列が変更された場合、React は再度クリーンアップとセットアップを呼び出します。

Strict Mode がオンの場合、React は開発中にすべてのエフェクトに対して **追加で 1 回、セットアップ+クリーンアップのサイクルを実行します**。この挙動に驚くかもしれませんが、手動で見つけるのが難しい微妙なバグを明らかにするのに役立ちます。

**Strict Mode でエフェクトを再実行することが、早期にバグを見つけるのにどのように役立つかを示す例を示します。**

以下の例では、コンポーネントをチャットに接続しています。

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

このコードには問題がありますが、すぐには明らかではないかもしれません。

問題を目立たせるため、機能を実装してみましょう。以下の例では、`roomId` はハードコードされておらず、代わりに、ユーザはドロップダウンから接続したい `roomId` を選択できます。"Open chat" をクリックし、次にひとつずつ異なるチャットルームを選択してください。コンソールでアクティブな接続の数を数えてみてください。

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

開いている接続の数が増え続けていくことにお気づきでしょう。実際のアプリケーションでは、これによりパフォーマンスやネットワークの問題が発生します。問題は、[エフェクトにクリーンアップ関数がない](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)ことです。

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

これでエフェクトが自身を「クリーンアップ」し、古い接続を破棄するようになったので、リークは解消されました。しかし、問題が見えてくるのは、より多くの機能（選択ボックス）を追加した後でした。

**元の例では、バグは明らかではありませんでした。では、元の（バグのある）コードを `<StrictMode>` でラップしてみましょう：**

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**Strict Mode を使用すると、すぐに問題があることがわかります**（アクティブな接続の数が 2 に跳ね上がります）。Strict Mode は、すべてのエフェクトに対してセットアップ+クリーンアップのサイクルを追加で実行します。このエフェクトにはクリーンアップロジックがないため、余分な接続が作成されても破棄されませんでした。これは、クリーンアップ関数が欠けていることを示すヒントです。

Strict Mode を使用すると、このようなミスに早期に気付くことができます。Strict Mode でエフェクトにクリーンアップ関数を追加して修正することで、先ほどの選択ボックスのような、将来本番環境で発生しうる多くのバグも、あらかじめ潰しておけるのです。

<Sandpack>

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

コンソールに表示されるアクティブな接続の数が増えていかなくなったことに注目してください。

Strict Mode がなければ、エフェクトがクリーンアップを必要としていることを容易に見逃すところでした。開発中にエフェクトに対して「*セットアップ → クリーンアップ → セットアップ*」を実行することで、Strict Mode はクリーンアップロジックが欠けていることにより気付きやすくしたのです。

[エフェクトのクリーンアップの実装について詳しく読む](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---
### 開発中に ref コールバックの再実行によって見つかったバグの修正 {/*fixing-bugs-found-by-re-running-ref-callbacks-in-development*/}

Strict Mode は、[コールバック形式の ref](/learn/manipulating-the-dom-with-refs) のバグを見つけるのにも役立ちます。

すべてのコールバック `ref` にはセットアップコードが含まれ、一部にはクリーンアップコードも含まれます。通常、React は要素が**作成されたとき**（DOM に追加されたとき）にセットアップを呼び出し、要素が（DOM から）**削除されたとき**にクリーンアップを呼び出します。

Strict Mode が有効な場合、React は開発中に**すべてのコールバック `ref` に対して追加で 1 回、セットアップ+クリーンアップのサイクルを実行**します。この挙動に驚くかもしれませんが、手動で見つけるのが難しい微妙なバグを明らかにするのに役立ちます。

以下の例を考えてみましょう。この例では、動物の種類を選択した後に、リスト内の動物のいずれかにスクロールすることができます。"Cats" から "Dogs" に切り替えると、コンソールのログに表示される動物の数が増え続けていき、"Scroll to" ボタンが機能しなくなるのがわかります。

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ❌ Not using StrictMode.
root.render(<App />);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node}; 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>


**これは本番環境でのバグです！** ref コールバックのクリーンアップでリストから動物を削除していないため、動物のリストが増え続けていっています。これはメモリリークであり、本番環境でパフォーマンスの問題や動作の不具合を引き起こします。

問題は ref コールバックがクリーンアップを正しく行っていないことです。

```js {6-8}
<li
  ref={node => {
    const list = itemsRef.current;
    const item = {animal, node};
    list.push(item);
    return () => {
      // 🚩 No cleanup, this is a bug!
    }
  }}
</li>
```

元の（バグのある）例を `<StrictMode>` でラップしてみましょう。

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal: animal, node} 
                  list.push(item);
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    // 🚩 No cleanup, this is a bug!
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

**Strict Mode を使用することで、即座に問題に気づけるようになります**。Strict Mode では、すべてのコールバック `ref` に対して追加のセットアップ+クリーンアップサイクルが実行されます。このコールバック `ref` にはクリーンアップロジックがないため、ref は追加されるだけで削除されません。これはクリーンアップ関数が欠けていることを示すヒントです。

Strict Mode を使うことで、コールバック `ref` のミスを積極的に見つけだすことができます。Strict Mode を使いクリーンアップ関数を追加してコールバックを修正することで、先ほどの "Scroll to" のような、将来本番環境で発生しうる多くのバグも、あらかじめ潰しておけるのです。

<Sandpack>

```js src/index.js
import { createRoot } from 'react-dom/client';
import {StrictMode} from 'react';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
// ✅ Using StrictMode.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { useRef, useState } from "react";

export default function AnimalFriends() {
  const itemsRef = useRef([]);
  const [animalList, setAnimalList] = useState(setupAnimalList);
  const [animal, setAnimal] = useState('cat');

  function scrollToAnimal(index) {
    const list = itemsRef.current;
    const {node} = list[index];
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
  
  const animals = animalList.filter(a => a.type === animal)
  
  return (
    <>
      <nav>
        <button onClick={() => setAnimal('cat')}>Cats</button>
        <button onClick={() => setAnimal('dog')}>Dogs</button>
      </nav>
      <hr />
      <nav>
        <span>Scroll to:</span>{animals.map((animal, index) => (
          <button key={animal.src} onClick={() => scrollToAnimal(index)}>
            {index}
          </button>
        ))}
      </nav>
      <div>
        <ul>
          {animals.map((animal) => (
              <li
                key={animal.src}
                ref={(node) => {
                  const list = itemsRef.current;
                  const item = {animal, node};
                  list.push({animal: animal, node});
                  console.log(`✅ Adding animal to the map. Total animals: ${list.length}`);
                  if (list.length > 10) {
                    console.log('❌ Too many animals in the list!');
                  }
                  return () => {
                    list.splice(list.indexOf(item));
                    console.log(`❌ Removing animal from the map. Total animals: ${itemsRef.current.length}`);
                  }
                }}
              >
                <img src={animal.src} />
              </li>
            ))}
          
        </ul>
      </div>
    </>
  );
}

function setupAnimalList() {
  const animalList = [];
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'cat', src: "https://loremflickr.com/320/240/cat?lock=" + i});
  }
  for (let i = 0; i < 10; i++) {
    animalList.push({type: 'dog', src: "https://loremflickr.com/320/240/dog?lock=" + i});
  }

  return animalList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

StrictMode が有効になると、初回レンダー時に ref コールバックがセットアップされ、クリーンアップされ、またセットアップされます。

```
...
✅ Adding animal to the map. Total animals: 10
...
❌ Removing animal from the map. Total animals: 0
...
✅ Adding animal to the map. Total animals: 10
```

**この挙動は問題ありません**。Strict Mode により、ref コールバックが正しくクリーンアップされており、予想外にサイズが大きくならないことを確認できます。修正後にはメモリリークはなくなり、すべての機能が予期したとおりに動作するようになります。

Strict Mode がなければ、アプリをクリックして動かない機能があることに気付くまで、このバグは見逃される危険がありました。Strict Mode により、本番環境に投入するプッシュする前にバグがすぐに明らかになったのです。

--- 
### Strict Mode によって現れるようになった非推奨警告の修正 {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React は、`<StrictMode>` ツリー内のいずれかのコンポーネントが以下の非推奨 API を使用している場合に警告を発します。

* `UNSAFE_` クラスライフサイクルメソッド（[`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount) など）。[代替手段を見る](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles) 

これらの API は主に古い[クラスコンポーネント](/reference/react/Component)で使用されているものであり、現在のアプリケーションではほとんど見られません。
