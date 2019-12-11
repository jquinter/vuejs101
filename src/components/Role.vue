<template lang='pug'>
v-card.mx-auto(max-width='344', elevation='12', :raised='true', :ripple='true')
  v-card-title.word-wrapped
    | {{role.title}}
  v-card-subtitle
    | {{role.name}}
  v-card-actions
    v-expansion-panels
      v-expansion-panel
        v-expansion-panel-header
          | {{role.description}}
          v-btn(text='')
            v-chip
              span(v-if='(role && role.matchingPermissions)') {{role.matchingPermissions.length}}/
              span {{role.includedPermissions.length}}
        v-expansion-panel-content(v-if='role.matchingPermissions')
          p(v-for='(perm, iperm) in role.matchingPermissions', :key='iperm')
            span(v-html='$options.filters.highlightRegExp(perm,query)')
        v-expansion-panel-content(v-else='')
          p(v-for='(perm, iperm) in role.includedPermissions', :key='iperm')
            span(v-html='$options.filters.highlightRegExp(perm,query)')
</template>

<script>
export default {
  name: 'Role',

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
