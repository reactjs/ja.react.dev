---
title: "<textarea>"
---

<Intro>

[ブラウザ組み込みの `<textarea>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) を利用することで、複数行のテキスト入力エリアをレンダーすることができます。

```js
<textarea />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<textarea>` {/*textarea*/}

テキストエリアを表示するためには、[ブラウザ組み込みの `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) コンポーネントをレンダーします。

```js
<textarea name="postContent" />
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<textarea>` は[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

`value` プロパティを渡すことで、[テキストエリアを制御されたコンポーネント (controlled component)](#controlling-a-text-area-with-a-state-variable) にできます。

* `value`: 文字列。テキストエリア内のテキストを制御します。

`value` を渡す場合は、渡された値を更新する `onChange` ハンドラも渡す必要があります。

もし `<textarea>` を非制御コンポーネント (uncontrolled component) として使用する場合は、代わりに `defaultValue` プロパティを渡すことができます。

* `defaultValue`: 文字列。テキストエリアの[初期値](#providing-an-initial-value-for-a-text-area)を指定します。

これらの `<textarea>` の props は、非制御のテキストエリアと制御されたテキストエリアの両方で用いられます。

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autocomplete): `'on'` または `'off'`。オートコンプリートの挙動を指定します。
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autofocus): ブーリアン。`true` の場合、React はマウント時にこの要素にフォーカスします。
* `children`: `<textarea>` には子要素を指定できません。初期値を設定するには `defaultValue` を使用します。
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-cols): 数値。デフォルトの幅を平均文字幅で指定します。デフォルトは `20` です。
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-disabled): ブーリアン。`true` の場合、入力エリアは操作不可能になり、表示が暗くなります。
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-form): 文字列。この入力が属する `<form>` の `id` を指定します。省略された場合、最も近い親のフォームとなります。
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-maxlength): 数値。テキストの最大長を指定します。
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-minlength): 数値。テキストの最小長を指定します。
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 文字列。[フォームで送信される](#reading-the-textarea-value-when-submitting-a-form)この入力エリアの名前を指定します。
* `onChange`: [`Event` ハンドラ](/reference/react-dom/components/common#event-handler) 関数。[制御されたテキストエリア](#controlling-a-text-area-with-a-state-variable)では必須。ユーザによって入力値が変更されるとすぐに発火します（例えば、各キーストロークで発火します）。ブラウザの [`input` イベント](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) と同様に動作します。
* `onChangeCapture`: `onChange` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。ユーザによって値が変更されるとすぐに発火します。歴史的な理由から、React では同様に動作する `onChange` を使用するのが慣例です。
* `onInputCapture`: `onInput` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。フォームの送信時に入力が検証に失敗した場合に発火します。組み込みの `invalid` イベントとは異なり、React の `onInvalid` イベントはバブリングします。
* `onInvalidCapture`: `onInvalid` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [`Event` ハンドラ](/reference/react-dom/components/common#event-handler)関数。`<textarea>` 内で選択テキストが変更された後に発火します。React は `onSelect` イベントを拡張しており、空の選択やテキストの編集（選択に影響を与える可能性がある）でも発火します。
* `onSelectCapture`: `onSelect` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-placeholder): 文字列。テキストエリアの値が空の場合、これが薄い色で表示されます。
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-readonly): ブーリアン。`true` の場合、テキストエリアはユーザによって編集できなくなります。
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-required): ブーリアン。`true` の場合、フォームを送信するためには値が必須となります。
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-rows): 数値。デフォルトの高さを平均文字高での指定します。デフォルトは `2` です。
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-wrap): `'hard'`、`'soft'`、または `'off'`。フォームを送信するときにテキストがどのように折り返されるかを指定します。

#### 注意点 {/*caveats*/}

