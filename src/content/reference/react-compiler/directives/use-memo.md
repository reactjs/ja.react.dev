---
title: "use memo"
titleForTitleTag: "'use memo' ディレクティブ"
---

<Intro>

`"use memo"` は、関数を React Compiler による最適化の対象としてマークします。

</Intro>

<Note>

ほとんどの場合、`"use memo"` は必要ありません。これは主に、最適化する関数を明示的にマークする必要がある `annotation` モードで使用するものです。`infer` モードでは、コンパイラが命名パターン（コンポーネントは PascalCase、フックは `use` プレフィックス）に基づいてコンポーネントやフックを自動的に検出します。`infer` モードでコンポーネントやフックがコンパイルされない場合、`"use memo"` でコンパイルを強制するのではなく、命名規則のほうを修正してください。

</Note>

<InlineToc />

---

## リファレンス {/*reference*/}

### `"use memo"` {/*use-memo*/}

関数を React Compiler による最適化の対象としてマークするには、その関数の先頭に `"use memo"` を追加します。

```js {1}
function MyComponent() {
  "use memo";
  // ...
}
```

関数に `"use memo"` が含まれている場合、React Compiler はビルド時にその関数を解析して最適化します。コンパイラは値やコンポーネントを自動的にメモ化し、不要な再計算や再レンダーを防ぎます。

#### 注意点 {/*caveats*/}

* `"use memo"` は、インポートやその他のコードより前、関数本体の冒頭に置く必要があります（コメントは置くことができます）。
* ディレクティブはバッククォートではなく、ダブルクォートまたはシングルクォートで記述する必要があります。
* ディレクティブ文字列は `"use memo"` に完全に合致する必要があります。
* 関数内では最初のディレクティブのみが処理され、後続のディレクティブは無視されます。
* ディレクティブの効果は、[`compilationMode`](/reference/react-compiler/compilationMode) の設定によって異なります。

### `"use memo"` が関数を最適化対象としてマークする仕組み {/*how-use-memo-marks*/}

React Compiler を使用する React アプリでは、関数を最適化できるか判断するためにビルド時に解析が行われます。デフォルトでは、コンパイラがメモ化するコンポーネントを自動的に推論しますが、[`compilationMode`](/reference/react-compiler/compilationMode) を設定している場合は、その設定によって動作が変わることがあります。

`"use memo"` はデフォルトの動作を上書きし、関数を最適化対象として明示的にマークします。

* `annotation` モード：`"use memo"` がある関数のみが最適化される
* `infer` モード：コンパイラはヒューリスティックを使用するが、`"use memo"` により最適化が強制される
* `all` モード：デフォルトですべてが最適化されるため、`"use memo"` は冗長になる

このディレクティブにより、コードベース内で最適化されるコードとされないコードとの境界が明確になり、コンパイルプロセスを細かく制御できます。

### `"use memo"` を使用する場面 {/*when-to-use*/}

次のような場合は、`"use memo"` の使用を検討してください。

#### annotation モードを使用している場合 {/*annotation-mode-use*/}
`compilationMode: 'annotation'` では、最適化したいすべての関数にディレクティブが必要です。

```js
// ✅ This component will be optimized
function OptimizedList() {
  "use memo";
  // ...
}

// ❌ This component won't be optimized
function SimpleWrapper() {
  // ...
}
```

#### React Compiler を段階的に導入中の場合 {/*gradual-adoption*/}
`annotation` モードから始め、安定したコンポーネントを選択的に最適化します。

```js
// Start by optimizing leaf components
function Button({ onClick, children }) {
  "use memo";
  // ...
}

// Gradually move up the tree as you verify behavior
function ButtonGroup({ buttons }) {
  "use memo";
  // ...
}
```

---

## 使用法 {/*usage*/}

### さまざまなコンパイルモードで使用する {/*compilation-modes*/}

`"use memo"` の動作は、コンパイラの設定によって変わります。

```js
// babel.config.js
module.exports = {
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'annotation' // or 'infer' or 'all'
    }]
  ]
};
```

#### annotation モード {/*annotation-mode-example*/}
```js
// ✅ Optimized with "use memo"
function ProductCard({ product }) {
  "use memo";
  // ...
}

// ❌ Not optimized (no directive)
function ProductList({ products }) {
  // ...
}
```

#### infer モード（デフォルト） {/*infer-mode-example*/}
```js
// Automatically memoized because this is named like a Component
function ComplexDashboard({ data }) {
  // ...
}

// Skipped: Is not named like a Component
function simpleDisplay({ text }) {
  // ...
}
```

`infer` モードでは、コンパイラが命名パターン（コンポーネントは PascalCase、フックは `use` プレフィックス）に基づいてコンポーネントやフックを自動的に検出します。`infer` モードでコンポーネントやフックがコンパイルされない場合は、`"use memo"` でコンパイルを強制するのではなく、命名規則のほうを修正してください。

---

## トラブルシューティング {/*troubleshooting*/}

### 最適化を確認する {/*verifying-optimization*/}

コンポーネントが最適化されていることを確認するには、次のようにします。

1. ビルド内のコンパイル済み出力を確認する
2. React DevTools を使用して Memo ✨ バッジを確認する

### 関連項目 {/*see-also*/}

* [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) - コンパイルからオプトアウトする
* [`compilationMode`](/reference/react-compiler/compilationMode) - コンパイルの動作を設定する
* [React Compiler](/learn/react-compiler) - 入門ガイド