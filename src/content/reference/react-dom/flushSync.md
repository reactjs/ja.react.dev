---
title: flushSync
---

<Pitfall>

`flushSync` の使用は一般的ではなく、アプリのパフォーマンスを低下させる可能性があります。

</Pitfall>

<Intro>

`flushSync` は、渡されたコールバック関数内のあらゆる更新作業を強制的かつ同期的にフラッシュ (flush) するように React に指示します。これにより、DOM が直ちに更新されることが保証されます。

```js
flushSync(callback)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `flushSync(callback)` {/*flushsync*/}

`flushSync` を呼び出して、保留中の作業をフラッシュし、DOM を同期的に更新するよう React に強制します。

```js
import { flushSync } from 'react-dom';

flushSync(() => {
  setSomething(123);
});
```

ほとんどの場合、`flushSync` の使用は避けることができます。`flushSync` は最後の手段として使用してください。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}


* `callback`: 関数。React はこのコールバックを直ちに呼び出し、そこに含まれるすべての更新作業を同期的にフラッシュします。また、保留中の更新、エフェクト、エフェクト内の更新もフラッシュすることがあります。この `flushSync` 呼び出しの結果として更新のサスペンドが起きると、フォールバックが再表示される可能性があります。

#### 返り値 {/*returns*/}

`flushSync` は `undefined` を返します。

#### 注意点 {/*caveats*/}

* `flushSync` はパフォーマンスを大幅に低下させる可能性があります。控え目に使用してください。
* `flushSync` は保留中のサスペンスバウンダリを強制的に `fallback` 状態にする可能性があります。
* `flushSync` はリターンの前に、保留中のエフェクトを実行し、そこに含まれた任意の更新も同期的に適用する場合があります。
* `flushSync` は、コールバック内の更新をフラッシュするために必要な場合、コールバック外の更新もフラッシュすることがあります。例えば、クリックによる保留中の更新作業がある場合、React はコールバック内の更新をフラッシュする前に先にそれらをフラッシュするかもしれません。

---

## 使用法 {/*usage*/}

### サードパーティコードとの統合のために更新作業をフラッシュ {/*flushing-updates-for-third-party-integrations*/}

ブラウザ API や UI ライブラリなどのサードパーティのコードと統合作業を行う際には、React に更新をフラッシュするように強制する必要があるかもしれません。コールバック内の任意の <CodeStep step={1}>state 更新</CodeStep> を同期的にフラッシュするよう React に強制するために `flushSync` を使用します。

```js [[1, 2, "setSomething(123)"]]
flushSync(() => {
  setSomething(123);
});
// By this line, the DOM is updated.
```

これにより、コードの次の行が実行される時点で、React はすでに DOM を更新しているということが保証されます。

**`flushSync` の使用は一般的ではなく、頻繁に使用するとアプリのパフォーマンスが大幅に低下する可能性があります**。アプリが React の API のみを使用し、サードパーティのライブラリとの結合がない場合、`flushSync` は不要のはずです。

しかし、これはブラウザの API などのサードパーティのコードとの統合に役立つことがあります。

一部のブラウザの API は、コールバック内の結果がコールバックの終了時点までに同期的に DOM に書き込まれ、ブラウザがレンダーされた DOM を操作できるようになることを期待しています。ほとんどの場合 React はこれを自動的に処理します。しかし、一部のケースでは同期的な更新を強制する必要があるかもしれません。

例えば、ブラウザの `onbeforeprint` API を用いると、印刷ダイアログが開く直前にページを変更することができます。これは、ドキュメントが印刷用により良く表示されるよう、カスタム印刷スタイルを適用する際に有用です。以下の例では、`onbeforeprint` コールバック内で `flushSync` を使用して、React の state を即座に DOM に「フラッシュ」します。これにより、印刷ダイアログが開いた時点では、`isPrinting` として "yes" が表示されます。

<Sandpack>

```js App.js active
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function PrintApp() {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    function handleBeforePrint() {
      flushSync(() => {
        setIsPrinting(true);
      })
    }

    function handleAfterPrint() {
      setIsPrinting(false);
    }

    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, []);

  return (
    <>
      <h1>isPrinting: {isPrinting ? 'yes' : 'no'}</h1>
      <button onClick={() => window.print()}>
        Print
      </button>
    </>
  );
}
```

</Sandpack>

<<<<<<< HEAD
`flushSync` がない場合、印刷ダイアログが表示される時点での `isPrinting` は "no" になります。これは、React が更新を非同期的にバッチ（束ね）処理するため、state の更新処理がなされる前に印刷ダイアログが表示されるからです。
=======
Without `flushSync`, the print dialog will display `isPrinting` as "no". This is because React batches the updates asynchronously and the print dialog is displayed before the state is updated.
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

<Pitfall>

`flushSync` はパフォーマンスを大幅に低下させ、保留中のサスペンスバウンダリのフォールバックが予期せず表示されてしまう可能性があります。

ほとんどの場合、`flushSync` の使用は避けることができるので、`flushSync` は最後の手段として使用してください。

</Pitfall>
