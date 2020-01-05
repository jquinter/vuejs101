<template lang='pug'>
v-content
  v-container
    v-btn.mx-auto(small='', color='primary', @click='goTo("roles")') Volver al listado de roles

    v-row
      v-col(cols='12', md='8', align='justify')
        v-card.mx-auto(v-if='role', elevation='12', :raised='true', :ripple='true')
          v-card-title.word-wrapped {{role.title}}
          v-card-subtitle.caption {{role.name}}
          v-card-text
            v-chip(label='')
              v-avatar(left='')
                v-icon mdi-key-plus
              span(v-if='(role && role.includedPermissions)') {{role.includedPermissions.length}}
              span(v-else='') 0
            span.px-1 {{role.description}}

      v-col.d-block.d-md-none(cols='12')
        v-tabs(grow='', icons-and-text='')
          v-tab
            | Permissions
            v-icon mdi-key-plus
          v-tab
            | Map
            v-icon mdi-view-dashboard

          v-tab-item
            v-card-text
              expanded-item-permissions(:item='role', :activeRoleFilters='[]')
          v-tab-item
            v-card-text
              TreeMap(v-if='role',
                :treeMapRawData='role.includedPermissions',
                :containerWidth='containerWidth',
                :containerHeight='containerHeight')

      v-col.d-none.d-md-block(md='5', align='justify')
        v-card
          v-card-subtitle
            v-icon.pr-2 mdi-key-plus
            | Included permissions
          v-card-text
            expanded-item-permissions(:item='role', :activeRoleFilters='[]')
      v-col.d-none.d-md-block(md='7', align='justify')
        v-card
          v-card-subtitle
            v-icon.pr-2 mdi-view-dashboard
            | Permissions Map
          v-card-text(ref='container')
            TreeMap(v-if='role',
              :treeMapRawData='role.includedPermissions',
              :containerWidth='containerWidth',
              :containerHeight='containerHeight')

</template>
<script>
import { mapState } from 'vuex'
function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

export default {
  name: 'RoleDetail',
  components: {
    expandedItemPermissions: lazyLoad('includedPermissionsExpandedItemSlotDataTable'),
    Role: lazyLoad('Role'),
    TreeMap: lazyLoad('TreeMap')
  },

  data: () => ({
    headers: [{ 'text': 'Permisos incluídos', 'sortable': 'true', 'value': 'name' }],
    updateTreeMapContainerDims: true,
    containerHeight: 0,
    containerWidth: 0
  }),

  computed: {
    ...mapState(['drawer', 'loading', 'filteredRoles', 'info', 'permissions']),
    debug () {
      return process.env.NODE_ENV === 'production' ? ''
        : `${this.$vuetify.breakpoint.name} (${this.$vuetify.breakpoint.width}X${this.$vuetify.breakpoint.height})`
    },
    screenWidth () {
      return this.$vuetify.breakpoint.width
    },
    role () {
      return this.info.filter(item => {
        var regexp = new RegExp(this.$route.params.name, 'gi')
        return item && item.name && regexp.test(item.name)
      })[0]
    }
  },
  methods: {
    generateData (arrayData) {
      return arrayData.map(function (item) {
        return { name: item, value: item }
      }, this)
    },
    goTo (name) {
      this.$router.push({ name: name })
    },
    onResize () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          this.containerHeight = this.$vuetify.breakpoint.height
          this.containerWidth = this.$vuetify.breakpoint.width - 56
          break
        default:
          if (this.$refs['container']) {
            this.containerHeight = this.$refs['container'].clientHeight
            this.containerWidth = this.$refs['container'].clientWidth - 32
            break
          }
          this.containerHeight = this.$vuetify.breakpoint.height
          this.containerWidth = this.$vuetify.breakpoint.width - 56
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.onResize()
    })
  },
  watch: {
    screenWidth: function (val, oldVal) {
      this.onResize()
    }
  }
}
</script>
