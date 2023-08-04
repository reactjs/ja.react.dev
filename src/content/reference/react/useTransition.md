---
title: useTransition
---

<Intro>

`useTransition` は、UI をブロックせずに state を更新するための React フックです。

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useTransition()` {/*usetransition*/}

コンポーネントのトップレベルで `useTransition` を呼び出し、state 更新の一部をトランジションとしてマークします。

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

`useTransition` には引数はありません。

#### 返り値 {/*returns*/}

`useTransition` は常に 2 つの要素を含む配列を返します。

1. トランジションが保留中であるかどうかを示す `isPending` フラグ。
2. state 更新をトランジションとしてマークするための [`startTransition` 関数](#starttransition)。

---

### `startTransition` 関数 {/*starttransition*/}

`useTransition` によって返される `startTransition` 関数により、ある state 更新をトランジションとしてマークすることができます。

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

#### 引数 {/*starttransition-parameters*/}

* `scope`: 1 つ以上の [`set` 関数](/reference/react/useState#setstate)を呼び出して state を更新する関数。React は引数なしで直ちに `scope` を呼び出し、`scope` 関数呼び出し中に同期的にスケジュールされたすべての state 更新をトランジションとしてマークします。このような更新は[ノンブロッキング](#marking-a-state-update-as-a-non-blocking-transition)になり、[不要なローディングインジケータを表示しない](#preventing-unwanted-loading-indicators)ようになります。

#### 返り値 {/*starttransition-returns*/}

`startTransition` は何も返しません。

#### 注意点 {/*starttransition-caveats*/}

* `useTransition` はフックであるため、コンポーネント内かカスタムフック内でのみ呼び出すことができます。他の場所（例えば、データライブラリ）でトランジションを開始する必要がある場合は、代わりにスタンドアロンの [`startTransition`](/reference/react/startTransition) を呼び出してください。

* state の `set` 関数にアクセスできる場合にのみ、state 更新をトランジションにラップできます。ある props やカスタムフックの値に反応してトランジションを開始したい場合は、代わりに [`useDeferredValue`](/reference/react/useDeferredValue) を試してみてください。

* `startTransition` に渡す関数は同期的でなければなりません。React はこの関数を直ちに実行し、その実行中に行われるすべての state 更新をトランジションとしてマークします。後になって（例えばタイムアウト内で）さらに state 更新をしようとすると、それらはトランジションとしてマークされません。

* トランジションとしてマークされた state 更新は、他の state 更新によって中断されます。例えば、トランジション内でチャートコンポーネントを更新した後、チャートの再レンダーの途中で入力フィールドに入力を始めた場合、React は入力欄の更新の処理後にチャートコンポーネントのレンダー作業を再開します。

* トランジションによる更新はテキスト入力欄の制御には使用できません。

* 進行中のトランジションが複数ある場合、React は現在それらをひとつに束ねる処理を行います。この制限は将来のリリースではおそらく削除されます。

---

## 使用法 {/*usage*/}

### state 更新をノンブロッキングのトランジションとしてマークする {/*marking-a-state-update-as-a-non-blocking-transition*/}

コンポーネントのトップレベルで `useTransition` を呼び出し、state 更新を非ブロッキングの*トランジション*としてマークします。

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` は正確に 2 つの項目を含む配列を返します：

1. トランジションが保留中であるかどうかを示す <CodeStep step={1}>`isPending` フラグ</CodeStep>。
2. state 更新をトランジションとしてマークするための <CodeStep step={2}>`startTransition` 関数</CodeStep>。

その後、次のようにして state 更新をトランジションとしてマークできます。

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

トランジションを使用することで、遅いデバイスでもユーザインターフェースの更新をレスポンシブに保つことができます。

トランジションを使用すると、再レンダーの途中でも UI がレスポンシブに保たれます。例えば、ユーザがタブをクリックしたが、その後気が変わって別のタブをクリックする場合、最初の再レンダーが終了するのを待つことなくそれを行うことができます。

