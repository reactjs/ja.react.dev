---
title: Children
---

<Pitfall>

`Children` の使用は一般的ではなく、コードが壊れやすくなる可能性があります。[一般的な代替手段をご覧ください](#alternatives)。

</Pitfall>

<Intro>

`Children` は、props である [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) から受け取った JSX を操作、変換するために用います。

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `Children.count(children)` {/*children-count*/}

`Children.count(children)` を呼び出して、`children` データ構造内の子の数をカウントします。

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Total rows: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[さらに例を見る](#counting-children)

#### 引数 {/*children-count-parameters*/}

* `children`: コンポーネントが props として受け取る [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) の値。

#### 返り値 {/*children-count-returns*/}

当該 `children` 内部にあるノードの数。

#### 注意点 {/*children-count-caveats*/}

- 空のノード（`null`、`undefined`、およびブーリアン値）、文字列、数値、および [React 要素](/reference/react/createElement)が、個々のノードとしてカウントされます。配列自体は個別のノードとしてカウントされませんが、その子はカウントされます。**React 要素より深い走査は行われません**。要素がその場でレンダーされるわけではないため、子の走査も起きません。[フラグメント](/reference/react/Fragment)も走査されません。

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

`Children.forEach(children, fn, thisArg?)` を呼び出して、`children` データ構造内のそれぞれの子に対して何らかのコードを実行することができます。

```js RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[さらに例を見る](#running-some-code-for-each-child)

#### 引数 {/*children-foreach-parameters*/}

* `children`: コンポーネントが props として受け取る [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) の値。
* `fn`: それぞれの子に対して実行したい関数。[配列の `forEach` メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) のコールバックに似ています。子を第 1 引数、そのインデックスを第 2 引数として呼び出されます。インデックスは `0` から始まり、呼び出しごとに増加します。
* **省略可能** `thisArg`: `fn` 関数が呼び出される際の [`this` の値](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。省略された場合は `undefined` になります。

#### 返り値 {/*children-foreach-returns*/}

`Children.forEach` は `undefined` を返します。

#### 注意点 {/*children-foreach-caveats*/}

- 空のノード（`null`、`undefined`、およびブーリアン値）、文字列、数値、および [React 要素](/reference/react/createElement)が、個々の子ノードとして扱われます。配列自体は個別のノードとして扱われませんが、その中身は子ノードとして扱われます。**React 要素より深い走査は行われません**。要素がその場でレンダーされるわけではないため、子の走査も起きません。[フラグメント](/reference/react/Fragment)も走査されません。

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

`Children.map(children, fn, thisArg?)` を呼び出して、`children` データ構造内のそれぞれの子をマップ（変換）します。

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[さらに例を見る](#transforming-children)

#### 引数 {/*children-map-parameters*/}

* `children`: コンポーネントが props として受け取る [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) の値。
* `fn`：[配列の `map` メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) のコールバックに似たマッピング関数。子を第 1 引数、そのインデックスを第 2 引数として呼び出されます。インデックスは `0` から始まり、呼び出しごとに増加します。この関数からは React ノードを返す必要があります。つまり空のノード（`null`、`undefined`、またはブーリアン値）、文字列、数値、React 要素、または他の React ノードの配列です。
* **省略可能** `thisArg`: `fn` 関数が呼び出される際の [`this` の値](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。省略された場合は `undefined` になります。

#### 返り値 {/*children-map-returns*/}

`children` が `null` または `undefined` の場合、同じ値を返します。

それ以外の場合、`fn` 関数から返されたノードで構成されるフラットな配列を返します。返された配列には `null` と `undefined` を除くすべてのノードが含まれます。

#### 注意点 {/*children-map-caveats*/}

- 空のノード（`null`、`undefined`、およびブーリアン値）、文字列、数値、および [React 要素](/reference/react/createElement)が、個々の子ノードとして扱われます。配列自体は個別のノードとして扱われませんが、その中身は子ノードとして扱われます。**React 要素より深い走査は行われません**。要素がその場でレンダーされるわけではないため、子の走査も起きません。[フラグメント](/reference/react/Fragment)も走査されません。

- `fn` から key 付きで要素ないし要素の配列を返す場合、**返された要素の key は、`children` の対応する元の項目のキーと自動的に結合されます**。`fn` から複数の要素を配列で返す場合、それらの key はその内部でローカルに一意であれば十分です。

---

### `Children.only(children)` {/*children-only*/}


`Children.only(children)`を呼び出すことで `children` が単一の React 要素を表していることを確認します。

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### 引数 {/*children-only-parameters*/}

* `children`: コンポーネントが props として受け取る [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) の値。

#### 返り値 {/*children-only-returns*/}

`children` が[有効な要素](/reference/react/isValidElement)である場合、その要素を返します。

それ以外の場合、エラーをスローします。

#### 注意点 {/*children-only-caveats*/}

- このメソッドは、`children` に配列（`Children.map` の返り値など）を渡すと常に**エラーをスローします**。つまり、`children` が単一要素の配列などではなく、単一の React 要素そのものであることを強制します。

---

### `Children.toArray(children)` {/*children-toarray*/}

`Children.toArray(children)` を呼び出して、`children` データ構造から配列を作成します。

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### 引数 {/*children-toarray-parameters*/}

* `children`: コンポーネントが props として受け取る [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) の値。

#### 返り値 {/*children-toarray-returns*/}

`children` 内の内容のフラットな配列を返します。

#### 注意点 {/*children-toarray-caveats*/}

- 空ノード（`null`、`undefined`、およびブーリアン値）は返される配列からは省かれます。**返される要素の key は、元の要素の key と、そのネストレベルや位置から計算されます**。これにより、配列のフラット化により挙動が変化しないことが保証されます。

---

## 使用法 {/*usage*/}

### 子の変換 {/*transforming-children*/}

コンポーネントが [`children` プロパティ](/learn/passing-props-to-a-component#passing-jsx-as-children)として受け取った子の JSX を変換するために、`Children.map` を呼び出します。

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

上記の例では、`RowList` は受け取ったすべての子を `<div className="Row">` というコンテナにラップします。例えば、親コンポーネントが 3 つの `<p>` タグを props 経由で `children` として `RowList` に渡すとしましょう。

```js
<RowList>
  <p>This is the first item.</p>
  <p>This is the second item.</p>
  <p>This is the third item.</p>
</RowList>
```

上記の `RowList` の実装により、最終的にレンダーされる結果は次のようになります。

```js
<div className="RowList">
  <div className="Row">
    <p>This is the first item.</p>
  </div>
  <div className="Row">
    <p>This is the second item.</p>
  </div>
  <div className="Row">
    <p>This is the third item.</p>
  </div>
</div>
```

`Children.map` は [`map()` を使って配列を変換する](/learn/rendering-lists) のと似ています。違いは、`children` のデータ構造を*非公開 (opaque)* のものと見なすべきであることです。これは、`children` が実際に配列である場合があるとしても、それを配列あるいは他の特定のデータ型であると仮定してはならないという意味です。これが、子の変換が必要な場合には `Children.map` を使用すべき理由です。

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### なぜ children が常に配列とは限らないのか？ {/*why-is-the-children-prop-not-always-an-array*/}

React では props としての `children` は*非公開*のデータ構造だと見なされます。つまりその具体的な構造に依存してはいけないという意味です。子を変換したり、フィルタリングしたり、数えたりするためには、`Children` のメソッドを使用すべきです。

実際には、`children` データ構造は内部的にはしばしば配列として表現されます。しかし、子が 1 つだけの場合、React は不必要なメモリオーバーヘッドを避けるため、余分な配列を作成しません。`children` の中身を直接覗くのではなく、`Children` のメソッドを使用する限り、React がデータ構造の実装方法を変更してもあなたのコードは壊れずに済みます。

`children` が配列である場合でも、`Children.map` には便利な特別な振る舞いがあります。例えば、`Children.map` は、返された要素の [key](/learn/rendering-lists#keeping-list-items-in-order-with-key) と、渡された `children` にある key を組み合わせます。これにより、上記の例のようにラップされても元の子 JSX がキーを「失う」ことはありません。

</DeepDive>

<Pitfall>

`children` データ構造は、JSX として渡されるコンポーネントの**レンダーされた出力を含みません**。以下の例では、`RowList` に渡される `children` には 3 つではなく 2 つのアイテムのみが含まれます。

1. `<p>This is the first item.</p>`
2. `<MoreRows />`

このため、この例では 2 つの行ラッパのみが生成されます：

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </>
  );
}
```

```js RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`children` を使う際に、`<MoreRows />` のような**内側のコンポーネントのレンダー出力を取得する方法はありません**。このため[通常は代替手段のいずれかを使用する方が適切](#alternatives)です。

</Pitfall>

---

### 子のそれぞれに対してコードを実行する {/*running-some-code-for-each-child*/}

`Children.forEach` を呼び出すことで、`children` データ構造の子のそれぞれに対して反復処理を行えます。これは値を返さない、[配列の `forEach` メソッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)に似たものです。独自の配列を構築するなどのカスタムロジックを実行するために使用できます。

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </SeparatorList>
  );
}
```

```js SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Remove the last separator
  return result;
}
```

</Sandpack>

<Pitfall>

前述の通り、`children` を使用する際に、内側のコンポーネントのレンダー出力を取得する方法はありません。このため[通常は代替手段のいずれかを使用する方が適切](#alternatives)です。

</Pitfall>

---

### 子の数を数える {/*counting-children*/}

`Children.count(children)` を呼び出して、子の数を計算します。

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

前述の通り、`children` を使用する際に、内側のコンポーネントのレンダー出力を取得する方法はありません。このため[通常は代替手段のいずれかを使用する方が適切](#alternatives)です。

</Pitfall>

---

### 子を配列に変換する {/*converting-children-to-an-array*/}

`Children.toArray(children)` を呼び出して、`children` データ構造を通常の JavaScript 配列に変換します。これにより、[`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)、[`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)、[`reverse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) などの組み込み配列メソッドを使って配列を操作できます。

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>This is the first item.</p>
      <p>This is the second item.</p>
      <p>This is the third item.</p>
    </ReversedList>
  );
}
```

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

前述の通り、`children` を使用する際に、内側のコンポーネントのレンダー出力を取得する方法はありません。このため[通常は代替手段のいずれかを使用する方が適切](#alternatives)です。

</Pitfall>

---

## 代替手段 {/*alternatives*/}

<Note>

このセクションで説明しているのは、以下のようにしてインポートする `Children` API（大文字の `C`）の代わりに使える手段です。

```js
import { Children } from 'react';
```

これを [`children` の使用](/learn/passing-props-to-a-component#passing-jsx-as-children)（小文字の `c`）と混同しないでください。こちらは良いことであり、推奨されています。

</Note>

### 複数のコンポーネントを公開する {/*exposing-multiple-components*/}

`Children` のメソッドを使って children を操作することで、しばしばコードが壊れやすくなります。JSX でコンポーネントに children を渡す場合、通常はコンポーネントにより個々の子が操作されたり変換されたりすることを予想していないでしょう。

できる限り `Children` メソッドの使用は避けてください。例えば、`RowList` のすべての子を `<div className="Row">` でラップしたい場合、`Row` コンポーネントをエクスポートし、このように各行を手動でラップします。

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </RowList>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`Children.map` を使用する場合とは異なり、このアプローチではすべての子を自動的にラップしてくれません。**しかし[先ほどの `Children.map` を使用した例](#transforming-children)と比較しても、このアプローチには、さらに多くのコンポーネントを抽出しても機能するという利点があります**。例えば、自前の `MoreRows` コンポーネントを抽出しても機能します。

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>This is the first item.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>This is the second item.</p>
      </Row>
      <Row>
        <p>This is the third item.</p>
      </Row>
    </>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

これは `Children.map` では機能しません。なぜなら、`<MoreRows />` が単一の子（つまり単一の行）のように「見える」からです。

---

### 配列を props として受け入れる {/*accepting-an-array-of-objects-as-a-prop*/}

明示的に配列を props として渡すこともできます。例えば、以下の `RowList` は `rows` という配列を props として受け取ります。

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>This is the first item.</p> },
      { id: 'second', content: <p>This is the second item.</p> },
      { id: 'third', content: <p>This is the third item.</p> }
    ]} />
  );
}
```

```js RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

`rows` は通常の JavaScript の配列なので、`RowList` コンポーネントは [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) のような組み込みの配列メソッドを使用できます。

このパターンは特に、子と一緒に構造化データとしてより多くの情報を渡したい場合に有用です。以下の例では、`TabSwitcher` コンポーネントは props である `tabs` 経由でオブジェクトの配列を受け取ります。

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>This is the first item.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>This is the second item.</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>This is the third item.</p>
      }
    ]} />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

