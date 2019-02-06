import html from './topic.vph';
import { Component } from 'vph';
import moment from 'moment';


export default Component({
  render: html,
  state: {
    preArr: [],
    arr: ['a', 'c'],
    ifyo: false,
    subArr: [],
  },
  whenInit() {
    const { preArr, subArr, arr, ifyo } = this.getDatas('arr', 'preArr', 'subArr', 'ifyo');
    setTimeout(() => {
      arr.insertTo('b', 1);
    }, 1000);
    setTimeout(() => {
      arr.push('d');
    }, 2000);
    setTimeout(() => {
      arr.unshift('-1');
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
  }
});