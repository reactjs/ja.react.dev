---
id: rendering-elements
title: 要素のレンダー
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

要素とは React アプリケーションの最小単位の構成ブロックです。

要素は画面上に表示したいものの説明書きです：

```js
const element = <h1>Hello, world</h1>;
```

ブラウザの DOM 要素とは異なり、React 要素はプレーンなオブジェクトであり、安価に作成できます。React DOM が React 要素に合致するように DOM を更新する作業を担当します。

>**補足:**
>
>要素のことを、より広く知られている概念である "コンポーネント" と混同する人もいるかもしれません。コンポーネントについては[次の章](/docs/components-and-props.html)で説明します。要素とはコンポーネントを "構成する" ものです。次に進む前にこの章を読んでいくことをお勧めします。

## 要素を DOM として描画する {#rendering-an-element-into-the-dom}

HTML ファイルの中に `<div>` 要素があったとしましょう：

```html
<div id="root"></div>
```

この中にあるもの全てが React DOM によって管理されることになるので、"ルート" DOM ノードと呼ぶことにしましょう。

React だけで構築されたアプリケーションは、通常ルート DOM ノードをひとつだけ持ちます。既存のアプリに React を統合しようとしている場合は、独立したルート DOM ノードを好きなだけ持つことができます。

<<<<<<< HEAD
React 要素をルート DOM ノードにレンダリングするには、その 2 つを `ReactDOM.render()` に渡します：
=======
To render a React element into a root DOM node, pass both to [`ReactDOM.render()`](/docs/react-dom.html#render):
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

このコードはページに "Hello, world" を表示します。

## レンダリングされた要素の更新 {#updating-the-rendered-element}

React 要素は[イミュータブル](https://en.wikipedia.org/wiki/Immutable_object)です。一度要素を作成すると、その子要素もしくは属性を変更することはできません。要素は映画の中のひとつのフレームのようなものであり、それは特定のある時点の UI を表します。

<<<<<<< HEAD
ここまでで分かる通り、UI を更新する唯一の方法は、新しい要素を作成して `ReactDOM.render()` に渡すことです。
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to [`ReactDOM.render()`](/docs/react-dom.html#render).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

以下の秒刻みで動く時計の例について考えます：

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

<<<<<<< HEAD
上記のコードでは [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) のコールバックから `ReactDOM.render()` を毎秒呼び出しています。
=======
It calls [`ReactDOM.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

>**補足:**
>
<<<<<<< HEAD
>実際には大抵の React アプリケーションは `ReactDOM.render()` を一度しか呼び出しません。次の章では上記のようなコードをどのように[ステート付きコンポーネント](/docs/state-and-lifecycle.html)へとカプセル化するのかを学びます。
=======
>In practice, most React apps only call [`ReactDOM.render()`](/docs/react-dom.html#render) once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
>
>トピックはお互いを基礎として構成されているため、読み飛ばさないことをお勧めします。

## React は必要な箇所のみを更新する {#react-only-updates-whats-necessary}

React DOM は要素とその子要素を以前のものと比較し、DOM を望ましい状態へと変えるのに必要なだけの DOM の更新を行います。

このことは、[最後の例](codepen://rendering-elements/update-rendered-element)をブラウザツールで調査すれば確認できます：

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

毎秒ごとに UI ツリー全体を表す要素を作成しているにも関わらず、内容が変更されたテキストノードのみが React DOM により更新されます。

<<<<<<< HEAD
私達の経験上、時間の経過によりどのように UI が変更されるかを考えるよりも、任意の時点において UI がどのように見えるべきかを考えることで、あらゆる類のバグを排除することができます。
=======
In our experience, thinking about how the UI should look at any given moment, rather than how to change it over time, eliminates a whole class of bugs.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
