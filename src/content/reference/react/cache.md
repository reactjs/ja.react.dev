---
title: cache
canary: true
---

<Canary>
* `cache` は、[React サーバコンポーネント](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)で使用するためのものです。React サーバコンポーネントをサポートする[フレームワーク](https://react.dev/learn/start-a-new-react-project#bleeding-edge-react-frameworks)をご覧ください。

* `cache` は、React の [Canary](/community/versioning-policy#canary-channel) と [experimental](/community/versioning-policy#experimental-channel) チャンネルでのみ利用可能です。本番環境で `cache` を使用する前に、制限事項を理解してください。[React のリリースチャンネルについてはこちら](/community/versioning-policy#all-release-channels)をご覧ください。
</Canary>

<Intro>

`cache` を使い、データフェッチや計算結果をキャッシュすることができます。

```js
const cachedFn = cache(fn);
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `cache(fn)` {/*cache*/}

コンポーネントの外部で `cache` を呼び出して、キャッシュが有効化されたバージョンの関数を作成します。

```js {4,7}
import {cache} from 'react';
import calculateMetrics from 'lib/metrics';

const getMetrics = cache(calculateMetrics);

function Chart({data}) {
  const report = getMetrics(data);
  // ...
}
```

`getMetrics` が初めて `data` とともに呼び出されると、`getMetrics` は `calculateMetrics(data)` を呼び出し、その結果をキャッシュに保存します。もし `getMetrics` が同じ `data` で再度呼び出されると、`calculateMetrics(data)` を再度呼び出す代わりにキャッシュされた結果を返します。

[さらに例を見る](#usage)

#### 引数 {/*parameters*/}

- `fn`: 結果をキャッシュしたい関数。`fn` は任意の引数を取り、任意の値を返すことができます。

#### 返り値 {/*returns*/}

`cache` は、同じ型シグネチャを持ち、キャッシュが有効化されたバージョンの `fn` を返します。その際に `fn` 自体は呼び出されません。

何らかの引数で `cachedFn` を呼び出すと、まずキャッシュにキャッシュ済みの結果が存在するかどうかを確認します。キャッシュ済みの結果が存在する場合、その結果を返します。存在しない場合、与えられた引数で `fn` を呼び出し、結果をキャッシュに保存し、その結果を返します。`fn` が呼び出されるのはキャッシュミスが発生したときだけです。

<Note>

入力に基づいて返り値をキャッシュする最適化は、[*メモ化 (memoization)*](https://en.wikipedia.org/wiki/Memoization) として知られています。`cache` から返される関数をメモ化された関数 (memoized function) と呼びます。

</Note>

#### 注意点 {/*caveats*/}

[//]: # 'TODO: add links to Server/Client Component reference once https://github.com/reactjs/react.dev/pull/6177 is merged'

- React は、サーバへの各リクエストごとにすべてのメモ化された関数のキャッシュを無効化します。
- `cache` を呼び出すたびに新しい関数が作成されます。これは、同じ関数で `cache` を複数回呼び出すと、同じキャッシュを共有しない異なるメモ化された関数が返されることを意味します。
- `cachedFn` はエラーもキャッシュします。特定の引数で `fn` がエラーをスローすると、それがキャッシュされ、同じ引数で `cachedFn` が呼び出されると同じエラーが再スローされます。
- `cache` は、[サーバコンポーネント](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)でのみ使用できます。

---

## 使用法 {/*usage*/}

### 高コストな計算をキャッシュする {/*cache-expensive-computation*/}

重複する処理をスキップするために `cache` を使用します。

```js [[1, 7, "getUserMetrics(user)"],[2, 13, "getUserMetrics(user)"]]
import {cache} from 'react';
import calculateUserMetrics from 'lib/user';

const getUserMetrics = cache(calculateUserMetrics);

function Profile({user}) {
  const metrics = getUserMetrics(user);
  // ...
}

function TeamReport({users}) {
  for (let user in users) {
    const metrics = getUserMetrics(user);
    // ...
  }
  // ...
}
```

同じ `user` オブジェクトが `Profile` と `TeamReport` の両方でレンダーされる場合、2 つのコンポーネントは処理を共有でき、その `user` に対して `calculateUserMetrics` が一度だけ呼び出されるようになります。

最初に `Profile` がレンダーされると仮定します。<CodeStep step={1}>`getUserMetrics`</CodeStep> が呼び出され、キャッシュされた結果があるかどうかを確認します。その `user` で `getUserMetrics` を呼び出すのは初めてなので、キャッシュミスが発生します。`getUserMetrics` はその後、その `user` で `calculateUserMetrics` を呼び出し、結果をキャッシュに書き込みます。

`TeamReport` が `users` のリストをレンダーし、同じ `user` オブジェクトに到達すると、<CodeStep step={2}>`getUserMetrics`</CodeStep> を呼び出し、結果をキャッシュから読み取ります。

<Pitfall>

##### メモ化された関数を複数作って呼び出すと異なるキャッシュから読み取られる {/*pitfall-different-memoized-functions*/}

同じキャッシュにアクセスするためには、コンポーネントは同じメモ化された関数を呼び出さなければなりません。

```js [[1, 7, "getWeekReport"], [1, 7, "cache(calculateWeekReport)"], [1, 8, "getWeekReport"]]
// Temperature.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export function Temperature({cityData}) {
  // 🚩 Wrong: Calling `cache` in component creates new `getWeekReport` for each render
  const getWeekReport = cache(calculateWeekReport);
  const report = getWeekReport(cityData);
  // ...
}
```

```js [[2, 6, "getWeekReport"], [2, 6, "cache(calculateWeekReport)"], [2, 9, "getWeekReport"]]
// Precipitation.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

// 🚩 Wrong: `getWeekReport` is only accessible for `Precipitation` component.
const getWeekReport = cache(calculateWeekReport);

export function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```

上記の例では、<CodeStep step={2}>`Precipitation`</CodeStep> と <CodeStep step={1}>`Temperature`</CodeStep> はそれぞれ `cache` を呼び出して、それぞれ独自のキャッシュテーブルを持つ新しいメモ化された関数を作成しています。両方のコンポーネントが同じ `cityData` でレンダーする場合、それぞれが `calculateWeekReport` を呼び出すため、重複した処理が行われることになります。

さらに、`Temperature` はコンポーネントがレンダーされるたびに<CodeStep step={1}>新しいメモ化された関数</CodeStep>を作成しているため、キャッシュによる共有はそもそも一切行えません。

キャッシュヒットを最大化し、処理を減らすためには、2 つのコンポーネントは同じメモ化された関数を呼び出して同じキャッシュにアクセスするべきです。上記のようにするのではなく、複数のコンポーネントから [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) が行えるよう、メモ化された関数をそれ専用のモジュールで定義してください。

```js [[3, 5, "export default cache(calculateWeekReport)"]]
// getWeekReport.js
import {cache} from 'react';
import {calculateWeekReport} from './report';

export default cache(calculateWeekReport);
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Temperature.js
import getWeekReport from './getWeekReport';

export default function Temperature({cityData}) {
	const report = getWeekReport(cityData);
  // ...
}
```

```js [[3, 2, "getWeekReport", 0], [3, 5, "getWeekReport"]]
// Precipitation.js
import getWeekReport from './getWeekReport';

export default function Precipitation({cityData}) {
  const report = getWeekReport(cityData);
  // ...
}
```
これで、両方のコンポーネントが `./getWeekReport.js` からエクスポートされた<CodeStep step={3}>同じメモ化された関数</CodeStep>を呼び出して、同じキャッシュを読み書きするようになります。
</Pitfall>

### データのスナップショットを共有する {/*take-and-share-snapshot-of-data*/}

コンポーネント間でデータのスナップショットを共有するためには、`fetch` のようなデータ取得関数を引数にして `cache` を呼び出します。複数のコンポーネントが同じデータを取得すると、リクエストは 1 回だけ行われ、返されたデータはキャッシュされ、コンポーネント間で共有されます。すべてのコンポーネントはサーバレンダー全体で同一のデータスナップショットを参照します。

```js [[1, 4, "city"], [1, 5, "fetchTemperature(city)"], [2, 4, "getTemperature"], [2, 9, "getTemperature"], [1, 9, "city"], [2, 14, "getTemperature"], [1, 14, "city"]]
import {cache} from 'react';
import {fetchTemperature} from './api.js';

const getTemperature = cache(async (city) => {
	return await fetchTemperature(city);
});

async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}

