import {
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
} from "./tools";
import attrM from './attrAnalyse';
import tagSlicer from './tagSlicer';
// const { attrM } = require('./attrAnalyse');

const matchTagsNValue = (origin) => origin.match(/<[\/!-]{0,1}[^<]*[^-]>|{{[^\s]+}}/g);
const splitTagsNValue = (origin) => origin.split(/<[\/!-]{0,1}[^<]*[^-]>|{{[^\s]+}}/g).map(item => item.replace(/\n|\t/g, ''));
const rmComment = origin => origin.replace(/<!--[\w\W\r\n]*?-->/gmi, '');

/**
 * 分割模板
 * @param tmp 模板
 */
function splitTagNChildren(tmp) {
  const _tmp = rmComment(tmp);
  const tags = matchTagsNValue(_tmp);
  const text = splitTagsNValue(_tmp);
  const fragments = [];
  for (var i = 0; i < text.length - 1; i++) {
    !text[i].match(/^\s{0,}$/) && fragments.push(text[i]);
    fragments.push(tags[i]);
  }
  console.log(fragments);
  return fragments.map(item => item.replace(/^ *| *$/g, ''));
}

const getTag = (tag) => {
  const match = tag.match(/<[^ <\/]* |<[^ <\/]*\/?>/)
  return match && match[0].replace(/<|>| |\//g, '');
}

const cleanDirective = (origin, type) => origin && origin.replace(type, '').replace(/^['"]|['"]$/g, '');

class Container {
  private tag: string;
  private tagName: string;
  private children: Array<any>;
  private attr: Array<any>;
  private directive: Array<any>;
  constructor(tag) {
    this.tag = tag;
    this.children = [];
    this.getAttr();
  }
  getTagName() {
    this.tagName = getTag(this.tag);
    return this.tagName;
  }
  getAttr() {
    const attr = attrM(this.tag);
    this.attr = attr && attr.filter(item => !item.match(/^:/)).map(item => '' + item.replace(/"/g, '\\"') + '') || [];
    this.directive = attr && attr.filter(item => item.match(/^:/)) || [];
    return this.attr;
  }
  getIf() {
    const directive = this.directive.find(item => item.match(/:if/));
    return cleanDirective(directive, /:if=/);
  }
  getOn() {
    const directive = this.directive.find(item => item.match(/:on/));
    return cleanDirective(directive, /:on=/);
  }
  getFor() {
    const directive = this.directive.find(item => item.match(/:for/));
    return cleanDirective(directive, /:for=/);
  }
  getBind() {
    const directive = this.directive.find(item => item.match(/:bind/));
    return cleanDirective(directive, /:bind=/);
  }
  getProps() {
    const directive = this.directive.find(item => item.match(/:props/));
    return cleanDirective(directive, /:props=/);
  }
  getChildren() {
    return this.children;
  }
  pushChildren(child) {
    this.children.push(child);
  }
}

const matchHead = origin => origin.match(/^<[\s\S]+>$/);
const matchTail = origin => origin.match(/^<[\s\S]+>$/);

function tagMaker(splitedTmp) {
  if (splitedTmp.length === 0) {
    return;
  }
  const tagStack = [];
  let index = 0;
  let rootContainer = undefined;

  rootContainer = new Container(splitedTmp[0]);
  index = 1;
  tagStack.push(rootContainer);

  do {
    const currentTag = splitedTmp[index];
    const headTag = getTagFromHead(currentTag);
    const tailTag = getTagFromTail(currentTag);

    if (testSingle(currentTag) || singleComponent(currentTag)) {//单标签
      const newContainer = new Container(currentTag);
      tagStack[tagStack.length - 1].pushChildren(newContainer);
    } else if (headTag) {//头
      const newContainer = new Container(currentTag);
      tagStack[tagStack.length - 1].pushChildren(newContainer);
      tagStack.push(newContainer);
    } else if (tailTag) {//尾
      tagStack.pop();
    } else {//纯文本
      tagStack[tagStack.length - 1].pushChildren(currentTag);
    }
    index++;
  } while (splitedTmp.length > index);
  return rootContainer;
}

// exports.tagAnalyse = origin => tagMaker(splitTagNChildren(origin));
export default origin => tagMaker(tagSlicer(rmComment(origin)));