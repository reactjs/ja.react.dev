---
title: useReducer
---

<Intro>

`useReducer` は、[リデューサ (reducer)](/learn/extracting-state-logic-into-a-reducer) をコンポーネントに追加するための React フックです。

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

[リデューサ](/learn/extracting-state-logic-into-a-reducer) で state を管理するために、コンポーネントのトップレベルで `useReducer` を呼び出します。

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

<<<<<<< HEAD
* `reducer`: state をどのように更新するかを指定するリデューサ関数です。純粋でなければならず、引数として state とアクションを取り、次の state を返します。state とアクションはどのような型でも大丈夫です。
* `initialArg`: 初期 state が計算される元になる値です。任意の型の値を指定できます。どのように初期 state を計算するかは、次の `init` 引数に依存します。
* **省略可能** `init`: 初期 state を返す初期化関数です。指定されていない場合、初期 state は `initialArg` そのものになります。指定されている場合、初期 state は `init(initialArg)` の結果になります。
=======
* `reducer`: The reducer function that specifies how the state gets updated. It must be pure, should take the state and action as arguments, and should return the next state. State and action can be of any types.
* `initialArg`: The value from which the initial state is calculated. It can be a value of any type. How the initial state is calculated from it depends on the next `init` argument.
* **optional** `init`: The initializer function that should return the initial state. If it's not specified, the initial state is set to `initialArg`. Otherwise, the initial state is set to the result of calling `init(initialArg)`.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

#### 返り値 {/*returns*/}

`useReducer` は、2 つの値を持つ配列を返します：

