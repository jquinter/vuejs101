import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loading: false,
    filteredRoles: [],
    info: [],
    permissions: [],
    roles: []
  },
  mutations: {
    setLoading (state, loading) {
      state.loading = loading
    },
    setFilteredRoles (state, filteredRoles) {
      state.filteredRoles = filteredRoles
    },
    setInfo (state, info) {
      state.info = info
    },
    setPermissions (state, permissions) {
      state.permissions = permissions
    },
    setRoles (state, roles) {
      state.roles = roles
    }
  }
})

export default store
