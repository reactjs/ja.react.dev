---
title: インストール
---

<Intro>

React は当初より、段階的に導入できるように設計されています。あなたの必要に応じて、React を使う量はどれだけ少なくても、どれだけ多くても構いません。React を少し味見してみたい場合でも、HTML ページにちょっとしたインタラクティブ性を追加したい場合でも、あるいは複雑な React アプリを立ち上げたいという場合でも、このセクションがあなたのスタートをお手伝いします。

</Intro>

<<<<<<< HEAD
<YouWillLearn isChapter={true}>

* [新しい React プロジェクトを始める方法](/learn/start-a-new-react-project)
* [既存プロジェクトに React を追加する方法](/learn/add-react-to-an-existing-project)
* [エディタの設定方法](/learn/editor-setup)
* [React Developer Tools のインストール方法](/learn/react-developer-tools)

</YouWillLearn>

## React を試してみる {/*try-react*/}
=======
## Try React {/*try-react*/}
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

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

<<<<<<< HEAD
### ローカルで React を試す {/*try-react-locally*/}

あなたのコンピュータのローカル環境で React を試すには、[この HTML ページをダウンロードしてください](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html)。そしてエディタとブラウザで開いてください！

## 新しい React プロジェクトを開始する {/*start-a-new-react-project*/}

アプリやウェブサイトを React でフルに構築したい場合は、[新しい React プロジェクトを始めましょう](/learn/start-a-new-react-project)。
=======
To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!

## Creating a React App {/*creating-a-react-app*/}

If you want to start a new React app, you can [create a React app](/learn/creating-a-react-app) using a recommended framework.

## Build a React App from Scratch {/*build-a-react-app-from-scratch*/}

If a framework is not a good fit for your project, you prefer to build your own framework, or you just want to learn the basics of a React app you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

## 既存のプロジェクトに React を追加する {/*add-react-to-an-existing-project*/}

<<<<<<< HEAD
既存のアプリやウェブサイトで React を試してみたい場合は、[既存のプロジェクトに React を追加してください](/learn/add-react-to-an-existing-project)。
=======
If want to try using React in your existing app or a website, you can [add React to an existing project.](/learn/add-react-to-an-existing-project)


<Note>

#### Should I use Create React App? {/*should-i-use-create-react-app*/}

No. Create React App has been deprecated. For more information, see [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669

## 次のステップ {/*next-steps*/}

日々遭遇する最も重要な React の概念を紹介する、[クイックスタート](/learn)ガイドへと進んでください。

