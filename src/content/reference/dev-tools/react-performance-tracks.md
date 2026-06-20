---
title: React パフォーマンストラック
---

<Intro>

React パフォーマンストラック (React Performance tracks) は、ブラウザの開発者ツールにあるパフォーマンスパネルのタイムラインに表示される特別なカスタムエントリです。

</Intro>

これらのトラックは、ネットワークリクエスト、JavaScript の実行、イベントループのアクティビティなど、他の重要なデータソースと並べて React 固有のイベントやメトリクスを可視化することで、React アプリケーションのパフォーマンスに関する包括的な情報を開発者に提供するように設計されています。これらはすべてパフォーマンスパネル内の統一されたタイムラインで同期され、アプリケーションの動作の全体像を把握できるようになります。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/overview.png" alt="React Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/overview.dark.png" alt="React Performance Tracks" />
</div>

<InlineToc />

---

## 使用法 {/*usage*/}

React パフォーマンストラックは、開発用ビルドおよびプロファイリングビルドの React でのみ使用できます。

- **開発用**: デフォルトで有効になっています。
- **プロファイリング**: Scheduler トラックのみがデフォルトで有効になっています。コンポーネントトラックには、[`<Profiler>`](/reference/react/Profiler) でラップされたサブツリー内のコンポーネントのみが表示されます。[React Developer Tools 拡張機能](/learn/react-developer-tools)が有効になっている場合、`<Profiler>` でラップされていないコンポーネントもコンポーネントトラックに含まれます。サーバトラックはプロファイリングビルドでは利用できません。

