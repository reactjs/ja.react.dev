---
title: イベントへの応答
---

<Intro>

React では、JSX に*イベントハンドラ*を追加できます。イベントハンドラとは、クリック、ホバー、フォーム入力へのフォーカスといったユーザ操作に応答してトリガされる、あなた独自の関数です。

</Intro>

<YouWillLearn>

* イベントハンドラを記述するさまざまな方法
* 親コンポーネントからイベント処理ロジックを渡す方法
* イベントの伝播のしかたとそれを停止する方法

</YouWillLearn>

## イベントハンドラの追加 {/*adding-event-handlers*/}

イベントハンドラを追加するには、まず関数を定義し、適切な JSX タグに [props の一部として渡します](/learn/passing-props-to-a-component)。例として、以下にまだ何もしないボタンを示します。

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

ユーザがクリックするとメッセージが表示されるようにするには、以下の 3 つの手順を実行します。

1. `Button` コンポーネントの*内部*で `handleClick` という関数を宣言します。
2. その関数内にロジックを実装します（ここでは `alert` を使ってメッセージを表示）。
3. `<button>` の JSX に `onClick={handleClick}` を追加します。

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

`handleClick` 関数を定義し、それを `<button>` に [props として渡しました](/learn/passing-props-to-a-component)。この `handleClick` が**イベントハンドラ**です。イベントハンドラ関数は：

* 通常、コンポーネントの*内部*で定義されます。
* イベント名の先頭に `handle` が付いた名前にします。

慣習的に、イベントハンドラは `handle` にイベント名を続けて命名することが一般的です。`onClick={handleClick}`、`onMouseEnter={handleMouseEnter}` などがよく見られます。

また、JSX の中でイベントハンドラをインラインで定義することもできます。

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

または、より簡潔にアロー関数を使って記述することもできます。

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

これらのスタイルはすべて同じです。インラインのイベントハンドラは、短い関数の場合に便利です。

<Pitfall>

イベントハンドラに渡す関数は、渡すべきなのであって、呼び出すべきではありません。例えば：

| 関数を渡す（正しい）               | 関数を呼び出す（誤り）               |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

微妙に違いますね。最初の例では、`handleClick` 関数が `onClick` イベントハンドラとして渡されています。これは、React にこの関数を覚えておいて、ユーザがボタンをクリックしたときにのみコールするように指示します。

2 つ目の例では、`handleClick()` の末尾に `()` があるため、クリックを必要とせず[レンダー](/learn/render-and-commit)の際に*すぐに*関数を実行します。これは、[JSX の `{` と `}`](/learn/javascript-in-jsx-with-curly-braces)の中の JavaScript はすぐに実行されるためです。

インラインでコードを書くときにも、以下のように同様の落とし穴が別の形で現れます。

| 関数を渡す（正しい）                      | 関数を呼び出す（間違い）            |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


このようなインラインコードを渡すと、クリックしたときではなく、コンポーネントがレンダーされるたびに実行されます。

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

イベントハンドラをインラインで定義したい場合は、以下のように無名関数でラップしてください。

```jsx
<button onClick={() => alert('You clicked me!')}>
```

これで、レンダーごとに中のコードが実行されるのではなく、後で呼び出してもらうための関数を作成したことになります。

どちらの場合であっても、渡したいのは関数です。

* `<button onClick={handleClick}>` は `handleClick` 関数を渡します。
* `<button onClick={() => alert('...')}>` は、`() => alert('...')` という関数を渡します。

