---
title: "React 19.3"
author: The React Team
date: 2026/09/09
description: React 19.3 ではビュー遷移、フラグメント ref、browser()、Trusted Types などの新機能が追加されます。
---

September 9, 2026 by [The React Team](/community/team)

---

<Intro>

React 19.3 が npm で利用可能になりました！

</Intro>


[昨年](/blog/2025/04/23/react-labs-view-transitions-activity-and-more)、React に追加予定の新しい実験的 API として、ビュー遷移 (View Transition) とフラグメント ref を紹介しました。このたび、どちらも React 19.3 で安定版になったことをお知らせします！

この投稿では、これらの仕組みを説明するとともに、今回のリリースに含まれるその他の注目すべき変更点を紹介します。

<InlineToc />

---

## 新しい React の機能 {/*new-react-features*/}

### ビュー遷移 {/*view-transition*/}

新しい `<ViewTransition>` コンポーネントを使うと、ブラウザの[ビュー遷移 API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) を利用して、要素の出現、消失、移動、サイズ変更をアニメーションできます。[昨年](/blog/2025/04/23/react-labs-view-transitions-activity-and-more#view-transitions)は実験的 API として紹介しましたが、19.3 では安定版となり、利用できるようになりました。

UI 部品をアニメーションするには、`<ViewTransition>` で囲みます。

```js
import { ViewTransition } from 'react';

{isShowing && (
  <ViewTransition>
    <Component />
  </ViewTransition>
)}
```

これで、[トランジション (Transition)](/reference/react/useTransition) としてマークされた更新によって、子コンポーネントのスタイルが変わったり、`ViewTransition` がマウントまたはアンマウントされたりするたびに、React がその更新をアニメーションするようになります。

{/*
トランジション外の更新は、緊急性が高く UI に即座に反映されるべきものなので、アニメーションを引き起こしません。[startTransition](/reference/react/startTransition) 内での state 更新、[`<Suspense>`](/reference/react/Suspense) によるコンテンツの表示、[`useDeferredValue`](/reference/react/useDeferredValue) による更新は、いずれもビュー遷移のアニメーションを引き起こします。
*/}

React は、ツリーがどのように変化したかに基づいて、実行するアニメーションを選びます。

- **enter**：`<ViewTransition>` が追加される。
- **exit**：`<ViewTransition>` が削除される。
- **update**：`<ViewTransition>` の子要素のスタイルやコンテンツが変わる。
- **share**：名前付きの `<ViewTransition>` がある場所で削除され、別の場所に追加される。

トランジションとしてマークされていない更新は、緊急性が高く UI に即座に反映されるべきものなので、アニメーションを引き起こさないことに注意してください。[startTransition](/reference/react/startTransition) 内での state 更新、[`<Suspense>`](/reference/react/Suspense) によるコンテンツの表示、[`useDeferredValue`](/reference/react/useDeferredValue) による更新は、いずれもビュー遷移のアニメーションを引き起こします。

以下は、出現・消失のアニメーションのシンプルな例です。

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import { ViewTransition, useState, startTransition } from 'react';
import { Video } from './Video';
import videos from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}>
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Video video={videos[0]} />
        </ViewTransition>
      )}
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
];
```

```css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
  cursor: pointer;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video .info:hover {
  text-decoration: underline;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

デフォルトでは、`<ViewTransition>` は滑らかなクロスフェードでアニメーションします。[ビュー遷移クラス](/reference/react/ViewTransition#view-transition-class)を渡して CSS でアニメーションを定義することで、各種類のアニメーションをカスタマイズできます。また、[ウェブアニメーション API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) を使い、[イベント props](/reference/react/ViewTransition#view-transition-event)（`onEnter`、`onExit`、`onShare`、`onUpdate`）を通じて命令型の方法でアニメーションを開始することもできます。

{/*
覚えておくべきルールがいくつかあります。`<ViewTransition>` の出現・消失がアニメーションするのは、そのサブツリー内で、どの DOM ノードよりも先にレンダーされる場合に限られます。また、共有する各 `name` は、どの時点でもアプリ全体で一意である必要があります。詳しくは[トラブルシューティング](/reference/react/ViewTransition#troubleshooting)を参照してください。
 */}

現在、`<ViewTransition>` は DOM でのみ動作します。React Native やその他のプラットフォームへの対応にも取り組んでいます。

詳しくは、[`<ViewTransition>` のドキュメント](/reference/react/ViewTransition)を参照してください。

---

#### `addTransitionType` {/*add-transition-type*/}

同一の state 更新に対して、使用するアニメーションを変えたい場合があります。例えば、カルーセルを*先に進めて* 3 枚目のスライドに移動する場合は、スライドを右から左にアニメーションさせ、*前に戻る*移動の場合は、左から右にアニメーションさせるべきです。どちらも currentSlide を 3 に設定する操作ですが、アニメーションは異なります。

state 更新と合わせて `addTransitionType` を呼び出すことで、そのビュー遷移のアニメーションをカスタマイズできます。これにより、特定の遷移の*起因*についての情報を追加できます。

```js {3,10}
function nextSlide() {
  startTransition(() => {
    addTransitionType('next');
    setCurrentSlide(c => c + 1);
  });
}

function previousSlide() {
  startTransition(() => {
    addTransitionType('previous');
    setCurrentSlide(c => c - 1);
  });
}
```

その後、トランジションタイプに基づいて異なるアニメーションを指定できます。

```js
<ViewTransition
  enter={{
    'next': 'from-right',
    'previous': 'from-left',
  }}
  exit={{
    'next': 'to-left',
    'previous': 'to-right',
  }}
>
  <Page />
</ViewTransition>
```

以下がその例です。

<Sandpack>

```js src/Video.js hidden
function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}
```

```js
import {
  ViewTransition,
  addTransitionType,
  useState,
  startTransition,
  Fragment
} from 'react';
import { Video } from './Video';
import videos from './data';
import './animations.css';

export default function Component() {
  const [selected, setSelected] = useState(0)
  const video = videos[selected];

  return (
    <>
      <div className="button-container">
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('previous');
              setSelected(c => c > 0 ? c - 1 : videos.length - 1 )
            });
          }}>
          ⬅️
        </button>
        <button
          onClick={() => {
            startTransition(() => {
              addTransitionType('next');
              setSelected(c => c + 1 < videos.length ? c + 1 : 0)
            });
          }}>
          ➡️
        </button>
      </div>

      <ViewTransition
        key={video.id}
        enter={{
          'next': 'from-right',
          'previous': 'from-left'
        }}
        exit={{
          'next': 'to-left',
          'previous': 'to-right'
        }}
      >
        <Video video={video} />
      </ViewTransition>
    </>
  );
}
```

```js src/data.js hidden
export default [
  {
    id: '1',
    title: 'First video',
    description: 'Video description',
    image: 'blue',
  },
  {
    id: '2',
    title: 'Second video',
    description: 'Video description',
    image: 'red',
  },
  {
    id: '3',
    title: 'Third video',
    description: 'Video description',
    image: 'green',
  },
  {
    id: '4',
    title: 'Fourth video',
    description: 'Video description',
    image: 'purple',
  },
  {
    id: '5',
    title: 'Fifth video',
    description: 'Video description',
    image: 'yellow',
  },
  {
    id: '6',
    title: 'Sixth video',
    description: 'Video description',
    image: 'gray',
  },
];
```

```css src/animations.css
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: 250ms;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}

::view-transition-new(.from-right) {
  --offset: 100%;
  animation-name: slide-in;
}

::view-transition-new(.from-left) {
  --offset: -100%;
  animation-name: slide-in;
}

::view-transition-old(.to-right) {
  --offset: 100%;
  animation-name: slide-out;
}

::view-transition-old(.to-left) {
  --offset: -100%;
  animation-name: slide-out;
}

@keyframes slide-in {
  from {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}

@keyframes slide-out {
  to {
    transform: translateX(var(--offset));
    opacity: 0;
  }
}
```

```css src/styles.css
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.button-container {
  display: flex;
  gap: 8px;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}

.thumbnail.red {
  background-image: conic-gradient(at top right, #c76a15, #a6423a, #2b3491);
}

.thumbnail.green {
  background-image: conic-gradient(at top right, #c76a15, #388f7f, #2b3491);
}

.thumbnail.purple {
  background-image: conic-gradient(at top right, #c76a15, #575fb7, #2b3491);
}

.thumbnail.yellow {
  background-image: conic-gradient(at top right, #c76a15, #FABD62, #2b3491);
}

.thumbnail.gray {
  background-image: conic-gradient(at top right, #c76a15, #4E5769, #2b3491);
}

.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

React は、各トランジションタイプをブラウザの[ビュー遷移タイプ](https://www.w3.org/TR/css-view-transitions-2/#active-view-transition-pseudo-examples)として要素にも追加するため、CSS の `:active-view-transition-type(...)` でアニメーションの適用範囲を限定できます。

詳しくは、[`addTransitionType` のドキュメント](/reference/react/addTransitionType)を参照してください。

---

#### サスペンスでフォールバック、画像、フォントをアニメーションする {/*animating-fallbacks-images-and-fonts-with-suspense*/}

React のビュー遷移で特に魅力的なのが、サスペンスとの連携です。

サスペンスバウンダリを `<ViewTransition>` で囲むことで、子要素が表示されるときにアニメーションできます。

```js
<ViewTransition>
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
</ViewTransition>
```

子要素の読み込みが完了すると、React はフォールバックから最終的なコンテンツへの **update** アニメーションを開始します。

以下がその例です。➕ を押して、初回のレンダー時にサスペンドする LazyVideo をレンダーしてみてください。

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition>
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 750ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
}
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

これでも動作していますが、動画を再表示するときにも、すでに読み込み済みの動画に対して出現・消失のアニメーションが発生しています。（フォールバック自体も初回表示時にフェードインしていることにお気付きかもしれません。）

一般に、サスペンスと組み合わせたアニメーションは控えめに使い、通常瞬時に表示されるはずのキャッシュ済み UI には使わない方がうまくいきます。

サスペンスでアニメーションする際に、良い UX を実現するための原則をいくつか紹介します。

- フォールバックは*アニメーションなし*で即座に表示する
- フォールバックから最終的なコンテンツへは*アニメーション付き*で切り替える
- サスペンドしない子要素は*アニメーションなし*で即座に表示する

こうすることで、読み込み済みのものはアプリ内ですばやく表示され、フォールバックから最終的なコンテンツへの切り替えを滑らかにするためだけにアニメーションが使われます。

先ほどの例を修正するには、更新以外のすべてのアニメーションを無効にします。

```js {1}
<ViewTransition update="auto" default="none">
  <Suspense fallback={<Fallback />}>
    <Component />
  </Suspense>
</ViewTransition>
```

動作がどう変わったか確認してみてください。

<Sandpack>

```js src/Video.js hidden
import { ViewTransition } from 'react';

function Thumbnail({video, children}) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    />
  );
}

