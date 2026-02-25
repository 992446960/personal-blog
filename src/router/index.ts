import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { toolsConfig } from '@/config/tools'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { titleKey: 'nav.home' },
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    component: () => import('@/views/bookmarks/BookmarksView.vue'),
    meta: { titleKey: 'nav.bookmarks' },
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('@/views/tools/ToolList.vue'),
    meta: { titleKey: 'nav.tools' },
  },
  ...toolsConfig.map((t) => ({
    path: t.path,
    name: `Tool-${t.id}`,
    component: t.component,
    meta: { titleKey: t.nameKey },
  })),
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/projects/ProjectsView.vue'),
    meta: { titleKey: 'nav.projects' },
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/projects/ProjectDetail.vue'),
    meta: { titleKey: 'nav.projects' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  const titleKey = to.meta.titleKey as string | undefined
  if (titleKey) {
    document.title = `${titleKey} · Personal Hub`
  }
})

export default router
