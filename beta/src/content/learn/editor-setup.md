---
title: エディタのセットアップ
---

<Intro>

エディタを適切に設定することでコードが読みやすくなり、書く速度も上がります。また書いている最中にバグを発見するのにも役立ちます！ 初めてエディタを設定する場合や、現在のエディタの調整を行う場合、いくつかのおすすめがあります。

</Intro>

<YouWillLearn>

* 最も人気のあるエディタは何か
* コードを自動的にフォーマットする方法

</YouWillLearn>

## エディタを選ぶ {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) は現在最も人気の高いエディタのひとつです。大規模な拡張機能のマーケットプレイスを有しており、GitHub のような人気のあるサービスともよく統合されています。以下にリストされているほとんどの機能は、VS Code に拡張機能として追加することができ、とても設定しやすいエディタとなっています。

他に React コミュニティで使用されている人気のテキストエディタとしては、以下があります。

* [WebStorm](https://www.jetbrains.com/webstorm/) は、JavaScript に特化した統合開発環境です。
* [Sublime Text](https://www.sublimetext.com/) は JSX と TypeScript のサポート、[構文ハイライト](https://stackoverflow.com/a/70960574/458193)、自動補完などを備えています。
* [Vim](https://www.vim.org/) は、あらゆる種類のテキストの作成と変更を非常に効率的に行うために構築された、高度にカスタマイズ可能なテキストエディタです。ほとんどの UNIX システムと Apple OS X に "vi" として含まれています。

## お勧めのテキストエディタ機能 {/*recommended-text-editor-features*/}

エディタによっては既にこれらの機能が備わっているものもありますが、専用の拡張機能を追加する必要がある場合もあります。お使いのエディタが対応しているか確認してください。

### リント {/*linting*/}

コードのリンタによって、コードを書いている途中で問題を検知し早期に修正することができます。[ESLint](https://eslint.org/) は人気がある JavaScript 用のオープンソースのリンタです。

* [React 用の推奨設定で ESLint をインストールする](https://www.npmjs.com/package/eslint-config-react-app)（[Node をインストールしておく必要があります](https://nodejs.org/en/download/current/)）。
* [公式エクステンションで VSCode に ESLint を組み込む](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**あなたのプロジェクトで [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) のルールをすべて有効するようにしましょう。** これらは非常に重要なものであり、深刻なバグを早期に検知するために役立ちます。推奨の [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) プリセットには、これらがすでに含まれています。

### フォーマット {/*formatting*/}

あなたのコードを別の共同開発者と共有しているときに[タブとスペースに関する議論](https://www.google.com/search?q=tabs+vs+spaces)が起きるのは何よりも嫌なものです。幸いなことに、[Prettier](https://prettier.io/) を使えばコードをクリーンに整形し、設定済みの規則に従うようにコードを再フォーマットできます。Prettier を実行すると、タブはスペースに変換され、インデント、引用符などがすべて設定に従って変更されます。理想的なセットアップでは、ファイルの保存時に Prettier が実行されるので、これらの書き換えを素早く行うことができます。

以下の手順で [Prettier エクステンションを VSCode にインストール](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)できます。

1. VS Code を起動する。
2. クイックオープン (Ctrl/Cmd+P) を使用します。
3. `ext install esbenp.prettier-vscode` を貼り付ける。
4. Enter を押す。

#### 保存時にフォーマット {/*formatting-on-save*/}

理想的には、毎回ファイルの保存時にコードを整形するべきです。VS Code にはそのような設定があります！

1. VSCode で `CTRL/CMD + SHIFT + P` を押す。
2. "settings" とタイプする。
3. Enter を押す。
4. 検索バーで "format on save" とタイプする。
5. "format on save" のオプションにチェックが入っていることを確認する。

> もし ESLint プリセットにフォーマットのルールがある場合、それらは Prettier と競合する可能性があります。[`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) を使って ESLint のフォーマットルールをすべて無効し、ESLint は論理的なミスをキャッチするため*のみ*に使用されるようにすることをお勧めします。プルリクエストをマージする前にファイルがフォーマットされていることを強制したい場合は、継続的インテグレーション (CI) で [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) を使用してください。
