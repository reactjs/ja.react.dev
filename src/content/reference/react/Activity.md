---
title: <Activity>
---

<Intro>

`<Activity>` を使い、UI の一部を非表示にしたり表示したりします。

```js
<Activity mode={visibility}>
  <Sidebar />
</Activity>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<Activity>` {/*activity*/}

Activity を使用して、アプリケーションの一部を非表示にすることができます。

```js [[1, 1, "\\"hidden\\""], [2, 2, "<Sidebar />"], [3, 1, "\\"visible\\""]]
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

Activity バウンダリが <CodeStep step={1}>hidden</CodeStep> になっている場合、React は `display: "none"` の CSS プロパティを使って<CodeStep step={2}>その子</CodeStep>を視覚的に非表示にします。また、それらのエフェクトを破棄することですべてのアクティブなサブスクリプションをクリーンアップします。

非表示の間も、子は新しい props に反応して再レンダーされますが、他のコンテンツよりも低い優先度で行われます。

バウンダリが再び <CodeStep step={3}>visible</CodeStep> になると、React は以前の state を復元した状態で子を表示し、エフェクトを再作成します。

このように、Activity は「バックグラウンドアクティビティ」をレンダーするためのメカニズムと考えることができます。再度表示される可能性が高いコンテンツを完全に破棄する代わりに、Activity を使用することでそのコンテンツの UI と内部状態を維持・復元しつつ、非表示のコンテンツが不要な副作用を持たないようにすることができます。

[さらに例を見る](#usage)

#### props {/*props*/}

* `children`: 表示・非表示を切り替えたい UI。
* `mode`: `'visible'` または `'hidden'` の文字列。省略時は `'visible'` になる。

#### 注意点 {/*caveats*/}

- [`ViewTransition`](/reference/react/ViewTransition) の内部で Activity がレンダーされ、[`startTransition`](/reference/react/startTransition) によって引き起こされた更新の結果として表示されるようになると、`ViewTransition` の `enter` アニメーションが作動します。非表示になると、`exit` アニメーションが作動します。
- テキストのみをレンダーする Activity は、非表示のテキストをレンダーするのではなく、何もレンダーしません。これは、可視性の変化を適用するための対応する DOM 要素がないためです。例えば、`<Activity mode="hidden"><ComponentThatJustReturnsText /></Activity>` は、`const ComponentThatJustReturnsText = () => "Hello, World!"` の場合に DOM に何も出力しません。

---

## 使用法 {/*usage*/}

### 非表示コンポーネントの state を復元する {/*restoring-the-state-of-hidden-components*/}

React では、条件に応じてコンポーネントの表示、非表示を切り替えたい場合、典型的にはその条件に基づいてコンポーネントのマウントとアンマウントを繰り返します。

```jsx
{isShowingSidebar && (
  <Sidebar />
)}
```

しかしコンポーネントをアンマウントすると内部の state が破棄されてしまい、これは必ずしも望ましくはありません。

Activity バウンダリを用いてコンポーネントを非表示にすると、React は state を後で使うために「セーブ」しておくことができます。

```jsx
<Activity mode={isShowingSidebar ? "visible" : "hidden"}>
  <Sidebar />
</Activity>
```

これにより、コンポーネントを非表示にした後で、以前の state を保持した状態で復元することが可能です。

次の例には、展開可能なセクションを持つサイドバーがあります。"Overview" を押すと、その下にある 3 つのサブアイテムが表示されます。アプリのメイン領域には、サイドバーを表示したり非表示にしたりするためのボタンもあります。

Overview セクションを展開してから、サイドバーを閉じ、また開いてみてください。

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      {isShowingSidebar && (
        <Sidebar />
      )}

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

Overview セクションが、常に折りたたまれた状態で表示されてしまっています。`isShowingSidebar` が `false` になる際にサイドバーをアンマウントするため、その内部の state もすべて失われてしまうのです。

これは Activity の完璧なユースケースです。サイドバーを視覚的に非表示にしている間でも、その内部 state を保持することができます。

サイドバーの条件付きレンダーを Activity バウンダリに置き換えてみましょう。

```jsx {7,9}
// Before
{isShowingSidebar && (
  <Sidebar />
)}

