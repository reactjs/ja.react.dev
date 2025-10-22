---
title: React 関連動画
---

<Intro>

React および React のエコシステムについて説明している動画を紹介します。

</Intro>

## React Conf 2024 {/*react-conf-2024*/}

At React Conf 2024, Meta CTO [Andrew "Boz" Bosworth](https://www.threads.net/@boztank) shared a welcome message to kick off the conference:

<YouTubeIframe src="https://www.youtube.com/embed/T8TZQ6k4SLE?t=975s" title="Boz and Seth Intro" />

### React 19 Keynote {/*react-19-keynote*/}

In the Day 1 keynote, we shared vision for React starting with React 19 and the React Compiler. Watch the full keynote from [Joe Savona](https://twitter.com/en_JS), [Lauren Tan](https://twitter.com/potetotes), [Andrew Clark](https://twitter.com/acdlite), [Josh Story](https://twitter.com/joshcstory), [Sathya Gunasekaran](https://twitter.com/_gsathya), and [Mofei Zhang](https://twitter.com/zmofei):


<YouTubeIframe src="https://www.youtube.com/embed/lyEKhv8-3n0" title="YouTube video player" />

### React Unpacked: A Roadmap to React 19 {/*react-unpacked-a-roadmap-to-react-19*/}

React 19 introduced new features including Actions, `use()`, `useOptimistic` and more. For a deep dive on using new features in React 19, see [Sam Selikoff's](https://twitter.com/samselikoff) talk:

<YouTubeIframe src="https://www.youtube.com/embed/R0B2HsSM78s" title="React Unpacked: A Roadmap to React 19" />

### What's New in React 19 {/*whats-new-in-react-19*/}

[Lydia Hallie](https://twitter.com/lydiahallie) gave a visual deep dive of React 19's new features:

<YouTubeIframe src="https://www.youtube.com/embed/AJOGzVygGcY" title="What's New in React 19" />

### React 19 Deep Dive: Coordinating HTML {/*react-19-deep-dive-coordinating-html*/}

[Josh Story](https://twitter.com/joshcstory) provided a deep dive on the document and resource streaming APIs in React 19:

<YouTubeIframe src="https://www.youtube.com/embed/IBBN-s77YSI" title="React 19 Deep Dive: Coordinating HTML" />

### React for Two Computers {/*react-for-two-computers*/}

[Dan Abramov](https://bsky.app/profile/danabra.mov) imagined an alternate history where React started server-first:

<YouTubeIframe src="https://www.youtube.com/embed/ozI4V_29fj4" title="React for Two Computers" />

### Forget About Memo {/*forget-about-memo*/}

[Lauren Tan](https://twitter.com/potetotes) gave a talk on using the React Compiler in practice:

<YouTubeIframe src="https://www.youtube.com/embed/lvhPq5chokM" title="Forget About Memo" />

### React Compiler Deep Dive {/*react-compiler-deep-dive*/}

[Sathya Gunasekaran](https://twitter.com/_gsathya) and [Mofei Zhang](https://twitter.com/zmofei) provided a deep dive on how the React Compiler works:

<YouTubeIframe src="https://www.youtube.com/embed/uA_PVyZP7AI" title="React Compiler Deep Dive" />

### And more... {/*and-more-2024*/}

**We also heard talks from the community on Server Components:**
* [Enhancing Forms with React Server Components](https://www.youtube.com/embed/0ckOUBiuxVY&t=25280s) by [Aurora Walberg Scharff](https://twitter.com/aurorascharff)
* [And Now You Understand React Server Components](https://www.youtube.com/embed/pOo7x8OiAec) by [Kent C. Dodds](https://twitter.com/kentcdodds)
* [Real-time Server Components](https://www.youtube.com/embed/6sMANTHWtLM) by [Sunil Pai](https://twitter.com/threepointone)

**Talks from React frameworks using new features:**

* [Vanilla React](https://www.youtube.com/embed/ZcwA0xt8FlQ) by [Ryan Florence](https://twitter.com/ryanflorence)
* [React Rhythm & Blues](https://www.youtube.com/embed/rs9X5MjvC4s) by [Lee Robinson](https://twitter.com/leeerob)
* [RedwoodJS, now with React Server Components](https://www.youtube.com/embed/sjyY4MTECUU) by [Amy Dutton](https://twitter.com/selfteachme)
* [Introducing Universal React Server Components in Expo Router](https://www.youtube.com/embed/djhEgxQf3Kw) by [Evan Bacon](https://twitter.com/Baconbrix)

**And Q&As with the React and React Native teams:**
- [React Q&A](https://www.youtube.com/embed/T8TZQ6k4SLE&t=27518s) hosted by [Michael Chan](https://twitter.com/chantastic)
- [React Native Q&A](https://www.youtube.com/embed/0ckOUBiuxVY&t=27935s) hosted by [Jamon Holmgren](https://twitter.com/jamonholmgren)

You can watch all of the talks at React Conf 2024 at [conf2024.react.dev](https://conf2024.react.dev/talks).

## React Conf 2021 {/*react-conf-2021*/}

### React 18 キーノート {/*react-18-keynote*/}

キーノートでは、React 18 から始まる React の将来のビジョンについて共有しました。

[Andrew Clark](https://twitter.com/acdlite)、[Juan Tejada](https://twitter.com/_jstejada)、[Lauren Tan](https://twitter.com/potetotes)、[Rick Hanlon](https://twitter.com/rickhanlonii) による完全なキーノートは以下で視聴できます。

<YouTubeIframe src="https://www.youtube.com/embed/FZ0cG47msEk" title="React 18 Keynote" />

### アプリ開発者にとっての React 18 {/*react-18-for-application-developers*/}

React 18 へのアップグレードのデモについて、[Shruti Kapoor](https://twitter.com/shrutikapoor08) のトークを以下でご覧ください。

<YouTubeIframe src="https://www.youtube.com/embed/ytudH8je5ko" title="React 18 for Application Developers" />

### サスペンスを使ったストリーミングサーバレンダリング {/*streaming-server-rendering-with-suspense*/}

React 18 では、サスペンスを使用することでサーバサイドレンダリングのパフォーマンスも改善されています。

ストリーミングサーバレンダリングによって、サーバ側で React コンポーネントから HTML を作成し、それをユーザにストリームで送ることができます。React 18 では、`Suspense` を使ってアプリを小さな単位に分割し、それぞれがアプリの他の部分をブロックせずに独立してストリーミング処理できるようになります。これによりユーザはより早くコンテンツを見ることができ、素早くインタラクションができるようになる、ということです。

詳しくは、[Shaundai Person](https://twitter.com/shaundai) による以下の発表をご覧ください：

<YouTubeIframe src="https://www.youtube.com/embed/pj5N-Khihgc" title="Streaming Server Rendering with Suspense" />

### React ワーキンググループの立ち上げ {/*the-first-react-working-group*/}

React 18 では、エキスパートや開発者、ライブラリメンテナ、教育者のグループと協力して作業するため、初めてワーキンググループを立ち上げました。彼らとともに、段階的な採用戦略を作成し、`useId`、`useSyncExternalStore`, `useInsertionEffect` といった API の改善を行ってきました。

この試みの概要については、[Aakansha' Doshi](https://twitter.com/aakansha1216) による発表をご覧ください。

<YouTubeIframe src="https://www.youtube.com/embed/qn7gRClrC9U" title="The first React working group" />

### React 開発者向けツール {/*react-developer-tooling*/}

このリリースにおける新機能をサポートするため、新たに構成された React DevTools チームと、開発者が React アプリをデバッグしやすくするための新たなタイムラインプロファイラについて発表しました。

新たな DevTools の機能についての詳細およびデモについては、[Brian Vaughn](https://twitter.com/brian_d_vaughn) による発表をご覧ください。

<YouTubeIframe src="https://www.youtube.com/embed/oxDfrke8rZg" title="React Developer Tooling" />

### メモ化不要の React {/*react-without-memo*/}

より将来に目を向けた話として、[Xuan Huang (黄玄)](https://twitter.com/Huxpro) は、React Labs が行っている自動メモ化コンパイラに関する研究の現状についてお話ししました。この発表とコンパイラのプロトタイプについての詳細・デモは以下でご覧ください。

<YouTubeIframe src="https://www.youtube.com/embed/lGEMwh32soc" title="React without memo" />

### React ドキュメントキーノート {/*react-docs-keynote*/}

React の学習や React による設計についての一連の発表は [Rachel Nabors](https://twitter.com/rachelnabors) からスタートしました。その中では React の新ドキュメントに対する我々の注力についてのキーノートがありました（[react.dev としてリリース済み](/blog/2023/03/16/introducing-react-dev)）：

<YouTubeIframe src="https://www.youtube.com/embed/mneDaMYOKP8" title="React docs keynote" />

### さらに… {/*and-more*/}

**React の学習や React における設計についての以下のような発表がありました：**

* Debbie O'Brien: [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [Learning in the Browser](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34).

**Relay、React Native、PyTorch チームからの発表：**

* Robert Balicki: [Re-introducing Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell and Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)

**アクセシビリティ、ツーリング、サーバコンポーネントについてコミュニティからの発表：**

* Daishi Kato: [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [UI tools for artists](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

## 過去の動画 {/*older-videos*/}

### React Conf 2019 {/*react-conf-2019*/}

React Conf 2019 の動画プレイリストです。
<YouTubeIframe title="React Conf 2019" src="https://www.youtube-nocookie.com/embed/playlist?list=PLPxbbTqCLbGHPxZpw4xj_Wwg8-fdNxJRh" />

### React Conf 2018 {/*react-conf-2018*/}

React Conf 2018 の動画プレイリストです。
<YouTubeIframe title="React Conf 2018" src="https://www.youtube-nocookie.com/embed/playlist?list=PLPxbbTqCLbGE5AihOSExAa4wUM-P42EIJ" />

### React.js Conf 2017 {/*reactjs-conf-2017*/}

React.js Conf 2017 の動画プレイリストです。
<YouTubeIframe title="React.js Conf 2017" src="https://www.youtube-nocookie.com/embed/playlist?list=PLb0IAmt7-GS3fZ46IGFirdqKTIxlws7e0" />

### React.js Conf 2016 {/*reactjs-conf-2016*/}

React.js Conf 2016 の動画プレイリストです。
<YouTubeIframe title="React.js Conf 2016" src="https://www.youtube-nocookie.com/embed/playlist?list=PLb0IAmt7-GS0M8Q95RIc2lOM6nc77q1IY" />

### React.js Conf 2015 {/*reactjs-conf-2015*/}

React.js Conf 2015 の動画プレイリストです。
<YouTubeIframe title="React.js Conf 2015" src="https://www.youtube-nocookie.com/embed/playlist?list=PLb0IAmt7-GS1cbw4qonlQztYV1TAW0sCr" />

### ベストプラクティスの再考 {/*rethinking-best-practices*/}

Pete Hunt の JSConf EU 2013 でのトークは「テンプレートの概念を捨てて JavaScript でビューを構築する」「データが変更されたときにアプリケーション全体を "再レンダー" する」「DOM とイベントの軽量な実装」という 3 つのトピックをカバーしています（2013 年 - 30 分）。
<YouTubeIframe title="Pete Hunt: React: Rethinking Best Practices - JSConf EU 2013" src="https://www.youtube-nocookie.com/embed/x7cQ3mrcKaY" />

### React の初紹介 {/*introduction-to-react*/}

Tom Occhino と Jordan Walke が Facebook Seattle で React を紹介したときの動画です（2013 年 - 1 時間 20 分）。
<YouTubeIframe title="Tom Occhino and Jordan Walke introduce React at Facebook Seattle" src="https://www.youtube-nocookie.com/embed/XxVg_s8xAms" />
