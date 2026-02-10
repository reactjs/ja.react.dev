---
title: useEffectEvent
---

<Intro>

`useEffectEvent` は、イベントをエフェクトから分離できるようにする React フックです。

```js
const onEvent = useEffectEvent(callback)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

コンポーネントのトップレベルで `useEffectEvent` を呼び出し、エフェクトイベント (Effect Event) を作成します。

```js {4,6}
import { useEffectEvent, useEffect } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
}
```

エフェクトイベントはエフェクトのロジックの一部ですが、よりイベントハンドラに近いふるまいをします。常に最新のレンダー時の値（props や state など）が "見える" 一方で、エフェクトの再同期を起こさないため、エフェクトの依存配列には入れません。詳しくは[エフェクトからイベントを分離する](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects)を参照してください。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `callback`: エフェクトイベントのロジックを含む関数。この関数は任意の数の引数を受け取り、任意の値を返せます。返されたエフェクトイベント関数を呼び出すと、`callback` は呼び出し時点でレンダーにコミット済みの最新の値に常にアクセスします。

#### 返り値 {/*returns*/}

`useEffectEvent` は、`callback` と同じ型シグネチャのエフェクトイベント関数を返します。

この関数は `useEffect`、`useLayoutEffect`、`useInsertionEffect` の中、または同じコンポーネント内の他のエフェクトイベント内から呼び出せます。

#### 注意点 {/*caveats*/}

* `useEffectEvent` はフックであるため、**コンポーネントのトップレベル**やカスタムフック内でのみ呼び出すことができます。ループや条件文の中で呼び出すことはできません。これが必要な場合は、新しいコンポーネントを抽出し、その中にエフェクトイベントを移動させてください。
* エフェクトイベントは、エフェクトまたは他のエフェクトイベントの内部からのみ呼び出せます。レンダー中に呼び出したり、他のコンポーネントやフックへ渡したりしないでください。[`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) リンタがこの制約を強制します。
* エフェクトの依存配列に依存値を書かないで済ますための手段として `useEffectEvent` を使わないでください。これはバグを隠蔽し、コードを理解しにくくします。エフェクトから発火する、真にイベントとしてのロジックにのみ使用してください。
* エフェクトイベント関数にレンダー間の同一性はありません。意図的に、レンダーごとに変化します。

<DeepDive>

#### エフェクトイベントがレンダーごとに異なる理由 {/*why-are-effect-events-not-stable*/}

`useState` の `set` 関数や ref とは異なり、エフェクトイベント関数には安定した同一性がありません。意図的に、レンダーごとに変化します。

```js
// 🔴 Wrong: including Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]); // ESLint will warn about this
```

これは意図的な設計判断です。エフェクトイベントは、同じコンポーネント内のエフェクトからのみ呼び出されることを想定しています。ローカルでしか呼び出せず、他のコンポーネントに渡したり依存配列に含めたりできないため、同一の関数にすることには意味がなく、むしろバグを隠してしまいます。

毎回異なる関数であることは実行時チェックとしても機能します。あなたのコードが誤って関数の同一性に依存している場合、エフェクトがレンダーごとに再実行され、バグが表面化します。

この設計が示しているのは、エフェクトイベントとは概念的に特定のエフェクトに属するものであり、リアクティブ性を回避するための汎用 API ではないということです。

</DeepDive>

---

## 使用法 {/*usage*/}


### エフェクト内でイベントを使う {/*using-an-event-in-an-effect*/}

コンポーネントのトップレベルで `useEffectEvent` を呼び出し、*エフェクトイベント*を作成します。


```js [[1, 1, "onConnected"]]
const onConnected = useEffectEvent(() => {
  if (!muted) {
    showNotification('Connected!');
  }
});
```

`useEffectEvent` は `event callback` を受け取り、<CodeStep step={1}>エフェクトイベント</CodeStep>を返します。このエフェクトイベントは、再接続を発生させずにエフェクト内部から呼び出せる関数です。

```js [[1, 3, "onConnected"]]
useEffect(() => {
  const connection = createConnection(roomId);
  connection.on('connected', onConnected);
  connection.connect();
  return () => {
    connection.disconnect();
  }
}, [roomId]);
```

