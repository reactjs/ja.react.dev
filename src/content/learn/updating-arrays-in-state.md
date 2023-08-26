---
title: state 内の配列の更新
---

<Intro>

JavaScript の配列はミュータブル（mutable, 書き換え可能）なものですが、state に格納する場合はイミュータブル（immutable, 書き換え不能）として扱うべきです。オブジェクトの時と同様に、state に保存された配列を更新する場合は、新しい配列を作成して（または既存の配列をコピーして）、その新しい配列で state をセットする必要があります。

</Intro>

<YouWillLearn>

- React の state 内にある配列に対し要素の追加、削除、変更を行う方法
- 配列内にあるオブジェクトを更新する方法
- Immer を使って配列コピーのためのコードの冗長さを緩和する方法

</YouWillLearn>

## 配列を書き換えずに更新する {/*updating-arrays-without-mutation*/}

JavaScript において、配列とは単なるオブジェクトの一種です。[オブジェクトのときと同様に](/learn/updating-objects-in-state)、**React の state 内にある配列は、読み取り専用として扱う必要があります**。これは、`arr[0] = 'bird'` のような形で配列内の要素に再代入を行ってはならず、`push()` や `pop()` のような配列をミューテーション（mutation, 書き換え）するメソッドを使ってもいけないということです。

代わりに、いつでも配列を更新したいときには、新しい配列を state セッタ関数に渡す必要があります。これを実現するために、state から取り出した元の配列から、`filter()` や `map()` といった書き換えを行わないメソッドを呼び出すことで、新しい配列を作成できます。そして、結果として得られた新しい配列を state にセットすることができます。

以下は、一般的な配列操作の参照表です。React の state 内の配列を扱う際には、左の列にあるメソッドを避けて、右の列にあるメソッドを使用する必要があります :

