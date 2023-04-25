---
title: React プロジェクトを始める
---

<Intro>

React だけで新しいアプリやウェブサイトを作りたい場合は、コミュニティで人気のある React フレームワークから、ひとつ選ぶことをおすすめします。フレームワークは、ルーティング、データ取得、HTML 生成といった、ほとんどのアプリやサイトで遅かれ早かれ必要になる機能を提供します。

</Intro>

<Note>

**ローカルで開発するには [Node.js](https://nodejs.org/en/) をインストールする必要があります。** 本番環境でも Node.js を使うことができますが、これは必須ではありません。多くの React フレームワークは、静的な HTML/CSS/JS フォルダにエクスポートする機能をサポートしています。

</Note>

## 本番環境対応の React フレームワーク {/*production-grade-react-frameworks*/}

### Next.js {/*nextjs*/}

**[Next.js](https://nextjs.org/) はフルスタックの React フレームワークです。** ほぼ静的なブログサイトから複雑でダイナミックなアプリまで、どんな規模の React アプリでも作成できる万能フレームワークです。Next.js プロジェクトを新規に作るには、ターミナルで次のコマンドを実行してください。

<TerminalBlock>
npx create-next-app
</TerminalBlock>

Next.js を初めて使う場合は、[Next.js チュートリアル](https://nextjs.org/learn/foundations/about-nextjs)を参照してください。

Next.js は [Vercel](https://vercel.com/) によってメンテナンスされています。Next.js アプリは Node.js やサーバーレスホスティングサービス、または自分自身のサーバーに[デプロイする](https://nextjs.org/docs/deployment)ことができます。[完全に静的な Next.js アプリ](https://nextjs.org/docs/advanced-features/static-html-export)は、どんな静的なホスティングサービスにもデプロイ可能です。

### Remix {/*remix*/}

**[Remix](https://remix.run/) は、ネスト状のルーティングを備えたフルスタック React フレームワークです。** 複雑なアプリを階層的に分割し、並列に読み込み、ユーザーアクションに応じてリフレッシュすることができます。Remix プロジェクトを新規に作成するには、次のコマンドを実行します。

<TerminalBlock>
npx create-remix
</TerminalBlock>

Remix を初めて使う場合は、Remix の[ブログ作成チュートリアル](https://remix.run/docs/en/main/tutorials/blog)（短い）や [アプリ作成チュートリアル](https://remix.run/docs/en/main/tutorials/jokes)（長い）を参照してください。

Remix は [Shopify](https://www.shopify.com/) によってメンテナンスされています。Remix アプリをデプロイするには、デプロイ先を[選択する必要があります](https://remix.run/docs/en/main/guides/deployment)。Remix アプリは、[アダプタ](https://remix.run/docs/en/main/other-api/adapter)を使用するか自分で書くことで、あらゆる Node.js またはサーバーレスホスティングにデプロイできます。

### Gatsby {/*gatsby*/}

**[Gatsby](https://www.gatsbyjs.com/) は、CMS ベースで高速なサイトを作成するための React フレームワークです。** 豊富なプラグインのエコシステムと GraphQL データレイヤーにより、コンテンツ、API、サービスの統合が簡素化されます。Gatsby プロジェクトを新規に作成するには、次のコマンドを実行します。

<TerminalBlock>
npx create-gatsby
</TerminalBlock>

Gatsbyを初めて使う場合は、[Gatsby チュートリアル](https://www.gatsbyjs.com/docs/tutorial/)を参照してください。

Gatsby は [Netlify](https://www.netlify.com/) によってメンテナンスされています。[完全に静的な Gatsby サイト](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting) は、どんな静的なホスティングにもデプロイ可能です。サーバーサイド専用の機能を使用する場合は、ホスティングプロバイダが Gatsby に対応しているかどうか確認してください。

### Expo（ネイティブアプリ向け） {/*expo*/}

**[Expo](https://expo.dev/) は、Android、iOS、およびウェブ向けに、真にネイティブな UI を持ったユニバーサルアプリを作成できる React フレームワークです。** [React Native](https://reactnative.dev/) 用の SDK を提供し、ネイティブなパーツの使用を簡素化します。Expo プロジェクトを新規に作成するには、次のコマンドを実行します。

<TerminalBlock>
npx create-expo-app
</TerminalBlock>

Expo を初めて使う場合は、[Expo チュートリアル](https://docs.expo.dev/tutorial/introduction/)を参照してください。

Expo は [Expo（社名）](https://expo.dev/about) によってメンテナンスされています。Expo を使用してアプリをビルドすることは無料であり、Google や Apple のアプリストアに制限なくアップロードすることができます。また Expo では有料のクラウドサービスも提供しています。

<DeepDive>

#### フレームワークなしで React を使うことはできますか？ {/*can-i-use-react-without-a-framework*/}

確かに、React をフレームワークなしで使うことは可能です。[既存のページに React を追加する](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page)場合はそのようにします。**しかし、新しいアプリやサイトをフルで React を使って構築する場合は、フレームワークを使用することをお勧めします。**

理由は次のとおりです。

もし最初にルーティングやデータ取得が必要ない場合でも、後になってそれらのためにライブラリを追加する必要が出てくる可能性が高いでしょう。新しい機能が増えるたびに JavaScript バンドルは大きくなっていき、個々のルートごとにコードを分割する方法を考える必要があります。データ取得のニーズが複雑になるにつれて、サーバー・クライアント間のネットワークウォーターフォールが原因となり、アプリは非常に遅く感じるようになるでしょう。低速なネットワーク環境やロースペックなデバイスのユーザーが増えると、コンテンツをできるだけ早く表示するため、サーバ上であるいはビルド時に、コンポーネントから HTML を生成する必要が生じることがあるでしょう。後になってセットアップを変更し、サーバ上であるいはビルド時にあなたのコードの一部が実行されるようにすることは、非常に複雑な作業です。

**これらの問題は React に固有のものではありません。まさにこれが、Svelte には SvelteKit、Vue には Nuxt といったフレームワークが存在する理由です。** これらの問題を自力で解決するには、ルータやデータ取得ライブラリをバンドラに結合する作業を自分で行う必要があります。最初のセットアップをひとまず動作させることは難しくありませんが、時間が経ってアプリが成長してもなお素早く読み込めるサイトを作るためには、数々の細々とした問題に対処する必要が出てきます。アプリに必要な最小限のコードを 1 回のクライアント・サーバ間の往復で送信しつつ、並行してページ表示に必要なデータも送信したい、と思い始めるでしょう。ページが段階的に読み込まれ、JavaScript コードが実行すらされないうちから操作可能であってほしくなるでしょう。どこにでもホストでき JavaScript が無効になっていても動作する、マーケティングページのための完全に静的な HTML ファイルが入ったフォルダを生成したい、と考え始めるでしょう。これらの機能を自分で構築するには、大変な労力が必要です。

**このページで紹介する React フレームワークは、これらの問題をデフォルトで解決しているため、あなたが余計な作業をする必要はありません。** これらのフレームワークを使用することで、非常にスリムに始めて、ニーズに応じてアプリをスケーリングできます。各 React フレームワークにはコミュニティがあるため、質問に対する回答を見つけたり、ツールのアップグレードをしたりすることもより簡単に行えます。フレームワークはあなたのコードに構造を与えるので、あなたや他の人が異なるプロジェクト間でコンテキストとスキルを保持するのにも役立ちます。逆に、カスタムセットアップを行った場合、サポートされなくなった依存関係バージョンにハマる可能性が高まり、いずれ実質的には独自フレームワークのようなものを作成する羽目に陥ります。ただしそのようなフレームワークにはコミュニティもアップグレードパスもなく、仮に過去に作成されていたものに近かったとしても、行き当たりばったりで設計されたものに過ぎないわけですが。

これでも納得できないという場合、またはフレームワークでは対処しきれない特殊な制約があって自分独自のセットアップを行いたい、という場合は、止めはしませんのでどうぞそうしてください！ npm から `react` と `react-dom` を入手し、[Vite](https://vitejs.dev/) や [Parcel](https://parceljs.org/) のようなバンドラを使ってカスタムビルドプロセスをセットアップし、ルーティング、静的ファイル生成、サーバーサイドレンダリングなどのための各種ツールを必要に応じて追加していってください。
</DeepDive>

## 超最先端の React フレームワーク {/*bleeding-edge-react-frameworks*/}

我々が React の進化について探求する中で、React をフレームワークと（特にルーティング、バンドル作成、サーバテクノロジーと）より密接に統合することが、React ユーザーがよりよいアプリを構築する手助けをするための最大の機会となるということに気づきました。Next.js チームは、[React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) のようなフレームワークに依存しない最先端の React 機能に関して、私たちと共同で研究、開発、統合、テストを行うことに同意しました。

これらの機能は、本番環境で使える段階へと日々近づいており、他のバンドラやフレームワーク開発者とも統合について話し合っています。私たちの希望は、このページにリストされているすべてのフレームワークが、1 年か 2 年のうちにこれらの機能を完全にサポートするようになることです。（あなたがフレームワーク作者で、これらの機能を実験するため我々と協力することに興味がある場合、ぜひご連絡ください！）

### Next.js (App Router) {/*nextjs-app-router*/}

**[Next.js の App Router](https://beta.nextjs.org/docs/getting-started) は、React チームのフルスタックアーキテクチャのビジョンを実現できるようデザインされた Next.js API の再設計です。** サーバー上またはビルド時に実行される非同期コンポーネントでデータを取得できるようになります。

Next.js は [Vercel](https://vercel.com/) によってメンテナンスされています。[Next.js アプリのデプロイ](https://nextjs.org/docs/deployment)はあらゆる Next.js やサーバレスホスティングサービス上で行えます。Next.jsは、サーバ不要の[静的エクスポート](https://beta.nextjs.org/docs/configuring/static-export)もサポートしています。
<Pitfall>

現時点（2023 年 3 月時点）では、Next.js の App Router はベータ版であり、本番環境での使用はまだ推奨されていません。既存の Next.js プロジェクトで実験する場合は、[こちらの段階的な移行ガイド](https://beta.nextjs.org/docs/upgrade-guide#migrating-from-pages-to-app)を参照してください。

</Pitfall>

<DeepDive>

#### React チームのフルスタックアーキテクチャビジョンに含まれる機能 {/*which-features-make-up-the-react-teams-full-stack-architecture-vision*/}

Next.js の App Router バンドラは、公式の [React Server Components 仕様](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)を完全に実装しています。これにより単一の React ツリー内で、バンドル時専用コンポーネント、サーバ専用コンポーネント、インタラクティブなコンポーネントを混在させることができます。

例えば、データベースやファイルから読み込みを行う React コンポーネントを非同期 (`async`) 関数として記述できます。そしてそのデータをインタラクティブなコンポーネントに渡すこともできます：

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

Next.js の App Router は、[Suspense を使用したデータのフェッチ](/blog/2022/03/29/react-v18#suspense-in-data-frameworks)を統合しています。これにより、React ツリー内で直接、UI の様々な場所に表示されるロード中状態（スケルトンプレースホルダなど）を指定できるようになります：

```js
<Suspense fallback={<TalksLoading />}>
  <Talks confId={conf.id} />
</Suspense>
```

Server Components と Suspense は、Next.js の機能ではなく React の機能です。しかしフレームワークレベルでこれらを採用するには、合意形成とかなりの実装の手間が必要です。現時点では、Next.js の App Router が最も完全な実装です。React チームはバンドラの開発者と協力して、次世代のフレームワークでこれらの機能を実装しやすくすることを目指しています。

</DeepDive>
