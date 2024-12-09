---
title: prefetchDNS
---

<<<<<<< HEAD
<Canary>

`prefetchDNS` 関数は、現在 React の Canary および experimental チャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
<Intro>

`prefetchDNS` を使用して、リソースをロードする予定のサーバに対して IP ルックアップを事前に行うことができます。

```js
prefetchDNS("https://example.com");
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `prefetchDNS(href)` {/*prefetchdns*/}

ホストのルックアップを行うには、`react-dom` の `prefetchDNS` 関数を呼び出します。

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  // ...
}

```

[さらに例を見る](#usage)

prefetchDNS 関数は、指定されたサーバの IP アドレスを調べるようブラウザに対してヒントを与えます。ブラウザがそのヒントに従うと、そのサーバからのリソースのロードが素早く行える可能性があります。

#### 引数 {/*parameters*/}

* `href`: 文字列。接続したいサーバの URL。

#### 返り値 {/*returns*/}

`prefetchDNS` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じサーバに対して `prefetchDNS` を複数回呼び出した場合の効果は、一度のみ呼び出した場合と同様です。
* ブラウザからは、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内も含むどんな状況においても `prefetchDNS` の呼び出しが可能です。
* サーバサイドレンダリングやサーバコンポーネントのレンダー時には、コンポーネントのレンダー中やレンダーから派生した非同期処理の中で `prefetchDNS` を呼び出した場合にのみ効果があります。それ以外の呼び出しは無視されます。
* どのリソースが必要か具体的に分かっている場合は、リソースのロードを即座に開始する[他の関数](/reference/react-dom/#resource-preloading-apis)を利用することができます。
* ウェブページ自体がホストされているのと同じサーバにプリフェッチを行う利点はありません。ヒントが与えられた時点で既にルックアップが完了しているからです。
* [`preconnect`](/reference/react-dom/preconnect) と比較して、大量のドメインに投機的に接続する場合は `prefetchDNS` の方が適しているかもしれません。大量に事前接続するとそのオーバーヘッドが利益を上回る可能性があるためです。

---

## 使用法 {/*usage*/}

### レンダー時の DNS プリフェッチ {/*prefetching-dns-when-rendering*/}

コンポーネントをレンダーする際に子コンポーネントがホストから外部リソースをロードすると分かっている場合に、`prefetchDNS` を呼び出しておきます。

```js
import { prefetchDNS } from 'react-dom';

function AppRoot() {
  prefetchDNS("https://example.com");
  return ...;
}
```

### イベントハンドラ内での DNS プリフェッチ {/*prefetching-dns-in-an-event-handler*/}

外部リソースを必要とするページ遷移や状態遷移を行う前に、イベントハンドラで `prefetchDNS` を呼び出しておきます。これにより、新しいページや状態がレンダーされる時点で読み込むのと比べ、早期に処理を開始できます。

```js
import { prefetchDNS } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    prefetchDNS('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
