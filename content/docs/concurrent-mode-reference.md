---
id: concurrent-mode-reference
title: 並列モード API リファレンス（実験的機能）
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
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
> このドキュメントは興味のある読者やアーリーアダプター向けのものです。**React が初めての方はこれらの機能を気にしないで構いません** -- 今すぐに学ぶ必要はありません。

</div>

このページは React の[並列モード](/docs/concurrent-mode-intro.html) についての API リファレンスです。ガイド付きの案内記事を探している場合は、[並列的 UI パターン](/docs/concurrent-mode-patterns.html)を参照してください。

**補足：これは公開プレビューであり最終安定板ではありません。これらの API は将来高確率で変更されます。自己責任で使ってください！**

- [並列モードの有効化](#concurrent-mode)
    - [`createRoot`](#createroot)
    - [`createBlockingRoot`](#createblockingroot)
- [サスペンス API](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## 並列モードの有効化 {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

`ReactDOM.render(<App />, rootNode)` を置き換えて、並列モードを有効化します。

並列モードについての詳細は[並列モードのドキュメント](/docs/concurrent-mode-intro.html)を参照してください。

### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

`ReactDOM.render(<App />, rootNode)` を置き換えて[ブロッキングモード](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode)を有効化します。

並列モードにオプトインすることで React の動作方法について意味上の変更が加わります。これは少数のコンポーネントだけで並列モードを使うということが不可能であるということを意味します。このため、いくつかのアプリケーションでは並列モードに直接移行することができないかもしれません。

ブロッキングモードには並列モードの機能の小さなサブセットのみが含まれているので、直接的な移行ができないアプリケーションのための中間的な移行ステップとなることを意図しています。

## サスペンス API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` により、レンダー可能になる前にコンポーネントが「待機」し、待機中にフォールバックを表示できるようになります。

上記の例では、`ProfileDetails` は何らかのデータを取得するために非同期 API コールを待機しています。`ProfileDetails` と `ProfilePhoto` を待機している間、`Loading...` というフォールバックを代わりに表示します。`<Suspense>` 内のすべての子要素がロードされるまでは、フォールバックが表示されつづけることに注意することが重要です。

`Suspense` は 2 つの props を受け取ります：
* **fallback** はローディングインジケータを受け取ります。フォールバックは `Suspense` コンポーネントのすべての子要素がレンダーを完了するまで表示されます。
* **unstable_avoidThisFallback** は真偽値を受け取ります。初回ロード時にこのバウンダリの開放を「スキップ」するかどうかを React に伝えます。この API は将来のリリースで高確率で削除されます。

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` はサスペンドしうる多数のコンポーネントがユーザに開放される順番を制御することで、それらのコンポーネントが協調してうまく動くようにします。

複数のコンポーネントがデータを取得する必要がある場合、それらのデータは予測不能な順番で到着するかもしれません。しかし、`SuspenseList` でこれらの要素をラップすることで、React は手前にある要素が全て表示されるまで、ある要素を表示しないようになります（この挙動は変更可能です）。

`SuspenseList` は 2 つの prosp を受け取ります：
* **revealOrder (forwards, backwards, together)** は `SuspenseList` の子要素が表示される順番を定義します。
  * `together` は 1 つずつではなく、*すべての*子要素を準備完了した時点でまとめて表示します。
* **tail (collapsed, hidden)** `SuspenseList` 内のロードされていない要素がどのように表示されるかを記述します。
    * デフォルトでは `SuspenseList` はリスト中のすべてのフォールバックを表示します。
    * `collapsed` はリスト内の次のフォールバックのみを表示します。
    * `hidden` は未ロードの要素を一切表示しません。

`SuspenseList` はすぐ直下にある `Suspense` と `SuspenseList` にのみ作用することに気をつけてください。1 階層分より深くまでバウンダリを探しに行くことはしません。しかし、複数の `SuspenseList` を互いにネストさせてグリッドを作ることは可能です。

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` を使うことで、**次の画面に遷移する**前にコンテンツがロードされるのを待機し、コンポーネントが望ましくないロード中状態を表示することを避けられるようになります。また、データ取得に関わる遅い更新を後続するレンダーへと遅延させることで、より重要な更新が即座にレンダーされるようにすることができます。

`useTransition` フックは 2 つの値を配列に入れて返します。
* `startTransition` はコールバックを受け取る関数です。これを使って、React にどの state を遅延させたいのかを伝えることができます。
* `isPending` は真偽値です。これがトランジションの完了を待っているかどうかを React が伝えてくれる手段です。

**何らかの state の更新がコンポーネントのサスペンドを引き起こす場合は、その更新はトランジションでラップされるべきです。**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
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
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

このコードでは、`startTransition` を使ってデータの取得をラップしています。これにより即座にプロフィールの取得を開始できる一方で、次のプロフィールページとそれに結びついている `Spinner` の表示を 2 秒間（`timeoutMs` に示されている時間）遅延させます。

真偽値である `isPending` によってコンポーネントのトランジションが進行中かどうかを知ることができ、ユーザに前のプロフィールページ内で何らかのロード中テキストを表示してトランジションの進行中状態を伝えることができます。

**トランジションについての詳細な解説は[並列的 UI パターン](/docs/concurrent-mode-patterns.html#transitions)で読めます。**

#### useTransition 設定 {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` はオプションで `timeoutMs` 値の入った **Suspense Config** を受け取ります。このタイムアウト（ミリ秒で指定）は、React に次の state（上記の例では新しいプロフィールページ）を表示するまでにどれだけ待つかを伝えます。

**補足：Suspense Config は複数のモジュール間で共有することをお勧めします。**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

最大で `timeoutMs` まで「遅れる」ことのできる、遅延されたバージョンの値を返します。

ユーザ入力に基づいて即座にレンダーされる何かや、データ取得を待つ必要がある何かがある場合に、インターフェスをレスポンシブに保つためによく使われます。

よい例はテキスト入力です。

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* Keep passing the current text to the input */}
      <input value={text} onChange={handleChange} />
      ...
      {/* But the list is allowed to "lag behind" when necessary */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

これにより `input` が即座に新しいテキストを表示し始めることができ、ウェブページがレスポンシブに保たれます。その一方で `MySlowList` は、`timeoutMs` に書かれているとおり更新まで最大 2 秒間遅延されるので、バックグラウンドで現在のテキストの値がレンダーできるようになります。

**値の遅延についての詳細な解説は[並列的 UI パターン](/docs/concurrent-mode-patterns.html#deferring-a-value)で読めます。**

#### useDeferredValue 設定 {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` はオプションで `timeoutMs` 値の入った **Suspense Config** を受け取ります。このタイムアウト（ミリ秒で指定）は、React に遅延される値がどれだけ遅れても構わないのかを伝えます。

ネットワークやデバイス性能が許す範囲で、React は常にラグを短くしようとします。
