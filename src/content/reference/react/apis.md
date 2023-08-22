---
title: "React の組み込み API"
---

<Intro>

[フック](/reference/react)や[コンポーネント](/reference/react/components)の他に、`react` パッケージはコンポーネントの定義に役立つ他の API も提供しています。このページでは、残りのモダンな React API をすべてリストアップしています。

</Intro>

---

* [`createContext`](/reference/react/createContext) を利用すると、子コンポーネントに対してコンテクストを定義および提供できます。[`useContext`](/reference/react/useContext) と一緒に使用されます。
* [`forwardRef`](/reference/react/forwardRef) を利用すると、コンポーネントの DOM ノードを ref として親に公開できます。[`useRef`](/reference/react/useRef) と一緒に使用されます。
* [`lazy`](/reference/react/lazy) を利用すると、コンポーネントのコードの読み込みを初回レンダーまで遅延することができます。
* [`memo`](/reference/react/memo) を利用すると、同じ props を持つコンポーネントの再レンダーをスキップできます。[`useMemo`](/reference/react/useMemo) や [`useCallback`](/reference/react/useCallback) と一緒に使用されます。
* [`startTransition`](/reference/react/startTransition) を使うと、state の更新を低緊急度 (non-urgent) としてマークできます。[`useTransition`](/reference/react/useTransition) に似ています。
