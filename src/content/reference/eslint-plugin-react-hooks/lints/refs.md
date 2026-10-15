---
title: refs
---

<Intro>

レンダー中に読み書きせずに ref を正しく使っているかについて検証します。[`useRef()` の使用法](/reference/react/useRef#usage)にある「落とし穴」の節を参照してください。

</Intro>

## ルールの詳細 {/*rule-details*/}

ref は、レンダーに使われない値を保持します。state とは異なり、ref を変更しても再レンダーは起きません。レンダー中に `ref.current` を読み書きすると、React の前提に反します。読み取ろうとしたときに ref が初期化されていなかったり、値が古くなっていたり、一貫性がなかったりする可能性があります。

## ref を検出する方法 {/*how-it-detects-refs*/}

リンタは、ref だと分かっている値にのみ、これらのルールを適用します。コンパイラが以下のいずれかのパターンを見つけると、その値は ref だと推論されます。

- `useRef()` または `React.createRef()` から返された値。

  ```js
  const scrollRef = useRef(null);
  ```

- 名前が `ref`、または末尾が `Ref` で、その `.current` が読み書きされる識別子。

  ```js
  buttonRef.current = node;
  ```

- JSX の `ref` プロパティを通じて渡される値（例えば `<div ref={someRef} />`）。

  ```jsx
  <input ref={inputRef} />
  ```

ある値が ref だと判断されると、その推論は、代入や分割代入、ヘルパ関数の呼び出しを経ても、その値に引き継がれます。これにより、ref を引数として受け取った別の関数内で `ref.current` にアクセスしている場合でも、リンタは違反を報告できます。

## よくある違反 {/*common-violations*/}

- レンダー中に `ref.current` を読み取る
- レンダー中に ref を更新する
- state にすべき値に ref を使う

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Reading ref during render
function Component() {
  const ref = useRef(0);
  const value = ref.current; // Don't read during render
  return <div>{value}</div>;
}

// ❌ Modifying ref during render
function Component({value}) {
  const ref = useRef(null);
  ref.current = value; // Don't modify during render
  return <div />;
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Read ref in effects/handlers
function Component() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      console.log(ref.current.offsetWidth); // OK in effect
    }
  });

  return <div ref={ref} />;
}

// ✅ Use state for UI values
function Component() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Lazy initialization of ref value
function Component() {
  const ref = useRef(null);

  // Initialize only once on first use
  if (ref.current === null) {
    ref.current = expensiveComputation(); // OK - lazy initialization
  }

  const handleClick = () => {
    console.log(ref.current); // Use the initialized value
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## トラブルシューティング {/*troubleshooting*/}

### `.current` を持つだけのプレーンなオブジェクトがリントで指摘された {/*plain-object-current*/}

名前に基づく判定では、`ref.current` と `fooRef.current` を意図的に本物の ref として扱います。独自のコンテナオブジェクトを作っている場合は、別の名前（例えば `box`）を選ぶか、書き換え可能な値を state に移動してください。名前を変えることでコンパイラがその値を ref だと推論しなくなるため、このリントの対象から外れます。
