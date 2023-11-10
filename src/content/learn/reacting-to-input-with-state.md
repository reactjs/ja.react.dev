---
title: state を使って入力に反応する
---

<Intro>

React は UI を操作するための宣言的な方法を提供します。UI の個々の部分を直接操作するのではなく、コンポーネントが取りうる異なる状態を記述し、ユーザの入力に応じてそれらの状態を切り替えます。これは、デザイナが UI について考える方法に似ています。

</Intro>

<YouWillLearn>

* 宣言型 UI プログラミングと命令型 UI プログラミングの違い
* コンポーネントが持ちうる様々な視覚状態を列挙する方法
* 異なる視覚状態間の変更をコードからトリガする方法

</YouWillLearn>

## 宣言型 UI と命令型 UI の比較 {/*how-declarative-ui-compares-to-imperative*/}

インタラクティブな UI を設計する際、ユーザのアクションに応じて UI がどのように*変化する*かを考えることが多いでしょう。たとえば、ユーザが回答を送信できるフォームを考えてみましょう。

* フォームに何かを入力すると、"Submit" ボタンが**有効になる**。
* "Submit" ボタンを押すと、フォームとボタンが**無効になり**、スピナが**表示される**。
* ネットワークリクエストが成功すると、フォームは**非表示になり**、お礼メッセージが**表示される**。
* ネットワークリクエストに失敗した場合、エラーメッセージが**表示され**、フォームが再び**有効になる**。

**命令型プログラミング**では、上記の変化がそのまま UI とのインタラクションの実装法に対応します。起こったことに応じて UI を操作するための命令そのものを書かなければならないのです。別の考え方をしてみましょう：車の中で隣に乗っている人に、曲がるたびに行き先を指示することを想像してみてください。

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In a car driven by an anxious-looking person representing JavaScript, a passenger orders the driver to execute a sequence of complicated turn by turn navigations." />

運転手はあなたがどこに行きたいのか知らず、ただあなたの指示に従うだけです。（そして、あなたの方向指示が間違っていたら、間違った場所に着いてしまいます！）これは*命令型*と呼ばれます。なぜなら、スピナからボタンに至るまで、個々の要素に対して直接命令し、コンピュータに*どのように* UI を更新するのか指示しているからです。

以下の命令型 UI プログラミングの例では、フォームは React を*使わずに*作成されています。ブラウザの [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) だけを利用しています。

<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

UI を命令的に操作することは、小さなサンプルではうまくいくかもしれませんが、より複雑なシステムでは指数関数的に難しくなります。例えばこのような様々なフォームでいっぱいのページを更新することを想像してみてください。新しい UI 要素や新しい操作方法を追加する場合、既存のすべてのコードを注意深くチェックして、バグ（例えば、何かを表示または非表示にすることを忘れていないか）を確認する必要があります。

React はこの問題を解決するために作られました。

React では、あなたが UI を直接操作することはありません。つまり、コンポーネントの有効化、無効化、表示、非表示を直接行うことはありません。代わりに、**表示したいものを宣言する**ことで、React が UI を更新する方法を考えてくれるのです。タクシーに乗ったとき、どこで曲がるかを正確に伝えるのではなく、どこに行きたいかを運転手に伝えることを思い浮かべてください。運転手はあなたをそこに連れていくのが仕事ですし、あなたが考えもしなかった近道も知っているかもしれません！

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## UI を宣言的に考える {/*thinking-about-ui-declaratively*/}

上記では、フォームを命令的に実装する方法を見てきました。React 的な思考法をより理解するために、以下でこの UI を React で再実装する方法を確認していきます。

1. コンポーネントの様々な視覚状態を**特定**する
2. それらの状態変更を引き起こすトリガを**決定**する
3. `useState` を使用してメモリ上に state を**表現**する
4. 必要不可欠でない state 変数をすべて**削除**する
5. イベントハンドラを**接続**して state を設定する

### Step 1: コンポーネントの様々な視覚状態を特定する {/*step-1-identify-your-components-different-visual-states*/}

