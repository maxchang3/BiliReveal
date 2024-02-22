import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import monkey, { cdn } from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@/types', replacement: fileURLToPath(new URL('./src/@types', import.meta.url)) },
    ],
  },
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: "哔哩哔哩网页版展示 IP 属地",
        icon: 'https://www.bilibili.com/favicon.ico',
        namespace: 'http://zhangmaimai.com',
        author: "MaxChang3",
        match: [
          "https://www.bilibili.com/video/*",
          "https://www.bilibili.com/list/*",
          "https://www.bilibili.com/bangumi/play/*",
          "https://t.bilibili.com/*",
          "https://www.bilibili.com/opus/*",
          "https://space.bilibili.com/*",
          "https://www.bilibili.com/v/topic/detail/*",
          "https://www.bilibili.com/cheese/play/*",
          "https://www.bilibili.com/festival/*",
        ],
        "run-at": "document-body",
        "license": "MIT",
        "description": "我不喜欢 IP 属地，但是你手机都显示了，为什么电脑不显示呢？目前仅视频、动态评论区"
      },
    }),
  ],
})
