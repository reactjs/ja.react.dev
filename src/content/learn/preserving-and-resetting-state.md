---
title: state の保持とリセット
---

<Intro>

state は複数のコンポーネント間で独立しています。React は UI ツリー内の各コンポーネントの位置に基づいて、どの state がどのコンポーネントに属するか管理します。再レンダーをまたいでどのようなときに state を保持し、どのようなときにリセットするのか、制御することができます。

</Intro>

<YouWillLearn>

* React にはコンポーネント構造がどのように「見える」のか
* React が state の保持とリセットを行うタイミング
* React にコンポーネントの state のリセットを強制する方法
* key とタイプが state の保持にどのように影響するか

</YouWillLearn>

## UI ツリー {/*the-ui-tree*/}

ブラウザは、UI をモデル化するために多くのツリー構造を使用します。[DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) は HTML 要素を、[CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) は CSS を表現します。[アクセシビリティツリー](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)というものもあります！

React もまた、ユーザが作成した UI を管理しモデリングするためにツリー構造を使用します。React は JSX から **UI ツリー**を作成します。次に React DOM が、その UI ツリーに合わせてブラウザの DOM 要素を更新します。（React Native の場合は UI ツリーをモバイルプラットフォーム固有の要素に変換します。）

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="横に並んだ 3 つのセクションで構成された図。最初のセクションには、'コンポーネント A'、'コンポーネント B'、'コンポーネント C' という名前の 3 つの長方形が縦に並んでいる。次のセクションに移る矢印があり、その上には React ロゴが付いた 'React' というラベルがある。中央のセクションには、ルートに 'A'、その子に 'B'、'C' とラベル付けされたコンポーネントツリー。次のセクションへの矢印は 'React DOM' というラベルの上に React ロゴが付いている。最後のセクションではブラウザのフレームの中に 8 個のノードからなるツリーがあり、一部は中央セクションからのものであるためハイライトされている。">

React はコンポーネントから UI ツリーを作成し、React DOM はそれを DOM に変換する

</Diagram>

</DiagramGroup>

## state はツリー内の位置に結びついている {/*state-is-tied-to-a-position-in-the-tree*/}

コンポーネントに state を与えると、その state はそのコンポーネントの内部で「生存」しているように思えるかもしれません。しかし、実際には state は React の中に保持されています。React は、「UI ツリー内でそのコンポーネントがどの位置にあるか」に基づいて、保持している各 state を正しいコンポーネントに関連付けます。


以下のコードには `<Counter />` JSX タグは 1 つしかありませんが、それが 2 つの異なる位置にレンダーされています。

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

ツリーとしては、これは以下のように見えます。

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="React コンポーネントツリーを表す図。ルートノードは 'div' であり、2 つの子を持つ。子ノードはいずれも 'Counter' であり、値が 0 の 'count' を state として持っている。">

React ツリー

</Diagram>

</DiagramGroup>

**これらはツリー内の別々の位置にレンダーされているため、2 つの別々のカウンタとして動作します**。React を使用する上でこのような位置のことについて考える必要はめったにありませんが、React がどのように機能するかを理解することは有用です。

React では、画面上の各コンポーネントは完全に独立した state を持ちます。例えば、`Counter` コンポーネントを 2 つ横に並べてレンダーすると、それぞれが別個に、独立した `score` および `hover` という state を持つことになります。

両方のカウンタをクリックしてみて、互いに影響していないことを確かめてください。

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

ご覧のように、カウンタのうち 1 つが更新されると、そのコンポーネントの state だけが更新されます。


<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="React コンポーネントツリーを表す図。ルートノードは 'div' であり、2 つの子を持つ。左の子は 'Counter' で、値が 0 の 'count' を state として持つ。右の子は 'Counter' で、値が 1 の 'count' を state として持つ。右の子の state バブルは黄色でハイライトされており、その値が更新されたことを示している。">

state の更新

</Diagram>

</DiagramGroup>


React は、同じコンポーネントを同じ位置でレンダーしている限り、その state を保持し続けます。これを確認するため、両方のカウンタを増加させてから、"Render the second counter" のチェックボックスのチェックを外して 2 つ目のコンポーネントを削除し、再びチェックを入れて元に戻してみてください。

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

