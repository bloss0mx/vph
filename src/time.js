import { vdFactory, tags } from '../vph';
const { div } = tags;
import { interval } from 'rxjs';
import moment from 'moment';

const time = vdFactory(
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
        const { time } = this.store.getValues('time');
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