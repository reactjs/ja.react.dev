---
title: incompatible-library
---

<Intro>

メモ化（手動でも自動でも）と互換性のないライブラリを使っていないか検証します。

</Intro>

<Note>

これらの非互換ライブラリは、React のメモ化のルールが十分に文書化される前に設計されました。アプリの状態の変化に対し、コンポーネントが必要な分だけリアクティブに反応するよう、使いやすさを重視した設計は、当時としては正しい選択でした。これらの従来のパターンは機能していましたが、その後、React のプログラミングモデルとは互換性がないことが分かりました。今後もライブラリの作者と協力し、React のルールに従うパターンへと移行していきます。

</Note>

## ルールの詳細 {/*rule-details*/}

一部のライブラリは、React がサポートしていないパターンを使っています。リンタは、[既知のリスト](https://github.com/react/react/blob/main/compiler/packages/babel-plugin-react-compiler/src/HIR/DefaultModuleTypeProvider.ts)にある API の使用を検出すると、このルールの違反として報告します。これにより、React Compiler は、互換性のない API を使うコンポーネントを自動的にスキップして、アプリが動作しなくなることを防げます。

```js
// Example of how memoization breaks with these libraries
function Form() {
  const { watch } = useForm();

  // ❌ This value will never update, even when 'name' field changes
  const name = useMemo(() => watch('name'), [watch]);

  return <div>Name: {name}</div>; // UI appears "frozen"
}
```

React Compiler は、React のルールに従って値を自動的にメモ化します。手動で `useMemo` を使って動作しなくなるものは、コンパイラの自動最適化であっても動作しなくなります。このルールは、こうした問題のあるパターンを見つけるのに役立ちます。

<DeepDive>

#### React のルールに従う API の設計 {/*designing-apis-that-follow-the-rules-of-react*/}

ライブラリの API やフックを設計する際に考えるべきことのひとつは、その API の呼び出しを `useMemo` で安全にメモ化できるかどうかです。できなければ、手動のメモ化であれ React Compiler によるメモ化であれ、ユーザのコードは動作しなくなります。

例えば、互換性のないパターンのひとつに「内部可変性 (interior mutability)」があります。内部可変性とは、オブジェクトや関数への参照は変わらないのに、それらが保持する内部の隠れた状態だけが経時的に変化することです。外見は同じままで中身だけがひそかに入れ替わる箱のようなものだと考えてください。React が確認するのは、別の箱が渡されたかどうかだけであり、中身ではないため、変化があったことを判断できません。React は、値の一部が変わったら、それを含むオブジェクト（または関数）も変わることを前提としているため、メモ化が正しく機能しなくなります。

React の API を設計する際の目安として、以下のように `useMemo` を使っても動作するかどうか考えてください。

```js
function Component() {
  const { someFunction } = useLibrary();
  // it should always be safe to memoize functions like this
  const result = useMemo(() => someFunction(), [someFunction]);
}
```

代わりに、イミュータブルな状態を返し、明示的な更新関数を使う API を設計してください。

```js
// ✅ Good: Return immutable state that changes reference when updated
function Component() {
  const { field, updateField } = useLibrary();
  // this is always safe to memo
  const greeting = useMemo(() => `Hello, ${field.name}!`, [field.name]);

  return (
    <div>
      <input
        value={field.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <p>{greeting}</p>
    </div>
  );
}
```

</DeepDive>

### 無効な例 {/*invalid*/}

このルールに違反するコードの例です。

```js
// ❌ react-hook-form `watch`
function Component() {
  const {watch} = useForm();
  const value = watch('field'); // Interior mutability
  return <div>{value}</div>;
}

// ❌ TanStack Table `useReactTable`
function Component({data}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  // table instance uses interior mutability
  return <Table table={table} />;
}
```

<Pitfall>

#### MobX {/*mobx*/}

MobX の `observer` などのパターンもメモ化の前提に反しますが、リンタはまだ検出できません。MobX を使っていて、React Compiler でアプリが動作しなくなる場合は、`"use no memo"` ディレクティブを使う必要があるかもしれません。

```js
// ❌ MobX `observer`
const Component = observer(() => {
  const [timer] = useState(() => new Timer());
  return <span>Seconds passed: {timer.secondsPassed}</span>;
});
```

</Pitfall>

### 有効な例 {/*valid*/}

このルールに従ったコードの例です。

```js
// ✅ For react-hook-form, use `useWatch`:
function Component() {
  const {register, control} = useForm();
  const watchedValue = useWatch({
    control,
    name: 'field'
  });

  return (
    <>
      <input {...register('field')} />
      <div>Current value: {watchedValue}</div>
    </>
  );
}
```

ほかにも、React のメモ化モデルと互換性のある代替 API がまだないライブラリがあります。これらの API を呼び出すコンポーネントやフックがリンタによって自動的にスキップされない場合は、リンタに追加できるよう、[問題を報告](https://github.com/react/react/issues)してください。
