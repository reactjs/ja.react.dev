---
title: logger
---

<Intro>

`logger` オプションは、コンパイル中の React Compiler イベントのカスタムログを提供します。

</Intro>

```js
{
  logger: {
    logEvent(filename, event) {
      console.log(`[Compiler] ${event.kind}: ${filename}`);
    }
  }
}
```

<InlineToc />

---

## リファレンス {/*reference*/}

### `logger` {/*logger*/}

コンパイラの動作を追跡し、エラーをデバッグするためのカスタムログを設定します。

#### Type {/*type*/}

```
{
  logEvent: (filename: string | null, event: LoggerEvent) => void;
} | null
```

#### デフォルト値 {/*default-value*/}

`null`

#### Methods {/*methods*/}

- **`logEvent`**: 各コンパイライベントに対して、ファイル名とイベント詳細と共に呼び出されます。

#### イベントタイプ {/*event-types*/}

- **`CompileSuccess`**： 関数が正常にコンパイルされた
- **`CompileError`**：エラーにより関数がスキップされた
- **`CompileDiagnostic`**：致命的でない診断情報
- **`CompileSkip`**：その他の理由で関数がスキップされた
- **`PipelineError`**：予期しないコンパイルエラー
- **`Timing`**：パフォーマンスの測定情報

#### 注意点 {/*caveats*/}

- イベントの構造はバージョン間で変更される可能性があります。
- 大きなコードベースは多くのログエントリを生成します。

---

## 使用方法 {/*usage*/}

### 基本的なログ {/*basic-logging*/}

コンパイルの成功と失敗を追跡します。

```js
{
  logger: {
    logEvent(filename, event) {
      switch (event.kind) {
        case 'CompileSuccess': {
          console.log(`✅ Compiled: ${filename}`);
          break;
        }
        case 'CompileError': {
          console.log(`❌ Skipped: ${filename}`);
          break;
        }
        default: {}
      }
    }
  }
}
```

### 詳細なエラーログ {/*detailed-error-logging*/}

コンパイル失敗に関する詳細な情報を取得します。

```js
{
  logger: {
    logEvent(filename, event) {
      if (event.kind === 'CompileError') {
        console.error(`\nCompilation failed: ${filename}`);
        console.error(`Reason: ${event.detail.reason}`);

        if (event.detail.description) {
          console.error(`Details: ${event.detail.description}`);
        }

        if (event.detail.loc) {
          const { line, column } = event.detail.loc.start;
          console.error(`Location: Line ${line}, Column ${column}`);
        }

        if (event.detail.suggestions) {
          console.error('Suggestions:', event.detail.suggestions);
        }
      }
    }
  }
}
```

