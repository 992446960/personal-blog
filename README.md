# Personal Hub · 个人中心

Vue 3 + TypeScript + Vite 实现的个人中心 / 作品集站点，纯前端、可部署至 GitHub Pages。包含学习收藏、小工具集、项目展示。

## 功能

- **首页**：模块入口与简介
- **学习收藏**：CRUD、文件夹分类、标签/类型筛选、搜索；支持 **JSON 导入/导出**、**浏览器书签 HTML 导入**
- **小工具集**：Base64 编解码、JSON 格式化、颜色转换、时间戳转换、图片压缩、图片格式转换（共 6 个，配置驱动、按需懒加载）
- **项目展示**：从 `src/data/projects.json` 读取，列表 + 详情，支持按技术栈筛选
- **主题**：明/暗切换，持久化
- **国际化**：中/英切换（vue-i18n），持久化

## 技术栈

- Vue 3 (Composition API + `<script setup>`)
- TypeScript（严格模式）
- Vite
- Vue Router（Hash 模式，适配 GitHub Pages）
- Pinia
- vue-i18n

## 开发

```bash
npm install
npm run dev
```

## 构建与部署

```bash
npm run build
```

产物在 `dist/`。若部署到 GitHub Pages 子路径（如 `https://<user>.github.io/personal-blog/`），请设置环境变量或修改 `vite.config.ts` 中的 `base`：

```ts
base: '/personal-blog/',  // 与仓库名一致
```

部署时把 `dist` 内容推送到 `gh-pages` 分支，或使用 GitHub Actions 在 push 时自动构建并部署。

## 如何新增一个工具

1. 在 `src/views/tools/` 下新增工具页面组件（如 `XxxTool.vue`）。
2. 在 `src/config/tools.ts` 的 `toolsConfig` 中追加一项：
   - `id`：唯一标识，对应路由 `/tools/:id`
   - `nameKey`、`descriptionKey`：i18n 键，在 `src/i18n/index.ts` 的 `zh`/`en` 中补充文案
   - `icon`：列表展示用
   - `path`：`/tools/xxx`
   - `component`：`() => import('@/views/tools/XxxTool.vue')`
3. 路由已由 `toolsConfig` 动态生成，无需改 `router/index.ts`。

## 如何新增/修改项目展示

编辑 `src/data/projects.json`，每项字段说明：

| 字段       | 说明           |
|------------|----------------|
| id         | 唯一 ID，用于详情路由 |
| title      | 项目名称       |
| desc       | 简短描述       |
| type       | 类型（如 个人/实习/练习） |
| role       | 你的角色       |
| date       | 时间（如 2025.Q1） |
| stack      | 技术栈数组     |
| demo       | 在线 Demo 链接 |
| src        | 源码链接       |
| filters    | 筛选项（如 `["vue","ts"]`） |
| color1, color2 | 可选，卡片渐变色 |
| detail     | 可选，详情 HTML 片段 |

## 目录结构（简要）

```
src/
├── assets/styles/    # 全局样式与变量
├── components/layout/
├── config/           # nav、tools 配置
├── data/             # projects.json
├── i18n/
├── router/
├── stores/
├── types/
├── views/            # 页面与工具页
├── App.vue
└── main.ts
```

## License

MIT
