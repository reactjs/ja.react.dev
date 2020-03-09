---
id: concurrent-mode-adoption
title: 並列モードの利用開始 (実験的機能)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>警告:
>
> このページでは**安定リリースで[まだ利用できない](/docs/concurrent-mode-adoption.html)実験的機能**を説明しています。本番のアプリケーションで React の実験的ビルドを利用しないでください。これらの機能は React の一部となる前に警告なく大幅に変更される可能性があります。
>
> このドキュメントは興味のある読者やアーリーアダプター向けのものです。**React が初めての方はこれらの機能を気にしないで構いません** -- 今すぐに学ぶ必要はありません。

</div>

- [インストール](#installation)
  - [この実験的リリースは誰のためのものか？](#who-is-this-experimental-release-for)
  - [並列モードの有効化](#enabling-concurrent-mode)
- [期待されること](#what-to-expect)
  - [移行ステップ：ブロッキングモード](#migration-step-blocking-mode)
  - [何故こんなにモードがあるのか？](#why-so-many-modes)
  - [機能の比較](#feature-comparison)

## インストール {#installation}

並列モードは React の[実験的ビルド (experimental build)](/blog/2019/10/22/react-release-channels.html#experimental-channel) でのみ利用可能です。インストールするには以下を実行してください：

```
npm install react@experimental react-dom@experimental
```

**実験的ビルドにはセマンティック・バージョニングに準拠するという保証がありません。**  
API は `@experimental` のどのリリースにおいても追加・変更・削除される可能性があります。

**実験的ビルドは破壊的変更が頻繁に起こります。**

これらのビルドを個人的プロジェクトやブランチで試すのは構いませんが、本番環境で実行することは推奨しません。Facebook では実際に本番環境で実行しているのですが、それは何かが壊れた時に直せるよう我々もそこにいるからです。警告はしましたよ！

### この実験的リリースは誰のためのものか？ {#who-is-this-experimental-release-for}

このリリースは主にアーリーアダプター、ライブラリ作者、その他興味がある人向けです。

我々はこのコードを本番環境で使っています（我々のところでは動いています）が、まだいくつかのバグや欠けている機能、ドキュメントとの齟齬があります。将来の公式安定リリースに向けてよりよい準備ができるよう、並列モードでどこが壊れるのかについてもっと意見を集めたいと思っています。

### 並列モードの有効化 {#enabling-concurrent-mode}

<<<<<<< HEAD
通常、React に機能を加える際は、それをすぐ使い始めることができます。フラグメント、コンテクスト、そしてフックですら、そのような機能の例です。既存のコードに何ら変更を加えずに新しいコードで使うことができます。
=======
Normally, when we add features to React, you can start using them immediately. Fragments, Context, and even Hooks are examples of such features. You can use them in new code without making any changes to the existing code.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

並列モードは違います。React がどのように動作するのかについて意味上の変更が行われています。そうしなければ並列モードで有効になる[新機能](/docs/concurrent-mode-patterns.html)は*実現不可能だった*でしょう。これが、新機能がひとつずつ分離してリリースされるのではなく、新しい「モード」としてグループ化されている理由です。

サブツリーごとの単位で並列モードを使い始めることはできません。代わりに、オプトインするには、現在 `ReactDOM.render()` を呼んでいる場所で行う必要があります。

**これにより並列モードが `<App />` のツリー全体で有効化されます：**

```js
import ReactDOM from 'react-dom';

// If you previously had:
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// You can opt into Concurrent Mode by writing:

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);
```

> 補足:
>
> `createRoot` のような並列モードの API は React の実験的ビルドにのみ存在しています。

並列モードでは、"unsafe" であると[以前にマークされている](/blog/2018/03/27/update-on-async-rendering.html)ライフサイクルメソッドは*本当に*安全ではなくなっており、現行の React よりもさらに多くのバグを引き起こします。あなたのアプリケーションが [Strict Mode](/docs/strict-mode.html) 互換になっていない限り、並列モードを試すことは勧められません。

## 期待されること {#what-to-expect}

もし大きな既存のアプリケーションがあるか、あなたのアプリケーションが多くのサードパーティのパッケージに依存している場合、並列モードがすぐに使えるとは期待しないでください。**例えば、Facebook では新ウェブサイトで並列モードを使っていますが、旧サイトで有効化する予定はありません。**これは我々の旧サイトでは依然 unsafe なライフライクルメソッドや互換性のないサードパーティのライブラリ、並列モードではうまく動かないパターンが本番コードで使われているからです。

我々の経験上、理想的な React のパターンを利用し、外部の状態管理ソリューションに依存していないコードが、並列モードで最も動作させやすくなっています。向こう数週で、我々が見てきたよくある問題やそれらの解決方法について個別に説明していく予定です。

### 移行ステップ：ブロッキングモード {#migration-step-blocking-mode}

古いコードベースにとって、並列モードはあまりにかけ離れたステップになっているかもしれません。このため、実験用 React ビルドは新たな "ブロッキングモード (Blocking Mode)" を提供しています。これは `createRoot` を `createBlockingRoot` で置き換えることで試すことができます。これは並列モードの機能の*小さなサブセット*のみを提供しますが、現行の React の動作に近いため、移行用のステップとして利用することができます。

まとめると：

* **レガシーモード：**`ReactDOM.render(<App />, rootNode)`. 現行の React アプリケーションが使っているものです。予見可能な範囲でレガシーモードを削除する予定はありません。しかし新機能をサポートすることはできません。
* **ブロッキングモード：**`ReactDOM.createBlockingRoot(rootNode).render(<App />)`. 現在は実験用です。並列モードの機能の一部を使いたい場合の移行用ステップとして使われることが意図されています。
* **並列モード：**`ReactDOM.createRoot(rootNode).render(<App />)`. 現在は実験用です。将来的に安定した後でデフォルトの React モードになることが意図されています。新機能の*すべて*が有効になります。

### 何故こんなにモードがあるのか？ {#why-so-many-modes}

[段階的な移行方法](/docs/faq-versioning.html#commitment-to-stability)を提供することが望ましいと考えているからです -- さもなくば React の成長は止まり、使われないものになってしまうでしょう。

現実的には、現在レガシーモードを利用しているほとんどのアプリケーションは、（並列モードは難しくとも）少なくともブロッキングモードには移行可能であると期待しています。このような分断化は、すべてのモードをサポートしようとするライブラリにとって短期的には煩わしいものかもしれません。しかし、エコシステムを徐々にレガシーモードから移行させることによって、[レイアウトを読み出す際の混乱を招くサスペンスの挙動](https://github.com/facebook/react/issues/14536)や[一貫性のあるバッチ保証の欠如](https://github.com/facebook/react/issues/15080)といった、著名ライブラリに影響する問題を*解決する*ことにもなります。レガシーモードではコードの意味を変えずには修正不可能だったが、ブロッキングモードや並列モードには存在しないというバグが数多くあります。

ブロッキングモードは並列モードが「うまく劣化した」バージョンであると考えることができます。**そのため、長期的には移行が完了でき、異なるモードについて考える必要が全くなくなるはずです。**しかし今のところは、モードの存在は移行のための重要な戦略です。これにより全員がマイグレーションに価値があるかを決められるようになり、個々のペースでアップグレードが行えるようになります。

### 機能の比較 {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |レガシーモード  |ブロッキングモード  |並列モード  |
|---  |---  |---  |---  |
|[文字列 Ref](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[レガシー版コンテクスト](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[優先度ベースのレンダー](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[中断可能なプリレンダリング](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[「電車式」サスペンス開放](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: レガシーモードには React で管理されるイベントの自動的なバッチ処理がありますが、単一のブラウザタスクに制限されています。非 React のイベントは `unstable_batchedUpdates` を使ってオプトインする必要があります。ブロッキングモードと並列モードではすべての `setState` は自動でバッチ化されます。

\*\*: 開発モードでは警告を表示します。
