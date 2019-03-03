---
id: faq-build
title: Babel、JSX、ビルドステップ
permalink: docs/faq-build.html
layout: docs
category: FAQ
---

### React では JSX を使用する必要がありますか？ {#do-i-need-to-use-jsx-with-react}

いいえ！ 詳細は ["JSX なしで React を使う"](/docs/react-without-jsx.html) をご覧ください。

### React では ES6（もしくはそれ以降のバージョン）を使用する必要がありますか？ {#do-i-need-to-use-es6--with-react}

いいえ！ 詳細は ["ES6 なしで React を使う"](/docs/react-without-es6.html) をご覧ください。

### JSX の中にコメントを記述するには？ {#how-can-i-write-comments-in-jsx}

```jsx
<div>
  {/* Comment goes here */}
  Hello, {name}!
</div>
```

```jsx
<div>
  {/* It also works 
  for multi-line comments. */}
  Hello, {name}! 
</div>
```
