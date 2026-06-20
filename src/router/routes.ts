import type { RouteRecordRaw } from 'vue-router'

/**
 * Single-route SPA: the registration wizard owns step switching internally
 * (via the stepper), so there is only one application route. No SSR.
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/pages/IndexPage.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/IndexPage.vue'),
  },
]

export default routes
