<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application {{info ? info.length:0}}</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
          id="input-usage"
          fluid
        >
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="rolefilter"
                label="Filtrar roles (puede usar regexp)"
                outlined
              />
              <v-btn @click="filterRoles" small color="primary">Filtrar</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="shrink">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn :href="source" icon large target="_blank" v-on="on">
                  <v-icon large>mdi-code-tags</v-icon>
                </v-btn>
              </template>
              <span>Source</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  large
                  href="https://codepen.io/johnjleider/pen/bXNzZL"
                  target="_blank"
                  v-on="on"
                >
                  <v-icon large>mdi-codepen</v-icon>
                </v-btn>
              </template>
              <span>Codepen</span>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-for="(item, index) in filteredRoles" :key="index" cols="12" xs="12" sm="6" md="4">
            <role :role="item" :index="index+1" :query="rolefilter"/>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
// import debounce from './helpers'
import Role from '@/components/Role.vue'

export default {
  name: 'app',

  components: { Role },

  props: {
    source: String
  },

  data: () => ({
    on: null,
    rolefilter: '',
    debouncedrolefilter: '',
    filteredRoles: [],
    info: null,
    drawer: false,
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
    this.$vuetify.theme.dark = true

    // var dataUrl = '/data/roles_detailed_stringify.json'
    var dataUrl = '/data/roles_detailed.json'

    //  .get('https://api.coindesk.com/v1/bpi/currentprice.json')
    axios.get(dataUrl).then(
      // response => (console.log(JSON.parse(response.data))),
      response => {
        this.info = response.data.slice(350, 400)
        this.filteredRoles = this.info
      },
      error => console.error(error)
    )
  },

  methods: {
    filterRoles () {
      if (this.rolefilter) {
        console.log('Filtrando', this.rolefilter)
        this.filteredRoles = this.info.filter(item => {
          // return item.name.toLowerCase().indexOf(this.rolefilter.toLowerCase()) > -1
          // console.log(item.name, item.includedPermissions.length, item.includedPermissions.some((element) => (element.toLowerCase().indexOf(this.rolefilter.toLowerCase()) > -1)))
          var regexp = new RegExp(this.rolefilter, 'gi')
          return item && item.includedPermissions && item.includedPermissions.length &&
            // item.includedPermissions.some((element) => (element.toLowerCase().indexOf(this.rolefilter.toLowerCase()) > -1))
            item.includedPermissions.some((element) => (regexp.test(element)))
        })
      } else {
        this.filteredRoles = this.info
      }
    }
  }

  /*
  watch: {
    rolefilter: debounce(function (newVal) {
      console.log('setting...')
      this.debouncedrolefilter = newVal
    }, 1500)
  }
  */
}

</script>
