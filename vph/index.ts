import $ from 'jquery';
import VirtualDom from './vdom';
import { TAGS } from './constant';
import StoreKeeper from './store';
import { dataFactory } from './DataUnit';
import {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
} from './domOperator';
import { forDirective, IfDirective, onDirective, ValueBind } from './directive';
// import * as _Tags from './Tags';


/**
 * 组件初始化
 * @param init 
 */
export function Component(
  init: {
    tag: string,
    children?: [],
    attr?: [],
    forDirective?: string,
    onDirective?: string,
    IfDirective?: string,
  }
): Function {
  return function (
    props: { props?: [] }
  ): Function {
    return function (store: StoreKeeper): VirtualDom {
      // console.log(props.props);
      const _props = props ? store.getMultiValue(...props.props) : {};
      // const _props = props ? store.getValues(...props.props) : {};
      console.log(_props);
      const _init = {
        ...init,
        storeKeeper: new StoreKeeper(dataFactory({}), {}, _props),
      };
      return vdFactory(_init);
    }
  }
}


export function vdFactory(init) {
  return new VirtualDom(init);
}

interface Window {
  vdom?: any
}

declare var window: Window;

/**
 * 初始化
 * @param {*} selector 选择器
 * @param {*} vdom vdom实例
 * @param {*} productEnv 生产环境
 */
export function init(selector, vdom, productEnv = false) {
  if (productEnv) {
    console.assert(window.vdom === undefined, 'window.vdom 已被占用');
    if (window.vdom === undefined) {
      window.vdom = vdom;
      console.warn('在控制台打出vdom来跟踪 virtual dom 变化！');
    }
  }
  setTimeout(() => {
    append(selector, vdom.giveDom());
  }, 0);
}