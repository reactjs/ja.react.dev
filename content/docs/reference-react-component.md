---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

このページには React コンポーネントクラス定義の詳細な API リファレンスがあります。また、あなたが [コンポーネントや props](/docs/components-and-props.html) などの基本的な React の概念、および [state やライフサイクル](/docs/state-and-lifecycle.html)に精通していることを前提としています。そうでない場合は、まずそれらを読んでください。

## 概要 {#overview}

React では、コンポーネントをクラスまたは関数として定義できます。クラスとして定義されたコンポーネントは現在このページで詳細に説明されているより多くの機能を提供します。React コンポーネントクラスを定義するには、`React.Component` を継承する必要があります。

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

`React.Component` サブクラスで*必ず*定義しなければならない唯一のメソッドは [`render()`](#render) です。このページで説明されている他のすべてのメソッドは任意です。

**独自の基底コンポーネントクラスを作成しないことを強くおすすめします。**React コンポーネントでは、[コードの再利用は主に継承ではなく合成によって行われます](/docs/composition-vs-inheritance.html)。

>補足:
>
>React は ES6 クラスの構文を使うことを強制していません。回避したい場合は、代わりに `create-react-class` モジュールまたは、同様の独自の抽象化を使用できます。詳しくは、[Using React without ES6](/docs/react-without-es6.html) をご覧ください。

### コンポーネントライフサイクル {#the-component-lifecycle}

各コンポーネントには、処理の過程の特定の時点でコードを実行するためにオーバーライドできるいくつかの「ライフサイクルメソッド」があります。**この[ライフサイクル図](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)をチートシートとして使用できます。**以下のリストでは、よく使われるライフサイクルメソッドは**太字**で表示されています。それらの残りは比較的まれなユースケースのために存在します。

#### マウント {#mounting}

コンポーネントのインスタンスが作成されて DOM に挿入されるときに、これらのメソッドが次の順序で呼び出されます。

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>補足:
>
>これらのメソッドはレガシーだと考えられているため、新しいコードでは[避ける](/blog/2018/03/27/update-on-async-rendering.html)べきです。
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### 更新 {#updating}

更新は props や state の変更によって発生する可能性があります。コンポーネントが再レンダーされるときに、これらのメソッドは次の順序で呼び出されます。

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>補足:
>
>これらのメソッドはレガシーと見なされ、新しいコードでは避けるべきです。
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### アンマウント {#unmounting}

このメソッドは、コンポーネントが DOM から削除されるときに呼び出されます。

- [**`componentWillUnmount()`**](#componentwillunmount)

#### エラーハンドリング {#error-handling}

これらのメソッドは任意の子コンポーネントのレンダー中、ライフサイクルメソッド内、またはコンストラクタ内でエラーが発生したときに呼び出されます。

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### 他の API {#other-apis}

各コンポーネントはその他にもいくつかの API を提供します。

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### クラスプロパティ {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### インスタンスプロパティ {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## リファレンス {#reference}

### よく使われるライフサイクルメソッド {#commonly-used-lifecycle-methods}

このセクションのメソッドは、React コンポーネントを作成する際に遭遇する大部分のユースケースを網羅しています。視覚的なリファレンスとして、この[ライフサイクル図](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)もチェックしてみてください。

### `render()` {#render}

```javascript
render()
```

`render()` メソッドは、クラスコンポーネントで必ず定義しなければならない唯一のメソッドです。

呼び出されると、`this.props` と `this.state` を調べて、次のいずれかの型を返します。

- **React 要素** 通常は [JSX](/docs/introducing-jsx.html) 経由で作成されます。例えば、`<div />` や `<MyComponent />` はそれぞれ React に DOM ノードやユーザが定義した他のコンポーネントをレンダーするように指示する React 要素です
- **配列とフラグメント** 複数の要素を `render()` から返します。詳しくは [フラグメント](/docs/fragments.html) を参照してください
- **ポータル** 子を異なる DOM サブツリーにレンダーします。詳しくは [ポータル](/docs/portals.html) を参照してください
- **文字列と数値** これは DOM のテキストノードとしてレンダーされます
- **真偽値または `null`** 何もレンダーしません。(ほとんどの場合、`return test && <Child />` パターンをサポートするために存在しています。ここで、`test` は真偽値です）

`render()` 関数は「純粋」でなければなりません。つまり、コンポーネントの state を変更せず、呼び出されるたびに同じ結果を返し、ブラウザと直接対話しないということです。

ブラウザと対話する必要がある場合は、代わりに `componentDidMount()` や他のライフサイクルメソッドで行います。`render()` を純粋にしておくことで、コンポーネントについて考えやすくなります。

> 補足
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate) が false を返した場合、`render()` は呼び出されません。

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**state の初期化もメソッドのバインドもしないのであれば、React コンポーネントのコンストラクタを実装する必要はありません。**

React コンポーネントのコンストラクタは、マウントされる前に呼び出されます。`React.Component` サブクラスのコンストラクタを実装するときは、他の文の前に `super(props)` を呼び出す必要があります。そうでなければ、`this.props` はコンストラクタ内で未定義になり、バグの原因となる可能性があります。

通常、React では、コンストラクタは 2 つの目的にのみ使用されます。

* `this.state` にオブジェクトを代入して [ローカル state](/docs/state-and-lifecycle.html) を初期化すること
* [イベントハンドラ](/docs/handling-events.html) をインスタンスにバインドすること

`constructor()` の中で **`setState()` を呼び出さないでください**。代わりに、コンポーネントがローカル state を使用する必要がある場合は、コンストラクタで直接 **`this.state` に初期状態を割り当てます**。

```js
constructor(props) {
  super(props);
  // ここで this.setState() を呼び出さないでください
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

コンストラクタは、`this.state` を直接代入する唯一の場所です。他のすべてのメソッドでは、代わりに `this.setState()` を使う必要があります。

コンストラクタに副作用や購読を導入しないでください。そのような場合は、代わりに `componentDidMount()` を使用してください。

>補足
>
>**props を state にコピーしないでください。これはよくある間違いです。**
>
>```js
>constructor(props) {
>  super(props);
>  // してはいけません
>  this.state = { color: props.color };
>}
>```
>
>この問題はそれが不要(代わりに `this.props.color` を直接使用することができるため)であり、バグの作成につながる(`color` プロパティの更新は state に反映されないため)ことです。
>
>**意図的にプロパティの更新を無視したい場合にのみ、このパターンを使用してください。**その場合は、プロパティの名前を `initialColor` または `defaultColor` に変更してください。その後、必要に応じて[キーを変更する](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)ことで、コンポーネントにその内部の state を「リセット」させることができます。
>
>もしあなたが props に依存する何らかの state が必要だと思うなら、どうすればいいのか学ぶために私達の[派生 state を避けることについてのブログ記事](/blog/2018/06/07/you-probably-dont-need-derived-state.html)を読んでください。


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` は、コンポーネントがマウントされた（ツリーに挿入された）直後に呼び出されます。DOM ノードを必要とする初期化はここで行われるべきです。リモートエンドポイントからデータをロードする必要がある場合、これはネットワークリクエストを送信するのに適した場所です。

このメソッドは、購読を設定するのに適した場所です。設定した場合は、`componentWillUnmount()` で購読を解除することを忘れないでください。

`componentDidMount()` の中で、あなたは**すぐに `setState()` を呼び出すことができます**。それは余分なレンダーを引き起こしますが、ブラウザが画面を更新する前に起こります。これにより、この場合 `render()` が 2 回呼び出されても、ユーザには中間状態が表示されません。このパターンはパフォーマンス上の問題を引き起こすことが多いので、慎重に使用してください。ほとんどの場合、代わりに `constructor()` で初期状態を state に代入できるはずです。ただし、モーダルやツールチップのような場合に、サイズや位置に応じて何かをレンダーする前に DOM ノードを測定することが必要になる場合があります。

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

更新が行われた直後に `componentDidUpdate()` が呼び出されます。このメソッドは最初のレンダーでは呼び出されません。

コンポーネントが更新されたときに DOM を操作する機会にこれを使用してください。現在の props と前の props を比較している限り、これはネットワークリクエストを行うのにも適した場所です（たとえば、props が変更されていない場合、ネットワークリクエストは必要ないかもしれません）。

```js
componentDidUpdate(prevProps) {
  // 典型的な使い方(props を比較することを忘れないでください)
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

`componentDidUpdate()` の中で、あなたは**すぐに `setState()` を呼び出すことができます**が、それは上記の例のような**条件でラップされなければならない**ことに注意してください。そうしなければ、無限ループを引き起こすでしょう。また、余分な再レンダーが発生し、ユーザには見えないものの、コンポーネントのパフォーマンスに影響を与える可能性があります。親から来る props を何らかの state に「反映」しようとしている場合は、代わりに props を直接使用することを検討してください。[props を state にコピーするとバグが発生する理由](/blog/2018/06/07/you-probably-dont-need-derived-state.html)をよく読んでください。

コンポーネントが `getSnapshotBeforeUpdate()` ライフサイクルを実装している場合（これはまれです）、それが返す値は 3 番目の「スナップショット」パラメータとして `componentDidUpdate()` に渡されます。それ以外の場合、このパラメータは未定義になります。

> 補足
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate) が false を返した場合、`componentDidUpdate()` は呼び出されません。

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` は、コンポーネントがアンマウントされて破棄される直前に呼び出されます。タイマーの無効化、ネットワークリクエストのキャンセル、`componentDidMount()` で作成された購読の解除など、このメソッドで必要なクリーンアップを実行します。

コンポーネントは再レンダーされないため、`componentWillUnmount()` で **`setState()` を呼び出さないでください**。コンポーネントインスタンスがアンマウントされると、再度マウントされることはありません。

* * *

### まれに使われるライフサイクルメソッド {#rarely-used-lifecycle-methods}

このセクションのメソッドは、一般的でないユースケースに対応しています。これらは時々便利に使えますが、あなたのコンポーネントのほとんどはおそらくそれらのどれも必要としないでしょう。**この[ライフサイクル図](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)の上部にある「あまり一般的ではないライフサイクルを表示する」チェックボックスをクリックすると、以下のほとんどの方法が表示されます。**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

コンポーネントの出力が現在の state の変化や props の影響を受けていないかどうかを React に知らせるには `shouldComponentUpdate()` を使用します。デフォルトの振る舞いはすべての状態変化を再レンダーすることです、そして大部分の場合、あなたはデフォルトの振る舞いに頼るべきです。

新しい props または state が受け取られると、レンダーする前に `shouldComponentUpdate()` が呼び出されます。デフォルトは `true` です。このメソッドは最初のレンダーや `forceUpdate()` の使用時には呼び出されません。

このメソッドは[パフォーマンスの最適化](/docs/optimizing-performance.html)としてのみ存在します。バグを引き起こす可能性があるので、レンダーを「抑止する」ためにそれを使用しないでください。`shouldComponentUpdate()` を書く代わりに、**組み込みの [PureComponent](/docs/react-api.html#reactpurecomponent)** を使用することを検討してください。`PureComponent` は props と state を浅く比較し、必要なアップデートをスキップする可能性を減らします。

あなたが手でそれを書きたいと確信しているなら、あなたは `nextProps` と `this.props` または `nextState` と `this.state` を比較して、更新をスキップできることを React に伝えるために `false` を返すことができます。`false` を返しても、*子コンポーネントの* state が変化したときに子コンポーネントが再レンダーされるのを防ぐことはできません。

等価性を深く調べることや `shouldComponentUpdate()` で `JSON.stringify()` を使用することはおすすめしません。これは非常に非効率的であり、パフォーマンスに悪影響を及ぼします。

現在、`shouldComponentUpdate()` が `false` を返す場合、[`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)、[`render()`](#render)、および [`componentDidUpdate()`](#componentdidupdate) は呼び出されません。将来的には、React は `shouldComponentUpdate()` を厳密な命令ではなくヒントとして扱うようになり、`false` を返してもコンポーネントが再レンダーされる可能性があります。

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` は、初期マウント時とその後の更新時の両方で、`render()` メソッドを呼び出す直前に呼び出されます。state を更新するためにオブジェクトを返すか、何も更新しない場合は `null` を返すべきです。

このメソッドは、state が時間の経過とともに変化する props に依存するような[まれな使用例](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)のために存在します。たとえば、以前と以降の子を比較してどちらの子をアニメーションするかを決定する `<Transition>` コンポーネントを実装するときに便利です。

state を派生させると冗長なコードにつながり、コンポーネントを考えるのが難しくなります。
[あなたがより簡単な方法に慣れていることを確認してください。](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* props の変更に応じて**副作用を実行する**必要がある場合は（データのフェッチやアニメーションなど）、代わりに [`componentDidUpdate`](#componentdidupdate) ライフサイクルを使用してください

* **プロパティが変更されたときにのみデータを再計算したい**場合は、[代わりにメモ化ヘルパーを使用してください](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)

* **プロパティが変更されたときに何かの state を「リセット」したい**場合は、代わりにコンポーネントを[完全に制御する](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)か、または [`key` を使って全く制御しない](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)かを検討してください

このメソッドはコンポーネントインスタンスにアクセスできません。必要に応じて、コンポーネントの props と state の純粋な関数を抽出し、クラス定義外に記述することで、`getDerivedStateFromProps()` と他のクラスメソッドの間でコードを再利用できます。

このメソッドは、原因に関係なく、*すべての*レンダーで起動されることに注意してください。これは `UNSAFE_componentWillReceiveProps` とは対照的です。`UNSAFE_componentWillReceiveProps` は、ローカルの `setState()` に依らず、親が再レンダーを行ったときにのみ発生します。

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` は、最後にレンダーされた出力が、たとえば DOM にコミットされる直前に呼び出されます。これはコンポーネントが変更される可能性があるときに、変更される前に DOM からある情報（たとえば、スクロール位置）を取得することを可能にします。このライフサイクルによって返された値はすべて、`componentDidUpdate()` へのパラメータとして渡されます。

このユースケースは一般的ではありませんが、スクロール位置を特別な方法で処理する必要があるチャットのスレッドのような UI で発生する可能性があります。

スナップショット値（または `null`）が返されるべきです。

例：

`embed:react-component-reference/get-snapshot-before-update.js`

この例では、`getSnapshotBeforeUpdate` の中で `scrollHeight` プロパティを読み取ることが重要です。これは、（`render` のような）「描画」フェーズライフサイクルと（`getSnapshotBeforeUpdate` および `componentDidUpdate` のような）「コミット」フェーズライフサイクルの間に遅延が生じるためです。

* * *

### error boundary {#error-boundaries}

[error boundary](/docs/error-boundaries.html) は、子コンポーネントツリーのどこかで JavaScript エラーを捕捉し、それらのエラーを記録し、クラッシュしたコンポーネントツリーの代わりにフォールバック UI を表示する React コンポーネントです。error boundary は、その下のツリー全体のレンダー中、ライフサイクルメソッド内、およびコンストラクタ内で発生したエラーを捕捉します。

クラスコンポーネントは、ライフサイクルメソッド `static getDerivedStateFromError()` または `componentDidCatch()` のいずれか（または両方）を定義すると、error boundary になります。これらのライフサイクルから state を更新すると、下のツリーで発生した未処理の JavaScript エラーを捕捉してフォールバック UI を表示できます。

error boundary は予期しない例外からの回復のためだけに使用してください。**それらを制御フローに使用しないでください**。

詳細については、[*React 16 のエラーハンドリング*](/blog/2017/07/26/error-handling-in-react-16.html)を参照してください。

> 補足
> 
> error boundary は、ツリー内でその**下**にあるコンポーネント内のエラーのみを捕捉します。error boundary はそれ自体の中でエラーを捉えることはできません。

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

このライフサイクルは、子孫コンポーネントによってエラーがスローされた後に呼び出されます。
パラメータとしてスローされたエラーを受け取り、state を更新するための値を返すべきです。

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 次のレンダーでフォールバック UI が表示されるように state を更新する
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // 任意のフォールバック UI をレンダーできます
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> 補足
>
> `getDerivedStateFromError()` は「描画」フェーズ中に呼び出されるので、副作用は許可されていません。そのような場合は、代わりに `componentDidCatch()` を使用してください。

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

このライフサイクルは、子孫コンポーネントによってエラーがスローされた後に呼び出されます。
以下の 2 つのパラメータを受け取ります。

1. `error` - スローされたエラー
2. `info` - [どのコンポーネントがエラーをスローしたかについての情報](/docs/error-boundaries.html#component-stack-traces)を含む `componentStack` キーを持つオブジェクト

`componentDidCatch()` は「コミット」フェーズ中に呼び出されるため、副作用は許可されています。
ロギング時のエラーなどのために使用されるべきです。

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 次のレンダーでフォールバック UI が表示されるように state を更新します
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // 任意のフォールバック UI をレンダーできます
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> 補足
> 
> エラーが発生した場合は、`setState` を呼び出す `componentDidCatch()` を使用してフォールバック UI をレンダーできますが、これは将来のリリースでは推奨されなくなります。
> 代わりにフォールバックの描画を扱うために、`static getDerivedStateFromError()` を使用してください。

* * *

### レガシーなライフサイクルメソッド {#legacy-lifecycle-methods}

以下のライフサイクルメソッドは「レガシー」としてマークされています。動作はしますが、新しいコードで使用することはおすすめしません。この[ブログ記事](/blog/2018/03/27/update-on-async-rendering.html)では、レガシーなライフサイクルメソッドからの移行についてさらに学ぶことができます。

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> 補足
>
> このライフサイクルは、以前は `componentWillMount` という名前でした。その名前はバージョン 17 まで機能し続けます。コンポーネントを自動的に更新するには、[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) を使用してください。

マウントが行われる直前に `UNSAFE_componentWillMount()` が呼び出されます。これは `render()` の前に呼び出されるので、このメソッドで `setState()` を同期的に呼び出しても余分なレンダーは行われません。一般に、state を初期化するためには代わりに `constructor()` を使うことをおすすめします。

このメソッドでは、副作用や購読を導入しないでください。そのような場合は、代わりに `componentDidMount()` を使用してください。

これは、サーバーレンダリングで呼び出される唯一のライフサイクルメソッドです。

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> 補足
>
> このライフサイクルは、以前は `componentWillReceiveProps` という名前でした。その名前はバージョン 17 まで機能し続けます。コンポーネントを自動的に更新するには、[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) を使用してください。

> 補足:
>
>
> このライフサイクルメソッドを使用すると、しばしばバグや矛盾が発生します。
>
> * props の変更に応じて**副作用を実行する**必要がある場合は（データの取得やアニメーションなど）、代わりに [`componentDidUpdate`](#componentdidupdate) ライフサイクルを使用してください
> * `componentWillReceiveProps` を **props が変更されたときにのみデータを再計算する**ために使う代わりに、[メモ化ヘルパーを使用してください](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
> * `componentWillReceiveProps` を **props が変更されたときに何かの state を「リセット」する**ために使う代わりに、コンポーネントを[完全に制御する](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)か、または [`key` を使って全く制御しない](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)かを検討してください
>
> その他の使用例については、[派生 state に関するこのブログ投稿の推奨事項に従ってください](/blog/2018/06/07/you-probably-dont-need-derived-state.html)。

`UNSAFE_componentWillReceiveProps()` は、マウントされたコンポーネントが新しい props を受け取る前に呼び出されます。prop の変更に応じて state を更新する必要がある場合（たとえばリセットする必要がある場合）は、`this.props` と `nextProps` を比較し、このメソッドで `this.setState()` を使用して状態遷移を実行できます。

親コンポーネントによってコンポーネントが再レンダーされる場合、props が変更されていなくてもこのメソッドが呼び出されることに注意してください。変更だけを処理したい場合は、必ず現在の値と次の値を比較してください。

[マウント](#mounting)時に、React は最初の props で `UNSAFE_componentWillReceiveProps()` を呼び出しません。一部のコンポーネントの props が更新される可能性がある場合にのみ、このメソッドを呼び出します。`this.setState()` を呼び出しても、通常 `UNSAFE_componentWillReceiveProps()` は呼び出されません。

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> 補足
>
> このライフサイクルは、以前は `componentWillUpdate` と呼ばれていました。その名前はバージョン 17 まで機能し続けます。コンポーネントを自動的に更新するには、[`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) を使用してください。

`UNSAFE_componentWillUpdate()` は、新しい props または state を受け取ったときにレンダーの直前に呼び出されます。更新が発生する前の準備する機会としてこれを使用してください。このメソッドは最初のレンダーでは呼び出されません。

ここで `this.setState()` を呼び出すことはできません。また、`UNSAFE_componentWillUpdate()` が返る前に React コンポーネントへの更新を引き起こすような何か他のこと（たとえば、Redux アクションのディスパッチ）をするべきでもありません。

通常、このメソッドは `componentDidUpdate()` に置き換えることができます。このメソッドで DOM から読んでいる場合（スクロール位置を保存するなど）は、そのロジックを `getSnapshotBeforeUpdate()` に移動できます。

> 補足
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate) が false を返した場合、`UNSAFE_componentWillUpdate()` は呼び出されません。

* * *

## 他の API {#other-apis-1}

上記のライフサイクルメソッド（React が呼び出すもの）とは異なり、以下のメソッドは*あなたが*コンポーネントから呼び出すことができるメソッドです。

それは `setState()` と `forceUpdate()` の 2 つだけです。

### `setState()` {#setstate}

```javascript
setState(updater, [callback])
```

`setState()` はコンポーネントの state への変更をエンキューし、このコンポーネントとその子を更新された state で再レンダーする必要があることを React に伝えます。これは、イベントハンドラとサーバーの応答に応じてユーザインターフェイスを更新するために使用する主な方法です。

`setState()` は、コンポーネントを更新するための即時のコマンドではなく、**要求**として考えてください。パフォーマンスをよくするために、React はそれを遅らせて、単一パスで複数のコンポーネントを更新することがあります。React は state の変更がすぐに適用されることを保証しません。

`setState()` は常にコンポーネントを直ちに更新するわけではありません。それはバッチ式に更新するか後で更新を延期するかもしれません。これは `setState()` を呼び出した直後に `this.state` を読み取ることが潜在的な危険になります。代わりに、`componentDidUpdate` または `setState` コールバック（`setState(updater, callback)`）を使用してください。どちらも更新が適用された後に起動することが保証されています。前の state に基づいて state を設定する必要がある場合は、下記の `updater` 引数についてお読みください。

`shouldComponentUpdate()` が `false` を返さない限り、`setState()` は常に再レンダーされます。ミュータブルなオブジェクトが使用されていて、条件付きでレンダーを行うためのロジックを `shouldComponentUpdate()` に実装できない場合、新しい state が前の state と異なるときにのみ `setState()` を呼び出すと、不要な再レンダーを回避できます。

最初の引数の `updater` 関数は次のようなシグネチャです。

```javascript
(state, props) => stateChange
```

`state` は、変更が適用されているときのコンポーネントの state への参照です。直接変更するべきではありません。代わりに、`state` と `props` からの入力に基づいて新しいオブジェクトを構築することによって変更を表現する必要があります。たとえば、`props.step` によって `state` の値を増加したいとします。

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

updater 関数が受け取る `state` と `props` の両方が最新のものであることが保証されています。アップデータの出力は `state` と浅くマージされています。

`setState()` の 2 番目のパラメータは、`setState` が完了してコンポーネントが再レンダリングされると実行される省略可能なコールバック関数です。通常、そのようなロジックには代わりに `componentDidUpdate()` を使用することをおすすめします。

関数の代わりに、オブジェクトを `setState()` の最初の引数として渡すこともできます。

```javascript
setState(stateChange[, callback])
```

これは、たとえば、ショッピングカートの商品数を調整するために、`stateChange` の新しい state への浅いマージを実行します。

```javascript
this.setState({quantity: 2})
```

この形式の `setState()` も非同期であり、同じサイクル中の複数の呼び出しをまとめてバッチ処理することができます。たとえば、同じサイクルで品目数量を複数回増やそうとすると、次のようになります。

```javascript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

後続の呼び出しは、同じサイクル内の前の呼び出しの値を上書きするため、数量は 1 回だけ増分されます。次の state が現在の state に依存する場合は、代わりに updater 関数の形式を使用することをおすすめします。

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

詳しくは以下を参照してください。

* [state と ライフサイクル](/docs/state-and-lifecycle.html)
* [詳細: `setState()` はいつ、なぜバッチ処理されるのですか？](https://stackoverflow.com/a/48610973/458193)
* [詳細: `this.state` が直ちに更新されないのはなぜですか？](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

デフォルトでは、コンポーネントの state や props が変わると、コンポーネントは再レンダーされます。`render()` メソッドが他のデータに依存している場合は、`forceUpdate()` を呼び出してコンポーネントの再レンダーが必要であることを React に伝えることができます。

`forceUpdate()` を呼び出すと、`shouldComponentUpdate()` をスキップして、コンポーネントに対して `render()` が呼び出されます。これにより、それぞれの子の `shouldComponentUpdate()` メソッドを含む、子コンポーネントの通常のライフサイクルメソッドがトリガーされます。マークアップが変更された場合にのみ React は DOM を更新します。

通常は全ての `forceUpdate()` の使用を避け、`render()` の `this.props` と `this.state` からのみ読み取るようにしてください。

* * *

## クラスプロパティ {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` は、コンポーネントクラス自体のプロパティとして定義して、そのクラスのデフォルトの props を設定できます。これは `undefined` であるプロパティに使用されますが、`null` であるプロパティには使用されません。例えば：

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

`props.color` が提供されていない場合は、デフォルトで `'blue'` に設定されます。

```js
  render() {
    return <CustomButton /> ; // props.color は blue にセットされます
  }
```

`props.color` が `null` に設定されている場合、それは `null` のままになります。

```js
  render() {
    return <CustomButton color={null} /> ; // props.color は null のままになります
  }
```

* * *

### `displayName` {#displayname}

`displayName` 文字列はデバッグメッセージに使用されます。通常、コンポーネントを定義する関数またはクラスの名前から推測されるため、明示的に設定する必要はありません。デバッグ目的で別の名前を表示する場合や、高階コンポーネントを作成する場合には、明示的に設定したくなるかもしれません。詳細については、[簡単なデバッグのために表示名をラップする](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging)を参照してください。

* * *

## インスタンスプロパティ {#instance-properties-1}

### `props` {#props}

`this.props` には、このコンポーネントの呼び出し元によって定義された props が含まれています。props の紹介は [コンポーネントと props](/docs/components-and-props.html) を見てください。

特に、`this.props.children` は特別なプロパティで、通常はタグ自体にではなく JSX 式の子タグによって定義されます。

### `state` {#state}

state には、そのコンポーネント固有のデータが含まれており、これは時間の経過とともに変化する可能性があります。state はユーザ定義のものであり、プレーンな JavaScript オブジェクトでなければなりません。

レンダーやデータフローに値が使用されていない場合（たとえば、タイマー ID）は、値を state にする必要はありません。そのような値は、コンポーネントインスタンスのフィールドとして定義できます。

state の詳細については、[state とライフサイクル](/docs/state-and-lifecycle.html)を参照してください。

後で `setState()` を呼び出すと、行った変更が置き換えられる可能性があるため、`this.state` を直接変更しないでください。`this.state` がイミュータブルであるかのように扱ってください。
