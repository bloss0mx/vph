import { testType, log } from './utils';
import { exposeToWindow } from './Lady_tool';
import { DataUnit } from './DataUnit';
import StoreKeeper from './store';
import {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
} from './domOperator';
import { Fragment, Element, TextNode } from './domKeeper';

const TEMPLATE_REGEXP = /\{\{[^\s]+\}\}/;

class BaseObj {
  protected dom;
  /**
   * 初始化
   * @param {*} name 
   * @param {*} store 
   * @param {*} index 
   */
  constructor(name, store?, index?) { }
  /**
   * 数据更新
   * @param {*} data 
   * @param {*} type 
   * @param {*} index 
   * @param {*} opeate 
   */
  run(data, type, index, opeate) { }
  /**
   * 查找DataUnit源
   * @param {*} name 
   * @param {*} node 
   * @param {*} index 
   */
  findOrigin(name, node, index) { }
  /**
   * 输出dom
   */
  giveDom() {
    return this.dom;
  }
  /**
   * 删除自己，去掉所有引用
   */
  rmSelf() { }
}

class TextDom extends BaseObj {
  private name: string;
  private template: string;
  private storeKeeper: StoreKeeper;
  constructor(name, index, storeKeeper) {
    super(name, index);
    this.name = name;
    this.template = name;
    this.dom = document.createTextNode(name);
    this.storeKeeper = storeKeeper;
    this.storeKeeper.register(name.replace(/\{|\}/g, ''), this);
  }


  run(data, type, index) {
    if (this.name.match(TEMPLATE_REGEXP)) {
    }
    if (this.dom && this.dom.textContent) {
      this.dom.textContent = data;
    }
  }

  giveDom() {
    return this.dom;
  }

  rmSelf() {
    const valueName = this.template.match(TEMPLATE_REGEXP);
    if (valueName[0]) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      this.storeKeeper.unregister(value, this);
    }
    this.dom = null;
  }

}

class PlainText extends BaseObj {
  constructor(name) {
    super(name);
    this.dom = document.createTextNode(name.replace(/&nbsp;/g, '\u00A0'));
    // console.log(this.dom.);
    // this.dom = document.createDocumentFragment();
    // this.dom.innerHTML = name;
  }

  giveDom() {
    return this.dom;
  }

}

class AttrObj extends BaseObj {
  private name: string;
  private storeKeeper: StoreKeeper;
  private template: string;
  private value: string;
  constructor(init) {
    super(init);
    this.dom = init.dom;
    const attrData = init.attr.split('=');
    this.name = attrData[0] ? attrData[0] : '';
    this.storeKeeper = init.storeKeeper;
    this.template = attrData[1] ? attrData[1].replace(/^['"]|['"]$/g, '') : undefined;
    this.value = attrData[1] ? attrData[1] : undefined;
    // this.findOrigin(this.value);
    this.defaultAttr(this.value);
  }

  defaultAttr(tmp) {
    const valueName = tmp.match(TEMPLATE_REGEXP);
    if (!valueName) {
      const value = tmp.replace(/['\\"]/g, '');
      this.dom.setAttribute && attr(this.dom, this.name, value);
    } else {
      this.findOrigin(tmp);
    }
  }

  findOrigin(tmp) {
    const valueName = tmp.match(TEMPLATE_REGEXP);
    if (valueName) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      this.storeKeeper.register(value, this);
    }
  }

  rmSelf() {
    const valueName = this.template.match(TEMPLATE_REGEXP);
    if (valueName && valueName[0]) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      this.storeKeeper.unregister(value, this);
    }
    this.dom = null;
  }

  run(data) {
    if (data) {
      this.value = data;
      const value = this.template.replace(TEMPLATE_REGEXP, data);
      attr(this.dom, this.name, value);
    } else {
      removeAttr(this.dom, this.name);
    }
  }

}

export { BaseObj, TextDom, PlainText, AttrObj };