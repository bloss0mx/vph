import VirtualDom from "./vdom";
import { TAGS } from "./constant";
import StoreKeeper from "./store";
import { dataFactory, toJS } from "./DataUnit/index";
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

interface setState {
  (state: object): object;
}

/**
 * 组件初始化
 * @param init
 */
export function Component<T>(init: {
  /**
   * 渲染模板
   */
  render: Function | string;
  attr?: string;
  /**
   * 初始化state
   */
  state?: object;
  /**
   * 方法
   */
  actions?: object;
  /**
   * 注册组件
   */
  components?: object;
  /**
   * 挂载时触发
   */
  whenInit?: Function;
  /**
   * 卸载时触发
   */
  whenUninit?: Function;
  /**
   * 设置state
   */
  setState: setState;
}): Function {
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
          analysed = tmpAnalyse(init.render, init.components);
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

export function vdFactory(init) {
  return new VirtualDom(init);
}

function basicTagConstruct(init) {
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
export function init(selector, vdom, productEnv = false) {
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
export default function Vph(init: {
  render: string;
  attr?: string;
  state?: object;
  actions?: object;
  components?: object;
  whenInit?: Function;
  whenUninit?: Function;
}) {
  const analysed = tmpAnalyse(init.render, init.components);
  const _init = {
    isComponent: true,
    ...init,
    ...analysed,
  };
  // delete _init.render;
  return new VirtualDom(_init);
}
