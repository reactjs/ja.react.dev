---
title: 'エフェクトから依存値を取り除く'
---

<Intro>

エフェクトを記述する際、リンタはエフェクトが読み取るすべてのリアクティブな値（props や state など）がエフェクトの依存値のリストに含まれているか確認します。これにより、エフェクトがコンポーネントの最新の props や state と同期された状態を保つことができます。不要な依存値があると、エフェクトが頻繁に実行され過ぎたり、無限ループが発生したりすることがあります。このガイドでは、エフェクトから必要のない依存値を見つけ、取り除く方法を説明します。

</Intro>

<YouWillLearn>

- エフェクトの依存値に伴う無限ループを修正する方法
- 依存値を削除したい場合に行うこと
- エフェクト内で「反応」させずに値を読み取る方法
- オブジェクト型や関数型の依存値を避ける理由とその方法
- 依存配列のリンタを抑制する危険性と、代わりに行うべきこと

</YouWillLearn>

## 依存配列はコードに合わせるべき {/*dependencies-should-match-the-code*/}

エフェクトを記述する際は、それに何をさせたいのであれ、[開始方法および停止方法](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)を指定することになります。

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

ここでエフェクトの依存配列を空 (`[]`) にした場合、リンタは正しい依存配列を提案します。

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
  }, []); // <-- Fix the mistake here!
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

リンタの指示に従って、依存値を記入しましょう。

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

[エフェクトはリアクティブな値に「反応」します](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。`roomId` はリアクティブな値である（なぜなら再レンダー時に変更される可能性がある）ため、リンタはそれを依存値として指定していることを確認します。`roomId` として異なる値が与えられた場合、React はエフェクトを再同期します。これにより、チャットが選択中のルームへの接続を維持し、ドロップダウンに「反応」することが保証されます。

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

### 依存値を削除したければ依存値でないことを示す {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

エフェクトの依存配列は自分で「選ぶ」たぐいのものではないことに注意してください。エフェクトのコードで使用されるすべての<CodeStep step={2}>リアクティブな値</CodeStep>は、依存値のリスト内で宣言されなければなりません。依存配列は、その周囲にあるコードによって決定されます。

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // This is a reactive value
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads that reactive value
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ So you must specify that reactive value as a dependency of your Effect
  // ...
}
```

[リアクティブな値](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive)には props や、コンポーネント内に直接宣言されたすべての変数や関数が含まれます。`roomId` はリアクティブな値であるため、依存値のリストから取り除くことはできません。リンタはそれを許可しません。

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'roomId'
  // ...
}
```

そして、リンタは正しいのです！ `roomId` は時間とともに変化する可能性があるので、コードにバグが発生する可能性があります。

**依存値を削除するには、それが依存値である*必要がない*ことをリンタに「証明」します**。例えば、`roomId` をコンポーネントの外に移動すれば、リアクティブではなく再レンダー時に変更されない、ということを証明できます。

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

これでもう `roomId` はリアクティブな値ではなくなった（再レンダー時に変更されない）ため、依存値にする必要はなくなります。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
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

これで、[依存配列を空 (`[]`) にする](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)ことができるようになります。エフェクトはリアクティブな値にもはや*依存していない*ので、コンポーネントの props や state が変更されたときに再実行する必要は*確かにない*のです。

### 依存配列を変更したければコードを変更する {/*to-change-the-dependencies-change-the-code*/}

ワークフローにパターンがあることに気付いたかもしれません。

1. まず、エフェクトのコードやリアクティブな値の宣言部分を**変更**してみる。
2. 次にリンタに指摘されたとおり、**変更したコードに合わせるように**依存配列を調整する。
3. その依存配列に満足できない場合は、**最初のステップに戻る**（コードを再度変更する）。

最後の部分が重要です。**依存配列を変更したい場合は、まず周囲のコードを変更してください**。依存配列は、[エフェクトのコードで使用されるすべてのリアクティブな値のリスト](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)と考えることができます。あなたがリストに何を載せるか*選ぶ*のではありません。リストはあなたのコードの*説明書き*に過ぎません。依存値のリストを変更したくなったら、コードの方を変更してください。

