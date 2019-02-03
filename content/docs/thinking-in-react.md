---
id: thinking-in-react
title: Reactらしい考え方
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

巨大で軽快なWebアプリを開発する場合に、React は最高の手段であると、私たちは考えています。Facebook や Instagram といった私たちのサービスにおいても、とてもよくスケールしています。

React のすばらしい特長がいくつもありますが、あなたがどんなアプリを作ろうかと考えたことが、そのままアプリの作り方になる、というのはそのひとつです。本ドキュメントでは、検索可能な商品データ表を React で作っていく様子をお見せしましょう。

## モックから始めよう

すでに、JSON API が実装済みで、デザイナーからもデザインモックがもらえているとしましょう。モックは次のような見た目だったとします。

![デザインモック](../images/blog/thinking-in-react-mock.png)

また、JSON API は次のようなデータを返してくるとしましょう。

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Step 1: UI をコンポーネントの階層構造に落とし込む

まず最初に行うのは、モックを形作っている各コンポーネント（構成要素）を四角で囲んで、それぞれに名前をつけていくことです。もしあなたがデザイナーと一緒に仕事をしている場合は、彼らがすでにこれに相当する作業を終えている可能性がありますので、話をしに行きましょう。彼らが Photoshop でレイヤ名にしていた名前が、最終的にはあなたの React コンポーネントの名前になりうるのです！

