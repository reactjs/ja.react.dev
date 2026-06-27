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

`AbortSignal` を取得するには、`cacheSignal` を呼び出します。

```js {3,7}
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

React がレンダリングを完了すると、`AbortSignal` は中断されます。これにより、不要になった進行中の処理をキャンセルできます。
レンダリングは、次のいずれかの場合に完了したとみなされます。
- React が正常にレンダリングを完了した場合
- レンダリングが中断された場合
- レンダリングが失敗した場合

#### パラメータ {/*parameters*/}

この関数はパラメータを受け取りません。

#### 返り値 {/*returns*/}

`cacheSignal` は、レンダリング中に呼び出された場合、`AbortSignal` を返します。それ以外の場合、`cacheSignal()` は `null` を返します。

#### 注意事項 {/*caveats*/}

- `cacheSignal` は現在、[React Server Components](/reference/rsc/server-components) でのみ使用できます。Client Components では常に `null` を返します。将来的には、クライアントキャッシュの更新や無効化が行われる際に Client Component でも使用される予定です。クライアントでは常に `null` になるとは想定しないでください。
- レンダリングの外で呼び出された場合、`cacheSignal` は `null` を返します。これは、現在のスコープが永続的にキャッシュされるものではないことを明確にするためです。

---

## 使用方法 {/*usage*/}

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
レンダリングの外で開始された非同期処理は `cacheSignal` を使用して中断できません。例えば、次のようなコードです。

```js
import {cacheSignal} from 'react';
// 🚩 注意: `Component` のレンダリングが終了しても、このリクエストは実際には中断されません。
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```
</Pitfall>

### React がレンダリングを完了した後のエラーを無視する {/*ignore-errors-after-react-has-finished-rendering*/}

関数が例外をスローした場合、その原因がキャンセルであることがあります（例えば、<CodeStep step={1}>データベース接続</CodeStep> が閉じられた場合など）。<CodeStep step={2}>`aborted` プロパティ</CodeStep> を使用すると、そのエラーがキャンセルによるものか、本当のエラーなのかを確認できます。キャンセルが原因のエラーは、<CodeStep step={3}>無視</CodeStep> したい場合があります。

```js [[1, 2, "./database"], [2, 8, "cacheSignal()?.aborted"], [3, 12, "return null"]]
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // キャンセルではなく、実際のエラーの場合のみログを記録する
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
