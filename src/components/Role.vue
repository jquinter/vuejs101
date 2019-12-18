<template lang='pug'>
v-card.mx-auto(max-width='344', elevation='12', :raised='true', :ripple='true')
  v-card-title.word-wrapped
    div
      | {{role.title}}
      v-tooltip(right='', :light='true')
        template(v-slot:activator='{ on }')
          v-btn.mx-2(fab='', small='', color='teal', @click='goToRoleDetail(role.name)', v-on='on')
            v-icon(dark='') mdi-format-list-bulleted-square
        span Ver detalles de {{role.name}}

  v-card-subtitle
    | {{role.name}}
  v-card-actions
    v-expansion-panels(:dark='false', :light='true')
      v-expansion-panel
        v-expansion-panel-header
          | {{role.description}}
          v-btn(text='')
            v-chip
              span(v-if='(role && role.matchingPermissions)') {{role.matchingPermissions.length}}/
              span(v-if='(role && role.includedPermissions)') {{role.includedPermissions.length}}
        v-expansion-panel-content(v-if='role.matchingPermissions')
          p(v-for='(perm, iperm) in role.matchingPermissions', :key='iperm')
            span.body-2(v-html='$options.filters.highlightRegExp(perm,query)')
        v-expansion-panel-content(v-else='')
          p(v-for='(perm, iperm) in role.includedPermissions', :key='iperm')
            span.body-2(v-html='$options.filters.highlightRegExp(perm,query)')
</template>

<script>
export default {
  name: 'Role',

  methods: {
    goToRoleDetail (name) {
      this.$router.push({ name: 'role', params: { name } })
    }
  },

  props: {
    index: {
      type: Number,
      required: true
    },
    role: {
      type: Object,
      required: true
    },
    query: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style>
.highlightText {
  background-color: yellow;
  color: black;
}
</style>

<style scoped>
.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
