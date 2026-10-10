---
title: "use no memo"
titleForTitleTag: "'use no memo' ディレクティブ"
---

<Intro>

`"use no memo"` は、React Compiler が関数を最適化しないようにします。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `"use no memo"` {/*use-no-memo*/}

React Compiler による最適化を防ぐには、関数の先頭に `"use no memo"` を追加します。

```js {1}
function MyComponent() {
  "use no memo";
  // ...
}
```

関数に `"use no memo"` が含まれている場合、React Compiler は最適化の際にその関数を完全にスキップします。これは、デバッグを行う場合やコンパイラで正しく動作しないコードを扱う場合に、一時的な避難ハッチとして役立ちます。

#### 注意点 {/*caveats*/}

* `"use no memo"` は、インポートやその他のコードより前、関数本体の冒頭に置く必要があります（コメントは置くことができます）。
* ディレクティブはバッククォートではなく、ダブルクォートまたはシングルクォートで記述する必要があります。
* ディレクティブ文字列は `"use no memo"` またはその別名である `"use no forget"` に完全に合致する必要があります。
* このディレクティブは、すべてのコンパイルモードや他のディレクティブよりも優先されます。
* 恒久的な解決策ではなく、一時的なデバッグツールとして使用することを意図しています。

### `"use no memo"` によって最適化からオプトアウトする仕組み {/*how-use-no-memo-opts-out*/}

React Compiler は最適化を適用するため、ビルド時にコードを解析します。`"use no memo"` は、関数を完全にスキップするようコンパイラに指示する明示的な境界を作ります。

このディレクティブは他のすべての設定よりも優先されます。
* `all` モード：グローバル設定にかかわらず、その関数はスキップされる
* `infer` モード：ヒューリスティックでは最適化対象になる場合でも、その関数はスキップされる

コンパイラはこれらの関数を React Compiler が有効化されていない場合と同様に扱い、記述されたとおり変更せずに残します。

### `"use no memo"` を使用する場面 {/*when-to-use*/}

`"use no memo"` は、必要な場合にのみ一時的に使用してください。よくある使用場面は次のとおりです。

#### コンパイラの問題をデバッグする {/*debugging-compiler*/}
コンパイラが問題を引き起こしている疑いがある場合は、一時的に最適化を無効にして問題を切り分けます。

```js
function ProblematicComponent({ data }) {
  "use no memo"; // TODO: Remove after fixing issue #123

  // Rules of React violations that weren't statically detected
  // ...
}
```

#### サードパーティライブラリと統合する {/*third-party*/}
コンパイラと互換性がない可能性のあるライブラリと統合する場合は、次のようにします。

```js
function ThirdPartyWrapper() {
  "use no memo";

  useThirdPartyHook(); // Has side effects that compiler might optimize incorrectly
  // ...
}
```

---

## 使用法 {/*usage*/}

React Compiler が関数を最適化しないようにするには、関数本体の先頭に `"use no memo"` ディレクティブを配置します。

```js
function MyComponent() {
  "use no memo";
  // Function body
}
```

モジュール内のすべての関数に適用するには、ファイルの先頭にディレクティブを配置することもできます。

```js
"use no memo";

// All functions in this file will be skipped by the compiler
```

関数レベルの `"use no memo"` は、モジュールレベルのディレクティブを上書きします。

---

## トラブルシューティング {/*troubleshooting*/}

### ディレクティブでコンパイルを防止できない {/*not-preventing*/}

`"use no memo"` が動作しない場合は以下を確認してください。

```js
// ❌ Wrong - directive after code
function Component() {
  const data = getData();
  "use no memo"; // Too late!
}

// ✅ Correct - directive first
function Component() {
  "use no memo";
  const data = getData();
}
```

次の点も確認してください。
* スペル - `"use no memo"` と完全合致する必要がある
* 引用符 - バッククォートではなく、シングルクォートまたはダブルクォートを使用する必要がある

### ベストプラクティス {/*best-practices*/}

最適化を無効にする**理由を必ず記録してください**。

```js
// ✅ Good - clear explanation and tracking
function DataProcessor() {
  "use no memo"; // TODO: Remove after fixing rule of react violation
  // ...
}

// ❌ Bad - no explanation
function Mystery() {
  "use no memo";
  // ...
}
```

### 関連項目 {/*see-also*/}

* [`"use memo"`](/reference/react-compiler/directives/use-memo) - コンパイルにオプトインする
* [React Compiler](/learn/react-compiler) - 入門ガイド