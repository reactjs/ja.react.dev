---
title: インタラクティビティの追加
---

<Intro>

画面上の要素には、ユーザの入力に反応して更新されていくものがあります。例えば、イメージギャラリをクリックするとアクティブなイメージが切り替わります。React では、時間の経過とともに変化するデータのことを state と呼びます。任意のコンポーネントに state を追加することができ、必要に応じて更新することができます。この章では、インタラクションを処理し、state を更新し、時間の経過とともに異なる出力を表示するコンポーネントの作成方法について学びます。

</Intro>

<YouWillLearn isChapter={true}>

* [ユーザが発生させるイベントの扱い方](/learn/responding-to-events)
* [state でコンポーネントに情報を 「記憶」させる方法](/learn/state-a-components-memory)
* [React が 2 段階で UI を更新する仕組み](/learn/render-and-commit)
* [変更後すぐに state が更新されない理由](/learn/state-as-a-snapshot)
* [複数の state の更新をキューに入れる方法](/learn/queueing-a-series-of-state-updates)
* [state 内のオブジェクトを更新する方法](/learn/updating-objects-in-state)
* [state 内の配列を更新する方法](/learn/updating-arrays-in-state)

</YouWillLearn>

## イベントへの応答 {/*responding-to-events*/}

React では、JSX にイベントハンドラを追加することができます。イベントハンドラは、クリック、ホバー、フォーム入力へのフォーカスなどのユーザインタラクションに応答して起動する独自の関数です。

`<button>` のような組み込みコンポーネントは `onClick` のような組み込みのブラウザイベントのみをサポートします。しかし、独自のコンポーネントを作成し、そのイベントハンドラ props に任意のアプリケーション固有の名前を付けることもできます。

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

イベントハンドラの追加方法を学ぶには **[イベント対応](/learn/responding-to-events)** を読んでみましょう。

</LearnMore>

## state：コンポーネントのメモリ {/*state-a-components-memory*/}

コンポーネントはインタラクションの結果として画面に表示されるものを変更する必要があることがよくあります。フォームに入力すると入力フィールドが更新され、イメージカルーセルで「次へ」をクリックすると表示されるイメージが変更され、「購入」をクリックするとショッピングカートに商品が入ります。コンポーネントは、現在の入力値、現在のイメージ、ショッピングカートを「記憶」する必要があるのです。React では、このようなコンポーネント固有の記憶を state と呼びます。

[`useState`](/apis/usestate) フックを使用すると、コンポーネントに state を追加することができます。フックとはコンポーネントに React の機能を使用させるための特別な関数です（state はその機能の 1 つです）。`useState` フックで state 変数を宣言できます。これは初期 state を受け取り、現在の state と、それを更新するための state セッタ関数のペアを返します。

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

以下は、イメージギャラリがクリックされた時に state を更新する方法です：

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

値を記憶し、インタラクションに応答してその値を更新するには **[state: コンポーネントのメモリ](/learn/state-a-components-memory)** を読んでみましょう。

</LearnMore>

## レンダーとコミット {/*render-and-commit*/}

コンポーネントは、画面で表示される前に React によってレンダーされる必要があります。このプロセスのステップを理解することで、コードの実行方法について考え、その動作を説明することができるようになります。

コンポーネントは厨房で材料から美味しい料理を作る料理人だと想像してください。このシナリオでは React はお客様のリクエストを受け付け、注文された料理を運ぶウェイターです。注文を受けて UI 要素を「配膳」するプロセスには、次の 3 つのステップが存在します：

1. レンダーの**トリガ**（お客様の注文を厨房に届ける）
2. コンポーネントの**レンダー**（厨房から注文された料理を受け取る）
3. DOM への**コミット**（テーブルに注文を置く）

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React をレストランのウェイターに見立てて、ユーザーからの注文を取り、それをコンポーネント厨房 (Component Kitchen) に届ける。" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

