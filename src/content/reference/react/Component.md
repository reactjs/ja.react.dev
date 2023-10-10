---
title: Component
---

<Pitfall>

クラスの代わりに関数でコンポーネントを定義することを推奨します。[移行方法はこちら](#alternatives)。

</Pitfall>

<Intro>

`Component` は React コンポーネントの基底クラスであり、[JavaScript のクラス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)として定義されています。React は現在でもクラスコンポーネントをサポートしていますが、新しいコードでの使用は推奨されません。

```js
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `Component` {/*component*/}

クラスとして React コンポーネントを定義するには、組み込みの `Component` クラスを継承し、[`render` メソッド](#render)を定義します。

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`render` メソッドのみが必須です。他のメソッドはオプションです。

[さらに例を読む](#usage)

---

### `context` {/*context*/}

クラスコンポーネントでは[コンテクスト](/learn/passing-data-deeply-with-context)を `this.context` の形で利用できます。これは、[`static contextType`](#static-contexttype)（現行版）または [`static contextTypes`](#static-contexttypes)（非推奨）を使用して受け取りたいコンテクストを指定した場合にのみ利用できます。

クラスコンポーネントは、一度に 1 種類のコンテクストしか読み取ることができません。

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

クラスコンポーネントで `this.context` を読み取ることは、関数コンポーネントで [`useContext`](/reference/react/useContext) を用いることと同等です。

[移行方法を見る](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

クラスコンポーネントに渡された props は `this.props` の形で利用できます。

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

クラスコンポーネントで `this.props` を読み取ることは、関数コンポーネントで [props を宣言する](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component)ことと同等です。

[移行方法を見る](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

### `refs` {/*refs*/}

<Deprecated>

この API は React の将来のメジャーバージョンで削除されます。[代わりに `createRef` を使用してください](/reference/react/createRef)。

</Deprecated>

このコンポーネントの[レガシーな文字列形式 ref](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) にアクセスできます。

---

### `state` {/*state*/}

クラスコンポーネントの state は `this.state` の形で利用できます。`state` フィールドはオブジェクトでなければなりません。state を直接書き換えてはいけません。state を変更したい場合は、新しい state を引数にして `setState` を呼び出します。

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

クラスコンポーネントで `state` を定義することは、関数コンポーネントで [`useState`](/reference/react/useState) を呼び出すことと同等です。

[移行方法を見る](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[コンストラクタ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor)は、クラスコンポーネントが*マウント*（画面に追加）される前に実行されます。通常 React では、コンストラクタは 2 つの目的でのみ利用されます。state の宣言と、クラスメソッドのクラスインスタンスへの[バインド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)です。

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

モダンな JavaScript 構文を使用している場合、コンストラクタはほとんど必要ありません。代わりに上記のコードは、モダンブラウザや [Babel](https://babeljs.io/) などのツールでサポートされている[パブリッククラスフィールド構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)を使用して書き直すことができます。

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

コンストラクタには副作用やサブスクリプション（subscription, イベント登録や外部データ購読）を一切含めてはいけません。

#### 引数 {/*constructor-parameters*/}

* `props`: コンポーネントの初期 props。

#### 返り値 {/*constructor-returns*/}

`constructor` は何も返してはいけません。

#### 注意点 {/*constructor-caveats*/}

* コンストラクタ内で副作用やサブスクリプションを実行しないでください。代わりに [`componentDidMount`](#componentdidmount) を使用してください。

* コンストラクタ内では、他のすべてのステートメントの前に `super(props)` を呼び出す必要があります。これを行わないと、コンストラクタが実行されている間 `this.props` が `undefined` になるため、混乱を招きバグの原因となる可能性があります。

* [`this.state`](#state) を直接セットして良い唯一の場所がコンストラクタです。他のすべてのメソッド内では、代わりに [`this.setState()`](#setstate) を使用する必要があります。コンストラクタ内で `setState` を呼び出さないでください。

* [サーバレンダリング](/reference/react-dom/server)を使用する場合、コンストラクタもサーバ上で実行され、その後に [`render`](#render) メソッドが続きます。ただし、`componentDidMount` や `componentWillUnmount` のようなライフサイクルメソッドはサーバ上では実行されません。

* [Strict Mode](/reference/react/StrictMode) が有効の場合、React は開発環境において `constructor` を 2 回呼び出し、2 つのインスタンスのうち 1 つを破棄します。これにより、`constructor` 外に移動するべき偶発的な副作用に気づきやすくなります。

<Note>

関数コンポーネントには `constructor` とまったく同等のものは存在しません。関数コンポーネントで state を宣言するには [`useState`](/reference/react/useState) を呼び出します。初期 state の再計算を避けたい場合は [`useState` に関数を渡します](/reference/react/useState#avoiding-recreating-the-initial-state)。

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

`componentDidCatch` を定義すると、子コンポーネント（遠くの子を含む）がレンダー中にエラーをスローしたときに React がそれを呼び出します。これにより、本番環境でそのエラーをエラーレポートサービスにログとして記録することができます。

通常これは、エラーに反応して state を更新し、ユーザにエラーメッセージを表示するための [`static getDerivedStateFromError`](#static-getderivedstatefromerror) と一緒に使用されます。これらのメソッドを持つコンポーネントのことを*エラーバウンダリ (error boundary)* と呼びます。

[例を見る](#catching-rendering-errors-with-an-error-boundary)

#### 引数 {/*componentdidcatch-parameters*/}

* `error`: スローされたエラー。現実的には通常 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) のインスタンスになりますが、このことは保証されていません。JavaScript では文字列や `null` すら含む、任意の値を [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) することが許されているためです。

* `info`: エラーに関する追加情報を含むオブジェクト。その `componentStack` フィールドには、スローしたコンポーネントとそのすべての親コンポーネントの名前およびソース上の位置を含んだスタックトレースが含まれます。本番環境では、コンポーネント名はミニファイされています。本番環境用にエラーレポートを設定する場合は、通常の JavaScript エラースタックと同じように、ソースマップを使用してコンポーネントスタックをデコードできます。

#### 返り値 {/*componentdidcatch-returns*/}

`componentDidCatch` は何も返してはいけません。

#### 注意点 {/*componentdidcatch-caveats*/}

* 以前は、UI を更新してフォールバックのエラーメッセージを表示するために `componentDidCatch` 内で `setState` を呼び出すことが一般的でした。これは非推奨となり、代わりに [`static getDerivedStateFromError`](#static-getderivedstatefromerror) を定義することが推奨されています。

* React の本番用ビルドと開発用ビルドでは、`componentDidCatch` がエラーを処理する方法がわずかに異なります。開発中は、エラーが `window` にまでバブルアップするため、`window.onerror` や `window.addEventListener('error', callback)` といったコードが `componentDidCatch` によってキャッチされたエラーを捕まえることができます。一方で本番環境ではエラーはバブルアップしないため、祖先のエラーハンドラは `componentDidCatch` によって明示的にキャッチされなかったエラーのみを受け取ります。

<Note>

関数コンポーネントには `componentDidCatch` に直接対応するものはまだありません。クラスコンポーネントの作成をなるべく避けたい場合は、上記のような `ErrorBoundary` コンポーネントを 1 つだけ書いてアプリ全体で使用します。あるいはこれを代わりにやってくれる [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) パッケージを使用することもできます。

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

`componentDidMount` メソッドを定義すると、コンポーネントが画面に追加（*マウント*）されたときに React がそれを呼び出します。一般的にはここで、データ取得、サブスクリプション設定や DOM ノードの操作を開始します。

`componentDidMount` を実装する場合、通常はバグを避けるために他のライフサイクルメソッドも実装する必要があります。例えば、`componentDidMount` が何らかの state や props を読み取る場合はそれらに変更があった場合に処理するために [`componentDidUpdate`](#componentdidupdate) を実装する必要があり、`componentDidMount` が実行したことをクリーンアップするためには [`componentWillUnmount`](#componentwillunmount) を実装する必要があります。

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[他の例を見る](#adding-lifecycle-methods-to-a-class-component)

#### 引数 {/*componentdidmount-parameters*/}

`componentDidMount` は引数を受け取りません。

#### 返り値 {/*componentdidmount-returns*/}

`componentDidMount` は何も返してはいけません。

#### 注意点 {/*componentdidmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode) がオンの場合、React は開発中に `componentDidMount` を呼び出し、直後に [`componentWillUnmount`](#componentwillunmount) を呼び出し、そして再度 `componentDidMount` を呼び出します。これにより、`componentWillUnmount` の実装を忘れた場合や、そのロジックが `componentDidMount` の挙動と正しく「鏡のように対応」していない場合に気づきやすくなります。

- `componentDidMount` の中で直ちに [`setState`](#setstate) を呼び出すことは可能ですが、可能な限り避けるべきです。これは追加のレンダーを引き起こしますが、ブラウザが画面を更新する前に発生します。このため、このケースでは [`render`](#render) が 2 回呼び出されはしますが、ユーザは中途半端な state を見ずに済みます。このパターンはしばしばパフォーマンスの問題を引き起こすため、注意して使用してください。ほとんどの場合、初期 state を [`constructor`](#constructor) で代入できるはずです。ただし、モーダルやツールチップのような場合は、何らかの DOM ノードの位置やサイズに依存する要素をレンダーするのに DOM ノードの測定を行うため、これが必要になることがあります。

<Note>

多くのユースケースにおいて、クラスコンポーネントで `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` をまとめて定義することは、関数コンポーネントで [`useEffect`](/reference/react/useEffect) を呼び出すことと同等です。ブラウザの描画前にコードを実行することが重要となる稀なケースでは、[`useLayoutEffect`](/reference/react/useLayoutEffect) がより近いものになります。

[移行方法を見る](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

`componentDidUpdate` メソッドを定義すると、コンポーネントが更新後の props や state で再レンダーされた直後に React がそれを呼び出します。このメソッドは初回レンダーでは呼び出されません。

更新後に DOM を操作するためにこれを使用することができます。これはまた、ネットワークリクエストを行う一般的な場所でもありますが、現在の props を前の props と比較する必要があります（例えば props が変更されていない場合、新しいネットワークリクエストは必要ないかもしれません）。通常、[`componentDidMount`](#componentdidmount) や [`componentWillUnmount`](#componentwillunmount) と一緒に使用します。

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[他の例を見る](#adding-lifecycle-methods-to-a-class-component)


#### 引数 {/*componentdidupdate-parameters*/}

* `prevProps`: 更新前の props。`prevProps` と [`this.props`](#props) を比較して何が変わったかを判断します。

* `prevState`: 更新前の state。`prevState` と [`this.state`](#state) を比較して何が変わったかを判断します。

* `snapshot`: [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) を実装した場合、`snapshot` にはそのメソッドから返された値が含まれます。それ以外の場合は `undefined` になります。

#### 返り値 {/*componentdidupdate-returns*/}

`componentDidUpdate` は何も返してはいけません。

#### 注意点 {/*componentdidupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) が定義されており、それが `false` を返す場合、`componentDidUpdate` は呼び出されません。

- `componentDidUpdate` 内のロジックは通常、`this.props` と `prevProps`、`this.state` と `prevState` を比較する条件文でラップする必要があります。そうでなければ、無限ループを作り出すリスクがあります。

- `componentDidUpdate` の中で直ちに [`setState`](#setstate) を呼び出すことは可能ですが、可能な限り避けるべきです。これは追加のレンダーを引き起こしますが、ブラウザが画面を更新する前に発生します。このため、このケースでは [`render`](#render) が 2 回呼び出されはしますが、ユーザは中途半端な state を見ずに済みます。このパターンはしばしばパフォーマンスの問題を引き起こします。ただし、モーダルやツールチップのようなレアなケースでは、何らかの DOM ノードの位置やサイズに依存する要素をレンダーするのに DOM ノードの測定を行うため、これが必要になることがあります。

<Note>

多くのユースケースにおいて、クラスコンポーネントで `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` をまとめて定義することは、関数コンポーネントで [`useEffect`](/reference/react/useEffect) を呼び出すことと同等です。ブラウザの描画前にコードを実行することが重要となる稀なケースでは、[`useLayoutEffect`](/reference/react/useLayoutEffect) がより近いものになります。

[移行方法を見る](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

この API は `componentWillMount` から [`UNSAFE_componentWillMount`](#unsafe_componentwillmount) に名前が変更されました。古い名前は非推奨となりました。React の将来のメジャーバージョンでは、新しい名前のみが機能します。

自動的にコンポーネントを更新するには [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) を実行してください。

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

この API は `componentWillReceiveProps` から [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops) に名前が変更されました。古い名前は非推奨となりました。React の将来のメジャーバージョンでは、新しい名前のみが機能します。

自動的にコンポーネントを更新するには [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) を実行してください。

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

この API は `componentWillUpdate` から [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) に名前が変更されました。古い名前は非推奨となりました。React の将来のメジャーバージョンでは、新しい名前のみが機能します。

自動的にコンポーネントを更新するには [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) を実行してください。

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

`componentWillUnmount` メソッドを定義すると、React はコンポーネントが画面から削除（アンマウント）される前にこれを呼び出します。ここがデータの取得をキャンセルしたり、サブスクリプションを削除するのに一般的な場所です。

`componentWillUnmount` 内のロジックは [`componentDidMount`](#componentdidmount) 内のロジックと「鏡のように対応」するべきです。例えば、`componentDidMount` がサブスクリプションの設定を行う場合、`componentWillUnmount` はそのサブスクリプションをクリーンアップするべきです。`componentWillUnmount` のクリーンアップロジックが props や state を読み取る場合、通常は古い props と state に対応するリソース（サブスクリプションなど）をクリーンアップするために [`componentDidUpdate`](#componentdidupdate) も実装する必要があります。

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[他の例を見る](#adding-lifecycle-methods-to-a-class-component)

#### 引数 {/*componentwillunmount-parameters*/}

`componentWillUnmount` は引数を受け取りません。

#### 返り値 {/*componentwillunmount-returns*/}

`componentWillUnmount` は何も返してはいけません。

#### 注意点 {/*componentwillunmount-caveats*/}

- [Strict Mode](/reference/react/StrictMode) がオンの場合、React は開発中に [`componentDidMount`](#componentdidmount) を呼び出し、直後に `componentWillUnmount` を呼び出し、そして再度 `componentDidMount` を呼び出します。これにより、`componentWillUnmount` の実装を忘れた場合や、そのロジックが `componentDidMount` の挙動と正しく「鏡のように対応」していない場合に気づきやすくなります。

<Note>

多くのユースケースにおいて、クラスコンポーネントで `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` をまとめて定義することは、関数コンポーネントで [`useEffect`](/reference/react/useEffect) を呼び出すことと同等です。ブラウザの描画前にコードを実行することが重要となる稀なケースでは、[`useLayoutEffect`](/reference/react/useLayoutEffect) がより近いものになります。

[移行方法を見る](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

コンポーネントを強制的に再レンダーします。

通常、これは必要ありません。コンポーネントの [`render`](#render) メソッドが [`this.props`](#props)、[`this.state`](#state) および [`this.context`](#context) からのみ読み取りを行う場合、コンポーネント内またはその親で [`setState`](#setstate) が呼び出されると自動的に再レンダーが発生します。しかし、コンポーネントの `render` メソッドが外部データソースから直接読み取りを行っている場合、そのデータソースが変更されたときに React にユーザインターフェースを更新するように指示する必要があります。`forceUpdate` はそれを行えるようにするためのものです。

あらゆる `forceUpdate` の使用は避け、`render` 内では `this.props` と `this.state` からのみ読み取るようにしてください。

#### 引数 {/*forceupdate-parameters*/}

* **省略可能** `callback`: 指定された場合、React は更新がコミットされた後に、渡された `callback` を呼び出します。

#### 返り値 {/*forceupdate-returns*/}

`forceUpdate` は何も返しません。

#### 注意点 {/*forceupdate-caveats*/}

- `forceUpdate` を呼び出すと、React は [`shouldComponentUpdate`](#shouldcomponentupdate) を呼び出さずに再レンダーします。

<Note>

外部データソースを読み込んで変更に応じて `forceUpdate` でクラスコンポーネントを再レンダーする代わりに、関数コンポーネントにおいては [`useSyncExternalStore`](/reference/react/useSyncExternalStore) を使うようになりました。

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

この API は、React の将来のメジャーバージョンで削除されます。代わりに [`Context.Provider` を使用してください](/reference/react/createContext#provider)。

</Deprecated>

このコンポーネントが提供する[レガシーコンテクスト](https://reactjs.org/docs/legacy-context.html)の値を指定します。

---

### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

`getSnapshotBeforeUpdate` を実装すると、React は DOM を更新する直前にそれを呼び出します。これにより、コンポーネントは DOM から情報（例えばスクロール位置）を取得することができます。このライフサイクルメソッドが返すあらゆる値は、[`componentDidUpdate`](#componentdidupdate) に引数として渡されます。

例えば、更新間でスクロール位置を保持する必要があるチャットスレッドのような UI でこれを使用することができます。

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

上記の例では、`getSnapshotBeforeUpdate` で直接 `scrollHeight` プロパティを読み取ることが重要です。[`render`](#render)、[`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops)、または [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) で読み取ることは安全ではありません。これらのメソッドが呼び出されてから React が DOM を更新するまでに時間差がある可能性があるためです。

