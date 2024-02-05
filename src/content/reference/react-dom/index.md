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

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## エントリポイント {/*entry-points*/}

`react-dom` パッケージは、2 つの追加のエントリポイントを提供します。

* [`react-dom/client`](/reference/react-dom/client) は、クライアント（ブラウザ内）で React コンポーネントをレンダーするための API を含んでいます。
* [`react-dom/server`](/reference/react-dom/server) は、サーバ上で React コンポーネントをレンダーするための API を含んでいます。

---

## 非推奨の API {/*deprecated-apis*/}

<Deprecated>

これらの API は、React の将来のメジャーバージョンで削除される予定です。

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) は、クラスコンポーネントのインスタンスに対応する最も近い DOM ノードを検索します。
* [`hydrate`](/reference/react-dom/hydrate) は、サーバの HTML から作成された DOM にツリーをマウントします。非推奨です。代わりに [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) を使用してください。
* [`render`](/reference/react-dom/render) は、DOM にツリーをマウントします。非推奨です。代わりに [`createRoot`](/reference/react-dom/client/createRoot) を使用してください。
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) は、DOM からツリーをアンマウントします。非推奨です。代わりに [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) を使用してください。

