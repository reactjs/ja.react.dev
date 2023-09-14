---
title: findDOMNode
---

<Deprecated>

この API は、今後のメジャーバージョンの React で削除される予定です。[代替案を見る](#alternatives)

</Deprecated>

<Intro>

`findDOMNode` は、React [クラスコンポーネント](/reference/react/Component)インスタンスに対応するブラウザ DOM ノードを見つけます。

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

`findDOMNode` を呼び出して、指定された React [クラスコンポーネント](/reference/react/Component)インスタンスに対応するブラウザ DOM ノードを見つけます。

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `componentInstance`: [`Component`](/reference/react/Component) サブクラスのインスタンス。例えばクラスコンポーネント内からの場合は `this` になります。


#### 返り値 {/*returns*/}

`findDOMNode` は、指定された `componentInstance` 内で最も上位にあるブラウザ DOM ノードを返します。コンポーネントが `null` をレンダーする場合や `false` をレンダーする場合、`findDOMNode` は `null` を返します。コンポーネントが文字列をレンダーする場合は `findDOMNode` はその値を含んでいるテキスト DOM ノードを返します。

#### 注意点 {/*caveats*/}

* コンポーネントは、配列や、複数の子要素を持つ[フラグメント](/reference/react/Fragment)を返す場合もあります。その場合 `findDOMNode` は、最初の空ではない子に対応する DOM ノードを返します。

* `findDOMNode` はマウントされたコンポーネント（つまり、DOM に配置されたコンポーネント）でのみ動作します。まだマウントされていないコンポーネント内から呼び出そうとすると（例えば、まだ作成されていないコンポーネントの `render()` 内から `findDOMNode()` を呼び出す場合）、例外がスローされます。

* `findDOMNode` は、呼び出したときの結果のみを返します。子コンポーネントが後で異なるノードをレンダーする場合、この変更は通知されません。

* `findDOMNode` はクラスコンポーネントインスタンスを受け取るため、関数コンポーネントで使用することはできません。

---

## 使用法 {/*usage*/}

### クラスコンポーネントのルート DOM ノードを見つける {/*finding-the-root-dom-node-of-a-class-component*/}

[クラスコンポーネント](/reference/react/Component)インスタンス（通常は、`this`）を引数にして `findDOMNode` を呼び出し、レンダーされた DOM ノードを見つけます。

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

この例では、`input` 変数は `<input>` DOM 要素にセットされます。これにより、それを使用して何かを行うことができます。例えば、以下の "Show example" をクリックすると入力欄がマウントされ、[`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) が入力欄のすべてのテキストを選択します。

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

### ref でコンポーネント自身の DOM ノードを読み取る {/*reading-components-own-dom-node-from-a-ref*/}

`findDOMNode` を使用しているコードは容易に壊れてしまいます。なぜなら JSX ノードと対応する DOM ノードを操作するコード間の接続が明示的でないためです。例えば、以下の `<input />` を `<div>` でラップしてみてください。

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

コードは壊れてしまいます。なぜなら、`<input>` DOM ノードを期待していたのに、`findDOMNode(this)` が `<div>` DOM ノードの方を見つけてくるようになったためです。このような問題を避けるには、特定の DOM ノードを管理するために [`createRef`](/reference/react/createRef) を使用してください。

以下の例では、`findDOMNode` はもう使用されていません。代わりに、`inputRef = createRef(null)` がクラスのインスタンスフィールドとして定義されています。DOM ノードを読み取るには、`this.inputRef.current` を使用できます。それを JSX にアタッチするには、`<input ref={this.inputRef} />` のようにレンダーします。これにより、DOM ノードを使用するコードがその JSX に接続されます。

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

クラスコンポーネントがないモダンな React では、同等のコードにおいて代わりに [`useRef`](/reference/react/useRef) を呼び出します。

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

[ref を使用して DOM を操作する方法についての詳細はこちら](/learn/manipulating-the-dom-with-refs)

---

### 転送された ref から子コンポーネントの DOM ノードを読み取る {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

以下の例では、`findDOMNode(this)` は別のコンポーネントに属する DOM ノードを見つけます。`AutoselectingInput` は `MyInput` をレンダーし、このカスタムコンポーネントはブラウザの `<input>` をレンダーします。

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

`AutoselectingInput` 内で `findDOMNode(this)` を呼び出すことで、DOM 要素である `<input>` が取得されたことに注意してください。対応する JSX が `MyInput` コンポーネントの中に隠蔽されているにも関わらず、こうなります。この例では便利に思えますが、壊れやすいコードになってしまいます。後で `MyInput` を編集して、`<input>` の周りに `<div>` を追加するとどうなるでしょうか。（`<input>` が見つかることを期待している）`AutoselectingInput` のコードが壊れてしまいます。

この例の `findDOMNode` を置き換えるには、2 つのコンポーネントが連携する必要があります：

1. `AutoSelectingInput` は[前述の例](#reading-components-own-dom-node-from-a-ref)のように `ref` を宣言して `<MyInput>` に渡す必要があります。
2. `MyInput` を `forwardRef` 付きで宣言するようにし、`ref` を受け取って `<input>` ノードに転送する必要があります。

上記を行ったバージョンを以下に示します。もはや `findDOMNode` は必要ありません。

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

クラスの代わりに関数コンポーネントを使用する場合、コードは以下のようになります。

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

### `<div>` 要素のラッパを追加する {/*adding-a-wrapper-div-element*/}

コンポーネントによっては子要素の位置やサイズを知る必要があります。この場合、`findDOMNode(this)` で子要素を見つけ、[`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) のような DOM メソッドを使って計測を行いたくなるかもしれません。

現在、このユースケースに直接対応できるものは存在しません。これが `findDOMNode` が非推奨となっているにも関わらずまだ完全に React から削除されていない理由です。当面は、コンテンツの周りにラッパとして `<div>` ノードをレンダーし、そのノードへの ref を取得するという回避策をお試しください。ただし、余分なラッパはスタイリングを壊す可能性があります。

```js
<div ref={someRef}>
  {children}
</div>
```

任意の子要素にフォーカスやスクロールを行いたい場合も同様です。
