---
id: implementation-notes
title: 実装に関するメモ
layout: contributing
permalink: docs/implementation-notes.html
prev: codebase-overview.html
next: design-principles.html
redirect_from:
  - "contributing/implementation-notes.html"
---

この章は [stack リコンサイラ (reconciler)](/docs/codebase-overview.html#stack-reconciler) の実装に関するメモを集めたものです。

これは非常に技術的な内容であり、React の公開 API だけでなく、React がどのようにコア、レンダラ (renderer) 、そしてリコンサイラに分割されているかについても、深く理解していることを前提としています。
React のコードベースにあまり精通していないのであれば、まず [コードベースの概要](/docs/codebase-overview.html) を読んでください。

また、これは [React のコンポーネント、インスタンスおよび要素の違い](/blog/2015/12/18/react-components-elements-and-instances.html) についての理解を前提としています。

stack リコンサイラは、React 15 およびそれ以前のバージョンで使われていました。[src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler) で見つけることができます。

### 動画： React をスクラッチで作成する {#video-building-react-from-scratch}

このドキュメントは、[Paul O'Shannessy](https://twitter.com/zpao) 氏の行った講演 [building React from scratch](https://www.youtube.com/watch?v=_MAD4Oly9yg) に大いに啓発されています。

このドキュメントと彼の講演は、ともに実際のコードベースを簡素化したもので、両方に親しむことでより深く理解することができるでしょう。

### 概要 {#overview}

リコンサイラそのものは公開 API を持ちません。
リコンサイラは、React DOM や React Native のような [レンダラ](/docs/codebase-overview.html#stack-renderers) が、ユーザーの記述した React コンポーネントに応じてユーザーインターフェースを効率よく更新するために使用されます。

### 再帰的な処理としてマウントする {#mounting-as-a-recursive-process}

一番最初にコンポーネントをマウントするときのことを考えてみましょう：

```js
ReactDOM.render(<App />, rootEl);
```

React DOM はリコンサイラに `<App />` を渡します。
`<App />` が React 要素であること、つまり、「何」をレンダリングするかの記述であることを思い出してください。
これはプレーンなオブジェクトとして考えることができます：

```js
console.log(<App />);
// { type: App, props: {} }
```

リコンサイラは `App` がクラスか関数かをチェックします。

もし `App` が関数なら、リコンサイラは `App(props)` を呼び出してレンダリングされた要素を取得します。

もし `App` がクラスなら、リコンサイラは `new App(props)` で `App` を初期化し、`componentWillMount()` ライフサイクルメソッドを呼び出し、それから `render()` メソッドを呼び出してレンダリングされた要素を取得します。

どちらにせよ、リコンサイラは `App` が「render された」結果となる要素を手に入れます。

このプロセスは再帰的です。`App` は `<Greeting />` へとレンダリングされるかもしれませんし、`Greeting` は `<Button />` にレンダリングされるかもしれない、といったように続いていきます。
リコンサイラはそれぞれのコンポーネントが何にレンダリングされるかを学習しながら、ユーザー定義コンポーネントを再帰的に「掘り下げて」いきます。

この処理の流れは擬似コードで想像することができます：

```js
function isClass(type) {
  // React.Component subclasses have this flag
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// This function takes a React element (e.g. <App />)
// and returns a DOM or Native node representing the mounted tree.
function mount(element) {
  var type = element.type;
  var props = element.props;

  // We will determine the rendered element
  // by either running the type as function
  // or creating an instance and calling render().
  var renderedElement;
  if (isClass(type)) {
    // Component class
    var publicInstance = new type(props);
    // Set the props
    publicInstance.props = props;
    // Call the lifecycle if necessary
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    // Get the rendered element by calling render()
    renderedElement = publicInstance.render();
  } else {
    // Component function
    renderedElement = type(props);
  }

  // This process is recursive because a component may
  // return an element with a type of another component.
  return mount(renderedElement);

  // Note: this implementation is incomplete and recurses infinitely!
  // It only handles elements like <App /> or <Button />.
  // It doesn't handle elements like <div /> or <p /> yet.
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

>**注意:**
>
>これは「単なる」擬似コードです。本物の実装に近いものではありません。また、いつ再帰を止めるか検討していないため、このコードはスタックオーバーフローを引き起こします。

上記の例でいくつかの鍵となるアイデアをおさらいしましょう：

* React 要素とはコンポーネントの型（例えば `App`）と props を表すプレーンなオブジェクトである。
* ユーザー定義コンポーネント（例えば `App`）はクラスであっても関数であってもよいが、それらは全て要素へと「レンダリングされる」。
* 「マウント」とは、最上位の React 要素（例えば `<App />`）を受け取り、DOM もしくはネイティブなツリーを構築する再帰的な処理である。

### host要素のマウント {#mounting-host-elements}

このようにして要素ができても、それを使って画面に何か表示しなければ意味がありません。

ユーザー定義 ("composite") コンポーネントに加え、React 要素はプラットフォームに固有な ("host") コンポーネントも表すことができます。例えば、`Button` は render メソッドから `<div />` を返すことが考えられます。

もし要素の `type` プロパティが文字列なら、私たちはいま host 要素を扱っていることになります：

```js
console.log(<div />);
// { type: 'div', props: {} }
```

host 要素に関連付けられているユーザー定義のコードはありません。

レコンサイラは host 要素を見つけると、レンダラに host 要素のマウントを任せます。例えば、React DOM は DOM ノードを生成します。

host 要素に子要素がある場合、リコンサイラは前節で述べたものと同じアルゴリズムに従い、子要素を再帰的にマウントします。
子要素が（`<div><hr /></div>` のような）host なのか、（`<div><Button /></div>` のような）composite なのか、もしくはその両方が含まれているかに関わらず、再帰的な処理が実行されます。

子コンポーネントにより生成された DOM ノードは親の DOM ノードに追加され、それが再帰的に行われることで、完全な DOM 構造が組み立てられます。

>**注意：**
>
>リコンサイラそのものは DOM と結合していません。
>マウントの結果自体（時にソースコードでは "mount image" とも呼ばれます）はレンダラに依存し、それは（React DOM なら）DOM ノード であったり、（React DOM Server なら）文字列であったり、（React Native なら）ネイティブのビューを表す数字であったりします。

前出のコードを host 要素も扱えるように拡張するとすれば、以下のようなものになるでしょう：

```js
function isClass(type) {
  // React.Component subclasses have this flag
  return (
    Boolean(type.prototype) &&
    Boolean(type.prototype.isReactComponent)
  );
}

// This function only handles elements with a composite type.
// For example, it handles <App /> and <Button />, but not a <div />.
function mountComposite(element) {
  var type = element.type;
  var props = element.props;

  var renderedElement;
  if (isClass(type)) {
    // Component class
    var publicInstance = new type(props);
    // Set the props
    publicInstance.props = props;
    // Call the lifecycle if necessary
    if (publicInstance.componentWillMount) {
      publicInstance.componentWillMount();
    }
    renderedElement = publicInstance.render();
  } else if (typeof type === 'function') {
    // Component function
    renderedElement = type(props);
  }

  // This is recursive but we'll eventually reach the bottom of recursion when
  // the element is host (e.g. <div />) rather than composite (e.g. <App />):
  return mount(renderedElement);
}

// This function only handles elements with a host type.
// For example, it handles <div /> and <p /> but not an <App />.
function mountHost(element) {
  var type = element.type;
  var props = element.props;
  var children = props.children || [];
  if (!Array.isArray(children)) {
    children = [children];
  }
  children = children.filter(Boolean);

  // This block of code shouldn't be in the reconciler.
  // Different renderers might initialize nodes differently.
  // For example, React Native would create iOS or Android views.
  var node = document.createElement(type);
  Object.keys(props).forEach(propName => {
    if (propName !== 'children') {
      node.setAttribute(propName, props[propName]);
    }
  });

  // Mount the children
  children.forEach(childElement => {
    // Children may be host (e.g. <div />) or composite (e.g. <Button />).
    // We will also mount them recursively:
    var childNode = mount(childElement);

    // This line of code is also renderer-specific.
    // It would be different depending on the renderer:
    node.appendChild(childNode);
  });

  // Return the DOM node as mount result.
  // This is where the recursion ends.
  return node;
}

function mount(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // User-defined components
    return mountComposite(element);
  } else if (typeof type === 'string') {
    // Platform-specific components
    return mountHost(element);
  }
}

var rootEl = document.getElementById('root');
var node = mount(<App />);
rootEl.appendChild(node);
```

このコードは動作しますが、それでもまだ現実のリコンサイラの実装方法からは隔たりがあります。ここにあるべき鍵となる要素は、更新に対応することです。

### 内部インスタンスの導入 {#introducing-internal-instances}

React の鍵となる機能は、あらゆるものを再描画できることであり、その際に DOM を再生成したり、state をリセットしたりしないことです：

```js
ReactDOM.render(<App />, rootEl);
// Should reuse the existing DOM:
ReactDOM.render(<App />, rootEl);
```

しかし、前節で実装したコードは最初のツリーをマウントする方法しか知りません。
前節のコードは、全ての `publicInstance` や、どの DOM `node` がどのコンポーネントに対応しているかなど、必要な全情報を保有しているわけではないので、更新を実行することができません。

stack リコンサイラのコードベースでは、この問題を `mount()` 関数をメソッドとしてクラスに置くことで解決しています。
しかしこのアプローチには欠点があるため、[進行中のリコンサイラの書き直し作業](/docs/codebase-overview.html#fiber-reconciler)では、反対の方向に進んでいます。
それでも現時点では、この方式で動作しています。

別々の `mountHost` と `mountComposite` 関数の代わりに、2 つのクラスを作成します： `DOMComponent` と `CompositeComponent` です。

両方のクラスが `element` を受け入れるコンストラクタと、マウントされたノードを返す `mount()` メソッドを持ちます。
最上位の `mount()` 関数を、正しいクラスをインスタンス化するファクトリに置き換えます：

```js
function instantiateComponent(element) {
  var type = element.type;
  if (typeof type === 'function') {
    // User-defined components
    return new CompositeComponent(element);
  } else if (typeof type === 'string') {
    // Platform-specific components
    return new DOMComponent(element);
  }  
}
```

まず、`CompositeComponent` の実装から考えてみましょう：

```js
class CompositeComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedComponent = null;
    this.publicInstance = null;
  }

  getPublicInstance() {
    // For composite components, expose the class instance.
    return this.publicInstance;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;

    var publicInstance;
    var renderedElement;
    if (isClass(type)) {
      // Component class
      publicInstance = new type(props);
      // Set the props
      publicInstance.props = props;
      // Call the lifecycle if necessary
      if (publicInstance.componentWillMount) {
        publicInstance.componentWillMount();
      }
      renderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component function
      publicInstance = null;
      renderedElement = type(props);
    }

    // Save the public instance
    this.publicInstance = publicInstance;

    // Instantiate the child internal instance according to the element.
    // It would be a DOMComponent for <div /> or <p />,
    // and a CompositeComponent for <App /> or <Button />:
    var renderedComponent = instantiateComponent(renderedElement);
    this.renderedComponent = renderedComponent;

    // Mount the rendered output
    return renderedComponent.mount();
  }
}
```

以前の `mountComposite()` の実装と大きな違いはありませんが、更新時に使用する `this.currentElement` 、`this.renderedComponent` や、`this.publicInstance` のような情報を保存できるようになりました。

`CompositeComponent` のインスタンスは、ユーザーが指定する `element.type` のインスタンスとは同一ではないことに注意してください。
`CompositeComponent` はリコンサイラの実装の詳細であり、ユーザーには決して公開されません。
ユーザー定義クラスとは `element.type` から読み込むものであり、`CompositeComponent` がそのインスタンスを作成するのです。

混乱を避けるために、`CompositeComponent` と `DOMComponent` のインスタンスを「内部インスタンス」と呼ぶことにします。
内部インスタンスは、長期間利用されるデータとそれらを関連付けられるようにするために存在します。
それらの存在はレンダラとリコンサイラのみが認識しています。

一方、ユーザー定義クラスのインスタンスは「公開インスタンス」と呼ぶことにします。
公開インスタンスは、独自コンポーネントの `render()` やその他のメソッド内で `this` として現れるものです。

`mountHost()` 関数は、`DOMComponent` クラスの `mount()` メソッドとしてリファクタリングされ、こちらも見慣れたものになります：

```js
class DOMComponent {
  constructor(element) {
    this.currentElement = element;
    this.renderedChildren = [];
    this.node = null;
  }

