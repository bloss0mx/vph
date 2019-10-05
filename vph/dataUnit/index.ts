import { testType } from "../utils";
// import { difference, uniq } from 'lodash';
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { ARRAYY_OPERATE } from "../constant";
import { forDirective } from "../directive/index";
import { BaseObj } from "../domObj";
import Objecty from "./objecty";
import Arrayy from "./arrayy";
import DataUnit, { anyType } from "./dataUnit";

export { Objecty, Arrayy, DataUnit };

/**
 * 转换为DataUnit对象
 * @param data
 */
export function dataFactory<T>(data: T): DataUnit<T> {
  const type = testType(data);
  if (type === "array") {
    return new Arrayy(data as any) as any;
  } else if (type === "object") {
    return new Objecty(data);
  } else {
    const _data = new DataUnit(data);
    return _data;
  }
}

/**
 * 转换为js对象
 * @param pt
 */
export function toJS<T>(
  pt: DataUnit<T> | Array<DataUnit<T>> | anyType
): object {
  if (Object.getPrototypeOf(pt).constructor === Objecty) {
    const _pt = (<DataUnit<T>>pt).showData();
    const data: anyType = {};
    for (let i in _pt) {
      data[i] = toJS(_pt[i]);
    }
    return data;
  } else if (Object.getPrototypeOf(pt).constructor === Arrayy) {
    const _pt: any[] = (<DataUnit<T>>pt).showData();
    const data: anyType = [];
    _pt.map(item => {
      data.push(toJS(item));
    });
    return data;
  } else if (Object.getPrototypeOf(pt).constructor === DataUnit) {
    const _pt = (<DataUnit<T>>pt).showData();
    return _pt;
  } else if (Object.getPrototypeOf(pt).constructor === Object) {
    const data: anyType = {};
    for (let i in pt) {
      data[i] = toJS((pt as anyType)[i]);
    }
    return data;
  } else if (Object.getPrototypeOf(pt).constructor === Array) {
    const data: anyType = [];
    (<Array<DataUnit<T>>>pt).map(item => {
      data.push(item);
    });
    return data;
  } else {
    console.warn(pt);
  }
}
