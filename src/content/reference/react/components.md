---
title: "組み込みの React コンポーネント"
---

<Intro>

React は、JSX で使用できるいくつかの組み込みコンポーネントを公開しています。

</Intro>

---

## 組み込みコンポーネント {/*built-in-components*/}

* [`<Fragment>`](/reference/react/Fragment) を使い、複数の JSX ノードをまとめることができます。別の書き方として `<>...</>` があります。
* [`<Profiler>`](/reference/react/Profiler) を使い、React ツリーのレンダーパフォーマンスをプログラム上で測定することができます。
* [`<Suspense>`](/reference/react/Suspense) を使い、子コンポーネントがロードされる間、フォールバックを表示することができます。
* [`<StrictMode>`](/reference/react/StrictMode) を使い、バグを早期に見つけるための追加の開発環境専用チェックを有効化します。

---

## 自分自身のコンポーネント {/*your-own-components*/}

JavaScript 関数として[自分自身のコンポーネントを定義](/learn/your-first-component)することもできます。
