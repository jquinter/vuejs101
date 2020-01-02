<template lang="pug">
v-content
  v-container#input-usage(fluid='')
    v-row
      v-col(cols='12', align='center')
        v-checkbox(v-model='lpp',
          color='lime accent-3',
          label='Apply Least Priviledge Principle on suggestions')
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Settings',

  computed: {
    ...mapState([
      'uiCompareViewLeastPriviledgePrinciple'
    ]),
    lpp: {
      // https://itnext.io/anyway-this-is-how-to-use-v-model-with-vuex-computed-setter-in-action-320eb682c976
      set (value) {
        this.$store.commit('setUiCompareViewLeastPriviledgePrinciple', value)
      },
      get () {
        return this.uiCompareViewLeastPriviledgePrinciple
      }
    }
  }
}
</script>
