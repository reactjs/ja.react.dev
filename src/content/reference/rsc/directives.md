---
title: "ディレクティブ"
---

<RSC>

<<<<<<< HEAD
ディレクティブは [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 用の機能です。
=======
Directives are for use in [React Server Components](/reference/rsc/server-components).
>>>>>>> 3ee3a60a1bcc687c0b87039a3a6582e3b1d6887c

</RSC>

<Intro>

ディレクティブによって、[React Server Components 互換バンドラ](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)に指示を与えます。

</Intro>

---

## ソースコードディレクティブ {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) によりどのコードがクライアント上で実行されるべきかマークします。
* [`'use server'`](/reference/rsc/use-server) によりクライアント側のコードから呼び出すことができるサーバサイド関数をマークします。
