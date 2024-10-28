---
title: コンポーネントとフックを純粋に保つ
---

<Intro>
純関数 (pure function) とは計算を行うだけで、それ以上のことはしない関数です。これによりコードの理解やデバッグが容易になり、React が自動的にコンポーネントとフックを最適化できるようになります。
</Intro>

<Note>
このリファレンスページで扱うのは高度なトピックです。あらかじめ[コンポーネントを純粋に保つ](/learn/keeping-components-pure)で説明されている概念に精通していることが必要です。
</Note>

<InlineToc />

### 純粋性が重要である理由 {/*why-does-purity-matter*/}

React を React たらしめる重要な概念のひとつが*純粋性 (purity)* です。純粋なコンポーネントやフックとは、以下のような特徴を持つものです。

* **冪等 (idempotent) であること** – 同じ入力で実行するたびに[常に同じ結果が得られる](/learn/keeping-components-pure#purity-components-as-formulas)こと。コンポーネントの入力とは props と state とコンテクスト。フックの入力とはその引数。
* **レンダー時に副作用がない** – 副作用 (side effect) を伴うコードは[**レンダーとは別に実行**](#how-does-react-run-your-code)する必要がある。例えばユーザが UI を操作しそれによって UI が更新される場合は[イベントハンドラ](/learn/responding-to-events)として、またはレンダー直後に動作させる場合は[エフェクト](/reference/react/useEffect)として実行する。
* **ローカルな値以外を変更しない**：コンポーネントとフックは、レンダー中に[ローカルに作成されたものではない値を決して変更してはならない](#mutation)。

レンダーが純粋に保たれていれば、React はどの更新を優先してユーザに最初に提示すべきか理解することができます。これができるのはレンダーの純粋性のお陰です。コンポーネントが[レンダー時](#how-does-react-run-your-code)に副作用を持たないなら、React は更新がそれほど重要でないコンポーネントのレンダー処理を一時停止し、後で必要になったときに再開できます。

具体的にはこれは、React がユーザに快適な体験を提供できるよう、レンダーのロジックが複数回実行されることがあるという意味です。しかしコンポーネントが[レンダー時](#how-does-react-run-your-code)に React が把握できない副作用、例えばグローバル変数の書き換えのようなことを行っている場合、React がレンダーコードを再実行した際にその副作用が望ましくない形でトリガされることになります。これはしばしば予期せぬバグを引き起こし、ユーザ体験を悪化させます。[「コンポーネントを純粋に保つ」のこちらの例](/learn/keeping-components-pure#side-effects-unintended-consequences)を参照してください。

#### React はどのようにコードを実行するのか {/*how-does-react-run-your-code*/}

React は宣言型 (declarative) です。あなたは*何 (what)* をレンダーしたいのかだけを React に伝え、それを*どうやって (how)* ユーザにうまく表示するのかについては React が考えます。これを実現するため、React は複数のフェーズに分けてコードを実行します。React を使いこなすためにこれらのフェーズすべてを知っておく必要はありません。しかしどのコードが*レンダー*中に実行され、どのコードがそれ以外のタイミングで実行されるのかについては、概要を知っておくべきです。

*レンダー*とは、UI の次のバージョンとして何が見えるべきかを計算する作業を指します。レンダーの後、[エフェクト](/reference/react/useEffect)が*フラッシュ (flush)*（つまり未処理分がなくなるまで実行）され、それらがレイアウトに影響を与える場合は計算の更新を行います。React はこの新しい計算結果を受け取り、UI の以前のバージョンを作成する際に使われた計算結果と比較し、最新バージョンに追いつくために必要な最小限の変更を [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)（ユーザが目にするもの）に*コミット (commit)* します。

<DeepDive>

#### コードがレンダー中に走るかどうか判断する方法 {/*how-to-tell-if-code-runs-in-render*/}

コードがレンダー中に走るかどうかを判断する簡単な方法は、そのコードがどこに書かれているかを見ることです。以下の例のようにトップレベルに書かれている場合、レンダー中に実行される可能性が高いでしょう。

```js {2}
function Dropdown() {
  const selectedItems = new Set(); // created during render
  // ...
}
```

イベントハンドラやエフェクトはレンダー中には実行されません。

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  const onSelect = (item) => {
    // this code is in an event handler, so it's only run when the user triggers this
    selectedItems.add(item);
  }
}
```

```js {4}
function Dropdown() {
  const selectedItems = new Set();
  useEffect(() => {
    // this code is inside of an Effect, so it only runs after rendering
    logForAnalytics(selectedItems);
  }, [selectedItems]);
}
```
</DeepDive>

---

## コンポーネントとフックを冪等にする {/*components-and-hooks-must-be-idempotent*/}

コンポーネントは、その入力である props、state、およびコンテクストに対して常に同じ出力を返さなければなりません。これを*冪等性 (idempotency)* と呼びます。[冪等性](https://en.wikipedia.org/wiki/Idempotence)は関数型プログラミングで広まった用語であり、同じ入力でそのコードを実行するたびに[常に同じ結果が得られる](learn/keeping-components-pure)という考え方を指します。

これは、[レンダー](#how-does-react-run-your-code)中に実行される*あらゆる*コードは冪等でなければならないという意味です。例えば以下のコードは冪等ではありません（したがって、コンポーネントも冪等ではありません）。

```js {2}
function Clock() {
  const time = new Date(); // 🔴 Bad: always returns a different result!
  return <span>{time.toLocaleString()}</span>
}
```

`new Date()` は常に現在の日時を返し、呼び出すたびに結果が変わるため、冪等ではありません。上記のコンポーネントをレンダーすると、画面に表示される時間はコンポーネントがレンダーされた瞬間の時間に固定されます。同様に、`Math.random()` のような関数も冪等ではありません。なぜなら、入力が同じでも呼び出すたびに異なる結果を返すからです。

これは、`new Date()` のような冪等ではない関数を*絶対に*使用してはならないという意味ではありません。[レンダー](#how-does-react-run-your-code)中にだけは使用できないということです。上記の場合、最新の日付をこのコンポーネントと*同期*するために、[エフェクト](/reference/react/useEffect)が使用できます。

<Sandpack>

```js
import { useState, useEffect } from 'react';

function useTime() {
  // 1. Keep track of the current date's state. `useState` receives an initializer function as its
  //    initial state. It only runs once when the hook is called, so only the current date at the
  //    time the hook is called is set first.
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    // 2. Update the current date every second using `setInterval`.
    const id = setInterval(() => {
      setTime(new Date()); // ✅ Good: non-idempotent code no longer runs in render
    }, 1000);
    // 3. Return a cleanup function so we don't leak the `setInterval` timer.
    return () => clearInterval(id);
  }, []);

  return time;
}

export default function Clock() {
  const time = useTime();
  return <span>{time.toLocaleString()}</span>;
}
```

</Sandpack>

非冪等な `new Date()` の呼び出しをエフェクトでラップすることで、その計算を[レンダーの外側](#how-does-react-run-your-code)に移動させているのです。

React と外部状態を同期する必要がなく、ユーザの操作に応じて更新を行うだけの場合は、[イベントハンドラ](/learn/responding-to-events)の使用を考慮してください。

---

## 副作用はレンダーの外で実行する {/*side-effects-must-run-outside-of-render*/}

[副作用](/learn/keeping-components-pure#side-effects-unintended-consequences)は[レンダー中](#how-does-react-run-your-code)に実行してはいけません。React が最適なユーザ体験のためにコンポーネントを複数回レンダーする可能性があるためです。

<Note>
副作用 (side effect) とはエフェクト (Effect) よりも広い概念を指す用語です。エフェクトとは `useEffect` でラップされるコードのみを指す用語であり、副作用とは呼び出し元に値を返すこと以外に観察可能な影響を及ぼすコード全般のことを指す、一般的な用語です。

副作用は通常、[イベントハンドラ](/learn/responding-to-events)やエフェクトの中に書かれます。レンダーの中には決して書いてはいけません。
</Note>

レンダーは純粋に保つ必要がある一方で、アプリが何か面白いことをするためには、いずれかの時点で副作用が必要です。これには画面に何かを表示することも含まれます！ このルールの大事なところは、副作用は[レンダー時](#how-does-react-run-your-code)に起きてはならない、ということです。React がコンポーネントを複数回レンダーすることがあるからです。大抵の場合、副作用は[イベントハンドラ](learn/responding-to-events)を使用して処理します。イベントハンドラを使用することで、そのコードはレンダー中に実行しなくてよいと React に明示的に伝えていることになり、レンダーが純粋に保たれます。他の選択肢がない場合に最後の手段としてのみ、`useEffect` を使用して副作用を処理することもできます。

### 書き換えを行ってもよいタイミング {/*mutation*/}

#### ローカルミューテーション {/*local-mutation*/}
副作用の一般的な例はミューテーション (mutation) です。JavaScript では、これは非[プリミティブ](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)値の内容を書き換えることを指します。一般的に React では変数の書き換えを避けるべきですが、*ローカル*変数のミューテーション (local mutation) はまったく問題ありません。

```js {2,7}
function FriendList({ friends }) {
  const items = []; // ✅ Good: locally created
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // ✅ Good: local mutation is okay
  }
  return <section>{items}</section>;
}
```

ローカルミューテーションを避けるために無理にコードを変える必要はありません。[`Array.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) を使用して短く書くこともできますが、[レンダー時](#how-does-react-run-your-code)にローカル配列を作成してアイテムを push していくのでも何ら問題ありません。

`items` を書き換えているように見えますが、このコードは*ローカルでのみ*そうしているという点が重要です。コンポーネントの再レンダー時にこの書き換えは「記憶」されていません。言い換えると、`items` はコンポーネントの実行の最中にのみ存在します。`<FriendList />` がレンダーされるたびに `items` は*再作成*されるので、コンポーネントは常に同じ結果を返します。

一方で、`items` がコンポーネントの外部で作成されている場合、以前の値を保持しつづけることで、変更の記憶が起きてしまいます。

```js {1,7}
const items = []; // 🔴 Bad: created outside of the component
function FriendList({ friends }) {
  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    items.push(
      <Friend key={friend.id} friend={friend} />
    ); // 🔴 Bad: mutates a value created outside of render
  }
  return <section>{items}</section>;
}
```

`<FriendList />` が再実行されると、このコンポーネントが実行されるたびに `friends` を `items` に追加し続け、結果の重複が生じます。この `<FriendList />` には[レンダー](#how-does-react-run-your-code)時に外部から観測可能な副作用があり、そのため**ルールに違反**しているというわけです。

#### 遅延初期化 {/*lazy-initialization*/}

厳密には「純粋」ではありませんが、遅延初期化 (lazy initialization) は問題ありません。

```js {2}
function ExpenseForm() {
  SuperCalculator.initializeIfNotReady(); // ✅ Good: if it doesn't affect other components
  // Continue rendering...
}
```

#### DOM の書き換え {/*changing-the-dom*/}

ユーザに直接見えるような副作用は、React コンポーネントのレンダーロジックでは許可されていません。言い換えると、単にコンポーネント関数を呼び出すこと自体が、画面上の変化を生じさせてはいけません。

```js {2}
function ProductDetailPage({ product }) {
  document.title = product.title; // 🔴 Bad: Changes the DOM
}
```

<<<<<<< HEAD
`window.title` を更新するという望ましい結果をレンダーの外で達成する方法のひとつは、[`window` とコンポーネントを同期させる](/learn/synchronizing-with-effects)ことです。
=======
One way to achieve the desired result of updating `document.title` outside of render is to [synchronize the component with `document`](/learn/synchronizing-with-effects).
>>>>>>> eb174dd932613fb0784a78ee2d9360554538cc08

コンポーネントを複数回呼び出しても安全であり、他のコンポーネントのレンダーに影響を与えないのであれば、React はそれが厳密な関数型プログラミングの意味で 100% 純粋であるかどうかを気にしません。より重要なのは、[コンポーネントは冪等でなければならない](/reference/rules/components-and-hooks-must-be-pure)ということです。

---

## props と state はイミュータブル {/*props-and-state-are-immutable*/}

コンポーネントの props と state はイミュータブルな[スナップショット](learn/state-as-a-snapshot)です。これらは決して直接書き換えてはいけません。代わりに新しい props を渡すか、`useState` のセッタ関数を使用してください。

props と state の値は、レンダーが終わってから更新されるスナップショットと考えることができます。したがって props や state 変数を直接書き換えることはありません。代わりに新しい props を渡すか、あるいはセッタ関数を使用して React に state をコンポーネントの次回レンダー時に更新する必要があると伝えます。

### props を書き換えない {/*props*/}
props はイミュータブルです。props を変更すると、アプリケーションが一貫性のない出力を生成し、状況によって動作したりしなかったりするためデバッグが困難になるからです。

```js {2}
function Post({ item }) {
  item.url = new Url(item.url, base); // 🔴 Bad: never mutate props directly
  return <Link url={item.url}>{item.title}</Link>;
}
```

```js {2}
function Post({ item }) {
  const url = new Url(item.url, base); // ✅ Good: make a copy instead
  return <Link url={url}>{item.title}</Link>;
}
```

### state を書き換えない {/*state*/}
`useState` は state 変数とその state を更新するためのセッタ関数を返します。

```js
const [stateVariable, setter] = useState(0);
```

state 変数はその場で書き換えるのではなく、`useState` によって返されるセッタ関数を使用して更新する必要があります。state 変数の中身を書き換えてもコンポーネントが更新されるわけではないため、ユーザに古くなった UI が表示されたままになります。セッタ関数を使用することで、state が変更され、UI を更新するため再レンダーをキューに入れる必要があるということを React に伝えます。

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    count = count + 1; // 🔴 Bad: never mutate state directly
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

```js {5}
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1); // ✅ Good: use the setter function returned by useState
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

---

## フックの引数と返り値はイミュータブル {/*return-values-and-arguments-to-hooks-are-immutable*/}

一度値がフックに渡されたならそれを書き換えてはいけません。JSX の props と同様、フックに渡された時点でその値はイミュータブルです。

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  if (icon.enabled) {
    icon.className = computeStyle(icon, theme); // 🔴 Bad: never mutate hook arguments directly
  }
  return icon;
}
```

```js {3}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);
  const newIcon = { ...icon }; // ✅ Good: make a copy instead
  if (icon.enabled) {
    newIcon.className = computeStyle(icon, theme);
  }
  return newIcon;
}
```

React における重要な原則のひとつは、*ローカル・リーズニング*、つまりコンポーネントやフックが何をしているのかそのコードだけを見て理解できることです。フックを呼び出す際には中身を「ブラックボックス」として扱うべきです。例えば、カスタムフックが引数を内部で値をメモ化するための依存値として使用していたらどうでしょう。

```js {4}
function useIconStyle(icon) {
  const theme = useContext(ThemeContext);

  return useMemo(() => {
    const newIcon = { ...icon };
    if (icon.enabled) {
      newIcon.className = computeStyle(icon, theme);
    }
    return newIcon;
  }, [icon, theme]);
}
```

フックの引数を書き換えた場合、カスタムフック内のメモ化が正しく動作しなくなります。これを避けることが重要です。

```js {4}
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon.enabled = false;               // Bad: 🔴 never mutate hook arguments directly
style = useIconStyle(icon);         // previously memoized result is returned
```

```js {4}
style = useIconStyle(icon);         // `style` is memoized based on `icon`
icon = { ...icon, enabled: false }; // Good: ✅ make a copy instead
style = useIconStyle(icon);         // new value of `style` is calculated
```

同様に、フックからの返り値はメモ化されている可能性があるため、それらを書き換えないことも重要です。

---

## JSX に渡された値はイミュータブル {/*values-are-immutable-after-being-passed-to-jsx*/}

JSX で使用された後に値を書き換えてはいけません。ミューテーションは JSX が作成される前に行ってください。

式として JSX を使用する際、React はコンポーネントのレンダーが完了する前に JSX を先行して評価してしまうかもしれません。つまり JSX に渡された後で値を変更した場合、React がコンポーネントの出力を更新する必要があることを認識しないため、古い UI が表示され続ける可能性があるということです。

```js {4}
function Page({ colour }) {
  const styles = { colour, size: "large" };
  const header = <Header styles={styles} />;
  styles.size = "small"; // 🔴 Bad: styles was already used in the JSX above
  const footer = <Footer styles={styles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```

```js {4}
function Page({ colour }) {
  const headerStyles = { colour, size: "large" };
  const header = <Header styles={headerStyles} />;
  const footerStyles = { colour, size: "small" }; // ✅ Good: we created a new value
  const footer = <Footer styles={footerStyles} />;
  return (
    <>
      {header}
      <Content />
      {footer}
    </>
  );
}
```
