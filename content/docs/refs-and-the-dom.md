---
id: refs-and-the-dom
title: Refs と DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Refs は render メソッドで作成された DOM ノードもしくは React の要素にアクセスする方法を提供します。

一般的な React のデータフローでは、[props](/docs/components-and-props.html) は親コンポーネントがその子要素とやりとりする唯一の方法です。子要素を変更するには、新しい props でそれを再レンダーします。ただし、一般的なデータフロー以外で子要素を強制的に変更する必要がある場合もあります。その場合、変更される子要素は React コンポーネントのインスタンスまたは、DOM 要素です。 どちらの場合でも、React は避難ハッチを提供します。

### いつ Refs を使うか

Refs に適した使用例は以下の通りです。

* フォーカス、テキストの選択およびメディアの再生の管理
* アニメーションの発火
* サードパーティの DOM ライブラリとの統合

宣言的に行えるものには refs を使用しないでください。

例えば、`Dialog` コンポーネントに `open()` と `close()` メソッドを使用するかわりに、`isOpen` prop を渡してください。

### Refs を使いすぎない

最初はアプリ内で「何かを起動する」ために refs を使いがちかもしれません。 その場合は、少し時間をかけて、コンポーネントの階層のどこで状態を保持するのかについて、じっくりと考えてください。 多くの場合、その状態を「保持する」ための適切な場所が階層の上位レベルにあることが明らかになります。 この例については [state のリフトアップ](/docs/lifting-state-up.html)ガイドを参照してください。

> 補足
>
> 以下の例は React 16.3 で導入された `React.createRef()` API を使うように更新されました。以前のリリースの React を使用している場合は、代わりに [callback refs](#callback-refs) を使用することをおすすめします。

### Refs を作成する

Refs は `React.createRef()` を使用して作成され、 `ref` 属性を用いて React 要素に紐付けられます。 Refs は通常、コンポーネントの構築時にインスタンスプロパティに割り当てられるため、コンポーネント全体で参照できます。

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Refs へのアクセス

ref が `render` メソッドの要素に渡されると、ノードへの参照は ref の `current` 属性でアクセスできるようになります。

```javascript
const node = this.myRef.current;
```

ref の値はノードの種類によって異なります。

- HTML 要素に対して `ref` 属性が使用されている場合、`React.createRef()` を使ってコンストラクタ内で作成された `ref` は、その `current` プロパティとして根底にある DOM 要素を受け取ります
- `ref` 属性がカスタムクラスコンポーネントで使用されるとき、`ref` オブジェクトはコンポーネントのマウントされたインスタンスを `current` として受け取ります
- **function components には `ref` 属性を使用してはいけません。** なぜなら、function components はインスタンスを持たないからです

以下の例ではその違いを示しています。

#### DOM 要素への Ref の追加

このコードでは DOM ノードへの参照を保持するために `ref` を使います。

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // textInput DOM 要素を保持するための ref を作成します。
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // 生の DOM API を使用してテキストの入力を絞り込みます。
    // 補足：DOM ノードを取得するために "current" にアクセスしています。
    this.textInput.current.focus();
  }

  render() {
    // コンストラクタで作成した `textInput` に <input> ref を関連付けることを
    // React に伝えます。
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

コンポーネントがマウントされると React は `current` プロパティに DOM 要素を割り当て、マウントが解除されると `null` を割り当てます。`ref` の更新は `componentDidMount` または `componentDidUpdate` ライフサイクルメソッドの前に行われます。

#### クラスコンポーネントへの Ref の追加

マウント直後にクリックされることをシミュレーションするために上記の CustomTextInput をラップしたい場合は、ref を使用してカスタムインプットにアクセスし、その focusTextInput メソッドを手動で呼び出せます。

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

これは `CustomTextInput` がクラスとして宣言されている場合にのみ機能することに注意してください。

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Refs と Function Components

Function components にはインスタンスがないため、**Function components に `ref` 属性を使用することはできません。**


```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // これは動き*ません*！
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Ref が必要な場合は、ライフサイクルメソッドやステートが必要なときと同じように、コンポーネントをクラスに変換しなければなりません。

ただし、DOM 要素またはクラスコンポーネントを参照している限り、**function component 内で ref 属性を使用できます。**

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // ref が参照できるように、textInput をここで宣言する必要があります。
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### DOM の Refs を親コンポーネントにさらす

まれに、親コンポーネントから子の DOM ノードにアクセスしたい場合があります。 これは、コンポーネントのカプセル化を壊すため、一般的にはおすすめできませんが、フォーカスを発火したり、子の DOM ノードのサイズや位置を計測したりするのに役立つことがあります。

[子コンポーネントに ref を追加すること](#adding-a-ref-to-a-class-component)はできますが、DOM ノードではなくコンポーネントインスタンスしか取得できないため、これは理想的な解決策ではありません。 また、これは function components では機能しません。

React 16.3 以降を使用している場合、これらの場合には [ref forwarding](/docs/forwarding-refs.html) を使用することをおすすめします。Ref forwarding では、コンポーネントは子コンポーネントの参照を自分のものとして公開することを選択できます。 [Ref forwarding のドキュメント](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)に、子の DOM ノードを親コンポーネントに公開する方法の詳細な例があります。

React 16.2 以下を使用している場合、または ref forwarding で提供される以上の柔軟性が必要な場合は、[この代替アプローチ](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509)を使用して ref を別の名前の prop として明示的に渡すことができます。

可能であれば DOM ノードをさらさないことをおすすめしますが、これは便利な回避策になることもあります。この方法では、子コンポーネントにコードを追加する必要があります。子コンポーネントの実装を完全に制御できない場合、最後の選択肢は [`findDOMNode()`](/docs/react-dom.html#finddomnode) を使用することですが、[`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage) では推奨されません。

