import { computed } from 'vue'
import { useBookmarksStore } from '@/stores/bookmarks'
import type { BookmarkType } from '@/types/bookmarks'

export function useBookmarksFilter(
  search: string,
  typeFilter: BookmarkType | 'all',
  folderId: string | null
) {
  const store = useBookmarksStore()

  const filtered = computed(() => {
    let list = store.items
    if (typeFilter !== 'all') {
      list = list.filter((b) => b.type === typeFilter)
    }
    if (folderId) {
      list = list.filter((b) => b.folderId === folderId)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
      )
    }
    return list
  })

  return { filtered, store }
}
