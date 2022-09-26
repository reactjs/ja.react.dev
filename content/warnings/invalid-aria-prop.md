---
title: Invalid ARIA Prop Warning
layout: single
permalink: warnings/invalid-aria-prop.html
---

「無効な ARIA Props」警告 (invalid-aria-prop) は、Web Accessibility Initiative (WAI) Accessible Rich Internet Application (ARIA) の[標準仕様](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)に無い aria-* プロパティで DOM 要素をレンダーしようとした場合に発生します。

1. 使用した props が標準仕様に準拠しているはずのものであるなら、綴りをよく確認してください。`aria-labelledby` や `aria-activedescendant` の綴り間違いはありがちです。

2. `aria-role` と書いていた場合、`role` の間違いではないでしょうか。

3. 最新版の React DOM であり、ARIA 仕様にリストされている有効なプロパティ名を使っていると確認できた場合は、[バグとして報告](https://github.com/facebook/react/issues/new/choose)してください。
