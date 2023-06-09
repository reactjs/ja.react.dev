---
title: 'リアクティブなエフェクトのライフサイクル'
---

<Intro>

エフェクトはコンポーネントとは異なるライフサイクルを持ちます。コンポーネントは、マウント、更新、アンマウントを行うことができます。エフェクトは 2 つのことしかできません。同期の開始と、同期の停止です。エフェクトが props や state に依存し、これらが時間と共に変化する場合、このサイクルは繰り返し発生します。React では、エフェクトの依存配列が適切に指定されているかをチェックするリンタルールが提供されています。これにより、エフェクトが最新の props や state と同期された状態を維持することができます。

</Intro>

<YouWillLearn>

- エフェクトのライフサイクルとコンポーネントのライフサイクルの違い
- 個々のエフェクトを独立して考える方法
- いつ、そしてなぜエフェクトを再同期する必要があるのか
- エフェクトの依存配列を決める方法
- 値がリアクティブであるとはどのような意味か
- 空の依存配列の意味
- React のリンタは、どのようにして依存配列が正しいと判断するのか
- リンタに同意できない時にどうすれば良いか

</YouWillLearn>

## エフェクトのライフサイクル {/*the-lifecycle-of-an-effect*/}

全ての React コンポーネントは同じライフサイクルを持ちます。

- 画面に追加されたとき、コンポーネントは*マウント*されます。
- （大抵はインタラクションに応じて）新しい props や state を受け取ったとき、コンポーネントは*更新*されます。
- 画面から削除されたとき、コンポーネントは*アンマウント*されます。

**これは、コンポーネントの考え方としては良いですが、エフェクトの考え方としては*良くありません***。それぞれのエフェクトは、コンポーネントのライフサイクルから独立させて考えましょう。エフェクトは、現在の props や state に[外部システムをどのように同期させるのか](/learn/synchronizing-with-effects)を記述します。コードが変更されれば、同期の頻度も増減するでしょう。

この点を説明するために、コンポーネントをチャットサーバに接続するエフェクトを考えてみましょう。

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

エフェクトの本体には、**どのように同期を開始するのか**を記述しています。

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

エフェクトの返り値として表されるクリーンアップ関数には、**どのように同期を停止するのか**を記述しています。

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

これだけを見ると、React はコンポーネントのマウント時に**同期を開始し**、アンマウント時に**同期を停止する**だけのように見えます。しかし、これで終わりではありません！ コンポーネントがマウントされている間、**同期の開始と停止を繰り返し行わなければならない**場合があるからです。

この挙動が*いつ*発生し、*どのように*制御することができ、そしてそれが*なぜ*必要なのかを見ていきましょう。

<Note>

エフェクトは、クリーンアップ関数を返さないことがあります。[多くの場合は返すべき](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)ですが、もし返さなかった場合は、空のクリーンアップ関数が返されたとして扱われます。

</Note>

### なぜ複数回の同期が必要なのか {/*why-synchronization-may-need-to-happen-more-than-once*/}

`ChatRoom` コンポーネントが、ユーザがドロップダウンで選択した `roomId` プロパティを受け取ることを考えましょう。ユーザが最初に、`roomId` として `"general"` ルームを選択したとします。あなたのアプリは `"general"` ルームを表示します。

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "general" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

この UI が表示されたあと、React は**同期を開始するために**エフェクトを実行します。これにより、`"general"` ルームに通信が接続されます。

```js {3,4}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
  }, [roomId]);
  // ...
```

ここまでは順調です。

この後、ユーザがドロップダウンで違うルーム（例えば `"travel"` ルーム）を選択したとします。まず、React は UI を更新します。

