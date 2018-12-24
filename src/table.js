import { vdFactory, tags } from '../vph';
const { div, table, tbody, tr, td } = tags;
import { interval } from 'rxjs';
import moment from 'moment-timezone';

const timer = area => moment().tz(area).format('YYYY-MM-DD HH:mm:ss');

const Table = vdFactory(
  table({
    children: [
      tbody({
        children: [
          tr({
            children: [
              td({
                children: ['{{y}}'],
                forDirective: 'y in x'
              })
            ],
            forDirective: 'x in array2'
          })
        ]
      })
    ],
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
        const { array2 } = this.storeKeeper.outputStore().getValues('array2');
        interval(1000).subscribe({
          next: () => {
            array2.outputData('1.0').setData(timer("Asia/Taipei"));
            array2.outputData('1.1').setData(timer("Asia/Tokyo"));
            array2.outputData('1.2').setData(timer("America/New_York"));
          }
        });
      }
    },
    whenInit() {
      this.interval();
    }
  })
);

export default Table;