import { createRouter, createWebHistory, type Router } from 'vue-router'
import routes from './routes'

/** Quasar boot entry: build the app router. */
export default function (): Router {
  return createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ left: 0, top: 0 }),
  })
}
