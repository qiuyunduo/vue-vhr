import Vue from 'vue'
import VueRouter from 'vue-router'
import { initMenu } from '../util/menus';
import store from '../store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    hidden: true
  },{
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    hidden: true
  },{
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    hidden: true,
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: () => import('../views/chat/FriendChat.vue'),
        hidden: true
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//解决由于利用addRoutes造成的仅仅是帮你注入新的路由，并没有帮你剔除其它路由！导致一直报警告vue-router名字重复
router.$addRoutes = (params) => {
  router.matcher = new VueRouter({ routes}).matcher; 
  router.addRoutes(params);
}

router.beforeEach((to,from,next) => {
  if(to.path == '/') {
    next();
  } else {
    if(window.sessionStorage.getItem('user')) {
      initMenu(router,store);
      next();
    } else {
      next('/?path='+to.path);
    }
  }
})

export default router
