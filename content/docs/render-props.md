---
id: render-props
title: レンダープロップ
permalink: docs/render-props.html
---

[「レンダープロップ」](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)とは、値が関数となる props を持ったコンポーネント間でコードを共有するためのテクニックの1つです。

レンダープロップを持つコンポーネントは、自身のレンダーロジックを実装する代わりに、React 要素を返す関数を受け取ってそれを呼び出します。


```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

レンダープロップを用いたライブラリとしては、[React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods) や [Downshift](https://github.com/paypal/downshift) などがあります。

このドキュメントでは、レンダープロップが役立つ理由と、その記述法について解説します。

## 横断的関心事にレンダープロップを使う

コンポーネントは、React でコードを再利用するための主要な構成用要素ですが、あるコンポーネントがカプセル化した state や振る舞いを、同じ state を必要とする別のコンポーネントに共有する方法については、いつも明らかであるとは限りません。

For example, the following component tracks the mouse position in a web app:

たとえば、以下のコンポーネントは、ウェブアプリケーション内でのマウスの位置を追跡します。

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>マウスを動かしてみましょう！</h1>
        <p>現在のマウスの位置は ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

画面上でカーソルが移動すると、コンポーネントはその (x, y) 座標を `<p>` 内に表示します。

ここで疑問となるのは、この振る舞いを他のコンポーネントで再利用する方法です。つまり、他のコンポーネントもカーソルの位置を知る必要がある時、この振る舞いだけをカプセル化し、そのコンポーネントと簡単に共有することは可能でしょうか？

コンポーネントは React におけるコード再利用の基本構成要素ですので、コードを少しリファクタリングして、他で再利用する必要のあるこの振る舞いをカプセル化するための `<Mouse>` コンポーネントを使ってみましょう。

```js
// <Mouse> コンポーネントは必要な振る舞いだけをカプセル化します...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ...しかし、どのようにして <p> 以外のものをレンダーするのでしょうか？ */}
        <p>現在のマウスの位置は ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>マウスを動かしてみましょう！</h1>
        <Mouse />
      </div>
    );
  }
}
```

これで `<Mouse>` コンポーネントは、 `mousemove` イベントに応答しカーソルの (x, y) 座標を保持することで構成される全ての振る舞いをカプセル化できましたが、まだ再利用可能と言うには不十分です。

たとえば、 猫の画像が画面中のマウスを追いかけるという `<Cat>` コンポーネントがあるとしましょう。`<Cat mouse={{ x, y }}>` props を使って、このコンポーネントにマウスの座標を受け渡し、画面上のどこに猫の画像を配置すれば良いかを知らせたいでしょう。

手始めに、*`<Mouse>` の `render` メソッド内* で、以下のように `<Cat>` をレンダーしようとするかもしれません。 

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          ここで <p> を <Cat> に差し替えることができますが...
          それを使用するたびに別途 <MouseWithSomethingElse>
          コンポーネントを作成する必要があるため、
          <MouseWithCat> はまだ真に再利用可能になったとは言えません。 
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>マウスを動かしてみましょう！</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

これだけが目的であればで正しく動作しますが、再利用可能な方法でこの振る舞いをカプセル化するという目的はまだ果たせていません。その他のユースケースでもマウス位置を知りたい場合、毎回新しいコンポーネント（つまり、別の `<MouseWithCat>` のようなもの）を作成して、そのユースケース固有のレンダー処理を行う必要があります。

ここでレンダープロップの出番となります。`<Mouse>` コンポーネント内でハードコードされた `<Cat>` でレンダーの出力を変更する代わりに、`<Mouse>` コンポーネントに関数型の props を渡して、 何をレンダーすべきかを動的に決定することが可能です。これがレンダープロップの役割です。

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          <Mouse> がレンダーするものを静的に表現する代わりに、
          propsとしての `render` を使うことでレンダーするものを動的に決定します。
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>マウスを動かしてみましょう！</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

これで特定のユースケースを解決するために、`<Mouse>` コンポーネントを複製してレンダーメソッド内で何か他のものをハードコードする代わりに、`<Mouse>` が動的にレンダーの内容を決定するためのpropsとしての `render` が提供可能になります。

More concretely, **a render prop is a function prop that a component uses to know what to render.**

より具体的には、**レンダープロップは関数型 props であり、それによってコンポーネントがレンダリングするものを知ることができます。**

このテクニックによって、再利用可能な振る舞いの移植性が極めて高くなります。この振る舞いが必要な時には、現在のカーソルの (x, y) からレンダリングするものを示す `render` props を使って `<Mouse>` をレンダーすれば良いのです。  

レンダープロップの興味深い点として、多くの[高階コンポーネント](/docs/higher-order-components.html) (HOC) がレンダープロップを使った通常のコンポーネントによって実装可能ということが挙げられます。たとえば、`<Mouse>` コンポーネントよりも `withMouse` HOCが好みであれば、レンダープロップを有する `<Mouse>` を使って簡単に作成可能です。 

```js
// HOCを選択する理由があれば、
// 通常のコンポーネントとレンダープロップを使うことで簡単に作成可能です！
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

つまり、レンダープロップによってどちらのパターンも可能になります。

## `render` 以外の props を使う

「レンダープロップ」と呼ばれるパターンは、必ずしも*`render` という名前の props を使う必要はない*ということを念頭に置いてください。実際、[コンポーネントがレンダーするものを知るための関数型 props であれば、*その名前が何であれ*、技術的には「レンダープロップ」と呼ぶことができます](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)。

上記の例では `rendrer` を用いていますが、`children` props を使っても同じくらい簡単です！

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

さらに、`children` props は実際には JSX 要素の「属性」の一覧内で名前を付ける必要がないことも忘れないでください。代わりに、要素*内部に*直接設定可能です！

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

このテクニックは、 [react-motion](https://github.com/chenglou/react-motion)  の API などで使用されています。


Since this technique is a little unusual, you'll probably want to explicitly state that `children` should be a function in your `propTypes` when designing an API like this.

このテクニックは若干珍しいため、このようなAPI設計時には、`children` が関数であることを `propTypes` で明示した方が良いでしょう。

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## 注意事項

### Be careful when using Render Props with React.PureComponent

### レンダープロップを React.PureComponent で使うときの注意点

レンダープロップを使う際、`render` メソッド内で関数を作成していると、 [`React.PureComponent`](/docs/react-api.html#reactpurecomponent)  を使う利点が相殺されます。これは新しい props については、浅い比較が常に `false` を返し、このような `render` は毎回レンダープロップとして新しい値を生成するためです。

たとえば、上記の `<Mouse>` コンポーネントの場合、`Mouse` が `React.Component` ではなく `React.PureComponent` を継承していたとすると、次のようになります。 

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

この例では、`<MouseTracker>` がレンダーされるたび、`<Mouse render>` propsの値として新しい関数が生成されますので、冒頭で `React.PureComonent` を継承した `<Mouse>` の効果が相殺されます。

この問題を回避するため、props をインスタンスメソッドとして次のように定義することもできます。

```js
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

propsを静的に定義できない場合（たとえば、コンポーネントの props や state を閉じる必要があるなど）、`<Mouse>` は代わりに `React.Component` を継承すべきです。
