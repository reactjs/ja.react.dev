---
title: レンダーとコミット
---

<Intro>

コンポーネントは、画面上に表示される前に React によってレンダーされる必要があります。このプロセスが踏む段階を理解すると、コードがどのように実行されるのか考える際や、コードの振る舞いを説明する際に役立ちます。

</Intro>

<YouWillLearn>

* React での「レンダー」の意味
* いつ、なぜ React はコンポーネントをレンダーするのか
* 画面上にコンポーネントが表示されるステップ
* レンダーしたからといって DOM が更新されるとは限らない理由

</YouWillLearn>

コンポーネントが料理人として厨房に立ち、食材を調理して美味しい料理を作っている様子をイメージしてみてください。このシナリオにおいて React はウェイターです。お客様の注文を伝えて、できた料理をお客様に渡します。この UI の「注文」と「提供」のプロセスは、次の 3 つのステップからなります：

1. レンダーの**トリガ**（お客様の注文を厨房に伝える）
2. コンポーネントの**レンダー**（厨房で注文の品を料理する）
3. DOM への**コミット**（テーブルに注文の品を提供する）

<IllustrationBlock sequential>
  <Illustration caption="トリガ" alt="レストランのウェイター役の React が、ユーザから注文を聞き取って、コンポーネントの厨房に渡している。" src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="レンダー" alt="Card シェフが React に出来立ての Card コンポーネントを渡している。" src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="コミット" alt="React がユーザの座っているテーブルに Card を提供している。" src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## ステップ 1：レンダーのトリガ {/*step-1-trigger-a-render*/}

コンポーネントがレンダーされる理由には 2 つあります。

1. コンポーネントの**初回レンダー**。
2. コンポーネント（またはその祖先のいずれか）の **state の更新**。

### 初回レンダー {/*initial-render*/}

アプリが開始するときには、初回のレンダーをトリガする必要があります。フレームワークやサンドボックスは、しばしばこのコードを隠蔽しますが、自力で行う場合には、ターゲットとなる DOM ノードに対して [`createRoot`](/reference/react-dom/client/createRoot) を呼び出し、作成されたルートの `render` メソッドを、コンポーネントに対して呼び出します。

<Sandpack>

