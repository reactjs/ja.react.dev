---
title: useMemo
---

<Intro>

`useMemo` は、レンダー間で計算結果をキャッシュするための React フックです。

```js
const cachedValue = useMemo(calculateValue, dependencies)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useMemo(calculateValue, dependencies)` {/*usememo*/}

コンポーネントのトップレベルで `useMemo` を呼び出して、レンダー間で計算をキャッシュします。

```js
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `calculateValue`: キャッシュしたい値を計算する関数。純関数で、引数を取らず、任意の型の何らかの値を返す必要があります。React は初回レンダー中にこの関数を呼び出します。次回以降のレンダーでは、直前のレンダーと `dependencies` が変化していなければ、同じ値を再度返します。`dependencies` が変化していれば、`calculateValue` を呼び出してその結果を返し、同時に、後から再利用するためにその結果を保存します。

* `dependencies`: `calculateValue` のコード内で参照されているすべてのリアクティブ値の配列。リアクティブ値には、props、state、およびコンポーネント本体で直接宣言されているすべての変数と関数が含まれます。リンタが [React 向けに設定されている](/learn/editor-setup#linting)場合は、すべてのリアクティブ値が正しく依存値として指定されているかを確認します。依存配列は、`[dep1, dep2, dep3]` のようにインラインで記述され、配列の長さは一定である必要があります。各依存値は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を用いて、前回の値と比較されます。

#### 返り値 {/*returns*/}

初回のレンダーでは、引数なしで `calculateValue` を呼び出した結果が、`useMemo` の返り値となります。

次回以降のレンダーでは、依存配列が変化していない場合は、以前のレンダーで保存された値を返します。変化している場合は、`calculateValue` を再度呼び出し、その結果をそのまま返します。

#### 注意点 {/*caveats*/}

* `useMemo` はフックなので、カスタムフックか**コンポーネントのトップレベル**でしか呼び出すことができません。ループや条件分岐の中で呼び出すことはできません。もしループや条件分岐の中で呼び出したい場合は、新しいコンポーネントに切り出して、その中に state を移動させてください。
* Strict Mode では、[純粋でない関数を見つけやすくするために](#my-calculation-runs-twice-on-every-re-render)、**計算関数 (`calculateValue`) が 2 度呼び出されます**。これは、開発時のみの挙動で、本番では影響は与えません。もし、計算関数が純粋であれば（純粋であるべきです）、2 回呼び出されてもコードに影響はありません。2 回の呼び出しのうち、一方の呼び出し結果は無視されます。
* **特別な理由がない限り、キャッシュされた値が破棄されることはありません**。キャッシュが破棄されるケースの例としては、開発時にコンポーネントのファイルを編集した場合があります。また、開発時および本番時に、初回マウント中にコンポーネントがサスペンドすると、キャッシュは破棄されます。将来的には、キャッシュが破棄されることを前提とした機能が React に追加される可能性があります。例えば、将来的に仮想リストが組み込みでサポートされた場合、仮想テーブルのビューポートからスクロールアウトした項目は、キャッシュを破棄するようになるかもしれません。このような挙動は、パフォーマンス最適化のみを目的として `useMemo` を使っている場合には問題ありません。しかし、他の目的で利用している場合は、[state 変数](/reference/react/useState#avoiding-recreating-the-initial-state) や [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) を利用した方が良いかもしれません。

<Note>

このような返り値のキャッシュは、[*メモ化 (memoization)*](https://en.wikipedia.org/wiki/Memoization) として知られており、それがこのフックが `useMemo` という名前である理由です。

</Note>

---

## 使用法 {/*usage*/}

### 高コストな再計算を避ける {/*skipping-expensive-recalculations*/}

複数レンダーを跨いで計算をキャッシュするには、コンポーネントのトップレベルで `useMemo` を呼び出し、計算をラップします。

```js [[3, 4, "visibleTodos"], [1, 4, "() => filterTodos(todos, tab)"], [2, 4, "[todos, tab]"]]
import { useMemo } from 'react';

function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

`useMemo` には、2 つの引数を渡す必要があります。

1. `() =>` のように、引数を取らず、求めたい計算結果を返す<CodeStep step={1}>計算関数</CodeStep>。
2. コンポーネント内にある値のうち、計算関数内で使用されているすべての値を含む、<CodeStep step={2}>依存配列</CodeStep>。

