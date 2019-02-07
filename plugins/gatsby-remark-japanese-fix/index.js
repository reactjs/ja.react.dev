const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');

const hasJapanese = str => {
  // Detects katakana, hiragana, iteration mark (々), and CJK unified ideographs
  return /[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u4e00-\u9fea。、]/.test(str);
};

/**
 * Iterates over emphasises (<em>'s) within the AST created by Markdown docs.
 * Applies 'em-ja' class only when it contains some Japanese character,
 * so that it can be displayed differently.
 */

module.exports = ({markdownAST}, options) => {
  visit(markdownAST, 'emphasis', node => {
    const nodeStr = toString(node);
    if (hasJapanese(nodeStr)) {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.class = 'em-ja';
    }
  });
  return markdownAST;
};
