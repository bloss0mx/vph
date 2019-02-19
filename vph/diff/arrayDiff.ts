
interface ArrContent {
  key: number | string;
  item?: any;
}

function makeKeyMap(oldArr, newArr) {
  const keyedBase = {};
  const keyedNew = {};
  oldArr.map((item, index) => {
    keyedBase[item.key] = {
      item,
      index
    };
  });
  newArr.map((item, index) => {
    keyedNew[item.key] = {
      item,
      index
    };
  });

  return {
    keyedBase,
    keyedNew
  };
}

interface chged {
  index: number | string;
  item: any;
}
interface noChg {
  beforeIdx: number | string;
  afterIdx: number | string;
  beforeItem: any;
  afterItem: any;
}
export default function diffArr(oldArr: Array<ArrContent>, newArr: Array<ArrContent>) {
  const baseKey = oldArr.map(item => item.key);
  const newKey = newArr.map(item => item.key);
  const keySet = new Set([...baseKey, ...newKey]);

  let nextLevel = [...oldArr];
  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(oldArr, newArr);
  const add: Array<chged> = [];
  for (let i of keySet) {
    if (!keyedBase.hasOwnProperty(i)) {
      add.push(keyedNew[i]);
      nextLevel.splice(keyedNew[i].index, 0, {
        key: i,
        item: keyedNew[i].item
      });
    }
  }

  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(nextLevel, newArr);
  const rm: Array<chged> = [];
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
  const mv: Array<noChg> = [];
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
  const exist: Array<noChg> = [];
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