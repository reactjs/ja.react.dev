---
id: concurrent-mode-suspense
title: サスペンスを使ったデータ取得（実験的機能）
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
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
> このページはアーリーアダプターや興味のある読者を対象に、安定リリースでまだ利用できない実験的機能を説明するために存在していました。
>
> このページの説明のほとんどは既に古くなっており、アーカイブの目的のためだけに残しています。最新の情報については [React 18 アルファのアナウンス](/blog/2021/06/08/the-plan-for-react-18.html)を参照してください。
>
> React 18 のリリースまでに、このページはより安定したドキュメントに置き換わる予定です。

</div>

React 16.6 で、コードのロードを「待機」して宣言的にロード中状態（スピナーのようなもの）を指定することができる `<Suspense>` コンポーネントが追加されました。

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

データ取得用のサスペンスは、**データも含むその他あらゆるものを宣言的に「待機」**するために `<Suspense>` を使えるようにする新機能です。このページではデータ取得のユースケースに焦点を当てて説明しますが、画像やスクリプト、あるいはその他の非同期的な作業の待機にも使えます。

- [そもそもサスペンスとは何なのか？](#what-is-suspense-exactly)
  - [サスペンスは何でないのか](#what-suspense-is-not)
  - [サスペンスで何ができるのか](#what-suspense-lets-you-do)
- [現実環境でのサスペンスの使用](#using-suspense-in-practice)
  - [Relay を使ってない場合は？](#what-if-i-dont-use-relay)
  - [ライブラリ作者向け情報](#for-library-authors)
- [既存アプローチ vs サスペンス](#traditional-approaches-vs-suspense)
  - [アプローチ 1: Fetch-on-Render（サスペンス不使用）](#approach-1-fetch-on-render-not-using-suspense)
  - [アプローチ 2: Fetch-Then-Render（サスペンス不使用）](#approach-2-fetch-then-render-not-using-suspense)
  - [アプローチ 3: Render-as-You-Fetch（サスペンスを使用）](#approach-3-render-as-you-fetch-using-suspense)
- [早期から取得を開始する](#start-fetching-early)
  - [まだ仕様は検討中です](#were-still-figuring-this-out)
- [サスペンスと競合状態](#suspense-and-race-conditions)
  - [`useEffect` に伴う競合状態](#race-conditions-with-useeffect)
  - [`componentDidUpdate` に伴う競合状態](#race-conditions-with-componentdidupdate)
  - [問題の本質](#the-problem)
  - [サスペンスで競合状態を解決する](#solving-race-conditions-with-suspense)
- [エラーの処理](#handling-errors)
- [次のステップ](#next-steps)

## そもそもサスペンスとは何なのか？ {#what-is-suspense-exactly}

サスペンスを使うことで、レンダー可能になる前にコンポーネントが何かを「待機」できるようになります。[この例](https://codesandbox.io/s/frosty-hermann-bztrp)では、2 つのコンポーネントが、あるデータを取得する非同期的な API の完了を待機します：

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/frosty-hermann-bztrp)**

このデモはチラ見せです。まだあまり意味が分からなくても心配は要りません。以下でこれがどのように動作しているのかをお話しします。サスペンスは*仕組み*であり、上記の例の `fetchProfileData()` や `resource.posts.read()` といった特定の API はあまり重要ではないということを覚えておいてください。興味があれば[デモ用サンドボックス](https://codesandbox.io/s/frosty-hermann-bztrp)に定義があります。

サスペンスはデータ取得ライブラリではありません。サスペンスとは**データ取得ライブラリのための仕組み**であり、*コンポーネントが読み出そうとしているデータがまだ準備できていない*と React に伝えられるようにします。これにより React はデータが準備できるまで待機してから UI を更新します。Facebook では、Relay と[新しい Suspense 連携機能](https://relay.dev/docs/en/experimental/step-by-step)を利用しています。Apollo のような他のライブラリも似たような連携機能が提供できることを期待しています。

長期的にはサスペンスが、コンポーネントで非同期的なデータ（それがどこから来るのかに関わらず）を読み込む際の主要な方法となることを意図しています。

### サスペンスは何でないのか {#what-suspense-is-not}

サスペンスはこの種の問題に対する既存のアプローチとは大きく異なっているため、初めて読んだときに誤解してしまうことがよくあります。最もよくある誤解を解いておきましょう：

 * **データ取得の実装ではありません。**あなたが GraphQL、REST、その他どのような具体的なデータフォーマット、ライブラリ、転送経路、プロトコルを使っているのかについて仮定を置きません。

 * **すぐに使えるクライアントではありません。**`fetch` や Relay をサスペンスで「置き換える」ことはできません。しかしサスペンスと統合されたライブラリを使うことはできます（例えば [Relay の新 API](https://relay.dev/docs/en/experimental/api-reference)）。

 * **データ取得をビューレイヤと密結合させません。**ロード中状態をあなたの UI でうまく表示するための補助とはなりますが、React コンポーネントをネットワーク関係のロジックと結合させることはしません。

### サスペンスで何ができるのか {#what-suspense-lets-you-do}

ではサスペンスとは要するに何なのでしょうか。これに対する答え方はいくつかあります：

* **データ取得ライブラリが React と深く連携できるようにするためのものです。**データ取得ライブラリがサスペンスをサポートすることで、React コンポーネントからそれを非常に自然に扱えるようになります。

* **ロード中状態の表示を注意深く設計することが容易になります**。サスペンスは*どのように*データが取得されるのかについて関知しませんが、アプリケーションのローディングシーケンスを細かく制御することができるようになります。

* **競合状態 (race condition) を避ける手助けになります。**`await` を使っていてすら、非同期のコードはエラーを起こしがちです。サスペンスを使うことで、データが*同期的に*読み出されているかのように、まるで既にロード済みであるかのように感じられます。

## 現実環境でのサスペンスの使用 {#using-suspense-in-practice}

Facebook では今のところ、本番環境において Relay のサスペンス連携機能のみを利用しています。**今すぐ始めるための実用的なガイドが見たい場合は、[Relay のガイドをご覧ください](https://relay.dev/docs/en/experimental/step-by-step)！** 本番環境で既にうまく動作しているパターンについて述べられています。

**このページのコードデモでは Relay ではなくフェイクの API 実装を使っています。**このため GraphQL に馴染みがない場合でも理解しやすくなっていますが、サスペンスを使ってアプリケーションを構築するための「正しいやり方」については述べていません。このページは概念的なものであり、サスペンスが*なぜ*このように動作し、どんな問題を解決するのかについて理解できるようにすることを目的としています。

### Relay を使ってない場合は？ {#what-if-i-dont-use-relay}

今 Relay を使っていないのなら、サスペンスをあなたのアプリケーションで使うのは待った方がいいかもしれません。現在のところ、Relay が本番環境でテストされ、我々が自信を持っている唯一の実装です。

この先の数か月で、サスペンスの API を様々な方法で利用した多くのライブラリが登場することでしょう。**もっと安定したものを学びたいという人は、我々の作業を今のところは無視して、サスペンス周りのエコシステムが成熟してから戻ってくるのが良いかもしれません。**

望むのであれば、データ取得ライブラリに対するあなた独自の連携機能を書くことは可能です。

### ライブラリ作者向け情報 {#for-library-authors}

これからコミュニティ内で他のライブラリを使った多くの実験がなされると思います。ライブラリ作者が覚えておいて欲しい重要なことが 1 つあります。

技術的には可能ですが、サスペンスはコンポーネントがレンダーされてからデータ取得を開始するための方法であることを意図して*いません*。そうではなく、*既に取得されつつある*データに対して、コンポーネントがそれを「待機」中であると宣言できるようにします。**[Building Great User Experiences with Concurrent Mode and Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) で、なぜこのことが重要で、実際にどう実装すればよいのかについて説明しています。**

ウォーターフォール (waterfall) の問題を回避できるソリューションをお持ちなのでない限り、レンダー前にデータ取得を行うことを推奨する、あるいは強制するような API が望ましいと考えています。具体例として、[Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) がどのようにプリロードを強制するのかについて見ることができます。ここでの我々のメッセージは、過去にはあまり一貫したものではありませんでした。サスペンスによるデータ取得はまだ実験的なものであり、我々が本番環境での使用のされ方について学び、この問題領域についてより理解するに従って、我々の推奨も変わるかもしれません。

## 既存アプローチ vs サスペンス {#traditional-approaches-vs-suspense}

すでに人気のあるデータ取得のアプローチについて言及せずにサスペンスを紹介することもできたでしょう。しかしそれでは、サスペンスがどのような問題を解決するのか、なぜそれが解決すべき問題なのか、これまでの方法とどう違うのか、といったことが分かりづらくなってしまいます。

代わりに、サスペンスのことを、これまでのアプローチの理論的な後継ステップとして見ていくことにします。

* **Fetch-on-render（例：`useEffect` 内で `fetch`）：**コンポーネントのレンダーを開始する。これらのコンポーネントがそれぞれ副作用やライフサイクルメソッド内でデータの取得をトリガする。このアプローチはしばしば "ウォーターフォール" の問題を引き起こす。
* **Fetch-then-render（例：サスペンスなしの Relay）：**次の画面のためのデータの取得をできるだけ早く開始する。データの準備が整ったら、新しい画面をレンダーする。データが到着するまで何も行えない。
* **Render-as-you-fetch（例：サスペンスを使った Relay）：**次の画面のためのデータの取得をできるだけ早く開始し、そして**直後に、つまりネットワークのレスポンスが得られる前に**新しい画面のレンダーを開始する。データが順に到着するにつれて、React はデータが必要なコンポーネントのレンダーを繰り返し、最終的にすべてが描画済みとなる。

>補足：
>
>これはやや簡略化された説明であり、現実のソリューションでは複数のアプローチが混在する傾向にあります。それでも、それぞれのトレードオフを対比するためにこれらを別々に考えることにします。

これらのアプローチを比較するためにそれぞれの手法でプロフィールページを作成します。

### アプローチ 1: Fetch-on-Render（サスペンス不使用）{#approach-1-fetch-on-render-not-using-suspense}

現在の React アプリケーションでデータを取得する一般的な方法は副作用 (effect) を使用することです：

```js
// In a function component:
useEffect(() => {
  fetchSomething();
}, []);

// Or, in a class component:
componentDidMount() {
  fetchSomething();
}
```

画面上にコンポーネントがレンダーされた**後**までデータ取得が始まらないので、このアプローチのことを "fetch-on-render" と呼ぶことにします。これは "ウォーターフォール" と呼ばれる問題を引き起こします。

以下の `<ProfilePage>` と `<ProfileTimeline>` のコンポーネントを考えてみましょう：

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/fragrant-glade-8huj6)**

このコードを実行してコンソールのログで眺めると、実行の順番は以下のようになっています：

1. ユーザ詳細情報の取得を開始
2. 待機する…
3. ユーザ詳細情報の取得が完了
4. タイムライン投稿 (posts) の取得を開始
5. 待機する…
6. 投稿の取得が完了

ユーザ詳細情報の取得に 3 秒かかる場合、投稿の取得の*開始*が 3 秒後になってしまいます！ これが「ウォーターフォール」、つまり並列化可能にもかかわらず意図せず混入してしまった*シーケンス*です。

レンダー時にデータを取得するコードではウォーターフォールはよく発生します。修正することは可能ですが、プロダクトが成長するにつれて多くの人はこの問題を解決しづらくするような手法を使うようになります。

### アプローチ 2: Fetch-Then-Render（サスペンス不使用）{#approach-2-fetch-then-render-not-using-suspense}

ライブラリは、より中央集権的なデータ取得の方法を提供することで、ウォーターフォールを防止することができます。例えば、Relay はコンポーネントが必要とするデータを静的に解析可能な*フラグメント*に移動し、あとでそれを単一のクエリに組み合わせる、という方法でこの問題を解決します。

このページでは Relay の知識があることを前提としていませんので、この例では使いません。代わりに、2 つのデータ取得メソッドを組み合わせて似たようなものを手書きします：

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

この例では `<ProfilePage>` は両方のリクエストを待機しますが、それらを同時に開始しています：

```js{1,2,8-13}
// Kick off fetching as early as possible
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// The child doesn't trigger fetching anymore
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/wandering-morning-ev6r0)**

これで、イベントの流れは以下のようなものになります：

1. ユーザ詳細情報の取得を開始
2. タイムライン投稿の取得を開始
3. 待機する…
4. ユーザ詳細情報の取得が完了
5. 投稿の取得が完了

これにより前述のネットワークの "ウォーターフォール" が解決されましたが、うっかり別のウォーターフォールができてしまいました。`fetchProfileData` の内部で `Promise.all()` を使って*すべて*のデータが到着するまで待機しているので、投稿がロードされるまでプロフィール詳細画面をレンダーすることができないのです。両方を待つ必要があります。

この特定の例に関して言えば、もちろん修正は可能です。`Promise.all()` を除去して両方の Promise を個別に待つようにすればいいのです。しかし、データやコンポーネントツリーの複雑性が増すにつれて、このような手法はだんだんと困難になっていきます。データツリーのどこかが欠けていたり古くなっていたりしている場合、信頼できるコンポーネントを書くのは困難です。なので新しい画面に必要なデータが全部到着した*後で*レンダーをする、というのがしばしば現実的な選択肢になります。

### アプローチ 3: Render-as-You-Fetch（サスペンスを使用）{#approach-3-render-as-you-fetch-using-suspense}

これまでのアプローチでは、`setState` を呼び出す前にデータを取得していました：

1. データ取得を開始
2. データ取得が完了
3. レンダーを開始

サスペンスを使うと、データ取得をまず開始しますが、最後の 2 つのステップが入れ替わります：

1. データ取得を開始
2. **レンダーを開始**
3. **データ取得が完了**

**サスペンスを使うと、レンダーを始める前にレスポンスが返ってくるのを待つ必要がなくなります。**むしろ、ネットワークリクエストを叩いた*その直後*にレンダーを開始します。

```js{2,17,23}
// This is not a Promise. It's a special object from our Suspense integration.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/frosty-hermann-bztrp)**

画面の `<ProfilePage>` をレンダーしたときに起こるのは以下のようなことです：

1. レンダー時点で `fetchProfileData()` を使ってリクエストがスタートしています。この関数は Promise ではなく特殊な "リソース (resource)" を返します。現実的な例では、Relay のようなデータ取得ライブラリのサスペンス連携機能を使うことになります。
2. React は `<ProfilePage>` のレンダーを試みます。子要素として `<ProfileDetails>` と `<ProfileTimeline>` が返ります。
3. React は `<ProfileDetails>` のレンダーを試みます。内部で `resource.user.read()` が呼び出されます。データはまだ何も取得されていないので、このコンポーネントは "サスペンド (suspend)" します。React はこのコンポーネントを飛ばして、ツリーの他のコンポーネントのレンダーを試みます。
4. React は `<ProfileTimeline>` のレンダーを試みます。内部で `resource.posts.read()` が呼び出されます。今回も、まだデータがありませんので、このコンポーネントは "サスペンド" します。React はこのコンポーネントも飛ばして、ツリーの他のコンポーネントのレンダーを試みます。
5. レンダーを試みるべき他のコンポーネントは残っていません。`<ProfileDetails>` がサスペンドしたので、React はツリーの直上にある `<Suspense>` フォールバックを表示します：`<h1>Loading profile...</h1>`。ひとまずこれで終わりです。

この `resource` オブジェクトが、まだ存在していないがいずれロードされるであろうデータを表します。`read()` を呼び出すと、データが手に入るか、あるいはコンポーネントが "サスペンド" します。

**より多くのデータが到着するごとに React は再レンダーを試み、その度により「深い」ところまで進めるようになる可能性があります**。`resource.user` が取得できたら、`<ProfileDetails>` コンポーネントがレンダーされ、`<h1>Loading profile...</h1>` のフォールバックが不要になります。最終的に、すべてのデータが到着したら、画面上からフォールバックが消えます。

これは興味深い事実を意味します。単一のリクエストで必要なすべてのデータを集めてくる GraphQL クライアントを使っていたとしても、*リソースのストリーミングのお陰で、より多くのコンテンツを早期から表示できるようになる*のです。データ取得の*後*ではなくデータ取得を*行いながら*レンダーするので、レスポンス中で `user` が `posts` より先に現れたなら、レスポンスが終了する前に外側の `<Suspense>` バウンダリを "アンロック" 可能です。見逃していたかもしれないので繰り返しますが、fetch-then-render のソリューションにも、データ取得とレンダーとの間でウォーターフォールが存在していました。サスペンスにはこのウォーターフォールの問題がなく、Relay のようなライブラリはこのことをうまく利用します。

これにより `if (...)` による「ロード中か」のチェックが消えたことにも注意してください。これによりボイラープレートを減らせるだけでなく、素早い設計の変更が簡単になります。例えば、プロフィール詳細とタイムライン投稿が同時に「ぱっと」出現するようにしたくなったなら、その 2 つの間にある `<Suspense>` を取り除けばいいのです。あるいはそれぞれに*個別の* `<Suspense>` バウンダリを与えることでそれぞれを独立させることもできます。サスペンスにより、コードに大きく手を加えることなしに、ロード中状態の粒度を変更し順番を制御できるようになります。

## 早期から取得を開始する {#start-fetching-early}

データ取得ライブラリを作成中なのであれば、Render-as-You-Fetch に関して忘れてはならない重要な特徴があります。**レンダーより*前に*取得を開始する**ということです。コード例で詳しく見てみましょう：

```js
// Start fetching early!
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // Try to read user info
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/frosty-hermann-bztrp)**

この例の `read()` 呼び出しが取得を*開始*しているのではありません。**既に取得の最中である**データの読み出しを試みているだけです。サスペンスを使って高速なアプリケーションを作成するにあたってこの違いは非常に重要です。コンポーネントのレンダーが始まるまでデータのロードを遅らせたくないのです。データ取得ライブラリ作者は、実際のデータフェッチを始めないと `resource` オブジェクトが取得できないようにすることで、これを強制できます。このページの「フェイク API」を使ったすべてのデモは、これを強制しています。

この例のように「トップレベルで」データを取得するのは非現実的だと思われるかもしれません。別のプロフィールページに移動したくなったらどうするのでしょうか？ props の値に応じてデータ取得をしたいのかもしれませんよね。答えは、**イベントハンドラでデータ取得を開始する**ことです。ユーザページ間を移動するシンプルな例です：

```js{1,2,10,11}
// First fetch: as soon as possible
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // Next fetch: when the user clicks
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/infallible-feather-xjtbu)**

このアプローチにより、**コードとデータを並行して取得**できます。ページ間でナビゲートする場合、ページのデータのロードを開始するためにそのページのコードがロードされるのを待つ必要はありません。（リンクのクリック時に）コードとデータの両方の取得を開始すればよく、それでユーザ体験はずっと向上します。

次に湧いてくる疑問は、次の画面をレンダーしていないのに**何を**取得するのかをどうやって知るのか、です。これを解決するいくつかの方法があります（例えばデータ取得をルーティングソリューションの近くに統合する、など）。あなたがデータ取得ライブラリの開発をしている場合は、[Building Great User Experiences with Concurrent Mode and Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) で、どのようにこれを実現し、なぜこれが重要なのかについて説明されています。

### まだ仕様は検討中です {#were-still-figuring-this-out}

仕組みとしてのサスペンスは柔軟なものであり、制約は多くありません。本番のコードではウォーターフォールがないことを保証するためにもっと制約が必要ですが、そのような保証を与えるための方法は様々です。我々が検討中の疑問は以下のようなものです：

* データ取得の早期開始を明示するのが難しいことがある。ウォーターフォールを避けるため、そこを簡単にできるか？
* あるページのデータを取得する時に、そのページ*から*即座に遷移できるためのデータを含めるよう API が仕向けるべきか？
* レスポンスのライフタイムは？ キャッシュはグローバル、あるいはローカルであるべきか？ キャッシュをだれが管理するのか？
* Proxy を使うことで、あちこちに `read()` を挿入せずとも遅延ロード API を表現することが可能か？
* 任意のサスペンスデータに対して、GraphQL クエリの構築に相当するものはどのような見た目になるか？

これらの疑問のいくつかについて Relay は独自の回答を有しています。やり方は間違いなく複数あり、React コミュニティがどのようなものを新しく思いつくのか、楽しみにしています。

## サスペンスと競合状態 {#suspense-and-race-conditions}

競合状態 (race condition) は、コードが実行される順番について誤った前提を置くために発生するバグです。`useEffect` フックやクラスの `componentDidUpdate` のようなライフサイクルメソッドを使ってデータ取得を行うと、しばしばこれが引き起こされます。サスペンスはここでも有用です。どのように有用なのか見てみましょう。

問題の説明のために、トップレベルの `<App>` コンポーネントを追加して、`<ProfilePage>` をレンダーさせるとともに、**複数のプロフィールを切り替える**ことのできるボタンを配置しましょう：

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Next
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

この要求に対して複数のデータ取得法がどのようにするのかを比較してみましょう。

### `useEffect` に伴う競合状態 {#race-conditions-with-useeffect}

まずは元の「副作用内でデータ取得」の例を書き換えて試してみましょう。`<ProfilePage>` の props に渡された `id` を `fetchUser(id)` と `fetchPosts(id)` に渡すように書き換えます：

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/nervous-glade-b5sel)**

`id` が変わるたびに副作用を再実行したいので、副作用の依存配列を `[]` から `[id]` に変えたことにも注意してください。これをしなければ新しいデータの再取得ができません。

このコードを試すと、最初はうまく動いているように見えます。しかし、我々の「フェイク API」実装の遅延時間をランダム化し、"Next" ボタンを素早く押下すると、コンソールログで非常におかしなことが起きていることに気づきます。**時々、プロフィールを別の ID に切り替えた後になって、以前のプロフィールのリクエストが「返ってくる」のです。その場合、別の ID 用の古いレスポンスによって、新しい state が上書きされてしまいます。**

この問題は修正可能です（副作用のクリーンアップ関数を使って古いリクエストを無視ないしキャンセルするようにできます）が、直観的でなく、デバッグも困難です。

### `componentDidUpdate` に伴う競合状態 {#race-conditions-with-componentdidupdate}

これが `useEffect` つまりフックに特有の問題だと思っている人がいるかもしれません。コードをクラスに移植するか `async` / `await` のような便利な記法を使えば、もしかして問題が解決するのでしょうか。

やってみましょう：

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/trusting-clarke-8twuq)**

見た目ほど難しいことをしている訳ではありません。

残念ながら、クラスを使っても `async` / `await` 構文を使っても、この問題は解決しませんでした。このバージョンでも同じ理由により、全く同じような競合状態が発生しています。

### 問題の本質 {#the-problem}

React コンポーネントはそれぞれ「ライフサイクル」を持っています。props の受け取りや state の更新は任意のタイミングで起こります。しかし非同期なリクエスト*も*それぞれの「ライフサイクル」を持っているのです。リクエストを発行したときに始まり、レスポンスを得た時に終わります。我々が直面している困難は互いに影響しあう複数のプロセスの「同期」です。これは考えるのが難しい問題です。

### サスペンスで競合状態を解決する {#solving-race-conditions-with-suspense}

この例を書き換えてサスペンスだけを使うようにしてみましょう：

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/infallible-feather-xjtbu)**

以前の例では `resource` は 1 つだけだったのでトップレベルの変数として保持していました。複数のリソースを使うようになったので、`<App>` のコンポーネント state に移動しました。

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

"Next" をクリックすると、`<App>` コンポーネントは次のプロフィールのためのリクエストを発行し、*その*オブジェクトを `<ProfilePage>` コンポーネントに渡します：

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Next
    </button>
    <ProfilePage resource={resource} />
  </>
```

繰り返しになりますが、**レスポンスを待機して state を設定するのではありません。その逆です。リクエスト開始の直後に state を設定して（そしてレンダーを開始して）います。**データが到着するにつれて、React が `<Suspense>` コンポーネント内を中身で「埋めて」くれます。

このコードは非常に読みやすいですが、これまでの例とは違い、サスペンスを使ったバージョンは競合状態による問題の影響を受けません。どうしてなのか気になるでしょうか。答えは、サスペンスを使ったバージョンではコード内で*時間*のことをさほど気にする必要がないからです。競合状態があった元のコードでは、state を*未来における正しいタイミングで*設定する必要があり、さもなくば間違った動作になっていました。しかしサスペンスでは state を*すぐに*設定するので、間違いが起きづらくなるのです。

## エラーの処理 {#handling-errors}

Promise を使ってコードを書く際は、`catch()` を使ってエラーを処理していました。サスペンスでは Promise を使ってレンダー開始を*待つ*ことがないわけですが、エラー処理はどのようになるのでしょうか。

サスペンスでは、データ取得のエラーの処理はレンダーのエラーと同様に動作します。配下のコンポーネントのエラーを "catch" するため、任意の場所で [error boundary](/docs/error-boundaries.html) をレンダーすることができます。

まず、我々のプロジェクト全体で使う error boundary コンポーネントを定義します：

```js
// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

その後に、エラーをキャッチするためにツリーの任意の場所に配置します：

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[CodeSandbox で試す](https://codesandbox.io/s/adoring-goodall-8wbn7)**

これはレンダー中のエラーとサスペンスによるデータ取得時のエラーの*両方*をキャッチします。好きなだけ error boundary を配置することができますが、配置は[計画的](https://aweary.dev/fault-tolerance-react/)に行いましょう。

## 次のステップ {#next-steps}

サスペンスによるデータ取得の基本について学びました！ 重要なことは、サスペンスが*なぜ*このように動作し、そしてデータ取得の領域でなぜうまく動くのかについてよりよく理解できた、ということです。

サスペンスによりいくつかの疑問が解決しましたが、新たな疑問も生じていることでしょう：

* コンポーネントが "サスペンド" するとアプリはフリーズするのか？ 回避方法は？
* コンポーネントツリーの「上側」以外の場所でスピナーを表示したい場合は？
* 不整合な UI を意図的に短時間表示*したい*場合に、それは可能か？
* スピナーを表示するのではなく「グレーアウト」のような視覚効果を加えることは可能か？
* [最後のサスペンスの例](https://codesandbox.io/s/infallible-feather-xjtbu)で "Next" ボタンをクリックしたときにログに警告が記録されているのは何故か？

これらの疑問に答えるために、次の記事、[並列的 UI パターン](/docs/concurrent-mode-patterns.html)に進みます。
