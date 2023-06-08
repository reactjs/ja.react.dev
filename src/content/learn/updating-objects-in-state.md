---
title: state 内のオブジェクトの更新
---

<Intro>

state にはどのような JavaScript の値でも保持することができます。これにはオブジェクトも含まれます。しかし、React の state に保持されたオブジェクトを直接書き換えるべきではありません。オブジェクトを更新したい場合、代わりに新しいオブジェクトを作成（または既存のもののコピーを作成）し、それを使って state をセットする必要があります。

</Intro>

<YouWillLearn>

- React の state 内のオブジェクトを正しく更新する方法
- ミューテートせずにネストされたオブジェクトを更新する方法
- イミュータビリティとは何で、どのようにして遵守するのか
- Immer を使ってオブジェクトコピーのためのコードの冗長さを緩和する方法

</YouWillLearn>

## ミューテーションとは？ {/*whats-a-mutation*/}

state には、どのような JavaScript の値でも格納することができます。

```js
const [x, setX] = useState(0);
```

これまでに扱ってきたのは、数値、文字列、および真偽値です。これらの種類の JavaScript 値は "イミュータブル"（不変, immutable）、つまり値が変わることがなく「読み取り専用」なものです。再レンダーをトリガするには値を*置き換え*ます。

```js
setX(5);
```

`x` という state の値は `0` から `5` に置き換わりましたが、*`0` という数字そのもの*が変化したわけではありません。JavaScript の数値、文字列、真偽値のような組み込みプリミティブの値そのものを変化させることは不可能です。

さて、state にオブジェクトが入っている場合を考えてみましょう。

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

技術的には、*オブジェクト自体*の内容を書き換えることが可能です。**これをミューテーション (mutation) と呼びます**。

```js
position.x = 5;
```

ただし、React の state 内にあるオブジェクトは技術的にはミュータブル（mutable, 書き換え可能）であるとしても、数値、真偽値、文字列と同様に、イミュータブルなものであるかのように扱うべきです。書き換えをする代わりに、常に値の置き換えをするべきです。

## state を読み取り専用として扱う {/*treat-state-as-read-only*/}

言い換えると、**state として格納するすべての JavaScript オブジェクトは読み取り専用**として扱う必要があります。

以下の例では、現在のポインタ位置を表すオブジェクトを state に保持しています。プレビュー領域でタッチしたりマウスカーソルを動かしたりすると、赤い点が動いて欲しいと思っています。しかし、点が初期位置から動きません：

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

問題は、このコードにあります。

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

このコードは、[直近のレンダー](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)で `position` に割り当てられたオブジェクトを書き換え、つまりミューテートしています。しかし、state セット関数が使用されないと、React はそのオブジェクトが変更されたことを認識できません。そのため、React は何の反応もしません。これは料理をすでに食べた後で注文を変更しようとするようなものです。state のミューテートは一部のケースでは機能することがありますが、おすすめしません。レンダー内でアクセスできる state 値は、読み取り専用として扱うべきです。

