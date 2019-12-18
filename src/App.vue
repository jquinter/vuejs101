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
    v-toolbar-title
      | IAModeler&nbsp;
      span(v-if="info && info.length>filteredRoles.length") {{filteredRoles.length}}/
      span(v-if="info && info.length>0") {{info.length}} roles
    my-toolbar-progress-bar(:loading='loading', color='lime accent-3', slot='extension')
  router-view
</template>

<script>
import axios from 'axios'
import MyToolbarProgressBar from '@/components/MyToolbarProgressBar.vue'
import { mapState } from 'vuex'

export default {
  name: 'app',

  components: { MyToolbarProgressBar },

  data: () => ({
    drawer: false
  }),

  computed: {
    ...mapState(['loading', 'filteredRoles', 'info', 'permissions'])
  },

  methods: {
    goTo (name) {
      this.$router.push({ name: name })
    }
  },

  async mounted () {
    this.$vuetify.theme.dark = true

    var dataUrl = '/data/roles_detailed.json'

    //  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
    /*
    axios.get(dataUrl).then(
      // response => (console.log(JSON.parse(response.data))),
      response => {
        this.info = response.data.slice(350, 400)
        this.filteredRoles = this.info
      },
      error => console.error(error)
    )
    */
    this.$store.commit('setLoading', true)
    const rolesRaw = await axios.get(dataUrl)
    this.$store.commit('setInfo', Object.freeze(rolesRaw.data.slice()))
    this.$store.commit('setFilteredRoles', Object.freeze(rolesRaw.data.slice()))

    const permissionsRaw = await axios.get('/data/permissions_roles.json')
    this.$store.commit('setPermissions', Object.freeze(permissionsRaw.data.slice()).map(x => x.permission))
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
</style>
