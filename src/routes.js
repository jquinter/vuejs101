import Browser from '@/components/Browser'
import RoleDetail from '@/components/RoleDetail'

const routes = [
  { path: '/', component: Browser, name: 'home' },
  { path: '/roles/:name', component: RoleDetail, name: 'role' }
]
export default routes
