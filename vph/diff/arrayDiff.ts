const arr = [{
  key: 1,
  item: 1
},
{
  key: 2,
  item: 2
},
{
  key: 3,
  item: 3
},
{
  key: 4,
  item: 4
},
{
  key: 5,
  item: 5
},
{
  key: 6,
  item: 6
},
{
  key: 7,
  item: 7
},
];

const newArr = [{
  key: 1,
  item: 1
},
{
  key: 2,
  item: 2
},
{
  key: 0,
  item: 0
},
{
  key: 4,
  item: 4
},
{
  key: 5,
  item: 8
},
// { key: 7, item: 7 },
{
  key: 6,
  item: 6
},
{
  key: 3,
  item: 3
},
];

// const {
//   rm,
//   add,
//   mv,
//   exist
// } = diffArr(arr, newArr);
// const target = [...arr];
// for (let i in add) {
//   target.splice(add[i].index, 0, {
//     key: i,
//     item: add[i].item
//   });
// }
// for (let i in rm) {
//   target.splice(rm[i].index, 1);
// }
// for (let i in mv) {
//   const tmp = target.splice(mv[i].beforeIdx, 1);
//   target.splice(mv[i].afterIdx + 1, 0, tmp[0]);
// }

interface ArrContent {
  key: number | string;
  item?: any;
}

function makeKeyMap(oldArr, newArr) {
  // const baseKey = oldArr.map(item => item.key);
  // const newKey = newArr.map(item => item.key);
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
  // let keyedBase, keyedNew;
  const baseKey = oldArr.map(item => item.key);
  const newKey = newArr.map(item => item.key);
  const keySet = new Set([...baseKey, ...newKey]);

  let nextLevel = [...oldArr];
  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(oldArr, newArr);
  // const add = {};
  const add: Array<chged> = [];
  for (let i of keySet) {
    if (!keyedBase.hasOwnProperty(i)) {
      // add[i] = keyedNew[i];
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
  // const rm = {};
  const rm: Array<chged> = [];
  for (let i of keySet) {
    if (!keyedNew.hasOwnProperty(i)) {
      // rm[i] = keyedBase[i];
      rm.push(keyedBase[i]);
      nextLevel.splice(keyedBase[i].index, 1);
    }
  }

  var {
    keyedBase,
    keyedNew
  } = makeKeyMap(nextLevel, newArr);
  // const mv = {};
  const mv: Array<noChg> = [];
  for (let i in keySet) {
    if (keyedBase[i].index != keyedNew[i].index) {
      mv.push({
        beforeIdx: keyedBase[i].index,
        afterIdx: keyedNew[i].index,
        beforeItem: keyedBase[i].item,
        afterItem: keyedNew[i].item,
      });
      // mv[i] = {
      //   beforeIdx: keyedBase[i].index,
      //   afterIdx: keyedNew[i].index,
      //   beforeItem: keyedBase[i].item,
      //   afterItem: keyedNew[i].item,
      // }
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

// console.log(diffArr(arr, newArr));