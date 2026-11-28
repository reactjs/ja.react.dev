---
title: addTransitionType
---

<Intro>

`addTransitionType` を使うと、トランジションの原因を指定できます。


```js
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `addTransitionType` {/*addtransitiontype*/}

#### 引数 {/*parameters*/}

- `type`: 追加するトランジションタイプ。任意の文字列を指定できます。

#### 返り値 {/*returns*/}

`addTransitionType` は何も返しません。

#### 注意点 {/*caveats*/}

- 複数のトランジションがまとめて処理される場合、すべてのトランジションタイプが収集されます。1 つのトランジションに複数のタイプを追加することもできます。
- トランジションタイプはコミットのたびにリセットされます。つまり、`startTransition` の後の `<Suspense>` フォールバックにはタイプが関連付けられますが、その後に表示されるコンテンツには関連付けられません。

---

## 使用法 {/*usage*/}

### トランジションの原因を追加する {/*adding-the-cause-of-a-transition*/}

`startTransition` の中で `addTransitionType` を呼び出し、トランジションの原因を明示します。

``` [[1, 6, "addTransitionType"], [2, 5, "startTransition", [3, 6, "'submit-click'"]]
import { startTransition, addTransitionType } from 'react';

function Submit({action) {
  function handleClick() {
    startTransition(() => {
      addTransitionType('submit-click');
      action();
    });
  }

  return <button onClick={handleClick}>Click me</button>;
}

```

<CodeStep step={2}>startTransition</CodeStep> のスコープ内で <CodeStep step={1}>addTransitionType</CodeStep> を呼び出すと、React は <CodeStep step={3}>submit-click</CodeStep> をそのトランジションの原因のひとつとして関連付けます。

現在、トランジションタイプは、トランジションの原因に応じてアニメーションを個別にカスタマイズするために使用できます。使い方は以下の 3 通りです。

- [ブラウザのビュー遷移タイプを使ってアニメーションをカスタマイズする](#customize-animations-using-browser-view-transition-types)
- [ビュー遷移クラスを使ってアニメーションをカスタマイズする](#customize-animations-using-view-transition-class)
- [`ViewTransition` イベントを使ってアニメーションをカスタマイズする](#customize-animations-using-viewtransition-events)

将来的には、トランジションの原因を利用したユースケースをさらにサポートしていく予定です。

---
### ブラウザのビュー遷移タイプを使ってアニメーションをカスタマイズする {/*customize-animations-using-browser-view-transition-types*/}

トランジションによって [`ViewTransition`](/reference/react/ViewTransition) が起動すると、React はすべてのトランジションタイプを、ブラウザの[ビュー遷移タイプ (view transition types)](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples) として要素に追加します。

これにより、CSS のスコープに基づいてアニメーションを個別にカスタマイズできます。

```js [11]
function Component() {
  return (
    <ViewTransition>
      <div>Hello</div>
    </ViewTransition>
  );
}

startTransition(() => {
  addTransitionType('my-transition-type');
  setShow(true);
});
```

```css
:root:active-view-transition-type(my-transition-type) {
  &::view-transition-...(...) {
    ...
  }
}
```

---

### ビュー遷移クラスを使ってアニメーションをカスタマイズする {/*customize-animations-using-view-transition-class*/}

ビュー遷移クラスにオブジェクトを渡すことで、起動した `ViewTransition` のアニメーションをタイプに応じてカスタマイズできます。

```js
function Component() {
  return (
    <ViewTransition enter={{
      'my-transition-type': 'my-transition-class',
    }}>
      <div>Hello</div>
    </ViewTransition>
  );
}

// ...
startTransition(() => {
  addTransitionType('my-transition-type');
  setState(newState);
});
```

複数のタイプが一致した場合、それらは結合されます。一致するタイプがない場合は、代わりに特別な "default" エントリが使われます。いずれかのタイプの値が "none" の場合はそれが優先され、ViewTransition は無効化されます（名前が割り当てられません）。

これらを enter/exit/update/layout/share の各 props と組み合わせることで、トリガの種類とトランジションタイプの組み合わせに応じてアニメーションを指定できます。

```js
<ViewTransition enter={{
  'navigation-back': 'enter-right',
  'navigation-forward': 'enter-left',
}}
exit={{
  'navigation-back': 'exit-right',
  'navigation-forward': 'exit-left',
}}>
```

---

### `ViewTransition` イベントを使ってアニメーションをカスタマイズする {/*customize-animations-using-viewtransition-events*/}

ビュー遷移イベントを使うことで、起動した `ViewTransition` のアニメーションを、タイプに応じて命令的にカスタマイズできます。

```
<ViewTransition onUpdate={(inst, types) => {
  if (types.includes('navigation-back')) {
    ...
  } else if (types.includes('navigation-forward')) {
    ...
  } else {
    ...
  }
}}>
```

これにより、原因に応じて異なるアニメーションを命令的に選択できます。
