<template lang="pug">
v-content
  v-container#input-usage(fluid='')
    v-row
      v-col(cols='12', align='center')
        v-checkbox(v-model='lpp',
          color='lime accent-3',
          label='Apply Least Priviledge Principle on suggestions')
      v-col
        v-data-iterator(v-if='screenStats',
          :sort-by="['type', 'name']",
          :sort-desc="[false, false]",
          :items-per-page=15,
          :items='screenStats')
          template(v-slot:item='props')
            v-row
              v-col {{props.item.name}}
              v-col
                span {{props.item.value}}

</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Settings',

  computed: {
    ...mapState([
      'uiCompareViewLeastPriviledgePrinciple'
    ]),
    screenStats () {
      return process.env.NODE_ENV === 'production' ? {}
        : Object.keys(this.$vuetify.breakpoint)
          .filter(item => typeof this.$vuetify.breakpoint[item] !== 'object')
          .filter(item => typeof this.$vuetify.breakpoint[item] !== 'boolean' || (typeof this.$vuetify.breakpoint[item] === 'boolean' && this.$vuetify.breakpoint[item]))
          .map(key => ({ name: key, value: this.$vuetify.breakpoint[key], type: typeof this.$vuetify.breakpoint[key] }))
    },
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
