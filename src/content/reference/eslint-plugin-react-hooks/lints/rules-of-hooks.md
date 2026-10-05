---
title: rules-of-hooks
---

<Intro>

コンポーネントとフックが[フックのルール](/reference/rules/rules-of-hooks)に従っているか検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

React はレンダー間で state を正しく保持するために、フックが呼び出される順番を用います。コンポーネントがレンダーされるたびに、まったく同じフックがまったく同じ順序で呼び出されることを期待しています。フックを条件付きで呼び出したり、ループ内で呼び出したりすると、どの state がどのフック呼び出しに対応するのか React が分からなくなり、state の不一致や "Rendered fewer/more hooks than expected" といったエラーにつながります。

## よくある違反 {/*common-violations*/}

以下のパターンは、フックのルールに違反します。

- **条件分岐内でのフックの呼び出し**（`if`／`else`、三項演算子、`&&`／`||`）
- **ループ内でのフックの呼び出し** (`for`, `while`, `do-while`)
- **早期リターンの後でのフックの呼び出し**
- **コールバックやイベントハンドラ内でのフックの呼び出し**
- **非同期関数内でのフックの呼び出し**
- **クラスメソッド内でのフックの呼び出し**
- **モジュールレベルでのフックの呼び出し**

<Note>

### `use` フック {/*use-hook*/}

`use` フックは、他の React フックとは異なります。条件付きで呼び出すことも、ループ内で呼び出すこともできます。

```js
// ✅ `use` can be conditional
if (shouldFetch) {
  const data = use(fetchPromise);
}

// ✅ `use` can be in loops
for (const promise of promises) {
  results.push(use(promise));
}
```

ただし、`use` にも制約はあります。
- try/catch で囲むことはできません
- コンポーネントまたはフック内で呼び出す必要があります

詳細は、[`use` の API リファレンス](/reference/react/use)を参照してください。

</Note>

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Hook in condition
if (isLoggedIn) {
  const [user, setUser] = useState(null);
}

// ❌ Hook after early return
if (!data) return <Loading />;
const [processed, setProcessed] = useState(data);

// ❌ Hook in callback
<button onClick={() => {
  const [clicked, setClicked] = useState(false);
}}/>

// ❌ `use` in try/catch
try {
  const data = use(promise);
} catch (e) {
  // error handling
}

// ❌ Hook at module level
const globalState = useState(0); // Outside component
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
function Component({ isSpecial, shouldFetch, fetchPromise }) {
  // ✅ Hooks at top level
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  if (!isSpecial) {
    return null;
  }

  if (shouldFetch) {
    // ✅ `use` can be conditional
    const data = use(fetchPromise);
    return <div>{data}</div>;
  }

  return <div>{name}: {count}</div>;
}
```

## トラブルシューティング {/*troubleshooting*/}

### 条件に応じてデータをフェッチしたい {/*conditional-data-fetching*/}

以下では、useEffect を条件付きで呼び出そうとしています。

```js
// ❌ Conditional hook
if (isLoggedIn) {
  useEffect(() => {
    fetchUserData();
  }, []);
}
```

フックは無条件で呼び出すことにし、条件はその内部で確認してください。

```js
// ✅ Condition inside hook
useEffect(() => {
  if (isLoggedIn) {
    fetchUserData();
  }
}, [isLoggedIn]);
```

<Note>

データのフェッチには、useEffect 内で行うよりも良い方法があります。TanStack Query、useSWR、React Router 6.4 以降の利用を検討してください。これらは、リクエストの重複排除、レスポンスのキャッシュ、ネットワークウォーターフォールの回避に対応しています。

詳細は、[データのフェッチ](/learn/synchronizing-with-effects#fetching-data)を参照してください。

</Note>

### 状況に応じて別の state が欲しい {/*conditional-state-initialization*/}

以下では、state を条件付きで初期化しようとしています。

```js
// ❌ Conditional state
if (userType === 'admin') {
  const [permissions, setPermissions] = useState(adminPerms);
} else {
  const [permissions, setPermissions] = useState(userPerms);
}
```

useState は常に呼び出すようにし、初期値を条件に応じて設定してください。

```js
// ✅ Conditional initial value
const [permissions, setPermissions] = useState(
  userType === 'admin' ? adminPerms : userPerms
);
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

- `additionalEffectHooks`: エフェクトとして扱うカスタムフックにマッチする正規表現パターン。これにより、カスタムエフェクトフックから `useEffectEvent` や同様のイベント関数を呼び出せるようになります。

この共有設定は、`rules-of-hooks` と `exhaustive-deps` の両方のルールで使われ、フック関連のすべてのリントで一貫した動作が保証されます。
