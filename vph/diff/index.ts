import arrayDiff from './arrayDiff';
import objectDiff from './objectDiff';

import { Objecty, Arrayy, DataUnit, dataFactory, toJS } from '../DataUnit';
import StoreKeeper from '../store';
import { ARR_CONTENT } from './interface';

export default class Diff {
  private store;
  private storeKeeper;
  constructor(store, storeKeeper?: StoreKeeper) {
    this.store = store || {};
    this.storeKeeper = storeKeeper;
  }

  /**
   * 设置state
   * @param callback 
   */
  setState(callback: Function) {
    const oldStore = this.store;
    const newStore = callback(Object.assign({}, this.store));
    if (newStore === undefined) {
      console.error(`setState must return a value, got ${newStore}`);
    }
    this.store = newStore;
    const oldPath = '';
    const newPath = '';
    console.time('diff');
    this.diff(oldStore, newStore, oldPath, newPath);
    console.timeEnd('diff');
  }

  /**
   * diff
   * @param oldStore 
   * @param newStore 
   * @param oldPath 
   * @param newPath 
   */
  diff(
    oldStore,
    newStore,
    oldPath: string,
    newPath: string
  ) {
    const oldProto = Object.getPrototypeOf(oldStore);
    const newProto = Object.getPrototypeOf(newStore);
    if (oldProto !== newProto) { } else {
      switch (oldProto) {
        case Object.getPrototypeOf({}):
          this.objectOpt(oldStore, newStore, oldPath, newPath);
          break;
        case Object.getPrototypeOf([]):
          this.arrayOpt(oldStore, newStore, oldPath, newPath);
          break;
        default:
          this.baseOpt(oldStore, newStore, oldPath, newPath);
          break;
      }
    }
  }

  /**
   * 取上一层store
   * @param path 
   */
  objectFetcher(path: string) {
    if (path === undefined || path.length === 0) {
      return this.storeKeeper.store;
    } else if (path.match(/./g).length === 0) {
      return this.storeKeeper.store;
    } else {
      const _pathArr = path.split('.');
      const name = _pathArr.pop();
      const _path = _pathArr.join();
      return this.storeKeeper.getValues(_path)[_path];
    }
  }

  /**
   * object处理
   * @param oldStore 
   * @param newStore 
   * @param oldPath 
   * @param newPath 
   */
  objectOpt(
    oldStore: object,
    newStore: object,
    oldPath: string,
    newPath: string
  ) {
    const {
      add,
      rm,
      update
    } = objectDiff(oldStore, newStore);
    const addTarget = this.storeKeeper.getValues(oldPath)[oldPath];
    const mvTarget = this.objectFetcher(oldPath);
    for (let i in add) {
      addTarget.add(add[i].name, add[i].item);
    }
    for (let i in rm) {
      mvTarget.delete(rm[i]);
      // mvTarget[rm[i]].rmSelf();
    }

    update.map(item => {
      this.diff(oldStore[item], newStore[item], ...this.path(oldPath, newPath, item, item));
    });
  }

  /**
   * 数组处理
   * @param oldStore 
   * @param newStore 
   * @param oldPath 
   * @param newPath 
   */
  arrayOpt(
    oldStore: Array<ARR_CONTENT>,
    newStore: Array<ARR_CONTENT>,
    oldPath: string,
    newPath: string
  ) {
    const {
      add,
      rm,
      mv,
      exist
    } = arrayDiff(oldStore, newStore);
    const target = this.storeKeeper.getValues(oldPath)[oldPath];
    for (let i = 0; i < add.length; i++) {
      target.insertTo(add[i].item, parseInt(<string>(add[i].index)));
    }
    for (let i = 0; i < rm.length; i++) {
      target.rmFrom(parseInt(<string>(rm[i].index)) - i);
    }
    for (let i in mv) {
      const tmp = target.rmFrom(mv[i].beforeIdx);
      target.insertTo(parseInt(<string>(mv[i].afterIdx)) + 1, tmp[0]);
    }

    exist.map(item => {
      this.diff(item.beforeItem, item.afterItem, ...this.path(oldPath, newPath, item.beforeIdx, item.afterIdx));
    });
  }

  /**
   * 基本类型处理
   * @param oldStore 
   * @param newStore 
   * @param oldPath 
   * @param newPath 
   */
  baseOpt(
    oldStore: DataUnit,
    newStore: DataUnit,
    oldPath: string,
    newPath: string
  ) {
    const target = this.storeKeeper.getValues(oldPath)[oldPath];
    target.setData(newStore);
  }

  /**
   * 获取路径
   * @param oldPath 
   * @param newPath 
   * @param beforeIdx 
   * @param afterIdx 
   */
  path(
    oldPath: string | number,
    newPath: string | number,
    beforeIdx: string | number,
    afterIdx: string | number
  ): [string, string] {
    let _oldPath = '',
      _newPath = '';
    if (oldPath === '') {
      _oldPath = oldPath + beforeIdx;
    } else {
      _oldPath = oldPath + '.' + beforeIdx;
    }
    if (newPath === '') {
      _newPath = newPath + afterIdx;
    } else {
      _newPath = newPath + '.' + afterIdx;
    }
    return [
      _oldPath,
      _newPath
    ];
  }
}