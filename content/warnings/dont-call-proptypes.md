---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

「PropTypes を呼び出してはならない」警告。

> 補足：
>
> React.PropTypes は React v15.5 から別パッケージに移動しました。代わりに [prop-types ライブラリ](https://www.npmjs.com/package/prop-types)を使用してください。
> コードを自動で変換するための [codemod スクリプト](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes)も提供しています。

React の将来のメジャーリリースでは、PropType のバリデーションを実装するコードは、本番用ビルドから削除される予定です。その際には、バリデーションを手動で呼び出す全てのコード（本番用ビルドで削除されないもの）はエラーを投げることになります。

### PropTypes 宣言については問題ありません {#declaring-proptypes-is-still-fine}

PropType の通常の使用は引き続きサポートされます。

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

これについては何も変わっていません。

### PropTypes を直接呼び出さない {#dont-call-proptypes-directly}

React コンポーネントに注釈を付ける以外の方法で PropType を使用することはサポートされなくなりました。

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Not supported!
var error = apiShape(json, 'response');
```

この形で PropType を使用をする必要がある場合、PropType のフォーク版（[これら](https://github.com/aackerman/PropTypes) [2 つの](https://github.com/developit/proptypes)パッケージなど）を使用するか、あるいは新たにフォーク版を作成することをおすすめします。

警告に応じてコードを修正しなければ、このコードは React 16 の本番用ビルドではクラッシュします。

### PropTypes を直接呼んでいないのに警告が発生するとき {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

警告で出力されているスタックトレースを調べることで、PropTypes を直接呼んでいるコンポーネント定義を見付けることができます。ほとんどの場合、React の PropType をラップするサードパーティ製の PropType が問題の原因です。たとえば、

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

このケースでは、`ThirdPartyPropTypes.deprecated` が `PropTypes.bool` を呼び出しているラッパーです。このパターンそのものは良いのですが、あなたが直接 PropTypes を呼び出したと React が判断するため、誤検出（=呼び出していないのに呼び出したと判定）を引き起こします。次節では `ThirdPartyPropTypes` のようなライブラリを実装する際に、この問題をどのように解決するかについて述べます。自分で書いたライブラリでなければ、そのライブラリについて issue を作成することもできます。

### サードパーティの PropTypes における誤検知を修正する {#fixing-the-false-positive-in-third-party-proptypes}

あなたがサードパーティ製 PropTypes の作者で、利用者に既存の React PropTypes をラップさせる場合、ライブラリがこの警告を発生させるのを利用者は目にするようになるでしょう。
これは手動による PropTypes の呼び出しを[検知するために渡す最後尾の引数 `secret`](https://github.com/facebook/react/pull/7132) を React が確認できないために起こります。

以下に修正方法を示します。例として使用しているのは [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js) にある `deprecated` です。現時点での実装では単に引数として `props`、`propName`、そして `componentName` を渡しているだけです。

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

誤検知を修正するには、**すべての**引数をラップされた PropType に渡してください。これは ES6 の `...rest` 記法で簡単に行えます。

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

これで警告は出力されなくなります。