初回レンダーでは、`useMemo` から返される<CodeStep step={3}>値</CodeStep>は、<CodeStep step={1}>計算関数</CodeStep>を呼び出した結果になります。

次回以降のレンダーでは、今回のレンダー時に渡した<CodeStep step={2}>依存配列</CodeStep>と、前回のレンダー時に渡した依存配列が比較されます。（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で比較します。）依存値のいずれも変化していない場合、`useMemo` は以前に計算した値を返します。変化している場合は、再度計算が実行され、新しい値が返されます。

つまり `useMemo` は、依存配列が変化しない限り、複数のレンダーを跨いで計算結果をキャッシュします。

**これが役に立つ場面を見てみましょう。**

React では通常、再レンダーが発生するたびに、コンポーネント関数全体が再実行されます。例えば、以下の `TodoList` で、state が更新されたり、親から新しい props を受け取ったりした場合、`filterTodos` 関数が再実行されます。

```js {2}
function TodoList({ todos, tab, theme }) {
  const visibleTodos = filterTodos(todos, tab);
  // ...
}
```

ほとんどの計算は非常に高速に処理されるため、何か問題になることは通常ありません。しかし、巨大な配列をフィルタリング・変換している場合や、高コストな計算を行っている場合には、データが変わっていなければこれらの計算をスキップしたくなるでしょう。`todos` と `tab` の値が前回のレンダー時と同じ場合、先ほどのように計算を `useMemo` でラップすることで、以前に計算した `visibleTodos` を再利用することができるのです。

