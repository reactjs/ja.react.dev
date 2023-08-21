---
title: "ディレクティブ"
canary: true
---

<Canary>

これらのディレクティブは、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。

</Canary>

<Intro>

ディレクティブによって、[React Server Components 互換バンドラ](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)に指示を与えます。

</Intro>

---

## ソースコードディレクティブ {/*source-code-directives*/}

* [`'use client'`](/reference/react/use-client) は、クライアント上で実行されるコンポーネントが書かれたソースファイルをマークします。
* [`'use server'`](/reference/react/use-server) は、クライアント側のコードから呼び出すことができるサーバサイド関数をマークします。