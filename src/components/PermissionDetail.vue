<template lang='pug'>
v-content
  v-container
    v-btn.mx-auto(small='', color='primary', @click='goTo("permissions")') Volver al listado de permisos

    v-row
      v-col(cols='12', md='8', align='justify')
        v-card.mx-auto(v-if='item', elevation='12', :raised='true', :ripple='true')
          v-card-title.word-wrapped {{item.label}}
          v-card-subtitle.caption {{item.title}}
          v-card-text
            v-chip(label='')
              v-avatar(left='')
                v-icon mdi-shield-account
              span(v-if='(item && item.roles)') {{item.roles.length}}
              span(v-else='') 0

    v-row
      v-col.d-block.d-md-none(cols='12')
        v-tabs(grow='', icons-and-text='')
          v-tab
            | Roles
            v-icon mdi-shield-account
          v-tab-item
            v-card-text
              expanded-item-permissions(:item='item', :activeRoleFilters='[]')

      v-col.d-none.d-md-block(cols='12', align='justify')
        v-card
          v-card-subtitle
            v-icon.pr-2 mdi-shield-account
            | Included in these roles
          v-card-text
            expanded-item-permissions(:item='item', :activeRoleFilters='[]')
</template>
<script>
import { mapState } from 'vuex'
function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

export default {
  name: 'PermissionDetail',
  components: {
    expandedItemPermissions: lazyLoad('associatedRolesExpandedItemSlotDataTable')
  },

  computed: {
    ...mapState(['drawer', 'loading', 'info', 'permissionsRaw']),
    debug () {
      return process.env.NODE_ENV === 'production' ? ''
        : `${this.$vuetify.breakpoint.name} (${this.$vuetify.breakpoint.width}X${this.$vuetify.breakpoint.height})`
    },
    item () {
      return this.permissionsRaw.filter(item => {
        var regexp = new RegExp(this.$route.params.name, 'gi')
        return item && item.title && regexp.test(item.title)
      })[0]
    }
  },
  methods: {
    goTo (name) {
      this.$router.push({ name: name })
    }
  }
}
</script>
