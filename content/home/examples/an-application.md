---
title: アプリケーションの実例
order: 2
domid: todos-example
---

`props` and `state` を組み合わせることで、ちょっとした Todo アプリケーション を作ることができます。
次の例では `state` を用いて、現在の Todo リストのアイテムの状態を追跡しています。
それからユーザーが入力したテキストに関しても `state` で管理しています。
イベントハンドラは、それが書かれた要素内部にレンダーされるように一見思われますが、
実際にはこれらのハンドラは集められて、イベントデリゲーションを用いて実装されます。

Using `props` and `state`, 
we can put together a small Todo application. 
This example uses `state` to track the current list of items 
as well as the text that the user has entered. 
Although event handlers appear to be rendered inline, 
they will be collected and implemented using event delegation.
