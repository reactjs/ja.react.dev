---
title: "組み込みの React コンポーネント"
---

<Intro>

React は、JSX で使用できるいくつかの組み込みコンポーネントを公開しています。

</Intro>

---

## 組み込みコンポーネント {/*built-in-components*/}

<<<<<<< HEAD
* [`<Fragment>`](/reference/react/Fragment) を使い、複数の JSX ノードをまとめることができます。別の書き方として `<>...</>` があります。
* [`<Profiler>`](/reference/react/Profiler) を使い、React ツリーのレンダーパフォーマンスをプログラム上で測定することができます。
* [`<Suspense>`](/reference/react/Suspense) を使い、子コンポーネントがロードされる間、フォールバックを表示することができます。
* [`<StrictMode>`](/reference/react/StrictMode) を使い、バグを早期に見つけるための追加の開発環境専用チェックを有効化します。
=======
* [`<Fragment>`](/reference/react/Fragment), alternatively written as `<>...</>`, lets you group multiple JSX nodes together.
* [`<Profiler>`](/reference/react/Profiler) lets you measure rendering performance of a React tree programmatically.
* [`<Suspense>`](/reference/react/Suspense) lets you display a fallback while the child components are loading.
* [`<StrictMode>`](/reference/react/StrictMode) enables extra development-only checks that help you find bugs early.
* [`<Activity>`](/reference/react/Activity) lets you hide and restore the UI and internal state of its children.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

---

## 自分自身のコンポーネント {/*your-own-components*/}

JavaScript 関数として[自分自身のコンポーネントを定義](/learn/your-first-component)することもできます。
