---
title: "React 19.2"
author: The React Team
date: 2025/10/01
description: React 19.2 では Activity、パフォーマンストラック、useEffectEvent などの新機能が追加されます。
---

October 1, 2025 by [The React Team](/community/team)

---

<Intro>

React 19.2 が npm で利用可能になりました！

</Intro>

これは、昨年 12 月の React 19 と今年 6 月の React 19.1 に続く、ここ 1 年で 3 回目となるリリースです。この投稿では React 19.2 の新機能の概要を説明し、いくつかの注目すべき変更点をハイライトとして紹介します。

<InlineToc />

---

## 新しい React の機能 {/*new-react-features*/}

### `<Activity />` {/*activity*/}

`<Activity>` を使うことで、アプリを制御・優先順位付けが可能な "activity" に分割できます。

Activity は、条件付きレンダーに対する代替手段として、アプリの一部の表示を切り替えるのに使用できます。

```js
// Before
{isVisible && <Page />}

// After
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

React 19.2 では、Activity は `visible` と `hidden` の 2 つのモードをサポートしています。

- `hidden`: 子要素を非表示にし、エフェクトをアンマウントし、React が他に処理するものがなくなるまで、すべての更新を遅延させます。
- `visible`: 子要素を表示し、エフェクトをマウントし、更新を通常通り処理できるようにします。

これにより、画面上で表示されているコンテンツのパフォーマンスに影響を与えることなく、アプリの非表示の部分を事前レンダーし続けることができます。

Activity 機能を使用することで、ユーザが次に移動する可能性の高い不可視部分をレンダーしておくことや、ユーザが離れたあとに state を保持しておくことが可能です。これにより、データ、CSS、画像をバックグラウンドで読み込んでナビゲーションを高速化したり、戻るナビゲーションで入力フィールドなどの状態を維持したりできるようになります。

将来的には、さまざまなユースケースに対応するために、Activity にさらに多くのモードを追加する予定です。

Activity の使用方法の例については、[Activity のドキュメント](/reference/react/Activity)を参照してください。

---

### `useEffectEvent` {/*use-effect-event*/}

`useEffect` でよくあるパターンの 1 つは、外部システムからの「イベント」に応答してアプリコードに通知を行うことです。例えば、チャットルームが接続されたときに通知を表示したい場合を考えましょう。

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]);
  // ...
```

上記のコードの問題は、このような「イベント」内で使用されている値が変更されると、それを囲んでいるエフェクトが再実行されてしまうことです。例えば、`theme` を変更するとチャットルームが再接続されます。エフェクトのロジック自体に関連する `roomId` のような値の場合はこれで正しいですが、`theme` の場合は理に適っていません。

これを解決するため、多くのユーザはリンタのルールを単に無効化して、依存値を除外してきました。しかしこれでは、後でエフェクトを更新したくなったときに、リンタが依存配列をそれに追従させてくれなくなるため、バグに繋がります。

`useEffectEvent` を使うことで、このロジックの「イベント」部分を、それをトリガするエフェクトから分離できます。

```js {2,3,4,9}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared (Effect Events aren't dependencies)
  // ...
```

DOM イベントと同様、エフェクトイベントは常に最新の props や state を「見る」ことができます。

**エフェクトイベントは依存配列に宣言すべきではありません**。リンタがエフェクトイベントを依存値として挿入しないようにするため、`eslint-plugin-react-hooks@latest` にアップグレードする必要があります。エフェクトイベントは、それを使うエフェクトと同じコンポーネントまたはフック内でのみ宣言できることに注意してください。この制限はリンタによってチェックされます。

<Note>

#### `useEffectEvent` をいつ使うべきか {/*when-to-use-useeffectevent*/}

`useEffectEvent` は概念的には、ユーザに起因するイベントではなくエフェクトから発火する「イベント」となる関数に使用すべきです（それが「エフェクトイベント」の意味です）。すべてを `useEffectEvent` でラップする必要はありませんし、リンタのエラーを黙らせるためだけに使うとバグにつながる可能性があります。

