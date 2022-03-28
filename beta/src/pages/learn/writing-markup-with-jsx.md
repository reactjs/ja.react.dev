---
title: JSX でマークアップを記述する
---

<Intro>

JSX とは JavaScript の拡張であり、JavaScript ファイル内に HTML のようなマークアップを書けるようにするものです。コンポーネントを書く手段はほかにも存在しますが、ほとんどの React 開発者は JSX の簡潔さを好んでいるため、ほとんどのコードベースで使われています。

</Intro>

<YouWillLearn>

* React がマークアップとレンダリングロジックを混在させる理由
* JSX と HTML の違い
* JSX で情報を表示する方法

</YouWillLearn>

## JSX: JavaScript にマークアップを入れ込む {/*jsx-putting-markup-into-javascript*/}

これまでウェブは HTML、CSS そして JavaScript を使って作られてきました。長年にわたり、ウェブ開発者はコンテンツは HTML で書き、デザインは CSS で書き、ロジックは JavaScript で書き、そして大抵の場合はそれらを別ファイルにしていました。コンテンツは HTML 内にマークアップされ、そのページのロジックは別ファイルの JavaScript に存在していました：

<<<<<<< HEAD
![HTML と JavaScript は別ファイル](/images/docs/illustrations/i_html_js.svg)
=======
<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>
>>>>>>> 5e9d673c6bc1530c901548c0b51af3ad3f91d594

しかしウェブがよりインタラクティブなものになるにつれ、ロジックがコンテンツの中身をも決めるようになっていきました。JavaScript が HTML の領分も担当するようになったのです！ これが、**React ではロジックとマークアップを同じ場所、すなわちコンポーネントに書く**理由です。

<<<<<<< HEAD
![マークアップを混ぜ込んだ JavaScript 関数](/images/docs/illustrations/i_jsx.svg)
=======
<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

Sidebar.js

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

Form.js

</Diagram>

</DiagramGroup>
>>>>>>> 5e9d673c6bc1530c901548c0b51af3ad3f91d594

ボタンのレンダリングロジックとマークアップを同じ場所に書くことで、それらが毎回の編集時に同期されることが保証されます。逆に、ボタンのマークアップとサイドバーのマークアップといった互いに関係のない詳細は、互いに分離されるようになるため、それぞれをより安全に独立して更新できるようになります。

個々の React のコンポーネントは JavaScript の関数であり、React がブラウザに表示するためのマークアップを含めることができます。そのマークアップを表現するのに、React コンポーネントは JSX と呼ばれる拡張構文を使用します。JSX は HTML ととてもよく似ていますが、より構文が厳密であり、動的な情報を表示することができます。理解するには、HTML マークアップを JSX マークアップへと変換してみるのが最もよいでしょう。

<Note>

[JSX と React は別物](/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)であり、互いに無関係に使用することが可能です。

</Note>

## HTML を JSX に変換する {/*converting-html-to-jsx*/}

このような（まったく正しい）HTML があるとしましょう：

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

これをコンポーネントの中に入れたいとします：

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

そのままコピー・ペーストした場合、うまく動きません：


<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

これは、JSX の方が厳密であり、HTML よりも若干ルールが多いからです。上記のエラーメッセージを読めばマークアップの修正方法は分かるようになっていますが、今は以下のガイドに従えば大丈夫です。

<Note>

大抵の場合は React が画面上に表示するエラーメッセージが、問題のある場所を見つける手がかりになります。困ったら読んでみてください！

</Note>

## JSX のルール {/*the-rules-of-jsx*/}

### 1. 単一のルート要素を返す {/*1-return-a-single-root-element*/}

コンポーネントから複数の要素を返すには、**それを単一の親タグで囲みます**。

例えば `<div>` を使うことができます：

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


マークアップに余分な `<div>` を加えたくない場合は、`<>` と `</>` を代わりに使うことができます：

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

この中身のないタグは *[React フラグメント](TODO)* と呼ばれるものです。フラグメントを使えば、ブラウザの HTML ツリーに痕跡を残さずに複数の要素をまとめることができます。

<DeepDive title="JSX タグが複数あるときにラップしないといけない理由">

JSX は HTML のように見えますが、裏ではプレーンな JavaScript オブジェクトに変換されます。関数から 2 つのオブジェクトを返したい場合、配列でラップしないといけませんよね。2 つの JSX タグを返したい場合に別のタグかフラグメントでラップしないといけないのも、同じ理由です。

</DeepDive>

### 2. すべてのタグを閉じる {/*2-close-all-the-tags*/}

JSX ではすべてのタグを明示的に閉じる必要があります。`<img>` のような自動で閉じるタグは `<img />` のようになりますし、`<li>oranges` のような囲みタグは `<li>oranges</lit>` と書かなければなりません。

Hedy Lamarr の画像とリスト項目は、閉じタグを書いた状態では以下のようになります：

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. （ほぼ）すべてキャメルケースで！ {/*3-camelcase-salls-most-of-the-things*/}

JSX は JavaScript に変換され、中に書かれた属性は JavaScript オブジェクトのキーになります。コンポーネント内では、これらの属性を変数に読み出したくなることがよくあります。しかし JavaScript の変数名には一定の制約があります。例えば、名前にハイフンを含めたり `class` のような予約語を使ったりすることはできません。

このため、React では多くの HTML および SVG の属性はキャメルケースで書かれます。例えば `stroke-width` の代わりに `strokeWidth` を使います。`class` は予約語なので、React では `className` を使います（[対応するDOMプロパティ](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)が由来となっています）。

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

全リストは[React DOM 要素に存在する属性の一覧](TODO)にあります。何かを間違ったとしても心配は要りません。[ブラウザのコンソール](https://developer.mozilla.org/docs/Tools/Browser_Console)にメッセージと修正の提案が表示されるようになっています。

<Gotcha>

歴史的理由により、[`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) と [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) 属性は HTML 属性と同じようにハイフン付きで書くことになっています。

</Gotcha>

### ヒント：JSX コンバータを使う {/*pro-tip-use-a-jsx-converter*/}

既存のマークアップの属性をすべて書きかえていくのは時に面倒です！ 既存の HTML や SVG を JSX に変換する場合は[コンバータ](https://transform.tools/html-to-jsx)を使うことをお勧めします。コンバータは実用上非常に役に立ちますが、自分でも楽に JSX が書けるよう、何が起こっているのかを理解しておくことも大切です。

最終結果は以下のようなものになります：

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>

これで JSX が存在する理由と、コンポーネント内での使い方について理解しました：

* レンダリングロジックとマークアップは互いに関連しているので、React ではそれらをグループ化する。
* JSX は HTML と似ているがいくつかの違いがある。必要なら[コンバータ](https://transform.tools/html-to-jsx)を使える。
* エラーメッセージを見れば、大概はマークアップの修正方法について指針が得られる。

</Recap>



<Challenges>

### HTML を JSX に変換する {/*convert-some-html-to-jsx*/}

この HTML はコンポーネント内に貼り付けられたものですが、正しい JSX ではありません。修正してください：

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

手作業で直すかコンバータを使うかはお任せします！

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
