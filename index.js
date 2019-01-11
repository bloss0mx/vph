import { vdFactory, init } from './vph';
import Vph from './vph';
import { div, span, input, button, table, th, td, tr, tbody, s } from './vph/Tags';
import { interval } from 'rxjs';
import Time from './src/time';
import TestIf from './src/testIf';
import Component1 from './src/component1';
import Table from './src/table';
import tmpAnalyse from './vph/templateCompiler';



// window.vD1 = vdFactory(
//   div({
//     children: [
//       'z',
//       Time({
//         props: ['state@time']
//       }),
//       // span({
//       //   children: ['这一坨不变是二：'],
//       //   attr: [],
//       // }),
//       // '{{second}}',
//       // div({
//       //   children: ['这一坨是三：', '{{third}}', '不变'],
//       //   attr: ['style=color:red']
//       // }),
//       // '这一坨是一：',
//       // '{{first}}',
//       // span({
//       //   children: ['输入的内容：'],
//       // }),
//       // input({
//       //   onDirective: 'input.inputCallBack',
//       //   valueBind: 'value.state@text',
//       //   attr: ['id=yo']
//       // }),
//       ' '
//       ,
//       // button({
//       //   children: ['添加到列表'],
//       //   onDirective: 'click.onClickYo',
//       // }),
//       eval(tmpAnalyse(`
//       <div>
//         <span>
//           输入的内容：
//         </span>
//         <input 
//           :on="input.inputCallBack"
//           :bind="value.state@text"
//           id='yo'
//         >
//         <button :on='click.onClickYo'>
//           添加到列表
//         </button>
//         <table>
//           <tbody>
//             <tr>
//               <th>
//                 ID
//               </th>
//               <th>
//                 事件
//               </th>
//             </tr>
//             <tr :for='x in state@array1'>
//               <td :for='y in x'>
//               {{y}}
//             </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//       `)),
//       Table(),
//       Component1(),
//       TestIf(),
//     ],
//     attr: [],
//     state: {
//       array1: [],
//       // array2: [
//       //   ['hey', '!', '~'],
//       //   ['ha', '!!!', 'yo~~~'],
//       // ],
//       time: 0,
//       // first: 0,
//       // second: 0,
//       // third: 3,
//       text: '',
//       // x: {
//       //   a: 'hey'
//       // },
//     },
//     actions: {
//       inputCallBack(e) {
//         const { text, time } = this.getDatas('time', 'text');
//         text.setData(e.target.value);
//       },
//       onClickYo() {
//         const { text, array1 } = this.getDatas('text', 'array1');
//         array1.push([Math.floor(Math.random() * 1000), text.showData()]);
//         text.setData('');
//       },
//       // start() {
//       //   const { array1, third, x } = this.getDatas('array1', 'third', 'x');
//       //   interval(100).subscribe({
//       //     next: item => {
//       //       array1.push(item);
//       //       array1.shift();
//       //     }
//       //   });
//       //   // setTimeout(() => {
//       //   //   this.storeKeeper.outputStore().delete('third');
//       //   //   this.storeKeeper.outputStore().setData('hey', 'third');
//       //   // }, 2000);
//       // },
//       interval() {
//         const { second, first, third, time } = this.getDatas('second', 'first', 'third', 'time');
//         // this.storeKeeper.outputStore().setData('hey', 'hey');
//         interval(100).subscribe({
//           next: item => {
//             // first.setData(item);
//             // third.setData(item + 3);
//             time.setData((item - item % 10) / 10);
//           }
//         });
//         // interval(100).subscribe({
//         //   next: item => {
//         //     second.setData(item * 2);
//         //   }
//         // });
//       }
//     },
//     whenInit() {
//       this.interval();
//       // this.start();
//     }
//   })
// );
console.log(Time);

window.vD1 = Vph({
  render: `
<div>
  <span>
    输入的内容：
  </span>
  <input 
    :on="input.inputCallBack"
    :bind="value.state@text"
    id='yo'
  >
  <button :on='click.onClickYo'>
    添加到列表
  </button>
  <table>
    <tbody>
      <tr>
        <th>
          ID
        </th>
        <th>
          事件
        </th>
      </tr>
      <tr :for='x in state@array1'>
        <td :for='y in x'>
        {{y}}
      </td>
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
          time.setData((item % 2));
        }
      });
    }
  },
  whenInit() {
    this.interval();
  }
});

init('#app', vD1, false);
