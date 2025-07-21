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
Directives provide instructions to [bundlers compatible with React Server Components](/learn/creating-a-react-app#full-stack-frameworks).
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

</Intro>

---

## ソースコードディレクティブ {/*source-code-directives*/}

* [`'use client'`](/reference/rsc/use-client) によりどのコードがクライアント上で実行されるべきかマークします。
* [`'use server'`](/reference/rsc/use-server) によりクライアント側のコードから呼び出すことができるサーバサイド関数をマークします。
