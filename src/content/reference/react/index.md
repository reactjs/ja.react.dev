---
title: React リファレンス概要
---

<Intro>

このセクションは React で開発をする際の詳細なリファレンスドキュメントです。React の使い方の概要については [Learn](/learn) セクションをご覧ください。

</Intro>

React リファレンスは機能別にいくつかのサブセクションに分かれています。

## React {/*react*/}

プログラムから利用する React の機能です。

* [フック](/reference/react/hooks) - コンポーネント内から使用する様々な React の機能
* [コンポーネント](/reference/react/components) - JSX 内で用いる組み込みコンポーネント
* [API](/reference/react/apis) - コンポーネントの定義に用いる API
* [ディレクティブ](/reference/rsc/directives) - React Server Components 互換のバンドラに与えるための指示情報

## React DOM {/*react-dom*/}

React DOM には（ブラウザの DOM 環境で動作する）ウェブアプリケーションでのみ用いられる機能が含まれます。以下のセクションに分かれています。

* [フック](/reference/react-dom/hooks) - ブラウザの DOM 環境で実行されるウェブアプリケーションのためのフック
* [コンポーネント](/reference/react-dom/components) - React がサポートする組み込みの HTML および SVG コンポーネント
* [API](/reference/react-dom) - ウェブアプリケーションでのみ用いられる `react-dom` パッケージのメソッド
* [クライアント API](/reference/react-dom/client) - クライアント（ブラウザ）で React コンポーネントをレンダーするための `react-dom/client` API 群
* [サーバ API](/reference/react-dom/server) - サーバで React コンポーネントを HTML にレンダーするための `react-dom/server` API 群

## React Compiler {/*react-compiler*/}

React Compiler はビルド時に使用する最適化ツールであり、あなたの React コンポーネントや値に自動的にメモ化を適用します。

* [Configuration](/reference/react-compiler/configuration) - React Compiler の設定オプション
* [Directives](/reference/react-compiler/directives) - コンパイル動作を制御するための関数レベルのディレクティブ
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - コンパイル済みのライブラリコードをリリースする際のガイド

## React フック用の ESLint プラグイン {/*eslint-plugin-react-hooks*/}

[React フック用の ESLint プラグイン](/reference/eslint-plugin-react-hooks) を用いることで React のルールを強制できます。

* [リント](/reference/eslint-plugin-react-hooks) - 個々のリントルールについての実例つきドキュメント

## React のルール {/*rules-of-react*/}

React には、理解しやすい方法でパターンを表現し高品質なアプリケーションを産み出すための慣用的な記法、ないしルールが存在します。

* [コンポーネントとフックを純粋に保つ](/reference/rules/components-and-hooks-must-be-pure) – これらを純粋に保つことにより、コードの理解やデバッグが容易になり、React がコンポーネントやフックを自動的に正しく最適化できるようになります。
* [コンポーネントやフックを呼び出すのは React](/reference/rules/react-calls-components-and-hooks) – ユーザ体験を最適化するために必要に応じてコンポーネントやフックを呼び出すというのは React 自身の責務です。
* [フックのルール](/reference/rules/rules-of-hooks) – フックは再利用可能な UI ロジックを表す JavaScript の関数として定義されており、呼び出せる場所に関する制約があります。

## レガシー API {/*legacy-apis*/}

* [レガシー API](/reference/react/legacy) - `react` パッケージからエクスポートされているが新しいコードでは使用が推奨されないもの
