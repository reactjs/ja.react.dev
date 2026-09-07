---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>` を使うことで、ラッパ用のノードを用いずに要素をグループ化することができます。通常は `<>...</>` という構文で使用されます。

<Canary> フラグメントは ref を受け取ることもでき、これによりラッパ要素を追加することなく、内部の DOM ノードとやり取りできます。</Canary>

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
- <CanaryBadge /> **省略可能** `ref`: ref オブジェクト（例えば [`useRef`](/reference/react/useRef) からのもの）または[コールバック関数](/reference/react-dom/components/common#ref-callback)。React は、フラグメントでラップされた DOM ノードとやり取りするためのメソッドを実装した `FragmentInstance` を ref の値として提供します。

#### 注意点 {/*caveats*/}

* `key` をフラグメントに渡したい場合は、`<>...</>` 構文を使用することはできません。`'react'` から `Fragment` を明示的にインポートし、`<Fragment key={yourKey}>...</Fragment>` とレンダーしなければなりません。

* React は、`<><Child /></>` と `[<Child />]` のレンダー間、あるいは `<><Child /></>` と `<Child />` のレンダー間で行き来する場合に [state をリセット](/learn/preserving-and-resetting-state)しません。これは単一レベルの深さのときのみの動作です。例えば、`<><><Child /></></>` から `<Child />` への変更では state がリセットされます。具体的な振る舞いの詳細は[こちら](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)を参照してください。

* <CanaryBadge /> `ref` をフラグメントに渡したい場合は、`<>...</>` 構文を使用することはできません。`'react'` から `Fragment` を明示的にインポートし、`<Fragment ref={yourRef}>...</Fragment>` のようにレンダーしなければなりません。

---

### <CanaryBadge /> `FragmentInstance` {/*fragmentinstance*/}

フラグメントに `ref` を渡すと、React は `FragmentInstance` オブジェクトを提供します。このオブジェクトには、フラグメントでラップされた第 1 レベルの DOM 子ノードとやり取りするためのメソッドが実装されています。

* [`addEventListener`](#addeventlistener) と [`removeEventListener`](#removeeventlistener) は、第 1 レベルにあるすべての DOM 子ノードのイベントリスナを管理します。
* [`dispatchEvent`](#dispatchevent) はフラグメント上でイベントをディスパッチします。このイベントは DOM の親へバブリングできます。
* [`focus`](#focus)、[`focusLast`](#focuslast)、[`blur`](#blur) は、ネストされたすべての子要素を深さ優先でたどってフォーカスを管理します。
* [`observeUsing`](#observeusing) と [`unobserveUsing`](#unobserveusing) は、`IntersectionObserver` または `ResizeObserver` のインスタンスを登録および登録解除します。
* [`getClientRects`](#getclientrects) は、第 1 レベルにあるすべての DOM 子要素の境界矩形を返します。
* [`getRootNode`](#getrootnode) は、フラグメントの親のルートノードを返します。
* [`compareDocumentPosition`](#comparedocumentposition) は、フラグメントと別のノードとの位置関係を比較します。
* [`scrollIntoView`](#scrollintoview) は、フラグメントの子要素が見える位置までスクロールします。

---

#### `addEventListener(type, listener, options?)` {/*addeventlistener*/}

フラグメントの第 1 レベルにあるすべての DOM 子ノードにイベントリスナを追加します。

```js
fragmentRef.current.addEventListener('click', handleClick);
```

##### 引数 {/*addeventlistener-parameters*/}

* `type`: リッスンするイベントの種類（例えば `'click'`、`'focus'`）を表す文字列。
* `listener`: イベントハンドラ関数。
* **省略可能** `options`: キャプチャに関するオプションオブジェクトまたはブーリアン値。[DOM の `addEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) と同じ形式です。

##### 返り値 {/*addeventlistener-returns*/}

`addEventListener` は何も返しません (`undefined`)。

---

#### `removeEventListener(type, listener, options?)` {/*removeeventlistener*/}

フラグメントの第 1 レベルにあるすべての DOM 子ノードからイベントリスナを削除します。

```js
fragmentRef.current.removeEventListener('click', handleClick);
```

##### 引数 {/*removeeventlistener-parameters*/}

* `type`: イベントの種類を表す文字列。
* `listener`: 削除するイベントハンドラ関数。
* **省略可能** `options`: オプションオブジェクトまたはブーリアン値。[DOM の `removeEventListener` API](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener) と同じ形式です。

