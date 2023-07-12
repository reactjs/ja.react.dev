---
title: useContext
---

<Intro>

`useContext` はコンポーネントから [コンテクスト](/learn/passing-data-deeply-with-context) を読み取り、サブスクライブするための React のフックです。

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

コンポーネントのトップレベルで `useContext` を呼び出して、[コンテクスト](/learn/passing-data-deeply-with-context) を読み取り、サブスクライブします。

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `SomeContext`: 事前に [`createContext`](/reference/react/createContext) で作成したコンテクストになります。コンテクスト自体が情報を保持しているわけではなく、コンポーネントから提供したり、読み取ったりできるような情報を表しています。

#### 返り値 {/*returns*/}

`useContext` は、呼び出したコンポーネントのコンテクスト値を返します。コンポーネントがツリー内で呼び出されるとき、その上位に位置する最も近い `SomeContext.Provider` に渡された `value` として決定されます。そのようなプロバイダが存在しない場合は、返り値はそのコンテクストの [`createContext`](/reference/react/createContext) に渡した `defaultValue` になります。その返り値は常に最新になります。React は、コンテクストを読み取ったコンポーネントが変更されると、自動的に再レンダーします。

#### 注意点 {/*caveats*/}

* コンポーネントの `useContext()` 呼び出しは、*同じ*コンポーネントから返されるプロバイダの影響を受けません。該当する `<Context.Provider>` は、`useContext()`を呼び出したコンポーネントの**上にある必要**があります。
* 特定のコンテクストを使用する全ての子コンポーネントは、異なる `value` を受け取るプロバイダから始まり、React によって自動的に再レンダーします。前の値と次の値は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で比較されます。[`memo`](/reference/react/memo) で再レンダーをスキップしても、子のプロバイダは新しいコンテクスト値を受け取ることはありません。
* ビルドシステムから生成されたアウトプットの中にモジュールの重複があったら、（シンボリックリンクで起こり得る場合がある）コンテクストを壊す可能性があります。コンテクストを介して何かを渡すことは、コンテクストを提供するために使用する `SomeContext` と、読み込むために使用する `SomeContext` が、`===` 比較によって決定されるので、***厳密*に同じオブジェクト**なら動作します。

---

## 使い方 {/*usage*/}


### ツリーの深くにデータを渡す {/*passing-data-deeply-into-the-tree*/}

