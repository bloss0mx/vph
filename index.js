import { vdFactory, init } from './vph';
import Vph from './vph';
import { interval } from 'rxjs';
import Time from './src/time';
import TestIf from './src/testIf';
import Component1 from './src/component1';
import Table from './src/table';
import tmpAnalyse from './vph/templateCompiler';
import index_tmp from './index_tmp.html';

window.vD1 = Vph({
  render: /*html*/`
    <div>
      <span>输入的内容：</span>
      <input 
        :on="input.inputCallBack"
        :bind="value.state@text"
        id='yo'
      >
      <button :on='click.onClickYo'>添加到列表</button>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>事&nbsp;件</th>
          </tr>
          <tr :for='x in state@array1'>
            <td :for='y in x'>{{y}}</td>
          </tr>
        </tbody>
      </table>
      <Time 
        :props='state@time'
        :if='props@time'
      />
      <Table/>
      <Component1/>
      <TestIf/>
    </div>
  `,
  attr: [],
  state: {
    array1: [],
    time: 0,
    text: '',
  },
  components: {
    Time,
    Table,
    Component1,
    TestIf
  },
  actions: {
    inputCallBack(e) {
      const { text, time } = this.getDatas('time', 'text');
      text.setData(e.target.value);
    },
    onClickYo() {
      const { text, array1 } = this.getDatas('text', 'array1');
      array1.push([Math.floor(Math.random() * 1000), text.showData()]);
      text.setData('');
    },
    interval() {
      const { second, first, third, time } = this.getDatas('second', 'first', 'third', 'time');
      interval(1000).subscribe({
        next: item => {
          time.setData(!!(item % 100));
        }
      });
    }
  },
  whenInit() {
    this.interval();
  }
});

init('#app', vD1, false);
