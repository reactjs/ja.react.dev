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

**React** はユーザーインターフェースを作成する為の JavaScript のライブラリです。 
[ここのホームページ](/)、または[このチュートリアル](/tutorial/tutorial.html)から React がどういうものかを学びましょう。

---

- [React を試す](#try-react)
- [React を学ぶ](#learn-react)
- [最新の情報を追う](#staying-informed)
- [バージョン管理されたドキュメント](#versioned-documentation)
- [足りないものがある?](#something-missing)

## React を試す

React は初めから既存のプロジェクトに徐々に追加していけるようなデザインとなっています。 **あなたは React をどれだけ使っても問題ありません**触りだけやってみるもよし、シンプルな HTML のページにインタラクティブな機能を追加するのに使うもよし、React をフル活用した複雑なアプリを作成するもよし。どのような目的にしても、このページにあるリンクが役に立つでしょう。

### Web 上で試す

React を試してみたかったら、Web 上のコードエディタでも試すことができます。
[CodePen](codepen://hello-world) や [CodeSandbox](https://codesandbox.io/s/new) で Hello World のテンプレートを使って試してみましょう。

自前のテキストエディタを使いたい場合は、[この HTML ファイル](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html)をダウンロードして、編集して、ブラウザからローカルで開くことができます。
ランタイムでのコード変換が行われる為、簡単なデモに留めておくことをおすすめします。

### React を Web サイトに追加する

[React は HTML ページにすぐに追加することができます。](/docs/add-react-to-a-website.html) 追加したら、徐々に全体に反映させていくか、数量のダイナミックなウィジェットに留めるかはあなたの自由です。

### 新規 React アプリの作成

新しく React のプロジェクトを始めたい場合でも、まずは[シンプルな HTML ページに script タグを追加](/docs/add-react-to-a-website.html)するのがおすすめです。数分でセットアップできます！

アプリが成長するにつれて、より統合されたセットアップを行うことを考慮していきましょう。
大きいアプリの為には我々が勧める [様々なJavaScript を用いたツールチェイン](/docs/create-a-new-react-app.html)が存在します。
それぞれ少ない設定、もしくは設定要らずでリッチな React のエコシステムを活用していくことができます。

## React を学ぶ

People come to React from different backgrounds and with different learning styles. Whether you prefer a more theoretical or a practical approach, we hope you'll find this section helpful.

* If you prefer to **learn by doing**, start with our [practical tutorial](/tutorial/tutorial.html).
* If you prefer to **learn concepts step by step**, start with our [guide to main concepts](/docs/hello-world.html).

Like any unfamiliar technology, React does have a learning curve. With practice and some patience, you *will* get the hang of it.

### First Examples

The [React homepage](/) contains a few small React examples with a live editor. Even if you don't know anything about React yet, try changing their code and see how it affects the result.

### React for Beginners

If you feel that the React documentation goes at a faster pace than you're comfortable with, check out [this overview of React by Tania Rascia](https://www.taniarascia.com/getting-started-with-react/). It introduces the most important React concepts in a detailed, beginner-friendly way. Once you're done, give the documentation another try!

### React for Designers

If you're coming from a design background, [these resources](http://reactfordesigners.com/) are a great place to get started.

### JavaScript Resources

The React documentation assumes some familiarity with programming in the JavaScript language. You don't have to be an expert, but it's harder to learn both React and JavaScript at the same time.

We recommend going through [this JavaScript overview](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) to check your knowledge level. It will take you between 30 minutes and an hour but you will feel more confident learning React.

>Tip
>
>Whenever you get confused by something in JavaScript, [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and [javascript.info](http://javascript.info/) are great websites to check. There are also [community support forums](/community/support.html) where you can ask for help.

### Practical Tutorial

If you prefer to **learn by doing,** check out our [practical tutorial](/tutorial/tutorial.html). In this tutorial, we build a tic-tac-toe game in React. You might be tempted to skip it because you're not building games -- but give it a chance. The techniques you'll learn in the tutorial are fundamental to building *any* React apps, and mastering it will give you a much deeper understanding.

### Step-by-Step Guide

If you prefer to **learn concepts step by step,** our [guide to main concepts](/docs/hello-world.html) is the best place to start. Every next chapter in it builds on the knowledge introduced in the previous chapters so you won't miss anything as you go along.

### Thinking in React

Many React users credit reading [Thinking in React](/docs/thinking-in-react.html) as the moment React finally "clicked" for them. It's probably the oldest React walkthrough but it's still just as relevant.

### Recommended Courses

Sometimes people find third-party books and video courses more helpful than the official documentation. We maintain [a list of commonly recommended resources](/community/courses.html), some of which are free.

### Advanced Concepts

Once you're comfortable with the [main concepts](#main-concepts) and played with React a little bit, you might be interested in more advanced topics. This section will introduce you to the powerful, but less commonly used React features like [context](/docs/context.html) and [refs](/docs/refs-and-the-dom.html).

### API Reference

This documentation section is useful when you want to learn more details about a particular React API. For example, [`React.Component` API reference](/docs/react-component.html) can provide you with details on how `setState()` works, and what different lifecycle methods are useful for.

### Glossary and FAQ

The [glossary](/docs/glossary.html) contains an overview of the most common terms you'll see in the React documentation. There is also a FAQ section dedicated to short questions and answers about common topics, including [making AJAX requests](/docs/faq-ajax.html), [component state](/docs/faq-state.html), and [file structure](/docs/faq-structure.html).

## Staying Informed

The [React blog](/blog/) is the official source for the updates from the React team. Anything important, including release notes or deprecation notices, will be posted there first.

You can also follow the [@reactjs account](https://twitter.com/reactjs) on Twitter, but you won't miss anything essential if you only read the blog.

Not every React release deserves its own blog post, but you can find a detailed changelog for every release [in the `CHANGELOG.md` file in the React repository](https://github.com/facebook/react/blob/master/CHANGELOG.md), as well as on the [Releases](https://github.com/facebook/react) page.

## Versioned Documentation

This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation [on a separate page](/versions). Note that documentation for past versions is snapshotted at the time of the release, and isn't being continuously updated.

## Something Missing?

If something is missing in the documentation or if you found some part confusing, please [file an issue for the documentation repository](https://github.com/reactjs/reactjs.org/issues/new) with your suggestions for improvement, or tweet at the [@reactjs account](https://twitter.com/reactjs). We love hearing from you!
