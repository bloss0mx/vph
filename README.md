# Vph.ts（暂名--Temporary name）
实现了vdom的基本功能。

---
Implemented the basic functions of vdom.

## 项目组成--Project composition
1. 基本数据类型：基本类型`DataUnit`，数组`Arrayy`，对象`Objecty`
2. 虚拟dom：`vdom`
3. dom对象：数据绑定文字`TextDom`，不可变文字`PlainText`，数据绑定属性`AttrObj`
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
2. state：数据，初始化后会被转换成DataUnit对象
3. action：行为
4. IfDirective：`ifDirective: 'index2'`当值为真或者等于`key`的时候显示
5. forDirective：`forDirective: 'item in array'`把数组值进行列表渲染，与if指令互斥
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

注意：state会转换成DataUnit对象，使用`getDatas`获取后依旧是DataUnit对象，如果需要取具体的内容，需要使用`showData`函数对其进行取值。如果需要设置内容，需要使用`setData`进行赋值。
maybe todo：以后可以考虑使用diff函数，使用函数式写法来操作数据。

---
NOTICE:State will convert to DataUnit object,It will still be a DataUnit object after get state with `getDatas`, if you want to get actual values, you should use`showData` method to convert it. If you want to set state, you need use `setData` method to assign it.
maybe todo:I will consider to use diff method, to operate state with functional programming.


``` javascript
// 此处使用了rxjs、moment
const time = Component({
  render: /*html*/`
    <div>
      现在时间：{{state@time}}
    </div>
  `,
  state: {
    time: moment().format('YYYY-MM-DD HH:mm:ss'),
  },
  actions: {
    interval() {
      const { time } = this.getDatas('time');
      interval(1000).subscribe({
        next: () => {
          const value = moment().format('YYYY-MM-DD HH:mm:ss');
          time.setData(value);
        }
      });
    }
  },
  whenInit() {
    this.interval();
  }
});
```
## 实现方法--Implement method
执行组件，输出vdom，使用`giveDom`函数输出dom，并渲染到页面上。
vdom初始化时，state初始化成DataUnit对象，vdom和指令初始化时在DataUnit中查找绑定的值，并绑定推送。actions绑定this。执行whenInit。
当DataUnit中的内容发生变化，DataUnit遍历PushList中寄存的vdom和指令指针，并触发相应的run函数，渲染变化。

---
Execute the component, output vdom, use the `giveDom` method to ouput dom, and render it to the page.
When `vdom` is initailized, the state is initialized to a DataUnit object. When vdom and directive are initialized, they will look up their values in DataUnit, and bind push. `actions` bind this, Execute `whenInit`
When the value in ths DataUnit changes, the DataUnit will traverses the vdoms and directives in the `PushList` array, and triggers the corresponding `run` methods to render the changes.

## TODO
### 增强--Enhance
- [ ] AttrObj：增加一条属性多个值绑定的支持
- [ ] AttrObj：增加class，id，style等的具体实现
- [ ] DataUnit：增加更多api
- [ ] forDirective：支持index
- [ ] onDirective：支持直接执行函数
- [ ] ifDirective：支持if elseif else和switch

---
- [ ] AttrObj: Add support for multiple value bindings for one attribute
- [ ] AttrObj: increase the concrete implementation of class, id, style, etc.
- [ ] DataUnit: Add more apis
- [ ] forDirective: support index
- [ ] onDirective: support direct execution function
- [ ] ifDirective: support if elseif else and switch


### 补充--Supplement
- [x] 增加模板解析
- [ ] state：增加diff方法，使用函数式写法来操作数据
- [x] state：增加状态管理器
- [ ] 增加路由功能
- [x] 增加webpack-loader，提供更友好的书写方式

---
- [x] Add template anaylse function
- [ ] state: increase the diff method, use functional programming to manipulate states
- [x] state: increase the state manager
- [ ] Add router function
- [x] Add webpack-loader to provide a more friendly way to write