---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---
refは所有者が必要であることについての警告

You are probably here because you got one of the following error messages:

このページに来たのは恐らく以下のエラーメッセージの1つが出力されたからでしょう：

*React 16.0.0+*
> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

> 警告: ReactOwner だけが ref を持つことができます。componentの render メソッド内で作成されていないコンポーネントに ref を追加したか、React のコピーを複数ロードしているかもしれません。

*earlier versions of React*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.

This usually means one of three things:

これは通常以下の3つのいずれかを意味します：


- You are trying to add a `ref` to a function component.
- You are trying to add a `ref` to an element that is being created outside of a component's render() function.
- You have multiple (conflicting) copies of React loaded (eg. due to a misconfigured npm dependency)

## Refs on Function Components

If `<Foo>` is a function component, you can't add a ref to it:

```js
// Doesn't work if Foo is a function!
<Foo ref={foo} />
```

If you need to add a ref to a component, convert it to a class first, or consider not using refs as they are [rarely necessary](/docs/refs-and-the-dom.html#when-to-use-refs).

コンポーネントに ref を追加する必要がある場合は、まずクラス型コンポーネントに変換するか、あるいは ref を使わない方法を検討してください。ref は滅多に必要ではありません。

## Strings Refs Outside the Render Method
## レンダーメソッド外での文字列 ref の使用

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
ref に対して何も（突飛なことを）していないなら、問題が ref についてではなく、複数の React のコピーがプロジェクトにロードされていることである可能性が高いでしょう。
時に、サードパーティ製のモジュールを npm 経由で追加した場合、依存関係ライブラリの重複したコピーを取得して、問題を引き起こす可能性があります。

If you are using npm... `npm ls` or `npm ls react` might help illuminate.

あなたがnpmを使っているならば…、npm lsまたはnpm ls react明かりをつけるのを助けるかもしれない。

