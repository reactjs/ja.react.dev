---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

「無効な ARIA Props」警告 (invalid-aria-prop) は、Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) の[標準仕様](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)に無い aria-* プロパティで DOM 要素をレンダーしようとした場合に発生します。

1. 使用した props が標準仕様に準拠しているはずのものであるなら、綴りをよく確認してください。`aria-labelledby` や `aria-activedescendant` の綴り間違いはありがちです。

<<<<<<< HEAD
2. 指定した属性を React が標準仕様の一部として正しく認識していない場合。この振舞いは React の将来のバージョンで修正される可能性が高いです。
=======
2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd
