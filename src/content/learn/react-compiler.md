---
title: React Compiler
---

<Intro>
このページでは、React Compiler の概要と、試用の方法について説明します。
</Intro>

<Wip>
このドキュメントはまだ作成中です。詳細なドキュメントは [React Compiler Working Group リポジトリ](https://github.com/reactwg/react-compiler/discussions)にあり、安定化後にこちらのドキュメントに反映されます。
</Wip>

<YouWillLearn>

* コンパイラを使い始める
* コンパイラと ESLint プラグインのインストール
* トラブルシューティング

</YouWillLearn>

<Note>
React Compiler はベータ版の新しいコンパイラであり、コミュニティから早期フィードバックを得るためにオープンソース化したものです。Meta などの企業の本番環境で利用されていますが、あなたのアプリでコンパイラを本番利用できるかどうかは、コードベースの健全性や、[React のルール](/reference/rules)をどの程度守れているかに依存します。

最新版のベータリリースは `@beta` タグで、またデイリーの実験的リリースは `@experimental` タグで利用可能です。
</Note>

React Compiler は新しいコンパイラであり、コミュニティから早期フィードバックを得るためにオープンソース化したものです。これはビルド時のみに実行されるツールであり、あなたの React アプリを自動的に最適化します。プレーンな JavaScript で動作し、[React のルール](/reference/rules)を理解しているため、コードを書き直す必要はありません。

コンパイラには、コンパイラの分析結果をエディタ内でその場で表示できる [ESLint プラグイン](#installing-eslint-plugin-react-compiler) も含まれています。**すべての開発者に、このリンタを直ちに有効化することを強くお勧めします**。このリンタはコンパイラがインストールされていなくとも動作するため、アプリでコンパイラを試用する準備ができていない場合でも利用できます。

このコンパイラは現在 `beta` としてリリースされており、React 17 以降のアプリやライブラリで試すことができます。ベータ版をインストールするには以下のようにします。

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

あるいは、Yarn を利用している場合は以下のようにします。

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

まだ React 19 を利用していない場合は、[こちらのセクション](#using-react-compiler-with-react-17-or-18)に詳しい手順があります。

### コンパイラは何をするのか {/*what-does-the-compiler-do*/}

アプリケーションを最適化するために、React Compiler は自動的にコードをメモ化します。現在皆さんは、`useMemo`、`useCallback`、`React.memo` などの API を使ったメモ化に慣れているかもしれません。これらの API を使用することで、入力が変更されていない場合にアプリケーションの特定部分を再計算する必要がないということを React に伝え、更新時の作業を減らすことができます。強力な機能ですが、いとも簡単にメモ化を適用し忘れたり、誤って適用したりしてしまいます。こうなると、意味のある変化がない部分の UI についても React がチェックしなければならないため、非効率的な更新が発生してしまう可能性があります。

このコンパイラは、JavaScript と React のルールに関する知識を使用して、コンポーネントやフック内にある値や値のグループを、自動的にメモ化します。ルールが守られていない部分を検出した場合、該当のコンポーネントやフックだけを自動的にスキップし、他のコードを安全にコンパイルし続けます。

<Note>
React Compiler は、React のルールが守られていない場合でもそれを静的に検出し、その影響を受けるコンポーネントやフックだけを最適化から安全に除外することが可能です。コードベースの 100% 全体を最適化させる必要はありません。
</Note>

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

### コンパイラを試すべきか {/*should-i-try-out-the-compiler*/}

コンパイラはまだベータ版であり、多くの粗削りな部分があります。Meta のような企業で本番環境で使用されてはいますが、アプリにコンパイラを本番導入すべきかどうかは、コードベースの健全性と [React のルール](/reference/rules)にどれだけ従っているかに依存します。

**今すぐコンパイラを使用する必要はありません。安定版リリースを待ってから採用しても構いません**。ただし、アプリで小規模な実験として試してみて、[フィードバック](#reporting-issues)を提供していただれば、コンパイラの改善に役立ちます。

## スタートガイド {/*getting-started*/}

以下のドキュメントに加えて、コンパイラに関する追加情報やディスカッションについて [React Compiler Working Group](https://github.com/reactwg/react-compiler) を確認することをお勧めします。

### eslint-plugin-react-compiler のインストール {/*installing-eslint-plugin-react-compiler*/}

React Compiler は ESLint プラグインも提供しています。eslint プラグインはコンパイラとは**独立して**使用できるため、コンパイラを使用しなくても ESLint プラグインだけを使用できます。

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

次に、ESLint の設定に以下を追加します。

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

あるいは、非推奨の eslintrc 形式の設定ファイルの場合、以下のようにします。

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
}
```

ESLint プラグインは、エディタ内で React のルールに関する違反を表示します。これが表示される場合、そのコンポーネントやフックの最適化をコンパイラがスキップしたということを意味します。これ自体は全く問題なく、コンパイラは他のコンポーネントの最適化を続けることができます。

<Note>
**すべての ESLint の違反をすぐに修正する必要はありません**。ルール違反を自分のペースで修正しつつ、最適化されるコンポーネントやフックの数を徐々に増やしていくことができます。コンパイラを使用する前にすべてを修正する必要はありません。
</Note>

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

コンパイラの導入に自信がついてきたら、他のディレクトリにも適用範囲を拡大し、アプリ全体に徐々に導入していくことができます。

#### 新規プロジェクト {/*new-projects*/}

新しいプロジェクトを開始する場合、コードベース全体でコンパイラを有効化できます。これがデフォルトの動作です。

### React 17 または 18 での React Compiler の利用 {/*using-react-compiler-with-react-17-or-18*/}

React Compiler は React 19 RC と組み合わせることで最も良く動作します。アップグレードできない場合は、追加の `react-compiler-runtime` パッケージをインストールすることで、バージョン 19 以前でもコンパイル済みのコードを実行できます。ただし、サポートされる最低バージョンは 17 です。

<TerminalBlock>
npm install react-compiler-runtime@beta
</TerminalBlock>

コンパイラの設定で `target` を正しく指定する必要もあります。`target` は対象としたい React の最小のメジャーバージョン番号です。

```js {3}
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  };
};
```

### ライブラリでコンパイラを使う {/*using-the-compiler-on-libraries*/}

React Compiler はライブラリのコンパイルにも使用できます。React Compiler はコード変換前の元のソースコード上で実行する必要があるため、アプリケーションのビルドパイプライン中で、利用しているライブラリをコンパイルすることはできません。そのため、ライブラリメンテナは個別にコンパイラでコンパイルとテストを行い、コンパイル済みのコードを npm に公開することをお勧めします。

ライブラリのコードが事前にコンパイルされていれば、ライブラリのユーザはコンパイラを有効にしなくても、ライブラリに適用された自動メモ化の恩恵を受けることができます。ライブラリがまだ React 19 に移行していないアプリを対象としている場合、[最小の `target` を指定し、`react-compiler-runtime` を dependency として直接追加してください](#using-react-compiler-with-react-17-or-18)。ランタイムパッケージはアプリケーションのバージョンに応じて正しい API の実装を使用し、必要に応じて欠けている API をポリフィルします。

ライブラリのコードではより複雑なパターンや避難ハッチを使用することが多いため、ライブラリでコンパイラを用いることに起因する問題を見つけるため、十分なテストを行うことをお勧めします。問題が見つかった場合、特定のコンポーネントやフックに [`'use no memo'`ディレクティブ](#something-is-not-working-after-compilation)を使用して最適化を無効にすることができます。

アプリの場合と同様ですが、コンパイラのメリットを享受するためにライブラリのコンポーネントやフックを 100% 完全にコンパイルする必要はありません。手始めに、まずライブラリ内で特にパフォーマンスに敏感な部分を特定し、そこが [React のルール](/reference/rules)を破っていないことを確認するとよいでしょう。この確認には `eslint-plugin-react-compiler` を使用できます。

## 使用法 {/*installation*/}

### Babel {/*usage-with-babel*/}

<TerminalBlock>
npm install babel-plugin-react-compiler@beta
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

<<<<<<< HEAD
詳細については [Next.js ドキュメント](https://nextjs.org/docs/canary/app/api-reference/next-config-js/reactCompiler)を参照してください。
=======
Please refer to the [Next.js docs](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) for more information.
>>>>>>> 84f29eb20af17e9c154b9ad71c21af4c9171e4a2

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

コミュニティによる Webpack ローダは[こちらで利用可能](https://github.com/SukkaW/react-compiler-webpack)です。

### Expo {/*usage-with-expo*/}

<<<<<<< HEAD
Expo アプリで React Compiler を有効化する方法については [Expo のドキュメント](https://docs.expo.dev/preview/react-compiler/)を参照してください。
=======
Please refer to [Expo's docs](https://docs.expo.dev/guides/react-compiler/) to enable and use the React Compiler in Expo apps.
>>>>>>> 84f29eb20af17e9c154b9ad71c21af4c9171e4a2

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native は Metro 経由で Babel を使用するため、インストール手順については [Babel での使用](#usage-with-babel)セクションを参照してください。

### Rspack {/*usage-with-rspack*/}

Rspack アプリで React Compiler を有効化する方法については [Rspack のドキュメント](https://rspack.dev/guide/tech/react#react-compiler)を参照してください。

### Rsbuild {/*usage-with-rsbuild*/}

Rsbuild アプリで React Compiler を有効化する方法については [Rsbuild のドキュメント](https://rsbuild.dev/guide/framework/react#react-compiler)を参照してください。

## トラブルシューティング {/*troubleshooting*/}

問題を報告するには、まず [React Compiler Playground](https://playground.react.dev/) で最小限の再現コードを作成し、それをバグ報告に含めてください。問題は [facebook/react](https://github.com/facebook/react/issues) リポジトリで報告できます。

また、メンバとして参加することで React Compiler Working Group にフィードバックを提供することもできます。参加方法の詳細については [README](https://github.com/reactwg/react-compiler) を参照してください。

### コンパイラが前提としていること {/*what-does-the-compiler-assume*/}

React Compiler は、あなたのコードが以下のようになっていることを仮定します。

1. 有効でセマンティックな JavaScript であること。
2. nullable ないし省略可能な値についてアクセス前に（例えば、TypeScript を使用している場合は [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks) を使うなどで）チェックを行っていること。つまり `if (object.nullableProperty) { object.nullableProperty.foo }` とするか、オプショナルチェーンを使用して `object.nullableProperty?.foo` のようにしていること。
3. [React のルール](https://react.dev/reference/rules)に従っていること。

React Comiler は多くの React のルールを静的に検証でき、エラーを検出した場合は安全にコンパイルをスキップします。エラーを確認するために、[eslint-plugin-react-compiler](https://www.npmjs.com/package/eslint-plugin-react-compiler) のインストールもお勧めします。

### コンポーネントが最適化されたかどうかを知る方法 {/*how-do-i-know-my-components-have-been-optimized*/}

[React Devtools](/learn/react-developer-tools) (v5.0+) には React Compiler のサポートが組み込まれており、コンパイラによって最適化されたコンポーネントの横に "Memo ✨" バッジが表示されます。

### コンパイル後に何かが動作しない場合 {/*something-is-not-working-after-compilation*/}
eslint-plugin-react-compiler がインストールされている場合、コンパイラはエディタ内で React のルールに対する違反を表示します。これが表示された場合、コンパイラはそのコンポーネントやフックの最適化をスキップしたという意味です。これ自体は全く問題なく、コンパイラは他のコンポーネントの最適化を続けることができます。**すべての ESLint 違反をすぐに修正する必要はありません**。自分のペースで対応して、最適化されるコンポーネントやフックの数を増やしていくことができます。

JavaScript の柔軟かつ動的な性質のため、すべてのケースを包括的に検出することはできません。無限ループなどのバグや未定義の動作が発生することがあります。

コンパイル後にアプリが正しく動作せず、ESLint エラーも表示されない場合、コンパイラがコードを誤ってコンパイルしている可能性があります。これを確認するには、関連があると思われるコンポーネントやフックを明示的に [`"use no memo"` ディレクティブ](#opt-out-of-the-compiler-for-a-component)を使って除外してみてください。

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