  getPublicInstance() {
    // For DOM components, only expose the DOM node.
    return this.node;
  }

  mount() {
    var element = this.currentElement;
    var type = element.type;
    var props = element.props;
    var children = props.children || [];
    if (!Array.isArray(children)) {
      children = [children];
    }

    // Create and save the node
    var node = document.createElement(type);
    this.node = node;

    // Set the attributes
    Object.keys(props).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, props[propName]);
      }
    });

    // Create and save the contained children.
    // Each of them can be a DOMComponent or a CompositeComponent,
    // depending on whether the element type is a string or a function.
    var renderedChildren = children.map(instantiateComponent);
    this.renderedChildren = renderedChildren;

    // Collect DOM nodes they return on mount
    var childNodes = renderedChildren.map(child => child.mount());
    childNodes.forEach(childNode => node.appendChild(childNode));

    // Return the DOM node as mount result
    return node;
  }
}
```

mountHost() からリファクタリングした後の主な違いは、`this.node` と `this.renderedChildren` を内部の DOM コンポーネントインスタンスに関連付け続けていることです。
これらは、将来的に非破壊的な更新を適用する際にも使用します。

結果として、それが composite であれ host であれ、内部インスタンスはそれぞれの子内部インスタンスを指すようになります。
`<App>` 関数コンポーネントが `<Button>` コンポーネントをレンダリングし、`<Button>` クラスが `<div>`をレンダリングする場合、視覚的にわかりやすくすると、内部インスタンスのツリーはこのようになります：

```js
[object CompositeComponent] {
  currentElement: <App />,
  publicInstance: null,
  renderedComponent: [object CompositeComponent] {
    currentElement: <Button />,
    publicInstance: [object Button],
    renderedComponent: [object DOMComponent] {
      currentElement: <div />,
      node: [object HTMLDivElement],
      renderedChildren: []
    }
  }
}
```

DOM の中では、`<div>`しか見えません。しかしながら、内部インスタンスのツリーは composite の内部インスタンスと host の内部インスタンスの両方を保有しています。

composite 内部インスタンスは以下のものを格納する必要があります：

* 現在の要素。
* 要素の型がクラスの場合、公開インスタンス。
* 単独の、レンダリングされた内部インスタンス。これは `DOMComponent` か `CompositeComponent` のいずれかにあたります。

host 内部インスタンスは以下のものを格納する必要があります：

* 現在の要素。
* DOM ノード。
* すべての子内部インタスタンス。各インスタンスは、`DOMComponent` または `CompositeComponent` のいずれかになります。

より複雑なアプリケーションにおいて、内部インスタンスのツリーがどのような構造になるのか想像しづらい場合は、[React DevTools](https://github.com/facebook/react-devtools) が host インスタンスを灰色に、composite インスタンスを紫色にハイライトしてくれるので、内部インスタンスのツリーにかなり近いものを得ることができます：

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

このリファクタリングを完了するため、コンテナノードへ完成したツリーをマウントする、`ReactDOM.render()` のような関数を導入します。
この関数は `ReactDOM.render()` のように公開インスタンスを返します：

```js
function mountTree(element, containerNode) {
  // Create the top-level internal instance
  var rootComponent = instantiateComponent(element);

  // Mount the top-level component into the container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Return the public instance it provides
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}

