<template lang='pug'>
v-content
  v-container
    v-row
      v-col(cols='12', xs='12', sm='6', md='5', align='justify', ref='container')
        v-btn.mx-auto(small='', color='secondary', @click='goTo("home")') Volver al listado

        v-card.mx-auto(v-if='role', elevation='12', :raised='true', :ripple='true')
          v-card-title.word-wrapped(@click='goToRoleDetail(role.name)')
            | {{role.title}}
          v-card-subtitle
            | {{role.name}}
          v-card-text
            | {{role.description}}
            v-expansion-panels(:dark='false', :light='true')
              v-expansion-panel
                v-expansion-panel-header Permisos incluídos
                v-expansion-panel-content
                  v-card
                    v-card-title
                      v-text-field(v-model='uiCompareViewExpandedSearch',
                        append-icon='search',
                        label='Filtrar lista de permisos',
                        single-line='')
                    v-data-table(
                      v-if='role && role.includedPermissions'
                      :dense='false'
                      :dark='true'
                      :headers="[{'text': 'Permisos incluídos', 'sortable': 'true', 'value': 'name'}]"
                      :items="generateData(role.includedPermissions)"
                      :search='uiCompareViewExpandedSearch'
                    )
                      template(v-slot:body='{ items }')
                        tbody
                          tr(v-for='(perm, iperm) in items', :key='iperm')
                            td.text-start(v-html='perm.name')

      v-col(cols='12', xs='12', sm='6', md='7', align='justify')
        TreeMap(v-if='role', :treeMapRawData='role.includedPermissions', :containerWidth='containerWidth', :containerHeight='containerHeight')

</template>
<script>
import { mapState } from 'vuex'
function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

export default {
  name: 'RoleDetail',
  components: { Role: lazyLoad('Role'), TreeMap: lazyLoad('TreeMap') },

  data: () => ({
    uiCompareViewExpandedSearch: '',
    containerHeight: 0,
    containerWidth: 0,
    container: {}
  }),

  computed: {
    ...mapState(['drawer', 'loading', 'filteredRoles', 'info', 'permissions']),
    role () {
      return this.info.filter(item => {
        var regexp = new RegExp(this.$route.params.name, 'gi')
        return item && item.name && regexp.test(item.name)
      })[0]
    }
  },
  mounted () {
    if (this.$refs.container) {
      this.containerHeight = this.$refs['container'].clientHeight
      this.containerWidth = this.$refs['container'].clientWidth - 24
      console.log(this.$refs['container'].clientWidth)
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
    }
  }

}
</script>
