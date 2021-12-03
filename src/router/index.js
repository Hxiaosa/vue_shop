import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import Home from '../components/home'
import Welcome from '../components/welcome'
import Users from '../components/user/users'
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
        {path:'/users',component:Users}]}

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
