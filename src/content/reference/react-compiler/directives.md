---
title: ディレクティブ
---

<Intro>
React Compiler のディレクティブは、特定の関数をコンパイルするかどうかを制御する特別な文字列リテラルです。
</Intro>

```js
function MyComponent() {
  "use memo"; // Opt this component into compilation
  return <div>{/* ... */}</div>;
}
```

<InlineToc />

---

## 概要 {/*overview*/}

React Compiler のディレクティブを使用することで、コンパイラがどの関数を最適化するかを細かく制御できます。ディレクティブは、関数本体の先頭またはモジュールの先頭に配置する文字列リテラルです。

### 利用可能なディレクティブ {/*available-directives*/}

* **[`"use memo"`](/reference/react-compiler/directives/use-memo)** - 関数をコンパイル対象に含める
* **[`"use no memo"`](/reference/react-compiler/directives/use-no-memo)** - 関数をコンパイル対象から除外する

### 比較表 {/*quick-comparison*/}

| ディレクティブ | 目的 | 使用する場面 |
|-----------|---------|-------------|
| [`"use memo"`](/reference/react-compiler/directives/use-memo) | コンパイルを強制 | `annotation` モードを使用する場合、または `infer` モードのヒューリスティックを上書きする場合 |
| [`"use no memo"`](/reference/react-compiler/directives/use-no-memo) | コンパイルを防止 | 問題をデバッグする場合、または互換性のないコードを扱う場合 |

---

## 使用法 {/*usage*/}

### 関数レベルのディレクティブ {/*function-level*/}

関数のコンパイルを制御するには、その関数の先頭にディレクティブを配置します。

```js
// Opt into compilation
function OptimizedComponent() {
  "use memo";
  return <div>This will be optimized</div>;
}

// Opt out of compilation
function UnoptimizedComponent() {
  "use no memo";
  return <div>This won't be optimized</div>;
}
```

### モジュールレベルのディレクティブ {/*module-level*/}

モジュール内のすべての関数に適用するには、ファイルの先頭にディレクティブを配置します。

```js
// At the very top of the file
"use memo";

// All functions in this file will be compiled
function Component1() {
  return <div>Compiled</div>;
}

function Component2() {
  return <div>Also compiled</div>;
}

// Can be overridden at function level
function Component3() {
  "use no memo"; // This overrides the module directive
  return <div>Not compiled</div>;
}
```

### コンパイルモードとの関係 {/*compilation-modes*/}

ディレクティブの動作は、[`compilationMode`](/reference/react-compiler/compilationMode) によって異なります。

* **`annotation` モード**：`"use memo"` がある関数のみをコンパイルする
* **`infer` モード**：コンパイラがコンパイル対象を決定し、ディレクティブがその決定を上書きする
* **`all` モード**：すべてをコンパイルし、`"use no memo"` で特定の関数を除外できる

---

## ベストプラクティス {/*best-practices*/}

### ディレクティブは必要な場合にのみ使用する {/*use-sparingly*/}

ディレクティブは避難ハッチです。プロジェクトレベルでコンパイラを設定することを優先してください。

```js
// ✅ Good - project-wide configuration
{
  plugins: [
    ['babel-plugin-react-compiler', {
      compilationMode: 'infer'
    }]
  ]
}

// ⚠️ Use directives only when needed
function SpecialCase() {
  "use no memo"; // Document why this is needed
  // ...
}
```

### ディレクティブの使用理由を記録する {/*document-usage*/}

ディレクティブを使用する理由を必ず説明してください。

```js
// ✅ Good - clear explanation
function DataGrid() {
  "use no memo"; // TODO: Remove after fixing issue with dynamic row heights (JIRA-123)
  // Complex grid implementation
}

// ❌ Bad - no explanation
function Mystery() {
  "use no memo";
  // ...
}
```

### 削除する予定を立てておく {/*plan-removal*/}

オプトアウト用のディレクティブは一時的なものにしてください。

1. ディレクティブを追加する際は TODO コメント付きにする
2. 追跡用の issue を作成する
3. 大元にある問題を修正する
4. ディレクティブを削除する

```js
function TemporaryWorkaround() {
  "use no memo"; // TODO: Remove after upgrading ThirdPartyLib to v2.0
  return <ThirdPartyComponent />;
}
```

---

## よくあるパターン {/*common-patterns*/}

### 段階的導入 {/*gradual-adoption*/}

大規模なコードベースに React Compiler を導入する場合は、次のようにします。

```js
// Start with annotation mode
{
  compilationMode: 'annotation'
}

// Opt in stable components
function StableComponent() {
  "use memo";
  // Well-tested component
}

// Later, switch to infer mode and opt out problematic ones
function ProblematicComponent() {
  "use no memo"; // Fix issues before removing
  // ...
}
```


---

## トラブルシューティング {/*troubleshooting*/}

ディレクティブに関する具体的な問題については、以下のトラブルシューティングセクションを参照してください。

* [`"use memo"` のトラブルシューティング](/reference/react-compiler/directives/use-memo#troubleshooting)
* [`"use no memo"` のトラブルシューティング](/reference/react-compiler/directives/use-no-memo#troubleshooting)

### よくある問題 {/*common-issues*/}

1. **ディレクティブが無視される**：配置（先頭である必要があります）とスペルを確認する
2. **コンパイルが引き続き実行される**：`ignoreUseNoForget` の設定を確認する
3. **モジュールのディレクティブが動作しない**：すべてのインポートより前にあることを確認する

---

## 関連項目 {/*see-also*/}

* [`compilationMode`](/reference/react-compiler/compilationMode) - コンパイラが最適化対象を選択する方法を設定する
* [設定](/reference/react-compiler/configuration) - コンパイラのすべての設定オプション
* [React Compiler のドキュメント](https://react.dev/learn/react-compiler) - 入門ガイド