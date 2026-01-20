import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'
import packageJson from './package.json'

const FIRE_MONKEY = !!process.env.FIRE_MONKEY

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __FIRE_MONKEY__: FIRE_MONKEY,
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
                name: 'BiliReveal - 哔哩哔哩网页版显示 IP 属地' + (FIRE_MONKEY ? ' (FireMonkey)' : ''),
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
                ],
                'run-at': 'document-start',
                license: 'MIT',
                description:
                    '我不喜欢 IP 属地，但是你手机都显示了，为什么电脑不显示呢？在哔哩哔哩网页版大部分场景中显示 IP 属地。',
                require: FIRE_MONKEY
                    ? 'https://update.greasyfork.org/scripts/563333/1738147/Hook%20Vue3%20app%20-%20FireMonkey%20Compat.js'
                    : 'https://update.greasyfork.org/scripts/449444/1081400/Hook%20Vue3%20app.js',
            },
            build: {
                fileName: (packageJson.name ?? 'monkey') + (FIRE_MONKEY ? '.firemonkey' : '') + '.user.js',
            },
            generate: ({ userscript }) =>
                FIRE_MONKEY ? userscript.replace(/(\/\/ @grant)/, '// @inject-into  page\n$1') : userscript,
        }),
    ],
    build: {
        emptyOutDir: !FIRE_MONKEY,
    },
})
