---
title: はじめに
---

<Intro>
React Compiler は、React アプリを自動的に最適化する新しいビルド時ツールです。プレーンな JavaScript で動作し、[React のルール](/reference/rules) を理解しているため、コードを書き直すことなく使用できます。
</Intro>

<YouWillLearn>

* React Compiler の機能
* React Compiler の導入方法
* 段階的な導入戦略
* 問題が発生した際のデバッグとトラブルシューティング
* React ライブラリでのコンパイラの使用方法

</YouWillLearn>

## React Compiler の機能 {/*what-does-react-compiler-do*/}

React Compiler は、ビルド時に React アプリケーションを自動的に最適化します。React は最適化なしでも十分に高速ですが、アプリの応答性を保つために、コンポーネントや値を手動でメモ化する必要がある場合があります。このメモ化は面倒で、間違いやすく、コードのメンテナンス性を損ねます。React Compiler はこの最適化を自動的に行い、開発者は機能開発に集中できるようになります。

### React Compiler を使用しない場合 {/*before-react-compiler*/}

再レンダーを最適化するためにコンポーネントや値をメモ化する必要があります。

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```


<Note>

この手動でのメモ化には、メモ化を破壊してしまう気づきづらいバグがあります。

```js [[2, 1, "() => handleClick(item)"]]
<Item key={item.id} onClick={() => handleClick(item)} />
```

`handleClick` は `useCallback` でラップされていますが、アロー関数 `() => handleClick(item)` はコンポーネントがレンダーされるたびに新しい関数を作成します。つまり `Item` は常に新しい `onClick` プロパティを受け取っていることになり、メモ化が動作しなくなります。

React Compiler は、アロー関数の使用の有無にかかわらず、これを正しく最適化でき、`props.onClick` が変更されたときにのみ `Item` が再レンダーされることを保証します。

</Note>

### React Compiler を使用する場合 {/*after-react-compiler*/}

メモ化なしで同じコードを書くことができます。

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

*[React Compiler Playground でこの例を確認](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)*

React Compiler は最適なメモ化を自動で適用し、必要なときだけ再レンダーされるようにします。

<DeepDive>
#### React Compiler はどのようなメモ化を行うのか？ {/*what-kind-of-memoization-does-react-compiler-add*/}

React Compiler の自動メモ化は主に **更新パフォーマンスの向上**（既存コンポーネントの再レンダー）に焦点を当てており、主に以下の 2 つのユースケースに重点を置いています：

1. **コンポーネントの連鎖的な再レンダーのスキップ**
    * `<Parent />` の再レンダーにより、`<Parent />` のみが変更されたにも関わらず、そのコンポーネントツリー内の多くのコンポーネントが再レンダーされる
1. **React の外で行われる高コストな計算のスキップ**
    * 例えば、コンポーネントやフック内で `expensivelyProcessAReallyLargeArrayOfObjects()` を呼び出す場合

#### 再レンダーの最適化 {/*optimizing-re-renders*/}

React では、UI を現在の state（具体的には props、state、context）の関数として表現できます。現在の実装では、コンポーネントの state が変更されると、`useMemo()`、`useCallback()`、`React.memo()` による何らかのメモ化を適用していない限り、React はそのコンポーネント *そのすべての子要素* を再レンダーします。例えば、以下の例では、`<FriendList>` の state が変更されるたびに `<MessageButton>` が再レンダーされます：

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[*React Compiler Playground でこの例を確認*](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler はメモ化と同等の処理を自動的に適用し、state が変更されてもアプリの関連部分のみが再レンダーされることを保証します。これは細粒度のリアクティビティ（fine-grained reactivity）と呼ばれることもあります。上記の例では、React Compiler は `friends` が変更されても `<FriendListCard />` の返り値を再利用できると判断し、この JSX の再作成 *と* カウントの変更による `<MessageButton>` の再レンダーを回避できます。

#### 高コストな計算もメモ化される {/*expensive-calculations-also-get-memoized*/}

React Compiler は、レンダー中に使用される高コストな計算も自動的にメモ化できます：

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[*React Compiler Playground でこの例を確認*](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

ただし、`expensivelyProcessAReallyLargeArrayOfObjects` が本当に高コストな関数である場合は、React 外で独自のメモ化を実装することを検討することをお勧めします。理由は以下の通りです。

- React Compiler は React コンポーネントとフックのみをメモ化し、すべての関数をメモ化するわけではない
- React Compiler のメモ化は複数のコンポーネントやフック間で共有されない

そのため、`expensivelyProcessAReallyLargeArrayOfObjects` が多くの異なるコンポーネントで使用される場合、同じ入力が渡されたとしても、その高コストな計算が繰り返し実行されます。コードの修正を行う前に、[プロファイリング](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) を行って、本当にそれほど高コストかどうかを確認することをお勧めします。
</DeepDive>

## コンパイラを試すべきか？ {/*should-i-try-out-the-compiler*/}

すべての方に React Compiler の使用を開始することをお勧めします。ココンパイラは現在は任意機能ですが、将来的には一部の機能を完全に動作させるためにコンパイラが必要になる可能性があります。

### 安全に使用できるか？ {/*is-it-safe-to-use*/}

React Compiler は現在安定板であり、本番環境で広範囲にテストされています。Meta などの企業で本番環境で使用されていますが、あなたのアプリケーションでコンパイラを導入できるかどうかは、コードベースの健全性と [React のルール](/reference/rules)をどの程度遵守しているかに依存します。

## どのビルドツールがサポートされているか？ {/*what-build-tools-are-supported*/}

React Compiler は [いくつかのビルドツール](/learn/react-compiler/installation) で利用できます。具体的には Babel、Vite、Metro、Rsbuild などが含まれます。

React Compiler は主に、コアコンパイラを囲む軽量な Babel プラグインラッパーです。これは Babel 自体から分離されるように設計されています。コンパイラの最初の安定版は主に Babel プラグインとして残りますが、swc と [oxc](https://github.com/oxc-project/oxc/issues/10048) チームと協力して、React Compiler のファーストクラスサポートを構築しており、将来的にビルドパイプラインに Babel を追加する必要がなくなります。

Next.js を使用しているユーザは、[v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 以降のバージョンを利用することで、SWC 経由（swc‑invoked）の React Compiler を有効化できます。

## useMemo、useCallback、React.memo をどう扱うべきか？ {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

デフォルトでは、React Compiler はコードの分析結果とヒューリスティックに基づいてコードをメモ化します。ほとんどの場合このメモ化は、あなたが書くであろうものと同等か、それ以上に正確です。

ただし、場合によっては開発者がメモ化をより細かく制御する必要があるかもしれません。`useMemo` と `useCallback` フックは、React Compiler と併用して、どの値をメモ化するかを制御するための避難ハッチ (escape hatch) として使用し続けることができます。一般的なユースケースは、メモ化された値がエフェクトの依存値として使用される場合で、依存値が実質的に変化しないならエフェクトが繰り返し発火しないようにする、というものです。

新しいコードにおいては、メモ化をコンパイラに任せ、詳細な制御が必要な場合に `useMemo`/`useCallback` を使用することをお勧めします。

既存のコードの場合は、既存のメモ化をそのまま残すか（削除するとコンパイル出力が変わる可能性があります）、メモ化を削除する前に慎重にテストすることをお勧めします。

## React Compiler を試す {/*try-react-compiler*/}

このセクションでは、React Compiler の始め方と、プロジェクトで効果的に使用するための情報を提供します。

* **[インストール](/learn/react-compiler/installation)** - React Compiler をインストールし、ビルドツール用に設定する
* **[React バージョン互換性](/reference/react-compiler/target)** - React 17、18、19 のサポート
* **[設定](/reference/react-compiler/configuration)** - 特定のニーズに合わせてコンパイラをカスタマイズする
* **[段階的な導入](/learn/react-compiler/incremental-adoption)** - 既存のコードベースでコンパイラを段階的に展開する戦略
* **[デバッグとトラブルシューティング](/learn/react-compiler/debugging)** - コンパイラ使用時の問題の特定と修正
* **[ライブラリのコンパイル](/reference/react-compiler/compiling-libraries)** - コンパイルされたコードを配布するためのベストプラクティス
* **[API リファレンス](/reference/react-compiler/configuration)** - すべての設定オプションの詳細ドキュメント

## 追加情報 {/*additional-resources*/}

これらのドキュメントに加えて、コンパイラに関する追加情報や議論については [React Compiler Working Group](https://github.com/reactwg/react-compiler) を確認することをお勧めします。