##### 返り値 {/*removeeventlistener-returns*/}

`removeEventListener` は何も返しません (`undefined`)。

---

#### `dispatchEvent(event)` {/*dispatchevent*/}

フラグメント上でイベントをディスパッチします。登録されているイベントリスナが呼び出され、イベントはフラグメントの DOM の親へバブリングできます。

```js
fragmentRef.current.dispatchEvent(new Event('custom', { bubbles: true }));
```

##### 引数 {/*dispatchevent-parameters*/}

* `event`: ディスパッチする [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) オブジェクト。`bubbles` が `true` の場合、イベントはフラグメントの親 DOM ノードへバブリングします。

##### 返り値 {/*dispatchevent-returns*/}

イベントがキャンセルされなかった場合は `true`、`preventDefault()` が呼び出された場合は `false` です。

---

#### `focus(options?)` {/*focus*/}

フラグメント内で最初に見つかるフォーカス可能な DOM ノードにフォーカスを当てます。DOM 要素で `element.focus()` を呼び出す場合とは異なり、このメソッドは要素自体やその直接の子だけでなく、ネストされた*すべての*子を深さ優先で検索し、フォーカス可能な要素を探します。

```js
fragmentRef.current.focus();
```

##### 引数 {/*focus-parameters*/}

* **省略可能** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) オブジェクト（例えば `{ preventScroll: true }`）。

##### 返り値 {/*focus-returns*/}

`focus` は何も返しません (`undefined`)。

---

#### `focusLast(options?)` {/*focuslast*/}

フラグメント内で最後に見つかるフォーカス可能な DOM ノードにフォーカスを当てます。ネストされた子を深さ優先で検索した後、逆順にたどります。

```js
fragmentRef.current.focusLast();
```

##### 引数 {/*focuslast-parameters*/}

