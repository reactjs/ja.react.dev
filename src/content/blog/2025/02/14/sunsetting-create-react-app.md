---
title: "Create React App の非推奨化"
author: Matt Carroll and Ricky Hanlon
date: 2025/02/14
description: 本日、新規アプリに対して Create React App を非推奨とし、既存のアプリにはフレームワークへの移行、または Vite、Parcel、RSBuild などのビルドツールへの移行を推奨します。また、フレームワークがプロジェクトに適していない場合や独自のフレームワークを構築したい場合、あるいは React がどのように動作するかを学ぶためにゼロから React アプリを構築したい場合のためのドキュメントも提供します。
---

February 14, 2025 by [Matt Carroll](https://twitter.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

本日、新しいアプリに対して [Create React App](https://create-react-app.dev/) を非推奨とします。既存のアプリに対しては、[フレームワーク](#how-to-migrate-to-a-framework)への移行、または Vite、Parcel、RSBuild などの[ビルドツールへの移行](#how-to-migrate-to-a-build-tool)を推奨します。

また、フレームワークがプロジェクトに適していない場合や、独自のフレームワークを構築したい場合、あるいは[ゼロから React アプリを構築する](/learn/build-a-react-app-from-scratch)ことで React がどのように動作するかを学びたい場合のためのドキュメントも提供します。

</Intro>

-----

2016 年に Create React App をリリースした当時は、新しい React アプリを構築するための明確な方法が存在しませんでした。

React アプリを作成するには、多くのツールをインストールしてそれらを自分で組み合わせ、JSX、リンタ、ホットリロードなどの基本機能をサポートしていく必要がありました。これを正しく行うのは非常に難しかったため、[コミュニティは](https://github.com/react-boilerplate/react-boilerplate) [セットアップを](https://github.com/kriasoft/react-starter-kit) [共通化するために](https://github.com/petehunt/react-boilerplate) [様々なボイラープレートを](https://github.com/gaearon/react-hot-boilerplate) [作成しました](https://github.com/erikras/react-redux-universal-hot-example)。しかし、ボイラープレートは更新が難しく、分断化が進むにつれ React が新機能をリリースするのは困難となっていきました。

Create React App は、いくつかのツールを単一の推奨セットアップにまとめることでこれらの問題を解決しました。これにより、アプリが新しいツールの機能を使うためのアップグレードが簡単になり、React チームは大きめのツールの変更（Fast Refresh のサポートやフックのリントルールなど）を最大限広範なユーザに展開できるようになりました。

このモデルは非常に人気があるため、今日ではこのように動作するツール群が一大勢力として存在しています。

## Create React App の非推奨化 {/*deprecating-create-react-app*/}

Create React App は簡単に始められるものの、[いくつかの制限](#limitations-of-build-tools)があり、本番環境用の高性能なアプリを構築することが困難となっています。原理的には、これらの問題は Create React App を[フレームワーク](#why-we-recommend-frameworks)へと発展させることで解決可能でしょう。

しかし、現在 Create React App にはアクティブなメンテナがいない一方で、これらの問題をすでに解決している多くの既存のフレームワークが存在します。このため、Create React App を非推奨とすることに決定しました。

本日より、新しいアプリをインストールすると、非推奨の警告が表示されます。

<ConsoleBlockMulti>
<ConsoleLogLine level="error">

create-react-app is deprecated.
{'\n\n'}
You can find a list of up-to-date React frameworks on react.dev
For more info see: react.dev/link/cra
{'\n\n'}
This error message will only be shown once per install.

</ConsoleLogLine>
</ConsoleBlockMulti>

また、Create React App の[ウェブサイト](https://create-react-app.dev/)と GitHub [リポジトリ](https://github.com/facebook/create-react-app)にも非推奨の通知を追加しました。Create React App はメンテナンスモードで動作を続けます。React 19 で動作する新しいバージョンの Create React App を公開しました。

## フレームワークへの移行方法 {/*how-to-migrate-to-a-framework*/}
フレームワークを使用して[新しい React アプリを作成する](/learn/creating-a-react-app)ことをお勧めします。私たちが推奨するすべてのフレームワークは、クライアントサイドレンダー ([CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR)) とシングルページアプリ ([SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)) をサポートしており、サーバなしで CDN や静的ホスティングサービスにデプロイ可能です。

既存のアプリをクライアント専用の SPA に移行したい場合は以下のガイドが役立ちます。

* [Next.js の Create React App 移行ガイド](https://nextjs.org/docs/app/building-your-application/upgrading/from-create-react-app)
* [React Router のフレームワーク採用ガイド](https://reactrouter.com/upgrading/component-routes)
* [Expo webpack から Expo Router への移行ガイド](https://docs.expo.dev/router/migrate/from-expo-webpack/)

## ビルドツールへの移行方法 {/*how-to-migrate-to-a-build-tool*/}

アプリに特異な制約がある場合や、独自のフレームワークを構築することでこれらの問題を解決したい場合、またはゼロから React がどのように動作するかを学びたい場合は、Vite、Parcel、Rsbuild を使用して React を用いたカスタムセットアップを作成できます。

既存のアプリをこのようなビルドツールに移行したい場合は以下のガイドが役立ちます。

* [Vite の Create React App 移行ガイド](https://www.robinwieruch.de/vite-create-react-app/)
* [Parcel の Create React App 移行ガイド](https://parceljs.org/migration/cra/)
* [Rsbuild の Create React App 移行ガイド](https://rsbuild.dev/guide/migration/cra)

Vite、Parcel、Rsbuild を使用して始めるために、[ゼロから React アプリを構築する](/learn/build-a-react-app-from-scratch)ための新しいドキュメントを追加しました。

<DeepDive>

#### フレームワークは必要？ {/*do-i-need-a-framework*/}

ほとんどのアプリはフレームワークの恩恵を受けますが、ゼロから React アプリを構築する正当なケースもあります。目安として、アプリにルーティングが必要なら、おそらくフレームワークの恩恵を受ける可能性が高いでしょう。

Svelte には Sveltekit、Vue には Nuxt、Solid には SolidStart があるように、React は、ルーティングをデータフェッチやコード分割などの機能に完全に統合した[フレームワークを使用することを推奨しています](#why-we-recommend-frameworks)。これにより、複雑な設定を自分で書いて実質的に自分用のフレームワークを構築してしまうような必要がなくなります。

しかし Vite、Parcel、Rsbuild などのビルドツールを使用して[ゼロから React アプリを構築する](/learn/build-a-react-app-from-scratch)ことも可能です。

</DeepDive>

以下で、[ビルドツールの制約](#limitations-of-build-tools)と[フレームワークを推奨する理由](#why-we-recommend-frameworks)についてさらに述べていきます。

## ビルドツールの制約とは {/*limitations-of-build-tools*/}

Create React App やそれに類するビルドツールを使えば、React アプリの構築を簡単に始められます。`npx create-react-app my-app` を実行すると、開発用サーバ、リンタ、本番用ビルド機能が完全に設定された React アプリが手に入ります。

たとえば、内部向けの管理ツールを構築している場合、さっそく以下のようなランディングページから始めることができるでしょう。

```js
export default function App() {
  return (
    <div>
      <h1>Welcome to the Admin Tool!</h1>
    </div>
  )
}
```

これにより、JSX、デフォルトのリントルール、開発環境と本番環境の両方で実行するためのバンドラといった機能がある状態で、すぐに React でコーディングを始めることができます。しかし、このセットアップには、実際の本番用アプリを構築するために必要なツールが欠けています。

ほとんどの本番用アプリでは、ルーティング、データフェッチ、コード分割などの問題に対する解決策も必要なのです。

### ルーティング {/*routing*/}

Create React App には、特定のルーティングソリューションは含まれていません。始めたばかりの場合、ページを切り替えるために `useState` を使用する、というのがひとつの選択肢です。しかし、こうするとアプリ内リンクの共有が不可能（すべてのリンクが同じページに移動してしまう）になりますし、時間が経つにつれてアプリを組み立てるのが難しくなります。

```js
import {useState} from 'react';

import Home from './Home';
import Dashboard from './Dashboard';

export default function App() {
  // ❌ Routing in state does not create URLs
  const [route, setRoute] = useState('home');
  return (
    <div>
      {route === 'home' && <Home />}
      {route === 'dashboard' && <Dashboard />}
    </div>
  )
}
```

このため、Create React App を使用するほとんどのアプリは、[React Router](https://reactrouter.com/) や [Tanstack Router](https://tanstack.com/router/latest) などのルーティングライブラリを使用してルーティングを追加します。ルーティングライブラリを使用することで、アプリに追加のルート (route) を追加でき、アプリの組み立て方に対する指針が生まれ、各ページへのリンクを共有できるようになります。たとえば、React Router では以下のようにルートを定義できます。

```js
import {RouterProvider, createBrowserRouter} from 'react-router';

import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Each route has it's own URL
const router = createBrowserRouter([
  {path: '/', element: <Home />},
  {path: '/dashboard', element: <Dashboard />}
]);

export default function App() {
  return (
    <RouterProvider value={router} />
  )
}
```

これにより、`/dashboard` というリンクを共有すれば、アプリはダッシュボードページに移動するようになります。ルーティングライブラリには、ルートのネスト、ルートガード、ルート間画面遷移効果 (route transition) などの追加機能もあり、これらはルーティングライブラリなしには実装困難です。

ルーティングライブラリを使うとアプリは複雑になりますが、その代わりに、それなしでは作れないような機能も使えるようになる、というトレードオフがあるのです。

### データフェッチ {/*data-fetching*/}

Create React App でのもうひとつの一般的な問題はデータフェッチです。Create React App には、特定のデータフェッチソリューションは含まれていませんが、入門したばかりの方は、データをロードするためにエフェクト内で `fetch` を使う方法を選びがちです。

しかし、これを行うと、データがコンポーネントのレンダー後にフェッチされるため、ネットワークウォーターフォールが発生します。ネットワークウォーターフォールは、コードとデータを並行でダウンロードするのではなく、アプリのレンダー後にデータをフェッチすることで発生します。

```js
export default function Dashboard() {
  const [data, setData] = useState(null);

  // ❌ Fetching data in a component causes network waterfalls
  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

エフェクト内でフェッチするということは、ユーザがコンテンツを見るまでの待ち時間が長くなるということです。データはもっと早く取得できていたかもしれないのです。これを解決するために、[TanStack Query](https://tanstack.com/query/)、[SWR](https://swr.vercel.app/)、[Apollo](https://www.apollographql.com/docs/react)、[Relay](https://relay.dev/) などのデータフェッチライブラリを使用すると、コンポーネントのレンダーより前にデータをプリフェッチできるオプションが使用可能です。

これらのライブラリは、ルートのレベルで依存データを指定するための、「ルーティングローダ」パターンと統合することで最適に機能します。これによりルータがデータフェッチを最適化可能です。

```js
export async function loader() {
  const response = await fetch(`/api/data`);
  const data = await response.json();
  return data;
}

// ✅ Fetching data in parallel while the code is downloading
export default function Dashboard({loaderData}) {
  return (
    <div>
      {loaderData.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

初回ロード時に、ルータはルートがレンダーされる直前にデータをフェッチできます。ユーザがアプリ内を移動する際、ルータはデータとルートのフェッチを並列化して同時に行えます。これにより、画面上のコンテンツを見るまでの時間が短縮され、ユーザエクスペリエンスが向上します。

ただし、このためにはアプリ内のローダを正しく設定する必要があり、パフォーマンスのために複雑さを受け入れていることになってしまいます。

### コード分割 {/*code-splitting*/}

Create React App における次の一般的な問題は[コード分割](https://www.patterns.dev/vanilla/bundle-splitting)です。Create React App には、特定のコード分割ソリューションは含まれていません。始めたばかりの場合、コード分割について考えることは全くないかもしれません。

その場合、アプリは単一のバンドルとしてホストされます。

```txt
- bundle.js    75kb
```

しかし、理想的なパフォーマンスのためには、コードを別々のバンドルに「分割」し、ユーザが必要とするものだけをダウンロードするようにする必要があります。これにより、ユーザは現在いるページを表示するために必要なコードだけをダウンロードするようになり、アプリをロードするまでの待ち時間が短縮されます。

```txt
- core.js      25kb
- home.js      25kb
- dashboard.js 25kb
```

コード分割を行う方法のひとつは、`React.lazy` を使用することです。しかし、この方法ではレンダーされる段階になって初めてコードが取得されるため、ネットワークウォーターフォールが発生する可能性があります。より良い解決策は、ルータにある、コードのダウンロード中に関連コード群を並行的にフェッチするための機能を使用することです。例えば、React Router は `lazy` オプションを提供しており、これを使ってルートをコード分割対象として指定し、読み込みタイミングを最適化できます。

```js
import Home from './Home';
import Dashboard from './Dashboard';

// ✅ Routes are downloaded before rendering
const router = createBrowserRouter([
  {path: '/', lazy: () => import('./Home')},
  {path: '/dashboard', lazy: () => import('Dashboard')}
]);
```

コード分割を正しく行うことは難しく、ユーザが必要以上のコードをダウンロードしてしまうというミスがよく発生します。コード分割が最大限活躍するのは、ルータやデータロード処理と結合することで、キャッシュを最大限活用し、フェッチを並行して行い、["import on interaction"](https://www.patterns.dev/vanilla/import-on-interaction) パターンをサポートした場合です。

### ほかにも… {/*and-more*/}

以上は、Create React App における制約のほんの一部に過ぎません。

ルーティング、データフェッチ、コード分割を組み込んだ後も、今度は送信中状態、ナビゲーションの中断、ユーザへのエラーメッセージ、データの再検証を考慮する必要があります。開発者が解決しなければならない問題領域は大量に存在するのです。

<div style={{display: 'flex', width: '100%', justifyContent: 'space-around'}}>
  <ul>
    <li>アクセシビリティ</li>
    <li>アセットのロード</li>
    <li>認証</li>
    <li>キャッシング</li>
  </ul>
  <ul>
    <li>エラー処理</li>
    <li>データの書き換え</li>
    <li>ナビゲーション</li>
    <li>楽観的更新</li>
  </ul>
  <ul>
    <li>プログレッシブエンハンスメント</li>
    <li>サーバサイドレンダー</li>
    <li>静的サイト生成</li>
    <li>ストリーミング</li>
  </ul>
</div>

これらすべてが最適な[ロードシーケンス](https://www.patterns.dev/vanilla/loading-sequence)を作成するために連携します。

Create React App でこれらの問題を個別に解決することは困難です。各問題は他の問題と相互に関連しており、開発者が慣れていない問題領域での深い専門知識を必要とすることがあります。これらの問題を解決しようとすると、開発者は Create React App の上に独自の特注ソリューションを構築していく羽目になりますが、本来 Create React App はそういうことをしないで済むためのもののはずでした。

## 我々がフレームワークを推奨する理由 {/*why-we-recommend-frameworks*/}

Create React App、Vite、Parcel などのビルドツールでこれらの要素をすべて自分で解決することも可能ですが、うまくやることは困難です。Create React App 自体がいくつかのビルドツールを統合したときのように、これらの機能をすべて統合してユーザに最高のエクスペリエンスを提供するためのツールが必要です。

ビルドツール、レンダー、ルーティング、データフェッチ、コード分割のすべてを統合する、というツールのカテゴリは「フレームワーク」として知られています。React 自体をフレームワークと呼ぶことを好む場合は、「メタフレームワーク」と呼ぶこともできるでしょう。

ビルドツールにも多少の使い方に関する規約があるのと同様、フレームワークにもより良いユーザ体験を提供するためにどのようにアプリを構造化するのかについて、規約が存在します。これが、我々が [Next.js](https://nextjs.org/)、[React Router](https://reactrouter.com/)、[Expo](https://expo.dev/) などのフレームワークを新しいプロジェクトに推奨し始めた理由です。

フレームワークは Create React App と同様の始めやすさを提供しつつ、実際のプロダクションアプリで開発者がいずれにせよ解決する必要のある問題に対するソリューションも提供するのです。

<DeepDive>

#### サーバレンダーはオプションです {/*server-rendering-is-optional*/}

私たちが推奨するフレームワークはすべて、[クライアントサイドレンダー (CSR)](https://developer.mozilla.org/en-US/docs/Glossary/CSR) によるアプリを作成するためのオプションを提供しています。

あるページにとって CSR が正しい選択となることはありますが、多くの場合はそうではありません。アプリのほとんどがクライアントサイドという場合でも、[静的サイト生成 (SSG)](https://developer.mozilla.org/en-US/docs/Glossary/SSG) や [サーバサイドレンダリング (SSR)](https://developer.mozilla.org/en-US/docs/Glossary/SSR) などのサーバレンダー機能の恩恵を受けることができる個別ページはしばしば存在します。たとえば利用規約ページやドキュメントなどです。

サーバレンダーはクライアントに送信される JavaScript を全体的に削減し、完全な HTML ドキュメントを送信することで、[First Contentful Paint (FCP)](https://web.dev/articles/fcp) を高速化し、[Total Blocking Time (TBD)](https://web.dev/articles/tbt) を削減し、またそれにより [Interaction to Next Paint (INP)](https://web.dev/articles/inp) を低下させることができます。Chrome チームが開発者に向けて、パフォーマンス最大化のために、完全にクライアントサイドに寄せた戦略ではなく静的ないしサーバサイドレンダリングを[検討するよう促している](https://web.dev/articles/rendering-on-the-web)のには、このような理由があるのです。

サーバを使用することにはトレードオフがあり、すべてのページにとって常に最良の選択肢というわけではありません。サーバでページを生成することにより追加のコストと生成時間がかかるため、[Time to First Byte (TTFB)](https://web.dev/articles/ttfb) を増加させる可能性があります。最高のパフォーマンスのアプリでは、それぞれの戦略のトレードオフに基づいて、ページごとに適切なレンダー戦略を選択できます。

フレームワークは、必要に応じて好きなページでサーバを使用するオプションを提供しますが、サーバの使用を強制するわけではありません。これにより、アプリ内の各ページごとに、適したレンダー戦略を選択できるようになっています。

#### サーバコンポーネントについて {/*server-components*/}

私たちが推奨するフレームワークは、React Server Components のサポートも含んでいます。

サーバコンポーネントでは、ルーティングとデータフェッチをサーバ側に移動し、クライアントコンポーネントのコード分割を（レンダーするページ単位のみならず）レンダーするデータの種類に基づいて行うことで、これらの問題を解決します。送信される JavaScript の量を減らすことで、最適な[ローディングシーケンス](https://www.patterns.dev/vanilla/loading-sequence)を実現します。

サーバコンポーネントはサーバを必要としません。ビルド時に CI サーバで実行して静的サイト生成 (SSG) アプリを作成するためにも使えますし、ランタイム時にウェブサーバで実行してサーバサイドレンダー (SSR) アプリを作成するためにも使えます。

詳細については、[バンドルサイズゼロの React サーバコンポーネントの紹介](/blog/2020/12/21/data-fetching-with-react-server-components) と [ドキュメント](/reference/rsc/server-components) を参照してください。

</DeepDive>

<Note>

#### サーバレンダーは SEO のためだけではない {/*server-rendering-is-not-just-for-seo*/}

サーバレンダーは [SEO](https://developer.mozilla.org/en-US/docs/Glossary/SEO) のためだけにある、というのはよくある誤解です。

サーバレンダーは SEO も改善しますが、ユーザが画面上のコンテンツを見られるようになるまでにダウンロード・パースする必要のある JavaScript の量を減らすことで、パフォーマンスも向上させるものです。

Chrome チームが開発者に向けて、パフォーマンス最大化のために、完全なクライアントサイドに寄せた戦略ではなく、静的ないしサーバサイドレンダリングを検討するよう[促している](https://web.dev/articles/rendering-on-the-web)のには、このような理由があるのです。

</Note>

---

_Create React App を作成した [Dan Abramov](https://bsky.app/profile/danabra.mov)、および Create React App を長年にわたりメンテナンスしてきた [Joe Haddad](https://github.com/Timer)、[Ian Schmitz](https://github.com/ianschmitz)、[Brody McKee](https://github.com/mrmckeb)、そして[他の多くの方々](https://github.com/facebook/create-react-app/graphs/contributors)に感謝します。この投稿をレビューし、フィードバックを提供していただいた [Brooks Lybrand](https://bsky.app/profile/brookslybrand.bsky.social)、[Dan Abramov](https://bsky.app/profile/danabra.mov)、[Devon Govett](https://bsky.app/profile/devongovett.bsky.social)、[Eli White](https://x.com/Eli_White)、[Jack Herrington](https://bsky.app/profile/jherr.dev)、[Joe Savona](https://x.com/en_JS)、[Lauren Tan](https://bsky.app/profile/no.lol)、[Lee Robinson](https://x.com/leeerob)、[Mark Erikson](https://bsky.app/profile/acemarke.dev)、[Ryan Florence](https://x.com/ryanflorence)、[Sophie Alpert](https://bsky.app/profile/sophiebits.com)、[Tanner Linsley](https://bsky.app/profile/tannerlinsley.com)、および [Theo Browne](https://x.com/theo) に感謝します。_

