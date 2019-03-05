import { ARRAYY_OPERATE } from '../constant';
import { DataUnit } from '../DataUnit/index';
import VirtualDom from '../vdom';
import StoreKeeper from '../store';
import {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
} from '../domOperator';
import Directive from './directive';

export default class forDirective extends Directive {
  private storeKeeper: StoreKeeper;
  private pt: VirtualDom;
  private childrenPt: Array<any>;
  private childrenDom: Array<any>;
  private varibleName;
  private baseDataName: string;
  constructor(init: {
    storeKeeper: StoreKeeper,
    pt: VirtualDom,
    directive: string,
  }) {
    super(init);
    this.storeKeeper = init.storeKeeper;
    this.pt = init.pt;
    this.childrenPt = [];
    this.childrenDom = [];
    this.findOrigin(init.directive);
  }

  findOrigin(directive: string) {
    const splited = directive.split('in');
    const handled = splited.map(item => {
      return item.replace(/[\s]*/, '');
    });
    this.varibleName = handled[0].replace(/ /g, '');
    this.baseDataName = handled[1];

    console.log(this.varibleName, this.baseDataName);
    this.storeKeeper.register(this.baseDataName, this, this.init);
  }

  init() {
    const baseData = this.storeKeeper.findDataByType(this.baseDataName);
    const childrenStore = baseData.map((item, index) => {
      return item;
    });

    childrenStore.map((item, index) => {
      const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
        varibleName: this.varibleName,
        storeKeeper: this.storeKeeper,
        baseData: baseData,// TODO 查清这个的用法
        baseDataName: this.baseDataName,
        index,
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

  //FIX => index不统一
  /**
   * 添加dom到dom列表
   * @param {*} data 
   * @param {*} index 
   */
  addToList(data, index: number) {
    const targetIndex = index - 1;
    // const _storeKeeper = new StoreKeeper(...this.storeKeeper.outputAll());
    const _storeKeeper = this.storeKeeper;
    _storeKeeper.setForStore((store, forStore, props, pt: StoreKeeper) => {
      return pt.findDataByType(this.baseDataName);
    });
    const baseData = this.storeKeeper.findDataByType(this.baseDataName);
    const childrenStore = baseData.showData(targetIndex === -1 ? 0 : targetIndex);
    const { tmpDom, tmpChildrenPt } = this.pt.makeForChildren({
      varibleName: this.varibleName,
      index: (targetIndex + 1).toString(),
      storeKeeper: this.storeKeeper,
      baseData: baseData,
      baseDataName: this.baseDataName,
    });

    if (this.pt.childrenPt.length === 0) {// 无子
      if (targetIndex !== -1) {// 头插入
        console.error('Unknow problem, or say, maybe a problem');
      }
      const preBro = this.pt.previousBrother();
      if (preBro !== undefined) {
        insertAfter(preBro, tmpDom);
      } else {
        this.pt.father.giveDom().parentNode.insertBefore(tmpDom, this.pt.father.giveDom());
      }
    } else {// 有子
      if (targetIndex === -1) {// 头插入
        this.pt.childrenPt[0].giveDom().parentNode.insertBefore(tmpDom, this.pt.childrenPt[0].giveDom());
      } else if (targetIndex === this.pt.childrenPt.length) {// 末插入
        insertAfter(this.pt.childrenPt[targetIndex - 1].giveDom(), tmpDom);
      } else {// 中间插入
        insertAfter(this.pt.childrenPt[targetIndex].giveDom(), tmpDom);
      }
    }

    this.pt.childrenPt.splice(index, 0, tmpChildrenPt);
    (<DataUnit>childrenStore).addPush(tmpChildrenPt);
    this.childrenDom.splice(index, 0, tmpDom);
    this.childrenPt.splice(index, 0, tmpChildrenPt);
  }

  /**
   * 从dom列表删除dom
   * @param {*} data 
   * @param {*} index 
   */
  rmFromList(data, index: number) {
    this.pt.childrenPt.splice(index, 1);
    this.childrenPt[index].rmSelf();
    this.childrenPt.splice(index, 1);
    remove(this.childrenDom[index]);
    this.childrenDom.splice(index, 1);
  }

}