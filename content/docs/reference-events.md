---
id: events
title: 合成イベント (SyntheticEvent)
permalink: docs/events.html
layout: docs
category: Reference
---

<<<<<<< HEAD
このリファレンスガイドでは、React のイベントシステムの一部を構成する `SyntheticEvent`（合成イベント）ラッパについて説明します。詳細については、[イベント処理](/docs/handling-events.html)ガイドを参照してください。
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Common components (e.g. `<div>`)](https://beta.reactjs.org/reference/react-dom/components/common)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

This reference guide documents the `SyntheticEvent` wrapper that forms part of React's Event System. See the [Handling Events](/docs/handling-events.html) guide to learn more.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

## 概要 {#overview}

イベントハンドラには、`SyntheticEvent` のインスタンスが渡されます。これはブラウザのネイティブイベントに対するクロスブラウザ版のラッパです。`stopPropagation()` と `preventDefault()` を含む、ブラウザのネイティブイベントと同じインターフェイスを持ちつつ、ブラウザ間で同じ挙動をするようになっています。

何らかの理由で実際のブラウザイベントが必要な場合は、単に `nativeEvent` 属性を使用するだけで取得できます。合成イベントはブラウザのネイティブイベントとは別物であり、直接の対応があるわけでもありません。例えば `onMouseLeave` イベントの場合、`event.nativeEvent` は `mouseout` イベントになっています。個々の対応については公開 API の範疇ではなく、常に変わる可能性があります。すべての `SyntheticEvent` オブジェクトは以下の属性を持っています。

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
void persist()
DOMEventTarget target
number timeStamp
string type
```

> 補足
>
> v17 以降、`SyntheticEvent` は[プーリング](/docs/legacy-event-pooling.html)されなくなったため、`e.persist()` は何も行わなくなります。

> 補足
>
> v0.14 以降、イベントハンドラから `false` を返してもイベントの伝播は止まりません。代わりに、`e.stopPropagation()` または `e.preventDefault()` を手動で呼び出す必要があります。

## サポートするイベント {#supported-events}

React は異なるブラウザ間でも一貫したプロパティを持つようにイベントを正規化します。

以下のイベントハンドラはイベント伝搬のバブリングフェーズで呼び出されます。キャプチャフェーズのイベントハンドラを登録するには、イベント名に `Capture` を追加します。たとえば、キャプチャフェーズでクリックイベントを処理するには `onClick` の代わりに `onClickCapture` を使用します。

- [クリップボードイベント](#clipboard-events)
- [コンポジションイベント](#composition-events)
- [キーボードイベント](#keyboard-events)
- [フォーカスイベント](#focus-events)
- [フォームイベント](#form-events)
- [汎用イベント](#generic-events)
- [マウスイベント](#mouse-events)
- [ポインタイベント](#pointer-events)
- [選択イベント](#selection-events)
- [タッチイベント](#touch-events)
- [UI イベント](#ui-events)
- [ホイールイベント](#wheel-events)
- [メディアイベント](#media-events)
- [画像イベント](#image-events)
- [アニメーションイベント](#animation-events)
- [遷移イベント](#transition-events)
- [その他のイベント](#other-events)

* * *

## リファレンス {#reference}

### クリップボードイベント {#clipboard-events}

イベント名：

```
onCopy onCut onPaste
```

プロパティ：

```javascript
DOMDataTransfer clipboardData
```

* * *

### コンポジションイベント {#composition-events}

イベント名：

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

プロパティ：

```javascript
string data

```

* * *

### キーボードイベント {#keyboard-events}

イベント名：

```
onKeyDown onKeyPress onKeyUp
```

プロパティ：

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

`key` プロパティは [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) に記載されている任意の値を取ることができます。

* * *

### フォーカスイベント {#focus-events}

イベント名：

```
onFocus onBlur
```

これらのフォーカスイベントは、フォーム要素だけでなくすべての React DOM 要素で動作します。

プロパティ：

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

`onFocus` イベントは要素（あるいはその内部の別の要素）がフォーカスを受け取った時に呼び出されます。例えば、ユーザがテキスト入力をクリックした際に呼び出されます。

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

`onBlur` イベントハンドラは要素（あるいはその内部の別の要素）からフォーカスが外れた場合に呼び出されます。例えば、ユーザが既にフォーカスされているテキスト入力の外側でクリックした場合に呼び出されます。

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### フォーカスが当たった・外れたことの検出 {#detecting-focus-entering-and-leaving}

`currentTarget` と `relatedTarget` を用いることで、フォーカスが当たった・外れた際のイベントが親要素の*外側*で起こったかどうかを判定できます。以下のコピー・ペーストで使えるデモでは、子要素のどれかへのフォーカス、要素自身へのフォーカス、サブツリー全体から出入りするフォーカスを、それぞれどのように検出するかを示しています。

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```

* * *

### フォームイベント {#form-events}

イベント名：

```
onChange onInput onInvalid onReset onSubmit 
```

onChange イベントの詳細については、[Forms](/docs/forms.html) を参照してください。

* * *

### 汎用イベント {#generic-events}

イベント名：

```
onError onLoad
```

* * *

### マウスイベント {#mouse-events}

イベント名：

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

`onMouseEnter` と `onMouseLeave` イベントは通常のバブリングとは異なり、（ポインタが）出て行った要素から入ってきた要素に伝播し、キャプチャフェーズを持ちません。

プロパティ：

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

### ポインタイベント {#pointer-events}

イベント名：

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

`onPointerEnter` と `onPointerLeave` イベントは通常のバブリングとは異なり、（ポインタが）出て行った要素から入ってきた要素に伝播し、キャプチャフェーズを持ちません。

プロパティ：

[W3 spec](https://www.w3.org/TR/pointerevents/) に定義されている通り、ポインタイベントは下記のプロパティを持つマウスイベントの拡張です。

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

クロスブラウザサポートについての補足：

すべてのブラウザでポインタイベントがサポートされているわけではありません（この記事の執筆時点でサポートされているブラウザは、Chrome、Firefox、Edge、および Internet Explorer です）。標準に準拠したポリフィルは `react-dom` のバンドルサイズを大幅に増加させるため、React は意図的にその他ブラウザのためのポリフィルを提供しません。

アプリケーションでポインタイベントが必要な場合は、サードパーティのポインタイベントポリフィルを追加することをお勧めします。

* * *

### 選択イベント {#selection-events}

イベント名：

```
onSelect
```

* * *

### タッチイベント {#touch-events}

イベント名：

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

プロパティ：

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

### UI イベント {#ui-events}

イベント名：

```
onScroll
```

>補足
>
>React 17 以降、`onScroll` イベントは**バブルしなく**なりました。これはブラウザの挙動と合致しており、スクロール可能な要素がネストされている場合に離れた親要素に対してイベントが発火する場合に起きる混乱を回避できます。

プロパティ：

```javascript
number detail
DOMAbstractView view
```

* * *

### ホイールイベント {#wheel-events}

イベント名：

```
onWheel
```

プロパティ：

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### メディアイベント {#media-events}

イベント名：

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### 画像イベント {#image-events}

イベント名：

```
onLoad onError
```

* * *

### アニメーションイベント {#animation-events}

イベント名：

```
onAnimationStart onAnimationEnd onAnimationIteration
```

プロパティ：

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### 遷移イベント {#transition-events}

イベント名：

```
onTransitionEnd
```

プロパティ：

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### その他のイベント {#other-events}

イベント名：

```
onToggle
```
