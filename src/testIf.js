import { Component, tags, init } from '../vph';
const { div, p, span, input, button, ul, li } = tags;
import { interval } from 'rxjs';
import $ from 'jquery';
import moment from 'moment';

const testIf = Component(
  div({
    children: [
      'hey',
      div({
        ifDirective: 'index',
        children: [
          'index ok',
          div({
            ifDirective: 'index2',
            children: [
              'index2 ok'
            ],
          }),
        ],
      })
    ],
    state: {
      index: 0,
      index2: 0,
    },
    actions: {
      start() {
        const { index, index2 } = this.getDatas('index', 'index2');

        interval(1000).subscribe({
          next: item => {
            index.setData(item % 2);
            index2.setData(item % 4);
          }
        });
        // interval(200).subscribe({
        //   next: item => {
        //     index2.setData(item % 2);
        //   }
        // });

      }
    },
    whenInit() {
      this.start();
    }
  })
)

export default testIf;