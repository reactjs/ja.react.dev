---
title: "'use server'"
canary: true
---

<Canary>

`'use server'` は、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。

</Canary>


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

* `'use server'` でマークされた関数に渡される引数はクライアントで完全に制御可能です。セキュリティのため、引数を常に信頼できない入力として扱い、適切にバリデーションやエスケープを行うことを忘れないでください。
* クライアント側とサーバ側のコードを同じファイルに混在させることによる混乱を避けるため、`'use server'` はサーバ側のファイルでのみ使用できます。結果として得られる関数は、props を通じてクライアントコンポーネントに渡すことができます。
* 内部で用いられるネットワーク呼び出しは常に非同期であるため、`'use server'` は非同期関数でのみ使用できます。
* `'use server'` のようなディレクティブは、関数やファイルの冒頭部分で、他のコード（インポートを含む）より上になければなりません（ただしコメントはディレクティブの上に記載できます）。シングルクォートまたはダブルクォートで書く必要があり、バックティックは使えません。（`'use xyz'` というディレクティブの形式は `useXyz()` というフックの命名規則に多少似ていますが、これは偶然です。）

## 使用法 {/*usage*/}

<Wip>
This section is a work in progress. 

<<<<<<< HEAD
このセクションは未完成です。[Next.js の Server Components についてのドキュメント](https://beta.nextjs.org/docs/rendering/server-and-client-components)も参照してください。

=======
This API can be used in any framework that supports React Server Components. You may find additional documentation from them.
* [Next.js documentation](https://nextjs.org/docs/getting-started/react-essentials)
* More coming soon
>>>>>>> 3189529259e89240a88c05680849ce4a8c454ed2
</Wip>