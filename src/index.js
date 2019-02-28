import { init } from 'vph';
import Vph from '../vph';
import { interval } from 'rxjs';
import index_tmp from './index.html';
import Header from './header';
import Topic from './topic';
import Example from './example';
import Component1 from './component1';
import Footer from './footer';
import './style.css';

window.vD1 = Vph({
  render: index_tmp,
  attr: [],
  state: {
  },
  components: {
    Header,
    Topic,
    Example,
    Component1,
    Footer
  },
  actions: {
  },
  whenInit() {
    // this.setState()
  }
});

init('#app', vD1, false);
