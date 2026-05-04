---
title: useContext
---

<Intro>

`useContext` はコンポーネントで[コンテクスト (Context)](/learn/passing-data-deeply-with-context) の読み取りとサブスクライブ（subscribe, 変更の受け取り）を行うための React フックです。

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

コンポーネントのトップレベルで `useContext` を呼び出して、[コンテクスト](/learn/passing-data-deeply-with-context)を読み取り、サブスクライブします。

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `SomeContext`: 事前に [`createContext`](/reference/react/createContext) で作成したコンテクストです。コンテクストとはそれ自体が情報を保持しているわけではなく、コンポーネントで提供 (provide) したり読み取ったりできる「情報の種別」を表すものです。

#### 返り値 {/*returns*/}

`useContext` は、呼び出したコンポーネントに対応するコンテクストの値を返します。値は、ツリー内で `useContext` を呼び出したコンポーネントの上位かつ最も近い `SomeContext` に渡された `value` として決定されます。そのようなプロバイダが存在しない場合は、返り値はそのコンテクストの [`createContext`](/reference/react/createContext) に渡した `defaultValue` になります。返り値は常にコンテクストの最新の値です。React は、コンテクストに変更があると、それを読み取っているコンポーネントを自動的に再レンダーします。

#### 注意点 {/*caveats*/}

* コンポーネントの `useContext()` 呼び出しは、*同じ*コンポーネントから返されるプロバイダの影響を受けません。対応する `<Context>` は、`useContext()` を呼び出すコンポーネントの***上*にある**必要があります。
* あるコンテクストのプロバイダが異なる `value` を受け取ると、当該プロバイダより下にありそのコンテクストを使用しているすべての子コンポーネントは、React によって**自動的に再レンダーされます**。前の値と次の値は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で比較されます。[`memo`](/reference/react/memo) を使って再レンダーをスキップする場合でも、子コンポーネントがコンテクストから新しい値を受け取ることによる再レンダーは妨げられません。
* ビルドシステムが生成する出力の中にモジュールの重複がある場合（シンボリックリンクで起こり得る場合がある）、コンテクストが壊れる可能性があります。コンテクストを介した値の受け渡しが動作するのは、コンテクストを提供するために使用する `SomeContext` と、読み込むために使用する `SomeContext` が、`===` による比較で***厳密*に同じオブジェクト**である場合のみです。

---

## 使用法 {/*usage*/}


### ツリーの深くにデータを渡す {/*passing-data-deeply-into-the-tree*/}

コンポーネントのトップレベルで `useContext` を呼び出して[コンテクスト](/learn/passing-data-deeply-with-context)を読み取り、サブスクライブします。

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

`useContext` は<CodeStep step={1}>渡したコンテクスト</CodeStep>に対応する<CodeStep step={2}>コンテクストの値</CodeStep>を返します。コンテクストの値を決定するために、React はコンポーネントツリーを探索し、そのコンテクストに対して**最も近い上位のコンテクストプロバイダ**を見つけます。

コンテクストを上記の `Button` に渡すには、該当のボタンあるいはその親コンポーネントのいずれかを、対応するコンテクストプロバイダでラップします。

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

プロバイダと `Button` の間にどれだけ多くのコンポーネントが挟まっていても関係ありません。`Form` の内部の*どこか*で `Button` が `useContext(ThemeContext)` を呼び出すとき、値として `"dark"` を受け取ります。

<Pitfall>

`useContext()` は常に、呼び出すコンポーネントより最も近い、*上位*にあるプロバイダを探します。上方向に探索を行うので、`useContext()` を呼び出すコンポーネント自体にあるプロバイダは**考慮しません**。

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### コンテクスト経由で渡されたデータの更新 {/*updating-data-passed-via-context*/}

