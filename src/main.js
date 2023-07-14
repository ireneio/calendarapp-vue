import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import router from './router'
import store from './store'
import Snackbar from 'vuejs-snackbar'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import {
  faCaretDown,
  faArrowAltCircleLeft,
  faArrowAltCircleRight
} from '@fortawesome/free-solid-svg-icons'

import 'bootstrap'

library.add(
  faCalendar,
  faCaretDown,
  faArrowAltCircleLeft,
  faArrowAltCircleRight
)
Vue.component('snackbar', Snackbar)
Vue.use(VueRouter)
Vue.component('fa', FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
