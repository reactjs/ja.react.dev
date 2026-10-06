---
title: error-boundaries
---

<Intro>

子コンポーネントのエラーを、エラーバウンダリではなく try/catch で処理しようとしていないか検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

React のレンダー処理中に起きるエラーは、try/catch ブロックではキャッチできません。レンダーを行うメソッドやフック内でスローされたエラーは、コンポーネントツリーを上へと伝播します。これらのエラーをキャッチできるのは、[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)だけです。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Try/catch won't catch render errors
function Parent() {
  try {
    return <ChildComponent />; // If this throws, catch won't help
  } catch (error) {
    return <div>Error occurred</div>;
  }
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Using error boundary
function Parent() {
  return (
    <ErrorBoundary>
      <ChildComponent />
    </ErrorBoundary>
  );
}
```

## トラブルシューティング {/*troubleshooting*/}

### なぜ `use` を `try`/`catch` で囲まないようにリンタに指摘されるのか {/*why-is-the-linter-telling-me-not-to-wrap-use-in-trycatch*/}

`use` フックは、通常の意味でエラーをスローするのではなく、コンポーネントの実行をサスペンドします。`use` が処理中のプロミスを受け取ると、コンポーネントをサスペンドし、React にフォールバックを表示させます。このようなケースに対応できるのは、サスペンスとエラーバウンダリだけです。`catch` ブロックが実行されることはないため、混乱を避けるために、リンタは `use` を `try`/`catch` で囲むことに対して警告します。

```js {expectedErrors: {'react-compiler': [5]}}
// ❌ Try/catch around `use` hook
function Component({promise}) {
  try {
    const data = use(promise); // Won't catch - `use` suspends, not throws
    return <div>{data}</div>;
  } catch (error) {
    return <div>Failed to load</div>; // Unreachable
  }
}

// ✅ Error boundary catches `use` errors
function App() {
  return (
    <ErrorBoundary fallback={<div>Failed to load</div>}>
      <Suspense fallback={<div>Loading...</div>}>
        <DataComponent promise={fetchData()} />
      </Suspense>
    </ErrorBoundary>
  );
}
```