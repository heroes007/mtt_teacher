import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import store from './store';
import router from './config/index';
import './css';
import iView from 'view-design';

Vue.use(iView);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
