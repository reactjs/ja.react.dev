---
title: エディタのセットアップ
---

<Intro>

エディタを適切に設定することで、コードが読みやすく、素早く書けるようになります。さらに、書いている途中でバグを検出するのにも役立ちます！ エディタの設定をするのが初めてである、あるいは現在使用しているエディタをチューンアップしたいという場合、いくつかのおすすめがあります。

</Intro>

<YouWillLearn>

* 最も人気があるエディタの紹介
* コードを自動フォーマットする方法

</YouWillLearn>

## エディタを選ぶ {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) は、現在最も一般的に使用されているエディタのひとつです。マーケットプレイスには多くの拡張機能があり、GitHub のような人気のサービスとも良く統合されています。以下で説明する多くの機能も、VS Code に拡張機能として追加することができるため、高度にカスタマイズできます。

他に React コミュニティで使用されている人気のテキストエディタとしては以下のようなものがあります。

* [WebStorm](https://www.jetbrains.com/webstorm/) は、JavaScript に特化した統合開発環境です。
* [Sublime Text](https://www.sublimetext.com/) は、JSX や TypeScript のサポート、[シンタックスハイライト](https://stackoverflow.com/a/70960574/458193)、オートコンプリート機能を組み込みで有しています。
* [Vim](https://www.vim.org/) は、あらゆる種類のテキストの作成や編集を効率的に行うために作られた、高度にカスタマイズ可能なテキストエディタです。多くの UNIX システムや Apple OS X には "vi" として含まれています。

## テキストエディタ機能のお勧め {/*recommended-text-editor-features*/}

一部のエディタは以下の機能を組み込みで有していますが、他のエディタでは拡張機能を追加する必要があるかもしれません。使いたいエディタのサポート状況を確認してください!

### リント {/*linting*/}

コードリンタは、書きながらコード内の問題を見つけて、問題を早期に修正できるようにしてくれます。[ESLint](https://eslint.org/) は、人気の JavaScript 用オープンソースリンタです。

* [React に適した構成の ESLint をインストールする](https://www.npmjs.com/package/eslint-config-react-app)（[Node をインストール](https://nodejs.org/en/download/current/)していることを確認してください！）
* [公式拡張機能を使用して VS Code に ESLint を統合する](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**プロジェクトで [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) のルールをすべて有効化していることを確認してください**。これは非常に重要であり、とても深刻なバグを早期に検出してくれます。[`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) 推奨プリセットは、これらをすでに含んでいます。

### コードフォーマット {/*formatting*/}

他の人とコードを共有するにあたって何よりも避けたいのは、[タブ vs スペース](https://www.google.com/search?q=tabs+vs+spaces) についての議論に巻き込まれてしまうことです！ 幸いなことに、[Prettier](https://prettier.io/) は、あらかじめ設定できるルールに従ってコードを再フォーマットすることで、あなたのコードを綺麗にしてくれます。Prettier を実行すれば、タブはスペースに変換され、インデント、引用符なども設定に従って変更されます。理想的なセットアップでは、Prettier はファイルを保存するたびに実行され、瞬時にれらの変更を適用してくれます。

[VSCode 用の Prettier 拡張機能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) を VS Code にインストールするには、次の手順に従ってください。

1. VS Code を起動する。
2. Quick Open を使用する（Ctrl/Cmd+P を押す）。
3. `ext install esbenp.prettier-vscode` と打ち込む。
4. Enter キーを押す。

#### 保存時にフォーマット {/*formatting-on-save*/}

理想的には、毎回の保存時にコードを整形するべきです。VS Code にはそのための設定があります！

1. VS Code で、`CTRL/CMD + SHIFT + P` と押す。
2. "settings" と入力する。
3. Enter キーを押す。
4. 検索バーに "format on save" と入力する。
5. "format on save" オプションがチェックされているようにする。

> あなたの ESLint のプリセットに、フォーマットに関するルールがある場合、それらが Prettier と競合する可能性があります。[`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) を使用して、ESLint プリセット内のフォーマットに関するルールをすべて無効にし、ESLint を論理的な誤りの検出*のみ*に限定して利用することをお勧めします。プルリクエストをマージする前にファイルがフォーマットされていることを強制するには、継続的インテグレーション (CI) で [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) を使用してください。
