import { vdFactory, tags } from './vph';
const { div, p, span, input, button, ul, li } = tags;
import { interval } from 'rxjs';
import moment from 'moment';


const Time = vdFactory(
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
				const { time } = this.storeKeeper.outputStore()('time');
				interval(1000).subscribe({
					next: item => {
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

export default Time;