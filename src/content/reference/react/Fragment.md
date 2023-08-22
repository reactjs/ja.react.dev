---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>` を使うことで、ラッパ用のノードを用いずに要素をグループ化することができます。通常は `<>...</>` という構文で使用されます。

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

単一の要素が必要な場面で、複数の要素を `<Fragment>` でラップすることでグループ化することができます。`Fragment` で要素をグループ化しても、出力される DOM には影響を与えません。要素がグループ化されていないときと同じです。空の JSX タグ `<></>` は、ほとんどの場合 `<Fragment></Fragment>` の省略記法です。

#### props {/*props*/}

- **省略可能** `key`: 明示的な `<Fragment>` 構文で宣言されたフラグメントは [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) を持つことができます。

#### 注意点 {/*caveats*/}

- `key` をフラグメントに渡したい場合は、`<>...</>` 構文を使用することはできません。`'react'` から `Fragment` を明示的にインポートし、`<Fragment key={yourKey}>...</Fragment>` とレンダーしなければなりません。

- React は、`<><Child /></>` と `[<Child />]` のレンダー間、あるいは `<><Child /></>` と `<Child />` のレンダー間で行き来する場合に [state をリセット](/learn/preserving-and-resetting-state)しません。これは単一レベルの深さのときのみの動作です。例えば、`<><><Child /></></>` から `<Child />` への変更では state がリセットされます。具体的な振る舞いの詳細は[こちら](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)を参照してください。

---

## 使用法 {/*usage*/}

### 複数の要素を返す {/*returning-multiple-elements*/}

複数の要素をグループ化するために `Fragment` や、それと同等の `<>...</>` 構文を使用することができます。これにより単一の要素が置ける場所であればどこにでも、複数の要素を配置することができるようになります。例えば、コンポーネントは 1 つの要素しか返すことができませんが、フラグメントを使用すれば複数の要素をまとめて、グループとして返せます。

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

フラグメントが有用なのは、DOM 要素のような他のコンテナで要素をラップする場合と異なり、フラグメントで要素をグループ化してもレイアウトやスタイルに影響を与えないからです。以下の例をブラウザツールでインスペクト（inspect, 調査）してみると、全ての `<h1>` や `<article>` DOM ノードがラップされずに兄弟として表示されることがわかります。

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

#### 特別な構文を使わずにフラグメントを記述する方法 {/*how-to-write-a-fragment-without-the-special-syntax*/}

上述の例は、React から `Fragment` をインポートして以下のように書くことと同じです。

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

[`Fragment` に `key` を渡す](#rendering-a-list-of-fragments)場合以外では、通常必要ありません。

</DeepDive>

---

### 複数の要素を変数に割り当てる {/*assigning-multiple-elements-to-a-variable*/}

他の要素と同じように、フラグメントも要素として変数に割り当てたり、props として渡したりすることができます：

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

`Fragment` を使うとテキストとコンポーネントをグループ化することができます：

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

### フラグメントのリストをレンダーする {/*rendering-a-list-of-fragments*/}

こちらは `<></>` 構文の代わりに `Fragment` を明示的に記述する必要がある場面です。ループ内で[複数の要素をレンダーする](/learn/rendering-lists)ときには、各要素に `key` を割り当てる必要があります。ループ内の要素がフラグメントの場合は、`key` 属性を渡すために通常の JSX 要素の構文を使用する必要があります。

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

DOM をインスペクトすると、フラグメントの子要素のまわりにラッパ要素がないことを確認できます。

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