|           | 使わない（配列を書き換える）        | 使う（新しい配列を返す）                                            |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| 追加      | `push`, `unshift`                   | `concat`, `[...arr]` spread syntax ([例](#adding-to-an-array))      |
| 削除      | `pop`, `shift`, `splice`            | `filter`, `slice` ([例](#removing-from-an-array))                   |
| 要素置換  | `splice`, `arr[i] = ...` 代入文     | `map` ([例](#replacing-items-in-an-array))                          |
| ソート    | `reverse`, `sort`                   | 先に配列をコピー ([例](#making-other-changes-to-an-array))          |

また、どちらの列のメソッドも使用できるようにしてくれる [Immer を使う](#write-concise-update-logic-with-immer)方法もあります。

<Pitfall>

残念ながら、[`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) と [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) は名前が似ているものの、非常に異なるものです。

* `slice` は配列や配列の一部をコピーします。
* `splice` は（要素の挿入や削除という）配列の**ミューテーション**を行います。

React では、state 内のオブジェクトや配列を書き換えたくないため、`slice`（`p` なし！）の方をより頻繁に使用します。[オブジェクトの更新](/learn/updating-objects-in-state)で、ミューテーションとは何か、それがなぜ state において推奨されないかについて説明されています。

</Pitfall>

### 配列に要素を追加 {/*adding-to-an-array*/}

`push()` は配列の書き換えを行います。これは避けるべきです。

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

代わりに、既存の要素の末尾に新しい要素が加わった、*新しい*配列を作成します。これには複数の方法がありますが、もっとも簡単なのは `...` という[配列スプレッド構文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals)を使用することです。

```js
setArtists( // Replace the state
  [ // with a new array
    ...artists, // that contains all the old items
    { id: nextId++, name: name } // and one new item at the end
  ]
);
```

これで正しく動作します。

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

配列スプレッド構文を使用すれば、元の `...artists` の*先頭*に要素を追加することもできます：

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```

このように、スプレッド構文は、`push()` で配列の末尾に追加することと `unshift()` で配列の先頭に追加することの両方の役割を果たせます。上記のサンドボックスで試してみてください！

### 配列から要素を削除 {/*removing-from-an-array*/}

配列から要素を削除する最も簡単な方法は、それを*フィルタリング*して取り除いた、新しい配列を作ることです。つまり、その要素を含まない新しい配列を生成します。これには `filter` メソッドを使用します。例えば：

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

何度か "Delete" タンをクリックして動作を確認したら、クリックハンドラを見てみましょう。

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

ここで、`artists.filter(a => a.id !== artist.id)` というコードは「`artist.id` と異なる ID を持つ `artists` のみの配列を作成する」という意味です。言い換えると、各アーティストの "Delete" ボタンは、該当アーティストを配列からフィルタリングして取り除き、結果として得られる配列で再レンダーを要求します。`filter` は元の配列を書き換えないことに注意してください。

### 配列の変換 {/*transforming-an-array*/}

配列の一部またはすべての要素を変更したい場合は、`map()` を使用して**新しい**配列を作成できます。`map` に渡す関数は、データやインデックス（またはその両方）に基づいて各要素に何をするかを決定できます。

この例では、配列に 2 つの円と 1 つの正方形の座標が含まれています。ボタンを押すと、円だけが 50 ピクセル下に移動します。これは、`map()` を使用して新しいデータの配列を作成することで行われます。

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### 配列内の要素の置換 {/*replacing-items-in-an-array*/}

配列内の一部の要素だけを置き換えたい場合がよくあります。`arr[0] = 'bird'` のような代入は元の配列を書き換えてしまうので、代わりにここでも `map` を使用する必要があります。

要素を置き換えるには、`map` を使って新しい配列を作成します。`map` の呼び出し内では、第 2 引数として要素のインデックスを受け取ります。これを使用して、元の要素（第 1 引数）を返すか、他のものを返すかを決定します。

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### 配列への挿入 {/*inserting-into-an-array*/}

場合によっては、先頭でも終端でもない特定の位置に要素を挿入したいことがあります。これを行うには、`...` 配列スプレッド構文と `slice()` メソッドを組み合わせて使用できます。`slice()` メソッドを使用すると、配列の「スライス」を切り取ることができます。要素を挿入するには、挿入ポイントの前のスライス、新しい要素、元の配列の残りの部分からなる配列を作成します。

この例では、"Insert" ボタンは常にインデックス `1` の場所に挿入を行います。

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### 配列へのその他の変更 {/*making-other-changes-to-an-array*/}

スプレッド構文や、`map()`、`filter()` などの書き換えを行わないメソッドを使っているだけでは不可能なこともあります。例えば、配列を逆順にしたり、ソートしたりすることができません。JavaScript の `reverse()` や `sort()` メソッドは元の配列を書き換えるため、直接使うことはできません。

**ただし、最初に配列をコピーしてから、そのコピーに変更を加えることはできます。**

例えば、次のようになります。

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

ここでは、`[...list]` スプレッド構文を使って、最初に元の配列のコピーを作成します。コピーができたら、`nextList.reverse()` や `nextList.sort()` などのミューテーション型のメソッドを使ったり、`nextList[0] = "something"` で個々の要素に代入したりすることができます。

ただし、**配列をコピーしても、その中の既存のアイテムを直接変更することはできません**。これは、コピーが浅く (shallow) 行われるためです。新しい配列には、元の配列と同じ要素が含まれます。そのため、コピーされた配列内のオブジェクトを書き換えると、既存の state が書き換えられます。例えば、このようなコードは問題があります。

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

`nextList` と `list` は異なる 2 つの配列ですが、**`nextList[0]` と `list[0]` は同じオブジェクトを指しています**。そのため、`nextList[0].seen` を変更することで、`list[0].seen` も変更されます。これは state のミューテーションであり、避けるべきです！ この問題は、[ネストされた JavaScript オブジェクトの更新](/learn/updating-objects-in-state#updating-a-nested-object)と同様の方法で解決できます。変更を加えたい個々の要素を、書き換える代わりにコピーするということです。以下で説明します。

## 配列内のオブジェクトを更新する {/*updating-objects-inside-arrays*/}

オブジェクトは、*実際には*配列の「中に」あるわけではありません。コード中では「中に」あるように見えますが、配列内の各オブジェクトはそれぞれ独立した値であり、配列はそれらを「参照」しています。これが、`list[0]` のようなネストしたフィールドを変更する際に注意が必要な理由です。他の人のアートワークリストが、配列の同じ要素を指しているかもしれません！

**ネストされた state を更新する際には、更新したい箇所からトップレベルまでのコピーを作成する必要があります**。どのように行うのか見てみましょう。

この例では、2 つの別々のアートワークリストが同じ初期 state を持っています。これらは独立していることになっているのですが、ミューテーションが起きているため state が誤って共有され、一方のリストでボックスをチェックするともう一方のリストに影響してしまっています。

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
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

問題はこのコードです。

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

`myNextList` という配列自体は新しいものですが、個々の*要素そのもの*は元の `myList` 配列と同じです。そのため、`artwork.seen` を変更することで、*元の*アートワークも変更されます。そのアートワークは `yourList` 内にも存在するため、バグが発生します。このようなバグは理解するのが難しいことがありますが、幸いにも state のミューテーションさえ避けておけば、起こさずに済みます。

**ミューテーションをせずに、古い要素を更新された要素と置き換えるには、`map` を使用できます**。

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

ここで、`...` はオブジェクトのスプレッド構文であり、[オブジェクトのコピーを作成する](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)ために使われます。

このアプローチでは、既存の state の要素を書き換えないため、バグは修正されています。

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
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

一般的には、**作成したばかりのオブジェクト以外は書き換えてはいけません**。*新しい*アートワークを挿入する場合にその新しい要素を書き換えても構いませんが、state にすでに存在するものを扱う場合は、コピーを作成する必要があります。

### Immer を使って簡潔な更新ロジックを書く {/*write-concise-update-logic-with-immer*/}

配列がネストされている場合、書き換えなしで更新を行うコードは冗長になりがちです。[オブジェクトのときと同様](/learn/updating-objects-in-state#write-concise-update-logic-with-immer)ですが、

- 一般的には、state を 2〜3 レベル以上深く更新する必要はないはずです。state オブジェクトが非常に深い場合は、[別の構造に再構成](/learn/choosing-the-state-structure#avoid-deeply-nested-state)してフラットにすることができます。
- state 構造を変更したくない場合は、[Immer](https://github.com/immerjs/use-immer) を使用して、書きやすいミューテート型の構文で記述しつつコピーを生成することができます。

以下は、Immer を使用して書き直したアートワークリストの例です。

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
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
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
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Immer を使用することで **`artwork.seen = nextSeen` のような書き換えができるようになりました**。

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

これが可能なのは、Immer から渡される特別な `draft` オブジェクトを書き換えているのであり、*元の* state は書き換えていないためです。同様に、`draft` の内容に対して `push()` や `pop()` などのミューテーション型のメソッドを使用することもできます。

裏側では、Immer は常に、`draft` に対して行った書き換え操作に基づいて、次の state をゼロから構築します。これにより、state を書き換えてしまう心配をせず、イベントハンドラを非常に簡潔に保つことができます。

<Recap>

- 配列を state に入れることができるが、それを直接変更してはいけない。
- 配列を変更せず、代わりに*新しい*版を作成し、state を更新する。
- `[...arr, newItem]` という配列スプレッド構文を使用して、新しい項目を持つ配列を作成できる。
- `filter()` や `map()` を使用して、フィルタリングされた、あるいは変換されたアイテムを含む新しい配列を作成できる。
- Immer を使ってコードを簡潔に保つことができる。

</Recap>



<Challenges>

#### ショッピングカートの商品を更新 {/*update-an-item-in-the-shopping-cart*/}

`handleIncreaseClick` のロジックを埋めて、"+" を押すことで対応する数字が増えるようにしてください。

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

`map` 関数を使って新しい配列を作成し、その中で `...` オブジェクトスプレッド構文を使って変更された商品に対応するオブジェクトのコピーを作成します：

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### ショッピングカートから商品を削除 {/*remove-an-item-from-the-shopping-cart*/}

このショッピングカートでは "+" ボタンは機能していますが、"–" ボタンは何もしません。これに対応するイベントハンドラを追加して、押すことで対応する商品の `count` を減らすようにしてください。カウントが 1 の場合に "–" を押すと、商品が自動的にカートから削除されるようにしてください。0 と表示されないようにしてください。

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

まず `map` を使って新しい配列を生成し、次に `filter` を使って `count` が `0` となっている商品を削除します。

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### ミューテーションを行わないように修正 {/*fix-the-mutations-using-non-mutative-methods*/}

この例では、`App.js` のすべてのイベントハンドラがミューテーションを行っています。そのため、todo アイテムの編集や削除が機能していません。`handleAddTodo`、`handleChangeTodo`、`handleDeleteTodo` を、ミューテーションを行わないメソッドを使って書き直してください。

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

`handleAddTodo` では、配列のスプレッド構文が使えます。`handleChangeTodo` では、`map` で新しい配列を作成します。`handleDeleteTodo` では、`filter` で新しい配列を作成します。これでリストが正しく動作します。

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Immer でミューテーションを修正 {/*fix-the-mutations-using-immer*/}

これは、ひとつ前のチャレンジと同じ例です。今回は、Immer を使用してミューテーションを修正します。`useImmer` はすでにインポートしてありますので、`todos` の state 変数をこれを使って更新してください。

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

<Solution>

Immer を使うと、Immer から渡される `draft` のみを書き換えている限りは、ミューテーション型のコードを書くことができます。ここでは、ミューテーションは `draft` に対してのみ行われているため、コードが機能します。

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immer を使えば、ミューテーション型と非ミューテーション型のアプローチを混在させることもできます。

例えば、以下では `handleAddTodo` は Immer の `draft` を使ってミューテーション型で書かれていますが、`handleChangeTodo` と `handleDeleteTodo` は非ミューテーション型の `map` や `filter` メソッドで書かれています。

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immer を使うことで、個々のケースごとに最も自然に感じるスタイルを選ぶことができます。

</Solution>

</Challenges>
