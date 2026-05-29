---
title: 無効な ARIA プロパティの警告
---

この警告は、Web Accessibility Initiative (WAI) の Accessible Rich Internet Application (ARIA) [仕様](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties)に存在しない `aria-*` プロパティを持つ DOM 要素をレンダーしようとした場合に発生します。

1. 有効なプロパティを使用しているはずだと思う場合は、スペルを慎重に確認してください。`aria-labelledby` や `aria-activedescendant` はよくスペルミスされます。

2. `aria-role` と書いた場合、意図していたのは `role` かもしれません。

3. それ以外の場合で、最新バージョンの React DOM を使用しており、ARIA 仕様に記載されている有効なプロパティ名を使用していることも確認済みであれば、[バグを報告](https://github.com/facebook/react/issues/new/choose)してください。
