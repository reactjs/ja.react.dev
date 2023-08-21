---
title: "'use server'"
canary: true
---

<Canary>

<<<<<<< HEAD
このセクションは未完成です。

これらのディレクティブは、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを作成している場合にのみ必要です。

</Wip>
=======
`'use server'` is needed only if you're [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) or building a library compatible with them.

</Canary>
>>>>>>> 842c24c9aefaa60b7ae9b46b002bd1b3cf4d31f3


<Intro>

`'use server'` は、クライアントサイドのコードから呼び出し可能なサーバサイドの関数をマークします。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `'use server'` {/*use-server*/}

非同期 (async) 関数の冒頭に `'use server';` を追加することで、その関数がクライアントから実行できることをマークします。

```js
async function addToCart(data) {
  'use server';
  // ...
}

// <ProductDetailPage addToCart={addToCart} />
```

このような関数は、クライアントに渡すことができます。この関数がクライアント側で呼び出されると、渡された引数がシリアライズされ、それを含んだネットワークリクエストをサーバに送信します。このサーバ関数が値を返す場合、シリアライズされてクライアントに返されます。

または、ファイルの最上部に `'use server';` を追加すると、そのファイル内のすべてのエクスポートが、クライアントコンポーネントファイルを含むあらゆる場所で使用できる非同期サーバ関数である、とマークします。

#### 注意点 {/*caveats*/}

<<<<<<< HEAD
* `'use server'` でマークされた関数に渡される引数はクライアントで完全に制御可能です。セキュリティのため、引数を常に信頼できない入力として扱い、適切にバリデーションやエスケープを行うことを忘れないでください。
* クライアント側とサーバ側のコードを同じファイルに混在させることによる混乱を避けるため、`'use server'` はサーバ側のファイルでのみ使用できます。結果として得られる関数は、props を通じてクライアントコンポーネントに渡すことができます。
* 内部で用いられるネットワーク呼び出しは常に非同期であるため、`'use server'` は非同期関数でのみ使用できます。
* `'use server'` のようなディレクティブは、関数やファイルの冒頭部分で、他のコード（インポートを含む）より上になければなりません（ただしコメントはディレクティブの上に記載できます）。シングルクォートまたはダブルクォートで書く必要があり、バックティックは使えません。（`'use xyz'` というディレクティブの形式は `useXyz()` というフックの命名規則に多少似ていますが、これは偶然です。）
=======
* Remember that parameters to functions marked with `'use server'` are fully client-controlled. For security, always treat them as untrusted input, making sure to validate and escape the arguments as appropriate.
* To avoid the confusion that might result from mixing client- and server-side code in the same file, `'use server'` can only be used in server-side files; the resulting functions can be passed to client components through props.
* Because the underlying network calls are always asynchronous, `'use server'` can be used only on async functions.
* Directives like `'use server'` must be at the very beginning of their function or file, above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks. (The `'use xyz'` directive format somewhat resembles the `useXyz()` Hook naming convention, but the similarity is coincidental.)

## Usage {/*usage*/}

<Wip>

This section is incomplete. See also the [Next.js documentation for Server Components](https://beta.nextjs.org/docs/rendering/server-and-client-components).

</Wip>
>>>>>>> 842c24c9aefaa60b7ae9b46b002bd1b3cf4d31f3
