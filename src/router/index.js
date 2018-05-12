import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/page/Home.vue'
import Search from '@/components/page/Search.vue'
import Category from '@/components/page/Category.vue'
import CategorySearch from '@/components/page/CategorySearch.vue'

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [{
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    },
    {
      path: '/category',
      name: 'Category',
      component: Category
    },
    {
      path: '/view',
      name: 'CategorySearch',
      component: CategorySearch
    }
  ]
})