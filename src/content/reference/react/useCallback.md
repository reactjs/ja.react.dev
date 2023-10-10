---
title: useCallback
---

<Intro>

`useCallback` は、再レンダー間で関数定義をキャッシュできるようにする React フックです。

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

コンポーネントのトップレベルで `useCallback` を呼び出し、再レンダー間で関数定義をキャッシュします。

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `fn`: キャッシュしたい関数型の値。任意の引数を取り、任意の値を返すことができます。React は初回のレンダー時にはその関数をそのまま返します（呼び出しません！）。次回以降のレンダーでは、ひとつ前のレンダー時から `dependencies` が変更されていない場合、React は再び同じ関数を返します。それ以外の場合は、今回のレンダー時に渡された関数を返しつつ、後で再利用できる場合に備えて保存します。React は関数を呼び出しません。関数自体が返されるので、呼ぶか呼ばないか、いつ呼ぶのかについてはあなたが決定できます。

* `dependencies`: `fn` コード内で参照されるすべてのリアクティブな値のリストです。リアクティブな値には、props、state、コンポーネント本体に直接宣言されたすべての変数および関数が含まれます。リンタが [React 用に設定されている場合](/learn/editor-setup#linting)、すべてのリアクティブな値が依存値として正しく指定されているか確認できます。依存値のリストは要素数が一定である必要があり、`[dep1, dep2, dep3]` のようにインラインで記述する必要があります。React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使った比較で、それぞれの依存値を以前の値と比較します。

#### 返り値 {/*returns*/}

初回のレンダー時、`useCallback` は渡された `fn` 関数を返します。

その後のレンダー時には、前回のレンダーからすでに保存されている `fn` 関数を返すか（依存配列が変更されていない場合）、このレンダー時に渡された `fn` 関数を返します。

#### 注意点 {/*caveats*/}

* `useCallback` はフックですので、**コンポーネントのトップレベル**または独自のフックでのみ呼び出すことができます。ループや条件の中で呼び出すことはできません。それが必要な場合は、新しいコンポーネントを抽出し、その中にその状態を移動させてください。
* React は、**特定の理由がない限り、キャッシュされた関数を破棄しません**。たとえば、開発環境では、コンポーネントのファイルを編集すると React はキャッシュを破棄します。開発環境と本番環境の両方で、初回マウント時にコンポーネントがサスペンドすると、React はキャッシュを破棄します。将来的に、React はキャッシュを破棄することを活用したさらなる機能を追加するかもしれません。例えば、将来的に React が仮想化リストに対する組み込みサポートを追加する場合、仮想化されたテーブルのビューポートからスクロールアウトした項目のキャッシュを破棄することが理にかなっています。これは、`useCallback` をパフォーマンスの最適化として利用する場合に期待に沿った動作となります。そうでない場合は、[state 変数](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) や [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) の方が適切かもしれません。

---

## 使用法 {/*usage*/}

### コンポーネントの再レンダーをスキップする {/*skipping-re-rendering-of-components*/}

レンダーのパフォーマンスを最適化する際には、子コンポーネントに渡す関数をキャッシュする必要があることがあります。まずは、これを実現するための構文を見て、その後、どのような場合に便利かを見ていきましょう。

コンポーネントの再レンダー間で関数をキャッシュするには、その定義を `useCallback` フックでラップします。

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback` には 2 つの要素を渡す必要があります。

1. 再レンダー間でキャッシュしたい関数定義。
2. 関数内で使用される、コンポーネント内のすべての値を含む<CodeStep step={2}>依存値のリスト</CodeStep>。

初回のレンダー時に `useCallback` から<CodeStep step={3}>返される関数</CodeStep>、つまりあなたが受け取る関数は、あなたが渡した関数そのものになります。

次回以降のレンダーでは、React は<CodeStep step={2}>依存配列</CodeStep>を前回のレンダー時に渡した依存配列と比較します。（[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使った比較で）依存配列が変更されていない場合、`useCallback` は前回と同じ関数を返します。それ以外の場合、`useCallback` は*今回の*レンダーで渡された関数を返します。

言い換えると、`useCallback` は依存配列が変更されるまでの再レンダー間で関数をキャッシュします。

**例を通して、これが有用な場合を見ていきましょう**。

例えば、`ProductPage` から `ShippingForm` コンポーネントに `handleSubmit` 関数を渡しているとします。

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme` プロパティを切り替えるとアプリが一瞬フリーズすることに気付きましたが、JSX から `<ShippingForm />` を取り除くと、高速に感じられるのだとしましょう。これは `ShippingForm` コンポーネントの最適化を試みる価値があることを示してます。

**デフォルトでは、コンポーネントが再レンダーされると、React はその子要素全てを再帰的に再レンダーします**。これが、`ProductPage` が異なる `theme` で再レンダーされると、`ShippingForm` コンポーネント*も*再レンダーされる理由です。再レンダーに多くの計算を必要としないコンポーネントにとっては問題ありません。しかし、再レンダーが遅いことを確認できたなら、[`memo`](/reference/react/memo) でラップすることで、props が前回のレンダー時と同じである場合に `ShippingForm` に再レンダーをスキップするように指示することができます。

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**この変更により、すべての props が前回のレンダー時と*同じ*場合、`ShippingForm` は再レンダーをスキップするようになります**。ここで関数のキャッシュが重要になってきます！ `handleSubmit` を `useCallback` なしで定義したとしましょう。

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Every time the theme changes, this will be a different function...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* ... so ShippingForm's props will never be the same, and it will re-render every time */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**JavaScript では、`function () {}` または `() => {}` は常に*異なる*関数を作成します**。これは `{}` のオブジェクトリテラルが常に新しいオブジェクトを作成するのと似ています。通常、これは問題になりませんが、`ShippingForm` の props が決して同じにならないので [`memo`](/reference/react/memo) による最適化は機能しなくなるということでもあります。このようなときに有用になってくるのが `useCallback` です。

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // Tell React to cache your function between re-renders...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...so as long as these dependencies don't change...

  return (
    <div className={theme}>
      {/* ...ShippingForm will receive the same props and can skip re-rendering */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**`handleSubmit` を `useCallback` でラップすることで、再レンダー間でそれを*同一の*関数にすることができます**（依存配列が変更されるまで）。それをする特定の理由がない限り、関数を `useCallback` でラップする*必要はありません*。今回の例における理由とは、この関数を [`memo`](/reference/react/memo) でラップされたコンポーネントに渡せば再レンダーをスキップできるということです。このページの後半で説明されているように、`useCallback` が必要な他の理由もあります。

<Note>

**`useCallback` はパフォーマンスの最適化としてのみ用いるべきです**。もしコードがそれなしでは動作しない場合は、背後にある問題を見つけてまずそれを修正してください。その後、`useCallback` を再度追加することができます。

</Note>

<DeepDive>

#### useCallback と useMemo の関係 {/*how-is-usecallback-related-to-usememo*/}

`useCallback` と並んで [`useMemo`](/reference/react/useMemo) をよく見かけることでしょう。子コンポーネントを最適化しようとするとき、どちらも有用です。これらはあなたが下位に渡している何かを[メモ化する (memoize)](https://en.wikipedia.org/wiki/Memoization)（言い換えると、キャッシュする）ことを可能にします。

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Calls your function and caches its result
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Caches your function itself
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

その違いはキャッシュできる*内容*です。

* **[`useMemo`](/reference/react/useMemo) はあなたの関数の呼び出し*結果*をキャッシュします**。この例では、`product` が変更されない限り、`computeRequirements(product)` の呼び出し結果をキャッシュします。これにより、`ShippingForm` を不必要に再レンダーすることなく、`requirements` オブジェクトを下位に渡すことができます。必要に応じて、React はレンダー中にあなたが渡した関数を呼び出して結果を計算します。
* **`useCallback` は*関数自体*をキャッシュします**。`useMemo` とは異なり、あなたが提供する関数を呼び出しません。代わりに、あなたが提供した関数をキャッシュして、`productId` または `referrer` が変更されない限り、`handleSubmit` *自体*が変更されないようにします。これにより、`ShippingForm` を不必要に再レンダーすることなく、`handleSubmit` 関数を下位に渡すことができます。ユーザがフォームを送信するまであなたのコードは実行されません。

すでに [`useMemo`](/reference/react/useMemo) に詳しい場合、`useCallback` を次のように考えると役立つかもしれません。

```js
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[`useMemo` と `useCallback` の違いについてもっと読む](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### すべてに useCallback を追加すべきか？ {/*should-you-add-usecallback-everywhere*/}

あなたのアプリがこのサイトのように、ほとんどのインタラクションが大まかなもの（ページ全体やセクション全体の置き換えなど）である場合、メモ化は通常不要です。一方、あなたのアプリが描画エディタのようなもので、ほとんどのインタラクションが細かい（形状の移動など）場合、メモ化は非常に役立つかもしれません。

`useCallback` で関数をキャッシュすることが有用なのはいくつかのケースに限られます。

- それを [`memo`](/reference/react/memo) でラップされたコンポーネントに props として渡すケース。値が変わらないなら再レンダーをスキップしたいことでしょう。メモ化により、依存配列が変更された場合にのみ、コンポーネントが再レンダーされるようになります。
- あなたが渡している関数が、後で何らかのフックの依存値として使用されるケース。たとえば、他の `useCallback` でラップされた関数がそれに依存している、または [`useEffect`](/reference/react/useEffect) からこの関数に依存しているケースです。

その他のケースで関数を `useCallback` でラップする利点はありません。それを行っても重大な害はないため、一部のチームは個々のケースについて考えず、可能な限り多くをメモ化することを選択します。欠点は、コードが読みにくくなることです。また、すべてのメモ化が効果的なわけではありません。「毎回新しい」値がひとつあるだけで、コンポーネントのメモ化は全く機能しなくなってしまいます。

`useCallback` は関数の*作成*を防ぐわけではないことに注意してください。あなたは常に関数を作成しています（それは問題ありません！）。しかし、何も変わらない場合、React はそれを無視し、キャッシュされた関数を返します。

**実際には、以下のいくつかの原則に従うことで、多くのメモ化を不要にすることができます**。

1. コンポーネントが他のコンポーネントを視覚的にラップするときは、それが[子として JSX を受け入れるようにします](/learn/passing-props-to-a-component#passing-jsx-as-children)。これにより、ラッパコンポーネントが自身の state を更新しても、React はその子を再レンダーする必要がないことを認識します。
1. ローカル state を優先し、必要以上に [state のリフトアップ](/learn/sharing-state-between-components)を行わないようにします。フォームや、アイテムがホバーされているかどうかのような頻繁に変わる state を、ツリーのトップやグローバル状態ライブラリに保持しないでください。
1. [レンダーロジックを純粋に](/learn/keeping-components-pure)保ちます。コンポーネントの再レンダーが問題を引き起こしたり、何らかの目に見える視覚的な結果を生じたりする場合、それはあなたのコンポーネントのバグです！ メモ化を追加するのではなく、バグを修正します。
1. [state を更新する不要なエフェクトを避けてください](/learn/you-might-not-need-an-effect)。React アプリケーションのパフォーマンス問題の大部分は、エフェクト内での連鎖的な state 更新によってコンポーネントのレンダーが何度も引き起こされるために生じます。
1. [エフェクトから不要な依存値をできるだけ削除します](/learn/removing-effect-dependencies)。例えば、メモ化の代わりに、あるオブジェクトや関数をエフェクトの内側、あるいはコンポーネント外部に移動させる方が簡単なことがよくあります。

特定のインタラクションの遅延をまだ感じる場合は、[React Developer Tools のプロファイラを使用して](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)どのコンポーネントをメモ化することが最も有益か確認し、必要な場所にメモ化を追加してください。上記の原則に従うことでコンポーネントのデバッグと理解が容易になるため、いかなる場合でも従っておくことは良いことです。長期的には、この問題を一挙に解決できる[自動的なメモ化](https://www.youtube.com/watch?v=lGEMwh32soc)について研究を行っています。

</DeepDive>

<Recipes titleText="useCallback と直接関数を宣言することの違い" titleId="examples-rerendering">

#### `useCallback` と `memo` を使用して再レンダーをスキップする {/*skipping-re-rendering-with-usecallback-and-memo*/}

この例では、`ShippingForm` コンポーネントを**人為的に遅く**しているため、あなたがレンダーしている React コンポーネントが本当に遅いときに何が起こるかを見ることができます。カウンタを増加させたり、テーマを切り替えたりしてみてください。

カウンタの増加は遅く感じられますが、これは低速な `ShippingForm` を再レンダーせざるを得ないからです。カウンタが変更され、ユーザが行った選択を画面上に反映する必要があるのですから、これ自体は予想通りの動作です。

次に、テーマを切り替えてみてください。**人為的に遅くしているにも関わらず、`useCallback` と [`memo`](/reference/react/memo) を組み合わせたおかげで高速に動作しています**！ `ShippingForm` は、`handleSubmit` 関数が変更されていないため、再レンダーをスキップしました。`handleSubmit` 関数は変更されていません。なぜなら、`productId` と `referrer`（あなたの `useCallback` の依存値）のいずれも、最後のレンダー以降に変更されていないからです。

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 常にコンポーネントを再レンダーする {/*always-re-rendering-a-component*/}

この例でも、`ShippingForm` の実装を**人為的に遅く**してあり、レンダーしている React コンポーネントが本当に遅いときに何が起こるかを見ることができます。カウンタを増加させたり、テーマを切り替えたりしてみてください。

前の例とは異なり、今度はテーマの切り替えも低速です！ これは、**このバージョンには `useCallback` の呼び出しがないため**、`handleSubmit` は常に新しい関数であり、遅くなっている `ShippingForm` コンポーネントの再レンダーをスキップできないからです。

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Do nothing for 500 ms to emulate extremely slow code
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


しかし、以下は**人為的な遅さを取り除いた**同じコードです。`useCallback` が無いことに、気づくほどの影響があるでしょうか？

<Sandpack>

```js App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Imagine this sends a request...
  console.log('POST /' + url);
  console.log(data);
}
```

```js ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


かなりの頻度で、メモ化なしのコードでも問題なく動作します。あなたのインタラクションが十分に速い場合、メモ化は必要ありません。

あなたのアプリが遅くなっている真の理由を把握するためには、React を本番モードで実行し、[React Developer Tools](/learn/react-developer-tools) を無効にし、あなたのアプリのユーザが使用しているデバイスと同様のデバイスを使用する必要があることに留意してください。

<Solution />

</Recipes>

---

### メモ化されたコールバックからの state 更新 {/*updating-state-from-a-memoized-callback*/}

場合によっては、メモ化されたコールバックから前回の state に基づいて state を更新する必要があります。

この `handleAddTodo` 関数は、次の todo リストを計算するために `todos` を依存値として指定します。

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

通常、メモ化された関数からは可能な限り依存値を少なくしたいと思うでしょう。何らかの state を次の state を計算するためだけに読み込んでいる場合、代わりに[更新用関数 (updater function)](/reference/react/useState#updating-state-based-on-the-previous-state) を渡すことでその依存値を削除できます。

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

ここでは、`todos` を依存値として内部で読み込む代わりに、*どのように* state を更新するかについての指示（`todos => [...todos, newTodo]`）を React に渡します。[更新用関数についての詳細はこちら](/reference/react/useState#updating-state-based-on-the-previous-state)。

---

### エフェクトが頻繁に発火するのを防ぐ {/*preventing-an-effect-from-firing-too-often*/}

時々、[エフェクト](/learn/synchronizing-with-effects) の内部から関数を呼び出したいことがあるかもしれません。

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

これには問題があります。[全てのリアクティブな値はエフェクトの依存値として宣言されなければなりません](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency)。しかし、`createOptions` を依存値として宣言すると、あなたのエフェクトがチャットルームに常に再接続することになります。


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Problem: This dependency changes on every render
  // ...
```

これを解決するために、エフェクトから呼び出す必要がある関数を `useCallback` でラップすることができます。

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Only changes when roomId changes

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Only changes when createOptions changes
  // ...
```

これにより、`roomId` が同じ場合に再レンダー間で `createOptions` 関数が同じであることが保証されます。**しかし、関数型の依存値を必要としないようにする方がさらに望ましいでしょう**。関数をエフェクトの*内部*に移動します。

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ No need for useCallback or function dependencies!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Only changes when roomId changes
  // ...
```

これでコードはよりシンプルになり、`useCallback` が不要になりました。[エフェクトの依存値の削除についてさらに学ぶ](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)。

---

### カスタムフックの最適化 {/*optimizing-a-custom-hook*/}

あなたが[カスタムフック](/learn/reusing-logic-with-custom-hooks)を書いている場合、それが返すあらゆる関数は `useCallback` でラップすることが推奨されます。

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

これにより、フックを利用する側が必要に応じて自身のコードを最適化することができます。

---

## トラブルシューティング {/*troubleshooting*/}

### コンポーネントがレンダーするたびに `useCallback` が異なる関数を返す {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

第 2 引数として依存配列を指定したかを確認してください！

依存配列を忘れると、`useCallback` は毎回新しい関数を返します。

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Returns a new function every time: no dependency array
  // ...
```

以下は、第 2 引数として依存配列を渡す修正版です。

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Does not return a new function unnecessarily
  // ...
```

これでもうまくいかない場合、問題は、少なくとも 1 つの依存値が前回のレンダーと異なることです。依存値を手動でコンソールにログ出力することで、この問題をデバッグできます。

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

その後、コンソール内の異なる再レンダーからの配列を右クリックすると、それぞれに対して「グローバル変数として保存」が選択できます。最初のものが `temp1` として、2 つ目が `temp2` として保存されたと仮定すると、ブラウザのコンソールを使用して、両方の配列内の各依存値が同一であるかどうかを以下のように確認できます。

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

メモ化を壊している依存値を見つけたら、それを取り除く方法を見つけるか、または[それもメモ化します。](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### ループ内の各リスト要素で `useCallback` を呼び出す必要があるが、それは許されていない {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` コンポーネントが [`memo`](/reference/react/memo) でラップされていると仮定します。`ReportList` コンポーネントが再レンダーするときに、リスト内の `Chart` がすべて再レンダーされてしまわないよう、一部をスキップしたいとしましょう。しかし、ループの中で `useCallback` を呼び出すことはできません。

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 You can't call useCallback in a loop like this:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

代わりに、個々のアイテムに対応するコンポーネントを抽出し、その中に `useCallback` を配置します。

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ Call useCallback at the top level:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

もしくは、最後のスニペットから `useCallback` を削除し、代わりに `Report` 自体を [`memo`](/reference/react/memo) でラップすることもできます。`item` プロパティが変更されない場合、`Report` は再レンダーをスキップするため、`Chart` も再レンダーをスキップします。

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
