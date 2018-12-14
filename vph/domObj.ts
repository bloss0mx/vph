import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import { exposeToWindow } from './Lady_tool';

const TEMPLATE_REGEXP = /\{\{[^\s]+\}\}/;

class BaseObj {
  /**
   * 初始化
   * @param {*} name 
   * @param {*} store 
   * @param {*} index 
   * @param {*} baseDataName 
   */
  constructor(name, store?, index?, baseDataName?) { }
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
  giveDom() { }
  /**
   * 删除自己，去掉所有引用
   */
  rmSelf() { }
}

class TextDom extends BaseObj {
  private name;
  private template;
  private baseDataName;
  private dom;
  private store;
  constructor(name, store, index, baseDataName) {
    super(name, store, index, baseDataName);
    this.name = name;
    this.template = name;
    this.baseDataName = baseDataName;
    this.dom = document.createTextNode(name);
    this.store = store === undefined ? {} : store;
    if (baseDataName !== undefined) {
      if (index === undefined) {
        throw ('TextDom no index with baseDataName!');
      }
      this.findOrigin(`${index}`);
    } else {
      this.findOrigin(name.replace(/\{|\}/g, ''));
    }
  }

  findOrigin(name) {
    const found = this.store.outputData(name);
    if (found !== undefined) {
      found.addPush(this);
    }
  }

  run(data, type, index) {
    if (this.name.match(TEMPLATE_REGEXP)) {
    }
    this.dom.textContent = data;
  }

  giveDom() {
    if (this.name.match(TEMPLATE_REGEXP))
      exposeToWindow(Math.floor(Math.random() * 100), this.dom);
    return this.dom;
  }

  rmSelf() {
    const valueName = this.template.match(TEMPLATE_REGEXP);
    if (valueName[0]) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      const found = this.store.outputData(value);
      if (found !== undefined) {
        found.rmPush(this);
      }
    }
    this.dom = null;
  }

}

class PlainText extends BaseObj {
  private name;
  private dom;
  constructor(name) {
    super(name);
    this.dom = document.createTextNode(name);
  }

  giveDom() {
    return this.dom;
  }

}

class AttrObj extends BaseObj {
  private dom;
  private name;
  private store;
  private template;
  private value;
  constructor(init) {
    super(init);
    this.dom = init.dom;
    const attrData = init.attr.split('=');
    this.name = attrData[0] ? attrData[0] : '';
    this.store = init.store;
    this.template = attrData[1] ? attrData[1] : undefined;
    this.value = attrData[1] ? attrData[1] : undefined;
    this.findOrigin(this.value, this.dom);
  }

  findOrigin(tmp, node) {
    const valueName = tmp.match(TEMPLATE_REGEXP);
    if (valueName) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      const found = this.store.outputData(value);
      if (found !== undefined) {
        found.addPush(this);
        this.run(found.outputData());
      }
    }
  }

  rmSelf() {
    const valueName = this.template.match(TEMPLATE_REGEXP);
    if (valueName[0]) {
      const value = valueName[0] && valueName[0].replace(/\{|\}/g, '');
      const found = this.store.outputData(value);
      if (found !== undefined) {
        found.rmPush(this);
      }
    }
    this.dom = null;
  }

  run(data) {
    if (data) {
      this.value = data;
      const value = this.template.replace(TEMPLATE_REGEXP, data);
      $(this.dom).attr(this.name, value);
    } else {
      $(this.dom).removeAttr(this.name);
    }
  }

}

// TODO 
// class InputObj extends BaseObj {
//   constructor(){
//     super();
//   }
// }

export { BaseObj, TextDom, PlainText, AttrObj };