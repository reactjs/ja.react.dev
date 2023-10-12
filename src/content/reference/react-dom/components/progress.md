---
title: "<progress>"
---

<Intro>

[ブラウザ組み込みの `<progress>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)を利用することで、進行状況のインジケータをレンダーすることができます。

```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<progress>` {/*progress*/}

進行状況のインジケータを表示するためには、[ブラウザ組み込みの `<progress>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)をレンダーします。

```js
<progress value={0.5} />
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<progress>` は[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

さらに、`<progress>` は以下の props もサポートしています：

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#max)： 数値。`value` の最大値を指定します。デフォルトは `1` です。
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#value)： `0` から `max` までの数値、または進行状況が不定 (indeterminate) であることを表す `null`。完了した量を指定します。

---

## 使用法 {/*usage*/}

### 進行状況のインジケータの制御 {/*controlling-a-progress-indicator*/}

進行状況のインジケータを表示するためには、`<progress>` コンポーネントをレンダーします。`0` から `max` 値までの数値を `value` として渡すことができます。`max` 値を渡さない場合、デフォルトで `1` とみなされます。

進行状況のインジケータを不定状態にするには `value={null}` を渡します。

<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
