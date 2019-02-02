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

## Step 1: UIをコンポーネントの階層構造に落とし込む

まず最初に行うのは、モックを形作っている各コンポーネント（構成要素）を四角で囲んで、それぞれに名前をつけていくことです。もしあなたがデザイナーと一緒に仕事をしている場合は、彼らがすでにこれに相当する作業を終えている可能性がありますので、話をしに行きましょう。彼らが Photoshop でレイヤ名にしていた名前が、最終的にはあなたの React コンポーネントの名前になりうるのです！

しかし、どうやってコンポーネントとして括るべき範囲を見つけられるのでしょうか。ちょうど、関数やオブジェクトをどのような責任範囲で作るのかを決めるときと、同じ手法が使えます。このような手法のひとつに、[単一責任の原則](https://en.wikipedia.org/wiki/Single_responsibility_principle)があり、これに沿って考えると、ひとつのコンポーネントはひとつのことだけができるべきである、という指針が得られます。将来、コンポーネントが肥大化してしまった場合には、小さなコンポーネントに分割するべきである、という話でもあります。

皆さんがこれまで JSON で作ったデータモデルをユーザーに向けて表示してきた経験から、モデルを正しく構築できていれば、UI（つまりコンポーネントの構造）へのデータマッピングも上手くいくであろうことは想像に難くないでしょう。これは、UIとデータモデルが同じ **情報の構造** を持つ傾向があるためです。このおかげで、UIをコンポーネントに切り分ける作業は自明なものになりがちです。データモデルの1要素を表現するコンポーネントに、モックを分割して落とし込んでみましょう。

![コンポーネント図](../images/blog/thinking-in-react-components.png)

5種類のコンポーネントがこのシンプルなアプリの中にあることが見て取れます。それぞれの解説の中で、データを表すものについては斜体にしました。
<!-- nkzn注: 日本語フォントは斜体を表現できないことが多いので、別の表現でマークアップしたほうがいいかもしれない -->

  1. **`FilterableProductTable`（オレンジ色）：** このサンプル全体を含む
  2. **`SearchBar`（青色）：** すべての *ユーザー入力* を受け付ける
  3. **`ProductTable`（緑色）：** *ユーザー入力* に基づく *データの集合* を表示・フィルターする
  4. **`ProductCategoryRow`（水色）：** *カテゴリ* を見出しとして表示する
  5. **`ProductRow`（赤色）：** 各 *商品* を1行で表示する

`ProductTable` を見てみると、表のヘッダー（「Name」や「Price」のラベルを含む）が自身のコンポーネントを持っていないことがわかります。これは好みの問題で、コンポーネントにするかしないかは両論あります。今回の例でいえば、ヘッダーを `ProductTable` の一部にしたのは、 *データの集合* を描画するという `ProductTable` の責務の一環として適切だったからです。しかしながら、将来ヘッダーが肥大化して複雑になった場合（例えばソート機能を追加した場合など）は、 `ProductTableHeader` のようなコンポーネントにするのが適切になるでしょう。

さて、モック内にコンポーネントを定義できましたので、階層構造に並べてみましょう。簡単なことです。モックで他のコンポーネントの中にあるコンポーネントを、階層構造でも子要素として配置すればいいのです。次のようになります。

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Step 2: Build A Static Version in React

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a> on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Now that you have your component hierarchy, it's time to implement your app. The easiest way is to build a version that takes your data model and renders the UI but has no interactivity. It's best to decouple these processes because building a static version requires a lot of typing and no thinking, and adding interactivity requires a lot of thinking and not a lot of typing. We'll see why.

To build a static version of your app that renders your data model, you'll want to build components that reuse other components and pass data using *props*. *props* are a way of passing data from parent to child. If you're familiar with the concept of *state*, **don't use state at all** to build this static version. State is reserved only for interactivity, that is, data that changes over time. Since this is a static version of the app, you don't need it.

You can build top-down or bottom-up. That is, you can either start with building the components higher up in the hierarchy (i.e. starting with `FilterableProductTable`) or with the ones lower in it (`ProductRow`). In simpler examples, it's usually easier to go top-down, and on larger projects, it's easier to go bottom-up and write tests as you build.

At the end of this step, you'll have a library of reusable components that render your data model. The components will only have `render()` methods since this is a static version of your app. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. If you make a change to your underlying data model and call `ReactDOM.render()` again, the UI will be updated. It's easy to see how your UI is updated and where to make changes since there's nothing complicated going on. React's **one-way data flow** (also called *one-way binding*) keeps everything modular and fast.

Simply refer to the [React docs](/docs/) if you need help executing this step.

### A Brief Interlude: Props vs State

There are two types of "model" data in React: props and state. It's important to understand the distinction between the two; skim [the official React docs](/docs/interactivity-and-dynamic-uis.html) if you aren't sure what the difference is.

## Step 3: Identify The Minimal (but complete) Representation Of UI State

To make your UI interactive, you need to be able to trigger changes to your underlying data model. React makes this easy with **state**.

To build your app correctly, you first need to think of the minimal set of mutable state that your app needs. The key here is [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Figure out the absolute minimal representation of the state your application needs and compute everything else you need on-demand. For example, if you're building a TODO list, just keep an array of the TODO items around; don't keep a separate state variable for the count. Instead, when you want to render the TODO count, simply take the length of the TODO items array.

Think of all of the pieces of data in our example application. We have:

  * The original list of products
  * The search text the user has entered
  * The value of the checkbox
  * The filtered list of products

Let's go through each one and figure out which one is state. Simply ask three questions about each piece of data:

  1. Is it passed in from a parent via props? If so, it probably isn't state.
  2. Does it remain unchanged over time? If so, it probably isn't state.
  3. Can you compute it based on any other state or props in your component? If so, it isn't state.

The original list of products is passed in as props, so that's not state. The search text and the checkbox seem to be state since they change over time and can't be computed from anything. And finally, the filtered list of products isn't state because it can be computed by combining the original list of products with the search text and value of the checkbox.

So finally, our state is:

  * The search text the user has entered
  * The value of the checkbox

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