var rootEl = document.getElementById('root');
mountTree(<App />, rootEl);
```

### アンマウント {#unmounting}

これで、子内部インスタンスと DOM ノードを持った内部インスタンスができ、そこにアンマウントを実装できるようになります。composite 要素では、アンマウントはライフサイクルメソッドを呼び出し、再帰的な処理を行います。

```js
class CompositeComponent {

  // ...

  unmount() {
    // Call the lifecycle method if necessary
    var publicInstance = this.publicInstance;
    if (publicInstance) {
      if (publicInstance.componentWillUnmount) {
        publicInstance.componentWillUnmount();
      }
    }

    // Unmount the single rendered component
    var renderedComponent = this.renderedComponent;
    renderedComponent.unmount();
  }
}
```

`DOMComponent` では、アンマウントは子要素それぞれにアンマウントするように伝えます：

```js
class DOMComponent {

  // ...

  unmount() {
    // Unmount all the children
    var renderedChildren = this.renderedChildren;
    renderedChildren.forEach(child => child.unmount());
  }
}
```

実際には、DOM コンポーネントをアンマウントすると、イベントリスナーの削除とキャッシュのクリアも行われますが、これらの詳細は省略します。

これで `ReactDOM.unmountComponentAtNode()` と同様の `unmountTree(containerNode)` という新規の最上位関数を追加することができます：

```js
function unmountTree(containerNode) {
  // Read the internal instance from a DOM node:
  // (This doesn't work yet, we will need to change mountTree() to store it.)
  var node = containerNode.firstChild;
  var rootComponent = node._internalInstance;

  // Unmount the tree and clear the container
  rootComponent.unmount();
  containerNode.innerHTML = '';
}
```

これが動作するよう、DOM ノードから内部ルートインスタンスを読み込む必要があります。
`mountTree()` を変更して、ルート DOM ノードに `_internalInstance` プロパティを追加します。
`mountTree()` に既存の全てのツリーを破棄するようにも伝えて、複数回 `mountTree()` を呼び出せるようにします：

```js
function mountTree(element, containerNode) {
  // Destroy any existing tree
  if (containerNode.firstChild) {
    unmountTree(containerNode);
  }

  // Create the top-level internal instance
  var rootComponent = instantiateComponent(element);

  // Mount the top-level component into the container
  var node = rootComponent.mount();
  containerNode.appendChild(node);

  // Save a reference to the internal instance
  node._internalInstance = rootComponent;

  // Return the public instance it provides
  var publicInstance = rootComponent.getPublicInstance();
  return publicInstance;
}
```

これで、`unmountTree()` を実行したり、`mountTree()` の実行を繰り返したりしても、古いツリーは破棄され、コンポーネント上で `componentWillUnmount()` ライフサイクルメソッドが実行されるようになりました。

### 更新 {#updating}

In the previous section, we implemented unmounting. However React wouldn't be very useful if each prop change unmounted and mounted the whole tree. The goal of the reconciler is to reuse existing instances where possible to preserve the DOM and the state:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Should reuse the existing DOM:
mountTree(<App />, rootEl);
```

