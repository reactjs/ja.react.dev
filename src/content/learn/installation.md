---
title: インストール
---

<Intro>

React は当初より、段階的に導入できるように設計されています。あなたの必要に応じて、React を使う量はどれだけ少なくても多くても構いません。React を少し味見してみたい場合でも、HTML ページにちょっとしたインタラクティブ性を追加したい場合でも、そして複雑な React アプリをスタートしたい場合でも、このセクションがあなたのスタートをお手伝いします。

</Intro>

<YouWillLearn isChapter={true}>

* [新しい React プロジェクトを始める方法](/learn/start-a-new-react-project)
* [既存プロジェクトに React を追加する方法](/learn/add-react-to-an-existing-project)
* [エディタの設定方法](/learn/editor-setup)
* [React Developer Tools のインストール方法](/learn/react-developer-tools)

</YouWillLearn>

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

React のドキュメントのほとんどのページには、このようなサンドボックスが含まれています。React のドキュメント外にも、React をサポートするオンラインサンドボックスがたくさんあります。例えば、[CodeSandbox](https://codesandbox.io/s/new)、[StackBlitz](https://stackblitz.com/fork/react) や [CodePen](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb) が挙げられます。

### ローカルで React を試す {/*try-react-locally*/}

パソコンでローカルで React を試すために、[この HTML ページをダウンロードしてください](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html)。そしてエディタとブラウザで開いてください！

## 新しい React プロジェクトを開始する {/*start-a-new-react-project*/}

アプリやウェブサイトを React でフルに構築したい場合は、[新しい React プロジェクトを始めましょう](/learn/start-a-new-react-project)。

## 既存のプロジェクトに React を追加する {/*add-react-to-an-existing-project*/}

既存のアプリやウェブサイトで React を試してみたい場合は、[既存のプロジェクトに React を追加してください](/learn/add-react-to-an-existing-project)。

## 次のステップ {/*next-steps*/}

日々遭遇する最も重要な React の概念を紹介する、[クイックスタート](/learn)ガイドへと進んでください。

