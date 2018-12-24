import { vdFactory, tags } from '../vph';
const { div, table, tbody, tr, td } = tags;
import { interval } from 'rxjs';
import moment from 'moment-timezone';

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
          moment().tz("Asia/Taipei").format('YYYY-MM-DD HH:mm:ss'),
          moment().tz("Asia/Tokyo").format('YYYY-MM-DD HH:mm:ss'),
          moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss')
        ],
      ]
    },
    actions: {
      interval() {
        const { array2 } = this.store.getValues('array2');
        interval(1000).subscribe({
          next: () => {
            const value = moment().format('YYYY-MM-DD HH:mm:ss');
            array2.outputData('1.0').setData(moment().tz("Asia/Taipei").format('YYYY-MM-DD HH:mm:ss'));
            array2.outputData('1.1').setData(moment().tz("Asia/Tokyo").format('YYYY-MM-DD HH:mm:ss'));
            array2.outputData('1.2').setData(moment().tz("America/New_York").format('YYYY-MM-DD HH:mm:ss'));
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