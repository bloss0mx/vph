import { testType } from "../utils";
// import { difference, uniq } from 'lodash';
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { ARRAYY_OPERATE } from "../constant";
import { forDirective } from "../directive/index";
import { BaseObj } from "../domObj";
import Objecty from "./objecty";
import Arrayy from "./arrayy";
import DataUnit from "./dataUnit";

export { Objecty, Arrayy, DataUnit };

/**
 * 转换为DataUnit对象
 * @param data
 */
export function dataFactory(data) {
  const type = testType(data);
  if (type === "array") {
    return new Arrayy(data);
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
export function toJS(pt: DataUnit | Array<DataUnit>): object {
  if (Object.getPrototypeOf(pt).constructor === Objecty) {
    const _pt = (<DataUnit>pt).showData();
    const data = {};
    for (let i in _pt) {
      data[i] = toJS(_pt[i]);
    }
    return data;
  } else if (Object.getPrototypeOf(pt).constructor === Arrayy) {
    const _pt = (<DataUnit>pt).showData();
    const data = [];
    _pt.map(item => {
      data.push(toJS(item));
    });
    return data;
  } else if (Object.getPrototypeOf(pt).constructor === DataUnit) {
    const _pt = (<DataUnit>pt).showData();
    return _pt;
  } else if (Object.getPrototypeOf(pt).constructor === Object) {
    const data = {};
    for (let i in pt) {
      data[i] = toJS(pt[i]);
    }
    return data;
  } else if (Object.getPrototypeOf(pt).constructor === Array) {
    const data = [];
    (<Array<DataUnit>>pt).map(item => {
      data.push(item);
    });
    return data;
  } else {
    console.warn(pt);
  }
}
