---
title: cloneElement
---

<Pitfall>

`cloneElement` の使用は一般的ではなく、コードが壊れやすくなる可能性があります。[一般的な代替手段をご覧ください](#alternatives)。

</Pitfall>

<Intro>

`cloneElement` を使用すると、別の要素に基づいて新しい React 要素を作成することができます。

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

`cloneElement` を呼び出して、`element` を基に、異なる `props` と `children` を持った React 要素を作成します。

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `element`: `element` 引数は有効な React 要素でなければなりません。例えば、`<Something />` のような JSX ノード、[`createElement`](/reference/react/createElement) の呼び出し結果、または別の `cloneElement` の呼び出し結果などです。

* `props`: `props` 引数はオブジェクトか `null` でなければなりません。`null` を渡すと、クローンされた要素は元の `element.props` をすべて保持します。それ以外の場合、`props` オブジェクト内のすべての項目について、返される要素では `element.props` の値よりも `props` からの値が「優先」されます。残りの props は元の `element.props` から埋められます。`props.key` や `props.ref` を渡した場合、それらは元のものを置き換えます。

* **省略可能** `...children`: ゼロ個以上の子ノード。あらゆる React ノード、つまり React 要素、文字列、数値、[ポータル](/reference/react-dom/createPortal)、空ノード（`null`、`undefined`、`true`、`false`）、React ノードの配列になります。`...children` 引数を渡さない場合、元の `element.props.children` が保持されます。

#### 返り値 {/*returns*/}

`cloneElement` は以下のプロパティを持つ React 要素オブジェクトを返します。

* `type`: `element.type` と同じ。
* `props`: `element.props` に、渡された上書き用の `props` を浅くマージした結果。
* `ref`: 元の `element.ref`。ただし、`props.ref` によって上書きされた場合は除く。
* `key`: 元の `element.key`。ただし、`props.key` によって上書きされた場合は除く。

通常、この要素をコンポーネントから返すか、他の要素の子として用います。要素のプロパティを読み取ることは可能ですが、作成後は要素の構造を非公開 (opaque) として扱い、レンダーのみ行うようにするべきです。

#### 注意点 {/*caveats*/}

* 要素をクローンしても**元の要素は変更されません**。

* **複数の子の内容がすべて静的に分かっている場合**、`cloneElement` には子を `cloneElement(element, null, child1, child2, child3)` のように**複数の引数として渡してください**。子が動的な場合は、配列全体を第 3 引数として `cloneElement(element, null, listItems)` のように渡してください。これにより、React は動的なリストに `key` が欠けている場合に[警告を出す](/learn/rendering-lists#keeping-list-items-in-order-with-key)ようになります。静的なリストでは並び替えは決して発生しないため、key は必要ありません。

* `cloneElement` を使うとデータフローの追跡が難しくなるため、代わりに[代替手段](#alternatives)を試してみてください。

---

## 使用法 {/*usage*/}

### 要素の props を上書きする {/*overriding-props-of-an-element*/}

<CodeStep step={1}>React 要素</CodeStep> の props を上書きするには、それを `cloneElement` に渡し、<CodeStep step={2}>上書きしたい props</CodeStep> を指定します。

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

この場合、結果となる<CodeStep step={3}>クローンされた要素</CodeStep>は `<Row title="Cabbage" isHighlighted={true} />` になります。

**例を使って、これが役立つ場面を見てみましょう**。

選択可能な行のリストと、選択されている行を変更する "Next" ボタンをレンダーする `List` コンポーネントを想像してみてください。`List` コンポーネントは、選択された `Row` を異なる方法でレンダーする必要があるため、受け取ったすべての `<Row>` をクローンし、`isHighlighted: true` または `isHighlighted: false` を追加の props として指定します。

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

例えば `List` が受け取る元の JSX が以下のようなものである場合を考えます。

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

子要素をクローンすることで、`List` は内部のすべての `Row` に追加情報を渡すことができます。結果は以下のようになります。

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

"Next" を押すと `List` の state が更新され、異なる行がハイライトされることに着目してください。

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

おさらいすると、`List` は受け取った `<Row />` 要素をクローンし、それらに追加の props を付加したということです。

<Pitfall>

子要素をクローンすると、データがアプリケーションを通じてどのように流れるかを把握するのが難しくなります。[代替手段](#alternatives)のいずれかを試してみてください。

</Pitfall>

---

## 代替手段 {/*alternatives*/}

### レンダープロップを用いてデータを渡す {/*passing-data-with-a-render-prop*/}

`cloneElement` を使用する代わりに、`renderItem` のような*レンダープロップ (render prop)* を受け取るようにすることを検討してみてください。以下の例では、`List` は `renderItem` を props として受け取ります。`List` は各アイテムに対して `renderItem` を呼び出し、`isHighlighted` を引数として渡します。

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

`renderItem` のようなものは「レンダープロップ」と呼ばれます。何かをレンダーする方法を指定するための props だからです。例えば、与えられた `isHighlighted` の値で `<Row>` をレンダーする `renderItem` の実装を渡すことができます。

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

最終的な結果は `cloneElement` と同じです。

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

しかし、`isHighlighted` 値がどこから来ているかを明確に追跡することができます。

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

このパターンはより明示的であるため、`cloneElement` よりも推奨されます。

---

### コンテクストでデータを渡す {/*passing-data-through-context*/}

`cloneElement` の別の代替手段として[コンテクストを通じてデータを渡す](/learn/passing-data-deeply-with-context)ことが可能です。


例として、`createContext` を呼び出して `HighlightContext` を定義しましょう。

```js
export const HighlightContext = createContext(false);
```

`List` コンポーネントは、レンダーするすべてのアイテムを `HighlightContext` プロバイダでラップします。

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

このアプローチでは、`Row` は props で `isHighlighted` を受け取る必要が一切ありません。代わりにコンテクストから読み取ります。

```js Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

これにより、呼び出し元のコンポーネントは `<Row>` に `isHighlighted` を渡すことについて知る必要も、気にする必要もなくなります。

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

代わりに、`List` と `Row` はコンテクストを通じ、ハイライトのロジックに関して協調して動作します。

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[コンテクストを通じてデータを深く渡す方法について詳しく学ぶ](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### ロジックをカスタムフックに抽出する {/*extracting-logic-into-a-custom-hook*/}

試すべき別のアプローチは、「非視覚的」なロジックを自前のフックに抽出し、フックから返される情報を使用して何をレンダーするかを決定することです。例えば次のような `useList` カスタムフックを書くことができます。

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

これを以下のように使用できます。

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

データフローは明示的ですが、state は任意のコンポーネントから使用できる `useList` カスタムフック内にあります。

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

このアプローチは、特にこのロジックを異なるコンポーネント間で再利用したい場合に有用です。
