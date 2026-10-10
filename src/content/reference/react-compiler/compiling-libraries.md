---
title: ライブラリのコンパイル
---

<Intro>
このガイドでは、ライブラリの作者が React Compiler を使用して、最適化されたライブラリコードをユーザに配布する方法を説明します。
</Intro>

<InlineToc />

## コンパイル済みコードを配布する理由 {/*why-ship-compiled-code*/}

ライブラリの作者は、npm に公開する前にライブラリのコードを事前コンパイルできます。これには次のような利点があります。

- **すべてのユーザのパフォーマンスが向上** - ライブラリのユーザが React Compiler をまだ使用していない場合でも最適化されたコードが利用できる
- **ユーザによる設定が不要** - 最適化がそのまま機能する
- **一貫した動作** - ユーザのビルド環境にかかわらず、すべてのユーザが同じ最適化済みバージョンを利用できる

## コンパイルのセットアップ {/*setting-up-compilation*/}

ライブラリのビルドプロセスに React Compiler を追加します。

<TerminalBlock>
npm install -D babel-plugin-react-compiler@latest
</TerminalBlock>

ライブラリをコンパイルするようにビルドツールを設定します。例えば Babel では次のようにします。

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
  ],
  // ... other config
};
```

## 後方互換性 {/*backwards-compatibility*/}

ライブラリが React 19 未満のバージョンをサポートする場合は、追加の設定が必要です。

### 1. ランタイムパッケージをインストール {/*install-runtime-package*/}

react-compiler-runtime を直接の依存ライブラリとしてインストールすることを推奨します。

<TerminalBlock>
npm install react-compiler-runtime@latest
</TerminalBlock>

```json
{
  "dependencies": {
    "react-compiler-runtime": "^1.0.0"
  },
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0 || ^19.0.0"
  }
}
```

### 2. ターゲットバージョンを設定 {/*configure-target-version*/}

ライブラリがサポートする最小の React バージョンを設定します。

```js
{
  target: '17', // Minimum supported React version
}
```

## テスト戦略 {/*testing-strategy*/}

互換性を確認するため、コンパイルありとなしの両方でライブラリをテストしてください。コンパイル済みコードに対して既存のテストスイートを実行し、コンパイラを通さない別のテスト設定も作成します。これにより、コンパイルプロセスから生じる可能性のある問題を検出し、あらゆる状況でライブラリが正しく動作することを確認できます。

## トラブルシューティング {/*troubleshooting*/}

### 古い React バージョンでライブラリが動作しない {/*library-doesnt-work-with-older-react-versions*/}

コンパイル済みライブラリが React 17 または 18 でエラーをスローする場合があります。

1. `react-compiler-runtime` が依存ライブラリとしてインストールされていることを確認してください。
2. `target` の設定がサポート対象の最小 React バージョンと一致していることを確認してください。
3. 公開したバンドルにランタイムパッケージが含まれていることを確認してください。

### コンパイルが他の Babel プラグインと競合する {/*compilation-conflicts-with-other-babel-plugins*/}

一部の Babel プラグインは React Compiler と競合する可能性があります。

1. `babel-plugin-react-compiler` をプラグインリストの先頭付近に配置してください。
2. 他のプラグインで競合する最適化を無効化してください。
3. ビルド出力を十分にテストしてください。

### ランタイムモジュールが見つからない {/*runtime-module-not-found*/}

ユーザに "Cannot find module 'react-compiler-runtime'" と表示される場合があります。

1. ランタイムが `devDependencies` ではなく `dependencies` に記載されていることを確認してください。
2. バンドラの出力にランタイムが含まれていることを確認してください。
3. パッケージがライブラリに含まれた状態で npm に公開されていることを確認してください。

## 次のステップ {/*next-steps*/}

- コンパイル済みコードの[デバッグ手法](/learn/react-compiler/debugging)について学ぶ
- 利用できるすべてのコンパイラオプションを[設定オプション](/reference/react-compiler/configuration)で確認する
- 選択的に最適化するための[コンパイルモード](/reference/react-compiler/compilationMode)を確認する