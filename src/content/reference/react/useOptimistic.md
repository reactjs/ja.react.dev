---
title: useOptimistic
---

<Intro>

`useOptimistic` は、UI を楽観的 (optimistic) に更新するための React フックです。

```js
const [optimisticState, setOptimistic] = useOptimistic(value, reducer?);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useOptimistic(value, reducer?)` {/*useoptimistic*/}

コンポーネントのトップレベルで `useOptimistic` を呼び出し、値に対する楽観的 state を作成します。

```js
import { useOptimistic } from 'react';

function MyComponent({name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(28);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, todoReducer);
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `value`: 実行中 (pending) のアクションが存在しない場合に返される値。
* **省略可能** `reducer(currentState, action)`: 楽観的 state の更新方法を定義するリデューサ関数。純関数である必要があり、現在の state とリデューサアクションを引数として受け取り、次の楽観的 state を返す。

#### 返り値 {/*returns*/}

`useOptimistic` は、厳密に 2 つの値を持つ配列を返します。

1. `optimisticState`: 現在の楽観的 state。実行中のアクションがない場合は `value` と同じです。実行中のアクションがある場合は `reducer` が返した state（`reducer` を指定しなかった場合は set 関数に渡した値）と同じになります。
2. [`set` 関数](#setoptimistic): アクション内で楽観的 state を別の値に更新できる関数。

---

### `set` 関数（`setOptimistic(optimisticState)` のように使う） {/*setoptimistic*/}

`useOptimistic` が返す `set` 関数により、[アクション](reference/react/useTransition#functions-called-in-starttransition-are-called-actions)の実行中だけ state を更新できます。次の state を直接渡すことも、前の state から計算するための関数を渡すこともできます。

```js
const [optimisticLike, setOptimisticLike] = useOptimistic(false);
const [optimisticSubs, setOptimisticSubs] = useOptimistic(subs);

function handleClick() {
  startTransition(async () => {
    setOptimisticLike(true);
    setOptimisticSubs(a => a + 1);
    await saveChanges();
  });
}
```

#### 引数 {/*setoptimistic-parameters*/}

* `optimisticState`: [アクション](reference/react/useTransition#functions-called-in-starttransition-are-called-actions)の実行中に楽観的 state として使いたい値。`useOptimistic` に `reducer` を渡している場合、この値は `reducer` の第 2 引数として渡されます。任意の型の値を渡せます。
    * `optimisticState` に関数を渡した場合、それは*更新用関数 (updater function)* として扱われます。純関数である必要があり、楽観的 state を唯一の引数として受け取り、次の楽観的 state を返す必要があります。React は更新用関数をキューに積んでコンポーネントを再レンダーします。次回レンダー時に、React は [`useState` の更新用関数](/reference/react/useState#setstate-parameters) と同様の仕組みで、キューに積まれた更新用関数をひとつ前の state に順に適用していき次の state を計算します。

#### 返り値 {/*setoptimistic-returns*/}

`set` 関数に返り値はありません。

#### 注意点 {/*setoptimistic-caveats*/}

* `set` 関数は[アクション](reference/react/useTransition#functions-called-in-starttransition-are-called-actions)の内部で呼び出す必要があります。アクションの外でセッタ関数を呼ぶと、[React は警告を表示](#an-optimistic-state-update-occurred-outside-a-transition-or-action)し、楽観的 state が一瞬表示されます。

<DeepDive>

#### 楽観的 state の仕組み {/*how-optimistic-state-works*/}

`useOptimistic` を使うと、アクションの実行中に一時的な値を表示できます。

```js
const [value, setValue] = useState('a');
const [optimistic, setOptimistic] = useOptimistic(value);