```js {1}
function ChatRoom({ roomId /* "travel" */ }) {
  // ...
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

次に何が起こるか考えてみましょう。ユーザには、UI 上では `"travel"` ルームが選択されているように見えています。しかし、直近に実行されたエフェクトは、未だ `"general"` ルームに接続しています。**`roomId` プロパティが変化してしまったため、エフェクトが行なっていたこと（`"general"` ルームへの接続）が UI と一致しなくなってしまいました。**

この時点で、あなたは React に以下の 2 つの処理を実行してほしいはずです。

1. 古い `roomId` での同期を停止する（`"general"` ルームとの接続を切断する）
2. 新しい `roomId` での同期を開始する（`"travel"` ルームとの接続を開始する）

**ラッキーなことに、これらの処理を行う方法は既に学んでいます！** エフェクトの本体には「どのように同期を開始するのか」を、クリーンアップ関数には「どのように同期を停止するのか」を記述するのでした。React はエフェクトを、正しい順序、かつ正しい props と state で呼び出します。では、具体的にどうなるのか見てみましょう。

### どのようにしてエフェクトの再同期が行われるのか {/*how-react-re-synchronizes-your-effect*/}

`ChatRoom` コンポーネントが、`roomId` プロパティとして新しい値を受け取ったところを思い出してください。プロパティの値が、`"general"` から `"travel"` に変化しました。React は、別のルームに再接続するため、エフェクトを再同期する必要があります。

まず React は、**同期を停止する**ために `"general"` ルームに接続したあとにエフェクトが返したクリーンアップ関数を呼び出します。`roomId` は `"general"` であったので、クリーンアップ関数は `"general"` ルームの通信を切断します。

```js {6}
function ChatRoom({ roomId /* "general" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "general" room
    connection.connect();
    return () => {
      connection.disconnect(); // Disconnects from the "general" room
    };
    // ...
```

次に React は、レンダー中に提供されたエフェクトを実行します。このとき、`roomId` は `"travel"` なので、`"travel"` ルームへの**同期が開始されます**。（最終的に、そのエフェクトのクリーンアップ関数が呼び出されるまで、同期が続きます。）

```js {3,4}
function ChatRoom({ roomId /* "travel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Connects to the "travel" room
    connection.connect();
    // ...
```

これで、ユーザが UI で選択したルームに正しく接続することができました。一件落着！

`roomId` が変化しコンポーネントが再レンダーされるたびに、エフェクトは再同期を行います。例として、ユーザが `roomId` を `"travel"` から `"music"` に変更したとしましょう。React は、クリーンアップ関数を呼び出すことで、再度エフェクトの**同期を停止**（`"travel"` ルームを切断）します。次に、新しい `roomId` プロパティの値でエフェクトの本体を実行し、**同期を開始**（`"music"` ルームに接続）します。

最後に、ユーザが別の画面に遷移すれば、`ChatRoom` コンポーネントはアンマウントされます。これ以上接続を維持する必要はないので、React は最後にもう一度**同期を停止し**、`"music"` ルームとの通信を切断します。

### エフェクトの視点で考える {/*thinking-from-the-effects-perspective*/}

`ChatRoom` コンポーネントの視点で、起こったことを振り返りましょう。

1. `roomId` が `"general"` にセットされた状態で `ChatRoom` がマウントされる
1. `roomId` が `"travel"` にセットされた状態で `ChatRoom` が更新される
1. `roomId` が `"music"` にセットされた状態で `ChatRoom` が更新される
1. `ChatRoom` がアンマウントされる

この、コンポーネントのライフサイクルの各ポイントで、エフェクトは以下の処理を行いました。

1. エフェクトが `"general"` ルームに接続する
2. エフェクトが `"general"` ルームを切断し、`"travel"` ルームに接続する
3. エフェクトが `"travel"` ルームを切断し、`"music"` ルームに接続する
4. エフェクトが `"music"` ルームを切断する

では、エフェクトの視点でどのようなことが発生したのか考えましょう。

```js
  useEffect(() => {
    // エフェクトが、roomId で指定されたルームに接続する
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...切断されるまで
      connection.disconnect();
    };
  }, [roomId]);
```

このコードの構造から、何が発生したのかを、複数に区切られた時間の連続として理解できるかもしれません。

1. エフェクトが、`"general"` に接続する（切断されるまで）
1. エフェクトが、`"travel"` に接続する（切断されるまで）
1. エフェクトが、`"music"` に接続する（切断されるまで）

先ほどはコンポーネントの視点で考えていました。コンポーネントの視点から見ると、エフェクトは、"レンダー直後" や "アンマウント直前" のように特定のタイミングで発生する "コールバック関数" や "ライフサイクル中のイベント" であると考えたくなります。しかし、このような考え方はすぐにややこしくなるため、避けた方が無難です。

**その代わりに、エフェクトの開始/終了という 1 サイクルのみにフォーカスしてください。コンポーネントがマウント中なのか、更新中なのか、はたまたアンマウント中なのかは問題ではありません。どのように同期を開始し、どのように同期を終了するのか、これを記述すれば良いのです。このことを意識するだけで、開始・終了が何度も繰り返されても、柔軟に対応できるエフェクトとなります。**

もしかすると、JSX を作成するレンダーロジックを書くときのことを思い出したかもしれません。このときも、コンポーネントがマウント中なのか、更新中なのかは意識しませんでした。あなたは画面に表示されるものを記述し、[残りは React がやってくれるのです](/learn/reacting-to-input-with-state)。

### エフェクトが再同期できることを React はどのように確認するのか {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

こちらは、実際に動かして試すことができるサンプルです。"Open chat" を押して `ChatRoom` コンポーネントをマウントしてみましょう。

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

コンポーネントが初めてマウントされたときに、3 つのログが表示されることに注目してください。

1. `✅ Connecting to "general" room at https://localhost:1234...` *(development-only)*
1. `❌ Disconnected from "general" room at https://localhost:1234.` *(development-only)*
1. `✅ Connecting to "general" room at https://localhost:1234...`

最初の 2 つのログは開発時のみ表示されます。開発時には、React は常に各コンポーネントを 1 度再マウントします。

**開発時には、React はエフェクトを即座に再同期させて、エフェクトの再同期が正しく行われることを確認します**。この動作は、ドアの鍵が正しくかかるか確認するために、ドアを 1 度余分に開け閉めしてみることに似ています。React は、[クリーンアップ関数が正しく実装されているか](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)を確認するために、開発時にエフェクトを 1 回余分に開始・停止します。

実環境でエフェクトの再同期が発生する主な理由は、エフェクトが利用するデータが変更されることです。上記のサンドボックスで、チャットルームの選択を変更してみてください。`roomId` が変更されると、エフェクトが再同期されることがわかります。

しかし、再同期が必要となるより珍しいケースもあります。例えば、チャットが開いている間に、サンドボックス上の `serverUrl` を編集してみてください。コードの編集に応じて、エフェクトが再同期されることがわかります。将来的には、React は再同期に依存する機能を追加するかもしれません。

### React がエフェクトの再同期が必要であることを知る方法 {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

`roomId` が変更された後に、React はなぜエフェクトを再同期する必要があることを知ったのでしょうか。それは、`roomId` を[依存配列](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies)に含めることで、React にそのコードが `roomId` に依存していることを伝えたからです。

```js {1,3,8}
function ChatRoom({ roomId }) { // roomId は時間の経過とともに変化する可能性がある
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // このエフェクトは `roomId` を利用している
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // つまり、このエフェクトは roomId に "依存" している
  // ...
```

仕組みは以下のようになっています。

1. `roomId` はプロパティである。これは、`roomId` が時間の経過とともに変化する可能性があるということです。
2. エフェクトが `roomId` を利用する。(これは、エフェクトのロジックが、後で変更される可能性のある値に依存していることを意味しています。)
3. そのため、エフェクトの依存配列に `roomId` を指定する。（こうすることで、`roomId` が変更されたときに再同期することができます。） 

コンポーネントが再レンダーされるたびに、React は渡された依存配列を確認します。配列内の値のいずれかが、前回のレンダー時に渡された配列の同じ場所の値と異なる場合、React はエフェクトを再同期します。

例えば、初回のレンダー時に `["general"]` を渡し、次のレンダー時に `["travel"]` を渡したとします。React は `"general"` と `"travel"` を比較します（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で比較されます）。異なる値が存在するため、React はエフェクトを再同期します。一方、コンポーネントが再レンダーされたが `roomId` が変更されていない場合、エフェクトは同じルームに接続されたままになります。

### 1 つのエフェクトは独立した 1 つの同期の処理を表す {/*each-effect-represents-a-separate-synchronization-process*/}

実装済みのエフェクトと同時に実行するというだけの理由で、関係のないロジックを同じエフェクトに追加しないでください。例えば、ユーザがルームを訪れたときにアナリティクスイベントを送信したいとします。既に `roomId` に依存するエフェクトがあるため、そこにアナリティクスの呼び出しを追加したくなるかもしれません。

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

しかし後になってこのエフェクトに、接続の再確立を必要とするような何か別の依存値を追加する必要が出てきたとします。このエフェクトが再同期されると、ルームが変わっていないのに `logVisit(roomId)` が再度呼び出されてしまいます。これは意図したものではありません。訪問の記録は、接続とは**別の処理**です。別のエフェクトとして記述してください。

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**コード内の 1 つのエフェクトは、1 つの独立した同期の処理を表すべきです。**

上記の例では、1 つのエフェクトを削除しても、他のエフェクトのロジックは壊れません。これは、それらが異なるものを同期していることを示しており、分割するのが理にかなっているということです。逆に、1 つのロジックを別々のエフェクトに分割してしまうと、コードは一見「きれい」に見えるかもしれませんが、[メンテナンスは困難になるでしょう](/learn/you-might-not-need-an-effect#chains-of-computations)。そのため、コードがきれいに見えるかどうかではなく、処理が独立しているか同じかを考える必要があります。

## エフェクトはリアクティブ (reactive) な値に "反応" する {/*effects-react-to-reactive-values*/}

以下の例では、エフェクトが 2 つの変数 (`serverUrl` と `roomId`) を利用していますが、依存配列には `roomId` のみが指定されています。

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
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

なぜ `serverUrl` は依存配列に追加しなくて良いのでしょうか？

これは、再レンダーが起こっても、決して `serverUrl` が変化することはないからです。どのような理由で何度再レンダーが起こっても、いつも同じ値です。したがって、依存配列に追加しても意味がありません。結局のところ、指定する依存値は、時間によって変化して初めて意味があるのです！

一方、`roomId` は再レンダー時に異なる値になる可能性があります。**コンポーネント内で宣言された props、state、その他の値は、レンダー時に計算され、React のデータフローに含まれるため、*リアクティブ*です。**

もし `serverUrl` が state 変数だった場合、リアクティブとなります。リアクティブな値は、依存配列に含める必要があります。

```js {2,5,10}
function ChatRoom({ roomId }) { // props は時間経過とともに変化し得る
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // state は時間経過とともに変化し得る

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // エフェクトは props と state を利用している
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // つまり、エフェクトは props と state に "依存" している
  // ...
}
```

`serverUrl` を依存配列に含めることで、`serverUrl` が変更された後に再同期されることを保証します。

チャットルームの選択を変更したり、サーバの URL を編集してみてください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

`roomId` や `serverUrl` のようなリアクティブな値を変更するたびに、エフェクトはチャットサーバに再接続します。

### 依存配列が空のエフェクトは何を意味するのか {/*what-an-effect-with-empty-dependencies-means*/}

もし `serverUrl` や `roomId` をコンポーネント外に移動した場合、どうなるでしょうか？

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

現在のエフェクトのコードは、リアクティブな値を利用していません。そのため、依存配列は空 (`[]`) になります。

空の依存配列 (`[]`) をコンポーネントの視点から考えると、このエフェクトは、コンポーネントのマウント時にチャットルームに接続し、アンマウント時に切断することを意味しています。（開発時は、ロジックのストレステストのために、[余計に一度再同期される](#how-react-verifies-that-your-effect-can-re-synchronize)ことをお忘れなく）


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
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

しかし、[エフェクトの視点から考えると](#thinking-from-the-effects-perspective)、マウントとアンマウントについて考える必要は全くありません。重要なのは、エフェクトが同期の開始と停止のときに何を行うかを指定したことです。今回は、リアクティブな依存値はありません。しかし、将来的にユーザに `roomId` や `serverUrl` を変更してもらいたくなった場合（これらの値がリアクティブになるでしょう）でも、エフェクトのコードを変更する必要はありません。依存配列にこれらの値を追加するだけです。

### コンポーネント本体で宣言された変数はすべてリアクティブである {/*all-variables-declared-in-the-component-body-are-reactive*/}

リアクティブな値は、props や state だけではありません。これらの値から導出される値もまた、リアクティブな値となります。props や state が変更されるとコンポーネントは再レンダーされ、導出される値も変化します。これが、コンポーネント本体で宣言された変数で、エフェクトが利用するものは、全てそのエフェクトの依存配列に含まなければならない理由です。

ユーザがドロップダウンでチャットサーバを選択できますが、設定でデフォルトサーバを指定することもできるとしましょう。設定の状態を表す state をすでに[コンテクスト](/learn/scaling-up-with-reducer-and-context)に入れていると仮定し、そのコンテクストから `settings` を読み取ります。そして、props から得られる選択されたサーバと、デフォルトサーバに基づいて `serverUrl` を計算します。

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId はリアクティブ
  const settings = useContext(SettingsContext); // settings はリアクティブ
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl はリアクティブ
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // エフェクトは roomId と serverUrl を利用している
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // そのため、どちらかが変更された場合は再同期が必要！
  // ...
}
```

この例では、`serverUrl` は props でも state でもありません。レンダー時に計算される通常の変数です。しかし、レンダー時に計算されるがゆえに、再レンダーによって変化する可能性があります。これが、リアクティブな値となる理由です。

**コンポーネント内のすべての値（props、state、コンポーネント本体の変数を含む）はリアクティブです。リアクティブな値は再レンダー時に変更される可能性があるため、エフェクトの依存配列に含める必要があります。**

つまり、エフェクトはコンポーネント本体のすべての値に "反応 (react)" するのです。

<DeepDive>

#### グローバルな値やミュータブルな値は依存配列に含めるべき？ {/*can-global-or-mutable-values-be-dependencies*/}

グローバル変数を含むミュータブル（書き換え可能）な値は、リアクティブではありません。

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) のようなミュータブルな値を依存配列に含めることはできません**。なにしろミュータブルなので、React のレンダーデータフローの外部で、いつでも書き換わってしまう可能性があります。外部で変更されても、コンポーネントの再レンダーはトリガされません。したがって、依存配列に含めたとしても、その値が変更されたときにエフェクトの再同期が必要だと React には*伝わりません*。また、レンダー中（依存関係を計算するとき）にミュータブルなデータを読み取ることは、[レンダーの純粋性](/learn/keeping-components-pure)のルールを破っています。代替策として、外部のミュータブルな値の読み取りやリッスンをするには [`useSyncExternalStore`](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) を利用しましょう。

**[`ref.current`](/reference/react/useRef#reference) のようなミュータブルな値や、この値から導出される値も依存配列に含めることはできません。**`useRef` によって返される ref オブジェクト自体は依存配列に含めることができますが、その `current` プロパティは意図的にミュータブルとなっています。これにより、[再レンダーをトリガせずに値を追跡し続けることができます](/learn/referencing-values-with-refs)。しかし、`current` を変更しても再レンダーはトリガされないため、リアクティブな値とはいえず、その値が変更されたときにエフェクトを再実行することは React には伝わりません。

このページの後半で学びますが、リンタがこれらの問題を自動でチェックしてくれます。

</DeepDive>

### React はすべてのリアクティブな値が依存配列に含まれることをチェックする {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

リンタが [React 向けに設定されている](/learn/editor-setup#linting)場合、エフェクトで利用されているすべてのリアクティブな値が、その依存値として宣言されているかどうかをチェックします。例えば、以下のコードはリンタエラーとなります。なぜなら、`roomId` と `serverUrl` はどちらもリアクティブだからです。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Something's wrong here!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
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

このエラーは React のエラーのように見えますが、実際にはあなたのコードのバグを指摘してくれています。`roomId` と `serverUrl` は時間経過とともに変化する可能性がありますが、それらが変更されたときにエフェクトを再同期するのを忘れています。ユーザが UI で異なる値を選択しても、最初の `roomId` と `serverUrl` に接続し続けてしまいます。

バグを修正するには、リンタの提案に従って、エフェクトの依存配列に `roomId` と `serverUrl` を追加します。

```js {9}
function ChatRoom({ roomId }) { // roomId is reactive
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl is reactive
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ All dependencies declared
  // ...
}
```

上記のサンドボックスでこの修正を試してみてください。リンタエラーがなくなり、チャットが適切に再接続されることを確認してください。

<Note>

コンポーネント内で宣言された変数でも、その値が決して変更されないことを React が*知っている*ケースがあります。例えば、`useState` から返される [`set` 関数](/reference/react/useState#setstate) や、[`useRef`](/reference/react/useRef) から返される ref オブジェクトは、*安定*、すなわち、再レンダー時に変更されないことが保証されています。安定な値はリアクティブではないため、依存配列から省略することができます。なお、これらの値は変更されないため、配列に加えてしまっても問題はありません。

</Note>

### 再同期を避けたい場合の方法 {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

前の例では、`roomId` と `serverUrl` を依存配列に追加することで、リンタエラーを修正しました。

**しかし、その代わりに、これらの値がリアクティブではない、つまり再レンダーされても*変更し得ない*ことを、リンタに「証明」することもできます**。例えば、`serverUrl` と `roomId` がレンダーに依存せず、常に同じ値を持つ場合、コンポーネントの外に移動することができます。これで、依存配列に含める必要はなくなりました。

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
const roomId = 'general'; // roomId is not reactive

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

また、これらの値を*エフェクトの内部*に移動することもできます。レンダー時の計算から外れるため、リアクティブな値とはなりません。

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl is not reactive
    const roomId = 'general'; // roomId is not reactive
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ All dependencies declared
  // ...
}
```

**エフェクトはリアクティブなコードブロックです**。エフェクトは、その中で読み取っている値が変更されたときに再同期します。イベントハンドラは 1 回のインタラクションにつき 1 回しか実行されませんが、エフェクトは同期が必要なときにいつでも実行されます。

**依存配列を「選ぶ」ことはできません**。依存配列には、エフェクトで読み取るすべての[リアクティブな値](#all-variables-declared-in-the-component-body-are-reactive)を含める必要があります。リンタがこれを強制します。これにより、無限ループや、エフェクトの再同期が頻発してしまうことがありますが、リンタを抑制してこれらの問題を解決としないでください！ 代わりに、以下のことを試してみてください。

* **エフェクトが 1 つの独立した同期の処理を表していることを確認してください**。もし、エフェクトが何も同期していない場合、[エフェクトは不要かもしれません](/learn/you-might-not-need-an-effect)。複数の独立したものを同期している場合は、[分割してください](#each-effect-represents-a-separate-synchronization-process)。

* **props や state に反応せずに、最新の値を読み取り、エフェクトを再同期したい場合**、エフェクトをリアクティブな部分（エフェクト内に残す）と、非リアクティブな部分（いわゆる*エフェクトイベント*に抽出する）に分割することができます。詳しくは、[エフェクトからイベントを分離する](/learn/separating-events-from-effects)を参照してください。

* **オブジェクトや関数を依存配列に含めないようにしてください**。レンダー中に作成したオブジェクトや関数をエフェクトから読み取ると、これらの値は毎回異なるものになります。これにより、エフェクトが毎回再同期されてしまいます。詳しくは、[エフェクトから不要な依存関係を削除する](/learn/removing-effect-dependencies)を参照してください。

<Pitfall>

リンタはあなたの助けになりますが、その力には限界があります。リンタは、依存配列が*間違っている*場合しか検出できず、それぞれのケースを解決する*最善の方法*を提案することはできません。例えば、リンタの提案に従って依存値を追加すると、ループが発生してしまったとしましょう。このような場合でも、リンタを無視すべきではありません。エフェクトの内部（または外部）のコードを変更し、追加した値がリアクティブにならないようにして、依存値になる*必要がない*ようにすべきです。

既存のコードベースがある場合、次のようにリンタを抑制するエフェクトがいくつかあるかもしれません。

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

以降のページ（[こちら](/learn/separating-events-from-effects)と[こちら](/learn/removing-effect-dependencies)）では、ルールを破らずにこれらのコードを修正する方法を学びます。必ず修正する価値があります！

</Pitfall>

<Recap>

- コンポーネントはマウント、更新、アンマウントを行うことができる。
- それぞれのエフェクトは、周囲のコンポーネントとは別のライフサイクルを持つ。
- それぞれのエフェクトは、*開始*と*停止*が可能な独立した同期プロセスを表す。
- エフェクトを読み書きするときは、コンポーネントの視点（どのようにマウント、更新、アンマウントが行われるか）ではなく、それぞれのエフェクトの視点（どのように同期が開始および停止されるか）で考える。
- コンポーネント本体で宣言された値は "リアクティブ" である。
- リアクティブな値は時間とともに変化する可能性があるため、エフェクトを再同期する必要がある。
- リンタは、エフェクト内で使用されているすべてのリアクティブな値が依存配列に含まれることを確認する。
- リンタが検出するエラーは、すべて妥当なものである。ルールを破らずにコードを修正する方法が必ず存在する。

</Recap>

<Challenges>

#### キー入力による再接続を防ぐ {/*fix-reconnecting-on-every-keystroke*/}

この例では、`ChatRoom` コンポーネントは、マウントされたときにチャットルームに接続し、アンマウントされたときにルームから切断し、別のチャットルームが選択されたときに再接続します。これは正しいので、この動作を維持する必要があります。

しかし、問題があります。下部のメッセージボックスに入力するたびに、`ChatRoom` はチャットに*再接続*してしまいます（コンソールを 1 度クリアしてから入力すると分かりやすいです）。問題を修正し、これを防ぎましょう。

<Hint>

このエフェクトに依存配列を追加する必要があるかもしれません。どのような依存配列を指定すればよいでしょうか？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

<Solution>

このエフェクトには依存配列がありませんでした。そのため、再レンダーのたびに再同期されてしまいます。まず依存配列を追加しましょう。次に、エフェクトで利用されているリアクティブな値を、すべて依存配列に追加します。例えば、`roomId` は（props なので）リアクティブです。したがって、配列に含める必要があります。これにより、ユーザが別のルームを選択したときに、チャットが再接続されることが保証されます。一方、`serverUrl` はコンポーネントの外で定義されているので、依存配列に含める必要はありません。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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

</Solution>

#### 同期の有無を切り替える {/*switch-synchronization-on-and-off*/}

この例では、エフェクトで window の [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) イベントをリッスンし、画面上のピンクのドットを移動させています。プレビューエリアにカーソルを合わせてみてください（モバイルデバイスの場合は画面をタッチしてください）。ピンクのドットが動きに合わせて移動することがわかります。

チェックボックスもあります。チェックボックスをオンにすると、`canMove` state 変数が切り替わります。しかし、この state 変数はまだコード内で利用されていません。`canMove` が `false` のとき（つまり、チェックボックスがオフのとき）ドットが動かないようにコードを変更してみましょう。また、チェックボックスをオンに戻すと（`canMove` が `true` になり）ドットが再び動き始めるようにしましょう。言い換えると、ドットが動けるかどうかは、チェックボックスがチェックされているかどうかに同期します。

<Hint>

エフェクトは条件分岐の中では利用できません。しかし、エフェクトの中で条件分岐を利用することはできます！

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
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

<Solution>

1 つ目の答えは、`setPosition` を `if (canMove) { ... }` の条件分岐でラップすることです。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

2 つ目の答えは、*イベントをリッスンする*ロジック自体を `if (canMove) { ... }` の条件分岐でラップすることです。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

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

どちらの場合でも、`canMove` はエフェクト内で読み取るリアクティブな変数です。そのため、エフェクトの依存配列に `canMove` を指定する必要があります。これにより、エフェクトは、値が変更されるたびに再同期されます。

</Solution>

#### 更新前の値が残るバグを調査 {/*investigate-a-stale-value-bug*/}

この例では、チェックボックスがオンのときにピンクのドットが動き、オフのときには停止している必要があります。このロジックはすでに実装されています。`handleMove` イベントハンドラは `canMove` state 変数をチェックします。

しかしどういうわけか、`handleMove` 内の `canMove` state 変数は "古い" ようです。チェックボックスをオフにしても、常に `true` となっています。なぜこうなるのでしょうか？ コードの間違いを見つけて修正しましょう。

<Hint>

リンタルールが抑制されているのを見つけたら、抑制を解除してください！ これが誤りの多い場所です。

</Hint>

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

<Solution>

元のコードの問題点は、依存配列のリンタを抑制していることです。抑制を解除すると、このエフェクトが `handleMove` 関数に依存していることがわかります。これは確かに妥当な指摘です。なぜなら、`handleMove` はコンポーネント本体で宣言されているため、リアクティブな値となるからです。リアクティブな値はすべて依存関係として指定する必要があります。そうしないと、時間の経過とともに値が古くなる可能性があります！

元のコードの作者は、このエフェクトがリアクティブな値に依存していない (`[]`) と言って React に「嘘をついた」のです。そのため、React は `canMove` が変更された後（`handleMove` も変更された後）にエフェクトを再同期しませんでした。React がエフェクトを再同期しなかったため、リスナとしてアタッチされた `handleMove` は、初回レンダー時に作成された `handleMove` 関数のままです。初回レンダー時には `canMove` が `true` であったため、この `handleMove` は常にその値を参照することになります。

**リンタを抑制しないようにすれば、古い値が残る問題は発生しません**。このバグを修正する方法はいくつかありますが、まずはリンタの抑制を解除してください。その後、リントエラーを修正するためにコードを変更しましょう。

エフェクトの依存配列を `[handleMove]` のように変更しても構いませんが、`handleMove` はどうせ毎レンダーで新しく定義される関数なので、依存配列自体をまるごと削除しても良いでしょう。これでエフェクトは再レンダーのたびに再同期の処理を行うようになります。

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
  });

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

このソリューションは問題なく機能しますが、理想的ではありません。エフェクト内に `console.log('Resubscribing')` を入れてみると、再レンダーのたびにリスナの再登録が発生していることがわかります。再登録は高速に動作するものの、それほど頻繁に行わないようにした方が望ましいでしょう。

より良い修正方法は、`handleMove` 関数をエフェクトの*内部*に移動することです。そうすると、`handleMove` はリアクティブな値ではなくなり、エフェクトは `handleMove` 関数に依存しなくなります。代わりに、エフェクトの内部で利用する `canMove` に依存することになります。これは、あなたが望んでいた動作に一致しています。なぜなら、エフェクトが `canMove` の値と同期するようになるからです。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

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

エフェクト本体に `console.log('Resubscribing')` を追加してみてください。チェックボックスを切り替えたとき（つまり `canMove` が変更されたとき）またはコードを編集したときに、リスナの再登録が発生することが分かります。これは、毎レンダーごとに再登録をしていた前のアプローチよりも優れています。

この種の問題に対するより一般的なアプローチについては、[エフェクトからイベントを分離する](/learn/separating-events-from-effects)を参照してください。

</Solution>

#### 接続の切り替えを修正 {/*fix-a-connection-switch*/}

以下の例では、`chat.js` にあるチャットサービスは 2 つの異なる API を公開しています。`createEncryptedConnection` と `createUnencryptedConnection` です。ルートの `App` コンポーネントでは、暗号化を適用するかどうかをユーザが選択できるようにしています。そして、ユーザが選んだ選択肢に対応する API メソッドを、子の `ChatRoom` コンポーネントに `createConnection` プロパティとして渡しています。

最初は、コンソールログには接続が暗号化されていない旨が表示されています。チェックボックスをオンにしてみてください。何も起こりません。しかし、その後に違うルームを選択すると、チャットが再接続され、*このタイミングで*暗号化も有効になります（コンソールメッセージから確認できます）。これはバグです。*チェックボックスをオンにしたタイミングでも*、チャットが再接続されるように修正してください。

<Hint>

リンタを抑制している部分は常に疑いましょう。バグかもしれません。

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

リンタの抑制を解除すると、リントエラーが表示されます。問題は、`createConnection` が props であるため、リアクティブであることです。時間の経過とともに変化する可能性があります！（実際、変化します。親コンポーネントは、ユーザがチェックボックスをオンにしたときに `createConnection` プロパティに渡す関数を切り替えています。）これが依存配列に含めなければならない理由です。依存配列に追加してバグを修正しましょう。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

`createConnection` が依存値であることは正しいです。しかし、このコードは少し壊れやすくなっています。なぜなら、誰かが `App` コンポーネントを編集し、プロパティの値としてインライン関数を渡す可能性があるからです。その場合、`App` コンポーネントが再レンダーされるたびに異なる値が渡され、エフェクトが頻繁に再同期されてしまう可能性があります。これを避けるために、代わりに `isEncrypted` を渡してみましょう。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
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
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

このコードでは、`App` コンポーネントは関数ではなくブール値のプロパティを渡しています。そして、エフェクト内で、どちらの関数を利用するかを決定しています。`createEncryptedConnection` と `createUnencryptedConnection` はどちらもコンポーネント外で宣言されているため、リアクティブではありません。そのため、依存配列に指定する必要はありません。詳しくは、[エフェクトの依存関係を削除する](/learn/removing-effect-dependencies)を参照してください。

</Solution>

#### 連動する選択ボックスの作成 {/*populate-a-chain-of-select-boxes*/}

この例では、2 つの選択ボックスがあります。1 つ目の選択ボックスでは惑星を選択できます。2 つ目の選択ボックスでは*その惑星上の場所*を選択できますが、まだ機能していません。選択された惑星上の場所の名前を表示するようにしてください。

1 つ目の選択ボックスがどのように動作するか見てみましょう。これは `"/planets"` API の呼び出し結果を格納している `planetList` state 変数から作られています。現在選択されている惑星の ID は `planetId` state 変数で保持されています。`placeList` という state 変数に、`"/planets/" + planetId + "/places"` API の呼び出し結果を格納するには、どこにコードを追加すればよいでしょうか。

正しく実装すると、惑星を選択すると場所のリストが表示されます。惑星を変更すると、場所のリストも入れ替わります。

<Hint>

もし 2 つの独立した同期の処理がある場合は、2 つの別々のエフェクトに分割しましょう。

</Hint>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

このケースでは、2 つの独立した同期の処理があります。

- 最初の選択ボックスは、リモートの惑星リストと同期しています。
- 2 つ目の選択ボックスは、現在の `planetId` に対応するリモートの場所リストと同期しています。

そのため、それぞれを別々のエフェクトとして記述することが合理的でしょう。以下は、その例です。

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

このコードは少し冗長です。しかし、だからといって 1 つのエフェクトにまとめるのは良い方法ではありません！ もしまとめてしまうと、両方のエフェクトの依存配列を 1 つにまとめる必要があります。そうすると、惑星を変更しただけで、惑星リストが再取得されてしまいます。エフェクトはコードを再利用するためのツールではありません。

代わりに、以下の `useSelectOptions` のように、カスタムフックにロジックを抽出することで、繰り返しを減らすことができます。

<Sandpack>

```js App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

動作を確認するには、サンドボックスの `useSelectOptions.js` タブを確認してください。理想的には、アプリケーションに存在するエフェクトのほとんどは、コミュニティから提供されるカスタムフックか、自分で実装したカスタムフックに置き換えられるべきです。カスタムフックは同期ロジックを隠してくれるため、呼び出し元のコンポーネントがエフェクトのことを気にすることがなくなります。アプリケーションを開発していくうちに利用できるフックの選択肢が広がり、最終的にはコンポーネント内でエフェクトを書く必要はほとんどなくなるでしょう。

</Solution>

</Challenges>
