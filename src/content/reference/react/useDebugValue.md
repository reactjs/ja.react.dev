---
title: useDebugValue
---

<Intro>

`useDebugValue` は React フックであり、[React DevTools](/learn/react-developer-tools) でカスタムフックにラベルを追加できるようにします。

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

[カスタムフック](/learn/reusing-logic-with-custom-hooks)のトップレベルで `useDebugValue` を呼び出して、読みやすいデバッグ値を表示します。

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `value`: React DevTools に表示したい値。任意の型が使えます。
* **省略可能** `format`: フォーマッタ関数。コンポーネントがインスペクト (inspect, 調査) されると、React DevTools は `value` を引数としてフォーマッタ関数を呼び出し、返されたフォーマット済みの値（任意の型が使えます）を表示します。フォーマッタ関数を指定しない場合、元の `value` 自体が表示されます。

#### 返り値 {/*returns*/}

`useDebugValue` は何も返しません。

## 使用法 {/*usage*/}

### カスタムフックにラベルを追加する {/*adding-a-label-to-a-custom-hook*/}

[カスタムフック](/learn/reusing-logic-with-custom-hooks)のトップレベルで `useDebugValue` を呼び出し、[React DevTools](/learn/react-developer-tools) に対して読みやすい<CodeStep step={1}>デバッグ値</CodeStep>を表示します。

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

これにより、`useOnlineStatus` を呼び出すコンポーネントをインスペクトすると `OnlineStatus: "Online"` のようなラベルが付きます。

![React DevTools がデバッグ値を表示するスクリーンショット](/images/docs/react-devtools-usedebugvalue.png)

`useDebugValue` の呼び出しがない場合、元のデータ（この例では `true`）のみが表示されます。

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

すべてのカスタムフックにデバッグ値を追加しないでください。デバッグ値が最も有用なのは、共有ライブラリの一部であり、内部のデータ構造が複雑で調査が難しいカスタムフックです。

</Note>

---

### デバッグ値のフォーマットを遅延させる {/*deferring-formatting-of-a-debug-value*/}

`useDebugValue` の第 2 引数としてフォーマッタ関数も渡すことができます：

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

あなたのフォーマッタ関数は、<CodeStep step={1}>デバッグ値</CodeStep>をパラメータとして受け取り、<CodeStep step={2}>フォーマットされた表示値</CodeStep>を返す必要があります。コンポーネントがインスペクトされると、React DevTools はこの関数を呼び出し、その結果を表示します。

これにより、コンポーネントが実際にインスペクトされない限り、コストがかかる可能性があるフォーマットロジックを実行することを回避できます。例えば、`date` が Date 値の場合、レンダーの度に `toDateString()` を呼び出すことを回避できます。