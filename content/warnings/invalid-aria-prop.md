---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

The invalid-aria-prop warning will fire if you attempt to render a DOM element with an aria-* prop that does not exist in the Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) [specification](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties).

「無効なARIA Props」の警告（invalid-aria-prop）は、Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) の[仕様](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)に無い aria-* プロパティで DOM 要素をレンダリングしようとした場合に発生します。

1. If you feel that you are using a valid prop, check the spelling carefully. `aria-labelledby` and `aria-activedescendant` are often misspelled.

1. 有効であるはずの props を使用している場合は、綴りをよく確認してください。 `aria-labelledby` や `aria-activedescendant` の綴り間違いはありがちです。

2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React. However, React currently strips all unknown attributes, so specifying them in your React app will not cause them to be rendered

2. 指定した属性を React がまだ認識できない場合。React の将来のバージョンで修正される可能性は高いでしょう。とはいえ、React は現時点では未知の属性を全て削除するため、React アプリケーションで指定してもレンダリングされません。
