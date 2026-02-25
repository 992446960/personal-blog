/** 导航项配置 */
export interface NavItem {
  path: string
  nameKey: string
  /** 路由名，用于 router-link */
  name?: string
}

export const navConfig: NavItem[] = [
  { path: '/', nameKey: 'nav.home', name: 'Home' },
  { path: '/bookmarks', nameKey: 'nav.bookmarks', name: 'Bookmarks' },
  { path: '/tools', nameKey: 'nav.tools', name: 'Tools' },
  { path: '/projects', nameKey: 'nav.projects', name: 'Projects' },
]
