import { Component } from '../vph';
import { div, span, input, button, table, th, td, tr, tbody } from '../vph/Tags';
import { interval } from 'rxjs';
import moment from 'moment';

const time = Component(
  div({
    children: [
      '现在时间：',
      '{{time}}'
    ],
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
  })
);

export default time;