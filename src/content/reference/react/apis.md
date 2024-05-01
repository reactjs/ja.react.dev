---
title: "React の組み込み API"
---

<Intro>

[フック](/reference/react)や[コンポーネント](/reference/react/components)の他に、`react` パッケージはコンポーネントの定義に役立つ他の API も提供しています。このページでは、残りのモダンな React API をすべてリストアップしています。

</Intro>

---

<<<<<<< HEAD
* [`createContext`](/reference/react/createContext) を利用すると、子コンポーネントに対してコンテクストを定義および提供できます。[`useContext`](/reference/react/useContext) と一緒に使用されます。
* [`forwardRef`](/reference/react/forwardRef) を利用すると、コンポーネントの DOM ノードを ref として親に公開できます。[`useRef`](/reference/react/useRef) と一緒に使用されます。
* [`lazy`](/reference/react/lazy) を利用すると、コンポーネントのコードの読み込みを初回レンダーまで遅延することができます。
* [`memo`](/reference/react/memo) を利用すると、同じ props を持つコンポーネントの再レンダーをスキップできます。[`useMemo`](/reference/react/useMemo) や [`useCallback`](/reference/react/useCallback) と一緒に使用されます。
* [`startTransition`](/reference/react/startTransition) を使うと、state の更新を低緊急度 (non-urgent) としてマークできます。[`useTransition`](/reference/react/useTransition) に似ています。
=======
* [`createContext`](/reference/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/reference/react/useContext)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/reference/react/useRef)
* [`lazy`](/reference/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/reference/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/reference/react/useMemo) and [`useCallback`.](/reference/react/useCallback)
* [`startTransition`](/reference/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/reference/react/useTransition)

---

## Resource APIs {/*resource-apis*/}

*Resources* can be accessed by a component without having them as part of their state. For example, a component can read a message from a Promise or read styling information from a context.

To read a value from a resource, use this API:

* [`use`](/reference/react/use) lets you read the value of a resource like a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [context](/learn/passing-data-deeply-with-context).
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951
