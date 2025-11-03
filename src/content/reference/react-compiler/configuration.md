---
title: 設定
---

<Intro>

このページでは、React Compiler で利用可能な設定オプションをすべてリストアップしています。

</Intro>

<Note>

ほとんどのアプリでは、デフォルトの設定で問題なく動作します。特別な要件がある場合は、後述する詳細な設定を利用できます。

</Note>

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // compiler options
      }
    ]
  ]
};
```

---

## コンパイル制御 {/*compilation-control*/}

これらのオプションは、コンパイラが*何を*最適化し、*どのように*コンポーネントとフックを選択してコンパイルするかを制御します。

* [`compilationMode`](/reference/react-compiler/compilationMode) は、コンパイルする関数を選択する方法を制御します（例：すべての関数、アノテーション付きのもののみ、インテリジェント検出など）。

```js
{
  compilationMode: 'annotation' // Only compile "use memo" functions
}
```

---

## バージョン互換性 {/*version-compatibility*/}

React バージョンの設定により、使用中の React バージョンと互換性のあるコードをコンパイラが生成することが保証されます。

[`target`](/reference/react-compiler/target) は、使用中の React バージョン（17、18、19）を指定します。

```js
// For React 18 projects
{
  target: '18' // Also requires react-compiler-runtime package
}
```

---

## エラーハンドリング {/*error-handling*/}

これらのオプションは、コンパイラが [React のルール](/reference/rules)に従わないコードをどのように処理するか制御します。

[`panicThreshold`](/reference/react-compiler/panicThreshold) は、ビルドを失敗させるか、問題のあるコンポーネントをスキップするかを決定します。

```js
// Recommended for production
{
  panicThreshold: 'none' // Skip components with errors instead of failing the build
}
```

---

## デバック {/*debugging*/}

ログと解析オプションは、コンパイラが何を行っているのか理解するのに役立ちます。

[`logger`](/reference/react-compiler/logger) は、コンパイルイベントに対するカスタムのロギング手段を指定します。

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileSuccess') {
        console.log('Compiled:', filename);
      }
    }
  }
}
```

---

## フィーチャーフラグ {/*feature-flags*/}

条件付きコンパイルにより、最適化されたコードがいつ使用されるか制御することができます。

[`gating`](/reference/react-compiler/gating) は、A/B テストや段階的ロールアウトのためのランタイムフィーチャーフラグを有効にします。

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'isCompilerEnabled'
  }
}
```

---

## 一般的な設定パターン {/*common-patterns*/}

### デフォルト設定 {/*default-configuration*/}

ほとんどの React 19 アプリケーションで、コンパイラは設定なしで動作します。

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler'
  ]
};
```

### React 17/18 プロジェクト {/*react-17-18*/}

古い React バージョンでは、ランタイムパッケージとターゲット設定が必要です。

```bash
npm install react-compiler-runtime@latest
```

```js
{
  target: '18' // or '17'
}
```

### 段階的な導入 {/*incremental-adoption*/}

特定のディレクトリから始めて、段階的に拡張することができます。

```js
{
  compilationMode: 'annotation' // Only compile "use memo" functions
}
```

