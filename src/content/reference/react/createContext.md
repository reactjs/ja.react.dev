---
title: createContext
---

<Intro>

`createContext` は、コンポーネントが提供または読み取りできる[コンテクスト](/learn/passing-data-deeply-with-context)を作成するための関数です。

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

`createContext` をコンポーネントの外部で呼び出してコンテクストを作成します。

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `defaultValue`: コンポーネントがコンテクストを読み取るときに、その上のツリー内で対応するコンテクストプロバイダがない場合にコンテクストが持つ値です。デフォルト値が必要ない場合は `null` を指定します。デフォルト値は「最後の手段」として使われるように意図されています。これは静的な値であり、時間が経過しても変化しません。

#### 返り値 {/*returns*/}

`createContext` はコンテクストオブジェクトを返します。

**コンテクストオブジェクト自体は情報を持っていません**。他のコンポーネントが*どの*コンテクストを読み取るか、または提供するかを表します。通常、上位のコンポーネントで [`SomeContext.Provider`](#provider) を使用してコンテクストの値を指定し、下位のコンポーネントで [`useContext(SomeContext)`](/reference/react/useContext) を呼び出してコンテクストを読み取ります。コンテクストオブジェクトにはいくつかのプロパティがあります：

* `SomeContext.Provider` では、コンポーネントにコンテクストの値を提供できます。
* `SomeContext.Consumer` は、コンテクストの値を読み取るための方法ですが、あまり使用されません。

---

### `SomeContext.Provider` {/*provider*/}

コンポーネントをコンテクストプロバイダでラップすると、内部のコンポーネントに対してこのコンテクストの値を指定できます。

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### props {/*provider-props*/}

* `value`: このプロバイダの内側（深さに関わらず）にあるコンポーネントがコンテクストを読み取る際に、渡したい値です。コンテクストの値は任意の型にすることができます。プロバイダ内で [`useContext(SomeContext)`](/reference/react/useContext) を呼び出しているコンポーネントは、それより上位かつ最も内側にある対応するコンテクストプロバイダの `value` を受け取ります。

---

### `SomeContext.Consumer` {/*consumer*/}

`useContext` が存在する前には、コンテクストを読み取る古い方法がありました：

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

この古い方法はまだ動作しますが、**新しく書かれたコードは [`useContext()`](/reference/react/useContext) を使ってコンテクストを読み取るべきです：**

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### props {/*consumer-props*/}

* `children`: 関数です。React は、[`useContext()`](/reference/react/useContext) と同じアルゴリズムによって定まる現在のコンテクスト値で関数を呼び出し、その関数から返される結果をレンダーします。親コンポーネントからのコンテクストが変更されると、React はこの関数を再実行し、UI を更新します。

---

## 使用法 {/*usage*/}

### コンテクストの作成 {/*creating-context*/}

コンテクストを利用することで、明示的に props を渡さずに、コンポーネントに[深くまで情報を渡す](/learn/passing-data-deeply-with-context)ことができます。

コンポーネントの外部で `createContext` を呼び出して、コンテクストを 1 つまたは複数個作成します。

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` は<CodeStep step={1}>コンテクストオブジェクト</CodeStep>を返します。それを [`useContext()`](/reference/react/useContext) に渡すことで、コンポーネントからコンテクストを読み取ることができます：

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

デフォルトでは、コンポーネントが受け取る値は、コンテクストを作成するときに指定した<CodeStep step={3}>デフォルトの値</CodeStep>になります。しかし、デフォルトの値は決して変わらないため、これ自体では役に立ちませんね。

コンテクストが便利なのは、**コンポーネントから動的な値を提供できる**からです：

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

これで、`Page` コンポーネントとその内部のすべてのコンポーネントは、どんなに深くても、渡されたコンテクストの値を「見る」ことができます。渡されたコンテクストの値が変更されると、React はコンテクストを読み取るコンポーネントを再レンダーします。

[コンテクストの読み取りと提供、例についてさらに読む](/reference/react/useContext)

---

### ファイルからのコンテクストのインポートとエクスポート {/*importing-and-exporting-context-from-a-file*/}

異なるファイルにあるコンポーネントが同じコンテクストにアクセスする必要があることがよくあります。そのため、一般的には別ファイルでコンテクストを宣言します。他のファイルでコンテクストを利用できるようにするために、[`export` 文](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)を使用できます：

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

他のファイルで宣言されたコンポーネントは、[`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) 文を使用して、このコンテクストを読み取ったり、提供したりすることができます：

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

これは[コンポーネントのインポートとエクスポート](/learn/importing-and-exporting-components)と同様に動作します。

---

## トラブルシューティング {/*troubleshooting*/}

### コンテクストの値を変更する方法が見つからない {/*i-cant-find-a-way-to-change-the-context-value*/}


このようなコードは*デフォルト*のコンテクストの値を指定します：

```js
const ThemeContext = createContext('light');
```

この値は決して変わりません。React は、対応するプロバイダを上位のコンポーネントで見つけられない場合にのみ、この値をフォールバックとして使用します。

コンテクストを時間の経過とともに変化させるには、[state を追加し、コンポーネントをコンテクストプロバイダでラップ](/reference/react/useContext#updating-data-passed-via-context)します。

