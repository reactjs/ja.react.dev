---
title: "React v18.0"
author: The React Team
date: 2022/03/08
description: React 18 が npm で利用可能になりました！ 前回の投稿にて、アプリを React 18 にアップグレードするためのステップバイステップガイドを共有しました。この投稿では、React 18 の新機能や、将来に向けての展望をお伝えします。
---

March 29, 2022 by [The React Team](/community/team)

---

<Intro>

React 18 が npm で利用可能になりました！ 前回の投稿にて、[アプリを React 18 にアップグレードする](/blog/2022/03/08/react-18-upgrade-guide)ためのステップバイステップガイドを共有しました。この投稿では、React 18 の新機能や、将来に向けての展望をお伝えします。

</Intro>

---

この最新のメジャーバージョンには、自動バッチング (automatic batching) のような自動で有効になる機能改善、startTransition のような新たな API、そしてサスペンス (suspense) に対応したストリーミングでのサーバサイドレンダリング機能が含まれています。

React 18 の機能の多くが基盤としているのは新たに加わった並行レンダラ (concurrent renderer) であり、これが強力な新機能群を実現するために裏で働くようになっています。React の並行処理機能はオプトインであり、並行処理機能を使う場合にのみ有効になるものですが、これは皆さんのアプリ作成方法に大きな影響を与えるものであると思っています。

我々は React で並行処理をサポートするために何年ものあいだ研究開発を重ねてきており、特に既存ユーザが段階的に採用できる方法を提供することに関しては注意を払ってきました。昨年の夏に [React 18 ワーキンググループ](/blog/2021/06/08/the-plan-for-react-18)を作成し、エキスパートやコミュニティからフィードバックを集め、React のエコシステム全体がスムースにアップグレードできるようにしてきました。

また、React Conf 2021 でも多くのことを共有してきました。

