---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

「ref にはオーナーが必要である」の警告。

このページを閲覧しているのはおそらく以下のエラーメッセージの 1 つが出力されたからでしょう。

*React 16.0.0+*
> 警告:
>
> ref 要素が文字列 (myRefName) として指定されましたが、オーナーが設定されていませんでした。React の複数のコピーがロードされている可能性があります。（詳細：https://fb.me/react-refs-must-have-owner）

*より古いバージョンの React*
> Warning:
>
> addComponentAsRefTo(...): ReactOwner だけが ref を持つことができます。コンポーネントの `render` メソッド内で作成されていないコンポーネントに ref を指定したか、React のコピーを複数ロードしているかもしれません。

これは通常、以下の 3 つのいずれかを意味します：

- `ref` を関数コンポーネントに使用しようとしている
- コンポーネントの render() 関数の外部で作成されている要素に `ref` を使用しようとしている
- React の複数の（競合する）コピーがロードされている（例えば npm 依存関係の設定ミスによって）

## 関数コンポーネントの ref {#refs-on-function-components}

`<Foo>` が関数コンポーネントである場合には、ref を指定することはできません。

```js
// Doesn't work if Foo is a function!
<Foo ref={foo} />
```

コンポーネントに ref を指定する必要がある場合は、クラスコンポーネントに変換するか、あるいは ref を使わない方法を検討してください。[ref が本当に必要](/docs/refs-and-the-dom.html#when-to-use-refs)になることは滅多にありません。

## render メソッド外での文字列 ref の使用  {#strings-refs-outside-the-render-method}

これは通常、オーナーを持たない（つまり、他のコンポーネントの `render` メソッド内で作成されなかった）コンポーネントへ ref を追加しようとしているということです。例えば、以下はうまく動作しません。

```js
// Doesn't work!
ReactDOM.render(<App ref="app" />, el);
```

この ref を保持する新しいトップレベルのコンポーネントの中で当該のコンポーネントをレンダリングしてみてください。あるいは、コールバック ref を使えるかもしれません。

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

このようなアプローチを採用する前に、[本当に ref が必要かどうか](/docs/refs-and-the-dom.html#when-to-use-refs)を検討してください。

## React の複数のコピー {#multiple-copies-of-react}

Bower は依存関係の重複を上手く排除しますが、npm はそうではありません。ref に対して特別なことを何もしていないなら、原因は ref ではなく、複数の React のコピーがプロジェクトにロードされているからである可能性が高いでしょう。サードパーティ製のモジュールを npm 経由で追加した場合、依存ライブラリの重複したコピーがたまに問題を引き起こす可能性があります。

npm を使用している場合、`npm ls` や `npm ls react` の実行が、問題の原因を探す役に立つかもしれません。
