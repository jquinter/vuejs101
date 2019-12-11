import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vueDebounce from 'vue-debounce'

Vue.config.productionTip = true
Vue.config.performance = false
Vue.use(vueDebounce, { lock: true, defaultTime: '400ms', listenTo: 'keyup' })

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
  render: h => h(App)
}).$mount('#app')
