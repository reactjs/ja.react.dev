---
title: state ロジックをリデューサに抽出する
---

<Intro>

多くのイベントハンドラにまたがって state の更新コードが含まれるコンポーネントは、理解が大変になりがちです。このような場合、コンポーネントの外部に、*リデューサ (reducer)* と呼ばれる単一の関数を作成し、すべての state 更新ロジックを集約することができます。

</Intro>

<YouWillLearn>

- リデューサ関数とは何か
- `useState` から `useReducer` にリファクタリングする方法
- リデューサを使用するタイミング
- リデューサを適切に記述する方法

</YouWillLearn>

## リデューサで state ロジックを集約する {/*consolidate-state-logic-with-a-reducer*/}

コンポーネントの複雑さが増すにつれ、コンポーネントの state がどのように更新されるかを一目で確認することが難しくなります。例えば、以下の `TaskApp` コンポーネントは state として `tasks` という配列を保持しており、タスクの追加・削除・編集を行うために 3 つの異なるイベントハンドラが使用されています。

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

それぞれのイベントハンドラは `setTasks` を呼び出して state を更新しています。このコンポーネントが大きくなるにつれ、そこにバラバラに書かれる state ロジックの量も増えていきます。複雑さを減らし、すべてのロジックを 1 つの簡単にアクセスできる場所にまとめるために、コンポーネントの外部にある 1 つの関数、すなわち**リデューサ関数**とよばれるものに、state ロジックを移動させることができます。

リデューサは、state を扱うもう 1 つの方法です。`useState` から `useReducer` への移行は、次の 3 つのステップで行うことができます。

1. state セットをアクションのディスパッチに**置き換える**。
2. リデューサ関数を**作成**する。
3. コンポーネントからリデューサを**使用**する。

### ステップ 1：state セットをアクションのディスパッチに置き換える {/*step-1-move-from-setting-state-to-dispatching-actions*/}

現在のイベントハンドラは、state をセットすることで*何をするのか*を指定しています。

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

state をセットするロジックをすべて削除します。残るのは以下の 3 つのイベントハンドラです。

- `handleAddTask(text)` は、ユーザが "Add" を押したときに呼び出される。
- `handleChangeTask(task)` は、ユーザがタスクのチェック状態を切り替えたときや "Save" を押したときに呼び出される。
- `handleDeleteTask(taskId)` は、ユーザが "Delete" を押したときに呼び出される。

リデューサを使った state 管理は state を直接セットするのとは少し異なります。React に対して state をセットして「何をするか」を指示するのではなく、イベントハンドラから「アクション」をディスパッチすることで「ユーザが何をしたか」を指定します。（state の更新ロジックは別の場所に書きます！）つまりイベントハンドラで「`tasks` をセットする」のではなく、「タスクを追加/変更/削除した」というアクションのディスパッチを行います。これはユーザの意図をより具体的に表現するものです。

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

`dispatch` に渡すオブジェクトは "アクション (action)" と呼ばれます。

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

アクションは通常の JavaScript オブジェクトです。何を入れるかはあなたが決めることですが、一般的には「*何が起こったか*」に関する最小限の情報が含まれているべきです。（`dispatch` 関数自体は後のステップで追加します。）

<Note>

アクションオブジェクトはどのような形状でも構いません。

一般的な慣習としては、何が起こったかを説明する文字列の `type` を与え、他のフィールドを使って追加情報を渡します。`type` はコンポーネント固有のもので、この例では `'added'` や `'added_task'` といったものがよいでしょう。何が起こったかを説明する名前を選んでください！

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Note>

### ステップ 2：リデューサ関数を作成する {/*step-2-write-a-reducer-function*/}

リデューサ関数が、state のロジックを記述する場所です。現在の state とアクションオブジェクトの 2 つを引数に取り、次の state を返すようにします。

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

React が state をリデューサからの返り値にセットします。

この例では、イベントハンドラからリデューサ関数に state の設定ロジックを移動するために、以下の手順を実施します。

1. 現在の state (`tasks`) を最初の引数として宣言する。
2. `action` オブジェクトを 2 番目の引数として宣言する。
3. リデューサから*次の* state を返す（React が state をその値にセットする）。

以下がリデューサ関数に移行した state 設定ロジックの全体像です :

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

リデューサ関数は state (`tasks`) を引数として取るため、**コンポーネントの外部で宣言することができます**。これにより、インデントレベルが減り、コードが読みやすくなります。

<Note>

