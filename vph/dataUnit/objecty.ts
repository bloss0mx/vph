import { testType } from "../utils";
// import { difference, uniq } from 'lodash';
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { ARRAYY_OPERATE } from "../constant";
import { forDirective } from "../directive/index";
import { BaseObj } from "../domObj";
import DataUnit, { anyType } from "./dataUnit";
import { dataFactory, toJS } from "./index";

export default class Objecty<T> extends DataUnit<T> {
  protected data: anyType;

  constructor(data: T) {
    super(data);
    this.pushList = [];
    this.data = this.dataInit(data);
    this.type = "object";
  }

  protected dataInit(data: T): Object {
    let _data: anyType = {};
    for (let i in data) {
      _data[i] = dataFactory(data[i]);
    }
    return _data;
  }

  /**
   * 删除值
   * @param key
   */
  delete(key: string) {
    delete this.data[key];
  }

  add(name: string, data: anyType) {
    this.data[name] = dataFactory(data);
  }

  /**
   * 批量获取store
   * @param params
   */
  getValues(...params: string[]) {
    const queue = [...params];
    const _data: anyType = {};
    queue.forEach(item => {
      _data[item] = this.showData(item);
    });
    return _data;
  }

  toJS() {
    return toJS(this);
  }
}
