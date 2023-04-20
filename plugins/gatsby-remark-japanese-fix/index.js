const toString = require('mdast-util-to-string');
const visit = require('unist-util-visit');

const hasJapaneseCharacter = (str) => {
  // Detects katakana, hiragana, iteration marks, and CJK unified ideographs
  return /[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u4e00-\u9fea。、]/.test(str);
};

/**
 * Iterates over emphases (<em>'s) within the AST created by remark.
 * Applies 'em-ja' class only when it contains a Japanese character,
 * so that it can be displayed with a different style.
 */

module.exports = ({markdownAST}, options) => {
  visit(markdownAST, 'emphasis', (node) => {
    const nodeStr = toString(node);
    if (hasJapaneseCharacter(nodeStr)) {
      // Patch AST
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.class = 'em-ja';
    }
  });
  return markdownAST;
};
