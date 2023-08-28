---
title: "<input>"
---

<Intro>

[ブラウザ組み込みの `<input>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)を利用することで、さまざまな種類のフォーム入力をレンダーすることができます。

```js
<input />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<input>` {/*input*/}

入力欄を表示するには、[組み込みのブラウザ `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) コンポーネントをレンダーします。

```js
<input name="myInput" />
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<input>` は[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

以下の props を渡すことで、[入力欄を制御されたコンポーネント (controlled component)](#controlling-an-input-with-a-state-variable) にできます。

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): ブーリアン。チェックボックスまたはラジオボタンの場合、選択されているかどうかを制御します。
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): 文字列。テキスト入力の場合、そのテキストを制御します。（ラジオボタンの場合は、フォームデータを指定します。）

これらのいずれかを渡す場合は、渡された値を更新する `onChange` ハンドラも渡す必要があります。

これらの `<input>` の props は、非制御 (uncontrolled) の入力欄にのみ使用されます。

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): ブーリアン。`type="checkbox"` および `type="radio"` の入力欄の場合に、[初期値](#providing-an-initial-value-for-an-input)を指定します。 
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): 文字列。テキスト入力の場合に、[初期値](#providing-an-initial-value-for-an-input)を指定します。

これらの `<input>` の props は、非制御の入力欄と制御された入力欄の両方で用いられます。

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): 文字列。`type="file"` である入力欄が受け付けるファイルの種類を指定します。
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): 文字列。`type="image"` である入力欄の場合に、代替画像テキストを指定します。
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): 文字列。`type="file"` である入力欄がキャプチャするメディア（マイク、ビデオ、またはカメラ）を指定します。
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): 文字列。可能な[オートコンプリート動作](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)の 1 つを指定します。
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): ブーリアン。`true` の場合、React はマウント時にその要素をフォーカスします。
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): 文字列。要素の文字方向に対するフォームフィールド名を指定します。
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): ブール値。`true` の場合、入力はインタラクティブではなくなり、薄暗く表示されます。
* `children`: `<input>` は子要素を受け取りません。
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): 文字列。この入力が属する `<form>` の `id` を指定します。省略された場合、最も近い親フォームが対象となります。
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 文字列。`type="submit"` および `type="image"` の場合、親要素の `<form action>` を上書きします。
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): 文字列。`type="submit"` および `type="image"` の場合、親要素の `<form enctype>` を上書きします。
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): 文字列。`type="submit"` および `type="image"` の場合、親要素の `<form method>` を上書きします。
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): 文字列。`type="submit"` および `type="image"` の場合、親要素の `<form noValidate>` を上書きします。
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): 文字列。`type="submit"` および `type="image"` の場合、`<form target>` を上書きします。
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): 文字列。`type="image"` の場合、画像の高さを指定します。
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): 文字列。オートコンプリートの選択肢を指定する `<datalist>` の `id` を指定します。
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): 数値。数値および日時タイプの入力欄において最大値を指定します。
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): 数値。テキストなどのタイプの入力欄において最大文字数を指定します。
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): 数値。数値および日時タイプの入力欄において最小値を指定します。
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): 数値。テキストなどのタイプの入力欄において最小文字数を指定します。
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): ブール値。`type="file"` および `type="email"` の場合、複数の値を許可するかどうかを指定します。
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 文字列。[フォームで送信される](#reading-the-input-values-when-submitting-a-form)際に使われるこの入力欄の名前を指定します。
* `onChange`: [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。[制御された入力](#controlling-an-input-with-a-state-variable)の場合は必須。ユーザが入力の値を変更するとすぐに発火します（例えば、キーストロークごとに発火します）。ブラウザの [`input` イベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)と同じように動作します。
* `onChangeCapture`: `onChange` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。ユーザが値を変更するとすぐに発火します。歴史的な理由から、React では代わりに同様の動作をする `onChange` を使用するのが慣習となっています。
* `onInputCapture`: `onInput` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。フォームの送信時に入力の検証に失敗した場合に発火します。組み込みの `invalid` イベントとは異なり、React の `onInvalid` イベントはバブルします。
* `onInvalidCapture`: `onInvalid` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。`<input>` 内で選択テキストが変更された後に発火します。React は `onSelect` イベントを拡張しており、空の選択やテキストの編集（選択に影響を与える可能性がある）でも発火します。
* `onSelectCapture`: `onSelect` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): 文字列。`value` がマッチする必要のあるパターンを指定します。
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): 文字列。入力値が空の場合、これが薄い色で表示されます。
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): ブーリアン。`true` の場合、入力欄はユーザによって編集できなくなります。
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): ブーリアン。`true` の場合、フォームを送信するためには値が必須となります。
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): 数値。width の設定と似ていますが、入力欄によって異なる単位で指定します。
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): 文字列。`type="image"` の入力の場合、画像ファイルを指定します。
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): 正の数値、または文字列の `'any'`。有効な値の間隔を指定します。
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): 文字列。[入力タイプ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)の 1 つ。
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): 文字列。`type="image"` の場合、画像の幅を指定します。

