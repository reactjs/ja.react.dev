---
id: hooks-custom
title: 独自フックの作成
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*フック (hook)* は React 16.8 で追加された新機能です。state などの React の機能を、クラスを書かずに使えるようになります。

自分独自のフックを作成することで、コンポーネントからロジックを抽出して再利用可能な関数を作ることが可能です。

以下のコンポーネントは[副作用フックの使い方](/docs/hooks-effect.html#example-using-hooks-1)について学んだ際に見たチャットアプリのコンポーネントであり、フレンドがオンラインかオフラインかを示すメッセージを表示します。

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

さて、このチャットアプリには連絡先リストもあって、そこではオンラインのユーザを緑色で表示したいとしましょう。新しい `FriendListItem` コンポーネントに似たようなロジックをコピーペーストしても構いませんが、それは理想的ではないでしょう：

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

代わりに、このロジックを `FriendStatus` と `FriendListeItem` 間で共有したいと思います。

これまで React には、ステートを有するロジックをコンポーネント間で共有するための人気の手法が 2 つありました。[レンダープロップ](/docs/render-props.html)と[高階コンポーネント](/docs/higher-order-components.html)です。ツリーに新しいコンポーネントを加える必要なしに、フックが同じ問題をどのように解決するのかを見ていきましょう。

## カスタムフックの抽出 {#extracting-a-custom-hook}

2 つの JavaScript の関数間でロジックを共有したい場合、それを別の関数に抽出します。コンポーネントもフックも関数ですので、同じ方法が使えます！

**カスタムフックとは、名前が "`use`" で始まり、ほかのフックを呼び出せる JavaScript の関数のことです。**例えば、以下の `useFriendStatus` が我々の最初のカスタムフックの例です：

```js{3}
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

新しいことは何もありません。ロジックは上記のコンポーネントからコピーしてきただけです。コンポーネントのときと同様に、他のフックを呼ぶときはカスタムフックのトップレベルで無条件に呼び出していることを確認してください。

React のコンポーネントと違い、カスタムフックは特定のシグネチャを持つ必要はありません。何を引数として受け取り、そして（必要なら）何を返すのか、といったことは自分で決めることができます。別の言い方をすると、普通の関数と同じだということです。一目で[フックのルール](/docs/hooks-rules.html)が適用されるものだと分かるようにするために、名前は `use` で始めるべきです。

この `useFriendStatus` の目的はフレンドのステータスを購読するというものです。ですので `friendID` を引数として持ち、そのフレンドがオンラインかどうかを返します。

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

ではこのカスタムフックの使い方を見ていきましょう。

## カスタムフックを使う {#using-a-custom-hook}

そもそもの我々の目的は `FriendStatus` と `FriendListItem` コンポーネントでの重複したロジックを取り除くことでした。どちらのコンポーネントもフレンドがオンラインかどうかを知りたいのです。

既にロジックを `useFriendStatus` フックへと抽出したので、それを*ただ単に使えばいい*のです：

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**このコードは元のコードと同等？** はい、全く同じように動作します。注意深く見れば、ふるまいに何の変更も加えていないということが分かります。やったのは、共通のコードを別の関数に抽出したということだけです。**カスタムフックは React の機能というよりは、フックの設計から自然と導かれる慣習のようなものです。**

**カスタムフックは "`use`" という名前で始めるべき？** ぜひそうしてください。この規約はとても重要です。この規約がなければ、ある関数が内部でフックを呼んでいるかどうかを知る方法がなくなり、[フックのルール](/docs/hooks-rules.html)の違反を自動でチェックすることができなくなります。

**同じフックを使うコンポーネントは state を共有する？** いいえ。カスタムフックは *state を使うロジック*（データの購読を登録したり現在の値を覚えておいたり）を共有するためのものですが、カスタムフックを使う場所ごとで、内部の state や副作用は完全に分離しています。

**どのようにしてカスタムフックは独立したステートを得るのか？** それぞれのフックの*呼び出し*が独立した state を得ます。`useFriendStatus` を直接呼びだしていますので、React から見れば我々のコンポーネントが `useState` や `useEffect` を呼んだ場合と変わりません。すでに[ここ](/docs/hooks-state.html#tip-using-multiple-state-variables)や[ここ](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns)で学んだ通り、`useState` や `useEffect` はひとつのコンポーネント内で複数回呼ぶことができ、それらは完全に独立しています。

### ヒント：フック間で情報を受け渡す {#tip-pass-information-between-hooks}

フックは関数ですので、フック間で情報を受け渡すことができます。

これを例示するため、我々のチャットの例で、別のコンポーネントを使うことにしましょう。これはチャットの受信者を選ぶ画面であり、現在選択中のフレンドがオンラインかどうかを表示します。

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

現在選択中のフレンド ID を `recipientID` という state 変数に保持し、`<select>` ピッカー内で別のフレンドが選択されるごとにそれを更新します。

`useState` フックは `recipientID` という state 変数の最新の値を返しますので、それを `useFriendStatus` カスタムフックに引数として渡すことができます。

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

これにより*現在選択中の*フレンドがオンラインかどうかが分かります。別のフレンドを選択して `recipientID` 変数が更新された場合、`useFriendStatus` フックはこれまで選択されていたフレンドを購読解除して、新しく選択されたフレンドのステータスを購読開始します。

## `useYourImagination()` {#useyourimagination}

カスタムフックにより、これまでの React コンポーネントでは不可能であった、ロジック共有に関する柔軟性が得られます。フォーム操作、アニメーション、宣言的データ購読、タイマー、さらには我々が思いついたことのない多様なユースケースに対するカスタムフックを記述することが可能です。何より、作ったカスタムフックは React の組み込み機能と同じくらい簡単に使えるようになるのです。

あまり焦って抽象化を加えないようにしましょう。関数コンポーネントがやれることが増えたので、平均的な関数コンポーネントはこれまでより長いものになるでしょう。それは普通のことですので、いますぐカスタムフックに分割しないと*いけない*とは考えないでください。一方で、カスタムフックをどこで使えば複雑なロジックをシンプルなインターフェースに置き換えたり、ごちゃっとしたコンポーネントを整理したりできるのか、考え始めることをお勧めします。

一例として、その場しのぎで多くのローカル state が含まれるようになった複雑なコンポーネントをお持ちかもしれません。`useState` を使っても更新ロジックの集中化が簡単になるわけではありませんので、それを [Redux](https://redux.js.org/) のリデューサ (reducer) で書きたくなることがあるでしょう：

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

リデューサは単独でのテストが非常にやりやすく、複雑な更新ロジックを表現する場合でもスケールします。必要に応じて後でより小さなリデューサに分割することも可能です。しかし、React のローカル state による手軽さの方が好ましい場合もあるでしょうし、他のライブラリをインストールしたくない場合もあるでしょう。

そこで、`useReducer` というフックを書いて、コンポーネントの*ローカル* state をリデューサで管理できるとしたらどうでしょうか？ 簡略版では以下のようなものになるでしょう：

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

これをコンポーネント内で使うことができ、リデューサを活用してステート管理ができるようになります：

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

ローカルステートをリデューサで管理したいという要求はとてもよくあるので、React にその機能を含めてあります。[フック API リファレンス](/docs/hooks-reference.html)で他の組み込みフックと共に解説しています。
