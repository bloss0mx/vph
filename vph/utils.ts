/**
 * 柯里化
 * @param fn 
 */
function curry(fn) {
  function act(...args) {
    if (fn.length === args.length) {
      return fn(...args);
    } else {
      const arg = args;
      return function () {
        return act(...arg, ...args);
      };
    }
  }
  return act();
}
/**
 * 函数组合
 */
function compose(..._args) { //后者的结果为前者的参数
  const args = [..._args].reverse();
  return function (param) {
    let lastParam = param;
    for (let i = 0; i < args.length; i++) {
      lastParam = args[i](lastParam);
    }
    return lastParam;
  };
}
/**
 * 匹配单标签
 * @param tag 
 */
const checkSingleTag = (tag) => tag && tag.match('area|base|col|command|embed|keygen|param|source|track|wbr|br|hr|img|input|link|meta|video|^[A-Z]') !== null;
/**
 * 获取头标签名
 * @param tag 
 */
const getTagFromHead = (tag) => {
  const match = tag.match(/<[^ </]* |<[^ </]*>/);
  return match && match[0].replace(/<|>| /g, '');
};
/**
 * 获取尾标签名
 * @param tag 
 */
const getTagFromTail = (tag) => {
  const match = tag.match(/<\/[^<]*>/);
  return match && match[0].replace(/<\/|>/g, '');
};
/**
 * 匹配组件名
 * @param origin 
 */
const matchComponent = (origin) => origin.match(/^[A-Z]/);
/**
 * 匹配tag
 * @param origin 
 */
const matchTags = (origin) => origin.match(/<[/!-]{0,1}[^<]*[^-]>/g);
/**
 * 切片文本
 * @param origin 
 */
const splitText = (origin) => origin.split(/<[/!-]{0,1}[^<]*[^-]>/g).map(item => item.replace(/\n|\t/g, ''));
/**
 * 全等
 */
const equel = curry((a, b) => a === b);
/**
 * 获取attr
 * @param tag 
 */
const attr = (tag) => tag.replace(/<[^\s<>]*|>/g, '').replace(/^ | $/g, '').length > 0 && tag.replace(/<[^\s<>]*|>/g, '').replace(/^ | $/g, '').split(' ').map(item => ({
  attr: item.split('=')[0],
  value: item.split('=')[1] && item.split('=')[1].replace(/'|"/g, ''),
})) || [];
/**
 * 向后插入
 * @param father 
 * @param target 
 * @param newDom 
 */
const insertAfter = (father, target, newDom) => {
  if (father.lastChild === target) father.appendChild(newDom);
  else father.insertBefore(newDom, target.nextSibling);
};

//复合函数
/**
 * 获取单标签
 */
const singleTags = compose(checkSingleTag, getTagFromHead);
/**
 * 头tag
 * @param current 
 * @param tag 
 */
const duoTag_Count0 = (current, tag) => (compose(equel(current), getTagFromHead))(tag);
/**
 * 关闭tag
 * @param current 
 * @param tag 
 */
const closeTag = (current, tag) => (compose(equel(current), getTagFromTail))(tag);

/**
 * 类型检查 __proto__ 对比
 * @param {*Any} value 需要检查的值
 * @return {*String} 
 */
const testType = (value) => {
  if (value === undefined) {
    return 'undefined';
  }
  if (value !== value) {
    return 'NaN';
  }
  const proto = value.__proto__;
  switch (proto) {
    case (0).__proto__:
      return 'number';
    case ('').__proto__:
      return 'string';
    case (true).__proto__:
      return 'bool';
    case ([]).__proto__:
      return 'array';
    case ({}).__proto__:
      return 'object';
    case (() => { }).__proto__:
      return 'function';
  }
};

/**
 * 代替console.log
 */
function log() {
  console.log(...arguments);
}

export {
  curry,
  compose,
  checkSingleTag,
  getTagFromHead,
  getTagFromTail,
  matchComponent,
  matchTags,
  splitText,
  equel,
  attr,
  insertAfter,
  log,
  singleTags,
  duoTag_Count0,
  closeTag,
  testType,
};