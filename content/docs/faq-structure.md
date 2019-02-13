---
id: faq-structure
title: ファイル構成
permalink: docs/faq-structure.html
layout: docs
category: FAQ
---

### お勧めのReact プロジェクトの構成は？ {#is-there-a-recommended-way-to-structure-react-projects}

React doesn't have opinions on how you put files into folders. That said there are a few common approaches popular in the ecosystem you may want to consider.

#### 機能ないしルート別にグループ化する {#grouping-by-features-or-routes}

プロジェクトを構成する一般的な方法の一つは、CSS や JS やテストをまとめて機能ないしルート別のフォルダにグループ化するというものです。

```
common/
  Avatar.js
  Avatar.css
  APIUtils.js
  APIUtils.test.js
feed/
  index.js
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  FeedAPI.js
profile/
  index.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
  ProfileAPI.js
```

ここでの「機能」の定義は普遍的なものではないので、粒度については自分で決める必要があります。
トップレベルのフォルダの名前が思いつかない場合は、ユーザに「この製品の主な構成部品は何か」と聞いてみて、ユーザの思考モデルを青写真として使いましょう。

#### ファイルタイプ別にグループ化する {#grouping-by-file-type}

Another popular way to structure projects is to group similar files together, for example:

```
api/
  APIUtils.js
  APIUtils.test.js
  ProfileAPI.js
  UserAPI.js
components/
  Avatar.js
  Avatar.css
  Feed.js
  Feed.css
  FeedStory.js
  FeedStory.test.js
  Profile.js
  ProfileHeader.js
  ProfileHeader.css
```

Some people also prefer to go further, and separate components into different folders depending on their role in the application. For example, [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) is a design methodology built on this principle. Remember that it's often more productive to treat such methodologies as helpful examples rather than strict rules to follow.

#### ネストのしすぎを避ける {#avoid-too-much-nesting}

深くネストされた JavaScript プロジェクトには様々な痛みを伴います。
相対パスを使ったインポートが面倒になりますし、ファイルが移動したときにそれらを更新するのも大変です。
よほど強い理由があって深いファルダ構造を使う場合を除き、1つのプロジェクト内では3段か4段程度のフォルダ階層に留めることを考慮してください。
もちろんこれはお勧めにすぎず、あなたのプロジェクトには当てはまらないかもｓりえません。

#### 考えすぎない {#dont-overthink-it}

まだプロジェクトを始めたばかりなら、ファイル構成を決めるのに[5分以上かけない](https://en.wikipedia.org/wiki/Analysis_paralysis)ようにしましょう。
上述の方法の1つを選ぶか、自分自身の方法を考えて、コードを書き始めましょう！
おそらく実際のコードをいくらか書けば、なんにせよ考え直したくなる可能性が高いでしょう。

もしも完全に詰まった場合は、すべて1フォルダに入れるところから始めましょう。
そのうち十分に数が増えれば、いくつかのファイルを分離したくなってくるでしょう。
そのころには、どのファイルを一緒に編集している頻度が高いのか、十分わかるようになっているでしょう。
一般的には、一緒に更新される可能性の高いファイルは互いに近い場所に配置するのが良いです。
この原則は、「コロケーション」と呼ばれます。

As projects grow larger, they often use a mix of both of the above approaches in practice. So choosing the "right" one in the beginning isn't very important.
