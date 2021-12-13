---
id: faq-styling
title: CSS とスタイルの使用
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### CSS のクラスをコンポーネントに適用するにはどうすれば？ {#how-do-i-add-css-classes-to-components}

このようにクラス名を文字列として `className` プロパティに与えてください。

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
>もしあなたが上記のようなコードを書くことが多い場合、[classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) という npm パッケージを使うことで簡略化できます。

### インラインスタイルは使えますか？ {#can-i-use-inline-styles}

はい、スタイルの書き方については[この資料](/docs/dom-elements.html#style)をご覧ください。

### インラインスタイルは悪なの？ {#are-inline-styles-bad}

パフォーマンス観点から言えば、基本的に CSS クラスを使う方が、インラインスタイルを用いるよりも優れています。

### CSS-in-JS とは? {#what-is-css-in-js}

"CSS-in-JS" とは外部ファイルでスタイルを定義するのとは違い、JavaScript を用いて CSS を生成するパターンのことを指します。

_注意：この機能は React の一部ではありません。サードパーティのライブラリ群により提供される機能です。_React はスタイルがどのように定義されているかには関心を持ちません。判断に困った場合は、まずは別の `*.css` にスタイルを定義して、[`className`](/docs/dom-elements.html#classname) を使って参照するところからはじめると良いでしょう。

### React でアニメーションは使えますか？ {#can-i-do-animations-in-react}

React を使ってアニメーションを動かすことは可能です。例として、[React Transition Group](https://reactcommunity.org/react-transition-group/)、[React Motion](https://github.com/chenglou/react-motion)、[React Spring](https://github.com/react-spring/react-spring) や [Framer Motion](https://framer.com/motion) をご覧ください。
