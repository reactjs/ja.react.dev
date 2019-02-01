---
id: dom-elements
title: DOM 要素
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React はパフォーマンスとブラウザ間の互換性を確保するためにブラウザから独立した DOM システムを実装しています。そしてこれを機にして、ブラウザの DOM 実装に存在するいくつかの粗削りな部分を取り払っています。

React では、全ての DOM のプロパティと属性（イベントハンドラも含む）はキャメルケースで名前付けされる必要があります。例えば、HTML 属性 `tabindex` に React で対応する属性は `tabIndex` です。例外は `aria-*` と `data-*` 属性であり、これらは小文字に揃える必要があります。例えば、`aria-label` は `aria-label` のままにできます。

## 属性についての差異

React と HTML とで挙動が異なる属性がいくつか存在します。

### checked

`checked` 属性は `checkbox` または `radio` 型の `<input>` コンポーネントでサポートされています。この属性はコンポーネントがチェックされているかを設定します。制御されたコンポーネントを構築する際に便利です。`defaultChecked` は非制御 (uncontrolled) コンポーネントにおける等価な属性で、最初にマウントされた時にチェックされるかを設定します。

### className

CSS クラスを指定する際は、`className` 属性を使用してください。これは `<div>` 、`<a>` およびその他あらゆる標準 DOM 要素と SVG 要素に対して適用されます。

React を（一般的ではありませんが）Web Componentsと使用する場合、代わりに class 属性を使用してください。

### dangerouslySetInnerHTML

`dangerouslySetInnerHTML` は React において、ブラウザ DOM における `innerHTML` を代替するものです。一般に、コードで HTML を設定することは、ユーザを[クロスサイトスクリプティング (XSS) ](https://en.wikipedia.org/wiki/Cross-site_scripting)攻撃にうっかり晒してしまいやすいので、危険です。そのため、 React で直接 HTML を設定することはできますが、`dangerouslySetInnerHTML` と入力して `__html` というキーを持つオブジェクトを渡すことで、この行為が危険であるということを自身に思い出させる必要があります。例えば：

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor

`for` は JavaScript では予約語なので、 React 要素は代わりに `htmlFor` を使用します。

### onChange

`onChange` イベントは期待通りの振る舞いをするようになっています。フォームフィールドに変更があるたび、このイベントが発生します。`onChange` という名前はその振る舞いにふさわしいものではなく、React はユーザーからの入力のリアルタイムな処理をこのイベントに依存しているため、既存のブラウザの振る舞いはあえて使用していません。

### selected

`selected` 属性は `<option>` コンポーネントでサポートされています。この属性でコンポーネントが選択されているかを設定することができます。制御されたコンポーネントを構築する際に便利です。

### style

>注意
>
>Some examples in the documentation use `style` for convenience, but **using the `style` attribute as the primary means of styling elements is generally not recommended.** In most cases, [`className`](#classname) should be used to reference classes defined in an external CSS stylesheet. `style` is most often used in React applications to add dynamically-computed styles at render time. See also [FAQ: Styling and CSS](/docs/faq-styling.html).

`style` 属性は CSS 文字列ではなく、キャメルケースのプロパティを持った JavaScript オブジェクトを受け取ります。これは DOM の `style` JavaScript プロパティとの一貫性があり、より効率的で、XSS 攻撃の対象となるセキュリティホールを防ぎます。例えば：

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

ベンダープレフィックスの自動追加は行われないことに注意してください。古いブラウザをサポートするには対応する style プロパティを与える必要があります：

```js
const divStyle = {
  WebkitTransition: 'all', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

function ComponentWithTransition() {
  return <div style={divStyle}>This should work cross-browser</div>;
}
```

style のキー名のキャメルケースは JavaScript から DOM ノードのプロパティにアクセスする場合と一致するようになっています（例えば `node.style.backgroundImage` など）。[`ms` 以外](http://www.andismith.com/blog/2012/02/modernizr-prefixed/)のベンダープレフィックスは先頭を大文字にしてください。`WebkitTransition` に大文字 "W" があるのはこのためです。

React will automatically append a "px" suffix to certain numeric inline style properties. If you want to use units other than "px", specify the value as a string with the desired unit. For example:

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

全てのスタイルプロパティがピクセルの文字列に変換されるわけではありません。特定のものは単位がないままです（例えば `zoom`、 `order`、 `flex`）。単位のないプロパティの完全なリストは[こちら](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59)で確認できます。

### suppressContentEditableWarning

通常、子要素を持つ要素が `contentEditable` でもある場合、その設定は動作しないので警告が出力されます。この属性はその警告が出力されないようにします。`contentEditable` を自身で管理する [Draft.js](https://facebook.github.io/draft-js/) のようなライブラリを構築するときでも無い限り、この属性は使用しないでください。

### suppressHydrationWarning

If you use server-side React rendering, normally there is a warning when the server and the client render different content. However, in some rare cases, it is very hard or impossible to guarantee an exact match. For example, timestamps are expected to differ on the server and on the client.

If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. You can read more about hydration in the [`ReactDOM.hydrate()` documentation](/docs/react-dom.html#hydrate).

### value

`value` 属性は `<input>` コンポーネントと `<textarea>` コンポーネントでサポートされています。コンポーネントの値を設定するのに使用できます。制御されたコンポーネントを構築する際に便利です。`defaultValue` は制御されないコンポーネントにおける等価な属性で、最初にマウントされた時の値を設定します。

## サポートされている全ての HTML 属性

React 16 より、任意の標準[もしくは独自の](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM 属性が完全にサポートされます。

React は常にJavaScript を中心とした API を DOM に提供してきました。 React コンポーネントは多くの場合で独自および DOM に関連したプロパティを受け取り、React は DOM API と同様に `camelCase` 規則を用います：

```js
<div tabIndex="-1" />      // Just like node.tabIndex DOM API
<div className="Button" /> // Just like node.className DOM API
<input readOnly={true} />  // Just like node.readOnly DOM API
```

これらの属性は、上記で述べた特別なケースを除き、対応する HTML 属性と同じように動作します。

React でサポートされているDOM 属性の一部としては：

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

同様に、全ての SVG 属性を完全にサポートしています：

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

それらが lowercase である限り、独自の属性も使用することができます。