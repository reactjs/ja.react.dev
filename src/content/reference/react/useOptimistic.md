---
title: useOptimistic
canary: true
---

<Canary>

`useOptimistic` フックは、現在 React の Canary および experimental チャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

<Intro>

`useOptimistic` は、UI を楽観的に更新するための React フックです。

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

`useOptimistic` は、何らかの非同期アクションが進行中の間だけ、異なる state を表示するための React フックです。ある state を引数として受け取ってそのコピーを返しますが、ネットワークリクエストなどの非同期アクションが実行中の場合に異なる値を返すことができます。現在の state とアクションへの入力を受け取り、アクション実行中に使用される楽観的 state を返すような関数を渡します。

このような state が「楽観的」state と呼ばれるのは、実際にはアクションの完了には時間がかかるにも関わらず、そのアクションの実行結果をユーザに即座に提示するために通常使用されるものだからです。

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // merge and return new state
      // with optimistic value
    }
  );
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `state`: 初期状態や、実行中のアクションが存在しない場合に返される値。
* `updateFn(currentState, optimisticValue)`: 現在の state と `addOptimistic` に渡された楽観的な値を受け取り、結果としての楽観的な state を返す関数。純関数でなければなりません。`updateFn` は `currentState` と `optimisticValue` の 2 つの引数を受け取ります。返り値は `currentState` に `optimisticValue` の値を反映させたものとなります。


#### 返り値 {/*returns*/}

* `optimisticState`: 結果としての楽観的 state。実行中のアクションがない場合は `state` と等しくなり、何らかのアクションが実行中の場合は `updateFn` が返す値と等しくなります。
* `addOptimistic`: 楽観的な更新を行う際に呼び出すためのディスパッチ関数。任意の型の引数 `optimisticValue` を 1 つだけ受け取り、それにより `state` と `optimisticValue` を引数にした `updateFn` が呼び出されます。

---

## 使用法 {/*usage*/}

### フォームの楽観的な更新 {/*optimistically-updating-with-forms*/}

`useOptimistic` フックは、ネットワークリクエストのようなバックグラウンド作業が完了する前に、ユーザインターフェースを楽観的に更新する方法を提供します。フォームにおいては、この技術はアプリをよりレスポンシブに感じさせるために役立ちます。ユーザがフォームを送信した際に、サーバのレスポンスを待たずに、予想される結果を用いてインターフェースを即座に更新しておきます。

例えば、ユーザがフォームにメッセージを入力して送信ボタンを押すと、`useOptimistic` フックにより、メッセージが実際にサーバに送信される前であっても、リストに "Sending..." というラベル付きでメッセージを即座に表示できるようになります。この「楽観的」アプローチにより、アプリの印象が高速でレスポンシブになります。その後フォームはバックグラウンドでメッセージの実際の送信を試みます。サーバにメッセージが到着したことを確認すると、"Sending..." ラベルが取り除かれます。

<Sandpack>


```js App.js
import { useOptimistic, useState, useRef } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessage }) {
  const formRef = useRef();
  async function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    await sendMessage(formData);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true
      }
    ]
  );

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 }
  ]);
  async function sendMessage(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }
  return <Thread messages={messages} sendMessage={sendMessage} />;
}
```

```js actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "18.3.0-canary-6db7f4209-20231021",
    "react-dom": "18.3.0-canary-6db7f4209-20231021",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js",
  "devDependencies": {}
}
```

</Sandpack>
