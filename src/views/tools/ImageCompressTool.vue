<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const file = ref<File | null>(null)
const dataUrl = ref('')
const quality = ref(80)
const maxWidth = ref(1920)
const maxHeight = ref(1080)
const format = ref<'jpeg' | 'png' | 'webp'>('jpeg')
const compressedUrl = ref('')
const compressedSize = ref(0)
const originalSize = ref(0)
const compressing = ref(false)
const targetSizeKb = ref(0)
const useCustomSize = ref(false)
const customWidth = ref(1920)
const customHeight = ref(1080)

const PRESET_SIZES = [
  { w: 1920, h: 1080, label: '1920×1080' },
  { w: 1280, h: 720, label: '1280×720' },
  { w: 800, h: 600, label: '800×600' },
  { w: 414, h: 736, label: '414×736' },
  { w: 375, h: 667, label: '375×667' },
  { w: 1080, h: 1920, label: '1080×1920' },
]

const effectiveSize = computed(() => {
  if (useCustomSize.value) return { w: customWidth.value, h: customHeight.value }
  const p = PRESET_SIZES.find((s) => s.w === maxWidth.value && s.h === maxHeight.value)
  if (p) return { w: p.w, h: p.h }
  return { w: maxWidth.value, h: maxHeight.value }
})

const mime = computed(() =>
  format.value === 'jpeg' ? 'image/jpeg' : format.value === 'webp' ? 'image/webp' : 'image/png'
)

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(2) + ' MB'
}

function onFile(f: File | null) {
  if (!f || !f.type.startsWith('image/')) return
  file.value = f
  originalSize.value = f.size
  const reader = new FileReader()
  reader.onload = (e) => {
    dataUrl.value = (e.target?.result as string) ?? ''
    compress()
  }
  reader.readAsDataURL(f)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  const f = e.dataTransfer?.files?.[0]
  onFile(f ?? null)
}

function compress() {
  if (!dataUrl.value) return
  compressing.value = true
  const img = new Image()
  const { w: maxW, h: maxH } = effectiveSize.value
  img.onload = () => {
    let w = img.naturalWidth
    let h = img.naturalHeight
    if (w > maxW || h > maxH) {
      const rw = maxW / w
      const rh = maxH / h
      const r = Math.min(rw, rh, 1)
      w = Math.round(w * r)
      h = Math.round(h * r)
    }
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      compressing.value = false
      return
    }
    ctx.drawImage(img, 0, 0, w, h)
    let q = format.value === 'png' ? 1 : quality.value / 100
    let data = canvas.toDataURL(mime.value, q)
    let size = Math.round((data.split(',')[1]?.length ?? 0) * 0.75)
    const targetBytes = targetSizeKb.value > 0 ? targetSizeKb.value * 1024 : 0
    if (targetBytes > 0 && format.value !== 'png' && size > targetBytes && q < 1) {
      let lo = 0.1
      let hi = q
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2
        data = canvas.toDataURL(mime.value, mid)
        size = Math.round((data.split(',')[1]?.length ?? 0) * 0.75)
        if (size <= targetBytes) lo = mid
        else hi = mid
      }
      q = (lo + hi) / 2
      data = canvas.toDataURL(mime.value, q)
      size = Math.round((data.split(',')[1]?.length ?? 0) * 0.75)
      quality.value = Math.round(q * 100)
    }
    compressedUrl.value = data
    compressedSize.value = size
    compressing.value = false
  }
  img.src = dataUrl.value
}

const ratio = computed(() => {
  if (originalSize.value <= 0) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
})

function download() {
  if (!compressedUrl.value) return
  const a = document.createElement('a')
  a.href = compressedUrl.value
  a.download = `compressed.${format.value}`
  a.click()
  toast.show('✅ ' + '下载已开始')
}

