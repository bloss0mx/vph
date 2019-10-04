import { Component } from "vph";
import { interval, pipe, from } from "rxjs";
import { throttleTime } from "rxjs/operators";
import moment from "moment";
import template from "./table.vph";

// const timer = area => moment().tz(area).format('YYYY-MM-DD HH:mm:ss');
const time = area =>
  moment()
    .utc()
    .utcOffset(area)
    .format("YYYY-MM-DD HH:mm:ss");

export default Component({
  render: template,
  state: {
    array2: [["北京", "东京", "纽约"], [time(-8), time(-9), time(+5)]],
    count: 0,
  },
  actions: {
    _interval() {
      const { array2 } = this.getDatas("array2");
      interval(1000).subscribe({
        next: () => {
          // array2.showData('1.0').setData(timer("Asia/Taipei"));
          // array2.showData('1.1').setData(timer("Asia/Tokyo"));
          // array2.showData('1.2').setData(timer("America/New_York"));
          array2.showData("1.0").setData(time(-8));
          array2.showData("1.1").setData(time(-9));
          array2.showData("1.2").setData(time(+5));
        },
      });
    },
    timeTable() {
      interval(1).subscribe({
        next: () => {
          this.setState(state => {
            // console.log(state.array2[0].__ARRAY_KEY__);
            const _state = { ...state };
            _state.array2 = [_state.array2[0], [time(-8), time(-9), time(+5)]];
            return _state;
          });
        },
      });
    },
    add2Table() {
      interval(1000).subscribe({
        next: () => {
          this.setState(state => {
            // console.log(state.array2[0].__ARRAY_KEY__);
            const _state = { ...state };
            const other = [..._state.array2];
            const first = other.splice(0, 1);
            _state.array2 = [
              ...first,
              [time(-8), time(-9), time(+5)],
              ...other,
            ];
            return _state;
          });
        },
      });
    },
    countIt() {
      const countTest = interval(1).subscribe({
        next: () => {
          this.setState(state => {
            const _state = state;
            _state.count++;
            return _state;
          });
        },
      });
      setTimeout(() => {
        countTest.unsubscribe();
      }, 60 * 60 * 1000);
    },
  },
  whenInit() {
    this.countIt();
    // this._interval();
    this.timeTable();
    // this.add2Table();
  },
});
