---
id: optimizing-performance
title: Optimizing Performance
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

Internally, React uses several clever techniques to minimize the number of costly DOM operations required to update the UI. For many applications, using React will lead to a fast user interface without doing much work to specifically optimize for performance. Nevertheless, there are several ways you can speed up your React application.

React は UI の更新時に必要となる高コストな DOM 操作の回数を最小化するために、内部的にいくつかの賢いテクニックを使用しています。多くのアプリケーションでは React を使用するだけで、パフォーマンス向上のための特別な最適化で苦労しなくても、反応速度の速いユーザーインターフェースを実現できます。それでもなお、React アプリケーションを高速化するための方法はいくつか存在します。

## Use the Production Build
## 本番用ビルドを使用する

If you're benchmarking or experiencing performance problems in your React apps, make sure you're testing with the minified production build.

React アプリケーションでベンチマークを行う場合やパフォーマンスの問題が発生している場合には、ミニファイされた本番用ビルドでテストしていることを確認して下さい。

By default, React includes many helpful warnings. These warnings are very useful in development. However, they make React larger and slower so you should make sure to use the production version when you deploy the app.

デフォルトで React は多くの有用な警告チェックを行いますが、これは開発時にはとても有用です。でもそもために React アプリケーションのサイズは肥大化し、速度が低下してしまうので、アプリケーションのデプロイ時には本番バージョンを使用していることを確認してください。

If you aren't sure whether your build process is set up correctly, you can check it by installing [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). If you visit a site with React in production mode, the icon will have a dark background:


ビルドプロセスが正しく設定されているか分からない場合、[React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) をインストールして確認できます。
本番用モードの React のサイトを訪れた場合、アイコンは暗い背景となっています。

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

If you visit a site with React in development mode, the icon will have a red background:

開発モードの React のサイトを訪れた場合、アイコンは赤い背景となっています。

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

It is expected that you use the development mode when working on your app, and the production mode when deploying your app to the users.

アプリケーションに対して作業をしているときは開発モードを使用し、利用者に配布する場合には本番用モードを使用することをお勧めします。

You can find instructions for building your app for production below.

本番用にアプリを構築するための手順は以下のとおりです。

### Create React App

### Reactアプリを作成する

