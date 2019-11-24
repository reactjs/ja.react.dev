---
id: concurrent-mode-intro
title: 並列モードの導入（実験的機能）
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
---

>警告：
>
> このページでは**安定リリースで[まだ利用できない](/docs/concurrent-mode-adoption.html)実験的機能**を説明しています。本番のアプリケーションで React の実験的ビルドを利用しないでください。これらの機能は React の一部となる前に警告なく大幅に変更される可能性があります。
>
> このドキュメントは興味のある読者やアーリーアダプター向けのものです。React が初めての方はこれらの機能を気にしないで構いません -- 今すぐに学ぶ必要はありません。

このページでは並列モードの理論的な概要について説明します。**より実践的な導入方法についてはこれ以降のセクションをお読みください**：

* [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html) では React コンポーネントでデータを取得するための新たな仕組みについて解説します。
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) では並列モードとサスペンスにより可能となるいくつかの UI パターンを提示します。
* [Adopting Concurrent Mode](/docs/concurrent-mode-adoption.html) ではあなたのプロジェクトで並列モードを試す方法について説明します。
* [Concurrent Mode API Reference](/docs/concurrent-mode-reference.html) では実験ビルドで利用可能な新しい API について述べます。

## 並列モードとは？ {#what-is-concurrent-mode}

並列モードは、React アプリケーションをレスポンシブに保ち、デバイスの能力やネットワークの速度にうまく適応できるようにするための新機能群です。

これらの機能はまだ実験的なものであり変更される可能性があります。まだ安定リリースには入っていませんが、実験的ビルドで試すことができます。

## ブロッキングレンダリングと中断可能レンダリング {#blocking-vs-interruptible-rendering}

**並列モードの説明のために、バージョンコントロールを使った例え話をします。**チームで働いていれば、Git のようなバージョンコントロールを使ってブランチで作業していることでしょう。ブランチの準備が完了したら、マスターブランチに作業をマージして、他の人が pull できるようにします。

バージョンコントロールが存在するより前は、開発のワークフローはとても異なったものでした。ブランチという概念はありませんでした。何かのファイルを編集したいと思ったら、作業が終わるまでそのファイルに触れないよう全員に伝える必要がありました。その人と同時には作業を始めることすらできませんでした。文字通り**ブロック**されていたのです。

これが React も含む UI ライブラリの現在の動作のしかたです。新しい DOM ノード作成やコンポーネント内部のコードの実行も含む更新のレンダーを一度始めたら、それを中断することはできません。このアプローチのことを "ブロッキングレンダリング (blocking rendering)" と呼ぶことにします。

並列モードにおいては、レンダーはブロッキングではありません。中断可能 (interruptible) です。これによりユーザ体験は向上します。またこれまで不可能だった新たな機能が実現可能になります。後で[こちら](/docs/concurrent-mode-suspense.html)や[こちら](/docs/concurrent-mode-patterns.html)の章で具体的な例を見る前に、新たな機能について高所からの概観を見てみましょう。

### 中断可能なレンダリング {#interruptible-rendering}

フィルタ可能な商品リストを考えてみましょう。リストのフィルタ欄にタイピングしようとして、一打ごとに引っかかりを感じたことはないでしょうか。商品リストを更新するにあたって、新しい DOM ノードを作成してレイアウトを行う、といった幾つかの作業は必須のものですが、それらを**いつ**、そして**どのように**行うのかが重要です。

引っかかりを回避するのによくある手段のひとつは入力のデバウンス (debounce) です。デバウンスを行うと、ユーザがタイピングを止めた**後に**初めてリストの更新を行います。しかしながら、タイプしている間は UI が更新されないというのはもどかしいものです。代わりに、入力をスロットル (throttle) して更新が一定以上の頻度で起きないようにすることもできます。しかし低パワーのデバイスではやはり引っかかりを感じることになってしまうでしょう。デバウンスもスロットルも理想的なユーザ体験にはならないのです。

引っかかりが発生する理由はシンプルです。レンダーが始まってしまったら中断できないからです。このため、ブラウザがキーの押下に応じてテキストを更新できなくなってしまうのです。ベンチマーク上で（React のような）UI ライブラリの性能がどれだけ良く見えようとも、それがブロッキングレンダリングを使用している限り、あなたのコンポーネントがやっている作業の一定の割合が引っかかりを発生させます。そして簡単な修正方法はしばしば存在しません。

**並列モードは、レンダーを中断可能にすることで、この本質的な制限を修正します。**つまり、ユーザが別のキーを押下した時に、ブラウザによるテキストの入力フィールドの更新を、React はブロックする必要がない、ということです。代わりに、ブラウザに入力フィールドの描画をさせつつ、**メモリ内**で更新後のリストのレンダーを継続することができます。レンダーが終わったところで、React は DOM を更新し、変更が画面に反映されます。

