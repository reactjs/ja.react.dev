---
title: コンポーネント間で state を共有する
---

<Intro>

2 つのコンポーネントの state を常に同時に変更したいという場合があります。これを行うには、両方のコンポーネントから state を削除して最も近い共通の親へ移動し、そこから state を props 経由でコンポーネントへ渡します。これは *state のリフトアップ (lifting state up)* として知られているものであり、React コードを書く際に行う最も一般的な作業のひとつです。

</Intro>

<YouWillLearn>

- コンポーネント間で state を共有する方法
- 制御された (controlled) コンポーネントと非制御 (uncontrolled) コンポーネントとは何か

</YouWillLearn>

## state のリフトアップの例 {/*lifting-state-up-by-example*/}

以下の例では、親の `Accordion` コンポーネントが 2 つの別々の `Panel` をレンダーしています。

* `Accordion`
  - `Panel`
  - `Panel`

各 `Panel` コンポーネントには、内容を表示中かどうかを決定するブール型の `isActive` という state があります。

両方のパネルで "Show" ボタンを押してみてください。

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

片方のパネルのボタンを押しても、もう片方のパネルには影響しません。2 つのパネルは独立していますね。

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Accordion というラベルが付いた親と、Panel というラベルが付いた 2 つの子からなる 3 つのコンポーネントのツリーを示す図。両方の Panel コンポーネントには、false の値を持った isActive が含まれている。">

最初は、各 `Panel` の `isActive` state は `false` なので、どちらも折りたたまれている

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="前の図と同様で、最初の子の Panel コンポーネントの isActive がクリックによりハイライトされ、値が true に設定されている。2 つ目の Panel コンポーネントは false のまま。">

どちらかの `Panel` のボタンをクリックすると、その `Panel` のみ `isActive` の state が更新される

</Diagram>

</DiagramGroup>

**ですが今回はこれを変更し、一度に 1 つのパネルだけが展開されるようにしたいとしましょう**。この設計では、2 番目のパネルを展開すると 1 番目のパネルが折りたたまれます。どのようにして実現すればよいでしょうか？

これら 2 つのパネルを協調して動作させるためには、以下の 3 ステップで、親のコンポーネントに "state をリフトアップ" する必要があります。

1. 子コンポーネントから state を**削除**する。
2. 共通の親からハードコードされた**データを渡す**。
3. 共通の親に state を**追加**し、イベントハンドラと一緒に下に渡す。

これにより、`Accordion` コンポーネントが両方の `Panel` の調整役となり、一度に一方だけを展開できるようになります。

### ステップ 1：子コンポーネントから state を削除する {/*step-1-remove-state-from-the-child-components*/}

`Panel` の `isActive` の制御権を親コンポーネントに与えることになります。つまり、親コンポーネントが `isActive` を `Panel` に props として渡すということです。まずは `Panel` コンポーネントから**以下の行を削除**してください。

```js
const [isActive, setIsActive] = useState(false);
```

代わりに、`isActive` を `Panel` の props のリストに追加します。

```js
function Panel({ title, children, isActive }) {
```

これで、`Panel` の親コンポーネントは `isActive` を [props として渡すことで](/learn/passing-props-to-a-component)*制御*できます。逆に、`Panel` コンポーネントは `isActive` の値を自身で*制御できなく*なりました。制御が親コンポーネントに移ったのです！

### ステップ 2：共通の親からハードコードされたデータを渡す {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

state をリフトアップするためには、協調動作させたい*すべての*子コンポーネントの、最も近い共通の親コンポーネントを特定する必要があります。

* `Accordion` *（最も近い共通の親）*
  - `Panel`
  - `Panel`

この例では `Accordion` コンポーネントが該当します。両方のパネルの上にあり、それらの props を制御できるので、現在アクティブなパネルに関する "信頼できる情報源 (source of truth)" となります。`Accordion` コンポーネントからハードコードされた `isActive` の値（例えば、`true`）を両方のパネルに渡しましょう。

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`Accordion` コンポーネントにハードコードされた `isActive` の値を編集してみて、画面上で起きる結果を確認してください。

### ステップ 3：共通の親に state を追加する {/*step-3-add-state-to-the-common-parent*/}

state をリフトアップすることで、state として格納するデータの意味が変わることがあります。

今回の場合、一度に 1 つのパネルだけがアクティブであるべきです。つまり、共通の親コンポーネントである `Accordion` は、どのパネルがアクティブなのかを管理する必要があります。state 変数としては、`boolean` 値の代わりに、アクティブな `Panel` のインデックスを表す数値を使うことができます。

```js
const [activeIndex, setActiveIndex] = useState(0);
```

`activeIndex` が `0` のときは 1 番目のパネルが、`1` のときは 2 番目のパネルがアクティブになります。

