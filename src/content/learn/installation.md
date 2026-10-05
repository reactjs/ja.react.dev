---
title: インストール
---

<Intro>

React は当初より、段階的に導入できるように設計されています。あなたの必要に応じて、React を使う量はどれだけ少なくても、どれだけ多くても構いません。React を少し味見してみたい場合でも、HTML ページにちょっとしたインタラクティブ性を追加したい場合でも、あるいは複雑な React アプリを立ち上げたいという場合でも、このセクションがあなたのスタートをお手伝いします。

</Intro>

## React を試してみる {/*try-react*/}

React を試すために何かをインストールする必要はありません。このサンドボックスを編集してみてください！

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

直接編集しても構いませんし、右上の "Fork" ボタンを押して新しいタブで開くこともできます。

React ドキュメントのほとんどのページには、このようなサンドボックスが含まれています。React のドキュメント外にも、React をサポートするオンラインサンドボックスがたくさんあります。例えば、[CodeSandbox](https://codesandbox.io/s/new)、[StackBlitz](https://stackblitz.com/fork/react) や [CodePen](https://codepen.io/pen?template=QWYVwWN) が挙げられます。

あなたのコンピュータのローカル環境で React を試すには、[この HTML ページをダウンロードしてください](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html)。そしてエディタとブラウザで開いてください！

## React アプリの新規作成 {/*creating-a-react-app*/}

新しい React アプリを立ち上げたい場合は、推奨されるフレームワークを用いて[新しい React アプリを作成](/learn/creating-a-react-app)します。

## ゼロからの React アプリ構築 {/*build-a-react-app-from-scratch*/}

あなたのプロジェクトにフレームワークが適さない場合、自分自身でフレームワークを構築したい場合、あるいは React を基本から学びたい場合は、[ゼロから React アプリを構築する](/learn/build-a-react-app-from-scratch)ことも可能です。

## 既存のプロジェクトに React を追加する {/*add-react-to-an-existing-project*/}

既存のアプリやウェブサイトで React を試してみたい場合は、[既存のプロジェクトに React を追加](/learn/add-react-to-an-existing-project)することもできます。


<Note>

#### Create React App を使うべき？ {/*should-i-use-create-react-app*/}

いいえ、Create React App は非推奨となっています。詳細は [Create React App のサポート終了](/blog/2025/02/14/sunsetting-create-react-app)を参照してください。

</Note>

## 次のステップ {/*next-steps*/}

日々遭遇する最も重要な React の概念を紹介する、[クイックスタート](/learn)ガイドへと進んでください。

