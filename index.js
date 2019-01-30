import { init } from './vph';
import Vph from './vph';
import { interval } from 'rxjs';
import index_tmp from './index_tmp.html';
import Header from './src/header';
import Topic from './src/topic';
import Example from './src/example';
import Component1 from './src/component1';
import Footer from './src/footer';
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
  }
});

init('#app', vD1, false);
