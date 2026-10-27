import fs from 'node:fs'
import type { BrowserContext, Page } from '@playwright/test'

const getBiliCookies = () => {
  const raw = process.env.RAW_COOKIES
  if (!raw) throw new Error('RAW_COOKIES environment variable is missing')

  return raw
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .map((pair) => {
      const [name, ...valueParts] = pair.split('=')
      return {
        name,
        value: valueParts.join('='),
        domain: '.bilibili.com',
        path: '/',
      }
    })
}

const userscriptShim = () => {
  Object.defineProperty(window, 'unsafeWindow', {
    value: window,
    configurable: true,
  })
}

const setAutoplayFalse = () => {
  localStorage.setItem(
    'bpx_player_profile',
    JSON.stringify({
      media: { autoplay: false },
    }),
  )
}

const getUserscriptContent = () => {
  const userscriptPath = new URL('../../dist/bilireveal.lite.user.js', import.meta.url)

  if (!fs.existsSync(userscriptPath)) {
    throw new Error('Missing dist/bilireveal.lite.user.js. Run pnpm build before e2e tests.')
  }

  return fs.readFileSync(userscriptPath, 'utf-8')
}

export const setupTestEnv = async (page: Page, context: BrowserContext) => {
  await context.addCookies(getBiliCookies())
  // 多个 addInitScript 的执行顺序不确定，脚本必须在 unsafeWindow 初始化后执行。
  await page.addInitScript({
    content: `(${userscriptShim.toString()})();\n(${setAutoplayFalse.toString()})();\n${getUserscriptContent()}`,
  })
}
