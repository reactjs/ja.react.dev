---
title: React Compiler
---

<Intro>
このページでは、新しい実験的プロジェクトである React Compiler の概要と、試用の方法について説明します。
</Intro>

<Wip>
このドキュメントはまだ作成中です。詳細なドキュメントは [React Compiler Working Group リポジトリ](https://github.com/reactwg/react-compiler/discussions)にあり、安定化後にこちらのドキュメントに反映されます。
</Wip>

<YouWillLearn>

* コンパイラを使い始める
* コンパイラと eslint プラグインのインストール
* トラブルシューティング

</YouWillLearn>

<Note>
React Compiler は実験的なコンパイラであり、コミュニティから早期フィードバックを得るためにオープンソース化したものです。まだ粗削りな部分があり、本番環境で使用できる準備は整っていません。

React Compiler の使用には React 19 RC が必要です。React 19 にアップグレードできない場合は、[Working Group](https://github.com/reactwg/react-compiler/discussions/6) で説明されているように、キャッシュ関数に対するユーザスペースの実装を試すことができます。ただしこれは推奨されておらず、可能な限り React 19 にアップグレードするべきです。
</Note>

React Compiler は実験的なコンパイラであり、コミュニティから早期フィードバックを得るためにオープンソース化したものです。これはビルド時のみに実行されるツールであり、あなたの React アプリを自動的に最適化します。プレーンな JavaScript で動作し、[React のルール](/reference/rules)を理解しているため、コードを書き直す必要はありません。

コンパイラには、コンパイラの分析結果をエディタ内でその場で表示できる [eslint プラグイン](#installing-eslint-plugin-react-compiler) も含まれています。このプラグインはコンパイラとは独立して動作し、アプリでコンパイラを使用していなくても利用できます。すべての React 開発者に、この eslint プラグインを使用してコードベースの品質向上を図ることをお勧めします。

### コンパイラは何をするのか {/*what-does-the-compiler-do*/}

アプリケーションを最適化するために、React Compiler は自動的にコードをメモ化します。現在皆さんは、`useMemo`、`useCallback`、`React.memo` などの API を使ったメモ化に慣れているかもしれません。これらの API を使用することで、入力が変更されていない場合にアプリケーションの特定部分を再計算する必要がないということを React に伝え、更新時の作業を減らすことができます。強力な機能ですが、いとも簡単にメモ化を適用し忘れたり、誤って適用したりしてしまいます。こうなると、意味のある変化がない部分の UI についても React がチェックしなければならないため、非効率的な更新が発生してしまう可能性があります。

このコンパイラは、JavaScript と React のルールに関する知識を使用して、コンポーネントやフック内にある値や値のグループを、自動的にメモ化します。ルールが守られていない部分を検出した場合、該当のコンポーネントやフックだけを自動的にスキップし、他のコードを安全にコンパイルし続けます。

コードベースがすでに非常によくメモ化されている場合、コンパイラによる大きなパフォーマンス向上は期待できないかもしれません。しかし現実的には、パフォーマンス問題を引き起こす依存値を手動で正しくメモ化していくのは困難です。

<DeepDive>
#### React Compiler が行うメモ化の種類 {/*what-kind-of-memoization-does-react-compiler-add*/}

React Compiler の初期リリースでは、主に**更新（既存コンポーネントの再レンダー）時のパフォーマンスの向上**に焦点を当てており、以下の 2 つのユースケースに重点を置いています。

1. **コンポーネントの連鎖的な再レンダーのスキップ**
    * `<Parent />` を再レンダーすると、実際には `<Parent />` そのものしか変更されていないにも関わらず、コンポーネントツリー内の多くのコンポーネントが再レンダーされる
1. **React 外での高コストな計算のスキップ**
    * 例えば、コンポーネントやフック内で `expensivelyProcessAReallyLargeArrayOfObjects()` を呼び出してこのデータを取り出している

#### 再レンダーの最適化 {/*optimizing-re-renders*/}

React では、UI を現在の状態（具体的には props、state、コンテクスト）に対する関数として表現できます。現在の実装では、コンポーネントの state が変わると、React はそのコンポーネント*およびそのすべての子コンポーネント*を再レンダーします。`useMemo()`、`useCallback()`、または `React.memo()` を使用して手動でメモ化を適用していなければ、そうなります。例えば、次の例では、`<FriendList>` の state が変わるたびに、`<MessageButton>` が再レンダーされます。

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_React Compiler Playground でこの例を見る_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler は手動によるメモ化と同等の処理を自動的に適用し、state の変化に応じてアプリの関連部分のみが再レンダーされるようにします。これは「細粒度リアクティビティ (fine-grained reactivity)」と呼ばれることもあります。上記の例では、React Compiler は `<FriendListCard />` の返り値は `friends` が変わっても再利用できると判断し、この JSX の再作成*および* `count` が変わるときの `<MessageButton>` の再レンダーを回避できます。

#### 高コストな計算もメモ化される {/*expensive-calculations-also-get-memoized*/}

コンパイラは、レンダー中に使用される高コストな計算も自動的にメモ化できます。

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_React Compiler Playground でこの例を見る_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

ただし、`expensivelyProcessAReallyLargeArrayOfObjects` が本当に高コストな関数である場合は、React の外部で独自のメモ化を実装することを検討すべきかもしれません。

- React Compiler は React コンポーネントとフックのみをメモ化し、すべての関数をメモ化するわけではない
- React Compiler のメモ化は複数のコンポーネントやフック間で共有されない

従って、`expensivelyProcessAReallyLargeArrayOfObjects` が多くの異なるコンポーネントで使用されている場合、同じ items が渡されたとしても、高コストな計算が繰り返し実行さることになります。コードを複雑化する前に、まずは[プロファイリング](https://react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive)して、それが本当に高コストかどうかを確認することをお勧めします。
</DeepDive>

### コンパイラが前提としていること {/*what-does-the-compiler-assume*/}

React Compiler は、あなたのコードが以下ようになっていることを仮定します。

1. 有効でセマンティックな JavaScript であること。
2. nullable ないし省略可能な値について（例えば、TypeScript を使用している場合は [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) を使うなどで）チェックを行っていること。つまり `if (object.nullableProperty) { object.nullableProperty.foo }` とするか、オプショナルチェーンを使用して `object.nullableProperty?.foo` のようにしていること。
3. [React のルール](https://react.dev/reference/rules)に従っていること。

React Comiler は多くの React のルールを静的に検証でき、エラーを検出した場合は安全にコンパイルをスキップします。エラーを確認するために、[eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler) のインストールもお勧めします。

### コンパイラを試すべきか {/*should-i-try-out-the-compiler*/}

コンパイラはまだ実験的であり、多くの粗削りな部分があります。Meta のような企業で本番環境で使用されてはいますが、アプリにコンパイラを本番導入すべきかどうかは、コードベースの健全性と [React のルール](/reference/rules)にどれだけ従っているかに依存します。

**今すぐコンパイラを使用する必要はありません。安定版リリースを待ってから採用しても構いません**。ただし、アプリで小規模な実験として試してみて、[フィードバック](#reporting-issues)を提供していただれば、コンパイラの改善に役立ちます。

## スタートガイド {/*getting-started*/}

以下のドキュメントに加えて、コンパイラに関する追加情報やディスカッションについて [React Compiler Working Group](https://github.com/reactwg/react-compiler) を確認することをお勧めします。

### 互換性の確認 {/*checking-compatibility*/}

コンパイラをインストールする前に、まずコードベースが互換性があるかどうかを確認してください。

<TerminalBlock>
npx react-compiler-healthcheck@experimental
</TerminalBlock>

このスクリプトは以下をチェックします。

- どれだけ多くのコンポーネントが正常に最適化できるか：多いほど良い
- `<StrictMode>` の使用：これを有効にして指示に従っている場合、[React のルール](/reference/rules)に従っている可能性が高い
- 非互換ライブラリの使用：コンパイラと互換性がないことが既知のライブラリ

以下は実行例です。

<TerminalBlock>
Successfully compiled 8 out of 9 components.
StrictMode usage not found.
Found no usage of incompatible libraries.
</TerminalBlock>

### eslint-plugin-react-compiler のインストール {/*installing-eslint-plugin-react-compiler*/}

React Compiler は eslint プラグインも提供しています。eslint プラグインはコンパイラとは**独立して**使用できるため、コンパイラを使用しなくても eslint プラグインだけを使用できます。

<TerminalBlock>
npm install eslint-plugin-react-compiler@experimental
</TerminalBlock>

次に、eslint の設定に以下を追加します。

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': "error",
  },
}
```

eslint プラグインは、エディタ内で React のルールに関する違反を表示します。これが表示される場合、そのコンポーネントやフックの最適化をコンパイラがスキップしたということを意味します。これ自体は全く問題なく、コンパイラは他のコンポーネントの最適化を続けることができます。

**すべての eslint の違反をすぐに修正する必要はありません**。ルール違反を自分のペースで修正しつつ、最適化されるコンポーネントやフックの数を徐々に増やしていくことができます。コンパイラを使用する前にすべてを修正する必要はありません。

### コンパイラをコードベースに展開する {/*using-the-compiler-effectively*/}

#### 既存のプロジェクト {/*existing-projects*/}
コンパイラは、[React のルール](/reference/rules)に従う関数コンポーネントやフックをコンパイルするように設計されています。また、これらのルールを破っているコードもバイパス（スキップ）することで処理できます。しかし、JavaScript の柔軟性のため、コンパイラはすべての違反を検出することはできません。偽陰性、つまりルールを破っているコンポーネントやフックを見逃して誤ってコンパイルしてしまい、未定義の動作が発生する可能性があります。

このため、既存のプロジェクトでコンパイラをうまく導入するには、まず本番コードのうちの小さなディレクトリで実行することをお勧めします。そのためには、特定のディレクトリの組み合わせでのみコンパイラを実行するように設定します。

```js {3}
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```

稀なケースですが、`compilationMode: "annotation"` のオプションを使用してコンパイラを「オプトイン」モードで実行するように設定することもできます。これにより、`"use memo"` ディレクティブでラベル付けされたコンポーネントやフックのみがコンパイルされるようになります。`annotation` モードはアーリーアダプタを補助するための一時的なものであり、`"use memo"` ディレクティブを長期的に使用することは意図していないことに注意してください。

```js {2,7}
const ReactCompilerConfig = {
  compilationMode: "annotation",
};

// src/app.jsx
export default function App() {
  "use memo";
  // ...
}
```

コンパイラの本番採用に自信がついたら、他のディレクトリにも適用範囲を拡大していき、アプリ全体に徐々に展開していくことができます。

#### 新規プロジェクト {/*new-projects*/}

新しいプロジェクトを開始する場合、コードベース全体でコンパイラを有効化できます。これがデフォルトの動作です。

## 使用法 {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler@experimental
</TerminalBlock>

コンパイラには、ビルドパイプラインでコンパイラを実行するために使用できる Babel プラグインが含まれています。

インストール後、プラグインを Babel の設定に追加します。コンパイラがパイプライン内で**最初に**実行されることが重要です。

```js {7}
// babel.config.js
const ReactCompilerConfig = { /* ... */ };

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // must run first!
      // ...
    ],
  };
};
```

`babel-plugin-react-compiler` は、他の Babel プラグインより前に、最初に実行される必要があります。コンパイラは、正確な解析のために入力ソース情報を必要とするためです。

### Vite {/*usage-with-vite*/}

Vite を使用する場合、vite-plugin-react にプラグインを追加できます。

```js {10}
// vite.config.js
const ReactCompilerConfig = { /* ... */ };

export default defineConfig(() => {
  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    // ...
  };
});
```

### Next.js {/*usage-with-nextjs*/}

Next.js には React Compiler を有効にするための実験的な設定があります。これにより、Babel が `babel-plugin-react-compiler` と共に自動的にセットアップされます。

- React 19 Release Candidate を使用する Next.js canary をインストールする
- `babel-plugin-react-compiler` をインストールする

<TerminalBlock>
npm install next@canary babel-plugin-react-compiler@experimental
</TerminalBlock>

次に以下のようにして `next.config.js` 内で実験的オプションを設定します。

```js {4,5,6}
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

この実験的オプションを使用ことで、以下で React Compiler がサポートされるようになります。

- App Router
- Pages Router
- Webpack（デフォルト）
- Turbopack（`--turbo` を通じてオプトイン）


### Remix {/*usage-with-remix*/}
`vite-plugin-babel` をインストールし、コンパイラ付属の Babel プラグインを追加します。

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {2,14}
// vite.config.js
import babel from "vite-plugin-babel";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    remix({ /* ... */}),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [
          ["babel-plugin-react-compiler", ReactCompilerConfig],
        ],
      },
    }),
  ],
});
```

### Webpack {/*usage-with-webpack*/}

React Compiler 用の独自のローダは、以下のようにして作成できます。

```js
const ReactCompilerConfig = { /* ... */ };
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');

