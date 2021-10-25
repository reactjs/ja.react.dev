---
id: static-type-checking
title: 静的型チェック
permalink: docs/static-type-checking.html
---

[Flow](https://flow.org/) や [TypeScript](https://www.typescriptlang.org/) のような静的型チェッカーを使用することでコードを実行する前の早期段階に型不整合等の問題を検知することができます。他にも型解析言語を使用することで補完などの機能が追加され、開発体験を上げることができます。これらの理由から、大きいコードベースでは `PropTypes` の代わりに Flow や TypeScript を使うことをおすすめします。

## Flow {#flow}

[Flow](https://flow.org/) は JavaScript 用の静的型チェック機能です。Facebook で開発されており、React と一緒に使われることが多いです。変数、関数や React コンポーネントに型を足すことができ、型不整合を早期に発見できるようになります。[はじめての Flow](https://flow.org/en/docs/getting-started/) に基本情報が記載されているので、それを読むと良いでしょう。

Flow を使用するには以下の手順を踏みます：

* Flow をプロジェクトの dependency に入れる。
* Flow の型定義をコンパイル時にコードから剥がすように設定する。
* 型定義を追加し、Flow を起動して確認する。

順を追って説明します。

### Flow をプロジェクトに追加する {#adding-flow-to-a-project}

まず、ターミナル上であなたのプロジェクトが含まれているディレクトリに入り、以下のコマンドを入力してください。

[Yarn](https://yarnpkg.com/) を使っている場合：

```bash
yarn add --dev flow-bin
```

[npm](https://www.npmjs.com/) を使っている場合：

```bash
npm install --save-dev flow-bin
```

このコマンドによって Flow の最新版をあなたのプロジェクトに入れることができます。

次に、`package.json` の `"scripts"` に `flow` を追加しましょう。これで、ターミナルで Flow を実行できるようになります。

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

最後に、以下のコマンドを実行します：

[Yarn](https://yarnpkg.com/) を使っている場合：

```bash
yarn run flow init
```

[npm](https://www.npmjs.com/) を使っている場合：

```bash
npm run flow init
```

このコマンドで Flow の設定ファイルを生成することができます。この設定ファイルはバージョン管理しましょう。

### Flow の型定義をコンパイル時にコードから剥がす {#stripping-flow-syntax-from-the-compiled-code}

Flow は JavaScript 言語を拡張し、型定義のための特殊な記法を使えるようにします。しかし、ブラウザはその記法について知らない為、ブラウザに送信されるコンパイル後の JavaScript バンドルに含まれないようにしなければいけません。

剥がす方法は使用している JavaScript のコンパイルツールによって変わってきます。

#### Create React App {#create-react-app}

もし、あなたのプロジェクトが [Create React App](https://github.com/facebookincubator/create-react-app) によって生成されている場合、おめでとうございます！ 既にビルド時に Flow の型定義は剥がされる設定になっているため、このステップで何もする必要はありません。

#### Babel {#babel}

>補足:
>
>以下の手順は Create React App で React をセットアップしている方向けでは*ありません*。Create React App も内部で Babel を使用していますが、既に Flow を使えるように設定されています。以下の手順は Create React App を使って*いない*場合のみ実行してください。

もし、あなたが手動で Babel の設定を行っていた場合、以下のコマンドで Flow 用の Babel プリセットをインストールする必要があります。

yarn を使っている場合：

```bash
yarn add --dev @babel/preset-flow
```

npm を使っている場合：

```bash
npm install --save-dev @babel/preset-flow
```

そして、`flow` のプリセットを [Babel の設定ファイル](https://babeljs.io/docs/usage/babelrc/) に追加してください。例えば、Babel の設定を `.babelrc` ファイルで行っている場合は以下のようになります。

```js{3}
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

これであなたのコードで Flow の型定義が使えるようになります。

>補足:
>
>Flow を使うためには必ず `react` のプリセットが必要というわけではありません。ただ、よく組み合わせて使われています。Flow はそのままでも JSX のシンタックスを認識できます。

#### 他のビルド設定 {#other-build-setups}

もし、Create React App も Babel も使用していない場合、[flow-remove-types](https://github.com/flowtype/flow-remove-types) を使って Flow の型定義を剥がすことができます。

### Flow の実行 {#running-flow}

もし、今までの手順を踏んでいる場合、以下のコマンドで Flow が実行されます。

```bash
yarn flow
```

npm を使っている場合：

```bash
npm run flow
```

以下のようなメッセージが表示されます。

```
No errors!
✨  Done in 0.17s.
```

### Flow の型定義の追記 {#adding-flow-type-annotations}

Flow の初期設定では、以下のコメントが含まれているファイルのみ型チェックを行います。

```js
// @flow
```

上記コメントは基本的にファイルの頭に記載します。あなたのプロジェクトのいくつかのファイルに足してみて、`yarn flow` や `npm run flow` を実行して Flow が何か問題を検知するかどうかを確認してみましょう。

Flow の型チェックを、コメントが含まれているかにかかわらず*全て*のファイルに対してかける[設定](https://flow.org/en/docs/config/options/#toc-all-boolean)も存在します。これは既存のプロジェクトに対してかけると確認箇所が大量に出てしまいますが、新規プロジェクトの立ち上げで全てのファイルに型を入れたい場合は合理的な選択でしょう。

これで準備は整いました！ Flow についてより深く知りたい場合には以下の資料が役立つでしょう。

* [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
* [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
* [Flow Documentation: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## TypeScript {#typescript}

[TypeScript](https://www.typescriptlang.org/) は Microsoft によって開発されたプログラミング言語です。型を所有した JavaScript のスーパーセットで、独自のコンパイラを所持しています。TypeScript は型言語であるため、実行前のビルド時にエラーやバグを検知することができます。React と TypeScript を組み合わせて使うことに関しては、[ここ](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter)にも詳しく記載されています。

TypeScript を使うためには以下のことを行います。
* TypeScript をプロジェクトの dependency に入れる。
* TypeScript のコンパイラの設定を行う。
* TypeScript 用のファイル拡張子を使用する。
* 使用するライブラリの型定義をインストールする。

順を追って説明します。

### Create React App で TypeScript を使用する{#using-typescript-with-create-react-app}

Create React App には最初から TypeScript のサポートが含まれています。

TypeScript サポートが含まれている**新規プロジェクト**を作成するには、以下のコマンドを実行します。

```bash
npx create-react-app my-app --template typescript
```

[この資料に記載されているように、](https://facebook.github.io/create-react-app/docs/adding-typescript)**既存の Create React App のプロジェクト**にも TypeScript のサポートを追加することができます。

>補足:
>
>もし、Create React App を使っている場合、**以下の記述は全て飛ばして大丈夫です**。Create React App を使用していない場合のセットアップ手順について記載しています。


### TypeScript をプロジェクトに追加する {#adding-typescript-to-a-project}
全ては TypeScript をインストールするところから始まります。プロジェクトが入っているフォルダで以下のコマンドを入力してください。

[Yarn](https://yarnpkg.com/) を使っている場合：

```bash
yarn add --dev typescript
```

[npm](https://www.npmjs.com/) を使っている場合：

```bash
npm install --save-dev typescript
```

おめでとうございます！ これで最新の TypeScript があなたのプロジェクトにインストールされました。これによって、`tsc` コマンドが使えるようになります。設定をする前に、まずは `tsc` を `package.json` の `"scripts"` に追加しましょう。

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### TypeScript コンパイラの設定 {#configuring-the-typescript-compiler}
コンパイラはこちらから設定しないと無価値です。TypeScript ではコンパイラの設定は `tsconfig.json` というファイルで定義します。このファイルを生成するには以下のコマンドを実行してください。

[Yarn](https://yarnpkg.com/) を使っている場合：

```bash
yarn run tsc --init
```

[npm](https://www.npmjs.com/) を使っている場合：

```bash
npx tsc --init
```

新しく生成された `tsconfig.json` を見てみると、コンパイラ設定用の様々なオプションがあることがわかります。これら全てのオプションの詳細に関しては[こちら](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)を参照してください。

たくさんの設定の中から `rootDir` と `outDir` に注目します。本来、コンパイラは TypeScript のファイルから JavaScript のファイルを生成します。しかし、既存のソースコードと生成されたコードが混合してしまうことは避けるべきです。

以上の問題を 2 つの手順によって対応します。
* まず、プロジェクトの構成を以下のように変更しましょう。全てのソースコードを `src` ディレクトリに移動します。

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* 次に、`tsconfig.json` を編集してコンパイラにソースコードの場所と生成する場所を設定します。

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

素晴らしい！ これで `build` のスクリプトを実行した際、コンパイラが生成したコードは `build` ディレクトリに格納されます。他の設定に関しては、[TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) に React プロジェクト始めるのにおすすめな `tsconfig.json` を提供しているので、そちらを参照してください。

基本的に、生成された JavaScript のコードはバージョン管理するべきではありません。`build` フォルダは `.gitignore` に追記しましょう。

### ファイル拡張子 {#file-extensions}
React ではおそらくコンポーネントを `.js` ファイルに書いていたと思います。TypeScript には 2 種類のファイル拡張子が存在します。

`.ts` がデフォルトの拡張子で、`JSX` が含まれているファイルは `.tsx` を使います。

### TypeScript の実行 {#running-typescript}

上記の手順を踏んでいれば、以下のコマンドで TypeScript を実行することができます。

```bash
yarn build
```

[npm](https://www.npmjs.com/) を使っている場合：

```bash
npm run build
```

実行結果に何も表示されない場合は、正常に完了したと言うことです。


### 型宣言 {#type-definitions}
他のライブラリを使用している時の型エラーやヒントを表示させるために、コンパイラは型宣言ファイルを参照します。型宣言ファイルにはそのライブラリが使用する全ての型の情報が含まれています。これを使うことによって、npm 等から取得した JavaScript のライブラリをそのまま使うことができます。

ライブラリの型宣言ファイルを取得するには主に以下の 2 つの方法があります。

__Bundled__ - これはライブラリ自体が型宣言ファイルを所有している場合です。この場合、ライブラリをインストールするだけでそのまま使用することができます。ライブラリが型宣言ファイルを所有しているかどうか確認するには、プロジェクトに `index.d.ts` ファイルがあるかどうかを見ます。一部のライブラリは `package.json` の `typings`、または `types` の下に型宣言ファイルのパスを指定しています。

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped には型宣言ファイルがバンドルされていない様々なライブラリのための型定義が用意されています。これらの型定義はクラウドソースにより Microsoft とオープンソースのコントリビュータが管理しています。例えば、React には型宣言ファイルが含まれておりませんが、DefinitelyTyped から取得することができます。取得するにはターミナルに以下のコマンドを入力してください。

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__ローカル型定義__
もし、使用しているライブラリに型宣言ファイルが含まれておらず、DefinitelyTyped にも該当する型宣言ファイルがない場合、自前で型宣言ファイルを作成することができます。それを行うには `declarations.d.ts` をソースディレクトリのルートに作成します。型宣言は以下のように行なえます。

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

これでコードを書く準備は整いました！ TypeScript についてより深く知りたい場合には以下の資料が役立つでしょう。

* [TypeScript Documentation: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
* [TypeScript Documentation: Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## ReScript {#rescript}

<<<<<<< HEAD
[Reason](https://reasonml.github.io/) は新しい言語ではありません。歴戦の言語である [OCaml](https://ocaml.org/) によって動く新しい記法及びツールチェインです。Reason は OCaml に JavaScript を書く人には見慣れた記法を提供し、既存の NPM/Yarn を使ったワークフローに寄せています。

Reason は Facebook で開発されており、Messenger 等のプロダクトに既に使われてます。まだ試験的段階ですが、Facebook によって管理された [React を書くためのライブラリ](https://reasonml.github.io/reason-react/)や、[活発なコミュニティ](https://reasonml.github.io/docs/en/community.html)が存在します。
=======
[ReScript](https://rescript-lang.org/) is a typed language that compiles to JavaScript. Some of its core features are  guaranteed 100% type coverage, first-class JSX support and [dedicated React bindings](https://rescript-lang.org/docs/react/latest/introduction) to allow integration in existing JS / TS React codebases.

You can find more infos on integrating ReScript in your existing JS / React codebase [here](https://rescript-lang.org/docs/manual/latest/installation#integrate-into-an-existing-js-project).
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3

## Kotlin {#kotlin}

[Kotlin](https://kotlinlang.org/) は JetBrains により開発された静的型言語です。JVM、Android、LLVM、や [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html) といったプラットフォームを対象としています。

JetBrains は [React bindings](https://github.com/JetBrains/kotlin-wrappers) や [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app) のような様々な React コミュニティの為のツールの開発、運営を行っています。後者は React アプリをビルド設定いらずで Kotlin で書き始めることができます。

## 他の言語 {#other-languages}

JavaScript にコンパイルされ、React にも活用できる静的型言語は他にも存在します。例えば、[F#/Fable](https://fable.io/) と [elmish-react](https://elmish.github.io/react) の組み合わせです。詳細はそれぞれのサイトを確認してください。他にも React を活用できる静的型言語があれば、ぜひこのページに追記してください！
