import html from './header.html';
import { Component } from '../vph';

export default Component({
  render: html,
  state: {
    title: 'Vph',
    menu: [
      'Menu',
      'Title',
      'Name'
    ],
    showMenu: false,
  },
  actions: {
    showMenuToggle() {
      const { showMenu } = this.getDatas('showMenu');
      showMenu.setData(!showMenu.showData());
    }
  }
});