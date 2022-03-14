---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

React のいちばん短い例はこのようになります：

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

これは "Hello, world!" という見出しをページに表示します。

**[Try it on CodePen](https://codepen.io/gaearon/pen/rrpgNB?editors=1010)**

上記のリンクをクリックしてオンラインエディタを開いてください。好きなように書き換えて、出力にどう影響するのかを確認してみてください。このガイドのほとんどのページにはこのような編集可能な例が出てきます。

<a id="how-to-read-this-guide"></a>
## このガイドの読み方 {#how-to-read-this-guide}

このガイドでは、React アプリケーションの構成部品である React 要素やコンポーネントの使い方を見ていきます。一度それらをマスターすると、小さくて再利用可能な部品から複雑なアプリケーションを作成できるようになります。

>ヒント
>
>このガイドはコンセプトを一段階ずつ学んでいきたい人向けに構成されています。手を動かして学びたい方は[実践的なチュートリアル](/tutorial/tutorial.html)を参照してください。このガイドとチュートリアルは互いに相補的なものです。

このページは、React のコンセプトをステップバイステップで学ぶためのガイドのうち最初の章です。全ての章のリストはナビゲーション用のサイドバーにあります。モバイルデバイスで読んでいる場合は、画面の右下にあるボタンを押すことでナビゲーションにアクセスできます。

それぞれの章は、前の章までに学んだ知識を前提として構成されています。**"Main Concepts" にある章をサイドバーに並んでいる順番に読んでいくことで、React のほとんどを学ぶことができます**。例えば [“JSX の導入”](/docs/introducing-jsx.html) がこの章の次の章です。

## 前提となる知識 {#knowledge-level-assumptions}

React は JavaScript ライブラリなので、JavaScript 言語の基本的な理解があることを想定しています。**あまり自信がない場合は、[JavaScript のチュートリアル](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)を一通り読んで知識レベルを確認し、**このガイドを迷わず読み進められるようにしてください。そうすれば 30 分から 1 時間ほどかかるかもしれませんが、JavaScript と React を同時に学んでいるような気分にならずにすむでしょう。

>補足
>
>このガイドでは時折比較的新しい JavaScript の構文を例の中で使用しています。ここ数年 JavaScript を使った仕事をしていなかったという場合は、[この 3 点](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c)を理解すればだいたい理解したことになるでしょう。

## 始めましょう！ {#lets-get-started}

下にスクロールすればウェブサイトのフッターのすぐ手前に[このガイドの次の章へのリンク](/docs/introducing-jsx.html)が出てきます。
