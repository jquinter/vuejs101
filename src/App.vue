<template lang='pug'>
v-app#inspire
  v-navigation-drawer(v-model='drawer', app='', clipped='')
    v-list(dense='')
      v-list-item(link='', @click='goTo("home")')
        v-list-item-action
          v-icon mdi-view-dashboard
        v-list-item-content
          v-list-item-title Dashboard
      v-list-item(link='')
        v-list-item-action
          v-icon mdi-settings
        v-list-item-content
          v-list-item-title Settings
  v-app-bar(app='',
    clipped-left='',
    extension-height='0',
    fixed,
    overflow
    )
    v-app-bar-nav-icon(@click.stop='drawer = !drawer')
    v-toolbar-title IAModeler
    v-spacer
    v-btn(@click='uiSnackbarRoles = true')
      v-icon mdi-shield-account
      span(v-if="info && info.length>filteredRoles.length")
        | {{filteredRoles.length}}/
      span(v-if="info && info.length>0")
        | {{info.length}}
    v-btn(v-if="permissions && permissions.length>0", @click='uiSnackbarPermissions = true')
      v-icon mdi-key-plus
      | {{permissions.length}}
    my-toolbar-progress-bar(:loading='loading', color='lime accent-3', slot='extension')
  router-view

  v-snackbar(v-model='uiSnackbarRoles', left='', top='', vertical='')
    | Hay
    span(v-if="info && info.length>filteredRoles.length")
      | {{filteredRoles.length}}/
    span(v-if="info && info.length>0")
      | {{info.length}}
    | roles
    v-btn(icon='', @click='uiSnackbarRoles = false')
      v-icon mdi-window-close
  v-snackbar(v-model='uiSnackbarPermissions', left='', top='', vertical='')
    | Hay {{permissions.length}} permisos
    v-btn(icon='', @click='uiSnackbarPermissions = false')
      v-icon mdi-window-close
</template>

<script>
import axios from 'axios'
import MyToolbarProgressBar from '@/components/MyToolbarProgressBar.vue'
import { mapState } from 'vuex'

export default {
  name: 'app',

  components: { MyToolbarProgressBar },

  data: () => ({
    drawer: false,
    uiSnackbarRoles: false,
    uiSnackbarPermissions: false
  }),

  computed: {
    ...mapState(['activeRoleFilters', 'loading', 'filteredRoles', 'info', 'permissions', 'roles'])
  },

  methods: {
    goTo (name) {
      this.$router.push({ name: name })
    }
  },

  async mounted () {
    this.$vuetify.theme.dark = true

    var dataUrl = '/data/roles_detailed.json'

    this.$store.commit('setLoading', true)
    const rolesRaw = await axios.get(dataUrl)
    this.$store.commit('setInfo', Object.freeze(rolesRaw.data.slice()))
    if (this.activeRoleFilters.length === 0) {
      this.$store.commit('setFilteredRoles', Object.freeze(rolesRaw.data.slice()))
    }
    this.$store.commit('setRoles', rolesRaw.data.slice().map(x => ({ 'value': x.name, 'label': x.title })))

    const permissionsRaw = await axios.get('/data/permissions_roles.json')
    this.$store.commit('setPermissions', permissionsRaw.data.slice().map(x => ({ 'value': x.permission, 'label': x.permission })))
    this.$store.commit('setLoading', false)
  }
}
</script>

<style>
.v-toolbar__extension {
  padding: 0px !important;
}
tbody tr:nth-of-type(odd), .v-expansion-panel-content p:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, .15);
}
.highlightText {
  background-color: yellow;
  color: black;
}
</style>
