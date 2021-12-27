---
title: "Rect Conf 2021 振り返り"
author: [jtannady, rickhanlonii]
---

先週、第 6 回の React Conf を開催しました。これまでの年度において、我々は React Conf のステージ上で、[_React Native_](https://engineering.fb.com/2015/03/26/android/react-native-bringing-modern-web-techniques-to-mobile/) や [_React Hooks_](https://reactjs.org/docs/hooks-intro.html) といった業界を変えるような発表をお届けしてきました。本年度は、React 18 のリリースと並行レンダリング機能の段階的な採用から始まる我々のマルチプラットフォーム戦略についての話題を共有しました。

React Conf がオンラインで開催されたのは今回が初めてですが、イベントは 8 つの言語に翻訳され、無料でストリーミング配信されました。世界中の参加者が、カンファランス Discord や、すべてのタイムゾーンの方がアクセスしやすいように行われたリプレイイベントに参加しました。登録者数は 50,000 人以上に達し、19 の演題は 60,000 回以上閲覧され、両イベントを通じて Discord には 5,000 人の参加者が集まりました。

すべての発表は[オンラインストリーミングで閲覧可能です](https://www.youtube.com/watch?v=FZ0cG47msEk&list=PLNG_1j3cPCaZZ7etkzWA7JfdmKWT0pMsa)。

以下が、ステージ上で共有された内容のおさらいとなります。

## React 18 と並行レンダリング機能 {#react-18-and-concurrent-features}

キーノートでは、React 18 から始まる React の将来のビジョンについて共有しました。

React 18 には、長らく待望されてきた並行レンダラと、サスペンスへの機能追加が、大きな破壊的変更なしに入ります。アプリは、他のメジャーリリースのときと変わらない程度の労力で React 18 にアップグレードして、並行レンダリングの機能を段階的に採用していくことが可能です。

**これはつまり、並行モードというものがなくなった、ということです。並列レンダリング機能のみが存在します。**

キーノートではさらに、サスペンス、サーバコンポーネント、新たな React ワーキンググループ、そして React Native の長期的な多プラットフォーム戦略についてお話ししました。

[Andrew Clark](https://twitter.com/acdlite)、[Juan Tejada](https://twitter.com/_jstejada)、[Lauren Tan](https://twitter.com/sugarpirate_)、[Rick Hanlon](https://twitter.com/rickhanlonii) によるキーノートの全編は以下でご覧ください：

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/FZ0cG47msEk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## アプリ開発者にとっての React 18 {#react-18-for-application-developers}

キーノートでは、React 18 RC が評価のために今すぐ利用可能であることを発表しました。さらなるフィードバックを待ちつつも、これが来年初頭に我々が安定版として公開する予定の React のバージョンそのものとなります。

React 18 RC を試すには、dependencies をアップグレードしてください：

```bash
npm install react@rc react-dom@rc
```

そして新しい `createRoot` API を使うように切り替えます：

```js
// before
const container = document.getElementById('root');
ReactDOM.render(<App />, container);

// after
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App/>);
```

React 18 へのアップグレードのデモについては、[Shruti Kapoor](https://twitter.com/shrutikapoor08) による以下の発表をご覧ください：

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/ytudH8je5ko" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## サスペンスを使ったストリーミング付きサーバレンダリング {#streaming-server-rendering-with-suspense}

React 18 にはサスペンスを使ったサーバサイドレンダリングの機能の改善が含まれています。

ストリーミングサーバレンダリングによって、サーバ側で React コンポーネントから HTML を作成し、それをユーザにストリームで送ることができます。React 18 では、`Suspense` を使ってアプリを小さな単位に分割し、それぞれがアプリの他の部分をブロックせずに独立してストリーミング処理できるようになります。これによりユーザはより早くコンテンツを見ることができ、素早くインタラクションができるようになる、ということです。

詳しくは、[Shaundai Person](https://twitter.com/shaundai) による以下の発表をご覧ください：

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/pj5N-Khihgc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## React ワーキンググループの初立ち上げ {#the-first-react-working-group}

React 18 では、エキスパートや開発者、ライブラリメンテナ、教育者のグループと協力して作業するため、初めてワーキンググループを立ち上げました。彼らとともに、段階的な採用戦略を作成し、`useId`、`useSyncExternalStore`, `useInsertionEffect` といった API の改善を行ってきました。

この試みの概要については、[Aakansha' Doshi](https://twitter.com/aakansha1216) による発表をご覧ください：

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/qn7gRClrC9U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## React の開発者向けツーリング {#react-developer-tooling}

このリリースにおける新機能をサポートするため、新たに構成された React DevTools チームと、開発者が React サプリをデバッグしやすくするための新たなタイムラインプロファイラについて発表しました。

新たな DevTools の機能についての詳細およびデモについては、[Brian Vaughn](https://twitter.com/brian_d_vaughn) による発表をご覧ください：

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/oxDfrke8rZg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## memo 不要の React {#react-without-memo}

より将来に目を向けた話として、[Xuan Huang (黄玄)](https://twitter.com/Huxpro) は、React Labs が行っている自動メモ化コンパイラに関する研究の現状についてお話ししました。この発表とコンパイラのプロタイプについての詳細・デモは以下でご覧ください：

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/lGEMwh32soc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## React ドキュメントキーノート {#react-docs-keynote}

React の学習や React による設計についての一連の発表は [Rachel Nabors](https://twitter.com/rachelnabors) からスタートしました。その中では React の [新ドキュメント](https://beta.reactjs.org/) に関しての我々の注力に関してのキーノートがありました：

<iframe style="margin-top:10px" width="560" height="315" src="https://www.youtube.com/embed/mneDaMYOKP8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# さらに… {#and-more}

**React の学習や React における設計についての以下のような発表がありました：**

* Debbie O'Brien: [Things I learnt from the new React docs](https://youtu.be/-7odLW_hG7s).
* Sarah Rainsberger: [Learning in the Browser](https://youtu.be/5X-WEQflCL0).
* Linton Ye: [The ROI of Designing with React](https://youtu.be/7cPWmID5XAk).
* Delba de Oliveira: [Interactive playgrounds with React](https://youtu.be/zL8cz2W0z34).

**Relay、React Native、PyTorch チームからの発表：**

* Robert Balicki: [Re-introducing Relay](https://youtu.be/lhVGdErZuN4).
* Eric Rozell and Steven Moyes: [React Native Desktop](https://youtu.be/9L4FFrvwJwY).
* Roman Rädle: [On-device Machine Learning for React Native](https://youtu.be/NLj73vrc2I8)

**アクセシビリティ、ツーリング、サーバコンポーネントコミュニティからの発表：**

* Daishi Kato: [React 18 for External Store Libraries](https://youtu.be/oPfSC5bQPR8).
* Diego Haz: [Building Accessible Components in React 18](https://youtu.be/dcm8fjBfro8).
* Tafu Nakazaki: [Accessible Japanese Form Components with React](https://youtu.be/S4a0QlsH0pU).
* Lyle Troxell: [UI tools for artists](https://youtu.be/b3l4WxipFsE).
* Helen Lin: [Hydrogen + React 18](https://youtu.be/HS6vIYkSNks).

# 謝辞 {#thank-you}

我々自身でカンファランスを計画したのは今年が初めてでした。多くの方に感謝したいと思います。

まずは発表者の方々に感謝します。[Aakansha Doshi](https://twitter.com/aakansha1216)、[Andrew Clark](https://twitter.com/acdlite)、[Brian Vaughn](https://twitter.com/brian_d_vaughn)、[Daishi Kato](https://twitter.com/dai_shi)、[Debbie O'Brien](https://twitter.com/debs_obrien)、[Delba de Oliveira](https://twitter.com/delba_oliveira)、[Diego Haz](https://twitter.com/diegohaz)、[Eric Rozell](https://twitter.com/EricRozell)、[Helen Lin](https://twitter.com/wizardlyhel)、[Juan Tejada](https://twitter.com/_jstejada)、[Lauren Tan](https://twitter.com/sugarpirate_)、[Linton Ye](https://twitter.com/lintonye)、[Lyle Troxell](https://twitter.com/lyle)、[Rachel Nabors](https://twitter.com/rachelnabors)、[Rick Hanlon](https://twitter.com/rickhanlonii)、[Robert Balicki](https://twitter.com/StatisticsFTW)、[Roman Rädle](https://twitter.com/raedle)、[Sarah Rainsberger](https://twitter.com/sarah11918)、[Shaundai Person](https://twitter.com/shaundai)、[Shruti Kapoor](https://twitter.com/shrutikapoor08)、[Steven Moyes](https://twitter.com/moyessa)、[Tafu Nakazaki](https://twitter.com/hawaiiman0)、[Xuan Huang (黄玄)](https://twitter.com/Huxpro)。

発表についてのフィードバックを頂いた方々に感謝します。[Andrew Clark](https://twitter.com/acdlite)、[Dan Abramov](https://twitter.com/dan_abramov)、[Dave McCabe](https://twitter.com/mcc_abe)、[Eli White](https://twitter.com/Eli_White)、[Joe Savona](https://twitter.com/en_JS)、[Lauren Tan](https://twitter.com/sugarpirate_)、[Rachel Nabors](https://twitter.com/rachelnabors)、[Tim Yung](https://twitter.com/yungsters)。

カンファランス Discord のセットアップを行い Discord 管理者になっていただいた [Lauren Tan](https://twitter.com/sugarpirate_) に感謝します。

全体の方向性や、多様性とその受け入れについて助言をいただいた [Seth Webster](https://twitter.com/sethwebster) に感謝します。

モデレーション関係業務の先頭に立っていただいた [Rachel Nabors](https://twitter.com/rachelnabors)、そしてモデレーションガイドを作成し、モデレーションチームを率い、翻訳者とモデレータの教育を行い、両イベントのモデレーションに協力していただいた [Aisha Blake](https://twitter.com/AishaBlake) に感謝します。

モデレータの方々に感謝します。[Jesslyn Tannady](https://twitter.com/jtannady)、[Suzie Grange](https://twitter.com/missuze)、[Becca Bailey](https://twitter.com/beccaliz)、[Luna Wei](https://twitter.com/lunaleaps)、[Joe Previte](https://twitter.com/jsjoeio)、[Nicola Corti](https://twitter.com/Cortinico)、[Gijs Weterings](https://twitter.com/gweterings)、[Claudio Procida](https://twitter.com/claudiopro)、Julia Neumann、Mengdi Chen、Jean Zhang、Ricky Li、[Xuan Huang (黄玄)](https://twitter.com/Huxpro).

リプレイイベントのモデレーションやコミュニティへの活動に協力頂いた、[React India](https://www.reactindia.io/) の [Manjula Dube](https://twitter.com/manjula_dube)、[Sahil Mhapsekar](https://twitter.com/apheri0)、Vihang Patel、および [React China](https://twitter.com/ReactChina) の [Jasmine Xie](https://twitter.com/jasmine_xby)、[QiChang Li](https://twitter.com/QCL15)、[YanLun Li](https://twitter.com/anneincoding) に感謝します。

カンファランスのウェブサイトを構築するのに使った [Virtual Event Starter Kit](https://vercel.com/virtual-event-starter-kit) を公開していただいた Vercel、そして Next.js Conf での経験を共有していただいた [Lee Robinson](https://twitter.com/leeerob) と [Delba de Oliveira](https://twitter.com/delba_oliveira) に感謝します。

カンファランス運営の経験や [RustConf](https://rustconf.com/) 運営からの教訓を共有していただいた [Leah Silber](https://twitter.com/wifelette) に感謝します。彼女の書籍 [Event Driven](https://leanpub.com/eventdriven/) とそこに含まれたカンファランス運営に関する助言に感謝します。

Women of React Conf の運営経験について共有していただいた [Kevin Lewis](https://twitter.com/_phzn) と [Rachel Nabors](https://twitter.com/rachelnabors) に感謝します。

企画全体にわたってアドバイスやアイディアをいただいた [Aakansha Doshi](https://twitter.com/aakansha1216)、[Laurie Barth](https://twitter.com/laurieontech)、[Michael Chan](https://twitter.com/chantastic)、[Shaundai Person](https://twitter.com/shaundai) に感謝します。

カンファランスウェブサイトとチケットのデザイン・構築に協力いただいた [Dan Lebowitz](https://twitter.com/lebo) に感謝します。

キーノートや Meta 従業員の発表の録画をしていただいた Laura Podolak Waddell、Desmond Osei-Acheampong、Mark Rossi、Josh Toberman および Facebook Video Productions の他の方々に感謝します。

カンファランスの運営、ストリームされる全ビデオの編集、全発表の翻訳、そして多言語での Discord のモデレーションについて協力いただいたパートナーの HitPlay に感謝します。

最後に、この React Conf を素晴らしいものにしていただいたすべての参加者の皆さんに感謝します！
