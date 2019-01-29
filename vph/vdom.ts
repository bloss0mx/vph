import $ from 'jquery';
import { DataUnit, Arrayy, Objecty, dataFactory } from './DataUnit';
import { TextDom, PlainText, AttrObj, BaseObj } from './domObj';
import { vdFactory } from './index';
import { IfDirective, forDirective, onDirective, ValueBind } from './directive';
import { ARRAYY_OPERATE } from './constant';
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

/**
 * 初始化时，dom操作必须同步
 */
export default class VirtualDom {
  index: number;
  father: VirtualDom;
  actions: Array<Function>;
  components: Array<VirtualDom>;
  childrenPt: Array<VirtualDom | BaseObj>;

  private init;
  private tag: string;
  // private props: DataUnit;
  private varibleName: string;
  private baseDataName: string;
  // private attr: Array<string>;
  private attrPt: Array<AttrObj>;
  private valueBind: ValueBind;
  private storeKeeper: StoreKeeper;
  private ifDirective: IfDirective;
  private onDirective: onDirective;
  private forDirective: forDirective;
  private dom: DocumentFragment | HTMLElement;
  private children: Array<BaseObj | Object | string>;
  private whenUninit: Function | null;
  constructor(init) {
    // 复制
    this.init = init;
    this.attrPt = [];
    this.tag = init.tag;
    this.children = init.children;
    this.childrenPt = [];//
    this.varibleName = init.varibleName !== undefined ? init.varibleName : undefined;
    this.baseDataName = init.baseDataName !== undefined ? init.baseDataName : undefined;
    this.setFather(init.father, init.index);

    // store和dom初始化
    this.storeKeeper = init.storeKeeper instanceof StoreKeeper
      ? init.storeKeeper
      : new StoreKeeper(dataFactory({}));//StoreKeeper
    this.actions = init.actions;
    this.components = init.components;

    init.forDirective ? this.initForDom() : this.initDom();
    this.bindActions();
    init.state === undefined ? null : this.initState(init.state);
    init.props === undefined ? null : this.initProps(init.props);

    // render
    !init.forDirective && this.makeChildren();
    this.fireWhenInit(init.whenInit);
    this.whenUninit = init.whenUninit;
    this.attrPt = this.initAttr();

    // 初始化指令
    this.onDirective = this.initOn(init.onDirective);
    this.ifDirective = this.initIf(init.ifDirective);
    this.forDirective = this.initFor(init.forDirective);
    this.valueBind = this.initValueBind(init.valueBind);
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
   * @param {*} data 
   */
  initState(data) {
    this.storeKeeper.setStore(dataFactory(data));
  }

  /**
   * 初始化props
   * @param data 
   */
  initProps(data) {
    this.storeKeeper.setProps(() => this.getDatas(...data));
  }

  /**
   * 初始化if指令
   */
  initIf(ifDirective) {
    if (!ifDirective) {
      return;
    }
    return new IfDirective({ flagName: ifDirective, pt: this, storeKeeper: this.storeKeeper });
  }

  /**
   * 初始化for指令
   */
  initFor(_directive) {
    if (!_directive) {
      return;
    }
    return new forDirective({ directive: _directive, pt: this, storeKeeper: this.storeKeeper });
  }

  /**
   * 初始化on指令
   */
  initOn(_directive) {
    if (!_directive) return;
    return new onDirective({ directive: _directive, pt: this, storeKeeper: this.storeKeeper });
  }

  /**
   * store到dom
   * @param _directive 
   */
  initValueBind(_directive) {
    if (!_directive) return;
    return new ValueBind({ directive: _directive, pt: this, storeKeeper: this.storeKeeper });
  }

  /**
   * 触发whenInit钩子
   * @param whenInit 
   */
  fireWhenInit(whenInit) {
    if (typeof whenInit === 'function') {
      // setTimeout(() => {
      whenInit.apply(this);
      // }, 0);
    }
  }

  /**
   * 触发whenUninit钩子
   * @param whenUninit 
   */
  fireWhenUninit() {
    if (typeof this.whenUninit === 'function') {
      // setTimeout(() => {
      this.whenUninit.apply(this);
      // }, 0);
    }
  }

  /**
   * 绑定action
   */
  bindActions() {
    const actions = this.actions;
    if (actions !== undefined) {
      for (let i in actions) {
        this[i] = actions[i].bind(this);
      }
    }
  }

  /**
   * 初始化属性
   */
  initAttr() {
    const attrArray = this.init.attr;
    if (!attrArray) {
      return [];
    }
    return attrArray.map((item, index) => {
      return new AttrObj({ attr: item, dom: this.dom, storeKeeper: this.storeKeeper });
    });
  }

  /**
   * 初始化子节点
   */
  makeChildren() {
    this.childrenPt = this.children === undefined
      ? []
      : this.children.map((item, index) => {
        if (item instanceof VirtualDom) {
          item.setFather(this, index);
          this.dom.appendChild(item.giveDom());
          return item;
        } else if (typeof item === 'function') {
          const _item = item(this.storeKeeper);
          _item.setFather(this, index);
          this.dom.appendChild(_item.giveDom());
          return _item;
        } else if (typeof item === 'string') {
          if (item.match(/^\{\{[^\s]*\}\}$/)) {
            const textNode = new TextDom(
              item,
              index,
              this.baseDataName,
              this.varibleName,
              this.storeKeeper,
            );
            this.dom.appendChild(textNode.giveDom());
            return textNode;
          } else {
            const textNode = new PlainText(item);
            this.dom.appendChild(textNode.giveDom());
            return textNode;
          }
        } else if (typeof item === 'object') {
          const { ...other } = item;
          const node = vdFactory({
            baseDataName: this.baseDataName,
            storeKeeper: this.storeKeeper,
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

    init.storeKeeper = new StoreKeeper(...this.storeKeeper.outputAll());
    init.storeKeeper.setForStore((store, forStore, props) => {
      const _forStore = { ...forStore };
      _forStore[init.varibleName] = childInitMsg.baseData.showData(childInitMsg.index);
      return _forStore;
    });

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
    return this.dom;
  }

  /**
   * 隐藏（删除）dom
   */
  hide() {
    this.childrenPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    this.attrPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    remove(this.dom);
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
    this.fireWhenUninit();
    this.childrenPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    this.attrPt.map(item => {
      item.rmSelf && item.rmSelf();
    });
    this.ifDirective && this.ifDirective.rmSelf();
    remove(this.dom);
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
    console.log(dom);
    $(dom).insertAfter($(pt));
  }

  /**
   * 向前插入
   * @param {*} dom 
   */
  insertPre(dom) {
    prepend(this.dom, dom);
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

  /**
   * 
   */
  getDatas(...params) {
    const store = this.storeKeeper.outputStore();
    if (store instanceof Objecty) {
      return store.getValues(...params);
    }
  }

}