`onConnected` は<CodeStep step={1}>エフェクトイベント</CodeStep>なので、`muted` と `onConnect` はエフェクトの依存値に含めません。

<Pitfall>

##### エフェクトイベントを依存値を無視するために使わない {/*pitfall-skip-dependencies*/}

`useEffectEvent` を使って「不要そうな」依存値の列挙を避けたくなるかもしれません。しかし、これはバグを隠し、コードを理解しにくくします。

```js
// 🔴 Wrong: Using Effect Events to hide dependencies
const logVisit = useEffectEvent(() => {
  log(pageUrl);
});

useEffect(() => {
  logVisit()
}, []); // Missing pageUrl means you miss logs
```

ある値によってエフェクトを再実行すべきなら、その値は依存値として残してください。エフェクトイベントは、エフェクトを本当に再トリガすべきでないロジックにのみ使ってください。

詳しくは[エフェクトからイベントを分離する](/learn/separating-events-from-effects)を参照してください。

</Pitfall>

---

### タイマーで最新の値を使う {/*using-a-timer-with-latest-values*/}

エフェクト内で `setInterval` や `setTimeout` を使う際に、レンダーから最新の値を読み取りたいがタイマーの再起動は避けたい場合があります。

以下のカウンタは、1 秒ごとに現在の `increment` の値だけ `count` をインクリメントします。`onTick` エフェクトイベントは、interval をリスタートさせることなく、最新の `count` と `increment` を読み取ります。

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(count + increment);
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

タイマーを動かしたまま `increment` の値を変更してみてください。カウンタはすぐに新しい増分値を参照しますが、タイマーは再起動せず滑らかに動き続けます。

---

### 最新の値でイベントリスナを使う {/*using-an-event-listener-with-latest-values*/}

エフェクト内でイベントリスナをセットアップする際は、しばしばコールバック内でレンダーからの最新の値を読み取る必要があります。`useEffectEvent` がなければ、それらの値を依存値に含める必要があり、値が変わるたびにリスナが解除・再登録されてしまいます。

以下の例では、"Can move" にチェックがあるときだけカーソルを追いかけるドットを表示します。`onMove` エフェクトイベントは、エフェクトを再実行せずに常に最新の `canMove` 値を読み取ります。

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

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
        <input
          type="checkbox"
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

チェックボックスを切り替えてカーソルを動かしてみてください。ドットはチェック状態に即座に反応しますが、イベントリスナはコンポーネントのマウント時に一度だけ設定されます。

---

### 外部システムへの過度な再接続を避ける {/*showing-a-notification-without-reconnecting*/}

`useEffectEvent` のよくある用途は、エフェクトへの反応として何かを実行したいが、その「何か」がリアクティブにしたくない値に依存している場合です。

