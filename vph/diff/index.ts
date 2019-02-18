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
    console.log(oldStore, newStore);
    this.diff(oldStore, newStore, oldPath, newPath);
    console.timeEnd('diff');
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

  objectOpt(oldStore, newStore, oldPath, newPath) {
    const {
      add,
      rm,
      update
    } = objectDiff(oldStore, newStore);
    const target = this.storeKeeper.getValues(oldPath)[oldPath];
    for (let i in add) {
      target.add(add[i].name, add[i].item);
    }
    for (let i in rm) {
      target.delete(rm[i]);
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
    for (let i in add) {
      // target.splice(add[i].index, 0, add[i].item);
      console.log('insert', target, oldPath);
      target.splice(add[i].item, add[i].index);
    }
    for (let i in rm) {
      target.splice(rm[i].index, 1);
    }
    for (let i in mv) {
      const tmp = target.splice(mv[i].beforeIdx, 1);
      target.splice(parseInt(<string>(mv[i].afterIdx)) + 1, 0, tmp[0]);
    }
    console.error(add, rm, mv, exist, target, this.storeKeeper);
    console.warn(oldStore, newStore);

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