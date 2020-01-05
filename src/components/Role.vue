<template lang='pug'>
div
  v-card.mx-auto(max-width='344',
    elevation='12',
    :raised='true',
    :ripple='true')
    v-card-title.word-wrapped {{role.title}}
    v-card-subtitle {{role.description}}
    v-card-actions
      v-row
        v-col(cols="12")
          v-btn.mr-1(color='primary', @click='overlay = !overlay')
            v-icon(left='') mdi-key-plus
            span(v-if='(role && role.matchingPermissions)') {{role.matchingPermissions.length}}/
            span(v-if='(role && role.includedPermissions)') {{role.includedPermissions.length}}
            span(v-else='') 0
        v-col(cols="12")
          v-tooltip(right='', :light='true')
            template(v-slot:activator='{ on }')
              v-btn(color='primary', @click='goToRoleDetail(role.name)', v-on='on')
                v-icon(left='') mdi-format-list-bulleted-square
                | Detalles
            span Ver detalles de {{role.name}}

  v-dialog(v-model='overlay', opacity='0.8', :fullscreen='uiOrientationLandscape')
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
      v-toolbar(dark='', color='primary')
        v-btn(icon='', dark='', @click='overlay = false')
          v-icon mdi-close
        v-card-subtitle.font-italic.font-weight-bold {{role.name}}

      v-card-text
        p.caption.text-right (Swipe to dismiss/close)
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
    uiOrientationLandscape () {
      return this.$vuetify.breakpoint.height < this.$vuetify.breakpoint.width
    },
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
