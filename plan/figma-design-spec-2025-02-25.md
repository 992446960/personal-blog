# Figma 设计规范摘要（前端实现用）

**来源**：Figma 文件 `4DHzqJpGDh3o2x3SWVi3y0`，节点 Page 1 → Dashboard  
**链接**：https://www.figma.com/design/4DHzqJpGDh3o2x3SWVi3y0/Untitled?node-id=0-1  
**提取方式**：Figma REST API 拉取文件 JSON 后解析  
**用途**：供另一 Agent 或开发者重写 HTML/CSS 时直接套用以下数值。

---

## 1. 布局结构

- **画布**：Dashboard 主画布 **1440×1364 px**，无全局 padding，子元素绝对/相对排布。
- **导航**：顶部 **Navigation** 全宽 **1440×64 px**，高度 64px 固定。
- **主内容区**（自上而下）：
  - **工具栏行**（导航下约 32px gap）：左侧 **Search** 405×40 px，右侧 **Segmented control** 167×40 px；二者水平排列，中间留白。
  - **卡片行**：**Cards** 容器 1279×172 px，内部 **HORIZONTAL** 布局，**itemSpacing = 32 px**；单卡 **405×172 px**，共 3 列等价卡片。
  - **第一内容行**（与卡片行间距约 32px）：**Line cart** 733×448 px（左） + **List** 515×448 px（右）；两列，中间列间距建议 **32 px**。
  - **第二内容行**（与上一行间距约 32px）：**Bar chart** 733×448 px（左） + **List** 515×448 px（右）；同样两列，列间距 32 px。
- **列表/表格**：表头行（Source / Sessions / Change）与数据行；数据行 **List** 为 **VERTICAL**，**itemSpacing = 0**；内部每行 **Frame** 高度 48 px。
- **People 列表**：**VERTICAL**，**itemSpacing = 16 px**，容器 **padding 24 px**；每行 **Conversation** **HORIZONTAL**，**spacing 16 px**，**padding 12 px 0**；头像 **Avatar** 48×48 px。
- **图表**：X Axis 为 **HORIZONTAL**，**itemSpacing ≈ 73 px**；Y Axis 为 **VERTICAL**，**itemSpacing ≈ 35 px**；网格线（Lines）**VERTICAL**，**itemSpacing 54 px**；柱状图 Bar 单条宽 32 px，**Bar list** 水平 **itemSpacing 19 px**。

**对齐与间距约定**：
- Section 之间垂直 **gap ≈ 32 px**。
- 主内容区与左右边距：从 Cards 总宽 1279 与画布 1440 推算，左右约 **80 px** 留白（或 81 px）可使内容居中。
- 导航与工具栏、工具栏与卡片、卡片与图表区之间均约 **32 px** 垂直间距。

---

## 2. 配色（HEX / RGB）

| 用途           | HEX     | RGB (0–255)        | 说明           |
|----------------|---------|--------------------|----------------|
| 背景（页面）   | `#ffffff` | rgb(255,255,255)   | 主画布         |
| 卡片/容器底   | `#ffffff` | rgb(255,255,255)   | 与背景同，靠阴影区分 |
| 主文字         | `#000000` | rgb(0,0,0)        | 标题、主内容   |
| 次要文字       | `#828282` | rgb(130,130,130)   | 表头、说明     |
| 辅助/弱化文字 | `#454545` | rgb(69,69,69)      | 如列表副文案   |
| 主色/强调蓝   | `#4285f4` | rgb(66,133,244)    | 链接、主按钮   |
| 强调绿         | `#34a853` | rgb(52,168,83)     | 正向、成功     |
| 强调红         | `#eb4335` | rgb(235,67,53)     | 负向、错误     |
| 强调黄         | `#fbbc05` | rgb(251,188,5)     | 警告等         |
| 边框/分割线   | `#e6e6e6` | rgb(230,230,230)   | 1px 线         |
| 边框/分割线 2 | `#eeeeee` | rgb(238,238,238)   | 略浅线         |
| 占位/禁用     | `#d9d9d9` | rgb(217,217,217)   |                |
| 输入框/浅底   | `#f5f5f5` | rgb(245,245,245)   |                |
| 浅灰背景       | `#f7f7f7` | rgb(247,247,247)   |                |
| 深色标题       | `#1e1e1e` | rgb(30,30,30)      | 可选深色标题   |
| 透明           | `transparent` / rgba(0,0,0,0) | 无填充       |

---

## 3. 字体

- **字体族**：全文 **Inter**（无衬线）。
- **字重**：400（正文）、500（小标题/列表主项）、600（标题/表头）。
- **字号与行高**（px，可直接用于 CSS `font-size` / `line-height`）：

