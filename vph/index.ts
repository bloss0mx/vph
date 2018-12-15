import $ from 'jquery';
import VirtualDom from './vdom';
import { TAGS } from './constant';

const _tags = {};

TAGS.split(',').map(item => {
  _tags[item] = function (init) {
    init.tag = item;
    return init;
  }
});

export const tags = _tags;

export function vdFactory(init) {
  return new VirtualDom(init);
}

/**
 * 初始化
 * @param {*} selector 选择器
 * @param {*} vdom vdom实例
 * @param {*} productEnv 生产环境
 */
export function init(selector, vdom, productEnv = false) {
  if (productEnv) {
    console.assert(Window.vdom === undefined, 'window.vdom 已被占用');
    if (Window.vdom === undefined) {
      Window.vdom = vdom;
      console.warn('在控制台打出vdom来跟踪 virtual dom 变化！');
    }
  }
  setTimeout(() => {
    $(selector).append(vdom.giveDom());
  }, 0);
}