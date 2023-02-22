import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'FrontLayout',
    component: () => import('../views/FrontLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import('../views/front/HomeView.vue'),
        children: []
      },
      // 前台，之後要移進去上方做巢狀
      {
        path: 'productsList', // 用products不行，[Vue Router warn]: No match found for location with path "/products"。已測試只要修改path名稱，其餘設定不變，可以順利運作。
        component: () => import('../views/front/ProductsView.vue')
      },
      {
        path: 'product/:id',
        component: () => import('../views/front/ProductView.vue')
      },
      {
        path: 'cart',
        component: () => import('../views/front/CartView.vue')
      },
      {
        path: 'articlesList', // 用articles不行，[Vue Router warn]: No match found for location with path "/articles"。已測試只要修改path名稱，其餘設定不變，可以順利運作。
        component: () => import('../views/front/ArticlesView.vue')
      },
      {
        path: 'about',
        component: () => import('../views/front/AboutView.vue')
      }
    ]
  },
  // 登入頁
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/admin/LoginView.vue')
  },
  // 後台
  {
    path: '/admin',
    name: 'DashboardLayout',
    component: () => import('../views/DashboardLayout.vue'),
    children: [
      {
        path: '',
        name: 'adminIndex',
        component: () => import('../views/admin/AdminView.vue'),
        children: []
      },
      {
        path: 'products',
        component: () => import('../views/admin/ProductsView.vue')
      },
      {
        path: 'orders',
        component: () => import('../views/admin/OrderView.vue')
      },
      {
        path: 'coupons',
        component: () => import('../views/admin/CouponsView.vue')
      },
      {
        path: 'articles',
        component: () => import('../views/admin/ArticlesView.vue')
      },
      {
        path: 'analysis',
        component: () => import('../views/admin/AnalysisView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active', // 選取狀態
  routes
})

export default router
