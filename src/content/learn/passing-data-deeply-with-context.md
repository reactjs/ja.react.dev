---
title: コンテクストで深くデータを受け渡す
---

<Intro>

通常、親コンポーネントから子コンポーネントには props を使って情報を渡します。しかし、props を多数の中間コンポーネントを経由して渡さないといけない場合や、アプリ内の多くのコンポーネントが同じ情報を必要とする場合、props の受け渡しは冗長で不便なものとなり得ます。*コンテクスト (Context)* を使用することで、親コンポーネントから props を明示的に渡さずとも、それ以下のツリー内の任意のコンポーネントが情報を受け取れるようにできます。

</Intro>

<YouWillLearn>

- "props の穴掘り作業 (prop drilling)" とは何か
- コンテクストを使って props の冗長な受け渡しを解消する方法
- コンテクストの一般的な用途
- コンテクストの代替手段

</YouWillLearn>

## props の受け渡しに伴う問題 {/*the-problem-with-passing-props*/}

[props の受け渡し](/learn/passing-props-to-a-component)は、UI ツリー内でデータを取り回してそれを必要とするコンポーネントに届けるための素晴らしい手法です。

しかし、props をツリー内の深い位置にまで渡す必要がある場合や、多くのコンポーネントが同じ props を必要としている場合、props の受け渡しは冗長で不便なものとなり得ます。最も近い共通の祖先要素は、データを必要としているコンポーネントから遠く離れているかもしれず、そのような高い位置まで [state をリフトアップ](/learn/sharing-state-between-components)していくと "props の穴掘り作業 (prop drilling)" と呼ばれる状況に陥ることがあります。

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="3 コンポーネントからなるツリーを表した図。親には紫でハイライトされた値がある。その値は 2 つの子コンポーネント（紫）に渡されている。">

state のリフトアップ

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="10 ノードからなるツリーの図。各ノードには最大 2 つの子がある。ルートノードには紫でハイライトされた値がある。その値はまず 2 つの子に流れるが、いずれも値を下に流しているだけ。ルートの左の子は、2 つの子（紫）に値を渡している。ルートの右の子は、2 つの子のうち片方（紫）にのみ値を渡している。その子はさらに子に値を渡しているが、その子は値を下に流しているだけであり、さらにその子（紫）が値を受け取っている。">

props の穴掘り作業

</Diagram>

</DiagramGroup>

もし props を受け渡すことなしに、データを必要としているツリー内のコンポーネントに直接データを「テレポート」させる方法があれば、素晴らしいと思いませんか？ React のコンテクスト機能を使えば、それが可能です！

## コンテクスト：props 受け渡しの代替手段 {/*context-an-alternative-to-passing-props*/}

コンテクストを使うことで、親コンポーネントが配下のツリー全体にデータを提供できます。コンテクストには多くの用途がありますが、以下に一例を示します。見出しサイズを表す `level` を受け取る `Heading` というコンポーネントを考えてみましょう。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

ここで、同じ `Section` 内の複数の見出しは常に同じサイズである必要があるとしましょう。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

今のところ、`level` を props としてそれぞれの `<Heading>` に個別に渡しています。

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

もし `level` を個々の `<Heading>` から削除して、代わりに `<Section>` コンポーネントに渡すことができれば素敵ですね。これにより同じセクション内にあるすべての見出しが同じサイズになることを強制できそうです。

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

ですが `<Heading>` コンポーネントは、最も近い `<Section>` のレベルをどうやって知ることができるのでしょうか？ **これには、ツリー上部のどこかにあるデータを子コンポーネントが「要求する」方法が必要です**。

これは props だけでは実現できません。ここで登場するのがコンテクストです。以下の 3 つの手順で実現できます。

1. コンテクストを**作成**する。（ここでは見出しレベル用なので `LevelContext` と呼ぶ。）
2. データを必要とするコンポーネントがそのコンテクストを**使用 (use)** する。（`Heading` が `LevelContext` を使用する。）
3. データを指定するコンポーネントがそのコンテクストを**提供 (provide)** する。（`Section` が `LevelContext` を提供する。）

