---
title: createRef
---

<Pitfall>

`createRef` は主に[クラスコンポーネント](/reference/react/Component)で使用されます。関数コンポーネントでは通常代わりに [`useRef`](/reference/react/useRef) を用います。

</Pitfall>

<Intro>

`createRef` は任意の値を保持できる [ref](/learn/referencing-values-with-refs) オブジェクトを作成します。

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createRef()` {/*createref*/}

`createRef` を呼び出して、[クラスコンポーネント](/reference/react/Component)内で [ref](/learn/referencing-values-with-refs) を宣言します。

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

`createRef` は引数を取りません。

#### 返り値 {/*returns*/}

`createRef` は単一のプロパティを持つオブジェクトを返します。

* `current`: `null` に初期化されています。後で他の値にセットすることができます。JSX ノードの `ref` 属性として React に ref オブジェクトを渡すと、React はその `current` プロパティを適切にセットします。

#### 注意点 {/*caveats*/}

* `createRef` は常に*異なる*オブジェクトを返します。これは自分で `{ current: null }` を書くのと同等です。
* 関数コンポーネントでは、同じオブジェクトを常に返す [`useRef`](/reference/react/useRef) を代わりに使用することをお勧めします。
* `const ref = useRef()` は `const [ref, _] = useState(() => createRef(null))` と同等です。

---

## 使用法 {/*usage*/}

### クラスコンポーネントで ref を宣言する {/*declaring-a-ref-in-a-class-component*/}

[クラスコンポーネント](/reference/react/Component)内で ref を宣言するには、`createRef` を呼び出し、その結果をクラスフィールドに割り当てます。

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

これで JSX の `<input>` に `ref={this.inputRef}` を渡すと、React は `this.inputRef.current` を input の DOM ノードにセットします。例えば以下のようにして、input をフォーカスするボタンを作ることができます。

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` は主に[クラスコンポーネント](/reference/react/Component)で使用されます。関数コンポーネントでは通常代わりに [`useRef`](/reference/react/useRef) を用います。

</Pitfall>

---

## 代替手段 {/*alternatives*/}

### `createRef` を使ったクラスから `useRef` を使った関数への移行 {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

新しいコードでは[クラスコンポーネント](/reference/react/Component)の代わりに関数コンポーネントの使用を推奨します。以下に、`createRef` を使用している既存のクラスコンポーネントがある場合の移行方法を示します。こちらが元のコードです。

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

このコンポーネントを[クラスから関数に移行する](/reference/react/Component#alternatives)場合、`createRef` の呼び出しを [`useRef`](/reference/react/useRef) の呼び出しに置き換えます。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>
