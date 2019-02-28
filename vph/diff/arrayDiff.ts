import { ARR_CONTENT, CHGED, NO_CHG } from './interface';

/**
 * 新建key map
 * @param oldArr 
 * @param newArr 
 */
function makeKeyMap(oldArr, newArr) {
  const keyedBase = {};
  const keyedNew = {};
  oldArr.map((item, index) => {
    keyedBase[item.__ARRAY_KEY__] = {
      item,
      index
    };
  });
  newArr.map((item, index) => {
    keyedNew[item.__ARRAY_KEY__] = {
      item,
      index
    };
  });

  return {
    keyedBase,
    keyedNew
  };
}

/**
 * array diff
 * @param oldArr 
 * @param newArr 
 */
export default function (oldArr: Array<ARR_CONTENT>, _newArr: Array<ARR_CONTENT>) {
  const baseKey = oldArr.map(item => item.__ARRAY_KEY__).filter(item => item !== undefined);
  const newArr = [..._newArr];
  const newKey = [];
  for (let i of newArr) {
    if (!i.hasOwnProperty('__ARRAY_KEY__')) {
      Object.defineProperty(i, "__ARRAY_KEY__", {
        enumerable: false,
        writable: false,
        configurable: false,
        value: (new Date).getTime().toString(36) + (Math.floor(Math.random() * 10000000000000000)).toString(36)
      });
    }
    newKey.push(i.__ARRAY_KEY__);
  }
  // const newKey = newArr.map(item => item.__ARRAY_KEY__);
  const keySet = new Set([...baseKey, ...newKey]);

  let nextLevel = [...oldArr];
  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(oldArr, newArr);
  const add: Array<CHGED> = [];
  for (let i of keySet) {
    if (!keyedBase.hasOwnProperty(i)) {
      add.push(keyedNew[i]);
      nextLevel.splice(keyedNew[i].index, 0, {
        __ARRAY_KEY__: i,
        item: keyedNew[i].item
      });
    }
  }

  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(nextLevel, newArr);
  const rm: Array<CHGED> = [];
  for (let i of keySet) {
    if (!keyedNew.hasOwnProperty(i)) {
      rm.push(keyedBase[i]);
      nextLevel.splice(keyedBase[i].index, 1);
    }
  }

  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(nextLevel, newArr);
  const mv: Array<NO_CHG> = [];
  for (let i in keySet) {
    if (keyedBase[i].index != keyedNew[i].index) {
      mv.push({
        beforeIdx: keyedBase[i].index,
        afterIdx: keyedNew[i].index,
        beforeItem: keyedBase[i].item,
        afterItem: keyedNew[i].item,
      });
    }
  }

  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(oldArr, newArr);
  const exist: Array<NO_CHG> = [];
  for (let i of keySet) {
    if (keyedBase.hasOwnProperty(i) &&
      keyedNew.hasOwnProperty(i)) {
      exist.push({
        beforeIdx: keyedBase[i].index,
        afterIdx: keyedNew[i].index,
        beforeItem: keyedBase[i].item,
        afterItem: keyedNew[i].item,
      });
    }
  }

  return {
    add,
    rm,
    mv,
    exist
  }
}