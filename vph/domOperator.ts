const getFatherDom = node => {
  return node && node.parentNode;
}
const selectorFilter = value => {
  if (typeof value === 'string') {
    if (value.match(/^#/)) {
      return document.querySelector(value);
    } else {
      return document.querySelectorAll(value);
    }
  } else if (true) {
    return Element;
  }
  else {
    throw (`Unknow param: ${value}`);
  }
}

const prepend = (bro, target) => {
  const fatherDom = getFatherDom(selectorFilter(bro));
  fatherDom.insertBefore(target, fatherDom.childNodes[0]);
};
//TODO target不同类型暂时无法解决
const insertAfter = (bro, target) => {
  const fatherDom = getFatherDom(selectorFilter(bro));
  if (fatherDom.lastChild == bro) {
    fatherDom.appendChild(target);
  } else {
    fatherDom.insertBefore(target, bro.nextSibling);
  }
};
const remove = (target) => {
  const fatherDom = getFatherDom(target);
  fatherDom && fatherDom.removeChild(target);
};
const attr = (target, name, value) => {
  target.setAttribute(name, value);
};
const removeAttr = (target, name) => {
  target.setAttribute(name, '');
};
const append = (bro, target) => {
  const fatherDom = getFatherDom(selectorFilter(bro));
  fatherDom.appendChild(target);
};

export {
  prepend,
  insertAfter,
  remove,
  attr,
  removeAttr,
  append,
}