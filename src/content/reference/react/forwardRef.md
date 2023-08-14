---
title: forwardRef
---

<Intro>

`forwardRef` は、親コンポーネントに対して DOM ノードを [ref](/learn/manipulating-the-dom-with-refs) として公開できるようにします。

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

`forwardRef()` を呼び出すことで、コンポーネントが ref を受け取ってそれを子コンポーネントに転送 (forward) できるようになります。

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `render`: コンポーネントのレンダー関数です。React はこの関数を親から受け取った props および `ref` とともに呼び出します。返す JSX がコンポーネントの出力となります。

#### 返り値 {/*returns*/}

`forwardRef` は JSX でレンダーできる React コンポーネントを返します。プレーンな関数として定義された React コンポーネントとは異なり、`forwardRef` によって返されるコンポーネントは `ref` 属性を受け取ることもできます。

#### 注意点 {/*caveats*/}

* Strict Mode では、React は[レンダー関数が誤って純関数でなくなってしまう問題を見つけやすくする](#my-initializer-or-updater-function-runs-twice)ため、**レンダー関数を 2 回呼び出します**。これは開発環境専用の挙動であり、本番環境には影響しません。レンダー関数が純粋である場合（そうであるべきです）、これはコンポーネントのロジックに影響を与えません。呼び出しのうちの一方からの結果は無視されます。


---

### `render` 関数 {/*render-function*/}

`forwardRef` は引数としてレンダー関数を受け取ります。React はこの関数を `props` および `ref` とともに呼び出します。

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### 引数 {/*render-parameters*/}

* `props`: 親コンポーネントから渡された props です。

* `ref`: 親コンポーネントから渡された `ref` 属性です。`ref` はオブジェクトの場合と関数の場合があります。親コンポーネントが ref を渡していない場合は `null` になります。受け取った `ref` は、別のコンポーネントに渡すか、[`useImperativeHandle`](/reference/react/useImperativeHandle) に渡します。

#### 返り値 {/*render-returns*/}

`forwardRef` は JSX でレンダーできる React コンポーネントを返します。プレーンな関数として定義された React コンポーネントとは異なり、`forwardRef` によって返されるコンポーネントは `ref` 属性を受け取ることができます。

---

## 使用法 {/*usage*/}

### 親コンポーネントに DOM ノードを公開する {/*exposing-a-dom-node-to-the-parent-component*/}

デフォルトでは、各コンポーネント内の DOM ノードはプライベートです。しかし、時には親に DOM ノードを公開することが有用な場合があります。例えば、ノードにフォーカスを当てることを許可したい場合です。これを明示的に許可するために、コンポーネント定義を `forwardRef()` でラップします。

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

props の後の第 2 引数として <CodeStep step={1}>ref</CodeStep> が渡されます。公開したい DOM ノードにそれを渡してください。

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

これで、親の `Form` コンポーネントが、`MyInput` によって公開された <CodeStep step={2}>`<input>` DOM ノード</CodeStep>にアクセスできるようになります。

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

この `Form` コンポーネントは `MyInput` に [ref を渡しています](/reference/react/useRef#manipulating-the-dom-with-a-ref)。`MyInput` コンポーネントはその ref をブラウザの `<input>` タグに*転送*しています。その結果、`Form` コンポーネントはこの `<input>` DOM ノードにアクセスし、[`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) を呼び出すことができるようになります。

コンポーネント内の DOM ノードへの ref を公開することで、後でコンポーネントの内部を変更するのが難しくなることに注意してください。通常は、ボタンやテキスト入力フィールドなどの再利用可能な低レベルコンポーネントからは DOM ノードの公開を行いますが、アバターやコメントのようなアプリケーションレベルのコンポーネントでは行いません。

<<<<<<< HEAD
<Recipes title="ref の転送の例">
=======
<Recipes titleText="Examples of forwarding a ref">
>>>>>>> 819518cfe32dd2db3b765410247c30feea713c77

#### テキスト入力フィールドにフォーカス {/*focusing-a-text-input*/}

ボタンをクリックすると、入力フィールドにフォーカスが当てられます。`Form` コンポーネントは ref を定義し、それを `MyInput` コンポーネントに渡します。`MyInput` コンポーネントはその ref をブラウザの `<input>` に転送します。これにより、`Form` コンポーネントは `<input>` にフォーカスを当てられるようになります。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### ビデオの再生と一時停止 {/*playing-and-pausing-a-video*/}

ボタンをクリックすると、`<video>` DOM ノードの [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) と [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) が呼び出されます。`App` コンポーネントは ref を定義し、それを `MyVideoPlayer` コンポーネントに渡しています。`MyVideoPlayer` コンポーネントはその ref をブラウザの `<video>` ノードに転送しています。これにより、`App` コンポーネントは `<video>` の再生と一時停止を行うことができるようになります。

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Play
      </button>
      <button onClick={() => ref.current.pause()}>
        Pause
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 複数コンポーネントを経由した ref の転送 {/*forwarding-a-ref-through-multiple-components*/}

`ref` を DOM ノードに転送する代わりに、独自コンポーネントである `MyInput` に転送することもできます。

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

さらにその `MyInput` コンポーネントが自身の `<input>` に ref を転送すれば、`FormField` への ref はその `<input>` への参照を受け取ることになります。

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

`Form` コンポーネントは ref を定義し、それを `FormField` に渡しています。`FormField` コンポーネントはその ref を `MyInput` に転送し、`MyInput` はそれをブラウザの `<input>` DOM ノードに転送しています。これで `Form` が DOM ノードにアクセスできるようになります。


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Required</i>
      }
    </>
  );
});