startTransition(async () => {
  setOptimistic('b');
  const newValue = await saveChanges('b');
  setValue(newValue);
});
```

セッタ関数がアクションの内部で呼び出されると、`useOptimistic` は再レンダーをトリガし、アクションの実行中はその state を表示します。そうでない場合は、`useOptimistic` に渡した `value` が返されます。

この state は "楽観的 (optimistic)" と呼ばれます。実際にはアクションの完了まで時間がかかっているにもかかわらず、アクションの実行結果をユーザに即座に提示するために使われるからです。

**更新の流れ**

1. **即時更新**: `setOptimistic('b')` が呼ばれると、React は直ちに `'b'` でレンダーします。

2. **（オプション）アクション内で await**: アクション内で await している間も、React は `'b'` を表示し続けます。

3. **トランジションをスケジュール**: `setValue(newValue)` が本来の state への更新をスケジュールします。

4. **（オプション）サスペンスを待機**: `newValue` がサスペンドした場合、React は `'b'` を表示し続けます。

5. **単一レンダーでコミット**: 最終的に、`value` と `optimistic` の両方に `newValue` がコミットされます。

楽観的 state を「クリア」するための余分なレンダーはありません。トランジションが完了すると、楽観的な state と本来の state が同一レンダー内で合流して一致するようになります。

<Note>

#### 楽観的 state は一時的なもの {/*optimistic-state-is-temporary*/}

楽観的 state はアクションの実行中にのみレンダーされ、それ以外では `value` がレンダーされます。

`saveChanges` が `'c'` を返した場合、`value` と `optimistic` はどちらも `'b'` ではなく `'c'` になります。

</Note>

**最終的な state が決まる仕組み**

アクション終了後に何が表示されるかは、`useOptimistic` の `value` 引数で決まります。これは以下のどのパターンを使用するかによって変わります。

- `useOptimistic(false)` のような**ハードコードされた値**: アクション終了後も `state` は `false` のままなので、UI は `false` を表示します。常に `false` から始まる保留中状態を表すのに有用です。

- `useOptimistic(isLiked)` のように **props や state を渡すパターン**: アクション中に親が `isLiked` を更新すると、アクション完了後に新しい値が使われます。これにより UI がアクション結果を反映するようになります。

- `useOptimistic(items, fn)` のような**リデューサパターン**: アクションの実行中に `items` が変化した場合、React は新しい `items` で `reducer` を再実行して state を再計算します。これにより、楽観的な追加が常に最新データに対して適用されます。

**アクションが失敗したときの挙動**

アクションがエラーをスローした場合にもトランザクションは終了し、React はその時点の `value` でレンダーを行います。通常、親は成功時にのみ `value` を更新するため、失敗時は `value` が変わらず、UI は楽観的更新前の表示に戻ります。エラーを捕捉してユーザにメッセージを表示することもできます。

</DeepDive>

---

## 使用法 {/*usage*/}

### コンポーネントに楽観的 state を追加する {/*adding-optimistic-state-to-a-component*/}

コンポーネントのトップレベルで `useOptimistic` を呼び出し、1 つ以上の楽観的 state を宣言します。

```js [[1, 4, "age"], [1, 5, "name"], [1, 6, "todos"], [2, 4, "optimisticAge"], [2, 5, "optimisticName"], [2, 6, "optimisticTodos"], [3, 4, "setOptimisticAge"], [3, 5, "setOptimisticName"], [3, 6, "setOptimisticTodos"], [4, 6, "reducer"]]
import { useOptimistic } from 'react';

