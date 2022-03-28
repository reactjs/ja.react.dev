---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

「無効な ARIA Props」警告 (invalid-aria-prop) は、Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) の[標準仕様](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)に無い aria-* プロパティで DOM 要素をレンダーしようとした場合に発生します。

1. 使用した props が標準仕様に準拠しているはずのものであるなら、綴りをよく確認してください。`aria-labelledby` や `aria-activedescendant` の綴り間違いはありがちです。

<<<<<<< HEAD
2. 指定した属性を React が標準仕様の一部として正しく認識していない場合。この振舞いは React の将来のバージョンで修正される可能性は高いでしょう。しかし現時点では、React は知らない属性を全て削除するため、React アプリケーションで指定してもレンダーされません。
=======
2. React does not yet recognize the attribute you specified. This will likely be fixed in a future version of React.
>>>>>>> 5e9d673c6bc1530c901548c0b51af3ad3f91d594
