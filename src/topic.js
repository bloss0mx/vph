import html from "./topic.vph";
import { Component } from "../vph";
import moment from "moment";
import { timer, interval, combineLatest, BehaviorSubject } from "rxjs";
import { map, scan, tap, switchMap, pluck } from "rxjs/operators";

const initialColor = [200, 200, 200];
const randomColor = () => Math.floor(Math.random() * 255);
const bigV = new BehaviorSubject("").pipe(
  switchMap(item =>
    combineLatest(
      timer(0, 2000).pipe(
        map(() => [randomColor(), randomColor(), randomColor()])
      ),
      timer(0, 10)
    )
  ),
  // tap(item => {
  //   if (item[0][0] < 105 || item[0][1] < 105 || item[0][2] < 105)
  //     console.warn("hey!", item[0]);
  // }),
  map(item => item[0]),
  scan(
    (sum, curr) => {
      const _sum = { ...sum };
      if (
        sum.target[0] !== curr[0] ||
        sum.target[1] !== curr[1] ||
        sum.target[2] !== curr[2]
      ) {
        _sum.current = [];
        sum.current.forEach((_, idx) => {
          _sum.current[idx] = (curr[idx] - sum.target[idx]) / 200;
        });
        _sum.target = [...curr];
      }
      _sum.answer = [];
      sum.answer.forEach((_, idx) => {
        _sum.answer[idx] = sum.answer[idx] + _sum.current[idx];
      });
      return _sum;
    },
    { target: initialColor, current: initialColor, answer: initialColor }
  ),
  map(item => item.answer),
  // map(item => item.map(i => Math.floor(i))),
  map(item => `rgb(${item[0]},${item[1]},${item[2]})`)
);
// .subscribe({
//   next: val => {
//     console.log(val);
//   },
// });

export default Component({
  render: html,
  state: {
    preArr: [],
    arr: ["a", "c"].map(item => ({
      name: item,
    })),
    ifyo: false,
    subArr: [],
    diff: "",
    table: [],
    color: "",
  },
  actions: {
    maxTableChg() {
      setInterval(() => {
        this.setState(state => {
          state.table = [];
          const LEN = 10;
          for (let i = 0; i < LEN; i++) {
            const tmp = [];
            for (let j = 0; j < LEN; j++) {
              const tmp2 = [];
              for (let k = 0; k < LEN; k++) {
                tmp2.push(Math.floor(10 * Math.random()));
              }
              tmp.push(tmp2);
            }
            state.table.push(tmp);
          }
          return state;
        });
      }, 5000);
    },
    setColor(color) {
      this.setState(state => {
        const _state = { ...state };
        _state.color = color;
        return _state;
      });
    },
  },
  whenMount() {
    this.maxTableChg();
    const that = this;
    bigV.subscribe({
      next: val => {
        that.setColor(val);
      },
    });
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.diff = 'haha';
    //     return state;
    //   });
    // }, 1000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.arr = [...state.arr];
    //     state.arr.splice(1, 0, {
    //       name: 'b'
    //     }, {
    //       name: 'd'
    //     });
    //     return state;
    //   });
    // }, 2000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.arr = [{
    //       name: '-1'
    //     }, ...state.arr];
    //     return state;
    //   });
    // }, 3000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.preArr = [...state.preArr, {
    //       name: '-2'
    //     }];
    //     return state;
    //   });
    // }, 4000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.ifyo = true;
    //     return state;
    //   });
    // }, 5000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.subArr = [...state.subArr, {
    //       name: 'e'
    //     }];
    //     return state;
    //   });
    // }, 6000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.arr = [];
    //     return state;
    //   });
    // }, 7000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     return {
    //       preArr: [],
    //       arr: ['a', 'c'].map(item => ({
    //         name: item
    //       })),
    //       ifyo: false,
    //       subArr: [],
    //       diff: '',
    //     };
    //   })
    // }, 8000);
    // setTimeout(() => {
    //   console.dir(this.storeKeeper.store.toJS());
    // }, 9000);
  },
});