このようなキャッシュのことを、[*メモ化*](https://en.wikipedia.org/wiki/Memoization)と呼びます。

<Note>

**`useMemo` はパフォーマンス最適化のためにのみ利用するべきです**。`useMemo` を外すとコードが動作しない場合、その根本的な問題を見つけて修正してください。その上で、パフォーマンスを向上させるために `useMemo` を追加してください。

</Note>

<DeepDive>

#### 計算コストが高いかどうかを見分ける方法 {/*how-to-tell-if-a-calculation-is-expensive*/}

一般的に、何千ものオブジェクトを作成したりループしたりしていない限り、おそらく高価ではありません。より確信を持ちたい場合は、コンソールログを追加して、コードの実行にかかった時間を計測することができます。

```js {1,3}
console.time('filter array');
const visibleTodos = filterTodos(todos, tab);
console.timeEnd('filter array');
```

測定したいユーザ操作（例えば、入力フィールドへのタイプ）を実行します。その後、コンソールに `filter array: 0.15ms` のようなログが表示されます。全体のログ時間がかなりの量（例えば `1ms` 以上）になる場合、その計算をメモ化する意味があるかもしれません。実験として `useMemo` で計算をラップしてみて、その操作に対する合計時間が減少したかどうかをログで確認できます。

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return filterTodos(todos, tab); // Skipped if todos and tab haven't changed
}, [todos, tab]);
console.timeEnd('filter array');
```

`useMemo` は*初回*レンダーを高速化しません。更新時に不要な作業をスキップするときにのみ役立ちます。

また、ほとんどの場合に、あなたが使っているマシンは、ユーザのマシンより高速に動作するであろうことを忘れてはいけません。そのため、意図的に処理速度を低下させてパフォーマンスをテストするのが良いでしょう。例えば、Chrome では [CPU スロットリング](https://developer.chrome.com/blog/new-in-devtools-61/#throttling)オプションが提供されています。

また、開発環境でのパフォーマンス測定では完全に正確な結果は得られないことに注意してください。（例えば、[Strict Mode](/reference/react/StrictMode) がオンの場合、各コンポーネントが 1 度ではなく 2 度レンダーされることがあります。）最も正確にパフォーマンスを計測するためには、アプリを本番環境用にビルドし、ユーザが持っているようなデバイスでテストしてください。

</DeepDive>

<DeepDive>

#### あらゆる場所に useMemo を追加すべきか？ {/*should-you-add-usememo-everywhere*/}

あなたのアプリがこのサイトのように、ほとんどのインタラクションが大まかなもの（ページ全体やセクション全体の置き換えなど）である場合、メモ化は通常不要です。一方、あなたのアプリが描画エディタのようなもので、ほとんどのインタラクションが細かなもの（図形を移動させるなど）である場合、メモ化は非常に役に立つでしょう。

`useMemo` を利用した最適化が力を発揮するのは、以下のような、ほんの一部のケースに限られます。

- `useMemo` で行う計算が著しく遅く、かつ、その依存値がほとんど変化しない場合。
- 計算した値を、[`memo`](/reference/react/memo) でラップされたコンポーネントの props に渡す場合。この場合は、値が変化していない場合には再レンダーをスキップしたいでしょう。メモ化することで、依存値が異なる場合にのみコンポーネントを再レンダーさせることができます。
- その値が、後で何らかのフックの依存値として使用されるケース。例えば、別の `useMemo` の計算結果がその値に依存している場合や、[`useEffect`](/reference/react/useEffect) がその値に依存している場合などです。

これらのケース以外では、計算を `useMemo` でラップすることにメリットはありません。それを行っても重大な害はないため、個別のケースを考えずに、可能な限りすべてをメモ化するようにしているチームもあります。このアプローチのデメリットは、コードが読みにくくなるという点です。また、すべてのメモ化が有効であるわけではありません。例えば、毎回変化する値が 1 つ存在するだけで、コンポーネント全体のメモ化が無意味になってしまうこともあります。

**実際には、以下のいくつかの原則に従うことで、多くのメモ化を不要にすることができます**。

1. コンポーネントが他のコンポーネントを視覚的にラップするときは、それが[子として JSX を受け入れるようにします](/learn/passing-props-to-a-component#passing-jsx-as-children)。これにより、ラッパコンポーネントが自身の state を更新しても、React はその子を再レンダーする必要がないことを認識します。
1. ローカル state を優先し、必要以上に [state のリフトアップ](/learn/sharing-state-between-components)を行わないようにします。フォームや、アイテムがホバーされているかどうか、といった頻繁に変化する state は、ツリーのトップやグローバルの状態ライブラリに保持しないでください。
1. [レンダーロジックを純粋に](/learn/keeping-components-pure)保ちます。コンポーネントの再レンダーが問題を引き起こしたり、何らかの目に見える視覚的な結果を生じたりする場合、それはあなたのコンポーネントのバグです！ メモ化を追加するのではなく、バグを修正します。
1. [state を更新する不要なエフェクトを避けてください](/learn/you-might-not-need-an-effect)。React アプリケーションのパフォーマンス問題の大部分は、エフェクト内での連鎖的な state 更新によってコンポーネントのレンダーが何度も引き起こされるために生じます。
1. [エフェクトから不要な依存値をできるだけ削除します](/learn/removing-effect-dependencies)。例えば、メモ化する代わりに、オブジェクトや関数をエフェクトの中や外に移動させるだけで、簡単に解決できる場合があります。

それでも特定のインタラクションが遅いと感じる場合は、[React Developer Tools のプロファイラを使用して](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)、どのコンポーネントでのメモ化が最も有効かを確認し、そこでメモ化を行いましょう。これらの原則を守ることで、コンポーネントのデバッグや理解が容易になるため、常に原則に従うことをおすすめします。長期的には、この問題を一挙に解決できる[自動的なメモ化](https://www.youtube.com/watch?v=lGEMwh32soc)について研究を行っています。

</DeepDive>

<Recipes titleText="useMemo と値を直接計算することの違い" titleId="examples-recalculation">

#### `useMemo` を利用して再計算をスキップする {/*skipping-recalculation-with-usememo*/}

この例では `filterTodos` の実装には**人為的な遅延が入っています**。そのため、レンダー中に呼び出す JavaScript の関数の処理が著しく遅い場合に、どうなるかを確認できます。タブを切り替えたり、テーマを切り替えてみてください。

タブの切り替えが遅く感じられるのは、切り替えによって、遅延が入っている `filterTodos` 関数を再実行させてしまっているからです。この挙動は考えてみれば当たり前で、`tab` が変化したのなら、計算全体を再実行する*必要があるはずです*。（なぜ 2 回実行されるのか気になる場合は、[こちら](#my-calculation-runs-twice-on-every-re-render)を参照してください）

次に、テーマを切り替えてみましょう。**`useMemo` があるおかげで、人為的な遅延が入っているにも関わらず、高速に動作しています！** `todos` と `tab`（`useMemo` の依存配列として渡している）が、前回のレンダー時から変化していないため、遅延が入っている `filterTodos` の呼び出しがスキップされています。

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { useMemo } from 'react';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 常に値を再計算する {/*always-recalculating-a-value*/}

この例でも、`filterTodos` の実装には**人為的な遅延が入っています**。そのため、レンダー中に呼び出す JavaScript の関数の処理が著しく遅い場合に、どうなるかを確認できます。タブを切り替えたり、テーマを切り替えてみてください。

先ほどの例とは異なり、今回はテーマを切り替えたときも遅くなっています！ **今回のコードでは `useMemo` が利用されていない**ためです。そのため、人為的な遅延が入っている `filterTodos` が、再レンダーのたびに呼び出されてしまいます。`theme` だけが変化した場合でも、`filterTodos` が呼び出されてしまいます。

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        <p><b>Note: <code>filterTodos</code> is artificially slowed down!</b></p>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('[ARTIFICIALLY SLOW] Filtering ' + todos.length + ' todos for "' + tab + '" tab.');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

一方、こちらは**意図的な遅延を取り除いた同じコード**です。`useMemo` が無いことで、動作に影響があるでしょうか？

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}

```

