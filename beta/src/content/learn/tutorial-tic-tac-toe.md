---
title: 'チュートリアル: 三目並べ'
---

<Intro>

このチュートリアルでは、小さな三目並べゲーム (tic-tac-toe) を作ります。React の知識を前提としません。このチュートリアルで学ぶ技術は、どんな React アプリを構築するときにも基本的なものです。理解を深めることで、React の深い理解が得られます。

</Intro>

<Note>

このチュートリアルは、実際に何かを作って学びたい人に向けて設計されています。各概念をステップバイステップで学ぶことをお好みの場合、最初に[UI の記述](/learn/describing-the-ui)から始めてください。

</Note>

このチュートリアルは、以下のセクションに分かれています:

- [チュートリアルのセットアップ](#setup-for-the-tutorial) は、チュートリアルのための**出発点**を提供します。
- [概要](#overview) では、React の**基本**であるコンポーネント、props、stateを学びます。
- [ゲームの完成](#completing-the-game) では、React 開発における**最も一般的な技術**を学びます。
- [タイムトラベルの追加](#adding-time-travel) では、React の特徴的な強みをより深く理解することができます。

### 何を作るか？ {/*what-are-you-building*/}

このチュートリアルでは、React を使って対話型の三目並べゲームを作ります。

完成したものは以下のようになります：

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

もしコードがまだ意味をなさない、あるいはコードの構文に不慣れであれば、心配しないでください。このチュートリアルの目的は、React とその構文を理解するのに役立つことです。

チュートリアルを続ける前に、上記の〇✕ゲームを見てお勧めします。ゲームボードの右側に数字付きのリストがあることに気づくでしょう。このリストにはゲーム中に行われたすべての動きの履歴が表示され、ゲームが進むにつれて更新されます。

完成した〇✕ゲームを試したら、スクロールして続けましょう。これからはより簡単なテンプレートを使用してゲームを構築する準備をします。

## チュートリアルのセットアップ {/*setup-for-the-tutorial*/}

以下のライブコードエディターにある、このチュートリアルのスターターコードとともに、右上にある **Fork** ボタンをクリックすると、ウェブサイトの CodeSandbox が新しいタブで開きます。CodeSandbox では、ブラウザでコードを書いて、すぐに作ったアプリをどのようにユーザーが見るかを確認することができます。新しいタブには、空の四角形とスターターコードが表示されるはずです。

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

もしローカル環境でこのチュートリアルを進めたい場合、以下の手順が必要になります:

1. [Node.js](https://nodejs.org/en/)をインストールする
1. 前述の CodeSandbox タブで、左上のボタンをクリックしてメニューを開き、メニューから「File > Export to ZIP」を選択して、ファイルのアーカイブをダウンロードする
1. ダウンロードしたアーカイブを解凍し、ターミナルを開いて解凍したディレクトリに移動する
1. `npm install` コマンドで依存関係をインストールする
1. `npm start` コマンドを実行してローカルサーバーを起動し、ブラウザで実行状況を表示する

もし何か問題があった場合、あきらめずにオンラインでチュートリアルを進めてから、後でまたローカルセットアップに挑戦しましょう。

</Note>

## 概要 {/*overview*/}

セットアップが完了したら、React の概要を把握しましょう！

### スターターコードを調べる {/*inspecting-the-starter-code*/}

CodeSandbox には 3 つの主要なセクションがあります。

![CodeSandbox with starter code](../images/tutorial/react-starter-code-codesandbox.png)

1. ファイルセクションには、`App.js`、`index.js`、`styles.css`というファイルのリストと、`public`という名前のフォルダが含まれます。
1. _コードエディタ_ では、選択したファイルのソースコードが表示されます。
1. _ブラウザ_ セクションでは、書いたコードがどのように表示されるかが表示されます。

_ファイルセクション_ で `App.js` ファイルを選択する必要があります。_コードエディタ_ のそのファイル内にある内容は次のとおりです。

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

_ブラウザ_ セクションでは、次のように、Xで埋められた正方形が表示されている必要があります。

![x-filled square](../images/tutorial/x-filled-square.png)

さて、スターターコードのファイルを見てみましょう。

#### `App.js` {/*appjs*/}

`App.js` のコードは、 _コンポーネント_ を作成します。Reactにおいて、コンポーネントは、ユーザーインターフェースの部分を表す再利用可能なコードです。コンポーネントは、アプリケーションのUI要素をレンダリング、管理、更新するために使用されます。コンポーネントを行ごとに見て、何が起こっているかを見ていきましょう。

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

最初の行は `Square` という名前の関数を定義しています。`export` のキーワードは、この関数がこのファイルの外からアクセス可能であることを示しています。`default` キーワードは、他のファイルがこのコードを使用する際に、それがこのファイルの主要な関数であることを示します。

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

2行目は、ボタンを返します。`return` JavaScriptのキーワードは、その後に続くものを関数の呼び出し元に値として返します。`<button>`は*JSX要素*です。JSX要素は、JavaScriptのコードとHTMLのタグの組み合わせで、表示したいものを記述するものです。`className="square"`は、CSSがボタンをどのようにスタイルするかを示すボタンのプロパティまたは*prop*です。`X`はボタン内に表示されるテキストであり、`</button>`は、以下に続くコンテンツがボタンの内側に配置されないようにJSX要素を閉じることを示します。

#### `styles.css` {/*stylescss*/}

CodeSandboxの「Files」セクションにある `styles.css` というファイルをクリックすると、Reactアプリのスタイルが定義されています。最初の2つの_CSSセレクタ_（`*` と `body`）はアプリの大部分のスタイルを定義し、`.square`セレクタは、`className`プロパティが`square`に設定された任意のコンポーネントのスタイルを定義しています。あなたのコードでは、`App.js`ファイル内のSquareコンポーネントのボタンに一致します。

#### `index.js` {/*indexjs*/}

CodeSandboxの「Files」セクションにある `index.js` というファイルをクリックすると、チュートリアル中にこのファイルを編集することはありませんが、これは `App.js` ファイルで作成したコンポーネントとWebブラウザの橋渡しをします。

```jsx
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';
```

1行目から5行目では、すべての必要な部品をまとめています。

* React
* React DOM（Webブラウザとの通信におけるReact固有の機能を提供するReactのライブラリ）
* コンポーネントのスタイル
* `App.js` で作成したコンポーネント

残りの部分は、すべての部品をまとめ、最終的なプロダクトを `public` フォルダにある `index.html` に注入する働きを持っています。

### ボードの作成 {/*building-the-board*/}

`App.js` に戻って作業を再開しましょう。

現在のボードはただの 1 つのマスしかないため、9 つ必要です。次のように 2 つのマスを追加しようとしても、コピーして貼り付けるだけでは同じスクエアのエラーが出ます。

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

以下のようなエラーが出ます。

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment `<>...</>`?

</ConsoleBlock>

React コンポーネントは、 2 つのボタンのように隣接する JSX 要素を含めることはできず、1 つの JSX 要素を返す必要があります。2 つのボタンのような隣接する JSX 要素をラップするために *フラグメント*（`<>` と `</>`）を使用する必要があります。 以下のように書けばOKです。

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

これで以下が表示されます。

![2 つの X が入ったスクエア](../images/tutorial/two-x-filled-squares.png)

よし、もう少しコピー＆ペーストして 9 つのスクエアを置いて……

![1 行に 9 つの X が入ったスクエア](../images/tutorial/nine-x-filled-squares.png)

あらま！スクエアがすべて 1 行に並んでしまっています。ボードに必要なグリッドに配置する必要があります。複数のスクエアをグループ化して、行にまとめ、CSS クラスを追加する必要があります。また、各スクエアに番号を付けて、それぞれのスクエアの位置を特定する必要があります。

`App.js` ファイルで、以下のように `Square` コンポーネントを更新してください。

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

`styles.css` で定義された CSS で、 `className` が `board-row` の div にスタイルを適用します。スタイルを付けた `div` にコンポーネントをグループ化したので、tic-tac-toe ボードを作成できます。

![1 から 9 までの数値で埋められた tic-tac-toe ボード](../images/tutorial/number-filled-board.png)

しかし、ここで問題が発生します。「Square」と呼ばれるコンポーネントがもうスクエアではなくなってしまいました。そこで、「Board」に名前を変更して、コンポーネントを修正しましょう。

```js {1}
export default function Board() {
  //...
}
```

現時点でのコードは以下のようになっているはずです。

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

おし！かなり打ち込めたことだろう！ページからコードをコピーして貼り付けることもできます。しかし、ちょっと挑戦してみたい場合は、自分自身で手入力したコードのみをコピーすることをおすすめします。

</Note>

### props を通してデータを渡す {/*passing-data-through-props*/}

次に、ユーザーがマスをクリックした際に空きマスの代わりに「X」が表示されるように、マスの値を変更したいと思うでしょう。現在のボードの作り方だと、9つのマスそれぞれでマスの値を更新するためのコードをコピー＆ペーストする必要があります。これを避けるために、Reactのコンポーネントアーキテクチャを使えば、過剰な重複コードを回避しつつ再利用可能なコンポーネントを作成できます。

まず、最初のマスを定義している行（`<button className="square">1</button>`）を `Board` コンポーネントから新しい `Square` コンポーネントにコピーします。

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

そして、JSX構文を使って `Board` コンポーネントが `Square` コンポーネントをレンダリングするように更新します。

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

ブラウザの div と異なり、自分で作成したコンポーネント Board や Square は大文字で始める必要があります。

次を見てみましょう。

![one-filled board](../images/tutorial/board-filled-with-ones.png)

おっと！以前数字があったマスがなくなってしまいました。これを修正するために、親コンポーネントである Board から子コンポーネントである Square に、各マスが持つ値を渡す *props* を使うことにします。

Square コンポーネントが Board コンポーネントから渡された `value` props を読み込むように更新します。

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` は、Square コンポーネントが `value` という名前の props を受け取れることを示しています。

賢明な道は、各マスの中身を表示するため、数字の代わりに `value` props の値を表示することです。

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

あら、「value」という文字列が表示されてしまいました。

![value-filled board](../images/tutorial/board-filled-with-value.png)

文字列の代わりに、コンポーネント内の JavaScript 変数 `value` を表示したいのですが、これは JSX 内で波括弧で囲むことで「JavaScriptに入る」ことができます。そこで、JSX 内の value の周りに波括弧を追加し、以下のように修正します。

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

まだ、空のボードが表示されていると思います。

![empty board](../images/tutorial/empty-board.png)

これは、Board コンポーネントがレンダーした各 Square コンポーネントに `value` props を渡していないためです。以下のように、Board コンポーネントがレンダーする各 Square コンポーネントに `value` props を追加しましょう。

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

新しい結果は以下のようになります：

![tic-tac-toe board filled with numbers 1 through 9](../images/tutorial/number-filled-board.png)

更新されたコードは以下のようになります：

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

`Square` コンポーネントをクリックすると `X` が入った状態にしましょう。`Square` 内に `handleClick` という関数を宣言し、`Square` コンポーネントから返された `button` の JSX 要素のプロップスに `onClick` を追加しましょう。

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

もし正しく動いていれば、CodeSandbox の _Browser_ 部分の下部にある _Console_ タブで `"クリックされました！"` というログが表示されます。同じメッセージの反復されたコンソールログは、新しい行を作成するのではなく、数値が増加していくカウンターがつくことになります。

<Note>

もしローカルの環境でこのチュートリアルに従っている場合、ブラウザのコンソールを開く必要があります。例えば、Chrome ブラウザを使用している場合は、**Shift + Ctrl + J** (Windows/Linux)または **Option + ⌘ + J** (macOS) のキーボードショートカットでコンソールを表示できます。

</Note>

次に、`Square` コンポーネントがクリックされたことを "覚えていて"、それを "X" マークで埋めるようにします。"覚える" ためにコンポーネントは *state* を使用します。

React は、コンポーネント内から呼び出せる特別な `useState` 関数を提供しています。`Square` コンポーネントに対してその値を "覚えさせる" ために、現在の `Square` の値を state に格納し、 `Square` がクリックされた場合にそれを変更します。

まず、ファイルの先頭に `useState` をインポートしましょう。次に、`Square` コンポーネントから `value` props を削除します。その代わりに `Square` コンポーネントの先頭に、`useState` を呼び出して `value` という名前の state 変数を返すようにします。

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

ここでは `value` が値を保持し、`setValue` がその値を変更するために使用できる関数です。`useState` に渡される null は、state の初期値として使用されます。したがって、ここでは `value` が最初は `null` と等しくなります。

`Square` コンポーネントはもはや props を受け付けないので、Board コンポーネントによって作成された 9 つすべての Square コンポーネントから `value` props を削除する必要があります。

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

次は `Square` をクリックしたら「X」が表示されるように変更します。`console.log("clicked!");` イベントハンドラを `setValue('X');` で置き換えます。すると、`Square` コンポーネントは以下のようになります。

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

`onClick` ハンドラからこの `set` 関数を呼び出すことで、`<button>` がクリックされたときに React に対して `Square` を再レンダリングするよう指示しています。アップデート後、`Square` の `value` は「X」になるので、ゲームボードに「X」が表示されます。

どのマスをクリックしても、「X」が表示されるはずです：

![adding xes to board](../images/tutorial/tictac-adding-x-s.gif)

各 Square は個別の `value` ステートを持っています。つまり、各 Square の `value` は他の Square と完全に独立しています。Component 内の `set` 関数を呼び出すと、React は自動的にその子 Component（の中の子）も更新します。

上記変更を加えた後、あなたのコードは以下のようになります：

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

React DevToolsは、Reactコンポーネントのpropsやstateを確認することができます。CodeSandboxのブラウザセクションの一番下にあるReact DevToolsタブで確認できます。

![CodeSandbox内でのReact DevTools](../images/tutorial/codesandbox-devtools.png)

画面上の特定のコンポーネントを調べるには、React DevToolsの左上にあるボタンを使用します。

![React DevToolsを使ってページ上のコンポーネントを選択する](../images/tutorial/devtools-select.gif)

<Note>

ローカル開発の場合、React DevToolsは[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)、[Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)、[Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)のブラウザ拡張機能として利用可能です。これらをインストールすると、*Components*タブがReactを使用しているサイトのブラウザ開発ツールに現れます。

</Note>

## ゲームの完成 {/*completing-the-game*/}

これまでのところ、三目並べゲームの基本的な構成要素は全て備わっています。完全なゲームとして、交互に "X" と "O" を盤上に配置する必要があり、勝利者を決定する方法が必要になります。

### ステートをリフトアップする {/*lifting-state-up*/}

現在、「Square」コンポーネントはゲームの状態の一部を保持しています。つまり、「Tic Tac Toe」ゲームで勝者を決定するために、「Board」コンポーネントは、9つの「Square」コンポーネントそれぞれの状態をどうやって知ることができるでしょうか。

最初に思いつくアイデアは、「Board」コンポーネントが、各「Square」からその「Square」の状態を「取得」する必要があるというものです。これはReactでは技術的に可能ではありますが、理解が難しく、バグの影響も受けやすく、リファクタリングも難しいため、このアプローチは推奨されません。代わりに最も良い方法は、各「Square」コンポーネントではなく、親の「Board」コンポーネントにゲームの状態を保存することです。親の「Board」コンポーネントは、各「Square」に数値を渡したように、プロップを使って各「Square」にどう表示するかを指示することができます。

**複数の子からデータを収集する場合や、2つの子コンポーネントがお互いに通信する必要がある場合には、親コンポーネントに共有する状態を宣言します。親コンポーネントは、その状態をプロップを介して子コンポーネントに戻すことができます。これにより、子コンポーネントはお互いと親コンポーネントと同期されます。**

Reactコンポーネントをリファクタリングする場合、ステートを親コンポーネントにリフトアップすることはよくあります。

この機会にやってみましょう。まず、「Board」コンポーネントを編集して、9つのnullに対応する9つの要素の配列である「squares」という名前のステート変数を宣言します。

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

ここで、`Array(9).fill(null)` を使って9つの要素を持ち、それぞれをnullに設定した配列を作成しています。それを初期値として持つ`squares`ステート変数を宣言しています。配列内の各要素は1つのマスの値に相当します。後でボードに値を埋めた場合、`squares`配列は以下のようになります。

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

そして、`Board`コンポーネントは各`Square`コンポーネントに`value`プロップを渡す必要があります。

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

次に、`Square` コンポーネントを編集して、`Board` コンポーネントから `value` props を受け取るようにします。このため、`Square` コンポーネント内で `value` を追跡する状態とボタンの `onClick` props を削除する必要があります。

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

ここまでくると、空の三目並べのボードが表示されるはずです：

![empty board](../images/tutorial/empty-board.png)

そして、コードは以下のようになります：

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

各`Square`コンポーネントには、`value`プロパティが渡されます。これは、空きの場合は`null`、 `'X'`または`'O'`が入るものとします。

さて、`Square`コンポーネントをクリックしたときの動作を変更する必要があります。`Board`コンポーネントがいまや、どのスクエアが埋まっているかを管理しているので、`Square`コンポーネントが`Board`状態を更新するようにする必要があります。Reactコンポーネントの状態はプライベートなので、 `Square`から直接`Board`の状態を更新することはできません。

その代わりに、 `Board`コンポーネントから `Square`コンポーネントに関数を渡し、 `Square`がスクエアをクリックしたときにその関数を呼び出すようにします。まず、 `Square`がクリックされたときに呼び出される関数を定義します。この関数を `onSquareClick` と呼びましょう。

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

次に、 `Square`コンポーネントのpropsに `onSquareClick` 関数を追加します。

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

最後に、`onSquareClick` を`Board`コンポーネントに存在する `handleClick` 関数に接続します。最初の`Square`コンポーネントの `onSquareClick`プロパティに関数を渡すことで、 `onSquareClick`を `handleClick`に接続できます。

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

最後に、`Board`コンポーネントの中に `handleClick` 関数を定義し、ボードの状態を保持する`squares`配列を更新します。

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

The `handleClick` function creates a copy of the `squares` array (`nextSquares`) with the JavaScript `slice()` Array method. Then, `handleClick` updates the `nextSquares` array to add `X` to the first (`[0]` index) square.

Calling the `setSquares` function lets React know the state of the component has changed. This will trigger a re-render of the components that use the `squares` state (`Board`) as well as its child components (the `Square` components that make up the board).

<Note>

JavaScript supports [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) which means an inner function (e.g. `handleClick`) has access to variables and functions defined in a outer function (e.g. `Board`). The `handleClick` function can read the `squares` state and call the `setSquares` method because they are both defined inside of the `Board` function.

</Note>

Now you can add X's to the board...  but only to the upper left square. Your `handleClick` function is hardcoded to update the index for the upper left square (`0`). Let's update `handleClick` to be able to update any square. Add a argument `i` to the `handleClick` function that takes the index of the square that should be updated:

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

Now there is a new problem!

Try setting the `onSquareClick` prop of square to be `handleClick(0)` directly in the JSX like this:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

The `handleClick(0)` call will be a part of rendering the board component. Because `handleClick(0)` alters the state of the board component by calling `setSquares`, your entire board component will be re-rendered again. But `handleClick(0)` is now a part of rendering of the board component, and so you've created an infinite loop:

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

Why didn't this problem happen earlier?

When you were passing `onSquareClick={handleClick}`, you were passing the `handleClick` function down as a prop. You were not calling it! But now you are *calling* that function right away--notice the parentheses in `handleClick(0)`--and that's why it runs too early. You don't *want* to call `handleClick` until the user clicks!

To fix this, you could create a function like `handleFirstSquareClick` that calls `handleClick(0)`, a function like `handleSecondSquareClick` that calls `handleClick(1)`, and so on. Instead of calling them, you would pass these functions down as props like `onSquareClick={handleFirstSquareClick}`. This would solve the infinite loop.

However, defining nine different functions and giving each of them a name is too verbose. Instead, let's do this:

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

`() => handleClick(0)` という新しい書き方に注目してください。この `() =>` という構文は*アロー関数*と呼ばれ、関数を定義する際の短縮記法です。ここでは、マスがクリックされたときに、`=>` の後のコードである `handleClick(0)` が実行されます。

次に、残りの 8 つのマスから `handleClick` を呼び出すようにアロー関数を渡すようにアップデートしてください。その際、各 `handleClick` へ渡す引数が正しいマスのインデックスに対応していることを確認してください。

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

これで、マスをクリックすると X を配置することができます。

![filling the board with X](../images/tutorial/tictac-adding-x-s.gif)

しかも、すべての状態管理が `Board` コンポーネントで完結しています！

以下が最終的なコードです。

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

`Board` コンポーネントに state 処理が組み込まれ、`Square` コンポーネントには親コンポーネントから props として渡されているため、正しく表示することができます。`Square` をクリックすると、子コンポーネントである `Square` コンポーネントが親である `Board` コンポーネントに対して盤面の状態を更新するように要求します。`Board` の状態が変更されると、`Board` コンポーネントと全ての `Square` コンポーネントが自動的に再描画されます。すべてのマスの状態を `Board` コンポーネントの state に保持することで、将来的に勝者を決定できるようになります。

一旦、ユーザーが盤面の右上のマス目をクリックして `X` を追加する場合の流れを振り返ってみましょう。

1. 右上のマスクリック時、「button」が受け取った「onClick」props である関数が実行されます。この関数は、`Square` が `Board` から `onSquareClick` props を受け取り、`Board` から JSX の中で直接この関数を定義し、 `handleClick` 関数を引数`0` で呼び出します。
1. `handleClick` は引数（`0`）を使用して、 `squares` 配列の 1 番目の要素を `null` から `X` に更新します。
1. `Board` の `squares` state が更新されたので、 `Board` とその全ての子コンポーネントが再描画されます。これにより、インデックス `0` の `Square`コンポーネントの `value` props が `null` から `X` に変更されることになります。

最終的に、ユーザーはマスをクリックした後、右上のマス目に「X」が表示されていることに気づくでしょう。

<Note>

DOM の `<button>` タグには `onClick` 属性があり、React 上ではビルトインコンポーネントとして特別な意味を持ちます。 `Square` のようなカスタムコンポーネントにおいては、このような命名はご自由に決めてください。 `Square` の `onSquareClick` props や `Board` の `handleClick` 関数に任意の名前を付けることができ、コードの動作には影響がありません。React の慣習的な命名方法では、イベントを表す props には `on[Event]` という名前を、イベントを処理する関数には `handle[Event]` という名前を使用することが一般的です。

</Note>

### なぜイミュータビリティーが重要か {/*why-immutability-is-important*/}

`handleClick` の実装では、配列 `squares` を変更する代わりに、コピーを作成する `.slice()` を呼び出しています。なぜこのように実装する必要があるかについて説明します。これには、イミュータビリティーが何か、またその重要性について理解する必要があります。

データを変更する方法には、大きく分けて２つのアプローチがあります。１つ目が、データ自体の値を直接変更して、データを変更する方法です。２つ目は、欲しい変更が入った新しいコピーを作成して、元のデータを置き換える方法です。以下は `squares` 配列を変更する場合にそれぞれのアプローチを用いた場合の実装例です。

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

And here is what it would look like if you changed data without mutating the `squares` array:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

最終的な結果は同じですが、元のデータを変更するのではなく、データを直接変更せずにコピーを作成することで、多くの利点が得られます。

イミュータビリティーは、複雑なアプリケーションの開発を大幅に容易にします。このチュートリアルでは後で、「タイムトラベル」と呼ばれるゲームの進行状況を確認し、過去の手番に「戻る」という機能を実装します。この機能は、ゲームに限らず、アプリの中で一部のアクションを「やり直す」/「取り消す」という機能は一般的な要求です。データを直接変更せずに、以前のデータを保持でき、必要に応じて再利用したり後から参照したりすることができます。

イミュータビリティーにはもう一つの利点があります。親コンポーネントの状態を変更すると、自動的にすべての子コンポーネントが再描画されます。たとえ変更されていない子のコンポーネントであっても再描画されます。再描画自体がユーザにとっては見えないことが多いので (積極的に避けるべきではありません！)、明らかに影響を受けない部分の描画をスキップできるようにすることがパフォーマンスの観点から必要になる場合があります。イミュータビリティーを採用することで、コンポーネントがデータの変更を比較するのが非常に容易になります。React がコンポーネントを再描画するタイミングについては、こちらの [`memo`API リファレンス](/reference/react/memo) のドキュメントで学ぶことができます。

### ターンを交代する {/*taking-turns*/}

この〇×ゲームにある大きな不具合を修正する時間がやってきました: 「O」がボードにマークできません。

最初の手番はデフォルトで「X」とします。Boardコンポーネントにもう一つのstate（状態）を追加して、これを追跡しましょう。

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

各プレイヤーが動くたびに、`xIsNext`（ブール値）が反転して、次に誰がプレイするかが決まり、ゲームの状態が保存されます。`Board`の`handleClick`関数を更新して、`xIsNext`の値を反転させるようにします。

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

これで、異なるマスをクリックする度に、左右交互に「X」と「O」が表示されるようになりました。

しかし、問題があります。同じマスを複数回クリックしてみてください。

![OがXを上書きしている様子](../images/tutorial/o-replaces-x.gif)

「X」が「O」に上書きされてしまいます！これはゲームに非常に興味深いウィットを加えるかもしれませんが、今のところは元のルールに従うことにします。

「X」または「O」をマスにマークする前に、そのマスにすでに「X」または「O」の値がないかを確認していないため、問題が発生しています。これを修正するには、*早めにリターンする*必要があります。まず、クリックされているマスに「X」または「O」があるかどうかを確認します。マスが既に埋まっている場合は、`handleClick`関数がボードの状態を更新する前に早期に`return`します。

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

これで空のマスにだけ「X」または「O」を追加できるようになりました！ここまでのコードは以下のようになっています:

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

### Declaring a winner {/*declaring-a-winner*/}

次に、誰のターンかを表示するようになったので、ゲームが勝利されてもう手が残っていない場合にも勝利したプレイヤーを表示しましょう。これを行うには、`calculateWinner` というヘルパー関数を追加します。この関数は、9つのマス目の配列を受け取り、勝者がいる場合は `'X'`、`'O'`、または `null` を返します。`calculateWinner` 関数自体は React に特化したものではないので、この関数を実装することについてはあまり心配する必要はありません。

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

`calculateWinner` 関数の定義が `Board` コンポーネントの定義の前に来ていても構いません。今回は、定義がなるべくファイルの最後に来るようにしましょう。そうすれば、コンポーネントを編集するたびに関数を通り過ぎる必要がなくなります。

</Note>

ゲームの勝者をチェックするために、`Board` コンポーネントの `handleClick` 関数で `calculateWinner(squares)` を呼び出します。そして、すでに `X` または `O` が入力されたマスをクリックした場合と同時にこのチェックを行います。どちらの場合も、それ以上の処理を行わずに関数から早く抜け出します。

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

プレイヤーが勝利した場合は、「Winner: X」とか「Winner: O」といったテキストを表示することができます。そこで、`Board` コンポーネントに `status` セクションを追加します。`status` は、勝者がいる場合はそのプレイヤーを表示し、ゲームが続いている場合は次に手を打つプレイヤーを表示します。

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
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

おめでとうございます！これで完動する三目並べゲームができました。同時に React の基礎も学びました。あなたは本当の勝者です。ここにコードが載っています：

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

## タイムトラベルを追加する {/*adding-time-travel*/}

最終課題として、ゲーム内で前の動きに「戻る」ことができるようにしましょう。

### 手番の履歴を保存する {/*storing-a-history-of-moves*/}

もし`squares`配列を変更していたら、タイムトラベルを実装するのは非常に困難でしょう。

しかし、毎回の手番ごとに `slice()` を使って新しい `squares` 配列のコピーを作成して、不変に扱うことで、過去の全ての `squares` 配列のバージョンを保存し、すでに行われた手番に移動することができます。

過去の`squares` 配列を保持するために、新しい状態変数として `history` という別の配列に保存します。`history` 配列は、最初の手番から最後の手番までの全ての盤面状態を表しており、以下のような形式を持っています。

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

### 再びステートのリフトアップ {/*lifting-state-up-again*/}

過去の手番を一覧表示する新しいトップレベルのコンポーネントである `Game` を作成することで、`history` ステートを全ての手番の履歴を保持するようにします。

`history` ステートを `Game` コンポーネントにまとめることで、`Board` コンポーネントから `squares` ステートを取り除くことができます。`Square` コンポーネントから `Board` コンポーネントへステートをリフトアップしたのと同じように、今度は `Board` コンポーネントからトップレベルの `Game` コンポーネントへステートをリフトアップすることになります。これにより、`Game` コンポーネントが `Board` のデータを完全に制御し、`history` から以前の手番を描画するよう `Board` に指示することができます。

まず、`export default` で `Game` コンポーネントを追加し、その中でマークアップ内に `Board` コンポーネントをレンダリングするようにします。

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

ここで、`function Board() {` 宣言の前にあった `export default` キーワードを削除し、`function Game() {` 宣言の前に追加するようにします。これにより、`index.js` で `Game` コンポーネントをトップレベルとして使用するように設定されます。`Game` コンポーネント内の `div` 要素は、後で追加するゲーム情報のために必要なスペースを作っています。

次に、プレーヤーが次に打つ番の情報と、過去の手番の情報を追跡するために、`Game` コンポーネントにいくつかのステートを追加しましょう。

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

`[Array(9).fill(null)]` は 1 個の要素を持つ配列であることに注意してください。この 1 個の要素は 9 個の `null` で構成される別の配列です。

現在の手番のマス目を描画するために、`history` から最後の `squares` 配列を読み込む必要があります。これには、`useState` は必要ありません - レンダリング中に計算するために必要な情報がすでに十分に用意されています。

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

次に、`Board` コンポーネントからゲームを更新するために呼び出される `handlePlay` 関数を、`Game` コンポーネント内に作成します。`Board` コンポーネントに `xIsNext`、`currentSquares` および `handlePlay` をプロップスとして渡します。

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

`Board` コンポーネントを完全に props によって制御されるようにしましょう。そのためには、 `Board` コンポーネントに `xIsNext`、 `squares`、そしてゲームのプレイヤーが場所をクリックした際に更新される `squares` 配列を受け取るための新しい `onPlay` 関数の３つのプロパティを追加します。次に、`Board` 関数の最初の2行を削除して、`useState` を呼び出さなくてもよくなります。以下のようになります。

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

そして `Board` コンポーネントの `handleClick` 内の `setSquares` と `setXIsNext` の呼び出しを、 `Game` コンポーネントがエラーなく更新できるように、引数として渡されている `onPlay` 関数を呼び出すように変更します。

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

`Board`コンポーネントは、`Game`コンポーネントから渡されるpropsによって完全に制御されています。ゲームをもう一度動作させるために`Game`コンポーネント内に`handlePlay``関数を実装する必要があります。

`handlePlay`が呼び出されたときにどのような処理を実行する必要がありますか？`Board`は以前、更新された配列を示す`setSquares`を呼び出していました。しかし、今では更新された`squares`配列を`onPlay`に渡しているため、新しい処理が必要です。

呼び出された場合は、`handlePlay`関数は`Game`の状態を更新して再描画をトリガーする必要がありますが、もう`setSquares`関数を呼び出すことはできません。代わりに、この情報を保存するために`history`ステート変数を使用しています。`history`を更新して、更新された`squares`配列を新しい履歴エントリとして追加する必要があります。また、Boardが行っていたように、`xIsNext`を切り替えたいと思うでしょう。

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

ここでは、`[...history, nextSquares]`は'history'の全アイテムに続いて 'nextSquares'を含む、新しい配列を作成します（spread syntaxとして知られているものを` ...` `で表現しています）。

たとえば、 `history`が `[[null, null, null], ["X", null, null]] `で、 `nextSquares`が `["X", null, "O"] `である場合、新しい `[...history, nextSquares]`配列は `[[null, null, null], ["X", null, null], ["X", null, "O"]] `になります。

この時点で、ステートを`Game`コンポーネントに移動し、UIが再構築されるようにすることができました。ここでは、コードはリファクタリング前と同じように動作するはずです。この時点で、コードは以下のようになります。

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

### 過去の手番の表示 {/*showing-the-past-moves*/}

今、三目並べのゲームの履歴を記録することができたので、それを過去の手番のリストとしてプレイヤーに表示することができます。

`<button>` のような React 要素は通常の JavaScript のオブジェクトであり、アプリケーション中で取り回すことができます。React には複数の要素を表示するために、React 要素の配列が使われます。

すでに `history` の配列をステートとして持っているため、それを React 要素の配列に変換する必要があります。JavaScript において、一つの配列を別の配列に変換するには、[配列の `map` メソッド](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/map)を使用することができます。

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

`map` を使って、`history` の各手番を画面上のボタンを表す React 要素の配列に変換し、過去の手番に「ジャンプ」できるボタンのリストを表示することができます。Game コンポーネントで `history` を `map` しましょう。

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

上記が正しいコードになります。ただし、開発者ツールのコンソールには、「`Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.」というエラーが表示されます。このエラーについては、次のセクションで修正します。 

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

`map()` メソッドに渡した関数内で、`history` 配列を反復処理しています。そして、配列要素が毎回 `squares` の値に設定されており、`move` 引数は `0`、`1`、`2`... と、それぞれの配列のインデックスを表しています。通常、配列要素自体を使用する必要がありますが、今回の場合は、動いた場所の情報が必要ないため、 `squares` は使用しません。

ゲームの履歴に含まれるそれぞれの着手に対して、`<li>`要素と、その中に含まれる`<button>`要素を作成します。その`<button>`には、アンクリックイベントが設定されており、未実装の `jumpTo` 関数が呼び出されます。

今は、ゲームの中で発生した着手のリストと、開発者向けツールのコンソールにエラーが表示されるはずです。

では、この「key」に関連したエラーが何を意味するのかについて、説明します。

### キーの選び方 {/*picking-a-key*/}

リストをレンダーすると、React は各レンダーされたリスト アイテムに関する情報を保持します。リストを更新する場合、React は何が変更されたかを判断する必要があります。リストのアイテムを追加、削除、並べ替え、更新していたかもしれません。

以下のようにある 2 つのアイテムから、

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

以下のアイテムに移行した場合、

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

更新されたカウント数に加えて、人間がこれを読むと、Alexa と Ben の順序が入れ替わり、Alexa と Ben の間に Claudia が挿入されたと思うかもしれません。しかし、React はコンピュータのプログラムであり、意図を知ることができないため、各リスト アイテムを兄弟要素と区別するために、_キー_ プロパティを指定する必要があります。データベースからデータを取得している場合、Alexa、Ben、Claudia のデータベース ID をキーとして使用できます。

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

リストを再レンダリングする場合、React は各リスト項目のキーを調べ、前回のリスト項目とマッチするものを探します。現在のリストに前回存在しなかったキーがある場合、React はコンポーネントを作成します。現在のリストに前回存在していたキーがない場合、React は前回のコンポーネントを削除します。2 つのキーが一致する場合、対応するコンポーネントは移動します。

キーを使用することで、各コンポーネントの ID を React に伝えることができ、React は再レンダリングの間、コンポーネントの状態を保持することができます。コンポーネントのキーが変更された場合、コンポーネントは削除され、新しい状態で再作成されます。

`key` は React で特別な予約語であり、コンポーネントの生成時に React が `key` のプロパティを抽出して、返された要素に直接キーを格納します。`key` はプロパティに見えますが、React は自動的に `key` を使用して、コンポーネントを更新するかどうかを判断します。コンポーネントが親が指定した `key` に対してどのような `key` を要求することはできません。

**動的なリストを作成する場合には、適切な `key` を割り当てることを強くお勧めします。** 適切なキーがない場合は、データ構造を再構築してください。

キーが指定されていない場合、React はエラーを報告し、デフォルトで配列のインデックスを使用します。配列のインデックスをキーとして使用すると、リスト項目の並べ替えや挿入/削除時に問題が発生する可能性があります。`key={i}` を明示的に渡すとエラーが消えますが、配列のインデックスと同じ問題があります。ほとんどの場合、これはお勧めできません。

キーは、グローバルに一意である必要はありません。ただし、兄弟要素との間で一意である必要があります。

### タイムトラベルを実装する {/*implementing-time-travel*/}

三目並べゲームの履歴では、各過去の手番にはそれぞれユニークな ID が割り当てられます。それは手番の順序数です。手番は再順序化、削除、途中での挿入は一切行われないので、手番インデックスをキーとして利用することができます。

`Game` 関数内で、キーを `<li key={move}>` として追加し、レンダリングされたゲームを再読み込みすると、React の「キーがない」エラーが消えるようになります。

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

現在ユーザーがどの手番を見ているかを追跡するために、`Game` コンポーネントに新しいステート変数 `currentMove` を定義して初期値を `0` に設定します。

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

次に、`Game` 内の `jumpTo` 関数を更新して `currentMove` を更新します。また、`currentMove` に変更する数値が偶数である場合は `xIsNext` を `true` に設定します。

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

You will now make two changes to the `Game`'s `handlePlay` function which is called when you click on a square.

- If you "go back in time" and then make a new move from that point, you only want to keep the history up to that point. Instead of adding `nextSquares` after all items (`...` spread syntax) in `history`, you'll add it after all items in `history.slice(0, currentMove + 1)` so that you're only keeping that portion of the old history.
- Each time a move is made, you need to update `currentMove` to point to the latest history entry.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

最後に、Game コンポーネントを変更して、常に最後の手だけでなく、現在選択されている手をレンダリングするようにします。:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

履歴のどのステップをクリックしても、ゲームのマス目がそのステップが起こった後のボードをすぐに表示するようになります。

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

### Final cleanup {/*final-cleanup*/}

コードをよく見ると、`currentMove` が偶数のときに `xIsNext === true` であり、`currentMove` が奇数のときに `xIsNext === false` であることがわかります。つまり、`currentMove` の値を知っていれば、常に `xIsNext` の値がわかります。

このために[state](#state)に両方を格納する必要はありません。実際、重複したステートを避けるように常に心がけてください。ステートで格納するものを単純化すると、バグを減らし、コードを理解しやすくすることができます。`Game`を変更して、`xIsNext`を単一のステート変数として保存するのではなく、`currentMove`に基づいて計算するようにしてください：

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

これにより、`xIsNext`ステート宣言と `setXIsNext`の呼び出しは不要になりました。コンポーネントのコーディング中に誤りがあった場合でも、`xIsNext`が`currentMove`と同期しなくなることはありません。

### まとめ {/*wrapping-up*/}

おめでとうございます！tic-tac-toe ゲームを作成しました。これにより、

- tic-tac-toe をプレイすることができます。
- プレイヤーが勝利したときに勝利を示します。
- ゲームが進むにつれてゲームの履歴を保存します。
- プレイヤーがゲームの履歴を見直し、以前のボードのバージョンを見ることができます。

素晴らしい仕事でした！React の動きについて一定程度の理解ができたのではないでしょうか。

最終的な結果はこちらで確認できます：

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

余裕がある場合や新しい React のスキルを練習するために、次のような tic-tac-toe ゲームの改善アイデアがあります：

1. 現在の手番に応じて、ボタンではなく「現在の手番は#です」と表示する。
2. `Board` を書き換えて、四角形をハードコーディングではなく 2 つのループを使って生成するようにする。
3. 昇順と降順を切り替えるトグルボタンを追加する。
4. どちらかが勝利した場合、勝利につながった 3 つのマスをハイライト表示する（引き分けの場合、引き分けの結果を表示する）。
5. 毎手の位置を (column, row) 形式で履歴リストに表示する。

このチュートリアルでは、要素・コンポーネント・プロップス・ステートなどの React の概念に触れてきました。これらの概念がどのようにアプリケーションの UI を構築するときに動作するかを確認できました。次は [React の考え方](/learn/thinking-in-react) を見て、同じ React の概念がどのようにアプリの UI を作成するときに操作するかを確認しましょう。
