---
title: "組み込みの React フック"
---

<Intro>

*フック*を用いると、コンポーネントから様々な React の機能を使えるようになります。組み込みのフックを使うこともできますし、組み合わせて自分だけのものを作ることもできます。このページでは、React に組み込まれた全てのフックを説明します。

</Intro>

---

## state フック {/*state-hooks*/}

*state* を使うと、ユーザの入力などの情報を[コンポーネントに「記憶」](/learn/state-a-components-memory)させることができます。例えば、フォームコンポーネントは入力された文字を保持し、画像ギャラリのコンポーネントは選択された画像を保持できます。

コンポーネントに state を追加するには、次のフックのいずれかを使います：

* [`useState`](/reference/react/useState) は直接的に更新できる state 変数を定義します。
* [`useReducer`](/reference/react/useReducer) は、[リデューサ関数](/learn/extracting-state-logic-into-a-reducer)内に書いたロジックを用いて更新を行う state 変数を定義します。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## コンテクストフック {/*context-hooks*/}

*コンテクスト*を用いると、コンポーネントは props を渡すことなく、[離れた親要素から情報を取得できるようになります](/learn/passing-props-to-a-component)。例えば、アプリの最上位のコンポーネントが、現在の UI テーマをコンポーネントの階層に関係なく全てのコンポーネントに渡すことができます。

* [`useContext`](/reference/react/useContext) は、コンテクストの値を読み取り、変更を受け取れるようにします。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## ref フック {/*ref-hooks*/}

*ref* を用いると、コンポーネントは DOM ノードやタイムアウト ID などの、[レンダーに用いない情報を保持](/learn/referencing-values-with-refs)することができます。state と違い、ref の値を更新してもコンポーネントは再レンダーされません。ref は、React パラダイムからの「避難ハッチ」です。これらは組み込みのブラウザ API などの、React 外のシステムを取り扱うときに役立ちます。

* [`useRef`](/reference/react/useRef) は ref を宣言します。useRef にはどんな値でも格納できますが、多くの場合、DOM ノードを格納するために使われます。
* [`useImperativeHandle`](/reference/react/useImperativeHandle) を用いると、コンポーネントが公開する ref をカスタマイズできます。これはほとんど用いられることはありません。

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## エフェクトフック {/*effect-hooks*/}

*エフェクト*を使うことで、[コンポーネントを外部システムに接続し、同期させる](/learn/synchronizing-with-effects)ことができます。これには、ネットワーク、ブラウザの DOM、アニメーション、別の UI ライブラリを使って書かれたウィジェット、その他の非 React コードの処理が含まれます。

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

エフェクトは、React パラダイムからの「脱出ハッチ」です。エフェクトをアプリケーションのデータフローを調整するために使ってはいけません。外部のシステムとやりとりを行わないならば、[エフェクトは必要ないかもしれません](/learn/you-might-not-need-an-effect)。

`useEffect` には、実行タイミングが異なり、まれに使われることのある 2 つのバリエーションがあります：

* [`useLayoutEffect`](/reference/react/useLayoutEffect) はブラウザが画面を再描画する前に発火します。このフックでレイアウトを測定できます。
* [`useInsertionEffect`](/reference/react/useInsertionEffect) は React が DOM に変更を加える前に発火します。ライブラリは動的な CSS をこのフックで挿入できます。

---

## パフォーマンス関連フック {/*performance-hooks*/}

再レンダーのパフォーマンスを最適化するためのよくある方法は、不要な処理を減らすことです。例えばキャッシュ済みの計算結果を再利用したり、データの変更がない場合の再レンダーをスキップしたりするよう、React に伝えることができます。

不要な計算やレンダーをスキップするためには、以下のフックを用いることができます：

- [`useMemo`](/reference/react/useMemo) を用いると高負荷な計算の結果をキャッシュできます。
- [`useCallback`](/reference/react/useCallback) を用いると、最適化済みのコンポーネントに渡すために関数定義をキャッシュしておくことができます。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

画面の更新が実際にあるため、再レンダーをスキップできない場合もあるでしょう。その場合、同期的に行う必要があるユーザインターフェイスをブロックする更新（ユーザの文字入力など）を、ユーザインターフェイスをブロックする必要のないノンブロッキングな更新（図の更新など）から分離することで、パフォーマンスを向上することができます。

レンダーの優先度付けを行うために、以下のフックを用いることができます：

- [`useTransition`](/reference/react/useTransition) を用いることで、state の遷移をノンブロッキングなものとしてマークし、他の更新による割り込みを許可します。
- [`useDeferredValue`](/reference/react/useDeferredValue) を用いると、UI の重要でない部分の更新を遅延させて、他の部分を先に更新させることができます。

---

## リソース関連フック {/*resource-hooks*/}

*リソース (resource)* は state に入れずにコンポーネントからアクセスできます。例えばコンポーネントは Promise からメッセージを読み取ったり、コンテクストからスタイルに関する情報を読み取ったりできます。

リソースから値を読み取るには、以下のフックを用いることができます：

- [`use`](/reference/react/use) を用いることで [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) や[コンテクスト](/learn/passing-data-deeply-with-context)などのリソースから値を読み取ります。

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## その他のフック {/*other-hooks*/}

これらのフックはライブラリの開発者には有用ですが、アプリケーションコードでは通常は用いられることはありません。

- [`useDebugValue`](/reference/react/useDebugValue) を用いると、React DevTools が表示するカスタムフックのラベルをカスタマイズできます。
- [`useId`](/reference/react/useId) を用いると、コンポーネントにユニークな ID を関連付けることができます。通常はアクセシビリティ API とともに使用されます。 
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) を用いると、コンポーネントは外部のストアを参照できるようになります。

---

## 独自のフック {/*your-own-hooks*/}

JavaScript の関数として[独自のカスタムフックを定義](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)することもできます。