エフェクトイベントについての考え方の詳細については、[イベントとエフェクトを分離する](/learn/separating-events-from-effects#extracting-non-reactive-logic-out-of-effects)を参照してください。

</Note>

---

### `cacheSignal` {/*cache-signal*/}

<RSC>

`cacheSignal` は [React Server Components](/reference/rsc/server-components) でのみ使用できます。

</RSC>

`cacheSignal` を使うことで、[`cache()`](/reference/react/cache) のライフタイムの終了タイミングを知ることができます。

```
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);

async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

これにより、キャッシュされる結果がもはや必要なくなった場合に、作業をクリーンアップまたは中止できるようになります。以下のような場合が該当します。

- React がレンダーを正常に完了した
- レンダーが中断された
- レンダーが失敗した

詳細については、[`cacheSignal` のドキュメント](/reference/react/cacheSignal)を参照してください。

---

### パフォーマンストラック {/*performance-tracks*/}

React 19.2 では、Chrome DevTools のパフォーマンスプロファイルに新しい[カスタムトラック](https://developer.chrome.com/docs/devtools/performance/extension)が複数追加され、React アプリのパフォーマンスに関するより詳しい情報が提供されます。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

[React パフォーマンストラックのドキュメント](/reference/dev-tools/react-performance-tracks)では、トラックに含まれるすべての内容を説明していますが、ここでは概要を説明します。

#### Scheduler ⚛ {/*scheduler-*/}

Scheduler トラックは、React が様々な優先度で何を処理しているかを表示します。例えばユーザ操作のための "Blocking" や startTransition 内の更新のための "Transition" などです。各トラック内では、更新をスケジュールしたイベントといった作業種別や、更新に対応するレンダーの開始タイミングが表示されます。

また、更新が別の優先度の処理を待つためにブロックされている、React が作業継続前にペイントの完了を待っている、といった情報も表示されます。Scheduler トラックは、React がコードを異なる優先度に分割する方法や、作業を完了した順序を理解するのに役立ちます。

含まれるすべての内容については、[Scheduler トラック](/reference/dev-tools/react-performance-tracks#scheduler)のドキュメントを参照してください。

#### Components ⚛ {/*components-*/}

Components トラックは、React がレンダーまたはエフェクト実行のために処理しているコンポーネントのツリーを示します。内部には、子やエフェクトがマウントされたときの "Mount" や、React 外の作業を待つためにレンダーがブロックされたときの "Blocked" といったラベルが表示されます。

Components トラックは、コンポーネントのレンダーやエフェクトの実行タイミング、あるいはそれらの作業にかかる時間を知ることで、パフォーマンスの問題を特定するのに役立ちます。

含まれるすべての内容については、[Components トラックのドキュメント](/reference/dev-tools/react-performance-tracks#components)を参照してください。

---

## 新しい React DOM の機能 {/*new-react-dom-features*/}

### 部分プリレンダー {/*partial-pre-rendering*/}

19.2 では、アプリの一部を事前にレンダーし、後でレンダーを再開するための新機能を追加しています。

この機能は「部分プリレンダー (Partial Pre-rendering)」と呼ばれ、アプリの静的な部分を事前レンダーして CDN から提供し、後でシェルのレンダーを再開して動的コンテンツで埋められるようにするためのものです。

後で再開できるようアプリを事前レンダーするには、まず `AbortController` を使って `prerender` を呼び出します。

```
const {prelude, postponed} = await prerender(<App />, {
  signal: controller.signal,
});

// Save the postponed state for later
await savePostponedState(postponed);

// Send prelude to client or CDN.
```

その後、`prelude` シェルをクライアントに返し、後で `resume` を呼び出して SSR ストリーム内に「再開」できます。

```
const postponed = await getPostponedState(request);
const resumeStream = await resume(<App />, postponed);

// Send stream to client.
```

または `resumeAndPrerender` を呼び出して、SSG 用の静的 HTML を取得することもできます。

```
const postponedState = await getPostponedState(request);
const { prelude } = await resumeAndPrerender(<App />, postponedState);

// Send complete HTML prelude to CDN.
```

詳細については、新しい API のドキュメントを参照してください。
- `react-dom/server`
  - [`resume`](/reference/react-dom/server/resume): Web ストリーム用
  - [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream): Node ストリーム用
- `react-dom/static`
  - [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender): Web ストリーム用
  - [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream): Node ストリーム用

加えて、prerender 系 API は、`resume` 系 API に渡すための `postpone` ステートを返すようになりました。

---

## 注目すべき変更点 {/*notable-changes*/}

### SSR におけるサスペンスバウンダリのバッチ処理 {/*batching-suspense-boundaries-for-ssr*/}

サスペンスバウンダリの表示のされ方が、クライアントでレンダーされる場合とサーバサイドレンダリングからストリーミングされる場合とで異なる、という動作上のバグを修正しました。

19.2 以降の React では、サーバでレンダーされた複数のサスペンスバウンダリが短時間で立て続けに表示へ切り替わるとき、それをバッチ処理することで、より多くのコンテンツが同時に表示へ切り替わるようにし、クライアントでレンダーされた場合の動作と一致させます。

<Diagram name="19_2_batching_before" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the top half of the page revealed and highlighted in blue. The third panel shows the entire the page revealed and highlighted in blue.">

これまでは、サーバサイドレンダリングのストリーミング中に、サスペンスのコンテンツがフォールバックを即座に置き換えていた。

</Diagram>

<Diagram name="19_2_batching_after" height={162} width={1270} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a page rectangle showing a glimmer loading state with faded bars. The second panel shows the same page. The third panel shows the entire the page revealed and highlighted in blue.">

React 19.2 では、サスペンスバウンダリは短い時間バッチ処理され、より多くのコンテンツを同じタイミングで表示できるようになる。

</Diagram>

この修正は、SSR 中のサスペンスに対する `<ViewTransition>` サポートの準備にもなっています。より多くのコンテンツをまとめて表示に切り替えることで、アニメーションがより大きなコンテンツのまとまりで実行され、五月雨式に小刻みなコンテンツのアニメーションが発生するのを回避できます。

<Note>

React は、このスロットリングが core web vital や検索ランキングに影響を与えないようにするためのヒューリスティックを使用します。

例えば、ページのトータル読み込み時間が 2.5 秒（[LCP](https://web.dev/articles/lcp) で "good" と見なされる時間）に近づいている場合、スロットリングが指標悪化の原因とならないよう、React はバッチ処理を停止して即座にコンテンツを表示します。

</Note>

---

### SSR：Node での Web ストリームサポート {/*ssr-web-streams-support-for-node*/}

React 19.2 では、Node.js においてもストリーミング SSR のための Web ストリームのサポートが追加されます。
- [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) が Node.js で利用可能になりました。
- [`prerender`](/reference/react-dom/static/prerender) が Node.js で利用可能になりました。

新しい `resume` API も同様です。
- [`resume`](/reference/react-dom/server/resume) が Node.js で利用可能です。
- [`resumeAndPrerender`](/reference/react-dom/static/resumeAndPrerender) が Node.js で利用可能です。


<Pitfall>

#### Node.js でのサーバサイドレンダリングには Node ストリームを推奨 {/*prefer-node-streams-for-server-side-rendering-in-nodejs*/}

Node.js 環境では、引き続き Node ストリーム API の使用を強く推奨します。

- [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)
- [`resumeToPipeableStream`](/reference/react-dom/server/resumeToPipeableStream)
- [`prerenderToNodeStream`](/reference/react-dom/static/prerenderToNodeStream)
- [`resumeAndPrerenderToNodeStream`](/reference/react-dom/static/resumeAndPrerenderToNodeStream)

これは、Node においては Node ストリームが Web ストリームよりはるかに高速であり、また Web ストリームはデフォルトで圧縮をサポートしていないため、ユーザがストリーミングの恩恵を受けられなくなってしまう可能性があるためです。

</Pitfall>

---

### `eslint-plugin-react-hooks` v6 {/*eslint-plugin-react-hooks*/}

`eslint-plugin-react-hooks@latest` も公開されました。`recommended` プリセットではデフォルトで flat config が使用され、新しい React Compiler を利用したルールがオプトインで利用できます。

レガシー config を引き続き使用するには、`recommended-legacy` に変更できます。

```diff
- extends: ['plugin:react-hooks/recommended']
+ extends: ['plugin:react-hooks/recommended-legacy']
```

コンパイラ対応のルールの完全なリストについては、[リンタのドキュメントを確認してください](/reference/eslint-plugin-react-hooks#recommended)。

変更の完全なリストについては、`eslint-plugin-react-hooks` の [changelog を確認してください](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/CHANGELOG.md#610)。

---

### デフォルトの `useId` プレフィックスの更新 {/*update-the-default-useid-prefix*/}

19.2 では、デフォルトの `useId` プレフィックスを `:r:` (19.0.0) または `«r»` (19.1.0) から `_r_` に更新しています。

CSS セレクタとして無効な特殊文字を使用していた元々の意図は、ユーザが記述する ID と衝突する可能性を下げるためでした。しかし、View Transitions をサポートするためには、`useId` によって生成される ID が `view-transition-name` および XML 1.0 name として有効であることを保証する必要があります。

---

## 変更履歴 {/*changelog*/}

その他の注目すべき変更
- `react-dom`: 巻き上げ可能な style で nonce を使用できるように [#32461](https://github.com/facebook/react/pull/32461)
- `react-dom`: React が所有するノードをコンテナとして使用し、テキストコンテンツも含まれている場合に警告を表示 [#32774](https://github.com/facebook/react/pull/32774)

注目すべきバグ修正
- `react`: コンテクストを "SomeContext.Provider" ではなく "SomeContext" として文字列化 [#33507](https://github.com/facebook/react/pull/33507)
- `react`: popstate イベントでの無限 useDeferredValue ループを修正 [#32821](https://github.com/facebook/react/pull/32821)
- `react`: useDeferredValue に初期値が渡されたときのバグを修正 [#34376](https://github.com/facebook/react/pull/34376)
- `react`: クライアント Action でフォームを送信するときのクラッシュを修正 [#33055](https://github.com/facebook/react/pull/33055)
- `react`: dehydrated suspense バウンダリが再サスペンドした場合にコンテンツを非表示/表示 [#32900](https://github.com/facebook/react/pull/32900)
- `react`: Hot Reload 中に大きなツリーで発生するスタックオーバーフローを回避 [#34145](https://github.com/facebook/react/pull/34145)
- `react`: 複数のコンポーネントスタック改善 [#33629](https://github.com/facebook/react/pull/33629), [#33724](https://github.com/facebook/react/pull/33724), [#32735](https://github.com/facebook/react/pull/32735), [#33723](https://github.com/facebook/react/pull/33723)
- `react`: React.lazy されたコンポーネント内での React.use のバグ修正 [#33941](https://github.com/facebook/react/pull/33941)
- `react-dom`: ARIA 1.3 属性が使用されたときの警告を停止 [#34264](https://github.com/facebook/react/pull/34264)
- `react-dom`: Suspense フォールバック内の深くネストされた Suspense のバグを修正 [#33467](https://github.com/facebook/react/pull/33467)
- `react-dom`: レンダー中に中断した後にサスペンドするときのハングを回避 [#34192](https://github.com/facebook/react/pull/34192)

変更の完全なリストについては、[Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md) を参照してください。


---

_この投稿を[書いてくれた](https://www.youtube.com/shorts/T9X3YkgZRG0) [Ricky Hanlon](https://bsky.app/profile/ricky.fm)、およびこの投稿をレビューしてくれた [Dan Abramov](https://bsky.app/profile/danabra.mov)、[Matt Carroll](https://twitter.com/mattcarrollcode)、[Jack Pope](https://jackpope.me)、[Joe Savona](https://x.com/en_JS) に感謝します。_
