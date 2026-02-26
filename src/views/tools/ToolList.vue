<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { toolsConfig } from '@/config/tools'

const { t } = useI18n()
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <div class="ph-left">
        <h2>{{ t('tools.title') }}</h2>
        <p>{{ t('tools.desc') }}</p>
      </div>
    </div>
    <div class="tgrid">
      <router-link
        v-for="(tool, i) in toolsConfig"
        :key="tool.id"
        :to="tool.path"
        class="tcard"
        :style="{ animationDelay: `${(i + 1) * 0.04 }s` }"
      >
        <div class="ticon" :style="{ background: 'var(--tbg)' }">
          {{ tool.icon }}
        </div>
        <div class="tname">{{ t(tool.nameKey) }}</div>
        <div class="tdesc">{{ t(tool.descriptionKey) }}</div>
        <span class="tstatus s-ready">● {{ t('tools.ready') }}</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.tgrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 13px;
}

.tcard {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 13px;
  padding: 22px;
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  animation: fadeUp 0.4s ease both;
  text-decoration: none;
  color: inherit;
  display: block;
}

.tcard:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
  border-color: var(--border2);
}

.ticon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  margin-bottom: 13px;
}

.tname {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 5px;
}

.tdesc {
  font-size: 11px;
  color: var(--text2);
  line-height: 1.7;
  margin-bottom: 12px;
}

.tstatus {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 3px 8px;
  border-radius: 4px;
  font-family: var(--font-display);
  display: inline-block;
}

.s-ready {
  background: rgba(62, 207, 142, 0.1);
  color: var(--a2);
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 600px) {
  .tgrid {
    grid-template-columns: 1fr;
  }
  .tcard {
    padding: 20px;
    min-height: 44px;
  }
}
</style>