We will extend our internal instance contract with one more method. In addition to `mount()` and `unmount()`, both `DOMComponent` and `CompositeComponent` will implement a new method called `receive(nextElement)`:

```js
class CompositeComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}

class DOMComponent {
  // ...

  receive(nextElement) {
    // ...
  }
}
```

Its job is to do whatever is necessary to bring the component (and any of its children) up to date with the description provided by the `nextElement`.

This is the part that is often described as "virtual DOM diffing" although what really happens is that we walk the internal tree recursively and let each internal instance receive an update.

### Updating Composite Components {#updating-composite-components}

When a composite component receives a new element, we run the `componentWillUpdate()` lifecycle method.

Then we re-render the component with the new props, and get the next rendered element:

```js
class CompositeComponent {

  // ...

  receive(nextElement) {
    var prevProps = this.currentElement.props;
    var publicInstance = this.publicInstance;
    var prevRenderedComponent = this.renderedComponent;
    var prevRenderedElement = prevRenderedComponent.currentElement;

    // Update *own* element
    this.currentElement = nextElement;
    var type = nextElement.type;
    var nextProps = nextElement.props;

    // Figure out what the next render() output is
    var nextRenderedElement;
    if (isClass(type)) {
      // Component class
      // Call the lifecycle if necessary
      if (publicInstance.componentWillUpdate) {
        publicInstance.componentWillUpdate(nextProps);
      }
      // Update the props
      publicInstance.props = nextProps;
      // Re-render
      nextRenderedElement = publicInstance.render();
    } else if (typeof type === 'function') {
      // Component function
      nextRenderedElement = type(nextProps);
    }

    // ...
```

