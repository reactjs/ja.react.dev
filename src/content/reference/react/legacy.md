---
title: "レガシー React API"
---

<Intro>

これらの API は `react` パッケージからエクスポートされていますが、新しく書くコードでの使用は推奨されていません。代替手段については、リンク先の個々の API ページを参照してください。

</Intro>

---

## レガシー API {/*legacy-apis*/}

* [`Children`](/reference/react/Children) を用いて、props として受け取る `children` の JSX を操作・変換します。[代替手段](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) を用いて、別の要素に基づいて React 要素を作成します。[代替手段](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) を用いて、JavaScript クラスとして React コンポーネントを定義します。[代替手段](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) を用いて、React 要素を作成します。通常は代わりに JSX を使用します。
* [`createRef`](/reference/react/createRef) を用いて、任意の値を保持できる ref オブジェクトを作成します。[代替手段](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) を用いて、値が React 要素であるかどうかを確認します。通常は [`cloneElement`](/reference/react/cloneElement) と一緒に使用されます。
* [`PureComponent`](/reference/react/PureComponent) は [`Component`](/reference/react/Component) に似ていますが、同じ props での再レンダーをスキップします。[代替手段](/reference/react/PureComponent#alternatives)


---

## 廃止予定の API {/*deprecated-apis*/}

<Deprecated>

これらの API は、React の将来のメジャーバージョンで削除される予定です。

</Deprecated>

* [`createFactory`](/reference/react/createFactory) は、特定のタイプの React 要素を生成する関数を作成します。
