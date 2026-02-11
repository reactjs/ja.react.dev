---
title: "React Server Components におけるサービス拒否攻撃とソースコード露出"
author: The React Team
date: 2025/12/11
description: セキュリティ研究者が先週の重大な脆弱性に対するパッチを検証する過程で、React Server Components における 2 つの脆弱性を追加で発見し、開示しました。高深刻度のサービス拒否攻撃 (CVE-2025-55184) と、中程度の深刻度のソースコード露出 (CVE-2025-55183) です。


---

December 11, 2025 by [The React Team](/community/team)

_Updated January 26, 2026._

---

<Intro>

セキュリティ研究者が先週の重大な脆弱性に対するパッチをテストする過程で、React Server Components における 2 つの脆弱性を追加で発見し、開示しました。

**これらの新しい脆弱性はリモートコード実行を許すものではありません**。React2Shell に対するパッチはリモートコード実行の悪用を防止するために引き続き有効です。

</Intro>

---

新しい脆弱性は以下のように公開されています。

- **Denial of Service - High Severity**: [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184), [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779), and [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864) (CVSS 7.5)
- **Source Code Exposure - Medium Severity**: [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) (CVSS 5.3)

新たに開示された脆弱性の深刻さを鑑み、直ちにアップグレードすることを推奨します。

<Note>

#### 以前に公開されたパッチには脆弱性があります {/*the-patches-published-earlier-are-vulnerable*/}

以前の脆弱性対応のために既にアップデートを行っている場合でも、再度アップデートが必要です。