async function MinimalWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```

`AnimatedWeatherCard` と `MinimalWeatherCard` の両方が同じ <CodeStep step={1}>city</CodeStep> でレンダーする場合、<CodeStep step={2}>メモ化された関数</CodeStep>から同じデータのスナップショットを受け取ります。

`AnimatedWeatherCard` と `MinimalWeatherCard` が異なる <CodeStep step={1}>city</CodeStep> 引数を <CodeStep step={2}>`getTemperature`</CodeStep> に渡した場合、`fetchTemperature` は 2 回呼び出され、それぞれの呼び出しが異なるデータを受け取ります。

<CodeStep step={1}>city</CodeStep> はキャッシュキーとして機能します。

<Note>

[//]: # 'TODO: add links to Server Components when merged.'

<CodeStep step={3}>非同期レンダー</CodeStep>はサーバコンポーネントでのみサポートされています。

```js [[3, 1, "async"], [3, 2, "await"]]
async function AnimatedWeatherCard({city}) {
	const temperature = await getTemperature(city);
	// ...
}
```
[//]: # 'TODO: add link and mention to use documentation when merged'
[//]: # 'To render components that use asynchronous data in Client Components, see `use` documentation.'

</Note>

### データをプリロードする {/*preload-data*/}

時間のかかるデータ取得をキャッシュすることで、コンポーネントのレンダー前に非同期処理を開始することができます。

```jsx [[2, 6, "await getUser(id)"], [1, 17, "getUser(id)"]]
const getUser = cache(async (id) => {
  return await db.user.query(id);
}

async function Profile({id}) {
  const user = await getUser(id);
  return (
    <section>
      <img src={user.profilePic} />
      <h2>{user.name}</h2>
    </section>
  );
}

function Page({id}) {
  // ✅ Good: start fetching the user data
  getUser(id);
  // ... some computational work
  return (
    <>
      <Profile id={id} />
    </>
  );
}
```

`Page` のレンダー時にコンポーネントは <CodeStep step={1}>`getUser`</CodeStep> を呼び出していますが、返されたデータを使用していないことに着目してください。この早期の <CodeStep step={1}>`getUser`</CodeStep> 呼び出しは、`Page` が他の計算処理を行ったり子をレンダーしたりしている間に実行される、非同期のデータベースクエリを開始します。

<<<<<<< HEAD
`Profile` をレンダーするとき、再び <CodeStep step={2}>`getUser`</CodeStep> を呼び出します。最初の <CodeStep step={1}>`getUser`</CodeStep> 呼び出しがすでに完了しユーザデータをキャッシュしている場合、`Profile` が <CodeStep step={2}>このデータを要求して待機する時点</CodeStep>では、新たなリモートプロシージャ呼び出しを必要とせずにキャッシュから単に読み取ることができます。もし<CodeStep step={1}>最初のデータリクエスト</CodeStep>がまだ完了していない場合でも、このパターンでデータをプリロードすることで、データ取得の遅延を減らすことができます。
=======
When rendering `Profile`, we call <CodeStep step={2}>`getUser`</CodeStep> again. If the initial <CodeStep step={1}>`getUser`</CodeStep> call has already returned and cached the user data, when `Profile` <CodeStep step={2}>asks and waits for this data</CodeStep>, it can simply read from the cache without requiring another remote procedure call. If the <CodeStep step={1}> initial data request</CodeStep> hasn't been completed, preloading data in this pattern reduces delay in data-fetching.
>>>>>>> a0cacd7d3a89375e5689ccfba0461e293bfe9eeb

<DeepDive>

#### 非同期処理のキャッシュ {/*caching-asynchronous-work*/}

[非同期関数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)を評価すると、その処理の[プロミス (Promise)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) を受け取ります。プロミスはその処理の状態 (_pending_、_fulfilled_、_failed_) とその最終的な結果を保持します。

この例では、非同期関数 <CodeStep step={1}>`fetchData`</CodeStep> は `fetch` 結果を待機するプロミスを返します。

```js [[1, 1, "fetchData()"], [2, 8, "getData()"], [3, 10, "getData()"]]
async function fetchData() {
  return await fetch(`https://...`);
}

const getData = cache(fetchData);

async function MyComponent() {
  getData();
  // ... some computational work  
  await getData();
  // ...
}
```

最初の <CodeStep step={2}>`getData`</CodeStep> 呼び出しでは、<CodeStep step={1}>`fetchData`</CodeStep> から返されたプロミスがキャッシュされます。その後のキャッシュ探索では、同じプロミスが返されます。

最初の <CodeStep step={2}>`getData`</CodeStep> 呼び出しでは `await` しておらず、<CodeStep step={3}>2 回目の呼び出し</CodeStep> では `await` していることに注目してください。[`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) は JavaScript の演算子であり、プロミスの結果を待機して返します。最初の <CodeStep step={2}>`getData`</CodeStep> 呼び出しは単に `fetch` を開始してプロミスをキャッシュし、2 回目の <CodeStep step={3}>`getData`</CodeStep> のときに見つかるようにしているのです。

