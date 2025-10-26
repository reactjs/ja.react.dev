---
title: "React Conf 2025 振り返り"
author: Matt Carroll and Ricky Hanlon
date: 2025/10/16
description: 先週 React Conf 2025 が開催されました。この投稿では、イベントでの講演と発表内容をまとめます。
---

Oct 16, 2025 by [Matt Carroll](https://x.com/mattcarrollcode) and [Ricky Hanlon](https://bsky.app/profile/ricky.fm)

---

<Intro>

先週 React Conf 2025 が開催されました。[React Foundation](/blog/2025/10/07/introducing-the-react-foundation) の発表や、React および React Native に追加される新機能の披露が行われました。

</Intro>

---

React Conf 2025 は、2025 年 10 月 7〜8 日にネバダ州ヘンダーソンで開催されました。

[1 日目](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)と [2 日目](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)の配信全体がオンラインで視聴可能です。イベントの写真は[こちら](https://conf.react.dev/photos)で見ることができます。

このポストでは、イベントでの講演と発表をまとめます。


## 1 日目キーノート {/*day-1-keynote*/}

_1 日目の配信全体は[こちら](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=1067s)から視聴できます。_

1 日目のキーノートでは、Joe Savona が前回の React Conf 以降のチームとコミュニティからのお知らせ、および React 19.0 と 19.1 のハイライトを共有しました。

Mofei Zhang が、React 19.2 の新機能ハイライトを紹介しました。
* [`<Activity />`](https://react.dev/reference/react/Activity) — 可視性を管理する新しいコンポーネント。
* [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent) — エフェクトからイベントを発火させる手法。
* [Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks) — DevTools の新しいプロファイリングツール。
* [Partial Pre-Rendering](https://react.dev/blog/2025/10/01/react-19-2#partial-pre-rendering) — アプリの一部を事前にプリレンダーし、後でレンダーを再開。

Jack Pope が、以下のような Canary の新機能を発表しました。

* [`<ViewTransition />`](https://react.dev/reference/react/ViewTransition) — ページ遷移をアニメートする新しいコンポーネント。
* [Fragment Refs](https://react.dev/reference/react/Fragment#fragmentinstance) — フラグメントを使ってラップされた DOM ノードとやり取りする新しい手法。

Lauren Tan は [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1) を発表し、すべてのアプリが React Compiler を使用して以下のようなメリットを享受することを推奨しました。
* React コードを理解する[自動メモ化](/learn/react-compiler/introduction#what-does-react-compiler-do)。
* React Compiler によって駆動される、ベストプラクティスを教えてくれる[新しい lint ルール](/learn/react-compiler/installation#eslint-integration)。
* Vite、Next.js、Expo における新規アプリ作成時の[デフォルトサポート](/learn/react-compiler/installation#basic-setup)。
* React Compiler に移行する既存アプリ向けの[移行ガイド](/learn/react-compiler/incremental-adoption)。

最後に、Seth Webster が React のオープンソース開発とコミュニティを管理する [React Foundation](/blog/2025/10/07/introducing-the-react-foundation) を発表しました。

1 日目の視聴はこちら：

<YouTubeIframe src="https://www.youtube.com/embed/zyVRg2QR6LA?si=z-8t_xCc12HwGJH_&t=1067s" />

## 2 日目キーノート {/*day-2-keynote*/}

_2 日目の配信全体は[こちら](https://www.youtube.com/watch?v=p9OcztRyDl0&t=2299s)から視聴できます。_

2 日目の発表は Jorge Cohen と Nicola Corti からスタートし、週間ダウンロード数 400 万（前年比プラス 100%）という React Native の驚異的な成長と、Shopify、Zalando、HelloFresh における注目すべきアプリ移行事例、RISE、RUNNA、Partyful などの受賞アプリ、そして Mistral、Replit、v0 の AI アプリを紹介しました。

Riccardo Cipolleschi は React Native より 2 つの主要な新発表を行いました。
- [React Native 0.82 は New Architecture のみをサポート](https://reactnative.dev/blog/2025/10/08/react-native-0.82#new-architecture-only)
- [実験的な Hermes V1 サポート](https://reactnative.dev/blog/2025/10/08/react-native-0.82#experimental-hermes-v1)

キーノートの締めくくりに、Ruben Norte と Alex Hunt が以下の発表を行いました。
- ウェブ版 React との互換性を向上させる[新しいウェブ対応 DOM API](https://reactnative.dev/blog/2025/10/08/react-native-0.82#dom-node-apis)。
- 新しいネットワークパネルとデスクトップアプリを備えた[新しい Performance API](https://reactnative.dev/blog/2025/10/08/react-native-0.82#web-performance-apis-canary)。

2 日目の視聴はこちら：

<YouTubeIframe src="https://www.youtube.com/embed/p9OcztRyDl0?si=qPTHftsUE07cjZpS&t=2299s" />


## React チームの講演 {/*react-team-talks*/}

カンファレンス全体を通じて、React チームからは以下の講演がありました。
* [Async React Part I](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=10907s) と [Part II](https://www.youtube.com/watch?v=p9OcztRyDl0&t=29073s) [(Ricky Hanlon)](https://x.com/rickhanlonii) で、過去 10 年の革新が何を可能にしてきたかをお伝えしました。
* [Exploring React Performance](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=20274s) [(Joe Savona)](https://x.com/en_js) で React のパフォーマンスに関する研究成果をお知らせしました。
* [Reimagining Lists in React Native](https://www.youtube.com/watch?v=p9OcztRyDl0&t=10382s) [(Luna Wei)](https://x.com/lunaleaps) は、モードベースのレンダー (hidden/pre-render/visible) で可視性を管理する、リストのための新しいプリミティブである、Virtual View を紹介しました。
* [Profiling with React Performance tracks](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=8276s) [(Ruslan Lesiutin)](https://x.com/ruslanlesiutin) は、新しい React Performance Tracks を使用してパフォーマンスの問題をデバッグし、優れたアプリを構築する方法をお伝えしました。
* [React Strict DOM](https://www.youtube.com/watch?v=p9OcztRyDl0&t=9026s) [(Nicolas Gallagher)](https://nicolasgallagher.com/) は、ネイティブ環境でウェブコードを使用する際の Meta のアプローチについてお話ししました。
* [View Transitions and Activity](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=4870s) [(Chance Strickland)](https://x.com/chancethedev) — Chance は React チームと協力し、`<Activity />` と `<ViewTransition />` を使い、高速でネイティブアプリのように動作するアニメーションを構築する方法を披露しました。
* [In case you missed the memo](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=9525s) [(Cody Olsen)](https://bsky.app/profile/codey.bsky.social) — Cody は React チームと協力して Sanity Studio でコンパイラを採用し、その経過を報告しました。
## React フレームワーク関連の講演 {/*react-framework-talks*/}

2 日目の後半には、React フレームワーク関連のチームより、さまざまな講演がありました。

* [React Native, Amplified](https://www.youtube.com/watch?v=p9OcztRyDl0&t=5737s) by [Giovanni Laquidara](https://x.com/giolaq) and [Eric Fahsl](https://x.com/efahsl).
* [React Everywhere: Bringing React Into Native Apps](https://www.youtube.com/watch?v=p9OcztRyDl0&t=18213s) by [Mike Grabowski](https://x.com/grabbou).
* [How Parcel Bundles React Server Components](https://www.youtube.com/watch?v=p9OcztRyDl0&t=19538s) by [Devon Govett](https://x.com/devonovett).
* [Designing Page Transitions](https://www.youtube.com/watch?v=p9OcztRyDl0&t=20640s) by [Delba de Oliveira](https://x.com/delba_oliveira).
* [Build Fast, Deploy Faster — Expo in 2025](https://www.youtube.com/watch?v=p9OcztRyDl0&t=21350s) by [Evan Bacon](https://x.com/baconbrix).
* [The React Router's take on RSC](https://www.youtube.com/watch?v=p9OcztRyDl0&t=22367s) by [Kent C. Dodds](https://x.com/kentcdodds).
* [RedwoodSDK: Web Standards Meet Full-Stack React](https://www.youtube.com/watch?v=p9OcztRyDl0&t=24992s) by [Peter Pistorius](https://x.com/appfactory) and [Aurora Scharff](https://x.com/aurorascharff).
* [TanStack Start](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26065s) by [Tanner Linsley](https://x.com/tannerlinsley).

## Q&A {/*q-and-a*/}
カンファレンス中に、3 度の Q&A パネルが行われました。

* [React Team at Meta Q&A](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=26304s)（司会：[Shruti Kapoor](https://x.com/shrutikapoor08)）
* [React Frameworks Q&A](https://www.youtube.com/watch?v=p9OcztRyDl0&t=26812s)（司会：[Jack Herrington](https://x.com/jherr)）
* [React and AI Panel](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=18741s)（司会：[Lee Robinson](https://x.com/leerob)）

## さらに... {/*and-more*/}

コミュニティからも以下のトークがありました。
* [Building an MCP Server](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24204s) by [James Swinton](https://x.com/JamesSwintonDev) ([AG Grid](https://www.ag-grid.com/?utm_source=react-conf&utm_medium=react-conf-homepage&utm_campaign=react-conf-sponsorship-2025))
* [Modern Emails using React](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=25521s) by [Zeno Rocha](https://x.com/zenorocha) ([Resend](https://resend.com/))
* [Why React Native Apps Make All the Money](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=24917s) by [Perttu Lähteenlahti](https://x.com/plahteenlahti) ([RevenueCat](https://www.revenuecat.com/))
* [The invisible craft of great UX](https://www.youtube.com/watch?v=zyVRg2QR6LA&t=23400s) by [Michał Dudak](https://x.com/michaldudak) ([MUI](https://mui.com/))

## 謝辞 {/*thanks*/}

React Conf 2025 を実現していただいたすべてのスタッフ、演者、参加者の皆さまに感謝します。リストに挙げきれないほど多くの方々がいますが、特に感謝したい方々を挙げたいと思います。

イベント全体を計画し、カンファレンスのウェブサイトを構築していただいた [Matt Carroll](https://x.com/mattcarrollcode) に感謝します。

驚異的な献身とエネルギーで React Conf の司会を務め、イベントを通じて思慮深い紹介、楽しいジョーク、そして心からの熱意を提供していただいた [Michael Chan](https://x.com/chantastic) に感謝します。ライブ配信をホストし、各スピーカにインタビューを行い、対面のような React Conf 体験をオンラインにもたらしてくださった [Jorge Cohen](https://x.com/JorgeWritesCode) に感謝します。

React Conf を共同開催し、デザイン、エンジニアリング、マーケティングのサポートを提供していただいた [Mateusz Kornacki](https://x.com/mat_kornacki)、[Mike Grabowski](https://x.com/grabbou)、[Kris Lis](https://www.linkedin.com/in/krzysztoflisakakris/) および [Callstack](https://www.callstack.com/) のチームに感謝します。イベントの運営を手伝ってくださった [ZeroSlope チーム](https://zeroslopeevents.com/contact-us/)：Sunny Leggett、Tracey Harrison、Tara Larish、Whitney Pogue、Brianne Smythia に感謝します。

Discord からの質問をライブ配信で紹介していただいた [Jorge Cabiedes Acosta](https://github.com/jorge-cab)、[Gijs Weterings](https://x.com/gweterings)、[Tim Yung](https://x.com/yungsters)、[Jason Bonta](https://x.com/someextent) に感謝します。Discord のモデレーションをリードしていただいた [Lynn Yu](https://github.com/lynnshaoyu) に感謝します。毎日私たちを迎え入れていただいた [Seth Webster](https://x.com/sethwebster) に感謝します。そして、アフターパーティーに参加して特別なメッセージをくださった [Christopher Chedeau](https://x.com/vjeux)、[Kevin Gozali](https://x.com/fkgozali)、[Pieter De Baets](https://x.com/Javache) に感謝します。

カンファレンスのモバイルアプリを構築してくださった [Kadi Kraman](https://x.com/kadikraman)、[Beto](https://x.com/betomoedano)、[Nicolas Solerieu](https://www.linkedin.com/in/nicolas-solerieu/) に感謝します。カンファレンスのウェブサイトの手伝いをしていただいた [Wojtek Szafraniec](https://x.com/wojteg1337) に感謝します。ビジュアル、ステージ、音響を提供していただいた [Mustache](https://www.mustachepower.com/) と [Cornerstone](https://cornerstoneav.com/) に感謝します。そして私たちをホストしていただいた Westin Hotel に感謝します。

イベントを可能にしていただいたすべてのスポンサー：[Amazon](https://www.developer.amazon.com)、[MUI](https://mui.com/)、[Vercel](https://vercel.com/)、[Expo](https://expo.dev/)、[RedwoodSDK](https://rwsdk.com)、[Ag Grid](https://www.ag-grid.com)、[RevenueCat](https://www.revenuecat.com/)、[Resend](https://resend.com)、[Mux](https://www.mux.com/)、[Old Mission](https://www.oldmissioncapital.com/)、[Arcjet](https://arcjet.com)、[Infinite Red](https://infinite.red/)、[RenderATL](https://renderatl.com) に感謝します。

コミュニティに知識と経験を共有していただいた、すべてのスピーカに感謝します。

最後に、対面およびオンラインで参加していただいたすべての方に感謝します。React が今の React でいられるのは皆さんのおかげです。React はライブラリ以上のものであり、コミュニティです。皆さんが一堂に会して共有し学び合う姿は感動的でした。

また次回お会いしましょう！
