import { testType } from "../utils";
// import { difference, uniq } from 'lodash';
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { ARRAYY_OPERATE } from "../constant";
import { forDirective } from "../directive/index";
import { BaseObj } from "../domObj";
import DataUnit, { anyType } from "./dataUnit";
import { dataFactory } from "./index";
import Objecty from "./objecty";
import { DatayType, PushAbleType, addToListAbleType } from "type/index";

type ArrayyData<T> = Array<Objecty<T> | DataUnit<T> | Arrayy<T>>;

export default class Arrayy<T> extends DataUnit<T> {
  protected data: ArrayyData<T>;
  protected pushList: Array<addToListAbleType<T>>;

  constructor(data: Array<T>) {
    super(data);
    this.pushList = [];
    this.data = this.dataInit(data);
    this.type = "array";
  }

  protected dataInit(data: Array<T>): ArrayyData<T> {
    const _data = data.map((item, index) => dataFactory(item));
    // this.data = _data;
    return _data;
  }
  /**
   * 插入
   * @param index 插入位置
   * @param len 长度
   * @param data 新内容
   */
  private splice(index: number, len: number, data: anyType) {
    const newData = dataFactory(data);
    this.data.splice(index, len, newData);
    return newData;
  }
  /**
   * 截取
   * @param index 取出位置
   * @param len 长度
   */
  private difference(index: number, len: number) {
    const newData = this.data.splice(index, len);
    return newData;
  }

  /**
   * 添加时推送（for指令专用）
   * @param newData
   * @param index
   */
  addCallback(newData: DatayType<T>, index: number) {
    this.pushList.map(item => {
      item.addToList && item.addToList(newData, index);
    });
  }
  /**
   * 删除时推送
   * @param _data
   * @param index
   */
  rmCallback(_data: Arrayy<T>, index: number) {
    _data.map((item: Arrayy<any> | DataUnit<any> | Objecty<any>) => {
      (item as any).rmSelf();
    });
    this.pushList.map(item => {
      item.rmFromList && item.rmFromList(_data, index);
    });
  }

  push(tmp: anyType): Arrayy<T> {
    const newData = this.splice(this.data.length, 0, tmp);
    this.addCallback(newData, this.data.length - 1);
    return this;
  }

  pop() {
    const _data = this.difference(this.data.length, 1);
    this.data = difference(this.data, _data);
    this.data.forEach(item => {
      this.rmCallback(item as any, this.data.length);
    });
    return _data;
  }

  unshift(tmp: anyType): Arrayy<T> {
    const newData = this.splice(0, 0, tmp);
    this.addCallback(newData, 0);
    return this;
  }

  shift() {
    if (this.data.length === 0) return;
    const _data = this.difference(0, 1);
    this.data = difference(this.data, _data);
    this.rmCallback(_data[0] as any, 0);
    return _data;
  }

  insertTo(tmp: anyType, index: number) {
    const newData = this.splice(index, 0, tmp);
    this.addCallback(newData, index);
    return this;
  }

  rmFrom(index: number) {
    const _data = this.difference(index, 1);
    this.data = difference(this.data, _data);
    this.rmCallback(_data[0] as any, index);
    return _data;
  }

  map(callback: Function) {
    return this.data.map(callback as any);
  }

  getLen() {
    return this.data.length;
  }
}
