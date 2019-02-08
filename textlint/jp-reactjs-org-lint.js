/**
 * @param {RuleContext} context
 */
module.exports = context => {
  return {
    [context.Syntax.Str]: node => {
      const text = context.getSource(node);
      const match = /下さい/.exec(text);
      if (match) {
        context.report(
          node,
          new context.RuleError(
            `「下さい」の代わりに「ください」を使ってください。`,
          ),
        );
      }
    },
  };
};
