import { DataUnit, Arrayy, Objecty, dataFactory } from "./DataUnit/index";
import { TextDom, PlainText, AttrObj, BaseObj } from "./domObj";
import { vdFactory } from "./index";
import {
  IfDirective,
  forDirective,
  onDirective,
  ValueBind,
} from "./directive/index";
import { ARRAYY_OPERATE, FRAGMENT_PROTO } from "./constant";
import StoreKeeper from "./store";
import {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
} from "./domOperator";
import { Fragment, Element, TextNode } from "./domKeeper";

interface init<T> {
  attr: Array<string>;
  isComponent: boolean;
  tag: string;
  children: Array<VirtualDom<any> | Object | string>;
  varibleName: string;
  baseDataName: string;
  father: VirtualDom<any>;
  index: number;
  storeKeeper: StoreKeeper<T>;
  actions: Array<Function>;
  components: Array<VirtualDom<any>>;
  onDirective: string;
  ifDirective: string;
  forDirective: string;
  valueBind: string;
  state: T;
  props: object;
  whenInit: Function;
  whenMount: Function;
  whenUninit: Function;
  slotDirective: string;
  slot: Array<any>;
}

/**
 * 初始化时，dom操作必须同步
 */
export default class VirtualDom<T> {
  index: number;
  father: VirtualDom<any>;
  actions: Array<Function>;
  components: Array<VirtualDom<any>>;
  childrenPt: Array<VirtualDom<any> | BaseObj>;
  isComponent: boolean;
  slotDirective: string;

  private slot: Array<any>;
  private init: init<T>;
  private tag: string;
  // private props: DataUnit;
  private varibleName: string;
  private baseDataName: string;
  // private attr: Array<string>;
  private attrPt: Array<AttrObj<T>>;
  private valueBind: ValueBind<T>;
  private storeKeeper: StoreKeeper<T>;
  private ifDirective: IfDirective<T>;
  private onDirective: onDirective<T>;
  private forDirective: forDirective<T>;
  private dom: Fragment<T> | Element<T>;
  // private dom: DocumentFragment | HTMLElement;
  private children: Array<VirtualDom<any> | Object | string>;
  private whenInit: Function;
  private whenMount: Function;
  private whenUninit: Function;
  constructor(init: {
    attr: Array<string>;
    isComponent: boolean;
    tag: string;
    children: Array<VirtualDom<any> | Object | string>;
    varibleName: string;
    baseDataName: string;
    father: VirtualDom<any>;
    index: number;
    storeKeeper: StoreKeeper<T>;
    actions: Array<Function>;
    components: Array<VirtualDom<any>>;
    onDirective: string;
    ifDirective: string;
    forDirective: string;
    valueBind: string;
    state: object;
    props: object;
    whenInit: Function;
    whenMount: Function;
    whenUninit: Function;
    slotDirective: string;
    slot: Array<any>;
  }) {
    // 复制
    this.isComponent = init.isComponent || false;
    this.init = init as any;
    this.attrPt = [];
    this.tag = init.tag;
    this.children = init.children;
    this.childrenPt = []; //
    this.varibleName =
      init.varibleName !== undefined ? init.varibleName : undefined;
    this.baseDataName =
      init.baseDataName !== undefined ? init.baseDataName : undefined;
    this.setFather(init.father, init.index);

    // store和dom初始化
    this.storeKeeper =
      init.storeKeeper instanceof StoreKeeper
        ? init.storeKeeper
        : new StoreKeeper(dataFactory({})); //StoreKeeper
    this.actions = init.actions;
    this.components = init.components;

    init.forDirective ? this.initForDom() : this.initDom();
    this.bindActions();
    init.state === undefined ? null : this.initState(init.state);
    init.props === undefined ? null : this.initProps(init.props);

    // render
    !init.forDirective && this.makeChildren();
    this.fireWhenInit(init.whenInit);
    this.whenMount = init.whenMount;
    this.whenUninit = init.whenUninit;
    this.attrPt = this.initAttr() as any;

    // 初始化指令
    this.onDirective = this.initOn(init.onDirective) as any;
    this.ifDirective = this.initIf(init.ifDirective);
    this.forDirective = this.initFor(init.forDirective);
    this.valueBind = this.initValueBind(init.valueBind);
    this.slotDirective = init.slotDirective;
    this.slot = init.slot;
  }

  /**
   * 初始化for-dom
   */
  initForDom() {
    // this.dom = document.createDocumentFragment();
    this.dom = new Fragment({
      master: this,
    });
  }
  /**
   * 初始化dom
   */
  initDom() {
    // this.dom = document.createElement(this.tag);
    this.dom = new Element({
      master: this,
      tag: this.tag,
    });
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
    return new IfDirective({
      flagName: ifDirective,
      pt: this,
      storeKeeper: this.storeKeeper,
    });
  }

  /**
   * 初始化for指令
   */
  initFor(_directive) {
    if (!_directive) {
      return;
    }
    return new forDirective({
      directive: _directive,
      pt: this,
      storeKeeper: this.storeKeeper,
    });
  }

