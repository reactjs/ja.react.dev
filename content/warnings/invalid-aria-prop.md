---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

The invalid-aria-prop warning will fire if you attempt to render a DOM element with an aria-* prop that does not exist in the Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [specification](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

無効なARIAプロパティ（invalid-aria-prop）の警告は、Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) の仕様に無いaria-*プロパティで DOM 要素をレンダリングしようとした場合に発生します。

1. If you feel that you are using a valid prop, check the spelling carefully. `aria-labelledby` and `aria-activedescendant` are often misspelled.

有効な小道具を使用していると思われる場合は、綴りをよく確認してください。aria-labelledbyそしてaria-activedescendantスペルミスがよくあります。

2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React. However, React currently strips all unknown attributes, so specifying them in your React app will not cause them to be rendered

Reactが指定された属性をまだ認識できない場合。
React の将来のバージョンで修正される可能性があります。
しかし、 React は現時点では全ての不明な属性を削除するため、それらを React アプリケーションで指定してもレンダリングされません。
