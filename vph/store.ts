import { DataUnit, Arrayy, Objecty, dataFactory, toJS } from "./dataUnit";
import { anyType } from "./dataUnit/dataUnit";
import Diff from "./diff/index";

interface forStore {
  [name: string]: any;
}

interface props {
  [name: string]: any;
}

/**
 * 数据托管器
 */
class StoreKeeper<T extends anyType> {
  private diff: Diff<T>;
  store: DataUnit<T> | Arrayy<T> | Objecty<T>;
  private forStore: forStore;
  private props: props;
  constructor(
    _store: DataUnit<T> | Arrayy<T> | Objecty<T>,
    _forStore?: object,
    _props?: object
  ) {
    this.store = _store;
    this.forStore = _forStore || {};
    this.props = _props || {};

    this.diff = new Diff(toJS(_store), this as any) as any;
  }

  /**
   * 注册推送
   * @param name 变量名
   * @param pt 引用
   * @param callback 回调
   */
  register(name: string, pt: any, callback?: Function) {
    let found = this.findDataByType(name);
    if (found !== undefined) {
      found.addPush(pt);
      callback && callback.apply(pt);
    }
  }
  /**
   * 清除推送
   * @param name
   * @param pt
   * @param callback
   */
  unregister(name: string, pt: any, callback?: Function) {
    let found = this.findDataByType(name);
    if (found !== undefined && found !== null) {
      found.rmPush && found.rmPush(pt);
      callback && callback();
    }
  }

  /**
   * 设置store
   * @param data
   */
  setStore(data: any) {
    this.store = data;
  }

  /**
   * 设置props
   * @param callback
   */
  setProps(
    callback: (
      store?: DataUnit<T> | Arrayy<T> | Objecty<T>,
      forStore?: Object,
      props?: Object,
      pt?: StoreKeeper<T>
    ) => {}
  ) {
    console.error("setProps");
    this.props = callback(this.store, this.forStore, this.props, this);
  }
  // 只在for指令工作时使用
  /**
   * 设置forStore
   * @param callback
   */
  setForStore(
    callback: (
      store?: DataUnit<T> | Arrayy<T> | Objecty<T>,
      forStore?: Object,
      props?: Object,
      pt?: StoreKeeper<T>
    ) => {}
  ) {
    this.forStore = callback(this.store, this.forStore, this.props, this);
  }

  /**
   * 输出store
   */
  outputStore(): DataUnit<T> | Objecty<T> | Arrayy<T> {
    return this.store;
  }

  /**
   * 输出forStore
   */
  outputForStore() {
    console.error("outputForStore");
    return this.forStore;
  }

  /**
   * 输出props
   */
  outputProps() {
    console.error("outputProps");
    return this.props;
  }

  /**
   * 输出全部
   */
  outputAll(): [DataUnit<T> | Arrayy<T> | Objecty<T>, forStore, props] {
    return [this.store, this.forStore, this.props];
  }

  /**
   * 批量获取store
   * @param params
   */
  getValues(...params: string[]): object {
    if (this.store instanceof Objecty) {
      return this.store.getValues(...params);
    }
  }

  getMultiValue(...names: string[]): object {
    const answer: any = {};
    names.map(item => {
      answer[item.replace(/^for@|^props@|^state@/, "")] = this.findDataByType(
        item
      );
    });
    return answer;
  }

  /**
   * 使用name查找store，props，forStore
   * @param name
   */
  findBaseData(name: string): DataUnit<T> {
    let found: DataUnit<T>;
    if (name.match(/\./g)) {
      const [first, ...other] = name.split(".");
      if (this.forStore[first] !== undefined) {
        return this.forStore[first].showData(other);
      }
      if (this.props[first] !== undefined) {
        return this.props[first].showData(other);
      }
    }
    if (this.forStore[name] !== undefined) {
      found = this.forStore[name];
    } else if (this.props[name] !== undefined) {
      found = this.props[name];
    } else {
      found = this.store.showData(name);
    }
    return found;
  }

  /**
   * 析构函数
   */
  rmSelf() {}

  /**
   * 使用带type的name查找
   * name = store@name | props@name | for@name | name
   * @param name
   */
  findDataByType(name: string): DataUnit<T> | any {
    const _type = name.match(/^for@|^props@|^state@/);
    const type = _type && _type[0].replace(/@/, "");
    const _name = name.replace(/^for@|^props@|^state@/, "");
    if (type) {
      if (type === "for") {
        return <DataUnit<T>>this.forStore[_name];
      } else if (type === "props") {
        return <DataUnit<T>>this.props[_name];
      } else if (type === "state") {
        return this.store.showData(_name);
      } else {
        throw `found an error from findDataByType, param is ${name}`;
      }
    } else {
      return this.findBaseData(_name);
    }
  }

  setState(callback: (stat: T) => T) {
    this.diff.setState(callback as any);
  }
}

export default StoreKeeper;
