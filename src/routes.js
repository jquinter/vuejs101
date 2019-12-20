function lazyLoad (view) {
  return () => import(`@/components/${view}.vue`)
}

const routes = [
  { path: '/', component: lazyLoad('Browser'), name: 'home' },
  { path: '/roles/:name', component: lazyLoad('RoleDetail'), name: 'role' }
]
export default routes
