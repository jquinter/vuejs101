import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: colors.red.darken1, // #E53935
        secondary: colors.lime.darken4, // #827717
        accent: colors.indigo.base // #3F51B5
      },
      light: {
        primary: colors.blue.lighten2, // #64B5F6
        secondary: colors.lime.lighten2, // #DCE775
        accent: colors.indigo.base // #3F51B5
      }
    }
  }
})
