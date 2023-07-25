---
title: "<input>"
---

<Intro>

[組み込みのブラウザ `<input>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) は、さまざまな種類のフォーム入力をレンダーすることができます。

```js
<input />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<input>` {/*input*/}

入力を表示するには、[組み込みのブラウザ `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) コンポーネントをレンダーします。

```js
<input name="myInput" />
```

[さらに例を見る](#usage)

#### Props {/*props*/}

`<input>` は全ての[共通要素である props](/reference/react-dom/components/common#props) をサポートしています。

以下の props を渡すことで、[入力を制御することができます。](#controlling-an-input-with-a-state-variable)

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): ブール値。チェックボックス入力またはラジオボタンの場合、選択されているかどうかを制御します。
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): 文字列。テキスト入力の場合、そのテキストを制御します。（ラジオボタンの場合は、フォームデータを指定します。）

これらのいずれかを渡す場合、渡された値を更新する `onChange` ハンドラも渡す必要があります。

以下の `<input>` の props は、制御されていない入力にのみ関連しています。

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): ブール値。`type="checkbox"` および `type="radio"` の入力の[初期値](#providing-an-initial-value-for-an-input)を指定します。 
* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): 文字列。テキスト入力の[初期値](#providing-an-initial-value-for-an-input)を指定します。

以下の `<input>` props は、制御されていない入力と制御された入力の両方に関連します。

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): 文字列。`type="file"` の入力によって受け取るファイルの種類を指定します。
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): 文字列。`type="image"` の入力によって代替画像テキストを指定します。
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): 文字列。`type="file"` 入力によってキャプチャされたメディア（マイク、ビデオ、またはカメラ）を指定します。
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): 文字列。可能な[オートコンプリート動作](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)の 1 つを指定します。
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): ブール値。`true` の場合、React はマウント時にその要素をフォーカスします。
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): 文字列。要素の文字方向性に対するフォームフィールド名を指定します。
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): ブール値。`true` の場合、入力はインタラクティブでなく、淡色表示されます。
* `children`: `<input>` は子要素を受け取りません。
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): 文字列。この入力が属する `<form>` の `id` を指定します。省略された場合、最も近い親フォームが対象となります。
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 文字列。`type="submit"` および `type="image"` の親要素である `<form action>` を上書きします。
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): 文字列。`type="submit"` および `type="image"` の親要素である `<form enctype>` を上書きします。
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): 文字列。`type="submit"` および `type="image"` の親要素である `<form method>` を上書きします。
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): 文字列。`type="submit"` および `type="image"` の親要素である `<form noValidate>` を上書きします。
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): 文字列。`type="submit"` および `type="image"` の親要素である `<form target>` を上書きします。
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): 文字列。`type="image"` の画像の高さを指定します。
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): 文字列。オートコンプリートオプションを持つ `<datalist>` の `id` を指定します。
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): 数値。数値および日時入力の最大値を指定します。
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): 数値。テキストおよびその他の入力の最大文字数を指定します。
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): 数値。数値および日時入力の最小値を指定します。
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): 数値。テキストおよびその他の入力の最小文字数を指定します。
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): ブール値。`<type="file"` および `type="email"` に複数の値を許可するかどうかを指定します。
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 文字列。[フォームで送信された](#reading-the-input-values-when-submitting-a-form)入力の名前を指定します。
* `onChange`: [`イベント`ハンドラ](/reference/react-dom/components/common#event-handler)関数。[制御された入力](#controlling-an-input-with-a-state-variable)に必要です。ユーザが入力の値を変更するとすぐに起動します（例えば、キーストロークごとに起動します）。ブラウザの [`入力`のイベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)と同じように作動します。
* `onChangeCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で起動する `onChange` のバージョン。
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`イベント`ハンドラ](/reference/react-dom/components/common#event-handler)関数。ユーザが値を変更するとすぐに起動します。歴史的な理由から、React では同様に動作する `onChange` を代わりに使用するのが慣用的です。
* `onInputCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で起動する `onInput` のバージョン。
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`イベント`ハンドラ](/reference/react-dom/components/common#event-handler) 関数。フォーム送信時の入力の検証に失敗した場合に起動します。組み込みの `invalid` イベントとは異なり、React の `onInvalid` イベントはバブリングします。
* `onInvalidCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で起動する `onInvalid` のバージョン。
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`イベント`ハンドラ](/reference/react-dom/components/common#event-handler) 関数。`<input>` 内の選択が変更された後に起動します。React は `onSelect` イベントを拡張して、空の選択および編集時（選択に影響する可能性がある場合）にも起動します。
* `onSelectCapture`: [キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で起動する `onSelect` のバージョン。
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): 文字列。`value` が一致する必要があるパターンを指定します。
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): 文字列。入力値が空の場合は淡色で表示されます。
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): ブール値。`true` の場合、ユーザは入力を編集できません。
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): ブール値。`true` の場合、フォームを送信するには値を指定する必要があります。
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): 数値。幅を設定と似ていますが、単位はコントロールによって異なります。
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): 文字列。`type="image"` 入力の、画像ファイルを指定します。
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): 正数または`'任意の'`文字列。有効な値間の距離を指定します。
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): 文字列。[入力タイプ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)の 1 つ。
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): 文字列。`type="image"` 入力の画像の幅を指定します。

#### 注意事項 {/*caveats*/}

- チェックボックスには `value` (または `defaultValue`) ではなく、`checked` (または `defaultChecked`) が必要です。
- テキスト入力が文字列 `value` プロパティを受け取った場合、それは [制御されているものとして扱われます。](#controlling-an-input-with-a-state-variable)
- チェックボックスまたはラジオボタンがブール値の `checked` プロパティを受け取った場合、それは [制御されているものとして扱われます。](#controlling-an-input-with-a-state-variable)
- 入力を、同時に制御、非制御コンポーネントの両方にすることはできません。
- 入力を、その存続期間内に、制御、非制御で切り替えることはできません。
- すべての制御された入力には、その前の値を同期的に更新する `onChange` イベントハンドラが必要です。

---

## 使用法 {/*usage*/}

### 様々なタイプの入力を表示する {/*displaying-inputs-of-different-types*/}

入力を表示するには、`<input>` コンポーネントをレンダーします。デフォルトではテキスト入力になります。チェックボックスの場合は `type="checkbox"`、ラジオボタンの場合は `type="radio"`、[または他の入力タイプのいずれか](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)を渡すことができます。

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

### 入力にラベルを付ける {/*providing-a-label-for-an-input*/}

通常、すべての `<input>` を [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) タグ内に配置します。これにより、ブラウザに対してこのラベルがその入力に関連付けられていることを伝えます。ユーザがラベルをクリックすると、ブラウザは自動的に入力にフォーカスを当てます。これはアクセシビリティにも重要です。スクリーンリーダーは、ユーザが関連付けられた入力にフォーカスしたとき、ラベルのキャプションを読み上げます。

`<input>` を `<label>` にネストできない場合は、同じ ID を `<input id>` と [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) に渡すことで関連付けます。また、同じコンポーネントの複数のインスタンス間の競合を避けるために、[`useId`.](/reference/react/useId) を使用してそのような ID を生成します。

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

### 入力の初期値を指定する {/*providing-an-initial-value-for-an-input*/}

オプションで、入力の初期値を指定することができます。テキスト入力の場合は、`defaultValue` として文字列を渡します。チェックボックスとラジオボタンの場合は、代わりに `defaultChecked` ブール値を使用して初期値を指定します。

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

### フォーム送信時に入力値を読み取る {/*reading-the-input-values-when-submitting-a-form*/}

入力の周囲に、[`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) を追加し、内部に [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) を配置します。これにより、`<form onSubmit>` のイベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在の URL に送信し、ページを更新します。`e.preventDefault()` を呼び出すことで、その動作を防ぐことができます。[`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) を使用してフォームデータを読み込みます。
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

すべての `<input>` に `name` を指定してください。例えば、`<input name="firstName" defaultValue="Taylor" />` のようにします。`{ firstName: "Taylor" }` のように、指定した `name` は、フォームデータのキーとして使用されます。

</Note>

<Pitfall>

デフォルトでは、`<form>` 内の *任意の* `<button>` で送信されます。これは予期せぬ事態になることがあります。独自のカスタム `Button` React コンポーネントがある場合は、`<button>` の代わりに [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) を返すことを検討してみてください。そして、フォームを送信するためのボタンには、明示的に `<button type="submit">` を使用してください。

</Pitfall>

---

### 状態変数を使用して入力要素を制御する {/*controlling-an-input-with-a-state-variable*/}

`<input />` のような入力は*制御されません*。`<input defaultValue="Initial text" />` のように[初期値を渡す](#providing-an-initial-value-for-an-input)場合でも、JSX は初期値を指定するだけで、現在の値を制御するものではありません。

**_controlled_ 入力をレンダーするには、それに `value` プロパティを渡します。（チェックボックスやラジオの場合は、`checked`）** React は、常に指定した `value` を入力が持つように強制します。通常、[状態変数](/reference/react/useState)を宣言することによってこれを行います。

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

制御された入力要素は、状態が必要な場合に意味があります。例えば、編集のたびに UI を再レンダーする必要がある場合などです。

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

また、制御された入力は、入力状態を調整するための複数の方法（例えば、ボタンをクリックすることによってなど）を提供したい場合にも役立ちます。

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

制御されたコンポーネントに渡す `value` は、`undefined` や `null` であってはなりません。初期値を空にしたい場合（例えば、以下の `firstName` フィールドのような場合）、状態変数を空の文字列（`''`）で初期化してください。

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

**`onChange` を指定せずに `value` を渡すと、入力欄に入力することができなくなります**。入力を `value` で制御すると、常に渡した値を*強制的に*持たせることになります。したがって、状態変数を `value` として渡したが、`onChange` イベントハンドラ内でその状態変数を同期的に更新し忘れると、React は入力をキーストロークごとに指定した `value` に戻してしまいます。

</Pitfall>

---

### キーストロークごとの再レンダーを最適化する {/*optimizing-re-rendering-on-every-keystroke*/}

制御された入力を使用する場合、キーストロークごとに状態が更新されます。状態を含むコンポーネントが大きなツリーを再レンダーすると、速度が遅くなる可能性があります。再レンダーのパフォーマンスを最適化する方法はいくつかあります。

例えば、キーストロークごとにすべてのページコンテンツを再レンダーするフォームがあるとします。

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

`<PageContent />` は入力の状態に依存しないため、入力の状態を独自のコンポーネントに移動できます。

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

再レンダーを回避する方法がない場合（例えば、`PageContent` が検索入力の値に依存する場合）、[`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) を使用することで、大規模な再レンダーの途中でも、制御された入力の応答性を維持できます。

---

## トラブルシューティング {/*troubleshooting*/}

### テキストを入力しても更新されない {/*my-text-input-doesnt-update-when-i-type-into-it*/}

`value` を指定して入力をレンダーし、`onChange` を指定しないと、コンソールにエラーが表示されます。

```js
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

エラーメッセージが示すように、[*初期*値を指定](#providing-an-initial-value-for-an-input)したいだけの場合は、代わりに `defaultValue` を渡してください。

```js
// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />
```

[状態変数を使用してこの入力を制御](#controlling-an-input-with-a-state-variable)したい場合は、`onChange` ハンドラを指定します。

```js
// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />
```

値を意図的に読み取り専用にする場合は、エラーを抑制するために `readOnly` プロパティを追加します。

```js
// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />
```

---

### チェックボックスをクリックしても更新されない {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

チェックボックスを `checked` だけでレンダーし、`onChange` が指定されていない場合、コンソールにエラーが表示されます。

```js
// 🔴 Bug: controlled checkbox with no onChange handler
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

エラーメッセージが示すように、もし単に[*初期*値を指定](#providing-an-initial-value-for-an-input) したかった場合は、代わりに `defaultChecked` を渡します。

```js
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />
```

[状態変数を使用してこのチェックボックスを制御](#controlling-an-input-with-a-state-variable)したい場合は、`onChange` ハンドラを指定します。

```js
// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

チェックボックスの場合は、`e.target.value` ではなく `e.target.checked` を読み取る必要があります。

</Pitfall>

チェックボックスが意図的に読み取り専用である場合は、エラーを抑制するために `readOnly` プロパティを追加します。

```js
// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

---

### 入力カーソルがキーストロークごとに先頭にジャンプしてしまう {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

[入力を制御する](#controlling-an-input-with-a-state-variable)場合は、`onChange` を使用して、DOM からの状態変数を入力の値に更新する必要があります。

`e.target.value` (チェックボックスの場合は `e.target.checked`) 以外のものに更新することはできません。

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  setFirstName(e.target.value.toUpperCase());
}
```

非同期的に更新することもできません。

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

コードを修正するには、それを `e.target.value` に同期的に更新します。

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
}
```

これで問題が解決しない場合は、キーストロークごとに入力が DOM から削除され、再追加されている可能性があります。これは、再レンダーするたびに誤って[状態をリセット](/learn/preserving-and-resetting-state)してしまっている場合に発生することがあります。例えば、入力またはその親の 1 つが常に異なる `key` 属性を受け取っている場合や、またはコンポーネント関数の定義をネストしている場合（この場合はサポートされておらず、「内部」コンポーネントが常に別のツリーとみなされます）などが挙げられます。

---

### "A component is changing an uncontrolled input to be controlled" というエラーが表示される {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


コンポーネントに `value` を指定した場合、その `value` は存続期間を通じて常に文字列である必要があります。

React はコンポーネントを非制御にするか制御するかを認識できないため、最初に `value={unknown}` を渡し、後で `value="some string"` を渡すことはできません。制御されるコンポーネントは、`null` または `unknown` ではなく、常に文字列 `value` を受け取る必要があります。

もし `value` が API や状態変数から取得される場合、初期値が `null` や `undefined` になる可能性があります。その場合は、初期値として空の文字列（`''`）を設定するか、`value={someValue ?? ''}` のようにして、`value` が文字列であることを確実にしてください。

同様に、チェックボックスに `checked` を渡す場合は、それが常にブール値であることを確認してください。
