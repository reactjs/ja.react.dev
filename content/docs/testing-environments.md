---
id: testing-environments
title: テスト環境
permalink: docs/testing-environments.html
prev: testing-recipes.html
---

<!-- This document is intended for folks who are comfortable with JavaScript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

このドキュメントではあなたの環境に影響する要素や、いくつかのシナリオにおける推奨事項について概説します。

### テストランナー {#test-runners}

[Jest](https://jestjs.io/)、[mocha](https://mochajs.org/)、[ava](https://github.com/avajs/ava) のようなテストランナーを使えば、標準的な JavaScript を使ってテストスイートを書き、開発プロセスの一環として実行できるようにできます。加えて、テストスイートは継続的インテグレーションの一部としても実行されます。

- Jest は React プロジェクトとの広範な互換性を有しており、[モジュール](#mocking-modules)や[タイマー](#mocking-timers)のモック、[`jsdom`](#mocking-a-rendering-surface) のサポートを有しています。**Create React App を使っている場合、Jest は有用なデフォルト値とともに[追加設定なしでインストールされます](https://facebook.github.io/create-react-app/docs/running-tests)**。
- [mocha](https://mochajs.org/#running-mocha-in-the-browser) のようなライブラリは実際のブラウザ環境でうまく動作するため、それが必要なテストでは有用でしょう。
- End-to-end テストは複数のページにまたがる長いフローのテストに使用され、[異なったセットアップ](#end-to-end-tests-aka-e2e-tests)が必要です。

### 描画画面のモック {#mocking-a-rendering-surface}

しばしばテストは、ブラウザのような実際の描画用の画面にアクセスできない環境で実行されます。このような環境では、Node.js 内で実行される軽量のブラウザ実装である [`jsdom`](https://github.com/jsdom/jsdom) を使ってブラウザ環境をシミュレートすることをお勧めします。

多くの場合、jsdom は普通のブラウザの挙動と同様に動作しますが、[レイアウトやナビゲーション](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform)のような機能は有していません。それでも、個々のテストでブラウザを立ち上げるよりも高速に動作するので、ほとんどのウェブベースのコンポーネントのテストでは有用です。また、jsdom はあなたのテストと同一のプロセスで動作するため、描画された DOM に対して内容を調べたりアサーションを行うコードを書くことができます。

本物のブラウザと全く同様に、jsdom ではユーザ操作をモデルすることができます。テストは DOM ノードに対してイベントをディスパッチして、そのアクションに対する副作用を観察したり検証したりすることができます[<small>（例）</small>](/docs/testing-recipes.html#events)。

UI テストの大部分は上記のようなセットアップを行って書くことができます。すなわちテストランナーとして Jest を使い、jsdom にレンダーし、ブラウザイベントの羅列としてユーザ操作を定義し、`act()` ヘルパを活用します[<small>（例）</small>](/docs/testing-recipes.html)。例えば、React 自体のテストの多くもこの組み合わせで書かれています。

主にブラウザ特有の動作をテストする必要があるライブラリを書いており、レイアウトや本物のユーザ入力などネイティブなブラウザの挙動が必要な場合は、[mocha](https://mochajs.org/) のようなフレームワークを利用できます。

DOM をシミュレート*できない*環境（例えば Node.js で React Native のコンポーネントをテストする場合など）では、[イベントシミュレーションヘルパ](/docs/test-utils.html#simulate)を使って要素とのインタラクションをシミュレーションできます。あるいは、[`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro) の `fireEvent` ヘルパを利用することもできます。

[Cypress](https://www.cypress.io/)、[puppeteer](https://github.com/GoogleChrome/puppeteer)、[webdriver](https://www.seleniumhq.org/projects/webdriver/) のようなフレームワークは [end-to-end テスト](#end-to-end-tests-aka-e2e-tests)を実行するのに有用です。

### 関数のモック {#mocking-functions}

テストを書く際は、テスト環境に同等物がないコード（例えば `navigator.onLine` の状態を Node.js 内で確認する、など）のモック化をしたくなります。テストではいくつかの関数を監視し、テストの他の部位がその関数とどう作用するのかを観察することもできます。そのような場合に、これらの関数をテストしやすいバージョンで選択的にモック化できれば有用です。

これはデータを取得する場面では特に有用です。本物の API エンドポイントからデータを取得することによって遅くなったり不安定になったりするのを避けるため、通常はフェイクデータを利用することが望まれます[<small>（例）</small>](/docs/testing-recipes.html#data-fetching)。これによりテストが予想可能になります。[Jest](https://jestjs.io/) や [sinon](https://sinonjs.org/) などのライブラリはモック関数をサポートしています。End-to-end テストの場合、ネットワークのモックはより困難ですが、いずれにせよそのようなテストでは本物の API エンドポイントを使ってテストをしたいでしょう。

### モジュールのモック {#mocking-modules}

コンポーネントによってはテスト環境でうまく動作しないか、テストにとって本質的ではないモジュールに依存していることがあります。このようなモジュールを選択的にモック化して適切な代替物で置き換えることは有用です[<small>（例）</small>](/docs/testing-recipes.html#mocking-modules)。

Node.js では、Jest のようなテストランナーは[モジュールのモックをサポートしています](https://jestjs.io/docs/en/manual-mocks)。[`mock-require`](https://www.npmjs.com/package/mock-require) のようなライブラリを使用することもできます。

### タイマーのモック {#mocking-timers}

<<<<<<< HEAD
コンポーネントは `setTimeout`、`setInterval` や `Date.now` のような時間に依存する関数を使っているかもしれません。テスト環境では、これらの関数をモック版で置き換えて、手動で時間を「進められる」ようにすることが有用です。これはテストを高速に実行させるためにも役立ちます！ タイマーに依存しているテストは順番通りに処理されますが、より高速になるのです[<small>（例）</small>](/docs/testing-recipes.html#timers)。[Jest](https://jestjs.io/docs/en/timer-mocks)、[sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) や [lolex](https://github.com/sinonjs/lolex) を含むほとんどのフレームワークにおいて、テストでモックタイマーを利用できます。
=======
Components might be using time-based functions like `setTimeout`, `setInterval`, or `Date.now`. In testing environments, it can be helpful to mock these functions out with replacements that let you manually "advance" time. This is great for making sure your tests run fast! Tests that are dependent on timers would still resolve in order, but quicker [<small>(example)</small>](/docs/testing-recipes.html#timers). Most frameworks, including [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/latest/fake-timers) and [lolex](https://github.com/sinonjs/lolex), let you mock timers in your tests.
>>>>>>> 841d3d1b75491ce153a53d1887ab020458090bbd

時には、タイマーのモックをやりたくない場合があります。例えばアニメーションや、タイミングに依存するエンドポイント（API レートリミッタなど）をテストしているのかもしれません。タイマーのモックが利用できるライブラリでは、テストあるいはスイートごとにモックを有効化・無効化できるようになっているため、どのようにテストを実行するかを明示的に選択できます。

### End-to-end テスト {#end-to-end-tests-aka-e2e-tests}

End-to-end テストは長いワークフロー、特にあなたの業務にとってとても重要なワークフロー（例えば支払いやサインアップ）をテストするのに有用です。これらのテストをする際は、本物のブラウザがアプリケーション全体をいかに描画し、本物の API エンドポイントからいかにデータを取得し、セッションやクッキーをいかに使い、さまざまなリンク間でいかにナビゲーションするかをすべて試験したいでしょう。また、おそらく DOM の状態だけではなく、バックエンドのデータに対する検証（例えばデータベースに更新が正しく永続化されているかの確認）も行いたいかもしれません。

このようなシナリオの場合は、[Cypress](https://www.cypress.io/)、[Playwright](https://playwright.dev) のようなフレームワークや [Puppeteer](https://pptr.dev/) のようなライブラリを使うことで、複数のルート間をナビゲートし、ブラウザのみならず、必要に応じてバックエンド側の副作用についても検証を行うことができるでしょう。
