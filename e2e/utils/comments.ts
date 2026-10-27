import { expect, type Page } from '@playwright/test'

/** 选择有非置顶评论的动态，避免空评论区或仅有置顶评论的动态。 */
export const openDynamicComments = async (page: Page) => {
  const actions = page
    .locator('.bili-dyn-action.comment')
    .filter({ hasText: /^\s*[1-9]\d*(?:\.\d+)?[万亿]?\s*$/ })
  await actions.first().waitFor()

  for (let index = 0; index < (await actions.count()); index++) {
    const action = actions.nth(index)
    const [response] = await Promise.all([
      page.waitForResponse((response) =>
        /\/x\/v2\/reply\/(?:wbi\/)?main$/.test(new URL(response.url()).pathname),
      ),
      action.click(),
    ])
    const { code, data } = await response.json()
    expect(code, '动态评论接口应正常返回').toBe(0)
    if (data?.replies?.length) return

    await action.click()
  }

  throw new Error('当前动态列表没有包含非置顶评论的动态')
}
