const oldObj = {
  a: 'a',
  b: 'b',
  c: 'c',
  e: 'e',
}
const newObj = {
  a: 'a',
  b: 'b',
  d: 'd',
  e: 'ee',
}

export default function rkeys(oldObj, newObj) {
  // console.log(oldObj, newObj);
  const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const add = [];
  const rm = [];
  const update = [];
  for (let i of keys) {
    if (!oldObj.hasOwnProperty(i)) {
      add.push({ name: i, item: newObj[i] });
    } else if (!newObj.hasOwnProperty(i)) {
      rm.push(i);
    } else if (oldObj[i] !== newObj[i]) {
      update.push(i);
    } else {
      //			console.log(i);
    }
  }

  return {
    add,
    rm,
    update
  };
}

// console.log(rkeys(oldObj, newObj));