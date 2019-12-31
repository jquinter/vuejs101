function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

const routes = [
  { path: '/', component: lazyLoad('Browser'), name: 'home' },
  { path: '/browser', component: lazyLoad('Browser'), name: 'browser' },
  { path: '/modeler', component: lazyLoad('Modeler'), name: 'modeler' },
  { path: '/roles/:name', component: lazyLoad('RoleDetail'), name: 'role' }
]
export default routes
