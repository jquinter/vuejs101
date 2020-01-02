function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

const routes = [
  { path: '/', component: lazyLoad('RolesBrowser'), name: 'home' },
  { path: '/settings', component: lazyLoad('Settings'), name: 'settings' },
  { path: '/roles', component: lazyLoad('RolesBrowser'), name: 'roles' },
  { path: '/permissions', component: lazyLoad('PermissionsBrowser'), name: 'permissions' },
  { path: '/modeler', component: lazyLoad('Modeler'), name: 'modeler' },
  { path: '/roles/:name', component: lazyLoad('RoleDetail'), name: 'role' }
]
export default routes
