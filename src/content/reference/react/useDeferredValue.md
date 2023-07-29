---
title: useDeferredValue
---

<Intro>

`useDeferredValue` は、UI の一部の更新を遅延させるための React フックです。

```js
const deferredValue = useDeferredValue(value)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useDeferredValue(value)` {/*usedeferredvalue*/}

コンポーネントのトップレベルで `useDeferredValue` を呼び出し、その値の遅延されたバージョンを取得します。

```js
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `value`: 遅延させたい値。任意の型を持つことができます。

#### 返り値 {/*returns*/}

初回レンダー時には、返される値はあなたが渡した値と同一になります。更新時には、React はまず古い値で再レンダーを試み（つまり返り値は古い値になり）、次に新しい値でバックグラウンドで再レンダーを試みます（返り値は更新後の値になります）。

#### 注意点 {/*caveats*/}

- `useDeferredValue` に渡す値は、プリミティブな値（文字列や数値など）またはレンダーの外部で作成されたオブジェクトであるべきです。レンダー中に新しいオブジェクトを作成してすぐにそれを `useDeferredValue` に渡すと、それは毎回のレンダーで異なるものとなるため、不必要なバックグラウンドでの再レンダーを引き起こします。

- `useDeferredValue` が（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) で比較して）異なる値を受け取ると、（前回の値を使用する）現在のレンダーに加えて、新しい値でバックグラウンドで再レンダーをスケジュールします。バックグラウンドでの再レンダーは中断可能です。`value` に別の更新があると、React はバックグラウンドでの再レンダーを最初からやり直します。例えば、ユーザが素早く入力を行い、それがその値を受け取るチャートコンポーネントが再レンダーできるよりも速かった場合、チャートはユーザがタイプを止めたあとに再表示されることになります。

- `useDeferredValue` は [`<Suspense>`](/reference/react/Suspense) と統合されています。新しい値によって引き起こされるバックグラウンド更新が UI をサスペンドした場合でも、ユーザにフォールバックは表示されません。データが読み込まれるまで、以前の遅延された値が表示され続けます。

- `useDeferredValue` 自体に余計なネットワークリクエストを防ぐ仕組みはありません。

- `useDeferredValue` 自体による固定の遅延はありません。React が元の再レンダーを終えるとすぐに、新しい遅延値でのバックグラウンド再レンダー作業を開始します。イベント（タイピングなど）による更新は、バックグラウンドの再レンダーを中断して優先的に処理されます。

- `useDeferredValue` によるバックグラウンドの再レンダーは、画面にコミットされるまでエフェクトを実行しません。バックグラウンドの再レンダーがサスペンドする場合、その再レンダーに対応するエフェクトはデータの読み込みと UI の更新の後に実行されます。

---

## 使用法 {/*usage*/}

### 新しいコンテンツが読み込まれている間、古いコンテンツを表示する {/*showing-stale-content-while-fresh-content-is-loading*/}

UI の一部の更新を遅延させるために、コンポーネントのトップレベルで `useDeferredValue` を呼び出します。

```js [[1, 5, "query"], [2, 5, "deferredQuery"]]
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  // ...
}
```

初回レンダー時には、<CodeStep step={2}>遅延される値</CodeStep>は関数に渡した<CodeStep step={1}>値</CodeStep>と同じになります。

更新時には、<CodeStep step={2}>遅延される値</CodeStep>は最新の<CodeStep step={1}>値</CodeStep>から「遅れ」ます。具体的には、React はまず遅延値を*更新せずに*再レンダーを行い、次に新たに受け取った値でバックグラウンドでの再レンダーを試みます。

**例を使って、これが役立つ場面を見ていきましょう**。

<Note>

この例では、以下のようなサスペンス (Suspense) 対応のデータソースを使用していることを前提としています。

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) や [Next.js](https://nextjs.org/docs/getting-started/react-essentials) のようなサスペンス対応のフレームワークでのデータフェッチ
- [`lazy`](/reference/react/lazy) を用いたコンポーネントコードの遅延ロード

[サスペンスとその制限について詳しく学ぶ。](/reference/react/Suspense)

</Note>


この例では、`SearchResults` コンポーネントは検索結果をフェッチする間[サスペンド](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)します。`"a"` を入力し、結果を待ってから `"ab"` に書き換えてみてください。`"a"` の検索結果が、ロード中フォールバックに置換されてしまいます。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={query} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

この代わりに一般的に使われる UI パターンは、結果リストの更新を*遅延*させて、新しい結果が準備できるまで前の結果を表示し続けるというものです。遅延バージョンのクエリ文字列を渡すために `useDeferredValue` を呼び出します：

```js {3,11}
export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

`query` の方はすぐに更新されるため、入力フィールドは新しい値を表示します。しかし、`deferredQuery` はデータが読み込まれるまで前の値を保持するため、`SearchResults` はしばらく古い結果を表示します。