コンピュータサイエンス用語で、複数の「状態」間を行き来する仕組みである[「ステートマシン」](https://en.wikipedia.org/wiki/Finite-state_machine) というものを聞いたことがあるかもしれません。あるいはデザイナと一緒に仕事をしていて、さまざまな「視覚状態」のモックアップを見たことがあるかもしれません。React はデザインとコンピュータサイエンスの交点に位置しているため、これら両方のアイデアがインスピレーションの源になります。

まず、ユーザが目にする可能性のある UI の様々な「状態」をすべて可視化する必要があります。

* **Empty**：フォームには無効な "Submit" ボタンがある。
* **Typing**：フォームには有効な "Submit" ボタンがある。
* **Submitting**：フォームは完全に無効化される。スピナが表示される。
* **Success**：フォームの代わりにお礼のメッセージが表示される。
* **Error**：Typing 状態と同様だがエラーメッセージも表示される。

デザイナのように、ロジックを追加する前に様々な状態の「モックアップ」を作成することをお勧めします。例えば、フォームの表示部分だけのモックを以下に示します。このモックはデフォルト値が `'empty'` の `status` という props によって制御されます。

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

その props の名前は何でも構いません。命名は重要ではありません。`status = 'empty'` を `status = 'success'` に編集して、正解というメッセージが表示されるのを確認してみてください。モックアップを使うことで、ロジックを結びつける前に、各 UI の状態を素早く確認することができます。上記のコンポーネントにもう少し肉付けしたプロトタイプを以下に示しますが、依然 `status` プロパティによって「制御」されています。

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### 多くの視覚状態を一度に表示する {/*displaying-many-visual-states-at-once*/}

コンポーネントが多くの視覚状態を持つ場合、それらをすべて 1 つのページに表示することが便利な場合があります。

<Sandpack>

```js App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

このようなページはしばしば "living styleguide" あるいは "storybook" と呼ばれます。

</DeepDive>

### Step 2: それらの状態変更を引き起こすトリガを決定する {/*step-2-determine-what-triggers-those-state-changes*/}

以下の 2 種類の入力に応答して、状態の更新をトリガすることができます。

* **人間からの入力**：例えばボタンをクリックする、フィールドに入力する、リンクをナビゲートするなど。
* **コンピュータからの入力**：例えばネットワークからのレスポンスが到着する、タイムアウトが起きる、画像が読み込まれるなど。

<IllustrationBlock>
  <Illustration caption="人間からの入力" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="コンピュータからの入力" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

いずれの場合も、**UI を更新するためには [state 変数](/learn/state-a-components-memory#anatomy-of-usestate)を設定する必要があります**。今回開発するフォームでは、いくつかの異なる入力に反応して状態を変更する必要があります。

* **テキスト入力フィールドの編集**（人間）により、テキストボックスが空かどうかによって、*Empty* 状態と *Typing* 状態を切り替える。
* **送信ボタンのクリック**（人間）により、*Submitting* 状態に切り替える。
* **ネットワーク応答の成功**（コンピュータ）により、*Success* 状態に切り替える。
* **ネットワーク応答の失敗**（コンピュータ）により、対応するエラーメッセージと共に *Error* 状態に切り替える。

<Note>

人間からの入力は、しばしば[イベントハンドラ](/learn/responding-to-events)を必要とすることに注意してください！

</Note>

このフローを視覚化するために、各状態を丸で囲んで紙に描き、2 つの状態間の変化を矢印として描くことを試してみてください。このようにして多くのフローを描き出すことで、実装のはるか前にバグを減らすことができます。

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Flow chart moving left to right with 5 nodes. The first node labeled 'empty' has one edge labeled 'start typing' connected to a node labeled 'typing'. That node has one edge labeled 'press submit' connected to a node labeled 'submitting', which has two edges. The left edge is labeled 'network error' connecting to a node labeled 'error'. The right edge is labeled 'network success' connecting to a node labeled 'success'.">

Form states

</Diagram>

</DiagramGroup>

### Step 3: `useState` を使用してメモリ上に state を表現する {/*step-3-represent-the-state-in-memory-with-usestate*/}

次に、[`useState`](/reference/react/useState) を使用してコンポーネントの視覚状態をメモリ内で表現する必要があります。シンプルさが鍵です。各 state は「動くパーツ」であり、**可能な限り「動くパーツ」を少なくすることが望ましいです**。複雑さが増すとバグも増えます！

まず*絶対に必要な* state から始めます。例えば、入力中の回答である `answer` を保存する必要があり、最後に起きたエラー（あれば）を保存するために `error` が必要です。

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

そして、どの視覚状態を表示させるかを表す state 変数が必要になります。通常、メモリ上でそれを表現する方法は 1 つではないので、実験してみる必要があります。

もし、すぐにベストな方法が思い浮かばない場合は、まず、考えられるすべての視覚状態を*確実*にカバーできる十分な数の state を追加することから始めてください。

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

最初のアイデアがベストでない可能性もありますが、それはそれで OK です。state のリファクタリングはプロセスの一部です！

### Step 4: 必要不可欠でない state 変数をすべて削除する {/*step-4-remove-any-non-essential-state-variables*/}

state の内容に重複がないようにし、本当に必要なものだけを管理するようにしたいです。state の構造をリファクタリングすることに少し時間をかけることで、コンポーネントが理解しやすくなり、重複が減り、想定外の意味を持つことがなくなります。目標は、**メモリ上の state がユーザに見せたい有効な UI を表現しないという状況を防ぐことです**。（例えば、エラーメッセージを表示すると同時に入力を無効化するようなことはあってはいけません。ユーザがエラーを修正できなくなってしまいます！）

自身の state 変数に関して以下のように自問してみるとよいでしょう。

* **この state で矛盾は生じないか？** 例えば、`isTyping` と `isSubmitting` の両方が `true` となることはありえません。矛盾がある state とは通常、state の制約が十分でないことを意味します。2 つのブール値の組み合わせは 4 通りありますが、有効な状態に対応するのは 3 つだけです。このような「ありえない」state を削除するためには、これらをまとめて、`typing`、`submitting`、または `success` の 3 つの値のうちどれかでなければならない `status` という 1 つの state にすればよいでしょう。
* **同じ情報が別の state 変数から入手できないか？** もうひとつの矛盾の原因は、`isEmpty` と `isTyping` が同時に `true` にならないことです。これらを別々の state 変数にすることで、同期がとれなくなり、バグが発生する危険性があります。幸い、`isEmpty` を削除して、代わりに `answer.length === 0` をチェックすることができます。
* **別の state 変数の逆を取って同じ情報を得られないか？** `isError` は不要です。なぜなら代わりに `error !== null` をチェックできるからです。

この削減後、3 つ（7 つから減りました！）の*必須* state 変数が残ります。

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

機能を壊さずにどれかを外すことはできないので、必要不可欠なものであることがわかります。

<DeepDive>

#### リデューサを用いて「ありえない」state を解消する {/*eliminating-impossible-states-with-a-reducer*/}

この 3 つの変数は、このフォームの状態を十分に表現しています。しかし、あまり意味をなさない中途半端な状態がまだ存在します。例えば、`status` が `success` の場合、`error` が null 以外になることは意味をなしません。state をより正確にモデル化するには、[リデューサに抽出することができます](/learn/extracting-state-logic-into-a-reducer)。リデューサを使えば、複数の state 変数を 1 つのオブジェクトに統一し、関連するロジックをすべて統合することができます！

</DeepDive>

### Step 5: イベントハンドラを接続して state を設定する {/*step-5-connect-the-event-handlers-to-set-state*/}

最後に、state を更新するイベントハンドラを作成します。以下に、すべてのイベントハンドラが接続された最終的なフォームを示します。

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

このコードは、元の命令型の例よりも長くなっていますが、はるかに壊れにくくなっています。すべてのインタラクションを state 変化として表現することで、既存の state を壊すことなく、後から新しい視覚状態を導入することができます。また、インタラクション自体のロジックを変更することなく、各 state で表示されるべきものを変更することができます。

<Recap>

* 宣言型プログラミングとは、UI を細かく管理する（命令型）のではなく、視覚状態ごとに UI を記述することを意味する。
* コンポーネントを開発するとき：
  1. コンポーネントの視覚状態をすべて特定する。
  2. 状態を変更するための人間およびコンピュータのトリガを決定する。
  3. `useState` で state をモデル化する。
  4. バグや矛盾を避けるため、不必要な state を削除する。
  5. state を設定するためのイベントハンドラを接続する。

</Recap>



<Challenges>

#### CSS クラスの追加・削除 {/*add-and-remove-a-css-class*/}

画像をクリックすると、外側の `<div>` から  `background--active` CSS クラスが削除され、`<img>` に `picture--active` クラスが追加されるようにしてください。もう一度背景をクリックすると、元の CSS クラスに戻るようにします。

視覚的には、画像の上をクリックすると、紫色の背景が消え、画像の境界線がハイライトされると考えてください。画像の外側をクリックすると、背景がハイライトされますが、画像の境界線のハイライトは削除されます。

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

このコンポーネントは、画像がアクティブなときと、画像が非アクティブなときの 2 つの視覚状態を持ちます。

* 画像がアクティブの場合、CSS クラスは `background` と `picture picture--active` となります。
* 画像が非アクティブの場合、CSS クラスは `background background--active` と `picture` になります。

画像がアクティブかどうかを記憶するためには、単一のブール型の state 変数があれば十分です。本来の作業は CSS クラスを削除または追加することでした。しかし、React では UI 要素を*操作*するのではなく、何を見たいのかを*記述*する必要があります。そのため、現在の state に基づいて両方の CSS クラスを計算する必要があります。また、画像のクリックが背景のクリックとしても処理されてしまわないように、[イベントの伝播を停止](/learn/responding-to-events#stopping-propagation)する必要があります。

画像をクリックしたりその外側をクリックしたりして、このバージョンが動作することを確認してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

あるいは、2 つの別々の JSX の塊を返すこともできます。

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

異なる 2 つの JSX の塊が同じツリーを記述する場合、それらのネスト（最初の `<div>` → 最初の `<img>`）は一致する必要があることに留意してください。そうでなければ、`isActive` を切り替えると、下のツリー全体が再作成され、[state がリセット](/learn/preserving-and-resetting-state)されてしまいます。このため、同じような JSX ツリーが両方のケースで返される場合は、1 つの JSX として記述する方が良いでしょう。

</Solution>

#### プロフィールエディタ {/*profile-editor*/}

以下は、プレーンな JavaScript と DOM で実装した小さなフォームです。このフォームをいじってみて、その動作を理解してください。

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

このフォームは、編集モードでは入力フィールド、閲覧モードでは入力結果のみが表示される、というように 2 つのモードを切り替えて動作します。ボタンのラベルは、モードによって "Edit" と "Save" が切り替わります。入力内容を変更すると、下部のウェルカムメッセージがリアルタイムで更新されます。

あなたのタスクは、これを以下のサンドボックス内で React で再実装することです。作業しやすいようにマークアップはすでに JSX に変換されていますが、元のコードと同様に入力フィールドの表示と非表示を行う必要があります。

また、下部のテキストもちゃんと更新されるようにしてください！

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

入力値を保持するために `firstName` と `lastName` の 2 つの state 変数が必要になります。また、入力フィールドを表示するかどうかを管理する `isEditing` state 変数も必要になります。`fullName` 変数は必要*ありません*。なぜなら、フルネームは常に `firstName` と `lastName` から計算できるからです。

最後に、[条件付きレンダー](/learn/conditional-rendering)を使用して、`isEditing` に応じて入力フィールドを表示したり非表示にしたりする必要があります。

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

この解決策と元の命令型のコードを比較してみてください。どう違うでしょうか？

</Solution>

#### React を使わない命令型コードのリファクタリング {/*refactor-the-imperative-solution-without-react*/}

こちらはひとつ前のチャレンジで、React を使わずに命令的に記述されたオリジナルのサンドボックスです。

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

React が存在しなかったと想像してください。このコードをリファクタリングして、ロジックを壊れにくくし、React のバージョンに近づけることはできるでしょうか？ React のように state が明示的であれば、どのように見えるでしょうか？

何から手をつければいいのか悩んでいる人は、下のスタブですでにほとんどの構造ができています。ここから始める場合は、`updateDOM` 関数で足りないロジックを埋めてください。（必要に応じて元のコードを参照してください。）

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

足りないロジックは、入力フィールドとコンテンツの表示の切り替え、ラベルの更新などでした。

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

あなたが書いた `updateDOM` 関数は、state を設定したときに React が水面下で何をするのかを示しています。（ただし、React は前回設定したときから変化していないプロパティについては DOM に触れないようにもしています。)

</Solution>

</Challenges>