// After
<Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
  <Sidebar />
</Activity>
```

新しい動作を確認してみてください。

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';

import Sidebar from './Sidebar.js';

export default function App() {
  const [isShowingSidebar, setIsShowingSidebar] = useState(true);

  return (
    <>
      <Activity mode={isShowingSidebar ? 'visible' : 'hidden'}>
        <Sidebar />
      </Activity>

      <main>
        <button onClick={() => setIsShowingSidebar(!isShowingSidebar)}>
          Toggle sidebar
        </button>
        <h1>Main content</h1>
      </main>
    </>
  );
}
```

```js src/Sidebar.js
import { useState } from 'react';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  
  return (
    <nav>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        Overview
        <span className={`indicator ${isExpanded ? 'down' : 'right'}`}>
          &#9650;
        </span>
      </button>

      {isExpanded && (
        <ul>
          <li>Section 1</li>
          <li>Section 2</li>
          <li>Section 3</li>
        </ul>
      )}
    </nav>
  );
}
```

```css
body { height: 275px; margin: 0; }
#root {
  display: flex;
  gap: 10px;
  height: 100%;
}
nav {
  padding: 10px;
  background: #eee;
  font-size: 14px;
  height: 100%;
}
main {
  padding: 10px;
}
p {
  margin: 0;
}
h1 {
  margin-top: 10px;
}
.indicator {
  margin-left: 4px;
  display: inline-block;
  rotate: 90deg;
}
.indicator.down {
  rotate: 180deg;
}
```

</Sandpack>

サイドバーの実装を変更することなく、内部の state が復元されるようになりました。

---

### 非表示コンポーネントの DOM を保持する {/*restoring-the-dom-of-hidden-components*/}

Activity バウンダリは `display: none` を使って子を非表示にするため、非表示状態の場合には子の DOM も保持されます。これにより、ユーザが再び操作する可能性がある UI の一時的な状態を保持しておくのにも役立ちます。

以下の例では、Contact タブにはユーザがメッセージを入力するための `<textarea>` があります。何かテキストを入力し、Home タブに切り替えて、再び Contact タブに戻ると、下書きのメッセージは消えてしまいます。

<Sandpack>

```js src/App.js 
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'contact' && <Contact />}
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js active
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

これは `App` 内の `Contact` を完全にアンマウントしているからです。Contact タブがアンマウントされると、`<textarea>` 要素内の DOM の状態も失われてしまいます。

Activity バウンダリを用いて表示・非表示状態を切り替えるようにすることで、それぞれのタブの DOM 要素を保持することができます。テキストを入力した後にタブを切り替え、下書きメッセージが消えなくなったことを確認してください。

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Contact from './Contact.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'contact'}
        onClick={() => setActiveTab('contact')}
      >
        Contact
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'contact' ? 'visible' : 'hidden'}>
        <Contact />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Contact.js 
export default function Contact() {
  return (
    <div>
      <p>Send me a message!</p>

      <textarea />

      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </div>
  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

今回も、Activity バウンダリのおかげで、Contact タブの実装を書き換えることなく、その内部状態を保持できるようになったわけです。

---

### 表示される可能性が高いコンテンツのプリレンダー {/*pre-rendering-content-thats-likely-to-become-visible*/}

ここまでは、ユーザが何らかの操作を行ったコンテンツを非表示にした後も、Activity がその一時的な状態を保持できる、という例を見てきました。

しかし Activity バウンダリは、ユーザがコンテンツを初めて目にする前にそれを**準備**しておくために使用することも可能です。

```jsx [[1, 1, "\\"hidden\\""]]
<Activity mode="hidden">
  <SlowComponent />