[アロー関数についての詳細はこちら](https://javascript.info/arrow-functions-basics)。

</Pitfall>

### イベントハンドラでの props の読み取り {/*reading-props-in-event-handlers*/}

イベントハンドラはコンポーネント内に宣言されているため、コンポーネントの props にアクセスできます。以下は、クリックされたときに `message` プロパティの内容をアラートで表示するボタンです。

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

これにより、これらの 2 つのボタンは異なるメッセージを表示できます。渡されるメッセージを変更してみてください。

### イベントハンドラを props として渡す {/*passing-event-handlers-as-props*/}

よくあるケースとして、親コンポーネントが子のイベントハンドラを指定したい場合があります。ボタンを考えてみましょう：`Button` というコンポーネントには、使用する場所によって、動画を再生する、画像をアップロードするなど、異なる関数を実行させたいことでしょう。

これを行うには、以下のようにして、コンポーネントが親から受け取った props をイベントハンドラとして渡します：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

この例では、`Toolbar` コンポーネントは `PlayButton` と `UploadButton` をレンダーしています：

- `PlayButton` は `handlePlayClick` を内部 `Button` の `onClick` プロパティとして渡しています。
- `UploadButton` は `() => alert('Uploading!')` を内部 `Button` の `onClick` プロパティとして渡しています。

最後に、`Button` コンポーネントは props として `onClick` を受け取ります。それを `onClick={onClick}` としてブラウザの組み込み `<button>` に直接渡しています。これにより、クリック時に React は渡された関数を呼び出すようになります。

[デザインシステム](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)を使用している場合、ボタンなどのコンポーネントはスタイリングを含んでいるが振る舞いは指定されないことが一般的です。代わりに、`PlayButton` や `UploadButton` のようなコンポーネントがイベントハンドラを渡します。

### イベントハンドラの props の命名 {/*naming-event-handler-props*/}

`<button>` や `<div>` のような組み込みコンポーネントは、`onClick` のような[ブラウザのイベント名](/reference/react-dom/components/common#common-props)のみをサポートしています。ただし、独自のコンポーネントを作成する場合、イベントハンドラとなる props を、好きなように命名できます。

慣習として、イベントハンドラのプロップは `on` で始まり、次に大文字の文字が続くようにします。

たとえば、`Button` コンポーネントの props である `onClick` は `onSmash` と命名することも可能です：

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

この例の `<button onClick={onSmash}>` を見ると分かるように、ブラウザの `<button>`（小文字）は常に props として `onClick` が必要ですが、カスタム `Button` コンポーネントが受け取る props の名前はあなた次第です！

コンポーネントが複数種類のインタラクションをサポートする場合、イベントハンドラの props をアプリ固有の概念に基づいて名付けることができます。例えば、この `Toolbar` コンポーネントは `onPlayMovie` と `onUploadImage` というイベントハンドラを受け取ります：

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

`App` コンポーネントは、`Toolbar` が `onPlayMovie` や `onUploadImage` に対して*何*を行うかを知る必要がないことに注意してください。それは `Toolbar` の実装の詳細です。ここでは、`Toolbar` はそれらを `Button` の `onClick` ハンドラとして渡していますが、後でキーボードショートカットでもそれらをトリガするようにすることができます。`onPlayMovie` のようなアプリ固有のインタラクションに基づいて props を名付けることで、後でどのように使用されるかを変更できるという柔軟性が得られます。

## イベント伝播 {/*event-propagation*/}

イベントハンドラは、コンポーネントが持っている可能性のあるどの子からのイベントであってもそれをキャッチします。このことをイベントがツリーを "バブリング (bubble)" または "伝播 (propagate)" する、と表現します。イベントは発生した場所から始まり、ツリーを上に向かって進んでいきます。

この `<div>` には 2 つのボタンが含まれています。`<div>` とそれぞれのボタン、*両方が*独自の `onClick` ハンドラを持っていますね。ボタンをクリックすると、どのハンドラが実行されると思いますか？

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

どちらのボタンをクリックしても、最初にそれ自体の `onClick` が実行され、その後で親である `<div>` の `onClick` が実行されます。つまりメッセージが 2 つ表示されます。ツールバー自体をクリックすると、親の `<div>` の `onClick` のみが実行されます。

<Pitfall>

React では `onScroll` 以外のすべてのイベントが伝播します。`onScroll` は、それをアタッチした JSX タグでのみ機能します。

</Pitfall>

### 伝播の停止 {/*stopping-propagation*/}

イベントハンドラは、**イベントオブジェクト**を唯一の引数として受け取ります。慣習的に、それは "event" を意味する `e` と呼ばれています。このオブジェクトを使用して、イベントに関する情報を読み取ることができます。

このイベントオブジェクトを使い、伝播を止めることもできます。イベントが親コンポーネントに伝わらないようにしたい場合、以下の `Button` コンポーネントのようにして `e.stopPropagation()` を呼び出す必要があります：

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

ボタンをクリックすると以下のことが起こります。

1. React が `<button>` に渡された `onClick` ハンドラを呼び出す。
2. そのハンドラは `Button` で定義されており、次のことを行う。
   * `e.stopPropagation()` を呼び出し、イベントがさらにバブリングされるのを防ぐ。
   * `Toolbar` コンポーネントから渡された props である `onClick` 関数を呼び出す。
3. その関数は `Toolbar` コンポーネントで定義されており、そのボタン固有のアラートを表示する。
4. 伝播が停止されたため、親の `<div>` の `onClick` ハンドラは*実行されない*。

`e.stopPropagation()` の結果、ボタンをクリックすると、アラートが 2 つ（`<button>` と親のツールバーの `<div>` から）ではなく、1 つだけ（`<button>` のみから）表示されるようになります。ボタンをクリックすることと、周囲のツールバーの余白をクリックすることは別物なので、この UI では伝播を止めることが理にかなっています。

<DeepDive>

#### キャプチャフェーズのイベント {/*capture-phase-events*/}

まれに、*伝播が停止されても*子要素のすべてのイベントをキャッチしたいという場合があります。たとえば、伝播のロジックに関係なく、すべてのクリックを分析のため記録したい場合などです。これを行うには、イベント名の末尾に `Capture` を追加します。

```js
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

すべてのイベントは 3 つのフェーズで伝播します。

1. 下方向に移動し、すべての `onClickCapture` ハンドラを呼び出す。
2. クリックされた要素自体の `onClick` ハンドラを実行する。
3. 上方向に移動し、すべての `onClick` ハンドラを呼び出す。

キャプチャイベントはルータや分析のようなコードで役立ちますが、アプリケーションコードで使用することはほとんどありません。

</DeepDive>

### 伝播の代わりにハンドラを渡す {/*passing-handlers-as-alternative-to-propagation*/}

このクリックハンドラは、親から渡された `onClick` を呼び出す*前に*、1 行コードを実行していることに注目してください。

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

親の `onClick` イベントハンドラを呼び出す前に、このハンドラにさらにコードを追加することもできるでしょう。このパターンは、伝播の*代替手段*になります。子コンポーネントにイベントを処理させつつ、親コンポーネントが追加の動作を指定できるようになるのです。伝播とは異なり、これは自動的に起こることではありません。しかし、このパターンの利点は、あるイベントが発生した結果として実行されるコードのすべての繋がりをはっきりと追跡できることです。

イベント伝播に依存していて、どのハンドラがどのような理由で実行されているのかを追跡することが困難な場合は、代わりにこのアプローチを試してください。

### デフォルト動作を防ぐ {/*preventing-default-behavior*/}

ブラウザのイベントには、デフォルトの動作が関連付けられているものがあります。例えば、`<form>` の submit イベントは、その中のボタンがクリックされると、デフォルトではページ全体がリロードされます。

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

イベントオブジェクトの `e.preventDefault()` を呼び出して、これを防ぐことができます。

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

`e.stopPropagation()` と `e.preventDefault()` を混同しないでください。どちらも有用ですが、無関係です。

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) は、ツリーの上側にあるタグにアタッチされたイベントハンドラが発火しないようにします。
* [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) は、数は少ないですがイベントがブラウザデフォルトの動作を持っていた場合に、それを抑制します。

## イベントハンドラは副作用を持っていても構わない？ {/*can-event-handlers-have-side-effects*/}

もちろんです！ イベントハンドラは副作用のための最適な場所です。

レンダー関数とは異なり、イベントハンドラは[純関数 (pure function)](/learn/keeping-components-pure) である必要はないので、何かを*変更*するのに最適な場所です。たとえば、入力値をタイプに応じて変更する、ボタンの押下に応じてリストを変更する、などです。ただし、情報を変更するためには、まずそれを格納する方法が必要です。React では、これは [state、コンポーネントのメモリ](/learn/state-a-component-memory)を使用して行います。次のページでそのすべてを学びます。

<Recap>

* イベントは、`<button>` などの要素に関数を props として渡すことで処理できます。
* イベントハンドラは渡す必要があります。**呼び出してはいけません！** `onClick={handleClick}` とするのであって、`onClick={handleClick()}` としてはいけません。
* イベントハンドラ関数は別途定義することも、インラインで定義することもできます。
* イベントハンドラはコンポーネント内に定義されているため、props にアクセスできます。
* 親でイベントハンドラを宣言し、子に props として渡すことができます。
* イベントハンドラ props を定義する際にアプリケーション固有の名前をつけることができます。
* イベントは上方向に伝播します。これを防ぐには、最初の引数を使って `e.stopPropagation()` を呼び出します。
* イベントは、望ましくないデフォルトのブラウザ動作を持つことがあります。これを防ぐには、`e.preventDefault()` を呼ぶ必要があります。
* 子コンポーネントでイベントハンドラを定義して props から受け取ったハンドラを明示的に呼び出すことは、伝播の代替手段として良い方法です。

</Recap>



<Challenges>

#### イベントハンドラを修正 {/*fix-an-event-handler*/}

このボタンをクリックすると、ページの背景が白と黒の間で切り替わることになっています。ただし、クリックしても何も起こりません。問題を修正してください（`handleClick` 内部のロジックについては心配無用です。そこは問題ありません）。

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

問題は、`<button onClick={handleClick()}>` がレンダー時に `handleClick` 関数を*呼び出す*のではなく、*渡す*べきだということです。`()` の呼び出しを削除して `<button onClick={handleClick}>` にすることで、問題が修正されます。

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

または、別の関数にラップして、`<button onClick={() => handleClick()}>` のようにすることもできます。

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### イベントを接続 {/*wire-up-the-events*/}

この `ColorSwitch` コンポーネントは、ボタンをレンダーしています。このボタンはページの色を変更することになっています。親から props として受け取っている `onChangeColor` イベントハンドラをボタンに接続して、ボタンをクリックすると色が変わるようにしてください。

また、ボタンをクリックすると、ページのクリックカウンタも増加していることに注意してください。この親コンポーネントを書いた同僚は、`onChangeColor` 関数にはカウンタを増やすコードなどないと言い張っています。ではほかに何かが起こっているのでしょうか？ ボタンをクリックしても*色が変わるだけ*で、カウンタは*増えない*ように、修正してください。

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

まずはイベントハンドラを追加する必要があります。`<button onClick={onChangeColor}>` のようになります。

ただし、これによりカウンタが増加する問題が発生します。同僚が主張している通り `onChangeColor` がこれをやっているのでないのであれば、このイベントが上に伝播して、どこかのハンドラがそれを行っているのでしょう。この問題を解決するには、伝播を停止する必要があります。ただし `onChangeColor` を呼び出すことを忘れないでください。

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