UI 更新のライフサイクルを学ぶには **[レンダーとコミット](/learn/render-and-commit)** を読んでみましょう。

</LearnMore>

## state はスナップショットである {/*state-as-a-snapshot*/}

通常の JavaScript の変数とは異なり、React の state はスナップショットのような動作をします。これを設定しても既存の state 変数は変更されず、代わりに再レンダーがトリガされます。このような動作に最初は驚くかもしれませんね。

```js
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

React はこのような仕組みになっているので、微妙なバグを回避することができます。ここに小さなチャットアプリがあります。まず「送信」を押して、*次に*受信者を「ボブ」に変更したら何が起こるか、推測してみてください。5 秒後の `alert` には誰の名前が表示されるでしょうか？

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

イベントハンドラ内で state が「固定」され、変化していないように見える理由を学ぶには **[state はスナップショットである](/learn/state-as-a-snapshot)** を読んでみましょう。

</LearnMore>

## 一連の state の変更をキューに入れる {/*queueing-a-series-of-state-changes*/}

このコンポーネントにはバグがあります："+3" をクリックしても 1 しかスコアが増えません。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[state はスナップショットである](/learn/state-as-a-snapshot) で、なぜこのようなことが起こってしまうのかを説明しています。state を設定すると、新しい再レンダーが要求されますが、すでに実行されているコード内の state は変更されません。そのため `setScore(score + 1)` を呼び出した直後は `score` が `0` であり続けます。

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

state を設定する際に*更新用関数*を渡すことでこれを修正することができます。`setScore(score + 1)` を  `setScore(s => s + 1)` に置き換えることで、"+3" ボタンが修正されることに注目してください。これは、複数の state の更新をキューに入れる必要がある場合に便利です。

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-changes">

次のレンダリングの前に複数の更新をキューに入れる方法を学ぶには **[一連の state の変更をキューに入れる](/learn/queueing-a-series-of-state-changes)** を読んでみましょう。

</LearnMore>

## state 内のオブジェクトを更新する方法 {/*updating-objects-in-state*/}

State はオブジェクトを含むあらゆる種類の JavaScript の値を保持することができます。しかし、React の state 内で保持するオブジェクトや配列を直接変更してはいけません。その代わり、オブジェクトや配列を更新したい場合、既存のもののコピーを作るなどして新しい値を作成し、その新しい値を使って state を変更する必要があります。

通常、変更したいオブジェクトや配列をコピーするには `...` というスプレッド構文を使用します。例えば、ネストされたオブジェクトを更新する場合、次のようになります：

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

コード内のオブジェクトのコピーが面倒になったら [Immer](https://github.com/immerjs/use-immer) のようなライブラリを使うと、コードの繰り返しを減らすことができます：

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
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
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

オブジェクトを正しく更新する方法を学ぶために **[state 内のオブジェクトを更新する方法](/learn/updating-objects-in-state)** を読んでみましょう。

</LearnMore>

## state 内の配列を更新する方法 {/*updating-arrays-in-state*/}

配列もまた、state 内で保持できるミュータブル（mutable; 書き換え可能）な JavaScript オブジェクトの一種ですが、読み取り専用として扱うべきものです。オブジェクトと同様に state に保存された配列を更新したい場合、新しいものを作成し（または既存のもののコピーを作成し）state が新しい配列を使用するように設定する必要があります：

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

コード内の配列のコピーが面倒になったら [Immer](https://github.com/immerjs/use-immer) のようなライブラリを使うと、コードの繰り返しを減らすことができます：

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

配列を正しく更新する方法を学ぶには **[state 内の配列を更新する方法](/learn/updating-arrays-in-state)** を読んでみましょう。

</LearnMore>

## 次は何？ {/*whats-next*/}

この章を 1 ページずつ読み始めるには[イベントへの応答](/learn/responding-to-events)に移動しましょう!

また、すでにこれらのトピックをご存知の方は [state の管理](/learn/managing-state)を読んでみてはいかがでしょうか。