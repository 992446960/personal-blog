<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const toast = useToast()

const input = ref('Hello, Vue 3! 你好 🌏')
const output = ref('')
const urlSafe = ref(false)

/** 编码：输入(文本) → 输出(Base64)，与「解码输出」互逆 */
function encode() {
  try {
    let r = btoa(unescape(encodeURIComponent(input.value)))
    if (urlSafe.value) r = r.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    output.value = r
  } catch (e) {
    output.value = '编码错误: ' + (e instanceof Error ? e.message : String(e))
  }
}

/** 解码输出→输入：输出(Base64) → 输入(文本)，与「编码」互逆 */
function decodeOutputToInput() {
  try {
    let b = output.value.trim().replace(/-/g, '+').replace(/_/g, '/')
    while (b.length % 4) b += '='
    input.value = decodeURIComponent(escape(atob(b)))
  } catch (e) {
    input.value = '解码错误: ' + (e instanceof Error ? e.message : String(e))
  }
}

/** 解码输入→输出：输入(Base64) → 输出(文本)，与「编码」在另一侧互逆 */
function decodeInputToOutput() {
  try {
    let b = input.value.trim().replace(/-/g, '+').replace(/_/g, '/')
    while (b.length % 4) b += '='
    output.value = decodeURIComponent(escape(atob(b)))
  } catch (e) {
    output.value = '解码错误: ' + (e instanceof Error ? e.message : String(e))
  }
}

function copyOut() {
  navigator.clipboard.writeText(output.value).then(() => toast.show('✅ ' + t('common.copied')))
}

onMounted(() => encode())
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
      <div class="dgrid">
        <div class="darea">
          <div class="dlabel">
            输入（文本或 Base64）
            <span class="dlabel-actions">
              <button type="button" class="cpbtn" @click="encode">编码 →</button>
              <button type="button" class="cpbtn" @click="decodeOutputToInput">← 解码到左侧</button>
              <button type="button" class="cpbtn" @click="decodeInputToOutput">解码到右侧</button>
            </span>
          </div>
          <textarea v-model="input" class="dta" rows="4" @input="encode" />
        </div>
        <div class="darea">
          <div class="dlabel">
            Base64 输出（与左侧互为编解码）
            <button type="button" class="cpbtn" @click="copyOut">{{ t('common.copy') }}</button>
          </div>
          <div class="dres" :class="{ err: output.startsWith('编码错误') }">{{ output }}</div>
        </div>
      </div>
      <div class="dact">
        <label class="checkbox-label">
          <input v-model="urlSafe" type="checkbox" @change="encode" />
          URL-safe
        </label>
        <button type="button" class="sbtn" @click="input = ''; output = ''">{{ t('common.clear') }}</button>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dlabel-actions {
  display: flex;
  gap: 5px;
}

.dta {
  width: 100%;
  background: transparent;
  border: none;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text2);
  outline: none;
  resize: vertical;
  min-height: 100px;
  line-height: 1.65;
}

.dres {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--a2);
  line-height: 1.65;
  word-break: break-all;
  white-space: pre-wrap;
  max-height: 240px;
  overflow-y: auto;
}

.dres.err {
  color: var(--a4);
}

.dact {
  display: flex;
  gap: 7px;
  margin-top: 13px;
  flex-wrap: wrap;
}

.cpbtn {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: 7px;
  background: var(--surface2);
  color: var(--text2);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}

.cpbtn:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text2);
  cursor: pointer;
}

.checkbox-label input {
  accent-color: var(--accent);
}

@media (max-width: 900px) {
  .dgrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dta {
    min-height: 120px;
    font-size: 13px;
  }
  .dres {
    font-size: 13px;
  }
  .cpbtn {
    min-height: 44px;
    padding: 12px 14px;
  }
  .dact .sbtn {
    min-height: 44px;
    padding: 12px 14px;
  }
}
</style>
