import { ARRAYY_OPERATE } from "../constant";
import { DataUnit } from "../DataUnit/index";
import VirtualDom from "../vdom";
import StoreKeeper from "../store";
import {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
} from "../domOperator";
import Directive from "./directive";

export default class onDirective<T> extends Directive {
  private storeKeeper: StoreKeeper<T>;
  private pt: VirtualDom<T>;
  private callback: any; // FIX ME
  private directive: string;
  private eventType: string;
  private callbackName: string;
  constructor(init) {
    super(init);
    this.storeKeeper = init.storeKeeper;
    this.pt = init.pt;
    this.callback = init.callback;
    this.directive = init.directive; //'input.'

    this.init();
    this.findCallback();
    this.findOrigin();
  }

  init() {
    const splited = this.directive.split(".");
    const handled = splited.map(item => {
      return item.replace(/[\s]*/, "");
    });
    this.eventType = handled[0];
    this.callbackName = handled[1];
  }

  findOrigin() {
    if (this.eventType && this.callback) {
      this.pt.giveDom().addEventListener(this.eventType, this.callback);
    }
  }

  /**
   * 组件根节点查找action
   */
  findCallback() {
    let pt = this.pt;
    for (;;) {
      if (!pt.isComponent) {
        pt = pt.father;
      } else {
        break;
      }
    }
    if (pt.actions && pt.actions[this.callbackName]) {
      this.callback = pt.actions[this.callbackName].bind(pt);
    }
  }

  rmSelf() {
    this.pt.giveDom().removeEventListener(this.eventType, this.callback);
  }
}
