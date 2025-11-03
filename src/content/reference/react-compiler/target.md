---
title: target
---

<Intro>

`target` オプションは、コンパイラがどの React バージョン向けにコードを生成するか指定します。

</Intro>

```js
{
  target: '19' // or '18', '17'
}
```

<InlineToc />

---

## リファレンス {/*reference*/}

### `target` {/*target*/}

コンパイル出力の React バージョンの互換性を設定します。

#### Type {/*type*/}

```
'17' | '18' | '19'
```

#### デフォルト値 {/*default-value*/}

`'19'`

#### 有効な値 {/*valid-values*/}

- **`'19'`**：React 19 がターゲット（デフォルト）。追加のランタイムパッケージは不要です。
- **`'18'`**：React 18 がターゲット。`react-compiler-runtime` パッケージが必要です。
- **`'17'`**：React 17 がターゲット。`react-compiler-runtime` パッケージが必要です。

#### 注意点 {/*caveats*/}

- 数値ではなく文字列値を使用してください。（例：`17` ではなく `'17'`）
- パッチバージョンを含めないでください。（例：`'18.2.0'` ではなく `'18'`）
- React 19 にはコンパイラランタイム API が組み込みで含まれています。
- React 17 と 18 では `react-compiler-runtime@latest` のインストールが必要です。

---

## 使用法 {/*usage*/}

### React 19 がターゲットの場合（デフォルト） {/*targeting-react-19*/}

React 19 では特別な設定は不要です。

```js
{
  // defaults to target: '19'
}
```

コンパイラは React 19 組み込みのランタイム API を使用します。

```js
// Compiled output uses React 19's native APIs
import { c as _c } from 'react/compiler-runtime';
```

### React 17 または 18 が対象の場合 {/*targeting-react-17-or-18*/}

React 17 と React 18 のプロジェクトでは、2 つのステップが必要です。

1. ランタイムパッケージをインストールします。

```bash
npm install react-compiler-runtime@latest
```

2. ターゲットを設定します。

```js
// For React 18
{
  target: '18'
}

// For React 17
{
  target: '17'
}
```

コンパイラは両バージョンでポリフィルランタイムを使用します。

```js
// Compiled output uses the polyfill
import { c as _c } from 'react-compiler-runtime';
```

---

## トラブルシューティング {/*troubleshooting*/}

### コンパイラのランタイムが不足していることに関するランタイムエラー {/*missing-runtime*/}

"Cannot find module 'react/compiler-runtime'" のようなエラーが表示される場合は以下のようにします。

1. React バージョンを確認してください。
   ```bash
   npm why react
   ```

2. React 17 または 18 を使用している場合は、ランタイムをインストールしてください。
   ```bash
   npm install react-compiler-runtime@latest
   ```

3. ターゲットが React バージョンと一致していることを確認してください。
   ```js
   {
     target: '18' // Must match your React major version
   }
   ```

### ランタイムパッケージが動作しない {/*runtime-not-working*/}

ランタイムパッケージが以下を満たしていることを確認してください。

1. プロジェクト内にインストールされていること（グローバルではないこと）。
2. `package.json` の依存ライブラリとして記載されていること。
3. 正しいバージョンであること。（`@latest` タグ）
4. `devDependencies` に含まれていないこと（ランタイム時に必要なため）。

### コンパイル済み出力の確認 {/*checking-output*/}

正しくランタイムが使用されていることを確認するには、インポートが変わっていることに注目してください（組み込み版は `react/compiler-runtime`、React 17/18 のスタンドアロンパッケージ版では `react-compiler-runtime`）。

```js
// For React 19 (built-in runtime)
import { c } from 'react/compiler-runtime'
//                      ^

// For React 17/18 (polyfill runtime)
import { c } from 'react-compiler-runtime'
//                      ^
```