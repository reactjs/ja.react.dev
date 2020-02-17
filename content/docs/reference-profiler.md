---
id: profiler
title: プロファイラ API
layout: docs
category: Reference
permalink: docs/profiler.html
---

<<<<<<< HEAD
`Profiler` を使って、React アプリケーションのレンダーの頻度やレンダーの「コスト」を計測することができます。
本機能の目的は、アプリケーション中の、低速で[メモ化などの最適化](https://reactjs.org/docs/hooks-faq.html#how-to-memoize-calculations)が有効な可能性のある部位を特定する手助けをすることです。
=======
The `Profiler` measures how often a React application renders and what the "cost" of rendering is.
Its purpose is to help identify parts of an application that are slow and may benefit from [optimizations such as memoization](/docs/hooks-faq.html#how-to-memoize-calculations).
>>>>>>> 5af5fba65a7e9570a4d00c85d8a17b6cdc166bb6

> 補足:
>
<<<<<<< HEAD
> プロファイリングによる追加のオーバーヘッドが生じますので、**[本番ビルド](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)では無効化されます**.
=======
> Profiling adds some additional overhead, so **it is disabled in [the production build](/docs/optimizing-performance.html#use-the-production-build)**.
>>>>>>> 5af5fba65a7e9570a4d00c85d8a17b6cdc166bb6
>
> 本番環境でプロファイリングを利用するために、React はプロファイリングを有効化した特別な本番用ビルドを提供しています。
> このビルドの使用方法については [fb.me/react-profiling](https://fb.me/react-profiling) をご覧ください。

## 使用法 {#usage}

`Profiler` は React ツリー内の特定部位におけるレンダーのコストを計測するため、ツリー内のどこにでも追加できます。
2 つの props が必要です。`id`（文字列）と、ツリー内のコンポーネントが更新を「コミット」した際に React が毎回呼び出す `onRender` コールバック（関数）です。

例えば、`Navigation` コンポーネントとその子孫のプロファイリングを行うには：

```js{3}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

アプリケーション内の複数部位の計測を行うために複数の `Profiler` コンポーネントを使うことができます：
```js{3,6}
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Profiler id="Main" onRender={callback}>
      <Main {...props} />
    </Profiler>
  </App>
);
```

同一のサブツリー内の複数のコンポーネントで計測を行うために `Profiler` コンポーネントをネストすることもできます：
```js{2,6,8}
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```

> 補足
>
> `Profiler` は軽いコンポーネントですが、必要な時にのみ利用すべきです。使うごとにアプリケーションに多少の CPU およびメモリオーバーヘッドが生じます。

## `onRender` コールバック {#onrender-callback}

`Profiler` には props として `onRender` 関数を渡す必要があります。
プロファイリングされているツリー内のコンポーネントが更新を「コミット」した際に、Raect がこの関数を毎回呼び出します。
この関数は、レンダー内容とかかった時間に関する情報を引数として受け取ります。

```js
function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
}
```

それぞれを詳細に見てみましょう：

* **`id: string`** - 
コミットが起きた `Profiler` の `id` プロパティ。
複数のプロファイラを使用している場合にどのツリーにコミットが起きたのかを区別するのに使うことができます。
* **`phase: "mount" | "update"`** -
ツリーが初回マウントされたのか、props や state、フックの変更によって再レンダーされたのかを区別します。
* **`actualDuration: number`** -
現在の更新で `Profiler` とその子孫のレンダーに要した時間。
これが（[`React.memo`](/docs/react-api.html#reactmemo)、[`useMemo`](/docs/hooks-reference.html#usememo)、[`shouldComponentUpdate`](/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate) などの）メモ化をどれだけうまく有効に使えているかの指標となります。
理想的には、子孫要素は特定の props が変化した場合にのみ再レンダーされるため、初回マウント時以降にこの値は大幅に小さくなるはずです。
* **`baseDuration: number`** -
`Profiler` ツリー内のそれぞれのコンポーネントの直近の `render` 時間。
この値を使って最悪の場合のレンダーコスト（初回マウント時や、メモ化の一切ないツリーの場合）を見積もることができます。
* **`startTime: number`** -
現在の更新のレンダーを React が開始した時刻に対応するタイムスタンプ。
* **`commitTime: number`** -
現在の更新を React がコミットした時刻に対応するタイムスタンプ。
必要に応じてグループ化できるよう、1 コミット内のすべてのプロファイラ間でこの値は共有されます。
* **`interactions: Set`** -
更新がスケジュールされた（`render` や `setState` の呼び出しなどにより）際に trace された ["interaction"](https://fb.me/react-interaction-tracing) の Set。

> 補足
>
> 更新の原因を特定するために interaction を利用可能ですが、trace 用の API は依然実験的です。
>
> [fb.me/react-interaction-tracing](https://fb.me/react-interaction-tracing) に詳細があります。
