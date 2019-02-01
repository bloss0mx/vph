import html from './header.vph';
import { Component } from '../vph';
import MoveTo from 'MoveTo';

// console.log(html);

const moveTo = new MoveTo();
const menu = [
  { name: '顶部', key: 'top' },
  { name: '例子', key: 'eg' },
  { name: '底部', key: 'foot' }
]

export default Component({
  render: html,
  state: {
    title: 'Vph',
    menu: menu,
    showMenu: false,
  },
  actions: {
    showMenuToggle(e) {
      const { showMenu } = this.getDatas('showMenu');
      showMenu.setData(!showMenu.showData());
    },
    clickMenu(e) {
      const key = menu.find(item => item.name === e.target.innerText).key;
      const target = document.getElementById(key);
      moveTo.move(target);
    }
  }
});