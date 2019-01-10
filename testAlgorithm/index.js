// const { tagAnalyse } = require('./tagAnalyse');
import tagAnalyse from './tagAnalyse';

const tmp = `
<div class="block issuable-sidebar-header" :if="x">
	<span class="issuable-header-text hide-collapsed pull-left">
		Todo
	</span>
	<a aria="{:label=>&quot;Toggle sidebar&quot;}" class="gutter-toggle pull-right js-sidebar-toggle" href="#" role="button">
		<i class="fa fa-angle-double-right"></i>
	</a>
	<button aria="{:label=&quot;Add Todo&quot;}" class="btn btn-default issuable-header-btn pull-right js-issuable-todo" data-issuable-id="37234" data-issuable-type="merge_request" data-mark-text="Mark Done" data-todo-text="Add Todo" data-url="/frontend/web_us_nHome/todos" type="button">
	<span class="js-issuable-todo-text">
	Add Todo
	</span>
	<i class="fa fa-spin fa-spinner hidden js-issuable-todo-loading"></i>
	</button>
</div>
`;

function reconstruct(tmp) {
  // console.log(tmp);
  const analysed = tagAnalyse(tmp);
  // console.log(analysed);
  const code = iterator(analysed);
  console.log(code);
  return code;
}

function iterator(container) {
  let code = '';
  const tagName = container.getTagName();
  const attr = container.getAttr();
  const ifDirective = container.getIf();
  const forDirective = container.getFor();
  const onDirective = container.getOn();
  const bindDirective = container.getBind();
  const props = container.getProps();
  const children = container.getChildren();
  code += tagName;
  code += '({';
  code += attr ? `attr:[${attr.join(',')}],` : '';
  code += props ? `props:[${props.join(',')}],` : '';
  code += ifDirective ? `ifDirective:${ifDirective},` : '';
  code += forDirective ? `forDirective:${forDirective},` : '';
  code += onDirective ? `onDirective:${onDirective},` : '';
  code += bindDirective ? `bindDirective:${bindDirective},` : '';
  if (children && children.length > 0) {
    const childrenCode = children.map(item => {
      if (typeof item === 'string') {
        return '"' + item + '"';
      } else {
        return iterator(item);
      }
    });
    code += `children:[${childrenCode.join(',')}],`;
  }
  code += '})';
  return code;
}

// console.log(tagAnalyse(tmp).getChildren()[0].getChildren());
// console.log(reconstruct(tmp));

// exports.reconstruct = reconstruct;
export default reconstruct;