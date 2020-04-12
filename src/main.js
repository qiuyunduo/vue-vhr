import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'font-awesome/css/font-awesome.min.css';

import { postKeyValueRequest, postRequest, getRequest, putRequest, deleteRequest } from './util/api'

Vue.prototype.postKeyValueRequest = postKeyValueRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.getRequest = getRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.deleteRequest = deleteRequest

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.filter('simpleDateFormat',function(val) {
  if(val && val.indexOf(' ') != -1) {
    val = val.split(' ')[0];
    return val;
  }
  return val;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
