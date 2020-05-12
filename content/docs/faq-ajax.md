---
id: faq-ajax
title: AJAX と API
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### AJAX コールをする方法は？ {#how-can-i-make-an-ajax-call}

任意の AJAX ライブラリを React と共に利用可能です。人気のあるものとしては、[Axios](https://github.com/axios/axios)、[jQuery AJAX](https://api.jquery.com/jQuery.ajax/)、ブラウザ組み込みの [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) などがあります。

### コンポーネントのどのライフサイクルで AJAX コールすべきか？ {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

AJAX コールによるデータ取得は [`componentDidMount`](/docs/react-component.html#mounting) のライフサイクルメソッドで行うべきです。データ取得後に `setState` でコンポーネントを更新できるようにするためです。

### 例：ローカル state に AJAX の通信結果をセットする {#example-using-ajax-results-to-set-local-state}

下記のコンポーネントは、`componentDidMount` で AJAX コールして得られたデータをローカルコンポーネントの state に流し込んでいます。

このサンプル API が返す JSON オブジェクトはこのようになります：

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

Here is the equivalent with [Hooks](https://reactjs.org/docs/hooks-intro.html): 

```js
function MyComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://api.example.com/items")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.items);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

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
```
