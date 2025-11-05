---
title: compilationMode
---

<Intro>

`compilationMode` オプションは、React Compiler がコンパイル対象の関数をどのように選択するか制御します。

</Intro>

```js
{
  compilationMode: 'infer' // or 'annotation', 'syntax', 'all'
}
```

<InlineToc />

---

## リファレンス {/*reference*/}

### `compilationMode` {/*compilationmode*/}

React Compiler が最適化する関数を決定する方法を制御します。

#### 型 {/*type*/}

```
'infer' | 'syntax' | 'annotation' | 'all'
```

#### デフォルト値 {/*default-value*/}

`'infer'`

#### 指定可能な値 {/*options*/}

- **`'infer'`**（デフォルト）: コンパイラは高度なヒューリスティックを使用して React コンポーネントとフックを識別します。
  - `"use memo"` ディレクティブで明示的にアノテーションされた関数
  - コンポーネント（パスカルケース）やフック（`use` プレフィックス）の規約で命名され、かつ、JSX の作成あるいは他のフックの呼び出しを行っている関数

- **`'annotation'`**: `"use memo"` ディレクティブで明示的にマークされた関数のみをコンパイルします。段階的導入に最適です。

- **`'syntax'`**: Flow の [component](https://flow.org/en/docs/react/component-syntax/) および [hook](https://flow.org/en/docs/react/hook-syntax/) 構文を使用するコンポーネントとフックのみをコンパイルします。

- **`'all'`**: すべてのトップレベル関数をコンパイルします。非 React 関数もコンパイルする可能性があるため推奨されません。

#### 注意点 {/*caveats*/}

- `'infer'` モードでは、関数が検出されるために React の命名規則に従う必要があります。
- `'all'` モードを使用すると、ユーティリティ関数がコンパイルされるためにパフォーマンスに悪影響を与える可能性があります。
- `'syntax'` モードでは Flow が必要で、TypeScript では動作しません。
- モードに関係なく、`"use no memo"` ディレクティブを持つ関数は常にスキップされます。

---

## 使用法 {/*usage*/}

### デフォルト推論モード {/*default-inference-mode*/}

デフォルトの `'infer'` モードは、React の慣習に従う大抵のコードベースでうまく動作します。

```js
{
  compilationMode: 'infer'
}
```

このモードでは、以下の関数がコンパイルされます。

```js
// ✅ Compiled: Named like a component + returns JSX
function Button(props) {
  return <button>{props.label}</button>;
}

// ✅ Compiled: Named like a hook + calls hooks
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, setCount];
}

// ✅ Compiled: Explicit directive
function expensiveCalculation(data) {
  "use memo";
  return data.reduce(/* ... */);
}

// ❌ Not compiled: Not a component/hook pattern
function calculateTotal(items) {
  return items.reduce((a, b) => a + b, 0);
}
```

### アノテーションモードを使用した段階的な導入 {/*incremental-adoption*/}

段階的な移行では、マークされた関数のみをコンパイルするために `'annotation'` モードを使用してください。

```js
{
  compilationMode: 'annotation'
}
```

その後に、コンパイルする関数を明示的にマークしていきます。

```js
// Only this function will be compiled
function ExpensiveList(props) {
  "use memo";
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// This won't be compiled without the directive
function NormalComponent(props) {
  return <div>{props.content}</div>;
}
```

### Flow syntax モードの使用方法 {/*flow-syntax-mode*/}

コードベースで TypeScript ではなく Flow を使用している場合は、以下のようにします。

```js
{
  compilationMode: 'syntax'
}
```

次に、Flow のコンポーネント構文を使用します。

```js
// Compiled: Flow component syntax
component Button(label: string) {
  return <button>{label}</button>;
}

// Compiled: Flow hook syntax
hook useCounter(initial: number) {
  const [count, setCount] = useState(initial);
  return [count, setCount];
}

// Not compiled: Regular function syntax
function helper(data) {
  return process(data);
}
```

### 特定の関数のオプトアウト {/*opting-out*/}

コンパイルモードに関係なく、`"use no memo"` を使用してコンパイルをスキップすることができます。

```js
function ComponentWithSideEffects() {
  "use no memo"; // Prevent compilation

  // This component has side effects that shouldn't be memoized
  logToAnalytics('component_rendered');

  return <div>Content</div>;
}
```

---

## トラブルシューティング {/*troubleshooting*/}

### infer モードでコンポーネントがコンパイルされない {/*component-not-compiled-infer*/}

`'infer'` モードでは、コンポーネントが React の慣習に従っていることを確認してください。

```js
// ❌ Won't be compiled: lowercase name
function button(props) {
  return <button>{props.label}</button>;
}

// ✅ Will be compiled: PascalCase name
function Button(props) {
  return <button>{props.label}</button>;
}

// ❌ Won't be compiled: doesn't create JSX or call hooks
function useData() {
  return window.localStorage.getItem('data');
}

// ✅ Will be compiled: calls a hook
function useData() {
  const [data] = useState(() => window.localStorage.getItem('data'));
  return data;
}
```
