---
title: Unknown Prop Warning
layout: single
permalink: warnings/unknown-prop.html
---
不明なプロパティの警告。

The unknown-prop warning will fire if you attempt to render a DOM element with a prop that is not recognized by React as a legal DOM attribute/property. You should ensure that your DOM elements do not have spurious props floating around.

unknown-prop 警告は、DOM 標準仕様で定義された属性/プロパティであるとReactが認識していないプロパティでDOM をレンダリングしようとした場合に発生します。
該当箇所の近辺で非正規な props を使ってしまっていないことを確認してください。

There are a couple of likely reasons this warning could be appearing:

この警告が出現しそうな理由がいくつかあります：

1. Are you using `{...this.props}` or `cloneElement(element, this.props)`? Your component is transferring its own props directly to a child element (eg. [transferring props](/docs/transferring-props.html)). When transferring props to a child component, you should ensure that you are not accidentally forwarding props that were intended to be interpreted by the parent component.

1. `{...this.props}` または `cloneElement(element, this.props)` を使っていませんか？
あなたのコンポーネントは自身の props を子要素にそのまま転送しています。(例 [propsの転送](/docs/transferring-props.html))。子要素に props を転送する場合、親コンポーネントが解釈すべき props を誤って子に転送していないことを確認する必要があります。


2. You are using a non-standard DOM attribute on a native DOM node, perhaps to represent custom data. If you are trying to attach custom data to a standard DOM element, consider using a custom data attribute as described [on MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes).

2. 独自データを表現するため等の理由で、ネイティブの DOM ノード上で非標準の DOM 属性を使用している場合。標準の DOM 要素に独自形式のデータを追加しようとしているなら、[MDN で説明されている](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes)通りにカスタムデータ属性(data-*)の使用を検討してください。

3. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React. However, React currently strips all unknown attributes, so specifying them in your React app will not cause them to be rendered.

2. 指定した属性を React がまだ認識できない場合。React の将来のバージョンで修正される可能性は高いでしょう。とはいえ、React は現時点では未知の属性を全て削除するため、React アプリケーションで指定してもレンダリングされません。

4. You are using a React component without an upper case. React interprets it as a DOM tag because [React JSX transform uses the upper vs. lower case convention to distinguish between user-defined components and DOM tags](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

4. 大文字を使わずに React コンポーネントを使おうとしている場合。React では [JSX の変換の際、ユーザ定義のコンポーネントと DOMタグとを区別するのに大文字と小文字との区別を用いる](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)ため、小文字のタグは DOM タグとして解釈されてしまいます。

---

To fix this, composite components should "consume" any prop that is intended for the composite component and not intended for the child component. Example:

これを修正するためには、コンポーネントを組合わせるコンポーネントは、自分自身のコンポーネントのためのものであり、子コンポーネントのためのものではないすべての props を「消費」する必要があります。例えば、

**Bad:** Unexpected `layout` prop is forwarded to the `div` tag.

**悪い例：** 予期せず layout プロパティが div タグに転送されています。

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

**Good:** The spread operator can be used to pull variables off props, and put the remaining props into a variable.

**良い例：** スプレッド演算子は props から必要な変数だけ取り出して、残りの props を別の変数に入れるのに使用できます。


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

**Good:** You can also assign the props to a new object and delete the keys that you're using from the new object. Be sure not to delete the props from the original `this.props` object, since that object should be considered immutable.

**良い例：** props を新しいオブジェクトに割り当てて(`Object.assign`)、使用しているキーを新しいオブジェクトから削除することもできます。ただし、元の `this.props` オブジェクトは不変オブジェクトとみなされるべきなので、そこから props を削除しないようにしてください。


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
