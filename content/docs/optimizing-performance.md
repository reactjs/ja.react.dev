---
id: optimizing-performance
title: パフォーマンス最適化
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

React は UI の更新時に必要となる高コストな DOM 操作の回数を最小化するために、内部的にいくつかの賢いテクニックを使用しています。多くのアプリケーションでは React を使用するだけで、パフォーマンス向上のための特別な最適化を苦労して行わなくても、レスポンスの良いユーザインターフェースを実現できますが、それでもなお、React アプリケーションを高速化するための方法はいくつか存在します。

## 本番用ビルドを使用する {#use-the-production-build}

React アプリケーションでベンチマークを行う場合やパフォーマンスの問題が発生している場合には、ミニファイされた本番用ビルドでテストしていることを確認してください。

デフォルトで React は多くの有用な警告チェックを行い、開発時にはとても有用です。しかしそれによって React アプリケーションのサイズが肥大化し、速度が低下してしまうため、アプリケーションのデプロイ時には本番バージョンを使用していることを確認してください。

ビルドプロセスが正しく設定されているか分からない場合、[React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) をインストールして確認できます。本番用モードの React のサイトを訪れた場合、アイコンは暗い背景となっています。

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

開発モードの React のサイトを訪れた場合、アイコンは赤い背景となっています。

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

アプリケーションに対して作業をしているときは開発モードを使用し、利用者に配布する場合には本番用モードを使用することをお勧めします。

本番用にアプリを構築するためのそれぞれのツールにおける手順を以下に示します。

### Create React App {#create-react-app}

