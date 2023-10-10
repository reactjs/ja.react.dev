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

