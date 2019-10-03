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

export default class IfDirective<T> extends Directive {
  private flagName: string;
  private pt: VirtualDom<T>;
  private key: String;
  private storeKeeper: StoreKeeper<T>;
  constructor(init: {
    flagName: string;
    storeKeeper: StoreKeeper<T>;
    pt: VirtualDom<T>;
    key?: any;
  }) {
    super(init);
    this.flagName = init.flagName;

    this.storeKeeper = init.storeKeeper;
    this.pt = init.pt;

    this.key = init.key ? init.key : true; //
    this.storeKeeper.register(this.flagName, this);
  }

  run(data) {
    this.ifDirectiveOperate(data == this.key);
  }

  /**
   * 显示隐藏操作
   * @param {*} flag
   */
  ifDirectiveOperate(flag: boolean) {
    if (flag) {
      this.pt.show();
    } else {
      this.pt.hide();
    }
  }

  rmSelf() {
    this.storeKeeper.unregister(this.flagName, this);
  }
}
