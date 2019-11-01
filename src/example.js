import html from "./example.vph";
import { Component } from "vph";
import Time from "./time";
import Table from "./table";
import STYLE from "./testLess.less";

export default Component({
  render: html,
  state: {
    style: STYLE,
    easyDataBindHtml: 
      `<!-- :bind 绑定inputText的value；:on 绑定input事件给saveInput -->
<input :bind='value.inputText' :on='input.saveInput'> {{inputText}}`,
    easyDataBindJs: 
      `// 由saveInput来处理事件，setState将输入值保存到store中
saveInput(e) {
  this.setState(state => {
    state.inputText = e.target.value;
    return state;
  });
}`,
    inputText: "这是初始值",
    color: "black",
    htmlcode: `<!-- time.html -->
<table style='width: 100%'>
  <tbody>
    <tr :for='x in array2'>
      <td :for='y in x'>{{y}}</td>
    </tr>
  </tbody>
</table>`,
    jscode: `/* time.js */
import { Component } from 'vph';
import { interval } from 'rxjs';
import moment from 'moment-timezone';
import template from './time.html';

const timer = area => moment().tz(area).format('YYYY-MM-DD HH:mm:ss');

export default Component({
  render: template,
  state: {
    array2: [["北京", "东京", "纽约"], [time(+8), time(+9), time(-5)]],
  },
  actions: {
    // 纯函数是性能的基石
    dateRefreash() {
      interval(1).subscribe({
        next: () => {
          this.setState(state => {
            const _state = { ...state };
            _state.array2 = [..._state.array2];
            _state.array2[1] = [time(+8), time(+9), time(-5)];
            return _state;
          });
        },
      });
    },
  },
  whenInit() {
    this.dateRefreash();
  }
});`,
  },
  components: {
    Table,
  },
  actions: {
    saveInput(e) {
      this.setState(state => {
        state.inputText = e.target.value;
        return state;
      });
    },
  },
  whenInit() {
    setTimeout(() => {
      [...document.querySelectorAll("pre code")].map(item => {
        hljs.highlightBlock(item);
      });
    }, 10);
    setTimeout(() => {
      this.setState(state => {
        state.inputText = "我变！";
        return state;
      });
    }, 2000);
    setTimeout(() => {
      this.setState(state => {
        state.color = "red";
        state.inputText = "我再变！";
        return state;
      });
    }, 4000);
  },
});
