import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/main/dashboard',
  },
  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        components: {
          default: () => import('pages/main/DashboardPage.vue'),
          leftDrawer: () => import('layouts/drawers/LeftMainDrawer.vue'),
          header: () => import('layouts/headers/MainHeader.vue'),
        },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
