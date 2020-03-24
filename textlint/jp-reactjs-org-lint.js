const toString = require('mdast-util-to-string');

module.exports = context => {
  return {
    // [context.Syntax.Header]: node => {},

    [context.Syntax.Paragraph]: node => {
      // Checks against paragraph-based rules.

      // Convert a paragraph to plain text, stripping any markups
      const text = toString(node);

      enforceSpaceAfterQuestionOrExclamation(node, text, context);
      noHanPunctSpace(node, text, context);
      enforceZenHanSpace(node, text, context);
      noLineEndSpace(node, text, context);
      noConflictMarker(node, text, context);
    },

    [context.Syntax.Str]: node => {
      const text = toString(node);
      const index = text.indexOf('　');
      if (index >= 0) {
        context.report(
          node,
          new context.RuleError(
            'いかなる場合も全角スペースは使用しないでください。',
            {index},
          ),
        );
      }
    },
  };
};

const enforceSpaceAfterQuestionOrExclamation = (node, text, context) => {
  const markReg = /[！？](\u3000|[A-Za-z0-9]|[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])/;
  if (markReg.exec(text)) {
    context.report(
      node,
      new context.RuleError(
        '全角の「！」「？」と次の文の間には半角スペースを挿入してください。',
      ),
    );
  }
};

const noHanPunctSpace = (node, text, context) => {
  const match = /(.{0,3})[、。]( |\u3000)/.exec(text);
  if (match) {
    context.report(
      node,
      new context.RuleError(
        `全角の句読点の直後にスペースを入れてはいけません("${match[0]}")。`,
      ),
    );
  }
};

const enforceZenHanSpace = (node, text, context) => {
  const hanZen = /[A-Za-z0-9](?:[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])/;
  const zenHan = /(?:[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ])[A-Za-z0-9]/;

  const hanZenMatch = hanZen.exec(text);
  const zenHanMatch = zenHan.exec(text);

  if (hanZenMatch || zenHanMatch) {
    const matched = hanZenMatch ? hanZenMatch[0] : zenHanMatch[0];
    context.report(
      node,
      new context.RuleError(
        `全角文字と半角英数字とが隣接しています("${matched}")。` +
          `半角スペースを挿入してください。`,
      ),
    );
  }
};

const noLineEndSpace = (node, text, context) => {
  // This detects a line-end space *only when* the line contains Japanese characters.
  const reg = /(?:[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[ぁ-んァ-ヶ]).?(\s|\u3000)$/;

  if (reg.exec(text)) {
    context.report(
      node,
      new context.RuleError('行末にスペース文字を入れないでください。'),
    );
  }
};

const noConflictMarker = (node, text, context) => {
  const reg = /<<<<<<< HEAD/;

  if (reg.exec(text)) {
    context.report(
      node,
      new context.RuleError(
        'コンフリクトマーカーが残っています。コンフリクトを解消してください。',
      ),
    );
  }
};
