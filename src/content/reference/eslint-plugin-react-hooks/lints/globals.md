---
title: globals
---

<Intro>

レンダー中にグローバル変数への代入・書き換えを行っていないか検証します。これは、[副作用はレンダーの外で実行しなければならない](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render)というルールを守るためのチェックの一部です。

</Intro>

## ルールの詳細 {/*rule-details*/}

グローバル変数は、React の管理外にあります。レンダー中に書き換えを行うと、レンダーは純粋であるべきという React の前提に反します。これにより、開発環境と本番環境でコンポーネントの動作が異なったり、Fast Refresh が動作しなくなったり、React Compiler などの機能によるアプリの最適化ができなくなったりする可能性があります。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Global counter
let renderCount = 0;
function Component() {
  renderCount++; // Mutating global
  return <div>Count: {renderCount}</div>;
}

// ❌ Modifying window properties
function Component({userId}) {
  window.currentUser = userId; // Global mutation
  return <div>User: {userId}</div>;
}

// ❌ Global array push
const events = [];
function Component({event}) {
  events.push(event); // Mutating global array
  return <div>Events: {events.length}</div>;
}

// ❌ Cache manipulation
const cache = {};
function Component({id}) {
  if (!cache[id]) {
    cache[id] = fetchData(id); // Modifying cache during render
  }
  return <div>{cache[id]}</div>;
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Use state for counters
function Component() {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(c => c + 1);
  };

  return (
    <button onClick={handleClick}>
      Clicked: {clickCount} times
    </button>
  );
}

// ✅ Use context for global values
function Component() {
  const user = useContext(UserContext);
  return <div>User: {user.id}</div>;
}

// ✅ Synchronize external state with React
function Component({title}) {
  useEffect(() => {
    document.title = title; // OK in effect
  }, [title]);

  return <div>Page: {title}</div>;
}
```
