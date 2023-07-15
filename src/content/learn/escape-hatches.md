---
title: 避難ハッチ
---

<Intro>

コンポーネントによっては、React 外のシステムに対して制御や同期を必要とする場合があります。例えば、ブラウザ API を使用して入力フィールドにフォーカスを当てる、React を使用せずに実装されたビデオプレーヤの再生や一時停止を行う、あるいはリモートサーバに接続してメッセージをリッスンする、といったものです。この章では、React の「外側に踏み出して」外部システムに接続するための避難ハッチ (escape hatch) を学びます。アプリケーションのロジックとデータフローの大部分は、これらの機能に依存しないようにすべきです。

</Intro>

<YouWillLearn isChapter={true}>

* [再レンダーせずに情報を「記憶」する方法](/learn/referencing-values-with-refs)
* [React が管理している DOM 要素にアクセスする方法](/learn/manipulating-the-dom-with-refs)
* [コンポーネントを外部システムと同期させる方法](/learn/synchronizing-with-effects)
* [不要なエフェクトをコンポーネントから削除する方法](/learn/you-might-not-need-an-effect)
* [エフェクトのライフサイクルとコンポーネントのライフサイクルの違い](/learn/lifecycle-of-reactive-effects)
* [値がエフェクトを再トリガするのを防ぐ方法](/learn/separating-events-from-effects)
* [エフェクトの再実行頻度を下げる方法](/learn/removing-effect-dependencies)
* [コンポーネント間でロジックを共有する方法](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## ref で値を参照する {/*referencing-values-with-refs*/}

コンポーネントに情報を「記憶」させたいが、その情報が[新しいレンダーをトリガ](/learn/render-and-commit)しないようにしたい場合、ref を使うことができます。

```js
const ref = useRef(0);
```

state と同様に、ref は React によって再レンダー間で保持されます。しかし、state はセットするとコンポーネントが再レンダーされます。ref は、変更してもコンポーネントが再レンダーされません！ `ref.current` プロパティを通じて ref の現在の値にアクセスできます。

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

</Sandpack>

ref は、React が管理しない、コンポーネントの秘密のポケットのようなものです。例えば、[タイムアウト ID](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value)、[DOM 要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)、その他コンポーネントのレンダー出力に影響を与えないオブジェクトを格納するために ref を使用できます。

<LearnMore path="/learn/referencing-values-with-refs">

[**ref で値を参照する**](/learn/referencing-values-with-refs)を読んで、ref を使って情報を記憶する方法を学びましょう。

</LearnMore>

## ref で DOM を操作する {/*manipulating-the-dom-with-refs*/}

React はレンダー結果に合致するよう自動的に DOM を更新するため、コンポーネントで DOM を操作する必要は通常ほとんどありません。ただし、ノードにフォーカスを当てたり、スクロールさせたり、サイズや位置を測定したりするなどの場合に、React が管理する DOM 要素へのアクセスが必要なことがあります。React にはこれらを行う組み込みの方法が存在しないため、DOM ノードを参照する *ref* が必要になります。例えば、以下のボタンをクリックすると、ref を使用して入力欄にフォーカスが当たります。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

[**ref で DOM を操作する**](/learn/manipulating-the-dom-with-refs)を読んで、React が管理する DOM 要素にアクセスする方法を学びましょう。

</LearnMore>

## エフェクトを使って同期を行う {/*synchronizing-with-effects*/}

一部のコンポーネントは外部システムと同期を行う必要があります。例えば、React の state に基づいて非 React 製コンポーネントを制御したり、サーバとの接続を確立したり、コンポーネントが画面に表示されたときに分析用のログを送信したりしたいかもしれません。特定のイベントを処理するイベントハンドラとは異なり、*エフェクト (Effect)* を使うことで、レンダー後にコードを実行することができます。これは React 外のシステムとコンポーネントを同期させるために使用します。

Play/Pause を何度か押して、ビデオプレーヤが `isPlaying` の値と同期していることを確認してみてください。

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

多くのエフェクトは自身を「クリーンアップ」します。例えば、チャットサーバへの接続をセットアップするエフェクトは、そのサーバからコンポーネントを切断する方法を React に伝えるために*クリーンアップ関数*を返します。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

開発環境では、React はエフェクトの実行とクリーンアップを素早く 1 回余分に実行します。これが `"✅ Connecting..."` が 2 回表示される理由です。これにより、クリーンアップ関数の実装を忘れることがないようになっています。

<LearnMore path="/learn/synchronizing-with-effects">

[**エフェクトを使って同期を行う**](/learn/synchronizing-with-effects)を読んで、コンポーネントを外部システムと同期させる方法を学びましょう。

</LearnMore>

## エフェクトは必要ないかもしれない {/*you-might-not-need-an-effect*/}

エフェクトは React のパラダイムからの避難ハッチです。React の外に「踏み出して」、何らかの外部システムと同期させることができるものです。外部システムが関与していない場合（例えば、props や state の変更に合わせてコンポーネントの state を更新したい場合）、エフェクトは必要ありません。不要なエフェクトを削除することで、コードが読みやすくなり、実行速度が向上し、エラーが発生しにくくなります。

エフェクトが不要な場合として一般的なのは次の 2 つのケースです。
- **レンダーのためのデータ変換にエフェクトは必要ありません。**
- **ユーザイベントの処理にエフェクトは必要ありません。**

例えば、他の state に基づいてほかの state を調整するのに、エフェクトは必要ありません。

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

代わりに、レンダー時にできるだけ多くを計算するようにします。

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

ただし、外部システムと同期するためにはエフェクトが*必要*です。

<LearnMore path="/learn/you-might-not-need-an-effect">

[**エフェクトは必要ないかもしれない**](/learn/you-might-not-need-an-effect)を読んで、不要なエフェクトを削除する方法を学びましょう。

</LearnMore>

## リアクティブなエフェクトのライフサイクル {/*lifecycle-of-reactive-effects*/}

エフェクトはコンポーネントとは異なるライフサイクルを持ちます。コンポーネントは、マウント、更新、アンマウントを行うことができます。エフェクトは 2 つのことしかできません。同期の開始と、同期の停止です。エフェクトが props や state に依存し、これらが時間と共に変化する場合、このサイクルは繰り返し発生します。

以下のエフェクトは props である `roomId` に依存しています。props は*リアクティブな値* (reactive value)、つまり再レンダー時に変わる可能性がある値です。`roomId` が変更されると、エフェクトが*再同期*（サーバに再接続）されていることに注目してください。

<Sandpack>

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

React は、エフェクトの依存配列が正しく指定されているかをチェックするためのリンタルールを提供しています。上記の例で `roomId` を依存値のリストに指定し忘れた場合、リンタがそのバグを自動的に見つけてくれます。

<LearnMore path="/learn/lifecycle-of-reactive-effects">

[**リアクティブなエフェクトのライフサイクル**](/learn/lifecycle-of-reactive-effects)を読んで、エフェクトのライフサイクルがコンポーネントのライフサイクルとどのように異なるかを学びましょう。

</LearnMore>

## イベントとエフェクトを切り離す {/*separating-events-from-effects*/}

<Wip>

このセクションでは、まだ安定版の React でリリースされていない**実験的な API** について説明しています。

</Wip>

イベントハンドラは同じインタラクションを再度実行した場合のみ再実行されます。エフェクトはイベントハンドラとは異なり、props や state 変数のようなそれが読み取る値が前回のレンダー時の値と異なる場合に再同期を行います。また、ある値には反応して再実行するが、他の値には反応しないエフェクトなど、両方の動作をミックスさせたい場合もあります。

エフェクト内のすべてのコードは*リアクティブ*です。それが読み取るリアクティブな値が再レンダーにより変更された場合、再度実行されます。例えば、このエフェクトは `roomId` と `theme` のいずれかが変更された場合にチャットに再接続します。

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

これはあまり良くありません。`roomId` が変更された場合にのみチャットに再接続したいのです。`theme` の切り替えでチャットの再接続が起きるべきではありません！ `theme` を読み取るコードをエフェクトから*エフェクトイベント (Effect Event)* に移動させましょう。

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

エフェクトイベント内のコードはリアクティブではないため、`theme` を変更してもエフェクトが再接続されることはありません。

<LearnMore path="/learn/separating-events-from-effects">

[**イベントとエフェクトを切り離す**](/learn/separating-events-from-effects)を読んで、ある値の変化がエフェクトの再トリガを引き起こさないようにする方法を学びましょう。

</LearnMore>

## エフェクトから依存値を取り除く {/*removing-effect-dependencies*/}

エフェクトを記述する際、リンタはエフェクトが読み取るすべてのリアクティブな値（props や state など）がエフェクトの依存値のリストに含まれているか確認します。これにより、エフェクトがコンポーネントの最新の props や state と同期された状態を保つことができます。不要な依存値があると、エフェクトが頻繁に実行され過ぎたり、無限ループが発生したりすることがあります。不要な依存値を取り除く方法はケースによって異なります。

たとえば、このエフェクトは入力フィールドを編集するたびに再作成される `options` オブジェクトに依存しています。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

チャットでメッセージを入力し始めるたびにチャットが再接続されることは望ましくありません。この問題を解決するために、`options` オブジェクトの作成をエフェクト内に移動し、エフェクトが `roomId` 文字列にのみ依存するようにします：

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
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
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

依存値のリストを編集して `options` を削除することから始めなかったことに注意してください。それは間違いです。代わりに、依存関係が*不要*になるよう、周囲のコードを変更したのです。依存値のリストは、あなたのエフェクトのコードが使用しているすべてのリアクティブな値の一覧だと考えてください。そのリストに何を置くかを意識して選ぶのではありません。リストはあなたのコードの説明にすぎません。依存配列を変更するには、コードの方を変更します。

<LearnMore path="/learn/removing-effect-dependencies">

[**エフェクトから依存値を取り除く**](/learn/removing-effect-dependencies)を読んで、エフェクトの再実行頻度を減らす方法を学びましょう。

</LearnMore>

## カスタムフックでロジックを再利用する {/*reusing-logic-with-custom-hooks*/}

React には `useState`、`useContext`、`useEffect` など複数の組み込みフックが存在します。しかし、データの取得やユーザのオンライン状態の監視、チャットルームへの接続など、より特化した目的のためのフックが欲しいこともあります。これらを行うためには、アプリケーションの要求に合わせて独自のフックを作成することが可能です。

以下の例では、`usePointerPosition` カスタムフックがカーソルの位置を追跡し、`useDelayedValue` カスタムフックが値をある一定のミリ秒だけ「遅らせて」返します。サンドボックスのプレビューエリア上でカーソルを動かすと、カーソルに追従する複数のドットによる軌跡が現れます。

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
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

```js useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

カスタムフックを作成し、それらを組み合わせ、データを受け渡し、コンポーネント間で再利用することができます。アプリが成長するにつれて、すでに書いたカスタムフックを再利用することで、手作業でエフェクトを書く回数が減っていきます。また、React コミュニティによってメンテナンスされている優れたカスタムフックも多数あります。

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

[**カスタムフックでロジックを再利用する**](/learn/reusing-logic-with-custom-hooks)を読んで、コンポーネント間でロジックを共有する方法について学びましょう。

</LearnMore>

## 次のステップ {/*whats-next*/}

[ref で値を参照する](/learn/referencing-values-with-refs)に進み、この章をページごとに読み進めてください！