しかし、どうやってコンポーネントとして括るべき範囲を見つけられるのでしょうか。ちょうど、関数やオブジェクトをどのような責任範囲で作るのかを決めるときと、同じ手法が使えます。このような手法のひとつに、[単一責任の原則（Single Responsibility Principle）](https://en.wikipedia.org/wiki/Single_responsibility_principle)があり、これに沿って考えると、ひとつのコンポーネントはひとつのことだけができるべきである、という指針が得られます。将来、コンポーネントが肥大化してしまった場合には、小さなコンポーネントに分割するべきである、という話でもあります。

皆さんがこれまで JSON で作ったデータモデルをユーザーに向けて表示してきた経験から、モデルを正しく構築できていれば、UI（つまりコンポーネントの構造）へのデータマッピングも上手くいくであろうことは想像に難くないでしょう。これは、UI とデータモデルが同じ **情報の構造** を持つ傾向があるためです。このおかげで、UI をコンポーネントに切り分ける作業は自明なものになりがちです。データモデルの 1 要素を表現するコンポーネントに、モックを分割して落とし込んでみましょう。

![コンポーネント図](../images/blog/thinking-in-react-components.png)

5 種類のコンポーネントがこのシンプルなアプリの中にあることが見て取れます。それぞれの解説の中で、データを表すものについては斜体にしました。
<!-- nkzn注: 日本語フォントは斜体を表現できないことが多いので、別の表現でマークアップしたほうがいいかもしれない -->

  1. **`FilterableProductTable`（オレンジ色）：** このサンプル全体を含む
  2. **`SearchBar`（青色）：** すべての *ユーザー入力* を受け付ける
  3. **`ProductTable`（緑色）：** *ユーザー入力* に基づく *データの集合* を表示・フィルタする
  4. **`ProductCategoryRow`（水色）：** *カテゴリ* を見出しとして表示する
  5. **`ProductRow`（赤色）：** 各 *商品* を 1 行で表示する

`ProductTable` を見てみると、表のヘッダー（「Name」や「Price」のラベルを含む）が自身のコンポーネントを持っていないことがわかります。これは好みの問題で、コンポーネントにするかしないかは両論あります。今回の例でいえば、ヘッダーを `ProductTable` の一部にしたのは、 *データの集合* を描画するという `ProductTable` の責務の一環として適切だったからです。しかしながら、将来ヘッダーが肥大化して複雑になった場合（例えばソート機能を追加した場合など）は、 `ProductTableHeader` のようなコンポーネントにするのが適切になるでしょう。

さて、モック内にコンポーネントを定義できましたので、階層構造に並べてみましょう。簡単なことです。モックで他のコンポーネントの中にあるコンポーネントを、階層構造でも子要素として配置すればいいのです。次のようになります。

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Step 2：Reactで静的なバージョンを作成する

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a> on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

さて、コンポーネントの階層構造が決まったので、アプリの実装に取り掛かりましょう。最初は、データモデルを使用して UI の描画だけを行い、ユーザーからの操作はできないというバージョンを作っるのが、もっとも簡単でしょう。なぜ最初から操作できるバージョンを作らないのでしょうか。多くの場合、静的な（操作できない）バージョンを作る際には、タイピングする量が多い代わりに悩むことが少ない傾向があります。逆に、操作できるように改修するときには、悩ましいことが多い代わりにタイピングの量は少ない傾向があります。そういった理由から、先に操作できないバージョンを作ります。

データモデルを描画するだけの機能を持った、静的なバージョンのアプリを作る際には、再利用可能なコンポーネントを組み合わせて、それらに *props* を通じてデータを渡す形で、自分のコンポーネントを組み上げていきたいですよね。*props* は親から子へとデータを渡すための手段です。もし、あなたが *state* に慣れ親しんでいる場合でも、今回の静的なバージョンを作る上では**一切 state を使わないでください。** state はユーザー操作や時間経過などで動的に変化するデータを扱うために確保されている機能です。今回のアプリは静的なバージョンなので、stateは必要ありません。

コンポーネントはトップダウンで作っても、ボトムアップで作っても問題ありません。 つまり、高い階層にあるコンポーネント（例えば `FilterableProductTable`）から作り始めても、低い階層にあるコンポーネント（`ProductRow` など）から作り始めても、どちらでもいいのです。身近な話題に置き換えて考えてみると、システム開発プロジェクトの進行は、多くの場合トップダウンで進めたほうがやりやすいですが、巨大なプロジェクトなら、ボトムアップで開発を進めるたびに自動テストを書いていったほうがやりやすい、といった話題が近いかもしれません。

最後に、再利用可能な、データモデルを描画するためのコンポーネントで作るライブラリについて考えてみましょう。今回のアプリは静的なバージョンなので、コンポーネントは `render()` メソッドだけを持つことになります。階層構造の中で最上位のコンポーネント（`FilterableProductTable`）が、データモデルを props として受け取ることになるでしょう。一度アプリを表示した後、あなたが元となるデータモデルを更新して再度 `ReactDOM.render()` を呼び出すと、UI が更新されることになります。このやり方なら、複雑なことをしていないので、UI がどのように更新されて、どこを変更すればよいか、容易に理解できることでしょう。React の**単方向データフロー**（あるいは*単方向バインディング*）は、すべてをモジュール化し、高速化します。

このステップを実施する上で助けが必要な場合は、[React ドキュメント](/docs/)を参照してください。

### 幕間：Props vs State

React には 2 種類の「モデル」データが存在します。 props と state です。このふたつの相違を理解するのは重要なことです。もしあなたがこれらの違いについての知識に自信がない場合は、[公式の React ドキュメント](/docs/interactivity-and-dynamic-uis.html)に目を通すとよいでしょう。

## Step 3：UI の状態を最小の（しかし完全な）形で表現する

UI をインタラクティブなものにするにあたり、UIを構築する元となっているデータモデルを更新できるようにしておきたいですね。React なら **state** を使うことで容易に実現できます。

適切に開発を進めていくにあたり、そのアプリに求められている更新可能な状態の最小構成を、最初に考えておいたほうがよいでしょう。ここで重要なのは、[DRY（*Don't Repeat Yourself*）](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)の原則です。アプリケーションが必要としている最小限の状態を把握しておき、他に必要なものが出てきたら、そのとき計算すればよいのです。例を挙げてみましょう。もしあなたがTODOリストを作ることになったら、TODOの各項目を配列で保持しますよね。個数のカウント用に、別の状態変数を持ったりはしません。その代わりに、TODOの項目数を表示したいのであれば、単純に配列の length を使えばよいのです。

今回のサンプルアプリを形作るデータについて考えてみましょう。次のようなデータがあります。

  * 元となる商品のリスト
  * ユーザーが入力した検索文字列
  * チェックボックスの値
  * フィルタ済みの商品のリスト

それぞれについて見ていき、どれが state になりうるのかを考えてみます。各データについて、 3 つの質問をするだけです。

  1. 親から props を通じて与えられたデータでしょうか？　もしそうなら、それは state ではありません
  2. 時間経過で変化しないままでいるデータでしょうか？　もしそうなら、それは state ではありません
  3. コンポーネント内にある他の props や state を使って算出可能なデータでしょうか？　もしそうなら、それは state ではありません

元となる商品のリストは props から渡されるので、これは state ではありません。検索文字列とチェックボックスは時間の経過の中で変化し、また、算出することもできないため、state だと思われます。最後に、フィルタ済みの商品のリストは state ではありません。何故ならば、元となる商品のリストと検索文字列とチェックボックスの値を組み合わせることで、フィルタ済みの商品のリストを算出することが可能だからです。

というわけで、state と呼べるのは次の 2 つです。

  * ユーザーが入力した検索文字列
  * チェックボックスの値

## Step 4: Identify Where Your State Should Live

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> on <a href="http://codepen.io">CodePen</a>.</p>

OK, so we've identified what the minimal set of app state is. Next, we need to identify which component mutates, or *owns*, this state.

Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. **This is often the most challenging part for newcomers to understand,** so follow these steps to figure it out:

For each piece of state in your application:

  * Identify every component that renders something based on that state.
  * Find a common owner component (a single component above all the components that need the state in the hierarchy).
  * Either the common owner or another component higher up in the hierarchy should own the state.
  * If you can't find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

Let's run through this strategy for our application:

  * `ProductTable` needs to filter the product list based on state and `SearchBar` needs to display the search text and checked state.
  * The common owner component is `FilterableProductTable`.
  * It conceptually makes sense for the filter text and checked value to live in `FilterableProductTable`

Cool, so we've decided that our state lives in `FilterableProductTable`. First, add an instance property `this.state = {filterText: '', inStockOnly: false}` to `FilterableProductTable`'s `constructor` to reflect the initial state of your application. Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a prop. Finally, use these props to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

You can start seeing how your application will behave: set `filterText` to `"ball"` and refresh your app. You'll see that the data table is updated correctly.

## Step 5: Add Inverse Data Flow

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> on <a href="http://codepen.io">CodePen</a>.</p>

So far, we've built an app that renders correctly as a function of props and state flowing down the hierarchy. Now it's time to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`.

React makes this data flow explicit to make it easy to understand how your program works, but it does require a little more typing than traditional two-way data binding.

If you try to type or check the box in the current version of the example, you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.

Let's think about what we want to happen. We want to make sure that whenever the user changes the form, we update the state to reflect the user input. Since components should only update their own state, `FilterableProductTable` will pass callbacks to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. The callbacks passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

Though this sounds complex, it's really just a few lines of code. And it's really explicit how your data is flowing throughout the app.

## And That's It

Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more than it's written, and it's extremely easy to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
