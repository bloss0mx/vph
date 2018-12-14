import { testType, log } from './utils';
import _ from 'lodash';
import $ from 'jquery';
import { DataUnit, Arrayy, Objecty, dataFactory } from './DataUnit';
import { TextDom, PlainText, AttrObj } from './domObj';
import { vdFactory } from './index';
import { IfDirective, forDirective, onDirective } from './directive';
import { ARRAYY_OPERATE } from './constant';

/**
 * 初始化时，dom操作必须同步
 */
export default class VirtualDom {
  private dom;
  private init;
  private name;
  private tag;
  private attr;
  private attrPt;
  private children;
  private childrenPt;
  private ifDirective;
  private forDirective;
  private onDirective;
  private varibleName;
  private baseDataName;
  private store;
  private props;
  private actions;
  private ifDirectivePt;
  private forDirectivePt;
  private father;
  private index;
  private forIndex;
  private forDomPt;
  constructor(init) {
    this.init = init;
    this.name = init.name;
    this.tag = init.tag;
    this.attr = init.attr;
    this.attrPt = [];
    this.children = init.children;
    this.childrenPt = [];//
    this.ifDirective = init.ifDirective || null;
    this.forDirective = init.forDirective || null;
    this.onDirective = init.onDirective || null;
    this.varibleName = init.varibleName !== undefined ? init.varibleName : undefined;
    this.baseDataName = init.baseDataName !== undefined ? init.baseDataName : undefined;
    this.setFather(init.father, init.index);

    this.store = init.store === undefined ? {} : init.store;//本地store存储
    this.store = init.forStore === undefined ? this.store : init.forStore;
    this.props = init.props === undefined ? {} : init.props;//父节点传入store
    this.actions = init.actions;

    this.forDirective ? this.initForDom() : this.initDom();
    this.bindActions();
    init.state === undefined ? null : this.initState(init.state);
    !init.forDirective && this.makeChildren();
    if (init.whenInit !== undefined && typeof init.whenInit === 'function') {
      setTimeout(() => {
        init.whenInit.apply(this);
      }, 0);
    }
    this.attrPt = this.initAttr();
    this.onDirective = this.initOn();
    this.ifDirectivePt = this.initIf();
    this.forDirective ? this.forDirectivePt = this.initFor() : null;
  }

  /**
   * 初始化dom
   */
  initForDom() {
    this.dom = document.createDocumentFragment();
  }

  initDom() {
    this.dom = document.createElement(this.tag);
  }

  /**
   * 设置父节点和index
   * @param {*} father 
   * @param {*} index 
   */
  setFather(father, index) {
    this.father = father;
    this.index = index;
  }

  /**
   * 初始化state
   * @param {*} init 
   */
  initState(init) {
    this.store = dataFactory(init);
  }

  /**
   * 初始化if指令
   */
  initIf() {
    const ifDirective = this.ifDirective;
    if (!ifDirective) {
      return;
    }
    return new IfDirective({ flagName: ifDirective, pt: this, store: this.store });
  }

  /**
   * 初始化for指令
   */
  initFor() {
    const _directive = this.forDirective;
    if (!_directive) {
      return;
    }
    this.forIndex = 0;//for指令的index
    this.forDomPt = [];
    return new forDirective({ directive: _directive, pt: this, store: this.store });
  }

  /**
   * 初始化on指令
   */
  initOn() {
    const _directive = this.onDirective;
    if (!_directive) return;
    return new onDirective({ directive: _directive, pt: this, store: this.store });
  }

  /**
   * 绑定action
   */
  bindActions() {
    const actions = this.actions;
    if (actions !== undefined) {
      for (var i in actions) {
        this[i] = actions[i].bind(this);
      }
    }
  }

  /**
   * 初始化属性
   */
  initAttr() {
    const attrArray = this.attr;
    if (!attrArray) {
      return [];
    }
    return attrArray.map((item, index) => {
      return new AttrObj({ attr: item, dom: this.dom, store: this.store });
    });
  }

