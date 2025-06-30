---
title: サーバコンポーネント
---

<RSC>

<<<<<<< HEAD
サーバコンポーネントは [React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) 用の機能です。
=======
Server Components are for use in [React Server Components](/learn/start-a-new-react-project#full-stack-frameworks).
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619

</RSC>

<Intro>

サーバコンポーネントは新しいタイプのコンポーネントです。クライアントアプリケーションや SSR サーバとは別の環境で、バンドル前に事前にレンダーされます。

</Intro>

React Server Components の "server" とはこの別の環境を指しています。サーバコンポーネントは、CI サーバでビルド時に一度だけ実行することも、ウェブサーバを使用してリクエストごとに実行することもできます。

<InlineToc />

<Note>

#### サーバコンポーネントのサポートを追加する方法 {/*how-do-i-build-support-for-server-components*/}

<<<<<<< HEAD
React 19 の React Server Components は安定しており、マイナーバージョン間での破壊的変更はありませんが、サーバコンポーネントのバンドラやフレームワークを実装するために使用される基盤となる API は semver に従いません。React 19.x のマイナーバージョン間で変更が生じる可能性があります。
=======
While React Server Components in React 19 are stable and will not break between minor versions, the underlying APIs used to implement a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x.
>>>>>>> c0c955ed1d1c4fe3bf3e18c06a8d121902a01619

React Server Components をバンドラやフレームワークでサポートする場合は、特定の React バージョンに固定するか、Canary リリースを使用することをお勧めします。React Server Components を実装するために使用される API を安定化させるため、今後もバンドラやフレームワークと連携を続けていきます。

</Note>

### サーバを使用しないサーバコンポーネント {/*server-components-without-a-server*/}
サーバコンポーネントはビルド時に実行でき、ファイルシステムから読み取ったり静的なコンテンツをフェッチしたりすることが可能です。したがってウェブサーバは必須ではありません。たとえばコンテンツ管理システムから静的データを読み取ることもできるでしょう。

サーバコンポーネントがない場合、静的データは一般的に、クライアントでエフェクトを使って以下のようにフェッチします。
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: loads *after* first page render.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

このパターンを使用すると、ページの表示期間中に変化しない静的なコンテンツをただレンダーするためだけに、ユーザは 75K（gzip 後）のライブラリを追加でダウンロードしてパースし、さらにページのロード後に別のリクエストがデータをフェッチしてくるのを待つ必要があることになります。

サーバコンポーネントを使用することで、これらのコンポーネントをビルド時に一度だけレンダーすることができます。

```js
import marked from 'marked'; // Not included in bundle
import sanitizeHtml from 'sanitize-html'; // Not included in bundle

async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);

  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

このレンダー出力は、サーバサイドレンダリング (SSR) で HTML に変換され、CDN にアップロードできます。アプリがロードされる際、クライアントには元の `Page` コンポーネントの存在や、Markdown をレンダーするための高コストなライブラリの存在は見えません。レンダーされた出力が見えるだけです。

```js
<div><!-- html for markdown --></div>
```

つまり、コンテンツは最初のページロード時にすぐ表示され、静的コンテンツをレンダーするためだけの高コストなライブラリをバンドルに含めなくともよくなるのです。

<Note>

上記のサーバコンポーネントが非同期関数であることに気付かれたかもしれません。

```js
async function Page({page}) {
  //...
}
```

非同期コンポーネントは、レンダー中に `await` できるというサーバコンポーネントの新機能です。

以下の[サーバコンポーネントでの非同期コンポーネント処理](#async-components-with-server-components)を参照してください。

</Note>

### サーバを使用するサーバコンポーネント {/*server-components-with-a-server*/}
サーバコンポーネントは、ページのリクエスト時にウェブサーバ内で実行することも可能であり、これにより API を構築することなくデータレイヤにアクセスできます。アプリケーションがバンドルされる前にレンダーされ、データと JSX をクライアントコンポーネントに props として渡すことができます。

サーバコンポーネントがない場合、一般的には以下のようにして、動的データをクライアントでエフェクトを使ってフェッチします。

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: loads *after* first render.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);

  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: loads *after* Note renders.
  // Causing an expensive client-server waterfall.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from './database';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

サーバコンポーネントを使用することで、コンポーネントの中で直接データを読み取ってレンダーできます。

```js
import db from './database';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

この後バンドラは、データ、レンダー済みのサーバコンポーネント、および動的なクライアントコンポーネントをバンドルとして結合します。オプションとして、そのバンドルをサーバサイドレンダリング (SSR) して、ページの初期 HTML を作成できます。ページがロードされると、ブラウザには元の `Note` および `Author` コンポーネントの存在は見えません。クライアントにはレンダーされた出力のみが送信されます。

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

サーバコンポーネントをサーバから再フェッチして、サーバではデータにアクセスして再レンダーする、という形で、サーバコンポーネントを動的に扱うことができます。この新しいアプリケーションアーキテクチャは、サーバセントリックなマルチページアプリにおける単純な「リクエスト/レスポンス」式のメンタルモデルと、クライアントセントリックなシングルページアプリケーションにおけるシームレスな操作性を組み合わせ、両方の利点を提供できるものです。

### サーバコンポーネントにインタラクティビティを追加する {/*adding-interactivity-to-server-components*/}

サーバコンポーネントはブラウザに送信されないため、`useState` のようなインタラクティブな API を使用できません。サーバコンポーネントにインタラクティビティを追加するには、`"use client"` ディレクティブを使用してクライアントコンポーネントと組み合わせます。

<Note>

#### サーバコンポーネントのためのディレクティブはない {/*there-is-no-directive-for-server-components*/}

よくある誤解として、サーバコンポーネントを "use server" を用いて定義するものだと考えるというものがあります。サーバコンポーネントにはディレクティブがありません。"use server" ディレクティブは、サーバ関数のためのものです。

詳細については、[ディレクティブ](/reference/rsc/directives) のドキュメントをご覧ください。

</Note>


以下の例では、サーバコンポーネントである `Notes` がクライアントコンポーネントである `Expandable` をインポートしており、そこで state を使用して `expanded` をトグルしています。
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
      {expanded && children}
    </div>
  )
}
```

動作としては、最初に `Notes` がサーバコンポーネントとしてレンダーされ、次にバンドラに `Expandable` というクライアントコンポーネントのバンドルを作成するよう指示しています。ブラウザ側では、クライアントコンポーネントには props 経由で渡されるサーバコンポーネントの出力だけが見えることになります。

```js
<head>
  <!-- the bundle for Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div>
</body>
```

### サーバコンポーネントでの非同期コンポーネント処理 {/*async-components-with-server-components*/}

サーバコンポーネントにより、async/await を使用してコンポーネントを書くという新しい手法が導入されます。非同期コンポーネント内で `await` すると、React はサスペンド (suspend) し、プロミスが解決 (resolve) されるのを待ってからレンダーを再開します。サスペンスのストリーミングサポートのおかげで、これはサーバ／クライアントの境界をまたいで機能します。

サーバでプロミスを作成し、それをクライアント側で待機することすら可能です。

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);

  // NOTE: not awaited, will start here and await on the client.
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(commment => <p>{comment}</p>);
}
```

`note` の内容はページをレンダーするために重要なデータなので、サーバ側で `await` します。コメントは折りたたまれており優先度が低いため、サーバではプロミスを開始だけして、クライアントで `use` API を使用してそれを待機します。これによりクライアント側でサスペンドが起きますが、`note` の内容のレンダーをブロックしないで済みます。

非同期コンポーネントはクライアントではサポートされていないため、プロミスの待機は `use` を使用して行います。