コンテクストを使うと、離れた親コンポーネントからであっても、その内部のツリー全体にデータを提供できます。

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="3 コンポーネントからなるツリーを表した図。親にはオレンジ色でハイライトされた値があり、それが 2 つの子（オレンジ）にも投影されている。" >

近くの子にコンテクストを使用

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="10 ノードからなるツリーの図。各ノードには最大 2 つの子がある。ルート親ノードにはオレンジ色でハイライトされた値がある。値はツリー内の 4 つのリーフノードと 1 つの中間コンポーネントに直接投影され、それらは全てオレンジ色でハイライトされている。他の中間コンポーネントはハイライトされていない。">

遠くの子にコンテクストを使用

</Diagram>

</DiagramGroup>

### ステップ 1：コンテクストを作成する {/*step-1-create-the-context*/}

まずはコンテクストを作成する必要があります。複数のコンポーネントから使うことができるように、**ファイルを作ってコンテクストをエクスポート**する必要があります。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`createContext` の唯一の引数は*デフォルト*値です。ここでは、`1` という値は最大の見出しに対応するレベルを示していますが、任意の型の値（オブジェクトでも）を渡すことができます。デフォルト値の意味は次のステップで分かります。

### ステップ 2：コンテクストを使用する {/*step-2-use-the-context*/}

React の `useContext` フックと、作ったコンテクストをインポートします。

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

現在、`Heading` コンポーネントは `level` を props から読み取っています。

```js
export default function Heading({ level, children }) {
  // ...
}
```

代わりに、props から `level` を削除し、さきほどインポートした `LevelContext` から値を読み取るようにします。

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` はフックです。`useState` や `useReducer` も同じですが、フックは React コンポーネント内のトップレベルでのみ呼び出すことができます（ループや条件分岐の中では呼び出せません）。**`useContext` は、`Heading` コンポーネントが `LevelContext` を読み取りたいのだということを React に伝えています**。

もう `Heading` コンポーネントの props から `level` がなくなったので、以下のように JSX で `Heading` にレベルを渡す必要はありません。

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

JSX を更新して、代わりに `Section` が `level` を受け取るようにしましょう。

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

改めて、動作させたいコードを以下に再掲します。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

この例はまだちゃんと動作していません。すべての見出しが同じサイズになってしまっているのは、**コンテクストの*使用*はしているが、まだコンテクストの*提供*を行っていない**からです。React はどこから値を取得すればいいのか分かりません！

コンテクストが提供されていない場合、React は前のステップで指定したデフォルト値を使用します。この例では、`createContext` の引数に `1` を指定していましたので、`useContext(LevelContext)` は `1` を返し、そのためこれらの見出しは全部 `<h1>` になってしまっています。これを修正するため、各 `Section` がそれぞれコンテクストを提供するようにしましょう。

### ステップ 3：コンテクストを提供する {/*step-3-provide-the-context*/}

現在 `Section` コンポーネントは子要素を直接レンダーしています。

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

これを**コンテクストプロバイダでラップ**し、`LevelContext` の値を提供します。

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

これにより、「この `<Section>` の下にあるコンポーネントが `LevelContext` の値を要求した場合、この `level` を渡せ」と React に伝えていることになります。コンポーネントは、UI ツリー内の上側で、最も近い `<LevelContext.Provider>` の値を使用します。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

元のコードと見た目の結果は同じですが、`level` を props として個々の `Heading` コンポーネントに渡さずに済んでいます！ 代わりに、見出しは最も近い `Section` に値を要求して、自分の見出しレベルを自分で「判断」しているのです。

1. `<Section>` に props として `level` を渡す。
2. `Section` は子要素を `<LevelContext.Provider value={level}>` でラップする。
3. `Heading` は `useContext(LevelContext)` とすることで、上にある最も近い `LevelContext` の値を要求する。

## 同一コンポーネントでコンテクストを使用しつつ提供 {/*using-and-providing-context-from-the-same-component*/}

今はまだ、セクションごとに `level` を手動で指定する必要があります。

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

コンテクストによりコンポーネントの上部から情報を読み取ることができるため、各 `Section` は上にある別の `Section` から `level` を読み取りつつ、`level + 1` を下に渡すことができます。以下のようになります。

```js Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

