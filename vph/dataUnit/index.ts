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

type DataFactory_<T> = {
  [P in keyof T]: T[P] extends Array<any>
    ? Arrayy<T[P]>
    : T[P] extends Object
    ? Objecty<T[P]>
    : DataUnit<T[P]>;
}[keyof T];

// type dataFactory = (
//   obj: anyType
// ) => {
//   [key in keyof typeof obj]: S<typeof obj[key]>;
// };

type DataFactory = (obj: any) => DataFactory_<typeof obj>;

/**
 * 转换为DataUnit对象
 * @param data
 */
export const dataFactory: DataFactory = (data: any) => {
  const type = testType(data);
  if (type === "array") {
    return new Arrayy(data);
  } else if (type === "object") {
    return new Objecty(data);
  } else {
    const _data = new DataUnit(data);
    return _data;
  }
};

type ToJS_<T> = {
  [P in keyof T]: T[P] extends Arrayy<any>
    ? Array<T[P]>
    : T[P] extends Objecty<any>
    ? Object
    : any;
}[keyof T];

type ToJS = (
  obj: anyType
) => {
  [key in keyof typeof obj]: ToJS_<typeof obj[key]>;
};

/**
 * 转换为js对象
 * @param pt
 */
export const toJS: ToJS = <T>(
  pt: DataUnit<T> | Array<DataUnit<T>> | anyType
) => {
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
};