有効になっている場合、[拡張 API](https://developer.chrome.com/docs/devtools/performance/extension) を提供するブラウザのパフォーマンスパネルで記録したトレースに、トラックが自動的に表示されます。

<Pitfall>

React パフォーマンストラックを動かすプロファイリング機能には追加のオーバーヘッドが生じるため、デフォルトでは本番用ビルドでは無効になっています。
サーバコンポーネントおよびサーバリクエストのトラックは、開発用ビルドでのみ利用できます。

</Pitfall>

### プロファイリングビルドの使用 {/*using-profiling-builds*/}

本番用ビルドと開発用ビルドに加えて、React には特別なプロファイリングビルドが含まれています。
プロファイリングビルドを使用するには、`react-dom/client` の代わりに `react-dom/profiling` を使用する必要があります。
各 `react-dom/client` のインポートを手動で更新するのではなく、バンドラのエイリアス機能を使ってビルド時に `react-dom/client` を `react-dom/profiling` にエイリアスすることをお勧めします。
使用しているフレームワークによっては、React のプロファイリングビルドを有効にするための組み込みサポートがある場合があります。

---

## トラック {/*tracks*/}

### Scheduler {/*scheduler*/}

Scheduler は、異なる優先度を持つタスクを管理するために使用される React の内部概念です。このトラックは 4 つのサブトラックで構成され、それぞれが特定の優先度の作業を表しています。

- **Blocking (ブロッキング)** - ユーザ操作によって開始された可能性のある同期更新です。
- **Transition (トランジション)** - 通常は [`startTransition`](/reference/react/startTransition) 経由で開始される、バックグラウンドで行われる非ブロッキング作業です。
- **Suspense** - フォールバックの表示やコンテンツの表示など、Suspense バウンダリに関連する作業です。
- **Idle (アイドル)** - より高い優先度のタスクがない場合に行われる最も低い優先度の作業です。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler.png" alt="Scheduler track" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler.dark.png" alt="Scheduler track" />
</div>

#### レンダー {/*renders*/}

各レンダーのパスは、タイムラインで確認できる複数のフェーズで構成されています。

- **Update (更新)** - 新しいレンダーパスのきっかけとなったものです。
- **Render (レンダー)** - React がコンポーネントのレンダー関数を呼び出し、更新されたサブツリーをレンダーします。レンダーされたコンポーネントのサブツリーは[コンポーネントトラック](#components)で確認でき、同じ配色が使われます。
- **Commit (コミット)** - コンポーネントをレンダーした後、React は変更を DOM に反映し、[`useLayoutEffect`](/reference/react/useLayoutEffect) のようなレイアウトエフェクトを実行します。
- **Remaining Effects (残りのエフェクト)** - React はレンダーされたサブツリーのパッシブエフェクトを実行します。これは通常ペイント後に行われ、[`useEffect`](/reference/react/useEffect) のようなフックが実行されるタイミングです。既知の例外として、クリックなどのユーザ操作やその他の個別のイベントがあります。この場合、このフェーズがペイントの前に実行される可能性があります。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-update.png" alt="Scheduler track: updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-update.dark.png" alt="Scheduler track: updates" />
</div>

[レンダーとコミットの詳細を学ぶ](/learn/render-and-commit)

#### カスケード更新 {/*cascading-updates*/}

カスケード更新は、パフォーマンスの低下を引き起こすパターンの 1 つです。レンダーパス中に更新がスケジュールされた場合、React は完了した作業を破棄して新たにレンダリングを開始する可能性があります。

開発用ビルドでは、React はどのコンポーネントが新しい更新をスケジュールしたかを表示できます。これには一般的な更新とカスケード更新の両方が含まれます。"Cascading update"エントリをクリックすると、拡張されたスタックトレースが表示され、更新をスケジュールしたメソッドの名前も確認できます。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-cascading-update.png" alt="Scheduler track: cascading updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-cascading-update.dark.png" alt="Scheduler track: cascading updates" />
</div>

[エフェクトの詳細を学ぶ](/learn/you-might-not-need-an-effect)

### Components {/*components*/}

コンポーネントトラックは、React コンポーネントの継続時間を可視化します。フレームグラフとして表示され、各エントリは対応するコンポーネントのレンダーとすべての子コンポーネントの継続時間を表します。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-render.png" alt="Components track: render durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-render.dark.png" alt="Components track: render durations" />
</div>

エフェクトの継続時間もレンダーの継続時間と同様に、フレームグラフとして表示されますが、Scheduler トラック上の対応するフェーズに合わせて配色が異なります。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-effects.png" alt="Components track: effects durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-effects.dark.png" alt="Components track: effects durations" />
</div>

<Note>

レンダーとは異なり、デフォルトではすべてのエフェクトがコンポーネントトラックに表示されるわけではありません。

パフォーマンスを維持し、UI の乱雑さを防ぐために、React は 0.05 ミリ秒以上の継続時間を持つエフェクト、または更新をトリガしたエフェクトのみを表示します。

</Note>

レンダーとエフェクトのフェーズ中に、追加のイベントが表示される場合があります。

- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Mount</span> - コンポーネントのレンダーまたはエフェクトの対応するサブツリーがマウントされました。
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Unmount</span> - コンポーネントのレンダーまたはエフェクトの対応するサブツリーがアンマウントされました。
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Reconnect</span> - Mount と似ていますが、[`<Activity>`](/reference/react/Activity) が使用されている場合に限定されます。
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Disconnect</span> - Unmount と似ていますが、[`<Activity>`](/reference/react/Activity) が使用されている場合に限定されます。

#### 変更された props {/*changed-props*/}

開発用ビルドでは、コンポーネントのレンダーエントリをクリックすると、props の潜在的な変更を検査できます。この情報を利用して、不要なレンダーを特定できます。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/changed-props.png" alt="Components track: changed props" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/changed-props.dark.png" alt="Components track: changed props" />
</div>

### Server {/*server*/}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/server-overview.png" alt="React Server Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/server-overview.dark.png" alt="React Server Performance Tracks" />
</div>

#### Server Requests {/*server-requests*/}

サーバリクエストトラックは、最終的に React Server Component 内で使われるすべての Promise を可視化します。これには、`fetch` の呼び出しや非同期 Node.js ファイル操作などの `async` 操作が含まれます。

React は、サードパーティのコードから開始された Promise を、ファーストパーティコードをブロックする操作全体の継続時間を表す単一のスパンに結合しようとします。
例えば、内部的に複数回 `fetch` を呼び出す `getUser` というサードパーティライブラリのメソッドは、複数の `fetch` スパンを表示するのではなく、`getUser` という単一のスパンとして表されます。

スパンをクリックすると、Promise が作成された場所のスタックトレースと、利用可能な場合は Promise が解決した値のビューが表示されます。

拒否された Promise は、拒否された値とともに赤色で表示されます。

#### Server Components {/*server-components*/}

サーバコンポーネントトラックは、React Server Components と、それらが待機した Promise の所要時間を可視化します。タイミングはフレームグラフとして表示され、各エントリは対応するコンポーネントのレンダーとすべての子孫コンポーネントの所要時間を表します。

Promise を待機する場合、React はその Promise の継続時間を表示します。すべての I/O 操作を確認するには、サーバリクエストトラックを使用してください。

コンポーネントのレンダーの継続時間を示すために異なる色が使用されます。色が濃いほど、継続時間が長いことを示します。

サーバコンポーネントトラックグループには、常に"Primary"トラックが含まれます。React がサーバコンポーネントを並行してレンダーできる場合、追加の"Parallel"トラックが表示されます。
8 つ以上のサーバコンポーネントが並行してレンダーされる場合、React はさらにトラックを追加するのではなく、最後の"Parallel"トラックに関連付けます。