export function Video({video}) {
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlaceholder() {
  const video = {image: 'loading'};
  return (
    <div className="video">
      <div className="link">
        <Thumbnail video={video}></Thumbnail>
        <div className="info">
          <div className="video-title loading" />
          <div className="video-description loading" />
        </div>
      </div>
    </div>
  );
}
```

```js
import { Suspense, useState, startTransition, use, ViewTransition } from 'react';
import { Video, VideoPlaceholder } from './Video';
import { fetchVideo } from './data';

export default function Component() {
  const [showItem, setShowItem] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setShowItem((prev) => !prev);
          });
        }}
      >
        {showItem ? '➖' : '➕'}
      </button>

      {showItem && (
        <ViewTransition update="auto" default="none">
          <Suspense fallback={<VideoPlaceholder />}>
            <LazyVideo />
          </Suspense>
        </ViewTransition>
      )}
    </>
  );
}

function LazyVideo() {
  const video = use(fetchVideo());

  return <Video video={video} />;
}
```


```js src/data.js hidden
let cache = null;

export function fetchVideo() {
  if (!cache) {
    cache = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          title: 'First video',
          description: 'Video description',
          image: 'blue',
        });
      }, 1000);
    });
  }
  return cache;
}
```

```css
::view-transition-old(*),
::view-transition-new(*) {
  /* animation-duration: 5000ms; */
  /* animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); */
}
#root {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
}
button {
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8ff;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s;
}
button:hover {
  border: 2px solid #ccc;
  background-color: #e0e8ff;
}
.thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 8rem;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}
.thumbnail.blue {
  background-image: conic-gradient(at top right, #c76a15, #087ea4, #2b3491);
}
.loading {
  background-image: linear-gradient(
    90deg,
    rgba(173, 216, 230, 0.3) 25%,
    rgba(135, 206, 250, 0.5) 50%,
    rgba(173, 216, 230, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  z-index: 999;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.video {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  margin-top: 1em;
}
.video .link {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  gap: 0.125rem;
  outline-offset: 4px;
}
.video .info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;
  gap: 0.125rem;
}
.video-title {
  font-size: 15px;
  line-height: 1.25;
  font-weight: 700;
  color: #23272f;
}
.video-title.loading {
  height: 20px;
  width: 80px;
  border-radius: 0.5rem;
}
.video-description {
  color: #5e687e;
  font-size: 13px;
  border-radius: 0.5rem;
}
.video-description.loading {
  height: 15px;
  width: 100px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

ボタンをタップするとフォールバックが即座に表示され、ユーザの操作に対して UI がすばやく反応することに注目してください。また、動画が一度読み込まれると、表示の切り替えも瞬時に行われます。

実現したい効果に応じて、他のパターンも利用できます。詳しくは、[サスペンスと組み合わせたアニメーション](/reference/react/ViewTransition#animating-from-suspense-content)のドキュメントを参照してください。

---

ビュー遷移は、フォールバックをアニメーションするだけでなく、画像やフォントの読み込み中にサスペンスを発動させるためにも使えます。

これで、ブラウザのデフォルトの挙動により画像やフォントが読み込みを終えた時点でちらつくように表示されてしまうのを避けられます。コンポーネントが使う全リソースを考慮した、読み込み連携の仕組みを構築できます。

読み込み中にサスペンスを発動させるには、画像やフォントを `<ViewTransition>` で囲みます。

```js
<ViewTransition>
  <Suspense fallback={<Fallback />}>
    <img src={imageSrc} />

    <style href={fontSrc} precedence="default">
      {`@font-face {
        font-family: 'Fancy';
        src: url(${fontSrc}) format('truetype');
        font-display: swap;
      }`}
    </style>
  </Suspense>
</ViewTransition>
```

以下は、データ、画像、フォントのすべての読み込みが完了するまでサスペンドするコンポーネントの例です。


<Sandpack>

```js
import { ViewTransition, Suspense, use, useState, startTransition } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';
import { ProfileCard, ProfileCardLoading } from './ProfileCard.js';
import { VanillaProfileCard } from './VanillaProfileCard.js';

export default function App() {
  const [resources, setResources] = useState(null);
  return (
    <>
      <button
        onClick={() => {
          startTransition(() => {
            setResources({
              quotePromise: fetchQuote(),
              stylesheet: freshStylesheetUrl(),
              image: freshImageUrl(),
            });
          });
        }}>
        Show profile
      </button>

      {resources && (
        <ViewTransition update='auto' default='none'>
          <Suspense fallback={<ProfileCardLoading />}>
            <ProfileCard resources={resources} />
          </Suspense>
        </ViewTransition>
      )}

      <hr />

      <VanillaProfileCard />
    </>
  );
}
```

```js src/ProfileCard.js
import { use } from 'react';

export function ProfileCard({ resources }) {
  const quote = use(resources.quotePromise);
  return (
    <>
      <link rel="stylesheet" href={resources.stylesheet} precedence="default" />
      <div className="profile-card">
        <img src={resources.image} alt="Jack Pope" width={80} height={80} />
        <div>
          <p className="name">Jack Pope</p>
          <p className="bio">{quote}</p>
        </div>
      </div>
    </>
  );
}

export function ProfileCardLoading() {
  return (
    <div className="profile-card">
      <div className="avatar-placeholder" />
      <div>
        <p className="name name-placeholder">&nbsp;</p>
        <p className="bio bio-placeholder">&nbsp;</p>
      </div>
    </div>
  );
}
```


```js src/VanillaProfileCard.js
import { useRef } from 'react';
import { fetchQuote } from './data.js';
import { freshStylesheetUrl, freshImageUrl } from './resources.js';

export function VanillaProfileCard() {
  const ref = useRef(null);
  async function show() {
    const quote = await fetchQuote();
    const doc = ref.current.contentWindow.document;
    doc.open();
    doc.write(`
      <style>
        body { margin: 0; font-family: sans-serif; }
        img { object-fit: cover; }
        .profile-card { display: flex; gap: 12px; align-items: center; }
        .profile-card img { border-radius: 50%; background: #dfe3e9; }
        .name { margin: 0 0 4px; font-family: 'Caveat', sans-serif; font-size: 22px; line-height: 28px; font-weight: bold; }
        .bio { margin: 0; font-family: 'Caveat', sans-serif; font-size: 20px; line-height: 26px; }
      </style>
      <div class="profile-card">
        <img src="${freshImageUrl()}" alt="Jack Pope" width="80" height="80" />
        <div>
          <p class="name">Jack Pope</p>
          <p class="bio">${quote}</p>
        </div>
      </div>
      <link rel="stylesheet" href="${freshStylesheetUrl()}">
    `);
    doc.close();
  }
  return (
    <>
      <button onClick={show}>Show profile (without React)</button>
      <iframe ref={ref} title="Vanilla profile card" className="vanilla-frame" />
    </>
  );
}
```

```js src/resources.js hidden
// Add a unique parameter so the resources aren't cached,
// and every run shows the loading state.
export function freshStylesheetUrl() {
  return (
    'https://fonts.googleapis.com/css2?family=Caveat&display=swap' +
    '&t=' +
    Date.now()
  );
}

export function freshImageUrl() {
  return 'https://react.dev/images/team/jack-pope.jpg?t=' + Date.now();
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.

export async function fetchQuote() {
  // Add a fake delay to make waiting noticeable.
  await new Promise((resolve) => {
    setTimeout(resolve, 250);
  });
  return 'The best way to predict the future is to invent it.';
}
```

```css
#root {
  min-height: 320px;
}
button {
  margin-right: 8px;
}
hr {
  margin: 16px 0;
}
img {
  object-fit: cover;
}
.profile-card {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 1em;
}
.profile-card img {
  border-radius: 50%;
  background: #dfe3e9;
}
.name {
  margin: 0 0 4px;
  font-family: 'Caveat', sans-serif;
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
}
.bio {
  margin: 0;
  font-family: 'Caveat', sans-serif;
  font-size: 20px;
  line-height: 26px;
}
.profile-card img {
  display: block;
}
.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #dfe3e9;
}
.name-placeholder,
.bio-placeholder {
  border-radius: 4px;
  background: #dfe3e9;
  color: transparent;
}
.name-placeholder {
  width: 90px;
}
.bio-placeholder {
  width: 220px;
}
.vanilla-frame {
  display: block;
  margin-top: 1em;
  border: none;
  width: 100%;
  height: 110px;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

画像、フォント、スタイルシートの読み込みを待機する方法について、詳しくは [サスペンスのドキュメント](/reference/react/Suspense#waiting-for-a-font-to-load)を参照してください。

---

### フラグメント ref {/*fragment-refs*/}

コンポーネントの DOM ノードをより低レベルで制御し、例えばイベントリスナを追加したり、可視性を監視したり、フォーカスを移動したりする場合は、通常 ref を使えます。しかし、それが難しい状況もあります。

- 単一の親要素を持たず、兄弟のグループをレンダーするコンポーネント
- props として受け取った `ref` を別の要素に渡さないコンポーネント

```js
function Component() {
  // How can we work with the list of DOM nodes rendered by this component?
  return (
    {posts.map(post => (
      <Heading key={post.id}>
        {post.title}
      </Heading>
    ))}
  )
}
```

ref を保持するためだけのラッパ `<div>` を追加すればうまくいくこともありますが、コンポーネントのスタイリングやレイアウトを妨げる場合もあります。また、コンポーネントが `ref` を props として公開していない場合、公開するようにコンポーネントを修正する必要がありますが、自分で管理していないライブラリのコンポーネントではそれは不可能かもしれません。

フラグメント ref は、何をレンダーするかに関わらずどんな React コンポーネントに対しても動作する頻用 DOM メソッドをいくつか提供することで、これらの問題を解決します。

19.3 では、[`<Fragment>`](/reference/react/Fragment) に ref を直接渡すことで利用できます。この ref を通じて `FragmentInstance` が得られ、フラグメントの DOM の子を操作できるようになるのです。

```js {2,5-6,10}
function Component() {
  const fragmentRef = useRef(null);

  useEffect(() => {
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.focus();
  }, []);

  return (
    <Fragment ref={fragmentRef}>
      {posts.map(post => (
        <Heading key={post.id}>
          {post.title}
        </Heading>
      ))}
    </Fragment>
  )
}
```

`FragmentInstance` は、子の DOM を、構造を変えることなく*グループとして*扱います。

- `addEventListener`、`removeEventListener`、`dispatchEvent` は、直下の子のイベントを管理します。
- `focus`、`focusLast`、`blur` は、ネストした子要素間で、深さ優先の順にフォーカスを移動します。
- `observeUsing` と `unobserveUsing` は、`IntersectionObserver` または `ResizeObserver` を接続します。
- `getClientRects`、`getRootNode`、`compareDocumentPosition`、`scrollIntoView` は、フラグメントの直下の子を計測したり、そこへスクロールしたりするために使えます。

このように、フラグメント ref を使うと、他のコンポーネントの内部や、それらが生成する DOM 構造を変更せずに、コンポーネントに振る舞いを追加できます。

以下の例は、子要素がビューポートに入る、またはビューポートから出るたびに呼び出される `onChange` プロパティを持つ、`InView` コンポーネントです。

<Sandpack>

```js src/App.js active
import { useState } from 'react';
import Card from './Card';
import InView from './InView';

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className={isVisible ? 'page visible' : 'page'}>
      <div className="filler">Scroll down</div>

      <InView onChange={setIsVisible}>
        <Card title="First section" />
        <Card title="Second section" />
      </InView>

      <div className="filler">Scroll up</div>
    </div>
  );
}
```

```js src/Card.js
export default function Card({ title }) {
  return <div className="card">{title}</div>;
}
```

```js src/InView.js
import {
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';

export default function InView({ onChange, children }) {
  const fragmentRef = useRef(null);

  useLayoutEffect(() => {
    const visibleElements = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleElements.add(e.target);
          } else {
            visibleElements.delete(e.target);
          }
        });
        onChange(visibleElements.size > 0);
      }
    );
    const fragmentInstance = fragmentRef.current;
    fragmentInstance.observeUsing(observer);
    return () => {
      fragmentInstance.unobserveUsing(observer);
    };
  }, [onChange]);

  return (
    <Fragment ref={fragmentRef}>
      {children}
    </Fragment>
  );
}
```

```css
.page {
  transition: background 0.3s;
}