2 つ目のカウンタのレンダーをやめた瞬間、その state は完全に消えてしまいます。これは、React がコンポーネントを削除する際にその state も破棄するからです。

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="React コンポーネントツリーを表す図。ルートノードは 'div' であり、2 つの子を持つ。左の子は 'Counter' で、値が 0 の 'count' を state として持つ。右の子はパッと消えたようになっており、コンポーネントがツリーから削除されたことを示している。">

コンポーネントの削除

</Diagram>

</DiagramGroup>

"Render the second counter" にチェックを入れると、2 つ目の `Counter` とその state が初期化され (`score = 0`)、DOM に追加されます。

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="React コンポーネントツリーを表す図。ルートノードは 'div' であり、2 つの子を持つ。左の子は 'Counter' で、値が 0 の 'count' state を持つ。右の子も 'Counter' であり、値が 0 の 'count' state を持つ。右の子は全体が黄色くハイライトされており、今まさにツリーに追加されたことを示している。">

コンポーネントを追加する

</Diagram>

</DiagramGroup>

**React は、UI ツリーの中でコンポーネントが当該位置にレンダーされ続けている間は、そのコンポーネントの state を維持します**。もし削除されたり、同じ位置に別のコンポーネントがレンダーされたりすると、React は state を破棄します。

## 同じ位置の同じコンポーネントは state が保持される {/*same-component-at-the-same-position-preserves-state*/}

この例のコードには、`<Counter />` タグが 2 つあります。

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

チェックボックスにチェックを入れたり消したりしても、カウンタの state はリセットされません。`isFancy` が `true` であろうと `false` であろうと、ルートの `App` コンポーネントが返す `div` の最初の子は常に `<Counter />` だからです。

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="矢印で遷移している 2 つのセクションで構成される図。各セクションには、'App' とラベルの付いた親と、isFancy というラベルの付いた state ボックスが表示されている。このコンポーネントには 'div' とラベル付けされた 1 つの子があり、その下には isFancy と書かれたボックス（紫）があり下に props として渡されることを示している。どちらのセクションでも最後には 'count' = 3 という state ボックスを持つ 'Counter' がある。図の左側のセクションでは何も強調表示されておらず、isFancy の親状態の値は false。図の右側のセクションでは、isFancy の親の状態値が true に変更されて黄色でハイライトされており、下の props バブルも同様に true に変更されてハイライトされている。">

`App` の state を更新しても、`Counter` は同じ位置にあるためリセットされない

</Diagram>

</DiagramGroup>


同じコンポーネントが同じ位置にあるので、React の観点からは同じカウンタだというわけです。

<Pitfall>

**React にとって重要なのは JSX マークアップの位置ではなく UI ツリー内の位置である**ということを覚えておいてください。このコンポーネントからは、`if` の内側と外側で、2 つの `return` 文から 2 つの異なる `<Counter />` JSX タグが返されています。

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

チェックボックスにチェックを入れると state がリセットされると思われるかもしれませんが、そうはなりません。これは、**これらの両方の `<Counter />` タグが同じ位置でレンダーされている**ためです。あなたの関数内で条件分岐がどのように書かれているか、React には分かりません。React に「見える」のは、返されるツリーだけです。

どちらの場合も、`App` コンポーネントは、`<Counter />` を最初の子として持つ `<div>` を返します。React にとって、これら 2 つのカウンタは、「ルートの最初の子の最初の子」という、同じ「住所」を持っています。これが、あなたがどのようにロジックを構築しているかに関係なく、前回のレンダーと次のレンダーの間で React がコンポーネントを対応付ける方法なのです。

</Pitfall>

## 同じ位置の異なるコンポーネントは state をリセットする {/*different-components-at-the-same-position-reset-state*/}

この例では、チェックボックスにチェックを入れると、`<Counter>` が `<p>` に置き換わります。

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

