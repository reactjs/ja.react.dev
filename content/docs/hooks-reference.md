---
id: hooks-reference
title: フック API リファレンス
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*フック (hook)* は React 16.8 で追加された新機能です。state などの React の機能を、クラスを書かずに使えるようになります。

このページでは React 組み込みのフックについて説明します。

フックが初めての方は、先に[概要](/docs/hooks-overview.html)ページを確認してください。[よくある質問](/docs/hooks-faq.html)にも有用な情報が掲載されています。

- [基本のフック](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [追加のフック](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)
  - [`useDeferredValue`](#usedeferredvalue)
  - [`useTransition`](#usetransition)
  - [`useId`](#useid)
- [ライブラリ製作者用フック](#library-hooks)
  - [`useSyncExternalStore`](#usesyncexternalstore)
  - [`useInsertionEffect`](#useinsertioneffect)

## 基本のフック {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

ステートフルな値と、それを更新するための関数を返します。

初回のレンダー時に返される `state` は第 1 引数として渡された値 (`initialState`) と等しくなります。

`setState` 関数は state を更新するために使用します。新しい state の値を受け取り、コンポーネントの再レンダーをスケジューリングします。

```js
setState(newState);
```

後続の再レンダー時には、`useState` から返される 1 番目の値は常に、更新を適用した後の最新版の state になります。

> 補足
>
> React は再レンダー間で `setState` 関数の同一性が保たれ、変化しないことを保証します。従って `useEffect` や `useCallback` の依存リストにはこの関数を含めないでも構いません。

#### 関数型の更新 {#functional-updates}

新しい state が前の state に基づいて計算される場合は、`setState` に関数を渡すことができます。この関数は前回の state の値を受け取り、更新された値を返します。以下は、`setState` の両方の形式を用いたカウンタコンポーネントの例です。

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

"+" と "-" のボタンは、更新後の値が更新前の値に基づいて計算されるため、関数形式を使っています。"Reset" ボタンは常にカウントを初期値に戻すので、通常の形式を使っています。

この更新用関数が現在の state と全く同じ値を返す場合は、後続する再レンダーは完全にスキップされます。

> 補足
>
> クラスコンポーネントの `setState` メソッドとは異なり、`useState` は自動的な更新オブジェクトのマージを行いません。この動作は関数型の更新形式をスプレッド構文と併用することで再現可能です：
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // Object.assign would also work
>   return {...prevState, ...updatedValues};
> });
> ```
>
> 別の選択肢としては `useReducer` があり、これは複数階層の値を含んだ state オブジェクトを管理する場合にはより適しています。

#### state の遅延初期化 {#lazy-initial-state}

`initialState` 引数は初回レンダー時に使われる state 値です。後続のレンダー時にはその値は無視されます。もし初期 state が高価な計算をして求める値である場合は、代わりに関数を渡すことができます。この関数は初回のレンダー時にのみ実行されます。

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### state 更新の回避 {#bailing-out-of-a-state-update}

現在値と同じ値で更新を行った場合、React は子のレンダーや副作用の実行を回避して処理を終了します（React は [`Object.is` による比較アルゴリズム](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)を使用します）。

更新の回避が起きる前に React により該当のコンポーネント自体はレンダーされるかもしれない、ということに注意してください。ツリーのそれ以上「深く」にまで処理は及ばないためこれは問題ではないはずです。もしレンダー中にコストの高い計算を行っている場合は `useMemo` を使った最適化が可能です。

#### state 更新のバッチ処理 {#batching-of-state-updates}

React はパフォーマンス改善のため、複数の state 更新を 1 回の再レンダーにまとめることがあります。通常、これによりパフォーマンスが改善しますが、あなたのアプリケーションの挙動には影響がないはずです。

React 18 より前では、React のイベントハンドラ内部で起きた更新のみがまとめて処理されていました。React 18 からは、[バッチ処理はすべての更新でデフォルトで有効になります](/blog/2022/03/08/react-18-upgrade-guide.html#automatic-batching)。ただし React はユーザが引き起こした複数の*異なる*イベント（例えばボタンの 2 回のクリック）に伴う更新をまとめることはありません。これにより論理的な誤りを防ぐことができます。

DOM への更新が同期的に適用されるよう強制しないといけないという稀な状況においては、[`flushSync`](/docs/react-dom.html#flushsync) で更新をラップすることができます。ただしこれはパフォーマンスに悪影響を及ぼしますので必要な場合にのみ利用するようにしてください。

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

副作用を有する可能性のある命令型のコードを受け付けます。

DOM の書き換え、データの購読、タイマー、ロギング、あるいはその他の副作用を、関数コンポーネントの本体（React の*レンダーフェーズ*）で書くことはできません。それを行うと UI にまつわるややこしいバグや非整合性を引き起こします。

代わりに `useEffect` を使ってください。`useEffect` に渡された関数はレンダーの結果が画面に反映された後に動作します。副作用とは React の純粋に関数的な世界から命令型の世界への避難ハッチであると考えてください。

デフォルトでは副作用関数はレンダーが終了した後に毎回動作しますが、[特定の値が変化した時のみ](#conditionally-firing-an-effect)動作させるようにすることもできます。

#### エフェクトのクリーンアップ {#cleaning-up-an-effect}

副作用はしばしば、コンポーネントが画面から消える場合にクリーンアップする必要があるようなリソース（例えば購読やタイマー ID など）を作成します。これを実現するために、`useEffect` に渡す関数はクリーンアップ用関数を返すことができます。例えば、データ購読を作成する場合は以下のようになります。

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

メモリリークを防止するため、コンポーネントが UI から削除される前にクリーンアップ関数が呼び出されます。それに加えて、コンポーネントが複数回レンダーされる場合（大抵はそうですが）、**新しい副作用を実行する前に前回の副作用はクリーンアップされます**。この例では、更新が発生する度に新しい購読が作成される、ということです。毎回の更新で副作用が実行されるのを抑制するためには、後の節をご覧ください。

#### 副作用のタイミング {#timing-of-effects}

`componentDidMount` や `componentDidUpdate` と異なり、`useEffect` に渡された関数はレイアウトと描画の**後で**遅延されたイベントとして実行されます。ほとんどの作業はブラウザによる画面への描画をブロックするべきではないため、購読やイベントハンドラのセットアップといったよくある副作用のほとんどにとって、この動作は適切です。

しかしすべての副作用が遅延できるわけではありません。例えばユーザに見えるような DOM の改変は、ユーザが見た目の不整合性を感じずに済むよう、次回の描画が発生する前に同期的に発生する必要があります（この違いは概念的には受動的なイベントリスナと能動的なイベントリスナの違いに似ています）。このようなタイプの副作用のため、React は [`useLayoutEffect`](#uselayouteffect) という別のフックを提供しています。これは `useEffect` と同じシグネチャを持っており、実行されるタイミングのみが異なります。

加えて、React 18 以降、`useEffect` に渡された関数は、クリックのような個々のユーザ入力の結果としてレイアウト・描画が起こる場合や、[`flushSync`](/docs/react-dom.html#flushsync) でラップされた更新の結果としてレイアウト・描画が起こる場合には、そのようなレイアウト・描画の**前に**同期的に呼び出されるようになります。この動作により、副作用の結果をイベントシステムや [`flushSync`](/docs/react-dom.html#flushsync) の呼び出し元が確認できるようになります。

> 補足
> 
> これは `useEffect` に渡された関数が呼び出されるタイミングにのみ影響します。副作用内でスケジュールされた更新が遅延されることに変わりはありません。[`useLayoutEffect`](#uselayouteffect) はこれとは異なり、関数を呼び出したあと内部での更新を即座に処理します。

ブラウザが描画を終えるまで `useEffect` が遅延される場合でも、次回のレンダーが起こるより前に実行されることは保証されています。React は新しい更新を始める前に常にひとつ前のレンダーの副作用をクリーンアップします。

#### 条件付きで副作用を実行する {#conditionally-firing-an-effect}

デフォルトの動作では、副作用関数はレンダーの完了時に毎回実行されます。これにより、コンポーネントの依存配列のうちのいずれかが変化した場合に毎回副作用が再作成されます。

しかし、上述のデータ購読の例でもそうですが、これは幾つかのケースではやりすぎです。新しい購読を設定する必要があるのは毎回の更新ごとではなく、`source` プロパティが変化した場合のみです。

これを実装するためには、`useEffect` の第 2 引数として、この副作用が依存している値の配列を渡します。変更後の例は以下のようになります。

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

これで、データの購読は `props.source` が変更された場合にのみ再作成されるようになります。

> 補足
>
> この最適化を利用する場合、**時間の経過とともに変化し副作用によって利用される、コンポーネントスコープの値（props や state など）**がすべて配列に含まれていることを確認してください。さもないとあなたのコードは以前のレンダー時の古い値を参照してしまうことになります。[関数の扱い方](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)と[この配列の値が頻繁に変わる場合の対処法](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)も参照してください。
>
> もしも副作用とそのクリーンアップを 1 度だけ（マウント時とアンマウント時にのみ）実行したいという場合、空の配列 (`[]`) を第 2 引数として渡すことができます。こうすることで、あなたの副作用は props や state の値の*いずれにも*依存していないため再実行する必要が一切ない、ということを React に伝えることができます。これは特別なケースとして処理されているわけではなく、入力配列を普通に処理すればそうなるというだけの話です。
>
> 空の配列 (`[]`) を渡した場合、副作用内では props と state の値は常にその初期値のままになります。`[]` を渡すことはおなじみの `componentDidMount` と `componentWillUnmount` による概念と似ているように感じるでしょうが、通常は[こちら](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)や[こちら](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)のように、副作用を過度に再実行しないためのよりよい解決方法があります。また `useEffect` はブラウザが描画し終えた後まで遅延されますので、追加の作業をしてもそれほど問題にならないということもお忘れなく。
>
>
> [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) パッケージの [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ルールを有効にすることをお勧めします。これは依存の配列が正しく記述されていない場合に警告し、修正を提案します。

依存の配列は副作用関数に引数として渡されるわけではありません。しかし概念としては、この記法は副作用関数の引数が何なのかを表現しています。副作用関数の内部で参照されているすべての値は入力の配列内にも現れるべきです。将来的には、コンパイラが発達すればこの配列を自動で作成することも可能であるはずです。

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

コンテクストオブジェクト（`React.createContext` からの戻り値）を受け取り、そのコンテクストの現在値を返します。コンテクストの現在値は、ツリー内でこのフックを呼んだコンポーネントの直近にある `<MyContext.Provider>` の `value` の値によって決定されます。

直近の `<MyContext.Provider>` が更新された場合、このフックはその `MyContext` プロバイダに渡された最新の `value` の値を使って再レンダーを発生させます。祖先コンポーネントが [`React.memo`](/docs/react-api.html#reactmemo) や [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate) を使っている場合でも、`useContext` を使っているコンポーネント自体から再レンダーが発生します。

`useContext` に渡す引数は**コンテクストオブジェクト自体**であることを忘れないでください。

 * **正しい：**`useContext(MyContext)`
 * **間違い：**`useContext(MyContext.Consumer)`
 * **間違い：**`useContext(MyContext.Provider)`

`useContext` を呼び出すコンポーネントはコンテクストの値が変化するたびに毎回再レンダーされます。再レンダーが高価である場合は[メモ化を使って最適化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)が可能です。

> ヒント
>
> フック以前のコンテクスト API に馴染みがある場合は、`useContext(MyContext)` はクラスにおける `static contextType = MyContext`、あるいは `<MyContext.Consumer>` と同等のものであると考えることができます。
>
> `useContext(MyContext)` は現在のコンテクストの値を**読み取り**、その変化を購読することしかできません。コンテクストの値を**設定**するために、今後もツリーの上の階層で `<MyContext.Provider>` が必要です。

**Context.Provider と組み合わせて使用する方法**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
この例は[コンテクストのガイド](/docs/context.html)をフック用に変更したものです。コンテクストをいつどのように使うべきかについては同記事を参照してください。


## 追加のフック {#additional-hooks}

以下のフックは前節で説明した基本のフックの変種であったり、特定の稀なケースでのみ必要となったりするものです。最初から無理に学ぼうとしなくて構いません。

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

[`useState`](#usestate) の代替品です。`(state, action) => newState` という型のリデューサ (reducer) を受け取り、現在の state を `dispatch` メソッドとペアにして返します（もし Redux に馴染みがあれば、これがどう動作するのかはご存じでしょう）。

通常、`useReducer` が `useState` より好ましいのは、複数の値にまたがる複雑な state ロジックがある場合や、前の state に基づいて次の state を決める必要がある場合です。また、`useReducer` を使えば[コールバックの代わりに `dispatch` を下位コンポーネントに渡せる](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)ようになるため、複数階層にまたがって更新を発生させるようなコンポーネントではパフォーマンスの最適化にもなります。

以下は [`useState`](#usestate) の部分で挙げたカウンタの例を、リデューサを使うよう書き換えたものです。

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

> 補足
>
> React は再レンダー間で `dispatch` 関数の同一性が保たれ、変化しないことを保証します。従って `useEffect` や `useCallback` の依存リストにはこの関数を含めないでも構いません。

#### 初期 state の指定 {#specifying-the-initial-state}

`useReducer` の初期化の方法には 2 種類あります。ユースケースによりどちらかを選択してください。最も単純な方法は第 2 引数として初期 state を渡すものです。

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

> 補足
>
> React では、リデューサの引数で `state = initialState` のようにして初期値を示すという、Redux で普及した慣習を使用しません。初期値は props に依存している可能性があるため、フックの呼び出し部分で指定します。強いこだわりがある場合は `useReducer(reducer, undefined, reducer)` という呼び出し方で Redux の振る舞いを再現できますが、お勧めはしません。

#### 遅延初期化 {#lazy-initialization}

初期 state の作成を遅延させることもできます。そのためには `init` 関数を第 3 引数として渡してください。初期 state が `init(initialArg)` に設定されます。

これにより初期 state の計算をリデューサの外部に抽出することができます。これはアクションに応じて state をリセットしたい場合にも便利です。

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### dispatch による更新の回避 {#bailing-out-of-a-dispatch}

このフックから state の現在値として同じ値を返した場合、React は子のレンダーや副作用の実行を回避して処理を終了します（React は [`Object.is` による比較アルゴリズム](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) を使用します）。

更新の回避が起きる前に React により該当のコンポーネント自体はレンダーされるかもしれない、ということに注意してください。ツリーのそれ以上「深く」にまで処理は及ばないためこれは問題ではないはずです。もしレンダー中にコストの高い計算を行っている場合は `useMemo` を使った最適化が可能です。

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

[メモ化](https://en.wikipedia.org/wiki/Memoization)されたコールバックを返します。

インラインのコールバックとそれが依存している値の配列を渡してください。`useCallback` はそのコールバックをメモ化したものを返し、その関数は依存配列の要素のいずれかが変化した場合にのみ変化します。これは、不必要なレンダーを避けるために（例えば `shouldComponentUpdate` などを使って）参照の同一性を見るよう最適化されたコンポーネントにコールバックを渡す場合に便利です。

`useCallback(fn, deps)` は `useMemo(() => fn, deps)` と等価です。

> 補足
>
> 依存する値の配列はコールバックに引数として渡されるわけではありません。しかし概念としては、この記法はコールバックの引数が何なのかを表現しています。コールバックの内部で参照されているすべての値は依存の配列内にも現れるべきです。将来的には、コンパイラが発達すればこの配列を自動で作成することも可能であるはずです。
>
> [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) パッケージの [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ルールを有効にすることをお勧めします。これは依存の配列が正しく記述されていない場合に警告し、修正を提案します。

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

[メモ化](https://en.wikipedia.org/wiki/Memoization)された値を返します。

"作成用" 関数とそれが依存する値の配列を渡してください。`useMemo` は依存配列の要素のいずれかが変化した場合にのみメモ化された値を再計算します。この最適化によりレンダー毎に高価な計算が実行されるのを避けることができます。

`useMemo` に渡した関数はレンダー中に実行されるということを覚えておいてください。レンダー中に通常やらないようなことをこの関数内でやらないようにしましょう。例えば副作用は `useMemo` ではなく `useEffect` の仕事です。

配列が渡されなかった場合は、新しい値がレンダーごとに毎回計算されます。

**`useMemo` はパフォーマンス最適化のために使うものであり、意味上の保証があるものだと考えないでください。**将来的に React は、例えば画面外のコンポーネント用のメモリを解放するため、などの理由で、メモ化された値を「忘れる」ようにする可能性があります。`useMemo` なしでも動作するコードを書き、パフォーマンス最適化のために `useMemo` を加えるようにしましょう。

> 補足
>
> 依存する値の配列は第 1 引数の関数に引数として渡されるわけではありません。しかし概念としては、この記法は関数の引数が何なのかを表現しています。関数の内部で参照されているすべての値は依存の配列内にも現れるべきです。将来的には、コンパイラが発達すればこの配列を自動で作成することも可能であるはずです。
>
> [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) パッケージの [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ルールを有効にすることをお勧めします。これは依存の配列が正しく記述されていない場合に警告し、修正を提案します。

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` は、`.current` プロパティが渡された引数 (`initialValue`) に初期化されているミュータブルな ref オブジェクトを返します。返されるオブジェクトはコンポーネントの存在期間全体にわたって存在し続けます。

よくあるユースケースは、子コンポーネントに命令型でアクセスするというものです：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

本質的に `useRef` とは、書き換え可能な値を `.current` プロパティ内に保持することができる「箱」のようなものです。

まずは ref のことを [DOM にアクセスする](/docs/refs-and-the-dom.html)手段として理解しているかもしれません。`<div ref={myRef} />` のようにして React に ref オブジェクトを渡した場合、React は DOM ノードに変更があるたびに `.current` プロパティをその DOM ノードに設定します。

しかしながら `useRef()` は `ref` 属性で使うだけではなく、より便利に使えます。これはクラスでインスタンス変数を使うのと同様にして、[あらゆる書き換え可能な値を保持しておくのに便利](/docs/hooks-faq.html#is-there-something-like-instance-variables)です。

これは `useRef()` がプレーンな JavaScript オブジェクトを作成するからです。`useRef()` を使うことと自分で `{current: ...}` というオブジェクトを作成することとの唯一の違いとは、`useRef` は毎回のレンダーで同じ ref オブジェクトを返す、ということです。

`useRef` は中身が変更になってもそのことを通知**しない**ということを覚えておいてください。`.current` プロパティを書き換えても再レンダーは発生しません。DOM ノードを ref に割り当てたり割り当てを解除したりする際に何らかのコードを走らせたいという場合は、[コールバック ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) を代わりに使用してください。


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` は `ref` が使われた時に親コンポーネントに渡されるインスタンス値をカスタマイズするのに使います。いつもの話ですが、ref を使った手続き的なコードはほとんどの場合に避けるべきです。`useImperativeHandle` は [`forwardRef`](/docs/react-api.html#reactforwardref) と組み合わせて使います：

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

この例では、`<FancyInput ref={inputRef} />` をレンダーする親コンポーネントは `inputRef.current.focus()` を呼べるようになります。

### `useLayoutEffect` {#uselayouteffect}

この関数のシグネチャは `useEffect` と同一ですが、DOM の変更があった後で同期的に副作用が呼び出されます。これは DOM からレイアウトを読み出して同期的に再描画を行う場合に使ってください。`useLayoutEffect` の内部でスケジュールされた更新はブラウザによって描画される前のタイミングで同期的に処理されます。

可能な場合は画面の更新がブロックするのを避けるため、標準の `useEffect` を優先して使ってください。

> ヒント
>
> クラスコンポーネントからコードを移行している場合、`useLayoutEffect` は `componentDidMount` や `componentDidUpdate` と同じフェーズで実行されるということに注意してください。しかし**まず `useEffect` で始めてみて**、それで問題が発生する場合にのみ `useLayoutEffect` を試すことをお勧めします。
>
> サーバレンダリングを使用している場合は、`useLayoutEffect` と `useEffect` の**どちらも** JavaScript がダウンロードされるまでは実行できないということを覚えておいてください。サーバでレンダーされるコンポーネントに `useLayoutEffect` が含まれている場合に React が警告を発生するのは、これが理由です。これを修正するには、そのロジックを `useEffect` に移動する（初回レンダーで必要がないロジックである場合）か、クライアントでレンダーされるまでコンポーネントの表示を遅らせる（`useLayoutEffect` が実行されるまで該当 HTML が正しく表示できない場合）ようにしてください。
>
> サーバでレンダーされる HTML からレイアウト副作用を必要とするコンポーネントを除外したい場合は、それを `showChild && <Child />` のようにして条件付きでレンダーするようにして、表示を `useEffect(() => { setShowChild(true); }, [])` のようにして遅延させてください。これにより、JavaScript コードが注入される前に壊れた見た目の UI が表示されないようになります。

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` を使って React DevTools でカスタムフックのラベルを表示することができます。

例えば ["独自フックの作成"](/docs/hooks-custom.html) で説明した `useFriendStatus` を例にします：

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> ヒント
>
> すべてのカスタムフックにデバッグ用の値を加えるのはお勧めしません。これが最も有用なのは共有ライブラリ内のカスタムフックです。

#### デバッグ用の値のフォーマットを遅延させる {#defer-formatting-debug-values}

値を表示用にフォーマットすることが高価な処理である場合があります。また、フックが実際に DevTools でインスペクトされない場合はフォーマット自体が不要な処理です。

このため `useDebugValue` はオプションの第 2 引数としてフォーマット用関数を受け付けます。この関数はフックがインスペクトされている場合にのみ呼び出されます。この関数はデバッグ値を引数として受け取り、フォーマット済みの表示用の値を返します。

例えば `Date` 型の値を返すカスタムフックでは、以下のようなフォーマッタ関数を渡すことで、不必要に `toDateString` を呼び出すのを避けることができます。

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` は値を受け取りその値のコピーを返しますが、返り値はより緊急性の高い更新がある場合に遅延されうるようになっています。現在のレンダーがユーザ入力のような緊急性の高い更新である場合には、React は前回と同じ値を返し、新しい値でのレンダーは緊急性の高いレンダーが完了した後に行うようにします。

このフックはデバウンス (debounce) やスロットル (throttle) を使って更新を遅延するためにユーザ側で作成されてきたフックと似ています。`useDeferredValue` を使う利点は、（常に何らかの固定の時間待つのではなく）他の作業が終わった時点ですぐに React が更新を処理できるという点と、[`startTransition`](/docs/react-api.html#starttransition) と同様に値を遅延させることで既存のコンテンツがふいにフォールバックに隠されてしまわないよう待機できるという点です。

#### 遅延可能な子コンポーネントのメモ化 {#memoizing-deferred-children}
`useDeferredValue` が遅延させるのは渡された値のみです。緊急性の高い更新の最終に子コンポーネントが再レンダーされるのを防ぎたい場合、そのコンポーネントで [`React.memo`](/docs/react-api.html#reactmemo) か [`React.useMemo`](/docs/hooks-reference.html#usememo) を使ってメモ化を行う必要があります：

```js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

子をメモ化することで、`query` が変わった場合ではなく `deferredQuery` が変わった場合にのみ再レンダーすると React に伝えることができます。この注意事項は `useDeferredValue` に特有のものではなく、デバウンスやスロットルを使う似たようなフックで使われるものと同じパターンです。

### `useTransition` {#usetransition}

```js
const [isPending, startTransition] = useTransition();
```

トランジションの実行中状態を表す状態値と、トランジションを開始するための関数を返します。

`startTransition` に渡されたコールバック内の更新はトランジションとしてマークされます：

```js
startTransition(() => {
  setCount(count + 1);
})
```

`isPending` はトランジションがアクティブかどうかを表しており、ユーザに保留中状態を表示するのに使えます：

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> 補足：
>
> トランジション内での更新はクリックのような緊急性の高い更新がある場合は遅延されることがあります。
>
> トランジション内での更新によってコンテンツが再サスペンドした場合でもフォールバックは表示されません。これにより更新後のデータをレンダーしている最中に、ユーザが現在のコンテンツを操作しつづけられるようになります。

### `useId` {#useid}

```js
const id = useId();
```

`useId` はハイドレーション時の不整合を防ぎつつサーバとクライアント間で安定な一意 ID を作成するためのフックです。

> 補足
>
> `useId` は[リスト内の key](/docs/lists-and-keys.html#keys) を作成するのに使うためのものでは**ありません**。key はあなたのデータから作成されるべきです。

基本的な例として、`id` をそれを必要としている要素に直接渡せます：

```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

同じコンポーネントで複数の ID を使う場合は、同じ `id` に接尾辞を付けてください：

```js
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> 補足：
> 
> `useId` は `:` というトークンを含む文字列を生成します。これによりトークンが一意であることが保証しやすくなりますが、CSS セレクタや `querySelectorAll` のような API では使用できません。
> 
> `useId` は複数のルートがあるアプリで衝突が起きないよう、`identifierPrefix` をサポートしています。設定する場合は [`hydrateRoot`](/docs/react-dom-client.html#hydrateroot) と [`ReactDOMServer`](/docs/react-dom-server.html) のドキュメントを参照してください。

## ライブラリ用フック {#library-hooks}

以下のフックは React モデルと深く結合するライブラリの製作者向けであり、アプリケーションコードでは通常使われません。

### `useSyncExternalStore` {#usesyncexternalstore}

```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

`useSyncExternalStore` は、選択的ハイドレーションやタイムスライスなどの並行レンダリング機能と互換性を持ちつつ外部データソースから読み出しやデータの購読を行うために推奨されるフックです。

このメソッドは 3 つの引数を受け取り、ストアの値を返します：
- `subscribe`: ストアに変更があった場合に呼び出されるコールバックを登録するための関数。
- `getSnapshot`: 現在のストアの値を返す関数。
- `getServerSnapshot`: サーバレンダリング時にスナップショットを返すための関数。

最も基本的な例では、ストア全体を単純に購読します：

```js
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

ただし特定のフィールドを購読するようにもできます：

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
);
```

サーバレンダリングでは、サーバで使われるストアの値をシリアライズして `useSyncExternalStore` に渡す必要があります。React はハイドレーション中にこのスナップショットを利用してサーバとのミスマッチを防止します：

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
  () => INITIAL_SERVER_SNAPSHOT.selectedField,
);
```

> 補足：
>
> `getSnapshot` はキャッシュされた値を返す必要があります。もし getSnapshot が連続して呼ばれる場合、その間にストアの更新がないのであれば、全く同一の値を返さなければなりません。
> 
> 複数の React バージョンをサポートするための互換ライブラリが `use-sync-external-store/shim` として提供されています。このライブラリは `useSyncExternalStore` が存在する場合はそれを優先して利用し、ない場合はユーザスペースでの実装にフォールバックします。
> 
> 便宜のため、getSnapshot の結果に対する自動的なメモ化をサポートしたバージョンの API を `use-sync-external-store/with-selector` として公開しています。

### `useInsertionEffect` {#useinsertioneffect}

```js
useInsertionEffect(didUpdate);
```

シグネチャは `useEffect` と同一ですが、すべての DOM 更新の*前に*同期的に呼び出されます。[`useLayoutEffect`](#uselayouteffect) でレイアウトを読み出す前に DOM にスタイルを注入するために利用してください。このフックの利用目的は限られているため、ref にアクセスしたり更新をスケジュールしたりすることはできません。

> 補足：
>
> `useInsertionEffect` は css-in-js ライブラリの作者以外が使うべきではありません。[`useEffect`](#useeffect) や [`useLayoutEffect`](#uselayouteffect) を通常は使ってください。
