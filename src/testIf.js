import { _Component, init } from '../vph';
import { interval } from 'rxjs';
import $ from 'jquery';
import moment from 'moment';

const testIf = _Component({
  render:/*html*/`
  <div>
    hey yo
    <div :if='index'>
      index ok
      <div :if='index2'>
       index2 ok
      </div>
    </div>
  </div>
  `,
  state: {
    index: 0,
    index2: 0,
  },
  actions: {
    start() {
      const { index, index2 } = this.getDatas('index', 'index2');

      interval(1000).subscribe({
        next: item => {
          index.setData(item % 2);
          index2.setData(item % 4);
        }
      });
      // interval(200).subscribe({
      //   next: item => {
      //     index2.setData(item % 2);
      //   }
      // });

    }
  },
  whenInit() {
    this.start();
  }
});

export default testIf;