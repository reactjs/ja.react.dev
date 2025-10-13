---
title: <Fragment> (<>...</>)
---

<Intro>

<<<<<<< HEAD
`<Fragment>` を使うことで、ラッパ用のノードを用いずに要素をグループ化することができます。通常は `<>...</>` という構文で使用されます。
=======
`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node. 

<Canary> Fragments can also accept refs, which enable interacting with underlying DOM nodes without adding wrapper elements. See reference and usage below.</Canary>
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

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

<<<<<<< HEAD
- **省略可能** `key`: 明示的な `<Fragment>` 構文で宣言されたフラグメントは [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) を持つことができます。
=======
- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
- <CanaryBadge />  **optional** `ref`: A ref object (e.g. from [`useRef`](/reference/react/useRef)) or [callback function](/reference/react-dom/components/common#ref-callback). React provides a `FragmentInstance` as the ref value that implements methods for interacting with the DOM nodes wrapped by the Fragment.

### <CanaryBadge /> FragmentInstance {/*fragmentinstance*/}

When you pass a ref to a fragment, React provides a `FragmentInstance` object with methods for interacting with the DOM nodes wrapped by the fragment:

**Event handling methods:**
- `addEventListener(type, listener, options?)`: Adds an event listener to all first-level DOM children of the Fragment.
- `removeEventListener(type, listener, options?)`: Removes an event listener from all first-level DOM children of the Fragment.
- `dispatchEvent(event)`: Dispatches an event to a virtual child of the Fragment to call any added listeners and can bubble to the DOM parent.

**Layout methods:**
- `compareDocumentPosition(otherNode)`: Compares the document position of the Fragment with another node.
  - If the Fragment has children, the native `compareDocumentPosition` value is returned. 
  - Empty Fragments will attempt to compare positioning within the React tree and include `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
  - Elements that have a different relationship in the React tree and DOM tree due to portaling or other insertions are `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC`.
- `getClientRects()`: Returns a flat array of `DOMRect` objects representing the bounding rectangles of all children.
- `getRootNode()`: Returns the root node containing the Fragment's parent DOM node.

**Focus management methods:**
- `focus(options?)`: Focuses the first focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `focusLast(options?)`: Focuses the last focusable DOM node in the Fragment. Focus is attempted on nested children depth-first.
- `blur()`: Removes focus if `document.activeElement` is within the Fragment.

**Observer methods:**
- `observeUsing(observer)`: Starts observing the Fragment's DOM children with an IntersectionObserver or ResizeObserver.
- `unobserveUsing(observer)`: Stops observing the Fragment's DOM children with the specified observer.
>>>>>>> 0d05d9b6ef0f115ec0b96a2726ab0699a9ebafe1

#### 注意点 {/*caveats*/}

- `key` をフラグメントに渡したい場合は、`<>...</>` 構文を使用することはできません。`'react'` から `Fragment` を明示的にインポートし、`<Fragment key={yourKey}>...</Fragment>` とレンダーしなければなりません。

- React は、`<><Child /></>` と `[<Child />]` のレンダー間、あるいは `<><Child /></>` と `<Child />` のレンダー間で行き来する場合に [state をリセット](/learn/preserving-and-resetting-state)しません。これは単一レベルの深さのときのみの動作です。例えば、`<><><Child /></></>` から `<Child />` への変更では state がリセットされます。具体的な振る舞いの詳細は[こちら](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)を参照してください。

- <CanaryBadge /> If you want to pass `ref` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment ref={yourRef}>...</Fragment>`.

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

フラグメントが有用なのは、DOM 要素のような他のコンテナで要素をラップする場合と異なり、フラグメントで要素をグループ化してもレイアウトやスタイルに影響を与えないからです。以下の例をブラウザツールでインスペクト（inspect, 調査）してみると、すべての `<h1>` や `<article>` DOM ノードがラップされずに兄弟として表示されることがわかります。

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

---

### <CanaryBadge /> Using Fragment refs for DOM interaction {/*using-fragment-refs-for-dom-interaction*/}

Fragment refs allow you to interact with the DOM nodes wrapped by a Fragment without adding extra wrapper elements. This is useful for event handling, visibility tracking, focus management, and replacing deprecated patterns like `ReactDOM.findDOMNode()`.

```js
import { Fragment } from 'react';

function ClickableFragment({ children, onClick }) {
  return (
    <Fragment ref={fragmentInstance => {
      fragmentInstance.addEventListener('click', handleClick);
      return () => fragmentInstance.removeEventListener('click', handleClick);
    }}>
      {children}
    </Fragment>
  );
}
```
---

### <CanaryBadge /> Tracking visibility with Fragment refs {/*tracking-visibility-with-fragment-refs*/}

Fragment refs are useful for visibility tracking and intersection observation. This enables you to monitor when content becomes visible without requiring the child Components to expose refs:

```js {19,21,31-34}
import { Fragment, useRef, useLayoutEffect } from 'react';

function VisibilityObserverFragment({ threshold = 0.5, onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVisibilityChange(entries.some(entry => entry.isIntersecting))
      },
      { threshold }
    );
    
    fragmentRef.current.observeUsing(observer);
    return () => fragmentRef.current.unobserveUsing(observer);
  }, [threshold, onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

function MyComponent() {
  const handleVisibilityChange = (isVisible) => {
    console.log('Component is', isVisible ? 'visible' : 'hidden');
  };

  return (
    <VisibilityObserverFragment onVisibilityChange={handleVisibilityChange}>
      <SomeThirdPartyComponent />
      <AnotherComponent />
    </VisibilityObserverFragment>
  );
}
```

This pattern is an alternative to Effect-based visibility logging, which is an anti-pattern in most cases. Relying on Effects alone does not guarantee that the rendered Component is observable by the user.

---

### <CanaryBadge /> Focus management with Fragment refs {/*focus-management-with-fragment-refs*/}

Fragment refs provide focus management methods that work across all DOM nodes within the Fragment:

```js
import { Fragment, useRef } from 'react';

function FocusFragment({ children }) {
  const fragmentRef = useRef(null);

  return (
    <Fragment ref={(fragmentInstance) => fragmentInstance?.focus()}>
      {children}
    </Fragment>
  );
}
```

The `focus()` method focuses the first focusable element within the Fragment, while `focusLast()` focuses the last focusable element.
