---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` は CSS-in-JS ライブラリの作者向けです。CSS-in-JS ライブラリの開発をしておりスタイルを挿入する場所を必要としているのでない限り、おそらく [`useEffect`](/reference/react/useEffect) または [`useLayoutEffect`](/reference/react/useLayoutEffect) の方が適切です。

</Pitfall>

<Intro>

`useInsertionEffect` は [`useEffect`](/reference/react/useEffect) の一種ですが、DOM の書き換えを行う前に実行されます。

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

DOM の変更前にスタイルを挿入するために `useInsertionEffect` を呼び出します。

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inject <style> tags here ...
  });
  return rule;
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `setup`: エフェクトのロジックが記述された関数です。このセットアップ関数は、オプションで*クリーンアップ*関数を返すことができます。コンポーネントが初めて DOM に追加されると、React はセットアップ関数を実行します。依存配列 (dependencies) が変更された再レンダー時には、React はまず古い値を使ってクリーンアップ関数（あれば）を実行し、次に新しい値を使ってセットアップ関数を実行します。コンポーネントが DOM から削除された後、React はクリーンアップ関数を最後にもう一度実行します。
 
* **省略可能** `dependencies`: `setup` コード内で参照されるすべてのリアクティブな値のリストです。リアクティブな値には、props、state、コンポーネント本体に直接宣言されたすべての変数および関数が含まれます。リンタが [React 用に設定されている場合](/learn/editor-setup#linting)、すべてのリアクティブな値が依存値として正しく指定されているか確認できます。依存値のリストは要素数が一定である必要があり、`[dep1, dep2, dep3]` のようにインラインで記述する必要があります。React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使った比較で、それぞれの依存値を以前の値と比較します。この引数を省略すると、エフェクトはコンポーネントの毎回のレンダー後に再実行されます。

#### 返り値 {/*returns*/}

`useInsertionEffect` は `undefined` を返します。

#### 注意点 {/*caveats*/}

* エフェクトはクライアント上でのみ実行されます。サーバレンダリング中には実行されません。
* `useInsertionEffect` の内部から state を更新することはできません。
* `useInsertionEffect` が実行される時点では、まだ ref はアタッチされておらず、DOM も更新されていません。

---

## 使用法 {/*usage*/}

### CSS-in-JS ライブラリからの動的スタイル注入 {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

従来、React コンポーネントのスタイル付けはプレーンな CSS を使用して行われていました。

```js
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
```

チームによっては、CSS ファイルを書く代わりに JavaScript コード内で直接スタイルを記述することを好む場合があります。これには通常、CSS-in-JS ライブラリやツールが必要です。CSS-in-JS には以下の 3 つの一般的なアプローチがあります。

1. コンパイラを使用した CSS ファイルへの静的な抽出
2. インラインスタイル、例えば `<div style={{ opacity: 1 }}>`
3. `<style>` タグのランタイム時の注入

CSS-in-JS を使用する場合、最初の 2 つのアプローチの組み合わせ（静的スタイルには CSS ファイル、動的スタイルにはインラインスタイル）を推奨します。**ランタイム時の `<style>` タグの注入は、以下の 2 つの理由から推奨しません：**

1. ランタイム時の注入は、ブラウザにスタイルの再計算を頻繁に強制します。
2. ランタイム時の注入は、React ライフサイクル中の間違ったタイミングで行われると非常に遅くなることがあります。

このうち最初の問題は解決不可能ですが、`useInsertionEffect` は 2 つ目の問題を解決するのに役立ちます。

DOM の変更前にスタイルを挿入するために `useInsertionEffect` を呼び出します。

```js {4-11}
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // As explained earlier, we don't recommend runtime injection of <style> tags.
    // But if you have to do it, then it's important to do in useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

`useEffect` と同様に、`useInsertionEffect` はサーバ上では実行されません。サーバ上でどの CSS ルールが使用されたかを収集する必要がある場合、レンダー中に行うことができます。

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[`useInsertionEffect` でランタイム時にスタイルを注入するよう CSS-in-JS ライブラリをアップグレードする場合の詳細](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### この手法がレンダー中や useLayoutEffect でスタイルを注入するより優れている理由 {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

レンダー中、React が[非ブロッキング更新](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition)を処理している最中にスタイルを挿入すると、ブラウザはコンポーネントツリーのレンダー中に毎フレームスタイルを再計算することになり、これは**非常に遅くなる**ことがあります。

`useInsertionEffect` は、[`useLayoutEffect`](/reference/react/useLayoutEffect) や [`useEffect`](/reference/react/useEffect) でスタイルを挿入するよりも優れています。なぜなら、他のエフェクトがあなたのコンポーネントで実行される時点で `<style>` タグがすでに挿入されていることが保証されるからです。さもないと、古くなったスタイルにより、通常のエフェクトでのレイアウト計算が正しくなくなってしまいます。

</DeepDive>