この変更により、`<Section>` や `<Heading>` の*どちらにも* props として `level` を渡さずに済むようになりました。

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`Heading` と `Section` の両方が、`LevelContext` を読み取ることで自分がどの「深さ」にいるかを判断しています。また、`Section` はその子要素を `LevelContext` プロバイダ内にラップすることで、その中のすべてのものが「1 段階深い」レベルになるよう指定します。

<Note>

見出しレベルを例として使用したのは、ネストされたコンポーネントでどのようにコンテクストが上書きされていくのか視覚的に説明できるからです。しかしコンテクストは他の多くの用途でも役立ちます。サブツリー全体が必要とする情報（現在のカラーテーマや現在ログイン中のユーザなど）であれば、どんなものでも渡すことができます。

</Note>

## コンテクストは中間コンポーネントを貫通する {/*context-passes-through-intermediate-components*/}

コンテクストを提供するコンポーネントとそれを利用するコンポーネントの間には、好きなだけコンポーネントを挿入することができます。`<div>` などの組み込みコンポーネントでも、自分で構築するコンポーネントでも構いません。

この例では、同じ `Post` コンポーネント（破線ボーダー）が、2 つの異なるネストレベルでレンダーされています。`Post` の中にある `<Heading>` が、最も近くにある `<Section>` から自動的に見出しレベルを取得できていることに注目してください：

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

これを動作させるために特別なことは何もしていません。`Section` が内部のツリーに対するコンテクストを指定しているため、どこにでも `<Heading>` を挿入することができ、正しいサイズで表示されます。上のサンドボックスで試してみてください！

**コンテクストを使うことで、*どんな場所で*、すなわち*どんな文脈（コンテクスト）で*レンダーされているかに応じて異なる内容を表示できる、「周囲に適応」するコンポーネントを書けるようになります**。

コンテクストの仕組みは、[CSS におけるプロパティの継承](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance)に似ていると感じるかもしれません。CSS では、ある `<div>` に対して `color: blue` を指定すると、他の DOM ノードが途中で `color: green` などで上書きしない限り、どんなに深くネストされた DOM ノードにもその色が継承されます。同様に React では、上からやってくるコンテクストを上書きする唯一の方法は、別の値を指定したコンテクストプロバイダで子をラップすることです。

CSS では、`color` や `background-color` といった異なるプロパティがお互いを上書きすることはありません。すべての `<div>` の `color` を赤に設定しても、`background-color` には影響しません。同様に、**異なる React コンテクストはお互いを上書きしません**。`createContext()` で作成したそれぞれのコンテクストは、他のものと完全に切り離されており、*その特定のコンテクスト*を使用あるいは提供しているコンポーネント同士だけを結びつけます。1 つのコンポーネントが、異なるコンテクストをいくつも使用しても、あるいは提供しても、問題ありません。

## コンテクストを使う前に {/*before-you-use-context*/}

コンテクストはとても魅力的です！ しかし、これはコンテクストは使いすぎにつながりやすいということでもあります。**いくつかの props を数レベルの深さにわたって受け渡す必要があるというだけでは、その情報をコンテクストに入れるべきとはいえません**。

ここで紹介するように、コンテクストを使う前に検討すべきいくつかの代替案があります。

