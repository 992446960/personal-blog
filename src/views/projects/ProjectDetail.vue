<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Project } from '@/types/project'

const route = useRoute()
const router = useRouter()
const projects = ref<Project[]>([])

const projectId = computed(() => route.params.id as string)

import('@/data/projects.json')
  .then((m) => {
    projects.value = (m.default as Project[]) ?? []
  })
  .catch(() => {
    projects.value = []
  })

const project = computed(() =>
  projects.value.find((p) => p.id === projectId.value)
)

function goBack() {
  router.push('/projects')
}
</script>

<template>
  <div class="page-content">
    <template v-if="project">
      <div class="detail-header">
        <button type="button" class="sbtn" @click="goBack">← 返回列表</button>
      </div>
      <div
        class="pcov large"
        :style="{
          background: `linear-gradient(140deg, ${project.color1 ?? 'var(--accent)'}22, ${project.color2 ?? '#b8aeff'}33)`,
        }"
      >
        <div
          class="pclbl large"
          :style="{ color: project.color1 ?? 'var(--accent)' }"
        >
          {{ project.title.charAt(0) }}
        </div>
      </div>
      <div class="pbody large">
        <div class="pmeta">
          <span class="ptype">{{ project.type }}</span>
          <span class="prole">{{ project.role }}</span>
          <span class="pdate">{{ project.date }}</span>
        </div>
        <h1 class="ptitle large">{{ project.title }}</h1>
        <p class="pdesc large">{{ project.desc }}</p>
        <div class="pstack">
          <span v-for="s in project.stack" :key="s" class="schp">{{ s }}</span>
        </div>
        <div class="plinks">
          <a
            v-if="project.demo && project.demo !== '#'"
            :href="project.demo"
            target="_blank"
            rel="noopener noreferrer"
            class="plink l-demo"
          >
            🔗 在线 Demo
          </a>
          <a
            v-if="project.src && project.src !== '#'"
            :href="project.src"
            target="_blank"
            rel="noopener noreferrer"
            class="plink l-src"
          >
            ⌨ 源码
          </a>
        </div>
        <div v-if="project.detail" class="detail-content" v-html="project.detail" />
      </div>
    </template>
    <div v-else class="empty-state">
      <span class="em">📭</span>
      未找到该项目
      <button type="button" class="sbtn" style="margin-top: 12px" @click="goBack">
        返回列表
      </button>
    </div>
  </div>
</template>

<style scoped>
.detail-header {
  margin-bottom: 20px;
}

.pcov.large {
  height: 200px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.pclbl.large {
  font-size: 72px;
}

.pbody.large {
  padding: 0;
}

.ptitle.large {
  font-size: 28px;
  margin-bottom: 12px;
}

.pdesc.large {
  font-size: 15px;
  margin-bottom: 20px;
}

.pmeta,
.ptype,
.prole,
.pdate,
.pstack,
.schp,
.plinks,
.plink {
  /* reuse from list */
}

.detail-content {
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
  font-size: 14px;
  line-height: 1.8;
  color: var(--text2);
}

.detail-content :deep(a) {
  color: var(--accent);
}

.detail-content :deep(pre) {
  background: var(--bg3);
  padding: 14px;
  border-radius: 10px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 12px;
}
</style>
