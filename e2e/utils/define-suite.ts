import { expect, type Page, test } from '@playwright/test'
import type { BiliCommentAdapter } from '../adapters'
import { setupTestEnv } from './setup'

const randomDelay = (min = 800, max = 4000) => {
  return new Promise((res) => setTimeout(res, Math.random() * (max - min) + min))
}

interface TestCase {
  name: string
  url: string
  /**
   * 是否需要在初始加载后刷新页面
   */
  refresh?: boolean
  setup?: (page: Page) => Promise<void> | void
  verify?: (page: Page) => Promise<void> | void
}

export function defineTestSuite(
  suiteName: string,
  Adapter: new (page: Page) => BiliCommentAdapter,
  cases: TestCase[],
) {
  test.describe(suiteName, () => {
    test.beforeEach(async ({ context, page }) => {
      await setupTestEnv(page, context)
    })

    test.afterEach(async () => {
      // 随机延迟，避免请求过快被风控
      await randomDelay()
    })

    for (const { name, url, refresh, setup, verify } of cases) {
      test(name, async ({ page }) => {
        const adapter = new Adapter(page)
        await page.goto(url)

        // 判断并执行刷新逻辑
        if (refresh) {
          // goto 默认会等待 load 事件，所以这里直接 reload 是安全的
          await page.reload()
        }

        if (setup) {
          await setup(page)
        }

        // 等待评论区加载
        const commentApp = page.locator(adapter.commentAppSelector)
        await commentApp.scrollIntoViewIfNeeded()

        // 按最新排序
        await adapter.clickSort()

        // 获取第一条评论的 IP 属地
        const firstComment = adapter.getMainComment()
        const location = adapter.getLocationTag(firstComment)
        await expect(location).toHaveText(adapter.locationPattern, { timeout: 10000 })

        if (verify) {
          await verify(page)
        }
      })
    }
  })
}
