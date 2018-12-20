import _ from 'lodash';
import $ from 'jquery';
import { ARRAYY_OPERATE } from './constant';
import { DataUnit } from './DataUnit';
import VirtualDom from './vdom';


// TODO 不要让指令直接操作vdom


class Directive {
  constructor(init) { }
  /**
   * 初始化
   */
  init() { }
  /**
   * 查找DataUnit源
   */
  findOrigin(directive) { }
  /**
   * 数据更新
   */
  run(ata, type?, index?, operate?) { }
  /**
   * 删除自己，去掉所有引用
   */
  mySelf() {
    for (let i in this) {
      this[i] = null;
    }
  }
}

class IfDirective extends Directive {
  private flagName: string;
  private store: DataUnit;
  private pt: VirtualDom;
  private key: String;
  constructor(init) {
    super(init);
    this.flagName = init.flagName;

    this.store = init.store;
    this.pt = init.pt;

    this.key = init.key ? init.key : true;//
    this.findOrigin();
  }

  findOrigin() {
    const found = this.store.outputData(this.flagName);
    if (found !== undefined) {
      found.addPush(this);
    }
  }

  run(data) {
    this.ifDirectiveOperate(data == this.key);
  }

  /**
   * 显示隐藏操作
   * @param {*} flag 
   */
  ifDirectiveOperate(flag) {
    if (flag) {
      this.pt.show();
    } else {
      this.pt.hide();
    }
  }

  rmSelf() {
    const found = this.store.outputData(this.flagName);
    if (found !== undefined) {
      found.rmPush(this);
    }
  }

}
class forDirective extends Directive {
  private store: DataUnit;
  private pt: VirtualDom;
  private childrenPt: Array<any>;
  private childrenDom: Array<any>;
  private varibleName;
  private baseDataName: string;
  constructor(init) {
    super(init);
    this.store = init.store;
    this.pt = init.pt;
    this.childrenPt = [];
    this.childrenDom = [];

    this.findOrigin(init.directive);
  }

  findOrigin(directive) {
    const splited = directive.split('in');
    const handled = splited.map(item => {
      return item.replace(/[\s]*/, '');
    });
    this.varibleName = handled[0];
    this.baseDataName = handled[1];

    const found = this.store.outputData(this.baseDataName);
    if (found !== undefined) {
      found.addPush(this);
      this.init();
    }
  }

  init() {
    const baseData = this.store.outputData(this.baseDataName);
    const childrenStore = baseData.map((item, index) => {
      return item;
    });
    childrenStore.map((item, index) => {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
        varibleName: index,
        forStore: baseData,
        baseDataName: this.baseDataName,
        // ...item
      });
      this.pt.giveDom().appendChild(tmpDom);
      // this.pt.insertToAvilableBefore(tmpDom, index);

      this.pt.childrenPt.push(tmpChildrenPt);
      item.addPush(tmpChildrenPt);
      this.childrenDom.push(tmpDom);
      this.childrenPt.push(tmpChildrenPt);
    });
  }

  run(data, type, index, operate) {
    this.forDirectiveOperate(data, index, operate);
  }

  /**
   * 添加dom到dom列表
   * @param {*} data 
   * @param {*} index 
   */
  addToList(data, index) {
    const targetIndex = index - 1;
    const baseData = this.store.outputData(this.baseDataName)
    const childrenStore = baseData.outputData(targetIndex);
    const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
      varibleName: targetIndex,
      forStore: baseData,
      baseDataName: this.baseDataName,
    });
    if (this.pt.childrenPt.length === 0 && this.pt.index > 0) {
      if (this.pt.father.childrenPt.length === 0) {
        $(this.pt.father.giveDom()).prepend(tmpDom);
      } else {
        $(tmpDom).insertAfter($(this.pt.father.childrenPt[this.pt.index - 1].giveDom()));
      }
    } else if (this.pt.childrenPt.length === 0 && this.pt.index === 0) {
      $(this.pt.father.giveDom()).prepend(tmpDom);
    } else if (this.childrenDom[targetIndex - 1]) {
      $(tmpDom).insertAfter(this.childrenDom[targetIndex - 1]);
    }
    this.pt.childrenPt.splice(index, 0, tmpChildrenPt);
    childrenStore.addPush(tmpChildrenPt);
    this.childrenDom.splice(index, 0, tmpDom);
    this.childrenPt.splice(index, 0, tmpChildrenPt);
  }

  /**
   * 从dom列表删除dom
   * @param {*} data 
   * @param {*} index 
   */
  rmFromList(data, index) {
    this.pt.childrenPt.splice(index, 1);
    this.childrenPt[index].rmSelf();
    this.childrenPt.splice(index, 1);
    $(this.childrenDom[index]).remove();
    this.childrenDom.splice(index, 1);
  }

  forDirectiveOperate(data, index, operate) {
  }

}

class onDirective extends Directive {
  private store: DataUnit;
  private pt: VirtualDom;
  private callback: any;// FIX ME
  private directive: string;
  private eventType: string;
  private callbackName: string;
  constructor(init) {
    super(init);
    this.store = init.store;
    this.pt = init.pt;
    this.callback = init.callback;
    this.directive = init.directive;//'input.'

    this.init();
    this.findCallback();
    this.findOrigin();
  }

  init() {
    const splited = this.directive.split('.');
    const handled = splited.map(item => {
      return item.replace(/[\s]*/, '');
    });
    this.eventType = handled[0];
    this.callbackName = handled[1];
  }

  findOrigin() {
    if (this.eventType && this.callback) {
      this.pt.giveDom().addEventListener(this.eventType, this.callback);
    }
  }

  /**
   * 组件根节点查找action
   */
  findCallback() {
    let pt = this.pt;
    for (; ;) {
      if (pt.father) {
        pt = pt.father;
      } else {
        break;
      }
    }
    if (pt.actions && pt.actions[this.callbackName]) {
      this.callback = pt.actions[this.callbackName].bind(pt);
    }
  }

  rmSelf() {
    this.pt.giveDom().removeEventListener(this.eventType, this.callback);
  }

}

export { IfDirective, forDirective, onDirective };
