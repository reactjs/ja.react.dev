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

これは非常に技術的な内容であり、React の公開 API だけでなく、React がどのようにコア、レンダラ (renderer) 、そしてリコンサイラに分割されているかについても、深く理解していることを前提としています。React のコードベースにあまり精通していないのであれば、まず[コードベースの概要](/docs/codebase-overview.html)を読んでください。

また、これは [React のコンポーネント、インスタンスおよび要素の違い](/blog/2015/12/18/react-components-elements-and-instances.html)についての理解を前提としています。

stack リコンサイラは、React 15 およびそれ以前のバージョンで使われていました。[src/renderers/shared/stack/reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler) で見つけることができます。

### 動画：React をスクラッチで作成する {#video-building-react-from-scratch}

このドキュメントは、[Paul O'Shannessy](https://twitter.com/zpao) 氏の行った講演 [building React from scratch](https://www.youtube.com/watch?v=_MAD4Oly9yg) に大いに啓発されています。

このドキュメントと彼の講演は、ともに実際のコードベースを簡素化したもので、両方に親しむことでより深く理解することができるでしょう。

### 概要 {#overview}

リコンサイラそのものは公開 API を持ちません。リコンサイラは、React DOM や React Native のような [レンダラ](/docs/codebase-overview.html#renderers) が、ユーザーの記述した React コンポーネントに応じてユーザーインターフェースを効率よく更新するために使用されます。

### 再帰的な処理としてマウントする {#mounting-as-a-recursive-process}

一番最初にコンポーネントをマウントするときのことを考えてみましょう：

```js
ReactDOM.render(<App />, rootEl);
```

React DOM はリコンサイラに `<App />` を渡します。`<App />` が React 要素であること、つまり、**何**をレンダリングするかの説明書きであることを思い出してください。これはプレーンなオブジェクトとして考えることができます：

```js
console.log(<App />);
// { type: App, props: {} }
```

リコンサイラは `App` がクラスか関数かをチェックします。

もし `App` が関数なら、リコンサイラは `App(props)` を呼び出してレンダーされた要素を取得します。

もし `App` がクラスなら、リコンサイラは `new App(props)` で `App` をインスタンス化し、`componentWillMount()` ライフサイクルメソッドを呼び出し、それから `render()` メソッドを呼び出してレンダーされた要素を取得します。

どちらにせよ、リコンサイラは `App` が「レンダーされた」結果となる要素を手に入れます。

このプロセスは再帰的です。`App` は `<Greeting />` へとレンダーされるかもしれませんし、`Greeting` は `<Button />` にレンダーされるかもしれない、といったように続いていきます。リコンサイラはそれぞれのコンポーネントが何にレンダーされるかを学習しながら、ユーザ定義コンポーネントを再帰的に「掘り下げて」いきます。

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

>**補足：**
>
>これは**全くの**擬似コードです。本物の実装に近いものではありません。また、いつ再帰を止めるか検討していないため、このコードはスタックオーバーフローを引き起こします。

上記の例でいくつかの鍵となるアイデアをおさらいしましょう：

* React 要素とはコンポーネントの型（例えば `App`）と props を表すプレーンなオブジェクトである。
* ユーザー定義コンポーネント（例えば `App`）はクラスであっても関数であってもよいが、それらは全て要素へと「レンダーされる」。
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

リコンサイラは host 要素を見つけると、レンダラに host 要素のマウントを任せます。例えば、React DOM は DOM ノードを生成します。

host 要素に子要素がある場合、リコンサイラは前節で述べたものと同じアルゴリズムに従い、子要素を再帰的にマウントします。子要素が（`<div><hr /></div>` のような）host なのか、（`<div><Button /></div>` のような）composite なのか、もしくはその両方が含まれているかに関わらず、再帰的な処理が実行されます。

子コンポーネントにより生成された DOM ノードは親の DOM ノードに追加され、それが再帰的に行われることで、完全な DOM 構造が組み立てられます。

>**補足：**
>
>リコンサイラそのものは DOM と結合していません。マウントの結果自体（時にソースコードでは "mount image" とも呼ばれます）はレンダラに依存し、それは（React DOM なら）DOM ノード であったり、（React DOM Server なら）文字列であったり、（React Native なら）ネイティブのビューを表す数字であったりします。

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

しかし、前節で実装したコードは最初のツリーをマウントする方法しか知りません。前節のコードは、全ての `publicInstance` や、どの DOM `node` がどのコンポーネントに対応しているかなど、必要な全情報を保有しているわけではないので、更新を実行することができません。

stack リコンサイラのコードベースでは、この問題を `mount()` 関数をメソッドとしてクラスに置くことで解決しています。しかしこのアプローチには欠点があるため、[進行中のリコンサイラの書き直し作業](/docs/codebase-overview.html#fiber-reconciler)では、反対の方向に進んでいます。それでも現時点では、この方式で動作しています。

別々の `mountHost` と `mountComposite` 関数の代わりに、2 つのクラスを作成します： `DOMComponent` と `CompositeComponent` です。

両方のクラスが `element` を受け入れるコンストラクタと、マウントされたノードを返す `mount()` メソッドを持ちます。最上位の `mount()` 関数を、正しいクラスをインスタンス化するファクトリに置き換えます：

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

`CompositeComponent` のインスタンスは、ユーザーが指定する `element.type` のインスタンスとは同一ではないことに注意してください。`CompositeComponent` はリコンサイラの実装の詳細であり、ユーザーには決して公開されません。ユーザー定義クラスとは `element.type` から読み込むものであり、`CompositeComponent` がそのインスタンスを作成するのです。

混乱を避けるために、`CompositeComponent` と `DOMComponent` のインスタンスを「内部インスタンス」と呼ぶことにします。内部インスタンスは、長期間利用されるデータとそれらを関連付けられるようにするために存在します。それらの存在はレンダラとリコンサイラのみが認識しています。

一方、ユーザー定義クラスのインスタンスは「公開インスタンス」と呼ぶことにします。公開インスタンスは、独自コンポーネントの `render()` やその他のメソッド内で `this` として現れるものです。

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

mountHost() からリファクタリングした後の主な違いは、`this.node` と `this.renderedChildren` を内部の DOM コンポーネントインスタンスに関連付け続けていることです。これらは、将来的に非破壊的な更新を適用する際にも使用します。

結果として、それが composite であれ host であれ、内部インスタンスはそれぞれの子内部インスタンスを指すようになります。`<App>` 関数コンポーネントが `<Button>` コンポーネントをレンダーし、`<Button>` クラスが `<div>`をレンダーする場合、視覚的にわかりやすくすると、内部インスタンスのツリーはこのようになります：

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
* 単独の、レンダーされた内部インスタンス。これは `DOMComponent` か `CompositeComponent` のいずれかにあたります。

host 内部インスタンスは以下のものを格納する必要があります：

* 現在の要素。
* DOM ノード。
* すべての子内部インタスタンス。各インスタンスは、`DOMComponent` または `CompositeComponent` のいずれかになります。

より複雑なアプリケーションにおいて、内部インスタンスのツリーがどのような構造になるのか想像しづらい場合は、[React DevTools](https://github.com/facebook/react-devtools) が host インスタンスを灰色に、composite インスタンスを紫色にハイライトしてくれるので、内部インスタンスのツリーにかなり近いものを得ることができます：

 <img src="../images/docs/implementation-notes-tree.png" width="500" style="max-width: 100%" alt="React DevTools tree" />

このリファクタリングを完了するため、コンテナノードへ完成したツリーをマウントする、`ReactDOM.render()` のような関数を導入します。この関数は `ReactDOM.render()` のように公開インスタンスを返します：

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

実際には、DOM コンポーネントをアンマウントすると、イベントリスナの削除とキャッシュのクリアも行われますが、これらの詳細は省略します。

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

これが動作するよう、DOM ノードから内部ルートインスタンスを読み込む必要があります。`mountTree()` を変更して、ルート DOM ノードに `_internalInstance` プロパティを追加します。`mountTree()` に既存の全てのツリーを破棄するようにも伝えて、複数回 `mountTree()` を呼び出せるようにします：

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

前節では、アンマウント機能を実装しました。しかし、各プロパティに変更があるたびにツリー全体をマウントしたりアンマウントしたりするようでは、React の使い勝手はあまり良いとは言えません。リコンサイラの目標は、DOM と state を保持できるように既存のインスタンスを再利用することです。

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Should reuse the existing DOM:
mountTree(<App />, rootEl);
```

もう 1 つメソッドを追加して内部インスタンスを拡張しましょう。`mount()` と `unmount()` に加えて、`DOMComponent` と `CompositeComponent` の両方に `receive(nextElement)` と呼ばれる新しいメソッドを実装しましょう：

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

このメソッドは、`nextElement` から受け取った指示に従って、コンポーネント（および全ての子要素）を最新の状態にするために必要なあらゆる作業を行う役割を担います。

実際に行われているのは、内部ツリーを再帰的に巡回して各内部インスタンスが更新を受け取れるようにすることなのですが、この処理こそ「仮想 DOM の差分処理 (diffing)」としてしばしば説明される部分です。

### composite コンポーネントの更新 {#updating-composite-components}

composite コンポーネントが新たな要素を受け取るときに、`componentWillUpdate()` ライフサイクルメソッドを実行します。

それからコンポーネントを新たな props で再レンダーし、レンダーされた次の要素を取得します：

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

続いて、レンダーされた要素の `type` を見てみましょう。もし最後のレンダー以降、`type` が変更されていなければ、これより下のコンポーネントもその場で更新されれば良いということになります。

例えばコンポーネントが最初に `<Button color="red" />` を返し、2 回目に `<Button color="blue" />` を返したなら、対応する内部インスタンスに次の要素を receive() するよう伝えるだけでよいのです：

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

ただし、レンダーされた次の要素が前のものと異なる `type` である場合、内部インスタンスの更新はできません。`<button>` が `<input>` に「なる」ことはできないのです。

代わりに、既存の内部インスタンスをアンマウントし、レンダーされた要素の型に対応する新たな内部インスタンスをマウントします。例えば、前に `<button />` をレンダーしていたコンポーネントが `<input />` をレンダーした場合には、この処理が発生します：

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

まとめると、composite コンポーネントは新たな要素を受け取った際に、レンダーされた内部インスタンスに更新を委任するか、もしくは内部インスタンスをアンマウントしてそこに新しいものをマウントする、ということになります。

もう 1 つ、コンポーネントが要素を受け取らずに再マウントする状況があります。それは要素の `key` が変更された時です。既に複雑なチュートリアルがさらに複雑になってしまうので、このドキュメントでは `key` の取り扱いについては言及しません。

プラットフォーム固有のノードを配置して更新時に置換できるよう、`getHostNode()` と呼ばれるメソッドを内部インスタンスに追加する必要があったことに注意してください。その実装は両方のクラスで簡単にできます：

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

### host コンポーネントの更新 {#updating-host-components}

`DOMComponent` のような host コンポーネントの実装では、異なった更新を行います。要素を受け取る際、背後のプラットフォーム固有のビューを更新する必要があるのです。React DOM の場合、これは DOM 属性の更新を意味します：

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

そして、host コンポーネントは子コンポーネントを更新する必要があります。composite コンポーネントと異なり、host コンポーネントは 1 つ以上の子コンポーネントを保有している可能性があります。

この簡素化した例では内部インスタンスの配列を用い、受け取った `type` と以前の `type` が一致するかによって、内部インスタンスを更新もしくは置換しながら、配列をイテレートしています。実際のリコンサイラでは処理時に要素の `key` を考慮して、要素の挿入と削除に加えて移動を追跡しますが、そのロジックは省略しています。

リストの子要素への DOM 操作は、バッチで実行できるようまとめておきます：

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

最後のステップとして、DOM 操作を実行します。ここでも、実際のリコンサイラのコードは要素の移動を扱わなければいけないので、より複雑になります：

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

host コンポーネントの更新については以上です。

### 最上位コンポーネントの更新 {#top-level-updates}

ここまでで `CompositeComponent` と `DOMComponent` の両方ともが `receive(nextElement)` メソッドを実装しているので、要素の type が前回と同じだった場合は最上位の `mountTree()`関数がそれを使えるよう、この関数を書き換えることができます：

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

これで、同じ型で `mountTree()` を 2 回呼び出しても、破壊的な変更にはなりません：

```js
var rootEl = document.getElementById('root');

mountTree(<App />, rootEl);
// Reuses the existing DOM:
mountTree(<App />, rootEl);
```

以上の処理が React 内部での動作の仕組みの基本です。

### このドキュメントで除外したもの {#what-we-left-out}

このドキュメントは、実際のコードベースよりもシンプルなものになっています。ここでは言及しなかった重要なポイントがいくつかあります：

* コンポーネントは `null` をレンダーでき、リコンサイラは配列やレンダーされた出力における「空スロット」部分を扱うことができます。

* リコンサイラは要素から `key` も読み取り、どの内部インスタンスが配列中のどの要素と対応するかを確認するのに使用します。実際の React の実装における複雑さのかなりの部分が、この箇所に関わるものです。

* composite と host 型の内部インスタンスのクラスに加えて、"text" と "empty" コンポーネントのクラスもあります。それらはテキストノードと、`null` をレンダーすると得られる「空のスロット」を表します。

* レンダラは[依存性注入](/docs/codebase-overview.html#dynamic-injection)を利用して host 内部クラスをリコンサイラに渡します。例えば、React DOM はリコンサイラに `ReactDOMComponent` を host 内部インスタンスの実装として使用するように指示します。

* 子要素のリストを更新するロジックは `ReactMultiChild` と呼ばれるミックスインに抽出され、そのミックスインが、React DOM および React Native 両方における host 内部インスタンスのクラスの実装に使用されます。

* リコンサイラは composite 要素における `setState()` のサポートも実装しています。イベントハンドラ内部での複数の更新は、単一の更新にバッチ処理されます。

* リコンサイラは、composite コンポーネントおよび host ノードへの ref の追加と削除についても対応しています。

* DOM の準備ができあがった後に呼び出される、`componentDidMount()` や `componentDidUpdate()` のようなライフサイクルメソッドは `callback queues` に集められ、単一のバッチの中で実行されます。

* React は現時点での更新についての情報を「トランザクション ("transaction")」と呼ばれる内部オブジェクトに格納します。トランザクションは、保留中のライフサイクルメソッドのキューや、警告の際に使用する現在の DOM のネスト構造、そしてある特定の更新に対して「グローバル」になっているその他あらゆるものの経過を追うのに重宝します。トランザクションによって React が更新後に「全てをクリーンアップする」よう保証できます。例えば、React DOM が提供するトランザクションクラスは、入力フィールドの選択状態を更新後に復元します。

### コードに飛び込む {#jumping-into-the-code}

* [`ReactMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/client/ReactMount.js) はこのチュートリアルにある `mountTree()` や `unmountTree()` のようなコードがある場所です。ここでは最上位コンポーネントのマウントやアンマウントが行われます。[`ReactNativeMount`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeMount.js) はその React Native 版です。
* [`ReactDOMComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/dom/shared/ReactDOMComponent.js) はこのチュートリアルでの `DOMComponent` にあたります。これは、React DOM レンダラ向けの host コンポーネントクラスを実装するものです。[`ReactNativeBaseComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/native/ReactNativeBaseComponent.js) はその React Native 版です。
* [`ReactCompositeComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js) はこのチュートリアルでの `CompositeComponent` にあたります。これは、ユーザー定義コンポーネントの呼び出しとその state の保持を扱います。
* [`instantiateReactComponent`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/instantiateReactComponent.js) はある要素に対して構築すべき正しい内部インスタンスクラスを選ぶスイッチを持っています。これは、このチュートリアルにおける `instantiateComponent()` にあたります。

* [`ReactReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactReconciler.js) は `mountComponent()`、`receiveComponent()`、そして `unmountComponent()` メソッドのラッパーです。これは水面下で内部インスタンスの実装を呼び出しますが、それらに追加するコードも含んでおり、その追加コードは全ての内部インスタンスの実装で共有されます。

* [`ReactChildReconciler`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactChildReconciler.js) は子要素を要素の `key` に基づいてマウント、更新、そしてアンマウントするロジックを実装しています。

* [`ReactMultiChild`](https://github.com/facebook/react/blob/83381c1673d14cd16cf747e34c945291e5518a86/src/renderers/shared/stack/reconciler/ReactMultiChild.js) は、子要素の挿入、削除、そして移動の操作に関するキューの処理を、レンダラとは独立して実装します。

* `mount()` と `receive()`、そして `unmount()` は、実際の React のコードベースでは歴史的な理由から、`mountComponent()`、`receiveComponent()`、そして `unmountComponent()`と呼ばれていますが、これらは要素を受け取っています。

* 内部インスタンス上のプロパティ名は、`_currentElement` のようにアンダースコアから始まります。これらはコードベース全体を通じて、読み取り専用の public なフィールドと見なされます。

### 今後の方向性 {#future-directions}

stack リコンサイラには、同期的処理であることや、作業を中断したりチャンクに分割したりできないといったことなど、固有の制限があります。現在、[全く異なるアーキテクチャ](https://github.com/acdlite/react-fiber-architecture)による[新たな Fiber リコンサイラ](/docs/codebase-overview.html#fiber-reconciler)の開発が進行中です。将来的には、stack リコンサイラをこれに置き換える予定ですが、現時点では同等の機能を提供するには程遠い状態です。

### 次のステップ {#next-steps}

React の開発時に私たちが使用するガイドラインについて学ぶには、[次の章](/docs/design-principles.html)を読んでください。
