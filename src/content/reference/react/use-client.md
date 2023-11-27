---
title: "'use client'"
titleForTitleTag: "'use client' ディレクティブ"
canary: true
---

<Canary>

`'use client'` は、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。
</Canary>


<Intro>

`'use client'` を使い、どのコードがクライアントで実行されるかをマークします。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `'use client'` {/*use-client*/}

ファイルのトップに `'use client'` を加えることで、当該モジュールとそれが連動してインポートしている依存モジュールがクライアントコードであるとマークします。

```js {1}
'use client';

import { useState } from 'react';
import { formatDate } from './formatters';
import Button from './button';

export default function RichTextEditor({ timestamp, text }) {
  const date = formatDate(timestamp);
  // ...
  const editButton = <Button />;
  // ...
}
```

`'use client'` でマークされているファイルがサーバコンポーネントからインポートされた場合、[互換性のあるバンドラ](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)は当該モジュールのインポートを、サーバで実行されるコードとクライアントで実行されるコードの境界として扱います。

上記では `formatDate` と `Button` は `RichTextEditor` が依存するモジュールですので、これらのモジュール自体に `'use client'` ディレクティブが含まれているかどうかに関わらず、これらもクライアントで評価されます。ある単一のモジュールが、サーバコードからインポートされた場合はサーバで、クライアントコードからインポートされた場合はクライアントで評価される場合があることに注意してください。

#### 注意点 {/*caveats*/}

* `'use client'` はファイルの冒頭、すなわちインポートや他のコードより先になければなりません（コメントは OK です）。シングルクォートまたはダブルクォートで書かれていなければならず、バックティックは無効です。
* `'use client'` モジュールが別のクライアントレンダーされるモジュールからインポートされた場合、ディレクティブの効果はありません。
* コンポーネントモジュールに `'use client'` ディレクティブが含まれている場合、そのコンポーネントは必ずクライアントコンポーネントであることが保証されます。しかしコンポーネントに直接 `'use client'` ディレクティブがなくとも、クライアントで評価されることがあります。
	* コンポーネントがクライアントコンポーネントと見なされるのは、それが `'use client'` ディレクティブを含むモジュールで定義されている場合、またはそれが `'use client'` ディレクティブを含むモジュールの間接的な依存モジュールである場合です。それ以外の場合、サーバコンポーネントとなります。
