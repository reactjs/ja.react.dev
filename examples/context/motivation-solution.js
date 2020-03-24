// highlight-range{1-4}
// コンテクストを使用すると、全てのコンポーネントを明示的に通すことなしに
// コンポーネントツリーの深くまで値を渡すことができます。
// 現在のテーマ（デフォルトは "light"）の為のコンテクストを作成します。
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // 以下のツリーへ現在のテーマを渡すためにプロバイダを使用します。
    // どんな深さでも、どのようなコンポーネントでも読み取ることができます。
    // このサンプルでは、"dark" を現在の値として渡しています。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
<<<<<<< HEAD
// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar() {
=======
// 間のコンポーネントはもう明示的にテーマを
// 下に渡す必要はありません。
function Toolbar(props) {
>>>>>>> ac4b5d74278df9484f640d83c9f136ecccf60fc4
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // 現在のテーマのコンテクストを読むために、contextType に指定します。
  // React は上位の最も近いテーマプロバイダを見つけ、その値を使用します。
  // この例では、現在のテーマは "dark" です。
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
