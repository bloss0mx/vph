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


////////////// 导出 //////////////

module.exports = {
	curry: curry,
	concat: concat,
	prop: prop,
	split: split,
	reverse: reverse,
	join: join,
	replace: replace,
	count: count,
	maybe: maybe,
	either: either,
	memoize: memoize,
	compose: compose,
}
