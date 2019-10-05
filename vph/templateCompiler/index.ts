import tagAnalyse, { Container } from "./tagAnalyse";
import { TAGS, SPLITED_TAGS } from "../constant";

interface code {
  tag: string;
  attr: string[];
  props: string;
  ifDirective: string;
  forDirective: string;
  onDirective: string;
  valueBind: string;
  slotDirective: string;
  children: string[];
}

interface Component {
  [name: string]: Function;
}

function basicIterator(container: Container) {
  let code = "";
  const tagName = container.getTagName();
  const attr = container.getAttr();
  const ifDirective = container.getIf();
  const forDirective = container.getFor();
  const onDirective = container.getOn();
  const bindDirective = container.getBind();
  const props = container.getProps();
  const children = container.getChildren();
  // code += 'basicTagConstruct({';
  // code += `tag:'${tagName}',`;
  code += ComponentAnalyse(tagName);
  code += attr ? `attr:[${attr.join(",")}],` : "";
  code += props ? `props:[${props}],` : ""; // todo
  code += ifDirective ? `ifDirective:${ifDirective},` : "";
  code += forDirective ? `forDirective:${forDirective},` : "";
  code += onDirective ? `onDirective:${onDirective},` : "";
  code += bindDirective ? `valueBind:${bindDirective},` : "";
  if (children && children.length > 0) {
    const childrenCode = children.map(item => {
      if (typeof item === "string") {
        return '"' + item + '"';
      } else {
        return basicIterator(item);
      }
    });
    code += `children:[${childrenCode.join(",")}],`;
  }
  code += "})";
  return code;
}

function basicReconstruct(tmp: string, components: Component) {
  const analysed = tagAnalyse(tmp);
  // const code = basicIterator(analysed);
  const code = _basicIterator(analysed, components);

  return code;
}

function ComponentAnalyse(tagName: string) {
  const isBasic = SPLITED_TAGS.find(item => item === tagName);
  if (isBasic) {
    //基本
    return `basicTagConstruct({tag:'${tagName}',`;
  } else {
    //组件
    return `this.${tagName}({`;
  }
}

export default basicReconstruct;

function _basicIterator(container: Container, components: Component) {
  const tagName = container.getTagName();
  const attr = container.getAttr();
  const ifDirective = container.getIf();
  const forDirective = container.getFor();
  const onDirective = container.getOn();
  const bindDirective = container.getBind();
  const slotDirective = container.getSlot();
  const props = container.getProps();
  const children = container.getChildren();

  let childrenPt = [];
  if (children && children.length > 0) {
    childrenPt = children.map(item => {
      if (typeof item === "string") {
        return "" + item + "";
      } else {
        return _basicIterator(item, components);
      }
    });
  }
  const code = _ComponentAnalyse(
    {
      tag: tagName,
      attr: attr,
      props: props,
      ifDirective: ifDirective,
      forDirective: forDirective,
      onDirective: onDirective,
      valueBind: bindDirective,
      slotDirective,
      children: childrenPt,
    },
    components
  );
  return code;
}

function _ComponentAnalyse(code: code, components: Component) {
  const isBasic = SPLITED_TAGS.find(item => item === code.tag);
  if (isBasic) {
    //基本
    return code;
  } else {
    //组件
    const tag = code.tag.replace(/^[a-z]/, i => i.toUpperCase());
    const found = components[tag];
    if (!found) {
      throw `Component ${tag} is NOT found! `;
    }
    const _code = { ...code };
    delete _code.tag;
    return found(_code);
  }
}
