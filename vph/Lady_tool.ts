import VirtualDom from "./vdom";
import moment, { max } from "moment";

interface Window {
  expose?: any;
  fetchFromWindow?: any;
  overflowChecker?: any;
}

declare var window: Window;

const exposeToWindow = (name: string, pt: any) => {
  if (!window.expose) {
    window.expose = {};
  }
  window.expose[name] = pt;
};

const fetchFromWindow = (name: string) => {
  if (!window.expose) {
    throw 'Didn\'t expose any param yet!';
  }
  if (name === undefined) {
    return window.expose;
  }
  if (window.expose[name] === undefined) {
  }
  return window.expose[name];
};

window.fetchFromWindow = fetchFromWindow;

const overflowChecker = <T>(
  pt: VirtualDom<T>,
  maxSize: number = 100,
  env: "prod" | "dev" = "dev"
) =>
  setInterval(() => {
    const checked: any[] = [];
    const recursionCheckOverflow = (current: any, path: string = "") => {
      if (typeof current === "object") {
        checked.push(current);
        const keys = Object.keys(current);
        if (keys.length > maxSize) {
          console.warn(
            `warn at "${"origin" + path}", object length is ${keys.length}`,
            current
          );
        } else if (keys.length > 0) {
          keys.forEach(item => {
            if (
              typeof current[item] === "object" &&
              current[item] !== null &&
              current[item] != undefined &&
              checked.findIndex(i => i === current[item]) === -1
              // (path + "." + item).length < 20
            ) {
              recursionCheckOverflow(current[item], path + "." + item);
            }
          });
        }
      }
    };

    recursionCheckOverflow(pt);
    console.log("overflowChecker", moment().format("YYYY-MM-DD HH:mm:ss"));
  }, 2000);

const overflowCheckerQ = <T>(
  pt: VirtualDom<T>,
  maxSize: number = 100,
  env: "prod" | "dev" = "dev"
) =>
  setInterval(() => {
    const checked = [];
    const checkStack = [{ path: "origin", current: pt }];
    let count = 0;
    let maxLen = 0;
    do {
      const { path, current } = checkStack.pop();

      // 可循环
      if (
        typeof current === "object" &&
        current !== null &&
        current != undefined &&
        checked.findIndex(i => i === current) === -1
      ) {
        const keys = Object.keys(current).filter(item => item !== "father");
        if (keys.length > maxLen) maxLen = keys.length;
        if (keys.length > maxSize) {
          console.warn(
            `warn at "${path}", object length is ${keys.length}`,
            current
          );
        } else if (keys.length > 0) {
          checked.push(current);

          const data = keys.map(item => ({
            path: path + "." + item,
            current: (current as any)[item],
          }));
          checkStack.push(...data);
        }
      }
      count++;
      if (checkStack.length === 0) break;
      if (count > 1000000) {
        console.error("overflowchecker overflow!", count, checkStack.length);
        break;
      }
    } while (true);

    console.log(
      `--overflowChecker-- ${moment().format("YYYY-MM-DD HH:mm:ss")}\n`,
      `checked ${count} times, and ${checked.length} object nodes,`,
      `max key's length is ${maxLen}.`
    );
  }, 2000);

export { exposeToWindow, overflowChecker, overflowCheckerQ };