- `<textarea>something</textarea>` のように子要素を渡すことはできません。[初期内容の指定には `defaultValue` を使用してください](#providing-an-initial-value-for-a-text-area)。
- テキストエリアが props として文字列型の `value` を受け取ると、[制御されたテキストエリアとして扱われます](#controlling-a-text-area-with-a-state-variable)。
- テキストエリアは制御されたコンポーネントと非制御コンポーネントに同時になることはできません。。
- テキストエリアは、ライフタイム中に制御されたコンポーネントから非制御コンポーネント、またはその逆に切り替えることはできません。
- すべての制御されたテキストエリアには、制御に使っている state を同期的に更新するための `onChange` イベントハンドラが必要です。

---

## 使用法 {/*usage*/}

### テキストエリアを表示する {/*displaying-a-text-area*/}

テキストエリアを表示するには、`<textarea>` をレンダーします。そのデフォルトのサイズは [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) と [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) 属性で指定できますが、デフォルトではユーザがそれをリサイズできます。リサイズを無効にするには、CSS で `resize: none` を指定します。

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### テキストエリアにラベルを付ける {/*providing-a-label-for-a-text-area*/}

通常、すべての `<textarea>` は [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) タグ内に配置します。これにより、ブラウザに対してこのラベルがそのテキストエリアに関連付けられていることが伝わります。ユーザがラベルをクリックすると、ブラウザは自動的にテキストエリアにフォーカスします。これはアクセシビリティの観点からも重要です。ユーザがテキストエリアにフォーカスすると、スクリーンリーダがラベルのキャプションを読み上げます。

もし `<label>` 内に `<textarea>` をネストできない場合は、同じ ID を `<textarea id>` と [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) に渡すことで関連付けることができます。同一コンポーネントの複数のインスタンス間での競合を避けるために、[`useId`](/reference/react/useId) を使用してそのような ID を生成してください。

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### テキストエリアに初期値を指定する {/*providing-an-initial-value-for-a-text-area*/}

オプションで、テキストエリアの初期値を指定することができます。`defaultValue` 文字列として渡してください。

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

HTML とは異なり、初期テキストを `<textarea>Some content</textarea>` のようにして渡すことはサポートされていません。

</Pitfall>

---

### フォーム送信時にテキストエリアから値を読み取る {/*reading-the-text-area-value-when-submitting-a-form*/}

テキストエリアを [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) で囲み、その中に [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) を配置します。これにより、`<form onSubmit>` イベントハンドラが呼び出されます。デフォルトでは、ブラウザはフォームデータを現在の URL に送信し、ページを更新します。`e.preventDefault()` を呼び出すことで、その振る舞いをオーバーライドできます。[`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) を使用してフォームデータを読み込みます。
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

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
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

`<textarea>` に `name` を指定してください。例えば `<textarea name="postContent" />` のように指定します。指定した `name` はフォームデータ内のキーとして使用されます。例えば、`{ postContent: "Your post" }` のようになります。

</Note>

<Pitfall>

デフォルトでは、`<form>` 内の*あらゆる* `<button>` はフォームの送信を行います。これは予想外の挙動かもしれません！ 独自のカスタム `Button` React コンポーネントを利用している場合は、`<button>` の代わりに [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) を返すようにすることを考慮してください。そしてフォームを送信することが*意図されている*ボタンには明示的に `<button type="submit">` を使用してください。

</Pitfall>

---

### state 変数を使ってテキストエリアを制御する {/*controlling-a-text-area-with-a-state-variable*/}

`<textarea />` のようなテキストエリアは*非制御*です。たとえ `<textarea defaultValue="Initial text" />` のように[デフォルト値を指定](#providing-an-initial-value-for-a-text-area)している場合でも、この JSX で指定しているのはあくまで初期値であって現在の値ではありません。

***制御された*テキストエリアをレンダーするには、`value` プロパティを渡してください**。React はテキストエリアが常に渡した `value` を反映するようにします。通常、[state 変数](/reference/react/useState)を宣言することでテキストエリアを制御します。

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
    />
  );
}
```

これは、キーストロークごとに UI の一部を再レンダーしたい場合に便利です。

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**`onChange` を指定せずに `value` を渡すと、テキストエリアに入力することができなくなります**。テキストエリアに `value` を渡して制御を行うと、渡した値でテキストエリアを*強制的に固定*することになります。したがって、state 変数を `value` として渡しても、`onChange` イベントハンドラ内でその state 変数を同期的に更新するのを忘れた場合、React はテキストエリアを、キーストローク毎に指定した `value` に戻してしまいます。

</Pitfall>

---

## トラブルシューティング {/*troubleshooting*/}

### テキストエリアにタイプしても内容が更新されない {/*my-text-area-doesnt-update-when-i-type-into-it*/}

`value` があるが `onChange` のないテキストエリアをレンダーすると、コンソールにエラーが表示されます。

```js
// 🔴 Bug: controlled text area with no onChange handler
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

</ConsoleBlock>

エラーメッセージが示すように、[初期値を*指定*したいだけの場合](#providing-an-initial-value-for-a-text-area)は、代わりに `defaultValue` を渡すようにしてください。

```js
// ✅ Good: uncontrolled text area with an initial value
<textarea defaultValue={something} />
```

[state 変数でこのテキストエリアを制御したい場合](#controlling-a-text-area-with-a-state-variable)は、`onChange` ハンドラを指定してください。

```js
// ✅ Good: controlled text area with onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

値を意図的に読み取り専用にしたい場合は、エラーを抑制するために props として `readOnly` を追加してください。

```js
// ✅ Good: readonly controlled text area without on change
<textarea value={something} readOnly={true} />
```

---

### キーストロークごとにテキストエリアのカーソルが先頭に戻る {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

テキストエリアを[制御する](#controlling-a-text-area-with-a-state-variable)場合、`onChange` 中でその state 変数を DOM からやってくるテキストエリアの値に更新する必要があります。

state を `e.target.value` 以外のものに更新することはできません。

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

これで問題が解決しない場合、テキストエリアがキーストロークごとに DOM から削除・再追加されている可能性があります。これは、再レンダーごとに state を誤って[リセット](/learn/preserving-and-resetting-state)している場合に起こります。例えば、テキストエリアまたはその親が常に異なる `key` 属性を受け取っている可能性や、コンポーネント定義をネストしている（これは React では許されておらず、「内側」のコンポーネントがレンダー時に再マウントさえることになります）可能性があります。

---

### "A component is changing an uncontrolled input to be controlled" というエラーが発生する {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


コンポーネントに `value` を渡す場合、そのライフサイクル全体を通じて文字列型でなければなりません。

最初に `value={undefined}` を渡しておき、後で `value="some string"` を渡すようなことはできません。なぜなら、React はあなたがコンポーネントを非制御コンポーネントと制御されたコンポーネントのどちらにしたいのか分からなくなるからです。制御されたコンポーネントは常に文字列の `value` を受け取るべきであり、`null` や `undefined` であってはいけません。

あなたの `value` が API や state 変数から来ている場合、それが `null` や `undefined` に初期化されているかもしれません。その場合、まず空の文字列（`''`）にセットするか、`value` が文字列であることを保証するために `value={someValue ?? ''}` を渡すようにしてください。
