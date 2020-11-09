---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---

「不明なプロパティ」（unknown-prop）警告は、DOM 標準仕様で定義された属性/プロパティであると React が認識していないプロパティで DOM をレンダーしようとした場合に発生します。該当箇所の近辺で非標準の props を使ってしまっていないことを確認してください。

この警告が表示されるありそうな原因のいくつかを示します。

1. `{...this.props}` または `cloneElement(element, this.props)` を使っていませんか？ コンポーネントが自身の props を子要素にそのまま転送しています（参考：[props の転送](/docs/transferring-props.html)）。子要素に props を転送する場合、親コンポーネントが解釈すべき props を誤って子に転送していないことを確認する必要があります。

2. 独自データを表現するため等の理由で、ネイティブの DOM ノード上で非標準の DOM 属性を使用している場合。DOM 要素に独自形式のデータを追加しようとしているなら、[MDN で説明されている](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes)通りにカスタムデータ属性 (data-*) の使用を検討してください。

3. 指定した属性を React が標準仕様の一部として正しく認識していない場合。この振舞いは React の将来のバージョンで修正される可能性は高いでしょう。しかし現時点では、React は知らない属性を全て削除するため、React アプリケーションで指定してもレンダーされません。

4. 大文字で始まらない名前の React コンポーネントを使おうとしている。React では [JSX の変換の際、ユーザ定義のコンポーネントと DOM タグとを区別するのに大文字と小文字との区別を用いる](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)ため、小文字のタグは DOM タグとして解釈されてしまいます。

---

この警告を修正するには、他のコンポーネントを組み合わせるコンポーネントは、子のコンポーネントのためのものではない、自分自身のコンポーネントのための全ての props を「消費」する必要があります。例えば、

**悪い例：**期待されていない layout プロパティが div タグに転送されています。

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // BAD! Because you know for sure "layout" is not a prop that <div> understands.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

**良い例：**スプレッド演算子は props から必要な変数だけ取り出して、残りの props を別の変数に入れるのに使用できます。


```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**良い例：**props を新しいオブジェクトに割り当てて (`Object.assign`)、使用しているキーを新しいオブジェクトから削除することもできます。ただし、元の `this.props` オブジェクトは不変オブジェクトとみなされるべきなので、そこから props を削除しないようにしてください。


```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
