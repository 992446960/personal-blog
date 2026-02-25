<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const toast = useToast()

const defaultJson = '{"name":"Vue","version":3,"features":["Composition API","Teleport","Suspense"],"author":{"name":"Evan You"}}'
const input = ref(defaultJson)
const output = ref('')
const status = ref('')
const isError = ref(false)

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// 使用正则字面量避免 RegExp 字符串中引号转义问题；字符类内 [^\\"] 表示“非反斜杠非引号”
const jsonTokenRe = /"(?:\\u[\da-fA-F]{4}|\\[^u]|[^"\\])*"(?:\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g

function highlight(json: string) {
  return json.replace(jsonTokenRe, (m) => {
    let c = 'color:var(--a3)'
    if (/^"/.test(m)) {
      if (/:$/.test(m)) c = 'color:var(--accent)'
      else c = 'color:var(--a2)'
    } else if (/true|false/.test(m)) c = 'color:var(--a4)'
    else if (/null/.test(m)) c = 'color:var(--text3)'
    return '<span style="' + c + '">' + escapeHtml(m) + '</span>'
  })
}

function format() {
  try {
    const parsed = JSON.parse(input.value)
    const formatted = JSON.stringify(parsed, null, 2)
    output.value = formatted
    status.value = `✓ 有效 JSON · ${formatted.length} 字符`
    isError.value = false
  } catch (e) {
    output.value = '❌ ' + (e instanceof Error ? e.message : String(e))
    status.value = ''
    isError.value = true
  }
}

function minify() {
  try {
    const parsed = JSON.parse(input.value)
    output.value = JSON.stringify(parsed)
    status.value = `✓ ${output.value.length} 字符`
    isError.value = false
  } catch (e) {
    output.value = '❌ ' + (e instanceof Error ? e.message : String(e))
    isError.value = true
  }
}

function copyOut() {
  navigator.clipboard.writeText(output.value).then(() => toast.show('✅ ' + t('common.copied')))
}

const outputHtml = computed(() =>
  isError.value ? escapeHtml(output.value) : highlight(output.value)
)

onMounted(() => format())
</script>

<template>
  <div class="page-content">
    <div class="tool-panel">
      <div class="dgrid">
        <div class="darea">
          <div class="dlabel">
            输入 JSON
            <span class="dlabel-actions">
              <button type="button" class="cpbtn" @click="format">格式化</button>
              <button type="button" class="cpbtn" @click="minify">压缩</button>
            </span>
          </div>
          <textarea v-model="input" class="dta" style="min-height: 160px" @input="format" />
        </div>
        <div class="darea">
          <div class="dlabel">
            输出
            <button type="button" class="cpbtn" @click="copyOut">{{ t('common.copy') }}</button>
          </div>
          <div
            class="dres jsout"
            :class="{ err: isError }"
            style="min-height: 160px; font-size: 11px"
            v-html="outputHtml"
          />
        </div>
      </div>
      <div v-if="status" class="jsstatus">{{ status }}</div>
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
  line-height: 1.65;
}

.dres {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--a2);
  line-height: 1.65;
  word-break: break-all;
  white-space: pre-wrap;
  overflow-y: auto;
}

.dres.err {
  color: var(--a4);
}

.jsout :deep(span) {
  font-family: var(--font-mono);
}

.jsstatus {
  margin-top: 10px;
  font-size: 11px;
  color: var(--text3);
  font-family: var(--font-display);
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

@media (max-width: 900px) {
  .dgrid {
    grid-template-columns: 1fr;
  }
}
</style>
