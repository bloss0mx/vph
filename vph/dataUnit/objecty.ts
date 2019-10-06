import { testType } from "../utils";
// import { difference, uniq } from 'lodash';
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { ARRAYY_OPERATE } from "../constant";
import { forDirective } from "../directive/index";
import { BaseObj } from "../domObj";
import DataUnit, { anyType } from "./dataUnit";
import Arrayy from "./arrayy";
import { dataFactory, toJS } from "./index";

type DataFactory_<T> = {
  [P in keyof T]: T[P] extends Array<any>
    ? Arrayy<T[P]>
    : T[P] extends Object
    ? Objecty<T[P]>
    : DataUnit<T[P]>;
}[keyof T];

type ObjectyData<T> = {
  [key in keyof T]: DataFactory_<T[key]>;
};

export default class Objecty<T> extends DataUnit<T> {
  protected data: ObjectyData<T>;

  constructor(data: T) {
    super(data as any);
    this.pushList = [];
    this.data = this.dataInit(data);
    this.type = "object";
  }

  protected dataInit(data: T): ObjectyData<T> {
    const _data = {} as ObjectyData<T>;
    for (let i in data) {
      (_data as any)[i] = dataFactory(data[i]);
    }
    return _data;
  }

  /**
   * 删除值
   * @param key
   */
  delete(key: string) {
    delete (this.data as any)[key];
  }

  add(name: string, data: anyType) {
    (this.data as any)[name] = dataFactory(data);
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
