---
title: <Activity>
version: experimental
---

<Experimental>

**この API は実験的なものであり、まだ React の安定版では利用できません**。

React パッケージを最新の実験的バージョンにアップグレードすることで試すことができます。

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

React の実験的バージョンにはバグが含まれている可能性があります。本番環境では使用しないでください。

</Experimental>

<Intro>

`<Activity>` を使い、UI の一部を非表示にしたり表示したりします。


```js
<Activity mode={mode}>
  <Page />
</Activity>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `<Activity>` {/*activity*/}

UI の一部を `<Activity>` でラップすることで、その可視性状態を管理します。

```js
import {unstable_Activity as Activity} from 'react';

<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

"hidden" の場合、`<Activity />` の `children` はページに表示されません。新しい `<Activity>` が "hidden" としてマウントされると、ページ上の表示されているコンテンツをブロックすることなく、低優先度でコンテンツをプリレンダー (pre-render) しますが、エフェクトを作成することによるマウントは行いません。"visible" の Activity が "hidden" に切り替わると、概念的にはすべてのエフェクトを破棄することでアンマウントしますが、その state は保存します。これにより、"hidden" の Activity の state を再作成することなく、"visible" と "hidden" の state を高速に切り替えることができます。

将来的には、"hidden" の Activity はメモリなどのリソースに基づいて state を自動的に破棄する可能性があります。

#### props {/*props*/}

* `children`: 実際にレンダーしたい UI。
* **省略可能** `mode`: "visible" または "hidden"。デフォルトは "visible"。"hidden" の場合、子の更新は低優先度として遅延される。Activity が "visible" に切り替わるまで、コンポーネントはエフェクトを作成しない。"visible" の Activity が "hidden" に切り替わると、エフェクトは破棄される。

#### 注意点 {/*caveats*/}

- hidden の間、`<Activity>` の `children` はページ上で非表示になります。
- `<Activity>` は、"visible" から "hidden" に切り替わる際、React の state や DOM の状態を破棄することなくすべてのエフェクトをアンマウントします。これは、マウント時に一度だけ実行されることが期待されるエフェクトであっても、"hidden" から "visible" に切り替わる際に再度実行されることを意味します。概念的には、"hidden" 状態の Activity はアンマウントされるが破棄されてもいないということです。この挙動による予期せぬ副作用をキャッチするために [`<StrictMode>`](/reference/react/StrictMode) を使用することをお勧めします。
- `<ViewTransition>` と共に使用すると、トランジションで表示される非表示の Activity は "enter" アニメーションを起動にします。トランジションで非表示になる表示中の Activity は "exit" アニメーションを起動します。
- `<Activity mode="hidden">` でラップされた UI は、SSR のレスポンスに含まれません。
- `<Activity mode="visible">` でラップされた UI は、他のコンテンツよりも低い優先度でハイドレーションされます。

---

## 使用法 {/*usage*/}

### UI の一部を事前レンダーする {/*pre-render-part-of-the-ui*/}

`<Activity mode="hidden">` を使用して、UI の一部を事前レンダーしておけます。

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Activity が `mode="hidden"` でレンダーされると、`children` はページに表示されませんが、ページ上の表示されているコンテンツよりも低い優先度でレンダーされます。

後で `mode` が "visible" に切り替わると、事前レンダーされた子要素がマウントされ、表示されるようになります。これは、ユーザが次に操作する可能性が高い UI を準備して、読み込み時間を短縮するために使用できます。

以下の [`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators) の例では、`PostsTab` コンポーネントが `use` を使用してデータをフェッチしています。"Posts" タブをクリックすると、`PostsTab` コンポーネントがサスペンドし、ボタンにローディング中という状態が表示されます。

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
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
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


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
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
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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

この例の場合、"Posts" タブをクリックした際、ユーザは投稿が読み込まれるのを待つ必要があります。

非アクティブなタブを非表示の `<Activity>` で事前レンダーしておくことで、"Posts" タブの遅延を減らすことができます。

<Sandpack>

```js
import { Suspense, useState, unstable_Activity as Activity } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [tab, setTab] = useState("about");
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === "about"} action={() => setTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} action={() => setTab("posts")}>
        Posts
      </TabButton>
      <TabButton isActive={tab === "contact"} action={() => setTab("contact")}>
        Contact
      </TabButton>
      <hr />
      <Activity mode={tab === "about" ? "visible" : "hidden"}>
        <AboutTab />
      </Activity>
      <Activity mode={tab === "posts" ? "visible" : "hidden"}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === "contact" ? "visible" : "hidden"}>
        <ContactTab />
      </Activity>
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
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
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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

