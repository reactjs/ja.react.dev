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
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `ref`: `MyInput` コンポーネントから props として受け取る `ref` です。

* `createHandle`: 引数を受け取らず、公開したい ref ハンドルを返す関数です。ref ハンドルは任意の型が使えます。通常、公開したいメソッドを持つオブジェクトを返します。

* **省略可能** `dependencies`: `createHandle` コード内で参照されるすべてのリアクティブな値のリストです。リアクティブな値には、props、state、コンポーネント本体に直接宣言されたすべての変数および関数が含まれます。リンタが [React 用に設定されている場合](/learn/editor-setup#linting)、すべてのリアクティブな値が依存値として正しく指定されているか確認できます。依存値のリストは要素数が一定である必要があり、`[dep1, dep2, dep3]` のようにインラインで記述する必要があります。React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使った比較で、それぞれの依存値を以前の値と比較します。再レンダーにより依存値のいずれかが変更された場合、または引数自体を省略した場合、`createHandle` 関数は再実行され、新しく作成されたハンドルが ref に割り当てられます。

<Note>

<<<<<<< HEAD
React 19 からは [`ref` は props として渡されます](/blog/2024/12/05/react-19#ref-as-a-prop)。React 18 以前では、`ref` を受け取るために [`forwardRef`](/reference/react/forwardRef) が必要でした。
=======
Starting with React 19, [`ref` is available as a prop.](/blog/2024/12/05/react-19#ref-as-a-prop) In React 18 and earlier, it was necessary to get the `ref` from [`forwardRef`.](/reference/react/forwardRef) 
>>>>>>> 49284218b1f5c94f930f8a9b305040dbe7d3dd48

</Note>

#### 返り値 {/*returns*/}

`useImperativeHandle` は `undefined` を返します。

---

## 使用法 {/*usage*/}

### 親コンポーネントにカスタム ref ハンドルを公開する {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

親要素に DOM ノードを公開するには、props として `ref` を受け取るようにします。

```js {2}
function MyInput({ ref }) {
  return <input ref={ref} />;
};
```

上記のコードでは、[`MyInput` の ref は `<input>` の DOM ノードを受け取ります](/learn/manipulating-the-dom-with-refs)。ただし、代わりにカスタムな値を公開することもできます。公開されるハンドルをカスタマイズするには、コンポーネントのトップレベルで `useImperativeHandle` を呼び出します。

```js {4-8}
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);

  return <input />;
};
```

上記のコードでは、`ref` が `<input>` に受け渡しされなくなっていることに注意してください。

例えば、`<input>` DOM ノード全体を公開したくはないが、その 2 つのメソッド、`focus` と `scrollIntoView` は公開したいとします。これを行うには、実際のブラウザの DOM を別の ref に保持しておきます。そして、`useImperativeHandle` を使用して、親コンポーネントに呼び出してほしいメソッドのみを含むハンドルを公開します。

```js {7-14}
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
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

  return <input ref={inputRef} />;
};
```

これで、親コンポーネントが `MyInput` への ref を取得し、そのコンポーネントで `focus` メソッドと `scrollIntoView` メソッドを呼び出すことができるようになります。ただし、親コンポーネントは背後にある `<input>` DOM ノードへの完全なアクセス権は持ちません。

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
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref, ...props }) {
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
};

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

```js src/Post.js
import { useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

function Post({ ref }) {
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
};

export default Post;
```


```js src/CommentList.js
import { useRef, useImperativeHandle } from 'react';

function CommentList({ ref }) {
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
}

export default CommentList;
```

```js src/AddComment.js
import { useRef, useImperativeHandle } from 'react';

function AddComment({ ref }) {
  return <input placeholder="Add comment..." ref={ref} />;
}

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

**ref の過度な使用に注意してください**。ref は、props として表現できない、*命令型*の動作にのみ使用するべきです。例えば、ノードへのスクロール、ノードへのフォーカス、アニメーションのトリガ、テキストの選択などです。

**何かを props として表現できる場合は、ref を使用すべきではありません**。例えば、`Modal` コンポーネントから `{ open, close }` のような命令型のハンドルを公開するのではなく、`<Modal isOpen={isOpen} />` のように、`isOpen` を props として受け取る方が良いでしょう。命令型の動作を props として公開する際には[エフェクト](/learn/synchronizing-with-effects)が役立ちます。

</Pitfall>
