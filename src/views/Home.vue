<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useBookmarksStore } from '@/stores/bookmarks'
import { toolsConfig } from '@/config/tools'

const { t } = useI18n()
const bookmarksStore = useBookmarksStore()
const projectCount = 4
</script>

<template>
  <section class="home">
    <div class="hero">
      <div class="hero-grid">
        <div class="fade-up">
          <div class="hero-kicker">{{ t('home.kicker') }}</div>
          <h1 class="hero-title">
            {{ t('home.title') }}<br /><span class="line2">{{ t('home.title2') }}</span>
          </h1>
          <p class="hero-desc">{{ t('home.desc') }}</p>
          <div class="hero-tags">
            <span class="tag">Vue 3</span>
            <span class="tag">TypeScript</span>
            <span class="tag">Vite</span>
            <span class="tag g">GitHub Pages</span>
            <span class="tag y">全工具可用</span>
          </div>
          <div class="hero-actions">
            <router-link to="/projects" class="btn-p">{{ t('home.viewProjects') }} →</router-link>
            <router-link to="/tools" class="btn-s">{{ t('home.exploreTools') }}</router-link>
          </div>
        </div>
        <div class="hero-card">
          <div class="card-av">D</div>
          <div class="card-name">Developer</div>
          <div class="card-role">前端工程师 · Vue 3 专注者</div>
          <div class="stat-grid">
            <div class="stat-item">
              <span class="stat-num">{{ bookmarksStore.count }}</span>
              <span class="stat-label">收藏</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ toolsConfig.length }}</span>
              <span class="stat-label">小工具</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ projectCount }}</span>
              <span class="stat-label">项目</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mq-wrap">
      <div class="mq-track">
        <span class="mq-item">Vue 3</span>
        <span class="mq-item">TypeScript</span>
        <span class="mq-item">Vite</span>
        <span class="mq-item">Pinia</span>
        <span class="mq-item">Vue Router</span>
        <span class="mq-item">IndexedDB</span>
        <span class="mq-item">GitHub Pages</span>
        <span class="mq-item">i18n</span>
        <span class="mq-item">Canvas API</span>
        <span class="mq-item">Web Workers</span>
        <span class="mq-item">Vue 3</span>
        <span class="mq-item">TypeScript</span>
        <span class="mq-item">Vite</span>
      </div>
    </div>
    <div class="mod-sec">
      <div class="sec-label">{{ t('home.modules') }}</div>
      <div class="sec-title">{{ t('home.modulesTitle') }}</div>
      <p class="sec-desc">{{ t('home.modulesDesc') }}</p>
      <div class="mod-grid">
        <router-link to="/bookmarks" class="mod-card">
          <div class="mod-icon" style="background: rgba(124,106,247,.12)">🔖</div>
          <div class="mod-name">{{ t('home.moduleBookmarks') }}</div>
          <div class="mod-desc">{{ t('home.moduleBookmarksDesc') }}</div>
          <div class="mod-meta">
            <span class="mod-count">{{ bookmarksStore.count }} ITEMS</span>
            <span class="arr">→</span>
          </div>
        </router-link>
        <router-link to="/tools" class="mod-card">
          <div class="mod-icon" style="background: rgba(62,207,142,.12)">🛠</div>
          <div class="mod-name">{{ t('home.moduleTools') }}</div>
          <div class="mod-desc">{{ t('home.moduleToolsDesc') }}</div>
          <div class="mod-meta">
            <span class="mod-count">{{ toolsConfig.length }} TOOLS</span>
            <span class="arr">→</span>
          </div>
        </router-link>
        <router-link to="/projects" class="mod-card">
          <div class="mod-icon" style="background: rgba(247,194,106,.12)">📦</div>
          <div class="mod-name">{{ t('home.moduleProjects') }}</div>
          <div class="mod-desc">{{ t('home.moduleProjectsDesc') }}</div>
          <div class="mod-meta">
            <span class="mod-count">{{ projectCount }} PROJECTS</span>
            <span class="arr">→</span>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 72px 40px 52px;
  max-width: 1100px;
  margin: 0 auto;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 368px;
  gap: 56px;
  align-items: center;
}

