import { DataUnit, Arrayy, Objecty } from './DataUnit';

/**
 * 数据托管器
 */
class StoreKeeper {
  private store: DataUnit | Objecty | Arrayy;
  private forStore: object;
  private props: object;
  constructor(_store: DataUnit | Objecty | Arrayy, _forStore?: object, _props?: object) {
    this.store = _store;
    this.forStore = _forStore || {};
    this.props = _props || {};
  }

  /**
   * 注册推送
   * @param name 变量名
   * @param pt 引用
   * @param callback 回调
   */
  register(name: string, pt, callback?: Function) {
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
  unregister(name: string, pt, callback?: Function) {
    let found = this.findDataByType(name);
    if (found !== undefined) {
      found.rmPush && found.rmPush(pt);
      callback && callback();
    }
  }

  /**
   * 设置store
   * @param data 
   */
  setStore(data) {
    this.store = data;
  }

  /**
   * 设置props
   * @param callback 
   */
  setProps(callback: (store?: DataUnit, forStore?: Object, props?: Object, pt?: StoreKeeper) => {}) {
    console.error('setProps');
    this.props = callback(this.store, this.forStore, this.props, this);
  }
  // 只在for指令工作时使用
  /**
   * 设置forStore
   * @param callback 
   */
  setForStore(callback: (store?: DataUnit, forStore?: Object, props?: Object, pt?: StoreKeeper) => {}) {
    this.forStore = callback(this.store, this.forStore, this.props, this);
  }

  /**
   * 输出store
   */
  outputStore(): DataUnit | Objecty | Arrayy {
    return this.store;
  }

  /**
   * 输出forStore
   */
  outputForStore() {
    console.error('outputForStore');
    return this.forStore;
  }

  /**
   * 输出props
   */
  outputProps() {
    console.error('outputProps');
    return this.props;
  }

  /**
   * 输出全部
   */
  outputAll(): [DataUnit, object, object] {
    return [
      this.store,
      this.forStore,
      this.props,
    ]
  }

  /**
   * 批量获取store
   * @param params 
   */
  getValues(...params): object {
    if (this.store instanceof Objecty) {
      return this.store.getValues(...params);
    }
  }

  getMultiValue(...names: Array<string>): object {
    const answer = {};
    names.map(item => {
      answer[item.replace(/^for\.|^props\.|^state\./, '')] = this.findDataByType(item);
    });
    return answer;
  }

  /**
   * 使用name查找store，props，forStore
   * @param name 
   */
  findBaseData(name) {
    let found;
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
  rmSelf() { }

  findDataByType(name) {
    let type = name.match(/^for\.|^props\.|^state\./);
    type = type && type[0].replace(/.$/, '');
    const _name = name.replace(/^for\.|^props\.|^state\./, '');
    if (type) {
      if (type === 'for') {
        return this.forStore[_name];
      } else if (type === 'props') {
        return this.props[_name];
      } else if (type === 'state') {
        return this.store.showData(_name);
      } else {
        throw (`found an error from findDataByType, param is ${name}`);
      }
    } else {
      return this.findBaseData(_name);
    }
  }
}

export default StoreKeeper;