コンポーネントのトップレベルで `useContext` を呼び出して [コンテクスト](/learn/passing-data-deeply-with-context) を読み取り、サブスクライブします。

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` は <CodeStep step={2}>コンテクストの値</CodeStep> を <CodeStep step={1}>渡したコンテクスト</CodeStep> のために返します。コンテクストの値を決定するために、React はコンポーネントツリーを探索し、特定のコンテクストに対して**最も近い上位のコンテクストプロバイダ**を見つけます。

コンテクストを `Button` に渡すために、該当のコンテクストプロバイダでラップします :

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

プロバイダと `Button` の間にどれだけ多くのコンポーネントの層があっても関係ありません。`Form` の内部の*どこか*で `Button` が `useContext(ThemeContext)` を呼び出すとき、値として`"dark"`を受け取ります。

<Pitfall>

`useContext()` は、呼び出すコンポーネントより最も近い上位にあるプロバイダを常に探します。上方向に探索し、`useContext()` を呼び出したコンポーネントにあるプロバイダは**考慮しません**。

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
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

### コンテクストを介したデータの更新 {/*updating-data-passed-via-context*/}

多くの場合、時間とともにコンテクストを変化させたいと思うでしょう。コンテクストを更新するために、それを [state.](/reference/react/useState) と組み合わせてください。親コンポーネントで state 変数を宣言します。親コンポーネントで state 変数を宣言して、現在の state を <CodeStep step={2}>コンテクストの値</CodeStep> としてプロバイダに渡します。

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

これにより、プロバイダの内部にある、どの `Button` も現在の `theme` 値を受け取るようになります。もし setTheme を呼び出してプロバイダに渡す theme 値を更新すると、すべての `Button` コンポーネントは新たな `'light'` 値で再レンダーされます。

<Recipes titleText="Examples of updating context" titleId="examples-basic">

#### コンテクストを介して値を更新する {/*updating-a-value-via-context*/}

この例では、`MyApp` コンポーネントが state 変数を保持し、それが `ThemeContext` プロバイダに渡されます。「ダークモード」のチェックボックスを選択すると、ステートが更新されます。提供された値を変更すると、そのコンテクストを使用しているすべてのコンポーネントが再レンダーされます。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
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
    </ThemeContext.Provider>
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

`value="dark"` は `"dark"` という文字列を渡しますが、`value={theme}` は JavaScript の `theme` 変数の値を [JSX の中括弧](/learn/javascript-in-jsx-with-curly-braces) で渡しすことに注意してください。中括弧を使うことで、文字列以外のコンテクスト値も渡すことができます。

<Solution />

#### コンテクストを介してオブジェクトを更新する {/*updating-an-object-via-context*/}

この例では、オブジェクトを保持する `currentUser` の state 変数があります。`{ currentUser, setCurrentUser }` を 1 つのオブジェクトにまとめ、`value={}` の中でコンテクストを介して渡します。これにより、`LoginButton` のような下位のコンポーネントは `currentUser` と `setCurrentUser` の両方を読み取り、必要に応じて `setCurrentUser` を呼び出すことができます。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
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

この例では、2 つの独立したコンテクストがあります。`CurrentUserContext` は現在のユーザを表すオブジェクトを保持している間、`ThemeContext` を文字列として現在のテーマを提供します

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
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
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
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

#### プロバイダをコンポーネントに抽出する {/*extracting-providers-to-a-component*/}

アプリが大きくなると、アプリのルートに近くにコンテクストの「ピラミッド」ができるかもしれません。何も問題はないです。ですが、入れ子になった見た目が気に入らないなら、プロバイダを単一のコンポーネントに抽出することができます。この例では、`MyProviders` は「配管」を隠蔽し、渡された子のプロバイダーを必要なプロバイダーの中にレンダーします。`theme` と `setTheme` の state は `MyApp` 自身の中で必要なので、`MyApp` はまだその state の一部を所有していることに注意してください。

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
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
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

#### レデューサ (reducer) とコンテクストを組み合わせてスケーリングアップする {/*scaling-up-with-context-and-a-reducer*/}

大規模なアプリでは、コンテクストと [reducer](/reference/react/useReducer) を組み合わせて、コンポーネントから状態に関連するロジックを抽出するのが一般的です。この例では、すべての「配線」は `TasksContext.js` に隠蔽されており、リデューサと 2 つの分離したコンテクストが含まれています。

この例の[詳細なウォークスルー](/learn/scaling-up-with-reducer-and-context)を読んでください。

<Sandpack>

```js App.js
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

```js TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);

const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
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

```js AddTask.js
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

```js TaskList.js
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

### フォールバックの初期値の指定 {/*specifying-a-fallback-default-value*/}

React が特定の<CodeStep step={1}>コンテクスト</CodeStep>のプロバイダを親ツリーで見つけれたら、`useContext()` が返すコンテクストの値は、[コンテキストを作成](/reference/react/createContext)したときに指定した<CodeStep step={3}>初期値</CodeStep>と等しくなります：

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

初期値は**絶対に変更されません**。コンテクストを更新したいなら、[上記で説明したように](#updating-data-passed-via-context)、state と一緒に使用します。

多くの場合、`null` の代わりに初期値として意味のある値を使います。例えば :

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

こうすることで、該当のプロバイダーがないコンポーネントを間違ってレンダーしてしまっても、壊れることはありません。テスト環境で多くのプロバイダを設定しなくても、コンポーネントがうまく動作するようになります。

下記の例では、「テーマの切り替え」ボタンは常に light な色調になります。それは**どのテーマコンテクストプロバイダの外部にあるため**であり、初期値としてのコンテクストテーマ値は `'light'` だからです。テーマの初期値を `'dark'` に変更してみてください。

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
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

### ツリーにある一部のコンテクストを上書きする {/*overriding-context-for-a-part-of-the-tree*/}

ツリーにある異なる値を持つプロバイダでラップすることにより、一部のコンテクストを上書きできます。

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

必要な回数だけ、プロバイダをネストして上書きすることができます。

<Recipes title="Examples of overriding context">

#### テーマの上書き {/*overriding-a-theme*/}

この例では、`Footer` の*内部*にあるボタンは、外部にあるボタン（`"dark"`）とは違うコンテクスト値（`"light"`）を受け取ります。

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
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

#### 自動的にネストされた見出し {/*automatically-nested-headings*/}

コンテクストプロバイダをネストすることで、情報を「累積」することができます。ここの例では、`Section` コンポーネントはセクションのネストの深さを指定する `LevelContext` を追跡しています。親セクションから `LevelContext` を読み取り、その数値に 1 を加えた `LevelContext` を子に提供します。その結果、`Heading` コンポーネントは自動的に、どの `<h1>`、`<h2>`、`<h3>`、... のタグを使用するかを、自身がどれだけの `Section` コンポーネントの内部にネストされているかに伴って決まっていきます。

この例の[詳細なウォークスルー](/learn/passing-data-deeply-with-context)を読んでください。

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

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
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

```js LevelContext.js
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
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

