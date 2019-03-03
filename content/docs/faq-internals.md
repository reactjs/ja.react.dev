---
id: faq-internals
title: 仮想 DOM と内部処理
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### 仮想 DOM とは？ {#what-is-the-virtual-dom}

仮想 DOM (virtual DOM; VDOM) は、インメモリに保持された想像上のまたは「仮想の」UI 表現が、ReactDOM のようなライブラリによって「実際の」DOM と同期されるというプログラミング上の概念です。このプロセスは[差分検出処理 (reconciliation)](/docs/reconciliation.html)と呼ばれます。

このアプローチにより React の宣言型 API が可能になっています。あなたは UI をどのような状態にしたいのか React に伝え、React は必ず DOM をその状態と一致させます。これにより、React なしではアプリケーションを構築するために避けて通れない属性の操作やイベントハンドリング、および手動での DOM 更新が抽象化されます。

"仮想 DOM" は特定の技術というよりむしろ 1 つのパターンなので、時たま違う意味で使われることがあります。React の世界において "仮想 DOM" という用語は通常、ユーザインタフェースを表現するオブジェクトである [React 要素](/docs/rendering-elements.html) と結びつけて考えられます。React は一方で、コンポーネントツリーに関する追加情報を保持するため "ファイバー (fiber)" と呼ばれる内部オブジェクトも使用します。これらも React における "仮想 DOM" 実装の一部と見なすことができます。

### Shadow DOM は仮想 DOM と同じもの？ {#is-the-shadow-dom-the-same-as-the-virtual-dom}

いいえ、違います。Shadow DOM は、本来 web components において変数や CSS をスコープ化するために設計されたブラウザ技術です。仮想 DOM は JavaScript のライブラリによってブラウザ API の上に実装された概念です。

### 「React Fiber」とは？ {#what-is-react-fiber}

Fiber は React 16 の新しい差分検出処理エンジンです。その主な目的は仮想 DOM の逐次レンダーを可能にすることです。[さらに読む](https://github.com/acdlite/react-fiber-architecture)
