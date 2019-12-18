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
  v-content
    v-container#input-usage(fluid='')
      v-row
        v-col(cols='12', xs='12', sm='6', md='9', align='center')
          v-combobox(v-model='activeRoleFilters',
            :items='permissions',
            chips='',
            clearable='',
            label='Filtrar roles',
            multiple='',
            prepend-icon='filter_list',
            solo='')
            template(v-slot:selection='{ attrs, item, select, selected }')
              v-chip(v-bind='attrs', :input-value='selected', close='', @click='select', @click:close='remove(item)')
                strong {{ item }}
        v-col(cols='12', xs='12', sm='6', md='3', align='center')
          v-btn.ma-2(color='lime accent-3', outlined='', v-on:click='uiSwitchView()')
            span {{ uiButtonSwitchViewText }}
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
              v-btn(icon='',
                large='',
                href='https://codepen.io/johnjleider/pen/bXNzZL',
                target='_blank',
                v-on='on')
                v-icon(large='') mdi-codepen
            span Codepen
      v-row(dense='')
        v-col(v-show='!uiIsCompareView',
          v-for='(item, index) in filteredRoles',
          :key='index',
          v-if='index >= (uiPage-1)*uiItemsPerPage && index < (uiPage)*uiItemsPerPage',
          cols='12',
          xs='12',
          sm='6',
          md='3')
          role(:role='item', :index='index+1', :query='activeRoleFilters')
        v-col(v-show='uiIsCompareView')
          template
            v-data-table.elevation-1(:headers.sync='uiCompareViewHeaders',
              :items='filteredRoles',
              item-key='name',
              :page.sync='uiPage',
              :items-per-page.sync='uiItemsPerPage',
              :footer-props='uiCompareViewFooterProps',
              :sort-by.sync='uiCompareViewSortBy',
              :sort-desc.sync='uiCompareViewSortDesc',
              :single-expand='uiCompareViewSingleExpand',
              show-expand='',
              :expanded.sync='uiCompareViewExpanded',
              multi-sort='')
              template(v-slot:top='', v-if='activeRoleFilters.length > 0')
                v-toolbar(flat='')
                  v-toolbar-title(v-if='false') Roles
                  v-spacer
                  v-switch.mt-2(v-model='uiCompareViewLeastPriviledgePrinciple', color='lime accent-3', label='Least Priviledge Principle')
              template(v-slot:expanded-item='{ headers, item }')
                td(:colspan='headers.length')
                  v-card
                    v-card-title
                      | Permisos incluídos
                      v-spacer
                      v-text-field(v-model='uiCompareViewExpandedSearch',
                        append-icon='search',
                        label='Filtrar lista de permisos',
                        single-line='')
                    v-data-table(
                      :dense='false'
                      :dark='true'
                      :headers="[{'text': 'permission name', 'sortable': 'true', 'value': 'name'}]"
                      :items="generateData(item.includedPermissions)"
                      :search='uiCompareViewExpandedSearch'
                    )
                      template(v-slot:body='{ items }')
                        tbody
                          tr(v-for='(perm, iperm) in items', :key='iperm')
                            td.text-start(v-html='$options.filters.highlightRegExp(perm.name,activeRoleFilters)')

  v-footer(app='', padless='')
    v-row.mt-2(align='center', justify='center')
      v-col(align='center', cols='12', md='3')
        span.grey--text Items per page
        v-menu(offset-y='')
          template(v-slot:activator='{ on }')
            v-btn.ml-2(dark='', text='', color='lime darken-1', v-on='on')
              | {{ uiItemsPerPage }}
              v-icon mdi-chevron-down
          v-list
            v-list-item(v-for='(number, index) in uiItemsPerPageArray',
              :key='index',
              @click='uiUpdateItemsPerPage(number)')
              v-list-item-title {{ number }}
        v-spacer

        span.mr-4.grey--text(v-if='false')
          | Page {{ uiPage }} of {{ uiNumberOfPages }}

      v-col(align='center', cols='12', md='6')
        v-pagination(v-model='uiPage',
          color='lime darken-3',
          :length='uiNumberOfPages',
          :total-visible='9')

      v-col(align='center', cols='12', md='2')
        v-btn.mr-1(fab='', dark='', color='lime darken-3', @click='uiFormerPage')
          v-icon mdi-chevron-left

        v-btn.ml-1(fab='', dark='', color='lime darken-3', @click='uiNextPage')
          v-icon mdi-chevron-right

      v-col(align='center', cols='12', md='1')
        v-chip(outlined='') © 2019
