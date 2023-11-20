---
title: TypeScript の使用
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript は JavaScript コードベースに型定義を追加するための人気の方法です。TypeScript は標準で [JSX をサポート](/learn/writing-markup-with-jsx)しており、プロジェクトに [`@types/react`](https://www.npmjs.com/package/@types/react) と [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) を追加することで、React Web に対する完全なサポートを得ることができます。

</Intro>

<YouWillLearn>

* [TypeScript で React コンポーネントを書く方法](/learn/typescript#typescript-with-react-components)
* [フックの型付けの例](/learn/typescript#example-hooks)
* [`@types/react` にある一般的な型](/learn/typescript/#useful-types)
* [さらに学習するためのリソース](/learn/typescript/#further-learning)

</YouWillLearn>

## インストール {/*installation*/}

すべての[本番環境向け React フレームワーク](/learn/start-a-new-react-project#production-grade-react-frameworks)は TypeScript の使用をサポートしています。フレームワーク個別のガイドに従ってインストールを行ってください。

- [Next.js](https://nextjs.org/docs/pages/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### 既存の React プロジェクトに TypeScript を追加する {/*adding-typescript-to-an-existing-react-project*/}

React の型定義の最新バージョンをインストールするには以下のようにします。

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

`tsconfig.json` で以下のコンパイラオプションを設定する必要があります。

1. [`lib`](https://www.typescriptlang.org/tsconfig/#lib) に `dom` が含まれていなければなりません（注：`lib` オプションが指定されない場合、`dom` はデフォルトで含まれます）。
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) を有効なオプションのいずれかに設定する必要があります。ほとんどのアプリケーションでは `preserve` で上手くいきます。
  ライブラリを公開する場合は、選択すべき値について [`jsx` のドキュメンテーション](https://www.typescriptlang.org/tsconfig/#jsx)を参照してください。

## TypeScript で React コンポーネントを書く方法 {/*typescript-with-react-components*/}

<Note>

JSX を含むファイルはすべて `.tsx` というファイル拡張子を使用しなければなりません。これは TypeScript 固有の拡張子であり、ファイルに JSX が含まれていることを TypeScript に伝えるためのものです。

</Note>

TypeScript で React を書くことは、JavaScript で React を書くことに非常に似ています。コンポーネントを扱う際の主な違いは、コンポーネントの props に対して型が指定できることです。これらの型は、正確性チェックと、エディタ内でのインラインドキュメンテーションの表示に使用できます。

[クイックスタート](/learn)ガイドの [`MyButton` コンポーネント](/learn#components)を例にすると、ボタンの `title` に型を追加する方法は以下のようになります。

<Sandpack>

```tsx App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a button" />
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

上記のサンドボックスは TypeScript のコードを扱うことができますが、型チェッカは実行されません。つまりこの TypeScript サンドボックスを書き換えて学習することはできますが、型エラーや警告は得られないということです。型チェックが必要な場合は、[TypeScript Playground](https://www.typescriptlang.org/play) を使用するか、より完全な機能を備えたオンラインサンドボックスを使用してください。

</Note>

このインライン形式の構文は、コンポーネントに対して型を指定する最も簡単な方法ですが、記述するフィールドが複数あるときには扱いにくくなることがあります。代わりに、コンポーネントの props を記述するために `interface` または `type` を使用することができます。

<Sandpack>

```tsx App.tsx active
interface MyButtonProps {
  /** The text to display inside the button */
  title: string;
  /** Whether the button can be interacted with */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton title="I'm a disabled button" disabled={true}/>
    </div>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

コンポーネントの props を記述する型は、必要に応じて単純なものでも複雑なものでも構いませんが、`type` または `interface` で記述されたオブジェクト型であるべきです。TypeScript でのオブジェクトの記述方法については[オブジェクト型](https://www.typescriptlang.org/docs/handbook/2/objects.html)で学ぶことができます。いくつかの異なる型のうちの 1 つの型になる props を記述するための[ユニオン型](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)や、より高度な使用例である [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) ガイドも参照してください。


## 例：フック {/*example-hooks*/}

`@types/react` にある型定義には、組み込みのフックに対する型が含まれており、追加のセットアップなしにあなたのコンポーネント内で使用することができます。これらはあなたがコンポーネントに書くコードを考慮できるように作られており、多くの場合は[型の推論](https://www.typescriptlang.org/docs/handbook/type-inference.html)が働くため、理想的にはこまごまと型の指定を行う必要がないようになっています。

とはいえ、フックの型をどのように指定するかについて、ここでいくつかの例を見ておきましょう。

### `useState` {/*typing-usestate*/}

[`useState` フック](/reference/react/useState)は、初期 state として渡された値を利用して、その値の型が何であるべきかを決定します。例えば：

```ts
// Infer the type as "boolean"
const [enabled, setEnabled] = useState(false);
```

これで `enabled` に `boolean` 型が割り当てられ、また `setEnabled` は引数として `boolean` 値または `boolean` を返す関数を受け取る関数になります。state の型を明示的に指定したい場合は、`useState` の呼び出しに型引数を渡すことで行えます。

```ts 
// Explicitly set the type to "boolean"
const [enabled, setEnabled] = useState<boolean>(false);
```

上記の例ではあまりこうする意義はありませんが、明示的に型を指定したい一般的なケースとして、ユニオン型を持たせたい場合があります。例えば、以下では `status` はいくつかの異なる文字列のいずれかになります。

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

または、[state の構造化の原則](/learn/choosing-the-state-structure#principles-for-structuring-state)で推奨されているように、関連する state をオブジェクトとしてグループ化し、オブジェクト型を介して可能性のある状態を記述することができます。

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` フック](/reference/react/useReducer) は、リデューサ関数と初期 state を受け取る、より複雑なフックです。リデューサ関数の型は初期 state から推論されます。`useReducer` の呼び出しに型引数を含めることで state の型を指定することもできますが、通常は代わりに初期 state 自体に型を指定する方が良いでしょう。

<Sandpack>

```tsx App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Welcome to my counter</h1>

      <p>Count: {state.count}</p>
      <button onClick={addFive}>Add 5</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>


ここではいくつかの重要な場所で TypeScript が使用されています。

 - `interface State` でリデューサの state の型を指定する。
 - `type CounterAction` でリデューサにディスパッチできる各種のアクションを記述する。
 - `const initialState: State` で初期 state の型、およびデフォルトで `useReducer` によって使用される型を指定する。
 - `stateReducer(state: State, action: CounterAction): State` でリデューサ関数の引数と返り値の型を指定する。

`initialState` に型を指定するよりも明示的な代替手段として、`useReducer` に型引数を渡すこともできます。

```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` フック](/reference/react/useContext)は、props を使って多数のコンポーネントを経由させることなく、コンポーネントツリーを通じてデータを下に渡すための技術です。使用するにはプロバイダコンポーネントを作成し、多くの場合は子コンポーネントで値を受け取るためのフックを用います。

コンテクストが提供する値の型は、`createContext` の呼び出しに渡す値から推論されます。

<Sandpack>

```tsx App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
    </div>
  )
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

意味のあるデフォルト値が存在する場合にはこれでうまくいきます。しかし時にはそうではない場合もあり、デフォルト値として `null` が適切に感じられることもあるでしょう。型システムにあなたのコードを理解させるため、`createContext` 呼び出しで `ContextShape | null` と明示的に指定する必要があります。

これにより、コンテクストを利用する側で `| null` の可能性を排除する必要が生じます。お勧めの方法は、値が存在することをフックで実行時にチェックし、存在しない場合にエラーをスローするようにすることです。

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// This is a simpler example, but you can imagine a more complex object here
type ComplexObject = {
  kind: string
};

// The context is created with `| null` in the type, to accurately reflect the default value.
const Context = createContext<ComplexObject | null>(null);

// The `| null` will be removed via the check in the Hook.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Current object: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

[`useMemo`](/reference/react/useMemo) フックは、関数呼び出しからの値の作成/再アクセスを行い、2 番目の引数として渡された依存配列が変更されたときにのみ関数を再実行します。フックの呼び出し結果の型は、1 番目の引数として指定した関数の返り値の型から推論されます。フックに型引数を指定することで明示的にすることができます。

```ts
// The type of visibleTodos is inferred from the return value of filterTodos
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```


### `useCallback` {/*typing-usecallback*/}

[`useCallback`](/reference/react/useCallback) は、第 2 引数に渡される依存配列が同じである限り、関数への安定した参照を提供するものです。`useMemo` と同様に、関数の型は 1 番目の引数として指定した関数から推論され、フックに型引数を指定することでより明示的にすることができます。


```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript の strict モードで作業している場合、`useCallback` ではコールバックの引数に型を追加する必要があります。これは、コールバックの型が関数から推論されるため、引数がないと型を完全に決定できないからです。

好みのコードスタイルによっては、React が提供する `*EventHandler` 関数型を使用して、コールバックを定義しながらイベントハンドラの型を提供することができます：

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## 便利な型 {/*useful-types*/}

`@types/react` パッケージには非常に様々な型が存在しており、React と TypeScript の扱いに慣れたら目を通す価値があります。これらは [DefinitelyTyped 内の React のフォルダ](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts)で見ることができます。ここでは一般的な型をいくつか紹介します。

### DOM イベント {/*typing-dom-events*/}

React で DOM イベントを扱うとき、イベントの型はイベントハンドラから推論できることもあります。しかし、イベントハンドラに渡すための関数を抽出して別に定義したい場合は、イベントの型を明示的に設定する必要があります。

<Sandpack>

```tsx App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

```js App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

React 型定義には多くの種類のイベントが提供されています。完全なリストは[こちら](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373)にあり、[DOM で最も使われるイベント](https://developer.mozilla.org/en-US/docs/Web/Events)に基づいています。

必要なイベント型を見つけたい場合は、まず使用しているイベントハンドラのホバー情報を見てみると、イベントの型が表示されます。

このリストに含まれていないイベントを使用する必要がある場合は、すべてのイベントの基本型である `React.SyntheticEvent` 型を使用することができます。

### 子要素 {/*typing-children*/}

コンポーネントの子要素を型として記述する一般的な方法は 2 つあります。1 つ目は `React.ReactNode` 型を使用する方法であり、これは JSX で子要素として渡すことが可能なすべての型のユニオン型です。

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

これは子要素の非常に包括的な定義です。2 つ目は `React.ReactElement` 型を使用する方法です。こちらは JSX 要素のみを指し、文字列や数値のような JavaScript のプリミティブは含まれません。

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

子要素が特定の JSX 要素の型であることを TypeScript で記述することはできないことに注意してください。子要素として `<li>` のみを受け入れるコンポーネントを型システムで記述することはできません。

[こちらの TypeScript プレイグラウンド](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA)で、`React.ReactNode` と `React.ReactElement` の両方の例を型チェッカ付きで確認することができます。

### スタイル props {/*typing-style-props*/}

React でインラインスタイルを使用する際には、`style` プロパティに渡されるオブジェクト型を記述するために `React.CSSProperties` を使用することができます。この型は可能な CSS プロパティすべてのユニオンであり、有効な CSS プロパティを props として `style` に渡していることを保証し、エディタで自動補完を得るための良い方法です。

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## さらに学ぶ {/*further-learning*/}

このガイドでは React で TypeScript を使用するための基本的な方法を紹介しましたが、まだ学ぶべきことはたくさんあります。
ドキュメントの個々の API ページには、TypeScript とともに使用する方法についてのより詳細な説明がある場合があります。

以下のリソースがお勧めです。

 - [The TypeScript handbook](https://www.typescriptlang.org/docs/handbook/) は TypeScript の公式ドキュメントであり、ほとんどの主要な言語機能をカバーしています。

 - [TypeScript のリリースノート](https://devblogs.microsoft.com/typescript/)では、それぞれの新機能が詳細に解説されています。

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) はコミュニティによってメンテナンスされている、React で TypeScript を使用するためのチートシートです。多くの有用なエッジケースをカバーしており、このドキュメントよりも広範な解説が得られます。

 - [TypeScript コミュニティ Discord](https://discord.com/invite/typescript) は、TypeScript と React の問題について質問したり、助けを得たりするための素晴らしい場所です。
