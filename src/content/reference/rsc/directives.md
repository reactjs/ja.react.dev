---
<<<<<<< HEAD
title: "ディレクティブ"
canary: true
=======
title: Directives
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04
---

<RSC>

<<<<<<< HEAD
これらのディレクティブは、[React Server Components を使用している](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)場合や、それらと互換性のあるライブラリを構築している場合にのみ必要です。
=======
Directives are for use in [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04

</RSC>

<Intro>

ディレクティブによって、[React Server Components 互換バンドラ](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)に指示を与えます。

</Intro>

---

## ソースコードディレクティブ {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) によりどのコードがクライアント上で実行されるべきかマークします。
* [`'use server'`](/reference/rsc/use-server) によりクライアント側のコードから呼び出すことができるサーバサイド関数をマークします。
