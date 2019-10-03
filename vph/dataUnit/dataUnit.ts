import { testType } from "../utils";
// import { difference, uniq } from 'lodash';
import difference from "lodash/difference";
import uniq from "lodash/uniq";
import { ARRAYY_OPERATE } from "../constant";
import { forDirective } from "../directive/index";
import { BaseObj } from "../domObj";
import Objecty from "./objecty";
import Arrayy from "./arrayy";

export default class DataUnit {
  protected data: any;
  protected pushList: Array<BaseObj | any>;
  protected type: String;

  constructor(data: any) {
    this.data = data;
    this.pushList = [];
    this.type = testType(data);

    // this.dataInit(data);
  }

  // /**
  //  * 异步
  //  * @param data
  //  */
  // protected dataInit(data) {
  //   // 数组和对象不进行数值初始化
  //   if (this.type === 'array' || this.type === 'object') {
  //   } else {
  //     setTimeout(() => {
  //       this.pushList && this.pushList.map((item, index) => {
  //         this.data = data;
  //         item.run && item.run(data, this.type, index, ARRAYY_OPERATE['add']);
  //       });
  //     }, 0);
  //   }
  // }

  /**
   * 增加依赖
   * @param pushOrigin
   */
  addPush(pushOrigin) {
    this.pushList.push(pushOrigin);
    this.pushList = uniq(this.pushList);
    setTimeout(() => {
      pushOrigin.run && pushOrigin.run(this.data);
    }, 0);
  }

  /**
   * 删除依赖
   * @param pushOrigin
   */
  rmPush(pushOrigin) {
    this.pushList = difference(this.pushList, [pushOrigin]);
  }

  /**
   * 输出值
   * @param index
   */
  showData(index?: string): DataUnit | any {
    //深度取值
    if (index && testType(index) === "string" && index.split(".").length > 1) {
      return [this.data, ...index.split(".")].reduce((t, i) => {
        return t.showData ? t.showData(i) : t[i];
      });
    }
    //数组，无参数 => 取全部
    if ((index === undefined || index === "") && this.type === "array") {
      return this.data.map(item => {
        return item;
      });
    }
    //对象，无参数 => 取全部
    if ((index === undefined || index === "") && this.type === "object") {
      let _data = {};
      for (let i in this.data) {
        _data[i] = this.data[i];
      }
      return _data;
    }
    //有参数，数组或对象 => 取全部
    if (
      index !== undefined &&
      index !== "" &&
      (this.type === "array" || this.type === "object")
    ) {
      return this.data[index];
    }
    //非数组或对象 => 取基本值
    if (this.type !== "array" && this.type !== "object") {
      return this.data;
    }
  }

  /**
   * 设置值
   * @param data
   * @param name
   */
  setData(data, name?: string): DataUnit {
    let isChanged = "";

    if (this.type === "object" && name !== undefined) {
      this.showData(name).setData(data);
    } else if (this.type === "array" && name !== undefined) {
      this.showData(name).setData(data);
    } else if (
      (this.type === "object" || this.type === "array") &&
      name === undefined
    ) {
    } else {
      this.type = testType(data);
      this.data = data;
      isChanged = ARRAYY_OPERATE["set"];
    }

    //修改以后，推送值
    if (isChanged !== "") {
      this.pushList.map((item, index) => {
        item.run &&
          item.run(this.data, this.type, index, ARRAYY_OPERATE["set"]);
      });
    }
    return this;
  }

  /**
   * 析构函数😜
   */
  rmSelf() {
    for (let i in this) {
      this[i] = null;
    }
  }
}
