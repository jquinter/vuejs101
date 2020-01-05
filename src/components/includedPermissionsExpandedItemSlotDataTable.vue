<template lang='pug'>
v-row(no-gutters='')
  v-col(cols='10', offset='2')
    v-text-field(v-model='uiCompareViewExpandedSearch',
      append-icon='search',
      label='Filtrar lista de permisos',
      clearable=''
    )
  v-col(cols='12')
    v-card.overflow-y-auto(
      dark='')
      v-card-text
        v-data-table(
          hide-default-header=''
          :hide-default-footer='item.includedPermissions.length <= 5'
          :dense='false'
          :dark='true'
          :headers="[{text: 'permission name', sortable: true, value: 'name'}]"
          :items-per-page="5"
          :items="generateData(item.includedPermissions)"
          :search='uiCompareViewExpandedSearch'
        )
          template(v-slot:item='{ item }')
            tr
              td(v-if='uiCompareViewExpandedSearch', v-html='$options.filters.highlight(item.name, uiCompareViewExpandedSearch)')
              td(v-else='', v-html='$options.filters.highlightRegExp(item.name, activeRoleFilters)')
</template>
<script>
export default {
  name: 'includedPermissionsExpandedItemSlotDataTable',

  data: () => ({
    uiCompareViewExpandedSearch: ''
  }),

  methods: {
    generateData (arrayData) {
      if (!arrayData) return []
      return arrayData.map(function (item) {
        return { name: item, value: item }
      }, this)
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
