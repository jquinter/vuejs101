<template lang='pug'>
v-row(no-gutters='')
  v-col(cols='10', offset='2')
    v-text-field(v-model='uiCompareViewExpandedSearch',
      append-icon='search',
      label='Filter roles list',
      clearable=''
    )
  v-col(cols='12')
    v-card.overflow-y-auto(
      dark='')
      v-data-table(
        hide-default-header=''
        :hide-default-footer='item.roles.length <= 5'
        :dense='false'
        :dark='true'
        :headers="[{text: 'role name', sortable: true, value: 'name'}]"
        :items-per-page="5"
        :items="generateData(item.roles)"
        :search='uiCompareViewExpandedSearch'
      )
        template(v-slot:item='{ item }')
          tr
            td.px-0(v-if='uiCompareViewExpandedSearch')
              v-btn(small='', text='', @click='goToRoleDetail(item.name)')
                v-icon.pr-1 mdi-shield-account
                span(v-html='$options.filters.highlight(item.name, uiCompareViewExpandedSearch)')
            td.px-0(v-else='')
              v-btn(small='', text='', @click='goToRoleDetail(item.name)')
                v-icon.pr-1 mdi-shield-account
                span(v-html='$options.filters.highlightRegExp(item.name, activeRoleFilters)')
</template>
<script>
export default {
  name: 'associatedRoles',

  data: () => ({
    uiCompareViewExpandedSearch: ''
  }),

  methods: {
    generateData (arrayData) {
      if (!arrayData) return []
      return arrayData.map(function (item) {
        return { name: item, value: item }
      }, this)
    },
    goToRoleDetail (name) {
      this.$router.push({ name: 'role', params: { name } })
    }
  },

  props: {
    activeRoleFilters: {
      type: Array,
      default: () => []
    },
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
.v-data-table >>> .v-data-footer .v-data-footer__pagination {
  margin: 1px !important;
}
</style>
