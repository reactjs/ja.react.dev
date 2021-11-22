---
id: create-a-new-react-app
title: 新しい React アプリを作る
permalink: docs/create-a-new-react-app.html
redirect_from:
  - "docs/add-react-to-a-new-app.html"
prev: add-react-to-a-website.html
next: cdn-links.html
---

もっとも良いユーザ・開発体験を得るために統合されたツールチェインを使いましょう。

このページではいくつかの人気のある React ツールチェインを説明します。これは次のようなタスクに役立ちます：

* 大量のファイルとコンポーネントでスケールする
* npm を通してサードパーティライブラリを利用する
* よくある間違いを早期に発見する
* 開発環境で CSS と JS をライブ編集する
* 本番用の出力を最適化する

このページで推奨されているツールチェインは**始めるにあたって設定が不要です**。

## ツールチェインが必要ない場合 {#you-might-not-need-a-toolchain}

あなたが上記のような問題を経験していなかったり、まだ JavaScript のツールを利用するのに慣れていない場合、[HTML ページに簡単な `<script>` タグで React を追加](/docs/add-react-to-a-website.html)することを検討してください（[JSX の利用](/docs/add-react-to-a-website.html#optional-try-react-with-jsx)も検討してみてください）。

これは**既存のウェブサイトに React を統合する最も簡単な方法**でもあります。あなたが役立つと思えばいつでもより大きなツールチェインを追加できます。

## 推奨するツールチェイン {#recommended-toolchains}

React チームは主に以下のソリューションを推奨します：

- **React を学習中**か、**新しい[シングルページ](/docs/glossary.html#single-page-application)アプリケーションを作成したい**場合、[Create React App](#create-react-app) を利用してください
- **Node.js でサーバサイドでレンダーされたウェブサイト**を構築するなら、[Next.js](#nextjs) を試してください
- **静的なコンテンツ中心のウェブサイト**を構築するなら、[Gatsby](#gatsby) を試してください
- **コンポーネントライブラリ**の構築や**既存のコードベースへの統合**をするなら、[その他の柔軟なツールチェイン](#more-flexible-toolchains)を試してください

### Create React App {#create-react-app}

[Create React App](https://github.com/facebookincubator/create-react-app) は **React を学習する**のに快適な環境であり、React で**新しい[シングルページ](/docs/glossary.html#single-page-application)アプリケーション**を作成するのに最も良い方法です。

開発環境をセットアップして最新の JavaScript の機能を使えるようにし、快適な開発体験を提供し、そして本番環境用の最適化を行います。あなたのマシンに [Node >= 14.0.0 及び npm >= 5.6](https://nodejs.org/en/) の環境が必要です。プロジェクトを作成するには次を実行します：

```bash
npx create-react-app my-app
cd my-app
npm start
```

>補足
>
>最初の行の `npx` は打ち間違いではありません -- これは [npm 5.2 から利用できるパッケージランナーツール](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)です。

Create React App はバックエンドのロジックやデータベース接続は扱いません。フロントエンドのビルドパイプラインを構築するだけであり、バックエンドに関しては好きなものを組み合わせて使って構いません。内部では [Babel](https://babeljs.io/) と [webpack](https://webpack.js.org/) を利用していますが、それらについて知る必要はありません。

本番環境にデプロイする準備ができたら、`npm run build` を実行すれば、`build` フォルダ内に最適化されたアプリケーションのビルドが生成されます。Create React App の詳細については、[該当ツールの README](https://github.com/facebookincubator/create-react-app#create-react-app--) および [ユーザガイド](https://facebook.github.io/create-react-app/) を参照してください。

### Next.js {#nextjs}

[Next.js](https://nextjs.org/) は React を使って**静的なサイトやサーバサイドでレンダーされるアプリケーション**を構築する場合に人気のある軽量フレームワークです。すぐに使える**スタイルおよびルーティングのソリューション**を含み、サーバ環境として [Node.js](https://nodejs.org/) を利用することを想定しています。

Next.js の[オフィシャルガイド](https://nextjs.org/learn/)を参照してください。

### Gatsby {#gatsby}

[Gatsby](https://www.gatsbyjs.org/) は React で**静的なウェブサイト**を作成するのに最も良い方法です。React コンポーネントを使用しながらも、事前レンダーされた HTML と CSS を出力することで最速のロード時間を保証します。

Gatsby の[オフィシャルガイド](https://www.gatsbyjs.org/docs/) および [スターターキットのギャラリー](https://www.gatsbyjs.org/docs/gatsby-starters/)を参照してください。

### その他の柔軟なツールチェイン {#more-flexible-toolchains}

以下のツールチェインはより大きな柔軟性や選択肢を提供します。経験豊富なユーザにこれらを推奨します。

- **[Neutrino](https://neutrinojs.org/)** は [webpack](https://webpack.js.org/) のパワーとプリセットのシンプルさを兼ね備えています。プリセットには [React アプリ](https://neutrinojs.org/packages/react/) と [React コンポーネント](https://neutrinojs.org/packages/react-components/)用のものがあります。

- **[Nx](https://nx.dev/react)** はフルスタックの monorepo 開発用ツールキットであり、React、Next.js、[Express](https://expressjs.com/) などのビルトインサポートを有しています。

<<<<<<< HEAD
- **[Parcel](https://parceljs.org/)** は高速な、ゼロ設定のウェブアプリケーションバンドラであり、[React と共に利用](https://parceljs.org/recipes.html#react)できます。
=======
- **[Parcel](https://parceljs.org/)** is a fast, zero configuration web application bundler that [works with React](https://parceljs.org/recipes/react/).
>>>>>>> 17ad2cbc71f4c1fcc3f3f9ae528bfd292a9fced7

- **[Razzle](https://github.com/jaredpalmer/razzle)** は設定不要のサーバレンダリングフレームワークでありながら、Next.js よりも柔軟性があります。

## ゼロからツールチェインを作成する {#creating-a-toolchain-from-scratch}

JavaScript ビルドツールチェインは一般的に次から成ります：

* **パッケージマネジャ**。[Yarn](https://yarnpkg.com/) や [npm](https://www.npmjs.com/) など。サードパーティのパッケージの広大なエコシステムを利用でき、それらを簡単にインストールしたりアップデートしたりできます。

* **バンドラ**。[webpack](https://webpack.js.org/) や [Parcel](https://parceljs.org/) など。モジュール化されたコードを書けるようになり、それを小さなパッケージにまとめてバンドルしてロード時間の最適化を行います。

* **コンパイラ**。[Babel](https://babeljs.io/) など。未だ動作している古いブラウザでもモダンな JavaScript コードを書いて動作させることができます。

ゼロから独自の JavaScript ツールチェインを設定したい場合、[こちらのガイドをチェック](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)すると Create React App の機能の一部を再現できます。

カスタムしたツールチェインは忘れずに[本番環境用に正しく設定](/docs/optimizing-performance.html#use-the-production-build)してください。
