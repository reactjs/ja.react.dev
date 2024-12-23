---
title: クイックスタート
---

<Intro>

React ドキュメントへようこそ！ このページでは、日々の開発で使用する React のコンセプトのうち 80％ の部分を紹介します。

</Intro>

<YouWillLearn>

- コンポーネントの作成とネスト
- マークアップとスタイルの追加
- データの表示
- 条件分岐とリストのレンダー
- イベントへの応答と画面の更新
- コンポーネント間でのデータの共有

</YouWillLearn>

## コンポーネントの作成とネスト {/*components*/}

React アプリは*コンポーネント*で構成されています。コンポーネントとは、独自のロジックと外見を持つ UI（ユーザインターフェース）の部品のことです。コンポーネントは、ボタンのような小さなものである場合も、ページ全体を表す大きなものである場合もあります。

React におけるコンポーネントとは、マークアップを返す JavaScript 関数です。

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

`MyButton` を宣言したら、別のコンポーネントにネストできます。

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

`<MyButton />` が大文字で始まっていることに注意してください。こうすることで、React のコンポーネントであるということを示しています。React のコンポーネント名は常に大文字で始める必要があり、HTML タグは小文字でなければなりません。

結果を見てみましょう。

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

`export default` キーワードは、ファイル内のメインコンポーネントを指定しています。このような JavaScript の構文に関して分からない部分があれば、[MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) や [javascript.info](https://javascript.info/import-export) に素晴らしいリファレンスがあります。

## JSX でマークアップを書く {/*writing-markup-with-jsx*/}

上で見たマークアップ構文は、*JSX* と呼ばれるものです。使用は任意ですが、その便利さゆえにほとんどの React プロジェクトでは JSX が使用されています。[ローカル開発におすすめのツール](/learn/installation)は、すべて JSX に対応しています。

JSX は HTML より構文が厳格です。`<br />` のようにタグは閉じる必要があります。また、コンポーネントは複数の JSX タグを return することはできません。`<div>...</div>` や空の `<>...</>` ラッパのような共通の親要素で囲む必要があります。

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

JSX に変換しないといけない HTML がたくさんある場合は、[オンラインコンバータ](https://transform.tools/html-to-jsx)を使うことができます。

## スタイルの追加 {/*adding-styles*/}

React では、CSS クラスを `className` で指定します。HTML の [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) 属性と同じ方法で動作します。

```js
<img className="avatar" />
```

そして、別の CSS ファイルに対応する CSS ルールを記述します：

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React には CSS ファイルの追加方法に関する規則はありません。最も単純なケースでは、HTML に [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) タグを追加します。ビルドツールやフレームワークを使っている場合は、そちらのドキュメントを参照して、プロジェクトに CSS ファイルを追加する方法を確認してください。

## データの表示 {/*displaying-data*/}

JSX を使うことで、JavaScript 内にマークアップを入れることができます。波括弧を使うことで、逆に JSX の中から JavaScript に「戻る」ことができ、コード内の変数を埋め込んでユーザに表示することができます。たとえば、以下は `user.name` を表示します：

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

JSX の属性 (attribute) の部分から JavaScript に「戻る」こともでき、その場合引用符の*代わりに*波括弧を使う必要があります。例えば、`className="avatar"` は CSS クラスとして `"avatar"` 文字列を渡すものですが、`src={user.imageUrl}` は JavaScript の `user.imageUrl` 変数の値を読み込み、その値を `src` 属性として渡します：

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

JSX の波括弧の中にもっと複雑な式を入れることもできます。例えば、[文字列の連結](https://javascript.info/operators#string-concatenation-with-binary)ができます：

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

上記の例では、`style={{}}` は特別な構文ではなく、`style={ }` という JSX の波括弧内にある通常の `{}` オブジェクトです。スタイルが JavaScript 変数に依存する場合は、`style` 属性を使うことができます。

## 条件付きレンダー {/*conditional-rendering*/}

React には、条件分岐を書くための特別な構文は存在しません。代わりに、通常の JavaScript コードを書くときに使うのと同じ手法を使います。例えば、[`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) ステートメントを使って条件付きで JSX を含めることができます：

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

コンパクトなコードをお望みの場合は、[条件 `?` 演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)を使用できます。`if` とは異なり、JSX の中で動作します。

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

`else` 側の分岐が不要な場合は、短い[論理 `&&` 構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation)を使用することもできます。

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

これらのアプローチはすべて、属性を条件付きで指定する場合にも機能します。このような JavaScript 構文の一部に慣れていないという場合、最初は常に `if...else` を使用することにしても構いません。

## リストのレンダー {/*rendering-lists*/}

コンポーネントのリストをレンダーする場合は、[`for` ループ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) や [配列の `map()` 関数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) といった JavaScript の機能を使って行います。

例えばこのような商品の配列があるとします：

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

コンポーネント内で、`map()` 関数を使って商品の配列を `<li>` 要素の配列に変換します：

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

`<li>` に `key` 属性があることに注意してください。リスト内の各項目には、兄弟の中でそれを一意に識別するための文字列または数値を渡す必要があります。通常、key はデータから来るはずで、データベース上の ID などが該当します。React は、後でアイテムを挿入、削除、並べ替えることがあった際に、何が起こったかを key を使って把握します。

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## イベントに応答する {/*responding-to-events*/}

コンポーネントの中で*イベントハンドラ*関数を宣言することで、イベントに応答できます：

```js {2-4,7}
function MyButton() {
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

`onClick={handleClick}` の末尾に括弧がないことに注意してください！ そこでイベントハンドラ関数を*呼び出す*わけではありません。*渡すだけ*です。ユーザがボタンをクリックしたときに、React がイベントハンドラを呼び出します。

## 画面の更新 {/*updating-the-screen*/}

しばしば、コンポーネントに情報を「記憶」させて表示したいことがあります。例えば、ボタンがクリックされた回数を数えて覚えておきたい場合です。これを行うには、コンポーネントに *state* を追加します。

まず、React から [`useState`](/reference/react/useState) をインポートします。

```js
import { useState } from 'react';
```

これで、コンポーネント内に *state 変数*を宣言できます：

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState` からは 2 つのものが得られます。現在の state (`count`) と、それを更新するための関数 (`setCount`) です。名前は何でも構いませんが、慣習的には `[something, setSomething]` のように記述します。

ボタンが初めて表示されるとき、`count` は `0` になります。これは `useState()` に `0` を渡したからです。state を変更したいときは、`setCount()` を呼び出し、新しい値を渡します。このボタンをクリックすると、カウンタが増加します：

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React は、再度コンポーネントの関数を呼び出します。今度は `count` が `1` になっています。次の呼び出しでは `2` になっています。次々と増えていきます。

同じコンポーネントを複数の場所でレンダーした場合、それぞれが独自の state を持ちます。それぞれのボタンを個別にクリックしてみてください：

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

各ボタンがそれぞれ `count` という state を「記憶」し、他のボタンに影響を与えないことに注意してください。

## フックの使用 {/*using-hooks*/}

`use` で始まる関数は、*フック* (Hook) と呼ばれます。`useState` は React が提供する組み込みのフックです。[API リファレンス](/reference/react)で他の組み込みフックを見ることができます。また、既存のフックを組み合わせて独自のフックを作成することもできます。

フックには通常の関数より多くの制限があります。フックはコンポーネントの*トップレベル*（または他のフック内）でのみ呼び出すことができます。条件分岐やループの中で `useState` を使いたい場合は、新しいコンポーネントを抽出してそこに配置します。

## コンポーネント間でデータを共有する {/*sharing-data-between-components*/}

前述の例では、それぞれの `MyButton` が独立した `count` を持っており、ボタンがクリックされるたびにクリックされたボタンの `count` だけが変更されました。

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="MyApp という名前の親コンポーネントと MyButton という名前の 2 つの子コンポーネントを持つツリーを示す図。どちらの MyButton コンポーネントも、カウントの値は 0。">

最初、それぞれの `MyButton` の `count` は `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="前の図と同じだが、1 番目の MyButton コンポーネントのカウントがクリックされ、カウント値が 1 に増えている。2 番目の MyButton コンポーネントの値は 0 のまま。">

1 番目の `MyButton` が `count` を `1` に更新

</Diagram>

</DiagramGroup>

ただし、コンポーネント間で*データを共有し、常に一緒に更新したい*ということもよくあります。

両方の `MyButton` コンポーネントが同じ `count` を表示し、一緒に更新されるようにするには、状態を個々のボタンから「上に」移動して、それらすべてを含む最も近いコンポーネントに入れます。

この例では、`MyApp` がそれです：

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="MyApp という名前の親コンポーネントと、MyButton という名前の 2 つの子コンポーネントを持つツリーを示す図。MyApp には値が 0 のカウントが含まれ、それが両方の MyButton コンポーネントに渡される。値は 0。">

最初、`MyApp` の `count` は `0` で、どちらの子もそれを受け取っている。

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="前の図と同じだが、親 MyApp コンポーネントのカウントがクリックによりハイライトされ、値が 1 になっている。子 MyButton コンポーネントも両方ハイライトされ、それぞれの子のカウント値が 1 になっている。値が下に渡されたことを示している。">

クリック時に `MyApp` が `count` を `1` に更新し、それが両方の子に渡される

</Diagram>

</DiagramGroup>

こうすれば、どちらのボタンをクリックしても、`MyApp` の `count` が更新され、連動して `MyButton` の両方のカウントが更新されるでしょう。以下は、コードでこれを表現する方法です。

まず、`MyButton` から `MyApp` に、*state の移動*を行います。

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

次に、`MyApp` から各 `MyButton` に *state を渡し*、共有のクリックハンドラも一緒に渡します。以前に `<img>` のような組み込みタグで行ったときと同様、JSX の波括弧を使うことで `MyButton` に情報を渡すことができます。

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

このように渡される情報は *props* と呼ばれます。`MyApp` コンポーネントは `count` 状態と `handleClick` イベントハンドラを保持しており、それらを*どちらも props として*各ボタンに渡します。

最後に、`MyButton` を変更して、親コンポーネントから渡された props を*読み込む*ようにします。

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

ボタンをクリックすると、`onClick` ハンドラが発火します。各ボタンの `onClick` プロパティは `MyApp` 内の `handleClick` 関数となっているので、その中のコードが実行されます。そのコードは `setCount(count + 1)` を呼び出し、`count` という state 変数をインクリメントします。新しい `count` の値が各ボタンに props として渡されるため、すべてのボタンに新しい値が表示されます。この手法は「state のリフトアップ（持ち上げ）」と呼ばれています。リフトアップすることで、state をコンポーネント間で共有できました。

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## 次のステップ {/*next-steps*/}

これで、React のコードを書く基本が分かったことになります！

[チュートリアル](/learn/tutorial-tic-tac-toe)をチェックして、これらの概念を実践し、React を使った最初のミニアプリを作成しましょう。
