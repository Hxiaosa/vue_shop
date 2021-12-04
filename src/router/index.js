import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import Home from '../components/home'
import Welcome from '../components/welcome'
import Users from '../components/user/users'
import Rights from '../components/power/rights'
import Roles from '../components/power/roles'
import Cate from '../components/goods/cate'

Vue.use(VueRouter)

const routes = [
]

const router = new VueRouter({
  routes: [
    // 设置一个路由重定向，当进入到根页面（/）就跳转到登录页面
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { 
      path: '/home', 
      component: Home,
      redirect:'/welcome',
      children: [
        {path:'/welcome', component:Welcome},
        {path:'/users',component:Users},
        //rights是后台已经写好的路径 后台读取数据时就读进去了 
        // 现在是规定这个路径跳转到哪个页面组件
        {path:'/rights',component:Rights},
        {path:'/roles',component:Roles},
        {path:'/categories',component:Cate}

      ]}

  ]
})


//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  //获取token
  const tokenStr=window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login');
  next();
})

export default router