.page.visible {
  background: #d4edda;
}

.filler {
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
}

.card {
  padding: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  font-weight: 600;
  font-size: 14px;
}
```


```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

単一の親 DOM 要素がなく、また `Card` が `ref` を props として公開していないにもかかわらず、`InView` が子に振る舞いを追加できていることに注目してください。

フラグメント ref の使い方について、詳しくは [`<Fragment>` のドキュメント](/reference/react/Fragment)を参照してください。

---

## 新しい React DOM の機能 {/*new-react-dom-features*/}

### `browser` {/*browser*/}

アプリでサーバレンダリングを使っている場合、コンポーネントは 2 つの異なる環境でレンダーされます。

- サーバでは、コンポーネントをレンダーして初期 HTML を生成する
- クライアントでは、コンポーネントをレンダーしてその HTML にイベントハンドラを追加する

ほとんどの場合、コンポーネントはクライアントでの初回レンダーの出力と一致する HTML を生成できるようにするべきです。これにより、正しくハイドレーションされると同時に、初回の読み込み時にできるだけ多くのコンテンツをユーザに表示できます。

しかし、まれにコンポーネントがサーバ上で意味のある UI を生成できない場合があります。例えば、`localStorage` のようなブラウザ専用の API に依存していたり、ブラウザのローカルタイムゾーンを読み取ったりする場合です。このような場合、そのコンポーネントをサーバレンダリングの対象から完全に除外したくなるかもしれません。

