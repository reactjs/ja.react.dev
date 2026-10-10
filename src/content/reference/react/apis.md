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
* [`addTransitionType`](/reference/react/addTransitionType) を使うと、トランジションの原因を指定できます。[`startTransition`](/reference/react/startTransition) や [`<ViewTransition>`](/reference/react/ViewTransition) と一緒に使用します。
* [`act`](/reference/react/act) を使うと、テスト環境でレンダーやユーザ操作をラップして、アサーションを行う前に更新が確実に処理されるようにします。
* [`cache`](/reference/react/cache) を使うと、データフェッチや計算の結果をキャッシュできます。
* [`cacheSignal`](/reference/react/cacheSignal) を使うと、`cache()` の生存期間が終了したことを知ることができます。
* [`captureOwnerStack`](/reference/react/captureOwnerStack) は、開発環境で現在の Owner Stack を読み取り、利用可能な場合は文字列として返します。

---

## リソース API {/*resource-apis*/}

*リソース (resource)* とは、state として保持しなくともコンポーネントからアクセスできる情報のことです。例えばコンポーネントはプロミス (Promise) からメッセージを読み取ったりコンテクストからスタイル情報を読み取ったりできます。

以下の種類のリソースを [`use`](/reference/react/use) に渡すことができます。

* [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) を渡した場合：その Promise の解決された値を読み取ることができます。
* [コンテクスト](/learn/passing-data-deeply-with-context)を渡した場合：そのコンテクストの値を読み取ることができます。
* [`browser`](/reference/react-dom/browser) の返り値を渡した場合：サーバレンダリング中に、このコンポーネントをブラウザ専用としてマークすることができます。

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  use(browser());
  // ...
}
```
