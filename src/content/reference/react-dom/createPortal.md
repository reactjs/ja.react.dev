---
title: createPortal
---

<Intro>

`createPortal` を使うことで、DOM 上の別の場所に子要素をレンダーすることができます。


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

ポータルを作成するには、`createPortal` を呼び出し、JSX とそれをレンダーする先の DOM ノードを渡します。

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[さらに例を見る](#usage)

ポータルは DOM ノードの物理的な配置だけを変更します。それ以外のすべての点で、ポータルにレンダーする JSX は、レンダー元の React コンポーネントの子ノードとして機能します。例えば、子は親ツリーが提供するコンテクストにアクセスでき、イベントは React ツリーに従って子から親へとバブルアップします。

#### 引数 {/*parameters*/}

* `children`: React でレンダーできるあらゆるもの、例えば JSX（`<div />` や `<SomeComponent />` など）、[フラグメント](/reference/react/Fragment) (`<>...</>`)、文字列や数値、またはこれらの配列。 

* `domNode`: `document.getElementById()` によって返されるような DOM ノード。ノードはすでに存在している必要があります。更新中に異なる DOM ノードを渡すと、ポータルの内容が再作成されます。

* **省略可能** `key`: ポータルの [key](/learn/rendering-lists/#keeping-list-items-in-order-with-key) として使用される一意の文字列または数値。

#### 返り値 {/*returns*/}

`createPortal` は、JSX に含めたり React コンポーネントから返したりすることができる React ノードを返します。React がレンダー出力内でそのようなものを検出すると、渡された `children` を渡された `domNode` の内部に配置します。

#### 注意点 {/*caveats*/}

* ポータルからのイベントは、DOM ツリーではなく React ツリーに沿って伝播します。例えば、ポータル内部でクリックが起き、ポータルが `<div onClick>` でラップされている場合、その `onClick` ハンドラが発火します。これが問題を引き起こす場合、ポータル内部からイベント伝播を停止するか、ポータル自体を React ツリー内で上に移動します。

---

## 使用法 {/*usage*/}

### DOM 内の別部分へのレンダー {/*rendering-to-a-different-part-of-the-dom*/}

*ポータル*により、コンポーネントが子の一部を DOM 内の別の場所にレンダーできるようになります。これにより、コンポーネントの出力の一部を、自身の含まれているコンテナの外に「脱出」させることが可能です。例えばコンポーネントから、ページの他の要素の上部や外部に表示されるモーダルダイアログやツールチップを表示することができます。

ポータルを作成するには、<CodeStep step={1}>何らかの JSX</CodeStep> と <CodeStep step={2}>行き先の DOM ノード</CodeStep> を渡した `createPortal` の呼び出し結果をレンダーします。

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React は、<CodeStep step={1}>渡した JSX</CodeStep> に対応する DOM ノードを <CodeStep step={2}>渡した DOM ノード</CodeStep> の内部に配置します。

ポータルがなければ 2 つ目の `<p>` は親の `<div>` の内部に配置されますが、ポータルはそれを [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) に「テレポート」させます。

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

2 つ目の段落が親の `<div>` の境界線の外側に表示されていることに注意してください。開発者ツールで DOM 構造を調べると、2 つ目の `<p>` が直接 `<body>` に配置されていることがわかります。

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

ポータルは DOM ノードの物理的な配置だけを変更します。それ以外のすべての点で、ポータルにレンダーする JSX は、レンダー元の React コンポーネントの子ノードとして機能します。例えば、子は親ツリーが提供するコンテクストにアクセスでき、イベントは React ツリーに従って子から親へとバブルアップします。

---

### ポータルを使ったモーダルダイアログのレンダー {/*rendering-a-modal-dialog-with-a-portal*/}

ポータルを使用して、ページ内の他の要素上に浮かんで表示されるモーダルダイアログを作成することができます。ダイアログを呼び出すコンポーネントが `overflow: hidden` やダイアログに干渉する他のスタイルを持つコンテナ内にあっても問題ありません。

この例では、2 つのコンテナはモーダルダイアログの表示を妨げるようなスタイルを持っていますが、ポータルを使ってレンダーされた方は影響を受けていません。DOM 内ではモーダルは親 JSX 要素の中に含まれていないからです。

<Sandpack>

```js App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

ポータルを使用する際には、アプリを正しくアクセシブルにすることが重要です。例えば、ユーザが自然にポータルの内または外へフォーカスを移動できるよう、キーボードフォーカスを管理する必要があるかもしれません。

モーダルを作成する際には、[WAI-ARIA のモーダル作成実践ガイド](https://www.w3.org/WAI/ARIA/apg/#dialog_modal)に従ってください。コミュニティパッケージを使用する場合は、それがアクセシブルであり、このガイドラインに従っていることを確認してください。

</Pitfall>

---

### 非 React のサーバマークアップに React コンポーネントをレンダー {/*rendering-react-components-into-non-react-server-markup*/}

React で構築されていない静的ページあるいはサーバレンダーされたページの一部に React ルートがある場合にも、ポータルは有用です。例えば、ページが Rails のようなサーバフレームワークで構築されている場合、サイドバーなどの静的な部位の内部に操作可能なエリアを作成することができます。[別々の React ルート](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)を複数用いる場合と異なり、ポータルを使うとアプリを単一の React ツリーとして扱うことができ、部位ごとに DOM 内の異なる場所にレンダーさせつつも state を共有可能です。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### 非 React DOM ノードに React コンポーネントをレンダー {/*rendering-react-components-into-non-react-dom-nodes*/}

React 外で管理されている DOM ノードの内容を管理するためにポータルを使用することもできます。例えば、非 React のマップウィジェットと統合していて、ポップアップ内に React のコンテンツをレンダーしたいとします。これを行うには、レンダーする DOM ノードを格納するための `popupContainer` state 変数を宣言します。

```js
const [popupContainer, setPopupContainer] = useState(null);
```

サードパーティのウィジェットを作成する際に、ウィジェットが返す DOM ノードを格納しておき、その内部にレンダーが行えるようにします。

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

このようにしておけば、`popupContainer` が利用可能になったところでその中に `createPortal` を使って React コンテンツをレンダーすることができるようになります。

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

以下に、試してみることができる完全な例を示します。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
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
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
