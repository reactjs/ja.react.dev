---
title: 新しい React プロジェクトを始める
---

<Intro>

新しいプロジェクトを始める際はツールチェーンやフレームワークを使うことをお勧めします。これらのツールによって開発環境が快適になりますが、ローカル環境に Node.js をインストールする必要があります。

</Intro>

<YouWillLearn>

* ツールチェーンとフレームワークの違い
* 最小限のツールチェーンでプロジェクトを始める方法
* 充実した機能を持つフレームワークでプロジェクトを始める方法
* 人気のあるツールチェーンやフレームワークに含まれているもの

</YouWillLearn>

## あなたの冒険の出発地点を選ぶ {/*choose-your-own-adventure*/}

React は UI をコンポーネントと呼ばれるパーツに分割することで UI コードを作り上げていけるライブラリです。React はルーティングやデータ管理を自前では行いません。そのため、新しい React プロジェクトを始める方法はいくつかあります：

* [**HTML ファイルと script タグ**を使って始める](/learn/add-react-to-a-website)。Node.js のセットアップが必要ないが機能が限定される。
* **最小限のツールチェーン** から始め、必要に応じてより多くの機能を追加していく（学習に最適！）。
* データのフェッチ、ルーティングなどの一般的な機能がすでに組み込まれている **opinionated なフレームワーク** で始める。

## 最小限のツールチェーンでスタートする {/*getting-started-with-a-minimal-toolchain*/}

**React の学習**をするなら、[Create React App](https://create-react-app.dev/) をお勧めします。これは React を試したい場合や新しいシングルページ・クライアントサイドアプリケーションを構築したい場合に最も一般的な方法です。React 自体のためのツールであり、ルーティングやデータフェッチについては何もしません。

まずは [Node.js](https://nodejs.org/en/) をインストールしてください。ターミナルを開き、次のコマンドを実行してプロジェクトを作成してください。

<TerminalBlock>

npx create-react-app my-app

</TerminalBlock>

これで次のコマンドでアプリを起動できます。

<TerminalBlock>

cd my-app
npm start

</TerminalBlock>

詳しくは、[公式ガイド](https://create-react-app.dev/docs/getting-started)を参照してください。

> Create React App はバックエンドの処理やデータベースを取り扱いません。任意のバックエンドと組み合わせて使用できます。プロジェクトをビルドすると、静的な HTML、CSS、JS を含むフォルダが生成されます。しかし Create React App はサーバ機能を活用できないため、ベストなパフォーマンスを提供するわけではありません。もし読み込みを高速化したい場合や、ルーティング、サーバサイドロジックなどの組み込み機能が必要な場合は、代わりにフレームワークを使用することをお勧めします。

### その他の代表的なツールキット {/*toolkit-popular-alternatives*/}

* [Vite](https://vitejs.dev/guide/)
* [Parcel](https://parceljs.org/getting-started/webapp/)

## フル機能のフレームワークでビルドする {/*building-with-a-full-featured-framework*/}

本番環境用に本格的なプロジェクトを始めたい場合は、[Next.js](https://nextjs.org/) は最適です。Next.js は、React で静的アプリおよびサーバレンダーされるアプリを構築するための、人気で軽量なフレームワークです。ルーティング、スタイリング、サーバサイドレンダリングなどの機能がすでに組み込まれているため、プロジェクトを素早く立ち上げて動かし始めることができます。

[Next.js Foundations](https://nextjs.org/learn/foundations/about-nextjs) のチュートリアルは、React と Next.js でアプリを構築する場合の最適な入門書です。

### その他の代表的なフレームワーク {/*framework-popular-alternatives*/}

* [Gatsby](https://www.gatsbyjs.org/)
* [Remix](https://remix.run/)
* [Razzle](https://razzlejs.org/)

## カスタムのツールチェーン {/*custom-toolchains*/}

自分自身でツールチェーンを作成して設定したい場合はそうできます。ツールチェーンには、通常、以下のものが含まれます。

* **パッケージマネージャ**：サードパーティーパッケージをインストール、更新、管理するためのツールです。人気のあるパッケージマネージャには、[npm](https://www.npmjs.com/)（Node.js に組み込み）、[Yarn](https://yarnpkg.com/)、[pnpm](https://pnpm.io/) があります。
* **コンパイラ**：モダンな言語機能や、JSX や型注釈などの追加構文をブラウザで扱えるように変換するためのツールです。人気のあるコンパイラには、[Babel](https://babeljs.io/)、[TypeScript](https://www.typescriptlang.org/)、[swc](https://swc.rs/) があります。
* **バンドラ**：モジュールに分割されたコードを書いてそれらを小さなパッケージにまとめることで、読み込み時間を最適化できるツールです。人気のあるバンドラには、[webpack](https://webpack.js.org/)、[Parcel](https://parceljs.org/)、[esbuild](https://esbuild.github.io/)、[swc](https://swc.rs/) があります。
* **ミニファイア**：コードをよりコンパクトにすることで読み込み速度を改善するためのツールです。人気のあるミニファイアには、[Terser](https://terser.org/)、[swc](https://swc.rs/) があります。
* **サーバ**：サーバーリクエストを処理し、コンポーネントを HTML に変換するためのツールです。人気のあるサーバーには、[Express](https://expressjs.com/) があります。
* **リンタ**：コードによくあるミスをチェックするためのツールです。人気のあるリンタには [ESLint](https://eslint.org/) があります。
* **テストランナ**：コードに対してテストを実行するためのツールです。人気のあるテストランナには、[Jest](https://jestjs.io/) があります。

JavaScript のツールチェーンをゼロからセットアップする場合は、Create React App の機能の一部を再現する[このガイド](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)が参考になります。フレームワークには通常、ルーティングやデータの取得などのソリューションが用意されています。大規模なプロジェクトでは、[Nx](https://nx.dev/react) や [Turborepo](https://turborepo.org/) のようなツールを使って、複数のパッケージを単一のリポジトリで管理したくなるかもしれません。