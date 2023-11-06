---
title: UI をツリーとして理解する
---

<Intro>

React アプリは、多数のコンポーネントが互いにネストされることで形成されます。React はどのようにアプリのコンポーネント構造を管理しているのでしょうか？

React をはじめとする多くの UI ライブラリは、UI をツリーとしてモデル化します。アプリをツリーとして捉えることにより、コンポーネント間の関係を理解するのに役立ちます。これを理解することで、これから学んでいくパフォーマンスや state 管理に関連した問題をデバッグするのに役立つでしょう。

</Intro>

<YouWillLearn>

* React にはコンポーネント構造がどのように「見える」のか
* レンダーツリーとは何で、何の役に立つのか
* モジュール依存ツリーとは何で、何の役に立つのか

</YouWillLearn>

## UI をツリーとして理解する {/*your-ui-as-a-tree*/}

ツリーとはアイテム間の関係を表すモデルの一種です。UI はよくツリー構造を使用して表現されます。例えば、ブラウザは HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) や CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)) をモデル化するためにツリー構造を使用します。モバイルプラットフォームもビューの階層構造を表現するためにツリーを使用します。

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="横に並んだ3つのセクションからなる図。最初のセクションには、'Component A'、'Component B'、'Component C' とラベル付けされた 3 つの長方形が縦に積み重ねられている。次のパネルへの遷移は 'React' とラベル付けされた React ロゴが上にある矢印で示されている。中央セクションには、ルートが 'A' で子が 'B' と 'C' のラベルが付いたコンポーネントのツリーがある。次のセクションへの遷移も、'React' とラベル付けされた React ロゴが上にある矢印で示されている。最後である 3 つ目のセクションは、8 つのノードからなるツリーを含むブラウザのワイヤーフレームで、そのうちの一部だけが強調表示され、中央のセクションからのサブツリーを示している。">

React はコンポーネントから UI ツリーを作成する。この例では、UI ツリーは DOM へのレンダーに使用されている。
</Diagram>

ブラウザやモバイルプラットフォームと同様に、React もツリー構造を使用して React アプリ内のコンポーネント間の関係を管理し、モデル化します。そのようなツリーは、React アプリ内をデータがどのように流れるか理解し、レンダーやアプリサイズを最適化する際の有用なツールとなります。

## レンダーツリー {/*the-render-tree*/}

