import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    redirect: '/main/projects',
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
          leftDrawer: () => import('layouts/drawers/MainLeftDrawer.vue'),
          header: () => import('layouts/headers/MainHeader.vue'),
        },
      },
      {
        name: 'devices',
        path: 'devices',
        components: {
          default: () => import('pages/main/DevicesPage.vue'),
          leftDrawer: () => import('layouts/drawers/DevicesLeftDrawer.vue'),
          header: () => import('layouts/headers/MainHeader.vue'),
        },
      },
      {
        name: 'projects',
        path: 'projects',
        components: {
          default: () => import('pages/main/ProjectsPage.vue'),
          leftDrawer: () => import('layouts/drawers/ProjectsLeftDrawer.vue'),
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
