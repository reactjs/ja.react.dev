---
title: 初めてのコンポーネント
---

<Intro>

*コンポーネント*は、React における最重要コンセプトのひとつです。皆さんがユーザインターフェース (UI) を構築するときの基盤となるものですので、React の旅路はコンポーネントから始めていくことにしましょう！

</Intro>

<YouWillLearn>

* コンポーネントとは何か
* React アプリでコンポーネントが果たす役割
* 初めてのコンポーネントの書き方

</YouWillLearn>

## コンポーネント：UI の構成要素 {/*components-ui-building-blocks*/}

Web の世界では、HTML で `<h1>` や `<li>` といった組み込みタグを使い、リッチで構造化されたドキュメントを作成することができます：

```html
<article>
  <h1>My First Component</h1>
  <ol>
    <li>Components: UI Building Blocks</li>
    <li>Defining a Component</li>
    <li>Using a Component</li>
  </ol>
</article>
```

このマークアップは、記事自身 (`<article>`)、見出し (`<h1>`)、そして番号付きリスト (`<ol>`) による目次（一部省略しています）を表現しています。我々がウェブで目にするサイドバー、アバター、モーダル、ドロップダウンといったあらゆる UI パーツの裏側では、このようなマークアップが、スタイルのための CSS やユーザ対話のための JavaScript と組み合わさりながら働いています。

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
React では、あなたのマークアップと CSS と JavaScript を、カスタムの「コンポーネント」と呼ばれる、**アプリのための再利用可能な UI 要素**にまとめることができます。上記にある目次のためのコードを、`<TableOfContents />` と呼ばれるコンポーネントにすることができるのです。その裏では、やはり `<articles>` や `<h1>` といった同じ HTML タグを使っています。
=======
React lets you combine your markup, CSS, and JavaScript into custom "components", **reusable UI elements for your app.** The table of contents code you saw above could be turned into a `<TableOfContents />` component you could render on every page. Under the hood, it still uses the same HTML tags like `<article>`, `<h1>`, etc.
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