ここでは、<CodeStep step={2}>context value</CodeStep> は、2 つのプロパティを持つ JavaScript のオブジェクトで、そのうちの 1 つは関数になります。`MyApp` が再レンダーされる度に（例えば、ルート更新など）、これは*異なる*オブジェクトを指し、*異なる*関数を指すため、React はツリーにある `useContext(AuthContext)` を呼び出す、すべてのコンポーネントを再レンダーしなければなりません。

小規模なアプリでは、問題になりません。ですが、`currentUser` のような基礎となるデータが変更されていないなら、再レンダーする必要はありません。React がその事実を最大限に活用できるように、`login` 関数を [`useCallback`](/reference/react/useCallback) でラップし、オブジェクトの生成を [`useMemo`](/reference/react/useMemo) にラップすることができます。これはパフォーマンスの最適化です：

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
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

この変更の結果、`MyApp` が再レンダーする必要があっても、`currentUser` が変更されていない限り、`useContext(AuthContext)` を呼び出すコンポーネントを再レンダーする必要はありません。

詳しくは [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) と [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) について、読んでください。

---

## トラブルシューティング {/*troubleshooting*/}

### MyComponent はプロバイダからの値を見れません {/*my-component-doesnt-see-the-value-from-my-provider*/}

これが起こる一般的な方法はいくつかあります：

1. `useContext()` を呼び出すコンポーネントと同じ箇所（または、下位の箇所）で `<SomeContext.Provider>` をレンダーします。`<SomeContext.Provider>` を `useContext()` を呼び出すコンポーネントの*上位*や*外部*に移動してください。
2. コンポーネントを `<SomeContext.Provider>` でラップし忘れているかもしれませんし、思っていたよりもツリー内の違うの箇所に配置してしまったかもしれません。[React DevTools.](/learn/react-developer-tools) を使って階層が正しいか確認してみてください。
3. プロバイダーコンポーネントから見た `SomeContext` と、利用側のコンポーネントから見た `SomeContext` が、ビルドツールの問題により 2 つの異なるオブジェクトになっているかもしれません。例えば、シンボリックリンクを使用している場合などに発生します。これを確認するために、それらを `window.SomeContext1` や `window.SomeContext2` のようなグローバル変数に割り当て、コンソールで `window.SomeContext1 === window.SomeContext2` が成り立つか確認してみてください。もし同一でないなら、ビルドツールレベルで、その問題を修正する必要があります。

### 初期値は違うのに、コンテクストからは常に `undefined` が返ってくる {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

ツリーの中に `value` なしのプロバイダがあるかもしれません：

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

`value` を指定し忘れたら、`value={undefined}`を渡すようなことと同じです。

また、誤って違うプロップ名を使っているのかもしれません：

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

どちらの場合も、React からの警告がコンソールに表示されるはずです。これらを修正するには、プロップ `value` を呼び出します：

```js {1,2}
// ✅ Passing the value prop
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

[createContext(defaultValue) から呼び出された初期値](#specifying-a-fallback-default-value) は、**一致するプロバイダが存在しない場合**にのみ使用されることに、注意してください。親のツリーのどこかに `<SomeContext.Provider value={undefined}>` コンポーネントがあれば、`useContext(SomeContext)` を呼び出すコンポーネントのコンテクスト値として `undefined` を*必ず*受け取るでしょう。