import TAGS from './constants';
import { matchTags, splitText } from './tools';

const tags = TAGS.split(',');
const checkBaseTag = name => tags.find(i => i === name);
class Container {
  private tag;//直接吧tag本身放进来就是了
  private children;
  constructor(tag) {
    this.tag = tag;
  }
  pushChildren(child) {
    this.children.push(child);
  }
  output() {
    return function () { }
  }
}

export default function (tmp) {

}

/**
 * 分割模板
 * @param tmp 模板
 */
function splitTagNChildren(tmp) {
  const tags = matchTags(tmp);
  const text = splitText(tmp);
  const fragments = [];
  for (var i = 0; i < text.length - 1; i++) {
    !text[i].match(/^\s{0,}$/) && fragments.push(text[i]);
    fragments.push(tags[i]);
  }
  return fragments;
}