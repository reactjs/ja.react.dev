---
title: 'ref で DOM を操作する'
---

<Intro>

React はレンダー結果に合致するよう自動的に [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) を更新するため、コンポーネントで DOM を操作する必要は通常ほとんどありません。ただし、ノードにフォーカスを当てたり、スクロールさせたり、サイズや位置を測定したりするなどの場合に、React が管理する DOM 要素へのアクセスが必要なことがあります。React にはこれらを行う組み込みの方法が存在しないため、DOM ノードを参照する *ref* が必要になります。

</Intro>

<YouWillLearn>

- React が管理する DOM ノードに `ref` 属性を使ってアクセスする方法
- `ref` JSX 属性が `useRef` フックとどのように関連しているか
- 別コンポーネントの DOM ノードにアクセスする方法
- React が管理する DOM を安全に変更できるのはどのような場合か

</YouWillLearn>

## ノードへの ref の取得 {/*getting-a-ref-to-the-node*/}

React が管理する DOM ノードにアクセスするには、まず `useRef` フックをインポートします。

```js
import { useRef } from 'react';
```

次に、それを使ってコンポーネント内で ref を宣言します。

```js
const myRef = useRef(null);
```

最後に、参照を得たい DOM ノートに対応する JSX タグの `ref` 属性にこの ref を渡します。

```js
<div ref={myRef}>
```

`useRef` フックは、`current` という単一のプロパティを持つオブジェクトを返します。最初は `myRef.current` は `null` になっています。React がこの `<div>` に対応する DOM ノードを作成すると、React はこのノードへの参照を `myRef.current` に入れます。その後、[イベントハンドラ](/learn/responding-to-events)からこの DOM ノードにアクセスし、ノードに定義されている組み込みの[ブラウザ API](https://developer.mozilla.org/docs/Web/API/Element) を使用できるようになります。

```js
// You can use any browser APIs, for example:
myRef.current.scrollIntoView();
```

### 例：テキスト入力フィールドにフォーカスを当てる {/*example-focusing-a-text-input*/}

この例では、ボタンをクリックすると入力フィールドにフォーカスが当たります。

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

これを実装するには以下のようにします。

1. `useRef` フックを使って `inputRef` を宣言する。
2. それを `<input ref={inputRef}>` として渡す。これにより、React に**この `<input>` の DOM ノードを `inputRef.current` に入れる**よう指示している。
3. `handleClick` 関数内で、`inputRef.current` から入力フィールドの DOM ノードを読み取り、`inputRef.current.focus()` のようにして [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) を呼び出す。
4. `<button>` の `onClick` に `handleClick` イベントハンドラを渡す。

DOM 操作は ref の最も一般的な使用例ですが、`useRef` フックはほかに、タイマー ID などの React 外部にあるものを格納するためにも使用できます。state と同様に、ref はレンダー間で維持されます。ref は、セットしても再レンダーがトリガされない state 変数のようなものです。ref については、[ref で値を参照する](/learn/referencing-values-with-refs)で読むことができます。

### 例：要素へのスクロール {/*example-scrolling-to-an-element*/}

コンポーネントは複数の ref を持つことができます。この例は、3 つの画像でできたカルーセルです。各ボタンは、対応する DOM ノードに定義されているブラウザの [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) メソッドを呼び出すことで、画像を中央に表示します。

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### ref コールバックを使って ref のリストを管理する {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

上記の例では、ref の数は事前に決まっていました。しかし、リスト内の各アイテムに ref が必要で、かつ、いくつ必要かわからない場合もあります。以下のようなコードは**機能しません**。

```js
<ul>
  {items.map((item) => {
    // Doesn't work!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

これは、**フックはコンポーネントのトップレベルでのみ呼び出される必要がある**ためです。ループ、条件分岐、または `map()` 呼び出しの中で `useRef` を呼び出すことはできません。

これを回避する方法のひとつは、親要素への単一の ref を取得し、[`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) のような DOM 操作メソッドを使って、個々の子ノードを「見つける」ことです。ただし、これは壊れやすく、DOM 構造が変更されると機能しなくなる可能性があります。