```js index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

`root.render()` の呼び出しをコメントアウトして、コンポーネントが消えるのを確認してみてください！

### state 更新後の再レンダー {/*re-renders-when-state-updates*/}

コンポーネントが最初にレンダーされた後、[`set` 関数](/reference/react/useState#setstate)を使って state を更新することで、さらなるレンダーをトリガすることができます。コンポーネントの state を更新すると、自動的にレンダーがキューイングされます。（これは、レストランの客が最初の注文の後に、喉の渇きや空腹の状態に応じてお茶やデザートなどいろいろなものを注文するようなものだと考えることができます。）

<IllustrationBlock sequential>
  <Illustration caption="state の更新が..." alt="レストランのウェイター役の React が Card UI を提供したところ。矢印頭の顧客は、黒ではなく、ピンクのカードが欲しいのだと注文している。" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="... トリガになって ..." alt="React はコンポーネントの厨房に戻り、ピンクの Card が必要だと Card シェフに伝える。" src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="... レンダーされる！" alt="Card シェフはピンクのカードを React に渡している。" src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## ステップ 2：React がコンポーネントをレンダー {/*step-2-react-renders-your-components*/}

あなたがレンダーをトリガした後、React はコンポーネントを呼び出して画面に表示する内容を把握します。**「レンダー」とは、React がコンポーネントを呼び出すことです。**

* **初回レンダー時**、React はルート (root) コンポーネントを呼び出します。
* **次回以降のレンダー**では、state の更新によってレンダーがトリガされた関数コンポーネントを、React が呼び出します。

このプロセスは再帰的に発生します。更新されたコンポーネントが他のコンポーネントを返す場合、次に*その*コンポーネントを React がレンダーし、そのコンポーネントも何かコンポーネントを返す場合、*その*コンポーネントも次にレンダーし、といった具合に続きます。このプロセスは、ネストされたコンポーネントがなくなり、React が画面に表示されるべき内容を知り尽くすまで続きます。

次の例では、React は `Gallery()` を呼び出した後、`Image()` を何度も呼び出します。

<Sandpack>

```js Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **初回レンダー時には**、React は `<section>`、`<h1>`、および 3 つの `<img>` タグの [DOM ノードを作成](https://developer.mozilla.org/docs/Web/API/Document/createElement)します。
* **再レンダー時には**、React は前回のレンダーからどの部分が変わったのか、あるいは変わらなかったのかを計算します。次のステップであるコミットフェーズまでこの情報は使われません。

<Pitfall>

レンダーは常に[純粋な計算](/learn/keeping-components-pure)であるべきです。

* **同じ入力には同じ出力**。同じ入力が与えられた場合、コンポーネントは常に同じ JSX を返す必要がある。（トマトサラダを注文した人がオニオンサラダを受け取ってはいけない！）
* **自分の仕事に専念する**。レンダー前に存在したオブジェクトや変数を変更しない。（ある注文が他の誰かの注文を変更してはいけない。）

これを守らなかった場合、コードベースが複雑になるにつれて、ややこしいバグや予測不能な挙動に遭遇することになります。"Strict Mode" で開発している場合、React は各コンポーネントの関数を 2 回呼び出すことで、純粋でない関数が引き起こす間違いに気づきやすくしてくれます。

</Pitfall>

<DeepDive>

#### パフォーマンスの最適化 {/*optimizing-performance*/}

更新されたコンポーネントがツリー内で非常に高い位置にある場合、その内部にネストされたすべてのコンポーネントを再レンダーするというデフォルトの挙動は、パフォーマンスにとって理想的ではありません。パフォーマンスの問題に遭遇した場合、[パフォーマンス](https://reactjs.org/docs/optimizing-performance.html)セクションで述べられているいくつかのオプトインによる解決方法があります。**早まった最適化をしてしまってはいけません！**

</DeepDive>

## ステップ 3：React が DOM への変更をコミットする {/*step-3-react-commits-changes-to-the-dom*/}

あなたのコンポーネントをレンダー（関数として呼び出し）した後、React は DOM を変更します。

* **初回レンダー時には**、React は [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API を使用して、作成したすべての DOM ノードを画面に表示します。
* **再レンダー時には**、React は最新のレンダー出力に合わせて DOM を変更するため、必要な最小限の操作（レンダー中に計算されたもの！）を適用します。

**React はレンダー間で違いがあった場合にのみ DOM ノードを変更します**。例えば、以下のコンポーネントは親から渡された異なる props で毎秒再レンダーされます。実際に試してみてください。`<input>` にテキストを追加して `value` を更新することができますが、コンポーネントが再レンダーされる瞬間もテキストが消えることはありません：

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

これが上手く動作するのは、最終ステップで React によって更新されるのが、新しい `time` の値で更新される `<h1>` の中身だけだからです。`<input>` は JSX 内で前回と同じ場所にあるので、React は `<input>` やその `value` に触れません！
## エピローグ：ブラウザのペイント {/*epilogue-browser-paint*/}

レンダーが完了し、React が DOM を更新した後、ブラウザは画面を再描画します。このプロセスは「ブラウザレンダリング」として知られていますが、我々は、混乱を避けるために、ドキュメント全体を通して「ペイント」と呼ぶことにします。

<Illustration alt="ブラウザが「カード要素と静物画」をペイントしている" src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* React アプリでの画面更新は、以下の 3 つのステップで行われる：
  1. トリガ
  2. レンダー
  3. コミット
* Strict Mode を使って、コンポーネントの間違いを発見できる。
* レンダー結果が前回と同一である場合、React は DOM を触らない。

</Recap>

