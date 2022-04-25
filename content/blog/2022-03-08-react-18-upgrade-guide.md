---
title: "React 18 へのアップグレード"
author: [rickhanlonii]
---

[リリースのお知らせ](/blog/2022/03/29/react-v18.html)で共有したとおり、React 18 では新たな並行レンダラを用いた機能が加わっており、既存のアプリケーションが段階的に採用できる方法も提供しています。この投稿では、React 18 にアップグレードするためのステップについてご案内します。

React 18 にアップグレードする際に遭遇した[問題は報告](https://github.com/facebook/react/issues/new/choose)をお願いします。

*Note for React Native users: React 18 will ship in a future version of React Native. This is because React 18 relies on the New React Native Architecture to benefit from the new capabilities presented in this blogpost. For more information, see the [React Conf keynote here](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s).*

## インストール {#installing}

To install the latest version of React:

```bash
npm install react react-dom
```

Or if you’re using yarn:

```bash
yarn add react react-dom
```

## Updates to Client Rendering APIs {#updates-to-client-rendering-apis}

最初に React 18 をインストールすると、以下のような警告がコンソールに表示されます：

> ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

React では複数のルートを管理する際の使い勝手を改善する新しいルート API を導入しています。新しいルート API によって新しい並行レンダラも有効になるため、並行処理機能にオプトインできるようになります。

```js
// Before
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App tab="home" />);

```

`unmountComponentAtNode` も `root.unmount` に置き換わりました：

```js
// Before
unmountComponentAtNode(container);

// After
root.unmount();
```

またレンダー後のコールバックも削除されました。サスペンスを使った場合に期待される動作をしないためです：

```js
// Before
const container = document.getElementById('app');
ReactDOM.render(<App tab="home" />, container, () => {
  console.log('rendered');
});

// After
function AppWithCallbackAfterRender() {
  useEffect(() => {
    console.log('rendered');
  });

  return <App tab="home" />
}

const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);
root.render(<AppWithCallbackAfterRender />);
```

> 補足
> 
> 以前の render のコールバック API に一対一で対応するものは存在せず、ユースケースによって対応は異なります。詳細はワーキンググループの投稿 [Replacing render with createRoot](https://github.com/reactwg/react-18/discussions/5) を参照してください。

最後に、あなたのアプリでサーバサイドレンダリングとハイドレーションを使用している場合は、`hydrate` を `hydrateRoot` にアップグレードしてください：

```js
// Before
import { hydrate } from 'react-dom';
const container = document.getElementById('app');
hydrate(<App tab="home" />, container);

// After
import { hydrateRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = hydrateRoot(container, <App tab="home" />);
// Unlike with createRoot, you don't need a separate root.render() call here.
```

詳細は[こちらのワーキングループのディスカッション](https://github.com/reactwg/react-18/discussions/5)を参照してください。

> 補足
> 
> **アップグレード後にアプリが動かなくなった場合は、<StrictMode> でラップされていないか確認してください。**[strict モードは React 18 でより厳密になっており](#updates-to-strict-mode)、開発モードで新たに追加されたチェックにあなたのコンポーネントがすべて適合していないのかもしれません。もし strict モードを外したらアプリが動くようになった場合、アップグレード中は外したままにして、指摘された問題を修正してから戻す（トップでもツリーの一部に対してでも）のでも構いません。

## サーバレンダリング API への変更 {#updates-to-server-rendering-apis}

このリリースでは、`react-dom/server` を改修し、サーバ側でのサスペンスやストリーミング SSR がフルサポートされるようになりました。この変更の一環として、サーバ側での逐次的なサスペンスの処理を行えない、これまでの Node ストリーミング API を非推奨としました。

以下の API を使うと警告が出るようになります：

* `renderToNodeStream`: **非推奨 ⛔️️**

代わりに Node 環境でのストリーミングには以下を使ってください：
* `renderToPipeableStream`: **New ✨**

また、Deno や Cloudflare ワーカーのようなモダンなエッジランタイム環境でサスペンス付き SSR ストリーミングをサポートする、新たな API を導入します：
* `renderToReadableStream`: **New ✨**

以下の API はこれからも動作しますが、サスペンスへのサポートは限定的なものとなります：
* `renderToString`: **制限付き** ⚠️
* `renderToStaticMarkup`: **制限付き** ⚠️

最後に、電子メールをレンダーする目的であれば以下の API も動作しつづけます：
* `renderToStaticNodeStream`

サーバレンダリング用 API についての詳細は、ワーキンググループの投稿 [Upgrading to React 18 on the server](https://github.com/reactwg/react-18/discussions/22) と [deep dive on the new Suspense SSR Architecture](https://github.com/reactwg/react-18/discussions/37) を、また React Conf 2011 での [Shaundai Person](https://twitter.com/shaundai) の発表 [Streaming Server Rendering with Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) をご覧ください。

## TypeScript 型定義の変更

プロジェクトで TypeScript を使っている場合、依存の `@types/react` と `@types/react-dom` を最新版に更新する必要があります。新たな型はより安全であり、これまで型チェッカに無視されていた問題を捕捉することができます。最も大きな変更は、props を定義する際に `children` プロパティを明示的に列挙する必要があるということです。例えば：

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

型にのみ関連する変更の全リストについては [React 18 の型についてのプルリクエスト](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) を参照してください。ライブラリ型についての修正のサンプルへのリンクがあり、コードをどのように調整すればいいか分かるようになっています。[自動移行スクリプト](https://github.com/eps1lon/types-react-codemod)を使うことで、あなたのアプリケーションコードをより新しく、より安全な型定義にすばやく移行しやすくなります。

型に関するバグを見つけた場合は、DefinitelyTyped リポジトリで [issue を登録](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package)してください。

## 自動バッチング {#automatic-batching}

React 18 adds out-of-the-box performance improvements by doing more batching by default. Batching is when React groups multiple state updates into a single re-render for better performance. Before React 18, we only batched updates inside React event handlers. Updates inside of promises, setTimeout, native event handlers, or any other event were not batched in React by default:

```js
// Before React 18 only React events were batched

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);
```


Starting in React 18 with `createRoot`, all updates will be automatically batched, no matter where they originate from. This means that updates inside of timeouts, promises, native event handlers or any other event will batch the same way as updates inside of React events:

```js
// After React 18 updates inside of timeouts, promises,
// native event handlers or any other event are batched.

function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}

setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

This is a breaking change, but we expect this to result in less work rendering, and therefore better performance in your applications. To opt-out of automatic batching, you can use `flushSync`:

```js
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React has updated the DOM by now
  flushSync(() => {
    setFlag(f => !f);
  });
  // React has updated the DOM by now
}
```

For more information, see the [Automatic batching deep dive](https://github.com/reactwg/react-18/discussions/21).

## New APIs for Libraries {#new-apis-for-libraries}

In the React 18 Working Group we worked with library maintainers to create new APIs needed to support concurrent rendering for use cases specific to their use case in areas like styles, and external stores. To support React 18, some libraries may need to switch to one of the following APIs:

* `useSyncExternalStore` is a new hook that allows external stores to support concurrent reads by forcing updates to the store to be synchronous. This new API is recommended for any library that integrates with state external to React. For more information, see the [useSyncExternalStore overview post](https://github.com/reactwg/react-18/discussions/70) and [useSyncExternalStore API details](https://github.com/reactwg/react-18/discussions/86).
* `useInsertionEffect` is a new hook that allows CSS-in-JS libraries to address performance issues of injecting styles in render. Unless you've already built a CSS-in-JS library we don't expect you to ever use this. This hook will run after the DOM is mutated, but before layout effects read the new layout. This solves an issue that already exists in React 17 and below, but is even more important in React 18 because React yields to the browser during concurrent rendering, giving it a chance to recalculate layout. For more information, see the [Library Upgrade Guide for `<style>`](https://github.com/reactwg/react-18/discussions/110).

React 18 also introduces new APIs for concurrent rendering such as `startTransition`, `useDeferredValue` and `useId`, which we share more about in the [release post](/blog/2022/03/29/react-v18.html).

## Updates to Strict Mode {#updates-to-strict-mode}

In the future, we'd like to add a feature that allows React to add and remove sections of the UI while preserving state. For example, when a user tabs away from a screen and back, React should be able to immediately show the previous screen. To do this, React would unmount and remount trees using the same component state as before.

This feature will give React better performance out-of-the-box, but requires components to be resilient to effects being mounted and destroyed multiple times. Most effects will work without any changes, but some effects assume they are only mounted or destroyed once.

To help surface these issues, React 18 introduces a new development-only check to Strict Mode. This new check will automatically unmount and remount every component, whenever a component mounts for the first time, restoring the previous state on the second mount.

Before this change, React would mount the component and create the effects:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
```

With Strict Mode in React 18, React will simulate unmounting and remounting the component in development mode:

```
* React mounts the component.
    * Layout effects are created.
    * Effect effects are created.
* React simulates unmounting the component.
    * Layout effects are destroyed.
    * Effects are destroyed.
* React simulates mounting the component with the previous state.
    * Layout effect setup code runs
    * Effect setup code runs
```

For more information, see the Working Group posts for [Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19) and [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18).

## Configuring Your Testing Environment {#configuring-your-testing-environment}

When you first update your tests to use `createRoot`, you may see this warning in your test console:

> The current testing environment is not configured to support act(...)

To fix this, set `globalThis.IS_REACT_ACT_ENVIRONMENT` to `true` before running your test:

```js
// In your test setup file
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

The purpose of the flag is to tell React that it's running in a unit test-like environment. React will log helpful warnings if you forget to wrap an update with `act`.

You can also set the flag to `false` to tell React that `act` isn't needed. This can be useful for end-to-end tests that simulate a full browser environment.

Eventually, we expect testing libraries will configure this for you automatically. For example, the [next version of React Testing Library has built-in support for React 18](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936) without any additional configuration.

[More background on the the `act` testing API and related changes](https://github.com/reactwg/react-18/discussions/102) is available in the working group.

## Internet Explorer のサポート終了 {#dropping-support-for-internet-explorer}

このリリースで、React は [2022 年 6 月 15 日にサポート終了](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge) となる Internet Explorer のサポートを終了します。この変更を今行うのは、React 18 で導入される新機能はマイクロタスクのようなモダンなブラウザの機能を使っており、IE でうまくポリフィルできないからです。

Internet Explorer のサポートが必要な場合は、React 17 を使い続けることをお勧めします。

## 非推奨化 {#deprecations}

* `react-dom`: `ReactDOM.render` は非推奨となりました。使うと警告が表示され、アプリは React 17 モードで動作します。
* `react-dom`: `ReactDOM.hydrate` は非推奨となりました。使うと警告が表示され、アプリは React 17 モードで動作します。
* `react-dom`: `ReactDOM.unmountComponentAtNode` は非推奨となりました。
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` は非推奨となりました。
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` は非推奨となりました。

## その他の破壊的変更 {#other-breaking-changes}

* **useEffect のタイミング統一**：React はクリックやキー押下のような個別のユーザ入力によって更新がトリガされた場合に副作用関数を常に同期的に処理するようになりました。これまで、この挙動は必ずしも予測可能な一貫したものではありませんでした。
* **ハイドレーション時のエラーの厳格化**：テキストコンテンツが存在しないが余分に存在することによるハイドレーションのミスマッチが、警告ではなくエラーとして扱われるようになりました。今後 React はサーバのマークアップに適合させるために個別のノードをクライアント側で挿入したり削除したりして「修繕」を行おうとしなくなり、ツリー内の直近の `<Suspense>` バウンダリまでクライアント側のレンダーを使うための逆戻りが発生してしまいます。この変更により、ハイドレーションされたツリーに一貫性があることが保証され、ハイドレーション時のミスマッチにより起こりうる個人情報やセキュリティ絡みの穴を防止できます。
* **サスペンス内のツリーが常に一貫性のあるものに**：コンポーネントがツリーに完全に追加される前にサスペンドした場合、React はそれを不完全な状態のままツリーに追加したり、副作用を起動したりはしません。その代わり、React は新しいツリーを完全に破棄し、非同期の操作が完了するのを待ち、最初からレンダーを再試行します。React は再試行を、並行して、ブラウザをブロックせずに行います。
* **サスペンスとレイアウト副作用**：ツリーが再サスペンドしてフォールバックに逆戻りする場合、React はレイアウト用の副作用をクリーンアップし、バウンダリ内のコンテンツが再表示されるときにそれらを再作成するようになりました。これにより、サスペンスと一緒に使用されたときにコンポーネントライブラリがレイアウトを正しく測定できないという問題が修正されます。
* **JS 環境の要件変更**：React は `Promise`、`Symbol`、`Object.assign` のようなモダンブラウザの機能に依存するようになりました。モダンなブラウザ機能についてネイティブ実装していないか非標準な実装をしている Internet Explorer のような古いブラウザやデバイスをサポートする場合は、バンドルされたアプリにグローバルなポリフィルを含めることを検討してください。

## その他の注目すべき変更 {#other-notable-changes}

### React {#react}

* **コンポーネントが `undefined` を return できるように**：React はコンポーネントから `undefined` が返された場合でも警告しなくなりました。これにより、コンポーネントからの返り値として許される値が、コンポーネントツリーの中間で許可される値と合致するようになりました。JSX の前に `return` 文を書き忘れるといったミスを防ぐためには、リンタを使用することをお勧めします。
* **テストにおいて `act` 警告がオプトインに**：End-to-end のテストを実行している場合、`act` 警告は不要です。[オプトインする](https://github.com/reactwg/react-18/discussions/102)メカニズムを用意しましたので、それが有用であるユニットテストの場合にのみ有効化できるようになりました。
* **アンマウント済みコンポーネントにおける `setState` で警告を表示しないように**：これまで React は、`setState` がアンマウント済みのコンポーネントでコールされた場合、メモリリークに関する警告を表示してきました。この警告は購読に関する問題のために存在していましたが、state をセットしても問題ないシナリオでもこの警告にぶつかることが多く、また回避しようとした場合余計に悪いコードになってしまっていました。この警告は[削除](https://github.com/facebook/react/pull/22114)されました。
* **コンソールログの抑止を廃止**：strict モードを利用する場合、React はコンポーネントを 2 回レンダーして、予期しない副作用がないか見つけやすくします。React 17 では、ログが見やすくなるようにそのうちの 1 回ではコンソールログを抑止するようにしていました。これが混乱を招くという[コミュニティからのフィードバック](https://github.com/facebook/react/issues/21783)を受けて、このような抑止を行うことを止めました。代わりに、React DevTools をインストールしている場合は、2 回目のレンダーでのログはグレーで表示されるようになました。完全に抑止するためのオプション（デフォルトではオフ）も存在します。
* **メモリ使用量の改善**：React はアンマウント時に内部のフィールドをより多く消去するようになったため、あなたのアプリに未修正のメモリリークがあった場合の悪影響が軽減されます。

### React DOM Server {#react-dom-server}

* **`renderToString`**：サーバ側でサスペンドが起きた場合でもエラーにならなくなりました。代わりに、直近の `<Suspense>` にあるフォールバック HTML を出力し、クライアント側で同じコンテンツのレンダーを再試行するようになります。とはいえ、`renderToPipeableStream` や `renderToReadableStream` のようなストリーミング API に切り替えることが推奨されます。
* **`renderToStaticMarkup`**：サーバ側でサスペンドが起きた場合でもエラーにならなくなりました。代わりに、直近の `<Suspense>` にあるフォールバック HTML を出力し、クライアント側で同じコンテンツのレンダーを再試行するようになります。

## Changelog {#changelog}

You can view the [full changelog here](https://github.com/facebook/react/blob/main/CHANGELOG.md).
