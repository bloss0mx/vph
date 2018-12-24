import { DataUnit, Arrayy, Objecty } from './DataUnit';

class StoreKeeper {
  private store: DataUnit;
  private forStore: object;
  private props: object;
  constructor(_store: DataUnit, _forStore?: object, _props?: object) {
    this.store = _store;
    this.forStore = _forStore || {};
    this.props = _props || {};
  }

  register(name: string, pt, callback?: Function) {
    // console.log(name);
    let found;
    if (this.forStore[name] !== undefined) {
      found = this.forStore[name];
    } else if (this.props[name] !== undefined) {
      found = this.props[name];
    } else {
      found = this.store.outputData(name);
    }
    if (found !== undefined) {
      found.addPush(pt);
      callback && callback.apply(pt);
    }
  }
  unregister(name: string, pt, callback?: Function) {
    let found;
    if (this.forStore[name] !== undefined) {
      found = this.forStore[name];
    } else if (this.props[name] !== undefined) {
      found = this.props[name];
    } else {
      found = this.store.outputData(name);
    }
    if (found !== undefined) {
      found.rmPush && found.rmPush(pt);
      callback && callback();
    }
  }

  setProps(callback) {
    this.props = callback(this.store, this.forStore, this.props);
  }
  setForStore(callback) {
    this.forStore = callback(this.store, this.forStore, this.props);
  }
  outputStore() {
    return this.store;
  }
  outputForStore() {
    return this.forStore;
  }
  outputProps() {
    return this.props;
  }
  outputAll(): object {
    return [
      this.store,
      this.forStore,
      this.props,
    ]
  }
  outputForData(baseDataName) {
    let found;
    if (this.forStore[baseDataName] !== undefined) {
      found = this.forStore[baseDataName];
    } else if (this.props[baseDataName] !== undefined) {
      found = this.props[baseDataName];
    } else {
      found = this.store.outputData(baseDataName);
    }
    return found;
  }
  rmSelf() { }
}

export default StoreKeeper;