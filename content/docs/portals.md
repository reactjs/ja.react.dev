---
id: portals
title: ポータル
permalink: docs/portals.html
---

ポータルは、親コンポーネントの DOM 階層の外にある DOM ノードに対して、子コンポーネントを描画するための第一級の方法を提供します。

```js
ReactDOM.createPortal(child, container)
```

第1引数 (`child`) は[React の子要素としてレンダー可能なもの](/docs/react-component.html#render)なら何でもよく、要素、文字列、フラグメントがそれに当たります。第2引数 (`container`) は DOM 要素を指定します。

## 使い方

通常、コンポーネントの `render` メソッドから要素を返すと、最も近い親ノードの子要素として DOM にマウントされます。

```js{4,6}
render() {
  // React は新しい div 要素をマウントし、子をその中に描画します
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

しかし、時に子要素を DOM 上の異なる場所に挿入したほうが便利なことがあります。

```js{6}
render() {
  // React は新しい div をつくり*ません*。小要素は `domNode` に対して描画されます。
  // `domNode` は DOM ノードであれば何でも良く、 DOM 構造内のどこにあるかは問いません。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

典型的なポータルのユースケースは、親要素が `overflow: hidden` や `z-index` のスタイルを持っているものの、子要素がコンテナを「飛び出して」いるように見せたいようなものです。例えば、ダイアログ、ホバーカード、ツールチップがそれに当たります。

> 補足
>
> ポータルを利用する際は、[キーボードのフォーカスの管理](/docs/accessibility.html#programmatically-managing-focus)を行うことが重要になるので、忘れずに行ってください。
>
> モーダルダイアログについては [WAI-ARIA モーダルの推奨実装方法](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal)に従い、誰もが利用できるという状態を確保してください。

[**Try it on CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## ポータルを介したイベントのバブリング

ポータルは DOM ツリーのどこにでもありうるとはいえ、他の点では通常の React の子要素と同じように振る舞います。コンテクスト (context) のような機能は、たとえ子要素がポータルだろうと完全に同じように動きます。というのも、 **DOM ツリー**上の位置にかかわらず、ポータルは依然として **React のツリー**内にいるからです。

これにはイベントのバブリングも含まれます。ポータルの内部から発行されたイベントは **React のツリー**内の祖先へと伝播します。たとえそれが **DOM ツリー** 上では祖先でなくともです。

次のような HTML 構造があったとして、

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

`#app-root` 内にある `Parent` コンポーネントは、 `#modal-root` 内のコンポーネントから伝播したイベントがキャッチされなかった場合に、それをキャッチできます。

```js{28-31,42-49,53,61-63,70-71,74}
// この 2 つのコンテナは DOM 上の兄弟要素とします
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

ポータルから浮上したイベントが親コンポーネントでキャッチできるということは、より柔軟な抽象を、本質的にポータルに依存しない形で開発できるということです。たとえば `<Modal />` コンポーネントをレンダーして、親コンポーネントがそこから来るイベントを捕捉するのは、`<Modal />` の実装がポータルを使っているかに関係なくできます。
