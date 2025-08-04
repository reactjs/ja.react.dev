---
title: "ディレクティブ"
---

<RSC>

ディレクティブは [React Server Components](/reference/rsc/server-components) 用の機能です。

</RSC>

<Intro>

<<<<<<< HEAD
ディレクティブによって、[React Server Components 互換バンドラ](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)に指示を与えます。
=======
Directives provide instructions to [bundlers compatible with React Server Components](/learn/start-a-new-react-project#full-stack-frameworks).
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

</Intro>

---

## ソースコードディレクティブ {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) によりどのコードがクライアント上で実行されるべきかマークします。
* [`'use server'`](/reference/rsc/use-server) によりクライアント側のコードから呼び出すことができるサーバサイド関数をマークします。