別の解決策は、**`ref` 属性に関数を渡す**ことです。これは、[`ref` コールバック](/reference/react-dom/components/common#ref-callback) と呼ばれます。React は、ref を設定するタイミングで DOM ノードを引数にして ref コールバックを呼び出し、クリアするタイミングでは `null` を引数にして呼び出します。これにより、独自の配列や [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) を保持し、インデックスや ID のようなもので任意の ref にアクセスできるようになります。

この例では、このアプローチを用いて、長いリストの任意のノードにスクロールする方法を示しています。

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const itemsRef = useRef(null);

  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>
          Tom
        </button>
        <button onClick={() => scrollToId(5)}>
          Maru
        </button>
        <button onClick={() => scrollToId(9)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          {catList.map(cat => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat.id, node);
                } else {
                  map.delete(cat.id);
                }
              }}
            >
              <img
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

この例では、`itemsRef` は単一の DOM ノードを保持していません。代わりに、アイテム ID から DOM ノードへの [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) を保持しています。（[ref はどんな値でも保持できます！](/learn/referencing-values-with-refs)）すべてのリストアイテムの [`ref` コールバック](/reference/react-dom/components/common#ref-callback) が、Map を更新します。

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Add to the Map
      map.set(cat.id, node);
    } else {
      // Remove from the Map
      map.delete(cat.id);
    }
  }}
