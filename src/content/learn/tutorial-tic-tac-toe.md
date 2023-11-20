---
title: 'チュートリアル：三目並べ'
---

<Intro>

このチュートリアルでは、小さな三目並べゲーム (tic-tac-toe) を作成します。このチュートリアルを読むにあたり、React に関する事前知識は一切必要ありません。このチュートリアルで学ぶ技法は React アプリを構築する際の基礎となるものであり、完全に理解することで React についての深い理解が得られます。

</Intro>

<Note>

このチュートリアルは、**実践しながら学ぶ**ことを好む方や、今すぐ何か具体的に動くものを作ってみたいと考えている方向けに設計されています。一歩ずつ概念を学びたい場合は、[UI の記述](/learn/describing-the-ui)から始めてください。

</Note>

このチュートリアルはいくつかのセクションに分かれています。

- [チュートリアルのセットアップ](#setup-for-the-tutorial)は、以下のチュートリアルを進めていく**出発点**です。
- [概要](#overview)では、React の**基礎**であるコンポーネント、props、および state を学びます。
- [ゲームを完成させる](#completing-the-game)では、React 開発における**最も一般的な手法**を学びます。
- [タイムトラベルの追加](#adding-time-travel)では、React の独自の強みに関する**深い洞察**を得ることができます。

### チュートリアルで作成するもの {/*what-are-you-building*/}

このチュートリアルでは、React を使ってインタラクティブな三目並べゲームを作成します。

完成したときにどのような見た目になるか、以下で確認できます。

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

まだコードが理解できない、あるいはこのコードの構文に慣れていない場合でも、心配はいりません！ このチュートリアルの目的は、React とその構文を理解するお手伝いをすることです。

チュートリアルを続ける前に、まずは上記の三目並べゲームを実際に触ってみることをお勧めします。いろいろな機能がありますが、ゲームの盤面 (board) の右側にある番号付きリストに着目してください。このリストはゲーム内で発生したすべての着手 (move) の履歴を示すもので、ゲームが進むにつれて更新されていきます。

完成した三目並べゲームで遊んでみたら、ページのスクロールを続けてください。このチュートリアルではもっとシンプルなテンプレートから始めます。次のステップは、ゲームを作成を始められるように準備を行うことです。

## チュートリアルのセットアップ {/*setup-for-the-tutorial*/}

下にあるライブコードエディタで、右上の **Fork** をクリックして新しいタブを開き、CodeSandbox というウェブサイトのエディタを表示してください。CodeSandbox を使うと、ブラウザ上でコードを書き、作成したアプリがユーザにどのように表示されるかプレビューすることができます。新しいタブには、正方形のマス目 (square) と、このチュートリアルのスタータコードが表示されるはずです。

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

このチュートリアルはローカル開発環境でも進めていくことができます。そのためには以下の手順が必要です。

1. [Node.js](https://nodejs.org/en/) をインストール
1. さきほど開いた CodeSandbox のタブで、左上隅のボタンを押してメニューを開き、そのメニューで **File > Export to ZIP** を選択して、ファイルをローカルにアーカイブとしてダウンロード
1. アーカイブを解凍し、ターミナルを開いて解凍したディレクトリに `cd` する
1. `npm install` で依存ライブラリをインストール
1. `npm start` でローカルサーバを起動し、プロンプト通りに操作し、ブラウザで実行されるコードを確認する

うまくいかない場合でもここで挫けるのは止めましょう！ オンラインで進めて、後で再度ローカル環境のセットアップにトライしてください。

</Note>

## 概要 {/*overview*/}

セットアップが完了したので、React の概要を確認してみましょう！

### スタータコードの確認 {/*inspecting-the-starter-code*/}

CodeSandbox 画面には、以下の 3 つの主要なセクションが表示されます。

![CodeSandbox のスタータコード](../images/tutorial/react-starter-code-codesandbox.png)

1. `App.js`、`index.js`、`styles.css` などのファイルリストや `public` というフォルダがある _Files_ セクション
1. 選択したファイルのソースコードが表示される _コードエディタ_ 
1. 書いたコードがどのように表示されるかがわかる _Browser_ セクション

_Files_ セクションで `App.js` ファイルが選択されているはずです。そのファイルの内容は _コードエディタ_ に以下のように表示されています。

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_ブラウザ_ セクションには、以下のように X の入ったマス目が表示されているはずです。

![X と書かれたマス目](../images/tutorial/x-filled-square.png)

それでは、スタータコードのファイルを見ていきましょう。

#### `App.js` {/*appjs*/}

`App.js` にあるコードは*コンポーネント*を作成します。React では、コンポーネントとは UI の部品を表す再利用可能なコードのことです。コンポーネントは、アプリケーションの UI 要素を表示し、管理し、更新するために使用します。コンポーネントの中身を 1 行ずつ見ていって、何が起こっているかを確認しましょう。

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

最初の行では、`Square` という関数を定義しています。`export` という JavaScript キーワードは、この関数をこのファイルの外部からアクセスできるようにします。`default` キーワードは、このコードを使用する他のファイルに、これがこのファイルのメイン関数であるということを伝えます。

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

2 行目のコードはボタンを返しています。`return` という JavaScript キーワードは、後に書くものが関数の呼び出し元に値として返されるということを意味します。この `<button>` は *JSX 要素 (JSX element)* と呼ばれます。JSX 要素とは、何を表示したいかを記述するための JavaScript コードと HTML タグの組み合わせです。`className="square"` はこのボタンのプロパティ、または *props* と呼ばれるもので、CSS にボタンをどのようにスタイル付けするか伝えます。`X` はボタンの内部に表示されるテキストです。`</button>` は JSX 要素を閉じて、これ以降に書かれた内容がボタンの内部に出てこないようにします。

#### `styles.css` {/*stylescss*/}

CodeSandbox の _Files_ セクションにある `styles.css` というファイルをクリックしてください。このファイルには、React アプリのスタイルが定義されています。最初の 2 つの _CSS セレクタ_（`*` と `body`）は、アプリケーションの全体的なスタイルを定義しており、`.square` というセレクタは、`className` プロパティが `square` となっているコンポーネントのスタイルを定義します。今回のコードでは、これは `App.js` ファイルの Square コンポーネントが表示するボタンにマッチします。

#### `index.js` {/*indexjs*/}

CodeSandbox の _Files_ セクションにある `index.js` というファイルをクリックしてください。このチュートリアルでこのファイルを編集することはありませんが、`App.js` ファイルで作成したコンポーネントと Web ブラウザとの橋渡しを行っています。

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

1〜5 行目で、必要なすべての部品を取り出しています：

* React
* Web ブラウザとやり取りするための React ライブラリ (React DOM)
* コンポーネント用のスタイル
* `App.js` であなたが作成したコンポーネント

ファイルの残りの部分では、これらの部品を全部まとめて、最終的な成果物を `public` フォルダ内の `index.html` に注入しています。

### 盤面の作成 {/*building-the-board*/}

それでは `App.js` に戻りましょう。このチュートリアルの残りは、このファイル内で作業します。

現在の盤面 (board) にはマス目 (square) が 1 つしかありませんが、本来は 9 つ必要です！ 2 つ目のマス目を作るために単純にコピーペーストすると…

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

以下のようなエラーが表示されます：

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX Fragment `<>...</>`?

</ConsoleBlock>

<<<<<<< HEAD
React コンポーネントからは、このボタンのように JSX 要素を複数隣り合わせて返すのではなく、単一の JSX 要素を返す必要があります。これを修正するには、複数の隣接する JSX 要素は、以下のように*フラグメント*（`<>` および `</>`）で囲むようにします。
=======
React components need to return a single JSX element and not multiple adjacent JSX elements like two buttons. To fix this you can use *Fragments* (`<>` and `</>`) to wrap multiple adjacent JSX elements like this:
>>>>>>> 4f9e9a56611c7a56b9506cf0a7ca84ab409824bc

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

![X の入ったマス目が 2 つ](../images/tutorial/two-x-filled-squares.png)

素晴らしいです！ あとは、マス目が 9 個になるまで何度かコピーペーストすれば…

![1 行に X の入ったマス目が 9 個](../images/tutorial/nine-x-filled-squares.png)

あれ？ 盤面のマス目はグリッド状に並べたいのですが、1 行に並んでしまっています。これを修正するには、`div` を使って複数のマス目を行単位でグループ化し、CSS クラスを追加する必要があります。ついでに各マス目に番号をつけて、どれがどこに表示されているのか確認できるようにしましょう。

`App.js` ファイルで、`Square` コンポーネントを以下のように書き換えてください：

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

`styles.css` で定義されている CSS が、`className` が `board-row` となっている div をスタイル化します。スタイル化された `div` でコンポーネントを 3 行にまとめたので、三目並べの盤面ができました。

![1 から 9 までの数字が入った三目並べの盤面](../images/tutorial/number-filled-board.png)

しかし別の問題が出てきました。`Square` という名前のコンポーネントなのに、実際にはもう 1 個のマス目ではなくなっています。これを直すため、名前を `Board` に変えます。

```js {1}
export default function Board() {
  //...
}
```

この段階で、コードは次のようになっているはずです。

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

うーん、ちょっとタイピングが大変ですよね！ このページからコードをコピーペーストしても問題ありません。ただし、ちょっと挑戦してみたい気分であれば、自分で 1 度は手入力したものだけをコピーすることをおすすめします。

</Note>

### props を通してデータを渡す {/*passing-data-through-props*/}

次に、ユーザがマス目をクリックしたら、空白だった中身が "X" に変化するようにしたいと思います。ですが先ほどのように盤面を作成していたのでは、この先マス目の中身を更新するコードを 9 回（各マス目に対して 1 回ずつ）コピーペーストしなくてはならなくなってしまいます！ そのようなコピーペーストをする代わりに、React のコンポーネントアーキテクチャを使って再利用可能なコンポーネントを作成することで、重複だらけのごちゃごちゃとしたコードを書かずに済むようになります。

まず、`Board` コンポーネントから最初のマス目を定義している行 (`<button className="square">1</button>`) をコピーし、新たに書く `Square` コンポーネントに貼り付けます。

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

次に、`Board` コンポーネントを更新し、JSX 構文を使用してこの `Square` コンポーネントをレンダーするようにしましょう。

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

ブラウザの `div` とは異なり、自分で作成するコンポーネントである `Board` と `Square` は、大文字で始める必要があることに注意してください。

どうなったか見てみましょう。

![1 だらけの盤面](../images/tutorial/board-filled-with-ones.png)

あれ？ 先ほどまでの番号付きのマス目がなくなってしまいました。すべてのマス目が "1" になってしまっています。これを修正するには、各マス目が持つべき値を親コンポーネント (`Board`) から子コンポーネント (`Square`) に伝えるために、*props* というものを使用します。

`Square` コンポーネントを更新して、`Board` から渡される `value` プロパティを読み取るようにします。

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` は、`Square` コンポーネントに props として `value` という名前の値が渡されることを示しています。

次は各マス目に、受け取った `value` を表示させる必要があります。次のようにしてみましょう。

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

おっと、これは意図したものではありません。

!["value" の文字列だらけの盤面](../images/tutorial/board-filled-with-value.png)

コンポーネントから `value` という名前の JavaScript 変数の値を表示させたかったのであって、"value" という単語自体を表示させたかったわけではありませんね。ここでは JSX の中から「JavaScript の記法に戻る」ために、波括弧が必要です。JSX の中で `value` の周りに波括弧を追加してみましょう。

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

今のところ、空白の盤面が表示されているはずです。

![空の盤面](../images/tutorial/empty-board.png)

これは `Board` コンポーネントが、レンダーしている各 `Square` コンポーネントにまだ props として `value` を渡していないからです。これを修正するには、`Board` コンポーネントがレンダーしている `Square` コンポーネントのそれぞれに、props として `value` を追加していきます：

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

これで、再び数値が入ったグリッドが表示されるようになりました：

![1 から 9 までの数字で埋められた三目並べの盤面](../images/tutorial/number-filled-board.png)

ここまでで、コードは以下のようになっているはずです：

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

### インタラクティブなコンポーネントの作成 {/*making-an-interactive-component*/}

では `Square` コンポーネントをクリックすると `X` が表示されるようにしてみましょう。`Square` の中に `handleClick` という関数を宣言します。次に、`Square` から返される button JSX 要素に、props として `onClick` を追加します。

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

ここでクリックしてみると、CodeSandbox の _Browser_ セクションの下部にある _Console_ タブに `"clicked!"` というログが表示されるはずです。複数回クリックすると、再び `"clicked!"` がログとして記録されますが、同一のメッセージが繰り返しコンソールに表示されることはありません。代わりに、最初の `"clicked!"` ログの隣にカウンタが表示され、その数字が増えていきます。

<Note>

このチュートリアルをローカルの開発環境で実施している場合は、ブラウザのコンソールを開く必要があります。例えば、Chrome ブラウザを使っている場合は、**Shift + Ctrl + J** (Windows/Linux) または **Option + ⌘ + J** (macOS) というキーボードショートカットで、コンソールを表示できます。

</Note>

次のステップとして、`Square` コンポーネントに、クリックされたことを「記憶」して "X" マークを表示してもらうことにします。何かを「記憶」するために、コンポーネントは *state* というものを使用します。

React は、`useState` という特別な関数を提供しており、コンポーネントからこれを呼び出すことで「記憶」を行わせることができます。`Square` の現在の値を state に保存し、`Square` がクリックされたときにその値を変更しましょう。

ファイルの先頭で `useState` をインポートします。`Square` コンポーネントから `value` プロパティを削除します。代わりに、`Square` の先頭に新しい行を追加して `useState` を呼び出します。`value` という名前の state 変数が返されるようにします。

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` が state の現在値を格納し、`setValue` はその値を更新するために使う関数です。`useState` に渡される `null` は、この state 変数の初期値として使用されるので、この `value` はまず `null` という値から始まります。

`Square` コンポーネントがもはや props を受け取らないようになったので、`Board` コンポーネントが作成している 9 個の `Square` コンポーネントすべてから `value` プロパティを削除しましょう。

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

次に、`Square` をクリックすると "X" が表示されるようにします。イベントハンドラの `console.log("clicked!");` を `setValue('X');` に置き換えます。これで、`Square` コンポーネントは次のようになります。

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

この `set` 関数を `onClick` ハンドラから呼び出すことで、`<button>` がクリックされるたびに React に `Square` を再レンダーするよう要求しています。更新の後では当該 `Square` の `value` は `'X'` になっているので、ゲームの盤面上に "X" が表示されるようになります。いずれかのマス目かをクリックすると "X" が表示されるはずです。

![盤面に複数の "X" を追加](../images/tutorial/tictac-adding-x-s.gif)

各 Square はそれぞれ独自の state を保持しています。それぞれの Square に格納されている `value` は、他のものとは完全に独立しています。コンポーネントの `set` 関数を呼び出すと、React は自動的に内部にある子コンポーネントも更新します。

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

React DevTools を使うと、React コンポーネントの props や state を確認することができます。React DevTools タブは、CodeSandbox の *Browser* セクションの下部にあります。

![CodeSandbox 内の React DevTools](../images/tutorial/codesandbox-devtools.png)

画面上の特定のコンポーネントについて調べるには、React DevTools の左上にあるボタンを使用します。

![React DevTools でページ上のコンポーネントを選択する](../images/tutorial/devtools-select.gif)

<Note>

ローカル開発をしている場合、React DevTools は [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)、[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)、そして [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil) ブラウザの拡張機能として利用できます。インストールすると、React を利用しているサイトでは *Compontents* タブがブラウザの開発者ツールに表示されるようになります。

</Note>

## ゲームを完成させる {/*completing-the-game*/}

ここまでの作業で、三目並べゲームの基本的な構成部品がすべて揃いました。完全に動作するゲームにするためには、盤面上に交互に "X" と "O" を置けるようにすることと、勝者を決めるための方法が必要です。

### state のリフトアップ {/*lifting-state-up*/}

現在のところ、各 `Square` コンポーネントが、ゲームの状態を少しずつ保持している状況です。三目並べゲームで勝者を決めるためには、`Board` が 9 つの `Square` コンポーネントそれぞれの現在の state を、何らかの形で知る必要があります。

どのようなアプローチが良いでしょうか？ 最初に思いつくのは、`Board` が各 `Square` に現在の state がどうなっているか「問い合わせる」というものですね。このアプローチも React では技術的には可能ですが、コードが理解しにくくなり、バグが発生しやすくなり、リファクタリングが困難になってしまうため、お勧めしません。ここでの最善はそうではなく、ゲームの state を各 `Square` ではなく親の `Board` コンポーネントに保持させることです。`Board` コンポーネントは、それぞれの `Square` に、何を表示するのか props を使って伝えることができます。以前にマス目に数字を渡したときと同じですね。

**複数の子コンポーネントからデータを収集したい、あるいは 2 つの子コンポーネント同士で通信したい、と思ったら、代わりに親コンポーネントに共有の state を宣言するようにしてください。親コンポーネントはその state を子コンポーネントに prop 経由で渡すことができます。これにより、子同士および親子間で、コンポーネントが同期されるようになります。**

state の親コンポーネントへのリフトアップ（持ち上げ）は、React のコンポーネントのリファクタリングにおいてよく発生します。

この機会に試してみましょう。`Board` コンポーネントを編集して `squares` という名前の state 変数を宣言し、そのデフォルト値として 9 つのマス目に対応する 9 個の null を持つ配列を与えるようにしましょう：

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` は、9 個の要素を持つ配列を作成し、それぞれの要素を `null` に設定します。それを囲む `useState()` コールは、state 変数 `squares` を宣言し、初期値をこの配列にします。配列の各要素は、個々のマス目の値に対応します。後で盤面が埋まってくると、`squares` 配列は次のような見た目になる予定です：

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

そして `Board` コンポーネントは、レンダーする各 `Square` に props として `value` を渡していく必要があります：

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

次に、`Square` コンポーネントを編集して、`value` プロパティを改めて `Board` コンポーネントから受け取るようにします。同時に、`Square` コンポーネント自身が `value` を state で管理していたコードと、ボタンにある `onClick` プロパティを削除する必要があります。

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

この時点では、空白の三目並べの盤面が表示されているはずです：

![空の盤面](../images/tutorial/empty-board.png)

コードは以下のようになっています：

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

これで、各 Square は、`'X'` 、`'O'`、または空の場合は `null` の、いずれかの `value` を props として受け取るようになります。

次に、`Square` がクリックされたときに起こることを変更しなければいけません。いまや `Board` コンポーネントが、どのマス目が埋まっているのかを管理しています。`Square` から `Board` の state を更新する手段が必要です。state はそれを定義しているコンポーネントにプライベートなものですので、`Square` から `Board` の state を直接更新することはできません。

代わりに、`Board` コンポーネントから `Square` コンポーネントに関数を渡して、マス目がクリックされたときに `Square` にその関数を呼び出してもらうようにします。クリックされたときに `Square` コンポーネントが呼び出す関数から始めましょう。その関数を `onSquareClick` という名前にします：

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

次に、`onSquareClick` 関数を `Square` コンポーネントの props に追加します。

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

次にこの `onSquareClick` プロパティを、`Board` コンポーネント内に `handleClick` という名前で作る関数に接続します。`onSquareClick` を `handleClick` に接続するために、1 番目の `Square` コンポーネントの `onSquareClick` プロパティに関数を渡しましょう：

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

最後に、盤面の情報を保持する state である `squares` 配列を更新するため、`Board` コンポーネント内に `handleClick` 関数を定義します：

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

`handleClick` 関数は、`slice()` 配列メソッドを使って `squares` 配列のコピー (`nextSquares`) を作成します。次に、`handleClick` は、`nextSquares` 配列を更新して最初の（インデックス `[0]` の）マス目に `X` と書き込みます。

`setSquares` 関数をコールすることで、React はこのコンポーネントの state に変更があったことを知ります。これにより、`squares` という state 変数を使用しているコンポーネント (`Board`)、およびその子コンポーネント（盤面を構成している `Square` コンポーネントすべて）の再レンダーがトリガされます。

<Note>

JavaScript は[クロージャ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)をサポートしているため、内側の関数（例：`handleClick`）は外側の関数（例：`Board`）で定義されている変数や関数にアクセスできます。`handleClick` 関数は、state である `squares` を読み取ったり、`setSquares` メソッドを呼び出したりできます。これらは両方とも `Board` 関数の内部で定義されているためです。

</Note>

これで、盤に X を置けるようになりました…が、まだ左上隅のマス目にしか置けません。今の `handleClick` 関数は、左上のマス目に対応するインデックス (`0`) で更新するようハードコードされているからです。`handleClick` を書き換えて、任意のマス目の内容を更新できるようにしましょう。`handleClick` 関数に、更新するマス目のインデックスを指定する引数 `i` を追加します：

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

次に、その `i` を `handleClick` に渡す必要があります。以下のように、JSX 内で直接 `Square` の `onSquareClick` プロパティを `handleClick(0)` としたくなるかもしれませんが、これはうまくいきません：

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

これがうまくいかない理由は、`handleClick(0)` の呼び出しが、Board コンポーネントのレンダーの一部として発生してしまうからです。`handleClick(0)` は、`setSquares` を呼び出して Board コンポーネントの state を更新するため、Board コンポーネント全体が再レンダーされます。しかし、これにより `handleClick(0)` が再度実行され、無限ループに陥ります：

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

なぜこの問題が以前には発生しなかったのでしょう？

`onSquareClick={handleClick}` のようにしていたときは、props として `handleClick` 関数を渡していました。呼び出してはいませんでした！ しかし、今はその関数をその場で*呼び出して*しまっているのです。`handleClick(0)` の括弧の部分に注目してください。だからすぐに実行されてしまうのです。ユーザがクリックするまで、`handleClick` を*呼び出したくない*わけです。

これを解決する方法として、`handleClick(0)` を呼び出す `handleFirstSquareClick` のような関数を作成し、次に `handleClick(1)` を呼び出す `handleSecondSquareClick` のような関数を作成し…のようにしていくことも可能です。これらの関数を `onSquareClick={handleFirstSquareClick}` のようにして、（呼び出すのではなく）props として渡すことができます。これにより無限ループは解決されるでしょう。

しかし、9 つの異なる関数を定義し、それぞれに名前を付けるのは冗長です。代わりに、次のようにしましょう：

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

新しい `() =>` 構文に注目してください。この `() => handleClick(0)` は*アロー関数*と呼ばれる、関数を短く定義する方法です。マス目がクリックされると、アロー (`=>`) の後のコードが実行され、`handleClick(0)` が呼び出されます。

それでは、残り 8 つの Square のコードも更新して、アロー関数の中から `handleClick` が呼び出されるようにしましょう。`handleClick` の各呼び出しの引数が、正しくマス目のインデックスに対応していることを確認してください。

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

これで改めて、盤面上の任意のマス目をクリックして X が置けるようになりました。

![X が置かれた盤面](../images/tutorial/tictac-adding-x-s.gif)

ですが今では、state の管理がすべて `Board` コンポーネントによって行われるようになっています！

コードは、以下のようになっているはずです：

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

state 管理が `Board` コンポーネントに移動されたので、親である `Board` コンポーネントは子の `Square` コンポーネントに props を渡すことで、それらが正しく表示されるようにしています。`Square` をクリックすると、子である `Square` コンポーネントが親である `Board` コンポーネントに盤面の state を更新するように要求します。`Board` の state が変更されると、`Board` コンポーネントとすべての `Square` 子コンポーネントが自動的に再レンダーされます。すべてのマス目の state を `Board` コンポーネントにまとめて保持しておくことで、この後でゲームの勝者を決めることが可能になります。

ユーザが盤面の左上のマス目をクリックして `X` を置いた場合を例に、何が起こるのかをおさらいしましょう。

1. 左上のマス目をクリックすると、`button` が props として受け取った `onClick` 関数が実行されます。`Square` コンポーネントはその関数を `Board` から `onSquareClick` プロパティとして受け取っています。`Board` コンポーネントはその関数を JSX の中で直接定義しています。その関数は引数 `0` で `handleClick` を呼び出します。
1. `handleClick` は引数 `0` を使って、`squares` 配列の最初の要素を `null` から `X` に更新します。
1. `Board` コンポーネントの state である `squares` が更新されたので、`Board` とそのすべての子が再レンダーされます。これにより、インデックス `0` である `Square` コンポーネントの `value` プロパティが `null` から `X` に変更されます。

最終的に、クリックによって左上のマス目が空白から `X` に変わったという結果をユーザが目にすることになります。

<Note>

DOM の `<button>` 要素は組み込みのコンポーネントなので、その `onClick` 属性は、React にとって特別な意味を持っています。`Square` のような独自コンポーネントの場合、名前は自由に決めることができます。`Square` の `onSquareClick` プロパティや `Board` の `handleClick` 関数にほかのどんな名前を付けても、コードは同じように動作します。React では、イベントを表す props には `onSomething` という名前を使い、それらのイベントを処理するハンドラ関数の定義には `handleSomething` という名前を使うことが一般的です。

</Note>

### なぜイミュータビリティが重要なのか {/*why-immutability-is-important*/}

`handleClick` 内で既存の `squares` 配列を直接変更するのではなく、`.slice()` を使ってコピーを作成していたことを思い返してください。その理由を説明するために、イミュータビリティ（不変性, immutability）という概念と、なぜイミュータビリティを学ぶことが重要であるかについてお話しします。

データを変更する方法には、一般的に 2 つのアプローチがあります。1 つ目のアプローチは、データの値を直接 *ミューテート（書き換え, mutate）* する方法です。2 つ目のアプローチは、望ましい変更が施された新しいコピーで元のデータを置換する方法です。以下は、`squares` 配列を直接書き換えている例です：

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

一方で、以下が `squares` 配列を書き換えずにデータを変更している例です：

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

結果は同じですが、元のデータの書き換えを行わないことで、いくつかの利点を得ることができます。

イミュータビリティにより、複雑な機能をはるかに簡単に実装することができます。このチュートリアルの後半では、ゲームの履歴を確認して過去の手に「巻き戻し」ができる、「タイムトラベル」機能を実装することになります。このような機能はゲームに特有のものではなく、アクションの取り消しややり直しはアプリケーションでは一般的な要件です。直接的なデータの書き換えを避けることで、データの過去のバージョンを壊すことなく保持し、後で再利用することができます。

イミュータビリティには、もう 1 つの利点があります。デフォルトでは、親コンポーネントの state が変更されると、すべての子コンポーネントは自動的に再レンダーされます。これには state 変更によって影響を受けていない子コンポーネントも含まれます。再レンダー自体はユーザに気付かれないものですが（積極的に避ける必要はありません！）、パフォーマンス上の理由から、影響を受けていないことが明らかなツリーの一部の再レンダーをスキップしたい場合があります。イミュータビリティにより、コンポーネントがデータが変更されたかどうかを非常に安価に比較することができます。React がコンポーネントの再レンダーをいつ行うかについての詳細は、[`memo` API のリファレンス](/reference/react/memo)を参照してください。

### 手番の処理 {/*taking-turns*/}

さて、この三目並べゲームの重大な欠陥、すなわち "O" がまだ盤面上に出てこないという問題を解決する時間がやってきました。

まず先手がデフォルトで "X" になるようにしましょう。現在の手番を追跡するために、Board コンポーネントにもう 1 つ state を追加しましょう：

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

プレーヤが着手するたびに、どちらのプレーヤの手番なのかを決める `xIsNext`（真偽値型）が反転して、ゲームの state が保存されます。`Board` の `handleClick` 関数を書き換えて、そこで `xIsNext` の値を反転させましょう：

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

これで、異なるマス目をクリックすると `X` と `O` が正しく交互に表示されるようになりました！

おや、まだ問題があります。同じマス目を何度もクリックしてみてください：

![O が X を上書きしている](../images/tutorial/o-replaces-x.gif)

`X` が `O` で上書きされてしまっています！ これでも大変興味深い特殊ルールにはなりそうですが、今のところはオリジナルのルールを守りましょう。

マス目に `X` や `O` を置く前に、まずそのマス目に既に `X` や `O` の値があるかどうか、まだチェックしていません。これは、*早期リターン (early return)* をすることで修正できます。マス目に既に `X` または `O` があるかどうかを確認し、既にある場合は `handleClick` 関数内から早期 `return` し、盤面の state が更新されてしまわないようにしましょう。

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

これで空いているマス目にだけ `X` や `O` を追加できるようになりました！ ここまでのコードは以下のようになります。

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

プレーヤが交互に着手できるようになったので、次は勝者が決まった際やこれ以上ゲームを進められなくなった際に、そのように表示することにしましょう。これを実現するために、9 つのマス目の配列を受け取って勝者を判定し `'X'`、`'O'` または `null` を返す、`calculateWinner` という名前のヘルパー関数を追加します。`calculateWinner` 関数の中身は React 特有のものではありませんので、あまり気にしないようにしてください。

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

`calculateWinner` を `Board` の前後のどちらで定義しても問題ありません。今はコンポーネントを編集するたびにスクロールしないで済むよう、これを最後に置きましょう。

</Note>

`Board` コンポーネントの `handleClick` 関数で `calculateWinner(squares)` を呼び出して、いずれかのプレーヤが勝利したかどうか判定します。これは、ユーザがすでに `X` や `O` のあるマス目をクリックしたかどうかチェックしている場所と同じところで行えます。どちらの場合でも早期リターンを行いたいです。

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

ゲームが終了したことを知らせるために、"Winner: X" または "Winner: O" というテキストを表示しましょう。これを行うため、`Board` コンポーネントに `status` の欄を追加します。このステータス欄は、ゲームが終了した場合に勝者を表示し、ゲームが続行中の場合は、次がどちらの手番なのか表示します。

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

おめでとうございます！ これで、動作する三目並べのゲームができました。そして、あなたが React の基本を学ぶこともできました。本当の勝者は*あなた*です。ここでのコードは以下のようになっています：

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

最後の演習として、ゲームを過去の手番に「巻き戻す」ことができるようにしましょう。

### 着手の履歴を保持する {/*storing-a-history-of-moves*/}

`squares` 配列をミューテート（書き換え）していた場合、タイムトラベルの実装は非常に困難になっていたことでしょう。

しかし、各着手ごとに `slice()` を使って `squares` 配列の新しいコピーを作成し、それをイミュータブルなものとして扱ってきました。このおかげで、過去のすべてのバージョンの `squares` 配列を保存し、すでに発生した着手の間で移動することができるようになります。

過去の `squares` 配列を、`history` という名前の別の配列に入れて、それを新たに state 変数として保持することにします。この `history` 配列は、最初の着手から最新の着手まで、盤面のすべての状態を表現しており、以下のような形になります。

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

### もう一度 state をリフトアップ {/*lifting-state-up-again*/}

ここからは、新しいトップレベルのコンポーネント、`Game` を作成して、過去の着手の一覧を表示するようにします。ゲームの履歴全体を保持する state である `history` は、ここに置くことにします。

`history` 状態を `Game` コンポーネントに配置することで、その子になる `Board` コンポーネントからは `squares` の state を削除できます。`Square` コンポーネントから `Board` コンポーネントに「state をリフトアップ」したときと同じように、`Board` からトップレベルの `Game` コンポーネントに state をリフトアップすることになります。これにより、`Game` コンポーネントは `Board` のデータを完全に制御し、`history` からの過去の盤面の状態を `Board` にレンダーさせることができます。

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

`function Board() {` 宣言の前にある `export default` キーワードを削除し、`function Game() {` 宣言の前に追加したことに注意してください。これにより、`index.js` ファイルが `Board` コンポーネントの代わりに `Game` コンポーネントをトップレベルのコンポーネントとして使用するように指示しています。`Game` コンポーネントが返すもう 1 つの `div` は、後で画面に追加するゲーム情報のためのスペースを確保しています。

`Game` コンポーネントに現在の手番と着手の履歴を管理するための state を追加してください。

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

`[Array(9).fill(null)]` は要素数が 1 の配列であり、その唯一の要素が 9 つの `null` が入った配列となっていることに注意してください。

現在の盤面をレンダーするには、`history` の最後にあるマス目の配列を読み取る必要があります。これに `useState` は必要ありません。レンダー中にそれを計算するだけの情報がすでにあります。

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

次に、`Game` コンポーネント内に、ゲーム内容を更新するために `Board` コンポーネントから呼ばれる `handlePlay` 関数を作成します。`xIsNext`、`currentSquares`、そして `handlePlay` を `Board` コンポーネントに props として渡すようにします。

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

次に `Board` コンポーネント側も編集し、渡される props によってこのコンポーネントが完全に制御されるようにしましょう。`Board` コンポーネントが 3 つの props を受け取るようにします。`xIsNext`、`squares`、そして、プレーヤの着手時に `Board` がコールして新たな盤面の状態を伝えるための `onPlay` 関数です。`Board` の冒頭で `useState` を呼び出している 2 行は削除してください。

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

次に、`Board` コンポーネント内の `handleClick` で `setSquares` と `setXIsNext` を呼び出しているところを、`onPlay` 関数への単一の呼び出しに置き換えます。これにより、ユーザがマス目をクリックしたときに、`Game` コンポーネントが `Board` を更新できるようになります。

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

`Board` コンポーネントは、`Game` コンポーネントから渡される props によって完全に制御されています。ゲームを再び動作させるために、`Game` コンポーネントの `handlePlay` 関数を実装する必要があります。

`handlePlay` は呼び出されたときに何をすべきでしょうか？ 以前の Board は新しい `square` 配列を作ったら `setSquares` を呼び出していましたが、今では新しい配列を `onPlay` に渡すようになっています。

`handlePlay` 関数は `Game` の state を更新して再レンダーをトリガする必要がありますが、もう呼び出すべき `setSquares` 関数は存在しません。代わりに `history` という state 変数を使って情報を保存しているからです。`history` を更新して、新しい `squares` 配列を新しい履歴エントリとして追加するようにしましょう。また、Board が行っていたように `xIsNext` を切り替える必要もあります。

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

ここで、`[...history, nextSquares]` というコードは、`history` のすべての要素の後に `nextSquares` が繋がった新しい配列を作成します。（この `...history` は[*スプレッド構文*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)であり、「`history` のすべての項目をここに列挙せよ」のように読みます。）

例えば、`history` が `[[null,null,null], ["X",null,null]]` で `nextSquares` が `["X",null,"O"]` の場合、新しい `[...history, nextSquares]` 配列は `[[null,null,null], ["X",null,null], ["X",null,"O"]]` になります。

この時点で、state が `Game` コンポーネントに移動し終わり、UI はリファクタリング前と同様に完全に動作するようになっているはずです。ここでのコードは以下のようになります。

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

### 過去の着手の表示 {/*showing-the-past-moves*/}

三目並べのゲームの履歴が記録されるようになったので、プレーヤに過去の着手のリストを表示することができます。

`<button>` などの React 要素は普通の JavaScript オブジェクトでもありますので、アプリケーション内でそれらを受け渡しすることができます。React で複数のアイテムをレンダーするには、React 要素の配列を使うことができます。

すでに state として着手履歴の配列である `history` がありますので、ここでそれを React 要素の配列に変換します。JavaScript では、配列を別の配列に変換するために、[配列の `map` メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) を使うことができます。

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

着手の `history` を `map` で変換して、画面上のボタンを表す React 要素の配列にし、過去の着手に「ジャンプ」できるボタンを表示するようにしましょう。Game コンポーネントで `history` をマップしてみましょう。

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

コードは以下のようになります。なお開発者ツールのコンソールには以下のようなエラーが表示されています。

<ConsoleBlock level="warning">
Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of &#96;Game&#96;.
</ConsoleBlock>

このエラーは次のセクションで修正します。

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

`map` に渡される関数の内部で `history` を反復処理する部分では、`squares` 引数が `history` の各要素を順に受け取り、`move` 引数が配列のインデックス `0`, `1`, `2`, … を順に受け取ります。（大抵は、実際の配列の中身が必要になりますが、今回の着手リストのレンダーで必要なのはインデックスの方だけです。）

三目並べゲームの履歴にある着手のそれぞれについて、ボタン `<button>` の入ったリストアイテム `<li>` を作成します。ボタンには `jumpTo` という関数を呼び出す `onClick` ハンドラがありますが、これはまだ実装していません。

現時点では、ゲーム内で起きた着手の一覧に加え、開発者ツールのコンソールにエラーが表示されているはずです。この "key" に関するエラーの意味についてこれから説明します。

### key を選ぶ {/*picking-a-key*/}

リストをレンダーすると、React はレンダーされたリストの各アイテムに関するとある情報を保持します。そのリストが更新されると、React は何が変更されたのかを判断する必要があります。例えばリストのアイテムを追加したのかもしれませんし、削除、並べ替え、あるいは項目の中身の更新を行ったのかもしれません。

次のような状況から：

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

以下に遷移したと想像してください：

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

人間がこれを読めばおそらく、カウントの数字が変わっていることに加えて、Alexa と Ben の順番が入れ替わり、Claudia が Alexa と Ben の間に挿入された、と言うことでしょう。しかし React はコンピュータプログラムでありあなたの意図を知ることはできません。なのでリストの各項目を兄弟間で区別するために、それぞれのリスト項目に *key* プロパティを指定する必要があります。データがデータベースから取得されている場合、Alexa、Ben、Claudia のデータベース ID を key として使用できます。

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

リストが再レンダーされると、React は各リスト項目の key を見て、以前のリストの項目に一致する key があるか探します。現在のリストに以前に存在しなかった key がある場合、React は対応するコンポーネントを作成します。現在のリストから以前のリストに存在した key が消えている場合、React は対応する既存のコンポーネントを破棄します。2 つの key が一致した場合、対応するコンポーネントは移動されます。

key は、各コンポーネントを識別するための情報を React に与えます。これにより、再レンダー間で state を維持できるのです。コンポーネントの key が変更されると、コンポーネントは破棄され、新しい state で再作成されます。

`key` は React における、特別に予約されたプロパティです。要素が作成されるとき、React は `key` プロパティを抽出し、返される要素に key を直接格納します。`key` が props として渡されているかのように見えますが、`key` は React が自動的に使用して、どのコンポーネントを更新するかを自動的に決定します。子コンポーネント側が、親コンポーネントが指定した `key` が何であるかを知る方法はありません。

**動的なリストを作成する際には、適切な key を割り当てることを強くお勧めします**。適切な key がない場合は、key を含めるようデータ構造の再設計を検討してください。

key が指定されていない場合、React はエラーを報告し、デフォルトでは配列のインデックスを key として使用します。配列のインデックスを key として使用すると、リストの項目を並べ替えたり、挿入・削除したりする際に問題が生じます。明示的に `key={i}` を渡すとエラーを止めることはできますが、配列のインデックスを使うのと同じ問題になるだけですので、ほとんどの場合お勧めできません。

key はグローバルに一意である必要はなく、コンポーネントとその兄弟間で一意であれば十分です。

### タイムトラベルの実装 {/*implementing-time-travel*/}

三目並べゲームの履歴では、過去の各着手に、一意の ID が関連付けられています。何番目の着手かを表す連続した数値です。着手は並び変わったり、削除されたり、途中に挿入されることはないため、手番のインデックスを key として使用することは安全です。

`Game` 関数内で、`<li key={move}>` とすることで key を追加できます。これでゲームをリロードすると、React の "key" エラーが消えるはずです。

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

`jumpTo` を実装する前に、`Game` コンポーネントに、現在ユーザが見ているのが何番目の着手であるのかを管理させる必要があります。これを行うために、`currentMove` という名前の新しい state 変数を定義し、デフォルト値を `0` に設定します：

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

次に、`Game` 内の `jumpTo` 関数を更新して、`currentMove` を更新するようにします。`currentMove` を変更する数値が偶数の場合は、`xIsNext` を `true` に設定します。

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

次に、マス目をクリックしたときに呼ばれる `Game` の `handlePlay` 関数を 2 か所変更しましょう。

- 過去に戻ってその時点から新しい着手を行う場合、その時点までの履歴を維持して残りは消去したいでしょう。`nextSquares` を `history` のすべての履歴（`...` スプレッド構文）の後に追加するのではなく、履歴の一部である `history.slice(0, currentMove + 1)` の後に追加するようにして、履歴のうち着手時点までの部分のみが保持されるようにします。
- 着手が起きるたびに、最新の履歴エントリを指し示すように `currentMove` を更新する必要があります。

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

最後に、`Game` コンポーネントを変更し、常に最後の着手をレンダーする代わりに、現在選択されている着手をレンダーするようにします：

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

ゲーム履歴内にある任意の着手をクリックすると、三目並べの盤面が即座に更新され、その着手の発生後に対応する盤面が表示されるようになります。

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

### 最後のお掃除 {/*final-cleanup*/}

コードを注意深く見ると、`currentMove` が偶数のときは常に `xIsNext === true` であり、`currentMove` が奇数のとき `xIsNext === false` であることに気付くかもしれません。言い換えると、`currentMove` の値さえ知っていれば、`xIsNext` が何であるべきなのかも常に分かるということです。

これらを両方とも state に格納する理由はありません。実際、冗長な state は常に避けるようにしてください。state に格納するものを単純化すると、バグが減り、コードが理解しやすくなります。`xIsNext` を別の state 変数として保存するのではなく、`currentMove` に基づいて求めるように `Game` を変更しましょう。

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

`xIsNext` の state 宣言や `setXIsNext` の呼び出しはもはや必要ありません。これにより、コンポーネントのコーディング中にミスがあっても、`xIsNext` が `currentMove` と同期しなくなることはありません。

### まとめ {/*wrapping-up*/}

おめでとうございます！ 以下のような機能を持つ三目並べのゲームが作成できました。

- 三目並べをプレイできる
- プレーヤがゲームに勝ったときにそれを判定して表示する
- ゲームの進行に伴って履歴を保存する
- プレーヤがゲームの履歴を振り返り、盤面の以前のバージョンを確認できる

よくできました！ これで、React の仕組みについてかなりの理解が得られたことを願っています。

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

まだ時間がある方や、新しく手に入れた React のスキルを練習したい方向けに、三目並べゲームをさらに改善するためのアイディアをいくつか以下に示します。難易度の低い順にリストアップしています：

1. 現在の着手の部分だけ、ボタンではなく "You are at move #..." というメッセージを表示するようにする。
1. マス目を全部ハードコードするのではなく、`Board` を 2 つのループを使ってレンダーするよう書き直す。
1. 手順を昇順または降順でソートできるトグルボタンを追加する。
1. どちらかが勝利したときに、勝利につながった 3 つのマス目をハイライト表示する。引き分けになった場合は、引き分けになったという結果をメッセージに表示する。
1. 着手履歴リストで、各着手の場所を (row, col) という形式で表示する。

このチュートリアルを通じて、React のコンセプトである React 要素、コンポーネント、props、state に触れてきました。ゲーム制作においてこれらの概念がどのように機能するかが分かったので、次は [React の流儀](/learn/thinking-in-react)をチェックして、アプリの UI を構築する際にこれらの React のコンセプトがどのように機能するのかを確認してください。
