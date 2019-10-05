import { DomKeeper } from "./domKeeper";
export type Element_Type = HTMLElement | DocumentFragment | Text;

const getFatherDom = (node: Element_Type) => {
  return node && node.parentNode;
};
const selectorFilter = (value: string): HTMLElement | undefined => {
  if (typeof value === "string") {
    if (value.match(/^#/)) {
      return document.querySelector(value);
    }
    // else {
    //   return document.querySelectorAll(value)[0];
    // }
  } else {
    Element;
  }
};

const prepend = (bro: Element_Type, target: Element_Type) => {
  const fatherDom = getFatherDom(bro);
  fatherDom.insertBefore(target, fatherDom.childNodes[0]);
};
const insertAfter = (referenceNode: Element_Type, newNode: Element_Type) =>
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
const remove = <T>(target: DomKeeper<T> | Element_Type | any) => {
  if (target.outputDom !== undefined) {
    const fatherDom = getFatherDom(target.outputDom());
    fatherDom && fatherDom.removeChild(target.outputDom());
  } else {
    const fatherDom = getFatherDom(target);
    fatherDom && fatherDom.removeChild(target);
  }
  // const fatherDom = getFatherDom(target);
  // fatherDom && fatherDom.removeChild(target);
};
const attr = <T>(target: DomKeeper<T>, name: string, value: string) => {
  (target.outputDom() as any).setAttribute(name, value);
  // target.setAttribute(name, value);
};
const removeAttr = (target: HTMLElement, name: string) => {
  target.setAttribute(name, "");
};
const append = (bro: string, target: Element_Type) => {
  const fatherDom = getFatherDom(selectorFilter(bro));
  fatherDom.appendChild(target);
};

export { prepend, insertAfter, remove, attr, removeAttr, append };
