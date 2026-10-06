---
title: static-components
---

<Intro>

コンポーネントが静的であり、レンダーのたびに再作成されていないことを検証します。動的に再作成されるコンポーネントは、state のリセットや過剰な再レンダーを引き起こす可能性があります。

</Intro>

## ルールの詳細 {/*rule-details*/}

他のコンポーネント内で定義したコンポーネントは、レンダーのたびに再作成されます。React はそれぞれをまったく新しいコンポーネント型として扱うため、古いものをアンマウントし、新しいものをマウントします。その過程で、state と DOM ノードがすべて破棄されてしまいます。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Component defined inside component
function Parent() {
  const ChildComponent = () => { // New component every render!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // State resets every render
}

// ❌ Dynamic component creation
function Parent({type}) {
  const Component = type === 'button'
    ? () => <button>Click</button>
    : () => <div>Text</div>;

  return <Component />;
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Components at module level
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button'
    ? ButtonComponent  // Reference existing component
    : TextComponent;

  return <Component />;
}
```

## トラブルシューティング {/*troubleshooting*/}

### 条件に応じて別のコンポーネントをレンダーしたい {/*conditional-components*/}

以下のように、ローカルの state にアクセスする目的で、コンポーネントの内側でコンポーネントを定義したいのかもしれません。

```js {expectedErrors: {'react-compiler': [13]}}
// ❌ Wrong: Inner component to access parent state
function Parent() {
  const [theme, setTheme] = useState('light');

  function ThemedButton() { // Recreated every render!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }

  return <ThemedButton />;
}
```

代わりに、データを props として渡してください。

```js
// ✅ Better: Pass props to static component
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

<Note>

ローカル変数にアクセスするために、他のコンポーネントの内側でコンポーネントを定義したくなったら、それは代わりに props を渡すべきだというサインです。そうすることで、コンポーネントの再利用やテストが容易になります。

</Note>