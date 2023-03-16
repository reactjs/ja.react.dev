---
title: React をウェブサイトに追加する
---

<Intro>

ウェブサイト全体を React を使って構築する必要はありません。インストールなしに 1 分で HTML に React を導入することができ、すぐにインタラクティブなコンポーネントを書き始めることができます。

</Intro>

<YouWillLearn>

* 1 分で HTML ページに React を追加する方法
* JSX 構文とその試し方
* 本番環境用の JSX プリプロセッサの設定方法

</YouWillLearn>

## 1 分で React を導入する {/*add-react-in-one-minute*/}

React は開発当初から、段階的に導入できることを目的として設計されています。ほとんどのウェブサイトは React だけですべてが構築されているわけではありません（し、そうである必要もありません）。このガイドでは、既存の HTML ページに「ちょっとしたインタラクティブ性」をトッピングする方法を説明します。

あなた自身が管理しているウェブサイトまたは[空の HTML ファイル](https://gist.github.com/gaearon/edf814aeee85062bc9b9830aeaf27b88/archive/3b31c3cdcea7dfcfd38a81905a0052dd8e5f71ec.zip)で、以下を試してみてください。必要なのはインターネットに接続していることと、Notepad や VSCode のようなテキストエディタだけです。（シンタックスハイライトを行うためのエディタの[設定方法はこちら](/learn/editor-setup/)！）

### ステップ 1: ルート HTML タグを追加 {/*step-1-add-a-root-html-tag*/}

まず、編集したい HTML ページを開いてください。React で何かを表示させたい場所に、空の `<div>` タグを追加します。その `<div>` に一意の `id` 属性値を設定します。例えば：

```html {3}
<!-- ... existing HTML ... -->

<div id="like-button-root"></div>

<!-- ... existing HTML ... -->
```

これは React ツリーを開始する場所なので、「ルート」と呼ばれます。`<body>` タグ内の任意の場所にこのようなルート HTML タグを配置できます。React が中身をあなたの React コンポーネントに置き換えますので、空にしておいてください。 

ページ内には必要なだけルート HTML タグを配置できます。

### ステップ 2: script タグを追加する {/*step-2-add-the-script-tags*/}

HTML ページの `</body>` クローズタグの直前に、以下の 3 つの `<script>` タグを追加しましょう。

- [`react.development.js`](https://unpkg.com/react@18/umd/react.development.js) は React コンポーネントを定義するために必要なファイルです。
- [`react-dom.development.js`](https://unpkg.com/react-dom@18/umd/react-dom.development.js) は、React によって生成された HTML 要素を [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model) にレンダーするためのファイルです。
- **`like-button.js`** が、次のステップであなたが記述するコンポーネントのためのファイルです！

HTML の最後が以下のようになっていることを確認してください。

```html
    <!-- end of the page -->
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="like-button.js"></script>
  </body>
</html>
```

<Pitfall>

本番サイトへの投入前に必ず `development.js` を `production.min.js` に置き換えてください！ 開発用ビルドの React は、役に立つエラーメッセージを提供しますが、あなたのウェブサイトの速度を*かなり*遅くしてしまいます。

</Pitfall>

### ステップ 3: React コンポーネントの作成 {/*step-3-create-a-react-component*/}

HTML ページと同じ場所に **`like-button.js`** というファイルを作成し、以下のコードスニペットを書いて、ファイルを保存します。このコードは `LikeButton` という React コンポーネントを定義します。（コンポーネントの作成については [クイックスタート](/learn)を参照してください。)

```js
'use strict';

function LikeButton() {
  const [liked, setLiked] = React.useState(false);

  if (liked) {
    return 'You liked this!';
  }

  return React.createElement(
    'button',
    {
      onClick: () => setLiked(true),
    },
    'Like'
  );
}
```

### ステップ 4: React コンポーネントをページに追加 {/*step-4-add-your-react-component-to-the-page*/}

最後に、**`like-button.js`** の最後に以下の 3 行を追加します。このコードは、最初のステップで追加した `<div>` を探しだし、そこに React ルートを作成し、そしてその中に "Like" ボタンの React コンポーネントを表示します。

```js
const rootNode = document.getElementById('like-button-root');
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(LikeButton));
```

**おめでとうございます！ 自分のウェブサイトに最初の React コンポーネントをレンダーしました！**

- [完全なサンプルソースコードを見る](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e)
- [完全なサンプルをダウンロードする (2KB ZIP)](https://gist.github.com/gaearon/0b535239e7f39c524f9c7dc77c44f09e/archive/651935b26a48ac68b2de032d874526f2d0896848.zip)

#### コンポーネントは再利用可能！ {/*you-can-reuse-components*/}

同じ HTML ページの複数の場所に React コンポーネントを表示したい場合があります。React を使いたい部分がページ内で分かれているような場合は、これができると便利です。これを実現するには、HTML に複数のルートタグを作り、`ReactDOM.createRoot()` でそれぞれのタグの内部に React コンポーネントをレンダーします。例えば：

1. **`index.html`** にもうひとつコンテナ要素 `<div id="another-root"></div>` を追加します。
2. **`like-button.js`** に以下の 3 行を追加します。

```js {6,7,8,9}
const anotherRootNode = document.getElementById('another-root');
const anotherRoot = ReactDOM.createRoot(anotherRootNode);
anotherRoot.render(React.createElement(LikeButton));
```

同じコンポーネントを複数の場所にレンダーする必要がある場合は、各ルートに `id` の代わりに CSS クラスを割り当てて、それらをすべて検索することができます。[3 つの "Like" ボタンを表示して、それぞれにデータを渡す例](https://gist.github.com/gaearon/779b12e05ffd5f51ffadd50b7ded5bc8)。

### ステップ 5: 本番環境用に JavaScript を圧縮する {/*step-5-minify-javascript-for-production*/}

非圧縮の JavaScript はユーザのページ読み込みを大幅に遅延させる可能性があります。ウェブサイトを本番環境にデプロイする前には、スクリプトを圧縮 (minify) することをお勧めします。

- **圧縮手段がまだセットアップできていない場合**は、[例えばこの方法を試してみてください](https://gist.github.com/gaearon/ee0201910608f15df3f8cd66aa83f98e)。
- **すでに自分のスクリプトが圧縮済み**の場合、HTML が `production.min.js` で終わるバージョンの React を読み込むようにしてデプロイすれば、サイトは本番環境で使用できるようになります：

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
```

## JSX を使って React を試す {/*try-react-with-jsx*/}

ここまでの例では、ブラウザでネイティブにサポートされている機能だけを利用しています。このため、**`like-button.js`** では、JavaScript 関数の呼び出しを使用して React に何を表示するか指示を伝えています。

```js
return React.createElement('button', {onClick: () => setLiked(true)}, 'Like');
```

ですが React には、代わりに HTML のような JavaScript 構文である [JSX](/ja/docs/jsx-in-depth) を使用するオプションも用意されています。

```jsx
return <button onClick={() => setLiked(true)}>Like</button>;
```

これら 2 つのコードスニペットは同等です。JSX は JavaScript でマークアップを記述するための一般的な方法です。多くの人々が、React だけでなく他のライブラリにおいても、JSX を使って UI コードを記述することを親しみやすく有用なものであると考えています。

> [このオンラインコンバーター](https://babeljs.io/en/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=DwIwrgLhD2B2AEcDCAbAlgYwNYF4DeAFAJTw4B88EAFmgM4B0tAphAMoQCGETBe86WJgBMAXJQBOYJvAC-RGWQBQ8FfAAyaQYuAB6cFDhkgA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2&prettier=false&targets=&version=7.17) を使って、HTML マークアップを JSX に変換することができます。

### JSX を試す {/*try-jsx*/}

JSX を試す最も簡単な方法は、Babel コンパイラをページの `<script>` タグとして追加することです。**`like-button.js`** のタグの前に追加し、**`like-button.js`** の `<script>` タグに `type="text/babel"` 属性を追加します。

```html {3,4}
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="like-button.js" type="text/babel"></script>
</body>
```

この状態で、**`like-button.js`** ファイルを開き、

```js
return React.createElement(
  'button',
  {
    onClick: () => setLiked(true),
  },
  'Like'
);
```

を以下の JSX コードに置き換えます。

```jsx
return (
  <button onClick={() => setLiked(true)}>
    Like
  </button>
);
```

最初は JS とマークアップを混在させることを少し変に感じるかもしれませんが、徐々に慣れていくはずです。概要については [JSX でのマークアップの書き方](/learn/writing-markup-with-jsx)をご覧ください。[JSX を使用した HTML ファイルの例](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)をダウンロードして試してみてもよいでしょう。

<Pitfall>

Babel `<script>` コンパイラは学習時や単純なデモ作成用には問題ありませんが、**ウェブサイトを遅くしてしまうため本番環境には適していません。** 次のセクションに進む準備ができたら、この手順で追加した Babel の `<script>` タグを削除し、`type="text/babel"` 属性も削除してください。これらの代わりに、次のセクションでは JSX プリプロセッサをセットアップし、すべての `<script>` タグが JSX から JS に変換されるようにします。

</Pitfall>

### プロジェクトに JSX を追加する {/*add-jsx-to-a-project*/}

プロジェクトに JSX を追加するのに、[バンドラ](/learn/start-a-new-react-project#custom-toolchains)や開発サーバのような複雑なツールは必要ありません。JSX プリプロセッサを追加するのは、CSS プリプロセッサを追加することと大して変わりません。

ターミナルでプロジェクトフォルダに移動し、以下の 2 つのコマンドを貼り付けます（**[Node.js](https://nodejs.org/) がインストールされていることを確認してください**）。

1. `npm init -y`（うまくいかない場合[こちらの手順](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d)を参照してください）
2. `npm install @babel/cli@7 babel-preset-react-app@10`

JSX プリプロセッサをインストールするのに必要なのは npm だけです。React とアプリケーションコードの両方は、`<script>` タグのまま変更する必要はありません。

おめでとうございます！ プロジェクトに **本番向けの JSX セットアップ** が追加されました。

### JSX プリプロセッサの実行 {/*run-the-jsx-preprocessor*/}

JSX を含むファイルを保存するたびに変換が再実行され、JSX ファイルをブラウザが理解できる通常の JavaScript ファイルに変換するように、JSX をプリプロセスすることができます。以下がその設定方法です。

1. `src` というフォルダを作成する。
2. ターミナルで次のコマンドを実行する：`npx babel --watch src --out-dir . --presets babel-preset-react-app/prod `（完了するのを待たずに進めましょう！ このコマンドは `src` 内の JSX の編集の自動監視を開始します。）
3. JSX 化した **`like-button.js`**（[このようなもの！](https://gist.githubusercontent.com/gaearon/be5ae0fbf563d6c5fe5c1563907b13d2/raw/4c0d0b8c7f4fcb341720424c28c72059f8174c62/like-button.js)）を、新しい `src` フォルダに移動する。

これでファイルが監視され、ブラウザが理解できる通常の JavaScript コードの含まれた `like-button.js` が生成されるようになります。

<Pitfall>

もし "You have mistakenly installed the `babel` package" というエラーが出た場合は、[ひとつ前のステップ](#add-jsx-to-a-project) を見逃しているのかもしれません。同じフォルダでこれを実行してからやり直してください。

</Pitfall>

今使ったツールは Babel と呼ばれるものであり、こちらの[ドキュメント](https://babeljs.io/docs/en/babel-cli/)で詳しく学ぶことができます。JSX に加えて、最新の JavaScript 構文を、古いブラウザで動かないという心配なしに使用できるようにもしてくれます。

ビルドツールに慣れてきて、より進んだ使い方をしてみたくなった場合は、[最も人気かつ使い勝手の良いツールチェーンについて、こちらでいくつか説明しています](/learn/start-a-new-react-project)。

<DeepDive>

#### JSX なしで React を使う {/*react-without-jsx*/}

元々 JSX は、React でコンポーネントを書くことが HTML を書くのと同じくらい馴染みのある感覚になるように、ということで導入されました。そしてその後、この文法は広く普及しました。それでも、JSX を使いたくない場合や使えない場合というのもあるかもしれません。そのような場合、2 つのオプションがあります。

- コンパイラの代わりに JavaScript の[テンプレート文字列](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)を利用する [htm](https://github.com/developit/htm) のような JSX 代替ライブラリを使用する。
- 以下で説明するような特別な仕組みを持った [`React.createElement()`](/reference/react/createElement) を使用する。

JSX を使用する場合、コンポーネントは次のように記述します。

```jsx
function Hello(props) {
  return <div>Hello {props.toWhat}</div>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />, );
```

`React.createElement()` を使う場合、同じものを次のように記述します。

```js
function Hello(props) {
  return React.createElement('div', null, 'Hello ', props.toWhat);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  React.createElement(Hello, { toWhat: 'World' }, null)
);
```

この関数は複数の引数を受け取ります：`React.createElement(component, props, ...children)`.

これは以下のように動作します。

1. **component** は HTML 要素を表す文字列、または関数コンポーネント。
2. [**props**](/learn/passing-props-to-a-component) はコンポーネントに渡したい任意のオブジェクト。
3. 残りの引数は **children** であり、テキスト文字列やその他の要素など、コンポーネントの子要素がある場合にそれを指定する。

`React.createElement()` を書くのが面倒になった場合、よくあるパターンはショートハンドを設定することです。

```js
const e = React.createElement;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(e('div', null, 'Hello World'));
```

JSX を使わないスタイルが好きな場合、これは JSX 自体と同程度には有用かもしれません。

</DeepDive>
