---
id: lists-and-keys
title: リストと key
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

まず、JavaScript でリストを変換する方法についておさらいしましょう。

以下のコードでは、[`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 関数を用い、`numbers` という配列を受け取って中身の値を 2 倍しています。`map()` 関数が返す新しい配列を変数 `doubled` に格納し、ログに出力します：

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

このコードはコンソールに `[2, 4, 6, 8, 10]` と出力します。

React では配列を[要素](/docs/rendering-elements.html)のリストに変換することが、ほぼこれと同様のものです。

### 複数のコンポーネントをレンダーする {#rendering-multiple-components}

要素の集合を作成し中括弧 `{}` で囲むことで [JSX に含める](/docs/introducing-jsx.html#embedding-expressions-in-jsx)ことができます。

以下では、JavaScript の `map()` 関数を利用して、`numbers` という配列に対して反復処理を行っています。それぞれの整数に対して `<li>` 要素を返しています。最後に、結果として得られる要素の配列を `listItems` に格納しています：

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

そして、`listItems` という配列全体を `<ul>` 要素の内側に含めます：

```javascript{2}
<ul>{listItems}</ul>
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

このコードは、1 から 5 までの数字の箇条書きのリストを表示します。

### 基本的なリストコンポーネント {#basic-list-component}

通常、リストは何らかの[コンポーネント](/docs/components-and-props.html)の内部でレンダーしたいと思うでしょう。

前の例をリファクタリングして、`numbers` という配列を受け取って要素のリストを出力するコンポーネントを作ることができます。

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NumberList numbers={numbers} />);
```

このコードを実行すると、「リスト項目には key を与えるべきだ」という警告を受け取るでしょう。"key" とは特別な文字列の属性であり、要素のリストを作成する際に含めておく必要があるものです。なぜ key が重要なのか、次の節で説明します。

`numbers.map()` 内のリスト項目に `key` を割り当てて、key が見つからないという問題を修正しましょう。

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Key {#keys}

Key は、どの要素が変更、追加もしくは削除されたのかを React が識別するのに役立ちます。配列内の項目に安定した識別性を与えるため、それぞれの項目に key を与えるべきです。

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

兄弟間でその項目を一意に特定できるような文字列を key として選ぶのが最良の方法です。多くの場合、あなたのデータ内にある ID を key として使うことになるでしょう：

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

レンダーされる要素に安定した ID がない場合、最終手段として項目のインデックスを使うことができます：

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

要素の並び順が変更される可能性がある場合、インデックスを key として使用することはお勧めしません。パフォーマンスに悪い影響を与え、コンポーネントの状態に問題を起こす可能性があります。Robin Pokorny による、[key としてインデックスを用いる際の悪影響についての詳しい解説](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318)をご覧ください。

より詳しく学びたい場合はこちらの [key が必要である詳細な理由](/docs/reconciliation.html#recursing-on-children)をご覧ください。

### key のあるコンポーネントの抽出 {#extracting-components-with-keys}

key が意味を持つのは、それをとり囲んでいる配列の側の文脈です。

例えば、`ListItem` コンポーネントを抽出する際には、key は `ListItem` 自体の `<li>` 要素に書くのではなく、配列内の `<ListItem />` 要素に残しておくべきです。

**例： 不適切な key の使用法**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Wrong! There is no need to specify the key here:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Wrong! The key should have been specified here:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

**例： 正しい key の使用法**

```javascript{2,3,9,10}
function ListItem(props) {
  // Correct! There is no need to specify the key here:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Correct! Key should be specified inside the array.
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

基本ルールとしては、`map()` 呼び出しの中に現れる要素に key が必要です。

### key は兄弟要素の中で一意であればよい {#keys-must-only-be-unique-among-siblings}

配列内で使われる key はその兄弟要素の中で一意である必要があります。しかしグローバルに一意である必要はありません。2 つの異なる配列を作る場合は、同一の key が使われても構いません：

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Blog posts={posts} />);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

key は React へのヒントとして使われますが、あなたが書くコンポーネントには渡されません。同じ値をコンポーネントの中でも必要としている場合は、別の名前の prop として明示的に渡してください：

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

上記の例では、`Post` コンポーネントは `props.id` を読み取ることができますが、`props.key` は読み取れません。

### map() を JSX に埋め込む {#embedding-map-in-jsx}

上記の例では `listItems` 変数を別途宣言して、それを JSX に含めました：

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX では[任意の式を埋め込む](/docs/introducing-jsx.html#embedding-expressions-in-jsx)ことができますので、`map()` の結果をインライン化することもできます。

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

時としてこの結果はよりすっきりしたコードとなりますが、この記法は乱用されることもあります。普通の JavaScript でそうであるように、読みやすさのために変数を抽出する価値があるかどうか決めるのはあなたです。`map()` の中身がネストされすぎている場合は、[コンポーネントに抽出](/docs/components-and-props.html#extracting-components)する良いタイミングかもしれない、ということにも留意してください。
