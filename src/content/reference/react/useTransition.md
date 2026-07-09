---
title: useTransition
---

<Intro>

`useTransition` は、UI を部分的にバックグラウンドでレンダーするための React フックです。

```js
const [isPending, startTransition] = useTransition()
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useTransition()` {/*usetransition*/}

コンポーネントのトップレベルで `useTransition` を呼び出し、state 更新の一部をトランジションとしてマークします。

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

`useTransition` には引数はありません。

#### 返り値 {/*returns*/}

`useTransition` は常に 2 つの要素を含む配列を返します。

1. トランジションが保留中であるかどうかを示す `isPending` フラグ。
2. 更新をトランジションとしてマークするための [`startTransition` 関数](#starttransition)。

---

### `startTransition(action)` {/*starttransition*/}

`useTransition` によって返される `startTransition` 関数により、更新をトランジションとしてマークすることができます。

```js {6,8}
function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

<Note>
#### `startTransition` で呼び出される関数は「アクション」と呼ばれる。 {/*functions-called-in-starttransition-are-called-actions*/}

`startTransition` に渡される関数は「アクション」と呼ばれます。慣習として、（コールバック props のように）`startTransition` 内で呼び出されるコールバックは `action` という名前にするか、末尾に "Action" というサフィックスを含めるとよいでしょう。

```js {1,9}
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}

```

</Note>



#### 引数 {/*starttransition-parameters*/}

* `action`: 1 つ以上の [`set` 関数](/reference/react/useState#setstate)を呼び出して state を更新する関数。React は引数なしで直ちに `action` を呼び出し、`action` 関数呼び出し中に同期的にスケジュールされたすべての state 更新をトランジションとしてマークします。`action` 内で await されている非同期関数のコールもトランジションの一部ではありますが、現時点では `await` の後に来る `set` 関数は別の `startTransition` にラップする必要があります（[トラブルシューティング](#react-doesnt-treat-my-state-update-after-await-as-a-transition)参照）。トランジションとしてマークされた state の更新は[ノンブロッキング](#perform-non-blocking-updates-with-actions)になり、[不要なローディングインジケータを表示しない](#preventing-unwanted-loading-indicators)ようになります。

#### 返り値 {/*starttransition-returns*/}

`startTransition` は何も返しません。

#### 注意点 {/*starttransition-caveats*/}

* `useTransition` はフックであるため、コンポーネント内かカスタムフック内でのみ呼び出すことができます。他の場所（例えば、データライブラリ）でトランジションを開始する必要がある場合は、代わりにスタンドアロンの [`startTransition`](/reference/react/startTransition) を呼び出してください。

* state の `set` 関数にアクセスできる場合にのみ、state 更新をトランジションにラップできます。ある props やカスタムフックの値に反応してトランジションを開始したい場合は、代わりに [`useDeferredValue`](/reference/react/useDeferredValue) を試してみてください。

* `startTransition` に渡された関数は即座に呼び出され、その関数の実行中に発生するすべての state 更新がトランジションとしてマークされます。しかし例えば、`setTimeout` 内で state を更新しようとした場合は、それはトランジションとしてマークされません。

* 非同期リクエスト後に state 更新を行いたい場合は、トランジションとしてマークするために別の `startTransition` でラップする必要があります。これは既知の制限であり、将来的に修正される予定です（詳細は[トラブルシューティング](#react-doesnt-treat-my-state-update-after-await-as-a-transition)を参照してください）。

* `startTransition` 関数は常に同一のものとなるため、多くの場合エフェクトの依存配列では省略されますが、依存配列に含めてもエフェクトの再実行は起こりません。依存値を削除してもリンタがエラーを出さない場合、削除しても安全です。[エフェクトから依存値を取り除く方法](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)を参照してください。

* トランジションとしてマークされた state 更新は、他の state 更新によって中断されます。例えば、トランジション内でチャートコンポーネントを更新した後、チャートの再レンダーの途中で入力フィールドに入力を始めた場合、React は入力欄の更新の処理後にチャートコンポーネントのレンダー作業を再開します。

* トランジションによる更新はテキスト入力欄の制御には使用できません。

* 進行中のトランジションが複数ある場合、React は現在それらをひとつに束ねる処理を行います。この制限は将来のリリースでは削除される可能性があります。

## 使用法 {/*usage*/}

### ノンブロッキングな更新をアクションを使って実行する {/*perform-non-blocking-updates-with-actions*/}

コンポーネントのトップレベルで `useTransition` を呼び出してアクション (Action) を作成し、保留中 (pending) 状態にアクセスします。

```js [[1, 4, "isPending"], [2, 4, "startTransition"]]
import {useState, useTransition} from 'react';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