上記のコードでは if/else 文が使用されていますが、リデューサの中では [switch 文](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch)を使うことが一般的です。結果は同じですが、switch 文の方が一目でわかりやすくなります。

これ以降のドキュメントでは、switch 文を以下のように使用します。

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

各 `case` ブロックを `{` と `}` の波括弧で囲むことをお勧めします。これにより、異なる `case` の中で宣言された変数が互いに衝突するのを防ぐことができます。また、`case` は通常 `return` で終わるべきです。`return` を忘れると、コードが次の `case` に「流れて」してしまい、誤りが発生することがあります！

もしまだ switch 文に慣れていないのであれば、if/else を使用しても全く問題ありません。

</Note>

<DeepDive>

#### なぜリデューサと呼ばれるのか？ {/*why-are-reducers-called-this-way*/}

リデューサによりコンポーネント内のコード量を「削減 (reduce)」することもできますが、実際にはリデューサは配列で行うことができる [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) という操作にちなんで名付けられています。

`reduce()` 操作とは、配列を受け取り、多くの値を 1 つの値に「まとめる」ことができるものです。

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

ここで `reduce` に渡している関数が "リデューサ" と呼ばれるものです。これは「ここまでの結果」と「現在の要素」を受け取り、「次の結果」を返す関数です。React のリデューサも同じアイディアを用いています。「ここまでの state」と「アクション」を受け取り、「次の state」を返します。このようにして、経時的に発生する複数のアクションを 1 つの state に「まとめて」いるわけです。

`reduce()` メソッドにリデューサを渡して使用することで、初期 state とアクションの配列から最終 state を計算することもできます。

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

自前でこれを行う必要はないでしょうが、React が行っていることもこれと似ています！

</DeepDive>

### ステップ 3：コンポーネントからリデューサを使用する {/*step-3-use-the-reducer-from-your-component*/}

最後に、`tasksReducer` をコンポーネントに接続する必要があります。React から `useReducer` フックをインポートしてください。

```js
import { useReducer } from 'react';
```

そして、以下の `useState` 呼び出しを：

```js
const [tasks, setTasks] = useState(initialTasks);
```

このように `useReducer` で置き換えます：

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

`useReducer` フックは、初期 state を受け取り、state 値とそれを更新するための手段（この場合は dispatch 関数）を返す、という点では `useState` に似ています。ただし少し違いもあります。

`useReducer` フックは 2 つの引数を取ります。

1. リデューサ関数
2. 初期 state

そして次のものを返します。

1. state 値
2. ディスパッチ関数（ユーザアクションをリデューサに「ディスパッチ」する）

さあ、これですべてが繋がりました！ ここでは、リデューサがコンポーネントファイルの最後に宣言されています。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

必要であれば、リデューサを別のファイルに移動させることもできます。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

このように関心を分離することで、コンポーネントのロジックが読みやすくなります。イベントハンドラはアクションをディスパッチすることで「何が起こったか」を指定し、リデューサ関数がそれらに対する「state の更新方法」を決定します。

## `useState` と `useReducer` の比較 {/*comparing-usestate-and-usereducer*/}

リデューサにもデメリットがないわけではありません。以下のような様々な点で両者には違いがあります。

- **コードサイズ**：一般に、`useState` を使った方が最初に書くコードは少なくなります。`useReducer` の場合、リデューサ関数とアクションをディスパッチするコードを*両方*書く必要があります。ただし、多くのイベントハンドラが同様の方法で state を変更している場合、`useReducer` によりコードを削減できます。
- **可読性**：シンプルな state 更新の場合は `useState` を読むのは非常に簡単です。しかし、より複雑になると、コンポーネントのコードが肥大化し、見通すことが難しくなります。このような場合、`useReducer` を使うことで、更新ロジックによって書かれる「どう更新するのか」と、イベントハンドラに書かれる「何が起きたのか」とを、きれいに分離することができます。
- **デバッグ**：`useState` を使っていてバグがある場合、state が*どこで*誤ってセットされたのか、*なぜ*そうなったかを特定するのが難しくなることがあります。`useReducer` を使えば、リデューサにコンソールログを追加することで、すべての state 更新と、それがなぜ起こったか（どの `action` のせいか）を確認できます。それぞれの `action` が正しい場合、リデューサのロジック自体に問題があることが分かります。ただし、`useState` と比べてより多くのコードを調べる必要があります。
- **テスト**：リデューサはコンポーネントに依存しない純関数です。これは、リデューサをエクスポートし、他のものとは別に単体でテストできることを意味します。一般的には、より現実的な環境でコンポーネントをテストするのがベストですが、複雑な state 更新ロジックがある場合は、特定の初期 state とアクションに対してリデューサが特定の state を返すことをテストすることが役立ちます。
- **個人の好み**：人によってリデューサが好きだったり、好きではなかったりします。それで構いません。好みの問題です。`useState` と `useReducer` の間を行ったり来たりすることはいつでも可能です。どちらも同等のものです！

