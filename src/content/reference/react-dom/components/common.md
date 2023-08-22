---
title: "<div> などの一般的なコンポーネント"
---

<Intro>

[`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) などすべての組み込みブラウザコンポーネントは、いくつかの共通の props とイベントをサポートしています。

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<div>` などの一般的なコンポーネント {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[更に例を見る](#usage)

#### props {/*common-props*/}

これらの特別な React の props はすべての組み込みコンポーネントでサポートされています。

* `children`: React ノード（要素、文字列、数値、[ポータル](/reference/react-dom/createPortal)、`null` や `undefined` やブーリアンのような空ノード、あるいは他の React ノードの配列）。コンポーネントの内容を指定します。JSX を使用する場合、通常は `<div><span /></div>` のようにタグをネストすることで props として暗黙的に `children` を指定します。

* `dangerouslySetInnerHTML`: `{ __html: '<p>some html</p>' }` という形式の、内部に生の HTML 文字列を含んだオブジェクト。DOM ノードの [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) プロパティを上書きし、渡された HTML を表示します。これは最大限に注意して使用する必要があります！ 内部の HTML が信頼できない場合（例えば、ユーザデータに基づいている場合）、[XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 脆弱性を導入するリスクがあります。[`dangerouslySetInnerHTML` の使用について詳しく読む](#dangerously-setting-the-inner-html)

* `ref`: [`useRef`](/reference/react/useRef) または [`createRef`](/reference/react/createRef) から得られる ref オブジェクト、または [`ref` コールバック関数](#ref-callback)、または[レガシー ref](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) 用の文字列。指定された ref にこのノードの DOM 要素が渡されます。[ref を使った DOM の操作について詳しく読む](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: ブーリアン値。`true` の場合、React が `children` と `contentEditable={true}` を両方持つ要素（通常、これらは一緒に動作しません）に対して表示する警告を抑止します。`contentEditable` の内容を手動で管理するテキスト入力ライブラリを作成している場合に使用します。

* `suppressHydrationWarning`: ブーリアン値。[サーバレンダリング](/reference/react-dom/server)を使用する場合、通常、サーバとクライアントが異なる内容をレンダーすると警告が表示されます。一部の稀なケース（タイムスタンプなど）では、完全な一致を保証することが非常に困難または不可能です。`suppressHydrationWarning` を `true` に設定すると、React はその要素の属性と内容の不一致について警告しなくなります。これは 1 レベルの深さまでしか機能せず、避難ハッチとして使用することを目的としています。過度な使用はしないでください。[ハイドレーションエラーの抑制について読む](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: CSS スタイルを持つオブジェクト。例えば `{ fontWeight: 'bold', margin: 20 }` のようなものです。DOM の [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) プロパティと同様に、CSS プロパティ名は `camelCase` で記述する必要があります。例えば `font-weight` ではなく `fontWeight` と書きます。値として文字列や数値を渡すことができます。数値を渡す場合、例えば `width: 100` のようにすると、React は自動的に `px`（"ピクセル"）を値に追加します。ただし、それが[単位のないプロパティ](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57)の場合は除きます。`style` は、スタイルの値が事前に分からない動的なスタイルに対してのみ使用することを推奨します。他の場合は、`className` を用いてプレーンな CSS クラスを適用する方が効率的です。[`className` と `style` について詳しく読む](#applying-css-styles)

以下の標準的な DOM プロパティは、すべての組み込みコンポーネントでサポートされています。

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): 文字列。要素のキーボードショートカットを指定します。[一般的には推奨されません](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)。
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA 属性を使用すると、この要素のアクセシビリティツリー情報を指定できます。完全なリファレンスについては [ARIA 属性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)を参照してください。React では、すべての ARIA 属性名は HTML と全く同じです。
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): 文字列。ユーザ入力の大文字への変換方法を制御します。
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): 文字列。要素の CSS クラス名を指定します。[CSS スタイルの適用についてもっと読む](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): ブーリアン。`true` の場合、ブラウザはユーザがレンダーされた要素を直接編集することを許可します。これは [Lexical](https://lexical.dev/) のようなリッチテキスト入力ライブラリを実装するために使用されます。React は、`contentEditable={true}` の要素に React の子を渡そうとすると警告します。なぜなら、ユーザの編集後に React がその内容を更新できなくなるからです。
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): データ属性を使用すると、要素にいくつかの文字列データを添付できます。例えば `data-fruit="banana"` のようなものです。React では通常は props や state からデータを読み取るため、あまり使用されません。
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): `'ltr'` または `'rtl'` のいずれか。要素のテキスト方向を指定します。
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): ブーリアン。要素がドラッグ可能かどうかを指定します。[HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) の一部です。
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): 文字列。仮想キーボードのエンターキーに対してどのアクションを表示するかを指定します。
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): 文字列。[`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) と [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output) に対して、[ラベルを何らかのコントロールに関連付ける](/reference/react-dom/components/input#providing-a-label-for-an-input) ために使います。[HTML の `for` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for)と同じです。React では HTML 属性名ではなく、標準の DOM プロパティ名 (`htmlFor`) の方を使用します。
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): ブール値または文字列。要素を非表示にするかどうかを指定します。
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): 文字列。この要素の一意の識別子を指定します。これは後でこの要素を見つけたり他の要素と接続したりするために使用できます。同じコンポーネントの複数のインスタンス間での衝突を避けるため、[`useId`](/reference/react/useId) で生成してください。
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): 文字列。指定された場合、コンポーネントは[カスタム要素](/reference/react-dom/components#custom-html-elements)のように動作します。
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): 文字列。表示するキーボードの種類（例えばテキスト、数値、電話番号）を指定します。
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): 文字列。構造化データクローラに対して、この要素がどのプロパティを表しているのかを指定します。
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): 文字列。要素の言語を指定します。
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): [`AnimationEvent` ハンドラ](#animationevent-handler)関数。CSS アニメーションが完了したときに発火します。
* `onAnimationEndCapture`: `onAnimationEnd` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): [`AnimationEvent` ハンドラ](#animationevent-handler)関数。CSS アニメーションのイテレーションが終了し、別のイテレーションが始まるときに発火します。
* `onAnimationIterationCapture`: `onAnimationIteration` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): [`AnimationEvent` ハンドラ](#animationevent-handler)関数。CSS アニメーションが開始するときに発火します。
* `onAnimationStartCapture`: `onAnimationStart` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。非プライマリポインタボタンがクリックされたときに発火します。
* `onAuxClickCapture`: `onAuxClick` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* `onBeforeInput`: [`InputEvent` ハンドラ](#inputevent-handler)関数。編集可能な要素の値が変更される前に発火します。React はまだネイティブの [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) イベントを*使用しておらず*、他のイベントを使用してポリフィルを試みます。
* `onBeforeInputCapture`: `onBeforeInput` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* `onBlur`: [`FocusEvent` ハンドラ](#focusevent-handler)関数。要素がフォーカスを失ったときに発火します。React の `onBlur` イベントは、ブラウザの組み込み [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) イベントとは異なり、バブルします。
* `onBlurCapture`: `onBlur` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ポインティングデバイスのプライマリボタンがクリックされたときに発火します。
* `onClickCapture`: `onClick` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): [`CompositionEvent` ハンドラ](#compositionevent-handler)関数。[インプットメソッドエディタ (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) が新しいコンポジションセッションを開始するときに発火します。
* `onCompositionStartCapture`: `onCompositionStart` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): [`CompositionEvent` ハンドラ](#compositionevent-handler)関数。[インプットメソッドエディタ](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)がコンポジションセッションを完了またはキャンセルするときに発火します。
* `onCompositionEndCapture`: `onCompositionEnd` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): [`CompositionEvent` ハンドラ](#compositionevent-handler)関数。[インプットメソッドエディタ](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)が新しい文字を受け取るときに発火します。
* `onCompositionUpdateCapture`: `onCompositionUpdate` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ユーザがコンテクストメニューを開こうとすると発火します。
* `onContextMenuCapture`: `onContextMenu` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): [`ClipboardEvent` ハンドラ](#clipboardevent-handler)関数。ユーザが何かをクリップボードにコピーしようとすると発火します。
* `onCopyCapture`: `onCopy` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): [`ClipboardEvent` ハンドラ](#clipboardevent-handler)関数。ユーザが何かをクリップボードに切り取ろうとすると発火します。
* `onCutCapture`: `onCut` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* `onDoubleClick`: [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ユーザがダブルクリックすると発火します。ブラウザの [`dblclick` イベント](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)に対応します。
* `onDoubleClickCapture`: `onDoubleClick` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): [`DragEvent` ハンドラ](#dragevent-handler)関数。ユーザが何かをドラッグしている間発火します。
* `onDragCapture`: `onDrag` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): [`DragEvent` ハンドラ](#dragevent-handler)関数。ユーザが何かのドラッグを止めると発火します。
* `onDragEndCapture`: `onDragEnd` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): [`DragEvent` ハンドラ](#dragevent-handler)関数。ドラッグされたコンテンツが有効なドロップターゲットに入ると発火します。
* `onDragEnterCapture`: `onDragEnter` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): [`DragEvent` ハンドラ](#dragevent-handler)関数。ドラッグされたコンテンツが有効なドロップターゲット上でドラッグされている間発火します。ドロップを許可するためにはここで `e.preventDefault()` を呼び出す必要があります。
* `onDragOverCapture`: `onDragOver` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): [`DragEvent` ハンドラ](#dragevent-handler)関数。ユーザが要素のドラッグを開始すると発火します。
* `onDragStartCapture`: `onDragStart` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): [`DragEvent` ハンドラ](#dragevent-handler)関数。何かが有効なドロップターゲットにドロップされたときに発火します。
* `onDropCapture`: `onDrop` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* `onFocus`: [`FocusEvent` ハンドラ](#focusevent-handler)関数。要素がフォーカスを受け取ったときに発火します。ブラウザの組み込み [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) イベントとは異なり、React の `onFocus` イベントはバブルします。
* `onFocusCapture`: `onFocus` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。要素がプログラム的にポインタをキャプチャしたときに発火します。
* `onGotPointerCaptureCapture`: `onGotPointerCapture` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): [`KeyboardEvent` ハンドラ](#pointerevent-handler)関数。キーが押されたときに発火します。
* `onKeyDownCapture`: `onKeyDown` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): [`KeyboardEvent` ハンドラ](#pointerevent-handler)関数。非推奨です。代わりに `onKeyDown` または `onBeforeInput` を使用してください。
* `onKeyPressCapture`: `onKeyPress` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): [`KeyboardEvent` ハンドラ](#pointerevent-handler)関数。キーが離されたときに発火します。
* `onKeyUpCapture`: `onKeyUp` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。要素がポインタのキャプチャを停止したときに発火します。
* `onLostPointerCaptureCapture`: `onLostPointerCapture` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ポインタが押されたときに発火します。
* `onMouseDownCapture`: `onMouseDown` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ポインタが要素の内部に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onMouseLeave` と `onMouseEnter` は、離れる要素から入る要素へと伝播します。
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ポインタが要素の外に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onMouseLeave` と `onMouseEnter` は、離れる要素から入る要素へと伝播します。
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ポインタの座標が変わったときに発火します。
* `onMouseMoveCapture`: `onMouseMove` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ポインタが要素の外に移動したとき、または子要素に移動したときに発火します。
* `onMouseOutCapture`: `onMouseOut` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): [`MouseEvent` ハンドラ](#mouseevent-handler)関数。ポインタがリリースされたときに発火します。
* `onMouseUpCapture`: `onMouseUp` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。ブラウザがポインタによるインタラクションをキャンセルしたときに発火します。
* `onPointerCancelCapture`: `onPointerCancel` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。ポインタがアクティブになったときに発火します。
* `onPointerDownCapture`: `onPointerDown` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。ポインタが要素の内部に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onPointerLeave` と `onPointerEnter` は、離れる要素から入る要素へと伝播します。
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。ポインタが要素の外に移動したときに発火します。キャプチャフェーズはありません。代わりに、`onPointerLeave` と `onPointerEnter` は、離れる要素から入る要素へと伝播します。
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。ポインタの座標が変わったときに発火します。
* `onPointerMoveCapture`: `onPointerMove` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。ポインタが要素の外に移動したとき、ポインタのインタラクションがキャンセルされたとき、その他[いくつかの他の理由](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)で発火します。
* `onPointerOutCapture`: `onPointerOut` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): [`PointerEvent` ハンドラ](#pointerevent-handler)関数。ポインタがもはやアクティブでなくなったときに発火します。
* `onPointerUpCapture`: `onPointerUp` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): [`ClipboardEvent` ハンドラ](#clipboardevent-handler)関数。ユーザがクリップボードから何かを貼り付けようとすると発火します。
* `onPasteCapture`: `onPaste` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): [`Event` ハンドラ](#event-handler)関数。要素がスクロールされたときに発火します。このイベントはバブルしません。
* `onScrollCapture`: `onScroll` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` ハンドラ](#event-handler)関数。入力フィールドなどの編集可能な要素内の選択が変更された後に発火します。React は `onSelect` イベントを `contentEditable={true}` の要素でも動作するように拡張します。さらに、React は空の選択と編集（選択に影響を与える可能性があります）に対しても発火するように拡張します。
* `onSelectCapture`: `onSelect` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): [`TouchEvent` ハンドラ](#touchevent-handler)関数。ブラウザがタッチインタラクションをキャンセルすると発火します。
* `onTouchCancelCapture`: `onTouchCancel` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): [`TouchEvent` ハンドラ](#touchevent-handler)関数。1 つ以上のタッチポイントが削除されると発火します。
* `onTouchEndCapture`: `onTouchEnd` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): [`TouchEvent` ハンドラ](#touchevent-handler)関数。1 つ以上のタッチポイントが移動すると発火します。
* `onTouchMoveCapture`: `onTouchMove` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): [`TouchEvent` ハンドラ](#touchevent-handler)関数。1 つ以上のタッチポイントが配置されると発火します。
* `onTouchStartCapture`: `onTouchStart` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): [`TransitionEvent` ハンドラ](#transitionevent-handler)関数。CSS のトランジションが完了すると発火します。
* `onTransitionEndCapture`: `onTransitionEnd` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): [`WheelEvent` ハンドラ](#wheelevent-handler)関数。ユーザがホイールボタンを回転させると発火します。
* `onWheelCapture`: `onWheel` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 文字列。支援技術に対して要素の役割を明示的に指定します。
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 文字列。シャドウ DOM を使用する際のスロット名を指定します。React では、同等のパターンは通常 JSX を props として渡すことで達成されます。例えば `<Layout left={<Sidebar />} right={<Content />} />` のようになります。
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): ブーリアンまたは null。明示的に `true` または `false` に設定すると、スペルチェックを有効または無効にします。
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): 数値。デフォルトの Tab ボタンの動作を上書きします。[`-1` と `0` 以外の値の使用は避けてください](https://www.tpgi.com/using-the-tabindex-attribute/)。
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): 文字列。要素のツールチップテキストを指定します。
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'` または `'no'` のいずれか。`'no'` を渡すと、要素の内容の翻訳が除外されます。

カスタム属性も props として渡すことができます。例えば `mycustomprop="someValue"` のようになります。これはサードパーティのライブラリと統合する際に便利です。カスタム属性名は小文字でなければならず、`on` で始まってはいけません。値は文字列に変換されます。`null` または `undefined` を渡すと、カスタム属性は削除されます。

以下のイベントは [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) 要素のみで発火します：

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): [`Event` ハンドラ](#event-handler)関数。フォームがリセットされたときに発火します。
* `onResetCapture`: `onReset` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): [`Event` ハンドラ](#event-handler)関数。フォームが送信されたときに発火します。
* `onSubmitCapture`: `onSubmit` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。

以下のイベントは、[`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) 要素に対してのみ発火します。ブラウザのイベントとは異なり、React ではバブルします。

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): [`Event` ハンドラ](#event-handler)関数。ユーザがダイアログをキャンセルしようとしたときに発火します。
* `onCancelCapture`: `onCancel` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): [`Event` ハンドラ](#event-handler)関数。ダイアログが閉じられたときに発火します。
* `onCloseCapture`: `onClose` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。

以下のイベントは、[`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) 要素に対してのみ発火します。ブラウザのイベントとは異なり、React ではバブルします。

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): [`Event` ハンドラ](#event-handler)関数。ユーザが詳細を切り替えたときに発火します。
* `onToggleCapture`: `onToggle` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。

これらのイベントは、[`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)、[`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)、[`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object)、[`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed)、[`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)、および [SVG の `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag) 要素に対して発火します。ブラウザのイベントとは異なり、React ではバブルします。

* `onLoad`: [`Event` ハンドラ](#event-handler)関数。リソースが読み込まれたときに発火します。
* `onLoadCapture`: `onLoad` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` ハンドラ](#event-handler)関数。リソースが読み込めなかったときに発火します。
* `onErrorCapture`: `onError` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。

以下のイベントは、[`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) や [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) などのリソースに対して発火します。ブラウザのイベントとは異なり、React ではこれらのイベントはバブルします。

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): [`Event` ハンドラ](#event-handler)関数。リソースが完全には読み込まれなかったが、エラーによるものではない場合に発火します。
* `onAbortCapture`: `onAbort` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): [`Event` ハンドラ](#event-handler)関数。再生を開始するのに十分なデータがあるが、バッファリングのための停止なしに最後まで再生するのに十分なデータはない場合に発火します。
* `onCanPlayCapture`: `onCanPlay` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): [`Event` ハンドラ](#event-handler)関数。バッファリングのための停止をせずとも再生を開始して最後まで再生できると考えられる十分なデータがある場合に発火します。
* `onCanPlayThroughCapture`: `onCanPlayThrough` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event)：[`Event` ハンドラ](#event-handler)関数。メディアの再生時間が更新されたときに発火します。
* `onDurationChangeCapture`: `onDurationChange` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): [`Event` ハンドラ](#event-handler)関数。メディアが空になったときに発火します。
* `onEmptiedCapture`: `onEmptied` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): [`Event` ハンドラ](#event-handler)関数。ブラウザが暗号化されたメディアに遭遇したときに発火します。
* `onEncryptedCapture`: `onEncrypted` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): [`Event` ハンドラ](#event-handler)関数。再生するものが何も残っていないために再生が停止したときに発火します。
* `onEndedCapture`: `onEnded` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` ハンドラ](#event-handler)関数。リソースが読み込めなかったときに発火します。
* `onErrorCapture`: `onError` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): [`Event` ハンドラ](#event-handler)関数。現在の再生フレームが読み込まれたときに発火します。
* `onLoadedDataCapture`: `onLoadedData` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): [`Event` ハンドラ](#event-handler)関数。メタデータが読み込まれたときに発火します。
* `onLoadedMetadataCapture`: `onLoadedMetadata` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): [`Event` ハンドラ](#event-handler)関数。ブラウザがリソースの読み込みを開始したときに発火します。
* `onLoadStartCapture`: `onLoadStart` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): [`Event` ハンドラ](#event-handler)関数。メディアが一時停止したときに発火します。
* `onPauseCapture`: `onPause` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): [`Event` ハンドラ](#event-handler)関数。メディアが一時停止を解除したときに発火します。
* `onPlayCapture`: `onPlay` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): [`Event` ハンドラ](#event-handler)関数。メディアが再生または再開したときに発火します。
* `onPlayingCapture`: `onPlaying` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): [`Event` ハンドラ](#event-handler)関数。リソースの読み込み中に定期的に発火します。
* `onProgressCapture`: `onProgress` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): [`Event` ハンドラ](#event-handler)関数。再生レートが変更されたときに発火します。
* `onRateChangeCapture`: `onRateChange` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* `onResize`: [`Event` ハンドラ](#event-handler)関数。ビデオのサイズが変更されたときに発火します。
* `onResizeCapture`: `onResize` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): [`Event` ハンドラ](#event-handler)関数。シーク操作が完了したときに発火します。
* `onSeekedCapture`: `onSeeked` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): [`Event` ハンドラ](#event-handler)関数。シーク操作を開始したときに発火します。
* `onSeekingCapture`: `onSeeking` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): [`Event` ハンドラ](#event-handler)関数。ブラウザがデータを待っているが、ロードが進まないときに発火します。
* `onStalledCapture`: `onStalled` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): [`Event` ハンドラ](#event-handler)関数。リソースのロードが中断されたときに発火します。
* `onSuspendCapture`: `onSuspend` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): [`Event` ハンドラ](#event-handler)関数。現在の再生時間が更新されたときに発火します。
* `onTimeUpdateCapture`: `onTimeUpdate` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): [`Event` ハンドラ](#event-handler)関数。ボリュームが変更されたときに発火します。
* `onVolumeChangeCapture`: `onVolumeChange` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): [`Event` ハンドラ](#event-handler)関数。一時的なデータ不足により再生が停止したときに発火します。
* `onWaitingCapture`: `onWaiting` の[キャプチャフェーズ](/learn/responding-to-events#capture-phase-events)で発火するバージョン。

#### 注意点 {/*common-caveats*/}

- `children` と `dangerouslySetInnerHTML` を同時に渡すことはできません。
- 一部のイベント（`onAbort` や `onLoad` など）はブラウザではバブルしませんが、React ではバブルします。

---

### `ref` コールバック関数 {/*ref-callback*/}

[`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref) などが返す ref オブジェクトの代わりに、`ref` 属性に関数を渡すことができます。

```js
<div ref={(node) => console.log(node)} />
```

[`ref` コールバックを使用した例を見る](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

`<div>` DOM ノードが画面に追加されると、React はその DOM `node` を引数として `ref` コールバックを呼び出します。`<div>` DOM ノードが削除されると、React は `null` を引数として `ref` コールバックを呼び出します。

React は、*異なる* `ref` コールバックが渡された場合も `ref` コールバックを呼び出します。上記の例では、`(node) => { ... }` は毎回のレンダーで異なる関数です。コンポーネントが再レンダーされると、*前*の関数が `null` を引数として呼び出され、*次*の関数が DOM ノードを引数として呼び出されます。

#### 引数 {/*ref-callback-parameters*/}

* `node`: DOM ノードまたは `null`。ref がアタッチされるときに React は DOM ノードを渡し、ref がデタッチされるときに `null` を渡します。毎回のレンダーで `ref` コールバックに同じ関数参照を渡さない限り、コールバックは一時的にデタッチされ、コンポーネントの再レンダーごとに再アタッチされます。

#### 返り値 {/*returns*/}

`ref` コールバックからは何も返してはいけません。

---

### React イベントオブジェクト {/*react-event-object*/}

イベントハンドラは *React イベントオブジェクト*を受け取ります。これは "合成イベント (synthetic event)" とも呼ばれることがあります。

```js
<button onClick={e => {
  console.log(e); // React event object
}} />
```

これは対応する元の DOM イベントと同じ標準に準拠していますが、一部のブラウザ間の非一致を修正したものです。

一部の React イベントはブラウザのネイティブイベントに直接マッピングされません。例えば `onMouseLeave` においては `e.nativeEvent` は `mouseout` イベントになっています。具体的なマッピングは公開 API の一部ではなく、将来変更される可能性があります。何らかの理由で元となるブラウザイベントが必要な場合は、`e.nativeEvent` から読み取ってください。

#### プロパティ {/*react-event-object-properties*/}

React イベントオブジェクトは、標準の [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) プロパティの一部を実装しています。

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): ブーリアン。イベントが DOM をバブルするかどうかを返します。
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): ブーリアン。イベントがキャンセル可能かどうかを返します。
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): DOM ノード。React ツリー内で現在のハンドラがアタッチされているノードを返します。
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): ブーリアン。`preventDefault` が呼び出されたかどうかを返します。
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): 数値。イベントが現在どのフェーズにあるかを返します。
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): ブーリアン。イベントの発生理由がユーザによるものかどうかを返します。
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): DOM ノード。イベントが発生したノード（遠い子孫要素のこともある）を返します。
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): 数値。イベントが発生した時間を返します。

