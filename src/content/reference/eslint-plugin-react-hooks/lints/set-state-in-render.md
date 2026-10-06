---
title: set-state-in-render
---

<Intro>

余分なレンダーや無限レンダーループにつながる可能性のある、レンダー中の無条件な state 更新を行っていないか検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

レンダー中に無条件で `setState` を呼び出すと、現在のレンダーが終わる前に新しいレンダーがトリガされます。これにより、無限ループが発生し、アプリがクラッシュします。

## よくある違反 {/*common-violations*/}

### 無効な例 {/*invalid*/}

```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Unconditional setState directly in render
function Component({value}) {
  const [count, setCount] = useState(0);
  setCount(value); // Infinite loop!
  return <div>{count}</div>;
}
```

### 有効な例 {/*valid*/}

```js
// ✅ Derive during render
function Component({items}) {
  const sorted = [...items].sort(); // Just calculate it in render
  return <ul>{sorted.map(/*...*/)}</ul>;
}

// ✅ Set state in event handler
function Component() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Derive from props instead of setting state
function Component({user}) {
  const name = user?.name || '';
  const email = user?.email || '';
  return <div>{name}</div>;
}

// ✅ Conditionally derive state from props and state from previous renders
function Component({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) { // This condition makes it valid
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

## トラブルシューティング {/*troubleshooting*/}

### state を props と同期したい {/*clamp-state-to-prop*/}

よくある問題は、レンダーした後で state を「修正」しようとすることです。例えば、以下のようにカウンタが `max` プロパティの値を超えないようにしたいとします。

```js
// ❌ Wrong: clamps during render
function Counter({max}) {
  const [count, setCount] = useState(0);

  if (count > max) {
    setCount(max);
  }

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

`count` が `max` を超えると、すぐに無限ループが発生します。

代わりに、このロジックをイベント（最初に state を設定する場所）へ移す方が良い場合が多いです。例えば、state を更新する時点で、上限を超えないようにできます。

```js
// ✅ Clamp when updating
function Counter({max}) {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(current => Math.min(current + 1, max));
  };

  return <button onClick={increment}>{count}</button>;
}
```

これで、セッタはクリックに応じてのみ実行され、React はレンダーを正常に完了し、`count` が `max` を超えることはなくなります。

まれに、以前のレンダーの情報に基づいて state を調整する必要があるかもしれません。その場合は、条件付きで state を設定する[こちらのパターン](https://react.dev/reference/react/useState#storing-information-from-previous-renders)に従ってください。