この場合、実際に[再レンダーをトリガする](/learn/state-as-a-snapshot#setting-state-triggers-renders)ためには、***新しい*オブジェクトを作成し、それを state セット関数に渡す必要があります。**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition` を使うことで、React に次のことを伝えます。

* `position` をこの新しいオブジェクトに置き換えよ
* そしてもう一度このコンポーネントをレンダーせよ

プレビューエリアでタッチするかマウスホバーすることで、赤い点がポインタに追随するようになりましたね。

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### ローカルミューテーションは問題なし {/*local-mutation-is-fine*/}

以下のようなコードは、state の*既存の*オブジェクトを変更しているため、問題があります。

```js
position.x = e.clientX;
position.y = e.clientY;
```

しかし、以下のようなコードは**全く問題ありません**。なぜなら、*作成したばかりの*新しいオブジェクトを書き換えているからです。

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

実際、これは以下のように書くことと全く同等です。

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

state として存在する*既存の*オブジェクトを変更する場合にのみ、ミューテーションは問題になります。作成したばかりのオブジェクトであれば*他のコードはまだそれを参照していない*ので、書き換えても問題ありません。それを書き換えてもそれに依存する何かに誤って影響を与えることはありません。これを "ローカルミューテーション (local mutation)" と呼びます。[レンダー中にも](/learn/keeping-components-pure#local-mutation-your-components-little-secret)ローカルミューテーションを行うことができます。とても便利で、全く問題ありません！

</DeepDive>

## スプレッド構文を使ったオブジェクトのコピー {/*copying-objects-with-the-spread-syntax*/}

前の例では、`position` オブジェクトは現在のカーソル位置から常に新規作成されます。しかし、多くの場合、新しく作成するオブジェクトに*既存の*データも含めたいことがあります。例えば、フォームの *1 つの*フィールドだけを更新し、他のすべてのフィールドについては以前の値を保持したい、ということがあります。

以下の入力フィールドは、`onChange` ハンドラが state を書き換えているため、動作しません。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

例えば、以下の行は過去のレンダーからの state を書き換えてしまっています。

```js
person.firstName = e.target.value;
```

望んだ動作を得る確実な方法は、新しいオブジェクトを作成し、`setPerson` に渡すことです。しかし、ここではフィールドのうちの 1 つだけが変更されているため、**既存のデータもコピーしたい**でしょう。

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

`...` という[オブジェクトスプレッド](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)構文を使用することで、すべてのプロパティを個別にコピーする必要がなくなります。

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

これでフォームが機能します！

各入力フィールドに対して state 変数を別々に宣言していないことに注目してください。大きなフォームでは、すべてのデータをオブジェクトにまとめて保持することが非常に便利です。正しく更新さえしていれば！

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`...` スプレッド構文は「浅い (shallow)」ことに注意してください。これは 1 レベルの深さでのみコピーを行います。これは高速ですが、ネストされたプロパティを更新したい場合は、スプレッド構文を複数回使用する必要があるということでもあります。

<DeepDive>

#### 複数のフィールドに単一のイベントハンドラを使う {/*using-a-single-event-handler-for-multiple-fields*/}

オブジェクト定義内で `[` と `]` 括弧を使って、動的な名前のプロパティを指定することもできます。以下は上記と例ですが、3 つの異なるイベントハンドラの代わりに 1 つのイベントハンドラを使用しています。

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

ここでは、`e.target.name` は、`<input>` DOM 要素に与えられた `name` プロパティを指しています。

</DeepDive>

## ネストされたオブジェクトの更新 {/*updating-a-nested-object*/}

以下のようなネストされたオブジェクト構造を考えてみましょう。

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

`person.artwork.city` を更新したい場合、ミューテーションで変更する方法は明らかです。

```js
person.artwork.city = 'New Delhi';
```

しかし、React では state をイミュータブルなものとして扱います！ `city` を更新するためには、まず（既存のデータも含まれた）新しい `artwork` オブジェクトを生成する必要があります。そして、新しい `artwork` を含む新しい `person` オブジェクトを生成します。

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

あるいは、単一の関数呼び出しとして記述する場合は以下のようになります。

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

これは少し冗長ですが、多くのケースでうまく機能します。

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

<DeepDive>

#### オブジェクトは実際にはネストされない {/*objects-are-not-really-nested*/}

このようなオブジェクトはコード内で「ネストされている」ように見えるでしょう：

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

しかし、オブジェクトの振る舞いを考える場合、「ネスト」という考え方は正確ではありません。コードが実行されてしまえば「ネストされた」オブジェクトというものは存在しません。実際には、2 つの異なるオブジェクトを見ているだけです：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` オブジェクトは `obj2` の「内部」にあるのではありません。例えば、`obj3` も `obj1` を「参照する」ことができます：

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

`obj3.artwork.city` を変更すると、`obj2.artwork.city` と `obj1.city` の両方に影響を与えます。これは、`obj3.artwork`、`obj2.artwork`、および `obj1` が同一のオブジェクトであるためです。これは、オブジェクトが「ネストされている」と考えると理解しにくくなります。そうではなく、これらはあくまで別々のオブジェクトであり、プロパティで互いを「参照している」のです。

</DeepDive>

### Immer で簡潔な更新ロジックを書く {/*write-concise-update-logic-with-immer*/}

もし state が深くネストされている場合、[フラットにすることを検討する](/learn/choosing-the-state-structure#avoid-deeply-nested-state)べきかもしれません。しかし、state の構造を変更したくない場合は、スプレッド構文をネストして使うより短いやり方が欲しくなるかもしれません。人気ライブラリである [Immer](https://github.com/immerjs/use-immer) は、使いやすいミューテート型の構文を使って書きつつ、コピーを自動的に作成してくれるというものです。Immer を使うと、あなたのコードは一見オブジェクトをミューテートして「ルール違反」をしているかのように見えます。

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

しかし、通常のミューテーションとは異なり、過去の state は上書きされません！

<DeepDive>

#### Immer はどのように動作するのか？ {/*how-does-immer-work*/}

Immer から渡される `draft` は、[プロキシ (Proxy)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)と呼ばれる特殊なタイプのオブジェクトで、それに対して何を行ったのかを「記録」します。これが好きなだけミューテートができる理由です！ 内部では、Immer は `draft` のどの部分が変更されたかを把握し、あなたの編集内容を反映した完全に新しいオブジェクトを生成します。

</DeepDive>

Immer を試すには：

1. `npm install use-immer` を実行し、Immer を依存ライブラリとして追加する
2. 次に `import { useState } from 'react'` を `import { useImmer } from 'use-immer'` に置き換える

以下は、Immer に変換された上記の例です：

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

イベントハンドラがどれほど簡潔になったか注目してください。`useState` と `useImmer` は 1 つのコンポーネント内で自由に組み合わせることができます。Immer は、state がネストしておりオブジェクトのコピーのためのコードが冗長になりそうな場合でも、更新を行うハンドラを簡潔に保つことができる素晴らしい方法です。

<DeepDive>

#### React ではなぜ state の変更が非推奨なのか？ {/*why-is-mutating-state-not-recommended-in-react*/}

いくつかの理由があります。

* **デバッグ**：`console.log` を使用しているなら、state を書き換えないことにより、古いログの内容が後に起きた state 変更によって上書きされる心配をしなくて済むようになります。つまり、レンダー間で state がどのように変化したかはっきり見ることができるようになります。
* **最適化**：React の一般的な[最適化戦略](/reference/react/memo)は、前の props や state が次のものと同一である場合作業をスキップする、ということに依存しています。state を書き換えないことで、変更があったかどうかを非常に素早くチェックすることができます。`prevObj === obj` であれば、内部で何も変更されていないと自信を持って言えるようになります。
* **新機能**：開発中の新しい React の機能は、state が[スナップショットのように扱われること](/learn/state-as-a-snapshot)を前提としています。過去の state の書き換えを行うと、新しい機能を使用できなくなる可能性があります。
* **仕様変更のしやすさ**：一部のアプリケーション機能（取り消し/やり直し、履歴の表示、フォームを以前の値にリセットするなど）は、ミューテーションが起きないのであれば実装が容易です。これはメモリ内に過去の state のコピーを保持しておけば、必要に応じて再利用できるからです。ミューテーションを行うアプローチで始めてしまうと、このような機能を後で追加するのが困難になることがあります。
* **実装のシンプルさ**：React はミューテーションの仕組みに依存しないため、オブジェクトに特別なことを一切しなくてすみます。他の多くの「リアクティブ」系ソリューションは、オブジェクトのプロパティを乗っ取ったり、プロキシにラップしたり、初期化時にその他もろもろの作業を行ったりしていますが、React ではその必要がありません。これが、React がどんな大きさのオブジェクトでも、パフォーマンスや正確性の問題を心配せずに state に入れることができる理由でもあります。

実際には、React の state をミューテートしても何となく動くこともしばしばあるのですが、上記のようなアプローチを念頭に開発された新しい React 機能を使用できるようにするために、ミューテートを避けることを強くお勧めします。将来のコントリビュータや、将来のあなた自身が、あなたに感謝することでしょう！

</DeepDive>

<Recap>

* React のすべての state はイミュータブルとして扱う。
* state にオブジェクトを格納する場合、それらをミューテートしてもレンダーがトリガされない。それは過去のレンダー内の state の「スナップショット」を書き換えているだけである。
* オブジェクトを書き換える代わりに、新たなバージョンのオブジェクトを作成し、その新しいバージョンに state をセットし、再レンダーをトリガする。
* `{...obj, something: 'newValue'}` というオブジェクトスプレッド構文を使ってオブジェクトのコピーを作成できる。
* スプレッド構文は「浅い」、つまり 1 レベルのみのコピーを行う。
* ネストされたオブジェクトを更新するには、更新している場所から一番上までの全オブジェクトのコピーを作成する必要がある。
* コピーのためのコードが冗長になったら Immer を使う。

</Recap>



<Challenges>

#### 間違った state 更新を修正 {/*fix-incorrect-state-updates*/}

このフォームにはいくつかのバグがあります。スコアを増やすボタンを何度かクリックしてみてください。スコアが増えないことに気付くと思います。次に、ファーストネーム欄に入力をしようとすると、思い出したかのようにスコアが最新の値に更新されることを確認してください。最後に、ラストネームを入力してみてください。今度はスコアが完全に消えてしまいます。

あなたの仕事はこれらのバグをすべて修正することです。修正しながら、それぞれのバグがなぜ発生するのかを説明してください。

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

こちらが両方のバグを修正したバージョンです：

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`handlePlusClick` の問題は、`player` オブジェクトを書き換えてしまっていたことです。その結果、React は再レンダーの必要性を認識せず、画面上のスコアは更新されませんでした。ですがファーストネームを編集すると、対応する state が更新されてレンダーがトリガされるので、その際に画面上の*スコアも併せて*最新の値になった、というわけです。

`handleLastNameChange` の問題は、新しいオブジェクトに既存の `...player` フィールドをコピーしなかったことです。これが、ラストネームを編集した後にスコアが消えてしまった理由です。

</Solution>

#### ミューテーションを探して修正 {/*find-and-fix-the-mutation*/}

固定された背景の上にドラッグ可能なボックスが配置されています。ボックスの色は選択ボックスを使って変更できます。

しかし、バグがあります。まずボックスを移動し、次にその色を変更しようとすると、（動かないはずの）背景が、ボックスの位置まで「ジャンプ」してしまいます。`Background` の `position` プロパティは `initialPosition` に設定されており、それは `{ x: 0, y: 0 }` となっているのですから、こんなことは起きないはずではないでしょうか。どうして色を変更すると背景が動いてしまうのでしょうか。

バグを見つけて修正してください。

<Hint>

予期しない変化が起きたということは、ミューテーションがあるということです。`App.js` のミューテーションを見つけて修正してください。

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

問題は `handleMove` 内のミューテーションにあります。`shape.position` を書き換えていますが、それは `initialPosition` が指しているのと同一のオブジェクトです。これが、ボックスと背景が両方動いてしまった原因です。（ミューテーションをしていたためすぐには画面に反映されず、色の変更という無関係な更新により再レンダーがトリガされて初めて、位置の変化が画面に反映されたのです。）

修正方法は、`handleMove` からミューテーションを除去し、スプレッド構文を使って shape をコピーすることです。`+=` はミューテーションですので、通常の `+` 操作を使って書き直す必要があります。

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Immer を使ってオブジェクトを更新 {/*update-an-object-with-immer*/}

これはひとつ前のチャレンジと同じ、バグのある例です。今回は、Immer を使ってミューテーションを修正してください。`useImmer` はすでにインポートされているので、`shape` という state 変数の部分を変更して `useImmer` を使うようにしてください。

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

以下が Immer で書き直した解法です。イベントハンドラがミューテーション形式の書き方になっていますが、バグは発生しないことに注目しましょう。これは、Immer は実際には裏側で、既存のオブジェクトが決して書き換わらないようにしているためです。

<Sandpack>

```js App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