さらに、React イベントオブジェクトは以下のプロパティを提供します。

* `nativeEvent`: DOM の [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)。オリジナルのブラウザイベントオブジェクト。

#### メソッド {/*react-event-object-methods*/}

React イベントオブジェクトは、標準の [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) メソッドの一部を実装しています。

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): イベントのデフォルトのブラウザアクションを防ぎます。
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): React ツリーを通じたイベントの伝播を停止します。

さらに、React イベントオブジェクトは以下のメソッドを提供します。

* `isDefaultPrevented()`: `preventDefault` が呼び出されたかどうかを示すブーリアンを返します。
* `isPropagationStopped()`: `stopPropagation` が呼び出されたかどうかを示すブーリアンを返します。
* `persist()`: React DOM では使用されません。React Native では、イベントのプロパティを読み取る際にこのイベントを呼び出します。
* `isPersistent()`: React DOM では使用されません。React Native では、`persist` が呼び出されたかどうかを返します。

#### 注意点 {/*react-event-object-caveats*/}

* `currentTarget`、`eventPhase`、`target`、`type` の値は、あなたの React コードで期待される通りの値を反映しています。内部的には、React はルートにイベントハンドラをアタッチするのですが、この事実は React イベントオブジェクトには反映されません。例えば、`e.currentTarget` は元となる `e.nativeEvent.currentTarget` とは同じでないかもしれません。ポリフィルされたイベントでは、`e.type`（React イベントのタイプ）は `e.nativeEvent.type`（元イベントのタイプ）と異なることがあります。