これは方程式を解くような感覚かもしれません。目標（例えば、ある依存値を削除すること）から始めて、その目標に合ったコードを「見つける」必要があります。方程式を解くことが楽しいと思わない人もいるでしょうし、エフェクトを書く場合でも同じでしょう！ 幸い、以下に試すことができる一般的なレシピのリストがあります。

<Pitfall>

既存のコードベースがある場合、次のようにリンタを黙らせているエフェクトがあるかもしれません。

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**依存配列がコードと一致しない場合、バグが発生するリスクが非常に高くなります**。リンタを止めることで、エフェクトが依存する値について React に「嘘」をついていることになります。

代わりに、以下にある手法を使用してください。

</Pitfall>

<DeepDive>

#### 依存値のリンタを止めてしまうことがなぜ危険なのか？ {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

このリンタを止めてしまうと、見つけたり修正したりするのが難しい、非常に分かりづらいバグの原因になります。一例を示しましょう。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
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

たとえば、エフェクトを「マウント時にのみ」実行したいとします。あなたは[空の (`[]`) 依存配列](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means)を使えばよいとどこかで読んだので、リンタを無視して強制的に `[]` を依存配列として指定することにしました。

このカウンタは毎秒、2 つのボタンにより指定される数だけインクリメントするはずです。しかし、このエフェクトは何にも依存していないと React に「嘘」をついたため、React は初期レンダー時の `onTick` 関数を永遠に使用し続けます。[そのレンダー中](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)には `count` は `0` で、`increment` は `1` でした。従って、そのレンダー時に作られた `onTick` は毎秒 `setCount(0 + 1)` を呼び出し、常に `1` を表示することになります。このようなバグは、複数のコンポーネントにまたがっている場合、修正がより困難になります。

リンタを無視するよりも良い解決策は常に存在します！ このコードを修正するには、`onTick` を依存値のリストに追加する必要があります。（インターバルが一度だけ設定されるように、[`onTick` をエフェクトイベント (Effect Event) にします。](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)）

**依存配列に関するリントエラーはコンパイルエラーとして扱うことをお勧めします。リンタを抑制しなければ、このようなバグには決して遭遇せずに済みます**。このページの残りの部分で、このようなケースや他のケースで代わりに行える対応策を説明します。

</DeepDive>

## 不要な依存値を取り除く {/*removing-unnecessary-dependencies*/}

エフェクトの依存配列をコードに合わせて調整するたびに、そのリストの中身を見るようにしてください。依存値のどれかが変更されたときにエフェクトを再実行することは、理にかなっていますか？ 時々、答えは「いいえ」でしょう。

* エフェクトの*異なる部分*を異なる条件で再実行したい。
* 依存値の*最新の値*を読み取りたいだけで、その変化に「反応」したいわけではない。
* 依存値の型がオブジェクトや関数であるために、*意図せずに*頻繁に変更される。

適切な解決策を見つけるためには、あなたのエフェクトに関するいくつかの質問に答える必要があります。それらを見ていきましょう。

### コードをイベントハンドラに移動すべきでは？ {/*should-this-code-move-to-an-event-handler*/}

まず考える必要があるのは、そのコードがそもそもエフェクトであるべきかどうかです。

フォームを想像してください。送信時に、`submitted` という state 変数を `true` に設定します。POST リクエストを送信してから通知を表示する必要があります。`submitted` が `true` になることに「反応」するエフェクトの中に、以下のようなロジックを入れました。

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

後で、現在のテーマに応じて通知メッセージにスタイルを適用するために、現在のテーマを読み取ることにしました。`theme` はコンポーネント本体で宣言されているためリアクティブな値であり、依存値として追加することになります。

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Avoid: Event-specific logic inside an Effect
      post('/api/register');
      showNotification('Successfully registered!', theme);
    }
  }, [submitted, theme]); // ✅ All dependencies declared

  function handleSubmit() {
    setSubmitted(true);
  }  

  // ...
}
```

しかしこれによりバグを発生させてしまいました。まずフォームを送信してから、ダークテーマとライトテーマを切り替えるところを想像してください。`theme` が変更されることによりエフェクトが再実行されるため、同じ通知が再度表示されます！

**ここでの問題は、そもそもこれがエフェクトであるべきではなかったということです**。この POST リクエストを送信して通知を表示することは、*フォームの送信*という特定のユーザ操作に対応しています。特定のユーザ操作に対応してコードを実行する場合は、そのロジックを対応するイベントハンドラに直接配置してください。

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Good: Event-specific logic is called from event handlers
    post('/api/register');
    showNotification('Successfully registered!', theme);
  }  

  // ...
}
```

