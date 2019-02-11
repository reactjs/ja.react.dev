---
id: forwarding-refs
title: refのフォワーディング
permalink: docs/forwarding-refs.html
---

ref のフォワーディングはあるコンポーネントからその子コンポーネントのひとつに [ref](/docs/refs-and-the-dom.html) を自動的に渡すテクニックです。基本的にはアプリケーション内のほとんどのコンポーネントで必要ありません。しかし、コンポーネントの種類によっては、特に再利用可能なコンポーネントライブラリでは、便利であることがあります。

## DOM コンポーネントに ref をフォワーディングする {#forwarding-refs-to-dom-components}

ネイティブの `button` DOM 要素を描画する `FancyButton` というコンポーネントを考えてみましょう：
`embed:forwarding-refs/fancy-button-simple.js`

React コンポーネントは、描画される出力も含め、実装の詳細を隠蔽します。`FancyButton` を使用する他のコンポーネントは内部の `button` DOM 要素に対する [ref を取得する](/docs/refs-and-the-dom.html) **必要は通常ありません** 。これによって、互いのコンポーネントの DOM 構造に過剰に依存することが防がれるので、良いことではあります。

そういったカプセル化は `FeedStory` や `Comment` のようなアプリケーションレベルのコンポーネントでは望ましいことではありますが、`FancyButton` や `MyTextInput` といった非常に多くのところで再利用可能な "葉" コンポーネントでは不便である可能性があります。このようなコンポーネントは、通常の DOM である `button` や `input` と同様に、アプリケーションのいたるところで使われる傾向にあり、フォーカス、要素の選択、アニメーションをこなすにはそれらの DOM にアクセスすることが避けられないかもしれません。

**ref のフォワーディングはオプトインの機能で、それにより、コンポーネントは `ref` を取ることができるようになり、コンポーネントは `ref` をさらに下層の子に渡し（つまり、ref を "フォワーディング" し）ます。**

下の例では、`FancyButton` は渡された `ref` を取得し、それから描画する `button` DOM にフォワーディングするために、`React.forwardRef` を使っています。

`embed:forwarding-refs/fancy-button-simple-ref.js`

このように、`FancyButton` を使ったコンポーネントは下層の `button` DOM ノードの ref を取得することができ、必要であれば `button` DOM を直接使うかのように、DOM にアクセスすることができます。

上の例で、何が起こっているかを順々に説明します。

1. `React.createRef` を呼び、[React ref](/docs/refs-and-the-dom.html) をつくり、それを `ref` 変数に代入します。
1. `ref` を JSX の属性として指定することで `<FancyButton ref={ref}>` に渡します。
1. React は 2 番目の引数として、`forwardRef` 内の関数に `ref` を渡します。
1. この `ref` を JSX の属性として指定することで `<button ref={ref}>` に渡します。
1. この ref が付与されると、`ref.current` は `<button>` DOM ノードのことを指すようになります。

>補足
>
> 2 番目の引数 `ref` は `React.forwardRef` の呼び出しを使ってコンポーネントを定義したときにだけ存在します。通常の関数またはクラスコンポーネントは `ref` 引数を受け取らず、ref は props 中でも使用することができません。
>
> ref のフォワーディング先は DOM コンポーネントだけにとどまりません。クラスコンポーネントインスタンスへの ref もフォワ−ディングすることができます。

## コンポーネントライブラリのメンテナ向けの補足 {#note-for-component-library-maintainers}

**コンポーネントライブラリの中で、`forawrdRef` を使い始めた場合、破壊的変更として扱い、ライブラリのメジャーバージョンをリリースすべきです。**ライブラリが今までと著しく違う挙動（何の ref が代入されるのか、どのような type がエクスポートされるかのような）をする可能性があるからです。

存在する場合だけ、条件的に `React.forwardRef` を適用することも同じ理由で推奨されません： そのような実装は、React そのものを更新したとき、ライブラリがどのように振る舞うかを変えてしまい、ユーザのアプリケーションを破壊する可能性があるからです。

## 高階コンポーネントにおける ref のフォワーディング {#forwarding-refs-in-higher-order-components}

このテクニックは [高階コンポーネント](/docs/higher-order-components.html)（HOC としても知られています）においても特に便利です。
`embed:forwarding-refs/log-props-before.js`

"logProps" HOC はすべての `props` をラップするコンポーネントに渡すので、描画される出力は同じになるでしょう。例えば、"fancy button" コンポーネントに渡されるすべての props をログとして記録するために、この HOC を使用することができます。
`embed:forwarding-refs/fancy-button.js`

上の例でひとつ注意があります：ref は渡されません。`ref` は props のひとつではないからです。`key` と同様に ref は React では props とは違う扱いになります。HOC に対する ref を追加した場合、ラップされたコンポーネントではなく、一番外側のコンテナコンポーネントを参照します。

このことは `FancyButton` コンポーネントが実際には `LogProps` コンポーネントに付与されることを意味します。
`embed:forwarding-refs/fancy-button-ref.js`

幸いにも、`React.forwardRef` API を使って、内側の `FancyButton` コンポーネントに対して ref を明示的に渡すことができます。`React.forwardRef` は引数を受け取る render 関数を受け取り、その関数は `props` と `ref` を引数としてとり、React ノードを返します。例えば、
`embed:forwarding-refs/log-props-after.js`

## DevTools でのカスタムの名表示{#displaying-a-custom-name-in-devtools}

`React.forwardRef` は render 関数を受け取ります。React DevTools は ref をフォワーディングしているコンポーネントとして何を表示すべきかを決定するために、この関数を使います。

例えば、次のコンポーネントは "*ForwardRef*" として DevTools に表示されます。

`embed:forwarding-refs/wrapped-component.js`

render 関数に名前をつけると、DevTools はその名前を含めるようになります（例： "*ForwardRef(myFunction)*"）：

`embed:forwarding-refs/wrapped-component-with-function-name.js`

ラップしているコンポーネントを含めるために、render 関数の  `displayName` を設定することもできます：

`embed:forwarding-refs/customized-display-name.js`
