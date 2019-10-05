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

// TODO 不要让指令直接操作vdom

export default class Directive {
  constructor(init: any) {}
  /**
   * 初始化
   */
  init() {}
  /**
   * 查找DataUnit源
   */
  findOrigin(directive: string) {}
  /**
   * 数据更新
   */
  run(data: any, type?: any, index?: any, operate?: any) {}
  /**
   * 删除自己，去掉所有引用
   */
  mySelf() {
    for (let i in this) {
      this[i] = null;
    }
  }
}
