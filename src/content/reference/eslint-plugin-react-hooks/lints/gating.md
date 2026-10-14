---
title: gating
---

<Intro>

[ゲーティングモード](/reference/react-compiler/gating)の設定を検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

ゲーティングモードでは、特定のコンポーネントを最適化の対象として指定することで、React Compiler を段階的に導入できます。このルールは、ゲーティングの設定が有効であることを確認し、コンパイラがどのコンポーネントを処理すべきか判断できるようにします。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Missing required fields
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: '__experimental_useCompiler'
        // Missing 'source' field
      }
    }]
  ]
};

// ❌ Invalid gating type
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: '__experimental_useCompiler' // Should be object
    }]
  ]
};
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Complete gating configuration
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      gating: {
        importSpecifierName: 'isCompilerEnabled', // exported function name
        source: 'featureFlags' // module name
      }
    }]
  ]
};

// featureFlags.js
export function isCompilerEnabled() {
  // ...
}

// ✅ No gating (compile everything)
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      // No gating field - compiles all components
    }]
  ]
};
```
