---
title: preconnect
canary: true
---

<Canary>

`preconnect` 関数は、現在 React の Canary および experimental チャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

<Intro>

`preconnect` を使用して、リソースをロードする予定のサーバにあらかじめ接続しておくことができます。

```js
preconnect("https://example.com");
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `preconnect(href)` {/*preconnect*/}

ホストに事前接続を行うためには、`react-dom` の `preconnect` 関数を呼び出します。

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  // ...
}

```

[さらに例を見る](#usage)

`preconnect` 関数は、指定されたサーバへの接続を開くよう、ブラウザに対してヒントを与えます。ブラウザがそのヒントに従うと、そのサーバからのリソースのロードが素早く行える可能性があります。

#### 引数 {/*parameters*/}

* `href`: 文字列。接続したいサーバの URL。


#### 返り値 {/*returns*/}

`preconnect` は何も返しません。

#### 注意点 {/*caveats*/}

* 同じサーバに対して `preconnect` を複数回呼び出した場合の効果は、一度のみ呼び出した場合と同様です。
* ブラウザからは、コンポーネントのレンダー中、エフェクト内、イベントハンドラ内も含むどんな状況においても `preconnect` の呼び出しが可能です。
* サーバサイドレンダリングやサーバコンポーネントのレンダー時には、コンポーネントのレンダー中やレンダーから派生した非同期処理の中で `preconnect` を呼び出した場合にのみ効果があります。それ以外の呼び出しは無視されます。
* どのリソースが必要か具体的に分かっている場合は、リソースのロードを即座に開始する[他の関数](/reference/react-dom/#resource-preloading-apis)を利用することができます。
* ウェブページ自体がホストされているのと同じサーバに事前接続する利点はありません。接続のヒントが与えられた時点で既に接続が完了しているからです。

---

## 使用法 {/*usage*/}

### レンダー時の事前接続 {/*preconnecting-when-rendering*/}

コンポーネントをレンダーする際に子コンポーネントがホストから外部リソースをロードすると分かっている場合に、`preconnect` を呼び出しておきます。

```js
import { preconnect } from 'react-dom';

function AppRoot() {
  preconnect("https://example.com");
  return ...;
}
```

### イベントハンドラ内での事前接続 {/*preconnecting-in-an-event-handler*/}

外部リソースを必要とするページ遷移や状態遷移を行う前に、イベントハンドラで `preconnect` を呼び出しておきます。これにより、新しいページや状態がレンダーされる時点で読み込むのと比べ、早期に処理を開始できます。

```js
import { preconnect } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preconnect('http://example.com');
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
