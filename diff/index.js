import arrayDiff from './arrayDiff';
import objectDiff from './objectDiff';

export default class State {
  constructor(store) {
    this.store = store || {};
  }

  setState(callback) {
    const oldStore = this.store;
    const newStore = callback(Object.assign({}, this.store));
    this.store = newStore;

    diff(oldStore, newStore);
  }
}

function diff(oldStore, newStore, oldPath, newPath) {
  // console.warn(objectDiff(oldStore, newStore));
  console.log(oldStore, newStore);
  const oldProto = oldStore.__proto__;
  const newProto = newStore.__proto__;
  if (oldProto !== newProto) {} else {
    switch (oldProto) {
      case ({}).__proto__:
        objectOpt(oldStore, newStore)
        break;
      case ([]).__proto__:
        arrayOpt(oldStore, newStore);
        break;
      default:
        baseOpt(oldStore, newStore);
        break;
    }
  }
}

function objectOpt(oldStore, newStore) {
  const {
    add,
    rm,
    update
  } = objectDiff(oldStore, newStore);

  update.map(item => {
    diff(oldStore[item], newStore[item]);
  });
}

function arrayOpt(oldStore, newStore) {
  const {
    add,
    rm,
    mv,
    exist
  } = arrayDiff(oldStore, newStore);

  exist.map(item => {
    diff(item.beforeItem, item.afterItem);
  });
}

function baseOpt(oldStore, newStore) {

}