function MyComponent({age, name, todos}) {
  const [optimisticAge, setOptimisticAge] = useOptimistic(age);
  const [optimisticName, setOptimisticName] = useOptimistic(name);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(todos, reducer);
  // ...
```

`useOptimistic` は厳密に 2 つの値を持つ配列を返します。

1. <CodeStep step={2}>楽観的 state</CodeStep>: 初期値は渡した <CodeStep step={1}>value</CodeStep> です。
2. <CodeStep step={3}>set 関数</CodeStep>: [アクション](reference/react/useTransition#functions-called-in-starttransition-are-called-actions) の間だけ一時的に state を変更できます。
   * <CodeStep step={4}>リデューサ</CodeStep>を渡した場合、楽観的 state を返す前に実行されます。

<<<<<<< HEAD
<CodeStep step={2}>楽観的 state</CodeStep> を使うには、アクション内で `set` 関数を呼び出します。
=======
To use the <CodeStep step={2}>optimistic state</CodeStep>, call the `set` function inside an Action.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

アクションとは `startTransition` 内で呼び出される関数です。

```js {3}
function onAgeChange(e) {
  startTransition(async () => {
    setOptimisticAge(42);
    const newAge = await postAge(42);
    setAge(newAge);
  });
}
```

`age` 自体は現在値のまま、React はまず楽観的 state である `42` を使ってレンダーします。アクションが POST を待機した後、`age` と `optimisticAge` の両方を `newAge` にしてレンダーします。

[楽観的 state の仕組み](#how-optimistic-state-works)で詳細を確認できます。

<Note>

[アクションプロップ (Action props)](/reference/react/useTransition#exposing-action-props-from-components) を使う場合は、`startTransition` なしでセッタ関数を呼び出せます。

```js [[3, 2, "setOptimisticName"]]
async function submitAction() {
  setOptimisticName('Taylor');
  await updateName('Taylor');
}
```

これが動作するのは、アクションプロップがすでに `startTransition` 内で呼び出されるようになっているためです。

例は[アクションプロップで楽観的 state を使う](#using-optimistic-state-in-action-props)を参照してください。

</Note>

---

### アクションプロップで楽観的 state を使う {/*using-optimistic-state-in-action-props*/}

[アクションプロップ](/reference/react/useTransition#exposing-action-props-from-components)中では、`startTransition` なしで楽観的セッタ関数を直接呼び出せます。

以下の例では、`<form>` の props である `submitAction` 内で楽観的 state を設定しています。

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import EditName from './EditName';

export default function App() {
  const [name, setName] = useState('Alice');

  return <EditName name={name} action={setName} />;
}
```

```js src/EditName.js active
import { useOptimistic, startTransition } from 'react';
import { updateName } from './actions.js';

export default function EditName({ name, action }) {
  const [optimisticName, setOptimisticName] = useOptimistic(name);

  async function submitAction(formData) {
    const newName = formData.get('name');
    setOptimisticName(newName);

    const updatedName = await updateName(newName);
    startTransition(() => {
      action(updatedName);
    })
  }

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change it: </label>
        <input
          type="text"
          name="name"
          disabled={name !== optimisticName}
        />
      </p>
    </form>
  );
}
```

```js src/actions.js hidden
export async function updateName(name) {
  await new Promise((res) => setTimeout(res, 1000));
  return name;
}
```

</Sandpack>

この例では、ユーザがフォームのサブミット操作を行うと  `optimisticName` が即座に更新され、サーバリクエストが進行中の間、`newName` を楽観的に表示します。リクエストが完了すると、`name` と `optimisticName` がレスポンスの実際の `updatedName` となってレンダーされます。

<DeepDive>

#### この例で `startTransition` が不要である理由 {/*why-doesnt-this-need-starttransition*/}

慣習として、`startTransition` の中で呼び出される props は "Action" を含む名前になります。

`submitAction` が "Action" を含む名前なので、すでに `startTransition` の中で呼び出されていると分かるのです。

アクションプロップパターンについては、[コンポーネントから `action` を props として公開する](/reference/react/useTransition#exposing-action-props-from-components) を参照してください。

</DeepDive>

---

### アクションプロップに楽観的 state を追加する {/*adding-optimistic-state-to-action-props*/}

[アクションプロップ](/reference/react/useTransition#exposing-action-props-from-components)を作るときは、`useOptimistic` を追加することで即時フィードバックを表示できます。

以下は、`action` が実行中の間 "Submitting..." を表示するボタンです。

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import Button from './Button';
import { submitForm } from './actions.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button action={async () => {
        await submitForm();
        startTransition(() => {
          setCount(c => c + 1);
        });
      }}>Increment</Button>
      {count > 0 && <p>Submitted {count}!</p>}
    </div>
  );
}
```

```js src/Button.js active
import { useOptimistic, startTransition } from 'react';