function reset() {
  file.value = null
  dataUrl.value = ''
  compressedUrl.value = ''
  compressedSize.value = 0
  originalSize.value = 0
}
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
      <div v-if="!dataUrl" class="upzone" @dragover.prevent @drop="onDrop">
        <input
          type="file"
          accept="image/*"
          aria-label="选择图片"
          @change="onFile(($event.target as HTMLInputElement).files?.[0] ?? null)"
        />
        <div class="up-icon">🖼</div>
        <div class="up-title">点击或拖拽上传图片</div>
        <div class="up-sub">支持 JPG · PNG · WebP · GIF</div>
      </div>

      <template v-else>
        <div class="ictl">
          <div class="preset-row">
            <span class="rlbl">常用尺寸</span>
            <div class="preset-btns">
              <button
                v-for="p in PRESET_SIZES"
                :key="p.label"
                type="button"
                class="fmtbtn"
                :class="{ on: !useCustomSize && maxWidth === p.w && maxHeight === p.h }"
                @click="useCustomSize = false; maxWidth = p.w; maxHeight = p.h; compress()"
              >
                {{ p.label }}
              </button>
              <button
                type="button"
                class="fmtbtn"
                :class="{ on: useCustomSize }"
                @click="useCustomSize = true; compress()"
              >
                自定义
              </button>
            </div>
          </div>
          <div v-if="useCustomSize" class="rrow custom-size">
            <span class="rlbl">宽度</span>
            <input v-model.number="customWidth" type="number" min="1" max="4096" class="fi num-inp" @input="compress" />
            <span class="rlbl">高度</span>
            <input v-model.number="customHeight" type="number" min="1" max="4096" class="fi num-inp" @input="compress" />
          </div>
          <div class="rrow">
            <span class="rlbl">压缩质量</span>
            <input
              v-model.number="quality"
              type="range"
              min="1"
              max="100"
              @input="compress"
            />
            <span class="rval">{{ quality }}%</span>
          </div>
          <div class="rrow">
            <span class="rlbl">目标大小</span>
            <input
              v-model.number="targetSizeKb"
              type="number"
              min="0"
              placeholder="0=不限制"
              class="fi num-inp"
              style="width: 100px"
              @input="compress"
            />
            <span class="rval">KB</span>
          </div>
          <div class="fmt-row">
            <span class="rlbl">输出格式</span>
            <button
              type="button"
              class="fmtbtn"
              :class="{ on: format === 'jpeg' }"
              @click="format = 'jpeg'; compress()"
            >
              JPEG
            </button>
            <button
              type="button"
              class="fmtbtn"
              :class="{ on: format === 'png' }"
              @click="format = 'png'; compress()"
            >
              PNG
            </button>
            <button
              type="button"
              class="fmtbtn"
              :class="{ on: format === 'webp' }"
              @click="format = 'webp'; compress()"
            >
              WebP
            </button>
          </div>
        </div>
        <div class="ipgrid">
          <div class="ibox">
            <div class="ibox-hdr">
              <span class="ibox-lbl">原图</span>
              <span class="ibox-meta">{{ file ? `${file.name} · ${formatSize(originalSize)}` : '—' }}</span>
            </div>
            <img :src="dataUrl" alt="原图" class="ibox-img" />
          </div>
          <div class="ibox">
            <div class="ibox-hdr">
              <span class="ibox-lbl">压缩后</span>
              <span class="ibox-meta">{{ compressedUrl ? formatSize(compressedSize) : '—' }}</span>
            </div>
            <img
              v-if="compressedUrl"
              :src="compressedUrl"
              alt="压缩后"
              class="ibox-img"
            />
          </div>
        </div>
        <div v-if="compressedUrl" class="cstats">
          <span class="schip">原始 {{ formatSize(originalSize) }}</span>
          <span class="schip">压缩后 {{ formatSize(compressedSize) }}</span>
          <span class="schip" :class="ratio >= 0 ? 'g' : 'r'">
            {{ ratio >= 0 ? '↓' : '↑' }} {{ Math.abs(ratio) }}%
          </span>
        </div>
        <div class="dact">
          <button type="button" class="sbtn acc" @click="download">⬇ 下载压缩图</button>
          <button type="button" class="sbtn" @click="reset">重新上传</button>
        </div>
      </template>
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

.ictl {
  background: var(--bg3);
  border-radius: 11px;
  margin-bottom: 14px;
  padding: 16px;
}

.preset-row {
  margin-bottom: 12px;
}

.preset-row .rlbl {
  display: block;
  margin-bottom: 8px;
}

.preset-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.preset-row .fmtbtn {
  padding: 6px 10px;
  font-size: 11px;
}

.custom-size {
  flex-wrap: wrap;
}

.num-inp {
  width: 80px;
  padding: 6px 10px;
  font-size: 12px;
}

.rrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.rrow:last-of-type {
  margin-bottom: 0;
}

.rlbl {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  color: var(--text2);
  width: 60px;
  flex-shrink: 0;
}

.rval {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  width: 42px;
  text-align: right;
  flex-shrink: 0;
}

.rrow input[type='range'] {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--border2);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.rrow input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
  box-shadow: 0 2px 8px var(--aglow);
}

.fmt-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 12px;
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

.ipgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 16px;
}

.ibox {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 11px;
  overflow: hidden;
}

.ibox-hdr {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ibox-lbl {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  color: var(--text3);
  letter-spacing: 0.1em;
}

.ibox-meta {
  font-family: var(--font-display);
  font-size: 10px;
  color: var(--text2);
}

.ibox-img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  background: var(--surface3);
}

.cstats {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.schip {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 7px;
  background: var(--bg3);
  color: var(--text2);
}

.schip.g {
  background: rgba(62, 207, 142, 0.1);
  color: var(--a2);
}

.schip.r {
  background: rgba(247, 106, 124, 0.1);
  color: var(--a4);
}

.dact {
  display: flex;
  gap: 7px;
  margin-top: 14px;
}

@media (max-width: 900px) {
  .ipgrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .upzone {
    padding: 28px 16px;
  }
  .up-title {
    font-size: 13px;
  }
  .fmt-row {
    flex-wrap: wrap;
  }
  .fmtbtn {
    min-height: 44px;
    padding: 12px 14px;
  }
  .dact .sbtn {
    min-height: 44px;
    padding: 12px 14px;
  }
}
</style>
