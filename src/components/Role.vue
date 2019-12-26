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
            | {{role.title}}
          v-col(cols='4', sm='3')
            v-tooltip(right='', :light='true')
              template(v-slot:activator='{ on }')
                v-btn(fab='', small='', color='primary', @click='goToRoleDetail(role.name)', v-on='on')
                  v-icon(dark='') mdi-format-list-bulleted-square
              span Ver detalles de {{role.name}}
            v-btn(text='')
              v-chip.ma-2(color='primary')
                v-avatar(left='')
                  v-icon mdi-key-plus
                span(v-if='(role && role.matchingPermissions)') {{role.matchingPermissions.length}}/
                span(v-if='(role && role.includedPermissions)') {{role.includedPermissions.length}}
                span(v-else='') 0
    v-card-subtitle
      | {{role.description}}

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
      v-card-subtitle.font-italic.font-weight-bold {{role.name}}

      v-card-text
        p.display-1.text--primary {{role.title}}
        .text--primary {{role.description}}

      expanded-item-permissions(:item='role', :activeRoleFilters='query')

      v-card-actions.d-flex.flex-row.justify-center
        v-tooltip(bottom='', :light='true')
          template(v-slot:activator='{ on }')
            v-btn.mx-2(fab='', small='', color='primary', @click='goToRoleDetail(role.name)', v-on='on')
              v-icon(dark='') mdi-format-list-bulleted-square
          span Ver detalles de {{role.name}}
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
  name: 'Role',

  components: {
    expandedItemPermissions: lazyLoad('includedPermissionsExpandedItemSlotDataTable')
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

  methods: {
    goToRoleDetail (name) {
      this.$router.push({ name: 'role', params: { name } })
    }
  },

  props: {
    index: {
      type: Number,
      required: true
    },
    role: {
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
