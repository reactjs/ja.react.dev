---
title: インストール
---

<Intro>
このガイドでは、React アプリケーションに React Compiler をインストールし、設定する方法を説明します。
</Intro>

<YouWillLearn>

* React Compiler のインストール方法
* さまざまなビルドツールでの基本的な設定
* セットアップが正常に動作しているかの確認方法

</YouWillLearn>

## 前提条件 {/*prerequisites*/}

React Compiler は React 19 で最適に動作するよう設計されていますが、React 17 および 18 もサポートしています。詳細については [React バージョン互換性](/reference/react-compiler/target)をご覧ください。

## インストール {/*installation*/}

React Compiler を `devDependency` としてインストールします。

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

Yarn を使用する場合：

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@latest
</TerminalBlock>

pnpm を使用する場合：

<TerminalBlock>
pnpm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

## 基本的なセットアップ {/*basic-setup*/}

React Compiler は、デフォルトで設定なしで動作するように設計されています。ただし、特別な状況で設定が必要な場合（例えば、React 19 未満のバージョンを対象とする場合）は、[コンパイラオプションリファレンス](/reference/react-compiler/configuration)を参照してください。

セットアッププロセスは使用するビルドツールによって異なります。React Compiler には、ビルドパイプラインと統合して動作する Babel プラグインが含まれています。

<Pitfall>
React Compiler は Babel プラグインパイプライン内で**最初に**実行される必要があります。コンパイラが適切な解析を行うためにはオリジナルのソース情報が必要なため、他の変換より前に処理する必要があるのです。
</Pitfall>

### Babel {/*babel*/}

`babel.config.js` を作成または更新します。

```js {3}
module.exports = {
  plugins: [
    'babel-plugin-react-compiler', // must run first!
    // ... other plugins
  ],
  // ... other config
};
```

### Vite {/*vite*/}

Vite を使用している場合は、プラグインを vite-plugin-react に追加できます。

```js {3,9}
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

または、Vite 用の Babel プラグインを別に使用したい場合は以下のようにします。

<TerminalBlock>
npm install -D vite-plugin-babel
</TerminalBlock>

```js {2,11}
// vite.config.js
import babel from 'vite-plugin-babel';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

### Next.js {/*usage-with-nextjs*/}

詳細については [Next.js ドキュメント](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler)を参照してください。

### React Router {/*usage-with-react-router*/}
`vite-plugin-babel` をインストールし、コンパイラの Babel プラグインを追加します。

<TerminalBlock>
npm install vite-plugin-babel
</TerminalBlock>

```js {3-4,16}
// vite.config.js
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import { reactRouter } from "@react-router/dev/vite";

const ReactCompilerConfig = { /* ... */ };

export default defineConfig({
  plugins: [
    reactRouter(),
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

コミュニティ製の webpack ローダーが[こちら](https://github.com/SukkaW/react-compiler-webpack)で利用できます。

### Expo {/*usage-with-expo*/}

Expo アプリで React Compiler を有効にして使用する方法については、[Expo のドキュメント](https://docs.expo.dev/guides/react-compiler/)を参照してください。

### Metro (React Native) {/*usage-with-react-native-metro*/}

React Native は Metro 経由で Babel を使用するため、インストール手順については [Babel での使用](#babel)セクションを参照してください。

### Rspack {/*usage-with-rspack*/}

Rspack アプリで React Compiler を有効にして使用する方法については、[Rspack のドキュメント](https://rspack.dev/guide/tech/react#react-compiler)を参照してください。

### Rsbuild {/*usage-with-rsbuild*/}

Rsbuild アプリで React Compiler を有効にして使用する方法については、[Rsbuild のドキュメント](https://rsbuild.dev/guide/framework/react#react-compiler)を参照してください。


## ESLint 統合 {/*eslint-integration*/}

React Compiler には、最適化できないコードを特定するのに役立つ ESLint ルールが含まれています。ESLint ルールがエラーを報告する場合、コンパイラによるそのコンポーネントやフックの最適化がスキップされるという意味です。これは安全です。コンパイラはコードベースの他の部分の最適化を続けるので、すべての違反をすぐに修正する必要はありません。自分のペースで対処し、最適化されるコンポーネントの数を徐々に増やしていってください。

ESLint プラグインをインストールします。

<TerminalBlock>
npm install -D eslint-plugin-react-hooks@latest
</TerminalBlock>

`eslint-plugin-react-hooks` をまだ設定していない場合は、[readme のインストール手順](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#installation)に従ってください。コンパイラのルールは `recommended-latest` プリセットで利用できます。

ESLint ルールは以下を行います。
- [React のルール](/reference/rules)の違反の特定
- 最適化できないコンポーネントの表示
- 問題の修正に役立つエラーメッセージの提供

## セットアップの確認 {/*verify-your-setup*/}

インストール後、React Compiler が正常に動作していることを確認します。

### React DevTools による確認 {/*check-react-devtools*/}

React Compiler によって最適化されたコンポーネントは、React DevTools で "Memo ✨" バッジが表示されます。

1. [React Developer Tools](/learn/react-developer-tools) ブラウザ拡張機能をインストール
2. 開発モードでアプリを開く
3. React DevTools を開く
4. コンポーネント名の横にある ✨ 絵文字を探す

コンパイラが動作している場合
- コンポーネントは React DevTools で "Memo ✨" バッジを表示
- 高コストな計算が自動的にメモ化される
- 手動の `useMemo` は不要

### ビルド出力の確認 {/*check-build-output*/}

また、ビルド出力を確認することでもコンパイラが動作していることを確認できます。コンパイルされたコードには、コンパイラが自動的に追加する自動メモ化ロジックが含まれています。

```js
import { c as _c } from "react/compiler-runtime";
export default function MyApp() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

```

## トラブルシューティング {/*troubleshooting*/}

### 特定のコンポーネントの除外 {/*opting-out-specific-components*/}

コンポーネントがコンパイル後に問題を引き起こしている場合、`"use no memo"` ディレクティブを使用して一時的に除外できます。

```js
function ProblematicComponent() {
  "use no memo";
  // Component code here
}
```

これにより、コンパイラはこの特定のコンポーネントの最適化をスキップします。根本的な問題を修正し、解決したらディレクティブを削除してください。

トラブルシューティングの詳細については、[デバッグガイド](/learn/react-compiler/debugging)を参照してください。

## 次のステップ {/*next-steps*/}

React Compiler がインストールされたので、以下について詳しく学びましょう。

- React 17 と 18 の [React バージョン互換性](/reference/react-compiler/target)
- コンパイラをカスタマイズする[設定オプション](/reference/react-compiler/configuration)
- 既存のコードベースでの[段階的な導入戦略](/learn/react-compiler/incremental-adoption)
- 問題のトラブルシューティングのための[デバッグテクニック](/learn/react-compiler/debugging)
- React ライブラリをコンパイルするための[ライブラリコンパイルガイド](/reference/react-compiler/compiling-libraries)