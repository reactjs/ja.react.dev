---
title: createFactory
---

<Deprecated>

この API は、将来の React のメジャーバージョンで削除される予定です。[代替手段についてはこちらをご覧ください](#alternatives)。

</Deprecated>

<Intro>

`createFactory` は、指定したタイプの React 要素を生成するための関数を作成します。

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

`createFactory(type)` を呼び出して、指定した `type` の React 要素を生成するためのファクトリ関数を作成します。

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

この後、JSX を使わずに React 要素を作成することができます。

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `type`: `type` 引数は有効な React のコンポーネントタイプでなければなりません。例えば、タグ名の文字列（`'div'` や `'span'`）や、React コンポーネント（関数、クラス、または [`Fragment`](/reference/react/Fragment) のような特別なコンポーネント）が該当します。

#### 返り値 {/*returns*/}

ファクトリ関数を返します。そのファクトリ関数は、最初の引数として `props` オブジェクトを受け取り、その後に `...children` 引数のリストを受け取り、指定した `type`、`props`、`children` を持った React 要素を返します。

---

## 使用法 {/*usage*/}

### ファクトリ関数を使って React 要素を作成する {/*creating-react-elements-with-a-factory*/}

ほとんどの React プロジェクトではユーザインターフェースを記述するために [JSX](/learn/writing-markup-with-jsx) を使用していますが、JSX は必須ではありません。過去には `createFactory` が、JSX を使わずにユーザインターフェースを記述するための方法のひとつでした。

`createFactory` を呼び出して、`'button'` のような特定の要素タイプの*ファクトリ関数*を作成します。

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

そのファクトリ関数を呼び出すと、指定した props と children を持つ React 要素が生成されます。

<Sandpack>

```js App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

このようにして `createFactory` が JSX の代替として使用されていました。しかし、`createFactory` は非推奨であり、新しいコードでは `createFactory` を呼び出すべきではありません。`createFactory` から移行する方法については下記をご覧ください。

---

## 代替手段 {/*alternatives*/}

### `createFactory` をプロジェクトにコピーする {/*copying-createfactory-into-your-project*/}

プロジェクト内で多くの `createFactory` 呼び出しがある場合は、この `createFactory.js` の実装をプロジェクトにコピーします：

<Sandpack>

```js App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

```js createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

これにより、インポートを除くすべてのコードを変更せずに保持できます。

---

### `createFactory` を `createElement` に置き換える {/*replacing-createfactory-with-createelement*/}

少数の `createFactory` の呼び出しがあり手動で移植しても構わず、かつ JSX を使用したくない、という場合、ファクトリ関数のすべての呼び出しを [`createElement`](/reference/react/createElement) の呼び出しに置き換えることができます。例えば以下のコードは：

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

以下のコードに置き換えが可能です：


```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

以下は、JSX を使用せずに React を使用する完全な例です。

<Sandpack>

```js App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Clicked!')
    }
  }, 'Click me');
}
```

</Sandpack>

---

### `createFactory` を JSX に置き換える {/*replacing-createfactory-with-jsx*/}

最後に、`createFactory` の代わりに JSX を使用することができます。これが React を使用する最も一般的な方法です。

<Sandpack>

```js App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Clicked!');
    }}>
      Click me
    </button>
  );
};
```

</Sandpack>

<Pitfall>

既存のコードには、`'button'` のような定数ではなく変数を用いて `type` を指定するものがあるかもしれません。

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

JSX で同じことをする場合、変数の名前を `Type` のように大文字で始まるように変更する必要があります。

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

さもないと、React は `<type>` を（小文字なので）組み込みの HTML タグと解釈してしまいます。

</Pitfall>