export default function Button({ action, children }) {
  const [isPending, setIsPending] = useOptimistic(false);

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          setIsPending(true);
          await action();
        });
      }}
    >
      {isPending ? 'Submitting...' : children}
    </button>
  );
}
```

```js src/actions.js hidden
export async function submitForm() {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

ボタンをクリックすると、`setIsPending(true)` が楽観的 state を使って即座に "Submitting..." を表示し、ボタンを無効化します。アクションが終わると、`isPending` が自動的に `false` となってレンダーされます。

このパターンを使うことで、props である `action` を `Button` とどのように組み合わせた場合でも保留中状態が自動で表示されます。

```js
// Show pending state for a state update
<Button action={() => { setState(c => c + 1) }} />

// Show pending state for a navigation
<Button action={() => { navigate('/done') }} />

// Show pending state for a POST
<Button action={async () => { await fetch(/* ... */) }} />

// Show pending state for any combination
<Button action={async () => {
  setState(c => c + 1);
  await fetch(/* ... */);
  navigate('/done');
}} />
```

保留中状態は `action` 内のすべての処理が完了するまで表示されます。

<Note>

<<<<<<< HEAD
[`useTransition`](/reference/react/useTransition) を使って `isPending` 経由で保留中状態を取得することもできます。
=======
You can also use [`useTransition`](/reference/react/useTransition) to get pending state via `isPending`.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

違いは、`useTransition` が `startTransition` 関数を提供する一方で、`useOptimistic` は任意のトランジションで動作することです。コンポーネントの要件に合う方を使ってください。

</Note>

---

### props や state を楽観的に更新する {/*updating-props-or-state-optimistically*/}

props や state を `useOptimistic` でラップすることで、アクション実行中に即座に更新されるようにできます。

以下の例では、`LikeButton` は `isLiked` を prop として受け取り、クリック時にそれを即座に切り替えます。

<Sandpack>

```js src/App.js
import { useState, useOptimistic, startTransition } from 'react';
import { toggleLike } from './actions.js';

export default function App() {
  const [isLiked, setIsLiked] = useState(false);
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked);

  function handleClick() {
    startTransition(async () => {
      const newValue = !optimisticIsLiked
      console.log('⏳ setting optimistic state: ' + newValue);

      setOptimisticIsLiked(newValue);
      const updatedValue = await toggleLike(newValue);

      startTransition(() => {
        console.log('⏳ setting real state: ' + updatedValue );
        setIsLiked(updatedValue);
      });
    });
  }

  if (optimisticIsLiked !== isLiked) {
    console.log('✅ rendering optimistic state: ' + optimisticIsLiked);
  } else {
    console.log('✅ rendering real value: ' + optimisticIsLiked);
  }


  return (
    <button onClick={handleClick}>
      {optimisticIsLiked ? '❤️ Unlike' : '🤍 Like'}
    </button>
  );
}
```

```js src/actions.js hidden
export async function toggleLike(value) {
  return await new Promise((res) => setTimeout(() => res(value), 1000));
  // In a real app, this would update the server
}
```

```js src/index.js hidden
import React from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
// Not using StrictMode so double render logs are not shown.
root.render(<App />);
```

</Sandpack>

ボタンがクリックされると、`setOptimisticIsLiked` が表示中の state を即座に更新し、ハートを「いいね済み」として表示します。その間、`await toggleLike` がバックグラウンドで実行されます。`await` が完了すると、親の `setIsLiked` が「本物」の state である `isLiked` を更新し、楽観的 state はこの新しい値に一致する形でレンダーされます。

<Note>

この例では、次の値を計算するために `optimisticIsLiked` を読み取っています。これはベースの state が変化しない場合は機能しますが、アクションの実行中にベース state が変わる可能性がある場合は、state 更新用関数またはリデューサを使うほうがよいことがあります。

例は[現在の state に基づいて state を更新する](#updating-state-based-on-current-state)を参照してください。

</Note>

---

### 複数の値をまとめて更新する {/*updating-multiple-values-together*/}

<<<<<<< HEAD
楽観的更新が複数の関連する値に影響する場合は、リデューサを使ってまとめて更新してください。これにより UI の一貫性を保つことができます。
=======
When an optimistic update affects multiple related values, use a reducer to update them together. This ensures the UI stays consistent.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

以下のフォローボタンでは、フォロー状態とフォロワー数を両方同時に更新します。

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { followUser, unfollowUser } from './actions.js';
import FollowButton from './FollowButton';

export default function App() {
  const [user, setUser] = useState({
    name: 'React',
    isFollowing: false,
    followerCount: 10500
  });

  async function followAction(shouldFollow) {
    if (shouldFollow) {
      await followUser(user.name);
    } else {
      await unfollowUser(user.name);
    }
    startTransition(() => {
      setUser(current => ({
        ...current,
        isFollowing: shouldFollow,
        followerCount: current.followerCount + (shouldFollow ? 1 : -1)
      }));
    });
  }

  return <FollowButton user={user} followAction={followAction} />;
}
```

```js src/FollowButton.js active
import { useOptimistic, startTransition } from 'react';

export default function FollowButton({ user, followAction }) {
  const [optimisticState, updateOptimistic] = useOptimistic(
    { isFollowing: user.isFollowing, followerCount: user.followerCount },
    (current, isFollowing) => ({
      isFollowing,
      followerCount: current.followerCount + (isFollowing ? 1 : -1)
    })
  );

  function handleClick() {
    const newFollowState = !optimisticState.isFollowing;
    startTransition(async () => {
      updateOptimistic(newFollowState);
      await followAction(newFollowState);
    });
  }

  return (
    <div>
      <p><strong>{user.name}</strong></p>
      <p>{optimisticState.followerCount} followers</p>
      <button onClick={handleClick}>
        {optimisticState.isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

```js src/actions.js hidden
export async function followUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}

export async function unfollowUser(name) {
  await new Promise((res) => setTimeout(res, 1000));
}
```

</Sandpack>

リデューサは新しい `isFollowing` の値を受け取り、単一の更新で新しいフォロー状態と新しいフォロワー数の両方を計算します。これにより、ボタンテキストとフォロー数カウントが常に同期した状態を保てます。


<DeepDive>

#### 更新用関数とリデューサの使い分け {/*choosing-between-updaters-and-reducers*/}

`useOptimistic` では、現在の state に基づいて state を計算するための 2 つのパターンがサポートされています。

**更新用関数**は [useState の更新用関数](/reference/react/useState#updating-state-based-on-the-previous-state) と同様に動作します。セッタ関数に関数を渡してください。

```js
const [optimistic, setOptimistic] = useOptimistic(value);
setOptimistic(current => !current);
```

**リデューサ**を使う場合、更新ロジックをセッタ呼び出しから分離できます。

```js
const [optimistic, dispatch] = useOptimistic(value, (current, action) => {
  // Calculate next state based on current and action
});
dispatch(action);
```

**更新用関数を使う**のは、セッタ呼び出し内だけで自然に更新内容を表現できる計算の場合です。これは `useState` で `setState(prev => ...)` を使うのに似ています。

**リデューサを使う**のは、更新時にデータ（どの項目を追加するかなど）を渡す必要がある場合や、単一のフックで複数種類の更新を扱う場合です。

**なぜリデューサを使うのでしょうか？**

トランザクションの実行中にベースの state が変わる可能性がある場合、リデューサは不可欠です。add 処理の実行中に（たとえば別ユーザが todo を追加するなどで）`todos` が変化した場合、React は新しい `todos` でリデューサを再実行し、表示内容を再計算します。これにより、古くなったコピーではなく最新のリストに対して新しい todo を追加できるようになります。

`setOptimistic(prev => [...prev, newItem])` のような更新用関数では、トランザクション開始時点の state しか見えないため、非同期処理中に発生した更新を取りこぼします。

</DeepDive>

---

### 楽観的更新でリストに追加 {/*optimistically-adding-to-a-list*/}

リストに項目を楽観的に追加したい場合、`reducer` を使用してください。

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addTodo } from './actions.js';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React' }
  ]);

  async function addTodoAction(newTodo) {
    const savedTodo = await addTodo(newTodo);
    startTransition(() => {
      setTodos(todos => [...todos, savedTodo]);
    });
  }

  return <TodoList todos={todos} addTodoAction={addTodoAction} />;
}
```

```js src/TodoList.js active
import { useOptimistic, startTransition } from 'react';

export default function TodoList({ todos, addTodoAction }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo) => [
      ...currentTodos,
      { id: newTodo.id, text: newTodo.text, pending: true }
    ]
  );

  function handleAddTodo(text) {
    const newTodo = { id: crypto.randomUUID(), text: text };
    startTransition(async () => {
      addOptimisticTodo(newTodo);
      await addTodoAction(newTodo);
    });
  }

  return (
    <div>
      <button onClick={() => handleAddTodo('New todo')}>Add Todo</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>
            {todo.text} {todo.pending && "(Adding...)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addTodo(todo) {
  await new Promise((res) => setTimeout(res, 1000));
  // In a real app, this would save to the server
  return { ...todo, pending: false };
}
```

</Sandpack>

`reducer` は現在の todo のリストと、追加対象の新しい todo を受け取ります。これが重要なのは、add 処理の実行中に（たとえば別ユーザが todo を追加するなどで）`todos` が変化した場合、React は更新後のリストでリデューサを再実行して楽観的 state を更新するからです。これにより、古くなったコピーではなく最新のリストに対して新しい todo を追加できるようになります。

<Note>

楽観的更新用のリストの各要素には `pending: true` フラグが含まれているため、要素ごとにローディング状態を表示できます。サーバが応答し、親が保存した要素を含んだ正規の `todos` リストで更新すると、楽観的 state は pending フラグのない確定済み項目に更新されます。

</Note>

---

### 複数 `action` タイプの処理 {/*handling-multiple-action-types*/}

<<<<<<< HEAD
処理すべき楽観的更新が複数ある（項目の追加と削除など）場合は、`action` オブジェクトを用いるリデューサパターンを使用してください。
=======
When you need to handle multiple types of optimistic updates (like adding and removing items), use a reducer pattern with `action` objects.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

以下のショッピングカートの例は、単一のリデューサで追加と削除の両方を扱う方法を示しています。

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { addToCart, removeFromCart, updateQuantity } from './actions.js';
import ShoppingCart from './ShoppingCart';

export default function App() {
  const [cart, setCart] = useState([]);

  const cartActions = {
    async add(item) {
      await addToCart(item);
      startTransition(() => {
        setCart(current => {
          const exists = current.find(i => i.id === item.id);
          if (exists) {
            return current.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...current, { ...item, quantity: 1 }];
        });
      });
    },
    async remove(id) {
      await removeFromCart(id);
      startTransition(() => {
        setCart(current => current.filter(item => item.id !== id));
      });
    },
    async updateQuantity(id, quantity) {
      await updateQuantity(id, quantity);
      startTransition(() => {
        setCart(current =>
          current.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      });
    }
  };

  return <ShoppingCart cart={cart} cartActions={cartActions} />;
}
```

```js src/ShoppingCart.js active
import { useOptimistic, startTransition } from 'react';

export default function ShoppingCart({ cart, cartActions }) {
  const [optimisticCart, dispatch] = useOptimistic(
    cart,
    (currentCart, action) => {
      switch (action.type) {
        case 'add':
          const exists = currentCart.find(item => item.id === action.item.id);
          if (exists) {
            return currentCart.map(item =>
              item.id === action.item.id
                ? { ...item, quantity: item.quantity + 1, pending: true }
                : item
            );
          }
          return [...currentCart, { ...action.item, quantity: 1, pending: true }];
        case 'remove':
          return currentCart.filter(item => item.id !== action.id);
        case 'update_quantity':
          return currentCart.map(item =>
            item.id === action.id
              ? { ...item, quantity: action.quantity, pending: true }
              : item
          );
        default:
          return currentCart;
      }
    }
  );

  function handleAdd(item) {
    startTransition(async () => {
      dispatch({ type: 'add', item });
      await cartActions.add(item);
    });
  }

  function handleRemove(id) {
    startTransition(async () => {
      dispatch({ type: 'remove', id });
      await cartActions.remove(id);
    });
  }

  function handleUpdateQuantity(id, quantity) {
    startTransition(async () => {
      dispatch({ type: 'update_quantity', id, quantity });
      await cartActions.updateQuantity(id, quantity);
    });
  }

  const total = optimisticCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => handleAdd({
          id: 1, name: 'T-Shirt', price: 25
        })}>
          Add T-Shirt ($25)
        </button>{' '}
        <button onClick={() => handleAdd({
          id: 2, name: 'Mug', price: 15
        })}>
          Add Mug ($15)
        </button>
      </div>
      {optimisticCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {optimisticCart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price} ×
              {item.quantity}
              {' '}= ${item.price * item.quantity}
              <button
                onClick={() => handleRemove(item.id)}
                style={{ marginLeft: 8 }}
              >
                Remove
              </button>
              {item.pending && ' ...'}
            </li>
          ))}
        </ul>
      )}
      <p><strong>Total: ${total}</strong></p>
    </div>
  );
}
```

```js src/actions.js hidden
export async function addToCart(item) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function removeFromCart(id) {
  await new Promise((res) => setTimeout(res, 800));
}

export async function updateQuantity(id, quantity) {
  await new Promise((res) => setTimeout(res, 800));
}
```

</Sandpack>

リデューサは 3 種類の `action` タイプ (`add`, `remove`, `update_quantity`) を処理し、それぞれについて新しい楽観的 state を返します。各 `action` は `pending: true` フラグを設定するため、[サーバ関数](/reference/rsc/server-functions)の実行中に視覚的なフィードバックを表示できます。

---

### エラーリカバリを伴う楽観的削除 {/*optimistic-delete-with-error-recovery*/}

項目を楽観的に削除する場合、アクションが失敗するケースを扱う必要があります。

以下の例では、削除に失敗したときにエラーメッセージを表示し、UI が自動でロールバックして項目が再表示される様子を示しています。

<Sandpack>

```js src/App.js
import { useState, startTransition } from 'react';
import { deleteItem } from './actions.js';
import ItemList from './ItemList';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, name: 'Learn React' },
    { id: 2, name: 'Build an app' },
    { id: 3, name: 'Deploy to production' },
  ]);

  async function deleteAction(id) {
    await deleteItem(id);
    startTransition(() => {
      setItems(current => current.filter(item => item.id !== id));
    });
  }

  return <ItemList items={items} deleteAction={deleteAction} />;
}
```

```js src/ItemList.js active
import { useState, useOptimistic, startTransition } from 'react';

export default function ItemList({ items, deleteAction }) {
  const [error, setError] = useState(null);
  const [optimisticItems, removeItem] = useOptimistic(
    items,
    (currentItems, idToRemove) =>
      currentItems.map(item =>
        item.id === idToRemove
          ? { ...item, deleting: true }
          : item
      )
  );

  function handleDelete(id) {
    setError(null);
    startTransition(async () => {
      removeItem(id);
      try {
        await deleteAction(id);
      } catch (e) {
        setError(e.message);
      }
    });
  }

  return (
    <div>
      <h2>Your Items</h2>
      <ul>
        {optimisticItems.map(item => (
          <li
            key={item.id}
            style={{
              opacity: item.deleting ? 0.5 : 1,
              textDecoration: item.deleting ? 'line-through' : 'none',
              transition: 'opacity 0.2s'
            }}
          >
            {item.name}
            <button
              onClick={() => handleDelete(item.id)}
              disabled={item.deleting}
              style={{ marginLeft: 8 }}
            >
              {item.deleting ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      {error && (
        <p style={{ color: 'red', padding: 8, background: '#fee' }}>
          {error}
        </p>
      )}
    </div>
  );
}
```

```js src/actions.js hidden
export async function deleteItem(id) {
  await new Promise((res) => setTimeout(res, 1000));
  // Item 3 always fails to demonstrate error recovery
  if (id === 3) {
    throw new Error('Cannot delete. Permission denied.');
  }
}
```

</Sandpack>

<<<<<<< HEAD
'Deploy to production' を削除してみてください。削除が失敗すると、該当項目が自動的にリスト内に再表示されます。
=======
Try deleting 'Deploy to production'. When the delete fails, the item automatically reappears in the list.
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

---

## トラブルシューティング {/*troubleshooting*/}

### "An optimistic state update occurred outside a Transition or Action" というエラーが出る {/*an-optimistic-state-update-occurred-outside-a-transition-or-action*/}

次のエラーが表示される場合があります：

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

An optimistic state update occurred outside a Transition or Action. To fix, move the update to an Action, or wrap with `startTransition`.

</ConsoleLogLine>

</ConsoleBlockMulti>

<<<<<<< HEAD
楽観的セッタ関数は `startTransition` の中で呼び出す必要があります。
=======
The optimistic setter function must be called inside `startTransition`:
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

```js
// 🚩 Incorrect: outside a Transition
function handleClick() {
  setOptimistic(newValue);  // Warning!
  // ...
}

// ✅ Correct: inside a Transition
function handleClick() {
  startTransition(async () => {
    setOptimistic(newValue);
    // ...
  });
}

// ✅ Also correct: inside an Action prop
function submitAction(formData) {
  setOptimistic(newValue);
  // ...
}
```

セッタをアクション外で呼び出すと、楽観的 state が一瞬表示されたあと、すぐに元の値へ戻ります。これは、アクションの実行中に楽観的 state を「保持」するためのトランザクションが存在しないためです。

### "Cannot update optimistic state while rendering" というエラーが出る {/*cannot-update-optimistic-state-while-rendering*/}

以下のエラーが表示される場合があります。

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Cannot update optimistic state while rendering.

</ConsoleLogLine>

</ConsoleBlockMulti>

このエラーは、コンポーネントのレンダーフェーズ中に楽観的セッタを呼び出したときに発生します。呼び出せるのはイベントハンドラ、エフェクト、またはその他のコールバックの中だけです。

```js
// 🚩 Incorrect: calling during render
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  // This runs during render - not allowed!
  setPending(true);

  // ...
}

// ✅ Correct: calling inside startTransition
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function handleClick() {
    startTransition(() => {
      setPending(true);
      // ...
    });
  }

  // ...
}

// ✅ Also correct: calling from an Action
function MyComponent({ items }) {
  const [isPending, setPending] = useOptimistic(false);

  function action() {
    setPending(true);
    // ...
  }

  // ...
}
```

### 楽観的更新で古い値が表示される {/*my-optimistic-updates-show-stale-values*/}

楽観的 state が古いデータに基づいているように見える場合は、現在の state を基準に楽観的 state を計算するため、更新用関数またはリデューサの使用を検討してください。

```js
// May show stale data if state changes during Action
const [optimistic, setOptimistic] = useOptimistic(count);
setOptimistic(5);  // Always sets to 5, even if count changed

// Better: relative updates handle state changes correctly
const [optimistic, adjust] = useOptimistic(count, (current, delta) => current + delta);
adjust(1);  // Always adds 1 to whatever the current count is
```

詳しくは[現在の state に基づいて state を更新する](#updating-state-based-on-current-state)を参照してください。

### 楽観的更新が実行中かどうか分からない {/*i-dont-know-if-my-optimistic-update-is-pending*/}

`useOptimistic` が実行中 (pending) 状態かどうかを知る方法は 3 つあります。

1. **`optimisticValue === value` を確認する**

```js
const [optimistic, setOptimistic] = useOptimistic(value);
const isPending = optimistic !== value;
```

値が等しくない場合、進行中のトランザクションがあるということです。

2. **`useTransition` を追加する**

```js
const [isPending, startTransition] = useTransition();
const [optimistic, setOptimistic] = useOptimistic(value);

//...
startTransition(() => {
  setOptimistic(state);
})
```

`useTransition` は内部的に `useOptimistic` を使用して `isPending` を取得しています。つまりこれは 1 の方法と等価です。

3. **リデューサ内で `pending` フラグを追加する**

```js
const [optimistic, addOptimistic] = useOptimistic(
  items,
  (state, newItem) => [...state, { ...newItem, isPending: true }]
);
```

それぞれの楽観的要素が独自のフラグを持つため、要素ごとにローディング状態を表示できます。