HTML タグを使う時と同様にして、コンポーネントを組み合わせたり、並び替えたり、ネストしたりして、ページ全体をデザインすることができます。例えばあなたが今読んでいるこのページは、以下のような React コンポーネントから作られています：

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
プロジェクトが成長するとともに、設計・デザインのいろいろな部分を、既に書いたコンポーネントを再利用することで構築できるようになり、開発速度がアップすることに気付くでしょう。上記のような目次を、`<TableOfContents />` を書くことでどのページにでも加えることができるのです！ [Chakra UI](https://chakra-ui.com/) や [Material UI](https://material-ui.com/) のような、React オープンソースコミュニティーで共有されている何千ものコンポーネントを使い、プロジェクトを一気にスタートさせることも可能です。
=======
As your project grows, you will notice that many of your designs can be composed by reusing components you already wrote, speeding up your development. Our table of contents above could be added to any screen with `<TableOfContents />`! You can even jumpstart your project with the thousands of components shared by the React open source community like [Chakra UI](https://chakra-ui.com/) and [Material UI.](https://material-ui.com/)
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

## コンポーネントの定義 {/*defining-a-component*/}

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
伝統的なウェブページの作成のやり方は、ウェブ開発者が先にコンテンツをマークアップしてから、ユーザとのインタラクションを加えるために JavaScript をちょっと添える、というものでした。これはウェブにとってインタラクションが「あると嬉しい」レベルのものだった時代にはうまく機能していました。しかし今や、インタラクションはほぼすべてのサイトとあらゆるアプリで必要とされるものです。React は同じテクノロジを使っていますが、インタラクティビティ・ファーストになっています。すなわち **React コンポーネントとは、マークアップを添えることができる JavaScript 関数**です。コンポーネントは以下のような見た目をしています（以下のコードは編集できます）：
=======
Traditionally when creating web pages, web developers marked up their content and then added interaction by sprinkling on some JavaScript. This worked great when interaction was a nice-to-have on the web. Now it is expected for many sites and all apps. React puts interactivity first while still using the same technology: **a React component is a JavaScript function that you can _sprinkle with markup_.** Here's what that looks like (you can edit the example below):
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

コンポーネントは以下のようにして作成します：

### Step 1: コンポーネントをエクスポートする {/*step-1-export-the-component*/}

頭にある `export default` は[標準的な JavaScript の構文](https://developer.mozilla.org/docs/web/javascript/reference/statements/export)です（React 特有のものではありません）。これでファイル内のメインの関数をマークし、後で他のファイルからそれをインポートできるようにします。（[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)に詳細があります！）

### Step 2: 関数を定義する {/*step-2-define-the-function*/}

`function Profile() { }` のように書くことで、`Profile` という名前の JavaScript 関数を定義します。

<Gotcha>

React コンポーネントは普通の JavaScript 関数ですが、**名前は大文字から始める必要があります**。さもないと動作しません！

</Gotcha>

### Step 3: マークアップを加える {/*step-3-add-markup*/}

このコンポーネントは `src` と `alt` という属性を有する `<img />` タグを返しています。`<img />` は まるで HTML のように書かれていますが、裏では実際には JavaScript です！ この構文は [JSX](/learn/writing-markup-with-jsx) と呼ばれるもので、これによりマークアップを JavaScript 内に埋め込めるようになります。

return 文は、以下のように 1 行にまとめて書いても構いません：

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

しかし return キーワードと同じ行にマークアップ全体が収まらない場合は、括弧で囲んで以下のようにする必要があります：

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Gotcha>

括弧がないと、`return` の後にあるコードはすべて[無視されてしまいます](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)！

</Gotcha>

## コンポーネントを使う {/*using-a-component*/}

`Profile` コンポーネントが定義できたので、それをほかのコンポーネント内にネストさせることができます。例えば `Profile` コンポーネントを複数回使う `Gallery` というコンポーネントをエクスポートできます：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### ブラウザに見えるもの {/*what-the-browser-sees*/}

大文字・小文字の違いに気をつけてください：

* `<section>` は小文字なので、React はこれが HTML タグを指しているのだと理解します。
* `<Profile />` は大文字の `P` で始まっているので、React は `Profile` という名前の独自コンポーネントを使いたいのだと理解します。

`Profile` の中には `<img />` という HTML が更に含まれてます。最終的に、ブラウザに見えるのは以下ののようなものです。

```html
<section>
  <h1>Amazing scientists</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### コンポーネントのネストと整理方法 {/*nesting-and-organizing-components*/}

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
コンポーネントは普通の JavaScript 関数ですので、同じファイルに複数のコンポーネントを書いておくこともできます。これはコンポーネントが比較的小さい場合や互いに密接に関連している場合には便利です。ファイルの中身が増えてきたら、いつでも `Profile` を別のファイルに移動できます。このやり方についてはすぐ後で、[インポートについてのページ](/learn/importing-and-exporting-components)で学びます。
=======
Components are regular JavaScript functions, so you can keep multiple components in the same file. This is convenient when components are relatively small or tightly related to each other. If this file gets crowded, you can always move `Profile` to a separate file. You will learn how to do this shortly on the [page about imports.](/learn/importing-and-exporting-components)
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

`Profile` コンポーネントは `Gallery` コンポーネントの中でレンダーされています（しかも何回も）ので、`Gallery` は**親コンポーネント**であり、`Profile` を「子」としてレンダーしている、と言うことができます。これが React の魔法です。一度コンポーネントを定義したら、それを好きなだけ、どこでも何回でも使えるということです。

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
<DeepDive title="端から端までコンポーネント">
=======
<DeepDive title="Components all the way down">
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

React アプリケーションは「ルート」コンポーネントから始まります。通常、これは新しいプロジェクトを開始したときに自動的に作成されます。例えば [CodeSandbox](https://codesandbox.io/) や [Create React App](https://create-react-app.dev/) を使う場合、ルートコンポーネントは `src/App.js` 内に定義されています。[Next.js](https://nextjs.org/) フレームワークを使っている場合はルートコンポーネントは `pages/index.js` に定義されています。ここまでの例でも、ルートコンポーネントをエクスポートしていたわけです。

ほとんどの React アプリでは端から端までコンポーネントを使います。つまり、ボタンのような再利用可能なところでのみ使うのではなく、サイドバーやリスト、最終的にはページ本体といった大きなパーツのためにも使うのです。コンポーネントは、1 回しか使わないような UI コードやマークアップであっても、それらを整理するための有用な手段です。

Next.js のようなフレームワークではこれを更に 1 歩押し進めます。空の HTML ファイルから始めて JavaScript で React にページ内容の管理を引き継がせるのではなく、あなたの書いた React コンポーネントから HTML ファイル自体も自動生成するのです。これにより、JavaScript コードがロードされる前にコンテンツの一部をアプリが表示できるようになります。

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
その一方で、多くのウェブサイトでは React を ["対話機能をちょっと添える"](/learn/add-react-to-a-website) ためにのみ使っています。そのようなサイトはページ全体のためのルートコンポーネントを 1 つだけ持つのではなく、たくさんのルートコンポーネントを持っています。必要しだいで、React を使う量は多くても少なくても構わないのです！
=======
Still, many websites only use React to [add "sprinkles of interactivity".](/learn/add-react-to-a-website) They have many root components instead of a single one for the entire page. You can use as much—or as little—React as you need.
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

</DeepDive>

<Recap>

これで初めての React の体験は完了です。キーポイントをいくつかおさらいしておきましょう。

* React により**アプリのための再利用可能な部品**であるコンポーネントを作成できる。
* React アプリでは UI のあらゆる部品はコンポーネントである。
* React のコンポーネントとは普通の JavaScript 関数だが、以下の点が異なる：

  1. 名前は常に大文字で始まる。
  2. JSX マークアップを return する。

</Recap>



<Challenges>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
### コンポーネントのエクスポート {/*export-the-component*/}
=======
#### Export the component {/*export-the-component*/}
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

このサンドボックスはルートコンポーネントがエクスポートされていないため動作しません：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

答えを見る前に自分で修正してみましょう！

<Solution>

以下のように関数の前に `export default` を付けてください：

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
これを修正するのに `export` とだけ書いたのではなぜ不十分なのか気になるかもしれません。`export` と `export default` の違いについては[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)で学ぶことができます。

</Solution>

### return 文を直す {/*fix-the-return-statement*/}
=======
You might be wondering why writing `export` alone is not enough to fix this example. You can learn the difference between `export` and `export default` in [Importing and Exporting Components.](/learn/importing-and-exporting-components)

</Solution>

#### Fix the return statement {/*fix-the-return-statement*/}
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

この `return` 文はどうもおかしいようです。直せますか？

<Hint>

もしかしたら修正途中で "Unexpected token" というエラーが出るかもしれません。その場合はセミコロンが閉じ括弧の*後*にあることを確認してください。`return ( )` の中にセミコロンが残っているとエラーになります。

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

このコンポーネントを修正するには、以下のように return 文を 1 行にします：

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

または、return する JSX マークアップを `return` の直後から括弧で囲んでも構いません：

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
### どこが間違い？ {/*spot-the-mistake*/}
=======
#### Spot the mistake {/*spot-the-mistake*/}
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

この `Profile` の宣言のしかたや使われ方は何か間違っています。間違いがどこか分かりますか？（React がどのようにしてコンポーネントと普通の HTML タグを区別するのか思い出してみましょう！）

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

React コンポーネントの名前は大文字で始めなければなりません。

`function profile()` を `function Profile()` に、そして `<profile />` をすべて `<Profile />` に書きかえましょう：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

<<<<<<< HEAD:beta/src/pages/learn/your-first-component.md
### 自分で書いてみる {/*your-own-component*/}
=======
#### Your own component {/*your-own-component*/}
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd:beta/src/content/learn/your-first-component.md

ゼロからコンポーネントを書いてください。有効な名前ならどんな名前でも構いませんし、どんなマークアップを返しても構いません。何も思いつかないなら `<h1>Good job!</h1>` と表示する `Congratulations` というコンポーネントを書いてみましょう。エクスポートするのを忘れずに！

<Sandpack>

```js
// Write your component below!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Good job!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>