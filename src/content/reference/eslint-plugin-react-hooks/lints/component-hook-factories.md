---
title: component-hook-factories
---

<Intro>

コンポーネントやフックをネストして定義する高階関数 (higher order function) を使っていないか検証します。コンポーネントやフックは、モジュールレベルで定義するべきです。

</Intro>

## ルールの詳細 {/*rule-details*/}

関数内でコンポーネントやフックを定義すると、呼び出しのたびに新しい関数インスタンスが作成されます。React はそれぞれをまったく別のコンポーネントとして扱うため、コンポーネントツリー全体が破棄されて再作成され、すべての state が失われ、パフォーマンスの問題が発生します。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js {expectedErrors: {'react-compiler': [14]}}
// ❌ Factory function creating components
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Component defined inside component
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Hook factory function
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Component defined at module level
function Component({ defaultValue }) {
  // ...
}

// ✅ Custom hook at module level
function useData(endpoint) {
  // ...
}
```

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントの動作を動的に変えたい {/*dynamic-behavior*/}

以下のように、カスタマイズしたコンポーネントを作るにはファクトリが必要だと思うかもしれません。

```js
// ❌ Wrong: Factory pattern
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

代わりに、[JSX を children として渡して](/learn/passing-props-to-a-component#passing-jsx-as-children)ください。

```js
// ✅ Better: Pass JSX as children
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
    </>
  );
}
```
