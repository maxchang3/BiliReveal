import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite-plus'
import monkey from 'vite-plugin-monkey'
import strip from '@rollup/plugin-strip'
import packageJson from './package.json' with { type: 'json' }

const LITE_VERSION = !!process.env.LITE_VERSION

// https://vitejs.dev/config/
export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    semi: false,
    singleQuote: true,
  },
  define: {
    __LITE_VERSION__: LITE_VERSION,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'BiliReveal - 哔哩哔哩网页版显示 IP 属地' + (LITE_VERSION ? ' (Lite)' : ''),
        description:
          '我不喜欢 IP 属地，但是你手机都显示了，为什么电脑不显示呢？在哔哩哔哩网页版大部分场景中显示 IP 属地。',
        icon: 'https://www.bilibili.com/favicon.ico',
        namespace: 'http://zhangmaimai.com',
        author: 'MaxChang3',
        match: [
          'https://www.bilibili.com/video/*',
          'https://www.bilibili.com/list/*',
          'https://www.bilibili.com/bangumi/play/*',
          'https://t.bilibili.com/*',
          'https://www.bilibili.com/opus/*',
          'https://space.bilibili.com/*',
          'https://www.bilibili.com/v/topic/detail/*',
          'https://www.bilibili.com/cheese/play/*',
          'https://www.bilibili.com/festival/*',
          'https://www.bilibili.com/blackboard/*',
          'https://www.bilibili.com/blackroom/ban/*',
          'https://www.bilibili.com/read/*',
          'https://manga.bilibili.com/detail/*',
          'https://www.bilibili.com/v/topic/detail*',
          'https://live.bilibili.com/*',
        ],
        'run-at': 'document-start',
        license: 'MIT',
      },
      build: {
        fileName: (packageJson.name ?? 'monkey') + (LITE_VERSION ? '.lite' : '') + '.user.js',
      },
      generate: ({ userscript }) =>
        LITE_VERSION
          ? userscript.replace(/(\/\/ @grant)/, '// @inject-into  page\n$1')
          : userscript,
    }),
    strip({
      include: ['**/*.ts'],
      functions: LITE_VERSION ? ['logger.*'] : [],
    }),
  ],
  build: {
    emptyOutDir: !LITE_VERSION,
  },
})
