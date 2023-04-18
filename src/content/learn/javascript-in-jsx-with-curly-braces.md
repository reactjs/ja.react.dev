---
title: JSX に波括弧で JavaScript を含める
---

<Intro>

JSX により、JavaScript ファイル内に HTML のようなマークアップを書いて、レンダリングロジックとコンテンツを同じ場所にまとめられるようになります。ときに、そのマークアップの中で JavaScript のロジックを書いたり動的なプロパティを参照したりしたくなることがあります。このような場合、JSX 内で波括弧を使うことで、JavaScript への入り口を開くことができます。

</Intro>

<YouWillLearn>

* 引用符を使って文字列を渡す方法
* 波括弧を使って JSX 内で JavaScript 変数を参照する方法
* 波括弧を使って JSX 内で JavaScript 関数を呼び出す方法
* 波括弧を使って JSX 内でオブジェクトを利用する方法

</YouWillLearn>

## 引用符で文字列を渡す {/*passing-strings-with-quotes*/}

JSX に文字列の属性を渡したい場合、それをシングルクオートかダブルクオートで囲みます：

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

この例では `"https://i.imgur.com/7vQD0fPs.jpg"` と `"Gregorio Y. Zara"` が文字列として渡されています。

では `src` や `alt` のテキストを動的に指定したい場合はどうすればいいのでしょう？ **`"` と `"` を `{` と `}` に置き換えることで、JavaScript の値を使う**ことができるのです：

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

`className="avatar"` は `"avatar"` という CSS クラス名を指定して画像を円形にしており、`src={avatar}` は `avatar` という名前の JavaScript 変数を読み出している、という違いに注意してください。波括弧を使うことで、マークアップの中で直接 JavaScript を使えるようになるからです。

## 波括弧は JavaScript 世界への窓口 {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX とは JavaScript を書く特殊な方法のひとつです。つまりその中で JavaScript が使えるということであり、そのための手段が波括弧 `{}` です。以下の例では、とある科学者の名前を `name` として宣言し、それを `<h1>` 内に波括弧を使って埋め込んでいます：

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

`name` の値を `'Gregorio Y. Zara'` から `'Hedy Lamarr'` にしてみてください。To Do リストのタイトルが変わりましたか？

波括弧の中では `formatDate()` のような関数呼び出しも含む、あらゆる JavaScript の式が動作します：

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### 波括弧を使える場所 {/*where-to-use-curly-braces*/}

JSX 内部で波括弧を使う方法は 2 つだけです：

1. **テキストとして**、JSX タグの中で直接使う：`<h1>{name}'s To Do List</h1>` は動作しますが `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` は動作しない。
2. **属性として**、`=` 記号の直後に使う：`src={avatar}` は `avatar` という変数を読み出すが、 `src="{avatar}"` と書くと `"{avatar}"` という文字列そのものを渡す。

## 「ダブル波括弧」で JSX 内に CSS やその他のオブジェクトを含める {/*using-double-curlies-css-and-other-objects-in-jsx*/}

文字列や数字、その他の JavaScript の式に加えて、オブジェクトを JSX に渡すこともできます。オブジェクトも波括弧を使って `{ name: "Hedy Lamarr", inventions: 5 }` のように記述しますね。ですので JS オブジェクトを JSX に渡すときには、オブジェクトを別の波括弧のペアでラップして、`person={{ name: "Hedy Lamarr", inventions: 5 }}` のようにする必要があります。

これは JSX 内でインラインの CSS スタイルを使うときに目にすることがあります。React でインラインスタイルを使わなければいけないわけではありません（大抵の場合は CSS クラスでうまくいきます）。しかしインラインスタイルが必要な場合は、`style` 属性にオブジェクトを渡します：

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

`backgroundColor` や `color` の値を変更してみてください。

以下のように書けば波括弧の中に書かれた JavaScript のオブジェクトがよく見えてくるでしょう：

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

次に `{{` と `}}` を見たときには、JSX の波括弧の中に書かれたオブジェクトに過ぎないということを思い出してください！

<Pitfall>

インラインの `style` 属性はキャメルケースで書きます。例えば HTML で `<ul style="background-color: black">` となっていれば、あなたのコンポーネントでは `<ul style={{ backgroundColor: 'black' }}>` になります。

</Pitfall>

## オブジェクトと波括弧でさらにいろいろやってみる {/*more-fun-with-javascript-objects-and-curly-braces*/}

複数の式をひとつのオブジェクト内に移動して、JSX の波括弧内から参照することができます：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

この例では `person` という JavaScript オブジェクト内に `name` 文字列と `theme` オブジェクトが含まれています。

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

コンポーネントは `person` から始めて以下のように書くことでこれらの値を使うことができます：

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX ではデータやロジックを書くのに JavaScript を使うため、JSX はテンプレート言語としては非常にミニマルです。

<Recap>

これで JSX についてのほとんどを学びました：

* 引用符内に書かれた JSX 属性は文字列として渡される。
* 波括弧を使えば JavaScript のロジックや変数をマークアップ内に含めることができる。
* 波括弧はタグのコンテンツの中で使うか、属性の場合は `=` の直後で使う。
* `{{` と `}}` は特別な構文ではなく、JSX の波括弧にくっつくように書かれた JavaScript オブジェクトである。

</Recap>

<Challenges>

#### 間違いを修正する {/*fix-the-mistake*/}

以下のコードは `Objects are not valid as a React child` というエラーを出してクラッシュします：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

どこが問題か分かりますか？

<Hint>波括弧の中に何が書かれているのか見てみましょう。正しいものが入っていますか？</Hint>

<Solution>

このエラーが起きているのは、マークアップ内で文字列ではなく*オブジェクトそのもの*をレンダーしているからです。つまり `<h1>{person}'s Todos</h1>` が `person` オブジェクト全体をレンダーしようとしてしまっているのです。テキスト内容としてオブジェクトをそのまま含めようとすると、React はそれをどう表示したらいいか分からないため、エラーをスローします。

修正するには、`<h1>{person}'s Todos</h1>` を `<h1>{person.name}'s Todos</h1>` で置き換えてください：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### オブジェクト内にデータを移動する {/*extract-information-into-an-object*/}

画像 URL を `person` オブジェクト内に移動しましょう。

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

画像 URL を `person.imageUrl` というプロパティに移動して、それを `<img>` タグから波括弧を使って読み取ります：

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### JSX 波括弧内に式を書く {/*write-an-expression-inside-jsx-curly-braces*/}

以下のオブジェクトでは画像の URL が、ベース URL・`imageId`・`imageSize`・ファイル拡張子の 4 つに分割されています。

画像 URL を指定するところで、ベース URL（常に `'https://i.imgur.com/'`）、`imageId` (`'7vQD0fP'`)、`imageSize` (`'s'`)、ファイル拡張子（常に `'.jpg'`）の 4 つの値を結合したいと思っています。ですが `<img>` タグが `src` を指定する部分で何かがおかしいようです。

修正できますか？

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

修正がうまくいったことを確認するには、`imageSize` の値を `'b'` に書きかえてみてください。編集すると画像のサイズが変わるはずです。

<Solution>

`src={baseUrl + person.imageId + person.imageSize + '.jpg'}` のように書いてください。

1. `{` で JavaScript 式が書けるようになる
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` が正しい URL を生成する
3. `}` で JavaScript 式を終了する

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

あるいは以下の `getImageUrl` のように、別の関数にこの式を移動することもできます：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

変数と関数を利用することで、マークアップをシンプルに保つことができます！

</Solution>

</Challenges>
