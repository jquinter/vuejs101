import Vue from 'vue'
import App from '@/App.vue'
import vuetify from '@/plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'
import vueDebounce from 'vue-debounce'

Vue.config.productionTip = false
Vue.use(vueDebounce, { lock: true, defaultTime: '400ms', listenTo: 'keyup' })

Vue.filter('highlight', function (words, query) {
  return words.replace(query, '<span class="highlightText">' + query + '</span>')
})

Vue.filter('highlightRegExp', function (words, query) {
  var highlighted = words
  if (query) {
    var regexp = new RegExp(query, 'gi')
    return words.replace(regexp, function (x) {
      return '<span class="highlightText">' + x + '</span>'
    })
  }
  return highlighted
})

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