```js TodoList.js active
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ?
              <s>{todo.text}</s> :
              todo.text
            }
          </li>
        ))}
      </ul>
    </div>
  );
}
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  console.log('Filtering ' + todos.length + ' todos for "' + tab + '" tab.');

  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

大抵の場合、メモ化を行わなくともコードは問題なく動作します。ユーザの操作感が十分に高速であれば、メモ化は不要でしょう。

`utils.js` で TODO アイテムの数を増やし、どのように挙動が変化するかを確認してみましょう。この計算自体は、最初はそれほどコストは高くないものの、TODO の数が増大すると、フィルタリングではなく再レンダーがオーバーヘッドの大半を占めるようになります。続く内容では、`useMemo` を使って、どのように再レンダーを最適化できるかを確認していきます。

<Solution />

</Recipes>

---

### コンポーネントの再レンダーをスキップする {/*skipping-re-rendering-of-components*/}

`useMemo` は、子コンポーネントの再レンダーのパフォーマンスを最適化する際にも役に立つことがあります。これを説明するために、`TodoList` コンポーネントが、子コンポーネントの `List` の props として、`visibleTodos` を渡すことを考えます。

```js {5}
export default function TodoList({ todos, tab, theme }) {
  // ...
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

props である `theme` を変化させると一瞬アプリがフリーズしますが、`<List />` を JSX から削除すると、高速に動作するようになったはずです。すなわち、この `List` コンポーネントには最適化する価値があるということです。

**通常、あるコンポーネントが再レンダーされたときは、その子コンポーネントも再帰的にすべて再レンダーされます**。これが、`TodoList` が異なる `theme` の値で再レンダーされたとき、`List` コンポーネントも*一緒に*再レンダーされる理由です。この動作は、再レンダーにそれほど多くの計算コストを必要としないコンポーネントには適しています。しかし、もし再レンダーが遅いと分かった場合は、`List` コンポーネントを [`memo`](/reference/react/memo) で囲うことで、与えられた props が前回のレンダーと同じである場合に `List` の再レンダーをスキップすることができます。

```js {3,5}
import { memo } from 'react';

const List = memo(function List({ items }) {
  // ...
});
```

**この変更によって、props の全項目が前回のレンダーと*等しい*場合には、`List` の再レンダーはスキップされるようになります**。これが、計算のキャッシュが重要になる理由です！ `useMemo` を使わずに `visibleTodos` の計算を行うことを想像してみてください。

```js {2-3,6-7}
export default function TodoList({ todos, tab, theme }) {
  // Every time the theme changes, this will be a different array...
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      {/* ... so List's props will never be the same, and it will re-render every time */}
      <List items={visibleTodos} />
    </div>
  );
}
```

**上記の例では、`filterTodos` 関数が毎回*異なる*配列を生成します。**（これは、`{}` というオブジェクトリテラルが、毎回新しいオブジェクトを生成することと似ています。）通常これが問題になることはありませんが、今回の場合は、`List` の props が毎回別の値になってしまいます。そのため、`memo` による最適化が意味をなさなくなってしまうのです。ここで、`useMemo` が役に立ちます。

```js {2-3,5,9-10}
export default function TodoList({ todos, tab, theme }) {
  // Tell React to cache your calculation between re-renders...
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab] // ...so as long as these dependencies don't change...
  );
  return (
    <div className={theme}>
      {/* ...List will receive the same props and can skip re-rendering */}
      <List items={visibleTodos} />
    </div>
  );
}
```


**`visibleTodos` の計算を `useMemo` でラップすることで、複数の再レンダーの間でその結果が同じになることを保証できます**（依存配列が変わらない限り）。通常、特別な理由がなければ、計算を `useMemo` でラップする*必要はありません*。この例では、[`memo`](/reference/react/memo) で囲われたコンポーネントに値を渡しておりレンダーのスキップができるということが、その特別な理由にあたります。他にも `useMemo` を追加する動機はいくつかあり、このページで詳しく解説していきます。

<DeepDive>

#### 個々の JSX ノードをメモ化する {/*memoizing-individual-jsx-nodes*/}

`List` を [`memo`](/reference/react/memo) でラップする代わりに、`<List />` JSX ノード自体を `useMemo` でラップしても構いません。

```js {3,6}
export default function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  const children = useMemo(() => <List items={visibleTodos} />, [visibleTodos]);
  return (
    <div className={theme}>
      {children}
    </div>
  );
}
```

挙動は同じになります。`visibleTodos` が変化していない場合は、`List` は再レンダーされません。

`<List items={visibleTodos} />` のような JSX ノードは、`{ type: List, props: { items: visibleTodos } }` のようなオブジェクトと同じです。このオブジェクトを作成するコストは非常に小さいですが、React はその内容が前回の内容と同じかどうかは分かりません。そのため、React は、デフォルトで `List` コンポーネントを再レンダーするのです。

しかし、React が前回のレンダー時と全く同じ JSX を見つけた場合、コンポーネントの再レンダーは行いません。これは、JSX ノードが[イミュータブル (immutable)](https://en.wikipedia.org/wiki/Immutable_object) であるためです。JSX ノードオブジェクトは時間が経過しても変化することはないため、再レンダーをスキップしてしまって問題ありません。しかし、これが機能するには、ノードが*真に全く同一のオブジェクトである必要があり*、コード上で同じように見えるだけでは不十分です。この例では、`useMemo` のおかげで、ノードが全く同じオブジェクトとなっているのです。

`useMemo` を使って、JSX ノードを手動でラップするのは不便です。例えば、条件付きでラップすることはできません。そのため、通常は `useMemo` で JSX ノードをラップする代わりに、[`memo`](/reference/react/memo) でコンポーネントをでラップします。

</DeepDive>

<Recipes titleText="再レンダーをスキップする場合と毎回再レンダーを行う場合の違い" titleId="examples-rerendering">

#### `useMemo` と `memo` を利用して再レンダーをスキップする {/*skipping-re-rendering-with-usememo-and-memo*/}

この例では、`List` コンポーネントには**人為的な遅延が入っています**。そのため、レンダー中に呼び出している React コンポーネントが著しく遅い場合の挙動を確認できます。タブを変更したり、テーマを切り替えたりしてみてください。

タブの切り替えが遅く感じるのは、遅延が入っている `List` を再レンダーさせてしまっているからです。これは考えてみれば当然で、`tab` が変化したので、ユーザの新しい選択を画面に反映する必要があります。

次に、テーマを切り替えてみましょう。**`useMemo` と [`memo`](/reference/react/memo) があるおかげで、人為的な遅延があるにも関わらず、高速に動作しています！** `visibleItems` 配列が前回のレンダー時から変化していないため、`List` は再レンダーをスキップしています。`visibleItems` 配列が変化していないのは、`todos` と `tab`（`useMemo` の依存配列として渡している）が、前回のレンダー時から変化していないからです。

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import { useMemo } from 'react';
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 毎回コンポーネントを再レンダーする {/*always-re-rendering-a-component*/}

この例でも、`List` の実装には**人為的な遅延が入っています**。そのため、レンダー中に呼び出している React コンポーネントが著しく遅い場合の挙動を確認できます。タブを変更したり、テーマを切り替えたりしてみてください。

先ほどの例とは異なり、今回はテーマの切り替え時も遅くなっています！ **今回のコードでは `useMemo` が利用されていない**ためです。そのため、`visibleTodos` は常に異なる配列となり、遅延が入っている `List` コンポーネントが、再レンダーをスキップすることができません。

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <p><b>Note: <code>List</code> is artificially slowed down!</b></p>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

const List = memo(function List({ items }) {
  console.log('[ARTIFICIALLY SLOW] Rendering <List /> with ' + items.length + ' items');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
});

export default List;
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

一方、こちらは**意図的な遅延を取り除いた**コードです。`useMemo` が無いことで、動作に影響があるでしょうか？

<Sandpack>

```js App.js
import { useState } from 'react';
import { createTodos } from './utils.js';
import TodoList from './TodoList.js';

const todos = createTodos();

export default function App() {
  const [tab, setTab] = useState('all');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <button onClick={() => setTab('all')}>
        All
      </button>
      <button onClick={() => setTab('active')}>
        Active
      </button>
      <button onClick={() => setTab('completed')}>
        Completed
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <TodoList
        todos={todos}
        tab={tab}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js TodoList.js active
import List from './List.js';
import { filterTodos } from './utils.js'

export default function TodoList({ todos, theme, tab }) {
  const visibleTodos = filterTodos(todos, tab);
  return (
    <div className={theme}>
      <List items={visibleTodos} />
    </div>
  );
}
```

```js List.js
import { memo } from 'react';

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.completed ?
            <s>{item.text}</s> :
            item.text
          }
        </li>
      ))}
    </ul>
  );
}

export default memo(List);
```

```js utils.js
export function createTodos() {
  const todos = [];
  for (let i = 0; i < 50; i++) {
    todos.push({
      id: i,
      text: "Todo " + (i + 1),
      completed: Math.random() > 0.5
    });
  }
  return todos;
}

export function filterTodos(todos, tab) {
  return todos.filter(todo => {
    if (tab === 'all') {
      return true;
    } else if (tab === 'active') {
      return !todo.completed;
    } else if (tab === 'completed') {
      return todo.completed;
    }
  });
}
```

```css
label {
  display: block;
  margin-top: 10px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

大抵の場合、メモ化を行わなくともコードは問題なく動作します。ユーザの操作感が十分に高速であれば、メモ化は不要なのです。

アプリが遅くなっている実際の要因が何なのか現実的に把握するためには、React を本番モードで実行し、[React Developer Tools](/learn/react-developer-tools) を無効にし、アプリのユーザが使用しているデバイスに近いデバイスを使用してください。

<Solution />

</Recipes>

---

### 他のフックに渡す依存値をメモ化する {/*memoizing-a-dependency-of-another-hook*/}

ある計算が、コンポーネントの本体で直接作成されたオブジェクトに依存しているとしましょう。

```js {2}
function Dropdown({ allItems, text }) {
  const searchOptions = { matchMode: 'whole-word', text };

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // 🚩 Caution: Dependency on an object created in the component body
  // ...
```

このようなオブジェクトを依存値として使うとメモ化の意味がなくなってしまいます。コンポーネントが再レンダーされたとき、コンポーネントの本体に含まれるコードはすべて再実行されます。**`searchOptions` オブジェクトを作成するコードも、毎回再実行されます。**`searchOptions` は `useMemo` の依存値であり、毎回異なる値となるため、依存値が変化したと判断され、`searchItems` が毎回再計算されます。

これを修正するには、`searchOptions` オブジェクトを依存配列に渡す前に、`searchOptions` オブジェクト自体をメモ化しましょう。

```js {2-4}
function Dropdown({ allItems, text }) {
  const searchOptions = useMemo(() => {
    return { matchMode: 'whole-word', text };
  }, [text]); // ✅ Only changes when text changes

  const visibleItems = useMemo(() => {
    return searchItems(allItems, searchOptions);
  }, [allItems, searchOptions]); // ✅ Only changes when allItems or searchOptions changes
  // ...
```

上記の例では、`text` が変化しなければ、`searchOptions` オブジェクトも変化しません。しかし、さらに良い修正方法は、`searchOptions` オブジェクトの宣言を `useMemo` の計算関数の*中に*移動することです。

```js {3}
function Dropdown({ allItems, text }) {
  const visibleItems = useMemo(() => {
    const searchOptions = { matchMode: 'whole-word', text };
    return searchItems(allItems, searchOptions);
  }, [allItems, text]); // ✅ Only changes when allItems or text changes
  // ...
```

これで、計算が直接 `text` に依存するようになりました。（`text` は文字列なので「意図せず」変化してしまうことはありません。）

---

### 関数をメモ化する {/*memoizing-a-function*/}

`Form` コンポーネントが [`memo`](/reference/react/memo) でラップされているとします。関数を props として渡してみましょう。

```js {2-7}
export default function ProductPage({ productId, referrer }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }

  return <Form onSubmit={handleSubmit} />;
}
```

`{}` が異なるオブジェクトを生成するのと同様に、`function() {}` のような関数宣言や、`() => {}` のような関数式もまた、レンダーごとに*異なる*関数を生成します。新しい関数が生成されること自体は問題ではなく、避けるべきことでもありません。しかし、`Form` コンポーネントがメモ化されている状況では、`Form` の props に渡す値が変わっていない場合は `Form` の再レンダーをスキップしたいと考えるでしょう。毎回異なる値が props にあると、メモ化は無意味になってしまいます。

`useMemo` で関数をメモ化する場合は、計算関数がさらに別の関数を返す必要があります。

```js {2-3,8-9}
export default function Page({ productId, referrer }) {
  const handleSubmit = useMemo(() => {
    return (orderDetails) => {
      post('/product/' + productId + '/buy', {
        referrer,
        orderDetails
      });
    };
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

なんだか不恰好ですね！ **関数のメモ化はよくあることなので、それ専用の組み込みフックが提供されています**。余計な関数の入れ子を避けるには、**`useMemo` の代わりに [`useCallback`](/reference/react/useCallback) で関数をラップしましょう**。

```js {2,7}
export default function Page({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  }, [productId, referrer]);

  return <Form onSubmit={handleSubmit} />;
}
```

上記の 2 つの例は完全に等価です。`useCallback` のメリットは、余計な関数の入れ子が不要になることだけです。それ以外の違いは何もありません。[`useCallback` についての詳細は、こちらを参照してください。](/reference/react/useCallback)

---

## トラブルシューティング {/*troubleshooting*/}

### 再レンダーのたびに計算が 2 回実行される {/*my-calculation-runs-twice-on-every-re-render*/}

[Strict Mode](/reference/react/StrictMode) では、本来 1 回だけ関数が呼び出されるところで、2 回呼び出されることがあります。

```js {2,5,6}
function TodoList({ todos, tab }) {
  // This component function will run twice for every render.

  const visibleTodos = useMemo(() => {
    // This calculation will run twice if any of the dependencies change.
    return filterTodos(todos, tab);
  }, [todos, tab]);

  // ...
```

これは想定通りの挙動であり、これでコードが壊れることがあってはいけません。

これは開発時のみの挙動で、開発者が[コンポーネントを純粋に保つ](/learn/keeping-components-pure)ために役立ちます。呼び出し結果のうちの 1 つが採用され、もう 1 つは無視されます。あなたが実装したコンポーネントと計算関数が純粋であれば、この挙動がロジックに影響を与えることはありません。しかし、もし意図せず純粋ではない関数になっていた場合は、この挙動によって間違いに気づき、修正することができます。

たとえば、以下の計算関数は、props として受け取った配列の書き換え（ミューテーション）をしてしまっており、純粋ではありません。

```js {2-3}
  const visibleTodos = useMemo(() => {
    // 🚩 Mistake: mutating a prop
    todos.push({ id: 'last', text: 'Go for a walk!' });
    const filtered = filterTodos(todos, tab);
    return filtered;
  }, [todos, tab]);
```

しかし、この関数は 2 度呼び出されるため、todo が 2 回追加されたことに気づくはずです。計算関数は、既存のオブジェクトを変更してはいけませんが、計算中に作成した*新しい*オブジェクトを変更することは問題ありません。たとえば、`filterTodos` 関数が常に*異なる配列*を返す場合は、*その配列*を変更しても問題ありません。

```js {3,4}
  const visibleTodos = useMemo(() => {
    const filtered = filterTodos(todos, tab);
    // ✅ Correct: mutating an object you created during the calculation
    filtered.push({ id: 'last', text: 'Go for a walk!' });
    return filtered;
  }, [todos, tab]);
```

純関数について詳しく知るには、[コンポーネントを純粋に保つ](/learn/keeping-components-pure)を参照してください。

また、ミューテーションなしでオブジェクトを更新する方法については[オブジェクトの更新](/learn/updating-objects-in-state)を、ミューテーションなしで配列を更新する方法については[配列の更新](/learn/updating-arrays-in-state)を参照してください。

---

### `useMemo` の返り値が、オブジェクトではなく undefined になってしまう {/*my-usememo-call-is-supposed-to-return-an-object-but-returns-undefined*/}

以下のコードはうまく動作しません。

```js {1-2,5}
  // 🔴 You can't return an object from an arrow function with () => {
  const searchOptions = useMemo(() => {
    matchMode: 'whole-word',
    text: text
  }, [text]);
```

JavaScript では、`() => {` というコードでアロー関数の本体を開始するため、`{` の波括弧はオブジェクトの一部にはなりません。したがってオブジェクトは返されず、ミスにつながります。`({` や `})` のように丸括弧を追加することで修正できます。

```js {1-2,5}
  // This works, but is easy for someone to break again
  const searchOptions = useMemo(() => ({
    matchMode: 'whole-word',
    text: text
  }), [text]);
```

しかし、これでもまだ混乱しやすく、誰かが丸括弧を削除してしまうと簡単に壊れてしまいます。

このミスを避けるために、明示的に `return` 文を書きましょう。

```js {1-3,6-7}
  // ✅ This works and is explicit
  const searchOptions = useMemo(() => {
    return {
      matchMode: 'whole-word',
      text: text
    };
  }, [text]);
```

---

### コンポーネントがレンダーされるたびに `useMemo` 内の関数が再実行される {/*every-time-my-component-renders-the-calculation-in-usememo-re-runs*/}

第 2 引数に依存配列を指定しているか確認してください！

依存配列を忘れると、`useMemo` は毎回計算を再実行してしまいます。

```js {2-3}
function TodoList({ todos, tab }) {
  // 🔴 Recalculates every time: no dependency array
  const visibleTodos = useMemo(() => filterTodos(todos, tab));
  // ...
```

第 2 引数に依存配列を渡した修正版は以下の通りです。

```js {2-3}
function TodoList({ todos, tab }) {
  // ✅ Does not recalculate unnecessarily
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
```

これで解決しない場合は、少なくとも 1 つの依存値が前回のレンダーと異なっていることが問題です。手動で依存値をコンソールに出力して、デバッグすることができます。

```js
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  console.log([todos, tab]);
```

コンソール上で、別々の再レンダーによって表示された 2 つの配列を選びます。それぞれについて、配列を右クリックし、"Store as a global variable（グローバル変数として保存）" を選択することで、配列を保存することができます。1 回目に保存した配列が `temp1`、2 回目に保存した配列が `temp2` として保存されたとすると、ブラウザのコンソールを使用して、両方の配列の各依存値が同じかどうかを確認できます。

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

メモ化を妨げている依存値を見つけたら、その依存値を削除する方法を探すか、その依存値も[メモ化](#memoizing-a-dependency-of-another-hook)しましょう。

---

### ループ内のリストの各項目について `useMemo` を呼び出したいが、禁止されている {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` コンポーネントが [`memo`](/reference/react/memo) でラップされているとします。`ReportList` コンポーネントが再レンダーされた場合でも、リスト内の各 `Chart` の再レンダーはスキップしたいです。ところが、以下のようにループ内で `useMemo` を呼び出すことはできません。

```js {5-11}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useMemo in a loop like this:
        const data = useMemo(() => calculateReport(item), [item]);
        return (
          <figure key={item.id}>
            <Chart data={data} />
          </figure>
        );
      })}
    </article>
  );
}
```

その場合は、各アイテムをコンポーネントに切り出し、アイテムごとにデータをメモ化します。

```js {5,12-18}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useMemo at the top level:
  const data = useMemo(() => calculateReport(item), [item]);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
}
```

あるいは、`useMemo` を削除し、`Report` 自体を [`memo`](/reference/react/memo) でラップすることでも解決できます。`item` が変化しない場合は、`Report` の再レンダーはスキップされ、`Chart` の再レンダーもスキップされます。

```js {5,6,12}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  const data = calculateReport(item);
  return (
    <figure>
      <Chart data={data} />
    </figure>
  );
});
```
