import html from './topic.vph';
import { Component } from 'vph';
import moment from 'moment';


export default Component({
  render: html,
  state: {
    preArr: [],
    arr: ['a', 'c'].map(item => ({ name: item, key: item })),
    ifyo: false,
    subArr: [],
    diff: '',
  },
  whenInit() {
    setTimeout(() => {
      this.setState(state => {
        state.diff = 'haha';
        return state;
      });
    }, 1000);
    const { preArr, subArr, arr, ifyo } = this.getDatas('arr', 'preArr', 'subArr', 'ifyo');
    setTimeout(() => {
      this.setState(state => {
        state.arr = [...state.arr];
        state.arr.splice(1, 0, { name: 'b', key: 'b' }, { name: 'd', key: 'd' });
        return state;
      });
    }, 2000);
    // setTimeout(() => {
    //   this.setState(state => {
    //     state.arr = [...state.arr, ];
    //     return state;
    //   });
    // }, 2000);
    setTimeout(() => {
      this.setState(state => {
        state.arr = [{ name: '-1', key: '-1' }, ...state.arr];
        return state;
      });
    }, 3000);
    setTimeout(() => {
      preArr.push('-2');
    }, 4000);
    setTimeout(() => {
      ifyo.setData(true);
    }, 5000);
    setTimeout(() => {
      subArr.push('e');
    }, 6000);
    setTimeout(() => {
      this.setState(state => {
        state.arr = [];
        return state;
      });
    }, 7000);
    setTimeout(() => {
      this.setState(state => {
        return {
          preArr: [],
          arr: ['a', 'c'].map(item => ({ name: item, key: item })),
          ifyo: false,
          subArr: [],
          diff: '',
        };
      })
    }, 8000);
    setTimeout(() => {
      console.dir(this.storeKeeper.store.toJS());
    }, 9000);
  }
});