  /**
   * 初始化子节点
   */
  makeChildren() {
    this.childrenPt = this.children === undefined ? [] : this.children.map((item, index) => {
      if (item && item.__proto__.constructor === VirtualDom) {
        item.setFather(this, index);
        this.dom.appendChild(item.giveDom());
        return item;
      } else if (testType(item) === 'string') {
        if (item.match(/\{\{[^\s]*\}\}/)) {
          const textNode = new TextDom(item,
            this.store,
            this.varibleName !== undefined ? this.varibleName : index,
            this.baseDataName
          );
          this.dom.appendChild(textNode.giveDom());
          return textNode;
        } else {
          const textNode = new PlainText(item);
          this.dom.appendChild(textNode.giveDom());
          return textNode;
        }
      } else if (testType(item) === 'object') {
        const { store, ...other } = item;
        const node = vdFactory({
          baseDataName: this.baseDataName,
          store: this.store,
          father: this,
          index: index,
          ...other
        });
        this.dom.appendChild(node.giveDom());
        return node;
      }
    });
  }

  /**
   * for指令初始化子节点
   * @param {*} childInitMsg 
   */
  makeForChildren(childInitMsg) {
    const init = this.init;
    delete init.ifDirective;
    delete init.forDirective;
    init.varibleName = childInitMsg.varibleName;
    init.baseDataName = childInitMsg.baseDataName;
    init.store = this.store;
    init.forStore = childInitMsg.forStore;
    init.props = this.props;
    const vdom = vdFactory(init);
    return {
      tmpDom: vdom.giveDom(),
      tmpChildrenPt: vdom,
    };
  }

  /**
   * 输出dom
   */
  giveDom() {
    // if (this.ifDirective === 'index') console.log('index', this.father);
    return this.dom;
  }

  /**
   * 隐藏（删除）dom
   */
  hide() {
    this.childrenPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    // if (this.ifDirective === 'index')
    //   console.log(this.childrenPt, this.children);
    this.attrPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    // this.ifDirectivePt && this.ifDirectivePt.rmSelf();
    $(this.dom).remove();
    this.dom = null;
  }

  /**
   * 显示（新建）dom
   */
  show() {
    if (!this.dom) {
      this.initDom();
      this.makeChildren();
      this.insertToAvilableBefore(this.giveDom());
      this.attrPt = this.initAttr();
    }
  }

  /**
   * 删除自己
   * @param {*}  
   */
  rmSelf() {
    this.childrenPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    if (this.ifDirective === 'index')
      console.log(this.childrenPt, this.children);
    this.attrPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    this.ifDirectivePt && this.ifDirectivePt.rmSelf();
    // if (this.childrenPt) {
    //   console.log(this.childrenPt);
    //   for (let i = 0; i < this.childrenPt.length; i++) {
    //     this.childrenPt[i].rmSelf && this.childrenPt[i].rmSelf();
    //     this.childrenPt = null;
    //   }
    // }
    $(this.dom).remove();
    this.dom = null;
  }

  /**
   * 在上一个节点以后插入dom
   * @param {*} dom 
   * @param {*} deviation 
   */
  insertToAvilableBefore(dom) {
    const previousBrother = this.previousBrother();
    if (previousBrother) {
      this.insertAfter(previousBrother, dom);
    } else {
      this.insertPre(dom);
    }
  }

  /**
   * 向后插入
   * @param {*} pt 
   * @param {*} dom 
   */
  insertAfter(pt, dom) {
    $(dom).insertAfter($(pt));
  }

  /**
   * 向前插入
   * @param {*} dom 
   */
  insertPre(dom) {
    $(this.dom).prepend($(dom));
  }

  /**
   * 查找前一个兄弟节点
   */
  previousBrother() {
    if (this.father) {
      for (var i = this.index - 1; i >= 0; i--) {
        if (this.father.childrenPt[i] && this.father.childrenPt[i].giveDom()) {
          return this.father.childrenPt[i].giveDom();
        }
      }
    }
  }

  /**
   * 查找下一个兄弟节点
   */
  nextBrother() {
    if (this.father) {
      for (var i = this.index + 1; i < this.father.childrenPt.length; i++) {
        if (this.father.childrenPt[i] && this.father.childrenPt[i].giveDom()) {
          return this.father.childrenPt[i].giveDom();
        }
      }
    }
  }

}