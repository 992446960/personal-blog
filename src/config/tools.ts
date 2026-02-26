/** 工具注册项：用于列表展示与路由 */
export interface ToolConfig {
  id: string
  nameKey: string
  descriptionKey: string
  icon: string
  path: string
  /** 懒加载的组件名，与 router 中 name 一致 */
  component: () => Promise<{ default: unknown }>
}

export const toolsConfig: ToolConfig[] = [
  {
    id: 'base64',
    nameKey: 'tools.base64.name',
    descriptionKey: 'tools.base64.desc',
    icon: '🔡',
    path: '/tools/base64',
    component: () => import('@/views/tools/Base64Tool.vue'),
  },
  {
    id: 'json',
    nameKey: 'tools.json.name',
    descriptionKey: 'tools.json.desc',
    icon: '{}',
    path: '/tools/json',
    component: () => import('@/views/tools/JsonFormatTool.vue'),
  },
  {
    id: 'color',
    nameKey: 'tools.color.name',
    descriptionKey: 'tools.color.desc',
    icon: '🎨',
    path: '/tools/color',
    component: () => import('@/views/tools/ColorConvertTool.vue'),
  },
  {
    id: 'timestamp',
    nameKey: 'tools.timestamp.name',
    descriptionKey: 'tools.timestamp.desc',
    icon: '⏱',
    path: '/tools/timestamp',
    component: () => import('@/views/tools/TimestampTool.vue'),
  },
  {
    id: 'image-compress',
    nameKey: 'tools.imageCompress.name',
    descriptionKey: 'tools.imageCompress.desc',
    icon: '🖼',
    path: '/tools/image-compress',
    component: () => import('@/views/tools/ImageCompressTool.vue'),
  },
  {
    id: 'image-convert',
    nameKey: 'tools.imageConvert.name',
    descriptionKey: 'tools.imageConvert.desc',
    icon: '🔄',
    path: '/tools/image-convert',
    component: () => import('@/views/tools/ImageConvertTool.vue'),
  },
  {
    id: 'cipher',
    nameKey: 'tools.cipher.name',
    descriptionKey: 'tools.cipher.desc',
    icon: '🔐',
    path: '/tools/cipher',
    component: () => import('@/views/tools/CipherTool.vue'),
  },
]
