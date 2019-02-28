import html from './topic.vph';
import { Component } from '../vph';
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
    // this.setState();
    // this.setState(state => {
    //   return {
    //     preArr: [],
    //     arr: [],
    //     ifyo: false,
    //     subArr: [],
    //     diff: '',
    //   };
    // })
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
      this.setState(state => {
        state.preArr = [...state.preArr, { key: '-2', name: '-2' }];
        return state;
      });
    }, 4000);
    setTimeout(() => {
      this.setState(state => {
        state.ifyo = true;
        return state;
      });
    }, 5000);
    setTimeout(() => {
      this.setState(state => {
        state.subArr = [...state.subArr, { key: 'e', name: 'e' }];
        return state;
      });
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