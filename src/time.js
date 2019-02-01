import { Component } from 'vph';
import { interval } from 'rxjs';
import moment from 'moment';
import template from './time.vph';

const time = Component({
  render: template,
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

export default time;