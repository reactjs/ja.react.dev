---
title: state の管理
---

<Intro>

アプリケーションが成長するにつれて、state の構成方法やコンポーネント間のデータの流れについて計画的に考えることが重要になります。バグの一般的な原因は、冗長な、あるいは重複した state です。この章では、state を適切に構造化する方法、state 更新ロジックをメンテナンスしやすい状態に保つ方法、そして離れたコンポーネント間で state を共有する方法について学びます。

</Intro>

<YouWillLearn isChapter={true}>

* [UI の変化を state の変化として捉える方法](/learn/reacting-to-input-with-state)
* [state を適切に構造化する方法](/learn/choosing-the-state-structure)
* [コンポーネント間で state を共有するために状態を "リフトアップ" する方法](/learn/sharing-state-between-components)
* [state が保持されるかリセットされるかを制御する方法](/learn/preserving-and-resetting-state)
* [複雑な state ロジックを関数にまとめる方法](/learn/extracting-state-logic-into-a-reducer)
* ["props の穴掘り作業" なしで情報を渡す方法](/learn/passing-data-deeply-with-context)
* [アプリの成長に合わせて state 管理をスケーリングする方法](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## state を使って入力に反応する {/*reacting-to-input-with-state*/}

React を使う場合、コードから直接 UI を変更することはありません。例えば、「ボタンを無効にする」、「ボタンを有効にする」、「成功メッセージを表示する」といったコマンドを書くことはありません。代わりに、コンポーネントのさまざまな視覚状態（例えば「初期状態」、「入力中状態」、「成功状態」）に対して表示したい UI を記述し、ユーザ入力に応じて状態の変更をトリガします。これは、デザイナーが UI を考える方法に似ています。

以下は、React を使って構築されたクイズフォームです。`status` という state 変数を使って、送信ボタンを有効にするか無効にするか、成功メッセージを表示するかどうかを決定していることに注目してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

[**state を使って入力に反応する**](/learn/reacting-to-input-with-state)を読んで、state ベースの考え方ででユーザ操作を扱う方法を学びましょう。

</LearnMore>

## state 構造の選択 {/*choosing-the-state-structure*/}

快適に変更やデバッグが行えるコンポーネントと、常にバグの種になるコンポーネントの違いは、state をうまく構造化できているかどうかです。最も重要な原則は、state に冗長な情報や重複した情報を持たせないことです。不要な state があると、それを更新するのを忘れてすぐにバグが発生してしまいます！

例えば、このフォームには**冗長な** `fullName` という state 変数があります。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

コンポーネントがレンダーされる際に `fullName` を計算することで、この冗長な state を削除し、コードを簡素化することができます。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

これは小さな変更に見えるかもしれませんが、React アプリの多くのバグはこのようにして修正されます。

<LearnMore path="/learn/choosing-the-state-structure">

[**state 構造の選択**](/learn/choosing-the-state-structure)を読んで、バグを避けるために state の構造をどのように設計するか学びましょう。

</LearnMore>

## コンポーネント間で state を共有する {/*sharing-state-between-components*/}

2 つのコンポーネントの state を常に同時に変更したいという場合があります。これを行うには、両方のコンポーネントから state を削除して最も近い共通の親へ移動し、そこから state を props 経由でコンポーネントへ渡します。これは *state のリフトアップ (lifting state up)* として知られているものであり、React コードを書く際に行う最も一般的な作業のひとつです。

この例では、一度にアクティブになるべきパネルは 1 つだけです。これを実現するには、各パネルの内部にアクティブかどうかの state を保持する代わりに、親コンポーネントが state を保持し、子コンポーネントの props を指定するようにします。

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

[**コンポーネント間で state を共有する**](/learn/sharing-state-between-components)を読んで、state をリフトアップしてコンポーネントを同期させる方法を学びましょう。

</LearnMore>

## state の保持とリセット {/*preserving-and-resetting-state*/}

コンポーネントを再レンダーする際、React はツリーのどの部分を保持（および更新）し、どの部分を破棄または最初から再作成するかを決定する必要があります。大抵は React の自動的な挙動でうまくいきます。デフォルトでは、React は以前にレンダーされたコンポーネントツリーと「一致する」部分のツリーを保持します。

ただし、場合によってはこれが望ましくないことがあります。このチャットアプリでは、メッセージを入力した後に送信先を切り替えても、入力フィールドがリセットされません。これにより、ユーザが誤って間違った相手にメッセージを送信してしまうかもしれません。

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

例えば `<Chat key={email} />` のように異なる `key` を渡すことでデフォルトの動作を上書きし、コンポーネントの state を*強制的に*リセットすることができます。これにより、送信先が異なる場合は*異なる* `Chat` コンポーネントであり、新しいデータ（および入力フィールドなど）で最初から再作成する必要があると React に伝えることができます。これにより、全く同じコンポーネントをレンダーしても、送信先を切り替えると入力フィールドがリセットされるようになります。

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

[**state の保持とリセット**](/learn/preserving-and-resetting-state)を読んで、state の寿命や制御方法について学びましょう。

</LearnMore>

## state ロジックをリデューサに抽出する {/*extracting-state-logic-into-a-reducer*/}

多くのイベントハンドラにまたがって state の更新コードが含まれるコンポーネントは、理解が大変になりがちです。このような場合、コンポーネントの外部に、*リデューサ (reducer)* と呼ばれる単一の関数を作成し、すべての state 更新ロジックを集約することができます。イベントハンドラは、ユーザの「アクション」を指定するだけでよくなるため、簡潔になります。以下ではファイルの最後にあるリデューサ関数が、各アクションに対する state の更新方法を指定しています！

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js AddTask.js hidden
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

```js TaskList.js hidden
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

[**state ロジックをリデューサに抽出する**](/learn/extracting-state-logic-into-a-reducer)を読んで、リデューサ関数内にロジックを集約する方法を学びましょう。

</LearnMore>

## コンテクストで深くデータを受け渡す {/*passing-data-deeply-with-context*/}

通常、親コンポーネントから子コンポーネントには props を使って情報を渡します。しかし、props を多数の中間コンポーネントを経由して渡さないといけない場合や、アプリ内の多くのコンポーネントが同じ情報を必要とする場合、props の受け渡しは冗長で不便なものとなり得ます。*コンテクスト (Context)* を使用することで、親コンポーネントから props を明示的に渡さずとも、それ以下のツリー内の任意のコンポーネント（深さに関わらず）が情報を受け取れるようにできます。

ここでは、`Heading` コンポーネントは、最も近い `Section` に自身のネストレベルを「尋ねる」ことで、見出しレベルを決定しています。各 `Section` は、親の `Section` にレベルを尋ねてそれに 1 を加えることで、自分自身のレベルを把握します。すべての `Section` は、props を渡すことなしに、それ以下のすべてのコンポーネントにコンテクストを通じて情報を提供しています。

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

<LearnMore path="/learn/passing-data-deeply-with-context">

[**コンテクストで深くデータを受け渡す**](/learn/passing-data-deeply-with-context)を読んで、props を渡す代わりにコンテクストを使う方法を学びましょう。

</LearnMore>

## リデューサとコンテクストでスケールアップ {/*scaling-up-with-reducer-and-context*/}

リデューサを使えば、コンポーネントの state 更新ロジックを集約することができます。コンテクストを使えば、他のコンポーネントに深く情報を渡すことができます。そしてリデューサとコンテクストを組み合わせることで、複雑な画面の state 管理ができるようになります。

このアプローチでは、複雑な state を持つ親コンポーネントが、リデューサを使って state を管理します。ツリー内の任意の深さにある他のコンポーネントは、コンテクストを介してその state を読み取ることができます。また、その state を更新するためのアクションをディスパッチすることもできます。

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
      <TasksDispatchContext.Provider
        value={dispatch}
      >
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

export default function AddTask({ onAddTask }) {
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

[**リデューサとコンテクストでスケールアップ**](/learn/scaling-up-with-reducer-and-context)を読んで、アプリが成長するに従って state 管理がどのようにスケールしていくか学びましょう。

</LearnMore>

## 次のステップ {/*whats-next*/}

[state を使って入力に反応する](/learn/reacting-to-input-with-state)に進んで、この章をページごとに読み進めましょう！

もしくは、すでにこれらのトピックに詳しい場合、[避難ハッチ](/learn/escape-hatches)について読んでみましょう。
