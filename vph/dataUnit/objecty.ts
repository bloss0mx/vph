import { testType } from "../utils";
// import { difference, uniq } from 'lodash';
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { ARRAYY_OPERATE } from "../constant";
import { forDirective } from "../directive/index";
import { BaseObj } from "../domObj";
import DataUnit from "./dataUnit";
import { dataFactory, toJS } from "./index";

export default class Objecty extends DataUnit {
  protected data: Object;

  constructor(data: Array<any>) {
    super(data);
    this.pushList = [];
    this.data = this.dataInit(data);
    this.type = "object";
  }

  protected dataInit(data: Array<any>): Object {
    let _data = {};
    for (let i in data) {
      _data[i] = dataFactory(data[i]);
    }
    return _data;
  }

  /**
   * 删除值
   * @param key
   */
  delete(key) {
    delete this.data[key];
  }

  add(name: string, data) {
    this.data[name] = dataFactory(data);
  }

  /**
   * 批量获取store
   * @param params
   */
  getValues(...params) {
    const queue = [...params];
    const _data = {};
    queue.forEach(item => {
      _data[item] = this.showData(item);
    });
    return _data;
  }

  toJS() {
    return toJS(this);
  }
}
