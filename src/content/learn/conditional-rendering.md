---
title: 条件付きレンダー
---

<Intro>

様々な条件によって、コンポーネントに表示させる内容を変化させたいことがあります。React では、JavaScript の `if` 文や `&&`、`? :` 演算子などの構文を使うことで、JSX を条件付きでレンダーできます。

</Intro>

<YouWillLearn>

* 条件に応じて異なる JSX を返す方法
* JSX の一部を条件によって表示したり除外したりする方法
* React コードベースでよく使われる条件式のショートカット記法

</YouWillLearn>

## 条件を満たす場合に JSX を返す {/*conditionally-returning-jsx*/}

例えば、複数の `Item` をレンダーする `PackingList` コンポーネントがあり、各 `Item` に梱包が終わっているかどうか表示させたいとしましょう。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

複数の `Item` コンポーネントのうち一部のみで `isPacked` プロパティが `false` ではなく `true` になっていることに注意してください。目的は、`isPacked={true}` の場合にのみチェックマーク (✔) を表示させることです。

これは [`if`/`else` 文](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)を使って、以下のように書くことができます。

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

`isPacked` プロパティが `true` だった場合、このコードは**異なる JSX ツリーを返します**。この変更により、一部のアイテムの末尾にチェックマークが表示されます。

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

それぞれの場合に返される内容を編集してみて、表示がどのように変化するか確認しましょう。

条件分岐ロジックを実装するために JavaScript の `if` や `return` 文を使ったことに着目してください。React では、制御フロー（条件分岐など）は JavaScript で処理されます。

### `null` を使って何も返さないようにする {/*conditionally-returning-nothing-with-null*/}

場合によっては、何もレンダーしたくないことがあります。例えば、梱包済みの荷物は一切表示したくない、という場合です。コンポーネントは常に何かを返す必要があります。このような場合、`null` を返すことができます。

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

`isPacked` が `true` の場合、コンポーネントは「何も表示しない」という意味で `null` を返します。それ以外の場合、レンダーする JSX を返します。

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

実際には、レンダーしようとしている開発者を混乱させる可能性があるため、コンポーネントから `null` を返すことは一般的ではありません。代わりに、親コンポーネント側の JSX で条件付きでコンポーネントを含めたり除外したりすることが多いでしょう。以下はその方法です。

## 条件付きで JSX を含める {/*conditionally-including-jsx*/}

前の例では、コンポーネントが複数の JSX ツリーのうちどれを返すのか（あるいは何も返さないのか）をコントロールしていました。しかし、レンダー出力に重複があることに気付かれたでしょう。

```js
<li className="item">{name} ✔</li>
```

これは以下とほとんど同じです。

```js
<li className="item">{name}</li>
```

どちらの分岐も `<li className="item">...</li>` を返しています。

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

この重複に実害はありませんが、コードの保守性は悪化してしまいます。たとえば `className` を変更したくなったら？ コード内の 2 か所で変更が必要になってしまいますよね。このような状況では、条件付きで小さな JSX を含めることで、コードをより [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) に保つことができます。

### 条件 (三項) 演算子 (`? :`) {/*conditional-ternary-operator--*/}

JavaScript には、条件式を書くためのコンパクトな構文があります。それが[条件演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)または「三項 (ternary) 演算子」と呼ばれるものです。

以下のコードは：

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

代わりに以下のように書くことができます：

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

これは「*`isPacked` が true なら `name + ' ✔'` をレンダーし、それ以外 (`:`) の場合は `name` をレンダーする*」というように読んでください。

<DeepDive>

#### この 2 つの例は完全に同等か？ {/*are-these-two-examples-fully-equivalent*/}

オブジェクト指向プログラミングのバックグラウンドをお持ちの場合、2 つの例の一方では `<li>` の「インスタンス」が 2 つ作られるため、これらがわずかに異なると考えてしまうかもしれません。しかし JSX 要素は内部に状態を持たず、実際の DOM 要素でもないため、「インスタンス」ではありません。JSX は軽量な「説明書き」であり設計図のようなものです。従って上記の 2 つの例は実際に完全に同等です。[Preserving and Resetting State](/learn/preserving-and-resetting-state) を参照してください。

</DeepDive>

次に、梱包済みのアイテムを、取り消し線を表示する `<del>` のような別のタグで囲みたいとしましょう。このような場合、true と false のそれぞれの場合に対応する改行や括弧を追加することで、ネストされた JSX を読みやすくすることができます。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

これはシンプルな条件分岐の場合にはうまく動きますが、使いすぎないようにしましょう。条件のためのマークアップが増えすぎてコンポーネントが見づらくなった場合は、見やすくするために子コンポーネントを抽出することを検討してください。React ではマークアップはプログラミングコードの一種ですので、変数や関数といった道具を利用して複雑な式を読みやすく整頓することができます。

### 論理 AND 演算子 (`&&`) {/*logical-and-operator-*/}

もうひとつよく使われるショートカットは、[JavaScript の論理 AND (`&&`) 演算子](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.)です。React コンポーネント内で、条件が真の場合に JSX をレンダーし、**それ以外の場合は何もレンダーしない**という場合にしばしば使用されます。`&&` を使用すると、`isPacked` が `true` の場合にのみチェックマークを条件付きでレンダーできます。

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

