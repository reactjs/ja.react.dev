---
title: <Profiler>
---

<Intro>

`<Profiler>` を使うことで、React ツリーのレンダリングパフォーマンスをプログラムで測定することができます。

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<Profiler>` {/*profiler*/}

コンポーネントツリーを `<Profiler>` でラップすることで、レンダーのパフォーマンスを測定することができます。

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### props {/*props*/}

* `id`: UI のどの部分を測定対象としているのか識別するための文字列です。
* `onRender`: プロファイリング対象のツリー内のコンポーネントが更新されるたびに React が呼び出す [`onRender` コールバック](#onrender-callback)。何がレンダーされ、それにどれだけの時間がかかったかについての情報を受け取ります。

#### 注意点 {/*caveats*/}

* プロファイリングには追加のオーバーヘッドが発生するため、**デフォルトでは本番用ビルドでは無効になっています**。本番環境でプロファイリングを行うためには、[プロファイリングを有効にしたな特別な本番用ビルド](https://fb.me/react-profiling)を明示的に用いる必要があります。

---

### `onRender` コールバック {/*onrender-callback*/}

React は `onRender` コールバックを呼び出して、何がレンダーされたかについての情報を伝えます。

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### 引数 {/*onrender-parameters*/}

<<<<<<< HEAD
* `id`: たった今コミットされたツリーに対応する `<Profiler>` の `id` プロパティ。複数のプロファイラを使用している場合に、どのツリーがコミットされたかをこれにより識別できます。
* `phase`: `"mount"`、`"update"`、または `"nested-update"`。これにより、ツリーが初めてマウントされたのか、props、state、またはフックの変更により再レンダーされたのかを知ることができます。
* `actualDuration`: 現在の更新のために `<Profiler>` とその子要素がレンダーに費やしたミリ秒数。これは、サブツリーがメモ化（例：[`memo`](/reference/react/memo) と [`useMemo`](/reference/react/useMemo)）をどれだけうまく利用できているかを示すものです。理想的には、子要素の多くが自身の props が変更された場合にのみ再レンダーされるようになることで、この値は初回マウント後に大幅に減少していくはずです。
* `baseDuration`: もし最適化なしで `<Profiler>` サブツリー全体を再レンダーした場合にかかる時間をミリ秒で推定した数値。ツリー内の各コンポーネントの最後のレンダーにかかった時間を合計することで計算されます。この値は、最悪のツリーのレンダーコスト（例：初回マウントやメモ化がない場合）を推定します。メモ化が機能しているかどうかを確認するには、この値を `actualDuration` と比較します。
* `startTime`: React が現在の更新のレンダーを開始した時刻のタイムスタンプ。
* `endTime`: React が現在の更新をコミットした時刻のタイムスタンプ。この値は単一コミット内のすべてのプロファイラ間で共有されるため、必要に応じてグループ化するために利用できます。
=======
* `id`: The string `id` prop of the `<Profiler>` tree that has just committed. This lets you identify which part of the tree was committed if you are using multiple profilers.
* `phase`: `"mount"`, `"update"` or `"nested-update"`. This lets you know whether the tree has just been mounted for the first time or re-rendered due to a change in props, state, or hooks.
* `actualDuration`: The number of milliseconds spent rendering the `<Profiler>` and its descendants for the current update. This indicates how well the subtree makes use of memoization (e.g. [`memo`](/reference/react/memo) and [`useMemo`](/reference/react/useMemo)). Ideally this value should decrease significantly after the initial mount as many of the descendants will only need to re-render if their specific props change.
* `baseDuration`: The number of milliseconds estimating how much time it would take to re-render the entire `<Profiler>` subtree without any optimizations. It is calculated by summing up the most recent render durations of each component in the tree. This value estimates a worst-case cost of rendering (e.g. the initial mount or a tree with no memoization). Compare `actualDuration` against it to see if memoization is working.
* `startTime`: A numeric timestamp for when React began rendering the current update.
* `commitTime`: A numeric timestamp for when React committed the current update. This value is shared between all profilers in a commit, enabling them to be grouped if desirable.
>>>>>>> 68f417a600c7d7b8c4131e39f8a843a856ae3909

---

## 使用法 {/*usage*/}

### レンダーのパフォーマンスをプログラムで測定する {/*measuring-rendering-performance-programmatically*/}

React ツリーを `<Profiler>` コンポーネントで囲むことで、そのレンダーのパフォーマンスを測定します。

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

`id`（文字列）と `onRender` コールバック（関数）の 2 つの props が必要です。React はツリー内のコンポーネントが更新を「コミット」するたびにこれを呼び出します。

<Pitfall>

プロファイリングには追加のオーバーヘッドが発生するため、**デフォルトでは本番用ビルドでは無効になっています**。本番環境でプロファイリングを行うためには、[プロファイリングを有効にしたな特別な本番用ビルド](https://fb.me/react-profiling)を明示的に用いる必要があります。

</Pitfall>

<Note>

`<Profiler>` を使うことで測定結果をプログラムで収集することができます。対話型のプロファイラを使いたい場合は、[React Developer Tools](/learn/react-developer-tools) の Profiler タブを試してみてください。これは同様の機能をブラウザの拡張機能として提供します。

</Note>

---

### アプリケーションの複数部位を測定する {/*measuring-different-parts-of-the-application*/}

アプリケーションの複数の部位を測定するために、複数の `<Profiler>` コンポーネントを使用することができます。

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

また、`<Profiler>` コンポーネントをネストすることもできます。

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

`<Profiler>` は軽量なコンポーネントですが、必要な場合にのみ使用するべきです。使用するたびにアプリケーションに一定の CPU とメモリのオーバーヘッドが生じます。

---

