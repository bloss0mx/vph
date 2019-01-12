const getAttrs = origin => origin.replace(/^<[^\s]+|>$/g, '').replace(/^ | $/g, '');
const SYMBOL = /,|'|"|`| /g;
const matchSymbol = origin => origin.match(SYMBOL);
const splitSymbol = origin => origin.split(SYMBOL);

/**
 * 分割模板
 * @param tag 模板
 */
function splitSymbolNText(tag) {
  const symbols = matchSymbol(tag);
  const text = splitSymbol(tag);
  const fragments = []
  for (var i = 0; i < text.length - 1; i++) {
    !text[i].match(/^\s{0,}$/) && fragments.push(text[i]);
    fragments.push(symbols[i]);
  }
  return fragments.map(item => item.replace(/ +/, ' '));
}

function attrMaker(splitSymbol) {
  if (splitSymbol.length === 0) {
    return;
  }
  const symbolStack = [];
  let index = 0;
  let currentContainer = '';
  const attrs = [];

  do {
    const currentSymbol = splitSymbol[index]
    if (currentSymbol === ' ' && symbolStack.length === 0) {
    } else if (currentSymbol.match(/^['"`]$/g)) {//是符号
      if (currentSymbol !== symbolStack[symbolStack.length - 1]) {//新嵌套
        symbolStack.push(currentSymbol);
        currentContainer += currentSymbol;
      } else {//旧嵌套
        if (symbolStack.length === 1) {//和最后一个符号配对
          symbolStack.pop();
          currentContainer += currentSymbol;
          attrs.push(currentContainer);
          currentContainer = '';
        } else {//
          symbolStack.pop();
          currentContainer += currentSymbol;
        }
      }
    } else {//是文字
      currentContainer += currentSymbol;
    }
    index++;
  } while (splitSymbol.length > index);
  if (symbolStack.length > 0) {
    console.error(`symbolStack length is ${symbolStack.length}`, splitSymbol);
  }
  return attrs;
}

function attr(tag) {
  return attrMaker(splitSymbolNText(getAttrs(tag)));
}
// exports.attrM = attr;
export default attr;