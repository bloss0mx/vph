import html from './topic.html';
import { Component } from '../vph';
import moment from 'moment';
import STYLE from './testLess.less';

console.log(STYLE);

export default Component({
  render: html,
  state: {
    arr: [],
    style: STYLE
  },
  whenInit() {
    // const { arr } = this.getDatas('arr');
    // setInterval(() => {
    //   arr.unshift(moment().format('HH:mm:ss'));
    // }, 1000);
  }
});