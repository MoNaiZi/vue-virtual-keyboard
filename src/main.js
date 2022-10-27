import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false


// Vue.config.errorHandler = function (err, vm, info) {
//   console.log(`Error: ${err.toString()}\nInfo: ${info}`, vm);
// }

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
