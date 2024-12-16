---
title: "React Conf 2024 振り返り"
author: Ricky Hanlon
date: 2024/05/22
description: 先週、ネバダ州ヘンダーソンで 700 人以上の参加者が集まり、最新の UI エンジニアリングについて議論する 2 日間のカンファレンス、React Conf 2024 を開催しました。この投稿では、イベントでの講演と発表をまとめます。
---

May 22, 2024 by [Ricky Hanlon](https://twitter.com/rickhanlonii).

---

<Intro>

先週、ネバダ州ヘンダーソンで 700 人以上の参加者が集まり、最新の UI エンジニアリングについて議論する 2 日間のカンファレンス、React Conf 2024 を開催しました。対面でのカンファレンスは 2019 年以来であり、コミュニティが再び一堂に会することができたことを大変に嬉しく思いました。

</Intro>

---

<<<<<<< HEAD
React Conf 2024 では、[React 19 RC](/blog/2024/04/25/react-19)、[React Native New Architecture Beta](https://github.com/reactwg/react-native-new-architecture/discussions/189)、および [React Compiler](/learn/react-compiler) の実験的リリースを発表しました。コミュニティもステージに立ち、[React Router v7](https://remix.run/blog/merging-remix-and-react-router)、Expo Router の [Universal Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s)、[RedwoodJS](https://redwoodjs.com/blog/rsc-now-in-redwoodjs) での React Server Components など、多くの発表を行いました。
=======
At React Conf 2024, we announced the [React 19 RC](/blog/2024/12/05/react-19), the [React Native New Architecture Beta](https://github.com/reactwg/react-native-new-architecture/discussions/189), and an experimental release of the [React Compiler](/learn/react-compiler). The community also took the stage to announce [React Router v7](https://remix.run/blog/merging-remix-and-react-router), [Universal Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s) in Expo Router, React Server Components in [RedwoodJS](https://redwoodjs.com/blog/rsc-now-in-redwoodjs), and much more.
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04

[1 日目](https://www.youtube.com/watch?v=T8TZQ6k4SLE) と [2 日目](https://www.youtube.com/watch?v=0ckOUBiuxVY)の全ストリームがオンラインで視聴可能です。この投稿では、イベントでの講演と発表をまとめます。

## Day 1 {/*day-1*/}

_[1 日目の全ストリームはこちらから視聴できます。](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=973s)_

1 日目の開始にあたり、Meta の CTO である [Andrew "Boz" Bosworth](https://www.threads.net/@boztank) が歓迎のメッセージを共有し、続いて Meta の React Org を管理する [Seth Webster](https://twitter.com/sethwebster) と MC の [Ashley Narcisse](https://twitter.com/_darkfadr) が紹介されました。

1 日目の基調講演では [Joe Savona](https://twitter.com/en_JS) が、誰でも素晴らしいユーザ体験を構築できるようにするという React の目標とビジョンを共有しました。[Lauren Tan](https://twitter.com/potetotes) は続いて React の現状を共有し、2023 年に React が 10 億回以上ダウンロードされたことや、新しい開発者の 37% が React を使ってプログラミングを学んでいることを紹介しました。最後に、React を React たらしめているコミュニティの努力について強調しました。

さらに、カンファレンス後半におけるコミュニティからの以下の講演もチェックしてください。

- [Vanilla React](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=5542s) by [Ryan Florence](https://twitter.com/ryanflorence)
- [React Rhythm & Blues](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=12728s) by [Lee Robinson](https://twitter.com/leeerob)
- [RedwoodJS, now with React Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=26815s) by [Amy Dutton](https://twitter.com/selfteachme)
- [Introducing Universal React Server Components in Expo Router](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=20765s) by [Evan Bacon](https://twitter.com/Baconbrix)

<<<<<<< HEAD
次の基調講演では、[Josh Story](https://twitter.com/joshcstory) と [Andrew Clark](https://twitter.com/acdlite) が React 19 に登場する新機能を共有し、React 19 RC が本番環境でのテストに準備が整ったことを発表しました。すべての機能については [React 19 リリースポスト](/blog/2024/04/25/react-19)をご覧ください。また、新機能について詳しく知りたい方は以下の講演をご覧ください。
=======
Next in the keynote, [Josh Story](https://twitter.com/joshcstory) and [Andrew Clark](https://twitter.com/acdlite) shared new features coming in React 19, and announced the React 19 RC which is ready for testing in production. Check out all the features in the [React 19 release post](/blog/2024/12/05/react-19), and see these talks for deep dives on the new features:
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04

- [What's new in React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=8880s) by [Lydia Hallie](https://twitter.com/lydiahallie)
- [React Unpacked: A Roadmap to React 19](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=10112s) by [Sam Selikoff](https://twitter.com/samselikoff)
- [React 19 Deep Dive: Coordinating HTML](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24916s) by [Josh Story](https://twitter.com/joshcstory)
- [Enhancing Forms with React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=25280s) by [Aurora Walberg Scharff](https://twitter.com/aurorascharff)
- [React for Two Computers](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=18825s) by [Dan Abramov](https://twitter.com/dan_abramov2)
- [And Now You Understand React Server Components](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=11256s) by [Kent C. Dodds](https://twitter.com/kentcdodds)

基調講演の締めくくりとして、[Joe Savona](https://twitter.com/en_JS)、[Sathya Gunasekaran](https://twitter.com/_gsathya)、[Mofei Zhang](https://twitter.com/zmofei) が、React Compiler が[オープンソース](https://github.com/facebook/react/pull/29061)化されたことを発表し、React Compiler の実験バージョンを共有しました。

コンパイラの使用方法や動作についての詳細は、[ドキュメント](/learn/react-compiler)および以下の講演をご覧ください。

- [Forget About Memo](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=12020s) by [Lauren Tan](https://twitter.com/potetotes)
- [React Compiler Deep Dive](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=9313s) by [Sathya Gunasekaran](https://twitter.com/_gsathya) and [Mofei Zhang](https://twitter.com/zmofei)

1 日目の基調講演全体はこちらから視聴できます。

<YouTubeIframe src="https://www.youtube.com/embed/T8TZQ6k4SLE?t=973s" />

## Day 2 {/*day-2*/}

_[2 日目の全体ストリームはこちらから視聴できます。](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=1720s)_

2 日目の開始にあたり、[Seth Webster](https://twitter.com/sethwebster) が歓迎のメッセージを共有し、続いて [Eli White](https://x.com/Eli_White) からの感謝の言葉と、Chief Vibes Officer の [Ashley Narcisse](https://twitter.com/_darkfadr) による紹介がありました。

2 日目の基調講演では、[Nicola Corti](https://twitter.com/cortinico) が React Native の現状を共有し、2023 年には 7800 万回のダウンロードがあったことを報告しました。また、Meta 内で使用されている 2000 以上の画面、1 日に 20 億回以上訪問されている Facebook Marketplace の商品詳細ページ、Microsoft Windows のスタートメニューの一部、モバイルおよびデスクトップのほぼすべての Microsoft Office 製品での一部機能など、React Native を使用しているアプリを紹介しました。

Nicola はまた、ライブラリ、フレームワーク、プラットフォームといった、React Native をサポートするためにコミュニティが行っているすべての作業について紹介しました。詳細については、コミュニティからの以下の講演をご覧ください。

- [Extending React Native beyond Mobile and Desktop Apps](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=5798s) by [Chris Traganos](https://twitter.com/chris_trag) and [Anisha Malde](https://twitter.com/anisha_malde)
- [Spatial computing with React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=22525s) by [Michał Pierzchała](https://twitter.com/thymikee)

2 日目の基調講演では続けて [Riccardo Cipolleschi](https://twitter.com/cipolleschir) が、React Native の新しいアーキテクチャが現在ベータ版であり、本番環境での採用が可能であることを発表しました。彼は新しいアーキテクチャの新機能と改善点を共有し、React Native の将来のロードマップを発表しました。詳細はこちらをご覧ください。

- [Cross Platform React](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=26569s) by [Olga Zinoveva](https://github.com/SlyCaptainFlint) and [Naman Goel](https://twitter.com/naman34)

次に基調講演で、Nicola は React Native で作成されるすべての新しいアプリに対して、Expo のようなフレームワークから始めることを推奨することを発表しました。この変更に伴い、新しい React Native ホームページと新しい Getting Started ドキュメントも発表されました。新しい Getting Started ガイドは [React Native ドキュメント](https://reactnative.dev/docs/next/environment-setup)でご覧いただけます。

最後に、基調講演の締めくくりとして、[Kadi Kraman](https://twitter.com/kadikraman) が Expo の最新機能と改善点、および Expo を使用して React Native での開発を開始する方法を共有しました。

2 日目の基調講演全体はこちらから視聴できます。

<YouTubeIframe src="https://www.youtube.com/embed/0ckOUBiuxVY?t=1720s" />

## Q&A {/*q-and-a*/}

各日の終わりに React と React Native のチームは Q&A セッションを行いました。

- [React Q&A](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=27518s) hosted by [Michael Chan](https://twitter.com/chantastic)
- [React Native Q&A](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=27935s) hosted by [Jamon Holmgren](https://twitter.com/jamonholmgren)

## さらに… {/*and-more*/}

アクセシビリティ、エラーレポート、CSS などに関する講演もありました。

- [Demystifying accessibility in React apps](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=20655s) by [Kateryna Porshnieva](https://twitter.com/krambertech)
- [Pigment CSS, CSS in the server component age](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=21696s) by [Olivier Tassinari](https://twitter.com/olivtassinari)
- [Real-time React Server Components](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=24070s) by [Sunil Pai](https://twitter.com/threepointone)
- [Let's break React Rules](https://www.youtube.com/watch?v=T8TZQ6k4SLE&t=25862s) by [Charlotte Isambert](https://twitter.com/c_isambert)
- [Solve 100% of your errors](https://www.youtube.com/watch?v=0ckOUBiuxVY&t=19881s) by [Ryan Albrecht](https://github.com/ryan953)

## 謝辞 {/*thank-you*/}

React Conf 2024 を実現していただいたすべてのスタッフ、演者、参加者の皆さまに感謝します。リストに挙げきれないほど多くの方々がいますが、特に感謝したい方々を挙げたいと思います。

イベント全体の計画を手伝ってくれた [Barbara Markiewicz](https://twitter.com/barbara_markie)、[Callstack](https://www.callstack.com/) のメンバ、そして React Team Developer Advocate の [Matt Carroll](https://twitter.com/mattcarrollcode)。そしてイベントの運営を手伝ってくれた [Sunny Leggett](https://zeroslopeevents.com/about) と [Zero Slope](https://zeroslopeevents.com) の皆様に感謝します。

MC および Chief Vibes Officer を務めた [Ashley Narcisse](https://twitter.com/_darkfadr)、そして Q&A セッションのホストを務めた [Michael Chan](https://twitter.com/chantastic) と [Jamon Holmgren](https://twitter.com/jamonholmgren) に感謝します。

毎日私たちを迎え入れ、構成や内容についての助言をいただいた [Seth Webster](https://twitter.com/sethwebster) と [Eli White](https://x.com/Eli_White)。アフターパーティーで特別なメッセージをいただいた [Tom Occhino](https://twitter.com/tomocchino) に感謝します。

トークに対する詳細なフィードバック、スライドデザインの作成、そして細部にわたるサポートをいただいた [Ricky Hanlon](https://www.youtube.com/watch?v=FxTZL2U-uKg&t=1263s) に感謝します。

カンファレンスのウェブサイトを作成してくれた [Callstack](https://www.callstack.com/)、そしてカンファレンスのモバイルアプリを作成してくれた [Kadi Kraman](https://twitter.com/kadikraman) と [Expo](https://expo.dev/) チームに感謝します。

イベントを実現してくださったすべてのスポンサーに感謝します：[Remix](https://remix.run/)、[Amazon](https://developer.amazon.com/apps-and-games?cmp=US_2024_05_3P_React-Conf-2024&ch=prtnr&chlast=prtnr&pub=ref&publast=ref&type=org&typelast=org)、[MUI](https://mui.com/)、[Sentry](https://sentry.io/for/react/?utm_source=sponsored-conf&utm_medium=sponsored-event&utm_campaign=frontend-fy25q2-evergreen&utm_content=logo-reactconf2024-learnmore)、[Abbott](https://www.jobs.abbott/software)、[Expo](https://expo.dev/)、[RedwoodJS](https://redwoodjs.com/)、[Vercel](https://vercel.com)。

ビジュアル、ステージ、サウンドを担当していただいた AV チーム、そして私たちをホストしていただいた Westin Hotel に感謝します。

コミュニティに知識や経験を共有していただいたすべてのスピーカに感謝します。

最後に、対面およびオンラインで参加していただいたすべての方に感謝します。React が今の React でいられるのは皆さんのおかげです。React はライブラリ以上のものであり、コミュニティです。皆さんが一堂に会して共有し学び合う姿は感動的でした。

また次回お会いしましょう！

