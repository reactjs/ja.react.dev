---
id: add-react-to-a-website
title: ウェブサイトに React を導入する
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

まずは必要なぶんだけ使ってみましょう。

React は段階的に導入することができるように最初からデザインされています。つまり**最小限の部分で React を利用することも、あるいは大規模に React を利用することも可能です**。既存のページにちょっとしたインタラクティブ性をもたせたいだけでも構いません。React コンポーネントを使えばお手の物です。

多くのウェブサイトは SPA ではありませんし、そうする必要もありません。まずは**たった数行のコード**から、あなたのウェブサイトに React を取り入れてみましょう。**ビルドツールは必要ありません**。そこから徐々に React の使用範囲を広げていくのもいいですし、あるいは少しの動的なウィジェットだけにとどめておくのもいいでしょう。

---

- [1分で React を導入する](#1分で-react-を導入する)
- [補足：React で JSX を使う](#補足：react-で-jsx-を使う) (バンドルツールは不要です！)

## 1分で React を導入する

このセクションでは、既存の HTML ページに React コンポーネントを導入する方法を説明します。以下の部分では自分のウェブサイトを利用して進めてもいいですし、練習用に空っぽの HTML ファイルを用意するのもいいでしょう。

複雑なツール類や事前にインストールしておかなければいけないものはありません。**インターネットへの接続さえあれば、1分間でこのセクションを終わらせることができます。**

補足：[お手本をダウンロードする (2KB ZIP圧縮)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### ステップ1：HTML に DOM コンテナを追加する

まずは編集したい HTML ファイルを開きましょう。React で描画したい箇所を決めて、空っぽの `<div>` 要素を追加しましょう。例えばこんな感じです。

```html{3}
<!-- ... 既存の HTML ... -->

<div id="like_button_container"></div>

<!-- ... 既存の HTML ... -->
```

ここでは `<div>` 要素にユニークな `id` 属性を指定しています。こうしておけば、後から JavaScript のコードでこの `<div>` 要素を探し出し、この中に React コンポーネントを表示できます。

>ひとこと
>
>「コンテナ」としての `<div>` 要素は `<body>` タグの中であれば**どこにでも**置くことができます。また空っぽの `<div>` はひとつのページにひとつだけでも、あるいは必要なだけたくさんあっても大丈夫です。`<div>` 要素は空っぽのことが多いですが、それはたとえ `<div>` の中に他の要素があったとしても、React が結局その中身を置き換えてしまうからです。

### ステップ2：script タグを追加する

次に、同じ HTML ファイルの `</body>` タグの直前に、3つの `<script>` タグを追加しましょう。

```html{5,6,9}
  <!-- ... other HTML ... -->

  <!-- Load React. -->
  <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

  <!-- Load our React component. -->
  <script src="like_button.js"></script>

</body>
```

最初のふたつのタグは React を読み込んでおり、最後のタグはこれから書くコンポーネントのコードを読み込んでいます。

### ステップ3：React コンポーネントを作成する

`like_button.js` という名前の新しいファイルを作成し、HTML ファイルのすぐ隣に置きましょう。

**[サンプルコード](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** を開いて、自分のファイルにコピーアンドペーストしてください。

>ひとこと
>
>このコードは `LikeButton` という React コンポーネントを定義しています。まだわからなくても心配しなくて大丈夫です。こういった React の構成要素については、[チュートリアル](/tutorial/tutorial.html) と [Hello World](/docs/hello-world.html) のページで後ほどみていくことにして、まずはサンプルコードを画面に表示させてみましょう！

**[サンプルコード](https://cdn.rawgit.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**の末尾に次の2行を追加してみましょう。

```js{3,4}
// ... コピーアンドペーストしたサンプルコード ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

この2行のコードは、ステップ1で追加した空っぽの `<div>` 要素を見つけてきて、その中に React コンポーネントの「いいね」ボタンを表示します。

### これだけです！

ステップ4はありません。**これであなたは自分のウェブサイトにはじめての React コンポーネントを導入できました**。

React の導入についてもっと知るには、次のセクションも見てみてください。

**[完成したソースコードをみる](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[完成したソースコードをダウンロードする (2KB ZIP圧縮)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### ひとこと：コンポーネントを再利用する

React コンポーネントを HTML ページの一箇所だけではなくいろいろな箇所で使いたくなることがあるかもしれません。そこで「いいね」ボタンを3回繰り返し表示し、さらにそこにちょっとしたデータを渡すプログラムを用意しました。

[ソースコードをみる](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[ソースコードをダウンロードする (2KB ZIP圧縮)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>注意
>
>このようなやり方は、主に React を利用する DOM コンテナがページ内でお互いに干渉していない場合において便利な手段です。 React 単体のコードとしては、[コンポーネントを組み合わせる](/docs/components-and-props.html#コンポーネントを組み合わせる) やり方のほうが手軽です。

### ひとこと：本番環境用に JavaScript を圧縮する

ウェブサイトを本番環境にデプロイするにあたって、圧縮していない JavaScript はページの速度を著しく落としてしまうということに配慮してください。

自分のスクリプトの圧縮が完了していて、デプロイ後の HTML が `production.min.js` で終わる React スクリプトを読み込んでいることが検証できていれば、**あなたのウェブサイトは本番環境にリリースする準備ができています**。

```js
<script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
```

自分のスクリプトを圧縮することがまだできていないのであれば、[例えばこんなやり方があります](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3)。

## 補足：React で JSX を使う

今までのお手本は、ブラウザにもともと備わっている機能に沿ってきました。React コンポーネントを表示するために次のような JavaScript の関数を呼び出していたのはそのためです。

```js
const e = React.createElement;

// Display a "Like" <button>
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

ただし、React においては [JSX](/docs/introducing-jsx.html) を利用することもできます。

```js
// Display a "Like" <button>
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

これらふたつのスニペットはまったく同じ内容です。**JSX の使用は[いっさい強制されません](/docs/react-without-jsx.html)**が、React はもちろん他のライブラリで UI を記述する際にも、JSX は多くの人に支持されています。

[このコンバーター](http://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=)上で JSX を使って遊んでみてください。

### JSX を手軽に試してみる

手っ取り早く JSX を自分のプロジェクトで試してみるには、次の `<script>` タグを追加してみてください。

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

この状態で、任意の `<script>` タグに `type="text/babel"` を持たせることで、その `<script>` タグの中では JSX が使えるようになります。[サンプル用 HTML ファイル](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html)をダウンロードして遊んでみてください。

こういったやり方で学習したりシンプルなデモを作成してみることはいいことですが、これをそのまま使うとウェブサイトは重くなってしまい、**本番環境には向きません**。次のレベルに進む準備ができたら、先ほど追加した `<script>` タグと `type="text/babel"` は削除してしまいましょう。そして次のセクションに進み、JSX プリプロセッサを設定して `<script>` タグを自動変換する方法を学びましょう。

### JSX をプロジェクトに追加する

JSX をプロジェクトに追加するためには、バンドルツールや開発用サーバーといった複雑なツールは必要ありません。つまるところ、JSX を追加するとは **CSS プリプロセッサを追加することにとてもよく似ています**。唯一必要となるのは、コンピューターに [Node.js](https://nodejs.org/) がインストールされていることだけです。

ターミナルを開き、プロジェクトのディレクトリに移動した上で、次のふたつのコマンドを実行してください。

1. **ステップ1：** `npm init -y` (うまくいかなければ[こうやってみてください](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **ステップ2：** `npm install babel-cli@6 babel-preset-react-app@3`

>ひとこと
>
>ここでは**JSX プリプロセッサをインストールするためだけに npm を使っています**。それ以外の用途では必要ありません。React のソースコードもアプリケーションコードも引き続き `<script>` タグの中に書くことができますし、今までのやり方となんら変わりありません。

お疲れ様です！これで**本番環境用の JSX の設定**をプロジェクトに追加することができました。


### JSX プリプロセッサを実行する

`src` というディレクトリを作成したうえで、次のコマンドをターミナルから実行してみてください。

```
npx babel --watch src --out-dir . --presets react-app/prod 
```

>ひとこと
>
>`npx` はタイプミスではありません。[npm 5.2 以上で利用可能なパッケージ実行ツール](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)です。
>
>万が一 "You have mistakenly installed the `babel` package" というエラーが表示されたのであれば、[JSX をプロジェクトに追加する](#jsx-をプロジェクトに追加する)のステップがうまく実行できていなかったのかもしれません。今いるディレクトリと同じディレクトリで改めて実行してみてください。

このコマンドは JSX を継続的に監視するため、実行が完了するのを待つ必要はありません。

**[このお手本の JSX コード](https://cdn.rawgit.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)**を参考に `src/like_button.js` というファイルを作成すると、先ほど起動したコマンドがブラウザの仕様にあった `like_button.js` に変換してくれます。JSX ファイルをさらに編集したとしても、何度でも自動的に変換してくれます。

さらにこの変換コマンドのおかげで、古いブラウザの互換性を気にすることなく、クラス構文などといったモダンな JavaScript の機能を使うこともできるようになります。このツールは Babel というもので、もっと詳しく知りたければ[公式ドキュメント](http://babeljs.io/docs/en/babel-cli/)をご覧になってみてください。

ビルドツールの便利さを体感して、もっとたくさんのことをツールに任せて快適な環境を手に入れたいと思っていただけたなら、[次のセクション](/docs/create-a-new-react-app.html)ではさらにいくつかの人気で扱いやすいツールチェーンを紹介しています。あまり興味が持てないようでしたら、それでも大丈夫です。`<script>` タグだけでも十分な機能を果たせますから。
