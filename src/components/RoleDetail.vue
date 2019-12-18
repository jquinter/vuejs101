<template lang='pug'>
v-content
  v-container
    v-row
      v-col(cols='12', xs='12', sm='6', md='5', align='justify')
        v-card.mx-auto(elevation='12', :raised='true', :ripple='true')
          v-card-title.word-wrapped(@click='goToRoleDetail(role.name)')
            | {{role.title}}
          v-card-subtitle
            | {{role.name}}
          v-card-text
            | {{role.description}}
            v-card
              v-card-title
                v-text-field(v-model='uiCompareViewExpandedSearch',
                  append-icon='search',
                  label='Filtrar lista de permisos',
                  single-line='')
              v-data-table(
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
</template>
<script>
import { mapState } from 'vuex'
import Role from '@/components/Role'

export default {
  components: { Role },

  data: () => ({
    uiCompareViewExpandedSearch: ''
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

  methods: {
    generateData (arrayData) {
      return arrayData.map(function (item) {
        return { name: item, value: item }
      }, this)
    }
  }
}
</script>