コンポーネントの主要な特徴のひとつは、コンポーネント同士を組み合わせられることです。[コンポーネントをネストする](/learn/your-first-component#nesting-and-organizing-components)ことで、親コンポーネント・子コンポーネントという概念が発生します。その親コンポーネントもまた、別のコンポーネントの子かもしれません。

React アプリをレンダーする際、この関係性をツリーとしてモデル化することができます。これをレンダーツリーと呼びます。

以下は、ひらめきを与えてくれる格言をレンダーするための React アプリです。

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
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

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

```js quotes.js
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

<Diagram name="render_tree" height={250} width={500} alt="5 つのノードからなるツリー。各ノードはコンポーネントを表している。ツリーのルートは App で、それから矢印が 2 つ伸びており、'InspirationGenerator' と 'FancyText' を指している。矢印には 'renders' という言葉が書かれている。'InspirationGenerator' のノードからも矢印が 2 つ伸びており、'FancyText' と 'Copyright' のノードを指している。">

React は、レンダーされたコンポーネントから構成される UI ツリーである*レンダーツリー*を作成する


</Diagram>

このアプリから、上のようなレンダーツリーを構築することができます。

ツリー構造はノードで構成されており、各ノードがコンポーネントを表します。`App`、`FancyText`、`Copyright` などはすべてこのツリーのノードです。

React レンダーツリーのルートノードは、アプリの[ルートコンポーネント](/learn/importing-and-exporting-components#the-root-component-file)となります。この場合、ルートコンポーネントは `App` であり、React が最初にレンダーするコンポーネントです。ツリーの各矢印は、親コンポーネントから子コンポーネントに伸びています。

<DeepDive>

#### レンダーツリー内の HTML タグはどこに？ {/*where-are-the-html-elements-in-the-render-tree*/}

上記のレンダーツリーの図には、各コンポーネントがレンダーする HTML タグについては載っていません。これは、レンダーツリーとは React の[コンポーネント](learn/your-first-component#components-ui-building-blocks)だけで構成されるものだからです。

UI フレームワークとしての React は特定のプラットフォームに依存しません。react.dev ではウェブへレンダーする例が紹介されており、そこでは UI のプリミティブとして HTML マークアップが使用されます。しかし、React アプリは同様にモバイルやデスクトッププラットフォームにレンダーすることも可能であり、そこでは [UIView](https://developer.apple.com/documentation/uikit/uiview) や [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0) のような別の UI プリミティブが使用されるでしょう。

これらのプラットフォームの UI プリミティブは React の一部ではありません。React のレンダーツリーを考えることにより、アプリがどのプラットフォームにレンダーされるのかとは独立して、React アプリを理解できるようになります。

</DeepDive>

レンダーツリーは、React アプリケーションにおける 1 回のレンダーを表します。[条件付きレンダー](/learn/conditional-rendering)を使用することで、親コンポーネントは渡されたデータに応じて異なる子をレンダーすることができます。

アプリを更新して、格言とカラーのいずれかが条件付きでレンダーされるようにしてみましょう。

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

```js Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

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
  {type: 'quote', value: "Don’t let yesterday take up too much of today.” — Will Rogers"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Ambition is putting a ladder against the sky."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "A joy that's shared is a joy made double."},
  {type: 'color', value: "#F9F2B4"},
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
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="6 つのノードからなるツリー。ツリーのルートは App で、それから矢印が 2 つ伸びており、'InspirationGenerator' と 'FancyText' を指している。矢印は実線であり 'renders' と書かれている。'InspirationGenerator' のノードからは矢印が 3 つ伸びている。そのうち 'FancyText' と 'Color' への矢印は点線であり 'renders?' と書かれている。もう 1 本の矢印は実線で 'Copyright' のノードを指しており、'renders' と書かれている。">

条件付きレンダーにより、違うレンダーではレンダーツリーが異なるコンポーネントをレンダーする。

</Diagram>

この例では、`inspiration.type` の値によって、`<FancyText>` または `<Color>` のいずれかがレンダーされます。一連のレンダーが起きるたびに、レンダーツリーは異なったものになる可能性があるのです。

<<<<<<< HEAD
毎回のレンダーごとにレンダーツリーが異なることがあるにせよ、このようなツリーは一般的に、React アプリケーションにおいてトップレベルコンポーネントとリーフ（葉, 末端）コンポーネントがどれなのかを理解するのに役立ちます。トップレベルコンポーネントとはルートコンポーネントに最も近いコンポーネントです。下にあるすべてのコンポーネントのレンダーパフォーマンスに影響を与え、しばしばとても複雑な内容を含んでいます。リーフコンポーネントはツリーの下側にあり、子コンポーネントを持たず、通常は頻繁に再レンダーされます。
=======
Although render trees may differ across render passes, these trees are generally helpful for identifying what the *top-level* and *leaf components* are in a React app. Top-level components are the components nearest to the root component and affect the rendering performance of all the components beneath them and often contain the most complexity. Leaf components are near the bottom of the tree and have no child components and are often frequently re-rendered.
>>>>>>> a8790ca810c1cebd114db35a433b90eb223dbb04

これらのカテゴリのコンポーネントを特定することにより、アプリケーションのデータの流れとパフォーマンスを理解するのに役立ちます。

## モジュール依存関係ツリー {/*the-module-dependency-tree*/}

React アプリにおいて、ツリー構造で関係性をモデル化できるものがもうひとつあります。アプリのモジュールの依存関係です。コンポーネントやロジックを別々のファイルに[分割する](/learn/importing-and-exporting-components#exporting-and-importing-a-component)ことで、[JS モジュール](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)を作成し、コンポーネントや関数や定数をエクスポートします。

モジュール依存関係ツリーにおいては、各ノードはモジュールとなり、それぞれの枝はそのモジュール内の `import` 文を表します。

先ほどのひらめきアプリの例では、以下のようなモジュール依存関係ツリー（あるいは単に依存関係ツリー）を作成することができます。

<Diagram name="module_dependency_tree" height={250} width={658} alt="7 つのノードからなるツリー。それぞれのノードにモジュール名が書かれている。ツリーのトップレベルのノードには 'App.js' と書かれている。そこから 3 つの矢印が伸びており、'InspirationGenerator.js'、'FancyText.js'、'Copyright.js' を指している。矢印には 'imports' と書かれている。'InspirationGenerator.js' からも 3 つの矢印が伸びており、'FancyText.js'、'Color.js'、'inspirations.js' を指している。矢印には 'imports' と書かれている。">

ひらめきアプリのモジュール依存関係ツリー

</Diagram>

このツリーのルートノードはルートモジュールで、エントリーポイントファイルとも呼ばれます。これがルートコンポーネントを含んだモジュールであることも多いでしょう。

同じアプリのレンダーツリーと比べると、似た部分もありますが、いくつか注目すべき違いがあります。

* ツリーを構成するノードが表しているのはコンポーネントではなくモジュールです。
* コンポーネントの書かれていない `inspirations.js` のようなモジュールもこのツリーには含まれています。レンダーツリーはコンポーネントのみを含みます。
* `Copyright.js` は `App.js` の下に表示されていますが、レンダーツリーの方では、`Copyright` コンポーネントは `InspirationGenerator` の子でした。これは、`InspirationGenerator` が props である [children](/learn/passing-props-to-a-component#passing-jsx-as-children) 経由で JSX を受け付けるためです。`Copyright` を子コンポーネントとしてレンダーしてはいますが、それに対応するモジュールをインポートしているわけではありません。

依存関係ツリーは、React アプリを実行するためにどのモジュールが必要かを判断するのに役立ちます。通常、React アプリを本番環境用にビルドする際には、クライアントに送信するために必要な JavaScript をすべてバンドルにまとめるというビルドステップが存在します。これを担当するツールは[バンドラ](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem)と呼ばれ、バンドラは依存関係ツリーを使用することで、どのモジュールを含めるべきかを決定します。

アプリが成長するにつれて、バンドルサイズも大きくなります。バンドルサイズが大きいと、クライアントがダウンロードして実行するのにコストがかかります。バンドルサイズが大きいと、UI が描画されるまでの時間も遅くなります。アプリの依存関係ツリーを把握することで、これらの問題のデバッグに役立つでしょう。

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* ツリー構造とは、何らかの物どうしの関係性を表現する際の一般的な方法である。UI をモデル化するために多用される。
* レンダーツリーは、1 回のレンダーにおける React コンポーネント間のネスト関係を表現するものである。
* 条件付きレンダーにより、毎回のレンダー間でレンダーツリーは変化する可能性がある。例えば props の値が変わることでコンポーネントは異なる子コンポーネントをレンダーする可能性がある。
* レンダーツリーの概念は、トップレベルとリーフコンポーネントを特定するのに役立つ。トップレベルのコンポーネントはそれらの下の全コンポーネントのレンダーパフォーマンスに影響を与え、リーフコンポーネントは頻繁に再レンダーされる。これらを把握することでレンダーパフォーマンスの理解とデバッグに役立つ。
* 依存関係ツリーは、React アプリ内のモジュール依存関係を表現する。
* 依存関係ツリーは、アプリを届けるために必要なコードをバンドルするビルドツールによって使用される。
* 依存関係ツリーは、ペイントまでの時間を遅らせるバンドルサイズの問題をデバッグしたり、どのコードをバンドル対象とするか最適化するきっかけとなることに役立つ。

</Recap>

[TODO]: <> (Add challenges)
