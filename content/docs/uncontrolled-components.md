---
id: uncontrolled-components
title: 非制御コンポーネント
permalink: docs/uncontrolled-components.html
---

<<<<<<< HEAD
ほとんどの場合では、フォームの実装には[制御されたコンポーネント](/docs/forms.html#controlled-components) (controlled component) を使用することをお勧めしています。制御されたコンポーネントでは、フォームのデータは React コンポーネントが扱います。非制御コンポーネント (uncontrolled component) はその代替となるものであり、フォームデータを DOM 自身が扱います。
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [`<input>`](https://beta.reactjs.org/reference/react-dom/components/input)
> - [`<select>`](https://beta.reactjs.org/reference/react-dom/components/select)
> - [`<textarea>`](https://beta.reactjs.org/reference/react-dom/components/textarea)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

In most cases, we recommend using [controlled components](/docs/forms.html#controlled-components) to implement forms. In a controlled component, form data is handled by a React component. The alternative is uncontrolled components, where form data is handled by the DOM itself.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

非制御コンポーネントを記述するには、各 state の更新に対してイベントハンドラを書く代わりに、[ref を使用](/docs/refs-and-the-dom.html)して DOM からフォームの値を取得します。

例えば、以下のコードは非制御コンポーネントで 1 つの名前を受け取ります：

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**CodePen で試す**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

非制御コンポーネントでは DOM に信頼できる情報源 (source of truth) を保持するため、使用すれば React と非 React のコードの統合が簡単になることがあります。汚くても構わないので速く記述したいと思うなら少しだけコード量も減らせます。そうでなければ、通常の制御されたコンポーネントを使用するべきです。

特定の状況に対してどちらのタイプのコンポーネントを使用すれば良いかまだはっきりしない場合は、[制御された入力 vs 非制御入力の記事](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)が参考になるでしょう。

### デフォルト値 {#default-values}

React のレンダーのライフサイクルでは、フォーム要素の `value` 属性は DOM の値を上書きします。非制御コンポーネントでは、React に初期値を指定させるが後続の更新処理には関与しないようにしたいことがよくあるでしょう。このケースを扱うために、`value` の代わりに `defaultValue` 属性を指定できます。コンポーネントのマウント後に `defaultValue` 属性の値を変更しても DOM 内の値の更新は引き起こされません。

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

同様に、`<input type="checkbox">` と `<input type="radio">` が `defaultChecked` を、そして `<select>` と `<textarea>` が `defaultValue` をサポートしています。

## ファイル input タグ {#the-file-input-tag}

HTML では、`<input type="file">` を利用してユーザに 1 つ以上のファイルをデバイスストレージから選択させ、サーバにアップロードしたり [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) を通じて JavaScript で操作したりします。

```html
<input type="file" />
```

React では、`<input type="file" />` は値がユーザだけが設定できるものでありプログラムでは操作できないため、常に非制御コンポーネントです。

ファイルをやり取りするのに File API を使用してください。以下の例では [DOM ノードへの ref](/docs/refs-and-the-dom.html) を作成し submit ハンドラでファイルにアクセスしています。

`embed:uncontrolled-components/input-type-file.js`

**[CodePen で試す](codepen://uncontrolled-components/input-type-file)**

