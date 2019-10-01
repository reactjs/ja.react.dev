---
id: testing
title: テスト概要
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

React コンポーネントは他の JavaScript のコードと同じようにテストできます。

React コンポーネントをテストするのにはいくつか方法がありますが、大きく 2 つのカテゴリに分けられます。

* **コンポーネントツリーのレンダリング** をシンプルなテスト環境で行い、その結果を検証する
* **アプリケーション全体の動作** をブラウザ同等の環境で検証する（end-to-end テストとして知られる）

このセクションでは、最初のケースにおけるテスト戦略にフォーカスします。end-to-end テストが重要な機能のリグレッションを防ぐのに有効である一方で、そのようなテストは React コンポーネントとは特に関係なく、このセクションのスコープ外です。

### トレードオフ {#tradeoffs}


テストツールを選定する時、いくつかのトレードオフを考慮することは価値があります。

* **実行速度 vs 環境の現実度：** 変更を加えてから結果を見るまでのフィードバックが早いツールは、ブラウザでの動作を正確に模倣しません。一方実際のブラウザ環境を使うようなツールは、イテレーションの速度が落ちる上 CI サーバーでは壊れやすいです。
* **モックの粒度** コンポーネントのテストでは、ユニットテストとインテグレーションテストの区別は曖昧です。フォームをテストする時、そのテストはフォーム内のボタンもテストすべきでしょうか。それともボタンコンポーネント自体が自身のテストを持つべきでしょうか。ボタンのリファクタリングはフォームのテストを壊さないべきでしょうか。

チームやプロダクトに応じて、答えは違ってきます。

### 推奨ツール {#tools}

**[Jest](https://facebook.github.io/jest/)** は [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface) を通じて DOM にアクセスできる JavaScript のテストランナーです。jsdom はブラウザの模倣環境にすぎませんが、React コンポーネントをテストするのには十分なことが多いです。Jest は [モジュール](/docs/testing-environments.html#mocking-modules) や [タイマー](/docs/testing-environments.html#mocking-timers) のモックのような機能を組み合わせて、高速にイテレーションを回すことができ、コードをどう実行するかをよりコントロールできます。

**[React Testing Library](https://testing-library.com/react)** は実装の詳細に依存せずに React コンポーネントをテストすることができるツールセットです。このアプローチはリファクタリングを容易にし、さらにアクセスビリティのベスト・プラクティスへと手向けてくれます。コンポーネントを children 抜きに「浅く」レンダリングする方法は提供していませんが、Jest のようなテストランナーで [モック](/docs/testing-recipes.html#mocking-modules) することで可能です。

### より詳しく {#learn-more}

このセクションは 2 つのページに分かれます：

- [レシピ集](/docs/testing-recipes.html)： React コンポーネントのテストを書く際の一般的なパターン集
- [Environments](/docs/testing-environments.html)： React コンポーネントのためのテスト環境をセットアップする際に考えること
