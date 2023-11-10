---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` は、外部ストアへのサブスクライブを可能にする React のフックです。

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

外部データストアから値を読み取るために、コンポーネントのトップレベルで useSyncExternalStore を呼び出します。

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

これは、ストアにあるデータのスナップショットを返します。引数として 2 つの関数を渡す必要があります：

1. `subscribe` 関数はストアへのサブスクライブを開始します。サブスクライブを解除する関数を返す必要があります。 
2. `getSnapshot` 関数は、ストアからデータのスナップショットを読み取る必要があります。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `subscribe`: ストアにサブスクライブを開始し、また callback 引数を受け取る関数。ストアが変更された際に渡された callback を呼び出す必要があります。これにより、コンポーネントが再レンダーされます。`subscribe` 関数は、サブスクリプションをクリーンアップする関数を返す必要があります。

* `getSnapshot`: コンポーネントが必要とするストアにあるデータのスナップショットを返す関数。ストアが変更されていない場合、`getSnapshot` への再呼び出しは同じ値を返す必要があります。ストアが変更されて返された値が（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で比較して）異なる場合、React はコンポーネントを再レンダーします。

* **省略可能** `getServerSnapshot`: ストアのデータの初期スナップショットを返す関数。これはサーバレンダリング中、およびクライアント上でのサーバレンダリングされたコンテンツのハイドレーション中にのみ使用されます。サーバスナップショットはクライアントとサーバ間で同一でなければならず、通常はサーバからクライアントに渡されるシリアライズされたものです。この引数を省略すると、サーバ上でのコンポーネントのレンダリングはエラーを発生させます。

#### 返り値 {/*returns*/}

レンダリングロジックで使用できるストアの現在のスナップショット。

#### 注意点 {/*caveats*/}

* `getSnapshot` によって返されるストアのスナップショットはイミュータブル（immutable; 書き換え不能）でなければなりません。背後で使っているストアがミュータブルなデータを持っている場合、データが変更された場合は新しいイミュータブルなスナップショットを返し、それ以外の場合はキャッシュされた最後のスナップショットを返すようにします。

* 再レンダー中に異なる `subscribe` 関数が渡された場合、React は新しく渡された `subscribe` 関数を使ってストアに再サブスクライブします。これを防ぐには、`subscribe` をコンポーネントの外で宣言します。

* [ノンブロッキング型のトランジション更新](/reference/react/useTransition)の最中にストアの書き換えが発生した場合、React はその更新をブロッキング型で行うようにフォールバックします。具体的には、React は DOM に更新を適用する前に `getSnapshot` を再度呼び出します。そこで最初の値とは異なる値が返された場合、React はトランジションの更新を最初からやり直しますが、再試行時にはブロッキング型の更新を行うことで、画面上の全コンポーネントがストアからの同一バージョンの値を反映していることを保証します。

* `useSyncExternalStore` から返される値に基づいてレンダーを*サスペンド*させることは推奨されていません。外部ストアで起きた変更は[ノンブロッキング型のトランジション更新](/reference/react/useTransition)としてマークすることができないため、直近の [`Suspense` フォールバック](/reference/react/Suspense)が起動してしまいます。既に画面上に表示されているコンテンツがローディングスピナで隠れてしまうため、通常は望ましくないユーザ体験につながります。

  例えば以下のようなコードは推奨されません。

  ```js
  const LazyProductDetailPage = lazy(() => import('./ProductDetailPage.js'));

  function ShoppingApp() {
    const selectedProductId = useSyncExternalStore(...);

    // ❌ Calling `use` with a Promise dependent on `selectedProductId`
    const data = use(fetchItem(selectedProductId))

    // ❌ Conditionally rendering a lazy component based on `selectedProductId`
    return selectedProductId != null ? <LazyProductDetailPage /> : <FeaturedProducts />;
  }
  ```

---

## 使用法 {/*usage*/}

### 外部ストアへのサブスクライブ {/*subscribing-to-an-external-store*/}

React コンポーネントのほとんどは、[props](/learn/passing-props-to-a-component)、[state](/reference/react/useState) および[コンテクスト](/reference/react/useContext)からのみデータを読み取ります。しかし、コンポーネントは時間と共に変化する React 外のストアからデータを読み取る必要がある場合があります。これには以下のようなものが含まれます：

* React の外部で状態を保持するサードパーティの状態管理ライブラリ。
* 可変の値を、その変更にサブスクライブするためのイベントともに公開するブラウザ API。

外部データストアから値を読み取るために、コンポーネントの最上位で `useSyncExternalStore` を呼び出します。

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

これはストア内のデータの<CodeStep step={3}>スナップショット</CodeStep>を返します。引数として 2 つの関数を渡す必要があります：

1. <CodeStep step={1}>`subscribe` 関数</CodeStep>は、ストアへのサブスクライブを行い、またサブスクライブを解除する関数を返します。
2. <CodeStep step={2}>`getSnapshot` 関数</CodeStep>は、ストアからデータのスナップショットを読み取ります。

React はこれらの関数を使ってコンポーネントをストアにサブスクライブされた状態に保ち、変更があるたびに再レンダーします。

例えば、以下のサンドボックスでは、`todosStore` は React の外部にデータを保存する外部ストアとして実装されています。`TodosApp` コンポーネントは、`useSyncExternalStore` フックを使ってその外部ストアに接続します。 

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js todoStore.js
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

可能であれば、React 組み込みの state 管理機能である [`useState`](/reference/react/useState) および [`useReducer`](/reference/react/useReducer) を代わりに使用することをお勧めします。`useSyncExternalStore` API は、既存の非 React コードと統合する必要がある場合に主に役立ちます。

</Note>

---

### ブラウザ API へのサブスクライブ {/*subscribing-to-a-browser-api*/}

`useSyncExternalStore` を追加するもう 1 つの理由は、時間とともに変化する、ブラウザが公開する値にサブスクライブしたい場合です。たとえば、コンポーネントがネットワーク接続がアクティブかどうかを表示したいとします。ブラウザは、この情報を [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) というプロパティを介して公開します。

この値は React の知らないところで変更される可能性があるので、`useSyncExternalStore` でそれを読み取るべきです。

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

`getSnapshot` 関数を実装するためには、ブラウザ API から現在の値を読み取ることが必要です：

```js
function getSnapshot() {
  return navigator.onLine;
}
```

次に、`subscribe` 関数を実装する必要があります。例えば、`navigator.onLine` が変化すると、ブラウザは `window` オブジェクト上で [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) および [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) というイベントを発火します。これら対応するイベントに `callback` 引数を登録し、それを解除する関数を返す必要があります：

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

これで React は、外部の `navigator.onLine` API から値を読み取る方法と、その変更にサブスクライブする方法を知ることができます。ネットワークからデバイスを切断すると、コンポーネントが反応して再レンダーされることに注目してください：

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### ロジックをカスタムフックに抽出する {/*extracting-the-logic-to-a-custom-hook*/}

通常、`useSyncExternalStore` を直接コンポーネント内に記述することはありません。代わりに、自分自身のカスタムフックから呼び出すことが一般的です。これにより、異なるコンポーネントから同じ外部ストアを使用できます。

例えば、このカスタム `useOnlineStatus` フックはネットワークがオンラインであるかどうかを追跡します：

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

これで、異なるコンポーネントが、基本的な実装を繰り返すことなく `useOnlineStatus` を呼び出せるようになりました：

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
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### サーバーレンダリングのサポートを追加する {/*adding-support-for-server-rendering*/}

React アプリが[サーバレンダリング](/reference/react-dom/server)を使用している場合、React コンポーネントは初期 HTML を生成するためにブラウザ環境外でも実行されます。これにより、外部ストアへの接続に関するいくつかの課題が生じます。

- ブラウザ専用の API に接続している場合、それはサーバ上では存在しないため動作しません。
- サードパーティのデータストアに接続している場合、サーバとクライアント間でそのデータを一致させる必要があります。

これらの問題を解決するために、`useSyncExternalStore` に `getServerSnapshot` 関数を第 3 引数として渡します：

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

`getServerSnapshot` 関数は `getSnapshot` と似ていますが、以下の 2 つの状況でのみ実行されます：

- サーバ上で、HTML を生成する際に実行される。
- クライアント上で、React がサーバ HTML をインタラクティブにするとき、つまり[ハイドレーション](/reference/react-dom/client/hydrateRoot)中に実行される。

これにより、アプリがインタラクティブになる前に使用される初期のスナップショット値を指定できます。サーバレンダリング中に意味のある初期値が存在しない場合は、この引数を省略して、[強制的にクライアントでレンダーする](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content)ようにします。

<Note>

初回のクライアントレンダリングでは、`getServerSnapshot` はサーバで返したものと必ず正確に同一のデータを返すようにしてください。例えば、`getServerSnapshot` がサーバ上で事前に準備されたストアコンテンツを返した場合、このコンテンツをクライアントに転送する必要があります。これを行う 1 つの方法は、サーバレンダリング中に `window.MY_STORE_DATA` のようなグローバル変数を設定する `<script>` タグを発行しておき、クライアントの `getServerSnapshot` でそのグローバル変数から読み込むことです。あなたが使う外部ストアにその方法が記載されているはずです。

</Note>

---

## トラブルシューティング {/*troubleshooting*/}

### "The result of `getSnapshot` should be cached" というエラーが出る {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

このエラーは、`getSnapshot` 関数が呼ばれるたびに新しいオブジェクトを返していることを意味します。例えば：

```js {2-5}
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  return {
    todos: myStore.todos
  };
}
```

`getSnapshot` の返り値が前回と異なる場合、React はコンポーネントを再レンダーします。このため、常に異なる値を返すと無限ループに入り、このエラーが発生します。

`getSnapshot` オブジェクトは、実際に何かが変更された場合にのみ、別のオブジェクトを返す必要があります。ストアにイミュータブルなデータが含まれている場合は、そのデータを直接返すことができます：

```js {2-3}
function getSnapshot() {
  // ✅ You can return immutable data
  return myStore.todos;
}
```

ストアデータがミュータブルな場合、`getSnapshot` 関数はそのイミュータブルなスナップショットを返す必要があります。つまり、新しいオブジェクトを作成する必要は**あります**が、毎回作成してはいけないということです。その代わりに、最後に計算されたスナップショットを保存しておき、ストア内のデータが変更されていない場合は前回と同じスナップショットを返すようにします。ミュータブルなデータが変更されたかどうかを判断する方法は、ミュータブルなストアによって異なります。

---

### `subscribe` が毎レンダーごとに呼び出される {/*my-subscribe-function-gets-called-after-every-re-render*/}

この `subscribe` 関数はコンポーネントの**内部**で定義されているため、再レンダーするたびに異なった値になります：

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Always a different function, so React will resubscribe on every re-render
  function subscribe() {
    // ...
  }

  // ...
}
```

React は、再レンダー間で異なる `subscribe` 関数を渡すと、ストアに再サブスクライブします。これがパフォーマンスの問題を引き起こし、再サブスクライブを避けたい場合は、`subscribe` 関数を外部に移動してください：

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
  // ...
}
```

あるいは、`subscribe` を [`useCallback`](/reference/react/useCallback) でラップすることで、引数が変更されたときのみ再サブスクライブすることができます：

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```