---

### `AnimationEvent` ハンドラ関数 {/*animationevent-handler*/}

[CSS アニメーション](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)イベントのイベントハンドラタイプです。

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### 引数 {/*animationevent-handler-parameters*/}

* `e`: 以下の追加の [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` ハンドラ関数 {/*clipboadevent-handler*/}

[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) イベントのイベントハンドラタイプです。

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### 引数 {/*clipboadevent-handler-parameters*/}

* `e`: 以下の追加の [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。

* [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` ハンドラ関数 {/*compositionevent-handler*/}

[インプットメソッドエディタ (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) イベントのためのイベントハンドラタイプです。

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### 引数 {/*compositionevent-handler-parameters*/}

* `e`: 以下の追加の [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` ハンドラ関数 {/*dragevent-handler*/}

[HTML ドラッグ & ドロップ API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) イベントのためのイベントハンドラタイプです。

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### 引数 {/*dragevent-handler-parameters*/}

* `e`: 以下の追加の [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  また、継承元である [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) のプロパティも含みます：

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承元である [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) のプロパティも含みます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` ハンドラ関数 {/*focusevent-handler*/}

フォーカスイベントのためのイベントハンドラタイプです。

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[例を見る](#handling-focus-events)

#### 引数 {/*focusevent-handler-parameters*/}

* `e`: 以下の追加の [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  また、継承元である [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) のプロパティも含みます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` ハンドラ関数 {/*event-handler*/}

一般的なイベントのためのイベントハンドラタイプです。

#### 引数 {/*event-handler-parameters*/}

* `e`: 追加のプロパティがない [React イベントオブジェクト](#react-event-object)。

---

### `InputEvent` ハンドラ関数 {/*inputevent-handler*/}

`onBeforeInput` イベントのためのイベントハンドラタイプです。

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### 引数 {/*inputevent-handler-parameters*/}

* `e`: 以下の追加の [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` ハンドラ関数 {/*keyboardevent-handler*/}

キーボードイベントのためのイベントハンドラタイプです。

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[例を見る](#handling-keyboard-events)

#### 引数 {/*keyboardevent-handler-parameters*/}

* `e`: 以下の追加の [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  また、継承元である [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) のプロパティも含みます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` ハンドラ関数 {/*mouseevent-handler*/}

マウスイベントのためのイベントハンドラタイプです。

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[例を見る](#handling-mouse-events)

#### 引数 {/*mouseevent-handler-parameters*/}

* `e`: 以下の追加の [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承元である [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) のプロパティも含みます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` ハンドラ関数 {/*pointerevent-handler*/}

[ポインタイベント](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)のためのイベントハンドラタイプです。

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[例を見る](#handling-pointer-events)。

#### 引数 {/*pointerevent-handler-parameters*/}

* `e`: 以下の追加の [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  また、継承元である [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) のプロパティも含みます：

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承元である [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) のプロパティも含みます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` ハンドラ関数 {/*touchevent-handler*/}

[タッチイベント](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)のためのイベントハンドラタイプです。

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### 引数 {/*touchevent-handler-parameters*/}

* `e`: 以下の追加の [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  また、継承元である [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) のプロパティも含みます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` ハンドラ関数 {/*transitionevent-handler*/}

CSS トランジションイベントのためのイベントハンドラタイプです。

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### 引数 {/*transitionevent-handler-parameters*/}

* `e`: 以下の追加の [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` ハンドラ関数 {/*uievent-handler*/}

一般的な UI イベントのためのイベントハンドラタイプです。

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### 引数 {/*uievent-handler-parameters*/}

* `e`: 以下の追加の [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` ハンドラ関数 {/*wheelevent-handler*/}

`onWheel` イベントのためのイベントハンドラタイプです。

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### 引数 {/*wheelevent-handler-parameters*/}

* `e`: 以下の追加の [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) プロパティを持つ [React イベントオブジェクト](#react-event-object)。
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  また、継承元である [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) のプロパティも含みます：

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  また、継承元である [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) のプロパティも含みます：

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## 使用法 {/*usage*/}

### CSS スタイルの適用 {/*applying-css-styles*/}

React では、CSS クラスを [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) で指定します。これは HTML の `class` 属性と同様に動作します。

```js
<img className="avatar" />
```

そして別の CSS ファイルでそれに対する CSS ルールを記述します。

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React は CSS ファイルの追加方法を規定しません。最も単純なケースでは、HTML に [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) タグを追加します。ビルドツールやフレームワークを使用している場合は、そのドキュメンテーションを参照して、プロジェクトに CSS ファイルを追加する方法を学んでください。

時には、スタイルの値がデータに依存することがあります。`style` 属性を使用して、一部のスタイルを動的に渡します。

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


上記の例では、`style={{}}` は特別な構文ではなく、`style={ }` という [JSX の波括弧](/learn/javascript-in-jsx-with-curly-braces)内の通常の `{}` オブジェクトです。スタイルが JavaScript 変数に依存する場合にのみ `style` 属性を使用することをお勧めします。

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### 複数の CSS クラスを条件付きで適用する方法 {/*how-to-apply-multiple-css-classes-conditionally*/}

CSS クラスを条件付きで適用するには、JavaScript を使用して `className` 文字列を自分で生成する必要があります。

例えば、`className={'row ' + (isSelected ? 'selected': '')}` は `isSelected` が `true` かどうかによって、`className="row"` または `className="row selected"` になります。

これをより読みやすくするために、[`classnames`](https://github.com/JedWatson/classnames) のような小さなヘルパライブラリを使用できます。

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

これは条件付きクラスが複数ある場合に特に便利です。

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### ref を使って DOM ノードを操作する {/*manipulating-a-dom-node-with-a-ref*/}

JSX タグに対応するブラウザの DOM ノードを取得する必要がある場合があります。例えば、ボタンがクリックされたときに `<input>` にフォーカスを当てたい場合、ブラウザの `<input>` DOM ノードに対して [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) を呼び出す必要があります。

あるタグに対応するブラウザ DOM ノードを取得するには、[ref を宣言](/reference/react/useRef)し、それをそのタグの `ref` 属性として渡します。

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React は、画面にレンダーされた後に、DOM ノードを `inputRef.current` に代入します。

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

[ref を使った DOM の操作](/learn/manipulating-the-dom-with-refs)に詳しい解説があります。[こちらに他の例があります](/reference/react/useRef#examples-dom)。

より高度なユースケースのために、`ref` 属性は[コールバック関数](#ref-callback)も受け入れます。

---

### 危険を冒して内部 HTML をセットする {/*dangerously-setting-the-inner-html*/}

以下のように、要素に対して生の HTML 文字列を渡すことができます。

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**これは危険です。元の DOM の [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) プロパティも同様ですが、最大限に注意を払ってください！ マークアップが完全に信頼できるソースから来ていない限り、この方法を使うといとも簡単に [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 脆弱性が発生します**。

例えば、Markdown を HTML に変換する Markdown ライブラリを使用しており、そのパーサにバグがないと信頼でき、ユーザは本人が入力したものしか見ない、という場合、結果 HTML を以下のように表示することができます。

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

なぜ任意の HTML をレンダーすることが危険なのかを理解するために、上記のコードを以下のように置き換えてみてください。

```js {1-4,7,8}
const post = {
  // Imagine this content is stored in the database.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML に埋め込まれたコードが実行されます。ハッカーはこのセキュリティホールを利用してユーザ情報を盗んだり、ユーザに代わって行動したりすることができます。**`dangerouslySetInnerHTML` は信頼できる、そしてサニタイズされたデータでのみ使用してください**。

---

### マウスイベントの処理 {/*handling-mouse-events*/}

この例では、一般的な[マウスイベント](#mouseevent-handler)とそれらの発火タイミングを示しています。

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### ポインタイベントの処理 {/*handling-pointer-events*/}

この例では、一般的な[ポインタイベント](#pointerevent-handler)とそれらの発火タイミングを示しています。

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### フォーカスイベントの処理 {/*handling-focus-events*/}

React では、[フォーカスイベント](#focusevent-handler)はバブルします。`currentTarget` と `relatedTarget` を使用して、フォーカスまたはブラー（フォーカス喪失）イベントが親要素の外部から発生したかどうかを判断できます。この例では、子要素へのフォーカス、親要素へのフォーカス、および全体のサブツリーへのフォーカスの入出を検出する方法を示しています。

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### キーボードイベントの処理 {/*handling-keyboard-events*/}

この例では、一般的な[キーボードイベント](#keyboardevent-handler)とそれらの発火タイミングを示しています。

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