`useTransition` は正確に 2 つの項目を含む配列を返します：

1. トランジションが保留中であるかどうかを示す <CodeStep step={1}>`isPending` フラグ</CodeStep>。
2. アクションを作成するための <CodeStep step={2}>`startTransition` 関数</CodeStep>。

トランジションを開始するには、以下のようにして `startTransition` に関数を渡します。

```js
import {useState, useTransition} from 'react';
import {updateQuantity} from './api';

function CheckoutForm() {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(1);

  function onSubmit(newQuantity) {
    startTransition(async function () {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  }
  // ...
}
```

`startTransition` に渡される関数が "アクション (Action)" と呼ばれるものです。アクション内では state を更新したり、（必要に応じて）副作用を実行したりすることができます。その作業はバックグラウンドで、ページ上のユーザ操作をブロックすることなく行われます。ひとつのトランジションが複数のアクションを含むことができ、トランジションが進行中でも UI の応答性は保たれます。例えば、ユーザがタブをクリックしたあとに気が変わって別のタブをクリックした場合でも、最初の更新が終了するのを待つことなく、2 回目のクリックが即座に処理されます。

トランジションの進行中状態に関するフィードバックをユーザに提供するために、`startTransition` が最初に呼び出されると `isPending` state が `true` に切り替わり、すべてのアクションが完了して最終的な状態がユーザに表示されるまで `true` のままになります。トランジションによりアクション内の副作用が順番に完了することが保証され、[不要なローディングインジケータが抑止](#preventing-unwanted-loading-indicators)されます。また、`useOptimistic` を使用することで、トランジションが進行中の間にも即時のフィードバックを提供することができます。

<Recipes titleText="useTransition と通常の state 更新の違い">

#### アクションで数量を更新 {/*updating-the-quantity-in-an-action*/}

この例では、`updateQuantity` 関数がカート内の商品の数量を更新するリクエストをサーバに送信する部分をシミュレーションしています。この関数は、リクエストの完了に少なくとも 1 秒かかるように**意図的に遅延**させられています。

数量欄を素早く複数回更新してみてください。リクエストが進行中の間、"Total" 欄には保留中状態が表示され、最後のリクエストが完了した後にのみ "Total" が更新されることに注意してください。更新がアクション内で行われるため、リクエストの進行中でも "quantity" 欄を更新し続けることが可能です。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();

  const updateQuantityAction = async newQuantity => {
    // To access the pending state of a transition,
    // call startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}
```

```js src/Item.js
import { startTransition } from "react";

export default function Item({action}) {
  function handleChange(event) {
    // To expose an action prop, await the callback in startTransition.
    startTransition(async () => {
      await action(event.target.value);
    })
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

これはアクションの動作を示す基本的な例となっていますが、この例ではリクエストが順番通り完了しなかった場合の問題を処理していません。数量を複数回更新すると、後続のリクエストの後で以前のリクエストが完了するために、数量がおかしな順番で更新されてしまう可能性があります。これは既知の制限であり、将来的に修正される予定です（詳細は[トラブルシューティング](#my-state-updates-in-transitions-are-out-of-order)を参照してください）。

React は、一般的なユースケースに対応する以下のような組み込みの抽象化を提供しています。
- [`useActionState`](/reference/react/useActionState)
- [`<form>` アクション](/reference/react-dom/components/form)
- [サーバ関数](/reference/rsc/server-functions)

これらのソリューションはリクエスト順序の問題を自動的に管理します。トランジションを使って非同期の state 遷移を管理するカスタムフックやライブラリを構築する場合、リクエスト順序をより高度に制御可能ですが、問題を手動で管理する必要があります。

<Solution />

#### アクションなしで数量を更新 {/*updating-the-users-name-without-an-action*/}

今回も、`updateQuantity` 関数がカート内の商品の数量を更新するリクエストをサーバに送信する部分をシミュレーションしています。この関数は、リクエストの完了に少なくとも 1 秒かかるように**意図的に遅延**させられています。

数量欄を素早く複数回更新してみてください。"Total" の保留中状態がリクエストの進行中に表示されますが、"quantity" のクリック回数に応じて "Total" が複数回更新されることに注意してください。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async newQuantity => {
    // Manually set the isPending State.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({onUpdateQuantity}) {
  function handleChange(event) {
    onUpdateQuantity(event.target.value);
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

このような問題に対するよくある解決法は、数量の更新中にユーザがさらなる変更を行えないようにしてしまうことです。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, setIsPending] = useState(false);

  const onUpdateQuantity = async event => {
    const newQuantity = event.target.value;
    // Manually set the isPending state.
    setIsPending(true);
    const savedQuantity = await updateQuantity(newQuantity);
    setIsPending(false);
    setQuantity(savedQuantity);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item isPending={isPending} onUpdateQuantity={onUpdateQuantity}/>
      <hr />
      <Total quantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
export default function Item({isPending, onUpdateQuantity}) {
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        disabled={isPending}
        onChange={onUpdateQuantity}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({quantity, isPending}) {
  return (
    <div className="total">
      <span>Total:</span>
      <span>
        {isPending ? "🌀 Updating..." : `${intl.format(quantity * 9999)}`}
      </span>
    </div>
  )
}
```

```js src/api.js
export async function updateQuantity(newQuantity) {
  return new Promise((resolve, reject) => {
    // Simulate a slow network request.
    setTimeout(() => {
      resolve(newQuantity);
    }, 2000);
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}
```

</Sandpack>

ですがこのソリューションでは、数量を更新するたびにユーザが待つ必要があるため、アプリが遅く感じられます。数量の更新中もユーザが UI を操作できるよう、手動でより複雑な処理を追加することも可能ですが、アクションを使用すれば、シンプルな組み込み API でこのケースに対処できます。

<Solution />

</Recipes>

---

### コンポーネントから `action` を props として公開する {/*exposing-action-props-from-components*/}

コンポーネントが props として `action` を公開することで、親がアクションを呼び出せるようにできます。

例えばこの `TabButton` コンポーネントは `onClick` 時のロジックを `action` 内にラップしています。

```js {8-12}
export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

これで親コンポーネントは state を `action` 内で更新するようになるため、この state 更新はトランジションとしてマークされます。つまり、"Posts" をクリックした直後に "Contact" をクリックしても、ユーザ操作がブロックされないようになるということです。

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={async () => {
      startTransition(async () => {
        // await the action that's passed in.
        // This allows it to be either sync or async.
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

<Note>

コンポーネント内から props として `action` を公開する場合は、トランジション内で `await` するべきです。

これにより `action` コールバックが同期的な場合でも非同期の場合でも、アクションを `await` でラップするために余分に `startTransition` を用いる必要がなくなります。

</Note>

---

### 保留中状態を視覚的に表示する {/*displaying-a-pending-visual-state*/}

`useTransition` によって返される `isPending` ブーリアン値を使用して、ユーザにトランジションが進行中であることを示すことができます。例えば、タブボタンは特別な "pending" という視覚状態を持つことができます。

```js {4-6}
function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  // ...
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  // ...
```

"Posts" をクリックすると、タブボタン自体がすぐに更新されるため、より反応が良く感じられることに着目してください。

<Sandpack>

```js
import { useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js {expectedErrors: {'react-compiler': [19, 20]}} src/PostsTab.js
import { memo } from 'react';

const PostsTab = memo(function PostsTab() {
  // Log once. The actual slowdown is inside SlowPost.
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return (
    <ul className="items">
      {items}
    </ul>
  );
});

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Do nothing for 1 ms per item to emulate extremely slow code
  }

  return (
    <li className="item">
      Post #{index + 1}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

---

### 望ましくないローディングインジケータの防止 {/*preventing-unwanted-loading-indicators*/}

この例では、`PostsTab` コンポーネントは [use](/reference/react/use) を使用していくつかのデータをフェッチしています。"Posts" タブをクリックすると、`PostsTab` コンポーネントが*サスペンド*し、その結果、最も近いローディングフォールバックが表示されます：

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js
export default function TabButton({ action, children, isActive }) {
  if (isActive) {
    return <b>{children}</b>
  }
  return (
    <button onClick={() => {
      action();
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

ローディングインジケータを表示するためにタブのコンテナ全体が隠れることは不快なユーザ体験となってしまいます。`TabButton` に `useTransition` を追加すると、代わりにタブボタン内に保留状態を表示することができます。

"Posts" をクリックしても、もはやタブコンテナ全体がスピナに置き換わることはなくなったことに注目してください。

<Sandpack>

```js
import { Suspense, useState } from 'react';
import TabButton from './TabButton.js';
import AboutTab from './AboutTab.js';
import PostsTab from './PostsTab.js';
import ContactTab from './ContactTab.js';

export default function TabContainer() {
  const [tab, setTab] = useState('about');
  return (
    <Suspense fallback={<h1>🌀 Loading...</h1>}>
      <TabButton
        isActive={tab === 'about'}
        action={() => setTab('about')}
      >
        About
      </TabButton>
      <TabButton
        isActive={tab === 'posts'}
        action={() => setTab('posts')}
      >
        Posts
      </TabButton>
      <TabButton
        isActive={tab === 'contact'}
        action={() => setTab('contact')}
      >
        Contact
      </TabButton>
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </Suspense>
  );
}
```

```js src/TabButton.js active
import { useTransition } from 'react';

export default function TabButton({ action, children, isActive }) {
  const [isPending, startTransition] = useTransition();
  if (isActive) {
    return <b>{children}</b>
  }
  if (isPending) {
    return <b className="pending">{children}</b>;
  }
  return (
    <button onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
}
```

```js src/AboutTab.js hidden
export default function AboutTab() {
  return (
    <p>Welcome to my profile!</p>
  );
}
```

```js src/PostsTab.js hidden
import {use} from 'react';
import { fetchData } from './data.js';

function PostsTab() {
  const posts = use(fetchData('/posts'));
  return (
    <ul className="items">
      {posts.map(post =>
        <Post key={post.id} title={post.title} />
      )}
    </ul>
  );
}

function Post({ title }) {
  return (
    <li className="item">
      {title}
    </li>
  );
}

export default PostsTab;
```

```js src/ContactTab.js hidden
export default function ContactTab() {
  return (
    <>
      <p>
        You can find me online here:
      </p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}
```


```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url.startsWith('/posts')) {
    return await getPosts();
  } else {
    throw Error('Not implemented');
  }
}

async function getPosts() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });
  let posts = [];
  for (let i = 0; i < 500; i++) {
    posts.push({
      id: i,
      title: 'Post #' + (i + 1)
    });
  }
  return posts;
}
```

```css
button { margin-right: 10px }
b { display: inline-block; margin-right: 10px; }
.pending { color: #777; }
```

</Sandpack>

[サスペンスとトランジションの詳細はこちらをご覧ください](/reference/react/Suspense#preventing-already-revealed-content-from-hiding)。

<Note>

トランジションは（今回のタブコンテナのような）*すでに表示されている*コンテンツを隠さない範囲で「待機」を行います。もし Posts タブに[ネストした `<Suspense>` バウンダリ](/reference/react/Suspense#revealing-nested-content-as-it-loads)がある場合、トランジションはそれを「待機」することはありません。

</Note>

---

### サスペンス対応ルータの構築 {/*building-a-suspense-enabled-router*/}

React のフレームワークやルータを構築している場合、ページのナビゲーションをトランジションとしてマークすることをお勧めします。

```js {3,6,8}
function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }
  // ...
```

これが推奨されるのは以下の 3 つの理由からです：

- [トランジションは中断可能](#perform-non-blocking-updates-with-actions)であるため、ユーザは再レンダーの完了を待たずにクリックしてページから離れることができます。
- [トランジションは不要なローディングインジケータを防ぐ](#preventing-unwanted-loading-indicators)ため、ユーザがナビゲーション時の不快なちらつきを避けることができます。
- [トランジションはすべての保留中のアクションを待機します](#perform-non-blocking-updates-with-actions)。これにより、新しいページが表示される前に副作用の完了をユーザが待つことができます。

以下は、ナビゲーションにトランジションを使用した簡易的なルータの例です。

<Sandpack>

```js src/App.js
import { Suspense, useState, useTransition } from 'react';
import IndexPage from './IndexPage.js';
import ArtistPage from './ArtistPage.js';
import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();

  function navigate(url) {
    startTransition(() => {
      setPage(url);
    });
  }

  let content;
  if (page === '/') {
    content = (
      <IndexPage navigate={navigate} />
    );
  } else if (page === '/the-beatles') {
    content = (
      <ArtistPage
        artist={{
          id: 'the-beatles',
          name: 'The Beatles',
        }}
      />
    );
  }
  return (
    <Layout isPending={isPending}>
      {content}
    </Layout>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}
```

```js src/Layout.js
export default function Layout({ children, isPending }) {
  return (
    <div className="layout">
      <section className="header" style={{
        opacity: isPending ? 0.7 : 1
      }}>
        Music Browser
      </section>
      <main>
        {children}
      </main>
    </div>
  );
}
```

```js src/IndexPage.js
export default function IndexPage({ navigate }) {
  return (
    <button onClick={() => navigate('/the-beatles')}>
      Open The Beatles artist page
    </button>
  );
}
```

```js src/ArtistPage.js
import { Suspense } from 'react';
import Albums from './Albums.js';
import Biography from './Biography.js';
import Panel from './Panel.js';

export default function ArtistPage({ artist }) {
  return (
    <>
      <h1>{artist.name}</h1>
      <Biography artistId={artist.id} />
      <Suspense fallback={<AlbumsGlimmer />}>
        <Panel>
          <Albums artistId={artist.id} />
        </Panel>
      </Suspense>
    </>
  );
}

function AlbumsGlimmer() {
  return (
    <div className="glimmer-panel">
      <div className="glimmer-line" />
      <div className="glimmer-line" />
      <div className="glimmer-line" />
    </div>
  );
}
```

```js src/Albums.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Albums({ artistId }) {
  const albums = use(fetchData(`/${artistId}/albums`));
  return (
    <ul>
      {albums.map(album => (
        <li key={album.id}>
          {album.title} ({album.year})
        </li>
      ))}
    </ul>
  );
}
```

```js src/Biography.js
import {use} from 'react';
import { fetchData } from './data.js';

export default function Biography({ artistId }) {
  const bio = use(fetchData(`/${artistId}/bio`));
  return (
    <section>
      <p className="bio">{bio}</p>
    </section>
  );
}
```

```js src/Panel.js
export default function Panel({ children }) {
  return (
    <section className="panel">
      {children}
    </section>
  );
}
```

```js src/data.js hidden
// Note: the way you would do data fetching depends on
// the framework that you use together with Suspense.
// Normally, the caching logic would be inside a framework.

let cache = new Map();

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

async function getData(url) {
  if (url === '/the-beatles/albums') {
    return await getAlbums();
  } else if (url === '/the-beatles/bio') {
    return await getBio();
  } else {
    throw Error('Not implemented');
  }
}

async function getBio() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 500);
  });

  return `The Beatles were an English rock band,
    formed in Liverpool in 1960, that comprised
    John Lennon, Paul McCartney, George Harrison
    and Ringo Starr.`;
}

async function getAlbums() {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  return [{
    id: 13,
    title: 'Let It Be',
    year: 1970
  }, {
    id: 12,
    title: 'Abbey Road',
    year: 1969
  }, {
    id: 11,
    title: 'Yellow Submarine',
    year: 1969
  }, {
    id: 10,
    title: 'The Beatles',
    year: 1968
  }, {
    id: 9,
    title: 'Magical Mystery Tour',
    year: 1967
  }, {
    id: 8,
    title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
    year: 1967
  }, {
    id: 7,
    title: 'Revolver',
    year: 1966
  }, {
    id: 6,
    title: 'Rubber Soul',
    year: 1965
  }, {
    id: 5,
    title: 'Help!',
    year: 1965
  }, {
    id: 4,
    title: 'Beatles For Sale',
    year: 1964
  }, {
    id: 3,
    title: 'A Hard Day\'s Night',
    year: 1964
  }, {
    id: 2,
    title: 'With The Beatles',
    year: 1963
  }, {
    id: 1,
    title: 'Please Please Me',
    year: 1963
  }];
}
```

```css
main {
  min-height: 200px;
  padding: 10px;
}

.layout {
  border: 1px solid black;
}

.header {
  background: #222;
  padding: 10px;
  text-align: center;
  color: white;
}

.bio { font-style: italic; }

.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-panel {
  border: 1px dashed #aaa;
  background: linear-gradient(90deg, rgba(221,221,221,1) 0%, rgba(255,255,255,1) 100%);
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}

.glimmer-line {
  display: block;
  width: 60%;
  height: 20px;
  margin: 10px;
  border-radius: 4px;
  background: #f0f0f0;
}
```

</Sandpack>

<Note>

[サスペンス対応](/reference/react/Suspense)のルータは、デフォルトでナビゲーションの更新をトランジションにラップすることが期待されます。

</Note>

---

### エラーバウンダリでユーザにエラーを表示する {/*displaying-an-error-to-users-with-error-boundary*/}

`startTransition` に渡された関数がエラーをスローした場合、[エラーバウンダリ](/reference/react/Component#catching-rendering-errors-with-an-error-boundary)を使用してユーザにエラーを表示することができます。エラーバウンダリを使用するには、`useTransition` を呼び出しているコンポーネントをエラーバウンダリで囲みます。`startTransition` に渡された関数がエラーになった場合、エラーバウンダリに指定されているフォールバックが表示されます。

<Sandpack>

```js src/AddCommentContainer.js active
import { useTransition } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function AddCommentContainer() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function addComment(comment) {
  // For demonstration purposes to show Error Boundary
  if (comment == null) {
    throw new Error("Example Error: An error thrown to trigger error boundary");
  }
}

function AddCommentButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          // Intentionally not passing a comment
          // so error gets thrown
          addComment();
        });
      }}
    >
      Add comment
    </button>
  );
}
```

```js src/App.js hidden
import { AddCommentContainer } from "./AddCommentContainer.js";

export default function App() {
  return <AddCommentContainer />;
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0-rc-3edc000d-20240926",
    "react-dom": "19.0.0-rc-3edc000d-20240926",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

---

## トラブルシューティング {/*troubleshooting*/}

### トランジション中に入力フィールドを更新できない {/*updating-an-input-in-a-transition-doesnt-work*/}

入力フィールドを制御する state 変数に対してトランジションを使用することはできません。

```js {4,10}
const [text, setText] = useState('');
// ...
function handleChange(e) {
  // ❌ Can't use Transitions for controlled input state
  startTransition(() => {
    setText(e.target.value);
  });
}
// ...
return <input value={text} onChange={handleChange} />;
```

これは、トランジションが非ブロッキングである一方、change イベントへの応答として入力を更新する処理は同期的である必要があるためです。タイピングに応じてトランジションを実行したい場合、2 つの選択肢があります：

1. 入力フィールド用の state（常に同期的に更新される）と、トランジションで更新する state を別々に宣言する。これにより、同期的な state を使用して入力フィールドを制御しつつ、トランジション state 変数（入力欄より「遅れる」ことになる）をレンダーロジックの残りの部分に渡すことができます。
2. あるいは、保持する state 変数は 1 つにし、実際の値より「遅れる」ことのできる [`useDeferredValue`](/reference/react/useDeferredValue) を追加することができます。これにより、ノンブロッキングな再レンダーを始めて、それが自動的に新しい値に「追いつく」ようにできます。

---

### React が state 更新をトランジションとして扱わない {/*react-doesnt-treat-my-state-update-as-a-transition*/}

state 更新をトランジションでラップするとき、更新が `startTransition` の呼び出しの*最中*に行われていることを確認してください：

```js
startTransition(() => {
  // ✅ Setting state *during* startTransition call
  setPage('/about');
});
```

`startTransition` に渡す関数は同期的でなければなりません。以下のような形で更新をトランジションとしてマークすることはできません。

```js
startTransition(() => {
  // ❌ Setting state *after* startTransition call
  setTimeout(() => {
    setPage('/about');
  }, 1000);
});
```

代わりに、以下は可能です。

```js
setTimeout(() => {
  startTransition(() => {
    // ✅ Setting state *during* startTransition call
    setPage('/about');
  });
}, 1000);
```

---

### `await` 後の state 更新がトランジションにならない {/*react-doesnt-treat-my-state-update-after-await-as-a-transition*/}

`startTransition` 関数内で `await` を使用した場合、`await` の後に行われる state 更新はトランジションとしてマークされません。各 `await` 後の state 更新をそれぞれ `startTransition` 呼び出しでラップする必要があります。

```js
startTransition(async () => {
  await someAsyncFunction();
  // ❌ Not using startTransition after await
  setPage('/about');
});
```

一方で、以下は動作します。

```js
startTransition(async () => {
  await someAsyncFunction();
  // ✅ Using startTransition *after* await
  startTransition(() => {
    setPage('/about');
  });
});
```

これは JavaScript の制限により React が非同期コンテクストのスコープを失うために発生する問題です。将来的に [AsyncContext](https://github.com/tc39/proposal-async-context) が利用可能になれば、この制限は解消される予定です。

---

### コンポーネントの外部から `useTransition` を呼び出したい {/*i-want-to-call-usetransition-from-outside-a-component*/}

`useTransition` はフックであるため、コンポーネント外で呼び出すことはできません。この場合、代わりにスタンドアロンの [`startTransition`](/reference/react/startTransition) メソッドを使用してください。同じように機能しますが、`isPending` インジケータは提供されません。

---

### `startTransition` に渡す関数がすぐに実行される {/*the-function-i-pass-to-starttransition-executes-immediately*/}

このコードを実行すると、1、2、3 が出力されます：

```js {1,3,6}
console.log(1);
startTransition(() => {
  console.log(2);
  setPage('/about');
});
console.log(3);
```

**1、2、3 が出力されるのは期待通りの動作です**。`startTransition` に渡す関数は遅延されません。ブラウザの `setTimeout` を使う場合とは異なり、コールバックは後で実行されるのではありません。React はあなたの関数をすぐに実行しますが、*それが実行されている間*にスケジュールされた state 更新をトランジションとしてマークします。以下のように動作していると考えることができます。

```js
// A simplified version of how React works

let isInsideTransition = false;

function startTransition(scope) {
  isInsideTransition = true;
  scope();
  isInsideTransition = false;
}

function setState() {
  if (isInsideTransition) {
    // ... schedule a Transition state update ...
  } else {
    // ... schedule an urgent state update ...
  }
}
```

### トランジション内で state 更新の順番がおかしくなる {/*my-state-updates-in-transitions-are-out-of-order*/}

`startTransition` 内で `await` を使用すると、更新が順不同で発生する可能性があります。

以下の例では、`updateQuantity` 関数がカート内の商品の数量を更新するリクエストをサーバに送信する部分をシミュレーションしています。この関数は、ネットワークリクエストの競合状態をシミュレートするため、*初回リクエストの結果が常に後続リクエストの結果より後に返ってくる*ようになっています。

数量を一度だけ更新した場合と、素早く複数回更新した場合を試してみてください。誤った合計が表示される場合があることに気付くでしょう。

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useTransition } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);

  const updateQuantityAction = newQuantity => {
    setClientQuantity(newQuantity);

    // Access the pending state of the transition,
    // by wrapping in startTransition again.
    startTransition(async () => {
      const savedQuantity = await updateQuantity(newQuantity);
      startTransition(() => {
        setQuantity(savedQuantity);
      });
    });
  };

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(async () => {
      await action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>


複数回のクリックがあると、後続のリクエストが完了した後で古いリクエストが完了する場合があります。この場合、現在の React は意図した順序を認識できません。これは、更新が非同期的にスケジュールされ、非同期の境界を越えると React が順序の情報を保持できないからです。

トランジション内のアクションは実行順序を保証しないため、これは想定された動作です。一般的なユースケースのために、React は [`useActionState`](/reference/react/useActionState) や [`<form>` アクション](/reference/react-dom/components/form) のような高レベルの抽象化を提供しており、順序の管理を自動化します。高度なユースケースでは、独自のキューイングや中断ロジックを実装して、実行順序を管理する必要があります。

`useActionState` で実行順序を扱う例：

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "beta",
    "react-dom": "beta"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState, useActionState } from "react";
import { updateQuantity } from "./api";
import Item from "./Item";
import Total from "./Total";

export default function App({}) {
  // Store the actual quantity in separate state to show the mismatch.
  const [clientQuantity, setClientQuantity] = useState(1);
  const [quantity, updateQuantityAction, isPending] = useActionState(
    async (prevState, payload) => {
      setClientQuantity(payload);
      const savedQuantity = await updateQuantity(payload);
      return savedQuantity; // Return the new quantity to update the state
    },
    1 // Initial quantity
  );

  return (
    <div>
      <h1>Checkout</h1>
      <Item action={updateQuantityAction}/>
      <hr />
      <Total clientQuantity={clientQuantity} savedQuantity={quantity} isPending={isPending} />
    </div>
  );
}

```

```js src/Item.js
import {startTransition} from 'react';

export default function Item({action}) {
  function handleChange(e) {
    // Update the quantity in an Action.
    startTransition(() => {
      action(e.target.value);
    });
  }
  return (
    <div className="item">
      <span>Eras Tour Tickets</span>
      <label htmlFor="name">Quantity: </label>
      <input
        type="number"
        onChange={handleChange}
        defaultValue={1}
        min={1}
      />
    </div>
  )
}
```

```js src/Total.js
const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function Total({ clientQuantity, savedQuantity, isPending }) {
  return (
    <div className="total">
      <span>Total:</span>
      <div>
        <div>
          {isPending
            ? "🌀 Updating..."
            : `${intl.format(savedQuantity * 9999)}`}
        </div>
        <div className="error">
          {!isPending &&
            clientQuantity !== savedQuantity &&
            `Wrong total, expected: ${intl.format(clientQuantity * 9999)}`}
        </div>
      </div>
    </div>
  );
}
```

```js src/api.js
let firstRequest = true;
export async function updateQuantity(newName) {
  return new Promise((resolve, reject) => {
    if (firstRequest === true) {
      firstRequest = false;
      setTimeout(() => {
        firstRequest = true;
        resolve(newName);
        // Simulate every other request being slower
      }, 1000);
    } else {
      setTimeout(() => {
        resolve(newName);
      }, 50);
    }
  });
}
```

```css
.item {
  display: flex;
  align-items: center;
  justify-content: start;
}

.item label {
  flex: 1;
  text-align: right;
}

.item input {
  margin-left: 4px;
  width: 60px;
  padding: 4px;
}

.total {
  height: 50px;
  line-height: 25px;
  display: flex;
  align-content: center;
  justify-content: space-between;
}

.total div {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.error {
  color: red;
}
```

</Sandpack>
