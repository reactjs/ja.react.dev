---
title: "組み込みのReactフック"
---

<Intro>

*フック* を用いると、コンポーネントから様々な React の機能を使えるようになります。組み込まれたフックを使うこともできますし、組み合わせて自分だけのものを作ることもできます。このページでは、React に組み込まれた全てのフックを説明します。

</Intro>

---

## state フック {/*state-hooks*/}

*state* は、ユーザの入力などの情報を[コンポーネントに記憶](/learn/state-a-components-memory)させることができます。例えば、フォームコンポーネントは入力された文字を保存し、画像ギャラリーのコンポーネントは選択された画像を保持できます。

コンポーネントに state を追加するには、次のフックのいずれかを使います： 

* [`useState`](/reference/react/useState) は直接アップデート可能な state 変数を定義します
* [`useReducer`](/reference/react/useReducer) は、[reducer function](/learn/extracting-state-logic-into-a-reducer) 内でアップデートロジックを用いた state 変数を定義します。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## context フック {/*context-hooks*/}

*Context* を用いると、コンポーネントは props を渡すことなく、[離れた親要素から情報を取得できるようになります。](/learn/passing-props-to-a-component)例えば、アプリの最上位のコンポーネントは、現在の UI テーマをコンポーネントの階層に関係なく全てのコンポーネントに渡すことができます。

* [`useContext`](/reference/react/useContext) を用いて値を使用できるようにします。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## ref フック {/*ref-hooks*/}

*ref* を用いると、コンポーネントは[レンダリングに用いない情報](/learn/referencing-values-with-refs)を保持することができます。例えば DOM node やタイムアウト ID などが当てはまるでしょう。state と違い、ref の値の更新はコンポーネントを再レンダーしません。ref は、React パラダイムからの「脱出ハッチ」です。これらは組み込みのブラウザ API のような React ではないシステムを操作するときに役立ちます。

* [`useRef`](/reference/react/useRef) は ref を宣言します。useRef にはどんな値でも格納できますが、多くの場合、DOM ノードを格納するために使われます。
* [`useImperativeHandle`](/reference/react/useImperativeHandle) を用いると、コンポーネントが公開する ref をカスタマイズできます。これは殆ど用いられることはありません。

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## エフェクト フック {/*effect-hooks*/}

*エフェクト*は、[コンポーネントを外部システムに接続し、同期させる](/learn/synchronizing-with-effects)ことができます。これには、ネットワーク、ブラウザの DOM、アニメーション、別の UI ライブラリを使って書かれたウィジェット、その他の React 以外のコードの処理が含まれています。

* [`useEffect`](/reference/react/useEffect) は外部のシステムとコンポーネントを接続します。

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

エフェクトは、React パラダイムからの「脱出ハッチ」のようなものです。エフェクトをアプリケーションのデータフローを調整するために使ってはいけません。外部のシステムとやりとりを行わないならば、[エフェクトは必要ないかもしれません。](/learn/you-might-not-need-an-effect)

`useEfefct` には、タイミングの違いによってまれに使われることのある 2 つのバリエーションがあります： 

* [`useLayoutEffect`](/reference/react/useLayoutEffect) はブラウザが画面を再描画する前に発火します。このフックでレイアウトを測定できます。
* [`useInsertionEffect`](/reference/react/useInsertionEffect) は React が DOM に変更を加える前に発火します。ライブラリはダイナミック CSS をこのフックで挿入できます。

---

## performance フック {/*performance-hooks*/}

再レンダーのパフォーマンスを最適化する通常の方法は、不要な処理を減らすことです。例えばキャッシュを再利用したり、データの変更がない場合の再レンダーをスキップしたりするよう、React に伝えることができます。

不要な処理やレンダリングを減らすためには、これらのフックを用いることができます： 

- [`useMemo`](/reference/react/useMemo) を用いると高負荷な計算の結果をキャッシュできます。
- [`useCallback`](/reference/react/useCallback) を用いると最適化されたコンポーネントに渡す前の段階で、関数定義をキャッシュできます。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

画面を更新するために再レンダーをスキップできない場合もあるでしょう。その場合、同期が必要なブロック更新（ユーザの文字入力など）を、ユーザ インターフェイスをブロックする必要のない非ブロック更新（図の更新など）から分離することで、パフォーマンスを向上することができます。

レンダリングを優先するには、これらのフックを用いることができます： 

- [`useTransition`](/reference/react/useTransition) を用いると、状態の遷移を非ブロックとしてマークし、他のアップデートによる割り込みを許可します。
- [`useDeferredValue`](/reference/react/useDeferredValue) を用いると、UI の重要でない部分の更新を延期して他の部分を先に更新させることができます。

---

## その他のフック {/*other-hooks*/}

これらのフックはライブラリの開発者には便利かもしれません。しかし、アプリケーションのコードでは通常は用いられることはありません。

- [`useDebugValue`](/reference/react/useDebugValue) を用いると、React DevTools が表示するカスタムフックのラベルをカスタマイズできます。
- [`useId`](/reference/react/useId) を用いると、コンポーネントがユニークな ID をコンポーネントそのものに関連付けることができます。通常はアクセシビリティ API とともに使用されます。 
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) を用いると、コンポーネントは外部のストアを参照できるようになります。

---

## 独自のフック {/*your-own-hooks*/}

独自のカスタムフックを[ JavaScript の関数として定義](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)することもできます。
