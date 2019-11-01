import html from "./topic.vph";
import { Component } from "../vph";
import moment from "moment";

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
  },
  whenMount() {
    this.maxTableChg();
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
