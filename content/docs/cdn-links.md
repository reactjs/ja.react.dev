---
id: cdn-links
title: CDN リンク
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

React および ReactDOM は CDN を介して利用することができます。

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

上記のバージョンは開発のためだけのものであり、本番環境には適していません。圧縮・最適化された本番バージョンの React は下記のリンクから利用できます。

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

特定のバージョンの `react` と `react-dom` をロードする場合は、`18` の部分をバージョン番号で置き換えてください。

### なぜ `crossorigin` 属性が必要なのか？ {#why-the-crossorigin-attribute}

CDN を使って React の機能を提供する場合、[`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) 属性を設定することをお勧めします。

```html
<script crossorigin src="..."></script>
```

利用している CDN が `Access-Control-Allow-Origin: *` という HTTP ヘッダを設定していることを確認することもお勧めします。

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

これにより React 16 以降でより優れた[エラーハンドリング](/blog/2017/07/26/error-handling-in-react-16.html)を利用できます。