ここでは、同じ位置で異なる種類のコンポーネントを切り替えています。最初は `<div>` の最初の子は `Counter` でした。それを `p` と入れ替えると、React は UI ツリーから `Counter` を削除し、その state を破棄します。

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="矢印で遷移する 3 セクションから構成される図。最初のセクションには React コンポーネントとして 'div' とその唯一の子である 'Counter' があり、カウンタには値が 3 になった 'count' state がある。中央のセクションにも親の 'div' があるが、子が消失している。最後のセクションにも 'div' があるが、今度は 'p' と書かれた新しい子ができており、黄色でハイライトされている。">

`Counter` が `p` に変わると、`Counter` は削除され、`p` が追加される

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="矢印で遷移する 3 セクションから構成される図。最初のセクションには React コンポーネントとして 'div' とその子である 'p' がある。中央のセクションにも親の 'div' があるが、子が消失している。最後のセクションにも 'div' があるが、今度は 'Count' と書かれた新しい子ができており黄色でハイライトされている。その 'count' state は 0 となっている。">

戻すときは、`p` が削除され、`Counter` が追加される

</Diagram>

</DiagramGroup>

また、**同じ位置で異なるコンポーネントをレンダーすると、そのサブツリー全体の state がリセットされます**。これがどのように動作するかを確認するために、以下でカウンタを増やしてからチェックボックスにチェックを入れてみてください：

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

チェックボックスをクリックするとカウンタの state がリセットされます。`Counter` をレンダーしていることは同じでも、`<div>` の最初の子が `section` から `div` に変わっています。子側の `section` が DOM から削除されたとき、その下のツリー全体（`Counter` とその state を含む）も破棄されたのです。

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="矢印で遷移する 3 セクションから構成される図。最初のセクションには React コンポーネントとして 'div' とその子である 'section' がある。さらにその子に 'Counter' があり、'count' の state ボックスは 3 となっている。中央のセクションにも親の 'div' があるが、子が消失している。最後のセクションにも 'div' があり、今度は別の 'div' が新しい子となってハイライトされている。さらにその子に 'Counter' があって黄色でハイライトされており、その 'count' の state ボックスは 0 となっている。">

`section` が `div` に変わると、`section` は削除され、新しい `div` が追加される

</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="矢印で遷移する 3 セクションから構成される図。最初のセクションには React コンポーネントとして 'div' とその子である別の 'div' がある。さらにその子に 'Counter' があり、'count' の state ボックスは 0 となっている。中央のセクションにも親の 'div' があるが、子が消失している。最後のセクションにも 'div' があり、今度は 'section' が新しい子となってハイライトされている。さらにその子に 'Counter' があって黄色でハイライトされており、その 'count' の state ボックスは 0 となっている。">

戻すときは `div` は削除され、新しい `section` が追加される

</Diagram>

</DiagramGroup>

覚えておくべきルールとして、**再レンダー間で state を維持したい場合、ツリーの構造はレンダー間で「合致」する必要があります**。構造が異なる場合、React がツリーからコンポーネントを削除するときに state も破棄されてしまいます。

<Pitfall>

これがコンポーネント関数の定義をネストしてはいけない理由でもあります。

以下では、`MyTextField` コンポーネント関数が `MyComponent` の*内部*で定義されています。

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


ボタンをクリックするたびに、入力フィールドの state が消えてしまいます！ これは、`MyComponent` がレンダーされるたびに*異なる* `MyTextField` 関数が作成されているためです。同じ位置に*異なる*コンポーネントをレンダーしているので、React はそれより下のすべての state をリセットします。これはバグやパフォーマンスの問題につながります。この問題を避けるために、**常にコンポーネント関数はトップレベルで宣言し、定義をネストしない**ようにしてください。

</Pitfall>

## 同じ位置で state をリセット {/*resetting-state-at-the-same-position*/}

デフォルトでは、React はコンポーネントが同じ位置にある間、その state を保持します。通常、これがまさにあなたが望むものであり、デフォルト動作として妥当です。しかし時には、コンポーネントの state をリセットしたい場合があります。以下の、2 人のプレーヤに交替でスコアを記録させるアプリを考えてみましょう。

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