<CodeStep step={3}>2 回目の呼び出し</CodeStep>時点でプロミスがまだ _pending_ の場合、`await` は結果を待ちます。`fetch` を待っている間に React が計算処理を続けることができるため、<CodeStep step={3}>2 回目の呼び出し</CodeStep>の待ち時間を短縮できる、という最適化になります。

プロミスの最終状態がすでに決定 (settled) している場合、結果がエラーの場合でも正常終了 (fulfilled) の場合でも、`await` はその値をすぐに返します。どちらの結果でも、パフォーマンス上の利点があります。
</DeepDive>

<Pitfall>

##### メモ化された関数をコンポーネント外で呼び出すとキャッシュは使用されない {/*pitfall-memoized-call-outside-component*/}

```jsx [[1, 3, "getUser"]]
import {cache} from 'react';

const getUser = cache(async (userId) => {
  return await db.user.query(userId);
});

// 🚩 Wrong: Calling memoized function outside of component will not memoize.
getUser('demo-id');

async function DemoProfile() {
  // ✅ Good: `getUser` will memoize.
  const user = await getUser('demo-id');
  return <Profile user={user} />;
}
```

React がメモ化された関数に対してキャッシュアクセスを提供するのはコンポーネント内のみです。コンポーネントの外部で <CodeStep step={1}>`getUser`</CodeStep> を呼び出した場合も関数は評価されますが、キャッシュは読み取られず、更新もされません。