  /**
   * 初始化on指令
   */
  initOn(_directive) {
    if (!_directive) return;
    return new onDirective({
      directive: _directive,
      pt: this,
      storeKeeper: this.storeKeeper,
    });
  }

  /**
   * store到dom
   * @param _directive
   */
  initValueBind(_directive) {
    if (!_directive) return;
    return new ValueBind({
      directive: _directive,
      pt: this,
      storeKeeper: this.storeKeeper,
    });
  }

  /**
   * 触发whenInit钩子
   * @param whenInit
   */
  fireWhenInit(whenInit) {
    if (typeof whenInit === "function") {
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
    if (typeof this.whenUninit === "function") {
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
      return new AttrObj({
        attr: item,
        dom: this.dom,
        storeKeeper: this.storeKeeper,
      });
    });
  }

  /**
   * 初始化子节点
   */
  makeChildren() {
    this.childrenPt =
      this.children === undefined
        ? []
        : this.children.map((item, index) => {
            if (item instanceof VirtualDom) {
              item.setFather(this, index);
              this.dom.appendChild(item.giveDom());
              return item;
            } else if (typeof item === "function") {
              //子是一个组件函数
              const _item: VirtualDom<any> = item(this.storeKeeper);
              _item.setFather(this, index);
              this.dom.appendChild(_item.giveDom());
              return _item;
            } else if (typeof item === "string") {
              //子是string
              if (item.match(/^\{\{[^\s]*\}\}$/)) {
                //绑定值
                const textNode = new TextDom(item, index, this.storeKeeper);
                this.dom.appendChild(textNode.giveDom());
                return textNode;
              } else {
                //不可变string
                const textNode = new PlainText(item);
                this.dom.appendChild(textNode.giveDom());
                return textNode;
              }
            } else if (typeof item === "object") {
              //初始化对象
              const { ...other } = item;
              const node = vdFactory({
                baseDataName: this.baseDataName,
                storeKeeper: this.storeKeeper,
                father: this,
                index: index,
                ...other,
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
  makeForChildren(childInitMsg: {
    varibleName: string;
    index: string;
    storeKeeper: StoreKeeper<T>;
    baseData: DataUnit;
    baseDataName: string;
  }) {
    const init = this.init;
    delete init.ifDirective;
    delete init.forDirective;
    init.varibleName = childInitMsg.varibleName;
    init.baseDataName = childInitMsg.baseDataName;

    // init.storeKeeper = new StoreKeeper(...this.storeKeeper.outputAll());
    init.storeKeeper = this.storeKeeper;
    init.storeKeeper.setForStore((store, forStore, props) => {
      const _forStore = { ...forStore };
      _forStore[init.varibleName] = childInitMsg.baseData.showData(
        childInitMsg.index
      );
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
  giveDom(): DocumentFragment | HTMLElement | Text {
    if (this.isComponent && typeof this.whenMount === "function") {
      this.whenMount.apply(this);
    }
    return this.dom.outputDom();
  }

  // FIX 是不是和rmSelf重复？或者没有去掉指令
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
      this.attrPt = this.initAttr() as any;
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
    this.onDirective && this.onDirective.rmSelf();
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
      insertAfter(previousBrother, dom);
    } else {
      prepend(this.dom, dom);
    }
  }

  /**
   * 查找前一个兄弟节点
   */
  previousBrother(): DocumentFragment | HTMLElement | Text {
    /**
     * 向前查找可作为参考的节点。
     * 因为for指令的vdom的子节点不可能为for指令的vdom，所以只查找两层。
     * 如果两层内没有可用的节点就继续向前查找。
     * @param pt
     * @param index
     */
    function fetchChildrenPt(pt: VirtualDom<any>, index: number) {
      if (checkChild(pt, index)) {
        return fetchChildrenPt(
          <any>pt.childrenPt[pt.childrenPt.length - 1],
          index - 1
        );
      } else {
        if (
          Object.getPrototypeOf(pt.giveDom && pt.giveDom()) === FRAGMENT_PROTO
        ) {
          return undefined;
        } else {
          return (pt.giveDom && pt.giveDom()) || pt;
        }
      }
    }
    /**
     * index用来限制层级，只能检查两级
     * @param pt
     * @param index
     */
    function checkChild(pt: VirtualDom<any>, index: number) {
      return (
        pt.childrenPt &&
        pt.childrenPt[pt.childrenPt.length - 1] &&
        index &&
        Object.getPrototypeOf(pt.giveDom()) === FRAGMENT_PROTO
      );
    }
    if (this.father) {
      for (var i = this.index - 1; i >= 0; i--) {
        if (this.father.childrenPt[i] && this.father.childrenPt[i].giveDom()) {
          const fetched = fetchChildrenPt(<any>this.father.childrenPt[i], 1);
          if (fetched !== undefined) {
            return fetched;
          }
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
  getDatas(...params): object {
    const store = this.storeKeeper.outputStore();
    if (store instanceof Objecty) {
      return store.getValues(...params);
    }
  }

  /**
   * 设置新的state
   * @param callback
   */
  setState(callback: (state: T) => T, afterUpdate: (state: T) => any) {
    this.storeKeeper.setState(callback);
    if (typeof afterUpdate === "function") {
      afterUpdate.apply(this);
    }
  }
}