1. 現在の state。最初のレンダー中に、`init(initialArg)` または `initialArg`（`init` がない場合）が設定されます。
2. state を別の値に更新し、再レンダーをトリガするための [`dispatch` 関数](#dispatch)。

#### 注意点 {/*caveats*/}

* `useReducer` はフックなので、**コンポーネントのトップレベル**または独自のカスタムフック内でのみ呼び出すことができます。ループや条件の中で呼び出すことはできません。必要な場合は、新しいコンポーネントとして抜き出し、その中に state を移動させてください。
* `dispatch` 関数は常に同一のものとなるため、多くの場合エフェクトの依存配列では省略されますが、依存配列に含めてもエフェクトの再実行は起こりません。依存値を削除してもリンタがエラーを出さない場合、削除しても安全です。[エフェクトから依存値を取り除く方法](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)を参照してください。
* Strict Mode では、React は[純粋でない関数を見つけやすくするために](#my-reducer-or-initializer-function-runs-twice)、リデューサと初期化関数を 2 回呼び出します。これは開発時の動作であり、本番には影響しません。リデューサと初期化関数が純粋であれば（そうあるべきです）、これはロジックに影響しません。片方の呼び出しの結果は無視されます。

---

### `dispatch` 関数 {/*dispatch*/}

`useReducer` によって返される `dispatch` 関数を使うことで、state を別の値に更新して再レンダーをトリガすることができます。`dispatch` 関数には、唯一の引数としてアクションを渡す必要があります。

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React がセットする次の state は、引数として `state` の現在値および `dispatch` に渡されたアクションを用いて `reducer` 関数を呼び出した結果になります。

#### 引数 {/*dispatch-parameters*/}

* `action`: ユーザによって実行されたアクションです。任意の型の値を指定できます。慣例として、アクションは通常オブジェクトであり、`type` プロパティで識別され、他のプロパティでオプションの追加情報を保持します。

#### 返り値 {/*dispatch-returns*/}

`dispatch` 関数には返り値はありません。

#### 注意点 {/*setstate-caveats*/}

* `dispatch` 関数は、**次のレンダーのための state 変数のみを更新**します。`dispatch` 関数を呼び出した後に state 変数を読み取ると、既に画面上に表示されている、`dispatch` 呼び出し前の[古い値を読み取ります](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value)。

* 与えられた新しい値が、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) の比較により、現在の `state` と同じと判断された場合、React は**コンポーネントとその子要素の再レンダーをスキップ**します。これは最適化です。React は結果を無視できる場合でも必要があってコンポーネントを呼び出すかもしれませんが、これがコードに影響してはいけません。

* React は [state の更新のバッチ処理（batching, 束ね処理）](/learn/queueing-a-series-of-state-updates) を行います。これにより、**すべてのイベントハンドラが実行され**、それらの `set` 関数が呼び出された後に画面が更新されます。これにより、1 つのイベント中に複数回の再レンダーが発生するのを防ぐことができます。稀なケースとして、DOM にアクセスするなどの理由で React に画面を早期に強制的に更新させる必要がある場合は、[`flushSync`](/reference/react-dom/flushSync) を使用できます。

---

## 使用法 {/*usage*/}

### コンポーネントにリデューサを追加する {/*adding-a-reducer-to-a-component*/}

コンポーネントのトップレベルで `useReducer` を呼び出して、[リデューサ](/learn/extracting-state-logic-into-a-reducer)を使って state を管理します。

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` は、2 つの値を持つ配列を返します：

1. この state 変数の<CodeStep step={1}>現在の state</CodeStep>。与えられた<CodeStep step={3}>初期 state</CodeStep> が初期値として設定されます。
2. ユーザ操作に応じて state を変更するための<CodeStep step={2}>`dispatch` 関数</CodeStep>。

画面上の内容を更新するには、*アクション*と呼ばれる、ユーザが行ったことを表すオブジェクトを引数として <CodeStep step={2}>`dispatch`</CodeStep> を呼び出します。

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React は現在の state とアクションを<CodeStep step={4}>リデューサ関数</CodeStep>に渡します。リデューサは次の state を計算して返します。React はその次の state を保存するとともに、その state を使ってコンポーネントをレンダーし、UI を更新します。

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` は [`useState`](/reference/react/useState) と非常に似ていますが、イベントハンドラから state 更新ロジックをコンポーネントの外の単一の関数に移動することができます。詳しくは、[`useState` と `useReducer` の選び方](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)を参照ください。

---

### リデューサ関数の書き方 {/*writing-the-reducer-function*/}

リデューサ関数は次のように宣言されます：

```js
function reducer(state, action) {
  // ...
}
```

その後、次の state を計算して返すコードを中に書いていきます。慣例として、[`switch` 文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)として書くことが一般的です。`switch` の各 `case` ごとに、次の state を計算して返します。

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

アクションの形はどのようなものでも構いません。慣例として、アクションを識別するための `type` プロパティを持ったオブジェクトを渡すことが一般的です。アクションにはリデューサが次の state を計算するために必要な最小限の情報を含めるべきです。

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

アクションのタイプ名はコンポーネント内にローカルなものです。[各アクションは、複数のデータの変更につながるものであっても、単一のユーザ操作を表すようにしてください](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well)。state の形は任意ですが、通常はオブジェクトまたは配列になります。

詳しくは、[リデューサへの state ロジックの抽出](/learn/extracting-state-logic-into-a-reducer)を参照ください。

<Pitfall>

state は読み取り専用です。state 内のオブジェクトや配列を変更しないでください。

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

代わりに、常に新しいオブジェクトをリデューサから返してください。

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

詳しくは、[state 内のオブジェクトの更新](/learn/updating-objects-in-state)と [state 内の配列の更新](/learn/updating-arrays-in-state)を参照ください。

</Pitfall>

<Recipes titleText="基本的な useReducer の例" titleId="examples-basic">

#### フォーム（オブジェクト） {/*form-object*/}

この例では、リデューサが 2 つのフィールド（`name` と `age`）を持つ state オブジェクトを管理しています。

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### タスクリスト（配列） {/*todo-list-array*/}

この例では、リデューサがタスクの配列を管理しています。配列は[書き換えずに更新する](/learn/updating-arrays-in-state)必要があります。

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

#### Immer を使って簡潔な更新ロジックを書く {/*writing-concise-update-logic-with-immer*/}

配列やオブジェクトを書き換えずに更新するのが面倒な場合、[Immer](https://github.com/immerjs/use-immer#useimmerreducer) のようなライブラリを使用して冗長なコードを減らすことができます。Immer を使用すると、オブジェクトを書き換えているかのような簡潔なコードを書くことができますが、内部ではイミュータブルな更新が行われます。

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

### 初期 state の再作成を避ける {/*avoiding-recreating-the-initial-state*/}

React は初期 state を一度保存したのち、次回以降のレンダーでは無視します。

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

`createInitialState(username)` の結果は初期レンダーでのみ使用されますが、レンダーの度に毎回この関数を呼び出しています。これは、大きな配列を作成したり、高コストな計算を行ったりしている場合に無駄になる可能性があります。

これを解決するために、`useReducer` の 3 番目の引数として**初期化関数を渡す**ことができます：

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

`createInitialState` を渡していることに注意してください。これは*関数そのもの*であり、`createInitialState()` ではありません。これにより、初期 state は初期化後に再作成されなくなります。

上記の例では、`createInitialState` は `username` 引数を受け取ります。初期化関数が初期 state を計算するために情報を必要としない場合は、`useReducer` に対して 2 番目の引数として `null` を渡すことができます。

<Recipes titleText="初期化関数と初期 state を直接渡す方法の違い" titleId="examples-initializer">

#### 初期化関数を渡す {/*passing-the-initializer-function*/}

この例では、初期化関数を渡しているため、`createInitialState` 関数は初期化時にのみ実行されます。初期化関数は入力フィールドに文字を入力するなどでコンポーネントが再レンダーされたとしても実行されません。

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
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

この例では、初期化関数を渡して**いない**ため、`createInitialState` 関数は入力フィールドに文字を入力するなど、レンダーの度に毎回実行されます。動作には目に見える違いはありませんが、効率が下がります。

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
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

## トラブルシューティング {/*troubleshooting*/}

### アクションをディスパッチしたがログには古い state の値が表示される {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

`dispatch` 関数を呼び出しても、**実行中のコード内の state は変更されません**：

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!

  setTimeout(() => {
    console.log(state.age); // Also 42!
  }, 5000);
}
```

これは [state がスナップショットのように振る舞う](/learn/state-as-a-snapshot)ためです。state を更新すると、新しい state の値で再レンダーが要求されますが、既に実行中のイベントハンドラ内の `state` JavaScript 変数には影響を与えません。

次の state の値を推測する必要がある場合は、リデューサを自分で呼び出すことで手動で計算することができます：

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### アクションをディスパッチしたが画面が更新されない {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) の比較により、**次の state が前の state と等しいと判断される場合、更新を無視します**。これは通常、state 内のオブジェクトや配列を直接書き換えた場合に発生します：

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

既存の `state` オブジェクトを書き換えて返しているため、React は更新を無視します。これを修正するには、常に [state 内のオブジェクトの更新](/learn/updating-objects-in-state)や [state 内の配列の更新](/learn/updating-arrays-in-state)を正しく行い、これらの書き換えを避ける必要があります。

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### ディスパッチ後にリデューサからの state の一部が undefined になる {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

新しい state を返す際に、すべての `case` の分岐において**すべての既存のフィールドをコピーする**ようになっているか確認してください：

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

上記の `...state` を省略すると、返される次の state には `age` フィールドのみが含まれ、他のフィールドは何も含まれなくなってしまいます。

---

### ディスパッチ後にリデューサからの state 全体が undefined になる {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

state が予期せず `undefined` になる場合、おそらくいずれかの `case` で state を `return` し忘れているか、アクションのタイプがいずれの `case` とも一致していないからです。原因を見つけるために、`switch` の外でエラーをスローしてみましょう。

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

また、このようなミスをキャッチするために、TypeScript のような静的型チェッカを使用することもできます。

---

### "Too many re-renders" というエラーが発生する {/*im-getting-an-error-too-many-re-renders*/}

`Too many re-renders. React limits the number of renders to prevent an infinite loop.` というエラーが表示されることがあります。通常、これはレンダー中にアクションを無条件でディスパッチしているため、コンポーネントがループに入っていることを意味します：レンダー、ディスパッチ（これにより再度レンダーが発生）、レンダー、ディスパッチ（これにより再度レンダーが発生）、といった繰り返しです。非常に多くの場合、これはイベントハンドラの指定方法のミスによって引き起こされます。

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

このエラーの原因がわからない場合は、コンソールのエラーの横にある矢印をクリックし、JavaScript スタックを調べてエラーの原因となる具体的な `dispatch` 関数呼び出しを見つけてください。

---

### リデューサまたは初期化関数が 2 回実行される {/*my-reducer-or-initializer-function-runs-twice*/}

[Strict Mode](/reference/react/StrictMode) では、React はリデューサと初期化関数を 2 回呼び出します。これによってコードが壊れることがあってはなりません。

この**開発専用**の振る舞いは、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)ために役立ちます。React は 2 回の呼び出しのうちの 1 つの結果を使用し、もう 1 つの結果は無視します。コンポーネント、イニシャライザ、およびリデューサ関数が純粋である限り、これはロジックに影響を与えません。ただし、これらの関数が誤っていて不純である場合、これによりミスに気付くことができます。

例えば、以下の純粋でないリデューサ関数はステート内の配列を書き換えています：

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

React がリデューサ関数を 2 回呼び出すため、todo が 2 回追加されたことがわかり、ミスがあることがわかります。この例では、[配列の書き換えではなく置き換えを行う](/learn/updating-arrays-in-state#adding-to-an-array)ことでミスを修正できます：

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

これでリデューサ関数は純粋になったため、1 回余分に呼び出されても動作に影響はありません。これが React が 2 回呼び出すことでミスを発見できる理由です。**コンポーネント、初期化関数、およびリデューサ関数のみが純粋である必要があります**。イベントハンドラは純粋である必要はないため、React はイベントハンドラを 2 回呼び出すことはありません。

詳細は、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)を参照してください。
