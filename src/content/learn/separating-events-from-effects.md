---
title: 'エフェクトからイベントを分離する'
---

<Intro>

イベントハンドラは、ユーザが同じ操作を繰り返した場合にのみ再実行されます。エフェクトはイベントハンドラとは異なり、props や state 変数のようなそれが読み取る値が前回のレンダー時と異なる場合に、再同期を行います。また両方の動作をミックスさせて、ある値には反応して再実行されるが他の値には反応しないというエフェクトが欲しくなる場合もあります。このページでは、その方法を説明します。

</Intro>

<YouWillLearn>

- イベントハンドラとエフェクトのどちらを選ぶか
- エフェクトがリアクティブで、イベントハンドラがリアクティブでない理由
- エフェクトのコードの一部をリアクティブにしたくない場合の対処法
- エフェクトイベントとは何か、そしてエフェクトイベントからエフェクトを抽出する方法
- エフェクトイベントを使用してエフェクトから最新の props と state を読み取る方法

</YouWillLearn>

## イベントハンドラとエフェクトのどちらを選ぶか {/*choosing-between-event-handlers-and-effects*/}

まず、イベントハンドラとエフェクトの違いについておさらいしておきましょう。

チャットルームのコンポーネントを実装している場合を想像してください。要件は次のようなものです。

1. コンポーネントは選択中のチャットルームに自動的に接続する。
2. "Send" ボタンをクリックすると、チャットにメッセージが送信される。

このためのコードはすでに実装されているが、それをどこに置くか迷っているとしましょう。イベントハンドラを使うべきか、エフェクトを使うべきか。このような質問に答える必要がある場合は常に、[*なぜ*そのコードを実行する必要があるのか](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)を考えるようにしてください。

### イベントハンドラは具体的なユーザ操作に反応して実行される {/*event-handlers-run-in-response-to-specific-interactions*/}

