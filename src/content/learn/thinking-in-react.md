---
title: React の流儀
---

<Intro>

React は、あなたが設計を考える方法やアプリを構築する方法を変化させます。React でユーザインターフェースを構築する際には、まず UI を*コンポーネント*と呼ばれる部品に分割します。次に、各コンポーネントのさまざまな視覚的状態を記述します。最後に、複数のコンポーネントを接続し、それらの間をデータが流れるようにします。このチュートリアルでは、React を使って検索可能な商品データテーブルを作成する際の思考プロセスについて説明します。

</Intro>

## モックアップから始めよう {/*start-with-the-mockup*/}

すでに、JSON API が実装済みで、デザイナからもモックアップがもらえているとしましょう。

JSON API は以下のようなデータを返します。

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

モックは次のような見た目だったとします。

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

React で UI を実装する際には、通常以下のような 5 つのステップに従います。

## ステップ 1：UI をコンポーネントの階層に分割する {/*step-1-break-the-ui-into-a-component-hierarchy*/}

まず最初に行うのは、モックアップのすべてのコンポーネントとサブコンポーネントを四角で囲んで、それぞれに名前を付けていくことです。デザイナと一緒に仕事をしている場合は、彼らがデザインツールでこれらのコンポーネントにすでに名前を付けているかもしれませんので、話をしに行きましょう。

あなたの技術的バックグラウンドによって、デザインをコンポーネントに分割するとはどういうことなのか、いろいろな考え方ができるでしょう：