現在のところ、プレーヤを変更してもスコアが保持されています。2 つの `Counter` は同じ位置に表示されるため、React は `person` という props が変更されただけの*同一の* `Counter` であると認識します。

しかし、概念的には、このアプリでは、この 2 つのカウンタは別物であるべきです。UI 上の同じ場所に表示されているにせよ、一方は Taylor のカウンタで、もう一方は Sarah のカウンタなのです。

これらを切り替えるときに state をリセットする方法は、2 つあります。

1. コンポーネントを異なる位置でレンダーする
2. `key` を使って各コンポーネントに明示的な識別子を付与する


### オプション 1：異なる位置でコンポーネントをレンダー {/*option-1-rendering-a-component-in-different-positions*/}

これら 2 つの `Counter` を互いに独立させたい場合、レンダーを 2 つの別の位置で行うことで可能です。

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* 最初 `isPlayerA` は `true` です。そのため、1 番目の位置に対して `Counter` の state が保持され、2 番目は空です。
* "Next player" ボタンをクリックすると、最初の位置がクリアされ、2 番目の位置に `Counter` が入ります。

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="React コンポーネントツリーを表す図。親は 'Scoreboard' という名前であり isPlayerA という state ボックスの値は 'true' である。唯一の子は左側に配置される 'Counter' であり、'count' という state ボックスの値は 0 である。左の子供全体が黄色でハイライトされており、追加されたことを示している。">

初期 state

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="React コンポーネントツリーを表す図。親は 'Scoreboard' という名前であり isPlayerA という state ボックスの値は 'false' である。このボックスは黄色でハイライトされており、変更があったことを示している。左の子は消失しており、一方で右に別の子が追加されており、黄色でハイライトされている。新しい子は 'Counter' であり、'count' という state ボックスの値は 0 である。">

"Next" をクリック

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="React コンポーネントツリーを表す図。親は 'Scoreboard' という名前であり isPlayerA という state ボックスの値は 'true' である。このボックスは黄色でハイライトされており、変更があったことを示している。左に子が追加されており、黄色でハイライトされている。新しい子は 'Counter' であり、'count' という state ボックスの値は 0 である。右の子は消失している。">

再び "Next" をクリック

</Diagram>

</DiagramGroup>

<<<<<<< HEAD
`Counter` の state は DOM から削除されるたびに破棄されます。これがボタンをクリックするたびにカウントがリセットされる理由です。
=======
Each `Counter`'s state gets destroyed each time it's removed from the DOM. This is why they reset every time you click the button.
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

この解決策は、同じ場所でレンダーされる独立したコンポーネントが数個しかない場合には便利です。この例では 2 つしかないので、両方を JSX 内で別々にレンダーしても大変ではありません。

### オプション 2：key で state をリセットする {/*option-2-resetting-state-with-a-key*/}

コンポーネントの state をリセットする一般的な方法がもうひとつあります。

