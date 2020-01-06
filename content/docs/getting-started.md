---
id: getting-started
title: Getting Started
permalink: docs/getting-started.html
next: add-react-to-a-website.html
redirect_from:
  - "docs/"
  - "docs/index.html"
  - "docs/getting-started-ko-KR.html"
  - "docs/getting-started-zh-CN.html"
  - "docs/installation.html"
  - "download.html"
  - "downloads.html"
  - "docs/try-react.html"
  - "docs/tooling-integration.html"
  - "docs/package-management.html"
  - "docs/language-tooling.html"
  - "docs/environments.html"
---

このページは React のドキュメント、および関連する資料の概要となります。

**React** はユーザインターフェースを作成する為の JavaScript のライブラリです。[ここのホームページ](/)、または[このチュートリアル](/tutorial/tutorial.html)から React がどういうものかを学びましょう。

---

- [React を試す](#try-react)
- [React を学ぶ](#learn-react)
- [最新の情報を追いたい人へ](#staying-informed)
- [バージョン管理されたドキュメント](#versioned-documentation)
- [足りないものがある？](#something-missing)

## React を試す {#try-react}

React は初めから既存のプロジェクトに徐々に追加していけるようなデザインとなっています。**あなたは React をどれだけ使っても問題ありません。**触りだけやってみるもよし、シンプルな HTML のページにインタラクティブな機能を追加するのに使うもよし、React をフル活用した複雑なアプリを作成するもよし。どのような目的にしても、このページにあるリンクが役に立つでしょう。

### Web 上で試せるオンラインエディタ {#online-playgrounds}

React をちょっと試してみたい場合、Web 上のコードエディタが使えます。[CodePen](codepen://hello-world)、[CodeSandbox](https://codesandbox.io/s/new) や [Glitch](https://glitch.com/edit/#!/remix/starter-react-template) で Hello World のテンプレートを使って試してみましょう。

自前のテキストエディタを使いたい場合は、[この HTML ファイル](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html)をダウンロード・編集して、ブラウザを使ってからローカルファイルシステムから開くことができます。ランタイムでの遅いコード変換が行われる為、簡単なデモに留めておくことをおすすめします。

### React を Web サイトに追加する {#add-react-to-a-website}

[React は HTML ページにすぐに追加することができます](/docs/add-react-to-a-website.html)。そのあと徐々に全体に反映させていくか、少数のダイナミックなウィジェットに留めるかはあなたの自由です。

### 新規 React アプリの作成 {#create-a-new-react-app}

新しく React のプロジェクトを始めたい場合でも、まずは[シンプルな HTML ページに script タグを追加](/docs/add-react-to-a-website.html)するのがおすすめです。数分でセットアップできます！

アプリが成長するにつれて、より統合されたセットアップを行うことを考慮していきましょう。大きいアプリの場合におすすめの[様々な JavaScript を用いたツールチェイン](/docs/create-a-new-react-app.html)が存在します。それぞれわずかな設定、もしくは設定要らずでリッチな React のエコシステムをフル活用できます。

## React を学ぶ {#learn-react}

React を学びたい人には様々な背景があり、それぞれいろんな学び方のスタイルがあるでしょう。理論から学びたい人も、実際に手を動かしながら学びたい人も、このセクションが役に立てれば幸いです。

* **実際に手を動かしながら学びたい人**は[チュートリアル](/tutorial/tutorial.html)からはじめましょう。
* **コンセプトからひとつひとつ学んでいきたい人**は[こちらのガイド](/docs/hello-world.html)からはじめていきましょう。

他の新しい技術を新しく学ぶ時と同様、React にも学習コストがあります。しかし、辛抱強く、地道にコツコツやっていくことで、*絶対に*できるようになります。

### 最初の例 {#first-examples}

[React のホームページ](/)にはライブエディタにて記入できる小さな React のサンプルがいくつか載っています。まだ React のことを何も知らなくても、実際に触ってみてどのように変化するか見てみましょう。

### React 初心者向けのガイド {#react-for-beginners}

もし、React の公式ドキュメントのペースが早すぎると感じた場合は、[Tania Rascia 氏によって書かれた React の概要](https://www.taniarascia.com/getting-started-with-react/)を読んでみましょう。React の重要なコンセプトについて詳細に説明されており、初心者にもとても易しい作りとなっています。それが終わったら、もう一度公式ドキュメントを読んでみましょう！

### デザイナー向けのガイド {#react-for-designers}

もしあなたがデザイナーのバックグラウンドを持っているなら、[これらの資料](https://reactfordesigners.com/)から始めることをおすすめします。

### JavaScript 資料 {#javascript-resources}

React の公式ドキュメントはあなたがある程度 JavaScript について知っていることを想定しています。JavaScript の達人である必要は全くありませんが、JavaScript と React を同時に習得するのは難しいでしょう。

JavaScript について自分がどれだけ知っているかを知るために、[この JavaScript の概要](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)を読んでおくことをおすすめします。読むのに 30 分から 1 時間程かかってしまいますが、React を学ぶための自信へと繋がってくるでしょう。

> ヒント
>
>もし JavaScript で何か詰まった時は、[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) と [javascript.info](https://javascript.info/) を確認すると良いでしょう。また、[コミュニティ運営の掲示板](/community/support.html)を活用するのもおすすめします。

### 実践チュートリアル {#practical-tutorial}

**実際に手を動かしながら学びたい人**は[チュートリアル](/tutorial/tutorial.html)からはじめましょう。このチュートリアルでは React を使って三目並べゲームを作成します。ゲーム作成に興味が無い方は飛ばそうと思うかもしれませんが、試してみてください。ここで学ぶテクニックは*全ての* React アプリの基礎となることであり、習得することで React に関する深い理解を得るでしょう。

### 一歩づつ進めるためのガイド {#step-by-step-guide}

**コンセプトからひとつひとつ学んでいきたい人**は[こちらのガイド](/docs/hello-world.html)からはじめていきましょう。このガイドは章ごとに分かれていて、各章がそれまでに習ったことを上乗せする知識となっているため、余すことなく学ぶことができます。

### React 的な考え方 {#thinking-in-react}

多くの React のユーザは [React の流儀](/docs/thinking-in-react.html)を読んだ時に React についてピンときたと高く評価しています。この世に存在する一番古い React に関する資料ですが、今でも現役で使えます。

### おすすめの資料 {#recommended-courses}

時には第三者が執筆した技術書やオンラインコース等が公式ドキュメントよりもわかりやすいという人もいます。我々は[よく勧められている資料集](/community/courses.html)についてもまとめています。無料のものもあります。

### 高度なコンセプト {#advanced-concepts}

React の[基本コンセプト](/docs/hello-world.html)について慣れてきて、実際に手で動かしてみたら、今度はさらに高度な内容にも手を出したいと思うかもしれません。この資料では強力な、しかし普段使われることのない [コンテクスト](/docs/context.html) や [ref](/docs/refs-and-the-dom.html) といった React のさらなる機能について紹介します。

### API リファレンス {#api-reference}

この資料は特定の React API の詳細について学びたいときに役に立つでしょう。例えば、[`React.Component` API リファレンス](/docs/react-component.html)では `setState()` がどう機能しているかについてより詳細に記載されていたり、種々のライフサイクルメソッドがどのように役に立つかについて書かれています。

### 用語集と FAQ {#glossary-and-faq}

この[用語集](/docs/glossary.html)にはこのドキュメントにてよく使われる単語等が記載されています。FAQ もあり、[AJAX リクエストについて](/docs/faq-ajax.html)、[コンポーネントの state](/docs/faq-state.html)、[ファイル構成](/docs/faq-structure.html)などのよくある質問とそれらに対する回答が記載されています。

## 最新の情報を追いたい人へ {#staying-informed}

[React ブログ](/blog/)は React チームからのアップデートが記載されている公式ブログです。リリースノートや機能の非推奨化の告知など、何か大事な発表がある時にはこのブログに真っ先に記載されます。

他にも [@reactjs](https://twitter.com/reactjs) のツイッターアカウントをフォローすることもできますが、公式ブログを追っていれば大事なことを見落とすことはないでしょう。

全ての React のリリースにブログ記事があるわけではありませんが、リリースごとに詳細に書かれた changelog が [React リポジトリの `CHANGELOG.md`](https://github.com/facebook/react/blob/master/CHANGELOG.md)、および [Releases ページ](https://github.com/facebook/react/releases)に記載されています。

## バージョン管理されたドキュメント {#versioned-documentation}

このドキュメントは常に最新の stable 版の React に準拠しています。React 16 からは古いバージョンのドキュメントも[別のページ](/versions)から閲覧できます。古いバージョンのドキュメントは各バージョンリリース時のスナップショットであり、更新をかけることはありません。

## 他に聞きたいことは？ {#something-missing}

ドキュメントに記載されていないことがあったり、わかりにくい箇所があったりしたら、困ったことや改善案等を[この公式ドキュメントのリポジトリ](https://github.com/reactjs/reactjs.org/issues/new)に issue として立てるか、もしくは公式の [@reactjs](https://twitter.com/reactjs) までご連絡ください。あなたのご意見をお待ちしております！
