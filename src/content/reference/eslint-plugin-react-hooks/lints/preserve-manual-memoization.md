---
title: preserve-manual-memoization
---

<Intro>

既存の手動メモ化がコンパイラによって保持されるか検証します。React Compiler は、その推論結果が[既存の手動メモ化と同等以上である](/learn/react-compiler/introduction#what-should-i-do-about-usememo-usecallback-and-reactmemo)場合にのみ、コンポーネントやフックをコンパイルします。

</Intro>

## ルールの詳細 {/*rule-details*/}

React Compiler は、既存の `useMemo`、`useCallback`、`React.memo` の呼び出しを保持します。手動でメモ化しているものがあれば、コンパイラはそれに十分な理由があるとみなし、削除しません。ただし、依存値が不足していると、コンパイラがコードのデータフローを理解して、さらなる最適化を適用することができなくなります。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Missing dependencies in useMemo
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data] // Missing 'filter' dependency
  );

  return <List items={filtered} />;
}

// ❌ Missing dependencies in useCallback
function Component({ onUpdate, value }) {
  const handleClick = useCallback(() => {
    onUpdate(value);
  }, [onUpdate]); // Missing 'value'

  return <button onClick={handleClick}>Update</button>;
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Complete dependencies
function Component({ data, filter }) {
  const filtered = useMemo(
    () => data.filter(filter),
    [data, filter] // All dependencies included
  );

  return <List items={filtered} />;
}

// ✅ Or let the compiler handle it
function Component({ data, filter }) {
  // No manual memoization needed
  const filtered = data.filter(filter);
  return <List items={filtered} />;
}
```

## トラブルシューティング {/*troubleshooting*/}

### 手動のメモ化は削除するべきか？ {/*remove-manual-memoization*/}

以下のような手動のメモ化は、React Compiler を使えば不要になるのかと思うかもしれません。

```js
// Do I still need this?
function Component({items, sortBy}) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      return a[sortBy] - b[sortBy];
    });
  }, [items, sortBy]);

  return <List items={sorted} />;
}
```

React Compiler を使っているなら、安全に削除できます。

```js
// ✅ Better: Let the compiler optimize
function Component({items, sortBy}) {
  const sorted = [...items].sort((a, b) => {
    return a[sortBy] - b[sortBy];
  });

  return <List items={sorted} />;
}
```