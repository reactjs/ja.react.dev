---
title: gating
---

<Intro>

`gating` オプションは条件付きコンパイルを有効にし、最適化されたコードがランタイムでいつ使用されるか制御することができます。

</Intro>

```js
{
  gating: {
    source: 'my-feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

<InlineToc />

---

## リファレンス {/*reference*/}

### `gating` {/*gating*/}

コンパイルされた関数に対する、ランタイムのフィーチャーフラグによる制御を設定します。

#### Type {/*type*/}

```
{
  source: string;
  importSpecifierName: string;
} | null
```

#### デフォルト値 {/*default-value*/}

`null`

#### Properties {/*properties*/}

- **`source`**：フィーチャーフラグをインポートするモジュールパス
- **`importSpecifierName`**：インポートするエクスポートされた関数の名前

#### 注意点 {/*caveats*/}

- gating 関数は boolean を返す必要があります。
- コンパイル済みバージョンと元のバージョンの両方を含めるため、バンドルサイズが増加します。
- コンパイルされた関数を含むすべてのファイルでインポートされます。

---

## 使用法 {/*usage*/}

### 基本的なセットアップ {/*basic-setup*/}

1. フィーチャーフラグモジュールを作成します。

```js
// src/utils/feature-flags.js
export function shouldUseCompiler() {
  // your logic here
  return getFeatureFlag('react-compiler-enabled');
}
```

2. コンパイラを設定します。

```js
{
  gating: {
    source: './src/utils/feature-flags',
    importSpecifierName: 'shouldUseCompiler'
  }
}
```

3. コンパイラは gated コードを生成します。

```js
// Input
function Button(props) {
  return <button>{props.label}</button>;
}

// Output (simplified)
import { shouldUseCompiler } from './src/utils/feature-flags';

const Button = shouldUseCompiler()
  ? function Button_optimized(props) { /* compiled version */ }
  : function Button_original(props) { /* original version */ };
```

gating 関数はモジュール時に一度だけ評価されます。そのため JS バンドルが解析・評価されると、コンポーネントの選択はブラウザセッションの残りの期間、静的に維持されるので注意してください。

---

## トラブルシューティング {/*troubleshooting*/}

### フィーチャーフラグが動作しない場合 {/*flag-not-working*/}

フラグモジュールが正しい関数をエクスポートしているか確認してください。

```js
// ❌ Wrong: Default export
export default function shouldUseCompiler() {
  return true;
}

// ✅ Correct: Named export matching importSpecifierName
export function shouldUseCompiler() {
  return true;
}
```

### インポートエラーが発生する場合 {/*import-errors*/}

ソースのパスが正しいことを確認してください。

```js
// ❌ Wrong: Relative to babel.config.js
{
  source: './src/flags',
  importSpecifierName: 'flag'
}

// ✅ Correct: Module resolution path
{
  source: '@myapp/feature-flags',
  importSpecifierName: 'flag'
}

// ✅ Also correct: Absolute path from project root
{
  source: './src/utils/flags',
  importSpecifierName: 'flag'
}
```