19.0.3、19.1.4、および 19.2.3 にアップデート済みの場合でも、[これらは不完全](#additional-fix-published)であり、再度アップデートする必要があります。

アップグレード手順については、[前回記事のガイド](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions)を参照してください。

-----

_Updated January 26, 2026._

</Note>

これらの脆弱性の詳細については、修正のロールアウトが完了した後に提供される予定です。

## 直ちに対応を {/*immediate-action-required*/}

これらの脆弱性は、[CVE-2025-55182](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) と同じパッケージおよびバージョンに存在します。

以下のパッケージの 19.0.0、19.0.1、19.0.2、19.0.3、19.1.0、19.1.1、19.1.2、19.1.3、19.2.0、19.2.1、19.2.2、および 19.2.3 が該当します。

* [react-server-dom-webpack](https://www.npmjs.com/package/react-server-dom-webpack)
* [react-server-dom-parcel](https://www.npmjs.com/package/react-server-dom-parcel)
* [react-server-dom-turbopack](https://www.npmjs.com/package/react-server-dom-turbopack?activeTab=readme)

修正はバージョン 19.0.4、19.1.5、および 19.2.4 にバックポートされています。上記のパッケージを使用している場合は、直ちに修正済みバージョンのいずれかにアップグレードしてください。

以前と同様、アプリの React コードがサーバを使用していない場合、アプリはこれらの脆弱性の影響を受けません。アプリが React Server Components をサポートするフレームワーク、バンドラ、またはバンドラプラグインを使用していない場合、アプリはこれらの脆弱性の影響を受けません。

<Note>

#### 重大な CVE の後に別の脆弱性報告が続くことはよくあります {/*its-common-for-critical-cves-to-uncover-followup-vulnerabilities*/}

重大な脆弱性が開示されると、研究者は隣接するコードパスを精査し、初期の修正をバイパスする方法がないかテストし、類似の悪用手段を見つけようとします。

これは JavaScript だけでなく、業界全体で見られるパターンです。たとえば [Log4Shell](https://nvd.nist.gov/vuln/detail/cve-2021-44228) の後にも、コミュニティがオリジナルの修正を検証する中で追加の CVE ([1](https://nvd.nist.gov/vuln/detail/cve-2021-45046), [2](https://nvd.nist.gov/vuln/detail/cve-2021-45105)) が報告されました。

開示が続くとフラストレーションを感じるかもしれませんが、一般的には健全な対応サイクルの兆候です。

</Note>

### 影響を受けるフレームワークとバンドラ {/*affected-frameworks-and-bundlers*/}

一部の React フレームワークやバンドラが、脆弱性のある React パッケージに依存しているか、peer dependency として依存しているか、あるいはそれらを含んでいました。影響を受ける React フレームワークやバンドラは以下の通りです：[next](https://www.npmjs.com/package/next)、[react-router](https://www.npmjs.com/package/react-router)、[waku](https://www.npmjs.com/package/waku)、[@parcel/rsc](https://www.npmjs.com/package/@parcel/rsc)、[@vite/rsc-plugin](https://www.npmjs.com/package/@vitejs/plugin-rsc)、[rwsdk](https://www.npmjs.com/package/rwsdk)

アップグレード方法について、[前回の記事の手順](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions)を参照してください。

### ホスティングプロバイダによる緩和策 {/*hosting-provider-mitigations*/}

以前と同様、我々は多くのホスティングプロバイダと協力し、一時的な緩和策 (mitigation) を適用しています。

ただしアプリの保護のためにこれらに依存しないでください。引き続き直ちにアップデートを適用するべきです。

### React Native {/*react-native*/}

モノレポや `react-dom` を使用していない React Native ユーザの場合、`react` バージョンは `package.json` で固定されているはずですので、追加の手順は必要ありません。

モノレポで React Native を使用している場合は、以下のパッケージがインストールされている場合に*それらのみ*を更新してください。

- `react-server-dom-webpack`
- `react-server-dom-parcel`
- `react-server-dom-turbopack`

これはセキュリティ上の問題を緩和するために必要ですが、`react` および `react-dom` を更新する必要はなく、そのため React Native でのバージョン不一致エラーが発生することはありません。

詳細については[この issue](https://github.com/facebook/react-native/issues/54772#issuecomment-3617929832) を参照してください。

---

## 高深刻度：複数のサービス拒否攻撃 {/*high-severity-multiple-denial-of-service*/}

**CVE**: [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864)
**Base Score**: 7.5 (High)
**Date**: January 26, 2025

セキュリティ研究者により、React Server Components に追加の DoS 脆弱性が残っていることが発見されました。

これらの脆弱性は、特別に細工された HTTP リクエストをサーバ関数 (Server Function) エンドポイントに送信することで引き起こされます。実行される脆弱なコード経路、アプリケーション設定、およびアプリケーションコードに応じて、サーバクラッシュ、メモリ不足例外、または過剰な CPU 使用率につながる可能性があります。

1 月 26 日に公開されたパッチは、これらの DoS 脆弱性を緩和します。

<Note>

#### 追加の修正が公開されました {/*additional-fix-published*/}

[CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) の DoS に対処する元の修正は不完全でした。

これにより以前のバージョンが脆弱な状態のままでした。バージョン 19.0.4、19.1.5、19.2.4 は安全です。

-----

_Updated January 26, 2026._

</Note>

---

## 高深刻度：サービス拒否攻撃 {/*high-severity-denial-of-service*/}

**CVE**: [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) および [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779)
**Base Score**: 7.5 (High)

セキュリティ研究者は、悪意のある HTTP リクエストを作成して任意のサーバ関数エンドポイントに対して送信することで、React がそれをデシリアライズする際に、サーバプロセスをハングさせて CPU を消費する無限ループを引き起こすことができることを発見しました。アプリが React のサーバ関数のエンドポイントを実装していない場合でも、React Server Components をサポートしている場合は脆弱性の影響を受ける可能性があります。

これにより、攻撃者がユーザによる製品へのアクセスを不能にし、サーバ環境のパフォーマンスに影響を与えうる手段が生じます。

本日公開されたパッチは、無限ループを防ぐことでこの問題を緩和します。

## 中深刻度：ソースコード露出 {/*low-severity-source-code-exposure*/}

**CVE**: [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183)
**Base Score**: 5.3 (Medium)

セキュリティ研究者は、脆弱なサーバ関数に送信された悪意のある HTTP リクエストが、安全でない方法で任意のサーバ関数のソースコードを返す可能性があることを発見しました。悪用には、明示的または暗黙的に引数の文字列化を行い露出するサーバ関数の存在が必要です。

```javascript
'use server';

export async function serverFunction(name) {
  const conn = db.createConnection('SECRET KEY');
  const user = await conn.createUser(name); // implicitly stringified, leaked in db

  return {
   id: user.id,
   message: `Hello, ${name}!` // explicitly stringified, leaked in reply
  }}
```

攻撃者は以下のような情報を漏洩させる可能性があります。

```txt
0:{"a":"$@1","f":"","b":"Wy43RxUKdxmr5iuBzJ1pN"}
1:{"id":"tva1sfodwq","message":"Hello, async function(a){console.log(\"serverFunction\");let b=i.createConnection(\"SECRET KEY\");return{id:(await b.createUser(a)).id,message:`Hello, ${a}!`}}!"}
```

本日公開されたパッチは、サーバ関数のソースコードが文字列化されるのを防ぎます。

<Note>

#### 漏洩可能性があるのはソースコード内の秘密情報のみ {/*only-secrets-in-source-code-may-be-exposed*/}

ソースコードにハードコードされた秘密情報は漏洩の可能性がありますが、`process.env.SECRET` などのランタイムシークレットは影響を受けません。

漏洩されるコードの範囲は、サーバ関数内のコードに限定されますが、バンドラが行うインライン化の程度によっては他の関数が含まれる可能性があります。

必ず本番バンドルに対して検証を行ってください。

</Note>

---

## タイムライン {/*timeline*/}
* **12 月 3 日**：[Andrew MacPherson](https://github.com/AndrewMohawk) 氏が Vercel および [Meta Bug Bounty](https://bugbounty.meta.com/) に漏洩の問題を報告。
* **12 月 4 日**：[RyotaK](https://ryotak.net) 氏が [Meta Bug Bounty](https://bugbounty.meta.com/) に DoS 問題を初期報告。
* **12 月 6 日**：React チームが両方の問題を確認し、調査を開始。
* **12 月 7 日**：初期の修正が作成され、React チームが新しいパッチの検証と計画を開始。
* **12 月 8 日**：影響を受けるホスティングプロバイダとオープンソースプロジェクトに通知。
* **12 月 10 日**：ホスティングプロバイダの緩和策が導入、パッチの検証が完了。
* **12 月 11 日**：Shinsaku Nomura 氏が [Meta Bug Bounty](https://bugbounty.meta.com/) に追加の DoS を報告。
* **12 月 11 日**：パッチが公開され、[CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) および [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) として一般公開。
* **12 月 11 日**：不足していた DoS のケースが内部で発見され、修正が適用され [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779) として一般公開。
* **1 月 26 日**：追加の DoS ケースが発見され、修正が適用され [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864) として一般公開。
---

## 謝辞 {/*attribution*/}

ソースコード漏洩を報告してくださった [Andrew MacPherson (AndrewMohawk)](https://github.com/AndrewMohawk) 氏、サービス拒否攻撃の脆弱性を報告してくださった GMO Flatt Security Inc の [RyotaK](https://ryotak.net) 氏および株式会社ビットフォレストの Shinsaku Nomura 氏に感謝します。追加の DoS 脆弱性を報告してくださった [Winfunc Research](https://winfunc.com) の [Mufeed VH](https://x.com/mufeedvh) 氏、[Joachim Viide](https://jviide.iki.fi) 氏、[GMO Flatt Security Inc](https://flatt.tech/en/) の [RyotaK](https://ryotak.net) 氏、および Tencent Security YUNDING LAB の Xiangwei Zhang 氏に感謝します。
