---
id: context
title: コンテクスト
permalink: docs/context.html
prev: reconciliation.html
next: fragments.html
---

コンテクストは各階層で手動でプロパティを下に渡すことなく、コンポーネントツリー内でデータを渡す方法を提供します。

典型的な React アプリケーションでは、データは props を通してトップダウン（親から子）で渡されますが、アプリケーション内の多くのコンポーネントから必要とされる特定のタイプのプロパティ（例： ロケール設定、UI テーマ）にとっては面倒です。コンテクストはツリーの各階層で明示的にプロパティを渡すことなく、コンポーネント間でこれらの様な値を共有する方法を提供します。

- [コンテクストをいつ使用すべきか](#when-to-use-context)
- [コンテクストを使用する前に](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [例](#例)
  - [動的なコンテクスト](#dynamic-context)
  - [ネストしたコンポーネントからコンテクストを更新する](#updating-context-from-a-nested-component)
  - [複数のコンテクストを使用する](#consuming-multiple-contexts)
- [注意事項](#caveats)
- [レガシーな API](#legacy-api)

## コンテクストをいつ使用すべきか {#when-to-use-context}

コンテクストは、ある React コンポーネントのツリーに対して「グローバル」とみなすことができる、現在の認証済みユーザ・テーマ・優先言語といったデータを共有するために設計されています。例えば、以下のコードでは Button コンポーネントをスタイルする為に、手動で "theme" プロパティを通しています。

`embed:context/motivation-problem.js`

コンテクストを使用することで、中間の要素群を経由してプロパティを渡すことを避けることができます。

`embed:context/motivation-solution.js`

## コンテクストを使用する前に {#before-you-use-context}

コンテクストは主に、何らかのデータが、ネストレベルの異なる*多く*のコンポーネントからアクセスできる必要がある時に使用されます。コンテクストはコンポーネントの再利用をより難しくする為、慎重に利用してください。

**もし多くの階層を経由していくつかの props を渡すことを避けたいだけであれば、[コンポーネントコンポジション](/docs/composition-vs-inheritance.html)は多くの場合、コンテクストよりシンプルな解決策です。**

例えば、深くネストされた `Link` と `Avatar` コンポーネントがプロパティを読み取ることが出来るように、`user` と `avatarSize` プロパティをいくつかの階層下へ渡す `Page` コンポーネントを考えてみましょう。

```js
<Page user={user} avatarSize={avatarSize} />
// ... Page コンポーネントは以下をレンダー ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... PageLayout コンポーネントは以下をレンダー ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... NavigationBar コンポーネントは以下をレンダー ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

最終的に `Avatar` コンポーネントだけがプロパティを必要としているのであれば、多くの階層を通して `user` と `avatarSize` プロパティを下に渡すことは冗長に感じるかもしれません。また、`Avatar` コンポーネントが上のコンポーネントから追加のプロパティを必要とする時はいつでも、全ての間の階層にも追加しないといけないことも厄介です。

**コンテクストを使用せずに**この問題を解決する 1 つの手法は、[`Avatar` コンポーネント自身を渡す](/docs/composition-vs-inheritance.html#containment)ようにするというもので、そうすれば間のコンポーネントは `user` や `avatarSize` プロパティを知る必要はありません。

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// これで以下のようになります。
<Page user={user} avatarSize={avatarSize} />
// ... Page コンポーネントは以下をレンダー ...
<PageLayout userLink={...} />
// ... PageLayout コンポーネントは以下をレンダー ...
<NavigationBar userLink={...} />
// ... NavigationBar コンポーネントは以下をレンダー ...
{props.userLink}
```

この変更により、一番上の Page コンポーネントだけが、`Link` と `Avatar` コンポーネントの `user` と `avatarSize` の使い道について知る必要があります。

この*制御の反転*はアプリケーション内で取り回す必要のあるプロパティの量を減らし、ルートコンポーネントにより多くの制御を与えることにより、多くのケースでコードを綺麗にすることができます。しかし、この方法は全てのケースで正しい選択とはなりません：ツリー内の上層に複雑性が移ることは、それら高い階層のコンポーネントをより複雑にして、低い階層のコンポーネントに必要以上の柔軟性を強制します。

コンポーネントに対して 1 つの子までという制限はありません。複数の子を渡したり、子のために複数の別々の「スロット」を持つことさえできます。[ドキュメントはここにあります。](/docs/composition-vs-inheritance.html#containment)

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

このパターンは、そのすぐ上の親から子を切り離す必要がある多くのケースにとって十分です。レンダリングの前に子が親とやり取りする必要がある場合、さらに[レンダープロップ](/docs/render-props.html)と合わせて使うことができます。

しかし、たまに同じデータがツリー内の異なるネスト階層にある多くのコンポーネントからアクセス可能であることが必要となります。コンテクストはそのようなデータとその変更を以下の全てのコンポーネントへ「ブロードキャスト」できます。コンテクストを使うことが他の手法よりシンプルである一般的な例としては、現在のロケール、テーマ、またはデータキャッシュの管理が挙げられます。

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

コンテクストオブジェクトを作成します。React がこのコンテクストオブジェクトが登録されているコンポーネントをレンダーする場合、ツリー内の最も近い上位の一致する `Provider` から現在のコンテクストの値を読み取ります。

`defaultValue` 引数は、コンポーネントがツリー内の上位に一致するプロバイダを持っていない場合のみ使用されます。これは、ラップしない単独でのコンポーネントのテストにて役に立ちます。補足： `undefined` をプロバイダの値として渡しても、コンシューマコンポーネントが `defaultValue` を使用することはありません。

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* 何らかの値 */}>
```

全てのコンテクストオブジェクトにはプロバイダ (Provider) コンポーネントが付属しており、これによりコンシューマコンポーネントはコンテクストの変更を購読できます。

プロバイダは `value` プロパティを受け取り、これが子孫であるコンシューマコンポーネントに渡されます。1 つのプロバイダは多くのコンシューマと接続することが出来ます。プロバイダは値を上書きするために、ツリー内のより深い位置でネストできます。

プロバイダの子孫の全てのコンシューマは、プロバイダの `value` プロパティが変更されるたびに再レンダーされます。プロバイダからその子孫コンシューマ（[`.contextType`](#classcontexttype) や [`useContext`](/docs/hooks-reference.html#usecontext) を含む）への伝播は `shouldComponentUpdate` メソッドの影響を受けないため、コンシューマは祖先のコンポーネントが更新をスキップしている場合でも更新されます。

変更は、[`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) と同じアルゴリズムを使用し、新しい値と古い値の比較によって判断されます。

> 補足
>
> この方法で変更の有無を判断するため、オブジェクトを `value` として渡した場合にいくつかの問題が発生する可能性があります。詳細は[注意事項](#caveats)を参照。

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* MyContextの値を使用し、マウント時に副作用を実行します */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* MyContextの値に基づいて何かをレンダーします */
  }
}
MyClass.contextType = MyContext;
```

クラスの `contextType` プロパティには [`React.createContext()`](#reactcreatecontext) により作成されたコンテクストオブジェクトを指定することができます。これにより、`this.context` を使って、そのコンテクストタイプの最も近い現在値を利用できます。レンダー関数を含むあらゆるライフサイクルメソッドで参照できます。

> 補足:
>
> この API では、1 つのコンテクストだけ登録することができます。もし 2 つ以上を読み取る必要がある場合、[複数のコンテクストを使用する](#consuming-multiple-contexts) を参照してください。
>
> 実験的な [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/) を使用している場合、**static** クラスフィールドを使用することで `contextType` を初期化することができます。

```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 値に基づいて何かをレンダーします */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* コンテクストの値に基づいて何かをレンダーします */}
</MyContext.Consumer>
```

コンテクストの変更を購読する React コンポーネントです。[関数コンポーネント](/docs/components-and-props.html#function-and-class-components) 内でコンテクストを購読することができます。

[function as a child](/docs/render-props.html#using-props-other-than-render) が必要です。この関数は現在のコンテクストの値を受け取り、React ノードを返します。この関数に渡される引数 `value` は、ツリー内の上位で一番近いこのコンテクスト用のプロバイダの `value` プロパティと等しくなります。このコンテクスト用のプロバイダが上位に存在しない場合、引数の `value` は `createContext()` から渡された `defaultValue` と等しくなります。

> 補足
> 
> "function as a child" パターンについてさらに情報が必要な場合は [レンダープロップ](/docs/render-props.html) を参照してください。

### `Context.displayName` {#contextdisplayname}

コンテクストオブジェクトは `displayName` という文字列型のプロパティを有しています。React DevTools はこの文字列を利用してコンテクストの表示のしかたを決定します。

例えば以下のコンポーネントは DevTools で MyDisplayName と表示されます。

```js{2}
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## 例 {#examples}

### 動的なコンテクスト {#dynamic-context}

テーマに動的な値を使用したより複雑な例：

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### ネストしたコンポーネントからコンテクストを更新する {#updating-context-from-a-nested-component}

コンポーネントツリーのどこか深くネストされたコンポーネントからコンテクストを更新することはよく必要になります。このケースでは、コンテクストを通して下に関数を渡すことで、コンシューマがコンテクストを更新可能にすることができます。

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### 複数のコンテクストを使用する {#consuming-multiple-contexts}

コンテクストの再レンダーを高速に保つために、React は各コンテクストのコンシューマをツリー内の別々のノードにする必要があります。

`embed:context/multiple-contexts.js`

2 つ以上のコンテクストの値が一緒に使用されることが多い場合、両方を提供する独自のレンダープロップコンポーネントの作成を検討した方が良いかもしれません。

## 注意事項 {#caveats}

コンテクストは参照の同一性を使用していつ再レンダーするかを決定するため、プロバイダの親が再レンダーするときにコンシューマで意図しないレンダーを引き起こす可能性があるいくつかの問題があります。例えば以下のコードでは、新しいオブジェクトが `value` に対して常に作成されるため、プロバイダが再レンダーするたびにすべてのコンシューマを再レンダーしてしまいます。

`embed:context/reference-caveats-problem.js`

この問題を回避するためには、親の state に値をリフトアップします。

`embed:context/reference-caveats-solution.js`

## レガシーな API {#legacy-api}

> 補足
>
> React は以前に実験的なコンテクスト API を公開していました。その古い API は全ての 16.x 系のリリースでサポートされる予定ですが、アプリケーションで使用しているのであれば、新しいバージョンにマイグレーションすべきです。レガシーな API は将来の React メジャーバージョンで削除されます。[レガシーなコンテクストのドキュメントはここにあります。](/docs/legacy-context.html)
