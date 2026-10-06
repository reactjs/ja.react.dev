---
title: set-state-in-effect
---

<Intro>

パフォーマンスを低下させる再レンダーにつながる、エフェクト内での同期的な setState 呼び出しを行っていないか検証します。

</Intro>

## ルールの詳細 {/*rule-details*/}

エフェクト内で即座に state を設定すると、React はレンダーサイクル全体を最初からやり直すことになります。エフェクト内で state を更新すると、React はコンポーネントを再レンダーし、DOM に変更を適用してから、エフェクトを再び実行しなければなりません。これにより、レンダー中に直接データを変換したり、props から state を導出したりすれば避けられたはずの、余分なレンダーが発生します。代わりに、コンポーネントのトップレベルでデータを変換してください。このコードは、props や state が変わると自然に再実行され、余分なレンダーサイクルを引き起こしません。

エフェクト内で同期的に `setState` を呼び出すと、ブラウザがペイントする前に即座に再レンダーが起き、パフォーマンスの問題や表示のちらつきを引き起こします。React は、state の更新を適用するために 1 回、そしてエフェクトの実行後にもう 1 回、合計 2 回レンダーすることになります。1 回のレンダーで同じ結果を得られる場合、この二重のレンダーは無駄です。

多くの場合、そもそもエフェクト自体が不要かもしれません。詳細は、[そのエフェクトは不要かも](/learn/you-might-not-need-an-effect)を参照してください。

## よくある違反 {/*common-violations*/}

このルールは、同期的な setState が不要なのに使われているパターンを検出します。

- ローディングを表す state を同期的に設定している
- エフェクト内で props から state を導出している
- レンダー中ではなくエフェクト内でデータを変換している

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ Synchronous setState in effect
function Component({data}) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data); // Extra render, use initial state instead
  }, [data]);
}

// ❌ Setting loading state synchronously
function Component() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true); // Synchronous, causes extra render
    fetchData().then(() => setLoading(false));
  }, []);
}

// ❌ Transforming data in effect
function Component({rawData}) {
  const [processed, setProcessed] = useState([]);

  useEffect(() => {
    setProcessed(rawData.map(transform)); // Should derive in render
  }, [rawData]);
}

// ❌ Deriving state from props
function Component({selectedId, items}) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(items.find(i => i.id === selectedId));
  }, [selectedId, items]);
}
```

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ setState in an effect is fine if the value comes from a ref
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
}

// ✅ Calculate during render
function Component({selectedId, items}) {
  const selected = items.find(i => i.id === selectedId);
  return <div>{selected?.name}</div>;
}
```

**既存の props や state から計算できるものを、state に保存しないでください**。代わりに、レンダー中に計算してください。これにより、コードが高速でシンプルになり、間違いが起きにくくなります。詳細は、[そのエフェクトは不要かも](/learn/you-might-not-need-an-effect)を参照してください。
