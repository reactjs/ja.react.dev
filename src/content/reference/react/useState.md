---
title: useState
---

<Intro>

`useState` は、コンポーネントに [state 変数](/learn/state-a-components-memory) を追加するための React フックです。

```js
const [state, setState] = useState(initialState);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useState(initialState)` {/*usestate*/}

コンポーネントのトップレベルで `useState` を呼び出して、[state 変数](/learn/state-a-components-memory)を宣言します。

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

state 変数は慣習として、[分割代入](https://javascript.info/destructuring-assignment)を利用して `[something, setSomething]` のように命名します。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `initialState`: state の初期値です。どんな型の値でも渡すことができますが、関数を渡した場合は特別な振る舞いをします。この引数は初回レンダー後は無視されます。
  * `initialState` に関数を渡した場合、その関数は*初期化関数 (initializer function)* として扱われます。初期化関数は、純粋で、引数を取らず、何らかの型の値を返す必要があります。React はコンポーネントを初期化するときに初期化関数を呼び出し、その返り値を初期 state として保存します。[例を見る](#avoiding-recreating-the-initial-state)

#### 返り値 {/*returns*/}

`useState` は以下の 2 つの値を持つ配列を返します。

1. 現在の state。初回レンダー中では、`initialState` と同じ値になります。
2. state を別の値に更新し、再レンダーをトリガする [`set` 関数](#setstate)。

#### 注意点 {/*caveats*/}

* `useState` はフックであるため、**コンポーネントのトップレベル**またはカスタムフック内でのみ呼び出すことができます。ループや条件文の中で呼び出すことはできません。これが必要な場合は、新しいコンポーネントを抽出し、state を移動させてください。
* Strict Mode では、[純粋でない関数を見つけやすくするために](#my-initializer-or-updater-function-runs-twice)、**初期化関数が 2 回呼び出されます**。これは開発時のみの振る舞いであり、本番には影響しません。初期化関数が純粋であれば（そうであるべきです）、2 回呼び出されてもコードに影響はありません。2 回の呼び出しのうち 1 回の呼び出し結果は無視されます。

---

### `setSomething(nextState)` のように利用する `set` 関数 {/*setstate*/}

`useState` が返す `set` 関数を利用して、state を別の値に更新し、再レンダーをトリガすることができます。直接次の state を渡すか、前の state から次の state を導出する関数を渡します。

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### 引数 {/*setstate-parameters*/}

* `nextState`: 次に state にセットしたい値です。どんな型の値でも渡すことができますが、関数を渡した場合は特別な振る舞いをします。
  * `nextState` に関数を渡した場合、その関数は*更新用関数 (updater function)* として扱われます。更新用関数は、純粋で、処理中の state の値を唯一の引数として受け取り、次の state を返す必要があります。React は更新用関数をキューに入れ、コンポーネントを再レンダーします。次のレンダーで、React はキューに入れられたすべての更新用関数を前の state に対して適用し、次の state を導出します。[例を見る](#updating-state-based-on-the-previous-state)

#### 返り値 {/*setstate-returns*/}

`set` 関数は返り値を持ちません。

#### 注意点 {/*setstate-caveats*/}

* `set` 関数は***次の*レンダーのための state 変数のみを更新**します。`set` 関数を呼び出した後に state 変数を読み取っても、呼び出し前の画面に表示されていた[古い値が返されます](#ive-updated-the-state-but-logging-gives-me-the-old-value)。

* 新しい値が現在の `state` と同一の場合、React は最適化のために、**コンポーネントとその子コンポーネントの再レンダーをスキップ**します。state の同一性の比較は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) によって行われます。一部のケースでは、React は子コンポーネントをスキップする前にコンポーネントを呼び出す必要がありますが、あなたのコードに影響を与えることはないはずです。

* React は [state の更新をまとめて行います（バッチ処理）](/learn/queueing-a-series-of-state-updates)。**すべてのイベントハンドラを実行し終え**、`set` 関数が呼び出された後に、画面を更新します。これにより、1 つのイベント中に複数回の再レンダーが発生することはありません。まれに、早期に画面を更新する必要がある場合（例えば DOM にアクセスする場合など）がありますが、その場合は [`flushSync`](/reference/react-dom/flushSync) を利用できます。

* レンダー中に `set` 関数を呼び出すことは、*現在レンダー中の*コンポーネント内からのみ許されています。その場合、React はその出力を破棄し、新しい state で再レンダーを試みます。このパターンが必要になることはほとんどありませんが、**前回のレンダーからの情報を保存**するために使用できます。[例を見る](#storing-information-from-previous-renders)

* Strict Mode では、[純粋でない関数を見つけやすくするために](#my-initializer-or-updater-function-runs-twice)**更新用関数が 2 回呼び出されます**。これは開発時のみの振る舞いであり、本番には影響しません。更新用関数が純粋であれば（そうであるべきです）、2 回呼び出されてもコードに影響はありません。2 回の呼び出しのうち 1 回の呼び出し結果は無視されます。

---

## 使用法 {/*usage*/}

### state をコンポーネントに追加する {/*adding-state-to-a-component*/}

コンポーネントのトップレベルで `useState` を呼び出し、1 つ以上の [state 変数](/learn/state-a-components-memory)を宣言します。

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

state 変数は慣習として、[分割代入](https://javascript.info/destructuring-assignment)を利用して `[something, setSomething]` のように命名します。

`useState` は、以下の 2 つの値を持つ配列を返します。

1. この state 変数の<CodeStep step={1}>現在の値</CodeStep>。最初は、<CodeStep step={3}>初期 state</CodeStep> に設定されます。
2. インタラクションに応じて、state を他の値に変更するための<CodeStep step={2}>`set` 関数</CodeStep>。

スクリーン上の表示を更新するには、次の state を引数として `set` 関数を呼び出します。

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React は次の state を保存したあと、新しい値でコンポーネントを再レンダーし、UI を更新します。

<Pitfall>

`set` 関数の呼び出しは、[既に実行中のコードの現在の state を変更するわけでは**ありません**](#ive-updated-the-state-but-logging-gives-me-the-old-value)。

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

この呼び出しは、*次の*レンダー以降に `useState` が返す値にのみ影響を与えます。

</Pitfall>

<Recipes titleText="useState の基本的な使用例" titleId="examples-basic">

#### カウンタ (number) {/*counter-number*/}

この例では、`count` state 変数が数値 (number) を保持しています。ボタンをクリックすることで、数値が増加します。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### テキストフィールド (string) {/*text-field-string*/}

この例では、`text` state 変数が文字列 (string) を保持しています。ブラウザの DOM の input 要素に文字を入力すると、`handleChange` は input 要素から最新の値を読み出し、`setText` を呼び出して state を更新します。これにより、下部に、現在の `text` を表示できます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### チェックボックス (boolean) {/*checkbox-boolean*/}

この例では、`linked` state 変数が真偽値 (boolean) を保持しています。input をクリックすると、`setLiked` はブラウザのチェックボックスの input がチェックされているかどうかで、`liked` state 変数を更新します。`liked` 変数は、チェックボックスの下のテキストをレンダーするために使用されます。

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### フォーム（2 つの変数） {/*form-two-variables*/}

同じコンポーネントで、複数の state 変数を宣言することができます。それぞれの state 変数は、完全に独立しています。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### 直前の state に応じて更新する {/*updating-state-based-on-the-previous-state*/}

`age` が `42` である場合を考えましょう。このハンドラは、`setAge(age + 1)` を 3 回呼び出します。

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

しかし、1 回クリックしたあと、`age` は `45` ではなく `43` になります！ これは、`set` 関数を呼び出しても、既に実行されているコードの `age` state 変数を[更新するわけではない](/learn/state-as-a-snapshot)ためです。そのため、`setAge(age + 1)` の呼び出しは全て `setAge(43)` になります。

この問題を解消するため、次の state の代わりに、***更新用関数*を `setAge` に渡す**ことができます。

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

ここで、`a => a + 1` は更新用関数です。更新用関数は、<CodeStep step={1}>処理中の state の値</CodeStep>を受け取り、そこから<CodeStep step={2}>次の state</CodeStep> を導出します。

React は更新用関数を[キュー](/learn/queueing-a-series-of-state-updates)に入れます。そして、次のレンダー中に、同じ順番で更新用関数を呼び出します。

1. `a => a + 1` は処理中の state の値として `42` を受け取り、次の state として `43` を返します。
1. `a => a + 1` は処理中の state の値として `43` を受け取り、次の state として `44` を返します。
1. `a => a + 1` は処理中の state の値として `44` を受け取り、次の state として `45` を返します。

キューにはこれ以上の更新用関数はないので、React は最終的に `45` を現在の state として保存します。

慣習として、処理中の state の引数名には、state 変数名の頭文字 1 文字を利用することが一般的です（例えば、`age` という state 変数に対して、`a` という引数名）。しかし、`prevAge` など、他の分かりやすい名前を使うこともできます。

開発時に[更新用関数が 2 回呼び出される](#my-initializer-or-updater-function-runs-twice)ことがあります。これは、更新用関数が[純粋](/learn/keeping-components-pure)であることを確認するためです。

<DeepDive>

#### 常に更新用関数を利用すべきか {/*is-using-an-updater-always-preferred*/}

新しくセットする値が直前の state から導出される場合、常に `setAge(a => a + 1)` という書き方をすべきだという意見があります。悪いことではありませんが、必ずしも必要なわけではありません。

ほとんどのケースでは、どちらのアプローチでも違いはありません。React は、クリックなどのユーザの意図的なアクションに対して、`age` state 変数の更新が次のクリックの前に発生することを保証しています。すなわち、イベントハンドラの開始時に、クリックハンドラが「古い」`age` を参照してしまうことはありません。

一方で、同じイベント内で複数回の更新を行う場合、更新用関数が役に立ちます。また、state 変数自身を参照することが難しいケースにも有用です（再レンダーの発生を最適化する際に、このケースに遭遇することがあります）。

わずかな文法の冗長性よりも一貫性を優先するのであれば、state が直前の state から導出される場合には、常に更新用関数を書くようにすることは合理的です。もし、state が、他の state 変数の直前の値から導出される場合は、それらを 1 つのオブジェクトにまとめて[リデューサ (reducer) を利用する](/learn/extracting-state-logic-into-a-reducer)ことを検討してください。

</DeepDive>

<Recipes titleText="更新用関数を渡す場合と次の state を直接渡す場合の違い" titleId="examples-updater">

#### 更新用関数を渡す {/*passing-the-updater-function*/}

この例では更新用関数を渡しているため、"+3" ボタンは想定通りに動きます。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### 次の state を直接渡す {/*passing-the-next-state-directly*/}

この例では更新用関数を渡して**いません**。そのため "+3" ボタンは**意図した通りには動きません**。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### オブジェクトや配列の state を更新する {/*updating-objects-and-arrays-in-state*/}

state にオブジェクトや配列をセットすることができます。ただし React では、state は読み取り専用として扱う必要があります。そのため、state を更新する場合は、**既存のオブジェクトを直接*書き換える (mutate)* のではなく、*置き換える (replace)* 必要があります**。例えば、state として `form` オブジェクトを保持している場合、以下のように書き換えを行ってはいけません。

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

代わりに、新しいオブジェクトを作成してオブジェクト全体を置き換えてください。

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

詳しくは、[state 内のオブジェクトの更新](/learn/updating-objects-in-state)や、[state 内の配列の更新](/learn/updating-arrays-in-state)を参照してください。

<Recipes titleText="オブジェクトや配列を state にする例" titleId="examples-objects">

#### フォーム（オブジェクト） {/*form-object*/}

この例では、`form` state 変数はオブジェクトを保持しています。それぞれの input 要素は change ハンドラを持っており、新しい `form` オブジェクトを引数として `setForm` を呼び出します。`{ ...form }` のようにスプレッド構文を用いることで、state オブジェクトを（書き換えではなく）確実に置き換えることができます。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### フォーム（ネストされたオブジェクト） {/*form-nested-object*/}

この例では、state がネストされたオブジェクトになっています。ネストされたオブジェクトの state を更新する場合、更新するオブジェクトのコピーを作成する必要があります。さらに、そのオブジェクトを内包する上位のオブジェクトも同様に、コピーを作成する必要があります。詳しくは、[ネストされたオブジェクトの更新](/learn/updating-objects-in-state#updating-a-nested-object)を参照してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### リスト（配列） {/*list-array*/}

この例では、`todos` state 変数が配列を保持しています。各ボタンのハンドラは、`todos` 配列の新しい値を引数として `setTodos` を呼び出します。スプレッド構文 (`[...todos]`) や、`todos.map()`、`todos.filter()` などを利用すると、state の配列を（書き換えではなく）確実に置き換えることができます。

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Immer で簡潔な更新ロジックを書く {/*writing-concise-update-logic-with-immer*/}

配列やオブジェクトの書き換えを行わずに state を更新することが煩雑に感じる場合、[Immer](https://github.com/immerjs/use-immer) のようなライブラリを用いて繰り返しのコードを減らすことができます。Immer を利用することで、オブジェクトを書き換えているかのような簡潔なコードを書くことができます。しかし内部では、イミュータブル（不変, immutable）な更新が実行されます。

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### 初期 state が再生成されることを防ぐ {/*avoiding-recreating-the-initial-state*/}

React は一度だけ初期 state を保存し、2 回目以降のレンダーではそれを無視します。

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

`createInitialTodos()` は毎レンダーで呼び出されるものの、その結果は初回レンダーでのみ利用されます。これは、`createInitialTodos()`が巨大な配列の生成やコストの高い計算を行っている場合に、無駄が多くなります。

これを解決するため、以下のように***初期化関数*を渡す**ことができます。

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

関数を呼び出した結果である `createInitialTodos()` ではなく、`createInitialTodos` という*関数それ自体*を渡していることに注意してください。`useState` に関数が渡された場合、React は初期化時に、関数を一度だけ呼び出します。

初期化関数が[純粋](/learn/keeping-components-pure)であることを確認するため、開発時に[初期化関数が 2 回呼び出される](#my-initializer-or-updater-function-runs-twice)ことがあります。

<Recipes titleText="初期化関数を渡す場合と初期値を直接渡す場合の違い" titleId="examples-initializer">

#### 初期化関数を渡す {/*passing-the-initializer-function*/}

この例では、初期化関数を利用しています。そのため、`createInitialTodos` 関数は初期化時のみ実行されます。入力フィールドに文字を入力した場合などの、コンポーネントの再レンダー時には実行されません。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### 初期 state を直接渡す {/*passing-the-initial-state-directly*/}

この例では、初期化関数を利用して**いません**。そのため、`createInitialTodos` 関数は、入力フィールドに文字を入力したときなどの全てのレンダーで実行されます。挙動に目に見える違いはありませんが、少し効率が悪くなります。

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### key を利用して state をリセットする {/*resetting-state-with-a-key*/}

`key` 属性は、[リストをレンダーする場合](/learn/rendering-lists)によく利用します。しかし、もう 1 つの使い道があります。

**コンポーネントに異なる `key` を渡すことで、コンポーネントの state をリセットすることができます**。この例では、`version` state 変数を `Form` に `key` として渡しています。"Reset" ボタンをクリックすると、`version` state 変数が変化します。`key` が変化したとき、React は `Form` コンポーネント（と、その全ての子コンポーネント）を一から再生成するため、`Form` の state がリセットされます。

詳しくは、[state の保持とリセット](/learn/preserving-and-resetting-state)を参照してください。

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### 直前のレンダーの情報を保存する {/*storing-information-from-previous-renders*/}

通常、state の更新はイベントハンドラの中で行われます。しかし、レンダーに応じて state を設定したい場合があります。例えば、prop が変化したときに state 変数を変化させたい場合です。

以下に示すように、ほとんどのケースでは不要です。

* **もし必要な値が現在の props と他の state のみから導出される場合、[冗長な state を削除してください](/learn/choosing-the-state-structure#avoid-redundant-state)**。もし何度も再計算されることが気になる場合は、[`useMemo` フック](/reference/react/useMemo)が役に立ちます。
* もしコンポーネントツリーの state 全体をリセットしたい場合、[コンポーネントに異なる `key` を渡してください](#resetting-state-with-a-key)。
* 可能であれば、関連するすべての state をイベントハンドラの中で更新してください。

これらがどれも適用できない稀なケースでは、コンポーネントのレンダー中に `set` 関数を呼び出し、それまでにレンダーされた値に基づいて state を更新するパターンが利用できます。

以下の例では、`CountLabel` コンポーネントは、渡された `count` プロパティを表示しています。

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

直近の変更で、counter の値が*増えたのか減ったのか*を表示したいとします。`count` プロパティだけでは知ることができないため、前回の値を保持し続ける必要があります。前回の値を保持するために、`prevCount` state 変数を追加します。さらに、`trend` state 変数を追加し、count が増えたのか減ったのかを保持します。`prevCount` と `count` を比較し、もしこれらが一致しない場合に、`prevCount` と `trend` を更新します。これで、現在の count プロパティと、*前回のレンダーからどのように変化したのか*の両方を表示することができます。

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

レンダー中に `set` 関数を呼び出す場合は、`prevCount !== count` のような条件節の中で、`setPrevCount(count)` のような呼び出しが必要なことに注意してください。さもないと、再レンダーのループに陥り、コンポーネントがクラッシュします。また、例のように、*現在レンダーしている*コンポーネントの state のみ更新することができます。レンダー中に*別の*コンポーネントの `set` 関数を呼び出すとエラーになります。最後に、`set` 関数の呼び出しは、[書き換えなしで state を更新](#updating-objects-and-arrays-in-state)する必要があります。これは、[純関数](/learn/keeping-components-pure)の他のルールを破ることができないことを意味します。

このパターンは理解するのが難しいため、通常は避けるべきです。しかし、エフェクト内で state を更新するよりは良い方法です。レンダー中に `set` 関数を呼び出すと、コンポーネントが `return` 文で終了した直後、子コンポーネントをレンダーする前に再レンダーが行われます。このため、子コンポーネントが 2 回レンダーされずに済みます。コンポーネント関数の残りの部分は引き続き実行されます（結果は破棄されますが）。もし、`set` 関数の呼び出しを含む条件分岐が、全てのフックの呼び出しより下にある場合、早期 `return;` を追加して、再レンダーを早めることができます。

---

## トラブルシューティング {/*troubleshooting*/}

### state を更新したのに古い値がログに表示される {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

`set` 関数の呼び出しは、実行中のコードの state を変化**させません**。

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

これは、[state がスナップショットのように振る舞う](/learn/state-as-a-snapshot)ためです。state の更新は、新しい state の値での再レンダーをリクエストします。すでに実行中のイベントハンドラ内の `count` という JavaScript 変数には影響を与えません。

次の state が必要な場合は、`set` 関数に渡す前に一度変数に保存することができます。

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### state を更新したのに画面が更新されない {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React では、**更新の前後で state の値が変化しない場合、その変更は無視されます**。state の値の変化は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) によって判断されます。この現象は、state のオブジェクトや配列を直接書き換えた場合によく起こります。

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

既存の `obj` オブジェクトを書き換えて、`setObj` に戻したため、この更新は無視されます。修正するには、state のオブジェクトや配列を[*書き換える*のではなく、*置き換える*](#updating-objects-and-arrays-in-state)必要があります。

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### "Too many re-renders" というエラーが出る {/*im-getting-an-error-too-many-re-renders*/}

`Too many re-renders. React limits the number of renders to prevent an infinite loop.` というエラーが出ることがあります。これは通常、*レンダー中に*無条件に `set` 関数を呼び出しているため、コンポーネントがループに入っていることを意味します。レンダー、`set` 関数の呼び出し（レンダーを引き起こす）、レンダー、`set` 関数の呼び出し（レンダーを引き起こす）、というように続きます。大抵の場合、これはイベントハンドラの指定を間違ったことによるものです。

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

このエラーの原因がわからない場合は、コンソールのエラーの横にある矢印をクリックして、JavaScript スタックを調べ、エラーの原因となる `set` 関数の呼び出しを特定してください。

---

### 初期化関数や更新用関数が 2 度呼ばれる {/*my-initializer-or-updater-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode) では、いくつかの関数が、本来 1 回のところを 2 回呼び出されることがあります。

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

これは予想される動作であり、あなたのコードを壊すものではありません。

これは**開発時のみ**の挙動で、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)ために役立ちます。React は、呼び出し結果の 1 つを利用し、もう 1 つを無視します。コンポーネント、初期化関数、更新用関数が純粋であれば、この挙動があなたのロジックに影響を与えることはありません。ただし、誤って純粋でない関数を指定した場合は、これにより間違いに気付くことができるでしょう。

例えば以下の更新用関数は、state の配列を書き換えるため純粋ではありません。

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

React は更新用関数を 2 回呼び出すため、todo が 2 つ追加されてしまい、間違いに気付くことができます。この例では、配列を[書き換えるのではなく、置き換える](#updating-objects-and-arrays-in-state)ことで間違いを修正できます。

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

更新用関数が純粋になったため、複数回呼び出されても動作に影響しません。これが、2 回呼び出されることで間違いに気付くことができる理由です。**コンポーネント、初期化関数、更新用関数のみが純粋である必要があります**。イベントハンドラは、純粋である必要がないため、2 回呼び出されることはありません。

詳しくは、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)を参照してください。

---

### 関数を state にセットしようとすると、その関数が呼び出されてしまう {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

このような形で関数を state に設定することはできません。

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

関数を渡すと、React は `someFunction` を[初期化関数](#avoiding-recreating-the-initial-state)、`someOtherFunction` を[更新用関数](#updating-state-based-on-the-previous-state)として扱います。そのため、それらを呼び出し、その結果を保存しようとします。関数を実行するのではなく*保存*するには、どちらの場合も `() =>` を前に付ける必要があります。こうすると、React は関数自体を保存します。

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
