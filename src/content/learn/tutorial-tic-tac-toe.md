---
title: 'チュートリアル：三目並べ'
---

<Intro>

このチュートリアルでは、小さな三目並べゲームを作成します。このチュートリアルでは、既存の React の知識は前提としていません。チュートリアルで学ぶ技術は、React アプリを構築する際の基本であり、これを完全に理解することで、React について深い理解が得られます。

</Intro>

<Note>

このチュートリアルは、**実践しながら学ぶ**ことを好む方や、すぐに何か実際に作ってみたいと考えている方向けに設計されています。一つずつ概念を学びたい場合は、[UI の記述](/learn/describing-the-ui)から始めてください。

</Note>

チュートリアルはいくつかのセクションに分かれています。

- [チュートリアルのセットアップ](#setup-for-the-tutorial)では、チュートリアルを進めるための**出発点**を提供します。
- [概要](#overview)では、React の**基本事項**であるコンポーネント、プロパティ、およびステートを学びます。
- [ゲームの完成](#completing-the-game)では、React 開発で**最も一般的な手法**を学びます。
- [時間旅行の追加](#adding-time-travel)では、React の独自の強みに**深い洞察**を得ることができます。

### 何を作成していますか？ {/*what-are-you-building*/}

このチュートリアルでは、React を使ってインタラクティブな三目並べゲームを作成します。

完成したときにどのような見た目になるかは、以下で確認できます。

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

まだコードが理解できない、またはコードの構文に慣れていない場合でも、心配はいりません！ このチュートリアルの目標は、React とその構文を理解することを助けることです。

まずは、チュートリアルを続ける前に、上記の三目並べゲームを確認することをお勧めします。ゲームのボードの右側にある番号付きリストが目立つ機能の１つで、このリストはゲームで発生したすべての手順の履歴を示し、ゲームが進むにつれて更新されます。

完成した三目並べゲームで遊んでみた後は、スクロールを続けてください。このチュートリアルでは、よりシンプルなテンプレートから始めます。次のステップは、ゲームを作成を始められるように準備することです。

## チュートリアルのセットアップ {/*setup-for-the-tutorial*/}

下のライブコードエディタで、右上にある **Fork** をクリックして、CodeSandbox のウェブページを新しいタブで開きます。CodeSandbox はブラウザ上でコードを書くことができ、作成したアプリがユーザーにどのように表示されるかをプレビューできます。新しいタブには空の四角と、このチュートリアルのスターターコードが表示されるはずです。

<Sandpack>

```js App.js
export default function Square() {
  return <button className="square">X</button>;
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

<Note>

このチュートリアルは、ローカル開発環境でも進めることができます。そのためには、以下の手順が必要です。

1. [Node.js](https://nodejs.org/en/) をインストール
1. 先に開いた CodeSandbox のタブで、左上のコーナーボタンを押してメニューを開き、そのメニューで **File > Export to ZIP** を選択して、ファイルをローカルにアーカイブとしてダウンロード
1. アーカイブを解凍し、ターミナルを開いて解凍したディレクトリに `cd`
1. `npm install` で依存関係をインストール
1. `npm start` でローカルサーバーを起動し、ブラウザで実行中のコードを確認するためにプロンプトに従う

うまくいかない場合でも、途中で挫けずにオンラインで進めて、後で再度ローカル環境の設定を試してください。

</Note>

## 概要 {/*overview*/}

セットアップが完了したので、React の概要を確認してみましょう！

### スターターコードの確認 {/*inspecting-the-starter-code*/}

CodeSandbox では、以下の3つの主要なセクションが表示されます。

![CodeSandbox のスターターコード](../images/tutorial/react-starter-code-codesandbox.png)

1. `App.js`、`index.js`、`styles.css` などのファイルリストや `public` というフォルダがある _ファイル_ セクション
1. 選択したファイルのソースコードが表示される _コードエディタ_ 
1. 書いたコードがどのように表示されるかがわかる _ブラウザ_ セクション

_ファイル_ セクションで `App.js` ファイルが選択されているはずです。そのファイルの内容は _コードエディタ_ に以下のように表示されているはずです。

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_ブラウザ_ セクションでは、以下のように X で埋められた四角が表示されているはずです。

![x-filled square](../images/tutorial/x-filled-square.png)

さて、スターターコードのファイルを見てみましょう。

#### `App.js` {/*appjs*/}

`App.js` のコードは、_コンポーネント_ を作成します。React では、コンポーネントとは UI の一部を表す再利用可能なコードのことです。コンポーネントは、アプリケーションの UI 要素をレンダーし、管理し、更新するために使用されます。それでは、コンポーネントの中身を 1 行ずつ見ていって、何が起こっているかを確認しましょう。

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

最初の行では、`Square` という関数を定義しています。`export` の JavaScript キーワードは、この関数をこのファイルの外部からアクセスできるようにします。 `default` キーワードは、このコードを使用する他のファイルに、このファイルのメイン関数であることを伝えます。

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

2 行目では、ボタンが返されます。`return` の JavaScript キーワードは、その後に続くものが関数の呼び出し元に値として返されることを意味します。`<button>` は *JSX 要素* です。JSX 要素とは、何を表示したいかを記述する JavaScript コードと HTML タグの組み合わせです。`className="square"` はボタンのプロパティ、または *prop* で、CSS がボタンのスタイルをどのように設定するかを伝えます。`X` はボタンの内部に表示されるテキストで、`</button>` は JSX 要素を閉じ、次の内容がボタンの内部に配置されないことを示します。

#### `styles.css` {/*stylescss*/}

CodeSandbox の _Files_ セクションにある `styles.css` というファイルをクリックしてください。このファイルでは、React アプリのスタイルが定義されています。最初の 2 つの _CSS セレクタ_（`*` と `body`）は、アプリケーションの大部分のスタイルを定義し、`.square` セレクタは、`className` プロパティが `square` に設定されているコンポーネントのスタイルを定義します。あなたのコードでは、それは `App.js` ファイルの Square コンポーネントのボタンに一致します。

#### `index.js` {/*indexjs*/}

CodeSandbox の _Files_ セクションにある `index.js` というファイルをクリックしてください。このチュートリアルでは、このファイルを編集することはありませんが、`App.js` ファイルで作成したコンポーネントと Web ブラウザとの橋渡しを行います。

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

1〜5 行目では、必要なすべての部品がまとめられています。

* React
* Web ブラウザとやり取りするための React のライブラリ（React DOM）
* コンポーネントのスタイル
* `App.js` で作成したコンポーネント。

ファイルの残りの部分では、すべての要素をまとめて、最終的な成果物を `public` フォルダ内の `index.html` に注入しています。

### 盤面の作成 {/*building-the-board*/}

それでは `App.js` に戻りましょう。ここでチュートリアルの残りを過ごします。

現在の盤面はただ 1 つのマスしかありませんが、9 つ必要です！単純にマスをコピー＆ペーストして、このように 2 つのマスを作ろうとすれば：

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

このエラーが表示されます：

<ConsoleBlock level="error">

/src/App.js: 隣接する JSX 要素は、包括タグでラップする必要があります。あなたは JSX イレガメフラグメント `<>...</>` を求めましたか？

</ConsoleBlock>

React コンポーネントでは、ボタンのような複数の隣接する JSX 要素ではなく、単一の JSX 要素を返す必要があります。これを修正するには、以下のように複数の隣接する JSX 要素を *フラグメント*（`<>` および `</>`）でラップできます。

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

これで以下のように表示されるはずです：

![二つの x で埋められたマス](../images/tutorial/two-x-filled-squares.png)

素晴らしいです！これでマスを数回コピー＆ペーストして 9 つのマスを追加するだけで…

![一列に並んだ 9 つの x で埋められたマス](../images/tutorial/nine-x-filled-squares.png)

あれ？ 盤面のマスは、1 行ではなくグリッドに並べたいのですが。これを修正するには、`div` を使ってマスを行単位にまとめ、CSS クラスを追加する必要があります。それと同時に、各マスに番号をつけて、どこに表示されているのか確認できるようにします。

`App.js` ファイルで、`Square` コンポーネントを以下のように更新してください：

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

`styles.css` で定義された CSS は、`className` が `board-row` の div をスタイル化します。スタイル化された `div` でコンポーネントを行にまとめることで、三目並べの盤面ができました。

![1 から 9 までの数字で埋められた三目並べの盤面](../images/tutorial/number-filled-board.png)

しかし、今度は別の問題が出てきました。`Square` という名前のコンポーネントは、実際にはもう四角ではありません。そのため、名前を `Board` に変更して修正しましょう。

```js {1}
export default function Board() {
  //...
}
```

これで、コードは次のようになるはずです。

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
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

<Note>

ちょっとタイピングが大変ですよね！このページからコードをコピー＆ペーストしても問題ありません。ただし、自分で一度は手入力してみたものだけをコピーすることをおすすめします。

</Note>

### props を通してデータを渡す {/*passing-data-through-props*/}

次に、ユーザーがクリックした際に、空のマスを "X" に変更したいと思います。これまでに作成したボードの方法では、9回（各マスに1回ずつ）マスを更新するコードをコピー＆ペーストする必要があります！しかし、コピー＆ペーストをする代わりに、React のコンポーネントアーキテクチャを使って、再利用可能なコンポーネントを作成することで、コードの重複や無秩序が回避できます。

まず、`Board` コンポーネントから最初のマスを定義する行 (`<button className="square">1</button>`) をコピーし、新しい `Square` コンポーネントに貼り付けます。

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

次に、`Board` コンポーネントを更新して、JSX 構文を使用して `Square` コンポーネントをレンダーします。

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

ブラウザの `div` とは異なり、自分で作成したコンポーネント `Board` と `Square` は大文字で始める必要があることに注意してください。

どのようになるか見てみましょう。

![one-filled board](../images/tutorial/board-filled-with-ones.png)

あれ？ 先ほどまでの番号付きのマスがなくなってしまいました。今度は全てのマスに "1" という表示がされています。これを修正するために、各マスが持つべき値を、親コンポーネント（`Board`）から子コンポーネント（`Square`）に伝えるために、*props* を使用します。

`Square`コンポーネントを更新して、`Board`から渡される`value`プロップを読み取ります。

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })`は`Square`コンポーネントに`value`という名前のプロップが渡されることを示しています。

これで、各マスに `value` を表示させることができます。次のようにしてみましょう。

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

おっと、これは意図したものではありません。

![value-filled board](../images/tutorial/board-filled-with-value.png)

コンポーネントから `value` という JavaScript の変数をレンダーさせたかったのではなく、「value」という単語そのものを表示させたかったわけではありません。JSX から JavaScript に 「エスケープ」するためには、波括弧が必要です。JSX の中で `value` の周りに波括弧を追加してみましょう。

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

現在、空のボードが表示されているはずです。

![空のボード](../images/tutorial/empty-board.png)

これは、`Board` コンポーネントが、それぞれの `Square` コンポーネントに `value` プロパティを渡していないからです。`Board`コンポーネントがレンダーする各 `Square` コンポーネントに `value` プロパティを追加することで、これを修正します。

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

これで、再び数値のグリッドが表示されるようになりました：

![1 から 9 までの数字で埋められたチックタックトーのボード](../images/tutorial/number-filled-board.png)

更新されたコードは、以下のようになるはずです:

<Sandpack>

```js App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
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

### 対話型コンポーネントの作成 {/*making-an-interactive-component*/}

`Square` コンポーネントをクリックすると `X` が表示されるようにしてみましょう。`Square` の中に `handleClick` という関数を宣言します。次に、`Square` から返される button JSX 要素のプロパティに `onClick` を追加します。

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('clicked!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

今、クリックしてみると、CodeSandbox の _Browser_ セクションの下部にある _Console_ タブに `"clicked!"` というログが表示されるはずです。複数回クリックすると、再び `"clicked!"` がログに表示されます。同じメッセージで繰り返しコンソールにログが表示されることはありません。代わりに、最初の `"clicked!"` ログの隣にインクリメントされるカウンターが表示されます。

<Note>

このチュートリアルをローカルの開発環境で実施している場合は、ブラウザのコンソールを開く必要があります。例えば、Chrome ブラウザを使っている場合は、**Shift + Ctrl + J**（Windows / Linux）または **Option + ⌘ + J**（macOS）のキーボードショートカットでコンソールを表示できます。

</Note>

次のステップとして、`Square` コンポーネントがクリックされたことを "記憶" し、"X" マークで埋めるようにしたいと思います。 "記憶" するために、コンポーネントは *状態（state）* を使用します。

React は、`useState` という特別な関数を提供しており、コンポーネントからこれを呼び出すことで "記憶" を行わせることができます。`Square` の現在の値を状態に保存し、`Square` がクリックされたときに値を変更しましょう。

ファイルの先頭で `useState` をインポートします。`Square` コンポーネントから `value` プロパティを削除します。代わりに、`Square` の先頭に新しい行を追加して `useState` を呼び出します。これで、`value` という名前の state 変数が返されるようにします。

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` は値を格納し、`setValue` は値を変更するために使える関数です。`useState` に渡される `null` は、この state 変数の初期値として使用されます。つまり、ここでの `value` は最初は `null` に等しくなります。

`Square` コンポーネントがもう props を受け取らなくなったので、`Board` コンポーネントが作成したすべての9つの `Square` コンポーネントから `value` プロパティを削除します。

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

次に、`Square` をクリックすると "X" が表示されるように変更します。「console.log("clicked!");」イベントハンドラを `setValue('X');` に置き換えます。これで、`Square` コンポーネントは次のようになります。

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

この `set` 関数を `onClick` ハンドラから呼び出すことで、`Square` の `<button>` がクリックされるたびに React に再レンダーを要求しています。更新後、`Square` の `value` は `'X'` になるので、ゲームボード上に "X" が表示されるようになります。「Square」のいずれかをクリックすると "X" が表示されます。

![盤面に "X" の追加](../images/tutorial/tictac-adding-x-s.gif)

各 Square には独自の状態があります：それぞれの Square に格納されている `value` は、他のものとは完全に独立です。コンポーネントの `set` 関数を呼び出すと、React は自動的に内部の子コンポーネントも更新します。

上記の変更を行った後、コードは次のようになります。

<Sandpack>

```js App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
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

### React Developer Tools {/*react-developer-tools*/}

React DevTools は、React コンポーネントの props や state を確認することができます。CodeSandboxのブラウザセクションの下部にある React DevTools タブで見つけることができます：

![CodeSandbox 内の React DevTools](../images/tutorial/codesandbox-devtools.png)

画面上の特定のコンポーネントを調べるには、React DevTools の左上角のボタンを使用してください。

![React DevTools でページ上のコンポーネントを選択する](../images/tutorial/devtools-select.gif)

<Note>

ローカル開発用に、React DevTools は [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)、[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)、そして [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) ブラウザの拡張機能として利用できます。インストールすると、React を利用しているサイトで *コンポーネント* タブがブラウザの開発者ツールに表示されるようになります。

</Note>

## ゲームの完成 {/*completing-the-game*/}

この時点で、三目並べゲームの基本的な構築ブロックがすべて揃いました。完成したゲームを作るためには、盤上に交互に "X" と "O" を置くための方法と、勝者を決めるための方法が必要です。

### 状態を持ち上げる {/*lifting-state-up*/}

現在、各 `Square` コンポーネントはゲームの状態の一部を保持しています。三目並べゲームで勝者を確認するためには、`Board` が 9 つの `Square` コンポーネントそれぞれの状態を何らかの形で知る必要があります。

どのようなアプローチが良いでしょうか？最初に思いつくのが、`Board` が各 `Square` の状態を "問い合わせる" 必要があるでしょうか。このアプローチは React では技術的に可能ですが、コードが理解しにくくなり、バグが発生しやすくなり、リファクタリングが困難になるため、この方法はお勧めしません。代わりに、各 `Square` ではなく親の `Board` コンポーネントにゲームの状態を保持させるのが最善です。`Board` コンポーネントは、各 `Square` に表示するものを伝えるために、数字を各 `Square` に渡したように、prop を渡して伝えることができます。

**複数の子コンポーネントからデータを収集する場合や、2 つの子コンポーネント同士で連携する場合は、共有される状態を親コンポーネントに宣言します。親コンポーネントはその状態を子コンポーネントに prop 経由で渡すことができます。これにより、子コンポーネントが相互に同期され、親とも同期されるようになります。**

React のコンポーネントがリファクタリングされる際に、状態を親コンポーネントに持ち上げることがよくあります。

この機会に試してみましょう。`Board` コンポーネントを編集して、9 つの null に対応する 9 つの配列をデフォルト値として持つ `squares` という名前の状態変数を宣言します。

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` は、9つの要素を持つ配列を作成し、それぞれの要素を `null` に設定します。それを囲む `useState()` コールは、最初にその配列に設定された `squares` 状態変数を宣言します。配列の各エントリは、正方形の値に対応します。後でボードを埋めるときに、`squares` 配列は次のようになります。

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

これで、`Board` コンポーネントがそれがレンダリングする各 `Square` に `value` プロップを渡す必要があります。

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

次に、`Square` コンポーネントを編集して、`value` プロップを `Board` コンポーネントから受け取るようにします。これには、`Square` コンポーネント自身の `value` の状態管理と、ボタンの `onClick` プロップを削除する必要があります。

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

この時点で、空の三目並べのボードが表示されるはずです：

![空のボード](../images/tutorial/empty-board.png)

また、コードは以下のようになります。

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
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

これで、各 Square は `'X'` 、`'O'`、または空の正方形に対して `null` のいずれかの `value` プロップを受け取るようになります。

次にやるべきことは、「Square」がクリックされたときに何が起こるかを変更することです。`Board` コンポーネントは現在、どの正方形が埋まっているかを管理しています。`Square` から `Board` の状態を直接更新することはできません。

代わりに、`Board` コンポーネントから `Square` コンポーネントに関数を渡し、`Square` が正方形がクリックされたときにその関数を呼び出すようにします。クリックされたときに `Square` コンポーネントが呼び出す関数から始めましょう。その関数を `onSquareClick` と呼びます。

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

次に、`onSquareClick` 関数を `Square` コンポーネントのプロパティに追加します。

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

次に、`onSquareClick` プロパティを、`Board` コンポーネント内の `handleClick` という名前の関数に接続します。`onSquareClick` を `handleClick` に接続するには、最初の `Square` コンポーネントの `onSquareClick` プロパティに関数を渡します:

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

最後に、`squares` 配列を更新するための `Board` コンポーネント内に `handleClick` 関数を定義します:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

`handleClick` 関数は、`slice()` 配列メソッドを使って `squares` 配列のコピー（`nextSquares`）を作成します。次に、`handleClick` は、最初の（`[0]` インデックスの）四角形に `X` を追加するために `nextSquares` 配列を更新します。

`squares` 配列の内容が更新されると React でコンポーネントの状態が変更されていることがわかります。これにより、`squares` ステートを使用しているコンポーネント（`Board`）およびその子コンポーネント（盤を構成する `Square` コンポーネント）が再レンダーされます。

<Note>

JavaScript は[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)をサポートしているため、内側の関数（例：`handleClick`）は外側の関数（例：`Board`）で定義されている変数や関数にアクセスできます。`handleClick` 関数は、`squares` ステートを読み取り、`setSquares` メソッドを呼び出すことができます。これは、両方とも `Board` 関数の内部で定義されているためです。

</Note>

これで、盤に X を追加することができますが... 左上の四角形にしか追加できません。`handleClick` 関数は、左上の四角形（`0`）のインデックスを更新するためにハードコードされています。`handleClick` を更新して任意の四角形を更新できるようにしましょう。`handleClick` 関数に、更新する四角形のインデックスを指定する引数 `i` を追加します:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

次に、その `i` を `handleClick` に渡す必要があります。`handleClick(0)` を JSX で直接 `Square` の `onSquareClick` プロパティに設定しようとするかもしれませんが、うまくいかないでしょう。

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

これがうまくいかない理由は次のとおりです。`handleClick(0)` の呼び出しは、ボード コンポーネントのレンダリングの一部となります。`handleClick(0)` が `setSquares` を呼び出してボード コンポーネントの状態を変更するため、ボード コンポーネント全体が再レンダリングされます。しかし、これにより `handleClick(0)` が再度実行され、無限ループに陥ります：

<ConsoleBlock level="error">
 
再レンダリングが多すぎます。React は、無限ループを防ぐためにレンダリング回数を制限します。

</ConsoleBlock>

なぜこの問題が以前には発生しなかったのでしょう？

`onSquareClick={handleClick}` を渡していたときは、プロップとして `handleClick` 関数を渡していました。呼び出してはいませんでした！しかし、今はその関数をすぐに*呼び出して*います。`handleClick(0)` の括弧に注目してください。だから先に実行されるのです。ユーザがクリックするまで、`handleClick` を呼び出したくないのです！

これを解決する方法として、`handleClick(0)` を呼び出す `handleFirstSquareClick` のような関数を作成したり、`handleClick(1)` を呼び出す `handleSecondSquareClick` のような関数を作成することができます。これらの関数を `onSquareClick={handleFirstSquareClick}` のようにプロップとして渡す（呼び出さない）。これにより無限ループが解決されます。

しかし、9つの異なる関数を定義し、それぞれに名前を付けるのは冗長です。代わりに、次のようにしましょう：

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

新しい `() =>` 構文に注目してください。ここで `() => handleClick(0)` はアロー関数と呼ばれる、関数を定義する短い方法です。Square がクリックされると、`=>`  "arrow" の後のコードが実行され、`handleClick(0)` が呼び出されます。

次に、他の8つのスクエアを更新して、渡したアロー関数から `handleClick` を呼び出すようにします。`handleClick` の各呼び出しの引数が、正しいスクエアのインデックスに対応していることを確認してください。

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
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
};
```

これで、ボード上の任意のスクエアにXを追加することができます：

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

しかし、今回は状態管理がすべて `Board` コンポーネントによって行われています！

あなたのコードは、以下のようになるべきです：

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

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
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

状態管理が `Board` コンポーネントに移動されたので、親の `Board` コンポーネントは子の `Square` コンポーネントに props を渡して、正しく表示できるようになります。`Square` をクリックすると、子の `Square` コンポーネントが親の `Board` コンポーネントにボードの状態を更新するように要求します。`Board` の状態が変更されると、`Board` コンポーネントとそれぞれの子の `Square` が自動的に再レンダーされます。すべての `squares` の状態を `Board` コンポーネントに保持しておくことで、将来的に勝者が決定できるようになります。

ユーザーがボードの左上の四角をクリックして `X` を追加した場合に何が起こるのかをまとめてみましょう。

1. 左上の四角をクリックすると、`button` が `onClick` prop として受け取った関数が実行されます。`Square` コンポーネントはその関数を `Board` から `onSquareClick` prop として受け取りました。`Board` コンポーネントはその関数を JSX の中で直接定義しています。引数 `0` で `handleClick` を呼び出します。
1. `handleClick` は引数 `0` を使って、`squares` 配列の最初の要素を `null` から `X` に更新します。
1. `Board` コンポーネントの `squares` 状態が更新されたので、`Board` とそのすべての子が再レンダリングされます。これにより、インデックス `0` の `Square` コンポーネントの `value` prop が `null` から `X` に変更されます。

最後にユーザーは、クリック後に左上の四角が空から `X` に変更されたことが分かります。

<Note>

DOM の `<button>` 要素の `onClick` 属性は、React にとって特別な意味があります。これは、組み込みのコンポーネントだからです。`Square` のようなカスタムコンポーネントの場合、名前は自由に決めることができます。`Square` の `onSquareClick` prop や `Board` の `handleClick` 関数に任意の名前を付けても、コードは同じように動作します。React では、イベントを表す props には `onSomething` という名前を使い、それらのイベントを処理する関数定義には `handleSomething` という名前を使うことが一般的です。

</Note>

### なぜイミュータビリティが重要なのか {/*why-immutability-is-important*/}

`handleClick` 内で `squares` 配列を変更せずに `.slice()` を使ってコピーを作成する方法について、その理由を説明するために、不変性と、なぜ不変性を学ぶことが重要であるかについて議論する必要があります。

データを変更する方法は一般的に 2 つのアプローチがあります。1 つ目のアプローチは、データの値を直接変更することで _ミューテート（変更）_ する方法です。2 つ目のアプローチは、望ましい変更が施された新しいコピー（クローン）のデータで元のデータを置換する方法です。以下は、`squares` 配列をミューテート（変更）する場合にどのようになるかを示しています。

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

そして、以下は、`squares` 配列を変更せずにデータを変更する場合にどのようになるかを示しています。

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

結果は同じですが、直接（基盤となる）データを変更しないことで、いくつかの利点を得ることができます。

不変性は、複雑な機能をはるかに簡単に実装することができます。このチュートリアルの後半で、ゲームの履歴を確認して過去の手に "ジャンプバック" できる "タイムトラベル" 機能を実装することになります。この機能はゲームに特有のものではありません - アクションの取り消しややり直しが可能なアプリケーションでは一般的な要件です。直接的なデータミューテーションを避けることで、過去のデータのバージョンを壊すことなく保持し、後で再利用することができます。

不変性には、もう1つの利点があります。親コンポーネントの状態が変更されると、デフォルトで子コンポーネントは自動的に再レンダーされます。変更によって影響を受けていない子コンポーネントも含まれます。再レンダー自体はユーザーに気付かれないものですが（積極的に避ける必要はありません！）、パフォーマンス上の理由から、影響を受けていないと明らかなツリーの一部の再レンダリングをスキップしたい場合があります。不変性により、コンポーネントがデータが変更されたかどうかを比較することが非常に安価になります。React がコンポーネントの再レンダリングをいつ行うかについての詳細は、[`memo` API の参照](/reference/react/memo)を参照してください。

### ターン交代 {/*taking-turns*/}

さて、この三目並べゲームで重大な欠陥を解決する時がきました：「O」がボード上にマークされません。

まず最初の手をデフォルトで "X" に設定します。これを追跡するために、Board コンポーネントの状態にもう1つ追加しましょう：

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

プレイヤーが移動するたびに、`xIsNext`（ブール型）が反転して次のプレイヤーが決まり、ゲームの状態が保存されます。`Board` の `handleClick` 関数を更新して `xIsNext` の値を反転させましょう：

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

これで、異なるマスをクリックすると `X` と `O` が交互に表示されるようになりました！

しかし、問題があります。同じマスを何度もクリックしてみてください：

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

`X` が `O` に上書きされてしまいます！これはゲームに非常に興味深い展開をもたらすかもしれませんが、今のところはオリジナルのルールを守りましょう。

マスに `X` や `O` をマークする際に、まずそのマスに既に `X` や `O` の値があるかどうかをチェックしていません。これを *早期リターン* で修正できます。マスに既に `X` や `O` があるかどうかを確認し、マスが既に埋まっている場合は `handleClick` 関数で早期に `return` します。これにより、ボードの状態を更新しようとする前にリターンされます。

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

これで空いているマスにだけ `X` や `O` を追加できるようになりました！ここまでのコードは以下のようになります。

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
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

### 勝者の宣言 {/*declaring-a-winner*/}

プレイヤーが交互に手を打てるようになったので、勝利が決まった際やこれ以上ターンを進められない状態を表示することが求められます。これを実現するために、`calculateWinner` という9つのマスの配列を受け取り、勝者をチェックして `'X'`、`'O'`、または `null` を返すヘルパー関数を追加します。`calculateWinner` 関数についてはあまり気にしないでください。これは React 特有のものではありません。

```js App.js
export default function Board() {
  //...
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
    [2, 4, 6]
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

<Note>

`calculateWinner` を `Board` の前後のどちらで定義しても問題ありません。コンポーネントを編集するたびにスクロールしないように、これを最後に置きましょう。

</Note>

`Board` コンポーネントの `handleClick` 関数で `calculateWinner（squares）` を呼び出して、プレイヤーが勝ったかどうかをチェックします。これは、ユーザーがすでに `X` や `O` があるマスをクリックしたかどうかをチェックするタイミングで実行できます。どちらのケースでも早期にリターンしたいです。

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

ゲームが終了したことをプレイヤーに知らせるために、「勝者：X」や「勝者：O」といったテキストを表示できます。それには、`Board` コンポーネントに `status` セクションを追加します。ステータスは、ゲームが終了した場合に勝者を表示し、ゲームが続いている場合は、次にどちらのプレイヤーの番かを表示します。

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

おめでとうございます！ これで、動作する三目並べのゲームができました。そして、React の基本も学びました。だからこそ、_あなた_ こそが本当の勝者です。 ここでのコードは以下のようになっています:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
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

## タイムトラベルの追加 {/*adding-time-travel*/}

最後の演習として、ゲームの過去の手に「戻る」ことができるようにしましょう。

### 手の履歴を保持する {/*storing-a-history-of-moves*/}

`squares` 配列を変更した場合、タイムトラベルの実装は非常に困難になります。

しかし、各手ごとに `slice()` を使って `squares` 配列の新しいコピーを作成し、それをイミュータブルとして扱いました。これにより、過去のすべての `squares` 配列のバージョンを保存し、すでに発生したターン間を移動することができます。

過去の `squares` 配列を `history` という別の配列に保存します。そして、新しい状態変数として `history` を保持します。この `history` 配列は、最初の手から最後の手までのすべてのボード状態を表しており、以下のような形状になります。

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### 再び状態のリフトアップ {/*lifting-state-up-again*/}

過去の手のリストを表示する新しいトップレベルのコンポーネント `Game` を作成します。ここに、ゲーム履歴全体を含む `history` 状態を配置します。

`history` 状態を `Game` コンポーネントに配置することで、子の `Board` コンポーネントから `squares` の状態を削除できます。`Square` コンポーネントから `Board` コンポーネントに状態を「リフトアップ」したのと同じように、`Board` からトップレベルの `Game` コンポーネントに状態をリフトアップすることになります。これにより、`Game` コンポーネントは `Board` のデータを完全に制御し、`history` から過去のターンを `Board` にレンダーさせることができます。

まず、`export default` を使って `Game` コンポーネントを追加し、`Board` コンポーネントと一部のマークアップをレンダーしてみましょう。

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

`function Board() {` 宣言の前にある `export default` キーワードを削除し、`function Game() {` 宣言の前に追加することに注意してください。これにより、`index.js` ファイルは `Board` コンポーネントの代わりに `Game` コンポーネントをトップレベルのコンポーネントとして使用するように指示されます。`Game`コンポーネントが返す追加の `div` は、後でボードに追加するゲーム情報のためのスペースを確保しています。

次に、`Game` コンポーネントに次のプレイヤーと手順の履歴を追跡するためのステートを追加します。

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

`[Array(9).fill(null)]` がシングルアイテムの配列を持ち、その自体が 9 つの `null` の配列であることに注意してください。

現在の手順のマスをレンダーするには、`history` から最後のマスの配列を読み取る必要があります。これに `useState` は必要ありません。レンダリング中に計算するだけの情報がすでにあります。

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

次に、`Game` コンポーネント内に、ゲームを更新するために `Board`コンポーネントから呼ばれる `handlePlay` 関数を作成します。`xIsNext` 、`currentSquares` 、そして `handlePlay` を `Board` コンポーネントに props として渡します。

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

`Board` コンポーネントが受け取る props によって完全に制御されるようにしましょう。`Board` コンポーネントを変更して、3 つの props`xIsNext` 、`squares` 、そして、プレイヤーが手を打ったときに更新されたマスの配列で `Board` が呼ぶことができる新しい `onPlay` 関数を受け取るようにします。次に、`useState` を呼び出す `Board` 関数の最初の 2 行を削除します。

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

次に、`Board` コンポーネント内の `handleClick` で `setSquares` と `setXIsNext` の呼び出しを、新しい `onPlay` 関数への単一の呼び出しに置き換えます。これにより、ユーザーがマスをクリックしたときに、`Game` コンポーネントが `Board` を更新できるようになります。

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

`Board` コンポーネントは、`Game` コンポーネントが渡す props によって完全に制御されています。ゲームを再び動作させるために、`Game` コンポーネントの `handlePlay` 関数を実装する必要があります。

`handlePlay` が呼び出されたときに何をすべきでしょうか？ Board は以前 `setSquares` を更新された配列で呼び出していましたが、今では更新された `squares` 配列を `onPlay` に渡しています。

`handlePlay` 関数は `Game` の状態を更新して再レンダーをトリガーする必要がありますが、もう `setSquares` 関数を呼び出すことはできません。これは `history` 状態変数を使って情報を保存しているからです。更新された `squares` 配列を新しい履歴エントリとして `history` に追加することで、`history` を更新したいと思います。また、Board が行っていたように `xIsNext` を切り替えることも求められます:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

ここで、`[...history, nextSquares]` は、`history` のすべての要素と、その後に続く `nextSquares` を含む新しい配列を作成します。(`...history` は「`history` のすべての項目を列挙する」と読めます_[*スプレッド構文*](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax)。)

例えば、`history` が `[[null,null,null], ["X",null,null]]` で `nextSquares` が `["X",null,"O"]` の場合、新しい `[...history, nextSquares]` 配列は `[[null,null,null], ["X",null,null], ["X",null,"O"]]` になります。

この時点で、状態を `Game` コンポーネントに移動させ、UI はリファクタリング前と同様に完全に動作するようになっているはずです。ここでのコードは以下のようになります。

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
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

### 過去の手の表示 {/*showing-the-past-moves*/}

三目並べのゲームの履歴を記録しているので、プレーヤーに過去の手のリストを表示することができます。

React 要素（`<button>` など）は普通の JavaScript オブジェクトです。アプリケーションでそれらを渡すことができます。React で複数のアイテムをレンダーするには、React 要素の配列を使うことができます。

すでに状態の `history` 手の配列があるので、それを React 要素の配列に変換する必要があります。JavaScript では、配列を別の配列に変換するには、[配列の `map` メソッド:](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map) を使うことができます。

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

画面上のボタンを表す React 要素に変換するために、`history` の「手」を `map` で操作します。Game コンポーネントで `history` をマップしてみましょう。

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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
```

下のようにコードをすると、「Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.」というエラーが開発者ツールのコンソールに表示されることがわかります。次のセクションでこのエラーを修正します。

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
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

`map` に渡される関数の内部で `history` 配列を反復処理すると、`squares` 引数が `history` の各要素を返し、 `move` 引数が配列のインデックス `0`, `1`, `2`, … を返します。（ほとんどの場合、実際の配列要素が必要になりますが、手のリストをレンダーするにはインデックスのみが必要です。）

三目並べゲームの履歴内の各手について、ボタン `<button>` が含まれるリスト項目 `<li>` を作成します。ボタンには、まだ実装していない `jumpTo` という関数を呼び出す `onClick` ハンドラがあります。

現時点では、ゲームの手の一覧と開発者ツールのコンソールのエラーが表示されるはずです。次に、「key」エラーについて説明します。

### キーの選択 {/*picking-a-key*/}

リストをレンダーすると、React は各レンダーされたリスト項目について情報を保存します。リストを更新すると、React は何が変更されたかを判断する必要があります。リストのアイテムを追加、削除、並べ替え、更新することができました。

次のような状態から

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

以下に遷移すると想像してください。

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

更新されたカウントに加えて、これを読む人はおそらく Alexa と Ben の順序を入れ替えて Claudia を Alexa と Ben の間に挿入したと言うでしょう。ただし、React はコンピュータプログラムであり、あなたが意図したことを知ることはできませんので、リストの各項目を区別するために、それぞれのリスト項目に _キー_ プロパティを指定する必要があります。データがデータベースから取得されている場合、Alexa、Ben、Claudia のデータベース ID をキーとして使用できます。

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

リストが再レンダーされると、React は各リスト項目のキーを取得し、前回のリストの項目で一致するキーを検索します。現在のリストに以前に存在しなかったキーがある場合、React はコンポーネントを作成します。現在のリストに、前回のリストに存在したキーがない場合、React は前回のコンポーネントを破棄します。2つのキーが一致した場合、対応するコンポーネントが移動されます。

キーは、各コンポーネントの識別に関する React の情報です。これにより、Re-render の間に状態を維持することができます。コンポーネントのキーが変更されると、コンポーネントは破棄され、新しい状態で再作成されます。

`key` は React の特別で予約されたプロパティです。要素が作成されるとき、React は `key` プロパティを抽出し、返された要素のキーを直接格納します。 `key` がプロパティとして渡されるように見えますが、React は自動的に `key` を使用してどのコンポーネントを更新するかを決定します。親コンポーネントが指定した `key` をコンポーネントがリクエストする方法はありません。

**動的なリストを作成する際には、適切なキーを割り当てることを強くお勧めします。** 適切なキーがない場合は、データの再構築を検討してください。

キーが指定されていない場合、React はエラーを報告し、デフォルトで配列のインデックスをキーとして使用します。配列のインデックスをキーとして使用することは、リストの項目を並べ替えたり、挿入・削除したりする際に問題が生じます。明示的に `key={i}` を渡すと、エラーは消えますが、配列のインデックスと同じ問題があり、ほとんどの場合お勧めできません。

キーはグローバルに一意である必要はなく、コンポーネントとその兄弟間で一意であれば十分です。

### タイムトラベルの実装 {/*implementing-time-travel*/}

三目並べゲームの履歴では、過去の各手番に一意の ID が関連付けられています。手番の連続した数字です。手番は再オーダーされたり、削除されたり、途中に挿入されることはないため、手番のインデックスをキーとして使用することは安全です。

`Game` 関数では、`<li key={move}>` としてキーを追加できます。これで、レンダリングされたゲームをリロードすると、React の "key" エラーが消えるはずです。

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
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

`jumpTo` を実装する前に、`Game` コンポーネントが現在のユーザが見ているステップを追跡できるようにしておく必要があります。これを行うために、`currentMove` という名前の新しい状態変数を定義し、デフォルト値を `0` に設定します：

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

次に、`Game` 内の `jumpTo` 関数を更新して、`currentMove` を更新します。`currentMove` を変更する数値が偶数の場合は、`xIsNext` を `true` に設定します。

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

次に、マスをクリックしたときに呼ばれる `Game` の `handlePlay` 関数を2つ変更します。

- 過去に戻ってからその地点から新しい手を打つ場合、その地点までの履歴を維持したいだけです。`history` のすべてのアイテム（`...` スプレッド構文）の後に `nextSquares` を追加する代わりに、古い履歴の一部である `history.slice(0, currentMove + 1)` のすべてのアイテムの後に追加します。
- 手が打たれるたびに、最新の履歴エントリを指すように `currentMove` を更新する必要があります。

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

最後に、`Game` コンポーネントを変更して、現在選択された手をレンダーするようにし、最終手を常にレンダーするのではなく：

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

ゲームの履歴の任意のステップをクリックすると、三目並べのボードが即座に更新され、そのステップが発生した後のボードの状態が表示されるようになります。

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
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
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
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

### 最終の整理 {/*final-cleanup*/}

コードをとても注意深く見ると、`currentMove` が偶数のとき `xIsNext === true` であり、`currentMove` が奇数のとき `xIsNext === false` であることに気付くかもしれません。言い換えると、`currentMove` の値を知っていれば、`xIsNext` が何であるべきかも常にわかります。

これらを両方とも状態に格納する理由はありません。実際、常に冗長な状態を避けるようにしてください。状態に格納するものを単純化すると、バグが減り、コードが理解しやすくなります。`xIsNext` を別の状態変数として保存せず、 `currentMove` に基づいて求めるように `Game` を変更してください：

```js {4,11,15}
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
  // ...
}
```

これで、`xIsNext` の状態宣言や `setXIsNext` の呼び出しはもう必要ありません。これにより、コンポーネントをコーディング中にミスがあっても、`xIsNext` が `currentMove` と同期しなくなることはありません。

### まとめ {/*wrapping-up*/}

おめでとうございます！ あなたは次の機能を持つ三目並べのゲームを作成しました：

- 三目並べをプレイできます。
- プレイヤーがゲームに勝ったときにそれを表示します。
- ゲームの進行に伴ってゲームの履歴を保存します。
- プレイヤーがゲームの履歴を振り返り、ゲーム盤の前のバージョンを確認できます。

お疲れ様です！ これで、React の仕組みについてかなりの理解が得られたことを願っています。

最終結果はこちらで確認できます：

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

余裕があったり、新しい React のスキルを練習したい場合は、三目並べのゲームに以下の改善を施してみてください。難易度の低い順にリストアップしています：

1. 現在の手だけ、「手番＃...にいます」とボタンの代わりに表示します。
1. 固定された正方形ではなく、`Board` を二つのループを使って書き直します。
1. 昇順または降順で手順をソートできるトグルボタンを追加します。
1. 誰かが勝ったときは、勝利につながった 3 つのマスをハイライトし（誰も勝っていないときは、引き分けの結果についてメッセージを表示）します。
1. 移動履歴リストで、各手の場所を（行、列）の形式で表示します。

このチュートリアルを通じて、React のコンセプトである要素、コンポーネント、プロップ、状態に触れてきました。ゲーム制作でこれらの概念がどのように機能するかを見てきましたが、[Thinking in React](/learn/thinking-in-react) をチェックして、アプリの UI を構築する際に同じ React のコンセプトがどのように機能するかを確認してください。
