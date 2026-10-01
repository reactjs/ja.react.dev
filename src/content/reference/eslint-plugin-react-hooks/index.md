---
title: eslint-plugin-react-hooks
version: rc
---

<Intro>

`eslint-plugin-react-hooks` は、[React のルール](/reference/rules)を強制するための ESLint ルールを提供します。

</Intro>

このプラグインは React のルール違反をビルド時に検出し、コンポーネントやフックがコードの正しさとパフォーマンスを保つための React のルールに従っているか確認するのに役立ちます。lint ルールは、React の基本的なパターン（exhaustive-deps と rules-of-hooks）と、React Compiler が検出する問題の両方を対象とします。React Compiler の診断情報はこの ESLint プラグインによって自動的に表示されるため、アプリにコンパイラをまだ導入していない場合でも利用できます。

<Note>
コンパイラが診断情報を報告するのは、サポートされていないパターンや React のルールに違反するパターンを静的に検出できた場合です。このようなパターンを検出すると、アプリの残りの部分はコンパイルしたまま、該当するコンポーネントやフックを**自動的に**スキップします。これにより、アプリを壊さない安全な最適化を最大限に適用できます。

つまり lint に関しては、すべての違反をすぐに修正する必要はありません。自分のペースで対処することで、最適化されるコンポーネントの数を徐々に増やすことができます。
</Note>

## 推奨ルール {/*recommended*/}

以下のルールが `eslint-plugin-react-hooks` の `recommended` プリセットに含まれています。

* [`exhaustive-deps`](/reference/eslint-plugin-react-hooks/lints/exhaustive-deps) - React フックの依存配列に必要な依存値がすべて含まれているか検証
* [`rules-of-hooks`](/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) - コンポーネントとフックがフックのルールに従っているか検証
* [`component-hook-factories`](/reference/eslint-plugin-react-hooks/lints/component-hook-factories) - コンポーネントやフックを内部で定義する高階関数がないか検証
* [`config`](/reference/eslint-plugin-react-hooks/lints/config) - コンパイラの設定オプションを検証
* [`error-boundaries`](/reference/eslint-plugin-react-hooks/lints/error-boundaries) - 子コンポーネントのエラーを、エラーバウンダリではなく try/catch で処理しようとしていないか検証
* [`gating`](/reference/eslint-plugin-react-hooks/lints/gating) - ゲーティングモードの設定を検証
* [`globals`](/reference/eslint-plugin-react-hooks/lints/globals) - レンダー中にグローバル変数への代入やミューテーションを行っていないか検証
* [`immutability`](/reference/eslint-plugin-react-hooks/lints/immutability) - props、state、およびその他のイミュータブルな値をミューテーションしていないか検証
* [`incompatible-library`](/reference/eslint-plugin-react-hooks/lints/incompatible-library) - メモ化と互換性のないライブラリを使用していないか検証
* [`preserve-manual-memoization`](/reference/eslint-plugin-react-hooks/lints/preserve-manual-memoization) - 既存の手動メモ化がコンパイラによって保持されるか検証
* [`purity`](/reference/eslint-plugin-react-hooks/lints/purity) - 既知の純関数でない関数をチェックし、コンポーネントやフックが純粋であるか検証
* [`refs`](/reference/eslint-plugin-react-hooks/lints/refs) - ref が正しく使用され、レンダー中に読み書きされていないか検証
* [`set-state-in-effect`](/reference/eslint-plugin-react-hooks/lints/set-state-in-effect) - エフェクト内で setState を同期的に呼び出していないか検証
* [`set-state-in-render`](/reference/eslint-plugin-react-hooks/lints/set-state-in-render) - レンダー中に state をセットしていないか検証
* [`static-components`](/reference/eslint-plugin-react-hooks/lints/static-components) - コンポーネントが静的に作成され、レンダーのたびに再作成されていないか検証
* [`unsupported-syntax`](/reference/eslint-plugin-react-hooks/lints/unsupported-syntax) - React Compiler がサポートしていない構文を使用していないか検証
* [`use-memo`](/reference/eslint-plugin-react-hooks/lints/use-memo) - 返り値のない `useMemo` フックの使用がないか検証