import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Bookmark, BookmarkFolder } from '@/types/bookmarks'

const STORAGE_KEY = 'ph_bookmarks'
const FOLDERS_KEY = 'ph_folders'

const defaultFolders: BookmarkFolder[] = [
  { id: 'vue', name: 'Vue 生态', order: 0 },
  { id: 'ts', name: 'TypeScript', order: 1 },
  { id: 'perf', name: '性能优化', order: 2 },
  { id: 'other', name: '其他', order: 3 },
]

function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {
    /* ignore */
  }
  return []
}

function loadFolders(): BookmarkFolder[] {
  try {
    const raw = localStorage.getItem(FOLDERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (_) {
    /* ignore */
  }
  return defaultFolders
}

export const useBookmarksStore = defineStore('bookmarks', () => {
  const items = ref<Bookmark[]>(loadBookmarks())
  const folders = ref<BookmarkFolder[]>(loadFolders())

  const count = computed(() => items.value.length)

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders.value))
  }

  function add(bookmark: Omit<Bookmark, 'id' | 'createdAt'>) {
    const newItem: Bookmark = {
      ...bookmark,
      id: Date.now(),
      createdAt: Date.now(),
    }
    items.value.unshift(newItem)
    save()
    return newItem
  }

  function update(id: number, patch: Partial<Omit<Bookmark, 'id'>>) {
    const idx = items.value.findIndex((b) => b.id === id)
    if (idx === -1) return
    const cur = items.value[idx]!
    items.value[idx] = {
      id: cur.id,
      title: patch.title ?? cur.title,
      url: patch.url ?? cur.url,
      type: patch.type ?? cur.type,
      tags: patch.tags ?? cur.tags,
      folderId: patch.folderId !== undefined ? patch.folderId : cur.folderId,
      createdAt: cur.createdAt,
    }
    save()
  }

  function remove(id: number) {
    items.value = items.value.filter((b) => b.id !== id)
    save()
  }

  function addFolder(name: string) {
    const id = `f_${Date.now()}`
    folders.value.push({ id, name, order: folders.value.length })
    save()
    return id
  }

  function updateFolder(id: string, name: string) {
    const f = folders.value.find((x) => x.id === id)
    if (f) {
      f.name = name
      save()
    }
  }

  function removeFolder(id: string, moveToFolderId: string | null = null) {
    folders.value = folders.value.filter((f) => f.id !== id)
    items.value = items.value.map((b) =>
      b.folderId === id ? { ...b, folderId: moveToFolderId } : b
    )
    save()
  }

  function getFolderById(id: string) {
    return folders.value.find((f) => f.id === id)
  }

  function setAll(newItems: Bookmark[], newFolders?: BookmarkFolder[]) {
    items.value = newItems
    if (newFolders) folders.value = newFolders
    save()
  }

  return {
    items,
    folders,
    count,
    add,
    update,
    remove,
    addFolder,
    updateFolder,
    removeFolder,
    getFolderById,
    setAll,
    save,
  }
})