1. **まずは [props を渡す](/learn/passing-props-to-a-component)方法から始めましょう**。ちょっと凝ったコンポーネントであれば、多くの props を多くのコンポーネントを通して受け渡すことは珍しくありません。退屈な仕事に感じるかもしれませんが、どのコンポーネントがどのデータを使っているかが非常に明確になります！ コードをメンテナンスする人は、props を使ってデータの流れが明確に表現されていることに感謝するでしょう。
2. **コンポーネントを抽出して、[`children` を JSX として渡す](/learn/passing-props-to-a-component#passing-jsx-as-children)方法を検討しましょう**。もし、何らかのデータを、それを必要とせずただ下に流すだけの中間コンポーネントを何層も経由して受け渡ししているような場合、何かコンポーネントを抽出するのを忘れているということかもしれません。たとえば、`<Layout posts={posts} />` のような形で、データを直接使わないビジュアルコンポーネントに `post` のようなデータを渡しているのかもしれません。代わりに、`Layout` は `children` を props として受け取るようにし、`<Layout><Posts posts={posts} /></Layout>` のようにレンダーしてみましょう。これにより、データを指定するコンポーネントとそれを必要とするコンポーネントの間のレイヤ数が減ります。

これらのアプローチがどちらもうまくいかない場合は、コンテクストを検討してください。

## コンテクストのさまざまな用途 {/*use-cases-for-context*/}

* **テーマ**：例えばダークモードのように、アプリの外見をユーザが変更できる場合は、アプリのトップレベルにコンテクストプロバイダを配置し、外観を変化させる必要があるコンポーネントでそのコンテクストを使用します。
* **現在のアカウント**：多くのコンポーネントは、現在ログインしているユーザを知る必要があります。それをコンテクストに入れることで、ツリーのどこからでも読み取りが容易になります。一部のアプリでは、複数のアカウントを同時に操作できます（例：別のユーザとしてコメントを残す）。このような場合、別の現在アカウントを指定したプロバイダをネストして、UI の一部をラップすることが有用です。
* **ルーティング**：ほとんどのルーティングソリューションは、現在のルートを保持するために内部でコンテクストを使用しています。これが、自身がアクティブかどうかをすべてのリンクが「知っている」理由です。独自のルータを構築する場合は自分でもこれを行いたいでしょう。
* **state 管理**：アプリが大きくなると、アプリのトップ近くに大量の state が集まってくることがあります。下の遠いところにある多くのコンポーネントがその state 変更する必要があるかもしれません。[リデューサとコンテクストを一緒に使用](/learn/scaling-up-with-reducer-and-context)することは一般的であり、これにより大変な手間をかけずに、複雑な state を離れたコンポーネントへ受け渡すことができます。
  
コンテクストで扱う値は静的なものとは限りません。次のレンダーで異なる値を渡すと、React はその下でそれを必要しているすべてのコンポーネントを更新します！ これがコンテクストが state と一緒によく使われる理由です。

一般的に、ある情報が、ツリーの様々な部分にある離れたコンポーネントによって必要とされている場合、コンテクストが役立つというサインです。

<Recap>

* コンテクストにより、コンポーネントがそれ以下のツリー全体に情報を提供できる。
* コンテクストを使うには：
  1. `export const MyContext = createContext(defaultValue)` を使用して作成およびエクスポートする。
  2. フックに `useContext(MyContext)` のようにコンテクストを渡せば、どんな深い子コンポーネントからも値が読み取れる。
  3. コンテクストの値を提供するには子要素を `<MyContext.Provider value={...}>` でラップする。
* コンテクストは中間コンポーネントを貫通する。
* コンテクストを使えば、「周囲に適応する」コンポーネントが書ける。
* コンテクストを使用する前に、props を渡すか、`children` として JSX を渡す方法を検討してみる。

</Recap>

<Challenges>

#### props の穴掘り作業をコンテクストで置換 {/*replace-prop-drilling-with-context*/}

この例では、チェックボックスを切り替えることで、各 `<PlaceImage>` に渡される `imageSize` プロパティが変更されます。チェックボックスの state はトップレベルの `App` コンポーネントで保持されていますが、各 `<PlaceImage>` はそれを認識する必要があります。

現在、`App` は `imageSize` を `List` に渡し、`List` はそれを各 `Place` に渡し、`Place` はそれを `PlaceImage` に渡しています。props から `imageSize` を削除し、代わりにそれを `App` コンポーネントから直接 `PlaceImage` に渡すようにしてください。

コンテクストの宣言は `Context.js` 内で行えます。

<Sandpack>

```js App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js

```

```js data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repells mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

<Solution>

すべてのコンポーネントの props から `imageSize` を削除します。

`Context.js` で `ImageSizeContext` を作成してエクスポートします。次に、List を `<ImageSizeContext.Provider value={imageSize}>` でラップすることで下に値を渡します。`PlaceImage` で `useContext(ImageSizeContext)` を使ってそれを読み取ります。

<Sandpack>

```js App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repells mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
```

</Sandpack>

これで中間コンポーネントが `imageSize` を渡す必要がなくなっていることに注意してください。

</Solution>

</Challenges>
