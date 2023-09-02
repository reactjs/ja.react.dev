---
title: findDOMNode
---

<Deprecated>

この API は、今後のメジャーバージョンの React で削除される予定です。[代替案を見る](#alternatives)

</Deprecated>

<Intro>

`findDOMNode` は、React [class component](/reference/react/Component) インスタンスのブラウザ DOM ノードを見つけます。

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

`findDOMNode` を呼び出して、指定された React [class component](/reference/react/Component) インスタンスのブラウザ DOM ノードを見つけます。

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `componentInstance`: [Component](/reference/react/Component) サブクラスのインスタンス。例えば、クラスコンポーネントにある this。


#### 返り値 {/*returns*/}

`findDOMNode` は、指定された `componentInstance` に最も近いブラウザ DOM ノードを返します。コンポーネントが `null` をレンダーする場合や `false` をレンダーする場合、`findDOMNode` は `null` を返します。コンポーネントが文字列をレンダーする場合は `findDOMNode` は値を含むテキスト DOM ノードを返します。

#### 注意点 {/*caveats*/}

* コンポーネントは、配列や複数の子要素を持つ [Fragment](/reference/react/Fragment) を返す場合もあります。その場合、`findDOMNode` は、最初の空ではない子に対応する DOM ノードを返します。

* `findDOMNode` はマウントされたコンポーネント（つまり、DOM に配置されたコンポーネント）でのみ動作します。まだマウントされていないコンポーネント内から呼び出そうとすると（例えば、まだ作成されていないコンポーネントの `render()` 内から `findDOMNode()` を呼び出す場合）、例外がスローされます。

* `findDOMNode` は、呼び出したときの結果のみを返します。子コンポーネントが後で異なるノードをレンダーする場合、この変更を通知されません。

* `findDOMNode` はクラスコンポーネントインスタンスを受け取るため、関数コンポーネントで使用することはできません。

---

## 使用法 {/*usage*/}

### クラスコンポーネントのルート DOM ノードを見つける {/*finding-the-root-dom-node-of-a-class-component*/}

[class component](reference/react/Component) インスタンス（通常は、`this`）を使用して `findDOMNode` を呼び出し、レンダーされた DOM ノードを見つけます。

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}
```

ここで、`input` 変数は `<input>` DOM 要素にセットされます。これにより、それを使用して何かを行うことができます。例えば、以下の "Show example" をクリックすると input はマウントされ、[`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) は input にあるすべてのテキストを選択します。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## 代替手段 {/*alternatives*/}

### ref からコンポーネントの独自の DOM ノードを読み取る {/*reading-components-own-dom-node-from-a-ref*/}

`findDOMNode` を使用するコードは壊れやすいです。なぜなら JSX ノードと対応する DOM ノードを操作するコードとの間の接続が明示的でないためです。例えば、この `<input />` を `<div>` でラップしてみてください。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

このコードは壊れます。なぜなら、`findDOMNode(this)` が `<div>` DOM ノードを見つけるようになったからですが、コードは `<input>` DOM ノードを期待しています。このような問題を避けるために、特定の DOM ノードを管理するために [`createRef`](/reference/react/createRef) を使用してください。

この例では、`findDOMNode` は使用されていません。代わりに、`inputRef = createRef(null)` がクラスのインスタンスフィールドとして定義されています。DOM ノードを読み取るには、`this.inputRef.current` を使用できます。それを JSX にアタッチするには、`<input ref={this.inputRef} />` をレンダーします。これにより、DOM ノードを使用するコードがその JSX に接続されます。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hello" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

クラスコンポーネントがないモダンな React では、代わりに [`useRef`](/reference/react/useRef) を呼び出すコードになります。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Hello" />
}
```

</Sandpack>

[refs を使用して DOM を操作する方法についての詳細はこちら](/learn/manipulating-the-dom-with-refs)

---

### forwarded ref から子コンポーネントの DOM ノードを読み取る {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

この例では、`findDOMNode(this)` は別のコンポーネントに属する DOM ノードを見つけます。`AutoselectingInput` は、ブラウザの `<input>` をレンダーする独自のコンポーネントである `MyInput` をレンダーします。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js MyInput.js
export default function MyInput() {
  return <input defaultValue="Hello" />;
}
```

</Sandpack>

`AutoselectingInput` 内にある `findDOMNode(this)` を呼び出すと、DOM の `<input>` を取得します。しかし、この `<input>` の JSX は `MyInput` コンポーネントの中に隠れています。この上の例では便利に思えますが、壊れやすいコードになりやすいです。後で MyInput を編集して、それをラップする `<div>` を追加するとどうなるでしょうか。`AutoselectingInput` のコードが壊れます（`<input>` が見つかることを期待している）。

この例の `findDOMNode` を置き換えるには、2 つのコンポーネントが連携する必要があります：

- 1.`AutoSelectingInput` は `ref` を宣言し、[前述の例](#reading-components-own-dom-node-from-a-ref)のように `<MyInput>` に渡す必要があります。
- 2.`MyInput` は `forwardRef` で宣言され、その `ref` を取り、それを `<input>` ノードに転送する必要があります。

このバージョンはそれを行うので、もはや `findDOMNode` は必要ありません。

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

以下は、クラスコンポーネントの代わりに関数コンポーネントを使用した場合のコードの見た目です：

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Show example
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Hello" />
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

---

### `<div>` 要素のラッパーを追加する {/*adding-a-wrapper-div-element*/}

コンポーネントは時々、子要素の位置やサイズを知る必要があります。`findDOMNode(this)` で子要素を見つけ、`getBoundingClientRect` のような測定するために DOM メソッドを使用できるのは魅力になります。

現在、このユースケースに直接対応できるものは存在しないため、`findDOMNode` が非推奨となっていますが、まだ完全に React から削除されていません。その間、コンテンツの周りにラッパーとして `<div>` ノードをレンダーし、そのノードへの ref を取得するという回避策を試すことができます。ただし、余分なラッパーはスタイリングを壊す可能性があります。

```js
<div ref={someRef}>
  {children}
</div>
```

これは、任意の子要素にフォーカスしたり、スクロールしたりする場合にも適用されます。
