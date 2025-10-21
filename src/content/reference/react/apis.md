---
title: "React の組み込み API"
---

<Intro>

[フック](/reference/react/hooks)や[コンポーネント](/reference/react/components)の他に、`react` パッケージはコンポーネントの定義に役立つ他の API も提供しています。このページでは、残りのモダンな React API をすべてリストアップしています。

</Intro>

---

* [`createContext`](/reference/react/createContext) を利用すると、子コンポーネントに対してコンテクストを定義および提供できます。[`useContext`](/reference/react/useContext) と一緒に使用されます。
* [`lazy`](/reference/react/lazy) を利用すると、コンポーネントのコードの読み込みを初回レンダーまで遅延することができます。
* [`memo`](/reference/react/memo) を利用すると、同じ props を持つコンポーネントの再レンダーをスキップできます。[`useMemo`](/reference/react/useMemo) や [`useCallback`](/reference/react/useCallback) と一緒に使用されます。
* [`startTransition`](/reference/react/startTransition) を使うと、state の更新を低緊急度 (non-urgent) としてマークできます。[`useTransition`](/reference/react/useTransition) に似ています。
* [`act`](/reference/react/act) を使うと、テスト環境でレンダーやユーザ操作をラップして、アサーションを行う前に更新が確実に処理されるようにします。

---

## リソース API {/*resource-apis*/}

*リソース (resource)* とは、state として保持しなくともコンポーネントからアクセスできる情報のことです。例えばコンポーネントはプロミス (Promise) からメッセージを読み取ったりコンテクストからスタイル情報を読み取ったりできます。

リソースから値を読み取るには以下の API を使用します。

* [`use`](/reference/react/use) を使うと、[プロミス](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)や[コンテクスト](/learn/passing-data-deeply-with-context)のようなリソースから値を読み取ることができます。
```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```