---

### UI の state を保持する {/*keeping-state-for-part-of-the-ui*/}


`<Activity>` を "visible" から "hidden" に切り替える際に、当該部分の UI の state を保持できます。

```js
<Activity mode={tab === "posts" ? "visible" : "hidden"}>
  <PostsTab />
</Activity>
```

Activity が `mode="visible"` から "hidden" に切り替わると、`children` はページ上で非表示になり、すべてのエフェクトを破棄することでアンマウントしますが、React の state と DOM の状態は保持します。

後で `mode` が "visible" に切り替わると、保存された state は、エフェクトを作成して子をマウントする際に再利用されます。これは、ユーザが再度操作する可能性が高い UI の state を保持し、DOM や React の state を維持するために使用できます。

[`useTransition`](/reference/react/useTransition#preventing-unwanted-loading-indicators) の以下の例では、`ContactTab` に送信するメッセージの下書きを含む `<textarea>` が含まれています。テキストを入力して別のタブに移動し、その後 "Contact" タブを再度クリックすると、下書きメッセージは失われてしまいます。


<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('contact');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
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


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
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
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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

つまりユーザが入力した DOM の state が失われてしまっています。非アクティブなタブを `<Activity>` を使って非表示にすることで、Contact タブの state を保持できます。


<Sandpack>

```js
import { Suspense, useState, unstable_Activity as Activity } from "react";
import TabButton from "./TabButton.js";
import AboutTab from "./AboutTab.js";
import PostsTab from "./PostsTab.js";
import ContactTab from "./ContactTab.js";

export default function TabContainer() {
  const [tab, setTab] = useState("about");
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton isActive={tab === "about"} action={() => setTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} action={() => setTab("posts")}>
        Posts
      </TabButton>
      <TabButton isActive={tab === "contact"} action={() => setTab("contact")}>
        Contact
      </TabButton>
      <hr />
      <Activity mode={tab === "about" ? "visible" : "hidden"}>
        <AboutTab />
      </Activity>
      <Activity mode={tab === "posts" ? "visible" : "hidden"}>
        <PostsTab />
      </Activity>
      <Activity mode={tab === "contact" ? "visible" : "hidden"}>
        <ContactTab />
      </Activity>
    </Suspense>
  );
}
```


```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
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
        action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function AboutTab() {
  return (
    <ViewTransition>
      <p>Welcome to my profile!</p>
    </ViewTransition>
  );
}
```

```js src/PostsTab.js hidden
import {use, unstable_ViewTransition as ViewTransition} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ViewTransition>
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
      </ViewTransition>
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
```

```js src/ContactTab.js hidden
import {unstable_ViewTransition as ViewTransition} from 'react';

export default function ContactTab() {
  return (
    <ViewTransition>
      <p>
        Send me a message!
      </p>
      <textarea />
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </ViewTransition>
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
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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

---

## トラブルシューティング {/*troubleshooting*/}

### Activity が非表示のときにエフェクトがマウントされない {/*effects-dont-mount-when-an-activity-is-hidden*/}

`<Activity>` が "hidden" の場合、すべてのエフェクトはアンマウントされます。概念的には、コンポーネントはアンマウントされていますが、React は後で使用するために state を保存しています。

これは Activity の機能です。なぜなら、UI の非表示部分に対してサブスクリプションが登録されなくなり、非表示コンテンツの作業量が削減されるからです。また、ビデオの一時停止のようなクリーンアップ（Activity なしでアンマウントした場合に期待される動作）が実行されることも意味します。Activity が "visible" に切り替わると、エフェクトが作成されマウントが起き、それによりイベントハンドラの登録やビデオの再生が起こります。

ボタンごとに異なるビデオが再生される、以下の例を考えてみましょう。


<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';
import './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      {video === 1 &&
        <VideoPlayer key={1}
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      }
      {video === 2 && 
        <VideoPlayer key={2}
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      }
    </>
  );
}
```

```js src/checker.js hidden
let interval = setInterval(() => {
  const videos = Array.from(document.querySelectorAll('video'));
  const playing = videos.filter(
    (v) => !v.paused
  );
  if (playing.length > 1) {
    console.error(`Multiple playing videos: ${playing.length}`);
  }
    
}, 50);
```


```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

</Sandpack>


ビデオを切り替えて戻ってくると、そのビデオが最初から再読み込みされてしまっています。state を維持するために、両方のビデオをレンダーしておき、非アクティブなビデオを `display: none` で非表示にすればいいと思うかもしれません。しかし、これにより両方のビデオが同時に再生されてしまいます。


<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <div style={{display: video === 1 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />

      </div>
      <div style={{display: video === 2 ? 'block' : 'none'}}>
        <VideoPlayer
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </div>
      <VideoChecker />
    </>
  );
}
```

```js src/checker.js hidden
import {useRef, useEffect} from 'react';

export default function VideoChecker() {
  const hasLogged = useRef(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (hasLogged.current === false) {

        const videos = Array.from(document.querySelectorAll('video'));
        const playing = videos.filter(
          (v) => !v.paused
        );
        if (hasLogged.current === false && playing.length > 1) {
          hasLogged.current = true;
          console.error(`Multiple playing videos: ${playing.length}`);
        }
      }

    }, 50);
    
    return () => {
      hasLogged.current = false;
      clearInterval(interval);
    }
  });
  
}

```


```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

</Sandpack>

Activity が非表示のときにエフェクトをマウントしてしまえば、これと似たことが起きてしまうのです。同様に、Activity が非表示になるときにエフェクトをアンマウントしない場合、ビデオはバックグラウンドで再生され続けてしまいます。

Activity は、最初に "hidden" 状態でレンダーされたときにはエフェクトを作成せず、"visible" から "hidden" に切り替えるときにもすべてのエフェクトを破棄することで、この問題を解決します。


<Sandpack>

```js
import { useState, useRef, useEffect, unstable_Activity as Activity } from 'react';
import VideoChecker from './checker.js';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    const videoRef = ref.current;
    videoRef.play();
    
    return () => {
      videoRef.pause();
    }
  }, []);

  return <video ref={ref} src={src} muted loop playsInline/>;
}

