---
title: useEffectEvent
---

<Intro>

`useEffectEvent` は、エフェクトから非リアクティブなロジックを、[エフェクトイベント (Effect Event)](/learn/separating-events-from-effects#declaring-an-effect-event) と呼ばれる再利用可能な関数へと抽出できるようにする React フックです。

```js
const onSomething = useEffectEvent(callback)
```

</Intro>

<InlineToc />

## リファレンス {/*reference*/}

### `useEffectEvent(callback)` {/*useeffectevent*/}

コンポーネントのトップレベルで `useEffectEvent` を呼び出し、エフェクトイベントを宣言します。エフェクトイベントは、`useEffect` などのエフェクト内から呼び出すことができる関数です。

```js {4-6,11}
import { useEffectEvent, useEffect } from 'react';

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

  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

- `callback`: エフェクトイベントのロジックを含む関数。`useEffectEvent` でエフェクトイベントを定義すると、`callback` は常に、呼び出された瞬間の props や state の最新の値にアクセスします。これにより、古くなったクロージャに関する問題を回避できます。

#### 返り値 {/*returns*/}

エフェクトイベント関数を返します。この関数は `useEffect`、`useLayoutEffect`、あるいは `useInsertionEffect` 内で呼び出すことができます。

#### 注意点 {/*caveats*/}

- **エフェクト内でのみ呼び出す**：エフェクトイベントはエフェクト内からのみ呼び出すべきです。それを使用するエフェクトの直前で定義するようにしてください。他のコンポーネントやフックに渡さないでください。[`eslint-plugin-react-hooks`](/reference/eslint-plugin-react-hooks) リンタ（バージョン 6.1.1 以降）はこの制約を強制することで、誤った使い方でのエフェクトイベントの呼び出しを防止します。
- **依存配列を避けるためのものではない**：エフェクトの依存配列で依存値を指定すること自体を避けるために `useEffectEvent` を使用してはいけません。バグが隠蔽され、コードが理解しにくくなります。明示的に依存値を書くか、必要に応じて ref を使用して以前の値と比較するようにしてください。
- **非リアクティブなロジックだけに使う**：`useEffectEvent` は、値の変化に依存しないロジックを抽出する目的にのみ使用してください。

___

## 使用法 {/*usage*/}

### 最新の props と state を読み取る {/*reading-the-latest-props-and-state*/}

通常、エフェクト内でリアクティブな値にアクセスする場合は、それを依存配列に含める必要があります。これにより、その値が変化するたびにエフェクトが再実行されます。通常はこれが望ましい動作です。

しかし場合によっては、これらの値が変化してもエフェクトを再実行させることなく、エフェクト内で最新の props や state を読み取りたいことがあります。

エフェクト内で[最新の props や state を読み取る](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)際に、それらの値をリアクティブにしないようにするには、エフェクトイベント内に含めます。

```js {7-9,12}
import { useEffect, useContext, useEffectEvent } from 'react';

function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onNavigate = useEffectEvent((visitedUrl) => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onNavigate(url);
  }, [url]);

  // ...
}
```

この例では、`url` が変化したあとの再レンダーではエフェクトが再実行されるべきですが（新しいページの訪問を記録するため）、`numberOfItems` が変化した場合には再実行される**べきではありません**。ログ記録のロジックをエフェクトイベントでラップすることで、`numberOfItems` はリアクティブではなくなります。エフェクトをトリガすることなく、常に最新の値が読み取られます。

`url` のようなリアクティブな値は、エフェクトイベントに引数として渡すことで、それらをリアクティブに保ちながら、イベント内で最新の非リアクティブな値にもアクセスすることができます。