* クライアントで評価されるようマークされるコードとはコンポーネントに限りません。クライアントモジュールのサブツリーに含まれるすべてのコードは、クライアントに送信され、クライアントで実行されます。
* サーバで評価されるモジュールが `'use client'` のモジュールから値をインポートする場合、その値は React コンポーネントであるか、またはクライアントコンポーネントに渡せるよう[サポート済のシリアライズ可能な props の型](#passing-props-from-server-to-client-components)のいずれかでなければなりません。それ以外の方法で使用すると例外がスローされます。

### `'use client'` がクライアントコードをマークする方法 {/*how-use-client-marks-client-code*/}

React アプリでは、コンポーネントはしばしば別々のファイル、すなわち[モジュール](/learn/importing-and-exporting-components#exporting-and-importing-a-component)に分割されます。

React Server Components を使用するアプリでは、デフォルトでアプリはサーバでレンダーされます。`'use client'` は[モジュール依存関係ツリー](/learn/understanding-your-ui-as-a-tree#the-module-dependency-tree)にサーバ・クライアント境界を導入、つまり実質的にはクライアントモジュールのサブツリーの作成を行います。

これをより具体的に示すために、以下の React Server Components アプリを考えてみましょう。

<Sandpack>

```js App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js InspirationGenerator.js
'use client';

import { useState } from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote} />
      <button onClick={next}>Inspire me again</button>
      {children}
    </>
  );
}
```

```js Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js inspirations.js
export default [
  "Don’t let yesterday take up too much of today.” — Will Rogers",
  "Ambition is putting a ladder against the sky.",
  "A joy that's shared is a joy made double.",
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

このサンプルアプリのモジュール依存関係ツリーでは、`InspirationGenerator.js` に書かれた `'use client'` ディレクティブが、当該モジュールとそのすべての間接的な依存モジュールをクライアントモジュールとしてマークします。これで `InspirationGenerator.js` から始まるサブツリー全体がクライアントモジュールとなるのです。

<Diagram name="use_client_module_dependency" height={250} width={545} alt="トップノードがモジュール 'App.js' を表す木構造のグラフ。'App.js'には 'Copyright.js'、'FancyText.js'、'InspirationGenerator.js' の 3 つの子ノードがある。'InspirationGenerator.js'には 'FancyText.js'と'inspirations.js' の 2 つの子ノードがある。'InspirationGenerator.js'を含む下のノードには黄色い背景色が付けられており、'InspirationGenerator.js'の 'use client' ディレクティブによってこのサブグラフがクライアント側でレンダーされることを示している。">
`'use client'` は React Server Components アプリのモジュール依存関係ツリーを分割し、`InspirationGenerator.js` とそのすべての依存モジュールをクライアントレンダーされるものとしてマークする
</Diagram>

レンダー中、フレームワークはルートコンポーネントから始め、[レンダーツリー](/learn/understanding-your-ui-as-a-tree#the-render-tree)を順にレンダーしていきますが、その際にクライアントとマークされたものからインポートされたコードの評価を選択的に除外します。

その後レンダーツリーのうちサーバでレンダーされた部分が、クライアントに送信されます。クライアントは、ダウンロードしたクライアントコードを用いて、ツリーの残りの部分のレンダーを完了します。

<Diagram name="use_client_render_tree" height={250} width={500} alt="各ノードがコンポーネントを表し、その子要素を子コンポーネントとして表すツリーグラフ。トップレベルのノードは 'App' とラベル付けされ、2つの子コンポーネント 'InspirationGenerator' と 'FancyText' を持っています。'InspirationGenerator' は2つの子コンポーネント、'FancyText' と 'Copyright' を持っています。'InspirationGenerator' とその子コンポーネント 'FancyText' はクライアントレンダリングされるとマークされています。">
React Server Components アプリのレンダーツリー。`InspirationGenerator` とその子コンポーネント `FancyText` は、クライアントとマークされたコードからエクスポートされたコンポーネントであるため、クライアントコンポーネントと見なされる
</Diagram>

ここで以下の定義を導入しましょう。

* **クライアントコンポーネント**とは、レンダーツリーの中の、クライアントでレンダーされるコンポーネントです。
* **サーバコンポーネント**とは、レンダーツリーの中の、サーバでレンダーされるコンポーネントです。

上記のサンプルアプリでは、`App`、`FancyText`、`Copyright` はすべてサーバでレンダーされるのでサーバコンポーネントと見なされます。`InspirationGenerator.js` とその間接的な依存モジュールはクライアントコードとしてマークされているため、コンポーネント `InspirationGenerator` とその子コンポーネントである `FancyText` はクライアントコンポーネントとなります。

<DeepDive>
#### `FancyText` がサーバコンポーネントでありクライアントコンポーネントでもある理由 {/*how-is-fancytext-both-a-server-and-a-client-component*/}

上記の定義によれば、コンポーネント `FancyText` は、サーバコンポーネントでもありクライアントコンポーネントでもあることになります。どういうことでしょうか？

まずは "コンポーネント" という用語があまり厳密ではないことを明示的に意識しましょう。"コンポーネント" とは以下の 2 つの意味で使用されます。

1. 「コンポーネント」は**コンポーネントの定義**を指すことがあります。ほとんどの場合、これは関数です。

```js
// This is a definition of a component
function MyComponent() {
  return <p>My Component</p>
}
```

2. 「コンポーネント」はまた、その定義に従って**使用されている個々のコンポーネント**を指すこともあります。
```js
import MyComponent from './MyComponent';

function App() {
  // This is a usage of a component
  return <MyComponent />;
}
```

ここが厳密でなくとも大抵の場合は概念を説明する際に問題とはなりませんが、この場合はそうではありません。

サーバコンポーネントやクライアントコンポーネントについて話すとき、コンポーネントの個々の使用法を指しています。

* コンポーネントが `'use client'` ディレクティブを含んだモジュールで定義されている場合や、コンポーネントが他のクライアントコンポーネントからインポートされコールされる場合、そのコンポーネントの使用法はクライアントコンポーネントであるということになります。
* それ以外の場合、そのコンポーネントの使用法はサーバコンポーネントだということになります。


<Diagram name="use_client_render_tree" height={150} width={450} alt="各ノードがコンポーネントを表し、その子供を子コンポーネントとして表すツリーグラフ。トップレベルのノードは 'App' とラベル付けされており、'InspirationGenerator' と 'FancyText' の 2 つの子コンポーネントを持っている。'InspirationGenerator' は 'FancyText' と 'Copyright' の 2 つの子コンポーネントを持っている。'InspirationGenerator' とその子コンポーネント 'FancyText' はクライアントでレンダリングされるとマークされている。">コンポーネントの「使用法」を表すのがレンダーツリー</Diagram>

`FancyText` の問題に戻りましょう。分かるのは、コンポーネントの定義として `'use client'` ディレクティブがないこと、そして使用法として 2 種類あることです。

`FancyText` が `App` の子として使用されている場合、その使用法はサーバコンポーネントです。`FancyText` が `InspirationGenerator` の下でインポートされて呼び出されている場合、`InspirationGenerator` に `'use client'` ディレクティブが含まれているため、その `FancyText` の使用法はクライアントコンポーネントとなります。

つまり、`FancyText` のコンポーネント定義がサーバ上で評価される一方で、クライアントコンポーネントとして使用されるためクライアントにダウンロードもされる、ということになります。

</DeepDive>

<DeepDive>

#### `Copyright` がサーバコンポーネントである理由 {/*why-is-copyright-a-server-component*/}

`Copyright` はクライアントコンポーネントである `InspirationGenerator` の子としてレンダーされているので、それがサーバコンポーネントになっていることに驚くかもしれません。

`'use client'` がサーバとクライアントのコードの境界を、レンダーツリーではなく*モジュール依存関係ツリー*上で定義することを思い出してください。

<Diagram name="use_client_module_dependency" height={200} width={500} alt="トップノードがモジュール 'App.js' を表すツリーグラフ。'App.js' には 'Copyright.js'、'FancyText.js'、'InspirationGenerator.js' の 3 つの子ノードがある。'InspirationGenerator.js' には 'FancyText.js' と 'inspirations.js' の 2 つの子ノードがある。'InspirationGenerator.js' 自体とそれ以下のノードは背景が黄色になっており、'InspirationGenerator.js' に 'use client' ディレクティブがあるためこのサブグラフがクライアントでレンダーされることを示している。">
`'use client'` はモジュール依存ツリー上でサーバとクライアントのコードの境界を定義する
</Diagram>

モジュール依存関係ツリー上では、`App.js` が `Copyright.js` モジュールから `Copyright` をインポートして呼び出していることがわかります。`Copyright.js` には `'use client'` ディレクティブが含まれていないため、このコンポーネントはサーバレンダーで使用されています。`App` はルートコンポーネントでありサーバ上でレンダーされるからです。

クライアントコンポーネントがサーバコンポーネントをレンダーできるのは、JSX を props として渡すことができるためです。上記の例の場合、`InspirationGenerator` は [children](/learn/passing-props-to-a-component#passing-jsx-as-children) として `Copyright` を受け取ります。しかし、`InspirationGenerator` モジュールは `Copyright` モジュールを直接インポートしたり、コンポーネントを呼び出したりしているわけではありません。それらはすべて `App` によって行われます。実際、`Copyright` コンポーネントは `InspirationGenerator` のレンダーすら始まらないうちに完全に実行されます。

つまり、コンポーネント間に親子関係があるからといって、同じ環境でレンダーされることが保証されるわけではない、ということを覚えておきましょう。

</DeepDive>

### `'use client'` をいつ使うべきか {/*when-to-use-use-client*/}

`'use client'` を使うことで、どのコンポーネントがクライアントコンポーネントであるかを決定できます。デフォルトはサーバコンポーネントですので、その利点と制限事項を簡単に概観することで、何をクライアントレンダーとしてマークする必要があるかを判断できるようにしましょう。

話を簡単にするためサーバコンポーネントについて説明しますが、サーバで実行されるアプリのすべてのコードに同じ原則が適用されます。

#### サーバコンポーネントの利点 {/*advantages*/}
* サーバコンポーネントにより、クライアントに送信され実行されるコードの量を減らすことができます。バンドルされてクライアントで評価されるのはクライアントモジュールだけです。
* サーバコンポーネントにはサーバ上で実行されることに伴う利点があります。ローカルファイルシステムにアクセスでき、データフェッチやネットワークリクエストのレイテンシが低い可能性があります。

#### サーバコンポーネントの制限事項 {/*limitations*/}
* サーバコンポーネントはユーザによるインタラクションをサポートできません。イベントハンドラはクライアントで登録されトリガされる必要があるためです。
	* 例えば、`onClick` のようなイベントハンドラはクライアントコンポーネントでのみ定義できます。
* サーバコンポーネントではほとんどのフックを使用できません。
	* サーバコンポーネントがレンダーされるとき、その出力は本質的にクライアントでレンダーすべきコンポーネントのリストになります。サーバコンポーネントはレンダー後にメモリに残らないため、state を持つことはできません。

### サーバコンポーネントから返せるシリアライズ可能な型 {/*serializable-types*/}

React アプリケーションでは一般的に、親コンポーネントから子コンポーネントにデータを渡します。これらが異なる環境でレンダーされるため、サーバコンポーネントからクライアントコンポーネントにデータを渡す際には特別な配慮が必要です。

サーバコンポーネントからクライアントコンポーネントに渡される props の値は、シリアライズ可能 (serializable) である必要があります。

シリアライズ可能な props には以下のものがあります：
* プリミティブ
	* [文字列](https://developer.mozilla.org/en-US/docs/Glossary/String)
	* [数値](https://developer.mozilla.org/en-US/docs/Glossary/Number)
	* [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
	* [ブーリアン](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
	* [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
	* [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
	* [シンボル](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)、ただし [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) を通じてグローバルシンボルレジストリに登録されたシンボルのみ
* シリアライズ可能な値を含んだ Iterable
	* [文字列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
	* [配列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
	* [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
	* [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
	* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) と [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* プレーンな[オブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): [オブジェクト初期化子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)で作成され、シリアライズ可能なプロパティを持つもの
* [サーバアクション (server action)](/reference/react/use-server) としての関数
* クライアントまたはサーバコンポーネントの要素（JSX）
* [プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

以下のものはサポートされていません。
* クライアントとマークされたモジュールからエクスポートされていない、または [`'use server'`](/reference/react/use-server) でマークされていない[関数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)
* [クラス](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* 任意のクラスのインスタンス（上記の組み込みクラスを除く）や、[null プロトタイプのオブジェクト](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* グローバルに登録されていないシンボル、例：`Symbol('my new symbol')`


## 使用法 {/*usage*/}

### ユーザ操作や state を実装する {/*building-with-interactivity-and-state*/}

<Sandpack>

```js App.js
'use client';

import { useState } from 'react';

export default function Counter({initialValue = 0}) {
  const [countValue, setCountValue] = useState(initialValue);
  const increment = () => setCountValue(countValue + 1);
  const decrement = () => setCountValue(countValue - 1);
  return (
    <>
      <h2>Count Value: {countValue}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </>
  );
}
```

</Sandpack>

`Counter` は値を増減させるために `useState` フックとイベントハンドラを必要とするので、このコンポーネントはクライアントコンポーネントでなければならず、ファイル冒頭に `'use client'` ディレクティブが必要です。

対照的に、インタラクションなしで UI をレンダーするコンポーネントはクライアントコンポーネントである必要はありません。

```js
import { readFile } from 'node:fs/promises';
import Counter from './Counter';

export default async function CounterContainer() {
  const initialValue = await readFile('/path/to/counter_value');
  return <Counter initialValue={initialValue} />
}
```

例えば、`Counter` の親コンポーネントである `CounterContainer` は、インタラクティブではなく state を使用しないため、`'use client'` は必要ありません。むしろ `CounterContainer` はサーバコンポーネントでなければなりません。サーバ上のローカルファイルシステムから読み取っており、それが可能なのはサーバコンポーネントだけだからです。

また、サーバやクライアント固有の機能を使用しないため、レンダーされるべき場所に関して関知しないコンポーネントもあります。先ほどの例でいうと、`FancyText` がそのようなコンポーネントです。

```js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

このような場合、`'use client'` ディレクティブを追加しません。その結果、サーバコンポーネントから参照されたときに、`FancyText` の（ソースコードではなく）*出力結果*が、ブラウザに送信されます。先ほどのアプリの例で示したように、`FancyText` はどこからインポートされ、どこで使用されるかによって、サーバコンポーネントになることもクライアントコンポーネントになることもあるのです。

しかし、`FancyText` の HTML 出力が（依存モジュールも含んだ）ソースコードに比べて大きいような場合は、必ずクライアントコンポーネントとなるように強制する方が効率的かもしれません。一例として、長い SVG パス文字列を返すようなコンポーネントは、強制的にクライアントコンポーネントとしてレンダーする方が効率的である可能性があるでしょう。

### クライアント API の使用 {/*using-client-apis*/}

あなたの React アプリでは、Web ストレージ、オーディオやビデオの操作、デバイスハードウェア、[その他もろもろ](https://developer.mozilla.org/en-US/docs/Web/API)のブラウザ API といった、クライアント固有の API を使用することがあるでしょう。

以下の例では、コンポーネントは [DOM API](https://developer.mozilla.org/en-US/docs/Glossary/DOM) を使用して [`canvas`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) 要素を操作しています。これらの API はブラウザでのみ利用可能なので、クライアントコンポーネントとしてマークする必要があります。

```js
'use client';

import {useRef, useEffect} from 'react';

export default function Circle() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext('2d');
    context.reset();
    context.beginPath();
    context.arc(100, 75, 50, 0, 2 * Math.PI);
    context.stroke();
  });
  return <canvas ref={ref} />;
}
```

### サードパーティライブラリの使用 {/*using-third-party-libraries*/}

React アプリでは、一般的な UI パターンやロジックを処理するためにサードパーティのライブラリがよく用いられます。

これらのライブラリがコンポーネントのフックやクライアント API に依存することがあります。以下のような React API を使用するサードパーティのコンポーネントは、クライアント上で実行する必要があります。
* [createContext](/reference/react/createContext)
* [`react`](/reference/react/hooks) と [`react-dom`](/reference/react-dom/hooks) のフック、ただし [`use`](/reference/react/use) と [`useId`](/reference/react/useId) は除く
* [forwardRef](/reference/react/forwardRef)
* [memo](/reference/react/memo)
* [startTransition](/reference/react/startTransition)
* DOM の挿入やネイティブプラットフォームビューなどその他のクライアント API

ライブラリがサーバコンポーネントと互換性を有するように更新済みであれば、中に既に `'use client'` マーカが含まれていますので、サーバコンポーネントから直接使用することができます。ライブラリが更新されていない場合、あるいはコンポーネントが受け取る props にクライアントでのみ指定できるイベントハンドラのようなものが含まれている場合、サードパーティのクライアントコンポーネントとそれを使用したいサーバコンポーネントの間に、自分でクライアントコンポーネントファイルを追加する必要があるかもしれません。

[TODO]: <> (Troubleshooting - need use-cases)
