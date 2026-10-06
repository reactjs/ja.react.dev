---
title: use-memo
---

<Intro>

`useMemo` フックが返り値を伴って使われているか検証します。詳細は、[`useMemo` のドキュメント](/reference/react/useMemo)を参照してください。

</Intro>

## ルールの詳細 {/*rule-details*/}

`useMemo` は、計算コストの高い値を計算してキャッシュするためのものであり、副作用を実行するためのものではありません。返り値がないと、`useMemo` は `undefined` を返し、その目的を果たせません。おそらく、使うフックを間違えているということです。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ No return value
function Component({ data }) {
  const processed = useMemo(() => {
    data.forEach(item => console.log(item));
    // Missing return!
  }, [data]);

  return <div>{processed}</div>; // Always undefined
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Returns computed value
function Component({ data }) {
  const processed = useMemo(() => {
    return data.map(item => item * 2);
  }, [data]);

  return <div>{processed}</div>;
}
```

## トラブルシューティング {/*troubleshooting*/}

### 依存値が変わったときに副作用を実行したい {/*side-effects*/}

以下では、副作用のために `useMemo` を使おうとしています。

{/* TODO(@poteto) fix compiler validation to check for unassigned useMemos */}
```js {expectedErrors: {'react-compiler': [4]}}
// ❌ Wrong: Side effects in useMemo
function Component({user}) {
  // No return value, just side effect
  useMemo(() => {
    analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);

  // Not assigned to a variable
  useMemo(() => {
    return analytics.track('UserViewed', {userId: user.id});
  }, [user.id]);
}
```

ユーザの操作に応じて副作用を実行する必要がある場合は、その副作用をイベントの処理と同じ場所に置くのが最善です。

```js
// ✅ Good: Side effects in event handlers
function Component({user}) {
  const handleClick = () => {
    analytics.track('ButtonClicked', {userId: user.id});
    // Other click logic...
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

副作用によって React の state を外部の状態と同期する（またはその逆を行う）場合は、`useEffect` を使ってください。

```js
// ✅ Good: Synchronization in useEffect
function Component({theme}) {
  useEffect(() => {
    localStorage.setItem('preferredTheme', theme);
    document.body.className = theme;
  }, [theme]);

  return <div>Current theme: {theme}</div>;
}
```
