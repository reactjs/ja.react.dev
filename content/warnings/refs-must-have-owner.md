---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---
refには所有者が必要であることについての警告。

You are probably here because you got one of the following error messages:

このページに来たのは恐らく以下のエラーメッセージの1つが出力されたからでしょう：

*React 16.0.0+*
> 警告:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).
>
> ref 要素が文字列（myRefName）として指定されましたが、所有者が設定されていませんでした。Reactの複数のコピーがロードされている可能性があります。（詳細： https://fb.me/react-refs-must-have-owner ）。

*早期バージョンの React*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.
>
> ReactOwner だけが ref を持つことができます。componentの render メソッド内で作成されていないコンポーネントに ref を追加したか、React のコピーを複数ロードしているかもしれません。

これは通常、以下の3つのいずれかを意味します：

- You are trying to add a `ref` to a function component.
- You are trying to add a `ref` to an element that is being created outside of a component's render() function.
- You have multiple (conflicting) copies of React loaded (eg. due to a misconfigured npm dependency)

- `ref` を関数コンポーネントに追加しようとしている
- コンポーネントの render() 関数の外部で作成されている要素に `ref` を追加しようとしている
- Reactの複数の（競合する）コピーがロードされている（例えばnpm依存関係の設定ミスによる）。

## Refs on Function Components
## 関数コンポーネントのRefs

If `<Foo>` is a function component, you can't add a ref to it:

`<Foo>`が関数コンポーネントである場合には、refを追加することはできません。

```js
// Doesn't work if Foo is a function!
<Foo ref={foo} />
```

If you need to add a ref to a component, convert it to a class first, or consider not using refs as they are [rarely necessary](/docs/refs-and-the-dom.html#when-to-use-refs).

コンポーネントに ref を追加する必要がある場合は、クラスコンポーネントに変換するか、あるいは ref を使わない方法を検討してください。[ref が本当に必要](/docs/refs-and-the-dom.html#when-to-use-refs)になることは滅多にありません。

## Strings Refs Outside the Render Method
## render メソッド外での文字列 ref の使用

This usually means that you're trying to add a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). For example, this won't work:

これは通常、所有者を持たない（つまり、他のコンポーネントの render メソッド内で作成されなかった）コンポーネントへ ref を追加しようとしているということです。
例えば、以下はうまく動作しません：

```js
// Doesn't work!
ReactDOM.render(<App ref="app" />, el);
```

Try rendering this component inside of a new top-level component which will hold the ref. Alternatively, you may use a callback ref:

ref を保持する新しいトップレベルのコンポーネントの中で当該のコンポーネントをレンダリングしてみてください。


```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Consider if you [really need a ref](/docs/refs-and-the-dom.html#when-to-use-refs) before using this approach.

このようなアプローチにする前に、本当に ref が必要かどうか考慮してください。


## Multiple copies of React
## React の複数のコピー

Bower does a good job of deduplicating dependencies, but npm does not. If you aren't doing anything (fancy) with refs, there is a good chance that the problem is not with your refs, but rather an issue with having multiple copies of React loaded into your project. Sometimes, when you pull in a third-party module via npm, you will get a duplicate copy of the dependency library, and this can create problems.

Bower は依存関係の重複を上手く排除しますが、npm はそうではありません。
ref に対して（突飛なことを）何もしていないなら、原因は ref ではなく、複数の React のコピーがプロジェクトにロードされているからである可能性が高いでしょう。
時に、サードパーティ製のモジュールを npm 経由で追加した場合、依存ライブラリの重複したコピーが問題を引き起こす可能性があります。

If you are using npm... `npm ls` or `npm ls react` might help illuminate.

npmを使用している場合、`npm ls` や `npm ls react` の実行が、問題の原因を探す役に立つかもしれません。
