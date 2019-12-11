<template lang='pug'>
v-app#inspire
  v-navigation-drawer(v-model='drawer', app='', clipped='')
    v-list(dense='')
      v-list-item(link='')
        v-list-item-action
          v-icon mdi-view-dashboard
        v-list-item-content
          v-list-item-title Dashboard
      v-list-item(link='')
        v-list-item-action
          v-icon mdi-settings
        v-list-item-content
          v-list-item-title Settings
  v-app-bar(app='', clipped-left='')
    v-app-bar-nav-icon(@click.stop='drawer = !drawer')
    v-toolbar-title
      | IAModeler&nbsp;
      span(v-show="info.length>filteredRoles.length") {{filteredRoles.length}}/
      span(v-show="info") {{info.length}} roles
  v-content
    v-container#input-usage(fluid='')
      v-row
        v-col(cols='12', xs='12', sm='6', md='10')
          v-combobox(v-model='activeRoleFilters', :items='permissions', chips='', clearable='', label='Filtrar roles', multiple='', prepend-icon='filter_list', solo='')
            template(v-slot:selection='{ attrs, item, select, selected }')
              v-chip(v-bind='attrs', :input-value='selected', close='', @click='select', @click:close='remove(item)')
                strong {{ item }}
    v-container(fluid='')
      v-row(align='center', justify='center', v-if='false')
        v-col.shrink
          v-tooltip(right='')
            template(v-slot:activator='{ on }')
              v-btn(:href='source', icon='', large='', target='_blank', v-on='on')
                v-icon(large='') mdi-code-tags
            span Source
          v-tooltip(right='')
            template(v-slot:activator='{ on }')
              v-btn(icon='', large='', href='https://codepen.io/johnjleider/pen/bXNzZL', target='_blank', v-on='on')
                v-icon(large='') mdi-codepen
            span Codepen
      v-row(no-gutters='')
        v-col(v-for='(item, index) in filteredRoles', :key='index', cols='12', xs='12', sm='6', md='4')
          role(:role='item', :index='index+1', :query='activeRoleFilters')
  v-footer(app='')
    span © 2019
</template>

<script>
import axios from 'axios'
// import debounce from './helpers'
import Role from '@/components/Role.vue'

export default {
  name: 'app',

  components: { Role },

  props: {
    source: String
  },

  data: () => ({
    activeRoleFilters: [],
    permissions: [],
    on: null,
    rolefilter: '',
    debouncedrolefilter: '',
    filteredRoles: [],
    rolesAndMatchingPermissions: {},
    info: null,
    drawer: false,
    toolbar: {
      //
      fixed: false,
      // sets if the toolbar contents is leaving space for drawer (false) or not (true)
      clippedLeft: false
    },
    footer: {
      // sets the CSS position of the footer
      fixed: true,
      // sets if the footer is full width (true) or gives space to the drawer (false)
      clippedLeft: true
    }
  }),

  async mounted () {
    this.$vuetify.theme.dark = true

    // var dataUrl = '/data/roles_detailed_stringify.json'
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
    const rolesRaw = await axios.get(dataUrl)
    this.info = Object.freeze(rolesRaw.data.slice())
    this.filteredRoles = this.info

    const permissionsRaw = await axios.get('/data/permissions_roles.json')
    this.permissions = Object.freeze(permissionsRaw.data.slice()).map(x => x.permission)
  },

  methods: {
    filterRoles () {
      if (this.activeRoleFilters.length > 0) {
        console.log('Filtrando')
        let matchingRoles = new Set()
        let partialMatching = []
        for (let index = 0; index < this.activeRoleFilters.length; index++) {
          const filteringByRole = this.activeRoleFilters[index]

          /*
          Primero: obtener, desde el set completo de roles (info)
          todos aquellos roles que contienen el permiso que estamos buscando (filteringByRole)
          */
          partialMatching = this.info.filter(item => {
            // return item.name.toLowerCase().indexOf(filtering_by_role.toByRolee()) > -1
            // console.log(item.name, item.includedPermissions.length, item.includedPermissions.some((element) => (element.toLowerCase().indexOf(filtering_by_role.toByRolee()) > -1)))
            var regexp = new RegExp(filteringByRole, 'gi')
            return item && item.includedPermissions && item.includedPermissions.length &&
              // item.includedPermissions.some((element) => (element.toLowerCase().indexOf(filtering_by_role.toByRolee()) > -1))
              item.includedPermissions.some((element) => (regexp.test(element)))
          })

          /*
          Luego, desde este conjunto intermedio de roles,
          extraemos los permisos aludidos en la busqueda
          */
          for (let index = 0; index < partialMatching.length; index++) {
            const item = partialMatching[index]
            var currentMatch = item.includedPermissions.filter(perm => {
              var regexp = new RegExp(filteringByRole, 'gi')
              return regexp.test(perm)
            })
            console.log(currentMatch)
            if (item.name in this.rolesAndMatchingPermissions) {
              console.log('ya estaba declardo, le hago append')
              this.rolesAndMatchingPermissions[item.name] = [...this.rolesAndMatchingPermissions[item.name], ...currentMatch]
              // deduplicating
              this.rolesAndMatchingPermissions[item.name] = [...new Set(this.rolesAndMatchingPermissions[item.name])]
            } else {
              console.log('no existia, lo agrego')
              this.rolesAndMatchingPermissions[item.name] = currentMatch
            }
          }
          console.log('rolesAndMatchingPermissions', this.rolesAndMatchingPermissions)
          partialMatching.forEach(role => matchingRoles.add(role))
        }
        this.filteredRoles = Array.from(matchingRoles)
        this.filteredRoles = this.filteredRoles.map(function (item) {
          var processed = {
            ...item,
            matchingPermissions: item.name in this.rolesAndMatchingPermissions ? this.rolesAndMatchingPermissions[item.name] : null
          }
          return processed
        }, this)
      } else {
        this.filteredRoles = this.info
      }
    },
    remove (item) {
      this.activeRoleFilters.splice(this.activeRoleFilters.indexOf(item), 1)
      this.activeRoleFilters = [...this.activeRoleFilters]
    }
  },
  watch: {
    activeRoleFilters: function (newVal, oldVal) {
      this.rolesAndMatchingPermissions = {}
      this.filterRoles()
    }
  }
  /*
    rolefilter: debounce(function (newVal) {
      console.log('setting...')
      this.debouncedrolefilter = newVal
    }, 1500)
  */
}
</script>
