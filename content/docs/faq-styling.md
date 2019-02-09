---
id: faq-styling
title: CSSとスタイルの使用
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### CSS のクラスをコンポーネントに適用するにはどうすれば？ {#how-do-i-add-css-classes-to-components}

このようにクラス名を string として `className` prop に与えてください。

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

このようにコンポーネントの props や state の状態を元に CSS クラスを割り当てる方法もよく使用されています。

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>ヒント
>
>もしあなたが上記のようなコードを書くことが多い場合、[classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) というnpm パッケージを使うことで簡略化できます。

### インラインスタイルは使えますか？ {#can-i-use-inline-styles}

はい、スタイルの書き方については[この資料](/docs/dom-elements.html#style)をご覧ください。

### インラインスタイルは悪なの？ {#are-inline-styles-bad}

パフォーマンス観点から言えば、基本的に CSS クラスを使う方が、インラインスタイルを用いるよりもパフォーマンスは優れています。

### CSS-in-JS とは? {#what-is-css-in-js}

"CSS-in-JS" とは外部ファイルでスタイルを定義するのとは違い、 JS を用いて CSS を生成するパターンのことを指します。数々の CSS-in-JS ライブラリの比較については[この資料](https://github.com/MicheleBertoli/css-in-js)をご覧ください。

_注意：この機能は React の一部ではありません。サードパーティに提供されたライブラリ郡です。_ React はスタイルがどのように定義されているかには関心を持ちません。疑うのであれば、まずはいままでどおり別の `*.css` にスタイルを定義して、[`className`](/docs/dom-elements.html#classname) を使って参照するところからはじめると良いでしょう。 

### React で animation は使えますか？ {#can-i-do-animations-in-react}

React を使って animations を動かすことは可能です。例として、[React Transition Group](https://reactcommunity.org/react-transition-group/) や [React Motion](https://github.com/chenglou/react-motion) をご覧ください。
