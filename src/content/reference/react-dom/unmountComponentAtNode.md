---
title: unmountComponentAtNode
---

<Deprecated>

この API は、将来の React のメジャーバージョンで削除されます。

React 18 では、`unmountComponentAtNode` は [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) に置き換えられました。

</Deprecated>

<Intro>

`unmountComponentAtNode` は、マウントされた React コンポーネントを DOM から削除します。

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

`unmountComponentAtNode` を呼び出して、マウントされた React コンポーネントを DOM から削除し、そのイベントハンドラと state をクリーンアップします。

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `domNode`: [DOM 要素](https://developer.mozilla.org/en-US/docs/Web/API/Element)。React はこの要素からマウント済みの React コンポーネントを削除します。

#### 返り値 {/*returns*/}

`unmountComponentAtNode` は、コンポーネントがアンマウントされた場合は `true` を、そうでない場合は `false` を返します。

---

## 使用法 {/*usage*/}

`unmountComponentAtNode` を呼び出して、<CodeStep step={1}>マウントされた React コンポーネント</CodeStep>を <CodeStep step={2}>ブラウザの DOM ノード</CodeStep>から削除し、そのイベントハンドラと state をクリーンアップします。

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### DOM 要素から React アプリを削除する {/*removing-a-react-app-from-a-dom-element*/}

ときに、既存のページや、完全に React で書かれていないページに、React を「散りばめる」ことがあります。そのような場合、アプリがレンダーされた DOM ノードから UI、state、リスナをすべて削除して React アプリを「停止」する必要があるかもしれません。

以下の例では、"Render React App" をクリックすると React アプリがレンダーされます。"Unmount React App" をクリックするとそれが破棄されます。

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>
