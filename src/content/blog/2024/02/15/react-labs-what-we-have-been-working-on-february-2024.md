---
title: "React Labs: 私達のこれまでの取り組み - 2024年2月版"
---

February 15, 2024 by [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), and [Dan Abramov](https://twitter.com/dan_abramov).

---

<Intro>

React Labs 記事では、現在活発に研究・開発が行われているプロジェクトについて述べていきます。[前回のアップデート](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)から大きな進展がありましたので、我々が学んだことを共有していきます。

</Intro>

<Note>

5 月 15 日・16 日にネバダ州ヘンダーソンで React Conf 2024 が開催されます！ 現地で React Conf に参加を希望される方は、2 月 28 日までに[チケットの抽選に参加](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK)してください。

チケット、無料ストリーミング、スポンサーシップなどの詳細については、[React Conf のウェブサイト](https://conf.react.dev)をご覧ください。

</Note>

---

## React Compiler {/*react-compiler*/}

React Compiler は、もはや研究プロジェクトではありません。このコンパイラは現在 instagram.com の本番環境で動作しています。Meta の他のプラットフォームにもコンパイラを展開するための作業や、オープンソースとしての初回リリースを行うための準備を進めています。

私たちが[前回の投稿](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler)でお伝えしたように、React は state が変更された際、*どきどき*過剰な再レンダーを行います。React の黎明期より、このような場合の解決策は手動によるメモ化を行うことでした。現在の API においては、これは [`useMemo`](/reference/react/useMemo)、[`useCallback`](/reference/react/useCallback)、[`memo`](/reference/react/memo) の各 API を適用して、state の変更に対する React の再レンダーの量を手動で調整することを意味します。しかし、手動によるメモ化は妥協の産物です。コードが読みづらくなり、間違いが起きやすくなり、最新の状態に保つために余分な作業が必要です。

手動のメモ化は合理的な妥協策ではありますが、私たちは満足していませんでした。私たちのビジョンは、state が変更されたときに React が*自動的に* UI の正しい部分だけを再レンダーすることであり、それを *React の思考モデルを損なうことなしに*行うことです。UI を状態に対する単純な関数として捉え、JavaScript の標準的な値や記法を使って表現する、という React のアプローチが、多くの開発者にとって React が親しみやすいものである理由の一部である、と私たちは信じています。だからこそ、React のための最適化コンパイラの構築に投資することにしたのです。

JavaScript は、そのルールの緩さと動的な性質のために、最適化が非常に難しい言語として知られています。React Compiler は、JavaScript のルールと、いわゆる「React のルール」の*両方を*モデル化することによって、コードを安全にコンパイルすることができます。たとえば、React コンポーネントは冪等、すなわち同じ入力が与えられたときに同じ値を返す必要がありますし、props や state の値を変更してはなりません。これらのルールは開発者の行えることを制限する一方で、コンパイラが安全に最適化できる余地を作り出すのに役立つのです。

もちろん、しばしば開発者はこのルールを少しねじ曲げる、ということも理解しています。私たちの目標はできるだけ多くのコードで、React Compiler がそのまますぐに動作するようにすることです。コンパイラはコードが React のルールに厳密に従っていない場合にそのことを検出し、安全であればコードをコンパイルし、安全でなければコンパイルをスキップしようとします。私たちは Meta の大規模かつ多様なコードベースに対してテストを行い、このアプローチを検証するのに役立てています。

自分のコードが React のルールに従っているか開発者が確認したい場合は、[Strict Mode を有効にする](/reference/react/StrictMode)ことと、[React の ESLint プラグインを設定する](/learn/editor-setup#linting)ことをお勧めします。これらのツールを使うことにより、React コードの微妙なバグが捉えられ、今すぐあなたのアプリケーションの品質が向上するとともに、React Compiler のような今後の機能に対するアプリケーションの未来も担保されます。私たちはまた、チームがこれらのルールを理解してより堅牢なアプリを作成できるよう、React のルールに関する統一的なドキュメント作成作業や、ESLint プラグインの更新作業にも取り組んでいます。

コンパイラが実際に動作する様子を見たい場合は、[昨年秋の私たちの講演](https://www.youtube.com/watch?v=qOQClO3g8-Y)をチェックしてください。この講演の時点では、instagram.com のひとつのページで React Compiler を試してみた初期実験データしかありませんでした。その後私たちは、コンパイラを instagram.com 全体の本番環境で導入しました。また、チームを拡大して、Meta が公開している他の場所への展開やオープンソースへの展開を加速しています。この先の数ヶ月で、さらに多くの情報を共有できることを楽しみにしています。

## アクション {/*actions*/}


[以前のブログ記事](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)で、クライアントからサーバへデータを送信してデータベース更新やフォーム実装を行うためのソリューションである、Server Action という試みについてお伝えしました。Server Action を開発する中で、これらの API を拡張し、クライアントのみのアプリケーションでのデータ処理にも対応させることにしました。

このより広範な機能の集合は、単に「アクション (Action)」と呼ばれるようになります。アクションにより、[`<form/>`](/reference/react-dom/components/form) のような DOM 要素に関数を渡すことができるようになります。

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

この `action` 関数は同期的にも非同期的にも動作します。クライアント側で標準の JavaScript を使用して定義することもできますし、[`'use server'`](/reference/react/use-server) ディレクティブを使用してサーバ側で定義することも可能です。アクションを使用することで、React がデータ送信に関するライフサイクルを管理するようになり、[`useFormStatus`](/reference/react-dom/hooks/useFormStatus) や [`useFormState`](/reference/react-dom/hooks/useFormState) などのフックを通じて、現在の送信ステータスやフォームアクションのレスポンスにアクセスできるようになります。

デフォルトでは、アクションは[トランジション](/reference/react/useTransition)内で送信されるため、アクションが処理されている間も現在のページをインタラクティブに保ちます。アクションは非同期関数をサポートしているため、トランジション内で `async/await` を使用する機能も追加しました。これにより、`fetch` のような非同期リクエストが開始されたときにトランジションの `isPending` 状態を使って保留中 (pending) UI を表示できるようになり、更新の適用が完了するまで保留中 UI を表示し続けることができます。

アクションと並行して、楽観的な state 更新を管理するための [`useOptimistic`](/reference/react/useOptimistic) という機能を導入しています。このフックを使用すると、最終 state がコミットされた際に自動的に元に戻る一時的な更新を適用できます。アクションの場合、送信が成功するものと仮定してクライアント側でデータの最終 state を楽観的に設定しておき、最終的にサーバから受け取ったデータの値に戻すことができます。これは通常の `async`/`await` を使用して動作するため、クライアントで `fetch` を使用している場合でも、サーバからの Server Action を使用している場合でも同じように動作します。

ライブラリの作者は、`useTransition` を使用する独自のコンポーネントでカスタムの `action={fn}` という props を実装できます。私たちの意図は、ライブラリがコンポーネントの API を設計する際に Action のパターンを採用することで、React 開発者に一貫した体験が提供されるようになることです。例えば、あなたのライブラリが `<Calendar onSelect={eventHandler}>` というコンポーネントを提供している場合、`<Calendar selectAction={action}>` API も公開することを検討してください。

当初はクライアントからサーバへのデータ転送方法としての Server Action にフォーカスしてきましたが、React の哲学は、すべてのプラットフォームと環境で同じプログラミングモデルを提供することです。可能な限り、クライアントで何か機能を導入する場合はサーバでも動作するようにしようとしますし、その逆も同様です。この哲学により、アプリがどこで実行される場合でも機能する単一の API セットを作成でき、後で異なる環境にアップグレードすることが容易になるでしょう。

アクションは現在 Canary チャンネルで利用可能であり、次回の React のリリースに含まれる予定です。

## React Canary での新機能 {/*new-features-in-react-canary*/}

私たちは、semver の安定バージョンでリリースされる前に、設計がほぼ最終的な段階に近づいた新しい安定機能を個別に採用するオプションとして、[React Canary](/blog/2023/05/03/react-canaries) を導入しました。

Canary は我々の新しい React 開発方法です。これまで、新機能は Meta 内でプライベートに研究、構築されていたため、ユーザは安定版にリリースされたときに初めて最終版のプロダクトを目にすることになっていました。Canary 以降は、コミュニティの助けを借りつつ公開の場で、React Labs ブログシリーズで共有している各種機能について開発を進め、最終確定を行っています。これは、機能が完成してしまった後ではなく最終確定の途上にある段階で、新機能についていち早く知ることができる、ということです。

React Server Components、アセットローディング、ドキュメントメタデータ、およびアクションは、すべて React Canary で導入済みであり、これらの機能に関するドキュメントは react.dev に追加されています。

- **ディレクティブ**：[`"use client"`](/reference/react/use-client) と [`"use server"`](/reference/react/use-server) はフルスタック React フレームワーク用に設計されたバンドラ機能であり、2 つの環境間の「切り離しポイント」をマークします。`"use client"` はバンドラに `<script>` タグを生成するよう指示し（[Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island) のように）、`"use server"` はバンドラに POST エンドポイントを生成するよう指示します（[tRPC Mutations](https://trpc.io/docs/concepts) のように）。これらが協調して働くことで、クライアント側でのユーザ操作と関連するサーバ側のロジックが組み合わさった、再利用可能なコンポーネントを書くことが可能になります。

- **ドキュメントメタデータ**：コンポーネントツリーのどこからでも [`<title>`](/reference/react-dom/components/title)、[`<meta>`](/reference/react-dom/components/meta)、およびメタデータ用 [`<link>`](/reference/react-dom/components/link) タグをレンダーできるようにするための組み込みサポートを追加しました。これらは、完全にクライアントのみのコード、SSR、および RSC を含むすべての環境において、同様に機能します。これにより、[React Helmet](https://github.com/nfl/react-helmet) などのライブラリが先行して切り開いた機能に対するサポートが、組み込みで提供されるようになります。

- **アセットローディング**：スタイルシート、フォント、スクリプトなどのリソースのローディングライフサイクルをサスペンス (Suspense) と統合し、React が [`<style>`](/reference/react-dom/components/style)、[`<link>`](/reference/react-dom/components/link)、[`<script>`](/reference/react-dom/components/script) などの要素に対応する内容の表示準備ができているかどうか判断する際にこれを考慮するようにしました。また、リソースがいつロードおよび初期化されるべきかをより細かく制御するために、`preload` や `preinit` などの新しい [リソースローディング API](/reference/react-dom#resource-preloading-apis) を追加しました。

- **アクション**: 上記で述べた通り、クライアントからサーバへのデータ送信を管理する機能であるアクションを追加しました。[`<form/>`](/reference/react-dom/components/form) などの要素に `action` を追加し、[`useFormStatus`](/reference/react-dom/hooks/useFormStatus) で送信ステータスを取得し、[`useFormState`](/reference/react-dom/hooks/useFormState) で結果を処理し、[`useOptimistic`](/reference/react/useOptimistic) で UI を楽観的に更新することが可能です。

これらの機能はすべて連携して動作するため、個別に安定版チャンネルでリリースすることは困難です。フォームステータスを取得するためのフックによる補完なしでアクションをリリースすれば、実用的な有用性は限定されてしまうでしょう。React Server Components をサーバアクションと統合せずに導入すれば、サーバ上のデータを変更することが大変になってしまうでしょう。

一連の機能を安定版チャンネルにリリースする前に、それらが統合的に動作し、開発者が本番環境で使用する際に必要なすべてのものが確実に揃っているようにする必要があります。React Canary により、これらの機能を個別に開発し、最終的に機能セット全体が完成する前に、安定した API を段階的にリリースすることができるのです。

現在 React Canary の機能は完全に揃った状態であり、リリースの準備ができています。

## 次の React メジャーバージョン {/*the-next-major-version-of-react*/}

数年のイテレーションを経て、`react@canary` を `react@latest` にリリースする準備が整いました。上記で紹介した新機能は、あなたのアプリが動作するあらゆる環境と互換性があり、本番使用に必要なすべてを提供します。アセットローディングとドキュメントメタデータは一部のアプリにとって破壊的変更となる可能性があるため、次の React のバージョンはメジャーバージョン、**React 19** になります。

リリースに向けてまだやるべきことがあります。React 19 では、Web Component のサポートのような、破壊的変更を伴うが長年の要望に応えることになる改善も追加されます。現在は、これらの変更を確定し、リリースの準備をし、新機能に対するドキュメントを仕上げ、新たに含まれる機能についてのアナウンスを公開することにフォーカスしています。

今後数ヶ月で、React 19 の新要素に関するすべての情報、新しいクライアント機能の採用方法、React Server Components をサポートする環境の構築方法について、さらに情報を共有していきます。

## オフスクリーン（Activity に改名） {/*offscreen-renamed-to-activity*/}

前回のアップデート以降に、"オフスクリーン (Offscreen)" という研究中機能の名称を"Activity" に変更しました。「オフスクリーン」という名前は、アプリの見えない部分にのみこれが適用されるという誤った印象を与えるものでしたが、この機能を研究する中で、例えばモーダルの背後のコンテンツなど、アプリの一部は見えていても非アクティブになる可能性があることに気づきました。新しい名前は、アプリの特定の部分を「アクティブ」または「非アクティブ」とマークするという動作を、より正確に反映しています。

Activity はまだ研究中であり、残された作業は、ライブラリ開発者に公開されるプリミティブを最終決定することです。より完成度の高い機能をリリースすることに焦点を当てているため、この部分については優先順位を下げています。

* * *

このアップデートに加えて、私たちのチームはカンファレンスでの発表やポッドキャストへの出演を通じ、我々の作業についてお伝えし、質問にお答えてしいます。

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) は [React India](https://www.youtube.com/watch?v=kjOacmVsLSE) カンファレンスで React コンパイラについて話しました。

- [Dan Abramov](/community/team#dan-abramov) は [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) で "React from Another Dimension" というタイトルの講演を行い、React Server Components やアクションの成立に際してありえたかもしれない別の歴史について紹介しました。

- [Dan Abramov](/community/team#dan-abramov) は [the Changelog’s JS Party podcast](https://changelog.com/jsparty/311) で React Server Components に関するインタビューに出演しました。

- [Matt Carroll](/community/team#matt-carroll) は [Front-End Fire podcast](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) のインタビューに出演し、[The Two Reacts](https://overreacted.io/the-two-reacts/) についてお話ししました。

この投稿をレビューしてくれた [Lauren Tan](https://twitter.com/potetotes)、[Sophie Alpert](https://twitter.com/sophiebits)、[Jason Bonta](https://threads.net/someextent)、[Eli White](https://twitter.com/Eli_White)、そして [Sathya Gunasekaran](https://twitter.com/_gsathya) に感謝します。

ここまで読んでいただきありがとうございました。[React Conf でお会いしましょう](https://conf.react.dev/)！
