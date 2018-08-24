import '../src/utils/rem';
import Vue from 'vue';
import App from './App.vue';
import {
  router
} from './router';
import VueLazyload from 'vue-lazyload';
import axios from 'axios';
import VideoPlayer from 'vue-video-player'
import * as filters from '../src/utils/date';
import '../static/css/stytle.css';
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


Vue.use(VideoPlayer)
//把 `axios` 加到 `Vue` 的原型中
Vue.prototype.axios = axios;
axios.defaults.timeout = 30000;


Vue.use(VueLazyload, {
  preLoad: 1,
  error: require('../static/images/unload.png'),
  loading: require('../static/images/loading.png'),
  attempt: 1
})

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});