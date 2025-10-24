---
title: "React Compiler v1.0"
author: Lauren Tan, Joe Savona, and Mofei Zhang
date: 2025/10/07
description: 本日、コンパイラの最初の安定版リリースを公開します。

---

Oct 7, 2025 by [Lauren Tan](https://x.com/potetotes), [Joe Savona](https://x.com/en_JS), and [Mofei Zhang](https://x.com/zmofei).

---

<Intro>

React チームから以下の新しいお知らせを共有できることを嬉しく思います。

</Intro>

1. React Compiler 1.0 が本日利用可能になりました。
2. コンパイラを使用した lint ルールが `eslint-plugin-react-hooks` の `recommended` および `recommended-latest` プリセットに同梱されます。
3. 段階的採用ガイドを公開し、Expo、Vite、Next.js と提携することで、新しいアプリがコンパイラを有効にした状態で開始できるようにしました。

---

本日、コンパイラの最初の安定版リリースを公開します。React Compiler は React と React Native の両方で動作し、書き換えを必要とせずにコンポーネントとフックを自動的に最適化します。このコンパイラは Meta の主要なアプリで現場テストが行われており、フルに本番対応済みです。

[React Compiler](/learn/react-compiler) は、ビルド時の自動メモ化によって React アプリを最適化するツールです。昨年、React Compiler の[最初のベータ版](/blog/2024/10/21/react-compiler-beta-release)を公開し、多くの素晴らしいフィードバックと貢献を受けることができました。コンパイラを採用した人々からの成功事例（[Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) や [Wakelet](https://github.com/reactwg/react-compiler/discussions/52) のケーススタディを参照）を嬉しく思っており、React コミュニティのより多くのユーザにこのコンパイラを届けられることを楽しみにしています。

このリリースは、10 年近くに及ぶ、巨大で複雑なエンジニアリング作業の集大成となるものです。React チームのコンパイラに関する最初の探求は、2017 年の [Prepack](https://github.com/facebookarchive/prepack) から始まりました。このプロジェクトは最終的に終了しましたが、そこから得られた多くの学びは、将来のコンパイラを見据えたフックの設計に影響を与えました。2021 年には [Xuan Huang](https://x.com/Huxpro) が、React Compiler という新アプローチの[初期バージョン](https://www.youtube.com/watch?v=lGEMwh32soc)をデモしました。

React Compiler のこの初期バージョンは後に書き直されることとなりましたが、この最初のプロトタイプによって、これが解決可能な問題であるという確信が深まり、また、別のコンパイラアーキテクチャによって我々が望む形のメモ化特性が正確に実現できるという学びが得られました。[Joe Savona](https://x.com/en_JS)、[Sathya Gunasekaran](https://x.com/_gsathya)、[Mofei Zhang](https://x.com/zmofei)、[Lauren Tan](https://x.com/potetotes) が最初の書き直しを行い、コンパイラのアーキテクチャを制御フローグラフ (Control Flow Graph; CFG) ベースの高レベル中間表現 (High-Level Intermediate Representation; HIR) に移行しました。これにより、より精密な解析や、React Compiler 内での型推論さえも可能になりました。それ以降、ひとつ前の書き直しからの教訓に基づきながら、コンパイラの多くの重要な部分が何度も書き直されてきました。また、その過程で [React チーム](/community/team)の多くのメンバから、多大なサポートと貢献を受けました。

この安定版リリースは、今後の多くのリリースの始まりとなるものです。コンパイラが進化と改善を続け、今後 10 年以上にわたる React の新たな基盤と時代を築くことになることを期待しています。

ここで[クイックスタート](/learn/react-compiler)に直接ジャンプしても構いませんし、続けて以下の React Conf 2025 のハイライトを読んでいただいても構いません。

<DeepDive>

#### React Compiler の動作の仕組み {/*how-does-react-compiler-work*/}

React Compiler は、自動メモ化を通じてコンポーネントとフックを最適化する最適化コンパイラです。現在は Babel プラグインとして実装されていますが、コンパイラは Babel から大部分が切り離されています。Babel が提供する抽象構文木 (AST) を独自の新しい HIR に変換し、複数のコンパイラパスを経由して、あなたの React コードのデータフローと可変性を注意深く理解します。これにより、コンパイラはレンダーに使用される値を細かくメモ化でき、手動でのメモ化では不可能な条件付きのメモ化も可能になります。

```js {8}
import { use } from 'react';

export default function ThemeProvider(props) {
  if (!props.children) {
    return null;
  }
  // The compiler can still memoize code after a conditional return
  const theme = mergeTheme(props.theme, use(ThemeContext));
  return (
    <ThemeContext value={theme}>
      {props.children}
    </ThemeContext>
  );
}
```
_この例を [React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEwBUYCBAvgQGYwQYEDkMCAhnHowNwA6AdvwQAPHPgIATBNVZQANoWpQ+HNBD4EAKgAsEGBAAU6ANzSSYACix0sYAJRF+BAmmoFzAQisQbAOjha0WXEWPntgRycCFjxYdT45WV51Sgi4NTBCPB09AgBeAj0YAHMEbV0ES2swHyzygBoSMnMyvQBhNTxhPFtbJKdo2LcIpwAeFoR2vk6hQiNWWSgEXOBavQoAPmHI4C9ff0DghD4KLZGAenHJ6bxN5N7+ChA6kDS+ajQilHRsXEyATyw5GI+gWRTQfAA8lg8Ko+GBKDQ6AxGAAjVgohCyAC0WFB4KxLHYeCxaWwgQQMDO4jQGW4-H45nCyTOZ1JWECrBhagAshBJMgCDwQPNZEKHgQwJyae8EPCQVAwZDobC7FwnuAtBAAO4ASSmFL48zAKGksjIFCAA) で確認する_

自動メモ化に加え、React Compiler にはあなたの React コードに対して実行される検証パスも含まれています。これは [React のルール](/reference/rules)をエンコードしたものであり、コンパイラのデータフローおよびミュータビリティに関する理解を用いて、React のルールにに違反している箇所に関する診断情報を提供します。この情報は主に `eslint-plugin-react-hooks` を通じて提供され、しばしば React コード内に隠れている潜在的なバグを明らかにしてくれます。

コンパイラがどのようにコードを最適化するかについてさらに詳しく知るには、[Playground](https://playground.react.dev) を参照してください。

</DeepDive>

## 今すぐ React Compiler を使用する {/*use-react-compiler-today*/}
コンパイラをインストールするには以下のようにします。

npm
<TerminalBlock>
{`npm install --save-dev --save-exact babel-plugin-react-compiler@latest`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev --exact babel-plugin-react-compiler@latest`}
</TerminalBlock>

この安定版リリースの一環として、React Compiler をプロジェクトに追加しやすくするための作業や、コンパイラがメモ化を行う方法に関しての最適化を行ってきました。React Compiler はオプショナルチェーンをサポートし、配列の添字を依存値として利用できるようになりました。これらの改善により、最終的な再レンダーが減少してよりレスポンシブな UI が実現される一方で、開発者が自然で宣言的なコードを書き続けることができます。

コンパイラの使い方に関する詳細は[ドキュメント](/learn/react-compiler)を参照してください。

## プロダクションで得られている成果 {/*react-compiler-at-meta*/}
[コンパイラはすでに Meta Quest Store などのアプリで利用されています](https://youtu.be/lyEKhv8-3n0?t=3002)。初回ロードとページ間ナビゲーションが最大 12% 改善され、一部のユーザ操作は 2.5 倍以上高速になりました。これらの改善があってもメモリ使用量は不変です。環境によって効果は異なるかもしれませんが、あなたのアプリでもコンパイラを試し、同様のパフォーマンス向上があるか確認することをお勧めします。

## 後方互換性 {/*backwards-compatibility*/}
Beta 版の発表で述べたとおり、React Compiler は React 17 以降と互換性があります。まだ React 19 を使用していない場合でも、コンパイラ設定で最小ターゲットを指定し、`react-compiler-runtime` を依存ライブラリとして追加することで React Compiler を使用できます。これに関するドキュメントは[こちら](/reference/react-compiler/target#targeting-react-17-or-18)を参照してください。

## コンパイラ駆動のリンタで React のルールを強制する {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
React Compiler には、[React のルール](/reference/rules)に違反したコードを特定するための ESLint ルールが含まれています。リンタはコンパイラの導入なしに動作するため、eslint-plugin-react-hooks をアップグレードするリスクはありません。今すぐすべての人がアップグレードすることをお勧めします。

すでに `eslint-plugin-react-compiler` をインストールしている場合は、それを削除して `eslint-plugin-react-hooks@latest` を使用できるようになりました。この改善に貢献していただいた [@michaelfaith](https://bsky.app/profile/michael.faith) に感謝します！

インストールするには以下のようにします。

npm
<TerminalBlock>
{`npm install --save-dev eslint-plugin-react-hooks@latest`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev eslint-plugin-react-hooks@latest`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev eslint-plugin-react-hooks@latest`}
</TerminalBlock>

```js {6}
// eslint.config.js (Flat Config)
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  reactHooks.configs.flat.recommended,
]);
```

```js {3}
// eslintrc.json (Legacy Config)
{
  "extends": ["plugin:react-hooks/recommended"],
  // ...
}
```

React Compiler ルールを有効にするには、`recommended` プリセットを使用することをお勧めします。詳しい手順については [README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md) も確認してください。以下は、React Conf で紹介したいくつかの例です。

- [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) でレンダーループを引き起こす `setState` パターンをキャッチする。
- [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) でエフェクト内の高コストな処理にフラグを立てる。
- [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) でレンダー中の安全でない ref アクセスを防止する。

## useMemo、useCallback、React.memo をどうすべきか？ {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}
デフォルトでは、React Compiler はコードの分析結果とヒューリスティックに基づいてコードをメモ化します。ほとんどの場合このメモ化は、あなたが書くであろうものと同等か、それ以上に正確です。そして上述のように、コンパイラは早期リターン後などの、`useMemo`/`useCallback` が使用できない場面でもメモ化を行えます。

ただし、場合によっては開発者がメモ化をより細かく制御する必要があるかもしれません。`useMemo` と `useCallback` フックは、React Compiler と併用して、どの値をメモ化するかを制御するための避難ハッチ (escape hatch) として使用し続けることができます。一般的なユースケースは、メモ化された値がエフェクトの依存値として使用される場合で、依存値が実質的に変化しないならエフェクトが繰り返し発火しないようにする、というものです。

新しいコードにおいては、メモ化をコンパイラに任せ、詳細な制御が必要な場合に `useMemo`/`useCallback` を使用することをお勧めします。

既存のコードの場合は、既存のメモ化をそのまま残すか（削除するとコンパイル出力が変わる可能性があります）、メモ化を削除する前に慎重にテストすることをお勧めします。

## 新しいアプリでは React Compiler の利用を推奨 {/*new-apps-should-use-react-compiler*/}
Expo、Vite、Next.js のチームと提携し、新規アプリ作成時のフローにコンパイラを追加しました。

[Expo SDK 54](https://docs.expo.dev/guides/react-compiler/) 以降では、デフォルトでコンパイラが有効になっているため、新しいアプリが最初から自動的にコンパイラを活用できるようになります。

<TerminalBlock>
{`npx create-expo-app@latest`}
</TerminalBlock>

[Vite](https://vite.dev/guide/) および [Next.js](https://nextjs.org/docs/app/api-reference/cli/create-next-app) のユーザは、`create-vite` および `create-next-app` でコンパイラが有効化されたテンプレートを選択できます。

<TerminalBlock>
{`npm create vite@latest`}
</TerminalBlock>

<br />

<TerminalBlock>
{`npx create-next-app@latest`}
</TerminalBlock>

## React Compiler を段階的に採用する {/*adopt-react-compiler-incrementally*/}
既存のアプリケーションをメンテナンスしている場合は、自分のペースでコンパイラを展開できます。新しく公開したステップバイステップの[段階的採用ガイド](/learn/react-compiler/incremental-adoption)では、自信を持ってコンパイラを有効化できるようにするためのゲーティング戦略、互換性チェック、ロールアウトツールについて説明しています。

## swc サポート（実験的） {/*swc-support-experimental*/}
React Compiler は、Babel、Vite、Rsbuild など[様々なビルドツール](/learn/react-compiler#installation)にインストールできます。

これらのツールに加えて、[swc](https://swc.rs/) チームの Kang Dongyoon ([@kdy1dev](https://x.com/kdy1dev)) と協力して、React Compiler を swc プラグインとして追加サポートする作業を進めてきました。この作業はまだ完了していませんが、[Next.js アプリで React Compiler を有効にした場合](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)、Next.js のビルドパフォーマンスが大幅に向上するはずです。

最高のビルドパフォーマンスを得るために、Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 以降を使用することをお勧めします。

Vite ユーザは、引き続き [vite-plugin-react](https://github.com/vitejs/vite-plugin-react) を使用し、[Babel プラグイン](/learn/react-compiler/installation#vite)として追加することでコンパイラを有効化できます。また、[oxc](https://oxc.rs/) チームと協力して[コンパイラのサポートを追加](https://github.com/oxc-project/oxc/issues/10048)する作業も進めています。[rolldown](https://github.com/rolldown/rolldown) が正式にリリースされて Vite でサポートされ次第、また oxc に React Compiler のサポートが追加され次第、ドキュメントを更新して移行方法に関する情報を公開する予定です。

## React Compiler のアップグレード {/*upgrading-react-compiler*/}
React Compiler は、適用される自動メモ化が厳密にパフォーマンスのためのものである場合に最も効果を発揮します。将来のバージョンのコンパイラでは、メモ化の適用方法が変更される可能性があります。例えば、より細かく正確になる可能性があります。

ただし、プロダクトコードは JavaScript では必ずしも静的に検出できない形で [React のルール](/reference/rules)に違反することがあるため、メモ化を変更することで予期しない結果が生じることがあります。例えば、メモ化済みの値がコンポーネントツリーのどこかで `useEffect` の依存値として使用されているかもしれません。このような値のメモ化の有無や挙動が変化することで、対応する `useEffect` の実行が過剰あるいは過少になる可能性があるのです。[useEffect は同期のためだけに使用する](/learn/synchronizing-with-effects)ことを推奨していますが、あなたのコードベースには、特定の値の変更にのみ反応する必要があるエフェクトなど、他のユースケースのための useEffect が含まれているかもしれません。

言い換えれば、メモ化の挙動が変われば、まれな状況においては予期しない動作を引き起こす可能性があるということです。このため、React のルールに従い、アプリの end-to-end テストを継続的に行うことをお勧めします。これにより、コンパイラを自信を持ってアップグレードし、問題を引き起こす可能性のある React のルール違反を特定できます。

十分なテストカバレッジがない場合は、コンパイラを特定のバージョン（例：`1.0.0`）に固定し、SemVer の範囲指定（例：`^1.0.0`）を用いないことをお勧めします。これを行うには、コンパイラをアップグレードする際に `--save-exact` (npm/pnpm) または `--exact` フラグ (yarn) を渡します。その後のコンパイラのアップグレードは、アプリが期待通りに動作することを確認しながら、手動で行うようにしてください。

---

このポストのレビューと編集をしてくれた [Jason Bonta](https://x.com/someextent)、[Jimmy Lai](https://x.com/feedthejim)、[Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev)、[Dan Abramov](https://bsky.app/profile/danabra.mov) に感謝します。
