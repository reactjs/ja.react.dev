// createContextに渡されるデフォルトの値の形が、
// コンシューマが期待する形と一致することを確認してください！
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