プロジェクトが [Create React App](https://github.com/facebookincubator/create-react-app) で構築されているなら、以下のコードを実行してください。

```
npm run build
```

これでアプリケーションの本番用ビルドがプロジェクト内の `build/` フォルダに作成されます。

これが必要なのは本番用ビルドだけであることに留意してください。通常の開発作業では、`npm start` を使用してください。

### 単一ファイル版ビルド {#single-file-builds}

React と ReactDOM をそれぞれ単一ファイル化した本番環境用のバージョンを提供しています。

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

本番用に適しているのは、React ファイル名の末尾が `.production.min.js` であるもののみであることに留意ください。

### Brunch {#brunch}

Brunch で最も効率のよい本番用ビルドを行うには、[`terser-brunch`](https://github.com/brunch/terser-brunch) をインストールしてください：

```
# If you use npm
npm install --save-dev terser-brunch

# If you use Yarn
yarn add --dev terser-brunch
```

そして、本番用ビルドを作成するために、`build` コマンドに`-p` オプションを指定して実行します。

```
brunch build -p
```

これが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告表示が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発用では `-p` フラグを指定したり、`uglify-js-brunch` プラグインを適用したりしないでください。

### Browserify {#browserify}

Browserify で最も効率の良い本番用ビルドを行うには、いくつかのプラグインをインストールしてください。

```
# If you use npm
npm install --save-dev envify terser uglifyify

# If you use Yarn
yarn add --dev envify terser uglifyify
```

本番用ビルドを作成するには、以下の変換 (transform) を追加してください（**順番は重要です**）。

* [`envify`](https://github.com/hughsk/envify) 変換は正しいビルド用の環境変数が確実に設定されるようにします。グローバルに設定してください (`-g`)。
* [`uglifyify`](https://github.com/hughsk/uglifyify) 変換は開発用にインポートしたライブラリを削除します。これもグローバルに設定してください (`-g`)。
* 最後に結果として出力されたものを、名前の圧縮のために [`terser`](https://github.com/terser-js/terser) にパイプします（[理由を読む](https://github.com/hughsk/uglifyify#motivationusage)）。

以下に例を示します。

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

これが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告文が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発用ではこれらのプラグインを適用しないでください。

### Rollup {#rollup}

Rollup で最も効率のよい本番用ビルドを行うには、いくつかのプラグインを以下のようにインストールします。

```bash
# If you use npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# If you use Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

本番用ビルドを作成するには、以下のプラグインを追加してください（**順番は重要**です）。

* [`replace`](https://github.com/rollup/rollup-plugin-replace) プラグインは正しいビルド用の環境変数が確実に設定されるようにします。
* [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) プラグインは Rollup で CommonJS をサポートできるようにします。
* [`terser`](https://github.com/TrySound/rollup-plugin-terser) プラグインは出力された最終的なバンドルを圧縮し、mangle（訳注：変数名や識別子を短縮）します。

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

設定例の全体はこの [gist を参照](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0)してください。

これらが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告表示が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発用では `terser` プラグインもしくは `replace` プラグインを `'production'` という値で適用しないでください。

### webpack {#webpack}

>**補足：**
>
> Create React App を利用している場合は、[Create React App についての前述の説明](#create-react-app)に従ってください。<br/>
> このセクションは直接 webpack の設定を行いたい人向けです。

Webpack v4 以降では本番 (production) モードでコードの minify を自動で行います。

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

より詳細な説明については [webpack のドキュメント](https://webpack.js.org/guides/production/)を参照ください。

これらが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告文が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発時には `TerserPlugin` を適用しないでください。

## DevTools プロファイラを使用したコンポーネントのプロファイリング {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5 以降と `react-native` 0.57 以降では、開発モードにおける強化されたプロファイリング機能を React DevTools プロファイラにて提供しています。
このプロファイラの概要はブログ記事 ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html) で説明されています。
チュートリアル動画も [YouTube で閲覧できます](https://www.youtube.com/watch?v=nySib7ipZdk)。

React DevTools をまだインストールしていない場合は、以下で見つけることができます。

- [Chrome ブラウザ拡張](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox ブラウザ拡張](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [スタンドアロンの Node パッケージ](https://www.npmjs.com/package/react-devtools)

> 補足
>
> 本番ビルド版 `react-dom` のプロファイリング可能なバンドルとして `react-dom/profiling` が利用可能です。
> このバンドルの使い方の詳細については、[fb.me/react-profiling](https://fb.me/react-profiling) を参照してください。

> 補足
>
> React 17 より前のバージョンでは、標準の [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) を用いて Chrome のパフォーマンスタブでコンポーネントのプロファイリングが行われていました。
> これについての概要は [Ben Schwarz によるこの記事](https://calibreapp.com/blog/react-performance-profiling-optimization)を参照してください。

## 長いリストの仮想化 {#virtualize-long-lists}

アプリケーションが長いデータのリスト（数百〜数千行）をレンダーする場合は、「ウィンドウイング」として知られるテクニックを使うことをおすすめします。このテクニックでは、ある瞬間ごとにはリストの小さな部分集合のみを描画することで、生成する DOM ノードの数およびコンポーネントの再描画にかかる時間を大幅に削減することができます。

[react-window](https://react-window.now.sh/) と [react-virtualized](https://bvaughn.github.io/react-virtualized/) は人気があるウィンドウイング処理のライブラリです。これらはリスト、グリッド、および表形式のデータを表示するための、いくつかの再利用可能コンポーネントを提供しています。アプリケーションの特定のユースケースに合わせた追加的な処理をする場合は、[Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3) が行なっているように、独自のウィンドウイング処理のコンポーネントを作成することもできます。

## リコンシリエーション（差分検出処理）を避ける {#avoid-reconciliation}

React はレンダーされた UI の内部表現を構築し、維持します。その内部表現にはコンポーネントが返した React 要素も含まれています。React はこの内部表現を使うことによって、DOM ノードの不要な作成やアクセス（これらは JavaScript オブジェクト操作よりも低速です）を回避します。この内部表現はしばしば "仮想 DOM" と呼ばれますが、React Native 上でも同様に動くものです。

コンポーネントの props や state が変更された場合、React は新しく返された要素と以前にレンダーされたものとを比較することで、実際の DOM の更新が必要かを判断します。それらが等しくない場合、React は DOM を更新します。

React は変更された DOM ノードだけを更新するとはいえ、再レンダーには時間がかかります。多少の時間がかかっても多くの場合は問題にはなりませんが、遅延が目立つ場合、再レンダープロセスが開始される前にトリガーされるライフサイクル関数 `shouldComponentUpdate` をオーバーライド定義することで、スピードを抜本的に向上できます。この関数のデフォルトの実装は `true` を返し、React に更新処理をそのまま実行させます：

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

ある状況においてコンポーネントを更新する必要がないと分かっているなら、`shouldComponentUpdate` から `false` を返すことにより、該当コンポーネントおよび配下への `render()` 呼び出しを含む、レンダー処理の全体をスキップすることができます。

ほとんどの場合には、手書きの `shouldComponentUpdate()` を定義する代わりに [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) を継承できます。これは現在と直前の props と state に対する浅い (shallow) 比較を行う `shouldComponentUpdate()` を実装することと同じです。

## shouldComponentUpdate の実際の動作 {#shouldcomponentupdate-in-action}

以下のようなコンポーネントのサブツリーがあるとします。それぞれ、`SCU` は `shouldComponentUpdate` が返した値（訳注：緑は true、赤は false）を示し、`vDOMEq` はレンダーされた React 要素が等しかったかどうか（訳注：緑は等しい、赤は等しくない）を示します。最後に、円の色はコンポーネントに対してツリーの差分を検出するリコンシリエーション処理を必要としたのかどうか（訳注：緑は不要、赤は必要）を示します。

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

C2 をルートとするサブツリーでは `shouldComponentUpdate` が `false` を返したので、React は C2 をレンダーしようとしませんでした。したがって C4 と C5 については `shouldComponentUpdate` を実行する必要すらなかったわけです。

C1 と C3 では、`shouldComponentUpdate` が `true` を返したので、React は葉ノードにも移動してチェックする必要がありました。C6 では `shouldComponentUpdate` が `true` を返し、そしてレンダーされた React 要素も等しくなかったので、React は DOM を更新する必要がありました。

最後の興味深いケースが C8 です。React はこのコンポーネントをレンダーする必要がありましたが、返された React 要素は前回レンダーされたときものと同じだったので、DOM の更新は必要ありませんでした。

React が実 DOM を更新しなければならなかったのは、C6 だけだったことに注目してください。C6 の更新は避けられないものでした。C8 では、レンダーされた React 要素の比較のおかげで実 DOM を修正せずに済みました。C2 のサブツリーと C7 のケースでは `shouldComponentUpdate` のおかげで、`render` メソッドの呼び出しや React 要素の比較処理すらスキップすることができました。

## 例 {#examples}

コンポーネントが変化するのが `props.color` または `state.count` 変数が変化した時だけだとしたら、`shouldComponentUpdate` では以下のようなチェックを行えます。

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

このコードは、`shouldComponentUpdate` は `props.color` または `state.count` の変化の有無を単にチェックしているだけです。これらの値が変化していなければコンポーネントは更新されません。コンポーネントがもっと複雑な場合は、`props` と `state` のすべてのフィールドに対して「浅い比較」をするという同種のパターンでコンポーネント更新の必要性を決定できます。このパターンはとても一般的なので、React はこのロジックのためのヘルパーを用意しており、`React.PureComponent` から継承するだけで使用できます。なので以下のコードで前述のコードと同じことをよりシンプルに実装できます。

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

ほとんどの場合、自分で `shouldComponentUpdate` を記述する代わりに `React.PureComponent` を使うことができます。もっとも、浅い比較を行うだけですので、浅い比較では検出できない形で props や state がミューテート（mutate; 書き換え）されている可能性がある場合には使えません。

この事はより複雑なデータ構造の場合には問題となります。例えば、カンマ区切りで単語をレンダーする `ListOfWords` コンポーネントと、ボタンをクリックしてリストに単語を追加できる親コンポーネント `WordAdder` が必要だとして、以下のコードは正しく動作しません。

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

問題は `PureComponent` が `this.props.words` の古い値と新しい値を単純に比較していることにあります。上記のコードでは `WordAdder` の handleClick メソッド内で `words` 配列の内容をミューテートしてしまうので、`this.props.words` の新旧の値は、たとえ配列内の実際の単語が変更されていたとしても、比較の結果同じだとみなしてしまうのです。そのため `ListOfWords` はレンダーすべき新しい単語が追加されているにも関わらず、更新されません。

## データを変更しないことの効果 {#the-power-of-not-mutating-data}

この問題を避ける最も単純な方法は、props や state として使用する値のミューテートを避けることです。例えば、上記の `handleClick` メソッドは `concat` を使って以下のように書き換えることができます：

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 はこれをより簡潔に実装できる配列の[スプレッド構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)をサポートしています。Create React App を使用していれば、この構文はデフォルトで利用できます。

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

同様に、オブジェクトについてもミューテートするコードをしないように書き換えることができます。例えば、`colormap` というオブジェクトがあり、`colormap.right` を `'blue'` に更新する関数が必要だとしましょう。以下のように書くことも可能ですが、

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

この処理を、元オブジェクトをミューテートせずに実装するために、[Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) を使用できます。

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

これで、`updateColorMap` は古いオブジェクトをミューテートするのではなく新しいオブジェクトを返すようになります。`Object.assign` は ES6 からの機能であり、ポリフィルが必要です（訳注：ブラウザや処理系が ES6 に未対応の場合）。

同様に、[オブジェクトのスプレッドプロパティ構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)を使うことで、ミューテートを避けてのオブジェクト更新が容易になります。

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

この機能は ES2018 で JavaScript に追加されたものです。

Create React App を使用しているなら、`Object.assign` およびオブジェクトのスプレッド構文の両方がデフォルトで利用できます。

深くネストされたオブジェクトを扱っている場合、ミューテートを行わない形式で更新することが複雑に感じることがあります。このような問題がある場合は [Immer](https://github.com/mweststrate/immer) や [immutability-helper](https://github.com/kolodny/immutability-helper) を試してみてください。これらのライブラリはミューテートを行わないことによる利点を損なわずに、読みやすいコードを書くのに役立ちます。