>
```

これにより、後で Map から個々の DOM ノードを読み取ることができます。

</DeepDive>

## 別のコンポーネントの DOM ノードにアクセスする {/*accessing-another-components-dom-nodes*/}

`<input />` のようなブラウザ要素を出力する組み込みコンポーネントに ref を置いた場合、React はその ref の `current` プロパティを、対応する DOM ノード（ブラウザの実際の `<input />` など）にセットします。

ただし、**独自の**コンポーネント、例えば `<MyInput />` に ref を置こうとすると、デフォルトでは `null` が返されます。以下はそれを示す例です。ボタンをクリックしても入力フィールドにフォーカスが当たらないことに注意してください。

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

問題に気付きやすくするため、React はコンソールにもエラーを出力します。

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?

</ConsoleBlock>

これは、デフォルトでは React は、コンポーネントが他のコンポーネントの DOM ノードにアクセスできないようにしているためです。自分自身の子でさえもです！ これは意図的なものです。ただでさえ ref は控えめに使うべき避難ハッチ (escape hatch) です。*別の*コンポーネントの DOM ノードまで手動で操作できてしまうと、コードがさらに壊れやすくなってしまいます。

代わりに、内部の DOM ノードを*意図的に*公開したいコンポーネントは、そのことを**明示的に許可**する必要があります。コンポーネントは、自身が受け取った ref を子のいずれかに「転送 (forward)」するよう指定できます。`MyInput` が `forwardRef` API を使ってこれをどのように行うのか見てみましょう。

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

以下が動作の仕組みです。

1. `<MyInput ref={inputRef} />` は、対応する DOM ノードを `inputRef.current` に入れるように React に指示する。ただしそれを許可するかどうかは `MyInput` 次第であり、デフォルトでは許可しない。
2. `MyInput` コンポーネントは `forwardRef` を使って宣言されている。**これにより、上記の `inputRef` を `props` の後に宣言された 2 番目の `ref` 引数として受け取るよう、明示的に許可している**。
3. `MyInput` 自体は、受け取った `ref` を内部の `<input>` に渡す。

これで、ボタンをクリックして入力にフォーカスを当てることができます。

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

デザインシステムにおいて、ボタン、入力フィールドなどの低レベルなコンポーネントが、内部の DOM ノードに ref を転送することは一般的なパターンです。一方、フォーム、リスト、ページセクションなどの高レベルなコンポーネントは、DOM 構造への偶発的な依存関係を避けるため、通常は DOM ノードを公開しません。

<DeepDive>

#### 命令型ハンドルで API の一部を公開する {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

上記の例では、`MyInput` は元の DOM の input 要素を公開しています。これにより親コンポーネント側からその要素の `focus()` を呼び出すことができます。しかしこれにより、親コンポーネントが他のこと、例えば、CSS スタイルを変更することもできてしまいます。一般的なことではありませんが、公開される機能を制限したいということがあります。それには `useImperativeHandle` を使います。

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

ここでは、`MyInput` 内の `realInputRef` が本物の DOM の input ノードを保持しています。ただし、`useImperativeHandle` は、親コンポーネントに対して渡す ref の値として、独自の特別なオブジェクトを使うよう、React に指示します。そのため、`Form` コンポーネント内の `inputRef.current` には `focus` メソッドのみが含まれます。この例での、ref "handle" とは DOM ノードではなく、`useImperativeHandle` の呼び出し内で作成するカスタムオブジェクトです。

</DeepDive>

## React が ref をアタッチするタイミング {/*when-react-attaches-the-refs*/}

React では、すべての更新は [2 つのフェーズ](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)に分けて行われます。

* **レンダー**中に、React はコンポーネントを呼び出して画面に表示される内容を決定する。
* **コミット**中に、React は DOM に変更を適用する。

一般的に、レンダー中に ref にアクセスすることは[望ましくありません](/learn/referencing-values-with-refs#best-practices-for-refs)。これは、DOM ノードを保持するタイプの ref に対しても当てはまります。最初のレンダー中には、DOM ノードがまだ作成されていないため、`ref.current` は `null` になります。また、更新のレンダー中には、DOM ノードがまだ更新されていないため、それらを読むのは早すぎます。

React が `ref.current` をセットするのはコミット中です。DOM を更新する前に、React は影響を受ける `ref.current` の値を `null` に設定します。DOM を更新した後すぐに、React はそれらを対応する DOM ノードにセットします。

**通常、ref にアクセスするのはイベントハンドラからです**。ref を使って何かをしたいが、それをするための特定のイベントがないという場合は、エフェクト (Effect) が必要になるかもしれません。これ以降の数ページでは、エフェクトについて説明します。

<DeepDive>

#### flushSync で state 更新を同期的にフラッシュする {/*flushing-state-updates-synchronously-with-flush-sync*/}

新しい todo を追加したら画面をリストの最後の子までスクロールする、以下のようなコードを考えてみましょう。どういうわけか常に、最後に追加されたものの *1 つ前*の todo 項目にスクロールされてしまいます。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

問題は、以下の 2 行にあります。

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

React では、[state 更新はキューに入ります](/learn/queueing-a-series-of-state-updates)。通常、これは望ましい動作です。しかし、ここでは `setTodos` が DOM をすぐに更新しないため、問題が発生します。リストの最後の要素にスクロールするときに、todo がまだ追加されていないためです。これが、スクロールが常に 1 つのアイテム分「遅れて」いる理由です。

この問題を解決するために、React に DOM を同期的に更新、あるいは「フラッシュ (flush)」するよう強制することができます。これを行うには、`react-dom` から `flushSync` をインポートし、`flushSync` の呼び出しで **state 更新をラップ**します。

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

これにより React に、`flushSync` でラップされたコードが実行された直後に、DOM を同期的に更新するよう指示します。結果として、スクロールしようとするときには最後の todo 項目がすでに DOM に存在することになります。

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## ref を使った DOM 操作のベストプラクティス {/*best-practices-for-dom-manipulation-with-refs*/}

ref は避難ハッチです。「React の外に踏み出す」必要がある場合にのみ使用してください。よくある例としては、フォーカスの管理、スクロール位置の管理、または React が公開していないブラウザ API の呼び出しなどが含まれます。

フォーカスやスクロールのような非破壊的なアクションに留めておけば、問題は発生しないはずです。ただし、DOM を手動で**書き換え**ようとすると、React が行おうとする変更と競合するリスクがあります。

以下はこの問題を説明するための例です。ウェルカムメッセージと 2 つのボタンが含まれています。最初のボタンは、React で通常行うように、[条件付きレンダー](/learn/conditional-rendering)と [state](/learn/state-a-components-memory) を使用してメッセージの有無を切り替えます。2 番目のボタンは、[`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) を使用して、React の制御外で DOM から強制的にメッセージを削除します。

"Toggle with setState" を数回押してみてください。メッセージが消えたり現れたりします。次に、"Remove from the DOM" を押してください。これによりメッセージが強制的に削除されます。最後に、"Toggle with setState" を押してください。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

DOM 要素を手動で削除した後、`setState` を使用して再度表示しようとすると、クラッシュが発生します。これは、あなたが DOM を書き換えてしまったので、React はそれを正しく管理し続ける方法がわからなくなってしまったからです。

**React が管理する DOM ノードの変更は避けてください**。React が管理する要素を変更しようとしたり、子要素を追加あるいは削除しようとすると、見た目の一貫性が失われたり、上記のようなクラッシュが発生することがあります。

ただし、これがまったくできないというわけでもありません。注意が必要だということです。**React が更新する*理由*がない部分であれば、DOM を安全に変更できます**。例えば、ある `<div>` が JSX では常に空である場合、React はその子要素リストに触れる理由がありません。したがって、そこに要素を手動で追加または削除することは安全です。

