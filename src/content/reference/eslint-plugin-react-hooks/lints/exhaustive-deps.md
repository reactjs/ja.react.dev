---
title: exhaustive-deps
---

<Intro>

React フックの依存配列に、必要な依存値がすべて含まれているか検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

`useEffect`、`useMemo`、`useCallback` などの React フックは、依存配列を受け取ります。これらのフック内で参照する値が依存配列に含まれていないと、その依存値が変わっても React はエフェクトの再実行や値の再計算を行いません。これにより、フックが古くなった値を使い続ける、古いクロージャ (stale closure) の問題が発生します。

## よくある違反 {/*common-violations*/}

このエラーは、エフェクトが実行されるタイミングを制御しようとして、依存値について React を「だまそう」としたときによく起こります。エフェクトは、コンポーネントと外部システムを同期するためのものです。依存配列はエフェクトが使う値を React に伝えることで、いつ再同期すべきか判断できるようにします。

リンタと格闘しているようなら、コードの構造を見直す必要があるでしょう。方法については、[エフェクトから依存値を取り除く](/learn/removing-effect-dependencies)を参照してください。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Missing dependency
useEffect(() => {
  console.log(count);
}, []); // Missing 'count'

// ❌ Missing prop
useEffect(() => {
  fetchUser(userId);
}, []); // Missing 'userId'

// ❌ Incomplete dependencies
useMemo(() => {
  return items.sort(sortOrder);
}, [items]); // Missing 'sortOrder'
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ All dependencies included
useEffect(() => {
  console.log(count);
}, [count]);

// ✅ All dependencies included
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

## トラブルシューティング {/*troubleshooting*/}

### 関数を依存配列に追加すると無限ループが起きる {/*function-dependency-loops*/}

以下では、エフェクトがありますが、レンダーのたびに新しい関数を作成しています。

```js
// ❌ Causes infinite loop
const logItems = () => {
  console.log(items);
};

useEffect(() => {
  logItems();
}, [logItems]); // Infinite loop!
```

ほとんどの場合、このエフェクトは不要です。代わりに、アクションが起きる場所で関数を呼び出してください。

```js
// ✅ Call it from the event handler
const logItems = () => {
  console.log(items);
};

return <button onClick={logItems}>Log</button>;

// ✅ Or derive during render if there's no side effect
items.forEach(item => {
  console.log(item);
});
```

エフェクトが本当に必要な場合（例えば、外部の何かをサブスクライブする場合）は、依存値を安定させてください。

```js
// ✅ useCallback keeps the function reference stable
const logItems = useCallback(() => {
  console.log(items);
}, [items]);

useEffect(() => {
  logItems();
}, [logItems]);

// ✅ Or move the logic straight into the effect
useEffect(() => {
  console.log(items);
}, [items]);
```

### エフェクトを 1 回だけ実行する {/*effect-on-mount*/}

マウント時にエフェクトを 1 回だけ実行したいのに、依存値が不足しているとリンタに指摘されています。

```js
// ❌ Missing dependency
useEffect(() => {
  sendAnalytics(userId);
}, []); // Missing 'userId'
```

依存値を依存配列に含める（推奨）か、本当に 1 回だけ実行する必要があるなら ref を使ってください。

```js
// ✅ Include dependency
useEffect(() => {
  sendAnalytics(userId);
}, [userId]);

// ✅ Or use a ref guard inside an effect
const sent = useRef(false);

useEffect(() => {
  if (sent.current) {
    return;
  }

  sent.current = true;
  sendAnalytics(userId);
}, [userId]);
```

## オプション {/*options*/}

ESLint の共有設定を使って、カスタムエフェクトフックを設定できます（`eslint-plugin-react-hooks` 6.1.1 以降で利用可能）。

```js
{
  "settings": {
    "react-hooks": {
      "additionalEffectHooks": "(useMyEffect|useCustomEffect)"
    }
  }
}
```

- `additionalEffectHooks`: 依存値網羅性チェックの対象となるカスタムフック名にマッチする正規表現パターン。この設定は、すべての `react-hooks` ルールで共有されます。

後方互換性のため、このルールはルール単位のオプションも受け付けます。

```js
{
  "rules": {
    "react-hooks/exhaustive-deps": ["warn", {
      "additionalHooks": "(useMyCustomHook|useAnotherHook)"
    }]
  }
}
```

- `additionalHooks`: 依存値網羅性チェックの対象となるカスタムフック名にマッチする正規表現パターン。**注意**：このルール単位のオプションを指定すると、共有の `settings` 設定よりも優先されます。
