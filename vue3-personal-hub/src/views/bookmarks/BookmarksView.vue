<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookmarksStore } from '@/stores/bookmarks'
import { useToast } from '@/composables/useToast'
import type { BookmarkType } from '@/types/bookmarks'

const { t } = useI18n()
const toast = useToast()
const store = useBookmarksStore()

const search = ref('')
const typeFilter = ref<BookmarkType | 'all'>('all')
const folderId = ref<string | null>(null)

const filteredList = computed(() => {
  let list = store.items
  if (typeFilter.value !== 'all') list = list.filter((b) => b.type === typeFilter.value)
  if (folderId.value) list = list.filter((b) => b.folderId === folderId.value)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
    )
  }
  return list
})

const formOpen = ref(false)
const formTitle = ref('')
const formUrl = ref('')
const formType = ref<BookmarkType>('article')
const formFolderId = ref<string | null>(null)
const formTags = ref('')
const editingId = ref<number | null>(null)

const folderManageOpen = ref(false)
const folderEditId = ref<string | null>(null)
const folderEditName = ref('')
const newFolderName = ref('')
const deleteFolderId = ref<string | null>(null)
const deleteMoveToId = ref<string | null>(null)

function openAdd() {
  editingId.value = null
  formTitle.value = ''
  formUrl.value = ''
  formType.value = 'article'
  formFolderId.value = store.folders[0]?.id ?? null
  formTags.value = ''
  formOpen.value = true
}

function openEdit(b: { id: number; title: string; url: string; type: BookmarkType; folderId: string | null; tags: string[] }) {
  editingId.value = b.id
  formTitle.value = b.title
  formUrl.value = b.url
  formType.value = b.type
  formFolderId.value = b.folderId
  formTags.value = b.tags.join(', ')
  formOpen.value = true
}

function submitForm() {
  const title = formTitle.value.trim()
  const url = formUrl.value.trim()
  if (!title || !url) {
    toast.show('⚠️ ' + t('bookmarks.formTitle') + ' & URL ' + t('bookmarks.formUrl'))
    return
  }
  const tags = formTags.value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (editingId.value != null) {
    store.update(editingId.value, { title, url, type: formType.value, folderId: formFolderId.value, tags })
    toast.show('✅ ' + t('toast.saved'))
  } else {
    store.add({ title, url, type: formType.value, folderId: formFolderId.value, tags })
    toast.show('✅ ' + t('toast.saved'))
  }
  formOpen.value = false
}

function remove(id: number) {
  store.remove(id)
  toast.show('🗑 ' + t('toast.deleted'))
}

function setType(t: BookmarkType | 'all') {
  typeFilter.value = t
}

function setFolder(id: string | null) {
  folderId.value = id
}

function openFolderManage() {
  folderManageOpen.value = true
  folderEditId.value = null
  folderEditName.value = ''
  newFolderName.value = ''
  deleteFolderId.value = null
  deleteMoveToId.value = null
}

function startEditFolder(f: { id: string; name: string }) {
  folderEditId.value = f.id
  folderEditName.value = f.name
}

function saveEditFolder() {
  if (folderEditId.value && folderEditName.value.trim()) {
    store.updateFolder(folderEditId.value, folderEditName.value.trim())
    folderEditId.value = null
    folderEditName.value = ''
    toast.show('✅ ' + t('toast.saved'))
  }
}

function addFolderSubmit() {
  const name = newFolderName.value.trim()
  if (!name) return
  store.addFolder(name)
  newFolderName.value = ''
  toast.show('✅ 文件夹已添加')
}

function confirmDeleteFolder(id: string) {
  deleteFolderId.value = id
  deleteMoveToId.value = null
}

function doDeleteFolder() {
  if (!deleteFolderId.value) return
  const moveTo = deleteMoveToId.value ?? null
  store.removeFolder(deleteFolderId.value, moveTo)
  if (folderId.value === deleteFolderId.value) folderId.value = null
  deleteFolderId.value = null
  deleteMoveToId.value = null
  folderManageOpen.value = false
  toast.show('🗑 文件夹已删除')
}

function cancelDeleteFolder() {
  deleteFolderId.value = null
  deleteMoveToId.value = null
}

const countInFolder = (fid: string) => store.items.filter((b) => b.folderId === fid).length