どちらの `Panel` の "Show" ボタンがクリックされた場合でも、`Accordion` のアクティブインデックスを変更する必要があります。`activeIndex` という state は `Accordion` 内に定義されるものであるため、`Panel` からそれを直接セットすることはできません。`Accordion` コンポーネントは、[props として `onShow` イベントハンドラを下に渡すこと](/learn/responding-to-events#passing-event-handlers-as-props)で、`Panel` コンポーネントがアコーディオンの state を変更できるように*明示的に許可*する必要があります：

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

そして `Panel` 内の `<button>` は、クリックイベントハンドラとして props である `onShow` を使用します。

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

これで state のリフトアップが完了です！ state を共通の親コンポーネントに移動させることで、2 つのパネルを協調動作させられるようになりました。「表示中」フラグを 2 つ使う代わりにアクティブインデックスを使用することで、一度にアクティブなパネルが 1 つだけであることが保証されました。また、イベントハンドラを子に渡すことで、子に親の state を変更させることができました。

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Accordion というラベルの親コンポーネントと、Panel というラベルの 2 つの子コンポーネントからなる 3 つのコンポーネントのツリーを示す図。最初 Accordion の activeIndex が 0 なので、最初の Panel が isActive = true を受け取る。" >

最初、`Accordion` の `activeIndex` は `0` なので、最初の `Panel` が `isActive = true` を受け取る。

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="前と同じ図だが、クリックによりハイライトされた親の Accordion コンポーネントの activeIndex が 1 に変わっている。両方の子の Panel コンポーネントもハイライトされており、isActive の値が逆転して渡されている。最初の Panel には false、2 番目の Panel には true。">

`Accordion` の `activeIndex` state が `1` に変更されると、2 番目の `Panel` が `isActive = true` を受け取る。

</Diagram>

</DiagramGroup>

<DeepDive>

#### 制御されたコンポーネントと非制御コンポーネント {/*controlled-and-uncontrolled-components*/}

一般的に、ローカル state を持つコンポーネントを "非制御 (uncontrolled)" であると呼びます。例えば、`isActive` という state 変数を持つ元の `Panel` コンポーネントは、パネルがアクティブかどうかに関して親が影響を与えることができないため、非制御コンポーネントです。

対照的に、重要な情報がローカル state ではなく props によって駆動されるとき、コンポーネントは "制御された (controlled)" ものと呼ばれることがあります。これにより、親コンポーネントがその振る舞いを完全に指定することができます。`isActive` を props として持つ最終的な `Panel` コンポーネントは、`Accordion` コンポーネントによって制御されていることになります。

非制御コンポーネントは、設定が少なくて済むので親コンポーネントの中に入れて使用することが簡単にできます。しかし、それらを協調動作させたい場合に柔軟性がありません。制御されたコンポーネントはとても柔軟ですが、親コンポーネントが props で完全に設定してあげる必要があります。

実際には、"制御された"、"非制御" は技術用語として厳密なものではありません。各コンポーネントは通常、ローカルな state と props の両方を、混在して持つものです。しかし、コンポーネントがどう設計されるか、どんな機能を持つかについて話す際には、このような考え方が役に立つでしょう。

コンポーネントを書くときには、その中のどの情報を（props で）制御し、どの情報を（state を使うことで）制御しないのかを検討してください。しかし後で考えを変えてリファクタリングすることはいつでも可能です。

</DeepDive>

## 各 state の信頼できる唯一の情報源 {/*a-single-source-of-truth-for-each-state*/}

React アプリケーションでは、多くのコンポーネントが自身の state を保持します。一部の state は、入力フィールドのような末梢コンポーネント（ツリーの最下部のコンポーネント）に近いところに存在します。一部の state はアプリの上部に近いところに存在することでしょう。例えば、クライアントサイドルーティングライブラリも、React の state に現在のルートを格納し、props を介して下に渡すことで実装されることが一般的です。

**それぞれの state について、それを「所有」するコンポーネントを選択してください**。この原則は、["信頼できる唯一の情報源 (single source of truth)"](https://en.wikipedia.org/wiki/Single_source_of_truth) としても知られています。これは、すべての state が一箇所にまとまっているという意味ではありません。*それぞれの* state について、その情報を保持する*特定の*コンポーネントが存在すべきという意味です。コンポーネント間で共有される state は複製する代わりに、共通の親に*リフトアップ*して、それを必要とする子に*渡す*ようにしてください。

あなたのアプリは作業を進めるうちに変化していきます。まだそれぞれの state がどこに存在すべきか分からない間は、state を下に移動させたり、上に戻したりすることがよくあります。これは開発プロセスの一環です！

もう少し多くのコンポーネントが登場する例で実践的に感覚を理解したい場合は、[React の流儀](/learn/thinking-in-react)を読んでみましょう。

<Recap>

* 2 つのコンポーネントを協調動作させたい場合は、state を共通の親に移動する。
* 次に、その共通の親から props 経由で情報を下に渡す。
* 最後に、子が親の state を変更できるよう、イベントハンドラを下に渡す。
* コンポーネントを「制御された」（props によって駆動される）か「非制御」（state によって駆動される）かという観点で考えることが有用である。

</Recap>

<Challenges>

#### 入力欄の同期 {/*synced-inputs*/}

以下の 2 つの入力欄は独立しています。同期して動作するようにしましょう。片方の入力欄を編集すると、他方の入力欄も同じテキストに更新されるようにしてください。

<Hint>

親コンポーネントに state をリフトアップする必要があります。

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

`text` という state 変数と `handleChange` ハンドラを親コンポーネントに移動させます。次に、それらを両方の `Input` コンポーネントに props 経由で渡します。これにより、2 つの入力欄の同期が保たれます。

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### リストのフィルタリング {/*filtering-a-list*/}

以下の例では、`SearchBar` は、テキスト入力を制御する `query` という独自の state を保持しています。親である `FilterableList` コンポーネントは項目の `List` を表示していますが、検索クエリが考慮されていません。

`filterItems(foods, query)` 関数を使って、検索クエリに従ってリストの絞り込みを行ってください。変更をテストするには、入力欄に "s" と入力すると、"Sushi"、"Shish kebab"、"Dim sum" のようにリストが絞り込まれることを確認します。

`filterItems` は既に実装されておりインポートされているので、自分で書く必要はありません！

<Hint>

`query` の state と `handleChange` ハンドラを `SearchBar` から削除し、`FilterableList` に移動します。その後、`query` および `onChange` を props として `SearchBar` に渡します。

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

`query` の state を `FilterableList` コンポーネントにリフトアップします。フィルタリング済のリストを取得するために、`filterItems(foods, query)` を呼び出し、それを `List` に渡します。これで、query の入力を変更するとリストに反映されるようになります。

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
