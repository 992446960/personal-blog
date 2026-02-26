<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const hexInput = ref('#7C6AF7')
const pickerValue = ref('#7c6af7')

const presets = [
  '#7c6af7', '#3ecf8e', '#f7c26a', '#f76a7c', '#4285f4', '#34a853',
  '#ea4335', '#fbbc05', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
]

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return { r, g, b }
}

function rgbToHsl(r: number, g: number, b: number) {
  const rf = r / 255
  const gf = g / 255
  const bf = b / 255
  const max = Math.max(rf, gf, bf)
  const min = Math.min(rf, gf, bf)
  const l = (max + min) / 2
  let s = 0
  let h = 0
  if (max !== min) {
    const d = max - min
    s = l < 0.5 ? d / (max + min) : d / (2 - max - min)
    if (max === rf) h = (gf - bf) / d + (gf < bf ? 6 : 0)
    else if (max === gf) h = (bf - rf) / d + 2
    else h = (rf - gf) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const rgb = computed(() => {
  const h = hexInput.value
  if (!/^#[0-9a-fA-F]{6}$/.test(h)) return null
  return hexToRgb(h)
})

const hsl = computed(() => {
  if (!rgb.value) return null
  return rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)
})

const rows = computed(() => {
  const h = hexInput.value
  if (!rgb.value || !hsl.value) return []
  const { r, g, b } = rgb.value
  const { h: hh, s, l } = hsl.value
  return [
    ['HEX', h.toUpperCase()],
    ['RGB', `rgb(${r}, ${g}, ${b})`],
    ['HSL', `hsl(${hh}, ${s}%, ${l}%)`],
    ['R/G/B', `${r} / ${g} / ${b}`],
    ['CSS var', `--color: ${h.toLowerCase()}`],
  ]
})

function setHex(v: string) {
  const h = v.startsWith('#') ? v : '#' + v
  if (/^#[0-9a-fA-F]{6}$/.test(h)) {
    hexInput.value = h
    pickerValue.value = h
  }
}

function setFromPicker(v: string) {
  hexInput.value = v
  pickerValue.value = v
}

function copyVal(val: string) {
  navigator.clipboard.writeText(val).then(() => toast.show('✅ ' + val))
}

onMounted(() => setHex(hexInput.value))
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
      <div class="dgrid">
        <div class="darea">
          <div class="dlabel">颜色输入</div>
          <div class="hxwrap">
            <input
              v-model="pickerValue"
              type="color"
              class="color-pick"
              @input="setFromPicker(($event.target as HTMLInputElement).value)"
            />
            <input
              :value="hexInput"
              type="text"
              class="hxtxt"
              maxlength="7"
              placeholder="#RRGGBB"
              @input="setHex(($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="cswatch" :style="{ background: rgb ? hexInput : 'var(--border)' }" />
          <div class="cpresets">
            <button
              v-for="c in presets"
              :key="c"
              type="button"
              class="preset-dot"
              :style="{ background: c }"
              :aria-label="c"
              @click="setHex(c); pickerValue = c"
            />
          </div>
        </div>
        <div class="darea">
          <div class="dlabel">转换结果 (点击复制)</div>
          <div class="cvals">
            <button
              v-for="[lbl, val] in rows"
              :key="String(lbl)"
              type="button"
              class="cvrow"
              @click="copyVal(String(val))"
            >
              <span class="cvlbl">{{ lbl }}</span>
              <span class="cvval">{{ val }}</span>
              <span class="chint">复制</span>
            </button>
          </div>
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

.dgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.darea {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 11px;
  padding: 14px;
}

.dlabel {
  font-size: 10px;
  font-weight: 700;
  color: var(--text3);
  margin-bottom: 9px;
  letter-spacing: 0.1em;
  font-family: var(--font-display);
  text-transform: uppercase;
}

.hxwrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.color-pick {
  width: 48px;
  height: 40px;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  background: none;
  padding: 0;
}

.hxtxt {
  flex: 1;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  outline: none;
  transition: all 0.15s;
}

.hxtxt:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--aglow);
}

.cswatch {
  width: 100%;
  height: 52px;
  border-radius: 9px;
  margin-bottom: 12px;
  border: 1px solid var(--border);
}

.cpresets {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
}

.preset-dot {
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s;
  border: none;
  padding: 0;
}

.preset-dot:hover {
  transform: scale(1.15);
}

.cvals {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cvrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
  font-family: inherit;
  color: inherit;
}

.cvrow:hover {
  border-color: var(--accent);
  background: var(--surface2);
}

.cvrow:hover .chint {
  opacity: 1;
}

.cvlbl {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 700;
  color: var(--text3);
  letter-spacing: 0.08em;
  width: 36px;
  flex-shrink: 0;
}

.cvval {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text);
  flex: 1;
  margin-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chint {
  font-size: 10px;
  color: var(--accent);
  opacity: 0;
  transition: opacity 0.15s;
  font-family: var(--font-display);
}

@media (max-width: 900px) {
  .dgrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .cpresets {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .preset-dot {
    min-width: 36px;
    min-height: 36px;
  }
  .cpbtn,
  .cvrow {
    min-height: 44px;
    padding: 12px 14px;
  }
}
</style>