function exportJson() {
  const blob = new Blob([JSON.stringify(store.items, null, 2)], {
    type: 'application/json',
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `bookmarks-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
  toast.show('📁 ' + t('toast.exported'))
}

function triggerImport(type: 'json' | 'html') {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = type === 'json' ? '.json,application/json' : '.html,text/html'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      if (type === 'json') importJson(text)
      else importBrowserHtml(text)
    }
    reader.readAsText(file)
  }
  input.click()
}

function importJson(text: string) {
  try {
    const data = JSON.parse(text)
    const list = Array.isArray(data) ? data : data.items ?? data.bookmarks ?? []
    const folderMap = new Map(store.folders.map((f) => [f.id, f.id]))
    const newItems = list.map((b: Record<string, unknown>) => ({
      id: typeof b.id === 'number' ? b.id : Date.now() + Math.random(),
      title: String(b.title ?? ''),
      url: String(b.url ?? ''),
      type: ['article', 'video', 'other'].includes(String(b.type)) ? b.type : 'other',
      tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
      folderId: b.folderId ? String(b.folderId) : (b.folder && folderMap.get(String(b.folder))) ? String(b.folder) : null,
      createdAt: typeof b.createdAt === 'number' ? b.createdAt : Date.now(),
    }))
    store.setAll(newItems, store.folders)
    toast.show('✅ ' + t('toast.imported') + ` (${newItems.length})`)
  } catch (err) {
    toast.show('❌ ' + (err instanceof Error ? err.message : 'Invalid JSON'))
  }
}

/** 解析浏览器书签 HTML（Chrome/Edge 等导出格式） */
function importBrowserHtml(html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const links = doc.querySelectorAll('a[href]')
  const defaultFolderId = store.folders[0]?.id ?? null
  const newItems: Array<{ id: number; title: string; url: string; type: BookmarkType; tags: string[]; folderId: string | null; createdAt: number }> = []
  const baseId = Date.now()
  links.forEach((a, i) => {
    const href = (a as HTMLAnchorElement).getAttribute('href')
    const title = (a as HTMLAnchorElement).textContent?.trim() || href || 'Untitled'
    if (!href || href.startsWith('place:') || href.startsWith('javascript:')) return
    newItems.push({
      id: baseId + i,
      title,
      url: href,
      type: 'other',
      tags: [],
      folderId: defaultFolderId,
      createdAt: Date.now(),
    })
  })
  const merged = [...newItems, ...store.items]
  store.setAll(merged, store.folders)
  toast.show('✅ ' + t('toast.imported') + ` (${newItems.length})`)
}

const typeLabels: Record<BookmarkType, string> = {
  article: 'bookmarks.typeArticle',
  video: 'bookmarks.typeVideo',
  other: 'bookmarks.typeOther',
}
const typeIcons: Record<BookmarkType, string> = {
  article: '📄',
  video: '🎬',
  other: '🔗',
}
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <div class="ph-left">
        <h2>{{ t('bookmarks.title') }}</h2>
        <p>{{ t('bookmarks.desc') }}</p>
      </div>
      <div class="tb">
        <div class="sw">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="search"
            type="text"
            :placeholder="t('bookmarks.search')"
            class="search-input"
            aria-label="Search bookmarks"
          />
        </div>
        <div class="ftabs">
          <button type="button" class="ftab" :class="{ on: typeFilter === 'all' }" @click="setType('all')">
            {{ t('bookmarks.all') }}
          </button>
          <button type="button" class="ftab" :class="{ on: typeFilter === 'article' }" @click="setType('article')">
            {{ t('bookmarks.article') }}
          </button>
          <button type="button" class="ftab" :class="{ on: typeFilter === 'video' }" @click="setType('video')">
            {{ t('bookmarks.video') }}
          </button>
          <button type="button" class="ftab" :class="{ on: typeFilter === 'other' }" @click="setType('other')">
            {{ t('bookmarks.other') }}
          </button>
        </div>
        <button type="button" class="sbtn" @click="openAdd">＋ {{ t('bookmarks.add') }}</button>
        <button type="button" class="sbtn" @click="exportJson">⬇ {{ t('bookmarks.export') }}</button>
        <button type="button" class="sbtn" @click="triggerImport('json')">{{ t('bookmarks.import') }} JSON</button>
        <button type="button" class="sbtn" @click="triggerImport('html')">{{ t('bookmarks.importBrowser') }}</button>
      </div>
    </div>

    <div v-if="formOpen" class="aform open">
      <div class="fg">
        <div class="ff">
          <label>{{ t('bookmarks.formTitle') }} *</label>
          <input v-model="formTitle" class="fi" type="text" :placeholder="t('bookmarks.formTitle')" />
        </div>
        <div class="ff">
          <label>{{ t('bookmarks.formUrl') }} *</label>
          <input v-model="formUrl" class="fi" type="url" placeholder="https://…" />
        </div>
        <div class="ff">
          <label>{{ t('bookmarks.formType') }}</label>
          <select v-model="formType" class="fsel">
            <option value="article">📄 {{ t('bookmarks.typeArticle') }}</option>
            <option value="video">🎬 {{ t('bookmarks.typeVideo') }}</option>
            <option value="other">🔗 {{ t('bookmarks.typeOther') }}</option>
          </select>
        </div>
        <div class="ff">
          <label>{{ t('bookmarks.formFolder') }}</label>
          <select v-model="formFolderId" class="fsel">
            <option v-for="f in store.folders" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </div>
        <div class="ff" style="grid-column: 1 / -1">
          <label>{{ t('bookmarks.formTags') }}</label>
          <input v-model="formTags" class="fi" type="text" placeholder="vue, 教程" />
        </div>
      </div>
      <div class="fa">
        <button type="button" class="sbtn" @click="formOpen = false">{{ t('bookmarks.cancel') }}</button>
        <button type="button" class="sbtn acc" @click="submitForm">{{ t('bookmarks.save') }}</button>
      </div>
    </div>

    <div class="fbar">
      <span class="fbar-label">{{ t('bookmarks.folder') }}</span>
      <button
        type="button"
        class="fchip"
        :class="{ on: folderId === null }"
        @click="setFolder(null)"
      >
        <span class="fdot" style="background: var(--accent)" />
        全部
      </button>
      <button
        v-for="f in store.folders"
        :key="f.id"
        type="button"
        class="fchip"
        :class="{ on: folderId === f.id }"
        @click="setFolder(f.id)"
      >
        <span class="fdot" :style="{ background: 'var(--a2)' }" />
        {{ f.name }}
      </button>
      <button type="button" class="sbtn" @click="openFolderManage">管理文件夹</button>
    </div>

    <div v-if="folderManageOpen" class="aform open folder-manage">
      <div class="folder-manage-h">文件夹管理</div>
      <div class="folder-list">
        <div v-for="f in store.folders" :key="f.id" class="folder-row">
          <template v-if="folderEditId === f.id">
            <input v-model="folderEditName" class="fi folder-name-inp" type="text" @keydown.enter="saveEditFolder" />
            <button type="button" class="sbtn acc" @click="saveEditFolder">保存</button>
            <button type="button" class="sbtn" @click="folderEditId = null">取消</button>
          </template>
          <template v-else>
            <span class="folder-name">{{ f.name }}</span>
            <span class="folder-count">({{ countInFolder(f.id) }})</span>
            <button type="button" class="sbtn small" @click="startEditFolder(f)">编辑</button>
            <button type="button" class="sbtn small" @click="confirmDeleteFolder(f.id)">删除</button>
          </template>
        </div>
      </div>
      <div class="folder-add">
        <input v-model="newFolderName" class="fi folder-name-inp" type="text" placeholder="新文件夹名称" @keydown.enter="addFolderSubmit" />
        <button type="button" class="sbtn acc" @click="addFolderSubmit">新增文件夹</button>
      </div>
      <div v-if="deleteFolderId" class="folder-delete">
        <p>删除「{{ store.getFolderById(deleteFolderId)?.name }}」？该文件夹内 {{ countInFolder(deleteFolderId) }} 条收藏可移至：</p>
        <select v-model="deleteMoveToId" class="fsel" style="max-width: 200px">
          <option :value="null">无（归入未分类）</option>
          <option v-for="f in store.folders.filter(x => x.id !== deleteFolderId)" :key="f.id" :value="f.id">{{ f.name }}</option>
        </select>
        <div class="fa">
          <button type="button" class="sbtn" @click="cancelDeleteFolder">取消</button>
          <button type="button" class="sbtn acc" @click="doDeleteFolder">确认删除</button>
        </div>
      </div>
      <div class="fa" style="margin-top: 12px">
        <button type="button" class="sbtn" @click="folderManageOpen = false">关闭</button>
      </div>
    </div>

    <div v-if="filteredList.length === 0" class="empty-state">
      <span class="em">🔍</span>
      {{ t('bookmarks.empty') }}<br />
      {{ t('bookmarks.emptyHint') }}
    </div>
    <div v-else class="bklist">
      <div
        v-for="(b, i) in filteredList"
        :key="b.id"
        class="bkitem"
        :style="{ animationDelay: `${i * 0.035}s` }"
      >
        <div class="bk-fav">{{ typeIcons[b.type] }}</div>
        <div class="bk-info">
          <a :href="b.url" target="_blank" rel="noopener noreferrer" class="bk-title">{{ b.title }}</a>
          <div class="bk-url">{{ b.url }}</div>
        </div>
        <div class="bk-tags">
          <span v-for="tag in b.tags" :key="tag" class="bk-tag">{{ tag }}</span>
        </div>
        <span class="tbadge" :class="`t-${b.type}`">{{ t(typeLabels[b.type]) }}</span>
        <button type="button" class="sbtn small" @click="openEdit(b)" aria-label="Edit">✎</button>
        <button type="button" class="sbtn small" @click="remove(b.id)" aria-label="Delete">×</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  align-items: center;
}

.sw {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 8px 13px;
  width: 210px;
  transition: all 0.15s;
}

.sw:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--aglow);
}

.search-input {
  border: none;
  background: transparent;
  font-size: 12px;
  color: var(--text);
  outline: none;
  width: 100%;
}

.ftabs {
  display: flex;
  gap: 4px;
}

.ftab {
  font-size: 12px;
  font-weight: 500;
  padding: 6px 13px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  cursor: pointer;
  transition: all 0.15s;
}

.ftab:hover {
  color: var(--text);
  background: var(--surface2);
}

.ftab.on {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  font-weight: 600;
}

.aform {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
  margin-bottom: 20px;
  animation: secIn 0.3s var(--ease-out);
}

.aform.open {
  display: block;
}

.fg {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.ff label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text3);
  letter-spacing: 0.08em;
  font-family: var(--font-display);
  display: block;
  margin-bottom: 5px;
}

.fi,
.fsel {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: all 0.15s;
  width: 100%;
}

.fi:focus,
.fsel:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--aglow);
  background: var(--surface2);
}

.fsel {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.fa {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.fbar {
  display: flex;
  gap: 7px;
  margin-bottom: 18px;
  flex-wrap: wrap;
  align-items: center;
}

.fbar-label {
  font-size: 11px;
  color: var(--text3);
  font-family: var(--font-display);
  letter-spacing: 0.06em;
  margin-right: 2px;
}

.fchip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 13px;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  cursor: pointer;
  transition: all 0.15s;
}

.fchip:hover,
.fchip.on {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--tbg);
}

.fdot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.folder-manage .folder-manage-h {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
}

.folder-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.folder-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.folder-name {
  font-weight: 500;
  color: var(--text);
}

.folder-count {
  font-size: 11px;
  color: var(--text3);
}

.folder-name-inp {
  max-width: 180px;
}

.folder-add {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.folder-add .folder-name-inp {
  max-width: 200px;
}

.folder-delete {
  padding: 12px;
  background: var(--bg3);
  border-radius: 10px;
  margin-bottom: 12px;
}

.folder-delete p {
  font-size: 12px;
  color: var(--text2);
  margin-bottom: 8px;
}

.bklist {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.bkitem {
  display: flex;
  align-items: center;
  gap: 13px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 11px;
  padding: 13px 16px;
  transition: all 0.2s var(--ease-out);
  animation: bkIn 0.3s ease both;
}

.bkitem:hover {
  border-color: var(--border2);
  transform: translateX(5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.bk-fav {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--bg3);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}

.bk-info {
  flex: 1;
  min-width: 0;
}

.bk-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.bk-url {
  font-size: 11px;
  color: var(--text3);
  font-family: var(--font-display);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bk-tags {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

.bk-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--bg3);
  color: var(--text3);
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}

.tbadge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  font-family: var(--font-display);
}

.t-article {
  background: rgba(124, 106, 247, 0.12);
  color: var(--tcolor);
}

.t-video {
  background: rgba(247, 106, 124, 0.12);
  color: var(--a4);
}

.t-other {
  background: rgba(62, 207, 142, 0.12);
  color: var(--a2);
}

.sbtn.small {
  padding: 4px 9px;
  font-size: 11px;
  flex-shrink: 0;
}

@keyframes bkIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes secIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .fg {
    grid-template-columns: 1fr;
  }
}
</style>