以下の例で `"a"` を入力し、結果が読み込まれるのを待ち、次に入力欄を `"ab"` に書き換えてみてください。新しい結果が読み込まれるまでは、サスペンスによるフォールバックの代わりに古い結果リストが表示され続けることに着目してください。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

<DeepDive>

#### 値の遅延は内部でどのように動作するのか？ {/*how-does-deferring-a-value-work-under-the-hood*/}

値の遅延は 2 つのステップで行われると考えることができます：

1. **まず React は、`query` は新しい値 (`"ab"`) だが `deferredQuery` は古い値 (`"a"`) のまま、という状態で再レンダーを試みます**。結果リストに渡す側の値である `deferredQuery` は*遅延されて*おり、`query` の値に「遅れて」ついていきます。

2. **バックグラウンドで React は、`query` と `deferredQuery` の両方が `"ab"` に更新された状態で再レンダーを試みます**。この再レンダーが完了した場合、React はそれを画面に表示します。しかし、それがサスペンドした（`"ab"` の結果がまだ読み込まれていない）場合、React はこのレンダーの試行を放棄し、データが読み込まれた後にこの再レンダーを再試行します。ユーザは、データが準備できるまで古い遅延された値を見続けます。

遅延された「バックグラウンド」レンダーは中断可能です。例えば、再度入力欄にタイプを行うと、React はそれを放棄し、新しい値でやり直します。React は常に最後に提供された値を使用します。

各キーストロークごとにネットワークリクエストは発生していることに注意してください。ここで（準備ができるまで）遅延させているのは結果の表示であり、ネットワークリクエスト自体ではありません。ユーザが入力を続けた場合でも、各キーストロークのレスポンスはキャッシュされているため、Backspace を押すと即座に反応し、再度のフェッチは起きません。

</DeepDive>

---

### コンテンツが古いことをインジケータで表示する {/*indicating-that-the-content-is-stale*/}

上記の例では、最新のクエリの結果リストがまだロード中であることを示すインジケータがありません。新しい結果がロードされるのに時間がかかると、ユーザの混乱を招く可能性があります。結果リストが最新のクエリと一致していないことをユーザに明確に伝えるために、古い結果リストが表示されているときに視覚的なインジケータを追加することができます：

```js {2}
<div style={{
  opacity: query !== deferredQuery ? 0.5 : 1,
}}>
  <SearchResults query={deferredQuery} />
</div>
```

これにより、入力を開始すると直ちに、古い結果リストがわずかに暗くなり、新しい結果リストがロードされるまでその状態が続きます。以下の例のように、暗くなるのを遅延させる CSS トランジションを追加することで、徐々に変化するように感じさせることもできます。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { Suspense, useState, useDeferredValue } from 'react';
import SearchResults from './SearchResults.js';

export default function App() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={e => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div style={{
          opacity: isStale ? 0.5 : 1,
          transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'
        }}>
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  );
}
```

```js SearchResults.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function SearchResults({ query }) {
  if (query === '') {
    return null;
  }
  const albums = use(fetchData(`/search?q=${query}`));
  if (albums.length === 0) {
    return <p>No matches for <i>"{query}"</i></p>;
  }
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}

// This is a workaround for a bug to get the demo running.
// TODO: replace with real implementation when the bug is fixed.
function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },      
    );
    throw promise;
  }
}
```

```js data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/search?q=')) {
    return await getSearchResults(url.slice('/search?q='.length));
  } else {
    throw Error('Not implemented');
  }
}

async function getSearchResults(query) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  const allAlbums = [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];

  const lowerQuery = query.trim().toLowerCase();
  return allAlbums.filter(album => {
    const lowerTitle = album.title.toLowerCase();
    return (
      lowerTitle.startsWith(lowerQuery) ||
      lowerTitle.indexOf(' ' + lowerQuery) !== -1
    )
  });
}
```

```css
input { margin: 10px; }
```

</Sandpack>

---

### UI の一部分の再レンダーを遅延させる {/*deferring-re-rendering-for-a-part-of-the-ui*/}

`useDeferredValue` をパフォーマンス最適化として適用することもできます。これは、UI の一部の再レンダーに時間がかかり、それを最適化する簡単な方法がないが、それによって UI の他の部分がブロックされるのを防ぎたい、という場合に有用です。

テキストフィールドと、各キーストロークごとに再レンダーするコンポーネント（チャートや長いリストなど）があると想像してみてください：

```js
function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

