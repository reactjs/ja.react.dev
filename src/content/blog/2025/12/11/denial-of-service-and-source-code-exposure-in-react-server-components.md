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

<<<<<<< HEAD
先週の重大なセキュリティ脆弱性の対応のため既にアップデートを行っている場合でも、再度アップデートが必要です。

19.0.2、19.1.3、および 19.2.2 にアップデート済みの場合でも、[これらは不完全](#additional-fix-published)であり、再度アップデートする必要があります。
=======
If you already updated for the previous vulnerabilities, you will need to update again.

If you updated to 19.0.3, 19.1.4, and 19.2.3, [these are incomplete](#additional-fix-published), and you will need to update again.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

アップグレード手順については、[前回記事のガイド](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions)を参照してください。

-----

_Updated January 26, 2026._

</Note>

これらの脆弱性の詳細については、修正のロールアウトが完了した後に提供される予定です。

## 直ちに対応を {/*immediate-action-required*/}

これらの脆弱性は、[CVE-2025-55182](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components) と同じパッケージおよびバージョンに存在します。

<<<<<<< HEAD
以下のパッケージのバージョン 19.0.0、19.0.1、19.0.2、19.1.0、19.1.1、19.1.2、19.1.2、19.2.0、19.2.1、および 19.2.2 が該当します。
=======
This includes 19.0.0, 19.0.1, 19.0.2, 19.0.3, 19.1.0, 19.1.1, 19.1.2, 19.1.3, 19.2.0, 19.2.1, 19.2.2, and 19.2.3 of:
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

* [react-server-dom-webpack](https://www.npmjs.com/package/react-server-dom-webpack)
* [react-server-dom-parcel](https://www.npmjs.com/package/react-server-dom-parcel)
* [react-server-dom-turbopack](https://www.npmjs.com/package/react-server-dom-turbopack?activeTab=readme)

<<<<<<< HEAD
修正はバージョン 19.0.3、19.1.4、および 19.2.3 にバックポートされています。上記のパッケージを使用している場合は、直ちに修正済みバージョンのいずれかにアップグレードしてください。
=======
Fixes were backported to versions 19.0.4, 19.1.5, and 19.2.4. If you are using any of the above packages please upgrade to any of the fixed versions immediately.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

以前と同様、アプリの React コードがサーバを使用していない場合、アプリはこれらの脆弱性の影響を受けません。アプリが React Server Components をサポートするフレームワーク、バンドラ、またはバンドラプラグインを使用していない場合、アプリはこれらの脆弱性の影響を受けません。

<Note>

#### 重大な CVE の後に別の脆弱性報告が続くことはよくあります {/*its-common-for-critical-cves-to-uncover-followup-vulnerabilities*/}

重大な脆弱性が開示されると、研究者は隣接するコードパスを精査し、初期の修正をバイパスする方法がないかテストし、類似の悪用手段を見つけようとします。

これは JavaScript だけでなく、業界全体で見られるパターンです。たとえば [Log4Shell](https://nvd.nist.gov/vuln/detail/cve-2021-44228) の後にも、コミュニティがオリジナルの修正を検証する中で追加の CVE ([1](https://nvd.nist.gov/vuln/detail/cve-2021-45046), [2](https://nvd.nist.gov/vuln/detail/cve-2021-45105)) が報告されました。

開示が続くとフラストレーションを感じるかもしれませんが、一般的には健全な対応サイクルの兆候です。

</Note>

### 影響を受けるフレームワークとバンドラ {/*affected-frameworks-and-bundlers*/}

一部の React フレームワークやバンドラが、脆弱性のある React パッケージに依存しているか、peer dependency として依存しているか、あるいはそれらを含んでいました。影響を受ける React フレームワークやバンドラは以下の通りです：[next](https://www.npmjs.com/package/next)、[react-router](https://www.npmjs.com/package/react-router)、[waku](https://www.npmjs.com/package/waku)、[@parcel/rsc](https://www.npmjs.com/package/@parcel/rsc)、[@vite/rsc-plugin](https://www.npmjs.com/package/@vitejs/plugin-rsc)、[rwsdk](https://www.npmjs.com/package/rwsdk)

<<<<<<< HEAD
アップグレード方法について、[前回の記事の手順](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions)を参照してください。
=======
Please see [the instructions in the previous post](/blog/2025/12/03/critical-security-vulnerability-in-react-server-components#update-instructions) for upgrade steps.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

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

<<<<<<< HEAD
## 高深刻度：サービス拒否攻撃 {/*high-severity-denial-of-service*/}
=======
---

## High Severity: Multiple Denial of Service {/*high-severity-multiple-denial-of-service*/}

**CVEs:** [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864)
**Base Score:** 7.5 (High)
**Date**: January 26, 2025

Security researchers discovered additional DoS vulnerabilities still exist in React Server Components.

The vulnerabilities are triggered by sending specially crafted HTTP requests to Server Function endpoints, and could lead to server crashes, out-of-memory exceptions or excessive CPU usage; depending on the vulnerable code path being exercised, the application configuration and application code.

The patches published January 26th mitigate these DoS vulnerabilities.

<Note>

#### Additional fixes published {/*additional-fix-published*/}

The original fix addressing the DoS in [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) was incomplete.

This left previous versions vulnerable. Versions 19.0.4, 19.1.5, 19.2.4 are safe.

-----

_Updated January 26, 2026._

</Note>

---

## High Severity: Denial of Service {/*high-severity-denial-of-service*/}
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

**CVE**: [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) および [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779)
**Base Score**: 7.5 (High)

セキュリティ研究者は、悪意のある HTTP リクエストを作成して任意のサーバ関数 (Server Function) エンドポイントに対して送信することで、React がそれをデシリアライズする際に、サーバプロセスをハングさせて CPU を消費する無限ループを引き起こすことができることを発見しました。アプリが React のサーバ関数のエンドポイントを実装していない場合でも、React Server Components をサポートしている場合は脆弱性の影響を受ける可能性があります。

これにより、攻撃者がユーザによる製品へのアクセスを不能にし、サーバ環境のパフォーマンスに影響を与えうる手段が生じます。

本日公開されたパッチは、無限ループを防ぐことでこの問題を緩和します。

<<<<<<< HEAD
<Note>

#### 追加の修正が公開されました {/*additional-fix-published*/}

[CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184) における DoS に対処する元の修正は不完全でした。

これにより、バージョン 19.0.2、19.1.3、19.2.2 が脆弱な状態のままでした。バージョン 19.0.3、19.1.4、19.2.3 は安全です。

我々は追加のケースを修正し、脆弱なバージョンに対して [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779) を提出しました。

</Note>

## 中深刻度：ソースコード露出 {/*low-severity-source-code-exposure*/}
=======
## Medium Severity: Source Code Exposure {/*low-severity-source-code-exposure*/}
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7

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

<<<<<<< HEAD
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

=======
## Timeline {/*timeline*/}
* **December 3rd**: Leak reported to Vercel and [Meta Bug Bounty](https://bugbounty.meta.com/) by [Andrew MacPherson](https://github.com/AndrewMohawk).
* **December 4th**: Initial DoS reported to [Meta Bug Bounty](https://bugbounty.meta.com/) by [RyotaK](https://ryotak.net).
* **December 6th**: Both issues confirmed by the React team, and the team began investigating.
* **December 7th**: Initial fixes created and the React team began verifying and planning new patch.
* **December 8th**: Affected hosting providers and open source projects notified.
* **December 10th**: Hosting provider mitigations in place and patches verified.
* **December 11th**: Additional DoS reported to [Meta Bug Bounty](https://bugbounty.meta.com/) by Shinsaku Nomura.
* **December 11th**: Patches published and publicly disclosed as [CVE-2025-55183](https://www.cve.org/CVERecord?id=CVE-2025-55183) and [CVE-2025-55184](https://www.cve.org/CVERecord?id=CVE-2025-55184).
* **December 11th**: Missing DoS case found internally, patched and publicly disclosed as [CVE-2025-67779](https://www.cve.org/CVERecord?id=CVE-2025-67779).
* **January 26th**: Additional DoS cases found, patched, and publicly disclosed as [CVE-2026-23864](https://www.cve.org/CVERecord?id=CVE-2026-23864).
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7
---

## 謝辞 {/*attribution*/}

<<<<<<< HEAD
ソースコード漏洩を報告してくださった [Andrew MacPherson (AndrewMohawk)](https://github.com/AndrewMohawk) 氏、サービス拒否攻撃の脆弱性を報告してくださった GMO Flatt Security Inc の [RyotaK](https://ryotak.net) 氏および株式会社ビットフォレストの Shinsaku Nomura 氏に感謝します。
=======
Thank you to [Andrew MacPherson (AndrewMohawk)](https://github.com/AndrewMohawk) for reporting the Source Code Exposure, [RyotaK](https://ryotak.net) from GMO Flatt Security Inc and Shinsaku Nomura of Bitforest Co., Ltd. for reporting the Denial of Service vulnerabilities. Thank you to [Mufeed VH](https://x.com/mufeedvh) from [Winfunc Research](https://winfunc.com), [Joachim Viide](https://jviide.iki.fi), [RyotaK](https://ryotak.net) from [GMO Flatt Security Inc](https://flatt.tech/en/) and Xiangwei Zhang of Tencent Security YUNDING LAB for reporting the additional DoS vulnerabilities.
>>>>>>> 38b52cfdf059b2efc5ee3223a758efe00319fcc7
