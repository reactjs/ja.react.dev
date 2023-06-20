---
title: 'イベントとエフェクトを切り離す'
---

<Intro>

イベントハンドラは同じインタラクションを再度実行した場合のみ再実行されます。イベントハンドラとは異なり、エフェクトは、プロパティや state 変数のような読み取った値が、前回のレンダー時の値と異なる場合に再同期を行います。また、ある値には反応して再実行するが、他の値には反応しないエフェクトなど、両方の動作をミックスさせたい場合もあります。このページでは、その方法を説明します。

</Intro>

<YouWillLearn>

- イベントハンドラとエフェクトの選択方法
- エフェクトがリアクティブで、イベントハンドラがリアクティブでない理由
- エフェクトのコードの一部をリアクティブにしない場合の対処法
- エフェクトイベントとは何か、そしてエフェクトイベントからエフェクトを抽出する方法
- エフェクトイベントを使用してエフェクトから最新の props と state を読み取る方法

</YouWillLearn>

## イベントハンドラとエフェクトのどちらを選ぶか {/*choosing-between-event-handlers-and-effects*/}

まず、イベントハンドラとエフェクトの違いについておさらいしましょう。

チャットルームのコンポーネントを実装している場合を想像してください。要件は次のようなものです：

1. コンポーネントは選択されたチャットルームに自動的に接続する
2. 「Send」ボタンをクリックすると、チャットにメッセージが送信される

あなたはそのためのコードはすでに実装されているが、それをどこに置くか迷っているとしましょう。イベントハンドラを使うべきか、エフェクトを使うべきか。この質問に答える必要があるたびに、[なぜそのコードが実行される必要があるのかを考えてみてください。](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)

### 特定のインタラクションに反応して実行されるイベントハンドラ {/*event-handlers-run-in-response-to-specific-interactions*/}

ユーザの立場からすると、メッセージの送信は、特定の「送信」ボタンがクリックされたから起こるはずです。それ以外の時間や理由でメッセージを送信すると、ユーザはむしろ怒るでしょう。そのため、メッセージの送信はイベントハンドラで行う必要があります。イベントハンドラを使えば、特定のインタラクションを処理することができます：

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

イベントハンドラを使えば、ユーザがボタンを押したときだけ `sendMessage(message)` が実行されるようにすることができます。

### 同期が必要なときに実行されるエフェクト {/*effects-run-whenever-synchronization-is-needed*/}

また、コンポーネントをチャットルームに接続しておく必要があることを思い出してください。そのコードはどこに記述されるのでしょうか？

このコードを実行する理由は、何か特定のインタラクションではありません。ユーザがなぜ、どのようにチャットルームの画面に移動したかは問題ではありません。ユーザがチャットルームの画面を見て、対話できるようになった今、このコンポーネントは、選択されたチャットサーバに接続されたままである必要があります。チャットルーム・コンポーネントがアプリの初期画面であり、ユーザが何のインタラクションも行っていない場合でも、接続する必要があります。これがエフェクトである理由です：

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