.hero-kicker {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-kicker::before {
  content: '';
  width: 24px;
  height: 1.5px;
  background: var(--accent);
  display: block;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(38px, 5.5vw, 64px);
  font-weight: 800;
  line-height: 1.01;
  letter-spacing: -0.035em;
  color: var(--text);
  margin-bottom: 22px;
}

.hero-title .line2 {
  display: block;
  background: linear-gradient(130deg, var(--accent) 0%, #c4baff 60%, var(--a2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 15px;
  color: var(--text2);
  max-width: 480px;
  line-height: 1.85;
  margin-bottom: 32px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 36px;
}

.tag {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  background: var(--tbg);
  color: var(--tcolor);
  letter-spacing: 0.04em;
  transition: all 0.15s;
  cursor: default;
}

.tag.g {
  background: rgba(62, 207, 142, 0.1);
  color: var(--a2);
}

.tag.y {
  background: rgba(247, 194, 106, 0.1);
  color: var(--a3);
}

.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-p,
.btn-s {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 20px;
  box-sizing: border-box;
}

.hero-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 26px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.14);
  animation: fadeUp 0.5s var(--ease-out) 0.15s both;
}

.hero-card::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--aglow) 0%, transparent 70%);
  pointer-events: none;
}

.card-av {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: linear-gradient(135deg, var(--accent), #c4baff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 18px;
}

.card-name {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 3px;
}

.card-role {
  font-size: 12px;
  color: var(--text2);
  margin-bottom: 18px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 16px;
}

.stat-item {
  background: var(--bg3);
  border-radius: 10px;
  padding: 13px 10px;
  text-align: center;
  transition: background 0.15s;
}

.stat-num {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 800;
  color: var(--text);
  display: block;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 10px;
  color: var(--text3);
  letter-spacing: 0.03em;
}

.mq-wrap {
  padding: 24px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  overflow: hidden;
  mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.mq-track {
  display: flex;
  gap: 28px;
  white-space: nowrap;
  animation: mq 22s linear infinite;
}

.mq-track:hover {
  animation-play-state: paused;
}

.mq-item {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text3);
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.mq-item::after {
  content: '·';
  color: var(--accent);
  font-size: 16px;
}

@keyframes mq {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.mod-sec {
  padding: 52px 40px;
  max-width: 1100px;
  margin: 0 auto;
}

.sec-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}

.sec-title {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
  margin-bottom: 7px;
}

.sec-desc {
  font-size: 13px;
  color: var(--text2);
  margin-bottom: 36px;
}

.mod-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

.mod-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 26px;
  cursor: pointer;
  transition: all 0.25s var(--ease-out);
  position: relative;
  overflow: hidden;
}

.mod-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.14);
}

.mod-card:hover::after {
  border-color: var(--accent);
}

.mod-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 1.5px solid transparent;
  transition: border-color 0.25s;
  pointer-events: none;
}

.mod-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  margin-bottom: 14px;
}

.mod-name {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 5px;
}

.mod-desc {
  font-size: 12px;
  color: var(--text2);
  line-height: 1.7;
  margin-bottom: 14px;
}

.mod-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mod-count {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 600;
  color: var(--text3);
  letter-spacing: 0.06em;
}

.arr {
  width: 27px;
  height: 27px;
  border-radius: 8px;
  background: var(--bg3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text3);
  transition: all 0.2s;
}

.mod-card:hover .arr {
  background: var(--accent);
  color: #fff;
  transform: translateX(3px);
}

.fade-up {
  opacity: 0;
  transform: translateY(18px);
  animation: fadeUp 0.5s var(--ease-out) 0.08s both;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-card {
    display: none;
  }
  .hero,
  .mod-sec {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (max-width: 600px) {
  .hero {
    padding: 48px 16px 36px;
  }
  .mod-sec {
    padding: 36px 16px 52px;
  }
}
</style>
