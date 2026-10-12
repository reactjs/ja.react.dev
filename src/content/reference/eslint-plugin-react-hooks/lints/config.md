---
title: config
---

<Intro>

コンパイラの[設定オプション](/reference/react-compiler/configuration)を検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

React Compiler は、動作を制御するさまざまな[設定オプション](/reference/react-compiler/configuration)を受け付けます。このルールは、設定で正しいオプション名と値の型が使われているか検証し、タイプミスや誤った設定によって気づかないうちに動作しなくなることを防ぎます。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Unknown option name
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compileMode: 'all' // Typo: should be compilationMode
    }]
  ]
};

// ❌ Invalid option value
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'everything' // Invalid: use 'all' or 'infer'
    }]
  ]
};
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Valid compiler configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer',
      panicThreshold: 'critical_errors'
    }]
  ]
};
```

## トラブルシューティング {/*troubleshooting*/}

### 設定が期待どおりに動作しない {/*config-not-working*/}

以下のように、コンパイラの設定にタイプミスや誤った値が含まれているかもしれません。

```js
// ❌ Wrong: Common configuration mistakes
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // Typo in option name
      compilationMod: 'all',
      // Wrong value type
      panicThreshold: true,
      // Unknown option
      optimizationLevel: 'max'
    }]
  ]
};
```

有効なオプションについては、[設定のドキュメント](/reference/react-compiler/configuration)を確認してください。

```js
// ✅ Better: Valid configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'all', // or 'infer'
      panicThreshold: 'none', // or 'critical_errors', 'all_errors'
      // Only use documented options
    }]
  ]
};
```