Next, we can look at the rendered element's `type`. If the `type` has not changed since the last render, the component below can also be updated in place.

For example, if it returned `<Button color="red" />` the first time, and `<Button color="blue" />` the second time, we can just tell the corresponding internal instance to `receive()` the next element:

```js
    // ...

    // If the rendered element type has not changed,
    // reuse the existing component instance and exit.
    if (prevRenderedElement.type === nextRenderedElement.type) {
      prevRenderedComponent.receive(nextRenderedElement);
      return;
    }

    // ...
```

However, if the next rendered element has a different `type` than the previously rendered element, we can't update the internal instance. A `<button>` can't "become" an `<input>`.

Instead, we have to unmount the existing internal instance and mount the new one corresponding to the rendered element type. For example, this is what happens when a component that previously rendered a `<button />` renders an `<input />`:

```js
    // ...

    // If we reached this point, we need to unmount the previously
    // mounted component, mount the new one, and swap their nodes.

    // Find the old node because it will need to be replaced
    var prevNode = prevRenderedComponent.getHostNode();

    // Unmount the old child and mount a new child
    prevRenderedComponent.unmount();
    var nextRenderedComponent = instantiateComponent(nextRenderedElement);
    var nextNode = nextRenderedComponent.mount();

    // Replace the reference to the child
    this.renderedComponent = nextRenderedComponent;

    // Replace the old node with the new one
    // Note: this is renderer-specific code and
    // ideally should live outside of CompositeComponent:
    prevNode.parentNode.replaceChild(nextNode, prevNode);
  }
}
```

