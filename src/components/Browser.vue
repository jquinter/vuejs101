<template lang='pug'>
div
  v-content
    v-container#input-usage(fluid='')
      v-row
        v-col(cols='12', xs='12', sm='6', md='7', align='center')
          v-combobox(:value='activeRoleFilters',
            @change='uiActiveRoleFiltersChange'
            :items='searchfilter',
            item-text='label',
            hide-no-data,
            chips='',
            clearable='',
            label='Filtrar roles',
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
                      v-icon(v-if='data.item.value.startsWith(\'roles\')') mdi-shield-account
                      v-icon(v-else='') mdi-key-plus
                    strong {{ data.item.label }}
                span {{data.item.value}}

        v-col(cols='12', xs='12', align='center',v-show='activeRoleFiltersPermissionsCSV')
          v-expansion-panels
            v-expansion-panel
              v-expansion-panel-header
                v-row
                  v-col(cols='12', xs='12')
                    h2 Rol personalizado
                  v-col(cols='12', xs='12')
                    span
                      | Si no encuentra un rol adecuado para los permisos que busca, recuerde
                      | que <a href='https://console.cloud.google.com/iam-admin/roles/create' target='_blank'>puede generar su propio rol</a>
                      | usando este comando
              v-expansion-panel-content
                v-form
                  v-row
                    v-col(cols='12', xs='12', md='6')
                      v-text-field(v-model='uiCustomRoleName',
                        outlined='',
                        label='Nombre del rol personalizado',
                        hint='Este es el formato usado como bigquery.admin en roles/bigquery.admin'
                      )
                    v-col(cols='12', xs='12', md='6')
                      v-text-field(v-model='uiCustomRoleTitle',
                        :rules='textFieldRulesMax(100)',
                        counter='100',
                        outlined='',
                        label='Título del rol personalizado',
                        hint='Este es un título legible (así como BigQuery Admin)'
                      )
                    v-col(cols='12', xs='12', md='6')
                      v-text-field(v-model='uiCustomRoleDescription',
                        :rules='textFieldRulesMaxNoSpaces(256)',
                        counter='256',
                        outlined='',
                        label='Descripción del rol personalizado',
                        hint='Esto es opcional, debería describir el propósito del rol'
                      )
                    v-col(cols='12', xs='12', md='6')
                      v-text-field(v-model='uiCustomRoleProjectId',
                        outlined='',
                        label='Proyecto donde se creará el rol personalizado',
                        hint='este es el identificador del proyecto de destino'
                      )
                  v-row
                    v-col(cols='12', xs='12')
                      kbd.text-left
                        | gcloud iam roles create {{uiCustomRoleName?uiCustomRoleName:'ROLENAME'}} \
                        pre &#9;--project {{uiCustomRoleProjectId?uiCustomRoleProjectId:'PROJECTID'}} \
                        pre &#9;--title "{{uiCustomRoleTitle?uiCustomRoleTitle:"ROLETITLE"}}" \
                        pre(v-show='uiCustomRoleDescription') &#9;--description "{{uiCustomRoleDescription?uiCustomRoleDescription:"ROLEDESCRIPTION"}}" \
                        pre(v-show='activeRoleFiltersPermissionsCSV') &#9;--permissions {{activeRoleFiltersPermissionsCSV}} \
                        pre &#9;--stage ALPHA
                  v-row
                    v-col(cols='12', xs='12')
                      v-alert(v-model='uiCustomRoleWarning', type='warning', dense='', dismissible='', border='top')
                        p.text-justify
                          | To create a custom role, a caller must possess iam.roles.create permission.
                          | By default, the owner of a project or an organization has this permission and can create and manage custom roles.
                          | Users who are not owners, including organization admins, must be assigned either the Organization Role Administrator role, or the IAM Role Administrator role.
                      .text-center
                        v-btn(v-if='!uiCustomRoleWarning', @click='uiCustomRoleWarning = true', color='warning') ¿Qué necesito para correr este comando?
        v-col(cols='12', xs='12', sm='6', md='3', align='center')
          v-btn.ma-2(color='lime accent-3', outlined='', v-on:click='uiSwitchView()')
            span {{ uiButtonSwitchViewText }}
        v-col(cols='12', xs='12', sm='6', md='2', align='center')
          v-switch.mt-2(v-model='uiCompareViewLeastPriviledgePrinciple', color='lime accent-3', label='Least Priviledge Principle')

    v-container(fluid='')
      transition-group.depth(name='gallery', tag='v-row')
        v-col(v-show='!uiIsCompareView',
          v-for='(item, index) in uiCompareViewLeastPriviledgePrinciple ? leastPriviledgePrincipleFilteredRoles : filteredRoles',
          :key='`key-${index}`',
          v-if='rolesListItemShouldBeDisplayed(index)',
          cols='6',
          sm='6',
          md='3')
          role(:role='item', :index='index+1', :query='activeRoleFilters')
      v-row(dense='')
        v-col(v-show='uiIsCompareView')
          template
            v-data-table.elevation-1(:headers.sync='uiCompareViewHeaders',
              :value='filteredRoles'
              show-select='',
              @item-selected='uiCompareViewItemSelected',
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

              template(v-slot:expanded-item='{ headers, item }')
                td(:colspan='headers.length')
                  expanded-item-permissions(:item='item', :activeRoleFilters='activeRoleFilters')
                  v-tooltip(right='', :light='true')
                    template(v-slot:activator='{ on }')
                      v-btn(fab='', small='', color='primary', @click='goToRoleDetail(item.name)', v-on='on')
                        v-icon(dark='') mdi-format-list-bulleted-square
                    span Ver detalles de {{item.name}}

    v-divider.ma-12
    infinite-loading.d-sm-none.pa-12.ma-12(@infinite='loadMore',
      ref="infiniteLoading",
      :distance='uiInfiniteLoadingDistance',
      force-use-infinite-wrapper='v-content__wrap')
      div(slot='no-more') No hay más datos
      div(slot='no-results') No hay datos
  v-footer.d-none.d-sm-block(app='', padless='')
    v-row.mt-2(align='center', justify='center')
      v-col.d-none.d-sm-block(align='center', cols='12', md='3')
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

      v-col.d-none.d-sm-block(align='center', cols='12', md='6')
        div(v-show='!uiIsCompareView')
          v-pagination(v-model='uiPage',
            color='lime darken-3',
            :length='uiNumberOfPages',
            :total-visible='9')

      v-col.d-sm-none(align='center', cols='12', md='2')
        v-btn.mr-1(fab='', dark='', color='lime darken-3', @click='uiFormerPage')
          v-icon mdi-chevron-left

        v-btn.ml-1(fab='', dark='', color='lime darken-3', @click='uiNextPage')
          v-icon mdi-chevron-right

      v-col(align='center', cols='12', md='1')
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
    Role: lazyLoad('Role'),
    expandedItemPermissions: lazyLoad('includedPermissionsExpandedItemSlotDataTable'),
    InfiniteLoading
  },

  props: {
    source: String
  },

  data: () => ({
    uiActiveRoleFilters: [],
    leastPriviledgePrincipleFilteredRoles: [],
    uiCustomRoleWarning: true,
    uiCustomRoleName: '',
    uiCustomRoleTitle: '',
    uiCustomRoleDescription: '',
    uiCustomRoleProjectId: '',
    uiInfiniteLoadingDistance: 100,
    uiButtonSwitchViewText: 'activar modo comparación',
    uiIsCompareView: false,
    uiItemsPerPage: 4,
    uiItemsPerPageArray: [4, 8, 12, -1],
    uiPage: 1,
    uiCompareViewSelected: [],
    uiCompareViewLeastPriviledgePrinciple: false,
    uiCompareViewSortBy: [],
    uiCompareViewSortDesc: [],
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
  },
  computed: {
    ...mapState(['activeRoleFilters', 'loading', 'filteredRoles', 'info', 'permissions', 'roles']),
    searchfilter () {
      return this.roles.concat(this.permissions)
    },
    uiNumberOfPages () {
      return Math.ceil(this.filteredRoles.length / this.uiItemsPerPage)
    },
    activeRoleFiltersPermissionsCSV () {
      return this.activeRoleFilters.filter(item => {
        var regexp = new RegExp('^[a-zA-Z]{1,}\\.[a-zA-Z]{1,}\\.[a-zA-Z]{1,}', 'i')
        return item && item.value && regexp.test(item.value)
      })
      .map(x => x.value)
      .join()
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
    uiActiveRoleFiltersChange (data) {
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
    rolesListItemShouldBeDisplayed (index) {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
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
    filterRoles () {
      if (this.activeRoleFilters.length > 0) {
        let matchingRoles = new Set()
        let partialMatching = []
        for (let index = 0; index < this.activeRoleFilters.length; index++) {
          /* for each role filter */

          const filteringByRole = this.activeRoleFilters[index].value

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
          let tempFilteredRoles = Array.from(matchingRoles).map(function (item) {
            var processed = {
              ...item,
              includedPermissionsSize: item.includedPermissions.length,
              matchingPermissions: item.name in this.rolesAndMatchingPermissions ? this.rolesAndMatchingPermissions[item.name] : null,
              matchingPermissionsSize: item.name in this.rolesAndMatchingPermissions ? this.rolesAndMatchingPermissions[item.name].length : null
            }
            return processed
          }, this)
          this.$store.commit('setFilteredRoles', Object.freeze(tempFilteredRoles.slice()))
        } /* for each role filter */
      } else {
        this.$store.commit('setFilteredRoles', this.info)
      }
    },
    remove (item) {
      this.$store.commit('removeFromActiveRoleFilters', item)
      // this.activeRoleFilters = [...this.activeRoleFilters]
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
      for (let index = 0; index < newVal.length; index++) {
        const element = newVal[index]
        if (typeof element === 'string') {
          newVal[index] = { 'value': element, 'label': element }
        }
      }

      this.rolesAndMatchingPermissions = {}
      this.filterRoles()

      // console.log(this.uiIsCompareView, this.activeRoleFilters.length)

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
    },
    uiCompareViewLeastPriviledgePrinciple: function (newVal, oldVal) {
      if (newVal) {
        if (this.activeRoleFilters.length > 0) {
          this.uiCompareViewSortBy = ['includedPermissionsSize', 'name', 'title']
          this.uiCompareViewSortDesc = [false, false, true]
        } else {
          this.uiCompareViewSortBy = ['includedPermissions.length', 'name', 'title']
          this.uiCompareViewSortDesc = [false, false, true]
        }
      } else {
        this.uiCompareViewSortBy = ['name', 'title']
        this.uiCompareViewSortDesc = [false, true]
      }
    },
    filteredRoles: function (newVal, oldVal) {
      // this.$store.commit('setFilteredRoles', newVal)
      if (this.$refs.infiniteLoading) {
        // https://stackoverflow.com/questions/54044709/how-to-reset-a-vue-infinite-loading-element
        this.$refs.infiniteLoading.stateChanger.reset()
      }

      this.leastPriviledgePrincipleFilteredRoles = Object.assign([], newVal.slice())
      this.leastPriviledgePrincipleFilteredRoles = this.leastPriviledgePrincipleFilteredRoles.sort((a, b) => {
        let first = Object.assign([], a.includedPermissions)
        let second = Object.assign([], b.includedPermissions)
        return (first.length > second.length) ? 1 : -1
      })
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
