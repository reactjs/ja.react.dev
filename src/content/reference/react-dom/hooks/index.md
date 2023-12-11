---
title: "組み込みの React DOM フック"
---

<Intro>

`react-dom` パッケージには、（ブラウザ DOM 環境で実行される）ウェブアプリケーション専用のフックが含まれています。これらのフックは、iOS、Android、Windows アプリケーションといった非ブラウザ環境ではサポートされていません。ウェブブラウザと*その他の環境*の両方でサポートされるフックを探している場合は、[React のフック一覧ページ](/reference/react)をご覧ください。このページは、`react-dom` パッケージのすべてのフックの一覧です。

</Intro>

---

## フォーム関連フック {/*form-hooks*/}

<Canary>

フォーム関連フックは現在、React の Canary および experimental チャンネルでのみ利用可能です。[React のリリースチャンネルについてはこちらをご覧ください](/community/versioning-policy#all-release-channels)。

</Canary>

*フォーム*により、情報を送信するためのインタラクティブなコントロールを作成できます。コンポーネント内でフォームを管理するために以下のフックを使用できます。

* [`useFormStatus`](/reference/react-dom/hooks/useFormStatus) によりフォームのステータスに基づいて UI を更新できます。
* [`useFormState`](/reference/react-dom/hooks/useFormState) によりフォーム内で state を管理できます。

```js
function Form({ action }) {
  async function increment(n) {
    return n + 1;
  }
  const [count, incrementFormAction] = useFormState(increment, 0);
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