[リストをレンダー](/learn/rendering-lists#keeping-list-items-in-order-with-key)する際に `key` を使ったのを覚えているでしょうか。key はリストのためだけのものではありません！ どんなコンポーネントでも React がそれを識別するために使用できるのです。デフォルトでは、React は親コンポーネント内での順序（「1 番目のカウンタ」「2 番目のカウンタ」）を使ってコンポーネントを区別します。しかし、`key` を使うことで、カウンタが単なる *1 番目の*カウンタや *2 番目の*カウンタではなく特定のカウンタ、例えば *Taylor の*カウンタである、と React に伝えることができます。このようにして、React は *Taylor の*カウンタがツリーのどこにあっても識別できるようになるのです。

この例では、2 つの `<Counter />` は JSX の同じ場所にあるにもかかわらず、state を共有していません：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Taylor と Sarah を切り替えたときに state が保持されなくなりました。**異なる `key` を指定した**からです。

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

`key` を指定することで、親要素内の順序ではなく、`key` 自体を位置に関する情報として React に使用させることができます。これにより、JSX で同じ位置にレンダーしても、React はそれらを異なるカウンタとして認識するため、state が共有されてしまうことはありません。カウンタが画面に表示されるたびに、新しい state が作成されます。カウンタが削除されるたびに、その state は破棄されます。切り替えるたびに、何度でも state がリセットされます。

<Note>

key はグローバルに一意である必要はなく、*親要素内での*位置を指定しているだけであることを覚えておきましょう。

</Note>

### key でフォームをリセットする {/*resetting-a-form-with-a-key*/}

key を使って state をリセットすることは、フォームを扱う際に特に有用です。

このチャットアプリでは、`<Chat>` コンポーネントがテキスト入力フィールド用の state を持っています。

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
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
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
          <li key={contact.id}>
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

入力フィールドに何か入力してから、"Alice" または "Bob" をクリックして別の送信先を選択してみてください。`<Chat>` がツリーの同じ位置にレンダーされているため、入力した state が保持されたままになっていることが分かります。

**多くのアプリではこれが望ましい動作でしょうが、チャットアプリでは違います！** ミスクリックのせいで既に入力したメッセージを誤った相手に送ってしまうことは避けたいでしょう。これを修正するために、`key` を追加します。

```js
<Chat key={to.id} contact={to} />
```

これにより、異なる送信先を選択したときに、`Chat` コンポーネントが、その下のツリーにあるあらゆる state も含めて最初から再作成されるようになります。React は DOM 要素についても再利用するのではなく再作成します。

これで、送信先を切り替えると常にテキストフィールドがクリアされるようになります。

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
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
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
          <li key={contact.id}>
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

<DeepDive>

#### 削除されたコンポーネントの state の保持 {/*preserving-state-for-removed-components*/}

実際のチャットアプリでは、ユーザが以前の送信先を再度選択したときに入力欄の state を復元できるようにしたいでしょう。表示されなくなったコンポーネントの state を「生かしておく」方法はいくつかあります。

- 現在のチャットだけでなく*すべて*のチャットをレンダーしておき、CSS で残りのすべてのチャットを非表示にすることができます。チャットはツリーから削除されないため、ローカル state も保持されます。この解決策はシンプルな UI では適していますが、非表示のツリーが大きく DOM ノードがたくさん含まれている場合は非常に遅くなります。
- state を[リフトアップする](/learn/sharing-state-between-components)ことで、各送信先に対応する書きかけのメッセージを親コンポーネントで保持することができます。この方法では、重要な情報を保持しているのは親の方なので、子コンポーネントが削除されても問題ありません。これが最も一般的な解決策です。
- また、React の state に加えて別の情報源を利用することもできます。例えば、ユーザがページを誤って閉じたとしてもメッセージの下書きが保持されるようにしたいでしょう。これを実装するために、`Chat` コンポーネントが [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) から読み込んで state を初期化し、下書きを保存するようにできます。

どの戦略を選ぶ場合でも、*Alice との*チャットと *Bob との*チャットは概念的には異なるものなので、現在の送信先に基づいて `<Chat>` ツリーに `key` を付与することは妥当です。

</DeepDive>

<Recap>

- React は、同じコンポーネントが同じ位置でレンダーされている限り、state を保持する。
- state は JSX タグに保持されるのではない。JSX を置くツリー内の位置に関連付けられている。
- 異なる key を与えることで、サブツリーの state をリセットするよう強制することができる。
- コンポーネント定義をネストさせてはいけない。さもないと state がリセットされてしまう。

</Recap>



<Challenges>

#### 入力テキストの消失を修正 {/*fix-disappearing-input-text*/}

この例では、ボタンを押すとメッセージが表示されます。が、ボタンを押すことでどういうわけか入力欄がリセットされてしまいます。なぜこれが起こるのでしょうか？ ボタンを押しても入力テキストがリセットされないように修正してください。

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

問題は、`Form` が異なる位置にレンダーされていることです。`if` 側の分岐では、`<div>` の 2 番目の子としてレンダーされますが、`else` 側の分岐では、1 番目の子としてレンダーされます。そのため各位置でのコンポーネントのタイプが変わってしまいます。1 番目の位置では `p` と `Form` の間で切り替わり、2 番目の位置では `Form` と `button` の間で切り替わっているわけです。React は、コンポーネントタイプが変更されるたびに state をリセットします。

最も簡単な解決策は、2 つの分岐を統合して `Form` が常に同じ位置でレンダーされるようにすることです。

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


厳密に言えば、`else` 側の分岐の `<Form />` の前に `if` 側の分岐の構造に対応する `null` を追加する、ということも可能です。

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

これで `Form` は常に 2 番目の子になり、同じ位置にあるため state が保持されます。ただし、このアプローチは分かりづらく、誰かが `null` を削除してしまう危険性があるため、注意が必要です。

</Solution>

#### 2 つのフィールドを入れ替え {/*swap-two-form-fields*/}

これは姓と名を入力できるフォームです。また、どちらのフィールドが最初に表示されるかを制御するチェックボックスもあります。チェックボックスにチェックを入れると "Last name" フィールドが "First name" フィールドの前に表示されるようになります。

ほぼ問題なく動作していますが、バグがあります。"First name" 欄に何か入力してからチェックボックスにチェックを入れると、テキストがいまや "Last name" になった 1 番目の入力フィールドに残ってしまいます。順序を逆にしたときに入力テキスト*も*移動するように修正してください。

<Hint>

このフィールドでは、親要素内の位置を使うだけでは十分ではないようです。再レンダー間で React に state の照合を行わせる方法がありませんでしたか？

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

`if` および `else` の両方の分岐の `<Field>` コンポーネントに `key` を指定します。これにより、親要素内での順序が変わっても、どちらの `<Field>` に正しく state を「マッチ」させればいいのか、React が理解できるようになります。

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );    
  }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### 詳細フォームをリセット {/*reset-a-detail-form*/}