概念的には、これは React がすべての更新を "ブランチ内で" 行っているようなものと考えることができます。ブランチでの作業内容を破棄したりブランチ間を移動したりできるのと全く同様に、並列モードにおける React は、現在進行中の更新を中断してより重要な作業を行って、前にやっていた作業に戻ることができるのです。この技術はビデオゲームにおける[ダブルバッファリング](https://wiki.osdev.org/Double_Buffering)と似ているとも感じるかもしれません。

並列モードの技術を使うことで、UI でのデバウンスやスロットルの必要性が下がります。レンダーが中断可能なので、引っかかりを避けるために React は意図的にわざわざ作業を*遅らせる*必要がないのです。即座にレンダーを開始して、必要に応じて中断することで、アプリケーションをレスポンシブに保つことができます。

### 計画的なローディングシーケンス {#intentional-loading-sequences}

並列モードとは React が "ブランチで" 作業するようなものだと言いました。ブランチは短期的な修正のためだけではなく、長期的な機能の実装の際にも有用ですね。ある機能のために作業をしていて、master にマージするのに「十分良い」状態になるまで何週間もかかる、ということがありえます。バージョンコントロールの比喩は、この部分でもレンダーに当てはまります。

例えばアプリケーションの 2 つの画面を遷移しているところを考えてください。時に、新しい画面ではユーザに表示するだけの「十分良い」コードやデータがまだロードされていない、ということがあります。空のスクリーンや大きなスピナーに遷移することは不快なユーザ体験につながります。一方で必要なコードやデータは取得するのにそれほど長い時間はかからないことも多いです。**もし React が旧画面にもう少しだけ留まることで、新画面を表示する前の「望ましくないロード中状態」をスキップできたら良いと思いませんか？**

現在でもこれは可能ですが、うまく統合して行うのは困難です。並列モードでは、この機能はビルトインされています。React は新しい画面の準備をメモリ内で（つまりこれまでの比喩で言うところの「新しいブランチで」）まず行います。従って、React は後からより多くの読み込みができるよう、DOM を更新する前に待つことができます。並列モードでは、完全に操作可能な旧画面を表示したままでローディングのインジケータをインライン表示するよう React に伝えることができます。新しい画面の準備が完了したら、React が自動的にそちらを表示します。

### Concurrency {#concurrency}

上記の 2 つの例をまとめて、並列モードがこれらをどのように統合するのか見てみましょう。**並列モードでは、React は複数の状態の更新を*同時に*行うことができます**。ブランチによって複数のチームメンバーが同時に作業できるのと同様です。

* CPU が律速段階の更新（DOM ノードの作成やコンポーネント内のコードの実行など）の場合、並列化とはより緊急性の高い更新が既に始まった他のレンダーを中断できるということを意味します。
* IO が律速段階の更新（ネットワークからのコードやデータの取得など）の場合、並列化とは全データが到着する前に React がメモリ内でレンダーを始められ、目障りな空のロード中状態を表示しないで済むということを意味します。

重要なことは、React の*使い方*は変わらないということです。コンポーネント、props、state といったコンセプトは本質的に同様に動作します。画面を更新したいと思ったら state を更新します。

React は更新の「緊急性」を判断するための推測を行い、また数行のコードを使ってそれを調整することがでるので、すべてのユーザ操作に対して望ましいユーザ体験を実現することができます。

## 研究からプロダクトへ {#putting-research-into-production}

並列モードの機能には共通のテーマがあります。**目標は、人間・コンピュータ間の相互作用に関する研究から得られた知見を現実の UI に取り込むことです。**

例えば、研究によれば、画面間遷移の際にローディング中という状態を多く表示しすぎることで、遷移が**遅く**感じられるようになります。これが並列モードにおいて目障りで頻繁すぎる更新を避けるためにロード中状態を固定の「スケジュール」（遅延）を用いて表示する理由です。

同様に、研究によって、ホバーやテキスト入力といった操作は非常に短い時間で処理される必要があり、一方でクリックやページ遷移は少し時間がかかっても遅いと感じられずに済む、ということが分かっています。並列モードが内部で使用している様々な「優先度」は、人間の知覚に関する研究で使われる操作カテゴリに概ね対応しています。

ユーザ体験を非常に重視するチームであれば、しばしば似たような問題をその場限りの手段で解決することでしょう。しかしそのような解決手段はメンテナンスが困難で、滅多に長続きしません。並列モードにおける我々の目的は、UI 研究の知見を抽象化そのものに組み入れて、それを使うための理想的な手段を提供することです。UI ライブラリとして、React はそれができる良い立場にあります。

## 次のステップ {#next-steps}

これで並列モードが一体何物なのかについて分かりました！

以降のページでは、具体的なトピックに関して詳細を学んでいきます。

* [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html) では React コンポーネントでデータを取得するための新たな仕組みについて解説します。
* [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html) では並列モードとサスペンスにより可能となるいくつかの UI パターンを提示します。
* [Adopting Concurrent Mode](/docs/concurrent-mode-adoption.html) ではあなたのプロジェクトで並列モードを試す方法について説明します。
* [Concurrent Mode API Reference](/docs/concurrent-mode-reference.html) では実験的ビルドで利用可能な新しい API について述べます。