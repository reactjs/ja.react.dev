---
title: "<select>"
---

<Intro>

[ブラウザ組み込みの `<select>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)を利用することで、選択肢を含むセレクトボックスをレンダーすることができます。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<select>` {/*select*/}

セレクトボックスを表示するためには、[ブラウザ組み込みの `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) コンポーネントをレンダーします。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<select>` は[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

`value` プロパティを渡すことで、[セレクトボックスを制御されたコンポーネント (controlled component)](#controlling-a-select-box-with-a-state-variable) にできます。

* `value`: 文字列（または [`multiple={true}`](#enabling-multiple-selection) の場合は文字列の配列）。どのオプションが選択されているかを制御します。それぞれの value 文字列は、`<select>` 内にネストされたいずれかの `<option>` の `value` と一致します。

`value` を渡す場合は、渡された値を更新する `onChange` ハンドラも渡す必要があります。

もし `<select>` を非制御コンポーネント (uncontrolled component) として使用する場合は、代わりに `defaultValue` プロパティを渡すことができます。

* `defaultValue`: 文字列（または [`multiple={true}`](#enabling-multiple-selection) の場合は文字列の配列）。[デフォルトのオプションを指定](#providing-an-initially-selected-option) します。

以下の `<select>` の props は、非制御セレクトボックスと制御されたセレクトボックスの両方で用いられます。

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): 文字列。可能な[オートコンプリート動作](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)の 1 つを指定します。
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): ブーリアン。`true` の場合、React は要素をマウント時にフォーカスします。
* `children`: `<select>` は [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option)、[`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)、[`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) コンポーネントを子として受け入れます。カスタムコンポーネントを渡しても構いませんが、その場合は最終的に上記のコンポーネントのいずれかにレンダーされる必要があります。`<option>` タグを最終的にレンダーする独自のコンポーネントを渡す場合、レンダーする各 `<option>` には `value` が必要です。
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): ブーリアン。`true` の場合、セレクトボックスはインタラクティブではなくなり、薄暗く表示されます。 
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): 文字列。このセレクトボックスが属する `<form>` 要素の `id` を指定します。省略した場合、最も近い親フォームが対象となります。
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): ブーリアン。`true` の場合、ブラウザで[複数選択](#enabling-multiple-selection)が可能になります。
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): 文字列。[フォームとともに送信される](#reading-the-select-box-value-when-submitting-a-form)この選択ボックスの名前を指定します。 
* `onChange`: [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。[制御されたセレクトボックス](#controlling-a-select-box-with-a-state-variable)では必要です。ユーザが別のオプションを選択したときに即座に発火します。ブラウザの [`input` イベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)と同様に動作します。
* `onChangeCapture`: `onChange` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョンです。
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。ユーザによって値が変更されたときに即座に発火します。歴史的な理由から、React では代わりに同様の動作をする `onChange` を使用するのが慣習となっています。
* `onInputCapture`: `onInput` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョンです。
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。フォームの送信時に入力の検証に失敗した場合に発火します。組み込みの `invalid` イベントとは異なり、React の `onInvalid` イベントはバブルします。
* `onInvalidCapture`: `onInvalid` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョンです。
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): ブーリアン。`true` の場合、フォームを送信する際に値の指定を必須にします。
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): 数値。`multiple={true}` となっている選択ボックスにおける最初に表示させたい項目の数を指定します。

#### 注意点 {/*caveats*/}

- HTML とは異なり、`<option>` に `selected` 属性を渡すことはサポートされていません。代わりに、非制御のセレクトボックスには [`<select defaultValue>`](#providing-an-initially-selected-option) を使用し、制御されたセレクトボックスには [`<select value>`](#controlling-a-select-box-with-a-state-variable) を使用します。
- セレクトボックスに `value` プロパティが渡されると、[制御されたコンポーネントとして扱われます](#controlling-a-select-box-with-a-state-variable)。
- セレクトボックスは制御されたコンポーネントと非制御コンポーネントに同時になることはできません。
- セレクトボックスは、ライフタイム中に制御されたコンポーネントから非制御コンポーネント、またはその逆に切り替えることはできません。
- すべての制御されたセレクトボックスには、制御に使っている state を同期的に更新するための `onChange` イベントハンドラが必要です。

---

## 使用法 {/*usage*/}

### 選択肢を含むセレクトボックスを表示する {/*displaying-a-select-box-with-options*/}

`<option>` コンポーネントのリストを内部に含む `<select>` をレンダーして、セレクトボックスを表示します。各 `<option>` に、フォームで送信されるデータを表す `value` を指定してください。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### セレクトボックスにラベルを付ける {/*providing-a-label-for-a-select-box*/}

通常、すべての `<select>` は [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) タグ内に配置します。これにより、ブラウザに対してこのラベルがそのセレクトボックスに関連付けられていることが伝わります。ユーザがラベルをクリックすると、ブラウザは自動的にセレクトボックスにフォーカスします。これはアクセシビリティの観点からも重要です。ユーザがセレクトボックスにフォーカスすると、スクリーンリーダがラベルのキャプションを読み上げます。

もし `<label>` 内に `<select>` をネストできない場合は、同じ ID を `<select id>` と [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) に渡すことで関連付けることができます。同一コンポーネントの複数のインスタンス間での競合を避けるために、[`useId`](/reference/react/useId) を使用してそのような ID を生成してください。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Pick a fruit:
        <select name="selectedFruit">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Pick a vegetable:
      </label>
      <select id={vegetableSelectId} name="selectedVegetable">
        <option value="cucumber">Cucumber</option>
        <option value="corn">Corn</option>
        <option value="tomato">Tomato</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### デフォルトのオプションを指定する {/*providing-an-initially-selected-option*/}

デフォルトでは、ブラウザはリスト内の最初の `<option>` を選択します。異なるオプションをデフォルトで選択する場合は、その `<option>` の `value` を `<select>` 要素の `defaultValue` として渡します。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

HTML とは異なり、個々の `<option>` に `selected` 属性を渡すことはサポートされていません。

</Pitfall>

---

### 複数選択を有効にする {/*enabling-multiple-selection*/}

複数のオプションを選択できるようにするには、`<select>` に `multiple={true}` を渡します。さらに初期選択オプションを指定するために `defaultValue` を渡したい場合は、配列にする必要があります。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick some fruits:
      <select
        name="selectedFruit"
        defaultValue={['orange', 'banana']}
        multiple={true}
      >
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### フォーム送信時にセレクトボックスから値を読み取る {/*reading-the-select-box-value-when-submitting-a-form*/}

セレクトボックスを [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) で囲み、その中に [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) を配置します。これにより、`<form onSubmit>` イベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在の URL に送信し、ページを更新します。`e.preventDefault()` を呼び出すことで、その振る舞いをオーバーライドできます。[`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) を使用してフォームデータを読み込みます。
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });
    // You can generate a URL out of it, as the browser does by default:
    console.log(new URLSearchParams(formData).toString());
    // You can work with it as a plain object.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) This doesn't include multiple select values
    // Or you can get an array of name-value pairs.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Pick your favorite fruit:
        <select name="selectedFruit" defaultValue="orange">
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        Pick all your favorite vegetables:
        <select
          name="selectedVegetables"
          multiple={true}
          defaultValue={['corn', 'tomato']}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <button type="reset">Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

`<select>` に `name` を指定してください。例えば `<select name="selectedFruit" />` のように指定します。指定した `name` はフォームデータ内のキーとして使用されます。例えば、`{ selectedFruit: "orange" }` のようになります。

`<select multiple={true}>` を使用すると、フォームから読み取った [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) には、選択されたそれぞれの値が個別に名前と値のペアとして含まれます。上記の例のコンソールログをよく確認してください。

</Note>

<Pitfall>

デフォルトでは、`<form>` 内の*あらゆる* `<button>` はフォームの送信を行います。これは予想外の挙動かもしれません！ 独自のカスタム `Button` React コンポーネントを利用している場合は、`<button>` の代わりに [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) を返すようにすることを考慮してください。そしてフォームを送信することが*意図されている*ボタンには明示的に `<button type="submit">` を使用してください。

</Pitfall>

---

### state 変数を使ってセレクトボックスを制御する {/*controlling-a-select-box-with-a-state-variable*/}

`<select />` のようなセレクトボックスは*非制御*です。たとえ `<select defaultValue="orange" />` のように[デフォルトのオプションを指定](#providing-an-initially-selected-option)している場合でも、この JSX で指定しているのはあくまで初期値であって現在の値ではありません。

***制御された*セレクトボックスをレンダーするには、`value` プロパティを渡してください**。React はセレクトボックスが常に渡した `value` を反映するようにします。通常、[state 変数](/reference/react/useState)を宣言することでセレクトボックスを制御します。

```js {2,6,7}
function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange'); // Declare a state variable...
  // ...
  return (
    <select
      value={selectedFruit} // ...force the select's value to match the state variable...
      onChange={e => setSelectedFruit(e.target.value)} // ... and update the state variable on any change!
    >
      <option value="apple">Apple</option>
      <option value="banana">Banana</option>
      <option value="orange">Orange</option>
    </select>
  );
}
```

これは、選択毎に UI の一部を再レンダーしたい場合に便利です。

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [selectedFruit, setSelectedFruit] = useState('orange');
  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);
  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <hr />
      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>
      <hr />
      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**`onChange` を指定せずに `value` を渡すと、オプションを選択することができなくなります**。セレクトボックスに `value` を渡して制御を行うと、渡した値でセレクトボックスを*強制的に固定*することになります。したがって、state 変数を `value` として渡しても、`onChange` イベントハンドラ内でその state 変数を同期的に更新するのを忘れた場合、React はセレクトボックスを、キーストローク毎に指定した `value` に戻してしまいます。

HTML とは異なり、個々の `<option>` に `selected` 属性を渡すことはサポートされていません。

</Pitfall>
