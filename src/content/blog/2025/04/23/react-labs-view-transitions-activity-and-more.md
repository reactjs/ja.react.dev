---
title: "React Labs: ビュー遷移、Activity、その他もろもろ"
author: Ricky Hanlon
date: 2025/04/23
description: React Labs 記事では、現在活発に研究・開発が行われているプロジェクトについて述べていきます。この投稿では、今すぐ試すことができる 2 つの新しい実験的機能と、現在取り組んでいる他の分野の更新情報を共有します。
---

April 23, 2025 by [Ricky Hanlon](https://twitter.com/rickhanlonii)

---

<Intro>

React Labs 記事では、現在活発に研究・開発が行われているプロジェクトについて述べていきます。この投稿では、今すぐ試すことができる 2 つの新しい実験的機能と、現在取り組んでいる他の分野の更新情報を共有します。

</Intro>


本日、試用の準備が整った 2 つの新しい実験的な機能のドキュメントをリリースします！

- [ビュー遷移 (View Transition)](#view-transitions)
- [Activity](#activity)

また、現在開発中の新機能の更新情報も共有します。
- [React パフォーマンストラック](#react-performance-tracks)
- [コンパイラの IDE 拡張](#compiler-ide-extension)
- [エフェクト依存配列の自動化](#automatic-effect-dependencies)
- [フラグメント ref](#fragment-refs)
- [並行ストア](#concurrent-stores)

---

# 新しい実験的な機能 {/*new-experimental-features*/}

<Note>

`<Activity />` は `react@19.2` でリリースされました。

`<ViewTransition />` と `addTransitionType` は現在 `react@canary` で利用可能です。

</Note>

ビュー遷移 (View Transition) と Activity について、`react@experimental` でテストする準備が整いました。これらの機能は本番環境でテストされており安定していますが、フィードバックを取り入れる過程で最終的な API が変更される可能性が残っています。

React パッケージを最新の実験的なバージョンにアップグレードすることで試すことが可能です。

- `react@experimental`
- `react-dom@experimental`

これらの機能をアプリで使用する方法を学ぶか、新しく公開されたドキュメントをチェックしてください：

- [`<ViewTransition>`](/reference/react/ViewTransition)：ビュー遷移アニメーションを有効にするコンポーネント。
- [`addTransitionType`](/reference/react/addTransitionType)：ビュー遷移の起因 (cause) を指定するための関数。
- [`<Activity>`](/reference/react/Activity)：UI の一部を非表示・表示するために使用するコンポーネント。

## ビュー遷移 {/*view-transitions*/}

React View Transition は、アプリの UI 遷移にアニメーションを追加しやすくするための新しい実験的機能です。内部的にこれらのアニメーションは、ほとんどのモダンブラウザで利用可能な新しい API である [`startViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) を使用します。

要素に対してアニメーションを有効化するには、新登場の `<ViewTransition>` コンポーネントで要素をラップします。

```js
// "what" to animate.
<ViewTransition>
  <div>animate me</div>
</ViewTransition>
```

この新しいコンポーネントを使用することで、アニメーションが起動した際に「何を」アニメーションするかを宣言的に定義できます。

「いつ」アニメーションするかの方は、以下の 3 つのビュー遷移トリガのいずれかを使用して定義します。

```js
// "when" to animate.

// Transitions
startTransition(() => setState(...));

// Deferred Values
const deferred = useDeferredValue(value);

// Suspense
<Suspense fallback={<Fallback />}>
  <div>Loading...</div>
</Suspense>
```

デフォルトでは、これらのアニメーションは[ビュー遷移のためのデフォルト CSS アニメーション](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#customizing_your_animations) を使用します（通常はスムースなクロスフェード）。「どんな」アニメーションが発生するかを定義するために[ビュー遷移関連の擬似セレクタ](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_pseudo-element_tree)を使用できます。たとえば、すべてのビュー遷移についてデフォルトのアニメーションを変更するには `*` を使用できます。

```
// "how" to animate.
::view-transition-old(*) {
  animation: 300ms ease-out fade-out;
}
::view-transition-new(*) {
  animation: 300ms ease-in fade-in;
}
```

アニメーションのトリガ（`startTransition`、`useDeferredValue`、または `Suspense` フォールバックからコンテンツへの切り替え）によって DOM が更新される場合、React は[宣言的なヒューリスティックス](/reference/react/ViewTransition#viewtransition)を使用して、どの `<ViewTransition>` コンポーネントでアニメーションを起動するかを自動的に決定します。その後、CSS で定義されたアニメーションをブラウザが実行します。

ブラウザのビュー遷移 API をすでにご存じで、React がそれをどのようにサポートしているかを知りたい場合は、ドキュメントの [`<ViewTransition>` の動作の仕組み](/reference/react/ViewTransition#how-does-viewtransition-work)をチェックしてください。

この投稿では、ビュー遷移を使用するいくつかの例を見てみましょう。

以下のアプリから始めましょう。次のような操作ができますが、何のアニメーションも含まれてません。
- ビデオをクリックして詳細を表示
- "Back" をクリックしてフィードに戻る
- リスト内でタイプしてビデオをフィルタリング

<Sandpack>

```js src/App.js active
import TalkDetails from './Details'; import Home from './Home'; import {useRouter} from './router';

export default function App() {
  const {url} = useRouter();

  // 🚩This version doesn't include any animations yet
  return url === '/' ? <Home /> : <TalkDetails />;
}
```

```js src/Details.js
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>

      <div className="bottom">
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
```

```js src/LikeButton.js
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js
import { useState } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    >
      {children}
    </div>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {
  useState,
  createContext,
  use,
  useTransition,
  useLayoutEffect,
  useEffect,
} from "react";

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children }) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  function navigateBack(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}
```

```css src/styles.css
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

<Note>

#### ビュー遷移は CSS・JS 駆動のアニメーションを置き換えるものではない {/*view-transitions-do-not-replace-css-and-js-driven-animations*/}

ビュー遷移は、ナビゲーション、内容展開、オープン、並べ替えといった UI 遷移に対して使用されることを意図しています。アプリ内のすべてのアニメーションを置き換えることが意図されているわけではありません。

上記のサンプルアプリでは、"Like" ボタンをクリックしたときやサスペンスフォールバック内のローディング表示には、すでにアニメーションがあることに注意してください。これらは特定の要素だけをアニメーションしているため、CSS アニメーションの良い使用例です。

</Note>

### ナビゲーションのアニメーション {/*animating-navigations*/}

このアプリにはサスペンス対応のルータが含まれており、[ページの遷移はすでにトランジションとしてマークされています](/reference/react/useTransition#building-a-suspense-enabled-router)。つまり、ナビゲーションは `startTransition` 内で実行されます。

```js
function navigate(url) {
  startTransition(() => {
    go(url);
  });
}
```

`startTransition` はビュー遷移のトリガの一種なので、ページ間でアニメーションするために `<ViewTransition>` を追加できます。

```js
// "what" to animate
<ViewTransition key={url}>
  {url === '/' ? <Home /> : <TalkDetails />}
</ViewTransition>
```

`url` が変化すると、`<ViewTransition>` と新しいページがレンダーされます。`<ViewTransition>` の更新が `startTransition` 内で起きたため、この `<ViewTransition>` のアニメーションが起動されます。


デフォルトでは、ビュー遷移としてブラウザのデフォルトのクロスフェードアニメーションが含まれています。これを追加することで、ページ間を移動するたびにクロスフェードが発生するようになります。

<Sandpack>

```js src/App.js active
import {ViewTransition} from 'react'; import Details from './Details';
import Home from './Home'; import {useRouter} from './router';

export default function App() {
  const {url} = useRouter();

  // Use ViewTransition to animate between pages.
  // No additional CSS needed by default.
  return (
    <ViewTransition>
      {url === '/' ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js
import {ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();

  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    >
      {children}
    </div>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {useState, createContext,use,useTransition,useLayoutEffect,useEffect} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }




  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });


  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }


  function navigateBack(url) {
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}
```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

ルータのページ更新はすでに `startTransition` を使用して行われているため、`<ViewTransition>` を追加するというこの 1 行の変更だけで、デフォルトのクロスフェードアニメーションが有効になるのです。

これがどのように機能するかに興味がある場合は、ドキュメントの [`<ViewTransition>` の動作の仕組み](/reference/react/ViewTransition#how-does-viewtransition-work)を参照してください。

<Note>

#### `<ViewTransition>` アニメーションのオプトアウト {/*opting-out-of-viewtransition-animations*/}

今回の例では単純化のため、アプリのルート (root) を `<ViewTransition>` でラップしていますが、これによりアプリ内のすべての UI 遷移がアニメーション化され、予期しないアニメーションが発生する可能性があります。

修正するには、ルートの子を `"none"` でラップして、各ページが独自のアニメーションを制御できるようにします。

```js
// Layout.js
<ViewTransition default="none">
  {children}
</ViewTransition>
```

実際には、ナビゲーションは props の "enter" と "exit" を介して、または遷移タイプを使用して行うべきです。

</Note>

### アニメーションのカスタマイズ {/*customizing-animations*/}

デフォルトでは、`<ViewTransition>` にはブラウザのデフォルトのクロスフェードが含まれています。

アニメーションをカスタマイズするには、`<ViewTransition>` コンポーネントに props を渡して、[`<ViewTransition>` の起動方法](/reference/react/ViewTransition#props)に記載されているようにして使用するアニメーションを指定できます。

たとえば、`default` クロスフェードアニメーションを遅くするには以下のようにします。

```js
<ViewTransition default="slow-fade">
  <Home />
</ViewTransition>
```

その後に[ビュー遷移クラス](/reference/react/ViewTransition#view-transition-class)を用いて CSS で `slow-fade` を定義します。

```css
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

これで、クロスフェードが遅くなりました。

<Sandpack>

```js src/App.js active
import { ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Define a default animation of .slow-fade.
  // See animations.css for the animation definition.
  return (
    <ViewTransition default="slow-fade">
      {url === '/' ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();

  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Thumbnail({ video, children }) {
  return (
    <div
      aria-hidden="true"
      tabIndex={-1}
      className={`thumbnail ${video.image}`}
    >
      {children}
    </div>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {
  useState,
  createContext,
  use,
  useTransition,
  useLayoutEffect,
  useEffect,
} from "react";

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children }) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  function navigateBack(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}
```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Define .slow-fade using view transition classes */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

[ビュー遷移のスタイリング](/reference/react/ViewTransition#styling-view-transitions)に、`<ViewTransition>` のスタイリングに関する完全なガイドがあります。

### 共通要素の遷移 {/*shared-element-transitions*/}

2 つのページに同一の要素が含まれている場合、その要素をページをまたいでアニメーションさせたいことがあります。

これを行うには、`<ViewTransition>` に一意の `name` を追加します。

```js
<ViewTransition name={`video-${video.id}`}>
  <Thumbnail video={video} />
</ViewTransition>
```

これで、ビデオのサムネイルが 2 つのページをまたいでアニメーションします。

<Sandpack>

```js src/App.js
import { ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Keeping our default slow-fade.
  // This allows the content not in the shared
  // element transition to cross-fade.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();

  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {heading}
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js active
import { useState, ViewTransition } from "react"; import LikeButton from "./LikeButton"; import { useRouter } from "./router"; import { PauseIcon, PlayIcon } from "./Icons"; import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {
  useState,
  createContext,
  use,
  useTransition,
  useLayoutEffect,
  useEffect,
} from "react";

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

export function Router({ children }) {
  const [routerState, setRouterState] = useState({
    pendingNav: () => {},
    url: document.location.pathname,
  });
  const [isPending, startTransition] = useTransition();

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }
  function navigate(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  function navigateBack(url) {
    // Update router state in transition.
    startTransition(() => {
      go(url);
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}
```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */





::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

デフォルトでは、React はビュー遷移で起動された各要素に一意の `name` を自動的に生成します（[`<ViewTransition>` の動作の仕組み](/reference/react/ViewTransition#how-does-viewtransition-work)を参照）。`name` 付きの `<ViewTransition>` が削除され、新しい `<ViewTransition>` が同じ `name` で追加されるようなビュー遷移を React が検出すると、共通要素のビュー遷移 (shared element transition) が起動します。

詳細については、ドキュメントで[共通要素のアニメーション](/reference/react/ViewTransition#animating-a-shared-element)を参照してください。

### 起因別のアニメーション {/*animating-based-on-cause*/}

場合によっては、起因 (cause) に基づいてアニメーションを変えたいことがあります。このユースケースのために、ビュー遷移の起因を指定するための新しい API である `addTransitionType` を追加しました。

```js {4,11}
function navigate(url) {
  startTransition(() => {
    // Transition type for the cause "nav forward"
    addTransitionType('nav-forward');
    go(url);
  });
}
function navigateBack(url) {
  startTransition(() => {
    // Transition type for the cause "nav backward"
    addTransitionType('nav-back');
    go(url);
  });
}
```

遷移タイプ (transition type) を使用することで、`<ViewTransition>` に渡す props を介して、カスタムアニメーションを提供できます。ヘッダの "6 Videos" と "Back" の部分に共通要素のビュー遷移を追加してみましょう。

```js {4,5}
<ViewTransition
  name="nav"
  share={{
    'nav-forward': 'slide-forward',
    'nav-back': 'slide-back',
  }}>
  {heading}
</ViewTransition>
```

ここでは、遷移タイプに基づいてどのようにアニメーションするかを定義するため、props として `share` にオブジェクトを渡しています。共通要素ビュー遷移が `nav-forward` によって起動した場合には、ビュー遷移クラスとして `slide-forward` が適用されます。`nav-back` による場合には、`slide-back` のアニメーションが起動します。これらのアニメーションを CSS で定義しましょう。

```css
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: ...
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: ...
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: ...
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: ...
}
```

これで、サムネールだけではなくヘッダも、ナビゲーションの種類に基づいてアニメーションできるようになりました。

<Sandpack>

```js src/App.js hidden
import { ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Keeping our default slow-fade.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { use, Suspense } from "react";
import { ChevronLeft } from "./Icons";

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={video.id} />
        </Suspense>
      </div>
    </Layout>
  );
}

```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js active
import {ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }


  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* New keyframes to support our animations above. */
@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Previously defined animations. */

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

### サスペンスバウンダリのアニメーション {/*animating-suspense-boundaries*/}

サスペンスもビュー遷移を起動できます。

フォールバックからコンテンツへのアニメーションを行うには、`<ViewTransition>` で `Suspense` をラップします。

```js
<ViewTransition>
  <Suspense fallback={<VideoInfoFallback />}>
    <VideoInfo />
  </Suspense>
</ViewTransition>
```

これを追加することで、フォールバックからコンテンツにクロスフェードするようになります。ビデオをクリックし、ビデオ情報がアニメーションで表示されるようになったことを確認してください。

<Sandpack>

```js src/App.js hidden
import { ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Default slow-fade animation.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js active
import { use, Suspense, ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({ id }) {
  // Cross-fade the fallback to content.
  return (
    <ViewTransition default="slow-fade">
      <Suspense fallback={<VideoInfoFallback />}>
          <VideoInfo id={id} />
      </Suspense>
    </ViewTransition>
  );
}

function VideoInfoFallback() {
  return (
    <div>
      <div className="fit fallback title"></div>
      <div className="fit fallback description"></div>
    </div>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <div>
      <p className="fit info-title">{details.title}</p>
      <p className="fit info-description">{details.description}</p>
    </div>
  );
}
```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {ViewTransition} from 'react';
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Slide the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

/* Slide the content up */
::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Define the new keyframes */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

/* Previously defined animations below */

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

また、フォールバック側に `exit` を、コンテンツ側に `enter` を使用して、カスタムアニメーションを提供することもできます。

```js {3,8}
<Suspense
  fallback={
    <ViewTransition exit="slide-down">
      <VideoInfoFallback />
    </ViewTransition>
  }
>
  <ViewTransition enter="slide-up">
    <VideoInfo id={id} />
  </ViewTransition>
</Suspense>
```

以下のようにして CSS を使用して `slide-down` と `slide-up` を定義します。

```css {1, 6}
::view-transition-old(.slide-down) {
  /* Slide the fallback down */
  animation: ...;
}

::view-transition-new(.slide-up) {
  /* Slide the content up */
  animation: ...;
}
```

これで、サスペンス内のコンテンツがフォールバックを置き換える際にスライドアニメーションが使われます。

<Sandpack>

```js src/App.js hidden
import { ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Default slow-fade animation.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js active
import { use, Suspense, ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({ id }) {
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js hidden
import { Video } from "./Videos";
import Layout from "./Layout";
import { fetchVideos } from "./data";
import { useId, useState, use } from "react";
import { IconSearch } from "./Icons";

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <div className="video-list">
        {foundVideos.length === 0 && (
          <div className="no-results">No results</div>
        )}
        <div className="videos">
          {foundVideos.map((video) => (
            <Video key={video.id} video={video} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {ViewTransition} from 'react';
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Slide the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

/* Slide the content up */
::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Define the new keyframes */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

/* Previously defined animations below */

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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


### リストのアニメーション {/*animating-lists*/}

`<ViewTransition>` を使用すれば、以下の検索可能なアイテムリストのように、アイテムの並べ替えをアニメーション化することもできます。

```js {3,5}
<div className="videos">
  {filteredVideos.map((video) => (
    <ViewTransition key={video.id}>
      <Video video={video} />
    </ViewTransition>
  ))}
</div>
```

この ViewTransition を起動するために `useDeferredValue` を使用します。

```js {2}
const [searchText, setSearchText] = useState('');
const deferredSearchText = useDeferredValue(searchText);
const filteredVideos = filterVideos(videos, deferredSearchText);
```

これで、検索バーに入力するたびにアイテムがアニメーションします。

<Sandpack>

```js src/App.js hidden
import { ViewTransition } from "react";
import Details from "./Details";
import Home from "./Home";
import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  // Default slow-fade animation.
  return (
    <ViewTransition default="slow-fade">
      {url === "/" ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { use, Suspense, ViewTransition } from "react";
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js
import { useId, useState, use, useDeferredValue, ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when")
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what")
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');

  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {ViewTransition} from 'react';
import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */






/* Slide animation for Suspense */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}


/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

### 最終結果 {/*final-result*/}

いくつかの `<ViewTransition>` コンポーネントと数行の CSS を追加することで、上記のすべてのアニメーションを最終結果に追加することができました。

我々はビュー遷移機能に非常に期待しており、みなさんが構築できるアプリのレベルアップに役立つと考えています。React リリースの実験的チャンネルで、今日から試す準備が整っています。

遅いフェードを削除して、最終結果を見ておきましょう。

<Sandpack>

```js src/App.js
import {ViewTransition} from 'react'; import Details from './Details'; import Home from './Home'; import {useRouter} from './router';

export default function App() {
  const {url} = useRouter();

  // Animate with a cross fade between pages.
  return (
    <ViewTransition key={url}>
      {url === '/' ? <Home /> : <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js
import { use, Suspense, ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js
import { useId, useState, use, useDeferredValue, ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when")
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what")
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');

  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js
import {ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js
import { useState, ViewTransition } from "react"; import LikeButton from "./LikeButton"; import { useRouter } from "./router"; import { PauseIcon, PlayIcon } from "./Icons"; import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}



export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* Slide animations for Suspense the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

これらがどのように機能するかについてもっと知りたい場合は、ドキュメントで [`<ViewTransition>` の動作の仕組み](/reference/react/ViewTransition#how-does-viewtransition-work)をチェックしてください。

<<<<<<< HEAD
_ビュー遷移機能の開発経緯についての詳細は、[@sebmarkbage](https://twitter.com/sebmarkbage) による [#31975](https://github.com/facebook/react/pull/31975)、[#32105](https://github.com/facebook/react/pull/32105)、[#32041](https://github.com/facebook/react/pull/32041)、[#32734](https://github.com/facebook/react/pull/32734)、[#32797](https://github.com/facebook/react/pull/32797)、[#31999](https://github.com/facebook/react/pull/31999)、[#32031](https://github.com/facebook/react/pull/32031)、[#32050](https://github.com/facebook/react/pull/32050)、[#32820](https://github.com/facebook/react/pull/32820)、[#32029](https://github.com/facebook/react/pull/32029)、[#32028](https://github.com/facebook/react/pull/32028)、および [#32038](https://github.com/facebook/react/pull/32038) を参照してください (thanks Seb!)。_
=======
_For more background on how we built View Transitions, see: [#31975](https://github.com/react/react/pull/31975), [#32105](https://github.com/react/react/pull/32105), [#32041](https://github.com/react/react/pull/32041), [#32734](https://github.com/react/react/pull/32734), [#32797](https://github.com/react/react/pull/32797) [#31999](https://github.com/react/react/pull/31999), [#32031](https://github.com/react/react/pull/32031), [#32050](https://github.com/react/react/pull/32050), [#32820](https://github.com/react/react/pull/32820), [#32029](https://github.com/react/react/pull/32029), [#32028](https://github.com/react/react/pull/32028), and [#32038](https://github.com/react/react/pull/32038) by [@sebmarkbage](https://twitter.com/sebmarkbage) (thanks Seb!)._
>>>>>>> c7d6b700038c63d1aaf2c649af1aefe01ebbacac

---

## Activity {/*activity*/}

<Note>

**`<Activity />` は React の Canary チャンネルで利用可能となりました**。

[React のリリースチャンネルについてさらに読む](/community/versioning-policy#all-release-channels)

</Note>

[過去の](/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#offscreen) [お知らせ](/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024#offscreen-renamed-to-activity) で、コンポーネントを視覚的に隠して優先度を下げることで、UI の state を保持しつつ、アンマウントや CSS による非表示と比べてパフォーマンスコストを削減する API を研究していることをお話ししました。

この API とその仕組みを共有する準備が整い、React の実験的バージョンでテストを始められるようになりました。

`<Activity>` は、UI を部分的に隠したり表示したりするための新しいコンポーネントです。

```js [[1, 1, "'visible'"], [2, 1, "'hidden'"]]
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

Activity が <CodeStep step={1}>visible</CodeStep> のときは通常通りレンダーされます。Activity が <CodeStep step={2}>hidden</CodeStep> のときはアンマウントされますが、その state を保存し、画面上に表示されているものよりも低い優先度でレンダーを続けます。

`Activity` を使用して、ユーザが使用していない UI の state を保存したり、ユーザが次に使用する可能性が高い部分を事前にレンダーしておくことが可能です。

以下で、上記のビュー遷移サンプルを改善する例を見ていきましょう。

<Note>

**Activity が非表示のとき、エフェクトはマウントされない**

`<Activity>` が `hidden` のとき、エフェクトはアンマウントされます。概念的にはコンポーネントはアンマウントされているのですが、React は state を後で使用するために保存します。

実際には、[そのエフェクトは不要かも](/learn/you-might-not-need-an-effect)のガイドに従っている限りは、これは期待通りに動作します。問題のあるエフェクトを積極的に見つけるために、[`<StrictMode>`](/reference/react/StrictMode) を追加することをお勧めします。これにより、予期しない副作用をキャッチするために Activity のアンマウントとマウントが積極的に行われます。

</Note>

### Activity で state を復元する {/*restoring-state-with-activity*/}

ユーザがページから離れる際は、以前のページのレンダーを止めてしまうのが一般的です。

```js {6,7}
function App() {
  const { url } = useRouter();

  return (
    <>
      {url === '/' && <Home />}
      {url !== '/' && <Details />}
    </>
  );
}
```

しかしこれでは、ユーザが前のページに戻ったとき、以前のすべての state が失われていることになります。たとえば、`<Home />` ページに `<input>` フィールドがある場合、ユーザがページを離れると `<input>` はアンマウントされ、入力したすべてのテキストは消えてしまいます。

Activity を使用すると、ユーザがページを移動しても state を保持できるため、戻ってきたときに以前の状態から再開できます。これは、ツリーの一部を `<Activity>` でラップし、`mode` を切り替えることで実現できます。

```js {6-8}
function App() {
  const { url } = useRouter();

  return (
    <>
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      {url !== '/' && <Details />}
    </>
  );
}
```

以前のビュー遷移の例を、これで改善できます。以前は、ビデオを検索し、選択して戻ってくると、入力された検索フィルタが失われていました。Activity を使用すると検索フィルタが復元され、以前の状態から再開できます。

ビデオを検索し、選択したあと "Back" をクリックしてみてください。

<Sandpack>

```js src/App.js
import { Activity, ViewTransition } from "react"; import Details from "./Details"; import Home from "./Home"; import { useRouter } from "./router";

export default function App() {
  const { url } = useRouter();

  return (
    // View Transitions know about Activity
    <ViewTransition>
      {/* Render Home in Activity so we don't lose state */}
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      {url !== '/' && <Details />}
    </ViewTransition>
  );
}
```

```js src/Details.js hidden
import { use, Suspense, ViewTransition } from "react";
import { fetchVideo, fetchVideoDetails } from "./data";
import { Thumbnail, VideoControls } from "./Videos";
import { useRouter } from "./router";
import Layout from "./Layout";
import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details() {
  const { url, navigateBack } = useRouter();
  const videoId = url.split("/").pop();
  const video = use(fetchVideo(videoId));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js hidden
import { useId, useState, use, useDeferredValue, ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when")
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what")
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');

  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */






/* Slide animations for Suspense the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

### Activity によるプリレンダー {/*prerender-with-activity*/}

ときには、ユーザが次に使用する可能性が高い UI を事前に準備しておき、ユーザが使用したくなったときにすぐに利用できるようにしたいことがあります。これは、次のページがレンダーに必要なデータをサスペンドする必要がある場合に特に有用です。ユーザがナビゲートする前にデータをすでに取得済みにできるからです。

たとえば、現在のアプリでは、ビデオを選択する際に各ビデオの詳細データを読み込むためにサスペンスを使用しています。これを改善するために、ユーザがナビゲートする前に、すべてのページを非表示の `<Activity>` でレンダーしておきます。

```js {2,5,8}
<ViewTransition>
  <Activity mode={url === '/' ? 'visible' : 'hidden'}>
    <Home />
  </Activity>
  <Activity mode={url === '/details/1' ? 'visible' : 'hidden'}>
    <Details id={id} />
  </Activity>
  <Activity mode={url === '/details/1' ? 'visible' : 'hidden'}>
    <Details id={id} />
  </Activity>
<ViewTransition>
```

これにより、次のページのコンテンツをプリレンダーする余裕がある場合は、サスペンスフォールバックなしでアニメーションが表示されます。ビデオをクリックしてみて、詳細ページのビデオタイトルと説明がフォールバックなしで即座にレンダーされることを確認してください。

<Sandpack>

```js src/App.js
import { Activity, ViewTransition, use } from "react"; import Details from "./Details"; import Home from "./Home"; import { useRouter } from "./router"; import {fetchVideos} from './data';

export default function App() {
  const { url } = useRouter();
  const videoId = url.split("/").pop();
  const videos = use(fetchVideos());

  return (
    <ViewTransition>
      {/* Render videos in Activity to pre-render them */}
      {videos.map(({id}) => (
        <Activity key={id} mode={videoId === id ? 'visible' : 'hidden'}>
          <Details id={id}/>
        </Activity>
      ))}
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
    </ViewTransition>
  );
}
```

```js src/Details.js
import { use, Suspense, ViewTransition } from "react"; import { fetchVideo, fetchVideoDetails } from "./data"; import { Thumbnail, VideoControls } from "./Videos"; import { useRouter } from "./router"; import Layout from "./Layout"; import { ChevronLeft } from "./Icons";

function VideoDetails({id}) {
  // Animate from Suspense fallback to content.
  // If this is pre-rendered then the fallback
  // won't need to show.
  return (
    <Suspense
      fallback={
        // Animate the fallback down.
        <ViewTransition exit="slide-down">
          <VideoInfoFallback />
        </ViewTransition>
      }
    >
      {/* Animate the content up */}
      <ViewTransition enter="slide-up">
        <VideoInfo id={id} />
      </ViewTransition>
    </Suspense>
  );
}

function VideoInfoFallback() {
  return (
    <>
      <div className="fallback title"></div>
      <div className="fallback description"></div>
    </>
  );
}

export default function Details({id}) {
  const { url, navigateBack } = useRouter();
  const video = use(fetchVideo(id));

  return (
    <Layout
      heading={
        <div
          className="fit back"
          onClick={() => {
            navigateBack("/");
          }}
        >
          <ChevronLeft /> Back
        </div>
      }
    >
      <div className="details">
        <Thumbnail video={video} large>
          <VideoControls />
        </Thumbnail>
        <VideoDetails id={video.id} />
      </div>
    </Layout>
  );
}

function VideoInfo({ id }) {
  const details = use(fetchVideoDetails(id));
  return (
    <>
      <p className="info-title">{details.title}</p>
      <p className="info-description">{details.description}</p>
    </>
  );
}
```

```js src/Home.js hidden
import { useId, useState, use, useDeferredValue, ViewTransition } from "react";import { Video } from "./Videos";import Layout from "./Layout";import { fetchVideos } from "./data";import { IconSearch } from "./Icons";

function SearchList({searchText, videos}) {
  // Activate with useDeferredValue ("when")
  const deferredSearchText = useDeferredValue(searchText);
  const filteredVideos = filterVideos(videos, deferredSearchText);
  return (
    <div className="video-list">
      {filteredVideos.length === 0 && (
        <div className="no-results">No results</div>
      )}
      <div className="videos">
        {filteredVideos.map((video) => (
          // Animate each item in list ("what")
          <ViewTransition key={video.id}>
            <Video video={video} />
          </ViewTransition>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const videos = use(fetchVideos());
  const count = videos.length;
  const [searchText, setSearchText] = useState('');

  return (
    <Layout heading={<div className="fit">{count} Videos</div>}>
      <SearchInput value={searchText} onChange={setSearchText} />
      <SearchList videos={videos} searchText={searchText} />
    </Layout>
  );
}

function SearchInput({ value, onChange }) {
  const id = useId();
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">
        Search
      </label>
      <div className="search-input">
        <div className="search-icon">
          <IconSearch />
        </div>
        <input
          type="text"
          id={id}
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </form>
  );
}

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
```

```js src/Icons.js hidden
export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
        <path
          fill="currentColor"
          fillRule="nonzero"
          d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
          transform="translate(356.5 164.5)"
        />
        <polygon points="446 418 466 418 466 398 446 398" />
      </g>
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg
      className="control-icon"
      style={{padding: '4px'}}
      width="100"
      height="100"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M256 0C114.617 0 0 114.615 0 256s114.617 256 256 256 256-114.615 256-256S397.383 0 256 0zm-32 320c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128zm128 0c0 8.836-7.164 16-16 16h-32c-8.836 0-16-7.164-16-16V192c0-8.836 7.164-16 16-16h32c8.836 0 16 7.164 16 16v128z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg
      className="control-icon"
      width="100"
      height="100"
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 69C54.2254 69 69 54.2254 69 36C69 17.7746 54.2254 3 36 3C17.7746 3 3 17.7746 3 36C3 54.2254 17.7746 69 36 69ZM52.1716 38.6337L28.4366 51.5801C26.4374 52.6705 24 51.2235 24 48.9464V23.0536C24 20.7764 26.4374 19.3295 28.4366 20.4199L52.1716 33.3663C54.2562 34.5034 54.2562 37.4966 52.1716 38.6337Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Heart({liked, animate}) {
  return (
    <>
      <svg
        className="absolute overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={`circle ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
          cx="12"
          cy="12"
          r="11.5"
          fill="transparent"
          strokeWidth="0"
          stroke="currentColor"
        />
      </svg>

      <svg
        className={`heart ${liked ? 'liked' : ''} ${animate ? 'animate' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {liked ? (
          <path
            d="M12 23a.496.496 0 0 1-.26-.074C7.023 19.973 0 13.743 0 8.68c0-4.12 2.322-6.677 6.058-6.677 2.572 0 5.108 2.387 5.134 2.41l.808.771.808-.771C12.834 4.387 15.367 2 17.935 2 21.678 2 24 4.558 24 8.677c0 5.06-7.022 11.293-11.74 14.246a.496.496 0 0 1-.26.074V23z"
            fill="currentColor"
          />
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12 5.184-.808-.771-.004-.004C11.065 4.299 8.522 2.003 6 2.003c-3.736 0-6 2.558-6 6.677 0 4.47 5.471 9.848 10 13.079.602.43 1.187.82 1.74 1.167A.497.497 0 0 0 12 23v-.003c.09 0 .182-.026.26-.074C16.977 19.97 24 13.737 24 8.677 24 4.557 21.743 2 18 2c-2.569 0-5.166 2.387-5.192 2.413L12 5.184zm-.002 15.525c2.071-1.388 4.477-3.342 6.427-5.47C20.72 12.733 22 10.401 22 8.677c0-1.708-.466-2.855-1.087-3.55C20.316 4.459 19.392 4 18 4c-.726 0-1.63.364-2.5.9-.67.412-1.148.82-1.266.92-.03.025-.037.031-.019.014l-.013.013L12 7.949 9.832 5.88a10.08 10.08 0 0 0-1.33-.977C7.633 4.367 6.728 4.003 6 4.003c-1.388 0-2.312.459-2.91 1.128C2.466 5.826 2 6.974 2 8.68c0 1.726 1.28 4.058 3.575 6.563 1.948 2.127 4.352 4.078 6.423 5.466z"
            fill="currentColor"
          />
        )}
      </svg>
    </>
  );
}

export function IconSearch(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20">
      <path
        d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"></path>
    </svg>
  );
}
```

```js src/Layout.js hidden
import {ViewTransition} from 'react'; import { useIsNavPending } from "./router";

export default function Page({ heading, children }) {
  const isPending = useIsNavPending();
  return (
    <div className="page">
      <div className="top">
        <div className="top-nav">
          {/* Custom classes based on transition type. */}
          <ViewTransition
            name="nav"
            share={{
              'nav-forward': 'slide-forward',
              'nav-back': 'slide-back',
            }}>
            {heading}
          </ViewTransition>
          {isPending && <span className="loader"></span>}
        </div>
      </div>
      {/* Opt-out of ViewTransition for the content. */}
      {/* Content can define it's own ViewTransition. */}
      <ViewTransition default="none">
        <div className="bottom">
          <div className="content">{children}</div>
        </div>
      </ViewTransition>
    </div>
  );
}
```

```js src/LikeButton.js hidden
import {useState} from 'react';
import {Heart} from './Icons';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

export default function LikeButton({video}) {
  const [isLiked, setIsLiked] = useState(() => likedVideos.has(video.id));
  const [animate, setAnimate] = useState(false);
  return (
    <button
      className={`like-button ${isLiked && 'liked'}`}
      aria-label={isLiked ? 'Unsave' : 'Save'}
      onClick={() => {
        const nextIsLiked = !isLiked;
        if (nextIsLiked) {
          likedVideos.add(video.id);
        } else {
          likedVideos.delete(video.id);
        }
        setAnimate(true);
        setIsLiked(nextIsLiked);
      }}>
      <Heart liked={isLiked} animate={animate} />
    </button>
  );
}
```

```js src/Videos.js hidden
import { useState, ViewTransition } from "react";
import LikeButton from "./LikeButton";
import { useRouter } from "./router";
import { PauseIcon, PlayIcon } from "./Icons";
import { startTransition } from "react";

export function Thumbnail({ video, children }) {
  // Add a name to animate with a shared element transition.
  // This uses the default animation, no additional css needed.
  return (
    <ViewTransition name={`video-${video.id}`}>
      <div
        aria-hidden="true"
        tabIndex={-1}
        className={`thumbnail ${video.image}`}
      >
        {children}
      </div>
    </ViewTransition>
  );
}

export function VideoControls() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <span
      className="controls"
      onClick={() =>
        startTransition(() => {
          setIsPlaying((p) => !p);
        })
      }
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </span>
  );
}

export function Video({ video }) {
  const { navigate } = useRouter();

  return (
    <div className="video">
      <div
        className="link"
        onClick={(e) => {
          e.preventDefault();
          navigate(`/video/${video.id}`);
        }}
      >
        <Thumbnail video={video}></Thumbnail>

        <div className="info">
          <div className="video-title">{video.title}</div>
          <div className="video-description">{video.description}</div>
        </div>
      </div>
      <LikeButton video={video} />
    </div>
  );
}
```


```js src/data.js hidden
const videos = [
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

let videosCache = new Map();
let videoCache = new Map();
let videoDetailsCache = new Map();
const VIDEO_DELAY = 1;
const VIDEO_DETAILS_DELAY = 1000;
export function fetchVideos() {
  if (videosCache.has(0)) {
    return videosCache.get(0);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos);
    }, VIDEO_DELAY);
  });
  videosCache.set(0, promise);
  return promise;
}

export function fetchVideo(id) {
  if (videoCache.has(id)) {
    return videoCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DELAY);
  });
  videoCache.set(id, promise);
  return promise;
}

export function fetchVideoDetails(id) {
  if (videoDetailsCache.has(id)) {
    return videoDetailsCache.get(id);
  }
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(videos.find((video) => video.id === id));
    }, VIDEO_DETAILS_DELAY);
  });
  videoDetailsCache.set(id, promise);
  return promise;
}
```

```js src/router.js hidden
import {useState, createContext, use, useTransition, useLayoutEffect, useEffect, addTransitionType} from "react";

export function Router({ children }) {
  const [isPending, startTransition] = useTransition();
  const [routerState, setRouterState] = useState({pendingNav: () => {}, url: document.location.pathname});
  function navigate(url) {
    startTransition(() => {
      // Transition type for the cause "nav forward"
      addTransitionType('nav-forward');
      go(url);
    });
  }
  function navigateBack(url) {
    startTransition(() => {
      // Transition type for the cause "nav backward"
      addTransitionType('nav-back');
      go(url);
    });
  }

  function go(url) {
    setRouterState({
      url,
      pendingNav() {
        window.history.pushState({}, "", url);
      },
    });
  }

  useEffect(() => {
    function handlePopState() {
      // This should not animate because restoration has to be synchronous.
      // Even though it's a transition.
      startTransition(() => {
        setRouterState({
          url: document.location.pathname + document.location.search,
          pendingNav() {
            // Noop. URL has already updated.
          },
        });
      });
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const pendingNav = routerState.pendingNav;
  useLayoutEffect(() => {
    pendingNav();
  }, [pendingNav]);

  return (
    <RouterContext
      value={{
        url: routerState.url,
        navigate,
        navigateBack,
        isPending,
        params: {},
      }}
    >
      {children}
    </RouterContext>
  );
}

const RouterContext = createContext({ url: "/", params: {} });

export function useRouter() {
  return use(RouterContext);
}

export function useIsNavPending() {
  return use(RouterContext).isPending;
}

```

```css src/styles.css hidden
@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Rg.woff2) format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Md.woff2) format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: Optimistic Text;
  src: url(https://react.dev/fonts/Optimistic_Text_W_Bd.woff2) format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

* {
  box-sizing: border-box;
}

html {
  background-image: url(https://react.dev/images/meta-gradient-dark.png);
  background-size: 100%;
  background-position: -100%;
  background-color: rgb(64 71 86);
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

body {
  font-family: Optimistic Text, -apple-system, ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
  padding: 10px 0 10px 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

#root {
  flex: 1 1;
  height: auto;
  background-color: #fff;
  border-radius: 10px;
  max-width: 450px;
  min-height: 600px;
  padding-bottom: 10px;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.absolute {
  position: absolute;
}

.overflow-visible {
  overflow: visible;
}

.visible {
  overflow: visible;
}

.fit {
  width: fit-content;
}


/* Layout */
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-hero {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: conic-gradient(
      from 90deg at -10% 100%,
      #2b303b 0deg,
      #2b303b 90deg,
      #16181d 1turn
  );
}

.bottom {
  flex: 1;
  overflow: auto;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 0 12px;
  top: 0;
  width: 100%;
  height: 44px;
  color: #23272f;
  font-weight: 700;
  font-size: 20px;
  z-index: 100;
  cursor: default;
}

.content {
  padding: 0 12px;
  margin-top: 4px;
}


.loader {
  color: #23272f;
  font-size: 3px;
  width: 1em;
  margin-right: 18px;
  height: 1em;
  border-radius: 50%;
  position: relative;
  text-indent: -9999em;
  animation: loading-spinner 1.3s infinite linear;
  animation-delay: 200ms;
  transform: translateZ(0);
}

@keyframes loading-spinner {
  0%,
  100% {
    box-shadow: 0 -3em 0 0.2em,
    2em -2em 0 0em, 3em 0 0 -1em,
    2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 0;
  }
  12.5% {
    box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em,
    3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  25% {
    box-shadow: 0 -3em 0 -0.5em,
    2em -2em 0 0, 3em 0 0 0.2em,
    2em 2em 0 0, 0 3em 0 -1em,
    -2em 2em 0 -1em, -3em 0 0 -1em,
    -2em -2em 0 -1em;
  }
  37.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em,
    -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  50% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em,
    -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
  }
  62.5% {
    box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0,
    -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
  }
  75% {
    box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em,
    3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
  }
  87.5% {
    box-shadow: 0em -3em 0 0, 2em -2em 0 -1em,
    3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em,
    -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
  }
}

/* LikeButton */
.like-button {
  outline-offset: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  border-radius: 9999px;
  border: none;
  outline: none 2px;
  color: #5e687e;
  background: none;
}

.like-button:focus {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
}

.like-button:active {
  color: #a6423a;
  background-color: rgba(166, 66, 58, .05);
  transform: scaleX(0.95) scaleY(0.95);
}

.like-button:hover {
  background-color: #f6f7f9;
}

.like-button.liked {
  color: #a6423a;
}

/* Icons */
@keyframes circle {
  0% {
    transform: scale(0);
    stroke-width: 16px;
  }

  50% {
    transform: scale(.5);
    stroke-width: 16px;
  }

  to {
    transform: scale(1);
    stroke-width: 0;
  }
}

.circle {
  color: rgba(166, 66, 58, .5);
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
}

.circle.liked.animate {
  animation: circle .3s forwards;
}

.heart {
  width: 1.5rem;
  height: 1.5rem;
}

.heart.liked {
  transform-origin: center;
  transition-property: all;
  transition-duration: .15s;
  transition-timing-function: cubic-bezier(.4, 0, .2, 1);
}

.heart.liked.animate {
  animation: scale .35s ease-in-out forwards;
}

.control-icon {
  color: hsla(0, 0%, 100%, .5);
  filter:  drop-shadow(0 20px 13px rgba(0, 0, 0, .03)) drop-shadow(0 8px 5px rgba(0, 0, 0, .08));
}

.chevron-left {
  margin-top: 2px;
  rotate: 90deg;
}


/* Video */
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

/* Details */
.details .thumbnail {
  position: relative;
  aspect-ratio: 16 / 9;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  outline-offset: 2px;
  width: 100%;
  vertical-align: middle;
  background-color: #ffffff;
  background-size: cover;
  user-select: none;
}

.video-details-title {
  margin-top: 8px;
}

.video-details-speaker {
  display: flex;
  gap: 8px;
  margin-top: 10px
}

.back {
  display: flex;
  align-items: center;
  margin-left: -5px;
  cursor: pointer;
}

.back:hover {
  text-decoration: underline;
}

.info-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 8px 0 0 0 ;
}

.info-description {
  margin: 8px 0 0 0;
}

.controls {
  cursor: pointer;
}

.fallback {
  background: #f6f7f8 linear-gradient(to right, #e6e6e6 5%, #cccccc 25%, #e6e6e6 35%) no-repeat;
  background-size: 800px 104px;
  display: block;
  line-height: 1.25;
  margin: 8px 0 0 0;
  border-radius: 5px;
  overflow: hidden;

  animation: 1s linear 1s infinite shimmer;
  animation-delay: 300ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}


.fallback.title {
  width: 130px;
  height: 30px;

}

.fallback.description {
  width: 150px;
  height: 21px;
}

@keyframes shimmer {
  0% {
    background-position: -468px 0;
  }

  100% {
    background-position: 468px 0;
  }
}

.search {
  margin-bottom: 10px;
}
.search-input {
  width: 100%;
  position: relative;
}

.search-icon {
  position: absolute;
  top: 0;
  bottom: 0;
  inset-inline-start: 0;
  display: flex;
  align-items: center;
  padding-inline-start: 1rem;
  pointer-events: none;
  color: #99a1b3;
}

.search-input input {
  display: flex;
  padding-inline-start: 2.75rem;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  text-align: start;
  background-color: rgb(235 236 240);
  outline: 2px solid transparent;
  cursor: pointer;
  border: none;
  align-items: center;
  color: rgb(35 39 47);
  border-radius: 9999px;
  vertical-align: middle;
  font-size: 15px;
}

.search-input input:hover, .search-input input:active {
  background-color: rgb(235 236 240/ 0.8);
  color: rgb(35 39 47/ 0.8);
}

/* Home */
.video-list {
  position: relative;
}

.video-list .videos {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  height: 100%;
}
```


```css src/animations.css
/* No additional animations needed */









/* Previously defined animations below */






/* Slide animations for Suspense the fallback down */
::view-transition-old(.slide-down) {
    animation: 150ms ease-out both fade-out, 150ms ease-out both slide-down;
}

::view-transition-new(.slide-up) {
    animation: 210ms ease-in 150ms both fade-in, 400ms ease-in both slide-up;
}

/* Animations for view transition classed added by transition type */
::view-transition-old(.slide-forward) {
    /* when sliding forward, the "old" page should slide out to left. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(.slide-forward) {
    /* when sliding forward, the "new" page should slide in from right. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}

::view-transition-old(.slide-back) {
    /* when sliding back, the "old" page should slide out to right. */
    animation: 150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-right;
}

::view-transition-new(.slide-back) {
    /* when sliding back, the "new" page should slide in from left. */
    animation: 210ms cubic-bezier(0, 0, 0.2, 1) 150ms both fade-in,
    400ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-left;
}

/* Keyframes to support our animations above. */
@keyframes slide-up {
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slide-down {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(10px);
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}

@keyframes slide-to-right {
    to {
        transform: translateX(50px);
    }
}

@keyframes slide-from-right {
    from {
        transform: translateX(50px);
    }
    to {
        transform: translateX(0);
    }
}

@keyframes slide-to-left {
    to {
        transform: translateX(-50px);
    }
}

@keyframes slide-from-left {
    from {
        transform: translateX(-50px);
    }
    to {
        transform: translateX(0);
    }
}

/* Default .slow-fade. */
::view-transition-old(.slow-fade) {
    animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
    animation-duration: 500ms;
}
```

```js src/index.js hidden
import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';
import './animations.css';

import App from './App';
import {Router} from './router';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "latest"
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

### Activity によるサーバサイドレンダリング {/*server-side-rendering-with-activity*/}

サーバサイドレンダリング (server-side rendering; SSR) を使用するページで Activity を使用する場合、追加の最適化が行われます。

ページの一部が `mode="hidden"` でレンダーされる場合、それは SSR のレスポンスに含まれません。代わりに React は、画面上の可視コンテンツのハイドレーションを優先しつつ、Activity 内のコンテンツのクライアントレンダーをスケジュールします。

UI の一部が `mode="visible"` でレンダーされる場合、React は Activity 内のコンテンツのハイドレーションを、優先度を下げて行います。これは、サスペンスのコンテンツが低い優先度でハイドレーションされるのと似ています。ユーザがページを操作した場合は、必要に応じてサスペンスバウンダリのハイドレーションを優先します。

これらは高度なユースケースですが、Activity を使用することで得られる可能性がある追加の利点となっています。

### 将来の Activity モード {/*future-modes-for-activity*/}

将来的には、Activity にさらに多くのモードを追加するかもしれません。

たとえば、一般的なユースケースはモーダルのレンダーです。「アクティブ」なモーダルビューの背後に、「非アクティブ」なページが表示され続けます。このケースで "hidden" モードを使うと、表示自体がされず SSR にも含まれないことになるため、うまくいきません。

代わりに、コンテンツを表示したままにして SSR にも含めるが、アンマウント状態に保って更新の優先度を下げる、という新しいモードを検討しています。モーダルが開いている間に背後のコンテンツが更新されると気が散るため、このモードでは DOM の更新を「一時停止」するようにするかもしれません。

Activity の別のモードとして我々が考慮しているのは、メモリ使用量が多すぎる場合に非表示の Activity の state を自動的に破棄する機能です。コンポーネントはすでにアンマウントされているため、アプリの非表示の部分のうち最近使用されていない部分から state を破棄していくことは、リソースを過剰に消費するよりも好ましいかもしれません。

これらはまだ探求中の領域であり、進展があれば共有します。現段階で Activity に含まれている機能の詳細は、[ドキュメントをチェックしてください](/reference/react/Activity)。

---

# 開発中の機能 {/*features-in-development*/}

他にも、一般的な問題を解決するために、以下のような機能を開発中です。

考えうるソリューションを私たちが検討していく中で、マージ予定の PR 内でテスト中の API 候補が共有されることがあります。様々なアイデアが試された後に、これらのソリューションは変更されたり削除されたりすることがよくあることをご承知おきください。

私たちが取り組んでいるソリューションが時期尚早に共有されると、コミュニティに混乱を招く可能性があります。透明性を保ちつつ混乱を最小限に抑えるために、私たちは現在解決法を開発しようとしている問題点については共有しますが、具体的なソリューションについては共有しないこととします。

これらの機能に進捗があれば、ブログでの発表とドキュメントの公開を行い、試していただけるようになる予定です。

## React パフォーマンストラック {/*react-performance-tracks*/}

現在、ブラウザ API を使用してパフォーマンスプロファイラに[カスタムのトラック (track) を追加](https://developer.chrome.com/docs/devtools/performance/extension)できる機能を開発しており、これにより React アプリケーションのパフォーマンスに関するより多くの情報を提供できるようになります。

この機能はまだ開発中でありドキュメントの準備が整っていないため、実験的機能として完全にリリースできてはいません。ですが React の実験的バージョンを使用すれば、パフォーマンストラックが自動的にプロファイルに追加されるため、一足早く試すことが可能です。

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

対応予定の既知の問題がいくつか存在しています。例えば、パフォーマンスに関する問題や、スケジューラーのトラックがサスペンドされたツリー間で作業を「接続」できない場合がある、といった問題です。そのため、まだ試せる段階にはありません。また、トラックのデザインと使いやすさを改善するために、初期ユーザからのフィードバックを収集している最中です。

これらの問題を解決後に、実験的機能としてドキュメントを公開し、試す準備が整ったことをお知らせする予定です。

---

## エフェクト依存配列の自動化 {/*automatic-effect-dependencies*/}

フックをリリースしたとき、私たちには 3 つの動機がありました。

- **コンポーネント間でのコード共有**：フックがレンダープロップや高階コンポーネントといったパターンを置き換えたことで、コンポーネントの階層構造を変更せずにステートフルなロジックを再利用できるようになりました。
- **ライフサイクルではなく関数指向で考える**：フックのおかげで、1 つのコンポーネントを、ライフサイクルメソッドに基づいて無理矢理分割するのではなく、コードの意味的な関連性（サブスクリプションの設定やデータフェッチ）に基づいて小さな関数へと分割できるようになりました。
- **事前コンパイルのサポート**：フックは、事前コンパイルをサポートし、ライフサイクルメソッドやクラスの制限によって引き起こされる最適化漏れといった落とし穴を減らせるように設計されました。

リリース以来、フックは*コンポーネント間でのコード共有*という点では成功しています。フックは、コンポーネント間でロジックを共有するための望ましい方法となり、レンダープロップや高階コンポーネントの使用例は減少しています。フックはまた、クラスコンポーネントでは不可能だった Fast Refresh のような機能をサポートすることにも成功しています。

### エフェクトは難しい {/*effects-can-be-hard*/}

残念ながら一部のフックは、ライフサイクルではなく関数の観点で考えることがいまだに困難です。特にエフェクトは理解しにくく、この辛さは開発者から最もよく聞かれるところとなっています。昨年私たちは、エフェクトの使われ方や、エフェクトのユースケースを簡素化し理解しやすくするための方法について、多くの時間を費やし研究を行いました。

多くの場合に混乱の原因は、必要もなくエフェクトが使われていることにあるとわかりました。[そのエフェクトは不要かも](/learn/you-might-not-need-an-effect)のガイドは、エフェクトがソリューションとして適切ではないパターンの多くをカバーしています。しかし、ある問題に対してエフェクトが適切であるという場合ですら、エフェクトはクラスコンポーネントのライフサイクルよりも理解しにくい場合があります。

混乱の一因は、開発者がエフェクトをエフェクト自体の視点（エフェクトが何をするか）ではなく、ライフサイクルのような*コンポーネント*の視点から考えてしまっていることにあると考えています。

[ドキュメントにあるこちらの例](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)を見てみましょう。

```js
useEffect(() => {
  // Your Effect connected to the room specified with roomId...
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    // ...until it disconnected
    connection.disconnect();
  };
}, [roomId]);
```

多くのユーザはこのコードを「マウント時に `roomId` に接続し、`roomId` が変更されるたびに古いルームから切断して接続を再確立する」のように解釈してしまいます。しかし、このようにコンポーネントのライフサイクルの視点で考えると、エフェクトを正しく書くにはコンポーネントライフサイクルの全状態を考慮する必要があることになってしまいます。これは難しいことなので、コンポーネント視点だとクラスのライフサイクルよりもエフェクトの方が難しく見えるのは、無理もないことです。

### 依存配列のないエフェクト {/*effects-without-dependencies*/}

代わりに、エフェクトの視点から考える方がベターです。エフェクトはコンポーネントのライフサイクルについて知りません。同期を開始する方法と停止する方法が記述されているだけです。ユーザがこのようにエフェクトを考えることでエフェクトは書きやすくなり、必要次第で何度も開始・停止されることに対して、より頑強になります。

私たちは、エフェクトをコンポーネントの視点から考えてしまう理由について時間をかけて調査し、その一因が依存配列にあると考えるようになりました。常に目の前にあって書かなければならないもののため、コードが何に「反応」しているのかを意識せざるを得ず、だから「これらの値が変わったらこれを行え」式のメンタルモデルに誘い込まれてしまうのです。

フックをリリースした当時から、事前コンパイルでこの使いやすさを改善できることは分かっていました。React Compiler を使用すると、ほとんどの場合、自分で `useCallback` や `useMemo` を書く必要がなくなります。エフェクトの場合、コンパイラが依存配列を自動的に挿入できるようになります。

```js
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect();
  };
}); // compiler inserted dependencies.
```

このコードでは、依存配列を React Compiler が自動的に推論して挿入するため、見たり書いたりする必要がありません。[IDE 拡張](#compiler-ide-extension)や [`useEffectEvent`](/reference/react/useEffectEvent) のような機能を使用することで、デバッグが必要なときや依存値を削除して最適化したい時のために、コンパイラが挿入したものを表示する CodeLens を提供できます。これにより、エフェクトを書くための正しいメンタルモデル、つまり、エフェクトはコンポーネントやフックの state を他のものと同期させるためにいつでも実行されうる、というメンタルモデルが補強されます。

依存配列の自動挿入について我々が期待しているのは、ただ書きやすくなるというだけのことではありません。コンポーネントのライフサイクルではなく「エフェクトが何をするのか」という視点で考えることを強制し、理解がしやすくなることを期待しています。

---

## コンパイラの IDE 拡張 {/*compiler-ide-extension*/}

2025 年に React Compiler の最初の安定版を[共有しました](/blog/2025/10/07/react-compiler-1)。今後もさらに改善を続けていく予定です。

また、React Compiler を使用してコードの理解やデバッグ体験を改善するための情報を提供する方法を模索し始めました。私たちが探求し始めたアイデアのひとつは、[Lauren Tan の React Conf での講演](https://conf2024.react.dev/talks/5)で使用された拡張に似た、React Compiler によって駆動される新しい実験的な LSP ベースの React IDE 拡張です。

考え方としては、IDE 内で情報やサジェスチョン、最適化候補を直接表示するために、コンパイラの静的解析を活用する、というものです。たとえば、React のルールに違反しているコードに対する診断、コンポーネントやフックがコンパイラによって最適化されたかどうかを示すホバー、または[自動挿入されたエフェクトの依存配列](#automatic-effect-dependencies)を表示する CodeLens といったものを提供できます。

IDE 拡張はまだ初期の探求段階ですが、今後の更新で進捗を共有していきます。

---

## フラグメント ref {/*fragment-refs*/}

イベント管理、位置決め、フォーカスのために使われる DOM API の多くは、React ではうまく組み合わせて書くことが困難です。このため開発者はよく、エフェクトを使用したり、複数の ref を取り回したり、React 19 で削除された `findDOMNode` のような API を使用したりしています。

フラグメントに ref を追加し、単一の DOM 要素ではなく DOM 要素のグループを参照できるようにすることを検討しています。これにより、複数の子を管理することが簡単になり、DOM API を呼び出すときにより組み合わせしやすい React コードが書きやすくなることを期待しています。

フラグメント ref はまだ研究中です。最終的な API が完成に近づいたらお知らせします。

---

## ジェスチャーアニメーション {/*gesture-animations*/}

ビュー遷移機能を強化して、メニューをスワイプして開く、またはフォトカルーセルをスクロールする、といったジェスチャーアニメーションをサポートする方法についても研究しています。

ジェスチャーには以下のような幾つかの新たな課題があります。

- **ジェスチャーは連続的**：スワイプの最中、アニメーションはユーザの指の位置と結びついており、起動したらただ最後まで再生されるというわけではありません。
- **ジェスチャーは完了しない場合がある**：指を離した際にジェスチャーアニメーションは最後まで再生されるかもしれませんが、進んだ距離によっては元の状態に戻る（メニューを少しだけ開いた際のように）かもしれません。
- **ジェスチャーでは「新」と「旧」が逆**：アニメーション中は、アニメーション元のページを「生きた」状態でインタラクティブに保ちたいはずです。ブラウザのビュー遷移モデルでは「古い」状態がスナップショットで「新しい」状態が生きた DOM ですので、動作が逆転しています。

私たちはうまく機能するアプローチを発見できたと考えているため、ジェスチャー遷移をトリガする新しい API を導入するかもしれません。今のところは `<ViewTransition>` のリリースに集中していますが、その後にジェスチャーを再検討する予定です。

---

## 並行ストア {/*concurrent-stores*/}

React 18 を並行レンダー (concurrent rendering) 機能と共にリリースした際、`useSyncExternalStore` もリリースしました。これによって、React の state やコンテクストを使用しない外部ストアライブラリは、当該ストアが更新されたときに同期レンダーを強制することで、[並列レンダーをサポート](https://github.com/reactwg/react-18/discussions/70)できるようになりました。

しかし `useSyncExternalStore` の使用にはコストが伴います。トランジションのような並行レンダー機能からの離脱を強制し、既存のコンテンツにサスペンスのフォールバックを表示させてしまうからです。

React 19 がリリースされましたので、`use` API を使用して並行レンダー対応の外部ストアを完全にサポートするプリミティブを作成できないか、この問題領域について再検討を行っています。

```js
const value = use(store);
```

私たちの目標は、外部の状態を、レンダー中に不整合 (tearing) を起こさず読み取ることができ、React が提供するすべての並行レンダー機能とシームレスに連携できるようにすることです。

この研究はまだ初期段階です。進展があれば、どのような新しい API になるかを共有する予定です。

---

_この投稿をレビューしていただいた [Aurora Scharff](https://bsky.app/profile/aurorascharff.no), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Eli White](https://twitter.com/Eli_White), [Lauren Tan](https://bsky.app/profile/no.lol), [Luna Wei](https://github.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Jack Pope](https://jackpope.me), [Jason Bonta](https://threads.net/someextent), [Jordan Brown](https://github.com/jbrown215), [Jordan Eldredge](https://bsky.app/profile/capt.dev), [Mofei Zhang](https://threads.net/z_mofei), [Sebastien Lorber](https://bsky.app/profile/sebastienlorber.com), [Sebastian Markbåge](https://bsky.app/profile/sebmarkbage.calyptus.eu), [Tim Yung](https://github.com/yungsters) に感謝します。_
