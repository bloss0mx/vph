import { ARRAYY_OPERATE } from "../constant";
import { DataUnit } from "../dataUnit/index";
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

export default class ValueBind<T> extends Directive {
  private storeKeeper: StoreKeeper<T>;
  private pt: VirtualDom<T>;
  private directive: string;
  private valueType: string;
  private valueName: string;
  constructor(init: {
    storeKeeper: StoreKeeper<T>;
    pt: VirtualDom<T>;
    directive: string;
  }) {
    super(init);
    this.storeKeeper = init.storeKeeper;
    this.pt = init.pt;
    this.directive = init.directive; //'input.'

    this.init();
    this.findOrigin();
  }

  init() {
    const splited = this.directive.split(".");
    const handled = splited.map(item => {
      return item.replace(/[\s]*/, "");
    });
    this.valueType = handled[0];
    this.valueName = handled[1];
  }

  findOrigin() {
    this.storeKeeper.register(this.valueName, this);
  }

  run(data: any) {
    (this.pt.giveDom() as any)[this.valueType] = data;
  }
}