To sum this up, when a composite component receives a new element, it may either delegate the update to its rendered internal instance, or unmount it and mount a new one in its place.

There is another condition under which a component will re-mount rather than receive an element, and that is when the element's `key` has changed. We don't discuss `key` handling in this document because it adds more complexity to an already complex tutorial.

Note that we needed to add a method called `getHostNode()` to the internal instance contract so that it's possible to locate the platform-specific node and replace it during the update. Its implementation is straightforward for both classes:

```js
class CompositeComponent {
  // ...

  getHostNode() {
    // Ask the rendered component to provide it.
    // This will recursively drill down any composites.
    return this.renderedComponent.getHostNode();
  }
}

class DOMComponent {
  // ...

  getHostNode() {
    return this.node;
  }  
}
```

### Updating Host Components {#updating-host-components}

Host component implementations, such as `DOMComponent`, update differently. When they receive an element, they need to update the underlying platform-specific view. In case of React DOM, this means updating the DOM attributes:

```js
class DOMComponent {
  // ...

  receive(nextElement) {
    var node = this.node;
    var prevElement = this.currentElement;
    var prevProps = prevElement.props;
    var nextProps = nextElement.props;    
    this.currentElement = nextElement;

    // Remove old attributes.
    Object.keys(prevProps).forEach(propName => {
      if (propName !== 'children' && !nextProps.hasOwnProperty(propName)) {
        node.removeAttribute(propName);
      }
    });
    // Set next attributes.
    Object.keys(nextProps).forEach(propName => {
      if (propName !== 'children') {
        node.setAttribute(propName, nextProps[propName]);
      }
    });

    // ...
```

