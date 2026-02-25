/** 收藏类型 */
export type BookmarkType = 'article' | 'video' | 'other'

/** 单条收藏 */
export interface Bookmark {
  id: number
  title: string
  url: string
  type: BookmarkType
  tags: string[]
  folderId: string | null
  createdAt: number
}

/** 文件夹 */
export interface BookmarkFolder {
  id: string
  name: string
  order: number
}