コードがイベントハンドラにあるため、リアクティブではなくなります。つまり、ユーザがフォームを送信したときにのみ実行されます。詳しくは、[イベントハンドラとエフェクトの選択](/learn/separating-events-from-effects#reactive-values-and-reactive-logic)や[不要なエフェクトの削除](/learn/you-might-not-need-an-effect)を参照してください。

### エフェクトが複数の互いに無関係なことを行っていないか？ {/*is-your-effect-doing-several-unrelated-things*/}

次に自分に問うべき質問は、エフェクトが複数の関連性のないことを行っていないかどうかです。

例えば、ユーザに都市とエリアを選択させる配送フォームを作成しているとします。選択された `country` に応じてサーバから `cities` のリストを取得し、ドロップダウンで表示します。

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

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
  }, [country]); // ✅ All dependencies declared

  // ...
```

これは、[エフェクトでデータを取得する](/learn/you-might-not-need-an-effect#fetching-data)良い例です。`country` プロパティに応じて、`cities` という state をネットワークと同期させています。データ取得は `ShippingForm` が表示されるとすぐに、かつ（どんなユーザ操作が原因であれ）`country` が変更されるたびに行う必要があるので、イベントハンドラで行うことはできません。

さて、現在選択されている `city` に対応する `areas` を取得するための、2 つ目のセレクトボックスを追加しようとしているとしましょう。同じエフェクトの中に、エリアの一覧を取得するための 2 つ目の `fetch` コールを追加するところから取りかかってしまうかもしれません。

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Avoid: A single Effect synchronizes two independent processes
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ All dependencies declared

  // ...
```

しかし、エフェクトが `city` という state 変数も使用するようになったため、依存値のリストに `city` を追加する必要がありました。それが問題を引き起こします。ユーザが別の都市を選択するとエフェクトが再実行され、`fetchCities(country)` が呼び出されます。その結果、都市のリストを何度も不必要に取得することになります。

**このコードの問題は、2 つの互いに関連性のないことに関して同期を行っていることです**。

1. props である `country` に基づいて、`cities` state をネットワークと同期させたい。
1. state である `city` に基づいて、`areas` state をネットワークと同期させたい。

ロジックを 2 つのエフェクトに分割して、それぞれが同期する必要がある値にのみ反応するようにします。

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
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
  }, [country]); // ✅ All dependencies declared

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
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
  }, [city]); // ✅ All dependencies declared

  // ...
```

これで、1 番目のエフェクトは `country` が変更された場合にのみ再実行され、2 番目のエフェクトは `city` が変更された場合にのみ再実行されます。目的別に分けたことで、2 つの異なるものが、2 つの別々のエフェクトによって同期されるようになりました。2 つのエフェクトが 2 つの別の依存配列を有しているので、互いを意図せずにトリガしてしまうことはありません。

最終的なコードは元のコードよりも長くなりますが、これらのエフェクトを分割することは正当です。[各エフェクトは独立した同期プロセスを表すべきです](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process)。この例では、一方のエフェクトを削除しても、もう一方のエフェクトのロジックが壊れることはありません。つまりそれらは*異なるものを同期している*ということであり、分割することは良いことです。コードの重複が気になる場合は、[カスタムフックに繰り返しのロジックを抽出](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)することで改善できます。

### state の読み取りは次の state を計算するためか？ {/*are-you-reading-some-state-to-calculate-the-next-state*/}

以下のエフェクトは、新しいメッセージが届くたびに、新しい配列を作って `messages` という state にセットしています。

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

既存のすべてのメッセージから始まる[新たな配列を作成する](/learn/updating-arrays-in-state)部分で `messages` 変数を使っており、新しいメッセージを最後に追加しています。しかし、`messages` はエフェクトによって読み取られるリアクティブな値であるため、依存値でなければなりません。

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ All dependencies declared
  // ...
```

