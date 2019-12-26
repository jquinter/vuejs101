<template lang='pug'>
v-card
  v-card-subtitle
    v-icon mdi-key-plus
    | Included permissions
  v-card-text
    v-text-field(v-model='uiCompareViewExpandedSearch',
      append-icon='search',
      label='Filtrar lista de permisos',
      clearable=''
    )
  v-card.overflow-y-auto(
    dark='',
    max-width='90vw',
    max-height='60vh')
    v-data-table(
      :dense='false'
      :dark='true'
      :headers="[{text: 'permission name', sortable: true, value: 'name'}, {text: 'mayor', value: 'mayor', sortable: false}]"
      :group-by="['mayor']"
      :items-per-page="5"
      show-group-by=''
      :items="generateData(item.includedPermissions)"
      :search='uiCompareViewExpandedSearch'
    )
      template(v-slot:item='{ item }')
        tr
          td(v-if='uiCompareViewExpandedSearch', v-html='$options.filters.highlight(item.name, uiCompareViewExpandedSearch)')
          td(v-else='', v-html='$options.filters.highlightRegExp(item.name, activeRoleFilters)')
          td
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
        return { name: item, value: item, mayor: item.split('.')[0], minor: item.split('.')[1] }
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
