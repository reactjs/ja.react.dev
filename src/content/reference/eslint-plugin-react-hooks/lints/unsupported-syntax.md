---
title: unsupported-syntax
---

<Intro>

React Compiler がサポートしていない構文を使っていないか検証します。その構文が必要な場合、独立したユーティリティ関数など、React の外であれば引き続き使用できます。

</Intro>

## ルールの詳細 {/*rule-details*/}

React Compiler が最適化を適用するには、コードを静的に解析する必要があります。`eval` や `with` などの機能を使うと、コードの動作をコンパイル時に静的に理解できなくなるため、コンパイラはそれらを使うコンポーネントを最適化できません。

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Using eval in component
function Component({ code }) {
  const result = eval(code); // Can't be analyzed
  return <div>{result}</div>;
}

// ❌ Using with statement
function Component() {
  with (Math) { // Changes scope dynamically
    return <div>{sin(PI / 2)}</div>;
  }
}

// ❌ Dynamic property access with eval
function Component({propName}) {
  const value = eval(`props.${propName}`);
  return <div>{value}</div>;
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ Use normal property access
function Component({propName, props}) {
  const value = props[propName]; // Analyzable
  return <div>{value}</div>;
}

// ✅ Use standard Math methods
function Component() {
  return <div>{Math.sin(Math.PI / 2)}</div>;
}
```

## トラブルシューティング {/*troubleshooting*/}

### 動的なコードを評価したい {/*evaluate-dynamic-code*/}

以下のように、ユーザが入力したコードを評価する必要があるかもしれません。

```js {expectedErrors: {'react-compiler': [3]}}
// ❌ Wrong: eval in component
function Calculator({expression}) {
  const result = eval(expression); // Unsafe and unoptimizable
  return <div>Result: {result}</div>;
}
```

代わりに、安全な式のパーサを使ってください。

```js
// ✅ Better: Use a safe parser
import {evaluate} from 'mathjs'; // or similar library

function Calculator({expression}) {
  const [result, setResult] = useState(null);

  const calculate = () => {
    try {
      // Safe mathematical expression evaluation
      setResult(evaluate(expression));
    } catch (error) {
      setResult('Invalid expression');
    }
  };

  return (
    <div>
      <button onClick={calculate}>Calculate</button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}
```

<Note>

ユーザの入力に対して `eval` を決して使ってはいけません。セキュリティ上のリスクがあります。数式や JSON のパース、テンプレートの評価といった用途に応じて、専用のパース用ライブラリを使ってください。

</Note>