これは、キャッシュアクセスがコンポーネントからのみアクセス可能な[コンテクスト](/learn/passing-data-deeply-with-context)を通じて提供されるためです。

</Pitfall>

<DeepDive>

#### `cache`、[`memo`](/reference/react/memo)、[`useMemo`](/reference/react/useMemo) のどれをいつ使うべきか {/*cache-memo-usememo*/}

上記のすべての API はメモ化を提供しますが、それらが何をメモ化することを意図しているか、誰がキャッシュにアクセスできるか、そしてキャッシュが無効になるタイミングはいつか、という点で違いがあります。

#### `useMemo` {/*deep-dive-use-memo*/}

一般的に、[`useMemo`](/reference/react/useMemo) は、レンダー間でクライアントコンポーネント内の高コストな計算をキャッシュするために使用すべきです。例えば、コンポーネント内のデータの変換をメモ化するために使用します。

```jsx {4}
'use client';

function WeatherReport({record}) {
  const avgTemp = useMemo(() => calculateAvg(record)), record);
  // ...
}

function App() {
  const record = getRecord();
  return (
    <>
      <WeatherReport record={record} />
      <WeatherReport record={record} />
    </>
  );
}
```
この例では、`App` は同じレコードで 2 つの `WeatherReport` をレンダーしています。両方のコンポーネントが同じ処理を行っていますが、処理を共有することはできません。`useMemo` のキャッシュはコンポーネントのローカルにしか存在しません。

しかし `useMemo` は、`App` が再レンダーされるが `record` オブジェクトが変わらない場合に、コンポーネントの各インスタンスが処理をスキップしてメモ化された `avgTemp` 値を使用できるようにします。`useMemo` は、与えられた依存配列に対応する `avgTemp` の最後の計算結果のみをキャッシュします。

#### `cache` {/*deep-dive-cache*/}

一般的に、`cache` は、コンポーネント間で共有できる処理をメモ化するために、サーバコンポーネントで使用すべきです。

```js [[1, 12, "<WeatherReport city={city} />"], [3, 13, "<WeatherReport city={city} />"], [2, 1, "cache(fetchReport)"]]
const cachedFetchReport = cache(fetchReport);

function WeatherReport({city}) {
  const report = cachedFetchReport(city);
  // ...
}

function App() {
  const city = "Los Angeles";
  return (
    <>
      <WeatherReport city={city} />
      <WeatherReport city={city} />
    </>
  );
}
```
前の例を `cache` を使用して書き直すと、この場合 <CodeStep step={3}>2 番目の `WeatherReport` インスタンス</CodeStep> は重複する処理をスキップし、<CodeStep step={1}>最初の `WeatherReport`</CodeStep> と同じキャッシュから読み取ることができます。前の例とのもうひとつの違いは、`cache` が<CodeStep step={2}>データフェッチのメモ化</CodeStep>にも推奨されているということです。これは `useMemo` が計算のみに使用すべきであることとは対照的です。

