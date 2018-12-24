import { vdFactory, tags, init } from './vph';
const { div, span, input, button } = tags;
import { interval } from 'rxjs';
import time from './src/time';
import testIf from './src/testIf';
import component1 from './src/component1';
import table from './src/table';


window.vD1 = vdFactory(
  div({
    children: [
      time,
      table,
      component1,
      span({
        children: ['这一坨不变是二：'],
        attr: [],
      }),
      '{{second}}',
      div({
        children: ['这一坨是三：', '{{third}}', '不变'],
        attr: ['style=color:red']
      }),
      '这一坨是一：',
      '{{first}}',
      div({
        children: ['=> ', '{{x}}', ' 后面也框起来'],
        forDirective: 'x in array1'
      }),
      input({
        onDirective: 'input.inputCallBack'
      }),
      div({
        children: ['输入的内容：', '{{text}}'],
      }),
      button({
        name: 'yo~',
        children: ['yo~'],
        onDirective: 'click.onClickYo',
      }),
      testIf,
    ],
    attr: [],
    state: {
      array1: [-4, -3, -2, -1],
      array2: [
        ['hey', '!', '~'],
        ['ha', '!!!', 'yo~~~'],
      ],
      first: 0,
      second: 0,
      third: 3,
      text: '',
      x: {
        a: 'hey'
      },
    },
    actions: {
      inputCallBack(e) {
        const { text } = this.storeKeeper.outputStore().getValues('text');
        text.setData(e.target.value);
      },
      onClickYo(e) {
        alert('hahaha');
      },
      start() {
        const { array1, third, x } = this.storeKeeper.outputStore().getValues('array1', 'third', 'x');
        interval(100).subscribe({
          next: item => {
            array1.push(item);
            array1.shift();
          }
        });
        // setTimeout(() => {
        //   this.storeKeeper.outputStore().delete('third');
        //   this.storeKeeper.outputStore().setData('hey', 'third');
        // }, 2000);
      },
      interval() {
        const { second, first, third } = this.storeKeeper.outputStore().getValues('second', 'first', 'third');
        // this.storeKeeper.outputStore().setData('hey', 'hey');
        interval(100).subscribe({
          next: item => {
            first.setData(item);
            third.setData(item + 3);
          }
        });
        interval(100).subscribe({
          next: item => {
            second.setData(item * 2);
          }
        });
      }
    },
    whenInit() {
      this.interval();
      this.start();
    }
  })
);

init('#app', vD1, false);
