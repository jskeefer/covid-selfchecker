import Vue from 'vue'
import VueRouter from 'vue-router'
import Node from './components/Node.vue'

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/1' },
  { path: '/1', component: Node },
  { path: '/1/*', component: Node }
]

const router = new VueRouter({ mode: 'history',routes })

export { router, routes }