このコードを使用すると、ユーザが行った特定のインタラクションに関係なく、現在選択されているチャットサーバへの接続が常にアクティブであることを確認することができます。ユーザがアプリを開いただけであろうと、別の部屋を選んだだけであろうと、別の画面に移動して戻ってきただけであろうと、このエフェクトはコンポーネントが現在選択されている部屋と同期していることを保証し、[必要なときはいつでも再接続するようにします。](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

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

直感的に言うと、イベントハンドラは、例えばボタンをクリックするなど、常に「手動」でトリガされます。一方、エフェクトは「自動」であり、同期を保つために必要な回数だけ実行され、再実行されます。

もっと正確な考え方があります。

コンポーネントの body 内で宣言された props 、state 、変数を<CodeStep step={2}>リアクティブ値</CodeStep>と呼びます。この例では、`serverUrl` はリアクティブ値ではありませんが、`roomId` と `message` はリアクティブ値です。これらは、レンダーのデータフローに参加しています：

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```
これらのようなリアクティブな値は、再レンダーによって変更される可能性があります。例えば、ユーザが `message` を編集したり、ドロップダウンで別の `roomId` を選択することがあります。イベントハンドラとエフェクトは、それぞれ異なる方法で変化に対応します：

- **イベントハンドラ内のロジックはリアクティブではない。**ユーザが同じ操作（クリックなど）を再度行わない限り、再度実行されることはありません。イベントハンドラは、その変更に「反応」することなく、リアクティブ値を読み取ることができます。
- **エフェクト内のロジックはリアクティブである。**エフェクトがリアクティブ値を読み取る場合、[依存配列としてそれを指定する必要があります。](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)そして、再レンダーによってその値が変更された場合、React は新しい値でエフェクトのロジックを再実行します。 

この違いを説明するために、先ほどの例をもう一度見てみましょう。

### イベントハンドラ内のロジックはリアクティブではない {/*logic-inside-event-handlers-is-not-reactive*/}

このコードの行を見てみてください。このロジックはリアクティブであるべきでしょうか、そうではないでしょうか？

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

ユーザから見れば、**`message` の変更は、メッセージを送りたいということではありません。**あくまでも、ユーザが入力していることを意味します。つまり、メッセージを送るロジックはリアクティブであってはならないのです。<CodeStep step={2}>リアクティブ値</CodeStep>が変わったからと言って、再び実行されるべきではないのです。だから、イベントハンドラの中にあるのです：

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

イベントハンドラはリアクティブではないので、`sendMessage(message)`はユーザが送信ボタンをクリックしたときのみ実行されます。

### エフェクト内のロジックはリアクティブである {/*logic-inside-effects-is-reactive*/}

では、この行に戻りましょう：

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

ユーザからすると、**`roomId` の変更は、別の部屋に接続したいことを意味します。**つまり、ルームに接続するためのロジックはリアクティブであるべきなのです。これらのコードは、<CodeStep step={2}>リアクティブ値</CodeStep>に「ついていける」ようにし、その値が異なる場合は再度実行するようにします。だから、エフェクトの中にあるのです：

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

エフェクトはリアクティブなので、`createConnection(serverUrl, roomId)` と `connection.connect()` は、`roomId` の異なる値ごとに実行されます。エフェクトは、現在選択されているルームに同期したチャット接続を維持します。

## エフェクトから非リアクティブなロジックを抽出する {/*extracting-non-reactive-logic-out-of-effects*/}

リアクティブなロジックと非リアクティブなロジックを混在させる場合は、さらに厄介なことになります。

例えば、ユーザがチャットに接続したときに通知を表示したいとします。props から現在のテーマ（ダークまたはライト）を読み取り、正しい色で通知を表示することができます：

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

しかし、`theme` はリアクティブな値であり（再レンダーの結果として変化する可能性がある）、[エフェクトが読み取るすべてのリアクティブ値は、その依存配列として宣言する必要があります。](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)そこで、エフェクトの依存配列として `theme` を指定する必要があります：

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

この例で遊んでみて、このユーザエクスペリエンスの問題点を見つけることができるかどうか確認してください：

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

`roomId` が変わると、期待通りチャットが再接続されます。しかし、`theme` も依存関係にあるため、ダークとライトを切り替えるたびに、チャットも再接続されます。これはあまり良くないですね！

つまり、この行は（リアクティブである）エフェクトの中にあるにもかかわらず、リアクティブであってほしくないということです：

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

この非リアクティブなロジックと、その周りのリアクティブエフェクトを切り離す方法が必要です。

### エフェクトイベントの宣言 {/*declaring-an-effect-event*/}

<Wip>

このセクションでは、まだ安定版の React で**リリースされていない実験的な API** について説明しています。

</Wip>

[`useEffectEvent`](/reference/react/experimental_useEffectEvent) という特別な Hook を使って、エフェクトからこの非リアクティブなロジックを抽出します：

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
```

ここでは、`onConnected` は*エフェクトイベント*と呼ばれています。これはエフェクトロジックの一部ですが、イベントハンドラにより近い動作をします。この中のロジックはリアクティブではなく、常に props と state の最新の値を「見る」ことができます。

これでエフェクトの内部から `onConnected` エフェクトイベントを呼び出せるようになりました：

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

これで問題は解決しました。なお、エフェクトの依存配列のリストから `onConnected` を削除する必要がありました。**エフェクトイベントはリアクティブではないので、依存配列から除外する必要があります。**

新しい動作が期待通りに振舞うことを確認します：

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

エフェクトイベントは、イベントハンドラと非常に似ていると考えることができます。主な違いは、イベントハンドラがユーザの操作に反応して実行されるのに対し、エフェクトイベントはエフェクトからトリガされることです。エフェクトイベントは、エフェクトのリアクティブ性と反応しないはずのコードとの間の「連鎖を断ち切る」ことができます。

### エフェクトイベントで最新の props や state を取得する {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

このセクションでは、まだ安定版の React で**リリースされていない実験的な API** について説明しています。

</Wip>

エフェクトイベントによって、依存性リンタを抑制したくなるような多くのパターンを修正することができます。

例えば、ページの訪問を記録するエフェクトがあるとします：

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

その後、サイトに複数のルートを追加します。ここで、`Page` コンポーネントは現在のパスを持つ `url` プロパティを受け取ります。この `url` を `logVisit` 呼び出しの一部として渡したいのですが、依存性リンタが文句を言ってきます：

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

コードに何をさせたいか考えてみてください。各 URL は異なるページを表しているので、異なる URL に対して別々の訪問を記録*したいのです*。言い換えれば、この `logVisit` 呼び出しは、`url` に関して反応的で*なければなりません*。このため、この場合は、依存関係リンタに従って、`url` を依存配列に追加することが理にかなっています：

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

ここで、ページ訪問ごとにショッピングカートの商品数を一緒に表示させたいとします：

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

あなたはエフェクトの中で `numberOfItems` を使用したので、リンタは依存値としてそれを追加するように求めます。しかし、`logVisit` の呼び出しが `numberOfItems` に対してリアクティブであることを望んでいません。ユーザがショッピングカートに何かを入れて、`numberOfItems` が変化しても、それはユーザが再びページを訪れたことを*意味しない*。つまり、*ページを訪れた*ということは、ある意味で"イベント"なのです。ある瞬間に起こるのです。

コードを 2 つに分割してみましょう：

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

一方、エフェクトそのものはリアクティブなままです。エフェクトの中のコードは `url` プロパティを使用するので、異なる `url` で再レンダーするたびにエフェクトが再実行されます。その結果、`onVisit` エフェクトイベントが呼び出されます。

その結果、`url` の変更ごとに `logVisit` が呼び出され、常に最新の `numberOfItems` を読み取ることになります。ただし、`numberOfItems` が独自に変化しても、コードの再実行には至りません。

<Note>

引数なしで `onVisit()` を呼び出し、その中の `url` を読み取ることができるかどうか疑問に思うかもしれません：

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

これでもいいのですが、この `url` を明示的にエフェクトイベントに渡す方がいいでしょう。**エフェクトイベントの引数として `url` を渡すことで、異なる `url` を持つページを訪問することが、ユーザの視点から見ると別の"イベント"を構成していると伝えることになります。**`visitedUrl` は、起こった"イベント"の*一部*なのです：

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

エフェクトイベントで `visitedUrl` を明示的に"要求"するので、エフェクトの依存配列から誤って `url` を削除することができなくなりました。もし、`url` の依存値を削除してしまうと（別々のページへの訪問が 1 つとしてカウントされてしまう）、リンタはそれについて警告を発します。`onVisit` が `url` に関して反応的であることを期待するので、`url` を内部で読み込む代わりに（反応的でない）、エフェクト*から*それを渡します。

これは、エフェクトの中に非同期のロジックがある場合に特に重要になります：

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

ここで、`onVisit` 内の `url` は*最新*の `url`（既に変更されている可能性がある）に対応し、`visitedUrl` はこのエフェクト（およびこの `onVisit` コール）を最初に実行させた `url` に対応しています。

</Note>

<DeepDive>

#### 代わりに依存性リンタを抑制してもいいのでしょうか？ {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

既存のコードベースでは、このように lint ルールが抑制されているのを見かけることがあります：

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

`useEffectEvent` が React の安定した一部となった後、**決してリンタを抑制しない**ことをお勧めします。

ルールを抑制することの最初の欠点は、コードに導入した新しいリアクティブな依存配列にエフェクトが"反応する"必要があるときに、React が警告を発しなくなることです。先ほどの例では、依存配列に `url` を追加したのは、React がそれをするよう思い出させてくれたからです。リンタを無効にすると、今後そのエフェクトを編集する際に、そのようなリマインダを受け取ることができなくなります。これはバグにつながります。

以下は、リンタを抑制することで発生する紛らわしいバグの一例です。この例では、`handleMove` 関数は、ドットがカーソルに従うべきかどうかを決定するために、現在の `canMove` state 変数の値を読むことになっています。しかし、`handleMove` の内部では `canMove` は常に `true` です。

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

このコードの問題は、依存性リンタを抑制することにあります。抑制を解除すると、このエフェクトは `handleMove` 関数に依存する必要があることがわかります。これは理にかなっています。なぜならば、`handleMove` はコンポーネント本体の内部で宣言されるため、リアクティブな値であることがわかります。すべてのリアクティブ値は、依存値として指定されなければなりませんが、そうでなければ時間の経過とともに陳腐化する可能性があります！

元のコードの作者は、React に対して「エフェクトはどのリアクティブ値にも依存しない（`[]`）」と "嘘"をついています。そのため、React は `canMove` が変更された後にエフェクトを再同期させなかったのです（`handleMove` に関しても）。React はエフェクトを再同期しなかったため、リスナとしてアタッチされる `handleMove` は、初期レンダー時に作成された `handleMove` 関数となります。初期レンダー時には `canMove` は `true` であったため、初期レンダー時の `handleMove` は永遠にその値を見ることになります。

**リンタを抑制することがなければ、陳腐化した値で問題が発生することはありません。**

`useEffectEvent` を使えば、リンタに"嘘"をつく必要はなく、期待通りにコードが動きます：

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

これは、`useEffectEvent` が*常に*正しい解決策であることを意味するものではありません。リアクティブにしたくないコード行にのみ適用する必要があります。上記のサンドボックスでは、エフェクトのコードが `canMove` に関して反応的であることを望んでいませんでした。そのため、エフェクトイベントを抽出することが理にかなっています。

リンタを抑制する他の正しい方法については、[エフェクトの依存関係を削除する](/learn/removing-effect-dependencies)を参照してください。

</DeepDive>

### エフェクトイベントの制限について {/*limitations-of-effect-events*/}

<Wip>

このセクションでは、まだ安定版の React で**リリースされていない実験的な API** について説明しています。

</Wip>

エフェクトイベントは、使い方が非常に限定されています：

* **エフェクトの内部からしか呼び出すことができません。**
* **他のコンポーネントやフックに渡してはいけません。**

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

その代わりに、常にエフェクトイベントを使用するエフェクトのすぐ隣で宣言してください：

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

エフェクトイベントは、エフェクトのコードの中で反応しない"ピース"です。それらを使用するエフェクトの隣に置く必要があります。

<Recap>

- イベントハンドラは、特定のインタラクションに応答して実行されます。
- 同期が必要なときはいつでもエフェクトが実行されます。
- イベントハンドラ内のロジックは、リアクティブではありません。
- エフェクト内のロジックは、リアクティブです。
- エフェクトの非リアクティブなロジックをエフェクトイベントに移動することができます。
- エフェクトイベントを呼び出せるのはエフェクトの内部だけです。
- エフェクトイベントを他のコンポーネントや Hooks に渡さないでください。

</Recap>

<Challenges>

#### 更新されない変数を修正する {/*fix-a-variable-that-doesnt-update*/}

この `Timer` コンポーネントは、1 秒ごとに増加する `count` state 変数を保持します。増加する値は、`increment` state 変数に格納されます。プラスボタンとマイナスボタンで `increment` 変数を制御できます。

しかし、プラスボタンを何度クリックしても、カウンタは 1 秒ごとに 1 つずつ増えていきます。このコードの何が問題なのでしょうか？ なぜエフェクトのコード内部では `increment` が常に 1 に等しいのでしょうか？ 間違いを見つけて修正しましょう。

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

例によって、エフェクトのバグを探すときは、リンタで抑制している箇所を探すことから始めてください。

抑制コメントを削除すると、React はこのエフェクトのコードが `increment` に依存していることを教えてくれますが、このエフェクトはリアクティブ値（`[]`）に依存していないと主張することで React に"嘘をついた"のです。依存配列に `increment` を追加します：

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

これで `increment` が変わると、React はエフェクトを再同期し、インターバルを再開します。

</Solution>

#### カウンタのフリーズを修正する {/*fix-a-freezing-counter*/}

この `Timer` コンポーネントは、1 秒ごとに増加するカウントの `state` 変数を保持します。増加する値は、`increment` state 変数に格納され、プラスとマイナスのボタンでコントロールすることができます。例えば、プラスボタンを 9 回押してみると、1 秒ごとにカウントが 1 ずつではなく、10 ずつ増えていくことがわかります。

このユーザインターフェースには少し問題があります。プラス・マイナスボタンを 1 秒間に 1 回以上押し続けると、タイマーが一時停止してしまうのです。最後にどちらかのボタンを押してから 1 秒が経過すると、タイマーが再開します。この原因を突き止め、タイマーを *1* 秒単位で中断させないように修正しましょう。

<Hint>

タイマーを設定するエフェクトが `increment` 値に"反応"しているような気がするのですが。`setCount` を呼び出すために現在の `increment` 値を使用する行は、本当にリアクティブである必要があるのでしょうか？

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

問題はエフェクト内のコードが `increment` state 変数を使用していることです。この変数はエフェクトの依存値なので、`increment` を変更するたびにエフェクトが再同期し、インターバルがクリアされることになります。発火する前に毎回インターバルをクリアし続けると、タイマーが停止したように見えてしまいます。

この問題を解決するには、エフェクトから `onTick` エフェクトイベントを抽出します：

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

`onTick` はエフェクトイベントなので、その中のコードはリアクティブではありません。`increment` を変更しても、エフェクトはトリガしません。

</Solution>

#### 調整不可能な遅延を修正する {/*fix-a-non-adjustable-delay*/}

この例では、インターバルの遅延をカスタマイズすることができます。これは、2 つのボタンによって更新される `delay` state 変数に格納されています。しかし、`delay` が 1000 ミリ秒（つまり 1 秒）になるまで"プラス 100 ミリ秒"ボタンを押しても、タイマーは非常に速く（100 ミリ秒ごとに）増えることに気づくでしょう。まるで、`delay` の変更が無視されているようです。このバグを発見し、修正してください。

<Hint>

エフェクトイベントの中のコードはリアクティブではありません。`setInterval` の呼び出しを再実行させたいケースはあるのでしょうか？

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

上記の例の問題点は、コードが実際に何をすべきかを考えずに `onMount` というエフェクトイベントを抽出してしまったことです。エフェクトイベントを抽出するのは、コードの一部を非リアクティブにしたいときという特別な理由だけにしてください。しかし、`setInterval` の呼び出しは `delay` state 変数に対してリアクティブであるべきです。`delay` が変更された場合、インターバルを一から設定する必要があります！ このコードを修正するには、すべてのリアクティブなコードをエフェクトの内部に引き戻します：

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

一般的に、`onMount` のようなコードの一部分の目的ではなく、タイミングに焦点を当てた関数は疑ってかかるべきでしょう。最初は"分かりやすい"と感じるかもしれませんが、あなたの意図は分からなくなります。経験則から言うと、エフェクトイベントは*ユーザ*の視点から起こる何かに対応する必要があります。例えば、`onMessage`、`onTick`、`onVisit`、`onConnected` は、良いエフェクトイベント名です。これらのイベントの中のコードは、おそらくリアクティブである必要はないでしょう。一方、`onMount`、`onUpdate`、`onUnmount`、`onAfterRender` は汎用性が高いのでリアクティブにすべきコードを誤って入れてしまうことがあります。このため、エフェクトイベントの名前は、あるコードが実行されたときではなく、*ユーザが考えたことが起こった*ときに付けるようにします。

</Solution>

#### 通知の遅延を修正する {/*fix-a-delayed-notification*/}

チャットルームに参加すると、このコンポーネントは通知を表示します。しかし、このコンポーネントはすぐに通知を表示するわけではありません。その代わり、ユーザが UI を見回す機会があるように、通知を 2 秒遅らせて人工的に表示します。

これはほとんど機能しますが、バグがあります。ドロップダウンを "general" から "travel"、そして "music" へと素早く変えてみてください。十分な速さで行うと、2 つの通知が表示されますが（予想通り！）、どちらも "Welcome to music" と表示されます。

"general" から "travel"、そして "music" に素早く切り替えると、2 つの通知が表示され、1 つ目は "Welcome to travel"、2 つ目は "Welcome to music" と表示されるように修正してください。(追加の課題として、*すでに*通知が正しい部屋を表示するようになっていると仮定して、後者の通知のみが表示されるようにコードを変更してみてください。)

<Hint>

エフェクトはどのルームに接続したかを知っています。エフェクトイベントに渡したい情報はありますか？

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

エフェクトイベントは、2 秒間の遅延を伴って呼び出されます。travel room から music room に素早く切り替える場合、travel room の通知が表示される頃には、`roomId` は既に `"music"` になっています。そのため、両方の通知で "Welcome to music" と表示されます。

この問題を解決するには、エフェクトイベントの中で*最新の* `roomId` を読み込むのではなく、以下の `connectedRoomId` のように、エフェクトイベントのパラメータとして `roomId` を指定します。そして、`onConnected(roomId)` を呼び出すことで、エフェクトから `roomId` を渡します：

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

`roomId` が `"travel"` に設定されていたエフェクト（`"travel"` ルームに接続していた）には、`"travel"` の通知が表示されます。`roomId` が `"music"` に設定された（つまり `"music"` ルームに接続した）エフェクトは、`"music"` に対する通知を表示します。つまり、`connectedRoomId` はエフェクト（リアクティブなもの）に由来し、`theme` は常に最新の値を使用します。

この追加の課題を解決するには、通知のタイムアウト ID を保存し、エフェクトのクリーンアップ関数でクリアしてください：

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

これにより、部屋を変更したときに、すでに予定されている（まだ表示されていない）通知がキャンセルされるようになります。

</Solution>

</Challenges>
