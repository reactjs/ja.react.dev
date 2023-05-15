---
title: コンポーネントに props を渡す
---

<Intro>

React コンポーネントは互いにやりとりをする際に *props* というものを使います。親コンポーネントは子コンポーネントに props を渡すことで情報を伝えることができるのです。props は HTML の属性と似ていると思われるかもしれませんが、props ではオブジェクトや配列、関数などのあらゆる JavaScript の値を渡すことができます。

</Intro>

<YouWillLearn>

* コンポーネントに props を渡す方法
* コンポーネントから props を読み出す方法
* props のデフォルト値を指定する方法
* コンポーネントに JSX を渡す方法
* props は時間とともに変化する

</YouWillLearn>

## お馴染みの props {/*familiar-props*/}

props とは JSX タグに渡す情報のことです。例えば `className`、`src`、`alt`、`width` や `height` は `<img>` に渡すことのできる props の例です：

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

`<img>` に渡すことができる props の種類は事前に決められています（ReactDOM は [HTML 標準](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element)に準拠しています）。しかし `<Avatar>` のような*あなた独自の*コンポーネントの場合は、任意の props を渡してそれをカスタマイズできます。以下でやり方を説明します。

## コンポーネントに props を渡す {/*passing-props-to-a-component*/}

以下のコードでは、`Profile` コンポーネントは子コンポーネントである `<Avatar>` に何の props も渡していません：

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

以下の 2 ステップで `Avatar` に props を与えることができます。

### Step 1: 子コンポーネントに props を渡す {/*step-1-pass-props-to-the-child-component*/}

まず、`Avatar` に何か props を渡します。例えば `person`（オブジェクト）と `size`（数値）を渡してみましょう：

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

もし `person=` の後にある二重波括弧が分からない場合、これが JSX 波括弧の中にある[単なるオブジェクト](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)であるということを思い出してください。

</Note>

これでこの props を `Avatar` コンポーネント内から読み出せるようになります。

### Step 2: 子コンポーネントから props を読み出す {/*step-2-read-props-inside-the-child-component*/}

これらの props を読み出すには、`function Avatar` の直後の `({` と `})` 内で、コンマで区切って `person, size` のように名前を指定します。これにより `Avatar` のコード内で変数と同じようにこれらの props が使えるようになります。

```js
function Avatar({ person, size }) {
  // person and size are available here
}
```

`Avatar` 内に `person` や `size` を使って何かをレンダーするロジックを書き加えれば完成です。

これで `Avatar` に様々な props を渡すことで様々に表示を変えられるようになりました。実際に値をいじってみましょう！

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

props のおかげで、親と子のコンポーネントを独立して考えることができるようになります。例えば、`Profile` で `person` や `size` を変更するときに `Avatar` 内でどう使われるかを気にしないでよくなります。同様に、`Avatar` がこれらの props をどのように使うのかは、`Profile` を見ずに変更できるようになります。

props とは自分で調整できるコントローラの「ツマミ」のようなものです。関数における引数と同じ役割を果たしています。むしろ、props があなたのコンポーネントの唯一の引数です！ React コンポーネントは `props` というオブジェクトを唯一の引数として受け取っているのです。

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

通常は `props` オブジェクト全体を必要とすることはないため、個々の props へと分割代入します。

<Pitfall>

props を宣言する際は `(` と `)` の中で **`{` と `}` という波括弧のペアを入れ忘れない**ようにしましょう：

```js
function Avatar({ person, size }) {
  // ...
}
```

この構文は[「分割代入 (destructuring)」](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)と呼ばれるもので、関数の引数からプロパティを読み出す以下のようなコードと同等です：

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## props のデフォルト値を指定する {/*specifying-a-default-value-for-a-prop*/}

props に、値が渡されなかった場合にフォールバックとして使うデフォルト値を指定したい場合、分割代入の中でパラメータ名の直後に `=` とデフォルト値を書くことができます：

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

これで、`size` プロパティを指定せずに `<Avatar person={...} />` のようにレンダーされた場合、`size` は `100` にセットされます。

このデフォルト値は `size` がない場合や `size={undefined}` を渡した場合にのみ使用されます。`size={null}` や `size={0}` を渡した場合にはデフォルト値は**使われません**。

## JSX スプレッド構文で props を転送する {/*forwarding-props-with-the-jsx-spread-syntax*/}

ときに、props の受け渡しが冗長な繰り返しになってしまうことがあります：

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

