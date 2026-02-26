<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const targetFormat = ref<'png' | 'webp' | 'jpeg' | 'bmp'>('webp')
const results = ref<Array<{ name: string; dataUrl: string; w: number; h: number; size: number }>>([])

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(2) + ' MB'
}

function getMime() {
  return targetFormat.value === 'jpeg'
    ? 'image/jpeg'
    : targetFormat.value === 'webp'
      ? 'image/webp'
      : targetFormat.value === 'bmp'
        ? 'image/bmp'
        : 'image/png'
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files) loadFiles(Array.from(files))
}

function onFileSelect(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files) loadFiles(Array.from(input.files))
}

function loadFiles(files: File[]) {
  results.value = []
  const mime = getMime()
  let done = 0
  files.forEach((file) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = (ev.target?.result as string) ?? ''
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        if (targetFormat.value === 'jpeg' || targetFormat.value === 'bmp') {
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, img.width, img.height)
        }
        ctx.drawImage(img, 0, 0)
        const out = canvas.toDataURL(mime, 0.95)
        const size = Math.round((out.split(',')[1]?.length ?? 0) * 0.75)
        const baseName = file.name.replace(/\.[^.]+$/, '')
        results.value.push({
          name: `${baseName}.${targetFormat.value}`,
          dataUrl: out,
          w: img.width,
          h: img.height,
          size,
        })
        done++
        if (done === 1) toast.show(`🔄 已转换 ${results.value.length} 张`)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

function download(item: { name: string; dataUrl: string }) {
  const a = document.createElement('a')
  a.href = item.dataUrl
  a.download = item.name
  a.click()
  toast.show('✅ 下载已开始')
}
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
      <div class="dlabel">选择目标格式</div>
      <div class="fmt-row">
        <button
          type="button"
          class="fmtbtn"
          :class="{ on: targetFormat === 'png' }"
          @click="targetFormat = 'png'"
        >
          PNG
        </button>
        <button
          type="button"
          class="fmtbtn"
          :class="{ on: targetFormat === 'webp' }"
          @click="targetFormat = 'webp'"
        >
          WebP
        </button>
        <button
          type="button"
          class="fmtbtn"
          :class="{ on: targetFormat === 'jpeg' }"
          @click="targetFormat = 'jpeg'"
        >
          JPEG
        </button>
        <button
          type="button"
          class="fmtbtn"
          :class="{ on: targetFormat === 'bmp' }"
          @click="targetFormat = 'bmp'"
        >
          BMP
        </button>
      </div>
      <div class="upzone" @dragover.prevent @drop="onDrop">
        <input
          type="file"
          accept="image/*"
          multiple
          aria-label="选择图片"
          @change="onFileSelect"
        />
        <div class="up-icon">🔄</div>
        <div class="up-title">点击或拖拽上传图片</div>
        <div class="up-sub">支持多文件批量转换</div>
      </div>
      <div class="cv-res">
        <div
          v-for="item in results"
          :key="item.name"
          class="cv-item"
        >
          <div class="bk-fav">🖼</div>
          <div class="bk-info">
            <div class="bk-title">{{ item.name }}</div>
            <div class="bk-url">{{ item.w }}×{{ item.h }} · {{ formatSize(item.size) }}</div>
          </div>
          <span class="tbadge">{{ targetFormat.toUpperCase() }}</span>
          <button type="button" class="sbtn acc" @click="download(item)">
            ⬇ 下载
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tool-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 22px;
}

.dlabel {
  font-size: 10px;
  font-weight: 700;
  color: var(--text3);
  margin-bottom: 10px;
  letter-spacing: 0.1em;
  font-family: var(--font-display);
  text-transform: uppercase;
}

.fmt-row {
  display: flex;
  gap: 7px;
  margin-bottom: 16px;
}

.fmtbtn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--bg3);
  color: var(--text2);
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.fmtbtn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.fmtbtn.on {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.upzone {
  border: 2px dashed var(--border2);
  border-radius: 13px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg3);
  position: relative;
}

.upzone input[type='file'] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.up-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.up-title {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 5px;
}

.up-sub {
  font-size: 12px;
  color: var(--text3);
}

.cv-res {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cv-item {
  display: flex;
  align-items: center;
  gap: 13px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 11px;
  padding: 13px 16px;
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
}

.bk-url {
  font-size: 11px;
  color: var(--text3);
  font-family: var(--font-display);
}

.tbadge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: var(--font-display);
  background: var(--tbg);
  color: var(--tcolor);
}

@media (max-width: 600px) {
  .upzone {
    padding: 28px 16px;
  }
  .up-title {
    font-size: 13px;
  }
  .up-sub {
    font-size: 12px;
  }
  .fmt-row {
    flex-wrap: wrap;
  }
  .fmtbtn {
    min-height: 44px;
    padding: 12px 14px;
  }
  .cv-item {
    flex-wrap: wrap;
    gap: 10px;
  }
  .cv-item .bk-info {
    flex: 1 1 100%;
    min-width: 0;
  }
  .cv-item .bk-title,
  .cv-item .bk-url {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .cv-item .sbtn {
    min-height: 44px;
    padding: 10px 14px;
  }
}
</style>