<Recipes titleText="useTransition と通常の state 更新の違い" titleId="examples">

#### トランジションで現在のタブを更新する {/*updating-the-current-tab-in-a-transition*/}

この例では、"Posts" タブが**人為的に遅延**させられているため、レンダーには少なくとも 1 秒かかります。

"Posts" をクリックし、すぐに "Contact" をクリックしてみてください。これにより、"Posts" の遅いレンダーが中断されます。"Contact" タブはすぐに表示されます。この state 更新はトランジションとしてマークされているため、遅い再レンダーがユーザインターフェースをフリーズさせることはありません。

<Sandpack>

```js
import { useState, useTransition } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);      
    });
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

#### トランジションなしで現在のタブを更新する {/*updating-the-current-tab-without-a-transition*/}

この例でも、"Posts" タブが**人為的に遅延**させられているため、レンダーには少なくとも 1 秒かかります。前の例とは異なり、この state 更新は**トランジションではありません**。

"Posts" をクリックし、直後に "Contact" をクリックしてみてください。アプリはこの遅いタブのレンダー中にフリーズし、UI は反応しなくなります。この state 更新はトランジションではないため、遅い再レンダーがユーザインターフェースをフリーズさせたのです。

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    setTab(nextTab);
  }

  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => selectTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => selectTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => selectTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  )
}

```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### トランジション中に親コンポーネントを更新する {/*updating-the-parent-component-in-a-transition*/}

`useTransition` の呼び出しから親コンポーネントの state を更新することもできます。例えば、この `TabButton` コンポーネントは `onClick` のロジックをトランジションでラップしています。

```js {8-10}
export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

親コンポーネントは `onClick` イベントハンドラ内で state を更新しているため、その state 更新はトランジションとしてマークされます。このため、前の例と同様に、"Post" をクリックした直後に "Contact" をクリックできます。選択されたタブの更新はトランジションとしてマークされているため、ユーザ操作をブロックしません。

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
```

</Sandpack>

---

### トランジション中に保留中状態を視覚的に表示する {/*displaying-a-pending-visual-state-during-the-transition*/}

`useTransition` によって返される `isPending` ブーリアン値を使用して、ユーザにトランジションが進行中であることを示すことができます。例えば、タブボタンは特別な "pending" という視覚的状態を持つことができます。

```js {4-6}
function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

"Posts" をクリックすると、タブボタン自体がすぐに更新されるため、より反応が良く感じられることに着目してください。

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### 望ましくないローディングインジケータの防止 {/*preventing-unwanted-loading-indicators*/}

この例では、`PostsTab` コンポーネントは[サスペンス (Suspense) 対応の](/reference/react/Suspense)データソースを使用していくつかのデータをフェッチしています。"Posts" タブをクリックすると、`PostsTab` コンポーネントが*サスペンド*し、その結果、最も近いローディングフォールバックが表示されます：

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js TabButton.js
export default function TabButton({ children, isActive, onClick }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      onClick();
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

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

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
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
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

ローディングインジケータを表示するためにタブのコンテナ全体が隠れることは不快なユーザ体験となってしまいます。`TabButton` に `useTransition` を追加すると、代わりにタブボタン内に保留状態を表示することができます。

"Posts" をクリックしても、もはやタブコンテナ全体がスピナに置き換わることはなくなったことに注目してください。

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        onClick={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        onClick={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        onClick={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ children, isActive, onClick }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(() => {
        onClick();
      });
    }}>
      {children}
    </button>
  );
}
```

```js AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js PostsTab.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;

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

```js ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
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
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[サスペンスとトランジションの詳細はこちらをご覧ください](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)。

<Note>

