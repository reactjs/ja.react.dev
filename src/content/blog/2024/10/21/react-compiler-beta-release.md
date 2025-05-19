---
title: "React Compiler Beta リリース"
author: Lauren Tan
date: 2024/10/21
description: React Conf 2024 で、React Compiler の実験的リリースを発表しました。これは、ビルド時に自動メモ化を通じて React アプリを最適化するツールです。この投稿では、オープンソースの次のステップとコンパイラの進捗状況を共有したいと思います。

---

October 21, 2024 by [Lauren Tan](https://twitter.com/potetotes).

---

<Note>

### React Compiler is now in RC! {/*react-compiler-is-now-in-rc*/}

Please see the [RC blog post](/blog/2025/04/21/react-compiler-rc) for details.

</Note>

<Intro>

React チームより以下の最新情報を共有できることを嬉しく思います。

</Intro>

1. React Compiler ベータ版を本日公開します。アーリーアダプタやライブラリのメンテナが試用し、フィードバックを行えるようになります。
2. React 17+ のアプリに対して、オプションの `react-compiler-runtime` パッケージを通じた React Compiler の使用を公式にサポートします。
3. コンパイラの段階的な採用に備えて、[React Compiler Working Group](https://github.com/reactwg/react-compiler) の公開メンバーシップを開放します。

---

[React Conf 2024](/blog/2024/05/22/react-conf-2024-recap) にて、React Compiler の実験的リリースを発表しました。これは、ビルド時の自動的なメモ化を通じて React アプリを最適化するツールです。[React Compiler の紹介はこちらでご覧いただけます](/learn/react-compiler)。

初期のリリース以来、React コミュニティから報告された多数のバグを修正し、コンパイラに対する貴重なバグ修正や貢献[^1]をいくつか頂き、多様な JavaScript パターンに対してコンパイラをより堅牢にする作業を行い、Meta 社内でコンパイラの展開を続けてきました。

この投稿では、React Compiler の次のステップを共有したいと思います。

## React Compiler Beta をすぐに試す {/*try-react-compiler-beta-today*/}

[React India 2024](https://www.youtube.com/watch?v=qd5yk2gxbtg) で、React Compiler の最新情報を共有しました。本日、React Compiler と ESLint プラグインの新しいベータ版のリリースを発表できることを嬉しく思います。新しいベータ版は `@beta` タグ付きで npm に公開されています。

React Compiler ベータ版をインストールするには以下のようにします。

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

または、Yarn を使用している場合は以下のようにします。

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

[Sathya Gunasekaran](https://twitter.com/_gsathya) による React India での講演はこちらでご覧いただけます。

<YouTubeIframe src="https://www.youtube.com/embed/qd5yk2gxbtg" />

## React Compiler リンタを今日から使い始める {/*we-recommend-everyone-use-the-react-compiler-linter-today*/}

React Compiler の ESLint プラグインは、開発者が [React のルール](/reference/rules) に対する違反を事前に特定して修正するのに役立ちます。**リンタを今日から使い始めることを強くお勧めします**。リンタはコンパイラのインストールを必要としないため、コンパイラを試す準備ができていなくても独立して使用できます。

リンタのみをインストールするには以下のようにします。

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

または、Yarn を使用している場合は以下のようにします。

<TerminalBlock>
yarn add -D eslint-plugin-react-compiler@beta
</TerminalBlock>

インストール後、[ESLint の設定ファイルに記載を追加することでリンタを有効にできます](/learn/react-compiler#installing-eslint-plugin-react-compiler)。リンタを使用することで、React のルールに対する違反を特定でき、コンパイラが完全にリリースされる際の導入が容易になります。

## 後方互換性 {/*backwards-compatibility*/}

React Compiler は React 19 に追加されたランタイム API に依存するコードを生成しますが、React 17 および 18 でもコンパイラが動作するようにサポートを追加しました。ベータ版では、まだ React 19 に移行していない場合でも、コンパイラ設定で小さな `target` を指定し、`react-compiler-runtime` を依存ライブラリとして追加することで、React Compiler を試すことができます。[これに関するドキュメントはこちらでご覧いただけます](/learn/react-compiler#using-react-compiler-with-react-17-or-18)。

## ライブラリでの React Compiler の使用 {/*using-react-compiler-in-libraries*/}

初期のリリースでは、アプリケーションでコンパイラを使用する際の主要な問題を特定することに焦点を当てていました。その後素晴らしいフィードバックをいただき、コンパイラを大幅に改善してきました。コミュニティからの幅広いフィードバックを受ける準備が整い、ライブラリの作者がコンパイラを試用し、ライブラリのパフォーマンスと開発者体験を向上させることができるようになりました。

React Compiler はライブラリのコンパイルにも使用できます。React Compiler はコード変換前のオリジナルのソースコードで動作する必要があるため、アプリケーションのビルドパイプライン中で、アプリが使用するライブラリをコンパイルすることは不可能です。そのため、ライブラリのメンテナが個別にライブラリをコンパイルし、テストし、コンパイル済みのコードを npm で配布することをお勧めします。

ライブラリのコードが事前にコンパイルされていれば、ライブラリのユーザはコンパイラを有効にしなくても、ライブラリに適用された自動メモ化の恩恵を受けることができます。ライブラリがまだ React 19 に移行していないアプリを対象としている場合、最小の `target` を指定し、`react-compiler-runtime` を dependency として直接追加してください。ランタイムパッケージはアプリケーションのバージョンに応じて正しい API の実装を使用し、必要に応じて欠けている API をポリフィルします。

[これに関するドキュメントはこちら](/learn/react-compiler#using-the-compiler-on-libraries)。

## React Compiler Working Group を全員に開放 {/*opening-up-react-compiler-working-group-to-everyone*/}

以前 React Conf にて、招待制の [React Compiler Working Group](https://github.com/reactwg/react-compiler) を発表し、コンパイラの実験的リリースに対するフィードバックを提供し、質問をし、貢献を行える場として利用してきました。

本日より、React Compiler Beta のリリースに合わせ、Working Group のメンバーシップを全員に開放します。React Compiler Working Group の目標は、エコシステム全体で、既存のアプリケーションやライブラリによる React Compiler のスムーズかつ段階的な採用準備を整えることです。今後もバグ報告は [React リポジトリ](https://github.com/facebook/react)に行っていただく一方で、フィードバックや質問、アイディアの共有は、[Working Group のディスカッションフォーラム](https://github.com/reactwg/react-compiler/discussions)を利用してください。

コアチームも研究結果を共有にディスカッションリポジトリを使用します。安定版リリースが近づくにつれ、重要な情報もこのフォーラムに投稿されます。

## Meta における React Compiler の利用 {/*react-compiler-at-meta*/}

[React Conf](/blog/2024/05/22/react-conf-2024-recap) では、Quest Store と Instagram におけるコンパイラの本番投入が成功したことを発表しました。それ以来、[Facebook](https://www.facebook.com) や [Threads](https://www.threads.net) を含む Meta 社の複数の主要ウェブアプリにおいて、React Compiler の展開を行ってきました。つまり最近これらのアプリを使用していたなら、その体験をコンパイラが支えていたということです。これらのアプリをコンパイラに乗せるために必要なコード変更はほとんどなく、10 万以上の React コンポーネントを含むモノレポで移行に成功しました。

これらのアプリ全体で、顕著なパフォーマンス向上が見られました。導入を進める中で、[以前 React Conf で発表したもの](https://youtu.be/lyEKhv8-3n0?t=3223)と同程度の成果が、引き続き確認されています。これらのアプリは長らく Meta のエンジニアや React の専門家により手作業で調整され最適化されてきたものですから、数パーセントの改善でも大きな成果と言えるでしょう。

また、React Compiler による開発者の生産性向上も期待される効果でした。これを測定するために、Meta のデータサイエンスパートナー[^2]と協力して、手動メモ化が生産性に与える影響について広範な統計分析を行いました。Meta でコンパイラを投入する以前は、React に関するプルリクエストの約 8% でしか手動メモ化が利用されておらず、そのようなプルリクエストは作成に 31-46% 長くかかっていました[^3]。この結果は、手動メモ化が認知的負担を引き起こすという我々の直感に合致するものであり、React Compiler により効率的なコード作成とレビューが実現できる可能性を示唆するものです。特に、React Compiler は、開発者が明示的にメモ化を適用してくれる一部の（私たちの場合 8%）コードだけではなく、すべてのコードがデフォルトでメモ化されることを保証してくれるのです。

## 安定版に向けてのロードマップ {/*roadmap-to-stable*/}

*これは最終的なロードマップではなく、変更される可能性があります*。

ベータ版リリースに続いて、React のルールに従うアプリやライブラリの大部分がコンパイラで問題なく動作することが証明された後で、近い将来にコンパイラのリリース候補をリリースする予定です。その後コミュニティからの最終的なフィードバックを受け付ける期間を経て、コンパイラの安定版リリースを予定しています。安定版リリースは React の新しい基盤の始まりとなるものであり、すべてのアプリとライブラリに対し、コンパイラと ESLint プラグインの使用が強く推奨されるようになります。

* ✅ Experimental：React Conf 2024 でリリース。主にアーリーアダプタからのフィードバックを得るため。
* ✅ Public Beta：本日リリース。より広いコミュニティからのフィードバックを得るため。
* 🚧 リリース候補 (RC)：ルールに従うアプリやライブラリの大部分で React Compiler 問題なく動作するようになったら。
* 🚧 一般提供：コミュニティからの最終的なフィードバック期間の後。

これらのリリースには、コンパイラ用の ESLint プラグインも含まれており、コンパイラによって静的に分析された診断結果を表示できます。既存の eslint-plugin-react-hooks プラグインをコンパイラ用の ESLint プラグインと統合し、1 つのプラグインだけをインストールすればよくなるよう計画しています。

安定版リリース後には、コンパイラによる最適化と改善をさらに追加する予定です。これには、自動的なメモ化の継続的な改善と、全く新しい最適化の両方が含まれ、製品コードの変更は最小限または不要になる予定です。コンパイラの新しいリリースへのアップグレードは簡単に行えることを目指しています。各アップグレードはパフォーマンスを向上させ、多様な JavaScript と React パターンに対し、より良い処理が行えるようになります。

このプロセス全体を通じて、React 用の IDE 拡張機能のプロトタイプを作成する計画もあります。まだ研究の初期段階なので、将来の React Labs ブログ投稿で、より多くの知見を共有できることを期待しています。

---

この投稿のレビュー・編集に協力していただいた [Sathya Gunasekaran](https://twitter.com/_gsathya)、[Joe Savona](https://twitter.com/en_JS)、[Ricky Hanlon](https://twitter.com/rickhanlonii)、[Alex Taylor](https://github.com/alexmckenley)、[Jason Bonta](https://twitter.com/someextent)、[Eli White](https://twitter.com/Eli_White) に感謝します。

---

[^1]: コンパイラの貢献に協力いただいた [@nikeee](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Anikeee)、[@henryqdineen](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Ahenryqdineen)、[@TrickyPi](https://github.com/facebook/react/pulls?q=is%3Apr+author%3ATrickyPi) に感謝します。

[^2]: Meta での React コンパイラに関する本研究を主導し、この投稿をレビューしていただいた [Vaishali Garg](https://www.linkedin.com/in/vaishaligarg09) に感謝します。

[^3]: 作成者の在職期間、差分の長さ・複雑さなど、潜在的な交絡因子を調整済み。