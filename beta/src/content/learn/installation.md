---
title: インストール
---

<Intro>

React は開発当初から、段階的に導入できることを目的として設計されています。必要に応じて、少しだけ React を使うというのでも、たくさん React を使うというのでも構いません。あなたが React を少し味見してみたいだけの場合でも、HTML ページにちょっとインタラクティブ性を加えたい場合でも、あるいは React を使った複雑なアプリケーションを開始したいという場合でも、このセクションであなたのスタートアップのお手伝いをします。

</Intro>

<YouWillLearn isChapter={true}>

* [HTML ページに React を追加する方法](/learn/add-react-to-a-website)
* [スタンドアロンの React プロジェクトを始める方法](/learn/start-a-new-react-project)
* [エディタのセットアップ](/learn/editor-setup)
* [React Developer Tools をインストールする方法](/learn/react-developer-tools)

</YouWillLearn>

## React を試してみる {/*try-react*/}

React を試してみるだけなら何もインストールする必要はありません。このサンドボックスを編集してみましょう！

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

サンドボックスを直接編集しても構いませんし、右上隅の「Fork」ボタンを押すことで新しいタブで開くこともできます。

React ドキュメントのほとんどのページにはこのようなサンドボックスが含まれています。React ドキュメント以外にも、[CodeSandbox](https://codesandbox.io/s/new)、[StackBlitz](https://stackblitz.com/fork/react)、[CodePen](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb) など、React をサポートするオンラインサンドボックスがたくさんあります。

### ローカルで React を試す {/*try-react-locally*/}

React を自分のコンピューター上で試すには、[この HTML ページをダウンロードしてください](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)。エディターとブラウザで開いてみましょう！

## ページに React を追加する {/*add-react-to-a-page*/}

既存のサイトがあって少し React を追加する必要がある、という場合は、[script タグで React を追加することができます](/learn/add-react-to-a-website)。

## React プロジェクトを作成する {/*start-a-react-project*/}

もし React を使って[スタンドアロンのプロジェクトを始めたい](/learn/start-a-new-react-project)という場合は、開発者が快適に作業できるための最低限のツールチェーンをセットアップすることができます。または、デフォルトでいろいろと設定されたフレームワークを使って始めることも可能です。

## 次のステップ {/*next-steps*/}

日々遭遇するような React の重要な概念について、[クイックスタート](/learn)ガイドで学びましょう。