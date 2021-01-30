---
id: concurrent-mode-patterns
title: 並列的 UI パターン（実験的機能）
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>警告:
>
> このページでは**安定リリースで[まだ利用できない](/docs/concurrent-mode-adoption.html)実験的機能**を説明しています。本番のアプリケーションで React の実験的ビルドを利用しないでください。これらの機能は React の一部となる前に警告なく大幅に変更される可能性があります。
>
> このドキュメントは興味のある読者やアーリーアダプター向けのものです。**React が初めての方はこれらの機能を気にしないで構いません** -- 今すぐに学ぶ必要はありません。例えば、もし今すぐ使えるデータ取得のチュートリアルをお探しの場合は、代わりに[この記事](https://www.robinwieruch.de/react-hooks-fetch-data/)をご覧ください。

</div>

通常、state を更新した場合、画面に即座に変化が現れることを期待します。ユーザ入力に対してアプリケーションをレスポンシブに保ちたいので、これは理にかなっています。しかし、**画面に更新が現れるのを遅延**させたい場合があります。

例えば、ある画面から別の画面に切り替えたいが、次の画面に必要なコードやデータが何もロードされていないという場合、切り替え直後に、ロード中インジケータだけがある空のページを見せられるのは煩わしいものです。前の画面にもうしばらく残りたいと思うでしょう。歴史的に React ではこのパターンの実装は困難でした。並列モードはこれを行うための新たなツール群を提供します。

- [トランジション](#transitions)
  - [トランジション内で setState をラップする](#wrapping-setstate-in-a-transition)
  - [Pending インジケータの追加](#adding-a-pending-indicator)
  - [変更のおさらい](#reviewing-the-changes)
  - [更新はどこで起こるのか？](#where-does-the-update-happen)
  - [トランジションは至る所にある](#transitions-are-everywhere)
  - [トランジションをデザインシステムに組み込む](#baking-transitions-into-the-design-system)
- [3 つのステップ](#the-three-steps)
  - [デフォルト：Receded → Skeleton → Complete](#default-receded-skeleton-complete)
  - [推奨：Pending → Skeleton → Complete](#preferred-pending-skeleton-complete)
  - [遅延可能な機能を `<Suspense>` でラップする](#wrap-lazy-features-in-suspense)
  - [「電車」式のサスペンス開放](#suspense-reveal-train)
  - [Pending インジケータの遅延](#delaying-a-pending-indicator)
  - [まとめ](#recap)
- [他のパターン](#other-patterns)
  - [高優先度 state と低優先度 state の分割](#splitting-high-and-low-priority-state)
  - [値の遅延](#deferring-a-value)
  - [SuspenseList](#suspenselist)
- [次のステップ](#next-steps)

## トランジション {#transitions}

前のページ、[サスペンスを使ったデータ取得](/docs/concurrent-mode-suspense.html)にある[こちらのデモ](https://codesandbox.io/s/infallible-feather-xjtbu)について改めて考えましょう。

"Next" ボタンをクリックしてアクティブなプロフィールを切り替えた際、既存のページデータは即座に消えて、新しい画面のためのローディングインジケータを見ることになります。これは「望ましくない」ローディング中状態と呼べるでしょう。**これをスキップして、新しい画面に遷移 (transition) する前に新しいコンテンツがロードされるのを待機できれば良さそうです。**

React はこれを補助するたに `useTransition()` という新しい組み込みフックを提供します。

これは以下の 3 ステップで利用できます。

まず、実際に並列モードを利用していることを確かめます。後で[並列モードの利用開始](/docs/concurrent-mode-adoption.html)方法については述べますが、今のところは `ReactDOM.render()` の代わりに `ReactDOM.createRoot()` を使うことでこの機能が使える、ということを知っていれば十分です。

```js
const rootElement = document.getElementById("root");
// Opt into Concurrent Mode
ReactDOM.createRoot(rootElement).render(<App />);
```

次に、React から `useTransition` フックをインポートする文を追加します：

```js
import React, { useState, useTransition, Suspense } from "react";
```

最後に、`App` コンポーネント内でそれを利用します：

```js{3-5}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  // ...
```

**このコードはそれ自体ではまだ何もしません。**このフックの戻り値を使って state のトランジションをセットアップします。`useTransition` からの戻り値は 2 つです：

* `startTransition` は関数です。これを使って、*どの* state の更新を遅延させたいのかを React に伝えます。
* `isPending` は真偽値です。React はこれを使って現在トランジションが進行中かどうかを伝えます。

このすぐ後で使ってみます。

`useTransition` に設定オブジェクトを渡したことに気をつけてください。この `timeoutMs` プロパティで**トランジションが終了するまでどれだけ待てるか**を指定します。`{timeoutMs: 3000}` を渡すことで、「次のプロフィール画面がロードされるのに 3 秒以上かかったら、大きなスピナーを表示せよ、ただしそれまでは前の画面を表示しつづけていて構わない」ということを伝えています。

### トランジション内で setState をラップする {#wrapping-setstate-in-a-transition}

"Next" ボタンのクリックハンドラは、現在のプロフィールを切り替えるための state を設定しています：

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

この state の更新を `startTransition` でラップします。これが、もしこの state の更新によって望ましくないローディング中状態の表示が起きる場合、**React がこの state 更新を遅延させても構わない**、と React に伝える方法です：

```js{3,6}
<button
  onClick={() => {
    startTransition(() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    });
  }}
>
```

**[CodeSandbox で試す](https://codesandbox.io/s/musing-driscoll-6nkie)**

何度か "Next" を押してみましょう。既に大きく違っていることが分かるでしょう。**クリック直後に空の画面を見せられる代わりに、しばらくは前のページが表示され続けます。**データがロードされたら、React が次の画面に遷移します。

もし API のレスポンスを 5 秒かかるように変えると、React は 3 秒後に「諦めて」、ともかく画面の遷移を行うことが[確認できます](https://codesandbox.io/s/relaxed-greider-suewh)。これは `useTransition()` に `{timeoutMs: 3000}` を渡したからです。もし `{timeoutMs: 60000}` を代わりに渡したら、丸々 1 分間待つことになるでしょう。

### Pending インジケータの追加 {#adding-a-pending-indicator}

[前回の例](https://codesandbox.io/s/musing-driscoll-6nkie)にはまだうまく行っていないところがあります。「望ましくない」ローディング中状態は、もちろん見えない方がいいです。**ですが進行状況が一切見えないのはもっとダメに感じられます！** "Next" をクリックして何も起こらなかったなら、アプリケーションが壊れているように思うでしょう。

`useTransition()` の呼び出しは、2 つの値を返します。`startTransition` と `isPending` です。

```js
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });
```

`startTransition` はもう使っています。ここで `isPending` も使うようにします。React がこの真偽値を渡してくれることで、**このトランジションの完了を待っているところかどうか**が分かります。何かが起こっている、ということを示すためにこれを使いましょう：

```js{4,14}
return (
  <>
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          const nextUserId = getNextId(resource.userId);
          setResource(fetchProfileData(nextUserId));
        });
      }}
    >
      Next
    </button>
    {isPending ? " Loading..." : null}
    <ProfilePage resource={resource} />
  </>
);
```

**[CodeSandbox で試す](https://codesandbox.io/s/jovial-lalande-26yep)**

ずっと良く感じられるようになりました！ Next をクリックすると、何度も押しても意味がないのでボタンは無効化されます。そして新たに表示される "Loading..." が、ユーザにアプリケーションがフリーズしていないということを伝えています。

### 変更のおさらい {#reviewing-the-changes}

[元の例](https://codesandbox.io/s/infallible-feather-xjtbu)以降に行った変更をもう一度すべて見てみましょう：

```js{3-5,9,11,14,19}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 3000
  });
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/jovial-lalande-26yep)**

このトランジションを加えるのに必要だったコードはわずか 7 行でした。

* `useTransition` フックをインポートして、state を更新するコンポーネント内で使いました。
* `{timeoutMs: 3000}` を渡すことで、最高 3 秒間は前の画面に留まるようにしました。
* state の更新を `startTransition` でラップし、この更新は遅延可能であると伝えました。
* `isPending` を使って、ユーザにトランジションの進行状況を伝えるとともに、ボタンを無効化しました。

結果として、"Next" をクリックしても「望ましくない」ローディング中状態に直接遷移するのではなく、前の画面に留まってユーザに進行状況を伝えるようになりました。

### 更新はどこで起こるのか？ {#where-does-the-update-happen}

これを実装するのはあまり難しくありませんでした。しかしこれがどうやって動作しているのかを考え始めると、ちょっと混乱しそうになります。state を設定したのに、なぜその結果がすぐ現れなかったのでしょうか。次の `<ProfilePage>` は*どこで*レンダーされているのでしょうか？

明らかに、`<ProfilePage>` の両方の「バージョン」が同時に存在しているのです。古いバージョンが存在していることは、画面に表示されており進行中のインジケータまで表示しているということから分かります。また新しいバージョンが*どこかに*存在しているということも分かります。まさにそれが完了するのを待っているのですから！

**ですが、同じコンポーネントの 2 つのバージョンがどうやって同時に存在できるのでしょうか？**

これが並列モードの根幹にあたる部分です。これは React が state の更新を「ブランチ」で行っているようなものであると[以前述べました](/docs/concurrent-mode-intro.html#intentional-loading-sequences)。これを概念化する別の方法として、`startTransition` で state の更新をラップすることで、SF 映画のごとくレンダーが*「別の宇宙で」*始まるのだと考えることができます。その宇宙を直接「見る」ことはできません -- しかしその宇宙からは何かが起きているという信号 (`isPending`) を得ることはできます。更新の準備が完了したところで、「2 つの宇宙」がマージされ、画面に結果が表示されます！

[デモ](https://codesandbox.io/s/jovial-lalande-26yep)で遊んでみて、そのようなことが起きているところを想像してみてください。

もちろん、ツリーの 2 つのバージョンが*同時に*レンダーされているというのは錯覚であり、それはあなたのコンピュータ上のプログラムが全部同時に実行されていると考えることが錯覚であるのと同じです。オペレーティング・システムは複数のアプリケーションを非常に素早く切り替えているのです。同様に React は、画面上に見えているツリーのバージョンと、次に表示されるために「準備中」のバージョンとを切り替えています。

`useTransition` のような API を使うことで、望ましいユーザ体験に集中でき、それがどのような仕組みで実現されているのかについて気にしないでよくなります。それでも、`startTransition` でラップした更新が「ブランチ」や「別世界」で起こっていると想像するのは例え話としては有用です。

### トランジションは至る所にある {#transitions-are-everywhere}

[サスペンスの解説](/docs/concurrent-mode-suspense.html)で学んだ通り、コンポーネントはそれが必要とするデータがまだ準備できていない場合にいつでも「サスペンド」することができます。計画的にツリー内の様々な場所に `<Suspense>` バウンダリを配置することでこれを制御できますが、それでは十分でないことがあります。

プロフィールが 1 つだけだった最初の[サスペンスのデモ](https://codesandbox.io/s/frosty-hermann-bztrp)に戻りましょう。今のところはデータを 1 回だけ取得しています。サーバ側に更新があるかを確認する "Refresh" ボタンを追加しましょう。

まずはこのようにしてみました：

```js{6-8,13-15}
const initialResource = fetchUserAndPosts();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchUserAndPosts());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button onClick={handleRefreshClick}>
        Refresh
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/boring-shadow-100tf)**

この例では、ロード時**および** "Refresh" を押下する度に、データ取得が開始されます。`fetchUserAndPosts()` を呼び出した結果を state 内に入れることで、配下のコンポーネントがたった今開始したリクエストから新しいデータを読み出せるようにします。

[こちら](https://codesandbox.io/s/boring-shadow-100tf)で試せるとおり、"Refresh" ボタンの押下は動作はしています。`<ProfileDetails>` と `<ProfileTimeline>` コンポーネントは新しいデータを表す `resource` を props として受け取り、レスポンスがまだ存在しないため「サスペンド」し、フォールバックが表示されます。レスポンスがロードされると、更新されたタイムライン投稿を見ることができます（フェイク API は 3 秒ごとに投稿を追加するようになっています）。

しかしながらユーザ体験はとても煩わしいものとなっています。ページをブラウズしているのに、操作の真っ最中にページがローディング中状態で置き換わってしまうのです。これはユーザを混乱させます。**これまでと同様に、望ましくないローディング中状態を回避するために、state の更新をトランジションでラップできます：**

```js{2-5,9-11,21}
function ProfilePage() {
  const [startTransition, isPending] = useTransition({
    // Wait 10 seconds before fallback
    timeoutMs: 10000
  });
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    startTransition(() => {
      setResource(fetchProfileData());
    });
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button
        onClick={handleRefreshClick}
        disabled={isPending}
      >
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/sleepy-field-mohzb)**

ずっと良く感じられます！ "Refresh" をクリックすることで今ブラウズしていたページから引き離されることがなくなりました。何かがロード中であると「インライン」で見ることができ、データの準備が完了したらそれが表示されます。

### トランジションをデザインシステムに組み込む {#baking-transitions-into-the-design-system}

これで `useTransition` の要求は*非常に*よくあるものであることが分かったでしょう。コンポーネントのサスペンドを引き起こすような、ほぼあらゆるボタンクリックやユーザ操作は、`useTransition` でラップして、ユーザが触っていたものをうっかり隠さないようにする必要があります。

これはコンポーネント間で多くのコードの反復を引き起こす可能性があります。このため、**`useTransition` を*デザインシステム*コンポーネントに組み込む**ことをお勧めします。例えば、トランジションのロジックを独自の `<Button>` コンポーネントに抽出することができます。

```js{7-9,20,24}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  function handleClick() {
    startTransition(() => {
      onClick();
    });
  }

  const spinner = (
    // ...
  );

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isPending}
      >
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/modest-ritchie-iufrh)**

このボタンは*何の* state を更新しようとしているのか関知しないということに注意してください。これは `onClick` ハンドラ内部で起こる*あらゆる* state の更新をトランジションでラップしています。これで `<Button>` がトランジションの作成を行ってくれるようになったので、`<ProfilePage>` コンポーネントがそれを自ら作成する必要がなくなりました：

```js{4-6,11-13}
function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchProfileData());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Button onClick={handleRefreshClick}>
        Refresh
      </Button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/modest-ritchie-iufrh)**

ボタンがクリックされると、トランジションが開始され、内部の `props.onClick()` が呼び出されます。それが `<ProfilePage>` コンポーネント内の `handleRefreshClick` をトリガします。新しいデータの取得が開始されますが、トランジションの内部におり、かつ `useTransition` 呼び出しで指定されている 10 秒のタイムアウトがまだ経過していないため、フォールバックは呼び出されません。トランジションが進行している間、ボタンはインラインでローディングインジケータを表示します。

これで、コンポーネントの独立性やモジュール性を犠牲にすることなく良いユーザ体験を実現するのに、並列モードがどのように役立つのかが分かったと思います。React がトランジションの調整を行うのです。

## 3 つのステップ {#the-three-steps}

ここまでで、更新があったときに経由する可能性のある視覚的な状態についてすべて説明しました。このセクションでは、それらに名前を付け、それらの間での連続性について説明します。

<br>

<img src="../images/docs/cm-steps-simple.png" alt="Three steps" />

最後に存在しているのは **Complete** 状態です。ここが最終的に到達したい状態です。次画面が完全に描画されており、それ以上データを読み込んでいないタイミングを表しています。

しかし画面が Complete になる前に、何らかのデータやコードを読み込む必要があります。次画面を表示はしているが、その中の一部がまだロード中である場合、それを **Skeleton** 状態と呼びます。

最後に、Skeleton 状態に至るまでの経路が主に 2 つあります。具体的な例を使ってそれらの違いを述べたいと思います。

### デフォルト：Receded → Skeleton → Complete {#default-receded-skeleton-complete}

[こちらの例](https://codesandbox.io/s/prod-grass-g1lh5)を開いて "Open Profile" をクリックしてください。複数の視覚的な状態を 1 つずつ見ることができます。

* **Receded**: 1 秒間、`<h1>Loading the app...</h1>` フォールバックが表示されます。
* **Skeleton:** `<ProfilePage>` コンポーネントが表示され、中で `<h2>Loading posts...</h2>` が表示されます。
* **Complete:** `<ProfilePage>` コンポーネントが表示され、内部のフォールバックも表示されません。すべてのデータは取得済みです。

Receded 状態と Skeleton 状態はどのように区別するのでしょうか？ これらの違いは、**Receded** 状態はユーザからは「一歩後退中」のように見え、**Skeleton** 状態はより多くのコンテンツを見せるべく「一歩前進中」のように見えるということです。

今回の例は `<HomePage>` 画面から始まっています：

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

クリックすることで React は次の画面のレンダーを始めました：

```js
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

`<ProfileDetails>` も `<ProfileTimeline>` もレンダーするのにデータが必要なので、サスペンドします：

```js{4,6}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={<h2>Loading posts...</h2>}>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

コンポーネントがサスペンドすると、React は直近にあるフォールバックを表示する必要があります。しかし `<ProfileDetails>` の直近のフォールバックはトップレベルにあります：

```js{2,3,7}
<Suspense fallback={
  // We see this fallback now because of <ProfileDetails>
  <h1>Loading the app...</h1>
}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

これがボタンをクリックしたときに「一歩後退した」ように感じられる理由です。既に意味のあるコンテンツを表示していた `<Suspense>` バウンダリが一歩後退 (recede) してフォールバック (`<h1>Loading the app...</h1>`) を表示しなければなりませんでした。このことを **Receded** 状態と呼びます。

データをロードするにつれて、React は再レンダーを試み、`<ProfileDetails>` はうまく表示されるようになります。ついに **Skeleton** 状態に来たわけです。一部が欠けた新しいページが見えるようになります。

```js{6,7,9}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // We see this fallback now because of <ProfileTimeline>
      <h2>Loading posts...</h2>
    }>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

いずれ欠けている部分もロードされ、**Complete** 状態に至ります。

このシナリオ (Receded → Skeleton → Complete) がデフォルトです。しかし、Receded 状態は既に存在する情報を「隠す」ことになるのであまり嬉しいものではありません。これが React が `useTransition` によって別のシーケンス (**Pending** → Skeleton → Complete) を利用できるようにしている理由です。

### 推奨：Pending → Skeleton → Complete {#preferred-pending-skeleton-complete}

`useTransition` を使うと、React は前の画面に「留まって」、そちらで進行状況のインジケータを表示できるようにさせてくれます。この状態を **Pending** 状態と呼びます。これは既存のコンテンツが消えてしまうことがなく、ページの操作性が保たれるので、Receded 状態よりもずっと良いものに感じられます。

以下の 2 つの例を比較して、違いを感じてみてください：

* デフォルト：[Receded → Skeleton → Complete](https://codesandbox.io/s/prod-grass-g1lh5)
* **推奨：[Pending → Skeleton → Complete](https://codesandbox.io/s/focused-snow-xbkvl)**

この 2 つの例の唯一の違いは、前者が標準の `<button>` を使っており、後者は `useTransition` を使ったカスタムの `<Button>` を使っている、ということです。

### 遅延可能な機能を `<Suspense>` でラップする {#wrap-lazy-features-in-suspense}

[こちらの例](https://codesandbox.io/s/nameless-butterfly-fkw5q)を開いてください。ボタンを押下すると、先に進む前に Pending 状態が 1 秒間表示されます。このトランジションはスムースで良いものに感じられます。

ここでプロフィールページに新たな機能を付け加えましょう -- その人に関する豆知識（トリビア）のリストです：

```js{8,13-25}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <ProfileTrivia resource={resource} />
    </>
  );
}

function ProfileTrivia({ resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/focused-mountain-uhkzg)**

"Open Profile" を押下すると、何かおかしいことに気付くでしょう。トランジションが完了するまで丸々 7 秒間もかかっているのです！ これは我々のトリビア API がとても遅いからです。仮に、この API はこれ以上高速化できないということにしましょう。この制限下で、ユーザ体験をどのように向上させればよいでしょうか。

Pending 状態にあまり留まりたくないという場合、直感的には `useTransition` の `timeoutMs` を小さな値、例えば `3000` にすればよいと思うかもしれません。これを[こちら](https://codesandbox.io/s/practical-kowalevski-kpjg4)で試すことができます。これで遷延している Pending 状態から脱出することはできますが、意味のある内容はまだ何も表示されません！

よりシンプルな解決法があります。**トランジションを短くするのではなく、遅いコンポーネントをトランジションから「切り離し」する**ために、`<Suspense>` でラップするのです。

```js{8,10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/condescending-shape-s6694)**

ここに重要な見識が見いだされています。React は常に可能な限り速く Skeleton 状態に移行しようとします。長いタイムアウトをあらゆる場所で使ったとしても、React は、Receded 状態を避けるために必要な時間を超えて Pending 状態に留まるということをしません。

**ある機能が次の画面に必須なものではない場合は、それを `<Suspense>` でラップして、遅延読み込みさせてください。**これにより、残りのコンテンツを可能な限り素早く表示できるようになります。逆に、あるコンポーネントがないと次の画面の*表示自体が無価値*であるという場合（例えば我々の例の `<ProfileDetails>`）、そのコンポーネントを `<Suspense>` で囲んでは*いけません*。こうすることで、トランジションはそれが準備できるまで「待つ」ようになります。

### 「電車」式のサスペンス開放 {#suspense-reveal-train}

既に次の画面にいるとして、時に複数の `<Suspense>` バウンダリを開放 (unlock) するのに必要なデータが矢継ぎ早にやってくるということがあります。例えば、2 つの異なったレスポンスがそれぞれ 1000ms 後と 1050ms 後にやってくる、ということがあるかもしれません。既に 1 秒間待っていたのなら、追加で 50ms 待ったとしても知覚できないでしょう。このため、React は `<Suspense>` バウンダリ内のコンテンツを、一定間隔でやってくる「電車」のように、定期的に開放します。これで、僅かな遅延と引き替えに、バタバタとレイアウトを行ってユーザに視覚上の変化を見せる回数を減らすことができます。

このデモを[こちら](https://codesandbox.io/s/admiring-mendeleev-y54mk)で見ることができます。タイムライン投稿用と豆知識用のレスポンスは 100 ミリ秒未満の時間差で返ります。しかし React はそれらを結合してサスペンスのバウンダリをまとめて「開放」します。

### Pending インジケータの遅延 {#delaying-a-pending-indicator}

我々の `Button` コンポーネントはクリックした直後に Pending 状態のインジケータを表示します。

```js{2,13}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition({
    timeoutMs: 10000
  });

  // ...

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/floral-thunder-iy826)**

これにより何らかの作業が行われているとユーザに伝えます。しかし、トランジションが比較的短い場合（500ms 以内）、これにより気が散ってしまい、トランジション自体が*遅く*感じられるようになってしまいます。

解決法の 1 つは、*スピナー自体*の表示を遅延させることです。

```css
.DelayedSpinner {
  animation: 0s linear 0.5s forwards makeVisible;
  visibility: hidden;
}

@keyframes makeVisible {
  to {
    visibility: visible;
  }
}
```

```js{2-4,10}
const spinner = (
  <span className="DelayedSpinner">
    {/* ... */}
  </span>
);

return (
  <>
    <button onClick={handleClick}>{children}</button>
    {isPending ? spinner : null}
  </>
);
```

**[CodeSandbox で試す](https://codesandbox.io/s/gallant-spence-l6wbk)**

この変更により、Pending 状態にいる場合でも、500 ms が経過するまでは何のインジケータも表示しないようになります。これは API のレスポンスが遅い場合には大した改善のように思えないかもしれません。しかし API 呼び出しが速い場合にどう違って感じられるか、[改善前](https://codesandbox.io/s/thirsty-liskov-1ygph)と[改善後](https://codesandbox.io/s/hardcore-http-s18xr)を比較してみてください。コードの残りの部分は変わっていないにもかかわらず、「あまりに早すぎる」ロード中状態を抑制すると、遅延に意識を向けさせないことにより体感上のパフォーマンスは向上します。

### まとめ {#recap}

ここまでで学んだ重要なことは以下の通りです：

* デフォルトでは、ローディングシーケンスは Receded → Skeleton → Complete である。
* Receded 状態は既存のコンテンツを隠してしまうため体感上良く感じられない。
* `useTransition` を使ことで、選択的に Pending 状態を表示するようにできる。これにより次の画面の準備をしている間、前の画面に留まることが可能になる。
* あるコンポーネントによりトランジションが遅延するのを避けたい場合、それを個別の `<Suspense>` バウンダリでラップする。
* `useTransition` をあらゆるコンポーネントで使う代わりに、デザインシステムに組み込むことができる。

## 他のパターン {#other-patterns}

トランジションは、並列モードにおいておそらく最も一般的に遭遇するパターンですが、他にも有用かもしれないパターンが幾つかあります。

### 高優先度 state と低優先度 state の分割 {#splitting-high-and-low-priority-state}

React コンポーネントの設計において、通常は state の「最小の表現」を見つけることがベストです。例えば、`firstName`、`lastName` と `fullName` を state に保持するよりも、`firstName` と `lastName` だけを保持して `fullName` はレンダー中に計算する方が通常は望ましいでしょう。これにより片方の state を更新してもう片方の state のことを忘れるという間違いを避けられます。

しかし並列モードでは、複数の state 変数にあるデータを「重複」*させたい*という場合があります。以下のミニ翻訳アプリを考えてみましょう：

```js
const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setResource(fetchTranslation(value));
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/brave-villani-ypxvf)**

入力欄にタイプすると `<Translation>` コンポーネントがサスペンドし、新しい翻訳結果が手に入るまで `<p>Loading...</p>` というフォールバックが表示されることに気付くでしょう。これは良くありません。新しい翻訳結果を取得している間、*前の*翻訳結果が表示されつづけている方が望ましいでしょう。

実は、コンソールを開くと、以下のような警告が表示されています：

```
Warning: App triggered a user-blocking update that suspended.

The fix is to split the update into multiple parts: a user-blocking update to provide immediate feedback, and another update that triggers the bulk of the changes.

Refer to the documentation for useTransition to learn how to implement this pattern.
```

以前述べたとおり、state の更新がコンポーネントのサスペンドを引き起こす場合、その state 更新はトランジションでラップされるべきです。ではこのコンポーネントに `useTransition` を追加してみましょう：

```js{4-6,10,13}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition({
    timeoutMs: 5000
  });

  function handleChange(e) {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
      setResource(fetchTranslation(value));
    });
  }

  // ...

}
```

**[CodeSandbox で試す](https://codesandbox.io/s/zen-keldysh-rifos)**

入力欄でタイピングしてみてください。何かが変です！ 入力欄の更新が非常に遅くなっています。

元の問題（トランジション外でサスペンドが起こる）は解決しました。が、このトランジションのせいで、state がすぐに更新されず、制御された入力欄を「駆動」することができなくなってしまいました！

この問題の答えは、**state を 2 つに分割して**、即座に更新される「高優先度」の部分と、トランジションを待つことのできる「低優先度」の部分に分けることです。

我々の例には、すでに 2 つの state 変数があります。入力中のテキストは `query` に入っており、翻訳結果は `resource` から読み出します。`query` state の更新は即座に反映される一方で、`resource` の更新（つまり新しい翻訳結果の取得）はトランジションを開始する必要があります。

従って正しい修正方法は `setQuery`（サスペンドしない）をトランジションの*外部*に持っていき、`setResource`（サスペンドする）を*内部*に持っていくことです。

```js{4,5}
function handleChange(e) {
  const value = e.target.value;
  
  // Outside the transition (urgent)
  setQuery(value);

  startTransition(() => {
    // Inside the transition (may be delayed)
    setResource(fetchTranslation(value));
  });
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/lively-smoke-fdf93)**

これで期待通りに動作するようになりました。入力欄には即座にタイプでき、トランジションはタイプした内容にいずれ「追いつく」ようになります。

### 値の遅延 {#deferring-a-value}

デフォルトでは React は常に整合性のある UI を表示します。以下のようなコードを考えましょう：

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React は、これらのコンポーネントを画面上でどんなタイミングで見ても、同じ `user` からのデータが反映されていることを保証します。state の更新によって別の `user` が渡された場合、両方が同時に変化します。画面を録画しても、別の `user` からの値が表示されているということはただの 1 フレームすらあり得ません（万一こんなことがあったらバグを登録してください！）。

これは大多数の状況では理にかなっています。UI の不整合は混乱を招き、ユーザを欺くことになります（例えば、メッセンジャーの「送信」ボタンと会話選択ペインとが合致せず、どのスレッドが現在選択されているか分からなくなったら最悪です）。

しかし、意図的に不整合性を導入することが有用であることがあります。これは上記のように state を手動で「分割」することでも行えますが、React はこのための組み込みフックも提供します：

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value, {
  timeoutMs: 5000
});
```

この機能をデモするために[プロフィール切り替えの例](https://codesandbox.io/s/musing-ramanujan-bgw2o)を使いましょう。"Next" ボタンをクリックして、トランジションに 1 秒かかることを確かめてください。

仮に、ユーザ詳細の取得は非常に高速で、300 ミリ秒しかかからないとしましょう。現在のところ、一貫性のあるプロフィールページを表示するにはユーザ詳細と投稿の両方が必要なので、まるまる 1 秒間待機しています。ユーザ詳細だけ早めに表示したい場合はどうしたらいいのでしょうか？

一貫性を犠牲にしても構わないのであれば、**トランジションを遅延させているコンポーネントに古くなっているかもしれない値を渡す**ことができます。これが `useDeferredValue()` によって可能になることです。

```js{2-4,10,11,21}
function ProfilePage({ resource }) {
  const deferredResource = useDeferredValue(resource, {
    timeoutMs: 1000
  });
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/vigorous-keller-3ed2b)**

ここで生まれたトレードオフは、`<ProfileTimeline>` は他のコンポーネントとの整合性が保たれず、古いアイテムを表示するかもしれない、ということです。"Next" を何度かクリックすると分かるでしょう。しかしこのお陰で、トランジションにかかる時間が 1000ms から 300ms になりました。

これが適切なトレードオフなのかどうかは状況によります。しかしこれは有用なツールであり、特にコンテンツの変化があまり目立たず、ユーザが古い情報を一瞬見ていることに気付きすらしないような場合には有用です。

`useDeferredValue` はデータ取得のときに*のみ*有用であるというわけではない、ということを知っておいてください。これは高価な計算が必要なコンポーネントツリーがユーザ操作（テキスト入力へのタイピングなど）を遅くしている場合にも有効です。取得するのに時間のかかりすぎる値を「遅延」できる（そして他のコンポーネントが更新されているにも関わらず古い値を表示できる）のと全く同様に、レンダーに時間のかかりすぎるツリーに対しても同じことが行えます。

例えば以下のようなフィルタ可能なリストを考えてみましょう：

```js
function App() {
  const [text, setText] = useState("hello");

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={text} />
    </div>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/pensive-shirley-wkp46)**

この例では、**`<MySlowList>` 内のすべての要素に人為的な遅延を作っています -- すべての要素がスレッドを数 ms ずつブロックしているのです**。現実のアプリケーションでこんなことは絶対にやりませんが、深いコンポーネントツリーがあって単一の最適化可能部位が明確には存在しない場合に起こることをシミュレートできます。

入力欄にタイプすると引っかかりが発生していることが分かるでしょう。では `useDeferredValue` を加えましょう：

```js{3-5,18}
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, {
    timeoutMs: 5000
  });

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={deferredText} />
    </div>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/infallible-dewdney-9fkv9)**

これでタイピングした際の引っかかりは大幅に軽減されました -- ただし結果の表示に遅延が生じることと引き替えに、です。

これはデバウンス (debounce) とどう異なるのでしょうか？ 我々の例では人為的な固定の遅延時間（80 個の要素それぞれに 3 ms）があるため、どんなにコンピュータが高速でも必ず遅延が発生します。しかし `useDeferredValue` の値は、レンダーに時間がかかっている場合にのみ「遅れ」が生じるのです。React によって最低これだけラグが生じると決められているわけではありません。より現実的なワークロードでは、ユーザのデバイスによってラグの適応が起こることが期待できます。高速なマシンではラグは小さいか存在しなくなり、遅いマシンではラグはより目立つでしょう。どちらのケースでも、アプリケーションはレスポンシブに保たれます。デバウンスやスロットル (throttle) では常に少々の遅延が発生し、レンダー中にスレッドがブロックされることを防げませんので、これが本メカニズムの利点ということです。

レスポンシブ性という点で改善点は得られましたが、並列モードにはこのユースケースにおける重要な最適化のいくつかが欠けており、そのため今回の例はそれほど魅力的ではありません。それでも、`useDeferredValue`（や `useTransition`）のような機能が、ネットワークの完了を待機しているのか計算の完了を待機しているのかに関わらず有用である、というのは興味深い事実です。

### SuspenseList {#suspenselist}

`<SuspenseList>` が、ローディング中状態の制御に関する最後のパターンです。

以下の例を考えてください：

```js{5-10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/proud-tree-exg5t)**

この例での API のコール時間はランダム化されています。再読み込みを繰り返すと、タイムライン投稿が先に来ることもあれば「豆知識」が先に来る場合もあることに気付くでしょう。

ここで問題が起こります。もし豆知識のレスポンスが先に来た場合、`<h2>Loading posts...</h2>` というフォールバックの下方に豆知識が表示されることになります。豆知識を読み始めた瞬間に*投稿の*レスポンスが返ってきて、豆知識が下側にずれてしまいます。これは煩わしいでしょう。

これを修正する 1 つの方法は、両方を単一のバウンダリに入れることです：

```js
<Suspense fallback={<h2>Loading posts and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[CodeSandbox で試す](https://codesandbox.io/s/currying-violet-5jsiy)**

この方法の問題は、*常に*両方が取得されるまで待つようになったことです。もし*投稿*の方が先に返ってきたなら、それを表示するのを遅らせる理由はありません。豆知識が後で返ってきても、それは既に投稿の下側にあるのですから、レイアウトのずれを発生させません。

Promise を特殊な方法で合成するといった、この問題に対する他のアプローチは、ツリー内の様々なコンポーネントにロード中状態が存在するようになると徐々にうまく行かなくなります。

これを解決するため、`SuspenseList` をインポートしましょう：

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>` は、配下にある直近の `<Suspense>` ノードの「開放順序」を制御します：

```js{3,11}
function ProfilePage({ resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </SuspenseList>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/black-wind-byilt)**

`revealOrder="forwards"` というオプションは、このリスト内部にある直近の `<Suspense>` ノードは、**データが異なった順番で到着した場合でも、ツリーに現れる順番でしか「開放」されない**ということを意味します。`<SuspenseList>` には他にも興味深いモードがあります。`"forwards"` を `"backwards"` や `"together"` に変えてみて、何が起こるか確認してください。

`tail` プロパティを使って同時に表示されるローディング中状態の数を制御することができます。`tail="collapsed"` と指定すると、同時に*最大でも 1 つ*しかフォールバックが表示されないようになります。[こちら](https://codesandbox.io/s/adoring-almeida-1zzjh)で試すことができます。

React の他のあらゆるものと同様に、`<SuspenseList>` は合成可能であることを覚えておいてください。例えば、`<SuspenseList>` の行を `<SuspenseList>` のテーブル内に入れてグリッドを作ることができます。

## 次のステップ {#next-steps}

並列モードは、快適なユーザ体験を組み上げるためのパワフルな UI プログラミングモデルと、合成可能な新たな基本要素群を提供します。

これは数年にわたる研究と開発の成果ですが、まだ完成していません。[並列モードの利用開始](/docs/concurrent-mode-adoption.html)についてのセクションで、並列モードを試す方法や期待されることについて解説します。
