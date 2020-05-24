import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
// import Login from '@/components/pages/Login'
// import Products from '@/components/pages/Products'
// import OrderList from '@/components/pages/OrderList'
// import CouponList from '@/components/pages/CouponList'
// import Customerorder from '@/components/pages/Customerorder'
// import CustomerCheckout from '@/components/pages/CustomerCheckout'

import Index from '@/components/index'
// import Main from '@/components/userpages/Main'
// import Category from '@/components/userpages/ProductCategory'
// import ProductDetail from '@/components/userpages/ProductDetail'
// import Order from '@/components/userpages/Order'
// import OrderCheck from '@/components/userpages/OrderCheck'

// import Terms from '@/components/userpages/Terms'
// import Policy from '@/components/userpages/Policy'
// import Disclaimer from '@/components/userpages/Disclaimer'
// import Package from '@/components/userpages/Package'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/pages/Login')
    },
    {
      path: '/admin',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'products',
          name: 'Products',
          component: () => import('@/views/pages/Products'),
          meta: { requiresAuth: true }
        },
        {
          path: 'order-list',
          name: 'OrderList',
          component: () => import('@/views/pages/OrderList'),
          meta: { requiresAuth: true }
        },
        {
          path: 'coupon-List',
          name: 'CouponList',
          component: () => import('@/views/pages/CouponList'),
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/user-simulation',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'customer-order',
          name: 'Customerorder',
          component: () => import('@/views/pages/Customerorder')
        },
        {
          path: 'customer-checkout/:orderId',
          name: 'CustomerCheckout',
          component: () => import('@/views/pages/CustomerCheckout')
        }
      ]
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      children: [
        {
          path: '/',
          name: 'Main',
          component: () => import('@/views/userpages/Main')
        },
        {
          path: 'category/:productCategory',
          name: 'Category',
          component: () => import('@/views/userpages/ProductCategory')
        },
        // {
        //   path: 'category/:productCategory/:seriesName',
        //   name: 'Series',
        //   component: () => import('@/views/userpages/ProductCategory'),
        // },
        {
          path: 'search/:searchStr',
          name: 'Search',
          component: () => import('@/views/userpages/ProductCategory')
        },
        {
          path: 'product-detail/:productId',
          name: 'ProductDetail',
          component: () => import('@/views/userpages/ProductDetail')
        },
        {
          path: 'order/:cartId',
          name: 'Order',
          component: () => import('@/views/userpages/Order')
        },
        {
          path: 'order-check/:userorderId',
          name: 'OrderCheck',
          component: () => import('@/views/userpages/OrderCheck')
        },
        // {
        //   path: 'user-order-list/:userorderlistId',
        //   name: 'UserOrderList',
        //   component: UserOrderList,
        // },
        {
          path: 'page/terms',
          name: 'Terms',
          component: () => import('@/views/userpages/Terms')
        },
        {
          path: 'page/policy',
          name: 'Policy',
          component: () => import('@/views/userpages/Policy')
        },
        {
          path: 'page/disclaimer',
          name: 'Disclaimer',
          component: () => import('@/views/userpages/Disclaimer')
        },
        {
          path: 'page/package',
          name: 'Package',
          component: () => import('@/views/userpages/Package')
        }
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ],
  scrollBehavior (to, from, savedPosition) {
  // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
