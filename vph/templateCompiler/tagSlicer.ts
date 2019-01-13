const tmp = `<div class="J_TbSearchContent J_TbPlaceholder J_Placeholder search-combobox-placeholcer" id="tbSearchContent">
	<label for="q" data-searchtype-item="<span>mac联名</span>mac联名">
		<span>mac联名</span>
		mac联名
	</label>
</div>`;

const symbol = /[<>'"` ]|{{[^\s{]+}}/g;
const splitSymbol = origin => origin.split(symbol);
const matchSymbol = origin => origin.match(symbol);
const reconstruct = origin => {
  const symbols = splitSymbol(origin);
  const text = matchSymbol(origin);
  const fragments = [];
  for (var i = 0; i < text.length; i++) {
    fragments.push(text[i]);
    fragments.push(symbols[i + 1]);
  }
  return fragments.map(item => item.replace(/ +/, ' '));
}

// console.log(attrMaker(reconstruct(tmp)));

function attrMaker(splitSymbol) {
  if (splitSymbol.length === 0) {
    return;
  }
  const symbolStack = [];
  let index = 0;
  let container = '';
  const attrs = [];

  do {
    const currentSymbol = splitSymbol[index];
    // if (currentSymbol.match(/^[\s]*$/) && symbolStack.length === 0) {// 空行
    //   // container += ' ';
    // } else
    if (currentSymbol.match(/^['"`<>]$/g)) {//是符号
      if (symbolStack.length === 0 && currentSymbol === '<') {//标签开始 
        symbolStack.push(currentSymbol);
        if (container !== '') attrs.push(container);
        container = currentSymbol;
      } else if (currentSymbol === '>' && symbolStack.length === 1 && symbolStack[0] === '<') {//标签结束
        container += currentSymbol;
        attrs.push(container);
        container = '';
        symbolStack.pop();
      } else if (symbolStack[symbolStack.length - 1] === '<' && currentSymbol === '>') {
        container += currentSymbol;
        symbolStack.pop();
      } else if (currentSymbol !== symbolStack[symbolStack.length - 1]) {//新嵌套
        container += currentSymbol;
        symbolStack.push(currentSymbol);
      } else if (currentSymbol === symbolStack[symbolStack.length - 1]) {//完成匹配
        container += currentSymbol;
        symbolStack.pop();
      }
    } else {//是文字
      if (symbolStack.length === 0 && currentSymbol.match(/^{{[^\s{]+}}$/)) {
        attrs.push(container);
        attrs.push(currentSymbol);
        container = '';
      } else {
        container += currentSymbol.replace(/^[\s]*$/, ' ');
      }
    }
    index++;
  } while (splitSymbol.length > index);
  if (symbolStack.length > 0) {
    console.error(`symbolStack length is ${symbolStack.length}`, symbolStack);
  }
  return attrs.filter(item => !item.match(/^[\s]*$/));
}

export default function (origin) {
  return attrMaker(reconstruct(origin));
}