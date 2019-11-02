# Vph

基于 virtual DOM，高效实现数据映射到视图。

## 简单、灵活

vph 模板，继承自 html 的语法，添加了模板语法和绑定指令，简单易懂。

state 层超薄且与核心隔离，只要修改 state 就能完成渲染，不管是什么 js 库都能通力协作，编码空间更大。

## 声明式、函数式、组件化

清晰、灵活的状态管理。组件既能相互独立，又能协同工作。

setState 拒绝副作用，拒绝由此引起的 bug 和性能问题。

## 性能强劲

无副作用的 setState 函数带来了更高的 diff 性能，并且限制每秒 30 次 diff 和渲染操作，无需针对 vph 的性能优化。

最小化后的 vph 只有 24kb，gzip 压缩后仅有 7kb，轻如无物。

---

## 实现一个时间表

### vph 模板

```html
<!-- time.vph -->
<table style="width: 100%">
  <tbody>
    <tr :for="x in times">
      <td :for="y in x">{{y}}</td>
    </tr>
  </tbody>
</table>
```

### js

```js
/* time.js */
import { Component } from "vph";
import { interval } from "rxjs";
import moment from "moment-timezone";
import template from "./time.vph";

const timer = area =>
  moment()
    .tz(area)
    .format("YYYY-MM-DD HH:mm:ss");

export default Component({
  render: template,
  state: {
    times: [["北京", "东京", "纽约"], [time(+8), time(+9), time(-5)]],
  },
  actions: {
    // 纯函数是性能的基石
    dateRefreash() {
      interval(1).subscribe({
        next: () => {
          this.setState(state => {
            const _state = { ...state };
            _state.times = [..._state.times];
            _state.times[1] = [time(+8), time(+9), time(-5)];
            return _state;
          });
        },
      });
    },
  },
  whenInit() {
    this.dateRefreash();
  },
});
```

---

## 项目组成--Project composition

1. 基本数据类型：基本类型`DataUnit`，数组`Arrayy`，对象`Objecty`
2. 虚拟 dom：`vdom`
3. dom 对象：数据绑定文字`TextDom`，不可变文字`PlainText`，数据绑定属性`AttrObj`
4. 指令：条件`IfDirective`，循环`forDirective`，事件`onDirective`，数值绑定`ValueBind`
5. 数据托管：`StoreKeeper`

---

1. Basic data type:basic type:`DataUnit`,array:`Arrayy`,object:'Objecty'
2. Virtual dom:`vdom`
3. Dom object:Data binding text`TextDom`,immutable text`PlainText`,data binding attribute`AttrObj`
4. Directive:condition `IfDirective`，loop`forDirective`，event`onDirective`，data bind`ValueBind`
5. Data hosting:`StoreKeeper`

## 使用方法--Use guide

1. children：子组件或文字内容
2. state：数据，初始化后会被转换成 DataUnit 对象
3. action：行为
4. IfDirective：`ifDirective: 'index2'`当值为真或者等于`key`的时候显示
5. forDirective：`forDirective: 'item in array'`把数组值进行列表渲染，与 if 指令互斥
6. onDirective：`onDirective: 'input.inputCallBack'`当`input`时调用`inputCallBack`方法
7. ValueBind：`valueBind: 'value.text'`当`text`值发生变化时会影响到绑定的`value`值
8. whenInit()：当初始化时执行钩子（目前只实现了这个钩子）
9. props：向组件传值

---

1. children：subcomponents and text contents
2. state：state datas will be transform to DataUnit object
3. action：actions
4. IfDirective：`ifDirective: 'index2'`,content will show when `index2` is true or equal to `key`
5. forDirective：`forDirective: 'item in array'`,render datas to list，Mutually exclusive with the if directive
6. onDirective：`onDirective: 'input.inputCallBack'`,`inputCallBack` action will fire when `input` event is running
7. ValueBind：`valueBind: 'value.text'`,When the `text` value changes, it will affect the bound `value` value.
8. whenInit()：fire this hook when component is initiating（Currently only implemented this hook）
9. props：transfer values to component

注意：state 会转换成 DataUnit 对象，使用`getDatas`获取后依旧是 DataUnit 对象，如果需要取具体的内容，需要使用`showData`函数对其进行取值。如果需要设置内容，需要使用`setData`进行赋值。
maybe todo：以后可以考虑使用 diff 函数，使用函数式写法来操作数据。

---

NOTICE:State will convert to DataUnit object,It will still be a DataUnit object after get state with `getDatas`, if you want to get actual values, you should use`showData` method to convert it. If you want to set state, you need use `setData` method to assign it.
maybe todo:I will consider to use diff method, to operate state with functional programming.

## 实现方法--Implement method

执行组件，输出 vdom，使用`giveDom`函数输出 dom，并渲染到页面上。
vdom 初始化时，state 初始化成 DataUnit 对象，vdom 和指令初始化时在 DataUnit 中查找绑定的值，并绑定推送。actions 绑定 this。执行 whenInit。
当 DataUnit 中的内容发生变化，DataUnit 遍历 PushList 中寄存的 vdom 和指令指针，并触发相应的 run 函数，渲染变化。

---

Execute the component, output vdom, use the `giveDom` method to ouput dom, and render it to the page.
When `vdom` is initailized, the state is initialized to a DataUnit object. When vdom and directive are initialized, they will look up their values in DataUnit, and bind push. `actions` bind this, Execute `whenInit`
When the value in ths DataUnit changes, the DataUnit will traverses the vdoms and directives in the `PushList` array, and triggers the corresponding `run` methods to render the changes.

## TODO

### 重构

接下来会全面重构，严格规定类型。

### 下一步

- [ ] 编译时就把 state 结构规定好（也许不行）
- [ ] 提供更清晰的写法（不用 class，也不包裹函数）
- [ ] 新增事件处理器（在组件根部处理事件）
- [ ] 新增组件协调器（限制渲染次数）
- [ ] 模板分层编译（实现在模板中使用 js、尝试直接使用 jsx 语法）
- [ ] 用 ts 重写 vph-loader、与分层编译协同
- [ ] 单元测试
- [ ] 优化 diff 算法，特别是 arrayy 部分
- [ ] 写详细的文档
- [ ] 支持插槽，props，context（contect 应该是原生支持的，但需要进一步验证）
- [ ] 寻找实现服务端渲染的方法

### 增强--Enhance

- [ ] AttrObj：增加一条属性多个值绑定的支持
- [ ] AttrObj：增加 class，id，style 等的具体实现
- [x] DataUnit：增加更多 api
- [ ] forDirective：支持 index
- [ ] onDirective：支持直接执行函数
- [ ] ifDirective：支持 if elseif else 和 switch

---

- [ ] AttrObj: Add support for multiple value bindings for one attribute
- [ ] AttrObj: increase the concrete implementation of class, id, style, etc.
- [x] DataUnit: Add more apis
- [ ] forDirective: support index
- [ ] onDirective: support direct execution function
- [ ] ifDirective: support if elseif else and switch

### 补充--Supplement

- [x] 增加模板解析
- [x] state：增加 diff 方法，使用函数式写法来操作数据
- [x] state：增加状态管理器
- [ ] 增加路由功能
- [x] 增加 webpack-loader，提供更友好的书写方式

---

- [x] Add template anaylse function
- [x] state: increase the diff method, use functional programming to manipulate states
- [x] state: increase the state manager
- [ ] Add router function
- [x] Add webpack-loader to provide a more friendly way to write

### 关于我

请联系 bloss0mx@163.com
