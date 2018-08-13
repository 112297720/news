import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [{
    path: '*',
    redirect: '/index'
  },
  {
    name: 'index',
    component: () =>
      import ('./view/index/index.vue'),
    meta: {
      title: '奋进西北 — 首页',
      keepAlive: false,
      index: 1
    }
  },
  {
    name: 'details',
    component: () =>
      import ('./view/details/details.vue'),
    meta: {
      title: '奋进西北 — 详情',
      keepAlive: false,
      index: 2
    }
  },
  {
    name: 'videoNews',
    component: () =>
      import ('./view/videoNews/videoNews.vue'),
    meta: {
      title: '奋进西北 — 视频',
      keepAlive: false,
      index: 1
    }
  },
  {
    name: 'happyLife',
    component: () =>
      import ('./view/happyLife/happyLife.vue'),
    meta: {
      title: '奋进西北 — 悦生活',
      keepAlive: false,
      index: 1
    }
  },
  {
    name: 'uploadImg',
    component: () =>
      import ('./view/happyLife/uploadImg.vue'),
    meta: {
      title: '奋进西北 — 图片上传',
      keepAlive: false,
      index: 1
    }
  },
  {
    name: 'publish',
    component: () =>
      import ('./view/happyLife/publish.vue'),
    meta: {
      title: '奋进西北 — 发布',
      keepAlive: false,
      index: 1
    }
  },
  {
    name: 'paper',
    component: () =>
      import ('./view/paper/paper.vue'),
    meta: {
      title: '奋进西北 — 读报',
      keepAlive: false,
      index: 1
    }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({
  routes
});

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }


  next();
});

export {
  router
};
