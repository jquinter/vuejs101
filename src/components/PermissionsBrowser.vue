<template lang='pug'>
div
  v-content
    v-container#input-usage(fluid='')
      v-row
        v-col(cols='12', md='7', align='center')
          v-combobox(:value='activePermissionsFilters',
            @change='uiActivePermissionsFiltersChange'
            :items='searchfilter',
            item-text='label',
            hide-no-data,
            chips='',
            clearable='',
            label='Filter permissions',
            hint='puede usar regexp y búsquedas parciales',
            persistent-hint='',
            multiple='',
            prepend-icon='filter_list')
            template(v-slot:item='data')
              v-checkbox(:value='data.attrs.ariaSelected', :label='`${data.item.label} (${data.item.value})`', @selected='data.on')
            template(v-slot:selection='data')
              v-tooltip(top='', :light='true')
                template(v-slot:activator='{ on }')
                  v-chip(v-bind='data.attrs', :input-value='data.selected', close='', @click='data.select', @click:close='remove(data.item)', v-on='on')
                    v-avatar(left='')
                      v-icon(v-if='data.item.value.startsWith("roles")') mdi-shield-account
                      v-icon(v-else='') mdi-key-plus
                    strong {{ data.item.label }}
                span {{data.item.value}}

        v-col(cols='6', md='5', align='center')
          v-switch.mt-2(v-model='uiIsCompareView', color='lime accent-3', :label='uiButtonSwitchViewText')

    v-container(fluid='')
      transition-group.depth(name='gallery', tag='v-row')
        v-col(v-show='!uiIsCompareView',
          v-for='(item, index) in filteredPermissions',
          :key='`key-${index}`',
          v-if='listItemShouldBeDisplayed(index)',
          cols='6',
          sm='6',
          md='3')
          permission(:item='item', :index='index+1', :query='activePermissionsFilters')
      v-row(dense='')
        v-col(v-show='uiIsCompareView')
          template
            v-data-table.elevation-1(:headers.sync='uiCompareViewHeaders',
              :mobile-breakpoint='800',
              :value='filteredPermissions'
              show-select='',
              @item-selected='uiCompareViewItemSelected',
              :items='filteredPermissions',
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
              template(v-slot:top='', v-if='activePermissionsFilters.length > 0')
                v-toolbar(flat='')
                  v-toolbar-title(v-if='false') Roles
                  v-spacer

              template(v-slot:expanded-item='{ headers, item }')
                td(:colspan='headers.length')
                  expanded-item-permissions(:item='item', :activePermissionsFilters='activePermissionsFilters')
                  v-tooltip(right='', :light='true')
                    template(v-slot:activator='{ on }')
                      v-btn(fab='', small='', color='primary', @click='goToRoleDetail(item.name)', v-on='on')
                        v-icon(dark='') mdi-format-list-bulleted-square
                    span Ver detalles de {{item.name}}

    v-divider.d-md-none.ma-12
    infinite-loading.d-md-none.pa-12.ma-12(v-if='filteredPermissions.length > 0', @infinite='loadMore',
      ref="infiniteLoading",
      :distance='uiInfiniteLoadingDistance',
      force-use-infinite-wrapper='v-content__wrap')
      div(slot='no-more') No hay más datos
      div(slot='no-results') No hay datos
  v-footer.d-none.d-md-block(v-if='displayFooter', app='', padless='')
    v-row.mt-2(align='center', justify='center')
      v-col.d-none.d-md-block(align='center', cols='12', md='3')
        div(v-show='!uiIsCompareView')
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

      v-col.d-none.d-md-block(align='center', cols='12', md='6')
        div(v-show='!uiIsCompareView')
          v-pagination(v-model='uiPage',
            color='lime darken-3',
            :length='uiNumberOfPages',
            :total-visible='9')

      v-col.d-md-none(align='center', cols='12', md='2')
        v-btn.mr-1(fab='', dark='', color='lime darken-3', @click='uiFormerPage')
          v-icon mdi-chevron-left

        v-btn.ml-1(fab='', dark='', color='lime darken-3', @click='uiNextPage')
          v-icon mdi-chevron-right

      v-col(align='center', cols='12', md='3')
        v-chip(outlined='') © 2019
</template>

<script>
import { mapState } from 'vuex'
import InfiniteLoading from 'vue-infinite-loading'

function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

export default {
  name: 'Browser',

  components: {
    Permission: lazyLoad('Permission'),
    expandedItemPermissions: lazyLoad('includedPermissionsExpandedItemSlotDataTable'),
    InfiniteLoading
  },

  props: {
    source: String
  },

  data: () => ({
    uiActivePermissionsFilters: [],
    uiCustomRoleWarning: true,
    uiCustomRoleName: '',
    uiCustomRoleTitle: '',
    uiCustomRoleDescription: '',
    uiCustomRoleProjectId: '',
    uiButtonSwitchViewText: 'activar modo comparación',
    uiIsCompareView: false,
    uiItemsPerPage: 4,
    uiItemsPerPageArray: [4, 8, 12, -1],
    uiPage: 1,
    uiCompareViewSelected: [],
    uiCompareViewSortBy: ['label', 'title'],
    uiCompareViewSortDesc: [false, true],
    uiCompareViewFooterProps: {
      'disable-items-per-page': false,
      'items-per-page-options': [4, 8, 12, -1]
    },
    uiCompareViewExpanded: [],
    uiCompareViewSingleExpand: false,
    uiCompareViewHeaders: [
      {
        text: 'Name',
        align: 'left',
        sortable: true,
        value: 'label'
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
    rolefilter: '',
    debouncedrolefilter: '',
    rolesAndMatchingPermissions: {},
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

  mounted () {
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        this.uiItemsPerPage = 4
        break
      default:
        this.uiItemsPerPage = 8
    }
    if (this.activePermissionsFilters.length > 0) {
      this.uiCompareViewHeaders = [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'label'
        },
        {
          text: 'Title',
          align: 'left',
          sortable: true,
          value: 'title'
        },
        {
          text: 'included in roles',
          align: 'center',
          sortable: true,
          value: 'roles.length'
        },
        { text: '', value: 'data-table-expand' }
      ]
    } else {
      this.uiCompareViewHeaders = [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'label'
        },
        {
          text: 'Title',
          align: 'left',
          sortable: true,
          value: 'title'
        },
        {
          text: 'included in roles',
          align: 'center',
          sortable: true,
          value: 'roles.length'
        },
        { text: '', value: 'data-table-expand' }
      ]
    }
  },
  computed: {
    ...mapState(['loading',
      'filteredPermissions',
      'info',
      'permissions',
      'permissionsRaw',
      'roles'
    ]),
    activePermissionsFilters () {
      return this.$store.state.activeRoleFilters
    },
    uiInfiniteLoadingDistance () {
      if (this.$vuetify.breakpoint.height >= this.$vuetify.breakpoint.width) {
        return 10
      }
      return 100
    },
    displayFooter () {
      if (this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm) {
        return this.$vuetify.breakpoint.height > this.$vuetify.breakpoint.width
      }
      return true
    },
    uiOrientationLandscape () {
      return this.$vuetify.breakpoint.height >= this.$vuetify.breakpoint.width
    },
    uiOrientationPortrait () {
      return this.$vuetify.breakpoint.height >= this.$vuetify.breakpoint.width
    },
    searchfilter () {
      return this.roles.concat(this.permissions)
    },
    uiNumberOfPages () {
      return Math.ceil(this.filteredPermissions.length / this.uiItemsPerPage)
    }
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
    uiActivePermissionsFiltersChange (data) {
      this.$store.commit('setActiveRoleFilters', data)
    },
    uiCompareViewItemSelected (data) {
      this.$store.commit('removeFromActiveRoleFilters', { 'value': data.item.name, 'label': data.item.title })

      if (data.value) {
        this.$store.commit('addToActiveRoleFilters', { 'value': data.item.name, 'label': data.item.title })
      }
    },
    goToRoleDetail (name) {
      this.$router.push({ name: 'role', params: { name } })
    },
    listItemShouldBeDisplayed (index) {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return index < (this.uiPage) * this.uiItemsPerPage
        case 'sm':
          return index < (this.uiPage) * this.uiItemsPerPage
        default:
          return index >= (this.uiPage - 1) * this.uiItemsPerPage && index < (this.uiPage) * this.uiItemsPerPage
      }
    },
    textFieldRulesMax (max) {
      const rules = []

      if (max) {
        const rule =
          v => (v || '').length <= max ||
            `A maximum of ${max} characters is allowed`

        rules.push(rule)
      }

      return rules
    },
    textFieldRulesMaxNoSpaces (max) {
      const rules = []

      if (max) {
        const rule =
          v => (v || '').length <= max ||
            `A maximum of ${max} characters is allowed`

        rules.push(rule)
      }

      // if (!this.allowSpaces) {
      const rule =
        v => (v || '').indexOf(' ') < 0 ||
          'No spaces are allowed'

      rules.push(rule)

      // if (this.match) {
      //   const rule =
      //     v => (!!v && v) === this.match ||
      //       'Values do not match'

      //   rules.push(rule)
      // }

      return rules
    },
    loadMore ($state) {
      console.log('loadMore requested', this.uiPage)
      setTimeout(() => {
        if (this.uiPage + 1 <= this.uiNumberOfPages) {
          this.uiPage += 1
          $state.loaded()
        } else {
          $state.complete()
        }
      }, 1000)
    },
    load_start (msg) {
      if (msg) {
        console.log('starting...', msg)
      }
      this.$store.commit('setLoading', true)
    },
    load_finished (msg) {
      if (msg) {
        console.log('done...', msg)
      }
      this.$store.commit('setLoading', false)
    },
    filterPermissions () {
      if (this.activePermissionsFilters.length > 0) {
        let matchingPermissions = new Set()
        let partialMatching = []
        for (let index = 0; index < this.activePermissionsFilters.length; index++) {
          /* for each permissions filter */

          const filteringByPermission = this.activePermissionsFilters[index].value

          /* Ampliación de filtro de búsqueda: podemos buscar por calce de codigo de rol */
          if (filteringByPermission.startsWith('roles/')) {
            /*
            Primero: obtener, desde el set completo de permisos (permissionsRaw)
            todos aquellos permisos que son incluidos en el rol que estamos buscando (filteringByPermission)
            */
            partialMatching = this.permissionsRaw.filter(item => {
              // return item.name.toLowerCase().indexOf(filtering_by_role.toByRolee()) > -1
              // console.log(item.name, item.includedPermissions.length, item.includedPermissions.some((element) => (element.toLowerCase().indexOf(filtering_by_role.toByRolee()) > -1)))
              var regexp = new RegExp(filteringByPermission, 'gi')
              return item && item.roles && item.roles.length &&
                // item.roles.some((element) => (element.toLowerCase().indexOf(filtering_by_role.toByRolee()) > -1))
                item.roles.some((element) => (regexp.test(element)))
            })
          } else {
            /* buscamos permisos puntuales */
            partialMatching = this.permissionsRaw.filter(item => {
              var regexp = new RegExp(filteringByPermission, 'gi')
              return item && item.title && regexp.test(item.title)
            })
          }

          /*
          acá mantenemos un set de todos los posibles permisos que se han encontrado
          al usar los filtros de busqueda especificados
          */
          partialMatching.forEach(permission => matchingPermissions.add(permission))
          /*
          let tempFilteredPermissions = Array.from(matchingPermissions).map(function (item) {
            var processed = {
              ...item,
            }
            return processed
          }, this)
          */
          this.$store.commit('setFilteredPermissions', Object.freeze(Array.from(matchingPermissions).slice()))
        } /* for each role filter */
      } else {
        this.$store.commit('setFilteredRoles', this.info)
        this.$store.commit('setFilteredPermissions', this.permissionsRaw)
      }
    },
    remove (item) {
      this.$store.commit('removeFromActiveRoleFilters', item)
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
    activePermissionsFilters: function (newVal, oldVal) {
      for (let index = 0; index < newVal.length; index++) {
        const element = newVal[index]
        if (typeof element === 'string') {
          newVal[index] = { 'value': element, 'label': element }
        }
      }

      this.rolesAndMatchingPermissions = {}
      this.filterPermissions()

      if (this.activePermissionsFilters.length > 0) {
        this.uiCompareViewHeaders = [
          {
            text: 'Name',
            align: 'left',
            sortable: true,
            value: 'label'
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
            value: 'label'
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
    },
    filteredPermissions: function (newVal, oldVal) {
      if (this.$refs.infiniteLoading) {
        // https://stackoverflow.com/questions/54044709/how-to-reset-a-vue-infinite-loading-element
        this.$refs.infiniteLoading.stateChanger.reset()
      }
    }
  }
}
</script>

<style>
.gallery-move {
  transition: transform 1s;
}
.gallery-enter-active, .gallery-leave-active {
  transition: all 0.4s;
}
.gallery-enter, .gallery-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
