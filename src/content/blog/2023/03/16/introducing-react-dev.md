---
title: "react.dev のご紹介"
---

March 16, 2023 by [Dan Abramov](https://twitter.com/dan_abramov) and [Rachel Nabors](https://twitter.com/rachelnabors)

---

<Intro>

本日、React とそのドキュメントの新しいホームとなる [react.dev](https://react.dev) の立ち上げを発表することができ、大変うれしく思います。この記事では、新しいサイトの見どころをご紹介します。

</Intro>

---

## tl;dr {/*tldr*/}

* 新しい React サイト ([react.dev](https://react.dev)) では、関数コンポーネントとフックを用いて、モダンな React を学べます。
* 図解、イラスト、チャレンジ問題、そして 600 以上の新しいインタラクティブなサンプルが含まれています。
* これまでの React ドキュメントサイトは、[legacy.reactjs.org](https://legacy.reactjs.org) に移転しました。

## 新しいサイト、新しいドメイン、新しいホームページ {/*new-site-new-domain-new-homepage*/}

まずは少々事務的なところから。

新しいドキュメントの立ち上げを祝うために、そして何よりも、古いコンテンツと新しいコンテンツを明確に分離するために、より短い [react.dev](https://react.dev) ドメインに移行しました。古い [reactjs.org](https://reactjs.org) ドメインは、こちらのサイトにリダイレクトされるようになります。

古い React ドキュメントは、[legacy.reactjs.org](https://legacy.reactjs.org) にアーカイブされました。「ウェブを破壊」してしまわないよう、古いコンテンツへの既存のリンクは、すべてそちらへ自動的にリダイレクトされるようになっていますが、レガシーサイトへのアップデートはほぼ行われなくなります。

信じられないかもしれませんが、React はもうすぐ 10 歳になります。JavaScript 時間に換算すれば丸々 1 世紀のようなものです！ [React のホームページ](https://react.dev)をリフレッシュし、ユーザインターフェースを作成するために React が最適な方法であると私たちが考える理由を反映させました。また、スタートガイドも更新し、現代の React ベースのフレームワークにも目立つように言及しました。

まだ新しいホームページをご覧になっていない方は、ぜひチェックしてみてください！

## フックのあるモダン React に全面移行 {/*going-all-in-on-modern-react-with-hooks*/}

2018 年に React フック (hook) をリリースした際、フックのドキュメントはクラスコンポーネントに精通していることを前提としていました。これにより、コミュニティは非常に迅速にフックを採用することができましたが、しばらくすると古いドキュメントは新しい読者に対応できなくなりました。新しく React を学ぶ人は、クラスコンポーネントを使った学習とフックを使った学習の 2 回に分けて React を学ばなければなりませんでした。

**新しいドキュメントでは、最初からフックを用いて React を学びます**。ドキュメントは主に 2 つのセクションに分かれています。

* **[React を学ぶ](/learn)** は、ゼロから React を学ぶ自己学習型のコースです。
* **[API リファレンス](/reference)** では、すべての React API の詳細と使い方のサンプルが提供されています。

それぞれのセクションで見ることができる内容を詳しく見ていきましょう。

<Note>

フックが対応していないクラスコンポーネントの稀なユースケースが、まだわずかに存在します。クラスコンポーネントは引き続きサポートされており、新しいサイトの [レガシー API](/reference/react/legacy) セクションにドキュメントがあります。

</Note>

## クイックスタート {/*quick-start*/}

学習セクションは[クイックスタート](/learn)ページから始まります。これは React の短い紹介ツアーです。コンポーネント、props、state などの概念に対応する構文を紹介しますが、それらの使い方については詳しく説明していません。

実際にやりながら学ぶことが好きな方は、次に[三目並べのチュートリアル](/learn/tutorial-tic-tac-toe)をチェックしてください。React を使って小さなゲームを作る方法を説明しながら、毎日使うスキルを教えてくれます。以下が実際に作成するものです。

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

また、[React の流儀](/learn/thinking-in-react)についても特筆したいと思います。これが多くの人にとって React が「ピンとくる」きっかけとなったチュートリアルです。**これらの古典的なチュートリアルも、関数コンポーネントとフックを使用するものにアップデートされ**、新品同様となっています。

<Note>

上記のサンプルは*サンドボックス*となっています。サイト全体にたくさんのサンドボックスを追加しました。その数 600 個以上です！ どのサンドボックスも編集でき、右上隅の "Fork" ボタンを押すと別のタブで開くことができます。サンドボックスでは、React の API をすばやく試すことができ、アイデアの探求や、理解度のチェックができます。

</Note>

## React をステップバイステップで学ぶ {/*learn-react-step-by-step*/}

世界中の誰もが、無料で自分のペースで React を学ぶ機会があるようにしたいと考えています。

このため、学習セクションは章に分かれた自己学習型のコースのように構成されています。最初の 2 章では React の基本が説明されています。これから React を始める方、または記憶をリフレッシュしたい方は、こちらから始めてください：

- **[UI の記述](/learn/describing-the-ui)** では、コンポーネントを使って情報を表示する方法を学びます。
- **[インタラクティビティの追加](/learn/adding-interactivity)** では、ユーザ入力に応じて画面を更新する方法を学びます。

次の 2 つの章はより高度であり、やや難しいトピックについて深い洞察が得られるようになっています：

- **[state の管理](/learn/managing-state)** では、アプリの複雑性が増すにつれて、ロジックをどのように整理するかを学びます。
- **[避難ハッチ](/learn/escape-hatches)** では、React の「外に出る」方法と、どんなときにそれをする意味があるのかについて学びます。

各章はいくつかの関連するページで構成されています。これらのページのほとんどは、特定のスキルやテクニックを教えるためのものです。例えば、[JSX でマークアップを書く](/learn/writing-markup-with-jsx)、[state 内のオブジェクトを更新する](/learn/updating-objects-in-state)、[コンポーネント間で state を共有する](/learn/sharing-state-between-components)、などです。ページの中には、[レンダーとコミット](/learn/render-and-commit) や [スナップショットとしての state](/learn/state-as-a-snapshot) のような、概念を説明するものもあります。また、[そこに副作用は要らないかもしれない](/learn/you-might-not-need-an-effect) など、これまでの経験から得られた提案を共有するためのページもあります。

これらの章をこの順番で読む必要はありません。そんな時間がどこにあるでしょうか？ ですがそうしても構いません。学習セクションのページは、より前の段階で紹介された概念にのみ依存しています。本のように読みたい場合は、順番に読み進めてください！

### チャレンジ問題で理解度を確認する {/*check-your-understanding-with-challenges*/}

学習セクションのほとんどのページは、理解度を確認するためのいくつかのチャレンジ問題で終わります。例えば、[条件付きレンダー](/learn/conditional-rendering#challenges) に関するページでは、以下のようなチャレンジ問題がいくつか提供されています。

今すぐここで解いてみる必要はありません！ ただし*本当に*やりたい場合はどうぞ。

<Challenges>

#### `? :` を使って未梱包アイコンを表示 {/*show-an-icon-for-incomplete-items-with--*/}

条件演算子 (`cond ? a : b`) を使って、`isPacked` が `true` でない場合は ❌ をレンダーするようにしてください。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&` 演算子を使ったアイテムの重要度の表示 {/*show-the-item-importance-with*/}

この例では、それぞれの `Item` が数値型の `importance` プロパティを受け取ります。重要度が 0 以外の場合に限り、`&&` 演算子を使用して、斜体で "_(Importance: X)_" と表示するようにしてください。以下のような結果になるようにしましょう。

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

重要度を表示する場合は 2 つのテキストの間にスペースを入れることを忘れないでください！

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

以下のようにすれば動きます：

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance` が `0` の場合に `0` が結果として表示されてしまわないよう、`importance && ...` ではなく `importance > 0 && ...` と書く必要があることに注意してください。

この答えでは、名前と重要度ラベルの間にスペースを挿入するために、2 つの条件が使用されています。代わりに、先頭にスペースを入れたフラグメントを使用することができます: `importance > 0 && <> <i>...</i></>` あるいは、`<i>` の直接内側にスペースを追加することもできます: `importance > 0 && <i> ...</i>`。

</Solution>

</Challenges>

左下の角にある「答えを見る」ボタンに気付きましたか？ 自分でチェックしたい場合に便利です。

### 図解とイラストで直感を養う {/*build-an-intuition-with-diagrams-and-illustrations*/}

コードと言葉だけでは説明が難しかった場合、直感を養うための図解を追加しました。例えば以下は、[state の保持とリセット](/learn/preserving-and-resetting-state) にある図のひとつです。

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

`section` が `div` に変わると、`section` は削除され、新しい `div` が追加される

</Diagram>

ドキュメントの中にはイラストもいくつかあります。こちらは[ブラウザが画面を描画しているイラスト](/learn/render-and-commit#epilogue-browser-paint)となります：

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

ブラウザベンダに確認したところ、この描写は 100% 科学的に正確であるとのことです。

## 新しい、詳細な API リファレンス {/*a-new-detailed-api-reference*/}

[API リファレンス](/reference/react) では、すべての React API に専用のページが用意されています。これにはあらゆる種類の API が含まれます：

- 組み込みフックである [`useState`](/reference/react/useState) など。
- 組み込みコンポーネントである [`<Suspense>`](/reference/react/Suspense) など。
- 組み込みブラウザコンポーネントである [`<input>`](/reference/react-dom/components/input) など。
- フレームワーク向けの API である [`renderToPipeableStream`](/reference/react-dom/server/renderToReadableStream) など。
- その他の React API である [`memo`](/reference/react/memo) など。

各 API ページは少なくとも*リファレンス*と*使用法*の 2 つのセグメントに分かれていることに気付くでしょう。

[リファレンス](/reference/react/useState#reference)は、API の引数と戻り値をリストアップすることによって、正式な API シグネチャを説明します。簡潔ですが、その API に慣れていない場合は少し抽象的に感じることがあります。API が何をするのかは説明しますが、我々がどのように使用するのかは説明しません。

[使用法](/reference/react/useState#usage)では、実際にどのようにこの API を使用するのかを、同僚や友人が説明するような形で示します。これは、**React チームが各 API を使用するために意図した標準的なシナリオ**を示しています。色分けされたスニペット、異なる API を一緒に使用するサンプル、コピーペーストできるレシピも追加しました：

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### カウンタ（数値） {/*counter-number*/}

この例では、`count` state 変数が数値を保持しています。ボタンをクリックすると、それが増加します。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### テキストフィールド（文字列） {/*text-field-string*/}

この例では、`text` state 変数に文字列を保持しています。入力すると、`handleChange` がブラウザの入力 DOM 要素から最新の入力値を読み取り、`setText` を呼び出して state を更新します。これにより、現在の `text` を下に表示することができます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### チェックボックス（真偽値） {/*checkbox-boolean*/}

この例では、`liked` state 変数に真偽値を保持しています。入力をクリックすると、`setLiked` が `liked` state 変数を更新して、ブラウザのチェックボックス入力がチェックされた状態かどうか保存します。`liked` 変数は、チェックボックスの下にあるテキストをレンダーするために使用されます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### フォーム（2 つの変数） {/*form-two-variables*/}

同じコンポーネントで複数の state 変数を宣言することができます。それぞれの state 変数は完全に独立しています。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

一部の API ページには、（よくある問題に対する）[トラブルシューティング](/reference/react/useEffect#troubleshooting)や、（非推奨の API に対する）[代替手段](/reference/react-dom/findDOMNode#alternatives)のセクションも含まれています。

このアプローチにより、API リファレンスが引数を調べる手段としてだけでなく、その API を使用してどれだけ色々なことができるのか、他の API とどのように繋がっているのかを示す手段として役立つことを願っています。

## この次は？ {/*whats-next*/}

これで私たちのミニツアーは終了です！ 新しいウェブサイトを見て回り、好きな部分や嫌いな部分を見つけたら、これからも[匿名アンケート](https://www.surveymonkey.co.uk/r/PYRPF3X)や[イシュートラッカ](https://github.com/reactjs/reactjs.org/issues)にフィードバックを送ってください。

このプロジェクトのリリースまでに長い時間がかかってしまったことを認識しています。私たちは React コミュニティに読んでいただくに値する、高い品質のハードルを維持したかったのです。これらのドキュメントを書き、数々のサンプルを作っていくにあたり、私たちは自身のこれまでの説明が誤っていたことに気づき、React のバグを見つけ、さらには React の設計自体の不備を見つけて対処を始めたりすらしました。新しいドキュメントが、今後 React 自体の品質を一段階引き上げるのに役立つことを願っています。

ウェブサイトのコンテンツや機能を拡充するための要望を、既に皆さんから多数いただいています。例えば：

- すべての例に TypeScript バージョンを提供する
- パフォーマンス、テスト、アクセシビリティガイドの更新版を作成する
- React Server Components のドキュメント化を、既にこれをサポートするフレームワークのドキュメントとは独立して行う
- 国際コミュニティと協力して新しいドキュメントを翻訳する
- 新サイトに欠けている機能を追加する（例えば、このブログの RSS）

今回 [react.dev](https://react.dev/) が無事リリースされたことで、サードパーティの React 学習リソースに「追いつく」という目標から、新しい情報を追加して新しいウェブサイトをさらに改善することへと、焦点を移すことができるようになりました。

React を学ぶには、今がこれまでで最高のタイミングだと思います。

## 誰がこのプロジェクトに取り組んだのか？ {/*who-worked-on-this*/}

React チームでは、[Rachel Nabors](https://twitter.com/rachelnabors/) がプロジェクトをリードし（イラストも提供）、[Dan Abramov](https://twitter.com/dan_abramov) がカリキュラムをデザインしました。この 2 人が共同でほとんどのコンテンツを執筆しました。

もちろん、これほど大きなプロジェクトが少人数で進むことはありません。お礼を言いたい方がたくさんいます！

[Sylwia Vargas](https://twitter.com/SylwiaVargas) は、"foo/bar/baz" や猫を安易に使ったものではない、世界中の科学者・芸術家・都市をフィーチャーしたサンプルを作成しました。[Maggie Appleton](https://twitter.com/Mappletons) は、我々の落書きをクリアな図解にしました。

執筆の協力に感謝します：[David McCabe](https://twitter.com/mcc_abe)、[Sophie Alpert](https://twitter.com/sophiebits)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Andrew Clark](https://twitter.com/acdlite)、[Matt Carroll](https://twitter.com/mattcarrollcode)。アイディアとフィードバックを頂いた方に感謝します：[Natalia Tepluhina](https://twitter.com/n_tepluhina)、[Sebastian Markbåge](https://twitter.com/sebmarkbage)。

サイトデザインに感謝します：[Dan Lebowitz](https://twitter.com/lebo)。サンドボックスデザインに感謝します：[Razvan Gradinar](https://dribbble.com/GradinarRazvan)。

開発面では、プロトタイプ開発に感謝します：[Jared Palmer](https://twitter.com/jaredpalmer)。UI 開発のサポートに感謝します：[Dane Grant](https://twitter.com/danecando)、[Dustin Goodman](https://twitter.com/dustinsgoodman) ([ThisDotLabs](https://www.thisdot.co/))。サンドボックス統合に感謝します：[Ives van Hoorne](https://twitter.com/CompuIves)、[Alex Moldovan](https://twitter.com/alexnmoldovan)、[Jasper De Moor](https://twitter.com/JasperDeMoor)、[Danilo Woznica](https://twitter.com/danilowoz) ([CodeSandbox](https://codesandbox.io/))。開発やデザインの手直し、色づけや細かい部分の調整に感謝します：[Rick Hanlon](https://twitter.com/rickhanlonii)。サイトに新機能を追加し、メンテナンスしてくれる [Harish Kumar](https://www.strek.in/)と [Luna Ruan](https://twitter.com/lunaruan) に感謝します。

アルファテスト及びベータテストプログラムに参加してくださった皆さんに心から感謝します。皆さんの情熱と貴重なフィードバックによって、このドキュメントを形作ることができました。そして React Conf 2021 で自身の経験をもとに React ドキュメントについて語っていただいた、ベータテスタの [Debbie O'Brien](https://twitter.com/debs_obrien) に特別な感謝を送ります。

最後に、この取り組みの背後にあるインスピレーションを与えてくださった React コミュニティに感謝します。これを行っているのは皆さんがいるからです。新しいドキュメントが、皆さんの望むどのようなユーザインターフェースであっても、それを React で構築する際の手助けとなれば幸いです。

