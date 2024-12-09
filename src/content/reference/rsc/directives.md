---
<<<<<<< HEAD
title: "ディレクティブ"
canary: true
=======
title: Directives
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
---

<RSC>

<<<<<<< HEAD
これらのディレクティブは、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。
=======
Directives are for use in [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

</RSC>

<Intro>

ディレクティブによって、[React Server Components 互換バンドラ](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)に指示を与えます。

</Intro>

---

## ソースコードディレクティブ {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) によりどのコードがクライアント上で実行されるべきかマークします。
* [`'use server'`](/reference/rsc/use-server) によりクライアント側のコードから呼び出すことができるサーバサイド関数をマークします。
