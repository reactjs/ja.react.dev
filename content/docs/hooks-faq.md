---
id: hooks-faq
title: フックに関するよくある質問
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*フック (hook)* は React 16.8 で追加された新機能です。state などの React の機能を、クラスを書かずに使えるようになります。

このページでは[フック](/docs/hooks-overview.html)に関するよくある質問にいくつかお答えします。

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

<<<<<<< HEAD
* **[導入の指針](#adoption-strategy)**
  * [フックが使える React のバージョンはどれですか？](#which-versions-of-react-include-hooks)
  * [クラスコンポーネントを全部書き換える必要があるのですか？](#do-i-need-to-rewrite-all-my-class-components)
  * [クラスではできず、フックでできるようになることは何ですか？](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [これまでの React の知識はどの程度使えますか？](#how-much-of-my-react-knowledge-stays-relevant)
  * [フック、クラスのいずれを使うべきですか、あるいはその両方でしょうか？](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [フックはクラスのユースケースのすべてをカバーしていますか？](#do-hooks-cover-all-use-cases-for-classes)
  * [フックはレンダープロップや高階コンポーネントを置き換えるものですか？](#do-hooks-replace-render-props-and-higher-order-components)
  * [Redux の connect() や React Router といった人気の API はフックによりどうなりますか？](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [フックは静的型付けと組み合わせてうまく動きますか？](#do-hooks-work-with-static-typing)
  * [フックを使ったコンポーネントはどのようにテストするのですか？](#how-to-test-components-that-use-hooks)
  * [Lint ルールは具体的に何を強制するのですか？](#what-exactly-do-the-lint-rules-enforce)
* **[クラスからフックへ](#from-classes-to-hooks)**
  * [個々のライフサイクルメソッドはフックとどのように対応するのですか？](#how-do-lifecycle-methods-correspond-to-hooks)
  * [インスタンス変数のようなものはありますか？](#is-there-something-like-instance-variables)
  * [state 変数は 1 つにすべきですか、たくさん使うべきですか？](#should-i-use-one-or-many-state-variables)
  * [コンポーネントの更新の時だけ副作用を実行することは可能ですか？](#can-i-run-an-effect-only-on-updates)
  * [前回の props や state はどうすれば取得できますか？](#how-to-get-the-previous-props-or-state)
  * [どうすれば getDerivedStateFromProps を実装できますか？](#how-do-i-implement-getderivedstatefromprops)
  * [forceUpdate のようなものはありますか？](#is-there-something-like-forceupdate)
  * [関数コンポーネントへの ref を作ることは可能ですか？](#can-i-make-a-ref-to-a-function-component)
  * [const [thing, setThing] = useState() というのはどういう意味ですか？](#what-does-const-thing-setthing--usestate-mean)
* **[パフォーマンス最適化](#performance-optimizations)**
  * [更新時に副作用をスキップすることはできますか？](#can-i-skip-an-effect-on-updates)
  * [どうすれば `shouldComponentUpdate` を実装できますか？](#how-do-i-implement-shouldcomponentupdate)
  * [計算結果のメモ化はどのように行うのですか？](#how-to-memoize-calculations)
  * [計算量の大きいオブジェクトの作成を遅延する方法はありますか？](#how-to-create-expensive-objects-lazily)
  * [レンダー内で関数を作るせいでフックは遅くなるのではないですか？](#are-hooks-slow-because-of-creating-functions-in-render)
  * [どうすれば複数のコールバックを深く受け渡すのを回避できますか？](#how-to-avoid-passing-callbacks-down)
  * [useCallback からの頻繁に変わる値を読み出す方法は？](#how-to-read-an-often-changing-value-from-usecallback)
* **[内部の仕組み](#under-the-hood)**
  * [React はフック呼び出しとコンポーネントとをどのように関連付けているのですか？](#how-does-react-associate-hook-calls-with-components)
  * [フックの先行技術にはどのようなものがありますか？](#what-is-the-prior-art-for-hooks)

## 導入の指針 {#adoption-strategy}

### フックが使える React のバージョンはどれですか？ {#which-versions-of-react-include-hooks}

React バージョン 16.8.0 より、以下においてフックの安定版の実装が含まれています。
=======
* **[Adoption Strategy](#adoption-strategy)**
  * [Which versions of React include Hooks?](#which-versions-of-react-include-hooks)
  * [Do I need to rewrite all my class components?](#do-i-need-to-rewrite-all-my-class-components)
  * [What can I do with Hooks that I couldn't with classes?](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [How much of my React knowledge stays relevant?](#how-much-of-my-react-knowledge-stays-relevant)
  * [Should I use Hooks, classes, or a mix of both?](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Do Hooks cover all use cases for classes?](#do-hooks-cover-all-use-cases-for-classes)
  * [Do Hooks replace render props and higher-order components?](#do-hooks-replace-render-props-and-higher-order-components)
  * [What do Hooks mean for popular APIs like Redux connect() and React Router?](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Do Hooks work with static typing?](#do-hooks-work-with-static-typing)
  * [How to test components that use Hooks?](#how-to-test-components-that-use-hooks)
  * [What exactly do the lint rules enforce?](#what-exactly-do-the-lint-rules-enforce)
* **[From Classes to Hooks](#from-classes-to-hooks)**
  * [How do lifecycle methods correspond to Hooks?](#how-do-lifecycle-methods-correspond-to-hooks)
  * [How can I do data fetching with Hooks?](#how-can-i-do-data-fetching-with-hooks)
  * [Is there something like instance variables?](#is-there-something-like-instance-variables)
  * [Should I use one or many state variables?](#should-i-use-one-or-many-state-variables)
  * [Can I run an effect only on updates?](#can-i-run-an-effect-only-on-updates)
  * [How to get the previous props or state?](#how-to-get-the-previous-props-or-state)
  * [Why am I seeing stale props or state inside my function?](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [How do I implement getDerivedStateFromProps?](#how-do-i-implement-getderivedstatefromprops)
  * [Is there something like forceUpdate?](#is-there-something-like-forceupdate)
  * [Can I make a ref to a function component?](#can-i-make-a-ref-to-a-function-component)
  * [What does const [thing, setThing] = useState() mean?](#what-does-const-thing-setthing--usestate-mean)
* **[Performance Optimizations](#performance-optimizations)**
  * [Can I skip an effect on updates?](#can-i-skip-an-effect-on-updates)
  * [Is it safe to omit functions from the list of dependencies?](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [What can I do if my effect dependencies change too often?](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [How do I implement shouldComponentUpdate?](#how-do-i-implement-shouldcomponentupdate)
  * [How to memoize calculations?](#how-to-memoize-calculations)
  * [How to create expensive objects lazily?](#how-to-create-expensive-objects-lazily)
  * [Are Hooks slow because of creating functions in render?](#are-hooks-slow-because-of-creating-functions-in-render)
  * [How to avoid passing callbacks down?](#how-to-avoid-passing-callbacks-down)
  * [How to read an often-changing value from useCallback?](#how-to-read-an-often-changing-value-from-usecallback)
* **[Under the Hood](#under-the-hood)**
  * [How does React associate Hook calls with components?](#how-does-react-associate-hook-calls-with-components)
  * [What is the prior art for Hooks?](#what-is-the-prior-art-for-hooks)

## Adoption Strategy {#adoption-strategy}

### Which versions of React include Hooks? {#which-versions-of-react-include-hooks}

Starting with 16.8.0, React includes a stable implementation of React Hooks for:
>>>>>>> 2cd4d0cf5ddadf90446b3a5038a9bc4875151355

* React DOM
* React DOM Server
* React Test Renderer
* React Shallow Renderer

**フックを利用するには、すべての React のパッケージが 16.8.0 以上である必要があります**。例えば React DOM の更新を忘れた場合、フックは動作しません。

React Native は次の安定版リリースでフックを全面的にサポートします。

### クラスコンポーネントを全部書き換える必要があるのですか？ {#do-i-need-to-rewrite-all-my-class-components}

いいえ。React からクラスを削除する[予定はありません](/docs/hooks-intro.html#gradual-adoption-strategy) -- 我々はみなプロダクトを世に出し続ける必要があり、クラスを書き換えている余裕はありません。新しいコードでフックを試すことをお勧めします。

### クラスではできず、フックでできるようになることは何ですか？ {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

フックにより、コンポーネント間で機能を再利用するためのパワフルで表現力の高い手段が得られます。["独自フックの作成"](/docs/hooks-custom.html)を読めばできることの概要が掴めるでしょう。React のコアチームメンバーによって書かれた[この記事](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)により、フックによって新たにもたらされる可能性についての洞察が得られます。

### これまでの React の知識はどの程度使えますか？ {#how-much-of-my-react-knowledge-stays-relevant}

フックとは、state やライフサイクル、コンテクストや ref といった、あなたが既に知っている React の機能をより直接的に利用できるようにする手段です。React の動作が根本的に変わるようなものではありませんし、コンポーネントや props、トップダウンのデータの流れについての知識はこれまと同様に重要です。

もちろんフックにはフックなりの学習曲線があります。このドキュメントに足りないことを見つけたら [Issue を報告](https://github.com/reactjs/reactjs.org/issues/new)していただければ、お手伝いします。

### フック、クラスのいずれを使うべきですか、あるいはその両方でしょうか？ {#should-i-use-hooks-classes-or-a-mix-of-both}

準備ができしだい、新しいコンポーネントでフックを試すことをお勧めします。チームの全員の準備が完了し、このドキュメントに馴染んでいることを確かめましょう。（例えばバグを直すなどの理由で）何にせよ書き換える予定の場合を除いては、既存のクラスをフックに書き換えることはお勧めしません。

クラスコンポーネントの*定義内で*でフックを使うことはできませんが、クラス型コンポーネントとフックを使った関数型コンポーネントとを 1 つのコンポーネントツリー内で混在させることは全く問題ありません。あるコンポーネントがクラスで書かれているかフックを用いた関数で書かれているかというのは、そのコンポーネントの実装の詳細です。長期的には、フックが React のコンポーネントを書く際の第一選択となることを期待しています。

### フックはクラスのユースケースのすべてをカバーしていますか？ {#do-hooks-cover-all-use-cases-for-classes}

我々の目標はできるだけ早急にフックがすべてのクラスのユースケースをカバーできるようにすることです。まだ使用頻度の低い `getSnapshotBeforeUpdate` と `componentDidCatch` についてはフックでの同等物が存在していませんが、すぐに追加する予定です。

まだフックはできたばかりですので、幾つかのサードパーティ製のライブラリは現時点でフックとの互換性がないかもしれません。

### フックはレンダープロップや高階コンポーネントを置き換えるものですか？ {#do-hooks-replace-render-props-and-higher-order-components}

レンダープロップや高階コンポーネントは、ひとつの子だけをレンダーすることがよくあります。フックはこのようなユースケースを実現するより簡単な手段だと考えています。これらのパターンには引き続き利用すべき場面があります（例えば、バーチャルスクローラーコンポーネントは `renderItem` プロパティを持つでしょうし、コンテナコンポーネントは自分自身の DOM 構造を有しているでしょう）。とはいえ大抵の場合ではフックで十分であり、フックがツリーのネストを減らすのに役立つでしょう。

### Redux の `connect()` や React Router といった人気の API はフックによりどうなりますか？ {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

これまでと同様に全く同じ API を使用し続けることができます。それらは動作し続けます。

将来的には、これらのライブラリの新バージョンが、例えば `useRedux()` や `useRouter()` のようなカスタムフックをエクスポートし、ラッパコンポーネントなしで同様の機能が使えるようになるかもしれません。

### フックは静的型付けと組み合わせてうまく動きますか？ {#do-hooks-work-with-static-typing}

フックは静的型付けを念頭に設計されました。フックは関数ですので、高階コンポーネントのようなパターンと比較しても正しく型付けするのは容易です。最新版の Flow と TypeScript における React の型定義には、React のフックについてのサポートが含まれています。

重要なことですが、もしより厳密に型付けしたい場合は、カスタムフックを使うことで React API に何らかの制約を加えることが可能です。React は基本部品を提供しますが、最初から提供されているものと違う方法でそれらを様々に組み合わせることができます。

### フックを使ったコンポーネントはどのようにテストするのですか？ {#how-to-test-components-that-use-hooks}

React の観点から見れば、フックを使ったコンポーネントは単なる普通のコンポーネントです。あなたのテストソリューションが React の内部動作に依存しているのでない場合、フックを使ったコンポーネントのテストのやり方は、あなたが普段コンポーネントをテストしているやり方と変わらないはずです。

例えばこのようなカウンタコンポーネントがあるとしましょう：

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

これを React DOM を使ってテストします。ブラウザでの挙動と確実に合致させるため、これをレンダーしたり更新したりするコードを [`ReactTestUtils.act()`](/docs/test-utils.html#act) でラップします：

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Test first render and effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

`act()` を呼び出すと内部の副作用も処理されます。

カスタムフックをテストしたい場合は、テスト内でコンポーネントを作って中でそのカスタムフックを使うようにしてください。そうすればそのコンポーネントをテストできます。

ボイラープレートを減らすため、エンドユーザが使うのと同じ形でコンポーネント使ってテストが記述できるように設計されている、[`react-testing-library`](https://git.io/react-testing-library) の利用をお勧めします。

### [Lint ルール](https://www.npmjs.com/package/eslint-plugin-react-hooks) は具体的に何を強制するのですか？ {#what-exactly-do-the-lint-rules-enforce}

我々は [ESLint プラグイン](https://www.npmjs.com/package/eslint-plugin-react-hooks) を提供しており、これにより[フックのルール](/docs/hooks-rules.html)を強制してバグを減らすことができます。このルールは、`use` で始まり大文字が続くような名前の関数はすべてフックであると仮定します。これは不完全な推測手段であり過剰検出があるかもしれないことは認識していますが、エコシステム全体での規約なくしてはフックはうまく動作しません。また名前を長くするとフックを利用したり規約を守ったりしてくれなくなるでしょう。

具体的には、このルールは以下を強制します：

* フックの呼び出しが `PascalCase` 名の関数内（コンポーネントと見なされます）か、あるいは他の `useSomething` 式の名前の関数内（カスタムフックと見なされます）にあること。
* すべてのレンダー間でフックが同じ順番で呼び出されること。

これ以外にも幾つかの推測を行っており、また、バグ検出と過剰検出抑制とのバランスを調整していくなかで、これらは将来的に変わる可能性があります。

## クラスからフックへ {#from-classes-to-hooks}

### 個々のライフサイクルメソッドはフックとどのように対応するのですか？ {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`: 関数コンポーネントはコンストラクタを必要としません。state は [`useState`](/docs/hooks-reference.html#usestate) を呼び出すときに初期化します。初期 state の計算が高価である場合、`useState` に関数を渡すことができます。

* `getDerivedStateFromProps`: [レンダー中に](#how-do-i-implement-getderivedstatefromprops)更新をスケジューリングします。

* `shouldComponentUpdate`: ページ[下部の](#how-do-i-implement-shouldcomponentupdate) `React.memo` についての説明を参照してください。

* `render`: これは関数コンポーネントの本体そのものです。

* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`: これらのあらゆる組み合わせは [`useEffect` フック](/docs/hooks-reference.html#useeffect) で表現できます（[これ](#can-i-skip-an-effect-on-updates)や[これ](#can-i-run-an-effect-only-on-updates)のような頻度の低いケースも含め）。

* `componentDidCatch` と `getDerivedStateFromError`: フックによる同等物はまだ存在していませんが、近日中に追加される予定です。

<<<<<<< HEAD
### インスタンス変数のようなものはありますか？ {#is-there-something-like-instance-variables}
=======
### How can I do data fetching with Hooks?

Check out [this article](https://www.robinwieruch.de/react-hooks-fetch-data/) to learn more about data fetching with Hooks.

### Is there something like instance variables? {#is-there-something-like-instance-variables}
>>>>>>> 2cd4d0cf5ddadf90446b3a5038a9bc4875151355

はい！ [`useRef()`](/docs/hooks-reference.html#useref) フックは DOM への参照を保持するためだけにあるのではありません。"ref" オブジェクトは汎用のコンテナであり、その `current` プロパティの値は変更可能かつどのような値でも保持することができますので、クラスのインスタンス変数と同様に利用できます。

例えば `useEffect` 内から "ref" オブジェクトを書き換えることができます。

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

単にインターバルをセットしたいだけであれば（`id` はこの副作用内でローカルでよいので）この ref は必要ないところですが、もしもイベントハンドラ内でインターバルをクリアしたい場合には便利です：

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

概念的には、ref はクラスにおけるインスタンス変数と似たものだと考えることができます。[遅延初期化](#how-to-create-expensive-objects-lazily)をしたい場合を除き、レンダーの最中に ref を書き換えることはしないでください。その代わり、通常 ref はイベントハンドラや副作用内でだけ書き換えるようにしましょう。

### state 変数は 1 つにすべきですか、たくさん使うべきですか？ {#should-i-use-one-or-many-state-variables}

これまでクラスを使っていたなら、`useState()` を 1 回だけ呼んで、1 つのオブジェクト内にすべての state を入れたくなるかもしれません。そうしたければそのようにすることもできます。以下はマウスの動作を追跡するコンポーネントの例です。位置やサイズの情報を 1 つのローカル state に保持しています。

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

ここで例えば、ユーザがマウスを動かしたときに `left` と `top` を変更したいとしましょう。この際、これらのフィールドを古い state に手動でマージしないといけないことに注意してください：

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // Spreading "...state" ensures we don't "lose" width and height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // Note: this implementation is a bit simplified
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

これは state 変数を更新する時には変数の値が*置換*されるからです。これは更新されるフィールドがオブジェクトに*マージ*されるというクラスでの `this.setState` の挙動とは異なります。

自動マージがないとつらい場合は、`useLegacyState` のようなカスタムフックを書いてオブジェクト型の state の更新をマージするようにすることはできます。しかし、我々は**どの値が一緒に更新されやすいのかに基づいて、state を複数の state 変数に分割することをお勧めします。**

例えば、コンポーネントの state を `position` と `size` という複数のオブジェクトに分割して、マージを行わなくても `position` を常に新たな値で置換するようにできるでしょう。

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

互いに独立した state 変数を分割することには別の利点もあります。そうすることで後からそのロジックをカスタムフックに抽出しやすくなるのです。例えば：

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

`position` の state 変数に対する `useState` の呼び出しとそれに関連する副作用を、それらのコードを変えずにカスタムフックに移行できたことに注意してください。もしすべての state が単一のオブジェクトに入っていたら、抽出するのはもっと困難だったでしょう。

すべての state を 1 つの `useState` 呼び出しに含めても動作しますし、フィールドごとに別に `useState` を持たせることでも動作はします。しかしこれらの両極端の間でうまくバランスを取り、少数の独立した state 変数に関連する state をグループ化することで、コンポーネントは最も読みやすくなります。state のロジックが複雑になった場合は、それを[リデューサで管理する](/docs/hooks-reference.html#usereducer)か、カスタムフックを書くことをお勧めします。

### コンポーネントの更新の時だけ副作用を実行することは可能ですか？ {#can-i-run-an-effect-only-on-updates}

これは稀なユースケースです。必要であれば、[変更可能な ref](#is-there-something-like-instance-variables) を使って、初回レンダー中なのか更新中なのかに対応する真偽値を手動で保持し、副作用内でその値を参照するようにすることができます。（このようなことを何度もやる場合は、そのためのカスタムフックを書くことができます）

### 前回の props や state はどうすれば取得できますか？ {#how-to-get-the-previous-props-or-state}

現時点では、これは [ref を使って](#is-there-something-like-instance-variables)手動で行うことができます：

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

上記はちょっと複雑かもしれませんが、これをカスタムフックに抽出することができます。

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

これは props でも state でも、その他計算されたどのような値に対しても動作します。

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count * 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

これは比較的よくあるユースケースですので、将来的に `usePrevious` というフックを React が最初から提供するようにする可能性があります。

[派生 state における推奨されるパターン](#how-do-i-implement-getderivedstatefromprops)についても参照してください。

<<<<<<< HEAD
### どうすれば `getDerivedStateFromProps` を実装できますか？ {#how-do-i-implement-getderivedstatefromprops}
=======
### Why am I seeing stale props or state inside my function? {#why-am-i-seeing-stale-props-or-state-inside-my-function}

Any function inside a component, including event handlers and effects, "sees" the props and state from the render it was created in. For example, consider code like this:

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

If you first click "Show alert" and then increment the counter, the alert will show the `count` variable **at the time you clicked the "Show alert" button**. This prevents bugs caused by the code assuming props and state don't change.

If you intentionally want to read the *latest* state from some asynchronous callback, you could keep it in [a ref](/docs/hooks-faq.html#is-there-something-like-instance-variables), mutate it, and read from it.

Finally, another possible reason you're seeing stale props or state is if you use the "dependency array" optimization but didn't correctly specify all the dependencies. For example, if an effect specifies `[]` as the second argument but reads `someProp` inside, it will keep "seeing" the initial value of `someProp`. The solution is to either remove the dependency array, or to fix it. Here's [how you can deal with functions](#is-it-safe-to-omit-functions-from-the-list-of-dependencies), and here's [other common strategies](#what-can-i-do-if-my-effect-dependencies-change-too-often) to run effects less often without incorrectly skipping dependencies.

>Note
>
>We provide an [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint rule as a part of the [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

### How do I implement `getDerivedStateFromProps`? {#how-do-i-implement-getderivedstatefromprops}
>>>>>>> 2cd4d0cf5ddadf90446b3a5038a9bc4875151355

おそらくそのようなものは[必要ない](/blog/2018/06/07/you-probably-dont-need-derived-state.html)のですが、これが本当に必要になる稀なケースでは（例えば `<Transition>` コンポーネントを実装するときなど）、レンダーの最中に state を更新することができます。React は最初のレンダーの終了直後に更新された state を使ってコンポーネントを再実行しますので、計算量は高くなりません。

以下の例では、`row` プロパティの前回の値を state 変数に格納し後で比較できるようにしています：

```js
function ScrollView({row}) {
  let [isScrollingDown, setIsScrollingDown] = useState(false);
  let [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row changed since last render. Update isScrollingDown.
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

これは最初は奇妙に見えるかもしれませんが、これまでも概念的には `getDerivedStateFromProps` はレンダー中に更新を行うというのがまさに目的でした。

### forceUpdate のようなものはありますか？ {#is-there-something-like-forceupdate}

`useState` フックと `useReducer` フックのいずれも、前回と今回で値が同じである場合は[更新を回避](/docs/hooks-reference.html#bailing-out-of-a-state-update)します。適当な場所で state を変化させた後に `setState` を呼び出しても再レンダーは発生しません。

通常、React でローカル state を直接変更すべきではありません。しかし避難ハッチとして、カウンターを使って state が変化していない場合でも再レンダーを強制することが可能です。

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

可能であればこのパターンは避けるようにしてください。

### 関数コンポーネントへの ref を作ることは可能ですか？ {#can-i-make-a-ref-to-a-function-component}

このようなことをする必要はあまりないはずですが、命令型のメソッドを親コンポーネントに公開するために [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) フックを利用することができます。

### `const [thing, setThing] = useState()` というのはどういう意味ですか？ {#what-does-const-thing-setthing--usestate-mean}

この構文に馴染みがない場合はステートフックのドキュメント内の[説明](/docs/hooks-state.html#tip-what-do-square-brackets-mean)をご覧ください。


## パフォーマンス最適化 {#performance-optimizations}

### 更新時に副作用をスキップすることはできますか？ {#can-i-skip-an-effect-on-updates}

はい。[条件付きで副作用を実行する](/docs/hooks-reference.html#conditionally-firing-an-effect)を参照してください。これがデフォルトの動作になっていないのは、更新時の対応を忘れることが[バグの元になる](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)からです。

<<<<<<< HEAD
### どうすれば `shouldComponentUpdate` を実装できますか？ {#how-do-i-implement-shouldcomponentupdate}
=======
### Is it safe to omit functions from the list of dependencies? {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

Generally speaking, no.

```js{3,8}
function Example() {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 This is not safe (it calls `doSomething` which uses `someProp`)
}
```

It's difficult to remember which props or state are used by functions outside of the effect. This is why **usually you'll want to declare functions needed by an effect *inside* of it.** Then it's easy to see what values from the component scope that effect depends on:

```js{4,8}
function Example() {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK (our effect only uses `someProp`)
}
```

If after that we still don't use any values from the component scope, it's safe to specify `[]`:

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ OK in this example because we don't use *any* values from component scope
```

Depending on your use case, there are a few more options described below.

>Note
>
>We provide the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint rule as a part of the [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It help you find components that don't handle updates consistently.

Let's see why this matters.

If you specify a [list of dependencies](/docs/hooks-reference.html#conditionally-firing-an-effect) as the last argument to `useEffect`, `useMemo`, `useCallback`, or `useImperativeHandle`, it must include all values used inside that participate in the React data flow. That includes props, state, and anything derived from them.  

It is **only** safe to omit a function from the dependency list if nothing in it (or the functions called by it) references props, state, or values derived from them. This example has a bug:

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product' + productId); // Uses productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 Invalid because `fetchProduct` uses `productId`
  // ...
}
```

**The recommended fix is to move that function _inside_ of your effect**. That makes it easy to see which props or state your effect uses, and to ensure they're all declared:

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // By moving this function inside the effect, we can clearly see the values it uses.
    async function fetchProduct() {
      const response = await fetch('http://myapi/product' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ Valid because our effect only uses productId
  // ...
}
```

This also allows you to handle out-of-order responses with a local variable inside the effect:

```js{2,6,8}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }
    return () => { ignore = true };
  }, [productId]);
```

We moved the function inside the effect so it doesn't need to be in its dependency list.

>Tip
>
>Check out [this article](https://www.robinwieruch.de/react-hooks-fetch-data/) to learn more about data fetching with Hooks.

**If for some reason you _can't_ move a function inside an effect, there are a few more options:**

* **You can try moving that function outside of your component**. In that case, the function is guaranteed to not reference any props or state, and also doesn't need to be in the list of dependencies.
* If the function you're calling is a pure computation and is safe to call while rendering, you may **call it outside of the effect instead,** and make the effect depend on the returned value.
* As a last resort, you can **add a function to effect dependencies but _wrap its definition_** into the [`useCallback`](/docs/hooks-reference.html#usecallback) Hook. This ensures it doesn't change on every render unless *its own* dependencies also change:

```js{2-5}
function ProductPage({ productId }) {
  // ✅ Wrap with useCallback to avoid change on every render
  const fetchProduct = useCallback(() => {
    // ... Does something with productId ...
  }, [productId]); // ✅ All useCallback dependencies are specified

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct })
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ All useEffect dependencies are specified
  // ...
}
```

Note that in the above example we **need** to keep the function in the dependencies list. This ensures that a change in the `productId` prop of `ProductPage` automatically triggers a refetch in the `ProductDetails` component.

### What can I do if my effect dependencies change too often?

Sometimes, your effect may be using reading state that changes too often. You might be tempted to omit that state from a list of dependencies, but that usually leads to bugs:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // This effect depends on the `count` state
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` is not specified as a dependency

  return <h1>{count}</h1>;
}
```

Specifying `[count]` as a list of dependencies would fix the bug, but would cause the interval to be reset on every change. That may not be desirable. To fix this, we can use the [functional update form of `setState`](/docs/hooks-reference.html#functional-updates). It lets us specify *how* the state needs to change without referencing the *current* state:

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ This doesn't depend on `count` variable outside
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ Our effect doesn't use any variables in the component scope

  return <h1>{count}</h1>;
}
```

(The identity of the `setCount` function is guaranteed to be stable so it's safe to omit.)

In more complex cases (such as if one state depends on another state), try moving the state update logic outside the effect with the [`useReducer` Hook](/docs/hooks-reference.html#usereducer). [This article](https://adamrackis.dev/state-and-use-reducer/) offers an example of how you can do this. **The identity of the `dispatch` function from `useReducer` is always stable** — even if the reducer function is declared inside the component and reads its props.

As a last resort, if you want to something like `this` in a class, you can [use a ref](/docs/hooks-faq.html#is-there-something-like-instance-variables) to hold a mutable variable. Then you can write and read to it. For example:

```js{2-6,10-11,16}
function Example(props) {
  // Keep latest props in a ref.
  let latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // Read latest props at any time
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // This effect never re-runs
}
```

Only do this if you couldn't find a better alternative, as relying on mutation makes components less predictable. If there's a specific pattern that doesn't translate well, [file an issue](https://github.com/facebook/react/issues/new) with a runnable example code and we can try to help.

### How do I implement `shouldComponentUpdate`? {#how-do-i-implement-shouldcomponentupdate}
>>>>>>> 2cd4d0cf5ddadf90446b3a5038a9bc4875151355

関数コンポーネントを `React.memo` でラップして props を浅く比較するようにしてください。

```js
const Button = React.memo((props) => {
  // your component
});
```

これがフックになっていないのは、フックと違って組み合わせ可能ではないからです。`React.memo` は `PureComponent` の同等物ですが、props のみを比較するという違いがあります。（新旧の props を受け取るカスタムの比較関数を 2 つめの引数として加えることができます。その関数が true を返した場合はコンポーネントの更新はスキップされます）

`React.memo` は state を比較しませんが、これは比較可能な単一の state オブジェクトが存在しないからです。しかし子コンポーネント側も純粋にしておくことや、[`useMemo` を使って個々のコンポーネントを最適化する](/docs/hooks-faq.html#how-to-memoize-calculations)ことが可能です。

<<<<<<< HEAD

### 計算結果のメモ化はどのように行うのですか？ {#how-to-memoize-calculations}
=======
### How to memoize calculations? {#how-to-memoize-calculations}
>>>>>>> 2cd4d0cf5ddadf90446b3a5038a9bc4875151355

[`useMemo`](/docs/hooks-reference.html#usememo) フックを使うと、前の計算結果を「記憶」しておくことで、複数のレンダー間で計算結果をキャッシュすることができます。

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

このコードは `computeExpensiveValue(a, b)` を呼び出します。しかし入力である `[a, b]` の組み合わせが前回の値と変わっていない場合は、`useMemo` はこの関数の 2 回目の呼び出しをスキップし、単に前回返したのと同じ値を返します。

`useMemo` に渡した関数はレンダー中に実行されるということを覚えておいてください。レンダー中に通常やらないようなことをやらないようにしましょう。例えば副作用は `useMemo` ではなく `useEffect` の仕事です。

**`useMemo` はパフォーマンス最適化のために使うものであり、意味上の保証があるものだと考えないでください。**将来的に React は、例えば画面外のコンポーネント用のメモリを解放する、などの理由で、メモ化された値を「忘れる」ようにする可能性があります。`useMemo` なしでも動作するコードを書き、パフォーマンス最適化のために `useMemo` を加えるようにしましょう。（値が*絶対に*再計算されてはいけないというような稀なケースでは、ref の[遅延初期化](#how-to-create-expensive-objects-lazily)を行うことができます）

便利なことに、`useMemo` は子コンポーネントの計算量の高い再レンダーをスキップするのにも使えます：

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

フック呼び出しはループ内に[配置できない](/docs/hooks-rules.html)ため、このアプローチはループ内では動作しないことに注意してください。ただしリストのアイテムの部分を別のコンポーネントに抽出してその中で `useMemo` を呼び出すことは可能です。

### 計算量の大きいオブジェクトの作成を遅延する方法はありますか？ {#how-to-create-expensive-objects-lazily}

`useMemo` を使えば入力が同じ場合のために[高価な計算の結果をメモ化](#how-to-memoize-calculations)することができます。しかしこれはあくまでヒントとして使われるものであり、計算が再実行されないということを*保証*しません。しかし時にはオブジェクトが一度しか作られないことを保証したい場合があります。

**まずよくあるユースケースは state の初期値を作成することが高価な場合です。**

```js
function Table(props) {
  // ⚠️ createRows() is called on every render
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

次回以降のレンダーでは無視される初期 state を毎回作成しなおすことを防ぐため、`useState` に**関数**を渡すことができます。

```js
function Table(props) {
  // ✅ createRows() is only called once
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React は初回レンダー時のみこの関数を呼び出します。[`useState` の API リファレンス](/docs/hooks-reference.html#usestate)を参照してください。

また、**稀に `useRef()` の初期値を毎回再作成することを避けたいということもあります。**例えば、命令型で作成するクラスのインスタンスが一度しか作成されないことを保証したいということがあるかもしれません。

```js
function Image(props) {
  // ⚠️ IntersectionObserver is created on every render
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` は `useState` のような関数を渡す形式のオーバーロード記法が**使えません**。代わりに、自分で関数を書いて高価なオブジェクトを遅延型で ref に設定することが可能です。

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver is created lazily once
  function getObserver() {
    let observer = ref.current;
    if (observer !== null) {
      return observer;
    }
    let newObserver = new IntersectionObserver(onIntersect);
    ref.current = newObserver;
    return newObserver;
  }

  // When you need it, call getObserver()
  // ...
}
```

これにより、本当に必要になるまで高価なオブジェクトの作成を避けることができます。Flow や TypeScript を使っているなら、`getObserver()` を non-nullable な型にしておくと便利でしょう。


### レンダー内で関数を作るせいでフックは遅くなるのではないですか？ {#are-hooks-slow-because-of-creating-functions-in-render}

いいえ。モダンブラウザでは、特殊な場合を除いて、クラスと比較してクロージャーの生の性能はそれほど変わりません。

しかも、フックの設計は幾つかの点においてはより効率的です。

* フックを使えば、クラスインスタンスの作成や、コンストラクタでのイベントハンドラのバインドといった、クラスの場合に必要な様々なオーバーヘッドを回避できます。

* フックをうまく用いたコードは、高階コンポーネントやレンダープロップやコンテクストを多用するコードベースで見られるような**深いコンポーネントのネストを必要としません**。コンポーネントツリーが小さければ、React がやるべき仕事も減ります。

過去には、インライン関数によるパフォーマンスの懸念というのは、レンダー毎に新しいコールバック関数を作って渡すと子コンポーネントでの `souldComponentUpdate` による最適化が動かなくなる、という問題と関連していました。フックではこの問題について 3 つの側面から対応します。

* [`useCallback`](/docs/hooks-reference.html#usecallback) フックを使えば再レンダーをまたいで同じコールバックを保持できるので、`shouldComponentUpdate` がうまく動作し続けます

    ```js{2}
    // Will not change unless `a` or `b` changes
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* [`useMemo` フック](/docs/hooks-faq.html#how-to-memoize-calculations) を使うことで個々の子コンポーネントをいつ更新するのかを制御しやすくなるため、コンポーネントが純粋である必要性は低くなっています

* 最後に、以下で説明されているように、`useReducer` フックを使えば、複数のコールバックを深い階層に受け渡していく必要があまりなくなります

### どうすれば複数のコールバックを深く受け渡すのを回避できますか？ {#how-to-avoid-passing-callbacks-down}

我々が見たところ、ほとんどの人はコンポーネントツリーの各階層で手作業でコールバックを受け渡ししていく作業が好きではありません。それはより明示的ではありますが、面倒な『配管工事』をしている気分になることがあります。

大きなコンポーネントツリーにおいて我々がお勧めする代替手段は、[`useReducer`](/docs/hooks-reference.html#usereducer) で `dispatch` 関数を作って、それをコンテクスト経由で下の階層に渡す、というものです。

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // Note: `dispatch` won't change between re-renders
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

`TodosApp` ツリーの中にいるあらゆる子コンポーネントはこの `dispatch` 関数を使うことができ、上位にいる `TodosApp` にアクションを伝えることができます。

```js{2,3}
function DeepChild(props) {
  // If we want to perform an action, we can get dispatch from context.
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

これは（複数のコールバックを何度も受け渡しする必要がないので）メンテナンスの観点から便利だ、というだけではなく、コールバックにまつわる問題をすべて回避できます。深い更新においてはこのように `dispatch` を渡すのがお勧めのパターンです。

アプリケーションの **state** については、props として渡していくか（より明示的）、あるいはコンテクスト経由で渡すか（深い更新ではより便利）を選ぶ余地が依然あります。もしもコンテクストを使って state も渡すことにする場合は、2 つの別のコンテクストのタイプを使ってください -- `dispatch` のコンテクストは決して変わらないため、`dispatch` だけを使うコンポーネントは（アプリケーションの state も必要でない限り）再レンダーする必要がなくなります。

### `useCallback` からの頻繁に変わる値を読み出す方法は？ {#how-to-read-an-often-changing-value-from-usecallback}

> 補足
>
> 我々は個別のコールバックを props として渡すのではなく、[コンテキスト経由で `dispatch` を渡す](#how-to-avoid-passing-callbacks-down)ことを推奨しています。以下のアプローチは網羅性と避難ハッチの目的で掲載しているものです。
>
> また、[concurrent mode](/blog/2018/03/27/update-on-async-rendering.html) においてこのパターンは問題を起こす可能性があることにも注意してください。将来的にはより使いやすい代替手段を提供することを計画していますが、現時点での最も安全な解決法は、コールバックが依存している何らかの値が変わった場合はコールバックを無効化して作り直すことです。

稀なケースですが、コールバックを [`useCallback`](/docs/hooks-reference.html#usecallback) でメモ化しているにも関わらず、内部関数を何度も再作成しないといけないためメモ化がうまく働かない、ということがあります。あなたがメモ化しようとしている関数がレンダー最中には使われないイベントハンドラーなのであれば、[インスタンス変数としての ref](#is-there-something-like-instance-variables) を使って最後に使われた値を手動で保持しておくことができます。

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useLayoutEffect(() => {
    textRef.current = text; // Write it to the ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // Read it from the ref
    alert(currentText);
  }, [textRef]); // Don't recreate handleSubmit like [text] would do

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

これはやや複雑なパターンですが、このような避難ハッチ的最適化は必要であれば可能だということです。カスタムフックに抽出すれば多少は読みやすくなります：

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // Will be memoized even if `text` changes:
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useLayoutEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

いずれにせよ、**このパターンは薦められず**、網羅性のために示しているに過ぎません。代わりに[コールバックを深く受け渡していくことを回避する](#how-to-avoid-passing-callbacks-down)のが望ましいパターンです。


## 内部の仕組み {#under-the-hood}

### React はフック呼び出しとコンポーネントとをどのように関連付けているのですか？ {#how-does-react-associate-hook-calls-with-components}

React は現在どのコンポーネントがレンダー中なのかを把握しています。[フックのルール](/docs/hooks-rules.html)のお陰で、フックは React のコンポーネント内（あるいはそれらから呼び出されるカスタムフック内）でのみ呼び出されるということが分かっています。

それぞれのコンポーネントに関連付けられる形で、React 内に「メモリーセル」のリストが存在しています。それらは単に何らかのデータを保存できる JavaScript のオブジェクトです。あなたが `useState()` のようなフックを呼ぶと、フックは現在のセルの値を読み出し（あるいは初回レンダー時はセル内容を初期化し）、ポインタを次に進めます。これが複数の `useState()` の呼び出しが個別のローカル state を得る仕組みです。

### フックの先行技術にはどのようなものがありますか？ {#what-is-the-prior-art-for-hooks}

フックは複数の異なった出典からのアイディアを総合したものです：

* [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) リポジトリにおける関数型 API の古い実験。
* [Ryan Florence](https://github.com/ryanflorence) の [Reactions Component](https://github.com/reactions/component) を含む、React コミュニティのレンダープロップ API に関する実験。
* [Dominic Gannaway](https://github.com/trueadm) によって提案された、レンダープロップの糖衣構文としての [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067)。
* [DisplayScript](http://displayscript.org/introduction.html) のステート変数とステートセル。
* ReasonReact の [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html)。
* Rx の [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html)。
* Multicore OCaml の [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting)。

フックは [Sebastian Markbåge](https://github.com/sebmarkbage) が最初のデザインを作り、[Andrew Clark](https://github.com/acdlite)、[Sophie Alpert](https://github.com/sophiebits)、[Dominic Gannaway](https://github.com/trueadm) およびその他の React チームのメンバーが洗練させました。
