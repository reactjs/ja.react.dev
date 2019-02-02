---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---
PropTypes を呼び出してはならないという警告。

> 注意：
>
> React.PropTypes は React v15.5 から別パッケージに移動しました。代わりに [prop-typesライブラリ](https://www.npmjs.com/package/prop-types)を使用してください。
> コードを自動で変換するための [codemodスクリプト](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) も提供しています。
>

In a future major release of React, the code that implements PropType validation functions will be stripped in production. Once this happens, any code that calls these functions manually (that isn't stripped in production) will throw an error.


Reactの将来のメジャーリリースでは、PropTypeのバリデーションを実装するコードは、プロダクションビルドから削除される予定です。その際には、バリデーションを手動で呼び出す全てのコード（プロダクションビルドで削除されないもの）はエラーを投げることになります。

### PropTypes 宣言は問題ない

PropTypeの通常の使用は引き続きサポートされます。

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

この場合には何も変更がありません。

### PropTypes を直接呼び出さない

React コンポーネントに注釈を付ける以外の方法でPropTypeを使用することはサポートされなくなりました。

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Not supported!
var error = apiShape(json, 'response');
```

この形で PropType を使用をする必要がある場合、PropTypeのフォーク版（[これら](https://github.com/aackerman/PropTypes) [2つの](https://github.com/developit/proptypes)パッケージなど）を使用するか、あるいは新たにフォーク版を作成することをお勧めします。

警告を修正しなければ、このコードは React 16 のプロダクションビルドではクラッシュします。

If you depend on using PropTypes like this, we encourage you to use or create a fork of PropTypes (such as [these](https://github.com/aackerman/PropTypes) [two](https://github.com/developit/proptypes) packages).

If you don't fix the warning, this code will crash in production with React 16.

### PropTypes を直接呼んでいないのに警告が発生するとき

### If you don't call PropTypes directly but still get the warning

Inspect the stack trace produced by the warning. You will find the component definition responsible for the PropTypes direct call. Most likely, the issue is due to third-party PropTypes that wrap React’s PropTypes, for example:


警告で出力されているスタックトレースを調べると、PropTypesを直接呼んでいるコンポーネント定義を見付けることができるでしょう。ほとんどの場合、ReactのPropTypeをラップするサードパーティのPropTypeが問題の原因です。たとえば、

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

In this case, `ThirdPartyPropTypes.deprecated` is a wrapper calling `PropTypes.bool`. This pattern by itself is fine, but triggers a false positive because React thinks you are calling PropTypes directly. The next section explains how to fix this problem for a library implementing something like `ThirdPartyPropTypes`. If it's not a library you wrote, you can file an issue against it.

このケースでは、 `ThirdPartyPropTypes.deprecated` が `PropTypes.bool` を呼び出しているラッパーです。このパターンそのものは良いのですが、あなたが直接 PropTypes を呼び出したと React が判断するため誤検出（呼び出していないのに呼び出したと判定される）を引き起こします。次節では `ThirdPartyPropTypes` のようなライブラリを実装するときにこの問題をどのように解決するかについて述べます。自分で書いたライブラリでなければ、そのライブラリについてissueを作成することもできます。


### Fixing the false positive in third party PropTypes


### サードパーティの PropTypes における誤検知を修正する

If you are an author of a third party PropTypes library and you let consumers wrap existing React PropTypes, they might start seeing this warning coming from your library. This happens because React doesn't see a "secret" last argument that [it passes](https://github.com/facebook/react/pull/7132) to detect manual PropTypes calls.

あなたがサードパーティPropTypes の作者で、利用者に既存の React PropTypesをラップさせる場合、利用者はライブラリから出るこの警告を見かけるようになるでしょう。
これは React が手動によるPropTypesの呼び出しを[検知するために渡す最後尾の引数 `secret` ](https://github.com/facebook/react/pull/7132)を確認できないために起こります。


Here is how to fix it. We will use `deprecated` from [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) as an example. The current implementation only passes down the `props`, `propName`, and `componentName` arguments:

以下に修正方法を示します。
例として使用しているのは [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) にある `deprecated` です。
現時点での実装では単に引数として `props`、 `propName`、そして `componentName` を渡しているだけです。


```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

In order to fix the false positive, make sure you pass **all** arguments down to the wrapped PropType. This is easy to do with the ES6 `...rest` notation:

誤検知を修正するには、**すべての**引数をラップされたPropTypeに渡してください。これはES6の `...rest` 記法で簡単に行えます。

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Note ...rest here
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // and here
  };
}
```

This will silence the warning.

これで警告は出力されなくなります。
