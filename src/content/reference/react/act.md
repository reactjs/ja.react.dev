---
title: act
---

<Intro>

`act` は、アサーションを行う前に保留中の React の更新を適用するために用いるテストヘルパです。

```js
await act(async actFn)
```

</Intro>

コンポーネントをアサーションが行える状態にまでもっていくために、レンダーや更新を行うコードを `await act()` の呼び出し内にラップします。これにより、テストがブラウザでの React の動作に近づきます。

<Note>
`act()` を直接使用するのは少し冗長に感じるかもしれません。ボイラープレートを避けるために、[React Testing Library](https://testing-library.com/docs/react-testing-library/intro) のようなライブラリを使用することができます。これらのヘルパは `act()` でラップされています。
</Note>


<InlineToc />

---

## リファレンス {/*reference*/}

### `await act(async actFn)` {/*await-act-async-actfn*/}

UI テストを書く際、レンダー、ユーザイベント、データフェッチなどのタスクは、ユーザインターフェースにおける「操作単位 (unit of interaction)」と捉えることができます。React は `act()` というヘルパを提供しており、これによりこれらの「操作単位」に関連するすべての更新が処理されて DOM に適用された後に、アサーションを行えるようになります。

`act` という名前は [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert) パターンに由来します。

```js {2,4}
it ('renders with button disabled', async () => {
  await act(async () => {
    root.render(<TestComponent />)
  });
  expect(container.querySelector('button')).toBeDisabled();
});
```

<Note>

`act` を `await` および `async` 関数と一緒に使用することをお勧めします。同期バージョンも多くの場合に機能しますが、すべてのケースで機能するわけではありません。React が内部で更新をスケジュールする方法に絡む問題があり、同期バージョンを使用できるタイミングを予測することは困難です。

将来的には同期バージョンを非推奨にし、削除する予定です。

</Note>

#### 引数 {/*parameters*/}

* `async actFn`: テスト対象のコンポーネントのレンダーやユーザ操作をラップする非同期関数。`actFn` 内でトリガされた更新は内部の act キューに追加され、その後まとめてフラッシュされて DOM に変更が適用されます。非同期であるため、React は非同期境界を越えるコードも実行し、スケジュールされた更新をフラッシュします。

#### 返り値 {/*returns*/}

`act` は何も返しません。

## 使用法 {/*usage*/}

コンポーネントをテストする際に `act` を使用して、コンポーネントの出力についてアサーションを行うことができます。

例えば以下のような `Counter` コンポーネントがあるとしましょう。後で挙げる使用例は、これをテストする方法を示しています。

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${this.state.count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {this.state.count} times</p>
      <button onClick={this.handleClick}>
        Click me
      </button>
    </div>
  )
}
```

### テスト内でコンポーネントをレンダーする {/*rendering-components-in-tests*/}

コンポーネントのレンダー出力内容をテストするには、レンダーを `act()` 内にラップします。

```js  {10,12}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it('can render and update a counter', async () => {
  container = document.createElement('div');
  document.body.appendChild(container);
  
  // ✅ Render the component inside act().
  await act(() => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');
});
```

ここではコンテナを作成し、それをドキュメントに追加し、`Counter` コンポーネントを `act()` 内でレンダーします。これにより、コンポーネントのレンダーとエフェクトの適用が終わってからアサーションが行えることが保証されます。

`act` を使用することで、アサーションを行う前にすべての更新の適用が完了していることが保証されます。

### テスト内でイベントをディスパッチする {/*dispatching-events-in-tests*/}

イベントをテストするには、イベントのディスパッチを `act()` 内にラップします。

```js {14,16}
import {act} from 'react';
import ReactDOMClient from 'react-dom/client';
import Counter from './Counter';

it.only('can render and update a counter', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  await act( async () => {
    ReactDOMClient.createRoot(container).render(<Counter />);
  });
  
  // ✅ Dispatch the event inside act().
  await act(async () => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

ここでは、`act` でコンポーネントをレンダーし、その後別の `act()` 内でイベントをディスパッチしています。これにより、イベントに伴うすべての更新が適用されてからアサーションを行えることが保証されます。

<Pitfall>

DOM イベントをディスパッチできるのは、DOM コンテナがドキュメントに追加されている場合だけであることを忘れないようにしましょう。[React Testing Library](https://testing-library.com/docs/react-testing-library/intro) のようなライブラリを使用することでボイラープレートコードを減らすことができます。

</Pitfall>

## トラブルシューティング {/*troubleshooting*/}

### エラー："The current testing environment is not configured to support act"(...)" {/*error-the-current-testing-environment-is-not-configured-to-support-act*/}

`act` を使用するには、テスト環境で `global.IS_REACT_ACT_ENVIRONMENT=true` を設定する必要があります。これは `act` が正しい環境でのみ使用されることを保証するためです。

このグローバル変数を設定しない場合、次のようなエラーが表示されます。

<ConsoleBlock level="error">

Warning: The current testing environment is not configured to support act(...)

</ConsoleBlock>

これを修正するには、React テストのグローバルセットアップファイルに次のコードを追加します。

```js
global.IS_REACT_ACT_ENVIRONMENT=true
```

<Note>

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro) のようなテストフレームワークでは、`IS_REACT_ACT_ENVIRONMENT` はすでに設定されています。

</Note>
