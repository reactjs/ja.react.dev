---
title: purity
---

<Intro>

既知の純粋でない関数を呼び出していないかチェックすることで、[コンポーネントやフックが純粋である](/reference/rules/components-and-hooks-must-be-pure)ことを検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

React コンポーネントは純関数でなければなりません。同じ props が与えられたら、常に同じ JSX を返すべきです。レンダー中に `Math.random()` や `Date.now()` などの関数を使うと、毎回異なる出力が生成されるため、React の前提に反し、ハイドレーションの不一致や誤ったメモ化、予測できない動作といったバグを引き起こします。

## よくある違反 {/*common-violations*/}

一般に、同じ入力に対して異なる値を返す API は、このルールに違反します。よくある例は以下のとおりです。

- `Math.random()`
- `Date.now()` / `new Date()`
- `crypto.randomUUID()`
- `performance.now()`

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Math.random() in render
function Component() {
  const id = Math.random(); // Different every render
  return <div key={id}>Content</div>;
}

// ❌ Date.now() for values
function Component() {
  const timestamp = Date.now(); // Changes every render
  return <div>Created at: {timestamp}</div>;
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Stable IDs from initial state
function Component() {
  const [id] = useState(() => crypto.randomUUID());
  return <div key={id}>Content</div>;
}
```

## トラブルシューティング {/*troubleshooting*/}

### 現在の時刻を表示したい {/*current-time*/}

以下のようにレンダー中に `Date.now()` を呼び出すと、コンポーネントが純粋ではなくなります。

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Wrong: Time changes every render
function Clock() {
  return <div>Current time: {Date.now()}</div>;
}
```

代わりに、[非純粋な関数はレンダーの外に移動](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent)してください。

```js
function Clock() {
  const [time, setTime] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Current time: {time}</div>;
}
```