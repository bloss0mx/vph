import html from "./example.vph";
import { Component } from "vph";
import Time from "./time";
import Table from "./table";
import STYLE from "./testLess.less";

export default Component({
  render: html,
  state: {
    style: STYLE,
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
    array2: [
      ['北京', '东京', '纽约'],
      [
        timer("Asia/Taipei"),
        timer("Asia/Tokyo"),
        timer("America/New_York"),
      ],
    ]
  },
  actions: {
    interval() {
      const { array2 } = this.getDatas('array2');
      interval(1000).subscribe({
        next: () => {
          array2.showData('1.0').setData(timer("Asia/Taipei"));
          array2.showData('1.1').setData(timer("Asia/Tokyo"));
          array2.showData('1.2').setData(timer("America/New_York"));
        }
      });
    }
  },
  whenInit() {
    this.interval();
  }
});`,
  },
  components: {
    Table,
  },
  actions: {
    saveInput(e) {
      this.setState(state => {
        console.log(e.target.value);
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
        return state;
      });
    }, 4000);
  },
});
