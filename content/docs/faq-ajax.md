---
id: faq-ajax
title: AJAXとAPI
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### AJAXコールするには？

任意のAJAXライブラリをReactと共に利用可能です。人気のあるものとしては、[Axios](https://github.com/axios/axios)、[jQuery AJAX](https://api.jquery.com/jQuery.ajax/)、ブラウザ組み込みの [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)などがあります。

### コンポーネントのどのライフサイクルでAJAXコールすべきか？

AJAXコールによるデータ取得は[`componentDidMount`](/docs/react-component.html#mounting)で行うと良いでしょう。データ取得後に `setState` でコンポーネントを更新できるようにするためです。

### 例：AJAXの通信結果をローカルstateで利用する

下記のコンポーネントは、 `componentDidMount` でAJAXコールして得られたデータをローカルコンポーネントのstateに流し込んでいます。 

サンプルAPIが返すJSONオブジェクトはこのようになります：

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // 補足：コンポーネント内のバグによる例外を隠蔽しないためにも
        // catch()ブロックの代わりにここでエラーハンドリングすることが重要です
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