これは「*`isPacked` なら (`&&`)、チェックマークをレンダーし、それ以外の場合には何もレンダーしない*」のように読んでください。

以下が完全に動作する例です：

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScript の && 式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) は、左側（条件）が `true` である場合、右側（今回の場合はチェックマーク）の値を返します。しかし、条件が `false` である場合、式全体が `false` になります。React は、`false` を JSX ツリーの「穴」と見なし、`null` や `undefined` と同様に、何もレンダーしません。


<Pitfall>

**`&&` の左辺に数値を置かない**

JavaScript は条件をテストする際、左の辺を自動的に真偽値に変換します。しかし、左の辺が `0` の場合は、式全体がその `0` という値に評価されてしまうため、React は何もレンダーしないのではなく `0` を表示します。

たとえば、よくある間違いとして `messageCount && <p>New messages</p>` のようにコードを書くことが挙げられます。`messageCount` が `0` の場合は何も表示しないと思われがちですが、実際には `0` そのものが表示されてしまいます！

これを修正するには、左の値を真偽値にしてください： `messageCount > 0 && <p>New messages</p>`。

</Pitfall>

### 条件付きで JSX を変数に割り当てる {/*conditionally-assigning-jsx-to-a-variable*/}

上記のようなショートカットを使って簡潔にコードを記述するのが難しいと感じた場合は、`if` 文と変数を使用してみてください。[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) で定義した変数は再代入も可能ですので、最初に表示したいデフォルトの値 (name) を指定します。

```js
let itemContent = name;
```

そして `if` 文を使って、`isPacked` が `true` の場合のみ `itemContent` に JSX 式を再割り当てします。

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[波括弧は「JavaScript への窓口」](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world)です。波括弧を使って JSX ツリーに変数を埋め込むことで、さきほど計算した値を JSX 内にネストすることができます。

```js
<li className="item">
  {itemContent}
</li>
```

このスタイルは最も長くなりますが、同時に最も柔軟です。以下が全体像です。

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

前述の通り、これはテキストのみでなく任意の JSX に対して使えます。

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

JavaScript に慣れていない場合、これだけ多様なスタイルがあると最初は圧倒されるかもしれません。しかし、これらを学ぶことは、React コンポーネントだけでなく、あらゆる JavaScript コードを読み書きできるようになるのにも役立ちます。最初は好みのスタイルを選んでスタートし、他のスタイルの仕組みを忘れた場合は、再度このリファレンスを参照してください。

<Recap>

* React では、JavaScript を使用して分岐ロジックを制御する。
* `if` 文を使用して、条件に応じて JSX 式を返すことができる。
* JSX 内で中身を条件付きで変数に保存し、波括弧を使用して他の JSX 内に含めることができる。
* JSX 内の `{cond ? <A /> : <B />}` は、「`cond` であれば `<A />` をレンダーし、そうでなければ `<B />` をレンダーする」という意味である。
* JSX 内の `{cond && <A />}` は、「`cond` であれば `<A />` をレンダーし、そうでなければ何もレンダーしない」という意味である。
* これらのショートカットは一般的だが、プレーンな `if` が好きなら必ずしも使わなくて良い。

</Recap>



<Challenges>

#### `? :` を使って未梱包アイコンを表示 {/*show-an-icon-for-incomplete-items-with--*/}

条件演算子 (`cond ? a : b`) を使って、`isPacked` が `true` でない場合は ❌ をレンダーするようにしてください。

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### `&&` 演算子を使ったアイテムの重要度の表示 {/*show-the-item-importance-with*/}

この例では、それぞれの `Item` が数値型の `importance` プロパティを受け取ります。重要度が 0 以外の場合に限り、`&&` 演算子を使用して、斜体で "_(Importance: X)_" と表示するようにしてください。以下のような結果になるようにしましょう。

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

重要度を表示する場合は 2 つのテキストの間にスペースを入れることを忘れないでください！

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

以下のようにすれば動きます：

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

`importance` が `0` の場合に `0` が結果として表示されてしまわないよう、`importance && ...` ではなく `importance > 0 && ...` と書く必要があることに注意してください。

この答えでは、名前と重要度ラベルの間にスペースを挿入するために、2 つの条件が使用されています。代わりに、先頭にスペースを入れたフラグメントを使用することができます：`importance > 0 && <> <i>...</i></>` あるいは、`<i>` の直接内側にスペースを追加することもできます：`importance > 0 && <i> ...</i>`。

</Solution>

#### 連続する `? :` を `if` と変数にリファクタ {/*refactor-a-series-of---to-if-and-variables*/}

この `Drink` コンポーネントは、`name` プロパティの値が `"tea"` か `"coffee"` かによって表示する情報を変えるために、`? :` を何度も使用しています。問題は、各ドリンクの情報が複数の条件分岐に分散してしまっていることです。このコードを、3 つの `? :` ではなく、単一の `if` 文を使うようにリファクタリングしてください。

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

コードを `if` 文を使用するようにリファクタリングしたら、さらに簡素化するアイデアはありますか？

<Solution>

複数のアプローチがありますが、ここでは 1 つの出発点として以下を示します：

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

これで、各ドリンクの情報が複数の条件分岐に分散されずにグループ化されてました。将来新しいドリンクを追加する際にも簡単になります。

別の解決策として、情報をオブジェクトに移動することで、条件を完全に削除することも可能です：

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
