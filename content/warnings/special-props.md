---
title: Special Props Warning
layout: single
permalink: warnings/special-props.html
---
特別なpropsの警告。

Most props on a JSX element are passed on to the component, however, there are two special props (`ref` and `key`) which are used by React, and are thus not forwarded to the component.

JSX要素の大部分の props はコンポーネントに渡されますが、React が使用するため、コンポーネントに転送されない2つの特別な小道具（`ref` と `key`）があります。


For instance, attempting to access `this.props.key` from a component (i.e., the render function or [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) is not defined. If you need to access the same value within the child component, you should pass it as a different prop (ex: `<ListItemWrapper key={result.id} id={result.id} />`). While this may seem redundant, it's important to separate app logic from reconciling hints.

たとえばコンポーネントから(render()関数または[propType](/docs/typechecking-with-proptypes.html#proptypes)から） `this.props.key` へアクセスしようとすると未定義となります。子コンポーネント内でその値にアクセスする必要がある場合は、別の prop で渡します（例： `<ListItemWrapper key={result.id} id={result.id} />`）。これは冗長に思えるかもしれませんが、アプリケーションロジックと突き合わせ処理(reconciling)のためのヒントを分けることは重要です。
