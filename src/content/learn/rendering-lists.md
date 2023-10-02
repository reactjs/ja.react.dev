---
title: リストのレンダー
---

<Intro>

データの集まりから、似たようなコンポーネントを複数表示させたいことがあります。データの配列を操作するには [JavaScript の配列メソッド](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#)が使えます。このページでは [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) や [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) を React で使用して、データの配列をフィルタリングしたり、コンポーネントの配列に変換したりする方法を見ていきましょう。

</Intro>

<YouWillLearn>

* JavaScript の `map()` を使用して、配列からコンポーネントをレンダーする方法
* JavaScript の `filter()` を使用して、特定のコンポーネントのみをレンダーする方法
* React での key の使用方法と、その必要性

</YouWillLearn>

## 配列からデータをレンダー {/*rendering-data-from-arrays*/}

以下のようなコンテンツのリストがあるとしましょう。

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

これらのリスト項目は、その中身、すなわちデータのみが異なっています。インターフェースを構築する際にはよく、コメント一覧やプロフィール画像のギャラリーなどのように、異なるデータを使用して同じコンポーネントの複数のインスタンスを表示する必要があります。このような場合、JavaScript のオブジェクトや配列にそのデータを保存し、[`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) や [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) などのメソッドを使ってコンポーネントのリストをレンダーすることができます。

以下は、配列からアイテムのリストを生成する方法を示す簡単な例です。

1. データを配列に**移動**します：

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. `people` 内のメンバを `listItems` という新しい JSX の配列に**マップ**します：

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. コンポーネントから `listItems` を `<ul>` で囲んで返します：

```js
return <ul>{listItems}</ul>;
```

以下が結果です：

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

上のサンドボックスには、コンソールエラーが表示されています：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

このエラーを修正する方法についてはこのページの後半で説明します。その前に、このデータに構造を追加しましょう。

## アイテムの配列をフィルタする {/*filtering-arrays-of-items*/}

このデータにさらに構造を加えてみました。

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

ここで、職業 (profession) が `'chemist'` の人だけを表示したいとしましょう。JavaScript の `filter()` メソッドを使用すれば、そのような職業の人だけを返すことができます。このメソッドは、要素の配列を受け取り、個々の要素を「テスト」（`true` または `false` を返す関数）にかけ、そして、テストを通過した要素（テスト関数が `true` を返したもの）のみを含む配列を返します。

`profession` が `'chemist'` となっている要素のみが必要でした。そのための「テスト」関数は、`(person) => person.profession === 'chemist'` のようになります。使い方の全体像は以下のようになります。

1. `people` に対して `filter()` を呼び出し、`person.profession === 'chemist'` を使ってフィルタした、職業が "chemist" である人物のみの新しい配列を**作成**します。

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. 次に `chemists` に対して **map** を適用します：

```js {1,13}
const listItems = chemists.map(person =>
  <li>
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
```

3. 最後に、コンポーネントから `listItems` を**返し**ます。

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
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
  return <ul>{listItems}</ul>;
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

アロー関数は `=>` の直後の式を自動的に返しますので、`return` 文を直接書く必要はありません：

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

ただし、もし `=>` の次に `{` が続く場合は、**必ず `return` 文を明示的に書く必要があります**。

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

`=> {` を含むアロー関数は ["ブロック形式の関数本体"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) を持つものとして扱われます。これにより複数行のコードが書けるようになりますが、`return` 文を自分で書かなければなりません。書き忘れた場合は何も返されません！

</Pitfall>

## `key` によるリストアイテムの順序の保持 {/*keeping-list-items-in-order-with-key*/}

上記のすべてのサンドボックスで、コンソールにエラーが表示されていることに注目しましょう：

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.

</ConsoleBlock>

配列の各アイテムには、`key` を渡す必要があります。配列内の他のアイテムと区別できるようにするための一意な文字列ないし数値のことです。

```js
<li key={person.id}>...</li>
```

<Note>

`map()` 内で直接 JSX 要素を使用する場合、必ず key が必要です！

</Note>

key は、配列のどの要素がどのコンポーネントに対応するのかを React が判断し、後で正しく更新するために必要です。これが重要となるのは、配列の要素が移動（ソートなどによって）した場合、挿入された場合、あるいは削除された場合です。適切に `key` を選ぶことで、React は何が起こったか推測し、DOM ツリーに正しい更新を反映させることができます。

key は動的に生成するのではなく、元データに含めるべきです。

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### リストアイテムごとに複数の DOM ノードを表示する {/*displaying-several-dom-nodes-for-each-list-item*/}

各アイテムが 1 つの DOM ノードではなく、複数の DOM ノードをレンダーする必要がある場合はどうするのでしょうか？

短い [`<>...</>` フラグメント](/reference/react/Fragment)構文では `key` を渡せないため、これらを 1 つの `<div>` にグループ化するか、やや長くて[より明示的な `<Fragment>` シンタックス](/reference/react/Fragment#rendering-a-list-of-fragments)を使用する必要があります：

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

フラグメントは DOM から消え去るため、これにより `<h1>`、`<p>`、`<h1>`、`<p>` というように続くフラットなリストが生成されます。

</DeepDive>

### `key` をどこから得るのか {/*where-to-get-your-key*/}

データソースの種類によって key を得る方法は異なります。

* **データベースからのデータ：** データがデータベースから来る場合、データベースのキーや ID は必然的に一意ですので、それを利用できます。
* **ローカルで生成されたデータ：** データがローカルで生成されて保持される場合（例：ノートを取るアプリにおけるノート）は、アイテムを作成する際に、インクリメンタルなカウンタや [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID)、または [`uuid`](https://www.npmjs.com/package/uuid) などのパッケージを使用します。

### `key` のルール {/*rules-of-keys*/}

* **キーは兄弟間で一意でなければなりません**。ただし、*異なる*配列に対応する JSX ノードには同じキーを使用することができます。
* **キーは変更してはいけません**。さもないと `key` の目的が台無しになります。レンダーの最中に key を生成してはいけません。

### なぜ React は `key` を必要とするのか {/*why-does-react-need-keys*/}

デスクトップ上のファイルに名前がない場合を想像してください。代わりに、最初のファイル、2 番目のファイルといったように、順番によってそれらを区別する必要があるとしましょう。そのうち番号に慣れるかもしれませんが、ファイルを削除した途端に混乱してしまいます。2 番目のファイルが 1 番目のファイルになり、3 番目のファイルが 2 番目のファイルになり、という具合です。

フォルダ内のファイル名と JSX の key の目的は似ています。兄弟間で項目を一意に識別できるようにするのです。適切に選択された key は、配列内の位置よりも多くの情報を提供します。並べ替えによって*位置*が変更されたとしても、`key` のおかげで React はその項目が存在する限り、それを一意に識別できるのです。

<Pitfall>

アイテムのインデックスを `key` として使用したくなるかもしれません。実際、`key` を指定しなかった場合、React はデフォルトでインデックスを使用します。しかし、アイテムが挿入されたり削除されたり、配列を並び替えたりすると、レンダーするアイテムの順序も変わります。インデックスをキーとして利用すると、微妙かつややこしいバグの原因となります。

同様に、`key={Math.random()}` などとしてキーをその場で生成してはいけません。こうするとキーがレンダーごとに一切合致しなくなり、コンポーネントと DOM が毎回再作成されるようになります。これは遅くなるのみならず、リストアイテム内のユーザによる入力値も失われてしまいます。代わりに、データに紐づいた安定した ID を使用してください。

コンポーネントは `key` を props として受け取らないということに注意してください。React 自体がヒントとして使用するだけです。コンポーネントが ID を必要とする場合は、別の props として渡す必要があります：`<Profile key={id} userId={id} />`。

</Pitfall>

<Recap>

このページでは以下のことを学びました：

* コンポーネントからデータを配列やオブジェクトといったデータ構造に移動する方法。
* JavaScript の `map()` を使用して類似したコンポーネントの集まりを作成する方法。
* JavaScript の `filter()` を使用してフィルタリングされたアイテムの配列を作成する方法。
* コレクション内の各コンポーネントに `key` を設定して、位置やデータが変更された場合でも React がそれぞれを追跡できるようにする方法と、それが必要な理由。

</Recap>



<Challenges>

#### リストを 2 つに分割する {/*splitting-a-list-in-two*/}

この例では、すべての人物の一覧を表示しています。

それを、**化学者 (chemist)** と **その他の人** の 2 つの別々の一覧に変更してください。前に述べたように、`person.profession === 'chemist'` であるかどうかを確認することで、その人が化学者であるかどうかを決定できます。

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

`filter()` を 2 回使用して、2 つの別々の配列を作成し、その両方に `map` を適用します。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

この解答では、`map` コールは親の `<ul>` 要素の中に直接インラインで配置されていますが、このための変数を導入する方が読みやすいと思った場合は、そうしても構いません。

レンダーされた 2 つのリストの間にはまだ少し重複部分があります。さらに進んで、反復部分を `<ListSection>` コンポーネントに抽出できます。

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

注意深い方は、2 つの `filter` コールで各人物の職業を 2 回確認していることに気づくかもしれません。プロパティのチェックは非常に高速ですので、この例では問題ありません。あなたのロジックがそれ以上に重たい場合は、`filter` コールを手動のループに置き換え、各人物を一度だけチェックしながらループ内で手動で 2 つの配列を構築することができます。

実際、`people` が一切変わらないのであれば、このコードをコンポーネントの外に移動しても構いません。React の観点からは、最終的に JSX ノードの配列が生成されていればよいのです。どのようにしてその配列を生成しているかは問題ではありません：

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### 同一コンポーネント内のネストしたリスト {/*nested-lists-in-one-component*/}

以下の配列から、レシピのリストを作成してください！ 配列内の各レシピについて、名前を `<h2>` で表示し、その材料を `<ul>` を使って表示してください。

<Hint>

これには 2 つの異なる `map` コールをネストする必要があります。

</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

以下が解決法のひとつです：

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

`recipes` の各要素にはすでに `id` フィールドが含まれているので、外側のループではこれを `key` として使用します。一方で材料をループするために使用できる ID はありません。しかし、同じレシピに同じ材料が 2 度表示されることはないと考えるのが妥当ですので、材料の名前を `key` として使用することができます。あるいは、データ構造を変更して ID を追加するか、インデックスを `key` として使用することもできます（ただし、材料を安全に並べ替えることはできなくなります）。

</Solution>

#### リスト要素のコンポーネントを抽出 {/*extracting-a-list-item-component*/}

この `RecipeList` コンポーネントは、2 つのネストした `map` 呼び出しを含んでいます。これを単純化するために、`id`, `name`, `ingredients` という props を受けとる `Recipe` コンポーネントを抽出してください。外側の `key` はどこに置きますか、またその理由は？

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

外側の `map` から新しい `Recipe` コンポーネントに JSX をコピーペーストして、その JSX を返すことができます。そして、`recipe.name` を `name` に、`recipe.id` を `id` に変更し、`Recipe` に props として渡します：

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

ここで `<Recipe {...recipe} key={recipe.id} />` というのは「`recipe` オブジェクトのすべてのプロパティを `Recipe` コンポーネントの props として渡せ」という意味のショートカット構文です。個々の props を明示的に書いても構いません：`<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`

**`key` は `<Recipe>` から返される `<div>` 内ではなく、`<Recipe>` 自体に指定する必要があることに注意してください**。これは、`key` を直接必要としているのはそれを囲んでいる配列という文脈だからです。これまでは `<div>` の配列があったので個々の div に `key` が必要でしたが、今存在するのは `<Recipe>` の配列です。別の言い方をすると、コンポーネントを抽出する場合は、コピーペーストする JSX の外に `key` を残すことを忘れないようにしましょう。

</Solution>

#### セパレータ付きリスト {/*list-with-a-separator*/}

この例では、立花北枝の有名な俳句を、各行を `<p>` タグで囲みつつ表示しています。あなたの仕事は、各段落の間に `<hr />` という区切り線を挿入することです。結果はこのような形にしてください。

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

俳句は 3 行しかありませんが、あなたの答えはどのような行数であっても動作するようにしてください。`<hr />` 要素は `<p>` 要素の*間*にのみ現れ、最初や最後には現れないことに注意してください！

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

（俳句の行が途中で入れ替わることは決してないので、今回は特例としてインデックスを key として利用して構いません。）

<Hint>

`map` を手動のループに置き換えるか、フラグメントを使う必要があります。

</Hint>

<Solution>

手動でループを書いて、`<hr />` と `<p>...</p>` を出力用の配列に順番に入れていくという方法がとれます。

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

各セパレータと段落は同じ配列に入るので、元の行インデックスを `key` として使用することはできなくなります。ですが `key={i + '-text'}` のように後ろに文字を付加することで、一意なキーを与えることができます。

あるいは、`<hr />` と `<p>...</p>` を含むフラグメントの配列をレンダーすることもできます。しかし、`<>...</>` という省略記法は key を渡すことをサポートしていないため、明示的に `<Fragment>` と記述する必要があります：

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

フラグメント（通常は `<> </>` のように書かれる）によって、余分な `<div>` を増やさずに JSX ノードをグループ化できるということを覚えておきましょう！

</Solution>

</Challenges>
