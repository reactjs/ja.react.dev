---
title: 'カスタムフックでロジックを再利用する'
---

<Intro>

React には `useState`、`useContext`、`useEffect` など複数の組み込みフックが存在します。しかし、データの取得やユーザのオンライン状態の監視、チャットルームへの接続など、より特化した目的のためのフックが欲しいこともあります。React にこれらのフックはありませんが、アプリケーションの要求に合わせて独自のフックを作成することが可能です。

</Intro>

<YouWillLearn>

- カスタムフックとは何で、どのように自分で作成するのか
- コンポーネント間でロジックを再利用する方法
- カスタムフックの命名や構成の方法
- カスタムフックを抽出するタイミングと理由

</YouWillLearn>

## カスタムフック：コンポーネント間でのロジック共有 {/*custom-hooks-sharing-logic-between-components*/}

ネットワークに大きく依存するアプリを開発していると想像してください（ほとんどのアプリがそうですが）。アプリの使用中にユーザのネットワーク接続が急に切断された場合に、ユーザに警告を表示したいとします。どのようにすればよいでしょうか？ コンポーネントには以下の 2 つが必要になるようです。

1. ネットワークがオンラインかどうかを保持する state。
2. グローバルの [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) および [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) イベントにリスナを登録し、上記の state を更新するエフェクト。

これにより、コンポーネントはネットワークの状態と[同期](/learn/synchronizing-with-effects)するようになります。まずは以下のようなコードができるでしょう。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

ネットワークをオン・オフしてみて、この `StatusBar` が操作に反応してどのように更新されるか観察してみてください。

さて、別のコンポーネント*でも*同じロジックを使用したくなったところを想像してください。ネットワークがオフの間は "Save" の代わりに "Reconnecting..." と表示されて無効になるような保存ボタンを実装したいとします。

まず、`isOnline` state とエフェクトを、`SaveButton` にコピー・ペーストしてみましょう。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

ネットワークをオフにするとボタンの外観が変わることを確認してください。

これらの 2 つのコンポーネントはうまく動作していますが、それらの間でロジックが重複しているのは残念な感じがします。*視覚的な外観*は異なるにせよ、ロジックはそれらの間で再利用したいと思うことでしょう。

### コンポーネントから独自のカスタムフックを抽出する {/*extracting-your-own-custom-hook-from-a-component*/}

[`useState`](/reference/react/useState) や [`useEffect`](/reference/react/useEffect) と同様に、組み込みの `useOnlineStatus` というフックがあるところを、ちょっと想像してみてください。それがあれば、これらのコンポーネントを簡略化し、両者で重複しているコードを取り除けるでしょう。

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

このような組み込みのフックは存在しませんが、自分で書くことは可能です。`useOnlineStatus` という関数を宣言して、先ほど作成したコンポーネントから、重複しているコードをすべて移動しましょう。

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

関数の最後で `isOnline` を返します。これにより、コンポーネント側でその値を読み取ることができるようになります。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

ネットワークのオン・オフを切り替えることで、両方のコンポーネントが更新されることを確認してください。

これで、コンポーネント間のロジックの重複が減りました。**さらに重要なのは、コンポーネント内のコードが、「オンラインステータスを使用 (use) する」という、*何をしたいのか*の記述になっているということです。*どのようにして実現するのか*（ブラウザのイベントに登録する）ではありません**。

ロジックをカスタムフックに抽出することで、外部システムやブラウザ API とのやり取りに関する面倒な詳細を隠蔽することができます。あなたのコンポーネントのコードは、実装方法ではなく意図を表現するようになるのです。

### フックの名前は常に `use` で始める {/*hook-names-always-start-with-use*/}

React アプリケーションはコンポーネントから構築されます。コンポーネントは、組み込みのものやカスタムのものなど、フックから構築されます。他の人が作成したカスタムフックをよく使うことになりますが、時には自分で書くこともあるでしょう！

以下の命名規則に従う必要があります。