#### 注意点 {/*caveats*/}

- チェックボックスの場合 `value`（や `defaultValue`）ではなく、`checked`（や `defaultChecked`）が必要です。
- テキスト入力欄が props として文字列型の `value` プロパティを受け取ると、[制御されたものとして扱われます](#controlling-an-input-with-a-state-variable)。
- チェックボックスまたはラジオボタンが props としてブーリアン型の `checked` を受け取ると、[制御されたものとして扱われます](#controlling-an-input-with-a-state-variable)。
- 入力欄は制御されたコンポーネントと非制御コンポーネントに同時になることはできません。。
- 入力欄は、ライフタイム中に制御されたコンポーネントから非制御コンポーネント、またはその逆に切り替えることはできません。
- すべての制御された入力欄には、制御に使っている state を同期的に更新するための `onChange` イベントハンドラが必要です。

---

## 使用法 {/*usage*/}

### 各種の入力欄を表示する {/*displaying-inputs-of-different-types*/}

入力欄を表示するには、`<input>` コンポーネントをレンダーします。デフォルトではテキスト入力になります。チェックボックスの場合は `type="checkbox"` を、ラジオボタンの場合は `type="radio"` を、[または他の入力タイプのいずれか](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)を渡すことができます。

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### 入力欄にラベルを付ける {/*providing-a-label-for-an-input*/}

通常、すべての `<input>` は [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) タグ内に配置します。これにより、ブラウザに対してこのラベルがその入力欄に関連付けられていることが伝わります。ユーザがラベルをクリックすると、ブラウザは自動的に入力欄にフォーカスします。これはアクセシビリティの観点からも重要です。ユーザが入力欄にフォーカスすると、スクリーンリーダがラベルのキャプションを読み上げます。

もし `<label>` 内に `<input>` をネストできない場合は、同じ ID を `<input id>` と [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) に渡すことで関連付けることができます。同一コンポーネントの複数のインスタンス間での競合を避けるために、[`useId`](/reference/react/useId) を使用してそのような ID を生成してください。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### 入力欄に初期値を指定する {/*providing-an-initial-value-for-an-input*/}

オプションで、入力値の初期値を指定することができます。テキスト入力の場合は、`defaultValue` として文字列を渡してください。チェックボックスとラジオボタンの場合は、代わりにブーリアンの `defaultChecked` を使用して初期値を指定してください。

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### フォーム送信時に入力欄から値を読み取る {/*reading-the-input-values-when-submitting-a-form*/}

入力欄を [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) で囲み、その中に [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) を配置します。これにより、`<form onSubmit>` イベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在の URL に送信し、ページを更新します。`e.preventDefault()` を呼び出すことで、その振る舞いをオーバーライドできます。[`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) を使用してフォームデータを読み込みます。
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

すべての `<input>` に `name` を指定してください。例えば、`<input name="firstName" defaultValue="Taylor" />` のように指定します。指定した `name` は、フォームデータ内のキーとして使用されます。例えば、`{ firstName: "Taylor" }` のようになります。

</Note>

<Pitfall>

デフォルトでは、`<form>` 内の*あらゆる* `<button>` はフォームの送信を行います。これは予想外の挙動かもしれません！ 独自のカスタム `Button` React コンポーネントを利用している場合は、`<button>` の代わりに [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) を返すようにすることを考慮してください。そしてフォームを送信することが*意図されている*ボタンには明示的に `<button type="submit">` を使用してください。

</Pitfall>

---

### state 変数を使用して入力要素を制御する {/*controlling-an-input-with-a-state-variable*/}

`<input />` のような入力欄は*非制御*です。`<input defaultValue="Initial text" />` のように[デフォルト値を指定](#providing-an-initial-value-for-an-input)している場合でも、この JSX で指定しているのはあくまで初期値であって現在の値ではありません。

***制御された*入力欄をレンダーするには、`value` プロパティ（チェックボックスやラジオボタンの場合は `checked`）を渡してください**。React は入力欄が常に渡した `value` を反映するようにします。通常、[state 変数](/reference/react/useState)を宣言することで入力欄を制御します。

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare a state variable...
  // ...
  return (
    <input
      value={firstName} // ...force the input's value to match the state variable...
      onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

例えば編集のたびに UI を再レンダーする必要があるなどの理由でいずれにせよ state が必要な場合、制御された入力欄は特に有用です。

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

また、制御された入力欄は、入力 state を変更する方法（例えばボタンクリックなど）を複数提供したい場合にも役立ちます。

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

制御されたコンポーネントに渡す `value` は、`undefined` や `null` であってはなりません。初期値を空にしたい場合（例えば、以下の `firstName` フィールドのような場合）、state 変数を空の文字列 (`''`) で初期化してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**`onChange` を指定せずに `value` を渡すと、入力欄に入力することができなくなります**。入力欄に `value` を渡して制御を行うと、渡した値で入力欄を*強制的に固定*することになります。したがって、state 変数を `value` として渡しても、`onChange` イベントハンドラ内でその state 変数を同期的に更新するのを忘れた場合、React は入力欄を、キーストローク毎に指定した `value` に戻してしまいます。

</Pitfall>

---

### キーストロークごとの再レンダーを最適化する {/*optimizing-re-rendering-on-every-keystroke*/}

制御された入力欄を使用する場合、キーストロークごとに state のセットが行われます。state を含んだコンポーネントが大きなツリーを再レンダーする場合、速度が遅くなる可能性があります。再レンダー時のパフォーマンスを最適化する方法がいくつかあります。

例えば、キーストロークごとにページ内コンテンツをすべて再レンダーするフォームがあるとしましょう。

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

`<PageContent />` は入力値の state に依存していないため、入力値 state を独立したコンポーネントに移動できます。

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

これにより、キーストロークごとに `SignupForm` のみが再レンダーされるため、パフォーマンスが大幅に向上します。

再レンダーを回避する方法がない場合（例えば、`PageContent` が検索ボックスの入力値に依存する場合）、[`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) を使用することで、巨大な再レンダーの途中でも、制御された入力欄の応答性を維持できます。

---

## トラブルシューティング {/*troubleshooting*/}

### テキスト入力欄にタイプしても内容が更新されない {/*my-text-input-doesnt-update-when-i-type-into-it*/}

`value` があるが `onChange` のない入力欄をレンダーすると、コンソールにエラーが表示されます。

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

エラーメッセージが示すように、[*初期値*を指定したいだけの場合](#providing-an-initial-value-for-a-text-area)は、代わりに `defaultValue` を渡すようにしてください。

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

[state 変数でこの入力欄を制御したい場合](#controlling-an-input-with-a-state-variable)は、`onChange` ハンドラを指定してください。

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

値を意図的に読み取り専用にしたい場合は、エラーを抑制するために props として `readOnly` を追加してください。

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### チェックボックスをクリックしても更新されない {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

`checked` があるが `onChange` のないチェックボックスをレンダーすると、コンソールにエラーが表示されます。

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

エラーメッセージが示すように、[*初期値*を指定したいだけの場合](#providing-an-initial-value-for-an-input)は、代わりに `defaultChecked` を渡すようにしてください。

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

[state 変数でこのチェックボックスを制御したい場合](#controlling-an-input-with-a-state-variable)は、`onChange` ハンドラを指定してください。

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

チェックボックスの場合は、`e.target.value` ではなく `e.target.checked` を読み取る必要があります。

</Pitfall>

チェックボックスを意図的に読み取り専用にしたい場合は、エラーを抑制するために props として `readOnly` を追加してください。

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### キーストロークごとに入力欄のカーソルが先頭に戻る {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

入力欄を[制御する](#controlling-a-text-area-with-a-state-variable)場合、`onChange` 中でその state 変数を DOM からやってくる入力欄の値に更新する必要があります。

state を `e.target.value`（チェックボックスの場合は `e.target.checked`）以外のものに更新することはできません。

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

また、非同期に更新することもできません。

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

コードを修正するには、state を `e.target.value` の値に同期的に更新します。

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

これで問題が解決しない場合、入力欄がキーストロークごとに DOM から削除・再追加されている可能性があります。これは、再レンダーごとに state を誤って[リセット](/learn/preserving-and-resetting-state)している場合に起こります。例えば、入力欄またはその親が常に異なる `key` 属性を受け取っている可能性や、コンポーネント定義をネストしている（これは React では許されておらず、「内側」のコンポーネントがレンダー時に再マウントさえることになります）可能性があります。

---

### "A component is changing an uncontrolled input to be controlled" というエラーが発生する {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


コンポーネントに `value` を渡す場合、そのライフサイクル全体を通じて文字列型でなければなりません。

最初に `value={undefined}` を渡しておき、後で `value="some string"` を渡すようなことはできません。なぜなら、React はあなたがコンポーネントを非制御コンポーネントと制御されたコンポーネントのどちらにしたいのか分からなくなるからです。制御されたコンポーネントは常に文字列の `value` を受け取るべきであり、`null` や `undefined` であってはいけません。

あなたの `value` が API や state 変数から来ている場合、それが `null` や `undefined` に初期化されているかもしれません。その場合、まず空の文字列（`''`）にセットするか、`value` が文字列であることを保証するために `value={someValue ?? ''}` を渡すようにしてください。

同様に、チェックボックスに `checked` を渡す場合は、常にブーリアン型であることを確認してください。