Then, host components need to update their children. Unlike composite components, they might contain more than a single child.

In this simplified example, we use an array of internal instances and iterate over it, either updating or replacing the internal instances depending on whether the received `type` matches their previous `type`. The real reconciler also takes element's `key` in the account and track moves in addition to insertions and deletions, but we will omit this logic.

We collect DOM operations on children in a list so we can execute them in batch:

```js
    // ...

    // These are arrays of React elements:
    var prevChildren = prevProps.children || [];
    if (!Array.isArray(prevChildren)) {
      prevChildren = [prevChildren];
    }
    var nextChildren = nextProps.children || [];
    if (!Array.isArray(nextChildren)) {
      nextChildren = [nextChildren];
    }
    // These are arrays of internal instances:
    var prevRenderedChildren = this.renderedChildren;
    var nextRenderedChildren = [];

    // As we iterate over children, we will add operations to the array.
    var operationQueue = [];

    // Note: the section below is extremely simplified!
    // It doesn't handle reorders, children with holes, or keys.
    // It only exists to illustrate the overall flow, not the specifics.

    for (var i = 0; i < nextChildren.length; i++) {
      // Try to get an existing internal instance for this child
      var prevChild = prevRenderedChildren[i];

      // If there is no internal instance under this index,
      // a child has been appended to the end. Create a new
      // internal instance, mount it, and use its node.
      if (!prevChild) {
        var nextChild = instantiateComponent(nextChildren[i]);
        var node = nextChild.mount();

        // Record that we need to append a node
        operationQueue.push({type: 'ADD', node});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // We can only update the instance if its element's type matches.
      // For example, <Button size="small" /> can be updated to
      // <Button size="large" /> but not to an <App />.
      var canUpdate = prevChildren[i].type === nextChildren[i].type;

      // If we can't update an existing instance, we have to unmount it
      // and mount a new one instead of it.
      if (!canUpdate) {
        var prevNode = prevChild.getHostNode();
        prevChild.unmount();

        var nextChild = instantiateComponent(nextChildren[i]);
        var nextNode = nextChild.mount();

        // Record that we need to swap the nodes
        operationQueue.push({type: 'REPLACE', prevNode, nextNode});
        nextRenderedChildren.push(nextChild);
        continue;
      }

      // If we can update an existing internal instance,
      // just let it receive the next element and handle its own update.
      prevChild.receive(nextChildren[i]);
      nextRenderedChildren.push(prevChild);
    }

    // Finally, unmount any children that don't exist:
    for (var j = nextChildren.length; j < prevChildren.length; j++) {
      var prevChild = prevRenderedChildren[j];
      var node = prevChild.getHostNode();
      prevChild.unmount();

      // Record that we need to remove the node
      operationQueue.push({type: 'REMOVE', node});
    }

    // Point the list of rendered children to the updated version.
    this.renderedChildren = nextRenderedChildren;

    // ...
```

As the last step, we execute the DOM operations. Again, the real reconciler code is more complex because it also handles moves:

```js
    // ...

    // Process the operation queue.
    while (operationQueue.length > 0) {
      var operation = operationQueue.shift();
      switch (operation.type) {
      case 'ADD':
        this.node.appendChild(operation.node);
        break;
      case 'REPLACE':
        this.node.replaceChild(operation.nextNode, operation.prevNode);
        break;
      case 'REMOVE':
        this.node.removeChild(operation.node);
        break;
      }
    }
  }
}
```

And that is it for updating host components.

### Top-Level Updates {#top-level-updates}

Now that both `CompositeComponent` and `DOMComponent` implement the `receive(nextElement)` method, we can change the top-level `mountTree()` function to use it when the element `type` is the same as it was the last time:

