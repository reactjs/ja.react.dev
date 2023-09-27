---
title: isValidElement
---

<Intro>

`isValidElement` は値が React 要素 (React element) であるかどうかを確認します。

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

`isValidElement(value)` を呼び出して、`value` が React 要素であるかどうかを確認します。

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Not React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `value`: 確認対象の値。任意の型の値を指定できます。

#### 返り値 {/*returns*/}

`isValidElement` は `value` が React 要素であれば `true` を返します。それ以外の場合は `false` を返します。

#### 注意点 {/*caveats*/}

* **[JSX タグ](/learn/writing-markup-with-jsx)と [`createElement`](/reference/react/createElement) によって返されるオブジェクトだけが React 要素とみなされます**。例えば、`42` のような数値は有効な React *ノード (node)* ではあります（コンポーネントから返すことができるため）が、有効な React 要素ではありません。配列や、[`createPortal`](/reference/react-dom/createPortal) で作成されたポータルも、React 要素とは*見なされません*。

---

## 使用法 {/*usage*/}

### 値が React 要素かどうかを確認する {/*checking-if-something-is-a-react-element*/}

`isValidElement` を呼び出して、ある値が *React 要素*であるかどうかを確認します。

React 要素とは以下のようなものです。

- [JSX タグ](/learn/writing-markup-with-jsx)を書くことによって生成される値
- [`createElement`](/reference/react/createElement) を呼び出すことによって生成される値

React 要素に対しては、`isValidElement` は `true` を返します。

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX tags are React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Values returned by createElement are React elements
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

文字列、数値、または任意のオブジェクトや配列などの他の値は、React 要素ではありません。

それらに対しては、`isValidElement` は `false` を返します：

```js
// ❌ These are *not* React elements
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

`isValidElement` が必要となることは非常に稀です。主に、要素のみを受け入れる他の API（例えば [`cloneElement`](/reference/react/cloneElement) がそうです）を呼び出しており、引数が React 要素でないことによるエラーを避けたい場合に役立ちます。

`isValidElement` のチェックを追加するための特段の理由がない限り、おそらくこれは必要ありません。

<DeepDive>

#### React「要素」と React「ノード」 {/*react-elements-vs-react-nodes*/}

コンポーネントを書くとき、そこからは任意の *React ノード* を返すことができます。

```js
function MyComponent() {
  // ... you can return any React node ...
}
```

React ノードとは、以下のようなものです。

- `<div />` や `createElement('div')` のようにして作成された React 要素
- [`createPortal`](/reference/react-dom/createPortal) で作成されたポータル
- 文字列
- 数値
- `true`, `false`, `null`, `undefined`（これらは表示されません）
- 他の React ノードの配列

**`isValidElement` は引数が *React 要素*であるかどうかをチェックしますが、それが React ノードであるかどうかをチェックするわけではありません**。例えば、`42` は有効な React 要素ではありません。しかし、これは完全に有効な React ノードです。

```js
function MyComponent() {
  return 42; // It's ok to return a number from component
}
```

したがって、何かがレンダーできるかどうかをチェックする方法として `isValidElement` を使うべきではありません。

</DeepDive>
