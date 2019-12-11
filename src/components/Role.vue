<template>
  <v-card
    class="mx-auto"
    max-width="344"
    elevation="12"
    :raised="true"
    :ripple="true"
  >
    <v-card-title>
      {{role.title}}
    </v-card-title>
    <v-card-text>
      <p>{{role.name}}</p>
      <div class="text--primary">
        {{role.description}}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <v-btn
              text
            >
              <span>{{role.includedPermissions.length}} permisos</span>
            </v-btn>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p v-for="(perm, iperm) in role.includedPermissions" :key="iperm">
              <span v-html="$options.filters.highlightRegExp(perm,query)"/>
            </p>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-actions>
  </v-card>
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
      type: String,
      default: ''
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