バグが頻繁に発生しておりコンポーネントのコードに構造を導入したい場合に、リデューサを利用することをお勧めします。あらゆるコンポーネントにリデューサを使用する必要はありません。自由に組み合わせてください！ 同じコンポーネントで `useState` と `useReducer` を両方使うことも可能です。

## 良いリデューサの書き方 {/*writing-reducers-well*/}

リデューサを書く際には、以下の 2 つのポイントを心に留めておきましょう。

- **リデューサは純粋である必要があります**。[state の更新用関数](/learn/queueing-a-series-of-state-updates)と同様に、リデューサはレンダー中に実行されます！（アクションは次のレンダーまでキューに入れられます。）つまりリデューサは[純粋でなければならない](/learn/keeping-components-pure)ということです。同じ入力に対して常に同じ出力になります。リクエストを送信したり、タイムアウトを設定したり、副作用（コンポーネントの外部に影響を与える操作）を実行したりすべきではありません。リデューサは、[オブジェクト](/learn/updating-objects-in-state)や[配列](/learn/updating-arrays-in-state)をミューテーション（書き換え）せずに更新する必要があります。
- **各アクションは、複数データの更新を伴う場合であっても単一のユーザ操作を記述するようにします**。たとえば、リデューサで管理されるフォームに "Reset" ボタンがあり、そのフォームには 5 つのフィールドがある場合、5 つの別々の `set_field` アクションをディスパッチするよりも、1 つの `reset_form` アクションをディスパッチする方が理にかなっています。リデューサの各アクションを記録している場合、そのログは、どんなユーザ操作やレスポンスがどんな順序で発生したかを再構築できるほど明確でなければなりません。これはデバッグに役立ちます！

## Immer を使用した簡潔なリデューサの記述 {/*writing-concise-reducers-with-immer*/}

