---
id: glossary
title: React 用語集
layout: docs
category: リファレンス
permalink: docs/glossary.html

---

## シングルページアプリケーション（SPA）

シングルページアプリケーションは、単一の HTML ページおよびアプリケーションの実行に必要な必要なアセット（JavaScript や CSS など）をロードするものです。あるページもしくはそれ以降のページとのやり取りにサーバーとの往復は必要なく、ページがリロードされないということでもあります。

React でシングルページアプリケーションを構築することができますが、必須のものではありません。React は、既存のウェブサイトをよりインタラクティブにする、小さな部品を拡張するために使用することもできます。React で記述されたコードは、PHP などによりサーバーでレンダリングされたマークアップや、他のクライアントサイドのライブラリと問題なく共存できます。実際に、Facebook では React はそうやって利用されています。

## ES6、ES2015、ES2016 など

これらの頭字語は全て、最新のECMAScript 言語の標準仕様に関するもので、JavaScript 言語はこれらの実装となります。ES6 バージョン（ES2015 とも呼ばれます）はそれ以前のバージョンから、多くのものが追加されています：アロー関数、クラス、テンプレートリテラル、let および const ステートメントなどです。特定のバージョンの詳細については[こちら](https://en.wikipedia.org/wiki/ECMAScript#Versions)で学ぶことができます。

## コンパイラ

JavaScript コンパイラは JavaScript コードを受け取って変換し、別のフォーマットの JavaScript コードを返します。最も一般的なユースケースはES6 構文を受け取り、古いブラウザーが解釈できる構文に変換することです。Babel は React で最も一般的なコンパイラです。

## バンドラ

バンドラは別々のモジュールとして記述された（しばしば数百個になる）JavaScript および CSS のコードを受け取り、ブラウザに最適化された数個のファイルに結合します。[Webpack](https://webpack.js.org/) や [Browserify](http://browserify.org/) を含む、いくつかのバンドラが React で一般的に利用されています。

## パッケージマネージャ

パッケージ マネージャーは、プロジェクト内の依存関係を管理するためのツールです。
[npm](https://www.npmjs.com/) および [Yarn](http://yarnpkg.com/) の 2 つのパッケージマネージャが React アプリケーションで一般的に利用されています。どちらも同じ npm パッケージレジストリのクライアントです。

## CDN

CDN は Content Delivery Network の略です。 CDN はキャッシュされた静的なコンテンツをネットワーク化されたサーバから世界中に配信します。

## JSX

JSX は javascript の拡張構文です。テンプレート言語に似ていますが、完全に JavaScript だけで動作します。JSX は、"React 要素" と呼ばれるプレーンな JavaScript オブジェクトを返す、 `React.createElement()` のコールにコンパイルされます。JSX の基本的な導入部分を学ぶには[こちらのドキュメントを参照してください](/docs/introducing-jsx.html)。また、さらに JSX について詳細に学ぶには[こちら](/docs/jsx-in-depth.html)を参照してください。

React DOM は HTML の属性名の命名規則ではなく、キャメルケースを使用します。例えば、`tabindex` は、JSX では `tabIndex` となります。`class` も `className` と記述され、これは `class` が JavaScript において予約語であるためです：

```js
const name = 'Clementine';
ReactDOM.render(
  <h1 className="hello">My name is {name}!</h1>,
  document.getElementById('root')
);
```

## [要素](/docs/rendering-elements.html)

React 要素は React アプリケーションを構成するブロックです。要素を、より広く知られている概念である "コンポーネント" と混同する人もいるかもしれません。要素には画面上に表示したいものを記述します。React 要素はイミュータブルです。

```js
const element = <h1>Hello, world</h1>;
```

通常、要素は直接は使用するものではありませんが、コンポーネントから返されます。

## [コンポーネント](/docs/components-and-props.html)

React components are small, reusable pieces of code that return a React element to be rendered to the page. もっともシンプルな形の React コンポーネントは React 要素を返すプレーンな JavaScript 関数です：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

コンポーネントには、ES6 クラスにもできます：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

コンポーネントは機能的に異なる部品に分割でき、他のコンポーネントの中で使用することができます。コンポーネントは別のコンポーネント、配列、文字列および数字を返すことができます。役に立つ経験則として、UI の一部（Button 、Panel、Avatar など）が複数回使われている場合、または UI の一部が独立できるほど複雑（App 、FeedStory、Comment など）な場合、それらは再利用可能なコンポーネントの有力な候補であるといえます。コンポーネント名は常に大文字で始める必要があります（`<wrapper/>` ではなく `<Wrapper/>` とすること）。レンダリングされるコンポーネントについての詳細は[このドキュメント](/docs/components-and-props.html#rendering-a-component)を参照してください。

### [`props`](/docs/components-and-props.html)

`props` は、 React コンポーネントへの入力です。親のコンポーネントから子コンポーネントへと渡されるデータを指します。

`props` は読み取り専用です。どのような場合でもあっても、変更されるべきではありません：

```js
// 間違った例
props.number = 42;
```

ある値を、ユーザーの入力やネットワークのレスポンスに応じて変更する必要がある場合は、代わりに state を使用してください。

### `props.children`

`props.children` は全てのコンポーネントで使用可能です。これには、コンポーネントの開始タグと終了タグの間の全てのコンテンツが含まれています。例えば：

```js
<Welcome>Hello world!</Welcome>
```

文字列 `Hello world!` は `Welcome` コンポーネントの `props.children` で利用できます：

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

クラスとして定義されたコンポーネントでは、`this.props.children` を使用してください：

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class)

あるコンポーネントが時間とともに変化するデータと関連付けられている場合は、`state` が必要です。例えば、`Checkbox` コンポーネントはその state に `isChecked` が必要となるかもしれません。そして `NewsFeed` コンポーネントはその state にある `fetchedPosts の状態を追う必要があるかもしれません。

`state` と `props` の最も重要な違いは、`props` は親コンポーネントから渡されますが、`state` はコンポーネント自身によって管理されることです。コンポーネントは自身の `props` を変更できませんが、`state` を変更することができます。
変更するには、`this.setState()` を呼び出す必要があります。クラスとして定義されたコンポーネントだけが state を持つことができます。

変更されたデータのそれぞれの部分については、その state を「所有する」コンポーネントが1つだけであるべきです。2 つの異なるコンポーネントの state を同期しようとしないでください。代わりに、それらの直近の親コンポーネントにstate を[リフトアップ](/docs/lifting-state-up.html) して、両方にプロパティとして渡してください。

## [ライフサイクルメソッド](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class)

ライフサイクルメソッドは、コンポーネントの異なるフェーズにおいて実行される、カスタムの関数です。コンポーネントが作成されて DOM に挿入（[マウント](/docs/react-component.html#mounting)）された時、コンポーネントが更新された時、コンポーネントがアンマウントもしくは DOM から削除された時のそれぞれで、利用可能なメソッドがあります。

## [制御されたコンポーネント](/docs/forms.html#controlled-components) か [非制御コンポーネント](/docs/uncontrolled-components.html) か

React では、フォームの入力を扱うのに 2 つの異なるアプローチがあります。

React によって値が制御される入力フォーム要素は *制御されたコンポーネント* と呼ばれます。ユーザーが制御されたコンポーネントにデータを入力すると、変更イベントハンドラがトリガーされ、コードが入力が有効であるか（更新された値で再レンダリングすることで）決定します。再レンダリングしなければフォーム要素は変更されないままとなります。

*非制御コンポーネント* は React の管理外にあるフォーム要素と同様に動作します。ユーザーがフォームフィールド（入力ボックス、ドロップダウンなど）にデータを入力した場合、更新された情報が反映され、その際にReact は何もする必要がありません。しかし、このことはフィールドに特定の値を設定できないことでもあります。

ほとんどの場合では、制御されたコンポーネントを使用するべきでしょう。

## [Keys](/docs/lists-and-keys.html)

"key" は特別な文字列の属性で、要素の配列を作成する際に含めておく必要があります。キーは React がどの要素が変更、追加もしくは削除されたかを識別するのに役立ちます。キーは配列内の要素に安定した一意性を与えるよう設定されるべきです。

キーは同じ配列内の兄弟要素間で一意としなければなりません。アプリケーション全体、単一のコンポーネントに渡ってすべて一意である必要はありません。

`Math.random()` のようなものをキーとして設定しないでください。キーには再レンダリングをまたいだ「安定した一意性」を持たせることで、要素の追加、削除および並べ替えがあった時に React が識別できることが重要です。理想的にはキーは `post.id` のように、データから得られる一意で安定した識別子に対応するべきです。

## [Refs](/docs/refs-and-the-dom.html)

React は任意のコンポーネントに追加できる特別な属性をサポートしています。
`ref` 属性は、 [`React.createRef()` 関数](/docs/react-api.html#reactcreateref) によって生成されたオブジェクト、あるいはそのコールバック関数や文字列（古い API)です。 `ref` 属性がコールバック関数の場合、その関数は引数として（要素の型次第で）DOM 要素またはクラスインスタンスを受け取ります。これによって、 DOM 要素またはコンポーネントのインスタンスへと直接アクセスできます。

refs は消極的に利用してください。アプリケーション内で何かを実行するために refs を頻繁に使用している場合、[トップダウンのデータフロー](/docs/lifting-state-up.html)に慣れ親しむことを検討してください。

## [イベント](/docs/handling-events.html)

React 要素でイベントを扱う場合には、構文上の違いがあります：

* React のイベントハンドラは小文字ではなく、キャメルケースで名前が付けられます。
* JSX ではイベントハンドラとして文字列ではなく関数を渡します。

## [ツリー構造の突き合わせ](/docs/reconciliation.html)

コンポーネントの props か state が変更された場合、React は新しく返された要素を以前にレンダリングされたものと比較することで、本物の DOM の更新が必要かを判断します。それらが等しくない場合、React は DOM を更新します。このプロセスを「リコンシリエーション」と呼びます。
