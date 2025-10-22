---
title: 段階的な導入
---

<Intro>
React Compiler は段階的に導入でき、まずコードベースの特定の箇所で試すことができます。このガイドでは、既存のプロジェクトでコンパイラを徐々に展開する方法を説明します。
</Intro>

<YouWillLearn>

* 段階的な導入が推奨される理由
* ディレクトリ単位で導入するための Babel の overrides の使い方
* 明示的にコンパイルを有効化する “use memo” ディレクティブの使い方
* コンポーネントを除外する “use no memo” ディレクティブの使い方
* ランタイムのゲーティングによる機能フラグの運用
* 導入状況のモニタリング方法

</YouWillLearn>

## なぜ段階的な導入が推奨されるのか？ {/*why-incremental-adoption*/}

React Compiler はコードベース全体を自動的に最適化するように設計されていますが、一度にすべてを導入する必要はありません。段階的な導入により、展開プロセスをコントロールでき、アプリの一部でコンパイラをテストしてから残りの部分に拡大できます。

小さく始めることで、コンパイラの最適化に対する信頼を築けます。コンパイルされたコードでアプリが正しく動作することを確認し、パフォーマンスの改善を測定しつつ、コードベースに特有のエッジケースを特定できます。このアプローチは、安定性が重要な本番アプリケーションで特に価値があります。

段階的な導入により、コンパイラが見つける可能性のある React のルール違反に対処することも容易になります。コードベース全体の違反を一度に修正するのではなく、コンパイラのカバレッジを拡張しながら体系的に対処できます。これにより、移行作業が管理しやすくなり、バグが混入するリスクを減らします。

コードのどの部分がコンパイルされるかをコントロールすることで、コンパイラの最適化の実際の影響を測定する A/B テストを実行することもできます。このデータは、コンパイラを全体へ適用するか否かを意思決定するための情報として役立ちます。

## 段階的な導入のアプローチ {/*approaches-to-incremental-adoption*/}

React Compiler を段階的に導入する主なアプローチは 3 つあります：

1. **Babel overrides** - 特定のディレクトリにコンパイラを適用
2. **"use memo" によるオプトイン** - 明示的にオプトインしたコンポーネントのみをコンパイル
3. **ランタイムゲーティング** - フィーチャーフラグでコンパイルをコントロール

すべてのアプローチにより、全体への展開前にアプリケーションの特定の部分でコンパイラをテストできます。

## Babel Overrides によるディレクトリベースの導入 {/*directory-based-adoption*/}

Babel の `overrides` オプションにより、コードベースの異なる部分に異なるプラグインを適用できます。これは、ディレクトリごとに React Compiler を徐々に導入するのに理想的な方法です。

### 基本的な設定 {/*basic-configuration*/}

特定のディレクトリにコンパイラを適用することから始めます。

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins that apply to all files
  ],
  overrides: [
    {
      test: './src/modern/**/*.{js,jsx,ts,tsx}',
      plugins: [
        'babel-plugin-react-compiler'
      ]
    }
  ]
};
```

### カバレッジの拡張 {/*expanding-coverage*/}

信頼を築いたら、より多くのディレクトリを追加します。

```js
// babel.config.js
module.exports = {
  plugins: [
    // Global plugins
  ],
  overrides: [
    {
      test: ['./src/modern/**/*.{js,jsx,ts,tsx}', './src/features/**/*.{js,jsx,ts,tsx}'],
      plugins: [
        'babel-plugin-react-compiler'
      ]
    },
    {
      test: './src/legacy/**/*.{js,jsx,ts,tsx}',
      plugins: [
        // Different plugins for legacy code
      ]
    }
  ]
};
```

### コンパイラオプション {/*with-compiler-options*/}

オーバーライドごとにコンパイラオプションを設定することもできます。

```js
// babel.config.js
module.exports = {
  plugins: [],
  overrides: [
    {
      test: './src/experimental/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    },
    {
      test: './src/production/**/*.{js,jsx,ts,tsx}',
      plugins: [
        ['babel-plugin-react-compiler', {
          // options ...
        }]
      ]
    }
  ]
};
```


## "use memo" によるオプトインモード {/*opt-in-mode-with-use-memo*/}

より厳格な制御を行うため、`compilationMode: 'annotation'` を使用して、`"use memo"` ディレクティブで明示的にオプトインしたコンポーネントとフックのみをコンパイルできます。

<Note>
このアプローチにより、個々のコンポーネントとフックに対する細かいコントロールが可能になります。ディレクトリ全体に影響を与えることなく、特定のコンポーネントでコンパイラをテストしたい場合に有用です。
</Note>

### アノテーションモードの設定 {/*annotation-mode-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation',
    }],
  ],
};
```

### ディレクティブの使用 {/*using-the-directive*/}

コンパイルしたい関数の先頭に `"use memo"` を追加します。

```js
function TodoList({ todos }) {
  "use memo"; // Opt this component into compilation

  const sortedTodos = todos.slice().sort();

  return (
    <ul>
      {sortedTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

function useSortedData(data) {
  "use memo"; // Opt this hook into compilation

  return data.slice().sort();
}
```

`compilationMode: 'annotation'` を指定する際は、以下を行う必要があります。
- 最適化したいすべてのコンポーネントに `"use memo"` を追加
- すべてのカスタムフックに `"use memo"` を追加
- 新しいコンポーネントに追加することを忘れない

これにより、コンパイラの影響を評価しながら、どのコンポーネントがコンパイルするかを正確にコントロールできます。

## ゲーティング機能によるフィーチャーフラグ制御 {/*runtime-feature-flags-with-gating*/}

`gating` オプションにより、フィーチャーフラグを使用してランタイムでコンパイルをコントロールできます。これは A/B テストを実行したり、ユーザセグメントに基づいてコンパイラを徐々に展開したりするのに有用です。

### ゲーティングの仕組み {/*how-gating-works*/}

コンパイラは最適化されたコードをランタイムチェックでラップします。ゲートが `true` を返す場合、最適化されたバージョンが実行されます。そうでなければ、元のコードが実行されます。

### ゲーティングの設定 {/*gating-configuration*/}

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        source: 'ReactCompilerFeatureFlags',
        importSpecifierName: 'isCompilerEnabled',
      },
    }],
  ],
};
```

### フィーチャーフラグの実装 {/*implementing-the-feature-flag*/}

ゲーティング関数をエクスポートするモジュールを作成します。

```js
// ReactCompilerFeatureFlags.js
export function isCompilerEnabled() {
  // Use your feature flag system
  return getFeatureFlag('react-compiler-enabled');
}
```

## 導入時のトラブルシューティング {/*troubleshooting-adoption*/}

導入中に問題が発生した場合

1. `"use no memo"` を使用して問題のあるコンポーネントを一時的に除外
2. 一般的な問題については[デバッグガイド](/learn/react-compiler/debugging)を確認
3. ESLint プラグインによって特定された React のルール違反を修正
4. より段階的な導入のために `compilationMode: 'annotation'` の使用を検討

## 次のステップ {/*next-steps*/}

- より多くのオプションについては[設定ガイド](/reference/react-compiler/configuration)を確認する
- [デバッグテクニック](/learn/react-compiler/debugging)について学ぶ
- すべてのコンパイラオプションについては [API リファレンス](/reference/react-compiler/configuration)を確認する