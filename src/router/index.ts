import { createRouter, createWebHistory } from 'vue-router'

import HomeView      from '../views/HomeView.vue'
import ScanView      from '../views/ScanView.vue'
import ReportView    from '../views/ReportView.vue'
import DashboardView from '../views/DashboardView.vue'
import SettingsView  from '../views/SettingsView.vue'
import CompareView   from '../views/CompareView.vue'
import ApiDocsView   from '../views/ApiDocsView.vue'
import NotFoundView  from '../views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
  routes: [
    { path: '/',           name: 'home',      component: HomeView      },
    { path: '/scan',       name: 'scan',      component: ScanView      },
    { path: '/report/:id', name: 'report',    component: ReportView    },
    { path: '/dashboard',  name: 'dashboard', component: DashboardView },
    { path: '/settings',   name: 'settings',  component: SettingsView  },
    { path: '/compare',    name: 'compare',   component: CompareView   },
    { path: '/docs',       name: 'api-docs',  component: ApiDocsView   },
    { path: '/:pathMatch(.*)*', name: '404',  component: NotFoundView  },
  ],
})

export default router
