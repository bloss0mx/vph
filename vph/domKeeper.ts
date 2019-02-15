import VirtualDom from "./vdom";
import { domType } from './enums';
import { remove } from "./domOperator";


class DomKeeper {
  protected dom: DocumentFragment | HTMLElement | Text;
  protected master: VirtualDom;// 主vdom
  constructor(init) {
  }
  createDom(type: domType, inf?: string) {
    switch (type) {
      case domType.element:
        this.dom = document.createElement(inf);
        break;
      case domType.fragement:
        this.dom = document.createDocumentFragment();
        break;
      case domType.text:
        this.dom = document.createTextNode(inf);
        break;
    }
  }
  rmSelf() {
    remove(this.dom);
    this.dom = null;
    this.master = null;
  }
  previousSibling() {
    return this.dom.previousSibling;
  }
  nextSibling() {
    return this.dom.nextSibling;
  }
  parentNode() {
    return this.dom.parentNode;
  }
  outputDom(): DocumentFragment | HTMLElement | Text {
    return this.dom;
  }
}

class Fragment extends DomKeeper {
  constructor(init) {
    super(init);
    this.master = init.master;
    this.createDom(domType.fragement, init.inf);
  }
  appendChild(dom: DocumentFragment | HTMLElement | Text) {
    this.dom.appendChild(dom);
  }
}

class Element extends DomKeeper {
  protected dom: HTMLElement
  constructor(init) {
    super(init);
    this.master = init.master;
    this.createDom(domType.element, init.tag);
  }
  appendChild(dom: DocumentFragment | HTMLElement | Text) {
    this.dom.appendChild(dom);
  }
  setAttribute(name, value) {
    this.dom.setAttribute(name, value);
  }
}

class TextNode extends DomKeeper {
  constructor(init) {
    super(init);
    this.master = init.master;
    this.createDom(domType.text, init.text);
  }
  textContent(text?: string) {
    if (text !== undefined) {
      this.dom.textContent = text;
    }
    return this.dom.textContent;
  }
}

export {
  Fragment,
  Element,
  TextNode,
}