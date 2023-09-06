---
title: クライアント用 React DOM API
---

<Intro>

`react-dom/client` の API を用いて、クライアント（ブラウザ）上で React コンポーネントをレンダーすることができます。これらの API は通常、React ツリーを初期化するためにアプリのトップレベルで使用されます。[フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)はこれらをあなたの代わりに呼び出すことがあります。ほとんどのコンポーネントは、これらをインポートしたり使用したりする必要はありません。

</Intro>

---

## クライアント API {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) は、ブラウザの DOM ノード内に React コンポーネントを表示するためのルートを作成します。
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) は、[`react-dom/server`](/reference/react-dom/server) によって事前生成した HTML コンテンツが含まれるブラウザ DOM ノード内に、React コンポーネントを表示します。

---

## ブラウザサポート {/*browser-support*/}

React は、Internet Explorer 9 以上を含むすべての一般的なブラウザをサポートしています。IE 9 や IE 10 などの古いブラウザにはいくつかのポリフィルが必要です。