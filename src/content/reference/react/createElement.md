---
title: createElement
---

<Intro>

`createElement` によって React 要素を作成できます。これは [JSX](/learn/writing-markup-with-jsx) を書く代わりの手段として利用できます。

```js
const element = createElement(type, props, ...children)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createElement(type, props, ...children)` {/*createelement*/}

`createElement` を呼び出して、指定した `type`、`props`、`children` を持った React 要素を作成します。

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello'
  );
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `type`: `type` 引数は有効な React のコンポーネント型でなければなりません。例えば、タグ名の文字列（`'div'` や `'span'`）や、React コンポーネント（関数、クラス、または [`Fragment`](/reference/react/Fragment) のような特別なコンポーネント）が該当します。

* `props`: `props` 引数はオブジェクトか `null` でなければなりません。`null` を渡すと、空のオブジェクトと同じように扱われます。React は、渡された `props` と同じ props を持った要素を作成します。`props` オブジェクトの `ref` と `key` は特別であり、返された `element` の `element.props.ref` や `element.props.key` として*利用できません*。`element.ref` ないし `element.key` となります。

* **省略可能** `...children`: ゼロ個以上の子ノード。これらは React ノード、つまり、React 要素、文字列、数値、[ポータル](/reference/react-dom/createPortal)、空ノード（`null`、`undefined`、`true`、`false`）、あるいは React ノードの配列となります。

#### 返り値 {/*returns*/}

`createElement` は以下のプロパティを持つ React 要素オブジェクトを返します。

* `type`: 指定した `type`。
* `props`: 指定した `props`、ただし `ref` と `key` は除く。もし `type` がレガシーの `type.defaultProps` を持つコンポーネントであれば、欠けているか undefined となっている `props` は `type.defaultProps` から値を取得します。
* `ref`: 指定した `ref`。未指定の場合は `null`。
* `key`: 指定した `key`。強制的に文字列に変換されます。未指定の場合は `null`。

通常、この要素をコンポーネントから返すか、他の要素の子として用います。要素のプロパティを読み取ることは可能ですが、作成後は要素の構造を非公開 (opaque) として扱い、レンダーのみ行うようにするべきです。

#### 注意点 {/*caveats*/}

* **React 要素とその props は[イミュータブル (immutable)](https://en.wikipedia.org/wiki/Immutable_object) として扱い**、作成後にその内容を変更してはなりません。これを強制するために、React は開発環境において、返された要素とその `props` プロパティを浅く[凍結 (freeze)](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) します。

* JSX を使用する場合、**独自のカスタムコンポーネントをレンダーするためにはタグを大文字で始める必要があります**。つまり、`<Something />` は `createElement(Something)` と同等ですが、`<something />`（小文字）は `createElement('something')` と同等です（文字列なので、組み込みの HTML タグとして扱われます）。

* **複数の子の内容がすべて静的に分かっている場合**、`createElement` には子を `createElement('h1', {}, child1, child2, child3)` のように**複数の引数として渡してください**。子が動的な場合は、配列全体を第 3 引数として `createElement('ul', {}, listItems)` のように渡してください。これにより、React は動的なリストに `key` が欠けている場合に[警告を出す](/learn/rendering-lists#keeping-list-items-in-order-with-key)ようになります。静的なリストでは並び替えは決して発生しないため、key は必要ありません。

---

## 使用法 {/*usage*/}

### JSX を使わずに要素を作成する {/*creating-an-element-without-jsx*/}

[JSX](/learn/writing-markup-with-jsx) が好きでない場合や、プロジェクトで使用できない場合には、代わりに `createElement` を使用できます。

JSX を使わずに要素を作成するには、`createElement` を呼び出して、何らかの <CodeStep step={1}>type</CodeStep>、<CodeStep step={2}>props</CodeStep>、<CodeStep step={3}>children</CodeStep> を引数として渡します。

```js [[1, 5, "'h1'"], [2, 6, "{ className: 'greeting' }"], [3, 7, "'Hello ',"], [3, 8, "createElement('i', null, name),"], [3, 9, "'. Welcome!'"]]
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}
```

<CodeStep step={3}>children</CodeStep> はオプションで、必要なだけ渡すことができます（上記の例では子が 3 つあります）。このコードは、`<h1>` ヘッダに挨拶文字列を入れて表示します。比較のため、以下に JSX を使って書き直した同じ例を示します。

```js [[1, 3, "h1"], [2, 3, "className=\\"greeting\\""], [3, 4, "Hello <i>{name}</i>. Welcome!"], [1, 5, "h1"]]
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}
```

自身のカスタム React コンポーネントをレンダーするには、`'h1'` のような文字列ではなく `Greeting` のような関数を <CodeStep step={1}>type</CodeStep> として渡します。

```js [[1, 2, "Greeting"], [2, 2, "{ name: 'Taylor' }"]]
export default function App() {
  return createElement(Greeting, { name: 'Taylor' });
}
```

JSX を使用した場合は以下のようになります。

```js [[1, 2, "Greeting"], [2, 2, "name=\\"Taylor\\""]]
export default function App() {
  return <Greeting name="Taylor" />;
}
```

以下は、`createElement` を使用して書かれたフルのサンプルです。

<Sandpack>

```js
import { createElement } from 'react';

function Greeting({ name }) {
  return createElement(
    'h1',
    { className: 'greeting' },
    'Hello ',
    createElement('i', null, name),
    '. Welcome!'
  );
}

export default function App() {
  return createElement(
    Greeting,
    { name: 'Taylor' }
  );
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

同じものを JSX で書くと以下のようになります。

<Sandpack>

```js
function Greeting({ name }) {
  return (
    <h1 className="greeting">
      Hello <i>{name}</i>. Welcome!
    </h1>
  );
}

export default function App() {
  return <Greeting name="Taylor" />;
}
```

```css
.greeting {
  color: darkgreen;
  font-family: Georgia;
}
```

</Sandpack>

どちらのコーディングスタイルも問題ありませんので、プロジェクトに合わせて好きな方を使用してください。`createElement` と比較して JSX を使用する場合の主な利点は、どの閉じタグがどの開きタグに対応しているかが簡単にわかることです。

<DeepDive>

#### React 要素とは要するに何なのか？ {/*what-is-a-react-element-exactly*/}

要素 (element) とは、ユーザインターフェースの軽量な説明書きのことです。例えば、`<Greeting name="Taylor" />` と `createElement(Greeting, { name: 'Taylor' })` はいずれも、次のようなオブジェクトを生成します。

```js
// Slightly simplified
{
  type: Greeting,
  props: {
    name: 'Taylor'
  },
  key: null,
  ref: null,
}
```

**このオブジェクトを作成しただけでは、`Greeting` コンポーネントがレンダーされたり、DOM 要素が作成されたりするわけではないことに注意してください**。

React 要素とは、むしろ指示書のようなものです。React に後で `Greeting` コンポーネントをレンダーするよう指示するものです。このオブジェクトを `App` コンポーネントから返すことで、React に次に何をすべきかを伝えるのです。

要素の作成は非常に安価であるため、最適化したり避けたりする必要はありません。

</DeepDive>
