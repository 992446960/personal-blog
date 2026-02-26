import { ref } from 'vue'
import type { Ref } from 'vue'
import type { Bookmark, BookmarkFolder, BookmarkType } from '@/types/bookmarks'

const CACHE_TTL_MS = 5 * 60 * 1000 // 5 分钟
let cache: { items: Bookmark[]; folders: BookmarkFolder[]; ts: number } | null = null

function getPublicBookmarksUrl(): string {
  const envUrl = import.meta.env.VITE_PUBLIC_BOOKMARKS_JSON_URL as string | undefined
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) return envUrl.trim()
  const base = import.meta.env.BASE_URL as string
  return `${base}data/bookmarks.json`
}

function normalizeItem(raw: unknown): Bookmark | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = typeof o.id === 'number' ? o.id : Number(o.id) || Date.now()
  const title = String(o.title ?? '')
  const url = String(o.url ?? '')
  if (!url) return null
  const type = ['article', 'video', 'other'].includes(String(o.type)) ? (o.type as BookmarkType) : 'other'
  const tags = Array.isArray(o.tags) ? o.tags.map(String) : []
  const folderId = o.folderId != null ? String(o.folderId) : null
  const createdAt = typeof o.createdAt === 'number' ? o.createdAt : Date.now()
  return { id, title, url, type, tags, folderId, createdAt }
}

function normalizeFolder(raw: unknown): BookmarkFolder | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = String(o.id ?? '')
  const name = String(o.name ?? '')
  const order = typeof o.order === 'number' ? o.order : 0
  if (!id) return null
  return { id, name, order }
}

export interface PublicBookmarksState {
  items: Ref<Bookmark[]>
  folders: Ref<BookmarkFolder[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  refresh: () => Promise<void>
}

/**
 * 全站公开书签只读数据源。GET 远程 JSON，不写 localStorage。
 * 可选短期内存缓存，减少重复请求。
 */
export function usePublicBookmarks(): PublicBookmarksState {
  const items = ref<Bookmark[]>([])
  const folders = ref<BookmarkFolder[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    const url = getPublicBookmarksUrl()
    if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
      items.value = cache.items
      folders.value = cache.folders
      error.value = null
      return
    }
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as unknown
      const rawItems = Array.isArray(data) ? data : (data as Record<string, unknown>).items
      const rawFolders = Array.isArray(data) ? [] : (data as Record<string, unknown>).folders
      const list = Array.isArray(rawItems) ? rawItems : []
      const folderList = Array.isArray(rawFolders) ? rawFolders : []
      items.value = list.map(normalizeItem).filter((b): b is Bookmark => b != null)
      folders.value = folderList.map(normalizeFolder).filter((f): f is BookmarkFolder => f != null)
      cache = { items: items.value, folders: folders.value, ts: Date.now() }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load'
      items.value = []
      folders.value = []
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    cache = null
    await load()
  }

  load()

  return {
    items,
    folders,
    loading,
    error,
    refresh,
  }
}
