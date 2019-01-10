/**
 * 柯里化函数
 * @param fn 需要柯里化的函数
 ************/
function curry(fn) {

	function act() {
		if (fn.length === arguments.length) {
			return fn(...arguments);
		} else {
			const arg = arguments;
			return function () {
				return act(...arg, ...arguments);
			}
		}
	}
	return act();
}

/**
 * 注册到Function的原型里
 ***********************/
Function.prototype.curry = function () {
	return curry(this)(...arguments);
}

/**
 * 代码组合
 * @argument 右侧函数的值作为左侧函数的参数
 ***********/
const compose = function () {//后者的结果为前者的参数
	const args = [...arguments].reverse();
	return function (param) {
		let lastParam = param;
		for (let i = 0; i < args.length; i++) {
			lastParam = args[i](lastParam);
		}
		return lastParam;
	}
}

/**
 * 异常情况
 * @param x 异常信息
 ***********/
var Left = function (x) {
	this.__value = x;
}

/*
 * 赋值
 */
Left.of = function (x) {
	return new Left(x);
}

/**
 * 操作，异常情况，直接返回原值
 * @param f 并没有作用，继续往后传异常信息
 */
Left.prototype.map = function (f) {
	return this;
}

/**
 * 正确情况
 * @param x
 ***********/
var Right = function (x) {
	this.__value = x;
}

/**
 * 赋值
 * @param x
 */
Right.of = function (x) {
	return new Right(x);
}

/**
 * 操作
 * @param f
 */
Right.prototype.map = function (f) {
	return Right.of(f(this.__value));
}

/***********
 * 常用方法
 ***********/
const concat = (function (right, left) {
	return left.concat(right);
}).curry();
const prop = (function (_prop, origin) {
	return origin[_prop];
}).curry();
const split = (function (what, str) {
	return str.split(what);
}).curry();
const reverse = (function (what) {
	return [...what.reverse()];
}).curry();
const join = (function (what, array) {
	return array.join(what);
}).curry();
const replace = (function (what, replacement, str) {
	return str.replace(what, replacement);
}).curry();
const count = (function (array, func) {
	return array.unshift[0].reduce((sum, val) => func(val)) ? ++sum : sum;
}).curry();
const maybe = (function (x, f, m) {
	return m.isNothing() ? x : f(m.__value);
}).curry();
const either = (function (f, g, e) {
	switch (e.constructor) {
		case Left: return f(e.__value);
		case Right: return g(e.__value);
	}
}).curry();
const memoize = function (f) {
	var cache = {};

	return function () {
		var arg_str = JSON.stringify(arguments);
		cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
		return cache[arg_str];
	};
};


//基础函数
const checkSingleTag = (tag) => tag && tag.match('area|base|col|command|embed|keygen|param|source|track|wbr|br|hr|img|input|link|meta|video') !== null;
const getTagFromHead = (tag) => {
	const match = tag.match(/<[^ <\/]* |<[^ <\/]*>/)
	return match && match[0].replace(/<|>| /g, '');
};
const getTagFromTail = (tag) => {
	const match = tag.match(/<\/[^<]*>/)
	return match && match[0].replace(/<\/|>/g, '');
};
const matchComponent = origin => origin.match(/^[A-Z]/);
const matchTags = (origin) => origin.match(/<[\/!-]{0,1}[^<]*[^-]>/g);
const splitText = (origin) => origin.split(/<[\/!-]{0,1}[^<]*[^-]>/g).map(item => item.replace(/\n|\t/g, ''));
const equel = curry((a, b) => a === b);
const attr = (tag) => tag.replace(/<[^\s<>]*|>/g, '').replace(/^ | $/g, '').length > 0 && tag.replace(/<[^\s<>]*|>/g, '').replace(/^ | $/g, '').split(' ').map(item => ({
	attr: item.split('=')[0],
	value: item.split('=')[1] && item.split('=')[1].replace(/\'|\"/g, ''),
})) || [];


//复合函数
const singleTags = compose(checkSingleTag, getTagFromHead);
const duoTag_Count0 = (current, tag) => (compose(equel(current), getTagFromHead))(tag);
const closeTag = (current, tag) => (compose(equel(current), getTagFromTail))(tag);

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

const checkBaseTag = name => tags.find(i => i === name);

/**
 * 分割模板
 * @param tmp 模板
 */
function splitTagNChildren(tmp) {
	const tags = matchTags(tmp);
	const text = splitText(tmp);
	const fragments = [];
	for (var i = 0; i < text.length - 1; i++) {
		!text[i].match(/^\s{0,}$/) && fragments.push(text[i]);
		fragments.push(tags[i]);
	}
	// console.log(fragments);
	return fragments.map(item => item.replace(/^ *| *$/g, ''));
}

// const { attrM } = require('./attrAnalyse');
import attrM from './attrAnalyse';

class Container {
	constructor(tag) {
		this.tag = tag;
		this.data = [];
		this.children = [];
		this.getAttr();
	}
	getTagName() {
		this.tagName = getTagFromHead(this.tag);
		return this.tagName;
	}
	getAttr() {
		const attr = attrM(this.tag);
		this.attr = attr && attr.filter(item => !item.match(/^:/)).map(item => '"' + item.replace(/"/g, '\\"') + '"') || [];
		this.directive = attr && attr.filter(item => item.match(/^:/)) || [];
		return this.attr;
	}
	getIf() {
		const directive = this.directive.find(item => item.match(/:if/));
		return directive && directive.replace(/:if=/, '');
	}
	getOn() {
		const directive = this.directive.find(item => item.match(/:on/));
		return directive && directive.replace(/:on=/, '');
	}
	getFor() {
		const directive = this.directive.find(item => item.match(/:for/));
		return directive && directive.replace(/:for=/, '');
	}
	getBind() {
		const directive = this.directive.find(item => item.match(/:bind/));
		return directive && directive.replace(/:bind=/, '');
	}
	getProps() {
		const directive = this.directive.find(item => item.match(/:props/));
		return directive && directive.replace(/:props=/, '');
	}
	getChildren() {
		return this.children;
	}
	pushChildren(child) {
		this.children.push(child);
	}
}

function tagMaker(splitedTmp) {
	if (splitedTmp.length === 0) {
		return;
	}
	const tagStack = [];
	let index = 0;
	let rootContainer = undefined;

	rootContainer = new Container(splitedTmp[0]);
	index = 1;
	tagStack.push(rootContainer);

	do {
		const currentTag = splitedTmp[index];
		const headTag = getTagFromHead(currentTag);
		const tailTag = getTagFromTail(currentTag);

		if (false) {//单标签
		} else if (headTag) {//头
			const newContainer = new Container(currentTag);
			tagStack[tagStack.length - 1].pushChildren(newContainer);
			tagStack.push(newContainer);
		} else if (tailTag) {//尾
			tagStack.pop();
		} else {//纯文本
			tagStack[tagStack.length - 1].pushChildren(currentTag);
		}
		index++;
	} while (splitedTmp.length > index);
	return rootContainer;
}

// console.log(tagMaker(splitTagNChildren(tmp)).getIf());

// exports.tagAnalyse = origin => tagMaker(splitTagNChildren(origin));
export default origin => tagMaker(splitTagNChildren(origin));