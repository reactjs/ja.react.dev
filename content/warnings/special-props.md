---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---

「特別な props」の警告。

JSX 要素の大部分の props はコンポーネントに渡されますが、React が使用するため、コンポーネントに転送されない 2 つの特別な props（`ref` と `key`）があります。

たとえばコンポーネントから（render() 関数または [propType](/docs/typechecking-with-proptypes.html#proptypes) から）`this.props.key` へアクセスしようとすると未定義となります。子コンポーネント内でその値が必要ならば、別の props で渡します（例： `<ListItemWrapper key={result.id} id={result.id} />`）。これは冗長に思えるかもしれませんが、アプリケーションのロジックと差分検出処理 (reconciling) のためのヒントを分けることは重要です。
