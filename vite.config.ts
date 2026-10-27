import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite-plus'
import monkey from 'vite-plugin-monkey'
import strip from '@rollup/plugin-strip'
import packageJson from './package.json' with { type: 'json' }
import { SUPPORTED_LOCALES } from './src/utils/locale'
import { createUserscriptMetadata } from './build/userscript-metadata'

const LITE_VERSION = !!process.env.LITE_VERSION

const LOCALIZED_PAGE_MATCHES = [
  'https://www.bilibili.com/video/*',
  'https://www.bilibili.com/list/*',
  'https://www.bilibili.com/bangumi/play/*',
  'https://www.bilibili.com/v/topic/detail/*',
  'https://manga.bilibili.com/detail/*',
]

// https://vitejs.dev/config/
export default defineConfig({
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
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
        ...createUserscriptMetadata(LITE_VERSION),
        icon: 'https://www.bilibili.com/favicon.ico',
        namespace: 'http://zhangmaimai.com',
        author: 'MaxChang3',
        match: [
          'https://t.bilibili.com/*',
          'https://www.bilibili.com/opus/*',
          'https://space.bilibili.com/*',
          'https://www.bilibili.com/cheese/play/*',
          'https://www.bilibili.com/festival/*',
          'https://www.bilibili.com/blackboard/*',
          'https://www.bilibili.com/blackroom/ban/*',
          'https://www.bilibili.com/read/*',
          'https://www.bilibili.com/v/topic/detail*',
          'https://live.bilibili.com/*',
          ...LOCALIZED_PAGE_MATCHES.flatMap((pattern) => [
            pattern,
            ...SUPPORTED_LOCALES.map((locale) =>
              pattern.replace('.bilibili.com/', `.bilibili.com/${locale}/`),
            ),
          ]),
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
