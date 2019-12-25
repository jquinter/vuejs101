import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App'
import vuetify from '@/plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import routes from '@/routes'
import store from '@/store'

// import infiniteScroll from 'vue-infinite-scroll'

Vue.use(VueRouter)

const router = new VueRouter({ routes })

// Vue.use(infiniteScroll)

Vue.config.productionTip = true
Vue.config.performance = false

Vue.filter('highlight', function (words, query) {
  return words.replace(query, '<span class="highlightText">' + query + '</span>')
})

Vue.filter('highlightRegExp', function (words, querySet) {
  var highlighted = words
  for (let index = 0; index < querySet.length; index++) {
    const query = querySet[index]
    var regexp = new RegExp(query, 'gi')
    highlighted = highlighted.replace(regexp, function (x) {
      return '<span class="highlightText">' + x + '</span>'
    })
  }
  return highlighted
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
