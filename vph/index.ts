import VirtualDom from './vdom';
import { TAGS } from './constant';
import StoreKeeper from './store';
import { dataFactory } from './DataUnit';
import {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
} from './domOperator';
import { forDirective, IfDirective, onDirective, ValueBind } from './directive';
import tmpAnalyse from './templateCompiler/index';

import State from './diff/index';

/** test */
const initStore = {
  obj: {
    arr: [
      { key: 'name', val: 'name' },
      { key: 'type', val: 'type' }
    ],
    la: {}
  },
  text: 'aye'
}
const test = new State(initStore, new StoreKeeper(dataFactory(initStore), {}, {}));

test.setState((state) => {
  state.obj = {
    arr: [
      { key: 'name', val: 'name2' },
      { key: 'aye', val: 'aye' },
      { key: 'type', val: 'type' },
    ],
    hey: {
      name: 'my name'
    }
  };
  return state;
});
/** test */


/**
 * 组件初始化
 * @param init 
 */
export function Component(
  init: {
    render: Function | string,
    attr?: string,
    state?: object,
    actions?: object,
    components?: object,
    whenInit?: Function,
    whenUninit?: Function,
  }
): Function {
  return function (
    props: {
      attr?: Array<string>,
      props?: string,
      children?: Array<any>;
      valueBind?: string,
      forDirective?: string,
      onDirective?: string,
      ifDirective?: string,
    },
  ): Function {
    return function (store: StoreKeeper): VirtualDom {
      let analysed;
      if (typeof init.render === 'string') {
        analysed = tmpAnalyse(init.render, init.components);
      } else if (typeof init.render === 'function') {
        analysed = init.render(init.components);
      }
      const _props = props.props ? store.getMultiValue(...props.props.split(' ')) : {};
      delete props.attr;
      delete props.props;
      delete props.children;
      // delete props.valueBind;
      // delete props.forDirective;
      // delete props.onDirective;
      // delete props.ifDirective;
      const _init = {
        isComponent: true,
        ...init,
        ...analysed,
        ...props,
        storeKeeper: new StoreKeeper(dataFactory({}), {}, _props),
      }
      init = null;
      delete _init.render;
      return new VirtualDom(_init);
    }
  }
}


export function vdFactory(init) {
  return new VirtualDom(init);
}

function basicTagConstruct(init) { return init }

declare global {
  interface Window {
    vdom?: any,
    vdFactory: Function,
    basicTagConstruct: Function,
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
    console.assert(window.vdom === undefined, 'window.vdom 已被占用');
    if (window.vdom === undefined) {
      window.vdom = vdom;
      console.warn('在控制台打出vdom来跟踪 virtual dom 变化！');
    }
  }
  setTimeout(() => {
    document.querySelector(selector).appendChild(vdom.giveDom());
  }, 0);
}

// export default function Vph(init: {
//   render: string,
//   attr: string,
//   state: object,
//   actions: object,
//   components: object,
//   whenInit: Function,
// }) {
//   const analysed = tmpAnalyse(init.render).replace(/^basicTagConstruct\(|\)$/g, '');
//   const construction = new Function('return ' + analysed);
//   const _init = {
//     ...init,
//     ...construction.call(init.components),
//   }
//   // delete _init.render;
//   console.log(_init);
//   return new VirtualDom(_init);
// }
/**
 * Vph
 * @param init 
 */
export default function Vph(init: {
  render: string,
  attr?: string,
  state?: object,
  actions?: object,
  components?: object,
  whenInit?: Function,
  whenUninit?: Function,
}) {
  const analysed = tmpAnalyse(init.render, init.components);
  const _init = {
    isComponent: true,
    ...init,
    ...analysed,
  }
  // delete _init.render;
  return new VirtualDom(_init);
}