1. **React コンポーネントの名前は大文字で始まる必要があります**。例えば、`StatusBar` や `SaveButton` などです。React コンポーネントは、JSX のような、React が表示方法を知っているものを返す必要もあります。
2. **フックの名前は `use` で始めて大文字を続ける必要があります**。例えば、[`useState`](/reference/react/useState)（組み込みのもの）や `useOnlineStatus`（上述のようなカスタムのもの）などです。フックは任意の値を返すことができます。

この慣習により、コンポーネントを見るだけで、その中の state、エフェクト、その他の React 機能がどこに「隠れている」可能性があるか、常に把握できることが保証されます。例えば、コンポーネント内で `getColor()` 関数の呼び出しを見た場合、名前が `use` で始まっていないので React の state が内部に含まれている可能性はありません。しかし `useOnlineStatus()` のような関数呼び出しは、内部で他のフックを呼び出している可能性が高いです！

<Note>

リンタが [React 用に設定されている場合](/learn/editor-setup#linting)、この命名規約が強制されます。上のサンドボックスにスクロールして、`useOnlineStatus` を `getOnlineStatus` に変更してみてください。リンタは `useState` や `useEffect` をその中で呼び出すことを許さなくなります。フックやコンポーネントだけが他のフックを呼び出すことができます！

</Note>

<DeepDive>

#### レンダー中に呼び出されるすべての関数を use プレフィックスで始めるべきか？ {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

いいえ。フックを*呼び出さない*関数は、フックである必要はありません。

関数がフックを呼び出さない場合は、`use` プレフィックスを避けてください。代わりに、`use` プレフィックス*なし*の通常の関数として記述してください。例えば、以下の `useSorted` はフックを呼び出さないので、代わりに `getSorted` という名前にしましょう。

```js
// 🔴 Avoid: A Hook that doesn't use Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: A regular function that doesn't use Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

これにより、コードはこの通常の関数を、条件分岐内を含むどんな場所からでも呼び出すことができます。

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ It's ok to call getSorted() conditionally because it's not a Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

関数の内部で 1 つ以上のフックを使用している場合は、`use` プレフィックスを付ける（つまりフックにする）必要があります。

```js
// ✅ Good: A Hook that uses other Hooks
function useAuth() {
  return useContext(Auth);
}
```

厳密には、これは React によって強制されているわけではありません。原理上は、他のフックを呼び出さないフックを作成することは可能です。混乱を招き余計な制限が加わるため、このようなパターンは避けるのが賢明です。ただし、まれにこれが役立つ場合もあります。例えば、関数が現在はフックを使用していない場合でも、将来的にフック呼び出しを追加する予定があるかもしれません。その場合、`use` プレフィックスを使って名前を付けておくことは理にかなっているでしょう。

```js {3-4}
// ✅ Good: A Hook that will likely use some other Hooks later
function useAuth() {
  // TODO: Replace with this line when authentication is implemented:
  // return useContext(Auth);
  return TEST_USER;
}
```

こうすれば、コンポーネントはこのコードを条件分岐内で呼び出すことができなくなります。中でフック呼び出しを実際に追加したときに、このことが重要になります。現在も将来も内部でフックを使用する予定がない場合は、フックにしないでください。

</DeepDive>

### カスタムフックは state 自体ではなく、state を使うロジックを共有する {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

前の例では、ネットワークをオンまたはオフに切り替えると、両方のコンポーネントが同時に更新されました。しかし、`isOnline` という単一の state 変数がそれらの間で共有されていると考えるのは間違いです。こちらのコードを見てください。

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

これは、重複を抽出する前と同じ方法で動作します。

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

これらは、完全に独立した state 変数とエフェクトです！ 同時に同じ値になっているのは、たまたま（ネットワークがオンかどうかという）同一の外部の値と同期させたからです。

より分かりやすく説明するために、別の例を考えてみましょう。この `Form` コンポーネントを考えてみてください。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

各フォームフィールドに対応して、繰り返しのロジックがあります。

1. state 変数（`firstName` と `lastName`）。
1. change ハンドラ（`handleFirstNameChange` と `handleLastNameChange`）。
1. 対応する入力フィールドに `value` と `onChange` 属性を指定するための JSX。

この繰り返しのロジックを `useFormInput` というカスタムフックに抽出することができます。

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

コード内で宣言されているのは `value` という *1 つの* state 変数だけであることに注目してください。

しかし `Form` コンポーネントは `useFormInput` を *2 回* 呼び出しています。

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

これが、2 つの別々の state 変数を宣言するのと同じように動作する理由です！

**カスタムフックは、*state 自体*ではなく、*state を扱うロジック*を共有できるようにするためのものです。フックの呼び出しは、同じフックの他の場所からの呼び出しとは完全に独立しています**。これが、上記の 2 つのサンドボックスが完全に同等である理由です。よろしければ、スクロールして上に戻って見比べてみてください。カスタムフックを抽出する前と後で、挙動は全く同一です。

複数のコンポーネント間で state 自体を共有する必要がある場合は、[リフトアップして下に渡す](/learn/sharing-state-between-components)ようにしてください。

## フック間でリアクティブな値を渡す {/*passing-reactive-values-between-hooks*/}

カスタムフック内のコードは、コンポーネントの再レンダーごとに実行されます。そのため、コンポーネントと同様に、カスタムフックは[純粋である必要があります](/learn/keeping-components-pure)。カスタムフックのコードは、コンポーネントの本体の一部だと考えてください！

カスタムフックはコンポーネントと一緒に再レンダーされるため、常に最新の props と state を受け取ります。どういうことか理解するために、以下のチャットルームの例を考えてみましょう。サーバの URL やチャットルームを変更してみてください。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`serverUrl` や `roomId` を変更すると、エフェクトは[変更に「反応」して](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)再同期されます。コンソールのメッセージを見ると、エフェクトの依存配列に変更があるたびにチャットが再接続されていることがわかります。

次に、エフェクトのコードをカスタムフックに移動します。

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

これにより、`ChatRoom` コンポーネントは単にカスタムフックを呼び出せばよく、内部でどのように動作するかを気にしなくてもよくなります。

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

これはずっとシンプルに見えます！（しかしやっていることは同じです。）

依然として props や state の変更に対しロジックが*反応している*ことに注意してください。サーバ URL やルームを編集してみてください。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

ここでは、あるフックの返り値を取得して…

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

…それを別のフックに入力として渡しています。

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

`ChatRoom` コンポーネントが再レンダーされるたびに、あなたのフックには最新の `roomId` と `serverUrl` が渡されます。したがって、再レンダー後にこれらの値が異なる場合にはエフェクトがチャットの再接続を行います。（オーディオやビデオ処理ソフトウェアを使ったことがある場合、このようなフックのチェーンは、視覚エフェクトやオーディオエフェクトのチェーンに似ていると感じるかもしれません。`useState` の出力が `useChatRoom` の入力に "フィードイン" しています。）

### カスタムフックにイベントハンドラを渡す {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

このセクションでは、まだ安定版の React で**リリースされていない実験的な API** について説明しています。

</Wip>

`useChatRoom` がより多くのコンポーネントで使用されるようになると、コンポーネント側でその動作をカスタマイズしたくなってくるでしょう。例えば現在のところ、メッセージが届いたときの処理ロジックはフック内にハードコードされています。

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

このロジックをコンポーネント側に戻したいとしましょう。

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

これを実現するために、カスタムフックを変更して、`onReceiveMessage` を名前付きオプションの 1 つとして受け取るようにします。

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

これで動作しますが、カスタムフックがイベントハンドラを受け取る場合、改善できることがもう 1 つあります。

`onReceiveMessage` を依存値として追加すると、コンポーネントが再レンダーされるたびにチャットが再接続されてしまうため、あまり望ましくありません。[このイベントハンドラをエフェクトイベント (Effect Event) にラップして、依存配列から取り除きます](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)。

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
}
```

これで、`ChatRoom` コンポーネントが再レンダーされるたびにチャットが再接続されることはなくなります。以下が、イベントハンドラをカスタムフックに渡す完全なデモです。試してみてください。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`useChatRoom` を使うために*内部の動作*を知らなくても良くなったことに着目してください。他のコンポーネントに追加したり、他のオプションを渡したりしても、同じように動作します。これがカスタムフックの威力です。

## カスタムフックを使うタイミング {/*when-to-use-custom-hooks*/}

あらゆる小さなコードの重複に対してカスタムフックを抽出する必要はありません。多少の重複は問題ありません。例えば、先ほどのように 1 回の `useState` 呼び出しをラップするだけの `useFormInput` フックを抽出することは、おそらく不要でしょう。

ただし、エフェクトを書くときは常に、更にそのエフェクトをカスタムフックにラップすることでより分かりやすくならないか、検討するようにしてください。[エフェクトは頻繁には必要とされないものです](/learn/you-might-not-need-an-effect)。エフェクトを書くということは、外部システムと同期するために「React の外に踏み出す」必要がある、もしくは React に組み込みの API がない何かを行う必要があるということです。カスタムフックにラップすることで、あなたの意図とデータの流れを正確に表現することができます。

例えば、都市のリストを表示するドロップダウンと、そこで選択中の都市内にある地区のリストを表示する別のドロップダウンがある、`ShippingForm` というコンポーネントを考えてみましょう。まずは次のようなコードを書くことになるでしょう。

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // This Effect fetches cities for a country
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // This Effect fetches areas for the selected city
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

このコードはかなりの繰り返しになっていますが、[これらのエフェクトを互いに独立させておくことは正当です](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。これらは 2 つの異なるものを同期しているので、1 つのエフェクトに統合すべきではありません。代わりに、これらに共通のロジックを独自の `useData` フックとして抽出することで、上記の `ShippingForm` コンポーネントを簡略化することができます。

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

これで、`ShippingForm` コンポーネントの両方のエフェクトを `useData` の呼び出しに置き換えることができます。

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

カスタムフックに抽出することで、データの流れが明示的になります。`url` を入力し `data` を出力しているということです。`useData` の中にエフェクトを「隠す」ことで、`ShippingForm` コンポーネントで作業中の誰かが[不要な依存値](/learn/removing-effect-dependencies)を追加してしまうことを防げます。時間が経つにつれて、アプリのほとんどのエフェクトはカスタムフックに書かれるようになるでしょう。

<DeepDive>

#### カスタムフックは具体的かつ高レベルなユースケースに対して使う {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

まず、カスタムフックの名前を選ぶところから始めましょう。明確な名前を選ぶことが難しいと感じる場合、エフェクトがコンポーネントの他のロジックとあまりにも密接に関連しており、まだ抽出する準備ができていないということかもしれません。

理想的には、カスタムフックの名前は、コードをあまり書かない人でも、何をするのか、何を受け取るのか、何を返すのかを推測できるほどに明確であるべきです。

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

外部システムと同期する場合、カスタムフックの名前は、そのシステム固有の専門用語を使用したより技術的なものになるかもしれません。そのシステムに精通している人にとって明確である限り、問題はありません。

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**カスタムフックは具体的かつ高レベルのユースケースに対して使うようにしてください**。`useEffect` API 自体の代替物ないし便利なラッパとして機能させるための、カスタム「ライフサイクル」フックを作ったり使ったりしないようにしてください。

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

例えば、この `useMount` フックは、あるコードが「マウント時」にのみ実行されるようにしようとしています。

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Avoid: using custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Avoid: creating custom "lifecycle" Hooks
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'fn'
}
```

**`useMount` のようなカスタム「ライフサイクル」フックは、React のパラダイムと適合しません**。例えば、このコードサンプルには間違いがあります（`roomId` や `serverUrl` の変更に「反応」しません）が、リンタは `useEffect` の直接的な呼び出しのみをチェックするため、これに対して警告を出してくれません。あなたのフックのことは知らないからです。

エフェクトを書く場合は、まず React の API を直接使ってください。

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Good: two raw Effects separated by purpose

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

その後、様々な高レベルのユースケースに対してカスタムフックを抽出するようにします（必須ではありません）。

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Great: custom Hooks named after their purpose
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**良いカスタムフックとは、動作を制約することで呼び出し側のコードをより宣言的にするものです**。例えば、`useChatRoom(options)` はチャットルームへの接続のみを行い、`useImpressionLog(eventName, extraData)` はアナリティクスに表示ログを送信することのみを行います。あなたのカスタムフックの API がユースケースを制約しない非常に抽象的なものである場合、長期的には解決される問題よりも多くの問題を引き起こす可能性が高いでしょう。

</DeepDive>

### カスタムフックはより良いパターンへの移行を支援する {/*custom-hooks-help-you-migrate-to-better-patterns*/}

エフェクトは ["避難ハッチ"](/learn/escape-hatches) です。「React の外に踏み出す」必要があり、当該ユースケースに対してより良い組み込みのソリューションがない場合に使用するものです。長期的な React チームの目標は、より具体的な問題に対してより具体的なソリューションを提供することで、アプリ内のエフェクトの数を最小限に減らすことです。エフェクトをカスタムフックにラップしておくことで、これらのソリューションが利用可能になったときにコードのアップグレードが容易になります。

こちらの例に戻りましょう。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

上記の例では、`useOnlineStatus` は [`useState`](/reference/react/useState) と [`useEffect`](/reference/react/useEffect) のペアで実装されています。しかし、これは最善のソリューションではありません。考慮されていないエッジケースがいくつかあります。例えば、コンポーネントがマウントされたとき `isOnline` は `true` であると仮定していますが、ネットワークがすでにオフラインになっていた場合、これは誤りです。ブラウザの [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) API を使ってそれをチェックすることはできますが、それを直接使うと、サーバで初期 HTML を生成する際には動作しません。要するに、このコードには改善の余地があるということです。

幸いなことに React 18 には、これらの問題をすべて解決してくれる専用の API である [`useSyncExternalStore`](/reference/react/useSyncExternalStore) が含まれています。以下は、この新しい API を活用して書き直された `useOnlineStatus` フックです。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

```

</Sandpack>

**どのコンポーネントも変更することなしに**この移行ができたことに注目してください。

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

これが、カスタムフックにエフェクトをラップすることが有益であるもうひとつの理由です。

1. エフェクトに出入りするデータの流れが非常に明確になる。
2. コンポーネントがエフェクトの実装そのものではなく、意図にフォーカスできるようになる。
3. React が新しい機能を追加したときに、コンポーネントを変更せずにエフェクトを削除できるようになる。

[デザインシステム](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)と同様に、アプリのコンポーネントから共通の定型コードをカスタムフックに抽出することは役立つでしょう。これにより、コンポーネントのコードは意図を表現するようになり、生のエフェクトを頻繁に書くことを避けることができるようになります。React コミュニティでは多くの優れたカスタムフックがメンテナンスされています。

<DeepDive>

#### 将来 React はデータフェッチのための組み込みソリューションを提供するか？ {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

まだ詳細は検討中ですが、将来的にはデータフェッチを以下のように書くことになるでしょう。

```js {1,4,6}
import { use } from 'react'; // Not available yet!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

アプリで上記のような `useData` のようなカスタムフックを使用しておくことで、最終的に推奨されるアプローチに移行する際に、コンポーネントごとに手動で生のエフェクトを書く場合よりも変更が少なくて済みます。ただし、古いアプローチでも問題なく動作するので、生のエフェクトを書くことに満足している場合は、それを続けることもできます。

</DeepDive>

### やり方は 1 つではない {/*there-is-more-than-one-way-to-do-it*/}

ブラウザの [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API を使って、*ゼロから*フェードインアニメーションを実装したいとしましょう。アニメーション用のループを設定するエフェクトから始めることになるでしょう。アニメーションの各フレームでは、[ref で保持している](/learn/manipulating-the-dom-with-refs) DOM ノードの不透明度を `1` になるまで更新していきます。最初のコードは次のようになるでしょう。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

このコンポーネントをより読みやすくするために、`useFadeIn` カスタムフックにロジックを抽出することができます。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // We still have more frames to paint
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

この `useFadeIn` はこのままでも構いませんが、さらにリファクタリングすることも可能です。例えば、アニメーションループの設定ロジックを `useFadeIn` の外のカスタム `useAnimationLoop` フックへと抽出することができます。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

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

</Sandpack>

ただし、これは*必須*ではありませんでした。通常の関数と同様、コードのどこに分割線を引いていくのかは、最終的にあなたが決めることです。また、まったく異なるアプローチを取ることもできます。エフェクト内にロジックを保持する代わりに、命令型のロジックのほとんどを JavaScript の[クラス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)内に移動することもできるでしょう。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // We still have more frames to paint
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

エフェクトとは React を外部システムに接続することができるものです。エフェクト間で多くの調整が必要になればなるほど（例えば、複数のアニメーションを連動させるなど）、上記のサンドボックスのようにエフェクトやフックからロジックを*完全に*抽出してしまうことがより意味を持つようになります。そうすればその抽出したコード*こそが*「外部システム」となります。これにより、その React 外に移動したシステムにメッセージを送るだけでよくなるため、エフェクトはシンプルに保たれるでしょう。

なお上記の例では、フェードインのロジックを JavaScript で記述する必要があると仮定していました。ただしこの特定のケースに関して言えば、このフェードインアニメーションは単純な [CSS アニメーション](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)で実装する方がずっと簡単で効率的です。

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

ときには、そもそもフック自体が不要ということです！

<Recap>

- カスタムフックを使ってコンポーネント間でロジックを共有できる。
- カスタムフックの名前は `use` で始めて大文字を続ける必要がある。
- カスタムフックは state 自体ではなく、state を使うロジックを共有する。
- あるフックから別のフックにリアクティブな値を渡すことができ、それらは最新の状態に保たれる。
- すべてのフックはコンポーネントが再レンダーされるたびに再実行される。
- カスタムフックのコードは、コンポーネントコードと同様に純粋である必要がある。
- カスタムフックが受け取るイベントハンドラはエフェクトイベントにラップする。
- `useMount` のようなカスタムフックを作成してはいけない。常に目的は具体的なものにする。
- コードの境界をどこにどのように置くかはあなたが決定する。

</Recap>

<Challenges>

#### `useCounter` フックを抽出 {/*extract-a-usecounter-hook*/}

このコンポーネントは、state 変数とエフェクトを使い、1 秒ごとに増加する数値を表示しています。このロジックを `useCounter` というカスタムフックに抽出してください。目標は、`Counter` コンポーネントの実装が以下のようになることです。

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

カスタムフックを `useCounter.js` に記述して、`Counter.js` ファイルにインポートする必要があります。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
// Write your custom Hook in this file!
```

</Sandpack>

<Solution>

以下のようなコードになるでしょう。

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

`App.js` は `useState` や `useEffect` をインポートする必要がなくなったことに注意してください。

</Solution>

#### カウンタの遅延を設定可能に {/*make-the-counter-delay-configurable*/}

この例にはスライダで制御されている `delay` という state 変数がありますが、その値は使用されていません。`delay` の値をカスタム `useCounter` フックに渡すとともに、`useCounter` フックの中身を変更して、ハードコードされた `1000` ms の代わりに渡された `delay` を使用するようにしてください。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

`useCounter(delay)` のようにして `delay` をフックに渡します。次にフック内で、ハードコードされた `1000` の値の代わりに `delay` を使用します。`delay` をエフェクトの依存配列に追加する必要があります。これにより、`delay` を変更することでインターバルが確実にリセットされるようになります。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### `useCounter` から `useInterval` を抽出 {/*extract-useinterval-out-of-usecounter*/}

現在あなたの `useCounter` フックは 2 つのことを行っています。インターバルの設定と、各インターバルごとに state 変数をインクリメントすることです。インターバルを設定するロジックを、`useInterval` という別のフックに分割してください。フックは `onTick` コールバックと `delay` の 2 つの引数を受け取る必要があります。この変更後、`useCounter` の実装は次のようになります。

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

`useInterval.js` ファイルに `useInterval` を記述し、`useCounter.js` ファイルにインポートするようにします。

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js useInterval.js
// Write your Hook here!
```

</Sandpack>

<Solution>

`useInterval` 内のロジックは、インターバルの設定とクリアを行う必要があります。それ以外のことは何もする必要はありません。

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

実はこの答えにはまだちょっとした問題がありますが、それは次のチャレンジ問題で修正します。

</Solution>

#### インターバルがリセットされる問題を修正 {/*fix-a-resetting-interval*/}

以下の例には *2 つの*別々のインターバルがあります。

`App` コンポーネントは `useCounter` を呼び出しており、それは内部でカウンタを毎秒更新するために `useInterval` を呼び出しています。さらにこの `App` コンポーネントは、ページの背景色を 2 秒ごとにランダムに更新するために別の `useInterval` を呼び出しています。

しかし何らかの理由で、ページの背景を更新するコールバックが実行されません。`useInterval` 内に以下のようにログを追加してみてください：

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

表示されるログは期待通りのものですか？ エフェクトが不必要に再同期されるように見えるとして、どの依存値が原因で起こっているか分かるでしょうか？ エフェクトからその依存値を[削除する](/learn/removing-effect-dependencies)方法はありますか？

問題を修正すると、ページの背景が 2 秒ごとに更新されるようになるはずです。

<Hint>

`useInterval` フックは引数としてイベントリスナを受け取っているようです。このイベントリスナをエフェクトの依存値にせずとも済むよう、これをラップする方法はなかったでしょうか？

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

[上記で行ったように](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)、`useInterval` の中で、tick コールバックをエフェクトイベント内にラップします。

これにより、エフェクトの依存配列から `onTick` をなくすことができます。エフェクトがコンポーネントの再レンダーごとに再同期されることはなくなり、ページ背景色変更のためのインターバルが発火する前に毎秒リセットされてしまうこともなくなります。

この変更により、両方のインターバルが期待通りに動作し、互いに干渉しないようになります。

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
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### タイムシフト効果の実装 {/*implement-a-staggering-movement*/}

この例では、`usePointerPosition()` フックが現在のポインタ位置を追跡しています。プレビューエリア上でカーソルや指を動かしてみて、赤い点が動きに追従するのを確認してください。その座標は `pos1` 変数に保存されています。

実は、5 つ (!) の赤い点が別々にレンダーされています。すべて同じ位置に表示されているので全部を見ることはできません。あなたのタスクはこれを修正することです。代わりに実装したいのは「時間をずらした」動きです。各ドットが前のドットの経路を「追いかける」必要があります。たとえば、カーソルを素早く移動すると、最初のドットはすぐにそれに追従し、2 つ目のドットは最初のドットに少し遅れて追従し、3 つ目のドットは 2 つ目のドットに追従する、といった具合です。

`useDelayedValue` カスタムフックを実装してください。現在の実装は渡された `value` をそのまま返しています。代わりに、`delay` ミリ秒前の値を返すようにしたいです。これを実現するためには state とエフェクトが必要になるかもしれません。

`useDelayedValue` を実装した後、点が別の点を追いかけるように動くのが見えるはずです。

<Hint>

カスタムフック内で `delayedValue` を state 変数として保持する必要があります。`value` が変更されたときに、エフェクトを実行したいです。このエフェクトは、`delay` が経過した後に `delayedValue` を更新する必要があります。`setTimeout` を呼び出すといいかもしれません。

このエフェクトにクリーンアップは必要ですか？ それはなぜですか？

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implement this Hook
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

以下が動作するバージョンです。state 変数として `delayedValue` を保持するようにします。`value` が更新されると、エフェクトが `delayedValue` を更新するタイムアウトをセットします。これにより、`delayedValue` は常に実際の `value` の後に「遅れて」更新されるようになります。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

このエフェクトには*クリーンアップが必要ない*ことに注意してください。クリーンアップ関数で `clearTimeout` を呼び出すと、`value` が変更されるたびにすでにスケジュールされているタイムアウトがリセットされてしまいます。連続的な動きを保つためには、すべてのタイムアウトが発火する必要があります。

</Solution>

</Challenges>