| 用途         | 字号 (px) | 字重 | 行高 (px) | 备注     |
|--------------|-----------|------|-----------|----------|
| 大标题       | 40        | 600  | 44        |          |
| 标题 H1      | 34        | 600  | 37.4      |          |
| 标题 H2      | 32        | 600  | 32 或 48  | 设计中有两种 |
| 标题 H3      | 24        | 600  | 36        |          |
| 小标题       | 20        | 500/600 | 30     |          |
| 正文/列表主  | 16        | 400/500 | 24     | 最常用   |
| 图表轴/辅助  | 13        | 400  | 19.5      |          |
| 小字/标签    | 12        | 600  | 16        |          |

- **对齐**：标题与正文多为 **LEFT**，表头与图表轴有 **CENTER**、**RIGHT**。
- **rem 换算**：若根字体 16px，则 16px=1rem，24px=1.5rem，32px=2rem，40px=2.5rem。

---

## 4. 圆角、阴影、边框

- **圆角 (border-radius)**  
  - 卡片/面板/图表容器/列表容器：**8 px**  
  - 按钮/分段控件单格（Item 1）：**4 px**  
  - 头像：**50%**（Figma 中 1000 表示全圆）

- **阴影 (box-shadow)**  
  卡片、List、Line cart、Bar chart 等容器统一：
  - `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);`  
  - 对应 Figma：DROP_SHADOW，offset (0, 4)，radius 12，颜色 black α≈0.04。

- **边框 (border)**  
  - 设计稿中线条多为 1px；颜色见上表（如 `#e6e6e6`）。  
  - 描边粗细：常见 **1 px**，少数 2px、4px（用于强调或图标）。

---

## 5. 关键组件尺寸与间距

| 组件/区域       | 尺寸 (W×H)   | padding               | 圆角 | 备注           |
|-----------------|--------------|------------------------|------|----------------|
| Navigation      | 1440×64      | —                      | —    | 导航高度 64px  |
| Search          | 405×40       | 8 12 8 16 (T R B L)    | 8px  | 搜索框         |
| Segmented control | 167×40    | 4 (四周)               | 8px  | 分段控件       |
| Segment Item    | 约 53×32     | 12 12 (左右)           | 4px  | 单段           |
| Cards 容器      | 1279×172     | —                      | —    | 卡片间距 32px  |
| 单张 Card       | 405×172      | 24 (四边)              | 8px  | itemSpacing 16 |
| Bar chart / List / Line cart | 733×448 或 515×448 | 部分 0，List 有 24 | 8px | 内容块 |
| List（People）  | 515×448      | 24 (四边)              | 8px  | itemSpacing 16 |
| Conversation 行| 467×72       | 12 0 (上下)            | —    | 头像 48×48     |
| Avatar          | 48×48        | —                      | 50%  | 圆形           |
| 表格行高        | —×48        | —                      | —    | 数据行         |
| 图表 Bar 单条   | 32×可变      | —                      | —    | 柱间距 19px    |

**间距小结**：
- Section 间垂直 gap：**32 px**  
- 卡片之间（Cards 内）：**32 px**  
- 列表项之间（People）：**16 px**  
- 卡片内边距：**24 px**  
- 搜索框内边距：上下 8px，左 12px，右 16px  
- 分段控件内边距：**4 px**；分段项左右 **12 px**

---

## 6. 可直接复用的 CSS 变量建议

```css
:root {
  /* 颜色 */
  --color-bg: #ffffff;
  --color-text: #000000;
  --color-text-secondary: #828282;
  --color-text-tertiary: #454545;
  --color-primary: #4285f4;
  --color-success: #34a853;
  --color-error: #eb4335;
  --color-warning: #fbbc05;
  --color-border: #e6e6e6;
  --color-border-light: #eeeeee;
  --color-fill: #f5f5f5;

  /* 字体 */
  --font-family: "Inter", sans-serif;
  --text-title: 600 16px/24px var(--font-family);
  --text-body: 400 16px/24px var(--font-family);
  --text-caption: 400 13px/19.5px var(--font-family);
  --text-small: 600 12px/16px var(--font-family);

  /* 圆角与阴影 */
  --radius-card: 8px;
  --radius-button: 4px;
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.04);

  /* 间距 */
  --gap-section: 32px;
  --gap-card: 32px;
  --padding-card: 24px;
  --nav-height: 64px;
}
```

---

以上规范均从 Figma 文件 JSON 中提取，可直接用于前端实现或交给 Agent 重写 HTML/CSS。若需某一块的原始节点数据，可基于 `plan/figma-file-raw.json` 再查具体 node id。