以下の例では、チャットコンポーネントがルームに接続し、接続時に通知を表示します。ユーザはチェックボックスで通知をミュートできます。ただし、ユーザがこの設定を切り替えるたびにチャットルームへ再接続したいわけではありませんね。

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
import { useState, useEffect, useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

function ChatRoom({ roomId, muted }) {
  const onConnected = useEffectEvent((roomId) => {
    console.log('✅ Connected to ' + roomId + ' (muted: ' + muted + ')');
    if (!muted) {
      showNotification('Connected to ' + roomId);
    }
  });

  useEffect(() => {
    const connection = createConnection(roomId);
    console.log('⏳ Connecting to ' + roomId + '...');
    connection.on('connected', () => {
      onConnected(roomId);
    });
    connection.connect();
    return () => {
      console.log('❌ Disconnected from ' + roomId);
      connection.disconnect();
    }
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [muted, setMuted] = useState(false);
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
          checked={muted}
          onChange={e => setMuted(e.target.checked)}
        />
        Mute notifications
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        muted={muted}
      />
    </>
  );
}
```

```js src/chat.js
const serverUrl = 'https://localhost:1234';

export function createConnection(roomId) {
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

```js src/notifications.js
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

ルームを切り替えてみてください。チャットの再接続が起こり、通知が表示されますね。次に通知をミュートしてみてください。`muted` はエフェクトではなくエフェクトイベント内で読み取られるため、チャット接続は維持されます。

---

### カスタムフックでエフェクトイベントを使う {/*using-effect-events-in-custom-hooks*/}

独自のカスタムフック内でも `useEffectEvent` を使えます。これにより、一部の値を非リアクティブに保ちながらエフェクトをカプセル化した、再利用可能なフックを作成できます。

<Sandpack>

```js
import { useState, useEffect, useEffectEvent } from 'react';

function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Counter({ incrementBy }) {
  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount(c => c + incrementBy);
  }, 1000);

  return (
    <div>
      <h2>Count: {count}</h2>
      <p>Incrementing by {incrementBy} every second</p>
    </div>
  );
}

export default function App() {
  const [incrementBy, setIncrementBy] = useState(1);

  return (
    <>
      <label>
        Increment by:{' '}
        <select
          value={incrementBy}
          onChange={(e) => setIncrementBy(Number(e.target.value))}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </label>
      <hr />
      <Counter incrementBy={incrementBy} />
    </>
  );
}
```

```css
label { display: block; margin-bottom: 8px; }
```

</Sandpack>

上記の例では、`useInterval` は interval をセットアップするためのカスタムフックです。渡された `callback` はエフェクトイベントでラップされているため、レンダーごとに新しい `callback` が渡されても interval のリセットは起きません。

---

## トラブルシューティング {/*troubleshooting*/}

### "A function wrapped in useEffectEvent can't be called during rendering" というエラーが出る {/*cant-call-during-rendering*/}

このエラーは、コンポーネントのレンダーフェーズ中にエフェクトイベント関数を呼び出していることを意味します。エフェクトイベントは、エフェクトまたは他のエフェクトイベントの内部からのみ呼び出せます。

```js
function MyComponent({ data }) {
  const onLog = useEffectEvent(() => {
    console.log(data);
  });

  // 🔴 Wrong: calling during render
  onLog();

  // ✅ Correct: call from an Effect
  useEffect(() => {
    onLog();
  }, []);

  return <div>{data}</div>;
}
```

レンダー中にロジックを実行する必要がある場合は、`useEffectEvent` でラップしないでください。ロジックを直接呼び出すか、エフェクト内へ移動してください。

---

### "Functions returned from useEffectEvent must not be included in the dependency array" というリントエラーが出る {/*effect-event-in-deps*/}

"Functions returned from `useEffectEvent` must not be included in the dependency array" のような警告が出たら、依存値からエフェクトイベントを取り除いてください。

```js
const onSomething = useEffectEvent(() => {
  // ...
});

// 🔴 Wrong: Effect Event in dependencies
useEffect(() => {
  onSomething();
}, [onSomething]);

// ✅ Correct: no Effect Event in dependencies
useEffect(() => {
  onSomething();
}, []);
```

エフェクトイベントは、依存値として列挙せずにエフェクトから呼び出すよう設計されています。関数の同一性は[意図的に毎回異なる](#why-are-effect-events-not-stable)ため、リンタがこれを強制します。依存値に含めると、エフェクトがレンダーごとに再実行されてしまいます。

---

### "... is a function created with useEffectEvent, and can only be called from Effects" というリントエラーが出る {/*effect-event-called-outside-effect*/}

"... is a function created with React Hook `useEffectEvent`, and can only be called from Effects and Effect Events" のような警告が出る場合、関数を呼び出す場所が誤っています。

```js
const onSomething = useEffectEvent(() => {
  console.log(value);
});

// 🔴 Wrong: calling from event handler
function handleClick() {
  onSomething();
}

// 🔴 Wrong: passing to child component
return <Child onSomething={onSomething} />;

// ✅ Correct: calling from Effect
useEffect(() => {
  onSomething();
}, []);
```

エフェクトイベントは、それを定義したコンポーネント内のローカルなエフェクトで使うために設計されています。イベントハンドラ用のコールバックや子コンポーネントへ渡すコールバックが必要な場合は、通常の関数または `useCallback` を使ってください。