通常の state における[オブジェクトの更新](/learn/updating-objects-in-state#write-concise-update-logic-with-immer)や[配列の更新](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)と同様に、Immer ライブラリを使用してリデューサをより簡潔に記述できます。以下の例では、[`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) を使って、`push` または `arr[i] =` という代入を使って state の書き換えを行っています。

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
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

リデューサは純関数である必要があるため、state を書き換えてはいけません。しかし、Immer は特別な `draft` オブジェクトを提供しており、これを書き換えることは安全です。Immer は内部で、`draft` に加えたミューテーションが適用された state のコピーを作成します。これが、`useImmerReducer` で管理されるリデューサが、最初の引数に書き換えを行えばよく、state を返す必要がない理由です。

<Recap>

- `useState` から `useReducer` に変換するには：
  1. イベントハンドラからアクションをディスパッチする。
  2. state とアクションから次の state を返すリデューサ関数を書く。
  3. `useState` を `useReducer` に置き換える。
- リデューサにより書くコードの量は少し増えるが、デバッグやテストに有用である。
- リデューサは純粋である必要がある。
- 各アクションは、ユーザの操作を 1 つだけ記述する。
- Immer を使えば、ミューテーション型のスタイルでリデューサを書ける。

</Recap>

<Challenges>

#### イベントハンドラからアクションをディスパッチ {/*dispatch-actions-from-event-handlers*/}

現在、`ContactList.js` と `Chat.js` のイベントハンドラは `// TODO` というコメントになっています。このため入力フィールドに入力しても動作せず、ボタンをクリックしても選択された送信先が変更されません。

これら 2 つの `// TODO` を、適切なアクションを `dispatch` するコードに置き換えてください。アクションの構造やタイプを確認するには、`messengerReducer.js` 内のリデューサをチェックしてください。リデューサ自体はすでに書かれているので、変更する必要はありません。`ContactList.js` と `Chat.js` でアクションをディスパッチするだけで構いません。

<Hint>

これらのコンポーネントでは、`dispatch` 関数はすでに props として渡されており利用可能です。対応するアクションオブジェクトでその `dispatch` を呼び出すようにしてください。

アクションオブジェクトの構造を確認するには、リデューサを見て、`action` にどんなフィールドが必要かを確認します。例えば、リデューサの `changed_selection` に対応する case は次のようになっています。

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

つまりアクションオブジェクトに `type: 'changed_selection'` を持たせる必要があるということです。また、`action.contactId` が使われているので、アクションに `contactId` プロパティを含める必要があるでしょう。

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

リデューサのコードから、アクションは次のような見た目になることが推測できます。

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

対応するメッセージをディスパッチするように更新した例はこちらです。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### メッセージ送信時に入力をクリア {/*clear-the-input-on-sending-a-message*/}

現在、"Send" ボタンを押しても何も起こりません。"Send" ボタンにイベントハンドラを追加して、以下のことを行ってください。

1. 送信先のメールアドレスとメッセージを含む `alert` を表示する。
2. メッセージ入力欄をクリアする。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

"Send" ボタンのイベントハンドラでこれを行う方法は複数あります。1 つのアプローチは、アラートを表示してから、空の `message` で `edited_message` アクションをディスパッチすることです。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

これは動作し、"Send" を押すと入力がクリアされます。

ただし、*ユーザーの視点からすると*、メッセージを送るということはフィールドを編集することとは別の操作です。これを反映させるために、代わりに `sent_message` という*新しい*アクションを作成し、リデューサ内で別に処理を行うことができます。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

結果としての振る舞いは同じですが、アクションタイプは理想的には「ユーザが何をしたか」を記述するものであり「state をどのように変更したいか」というものではない、ということに注意してください。これにより、後でより多くの機能を追加することが容易になります。

いずれの解法であっても、リデューサ内に `alert` を**置かない**ことが重要です。リデューサは純関数、つまり、次の state を計算するだけのものであるべきです。メッセージをユーザに表示するといった「何かの実行」を行ってはいけません。メッセージの表示はイベントハンドラで行うべきです。（このような誤りを見つけるために、React は Strict Mode でリデューサを複数回呼び出します。これにより、もしアラートをリデューサに配置してしまった場合、アラートが 2 回表示されます。）

</Solution>

#### タブ切り替え時に入力値を復元 {/*restore-input-values-when-switching-between-tabs*/}

この例では、異なる送信先間で切り替えるとテキスト入力が常にクリアされます。

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

これは、複数の送信先間でメッセージの下書きを共有したくないからです。しかし、アプリがそれぞれの連絡先ごとに書きかけのメッセージを「記憶」しておき、連絡先を切り替えたときにそれらを復元する方がより望ましいでしょう。

あなたの仕事は、state の構造を変更して、*連絡先ごとに*別々のメッセージ下書きを記憶するようにすることです。リデューサ、初期 state、およびコンポーネントにいくつか変更を加える必要があります。

<Hint>

state の構造は次のようにできます。

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
};
```

`[key]: value` 形式の[計算プロパティ名 (computed property)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) 構文は、`messages` オブジェクトを更新するのに有用です。

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

連絡先ごとに別々のメッセージ下書きを保存・更新するようにリデューサを書き換える必要があります。

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

また、`Messenger` コンポーネントを変更して、現在選択されている連絡先のメッセージを読み取るようにします。

```js
const message = state.messages[state.selectedId];
```

答えの全体像は以下のとおりです。

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

特筆すべきは、この異なる動作を実装するために、イベントハンドラを変更する必要がなかったということです。リデューサがない場合、state を更新するすべてのイベントハンドラを変更する必要があります。

</Solution>

#### `useReducer` をゼロから実装 {/*implement-usereducer-from-scratch*/}

これまでの例では、React から `useReducer` フックをインポートしていました。今回は、*`useReducer` フック自体を実装*してください！ 以下に開始地点となるコードが書かれています。コードは 10 行以内で完結するはずです。

変更を確認するために、入力欄に入力してみるか、連絡先を選択してみてください。

<Hint>

以下が実装の概略をもう少しだけ詳細にしたものです。

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

リデューサ関数は、現在の state とアクションオブジェクトという 2 つの引数を受け取り、次の state を返すものであることを思い出してください。`dispatch` の実装は何をすべきでしょうか？

</Hint>

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

アクションがディスパッチされると、現在の state とアクションがリデューサに渡され、結果が次の state として保存されます。コードでは以下のようになります：

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

これでほとんどの場合問題ありませんが、より正確な実装は以下のようになります。

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

これは、ディスパッチされたアクションは次のレンダーまで[更新用関数と同様に](/learn/queueing-a-series-of-state-updates)キューに入れられるためです。

</Solution>

</Challenges>
