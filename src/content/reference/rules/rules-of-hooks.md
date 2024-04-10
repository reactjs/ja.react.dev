---
title: フックのルール
---

<Intro>
フックは再利用可能な UI ロジックを表す JavaScript の関数として定義されており、呼び出せる場所に関する制約があります。
</Intro>

<InlineToc />

---

## フックはトップレベルでのみ呼び出す {/*only-call-hooks-at-the-top-level*/}

`use` で始まる関数名を持つ関数は React では[*フック (hook)*](/reference/react) と呼ばれます。

**ループ、条件分岐、ネストされた関数、`try`/`catch`/`finally` ブロックの内部でフックを呼び出してはいけません**。代わりに、フックは常に React 関数のトップレベルで、早期 return を行う前に行います。フックは React が関数コンポーネントをレンダーしている間にのみ呼び出すことができます。

* ✅ [関数コンポーネント](/learn/your-first-component)本体のトップレベルで呼び出す。
* ✅ [カスタムフック](/learn/reusing-logic-with-custom-hooks)本体のトップレベルで呼び出す。

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

以下のような場合にフック（`use` で始まる関数）を呼び出すことは**サポートされていません**。

* 🔴 条件やループの内部でフックを呼び出してはいけない。
* 🔴 条件付き `return` 文の後でフックを呼び出してはいけない。
* 🔴 イベントハンドラ内でフックを呼び出してはいけない。
* 🔴 クラスコンポーネント内でフックを呼び出してはいけない。
* 🔴 `useMemo`、`useReducer`、`useEffect` に渡される関数内でフックを呼び出してはいけない。
* 🔴 `try`/`catch`/`finally` ブロック内でフックを呼び出してはいけない。

これらのルールを破ると、以下のエラーが表示される可能性があります。

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}

function Bad() {
  try {
    // 🔴 Bad: inside try/catch/finally block (to fix, move it outside!)
    const [x, setX] = useState(0);
  } catch {
    const [x, setX] = useState(1);
  }
}
```

これらの間違いを捕捉するために [`eslint-plugin-react-hooks` プラグイン](https://www.npmjs.com/package/eslint-plugin-react-hooks)が利用可能です。

<Note>

[カスタムフック](/learn/reusing-logic-with-custom-hooks)は他のフックを呼び出しても*構いません*（むしろそれが主目的です）。これは、カスタムフックも関数コンポーネントのレンダー中にのみ呼び出されることが前提だからです。

</Note>

---

## React の関数からのみフックを呼び出す {/*only-call-hooks-from-react-functions*/}

通常の JavaScript 関数からフックを呼び出さないでください。代わりに以下ようにします。

✅ React の関数コンポーネントからフックを呼び出す。
✅ [カスタムフック](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)からフックを呼び出す。

このルールに従うことで、コンポーネント内のすべてのステートフルなロジックがそのソースコードから明確に見えることが保証されます。

```js {2,5}
function FriendList() {
  const [onlineStatus, setOnlineStatus] = useOnlineStatus(); // ✅
}

function setOnlineStatus() { // ❌ Not a component or custom Hook!
  const [onlineStatus, setOnlineStatus] = useOnlineStatus();
}
```
