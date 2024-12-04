---
title: "React 19 RC アップグレードガイド"
author: Ricky Hanlon
date: 2024/04/25
description: React 19 に追加された改善にはいくつかの破壊的変更が必要ですが、アップグレードをできるだけスムーズに行えるよう努力しているため、ほとんどのアプリには影響が出ないことを予想しています。この投稿では、アプリやライブラリを React 19 にアップグレードする手順をご案内します。
---

April 25, 2024 by [Ricky Hanlon](https://twitter.com/rickhanlonii)

---


<Intro>

React 19 に追加された改善にはいくつかの破壊的変更が必要ですが、アップグレードをできるだけスムーズに行えるよう努力しているため、ほとんどのアプリには影響が出ないことを予想しています。

</Intro>

<Note>

#### React 18.3 も公開されました {/*react-18-3*/}

React 19 へのアップグレードを容易にするため、`react@18.3` リリースを公開しました。これは 18.2 とほぼ同一ですが、非推奨化 API や React 19 に向けて必要なその他の変更に対する警告が追加されています。

React 19 にアップグレードする前に、問題点を見つけるためにまず React 18.3 にアップグレードすることをお勧めします。

18.3 における変更点については、[リリースノート](https://github.com/facebook/react/blob/main/CHANGELOG.md)をご覧ください。

</Note>

この投稿では、React 19 にアップグレードする手順をご案内します。

- [インストール](#installing)
- [Codemod](#codemods)
- [破壊的変更](#breaking-changes)
- [新たな非推奨化](#new-deprecations)
- [注目すべき変更点](#notable-changes)
- [TypeScript 関連の変更](#typescript-changes)
- [Changelog](#changelog)

React 19 をテストしていただける方は、このアップグレードガイドに従い、遭遇した[問題を報告](https://github.com/facebook/react/issues/new?assignees=&labels=React+19&projects=&template=19.md&title=%5BReact+19%5D)してください。React 19 に追加された新機能のリストについては、[React 19 リリースのお知らせ](/blog/2024/04/25/react-19)をご覧ください。

---
## インストール {/*installing*/}

<Note>

#### 新しい JSX トランスフォームの必須化 {/*new-jsx-transform-is-now-required*/}

2020 年に、バンドルサイズを改善し、React をインポートせずに JSX を使用できるようにするための[新しい JSX トランスフォーム](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)を導入しました。React 19 では、ref を props として使用できるようにしたり JSX の速度を向上させたりといった追加の改善を行っており、これらには新しいトランスフォームが必須です。

新しいトランスフォームが有効になっていない場合、次の警告が表示されます。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform

</ConsoleLogLine>

</ConsoleBlockMulti>


ほとんどの環境ではこのトランスフォームがすでに有効になっているため、ほとんどのアプリは影響を受けないと予想されます。手動でアップグレードする方法については、[告知記事](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)をご覧ください。

</Note>


React と React DOM の最新バージョンをインストールするには以下のようにします。

```bash
npm install --save-exact react@rc react-dom@rc
```

Yarn をお使いの場合は以下のようにします。

```bash
yarn add --exact react@rc react-dom@rc
```

TypeScript を使用している場合は、型も更新する必要があります。React 19 が安定版としてリリースされた後は、通常通り `@types/react` と `@types/react-dom` から型をインストールできます。安定版になるまでは `package.json` で強制的に別のパッケージを指定することで、新しい型を利用できます。

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@rc",
    "@types/react-dom": "npm:types-react-dom@rc"
  },
  "overrides": {
    "@types/react": "npm:types-react@rc",
    "@types/react-dom": "npm:types-react-dom@rc"
  }
}
```

また、最も一般的な書き換えのための codemod も含まれています。下記の [TypeScript 関連の変更](#typescript-changes)を参照してください。

## codemod {/*codemods*/}

アップグレードを支援するため、[codemod.com](https://codemod.com) のチームと協力し、React 19 の新しい API やパターンにコードを自動的に更新するための codemod を公開しました。

すべての codemod は [`react-codemod` リポジトリ](https://github.com/reactjs/react-codemod)で利用可能であり、Codemod チームも codemod の保守に参加しています。これらの codemod を実行するには、`react-codemod` コマンドではなく `codemod` コマンドの使用をお勧めします。こちらのコマンドの方が高速に実行され、複雑なコードの移行を処理でき、TypeScript のサポートもより良好です。


<Note>

#### React 19 関連の codemod をすべて実行 {/*run-all-react-19-codemods*/}

このガイドにある codemode をすべて実行するには React 19 の `codemod` レシピを以下のように実行します。

```bash
npx codemod@latest react/19/migration-recipe
```

これにより以下の `react-codemod` の codemod が実行されます。
- [`replace-reactdom-render`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-reactdom-render) 
- [`replace-string-ref`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-string-ref)
- [`replace-act-import`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-act-import)
- [`replace-use-form-state`](https://github.com/reactjs/react-codemod?tab=readme-ov-file#replace-use-form-state) 
- [`prop-types-typescript`](TODO)

これには TypeScript 関連の変更は含まれていません。以下の [TypeScript 関連の変更](#typescript-changes)を参照してください。

</Note>

変更のうち codemod が利用できるものは以下で紹介されています。

利用可能なすべての codemod の一覧については、[`react-codemod` リポジトリ](https://github.com/reactjs/react-codemod)を参照してください。

## 破壊的変更 {/*breaking-changes*/}

### レンダー中のエラーは再スローされない {/*errors-in-render-are-not-re-thrown*/}

これまでのバージョンの React では、レンダー中にスローされたエラーはキャッチされた後に再スローされていました。開発環境では、`console.error` にもログを出力していたため、エラーログの重複が発生していました。

React 19 では、重複を減らすためにエラーの扱いを[改善し](/blog/2024/04/25/react-19#error-handling)、再スローは行わないようになりました。

- **キャッチされないエラー**：エラーバウンダリによってキャッチされないエラーは `window.reportError` に報告されます。
- **キャッチされたエラー**：エラーバウンダリによってキャッチされたエラーは `console.error` に報告されます。

この変更はほとんどのアプリに影響を与えないはずですが、本番環境におけるエラーレポートシステムが再スローの挙動に依存している場合は、エラー処理を更新する必要があります。これをサポートするために、カスタムのエラー処理を行うための新しい手段を `createRoot` と `hydrateRoot` に追加しました。

```js [[1, 2, "onUncaughtError"], [2, 5, "onCaughtError"]]
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    // ... log error report
  },
  onCaughtError: (error, errorInfo) => {
    // ... log error report
  }
});
```

詳細は、[`createRoot`](https://react.dev/reference/react-dom/client/createRoot) と [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) のドキュメントを参照してください。


### 非推奨化 React API の削除 {/*removed-deprecated-react-apis*/}

#### 廃止：関数コンポーネントの `propTypes` と `defaultProps` {/*removed-proptypes-and-defaultprops*/}
`PropTypes` は [2017 年 4 月 (v15.5.0)](https://legacy.reactjs.org/blog/2017/04/07/react-v15.5.0.html#new-deprecation-warnings) に非推奨化されました。

React 19 では、React パッケージから `propTypes` チェックが削除されており、使用しても無視されるようになります。`propTypes` を使用している場合は、TypeScript または他の型チェックソリューションへの移行をお勧めします。

また、関数コンポーネントから `defaultProps` を削除します。ES6 のデフォルトパラメータを代わりに使用してください。クラスコンポーネントでは ES6 による代替手段がないため、`defaultProps` を引き続きサポートします。

```js
// Before
import PropTypes from 'prop-types';

function Heading({text}) {
  return <h1>{text}</h1>;
}
Heading.propTypes = {
  text: PropTypes.string,
};
Heading.defaultProps = {
  text: 'Hello, world!',
};
```
```ts
// After
interface Props {
  text?: string;
}
function Heading({text = 'Hello, world!'}: Props) {
  return <h1>{text}</h1>;
}
```

<Note>

codemod で以下のように `propTypes` を TypeScript に変換できます。

```bash
npx codemod@latest react/prop-types-typescript
```

</Note>

#### 廃止：`contextTypes` と `getChildContext` を使用したレガシーコンテクスト {/*removed-removing-legacy-context*/}

レガシーコンテクストは [2018 年 10 月 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html) に非推奨化されました。

レガシーコンテクストは、`contextTypes` と `getChildContext` を使用するクラスコンポーネントでのみ利用可能であり、見逃しやすい微妙なバグのため、のちに `contextType` に置き換えられました。React 19 では、React を少し小さく、速くするためにレガシーコンテクストを削除しています。

クラスコンポーネントでまだレガシーコンテクストを使用している場合、新しい `contextType` API に移行する必要があります。

```js {5-11,19-21}
// Before
import PropTypes from 'prop-types';

class Parent extends React.Component {
  static childContextTypes = {
    foo: PropTypes.string.isRequired,
  };

  getChildContext() {
    return { foo: 'bar' };
  }

  render() {
    return <Child />;
  }
}

class Child extends React.Component {
  static contextTypes = {
    foo: PropTypes.string.isRequired,
  };

  render() {
    return <div>{this.context.foo}</div>;
  }
}
```

```js {2,7,9,15}
// After
const FooContext = React.createContext();

class Parent extends React.Component {
  render() {
    return (
      <FooContext value='bar'>
        <Child />
      </FooContext>
    );
  }
}

class Child extends React.Component {
  static contextType = FooContext;

  render() {
    return <div>{this.context}</div>;
  }
}
```

#### 削除：文字列形式の ref {/*removed-string-refs*/}
文字列形式の ref は [2018 年 3 月 (v16.3.0)](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html) に非推奨化されました。

[いくつかの問題](https://github.com/facebook/react/issues/1373)のためコールバック形式の ref に置き換えられるまで、クラスコンポーネントは文字列形式の ref をサポートしていました。React 19 では、React をよりシンプルで理解しやすくするため、文字列形式の ref を削除します。

クラスコンポーネントでまだ文字列形式の ref を使用している場合は、コールバック形式の ref に移行する必要があります。

```js {4,8}
// Before
class MyComponent extends React.Component {
  componentDidMount() {
    this.refs.input.focus();
  }

  render() {
    return <input ref='input' />;
  }
}
```

```js {4,8}
// After
class MyComponent extends React.Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    return <input ref={input => this.input = input} />;
  }
}
```

<Note>

codemod で以下のように文字列形式の ref をコールバック形式の `ref` に変換できます。

```bash
npx codemod@latest react/19/replace-string-ref
```

</Note>

#### 削除：モジュールパターンファクトリ {/*removed-module-pattern-factories*/}
モジュールパターンファクトリは [2019 年 8 月 (v16.9.0)](https://legacy.reactjs.org/blog/2019/08/08/react-v16.9.0.html#deprecating-module-pattern-factories) に非推奨化されました。

このパターンはほとんど使用されておらず、サポートすることで React がわずかに大きく、遅くなる原因となっています。React 19 ではモジュールパターンファクトリのサポートが削除されており、通常の関数に移行する必要があります。

```js
// Before
function FactoryComponent() {
  return { render() { return <div />; } }
}
```

```js
// After
function FactoryComponent() {
  return <div />;
}
```

#### 削除：`React.createFactory` {/*removed-createfactory*/}
`createFactory` は [2020 年 2 月 (v16.13.0)](https://legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html#deprecating-createfactory) に非推奨化されました。

JSX が広範にサポートされる以前は `createFactory` の使用が一般的でしたが、今ではほとんど使用されておらず、JSX に置き換えることができます。React 19 では `createFactory` が削除されており、JSX に移行する必要があります。

```js
// Before
import { createFactory } from 'react';

const button = createFactory('button');
```

```js
// After
const button = <button />;
```

#### 削除：`react-test-renderer/shallow` {/*removed-react-test-renderer-shallow*/}

React 18 において、`react-test-renderer/shallow` を更新して [react-shallow-renderer](https://github.com/enzymejs/react-shallow-renderer) を再エクスポートするようにしていました。React 19 では、`react-test-render/shallow` が削除されており、代わりにこのパッケージを直接インストールするようになります。

```bash
npm install react-shallow-renderer --save-dev
```
```diff
- import ShallowRenderer from 'react-test-renderer/shallow';
+ import ShallowRenderer from 'react-shallow-renderer';
```

<Note>

##### シャローレンダリングの再考を {/*please-reconsider-shallow-rendering*/}

シャローレンダリングは React の内部構造に依存しており、将来のアップグレードの妨げとなる可能性があります。テストを [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) や [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro) に移行することをお勧めします。

</Note>

### 非推奨化 React DOM API の削除 {/*removed-deprecated-react-dom-apis*/}

#### 削除：`react-dom/test-utils` {/*removed-react-dom-test-utils*/}

`act` を `react-dom/test-utils` から `react` パッケージに移動しました。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

`ReactDOMTestUtils.act` is deprecated in favor of `React.act`. Import `act` from `react` instead of `react-dom/test-utils`. See https://react.dev/warnings/react-dom-test-utils for more info.

</ConsoleLogLine>

</ConsoleBlockMulti>

この警告を修正するには、`act` を `react` からインポートするようにします。

```diff
- import {act} from 'react-dom/test-utils'
+ import {act} from 'react';
```

その他の `test-utils` 関数はすべて削除されました。これらのユーティリティは一般的ではなく、コンポーネントや React の低レベルな内部実装の詳細へ依存しやすくなってしまうものでした。React 19 でこれらの関数を呼び出すとエラーとなります。将来のバージョンではエクスポートが削除されます。

代替手段については、[警告ページ](https://react.dev/warnings/react-dom-test-utils)をご覧ください。

<Note>

codemod で以下のように `ReactDOMTestUtils.act` を `React.act` に変換できます。

```bash
npx codemod@latest react/19/replace-act-import
```

</Note>

#### 削除：`ReactDOM.render` {/*removed-reactdom-render*/}

`ReactDOM.render` は [2022 年 3 月 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) に非推奨化されました。React 19 では `ReactDOM.render` が削除されており、[`ReactDOM.createRoot`](https://react.dev/reference/react-dom/client/createRoot) を使用するよう移行する必要があります。

```js
// Before
import {render} from 'react-dom';
render(<App />, document.getElementById('root'));

// After
import {createRoot} from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

<Note>

codemod で以下のように `ReactDOM.render` を `ReactDOMClient.createRoot` に変換できます。

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### 削除：`ReactDOM.hydrate` {/*removed-reactdom-hydrate*/}

`ReactDOM.hydrate` は [2022 年 3 月 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) に非推奨化されました。React 19 では `ReactDOM.hydrate` が削除されており、[`ReactDOM.hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot) を使用するよう移行する必要があります。

```js
// Before
import {hydrate} from 'react-dom';
hydrate(<App />, document.getElementById('root'));

// After
import {hydrateRoot} from 'react-dom/client';
hydrateRoot(document.getElementById('root'), <App />);
```

<Note>

codemod で以下のように `ReactDOM.hydrate` を `ReactDOMClient.hydrateRoot` に変換できます。

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### 削除：`unmountComponentAtNode` {/*removed-unmountcomponentatnode*/}

`ReactDOM.unmountComponentAtNode` は [2022 年 3 月 (v18.0.0)](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) に非推奨化されました。React 19 では、`root.unmount()` を使用するよう移行する必要があります。


```js
// Before
unmountComponentAtNode(document.getElementById('root'));

// After
root.unmount();
```

詳細については、[`createRoot`](https://react.dev/reference/react-dom/client/createRoot#root-unmount) と [`hydrateRoot`](https://react.dev/reference/react-dom/client/hydrateRoot#root-unmount) の `root.unmount()` をご覧ください。

<Note>

codemod で以下のように `unmountComponentAtNode` を `root.unmount` に変換できます。

```bash
npx codemod@latest react/19/replace-reactdom-render
```

</Note>

#### 削除：`ReactDOM.findDOMNode` {/*removed-reactdom-finddomnode*/}

`ReactDOM.findDOMNode` は [2018 年 10 月 (v16.6.0)](https://legacy.reactjs.org/blog/2018/10/23/react-v-16-6.html#deprecations-in-strictmode) に非推奨化されました。

`findDOMNode` はレガシーな避難ハッチであり、実行速度が遅く、リファクタリングが困難で、最初の子要素しか返せず、抽象化レイヤーを破壊するといった問題があるため（詳細は[こちら](https://legacy.reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)）、削除されます。`ReactDOM.findDOMNode` は [DOM 用の ref](/learn/manipulating-the-dom-with-refs) で置き換えることができます。

```js
// Before
import {findDOMNode} from 'react-dom';

function AutoselectingInput() {
  useEffect(() => {
    const input = findDOMNode(this);
    input.select()
  }, []);

  return <input defaultValue="Hello" />;
}
```

```js
// After
function AutoselectingInput() {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.select();
  }, []);

  return <input ref={ref} defaultValue="Hello" />
}
```

## 新たな非推奨化 {/*new-deprecations*/}

### 非推奨化：`element.ref` {/*deprecated-element-ref*/}

React 19 では [props としての `ref`](/blog/2024/04/25/react-19#ref-as-a-prop) がサポートされるため、`element.ref` を非推奨化します。代わりに `element.props.ref` を使用します。

`element.ref` にアクセスすると、以下の警告が表示されます。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Accessing element.ref is no longer supported. ref is now a regular prop. It will be removed from the JSX Element type in a future release.

</ConsoleLogLine>

</ConsoleBlockMulti>

### 非推奨化：`react-test-renderer` {/*deprecated-react-test-renderer*/}

`react-test-renderer` を非推奨化します。これはユーザが使用する環境とは異なる独自のレンダラ環境を実装しており、内部実装の詳細に対するテストを助長し、React 内部の構造に依存するものだからです。

このテストレンダラは、[React Testing Library](https://testing-library.com) のようなより実用的なテスト戦略が利用可能になる前に作成されたものです。現在では、モダンなテストライブラリの使用が推奨されます。

React 19 では、`react-test-renderer` は非推奨警告をログに記録するようになり、また並行レンダーに切り替わりました。モダンかつよりよくサポートされたテスト体験のためには、テストを [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) または [@testing-library/react-native](https://testing-library.com/docs/react-native-testing-library/intro) に移行することを推奨します。

## 注目すべき変更点 {/*notable-changes*/}

### StrictMode の変更点 {/*strict-mode-improvements*/}

React 19 には、Strict Mode に関するいくつかの修正と改善が含まれています。

開発中に Strict Mode で二重レンダーが発生した際、`useMemo` と `useCallback` は 1 回目のレンダー時にメモ化された結果を 2 回目のレンダーで再利用します。既に Strict Mode に対応しているコンポーネントでは、挙動に違いを感じることはないはずです。

すべての Strict Mode の挙動と同様、これらの機能は開発中にコンポーネントのバグを積極的に目立たせて、本番環境にリリースされる前に修正できるよう設計されています。例えば、開発環境において Strict Mode は初回マウント時に ref コールバック関数を 2 回呼び出すことで、マウントされたコンポーネントがサスペンスフォールバックに置き換えられたときに何が起こるかをシミュレートします。

<<<<<<< HEAD
### UMD ビルドの削除 {/*umd-builds-removed*/}
=======
### Improvements to Suspense {/*improvements-to-suspense*/}

In React 19, when a component suspends, React will immediately commit the fallback of the nearest Suspense boundary without waiting for the entire sibling tree to render. After the fallback commits, React schedules another render for the suspended siblings to "pre-warm" lazy requests in the rest of the tree:

<Diagram name="prerender" height={162} width={1270} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

Previously, when a component suspended, the suspended siblings were rendered and then the fallback was committed.

</Diagram>

<Diagram name="prewarm" height={162} width={1270} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

In React 19, when a component suspends, the fallback is committed and then the suspended siblings are rendered.

</Diagram>

This change means Suspense fallbacks display faster, while still warming lazy requests in the suspended tree.

### UMD builds removed {/*umd-builds-removed*/}
>>>>>>> 84f29eb20af17e9c154b9ad71c21af4c9171e4a2

UMD は過去には、ビルドステップなしで React を読み込むための便利な方法として広く使用されていました。現在では、HTML ドキュメント内でスクリプトとしてモジュールをロードするためのモダンな代替手段があります。テストとリリースプロセスの複雑性を軽減するため、React 19 からは UMD ビルドを生成しなくなります。

script タグで React 19 をロードしたい場合は、[esm.sh](https://esm.sh/) などの ESM ベースの CDN を使用することを推奨します。

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  ...
</script>
```

### React の内部構造に依存するライブラリはアップグレードできない原因となる {/*libraries-depending-on-react-internals-may-block-upgrades*/}

本リリースには、`SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` のような内部構造を使用しないようにという私たちのお願いを無視しているライブラリに影響を与える可能性のある React 内部構造の変更が含まれています。これらの変更は React 19 における改善を実現するために必要なものであり、ガイドラインに従っているライブラリには影響を与えません。

私たちの[バージョニングポリシー](https://react.dev/community/versioning-policy#what-counts-as-a-breaking-change)に基づき、このような更新は破壊的変更としてリストされませんし、アップグレード方法に関するドキュメントも提供されません。内部実装に依存するコードを削除することを推奨します。

内部構造を使用する影響を反映するために、`SECRET_INTERNALS` という接尾辞を以下のように変更します。

`_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`

将来的には、React の内部構造へのアクセスをより積極的にブロックすることで使用を抑制し、ユーザのアップグレードの妨げとならないようにする予定です。

## TypeScript 関連の変更 {/*typescript-changes*/}

### 非推奨化 TypeScript 型を削除 {/*removed-deprecated-typescript-types*/}

React 19 で削除された API に基づいて、TypeScript の型を整理しました。削除された型の一部は、より関連性の高いパッケージに移動され、他の型はもはや React の挙動を記述するために必要がなくなりました。

<Note>
型関連の破壊的変更に関する移行のために、[`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) を公開しました。

```bash
npx types-react-codemod@latest preset-19 ./path-to-app
```

`element.props` への型安全ではないアクセスを多く行っている場合、以下の追加の codemod を実行できます。

```bash
npx types-react-codemod@latest react-element-default-any-props ./path-to-your-react-ts-files
```

</Note>

サポートされている書き換えのリストについては、[`types-react-codemod`](https://github.com/eps1lon/types-react-codemod/) をご覧ください。codemod が不足していると感じた場合は、[React 19 で不足している codemod のリスト](https://github.com/eps1lon/types-react-codemod/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22React+19%22+label%3Aenhancement)で追跡できます。


### `ref` クリーンアップの必須化 {/*ref-cleanup-required*/}

_この変更は、`react-19` の codemod プリセットに [`no-implicit-ref-callback-return`](https://github.com/eps1lon/types-react-codemod/#no-implicit-ref-callback-return) として含まれています。_


ref クリーンアップ関数の導入により、ref コールバックから何か他のものを返すと、TypeScript によって拒否されるようになります。通常、修正は、暗黙の return の使用をやめることです。

```diff [[1, 1, "("], [1, 1, ")"], [2, 2, "{", 15], [2, 2, "}", 1]]
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```

元のコードは `HTMLDivElement` のインスタンスを返していますが、TypeScript はこれがクリーンアップ関数のつもりで書かれたものかどうかを判断できません。

### `useRef` の引数の必須化 {/*useref-requires-argument*/}

_この変更は、`react-19` のコードモッドプリセットに [`refobject-defaults`](https://github.com/eps1lon/types-react-codemod/#refobject-defaults) として含まれています。_

TypeScript と React の動作に関する長年の不満のひとつが `useRef` でした。今後 `useRef` には引数が必須になるよう型を変更することにしました。これにより、型シグネチャが大幅に簡素化されます。これで、`createContext` と同様に動作するようになります。

```ts
// @ts-expect-error: Expected 1 argument but saw none
useRef();
// Passes
useRef(undefined);
// @ts-expect-error: Expected 1 argument but saw none
createContext();
// Passes
createContext(undefined);
```

これにより、すべての ref はミュータブルになります。`null` で初期化したために ref を変更できない、という問題で困ることはなくなるでしょう。

```ts
const ref = useRef<number>(null);

// Cannot assign to 'current' because it is a read-only property
ref.current = 1;
```

`MutableRef` は廃止され、`useRef` は常に単一の `RefObject` 型を返すようになりました。

```ts
interface RefObject<T> {
  current: T
}

declare function useRef<T>: RefObject<T>
```

`useRef` には便宜上のオーバーロードがまだ存在し、`useRef<T>(null)` は自動的に `RefObject<T | null>` を返すようになっています。`useRef` の引数必須化に対する移行を容易にするために、`useRef(undefined)` に対する実用的なオーバーロードが追加され、自動的に `RefObject<T | undefined>` 型を返すようになります。

この変更についてのこれまでの議論は、[[RFC] Make all refs mutable](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/64772) をご覧ください。

### `ReactElement` TypeScript 型の変更 {/*changes-to-the-reactelement-typescript-type*/}

_この変更は [`react-element-default-any-props`](https://github.com/eps1lon/types-react-codemod#react-element-default-any-props) codemod に含まれています。_

React 要素が `ReactElement` として型付けされている場合、その `props` のデフォルトの型は `any` ではなく `unknown` になります。`ReactElement` に型引数を渡している場合は、影響を受けません。

```ts
type Example2 = ReactElement<{ id: string }>["props"];
//   ^? { id: string }
```

しかし、このデフォルトの型に依存していた場合、`unknown` を扱うようにする必要があります。

```ts
type Example = ReactElement["props"];
//   ^? Before, was 'any', now 'unknown'
```

要素の props に対する型安全でないアクセスに依存している古いコードが多くある場合にのみ、これが必要です。要素の内部構造の参照は避難ハッチとしてのみ存在しており、props に安全でないアクセスを行う場合には、`any` を明示的に用いてそうであると明示するべきです。

### TypeScript における JSX 名前空間 {/*the-jsx-namespace-in-typescript*/}
この変更は `react-19` codemod プリセットに [`scoped-jsx`](https://github.com/eps1lon/types-react-codemod#scoped-jsx) として含まれています。

グローバルな `JSX` 名前空間を型から削除して `React.JSX` に置き換えるというのは長い間の要望でした。これにより、グローバル型の汚染を防ぎ、JSX を利用する異なる UI ライブラリ間での競合が防止できます。

これからは、JSX 名前空間のモジュール拡張 (module augumentation) は `declare module "....":` でラップする必要があります。

```diff
// global.d.ts
+ declare module "react" {
    namespace JSX {
      interface IntrinsicElements {
        "my-element": {
          myElementProps: string;
        };
      }
    }
+ }
```

正確なモジュール指定子は、`tsconfig.json` の `compilerOptions` で指定した JSX ランタイムに依存します。

- `"jsx": "react-jsx"` の場合は `react/jsx-runtime` です。
- `"jsx": "react-jsxdev"` の場合は `react/jsx-dev-runtime` です。
- `"jsx": "react"` および `"jsx": "preserve"` の場合は `react` です。

### `useReducer` の型の改善 {/*better-usereducer-typings*/}

[@mfp22](https://github.com/mfp22) の協力により、`useReducer` の型推論が改善されました。

しかしこれには、`useReducer` がリデューサ全体の型を型パラメータとして受け取る代わりに、型を全く渡さない（型推論に任せる）か、もしくは state の型とアクションの型を両方渡すかのいずれかにする必要がある、という破壊的変更が必要でした。

新しいベストプラクティスは、`useReducer` に型引数を渡さないことです。
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer(reducer)
```
これは一部の稀なケースでは機能しないかもしれませんが、その場合は state とアクションを明示的に型付けしつつ、`Action` をタプルで渡すことで解決できます。
```diff
- useReducer<React.Reducer<State, Action>>(reducer)
+ useReducer<State, [Action]>(reducer)
```
リデューサをインラインで定義する場合は、関数パラメータに型注釈を付けることをお勧めします。
```diff
- useReducer<React.Reducer<State, Action>>((state, action) => state)
+ useReducer((state: State, action: Action) => state)
```
これは、`useReducer` 呼び出しの外にリデューサを移動する場合にも行うべきでしょう。

```ts
const reducer = (state: State, action: Action) => state;
```

## Changelog {/*changelog*/}

### その他の破壊的変更 {/*other-breaking-changes*/}

- **react-dom**: src/href での JavaScript URL に対するエラー [#26507](https://github.com/facebook/react/pull/26507)
- **react-dom**: `onRecoverableError` から `errorInfo.digest` を削除 [#28222](https://github.com/facebook/react/pull/28222)
- **react-dom**: `unstable_flushControlled` を削除 [#26397](https://github.com/facebook/react/pull/26397)
- **react-dom**: `unstable_createEventHandle` を削除 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_renderSubtreeIntoContainer` を削除 [#28271](https://github.com/facebook/react/pull/28271)
- **react-dom**: `unstable_runWithPrioirty` を削除 [#28271](https://github.com/facebook/react/pull/28271)
- **react-is**: `react-is` から非推奨のメソッドを削除 [28224](https://github.com/facebook/react/pull/28224)

### その他の注目すべき変更点 {/*other-notable-changes*/}

- **react**: 同期・デフォルト・連続レーンのバッチ処理 [#25700](https://github.com/facebook/react/pull/25700)
- **react**: サスペンドされたコンポーネントの兄弟を事前レンダーしない [#26380](https://github.com/facebook/react/pull/26380)
- **react**: レンダーフェーズでの更新によって引き起こされる無限更新ループを検出 [#26625](https://github.com/facebook/react/pull/26625)
- **react-dom**: popstate でのトランジションを同期的に [#26025](https://github.com/facebook/react/pull/26025)
- **react-dom**: SSR 中のレイアウトエフェクト警告を削除 [#26395](https://github.com/facebook/react/pull/26395)
- **react-dom**: src/href に空文字列を設定しないよう警告（アンカータグを除く）[#28124](https://github.com/facebook/react/pull/28124)

React 19 の安定版リリース時に、完全な変更履歴を公開します。

---

この投稿のレビューと編集に協力してくれた [Andrew Clark](https://twitter.com/acdlite)、[Eli White](https://twitter.com/Eli_White)、[Jack Pope](https://github.com/jackpope)、[Jan Kassens](https://github.com/kassens)、[Josh Story](https://twitter.com/joshcstory)、[Matt Carroll](https://twitter.com/mattcarrollcode)、[Noah Lemen](https://twitter.com/noahlemen)、[Sophie Alpert](https://twitter.com/sophiebits)、そして [Sebastian Silbermann](https://twitter.com/sebsilbermann) に感謝します。
