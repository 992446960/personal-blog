<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const tsInput = ref(String(Date.now()))
const dateInput = ref('')

const tsResults = computed(() => {
  const raw = tsInput.value.trim()
  if (!raw) return []
  let ms = parseInt(raw, 10)
  if (Number.isNaN(ms)) return [{ label: '错误', value: '无效时间戳' }]
  if (ms < 1e11) ms *= 1000
  const d = new Date(ms)
  if (Number.isNaN(d.getTime())) return [{ label: '错误', value: '超出范围' }]
  return [
    { label: '本地时间', value: d.toLocaleString('zh-CN', { hour12: false }) },
    { label: 'UTC', value: d.toUTCString() },
    { label: 'ISO 8601', value: d.toISOString() },
    { label: '东京 JST', value: d.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false }) },
    { label: '纽约 EST', value: d.toLocaleString('en-US', { timeZone: 'America/New_York', hour12: false }) },
    { label: '秒级戳', value: String(Math.floor(ms / 1000)) },
    { label: '毫秒戳', value: String(ms) },
  ]
})

const dateToTs = computed(() => {
  if (!dateInput.value) return null
  const d = new Date(dateInput.value)
  if (Number.isNaN(d.getTime())) return null
  return { sec: Math.floor(d.getTime() / 1000), ms: d.getTime() }
})

function setNow(unit: 'ms' | 's') {
  if (unit === 'ms') tsInput.value = String(Date.now())
  else tsInput.value = String(Math.floor(Date.now() / 1000))
}

function copyVal(val: string) {
  navigator.clipboard.writeText(val).then(() => toast.show('✅ 已复制'))
}

function setDateNow() {
  dateInput.value = new Date().toISOString().slice(0, 16)
}

onMounted(() => {
  dateInput.value = new Date().toISOString().slice(0, 16)
})
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
      <div class="ts-section">
        <div class="dlabel">时间戳 (秒或毫秒，自动识别)</div>
        <input
          v-model="tsInput"
          type="text"
          class="ts-biginput"
          placeholder="时间戳"
        />
        <div class="ts-actions">
          <button type="button" class="sbtn" @click="setNow('ms')">📍 现在(ms)</button>
          <button type="button" class="sbtn" @click="setNow('s')">📍 现在(s)</button>
          <button type="button" class="sbtn" @click="tsInput = ''">清空</button>
        </div>
      </div>
      <div class="tsrows">
        <button
          v-for="row in tsResults"
          :key="row.label"
          type="button"
          class="tsrow"
          :class="{ err: row.label === '错误' }"
          @click="copyVal(row.value)"
        >
          <span class="tslbl">{{ row.label }}</span>
          <span class="tsval">{{ row.value }}</span>
          <span class="tshint">复制</span>
        </button>
      </div>

      <div class="ts-section" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border)">
        <div class="dlabel">日期时间 → 时间戳</div>
        <div class="dt-row">
          <input v-model="dateInput" type="datetime-local" class="fi dt-input" />
          <button type="button" class="sbtn" @click="setDateNow">现在</button>
        </div>
        <div v-if="dateToTs" class="tsrows">
          <button type="button" class="tsrow" @click="copyVal(String(dateToTs.sec))">
            <span class="tslbl">秒级</span>
            <span class="tsval">{{ dateToTs.sec }}</span>
            <span class="tshint">复制</span>
          </button>
          <button type="button" class="tsrow" @click="copyVal(String(dateToTs.ms))">
            <span class="tslbl">毫秒</span>
            <span class="tsval">{{ dateToTs.ms }}</span>
            <span class="tshint">复制</span>
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
  margin-bottom: 8px;
  letter-spacing: 0.1em;
  font-family: var(--font-display);
  text-transform: uppercase;
}

.ts-biginput {
  width: 100%;
  background: transparent;
  border: none;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 700;
  color: var(--accent);
  outline: none;
  padding: 8px 0;
  border-bottom: 2px solid var(--border);
  transition: border-color 0.15s;
}

.ts-biginput:focus {
  border-color: var(--accent);
}

.ts-actions {
  display: flex;
  gap: 7px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.tsrows {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-top: 10px;
}

.tsrow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 9px;
  background: var(--bg3);
  border: 1px solid var(--border);
  margin-bottom: 0;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
  font-family: inherit;
  color: inherit;
}

.tsrow:hover {
  border-color: var(--accent);
  background: var(--surface2);
}

.tsrow:hover .tshint {
  opacity: 1;
}

.tsrow.err .tsval {
  color: var(--a4);
}

.tslbl {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  color: var(--text3);
  letter-spacing: 0.08em;
  width: 70px;
  flex-shrink: 0;
}

.tsval {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tshint {
  font-size: 10px;
  color: var(--accent);
  font-family: var(--font-display);
  opacity: 0;
  transition: opacity 0.15s;
}

.dt-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.fi.dt-input {
  flex: 1;
  min-width: 180px;
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 13px;
  color: var(--text);
  outline: none;
}

.fi.dt-input:focus {
  border-color: var(--accent);
}
</style>
