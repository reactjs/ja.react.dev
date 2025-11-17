---
title: React DOM API
---

<Intro>

`react-dom` パッケージには、ウェブアプリケーション（ブラウザの DOM 環境で動作する）でのみサポートされるメソッドが含まれています。これらは React Native ではサポートされません。

</Intro>

---

## API {/*apis*/}

これらの API はインポートしてコンポーネントで使用できます。これらはあまり使用されません。

* [`createPortal`](/reference/react-dom/createPortal) は、DOM ツリーの別の場所に子コンポーネントをレンダーできるようにします。
* [`flushSync`](/reference/react-dom/flushSync) は、React に state の更新を強制的にフラッシュさせ、DOM を同期的に更新させます。

## リソースプリロード関連の API {/*resource-preloading-apis*/}

これらの API は、例えばスクリプト、スタイルシート、フォントなどのリソースを必要とする別のページに実際に遷移する前に、それらのリソースが必要となることが判明した時点で即座にプリロードを開始することで、アプリを高速化するためのものです。

[React ベースのフレームワーク](/learn/creating-a-react-app)は、多くの場合リソースの読み込みを自動で処理してくれるため、この API を直接呼び出す必要はないかもしれません。詳細はフレームワークのドキュメントを参照してください。

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) は、接続予定の DNS ドメインネームに対応する IP アドレスをプリフェッチします。
* [`preconnect`](/reference/react-dom/preconnect) は、具体的なリソースが不明な場合でも事前にリクエスト先のサーバへの接続を確立します。
* [`preload`](/reference/react-dom/preload) は、使用予定のスタイルシート、フォント、画像や外部スクリプトのフェッチを行います。
* [`preloadModule`](/reference/react-dom/preloadModule) は、使用予定の ESM モジュールのフェッチを行います。
* [`preinit`](/reference/react-dom/preinit) は、外部スクリプトのフェッチと実行、またはスタイルシートのフェッチと挿入を行います。
* [`preinitModule`](/reference/react-dom/preinitModule) は、ESM モジュールのフェッチと実行を行います。

---

## エントリポイント {/*entry-points*/}

`react-dom` パッケージは、2 つの追加のエントリポイントを提供します。

* [`react-dom/client`](/reference/react-dom/client) は、クライアント（ブラウザ内）で React コンポーネントをレンダーするための API を含んでいます。
* [`react-dom/server`](/reference/react-dom/server) は、サーバ上で React コンポーネントをレンダーするための API を含んでいます。

---

## 削除済み API {/*removed-apis*/}

以下の API は React 19 で削除されています。

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): [代替手段](https://18.react.dev/reference/react-dom/findDOMNode#alternatives)を参照してください。
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): 代わりに [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を使用してください。
* [`render`](https://18.react.dev/reference/react-dom/render): 代わりに [`createRoot`](/reference/react-dom/client/createRoot) を使用してください。
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): 代わりに [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) を使用してください。
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): 代わりに [`react-dom/server`](/reference/react-dom/server) の API を使用してください。
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): 代わりに [`react-dom/server`](/reference/react-dom/server) の API を使用してください。
