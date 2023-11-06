---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` はパフォーマンスを低下させる可能性があります。可能な限り [`useEffect`](/reference/react/useEffect) を使用することを推奨します。

</Pitfall>

<Intro>

`useLayoutEffect` は [`useEffect`](/reference/react/useEffect) の一種ですが、ブラウザが画面を再描画する前に実行されます。

```js
useLayoutEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `useLayoutEffect(setup, dependencies?)` {/*useinsertioneffect*/}

ブラウザが画面を再描画する前にレイアウトの計測を行うために `useLayoutEffect` を呼び出します。

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

* `setup`: エフェクトのロジックが記述された関数です。このセットアップ関数は、オプションで*クリーンアップ*関数を返すことができます。コンポーネントが初めて DOM に追加されると、React はセットアップ関数を実行します。依存配列 (dependencies) が変更された再レンダー時には、React はまず古い値を使ってクリーンアップ関数（あれば）を実行し、次に新しい値を使ってセットアップ関数を実行します。コンポーネントが DOM から削除された後、React はクリーンアップ関数を最後にもう一度実行します。
 
* **省略可能** `dependencies`: `setup` コード内で参照されるすべてのリアクティブな値のリストです。リアクティブな値には、props、state、コンポーネント本体に直接宣言されたすべての変数および関数が含まれます。リンタが [React 用に設定されている場合](/learn/editor-setup#linting)、すべてのリアクティブな値が依存値として正しく指定されているか確認できます。依存値のリストは要素数が一定である必要があり、`[dep1, dep2, dep3]` のようにインラインで記述する必要があります。React は、[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を使った比較で、それぞれの依存値を以前の値と比較します。この引数を省略すると、エフェクトはコンポーネントの毎回のレンダー後に再実行されます。

#### 返り値 {/*returns*/}

`useLayoutEffect` は `undefined` を返します。

#### 注意点 {/*caveats*/}

* `useLayoutEffect` はフックであるため、**コンポーネントのトップレベル**やカスタムフック内でのみ呼び出すことができます。ループや条件文の中で呼び出すことはできません。これが必要な場合は、新しいコンポーネントを抽出し、その中にエフェクトを移動させてください。

* Strict Mode が有効な場合、React は本物のセットアップの前に、**開発時専用のセットアップ+クリーンアップサイクルを 1 回追加で実行**します。これは、クリーンアップロジックがセットアップロジックと鏡のように対応しており、セットアップで行われたことを停止または元に戻していることを保証するためのストレステストです。問題が発生した場合は、[クリーンアップ関数を実装します](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)。

* 依存配列の一部にコンポーネント内で定義されたオブジェクトや関数がある場合、**エフェクトが必要以上に再実行される**可能性があります。これを修正するには、[オブジェクト型](/reference/react/useEffect#removing-unnecessary-object-dependencies)および[関数型](/reference/react/useEffect#removing-unnecessary-function-dependencies)の不要な依存値を削除します。また、エフェクトの外部に [state の更新](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect)や[非リアクティブなロジック](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect)を抽出することもできます。

* エフェクトは**クライアント上でのみ実行されます**。サーバレンダリング中には実行されません。

* `useLayoutEffect` 内のコードと、そこでスケジュールされたすべての state 更新は、**ブラウザによる画面の再描画をブロックします**。過度に使用すると、アプリが遅くなります。可能な限り [`useEffect` を使用してください](/reference/react/useEffect)。

---

## 使用法 {/*usage*/}

### ブラウザが画面を再描画する前にレイアウトを測定する {/*measuring-layout-before-the-browser-repaints-the-screen*/}

ほとんどのコンポーネントは、何をレンダーするかを決定するために、画面上での位置やサイズを知る必要はありません。単に JSX を返します。その後、ブラウザがその*レイアウト*（位置とサイズ）を計算し、画面を再描画します。

しかし、それだけでは不十分な場合もあります。例えば、ある要素をホバーしたときに近くに表示されるツールチップを想像してみてください。十分なスペースがある場合、ツールチップは要素の上に表示されるべきですが、収まらない場合は下に表示されるとします。ツールチップを正しい最終位置にレンダーするためには、その高さ（つまり、上部に収まるかどうか）を知る必要があります。

これを行うには、2 パスでレンダーを行う必要があります：

1. ツールチップを（位置が間違っていても良いので）どこかにレンダーします。
2. ツールチップの高さを測定し、ツールチップを配置する場所を決定します。
3. ツールチップを正しい場所で*再度*レンダーします。

**これらすべては、ブラウザが画面を再描画する前に行わなければなりません**。ユーザにツールチップが移動するのを見せたくないのです。ブラウザが画面を再描画する前にレイアウトの測定を行うために `useLayoutEffect` を呼び出します。

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // You don't know real height yet

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Re-render now that you know the real height
  }, []);

  // ...use tooltipHeight in the rendering logic below...
}
```

動作をステップごとに説明します。

1. `Tooltip` は初回は `tooltipHeight = 0` でレンダーされます（そのため、ツールチップは間違った位置に配置される可能性があります）。
2. React はそれを DOM に配置し、`useLayoutEffect` のコードを実行します。
3. `useLayoutEffect` はツールチップの内容の[高さを測定](https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect)し、即時の再レンダーをトリガします。
4. `Tooltip` は実際の `tooltipHeight` で再度レンダーされます（ツールチップが正しく配置されます）。
5. React が DOM 上で更新を行い、最終的にブラウザがツールチップを表示します。

以下のボタンにホバーしてみて、ツールチップが収まるかどうかに応じて位置を調整する様子を観察してください。

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Measured tooltip height: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

`Tooltip` コンポーネントを 2 パスで（初回は `tooltipHeight` が `0` で、2 回目は実際に測定した高さで）レンダーする必要があるにもかかわらず、最終結果だけが表示されることに注目してください。これが、この例で [`useEffect`](/reference/react/useEffect) の代わりに `useLayoutEffect` が必要な理由です。詳細な違いは以下の通りです。

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` はブラウザの再描画をブロックする {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React は、`useLayoutEffect` 内のコードとその中でスケジュールされたすべての state 更新が、**ブラウザが画面を再描画する前に**処理されることを保証します。これにより、ツールチップをレンダーし、測定し、再度レンダーするという処理を、ユーザが最初の余分なレンダーに気付かないように行うことができます。言い換えると、`useLayoutEffect` はブラウザの描画をブロックします。

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` はブラウザをブロックしない {/*useeffect-does-not-block-the-browser*/}

これは同じ例ですが、`useLayoutEffect` の代わりに [`useEffect`](/reference/react/useEffect) を使用しています。遅いデバイスを使用している場合、ツールチップが修正前の初期位置に一瞬「ちらついて」見えることがあります。

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

バグを再現しやすくするため、このバージョンではレンダー中に人為的な遅延を追加しています。React は、`useEffect` 内の state 更新を処理する前に、ブラウザに画面を描画させます。その結果、ツールチップがちらつきます：

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            This tooltip does not fit above the button.
            <br />
            This is why it's displayed below instead!
          </div>
        }
      >
        Hover over me (tooltip above)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>This tooltip fits above the button</div>
        }
      >
        Hover over me (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // This artificially slows down rendering
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // It doesn't fit above, so place below.
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

この例を `useLayoutEffect` に置き換えて、レンダーが遅くなっても描画をブロックすることを確認してください。

<Solution />

</Recipes>

<Note>

2 パスでレンダーしてブラウザをブロックすることはパフォーマンスを低下させます。できる限り避けてください。

</Note>

---

## トラブルシューティング {/*troubleshooting*/}

### "`useLayoutEffect` does nothing on the server" というエラーが出る {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

`useLayoutEffect` の目的は、コンポーネントがレンダーのために[レイアウト情報を使用できるようにする](#measuring-layout-before-the-browser-repaints-the-screen)ことです。

1. 初期コンテンツをレンダーする。
2. ブラウザが画面を再描画する*前に*レイアウトを測定する。
3. 読み取ったレイアウト情報を使用して最終コンテンツをレンダーする。

あなた、またはあなたのフレームワークが[サーバレンダリング](/reference/react-dom/server)を使用している場合、React アプリは初期表示のためにサーバ上で HTML にレンダーされます。これにより、JavaScript コードがロードされる前に初期 HTML を表示できます。

問題は、サーバ上にはレイアウト情報がないことです。

[先ほどの例](#measuring-layout-before-the-browser-repaints-the-screen)では、`Tooltip` コンポーネント内での `useLayoutEffect` の呼び出しにより、高さに応じて自身を正しくコンテンツの上または下に配置することができていました。初期のサーバ HTML の一部として `Tooltip` をレンダーしようとすると、これは不可能になります。サーバ上ではまだレイアウトが存在しないからです！ したがって、サーバ上でレンダーしても、JavaScript がロードされ実行された際に、クライアント上で位置の「ジャンプ」が起こってしまいます。

通常、レイアウト情報に依存するようなコンポーネントは、サーバ上でレンダーする必要はありません。例えば、初期レンダー中に `Tooltip` を表示することはおそらく無意味です。これはクライアントでのユーザ操作に応じてトリガされるものだからです。

しかし、この問題に直面している場合、いくつかの選択肢があります。

- `useLayoutEffect` を [`useEffect`](/reference/react/useEffect) に置き換えます。これにより React に対して、初期レンダー結果の表示を描画をブロックせずに行ってよいことを伝えます（元の HTML はエフェクトが実行される前に表示されるからです）。

<<<<<<< HEAD
- あるいは、[コンポーネントをクライアント専用としてマークします](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)。これにより React に対して、サーバレンダリング中に最も近い [`<Suspense>`](/reference/react/Suspense) バウンダリまで、コンテンツをロード中というフォールバック（例えば、スピナやグリマー）に置き換えるように指示します。
=======
- Alternatively, [mark your component as client-only.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content) This tells React to replace its content up to the closest [`<Suspense>`](/reference/react/Suspense) boundary with a loading fallback (for example, a spinner or a glimmer) during server rendering.
>>>>>>> a8790ca810c1cebd114db35a433b90eb223dbb04

- あるいは、`useLayoutEffect` を持つコンポーネントをハイドレーションの後にのみレンダーします。`false` に初期化されたブーリアン型の `isMounted` という state を保持しておき、`useEffect` の呼び出し内で `true` に設定します。そしてレンダーロジックは `return isMounted ? <RealContent /> : <FallbackContent />` のようにします。サーバ上およびハイドレーション中は、ユーザは `useLayoutEffect` を呼び出さない `FallbackContent` を見ることになります。その後、React はそれをクライアント専用の `RealContent` に置き換えますが、そこには `useLayoutEffect` の呼び出しを含むことができます。

- コンポーネントを外部データストアと同期させており、レイアウト測定とは異なる理由で `useLayoutEffect` を使っている場合、代わりに [`useSyncExternalStore`](/reference/react/useSyncExternalStore) を検討してみてください。これは[サーバレンダリングをサポートしています](/reference/react/useSyncExternalStore#adding-support-for-server-rendering)。
