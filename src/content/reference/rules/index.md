---
title: React のルール
---

<Intro>
様々な概念を表現する方法がプログラミング言語によってそれぞれ異なるように、React にも、理解しやすい方法でパターンを表現し高品質なアプリケーションを産み出すための慣用的な記法、ないしルールが存在します。
</Intro>

<InlineToc />

---

<Note>
React で UI を表現する方法についてさらに学びたい場合は、[React の流儀](/learn/thinking-in-react)を読むことをお勧めします。
</Note>

このセクションでは、自然な React コードを書くために従うべきルールを説明します。自然な React コードを書くことで、安全で整理されており、組み合わせ可能なアプリケーションを作成することができます。以下に挙げる特性により、アプリは変更に対して頑健になり、他の開発者やライブラリやツールと連携しやすくなります。

以下のルールは **React のルール**として知られています。これらを守っていないならアプリにバグがある可能性が高い、という意味で、これらは単なるガイドラインではなくルールです。またこれらを守らない場合、あなたのコードは不自然で、理解や推測が難しいものになるでしょう。

React のルールを守るため、React の [ESLint プラグイン](https://www.npmjs.com/package/eslint-plugin-react-hooks) と [Strict Mode](/reference/react/StrictMode) を併用して利用することを強くお勧めします。React のルールに従うことにより、バグを見つけて対処し、アプリケーションを保守可能に保つことができます。

---

## コンポーネントとフックを純粋に保つ {/*components-and-hooks-must-be-pure*/}

[コンポーネントとフックを純粋に保つこと](/reference/rules/components-and-hooks-must-be-pure)は、アプリを予測可能にし、デバッグしやすくし、React がコードを自動的に最適化できるようにするための、React の重要なルールです。

* [コンポーネントとフックを冪等にする](/reference/rules/components-and-hooks-must-be-pure#components-and-hooks-must-be-idempotent) - React コンポーネントは、入力（props、state、およびコンテクスト）に対して常に同じ出力を返すことが前提となっています。
* [副作用はレンダーの外で実行する](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) - 副作用はレンダー内で実行するべきではありません。React は最適なユーザ体験を実現するために複数回コンポーネントをレンダーすることがあるからです。
* [props と state はイミュータブル](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) - コンポーネントの props と state は、単一のレンダー内においては不変のスナップショットです。直接書き換えてはいけません。
* [フックの引数と返り値はイミュータブル](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) - 一度フックに値を渡したならそれを書き換えてはいけません。JSX の props と同様、フックに渡された値はイミュータブルになります。
* [JSX に渡された後の値はイミュータブル](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) - JSX で使用した後に値を書き換えてはいけません。書き換えのロジックは JSX を作成する前に行います。

---

## コンポーネントやフックを呼び出すのは React {/*react-calls-components-and-hooks*/}

[ユーザ体験を最適化するために必要に応じてコンポーネントやフックを呼び出すというのは React 自身の責務です](/reference/rules/react-calls-components-and-hooks)。React は宣言型 (declarative) です。あなたは何 (what) をレンダーしたいのかだけを React に伝え、それをどうやって (how) ユーザにうまく表示するのかについては React が考えます。

* [コンポーネント関数を直接呼び出さない](/reference/rules/react-calls-components-and-hooks#never-call-component-functions-directly) – コンポーネントは JSX 内でのみ使用します。通常の関数として呼び出してはいけません。
* [フックを通常の値として取り回さない](/reference/rules/react-calls-components-and-hooks#never-pass-around-hooks-as-regular-values) – フックはコンポーネント内で呼び出すだけにします。通常の値のようにコード内で取り回してはいけません。

---

## フックのルール {/*rules-of-hooks*/}

フックは再利用可能な UI ロジックを表す JavaScript の関数として定義されており、呼び出せる場所に関する制約があります。フックを使用する際には、[フックのルール](/reference/rules/rules-of-hooks)に従う必要があります。

* [フックはトップレベルでのみ呼び出す](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – ループ、条件分岐、ネストされた関数の内部でフックを呼び出してはいけません。代わりに、フックは常に React 関数のトップレベルで、早期 return を行う前に行います。
* [フックは React の関数からのみ呼び出す](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – 通常の JavaScript 関数からフックを呼び出してはいけません。