</Activity>
```

Activity バウンダリが初回レンダー時に <CodeStep step={1}>hidden</CodeStep> になっている場合、その子はページ上では表示されませんが、**レンダーは発生します**。ただし表示されているコンテンツよりも優先度は低くなり、かつエフェクトのセットアップも起きません。

この*プリレンダリング*により、子は事前に必要なコードやデータをロードできます。そのため後で Activity バウンダリが表示される場合に、子をより短い読み込み時間で素早く表示できます。

例を見てみましょう。

以下のデモでは、Posts タブがとあるデータをロードしています。押すと、データがフェッチされている間、サスペンスフォールバックが表示されてしまっています。

<Sandpack>

```js src/App.js
import { useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        {activeTab === 'home' && <Home />}
        {activeTab === 'posts' && <Posts />}
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

これはタブがアクティブになるまで `App` は `Posts` をマウントしないからです。

`App` を書き換えて、Activity バウンダリを使ってタブの表示状態を切り替えるようにすると、`Posts` はアプリの初回読み込み時にプリレンダーされます。このためタブが実際に表示される前にデータのフェッチが行えます。

Posts タブをクリックしてみてください。

<Sandpack>

```js src/App.js
import { Activity, useState, Suspense } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Posts from './Posts.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'posts'}
        onClick={() => setActiveTab('posts')}
      >
        Posts
      </TabButton>

      <hr />

      <Suspense fallback={<h1>🌀 Loading...</h1>}>
        <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
          <Home />
        </Activity>
        <Activity mode={activeTab === 'posts' ? 'visible' : 'hidden'}>
          <Posts />
        </Activity>
      </Suspense>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Posts.js
import { use } from 'react';
import { fetchData } from './data.js';

export default function Posts() {
  const posts = use(fetchData('/posts'));

  return (
    <ul className="items">
      {posts.map(post =>
        <li className="item" key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
}
```

```js src/data.js hidden
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
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 10; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

非表示の Activity バウンダリのおかげで、`Posts` は素早いレンダーに備えることができました。

---

非表示の Activity バウンダリを使ったコンポーネントのプリレンダーは、ユーザが次に操作する可能性が高い UI のロード時間を短縮するための強力な方法です。

<Note>

**プリレンダー中にフェッチされるのは、サスペンス対応のデータソースのみです**。これには以下のものが含まれます。

- [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) や [Next.js](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#streaming-with-suspense) のようなサスペンス対応のフレームワークでのデータフェッチ
- [`lazy`](/reference/react/lazy) を使ったコンポーネントコードの遅延ロード
- [`use`](/reference/react/use) を使ったキャッシュ済みプロミスからの値の読み取り

Activity は、エフェクト内部でフェッチされたデータを検出**しません**。

上記の `Posts` コンポーネントでデータをロードする具体的な方法については、使用しているフレームワークに依存します。サスペンス対応のフレームワークを使用している場合、詳細はそのフレームワークのデータフェッチのドキュメントに記載されています。

使い方に規約のある (opinionated) フレームワーク以外でサスペンス対応のデータフェッチを行うことは、まだサポートされていません。サスペンス対応のデータソースを実装するための要件は安定しておらず、ドキュメント化されていません。データソースをサスペンスと統合するための公式な API は、React の将来のバージョンでリリースされる予定です。

</Note>

---


### ページ読み込み中のユーザ操作の高速化 {/*speeding-up-interactions-during-page-load*/}

React には、選択的ハイドレーション (Selective Hydration) と呼ばれる内部的なパフォーマンス最適化機能が含まれています。これは、アプリの初期 HTML を*分割して*ハイドレーションすることで、ページ上の他のコンポーネントがまだコードやデータをロードしていない場合でも、一部のコンポーネントを操作可能にするというものです。

サスペンスバウンダリは選択的ハイドレーションの構成要素です。コンポーネントツリーを互いに独立した単位に自然に分割するものだからです。

```jsx
function Page() {
  return (
    <>
      <MessageComposer />

      <Suspense fallback="Loading chats...">
        <Chats />
      </Suspense>
    </>
  )
}
```

ここでは、`MessageComposer` は、`Chats` がマウントされてデータのフェッチを開始する前であっても、ページの初回レンダー時に完全にハイドレートできます。

このように、サスペンスを使ってコンポーネントツリーを個別のユニットに分割することで、React はサーバでレンダーされたアプリの HTML を分割してハイドレーションできるようになり、アプリの一部を可能な限り速く操作可能にできます。

サスペンスを使用していないページだとどうなるのでしょうか？

以下の、タブの例を見てみましょう。

```jsx
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      {activeTab === 'home' && (
        <Home />
      )}
      {activeTab === 'video' && (
        <Video />
      )}
    </>
  )
}
```

この場合、React はページ全体を一度にハイドレーションしなければなりません。`Home` または `Video` のレンダーが遅い場合、ハイドレーション中にタブボタンが反応しないように感じられる可能性があります。

アクティブなタブの周りにサスペンスを追加すれば、これは解決します。

```jsx {13,20}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Suspense fallback={<Placeholder />}>
        {activeTab === 'home' && (
          <Home />
        )}
        {activeTab === 'video' && (
          <Video />
        )}
      </Suspense>
    </>
  )
}
```

...しかし、初回レンダー時に `Placeholder` フォールバックが表示されるため、UI の見た目が変わってししまいます。

代わりに Activity を使用することができます。Activity バウンダリは子を表示状態を切り替えるためのものなので、すでに自然とコンポーネントツリーを独立したユニットに分割していることになります。つまりサスペンスと同様、この機能により選択的ハイドレーションを構成することができるのです。

上記の例を更新して、アクティブなタブの周りに Activity バウンダリを使用してみましょう。

```jsx {13-18}
function Page() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <>
      <TabButton onClick={() => setActiveTab('home')}>
        Home
      </TabButton>
      <TabButton onClick={() => setActiveTab('video')}>
        Video
      </TabButton>

      <Activity mode={activeTab === "home" ? "visible" : "hidden"}>
        <Home />
      </Activity>
      <Activity mode={activeTab === "video" ? "visible" : "hidden"}>
        <Video />
      </Activity>
    </>
  )
}
```

これで、サーバでレンダーされる初期 HTML は元のバージョンと同じになりますが、Activity のおかげで、React は `Home` や `Video` をマウントする前に、タブボタンを先にハイドレートすることができます。

---

このように、コンテンツを非表示にしたり表示したりすることに加えて、Activity バウンダリは、ページのどの部分が独立して操作可能になれるかを React に知らせることで、ハイドレーション中のアプリのパフォーマンスを向上させるのに役立ちます。

そしてページがコンテンツの一部を非表示にすることがない場合でも、常に visible な Activity バウンダリを追加することで、ハイドレーションのパフォーマンスを向上させることも可能です。

```jsx
function Page() {
  return (
    <>
      <Post />

      <Activity>
        <Comments />
      </Activity>
    </>
  );
} 
```

---

## トラブルシューティング {/*troubleshooting*/}

### 非表示コンポーネントに望ましくない副作用がある {/*my-hidden-components-have-unwanted-side-effects*/}

Activity バウンダリは、子に `display: none` を設定し、そのエフェクトをクリーンアップすることで、コンテンツを非表示にします。したがって、副作用を適切にクリーンアップする行儀の良い React コンポーネントのほとんどは、Activity によって非表示にされても問題なく動作するはずです。

しかし、非表示にされたコンポーネントが、アンマウントされた場合とは異なる動作をする状況が存在します。特に顕著なのは、非表示コンポーネントの DOM は破棄されないため、その DOM からの副作用は、コンポーネントが非表示になった後でも持続するということです。

例として、`<video>` タグを考えてみましょう。通常、これはクリーンアップを必要としません。なぜなら、ビデオを再生している最中であっても、タグをアンマウントすればブラウザでのビデオと音声の再生は停止するからです。以下のデモで、ビデオを再生してから Home を押してみてください。

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      {activeTab === 'home' && <Home />}
      {activeTab === 'video' && <Video />}
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
export default function Video() {
  return (
    <video
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
      controls
      playsInline
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

予想通り、ビデオの再生が停止しました。

では次に、ユーザが最後に視聴していた時点のタイムコードを保持して、Video タブに戻ったときに最初から再生し直さないようにしたいとしましょう。

これは Activity の素晴らしいユースケースです！

`App` を更新して、非アクティブなタブをアンマウントする代わりに、hidden 状態の Activity バウンダリで隠すようにし、今度はデモがどう動作するか見てみましょう。

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
export default function Video() {
  return (
    <video
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

おっと！ タブの `<video>` 要素がまだ DOM に残っているため、非表示になった後もビデオと音声が再生され続けてしまいます。

これを修正するには、ビデオを一時停止するクリーンアップ関数を持つエフェクトを追加します。

```jsx {2,4-10,14}
export default function VideoTab() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current;

    return () => {
      videoRef.pause()
    }
  }, []);

  return (
    <video
      ref={ref}
      controls
      playsInline
      src="..."
    />

  );
}
```

`useEffect` の代わりに `useLayoutEffect` を呼び出しています。これは概念的に、クリーンアップコードがコンポーネントの UI が視覚的に非表示にされることに結びついているためです。通常のエフェクトを使用すると、（たとえば）再サスペンドするサスペンスバウンダリやビュー遷移 (view transition) によってコードの実行が遅延する可能性があります。

新しい動作を見てみましょう。ビデオを再生し、Home タブに切り替え、その後 Video タブに戻してみてください。

<Sandpack>

```js src/App.js active
import { Activity, useState } from 'react';
import TabButton from './TabButton.js';
import Home from './Home.js';
import Video from './Video.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('video');

  return (
    <>
      <TabButton
        isActive={activeTab === 'home'}
        onClick={() => setActiveTab('home')}
      >
        Home
      </TabButton>
      <TabButton
        isActive={activeTab === 'video'}
        onClick={() => setActiveTab('video')}
      >
        Video
      </TabButton>

      <hr />

      <Activity mode={activeTab === 'home' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      <Activity mode={activeTab === 'video' ? 'visible' : 'hidden'}>
        <Video />
      </Activity>
    </>
  );
}
```

```js src/TabButton.js hidden
export default function TabButton({ onClick, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```js src/Home.js
export default function Home() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/Video.js 
import { useRef, useLayoutEffect } from 'react';

export default function Video() {
  const ref = useRef();

  useLayoutEffect(() => {
    const videoRef = ref.current

    return () => {
      videoRef.pause()
    };
  }, [])

  return (
    <video
      ref={ref}
      controls
      playsInline
      // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
      src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    />

  );
}
```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
video { width: 300px; margin-top: 10px; aspect-ratio: 16/9; }
```

</Sandpack>

完璧に動作しますね！ クリーンアップ関数により、Activity バウンダリで非表示にされた場合にビデオが確実に停止するようになりました。さらに良いことに、`<video>` タグが破棄されないため、タイムコードは保持され、ユーザが戻ってきて視聴を続ける際にビデオを再度初期化したりダウンロードしたりする必要もありません。

これは、非表示になるがユーザがすぐに再び操作する可能性が高い UI パーツについて、一時的な DOM の状態を保持するために Activity を使用できる、優れた例です。

---

この例は、`<video>` のような特定のタグでは、アンマウントと非表示で動作が異なることを示しています。コンポーネントが副作用を持つ DOM をレンダーしていて、Activity バウンダリがそれを非表示にしたときにその副作用を防ぎたい場合は、クリーンアップするための関数を返すエフェクトを追加するようにしてください。

これが最も一般的に当てはまるのは、以下のタグです。

  - `<video>`
  - `<audio>`
  - `<iframe>`

ただし通常は、React コンポーネントのほとんどは、Activity バウンダリによって非表示にされても問題なく動作するはずです。そして概念的には、「非表示」の Activity はアンマウントされているものとして考えるべきです。

適切なクリーンアップを行っていないエフェクトを積極的に発見するために、[`<StrictMode>`](/reference/react/StrictMode) の使用をお勧めします。これは Activity バウンダリだけでなく、React の他の多くの動作にとっても重要です。

---


### 非表示コンポーネントのエフェクトが実行されない {/*my-hidden-components-have-effects-that-arent-running*/}

`<Activity>` が "hidden" の場合、子のすべてのエフェクトがクリーンアップされます。概念的には、子はアンマウントされますが、React は後で使うために state を保存します。これは Activity の機能です。つまり、UI の非表示部分に対してサブスクリプションがアクティブにならないため、非表示コンテンツに必要な負荷が削減されます。

コンポーネントの副作用をクリーンアップするためにエフェクトのマウントに依存している場合は、代わりにエフェクトから返すクリーンアップ関数内でその作業を行うよう、エフェクトをリファクタリングしてください。

問題のあるエフェクトを積極的に見つけるために、[`<StrictMode>`](/reference/react/StrictMode) を追加することをお勧めします。これは Activity のアンマウントとマウントを積極的に実行して、予期しない副作用をキャッチします。