### コールバック Refs

React はまた「コールバック Refs」と呼ばれる refs を設定するためのさらなる方法をサポートします。

`createRef()` によって作成された `ref` 属性を渡す代わりに、関数を渡します。 この関数は、引数として React コンポーネントのインスタンスまたは HTML DOM 要素を受け取ります。これらは他の場所に保持してアクセスできます。

以下は、`ref` コールバックを用いて DOM ノードへの参照をインスタンスプロパティに格納する一般的な実装例です。

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // 生の DOM API を使用してテキストの入力にフォーカスします。
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // マウント時に入力をオートフォーカスします。
    this.focusTextInput();
  }

  render() {
    // インスタンスフィールド（例えば this.textInput）にテキスト入力の DOM 要素への
    // 参照を保存するために `ref` コールバックを使用してください。
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

コンポーネントがマウントされると React は DOM 要素で `ref` コールバックを呼び出し、マウントが解除されると `null` を呼び出します。 Refs は `componentDidMount` または `componentDidUpdate` が発火される前に最新のものであることが保証されています。

`React.createRef()` で作成されたオブジェクトの refs と同様に、コンポーネント間でコールバック refs を渡すことができます。

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

上記の例では、`Parent` は ref コールバックを `inputRef` prop として `CustomTextInput` に渡し、`CustomTextInput` は同じ関数を特別な `ref` 属性として `<input>` に渡します。 その結果、`Parent` の `this.inputElement` は、`CustomTextInput` の `<input>` 要素に対応する DOM ノードに設定されます。

### レガシー API：String Refs

以前に React を使用したことがある場合は、`ref` 属性が `"textInput"` のような文字列で、DOM ノードが `this.refs.textInput` としてアクセスされる古い API に慣れているかもしれません。String refs には[いくつかの問題](https://github.com/facebook/react/pull/8333#issuecomment-271648615)があり、レガシーと見なされ、**将来のリリースのいずれかで削除される可能性が高い**ため、使用することをおすすめしません。

> 補足
>
> Refs にアクセスするために `this.refs.textInput` を現在使用している場合は、代わりに[コールバックパターン](#callback-refs)もしくは [`createRef` API](#creating-refs) を使用することをおすすめします。

### Callback refs の注意事項

`ref` コールバックがインライン関数として定義されている場合、更新中に 2 回呼び出されます。最初は `null`、次に DOM 要素で呼び出されます。これは、各レンダリングで関数の新しいインスタンスが作成されるため、React は古い ref を削除し、新しい ref を設定する必要があるためです。`ref` コールバックをクラスのバウンドメソッドとして定義することでこれを回避できますが、ほとんどの場合は問題にならないはずです。