JSX として子を渡すのとは異なり、このアプローチでは `header` のような追加のデータを各アイテムに関連付けることができます。`tabs` を直接操作しており、それは配列なので、`Children` メソッドは必要ありません。

---

### レンダープロップを呼び出してレンダーをカスタマイズする {/*calling-a-render-prop-to-customize-rendering*/}

すべてのアイテムに対して JSX を生成しておく代わりに、JSX を返す関数を渡し、必要なときにその関数を呼び出してもらうこともできます。以下の例では、`App` コンポーネントは `renderContent` という関数を `TabSwitcher` コンポーネントに渡しています。`TabSwitcher` コンポーネントは選択中のタブのみに対して `renderContent` を呼び出します。

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['first', 'second', 'third']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>This is the {tabId} item.</p>;
      }}
    />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

`renderContent` のような props は、ユーザインターフェースの一部をどのようにレンダーするかを指定する props であるため、*レンダープロップ (render prop)* と呼ばれます。しかし、これについて特別なことは何もありません。たまたたま関数型であるというだけの通常の props に過ぎません。

レンダープロップは関数なので、情報を渡すことができます。例えば、以下の `RowList` コンポーネントは、各行の `id` と `index` を `renderRow` というレンダープロップに渡し、`index` を使って偶数行をハイライトします。

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['first', 'second', 'third']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>This is the {id} item.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Total rows: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

このような方法でも、親コンポーネントと子コンポーネントが、子の操作を行わずに協調動作できるということです。

---

## トラブルシューティング {/*troubleshooting*/}

### カスタムコンポーネントを渡しているが、`Children` メソッドがそのレンダー結果を表示しない {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

`RowList` に以下のように 2 つの子を渡すとします。

```js
<RowList>
  <p>First item</p>
  <MoreRows />
</RowList>
```

`RowList` の中で `Children.count(children)` を行うと、結果は `2` になります。`MoreRows` が 10 の異なるアイテムをレンダーする場合でも、`null` を返す場合でも、`Children.count(children)` はやはり `2` になります。`RowList` の視点からは受け取った JSX のみが「見えて」いるからです。`MoreRows` コンポーネントの中身は「見えて」いません。

この制限はコンポーネントの抽出を困難にします。これが `Children` を使用するのではなく、[代替手段](#alternatives)を使用すべき理由です。