* **省略可能** `options`: [`FocusOptions`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#options) オブジェクト。

##### 返り値 {/*focuslast-returns*/}

`focusLast` は何も返しません (`undefined`)。

---

#### `blur()` {/*blur*/}

アクティブな要素がフラグメント内にある場合、その要素からフォーカスを外します。`document.activeElement` がフラグメント内にない場合、`blur` は何もしません。

```js
fragmentRef.current.blur();
```

##### 返り値 {/*blur-returns*/}

`blur` は何も返しません (`undefined`)。

---

#### `observeUsing(observer)` {/*observeusing*/}

渡されたオブザーバを使用して、フラグメントの第 1 レベルにあるすべての DOM 子要素の監視を開始します。

```js
const observer = new IntersectionObserver(callback, options);
fragmentRef.current.observeUsing(observer);
```

##### 引数 {/*observeusing-parameters*/}

* `observer`: [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) または [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) のインスタンス。

##### 返り値 {/*observeusing-returns*/}

`observeUsing` は何も返しません (`undefined`)。

---

#### `unobserveUsing(observer)` {/*unobserveusing*/}

指定されたオブザーバによるフラグメントの DOM 子要素の監視を停止します。

```js
fragmentRef.current.unobserveUsing(observer);
```

##### 引数 {/*unobserveusing-parameters*/}

* `observer`: 以前に [`observeUsing`](#observeusing) に渡したものと同じ `IntersectionObserver` または `ResizeObserver` のインスタンス。

##### 返り値 {/*unobserveusing-returns*/}

`unobserveUsing` は何も返しません (`undefined`)。

---

#### `getClientRects()` {/*getclientrects*/}

第 1 レベルにあるすべての DOM 子要素の境界矩形を表す [`DOMRect`](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) オブジェクトのフラットな配列を返します。

```js
const rects = fragmentRef.current.getClientRects();
```

##### 返り値 {/*getclientrects-returns*/}

すべての子要素の境界矩形を含む `Array<DOMRect>`。

---

#### `getRootNode(options?)` {/*getrootnode*/}

フラグメントの親 DOM ノードを含むルートノードを返します。[`Node.getRootNode()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode) と同じ動作です。

```js
const root = fragmentRef.current.getRootNode();
```

##### 引数 {/*getrootnode-parameters*/}

* **省略可能** `options`: ブーリアン型の `composed` プロパティを持つオブジェクト。[DOM の `getRootNode` API](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode#options) と同じ形式です。

##### 返り値 {/*getrootnode-returns*/}

`Document`、`ShadowRoot`、または親 DOM ノードがない場合は `FragmentInstance` 自体を返します。

---

#### `compareDocumentPosition(otherNode)` {/*comparedocumentposition*/}

フラグメントと別のノードとのドキュメント上の位置関係を比較し、[`Node.compareDocumentPosition()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition) と同様のビットマスクを返します。

```js
const position = fragmentRef.current.compareDocumentPosition(otherElement);
```

##### 引数 {/*comparedocumentposition-parameters*/}

* `otherNode`: 比較対象の DOM ノード。

##### 返り値 {/*comparedocumentposition-returns*/}

[位置フラグ](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition#return_value)のビットマスク。空のフラグメント、および[ポータル](/reference/react-dom/createPortal)を介してレンダーされた子要素を持つフラグメントでは、結果に `Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC` が含まれます。

---

#### `scrollIntoView(alignToTop?)` {/*scrollintoview*/}

フラグメントの子要素が見える位置までスクロールします。`alignToTop` が `true` または省略されている場合、最初の子要素がスクロール可能な祖先の上端に揃うようにスクロールします。`alignToTop` が `false` の場合、最後の子要素が下端に揃うようにスクロールします。

```js
fragmentRef.current.scrollIntoView();
```

##### 引数 {/*scrollintoview-parameters*/}

* **省略可能** `alignToTop`: ブーリアン。`true`（デフォルト）の場合、最初の子要素がスクロール可能な領域の上端に来るようにスクロールします。`false` の場合、最後の子要素が下端に来るようにスクロールします。[`Element.scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) とは異なり、このメソッドは `ScrollIntoViewOptions` オブジェクトを受け取りません。

##### 返り値 {/*scrollintoview-returns*/}

`scrollIntoView` は何も返しません (`undefined`)。

##### 注意点 {/*scrollintoview-caveats*/}

* `scrollIntoView` はオプションオブジェクトを受け取りません。渡すとエラーがスローされます。代わりにブーリアン `alignToTop` を使用してください。
* フラグメントに子がない場合、`scrollIntoView` はフォールバックとして、最も近い兄弟または親が見える位置までスクロールします。

---

#### `FragmentInstance` の注意点 {/*fragmentinstance-caveats*/}

* 子ノードを対象とするメソッド（`addEventListener`、`observeUsing`、`getClientRects` など）は、フラグメントの*第 1 レベルのホスト (DOM) 子ノード*を操作します。別の DOM 要素内にネストされた子ノードを直接の対象にはしません。
* `focus` と `focusLast` は、フォーカス可能な要素を探して、ネストされた子要素を深さ優先で検索します。第 1 レベルのホスト子ノードのみを対象とするイベントメソッドやオブザーバメソッドとは異なります。
* `observeUsing` はテキストノードに対しては動作しません。フラグメントにテキストの子しか含まれていない場合、React は開発用環境で警告をログに出力します。
* React は、`addEventListener` で追加されたイベントリスナを、非表示になっている [`<Activity>`](/reference/react/Activity) ツリーには適用しません。`Activity` バウンダリが非表示から表示に切り替わると、リスナが自動的に適用されます。
* `ref` を持つフラグメントの第 1 レベルの DOM 子要素には、それぞれ `reactFragments` プロパティが追加されます。これは、その要素を所有するすべてのフラグメントインスタンスを含む `Set<FragmentInstance>` です。これにより、複数のフラグメントで[共有オブザーバをキャッシュ](#caching-global-intersection-observer)できます。

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

### <CanaryBadge /> ラッパ要素なしでイベントリスナを追加する {/*adding-event-listeners-without-wrapper*/}

フラグメントの `ref` を使うと、ラッパとなる DOM ノードを追加せずに、要素のグループにイベントリスナを追加できます。[ref コールバック](/reference/react-dom/components/common#ref-callback)を使ってリスナの登録とクリーンアップを行います。

<Sandpack>

```js
import { Fragment, useState, useRef, useEffect } from 'react';

function ClickableFragment({ children, onClick }) {
  const fragmentRef = useRef(null);
  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    if (fragmentInstance === null) {
      return;
    }
    fragmentInstance.addEventListener('click', onClick);
    return () => {
      fragmentInstance.removeEventListener(
        'click',
        onClick
      );
    };
  }, [onClick])
  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <p>Total clicks: {clicks}</p>
      <ClickableFragment onClick={() => {
        setClicks(c => c + 1);
      }}>
        <button>Button A</button>
        <button>Button B</button>
        <button>Button C</button>
      </ClickableFragment>
    </>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`addEventListener` を呼び出すと、フラグメントの第 1 レベルにあるすべての DOM 子ノードにリスナが適用されます。子ノードが動的に追加または削除されると、`FragmentInstance` がリスナを自動的に追加または削除します。

<DeepDive>

#### フラグメント ref が対象とするのはどの子要素か {/*which-children-does-a-fragment-ref-target*/}

`FragmentInstance` が対象とするのは、フラグメントの**第 1 レベルのホスト (DOM) 子ノード**です。次のツリーについて考えてみましょう。

```js
<Fragment ref={ref}>
  <div id="A" />
  <Wrapper>
    <div id="B">
      <div id="C" />
    </div>
  </Wrapper>
  <div id="D" />
</Fragment>
```

`Wrapper` は React コンポーネントなので、`FragmentInstance` はその中までたどって DOM ノードを探します。対象となる子要素は `A`、`B`、`D` です。`C` は DOM 要素 `B` の内部にネストされているため、対象にはなりません。

`addEventListener`、`observeUsing`、`getClientRects` などのメソッドは、これらの第 1 レベルの DOM 子ノードを操作します。一方、`focus` と `focusLast` は異なり、フォーカス可能な要素を見つけるため、ネストされた*すべての*子要素を深さ優先で検索します。

</DeepDive>

---

### <CanaryBadge /> 要素のグループ全体でフォーカスを管理する {/*managing-focus-across-elements*/}

フラグメントの `ref` は、フラグメント内のすべての DOM ノードにわたって動作する `focus`、`focusLast`、`blur` メソッドを提供します。

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function FormFields({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.focus();
        }}>
          Focus first
        </button>
        <button onClick={() => {
          fragmentRef.current.focusLast();
        }}>
          Focus last
        </button>
        <button onClick={() => {
          fragmentRef.current.blur();
        }}>
          Blur
        </button>
      </div>
      <Fragment ref={fragmentRef}>
        {children}
      </Fragment>
    </>
  );
}

// Even though the inputs are deeply nested,
// focus() searches depth-first to find them.
export default function App() {
  return (
    <FormFields>
      <fieldset>
        <legend>Shipping</legend>
        <label>
          Street: <input name="street" />
        </label>
        <label>
          City: <input name="city" />
        </label>
      </fieldset>
    </FormFields>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

label {
  display: inline-block;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

`focus()` を呼び出すと、`street` 入力欄が `<fieldset>` と `<label>` の内部にネストされているにもかかわらず、そこにフォーカスが当たります。`focus()` は、フラグメントの直接の子だけでなく、ネストされたすべての子を深さ優先で検索します。`focusLast()` はこれを逆順で行い、`blur()` は現在フォーカスされている要素がフラグメント内にある場合にフォーカスを外します。

---

### <CanaryBadge /> 要素のグループが見える位置までスクロールする {/*scrolling-group-into-view*/}

`scrollIntoView` を使うと、ラッパ要素なしでフラグメントの子要素が見える位置までスクロールできます。最初の子要素が上端に来るようにスクロールするには `true` を渡す（または引数を省略する）ようにします。最後の子要素が下端に来るようにスクロールするには `false` を渡します。

<Sandpack>

```js
import { Fragment, useRef } from 'react';

function ScrollableSection({ children }) {
  const fragmentRef = useRef(null);

  return (
    <>
      <div className="buttons">
        <button onClick={() => {
          fragmentRef.current.scrollIntoView();
        }}>
          Scroll to top
        </button>
        <button onClick={() => {
          fragmentRef.current.scrollIntoView(false);
        }}>
          Scroll to bottom
        </button>
      </div>
      <div className="container">
        <Fragment ref={fragmentRef}>
          {children}
        </Fragment>
      </div>
    </>
  );
}

const items = [];
for (let i = 1; i <= 25; i++) {
  items.push('Item ' + i);
}

export default function App() {
  return (
    <ScrollableSection>
      <h3>Section Start</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
      <h3>Section End</h3>
    </ScrollableSection>
  );
}
```

```css
.buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.container {
  height: 200px;
  overflow-y: auto;
  border: 2px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px;
}

h3 {
  margin: 4px 0;
  /* Padding to handle offset of global sticky nav when scrolling for example */
  padding-top: 4em;
  color: #1a73e8;
}

p {
  margin: 4px 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> ラッパ要素なしで可視性を監視する {/*observing-visibility-without-wrapper*/}

`observeUsing` を使うと、フラグメントの第 1 レベルにあるすべての DOM 子要素に `IntersectionObserver` を登録できます。これにより、子コンポーネントに `ref` を公開させたり、ラッパ要素を追加したりすることなく、可視性を追跡できます。

<Sandpack>

```js
import {
  Fragment,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import Card from './Card';

function VisibleGroup({ onVisibilityChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onVisibilityChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onVisibilityChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>
      <VisibleGroup onVisibilityChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </VisibleGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```

```js src/Card.js hidden
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

---

### <CanaryBadge /> グローバルな IntersectionObserver をキャッシュする {/*caching-global-intersection-observer*/}

多数のオブザーバを使用するサイトで一般的なパフォーマンス最適化は、設定ごとに 1 つの IntersectionObserver を共有で持ち、どの要素が交差したかに基づいて、そのエントリを適切なコールバックに振り分けることです。フラグメントの `ref` でも、`reactFragments` プロパティを介して同じパターンを利用できます。

`ref` を持つフラグメントの第 1 レベルの DOM 子要素には、それぞれ `reactFragments` プロパティがあります。これは、その要素を含む `FragmentInstance` オブジェクトの `Set` です。共有オブザーバが呼び出されたとき、このプロパティを使って、交差した要素を所有する `FragmentInstance` を特定し、適切なコールバックを実行できます。

<Sandpack>

```js src/App.js active
import { useState, useCallback } from 'react';
import ObservedGroup from './ObservedGroup';
import Card from './Card';

export default function App() {
  const [bgColor, setBgColor] = useState(null);

  const onGreen = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#d4edda');
    }
  }, []);

  const onBlue = useCallback((entry) => {
    if (entry.isIntersecting) {
      setBgColor('#cce5ff');
    }
  }, []);

  return (
    <div className="page" style={{
      background: bgColor || 'white',
    }}>
      <div className="filler">Scroll down</div>
      <ObservedGroup onIntersection={onGreen}>
        <Card title="Green section" className="green" />
      </ObservedGroup>
      <div className="filler" />
      <ObservedGroup onIntersection={onBlue}>
        <Card title="Blue section" className="blue" />
      </ObservedGroup>
      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/ObservedGroup.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

const callbackMap = new WeakMap();
const observerCache = new Map();

function getOptionsKey(options) {
  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '0px';
  const threshold = options?.threshold ?? 0;
  return `${rootMargin}|${threshold}`;
}

function getSharedObserver(
  fragmentInstance,
  onIntersection,
  options,
) {
  // Register this callback for the
  // fragment instance.
  const existing =
    callbackMap.get(fragmentInstance);
  callbackMap.set(
    fragmentInstance,
    existing
      ? [...existing, onIntersection]
      : [onIntersection],
  );

  const key = getOptionsKey(options);
  if (observerCache.has(key)) {
    return observerCache.get(key);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // Look up which FragmentInstances own
        // this element.
        const fragmentInstances =
          entry.target.reactFragments;
        if (fragmentInstances) {
          for (const inst of fragmentInstances) {
            const callbacks =
              callbackMap.get(inst) || [];
            callbacks.forEach(cb => cb(entry));
          }
        }
      }
    },
    options,
  );

  observerCache.set(key, observer);
  return observer;
}

export default function ObservedGroup({
  onIntersection,
  options,
  children,
}) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const fragmentInstance = fragmentRef.current;
    const observer = getSharedObserver(
      fragmentInstance,
      onIntersection,
      options,
    );
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
      callbackMap.delete(fragmentInstance);
    };
  }, [onIntersection, options]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 0 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}

.card.green {
  border-left: 3px solid #28a745;
}

.card.blue {
  border-left: 3px solid #007bff;
}
```

```js src/Card.js hidden
export default function Card({ title, className }) {
  return <div className={'card' + (className ? ' ' + className : '')}>{title}</div>;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-eb8feb71-20260814",
    "react-dom": "19.3.0-canary-eb8feb71-20260814",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

同じオプションを持つ複数の `ObservedGroup` コンポーネントが、単一の `IntersectionObserver` を再利用しています。いずれかのセクションがスクロールによって表示範囲に入ると、共有オブザーバが呼び出され、`reactFragments` を使ってエントリを適切なコールバックに振り分けます。