多くの場合、時間とともにコンテクストを変化させたいと思うでしょう。コンテクストを更新するには、それを [state](/reference/react/useState) と組み合わせます。親コンポーネントで state 変数を宣言し、現在の state を<CodeStep step={2}>コンテクストの値</CodeStep>としてプロバイダに渡します。

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext>
  );
}
```

これにより、プロバイダの内部にある、どの `Button` も現在の `theme` の値を受け取るようになります。`setTheme` を呼び出してプロバイダに渡す `theme` 値を更新すると、すべての `Button` コンポーネントは新たな値である `'light'` を使って再レンダーされます。

<Recipes titleText="Examples of updating context" titleId="examples-basic">

#### コンテクスト経由で渡された値の更新 {/*updating-a-value-via-context*/}

この例では、`MyApp` コンポーネントが state 変数を保持し、それが `ThemeContext` プロバイダに渡されます。"Dark mode" のチェックボックスを選択すると、state が更新されます。プロバイダに渡す値を更新すると、そのコンテクストを使用しているすべてのコンポーネントが再レンダーされます。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

`value="dark"` は `"dark"` という文字列を渡しますが、`value={theme}` は JavaScript の `theme` 変数の値を [JSX の波括弧](/learn/javascript-in-jsx-with-curly-braces)で渡していることに注意してください。波括弧を使うことで、文字列以外のコンテクスト値も渡すことができます。

<Solution />

#### コンテクストを介してオブジェクトを更新する {/*updating-an-object-via-context*/}

この例では、オブジェクトを保持する `currentUser` という state 変数があります。`{ currentUser, setCurrentUser }` という形で 1 つのオブジェクトにまとめ、`value={}` の中でコンテクストを介して渡しています。これにより、`LoginButton` のような下位のコンポーネントは `currentUser` と `setCurrentUser` の両方を読み取り、必要に応じて `setCurrentUser` を呼び出すことができます。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### 複数のコンテクスト {/*multiple-contexts*/}

この例には 2 つの独立したコンテクストがあります。`ThemeContext` は現在のテーマを文字列として提供し、一方で `CurrentUserContext` は現在のユーザを表すオブジェクトを保持しています。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext>
    </ThemeContext>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName.trim() !== '' && lastName.trim() !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### プロバイダをコンポーネントに抽出する {/*extracting-providers-to-a-component*/}

アプリが大きくなるにつれ、アプリのルート近くにコンテクストの「ピラミッド」ができることでしょう。これには何の問題もありません。ですが、入れ子になった見た目が気に入らない場合、プロバイダを単一のコンポーネントに抽出することができます。この例では、`MyProviders` が「配管」を隠蔽し、アプリが必要とするプロバイダの内部に、渡された子をレンダーしています。`theme` state と `setTheme` は `MyApp` 自身の中で必要ですので、この state は依然 `MyApp` が所有していることに注意してください。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext value={theme}>
      <CurrentUserContext
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext>
    </ThemeContext>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### コンテクストとリデューサでスケールアップ {/*scaling-up-with-context-and-a-reducer*/}

大規模なアプリでは、コンテクストと[リデューサ (reducer)](/reference/react/useReducer) を組み合わせて、コンポーネントからある state に関連するロジックを抽出することが一般的に行われます。以下の例では、すべての「繋ぎ込み」コードが、リデューサと 2 つの独立したコンテクストが含まれる `TasksContext.js` 内に隠蔽されています。

この例の[詳細なウォークスルーはこちら](/learn/scaling-up-with-reducer-and-context)。

<Sandpack>

```js src/App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js src/TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js src/AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js src/TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

</Recipes>

---

### フォールバックとなるデフォルト値の指定 {/*specifying-a-fallback-default-value*/}

React がある<CodeStep step={1}>コンテクスト</CodeStep>に対応するプロバイダを親ツリーで見つけられない場合、`useContext()` が返すコンテクストの値は、[コンテクストを作成](/reference/react/createContext)したときに指定した<CodeStep step={3}>デフォルト値</CodeStep>と等しくなります：

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

デフォルト値は**絶対に変更されません**。コンテクストを更新したい場合、[上記で説明したように](#updating-data-passed-via-context)、state と組み合わせて使用します。

多くの場合、`null` の代わりにデフォルト値として使える、意味のある値があるはずです。例えば：

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

こうすれば、対応するプロバイダなしにコンポーネントを間違ってレンダーしてしまっても、壊れることはありません。テスト環境でも、テストコードにプロバイダをたくさん設定せずともコンポーネントがうまく動作するようになります。

下記の例では、"Toggle theme" ボタンは**あらゆるテーマコンテクストプロバイダの外部にあり**、かつテーマコンテクストのデフォルト値が `'light'` であるため、常に light の色調で表示されます。テーマの初期値を `'dark'` に変更してみてください。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext value={theme}>
        <Form />
      </ThemeContext>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### ツリーの一部でコンテクストの値を上書きする {/*overriding-context-for-a-part-of-the-tree*/}

異なる値を持つプロバイダでツリーの一部をラップすることにより、その部分のコンテクストを上書きできます。

```js {3,5}
<ThemeContext value="dark">
  ...
  <ThemeContext value="light">
    <Footer />
  </ThemeContext>
  ...
</ThemeContext>
```

プロバイダのネストと上書きは必要なだけ行うことができます。

<Recipes titleText="Examples of overriding context">

#### テーマの上書き {/*overriding-a-theme*/}

この例では、`Footer` の*内部*にあるボタンは、外部にあるボタン（`"dark"`）とは違うコンテクスト値（`"light"`）を受け取ります。

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext value="light">
        <Footer />
      </ThemeContext>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### 自動的な見出しのネスト {/*automatically-nested-headings*/}

コンテクストプロバイダをネストすることで、情報の「累積計算」ができます。この例では、`Section` コンポーネントはセクションのネストの深さを指定する `LevelContext` を管理しています。親セクションから `LevelContext` を読み取り、その数値に 1 を加えた `LevelContext` の値を子に提供します。その結果、`Heading` コンポーネントは、`<h1>`、`<h2>`、`<h3>`、... のうちどのタグを使用するかを、自身の外側にネストされている `Section` コンポーネントの数に従って、自動的に決定できます。

この例の[詳細なウォークスルーはこちら](/learn/passing-data-deeply-with-context)。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js src/Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  );
}
```

```js src/Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js src/LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### オブジェクトや関数を渡すときの再レンダーの最適化 {/*optimizing-re-renders-when-passing-objects-and-functions*/}

