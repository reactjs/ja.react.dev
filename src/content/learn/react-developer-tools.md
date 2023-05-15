---
title: React Developer Tools
---

<Intro>

React Developer Tools を使うことで、React の[コンポーネント](/learn/your-first-component)を調査し、[props](/learn/passing-props-to-a-component) や [state](/learn/state-a-components-memory) を編集し、パフォーマンスの問題を特定できます。

</Intro>

<YouWillLearn>

* React Developer Tools をインストールする方法

</YouWillLearn>

## ブラウザ拡張機能 {/*browser-extension*/}

React を使ったウェブサイトをデバッグする最も簡単な方法は、React Developer Tools というブラウザ拡張機能をインストールすることです。これは複数の人気のブラウザで利用可能です：

* [**Chrome** 用にインストール](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox** 用にインストール](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge** 用にインストール](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

これで、**React で構築されたウェブサイト**を訪れると、_Components_ と _Profiler_ パネルが表示されるようになります。

![React Developer Tools エクステンション](/images/docs/react-devtools-extension.png)

### Safari および他のブラウザ {/*safari-and-other-browsers*/}
他のブラウザ（例えば Safari）の場合、[`react-devtools`](https://www.npmjs.com/package/react-devtools) の npm パッケージをインストールします：
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

次に、ターミナルから開発者ツールを開きます：
```bash
react-devtools
```

そして、ウェブサイトの `<head>` の先頭に以下の `<script>` タグを追加して、ウェブサイトを接続します：
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

ここでブラウザでウェブサイトをリロードし、開発者ツールで表示できるようにしてください。

![スタンドアロン版 React Developer Tools](/images/docs/react-devtools-standalone.png)

## モバイル (React Native) {/*mobile-react-native*/}
React Developer Tools は [React Native](https://reactnative.dev/) を使って構築されたアプリの調査にも利用できます。

React Developer Tools を最も簡単に使う方法は、グローバルにインストールすることです。
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

次に、ターミナルから開発者ツールを開きます。
```bash
react-devtools
```

これで、実行中のローカルな React Native アプリに接続されるはずです。

> 数秒待っても開発者ツールが接続されない場合は、アプリをリロードしてみてください。

[React Native のデバッグについてもっと学ぶ](https://reactnative.dev/docs/debugging)
