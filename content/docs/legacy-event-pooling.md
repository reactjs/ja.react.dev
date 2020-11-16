---
id: legacy-event-pooling
title: イベントプーリング
permalink: docs/legacy-event-pooling.html
---

>補足
>
>このページの内容は React 16 以前および React Native にのみ関連します。
>
>ウェブで使う React 17 ではイベントプーリングは**使用されていません**。
>
>React 17 におけるこの変更についての[詳細はこちら](/blog/2020/08/10/react-v17-rc.html#no-event-pooling)。

<<<<<<< HEAD
[`SyntheticEvent`](/docs/events.html) オブジェクトはプールされます。つまり `SyntheticEvent` はイベントハンドラが呼び出された後に再利用され、すべてのプロパティが null にセットされます。例えば、以下は動作しません：
=======
The [`SyntheticEvent`](/docs/events.html) objects are pooled. This means that the `SyntheticEvent` object will be reused and all properties will be nullified after the event handler has been called. For example, this won't work:
>>>>>>> 957276e1e92bb48e5bb6b1c17fd0e7a559de0748

```javascript
function handleChange(e) {
  // This won't work because the event object gets reused.
  setTimeout(() => {
    console.log(e.target.value); // Too late!
  }, 100);
}
```

イベントハンドラーが実行された後にオブジェクトのプロパティにアクセスする必要がある場合は、`e.persist()` を呼ぶ必要があります：

```javascript
function handleChange(e) {
  // Prevents React from resetting its properties:
  e.persist();

  setTimeout(() => {
    console.log(e.target.value); // Works
  }, 100);
}
```