* **プログラマ** -- 新しい関数やオブジェクトを作成するかどうかを決定するときと同じ手法を使いましょう。そのような手法のひとつに[単一責任の原則 (single responsibility principle)](https://en.wikipedia.org/wiki/Single_responsibility_principle) があります。つまり、1 つのコンポーネントは理想的には 1 つのことだけを行うべきだということです。もし大きくなってしまったら、より小さなサブコンポーネントに分解するべきです。
* **CSS エンジニア** -- どの部分に対してクラスセレクタを作成するのか、と考えてみてください（ただし、コンポーネントの方が少し粒度が低めです）。
* **デザイナ** -- デザインのレイヤをどのように整理するかを考えてください。

JSON がうまく構造化されている場合、それが UI のコンポーネント構造に自然に対応していることがよくあります。それは、UI とデータモデルが同じ情報アーキテクチャ、つまり同じ形状を持っていることが多いためです。1 つのコンポーネントがデータモデルの 1 つの部分に対応するような形で、UI をコンポーネントに分割していきましょう。

この画面には 5 つのコンポーネントがあることがわかります。

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable`（灰色）はアプリ全体のコンテナ。
2. `SearchBar`（青）はユーザ入力を受け取る。
3. `ProductTable`（紫）はユーザ入力に従ってリストを表示およびフィルタリングする。
4. `ProductCategoryRow`（緑）はカテゴリごとの見出しを表示する。
5. `ProductRow`（黄）は個々の製品に対応する行を表示する。

</CodeDiagram>

</FullWidth>

`ProductTable`（紫）を見ると、（"Name" と "Price" というラベルがある）テーブルヘッダ部分が、専用のコンポーネントになっていないことに気付くでしょう。これは好みの問題であり、どちらであっても構いません。今回の例ではヘッダは商品テーブル内に表示するものであるため、`ProductTable` の一部としています。ただし、このヘッダが複雑になる場合（例えばソート機能を追加する場合）、専用の `ProductTableHeader` コンポーネントに移動してもよいでしょう。

モックアップ内にあるコンポーネントを特定したら、それらを階層構造に整理します。モックアップで他のコンポーネントの中にあるコンポーネントを、階層構造でも子要素として配置すればいいのです。

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## ステップ 2: React で静的なバージョンを作成する {/*step-2-build-a-static-version-in-react*/}

これでコンポーネント階層ができたので、アプリの実装に取り掛かりましょう。最も分かりやすいアプローチは、インタラクティブな要素はまだ加えず、単にデータモデルから UI をレンダーするバージョンを作成することです。静的なバージョンを先に構築し、後からインタラクティブ性を追加する方が、多くの場合は簡単です。静的なバージョンを作成する間はタイプ量が多い代わりに考えることはほどんどなく、インタラクティブな要素を追加しようとするとタイプ量が少ない代わりに考えることが多くなります。

データモデルをレンダーする静的バージョンのアプリを作成するにあたっては、[コンポーネント](/learn/your-first-component)を作成していく際に、他のコンポーネントを再利用しつつ [props](/learn/passing-props-to-a-component) 経由でそれらにデータを渡すようにします。props とは、親から子へとデータを渡すための手段です。（もし [state](/learn/state-a-components-memory) の概念に馴染みがある場合でも、この静的なバージョンを作成している間は state を一切使わないでください。state はインタラクティビティ、つまり時間とともに変化するデータのためにあるものです。今はアプリの静的なバージョンなので state は不要です。）

「トップダウン」で高い階層にあるコンポーネント (`FilterableProductTable`) から構築を始めることも、「ボトムアップ」で低い階層にあるコンポーネント (`ProductRow`) から構築を始めることもできます。通常、単純な例ではトップダウンで作業する方が簡単であり、大規模なプロジェクトではボトムアップで進める方が簡単です。

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

（このコードが難解に思える場合は、まず[クイックスタート](/learn/)を参照してください！）

コンポーネントの実装を終えると、データモデルをレンダーするための再利用可能なコンポーネントが一式揃ったということになります。これは静的なアプリですので、コンポーネントは JSX を返す以外のことはしていません。階層の一番上のコンポーネント (`FilterableProductTable`) が、データモデルを props として受け取っています。データがトップレベルのコンポーネントからツリーの下の方にあるコンポーネントに流れていくため、この構造を _単方向データフロー (one-way data flow)_ と呼びます。

<Pitfall>

この段階では、state の値をまだ使わないでください。それは次のステップで行います！

</Pitfall>

## ステップ 3：UI の状態を最小限かつ完全に表現する方法を見つける {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

UI をインタラクティブにするには、ユーザが背後にあるデータモデルを変更できるようにする必要があります。これには *state* というものを使用します。

state とは、アプリが記憶する必要のある、変化するデータの最小限のセットのことである、と考えましょう。state の構造を考える上で最も重要な原則は、[DRY（Don't Repeat Yourself; 繰り返しを避ける）](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)です。アプリケーションが必要とする状態に関する必要最小限の表現を見つけ出し、他のすべてのものは必要になったらその場で計算します。例えば、ショッピングリストを作成する場合、商品のリストを配列型の state として格納できます。リスト内の商品数も表示したいという場合は、その数を別の state 値として格納するのではなく、代わりに配列の length を読み取ればいいのです。

この例のアプリケーションで使われるデータはどのようなものか考えましょう：

1. 元となる商品のリスト
2. ユーザが入力した検索文字列
3. チェックボックスの値
4. フィルタ済みの商品のリスト

これらのうちどれが state でしょうか？ state でないものを特定してください。

* 時間が経っても**変わらない**ものですか？ そうであれば、state ではありません。
* 親から props 経由で**渡される**ものですか？ そうであれば、state ではありません。
* コンポーネント内にある既存の state や props に基づいて**計算可能な**データですか？ そうであれば、それは*絶対に* state ではありません！

残ったものがおそらく state です。

もう一度、それぞれを見ていきましょう：

1. 元の商品リストは **props として渡されるので、state ではありません**。
2. 検索テキストは state のようです。それは時間が経つと変わりますし、何から計算することはできません。
3. チェックボックスの値も state のようです。それは時間が経つと変わりますし、何から計算することはできません。
4. フィルタリングされた商品のリストは、元の商品リストを検索テキストとチェックボックスの値に従ってフィルタリングすることで**計算できるため、state ではありません**。

つまり、検索テキストとチェックボックスの値だけが state だということです！ よくできました！

<DeepDive>

#### props と state {/*props-vs-state*/}

React には 2 種類の "モデル" データがあります。props と state です。両者は非常に異なります。

* [**props** は関数に渡す引数のようなものです](/learn/passing-props-to-a-component)。親コンポーネントから子コンポーネントにデータを渡し、その外観をカスタマイズするために使います。例えば、`Form` は `Button` に props として `color` を渡すことができます。
* [**state** はコンポーネントのメモリのようなものです](/learn/state-a-components-memory)。コンポーネントが情報を追跡し、ユーザ操作に反応して変更できるようにします。例えば、`Button` は `isHovered` という state を保持するかもしれません。

props と state は異なるものですが、それらは協調して働きます。親コンポーネントは state として情報を保持し（それを変更できるように）、その情報を子コンポーネントに props として*渡し*ます。1 度読んだだけでは違いがまだぼんやりと感じられるとしても問題ありません。少し練習することで完全に頭に入るようになります！

</DeepDive>

## ステップ 4：state を保持すべき場所を特定する {/*step-4-identify-where-your-state-should-live*/}

アプリの最小限の state データを特定した後、この state を変更する責任を持つコンポーネント、つまり state を*所有する*コンポーネントを特定する必要があります。ここで思い出しましょう：React では単方向データフロー、つまり親から子コンポーネントへと階層を下る形でのみデータが渡されます。どのコンポーネントがどの状態を所有すべきか、すぐには分からないかもしれません。この概念が初めてであれば難しいかもしれませんが、以下のような手順に従って解決できます！

アプリケーション内の各 state について：

1. その state に基づいて何かをレンダーする*すべて*のコンポーネントを特定する。
2. 階層内でそれらすべての上に位置する、最も近い共通の親コンポーネントを見つける。
3. state がどこにあるべきかを決定する：
    1. 多くの場合、state をその共通の親に直接置くことができる。
    2. state を、その共通の親のさらに上にあるコンポーネントに置くこともできる。
    3. state を所有するのに適切なコンポーネントが見つからない場合は、state を保持するためだけの新しいコンポーネントを作成し、共通の親コンポーネントの階層の上のどこかに追加する。

前のステップで、このアプリケーションに state が 2 つあることがわかりました。検索テキストとチェックボックスの値です。今回の例では、これらは常に一緒に表示されるので、同じ場所に置くことが理にかなっています。

それではこの戦術をサンプルアプリにも適用してみましょう：

1. **state を使用するコンポーネントの特定：**
   * `ProductTable` は、これらの state （検索テキストとチェックボックスの値）に基づいて製品リストをフィルタリングする必要があります。
   * `SearchBar` は、これらの state（検索テキストとチェックボックスの値）を表示する必要があります。
1. **共通の親を見つける：** 両方のコンポーネントに共通の最初の親コンポーネントは `FilterableProductTable` です。
2. **state がどこにあるべきかを決定する：** フィルタ文字列とチェック状態の値を `FilterableProductTable` に保持することにします。

したがって、state の値は `FilterableProductTable` にあることになります。

コンポーネントに state を追加するには、[`useState()` フック](/reference/react/useState)を使用します。フックは、React に「接続 ("hook into")」するための特殊な関数です。`FilterableProductTable` の先頭に 2 つの state 変数を追加し、それらの初期値を指定します：

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

次に、`filterText` と `inStockOnly` を `ProductTable` と `SearchBar` に props として渡します：

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

だんだんとアプリケーションの動作が見えてきましたね。試しに以下のサンドボックスコードで `filterText` の初期値を、`useState('')` から `useState('fruit')` へと書き換えてみてください。検索テキストとテーブルの両方が更新されることがわかります：

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

まだフォームの編集ができないことに気付いたでしょう。その理由について、上のサンドボックスのコンソールエラーに説明があります。

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

上記のサンドボックスでは、`ProductTable` と `SearchBar` は `filterText` と `inStockOnly` という props を読み取り、テーブル、インプット、チェックボックスをレンダーしています。たとえば、`SearchBar` は以下のようにしてインプットの value を指定しています：

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

ただし、まだユーザからのアクション（タイピングなど）に対応するコードを何も書いていません。これが最後のステップになります。


## ステップ 5：逆方向のデータフローを追加する {/*step-5-add-inverse-data-flow*/}

現在のところこのアプリでは、props と state が階層構造の下方向に向かって流れ、適切に表示が行われています。ただし、ユーザの入力に従って state を変更するには、逆方向へのデータの流れをサポートする必要があります。つまり、階層の深いところにあるフォームコンポーネントが、`FilterableProductTable` に存在する state を更新できる必要があるわけです。

双方向データバインディングより多少タイプ量は増えますが、React ではこのデータフローを明示的に記述します。上記の例で何かタイプするか、チェックボックスをオンにしようとしても、React が入力を無視するのがわかるでしょう。これは意図的なものです。`<input value={filterText} />` と記述することで、 `input` の props である `value` を、`FilterableProductTable` から渡された state である `filterText` と常に等しくせよ、という意味になります。 `filterText` の state はまだ一切セットされていないため、入力値が変わることもありません。

ユーザがフォームの内容を変更するたびに、state がそれらの変更を反映して更新されるようにしたいと思います。state は `FilterableProductTable` によって所有されているため、このコンポーネントのみが `setFilterText` と `setInStockOnly` を呼び出すことができます。`SearchBar` が `FilterableProductTable` の state を更新できるようにするには、これらの関数を `SearchBar` に渡す必要があります。

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar` の中で `onChange` イベントハンドラを追加し、それらから親 state を設定します。

 ```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

これでアプリは完全に動作するようになりました！

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

イベントの処理や state の更新に関しては、[インタラクティビティの追加](/learn/adding-interactivity)のセクションで学ぶことができます。

## 次に向かう場所 {/*where-to-go-from-here*/}

ここまでが、React を使ってコンポーネントやアプリケーションを構築する際の考え方についての、非常に簡単な紹介でした。今すぐ [React のプロジェクトを始める](/learn/installation)か、あるいは本チュートリアルで使用された[すべての構文について詳しく学ぶ](/learn/describing-the-ui)ことができます。
