---
title: "組み込みの React DOM フック"
---

<Intro>

<<<<<<< HEAD
`react-dom` パッケージには、（ブラウザ DOM 環境で実行される）ウェブアプリケーション専用のフックが含まれています。これらのフックは、iOS、Android、Windows アプリケーションといった非ブラウザ環境ではサポートされていません。ウェブブラウザと*その他の環境*の両方でサポートされるフックを探している場合は、[React のフック一覧ページ](/reference/react)をご覧ください。このページは、`react-dom` パッケージのすべてのフックの一覧です。
=======
The `react-dom` package contains Hooks that are only supported for web applications (which run in the browser DOM environment). These Hooks are not supported in non-browser environments like iOS, Android, or Windows applications. If you are looking for Hooks that are supported in web browsers *and other environments* see [the React Hooks page](/reference/react/hooks). This page lists all the Hooks in the `react-dom` package.
>>>>>>> f8c81a0f4f8e454c850f0c854ad054b32313345c

</Intro>

---

## フォーム関連フック {/*form-hooks*/}

*フォーム*により、情報を送信するためのインタラクティブなコントロールを作成できます。コンポーネント内でフォームを管理するために以下のフックを使用できます。

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) によりフォームのステータスに基づいて UI を更新できます。

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useActionState(increment, 0);
  return (
    <form action={action}>
      <button formAction={incrementFormAction}>Count: {count}</button>
      <Button />
    </form>
  );
}

function Button() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} type="submit">
      Submit
    </button>
  );
}
```