現時点では、`cache` はサーバコンポーネントでのみ使用すべきです。キャッシュはサーバリクエストをまたぐと無効化されます。

#### `memo` {/*deep-dive-memo*/}

[`memo`](reference/react/memo) は、props が変わらない場合にコンポーネントの再レンダーを防ぐために使用すべきです。

```js
'use client';

function WeatherReport({record}) {
  const avgTemp = calculateAvg(record); 
  // ...
}

const MemoWeatherReport = memo(WeatherReport);

function App() {
  const record = getRecord();
  return (
    <>
      <MemoWeatherReport record={record} />
      <MemoWeatherReport record={record} />
    </>
  );
}
```

この例では、両方の `MemoWeatherReport` コンポーネントは最初にレンダーされたときに `calculateAvg` を呼び出します。しかし、`App` が再レンダーされ、`record` に変更がない場合、props は一切変わらないため `MemoWeatherReport` は再レンダーされません。

`useMemo` とは異なり、`memo` は特定の計算ではなく props に基づいてコンポーネントのレンダーをメモ化します。一方で最後の props の値に対応する最後のレンダー結果だけがキャッシュされるという点では `useMemo` と似ています。props が変更されるとキャッシュは無効化され、コンポーネントは再レンダーされます。

</DeepDive>

---

## トラブルシューティング {/*troubleshooting*/}

### メモ化された関数が、同じ引数で呼び出されても実行される {/*memoized-function-still-runs*/}

上で述べた落とし穴を参照してください。
* [メモ化された関数を複数呼び出すと、別々のキャッシュから読み取られてしまいます](#pitfall-different-memoized-functions)。
* [メモ化された関数をコンポーネントの外部で呼び出すと、キャッシュは使用されません](#pitfall-memoized-call-outside-component)。

上記のいずれも該当しない場合、何かがキャッシュに存在するかどうかを React がチェックする方法に関連した問題かもしれません。

引数が[プリミティブ](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)でない場合（例：オブジェクト、関数、配列）、同じオブジェクト参照を渡していることを確認してください。

メモ化された関数を呼び出すとき、React は入力された引数を調べて結果がすでにキャッシュされているかどうかを確認します。React は引数に対して浅い (shallow) 比較を行い、キャッシュヒットがあるかどうかを判断します。

```js
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // 🚩 Wrong: props is an object that changes every render.
  const length = calculateNorm(props);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

この例では、2 つの `MapMarker` が同じ処理を行っており、`calculateNorm` を `{x: 10, y: 10, z:10}` という同じ値で呼び出しているように見えます。しかしそれぞれのコンポーネントが別々に `props` オブジェクトを作成しているため、これらのオブジェクトは同じ値を含んでいますが、同じオブジェクト参照ではありません。

React は入力に対して [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) を呼び出し、キャッシュヒットがあるかどうかを確認します。

```js {3,9}
import {cache} from 'react';

const calculateNorm = cache((x, y, z) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass primitives to memoized function
  const length = calculateNorm(props.x, props.y, props.z);
  // ...
}

function App() {
  return (
    <>
      <MapMarker x={10} y={10} z={10} />
      <MapMarker x={10} y={10} z={10} />
    </>
  );
}
```

これを解決するひとつの方法は、ベクトルの各次元の値を別々に `calculateNorm` に渡すことです。各次元の値はプリミティブであるため、これは機能します。

ありえる別の解決策は、ベクトルオブジェクト自体をコンポーネントの props として渡すことです。同じオブジェクトを両方のコンポーネントインスタンスに渡す必要があります。

```js {3,9,14}
import {cache} from 'react';

const calculateNorm = cache((vector) => {
  // ...
});

function MapMarker(props) {
  // ✅ Good: Pass the same `vector` object
  const length = calculateNorm(props.vector);
  // ...
}

function App() {
  const vector = [10, 10, 10];
  return (
    <>
      <MapMarker vector={vector} />
      <MapMarker vector={vector} />
    </>
  );
}
```

