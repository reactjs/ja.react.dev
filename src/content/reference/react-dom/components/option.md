---
title: "<option>"
---

<Intro>

[ブラウザ組み込みの `<option>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) を利用することで、[`<select>`](/reference/react-dom/components/select) ボックス内に選択肢をレンダーすることができます。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<option>` {/*option*/}

[ブラウザ組み込みの `<option>` コンポーネント](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) を利用することで、[`<select>`](/reference/react-dom/components/select) ボックス内にオプションをレンダーすることができます。

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[さらに例を見る](#usage)

#### props {/*props*/}

`<option>` は、[一般的な要素の props](/reference/react-dom/components/common#props) をすべてサポートしています。

さらに、`<option>` は以下の props をサポートしています：

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): ブーリアン。`true` の場合、オプションは選択できなくなり、薄暗く表示されます。
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): 文字列。オプションの意味を指定します。指定しない場合、オプション内のテキストが使用されます。
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): このオプションが選択された場合に、[親の `<select>` をフォームで送信する](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form)際に使用される値。

#### 注意点 {/*caveats*/}

* React は `<option>` の `selected` 属性をサポートしていません。代わりに、このオプションの `value` を親の [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) に渡して非制御のセレクトボックスを作成するか、[`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) に渡して制御されたセレクトボックスを作成します。

---

## 使用法 {/*usage*/}

### 選択肢を含むセレクトボックスを表示する {/*displaying-a-select-box-with-options*/}

`<option>` コンポーネントのリストを内部に含む `<select>` をレンダーして、セレクトボックスを表示します。各 `<option>` に、フォームで送信されるデータを表す `value` を指定してください。

`<select>` を `<option>` コンポーネントのリストと共に表示する方法についての詳細は、[こちらをご覧ください](/reference/react-dom/components/select)。

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

