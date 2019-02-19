import arrayDiff from './arrayDiff';
import objectDiff from './objectDiff';

import { Objecty, Arrayy, DataUnit, dataFactory, toJS } from '../DataUnit';
import StoreKeeper from '../store';

export default class Diff {
  private store;
  private storeKeeper;
  constructor(store, storeKeeper?: StoreKeeper) {
    this.store = store || {};
    this.storeKeeper = storeKeeper;
  }

  setState(callback) {
    const oldStore = this.store;
    const newStore = callback(Object.assign({}, this.store));
    if (newStore === undefined) {
      console.error(`setState must return a value, got ${newStore}`);
    }
    this.store = newStore;
    // const oldPath = 'store@';
    // const newPath = 'store@';
    const oldPath = '';
    const newPath = '';
    console.time('diff');
    this.diff(oldStore, newStore, oldPath, newPath);
    console.timeEnd('diff');
    // console.log(oldStore, newStore);
  }


  diff(oldStore, newStore, oldPath, newPath) {
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

  objectFetcher(path) {
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

  objectOpt(oldStore, newStore, oldPath, newPath) {
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

  arrayOpt(oldStore, newStore, oldPath, newPath) {
    const {
      add,
      rm,
      mv,
      exist
    } = arrayDiff(oldStore, newStore);
    const target = this.storeKeeper.getValues(oldPath)[oldPath];
    for (let i = 0; i < add.length; i++) {
      // target.splice(add[i].index, 0, add[i].item);
      // console.log('insert', target, oldPath);
      target.insertTo(add[i].item, parseInt(<string>(add[i].index)));
    }
    for (let i = 0; i < rm.length; i++) {
      // target.splice(rm[i].index, 1);
      target.rmFrom(parseInt(<string>(rm[i].index)) - i);
    }
    for (let i in mv) {
      const tmp = target.rmFrom(mv[i].beforeIdx);
      target.insertTo(parseInt(<string>(mv[i].afterIdx)) + 1, tmp[0]);
      // const tmp = target.splice(mv[i].beforeIdx, 1);
      // target.splice(parseInt(<string>(mv[i].afterIdx)) + 1, 0, tmp[0]);
    }
    // console.error(add, rm, mv, exist, target, this.storeKeeper);
    // console.warn(oldStore, newStore);

    exist.map(item => {
      this.diff(item.beforeItem, item.afterItem, ...this.path(oldPath, newPath, item.beforeIdx, item.afterIdx));
    });
  }

  baseOpt(oldStore, newStore, oldPath, newPath) {
    const target = this.storeKeeper.getValues(oldPath)[oldPath];
    target.setData(newStore);
  }

  path(oldPath, newPath, beforeIdx, afterIdx): [string, string] {
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