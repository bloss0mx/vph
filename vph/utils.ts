/**
 * 柯里化
 * @param fn
 */
function curry(fn: Function) {
  function act(...args: any) {
    if (fn.length === args.length) {
      return fn(...args);
    } else {
      const arg = args;
      return function() {
        return act(...arg, ...args);
      };
    }
  }
  return act();
}
/**
 * 函数组合
 */
function compose(..._args: Function[]) {
  //后者的结果为前者的参数
  const args = [..._args].reverse();
  return function(param: any) {
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
const checkSingleTag = (tag: string) =>
  tag &&
  tag.match(
    "area|base|col|command|embed|keygen|param|source|track|wbr|br|hr|img|input|link|meta|video|^[A-Z]"
  ) !== null;
/**
 * 获取头标签名
 * @param tag
 */
const getTagFromHead = (tag: string) => {
  const match = tag.match(/<[^ </]* |<[^ </]*>/);
  return match && match[0].replace(/<|>| /g, "");
};
/**
 * 获取尾标签名
 * @param tag
 */
const getTagFromTail = (tag: string) => {
  const match = tag.match(/<\/[^<]*>/);
  return match && match[0].replace(/<\/|>/g, "");
};
/**
 * 匹配组件名
 * @param origin
 */
const matchComponent = (origin: string) => origin.match(/^[A-Z]/);
/**
 * 匹配tag
 * @param origin
 */
const matchTags = (origin: string) => origin.match(/<[/!-]{0,1}[^<]*[^-]>/g);
/**
 * 切片文本
 * @param origin
 */
const splitText = (origin: string) =>
  origin
    .split(/<[/!-]{0,1}[^<]*[^-]>/g)
    .map(item => item.replace(/\n|\t/g, ""));
/**
 * 全等
 */
const equel = curry((a: any, b: any) => a === b);
/**
 * 获取attr
 * @param tag
 */
const attr = (tag: string) =>
  (tag.replace(/<[^\s<>]*|>/g, "").replace(/^ | $/g, "").length > 0 &&
    tag
      .replace(/<[^\s<>]*|>/g, "")
      .replace(/^ | $/g, "")
      .split(" ")
      .map(item => ({
        attr: item.split("=")[0],
        value: item.split("=")[1] && item.split("=")[1].replace(/'|"/g, ""),
      }))) ||
  [];

//复合函数
/**
 * 获取单标签
 */
const singleTags = compose(
  checkSingleTag,
  getTagFromHead
);
/**
 * 头tag
 * @param current
 * @param tag
 */
const duoTag_Count0 = (current: string, tag: string) =>
  compose(
    equel(current),
    getTagFromHead
  )(tag);
/**
 * 关闭tag
 * @param current
 * @param tag
 */
const closeTag = (current: string, tag: string) =>
  compose(
    equel(current),
    getTagFromTail
  )(tag);

/**
 * 类型检查 __proto__ 对比
 * @param {*Any} value 需要检查的值
 * @return {*String}
 */
const testType = <T>(value: T) => {
  if (value === undefined) {
    return "undefined";
  }
  if (value !== value) {
    return "NaN";
  }
  const proto = value.constructor;
  switch (proto) {
    case Number:
      return "number";
    case String:
      return "string";
    case Boolean:
      return "bool";
    case Array:
      return "array";
    case Object:
      return "object";
    case Function:
      return "function";
  }
};

/**
 * 返回类型名
 * @param origin
 */
const typeName = (origin: any) => origin.__proto__.constructor.name;

/**
 * 代替console.log
 */
function log() {
  // console.log(...arguments);
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
  log,
  singleTags,
  duoTag_Count0,
  closeTag,
  testType,
  typeName,
};
