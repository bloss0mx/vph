/**
 * 柯里化函数
 * @param fn 需要柯里化的函数
 ************/
function curry(fn) {

  function act(..._args) {
    if (fn.length === _args.length) {
      return fn(..._args);
    } else {
      const arg = _args;
      return function () {
        return act(...arg, ..._args);
      }
    }
  }
  return act();
}
/**
 * 代码组合
 * @argument 右侧函数的值作为左侧函数的参数
 ***********/
const compose = function (..._args): Function {//后者的结果为前者的参数
  const args = [..._args].reverse();
  return function (param) {
    let lastParam = param;
    for (let i = 0; i < args.length; i++) {
      lastParam = args[i](lastParam);
    }
    return lastParam;
  }
}
//基础函数
const checkSingleTag = (tag) => tag && tag.match('area|base|col|command|embed|keygen|param|source|track|wbr|br|hr|img|input|link|meta|video') !== null;
const getTagFromHead = (tag) => {
  const match = tag.match(/^<[^ <\/]* |^<[^ <\/]*>/)
  return match && match[0].replace(/<|>| /g, '');
}
const getTagFromTail = (tag) => {
  const match = tag.match(/^<\/[^<]*>/)
  return match && match[0].replace(/^<\/|>/g, '');
}
const matchTags = (origin) => origin.match(/^<[\/!-]{0,1}[^<]*[^-]>/g);
const splitText = (origin) => origin.split(/^<[\/!-]{0,1}[^<]*[^-]>/g).map(item => item.replace(/\n|\t/g, ''));
const equel = curry((a, b) => a === b);
// const attr = (tag) => tag.replace(/<[^\s<>]*|>/g, '').replace(/^ | $/g, '').split(' ').map(item => ({ attr: item.split('=')[0], value: item.split('=')[1] }));


//复合函数
const singleTags = compose(checkSingleTag, getTagFromHead);
const duoTag_Count0 = (current, tag) => (compose(equel(current), getTagFromHead))(tag);
const closeTag = (current, tag) => (compose(equel(current), getTagFromTail))(tag);

// const checkBaseTag = name => tags.find(i => i === name);
const SINGLE_TAGS = 'br,hr,img,input,param,meta,link'.split(',');

const testTag = origin => !!origin.match(/^<[^>]+>$/);
const testSingleTag = origin => {
	const tag = origin.match(/^<[^\s>]+/)[0].replace(/</, '');
	const forceSingle = origin.match(/^<[^>]\/>$/);
	return !!SINGLE_TAGS.find(i => i === tag) || forceSingle;
}
const testSingle = origin => testTag(origin) && testSingleTag(origin);
const singleComponent = origin => !!origin.match(/^<[A-Z][^>]+\/>$/);

export {
  checkSingleTag,
  getTagFromHead,
  getTagFromTail,
  matchTags,
  splitText,
  equel,
  singleTags,
  duoTag_Count0,
  closeTag,
  // checkBaseTag,
  SINGLE_TAGS,
  testTag,
  testSingleTag,
  testSingle,
  singleComponent,
}