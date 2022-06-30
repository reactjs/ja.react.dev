---
title: Invalid Hook Call Warning
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

このページを見ているのは、おそらく以下のエラーメッセージが出たからでしょう。

> Hooks can only be called inside the body of a function component.（フックは関数コンポーネントの本体でしか呼び出せません）

このエラーを目にする理由としてよくあるものは 3 つです。

1. React と React DOM の**バージョンがマッチしていない**。
2. **[フックのルール](/docs/hooks-rules.html)**に違反している。
3. 同じアプリ内に **2 つ以上の React のコピー**が含まれている。

それぞれのケースについて見てみましょう。

## React と React DOM のバージョン不整合 {#mismatching-versions-of-react-and-react-dom}

まだフックをサポートしていない `react-dom` (&lt; 16.8.0) や `react-native` (&lt; 0.60) を利用しているのかもしれません。アプリケーションフォルダで `npm ls react-dom` か `npm ls react-native` を実行して、どのバージョンを使っているのかを確認できます。もしも 2 つ以上出てきた場合は、それも問題になりえます（後述）。

## フックのルールへの違反 {#breaking-the-rules-of-hooks}

フックを呼び出してよいのは **React が関数コンポーネントをレンダーしている最中**のみです。

* ✅ 関数コンポーネント本体のトップレベルで呼び出す。
* ✅ [カスタムフック](/docs/hooks-custom.html)の本体のトップレベルで呼び出す。

**詳しくは[フックのルール](/docs/hooks-rules.html)を参照してください。**

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

念のためですが、上記と異なる以下のようなケースでは、フックはサポート**されません**：

* 🔴 クラスコンポーネント内で呼び出さないでください。
* 🔴 イベントハンドラ内で呼び出さないでください。
* 🔴 `useMemo`, `useReducer`, `useEffect` に渡す関数の内部で呼び出さないでください。

これらのルールに違反した場合には本エラーが発生します。

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Bad: inside a class component
    useEffect(() => {})
    // ...
  }
}
```

これらの誤りの一部は [`eslint-plugin-react-hooks` プラグイン](https://www.npmjs.com/package/eslint-plugin-react-hooks)を利用すると検出できます。

> 補足
>
> [カスタムフック](/docs/hooks-custom.html)は他のフックを呼び出しても構いません（まさにそれが目的なので）。これはカスタムフックも関数コンポーネントがレンダーされる最中にのみ呼び出されるはずだからです。


## 重複した React のコピー {#duplicate-react}

フックが動作するためには、あなたのアプリケーションコード内で `react` インポート文を使った時に解決される `react` が、`react-dom` パッケージ内でインポートしている `react` と同じでなければなりません。

これらの `react` のインポート文が別々のオブジェクトへと解決された場合、この警告が発生します。これは**意図せず `react` パッケージの 2 つのコピーをプロジェクトに含めてしまった場合**に発生する可能性があります。

パッケージ管理に Node を使っている場合は、プロジェクトフォルダ内で以下を実行することで確認できます：

    npm ls react

もし React のコピーが 2 つ以上あった場合、その原因を突き止めて依存ツリーを修正する必要があります。例えばあなたの利用しているライブラリが `react` を peer dependency ではなく誤って dependency として使用しているのかもしれません。そのライブラリが修正されるまでは、[Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) が問題の回避策になりえます。

また、ログを加えて開発サーバを再起動することでもこの問題のデバッグが可能です。

```js
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

これで `false` が出力された場合は React が 2 つ存在するということであり、原因を突き止める必要があるでしょう。[この issue](https://github.com/facebook/react/issues/13991) に、コミュニティ内で経験されたよくある原因がいくつか載っています。

この問題は `npm link` やその同等物を使った場合にも発生することがあります。このケースでは、あなたのアプリケーションフォルダにあるものとライブラリフォルダにあるものの、2 つの React がバンドラから "見えて" いるのかもしれません。ひとつの解決法は、`myapp` と `mylib` が互いに兄弟関係にあるフォルダであるとして、`mylib` 側から `npm link ../myapp/node_modules/react` を実行する、というものです。これによりライブラリ側がアプリケーション側の React のコピーを使用するようになります。

>補足
>
>一般的には、ひとつのページ内で複数の独立した React のコピーを利用することはサポートされています（例えば、あなたのアプリケーションとサードパーティのウィジェットが別の React のコピーを利用する場合など）。問題が発生するのはコンポーネントとそれをレンダーしている `react-dom` との間で `require('react')` が違うものに解決された場合です。

## その他の原因 {#other-causes}

以上のいずれもうまくいかなかった場合は、[この issue](https://github.com/facebook/react/issues/13991) にコメントしていただければできるだけお手伝いします。小さな再現コードの例を作るようにしてください -- そうする過程で自分で問題に気づけるかもしれません。