export default function App() {
  const [video, setVideo] = useState(1);
  return (
    <>
      <div>
        <button onClick={() => setVideo(1)}>Big Buck Bunny</button>
        <button onClick={() => setVideo(2)}>Elephants Dream</button>
      </div>
      <Activity mode={video === 1 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Big Buck Bunny' licensed under CC 3.0 by the Blender foundation. Hosted by archive.org
          src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4" />
      </Activity>
      <Activity mode={video === 2 ? 'visible' : 'hidden'}>
        <VideoPlayer
          // 'Elephants Dream' by Orange Open Movie Project Studio, licensed under CC-3.0, hosted by archive.org
          src="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
        />
      </Activity>
      <VideoChecker />
    </>
  );
}
```

```js src/checker.js hidden
import {useRef, useEffect} from 'react';

export default function VideoChecker() {
  const hasLogged = useRef(false);

  useEffect(() => {
    let interval = setInterval(() => {
      if (hasLogged.current === false) {

        const videos = Array.from(document.querySelectorAll('video'));
        const playing = videos.filter(
          (v) => !v.paused
        );
        if (hasLogged.current === false && playing.length > 1) {
          hasLogged.current = true;
          console.error(`Multiple playing videos: ${playing.length}`);
        }
      }

    }, 50);
    
    return () => {
      hasLogged.current = false;
      clearInterval(interval);
    }
  });
  
}

```

```css
body { height: 275px; }
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
video { width: 300px; margin-top: 10px; }
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
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

このため、最善の考え方は、Activity は概念的にはコンポーネントを「アンマウント」および「再マウント」するが、React の state や DOM の状態を後のために保持しておく、と考えることです。実際、[そのエフェクトは不要かも](/learn/you-might-not-need-an-effect)のガイドに従っている限り、これは期待どおりに機能します。問題のあるエフェクトを積極的に見つけるに、[`<StrictMode>`](/reference/react/StrictMode) を追加することをお勧めします。これにより、Activity のアンマウントとマウントが積極的に実行され、予期せぬ副作用をキャッチできます。

### 非表示の Activity が SSR でレンダーされない {/*my-hidden-activity-is-not-rendered-in-ssr*/}

サーバサイドレンダリング中に `<Activity mode="hidden">` を使用すると、Activity のコンテンツは SSR レスポンスに含まれません。これは、コンテンツがページに表示されないので初期レンダーには必要ないためです。コンテンツを SSR レスポンスに含める必要がある場合は、[`useDeferredValue`](/reference/react/useDeferredValue) のような別のアプローチを使用して、コンテンツのレンダーを遅延させることができます。