export default FormField;
```


```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### DOM ノードの代わりに命令型ハンドルを公開する {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

DOM ノードをまるごと公開する代わりに、使用できるメソッドを制限したカスタムオブジェクトである、*命令型ハンドル (imperative handle)* を公開することができます。これを行うには、DOM ノードを保持するための別の ref を定義します。

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

そして受け取った `ref` を [`useImperativeHandle`](/reference/react/useImperativeHandle) に渡し、`ref` で公開したい値を指定します。

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

何らかのコンポーネントが `MyInput` への ref を取得すると、DOM ノードの代わりにあなたが書いた `{ focus, scrollIntoView }` というオブジェクトを受け取ります。これにより、DOM ノードについて公開する情報を最小限に制限することができます。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[命令型ハンドルの使用について詳しく読む](/reference/react/useImperativeHandle)

<Pitfall>

**ref の過度な使用に注意してください**。ref は、props として表現できない、*命令型*の動作にのみ使用するべきです。例えば、ノードへのスクロール、ノードへのフォーカス、アニメーションのトリガ、テキストの選択などです。

**何かを props として表現できる場合は、ref を使用すべきではありません**。例えば、`Modal` コンポーネントから `{ open, close }` のような命令型のハンドルを公開するのではなく、`<Modal isOpen={isOpen} />` のように、`isOpen` を props として受け取る方が良いでしょう。命令型の動作を props として公開する際には[エフェクト](/learn/synchronizing-with-effects)が役立ちます。

</Pitfall>

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントを `forwardRef` でラップしているのに、`ref` が常に `null` になる {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

これは通常、受け取った `ref` を実際に使用するのを忘れていることを意味します。

例えば、このコンポーネントは `ref` を全く使用していません：

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

修正するにはこの `ref` を、DOM ノードか、ref を受け入れることができる別のコンポーネントに渡します。

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

一部のロジックが条件付きである場合にも、`MyInput` への `ref` が `null` になることがあります。

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

`showInput` が `false` の場合、ref はどのノードにも転送されないため、`MyInput` への ref は空のままになります。特に、以下の例のように条件が別のコンポーネント、例えば `Panel` の中に隠されている場合、これを見落としがちです。

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
