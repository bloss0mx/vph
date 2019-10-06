import { DataUnit, Arrayy, Objecty } from "vph/DataUnit";
import { forDirective } from "vph/directive";

export class BaseObj {
  // protected dom: TextNode | HTMLElement;
  protected dom: any;
  constructor(name: any, store?: any, index?: any);
  run(data: any): void;
  findOrigin(name: string, node: any, index: number): void;
  giveDom(): HTMLElement | DocumentFragment | Text;
  rmSelf(): void;
}

export class TextDom extends BaseObj {}

export class PlainText extends BaseObj {}

export class AttrObj extends BaseObj {}

export class StoreKeeper {}

export class Directive {}

export class ValueBind extends Directive {}

export class IfDirective extends Directive {}

export class onDirective extends Directive {}

export class DomKeeper extends Directive {}

export class Fragment extends DomKeeper {}

export class Element extends DomKeeper {}

interface init<T> {
  tag: string;
  index: number;
  isComponent: boolean;

  children: Array<VirtualDom<T> | Object | string>;
  father: VirtualDom<T>;
  components: Array<VirtualDom<T>>;
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

export class VirtualDom<T> {
  index: number;
  father: VirtualDom<T>;
  actions: Array<Function>;
  components: Array<VirtualDom<T>>;
  childrenPt: Array<VirtualDom<T> | BaseObj>;
  isComponent: boolean;
  slotDirective: string;

  private slot: Array<any>;
  private init: init<T>;
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
  private forDirective: forDirective<T>;
  private dom: Fragment | Element;
  // private dom: DocumentFragment | HTMLElement;
  private children: Array<VirtualDom<T> | Object | string>;
  private whenInit: Function;
  private whenMount: Function;
  private whenUninit: Function;
}

export type BaseType = string | number | boolean | RegExp | undefined | null;
export type refType = object | Array<any> | Function;

export type PushAbleType = TextDom | PlainText | AttrObj;
export type DatayType<T> = Arrayy<T> | Objecty<T> | DataUnit<T>;
export type addToListAbleType<T> = forDirective<T>;