If your project is built with [Create React App](https://github.com/facebookincubator/create-react-app), run:

プロジェクトが [Create React App](https://github.com/facebookincubator/create-react-app) で構築されているなら、以下のコードを実行して下さい：

```
npm run build
```

This will create a production build of your app in the `build/` folder of your project.

これによりアプリケーションの本番用ビルドがプロジェクト内の `build/` フォルダに作成されます。


Remember that this is only necessary before deploying to production. For normal development, use `npm start`.

これは本番バージョンをデプロイする前のみ必要な作業であることに留意してください。通常の開発作業では、`npm start` を使用してください。

### Single-File Builds
### 単一ファイル版ビルド

We offer production-ready versions of React and React DOM as single files:

React と ReactDOM をそれぞれ単一ファイル化した本番環境用のバージョンを提供しています。

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Remember that only React files ending with `.production.min.js` are suitable for production.

本番用に適しているのは、React ファイル名の末尾が `.production.min.js` であるもののみであることに留意ください。

### Brunch

For the most efficient Brunch production build, install the [`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch) plugin:

Brunch で最も効率のよい本番用ビルドを行うためには、[`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch) をインストールしてください：

```
# If you use npm
npm install --save-dev uglify-js-brunch

# If you use Yarn
yarn add --dev uglify-js-brunch
```

Then, to create a production build, add the `-p` flag to the `build` command:

そして、本番用ビルドを作成するために、`build` コマンドに`-p` オプションを指定して実行します。

```
brunch build -p
```

Remember that you only need to do this for production builds. You shouldn't pass the `-p` flag or apply this plugin in development, because it will hide useful React warnings and make the builds much slower.


これが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告表示が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発用では `-p` フラグを指定したり、`uglify-js-brunch` プラグインを適用したりしないでください。

### Browserify

For the most efficient Browserify production build, install a few plugins:

Browserify で最も効率の良い本番用ビルドを行うため、いくつかのプラグインをインストールしてください。

```
# If you use npm
npm install --save-dev envify uglify-js uglifyify 

# If you use Yarn
yarn add --dev envify uglify-js uglifyify 
```

To create a production build, make sure that you add these transforms **(the order matters)**:

本番用ビルドを作成するには、以下の変換（transform）を追加してください（**順番は重要です**）。

* The [`envify`](https://github.com/hughsk/envify) transform ensures the right build environment is set. Make it global (`-g`).

* [`envify`](https://github.com/hughsk/envify) 変換は正しいビルド環境が確実に設定されるようにします。グローバルに設定してください (`-g`)。

* The [`uglifyify`](https://github.com/hughsk/uglifyify) transform removes development imports. Make it global too (`-g`).
* [`uglifyify`](https://github.com/hughsk/uglifyify) 変換は開発用にインポートしたライブラリを削除します。これもグローバルに設定してください (`-g`)。

* Finally, the resulting bundle is piped to [`uglify-js`](https://github.com/mishoo/UglifyJS2) for mangling ([read why](https://github.com/hughsk/uglifyify#motivationusage)).
* 最後に結果として出力されたものを、名前の圧縮のために [`uglify-js`](https://github.com/mishoo/UglifyJS2) にパイプします（[理由を読む](https://github.com/hughsk/uglifyify#motivationusage)）。

For example:

以下に例を示します。

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | uglifyjs --compress --mangle > ./bundle.js
```

>**Note:**
>
>The package name is `uglify-js`, but the binary it provides is called `uglifyjs`.<br>
>This is not a typo.
>
>パッケージ名は `uglify-js` ですが、パッケージが提供するバイナリ名は `uglifyjs` です。タイプミスではありません。

Remember that you only need to do this for production builds. You shouldn't apply these plugins in development because they will hide useful React warnings, and make the builds much slower.

これが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告文が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発用ではこれらのプラグインを適用しないで下さい。


### Rollup

For the most efficient Rollup production build, install a few plugins:

Rollup で最も効率のよい本番用ビルドを行うためには、いくつかのプラグインを以下のようにインストールします。

```
# If you use npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 

# If you use Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 
```

To create a production build, make sure that you add these plugins **(the order matters)**:

本番用ビルドを作成するには、以下のプラグインを追加してください（**順番は重要です**）。

* The [`replace`](https://github.com/rollup/rollup-plugin-replace) plugin ensures the right build environment is set.
* [`replace`](https://github.com/rollup/rollup-plugin-replace) プラグインは正しいビルド環境が確実に設定されるようにします。

* The [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) plugin provides support for CommonJS in Rollup.
* [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) プラグインは Rollup で CommonJS をサポートできるようにします。

* The [`uglify`](https://github.com/TrySound/rollup-plugin-uglify) plugin compresses and mangles the final bundle.
* [`uglify`](https://github.com/TrySound/rollup-plugin-uglify)  プラグインは出力された最終的なバンドルを圧縮し、mangle（訳注： 変数名や識別子を短縮）します。

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-uglify')(),
  // ...
]
```

For a complete setup example [see this gist](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

設定例の全体はこの [gist を参照](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0)してください。


Remember that you only need to do this for production builds. You shouldn't apply the `uglify` plugin or the `replace` plugin with `'production'` value in development because they will hide useful React warnings, and make the builds much slower.

これが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告表示が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発用では  `uglify` プラグインもしくは `replace` プラグインを`'production'` という値で適用しないでください。

### webpack

>**Note:**
>
>If you're using Create React App, please follow [the instructions above](#create-react-app).<br>
>This section is only relevant if you configure webpack directly.
>
> Create React App を利用している場合は、[上記のガイド](#create-react-app)に従ってください。
>このセクションは直接 webpack の設定を行いたい人向けです。

For the most efficient webpack production build, make sure to include these plugins in your production configuration:

webpack で最も効率のよい本番用ビルドを行うためには、本番ビルドの設定中に必ず以下のプラグインを含めるようにしてください。

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
}),
new webpack.optimize.UglifyJsPlugin()
```

You can learn more about this in [webpack documentation](https://webpack.js.org/guides/production-build/).

より詳細な説明については [webpack のドキュメント](https://webpack.js.org/guides/production-build/)を参照ください。

Remember that you only need to do this for production builds. You shouldn't apply `UglifyJsPlugin` or `DefinePlugin` with `'production'` value in development because they will hide useful React warnings, and make the builds much slower.

これが必要なのは本番用ビルドだけであることに留意してください。React の有用な警告文が隠されたり、ビルド速度が大幅に遅くなったりしますので、開発用では `UglifyJsPlugin` もしくは `DefinePlugin` を`'production'` という値で適用しないでください。

## Profiling Components with the Chrome Performance Tab
## Chrome のパフォーマンスタブでコンポーネントをプロファイルする

In the **development** mode, you can visualize how components mount, update, and unmount, using the performance tools in supported browsers. For example:

**開発** モードでは、対応ブラウザのパフォーマンス分析ツールでコンポーネントのマウント・更新・アンマウントの様子を視覚化することができます。例えば以下のとおり。

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React components in Chrome timeline" /></center>

To do this in Chrome:

Chrome でこれを行うには以下を行います。

1. Temporarily **disable all Chrome extensions, especially React DevTools**. They can significantly skew the results!
1. 一時的に **React DevTools を含むすべての Chrome 拡張機能を無効にする**。無効にしないと、結果が正確でなくなる可能性があります。

2. Make sure you're running the application in the development mode.
2. アプリケーションが開発モードで動作していることを確認する。

3. Open the Chrome DevTools **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** tab and press **Record**.
3. Chrome DevTools の**[パフォーマンス](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)タブ**を開いて **Record(記録)** ボタンを押す。

4. Perform the actions you want to profile. Don't record more than 20 seconds or Chrome might hang.
4. プロファイル対象のアクションを実行する。なお、20秒以上は記録しないでください。さもないと Chrome がハングアップすることがあります。

5. Stop recording.
5. 記録を停止する。

6. React events will be grouped under the **User Timing** label.
6. React イベントが **User Timing** ラベルの下にグループ化される。

For a more detailed walkthrough, check out [this article by Ben Schwarz](https://calibreapp.com/blog/2017-11-28-debugging-react/).
Reactイベントが User Timing ラベルの下にグループ化される。

Note that **the numbers are relative so components will render faster in production**. Still, this should help you realize when unrelated UI gets updated by mistake, and how deep and how often your UI updates occur.

**プロファイル結果の数値は相対的なものであり、コンポーネントは本番環境ではより速くレンダリングされる**ことに注意してください。
それでも、関係のない UI が誤って更新されているのを見つけたり、どの程度の頻度と深さで UI の更新が発生するのかを知る手助けになるはずです。

Currently Chrome, Edge, and IE are the only browsers supporting this feature, but we use the standard [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) so we expect more browsers to add support for it.

現時点では、Chrome、Edge、そして IE のみがこの機能をサポートするブラウザですが、私達は標準の [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) を採用しているので、より多くのブラウザがサポートしてくれることを期待しています。

## Profiling Components with the DevTools Profiler
## DevToolsプロファイラを使用したコンポーネントのプロファイリング

`react-dom` 16.5+ and `react-native` 0.57+ provide enhanced profiling capabilities in DEV mode with the React DevTools Profiler.
An overview of the Profiler can be found in the blog post ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
A video walkthrough of the profiler is also [available on YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).


`react-dom` 16.5 以降と`react-native` 0.57 以降では、DEV モードにおける強化されたプロファイリング機能を React DevTools プロファイラにて提供しています。このプロファイラの概要がブログ記事「[Introduction the React Profiler](/blog/2018/09/10/introducing-the-react-profiler.html)」で説明されています。チュートリアル動画も[YouTubeで入手できます](https://www.youtube.com/watch?v=nySib7ipZdk)。


If you haven't yet installed the React DevTools, you can find them here:

React DevToolsをまだインストールしていない場合は、以下で見つけることができます。

- [Chromeブラウザ拡張](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefoxブラウザ拡張](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [スタンドアロンのNodeパッケージ](https://www.npmjs.com/package/react-devtools)

> Note
>
> A production profiling bundle of `react-dom` is also available as `react-dom/profiling`.
> Read more about how to use this bundle at [fb.me/react-profiling](https://fb.me/react-profiling)
>
> 注意
>
> 本番ビルド版 `react-dom` のプロファイリング可能なバンドルは `react-dom/profiling` として利用可能です。このバンドルの使い方の詳細については、[fb.me/react-profiling](https://fb.me/react-profiling) を参照してください。

## Virtualize Long Lists
## 長いリストの仮想化

If your application renders long lists of data (hundreds or thousands of rows), we recommended using a technique known as "windowing". This technique only renders a small subset of your rows at any given time, and can dramatically reduce the time it takes to re-render the components as well as the number of DOM nodes created.

アプリケーションがデータの長いリスト（数百〜数千行）を描画する場合は、「ウィンドウイング」として知られるテクニックを使うことをおすすめします。このテクニックでは、ある瞬間においてリストの小さな部分集合のみを描画することで、作成する DOM ノードの数およびコンポーネントの再描画にかかる時間を大幅に削減することができます。

[react-window](https://react-window.now.sh/) and [react-virtualized](https://bvaughn.github.io/react-virtualized/) are popular windowing libraries. They provide several reusable components for displaying lists, grids, and tabular data. You can also create your own windowing component, like [Twitter did](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), if you want something more tailored to your application's specific use case.

[react-window](https://react-window.now.sh/)と[react-virtualized](https://bvaughn.github.io/react-virtualized/)はウィンドウイング処理のための人気があるライブラリです。これらはリスト、グリッド、および表形式のデータを表示するための、いくつかの再利用可能コンポーネントを提供しています。[Twitter did](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3)が行なっているように、アプリケーションの特定のユースケースに合わせてより多くの何かをしたい場合は、独自のウィンドウイング処理のコンポーネントを作成することもできます。


## Avoid Reconciliation
## リコンシリエーション（差分検出、突き合せ処理）を避ける

React builds and maintains an internal representation of the rendered UI. It includes the React elements you return from your components. This representation lets React avoid creating DOM nodes and accessing existing ones beyond necessity, as that can be slower than operations on JavaScript objects. Sometimes it is referred to as a "virtual DOM", but it works the same way on React Native.

React はレンダリングされた UI の内部表現を構築し、維持します。それにはコンポーネントが返した React 要素も含まれています。
この内部表現を使うことで React は、JavaScript オブジェクトの操作よりも遅くなりうる DOM ノードの作成やアクセスを必要以上に行うことを回避します。しばしばこの内部表現は "仮想DOM (virtual DOM)" と呼ばれますが、React Native でも同様に動作します。

When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM.

コンポーネントの props か state が変更された場合、React は新しく返された要素を以前にレンダリングされたものと比較することで、本物の DOM の更新が必要かを判断します。それらが等しくない場合、React は DOM を更新します。

You can now visualize these re-renders of the virtual DOM with React DevTools:
React DevToolsを使用して仮想DOMのこれらの再レンダリングを視覚化できるようになりました。

- [Chrome Browser Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefox Browser Extension](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [Standalone Node Package](https://www.npmjs.com/package/react-devtools)


- [Chromeブラウザ拡張](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Firefoxブラウザ拡張](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [スタンドアロンNodeパッケージ](https://www.npmjs.com/package/react-devtools)

In the developer console select the **Highlight Updates** option in the **React** tab:

開発者コンソールの **React** タブで **Highlight Updates** オプションを選択します：

<center><img src="../images/blog/devtools-highlight-updates.png" style="max-width:100%; margin-top:10px;" alt="How to enable highlight updates" /></center>

Interact with your page and you should see colored borders momentarily appear around any components that have re-rendered. This lets you spot re-renders that were not necessary. You can learn more about this React DevTools feature from this [blog post](https://blog.logrocket.com/make-react-fast-again-part-3-highlighting-component-updates-6119e45e6833) from [Ben Edelstein](https://blog.logrocket.com/@edelstein).

ページを操作すると、再レンダリングされたコンポーネントの周囲に色付きの枠線が一定時間表示されます。これにより、不要な再レンダリングを見つけることができます。この React DevTools 機能の詳細については、[Ben Edelstein](https://blog.logrocket.com/@edelstein)による[このブログ投稿](https://blog.logrocket.com/make-react-fast-again-part-3-highlighting-component-updates-6119e45e6833)から学ぶことができます。

Consider this example:

以下の例を考えてください。

<center><img src="../images/blog/highlight-updates-example.gif" style="max-width:100%; margin-top:20px;" alt="React DevTools Highlight Updates example" /></center>

Note that when we're entering a second todo, the first todo also flashes on the screen on every keystroke. This means it is being re-rendered by React together with the input. This is sometimes called a "wasted" render. We know it is unnecessary because the first todo content has not changed, but React doesn't know this.

2つ目の TODO を入力しているとき、1つ目の TODO もキーストロークの度に画面上で点滅することに注意してください。これは、React が入力によって一緒に再レンダリングしていることを意味します。 これは「無駄な」レンダリングと呼ばれることがあります。最初の TODO の内
容は変更されておらず、再レンダリングの必要がないことを我々は知っていますが、React はそれを知りません。

Even though React only updates the changed DOM nodes, re-rendering still takes some time. In many cases it's not a problem, but if the slowdown is noticeable, you can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns `true`, leaving React to perform the update:

React は変更された DOM ノードしか更新しないとはいえ、再レンダリングには時間がかかります。多少の時間がかかっても多くの場合は問題にはなりませんが、遅延が目立つ場合、再レンダリングプロセスが開始される前にトリガーされるライフサイクル関数 `shouldComponentUpdate` をオーバーライドすることで、スピードを全面的に向上できます。この関数のデフォルトの実装は `true`を返し、React にそのまま更新処理を実行させます。

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

If you know that in some situations your component doesn't need to update, you can return `false` from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

ある状況においてコンポーネントが更新される必要がないと分かっているなら、`shouldComponentUpdate` から代わりに `false` を返すことにより、該当コンポーネントおよび配下への `render()` 呼び出しを含む、レンダリング処理の全体をスキップすることができます。

In most cases, instead of writing `shouldComponentUpdate()` by hand, you can inherit from [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). It is equivalent to implementing `shouldComponentUpdate()` with a shallow comparison of current and previous props and state.

ほとんどの場合、手で `shouldComponentUpdate()` を書く代わりに、[`React.PureComponent`](/docs/react-api.html#reactpurecomponent)から継承できます。 これは現在と直前の props と state に対する浅い比較（Shallow Comparison）を行うような `shouldComponentUpdate()` を実装することと同じです。

## shouldComponentUpdate In Action
## shouldComponentUpdate の実際の動作

Here's a subtree of components. For each one, `SCU` indicates what `shouldComponentUpdate` returned, and `vDOMEq` indicates whether the rendered React elements were equivalent. Finally, the circle's color indicates whether the component had to be reconciled or not.

以下のようなコンポーネントのサブツリーがあるとします。それぞれ、`SCU` は `shouldComponentUpdate` が返したもの(訳注: 緑はtrue、赤は false)を示し、`vDOMEq` はレンダリングされた React 要素が等しかったかどうか(訳注: 緑は等しい、赤は等しくない)を示します。
最後に、円の色はコンポーネントに対してツリーを比較して合わせ込むためのリコンシリエーション処理が（本来）必要だったのかどうか(訳注: 緑は不要、赤は必要)を示します。

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Since `shouldComponentUpdate` returned `false` for the subtree rooted at C2, React did not attempt to render C2, and thus didn't even have to invoke `shouldComponentUpdate` on C4 and C5.

C2 をルートとするサブツリーでは `shouldComponentUpdate` が `false` を返したので、React は C2 をレンダリングしようとしませんでした。したがって C4 と C5 については `shouldComponentUpdate` を実行する必要すらなかったわけです。

For C1 and C3, `shouldComponentUpdate` returned `true`, so React had to go down to the leaves and check them. For C6 `shouldComponentUpdate` returned `true`, and since the rendered elements weren't equivalent React had to update the DOM.

C1 と C3 では、`shouldComponentUpdate` が `true` を返したので、React は葉ノードにも移動してチェックする必要がありました。C6 では `shouldComponentUpdate` が `true` を返し、レンダリングされた要素は等しくなかったので、React は DOM を更新する必要がありました。

The last interesting case is C8. React had to render this component, but since the React elements it returned were equal to the previously rendered ones, it didn't have to update the DOM.

最後の興味深いケースが C8 です。React はこのコンポーネントをレンダリングする必要がありましたが、返された React 要素は前回レンダリングされたときものと同じだったので、DOM の更新は必要ありませんでした。

Note that React only had to do DOM mutations for C6, which was inevitable. For C8, it bailed out by comparing the rendered React elements, and for C2's subtree and C7, it didn't even have to compare the elements as we bailed out on `shouldComponentUpdate`, and `render` was not called.

React が DOM を更新しなければならなかったのは、C6 だけだったことに注目してください。C6 の更新は避けられないものでした。C8 では、レンダリングされた React 要素の比較を実行してから処理が終わったのですが、C2 のサブツリーと C7 では `shouldComponentUpdate` のところで処理が終わって render メソッドが呼ばれなかったため、要素の比較は実行する必要すらありませんでした。

## Examples
## 例

If the only way your component ever changes is when the `props.color` or the `state.count` variable changes, you could have `shouldComponentUpdate` check that:

コンポーネントが変更される唯一の方法が `props.color` または `state.count` 変数が変化した時のみだとしたら、`shouldComponentUpdate` では以下のようなチェックを行えます。

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

In this code, `shouldComponentUpdate` is just checking if there is any change in `props.color` or `state.count`. If those values don't change, the component doesn't update. If your component got more complex, you could use a similar pattern of doing a "shallow comparison" between all the fields of `props` and `state` to determine if the component should update. This pattern is common enough that React provides a helper to use this logic - just inherit from `React.PureComponent`. So this code is a simpler way to achieve the same thing:

このコードは、`shouldComponentUpdate` は単に `props.color` もしくは `state.count` が変化しているかをチェックしているだけです。これらの値に変化がなければ、コンポーネントは更新されません。コンポーネントがもっと複雑な場合は、`props` と `state` のすべてのフィールドに対して "浅い比較（Shallow Comparison）" をするという同種のパターンでコンポーネントを更新するべきかを決定できます。このパターンはあまりに一般的なので、React はこのロジックのためのヘルパーを用意しており、`React.PureComponent` から継承するだけで使用できます。だから以下のコードで前述のコードと同じことをよりシンプルに実装できます。

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

Most of the time, you can use `React.PureComponent` instead of writing your own `shouldComponentUpdate`. It only does a shallow comparison, so you can't use it if the props or state may have been mutated in a way that a shallow comparison would miss.

ほとんどの場合、自分で `shouldComponentUpdate` を記述する代わりに `React.PureComponent` を使うことができます。浅い（shallow）比較を行うだけですので、浅い比較では検出できない形で props や state が変更されている可能性がある場合には使えません。

This can be a problem with more complex data structures. For example, let's say you want a `ListOfWords` component to render a comma-separated list of words, with a parent `WordAdder` component that lets you click a button to add a word to the list. This code does *not* work correctly:


この事はもっと複雑なデータ構造を持つ場合には問題となります。例えば、 カンマ区切りで単語をレンダリングする `ListOfWords` コンポーネントと、ボタンをクリックしてリストに単語を追加できる親コンポーネント `WordAdder` が必要だとしましょう。以下のコードは正しく動作しません。

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

The problem is that `PureComponent` will do a simple comparison between the old and new values of `this.props.words`. Since this code mutates the `words` array in the `handleClick` method of `WordAdder`, the old and new values of `this.props.words` will compare as equal, even though the actual words in the array have changed. The `ListOfWords` will thus not update even though it has new words that should be rendered.

問題は `PureComponent` が `this.props.words` の古い値と新しい値を単純に比較することにあります。
上記のコードでは `WordAdder` の handleClick メソッド内で `words` 配列の内容を変更するので、`this.props.words` の新旧の値は、たとえ配列内の実際の単語が変更されていたとしても、比較の結果同じだとみなしてしまうのです。
そのため `ListOfWords` はレンダリングすべき新しい単語が追加されているにも関わらず、更新されません。

## The Power Of Not Mutating Data
## データを変更しないことの効果

The simplest way to avoid this problem is to avoid mutating values that you are using as props or state. For example, the `handleClick` method above could be rewritten using `concat` as:

この問題を避ける最も単純な方法は、props や state として使用している値の変更を避けることです。
例えば、上記の `handleClick` メソッドは `concat` を使って以下のように書き換えることができます：

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 supports a [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) for arrays which can make this easier. If you're using Create React App, this syntax is available by default.

ES6 はこれをより簡単に実装できる配列用の[スプレッド構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)をサポートしています。
Create React App を使用していれば、この構文はデフォルトで利用できます。

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

You can also rewrite code that mutates objects to avoid mutation, in a similar way. For example, let's say we have an object named `colormap` and we want to write a function that changes `colormap.right` to be `'blue'`. We could write:

同様に、オブジェクトを変更するコードを変更が起きないものに書き換えることができます。
例えば、`colormap` というオブジェクトがあり、`colormap.right` を `'blue'` に変更する関数が必要だとしましょう。
以下のように書くことも可能ですが…

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

To write this without mutating the original object, we can use [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method:

元のオブジェクトを変更することなく実装するのには、Object.assign が使用できます：

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` now returns a new object, rather than mutating the old one. `Object.assign` is in ES6 and requires a polyfill.

There is a JavaScript proposal to add [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread) to make it easier to update objects without mutation as well:


これで、`updateColorMap` は古いオブジェクトを変更するのではなく新しいオブジェクトを返すようになります。`Object.assign` は ES6 からの機能であり、ポリフィルが必要です。

オブジェクトでも変更を伴わない更新を容易にする[オブジェクトのスプレッドプロパティ](https://github.com/sebmarkbage/ecmascript-rest-spread)を JavaScript に追加することが提案されています：


```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

If you're using Create React App, both `Object.assign` and the object spread syntax are available by default.

Create React App を使用しているなら、`Object.assign` とオブジェクトのスプレッド構文の両方がデフォルトで利用できます。

## Using Immutable Data Structures
## イミュータブルなデータ構造の使用

[Immutable.js](https://github.com/facebook/immutable-js) is another way to solve this problem. It provides immutable, persistent collections that work via structural sharing:

[Immutable.js](https://github.com/facebook/immutable-js) はこの問題を解決する別の方法であり、構造の共有により動作する不変で永続的なデータのコレクションを提供します。

* *Immutable*: once created, a collection cannot be altered at another point in time.
* *不変(イミュータブル*: 一度作成されたら、データのコレクションはその後で変更することはできない。
* *Persistent*: new collections can be created from a previous collection and a mutation such as set. The original collection is still valid after the new collection is created.
* *永続性*: 既存のコレクションに set などの変更操作を行うことで新しいデータのコレクションを作成できる。元のコレクションは新しいデータのコレクションが作成された後も有効である。
* *Structural Sharing*: new collections are created using as much of the same structure as the original collection as possible, reducing copying to a minimum to improve performance.
* *構造の共有*: 新しいデータのコレクションは、元のコレクションが含む同じ構造を可能な限り共有されて作られるので、データのコピー量が減りパフォーマンスが向上する。

Immutability makes tracking changes cheap. A change will always result in a new object so we only need to check if the reference to the object has changed. For example, in this regular JavaScript code:

不変性により変更を追跡することのコストが下がります。データを変更した結果は常に新しいオブジェクトになるので、オブジェクトの参照が変化したかどうかのみをチェックすればよくなるのです。例えば、以下の標準のJavaScriptコードで：

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

Although `y` was edited, since it's a reference to the same object as `x`, this comparison returns `true`. You can write similar code with immutable.js:

`y` は編集されたにも関わらず、`x` と同じオブジェクトを参照しているため、上記の比較は `true` を返します。これと同様のコードを immutable.js でも書くことができますが：


```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

In this case, since a new reference is returned when mutating `x`, we can use a reference equality check `(x === y)` to verify that the new value stored in `y` is different than the original value stored in `x`.

この場合、`x` に対する変更の結果、新しい参照が返されるので、参照の比較`(x === y)`だけで、`y` に保存されている新しい値が `x` に保存されていた値とは違うものだ、と確かめられます。

Two other libraries that can help use immutable data are [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) and [immutability-helper](https://github.com/kolodny/immutability-helper).

その他には、[seamless-immutable](https://github.com/rtfeldman/seamless-immutable) や [immutability-helper](https://github.com/kolodny/immutability-helper) などのライブラリが不変データの使用に役立ちます。

Immutable data structures provide you with a cheap way to track changes on objects, which is all we need to implement `shouldComponentUpdate`. This can often provide you with a nice performance boost.

イミュータブルなデータ構造はオブジェクトにおける変更の追跡を容易にし、`shouldComponentUpdate` を実装する際にはこれを使うだけでよくなるのです。これによりパフォーマンスを大幅に向上できることがしばしばあります。