繰り返しの多いコードが悪いわけではありませんし、その方が読みやすいこともあるでしょう。しかし簡潔であることに価値があることもあります。この `Profile` が `Avatar` に対してやっているように、コンポーネントの中には props をそのまま子コンポーネントに転送するものがあります。`Profile` は props を直接的に使っているわけではありませんので、以下のような「スプレッド」構文を使って短く書く方が理にかなっているかもしれません：

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

これにより、`Profile` に渡された props を、個々の名前を列挙することなくすべて `Avatar` に転送できます。

**スプレッド構文は慎重に使ってください**。この構文をあらゆるコンポーネントで使っているなら、何かが間違っています。多くの場合は、コンポーネントを分割して JSX として children を渡すべきというサインです。今からこれについて述べていきます。

## children として JSX を渡す {/*passing-jsx-as-children*/}

ブラウザの組み込みタグをネストすることはよくありますね。

```js
<div>
  <img />
</div>
```

同様にして独自コンポーネントもネストしたくなることがあります。

```js
<Card>
  <Avatar />
</Card>
```

このように JSX タグ内でコンテンツをネストした場合、親側のコンポーネントはその中身を `children` という props として受け取ります。例えば以下の `Card` コンポーネントは、`<Avatar />` がセットされた `children` プロパティを受け取って、ラッパ div 要素の内部にそれをレンダーしています：

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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

`<Card>` 内の `<Avatar>` を何かテキストに置き換えてみて、ネストされているどんなコンテンツでも `Card` コンポーネントは囲んで表示できるということを確かめてください。中に何が表示されるかあらかじめ知っておく必要はありません。このような柔軟なパターンは、様々なところで目にすることになるでしょう。

`children` プロパティを有するコンポーネントには、親に任意の JSX で「埋めて」もらうための「穴」が開いている、と考えることができます。`children` は、パネルやグリッドのような視覚的に何かを囲む要素に使うことができます。

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='A puzzle-like Card tile with a slot for "children" pieces like text and Avatar' />

## props は時間とともに変化する {/*how-props-change-over-time*/}

以下の `Clock` コンポーネントは親コンポーネントから `color` と `time` という 2 つの props を受け取っています。（親コンポーネントのコードは、まだ解説していない [state](/learn/state-a-components-memory) を使っているため省略しています。）

以下の選択ボックスでカラーを変えてみてください：

<Sandpack>