まずは `SlowList` を最適化して、props が同じ場合は再レンダーをスキップするようにします。これを行うには、[`memo` でラップします](/reference/react/memo#skipping-re-rendering-when-props-are-unchanged)。

```js {1,3}
const SlowList = memo(function SlowList({ text }) {
  // ...
});
```

しかし、これが有用なのは `SlowList` の props が前回のレンダー時と*同一*である場合のみです。現在直面している問題は、props が*異なっており*現に別の見た目の結果を表示しないといけない場合に遅い、ということです。

具体的には、主なパフォーマンスの問題は、入力フィールドに何かを入力するたびに、`SlowList` が新しい props を受け取り、そのツリー全体を再レンダーするため、入力がもたつく感じになるということです。このようなケースでは、`useDeferredValue` を使うことで、入力フィールドの更新（速くなければならない）を結果リストの更新（遅くても許される）よりも優先することが可能です。

```js {3,7}
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

これによって `SlowList` の再レンダー自体を高速化しているわけではありません。しかし、React に対して、リストの再レンダーは優先度を下げても良いと伝えることで、キーストロークをブロックしないようにします。リストは入力フィールドの「後を追う」形になり、その後「追いつきます」。元と同様に、React はできるだけ早くリストを更新しようとしますが、ユーザの入力をブロックすることはなくなります。

<Recipes titleText="useDeferredValue と最適化されていない再レンダーの違い" titleId="examples">

#### 遅延されたリストの再レンダー {/*deferred-re-rendering-of-the-list*/}

この例では、`useDeferredValue` が入力をレスポンシブに保つ方法を確認できるよう、`SlowList` コンポーネントの各アイテムが**人為的に遅延**させられています。入力フィールドに入力してみて、スムースに入力できる一方で、リストがそれを「追いかける」様子を確認してください。

<Sandpack>

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

#### 最適化されていないリストの再レンダー {/*unoptimized-re-rendering-of-the-list*/}

この例では、`SlowList` コンポーネントの各アイテムに**人為的な遅延**がありますが、`useDeferredValue` がありません。

入力フィールドに入力すると非常にもたつく感じがすることに気づくでしょう。これは、`useDeferredValue` がないと、各キーストロークが強制的に、リスト全体を即座にかつ中断不可能な方法で再レンダーするからです。

<Sandpack>

```js
import { useState } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={text} />
    </>
  );
}
```

```js SlowList.js
import { memo } from 'react';

const SlowList = memo(function SlowList({ text }) {
  // Log once. The actual slowdown is inside SlowItem.
  console.log('[ARTIFICIALLY SLOW] Rendering 250 <SlowItem />');

  let items = [];
  for (let i = 0; i < 250; i++) {
    items.push(<SlowItem key={i} text={text} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowItem({ text }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Text: {text}
    </li>
  )
}

export default SlowList;
```

```css
.items {
  padding: 0;
}

.item {
  list-style: none;
  display: block;
  height: 40px;
  padding: 5px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<Solution />

</Recipes>

<Pitfall>

この最適化が動作するには `SlowList` が [`memo`](/reference/react/memo) でラップされていることが必要です。これは、`text` が変更されるたびに、React が親コンポーネント側を素早く再レンダーできるようにする必要があるからです。その再レンダー中には、`deferredText` はまだ前の値になっており、`SlowList` は（props が変更されていないので）再レンダーをスキップできます。[`memo`](/reference/react/memo) がなければ、`SlowList` は常に再レンダーされてしまい、最適化の意味が失われてしまいます。

</Pitfall>

<DeepDive>

#### 値の遅延とデバウンスやスロットリングとの違い {/*how-is-deferring-a-value-different-from-debouncing-and-throttling*/}

このようなシナリオにおいて使ったことがあるかもしれない、よくある最適化手法が 2 つあります。

- *デバウンス (debounce)* は、ユーザが入力を（例えば 1 秒間）停止するまでリストの更新を待つという意味です。
- *スロットリング (throttling)* は、一定の間隔（例えば最大で 1 秒に 1 回）でリストを更新するという意味です。

これらの手法は一部のケースで役立ちますが、`useDeferredValue` は React 自体と深く統合されており、ユーザのデバイスに適応するため、レンダーの最適化により適しています。

デバウンスやスロットリングとは異なり、遅延される時間を固定で選ぶ必要はありません。ユーザのデバイスが速い場合（例えばパワフルなラップトップ）、遅延された再レンダーはほぼ即座に行われるため、気づかれません。ユーザのデバイスが遅い場合、リストはデバイスの遅さに比例するように入力から「遅れ」ていきます。

また、デバウンスやスロットリングとは異なり、`useDeferredValue` による遅延された再レンダーはデフォルトで中断可能です。これは、React が大きなリストを再レンダーしている途中で、ユーザが別のキーストロークを行うと、React はその再レンダーを放棄し、キーストロークを処理し、再びバックグラウンドでレンダーをやり直せるという意味です。対照的に、デバウンスやスロットリングの動作は*ブロッキング*であるため、やはり不快な体験を生み出します。それらはレンダーがキーストロークをブロックするタイミングを単に遅らせているに過ぎないのです。

最適化しようとしている作業がレンダーの最中に行われるものでない場合、デバウンスとスロットリングは依然として有用です。例えば、ネットワークリクエストの回数を減らすことができます。これらの手法を一緒に使用することもできます。

</DeepDive>
