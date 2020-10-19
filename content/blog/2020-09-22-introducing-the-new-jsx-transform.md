---
title: 新しい JSX トランスフォーム
author: [lunaruan]
---

React 17 には[新機能はありません](/blog/2020/08/10/react-v17-rc.html)が、新バージョンの JSX トランスフォーム (JSX transform) に対応します。この記事ではこれがどのようなもので、どのように試せるのかについて説明します。

## JSX トランスフォームとは？ {#whats-a-jsx-transform}

ブラウザはそのままでは JSX を理解しないため、ほとんどの React ユーザは、Babel や TypeScript のようなコンパイラを利用して **JSX コードを通常の JavaScript に変換 (transform)** しています。Create React App や Next.js のような多くの設定済みツールキットも、裏では JSX トランスフォーム機能を搭載しています。

React 17 のリリースとともに、JSX トランスフォームにいくつかの改良を加えたいと思っていましたが、既存のセットアップを壊したくもありませんでした。そのため、[Babel と協力](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154)して、アップグレードしたい人のために JSX トランスフォームの新バージョンを提供することにしました。

新しいトランスフォームへのアップグレードは完全に任意ですが、いくつかの利点があります。

* 新版のトランスフォームでは、**React をインポートせず** JSX を使用できます。
* セットアップによっては、コンパイル後のバンドルサイズをわずかに改善できる可能性があります。
* 将来的に、React を学ぶために**覚える必要がある概念の数を減らす**ような改善が可能になります。

**このアップグレードは JSX の構文を変更するものではなく、必須でもありません**。以前の JSX トランスフォームもこれまで通り動作し続けますし、それらのサポートを削除する予定もありません。


