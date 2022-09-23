import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import VueWorker from 'vue-worker'
Vue.use(VueWorker)
new Vue({
  render: h => h(App),
}).$mount('#app')
