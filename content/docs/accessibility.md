---
id: accessibility
title: アクセシビリティ
permalink: docs/accessibility.html
---

## なぜアクセシビリティが必要なのか？ {#why-accessibility}

Web アクセシビリティ（[**a11y**](https://en.wiktionary.org/wiki/a11y) とも呼ばれます）とは、誰にでも使えるようウェブサイトを設計・構築することです。ユーザ補助技術がウェブページを解釈できるようにするためには、サイトでアクセシビリティをサポートする必要があります。

React はアクセシビリティを備えたウェブサイトの構築を全面的にサポートしており、大抵は標準の HTML の技術が用いられます。

## 標準およびガイドライン {#standards-and-guidelines}

### WCAG {#wcag}

[Web Content Accessibility Guidelines](https://www.w3.org/WAI/intro/wcag) はアクセシビリティを備えたウェブサイトを構築するためのガイドラインを提供しています。

以下の WCAG のチェックリストはその概要を示します。

- [WCAG checklist from Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [WCAG checklist from WebAIM](https://webaim.org/standards/wcag/checklist)
- [Checklist from The A11Y Project](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

[Web Accessibility Initiative - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) には十分なアクセシビリティを持つ JavaScript ウィジェットの構築テクニックが含まれています。

補足として、JSX ではすべての `aria-*` で始まる HTML 属性がサポートされています。React においてほとんどの DOM プロパティと属性がキャメルケースである一方で、これらの属性は純粋な HTML と同じようにハイフンケース（ケバブケースやリスプケースなどとも言われる）である必要があります。

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## セマンティックな HTML {#semantic-html}

セマンティック（意味論的）な HTML はウェブアプリケーションにおけるアクセシビリティの基礎となります。ウェブサイト内の情報の意味を明確にするための多様な HTML 要素を使うことにより、大抵の場合は少ない手間でアクセシビリティを手に入れられます。

- [MDN HTML 要素リファレンス](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

ときおり、React コードを動くようにするために JSX に `<div>` を追加すると、HTML のセマンティックが崩れることがあります。とりわけ、リスト (`<ol>`, `<ul>`, `<dl>`) や `<table>` タグと組み合わせるときに問題になります。そんなときは複数の要素をグループ化するために [React フラグメント](/docs/fragments.html)を使う方がよいでしょう。

具体例です。

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

項目の集合をフラグメントの配列に変換することができますし、他の任意の要素でも同様です。

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Fragments should also have a `key` prop when mapping collections
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

もし、フラグメントタグに props を渡す必要がなく、かつ使用しているツールがサポートしているのであれば、[省略記法](/docs/fragments.html#short-syntax)が使えます。

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

より詳細な情報は[フラグメントドキュメント](/docs/fragments.html)にあります。

## アクセシブルなフォーム {#accessible-forms}

### ラベル付け {#labeling}

`<input>` や `<textarea>` のような各 HTML フォームコントロールには、アクセシブルな形でのラベル付けが必要です。スクリーンリーダに公開される、説明的なラベルを提供する必要があります。

以下の資料にはその方法が示されています：

- [W3C による要素にラベルを付ける方法の解説](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM による要素にラベルを付ける方法の解説](https://webaim.org/techniques/forms/controls)
- [The Paciello Group によるアクセシブルな名前についての解説](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

React でこれらの標準的な HTML の実践知識を直接使用できますが、JSX では `for` 属性は `htmlFor` として記述されることに注意してください。

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### ユーザへのエラー通知 {#notifying-the-user-of-errors}

すべてのユーザがエラーの起きた状況を理解できる必要があります。以下のリンクはどのようにエラーテキストをユーザと同じくスクリーンリーダにも公開するかを解説しています。

- [W3C によるユーザへの通知方法の例示](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM によるフォームバリデーションの解説](https://webaim.org/techniques/formvalidation/)

## フォーカス制御 {#focus-control}

あなたのウェブアプリケーションが完全にキーボードだけで操作できることを確かめてください：

- [WebAIM によるキーボードアクセシビリティの解説](https://webaim.org/techniques/keyboard/)

### キーボードフォーカスとフォーカス時のアウトライン（輪郭線）{#keyboard-focus-and-focus-outline}

キーボードフォーカスは DOM の中でキーボードからの入力を受け付けるために選択されている要素を示します。フォーカスを輪郭線で示した以下の画像のような例を、様々な場所で見かけることができます：

<img src="../images/docs/keyboard-focus.png" alt="選択中のリンクの周囲に表示されている青色のフォーカス線" />

例えば `outline: 0` のようにしてこのアウトラインを CSS で削除できますが、これは他の実装でフォーカス線を置き換える場合にのみ行うようにしてください。

### 目的のコンテンツまで飛べる仕組み {#mechanisms-to-skip-to-desired-content}

キーボードによる操作を補助して高速化するために、あなたのアプリケーションのナビゲーション（メニューや目次）部分をユーザが読み飛ばせるような仕組みを提供しましょう。

スキップリンク ("skiplink") やスキップナビゲーションリンク ("skip navigation link") とは、ユーザがキーボードでページを操作する場合にのみ出現する、隠れたナビゲーションリンクです。これらのリンクはページ内アンカーといくらかのスタイルを用いて、とても簡単に実装できます：

- [WebAIM - Skip Navigation Links](https://webaim.org/techniques/skipnav/)

`<main>` や `<aside>` のようなランドマーク要素とロール属性も活用してページの領域を区切り、補助技術を使うユーザが素早くこれらのセクションに移動できるようにしてください。

アクセシビリティを強化する、これらの要素の使い方についての詳細は以下を読んでください：

- [Accessible Landmarks](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### プログラムによりフォーカスを管理する {#programmatically-managing-focus}

React アプリケーションは実行されている間、継続的に HTML の DOM を変更するため、時にキーボードフォーカスが失われたり、予期しない要素にセットされたりすることがあります。これを修正するためには、プログラムによってキーボードフォーカスを正しい位置に移動させる必要があります。例えばモーダルウィンドウを閉じた後には、モーダルを開いたボタンにキーボードフォーカスを戻すことなどです。

MDN のウェブドキュメントには、[キーボードで移動可能な JavaScript ウィジェット](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets) の作り方が解説されています。

React でフォーカスをセットするには、[DOM 要素への Ref](/docs/refs-and-the-dom.html) が使えます。

これを使って、まずコンポーネントクラスの JSX 要素に ref を作成します：

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Create a ref to store the textInput DOM element
    this.textInput = React.createRef();
  }
  render() {
  // Use the `ref` callback to store a reference to the text input DOM
  // element in an instance field (for example, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

これで必要な場合にはコンポーネントのほかの場所からその要素にフォーカスすることができます。

 ```javascript
 focus() {
   // Explicitly focus the text input using the raw DOM API
   // Note: we're accessing "current" to get the DOM node
   this.textInput.current.focus();
 }
 ```

ときおり、親コンポーネントは子コンポーネント内の要素にフォーカスをセットする必要があります。これは、親の ref を子の DOM ノードに転送する特別なプロパティを通して[親コンポーネントに DOM の ref を公開する](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components)ことで可能になります。

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Now you can set focus when required.
this.inputElement.current.focus();
```

コンポーネントを拡張するのに[高階コンポーネント (HOC)](/docs/higher-order-components.html) を使う場合は、React の `forwardRef` 関数を用いて、関数に囲われたコンポーネントに [ref をフォワーディング (forwarding) する](/docs/forwarding-refs.html) ことをおすすめします。もし、サードパーティの高階コンポーネントが ref フォワーディングを実装していないときでも、上記のパターンはフォールバックとして使えます。

良いフォーカス管理の例は [react-aria-modal](https://github.com/davidtheclark/react-aria-modal) です。これは完全にアクセシブルなモーダルウィンドウの比較的珍しい例です。このライブラリは、最初のフォーカスをキャンセルボタンに設定し（これは、キーボードを使っているユーザがうっかり次のアクションに移ってしまうのを防ぎます）、モーダルの中でキーボードフォーカスが閉じているだけでなく、最初にモーダルを開いた要素にフォーカスを戻してもくれます。

> 補足：
>
> これはとても重要なアクセシビリティ機能ですが、慎重に使用されるべきテクニックでもあります。このテクニックはキーボードフォーカスの流れが妨げられた場合の修正に使用し、ユーザがアプリケーションをどのように使いたいかを試したり予測するのに使わないでください。

## マウスとポインタのイベント {#mouse-and-pointer-events}

マウスまたは、ポインタのイベントを通じて使われる機能がキーボード単体でも同じように使用できるようにしてください。ポインタデバイスだけに依存した実装は、多くの場合にキーボードユーザがアプリケーションを使えない原因になります。

これを説明するために、クリックイベントによってアクセシビリティが損なわれるよくある例を見てみましょう。以下の画像はアウトサイドクリックパターンというユーザが要素の外側をクリックして開いている要素を閉じられるパターンです。

<img src="../images/docs/outerclick-with-mouse.gif" alt="クリックアウトサイドパターンで実装されたトグルボタンがポップアップリストを開き、閉じる動作が機能することを示すマウスで操作される様子" />

これは通常、ポップアップを閉じる役割をもつ `click` イベントを `window` オブジェクトに付与することで実装します。

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

これはマウスのようなポインタデバイスでは問題なく機能しますが、キーボード単体で操作しようとした場合、タブキーによって次の要素に移動しても `window` オブジェクトは `click` イベントを受け取らないため、うまく機能しません。一部のユーザはあなたのアプリを利用できなくなってしまうでしょう。

<img src="../images/docs/outerclick-with-keyboard.gif" alt="クリックアウトサイドパターンで実装されたトグルボタンがポップアップを開き、キーボードによってフォーカスが外れてもポップアップが閉じず、他の画面上の要素を隠してしまう様子" />

これと同じ機能は `onBlur` と `onFocus` のような適切なイベントハンドラを代わりに用いることで実現できます。

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // We close the popover on the next tick by using setTimeout.
  // This is necessary because we need to first check if
  // another child of the element has received focus as
  // the blur event fires prior to the new focus event.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // If a child receives focus, do not close the popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React assists us by bubbling the blur and
    // focus events to the parent.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

上記のコードは、ポインタデバイスを使うユーザとキーボードを使うユーザの双方にこの機能を公開します。さらに、`aria-*` props を加えるとスクリーンリーダを使うユーザもサポートできます。話を簡単にするため、ポップアップの選択肢を `矢印キー` で操作できるようにするキーボードイベントは実装していません。

<img src="../images/docs/blur-popover-close.gif" alt="ポップアップリストがマウスとキーボードのどちらを使うユーザにも使いやすくなった様子" />

これはポインタデバイスとマウスイベントだけに依存するとキーボードを使うユーザにとって機能が損なわれてしまう数多くの具体例のうちのひとつです。つねにキーボードによるテストをすれば、キーボードに対応するイベントを使うことで解決できる問題領域をすばやく発見できるでしょう。

## より複雑なウィジェット {#more-complex-widgets}

ユーザ体験がより複雑であるほど、よりアクセシビリティが損なわれるということがあってはいけません。できるだけ HTML に近くなるようコーディングすればアクセシビリティを最も簡単に達成できますが、一方でかなり複雑なウィジェットでもアクセシビリティを保ってコーディングすることができます。

ここでは [ARIA のロール](https://www.w3.org/TR/wai-aria/#roles) や [ARIA のステートとプロパティ](https://www.w3.org/TR/wai-aria/#states_and_properties)についての知識も必要となります。これらは JSX で完全にサポートされている HTML 属性が詰まったツールボックスであり、十分にアクセシブルで高機能な React コンポーネントの構築を可能にしてくれます。

それぞれの種類のウィジェットはそれぞれ特定のデザインパターンを持っており、ユーザやユーザエージェントはそれらが特定の方法で機能することを期待します：

- [WAI-ARIA Authoring Practices - Design Patterns and Widgets](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Examples](https://heydonworks.com/article/practical-aria-examples/)
- [Inclusive Components](https://inclusive-components.design/)

## その他に考慮すべきポイント {#other-points-for-consideration}

### 言語設定 {#setting-the-language}

ページテキストで使用する自然言語を明示して、読み上げソフトが適切な音声設定を選ぶために利用できるようにしてください：

- [WebAIM - Document Language](https://webaim.org/techniques/screenreader/#language)

### ドキュメントの title の設定 {#setting-the-document-title}

ドキュメントの `<title>` は、ユーザが現在いるページのコンテキストを認識していられるように、そのページのコンテンツを正しく説明するものにしてください：

- [WCAG - Understanding the Document Title Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

React では [React Document Title Component](https://github.com/gaearon/react-document-title) を使用することで title を設定できます。

### 色のコントラスト {#color-contrast}

あなたのウェブサイトにある全ての読めるテキストが、色弱のユーザにも最大限読めるように配慮した色のコントラストがあることを確認してください：

- [WCAG - Understanding the Color Contrast Requirement](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Everything About Color Contrast And Why You Should Rethink It](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - What is Color Contrast](https://a11yproject.com/posts/what-is-color-contrast/)

適切な色の組み合わせをウェブサイト内の全てのケースについて手作業で行うのは面倒になりがちなので、代わりに[アクセシブルなカラーパレット全体を Colorable で計算する](https://jxnblk.com/colorable/)ことができます。

以下に述べる aXe および WAVE ツールのどちらも同じように色のコントラストのテストを備えておりコントラストの違反を報告してくれます。

コントラストをチェックする能力を拡張したい場合は、以下のツールが利用できます：

- [WebAIM - Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Color Contrast Analyzer](https://www.paciellogroup.com/resources/contrastanalyser/)

## 開発とテストのツール {#development-and-testing-tools}

アクセシブルなウェブアプリケーションの作成を支援するために利用できる様々なツールがあります。

### キーボード {#the-keyboard}

最も簡単で最も重要なチェックのうちのひとつは、ウェブサイト全体がキーボード単体であまねく探索でき、使えるかどうかのテストです。これは以下の手順でチェックできます。

1. マウスを外します。
2. `Tab` と `Shift+Tab` を使ってブラウズします。
3. 要素を起動するのに `Enter` を使用します。
4. 必要に応じて、キーボードの矢印キーを使ってメニューやドロップダウンリストなどの要素を操作します。

### 開発支援 {#development-assistance}

アクセシビリティ機能には JSX のコード内で直接チェックできるものもあります。JSX に対応した IDE では、ARIA ロールやステートやプロパティに対する intellisense によるチェックが既に提供されていることが多いでしょう。他にも以下のツールを使うこともできます：

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

ESLint の [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) プラグインはあなたの JSX コードのアクセシビリティに対して、AST による lint のフィードバックを提供します。多くの IDE はコード解析とソースコードのウィンドウに直接そのフィードバックを統合できるようになっています。

[Create React App](https://github.com/facebookincubator/create-react-app) はこのプラグインを備えており、一部のルールを有効化しています。もし、より多くのアクセシビリティルールを有効化したいときは、プロジェクトルートに `.eslintrc` ファイルを作成し、以下の内容を書き込んでください：

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### ブラウザでアクセシビリティをテストする {#testing-accessibility-in-the-browser}

ブラウザからウェブページのアクセシビリティを検査できるツールは沢山あります。それらのツールはあなたが作成した HTML の技術的なアクセシビリティしかチェックできないため、ここで言及した他のアクセシビリティ確認法と組み合わせて使用してください。

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque System はアプリケーションの自動化された E2E アクセシビリティテストを行う [aXe-core](https://github.com/dequelabs/axe-core) を提供しています。このモジュールは Selenium に統合できます。

[The Accessibility Engine](https://www.deque.com/products/axe/) もしくは aXe は、`aXe-core` により構築されたアクセシビリティを検査するブラウザ拡張機能です。

[@axe-core/react](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react) モジュールを使用して、開発時やデバッグ時にこれらによるアクセシビリティの検査結果を直接コンソールへ出力させることもできます。

#### WebAIM WAVE {#webaim-wave}

[Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) はアクセシビリティに関する別のブラウザ拡張機能です。

#### アクセシビリティ検査ツールとアクセシビリティツリー {#accessibility-inspectors-and-the-accessibility-tree}

[アクセシビリティツリー (The Accessibility Tree)](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) は、スクリーンリーダのような補助技術に公開されるべきすべての要素についてアクセス可能なオブジェクトを含んだ DOM ツリーのサブセットです。

一部のブラウザではアクセシビリティツリー内の各要素のアクセシビリティに関する情報を簡単に見ることができます：

- [Using the Accessibility Inspector in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Using the Accessibility Inspector in Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Using the Accessibility Inspector in OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### スクリーンリーダ {#screen-readers}

アクセシビリティのテストの一環として、スクリーンリーダによるテストを行うべきです。

ブラウザとスクリーンリーダの相性に注意してください。選択したスクリーンリーダに最適なブラウザでアプリケーションのテストをすることをおすすめします。

### よく使われるスクリーンリーダ {#commonly-used-screen-readers}

#### NVDA と FireFox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) または NVDA は広く利用されているオープンソースの Windows 向けスクリーンリーダーです。

NVDA を最大限に活用する方法は以下のガイドを参照してください：

- [WebAIM - Using NVDA to Evaluate Web Accessibility](https://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver と Safari {#voiceover-in-safari}

VoiceOver は Apple 社製品に統合されたスクリーンリーダです。

VoiceOver を有効化して使用する方法は以下のガイドを参照してください：

- [WebAIM - Using VoiceOver to Evaluate Web Accessibility](https://webaim.org/articles/voiceover/)
- [Deque - VoiceOver for OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver for iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS と Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) もしくは JAWS は、Windows 上での使用例が豊富なスクリーンリーダです。

JAWS を最大限に活用する方法は以下のガイドを参照してください：

- [WebAIM - Using JAWS to Evaluate Web Accessibility](https://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### 他のスクリーンリーダ {#other-screen-readers}

#### ChromeVox と Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) は Chromebook に統合されたスクリーンリーダで、Google Chrome では[拡張機能](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en)として利用可能です。

ChromeVox を最大限に活用する方法は以下のガイドを参照してください：

- [Google Chromebook Help - Use the Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](https://www.chromevox.com/keyboard_shortcuts.html)