そして `messages` を依存値にすることで問題が発生してしまいます。

メッセージを受信するたびに、`setMessages()` は受信したメッセージを含む新しい `messages` 配列でコンポーネントを再レンダーさせます。しかしこのエフェクトは `messages` に依存するようになったため、これによってエフェクトの再同期も発生します。そのため新しいメッセージが届くたびにチャットが再接続されます。これはユーザにとって望ましくありません！

問題を解決するには、エフェクト内で `messages` を読み取らないようにします。代わりに、`setMessages` に[更新用関数](/reference/react/useState#updating-state-based-on-the-previous-state)を渡します。

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

**エフェクトが `messages` 変数を一切読み取らなくなっていることに注目してください**。`msgs => [...msgs, receivedMessage]` のような更新用関数を渡すだけで構いません。React は[更新用関数をキューに入れ](/learn/queueing-a-series-of-state-updates)、次のレンダー時に `msgs` 引数に値を渡します。ですのでエフェクト自体はもう `messages` に依存する必要がなくなっています。この修正により、チャットメッセージを受信してもチャットが再接続されることはなくなります。

### 変更に「反応」せず値を読み出したいだけか？ {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

<Wip>

このセクションでは、まだ安定版の React でリリースされていない**実験的な API** を説明しています。

</Wip>

`isMuted` が `true` でない場合に限り、ユーザが新しいメッセージを受信したときに音を再生したいとします。

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

エフェクトが `isMuted` をコード内で使用するようになったので、依存配列に追加する必要があります。

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ All dependencies declared
  // ...
```

問題は、（ユーザが "Muted" トグルボタンを押すなどで）`isMuted` が変更されるたびに、エフェクトが再同期され、チャットに再接続されることです。これは望ましいユーザ体験ではありません！（この例では、単にリンタを無効にしてもうまくいきません。そうすると `isMuted` が古い値のまま「固定」されてしまいます。）

この問題を解決するためには、リアクティブではないロジックをエフェクトの外部に取り出す必要があります。`isMuted` の変更に対してこのエフェクトを「反応」させたくありません。そこで[リアクティブではないロジックを、エフェクトイベントに移動します](/learn/separating-events-from-effects#declaring-an-effect-event)。

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

エフェクトイベントを使うことで、エフェクトをリアクティブな部分（`roomId` のようなリアクティブな値とその変更に「反応」する部分）と、リアクティブではない部分（`onMessage` が `isMuted` を読むような、最新の値だけを読みとる部分）に分割できます。**`isMuted` はエフェクトイベント内で読みとられるようになったので、エフェクトの依存値である必要がなくなります**。その結果、「ミュート」設定をオン・オフしてもチャットが再接続されなくなり、一件落着となります！

#### props から来るイベントハンドラをラップ {/*wrapping-an-event-handler-from-the-props*/}

似た問題は、コンポーネントがイベントハンドラを props として受け取る場合にも発生することがあります。

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ All dependencies declared
  // ...
```

ここで親コンポーネントが毎回のレンダーで*異なる* `onReceiveMessage` 関数を渡してくる場合を考えましょう。

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage` は依存値なので、親の再レンダー後に毎回エフェクトが再同期されることになります。これにより毎回チャットが再接続されてしまいます。これを解消するために、エフェクトイベントでこの関数の呼び出しをラップします。

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

エフェクトイベントはリアクティブではないため、依存値として指定する必要がなくなります。結果的に、親コンポーネントが毎回の再レンダー時に異なる関数を渡してきた場合でも、チャットが再接続されることはなくなります。

#### リアクティブなコードと非リアクティブなコードの分離 {/*separating-reactive-and-non-reactive-code*/}

この例では、`roomId` が変更されるたびに訪問をログに記録したいとします。ログには現在の `notificationCount` の値を含めたいものの、`notificationCount` の変更によってログの記録を発生させたくはありません。

今回も解決策は、非リアクティブなコードをエフェクトイベントに分離することです。

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

`roomId` に対してロジックをリアクティブにしたいので、エフェクト内で `roomId` を読み取るようにします。一方で `notificationCount` の変更によって余分な訪問ログを記録したくないので、`notificationCount` の値はエフェクトイベント内で読み取ります。[エフェクトイベントを使用してエフェクトから最新の props と state を読む方法について詳しく学ぶ。](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### リアクティブな値が意図せず変更されていないか？ {/*does-some-reactive-value-change-unintentionally*/}

場合によっては、特定の値に対してエフェクトが「リアクティブ」で*あってはほしい*が、ユーザ視点からの実質的な変化がないのに値が頻繁に変わりすぎてしまう、ということがあります。例えば、コンポーネントの本体で `options` オブジェクトを作成し、そのオブジェクトをエフェクト内で読み取っているとしましょう。

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```

このオブジェクトはコンポーネントの本体内で宣言されているため、[リアクティブな値](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)です。エフェクト内でこのようなリアクティブな値を読み取る場合は依存値として宣言する必要があります。これにより、エフェクトがその変更に「反応」するようになります。

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

依存値として宣言することは重要です！ これにより、例えば `roomId` が変更された場合に、エフェクトが新しい `options` でチャットに再接続することが保証されます。ただし上記のコードには問題もあります。これを確認するため、以下のサンドボックスの入力欄に入力して、コンソールで何が起こるかを見てみましょう。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Temporarily disable the linter to demonstrate the problem
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

上記のサンドボックスでは、入力欄は `message` という state 変数のみを更新しています。ユーザ視点からすると、これがチャットの接続に影響を与えるべきではありません。しかし、`message` を更新するたびに、コンポーネントは再レンダーされます。コンポーネントは再レンダーされるたびに、その内部のコードが最初から再実行されます。

`ChatRoom` コンポーネントの再レンダーごとに、新しい `options` オブジェクトがゼロから再作成されます。React は、`options` オブジェクトが前回のレンダー時に作成された `options` オブジェクトとは*異なるオブジェクト*であると認識します。従って、（`options` に依存する）エフェクトの再同期が発生し、タイピングによりチャットの再接続が発生してしまいます。

**この問題はオブジェクトと関数にのみ影響します。JavaScript では、新しく作成されたオブジェクトや関数は、他のすべてのオブジェクトや関数とは異なると見なされます。中身が同じであっても関係ありません！**

```js {7-8}
// During the first render
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// During the next render
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'music' };

// These are two different objects!
console.log(Object.is(options1, options2)); // false
```

**オブジェクト型や関数型の依存値は、エフェクトが必要以上に再同期される原因となります**。

したがって、エフェクトの依存値としてのオブジェクトや関数は、可能な限り避けるべきです。代わりに、それらをコンポーネントの外側やエフェクトの内側に移動させるか、あるいはそれらからプリミティブな値を抽出するよう試みてください。

#### 静的なオブジェクトや関数をコンポーネント外に移動 {/*move-static-objects-and-functions-outside-your-component*/}

オブジェクトが props や state に依存しない場合、そのオブジェクトをコンポーネントの外に移動できます。

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

これにより、それがリアクティブでないことをリンタに対して*証明*できます。再レンダーの結果として変更されることがないため、依存値にする必要がありません。これにより、`ChatRoom` を再レンダーしても、エフェクトが再同期されることはなくなります。

これは関数でも同様です。

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
```

`createOptions` はコンポーネントの外で宣言されているため、リアクティブな値ではありません。したがって、エフェクトの依存値に指定する必要はありませんし、この関数がエフェクトの再同期を発生させることも決してありません。

#### リアクティブなオブジェクトや関数をエフェクト内部に移動 {/*move-dynamic-objects-and-functions-inside-your-effect*/}

オブジェクトが再レンダーの結果として変更される可能性があるリアクティブな値（例：props としての `roomId`）に依存している場合、コンポーネントの*外側*に引っ張り出すことはできません。しかしそれを作成するコードをエフェクトのコード*内部*に移動させることは可能です。

```js {7-10,11,14}
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
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

`options` はエフェクトの内部で宣言されているため、エフェクトの依存値ではなくなります。代わりにエフェクトで使用される唯一のリアクティブな値は `roomId` となります。`roomId` はオブジェクトや関数ではないため、*意図せず*変わってしまうことはありません。JavaScript では、数値や文字列は内容によって比較されます。

```js {7-8}
// During the first render
const roomId1 = 'music';

// During the next render
const roomId2 = 'music';

// These two strings are the same!
console.log(Object.is(roomId1, roomId2)); // true
```

この修正により、入力欄を編集してもチャットの再接続は起こらなくなります。

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

ただし `roomId` ドロップダウンを変更すると、期待通り再接続が発生します。

これは関数の場合でも同様です。

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
```

エフェクト内でロジックの一部をグループ化するための独自の関数を作成できます。エフェクトの*内部*で宣言している限り、それらはリアクティブな値ではないので、エフェクトの依存値にする必要はありません。

#### オブジェクトからプリミティブ値を読み取る {/*read-primitive-values-from-objects*/}

props からオブジェクトを受け取ることがあります。

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ All dependencies declared
  // ...
```

しかし、親コンポーネントがオブジェクト作成をレンダー中に行っているかもしれないという心配があります。

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

これにより、親コンポーネントの再レンダーのたびに、エフェクトによる再接続が発生してしまいます。これを修正するには、エフェクトの*外側*でオブジェクトから情報を読み取っておき、オブジェクトや関数自体を依存値として持たせないようにします。

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

ロジックは少し繰り返しになります（エフェクト外でオブジェクトから値を読み取り、エフェクト内で同じ値を持つオブジェクトを作成している）。しかし、エフェクトが*実際に*依存している情報が何なのかが、非常に明確になります。親コンポーネントが誤ってオブジェクトを再作成している場合でも、チャットの再接続は起こりません。ですが `options.roomId` や `options.serverUrl` が実際に異なる場合は、チャットが再接続されます。

#### 関数からプリミティブ値を計算する {/*calculate-primitive-values-from-functions*/}

同じアプローチは関数にも適用できます。例えば、親コンポーネントが関数を渡してくる場合を考えてみましょう。

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

これを依存値にしない（再レンダー時の再接続を防ぐ）ために、エフェクトの外側でそれを呼び出します。これによりエフェクト内で読み取ることができる、オブジェクトではない `roomId` と `serverUrl` の値が得られます。

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ All dependencies declared
  // ...
```

これは、レンダー中に呼び出しても安全な[純粋](/learn/keeping-components-pure)な関数に対してのみ機能します。関数がイベントハンドラであり、その変更がエフェクトの再同期を引き起こさないようにしたい場合は、[エフェクトイベントにラップしてください](#do-you-want-to-read-a-value-without-reacting-to-its-changes)。

<Recap>

- 依存配列は常にコードと一致する必要がある。
- 依存配列が気に入らない場合、編集する必要があるのはコードの方である。
- リンタを抑制すると非常にわかりにくいバグが発生するため、いかなる場合も避けるべきである。
- 依存値を削除するには、リンタにそれが不要であることを「証明」する必要がある。
- 特定のユーザ操作に応答してコードを実行する必要がある場合は、そのコードをイベントハンドラに移動する。
- エフェクトの異なる部分が異なる理由で再実行される必要がある場合は、複数のエフェクトに分割する。
- 前の state に基づいて state を更新したい場合は、更新用関数を渡す。
- 最新の値を読み取りたいがそれに「反応」したくない場合、エフェクトからエフェクトイベントを抽出する。
- JavaScript では、オブジェクトや関数は、異なるタイミングで作成された場合、異なる値だと見なされる。
- オブジェクト型や関数型の依存値はなるべく避けるようにする。コンポーネントの外側かエフェクトの内側に移動させる。

</Recap>

<Challenges>

#### インターバルがリセットされる問題を修正 {/*fix-a-resetting-interval*/}

このエフェクトは 1 秒ごとに発火するインターバルをセットアップしています。しかし何かがおかしいことに気付きました。インターバルが発火するたびに破棄され、再作成されているようです。インターバルが何度も再作成されないようにコードを修正してください。

<Hint>

このエフェクトのコードは `count` に依存しているようです。この依存値の必要性をなくす方法はないでしょうか？ `count` の値に依存せず、前回の値に基づいて state を更新する方法があるはずです。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

<Solution>

エフェクトの中で `count` の state を `count + 1` に更新したいと考えています。しかし、これによりエフェクトが `count` に依存することになります。`count` は毎回更新されるため、インターバルも毎回再作成されることになります。

これを解決するには、[更新用関数](/reference/react/useState#updating-state-based-on-the-previous-state)を使い、`setCount(count + 1)` ではなく `setCount(c => c + 1)` と書くようにします。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Creating an interval');
    const id = setInterval(() => {
      console.log('⏰ Interval tick');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Clearing an interval');
      clearInterval(id);
    };
  }, []);

  return <h1>Counter: {count}</h1>
}
```

</Sandpack>

エフェクトの中で `count` を読み取る代わりに、`c => c + 1` という指示（「この数値をインクリメントせよ」）を React に渡します。React は次のレンダー時にそれを適用します。エフェクトの中で `count` の値を読み取る必要がなくなったので、エフェクトの依存配列を空 (`[]`) に保つことができます。これにより、エフェクトが毎秒インターバルを再作成するのを防ぐことができます。

</Solution>

#### アニメーションの再トリガを修正 {/*fix-a-retriggering-animation*/}

この例では、"Show" を押すとウェルカムメッセージがフェードインします。アニメーションには 1 秒かかります。"Remove" を押すと、ウェルカムメッセージがすぐに消えます。フェードインアニメーションのロジックは、`animation.js` ファイル内でプレーンな JavaScript [アニメーションループ](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)を使って実装されています。このロジックは変更の必要がありませんのでサードパーティのライブラリのように扱ってください。エフェクトは DOM ノードに対して `FadeInAnimation` インスタンスを作成し、アニメーションを制御するために `start(duration)` または `stop()` を呼び出します。`duration` はスライダで制御されます。スライダを調整して、アニメーションがどのように変化するかを確認してください。

このコードはすでに動作していますが、変更したい点があります。現在、`duration` state 変数を制御するスライダを動かすと、アニメーションが再トリガされてしまっています。`duration` 変数に対してエフェクトが「反応」しないよう、動作を変更してください。"Show" ボタンを押したときに、エフェクトはスライダで指定する現在の `duration` を使用する必要があります。しかしスライダの操作それ自体でアニメーションが再トリガされてはいけません。

<Hint>

エフェクト内にリアクティブにしてはいけないコードはありませんか？ エフェクトの外に非リアクティブなコードを移動するにはどうすればいいでしょうか？

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
import { useState, useEffect, useRef } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
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
```

</Sandpack>

<Solution>

エフェクトは `duration` の最新の値を読み取る必要がありますが、`duration` の変更に対して「反応」させたくありません。アニメーション開始時に `duration` を使用しますが、アニメーションがリアクティブに開始されるわけではありません。非リアクティブなコードをエフェクトイベントに抽出し、エフェクトからその関数を呼び出してください。

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
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Welcome
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
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
    if (progress < 1) {
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
```

</Sandpack>

`onAppear` のようなエフェクトイベントはリアクティブではないため、アニメーションを再トリガすることなく `duration` を内部で読み取ることができます。

</Solution>

#### チャットの再接続を修正 {/*fix-a-reconnecting-chat*/}

この例では、"Toggle theme" を押すたびにチャットの再接続が発生します。なぜこれが起こるのでしょうか？ サーバの URL を編集したり、別のチャットルームを選択したりしたときにのみチャットが再接続されるよう、修正してください。

`chat.js` は外部のサードパーティライブラリとして扱ってください。API を確認するために参照しても構いませんが、編集はしないでください。

<Hint>

これを修正する方法は複数ありますが、最終的には依存値としてオブジェクトを使わないようにする必要があります。

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

エフェクトが再実行されるのは、`options` オブジェクトに依存しているためです。オブジェクトはうっかり再作成されることがあるため、可能な場合は常に、エフェクトの依存値としては使用しないようにしましょう。

最も影響範囲の小さい修正方法は、エフェクトの外で `roomId` と `serverUrl` を読み取り、エフェクトをこれらプリミティブな値（意図せず変更されることがない）に依存させることです。エフェクト内でオブジェクトを作成し、それを `createConnection` に渡します。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
      <ChatRoom options={options} />
    </div>
  );
}
```

```js ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {options.roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

さらに良い方法は、オブジェクト型の props である `options` を、より具体的な `roomId` と `serverUrl` に置き換えることです。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle theme
      </button>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
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
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>Welcome to the {roomId} room!</h1>;
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
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

可能な限り props をプリミティブ値にすることで、後でコンポーネントの最適化がやりやすくなります。

</Solution>

#### 別のチャット再接続問題を修正 {/*fix-a-reconnecting-chat-again*/}

この例ではチャットに接続する際に暗号化 (encryption) の有無を切り替えられます。チェックボックスを切り替えて、暗号化がオンの場合とオフの場合でコンソールに表示されるメッセージが異なることを確認してください。ルームを変更してみてください。次に、テーマを切り替えてみてください。チャットルームに接続している間、数秒ごとに新しいメッセージが届きます。受信したメッセージの色が選択したテーマに一致していることを確認してください。

この例では、テーマを変更するたびにチャットが再接続されてしまっています。これを修正してください。修正後は、テーマを変更してもチャットが再接続されず、暗号化設定を切り替えたりルームを変更したりした場合にのみ再接続されるようにしてください。

`chat.js` のコードは変更しないでください。振る舞いを変えない限り、それ以外のコードは変更しても構いません。例えば、どの props を渡すか変えてみると有用かもしれません。

<Hint>

props として `onMessage` と `createConnection` という 2 つの関数を渡しています。どちらも `App` が再レンダーされるたびに最初から作成されます。これらは毎回新しい値と見なされるため、それが原因でエフェクトが再トリガされてしまっています。

これらの関数のうち一方は、イベントハンドラです。新しいイベントハンドラに「反応」せずに、エフェクトでイベントハンドラを呼び出す方法を知っていますか？ それが役立ちそうです！

もう一方の関数は、ある state をインポートされた API メソッドに渡すためだけに存在します。この関数は本当に必要ですか？ 本質的に渡されている情報は何ですか？ `App.js` から `ChatRoom.js` にいくつかのインポートを移動する必要があるかもしれません。

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

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

正しい解決法は複数ありますが、ここでは可能な解決策のうち 1 つを示します。

元の例では、テーマを切り替えると、異なる `onMessage` と `createConnection` 関数が作成され、渡されていました。エフェクトがこれらの関数に依存していたため、テーマを切り替えるたびにチャットの再接続が起きていました。

`onMessage` の問題を修正するには、エフェクトイベントにラップする必要があります。

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

props である `onMessage` とは異なり、`onReceiveMessage` エフェクトイベントはリアクティブではありません。したがってエフェクトの依存値にする必要はありません。この結果、`onMessage` が変わってもチャットの再接続が引き起こされることがなくなります。

`createConnection` はリアクティブで*あるべき* ですので、同じことをやってはいけません。暗号化接続と非暗号化接続を切り替えたり、現在のルームを切り替えたりする場合、エフェクトが再トリガされることは*望ましいこと*です。しかし、`createConnection` は関数であるため、読み取り情報が*本当に*変更されたかどうかを確認することはできません。これを解決するために、`App` コンポーネントから `createConnection` を渡す代わりに、生の `roomId` と `isEncrypted` の値を渡すようにします。

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
```

これで、`createConnection` 関数を `App` から渡すのではなく、エフェクトの*内部*に移動できます。

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

これらの変更の後、エフェクトはもはや関数型の値に依存しなくなります。

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reactive values
  const onReceiveMessage = useEffectEvent(onMessage); // Not reactive

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reading a reactive value
      };
      if (isEncrypted) { // Reading a reactive value
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ All dependencies declared
```

結果として、チャットは意味のあるもの（`roomId` や `isEncrypted`）が変更されたときにのみ再接続されるようになります。

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

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
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
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('New message: ' + msg, isDark ? 'dark' : 'light');
        }}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ 🔐 Connecting to "' + roomId + '" room... (encrypted)');
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
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
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

export function createUnencryptedConnection({ serverUrl, roomId }) {
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
      console.log('✅ Connecting to "' + roomId + '" room (unencrypted)...');
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
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
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
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
