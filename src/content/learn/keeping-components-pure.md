---
title: コンポーネントを純粋に保つ
---

<Intro>

JavaScript 関数の中には、*純関数* (pure function) と呼ばれるものがあります。純関数とは計算だけを行い、他には何もしない関数のことです。コンポーネントを常に厳密に純関数として書くことで、コードベースが成長するにつれて起きがちな、あらゆる種類の不可解なバグ、予測不可能な挙動を回避することができます。ただし、このようなメリットを得るためには、従わなければならないルールがいくつか存在します。

</Intro>

<YouWillLearn>

* 「純粋」であるとは何か、それによりなぜバグが減らせるのか
* 変更をレンダーの外で行い、コンポーネントを純粋に保つ方法
* Strict Mode を使用してコンポーネントの間違いを見つける方法

</YouWillLearn>

## 純粋性：コンポーネントとは数式のようなもの {/*purity-components-as-formulas*/}

コンピュータサイエンス（特に関数型プログラミングの世界）では、[純関数 (pure function)](https://wikipedia.org/wiki/Pure_function) とは、以下のような特徴を持つ関数のことを指します。

* **自分の仕事に集中する**。呼び出される前に存在していたオブジェクトや変数を変更しない。
* **同じ入力には同じ出力**。同じ入力を与えると、純関数は常に同じ結果を返す。

皆さんは純関数の例をひとつ、すでにご存知のはずです。数学における関数です。

この数式を考えてみてください：<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>。

もし <Math><MathI>x</MathI> = 2</Math> ならば <Math><MathI>y</MathI> = 4</Math>。常にです。

もし <Math><MathI>x</MathI> = 3</Math> ならば <Math><MathI>y</MathI> = 6</Math>。常にです。

もし <Math><MathI>x</MathI> = 3</Math> ならば、<MathI>y</MathI> が現在時刻や株式市況に影響されてたまに <Math>9</Math> や <Math>–1</Math> や <Math>2.5</Math> になったりはしません。

もし <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> かつ <Math><MathI>x</MathI> = 3</Math> なら、<MathI>y</MathI> は*どんな場合でも常に* <Math>6</Math> になるのです。

この式を JavaScript 関数で書くとすると、次のようになります：

```js
function double(number) {
  return 2 * number;
}
```

上記の例では、`double` 関数は**純関数**です。もし `3` を渡すと、`6` を返しますね。常にです。

React はこのような概念に基づいて設計されています。**React は、あなたが書くすべてのコンポーネントが純関数であると仮定しています**。つまり、あなたが書く React コンポーネントは、与えられた入力が同じであれば、常に同じ JSX を返す必要があります。

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

`drinkers={2}` を `Recipe` に渡すと、`2 cups of water` を含む JSX が返されます。常にです。

`drinkers={4}` を渡すと、`4 cups of water` を含む JSX が返されます。常にです。

そう、まるで数式のように、です。

コンポーネントとはレシピのようなものだと考えることもできるでしょう。調理途中で新しい食材を加えたりせず、レシピに従っておけば、常に同じ料理を得ることができます。その「料理」とは、コンポーネントが React に提供する JSX のことであり、それを React が[表示](/learn/render-and-commit)します。

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="人 x 人分のお茶のレシピ：x cups of water を取り、x spoons of tea と0.5x spoons of spices を加え、0.5x cups of milk を入れる" />

## 副作用：意図せぬ (?) 付随処理 {/*side-effects-unintended-consequences*/}

React のレンダープロセスは常に純粋である必要があります。コンポーネントは JSX を*返す*だけであり、レンダー前に存在していたオブジェクトや変数を*書き換え*しないようにしなければなりません。さもなくばコンポーネントは不純 (impure) になってしまいます！

以下は、この規則を守っていないコンポーネントの例です。

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

このコンポーネントは、外部で宣言された `guest` 変数を読み書きしています。つまり、**このコンポーネントを複数回呼び出すと、異なる JSX が生成されます！** さらに悪いことに、*ほかの*コンポーネントも `guest` を読み取る場合、それらもレンダーされたタイミングによって異なる JSX を生成することになります！ これでは予測不可能です。

数式 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> の例に戻ると、これは <Math><MathI>x</MathI> = 2</Math> であっても <Math><MathI>y</MathI> = 4</Math> であることが保証されない、というようなことです。テストは失敗し、ユーザは当惑し、飛行機も空から墜落しかねません。こんなことをするとなぜ混乱するバグが引き起こされるのか、もうおわかりですね。

[props を使って `guest` を渡す](/learn/passing-props-to-a-component)ようにこのコンポーネントを修正できます。

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

これでこのコンポーネントは純粋になります。返す JSX が `guest` プロパティのみに依存しているからです。

一般に、特定の順序でコンポーネントがレンダーされることを期待してはいけません。<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> と <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math> のどちらを先に呼ぶかなど問題にしてはいけないのです。これらの数式は互いに無関係に計算されるべきです。同じように、各コンポーネントは「自分のことだけを考える」べきであり、レンダーの最中に他のコンポーネントに依存したり他のコンポーネントと協調したりすることはありません。レンダーとは学校の試験のようなものです。各コンポーネントはそれぞれ、自分の力だけで JSX を計算する必要があるのです！

<DeepDive>

#### StrictMode で純粋でない計算を検出 {/*detecting-impure-calculations-with-strict-mode*/}

まだ全部を使ったことはないかもしれませんが、React には [props](/learn/passing-props-to-a-component)、[state](/learn/state-a-components-memory)、そして[コンテクスト](/learn/passing-data-deeply-with-context)という、レンダー中に読み取ることができる 3 種類の入力があります。これらの入力は常に読み取り専用として扱うようにしてください。

ユーザ入力に応じて何かを *変更* したい場合は、変数に書き込む代わりに、[state を設定する](/learn/state-a-components-memory)ことが適切です。要素のレンダー中に既存の変数やオブジェクトを書き換えることは絶対にやってはいけません。

React には "Strict Mode" という機能があり、開発中には各コンポーネント関数を 2 回呼び出します。**関数呼び出しを 2 回行うことで、Strict Mode はこれらのルールに反するコンポーネントを見つけるのに役立ちます。**

元の例では "Guest #1"、"Guest #2"、"Guest #3" と表示される代わりに "Guest #2"、"Guest #4"、"Guest #6" と表示されてしまっていましたね。元の関数が純粋でなかったため、2 回呼び出すと壊れていたわけです。修正された純粋なバージョンは、毎回 2 回呼び出されても問題ありません。**純関数は計算をするだけなので、2 回呼び出しても何も変わりません**。`double(2)` を 2 回呼び出しても戻り値が変わることはなく、<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> を 2 回解いても <MathI>y</MathI> が変わることがないのと全く同じです。入力が同じならば、出力も同じにしてください。常にそうしてください。

Strict Mode は本番環境では影響を与えないため、ユーザが使うアプリを遅くすることはありません。Strict Mode を有効にするには、ルートコンポーネントを `<React.StrictMode>` でラップします。一部のフレームワークでは、これがデフォルトで行われます。

</DeepDive>

### ローカルミューテーション：コンポーネントの小さな秘密 {/*local-mutation-your-components-little-secret*/}

上記の例では、問題はコンポーネントがレンダーの最中に*既存*の変数を変更していた点にありました。このような変更は、少し恐ろしい言い方では **"ミューテーション（変異; mutation）"** と呼ばれます。純関数は、関数のスコープ外の変数や、呼び出し前に作成されたオブジェクトをミューテートしません。そういうことをしてしまった関数は「不純」になってしまいます！

しかし、**レンダー中に*その場で*作成した変数やオブジェクトであれば、書き換えることは全く問題ありません**。この例では、`[]` 配列を作成して `cups` 変数に代入し、それに 12 個のカップを `push` しています：

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

`cups` 変数または `[]` 配列が `TeaGathering` 関数の外で作成されたものだった場合、これは大きな問題になることでしょう！ *既存の*オブジェクトを変更してしまうことになるからです。

しかし、`cups` 変数と `[]` 配列は、`TeaGathering` 内で*同一のレンダー中に*作成されたものであるため、問題はありません。`TeaGathering` 以外のコードは、これが起こったことすら知るすべがありません。これは "ローカルミューテーション (local mutation)" と呼ばれます。あなたのコンポーネント内のちょっとした秘密のようなものです。

## 副作用を引き起こせる場所 {/*where-you-_can_-cause-side-effects*/}

関数型プログラミングには純粋性が重要であるとはいえ、いつか、どこかの場所で、*何らかのもの*が変化しなければなりません。むしろそれがプログラミングをする意味というものでしょう。これらの変化（スクリーンの更新、アニメーションの開始、データの変更など）は **副作用 (side effect)** と呼ばれます。レンダーの最中には発生しない、「付随的」なものです。

React では、**副作用は通常、[イベントハンドラ](/learn/responding-to-events)の中に属します**。イベントハンドラは、ボタンがクリックされたといった何らかのアクションが実行されたときに React が実行する関数です。イベントハンドラは、コンポーネントの「内側」で定義されているものではありますが、レンダーの「最中」に実行されるわけではありません！ **つまり、イベントハンドラは純粋である必要はありません。**

いろいろ探してもあなたの副作用を書くのに適切なイベントハンドラがどうしても見つからない場合は、コンポーネントから返された JSX に [`useEffect`](/reference/react/useEffect) 呼び出しを付加することで副作用を付随させることも可能です。これにより React に、その関数をレンダーの後（その時点なら副作用が許されます）で呼ぶように指示できます。**ただしこれは最終手段であるべきです。**

可能な限り、ロジックをレンダーのみで表現してみてください。これだけでどれだけのことができるのか、驚くことでしょう！

<DeepDive>

#### React はなぜ純粋性を重視するのか？ {/*why-does-react-care-about-purity*/}

純関数を書くことには、多少の習慣化と訓練が必要です。しかし、それは素晴らしいチャンスをもたらすものでもあります。

* コンポーネントが異なる環境、例えばサーバ上でも実行できるようになります！ 入力値が同じなら同じ結果を返すので、ひとつのコンポーネントが多数のユーザリクエストを処理できます。
* 入力値が変化しない場合、[レンダーをスキップ](/reference/react/memo)することでパフォーマンスを向上できます。これが問題ないのは、純関数は常に同じ出力を返すため安全にキャッシュできるからです。
* 深いコンポーネントツリーのレンダーの途中でデータが変化した場合、React は既に古くなったレンダー処理を最後まで終わらせるような無駄を省き、新しいレンダーを開始できます。純粋性のおかげで、いつ計算を中断しても問題ありません。

我々が開発する React の新たな機能は常に、関数の純粋性を活用しています。データ取得からアニメーション、パフォーマンスの向上に到るまで、React パラダイムの威力はコンポーネントを純関数に保つことによって発揮されるのです。

</DeepDive>

<Recap>

* コンポーネントは純粋である必要がある。すなわち：
  * **コンポーネントは自分の仕事に集中する**。レンダー前に存在していたオブジェクトや変数を書き換えない。
  * **入力が同じなら出力も同じ**。同じ入力に対しては、常に同じ JSX を返すようにする。
* レンダーはいつでも起こる可能性があるため、コンポーネントは相互の呼び出し順に依存してはいけない。
* コンポーネントがレンダーに使用する入力値を書き換えない。これには props、state、コンテクストも含まれる。画面を更新するためには既存のオブジェクトを書き換えるのではなく、代わりに [state を設定する](/learn/state-a-components-memory)。
* コンポーネントのロジックはできるだけコンポーネントが返す JSX の中で表現する。何かを「変える」必要がある場合、通常はイベントハンドラで行う。最終手段として `useEffect` を使用する。
* 純関数を書くことには訓練が必要だが、それにより React パラダイムの威力が発揮される。

</Recap>


  
<Challenges>

#### 壊れた時計を修理 {/*fix-a-broken-clock*/}

このコンポーネントは、深夜 0 時から朝 6 時までの間は `<h1>` の CSS クラスを `"night"` に、その他の時間帯は `"day"` に設定しようとしています。ですが失敗してしまっています。このコンポーネントを修正してみてください。

あなたの回答が機能しているかを確認するには、一時的にコンピュータのタイムゾーンを変更することで確認できます。現在の時刻が午前 0 時から 6 時までの場合、時計の色が反転するはずです！

<Hint>

レンダーは計算のみを行います。そこで何かを「行おう」としてはいけません。同じ意味を表現する別の方法はありますか？

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

`className` を計算してレンダーの出力に含めるようにすれば、このコンポーネントを修正できます。

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

この例では、副作用（DOM の変更）は全く必要ではありませんでした。単に JSX を返すだけで十分です。

</Solution>

#### 壊れたプロフィールを修正する {/*fix-a-broken-profile*/}

異なるデータを持つ 2 つの `Profile` コンポーネントが並んで表示されています。最初のプロファイルを折りたたみ (Collapse) してから展開 (Expand) してみてください。両方のプロファイルが同じ人物を表示することがわかります。これはバグです。

バグの原因を探し、修正してください。

<Hint>

バグがあるコードは `Profile.js` にあります。一番上から一番下まで読み通してください。

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

問題は、`Profile` コンポーネントが既存の `currentPerson` 変数に書き込み、`Header` と `Avatar` コンポーネントがそれを読み取っていることです。これにより、*これら 3 つのコンポーネントすべて*が不純なものとなり、予測困難となってしまっています。

バグを修正するには、`currentPerson` 変数を削除します。代わりに、`Header` と `Avatar` にすべての情報を props で伝えます。両コンポーネントで `person` プロパティを追加し、それを渡す必要があります。

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

React ではコンポーネント関数が何らかの特定の順序で実行されることは保証されていないため、変数を設定してコンポーネント間でデータをやりとりすることはできない、ということを覚えておきましょう。すべての通信は props を介して行う必要があります。

</Solution>

#### 壊れたストーリートレイを修正 {/*fix-a-broken-story-tray*/}

あなたの会社の CEO に、オンライン時計アプリに「ストーリー」を追加するよう要求され、ノーと言えない状況です。あなたは `StoryTray` コンポーネントを作成して、受け取った `stories` のリストを表示させ、末尾に "Create Story" というプレースホルダを表示することにしました。

"Create Story" プレースホルダーは、受け取った `stories` 配列にさらにフェイクのストーリーを 1 つ追加することで実装しました。しかし、どういうわけか "Create Story" が何度も表示されてしまっています。この問題を修正してください。

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

時計が更新されるたびに、"Create Story" が *2 回*追加されることに気づくと、レンダー中にミューテーションが発生していることがわかるでしょ。Strict Mode は、このような問題をより目立たせるために、コンポーネントを 2 回呼び出します。

問題は `StoryTray` 関数が純粋でないことです。受け取った `stories` 配列（props の一部です）に `push` を呼び出すことで、`StoryTray` がレンダーし始める*前に*作成されたオブジェクトをミューテートしてしまっています。これにより、バグや予測困難な動作につながります。

最も単純な修正方法は、受け取った配列を一切いじらず、"Creawte Story" を別にレンダーすることです。

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

あるいは、アイテムを追加する前に、（すでに存在する配列をコピーすることで）*新しい*配列を生成しても構いません。

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

これにより、あなたのミューテーションはローカルなものとなり、レンダー関数が純粋に保たれます。ただしまだ注意が必要です。たとえば、配列の既存のアイテムを変更したい場合、そのアイテム自体も複製する必要があるでしょう。

配列に対する操作のうちどれが配列の書き換えを伴い、どれが伴わないかを覚えておくことは有用です。例えば `push`、`pop`、`reverse`、`sort` は元の配列を書き換えてしまいますが、`slice`、`filter`、`map` は新しい配列を作成します。

</Solution>

</Challenges>