これは、編集可能な連絡先リストです。選択された連絡先の詳細情報を編集した後に、"Save" ボタンを押して更新するか、"Reset" ボタンを押して編集を元に戻すことができます。

異なる連絡先（例えば Alice）を選択すると、state は更新されるのに、フォームには前の連絡先の詳細が表示されたままになっています。選択されている連絡先が変更されたときに、正しくフォームがリセットされるように修正してください。

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

`EditContact` コンポーネントに `key={selectedId}` を指定します。これにより、連絡先を切り替えたときにフォームがリセットされるようになります。

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### 読み込み中に画像をクリア {/*clear-an-image-while-its-loading*/}

"Next" ボタンを押すとブラウザが次の画像を読み込み始めます。ただし、同一の `<img>` タグを使って画像を表示しているため、このままでは次の画像が読み込まれるまで前の画像が表示されたままになります。テキストが常に画像と一致することが重要である場合、これは望ましくないかもしれません。"Next" を押した瞬間に前の画像がクリアされるように変更してください。

<Hint>

React に DOM を再利用させず再作成させる方法がありませんでしたか？

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

`<img>` タグに `key` を渡しましょう。`key` が変更されると、React は `<img>` の DOM ノードを再作成します。こうすると画像が読み込まれるたびに瞬間的に画面が白くなってしまうため、アプリ内のあらゆる画像でこれが望ましいわけではありません。しかし画像が常にテキストと対応していることを保証したい場合は、この方法が適しています。

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### リスト内の state 位置ズレを修正 {/*fix-misplaced-state-in-the-list*/}

このリストでは各 `Contact` は、"Show email" ボタンが押されたかどうかを保持する state を持っています。Alice の "Show email" を押してから、"Show in reverse order" のチェックボックスにチェックを入れてください。すると Taylor のメール欄が展開されてしまい、一方で最下部に移動した Alice のメール欄は閉じられてしまいます。

選択中の並び順と関係なく、展開中かどうかの state がそれぞれの連絡先に関連付けられるよう、修正してください。

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

この例の問題は `key` としてインデックスを使用してしまっていたことです。

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

しかし state は*それぞれ特定の連絡先*に関連づける必要があるはずです。

連絡先の ID を `key` として使用することで、問題が解決します：

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

state はツリー内の位置と関連付けられています。`key` を使うことで、表示順に依存しない、名前付きの位置情報を指定することができます。

</Solution>

</Challenges>
