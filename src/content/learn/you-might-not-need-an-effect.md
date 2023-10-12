---
title: 'エフェクトは必要ないかもしれない'
---

<Intro>

エフェクトは React のパラダイムからの避難ハッチです。React の外に「踏み出して」、非 React ウィジェット、ネットワーク、またはブラウザ DOM などの外部システムと同期させることができるものです。外部システムが関与していない場合（例えば、props や state の変更に合わせてコンポーネントの state を更新したい場合）、エフェクトは必要ありません。不要なエフェクトを削除することで、コードが読みやすくなり、実行速度が向上し、エラーが発生しにくくなります。

</Intro>

<YouWillLearn>

* コンポーネントから不要なエフェクトを削除する理由と方法
* エフェクトを使わずに高価な計算をキャッシュする方法
* エフェクトを使わずにコンポーネントの state をリセットおよび調整する方法
* イベントハンドラ間でロジックを共有する方法
* イベントハンドラに移動すべきロジック
* 親コンポーネントに変更を通知する方法

</YouWillLearn>

## 不要なエフェクトの削除方法 {/*how-to-remove-unnecessary-effects*/}

エフェクトが不要な場合として一般的なのは次の 2 つのケースです。

* **レンダーのためのデータ変換にエフェクトは必要ありません**。例えば、表示する前にリストをフィルタリングしたいとします。リストが変更されたときに state 変数を更新するようなエフェクトを書きたくなるかもしれません。しかし、これは非効率的です。state を更新すると、React はまず、画面の表示内容を計算するためにコンポーネントの関数を呼び出します。次に、React はこれらの変更を DOM に ["コミット"](/learn/render-and-commit) して、画面を更新します。その後、React はエフェクトを実行します。ここであなたのエフェクトが*また*直ちに state を更新してしまうと、このプロセス全体が最初からやり直しになってしまいます！ 不要なレンダーを避けるために、コンポーネントのトップレベルですべてのデータを変換するようにしましょう。そのコードは、props や state が変更されるたびに自動的に再実行されます。
* **ユーザイベントの処理にエフェクトは必要ありません**。例えば、ユーザが製品を購入したときに `/api/buy` POST リクエストを送信し、通知を表示したいとします。購入ボタンのクリックイベントハンドラでは、何が起こったかが正確にわかります。エフェクトが実行される時点では、ユーザが*何をした*のか（例えば、どのボタンがクリックされたのか）はもうわかりません。したがって、通常は対応するイベントハンドラでユーザイベントを処理するべきです。

エフェクトは、外部システムと[同期](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)したい場合には*必要*です。例えば、React の state と jQuery ウィジェットを同期させるエフェクトを書くことができます。また、エフェクトでデータを取得し、例えば現在の検索クエリと検索結果を同期させることができます。ただし、モダンな[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)は、コンポーネント内で直接エフェクトを書くよりも効率的な組み込みデータ取得メカニズムを提供していることに注意してください。

正しい直観力を養うために、一般的かつ具体的な例をいくつか見ていきましょう！

### props または state に基づいて state を更新する {/*updating-state-based-on-props-or-state*/}

例えば、`firstName` と `lastName` の 2 つの state 変数を持つコンポーネントがあるとします。これらを連結して `fullName` を計算したいとします。となると、`firstName` または `lastName` が変更されたときに `fullName` を更新したくなるでしょう。直観的には、`fullName` という state 変数を追加して、エフェクトでそれを更新すればいいと思うかもしれません。

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