ユーザの立場からすると、メッセージの送信とは、"Send" という特定のボタンがクリックされたから起こるべきものです。それ以外のタイミングや理由でメッセージが送信されてしまうとユーザは怒ることでしょう。これが、メッセージの送信はイベントハンドラで行うべき理由です。イベントハンドラを使うことで、特定のユーザ操作を処理できます。

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>;
    </>
  );
}
```

イベントハンドラを使うことにより、ユーザがボタンを押したときに*だけ* `sendMessage(message)` が実行される、ということが保証されるのです。

### エフェクトは同期が必要なときに常に実行される {/*effects-run-whenever-synchronization-is-needed*/}

コンポーネントはチャットルームへの接続を保持する必要がある、という要件を思い出しましょう。そのコードはどこに記述すべきでしょうか？

そのコードを実行する*理由*は、何か特定のユーザ操作ではありません。ユーザがチャットルーム画面に移動した理由や方法が問題なのではありません。ユーザがチャットルームの画面を見てそれを操作できるようになった以上、このコンポーネントは選択されたチャットサーバへの接続を維持する必要があります。チャットルームコンポーネントがアプリの初期画面で、ユーザが何の操作も行っていない場合であっても、*やはり*接続が必要です。これが、エフェクトを使用する理由です。

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

このコードにより、ユーザが行った特定の操作とは*関係なく*、現在選択されているチャットサーバへの接続が常にアクティブであると確信することができます。ユーザがアプリを開いただけの場合でも、別のルームを選んだ場合でも、他の画面に移動して戻ってきた場合でも、このエフェクトによりコンポーネントが現在選択されているルームと同期し、[必要なとき常に再接続を行う](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)ことが保証されます。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  );
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

```js chat.js
export function sendMessage(message) {
  console.log('🔵 You sent: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## リアクティブな値とリアクティブなロジック {/*reactive-values-and-reactive-logic*/}

直感的にはイベントハンドラとは、例えばボタンをクリックするなど、常に「手動」でトリガされるものだと言えるでしょう。一方、エフェクトは「自動」であり、同期を保つために必要なだけ実行・再実行されます。

しかし、もっと正確な考え方があります。

コンポーネントの本体部分で宣言された props、state、変数のことを<CodeStep step={2}>リアクティブな値</CodeStep> (reactive value) と呼びます。この例では、`serverUrl` はリアクティブな値ではありませんが、`roomId` と `message` はリアクティブな値です。これらはレンダーのデータフローに関わる値です。

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

このようなリアクティブな値は、再レンダー時に変化する可能性があります。例えばユーザは `message` を編集したり、ドロップダウンで別の `roomId` を選択したりするかもしれません。イベントハンドラとエフェクトは、それぞれ異なる方法で変化に対応します。

- **イベントハンドラ内のロジックはリアクティブではない**。ユーザが同じ操作（クリックなど）を再度行わない限り、再度実行されることはありません。イベントハンドラは、値の変化に「反応」することなく、リアクティブな値を読み取ることができます。
- **エフェクト内のロジックはリアクティブである**。エフェクトがリアクティブな値を読み取る場合、[依存配列としてそれを指定する必要があります](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。その後再レンダーによって値が変化した場合、React は新しい値でエフェクトのロジックを再実行します。

この違いを理解するため、先ほどの例をもう一度見てみましょう。

### イベントハンドラ内のロジックはリアクティブではない {/*logic-inside-event-handlers-is-not-reactive*/}

このコードをご覧ください。このロジックはリアクティブであるべきでしょうか、そうではないでしょうか？

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

ユーザの観点からは、**`message` が変化することがメッセージを送りたいという意味になるわけでは*ありません***。あくまでユーザが入力の最中だということでしかありません。つまり、メッセージ送信のロジックは、リアクティブであってはならないということです。<CodeStep step={2}>リアクティブな値</CodeStep>が変わったからと言って、再び実行されるべきではありません。したがって、これはイベントハンドラの中にあるべきです。

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

イベントハンドラはリアクティブではないので、`sendMessage(message)` はユーザが送信ボタンをクリックしたときのみ実行されます。

### エフェクト内のロジックはリアクティブである {/*logic-inside-effects-is-reactive*/}

こちらの行に戻りましょう。

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

ユーザの観点からは、**`roomId` が変化することは、別の部屋に接続したいことを意味します**。つまり、ルームに接続するためのロジックもリアクティブであるべきだ、ということです。コードが<CodeStep step={2}>リアクティブな値</CodeStep>の変化に「キャッチアップ」するようにし、値が変われば再度実行されるように*したい*のです。したがってこれはエフェクトの中にあるべきです。

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

エフェクトはリアクティブなので、`createConnection(serverUrl, roomId)` と `connection.connect()` は、`roomId` の値が変わるごとに実行されます。エフェクトにより、チャットの接続が選択中のルームに同期された状態が維持されます。

## エフェクトから非リアクティブなロジックを分離する {/*extracting-non-reactive-logic-out-of-effects*/}

リアクティブなロジックと非リアクティブなロジックを混在させたい場合、少し厄介なことになります。

例えば、ユーザがチャットに接続したときに通知を表示したいとします。正しい色で通知を表示することができるよう、props から現在のテーマ（ダークまたはライト）を読み取ることにしましょう。

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    // ...
```

しかし、`theme` は（再レンダーの結果として変化する可能性があるので）リアクティブな値であり、そして[エフェクトが読み取るすべてのリアクティブな値は依存値として宣言する必要があります](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)。というわけで `theme` はエフェクトの依存配列として指定しないといけません。

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ All dependencies declared
  // ...
```

以下の例をいじってみてください。ユーザエクスペリエンスの問題点が分かりますか？

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

`roomId` が変わるとチャットが再接続され、それは期待通りの動作です。しかし、`theme` も依存値であるため、ダークテーマとライトテーマを切り替えることでも毎回チャットが再接続されてしまっています。これはあまり良くありません！

つまり、以下の行は（リアクティブである）エフェクトの中にあるにもかかわらず、リアクティブであってほしくないということです。

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

この非リアクティブなロジックを、周囲にあるリアクティブなエフェクトのコードから分離する方法が必要です。

### エフェクトイベントの宣言 {/*declaring-an-effect-event*/}

<Wip>

このセクションでは、まだ安定版の React で**リリースされていない実験的な API** について説明しています。

</Wip>

[`useEffectEvent`](/reference/react/experimental_useEffectEvent) という特別なフックを使うことで、エフェクトからこの非リアクティブなロジックを分離することができます。

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

ここで、`onConnected` は*エフェクトイベント (Effect Event)* と呼ばれるものです。これはエフェクトロジックの一部でありながら、むしろイベントハンドラに近い動作をします。この中のロジックはリアクティブではなく、常に props と state の最新の値を「見る」ことができます。

これで、エフェクトの内部から `onConnected` エフェクトイベントを呼び出せるようになります。

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

これで問題は解決しました。なお、エフェクトの依存値のリストに `onConnected` を入れてはいけません。**エフェクトイベント自体はリアクティブではないので、依存配列から除外する必要があります**。

新しい動作が期待通りであることを確認してください。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

エフェクトイベントは、イベントハンドラと非常に似たものだと考えることができます。主な違いは、イベントハンドラがユーザの操作に反応して実行されるのに対し、エフェクトイベントはエフェクトからトリガされることです。エフェクトイベントを使うことで、リアクティブであるエフェクトと、リアクティブであってはならないコードとの間の「連鎖を断ち切る」ことができます。

### エフェクトイベントで最新の props や state を読み取る {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

このセクションでは、まだ安定版の React で**リリースされていない実験的な API** について説明しています。

</Wip>

依存値に関するリンタを抑制したくなるようなパターンの多くは、エフェクトイベントによって回避可能です。

例えば、ページへの訪問をログに記録するエフェクトがあるとしましょう。

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

後になって、サイトに複数のページを追加することになりました。`Page` コンポーネントは現在のパスを表す `url` を props として受け取るようになります。この `url` を `logVisit` コールに渡そうと思うのですが、そこで依存値リンタが文句を言ってきます。

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

コードに何をさせたいのか考えてみましょう。それぞれの URL は別々のページを表しているので、*やりたいこと*はそれぞれの URL に対して別々に訪問ログを記録することです。言い換えれば、この `logVisit` の呼び出しは、`url` に関して確かに*リアクティブであるべき*ですね。したがってこの場合、依存値リンタが言う通り、`url` を依存配列に追加することは理にかなっています。

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

ところがここで、個々のページ訪問ログに、ショッピングカート内にある商品の数も含めたくなったとしましょう。

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

エフェクト内で `numberOfItems` を使用したので、リンタは依存値としてそれを追加するように言ってきます。しかし、`logVisit` の呼び出しが `numberOfItems` に対してリアクティブであることは*望ましくありません*。ユーザがショッピングカートに何かを入れて、`numberOfItems` が変化しても、それはユーザが再びページを訪れたことを*意味しません*。つまり、*ページを訪れた*ということは、ある意味で「イベント」なのです。ある特定の瞬間に起こるのです。

このコードを 2 つに分割しましょう。

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

ここで、`onVisit` はエフェクトイベントです。この中のコードはリアクティブではありません。このため、`numberOfItems`（または他のリアクティブな値！）を使用しても、変更時に周囲のコードが再実行される心配はありません。

一方、エフェクトそのものはリアクティブなままです。エフェクトの中のコードは props である `url` を使用しているため、異なる `url` で再レンダーが起きるたびにエフェクトが再実行されます。次にそれが `onVisit` エフェクトイベントを呼び出します。

その結果、`url` に変化があるごとに `logVisit` が呼び出され、常に最新の `numberOfItems` が読み取れることになります。一方で `numberOfItems` だけが変化してもコードの再実行は起きません。

<Note>

`onVisit()` は引数なしで呼び出して、関数内から直に `url` を読み取ればいいのでは、と疑問に思うかもしれません。

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

これでも動作はするのですが、この `url` は明示的にエフェクトイベントに渡す方がいいでしょう。**エフェクトイベントの引数として `url` を渡すことにより、異なる `url` のページを訪問することがユーザの視点から見ると別の「イベント」を構成しているのだ、という意図を表現できます**。`visitedUrl` は、起こった「イベント」の*一部*なのです。

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

エフェクトイベントが `visitedUrl` を明示的に「要求」しているので、エフェクト側の依存配列から誤って `url` を削除することができなくなりました。もし依存配列から `url` を削除してしまうと（別々のページへの訪問が 1 つとしてカウントされてしまう）、リンタはそれについて警告を発します。`onVisit` は `url` に対してはリアクティブであってほしいのですから、`url` はイベント内で読み込む（そうするとリアクティブでなくなってしまう）のではなく、*エフェクトから*渡すようにしましょう。

これは、エフェクトの中に非同期のロジックがある場合に特に重要になります。

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

この場合、`onVisit` 内で `url` を読み取ると（既に別物に変わっている可能性がある）*最新*の `url` を読み取ってしまいますが、`visitedUrl` はこのエフェクト（およびこの `onVisit` コール）が実行される大元のきっかけとなった `url` に対応することになります。

</Note>

<DeepDive>

#### 代わりに依存値リンタを止めても大丈夫？ {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

既存のコードベースで、以下のようにリントルールが抑制されているのを見かけることがあるかもしれません。

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

`useEffectEvent` が React の安定版に含まれるようになった後は、**決してリンタを抑制しない**ことをお勧めします。

このルールを止めてしまうことの最大の欠点は、新たにコードにリアクティブな依存値を追加してそれにエフェクトが「反応する」必要がある場合でも、もはや React が警告を表示できなくなってしまうことです。先ほどの例でも、`url` を依存配列に追加し忘れずに済んだのは、そうするよう React が教えてくれていたからでしたね。リンタを無効化してしまうと、今後そのエフェクトを編集する際に、そのようなリマインダを受け取ることができなくなります。これはバグにつながります。

以下は、リンタを無効化することで発生する紛らわしいバグの一例です。この例では、`handleMove` 関数は、ドットがカーソルに従うべきかどうかを決定するために、`canMove` という state 変数の現在値を読み取ろうとしています。しかし `handleMove` の内部では `canMove` は常に `true` となります。

なぜかわかりますか？

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>


このコードの問題は、依存値リンタを無効化してしまっていることです。無効化のコメントを外すと、このエフェクトの依存値として `handleMove` 関数を含める必要があることがわかります。これは理にかなっています。なぜなら `handleMove` はコンポーネント本体の内部で宣言されているのでリアクティブな値だからです。すべてのリアクティブな値は依存値として指定されなければなりませんし、さもなくば時間の経過とともに古くなってしまう可能性があります！

元のコードを書いた人は、React に対して「このエフェクトはどのリアクティブな値にも依存しない (`[]`)」と「嘘」をついています。だから React は `canMove`（とそれを使う `handleMove`）が変化したのにエフェクトを再同期しなかったのです。React はエフェクトを再同期しなかったため、リスナとしてアタッチされる `handleMove` は、初回レンダー時に作成された `handleMove` 関数のままとなります。初回レンダー時に `canMove` は `true` であったため、同時に作られた `handleMove` からも永遠にその値が見え続けることになります。

**リンタを決して抑制しないようにすれば、値が古くなることに関する問題が発生することはありません**。

`useEffectEvent` を使えば、リンタに「嘘」をつく必要はなく、期待通りにコードが動きます。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

だからといって `useEffectEvent` が*常に*正しい解決策だというわけではありません。コード中の、リアクティブにしたくない行にだけ適用するようにしてください。上記のサンドボックスでは、エフェクトコードが `canMove` に関してはリアクティブであってほしくなかったため、エフェクトイベントとして抜き出すことが理にかなっていたのです。

リンタを無効化しないで済む他の方法については、[エフェクトから依存値を取り除く](/learn/removing-effect-dependencies)を参照してください。

</DeepDive>

### エフェクトイベントに関する制限事項 {/*limitations-of-effect-events*/}

<Wip>

このセクションでは、まだ安定版の React で**リリースされていない実験的な API** について説明しています。

</Wip>

エフェクトイベントは、使い方が非常に限定されています。

* **エフェクトの内部からしか呼び出すことができません**。
* **他のコンポーネントやフックに渡してはいけません**。

例えば、次のようにエフェクトイベントを宣言して渡さないでください：

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: Passing Effect Events

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Need to specify "callback" in dependencies
}
```

こうではなく、常にエフェクトイベントを使用するエフェクトのすぐ隣で宣言してください。

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: Only called locally inside an Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // No need to specify "onTick" (an Effect Event) as a dependency
}
```

エフェクトイベントとは、エフェクトコードを構成する「パーツ」のうちの非リアクティブな部分です。それを使用するエフェクトの隣に置くようにしましょう。

<Recap>

- イベントハンドラは、特定のユーザ操作に応答して実行される。
- エフェクトは、同期が必要になるたびに実行される。
- イベントハンドラ内のロジックは、リアクティブではない。
- エフェクト内のロジックは、リアクティブである。
- エフェクト内の非リアクティブなロジックをエフェクトイベントに移動することができる。
- エフェクトイベントを呼び出せるのはエフェクトの内部だけである。
- エフェクトイベントを他のコンポーネントやフックに渡してはいけない。

</Recap>

<Challenges>

#### 更新されない変数を修正 {/*fix-a-variable-that-doesnt-update*/}

この `Timer` コンポーネントは、1 秒ごとに値が増加する `count` という state 変数を保持しています。値をいくつ増加させるのかは、`increment` という state 変数に格納されます。プラスボタンとマイナスボタンで `increment` 変数を制御できます。

しかし、プラスボタンを何度クリックしても、カウンタは 1 秒ごとに 1 つずつ増えていきます。このコードの何が問題なのでしょうか？ なぜエフェクトのコード内部では `increment` が常に 1 になっているのでしょうか？ 間違いを見つけて修正しましょう。

<Hint>

このコードを直すには、ルールを守ればいいのです。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

例によって、エフェクトのバグを探すときは、リンタを無効化している箇所を探すことから始めてください。

無効化コメントを削除すると、React はこのエフェクトのコードが `increment` に依存していることを教えてくれます。このエフェクトはリアクティブな値に依存していない (`[]`) と主張することで React に「嘘をついた」のです。依存配列に `increment` を追加しましょう。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

これで `increment` が変わると、React はエフェクトを再同期し、インターバルも再スタートされます。

</Solution>

#### カウンタのフリーズを修正 {/*fix-a-freezing-counter*/}

この `Timer` コンポーネントは、1 秒ごとに値が増加する `count` という state 変数を保持しています。値をいくつ増加させるのかは `increment` という state 変数に格納され、プラスとマイナスのボタンでコントロールすることができます。例えば、プラスボタンを 9 回押してみると、1 秒ごとにカウントが 1 ずつではなく 10 ずつ増えていくことがわかります。

このユーザインターフェースには小さな問題があります。プラス・マイナスボタンを毎秒 1 回以上の速さで押し続けると、タイマーが一時停止してしまうのです。最後にどちらかのボタンを押してから 1 秒が経過すると、タイマーが再開します。この原因を突き止め、タイマーが止まらず*毎秒*動作するように修正しましょう。

<Hint>

タイマーを設定するエフェクトが `increment` 値に「反応」してしまっているようです。`setCount` を呼び出すために現在の `increment` 値を使用している行は、本当にリアクティブである必要があるのでしょうか？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

問題はエフェクト内のコードが `increment` state 変数を使用していることです。この変数はエフェクトの依存値になっているので、`increment` を変更するたびにエフェクトが再同期し、インターバルがクリアされることになります。発火する前に毎回インターバルをクリアし続けると、タイマーが停止したように見えてしまいます。

この問題を解決するには、エフェクトから `onTick` エフェクトイベントを分離します。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

`onTick` はエフェクトイベントなので、その中のコードはリアクティブではありません。`increment` を変更しても、エフェクトはトリガされません。

</Solution>

#### 遅延を調整できない問題を修正 {/*fix-a-non-adjustable-delay*/}

この例では、インターバルの遅延をカスタマイズすることができます。この値は `delay` という state 変数に格納され、2 つのボタンによって更新できます。しかし、`delay` が 1000 ミリ秒（つまり 1 秒）になるまで "+ 100 ms" ボタンを押しても、タイマーは非常に速く（100 ミリ秒ごとに）増えていることに気づくでしょう。`delay` の変更が無視されているようです。バグを特定し、修正してください。

<Hint>

エフェクトイベントの中のコードはリアクティブではありません。`setInterval` 呼び出しを*実際に*再実行しないといけないケースがあるのでは？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

上記の例の問題点は、コードが実際に何をすべきかを考えずに `onMount` というエフェクトイベントを抽出してしまったことです。エフェクトイベントを抽出するのは、コードの一部を非リアクティブにしたいという特別な理由があるときだけです。しかし、`setInterval` の呼び出しは `delay` state 変数に対してリアクティブであるべきです。`delay` が変更された場合、インターバルを最初から設定する必要があります！ このコードを修正するには、すべてのリアクティブなコードをエフェクトの内部に戻します。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

一般的に、`onMount` のような、コードの*目的*ではなく*タイミング*に焦点を当てた名前の関数は疑ってかかるべきです。最初は「分かりやすい」と感じるかもしれませんが、実際にはあなたの意図を分かりづらくします。経験則から言うと、エフェクトイベントは*ユーザ*の視点から起こることに対応する必要があります。例えば、`onMessage`、`onTick`、`onVisit`、`onConnected` は、良いエフェクトイベント名です。これらのイベントの中のコードは、おそらくリアクティブである必要はないでしょう。一方、`onMount`、`onUpdate`、`onUnmount`、`onAfterRender` は名前は過度に汎用的なものであり、リアクティブにすべきコードを誤って入れてしまうことがあります。このため、エフェクトイベントの名前は、コードがいつ実行されるかではなく、*ユーザの視点から何が起こったのか*を基準にして付けるべきなのです。

</Solution>

#### 遅延表示型の通知を修正 {/*fix-a-delayed-notification*/}

チャットルームに参加すると、このコンポーネントは通知を表示します。しかし、このコンポーネントはすぐに通知を表示するわけではありません。その代わり、ユーザが UI を見て回る機会があるように、通知を意図的に 2 秒遅らせて表示します。

ほぼ機能していますが、バグがあります。ドロップダウンを "general" から "travel"、そして "music" へと素早く切り替えてみてください。十分な速さで行うと通知が 2 つ表示されますが（これ自体は期待通り）、どちらも "Welcome to music" と表示されてしまっています。

"general" から "travel"、そして "music" に素早く切り替えると、2 つの通知が表示され、1 つ目は "Welcome to travel"、2 つ目は "Welcome to music" となるように修正してください。（追加の課題として、ちゃんと 2 個の通知が正しい部屋を表示するようにした後で、後者の通知のみが表示されるようにコードを修正してみてください。）

<Hint>

エフェクトはどのルームに接続したかを知っています。エフェクトイベントに渡したい情報がありませんか？

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution>

エフェクトイベントの内部では、`roomId` は*エフェクトイベントが呼び出された時点*の値です。

今回のエフェクトイベントは、2 秒間の遅延を伴って呼び出されます。travel ルームから music ルームに素早く切り替える場合、travel ルームの通知が表示される頃には、`roomId` は既に `"music"` になっています。そのため、両方の通知で "Welcome to music" と表示されてしまったのです。

この問題を解決するには、エフェクトイベントの中で*最新の* `roomId` を読み込むのではなく、以下の `connectedRoomId` のように、エフェクトイベントのパラメータとして指定するようにします。そして、`onConnected(roomId)` のように呼び出すことで、エフェクトから `roomId` を渡すようにします。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

`roomId` が `"travel"` に設定された（つまり `"travel"` ルームに接続したときの）エフェクトは、`"travel"` の通知を表示します。`roomId` が `"music"` に設定された（つまり `"music"` ルームに接続したときの）エフェクトは、`"music"` に対する通知を表示します。つまり、`connectedRoomId` はエフェクト（リアクティブなもの）に由来し、一方で `theme` は常に最新の値を使用するのです。

追加の課題を解決するには、通知のタイムアウト ID を保存し、エフェクトのクリーンアップ関数でクリアするようにしてください。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

これによりルームを変更した際に、すでにスケジュール済み（だが未表示）の通知がキャンセルされるようになります。

</Solution>

</Challenges>
