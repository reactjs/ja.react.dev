---
id: testing-recipes
title: テストのレシピ集
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

React コンポーネントのための一般的なテストのパターン集です。

> 補足：
>
> このページではテストランナーとして [Jest](https://jestjs.io/) を使用することを前提としています。もし別のテストランナーを使う場合は API を修正する必要があるかもしれませんが、やり方の全体的な見た目についてはおそらく同じようなものになるはずです。テスト環境のセットアップについては [テスト環境](/docs/testing-environments.html) のページをご覧ください。

このページでは主に関数コンポーネントを利用します。しかし以下に述べるテスト手法は実装の詳細には依存しませんので、クラスコンポーネントでも全く同様に動作します。

- [セットアップ/後始末](#setup--teardown)
- [`act()`](#act)
- [レンダー](#rendering)
- [データの取得](#data-fetching)
- [モジュールのモック化](#mocking-modules)
- [イベント](#events)
- [タイマー](#timers)
- [スナップショットテスト](#snapshot-testing)
- [複数のレンダラ](#multiple-renderers)
- [何かが足りない？](#something-missing)

---

### セットアップ/後始末 {#setup--teardown}

それぞれのテストにおいて、通常われわれは React ツリーを `document` に結びついた DOM 要素として描画することになります。これは DOM イベントを受け取れるようにするために重要です。テストが終了した際に「クリーンアップ」を行い、`document` からツリーをアンマウントします。

このためによく行うのは `beforeEach` と `afterEach` ブロックのペアを使い、それらを常に実行することで、各テストの副作用がそれ自身にとどまるようにすることです。

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

他のパターンを利用しても構いませんが、*仮にテストが失敗した場合でも*クリーンアップコードを実行するようにするべき、ということを覚えておいてください。さもなくば、テストは「穴の開いた」ものとなってしまい、あるテストが他のテストの挙動に影響するようになってしまいます。これはデバッグを困難にします。

---

### `act()` {#act}

UI テストを記述する際、レンダー、ユーザイベント、データの取得といったタスクはユーザインターフェースへのインタラクションの「ユニット ("unit")」であると考えることができます。React が提供する `act()` というヘルパーは、あなたが何らかのアサーションを行う前に、これらの「ユニット」に関連する更新がすべて処理され、DOM に反映されていることを保証します。

```js
act(() => {
  // render components
});
// make assertions
```

これによりあなたのテストは、実際のユーザがアプリケーションを使う時に体験するのと近い状況で実行されるようになります。以下の例ではこのような保証を得るために `act()` を利用しています。

直接 `act()` を使うのはちょっと冗長だと感じるかもしれません。ボイラープレートの記述を軽減するために、[React Testing Library](https://testing-library.com/react) のようなライブラリを使うこともできます。このライブラリのヘルパは `act()` でラップされています。

> 補足：
>
> `act` という名称は [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) パターンから来ています。

---

### レンダー {#rendering}

与えられた props に対してコンポーネントが正しくレンダーされているかをテストしたいことがよくあります。props の内容に応じてメッセージをレンダーする以下のシンプルなコンポーネントを考えてください。

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

このコンポーネントのテストは以下のように書くことができます：

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### データの取得 {#data-fetching}

あなたのテスト内で本物の API を呼ぶかわりに、リクエストをモック化してダミーのデータを返すようにできます。データ取得をモック化して「フェイク」のデータを使うことで、バックエンドが利用できないせいでテストが不確実にならずに済み、テストの動作が高速になります。とはいえ、テストの一部については、アプリケーション全体が協調して動作しているかを確認できる ["end-to-end"](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) のフレームワークを利用して実行したいかもしれません。

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

このコンポーネントに対するテストは以下のように書けます：

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
```

---

### モジュールのモック化 {#mocking-modules}

モジュールによってはテスト環境でうまく動かないものや、テスト自体にとって本質的でないものがあります。これらのモジュールをモック化してダミーに置き換えることで、あなた自身のコードに対するテストが記述しやすくなることがあります。

サードパーティーの `GoogleMap` を埋め込んでいる `Contact` というコンポーネントがあるとします：

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

我々のテスト中でこのコンポーネントをロードしたくない場合、この依存モジュール自体をダミーのコンポーネントにモック化した上でテストを実行することができます：

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### イベント {#events}

DOM 要素に対して本物の DOM イベントをディスパッチし、その結果に対してアサーションを行うことをお勧めします。以下の `Toggle` コンポーネントを考えてみましょう：

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

これに対するテストは以下のように書けます：

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  // container *must* be attached to document so events work correctly.
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // get ahold of the button element, and trigger some clicks on it
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

その他の DOM イベントやそれらのプロパティは [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) で解説されています。React のリスナにイベントが到達するように、作成するそれぞれのイベントに対して `{ bubbles: true }` を指定する必要があることに気を付けてください。React ではイベントは自動的に document にデリゲートする形で処理されるためです。

> 補足：
>
> React Testing Library にはイベントを発火するための[より簡便なヘルパ](https://testing-library.com/docs/dom-testing-library/api-events)があります。

---

### タイマー {#timers}

あなたのコードでは、未来に行う作業をスケジュールするために `setTimeout` のようなタイマーベースの関数を使っているかもしれません。以下の例では、選択肢のパネルを表示してどれかが選択されるまで待ちますが、5 秒以内に選択が起きなければタイムアウトするようになっています。

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

このコンポーネントに対するテストは、[Jest のタイマーモック](https://jestjs.io/docs/en/timer-mocks)を活用し、可能性のある状態のそれぞれをテストする、というやりかたで書くことができます。

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // move ahead in time by 100ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // and then move ahead by 5 seconds
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // unmount the app
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

フェイクタイマーは一部のテストでのみ使うようにすることができます。上記の例では、`jest.useFakeTimers()` を呼ぶことでフェイクタイマーを有効化しています。これによる主な利点は、実行されるまで実際に 5 秒待つ必要がないということと、テストのためだけにコンポーネントのコードをより複雑にする必要がない、ということです。

---

### スナップショットテスト {#snapshot-testing}

Jest のようなフレームワークでは、[`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing) を使ってデータの「スナップショット」を保存することができます。これを使うことで、レンダーされたコンポーネントの出力を「セーブ」しておき、変更がスナップショットへの変更として明示的にコミットされるよう保証できます。

以下の例では、コンポーネントをレンダーし、作成された HTML を [`pretty`](https://www.npmjs.com/package/pretty) パッケージで整形し、インラインスナップショットとして保存します：

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */
});
```

一般的には、スナップショットを使うよりもより個別的なアサーションを行う方がベターです。このようなテストは実装の詳細を含んでいるために壊れやすく、チームはスナップショットが壊れても気にならないようになってしまうかもしれません。選択的に[一部の子コンポーネントをモックする](#mocking-modules)ことで、スナップショットのサイズを減らし、コードレビューで読みやすく保つことができるようになります。

---

### 複数のレンダラ {#multiple-renderers}

稀なケースにおいて、複数のレンダラを使うコンポーネントに対するテストを実行することがあるかもしれません。例えば、`react-test-renderer` を使ってコンポーネントのスナップショットテストを走らせているが、その内部で子コンポーネントが何かを表示するのに `ReactDOM.render` が使われている、ということがあるかもしれません。このようなシナリオでは、それらのレンダラーに対応する複数の `act()` で更新をラップすることができます。

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### 何かが足りない？ {#something-missing}

もしよくあるシナリオがカバーされていない場合は、ドキュメント用ウェブサイトの[イシュートラッカ](https://github.com/reactjs/reactjs.org/issues)でお知らせください。
