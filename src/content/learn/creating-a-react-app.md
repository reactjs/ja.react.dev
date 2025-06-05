---
title: React アプリの作成
---

<Intro>

React を使って新しいアプリやウェブサイトを作成したい場合は、フレームワークを使って始めることをおすすめします。

</Intro>

あなたのアプリが既存のフレームワークではうまく対応できない制約を有している場合や、自分自身でフレームワークを構築したい場合、または React アプリの基本を学びたい場合は、[React アプリをゼロから構築する](/learn/build-a-react-app-from-scratch)ことも可能です。

## フルスタックフレームワーク {/*full-stack-frameworks*/}

これらの推奨フレームワークは、アプリを本番環境でデプロイしスケールするために必要な、すべての機能をサポートしています。最新の React 機能を統合し、React のアーキテクチャを活用しています。

<Note>

#### フルスタックフレームワークは必ずしもサーバを必要としない {/*react-frameworks-do-not-require-a-server*/}

このページのすべてのフレームワークは、クライアントサイドレンダリング (client-side rendering; [CSR](https://developer.mozilla.org/en-US/docs/Glossary/CSR))、シングルページアプリケーション (single-page app; [SPA](https://developer.mozilla.org/en-US/docs/Glossary/SPA)) および静的サイト生成 (static-site generation; [SSG](https://developer.mozilla.org/en-US/docs/Glossary/SSG)) をサポートしています。これらのアプリは、サーバ機能なしで [CDN](https://developer.mozilla.org/en-US/docs/Glossary/CDN) や静的ホスティングサービスにデプロイできます。さらに、これらのフレームワークは、ユースケースに応じてサーバサイドレンダリングをルートごとに追加することを可能にします。

これにより、クライアントのみのアプリから始めておき、後で要件が変化した場合に、アプリを書き直すことなく個々のルートでサーバ機能を使用することを選択できます。レンダー戦略の設定については、フレームワークのドキュメントを参照してください。

</Note>

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js の App Router](https://nextjs.org/docs) は、React のアーキテクチャを最大限に活用してフルスタック React アプリを実現する React フレームワークです**。

<TerminalBlock>
npx create-next-app@latest
</TerminalBlock>

Next.js は [Vercel](https://vercel.com/) によってメンテナンスされています。Next.js アプリは Node.js や Docker コンテナをサポートする任意のホスティングプロバイダ、もしくは自前のサーバ上に[デプロイできます](https://nextjs.org/docs/app/building-your-application/deploying)。さらに Next.js は、サーバ不要の[静的エクスポート](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)もサポートしています。

### React Router (v7) {/*react-router-v7*/}

**[React Router](https://reactrouter.com/start/framework/installation) は、React 用の最も人気のあるルーティングライブラリであり、Vite と組み合わせてフルスタック React フレームワークを作成できます**。標準の Web API を重視しており、さまざまな JavaScript ランタイムやプラットフォーム向けに[そのままデプロイできるテンプレート](https://github.com/remix-run/react-router-templates)をいくつか提供しています。

新しい React Router フレームワークプロジェクトを作成するには、以下のコマンドを実行します。

<TerminalBlock>
npx create-react-router@latest
</TerminalBlock>

React Router は [Shopify](https://www.shopify.com) によってメンテナンスされています。

### Expo (ネイティブアプリ用) {/*expo*/}

**[Expo](https://expo.dev/) は、真にネイティブな UI を持つユニバーサルな Android、iOS、および Web アプリを作成できる React フレームワークです**。[React Native](https://reactnative.dev/) 用の SDK を提供することでネイティブ部分を使いやすくしています。新しい Expo プロジェクトを作成するには、以下のコマンドを実行します。

<TerminalBlock>
npx create-expo-app@latest
</TerminalBlock>

Expo を初めて使用する場合は、[Expo チュートリアル](https://docs.expo.dev/tutorial/introduction/)をチェックしてください。

Expo は [Expo（社名）](https://expo.dev/about) によってメンテナンスされています。Expo を使ったアプリ構築は無料であり、Google や Apple のアプリストアにも制限なく申請できます。また Expo ではオプトインの有料クラウドサービスも提供しています。


## その他のフレームワーク {/*other-frameworks*/}

私たちのフルスタック React ビジョンに向けて取り組んでいる他の新進のフレームワークも存在します。

- [TanStack Start (Beta)](https://tanstack.com/): TanStack Start は、TanStack Router を活用したフルスタック React フレームワークです。Nitro や Vite などのツールを使用して、フルドキュメント SSR、ストリーミング、サーバ関数、バンドル機能などを提供します。
- [RedwoodJS](https://redwoodjs.com/): Redwood は、多くのプリインストールされたパッケージと設定を備えたフルスタック React フレームワークで、フルスタックウェブアプリケーションを簡単に構築できます。

<DeepDive>

#### React チームのフルスタックアーキテクチャビジョンに含まれる機能 {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js の App Router バンドラは、公式の [React Server Components 仕様](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)を完全に実装しています。これにより単一の React ツリー内で、バンドル時専用コンポーネント、サーバ専用コンポーネント、インタラクティブなコンポーネントを混在させることができます。

例えば、データベースやファイルから読み込みを行う React コンポーネントを非同期 (`async`) 関数として記述できます。そしてそのデータをインタラクティブなコンポーネントに渡すこともできます。

```js
// This component runs *only* on the server (or during the build).
async function Talks({ confId }) {
  // 1. You're on the server, so you can talk to your data layer. API endpoint not required.
  const talks = await db.Talks.findAll({ confId });

  // 2. Add any amount of rendering logic. It won't make your JavaScript bundle larger.
  const videos = talks.map(talk => talk.video);

  // 3. Pass the data down to the components that will run in the browser.
  return <SearchableVideoList videos={videos} />;
}
```

Next.js の App Router は、[サスペンス (Suspense) を使用したデータフェッチ](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)を統合しています。これにより、React ツリー内で直接、UI の様々な場所に表示されるロード中状態（スケルトンプレースホルダなど）を指定できるようになります。

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

サーバコンポーネントとサスペンスは、Next.js の機能ではなく React の機能です。しかしフレームワークレベルでこれらを採用するには、合意形成とかなりの実装の手間が必要です。現時点では、Next.js の App Router が最も完全な実装です。React チームはバンドラの開発者と協力して、次世代のフレームワークでこれらの機能を実装しやすくすることを目指しています。

</DeepDive>

## ゼロから構築を始める {/*start-from-scratch*/}

あなたのアプリが既存のフレームワークではうまく対応できない制約を有している場合や、自分自身でフレームワークを構築したい場合、または React アプリの基本を学びたい場合には、ゼロから React プロジェクトを始めるための他の選択肢があります。

ゼロから始めることでより柔軟性が得られますが、ルーティング、データフェッチ、その他の一般的な使用パターンにどのツールを使用するかを選択する必要があります。これは、既存のフレームワークを使用する代わりに自分自身でフレームワークを構築するようなものです。[おすすめのフルスタックフレームワーク](#full-stack-frameworks)には、これらの問題に対する組み込みの解決策があります。

独自のソリューションを構築したい場合は、[ゼロからの React アプリ構築](/learn/build-a-react-app-from-scratch)ガイドを参照し、[Vite](https://vite.dev/)、[Parcel](https://parceljs.org/)、または [RSbuild](https://rsbuild.dev/) のようなビルドツールを使って新しい React プロジェクトをセットアップする方法を確認してください。

-----

_このページに掲載されることに興味のあるフレームワークの作者の方は、[こちらからお知らせください](https://github.com/reactjs/react.dev/issues/new?assignees=&labels=type%3A+framework&projects=&template=3-framework.yml&title=%5BFramework%5D%3A+)_。
