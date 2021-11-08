---
id: how-to-contribute
title: 貢献の方法
layout: contributing
permalink: docs/how-to-contribute.html
next: codebase-overview.html
redirect_from:
  - "contributing/how-to-contribute.html"
  - "tips/introduction.html"
---

React は Facebook の最初のオープンソースプロジェクトの 1 つで現在も非常に活発に開発されており、[facebook.com](https://www.facebook.com) 上のあらゆる人々にコードを届けることにも使用されています。私たちはこのプロジェクトへの貢献をできるだけ簡単かつ透明性の高いものにするために努力していますが、まだ完全ではありません。このドキュメントがプロジェクトへの貢献の手順を明確にし、あなたの持つ疑問を解決できれば幸いです。

### [行動規範](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md) {#code-of-conduct}

Facebook は行動規範として [Contributor Covenant](https://www.contributor-covenant.org/) を採用しており、プロジェクト参加者が遵守することを期待しています。[全文](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md)を読んでください、そうすれば参加者はどのような行動を取ればよいか、またどのような行動が許容されないのか理解できるでしょう。

### オープンな開発 {#open-development}

React に関する開発作業はすべて [GitHub](https://github.com/facebook/react) 上で直接行われます。コアチームメンバーと外部のコントリビューターの両方が、同じレビュープロセスを経由するプルリクエストを送ります。

### セマンティック・バージョニング {#semantic-versioning}

React は[セマンティック・バージョニング](http://semver.org/)に従います。重要なバグ修正のためにパッチバージョンを、新機能や非本質的な変更のためにマイナーバージョンを、そして破壊的変更のためにメジャーバージョンをリリースします。私たちが破壊的変更を加える場合、ユーザが今後の変更について前もって知り、コードを移行できるようにするため、私たちはマイナーバージョンで非推奨警告を行います。我々の安定性および逐次的なマイグレーションに関する取り決めについては、[バージョニングポリシー](/docs/faq-versioning.html)をご覧ください。

重要な変更はすべて [changelog file](https://github.com/facebook/react/blob/main/CHANGELOG.md) に文書化されています。

### ブランチの構成 {#branch-organization}

プルリクエストを送信する場合は、直接 [`main` ブランチ](https://github.com/facebook/react/tree/main)に対して行ってください。開発用、あるいは次期リリース用の別ブランチは使っていません。`main` をすべてのテストが通る良い状態に保つために努力しています。

`main` ブランチに取り込まれるコードは最新の安定リリースと互換性がなければなりません。追加の機能はあっても構いませんが、破壊的変更があってはなりません。`main` ブランチの先頭からは、新しいマイナーバージョンが常にリリースできる状態であるべきです。

### フィーチャー・フラグ (Feature Flags) {#feature-flags}

`main` ブランチをリリース可能な状態に保つため、破壊的な変更や実験的な機能はフィーチャー・フラグの背後で動作させます。

フィーチャー・フラグは [`packages/shared/ReactFeatureFlags.js`](https://github.com/facebook/react/blob/main/packages/shared/ReactFeatureFlags.js) で定義されています。React のいくつかのビルドでは別のフィーチャー・フラグを有効化していることがあります。例えば React Native のビルドは React DOM とは別に設定されているかもしれません。そのようなフラグは [`packages/shared/forks`](https://github.com/facebook/react/tree/main/packages/shared/forks) にあります。フィーチャー・フラグは Flow で静的に型付けされているため `yarn flow` を実行することで必要なフラグを更新したことを確認できます。

React のビルドシステムが、無効化されている機能を公開前に取り除きます。すべてのコミットについて継続的インテグレーションのジョブが実行され、バンドルサイズの変化を確認します。このサイズの変化の情報を使って、ある機能が正しくフラグ管理されていることを確認することが可能です。

### バグ {#bugs}

#### 既知の問題を知るには {#where-to-find-known-issues}

私たちは公開されるバグの管理に [GitHub Issues](https://github.com/facebook/react/issues) を使用しています。私たちはこれを注意深く見守り、修正中の作業がある場合はそれを明確にするようにします。新しい Issue を提出する前に、既に同じものが存在しないか確かめてください。

#### 新しい問題の報告 {#reporting-new-issues}

バグを修正するための最善の方法は、バグを再現する最小のテストケースを提供することです。この [JSFiddle テンプレート](https://jsfiddle.net/Luktwrdm/) は素晴らしい出発点です。

#### セキュリティバグ {#security-bugs}

Facebook にはセキュリティバグの安全な開示のための[報奨金制度](https://www.facebook.com/whitehat/)が存在します。それを念頭において、セキュリティバグは公開の Issues に提出せず、上記のページの手順に従ってください。

### 連絡方法 {#how-to-get-in-touch}

* IRC：[# freenode の reactjs](https://webchat.freenode.net/?channels=reactjs)
* [ディスカッションフォーラム](/community/support.html#popular-discussion-forums)

また、React に関して助けが必要な場合は、[Discord 上の React コミュニティ](http://www.reactiflux.com/)も存在します。

### 変更の提案 {#proposing-a-change}

もしあなたがパブリック API に変更を加えたり、実装に些細とはいえない変更を加えたりしたい場合、[Issue を提出する](https://github.com/facebook/react/issues/new)ことをお勧めします。これによって、あなたが大きな労力を割く前に提案について合意に達することができます。

バグを修正するだけの場合は、すぐにプルリクエストを送信しても問題ありませんが、修正したいバグの内容を詳細に記載した Issue を提出することをお勧めします。これは、あなたの修正自体は受け付けないがバグの追跡はしたいという場合に役立ちます。

### 初めてのプルリクエスト {#your-first-pull-request}

はじめてのプルリクエストに取り組んでみますか？ この無料ビデオシリーズから手順を学ぶことができます：

**[GitHub でオープンソースプロジェクトに貢献する方法](https://app.egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)**

あなたが新しい試みをする上で、貢献プロセスに慣れるのを助けるために、私たちは比較的影響範囲の少ないバグを含む **[good first issues](https://github.com/facebook/react/issues?q=is:open+is:issue+label:"good+first+issue")** のリストを持っています。これはオープンソースプロジェクトへの貢献の入門に最適です。

Issue を解決することにした場合、誰かがすでに修正に取り組んでいる場合に備えて、コメントスレッドを必ず確認してください。現時点で誰も作業していない場合は、他の人が誤って重複して作業をしないように、作業する予定であることを示すコメントを残してください。

誰かが取り組むと宣言した Issue が 2 週間以上放置されている場合、それを引き継ぐことは問題ありませんが、その場合もコメントを残すべきです。

### プルリクエストを送信する {#sending-a-pull-request}

コアチームはプルリクエストを監視しています。プルリクエストをレビューしてマージするか、変更を要求するか、説明付きでクローズします。Facebook.com 内部で使用法の検討が必要な可能性のある API の変更については、対応が遅くなることがあります。プロセス全体を通して最新情報とフィードバックを提供するよう最善を尽くします。

**プルリクエストを送信する前に、**以下のプロセスが行われているか確認してください：

1. [リポジトリ](https://github.com/facebook/react) をフォークして `main` から新しいブランチを作成します。
2. `yarn` コマンドをリポジトリルートで実行します。
3. バグを修正したり、テストが必要なコードを追加した場合は、テストを追加します。
4. テストスイートが通ることを確認してください (`yarn test`)。ヒント： `yarn test --watch TestName` コマンドは開発時に役立ちます。
5. 本番環境でテストするために `yarn test --prod` コマンドを実行します。
6. デバッガが必要な場合は `yarn debug-test --watch TestName` を実行し `chrome://inspect` を開き "Inspect" を押してください。
7. [prettier](https://github.com/prettier/prettier) でコードをフォーマットします (`yarn prettier`)。
8. リントを行います (`yarn lint`)。ヒント： `yarn linc` は変更されたファイルのみに適用できます。
9. [Flow](https://flowtype.org/) による型チェックを行います (`yarn flow`)。
10. まだの場合は、先に CLA (Contributor License Agreement) の提出を済ませます。

### Contributor License Agreement (CLA) {#contributor-license-agreement-cla}

あなたのプルリクエストを受け付けるために、Contributor License Agreement (CLA) の提出を行って頂く必要があります。これは一度だけ行えば良いので、あなたが他の Facebook オープンソースプロジェクトで既に完了させている場合は必要ありません。初めてプルリクエストを送信する場合は、CLA 提出を完了させたことをお知らせください。そうすれば私たちは GitHub のユーザ名と照らし合わせてチェックを行います。

**[ここで CLA を完了させてください。](https://code.facebook.com/cla)**

### 貢献の前提条件 {#contribution-prerequisites}

* [Node](https://nodejs.org) v8.0.0+ と、[Yarn](https://yarnpkg.com/en/) v1.2.0+ がインストールされていること。
* [JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html) がインストールされていること。
* `gcc` がインストールされている、または必要に応じたコンパイラをインストールすることができること。依存関係の中にはコンパイルステップが必要なものもあります。OS X では Xcode のコマンドラインツールが役立つでしょう。Ubuntu では `apt-get install build-essential` コマンドで必要なパッケージをインストールできます。他の Linux ディストリビューションでも似たようなコマンドで実現できるでしょう。Windows では追加の手順が必要になり、詳しくは  [`node-gyp` installation instructions](https://github.com/nodejs/node-gyp#installation) を参照してください。
* Git について精通していること。

### 開発ワークフロー {#development-workflow}

React リポジトリをクローンしたあと、`yarn` コマンドで依存関係のパッケージを取得してください。
そうすれば、いくつかのコマンドが実行可能になります：

* `yarn lint` コードスタイルをチェックします。
* `yarn linc` `yarn lint` と似ていますが、変更されたファイルのみをチェックするのでこちらの方が速いです。
* `yarn test` 全てのテストスイートを実行します。
* `yarn test --watch` 対話式のテストウォッチャーを実行します。
* `yarn test <pattern>` 指定したパターンにマッチするファイルのみテストを実行します。
* `yarn test --prod` 本番環境でテストを実行します。
* `yarn debug-test` は `yarn test` に似ていますがデバッガ付きです。`chrome://inspect` を開き "Inspect" を押してください。
* `yarn flow` [Flow](https://flowtype.org/) による型チェックを行います。
* `yarn build` 全てのパッケージを含む `build` フォルダを作成します。
* `yarn build react/index,react-dom/index --type=UMD` React と ReactDOM だけの UMD ビルドを作成します。

`yarn test`（またはそれに近い上記のコマンド）を実行し、あなたの行った変更によって何らかの異常を引き起こしていないか確認することをお勧めします。とはいえ実際のプロジェクトで自分の React のビルドを使ってみることも役に立つでしょう。

まず `yarn build` を実行します。これによってビルド済みのバンドルファイルが `build` フォルダ内に作られ、同時に `build/packages` 内に npm パッケージも用意されます。

変更を試す一番簡単な方法は `yarn build react/index,react-dom/index --type=UMD` を実行し、`fixtures/packaging/babel-standalone/dev.html` を開くことです。このファイルは `build` フォルダの `react.development.js` を既に使用しているので、変更が反映されます。

あなたの加えた変更を既存の React プロジェクトで試したい場合、`build/node_modules/react/umd/react.development.js`、`build/node_modules/react-dom/umd/react-dom.development.js`、もしくは他のビルドされたファイルをあなたのアプリケーションにコピーして安定版の代わりに使用することができます。

もし、npm 版の React を使用している場合は `react` と `react-dom` を依存関係から削除し、`yarn link` を使用してそれらがローカルの `build` フォルダを指すようにしてください。ビルド時には **`--type=UMD` の代わりに `--type=NODE` を渡す必要があることに注意してください**。また `scheduler` パッケージもビルドする必要があります：

```sh
cd ~/path_to_your_react_clone/
yarn build react/index,react/jsx,react-dom/index,scheduler --type=NODE

cd build/node_modules/react
yarn link
cd build/node_modules/react-dom
yarn link

cd ~/path/to/your/project
yarn link react react-dom
```

`yarn build` を React フォルダで実行するたびに、あなたのプロジェクトの `node_modules` フォルダに更新されたバージョンが現れるでしょう。その後、プロジェクトをビルドし直して変更を試すことができます。

もしまだいくつかのパッケージが不足している場合（例えばプロジェクトで `react-dom/server` を使っている場合）、常に `yarn build` でフルのビルドを行うことができます。ただしオプションなしの `yarn build` は時間がかかることに注意してください。

プルリクエストにあなたの新機能に応じたユニットテストを含めることは必須です。これによって将来あなたのコードを壊してしまわないことが担保されます。

### スタイルガイド {#style-guide}

[Prettier](https://prettier.io/) と呼ばれる自動コードフォーマッタを使います。
`yarn prettier` コマンドをコードを変更した後に実行してください。

そうすれば、後はリンターがあなたのコードに存在するほとんどの問題を捕らえるでしょう。
自分の書いたコードのスタイルをチェックしたい場合は単に `yarn linc` を実行してください。

しかしながら、リンターでもチェックしきれないいくつかのスタイルがあります。何か分からないことがあれば [Airbnb's Style Guide](https://github.com/airbnb/javascript) が正しい方向に導いてくれるでしょう。

### Request for Comments (RFC) {#request-for-comments-rfc}

バグ修正やドキュメンテーションの改善を含む多くの変更は、通常の GitHub プルリクエストのワークフローを通して行われレビューされます。

ただし、いくつかの "大きめの" 変更は、多少の設計プロセスと React コアチームの合意を経ることをお願いします。

"RFC" (request for comments) プロセスは、新機能がプロジェクトに取り込まれるまでの一貫性があり整備された筋道を提供することを目的としています。[rfcs リポジトリ](https://github.com/reactjs/rfcs) を訪れれば貢献することができます。

### ライセンス {#license}

React に貢献するにあたって、あなたの貢献は MIT ライセンスの元にあることに同意したとみなします。

### 次のセクション {#what-next}

[次のセクション](/docs/codebase-overview.html) を読んで、コードベースの構成方法について知ることができます。
