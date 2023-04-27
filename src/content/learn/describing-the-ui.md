---
title: UI の記述
---

<Intro>

React は、ユーザインターフェース（UI）を表示するための JavaScript ライブラリです。UI はボタンやテキスト、画像といった小さな要素から構成されています。React ではこれらを、ネストして再利用できる*コンポーネント*にまとめることができます。ウェブサイトであれ携帯電話アプリであれ、画面上のすべてのものはコンポーネントに分解することができます。この章では、React コンポーネントを作成し、カスタマイズし、条件付きで表示する方法について学びます。

</Intro>

<YouWillLearn isChapter={true}>

* [初めてのコンポーネントの書き方](/learn/your-first-component)
* [コンポーネントファイルを複数に分ける理由とその方法](/learn/importing-and-exporting-components)
* [JSX を使って JavaScript にマークアップを追加する方法](/learn/writing-markup-with-jsx)
* [JSX 内で波括弧を使って JavaScript の機能にアクセスする方法](/learn/javascript-in-jsx-with-curly-braces)
* [コンポーネントを props を使ってカスタマイズする方法](/learn/passing-props-to-a-component)
* [コンポーネントを条件付きでレンダーする方法](/learn/conditional-rendering)
* [複数のコンポーネントを同時にレンダーする方法](/learn/rendering-lists)
* [コンポーネントを純粋に保つことで混乱を避ける方法](/learn/keeping-components-pure)

</YouWillLearn>

## 初めてのコンポーネント {/*your-first-component*/}

React アプリケーションは*コンポーネント*と呼ばれる独立した UI のパーツで構成されています。React コンポーネントとは、マークアップを添えることができる JavaScript 関数です。コンポーネントは、ボタンのような小さなものであることもあれば、ページ全体といった大きなものであることもあります。以下は、3 つの `Profile` コンポーネントをレンダーする `Gallery` コンポーネントの例です：

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

**[初めてのコンポーネント](/learn/your-first-component)** を読んで、React コンポーネントの宣言方法、使用方法について学びましょう。

</LearnMore>

## コンポーネントのインポートとエクスポート {/*importing-and-exporting-components*/}

1 つのファイルに多くのコンポーネントを宣言することもできますが、大きなファイルは取り回しが難しくなります。これを解決するために、コンポーネントを個別のファイルに*エクスポート*し、別のファイルからそのコンポーネントを*インポート*することができます：


<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

**[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)** を読んで、コンポーネントを個々の専用ファイルに分割する方法を学びましょう。

</LearnMore>

## JSX でマークアップを記述する {/*writing-markup-with-jsx*/}

各 React コンポーネントは、ブラウザにレンダーされるマークアップを含んだ JavaScript 関数です。React コンポーネントは、マークアップを表現するために JSX という拡張構文を使用します。JSX は HTML によく似ていますが、少し構文が厳密であり、動的な情報を表示することができます。

既存の HTML マークアップを React コンポーネントに貼り付けても、常にうまく機能するわけではありません。

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
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

このような既存の HTML がある場合は、[コンバータ](https://transform.tools/html-to-jsx)を使って修正することができます。

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
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

**[JSX でマークアップを記述する](/learn/writing-markup-with-jsx)** を読んで、正しい JSX の書き方を学びましょう。

</LearnMore>

## JSX に波括弧で JavaScript を含める {/*javascript-in-jsx-with-curly-braces*/}

JSX を使うことで、JavaScript ファイル内に HTML のようなマークアップを記述し、レンダーのロジックとコンテンツを同じ場所に配置することができます。時には、そのマークアップ内でちょっとした JavaScript ロジックを追加したり、動的なプロパティを参照したりしたいことがあります。このような状況では、JSX 内で波括弧を使い JavaScript への「窓を開ける」ことができます。

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

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

**[JSX に波括弧で JavaScript を含める](/learn/javascript-in-jsx-with-curly-braces)** を読んで、JSX 内 から JavaScript のデータにアクセスする方法を学びましょう。

</LearnMore>

## コンポーネントに props を渡す {/*passing-props-to-a-component*/}

React コンポーネントでは、*props* を使ってお互いに情報をやり取りします。親コンポーネントは、子コンポーネントに props を与えることで、情報を渡すことができます。HTML の属性 (attribute) と似ていますが、オブジェクト、配列、関数、そして JSX まで、どのような JavaScript の値でも渡すことができます！

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

**[コンポーネントに props を渡す](/learn/passing-props-to-a-component)** を読んで、props の渡し方と読み取り方を学びましょう。

</LearnMore>

## 条件付きレンダー {/*conditional-rendering*/}

コンポーネントは、さまざまな条件によって表示内容を切り替える必要がよくあります。React では、JavaScript の `if` 文、`&&` や `? :` 演算子などの構文を使って、条件付きで JSX をレンダーすることができます。

この例では、JavaScript の `&&` 演算子を使い、チェックマークを条件付きでレンダーしています。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

**[条件付きレンダー](/learn/conditional-rendering)** を読んで、コンテンツを条件付きでレンダーするためのさまざまな方法を学びましょう。

</LearnMore>

## リストのレンダー {/*rendering-lists*/}

データの集まりから複数のよく似たコンポーネントを表示したいことがよくあります。React で JavaScript の `filter()` や `map()` を使って、データの配列をフィルタリングしたり、コンポーネントの配列に変換したりすることができます。

配列内の各要素には、`key` を指定する必要があります。通常、データベースの ID を `key` として使うことになるでしょう。key は、リストが変更されても各アイテムのリスト内の位置を React が追跡できるようにするために必要です。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

**[リストのレンダー](/learn/rendering-lists)** を読んで、コンポーネントのリストをレンダーする方法と、key の選択方法を学びましょう。

</LearnMore>

## コンポーネントを純粋に保つ {/*keeping-components-pure*/}

いくつかの JavaScript の関数は*純関数*です。純関数には以下の特徴があります。

* **自分の仕事に集中する。** 呼び出される前に存在していたオブジェクトや変数を変更しない。
* **同じ入力には同じ出力。** 同じ入力を与えると、純関数は常に同じ結果を返す。

コンポーネントを常に厳密に純関数として書くことで、コードベースが成長するにつれて起きがちな、あらゆる種類の不可解なバグ、予測不可能な挙動を回避することができます。以下は純粋ではないコンポーネントの例です。

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

このコンポーネントを純粋にするには、既に存在する変数を書き換えるのではなく、prop を渡すようにすることができます。

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

**[コンポーネントを純粋に保つ](/learn/keeping-components-pure)** を読んで、予測可能な純関数としてコンポーネントを作成する方法を学びましょう。

</LearnMore>

## 次のステップ {/*whats-next*/}

[初めてのコンポーネント](/learn/your-first-component) に進んで、この章をページごとに読み進めましょう！

もしくは、すでにこれらのトピックに詳しい場合、[インタラクティビティの追加](/learn/adding-interactivity) について読んでみましょう。
