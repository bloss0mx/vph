import html from './topic.html';
import { Component } from '../vph';
import moment from 'moment';

export default Component({
  render: html,
  state: {
    arr: [],
  },
  whenInit() {
    const { arr } = this.getDatas('arr');
    setInterval(() => {
      arr.unshift(moment().format('HH:mm:ss'));
    }, 1000);
  }
});