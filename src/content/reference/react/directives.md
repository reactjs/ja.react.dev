---
title: "ディレクティブ"
---

<Intro>

React は、[React Server Components 互換バンドラ](/learn/start-a-new-react-project#bleeding-edge-react-frameworks)に指示を与えるために、以下の 2 つのディレクティブを使用します。

</Intro>

---

## ソースコードディレクティブ {/*source-code-directives*/}

* [`'use client'`](/reference/react/use-client) は、クライアント上で実行されるコンポーネントが書かれたソースファイルをマークします。
* [`'use server'`](/reference/react/use-server) は、クライアント側のコードから呼び出すことができるサーバサイド関数をマークします。