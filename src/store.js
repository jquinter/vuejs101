import Vue from 'vue'
import Vuex from 'vuex'
import CreatePersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const persistedState = new CreatePersistedState({
  key: 'iamodeler'
})

const store = new Vuex.Store({
  state: {
    activeRoleFilters: [],
    loading: false,
    filteredRoles: [],
    info: [],
    permissions: [],
    roles: []
  },
  plugins: [persistedState],
  mutations: {
    setLoading (state, loading) {
      state.loading = loading
    },
    addToActiveRoleFilters (state, item) {
      state.activeRoleFilters.push(item)
    },
    removeFromActiveRoleFilters (state, item) {
      if (state.activeRoleFilters.indexOf(item) > -1) {
        state.activeRoleFilters.splice(state.activeRoleFilters.indexOf(item), 1)
      }
    },
    setActiveRoleFilters (state, activeRoleFilters) {
      state.activeRoleFilters = activeRoleFilters
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
