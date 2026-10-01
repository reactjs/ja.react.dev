---
title: cacheSignal
---

<RSC>

`cacheSignal` は現在、[React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) でのみ使用できます。

</RSC>

<Intro>

`cacheSignal` を使用すると、`cache()` のライフタイムが終了したタイミングを知ることができます。

```js
const signal = cacheSignal();
```

</Intro>

<InlineToc />

---

## リファレンス {/*reference*/}

### `cacheSignal` {/*cachesignal*/}

`cacheSignal` を呼び出すことで `AbortSignal` を取得できます。

```js {3,7}
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

React がレンダーを完了すると、`AbortSignal` は中断されます。これにより、不要になった進行中の処理をキャンセルできます。
レンダーは、次のいずれかの場合に完了したとみなされます。
- React が正常にレンダーを完了した場合
- レンダーが中断された場合
- レンダーが失敗した場合

#### 引数 {/*parameters*/}

この関数は引数を受け取りません。

#### 返り値 {/*returns*/}

`cacheSignal` は、レンダー中に呼び出された場合、`AbortSignal` を返します。それ以外の場合、`cacheSignal()` は `null` を返します。

#### 注意点 {/*caveats*/}

- `cacheSignal` は現在、[React Server Components](/reference/rsc/server-components) でのみ使用できます。クライアントコンポーネントでは常に `null` を返します。将来的には、クライアントキャッシュの更新や無効化が行われる際にクライアントコンポーネントでも使用される予定です。クライアントでは常に `null` になるとは想定しないでください。
- レンダーの外で呼び出された場合、`cacheSignal` は `null` を返します。これは、現在のスコープが永続的にキャッシュされるものではないことを明確にするためです。

---

## 使用法 {/*usage*/}

### 進行中のリクエストをキャンセルする {/*cancel-in-flight-requests*/}

進行中のリクエストを中断するには、<CodeStep step={1}>`cacheSignal`</CodeStep> を呼び出します。

```js [[1, 4, "cacheSignal()"]]
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);
async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

<Pitfall>
レンダーの外で開始された非同期処理は `cacheSignal` を使用して中断できません。例えば、次のようなコードです。

```js
import {cacheSignal} from 'react';
// 🚩 Pitfall: The request will not actually be aborted if the rendering of `Component` is finished.
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```
</Pitfall>

### React がレンダーを完了した後のエラーを無視する {/*ignore-errors-after-react-has-finished-rendering*/}

関数が例外をスローした場合、その原因がキャンセルであることがあります（例えば、<CodeStep step={1}>データベース接続</CodeStep> が閉じられた場合など）。<CodeStep step={2}>`aborted` プロパティ</CodeStep> を使用すると、そのエラーがキャンセルによるものか、本当のエラーなのかを確認できます。キャンセルが原因のエラーを、<CodeStep step={3}>無視</CodeStep> すべき場合があります。

```js [[1, 2, "./database"], [2, 8, "cacheSignal()?.aborted"], [3, 12, "return null"]]
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // only log if it's a real error and not due to cancellation
       logError(x);
     }
     return null;
  }
}

async function Component({id}) {
  const data = await getData(id);
  if (data === null) {
    return <div>No data available</div>;
  }
  return <div>{data.name}</div>;
}
```