これまではこれを実現するために、エフェクト内で更新される state を使ったり、`window` のようなブラウザ API の有無を確認したりしていたかもしれません。

```js
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  // ...
}

function Component() {
  const isBrowser = typeof window !== 'undefined';

  // ...
}
```

19.3 では、React にこの手法を直接サポートする API が追加されました。

コンポーネントで `use(browser())` を呼び出すと、サーバサイドレンダリングの対象から除外できます。

```js {5}
import { use } from 'react';
import { browser } from 'react-dom';

function Component() {
  use(browser());

  // ...
}
```

これはサーバではサスペンスを発動させますが、クライアントでは*発動させません*。サーバサイドレンダリング中は、最も近いサスペンスバウンダリのフォールバックが HTML に表示されます。コンポーネントがクライアントでハイドレーションされる際には、`use(browser())` はサスペンドしないため、コンポーネントは通常通りレンダーを続けられます。

以下は、デバイスのローカルタイムゾーンを表示するコンポーネントの例です。**Reload** を押すと、初期 HTML と、それに続くクライアントでの React の初回レンダーを確認できます。

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone() {
  use(browser());
  const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{timeZone}</p>
}

export default function App() {
  return (
    <>
      <p>Your current time zone is:</p>
      <Suspense fallback="Loading...">
        <TimeZone />
      </Suspense>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

TimeZone はサーバでサスペンドするため、初期 HTML にはサスペンスのフォールバックが含まれます。デモ用に設けた短い遅延の後、React がページをハイドレーションすると、コンポーネントはブラウザで通常通りレンダーできるようになります。

このように、サーバレンダリング中に意味のある UI を生成できないコンポーネントでも、`browser` を使うと読み込み状態にサスペンスを利用でき、レンダーの準備が整うまでサスペンドする他のコンポーネントと連携できます。

---

他の `use` の呼び出しと同様に、`use(browser())` は条件文の中や早期リターンの後でも呼び出せます。これにより、props の値などの条件に基づいて、サーバレンダリングの対象から除外できるコンポーネントやカスタムフックを記述できます。

以下は先ほどと同じ例ですが、今回は TimeZone コンポーネントが、省略可能なデフォルト値を受け取り、それを初期 HTML の一部として表示できるようになっています。

<Sandpack>

```js
import { Suspense, use } from 'react';
import { browser } from 'react-dom';

function TimeZone({ defaultValue }) {
  if (defaultValue) {
    return <p>{defaultValue}</p>;
  }

  use(browser());
  const localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

  return <p>{localTimeZone}</p>
}

export default function App() {
  return (
    <>
      <div>
        <p>The event's time zone is:</p>
        <TimeZone defaultValue='America/New_York' />
      </div>

      <hr />

      <div>
        <p>Your current time zone is:</p>
        <Suspense fallback="Loading...">
          <TimeZone />
        </Suspense>
      </div>
    </>
  );
}
```


```js src/Document.js hidden
import App from './App.js';

export default function Document() {
  return (
    <html lang="en">
      <head>
        <title>Event details</title>
        <style>{`
          h1 { font-size: 24px; margin-top: 0; }
        `}</style>
      </head>
      <body>
        <App />
      </body>
    </html>
  );
}
```

```js src/index.js hidden
import { hydrateRoot } from 'react-dom/client';
import { renderToReadableStream } from 'react-dom/server';
import Document from './Document.js';
import { flushReadableStreamToFrame } from './demo-helpers.js';
import './styles.css';

async function main(frame) {
  const stream = await renderToReadableStream(<Document />);
  await flushReadableStreamToFrame(stream, frame);

  // Wait so both the fallback and hydrated content are visible.
  await new Promise(resolve => setTimeout(resolve, 1200));
  hydrateRoot(frame.contentDocument, <Document />);
}

main(document.getElementById('preview'));
```

```js src/demo-helpers.js hidden
export async function flushReadableStreamToFrame(readable, frame) {
  const doc = frame.contentWindow.document;
  const decoder = new TextDecoder();
  const reader = readable.getReader();

  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    doc.write(decoder.decode(value, {stream: true}));
  }

  doc.write(decoder.decode());
  doc.close();
}
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Conditional browser rendering</title>
</head>
<body>
  <iframe id="preview" title="Rendered page"></iframe>
</body>
</html>
```

```css src/styles.css hidden
iframe {
  width: 100%;
  height: 240px;
  border: 0;
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.3.0-canary-f1f7ed2a-20260904",
    "react-dom": "19.3.0-canary-f1f7ed2a-20260904",
    "react-scripts": "latest"
  }
}
```

</Sandpack>

TimeZone がサスペンドするのは、デフォルト値が渡されていない 2 つ目のケースだけであることに注目してください。

このパターンの別の便利な例は、`useQuery` のようなデータ取得用のフックについて、クエリの初期データが渡されている場合（例えばサーバコンポーネントやフレームワークのローダ関数から）はそれを使い、そうでない場合はサーバレンダリングの対象から除外するようにする、というものです。

```js {3}
function useBrowserQuery(query, options) {
  if (options.initialData === undefined) {
    use(browser());
  }

  return useQuery(query, options);
}

function ProductDetails({ productId, initialData }) {
  const product = useBrowserQuery(`/api/products/${productId}`, {
    initialData,
  });

  return <h1>{product.name}</h1>;
}
```

これで、ProductDetails コンポーネントは、サーバレンダリング中に `initialData` を受け取っていれば、HTML に含めることができます。受け取っていなければ、ブラウザでレンダーされるまでサスペンドし、その時点で `useQuery` が通常通りデータを取得したりキャッシュから読み取ったりできます。

`browser` について、詳しくは[ドキュメントを参照してください](/reference/react-dom/browser)。

---

### Trusted Type サポート {/*trusted-types-support*/}

React 19.3 は、DOM ベースの XSS 攻撃の防止に役立つセキュリティ機能である、ブラウザの [信頼型 (Trusted Type) API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) と連携して動作します。サイトが `Content-Security-Policy: require-trusted-types-for 'script'` で信頼型機能を強制すると、ブラウザは `innerHTML` のようなインジェクションシンク（注入先）に渡す値が、生の文字列ではなく、サニタイズポリシーを通じて作成された型付きオブジェクト（`TrustedHTML`、`TrustedScript`、`TrustedScriptURL`）であることを要求します。

これまでは、React は DOM API に値を渡す前に、常に（`'' + value` によって）文字列に強制変換していました。そのため、信頼型オブジェクトが通常の文字列に戻り、ブラウザに拒否されていました。React は今回から、これらの値を強制変換せずに渡すため、ブラウザが値を検証でき、信頼型ポリシーが意図通りに機能するようになります。

---

## 新しい React サーバコンポーネントの機能 {/*new-react-server-components-features*/}

### サーバコンポーネントで `<Context>` を直接レンダー可能に {/*context-can-be-rendered-directly-in-server-components*/}

サーバコンポーネントではコンテクストを*作成*できませんが、`'use client'` モジュールからインポートすることで、コンテクストを*レンダー*できるようになりました。

これまでは、このためにクライアントモジュールから、しばしばプロバイダと呼ばれる別のラッパコンポーネントをエクスポートする必要がありました。

```js {7-9}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ currentUser, children }) {
  return <UserContext value={currentUser}>{children}</UserContext>;
}
```

```js {8}
// server-component.js
import { UserProvider } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserProvider currentUser={currentUser}>
      {children}
    </UserProvider>
  )
}
```

この例では、プロバイダは、サーバコンポーネントからの props をコンテクストへ直接渡す以外に何もしていないことに注目してください。

React 19.3 では、サーバコンポーネントで `'use client'` モジュールからコンテクストを直接インポートしてレンダーでき、追加のラッパコンポーネントは不要です。

```js {5}
// user-context.js
'use client';
import { createContext } from 'react';

export const UserContext = createContext(null);
```

```js {8}
// server-component.js
import { UserContext } from './user-context';

export async function Layout({ children }) {
  const currentUser = await getCurrentUser();

  return (
    <UserContext value={currentUser}>
      {children}
    </UserContext>
  )
}
```

これが特に有用なのは、サーバコンポーネントがクライアントツリーの他の部分とデータを共有することだけを目的として、コンテクストを使っている場合です。


---

## 更新履歴 {/*changelog*/}

その他の注目すべき変更点
- `react`：トランジションを 1 回のレンダーにまとめずに個別にレンダーすることで、遅いトランジションが無関係なトランジションを妨げないように変更 [#37290](https://github.com/react/react/pull/37290)
- `react-dom`：クライアントでレンダーしたルートと同様に、ハイドレーション中にも Strict Mode でエフェクトを 2 回実行するように変更 [#35961](https://github.com/react/react/pull/35961)
- `react`：条件文で `use` が誤って使われた場合に警告を追加 [#37104](https://github.com/react/react/pull/37104)
- `react`：`useActionState` のエラーメッセージで "form state" を "action state" に変更 [#35790](https://github.com/react/react/pull/35790)
- `react-dom`：`onFullscreenChange` と `onFullscreenError` イベントのサポートを追加 [#34621](https://github.com/react/react/pull/34621)
- `react-dom`：SVG の `maskType` プロパティのサポートを追加 [#35921](https://github.com/react/react/pull/35921)
- `react-dom`：モジュールリソースの `fetchPriority` をサポート [#36835](https://github.com/react/react/pull/36835)
- `react-dom`：サーバアクションの後に React がフォームを自動でリセットする際、`onReset` を呼び出すように変更 [#35176](https://github.com/react/react/pull/35176)
- `react-dom`：`submit` イベントに `submitter` を含めるように変更 [#35590](https://github.com/react/react/pull/35590)
- `react-dom`：iframe の `credentialless` を真偽値の属性として認識するように変更 [#36148](https://github.com/react/react/pull/36148)
- `react-dom`：`resize` イベントによる更新を次のフレームまでまとめるように変更 [#35117](https://github.com/react/react/pull/35117)
- `react-server`：`Error.cause` [#35810](https://github.com/react/react/pull/35810) と `AggregateError.errors` [#36156](https://github.com/react/react/pull/36156) をクライアントに転送
- `react-server`：Flight での `<Activity>` のサポートを追加 [#34697](https://github.com/react/react/pull/34697)

注目すべきバグ修正

- `react`：`useDeferredValue` が古い値のままになる問題を修正 [#36134](https://github.com/react/react/pull/36134)
- `react`：サスペンスのフォールバックへのコンテクストの伝播 [#36160](https://github.com/react/react/pull/36160) と、サスペンドしたサスペンスバウンダリを通じたコンテクストの伝播 [#35839](https://github.com/react/react/pull/35839) を修正
- `react`：非表示のツリー内で、まだハイドレーションされていないサスペンスバウンダリを更新した際に処理が停止する問題を修正 [#37135](https://github.com/react/react/pull/37135)
- `react`：`<Activity>` ツリーが非表示の間に起きたストアの変更を `useSyncExternalStore` が見逃す問題を修正 [#36947](https://github.com/react/react/pull/36947)
- `react`：`forwardRef` と `memo` のコンポーネントで、`useEffectEvent` が最新の値を読み取るように修正 [#34831](https://github.com/react/react/pull/34831)
- `react`：コンポーネントの state が更新された際にフォームのステータスがリセットされる問題を修正 [#34075](https://github.com/react/react/pull/34075)
- `react`：`lazy`、`memo`、コンポーネントの種類を変える編集に関する、Fast Refresh の複数のバグを修正 [#36965](https://github.com/react/react/pull/36965)、[#36964](https://github.com/react/react/pull/36964)、[#36963](https://github.com/react/react/pull/36963)、[#36950](https://github.com/react/react/pull/36950)
- `react`：`<title>` を含む `<Activity>` のモードが `visible` から `hidden` に変わった後も、`<title>` が `<head>` に巻き上げられるバグを修正 [#34983](https://github.com/react/react/pull/34983)
- `react`：非表示の `<Activity>` の外にエラーが漏れないように変更 [#35074](https://github.com/react/react/pull/35074)
- `react`：非表示の `<Activity>` 内でレンダーされたポータルのコンテンツを非表示にするように変更 [#35091](https://github.com/react/react/pull/35091)
- `react`：エラーメッセージで内部の `<Offscreen>` 型に言及しないように変更 [#35763](https://github.com/react/react/pull/35763)
- `react-dom`：フォーカスが委譲される要素と、すでにフォーカスされている要素でのフォーカスの問題を修正 [#36010](https://github.com/react/react/pull/36010)
- `react-dom`：DOM 仕様に従って capture オプションを正規化し、`FragmentInstance` のリスナがリークする問題を修正 [#36047](https://github.com/react/react/pull/36047)
- `react-dom`：Mobile Safari での `<ViewTransition>` のクラッシュを修正 [#35337](https://github.com/react/react/pull/35337)
- `react-dom`：`SuspenseList` と組み合わせた際の `<ViewTransition>` のクラッシュを修正 [#35520](https://github.com/react/react/pull/35520)
- `react-dom`：他の入力タイプと一致するように、`type="number"` の入力の `defaultValue` を更新 [#36980](https://github.com/react/react/pull/36980)
- `react-dom`：`innerHTML` が変わっていない場合に設定しないように変更 [#36949](https://github.com/react/react/pull/36949)
- `react-dom`：`nonce` 属性でハイドレーションの不一致が誤って検出される問題を修正 [#37030](https://github.com/react/react/pull/37030)
- `react-dom`：Deno で `react-dom/server` の処理が停止する問題を修正 [#35235](https://github.com/react/react/pull/35235)
- `react-server`：`decodeReplyFromBusboy` で `FormData` のエントリが失われる問題を修正 [#36468](https://github.com/react/react/pull/36468)
- `react-server`：深い非同期処理の連鎖によるスタックオーバーフロー [#35612](https://github.com/react/react/pull/35612) と、デバッグ情報の指数関数的な増加による `RangeError` [#37481](https://github.com/react/react/pull/37481) を修正

変更点の一覧については、[更新履歴](https://github.com/react/react/blob/main/CHANGELOG.md)を参照してください。

---

*この記事を執筆した [Sam Selikoff](https://x.com/samselikoff) と、レビューした [Matt Carroll](https://mattcarrollcode.com/)、[Dan Abramov](https://bsky.app/profile/danabra.mov)、[Andrew Clark](https://x.com/acdlite) に感謝します。*
