import { Component, tags } from '../vph';
const { div } = tags;
import { interval } from 'rxjs';


const component1 = Component(
  div({
    children: [
      '这是个组件：',
      '{{value.index}}',
      ...(() => {
        let arrays = [];
        for (let i = 0; i < 8; i++) {
          arrays.push(div({ children: [`{{color${i}}}`], attr: [`style=color:{{color${i}}}`] }));
        }
        return arrays;
      })(),
      div({
        children: [
          '{{color7}}',
          div({
            children: ['{{color7}}'],
            attr: ['style=color:{{color7}}']
          })
        ],
        attr: ['style=color:{{color7}}'],
        ifDirective: 'switcher',
        key: 1,
      }),
    ],
    state: {
      value: { index: 0 },
      color: 'red',
      color0: 'red',
      color1: 'red',
      color2: 'red',
      color3: 'red',
      color4: 'red',
      color5: 'red',
      color6: 'red',
      color7: 'red',
      switcher: 0,
    },
    attr: [
      'style=color:{{color}};font-size:30px'
    ],
    actions: {
      interval() {
        const {
          value,
          color,
          color0,
          color1,
          color2,
          color3,
          color4,
          color5,
          color6,
          color7,
          switcher
        } = this.getDatas(
          'value',
          'color',
          'color0',
          'color1',
          'color2',
          'color3',
          'color4',
          'color5',
          'color6',
          'color7',
          'switcher'
        );
        interval(100).subscribe({
          next: item => {
            value.outputData('index').setData(item);
          }
        });
        interval(1000).subscribe({
          next: item => {
            switcher.setData(item % 100);
          }
        });
        interval(100).subscribe({
          next: () => {
            color7.setData(color6.outputData());
            color6.setData(color5.outputData());
            color5.setData(color4.outputData());
            color4.setData(color3.outputData());
            color3.setData(color2.outputData());
            color2.setData(color1.outputData());
            color1.setData(color0.outputData());
            color0.setData(color.outputData());
            color.setData('#' + Math.floor(Math.random() * (parseInt('ffffff', 16))).toString(16));
          }
        });
      }
    },
    whenInit() {
      this.interval();
    }
  })
);

export default component1;