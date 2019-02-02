---
id: events
title: 合成 (Synthetic) イベント
permalink: docs/events.html
layout: docs
category: Reference
---

このリファレンスガイドは、React イベントシステムの一部を構成する `SyntheticEvent`  (合成イベント)ラッパーについて文書化したものです。詳しくは、[イベント処理](/docs/handling-events.html)を参照してください。

## 概要

イベントハンドラには `SyntheticEvent` のインスタンスが渡されます。これはブラウザのネイティブイベントのクロスブラウザラッパーです。`stopPropagation()` や `preventDefault()` など、ブラウザのネイティブイベントと同じインターフェイスを持ちます。これらはすべてのブラウザで同じように機能します。

何らかの理由で基本的なブラウザイベントが必要であることがわかった場合は、`nativeEvent` 属性を使用して取得してください。すべての `SyntheticEvent` オブジェクトには以下の属性があります。

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

> 補足
>
> v0.14以降、イベントハンドラからfalseを返してもイベントの伝播が止まることはなくなりました。代わりに、`e.stopPropagation()` または `e.preventDefault()` を手動でトリガーする必要があります。


### イベントプーリング

`SyntheticEvent` はプールされます。つまり、`SyntheticEvent` オブジェクトは再利用され、イベントコールバックが呼び出された後にすべてのプロパティは無効になります。これはパフォーマンス上の理由からです。そのため、非同期にイベントにアクセスすることはできません。

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // これは動作しません。this.state.clickEvent はnullのみを保持します。
  this.setState({clickEvent: event});

  // イベントプロパティをエクスポートすることは可能です。
  this.setState({eventType: event.type});
}
```


> 補足
>
> 非同期でイベントプロパティにアクセスする場合は、イベントに対して `event.persist()` を呼び出す必要があります。これにより、プールから合成イベントが削除され、イベントへの参照をコードで保持できるようになります。


## サポートされるイベント

React はイベントを正規化して、異なるブラウザ間で一貫したプロパティを持つようにします。

以下のイベントハンドラはバブリングフェーズのイベントによって発生します。キャプチャフェーズのイベントハンドラを登録するには、イベント名に `Capture` を追加します。たとえば、`onClick` を使用する代わりに、`onClickCapture` を使用してキャプチャフェーズでクリックイベントを処理します。

- [クリップボードイベント](#clipboard-events)
- [コンポジションイベント](#composition-events)
- [キーボードイベント](#keyboard-events)
- [フォーカスイベント](#focus-events)
- [フォームイベント](#form-events)
- [マウスイベント](#mouse-events)
- [ポインタイベント](#pointer-events)
- [選択イベント](#selection-events)
- [タッチイベント](#touch-events)
- [UI イベント](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)


* * *

## Reference

### Clipboard Events

Event names:

```
onCopy onCut onPaste
```

Properties:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Composition Events

Event names:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Properties:

```javascript
string data

```

* * *

### Keyboard Events

Event names:

```
onKeyDown onKeyPress onKeyUp
```

Properties:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

The `key` property can take any of the values documented in the [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values).

* * *

### Focus Events

Event names:

```
onFocus onBlur
```

These focus events work on all elements in the React DOM, not just form elements.

Properties:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form Events

Event names:

```
onChange onInput onInvalid onSubmit
```

For more information about the onChange event, see [Forms](/docs/forms.html).

* * *

### Mouse Events

Event names:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

The `onMouseEnter` and `onMouseLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

Properties:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Pointer Events

Event names:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

The `onPointerEnter` and `onPointerLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

Properties:

As defined in the [W3 spec](https://www.w3.org/TR/pointerevents/), pointer events extend [Mouse Events](#mouse-events) with the following properties:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

A note on cross-browser support:

Pointer events are not yet supported in every browser (at the time of writing this article, supported browsers include: Chrome, Firefox, Edge, and Internet Explorer). React deliberately does not polyfill support for other browsers because a standard-conform polyfill would significantly increase the bundle size of `react-dom`.

If your application requires pointer events, we recommend adding a third party pointer event polyfill.

* * *

### Selection Events

Event names:

```
onSelect
```

* * *

### Touch Events

Event names:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Properties:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI Events

Event names:

```
onScroll
```

Properties:

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel Events

Event names:

```
onWheel
```

Properties:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Media Events

Event names:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image Events

Event names:

```
onLoad onError
```

* * *

### Animation Events

Event names:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Properties:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Transition Events

Event names:

```
onTransitionEnd
```

Properties:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Other Events

Event names:

```
onToggle
```
