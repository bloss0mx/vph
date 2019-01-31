import html from './header.html';
import { Component } from '../vph';

export default Component({
  render: html,
  state: {
    title: 'Vph',
    menu: [
      { name: 'Menu' },
      { name: 'Title' },
      { name: 'Name' }
    ],
    showMenu: false,
  },
  actions: {
    showMenuToggle(e) {
      console.log(e);
      const { showMenu } = this.getDatas('showMenu');
      showMenu.setData(!showMenu.showData());
    },
    clickMenu(e) {
      console.log(e);
    }
  }
});