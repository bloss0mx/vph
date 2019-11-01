import { ARR_CONTENT, CHGED, NO_CHG } from "./interface";

type keyed = {
  [name: string]: any;
};

/**
 * 新建key map
 * @param oldArr
 * @param newArr
 */
function makeKeyMap(oldArr: any[], newArr: any[]) {
  const keyedBase: keyed = {};
  const keyedNew: keyed = {};
  oldArr.map((item, index) => {
    keyedBase[item.__ARRAY_KEY__] = {
      item,
      index,
    };
  });
  newArr.map((item, index) => {
    keyedNew[item.__ARRAY_KEY__] = {
      item,
      index,
    };
  });

  return {
    keyedBase,
    keyedNew,
  };
}

/**
 * array diff
 * @param oldArr
 * @param newArr
 */
export default function(
  _oldArr: Array<ARR_CONTENT>,
  _newArr: Array<ARR_CONTENT>,
  tool: {
    diff: Function; // 权宜之计
    path: Function;
  }
) {
  const oldArr = [..._oldArr];
  const unComparable: Array<NO_CHG> = [];
  oldArr.forEach((item, index) => {
    if (typeof item !== "object") {
      unComparable.push({
        beforeIdx: index,
        afterIdx: index,
        beforeItem: oldArr[index],
        afterItem: _newArr[index],
      });
    } else if (!item.hasOwnProperty("__ARRAY_KEY__")) {
      Object.defineProperty(item, "__ARRAY_KEY__", {
        enumerable: false,
        writable: false,
        configurable: false,
        value:
          new Date().getTime().toString(36) +
          Math.floor(Math.random() * 100000000000).toString(36),
      });
    }
  });

  const baseKey = oldArr
    .map(item => item.__ARRAY_KEY__)
    .filter(item => item !== undefined);

  const newArr = [..._newArr];
  const newKey = [];
  for (let i of newArr) {
    if (typeof i === "object" && !i.hasOwnProperty("__ARRAY_KEY__")) {
      Object.defineProperty(i, "__ARRAY_KEY__", {
        enumerable: false,
        writable: false,
        configurable: false,
        value:
          new Date().getTime().toString(36) +
          Math.floor(Math.random() * 100000000000).toString(36),
      });
    }
    newKey.push(i.__ARRAY_KEY__);
  }
  // const newKey = newArr.map(item => item.__ARRAY_KEY__);
  const keySet = new Set([...baseKey, ...newKey]);
  let nextLevel = [...oldArr];

  var { keyedBase, keyedNew } = makeKeyMap(nextLevel, newArr);
  const rm: Array<CHGED> = [];
  for (let i of keySet) {
    if (!keyedNew.hasOwnProperty(i)) {
      rm.push(keyedBase[i]);
      nextLevel.splice(keyedBase[i].index, 1);
    }
  }

  var { keyedBase, keyedNew } = makeKeyMap(oldArr, newArr);
  const add: Array<CHGED> = [];
  for (let i of keySet) {
    if (!keyedBase.hasOwnProperty(i)) {
      add.push(keyedNew[i]);
      nextLevel.splice(keyedNew[i].index, 0, {
        __ARRAY_KEY__: i,
        item: keyedNew[i].item,
      });
    }
  }

  var { keyedBase, keyedNew } = makeKeyMap(nextLevel, newArr);
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

  var { keyedBase, keyedNew } = makeKeyMap(oldArr, newArr);
  const exist: Array<NO_CHG> = [];
  for (let i of keySet) {
    if (keyedBase.hasOwnProperty(i) && keyedNew.hasOwnProperty(i)) {
      exist.push({
        beforeIdx: keyedBase[i].index,
        afterIdx: keyedNew[i].index,
        beforeItem: keyedBase[i].item,
        afterItem: keyedNew[i].item,
      });
    }
  }

  const chg: Array<NO_CHG> = [];
  const _rm: Array<CHGED> = [];
  const _add: Array<CHGED> = [];
  for (let i = 0; i < Math.max(rm.length, add.length); i++) {
    if (rm[i] && add[i] && add[i].index === rm[i].index) {
      chg.push({
        beforeIdx: rm[i].index,
        afterIdx: add[i].index,
        beforeItem: rm[i].item,
        afterItem: add[i].item,
      });
    } else {
      if (rm[i]) _rm.push(rm[i]);
      if (add[i]) _add.push(add[i]);
    }
  }
  return {
    add: _add,
    rm: _rm,
    mv,
    exist,
    chg: [...chg, ...unComparable],
  };
}