* [キーノート](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)では、素晴らしいユーザ体験を開発者が簡単に構築できるようにするという我々の使命に React 18 がどう関わるのかについて説明しています。
* [Shruti Kapoor](https://twitter.com/shrutikapoor08) は [React 18 の新機能の使い方についてデモを行っています](https://www.youtube.com/watch?v=ytudH8je5ko&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=2)。
* [Shaundai Person](https://twitter.com/shaundai) は[サスペンスを用いたストリーミングサーバレンダリング](https://www.youtube.com/watch?v=pj5N-Khihgc&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa&index=3)についての概要を説明しています。

以下が、並行レンダー機能をはじめとする、このリリースで期待される新要素の概要です。

<Note>

React Native ユーザ向け：React 18 は新たなアーキテクチャの React Native の一部としてリリースされます。詳細については[こちらの React Conf キーノート](https://www.youtube.com/watch?v=FZ0cG47msEk&t=1530s)を参照してください。*

</Note>

## React の並行処理機能とは？ {/*what-is-concurrent-react*/}

React 18 で加わった中で最も重要なものとはすなわち「並行処理機能」ですが、これはできることなら皆さんが全く考えないで済むのが望ましいことです。ただしアプリケーション開発者にとっては概ねその通りでしょうが、ライブラリのメンテナにとっては話はちょっと複雑かもしれません。

並行処理は、それ自体が何か機能だというわけではありません。これは、同時に UI の複数のバージョンを React が準備しておけるようにするための、新たな裏方のメカニズムです。並行処理機能そのものは実装の詳細 (implementation detail) に過ぎず、それが有用なのはそれで実現できる様々な機能が存在するからこそだ、と考えてください。React は内部の実装において priority queue や multiple buffering などの洗練された手法を用いています。ですがこれらのコンセプトは公開 API のどこにも現れません。

我々が API を設計する際には、開発者に実装の詳細を見せないように努力しています。React 開発者としてみなさんはユーザ体験を*どんな*見た目にしたいかを考えることに集中し、その見た目を*どのように*実現するのかは React が受け持ちます。React 開発者が、裏で並行処理機能がどのように働いているのかを知る必要はありません。

しかし、React の並行処理機能は、普通の「実装の詳細」と比べてより重要なものであり、React のコアのレンダリングモデルに対する本質的な変更です。ですので並行処理の動作について詳しく知ることがもの凄く重要ということではないにせよ、どのようなものかについて高レベルの概観を知っておくことは有用かもしれません。

React の並行処理機能の重要な特性は、処理を中断可能であるということです。React 18 にアップグレードしても、何らかの並行処理機能を加えるまでは、更新は React の以前のバージョンと同じく、まとめて、中断されず、かつ同期的にレンダーされます。同期的なレンダーでは、更新のレンダーが始まったら、ユーザが結果を画面で見られるようになるまでそれを中断することはできません。

並行レンダーにおいては、これが必ずしも正しくなくなります。React は更新のレンダーを開始し、途中で一時停止し、後で再開することができます。途中まで終わったレンダーを完全に捨ててしまうこともありえます。レンダーが中断したとしても、React は UI の見た目に一貫性があることを保証します。これを実現するために、React はツリー全体の評価が終わるまで DOM の書き換えをせずに待機します。これにより、React はメインスレッドをブロックせずにバックグラウンドで次の画面を用意しておけるようになります。つまり、大きなレンダー作業の最中でもユーザの入力に UI が即座に反応できるということであり、ユーザ体験がスムースになります。

もう 1 つの例は、state の再利用です。React の並行処理機能により、画面から UI の一部分をいったん削除し、前回の state を再利用しながら後で戻す、ということが可能です。例えば、ユーザがタブを切り替えて画面から離れて戻ってきた場合、React は以前の画面を以前と同様の state で復帰させる必要があります。将来のマイナーリリースにおいて、このパターンを実装した `<Offscreen>` というコンポーネントを新たに加える予定です。同様に、`<Offscreen>` を使ってバックグラウンドで新しい UI を用意し、ユーザが表示させようとする前に準備完了にしておく、ということもできるようになるでしょう。

並行レンダーは React における新しいパワフルなツールであり、サスペンス、トランジション、ストリーミング付きサーバレンダリングといった新たな機能のほとんどはこれを活用して構築されています。しかし React 18 はこの新しい基盤の上に我々が構築しようとしているものの始まりに過ぎません。

## 並行処理機能の段階的な採用 {/*gradually-adopting-concurrent-features*/}

厳密には、並行レンダーは破壊的変更です。並行レンダーは中断可能なため、それが有効になるとコンポーネントはわずかに異なった動作をします。

我々はテストにおいて、数千のコンポーネントを React 18 のためにアップグレードしました。そこで分かったことは、ほとんどすべての既存のコンポーネントは並行レンダーにおいても「普通に」動作するということです。しかしいくつかのコンポーネントでは移行のための追加作業が必要です。変更は通常小さなものですが、自分のペースで更新作業を行うことも可能です。React 18 の新たなレンダーの挙動は、**あなたのアプリ内で新機能を使っている部分でのみ有効化されます**。

大まかな移行作業の流れとしては、まず既存コードの挙動を壊さずにアプリが React 18 で動作するようにします。それから自分のペースで並行処理機能を徐々に追加し始めることができます。[`<StrictMode>`](/reference/react/StrictMode) を利用すれば、並行処理に関連するバグに開発時に気付きやすいようにできます。strict モードは本番での動作に影響を与えませんが、開発中には追加の警告を表示したり、べき等 (idempotent) であるべき関数を 2 回呼び出したりします。すべての間違いを捕捉することはできませんが、最もよくある間違いを防ぐのに効果的です。

React 18 にアップグレード後、並行処理機能をすぐに使い始めることができます。例えばユーザの入力をブロックせずに画面遷移を行うために startTransition を使うことができます。あるいは高価な再レンダーの頻度を落とすために useDeferredValue を使うことも可能です。

しかし長期的には、あなたのアプリに並行処理を加えるためのメインの方法は、並行処理に対応したライブラリやフレームワークを使うことになるだろうと考えています。ほとんどの場合、あなたが並行処理の API を直接触ることはないはずです。例えば新しい画面に遷移するたびに毎回開発者が startTransition をコールするのではなく、ルータのライブラリがナビゲーションを startTransition で自動でラップするようになるでしょう。

ライブラリがアップグレードされて並行処理機能対応になるまでには、多少時間がかかるかもしれません。並行処理機能をライブラリが活用しやすくするために新しい API を提供しています。当面は、React エコシステムが徐々に移行していくまで、ライブラリメンテナが作業するのをお待ちください。

詳細は、前回の投稿をご覧ください：[React 18 アップグレードガイド](/blog/2022/03/08/react-18-upgrade-guide).

## データフレームワークにおけるサスペンス {/*suspense-in-data-frameworks*/}

React 18 では、Relay、Next.js、Hydrogen、Remix のような、使い方の規約がある (opinionated) フレームワークにおいて、データ取得のためのサスペンスを使い始めることができます。単発的なデータ取得にサスペンスを使うことも技術的には可能ですが、現時点では一般的な戦略としてはお勧めしません。

将来的には、上記のようなフレームワークを用いなくてもあなたのデータにサスペンスを使ってアクセスしやすくするため、新たに基本機能を提供するかもしれません。しかしサスペンスは、ルータやデータレイヤ、サーバレンダリング環境といったあなたのアプリのアーキテクチャと深く結合して利用される場合に、最も効果を発揮します。長期的にも、ライブラリやフレームワークが React のエコシステムにおいて重要な働きをすることを期待しています。

React の以前のバージョンと同様、サスペンスはクライアントで React.lazy を使ってコードを分割する際にも利用できます。しかし我々がサスペンスを使って実現したいと構想しているのは、コードのロードよりもずっと多くのことです。目標は、サスペンスのサポートを拡張していき、いずれはサスペンスによるひとつの宣言的なフォールバックが、あらゆる非同期的な操作（コード、データ、画像などのロード）を扱えるようにすることです。

## サーバコンポーネントはまだ開発中です {/*server-components-is-still-in-development*/}

[**サーバコンポーネント**](/blog/2020/12/21/data-fetching-with-react-server-components) は実装予定の機能であり、クライアントサイドアプリにおけるリッチなインタラクティビティと伝統的なサーバレンダリングによるパフォーマンス改善とを兼ね備えた、クライアント・サーバ両方にまたがるアプリの開発を可能にするものです。サーバコンポーネントは React の並行処理機能と本質的に結合してはいませんが、サスペンスやストリーミングサーバレンダリングのような並行処理機能と併用した際に最もうまく働くようデザインされています。

サーバコンポーネントはまだ実験的機能ですが、18.x のマイナーリリースで初期バージョンをリリースできる見込みです。それまでは、プロポーザルを推し進めて広く採用できる準備が整うよう、Next.js、Hydrogen、Remix のようなフレームワークと協力していきます。

## React 18 の新要素 {/*whats-new-in-react-18*/}

### 新機能：自動バッチング {/*new-feature-automatic-batching*/}

バッチングとは React がパフォーマンスのために複数のステート更新をグループ化して、単一の再レンダーにまとめることを指します。自動バッチング以前は、React のイベントハンドラ内での更新のみバッチ処理されていました。promise や setTimeout、ネイティブのイベントハンドラやその他あらゆるイベント内で起きる更新はデフォルトではバッチ処理されていませんでした。自動バッチングにより、これらの更新も自動でバッチ処理されるようになります：


```js
// Before: only React events were batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will render twice, once for each state update (no batching)
}, 1000);

// After: updates inside of timeouts, promises,
// native event handlers or any other event are batched.
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React will only re-render once at the end (that's batching!)
}, 1000);
```

詳細については、[Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21) を参照してください。

### 新機能：トランジション {/*new-feature-transitions*/}

トランジション（transition; 段階的推移）とは React における新たな概念であり、緊急性の高い更新 (urgent update) と高くない更新 (non-urgent update) を区別するためのものです。

* **緊急性の高い更新**とはタイプ、クリック、プレスといったユーザ操作を直接反映するものです。
* **トランジションによる更新**は UI をある画面から別の画面に段階的に遷移させるものです。

タイプ、クリック、プレスのような緊急性の高い更新は、物理的な物体の挙動に関する我々の直観に反しないよう、即座に反応する必要があり、そうでないと「おかしい」と認識されてしまいます。一方でトランジション内では、ユーザは画面上であらゆる中間の値が見えることを期待していません。

例えば、ドロップダウン内でフィルタを選択した場合、フィルタボタン自体はクリックした瞬間に反応することを期待するでしょう。しかしフィルタの結果は、ボタンの反応とは別に徐々に現れても構いません。小さな遅延は認識できませんし、あって構わないものです。また、前のレンダーが終わっていない段階で再びフィルタを変更した場合、最終的な結果以外は気にしません。

典型的には、最良のユーザ体験のためには、あるひとつのユーザ入力は緊急性の高い更新と高くない更新の両方を引き起こすようにするべきです。input イベント内で startTransition API を用い、React にどの更新の緊急性が高く、どれが「トランジション」なのかを伝えることができます：


```js
import { startTransition } from 'react';

// Urgent: Show what was typed
setInputValue(input);

// Mark any state updates inside as transitions
startTransition(() => {
  // Transition: Show the results
  setSearchQuery(input);
});
```


startTransition でラップした更新は緊急性の低いものとして扱われ、クリックやキー押下のような緊急性の高い更新がやってきた場合には中断されます。トランジションがユーザによって中断された場合（例えば素早く複数のタイプが起こった場合）、React は完了しないままに古くなったレンダーを破棄して、最後の更新のみレンダーします。


* `useTransition`: トランジションを開始するためのフックであり、保留中かどうかの状態を追跡するための値も含まれます。
* `startTransition`: フックが使えない場合にトランジションを開始するためのメソッドです。

トランジションを使うと並行レンダー機能にオプトインし、更新が中断可能になります。また、コンテンツが再サスペンドした場合、バックグラウンドでトランジション中のコンテンツをレンダーしつつ、現在のコンテンツを表示し続けるよう React に伝えます（詳細については [サスペンス RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) を参照）。

[トランジションのドキュメントはこちら](/reference/react/useTransition)。

### サスペンスの新機能 {/*new-suspense-features*/}

サスペンスにより、コンポーネントツリーの一部がまだ表示できない場合に、ロード中という状態を宣言的に記述できるようになります：

```js
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

サスペンスにより、「UI ロード中状態」というものが、React のプログラミングモデルで宣言的に記述可能な主要コンセプトに昇格します。その上により高レベルな機能を構築していけるようになります。

我々は数年前に機能限定版のサスペンスを導入しました。しかしサポートされているユースケースは React.lazy によるコード分割のみであり、サーバでのレンダーにおいては一切サポートされていませんでした。

React 18 ではサーバ側でのサスペンスのサポートを追加し、並行レンダリング機能を用いてその能力を向上させました。

React 18 におけるサスペンスはトランジション API と併用した場合に能力を発揮します。トランジション中でサスペンドが発生すると、React は既に見えているコンテンツがフォールバックによって隠されてしまわないようにするのです。代わりに、十分なデータがロードされるまでレンダーを遅らせて、望ましくないロード中状態が見えないようにします。

詳しくは、[Suspense in React 18](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md) の RFC を参照してください。

### 新たなクライアントおよびサーバ用のレンダー API {/*new-client-and-server-rendering-apis*/}

このリリースを機に、クライアントおよびサーバ用に公開している API を再設計することにしました。これにより React 18 の新しい API にアップグレードするまでの間、React 17 の古い API を利用し続けることができるようになります。

#### React DOM Client {/*react-dom-client*/}

以下の新たな API は `react-dom/client` からエクスポートされるようになっています：

* `createRoot`: `render` したり `unmount` したりできる新たなルートを作成するための新メソッドです。`ReactDOM.render` の代わりに利用してください。これを使わないと React 18 の新機能は動作しません。
* `hydrateRoot`: サーバでレンダーされたアプリをハイドレーションするための新メソッドです。`ReactDOM.hydrate` の代わりに、新たな React DOM サーバ API と併せて利用してください。これを使わないと React 18 の新機能は動作しません。

`createRoot` と `hydrateRoot` のいずれも、`onRecoverableError` という新たなオプションを受け取るようになっており、レンダーあるいはハイドレーション中に起きたエラーから React が復帰した場合に通知を受けてログを残したい場合に利用できます。デフォルトでは React は [`reportError`](https://developer.mozilla.org/en-US/docs/Web/API/reportError) か、古いブラウザの場合は `console.error` を利用します。

[React DOM Client のドキュメントはこちら](/reference/react-dom/client)。

#### React DOM Server {/*react-dom-server*/}

以下の新たな API は `react-dom/client` からエクスポートされるようになっており、サーバでサスペンスをストリーミングする機能を完全にサポートしています：

* `renderToPipeableStream`: Node 環境でのストリーミング用。
* `renderToReadableStream`: Deno や Cloudflare Workers のようなモダンなエッジランタイム環境用。

既存の `renderToString` メソッドは今後も動作しますが、推奨されません。

[React DOM Server のドキュメントはこちら](/reference/react-dom/server)。

### Strict モードの新たな挙動 {/*new-strict-mode-behaviors*/}

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

[state 再利用可能性の保証についてのドキュメントはこちら](/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development)。

### 新たなフック {/*new-hooks*/}

#### useId {/*useid*/}

`useId` はハイドレーション時の不整合を防ぎつつクライアントとサーバで一意な ID を生成するためのフックです。これは主に、一意な ID を必要とするアクセシビリティ API を組み込むようなコンポーネントライブラリで有用なものです。これにより React 17 およびそれ以前から既に存在した問題が解決されますが、React 18 では新しいストリーミング対応のサーバレンダラが HTML を順番通りに送信しなくなるため、この問題はより重要です。[こちらのドキュメントを参照](/reference/react/useId)。

> 補足
>
> `useId` は[リスト内の key](/learn/rendering-lists#where-to-get-your-key) を作成するのに使うためのものでは**ありません**。key はあなたのデータから作成されるべきです。

#### useTransition {/*usetransition*/}

`useTransition` と `startTransition` により、一部の更新は緊急性が低いということをマークできるようになります。その他の更新はデフォルトで緊急性が高いものとして扱われます。React は緊急性の高い更新（例えばテキスト入力の更新）が、緊急性の低い更新（例えば検索結果のリストのレンダー）を中断できるようになります。[こちらのドキュメントを参照](/reference/react/useTransition)。

#### useDeferredValue {/*usedeferredvalue*/}

`useDeferredValue` により、ツリー内の緊急性の低い更新の再レンダーを遅延させることができます。デバウンス (debounce) に似ていますが、それと比べていくつかの利点があります。遅延時間が固定でないため、最初のレンダーが画面に反映された時点ですぐに遅延されていた方のレンダーを始められるのです。また遅延されたレンダーは中断可能であり、ユーザインプットをブロックしません。[こちらのドキュメントを参照](/reference/react/useDeferredValue)。

#### useSyncExternalStore {/*usesyncexternalstore*/}

`useSyncExternalStore` は、外部ストアへの更新を強制的に同期的に行うことで、外部ストアが並行読み取りを行えるようにします。これにより外部のデータソースに購読する際に `useEffect` を使う必要性がなくなるので、React 外部の状態を扱うあらゆるライブラリにとって推奨されるものです。[こちらのドキュメントを参照](/reference/react/useSyncExternalStore)。

> 補足
>
> `useSyncExternalStore` はアプリケーションコードではなくライブラリで使用されることを意図しています。

#### useInsertionEffect {/*useinsertioneffect*/}

`useInsertionEffect` は、CSS-in-JS ライブラリがレンダー時にスタイルを注入する際のパフォーマンス上の問題に対処できるようにするための新しいフックです。すでに CSS-in-JS ライブラリを構築しているのでなければ、これを使うことはまずないでしょう。このフックは、DOM が書き換えられた後、レイアウト副作用 (layout effect) が新しいレイアウトを読み込む前に実行されます。これにより React 17 およびそれ以前から既に存在した問題が解決されますが、React 18 では並行レンダー中にブラウザに処理が渡り、そこでレイアウトが再計算される可能性があるため、より重要です。[こちらのドキュメントを参照](/reference/react/useInsertionEffect)。

> 補足
>
> `useInsertionEffect` はアプリケーションコードではなくライブラリで使用されることを意図しています。

## アップグレード方法 {/*how-to-upgrade*/}

ステップバイステップのガイド、および破壊的変更・注目すべき変更の全リストについては [React 18 アップグレードガイド](/blog/2022/03/08/react-18-upgrade-guide)を参照してください。

## Changelog {/*changelog*/}

### React {/*react*/}

* Add `useTransition` and `useDeferredValue` to separate urgent updates from transitions. ([#10426](https://github.com/facebook/react/pull/10426), [#10715](https://github.com/facebook/react/pull/10715), [#15593](https://github.com/facebook/react/pull/15593), [#15272](https://github.com/facebook/react/pull/15272), [#15578](https://github.com/facebook/react/pull/15578), [#15769](https://github.com/facebook/react/pull/15769), [#17058](https://github.com/facebook/react/pull/17058), [#18796](https://github.com/facebook/react/pull/18796), [#19121](https://github.com/facebook/react/pull/19121), [#19703](https://github.com/facebook/react/pull/19703), [#19719](https://github.com/facebook/react/pull/19719), [#19724](https://github.com/facebook/react/pull/19724), [#20672](https://github.com/facebook/react/pull/20672), [#20976](https://github.com/facebook/react/pull/20976) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useId` for generating unique IDs. ([#17322](https://github.com/facebook/react/pull/17322), [#18576](https://github.com/facebook/react/pull/18576), [#22644](https://github.com/facebook/react/pull/22644), [#22672](https://github.com/facebook/react/pull/22672), [#21260](https://github.com/facebook/react/pull/21260) by [@acdlite](https://github.com/acdlite), [@lunaruan](https://github.com/lunaruan), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `useSyncExternalStore` to help external store libraries integrate with React. ([#15022](https://github.com/facebook/react/pull/15022), [#18000](https://github.com/facebook/react/pull/18000), [#18771](https://github.com/facebook/react/pull/18771), [#22211](https://github.com/facebook/react/pull/22211), [#22292](https://github.com/facebook/react/pull/22292), [#22239](https://github.com/facebook/react/pull/22239), [#22347](https://github.com/facebook/react/pull/22347), [#23150](https://github.com/facebook/react/pull/23150) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@drarmstr](https://github.com/drarmstr))
* Add `startTransition` as a version of `useTransition` without pending feedback. ([#19696](https://github.com/facebook/react/pull/19696)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Add `useInsertionEffect` for CSS-in-JS libraries. ([#21913](https://github.com/facebook/react/pull/21913)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Make Suspense remount layout effects when content reappears.  ([#19322](https://github.com/facebook/react/pull/19322), [#19374](https://github.com/facebook/react/pull/19374), [#19523](https://github.com/facebook/react/pull/19523), [#20625](https://github.com/facebook/react/pull/20625), [#21079](https://github.com/facebook/react/pull/21079) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), and [@lunaruan](https://github.com/lunaruan))
* Make `<StrictMode>` re-run effects to check for restorable state. ([#19523](https://github.com/facebook/react/pull/19523) , [#21418](https://github.com/facebook/react/pull/21418)  by [@bvaughn](https://github.com/bvaughn) and [@lunaruan](https://github.com/lunaruan))
* Assume Symbols are always available. ([#23348](https://github.com/facebook/react/pull/23348)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove `object-assign` polyfill. ([#23351](https://github.com/facebook/react/pull/23351)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Remove unsupported `unstable_changedBits` API.  ([#20953](https://github.com/facebook/react/pull/20953)  by [@acdlite](https://github.com/acdlite))
* Allow components to render undefined. ([#21869](https://github.com/facebook/react/pull/21869)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Flush `useEffect` resulting from discrete events like clicks synchronously. ([#21150](https://github.com/facebook/react/pull/21150)  by [@acdlite](https://github.com/acdlite))
* Suspense `fallback={undefined}` now behaves the same as `null` and isn't ignored. ([#21854](https://github.com/facebook/react/pull/21854)  by [@rickhanlonii](https://github.com/rickhanlonii))
* Consider all `lazy()` resolving to the same component equivalent. ([#20357](https://github.com/facebook/react/pull/20357)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Don't patch console during first render. ([#22308](https://github.com/facebook/react/pull/22308)  by [@lunaruan](https://github.com/lunaruan))
* Improve memory usage. ([#21039](https://github.com/facebook/react/pull/21039)  by [@bgirard](https://github.com/bgirard))
* Improve messages if string coercion throws (Temporal.*, Symbol, etc.) ([#22064](https://github.com/facebook/react/pull/22064)  by [@justingrant](https://github.com/justingrant))
* Use `setImmediate` when available over `MessageChannel`. ([#20834](https://github.com/facebook/react/pull/20834)  by [@gaearon](https://github.com/gaearon))
* Fix context failing to propagate inside suspended trees. ([#23095](https://github.com/facebook/react/pull/23095)  by [@gaearon](https://github.com/gaearon))
* Fix `useReducer` observing incorrect props by removing the eager bailout mechanism. ([#22445](https://github.com/facebook/react/pull/22445)  by [@josephsavona](https://github.com/josephsavona))
* Fix `setState` being ignored in Safari when appending iframes. ([#23111](https://github.com/facebook/react/pull/23111)  by [@gaearon](https://github.com/gaearon))
* Fix a crash when rendering `ZonedDateTime` in the tree. ([#20617](https://github.com/facebook/react/pull/20617)  by [@dimaqq](https://github.com/dimaqq))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/facebook/react/pull/22695)  by [@SimenB](https://github.com/SimenB))
* Fix `onLoad` not triggering when concurrent features are on. ([#23316](https://github.com/facebook/react/pull/23316)  by [@gnoff](https://github.com/gnoff))
* Fix a warning when a selector returns `NaN`.  ([#23333](https://github.com/facebook/react/pull/23333)  by [@hachibeeDI](https://github.com/hachibeeDI))
* Fix a crash when document is set to `null` in tests. ([#22695](https://github.com/facebook/react/pull/22695) by [@SimenB](https://github.com/SimenB))
* Fix the generated license header. ([#23004](https://github.com/facebook/react/pull/23004)  by [@vitaliemiron](https://github.com/vitaliemiron))
* Add `package.json` as one of the entry points. ([#22954](https://github.com/facebook/react/pull/22954)  by [@Jack](https://github.com/Jack-Works))
* Allow suspending outside a Suspense boundary. ([#23267](https://github.com/facebook/react/pull/23267)  by [@acdlite](https://github.com/acdlite))
* Log a recoverable error whenever hydration fails. ([#23319](https://github.com/facebook/react/pull/23319)  by [@acdlite](https://github.com/acdlite))

### React DOM {/*react-dom*/}

* Add `createRoot` and `hydrateRoot`. ([#10239](https://github.com/facebook/react/pull/10239), [#11225](https://github.com/facebook/react/pull/11225), [#12117](https://github.com/facebook/react/pull/12117), [#13732](https://github.com/facebook/react/pull/13732), [#15502](https://github.com/facebook/react/pull/15502), [#15532](https://github.com/facebook/react/pull/15532), [#17035](https://github.com/facebook/react/pull/17035), [#17165](https://github.com/facebook/react/pull/17165), [#20669](https://github.com/facebook/react/pull/20669), [#20748](https://github.com/facebook/react/pull/20748), [#20888](https://github.com/facebook/react/pull/20888), [#21072](https://github.com/facebook/react/pull/21072), [#21417](https://github.com/facebook/react/pull/21417), [#21652](https://github.com/facebook/react/pull/21652), [#21687](https://github.com/facebook/react/pull/21687), [#23207](https://github.com/facebook/react/pull/23207), [#23385](https://github.com/facebook/react/pull/23385) by [@acdlite](https://github.com/acdlite), [@bvaughn](https://github.com/bvaughn), [@gaearon](https://github.com/gaearon), [@lunaruan](https://github.com/lunaruan), [@rickhanlonii](https://github.com/rickhanlonii), [@trueadm](https://github.com/trueadm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add selective hydration. ([#14717](https://github.com/facebook/react/pull/14717), [#14884](https://github.com/facebook/react/pull/14884), [#16725](https://github.com/facebook/react/pull/16725), [#16880](https://github.com/facebook/react/pull/16880), [#17004](https://github.com/facebook/react/pull/17004), [#22416](https://github.com/facebook/react/pull/22416), [#22629](https://github.com/facebook/react/pull/22629), [#22448](https://github.com/facebook/react/pull/22448), [#22856](https://github.com/facebook/react/pull/22856), [#23176](https://github.com/facebook/react/pull/23176) by [@acdlite](https://github.com/acdlite), [@gaearon](https://github.com/gaearon), [@salazarm](https://github.com/salazarm), and [@sebmarkbage](https://github.com/sebmarkbage))
* Add `aria-description` to the list of known ARIA attributes. ([#22142](https://github.com/facebook/react/pull/22142)  by [@mahyareb](https://github.com/mahyareb))
* Add `onResize` event to video elements. ([#21973](https://github.com/facebook/react/pull/21973)  by [@rileyjshaw](https://github.com/rileyjshaw))
* Add `imageSizes` and `imageSrcSet` to known props. ([#22550](https://github.com/facebook/react/pull/22550)  by [@eps1lon](https://github.com/eps1lon))
* Allow non-string `<option>` children if `value` is provided.  ([#21431](https://github.com/facebook/react/pull/21431)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix `aspectRatio` style not being applied. ([#21100](https://github.com/facebook/react/pull/21100)  by [@gaearon](https://github.com/gaearon))
* Warn if `renderSubtreeIntoContainer` is called. ([#23355](https://github.com/facebook/react/pull/23355)  by [@acdlite](https://github.com/acdlite))

### React DOM Server {/*react-dom-server-1*/}

* Add the new streaming renderer. ([#14144](https://github.com/facebook/react/pull/14144), [#20970](https://github.com/facebook/react/pull/20970), [#21056](https://github.com/facebook/react/pull/21056), [#21255](https://github.com/facebook/react/pull/21255), [#21200](https://github.com/facebook/react/pull/21200), [#21257](https://github.com/facebook/react/pull/21257), [#21276](https://github.com/facebook/react/pull/21276), [#22443](https://github.com/facebook/react/pull/22443), [#22450](https://github.com/facebook/react/pull/22450), [#23247](https://github.com/facebook/react/pull/23247), [#24025](https://github.com/facebook/react/pull/24025), [#24030](https://github.com/facebook/react/pull/24030) by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix context providers in SSR when handling multiple requests. ([#23171](https://github.com/facebook/react/pull/23171)  by [@frandiox](https://github.com/frandiox))
* Revert to client render on text mismatch. ([#23354](https://github.com/facebook/react/pull/23354)  by [@acdlite](https://github.com/acdlite))
* Deprecate `renderToNodeStream`. ([#23359](https://github.com/facebook/react/pull/23359)  by [@sebmarkbage](https://github.com/sebmarkbage))
* Fix a spurious error log in the new server renderer. ([#24043](https://github.com/facebook/react/pull/24043)  by [@eps1lon](https://github.com/eps1lon))
* Fix a bug in the new server renderer. ([#22617](https://github.com/facebook/react/pull/22617)  by [@shuding](https://github.com/shuding))
* Ignore function and symbol values inside custom elements on the server. ([#21157](https://github.com/facebook/react/pull/21157)  by [@sebmarkbage](https://github.com/sebmarkbage))

### React DOM Test Utils {/*react-dom-test-utils*/}

* Throw when `act` is used in production. ([#21686](https://github.com/facebook/react/pull/21686)  by [@acdlite](https://github.com/acdlite))
* Support disabling spurious act warnings with `global.IS_REACT_ACT_ENVIRONMENT`. ([#22561](https://github.com/facebook/react/pull/22561)  by [@acdlite](https://github.com/acdlite))
* Expand act warning to cover all APIs that might schedule React work. ([#22607](https://github.com/facebook/react/pull/22607)  by [@acdlite](https://github.com/acdlite))
* Make `act` batch updates. ([#21797](https://github.com/facebook/react/pull/21797)  by [@acdlite](https://github.com/acdlite))
* Remove warning for dangling passive effects. ([#22609](https://github.com/facebook/react/pull/22609)  by [@acdlite](https://github.com/acdlite))

### React Refresh {/*react-refresh*/}

* Track late-mounted roots in Fast Refresh. ([#22740](https://github.com/facebook/react/pull/22740)  by [@anc95](https://github.com/anc95))
* Add `exports` field to `package.json`. ([#23087](https://github.com/facebook/react/pull/23087)  by [@otakustay](https://github.com/otakustay))

### Server Components (Experimental) {/*server-components-experimental*/}

* Add Server Context support. ([#23244](https://github.com/facebook/react/pull/23244)  by [@salazarm](https://github.com/salazarm))
* Add `lazy` support. ([#24068](https://github.com/facebook/react/pull/24068)  by [@gnoff](https://github.com/gnoff))
* Update webpack plugin for webpack 5 ([#22739](https://github.com/facebook/react/pull/22739)  by [@michenly](https://github.com/michenly))
* Fix a mistake in the Node loader. ([#22537](https://github.com/facebook/react/pull/22537)  by [@btea](https://github.com/btea))
* Use `globalThis` instead of `window` for edge environments. ([#22777](https://github.com/facebook/react/pull/22777)  by [@huozhi](https://github.com/huozhi))