#### 引数 {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: 更新前の props。`prevProps` と [`this.props`](#props) を比較して何が変わったかを判断します。

* `prevState`: 更新前の state。`prevState` と [`this.state`](#state) を比較して何が変わったかを判断します。

#### 返り値 {/*getsnapshotbeforeupdate-returns*/}

任意の型のスナップショット値、または `null` を返してください。返した値は、[`componentDidUpdate`](#componentdidupdate) の第 3 引数として渡されます。

#### 注意点 {/*getsnapshotbeforeupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) が定義されており、`false` を返す場合、`getSnapshotBeforeUpdate` は呼び出されません。

<Note>

現時点では、関数コンポーネントには `getSnapshotBeforeUpdate` と同等のものはありません。このユースケースは非常に珍しいものですが、これがどうしても必要な場合、現時点ではクラスコンポーネントを書く必要があります。

</Note>

---

### `render()` {/*render*/}

`render` メソッドは、クラスコンポーネントにおける唯一の必須メソッドです。

`render` メソッドは、画面に表示したいものを指定します。例えば：

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React はあらゆるタイミングで `render` を呼び出す可能性があるため、特定の時間に実行されることを前提にしてはいけません。通常、`render` メソッドは [JSX](/learn/writing-markup-with-jsx) を返すべきですが、いくつかの[他の型の返り値](#render-returns)（文字列など）もサポートされています。返すべき JSX を計算するために、`render` メソッドは [`this.props`](#props)、[`this.state`](#state)、および [`this.context`](#context) を読み取ることができます。

`render` メソッドは純関数として書くべきです。つまり、props、state、コンテクストが同じであれば同じ結果を返すべきです。また、副作用（サブスクリプションの設定など）を含んだり、ブラウザの API とやり取りしたりするべきではありません。副作用は、イベントハンドラや [`componentDidMount`](#componentdidmount) のようなメソッド内で行うべきです。

#### 引数 {/*render-parameters*/}

`render` は引数を受け取りません。

#### 返り値 {/*render-returns*/}

`render` はあらゆる有効な React ノードを返すことができます。これには、`<div />` のような React 要素、文字列、数値、[ポータル](/reference/react-dom/createPortal)、空のノード（`null`、`undefined`、`true`、`false`）、および React ノードの配列が含まれます。

#### 注意点 {/*render-caveats*/}

- `render` は props、state、コンテクストに対する純関数として書くべきです。副作用を持ってはいけません。

- [`shouldComponentUpdate`](#shouldcomponentupdate) が定義されており `false` を返す場合、`render` は呼び出されません。

- [Strict Mode](/reference/react/StrictMode) が有効の場合、React は開発中に `render` を 2 回呼び出し、そのうちの 1 つの結果を破棄します。これにより、`render` メソッドの外に移動するべき偶発的な副作用に気づきやすくなります。

- `render` の呼び出しとその後の `componentDidMount` や `componentDidUpdate` の呼び出しとの間に一対一の対応関係はありません。React が必要と判断した場合、`render` の呼び出し結果の一部は破棄される可能性があります。

---

### `setState(nextState, callback?)` {/*setstate*/}

`setState` の呼び出しは React コンポーネントの state の更新を行います。

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.
      </>
    );
  }
}
```

`setState` はコンポーネントの state への更新をキューに入れます。これは、このコンポーネントとその子を新しい state で再レンダーする必要があることを React に伝えます。これが、ユーザ操作に対応してユーザインターフェースを更新するための主要な方法となります。

<Pitfall>

`setState` を呼び出しても、すでに実行中のコードの現在の state は**変更されません**。

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

これは、*次回の*レンダーから `this.state` が返すものにのみ影響します。

</Pitfall>

また、`setState` に関数を渡すこともできます。これにより、前の state に基づいて state を更新することができます。

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

こうする必要があるわけではありませんが、同じイベント中に複数回 state を更新したい場合には有用です。

#### 引数 {/*setstate-parameters*/}

* `nextState`：オブジェクトまたは関数。
  * `nextState` としてオブジェクトを渡すと、それは `this.state` に浅く (shallow) マージされます。
  * `nextState` として関数を渡すと、それは*更新用関数 (updater function)* として扱われます。その関数は純関数でなければならず、state と props の現在値を引数として取り、`this.state` に浅くマージされるためのオブジェクトを返します。React はこの更新用関数をキューに入れてからコンポーネントを再レンダーします。次のレンダー中に、React は前の state に対してキューに入れられたすべての更新用関数を適用し、次回の state を計算します。

* **省略可能** `callback`: 指定された場合、React は更新がコミットされた後に渡された `callback` を呼び出します。

#### 返り値 {/*setstate-returns*/}

`setState` は何も返しません。

#### 注意点 {/*setstate-caveats*/}

- `setState` は即時的なコンポーネントの更新命令ではなく、*リクエスト*だと考えてください。複数のコンポーネントがイベントに応じて state を更新するとき、React はそれらの更新をバッチ（束ね）処理し、イベントの終了時に 1 度だけ再レンダーします。特定の state 更新を強制的に同期的に適用する必要がある稀なケースでは、[`flushSync`](/reference/react-dom/flushSync) でラップすることができますが、これはパフォーマンスを低下させる可能性があります。

- `setState` は `this.state` を即時に更新しません。このため、`setState` を呼び出した直後に `this.state` を読み取ることは潜在的な落とし穴となります。代わりに、[`componentDidUpdate`](#componentdidupdate) または setState の `callback` 引数を使用してください。どちらも更新が適用された後に発火することが保証されています。前の state に基づいた state を設定する必要がある場合、上記で説明したように `nextState` として関数を渡すことができます。

<Note>

クラスコンポーネントで `setState` を呼び出すことは、関数コンポーネントで [`set` 関数](/reference/react/useState#setstate)を呼び出すことに似ています。

[移行方法を見る](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

`shouldComponentUpdate` を定義すると、React は再レンダーをスキップできるかどうかを判断するためにそれを呼び出します。

これを本当に手動で書きたい場合は、`this.props` と `nextProps`、`this.state` と `nextState` を比較した上で `false` を返すことで、更新をスキップできると React に伝えることができます。

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

新しい props や state を受け取る際に React は `shouldComponentUpdate` を呼び出します。デフォルトは `true` です。このメソッドは初回レンダーの場合と [`forceUpdate`](#forceupdate) が使用された場合には呼び出されません。

#### 引数 {/*shouldcomponentupdate-parameters*/}

- `nextProps`: コンポーネントがレンダーしようとしている次の props。何が変わったかを判断するために `nextProps` を [`this.props`](#props) と比較します。
- `nextState`: コンポーネントがレンダーしようとしている次の state。何が変わったかを判断するために `nextState` を [`this.state`](#props) と比較します。
- `nextContext`: コンポーネントがレンダーしようとしている次のコンテクスト。何が変わったかを判断するために `nextContext` を [`this.context`](#context) と比較します。[`static contextType`](#static-contexttype)（現行版）または [`static contextTypes`](#static-contexttypes)（レガシー）を指定した場合のみ利用可能です。

#### 返り値 {/*shouldcomponentupdate-returns*/}

コンポーネントを再レンダーしたい場合は `true` を返します。これがデフォルトの挙動です。

再レンダーがスキップ可能であると React に伝えるためには `false` を返します。

#### 注意点 {/*shouldcomponentupdate-caveats*/}

- このメソッドは*パフォーマンス最適化のためだけ*に存在しています。もし、このメソッドがないとコンポーネントが壊れる場合は、まずそれを修正してください。

- `shouldComponentUpdate` を手書きする代わりに、[`PureComponent`](/reference/react/PureComponent) の使用を検討してください。`PureComponent` は props と state を浅く比較し、必要な更新までスキップしてしまう可能性を減らします。

- `shouldComponentUpdate` で深い等価性チェックを行ったり、`JSON.stringify` を使用したりすることはお勧めしません。これによりパフォーマンスがあらゆる props と state のデータ構造に依存するようになり、予測不可能になります。よくてもアプリケーションが数秒間フリーズするリスクがあり、最悪の場合はクラッシュする危険があります。

- `false` を返しても、*子コンポーネントの* state が変更された場合に子コンポーネントの再レンダーが抑止されるわけではありません。

- `false` を返しても、コンポーネントが再レンダーされないことが*保証*されるわけではありません。React は返り値をヒントとして使用しますが、他の理由でコンポーネントを再レンダーすることが理にかなっていると判断した場合、再レンダーを行うことがあります。

<Note>

クラスコンポーネントを `shouldComponentUpdate` で最適化することは、関数コンポーネントを [`memo` で最適化すること](/reference/react/memo)と似ています。関数コンポーネントでは [`useMemo`](/reference/react/useMemo) を使用することで、さらに細かい最適化も行えます。

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

`UNSAFE_componentWillMount` を定義すると、React は [`constructor` の直後に](#constructor)それを呼び出します。これは歴史的な理由で存在するものであり、新しいコードでは使用すべきではありません。代わりに以下の代替手段のいずれかを使用してください。

- state を初期化するためには、[`state` をクラスフィールドとして宣言する](#state)か、[`constructor`](#constructor) で `this.state` を設定します。
- 副作用を実行する必要があるか、サブスクリプションを設定する必要がある場合は、そのロジックを [`componentDidMount`](#componentdidmount) に移動します。

[安全でないライフサイクルからの移行例を見る](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### 引数 {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` は引数を受け取りません。

#### 返り値 {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` は何も返してはいけません。

#### 注意点 {/*unsafe_componentwillmount-caveats*/}

- コンポーネントが [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) または [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) を実装している場合、`UNSAFE_componentWillMount` は呼び出されません。

- [`Suspense`](/reference/react/Suspense) のようなモダンな React 機能を使用しているアプリでは、`UNSAFE_componentWillMount` はその名前に反して、コンポーネントが*本当にマウント*されることを保証しません。（例えば子コンポーネントのコードがまだロードされていないなどの理由で）レンダーの試行がサスペンドした場合、React は進行中のツリーを破棄し、次の試行にてコンポーネントをゼロから構築しようとします。これがこのメソッドが "unsafe" となっている理由です。実際にマウントされたという事実に依存するコード（サブスクリプションの追加など）は [`componentDidMount`](#componentdidmount) に入れるべきです。

- `UNSAFE_componentWillMount` は[サーバレンダリング](/reference/react-dom/server)中に実行される唯一のライフサイクルメソッドです。現実的にはあらゆる利用目的においてこれは [`constructor`](#constructor) と同一であるため、このタイプのロジックには `constructor` を使用すべきです。

<Note>

クラスコンポーネントの `UNSAFE_componentWillMount` 内で state を初期化するために [`setState`](#setstate) を呼び出すことは、関数コンポーネントの [`useState`](/reference/react/useState) に初期 state を渡すことと同等です。

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

`UNSAFE_componentWillReceiveProps` を定義すると、コンポーネントが新しい props を受け取るときに React がそれを呼び出します。これは歴史的な理由で存在するものであり、新しいコードでは使用すべきではありません。代わりに以下の代替手段のいずれかを使用してください。

- props の変更に応じて**副作用を実行**する必要がある場合（例えば、データの取得、アニメーションの実行、またはサブスクリプションの再初期化）、そのロジックを代わりに [`componentDidUpdate`](#componentdidupdate) に移動してください。
- 一部の props が変更されたときに**あるデータの再計算を避ける**必要がある場合、代わりに[メモ化ヘルパー](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)を使用してください。
- props が変更されたときに**ある state を「リセット」する**必要がある場合、コンポーネントを[完全に制御されたコンポーネント](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)にするか、[key 付きの非制御コンポーネント](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)にすることを検討してください。
- props が変更されたときに**ある state を「調整」する**必要がある場合、レンダー中に props のみから必要な情報をすべて計算できないか確認してください。できない場合は、代わりに [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) を使用してください。

[安全でないライフサイクルからの移行の例を見る](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### 引数 {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: コンポーネントが親コンポーネントから受け取ろうとしている次の props。何が変更されたかを判断するために `nextProps` を [`this.props`](#props) と比較します。
- `nextContext`: コンポーネントが最も近いプロバイダから受け取ろうとしている次のコンテクスト。何が変更されたかを判断するために `nextContext` を [`this.context`](#context) と比較します。[`static contextType`](#static-contexttype)（現行版）または [`static contextTypes`](#static-contexttypes)（レガシー）を指定した場合のみ利用可能です。

#### 返り値 {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` は何も返してはいけません。

#### 注意点 {/*unsafe_componentwillreceiveprops-caveats*/}

- [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) または [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) を実装しているコンポーネントでは、`UNSAFE_componentWillReceiveProps` は呼び出されません。

- [`Suspense`](/reference/react/Suspense) のようなモダンな React 機能を使用しているアプリでは、`UNSAFE_componentWillReceiveProps` はその名前に反して、コンポーネントがその props を*本当に受け取る*ことを保証しません。（例えば子コンポーネントのコードがまだロードされていないなどの理由で）レンダーの試行がサスペンドした場合、React は進行中のツリーを破棄し、次の試行にてコンポーネントをゼロから構築しようとします。次のレンダーの試行の時点では、props は異なっている可能性があります。これがこのメソッドが "unsafe" となっている理由です。コミットされた更新のみに対して実行すべきコード（サブスクリプションのリセットなど）は、[`componentDidUpdate`](#componentdidupdate) に入れるべきです。

- `UNSAFE_componentWillReceiveProps` が呼ばれてもコンポーネントが前回と*異なる* props を受け取ったことを意味するものではありません。何かが変わったかどうかを確認するには `nextProps` と `this.props` を自分で比較する必要があります。

- React はマウント時に `UNSAFE_componentWillReceiveProps` を初期 props を引数に呼び出すことはありません。このメソッドは、コンポーネントの props の一部が更新される予定の場合にのみ呼び出されます。例えば、[`setState`](#setstate) を呼び出しても、一般的には同じコンポーネント内の `UNSAFE_componentWillReceiveProps` はトリガされません。

<Note>

クラスコンポーネントで `UNSAFE_componentWillReceiveProps` 内部で [`setState`](#setstate) を呼び出して state を「調整」することは、関数コンポーネントで[レンダー中に `useState` の `set` 関数を呼び出す](/reference/react/useState#storing-information-from-previous-renders) ことと同等です。

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


`UNSAFE_componentWillUpdate` を定義すると、新しい props または state でレンダーする前に React がそれを呼び出します。これは歴史的な理由で存在するものであり、新しいコードでは使用すべきではありません。代わりに以下の代替手段のいずれかを使用してください。

- prop または state の変更に応じて副作用（例えば、データの取得、アニメーションの実行、サブスクリプションの再初期化など）を実行する必要がある場合、そのロジックを [`componentDidUpdate`](#componentdidupdate) に移動してください。
- DOM から情報を読み取り（例えば、現在のスクロール位置を保存するなど）、それを後で [`componentDidUpdate`](#componentdidupdate) で使用する場合は、[`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) 内で読み取るようにしてください。

[安全でないライフサイクルからの移行例を見る](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### 引数 {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: コンポーネントが次にレンダーする予定の props。何が変わったかを判断するために、`nextProps` と [`this.props`](#props) を比較します。
- `nextState`: コンポーネントが次にレンダーする予定の state。何が変わったかを判断するために、`nextState` と [`this.state`](#state) を比較します。

#### 返り値 {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` は何も返してはいけません。

#### 注意点 {/*unsafe_componentwillupdate-caveats*/}

- [`shouldComponentUpdate`](#shouldcomponentupdate) が定義されており `false` を返す場合、`UNSAFE_componentWillUpdate` は呼び出されません。

- コンポーネントが [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) または [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate) を実装している場合、`UNSAFE_componentWillUpdate` は呼び出されません。

- `componentWillUpdate` の呼び出し中に [`setState`](#setstate)（または最終的に `setState` が呼び出されるようなあらゆるメソッド、例えば Redux アクションのディスパッチ）を呼び出すことはサポートされていません。

- [`Suspense`](/reference/react/Suspense) のようなモダンな React 機能を使用しているアプリでは、`UNSAFE_componentWillUpdate` はその名前に反して、コンポーネントが*本当に更新される*ことを保証しません。（例えば子コンポーネントのコードがまだロードされていないなどの理由で）レンダーの試行がサスペンドした場合、React は進行中のツリーを破棄し、次の試行にてコンポーネントをゼロから構築しようとします。次のレンダーの試行の時点では props と state は異なっている可能性があります。これがこのメソッドが "unsafe" となっている理由です。コミットされた更新のみに対して実行すべきコード（サブスクリプションのリセットなど）は、[`componentDidUpdate`](#componentdidupdate) に入れるべきです。

- `UNSAFE_componentWillUpdate` が呼ばれてもコンポーネントが前回とは*異なる* props や state を受け取ったことを意味するものではありません。何かが変わったかどうかを確認するには、`nextProps` と `this.props`、`nextState` と `this.state` を自分で比較する必要があります。

- React は props や state の初期値を使ってマウント時に `UNSAFE_componentWillUpdate` を呼び出すことはしません。

<Note>

関数コンポーネントには `UNSAFE_componentWillUpdate` に直接対応するものはありません。

</Note>

---

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

この API は React の将来のメジャーバージョンで削除されます。代わりに [`static contextType`](#static-contexttype) を使用してください。

</Deprecated>

このコンポーネントによって提供される[レガシーコンテクスト](https://reactjs.org/docs/legacy-context.html)を指定します。

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

この API は React の将来のメジャーバージョンで削除されます。代わりに [`static contextType`](#static-contexttype) を使用してください。

</Deprecated>

このコンポーネントが使用する[レガシーコンテクスト](https://reactjs.org/docs/legacy-context.html)を指定します。

---

### `static contextType` {/*static-contexttype*/}

クラスコンポーネントで [`this.context`](#context-instance-field) を読み取りたい場合、読み取りたいコンテクストをこれで指定する必要があります。`static contextType` として指定するコンテクストは、以前に [`createContext`](/reference/react/createContext) で作成されている値でなければなりません。

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

クラスコンポーネントでの `this.context` の読み取りは、関数コンポーネントの [`useContext`](/reference/react/useContext) と同等です。

[移行方法を見る](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

クラスのデフォルトの props を設定するために `static defaultProps` を定義できます。これらは `undefined` および存在しない props に対して使用されますが、`null` である props には使用されません。

例えば以下のようにして、props である `color` がデフォルトで `'blue'` になるよう定義できます。

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

`color` prop が渡されない場合や `undefined` である場合、デフォルトで `'blue'` にセットされます。

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

クラスコンポーネントで `defaultProps` を定義することは、関数コンポーネントで[デフォルト値](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop)を使用するのと同様のものです。

</Note>

---

### `static propTypes` {/*static-proptypes*/}

コンポーネントが受け入れる props の型を宣言するために、[`prop-types`](https://www.npmjs.com/package/prop-types) ライブラリと一緒に `static propTypes` を定義することができます。これらの型はレンダー中、かつ開発中にのみチェックされます。

```js
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
```

<Note>

ランタイムでの props の型チェックの代わりに [TypeScript](https://www.typescriptlang.org/) を使用することをお勧めします。

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

`static getDerivedStateFromError` を定義すると、子コンポーネント（遠くの子を含む）がレンダー中にエラーをスローしたときに React がそれを呼び出します。これにより、UI をクリアする代わりにエラーメッセージを表示できます。

通常これは、エラーレポートを何らかの分析サービスに送信できるようにするための [`componentDidCatch`](#componentdidcatch) と一緒に使用されます。これらのメソッドを持つコンポーネントのことを*エラーバウンダリ*と呼びます。

[例を見る](#catching-rendering-errors-with-an-error-boundary)

#### 引数 {/*static-getderivedstatefromerror-parameters*/}

* `error`: スローされたエラー。現実的には通常 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) のインスタンスになりますが、このことは保証されていません。JavaScript では文字列や `null` すら含む、任意の値を [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) することが許されているためです。

#### 返り値 {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` からは、エラーメッセージを表示するようコンポーネントに指示するための state を返します。

#### 注意点 {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` は純関数であるべきです。副作用（例えば、分析サービスの呼び出し）を実行したい場合は、[`componentDidCatch`](#componentdidcatch) も実装する必要があります。

<Note>

関数コンポーネントには `static getDerivedStateFromError` に直接対応するものはまだありません。クラスコンポーネントの作成をなるべく避けたい場合は、上記のような `ErrorBoundary` コンポーネントを 1 つだけ書いてアプリ全体で使用します。あるいはこれを代わりにやってくれる [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) パッケージを使用することもできます。

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

`static getDerivedStateFromProps` を定義すると、React は初回のマウントとその後の更新の両方で、[`render`](#render) を呼び出す直前にこれを呼び出します。state を更新するためのオブジェクトを返すか、何も更新しない場合は `null` を返すようにします。

このメソッドは、state が props の経時的な変化に依存するという[稀なユースケース](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)のために存在します。例えば、この `Form` コンポーネントは props である `userID` が変更されたときに state である `email` をリセットします。

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

このパターンでは、（`userID` のような）props の前回の値を、（`prevUserID` のような）state に保持する必要があることに注意してください。

<Pitfall>

state 値の派生はコードを冗長にし、コンポーネントを分かりづらくします。[よりシンプルな代替手段について確実に理解しておいてください](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)。

- props の変更に応じて**副作用を実行**する必要がある場合（例えば、データの取得やアニメーション）、代わりに [`componentDidUpdate`](#componentdidupdate) メソッドを使用してください。
- **一部の props が変更されたときだけデータを再計算**する必要がある場合、[代わりにメモ化ヘルパーを使用します](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)。
- props が変更されたときに**ある state を「リセット」する**必要がある場合、コンポーネントを[完全に制御されたコンポーネント](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component)にするか、[key 付きの非制御コンポーネント](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key)にすることを検討してください。

</Pitfall>

#### 引数 {/*static-getderivedstatefromprops-parameters*/}

- `props`: コンポーネントがレンダーしようとしている次の props。
- `state`: コンポーネントがレンダーしようとしている次の state。

#### 返り値 {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` は、state を更新するためのオブジェクトを返すか、何も更新しない場合は `null` を返します。

#### 注意点 {/*static-getderivedstatefromprops-caveats*/}

- このメソッドは、原因に関係なく*すべての*レンダーで発火します。[`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops) はこれとは異なり、親が再レンダーを引き起こしたときのみ発火し、ローカルの `setState` の結果としては発火しません。

- このメソッドはコンポーネントのインスタンスにアクセスできません。お望みであれば、コンポーネントの props と state に対する純関数をクラス定義の外部に抽出することで、`static getDerivedStateFromProps` と他のクラスメソッドとの間でコードを再利用することができます。

<Note>

クラスコンポーネントで `static getDerivedStateFromProps` を実装することは、関数コンポーネントでレンダー中に [`useState` の `set` 関数を呼び出す](/reference/react/useState#storing-information-from-previous-renders) ことと同等です。

</Note>

---

## 使用法 {/*usage*/}

### クラスコンポーネントを定義する {/*defining-a-class-component*/}

React のコンポーネントをクラスとして定義するには、組み込みの `Component` クラスを継承し、[`render` メソッド](#render)を定義します。

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React は、画面に何を表示するかを知るために、[`render`](#render) メソッドを呼び出します。通常、そこからは [JSX](/learn/writing-markup-with-jsx) を返します。`render` メソッドは[純関数](https://en.wikipedia.org/wiki/Pure_function)である、つまり JSX の計算のみを行う必要があります。

[関数コンポーネントと同様に](/learn/your-first-component#defining-a-component)、クラスコンポーネントでも親コンポーネントから [props を通じて情報を受け取る](/learn/your-first-component#defining-a-component)ことができます。ただし、props を読み取るための構文は異なります。例えば、親コンポーネントが `<Greeting name="Taylor" />` をレンダーする場合、この `name` プロパティは [`this.props`](#props) から `this.props.name` のようにして読み取ります。

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

フック（`use` で始まる [`useState`](/reference/react/useState) のような関数）はクラスコンポーネント内ではサポートされていないことに注意してください。

<Pitfall>

クラスの代わりに関数でコンポーネントを定義することを推奨します。[移行方法はこちら](#migrating-a-simple-component-from-a-class-to-a-function)。

</Pitfall>

---

### クラスコンポーネントに state を追加する {/*adding-state-to-a-class-component*/}

クラスに [state](/learn/state-a-components-memory) を追加するには、[`state`](#state) というプロパティにオブジェクトを割り当てます。state を更新するには、[`this.setState`](#setstate) を呼び出します。

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

クラスの代わりに関数でコンポーネントを定義することを推奨します。[移行方法はこちら](#migrating-a-component-with-state-from-a-class-to-a-function)。

</Pitfall>

---

### クラスコンポーネントにライフサイクルメソッドを追加する {/*adding-lifecycle-methods-to-a-class-component*/}

クラスにはいくつかの特別なメソッドを定義することができます。

[`componentDidMount`](#componentdidmount) メソッドを定義すると、コンポーネントが画面に追加される（*マウントされる*）ときに React がそれを呼び出します。props や state の変更によりコンポーネントが再レンダーされた後に、React は [`componentDidUpdate`](#componentdidupdate) を呼び出します。コンポーネントが画面から削除される（*アンマウントされる*）際に、React は [`componentWillUnmount`](#componentwillunmount) を呼び出します。

`componentDidMount` を実装する場合、通常はバグを避けるために 3 つすべてのライフサイクルを実装する必要があります。例えば、`componentDidMount` が何らかの state や props を読み取る場合はそれらに変更があった場合に処理するために `componentDidUpdate` を実装する必要があり、`componentDidMount` が実行したことをクリーンアップするためには `componentWillUnmount` を実装する必要があります。

例えば、以下の `ChatRoom` コンポーネントは、チャットへの接続を props および state と同期させています。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

開発時に [Strict Mode](/reference/react/StrictMode) が有効の場合、React は `componentDidMount` を呼び出し、直後に `componentWillUnmount` を呼び出し、その後再び `componentDidMount` を呼び出します。これにより、`componentWillUnmount` の実装を忘れた場合や、そのロジックが `componentDidMount` の挙動と正しく「鏡のように対応」していない場合に気づきやすくなります。

<Pitfall>

クラスの代わりに関数でコンポーネントを定義することを推奨します。[移行方法はこちら](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)。

</Pitfall>

---

### エラーバウンダリでレンダー中のエラーをキャッチする {/*catching-rendering-errors-with-an-error-boundary*/}

デフォルトでは、アプリケーションがレンダー中にエラーをスローすると、React はその UI を画面から削除します。これを防ぐために、UI を*エラーバウンダリ*にラップすることができます。エラーバウンダリは、クラッシュした部位の代わりに、例えばエラーメッセージなどのフォールバック UI を表示するための、特別なコンポーネントです。

エラーバウンダリコンポーネントを実装するためには、エラーに反応して state を更新し、ユーザにエラーメッセージを表示するための [`static getDerivedStateFromError`](#static-getderivedstatefromerror) を提供する必要があります。またオプションで、例えばエラーを分析サービスに記録するなどの追加のロジックを追加するために [`componentDidCatch`](#componentdidcatch) を実装することもできます。

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

次に、コンポーネントツリーの一部をこれでラップします。

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

もし `Profile` あるいはその子コンポーネントがエラーをスローすると、`ErrorBoundary` はそのエラーを「キャッチ」し、指定したエラーメッセージとともにフォールバック UI を表示し、エラーレポートをあなたのエラーレポーティングサービスに送信します。

すべてのコンポーネントを別々のエラーバウンダリでラップする必要はありません。[エラーバウンダリの粒度](https://www.brandondail.com/posts/fault-tolerance-react)について考える際は、エラーメッセージをどこに表示するのが理にかなっているかを考えてみてください。例えば、メッセージングアプリでは、会話のリストをエラーバウンダリで囲むのが理にかなっています。また、メッセージを個別に囲むことも理にかなっているでしょう。しかし、アバターを 1 つずつ囲むことには意味がありません。

<Note>

現在、関数コンポーネントとしてエラーバウンダリを書く方法はありません。しかし、自分でエラーバウンダリクラスを書く必要はありません。例えば、代わりに [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) を使用することができます。

</Note>

---

## 代替案 {/*alternatives*/}

### シンプルなコンポーネントをクラスから関数へ移行 {/*migrating-a-simple-component-from-a-class-to-a-function*/}

一般的には[コンポーネントは関数として定義](/learn/your-first-component#defining-a-component)します。

例えば、この `Greeting` クラスコンポーネントを関数に書き換えたいとします。

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

`Greeting` という関数を定義してください。ここに `render` 関数の本体を移動します。

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

`this.props.name` とする代わりに、props である `name` は[分割代入構文を使用して定義](/learn/passing-props-to-a-component)し、直接読み取ります：

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

完全な例は以下の通りです。

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### state を持つコンポーネントをクラスから関数へ移行 {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

この `Counter` クラスコンポーネントを関数に書き換えたいとします。

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

まず、必要となる [state 変数](/reference/react/useState#adding-state-to-a-component) を持った関数を宣言します。

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

次に、イベントハンドラを書き換えます。

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

最後に、`this` で始まる値への参照をすべて、コンポーネントで定義した変数と関数に置き換えます。例えば、`this.state.age` を `age` に、`this.handleNameChange` を `handleNameChange` に置き換えます。

完全に書き換えられたコンポーネントはこちらです。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### ライフサイクルメソッドを持つコンポーネントをクラスから関数へ移行 {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

ライフサイクルメソッドを持つ以下の `ChatRoom` クラスコンポーネントを関数に書き換えたいとします。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

まずは [`componentWillUnmount`](#componentwillunmount) が [`componentDidMount`](#componentdidmount) の逆の動作をしていることを確認してください。上記の例では `componentDidMount` によって確立された接続を切断しているので、そうなっています。そのようなロジックが存在しない場合、まずそれを追加してください。

次に、[`componentDidUpdate`](#componentdidupdate) メソッドが、`componentDidMount` で使用している props と state の変更を処理していることを確認してください。上記の例では、`componentDidMount` は `setupConnection` を呼び出しており、それが `this.state.serverUrl` と `this.props.roomId` を読み取っています。したがって `componentDidUpdate` も `this.state.serverUrl` と `this.props.roomId` が変更されたかどうかを確認し、変更があった場合は接続を再確立しなければなりません。`componentDidUpdate` のロジックが存在しない、あるいは関連するすべての props と state の変更を処理できていない場合は、まずそれを修正してください。

上記の例では、ライフサイクルメソッド内のロジックは、React の外部のシステム（チャットサーバ）にコンポーネントを接続しています。コンポーネントを外部システムに接続するためには、[このロジックを単一のエフェクトとして記述します](/reference/react/useEffect#connecting-to-an-external-system)。

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

この [`useEffect`](/reference/react/useEffect) の呼び出しは、上記のライフサイクルメソッド内のロジックと同等です。ライフサイクルメソッドが複数の互いに関連しないことを行っている場合は、[それらを複数の独立したエフェクトに分割してください](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。以下に完全な例を示します。

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

コンポーネントが外部システムとの同期を行わない場合、[エフェクトは必要ないかもしれません](/learn/you-might-not-need-an-effect)。

</Note>

---

### コンテクストを持つコンポーネントをクラスから関数へ移行 {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

以下の例では、クラスコンポーネントである `Panel` と `Button` が、[`this.context`](#context) から[コンテクスト](/learn/passing-data-deeply-with-context)を読み取っています。

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

これらを関数コンポーネントに変換する場合、`this.context` を [`useContext`](/reference/react/useContext) の呼び出しに置き換えます。

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