コンテクストを介して、オブジェクトや関数を含んだどんな値も渡すことができます。

```js [[2, 10, "{ currentUser, login }"]]
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext value={{ currentUser, login }}>
      <Page />
    </AuthContext>
  );
}
```

ここでは、<CodeStep step={2}>コンテクストの値</CodeStep>は、2 つのプロパティを持つ JavaScript オブジェクトであり、そのうちの 1 つは関数になります。`MyApp` が再レンダーされるたびに（例えば、ページ遷移など）、これは*異なる*関数の入った*異なる*オブジェクトを指すため、React はツリーにある `useContext(AuthContext)` を呼び出しているすべてのコンポーネントを再レンダーしなければなりません。

小規模なアプリでは、問題になりません。ですが、`currentUser` のような内部のデータが変更されていないなら、再レンダーする必要はありません。データが変わっていないという事実を React が最大限に活用できるように、`login` 関数を [`useCallback`](/reference/react/useCallback) でラップし、オブジェクトの生成を [`useMemo`](/reference/react/useMemo) でラップすることができます。これはパフォーマンスの最適化です：

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext value={contextValue}>
      <Page />
    </AuthContext>
  );
}
```

この変更の結果、`MyApp` が再レンダーする必要があっても、`currentUser` が変更されていない限り、`useContext(AuthContext)` を呼び出しているコンポーネントを再レンダーする必要はなくなります。

詳しくは [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) と [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) を参照してください。

---

## トラブルシューティング {/*troubleshooting*/}

### プロバイダに渡した値が自分のコンポーネントから見えない {/*my-component-doesnt-see-the-value-from-my-provider*/}

これが起こる一般的な理由はいくつかあります：

1. `useContext()` を呼び出しているコンポーネントと同じ（または下位の）コンポーネントで `<SomeContext>` をレンダーしている。`<SomeContext>` を `useContext()` を呼び出すコンポーネントの*外側かつ上位*に移動してください。
2. コンポーネントを `<SomeContext>` でラップし忘れているか、ツリー内の思っているのとは違う場所に配置してしまっている。[React DevTools](/learn/react-developer-tools) を使ってツリー階層が正しいか確認してみてください。
3. プロバイダコンポーネントから見た `SomeContext` と、利用側のコンポーネントから見た `SomeContext` が、ビルドツールの問題により 2 つの異なるオブジェクトになっている。これは例えば、シンボリックリンクを使用している場合などに発生します。これを確認するために、それらを `window.SomeContext1` や `window.SomeContext2` のようなグローバル変数に割り当て、コンソールで `window.SomeContext1 === window.SomeContext2` が成り立つか確認してみてください。もし同一でないなら、ビルドツールのレベルで、その問題を修正する必要があります。

### 違うデフォルト値を指定しているのにコンテクストから常に `undefined` が返ってくる {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

ツリーの中に `value` のないプロバイダがあるのかもしれません：

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext>
   <Button />
</ThemeContext>
```

`value` を指定し忘れた場合、それは `value={undefined}` を渡すのと同じです。

また、誤って props として違う名前を使っているのかもしれません：

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext theme={theme}>
   <Button />
</ThemeContext>
```

どちらの場合も、React からの警告がコンソールに表示されるはずです。修正するには、props として `value` を使います：

```js {1,2}
// ✅ Passing the value prop
<ThemeContext value={theme}>
   <Button />
</ThemeContext>
```

[createContext(defaultValue) で指定するデフォルト値](#specifying-a-fallback-default-value)は、ツリーの上側に**一致するプロバイダが一切存在しない場合**にのみ使用されることに注意してください。親のツリーのどこかに `<SomeContext value={undefined}>` のようなコンポーネントがあれば、`useContext(SomeContext)` を呼び出すコンポーネントはコンテクスト値として*その* `undefined` を受け取ります。