<<<<<<< HEAD
[React 17 RC](/blog/2020/08/10/react-v17-rc.html) にはすでに新しいトランスフォームのサポートが含まれていますので、試してみてください。より簡単に導入できるよう、React 17 がリリースされた後、React 16.x、React 15.x、React 0.14.x へのバックポートも計画しています。[記事の後半](#how-to-upgrade-to-the-new-jsx-transform)で様々なツールにおけるアップグレード方法を記載しています。
=======
[React 17 RC](/blog/2020/08/10/react-v17-rc.html) already includes support for the new transform, so go give it a try! To make it easier to adopt, **we've also backported its support** to React 16.14.0, React 15.7.0, and React 0.14.10. You can find the upgrade instructions for different tools [below](#how-to-upgrade-to-the-new-jsx-transform).
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

では、新旧のトランスフォームの違いを詳しく見ていきましょう。

## 新しいトランスフォームは何が違うのか？ {#whats-different-in-the-new-transform}

JSX を使うと、コンパイラはそれをブラウザが理解できる React の関数呼び出しに変換します。**以前の JSX トランスフォーム機能**では、JSX を `React.createElement(...)` 呼び出しに変換していました。

例えば、ソースコードが以下のようになっているとします。

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

裏側では、以前の JSX トランスフォームはこれを以下のような通常の JavaScript に変換します。

```js
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

>補足
>
>**あなたのソースコードをこう変えろという話ではありません。**これは、JSX トランスフォームがあなたの JSX ソースコードをブラウザが理解できるコードへとどのように変換するのかを説明しているものです。

しかし、これで完璧とは言えません。

<<<<<<< HEAD
* JSX が `React.createElement` へとコンパイルされるため、JSX を使用する場合は `React` をスコープに入れる必要がありました。
* `React.createElement` では行えない[パフォーマンス向上と単純化方法](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation)がいくつか存在します。
=======
* Because JSX was compiled into `React.createElement`, `React` needed to be in scope if you used JSX.
* There are some [performance improvements and simplifications](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#motivation) that `React.createElement` does not allow.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

これらの問題を解決するために、React 17 では React パッケージに、Babel や TypeScript のようなコンパイラのみが使用することを意図した 2 つの新しいエントリポイントを導入しています。JSX を `React.createElement` に変換する代わりに、**新しい JSX トランスフォーム**は、React パッケージのこれらの新しいエントリポイントから特別な関数を自動的にインポートし、それらを呼び出します。

ソースコードが以下のようになっているとしましょう。

```js
function App() {
  return <h1>Hello World</h1>;
}
```

新しい JSX トランスフォームは、これをこのようなコードにコンパイルします。

```js
// Inserted by a compiler (don't import it yourself!)
import {jsx as _jsx} from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

JSX を使用するために **React をインポートする必要がなくなっている**ことに注意してください！（ただし、React が提供するフックやその他のエクスポートを使用するためには、引き続き React をインポートする必要があります）。

**この変更は、既存のあらゆる JSX コードと完全に互換性があります**ので、あなたのコンポーネントを変更する必要はありません。興味がある方は、新しいトランスフォームがどのように動作するかの詳細について[テクニカル RFC](https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#detailed-design) をチェックしてみてください。

> 補足
>
> `react/jsx-run-time` と `react/jsx-dev-run-time` 内の関数は、コンパイラによるトランスフォーム機能によってのみ使用されなければなりません。コードの中で手動で要素を作成する必要がある場合は、`React.createElement` を使い続けるべきです。これは動作し続けますし、なくなることはありません。

## 新しい JSX トランスフォームへのアップグレード {#how-to-upgrade-to-the-new-jsx-transform}

新しい JSX トランスフォームにアップグレードする準備ができていない場合や、別のライブラリで JSX を使用している場合でも、心配は要りません。古いトランスフォームは削除されず、引き続きサポートされます。

アップグレードしたい場合は、以下の 2 つのものが必要です。

<<<<<<< HEAD
* **新しいトランスフォームをサポートする React のバージョン**（現在は [React 17 RC](/blog/2020/08/10/react-v17-rc.html) のみがサポートしていますが、React 17.0 がリリースされた後、0.14.x, 15.x, 16.x 用にも互換用のリリースを追加で作成する予定です）。
* **互換性のあるコンパイラ**（下記のツールごとの説明を参照）。
=======
* **A version of React that supports the new transform** ([React 17 RC](/blog/2020/08/10/react-v17-rc.html) and higher supports it, but we've also released React 16.14.0, React 15.7.0, and React 0.14.10 for people who are still on the older major versions).
* **A compatible compiler** (see instructions for different tools below).
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

新しい JSX 変換は React をスコープに入れる必要がないので、コードベースから不要なインポートを削除する[自動化スクリプトも用意しました](#removing-unused-react-imports)。

### Create React App {#create-react-app}

Create React App でのサポートは[すでに追加されており](https://github.com/facebook/create-react-app/pull/9645)、現在ベータテスト中の[次期 v4.0 リリース](https://gist.github.com/iansu/4fab7a9bfa5fa6ebc87a908c62f5340b)で利用可能になる予定です。

### Next.js {#nextjs}

Next.js [v9.5.3](https://github.com/vercel/next.js/releases/tag/v9.5.3) 以降、互換性のある React のバージョンに対して新しいトランスフォームを利用します。

### Gatsby {#gatsby}

Gatsby [v2.24.5](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/CHANGELOG.md#22452-2020-08-28) 以降、互換性のある React のバージョンに対して新しいトランスフォームを使用します。

>補足
>
<<<<<<< HEAD
>React `17.0.0-rc.2` にアップグレードした後に[この Gatsby エラー](https://github.com/gatsbyjs/gatsby/issues/26979)が出た場合は、`npm update` を実行することで修正できます。
=======
>If you get [this Gatsby error](https://github.com/gatsbyjs/gatsby/issues/26979) after upgrading to React 17 RC, run `npm update` to fix it.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

### Babel の手動セットアップ {#manual-babel-setup}

新しい JSX トランスフォームのサポートは、Babel [v7.9.0](https://babeljs.io/blog/2020/03/16/7.9.0) 以上で利用可能です。

まず、最新の Babel とトランスフォームプラグインにアップデートする必要があります。

`@babel/plugin-transform-react-jsx` を利用している場合：

```bash
# for npm users
npm update @babel/core @babel/plugin-transform-react-jsx
```

```bash
# for yarn users
yarn upgrade @babel/core @babel/plugin-transform-react-jsx
```

`@babel/preset-react` を利用している場合：

```bash
# for npm users
npm update @babel/core @babel/preset-react
```

```bash
# for yarn users
yarn upgrade @babel/core @babel/preset-react
```

現在のところは以前のトランスフォーム (`"runtime": "classic"`) がデフォルトのオプションです。新しいトランスフォームを有効にするには、`@babel/plugin-transform-react-jsx` ないし `@babel/preset-react` のオプションとして `{"runtime": "automatic"}` を渡してください。

```js
// If you are using @babel/preset-react
{
  "presets": [
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ]
}
```

```js
// If you're using @babel/plugin-transform-react-jsx
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", {
      "runtime": "automatic"
    }]
  ]
}
```

Babel 8 からは、`"automatic"` が両方のプラグインでデフォルトのランタイムとなります。詳細については、Babel ドキュメントの [@babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) と [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react) を参照してください。

> 補足
>
<<<<<<< HEAD
> JSX を React 以外のライブラリで使用している場合、そのライブラリが必要なエントリポイントを提供しているのであれば、[`importSource` オプション](https://babeljs.io/docs/en/babel-preset-react#importsource) を使ってそこからインポートするよう指定することができます。あるいは、引き続きサポートされる旧版のトランスフォームを使い続けることもできます。
=======
> If you use JSX with a library other than React, you can use [the `importSource` option](https://babeljs.io/docs/en/babel-preset-react#importsource) to import from that library instead -- as long as it provides the necessary entry points. Alternatively, you can keep using the classic transform which will continue to be supported.
>
> If you're a library author and you are implementing the `/jsx-runtime` entry point for your library, keep in mind that [there is a case](https://github.com/facebook/react/issues/20031#issuecomment-710346866) in which even the new transform has to fall back to `createElement` for backwards compatibility. In that case, it will auto-import `createElement` directly from the *root* entry point specified by `importSource`.
>>>>>>> 4e6cee1f82737aa915afd87de0cd4a8393de3fc8

### ESLint {#eslint}

[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) を使用している場合、`react/jsx-uses-react` と `react/react-in-jsx-scope` のルールは不要になりますので、無効にするか削除することができます。

```js
{
  // ...
  "rules": {
    // ...
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### TypeScript {#typescript}

TypeScript は新しい JSX トランスフォームを [v4.1 beta](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#jsx-factories) でサポートします。

### Flow {#flow}

Flow は新しい JSX トランスフォームを [v0.126.0](https://github.com/facebook/flow/releases/tag/v0.126.0) およびそれ以降でサポートします。

## 未使用 React インポートの削除 {#removing-unused-react-imports}

新しい JSX トランスフォームは、必要とする `react/jsx-runtime` 関数を自動的にインポートするため、JSX を使用する際に React をスコープに入れる必要がなくなります。これにより、コードの中で React のインポートが未使用となる可能性があります。残しておいても害はありませんが、削除したい場合は ["codemod"](https://medium.com/@cpojer/effective-javascript-codemods-5a6686bb46fb) スクリプトを実行して自動的に行うことをお勧めします。

```bash
cd your_project
npx react-codemod update-react-imports
```

>補足
>
>codemod の実行時にエラーが出る場合は、`npx react-codemod update-react-imports` で別の JavaScript の方言を指定してみてください。特に、現時点では "JavaScript with Flow" の設定は、"JavaScript" の設定よりも新しい構文をサポートしていますので、Flow を使用していない場合でも試してみてください。問題が発生した場合は [issue を報告](https://github.com/reactjs/react-codemod/issues) してください。
>
>また、codemod の出力はあなたのプロジェクトのコーディングスタイルと必ずしも一致はしませんので、一貫したフォーマットにするため codemod の終了後に [Prettier](https://prettier.io/) を実行すると良いかもしれません。


この codemod を実行すると以下のことを行います：

* 新しい JSX トランスフォームにアップグレードした結果使用されなくなる React のインポートをすべて削除します。
* すべての React のデフォルトインポート（すなわち、`import React from "react"`）を、将来的に望ましいスタイルである分割代入型の名前付きインポート（例えば、`import { useState } from "react"`）に変更します。名前空間インポート（つまり、`import * as React from "react"`）も有効な形式ですが、codemod はこれらは変換**しません**。デフォルトインポートは React 17 でも動作し続けますが、長期的にはそれらのインポートを利用しないようにすることを推奨します。

例えば、

```js
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

は、以下に置き換わります：

```js
function App() {
  return <h1>Hello World</h1>;
}
```

他のもの（例えばフック）を React からインポートしている場合は、codemod はそれらを名前付きインポートへと変換します。

例えば、

```js
import React from 'react';

function App() {
  const [text, setText] = React.useState('Hello World');
  return <h1>{text}</h1>;
}
```

は、以下に置き換わります：

```js
import { useState } from 'react';

function App() {
  const [text, setText] = useState('Hello World');
  return <h1>{text}</h1>;
}
```

未使用のインポートをクリーンアップすることに加えて、これは ES Modules をサポートしデフォルトエクスポートを持たない将来のメジャーバージョンの React（React 17 のことではありません）への準備にも役立ちます。

## 謝辞 {#thanks}

新しい JSX トランスフォームの実装と統合を手伝っていただいた Babel、TypeScript、Create React App、Next.js、Gatsby、ESLint および Flow のメンテナの方々に感謝します。また、[テクニカル RFC](https://github.com/reactjs/rfcs/pull/107) においてフィードバックや議論をしていただいた React コミュニティにも感謝します。
