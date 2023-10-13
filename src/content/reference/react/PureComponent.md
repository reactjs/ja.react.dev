---
title: PureComponent
---

<Pitfall>

クラスの代わりに関数でコンポーネントを定義することを推奨します。[移行方法はこちら](#alternatives)。

</Pitfall>

<Intro>

`PureComponent` は [`Component`](/reference/react/Component) と似ていますが、同じ props と state に対しては再レンダーをスキップします。クラスコンポーネントはまだ React によってサポートされていますが、新しいコードでの使用は推奨されません。

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `PureComponent` {/*purecomponent*/}

同じ props と state に対してクラスコンポーネントの再レンダーをスキップしたい場合、[`Component`](/reference/react/Component) の代わりに `PureComponent` を継承します。

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` は `Component` のサブクラスであり、[すべての `Component` API](/reference/react/Component#reference) をサポートしています。`PureComponent` を拡張することは、props と state を浅く比較するカスタムの [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) メソッドを定義することと同等です。

[さらに例を見る](#usage)

---

## 使用法 {/*usage*/}

### クラスコンポーネントの不要な再レンダーをスキップする {/*skipping-unnecessary-re-renders-for-class-components*/}

React は通常、親が再レンダーされるたびにコンポーネントを再レンダーします。最適化として、新しい props や state が古い props や state と同じである限り、親が再レンダーされても React が再レンダーを行わない、というコンポーネントを作成することができます。[クラスコンポーネント](/reference/react/Component)では、`PureComponent` を継承することにより、この挙動を有効化できます。

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React コンポーネントは常に[純粋なレンダーロジックを持つべきです](/learn/keeping-components-pure)。これはすなわち、その props、state、コンテクストが変わらない場合は、常に同じ出力を返す必要がある、という意味です。`PureComponent` を使用することで、あなたのコンポーネントがこの要件を満たしていると React に伝えることができ、そのため React は props と state が変わらない限り再レンダーする必要がないと判断します。ただし、使用しているコンテクストが変更された場合、コンポーネントは再レンダーされます。

以下の例で、`name` が変更されるたびに `Greeting` コンポーネントが再レンダーされる（`name` が props として渡されているため）が、`address` が変更されても再レンダーされない（`Greeting` に props として渡されていないため）ことに注目してください。

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

クラスの代わりに関数でコンポーネントを定義することを推奨します。[移行方法はこちら](#alternatives)。


</Pitfall>

---

## 代替手段 {/*alternatives*/}

### `PureComponent` クラスのコンポーネントから関数コンポーネントへの移行 {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

新しいコードでは、[クラスコンポーネント](/reference/react/Component)の代わりに関数コンポーネントを使用することを推奨します。以下では、既存の `PureComponent` を使用したクラスコンポーネントがある場合、どのように移行するかを説明します。こちらが元のコードです。

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

このコンポーネントを[クラスから関数に移行](/reference/react/Component#alternatives)したい場合は、[`memo`](/reference/react/memo) でラップしてください。

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

`PureComponent` とは異なり、[`memo`](/reference/react/memo) は新旧の state を比較しません。関数コンポーネントでは、同一の state 値で [`set` 関数](/reference/react/useState#setstate)を呼び出した場合、`memo` がなくても[デフォルトで再レンダーが防止されます](/reference/react/memo#updating-a-memoized-component-using-state)。

</Note>
