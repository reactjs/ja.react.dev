---
title: クライアント用 React DOM API
---

<Intro>

<<<<<<< HEAD
`react-dom/client` の API を用いて、クライアント（ブラウザ）上で React コンポーネントをレンダーすることができます。これらの API は通常、React ツリーを初期化するためにアプリのトップレベルで使用されます。[フレームワーク](/learn/start-a-new-react-project#full-stack-frameworks)はこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。
=======
The `react-dom/client` APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A [framework](/learn/creating-a-react-app#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> 2534424ec6c433cc2c811d5a0bd5a65b75efa5f0

</Intro>

---

## クライアント API {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) は、ブラウザの DOM ノード内に React コンポーネントを表示するためのルートを作成します。
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) は、[`react-dom/server`](/reference/react-dom/server) によって事前生成した HTML コンテンツが含まれるブラウザ DOM ノード内に、React コンポーネントを表示します。

---

## ブラウザサポート {/*browser-support*/}

React は、Internet Explorer 9 以上を含むすべての一般的なブラウザをサポートしています。IE 9 や IE 10 などの古いブラウザにはいくつかのポリフィルが必要です。