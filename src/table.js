import { _Component } from '../vph';
import { interval } from 'rxjs';
import moment from 'moment-timezone';
import template from './table.html';

const timer = area => moment().tz(area).format('YYYY-MM-DD HH:mm:ss');

export default _Component({
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
});