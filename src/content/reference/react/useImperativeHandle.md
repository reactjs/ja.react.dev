---
title: useImperativeHandle
---

<Intro>

`useImperativeHandle` は、[ref](/learn/manipulating-the-dom-with-refs) として公開されるハンドルをカスタマイズするための React フックです。

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

`useImperativeHandle` をコンポーネントのトップレベルで呼び出し、公開される ref ハンドルをカスタマイズします。

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `ref`: [`forwardRef` render 関数](/reference/react/forwardRef#render-function)から 2 番目の引数として受け取った `ref` です。

* `createHandle`: 引数を受け取らず、公開したい ref ハンドルを返す関数です。ref ハンドルは任意の型が使えます。通常、公開したいメソッドを持つオブジェクトを返します。

* **オプション** `dependencies`: `createHandle` のコード内でリファレンスされるすべてのリアクティブな値のリストです。リアクティブな値には、props、state、およびコンポーネント内で直接宣言された変数と関数が含まれます。もし linter が [React 向けに設定](/learn/editor-setup#linting)されている場合、linter がすべてのリアクティブな値が依存関係として正しく指定されているかを確認します。依存関係のリストは、一定数の項目があり、[dep1, dep2, dep3]のようにインラインで記述される必要があります。React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) の比較メソッドを使用して、各依存関係を以前の値と比較します。もし再レンダーが依存関係のいずれかに変更をもたらした場合、またはその引数を省略した場合、`createHandle` 関数が再実行され、新しく作成されたハンドルが ref に割り当てられます。

#### 返り値 {/*returns*/}

`useImperativeHandle` は `undefined` を返します。

---

## 使用方 {/*usage*/}

### 親コンポーネントにカスタム ref ハンドルを公開する {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

デフォルトでは、コンポーネントはその DOM ノードを親コンポーネントに公開しません。例えば、`MyInput` の親コンポーネントが `<input>` DOM ノードに[アクセスできるように](/learn/manipulation-the-dom-with-refs)したい場合は、[`forwardRef`](/reference/react/forwardRef) にオプトインする必要があります。 

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

上記のコードでは、[`MyInput` の ref は `<input>` DOM ノードを受け取ります。](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component)ただし、代わりにカスタムな値を公開することもできます。公開されるハンドルをカスタマイズするには、コンポーネントのトップレベルで `useImperativeHandle` を呼び出します。

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... あなたのメソッド ...
    };
  }, []);

  return <input {...props} />;
});
```

上記のコードでは、`ref` が `<input>` に受け渡しされなくなっていることに注意してください。

例えば、`<input>` DOM ノード全体を公開するのではなく、その 2 つのメソッド、`focus` と `scrollIntoView` を公開したいとします。これを行うには、実際のブラウザの DOM を別の ref に保持します。そして、`useImperativeHandle` を使用して、親コンポーネントに呼び出したいメソッドのみを含むハンドルを公開します。

```js {7-14}
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

これで、親コンポーネントが `MyInput` への ref を取得し、そのコンポーネントで `focus` メソッドと `scrollIntoView` メソッドを呼び出すことができるようになります。ただし、親コンポーネントは基礎となる `<input>` DOM ノードへの完全なアクセス権は持ちません。

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // DOM ノードが公開されていないため、これでは機能しません。
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

---

### 独自の命令型メソッドを公開する {/*exposing-your-own-imperative-methods*/}

命令型ハンドルを介して公開するメソッドは、DOM メソッドと正確に一致する必要はありません。例えば、この `Post` コンポーネントは、命令型ハンドルを介して `scrollAndFocusAddComment` メソッドを公開します。これにより、ボタンをクリックすると、親である `Page` がコメントのリストをスクロールできる*だけでなく*、入力フィールドにフォーカスもできるようになります。

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js Post.js
import { forwardRef, useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});

export default Post;
```


```js CommentList.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CommentList = forwardRef(function CommentList(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export default CommentList;
```

```js AddComment.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Add comment..." ref={ref} />;
});

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**ref の過度な使用に注意してください。**ref は、prop として表現できない、*命令形式*の動作にのみ使用するべきです。例えば、ノードへのスクロール、ノードへのフォーカス、アニメーションのトリガ、テキストの選択などです。

**何かを prop として表現できる場合は、ref を使用すべきではありません。**例えば、`Modal` コンポーネントから `{ open, close }` のような命令形式のハンドルを公開するのではなく、`<Modal isOpen={isOpen} />`のように、`isOpen` を prop として受け取る方が良いでしょう。[エフェクト](/learn/synchronizing-with-effects)を使用することで、命令形式の動作をプロップとして公開することができます。

</Pitfall>
