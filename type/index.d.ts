export class BaseObj {
  protected dom: any;
  constructor(name, store?, index?);
  run(data, type, index, opeate);
  findOrigin(name, node, index);
  giveDom();
  rmSelf();
}

export class TextDom extends BaseObj {}

export class PlainText extends BaseObj {}

export class AttrObj extends BaseObj {}

export class StoreKeeper {}

export class Directive {}

export class ValueBind extends Directive {}

export class IfDirective extends Directive {}

export class onDirective extends Directive {}

export class forDirective extends Directive {}

export class DomKeeper extends Directive {}

export class Fragment extends DomKeeper {}

export class Element extends DomKeeper {}

interface init {
  tag: string;
  index: number;
  isComponent: boolean;

  children: Array<VirtualDom | Object | string>;
  father: VirtualDom;
  components: Array<VirtualDom>;
  actions: Array<Function>;
  slot: Array<any>;

  attr: Array<string>;

  varibleName: string;
  baseDataName: string;

  storeKeeper: StoreKeeper;
  state: object;
  props: object;

  onDirective: string;
  ifDirective: string;
  forDirective: string;
  valueBind: string;
  slotDirective: string;
  
  whenInit: Function;
  whenMount: Function;
  whenUninit: Function;
}

export class VirtualDom {
  index: number;
  father: VirtualDom;
  actions: Array<Function>;
  components: Array<VirtualDom>;
  childrenPt: Array<VirtualDom | BaseObj>;
  isComponent: boolean;
  slotDirective: string;

  private slot: Array<any>;
  private init: init;
  private tag: string;
  // private props: DataUnit;
  private varibleName: string;
  private baseDataName: string;
  // private attr: Array<string>;
  private attrPt: Array<AttrObj>;
  private valueBind: ValueBind;
  private storeKeeper: StoreKeeper;
  private ifDirective: IfDirective;
  private onDirective: onDirective;
  private forDirective: forDirective;
  private dom: Fragment | Element;
  // private dom: DocumentFragment | HTMLElement;
  private children: Array<VirtualDom | Object | string>;
  private whenInit: Function;
  private whenMount: Function;
  private whenUninit: Function;
}