</template>

<script>
import axios from 'axios'
// import debounce from './helpers'
import MyToolbarProgressBar from '@/components/MyToolbarProgressBar.vue'
import Role from '@/components/Role.vue'

export default {
  name: 'app',

  components: { MyToolbarProgressBar, Role },

  props: {
    source: String
  },

  data: () => ({
    uiButtonSwitchViewText: 'activar modo comparación',
    uiIsCompareView: false,
    uiItemsPerPage: 4,
    uiItemsPerPageArray: [4, 8, 12, -1],
    uiPage: 1,
    uiCompareViewLeastPriviledgePrinciple: false,
    uiCompareViewSortBy: [],
    uiCompareViewSortDesc: [],
    uiCompareViewFooterProps: {
      'disable-items-per-page': false,
      'items-per-page-options': [4, 8, 12, -1]
    },
    uiCompareViewExpanded: [],
    uiCompareViewSingleExpand: false,
    uiCompareViewExpandedSearch: '',
    uiCompareViewHeaders: [
      {
        text: 'Name',
        align: 'left',
        sortable: true,
        value: 'name'
      },
      {
        text: 'Title',
        align: 'left',
        sortable: true,
        value: 'title'
      },
      {
        text: '# of permissions',
        align: 'center',
        sortable: true,
        value: 'includedPermissions.length'
      },
      { text: '', value: 'data-table-expand' }
    ],
    activeRoleFilters: [],
    permissions: [],
    loading: false,
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

  computed: {
    uiNumberOfPages () {
      return Math.ceil(this.filteredRoles.length / this.uiItemsPerPage)
    }
  },

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
    this.load_start('cargando datos')
    const rolesRaw = await axios.get(dataUrl)
    this.info = Object.freeze(rolesRaw.data.slice())
    this.filteredRoles = this.info

    const permissionsRaw = await axios.get('/data/permissions_roles.json')
    this.permissions = Object.freeze(permissionsRaw.data.slice()).map(x => x.permission)
    this.load_finished('cargando datos')
  },

  beforeUpdate () {
    console.log('empieza update')
    // this.load_start('beforeUpdate')
    // this.load_start()
  },

  updated () {
    console.log('termina update')
    // this.load_finished('updated')
    // this.load_finished()
  },

  methods: {
    generateData (arrayData) {
      return arrayData.map(function (item) {
        return { name: item, value: item }
      }, this)
    },
    load_start (msg) {
      if (msg) {
        console.log('starting...', msg)
      }
      this.loading = true
    },
    load_finished (msg) {
      if (msg) {
        console.log('done...', msg)
      }
      this.loading = false
    },
    filterRoles () {
      if (this.activeRoleFilters.length > 0) {
        let matchingRoles = new Set()
        let partialMatching = []
        for (let index = 0; index < this.activeRoleFilters.length; index++) {
          /* for each role filter */

          const filteringByRole = this.activeRoleFilters[index]

          /* Ampliación de filtro de búsqueda: podemos buscar por calce de codigo de rol */
          if (filteringByRole.startsWith('roles/')) {
            partialMatching = this.info.filter(item => {
              var regexp = new RegExp(filteringByRole, 'gi')
              return item && item.name && regexp.test(item.name)
            })
          } else {
            /* buscamos permisos puntuales */

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
              if (item.name in this.rolesAndMatchingPermissions) {
                this.rolesAndMatchingPermissions[item.name] = [...this.rolesAndMatchingPermissions[item.name], ...currentMatch]
                // deduplicating
                this.rolesAndMatchingPermissions[item.name] = [...new Set(this.rolesAndMatchingPermissions[item.name])]
              } else {
                this.rolesAndMatchingPermissions[item.name] = currentMatch
              }
            }
          }
          /*
          acá mantenemos un set de todos los posibles roles que se han encontrado
          al usar los filtros de busqueda especificados
          */
          partialMatching.forEach(role => matchingRoles.add(role))
          this.filteredRoles = Array.from(matchingRoles)
          this.filteredRoles = this.filteredRoles.map(function (item) {
            var processed = {
              ...item,
              includedPermissionsSize: item.includedPermissions.length,
              matchingPermissions: item.name in this.rolesAndMatchingPermissions ? this.rolesAndMatchingPermissions[item.name] : null,
              matchingPermissionsSize: item.name in this.rolesAndMatchingPermissions ? this.rolesAndMatchingPermissions[item.name].length : null
            }
            return processed
          }, this)
        } /* for each role filter */
      } else {
        this.filteredRoles = this.info
      }
    },
    remove (item) {
      this.activeRoleFilters.splice(this.activeRoleFilters.indexOf(item), 1)
      this.activeRoleFilters = [...this.activeRoleFilters]
    },
    uiSwitchView () {
      if (this.uiIsCompareView) {
        this.uiButtonSwitchViewText = 'activar modo comparación'
      } else {
        this.uiButtonSwitchViewText = 'activar modo navegación'
      }
      this.uiIsCompareView = !this.uiIsCompareView
    },
    uiNextPage () {
      if (this.uiPage + 1 <= this.uiNumberOfPages) this.uiPage += 1
      else this.uiPage = 1
    },
    uiFormerPage () {
      if (this.uiPage - 1 >= 1) this.uiPage -= 1
      else this.uiPage = this.uiNumberOfPages
    },
    uiUpdateItemsPerPage (number) {
      this.uiItemsPerPage = number
    }
  },
  watch: {
    activeRoleFilters: function (newVal, oldVal) {
      this.rolesAndMatchingPermissions = {}
      this.filterRoles()

      if (this.uiIsCompareView) {
        if (this.activeRoleFilters.length > 0) {
          this.uiCompareViewLeastPriviledgePrinciple = true
          this.uiCompareViewHeaders = [
            {
              text: 'Name',
              align: 'left',
              sortable: true,
              value: 'name'
            },
            {
              text: 'Title',
              align: 'left',
              sortable: true,
              value: 'title'
            },
            {
              text: 'matching permissions',
              align: 'center',
              sortable: true,
              value: 'matchingPermissionsSize'
            },
            {
              text: '# of permissions',
              align: 'center',
              sortable: true,
              value: 'includedPermissionsSize'
            },
            { text: '', value: 'data-table-expand' }
          ]
        } else {
          this.uiCompareViewHeaders = [
            {
              text: 'Name',
              align: 'left',
              sortable: true,
              value: 'name'
            },
            {
              text: 'Title',
              align: 'left',
              sortable: true,
              value: 'title'
            },
            {
              text: '# of permissions',
              align: 'center',
              sortable: true,
              value: 'includedPermissions.length'
            },
            { text: '', value: 'data-table-expand' }
          ]
        }
      }
    },
    uiCompareViewLeastPriviledgePrinciple: function (newVal, oldVal) {
      if (newVal) {
        this.uiCompareViewSortBy = ['includedPermissionsSize', 'name', 'title']
        this.uiCompareViewSortDesc = [false, false, true]
      } else {
        this.uiCompareViewSortBy = ['name', 'title']
        this.uiCompareViewSortDesc = [false, true]
      }
    }
    // filteredRoles: function (newVal, oldVal) {
    //   this.load_start('filteredRoles watch')
    //   this.load_finished('filteredRoles watch')
    // }
  }
  /*
    rolefilter: debounce(function (newVal) {
      console.log('setting...')
      this.debouncedrolefilter = newVal
    }, 1500)
  */
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
