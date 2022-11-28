---
title: "React 18 アップグレードガイド"
author: [rickhanlonii]
---

[リリース告知の記事](/blog/2022/03/29/react-v18.html)でお伝えしたとおり、React 18 には新たな並行レンダラを用いた機能が加わっており、既存のアプリケーションが段階的に採用できる方法も提供しています。この投稿では、React 18 にアップグレードするためのステップについてご案内します。

React 18 にアップグレードする際に遭遇した[問題は報告](https://github.com/facebook/react/issues/new/choose)をお願いします。

*React Native ユーザ向けの注意：React 18 のリリースは React Native の将来のバージョンで行います。これは、このブログ記事で紹介する新機能を活用した新たな React Native アーキテクチャに React 18 が依存しているからです。詳細は[こちらの React Conf キーノート](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)を参照してください。*

## インストール {#installing}

React の最新バージョンをインストールするには：

```bash
npm install react react-dom
```

Yarn をお使いの場合：

```bash
yarn add react react-dom
```

## クライアントレンダリング API への変更 {#updates-to-client-rendering-apis}

まず React 18 をインストールすると、以下のような警告がコンソールに表示されます：

> ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot

React では複数のルートを管理する際の使い勝手を改善する、新しいルート API を導入しています。新しいルート API によって新しい並行レンダラも有効になるため、並行処理機能にオプトインできるようになります。

```js
// Before
import { render } from 'react-dom';
const container = document.getElementById('app');
render(<App tab="home" />, container);

// After
import { createRoot } from 'react-dom/client';
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);
```

`unmountComponentAtNode` も `root.unmount` に置き換わりました：

```js
// Before
unmountComponentAtNode(container);

// After
root.unmount();
```

またレンダー後のコールバックも削除されました。サスペンスを使った場合に、大抵は期待される結果にならないためです：

```js
// Before
const container = document.getElementById('app');
render(<App tab="home" />, container, () => {
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
const root = createRoot(container);
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
> **アップグレード後にアプリが動かなくなった場合は、アプリを `<StrictMode>` でラップしていないか確認してください。**[strict モードは React 18 でより厳密になっている](#updates-to-strict-mode)ため、開発モードで新たに追加されたチェックにあなたのコンポーネントがすべて適合していないのかもしれません。もし strict モードを外したらアプリが動くようになった場合、アップグレード中は外したままにして、指摘された問題を修正してから元に戻す（トップにでもツリーの一部に対してでも）のでも構いません。

## サーバレンダリング API への変更 {#updates-to-server-rendering-apis}

このリリースでは、`react-dom/server` を刷新し、サーバ側でのサスペンスやストリーミング SSR がフルサポートされるようになりました。この変更の一環として、サーバ側での逐次的なサスペンスのストリーミング処理をサポートしない既存の Node ストリーミング API を非推奨としました。

以下の API を使うと警告が出るようになります：

* `renderToNodeStream`: **非推奨 ⛔️️**

代わりに Node 環境でのストリーミングには以下を使ってください：
* `renderToPipeableStream`: **New ✨**

また、Deno や Cloudflare Workers のようなモダンなエッジランタイム環境でサスペンス付き SSR ストリーミングをサポートする、新たな API を導入します：
* `renderToReadableStream`: **New ✨**

以下の API はこれからも動作しますが、サスペンスのサポートに制限がつきます：
* `renderToString`: **制限付き** ⚠️
* `renderToStaticMarkup`: **制限付き** ⚠️

最後に、電子メールをレンダーする目的であれば以下の API を引き続き利用できます：
* `renderToStaticNodeStream`

サーバレンダリング用 API についての詳細は、ワーキンググループの投稿 [Upgrading to React 18 on the server](https://github.com/reactwg/react-18/discussions/22) と [deep dive on the new Suspense SSR Architecture](https://github.com/reactwg/react-18/discussions/37) を、また React Conf 2011 での [Shaundai Person](https://twitter.com/shaundai) の発表 [Streaming Server Rendering with Suspense](https://www.youtube.com/watch?v=pj5N-Khihgc) をご覧ください。

## TypeScript 型定義の変更 {#updates-to-typescript-definitions}

プロジェクトで TypeScript を使っている場合、依存の `@types/react` と `@types/react-dom` を最新バージョンに更新する必要があります。新たな型はより安全であり、これまで型チェッカに無視されていた問題を捕捉することができます。最も大きな変更は、props を定義する際に `children` プロパティを明示的に列挙する必要があるということです。例えば：

```typescript{3}
interface MyButtonProps {
  color: string;
  children?: React.ReactNode;
}
```

型にのみ関連する変更の全リストについては [React 18 の型についてのプルリクエスト](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/56210) を参照してください。ライブラリ型についての修正のサンプルへのリンクがあり、コードをどのように調整すればいいか分かるようになっています。[自動移行スクリプト](https://github.com/eps1lon/types-react-codemod)を使うことで、あなたのアプリケーションコードをより新しく、より安全な型定義にすばやく移行しやすくなります。

型に関するバグを見つけた場合は、DefinitelyTyped リポジトリで [issue を登録](https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/new?category=issues-with-a-types-package)してください。

## 自動バッチング {#automatic-batching}

React 18 はデフォルトでより多くのバッチング (batching) を行うことで、標準状態でのパフォーマンスを改善します。バッチングとは React がパフォーマンスのために複数のステート更新をグループ化して、単一の再レンダーにまとめることを指します。React 18 より前は、React のイベントハンドラ内での更新のみバッチ処理されていました。promise や setTimeout、ネイティブのイベントハンドラやその他あらゆるイベント内で起きる更新はデフォルトではバッチ処理されていませんでした。

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


React 18 以降で `createRoot` を使うと、すべての更新はどこで発生したかに関わらず、自動でバッチ処理されます。つまり、タイムアウト、promise、ネイティブイベントハンドラおよびその他のあらゆるイベント内で起きた更新は、React イベントで起こった更新と同様にバッチ処理されます：

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

これは破壊的変更ですが、これによりレンダー処理が軽くなり、したがってアプリのパフォーマンスが向上することが期待されます。自動バッチングからオプトアウトするために `flushSync` を使うことができます：

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

詳細については、[Automatic batching 詳解](https://github.com/reactwg/react-18/discussions/21) を参照してください。

## ライブラリ向けの新 API {#new-apis-for-libraries}

React 18 ワーキンググループでライブラリメンテナと共同で作業を行い、スタイルや外部ストアといった分野に特有のユースケースで並行レンダー機能をサポートするため、新しい API を作成しました。一部のライブラリは、React 18 をサポートするために以下の API に切り替える必要があるかもしれません：

* `useSyncExternalStore` は、ストアへの更新を強制的に同期的に行うことで、並行読み取りを外部ストアがサポートできるようにするための新たなフックです。この新しい API は React 外部の状態を扱うあらゆるライブラリにとって推奨されるものです。詳細は [useSyncExternalStore 概要](https://github.com/reactwg/react-18/discussions/70)および [useSyncExternalStore API 詳細](https://github.com/reactwg/react-18/discussions/86)を参照してください。
* `useInsertionEffect` は、CSS-in-JS ライブラリがレンダー時にスタイルを注入する際のパフォーマンス上の問題に対処できるようにするための新しいフックです。すでに CSS-in-JS ライブラリを構築しているのでなければ、これを使うことはまずないでしょう。このフックは、DOM が書き換えられた後、レイアウト副作用 (layout effect) が新しいレイアウトを読み込む前に実行されます。これにより React 17 およびそれ以前から既に存在した問題が解決されますが、React 18 では並行レンダー中にブラウザに処理が渡り、そこでレイアウトが再計算される可能性があるため、より重要です。詳細は [Library Upgrade Guide for `<style>`](https://github.com/reactwg/react-18/discussions/110) を参照してください。

React 18 では `startTransition`、`useDeferredValue` や `useId` のような新しい API も導入しており、[リリース告知記事](/blog/2022/03/29/react-v18.html)にて詳細をお伝えします。

## strict モードへの変更 {#updates-to-strict-mode}

将来的に、React が state を保ったままで UI の一部分を追加・削除できるような機能を導入したいと考えています。例えば、ユーザがタブを切り替えて画面を離れてから戻ってきた場合に、React が以前の画面をすぐに表示できるようにしたいのです。これを可能にするため、React は同じ state を使用してツリーをアンマウント・再マウントします。

この機能により、React の標準状態でのパフォーマンスが向上しますが、コンポーネントは副作用が何度も登録されたり破棄されたりすることに対して耐性を持つことが必要になります。ほとんどの副作用は何の変更もなく動作しますが、一部の副作用は一度しか登録・破棄されないものと想定しています。

この問題に気付きやすくするために、React 18 は strict モードに新しい開発時専用のチェックを導入します。この新しいチェックは、コンポーネントが初めてマウントされるたびに、すべてのコンポーネントを自動的にアンマウント・再マウントし、かつ 2 回目のマウントで以前の state を復元します。

これまでは、React はコンポーネントをマウントして以下のように副作用を作成してきました：

```
* React がコンポーネントをマウント
  * レイアウト副作用 (layout effect) を作成
  * （通常の）副作用を作成
```

React 18 の strict モードでは、開発時にコンポーネントがマウントされた場合、React はコンポーネントの即時アンマウント・再マウントをシミュレーションします：

```
* React がコンポーネントをマウント
    * レイアウト副作用を作成
    * 副作用を作成
* マウントされたコンポーネント内で副作用の破棄をシミュレート
    * レイアウト副作用を破棄
    * 副作用を破棄
* マウントされたコンポーネント内で以前の state を復元し副作用の再生成をシミュレート
    * レイアウト副作用を作成
    * 副作用の作成用コードの実行
```

詳細については、ワーキンググループの投稿 [Adding Reusable State to StrictMode](https://github.com/reactwg/react-18/discussions/19) と [How to support Reusable State in Effects](https://github.com/reactwg/react-18/discussions/18) を参照してください。

## テスト環境の設定 {#configuring-your-testing-environment}

まずテストで `createRoot` を使うようにアップデートした場合、テストコンソールに以下の警告が表示されます：

> The current testing environment is not configured to support act(...)

これを修正するには、テスト実行前に `globalThis.IS_REACT_ACT_ENVIRONMENT` を `true` に設定します：

```js
// In your test setup file
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
```

このフラグの目的は、React がユニットテスト的な環境で実行されている、と React に伝えることです。React は更新を `act` でラップし忘れた場合に、有用な警告を表示するようになります。

このフラグを `false` に設定することで `act` が必要ないと React に伝えることもできます。これはフル機能のブラウザ環境をシミュレートする end-to-end テストにおいて有用です。

将来的には、テストライブラリがこれを自動で設定するようになることを期待しています。例えば [React Testing Library の次期バージョンは React 18 の組み込みサポートを有しており](https://github.com/testing-library/react-testing-library/issues/509#issuecomment-917989936)、追加の設定が不要となっています。

<<<<<<< HEAD
ワーキングループで[テスト用 `act` API および関連する変更に関しての背景](https://github.com/reactwg/react-18/discussions/102)が閲覧可能です。
=======
[More background on the `act` testing API and related changes](https://github.com/reactwg/react-18/discussions/102) is available in the working group.
>>>>>>> 1a641bb88e647186f260dd2a8e56f0b083f2e46b

## Internet Explorer のサポート終了 {#dropping-support-for-internet-explorer}

このリリースで、React は [2022 年 6 月 15 日にサポート外](https://blogs.windows.com/windowsexperience/2021/05/19/the-future-of-internet-explorer-on-windows-10-is-in-microsoft-edge) となる Internet Explorer のサポートを終了します。この変更を今行うのは、React 18 で導入される新機能はマイクロタスクのようなモダンなブラウザの機能を使っており、IE でうまくポリフィルできないからです。

Internet Explorer のサポートが必要な場合は、React 17 を使い続けることをお勧めします。

## 非推奨化 {#deprecations}

* `react-dom`: `ReactDOM.render` は非推奨となりました。使うと警告が表示され、アプリは React 17 モードで動作します。
* `react-dom`: `ReactDOM.hydrate` は非推奨となりました。使うと警告が表示され、アプリは React 17 モードで動作します。
* `react-dom`: `ReactDOM.unmountComponentAtNode` は非推奨となりました。
* `react-dom`: `ReactDOM.renderSubtreeIntoContainer` は非推奨となりました。
* `react-dom/server`: `ReactDOMServer.renderToNodeStream` は非推奨となりました。

## その他の破壊的変更 {#other-breaking-changes}

* **useEffect のタイミング統一**：React はクリックやキー押下のような個別のユーザ入力によって更新がトリガされた場合に副作用関数を常に同期的に処理するようになりました。これまで、この挙動は必ずしも予測可能な一貫したものではありませんでした。
* **ハイドレーション時のエラーの厳格化**：テキストコンテンツが存在しない、あるいは余分に存在することによるハイドレーションのミスマッチは、警告ではなくエラーとして扱われるようになりました。今後 React はサーバのマークアップに適合させるために個別のノードをクライアント側で挿入したり削除したりといった「応急処置」を試みないようになるため、ツリー内の直近の `<Suspense>` バウンダリまでクライアント側のレンダーを使うための逆戻りが発生してしまいます。この変更により、ハイドレーションされたツリーに一貫性があることが保証され、ハイドレーション時のミスマッチにより起こりうる個人情報やセキュリティ絡みの問題を防止できます。
* **サスペンス内のツリーが常に一貫性のあるものに**：コンポーネントがツリーに完全に追加される前にサスペンドした場合、React はそれを不完全な状態のままツリーに追加したり、副作用を起動したりはしません。その代わり、React は新しいツリーを完全に破棄し、非同期の操作が完了するのを待ち、最初からレンダーを再試行します。React は再試行を、並行的に、ブラウザをブロックせずに行います。
* **サスペンスとレイアウト副作用**：ツリーが再サスペンドしてフォールバックに逆戻りする場合、React はレイアウト用の副作用をクリーンアップし、バウンダリ内のコンテンツが再表示されるときにそれらを再作成するようになりました。これにより、サスペンスと一緒に使用されたときにコンポーネントライブラリがレイアウトを正しく測定できないという問題が修正されます。
* **JS 環境の要件変更**：React は `Promise`、`Symbol`、`Object.assign` のようなモダンブラウザの機能に依存するようになりました。モダンなブラウザ機能についてネイティブ実装していないか非標準な実装をしている Internet Explorer のような古いブラウザやデバイスをサポートする場合は、バンドルされたアプリにグローバルなポリフィルを含めることを検討してください。

## その他の注目すべき変更 {#other-notable-changes}

### React {#react}

* **コンポーネントが `undefined` を return できるように**：React はコンポーネントから `undefined` が返された場合でも警告しなくなりました。これにより、コンポーネントからの返り値として許される値が、コンポーネントツリーの中間で許可される値と合致するようになりました。JSX の前に `return` 文を書き忘れるといったミスを防ぐためには、リンタを使用することをお勧めします。
* **テストにおいて `act` 警告がオプトインに**：End-to-end のテストを実行している場合、`act` 警告は不要です。[オプトインする](https://github.com/reactwg/react-18/discussions/102)メカニズムを用意しましたので、それが有用であるユニットテストの場合にのみ有効化できるようになりました。
* **アンマウント済みコンポーネントにおける `setState` で警告を表示しないように**：これまで React は、`setState` がアンマウント済みのコンポーネントでコールされた場合、メモリリークに関する警告を表示してきました。この警告は購読に関する問題のために存在していましたが、state をセットしても問題ないシナリオでもこの警告にぶつかることが多く、また回避しようとした場合余計に悪いコードになってしまっていました。この警告は[削除](https://github.com/facebook/react/pull/22114)されました。
* **コンソールログの抑止を廃止**：strict モードを利用する場合、React はコンポーネントを 2 回レンダーして、予期しない副作用がないか見つけやすくします。React 17 では、ログが見やすくなるようにそのうちの 1 回ではコンソールログを抑止するようにしていました。これが混乱を招くという[コミュニティからのフィードバック](https://github.com/facebook/react/issues/21783)を受けて、このような抑止を行うことを止めました。代わりに、React DevTools をインストールしている場合は、2 回目のレンダーでのログはグレーで表示されるようになりました。完全に抑止するためのオプション（デフォルトではオフ）も存在します。
* **メモリ使用量の改善**：React はアンマウント時に内部のフィールドをより多く消去するようになったため、あなたのアプリに未修正のメモリリークがあった場合の悪影響が軽減されます。

### React DOM Server {#react-dom-server}

* **`renderToString`**：サーバ側でサスペンドが起きた場合でもエラーにならなくなりました。代わりに、直近の `<Suspense>` にあるフォールバック HTML を出力し、クライアント側で同じコンテンツのレンダーを再試行するようになります。とはいえ、`renderToPipeableStream` や `renderToReadableStream` のようなストリーミング API に切り替えることが推奨されます。
* **`renderToStaticMarkup`**：サーバ側でサスペンドが起きた場合でもエラーにならなくなりました。代わりに、直近の `<Suspense>` にあるフォールバック HTML を出力します。

## Changelog {#changelog}

[変更履歴の全リストはこちら](https://github.com/facebook/react/blob/main/CHANGELOG.md)を参照してください。