```js Clock.js active
export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

この例は、**コンポーネントは時間経過とともに別の props を受け取る可能性がある**ということを示しています。props は常に固定だとは限らないのです！ ここでは `time` プロパティは毎秒変化していますし、`color` プロパティもあなたが別の色を選択するたびに変化します。props とはコンポーネントの最初の時点ではなく、任意の時点でのコンポーネントのデータを反映するものなのです。

しかし、props は[イミュータブル (immutable)](https://en.wikipedia.org/wiki/Immutable_object) です。これは「不変な」という意味のコンピュータサイエンス用語です。コンポーネントの props が（例えばユーザ操作や新しいデータの到着に応じて）変わらないといけない場合、親のコンポーネントに*別の props*、つまり新しいオブジェクトを渡してもらう必要があります！ 古い props は忘れられ、使われていたメモリは JavaScript エンジンがそのうち回収します。

**「props の書き換え」をしようとしてはいけません。**（上記のカラー選択のように）ユーザの入力に反応する必要がある場合は、「state のセット」が必要です。これについては [State: A Component's Memory](/learn/state-a-components-memory) で学びます。

<Recap>

* props を渡すには HTML で属性を書くのと同様のやり方で JSX 内に書く。
* props を読み出すには、`function Avatar({ person, size })` のような分割代入構文を使う。
* `size = 100` のようなデフォルト値を指定でき、これは props がない場合や `undefined` の場合に使われる。
* `<Avatar {...props} />` のような JSX スプレッド構文ですべての props を転送できるが、多様は禁物！
* `<Card><Avatar /></Card>` のようなネストされた JSX を書くと `Card` コンポーネントの `children` プロパティになる。
* props とはある時点での読み取り専用のスナップショットである。レンダー毎に新しい props のバージョンを受け取る。
* props を書き換えることはできない。インタラクティブ性が必要な場合は state を設定する必要がある。

</Recap>



<Challenges>

#### コンポーネント抽出 {/*extract-a-component*/}

以下の `Gallery` コンポーネントには 2 名のプロフィール用にとても似たマークアップが含まれてしまっています。ここから `Profile` というコンポーネントを抽出してコードの重複を減らしてください。どんな props を渡すのかは自分で決める必要があるでしょう。

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            physicist and chemist
          </li>
          <li>
            <b>Awards: 4 </b> 
            (Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal)
          </li>
          <li>
            <b>Discovered: </b>
            polonium (element)
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Profession: </b> 
            geochemist
          </li>
          <li>
            <b>Awards: 2 </b> 
            (Miyake Prize for geochemistry, Tanaka Prize)
          </li>
          <li>
            <b>Discovered: </b>
            a method for measuring carbon dioxide in seawater
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

片方の科学者のマークアップを取り出すところから始めましょう。もう片方の人物と合わない部分を探し出し、その部分を props で設定できるようにします。

</Hint>

<Solution>

以下の解法では、`Profile` コンポーネントが複数の props を受け取るようにしました。`imageId`（文字列）、`name`（文字列）、`profession`（文字列）、`awards`（文字列の配列）、`discovery`（文字列）、`imageSize`（数値）です。

`imageSize` プロパティにはデフォルト値があるのでコンポーネントに渡す必要がないことに注意してください。

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Profession:</b> {profession}</li>
        <li>
          <b>Awards: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="physicist and chemist"
        discovery="polonium (chemical element)"
        awards={[
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='geochemist'
        discovery="a method for measuring carbon dioxide in seawater"
        awards={[
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

`awards` を配列として渡せば `awardCount` のような props を別に使う必要がないことに注意してください。こうすることで `awards.length` を使うことで受賞数がわかります。props にはあらゆる値を渡すことができ、配列も渡せるということを思い出してください！

別の解法として、このページの上の方の例と同様に、ある人物の情報を単一のオブジェクトにグループ化してそのオブジェクトを 1 つの prop として渡すようにすることもできます：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Profession:</b> {person.profession}
        </li>
        <li>
          <b>Awards: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Discovered: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'physicist and chemist',
        discovery: 'polonium (chemical element)',
        awards: [
          'Nobel Prize in Physics',
          'Nobel Prize in Chemistry',
          'Davy Medal',
          'Matteucci Medal'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'geochemist',
        discovery: 'a method for measuring carbon dioxide in seawater',
        awards: [
          'Miyake Prize for geochemistry',
          'Tanaka Prize'
        ],
      }} />
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

複数の JSX 属性ではなく JavaScript のプロパティを使って記述しているので構文はちょっと変わっていますが、これらの例はほぼ同等であり、どちらのアプローチを使っても構いません。

</Solution>

#### props に基づく画像サイズ変更 {/*adjust-the-image-size-based-on-a-prop*/}

以下の例では `Avatar` は数値型の `size` プロパティを受け取り、これが `<img>` の幅と高さを決定しています。この例では `size` は `40` に設定されています。しかしこの画像を新しいタブで開いてみると、画像自体はもっと大きい（`160` ピクセル）ことがわかります。実際の画像自体のサイズは、リクエストするサムネイルのサイズによって決定されます。

`Avatar` コンポーネントを書き換えて、`size` プロパティに基づいて最も近い画像サイズをリクエストするようにしてください。具体的には、`size` が `90` 未満のときは `getImageUrl` 関数に `'b'` ("big") ではなく `'s'` ("small") を渡すようにします。書き換えがうまくいったことを確認するには、アバターを `size` を書き換えてレンダーし、画像を新しいタブで開くようにします。

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

以下が解法の一例です：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

[`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) を考慮に入れて、高 DPI の画面でよりシャープな画像を表示するようにすることもできます：

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

props を使うことでこのようなロジックを `Avatar` 内にカプセル化（そして必要なら後で修正）し、画像がどのようにリクエストされサイズ変更されているのかを考えなくとも、誰でも `<Avatar>` が使えるようにできます。

</Solution>

#### `children` に JSX を渡す {/*passing-jsx-in-a-children-prop*/}

以下のマークアップから `Card` コンポーネントを抽出し、`children` プロパティを使って異なる JSX が渡されるようにしてください。

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>About</h1>
          <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

コンポーネントのタグ内に書かれたあらゆる JSX はそのコンポーネントの `children` として渡されます。

</Hint>

<Solution>

以下のようにすれば両方の場所で `Card` コンポーネントを使えるようになります。

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

`Card` に常にタイトルがあるようにしたい場合、`title` を独立した props にすることもできます：

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Photo">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="About">
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