<Recap>

- ref は一般的な概念だが、ほとんどの場合、DOM 要素を保持するために使用する。
- `<div ref={myRef}>` のように渡すことで、React に DOM ノードを `myRef.current` に入れるよう指示する。
- 通常、フォーカス、スクロール、または DOM 要素の測定などの非破壊的なアクションに ref を使用する。
- コンポーネントはデフォルトでは内部の DOM ノードを公開しない。`forwardRef` を使用して特定のノードに 2 番目の `ref` 引数を渡すことで、DOM ノードの公開を明示的に許可する。
- React によって管理される DOM ノードの変更を避ける。
- React によって管理される DOM ノードをどうしても変更する場合は、React が更新する理由のない部分のみ変更する。

</Recap>



<Challenges>

#### ビデオの再生と一時停止 {/*play-and-pause-the-video*/}

この例では、ボタンが state 変数をトグルして、再生中状態と一時停止状態の間を切り替えます。ただし、ビデオを実際に再生または一時停止するためには、state をトグルするだけでは十分ではありません。`<video>` DOM 要素に対して [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) および [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) を呼び出す必要もあります。この要素に ref を追加し、ボタンを機能させてください。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

さらなるチャレンジとして、ユーザがビデオを右クリックしてブラウザ組み込みのメディアコントロールを使用して再生を行う場合でも、"Play" ボタンをビデオの再生状態と同期させるようにしてください。このためにはビデオの `onPlay` と `onPause` をリッスンする必要があるでしょう。

<Solution>

ref を宣言し、`<video>` 要素に配置します。次の state に応じて、イベントハンドラ内で `ref.current.play()` または `ref.current.pause()` を呼び出します。

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

組み込みのブラウザコントロールを扱うためには、`<video>` 要素に `onPlay` および `onPause` ハンドラを追加し、それらから `setIsPlaying` を呼び出します。この方法で、ユーザがブラウザコントロールを使用してビデオを再生する場合でも、state がそれに応じて変更されます。

</Solution>

#### 検索フィールドにフォーカス {/*focus-the-search-field*/}

"Search" ボタンをクリックすると、フォーカスがフィールドに移動するようにしてください。

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

入力フィールドに ref を追加し、DOM ノードに対して `focus()` を呼び出してフォーカスを当てます。

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### 画像カルーセルをスクロールする {/*scrolling-an-image-carousel*/}

この画像カルーセルには、アクティブな画像を切り替える "Next" ボタンがあります。クリックしたときにギャラリを水平方向にスクロールし、アクティブな画像に移動するようにしてください。アクティブな画像に対応する DOM ノードに対して [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) を呼び出しましょう。

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

この問題では、すべての画像に対する ref を持つ必要はありません。現在アクティブな画像、またはリスト自体に ref があれば十分です。スクロールする*前に* DOM が更新されるよう、`flushSync` を使用してください。

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

`selectedRef` を宣言し、現在の画像にのみ条件付きで渡すことができます。

```js
<li ref={index === i ? selectedRef : null}>
```

`index === i` の場合、つまり当該画像が選択中の場合、`<li>` は `selectedRef` を受け取ります。React は、`selectedRef.current` が常に正しい DOM ノードを指すようにします。

`flushSync` の呼び出しが必要なのは、スクロールの前に React が強制的に DOM を更新するようにするためです。そうしないと、`selectedRef.current` は常に 1 つ前に選択されていたアイテムを指すことになります。

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### 別々のコンポーネントで検索フィールドにフォーカス {/*focus-the-search-field-with-separate-components*/}

"Search" ボタンをクリックすると、フォーカスがフィールドに移動するようにしてください。しかしそれぞれのコンポーネントは別々のファイルで定義されており、そこから移動させてはいけません。どのようにしてそれらをつなぎ合わればよいでしょう？

<Hint>

`SearchInput` のような独自コンポーネントから DOM ノードを公開するためには、`forwardRef` が必要です。

</Hint>

<Sandpack>

```js App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

`SearchButton` の props に `onClick` を追加し、`SearchButton` がそれをブラウザの `<button>` に渡すようにします。また、`<SearchInput>` に ref を渡し、コンポーネントが ref を実際の `<input>` に転送し、セットされるようにします。最後に、クリックハンドラ内で、その ref の中に格納されている DOM ノードに対して `focus` を呼び出します。

<Sandpack>

```js App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