トランジションは（今回のタブコンテナのような）*すでに表示されている*コンテンツを隠さない範囲で「待機」を行います。もし Posts タブに[ネストした `<Suspense>` バウンダリ](/reference/react/Suspense#revealing-nested-content-as-it-loads)がある場合、トランジションはそれを「待機」することはありません。

</Note>

---

### サスペンス対応ルータの構築 {/*building-a-suspense-enabled-router*/}

React のフレームワークやルータを構築している場合、ページのナビゲーションをトランジションとしてマークすることをお勧めします。

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

これが推奨されるのは以下の 2 つの理由からです：

- [トランジションは中断可能](#marking-a-state-update-as-a-non-blocking-transition)であるため、ユーザは再レンダーの完了を待たずにクリックしてページから離れることができます。
- [トランジションは不要なローディングインジケータを防ぐ](#preventing-unwanted-loading-indicators)ため、ユーザがナビゲーション時の不快なちらつきを避けることができます。

以下は、ナビゲーションにトランジションを使用した非常に簡易的なルータの例です。

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
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js Albums.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
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

```js Biography.js hidden
import { fetchData } from './data.js';

// Note: this component is written using an experimental API
// that's not yet available in stable versions of React.

// For a realistic example you can follow today, try a framework
// that's integrated with Suspense, like Relay or Next.js.

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
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

```js Panel.js hidden
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
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
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band, 
    formed in Liverpool in 1960, that comprised 
    John Lennon, Paul McCartney, George Harrison 
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
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
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[サスペンス対応](/reference/react/Suspense)のルータは、デフォルトでナビゲーションの更新をトランジションにラップすることが期待されます。

</Note>

---

## トラブルシューティング {/*troubleshooting*/}

### トランジション中に入力フィールドを更新できない {/*updating-an-input-in-a-transition-doesnt-work*/}

入力フィールドを制御する state 変数に対してトランジションを使用することはできません。

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

これは、トランジションが非ブロッキングである一方、change イベントへの応答として入力を更新する処理は同期的である必要があるためです。タイピングに応じてトランジションを実行したい場合、2 つの選択肢があります：

1. 入力フィールド用の state（常に同期的に更新される）と、トランジションで更新する state を別々に宣言する。これにより、同期的な state を使用して入力フィールドを制御しつつ、トランジション state 変数（入力欄より「遅れる」ことになる）をレンダーロジックの残りの部分に渡すことができます。
2. あるいは、保持する state 変数は 1 つにし、実際の値より「遅れる」ことのできる [`useDeferredValue`](/reference/react/useDeferredValue) を追加することができます。これにより、ノンブロッキングな再レンダーを始めて、それが自動的に新しい値に「追いつく」ようにできます。

---

### React が state 更新をトランジションとして扱わない {/*react-doesnt-treat-my-state-update-as-a-transition*/}

state 更新をトランジションでラップするとき、更新が `startTransition` の呼び出しの*最中*に行われていることを確認してください：

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

`startTransition` に渡す関数は同期的でなければなりません。

以下のような形で更新をトランジションとしてマークすることはできません。

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

代わりに、以下は可能です。

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

同様に、以下のように更新をトランジションとしてマークすることはできません。

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Setting state *after* startTransition call
  setPage('/about');
});
```

一方で、以下は動作します。

```js
await someAsyncFunction();
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

---

### コンポーネントの外部から `useTransition` を呼び出したい {/*i-want-to-call-usetransition-from-outside-a-component*/}

`useTransition` はフックであるため、コンポーネント外で呼び出すことはできません。この場合、代わりにスタンドアロンの [`startTransition`](/reference/react/startTransition) メソッドを使用してください。同じように機能しますが、`isPending` インジケータは提供されません。

---

### `startTransition` に渡す関数がすぐに実行される {/*the-function-i-pass-to-starttransition-executes-immediately*/}

このコードを実行すると、1、2、3 が出力されます：

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**1、2、3 が出力されるのは期待通りの動作です**。`startTransition` に渡す関数は遅延されません。ブラウザの `setTimeout` を使う場合とは異なり、コールバックは後で実行されるのではありません。React はあなたの関数をすぐに実行しますが、*それが実行されている間*にスケジュールされた state 更新をトランジションとしてマークします。以下のように動作していると考えることができます。

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```
