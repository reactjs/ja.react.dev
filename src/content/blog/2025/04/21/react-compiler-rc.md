---
title: "React Compiler RC"
author: Lauren Tan and Mofei Zhang
date: 2025/04/21
description: 本日、コンパイラの最初のリリース候補 (RC) を公開します。

---

April 21, 2025 by [Lauren Tan](https://x.com/potetotes) and [Mofei Zhang](https://x.com/zmofei).

---

<Intro>

React チームより新しいお知らせがあります。

</Intro>

1. 安定版リリースに向け、本日 React Compiler RC を公開します。
2. `eslint-plugin-react-compiler` を `eslint-plugin-react-hooks` に統合します。
3. Babel を使わずビルドできるよう swc のサポートを追加しました。oxc とも協力して作業中です。

---

[React Compiler](https://react.dev/learn/react-compiler) は、ビルド時の自動メモ化によって React アプリを最適化するツールです。昨年、React Compiler の[最初のベータ版](https://react.dev/blog/2024/10/21/react-compiler-beta-release)を公開し、多くの素晴らしいフィードバックと貢献を受けることができました。コンパイラを採用した人々からの成功事例（[Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) や [Wakelet](https://github.com/reactwg/react-compiler/discussions/52) のケーススタディを参照）を嬉しく思っており、安定版リリースに向けて作業を進めています。

本日、コンパイラの最初のリリース候補 (RC) を公開します。RC はコンパイラの安定したほぼ最終版となるものであり、本番環境で安全に試用することが可能です。

## React Compiler RC を今日から使い始める {/*use-react-compiler-rc-today*/}
RC をインストールするには以下のようにします。

npm
<TerminalBlock>
{`npm install --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev --exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

RC の一環として、React Compiler をプロジェクトに追加しやすくする作業を行い、またコンパイラがメモ化を行う際の最適化を加えました。React Compiler は、オプショナルチェーン式と配列の添字アクセスを依存値としてサポートするようになりました。さらに、等価性チェックや文字列補間 (string interpolation) など、さらに多様な依存値を推測する方法を模索しています。これらの改善により、再レンダーが減少し、より応答性の高い UI が実現します。

また、コミュニティから、"ref-in-render" 検証が時々誤作動を起こすという声を聞いています。一般的な方針として、コンパイラのエラーメッセージやヒントは完全に信頼できるようにしたいと考えているため、この検証は、現時点ではデフォルトでオフにしています。この検証についての改善を続けて、次回以降のリリースで再度有効にする予定です。

コンパイラの利用法に関する詳細は[ドキュメント](https://react.dev/learn/react-compiler)で確認できます。

## フィードバック {/*feedback*/}
RC 期間中、すべての React ユーザにコンパイラを試していただき、フィードバックを React リポジトリに寄せていただくことをお願いします。バグや予期しない動作に遭遇した場合は、[issue をオープンして](https://github.com/facebook/react/issues)ください。一般的な質問や提案がある場合は、[React Compiler Working Group](https://github.com/reactwg/react-compiler/discussions) に投稿してください。

## 後方互換性 {/*backwards-compatibility*/}
ベータ版の発表でお知らせしたように、React Compiler は React 17 以降と互換性があります。まだ React 19 を使用していない場合は、コンパイラ設定で最小ターゲットを指定し、`react-compiler-runtime` を依存ライブラリとして追加することで React Compiler を使用できます。詳細は[こちら](https://react.dev/learn/react-compiler#using-react-compiler-with-react-17-or-18)で確認できます。

## eslint-plugin-react-compiler から eslint-plugin-react-hooks への移行 {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
すでに eslint-plugin-react-compiler をインストールしている場合は、これを削除し、`eslint-plugin-react-hooks@6.0.0-rc.1` を使用してください。この改善に貢献していただいた [@michaelfaith](https://bsky.app/profile/michael.faith) に感謝します！

インストールは以下のように行います。

npm
<TerminalBlock>
{`npm install --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

```js
// eslint.config.js
import * as reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Flat Config (eslint 9+)
  reactHooks.configs.recommended,

  // Legacy Config
  reactHooks.configs['recommended-latest']
];
```

React Compiler のルールを有効にするには、ESLint 設定に `'react-hooks/react-compiler': 'error'` を追加してください。

リンタはコンパイラをインストールせずとも動作しますので、eslint-plugin-react-hooks をアップグレードすることによるリスクはありません。すべての方に今すぐアップグレードをお勧めします。

## swc サポート (実験的) {/*swc-support-experimental*/}
React Compiler は、Babel、Vite、Rsbuild など[いくつかのビルドツール](/learn/react-compiler#installation)でインストールできます。

これらのツールに加えて、[swc](https://swc.rs/) チームの Kang Dongyoon ([@kdy1dev](https://x.com/kdy1dev)) と協力して、React Compiler を swc プラグインとして追加サポートする作業を進めています。この作業はまだ完了していませんが、[Next.js アプリで React Compiler を有効にする](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)と、Next.js のビルドパフォーマンスはかなり向上しているはずです。

最良のビルドパフォーマンスを得るために、Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 以降を使用することをお勧めします。

Vite ユーザは、[vite-plugin-react](https://github.com/vitejs/vite-plugin-react) の利用を継続しつつ、コンパイラを [Babel プラグイン](https://react.dev/learn/react-compiler#usage-with-vite)として有効化してください。現在 [oxc](https://oxc.rs/) チームとも協力して[コンパイラのサポート](https://github.com/oxc-project/oxc/issues/10048)の追加作業を行っています。[rolldown](https://github.com/rolldown/rolldown) が正式にリリースされて Vite でサポートされるようになり、かつ oxc が React Compiler をサポートするようになった時点で、ドキュメントを更新して移行方法に関する情報をお知らせします。

## React Compiler のアップグレード {/*upgrading-react-compiler*/}
React Compiler が最も効果的に動作するのは、自動メモ化が厳密にパフォーマンス目的だけに使われる場合です。コンパイラの将来のバージョンではメモ化の適用方法が変化して、例えばより細かく正確なメモ化を行うようになるかもしれません。

しかし、製品コードはしばしば [React のルール](https://react.dev/reference/rules)に違反していることがありますし、JavaScript ではそれらを常に静的に検出できるわけではないため、メモ化の挙動が変わることで予期しない結果を招くことがあります。たとえば、メモ化済みの値が、コンポーネントツリーのどこかで useEffect の依存値として使用されることがあります。この値のメモ化の有無や挙動が変わることにより、対応する useEffect の発火が過剰あるいは過少になる可能性があるのです。[useEffect は同期のためだけに使用する](https://react.dev/learn/synchronizing-with-effects)ことを推奨していますが、特定の値の変更にのみ反応する必要があるエフェクトなど、他のユースケースのための useEffect がコードベースには含まれているかもしれません。

言い換えれば、メモ化の挙動が変われば、まれな状況においては予期しない動作を引き起こす可能性があるということです。このため、React のルールに従い、アプリのエンドツーエンドテストを継続的に行うことをお勧めします。これにより、コンパイラを自信を持ってアップグレードし、問題を引き起こす可能性のある React のルール違反を特定できます。

十分なテストカバレッジがない場合は、コンパイラを特定のバージョン（例：`19.1.0`）に固定し、SemVer の範囲指定（例：`^19.1.0`）を用いないことをお勧めします。これを行うには、コンパイラをアップグレードする際に `--save-exact` (npm/pnpm) または `--exact` フラグ (yarn) を渡します。その後のコンパイラのアップグレードは、アプリが期待通りに動作することを確認しながら、手動で行うようにしてください。

## 安定版へのロードマップ {/*roadmap-to-stable*/}
*これは最終的なロードマップではなく、変更される可能性があります。*

RC に対するコミュニティからの最終的なフィードバック期間の後、コンパイラの安定版リリースを計画しています。

* ✅ 実験的バージョン：React Conf 2024 でリリース済み。主にアプリケーション開発者からのフィードバックを得るため。
* ✅ 公開ベータ：リリース済み。ライブラリ作成者からのフィードバックを得るため。
* ✅ リリース候補 (RC)：React Compiler がルールに従うアプリやライブラリの大部分で問題なく動作する状態。
* 一般提供：コミュニティからの最終的なフィードバック期間の後。

安定版リリース後も、さらなるコンパイラの最適化と改善を追加する予定です。これには、自動メモ化の継続的な改善と、全く新しいタイプの最適化の両方が含まれますが、製品コードの変更は最小限または不要となる予定です。各アップグレードにおいて、継続してパフォーマンスの向上を行い、多様な JavaScript および React パターンに対する処理を改善していきます。

---

この投稿をレビューおよび編集していただいた [Joe Savona](https://x.com/en_JS)、[Jason Bonta](https://x.com/someextent)、[Jimmy Lai](https://x.com/feedthejim)、および [Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev) に感謝します。