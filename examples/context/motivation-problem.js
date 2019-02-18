class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Toolbar コンポーネントは外部から "theme" プロパティを受け取り、
  // プロパティを ThemedButton へ渡します。
  // アプリ内の各ボタンがテーマを知る必要がある場合、
  // プロパティは全てのコンポーネントを通して渡される為、面倒になります。
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
