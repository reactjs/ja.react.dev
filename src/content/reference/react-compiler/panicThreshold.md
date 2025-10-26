---
title: panicThreshold
---

<Intro>

`panicThreshold` オプションは、コンパイル時のエラーを React Compiler がどのように処理するかを制御します。

</Intro>

```js
{
  panicThreshold: 'none' // Recommended
}
```

<InlineToc />

---

## リファレンス {/*reference*/}

### `panicThreshold` {/*panicthreshold*/}

コンパイルエラーでビルドを失敗させるか、最適化をスキップするかを決定します。

#### Type {/*type*/}

```
'none' | 'critical_errors' | 'all_errors'
```

#### デフォルト値 {/*default-value*/}

`'none'`

#### オプション {/*options*/}

- **`'none'`**（デフォルト、推奨）：コンパイルできないコンポーネントをスキップしてビルドを継続します。
- **`'critical_errors'`**：クリティカルなコンパイラエラーの場合のみビルドを失敗します。
- **`'all_errors'`**：コンパイラの診断情報があればビルドを失敗します。

#### 注意点 {/*caveats*/}

- 本番ビルドでは常に `'none'` を使用してください。
- ビルドの失敗により、アプリケーションのビルドが妨げられます。
- コンパイラは `'none'` で問題のあるコードを自動的に検出してスキップします。
- より高い閾値は開発中のデバッグ時にのみ有用です。

---

## 使用方法 {/*usage*/}

### 本番設定（推奨） {/*production-configuration*/}

本番ビルドでは常に `'none'` を使用します。これがデフォルト値です。

```js
{
  panicThreshold: 'none'
}
```

これにより以下が保証されます。
- コンパイラの問題でビルドが失敗することはありません。
- 最適化できないコンポーネントは通常通り実行されます。
- 最大数のコンポーネントが最適化されます。
- 安定した本番デプロイがされます。

### 開発時のデバッグ {/*development-debugging*/}

問題を見つけるために、一時的により厳しい閾値を使用します。

```js
const isDevelopment = process.env.NODE_ENV === 'development';

{
  panicThreshold: isDevelopment ? 'critical_errors' : 'none',
  logger: {
    logEvent(filename, event) {
      if (isDevelopment && event.kind === 'CompileError') {
        // ...
      }
    }
  }
}
```