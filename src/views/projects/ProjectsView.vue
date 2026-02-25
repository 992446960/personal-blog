<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types/project'

const { t } = useI18n()

const projects = ref<Project[]>([])
const filterTag = ref<string>('all')

// 运行时加载 JSON（Vite 会打包）
import('@/data/projects.json')
  .then((m) => {
    projects.value = (m.default as Project[]) ?? []
  })
  .catch(() => {
    projects.value = []
  })

const filtered = computed(() => {
  if (filterTag.value === 'all') return projects.value
  return projects.value.filter((p) => p.filters?.includes(filterTag.value))
})

const filterOptions = [
  { id: 'all', labelKey: 'projects.all' },
  { id: 'vue', labelKey: 'Vue' },
  { id: 'ts', labelKey: 'TypeScript' },
  { id: 'fullstack', labelKey: '全栈' },
]
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <div class="ph-left">
        <h2>{{ t('projects.title') }}</h2>
        <p>{{ t('projects.desc') }}</p>
      </div>
      <div class="ftabs">
        <button
          v-for="opt in filterOptions"
          :key="opt.id"
          type="button"
          class="ftab"
          :class="{ on: filterTag === opt.id }"
          @click="filterTag = opt.id"
        >
          {{ opt.id === 'all' ? t(opt.labelKey) : opt.labelKey }}
        </button>
      </div>
    </div>
    <div v-if="filtered.length === 0" class="empty-state">
      <span class="em">📭</span>
      {{ t('projects.empty') }}
    </div>
    <div v-else class="pgrid">
      <router-link
        v-for="(p, i) in filtered"
        :key="p.id"
        :to="`/projects/${p.id}`"
        class="pcard"
        :style="{ animationDelay: `${(i + 1) * 0.05}s` }"
      >
        <div
          class="pcov"
          :style="{
            background: `linear-gradient(140deg, ${p.color1 ?? 'var(--accent)'}22, ${p.color2 ?? '#b8aeff'}33)`,
          }"
        >
          <div
            class="pclbl"
            :style="{ color: p.color1 ?? 'var(--accent)' }"
          >
            {{ p.title.charAt(0) }}
          </div>
        </div>
        <div class="pbody">
          <div class="pmeta">
            <span class="ptype">{{ p.type }}</span>
            <span class="prole">{{ p.role }}</span>
            <span class="pdate">{{ p.date }}</span>
          </div>
          <div class="ptitle">{{ p.title }}</div>
          <div class="pdesc">{{ p.desc }}</div>
          <div class="pstack">
            <span v-for="s in p.stack" :key="s" class="schp">{{ s }}</span>
          </div>
          <div class="plinks">
            <a
              v-if="p.demo"
              :href="p.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="plink l-demo"
              @click.stop
            >
              🔗 Demo
            </a>
            <a
              v-if="p.src"
              :href="p.src"
              target="_blank"
              rel="noopener noreferrer"
              class="plink l-src"
              @click.stop
            >
              ⌨ 源码
            </a>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
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

.pgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 15px;
}

.pcard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  animation: fadeUp 0.4s ease both;
  text-decoration: none;
  color: inherit;
  display: block;
}

.pcard:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 52px rgba(0, 0, 0, 0.15);
  border-color: var(--border2);
}

.pcov {
  height: 150px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pclbl {
  position: relative;
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.18);
  letter-spacing: -0.04em;
}

.pbody {
  padding: 18px;
}

.pmeta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 9px;
  flex-wrap: wrap;
}

.ptype {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 3px 7px;
  border-radius: 4px;
  font-family: var(--font-display);
  background: var(--tbg);
  color: var(--tcolor);
}

.prole,
.pdate {
  font-size: 10px;
  color: var(--text3);
  font-family: var(--font-display);
}

.pdate {
  margin-left: auto;
}

.ptitle {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 7px;
  letter-spacing: -0.02em;
}

.pdesc {
  font-size: 12px;
  color: var(--text2);
  line-height: 1.7;
  margin-bottom: 14px;
}

.pstack {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.schp {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--bg3);
  color: var(--text2);
  font-family: var(--font-display);
}

.plinks {
  display: flex;
  gap: 7px;
}

.plink {
  font-size: 11px;
  font-weight: 600;
  padding: 6px 13px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
  font-family: var(--font-display);
  letter-spacing: 0.03em;
}

.l-demo {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 2px 10px var(--aglow);
}

.l-demo:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.l-src {
  background: var(--bg3);
  color: var(--text2);
  border: 1px solid var(--border);
}

.l-src:hover {
  color: var(--text);
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
