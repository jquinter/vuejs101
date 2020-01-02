<template lang='pug'>
div
  v-card.mx-auto(max-width='344',
    elevation='12',
    :raised='true',
    :ripple='true',
    @click='overlay = !overlay')
    v-card-title.word-wrapped
      div
        v-row
          v-col(cols='8', sm='9')
            | {{item.label}}
    v-card-subtitle
      | {{item.title}}
    v-card-text
      v-chip.ma-2(color='primary')
        v-avatar(left='')
            v-icon mdi-shield-account
        span(v-if='(item && item.roles)') {{item.roles.length}}
        span(v-else='') 0

  v-overlay(:value='overlay', opacity='0.8')
    v-card(
      v-touch='{\
        left: () => (overlay = false),\
        right: () => (overlay = false),\
      }',
      min-width='recommendedOverlayWidth'
      max-width='recommendedOverlayWidth'
      elevation='12'
      :raised='true'
      :ripple='false')
      v-card-subtitle.font-italic.font-weight-bold {{item.title}}

      v-card-text
        p.display-1.text--primary {{item.label}}
        small Swipe to dismiss/close

      expanded-item-permissions(:item='item', :activeRoleFilters='query')

      v-card-actions.d-flex.flex-row.justify-center
        v-tooltip(bottom='', :light='true')
          template(v-slot:activator='{ on }')
            v-btn.mx-2(fab='', small='', color='primary', @click='overlay = false', v-on='on')
              v-icon mdi-close
          span Cerrar
</template>

<script>
function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

export default {
  name: 'Permission',

  components: {
    expandedItemPermissions: lazyLoad('associatedRolesExpandedItemSlotDataTable')
  },

  computed: {
    recommendedOverlayWidth () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100vw'
        default:
          return '50vw'
      }
    }
  },

  data: () => ({
    overlay: false
  }),

  props: {
    index: {
      type: Number,
      required: true
    },
    item: {
      type: Object,
      required: true
    },
    query: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.v-card__text, .v-card__title, .mywordbreak {
  word-break: normal; /* maybe !important  */
}
</style>
