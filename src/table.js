import { Component } from 'vph';
import { interval } from 'rxjs';
import moment from 'moment';
import template from './table.vph';

// const timer = area => moment().tz(area).format('YYYY-MM-DD HH:mm:ss');
const time = area => moment().utc().utcOffset(area).format('YYYY-MM-DD HH:mm:ss');

export default Component({
  render: template,
  state: {
    array2: [
      ['北京', '东京', '纽约'],
      [
        // timer("Asia/Taipei"),
        // timer("Asia/Tokyo"),
        // timer("America/New_York"),
        time(+8),
        time(+7),
        time(-5),
      ],
    ]
  },
  actions: {
    _interval() {
      const { array2 } = this.getDatas('array2');
      interval(1000).subscribe({
        next: () => {
          // array2.showData('1.0').setData(timer("Asia/Taipei"));
          // array2.showData('1.1').setData(timer("Asia/Tokyo"));
          // array2.showData('1.2').setData(timer("America/New_York"));
          array2.showData('1.0').setData(time(+8));
          array2.showData('1.1').setData(time(+7));
          array2.showData('1.2').setData(time(-5));
        }
      });
    }
  },
  whenInit() {
    this._interval();
  }
});