import { Component } from 'vph';
import { interval } from 'rxjs';


const component1 = Component({
  render:/*html*/`
  <div>
    这是个组件：{{value.index}}
    <div style='color:{{color1}}'>{{color1}}</div>
    <div style='color:{{color2}}'>{{color2}}</div>
    <div style='color:{{color3}}'>{{color3}}</div>
    <div style='color:{{color4}}'>{{color4}}</div>
    <div style='color:{{color5}}'>{{color5}}</div>
    <div style='color:{{color6}}'>{{color6}}</div>
    <div style='color:{{color7}}'>{{color7}}</div>
    <div style='color:{{color7}}' :if='switcher'>
      {{color7}}
      <div style='color:{{color7}}'>{{color7}}</div>
    </div>
  </div>
  `,
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
          value.showData('index').setData(item);
        }
      });
      interval(1000).subscribe({
        next: item => {
          switcher.setData(item % 100);
        }
      });
      interval(100).subscribe({
        next: () => {
          color7.setData(color6.showData());
          color6.setData(color5.showData());
          color5.setData(color4.showData());
          color4.setData(color3.showData());
          color3.setData(color2.showData());
          color2.setData(color1.showData());
          color1.setData(color0.showData());
          color0.setData(color.showData());
          color.setData('#' + Math.floor(Math.random() * (parseInt('ffffff', 16))).toString(16));
        }
      });
    }
  },
  whenInit() {
    this.interval();
  }
});

export default component1;