```js
function mountTree(element, containerNode) {
  // Check for an existing tree
  if (containerNode.firstChild) {
    var prevNode = containerNode.firstChild;
    var prevRootComponent = prevNode._internalInstance;
    var prevElement = prevRootComponent.currentElement;

    // If we can, reuse the existing root component
    if (prevElement.type === element.type) {
      prevRootComponent.receive(element);
      return;
    }

    // Otherwise, unmount the existing tree
    unmountTree(containerNode);
  }

  // ...

}
```

Now calling `mountTree()` two times with the same type isn't destructive:

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reuses the existing DOM:
mountTree(<App />, rootEl);
```

These are the basics of how React works internally.

### What We Left Out {#what-we-left-out}

This document is simplified compared to the real codebase. There are a few important aspects we didn't address:

* Components can render `null`, and the reconciler can handle "empty slots" in arrays and rendered output.

* The reconciler also reads `key` from the elements, and uses it to establish which internal instance corresponds to which element in an array. A bulk of complexity in the actual React implementation is related to that.

* In addition to composite and host internal instance classes, there are also classes for "text" and "empty" components. They represent text nodes and the "empty slots" you get by rendering `null`.

* Renderers use [injection](/docs/codebase-overview.html#dynamic-injection) to pass the host internal class to the reconciler. For example, React DOM tells the reconciler to use `ReactDOMComponent` as the host internal instance implementation.

* The logic for updating the list of children is extracted into a mixin called `ReactMultiChild` which is used by the host internal instance class implementations both in React DOM and React Native.

* The reconciler also implements support for `setState()` in composite components. Multiple updates inside event handlers get batched into a single update.

* The reconciler also takes care of attaching and detaching refs to composite components and host nodes.

* Lifecycle methods that are called after the DOM is ready, such as `componentDidMount()` and `componentDidUpdate()`, get collected into "callback queues" and are executed in a single batch.

* React puts information about the current update into an internal object called "transaction". Transactions are useful for keeping track of the queue of pending lifecycle methods, the current DOM nesting for the warnings, and anything else that is "global" to a specific update. Transactions also ensure React "cleans everything up" after updates. For example, the transaction class provided by React DOM restores the input selection after any update.

### Jumping into the Code {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) is where the code like `mountTree()` and `unmountTree()` from this tutorial lives. It takes care of mounting and unmounting top-level components. [`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) is its React Native analog.
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) is the equivalent of `DOMComponent` in this tutorial. It implements the host component class for React DOM renderer. [`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) is its React Native analog.
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) is the equivalent of `CompositeComponent` in this tutorial. It handles calling user-defined components and maintaining their state.
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) contains the switch that picks the right internal instance class to construct for an element. It is equivalent to `instantiateComponent()` in this tutorial.

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) is a wrapper with `mountComponent()`, `receiveComponent()`, and `unmountComponent()` methods. It calls the underlying implementations on the internal instances, but also includes some code around them that is shared by all internal instance implementations.

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) implements the logic for mounting, updating, and unmounting children according to the `key` of their elements.

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) implements processing the operation queue for child insertions, deletions, and moves independently of the renderer.

* `mount()`, `receive()`, and `unmount()` are really called `mountComponent()`, `receiveComponent()`, and `unmountComponent()` in React codebase for legacy reasons, but they receive elements.

* Properties on the internal instances start with an underscore, e.g. `_currentElement`. They are considered to be read-only public fields throughout the codebase.

### Future Directions {#future-directions}

Stack reconciler has inherent limitations such as being synchronous and unable to interrupt the work or split it in chunks. There is a work in progress on the [new Fiber reconciler](/docs/codebase-overview.html#fiber-reconciler) with a [completely different architecture](https://github.com/acdlite/react-fiber-architecture). In the future, we intend to replace stack reconciler with it, but at the moment it is far from feature parity.

### Next Steps {#next-steps}

Read the [next section](/docs/design-principles.html) to learn about the guiding principles we use for React development.
