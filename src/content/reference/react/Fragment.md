---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>` は頻繁に `<>...</>` 構文で使用され、ノードでラップせずに要素をグループ化することができます。

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<Fragment>` {/*fragment*/}

単一の要素が必要な場合は、`<Fragment>` でラップすると複数の要素をグループ化することができます。`Fragment` で要素をグループ化しても、出力される DOM には影響を与えません。要素がグループ化されていないときと同じです。空の JSX タグ `<></>` は、ほとんどの場合 `<Fragment></Fragment>` の省略記法です。

#### props {/*props*/}

- **省略可能** `key`: 明示的な `<Fragment>` 構文で宣言されたフラグメントは [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key) を持つことができます。

#### 注意点 {/*caveats*/}

- `key` をフラグメントに渡したい場合は、`<>...</>` 構文を使用することはできません。`'react'` から `Fragment` を明示的にインポートし、`<Fragment key={yourKey}>...</Fragment>` をレンダーしなければなりません。

- React は、`<><Child /></>` のレンダーから `[<Child />]` に変更されるときか戻るとき、または `<><Child /></>` のレンダーから `<Child />` に変更されるときや戻るときは [state はリセット](/learn/preserving-and-resetting-state)されません。これは 1 つの階層のときのみ動作します：例えば、`<><><Child /></></>` から `<Child />` への変更は state がリセットされます。詳細なセマンティクス（semantics, 意味論）は[こちら](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)を参照してください。
---

## 使用法 {/*usage*/}

### 複数の要素を返す {/*returning-multiple-elements*/}

複数の要素をグループ化するために `Fragment` や同等の `<>...</>` 構文を使用することができます。単一の要素が行き来できる場所ならどこでも、複数の要素を配置することができます。例えば、1 つのコンポーネントは 1 つの要素しか返すことができませんが、フラグメントを使用すれば複数の要素を一度にグループ化して、それらをグループとして返します。

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

フラグメントは便利です。なぜなら、DOM 要素のような他のコンテナで要素をラップする場合と異なり、フラグメントで要素をグループ化してもレイアウトやスタイルに影響を与えないからです。この例を、ブラウザツールでインスペクト（inspect, 調査）してみると、全ての `<h1>` や `<article>` DOM ノードがラップされずに兄弟として表示されることがわかります。

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### 特別な構文を使わずに Fragment をどのように記述するか？ {/*how-to-write-a-fragment-without-the-special-syntax*/}

上述の例は、React から `Fragment` をインポートすることと同じです：

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

通常なら [`Fragment` に `key` を渡す](#rendering-a-list-of-fragments) 場合以外では必要ありません。
</DeepDive>

---

### 複数の要素を変数に割り当てる {/*assigning-multiple-elements-to-a-variable*/}

他の要素と同じように、フラグメントの要素を変数に割り当てたり、props として渡したりすることができます：

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### テキストと要素をグループ化する {/*grouping-elements-with-text*/}

`Fragment` を使うとテキストとコンポーネントを一度にグループ化することができます：

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Fragment のリストをレンダーする {/*rendering-a-list-of-fragments*/}

こちらは `<></>` 構文の代わりに `Fragment` を明示的に記述する必要がある場面です。ループ内で[複数の要素をレンダーする](/learn/rendering-lists)ときには、各要素に `key` を割り当てる必要があります。ループ内の要素がフラグメントの場合は、`key` 属性を提供するために通常の JSX 要素の構文を使用する必要があります。

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

フラグメントの子要素のまわりにラッパー要素がないことを確認するために、DOM をインスペクトできます：

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
