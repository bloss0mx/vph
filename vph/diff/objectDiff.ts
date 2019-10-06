import {} from "../DataUnit";
import { anyType } from "../dataUnit/dataUnit";

interface chged {
  name: number | string;
  item: any;
}

/**
 * object diff
 * @param oldObj
 * @param newObj
 */
export default function(
  oldObj: anyType,
  newObj: anyType
): {
  add: Array<chged>;
  rm: Array<string | number>;
  update: Array<string | number>;
} {
  const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const add: Array<chged> = [];
  const rm: Array<string | number> = [];
  const update: Array<string | number> = [];
  for (let i of keys) {
    if (!oldObj.hasOwnProperty(i)) {
      add.push({ name: i, item: newObj[i] });
    } else if (!newObj.hasOwnProperty(i)) {
      rm.push(i);
    } else if (oldObj[i] !== newObj[i]) {
      update.push(i);
    }
  }

  return {
    add,
    rm,
    update,
  };
}
