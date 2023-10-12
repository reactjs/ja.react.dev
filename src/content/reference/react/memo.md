---
title: memo
---

<Intro>

`memo` を使うことで、props が変更されていない場合にコンポーネントの再レンダーをスキップできます。

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

コンポーネントを `memo` でラップすることで、そのコンポーネントの*メモ化 (memoize)* されたバージョンが得られます。このメモ化されたバージョンのコンポーネントは、親コンポーネントが再レンダーされても、自身の props が変更されていない限り通常は再レンダーされなくなります。ただしメモ化は、パフォーマンス最適化であって保証ではないため、React が再レンダーを行うこともありえます。

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `Component`: メモ化したいコンポーネント。`memo` はこのコンポーネントを変更するのではなく、メモ化が有効になった新たなコンポーネントを返します。関数コンポーネントや [`forwardRef`](/reference/react/forwardRef) によるコンポーネントを含む、任意の有効な React コンポーネントを受け付けます。

* **省略可能** `arePropsEqual`: コンポーネントの前回の props と新しい props の 2 つを引数に取る関数。古い props と新しい props が等しい場合、つまり、新しい props でもコンポーネントが古い props と同じ出力をレンダーして同じように動作する場合は `true` を返すようにします。それ以外の場合は `false` を返すようにします。通常はこの関数を指定することはありません。デフォルトでは、React は個々の props を [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使って比較します。

#### 返り値 {/*returns*/}

`memo` は新しい React コンポーネントを返します。これは `memo` に渡したコンポーネントと同様に動作しますが、親が再レンダーされた際に自身の props が変更されていない場合、React が再レンダーを行わない、という点が異なります。

---

## 使用法 {/*usage*/}

### props が変更されていない場合に再レンダーをスキップする {/*skipping-re-rendering-when-props-are-unchanged*/}

React は通常、親コンポーネントが再レンダーされると常にコンポーネントを再レンダーします。`memo` を使用すると、新しい props が古い props と同じである限り、親が再レンダーされても React によって再レンダーされないコンポーネントを作成できます。そのようなコンポーネントは*メモ化された (memoized)* コンポーネントと呼ばれます。

コンポーネントをメモ化するには、それを `memo` でラップし、返された値を元のコンポーネントの代わりに使用します。

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

React コンポーネントは常に[純粋なレンダーロジック](/learn/keeping-components-pure)を持つべきです。これは、props、state およびコンテクストが変更されていない場合、常に同じ出力を返す必要があるという意味です。`memo` を使用することで、コンポーネントがこの要件を満たしており、props が変更されない限り再レンダーの必要がないということを React に伝えることができます。`memo` を使用しても、コンポーネント自体の state が変更された場合や、使用しているコンテクストが変更された場合には再レンダーが発生します。

以下の例において、`name` は（props の一部なので）変更されるたびに `Greeting` コンポーネントが再レンダーされる一方で、`address` は（`Greeting` に props として渡されていないため）変更されても再レンダーされないということに注目してください。

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

**`memo` はパフォーマンスの最適化としてのみ使用してください**。もしコードがそれなしでは動作しない場合、根本的な問題を見つけて先に修正してください。その後で `memo` を追加してパフォーマンスを向上させることができます。

</Note>

<DeepDive>

#### あらゆる場所に memo を追加すべきか？ {/*should-you-add-memo-everywhere*/}

あなたのアプリがこのサイトのように、ほとんどのインタラクションが大まかなもの（ページ全体やセクション全体の置き換えなど）である場合、メモ化は通常不要です。一方、あなたのアプリが描画エディタのようなもので、ほとんどのインタラクションが細かなもの（図形を移動させるなど）である場合、メモ化は非常に役に立つでしょう。

`memo` による最適化は、コンポーネントが全く同一の props で頻繁に再レンダーされ、しかもその再レンダーロジックが高コストである場合にのみ価値があります。コンポーネントが再レンダーされても遅延を感じられない場合、`memo` は不要です。レンダー中に定義されたオブジェクトやプレーンな関数を渡しているなどでコンポーネントに渡される props が*毎回異なる*場合、`memo` は全く無意味であることを覚えておいてください。これが、`memo` と一緒に [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) や [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) がよく必要となる理由です。

その他のケースでコンポーネントを `memo` でラップすることにメリットはありません。それを行っても重大な害はないため、個別のケースを考えずに、可能な限り全てをメモ化するようにしているチームもあります。このアプローチのデメリットは、コードが読みにくくなることです。また、すべてのメモ化が効果的なわけではありません。例えば、毎回変化する値が 1 つ存在するだけで、コンポーネント全体のメモ化が無意味になってしまうこともあります。

**実際には、以下のいくつかの原則に従うことで、多くのメモ化を不要にすることができます**。

1. コンポーネントが他のコンポーネントを視覚的にラップするときは、それが[子として JSX を受け入れるようにします](/learn/passing-props-to-a-component#passing-jsx-as-children)。これにより、ラッパコンポーネントが自身の state を更新しても、React はその子を再レンダーする必要がないことを認識します。
1. ローカル state を優先し、必要以上に [state のリフトアップ](/learn/sharing-state-between-components)を行わないようにします。フォームや、アイテムがホバーされているかどうか、といった頻繁に変化する state は、ツリーのトップやグローバルの状態ライブラリに保持しないでください。
1. [レンダーロジックを純粋に](/learn/keeping-components-pure)保ちます。コンポーネントの再レンダーが問題を引き起こしたり、何らかの目に見える視覚的な結果を生じたりする場合、それはあなたのコンポーネントのバグです！ メモ化を追加するのではなく、バグを修正します。
1. [state を更新する不要なエフェクトを避けてください](/learn/you-might-not-need-an-effect)。React アプリケーションのパフォーマンス問題の大部分は、エフェクト内での連鎖的な state 更新によってコンポーネントのレンダーが何度も引き起こされるために生じます。
1. [エフェクトから不要な依存値をできるだけ削除します](/learn/removing-effect-dependencies)。例えば、メモ化する代わりに、オブジェクトや関数をエフェクトの中や外に移動させるだけで、簡単に解決できる場合があります。

それでも特定のインタラクションが遅いと感じる場合は、[React Developer Tools のプロファイラを使用して](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)、どのコンポーネントでのメモ化が最も有効かを確認し、そこでメモ化を行いましょう。これらの原則を守ることで、コンポーネントのデバッグや理解が容易になるため、常に原則に従うことをおすすめします。長期的には、この問題を一挙に解決できる[自動的なメモ化](https://www.youtube.com/watch?v=lGEMwh32soc)について研究を行っています。

</DeepDive>

---

### state を使ってメモ化されたコンポーネントを更新する {/*updating-a-memoized-component-using-state*/}

コンポーネントがメモ化されていても、自身の state が変更されたときには再レンダーが発生します。メモ化は、親からコンポーネントに渡される props にのみ関係します。

<Sandpack>

```js
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

state 変数を現在値そのものにセットする場合、React は `memo` がなくてもコンポーネントの再レンダーをスキップします。コンポーネント関数が余分に呼び出されることがあるかもしれませんが、その結果は破棄されます。

---

### コンテクストを使ってメモ化されたコンポーネントを更新する {/*updating-a-memoized-component-using-a-context*/}

コンポーネントがメモ化されていても、使用しているコンテクストが変更されたときには再レンダーが発生します。メモ化は、親からコンポーネントに渡される props にのみ関係します。

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```

</Sandpack>

コンテクストの一部が変化したときだけコンポーネントが再レンダーされるようにするには、コンポーネントを 2 つに分割してください。外側のコンポーネントでコンテクストから必要な情報を読み取って、それをメモ化された子コンポーネントに props として渡します。

---

### props の変更を可能な限り減らす {/*minimizing-props-changes*/}

`memo` を使用すると、コンポーネントは props のいずれかが*浅い (shallow) 比較で*前回と等しくない場合に再レンダーされます。つまり、React はコンポーネントのすべての props を前回の値と [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使用して比較します。`Object.is(3, 3)` は `true` ですが、`Object.is({}, {})` は `false` です。


`memo` の利点を最大限活かすためには、props が変更される回数を最小限に抑えます。例えば、ある props がオブジェクトである場合、親コンポーネント側で、そのオブジェクトが毎回再作成されるのを防ぐために [`useMemo`](/reference/react/useMemo) を使用します。

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

props の変更を最小限に抑えるより良い方法は、コンポーネントが最小限の情報を props として受け入れるようにすることです。例えば、オブジェクト全体の代わりにその中の個々の値を受け入れるようにできます。

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

さらにそのような個々の値を、より変化しづらい値に投射できることもあります。例えば以下では、コンポーネントが値そのものではなく、値が存在するかどうかのみを表すブーリアンを受け入れるようになっています。

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

メモ化されたコンポーネントに関数を渡す必要がある場合、それが変化しないようにコンポーネント外で宣言するか、または [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) を使用することで再レンダーをまたいで定義をキャッシュします。

---

### カスタム比較関数の指定 {/*specifying-a-custom-comparison-function*/}

まれに、メモ化されたコンポーネントの props の変更を最小限に抑えることが不可能な場合があります。その場合、カスタム比較関数を提供することができます。React は浅い比較の代わりに、これを使用して古い props と新しい props を比較します。この関数は `memo` の第 2 引数として渡します。新しい props が古い props と同じ出力をもたらす場合にのみ `true` を返し、それ以外の場合は `false` を返すようにします。

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

これを行う際は、ブラウザの開発者ツールの Performance パネルを使用して、比較関数を用いることでコンポーネントを再レンダーするより実際に高速化されることを確認してください。結果に驚くかもしれません。

パフォーマンス測定を行うときは、React が本番モードで動作していることを確認してください。

<Pitfall>

カスタムの `arePropsEqual` 実装を提供する場合、**関数を含むすべての prop を比較する必要があります**。しばしば関数はよく親コンポーネントにある props と state を[クロージャ内に閉じ込め](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)ます。`oldProps.onClick !== newProps.onClick` なのに `true` を返すと、コンポーネントは `onClick` ハンドラ内で以前のレンダー時の props と state を「見続ける」ことになり、非常に混乱するバグを引き起こします。

対象のデータ構造が既知の有限の深さを持つことが 100% 確定している場合を除き、`arePropsEqual` 内で深い等価性チェックを行うことは避けてください。**深い等価性チェックは非常に遅くなる危険性がある**ため、誰かが後でデータ構造を変更することによりアプリが何秒間もフリーズしてしまう可能性があります。

</Pitfall>

---

## トラブルシューティング {/*troubleshooting*/}
### props がオブジェクト・配列・関数の場合にコンポーネントが再レンダーされる {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React は古い props と新しい props とを浅く比較します。つまり、新しい props のそれぞれの値が古い props と参照ベースで等価であるかどうかを比較します。親が再レンダーのたびに新しいオブジェクトや配列を作成している場合、個々の要素が同じであっても、React は変更があったと考えます。同様に、親コンポーネントのレンダー時に新しい関数を作成すると、関数の定義が同じであっても、React はそれを別のものだと考えます。これを避けるためには、[親コンポーネントで props を単純化するか、または props をメモ化してください](#minimizing-props-changes)。
