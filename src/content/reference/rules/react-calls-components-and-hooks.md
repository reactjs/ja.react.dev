---
title: コンポーネントやフックを呼び出すのは React
---

<Intro>
ユーザ体験を最適化するために必要に応じてコンポーネントやフックを呼び出すというのは React 自身の責務です。React は宣言型 (declarative) です。あなたは*何 (what)* をレンダーしたいのかだけを React に伝え、それを*どうやって (how)* ユーザにうまく表示するのかについては React が考えます。
</Intro>

<InlineToc />

---

## コンポーネント関数を直接呼び出さない {/*never-call-component-functions-directly*/}
コンポーネントは JSX 内でのみ使用すべきです。通常の関数として呼び出してはいけません。呼び出すのは React です。

[レンダー中](/reference/rules/components-and-hooks-must-be-pure#how-does-react-run-your-code)にコンポーネント関数をいつ呼び出すかを決定する必要があるのは React です。React では、これを JSX を使用して行います。

```js {2}
function BlogPost() {
  return <Layout><Article /></Layout>; // ✅ Good: Only use components in JSX
}
```

```js {2}
function BlogPost() {
  return <Layout>{Article()}</Layout>; // 🔴 Bad: Never call them directly
}
```

コンポーネントにフックが含まれている場合、ループや条件内でコンポーネントを直接呼び出すと、[フックのルール](/reference/rules/rules-of-hooks)にいとも簡単に違反してしまいます。

React にレンダーの指揮権を与えることで、多くの利点が得られます。

* **コンポーネントが単なる関数以上のものになる**。ツリー内のコンポーネントの同一性に基づいた処理を行うフックを通じて、React は*ローカル state* などの機能を追加できます。
* **コンポーネントの型情報を差分検出処理時に利用できる**。React にコンポーネントの呼び出しを任せることで、ツリーの概念的構造について React はより多くの情報を得られます。たとえば `<Feed>` から `<Profile>` ページへとレンダーが移行するとき、React はそれらを再利用しようとせずに済みます。
* **React がユーザ体験を向上させられる**。たとえば、大きなコンポーネントツリーの再レンダーがメインスレッドをブロックしないよう、複数のコンポーネントのレンダーの合間にブラウザに一部の作業を行わせることができます。
* **より良いデバッグ体験**。ライブラリがコンポーネントのことを基本部品として認識していれば、開発中の調査のためのリッチな開発者ツールを構築できます。
* **より効率的な差分検出処理**。React は、ツリー内のどのコンポーネントを再レンダーすべきか正確に把握し、残りをスキップします。これによりアプリの動作は高速でキビキビとしたものになります。

---

## フックを通常の値として取り回さない {/*never-pass-around-hooks-as-regular-values*/}

フックはコンポーネントまたはフックの内部でのみ呼び出すべきです。通常の値のように取り回してはいけません。

フックは、コンポーネントに React の機能を加えるために使用します。常に関数として呼び出すだけにし、通常の値のように取りまわしてはいけません。これにより*ローカル・リーズニング*が可能に、すなわち開発者がそのコンポーネントだけを見てコンポーネントにできることをすべて理解できるようになります。

このルールを破ると、React はコンポーネントを自動的に最適化することができなくなります。

### フックを動的に変更しない {/*dont-dynamically-mutate-a-hook*/}

フックは可能な限り「静的」であるべきです。つまり、動的に変更してはいけません。たとえば、高階 (higher-order) フックを書くべきではありません。

```js {2}
function ChatInput() {
  const useDataWithLogging = withLogging(useData); // 🔴 Bad: don't write higher order Hooks
  const data = useDataWithLogging();
}
```

フックはイミュータブルであるべきで、動的に変更するべきではありません。フックを動的に変更する代わりに、望ましい機能を持つ静的なバージョンのフックを作成してください。

```js {2,6}
function ChatInput() {
  const data = useDataWithLogging(); // ✅ Good: Create a new version of the Hook
}

function useDataWithLogging() {
  // ... Create a new version of the Hook and inline the logic here
}
```

### フックを動的に使用しない {/*dont-dynamically-use-hooks*/}

フックを動的に使用してはいけません。例えば以下のように、フックそのものを値としてコンポーネントに渡して依存性注入を行わないようにしてください。

```js {2}
function ChatInput() {
  return <Button useData={useDataWithLogging} /> // 🔴 Bad: don't pass Hooks as props
}
```

代わりにコンポーネント内でインラインでフックをコールし、そこでロジックを処理するべきです。

```js {6}
function ChatInput() {
  return <Button />
}

function Button() {
  const data = useDataWithLogging(); // ✅ Good: Use the Hook directly
}

function useDataWithLogging() {
  // If there's any conditional logic to change the Hook's behavior, it should be inlined into
  // the Hook
}
```

こうすることで `<Button />` を理解しデバッグするのがずっと簡単になります。フックを動的に使用すると、アプリの複雑さが大幅に増し、ローカル・リーズニングを妨げ、長期的にはチームの生産性を低下させます。また、条件付きでフックを呼び出すべきではないという[フックのルール](/reference/rules/rules-of-hooks)を誤って破る可能性も高まります。テストのためにコンポーネントをモックする必要がある場合は、代わりにサーバをモックして固定データで応答する方が良いでしょう。可能であれば、end-to-end テストでアプリをテストする方が通常はより効果的です。

