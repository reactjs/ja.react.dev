---
title: 既存プロジェクトに React を追加する
---

<Intro>

既存のプロジェクトにインタラクティブな要素を加えたい場合、プロジェクトを React で書き直す必要はありません。React を既存のスタックに追加することで、どこにでもインタラクティブな React コンポーネントをレンダーできます。

</Intro>

<Note>

**ローカル環境で開発するには [Node.js](https://nodejs.org/ja/) をインストールする必要があります。** React を[オンライン](/learn/installation#try-react)や単純な HTML ページで試すことも可能ですが、現実的には開発時に利用する大抵の JavaScript ツールには Node.js が必要です。

</Note>

## 既存のウェブサイトの一部に React を使う {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

例えば Rails などの他のサーバテクノロジで構築されている `example.com` というウェブアプリがあり、`example.com/some-app/` から始まる全ルートを React で完全に実装したいとします。

以下の手順に従って設定することをお勧めします。

1. [React ベースのフレームワーク](/learn/start-a-new-react-project)の一つを使って **React の部分をビルド** します。
2. フレームワークの設定で `/some-app` を ***base path*に指定** します（方法：[Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath)、[Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)）。
3. **サーバーまたはプロキシを設定**して、`/some-app/` 以下のすべてのリクエストを React アプリで処理するようにします。

こうすることで、アプリの React 部分がこれらのフレームワークに組み込まれた[ベストプラクティスを最大限に取り入れる](/learn/start-a-new-react-project#can-i-use-react-without-a-framework)ことができます。

多くの React ベースのフレームワークはフルスタックであり、React アプリがサーバ機能を活用できるようになっています。ただし、サーバで JavaScript を実行できない場合や実行したくない場合でも、同じアプローチが使用できます。この場合、エクスポートされた HTML/CSS/JS（Next.js の場合は [`next export` 出力](https://nextjs.org/docs/advanced-features/static-html-export)、Gatsby の場合はデフォルト）を `/some-app` としてサーブします。

## 既存ページの一部に React を使う {/*using-react-for-a-part-of-your-existing-page*/}

他のテクノロジ（Rails のようなサーバ側のものでも Backbone のようなクライアント側のものでも）で構築された既存のページがあり、そのページのどこかにインタラクティブな React コンポーネントをレンダーしたいとします。これは React を結合する一般的な方法です。実際、Meta では何年もの間、ほとんどの React 使用法がこうでした！

これを行うには、2 つのステップが必要です。

1. **JavaScript 環境を設定**して、[JSX 構文](/learn/writing-markup-with-jsx)の使用、[`import`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export) 構文を使ったコードのモジュール分割、[npm](https://www.npmjs.com/) パッケージレジストリからのパッケージ（React など）の使用ができるようにする。
2. ページ上の表示させたい場所に **React コンポーネントをレンダー**する。

具体的なアプローチはあなたの既存ページのセットアップによって異なりますが、一部の詳細について見ていきましょう。

### ステップ1: モジュラーな JavaScript 環境を設定する {/*step-1-set-up-a-modular-javascript-environment*/}

モジュラーな JavaScript 環境を使用すると、すべてのコードを単一のファイルに書くのではなく、React コンポーネントを別々のファイルに記述できるようになります。また、他の開発者によって [npm](https://www.npmjs.com/) パッケージレジストリに公開されている、素晴らしいパッケージ群（React 自身も含む）を使えるようにもなります。具体的なやり方はあなたの既存のセットアップ方法によって異なります：

* **アプリが既に `import` 文を使ってファイル分割するよう設定されている場合**、その既存の設定を使用するようにしてみてください。JS コードで `<div />` と記述すると、構文エラーが発生するかどうかを確認してください。構文エラーが発生する場合は、[Babel を使用して JavaScript を変換](https://babeljs.io/setup)するようにし、JSX を使うために [Babel React プリセット](https://babeljs.io/docs/babel-preset-react) を有効にしてください。

* **JavaScript モジュールをコンパイルする既存のセットアップがない場合**は、[Vite](https://vitejs.dev/) を使ってセットアップします。Vite コミュニティは、Rails、Django、Laravel をはじめ、[多くのバックエンドフレームワークとのインテグレーション](https://github.com/vitejs/awesome-vite#integrations-with-backends)をメンテナンスしています。あなたのバックエンドフレームワークがリストされていない場合は、[このガイドに従って](https://vitejs.dev/guide/backend-integration.html)手動で Vite ビルドをバックエンドと統合してください。

セットアップがうまくいっているかどうかを確認するには、プロジェクトフォルダーで次のコマンドを実行します。

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

そして、あなたのメインの JavaScript ファイル（おそらく `index.js` や `main.js` といった名前のもの）の先頭に、以下のコードを追加します。:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

ページ全体が「Hello, world!」に置き換わった場合は、すべてがうまくいったことになります。このまま読み進めてください。

<Note>

既存のプロジェクトにモジュラーな JavaScript 環境を組み込むことを最初は不安に感じるかもしれませんが、その価値はあると思います！ 行き詰まったら、[コミュニティのリソース](/community)または [Vite Chat](https://chat.vitejs.dev/) を試してみてください。

</Note>

### ステップ2: ページに React コンポーネントをレンダーする {/*step-2-render-react-components-anywhere-on-the-page*/}

前のステップでは、以下のコードをメインファイルのトップに置きました：

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

もちろん、実際には既存の HTML コンテンツを削除したい訳ではありません！

なので上記のコードは削除してください。

代わりに、あなたの HTML 内の特定の場所に React コンポーネントをレンダーしたいはずです。HTML ページ（またはそれを生成するサーバーテンプレート）を開き、次のようにして、任意のタグにユニークな [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) 属性を追加します：

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

これにより、[`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) で HTML 要素を検索して [`createRoot`](/reference/react-dom/client/createRoot) に渡すことができ、その内部にあなたの React コンポーネントをレンダーできるようになります：

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

`index.html` にあるオリジナルの HTML コンテンツはそのままに、自分の `NavigationBar` という React コンポーネントが、HTML の `<nav id="navigation">` 内に表示されるようになりました。React コンポーネントを既存の HTML ページの内部にレンダーする方法の詳細については、[`createRoot` 使用方法のドキュメント](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) を参照してください。

既存のプロジェクトで React を使用する場合、まずはボタンのような小さなインタラクティブなコンポーネントから始め、その後、徐々に「上向きに」進んで、最終的にはページ全体が React で構築されるようにすることが一般的です。もしもそのような段階に到達した場合は、React の効果が最大限に得られるように、[React フレームワーク](/learn/start-a-new-react-project)に移行することをお勧めします。

## 既存のネイティブモバイルアプリ内で React Native を使用する {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) もまた、既存のネイティブアプリに段階的に統合することができます。Android（Java または Kotlin）用または iOS（Objective-C または Swift）用の既存のネイティブアプリがある場合は、[このガイド](https://reactnative.dev/docs/integration-with-existing-apps)に従って React Native 画面を追加できます。