function reactCompilerLoader(sourceCode, sourceMap) {
  // ...
  const result = transformSync(sourceCode, {
    // ...
    plugins: [
      [BabelPluginReactCompiler, ReactCompilerConfig],
    ],
  // ...
  });

  if (result === null) {
    this.callback(
      Error(
        `Failed to transform "${options.filename}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code,
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;
```

### Expo {/*usage-with-expo*/}

Expo アプリで React Compiler を有効化する方法については [Expo のドキュメント](https://docs.expo.dev/preview/react-compiler/)を参照してください。

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native は Metro 経由で Babel を使用するため、インストール手順については [Babel での使用](#usage-with-babel)セクションを参照してください。

### Rspack {/*usage-with-rspack*/}

Rspack アプリで React Compiler を有効化する方法については [Rspack のドキュメント](https://rspack.dev/guide/tech/react#react-compiler)を参照してください。

### Rsbuild {/*usage-with-rsbuild*/}

Rsbuild アプリで React Compiler を有効化する方法については [Rsbuild のドキュメント](https://rsbuild.dev/guide/framework/react#react-compiler)を参照してください。

## トラブルシューティング {/*troubleshooting*/}

問題を報告するには、まず [React Compiler Playground](https://playground.react.dev/) で最小限の再現コードを作成し、それをバグ報告に含めてください。問題は [facebook/react](https://github.com/facebook/react/issues) リポジトリで報告できます。

また、メンバとして参加することで React Compiler Working Group にフィードバックを提供することもできます。参加方法の詳細については [README](https://github.com/reactwg/react-compiler) を参照してください。

### `(0 , _c) is not a function` エラー {/*0--_c-is-not-a-function-error*/}

これは React 19 RC 以降を使用していない場合に発生します。これを修正するには、まず[アプリを React 19 RC にアップグレード](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)してください。

React 19 にアップグレードできない場合は、[Working Group](https://github.com/reactwg/react-compiler/discussions/6) で説明されているように、キャッシュ関数に関するユーザスペースの実装を試すことができます。ただしこれは推奨されておらず、可能な限り React 19 にアップグレードするべきです。

### コンポーネントが最適化されたかどうかを知る方法 {/*how-do-i-know-my-components-have-been-optimized*/}

[React Devtools](/learn/react-developer-tools) (v5.0+) には React Compiler のサポートが組み込まれており、コンパイラによって最適化されたコンポーネントの横に "Memo ✨" バッジが表示されます。

### コンパイル後に何かが動作しない場合 {/*something-is-not-working-after-compilation*/}
eslint-plugin-react-compiler がインストールされている場合、コンパイラはエディタ内で React のルールに対する違反を表示します。これが表示された場合、コンパイラはそのコンポーネントやフックの最適化をスキップしたという意味です。これ自体は全く問題なく、コンパイラは他のコンポーネントの最適化を続けることができます。**すべての eslint 違反をすぐに修正する必要はありません**。自分のペースで対応して、最適化されるコンポーネントやフックの数を増やしていくことができます。

JavaScript の柔軟かつ動的な性質のため、すべてのケースを包括的に検出することはできません。無限ループなどのバグや未定義の動作が発生することがあります。

コンパイル後にアプリが正しく動作せず、eslint エラーも表示されない場合、コンパイラがコードを誤ってコンパイルしている可能性があります。これを確認するには、関連があると思われるコンポーネントやフックを明示的に [`"use no memo"` ディレクティブ](#opt-out-of-the-compiler-for-a-component)を使って除外してみてください。

```js {2}
function SuspiciousComponent() {
  "use no memo"; // opts out this component from being compiled by React Compiler
  // ...
}
```

<Note>
#### `"use no memo"` {/*use-no-memo*/}

`"use no memo"` は、React Compiler によるコンパイルからコンポーネントやフックを一時的に除外するための*一時的な*避難ハッチです。このディレクティブは、例えば [`"use client"`](/reference/rsc/use-client) のように長期に渡って使用されることを意図したものではありません。

このディレクティブを使用するのは本当に必要な場合に限ることをお勧めします。一度コンポーネントやフックを除外してしまえば、ディレクティブを削除するまで永遠に除外され続けることになります。つまり、コードの問題を修正しても、ディレクティブを削除しない限りコンパイラはコンパイルを行わなくなります。
</Note>

これでエラーが解消された場合、この除外ディレクティブを削除してみて問題が再発することを確認してください。その後、バグレポートを [React Compiler Playground](https://playground.react.dev) を使って共有してください（小さな再現コードに削減するか、オープンソースコードであればソース全体を貼り付けることもできます）。これにより問題を特定して修正する手助けができるようになります。

### その他の問題 {/*other-issues*/}

https://github.com/reactwg/react-compiler/discussions/7 をご覧ください。
