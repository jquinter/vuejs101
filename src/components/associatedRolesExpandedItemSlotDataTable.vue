<template lang='pug'>
v-card
  v-card-subtitle
    v-icon.px-2 mdi-shield-account
    | Included in these roles
  v-card-text
    v-row(justify='end')
      v-col(cols=10, md=6)
        v-text-field(v-model='uiCompareViewExpandedSearch',
          append-icon='search',
          label='Filter roles list',
          clearable=''
        )
  v-card.overflow-y-auto(
    dark='',
    max-width='90vw',
    max-height='60vh')
    v-data-table(
      :dense='false'
      :dark='true'
      :headers="[{text: 'role name', sortable: true, value: 'name'}]"
      :items-per-page="5"
      :items="generateData(item.roles)"
      :search='uiCompareViewExpandedSearch'
    )
      template(v-slot:item='{ item }')
        tr
          td(v-if='uiCompareViewExpandedSearch')
            v-btn.mx-2(small='', text='', @click='goToRoleDetail(item.name)')
              span(v-html='$options.filters.highlight(item.name, uiCompareViewExpandedSearch)')
          td(v-else='')
            v-btn.mx-2(small='', text='', @click='goToRoleDetail(item.name)')
              span(v-html='$options.filters.highlightRegExp(item.name, activeRoleFilters)')
          td
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
