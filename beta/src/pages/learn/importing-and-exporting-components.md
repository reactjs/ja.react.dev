---
title: コンポーネントのインポートとエクスポート
---

<Intro>

コンポーネントの魅力は再利用のしやすさにあります。他のコンポーネントを組み合わせて新しいコンポーネントを作ることができるのです。しかし、コンポーネントのネストが増えてくると、それらを別のファイルに分割したくなってきます。これにより、欲しいファイルを簡単に見つけ出し、より多くの場所でコンポーネントを再利用できるようになります。

</Intro>

<YouWillLearn>

* ルートコンポーネントファイルとは何か
* コンポーネントのインポート・エクスポートの方法
* デフォルトインポート/エクスポートと名前付きインポート/エクスポートの使い分け
* 1 つのファイルから複数のコンポーネントをインポート・エクスポートする方法
* コンポーネントを複数のファイルに分割する方法

</YouWillLearn>

## ルートコンポーネントファイル {/*the-root-component-file*/}

[初めてのコンポーネント](/learn/your-first-component) では、`Profile` コンポーネントと、それをレンダーする `Gallery` コンポーネントを作成しました。

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

これらのコンポーネントは今のところ、**ルートコンポーネントファイル**（この例では `App.js` という名前）に置かれています。[Create React App](https://create-react-app.dev/) を使うとアプリは `src/App.js` に置かれます。セットアップによっては、ルートコンポーネントは別のファイルに存在するかもしれません。Next.js のようなファイルベースのルーティングがあるフレームワークを使っている場合、ルートコンポーネントはページごとに異なるものになります。

## コンポーネントのエクスポートとインポート {/*exporting-and-importing-a-component*/}

もし将来ランディングページを変更して科学書のリストを表示したくなった場合はどうでしょうか。あるいはプロフィールを別の場所に表示したくなった場合は？ `Gallery` や `Profile` はルートコンポーネントファイル以外の場所に置きたくなるでしょう。これによりコンポーネントはよりモジュール化され、他のファイルから再利用可能になります。コンポーネントの移動は以下の 3 ステップで行えます：

1. コンポーネントを置くための新しい JS ファイルを**作成する**。
2. [デフォルト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export)エクスポートあるいは[名前付き](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)エクスポートのいずれかを使い、関数コンポーネントをそのファイルから**エクスポートする**。
3. 当該コンポーネントを利用するファイルで**インポート**する。[デフォルト](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults)エクスポートされたか[名前付き](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module)エクスポートされたかに応じて対応するインポート手法を使う。

以下の例では、`Profile` と `Gallery` の両方が `App.js` から `Gallery.js` という新しいファイルへと移動しています。`App.js` を書きかえて、`Gallery.js` から `Gallery` をインポートするようにできます：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

元の例がどのようにして 2 つのコンポーネントファイルに分割されたか確認しましょう：

1. `Gallery.js` は：
     - `Profile` を定義しているが同じファイルでしか使われていないのでエクスポートされていない。
     - **デフォルトエクスポート** として `Gallery` コンポーネントをエクスポートしている。
2. `App.js` は：
     - `Gallery.js` から `Gallery` を**デフォルトインポート**している。
     - ルートの `App` コンポーネントを**デフォルトエクスポート**している。


<Note>

`.js` というファイル拡張子が省略された、以下のようなファイルを見ることがあるかもしれません：

```js 
import Gallery from './Gallery';
```

React では `'./Gallery.js'` でも `'./Gallery'` でも動作しますが、前者の方が[ネイティブ ES モジュール](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)の動作により近い方法です。

</Note>

<DeepDive title="デフォルトエクスポート vs 名前付きエクスポート">

JavaScript には値をエクスポートする主な方法が 2 つあります。デフォルトエクスポートと名前付きエクスポートです。これまで、我々の例ではデフォルトエクスポートのみを使ってきました。しかし同じファイルで両方使うことも、あるいはどちらか片方だけを使うことも可能です。**ファイルには*デフォルト*エクスポートは 1 つまでしか置けませんが、*名前付き*エクスポートは好きなだけ置くことができます。**

![デフォルトエクスポートと名前付きエクスポート](/images/docs/illustrations/i_import-export.svg)

どのようにコンポーネントをエクスポートするかによって、それをどのようにインポートするのかが決まります。デフォルトエクスポートされたものを名前付きエクスポートのようにインポートしようとするとエラーになります！ 以下の表が参考になるでしょう：

| 構文             | Export 文                                   | Import 文                                        |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

*デフォルト*インポート書く場合、`import` の後には好きな名前を書くことができます。例えば `import Banana from './button.js'` と書いたとしても、同じデフォルトエクスポートされたものを得ることができます。一方で、名前付きエクスポートでは、エクスポート側とインポート側で名前が合致していなければなりません。だからこそ*名前付き*エクスポートと呼ばれるわけですね。

**ファイルがコンポーネントを 1 つだけエクスポートする場合はデフォルトエクスポートが、複数のコンポーネントや値をエクスポートする場合は名前付きエクスポートがよく使われます。**どちらのコーディングスタイルが好みの場合でも、コンポーネントやそれが入るファイルには、常に意味の通った名前を付けるようにしてください。`export default () => {}` のような名前のないコンポーネントは、デバッグが困難になるため推奨されません。

</DeepDive>

## 同じファイルから複数のコンポーネントをエクスポート・インポートする {/*exporting-and-importing-multiple-components-from-the-same-file*/}

ギャラリーではなく、`Profile` を 1 つだけを表示したい場合はどうでしょう。`Profile` コンポーネントもエクスポートすればいいのです。しかし、`Gallery.js` にはすでにデフォルトエクスポートがあり、デフォルトエクスポートは 2 つ以上存在できません。デフォルトエクスポートを持つ新しいファイルを作成するか、または `Profile` 用の*名前付き*エクスポートを追加することができます。**1 つのファイルはデフォルトエクスポートを 1 つしか持つことができませんが、名前付きエクスポートはたくさんあっても構いません！**。

> デフォルトエクスポートと名前付きエクスポートとで混乱する可能性を減らすために、チームによっては 1 つのスタイル（デフォルトまたは名前付き）に統一したり、1 つのファイルでこれらを混在させないようにしています。これは好みの問題です。自分たちに合った方法を選んでください！

まずは `Gallery.js` の `Profile` を名前付きで**エクスポート**します（`default` キーワードは付けない）：

```js
export function Profile() {
  // ...
}
```

そして、`Gallery.js` の `Profile` を `App.js` に名前付きで**インポート**します（中括弧を使う）：

```js
import { Profile } from './Gallery.js';
```

最後に `App` コンポーネントで `<Profile />` を**レンダー**します：

```js
export default function App() {
  return <Profile />;
}
```

これで `Gallery.js` には、デフォルトの `Gallery` というエクスポートと、名前付きの `Profile` というエクスポートの 2 つが含まれるようになりました。`App.js` はその両方をインポートしています。この例の `<Profile />` を `<Gallery />` と書きかえたり、元に戻したりしてみてください：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

これで、デフォルトと名前付きのエクスポートが混在するようになりました：

* `Gallery.js` は：
  - `Profile` コンポーネントを **`Profile` という名前付きでエクスポートしている**.
  - `Gallery` コンポーネントを**デフォルトエクスポート**している。
* `App.js` は：
  - `Profile` コンポーネントを `Gallery.js` から **`Profile` という名前付きでインポートしている**。
  - `Gallery` コンポーネントを `Gallery.js` から**デフォルトインポート**している。
  - ルートの `App` コンポーネントを**デフォルトエクスポート**している。

<Recap>

このページでは以下のことを学びました：

* ルートコンポーネントファイルとは何か
* コンポーネントのインポート・エクスポートの方法
* デフォルトインポート/エクスポートと名前付きインポート/エクスポートの使い分け
* 1 つのファイルから複数のコンポーネントをインポート・エクスポートする方法

</Recap>



<Challenges>

### コンポーネントファイルをさらに分割する {/*split-the-components-further*/}

現在のところ `Gallery.js` は `Profile` と `Gallery` の両方をエクスポートしていますが、これはちょっと混乱の原因になりそうです。

`Profile` コンポーネントを `Profile.js` という別ファイルに移動し、その後で `App` コンポーネントも変更して `<Profile />` と `<Gallery />` を並べてレンダーするようにしてください。

`Profile` をエクスポートするのにデフォルトと名前付きのどちらの手法を使っても構いませんが、`App.js` と `Gallery.js` の両方で対応するインポート構文を使うようにしましょう！ 上記の詳細セクションで挙げたこちらの表を参照しても構いません：

| 構文             | Export 文                                   | Import 文                                        |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

コンポーネントを使っている場所ではインポートするのを忘れないようにしましょう。`Gallery` も `Profile` を使っていますよね。

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

片方のエクスポート構文でうまく動かせたら、もう片方の構文でも動くようにしてみましょう。

<Solution>

名前付きエクスポートを使った解法：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

デフォルトエクスポートを使った解法：

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>