これは必要以上に複雑です。また、非効率的でもあります。古くなった `fullName` の値でレンダー処理を最後まで行った直後に、更新された値で再レンダーをやり直すことになります。state 変数とエフェクトを削除してください。

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: calculated during rendering
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**既存の props や state から計算できるものは、[state に入れないでください](/learn/choosing-the-state-structure#avoid-redundant-state)。代わりに、レンダー中に計算します**。これによりコードは（余分な「連動」更新処理が消えたことにより）高速になり、（コードを削減したことにより）簡潔になり、さらに（異なる state 変数が同期しなくなるバグを回避できたことにより）エラーも少なくなります。このアプローチになじみがない場合は、[React の流儀](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state)で state に入れるべきものを説明しています。

### 重たい計算のキャッシュ {/*caching-expensive-calculations*/}

このコンポーネントは、props で受け取った `todos` を、`filter` プロパティに従ってフィルタリングして `visibleTodos` を計算しています。計算結果を state に格納してエフェクトから更新するようにしたくなるかもしれません。

```js {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

前の例と同様に、これは不必要であり、かつ非効率的です。まず、state とエフェクトを削除します。

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

通常、このコードに問題はありません！ しかし、`getFilteredTodos()` が遅かったり、大量の `todos` があったりするかもしれません。そのような場合、`newTodo` のような無関係の state 変数が変更されたときに `getFilteredTodos()` の再計算を避けたくなるかもしれません。

重たい計算をキャッシュする（あるいは ["メモ化する (memoize)"](https://en.wikipedia.org/wiki/Memoization)）には、[`useMemo`](/reference/react/useMemo) フックでラップします。

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ Does not re-run unless todos or filter change
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

または、1 行で書くと：

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ Does not re-run getFilteredTodos() unless todos or filter change
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**これは、`todos` または `filter` のどちらかが変更されない限り、中の関数を再実行しないよう React に指示するものです**。React は初回レンダー時に `getFilteredTodos()` の返り値を覚えておきます。次回以降のレンダーでは、`todos` または `filter` が異なるかどうかをチェックします。前回と同じ場合、`useMemo` は最後に格納した結果を返します。異なる場合、React は再び中の関数を呼び出し、その結果を格納します。

[`useMemo`](/reference/react/useMemo) でラップする関数はレンダー中に実行されるため、[純粋 (pure) な計算](/learn/keeping-components-pure)に対してのみ機能します。

<DeepDive>

#### 計算コストが高いかどうかを見分ける方法 {/*how-to-tell-if-a-calculation-is-expensive*/}

一般的に、何千ものオブジェクトを作成したりループしたりしていない限り、おそらく高価ではありません。より確信を持ちたい場合は、コンソールログを追加して、コードの実行にかかった時間を計測することができます。

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

測定したいユーザ操作（例えば、入力フィールドへのタイプ）を実行します。その後、コンソールに `filter array: 0.15ms` のようなログが表示されます。全体のログ時間がかなりの量（例えば `1ms` 以上）になる場合、その計算をメモ化する意味があるかもしれません。実験として `useMemo` で計算をラップしてみて、その操作に対する合計時間が減少したかどうかをログで確認できます。

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // Skipped if todos and filter haven't changed
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` は*初回*レンダーを高速化しません。更新時に不要な作業をスキップするときにのみ役立ちます。

また、ほとんどの場合に、あなたが使っているマシンは、ユーザのマシンより高速に動作するであろうことを忘れてはいけません。そのため、意図的に処理速度を低下させてパフォーマンスをテストするのが良いでしょう。例えば、Chrome では [CPU スロットリング](https://developer.chrome.com/blog/new-in-devtools-61/#throttling)オプションが提供されています。

また、開発環境でのパフォーマンス測定では完全に正確な結果は得られないことに注意してください。（例えば、[Strict Mode](/reference/react/StrictMode) がオンの場合、各コンポーネントが 1 度ではなく 2 度レンダーされることがあります。）最も正確にパフォーマンスを計測するためには、アプリを本番環境用にビルドし、ユーザが持っているようなデバイスでテストしてください。

</DeepDive>

### props が変更されたときにすべての state をリセットする {/*resetting-all-state-when-a-prop-changes*/}

この `ProfilePage` コンポーネントは props として `userId` を受け取ります。ページにはコメント入力欄があり、その値を保持するために `comment` という state 変数を使用しています。ある日、問題に気付きました。あるプロフィールから別のプロフィールに移動しても、`comment` がリセットされないのです。その結果、うっかり別のユーザのプロフィールにコメントを投稿してしまいやすい状態になっています。この問題を解決するために、`userId` が変更されるたびに `comment` state 変数をクリアしたいと考えています。

```js {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Avoid: Resetting state on prop change in an Effect
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

これは非効率的です。なぜなら、`ProfilePage` とその子コンポーネントは、まず古くなった値でレンダーされ、その後再度レンダーされるからです。また、`ProfilePage` 内にある state を持つ*すべて*のコンポーネントでこれを行う必要があるため、複雑でもあります。例えば、コメント UI がネストされている場合、ネストされたコメントの state もクリアしたいでしょう。

こうする代わりに、各ユーザのプロフィールが概念的には*異なる*プロフィールであることを React に伝えることができます。コンポーネントを 2 つに分割し、外側のコンポーネントから内側のコンポーネントに `key` 属性を渡します：

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ This and any other state below will reset on key change automatically
  const [comment, setComment] = useState('');
  // ...
}
```

通常、React は同じコンポーネントが同じ場所でレンダーされるときに state を保持します。**`userId` を `Profile` コンポーネントの `key` として渡すことで、異なる `userId` を持つ 2 つの `Profile` コンポーネントを、state を共有すべきでない 2 つの異なるコンポーネントとして React に扱わせることができます**。（`userId` となるようセットした）key が変更されるたびに、React は DOM を再作成し、`Profile` コンポーネントとそのすべての子コンポーネントの [state をリセット](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key)します。これで、プロフィール間を移動するときに `comment` フィールドが自動的にクリアされるようになります。

この例では、外側の `ProfilePage` コンポーネントのみがプロジェクト内の他のファイルにエクスポートされ、表示されます。`ProfilePage` をレンダーするコンポーネントの側は、key を渡す必要はありません。代わりに、`userId` を通常の props として渡します。`ProfilePage` が内部の `Profile` コンポーネントにそれを `key` として渡していることは、実装の詳細です。

### props が変更されたときに一部の state を調整する {/*adjusting-some-state-when-a-prop-changes*/}

場合によっては、props が変更されたときに全部の state ではなく一部のみをリセットまたは調整したいことがあります。

この `List` コンポーネントは、`items` リストを props として受け取り、選択中のアイテムを `selection` という state 変数に保持します。`items` が異なる配列を受け取るたびに、`selection` を `null` にリセットしたいとします。

```js {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Avoid: Adjusting state on prop change in an Effect
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

これもやはり理想的ではありません。`items` が変更されるたびに、`List` とその子コンポーネントはまず既に古くなった `selection` の値でレンダーされてしまいます。その後、React は DOM を更新し、エフェクトを実行します。最後に、`setSelection(null)` の呼び出しによって、`List` とその子コンポーネントのレンダーがもう一度引き起こされ、このプロセス全体が繰り返されます。

まずはエフェクトを削除しましょう。代わりに、レンダー中に直接 state の調整を行います。

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Better: Adjust the state while rendering
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

このような[前回のレンダーからの情報を保存する](/reference/react/useState#storing-information-from-previous-renders)手法は理解しにくいかもしれませんが、エフェクトで同一の state を更新するよりはましです。上記の例では、`setSelection` はレンダー中に直接呼び出されます。React は `return` 文で終了した*直後に* `List` を再レンダーします。React はまだ `List` の子のレンダーや DOM の更新を行っていないので、これによって `List` の子が古くなった `selection` の値でレンダーされてしまうことを回避できます。

レンダー中にコンポーネントを更新すると、React は返り値の JSX を破棄して、すぐにレンダーを再試行します。非常に遅くなる連鎖的な再レンダーを避けるために、React はレンダー中に*同じ*コンポーネントの state を更新することしか許可していません。レンダー中に別のコンポーネントの state を更新すると、エラーが表示されます。無限ループを避けるために、`items !== prevItems` のような条件が必要です。このタイプの state 調整は大丈夫ですが、他のあらゆる副作用（DOM の変更やタイムアウトの設定など）は、イベントハンドラやエフェクトに書き、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)必要があります。

**このパターンはエフェクトよりも効率的ですが、ほとんどのコンポーネントではこれすらも必要ありません**。どのように行っても、props や他の state に基づいて state を調整すると、データフローが理解しにくくなり、デバッグが難しくなります。代わりに常に、[key ですべての state をリセット](#resetting-all-state-when-a-prop-changes)できないか、[レンダー中にすべてを計算](#updating-state-based-on-props-or-state)できないか、検討してください。例えば、選択された*アイテム*を保存（およびリセット）する代わりに、選択された*アイテム ID* を保存できます。

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Best: Calculate everything during rendering
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

こうすることでそもそも state を「調整」する必要がなくなります。選択された ID のアイテムがリストにある場合、選択されたままです。そうでない場合、レンダー中に計算される `selection` は、一致するアイテムが見つからないので `null` になります。挙動は変わっていますが、`items` が変わっても大抵はアイテムの選択が維持されるようになるため、むしろ良くなっていると言えるでしょう。

### イベントハンドラ間でのロジックの共有 {/*sharing-logic-between-event-handlers*/}

例えば、2 つのボタン（Buy と Checkout）がある商品ページがあり、どちらのボタンでもその商品を購入できるとします。ユーザが商品をカートに入れるたびに通知を表示したいとします。両方のボタンのクリックハンドラで `showNotification()` を呼び出すのは繰り返しに感じられるため、エフェクトにこのロジックを配置したくなるかもしれません。

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Avoid: Event-specific logic inside an Effect
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

このエフェクトは不要です。また、おそらくバグを引き起こすでしょう。例えば、アプリがページのリロード間でショッピングカートを「覚えている」としましょう。一度商品をカートに追加してページを更新すると、通知が再び表示されます。商品ページを更新するたびに通知が表示され続けます。これは、ページの読み込み時に `product.isInCart` がすでに `true` になっているため、上記のエフェクトが `showNotification()` を呼び出すからです。

**あるコードがエフェクトにあるべきか、イベントハンドラにあるべきかわからない場合は、そのコードが実行される*理由*を自問してください。コンポーネントがユーザに*表示されたために*実行されるべきコードにのみエフェクトを使用してください**。この例では、通知はユーザが*ボタンを押した*ために表示されるのであって、ページが表示されたためではありません！ エフェクトを削除し、両方のイベントハンドラから呼び出される新しい関数に共有ロジックを入れるようにしてください。

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Good: Event-specific logic is called from event handlers
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

これにより、不要なエフェクトが削除され、バグも修正されます。

### POST リクエストの送信 {/*sending-a-post-request*/}

この `Form` コンポーネントは、2 種類の POST リクエストを送信します。マウント時にはアナリティクスイベントを送信します。フォームに入力して送信ボタンをクリックしたときには、`/api/register` エンドポイントに POST リクエストを送信します。

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic should run because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Avoid: Event-specific logic inside an Effect
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

前の例と同じ基準を適用してみましょう。

アナリティクスの POST リクエストはエフェクトに残すべきです。これは、フォームが表示されたことがアナリティクスイベントを送信する理由だからです。（開発中に 2 回実行されますが、[こちら](/learn/synchronizing-with-effects#sending-analytics)で対処方法を参照してください。）

ただし、`/api/register` の POST リクエストは、フォームが*表示される*ことによって引き起こされるわけではありません。特定の瞬間、すなわちユーザがボタンを押した瞬間にのみリクエストを送信したいのです。リクエストは*その特定の操作時にだけ*発生するべきです。2 つ目のエフェクトを削除し、POST リクエストはイベントハンドラに移動しましょう。

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Good: This logic runs because the component was displayed
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Good: Event-specific logic is in the event handler
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

イベントハンドラとエフェクトのどちらにロジックを入れるべきか選択する際には、ユーザの観点から*それがどのようなロジックなのか*を自問自答するようにしましょう。そのロジックが特定のユーザ操作によって引き起こされる場合は、イベントハンドラに保持します。ユーザが画面上でコンポーネントを*見る*ことによって引き起こされる場合は、エフェクトに保持します。

### 計算の連鎖 {/*chains-of-computations*/}

時々、他の state に基づいて state の一部を調整するエフェクトを連結させたくなることがあります。

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

このコードには 2 つの問題があります。

1 つ目の問題は、非常に効率が悪いことです。コンポーネント（およびその子）は、連鎖内の各 `set` コールの間で毎回再レンダーする必要があります。上記の例では、最悪の場合、下位のツリーに 3 回の不要な再レンダー（`setCard` → レンダー → `setGoldCardCount` → レンダー → `setRound` → レンダー → `setIsGameOver` → レンダー）が発生することになります。

たとえこれが遅くなかったとしても、コードが発展するにつれ、書いた「チェイン」が新しい要件に適合しないケースが出てきます。例えばゲームの手順を遡る機能を追加しているとしましょう。このためには、各 state 変数を過去のある時点の値に再セットしていくことになります。しかし過去の値から `card` の state をセットした時点で再びエフェクトの連鎖処理がトリガされ、表示されるデータが変更されてしまいます。このようなコードは、硬直的で壊れやすいものです。

このような場合、レンダー中に計算できるものはそこで行い、イベントハンドラで state の調整を終わらせる方が良いでしょう。

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Calculate what you can during rendering
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Calculate all the next state in the event handler
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount <= 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

この方がはるかに効率的です。また、ゲームの履歴を表示する方法を実装する場合でも、各 state 変数を過去の手順の時点の値に設定できるようになり、エフェクトが連鎖して他のすべての state が勝手に書き換わるようなことを避けられます。複数のイベントハンドラ間でロジックを再利用する必要がある場合は、[関数を抽出](#sharing-logic-between-event-handlers)して、それらのハンドラから呼び出すことができます。

イベントハンドラ内では、[state はスナップショットのように振る舞う](/learn/state-as-a-snapshot)ことを思い返してください。例えば、`setRound(round + 1)` を呼び出した後でも、`round` 変数はユーザがボタンをクリックしたときの値を反映します。計算のために更新後の値が必要な場合は、`const nextRound = round + 1` のように手動で定義してください。

場合によっては、イベントハンドラ内で次の state を直接計算することができないことがあります。例えば、複数のドロップダウンがあるフォームで、前のドロップダウンの選択値によって次のドロップダウンの選択肢が変わるところを想像してください。その場合は、ネットワークとの同期が発生しているので、エフェクトを連鎖させることは適切です。

### アプリケーションの初期化 {/*initializing-the-application*/}

アプリが読み込まれるときに一度だけ実行されるべきロジックがあります。

それをトップレベルのコンポーネントのエフェクトに配置したくなるかもしれません。

```js {2-6}
function App() {
  // 🔴 Avoid: Effects with logic that should only ever run once
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

ですが、開発中にこれが [2 回実行される](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)ことにすぐ気付くことになるでしょう。これにより問題が発生することがあります。例えば、関数が 2 回呼び出されることを想定しておらず、認証トークンが無効になるかもしれません。一般的に、コンポーネントは再マウントに対応できるようにする必要があり、これにはトップレベルの `App` コンポーネントも含まれます。

本番環境では実際には再マウントされないにしても、すべてのコンポーネントで同じ制約に従うことで、コードの移動や再利用が容易になります。あるロジックが*コンポーネントのマウントごと*ではなく、*アプリのロードごとに* 実行される必要がある場合は、すでに実行されたかどうかを追跡するためのトップレベルの変数を追加します。

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Only runs once per app load
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

また、当該コードをモジュールの初期化中やアプリのレンダー前に実行することもできます。

```js {1,5}
if (typeof window !== 'undefined') { // Check if we're running in the browser.
   // ✅ Only runs once per app load
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

トップレベルのコードは、コンポーネントがインポートされたとき（仮にそれが一切レンダーされなかったとしても）に、一度だけ実行されます。コンポーネントをインポートする際の遅延や予期せぬ動作を避けるため、このパターンは過剰に使用しないでください。アプリ全体の初期化ロジックは、`App.js` のようなルートコンポーネントモジュールやアプリケーションのエントリーポイントに保持するようにしましょう。

### 親コンポーネントへの state 変更の通知 {/*notifying-parent-components-about-state-changes*/}

例えば、内部の `isOn` state が `true` または `false` になる `Toggle` コンポーネントを作成しているとします。トグルする方法は複数あります（クリックやドラッグなど）。`Toggle` の内部 state が変更されるたびに親コンポーネントに通知したいので、`onChange` イベントを公開し、エフェクトから呼び出しています。

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 Avoid: The onChange handler runs too late
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

先ほどと同様ですが、これも理想的ではありません。まず `Toggle` が state を更新し、React が画面を更新します。次に、React がエフェクトを実行し、親コンポーネントから渡された `onChange` 関数を呼び出します。すると親コンポーネントが自身の state を更新するので、一連のレンダー処理が新たにやり直しになります。すべてを 1 回の処理で行う方が良いでしょう。

エフェクトを削除し、代わりに同じイベントハンドラ内で*両方の*コンポーネントの state を更新します。

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Good: Perform all updates during the event that caused them
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

このアプローチであれば、`Toggle` コンポーネントとその親コンポーネントの両方がイベント中に state を更新します。React は、異なるコンポーネントからの更新を[バッチ処理](/learn/queueing-a-series-of-state-updates)するため、レンダー処理は 1 回だけになります。

または、state を完全に削除し、代わりに `isOn` を親コンポーネントから受け取ることもできるでしょう。

```js {1,2}
// ✅ Also good: the component is fully controlled by its parent
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["state をリフトアップする"](/learn/sharing-state-between-components) ようにすれば、親の state を切り替えることで親コンポーネントが `Toggle` を完全に制御できるようになります。これにより、親コンポーネントにはより多くのロジックが含まれることになりますが、全体として考える必要のある state が少なくなります。2 つの異なる state 変数を同期させたいと思ったら常に、代わりに state のリフトアップを試すようにしてください！

### 親にデータを渡す {/*passing-data-to-the-parent*/}

この `Child` コンポーネントは、データを取得し、それをエフェクト内で `Parent` コンポーネントに渡しています。

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Avoid: Passing data to the parent in an Effect
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

React では、データは親コンポーネントから子コンポーネントに流れます。画面上で何かおかしなことがあるときは、おかしな情報がどこから来るのかを調べるために、コンポーネントの繋がりを上にたどっていき、どのコンポーネントが間違った props を渡しているのか、あるいは間違った state を持っているのかを見つけます。ですが子コンポーネントがエフェクト内で親コンポーネントの state を更新していると、データの流れの追跡が非常に困難になってしまいます。子と親の両方が同じデータを必要としているのですから、親コンポーネントがそのデータを取得し、子に*渡す*ようにしましょう。

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Good: Passing data down to the child
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

これはよりシンプルであり、データは親から子へ流れるため予測可能なものになります。

### 外部ストアへのサブスクライブ {/*subscribing-to-an-external-store*/}

コンポーネントが React の状態の外にあるデータをサブスクライブ（subscribe, 購読）する必要があることがあります。データは、サードパーティ製のライブラリから来るかもしれませんし組み込みのブラウザ API から来るかもしれません。このデータは React の知らないところで変わる可能性があるため、コンポーネントが手動でサブスクライブする必要があります。これは例えば以下のように、よくエフェクトを使って行われます。

```js {2-17}
function useOnlineStatus() {
  // Not ideal: Manual store subscription in an Effect
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

ここでは、コンポーネントが外部データストア（この場合は、ブラウザの `navigator.onLine` API）にサブスクライブしています。この API はサーバー上には存在しない（サーバレンダリング用の初期 HTML には使用できない）ため、最初 state は `true` にセットされます。ブラウザ内のデータストアの値が変更されるたびに、コンポーネントは自身の state を更新します。

エフェクトを使うことも一般的ですが、React には外部ストアへサブスクライブする際に推奨される、専用のフックが用意されています。エフェクトを削除し、[`useSyncExternalStore`](/reference/react/useSyncExternalStore) の呼び出しに置き換えてください。

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

このアプローチにより、エフェクトを使って可変データを React の state に手動で同期させるよりも、エラーが発生しにくなります。通常、上記のような `useOnlineStatus()` のようなカスタムフックを作成して、個々のコンポーネントでこのコードを繰り返さなくて済むようにします。[React コンポーネントから外部ストアにサブスクライブする方法について詳しく読む](/reference/react/useSyncExternalStore)

### データのフェッチ {/*fetching-data*/}

多くのアプリでは、エフェクトを使ってデータのフェッチを開始します。データフェッチ用のエフェクトはよくこのように書かれます。

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Avoid: Fetching without cleanup logic
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

このフェッチは、イベントハンドラに移動する必要は*ありません*。

これは、イベントハンドラにロジックを入れる必要があったここまでの例と矛盾しているように思えるかもしれません。しかし、*タイピングというイベント*がデータのフェッチを行う理由だというわけではないことに留意しましょう。検索フィールドは URL から事前入力されることがよくありますし、ユーザは入力フィールドに触れずに戻る・進むといったナビゲーションを行うこともあります。

この `page` や `query` がどこから来たかのかは問題ではありません。このコンポーネントが表示されている間は `results` を、現在の `page` と `query` に対応するネットワークからのデータに[同期させる](/learn/synchronizing-with-effects)必要があるのです。だからこれはエフェクトであるべきだということです。

ただし、上記のコードにはバグがあります。例えば、素早く `"hello"` と入力すると、`query` は `"h"`、`"he"`、`"hel"`、`"hell"`、`"hello"` の順に変わります。これにより、別々のフェッチが開始されますが、レスポンスがどの順序で届くかについては何の保証もありません。例えば、`"hell"` のレスポンスが `"hello"` のレスポンスの*後*に届くかもしれません。それが最後に `setResults()` を呼び出すと、間違った検索結果が表示されることになります。これは ["競合状態 (race condition)"](https://en.wikipedia.org/wiki/Race_condition) と呼ばれるもので、2 つの異なるリクエストが予想外の順序で「競争」してしまうという現象です。

**競合状態を修正するには、[クリーンアップ関数を追加して](/learn/synchronizing-with-effects#fetching-data)古いレスポンスを無視する必要があります**。

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

これにより、エフェクトがデータを取得する際に、最後にリクエストしたもの以外のすべてのレスポンスが無視されます。

競合状態への対処がデータフェッチにまつわる唯一の問題というわけでもありません。レスポンスのキャッシュ（ユーザが「戻る」をクリックしたときに前の画面を即座に表示できるようにする）、サーバ上でのデータフェッチ（サーバレンダリングされた初期 HTML にフェッチされたコンテンツが含まれるようにする）、ネットワークのウォーターフォールの回避（子が親を待たずにデータを取得できるようにする）などが考慮すべき点です。

**これらは React だけでなく、あらゆる UI ライブラリで問題となるものです。これらは一筋縄では解決できないため、現代の[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)では、エフェクトでデータを取得するよりも効率的な組み込みデータ取得メカニズムが提供されています**。

フレームワークを使用しない（し独自に構築もしたくない）がエフェクトからのデータフェッチをより使いやすくしたい、という場合、以下の例のように、データフェッチのロジックをカスタムフックに抽出することを検討してください。

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
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
  }, [url]);
  return data;
}
```

また、エラー処理やコンテンツの読み込み状況を追跡するためのロジックを追加することも検討してください。このようなフックを自分で構築するか、React エコシステムで既に利用可能な多くのソリューションのいずれかを使用することができます。**これだけではフレームワークの組み込みデータフェッチメカニズムほど効率的にはなりませんが、データ取得ロジックをカスタムフックに移動しておけば、後で効率的なデータフェッチ戦略を採用することもより簡単になるでしょう**。

一般的に、エフェクトを書く必要がある場合は常に、上記の `useData` のように、より宣言的かつ目的に応じた API を持つカスタムフックに機能の一部を抽出でききないか、目を光らせるようにしてください。コンポーネント内の生の `useEffect` の呼び出しが少なければ少ないほど、アプリケーションのメンテナンスは容易になります。

<Recap>

- レンダー中に計算できるものであれば、エフェクトは必要ない。
- 重たい計算をキャッシュするには、`useEffect` の代わりに `useMemo` を追加する。
- コンポーネントツリー全体の state をリセットするには、異なる `key` を渡す。
- prop の変更に応じて一部の state をリセットする場合、レンダー中に行う。
- コンポーネントが*表示*されたために実行されるコードはエフェクトに、それ以外はイベントハンドラに入れる。
- 複数のコンポーネントの state を更新する必要がある場合、単一のイベントで行うことが望ましい。
- 異なるコンポーネントの state 変数を同期しようと思った際は、常に state のリフトアップを検討する。
- エフェクトでのデータフェッチは可能だが、競合状態を回避するためにクリーンアップを実装する必要がある。

</Recap>

<Challenges>

#### エフェクトなしでデータを変換 {/*transform-data-without-effects*/}

以下の `TodoList` は、todo のリストを表示します。"Show only active todos" チェックボックスにチェックが入っている間は、完了済みの todo はリストに表示されません。todo の表示状態には関係なく、フッターには未完了の todo の数が表示されます。

このコンポーネントから、不要な state とエフェクトをすべて削除して簡略化してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

レンダー中に何かを計算できる場合、それを更新する state やエフェクトは必要ありません。

</Hint>

<Solution>

この例では、本質的な state は、`todos` リストと、チェックボックスにチェックが入っているかどうかを示す `showActive` という state 変数の 2 つだけです。他のすべての state 変数は[冗長](/learn/choosing-the-state-structure#avoid-redundant-state)であり、レンダー中に計算することができます。さらに `footer` も、隣にある JSX に直接移動させることができます。

修正後の結果は以下のようになります。

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### エフェクトなしで計算結果をキャッシュ {/*cache-a-calculation-without-effects*/}

この例では、todo リストのフィルタ処理が `getVisibleTodos()` という独立した関数に抽出されています。この関数には、呼び出しがあったときに分かるよう `console.log()` が含まれています。"Show only active todos" を切り替えると、`getVisibleTodos()` が再実行されることに気付くでしょう。何を表示したいかを切り替えることで表示される todo リストは変わるので、これは期待通りの動作です。

あなたの課題は、`TodoList` コンポーネント内にある `visibleTodos` リストを再計算しているエフェクトを削除することです。ただし、入力フィールドへのタイプでは `getVisibleTodos()` が*再実行されない*ようにする（ログが表示されないようにする）必要があります。

<Hint>

1 つの解決策は、表示される todo 一覧をキャッシュするために `useMemo` を追加することです。また、気づきづらい解法がもう 1 つあります。

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

state 変数とエフェクトを削除し、代わりに `getVisibleTodos()` の呼び出し結果をキャッシュするための `useMemo` を追加します。

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

この変更により、`getVisibleTodos()` は `todos` または `showActive` が変更された場合にのみ呼び出されます。入力フィールドへのタイプでは `text` の state 変数のみが変更されるため、`getVisibleTodos()` の呼び出しはトリガされません。

また、`useMemo` を使わない別の解決策もあります。`text` state 変数は todo リストに影響を与えないので、`NewTodo` フォームを別コンポーネントに抽出し、`text` state 変数をその中に移動することができます。

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

このアプローチでも要件を満たしています。入力フィールドにタイプすると、`text` state 変数のみが更新されます。`text` state 変数は子コンポーネントである `NewTodo` コンポーネント内にあるため、親コンポーネントの `TodoList` は再レンダーされません。したがってタイプが起きても `getVisibleTodos()` は呼び出されません。（`TodoList` が別の理由で再レンダーされる場合は呼び出されます）。

</Solution>

#### エフェクトなしで state をリセット {/*reset-state-without-effects*/}

この `EditContact` コンポーネントは、`{ id, name, email }` という形をした連絡先オブジェクトを `savedContact` という props として受け取ります。名前とメールアドレスの入力フィールドを編集してみてください。Save を押すと、フォームの上にある連絡先のボタンが編集後の名前に更新されます。Reset を押すと、フォーム内の編集中の値は破棄されます。まずこの UI を操作して感覚をつかんでください。

上部のボタンで連絡先を選択すると、フォームがその連絡先に対応する詳細データにリセットされます。これは `EditContact.js` 内にあるエフェクトで行われています。このエフェクトを削除してください。`savedContact.id` が変更されたときにフォームをリセットする別の方法を見つけましょう。

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

`savedContact.id` が異なる場合は `EditContact` フォームは概念的には*別の連絡先のフォーム*なので、state を保持してはいけない、と React に伝える方法があるといいですね。そのような方法を覚えていませんか？

</Hint>

<Solution>

`EditContact` コンポーネントを 2 つに分割します。フォームの state をすべて内部の `EditForm` コンポーネントに移動します。外部の `EditContact` コンポーネントをエクスポートし、`savedContact.id` を内部の `EditForm` コンポーネントに `key` として渡します。その結果、内部の `EditForm` コンポーネントは、異なる連絡先が選択されるたびにフォームの state をすべてリセットし、DOM を再作成します。

<Sandpack>

```js App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### エフェクトなしでフォームを送信 {/*submit-a-form-without-effects*/}

この `Form` コンポーネントでは友達にメッセージを送れます。フォームを送信すると、`showForm` state 変数が `false` にセットされます。これにより、`sendMessage(message)` を呼び出すエフェクトがトリガされ、メッセージが送信されます（コンソールで確認できます）。メッセージが送信されると、"Thank you" 画面が表示され、"Open chat" ボタンでフォームに戻ることができます。

さて、あなたのアプリのユーザはあまりにも多くのメッセージを送信しています。チャットを少しやり辛くするために、フォームではなく*先に* "Thank you" 画面を表示することにしました。`showForm` state 変数を `true` ではなく `false` で初期化するように変更してください。そうするとすぐに、空のメッセージが送信された、とコンソールに表示されます。このロジックの何かが間違っています！

この問題の根本原因は何でしょうか？ どのように修正すればよいでしょうか？

<Hint>

ユーザが "Thank you" 画面を*見たから*メッセージが送信されるべきなのでしょうか？ 逆ではありませんか？

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

`showForm` state 変数が、フォームと "Thank you" 画面のどちらを表示するのか決定しています。ですが "Thank you" 画面が*表示されたから*メッセージを送信する、のではありませんね。ユーザが*フォームを送信したから*メッセージを送信したいのです。混乱の元となっているエフェクトを削除し、`sendMessage` の呼び出しを `handleSubmit` イベントハンドラの中に移動してください。

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

このバージョンでは、*フォームの送信*（これはイベントです）だけがメッセージを送信することに注意しましょう。`showForm` が最初に `true` に設定されているか `false` に設定されているかに関係なく、同じようにうまく動作します。（`false` に設定して、コンソールに余分なメッセージが表示されないことを確認しましょう。）

</Solution>

</Challenges>
