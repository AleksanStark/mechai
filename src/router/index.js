import { createRouter, createWebHistory } from 'vue-router'

import HomeView      from '../views/HomeView.vue'
import ScanView      from '../views/ScanView.vue'
import ReportView    from '../views/ReportView.vue'
import DashboardView from '../views/DashboardView.vue'
import AuthView      from '../views/AuthView.vue'
import SettingsView  from '../views/SettingsView.vue'
import CompareView   from '../views/CompareView.vue'
import ApiDocsView   from '../views/ApiDocsView.vue'
import NotFoundView  from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/',           name: 'home',      component: HomeView                                         },
    { path: '/auth',       name: 'auth',      component: AuthView                                         },
    { path: '/scan',       name: 'scan',      component: ScanView,      meta: { auth: true }              },
    { path: '/report/:id', name: 'report',    component: ReportView,    meta: { auth: true }              },
    { path: '/dashboard',  name: 'dashboard', component: DashboardView, meta: { auth: true }              },
    { path: '/settings',   name: 'settings',  component: SettingsView,  meta: { auth: true }              },
    { path: '/compare',    name: 'compare',   component: CompareView,   meta: { auth: true }              },
    { path: '/docs',       name: 'api-docs',  component: ApiDocsView                                      },
    { path: '/:pathMatch(.*)*', name: '404',  component: NotFoundView                                     },
  ],
})

router.beforeEach((to, _from) => {
  const token = localStorage.getItem('mechai_token')
  if (to.meta.auth && !token) return { name: 'auth', query: { redirect: to.fullPath } }
})

export default router
