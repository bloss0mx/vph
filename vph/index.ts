import VirtualDom, { init as VDInit } from "./vdom";
import { TAGS } from "./constant";
import StoreKeeper from "./store";
import { dataFactory, toJS } from "./dataUnit/index";
import {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
} from "./domOperator";
import {
  forDirective,
  IfDirective,
  onDirective,
  ValueBind,
} from "./directive/index";
import tmpAnalyse from "./templateCompiler/index";
import Diff from "./diff/index";

import State from "./diff/index";

/** test */
// const initStore = {
//   obj: {
//     arr: [
//       { key: 'name', val: 'name' },
//       { key: 'type', val: 'type' }
//     ],
//   },
//   text: 'aye'
// }
// const test = new State(initStore, new StoreKeeper(dataFactory(initStore), {}, {}));

// console.time('diff');
// test.setState((state) => {
//   state.obj = {
//     arr: [
//       { key: 'name', val: 'name2' },
//       { key: 'aye', val: 'aye' },
//       { key: 'type', val: 'type' },
//     ],
//     text: 'nye',
//   };
//   return state;
// });
// console.timeEnd('diff');
/** test */

interface setState<T> {
  (state: T): T;
}

interface componentInit<T> {
  /**
   * 渲染模板
   */
  render: Function | string | any;
  // attr?: string;
  /**
   * 初始化state
   */
  state?: T;
  /**
   * 方法
   */
  actions?: {
    [name: string]: (this: { setState: setState<T> }, ...p: any[]) => any;
  };
  /**
   * 注册组件
   */
  components?: any;
  /**
   * 挂载时触发
   */
  whenInit?: (this: ThisType<T>) => void;
  /**
   * 卸载时触发
   */
  whenUninit?: (this: ThisType<T>) => void;
  /**
   * 设置state
   */
  // setState: (state: T) => T;
}

/**
 * 组件初始化
 * @param init
 */
export function Component<T>(init: componentInit<T>): Function {
  return function(props: {
    attr?: Array<string>;
    props?: string;
    children?: Array<any>;
    valueBind?: string;
    forDirective?: string;
    onDirective?: string;
    ifDirective?: string;
    slotDirective?: string;
  }): Function {
    const slot = (props.children || []).map(item => {
      if (typeof item === "function") {
        return item();
      } else {
        return new VirtualDom(item);
      }
    });
    console.log(slot);

    return function(store: StoreKeeper<T>): VirtualDom<T> {
      let analysed;
      if (init) {
        if (typeof init.render === "string") {
          // analysed = tmpAnalyse(init.render, init.components);
        } else if (typeof init.render === "function") {
          analysed = init.render(init.components);
        }
      }
      const _props = props.props
        ? store.getMultiValue(...props.props.split(" "))
        : {};
      // const slot = props.children ? [...props.children] : [];
      delete props.attr;
      delete props.props;
      delete props.children;
      // delete props.valueBind;
      // delete props.forDirective;
      // delete props.onDirective;
      // delete props.ifDirective;
      const _init = {
        isComponent: true,
        slot,
        ...init,
        ...analysed,
        ...props,
        storeKeeper: new StoreKeeper(dataFactory(init.state), {}, _props),
      };
      // init = null;//slot需要这个，不能清除
      delete _init.render;
      return new VirtualDom(_init);
    };
  };
}

export function vdFactory<T>(init: VDInit<T>) {
  return new VirtualDom(init);
}

function basicTagConstruct(init: any) {
  return init;
}

declare global {
  interface Window {
    vdom?: any;
    vdFactory: Function;
    basicTagConstruct: Function;
  }
}
window.vdFactory = vdFactory;
window.basicTagConstruct = basicTagConstruct;

/**
 * 初始化
 * @param {*} selector 选择器
 * @param {*} vdom vdom实例
 * @param {*} productEnv 生产环境
 */
export function init<T>(
  selector: string,
  vdom: VirtualDom<T>,
  productEnv = false
) {
  if (productEnv) {
    console.assert(window.vdom === undefined, "window.vdom 已被占用");
    if (window.vdom === undefined) {
      window.vdom = vdom;
      console.warn("在控制台打出vdom来跟踪 virtual dom 变化！");
    }
  }
  setTimeout(() => {
    document.querySelector(selector).appendChild(vdom.giveDom());
  }, 0);
}

/**
 * Vph
 * @param init
 */
export default function Vph<T>(init: {
  render: Function;
  attr?: string;
  state?: T;
  actions?: object;
  components?: any;
  whenInit?: Function;
  whenUninit?: Function;
}) {
  // const analysed = tmpAnalyse(init.render, init.components);
  const analysed = init.render(init.components);
  const _init = {
    isComponent: true,
    ...init,
    ...analysed,
  };
  // delete _init.render;
  return new VirtualDom(_init);
}
