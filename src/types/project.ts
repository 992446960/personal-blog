/** 项目展示项 */
export interface Project {
  id: string
  title: string
  desc: string
  type: string
  role: string
  date: string
  stack: string[]
  demo: string
  src: string
  /** 筛选用标签，如 vue, ts, fullstack */
  filters: string[]
  /** 可选封面/主题色 */
  color1?: string
  color2?: string
  /** 详情 MD 或 HTML（可选） */
  detail?: string
}
